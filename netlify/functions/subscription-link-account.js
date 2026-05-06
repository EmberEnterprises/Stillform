import { linkInstallToUser, getSubscriptionStatusForLookup } from "./_subscriptionState.js";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

const CORS_OPTIONS = { methods: "POST, OPTIONS" };
const MAX_BODY_CHARS = 5000;

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return jsonResponse(event, 200, { ok: true }, CORS_OPTIONS);
  if (event.httpMethod !== "POST") return jsonResponse(event, 405, { error: "Method not allowed" }, CORS_OPTIONS);

  const originBlocked = rejectDisallowedOrigin(event, CORS_OPTIONS);
  if (originBlocked) return originBlocked;

  try {
    if ((event.body || "").length > MAX_BODY_CHARS) {
      return jsonResponse(event, 413, { error: "Payload too large" }, CORS_OPTIONS);
    }

    const token = parseBearer(event.headers?.authorization || event.headers?.Authorization || "");
    const user = await getUserFromToken(token);
    const userId = user?.id || null;
    if (!userId) return jsonResponse(event, 401, { error: "Unauthorized" }, CORS_OPTIONS);

    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return jsonResponse(event, 400, { error: "Invalid JSON body" }, CORS_OPTIONS);
    }
    const installId = body?.install_id ? String(body.install_id).trim().slice(0, 120) : null;
    if (!installId) return jsonResponse(event, 400, { error: "install_id is required" }, CORS_OPTIONS);

    // v2: check if there's any subscription row for this install
    const existing = await getSubscriptionStatusForLookup({ installId });
    if (!existing) {
      return jsonResponse(event, 200, { ok: true, linked: false, reason: "no_install_record" }, CORS_OPTIONS);
    }

    // v2: backfill user_id on the existing row, do NOT write a new row
    const linked = await linkInstallToUser({ userId, installId });
    if (!linked) {
      return jsonResponse(event, 200, { ok: true, linked: false, reason: "no_subscription_id" }, CORS_OPTIONS);
    }

    return jsonResponse(event, 200, { ok: true, linked: true }, CORS_OPTIONS);
  } catch (error) {
    console.error("subscription-link-failed", { message: error?.message || "unknown" });
    return jsonResponse(event, 500, { error: "Subscription linking failed" }, CORS_OPTIONS);
  }
}
