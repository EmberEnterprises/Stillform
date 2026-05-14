import {
  requireOrgAdmin,
  removeMember,
  extractRequestMeta,
  getMembershipsForUser
} from "./_organizationState.js";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

// ─────────────────────────────────────────────────────────────────────────
// organization-remove-member
// ─────────────────────────────────────────────────────────────────────────
//
// Two allowed callers:
//
//   1. An admin of the org, removing any member (including themselves —
//      blocked at state-helper level if they're the last admin).
//   2. A non-admin member of the org, removing themselves (leaving the
//      org). Any other target by a non-admin is rejected.
//
// Body: { org_id, target_user_id }
// Returns { ok, membership: updated_row }.
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

    let body = {};
    try { body = JSON.parse(event.body || "{}"); } catch { return jsonResponse(event, 400, { error: "Invalid JSON" }, CORS_OPTIONS); }
    const { org_id, target_user_id } = body;
    if (!org_id) return jsonResponse(event, 400, { error: "org_id required" }, CORS_OPTIONS);
    if (!target_user_id) return jsonResponse(event, 400, { error: "target_user_id required" }, CORS_OPTIONS);

    const isSelfRemoval = target_user_id === user.id;

    if (!isSelfRemoval) {
      // Admins can remove other members.
      const adminMembership = await requireOrgAdmin({ orgId: org_id, userId: user.id });
      if (!adminMembership) return jsonResponse(event, 403, { error: "Not an admin of this org" }, CORS_OPTIONS);
    } else {
      // Self-removal: must be a current member of the org (admin or not).
      const memberships = await getMembershipsForUser(user.id);
      const isMember = memberships.some(({ org }) => org.id === org_id);
      if (!isMember) return jsonResponse(event, 403, { error: "Not a member of this org" }, CORS_OPTIONS);
    }

    const { ipAddress, userAgent } = extractRequestMeta(event);
    const updated = await removeMember({
      orgId: org_id,
      actorUserId: user.id,
      targetUserId: target_user_id,
      ipAddress,
      userAgent
    });

    return jsonResponse(event, 200, { ok: true, membership: updated }, CORS_OPTIONS);
  } catch (error) {
    const message = error?.message || "unknown";
    console.error("organization-remove-member-failed", { message });
    const status = /required|invalid|not found|last admin|promote/i.test(message) ? 400 : 500;
    return jsonResponse(event, status, { error: message }, CORS_OPTIONS);
  }
}
