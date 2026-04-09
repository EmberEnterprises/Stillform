import crypto from "node:crypto";
import { upsertSubscriptionStatus } from "./_subscriptionState.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, X-Signature, X-Event-Name",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

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
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: "Method not allowed" };
  }

  const secret = process.env.LEMON_WEBHOOK_SECRET;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret || !serviceRole) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing LEMON_WEBHOOK_SECRET or SUPABASE_SERVICE_ROLE_KEY" })
    };
  }

  try {
    const rawBody = event.body || "";
    const signature = String(event.headers?.["x-signature"] || event.headers?.["X-Signature"] || "").trim();
    if (!signature || !rawBody) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Missing signature or payload" }) };
    }

    const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    const sigBuf = Buffer.from(signature, "hex");
    const digestBuf = Buffer.from(digest, "hex");
    if (sigBuf.length === 0 || sigBuf.length !== digestBuf.length || !crypto.timingSafeEqual(sigBuf, digestBuf)) {
      return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: "Invalid signature" }) };
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload?.meta?.event_name || event.headers?.["x-event-name"] || event.headers?.["X-Event-Name"] || "";
    const attrs = payload?.data?.attributes || {};
    const custom = payload?.meta?.custom_data || {};

    const installId = custom.install_id || null;
    const userId = custom.user_id || null;
    const lemonCustomerId = attrs.customer_id ? String(attrs.customer_id) : null;
    const lemonSubscriptionId = payload?.data?.id ? String(payload.data.id) : null;
    const userEmail = attrs.user_email || null;
    const variantName = attrs.variant_name || null;
    const productName = attrs.product_name || null;
    const testMode = attrs.test_mode === true;

    // We only use live-mode events for truth.
    if (testMode) {
      return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ ok: true, ignored: "test_mode" }) };
    }

    const effectiveStatus = normalizeStatus(eventName, attrs.status, attrs.cancelled);

    if (!installId && !userId && !lemonCustomerId && !lemonSubscriptionId) {
      return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ ok: true, ignored: "no_match_keys" }) };
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

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message || "Webhook failed" })
    };
  }
};
