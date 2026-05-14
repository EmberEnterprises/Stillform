import { requireOrgAdmin, getOrgById } from "./_organizationState.js";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

// ─────────────────────────────────────────────────────────────────────────
// organization-billing-checkout
// ─────────────────────────────────────────────────────────────────────────
//
// Admin only. Returns a Lemon Squeezy checkout URL for the org's
// subscription, with org_id baked into custom_data so the webhook can
// route the resulting subscription event to upsertOrgBilling.
//
// Request body: { org_id, plan_cadence ("monthly" | "annual"),
//                 redirect_url? }
// Returns:      { ok: true, checkout_url: "https://..." }
//
// Environment configuration required (set in Netlify):
//   LEMON_ORG_CHECKOUT_URL_MONTHLY — full LS buy-link for monthly org plan
//   LEMON_ORG_CHECKOUT_URL_ANNUAL  — full LS buy-link for annual org plan
//
// If neither is set, returns 503 with a clear message. The endpoint
// itself ships; the LS product setup is a separate configuration step.
//
// CONTAINS ZERO PRACTICE DATA. This endpoint only reads from
// stillform_organizations and stillform_org_members. No code path here
// touches user_data / backups / user_profiles.
// ─────────────────────────────────────────────────────────────────────────

const CORS_OPTIONS = { methods: "POST, OPTIONS" };

const buildCheckoutUrl = (baseUrl, { orgId, redirectUrl, cadence }) => {
  const url = new URL(baseUrl);
  url.searchParams.set("checkout[custom][org_id]", orgId);
  url.searchParams.set("checkout[custom][cadence]", cadence);
  if (redirectUrl) {
    url.searchParams.set("checkout[custom][redirect_url]", redirectUrl);
  }
  return url.toString();
};

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return jsonResponse(event, 200, { ok: true }, CORS_OPTIONS);
  if (event.httpMethod !== "POST") return jsonResponse(event, 405, { error: "Method not allowed" }, CORS_OPTIONS);

  const originBlocked = rejectDisallowedOrigin(event, CORS_OPTIONS);
  if (originBlocked) return originBlocked;

  try {
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

    const cadence = body.plan_cadence === "monthly" ? "monthly" : "annual";
    const baseUrl =
      cadence === "monthly"
        ? process.env.LEMON_ORG_CHECKOUT_URL_MONTHLY
        : process.env.LEMON_ORG_CHECKOUT_URL_ANNUAL;

    if (!baseUrl) {
      return jsonResponse(event, 503, {
        error: "Org billing not configured yet. Set LEMON_ORG_CHECKOUT_URL_MONTHLY and LEMON_ORG_CHECKOUT_URL_ANNUAL in Netlify env vars after creating the Lemon Squeezy products for org seats."
      }, CORS_OPTIONS);
    }

    const redirectUrl = typeof body.redirect_url === "string" ? body.redirect_url.slice(0, 500) : null;
    const checkoutUrl = buildCheckoutUrl(baseUrl, { orgId, redirectUrl, cadence });

    return jsonResponse(event, 200, {
      ok: true,
      checkout_url: checkoutUrl,
      plan_cadence: cadence
    }, CORS_OPTIONS);
  } catch (error) {
    const message = error?.message || "unknown";
    console.error("organization-billing-checkout-failed", { message });
    return jsonResponse(event, 500, { error: "Could not generate checkout URL" }, CORS_OPTIONS);
  }
}
