import { upsertSubscriptionStatus, getSubscriptionStatusForLookup } from "./_subscriptionState.js";
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

    const existing = await getSubscriptionStatusForLookup({ installId });
    if (!existing) {
      return jsonResponse(event, 200, { ok: true, linked: false, reason: "no_install_record" }, CORS_OPTIONS);
    }

    await upsertSubscriptionStatus({
      userId,
      installId,
      lemonCustomerId: existing.lemon_customer_id || null,
      lemonSubscriptionId: existing.lemon_subscription_id || null,
      lemonStatus: existing.lemon_status || null,
      status: existing.status || null,
      userEmail: user.email || existing.user_email || null,
      variantName: existing.plan_variant || null,
      productName: existing.product_name || null,
      eventName: "account_linked",
      trialEndsAt: existing.trial_ends_at || null,
      renewsAt: existing.renews_at || null,
      endsAt: existing.ends_at || null
    });

    return jsonResponse(event, 200, { ok: true, linked: true }, CORS_OPTIONS);
  } catch (error) {
    console.error("subscription-link-failed", { message: error?.message || "unknown" });
    return jsonResponse(event, 500, { error: "Subscription linking failed" }, CORS_OPTIONS);
  }
}
