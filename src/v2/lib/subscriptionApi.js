import { getOrCreateInstallId } from "./identity.js";
import { fnUrl } from "./apiBase.js";

/**
 * subscriptionApi — v2 client for subscription status (Phase 8a).
 *
 * Thin read-only wrapper over netlify/functions/subscription-status.js (the
 * payments backend — Lemon Squeezy webhook + Supabase — is already built and
 * LIVE). Given the device install_id, the backend returns whether this
 * device/user currently has access, with cancellation grace already resolved
 * server-side.
 *
 * This is plumbing only. It deliberately does NOT decide what to gate or when
 * (that's the timing/gating layer, an explicit product decision) — it just
 * reports status. Any gating built on top of this must fail OPEN / fall back
 * to cached state so a transient network failure never locks out a paying
 * user (per SUBSCRIPTION_SETUP.md's grace-window behavior).
 */

const SUBSCRIPTION_STATUS_URL = fnUrl("subscription-status");

/**
 * Lemon Squeezy hosted-checkout URLs (LIVE). Arlin fills these from the LS
 * dashboard (each plan's Share → checkout link) — one per variant. Until
 * they're set, the paywall CTA surfaces an "almost ready" state instead of a
 * dead link, so the surface is reviewable now and goes live the moment the
 * URLs land here (no other code change needed).
 */
const CHECKOUT_URLS = {
  monthly: "",
  annual: "",
};

/**
 * Lemon Squeezy hosted customer-portal URL (store-required: Manage/Cancel).
 * Arlin fills this from the LS dashboard (Settings → Customer Portal, or the
 * "My Orders" portal link). Until set, the Manage row shows an honest
 * unavailable state rather than a dead link. No other code change needed.
 */
const CUSTOMER_PORTAL_URL = "";

/**
 * The customer-portal URL for managing or cancelling a subscription.
 * @returns {string|null} null until configured
 */
export function getCustomerPortalUrl() {
  return CUSTOMER_PORTAL_URL || null;
}

/**
 * Build the full checkout URL for a variant, with custom data attached so the
 * webhook can match the purchase back to this device (SUBSCRIPTION_SETUP §4).
 * Returns null if the variant's URL isn't configured yet.
 *
 * @param {"monthly"|"annual"} variant
 * @returns {string|null}
 */
export function getCheckoutUrl(variant) {
  const base = CHECKOUT_URLS[variant] || "";
  if (!base) return null;
  const installId = getOrCreateInstallId();
  const params = new URLSearchParams();
  if (installId) params.set("checkout[custom][install_id]", installId);
  params.set("checkout[custom][variant]", variant);
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}${params.toString()}`;
}

/**
 * Send the user to Lemon Squeezy checkout for a variant. No-ops with an error
 * code if the variant's URL isn't configured yet.
 *
 * @param {"monthly"|"annual"} variant
 * @returns {{ok: boolean, error: string|null}}
 */
export function startCheckout(variant) {
  const url = getCheckoutUrl(variant);
  if (!url) return { ok: false, error: "not_configured" };
  try {
    window.location.href = url;
    return { ok: true, error: null };
  } catch {
    return { ok: false, error: "navigation_failed" };
  }
}

/**
 * Fetch current subscription status for this device.
 *
 * @returns {Promise<{isSubscribed: boolean, status: string|null, error: string|null}>}
 */
export async function getSubscriptionStatus() {
  const installId = getOrCreateInstallId();
  if (!installId) {
    return { isSubscribed: false, status: null, error: "No device identity." };
  }

  try {
    const response = await fetch(
      `${SUBSCRIPTION_STATUS_URL}?install_id=${encodeURIComponent(installId)}`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );

    if (!response.ok) {
      return { isSubscribed: false, status: null, error: `Status check failed (${response.status}).` };
    }

    const data = await response.json();
    return {
      isSubscribed: Boolean(data && data.is_subscribed),
      status: data && typeof data.status === "string" ? data.status : null,
      error: null,
    };
  } catch {
    return { isSubscribed: false, status: null, error: "Couldn't reach the network." };
  }
}

// --- Cached status (Phase 8c gating) -------------------------------------
// The gating layer needs a synchronous read, but status is fetched async.
// We cache the last CLEANLY-RESOLVED status. On error the prior cache is left
// intact — a blip never downgrades a known subscriber to "unknown" (fail-open).

let _cachedSub = null; // { isSubscribed: boolean, resolved: true } | null

/** Last cleanly-resolved subscription status, or null if never resolved. */
export function getCachedSubscription() {
  return _cachedSub;
}

/**
 * Fetch status and update the cache. On a clean response the cache is set; on
 * error the previous cache is preserved. Returns the cache.
 */
export async function refreshSubscriptionStatus() {
  const res = await getSubscriptionStatus();
  if (!res.error) {
    _cachedSub = { isSubscribed: res.isSubscribed, resolved: true };
  }
  return _cachedSub;
}
