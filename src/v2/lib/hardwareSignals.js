/**
 * hardwareSignals.js — the health-data seam (HRV + sleep) into the hardware read.
 *
 * The reframe/brief context already carries a `bioFilter` slot fed from the
 * user's same-day StateCheck (signalLog.getLatestBodyBioFilter). This module
 * adds the OTHER source the spec calls for — device health signals — behind a
 * consent gate, and derives the SAME bioFilter token vocabulary so the two merge
 * into one read instead of competing.
 *
 * PRODUCER IS NATIVE. There is no web equivalent for HRV/sleep (no .ics-style
 * import), so on web this store simply stays empty — exactly like the calendar
 * seam's native path. A HealthKit / Health Connect pull will call the setters
 * later; the consumer wiring is done now so it lights up the moment it does.
 * Per the Settings rule, we add NO web toggle that would promise a non-working
 * integration — the consent UI lands with the native build.
 *
 * PRIVACY: consent-gated; revoke wipes stored readings. stillform_-prefixed →
 * covered by the sync/wipe scans. Only a coarse derived signal ever reaches the
 * AI (a bioFilter token), never raw numbers.
 *
 * Fail-silent throughout.
 */

import { getLatestBodyBioFilter } from "./signalLog.js";

const CONSENT_KEY = "stillform_health_consent";
const SIGNALS_KEY = "stillform_health_signals";

// First-pass default (flagged for Arlin): nights under this read as sleep-debt.
const SLEEP_LOW_HOURS = 6;

function safeLocal() {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch { /* sandboxed */ }
  try {
    if (typeof localStorage !== "undefined") return localStorage;
  } catch { /* ignore */ }
  return null;
}

function dayKey(ms) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// ── consent ─────────────────────────────────────────────────────────────────

export function getHealthConsent() {
  const ls = safeLocal();
  if (!ls) return false;
  try {
    return ls.getItem(CONSENT_KEY) === "yes";
  } catch {
    return false;
  }
}

export function setHealthConsent(granted) {
  const ls = safeLocal();
  if (!ls) return false;
  try {
    if (granted === true) {
      ls.setItem(CONSENT_KEY, "yes");
      return true;
    }
    ls.removeItem(CONSENT_KEY);
    ls.removeItem(SIGNALS_KEY); // revoke = forget
    return false;
  } catch {
    return false;
  }
}

// ── store ───────────────────────────────────────────────────────────────────

function readSignals() {
  if (!getHealthConsent()) return {};
  const ls = safeLocal();
  if (!ls) return {};
  try {
    const raw = ls.getItem(SIGNALS_KEY);
    const s = raw ? JSON.parse(raw) : {};
    return s && typeof s === "object" ? s : {};
  } catch {
    return {};
  }
}

function writeSignals(patch) {
  if (!getHealthConsent()) return false;
  const ls = safeLocal();
  if (!ls) return false;
  try {
    const cur = readSignals();
    ls.setItem(SIGNALS_KEY, JSON.stringify({ ...cur, ...patch }));
    return true;
  } catch {
    return false;
  }
}

/** Native writes last night's sleep. Consent-gated. */
export function setSleepReading({ hours, at = Date.now() } = {}) {
  if (typeof hours !== "number" || !Number.isFinite(hours)) return false;
  const ms = typeof at === "number" ? at : Date.parse(at);
  return writeSignals({ sleep: { hours: Math.max(0, hours), at: Number.isFinite(ms) ? ms : Date.now() } });
}

/**
 * Native writes an HRV reading. `belowBaseline` (producer-computed vs the user's
 * own baseline) is what we act on — an absolute HRV number is meaningless without
 * a personal baseline, so we NEVER infer "low" from the raw value here.
 */
export function setHrvReading({ value = null, belowBaseline = false, at = Date.now() } = {}) {
  const ms = typeof at === "number" ? at : Date.parse(at);
  return writeSignals({
    hrv: {
      value: typeof value === "number" && Number.isFinite(value) ? value : null,
      belowBaseline: belowBaseline === true,
      at: Number.isFinite(ms) ? ms : Date.now(),
    },
  });
}

function sameDay(reading) {
  return reading && typeof reading.at === "number" && dayKey(reading.at) === dayKey(Date.now());
}

export function getSleepReading() {
  const s = readSignals().sleep;
  return sameDay(s) ? s : null;
}
export function getHrvReading() {
  const h = readSignals().hrv;
  return sameDay(h) ? h : null;
}

// ── derivation into the shared bioFilter vocabulary ─────────────────────────

/**
 * Derive bioFilter tokens (reframe.js LOW_DEMAND_FLAGS vocabulary) from today's
 * health readings: a short night → "sleep"; HRV below the user's baseline →
 * "depleted". Comma-joined string, or null when nothing qualifies.
 */
export function getHardwareBioFilter() {
  const tokens = [];
  const sleep = getSleepReading();
  if (sleep && sleep.hours < SLEEP_LOW_HOURS) tokens.push("sleep");
  const hrv = getHrvReading();
  if (hrv && hrv.belowBaseline === true) tokens.push("depleted");
  return tokens.length ? tokens.join(", ") : null;
}

/**
 * The single bioFilter read for the AI context: the user's same-day StateCheck
 * body-states MERGED with device health signals, de-duplicated. Null when
 * neither source has anything. This is what reframeApi feeds the model.
 */
export function getCombinedBioFilter() {
  const parts = [];
  let stateCheck = null;
  try { stateCheck = getLatestBodyBioFilter(); } catch { stateCheck = null; }
  const hardware = getHardwareBioFilter();
  [stateCheck, hardware].forEach((s) => {
    if (typeof s === "string" && s.trim()) {
      s.split(",").forEach((t) => {
        const v = t.trim();
        if (v) parts.push(v);
      });
    }
  });
  const deduped = [...new Set(parts)];
  return deduped.length ? deduped.join(", ") : null;
}

export const _config = { CONSENT_KEY, SIGNALS_KEY, SLEEP_LOW_HOURS };
