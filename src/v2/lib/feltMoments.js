/**
 * feltMoments.js — the Felt Layer's F1: four engineered proof moments
 * (scope-locked 2026-07-01). The compounding self-model earns four designed
 * deliveries — each shown ONCE ever, at most one moment per day, on home open:
 *
 *   1. first-finding    — the first pattern the math found and YOU confirmed
 *   2. first-prediction — the first "braced for X — it didn't happen"
 *   3. first-quiet      — the first watched pattern or named trigger gone quiet
 *   4. first-season     — the first time a season review exists
 *
 * DESIGN LAWS: calm editorial event, never gamified; derived read-time from
 * existing stores; fail-closed (any error → no moment, never a false one);
 * user's own words carried verbatim where shown. Pattern-interrupt (Step Out)
 * OUTRANKS a proof moment — safety-of-attention beats celebration.
 */

import { getConfirmedFindings } from "./discoveryFindings.js";
import { getPredictionErrors } from "./predictionErrors.js";
import { getBiasProfile, patternConfidence } from "./biasProfile.js";
import { getTriggerProfile, getTriggerDecay } from "./triggerProfile.js";
import { getSeasonReview } from "./seasonReview.js";

const SHOWN_KEY = "stillform_felt_moments"; // { shown: { [momentId]: iso }, lastShownDay: "YYYY-M-D" }

function safeLocal() {
  try { if (typeof window !== "undefined" && window.localStorage) return window.localStorage; } catch { /* */ }
  try { if (typeof localStorage !== "undefined") return localStorage; } catch { /* */ }
  return null;
}
function readState() {
  const ls = safeLocal();
  if (!ls) return { shown: {}, lastShownDay: null };
  try {
    const raw = ls.getItem(SHOWN_KEY);
    const p = raw ? JSON.parse(raw) : null;
    return p && typeof p === "object"
      ? { shown: p.shown && typeof p.shown === "object" ? p.shown : {}, lastShownDay: p.lastShownDay || null }
      : { shown: {}, lastShownDay: null };
  } catch { return { shown: {}, lastShownDay: null }; }
}
function writeState(s) {
  const ls = safeLocal();
  if (!ls) return false;
  try { ls.setItem(SHOWN_KEY, JSON.stringify(s)); return true; } catch { return false; }
}
function dayKey(ms = Date.now()) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function safe(fn, fb) { try { const v = fn(); return v === undefined ? fb : v; } catch { return fb; } }

/* ── the four detections (each returns a moment payload or null) ─────────── */

function detectFirstFinding() {
  const list = safe(() => getConfirmedFindings(), []);
  if (!Array.isArray(list) || list.length === 0) return null;
  const first = [...list].sort((a, b) => (a.confirmedAt || 0) - (b.confirmedAt || 0))[0];
  if (!first || !first.label) return null;
  return { id: "first-finding", label: first.label };
}

function detectFirstPrediction() {
  const { entries } = safe(() => getPredictionErrors(), { entries: [] });
  if (!Array.isArray(entries) || entries.length === 0) return null;
  const first = [...entries].sort((a, b) => (a.markedAt || 0) - (b.markedAt || 0))[0];
  if (!first || !first.text) return null;
  return { id: "first-prediction", text: String(first.text) };
}

function detectFirstQuiet() {
  // A retired WATCHED PATTERN or a retired NAMED TRIGGER — whichever exists.
  const retiredBias = safe(
    () => getBiasProfile().watchList.find(
      (e) => patternConfidence({ encounterCount: e.encounterCount, lastSeen: e.lastSeen }).tier === "retired"
    ),
    null
  );
  if (retiredBias) {
    const label = safe(() => retiredBias.label || retiredBias.chipId, null);
    return { id: "first-quiet", label: label || "a pattern you watched" };
  }
  const retiredTrigger = safe(
    () => getTriggerProfile().triggers.find((t) => getTriggerDecay(t).tier === "retired"),
    null
  );
  if (retiredTrigger && retiredTrigger.label) {
    return { id: "first-quiet", label: retiredTrigger.label };
  }
  return null;
}

function detectFirstSeason() {
  const r = safe(() => getSeasonReview(), null);
  return r ? { id: "first-season" } : null;
}

/* ── the API ─────────────────────────────────────────────────────────────── */

const DETECTORS = [detectFirstFinding, detectFirstPrediction, detectFirstQuiet, detectFirstSeason];

/**
 * getPendingProofMoment — the next unshown moment, respecting one-per-day.
 * Null when nothing has newly become true, everything is shown, or one was
 * already shown today. Fail-closed everywhere.
 */
export function getPendingProofMoment(nowMs = Date.now()) {
  const state = readState();
  if (state.lastShownDay === dayKey(nowMs)) return null; // one per day, max
  for (const detect of DETECTORS) {
    const m = safe(detect, null);
    if (m && !state.shown[m.id]) return m;
  }
  return null;
}

/** Mark a moment shown (once ever) + stamp today. */
export function markProofMomentShown(momentId, nowMs = Date.now()) {
  if (!momentId) return false;
  const state = readState();
  state.shown[momentId] = new Date(nowMs).toISOString();
  state.lastShownDay = dayKey(nowMs);
  return writeState(state);
}

export const _felt = { SHOWN_KEY };
