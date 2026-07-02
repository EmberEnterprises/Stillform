/**
 * seasonReview.js — the season review (retention batch 2/3, 2026-07-01).
 *
 * A derived, read-time look back over the last season of practice — the moment
 * the accumulated record becomes something the user can FEEL. Nothing stored,
 * no new keys, no migration: every line is computed from stores that already
 * exist (sessions, belief ratings, capacities growth, trigger decay, the named
 * self-knowledge lists). Words, never scores — the framing law governs.
 *
 * SELF-GATING: getSeasonReview() returns null until the window holds enough
 * real practice (MIN_SESSIONS across MIN_DISTINCT_DAYS). A review of a thin
 * season would be a report card on absence — honest absence is no review.
 *
 * Fail-soft per section: any store that errors contributes nothing rather than
 * killing the review.
 */

import { getSessions } from "./sessions.js";
import { getBeliefRatings } from "./beliefRating.js";
import { CAPACITIES, getGrowthRead } from "./capacitiesProfile.js";
import { getTriggerProfile, getTriggerDecay } from "./triggerProfile.js";
import { getVulnerabilities } from "./vulnerabilities.js";
import { getStrengths } from "./strengths.js";
import { getValues } from "./values.js";

// First-pass defaults (flagged for Arlin).
const WINDOW_DAYS = 90;
const MIN_SESSIONS = 12;
const MIN_DISTINCT_DAYS = 8;

const DAY = 24 * 60 * 60 * 1000;

function inWindow(ms, nowMs) {
  return Number.isFinite(ms) && ms >= nowMs - WINDOW_DAYS * DAY && ms <= nowMs;
}

function safe(fn, fallback) {
  try {
    const v = fn();
    return v === undefined ? fallback : v;
  } catch {
    return fallback;
  }
}

/**
 * getSeasonReview — the derived review, or null when the season is too thin.
 *
 * @returns {?{
 *   windowDays: number,
 *   practice: { sessions: number, distinctDays: number },
 *   thoughts: { tested: number, eased: number, held: number },
 *   capacitiesMoved: Array<{ label: string, fromTitle: string, toTitle: string }>,
 *   quietTriggers: string[],                     // labels gone quiet
 *   named: { vulnerabilities: number, strengths: number, values: number }, // confirmed IN window
 * }}
 */
export function getSeasonReview(nowMs = Date.now()) {
  // ── practice volume (the gate) ───────────────────────────────────────────
  const sessions = safe(() => getSessions(), []).filter((s) =>
    inWindow(new Date(s?.timestamp || 0).getTime(), nowMs)
  );
  const distinctDays = new Set(
    sessions.map((s) => new Date(s.timestamp).toDateString())
  ).size;
  if (sessions.length < MIN_SESSIONS || distinctDays < MIN_DISTINCT_DAYS) return null;

  // ── thoughts tested (belief work) ────────────────────────────────────────
  const beliefEntries = safe(() => getBeliefRatings().entries, []).filter((e) =>
    inWindow(new Date(e?.markedAt || 0).getTime(), nowMs)
  );
  const rated = beliefEntries.filter((e) => typeof e.delta === "number");
  const thoughts = {
    tested: beliefEntries.length,
    eased: rated.filter((e) => e.delta < 0).length,
    held: rated.filter((e) => e.delta >= 0).length,
  };

  // ── capacities that moved (reuses the longitudinal spine) ────────────────
  const capacitiesMoved = [];
  for (const cap of CAPACITIES) {
    const g = safe(() => getGrowthRead(cap.instrument), null);
    if (g && g.moved && inWindow(new Date(g.latestAt).getTime(), nowMs)) {
      capacitiesMoved.push({
        label: cap.label,
        fromTitle: g.from.title || g.from.key,
        toTitle: g.to.title || g.to.key,
      });
    }
  }

  // ── triggers gone quiet (reuses the decay engine; fail-toward-live) ─────
  const quietTriggers = safe(() => getTriggerProfile().triggers, [])
    .filter((t) => safe(() => getTriggerDecay(t).tier, "") === "retired")
    .map((t) => t.label)
    .filter(Boolean);

  // ── self-knowledge named this season (confirmedAt in window) ────────────
  const countConfirmedIn = (list) =>
    (Array.isArray(list) ? list : []).filter((r) => inWindow(Number(r?.confirmedAt), nowMs)).length;
  const named = {
    vulnerabilities: safe(() => countConfirmedIn(getVulnerabilities()), 0),
    strengths: safe(() => countConfirmedIn(getStrengths()), 0),
    values: safe(() => countConfirmedIn(getValues()), 0),
  };

  return {
    windowDays: WINDOW_DAYS,
    practice: { sessions: sessions.length, distinctDays },
    thoughts,
    capacitiesMoved,
    quietTriggers,
    named,
  };
}

export const _review = { WINDOW_DAYS, MIN_SESSIONS, MIN_DISTINCT_DAYS };
