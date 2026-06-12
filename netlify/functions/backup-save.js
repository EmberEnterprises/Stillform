/*
 * backup-save.js — ACCOUNTS ARC A1 (June 2 2026)
 *
 * Authed snapshot upload. Body: { install_id?, app_version?, schema?, payload }.
 * payload = the client-built full-keyspace envelope (capped ~256KB serialized).
 * After insert, trims the user's rows to the newest 10 (spec default).
 *
 * Service role bypasses RLS, so user_id is taken ONLY from the verified
 * token — never from the body.
 */
import { sbAdminFetch } from "./_subscriptionState.js";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin,
} from "./_httpSecurity.js";

const CORS_OPTIONS = { methods: "POST, OPTIONS" };
const MAX_PAYLOAD_CHARS = 256 * 1024;
const KEEP_NEWEST = 10;

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
    const payload = body?.payload;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return jsonResponse(event, 400, { error: "payload object is required" }, CORS_OPTIONS);
    }
    const serialized = JSON.stringify(payload);
    if (serialized.length > MAX_PAYLOAD_CHARS) {
      return jsonResponse(event, 413, { error: "payload too large" }, CORS_OPTIONS);
    }

    const row = {
      user_id: userId,
      install_id: body?.install_id ? String(body.install_id).trim().slice(0, 120) : null,
      app_version: body?.app_version ? String(body.app_version).trim().slice(0, 60) : null,
      schema: Number.isInteger(body?.schema) ? body.schema : 1,
      payload,
    };

    const inserted = await sbAdminFetch(`/rest/v1/stillform_v2_backups`, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(row),
    });
    const insertedRow = Array.isArray(inserted) ? inserted[0] : inserted;

    // Trim to the newest KEEP_NEWEST for this user.
    const all = await sbAdminFetch(
      `/rest/v1/stillform_v2_backups?user_id=eq.${encodeURIComponent(userId)}&select=id,created_at&order=created_at.desc`
    );
    if (Array.isArray(all) && all.length > KEEP_NEWEST) {
      const stale = all.slice(KEEP_NEWEST).map((r) => r.id);
      for (const id of stale) {
        await sbAdminFetch(
          `/rest/v1/stillform_v2_backups?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(userId)}`,
          { method: "DELETE" }
        );
      }
    }

    return jsonResponse(event, 200, {
      ok: true,
      id: insertedRow?.id || null,
      created_at: insertedRow?.created_at || null,
      kept: Math.min(Array.isArray(all) ? all.length : 1, KEEP_NEWEST),
    }, CORS_OPTIONS);
  } catch (e) {
    return jsonResponse(event, 502, { error: "backup failed", detail: String(e?.message || e).slice(0, 200) }, CORS_OPTIONS);
  }
}
