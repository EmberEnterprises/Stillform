/**
 * functionChecks.js — the Cognitive Function Measurement (CFM) results store.
 *
 * Records the outcome of each practice-evidence round so improvement can be
 * read over time AGAINST THE USER'S OWN PAST — never a norm, never a percentile,
 * never anyone else. A round's numbers are evidence the function is changing,
 * not a grade on the person. Honest when flat: a baseline comparison can show
 * no change, and that is real data, not failure.
 *
 * Key: stillform_function_checks (stillform-prefixed → auto-included in cloud
 * backup snapshots; no separate sync registration needed).
 *
 * Record: { id, exercise, recordedAt, metrics }
 *   exercise : "affect-labeling" | "defusion"
 *   metrics  : exercise-shaped —
 *     affect-labeling → { medianLatencyMs, granularity (0-1), answered }
 *     defusion        → { distinctCount, total }
 *
 * Fail-silent throughout; mirrors predictionErrors.js / beliefRating.js.
 */

const STORAGE_KEY = "stillform_function_checks";

function safeLocal() {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch { /* sandboxed */ }
  try {
    if (typeof localStorage !== "undefined") return localStorage;
  } catch { /* ignore */ }
  return null;
}

function makeId() {
  return `fc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getFunctionChecks() {
  const ls = safeLocal();
  if (!ls) return { entries: [] };
  try {
    const raw = ls.getItem(STORAGE_KEY);
    if (!raw) return { entries: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.entries)) return { entries: [] };
    return parsed;
  } catch {
    return { entries: [] };
  }
}

/**
 * Record one completed round. `metrics` is stored as-given (the round owns its
 * own shape). Returns the stored record, or null if unusable. Fail-silent.
 *
 * @param {{exercise: string, metrics: object}} input
 */
export function recordFunctionCheck({ exercise, metrics } = {}) {
  const ex = typeof exercise === "string" ? exercise.trim() : "";
  if (!ex || !metrics || typeof metrics !== "object") return null;

  const entry = { id: makeId(), exercise: ex, recordedAt: new Date().toISOString(), metrics };

  const ls = safeLocal();
  if (!ls) return entry;
  try {
    const store = getFunctionChecks();
    store.entries.push(entry);
    ls.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* non-fatal */
  }
  return entry;
}

/** All checks for one exercise, oldest → newest. Fail-silent. */
export function getChecksByExercise(exercise) {
  return getFunctionChecks()
    .entries.filter((e) => e && e.exercise === exercise)
    .sort((a, b) => (Date.parse(a.recordedAt) || 0) - (Date.parse(b.recordedAt) || 0));
}

/**
 * The trend the result surface reads: the user's most recent round next to
 * their OWN earliest round (their starting point). No verdict, no target —
 * just the two ends of their own line.
 *
 * @returns {{ count: number, latest: object|null, baseline: object|null, hasComparison: boolean }}
 */
export function getProgressVsBaseline(exercise) {
  const checks = getChecksByExercise(exercise);
  const count = checks.length;
  if (count === 0) return { count: 0, latest: null, baseline: null, hasComparison: false };
  const latest = checks[count - 1];
  const baseline = checks[0];
  return { count, latest, baseline, hasComparison: count >= 2 && latest.id !== baseline.id };
}

/* ────────────────────────────────────────────────────────────────────────
 * The nudge: when (if ever) to OFFER a function check at end of session.
 * Gentle by construction — a maturity gate, a weekly cap, and it stays quiet
 * for anyone already practicing. Never a streak, never a guilt trip.
 * ──────────────────────────────────────────────────────────────────────── */

import { getSessionCount, getSessions } from "./sessions.js";

const OFFER_KEY = "stillform_fc_last_offered";
const MATURITY_SESSIONS = 5; // offer once there's enough practice to measure against
const MATURITY_DAYS = 7;     // …or they've simply been here a week
const CAP_DAYS = 7;          // never offer more than weekly

const DAY_MS = 86400000;

/** Parse a sessions.js dateKey "YYYY-M-D" (month is 0-indexed as stored). */
function parseDateKey(key) {
  if (typeof key !== "string") return NaN;
  const [y, m, d] = key.split("-").map(Number);
  if (![y, m, d].every(Number.isFinite)) return NaN;
  return new Date(y, m, d).getTime();
}

function daysSince(ms) {
  return Number.isFinite(ms) ? (Date.now() - ms) / DAY_MS : Infinity;
}

/**
 * True only when it's a good moment to offer — and rarely. The surface still
 * decides whether the context fits (e.g. not during wind-down).
 */
export function shouldOfferFunctionCheck() {
  // maturity: enough sessions OR enough time
  let sessions = 0;
  try { sessions = getSessionCount() || 0; } catch { /* ok */ }

  let daysSinceFirst = 0;
  try {
    const firsts = (getSessions() || []).map((s) => parseDateKey(s && s.dateKey)).filter(Number.isFinite);
    if (firsts.length) daysSinceFirst = daysSince(Math.min(...firsts));
  } catch { /* ok */ }

  const mature = sessions >= MATURITY_SESSIONS || daysSinceFirst >= MATURITY_DAYS;
  if (!mature) return false;

  // weekly cap on offers
  const ls = safeLocal();
  try {
    const last = ls && ls.getItem(OFFER_KEY);
    if (last && daysSince(Date.parse(last)) < CAP_DAYS) return false;
  } catch { /* ok */ }

  // don't nudge someone already practicing — a recent check means they know the way in
  try {
    const ts = getFunctionChecks().entries.map((e) => Date.parse(e.recordedAt)).filter(Number.isFinite);
    if (ts.length && daysSince(Math.max(...ts)) < CAP_DAYS) return false;
  } catch { /* ok */ }

  return true;
}

/** Record that the offer was shown (starts the weekly cap). Call on show. */
export function markFunctionCheckOffered() {
  try { safeLocal()?.setItem(OFFER_KEY, new Date().toISOString()); } catch { /* ok */ }
}
