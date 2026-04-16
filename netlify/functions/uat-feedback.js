import { insertUatFeedback } from "./_uatFeedbackState.js";
import { getStore } from "@netlify/blobs";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

const FEEDBACK_TEXT_MIN = 8;
const FEEDBACK_TEXT_MAX = 1000;
const QUESTION_IDS = new Set(["confusing", "friction", "missing", "working"]);
const UAT_BLOBS_STORE = "stillform-uat-feedback";
const MAX_BODY_CHARS = 12000;
const CORS_OPTIONS = { methods: "POST, OPTIONS" };

async function writeUatFeedbackToBlobs(payload) {
  const store = getStore(UAT_BLOBS_STORE);
  const entryId = `uat_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const key = `entries/${entryId}.json`;
  await store.set(key, JSON.stringify(payload));
  return entryId;
}

function sanitizeInstallId(value) {
  if (value == null) return null;
  const next = String(value).trim();
  if (!next) return null;
  return next.slice(0, 120);
}

function sanitizeSourceScreen(value) {
  if (value == null) return "home";
  const next = String(value).trim().toLowerCase();
  if (!next) return "home";
  return next.slice(0, 32);
}

function sanitizeQuestionId(value) {
  const next = String(value || "").trim().toLowerCase();
  if (!QUESTION_IDS.has(next)) return null;
  return next;
}

function sanitizeQuestionPrompt(value) {
  if (value == null) return null;
  const next = String(value).trim();
  if (!next) return null;
  return next.slice(0, 180);
}

function sanitizeFeedbackText(value) {
  const next = String(value || "").trim();
  if (!next) return "";
  return next.slice(0, FEEDBACK_TEXT_MAX);
}

function sanitizeVersion(value, max = 40) {
  if (value == null) return null;
  const next = String(value).trim();
  if (!next) return null;
  return next.slice(0, max);
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return jsonResponse(event, 200, { ok: true }, CORS_OPTIONS);
  if (event.httpMethod !== "POST") return jsonResponse(event, 405, { error: "Method not allowed" }, CORS_OPTIONS);

  const originBlocked = rejectDisallowedOrigin(event, CORS_OPTIONS);
  if (originBlocked) return originBlocked;

  try {
    if ((event.body || "").length > MAX_BODY_CHARS) {
      return jsonResponse(event, 413, { error: "Payload too large" }, CORS_OPTIONS);
    }

    let payload;
    try {
      payload = JSON.parse(event.body || "{}");
    } catch {
      return jsonResponse(event, 400, { error: "Invalid JSON body" }, CORS_OPTIONS);
    }

    const feedbackText = sanitizeFeedbackText(payload?.feedback_text);
    if (feedbackText.length < FEEDBACK_TEXT_MIN) {
      return jsonResponse(event, 400, { error: `feedback_text must be at least ${FEEDBACK_TEXT_MIN} characters` }, CORS_OPTIONS);
    }

    const questionId = sanitizeQuestionId(payload?.question_id);
    if (!questionId) {
      return jsonResponse(event, 400, { error: "question_id is required" }, CORS_OPTIONS);
    }

    const token = parseBearer(event.headers?.authorization || event.headers?.Authorization || "");
    const user = await getUserFromToken(token).catch(() => null);
    const userId = user?.id || null;

    const installId = sanitizeInstallId(payload?.install_id);
    if (!userId && !installId) {
      return jsonResponse(event, 400, { error: "install_id is required when not authenticated" }, CORS_OPTIONS);
    }
    const sourceScreen = sanitizeSourceScreen(payload?.source_screen);
    const questionPrompt = sanitizeQuestionPrompt(payload?.question_prompt);
    const appVersion = sanitizeVersion(payload?.app_version);
    const packageVersion = sanitizeVersion(payload?.package_version);
    const submittedAt = payload?.submitted_at || null;
    const userAgent = event.headers?.["user-agent"] || event.headers?.["User-Agent"] || null;

    try {
      const row = await insertUatFeedback({
        userId,
        installId,
        sourceScreen,
        questionId,
        questionPrompt,
        feedbackText,
        appVersion,
        packageVersion,
        metadata: {
          submitted_at: submittedAt,
          ua: userAgent
        }
      });

      return jsonResponse(event, 200, {
        ok: true,
        id: row?.id || null,
        storage: "supabase"
      }, CORS_OPTIONS);
    } catch (writeError) {
      const message = String(writeError?.message || "");
      const tableMissing = message.includes("PGRST205") || message.includes("stillform_uat_feedback");
      if (tableMissing) {
        try {
          const entryId = await writeUatFeedbackToBlobs({
            id: null,
            received_at: new Date().toISOString(),
            submitted_at: submittedAt || new Date().toISOString(),
            user_id: userId,
            install_id: installId,
            source_screen: sourceScreen,
            question_id: questionId,
            question_prompt: questionPrompt,
            feedback_text: feedbackText,
            app_version: appVersion,
            package_version: packageVersion,
            user_agent: userAgent
          });
          return jsonResponse(event, 200, {
            ok: true,
            id: entryId,
            storage: "netlify-blobs",
            warning: "uat_feedback_table_missing"
          }, CORS_OPTIONS);
        } catch (blobError) {
          console.error("uat-feedback-blobs-write-failed", { message: blobError?.message || "unknown" });
          return jsonResponse(event, 202, {
            ok: true,
            id: null,
            storage: "local-only",
            warning: "uat_feedback_table_missing"
          }, CORS_OPTIONS);
        }
      }
      throw writeError;
    }
  } catch (error) {
    console.error("uat-feedback-ingest-failed", { message: error?.message || "unknown" });
    return jsonResponse(event, 500, { error: "UAT feedback ingest failed" }, CORS_OPTIONS);
  }
}
