// Returns a signed Lemon Squeezy customer portal URL for an org's billing.
// Admin-only. The portal lets the admin manage the subscription (cancel,
// update payment method, view receipts) without leaving Stillform.
//
// Mirrors subscription-portal.js but scoped to the org's lemon_customer_id
// rather than the user's. The privacy wall stands — this code path only
// touches stillform_organizations + stillform_org_members.

import { requireOrgAdmin, getOrgById } from "./_organizationState.js";
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
      console.error("organization-billing-portal-failed: LEMON_SQUEEZY_API_KEY not set");
      return jsonResponse(event, 500, { error: "Server not configured" }, CORS_OPTIONS);
    }

    const token = parseBearer(event.headers?.authorization || event.headers?.Authorization || "");
    const user = await getUserFromToken(token);
    if (!user?.id) return jsonResponse(event, 401, { error: "Not authenticated" }, CORS_OPTIONS);

    let body = {};
    try { body = JSON.parse(event.body || "{}"); } catch { return jsonResponse(event, 400, { error: "Invalid JSON" }, CORS_OPTIONS); }
    const orgId = body.org_id;
    if (!orgId) return jsonResponse(event, 400, { error: "org_id required" }, CORS_OPTIONS);

    const adminMembership = await requireOrgAdmin({ orgId, userId: user.id });
    if (!adminMembership) return jsonResponse(event, 403, { error: "Not an admin of this org" }, CORS_OPTIONS);

    const org = await getOrgById(orgId);
    if (!org) return jsonResponse(event, 404, { error: "Organization not found" }, CORS_OPTIONS);
    if (!org.lemon_customer_id) {
      return jsonResponse(event, 404, {
        error: "No subscription on this org yet. Set up billing first.",
        reason: "no_lemon_customer_id"
      }, CORS_OPTIONS);
    }

    const lemonResponse = await fetch(
      `${LEMON_SQUEEZY_API}/customers/${encodeURIComponent(org.lemon_customer_id)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    if (!lemonResponse.ok) {
      const text = await lemonResponse.text().catch(() => "");
      console.error("organization-billing-portal-lemon-failed", {
        status: lemonResponse.status,
        body: text.slice(0, 300)
      });
      return jsonResponse(event, 502, { error: "Could not retrieve portal URL" }, CORS_OPTIONS);
    }

    const data = await lemonResponse.json().catch(() => null);
    const portalUrl = data?.data?.attributes?.urls?.customer_portal || null;
    const updatePaymentUrl = data?.data?.attributes?.urls?.update_payment_method || null;

    if (!portalUrl) {
      return jsonResponse(event, 502, { error: "Portal URL not returned by provider" }, CORS_OPTIONS);
    }

    return jsonResponse(event, 200, {
      ok: true,
      portal_url: portalUrl,
      update_payment_url: updatePaymentUrl || null
    }, CORS_OPTIONS);
  } catch (error) {
    console.error("organization-billing-portal-failed", { message: error?.message || "unknown" });
    return jsonResponse(event, 500, { error: "Portal request failed" }, CORS_OPTIONS);
  }
}
