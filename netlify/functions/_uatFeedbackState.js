import { sbAdminFetch } from "./_subscriptionState.js";

export const UAT_FEEDBACK_TABLE = "stillform_uat_feedback";
const ALLOWED_QUESTION_IDS = new Set(["confusing", "friction", "missing", "working"]);

const asText = (value, maxLen = 200) => {
  if (value == null) return null;
  const next = String(value).trim();
  if (!next) return null;
  return next.slice(0, maxLen);
};

const asLongText = (value, min = 8, max = 1000) => {
  const text = String(value || "").trim();
  if (!text) return null;
  if (text.length < min) return null;
  return text.slice(0, max);
};

const asInstallId = (value) => {
  const text = asText(value, 120);
  if (!text) return null;
  if (!/^[a-z0-9._:-]+$/i.test(text)) return null;
  return text;
};

const asQuestionId = (value) => {
  const text = asText(value, 40);
  if (!text) return "confusing";
  return ALLOWED_QUESTION_IDS.has(text) ? text : "confusing";
};

const asSourceScreen = (value) => {
  const text = asText(value, 40);
  if (!text) return "home";
  return text;
};

export const sanitizeUatFeedbackPayload = ({
  userId = null,
  installId = null,
  sourceScreen = "home",
  questionId = "confusing",
  questionPrompt = null,
  feedbackText = "",
  appVersion = null,
  packageVersion = null,
  metadata = null
} = {}) => {
  const safeFeedbackText = asLongText(feedbackText, 8, 1000);
  if (!safeFeedbackText) {
    throw new Error("feedback_text must be at least 8 characters");
  }
  const safeUserId = asText(userId, 120);
  const safeInstallId = asInstallId(installId);
  if (!safeUserId && !safeInstallId) {
    throw new Error("user_id or install_id is required");
  }
  return {
    user_id: safeUserId,
    install_id: safeInstallId,
    source_screen: asSourceScreen(sourceScreen),
    question_id: asQuestionId(questionId),
    question_prompt: asText(questionPrompt, 140),
    feedback_text: safeFeedbackText,
    app_version: asText(appVersion, 40),
    package_version: asText(packageVersion, 40),
    metadata: (metadata && typeof metadata === "object" && !Array.isArray(metadata))
      ? metadata
      : {}
  };
};

export const insertUatFeedback = async (payload) => {
  const safe = sanitizeUatFeedbackPayload(payload || {});
  const rows = await sbAdminFetch(
    `/rest/v1/${UAT_FEEDBACK_TABLE}`,
    {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(safe)
    }
  );
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
};

const sanitizeLimit = (value, fallback = 20, max = 50) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.min(max, Math.floor(n)));
};

export const listUatFeedbackHistory = async ({
  userId = null,
  installId = null,
  limit = 20
} = {}) => {
  const safeUserId = asText(userId, 120);
  const safeInstallId = asInstallId(installId);
  if (!safeUserId && !safeInstallId) return [];

  const safeLimit = sanitizeLimit(limit, 20, 50);
  const rowsById = new Map();

  if (safeUserId) {
    const rows = await sbAdminFetch(
      `/rest/v1/${UAT_FEEDBACK_TABLE}?select=id,created_at,source_screen,question_id,question_prompt,feedback_text,install_id,user_id&user_id=eq.${encodeURIComponent(safeUserId)}&order=created_at.desc&limit=${safeLimit}`
    );
    for (const row of Array.isArray(rows) ? rows : []) {
      if (row?.id != null) rowsById.set(String(row.id), row);
    }
  }

  if (safeInstallId) {
    const rows = await sbAdminFetch(
      `/rest/v1/${UAT_FEEDBACK_TABLE}?select=id,created_at,source_screen,question_id,question_prompt,feedback_text,install_id,user_id&install_id=eq.${encodeURIComponent(safeInstallId)}&order=created_at.desc&limit=${safeLimit}`
    );
    for (const row of Array.isArray(rows) ? rows : []) {
      if (row?.id != null) rowsById.set(String(row.id), row);
    }
  }

  return [...rowsById.values()]
    .sort((a, b) => new Date(b?.created_at || 0).getTime() - new Date(a?.created_at || 0).getTime())
    .slice(0, safeLimit);
};

export const listGlobalUatFeedbackHistory = async ({
  limit = 30
} = {}) => {
  const safeLimit = sanitizeLimit(limit, 30, 100);
  const rows = await sbAdminFetch(
    `/rest/v1/${UAT_FEEDBACK_TABLE}?select=id,created_at,source_screen,question_id,question_prompt,feedback_text,install_id,user_id&order=created_at.desc&limit=${safeLimit}`
  );
  return Array.isArray(rows) ? rows.slice(0, safeLimit) : [];
};
