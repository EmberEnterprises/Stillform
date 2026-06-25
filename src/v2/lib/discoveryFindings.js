/**
 * discoveryFindings — the OUTPUT side of the keystone loop (Step 2).
 *
 * The discovery engine (discoveryEngine.js) computes candidate patterns from the
 * signal log — pure arithmetic, no AI, co-occurrence never causation. This module
 * is the user-authority layer on top: it picks ONE undecided candidate to surface,
 * and records the user's confirm / reject so that:
 *   - rejected candidates NEVER resurface, and
 *   - only CONFIRMED findings propagate (Step 3 feeds those to the AI to voice).
 *
 * Nothing here infers or diagnoses. The engine found it by math; the user decides
 * whether it lands. Fail-silent throughout.
 */

import { getSignals } from "./signalLog.js";
import { findPatterns } from "./discoveryEngine.js";

const STORAGE_KEY = "stillform_discovery_findings";

/** Stable token key, e.g. {type:"feel", value:"Anxious"} -> "feel:anxious". */
function keyOf(node) {
  if (!node) return "";
  return `${node.type}:${String(node.value == null ? "" : node.value).toLowerCase().trim()}`;
}

/**
 * Deterministic, order-independent id for a candidate.
 * co-occurrence: the two token keys sorted (so a|b === b|a).
 * sequence: directional (from > to — order is meaningful).
 */
export function candidateId(c) {
  if (!c) return "";
  if (c.kind === "sequence") return `seq:${keyOf(c.from)}>${keyOf(c.to)}`;
  const ka = keyOf(c.a);
  const kb = keyOf(c.b);
  const [lo, hi] = ka <= kb ? [ka, kb] : [kb, ka];
  return `co:${lo}|${hi}`;
}

/** Plain-language phrasing — co-occurrence NEVER causation; the user's own tokens. */
export function candidateLabel(c) {
  if (!c) return "";
  if (c.kind === "sequence") {
    const n = Math.max(1, Math.round(Number(c.medianLagDays) || 1));
    return `\u201c${c.to.value}\u201d tends to follow \u201c${c.from.value}\u201d by about ${n} ${n === 1 ? "day" : "days"}.`;
  }
  return `\u201c${c.a.value}\u201d and \u201c${c.b.value}\u201d tend to show up near each other.`;
}

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { confirmed: [], rejected: [] };
    const s = JSON.parse(raw);
    return {
      confirmed: Array.isArray(s && s.confirmed) ? s.confirmed : [],
      rejected: Array.isArray(s && s.rejected) ? s.rejected : [],
    };
  } catch {
    return { confirmed: [], rejected: [] };
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

/** Confirmed findings — the only ones that propagate (Step 3 reads this). */
export function getConfirmedFindings() {
  return readStore().confirmed;
}

/**
 * Step 3: format confirmed findings for the Reframe AI context. Returns the
 * confirmed findings' plain-language labels (most-recently-confirmed first,
 * capped to keep context lean), or null if none. The AI may VOICE these — the
 * sanctioned exception to "never volunteer a pattern" — because the math found
 * them and the user confirmed them. Co-occurrence labels, never causation.
 */
export function formatConfirmedFindingsForAI() {
  const confirmed = getConfirmedFindings();
  if (!Array.isArray(confirmed) || confirmed.length === 0) return null;
  const labels = confirmed
    .slice()
    .sort((a, b) => (b.confirmedAt || 0) - (a.confirmedAt || 0))
    .slice(0, 5)
    .map((f) => f && f.label)
    .filter((l) => typeof l === "string" && l.trim());
  return labels.length ? labels.join(" ") : null;
}

export function confirmFinding(candidate) {
  const id = candidateId(candidate);
  if (!id) return false;
  const store = readStore();
  if (!store.confirmed.some((f) => f.id === id)) {
    store.confirmed.push({
      id,
      kind: candidate.kind,
      label: candidateLabel(candidate),
      confirmedAt: Date.now(),
    });
  }
  store.rejected = store.rejected.filter((r) => r !== id);
  return writeStore(store);
}

export function rejectFinding(candidate) {
  const id = candidateId(candidate);
  if (!id) return false;
  const store = readStore();
  if (!store.rejected.includes(id)) store.rejected.push(id);
  return writeStore(store);
}

/**
 * The next candidate to surface: the top-support, ready candidate the user has not
 * already confirmed or rejected. Returns null when not ready (honest empty state),
 * or when every candidate has been decided.
 */
export function getNextCandidate(opts = {}) {
  try {
    const result = findPatterns(getSignals(), opts);
    if (!result || !result.ready || !Array.isArray(result.candidates)) return null;
    const store = readStore();
    const decided = new Set([...store.confirmed.map((f) => f.id), ...store.rejected]);
    for (const c of result.candidates) {
      if (!decided.has(candidateId(c))) return c;
    }
    return null;
  } catch {
    return null;
  }
}
