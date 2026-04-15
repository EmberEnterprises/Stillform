import { insertUatFeedback } from "./_uatFeedbackState.js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://pxrewildfnbxlygjofpx.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const FEEDBACK_TEXT_MIN = 8;
const FEEDBACK_TEXT_MAX = 1000;
const QUESTION_IDS = new Set(["confusing", "friction", "missing", "working"]);

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    },
    body: JSON.stringify(body)
  };
}

function parseBearer(authHeader) {
  if (!authHeader || typeof authHeader !== "string") return null;
  const [type, token] = authHeader.trim().split(/\s+/);
  if (!type || !token || type.toLowerCase() !== "bearer") return null;
  return token;
}

async function getUserFromToken(accessToken) {
  if (!accessToken) return null;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: "GET",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!response.ok) return null;
  return response.json().catch(() => null);
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
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const payload = JSON.parse(event.body || "{}");
    const feedbackText = sanitizeFeedbackText(payload?.feedback_text);
    if (feedbackText.length < FEEDBACK_TEXT_MIN) {
      return json(400, { error: `feedback_text must be at least ${FEEDBACK_TEXT_MIN} characters` });
    }

    const questionId = sanitizeQuestionId(payload?.question_id);
    if (!questionId) {
      return json(400, { error: "question_id is required" });
    }

    const token = parseBearer(event.headers?.authorization || event.headers?.Authorization || "");
    const user = await getUserFromToken(token).catch(() => null);
    const userId = user?.id || null;

    const installId = sanitizeInstallId(payload?.install_id);
    if (!userId && !installId) {
      return json(400, { error: "install_id is required when not authenticated" });
    }

    const row = await insertUatFeedback({
      userId,
      installId,
      sourceScreen: sanitizeSourceScreen(payload?.source_screen),
      questionId,
      questionPrompt: sanitizeQuestionPrompt(payload?.question_prompt),
      feedbackText,
      appVersion: sanitizeVersion(payload?.app_version),
      packageVersion: sanitizeVersion(payload?.package_version),
      metadata: {
        submitted_at: payload?.submitted_at || null,
        ua: event.headers?.["user-agent"] || event.headers?.["User-Agent"] || null
      }
    });

    return json(200, {
      ok: true,
      id: row?.id || null
    });
  } catch (error) {
    return json(500, { error: error?.message || "uat feedback ingest failed" });
  }
}
