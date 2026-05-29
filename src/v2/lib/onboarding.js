/**
 * onboarding — Phase 10 first-run gate.
 *
 * v2 had no first-run concept: a brand-new user landed straight on Home with
 * no frame. This tracks whether the intro has been seen so it shows exactly
 * once. Reuses the established `stillform_onboarded` key so anyone who has
 * already used the app isn't re-onboarded on deploy; truly new devices see it.
 *
 * To review the intro on a device that's already flagged, load `?onboard=1`
 * (handled in AppV2) — same pattern as `?paywall=1` / `?verify=1`.
 */

const ONBOARDED_KEY = "stillform_onboarded";

export function isOnboarded() {
  try {
    return localStorage.getItem(ONBOARDED_KEY) === "yes";
  } catch {
    // Storage blocked → treat as onboarded so we never trap a user in the
    // intro on every load.
    return true;
  }
}

export function setOnboarded() {
  try {
    localStorage.setItem(ONBOARDED_KEY, "yes");
  } catch {
    /* non-fatal */
  }
}
