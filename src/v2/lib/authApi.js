/*
 * authApi.js — ACCOUNTS ARC A2 (June 2 2026)
 *
 * Email + 6-digit-code sign-in via Supabase GoTrue REST — plain fetch,
 * zero dependencies (matches the backend's getUserFromToken pattern).
 * The anon key below is Supabase's PUBLIC client key (public by design;
 * RLS + the authed functions are the security boundary, not this key).
 *
 * Storage: stillform_v2_auth →
 *   { access_token, refresh_token, expires_at, email, user_id }
 * NEVER included in backup snapshots (backupApi excludes it).
 *
 * Self-Mode law: every export fails soft — auth being down never touches
 * the practice. Callers treat null/false as "not signed in right now."
 */

const SUPABASE_URL = "https://pxrewildfnbxlygjofpx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4cmV3aWxkZm5ieGx5Z2pvZnB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTAxMDcsImV4cCI6MjA5MTMyNjEwN30.r3Pdm3XoZVPlUFgKCPLtfkSrHKIxVcwFW4tuUP23Vns";

export const AUTH_KEY = "stillform_v2_auth";

function readAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    const a = raw ? JSON.parse(raw) : null;
    return a && typeof a === "object" && a.access_token ? a : null;
  } catch {
    return null;
  }
}

function writeAuth(a) {
  try {
    if (a) localStorage.setItem(AUTH_KEY, JSON.stringify(a));
    else localStorage.removeItem(AUTH_KEY);
  } catch {
    /* non-fatal */
  }
}

async function gotrue(path, body) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  });
  let data = null;
  try { data = await res.json(); } catch { data = null; }
  return { ok: res.ok, status: res.status, data };
}

/**
 * Step 1: request a 6-digit code by email. Creates the account on first
 * sign-in (no separate signup).
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function requestCode(email) {
  const e = String(email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return { ok: false, error: "invalid_email" };
  try {
    const { ok, data } = await gotrue("/otp", { email: e, create_user: true });
    return ok ? { ok: true } : { ok: false, error: data?.msg || data?.error_description || "request_failed" };
  } catch {
    return { ok: false, error: "network" };
  }
}

/**
 * Step 2: verify the code. On success, persists the session.
 * @returns {Promise<{ok: boolean, email?: string, error?: string}>}
 */
export async function verifyCode(email, code) {
  const e = String(email || "").trim().toLowerCase();
  const t = String(code || "").trim();
  if (!e || !t) return { ok: false, error: "missing" };
  try {
    const { ok, data } = await gotrue("/verify", { type: "email", email: e, token: t });
    if (!ok || !data?.access_token) {
      return { ok: false, error: data?.msg || data?.error_description || "verify_failed" };
    }
    writeAuth({
      access_token: data.access_token,
      refresh_token: data.refresh_token || null,
      expires_at: Date.now() + (Number(data.expires_in) || 3600) * 1000,
      email: data.user?.email || e,
      user_id: data.user?.id || null,
    });
    return { ok: true, email: data.user?.email || e };
  } catch {
    return { ok: false, error: "network" };
  }
}

/**
 * Valid access token, refreshing if within 2 minutes of expiry.
 * @returns {Promise<string|null>}
 */
export async function getAccessToken() {
  const a = readAuth();
  if (!a) return null;
  if (a.expires_at && Date.now() < a.expires_at - 2 * 60 * 1000) return a.access_token;
  if (!a.refresh_token) return a.access_token || null;
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
      body: JSON.stringify({ refresh_token: a.refresh_token }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.access_token) {
      // Refresh failed — keep the old token (may still work briefly);
      // a 401 downstream reads as signed-out, never as a crash.
      return a.access_token || null;
    }
    writeAuth({
      ...a,
      access_token: data.access_token,
      refresh_token: data.refresh_token || a.refresh_token,
      expires_at: Date.now() + (Number(data.expires_in) || 3600) * 1000,
    });
    return data.access_token;
  } catch {
    return a.access_token || null;
  }
}

/** Current signed-in state (synchronous, no network). */
export function getAuthState() {
  const a = readAuth();
  return a ? { signedIn: true, email: a.email || null, userId: a.user_id || null } : { signedIn: false, email: null, userId: null };
}

/** Sign out: best-effort server revoke, then local clear (always succeeds). */
export async function signOut() {
  const a = readAuth();
  if (a?.access_token) {
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: "POST",
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${a.access_token}` },
      });
    } catch { /* best effort */ }
  }
  writeAuth(null);
  return { ok: true };
}
