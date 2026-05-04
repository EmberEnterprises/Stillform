// Returns a signed Lemon Squeezy customer portal URL for the authenticated user.
// The portal lets the user manage their subscription (cancel, update payment method,
// view receipts) without needing to log in to Lemon Squeezy separately.
//
// Lemon Squeezy provides per-customer signed URLs via the Customers API:
// GET https://api.lemonsqueezy.com/v1/customers/{id}
// Returns: data.attributes.urls.customer_portal — a signed URL valid for ~24h.
//
// Auth: requires the user's Supabase session (Bearer token). The user must have a
// linked Lemon Squeezy customer record (lemon_customer_id) — meaning they've
// completed checkout at least once. Free-trial users who haven't entered payment
// yet won't have a customer_id and get a clear "no subscription" response.

import { getSubscriptionStatusForLookup } from "./_subscriptionState.js";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

const CORS_OPTIONS = { methods: "POST, OPTIONS" };
const LEMON_SQUEEZY_API = "https://api.lemonsqueezy.com/v1";

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return jsonResponse(event, 200, { ok: true }, CORS_OPTIONS);
  if (event.httpMethod !== "POST") return jsonResponse(event, 405, { error: "Method not allowed" }, CORS_OPTIONS);

  const originBlocked = rejectDisallowedOrigin(event, CORS_OPTIONS);
  if (originBlocked) return originBlocked;

  try {
    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    if (!apiKey) {
      console.error("subscription-portal-failed: LEMON_SQUEEZY_API_KEY not set");
      return jsonResponse(event, 500, { error: "Server not configured" }, CORS_OPTIONS);
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

    const record = await getSubscriptionStatusForLookup({ userId, installId });
    const customerId = record?.lemon_customer_id || null;
    if (!customerId) {
      return jsonResponse(event, 404, {
        error: "No subscription record found",
        reason: "no_lemon_customer_id"
      }, CORS_OPTIONS);
    }

    const lemonResponse = await fetch(`${LEMON_SQUEEZY_API}/customers/${encodeURIComponent(customerId)}`, {
      method: "GET",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!lemonResponse.ok) {
      const text = await lemonResponse.text().catch(() => "");
      console.error("subscription-portal-lemon-failed", {
        status: lemonResponse.status,
        body: text.slice(0, 300)
      });
      return jsonResponse(event, 502, { error: "Could not retrieve portal URL" }, CORS_OPTIONS);
    }

    const data = await lemonResponse.json().catch(() => null);
    const portalUrl = data?.data?.attributes?.urls?.customer_portal || null;
    const updatePaymentUrl = data?.data?.attributes?.urls?.update_payment_method || null;

    if (!portalUrl) {
      console.error("subscription-portal-missing-url", {
        hasData: !!data?.data,
        hasUrls: !!data?.data?.attributes?.urls
      });
      return jsonResponse(event, 502, { error: "Portal URL not returned by provider" }, CORS_OPTIONS);
    }

    return jsonResponse(event, 200, {
      ok: true,
      portal_url: portalUrl,
      update_payment_url: updatePaymentUrl || null
    }, CORS_OPTIONS);
  } catch (error) {
    console.error("subscription-portal-failed", { message: error?.message || "unknown" });
    return jsonResponse(event, 500, { error: "Portal request failed" }, CORS_OPTIONS);
  }
}
