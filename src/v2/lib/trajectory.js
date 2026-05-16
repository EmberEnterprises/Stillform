/*
 * trajectory.js — Trajectory section data layer.
 *
 * Per master todo Phase 3 spec: "Trajectory section: mechanical stats
 * line, renders at ≥3 sessions."
 *
 * Per v2 sharpening: "Achievement credits → quiet observation, never
 * gamified pep." The trajectory is a quiet stats line, not a streak
 * counter, not a progress bar, not gamified.
 *
 * No AI involvement — pure data display from local sessions. This is
 * intentional: not every surface needs AI. The trajectory is mechanical
 * by design (counts, dates) so the user can trust the numbers.
 *
 * Threshold: ≥3 sessions before the section renders. Below that, the
 * trajectory carries no signal — could mislead a new user into thinking
 * they're either ahead or behind.
 *
 * Output shape kept minimal — just what fits in one quiet editorial
 * line at the bottom of home.
 */

import { getSessions, getSessionCount, getDistinctPracticeDays } from "./sessions.js";

const THRESHOLD_SESSIONS = 3;

/**
 * Build a trajectory snapshot from session storage. Returns null when
 * the user hasn't crossed the threshold yet (smart screen hides the
 * section in that case).
 *
 * Returned shape:
 *   {
 *     sessionCount: number,
 *     daysActive: number,
 *     recentNamingsCount: number,  // sessions in the last 7 days
 *   }
 *
 * @returns {{sessionCount: number, daysActive: number, recentNamingsCount: number} | null}
 */
export function getTrajectoryStats() {
  const sessions = getSessions();
  const sessionCount = sessions.length;
  if (sessionCount < THRESHOLD_SESSIONS) return null;

  const daysActive = getDistinctPracticeDays();

  // Sessions in last 7 days — quick recency signal without exposing a
  // streak counter (canon §6 / Apr 1 note: streak counters drive
  // performance pressure, which Stillform deliberately avoids).
  const sevenDaysAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let recentNamingsCount = 0;
  for (const s of sessions) {
    if (!s || typeof s.timestamp !== "string") continue;
    try {
      if (new Date(s.timestamp).getTime() >= sevenDaysAgoMs) recentNamingsCount += 1;
    } catch {
      /* skip malformed entries */
    }
  }

  return { sessionCount, daysActive, recentNamingsCount };
}

/**
 * Format trajectory stats into a single quiet line for editorial
 * display. Confidant-voice third-person observation, never gamified.
 *
 * Example output:
 *   "47 reps · 22 days active · 8 in the last week"
 *
 * @param {{sessionCount: number, daysActive: number, recentNamingsCount: number}} stats
 * @returns {string}
 */
export function formatTrajectoryLine(stats) {
  if (!stats) return "";
  const parts = [];
  parts.push(`${stats.sessionCount} rep${stats.sessionCount === 1 ? "" : "s"}`);
  parts.push(`${stats.daysActive} day${stats.daysActive === 1 ? "" : "s"} active`);
  if (stats.recentNamingsCount > 0) {
    parts.push(`${stats.recentNamingsCount} in the last week`);
  }
  return parts.join(" · ");
}
