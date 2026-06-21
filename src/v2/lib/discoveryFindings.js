// src/v2/lib/discoveryFindings.js
//
// DISCOVERY FINDINGS — the OUTPUT side of the keystone loop (CANON §7.1a
// steps 2 + 4; Master Todo keystone, step 2). The deterministic engine
// (discoveryEngine.js) computes candidate patterns over the signal log; this
// module governs what happens to a candidate AFTER it's computed:
//
//   1. getTopUnsurfacedFinding() picks the strongest candidate the user has
//      NOT already decided on (the "does this land?" prompt draws from here).
//   2. The user CONFIRMS or REJECTS it (their call — the math found it, the
//      user is the authority on whether it's real).
//   3. confirmFinding / rejectFinding record the decision. A REJECTED finding
//      NEVER resurfaces (no nagging; the user said no). A CONFIRMED finding
//      also doesn't re-ask — it graduates to the confirmed set.
//   4. formatConfirmedFindingsForAI() exposes ONLY confirmed findings to the
//      AI so it can VOICE them (the §7.1a step-2 interpretation beat). The AI
//      never sees unconfirmed candidates — it can't introduce a pattern the
//      user hasn't validated. This is the integrity wall against hallucinated
//      "insights."
//
// describeFinding() turns a candidate into a plain, correlation-NEVER-causation
// sentence — used by the surface and (in confirmed form) by the AI context.
//
// Storage: localStorage key "stillform_discovery_findings" (stillform_-prefixed
// ⇒ auto cloud-sync + data-wipe). Shape:
//   { decisions: { [key]: { decision: "confirmed"|"rejected", candidate, decidedAt } } }
// key is a stable, content-derived id so the same pattern maps to the same
// decision across sessions. Fail-silent.

import { findPatterns } from "./discoveryEngine.js";
import { getSignals } from "./signalLog.js";

const STORAGE_KEY = "stillform_discovery_findings";

function safeLocalStorage() {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch (e) {
    /* privacy mode */
  }
  return null;
}

function tokenKey(t) {
  return `${t.type}:${String(t.value).toLowerCase()}`;
}

/** Stable, content-derived key. Co-occurrence is unordered; sequence is ordered. */
export function candidateKey(c) {
  if (!c || typeof c !== "object") return null;
  if (c.kind === "co-occurrence" && c.a && c.b) {
    const [a, b] = [tokenKey(c.a), tokenKey(c.b)].sort();
    return `co|${a}|${b}`;
  }
  if (c.kind === "sequence" && c.from && c.to) {
    return `seq|${tokenKey(c.from)}>${tokenKey(c.to)}`;
  }
  return null;
}

export function getFindingsStore() {
  const ls = safeLocalStorage();
  if (!ls) return { decisions: {} };
  try {
    const raw = ls.getItem(STORAGE_KEY);
    if (!raw) return { decisions: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.decisions !== "object" || !parsed.decisions) {
      return { decisions: {} };
    }
    return { decisions: parsed.decisions };
  } catch (e) {
    return { decisions: {} };
  }
}

function saveFindingsStore(store) {
  const ls = safeLocalStorage();
  if (!ls) return false;
  try {
    if (!store || typeof store.decisions !== "object") return false;
    ls.setItem(STORAGE_KEY, JSON.stringify({ decisions: store.decisions }));
    return true;
  } catch (e) {
    return false;
  }
}

function record(candidate, decision) {
  const key = candidateKey(candidate);
  if (!key) return null;
  const store = getFindingsStore();
  store.decisions[key] = { decision, candidate, decidedAt: new Date().toISOString() };
  return saveFindingsStore(store) ? store.decisions[key] : null;
}

export function confirmFinding(candidate) {
  return record(candidate, "confirmed");
}

export function rejectFinding(candidate) {
  return record(candidate, "rejected");
}

/** "confirmed" | "rejected" | null for a candidate (or its key). */
export function getDecision(candidateOrKey) {
  const key = typeof candidateOrKey === "string" ? candidateOrKey : candidateKey(candidateOrKey);
  if (!key) return null;
  const d = getFindingsStore().decisions[key];
  return d ? d.decision : null;
}

/** All confirmed candidates (the only ones the AI may voice). */
export function getConfirmedFindings() {
  const { decisions } = getFindingsStore();
  return Object.values(decisions)
    .filter((d) => d && d.decision === "confirmed" && d.candidate)
    .map((d) => d.candidate);
}

/**
 * The strongest candidate the user has NOT yet decided on — what the
 * "does this land?" surface should ask about next. Returns null when the
 * engine isn't ready (too little data) or every candidate is already decided.
 *
 * Accepts explicit entries for testing; defaults to the live signal log.
 */
export function getTopUnsurfacedFinding(entries = null, opts = {}) {
  const sigs = Array.isArray(entries) ? entries : getSignals();
  const { ready, candidates } = findPatterns(sigs, opts);
  if (!ready || !candidates.length) return null;
  const { decisions } = getFindingsStore();
  for (const c of candidates) {
    const key = candidateKey(c);
    if (key && !decisions[key]) return c; // first undecided = strongest (sorted)
  }
  return null;
}

function titleCase(s) {
  const str = String(s || "");
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Plain-language description of a candidate. CORRELATION, NEVER CAUSATION —
 * "tends to," "around," "so far"; never "because" / "causes" / "makes you."
 */
export function describeFinding(c) {
  if (!c || typeof c !== "object") return "";
  if (c.kind === "co-occurrence") {
    return `${titleCase(c.a.value)} and ${String(c.b.value).toLowerCase()} have shown up together ${c.support} times.`;
  }
  if (c.kind === "sequence") {
    const lag = c.medianLagDays;
    const when =
      lag === 0 ? "the same day" :
      lag === 1 ? "about a day later" :
      `about ${lag} days later`;
    return `${titleCase(c.from.value)} has tended to come before ${String(c.to.value).toLowerCase()} — ${when}, ${c.support} times so far.`;
  }
  return "";
}

/**
 * Confirmed findings as an AI-context string — the ONLY discovery data the AI
 * sees. The AI may reference these (the user already validated them); it must
 * NEVER introduce a pattern not in this list. null when there are none.
 */
export function formatConfirmedFindingsForAI(limit = 5) {
  const confirmed = getConfirmedFindings().slice(0, limit);
  if (!confirmed.length) return null;
  const lines = confirmed.map((c) => `- ${describeFinding(c)}`).join("\n");
  return `Confirmed patterns (the user validated these from their own logged data — correlation only, never causation). You MAY reference one if the moment genuinely calls for it, in plain language, as something they already know about themselves. You must NEVER introduce a pattern that is not on this list, and never frame any of these as cause-and-effect:\n${lines}`;
}
