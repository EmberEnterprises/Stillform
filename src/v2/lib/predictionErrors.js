/**
 * predictionErrors.js — the disconfirmation log (Precision Framework §4/§5, surface #1).
 *
 * Prediction-error catching: the moment a dark prediction *didn't* come true is
 * the strongest update signal, and almost nobody logs it — so the faulty prior
 * stays at full strength (framework §4). This store holds the disconfirmations a
 * user marks ("I was braced for X, it didn't happen"). The act of marking is the
 * intervention: logging disconfirming evidence turns down precision on the prior.
 *
 * PLACEMENT-AGNOSTIC by design. Whatever surface writes here (EOD review item is
 * the planned first home; could equally be a Close prompt or a micro-practice)
 * just calls recordPredictionError. This layer never decides where the catch
 * happens or what it means — it stores and returns. Same pattern as
 * capacitiesProfile / riskProfile: localStorage, fail-silent, never throws into
 * the UI, NOT sync-registered (the v2 stores aren't; the SYNC_KEYS registry was
 * deleted-v1).
 *
 * This log is also the data a future calibration mirror (§5 #2) would read — but
 * that surface is downstream and NOT built here.
 */

const STORAGE_KEY = "stillform_prediction_errors";

function makeId() {
  return `pe_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Read the log. Always returns a valid shape; fail-silent. */
export function getPredictionErrors() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { entries: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.entries)) return { entries: [] };
    return parsed;
  } catch {
    return { entries: [] };
  }
}

/** Persist the log. Returns true on success; fail-silent. */
export function savePredictionErrors(store) {
  try {
    if (!store || !Array.isArray(store.entries)) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

/**
 * Mark a disconfirmation — something the user predicted/braced for that didn't
 * happen. Empty text is not a valid mark (guarded). Returns the created entry,
 * or null on empty/failure.
 * @param {Object} arg
 * @param {string} arg.text  what didn't come true, in the user's words
 * @returns {{id:string, text:string, markedAt:string} | null}
 */
export function recordPredictionError({ text } = {}) {
  const clean = typeof text === "string" ? text.trim() : "";
  if (!clean) return null;
  const store = getPredictionErrors();
  const entry = { id: makeId(), text: clean, markedAt: new Date().toISOString() };
  store.entries.push(entry);
  return savePredictionErrors(store) ? entry : null;
}

/** Chronological history (oldest → newest). */
export function getPredictionErrorHistory() {
  return getPredictionErrors()
    .entries.slice()
    .sort((a, b) => new Date(a.markedAt).getTime() - new Date(b.markedAt).getTime());
}

/** Most recent marks, newest-first (default 5) — for surfacing/reflection. */
export function getRecentPredictionErrors(n = 5) {
  const hist = getPredictionErrorHistory();
  return hist.slice(Math.max(0, hist.length - n)).reverse();
}

/** Has the user ever marked a disconfirmation? */
export function hasPredictionError() {
  return getPredictionErrors().entries.length > 0;
}

/** Total count of marked disconfirmations. */
export function getPredictionErrorCount() {
  return getPredictionErrors().entries.length;
}
