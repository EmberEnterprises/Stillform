import {
  requireOrgAdmin,
  updateOrg,
  extractRequestMeta
} from "./_organizationState.js";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

// ─────────────────────────────────────────────────────────────────────────
// organization-update
// ─────────────────────────────────────────────────────────────────────────
//
// Admin only. Updates whitelisted org fields and writes audit entries.
// Body: { org_id, updates: { name?, plan_tier?, seat_limit?, sso_provider?,
//   sso_metadata?, auto_join_domain?, status? } }
//
// Returns { ok, org, changed: [audit_action, ...] }.
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
    const { org_id, updates } = body;
    if (!org_id) return jsonResponse(event, 400, { error: "org_id required" }, CORS_OPTIONS);
    if (!updates || typeof updates !== "object") return jsonResponse(event, 400, { error: "updates object required" }, CORS_OPTIONS);

    const adminMembership = await requireOrgAdmin({ orgId: org_id, userId: user.id });
    if (!adminMembership) return jsonResponse(event, 403, { error: "Not an admin of this org" }, CORS_OPTIONS);

    const { ipAddress, userAgent } = extractRequestMeta(event);
    const result = await updateOrg({
      orgId: org_id,
      actorUserId: user.id,
      updates,
      ipAddress,
      userAgent
    });

    return jsonResponse(event, 200, { ok: true, org: result.org, changed: result.changed }, CORS_OPTIONS);
  } catch (error) {
    const message = error?.message || "unknown";
    console.error("organization-update-failed", { message });
    const status = /required|invalid|below|seat_limit/i.test(message) ? 400 : 500;
    return jsonResponse(event, status, { error: message }, CORS_OPTIONS);
  }
}
