import { getOrCreateInstallId } from "./identity.js";

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

const SUBSCRIPTION_STATUS_URL = "/.netlify/functions/subscription-status";

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
