import {
  requireOrgAdmin,
  createInvite,
  revokeInvite,
  extractRequestMeta
} from "./_organizationState.js";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

// ─────────────────────────────────────────────────────────────────────────
// organization-invite
// ─────────────────────────────────────────────────────────────────────────
//
// Admin only.
//
//   POST   { action: "create", org_id, email, role? }   → creates invite
//   POST   { action: "revoke", org_id, invite_id }      → revokes invite
//
// Returns the invite row (create) or { ok, revoked: true } (revoke).
//
// The response from "create" includes the invite_token; the client uses
// it to compose the invite email (out of scope for the function itself).
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
    const { action, org_id } = body;
    if (!org_id) return jsonResponse(event, 400, { error: "org_id required" }, CORS_OPTIONS);
    if (!action || !["create", "revoke"].includes(action)) {
      return jsonResponse(event, 400, { error: "action must be 'create' or 'revoke'" }, CORS_OPTIONS);
    }

    const adminMembership = await requireOrgAdmin({ orgId: org_id, userId: user.id });
    if (!adminMembership) return jsonResponse(event, 403, { error: "Not an admin of this org" }, CORS_OPTIONS);

    const { ipAddress, userAgent } = extractRequestMeta(event);

    if (action === "create") {
      const invite = await createInvite({
        orgId: org_id,
        actorUserId: user.id,
        email: body.email,
        role: body.role || "member",
        ipAddress,
        userAgent
      });
      return jsonResponse(event, 200, { ok: true, invite }, CORS_OPTIONS);
    }

    // action === "revoke"
    if (!body.invite_id) return jsonResponse(event, 400, { error: "invite_id required" }, CORS_OPTIONS);
    const updated = await revokeInvite({
      inviteId: body.invite_id,
      actorUserId: user.id,
      ipAddress,
      userAgent
    });
    return jsonResponse(event, 200, { ok: true, invite: updated, revoked: true }, CORS_OPTIONS);
  } catch (error) {
    const message = error?.message || "unknown";
    console.error("organization-invite-failed", { message });
    const status = /required|invalid|already|limit|not found|expired|revoked|active/i.test(message) ? 400 : 500;
    return jsonResponse(event, status, { error: message }, CORS_OPTIONS);
  }
}
