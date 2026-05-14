import {
  createOrgWithAdmin,
  extractRequestMeta
} from "./_organizationState.js";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

// ─────────────────────────────────────────────────────────────────────────
// organization-create
// ─────────────────────────────────────────────────────────────────────────
//
// Authenticated. Creates a new organization with the caller as its owner
// admin. Body: { name, billing_email, plan_tier?, seat_limit? }
//
// Returns { ok, org, membership }.
// ─────────────────────────────────────────────────────────────────────────

const CORS_OPTIONS = { methods: "POST, OPTIONS" };

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return jsonResponse(event, 200, { ok: true }, CORS_OPTIONS);
  if (event.httpMethod !== "POST") return jsonResponse(event, 405, { error: "Method not allowed" }, CORS_OPTIONS);

  const originBlocked = rejectDisallowedOrigin(event, CORS_OPTIONS);
  if (originBlocked) return originBlocked;

  try {
    const token = parseBearer(event.headers?.authorization || event.headers?.Authorization || "");
    const user = await getUserFromToken(token);
    if (!user?.id) return jsonResponse(event, 401, { error: "Not authenticated" }, CORS_OPTIONS);
    if (!user.email) return jsonResponse(event, 400, { error: "Account email missing" }, CORS_OPTIONS);

    let body = {};
    try { body = JSON.parse(event.body || "{}"); } catch { return jsonResponse(event, 400, { error: "Invalid JSON" }, CORS_OPTIONS); }
    const { name, billing_email, plan_tier, seat_limit } = body;

    const { ipAddress, userAgent } = extractRequestMeta(event);
    const result = await createOrgWithAdmin({
      name,
      billingEmail: billing_email || user.email,
      planTier: plan_tier || "small_team",
      seatLimit: seat_limit,
      ownerUserId: user.id,
      ownerEmail: user.email,
      ipAddress,
      userAgent
    });

    return jsonResponse(event, 200, { ok: true, org: result.org, membership: result.membership }, CORS_OPTIONS);
  } catch (error) {
    const message = error?.message || "unknown";
    console.error("organization-create-failed", { message });
    const status = /required|invalid|valid/i.test(message) ? 400 : 500;
    return jsonResponse(event, status, { error: message }, CORS_OPTIONS);
  }
}
