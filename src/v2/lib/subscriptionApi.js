import { getOrCreateInstallId } from "./identity.js";
import { fnUrl } from "./apiBase.js";
import { getAccessToken, getAuthState } from "./authApi.js";

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
  // Live Lemon Squeezy hosted checkouts (store "Embers", product 961807),
  // set 2026-09-14 after Arlin's pricing lock: $24.99/mo · $209.92/yr.
  // ?enabled=<variantId> pins the checkout to that single variant.
  monthly: "https://embers.lemonsqueezy.com/checkout/buy/39d7df24-0644-46c1-9bb5-3f2cf89839e4?enabled=1510526",
  annual: "https://embers.lemonsqueezy.com/checkout/buy/540c609b-2534-4362-9e9f-0b07b08dbedc?enabled=1510525",
};

/**
 * Lemon Squeezy hosted customer-portal URL (store-required: Manage/Cancel).
 * Arlin fills this from the LS dashboard (Settings → Customer Portal, or the
 * "My Orders" portal link). Until set, the Manage row shows an honest
 * unavailable state rather than a dead link. No other code change needed.
 */
const CUSTOMER_PORTAL_URL = "https://embers.lemonsqueezy.com/billing";

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
  // Signed-in buyers: pass user_id so the webhook binds the subscription to
  // the account directly (SUBSCRIPTION_SETUP §4) — recovery on a new device
  // then works by sign-in alone. Anonymous buyers stay install-bound; the
  // webhook still matches on the Lemon Squeezy email as a fallback.
  try {
    const { signedIn, userId } = getAuthState();
    if (signedIn && userId) params.set("checkout[custom][user_id]", userId);
  } catch { /* identity read is best-effort */ }
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
    // Audit fix (2026-09-14): send the auth token when signed in. The server
    // prefers the account lookup over the install lookup, so a subscriber who
    // signs in on a NEW device (fresh install_id, no row) is recognised by
    // account instead of being told they're not subscribed.
    const headers = { "Content-Type": "application/json" };
    try {
      const token = await getAccessToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch { /* stay anonymous */ }
    const response = await fetch(
      `${SUBSCRIPTION_STATUS_URL}?install_id=${encodeURIComponent(installId)}`,
      { method: "GET", headers }
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
