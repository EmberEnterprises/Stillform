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
