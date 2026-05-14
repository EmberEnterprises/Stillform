import { buildOrgStatusForUser } from "./_organizationState.js";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

// ─────────────────────────────────────────────────────────────────────────
// organization-status
// ─────────────────────────────────────────────────────────────────────────
//
// Authenticated read endpoint. Returns the calling user's org memberships
// (if any), with the privacy guarantee message embedded.
//
// Used by the client to decide:
//   - Whether to surface "Member of [Org]" affiliation copy
//   - Whether to surface the admin dashboard entry point (role=admin)
//   - Whether to honor B2B billing semantics (no individual paywall)
//
// CONTAINS ZERO PRACTICE DATA. Never adds any field that reflects how
// the user uses Stillform. The privacy wall is enforced both here and
// at the schema layer.
//
// ─────────────────────────────────────────────────────────────────────────

const CORS_OPTIONS = { methods: "GET, OPTIONS" };

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(event, 200, { ok: true }, CORS_OPTIONS);
  }
  if (event.httpMethod !== "GET") {
    return jsonResponse(event, 405, { error: "Method not allowed" }, CORS_OPTIONS);
  }

  const originBlocked = rejectDisallowedOrigin(event, CORS_OPTIONS);
  if (originBlocked) return originBlocked;

  try {
    const token = parseBearer(
      event.headers?.authorization || event.headers?.Authorization || ""
    );
    const user = await getUserFromToken(token);
    const userId = user?.id || null;

    if (!userId) {
      // Unauthenticated callers get a "no org" answer rather than 401.
      // This keeps the client codepath identical whether signed in or not.
      return jsonResponse(event, 200, {
        ok: true,
        in_org: false,
        memberships: []
      }, CORS_OPTIONS);
    }

    const status = await buildOrgStatusForUser(userId);
    return jsonResponse(event, 200, status, CORS_OPTIONS);
  } catch (error) {
    console.error("organization-status-failed", {
      message: error?.message || "unknown"
    });
    return jsonResponse(event, 500, { error: "Organization status failed" }, CORS_OPTIONS);
  }
}
