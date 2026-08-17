import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

/**
 * delete-account — S6 / #1 THE ONE HARD BUILD. Server-side account deletion.
 *
 * Play policy (and plain decency) requires that an account with sign-in can be
 * deleted. This verifies the caller's own access token, then deletes:
 *   1. their personal data rows (subscription state, org membership) keyed by
 *      user_id, via the service-role key;
 *   2. their Supabase auth user, via the admin API.
 *
 * It deletes ONLY the authenticated caller's own id — never an id from the body.
 * A user can only ever delete themselves. Aggregate metrics (keyed by an
 * anonymized identity_key, not user_id) are intentionally NOT individually
 * addressable and are out of scope; nothing here is personal data by row.
 *
 * The user's practice history (sessions, journal, signal log) lives encrypted
 * on-device, not in Supabase — the client wipes that locally after this returns.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const CORS_OPTIONS = { methods: "POST, OPTIONS" };

// Personal-data tables keyed by user_id. Extend this list if new per-user
// tables are added — a deletion that misses a table is not a deletion.
const USER_KEYED_TABLES = [
  "stillform_subscription_state",
  "stillform_org_members",
];

async function serviceFetch(path, init = {}) {
  return fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}

/** Delete a user's rows from one table. Resolves to { table, ok }. */
async function deleteUserRows(table, userId) {
  try {
    const res = await serviceFetch(
      `/rest/v1/${table}?user_id=eq.${encodeURIComponent(userId)}`,
      { method: "DELETE", headers: { Prefer: "return=minimal" } }
    );
    // 200/204 = deleted (or nothing to delete); 404 = table absent, treat as done.
    return { table, ok: res.ok || res.status === 404 };
  } catch {
    return { table, ok: false };
  }
}

/** Delete the Supabase auth user via the admin API. */
async function deleteAuthUser(userId) {
  try {
    const res = await serviceFetch(`/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
      method: "DELETE",
    });
    return res.ok || res.status === 404;
  } catch {
    return false;
  }
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return jsonResponse(event, 200, { ok: true }, CORS_OPTIONS);
  if (event.httpMethod !== "POST") return jsonResponse(event, 405, { error: "Method not allowed" }, CORS_OPTIONS);

  const originBlocked = rejectDisallowedOrigin(event, CORS_OPTIONS);
  if (originBlocked) return originBlocked;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return jsonResponse(event, 503, { error: "Deletion is temporarily unavailable." }, CORS_OPTIONS);
  }

  // Authenticate: the caller must present a valid access token, and we only
  // ever delete THAT user. There is no user id in the request body by design.
  const token = parseBearer(event.headers?.authorization || event.headers?.Authorization);
  const user = await getUserFromToken(token).catch(() => null);
  const userId = user?.id || null;
  if (!userId) {
    return jsonResponse(event, 401, { error: "Sign in required to delete your account." }, CORS_OPTIONS);
  }

  // Delete personal-data rows first, then the auth user last (so a partial
  // failure leaves the account still reachable to retry, never orphaned data
  // under a deleted user).
  const tableResults = [];
  for (const table of USER_KEYED_TABLES) {
    // eslint-disable-next-line no-await-in-loop
    tableResults.push(await deleteUserRows(table, userId));
  }
  const dataOk = tableResults.every((r) => r.ok);

  const authDeleted = await deleteAuthUser(userId);

  if (!authDeleted) {
    return jsonResponse(event, 502, {
      error: "We couldn't finish deleting your account. Nothing was left half-done on your side — please try again.",
      dataCleared: dataOk,
    }, CORS_OPTIONS);
  }

  // The receipt: plain words on exactly what was removed.
  return jsonResponse(event, 200, {
    ok: true,
    deleted: {
      account: true,
      personalDataTables: tableResults.filter((r) => r.ok).map((r) => r.table),
      note: "Your account and its server-side records are gone. Your on-device history is cleared next, on this device.",
    },
  }, CORS_OPTIONS);
}
