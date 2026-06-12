// src/v2/lib/predictionLog.js
//
// Forward prediction log — captures predictions made AT prediction time
// with stated confidence, then matches outcomes later. The "What You Bet On"
// mirror surface displays paired entries: prediction + confidence + outcome
// + the gap in plain language (per framework: the gap IS the data).
//
// Distinct from predictionErrors.js, which captures retrospective
// disconfirmations at EOD ("I was braced for X, it didn't happen").
// This is prospective: log the prediction in the moment, mark the outcome
// later (typically at EOD when its window has passed).
//
// Framework grounding: STILLFORM_PRECISION_FRAMEWORK.md §4 + §5 #2.
// Naming the confidence and seeing the gap accumulate lowers precision
// on faulty priors — the calibration move in dialogue with the world.
//
// Storage: localStorage key "stillform_prediction_log".
// Shape: { entries: [{id, text, confidence, loggedAt, outcome, outcomeAt}] }
//   - id: generated unique string
//   - text: non-empty user prediction
//   - confidence: number 0-100 (user-named) or null (bet made without a stated number)
//   - loggedAt: ISO timestamp
//   - outcome: null (pending) or non-empty string (resolved; user's own words)
//   - outcomeAt: null (pending) or ISO timestamp when outcome marked
//
// Outcome is FREE TEXT, not binary — the framework's "gap is the data"
// principle is honored by letting the user describe what actually happened
// in their own words. Reading prediction + confidence + outcome side-by-side
// surfaces the gap without imposing a score.
//
// Fail-silent: never throws to the UI; returns nullish on error.
// Not sync-registered (consistent with other v2 stores; local-first).

const STORAGE_KEY = "stillform_prediction_log";

function safeLocalStorage() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage;
    }
  } catch (e) {
    // Some environments throw on localStorage access (privacy mode, etc.)
  }
  return null;
}

function generateId() {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `pred_${ts}_${rand}`;
}

export function getPredictionLog() {
  const ls = safeLocalStorage();
  if (!ls) return { entries: [] };
  try {
    const raw = ls.getItem(STORAGE_KEY);
    if (!raw) return { entries: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.entries)) return { entries: [] };
    return { entries: parsed.entries };
  } catch (e) {
    return { entries: [] };
  }
}

export function savePredictionLog(store) {
  const ls = safeLocalStorage();
  if (!ls) return false;
  try {
    if (!store || !Array.isArray(store.entries)) return false;
    ls.setItem(STORAGE_KEY, JSON.stringify({ entries: store.entries }));
    return true;
  } catch (e) {
    return false;
  }
}

export function recordPrediction({ text, confidence } = {}) {
  const trimmed = typeof text === "string" ? text.trim() : "";
  if (!trimmed) return null;
  // CORE LOOP L2 (June 2026): confidence may be null — a falsifiable bet
  // without a stated number is still a bet. Fabricating a number would
  // violate zero-fabrication; null is the honest value.
  let c = null;
  if (confidence !== null && confidence !== undefined && confidence !== "") {
    const n = Number(confidence);
    if (!Number.isFinite(n) || n < 0 || n > 100) return null;
    c = n;
  }
  const entry = {
    id: generateId(),
    text: trimmed,
    confidence: c,
    loggedAt: new Date().toISOString(),
    outcome: null,
    outcomeAt: null,
  };
  const store = getPredictionLog();
  store.entries.push(entry);
  const ok = savePredictionLog(store);
  return ok ? entry : null;
}

export function recordOutcome(id, { outcome } = {}) {
  if (typeof id !== "string" || !id) return null;
  const trimmed = typeof outcome === "string" ? outcome.trim() : "";
  if (!trimmed) return null;
  const store = getPredictionLog();
  const idx = store.entries.findIndex((e) => e && e.id === id);
  if (idx === -1) return null;
  store.entries[idx] = {
    ...store.entries[idx],
    outcome: trimmed,
    outcomeAt: new Date().toISOString(),
  };
  const ok = savePredictionLog(store);
  return ok ? store.entries[idx] : null;
}

function sortNewestFirst(entries) {
  return entries.slice().sort((a, b) => {
    const aT = a && a.loggedAt ? new Date(a.loggedAt).getTime() : 0;
    const bT = b && b.loggedAt ? new Date(b.loggedAt).getTime() : 0;
    return bT - aT;
  });
}

export function getPendingPredictions() {
  return sortNewestFirst(
    getPredictionLog().entries.filter((e) => e && e.outcome === null),
  );
}

export function getResolvedPredictions() {
  return sortNewestFirst(
    getPredictionLog().entries.filter((e) => e && e.outcome !== null),
  );
}

export function getAllPredictions() {
  return sortNewestFirst(getPredictionLog().entries);
}

export function hasAnyPrediction() {
  return getPredictionLog().entries.length > 0;
}

export function hasPendingPrediction() {
  return getPredictionLog().entries.some((e) => e && e.outcome === null);
}

export function getPredictionCount() {
  return getPredictionLog().entries.length;
}
