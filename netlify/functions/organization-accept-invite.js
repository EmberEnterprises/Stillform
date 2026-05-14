import {
  acceptInvite,
  extractRequestMeta
} from "./_organizationState.js";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

// ─────────────────────────────────────────────────────────────────────────
// organization-accept-invite
// ─────────────────────────────────────────────────────────────────────────
//
// Authenticated user. Accepts a pending invite by token.
// Body: { invite_token }
//
// Enforces: token valid + unaccepted + unrevoked + unexpired; the
// authenticated user's email matches the invited email; org has seat
// capacity at the moment of accept.
//
// Returns { ok, org, membership, already_member }.
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
    const inviteToken = body.invite_token;
    if (!inviteToken) return jsonResponse(event, 400, { error: "invite_token required" }, CORS_OPTIONS);

    const { ipAddress, userAgent } = extractRequestMeta(event);
    const result = await acceptInvite({
      inviteToken,
      acceptingUserId: user.id,
      acceptingEmail: user.email,
      ipAddress,
      userAgent
    });

    return jsonResponse(event, 200, {
      ok: true,
      org: result.org,
      membership: result.membership,
      already_member: Boolean(result.alreadyMember)
    }, CORS_OPTIONS);
  } catch (error) {
    const message = error?.message || "unknown";
    console.error("organization-accept-invite-failed", { message });
    const status = /required|invalid|not found|expired|revoked|accepted|match|limit|active/i.test(message) ? 400 : 500;
    return jsonResponse(event, status, { error: message }, CORS_OPTIONS);
  }
}
