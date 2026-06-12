/*
 * backup-restore.js — ACCOUNTS ARC A1 (June 2 2026)
 *
 * Authed payload fetch for one snapshot. Service role bypasses RLS, so
 * ownership is verified EXPLICITLY: the row must carry the token's user_id.
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

    let body = {};
    try { body = JSON.parse(event.body || "{}"); } catch { body = {}; }
    const backupId = body?.backup_id ? String(body.backup_id).trim().slice(0, 60) : null;
    if (!backupId) return jsonResponse(event, 400, { error: "backup_id is required" }, CORS_OPTIONS);

    const rows = await sbAdminFetch(
      `/rest/v1/stillform_v2_backups?id=eq.${encodeURIComponent(backupId)}&select=id,user_id,created_at,app_version,schema,payload&limit=1`
    );
    const row = Array.isArray(rows) ? rows[0] : null;
    if (!row || row.user_id !== userId) {
      // Same response for missing and not-owned: no existence oracle.
      return jsonResponse(event, 404, { error: "not found" }, CORS_OPTIONS);
    }

    return jsonResponse(event, 200, {
      ok: true,
      id: row.id,
      created_at: row.created_at,
      app_version: row.app_version,
      schema: row.schema,
      payload: row.payload,
    }, CORS_OPTIONS);
  } catch (e) {
    return jsonResponse(event, 502, { error: "restore failed", detail: String(e?.message || e).slice(0, 200) }, CORS_OPTIONS);
  }
}
