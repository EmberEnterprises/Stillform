import { listGlobalUatFeedbackHistory } from "./_uatFeedbackState.js";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

const CORS_OPTIONS = { methods: "GET, OPTIONS" };

const sanitizeLimit = (value, fallback = 30, max = 100) => {
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
    if (!user?.id) {
      return jsonResponse(event, 401, { error: "Unauthorized" }, CORS_OPTIONS);
    }
    const limit = sanitizeLimit(event.queryStringParameters?.limit, 30, 100);
    const rows = await listGlobalUatFeedbackHistory({ limit });
    return jsonResponse(event, 200, {
      ok: true,
      history: rows.map((row) => ({
        id: row?.id == null ? null : String(row.id),
        submitted_at: row?.created_at || null,
        source_screen: row?.source_screen || "home",
        question_id: row?.question_id || "confusing",
        question_prompt: row?.question_prompt || null,
        feedback_text: row?.feedback_text || ""
      }))
    }, CORS_OPTIONS);
  } catch (error) {
    console.error("uat-feedback-history-failed", { message: error?.message || "unknown" });
    return jsonResponse(event, 500, { error: "Could not load UAT feedback history" }, CORS_OPTIONS);
  }
}
