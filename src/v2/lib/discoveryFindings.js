// src/v2/lib/discoveryFindings.js
//
// DISCOVERY FINDINGS — the OUTPUT side of the keystone loop (CANON §7.1a
// steps 2–4; Master Todo keystone, steps 2–3). The discovery engine
// (discoveryEngine.js) computes candidate patterns deterministically over the
// signal log; this module governs their lifecycle:
//
//   surfaced  → the user is shown one candidate in a reflection-safe place
//               (My Progress) phrased as plain correlation, and asked
//               "does this land?"
//   confirmed → the user said yes. ONLY confirmed findings may ever reach the
//               AI to voice (step 3) — the integrity gate: the AI never
//               "finds" a pattern, it only voices arithmetic the user ratified.
//   rejected  → the user said no. Rejected findings NEVER resurface (mirrors
//               the Concierge declineProposal "remembered → suppressed" rule).
//
// HARD INTEGRITY LINES:
//   • Detection is arithmetic (discoveryEngine), never AI. This module adds
//     no inference — it tracks user verdicts and phrases candidates plainly.
//   • Co-occurrence / sequence is CORRELATION, never causation. describeFinding
//     never says "causes," "because," or "makes you"; it says "tends to come
//     up with / before," and shows the count.
//   • The user is the authority. Nothing is confirmed without an explicit yes.
//
// Storage: localStorage key "stillform_discovery_findings" (stillform_-prefixed
// ⇒ auto-included in prefix-based cloud backup AND data-wipe). Readers tolerate
// missing fields (no schema-migration system yet).
//
// Shape: { confirmed: [{ key, candidate, confirmedAt }],
//          rejected:  [{ key, rejectedAt }] }

import { findPatterns } from "./discoveryEngine.js";
import { getSignals } from "./signalLog.js";

const STORAGE_KEY = "stillform_discovery_findings";

function safeLocalStorage() {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch (e) {
    /* privacy mode */
  }
  // node/test fallback: a bare global.localStorage may exist
  try {
    if (typeof localStorage !== "undefined") return localStorage;
  } catch (e) {
    /* not defined */
  }
  return null;
}

/**
 * Stable key for a candidate so confirm/reject survive recomputation.
 * Co-occurrence is unordered (sorted token keys); sequence is ordered.
 */
export function findingKey(candidate) {
  if (!candidate || typeof candidate !== "object") return null;
  const tk = (t) =>
    t && typeof t === "object"
      ? `${t.type || "?"}:${String(t.value || "").toLowerCase()}`
      : "?";
  if (candidate.kind === "co-occurrence") {
    const a = tk(candidate.a);
    const b = tk(candidate.b);
    const [lo, hi] = a < b ? [a, b] : [b, a];
    return `co|${lo}|${hi}`;
  }
  if (candidate.kind === "sequence") {
    return `seq|${tk(candidate.from)}>${tk(candidate.to)}`;
  }
  return null;
}

export function getFindingsStore() {
  const ls = safeLocalStorage();
  if (!ls) return { confirmed: [], rejected: [] };
  try {
    const raw = ls.getItem(STORAGE_KEY);
    if (!raw) return { confirmed: [], rejected: [] };
    const p = JSON.parse(raw);
    return {
      confirmed: Array.isArray(p && p.confirmed) ? p.confirmed : [],
      rejected: Array.isArray(p && p.rejected) ? p.rejected : [],
    };
  } catch (e) {
    return { confirmed: [], rejected: [] };
  }
}

function saveFindingsStore(store) {
  const ls = safeLocalStorage();
  if (!ls) return false;
  try {
    ls.setItem(
      STORAGE_KEY,
      JSON.stringify({
        confirmed: Array.isArray(store.confirmed) ? store.confirmed : [],
        rejected: Array.isArray(store.rejected) ? store.rejected : [],
      }),
    );
    return true;
  } catch (e) {
    return false;
  }
}

/** "confirmed" | "rejected" | null */
export function getFindingStatus(key) {
  if (!key) return null;
  const s = getFindingsStore();
  if (s.confirmed.some((f) => f && f.key === key)) return "confirmed";
  if (s.rejected.some((f) => f && f.key === key)) return "rejected";
  return null;
}

/** User said "yes, that lands." Idempotent; clears any prior rejection. */
export function confirmFinding(candidate) {
  const key = findingKey(candidate);
  if (!key) return false;
  const s = getFindingsStore();
  s.rejected = s.rejected.filter((f) => f && f.key !== key);
  if (!s.confirmed.some((f) => f && f.key === key)) {
    s.confirmed.push({ key, candidate, confirmedAt: new Date().toISOString() });
  }
  return saveFindingsStore(s);
}

/** User said "not really." Recorded so it NEVER resurfaces. Idempotent. */
export function rejectFinding(candidate) {
  const key = findingKey(candidate);
  if (!key) return false;
  const s = getFindingsStore();
  s.confirmed = s.confirmed.filter((f) => f && f.key !== key);
  if (!s.rejected.some((f) => f && f.key === key)) {
    s.rejected.push({ key, rejectedAt: new Date().toISOString() });
  }
  return saveFindingsStore(s);
}

/** Confirmed candidates (the only findings the AI may voice). */
export function getConfirmedFindings() {
  return getFindingsStore()
    .confirmed.map((f) => f && f.candidate)
    .filter(Boolean);
}

/** Humanize a token for display — quoted, in the user's own discrete word. */
function tokenWord(t) {
  return t && typeof t === "object" && t.value ? String(t.value) : "";
}

/**
 * Plain-language, CORRELATION-ONLY phrasing of a candidate. Never causal.
 * Returns "" for an unrecognized shape.
 */
export function describeFinding(candidate) {
  if (!candidate || typeof candidate !== "object") return "";
  if (candidate.kind === "co-occurrence") {
    const a = tokenWord(candidate.a);
    const b = tokenWord(candidate.b);
    if (!a || !b) return "";
    const n = candidate.support;
    return `“${a}” and “${b}” have come up together ${n} ${n === 1 ? "time" : "times"} in what you've logged.`;
  }
  if (candidate.kind === "sequence") {
    const from = tokenWord(candidate.from);
    const to = tokenWord(candidate.to);
    if (!from || !to) return "";
    const d = candidate.medianLagDays;
    const n = candidate.support;
    const window =
      d == null ? "later" : `about ${d} ${d === 1 ? "day" : "days"} later`;
    return `“${from}” has tended to show up, and then “${to}” ${window} — ${n} ${n === 1 ? "time" : "times"} so far.`;
  }
  return "";
}

/**
 * The next candidate to put in front of the user: the strongest pattern the
 * engine found that the user has neither confirmed nor rejected. null when the
 * engine isn't ready (too little data) or everything is already handled.
 * Honest empty state is the default — we surface nothing rather than force one.
 *
 * @param {object} [opts] forwarded to findPatterns (minEntries/minSupport/lagDays)
 * @returns {{ candidate, key, text }|null}
 */
export function getNextFinding(opts = {}) {
  const r = findPatterns(getSignals(), opts);
  if (!r || !r.ready || !Array.isArray(r.candidates)) return null;
  for (const candidate of r.candidates) {
    const key = findingKey(candidate);
    if (key && getFindingStatus(key) === null) {
      return { candidate, key, text: describeFinding(candidate) };
    }
  }
  return null;
}

/**
 * Confirmed findings as an AI-context string (step 3), or null. The AI may
 * VOICE these when relevant — it must never invent, extend, or voice an
 * unconfirmed one. Correlation framing is preserved in the describe text.
 */
export function formatConfirmedFindingsForAI() {
  const confirmed = getConfirmedFindings();
  if (!confirmed.length) return null;
  const lines = confirmed
    .map((c) => describeFinding(c))
    .filter(Boolean)
    .slice(0, 6);
  if (!lines.length) return null;
  return `PATTERNS THE USER HAS CONFIRMED (computed by the app from their own logged data — arithmetic, not your inference — and explicitly ratified by the user): ${lines.join(" ")}`;
}
