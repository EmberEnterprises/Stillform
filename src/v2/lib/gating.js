import { getSessionCount } from "./sessions.js";
import { getCachedSubscription } from "./subscriptionApi.js";

/**
 * gating — Phase 8c. The access decision for gated practice (the Reframe
 * session, Move, Roadmap, profiles, diagnostic stack). CANON §291: Quick
 * Breathe and any stabilization safety valve are NEVER gated and must not
 * call this.
 *
 * TWO KNOBS — Arlin's to set (this is the conversion-timing fork she flagged):
 *
 *   GATING_ENABLED      Master switch. Set false to turn the wall off
 *                       everywhere (e.g. if it disrupts UAT). Default true.
 *
 *   FREE_SESSION_LIMIT  How many real sessions before the wall rises. Default
 *                       3, per the UAT read: the tester felt scammed because
 *                       the wall came BEFORE he'd used anything, so it should
 *                       land after real use, not after calibration. "3
 *                       sessions" rather than "3 days" — a day count can
 *                       elapse without the user ever opening the app. Raise/
 *                       lower this one number to retune the timing.
 *
 * FAIL-OPEN by design: the wall only rises when we are CONFIDENT the user is
 * (a) past the free limit AND (b) confirmed not subscribed. Any uncertainty —
 * status not yet resolved, a network error, an unknown session count —
 * returns false (no gate). A transient failure must never lock out a paying
 * user. The cost of a false "open" is one extra free session; the cost of a
 * false "gate" is locking out someone who paid. We bias hard toward open.
 */

export const GATING_ENABLED = true;
export const FREE_SESSION_LIMIT = 3;

/**
 * @returns {boolean} true → show the paywall instead of the gated feature.
 */
export function shouldGate() {
  if (!GATING_ENABLED) return false;

  const sub = getCachedSubscription();
  // Status unknown / not yet resolved → fail open.
  if (!sub || sub.resolved !== true) return false;
  // Confirmed subscribed → never gate.
  if (sub.isSubscribed) return false;

  let count;
  try {
    count = getSessionCount();
  } catch {
    return false; // unknown → fail open
  }
  if (!Number.isFinite(count)) return false;

  return count >= FREE_SESSION_LIMIT;
}
