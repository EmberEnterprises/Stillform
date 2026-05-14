import {
  requireOrgAdmin,
  readAuditLog
} from "./_organizationState.js";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

// ─────────────────────────────────────────────────────────────────────────
// organization-audit-log
// ─────────────────────────────────────────────────────────────────────────
//
// Admin only. Returns paginated audit log entries for an org.
//
// Query: ?org_id=...&limit=50&before_id=12345&action=invite_sent
//
// Returns { ok, entries: [...], next_cursor: id|null }.
//
// The audit log records admin actions taken on the org surface itself —
// invites, member changes, settings updates. It does NOT log practice
// activity, and there is no path in code to do so.
// ─────────────────────────────────────────────────────────────────────────

const CORS_OPTIONS = { methods: "GET, OPTIONS" };

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return jsonResponse(event, 200, { ok: true }, CORS_OPTIONS);
  if (event.httpMethod !== "GET") return jsonResponse(event, 405, { error: "Method not allowed" }, CORS_OPTIONS);

  const originBlocked = rejectDisallowedOrigin(event, CORS_OPTIONS);
  if (originBlocked) return originBlocked;

  try {
    const token = parseBearer(event.headers?.authorization || event.headers?.Authorization || "");
    const user = await getUserFromToken(token);
    if (!user?.id) return jsonResponse(event, 401, { error: "Not authenticated" }, CORS_OPTIONS);

    const params = event.queryStringParameters || {};
    const orgId = params.org_id;
    if (!orgId) return jsonResponse(event, 400, { error: "org_id required" }, CORS_OPTIONS);

    const adminMembership = await requireOrgAdmin({ orgId, userId: user.id });
    if (!adminMembership) return jsonResponse(event, 403, { error: "Not an admin of this org" }, CORS_OPTIONS);

    const limit = params.limit ? Number(params.limit) : 50;
    const beforeId = params.before_id || null;
    const action = params.action || null;

    const result = await readAuditLog({ orgId, limit, beforeId, action });

    return jsonResponse(event, 200, {
      ok: true,
      entries: result.entries,
      next_cursor: result.next_cursor
    }, CORS_OPTIONS);
  } catch (error) {
    const message = error?.message || "unknown";
    console.error("organization-audit-log-failed", { message });
    return jsonResponse(event, 500, { error: "Failed to read audit log" }, CORS_OPTIONS);
  }
}
