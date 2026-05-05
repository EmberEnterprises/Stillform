import crypto from "node:crypto";
import { upsertSubscriptionStatus, sbAdminFetch } from "./_subscriptionState.js";

const responseHeaders = { "Content-Type": "application/json" };
const MAX_BODY_CHARS = 200000;

const normalizeStatus = (eventName, statusValue, cancelled) => {
  const status = String(statusValue || "").toLowerCase();
  if (eventName === "subscription_expired" || eventName === "subscription_cancelled" || eventName === "subscription_paused") return "inactive";
  if (eventName === "subscription_resumed" || eventName === "subscription_unpaused") return "active";
  if (status === "active" || status === "on_trial") return "active";
  if (status === "cancelled" || status === "expired" || status === "paused" || status === "unpaid" || status === "past_due") return "inactive";
  if (cancelled === true) return "inactive";
  return "active";
};

export const handler = async function(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: responseHeaders, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: responseHeaders, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const secret = process.env.LEMON_WEBHOOK_SECRET;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret || !serviceRole) {
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: JSON.stringify({ error: "Missing LEMON_WEBHOOK_SECRET or SUPABASE_SERVICE_ROLE_KEY" })
    };
  }

  try {
    if ((event.body || "").length > MAX_BODY_CHARS) {
      return { statusCode: 413, headers: responseHeaders, body: JSON.stringify({ error: "Payload too large" }) };
    }

    const rawBody = event.body || "";
    const signature = String(event.headers?.["x-signature"] || event.headers?.["X-Signature"] || "").trim();
    if (!signature || !rawBody) {
      return { statusCode: 400, headers: responseHeaders, body: JSON.stringify({ error: "Missing signature or payload" }) };
    }

    const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    const sigBuf = Buffer.from(signature, "hex");
    const digestBuf = Buffer.from(digest, "hex");
    if (sigBuf.length === 0 || sigBuf.length !== digestBuf.length || !crypto.timingSafeEqual(sigBuf, digestBuf)) {
      return { statusCode: 401, headers: responseHeaders, body: JSON.stringify({ error: "Invalid signature" }) };
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload?.meta?.event_name || event.headers?.["x-event-name"] || event.headers?.["X-Event-Name"] || "";
    const attrs = payload?.data?.attributes || {};
    const custom = payload?.meta?.custom_data || {};

    const installId = custom.install_id || null;
    const userIdFromCustom = custom.user_id || null;
    const lemonCustomerId = attrs.customer_id ? String(attrs.customer_id) : null;
    const lemonSubscriptionId = payload?.data?.id ? String(payload.data.id) : null;
    const userEmail = attrs.user_email || null;
    const variantName = attrs.variant_name || null;
    const productName = attrs.product_name || null;
    const testMode = attrs.test_mode === true;

    // We only use live-mode events for truth.
    if (testMode) {
      return { statusCode: 200, headers: responseHeaders, body: JSON.stringify({ ok: true, ignored: "test_mode" }) };
    }

    // Fallback: if Lemon Squeezy custom_data didn't carry user_id (which happens
    // with discount-code flows and some checkout edge cases — observed May 5, 2026
    // when a $0 founder subscription was created and the user_id was missing from
    // the webhook payload despite being passed at checkout), look up the auth user
    // by the customer email. Lemon Squeezy always includes user_email in webhook
    // attributes, so this gives us a reliable second path to user_id and prevents
    // the "subscription exists but UI shows no active subscription" bug.
    let userId = userIdFromCustom;
    if (!userId && userEmail) {
      try {
        const lookup = await sbAdminFetch(
          `/auth/v1/admin/users?email=${encodeURIComponent(userEmail)}`
        ).catch(() => null);
        const matchedUser = Array.isArray(lookup?.users) && lookup.users.length
          ? lookup.users[0]
          : null;
        if (matchedUser?.id) {
          userId = matchedUser.id;
        }
      } catch (lookupError) {
        // Email-based fallback is best-effort. If it fails, the webhook still
        // writes the install/customer/subscription rows; user can call
        // subscription-link-account from the client to fill in the user row later.
        console.error("subscription-webhook-email-lookup-failed", {
          message: lookupError?.message || "unknown"
        });
      }
    }

    const effectiveStatus = normalizeStatus(eventName, attrs.status, attrs.cancelled);

    if (!installId && !userId && !lemonCustomerId && !lemonSubscriptionId) {
      return { statusCode: 200, headers: responseHeaders, body: JSON.stringify({ ok: true, ignored: "no_match_keys" }) };
    }

    await upsertSubscriptionStatus({
      userId,
      installId,
      lemonCustomerId,
      lemonSubscriptionId,
      lemonStatus: attrs.status || null,
      status: effectiveStatus,
      userEmail,
      variantName,
      productName,
      eventName,
      trialEndsAt: attrs.trial_ends_at || null,
      renewsAt: attrs.renews_at || null,
      endsAt: attrs.ends_at || null
    });

    return { statusCode: 200, headers: responseHeaders, body: JSON.stringify({ ok: true }) };
  } catch (error) {
    console.error("subscription-webhook-failed", { message: error?.message || "unknown" });
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: JSON.stringify({ error: "Webhook failed" })
    };
  }
};
