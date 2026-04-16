import { listUatFeedbackHistory } from "./_uatFeedbackState.js";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

const CORS_OPTIONS = { methods: "GET, OPTIONS" };

const sanitizeInstallId = (value) => {
  if (!value) return null;
  const next = String(value).trim();
  if (!next) return null;
  if (!/^[a-z0-9._:-]+$/i.test(next)) return null;
  return next.slice(0, 120);
};

const sanitizeLimit = (value, fallback = 20, max = 50) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.min(max, Math.floor(n)));
};

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return jsonResponse(event, 200, { ok: true }, CORS_OPTIONS);
  if (event.httpMethod !== "GET") return jsonResponse(event, 405, { error: "Method not allowed" }, CORS_OPTIONS);

  const originBlocked = rejectDisallowedOrigin(event, CORS_OPTIONS);
  if (originBlocked) return originBlocked;

  try {
    const token = parseBearer(event.headers?.authorization || event.headers?.Authorization || "");
    const user = await getUserFromToken(token).catch(() => null);
    const userId = user?.id || null;

    const installId = sanitizeInstallId(event.queryStringParameters?.install_id);
    const limit = sanitizeLimit(event.queryStringParameters?.limit, 20, 50);
    if (!userId && !installId) {
      return jsonResponse(event, 400, { error: "install_id or authenticated user is required" }, CORS_OPTIONS);
    }

    const rows = await listUatFeedbackHistory({ userId, installId, limit });
    return jsonResponse(event, 200, {
      ok: true,
      history: rows.map((row) => ({
        id: row?.id == null ? null : String(row.id),
        submitted_at: row?.created_at || null,
        source_screen: row?.source_screen || "home",
        question_id: row?.question_id || "confusing",
        question_prompt: row?.question_prompt || null,
        feedback_text: row?.feedback_text || "",
        install_id: row?.install_id || null,
        user_id: row?.user_id || null
      }))
    }, CORS_OPTIONS);
  } catch (error) {
    console.error("uat-feedback-history-failed", { message: error?.message || "unknown" });
    return jsonResponse(event, 500, { error: "Could not load UAT feedback history" }, CORS_OPTIONS);
  }
}
