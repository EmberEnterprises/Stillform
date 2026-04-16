import { getSubscriptionStatusForLookup } from "./_subscriptionState.js";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

const CORS_OPTIONS = { methods: "GET, OPTIONS" };

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return jsonResponse(event, 200, { ok: true }, CORS_OPTIONS);
  if (event.httpMethod !== "GET") return jsonResponse(event, 405, { error: "Method not allowed" }, CORS_OPTIONS);

  const originBlocked = rejectDisallowedOrigin(event, CORS_OPTIONS);
  if (originBlocked) return originBlocked;

  try {
    const installId = event.queryStringParameters?.install_id || null;
    const token = parseBearer(event.headers?.authorization || event.headers?.Authorization || "");
    const user = await getUserFromToken(token);
    const userId = user?.id || null;

    if (!userId && !installId) {
      return jsonResponse(event, 200, {
        ok: true,
        is_subscribed: false,
        source: "none"
      }, CORS_OPTIONS);
    }

    const record = await getSubscriptionStatusForLookup({ userId, installId });
    if (!record) {
      return jsonResponse(event, 200, {
        ok: true,
        is_subscribed: false,
        source: "none",
        user_id: userId,
        install_id: installId
      }, CORS_OPTIONS);
    }

    const normalizedStatus = String(record.status || "").toLowerCase();
    const statusExpiry = record.status_expires_at ? new Date(record.status_expires_at).getTime() : null;
    const inGrace = Number.isFinite(statusExpiry) && statusExpiry > Date.now();
    const effectiveSubscribed = (() => {
      if (normalizedStatus === "inactive") return false;
      if (normalizedStatus === "expired") return false;
      if (normalizedStatus === "paused") return false;
      if (normalizedStatus === "unpaid") return false;
      if (normalizedStatus === "cancelled") return Boolean(inGrace);
      return Boolean(record.is_subscribed);
    })();

    return jsonResponse(event, 200, {
      ok: true,
      is_subscribed: effectiveSubscribed,
      source: record.source || (record.user_id ? "user" : "install"),
      status: record.status || null,
      status_expires_at: record.status_expires_at || null,
      trial_ends_at: record.trial_ends_at || null,
      user_id: userId,
      install_id: installId
    }, CORS_OPTIONS);
  } catch (error) {
    console.error("subscription-status-failed", { message: error?.message || "unknown" });
    return jsonResponse(event, 500, { error: "Subscription status failed" }, CORS_OPTIONS);
  }
}
