import { jsonResponse, rejectDisallowedOrigin } from "./_httpSecurity.js";
import { sbAdminFetch, upsertSubscriptionByLemonId } from "./_subscriptionState.js";
import { createHash, timingSafeEqual } from "node:crypto";

/**
 * review-access — the store-reviewer sign-in (A5, Arlin 2026-09-14).
 *
 * Google Play (and later Apple) reviewers must be able to log in and see the
 * paid practice. Our sign-in is email + a one-time code that Supabase emails
 * — a reviewer can never receive it. So: ONE dedicated review account, whose
 * fixed code lives only in Netlify env (never in the bundle), exchanged here
 * for a REAL Supabase session via the admin API. Nothing else changes:
 *   - not a general bypass — only REVIEW_EMAIL with REVIEW_CODE, both env;
 *   - rate-limited per IP (5 attempts / 15 min) and constant-time compared;
 *   - the review user gets a real subscription row (source "review",
 *     status active, 180-day expiry) so gating treats it like any subscriber;
 *   - unset env = the endpoint is off (403 for everything).
 * Body: { email, code }. Returns the same session shape verifyCode expects.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "https://pxrewildfnbxlygjofpx.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const REVIEW_EMAIL = String(process.env.REVIEW_EMAIL || "").trim().toLowerCase();
const REVIEW_CODE = String(process.env.REVIEW_CODE || "").trim();

const CORS_OPTIONS = { methods: "POST, OPTIONS" };
const attempts = new Map(); // ip -> { count, resetAt }
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function tooMany(ip) {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now > rec.resetAt) { attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS }); return false; }
  rec.count += 1;
  return rec.count > MAX_ATTEMPTS;
}

function safeEqual(a, b) {
  const ha = createHash("sha256").update(String(a)).digest();
  const hb = createHash("sha256").update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return jsonResponse(event, 200, { ok: true }, CORS_OPTIONS);
  if (event.httpMethod !== "POST") return jsonResponse(event, 405, { error: "Method not allowed" }, CORS_OPTIONS);
  const originBlocked = rejectDisallowedOrigin(event, CORS_OPTIONS);
  if (originBlocked) return originBlocked;

  // Endpoint is dark unless both env values are set.
  if (!REVIEW_EMAIL || !REVIEW_CODE || !SERVICE_ROLE_KEY) {
    return jsonResponse(event, 403, { error: "review_access_disabled" }, CORS_OPTIONS);
  }

  const ip = event.headers?.["x-nf-client-connection-ip"] || event.headers?.["x-forwarded-for"] || "unknown";
  if (tooMany(ip)) return jsonResponse(event, 429, { error: "too_many_attempts" }, CORS_OPTIONS);

  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch { body = {}; }
  const email = String(body.email || "").trim().toLowerCase();
  const code = String(body.code || "").trim();
  if (!email || !code) return jsonResponse(event, 400, { error: "missing" }, CORS_OPTIONS);

  // Both must match; evaluate both to keep timing flat.
  const emailOk = safeEqual(email, REVIEW_EMAIL);
  const codeOk = safeEqual(code, REVIEW_CODE);
  if (!(emailOk && codeOk)) return jsonResponse(event, 401, { error: "invalid" }, CORS_OPTIONS);

  try {
    // 1. Mint a magic-link token for the review user (creates the user if absent).
    const linkRes = await sbAdminFetch("/auth/v1/admin/generate_link", {
      method: "POST",
      body: JSON.stringify({ type: "magiclink", email: REVIEW_EMAIL }),
    });
    const link = await linkRes.json().catch(() => null);
    const hashed = link?.hashed_token || link?.properties?.hashed_token;
    if (!linkRes.ok || !hashed) {
      console.error("review-access: generate_link failed", linkRes.status);
      return jsonResponse(event, 502, { error: "session_mint_failed" }, CORS_OPTIONS);
    }

    // 2. Exchange it server-side for a real session (no email round-trip).
    const verifyRes = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SERVICE_ROLE_KEY },
      body: JSON.stringify({ type: "magiclink", token_hash: hashed }),
    });
    const session = await verifyRes.json().catch(() => null);
    if (!verifyRes.ok || !session?.access_token) {
      console.error("review-access: verify failed", verifyRes.status);
      return jsonResponse(event, 502, { error: "session_exchange_failed" }, CORS_OPTIONS);
    }
    const userId = session.user?.id || null;

    // 3. Make sure the review account reads as subscribed (idempotent upsert).
    try {
      const endsAt = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString();
      await upsertSubscriptionByLemonId({
        lemonSubscriptionId: "review-account",
        userId,
        userEmail: REVIEW_EMAIL,
        status: "active",
        lemonStatus: "active",
        variantName: "Review",
        productName: "Stillform",
        eventName: "review_access",
        renewsAt: endsAt,
        endsAt,
      });
    } catch (e) {
      console.error("review-access: subscription upsert failed", e?.message);
      // Session still returned; status re-checks on next boot.
    }

    return jsonResponse(event, 200, {
      ok: true,
      access_token: session.access_token,
      refresh_token: session.refresh_token || null,
      expires_in: Number(session.expires_in) || 3600,
      user: { id: userId, email: REVIEW_EMAIL },
    }, CORS_OPTIONS);
  } catch (err) {
    console.error("review-access:", err?.message);
    return jsonResponse(event, 500, { error: "server_error" }, CORS_OPTIONS);
  }
}
