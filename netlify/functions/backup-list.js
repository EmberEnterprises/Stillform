/*
 * backup-list.js — ACCOUNTS ARC A1 (June 2 2026)
 * Authed list of the user's snapshots (metadata only — no payloads).
 */
import { sbAdminFetch } from "./_subscriptionState.js";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin,
} from "./_httpSecurity.js";

const CORS_OPTIONS = { methods: "POST, OPTIONS" };

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return jsonResponse(event, 200, { ok: true }, CORS_OPTIONS);
  if (event.httpMethod !== "POST") return jsonResponse(event, 405, { error: "Method not allowed" }, CORS_OPTIONS);
  const originBlocked = rejectDisallowedOrigin(event, CORS_OPTIONS);
  if (originBlocked) return originBlocked;

  try {
    const token = parseBearer(event.headers?.authorization || event.headers?.Authorization || "");
    const user = await getUserFromToken(token);
    const userId = user?.id || null;
    if (!userId) return jsonResponse(event, 401, { error: "Unauthorized" }, CORS_OPTIONS);

    const rows = await sbAdminFetch(
      `/rest/v1/stillform_v2_backups?user_id=eq.${encodeURIComponent(userId)}&select=id,created_at,app_version,schema,install_id&order=created_at.desc&limit=10`
    );
    return jsonResponse(event, 200, { ok: true, backups: Array.isArray(rows) ? rows : [] }, CORS_OPTIONS);
  } catch (e) {
    return jsonResponse(event, 502, { error: "list failed", detail: String(e?.message || e).slice(0, 200) }, CORS_OPTIONS);
  }
}
