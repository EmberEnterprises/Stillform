import {
  requireOrgAdmin,
  listOrgMembers,
  listPendingInvites
} from "./_organizationState.js";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

// ─────────────────────────────────────────────────────────────────────────
// organization-list-members
// ─────────────────────────────────────────────────────────────────────────
//
// Admin only. Returns the seat-management view of an org's membership:
//   - Active members: id, user_id, email, role, status, invited_at,
//     joined_at, removed_at
//   - Pending invites: id, email, role, invited_by_user_id, created_at,
//     expires_at (no invite_token — admins re-send via email if needed)
//
// CONTAINS ZERO PRACTICE DATA. By construction this endpoint only
// queries stillform_org_members and stillform_org_invites.
//
// Query: ?org_id=...&include_removed=1
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

    const orgId = event.queryStringParameters?.org_id;
    if (!orgId) return jsonResponse(event, 400, { error: "org_id required" }, CORS_OPTIONS);
    const includeRemoved = event.queryStringParameters?.include_removed === "1";

    const adminMembership = await requireOrgAdmin({ orgId, userId: user.id });
    if (!adminMembership) return jsonResponse(event, 403, { error: "Not an admin of this org" }, CORS_OPTIONS);

    const [members, pendingInvites] = await Promise.all([
      listOrgMembers(orgId, { includeRemoved }),
      listPendingInvites(orgId)
    ]);

    return jsonResponse(event, 200, {
      ok: true,
      members,
      pending_invites: pendingInvites
    }, CORS_OPTIONS);
  } catch (error) {
    const message = error?.message || "unknown";
    console.error("organization-list-members-failed", { message });
    return jsonResponse(event, 500, { error: "Failed to list members" }, CORS_OPTIONS);
  }
}
