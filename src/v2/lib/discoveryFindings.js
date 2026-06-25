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
import { findPatterns, findDisconfirmingInstance } from "./discoveryEngine.js";

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


/**
 * M1 — the reconsolidation-window mismatch. For each CONFIRMED finding, ask the
 * engine whether the most-recent occurrence of its trigger broke the pattern
 * (the expected token did not follow). Returns the most-recent such "likely
 * break" with its finding label, or null. Computation only — the AI suggests
 * it and the user confirms; the app never asserts a break.
 */
export function getReconsolidationMismatch() {
  try {
    const signals = getSignals();
    const result = findPatterns(signals);
    if (!result || !result.ready || !Array.isArray(result.candidates)) return null;
    const confirmedIds = new Set(readStore().confirmed.map((f) => f.id));
    if (!confirmedIds.size) return null;

    let best = null;
    for (const c of result.candidates) {
      if (!confirmedIds.has(candidateId(c))) continue;
      const m = findDisconfirmingInstance(signals, c);
      if (!m) continue;
      const t = m.triggerLoggedAt ? new Date(m.triggerLoggedAt).getTime() : 0;
      if (!best || t > best._t) best = { ...m, label: candidateLabel(c), _t: t };
    }
    if (!best) return null;
    delete best._t;
    return best;
  } catch {
    return null;
  }
}

/**
 * M1 context field — the computed likely mismatch for the Reframe AI to
 * SUGGEST (never assert), timed to the reconsolidation window, for the user to
 * confirm. Returns null when there is no current mismatch. The HARD-RULE
 * wording below is conservative scaffolding — Arlin owns the final voice.
 */
export function formatReconsolidationMismatchForAI() {
  const m = getReconsolidationMismatch();
  if (!m || !m.label || !(m.trigger && m.trigger.value)) return null;
  const triggerVal = m.trigger.value;
  return `LIKELY MISMATCH (computed from the user's OWN logged history — arithmetic, not your guess): a confirmed pattern of theirs is "${m.label}" The most recent time "${triggerVal}" came up, the expected part did NOT appear to follow in what they logged. IF the user is working this exact thread in this session, you MAY surface this ONCE, SUGGESTIVELY, timed to the moment they are activated on it — as something that is LIKELY the case for them to AGREE with or correct, never as a verdict: offer the pattern, then ask whether this time felt like the usual or different. The QUESTION is the point; their agreement is what makes it real. HARD RULES: only on this confirmed pattern; once; as a question; never a verdict or diagnosis; reflect, never grade ("you broke it" / "you failed"); never invent or extend beyond exactly this; the app owns the counts — do not fabricate numbers. If they are not on this thread, do not raise it.`;
}
