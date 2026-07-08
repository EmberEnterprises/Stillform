/*
 * priorFrame.js — the PCE.2 reconsolidation bridge, user-visible half
 * (STILLFORM_PATTERN_CHANGE_AUDIT: "the highest-leverage missing piece for
 * the 'it's still there' problem"; FULL BUILD item 5, 2026-07-08).
 *
 * Reconsolidation only fires if the prior frame is REACTIVATED at recall
 * (Ecker/Schiller/Lane — already vetted in the Science Sheet). The AI half
 * exists (prior lock-ins ride formatRecentSessionsForAI into every Reframe);
 * what was missing is the USER-VISIBLE beat: when a pattern is recurring,
 * show the person the frame THEY THEMSELVES landed on last time —
 *
 *   "Last time this came up, you landed on: [their own lock-in]"
 *
 * — so the old groove is deliberately reopened next to the frame they built,
 * instead of leaving reactivation to chance.
 *
 * DETERMINISTIC + THEIRS: this module never generates a word. It only
 * resurfaces the user's own stored lockIn/nextMove, and only when the
 * forecast loop's arithmetic says the matching trigger is live again (the
 * same confirmed-finding recurrence that fires the forecast — nothing new is
 * inferred). Match = the prior session's own text mentions the recurring
 * trigger or the historically-following state, token-level, lowercase.
 * No match in their record -> silence (honest-empty). Never surveillance:
 * their words, shown back to them, at the moment they already chose to work.
 */

import { getRecentSessions } from "./sessions.js";

const SESSION_LOOKBACK = 20;

function norm(s) {
  return typeof s === "string" ? s.trim().toLowerCase() : "";
}

/**
 * The prior frame worth reactivating for a live pattern, or null.
 *
 * @param {{trigger?: string, follows?: string}} pattern — the recurring
 *   pattern's tokens (from forecastLoop's active forecast, or any caller
 *   that already established recurrence deterministically).
 * @returns {{ lockIn: string|null, nextMove: string|null, when: string }|null}
 */
export function getPriorFrame(pattern) {
  const trigger = norm(pattern && pattern.trigger);
  const follows = norm(pattern && pattern.follows);
  if (!trigger && !follows) return null;

  let sessions = [];
  try { sessions = getRecentSessions(SESSION_LOOKBACK) || []; } catch { return null; }

  for (const sess of sessions) {
    if (!sess) continue;
    const lockIn = typeof sess.lockIn === "string" ? sess.lockIn.trim() : "";
    const nextMove = typeof sess.nextMove === "string" ? sess.nextMove.trim() : "";
    if (!lockIn && !nextMove) continue; // nothing they landed on — nothing to reactivate

    // Token-level match against the session's own text fields — the user's
    // words, never an inference.
    const bag = [sess.precisionName, sess.takeaway, sess.surfacedFrame, lockIn, nextMove]
      .map(norm)
      .join(" \u0007 ");
    const matches = (trigger && bag.includes(trigger)) || (follows && bag.includes(follows));
    if (!matches) continue;

    let when = "recently";
    const t = sess.timestamp ? new Date(sess.timestamp).getTime() : NaN;
    if (Number.isFinite(t)) {
      const days = Math.floor((Date.now() - t) / 86400000);
      when = days <= 0 ? "earlier today" : days === 1 ? "yesterday" : `${days} days ago`;
    }
    return { lockIn: lockIn || null, nextMove: nextMove || null, when };
  }
  return null;
}
