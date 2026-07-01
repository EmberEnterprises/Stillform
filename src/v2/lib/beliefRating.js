/**
 * beliefRating.js — CBT-conditioning layer core (Precision Framework §5 #4).
 *
 * The thought-record's measurable spine. A person rates how strongly they
 * believe a thought (0-100) — that rating IS a precision self-report (framework
 * §2). They examine the evidence, then re-rate. The DROP in the number is the
 * precision being lowered, made visible. This module stores completed records;
 * it never decides the flow, the copy, or what a delta means.
 *
 * SCOPE: deterministic store only. The thought-record FLOW (rate → examine →
 * re-rate, inside the spine), the behavioral-experiment design, and all voice
 * are Arlin's — deferred. Same data-layer-first pattern as predictionErrors.js
 * preceding its mirrors.
 *
 * Record shape: { id, thought, before, after, delta, evidence, markedAt }
 *   before/after : integers 0-100 (belief strength %). after may be null if
 *                  only the initial rating was captured.
 *   delta        : after - before when both present (negative = precision
 *                  dropped), else null. Computed here, never by a caller.
 *   usedOtherRead: true when an AI counter-case ("the other read") was shown to
 *                  the person before they re-rated. Lets us later look at whether
 *                  an offered counter-case moves belief more than self-generated
 *                  evidence alone. Correlational only.
 */

const STORAGE_KEY = "stillform_belief_ratings";

function safeLocal() {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch { /* access can throw in sandboxed contexts */ }
  try {
    if (typeof localStorage !== "undefined") return localStorage;
  } catch { /* ignore */ }
  return null;
}

function makeId() {
  return `br_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Clamp to an integer 0-100, or null if not a finite number. */
function clampPct(v) {
  if (typeof v !== "number" || !Number.isFinite(v)) return null;
  return Math.max(0, Math.min(100, Math.round(v)));
}

/** Read the log. Always returns a valid shape; fail-silent. */
export function getBeliefRatings() {
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
 * Record a belief rating. `before` is required (the initial precision
 * self-report); `after` is optional (the re-rating). Returns the stored record,
 * or null if the input is unusable (fail-silent — never throws to the caller).
 *
 * @param {{thought: string, before: number, after?: number|null, evidence?: string, usedOtherRead?: boolean}} input
 */
export function recordBeliefRating({ thought, before, after = null, evidence = "", usedOtherRead = false } = {}) {
  const cleanThought = typeof thought === "string" ? thought.trim() : "";
  const beforePct = clampPct(before);
  if (!cleanThought || beforePct === null) return null;

  const afterPct = clampPct(after);
  const delta = afterPct === null ? null : afterPct - beforePct;
  const cleanEvidence = typeof evidence === "string" ? evidence.trim().slice(0, 2000) : "";

  const entry = {
    id: makeId(),
    thought: cleanThought.slice(0, 2000),
    before: beforePct,
    after: afterPct,
    delta,
    evidence: cleanEvidence,
    usedOtherRead: usedOtherRead === true,
    markedAt: new Date().toISOString(),
  };

  const ls = safeLocal();
  if (!ls) return entry; // computed, but can't persist — fail-silent
  try {
    const store = getBeliefRatings();
    store.entries.push(entry);
    ls.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* persistence failure is non-fatal */
  }
  return entry;
}

/**
 * Update an existing record with the re-rating (the "examine, then re-rate"
 * second beat). Recomputes delta. Returns the updated record, or null if not
 * found / unusable. Fail-silent.
 *
 * @param {string} id
 * @param {{after: number, evidence?: string}} input
 */
export function setReRating(id, { after, evidence } = {}) {
  const afterPct = clampPct(after);
  if (typeof id !== "string" || afterPct === null) return null;

  const ls = safeLocal();
  if (!ls) return null;
  try {
    const store = getBeliefRatings();
    const rec = store.entries.find((e) => e && e.id === id);
    if (!rec) return null;
    rec.after = afterPct;
    rec.delta = afterPct - rec.before;
    if (typeof evidence === "string" && evidence.trim()) rec.evidence = evidence.trim().slice(0, 2000);
    ls.setItem(STORAGE_KEY, JSON.stringify(store));
    return rec;
  } catch {
    return null;
  }
}

/** Most-recent-first, capped. Fail-silent. */
export function getRecentBeliefRatings(n = 5) {
  const { entries } = getBeliefRatings();
  return entries
    .slice()
    .sort((a, b) => (Date.parse(b.markedAt) || 0) - (Date.parse(a.markedAt) || 0))
    .slice(0, Math.max(0, n));
}

export function getBeliefRatingCount() {
  return getBeliefRatings().entries.length;
}

/**
 * Honest signal: does an offered counter-case ("the other read") move belief
 * more than self-generated evidence alone? Compares the average belief-drop of
 * records where the other read was shown vs where it wasn't. Only records with
 * a computed delta (both ratings present) count. Returns null when either side
 * has nothing to compare.
 *
 * Correlational, NOT causal — people who ask for the other read may differ from
 * those who don't, and this can't separate that out. A signal to look at, never
 * proof. (A negative avgDelta means belief dropped, which is the intended move.)
 *
 * @returns {{withOtherRead:{n:number,avgDelta:number}, withoutOtherRead:{n:number,avgDelta:number}} | null}
 */
export function getOtherReadEffect() {
  const { entries } = getBeliefRatings();
  const withOR = [];
  const withoutOR = [];
  for (const e of entries) {
    if (!e || typeof e.delta !== "number") continue;
    (e.usedOtherRead === true ? withOR : withoutOR).push(e.delta);
  }
  if (withOR.length === 0 || withoutOR.length === 0) return null;
  const avg = (a) => a.reduce((s, x) => s + x, 0) / a.length;
  const round1 = (x) => Math.round(x * 10) / 10;
  return {
    withOtherRead: { n: withOR.length, avgDelta: round1(avg(withOR)) },
    withoutOtherRead: { n: withoutOR.length, avgDelta: round1(avg(withoutOR)) },
  };
}
