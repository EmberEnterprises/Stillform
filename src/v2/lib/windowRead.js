/*
 * windowRead.js — the both-authored "your window" data layer.
 *
 * Two reads of your own activation, kept as one small profile:
 *   - tilt          — when you're outside your window, which way you tend to go:
 *                     too revved (wound up) or too shut-down (flat). The science
 *                     says this is state-dependent, not a fixed identity, so a
 *                     third honest option exists: it shifts.
 *   - earliestSignal — the body place activation tends to show up FIRST for you
 *                      (your tell). Catching it early is the highest-leverage
 *                      moment to correct.
 *
 * Science (already vetted in the Library): the window of tolerance — a zone of
 * arousal where naming and reframing are possible; outside it the higher work
 * gets hard (Siegel 1999; Porges 2011 on the shut-down end). The WORK the
 * surface attaches: your tilt tells you which way to correct (revved → settle;
 * flat → activate), and your earliest signal is where you catch it soonest.
 *
 * Clinical-grade evaluation underneath, self-mastery delivery on top — plain
 * language only (revved / shut-down / your tell), never "hyperarousal" /
 * "hypoarousal" / clinical / trauma terms on the surface.
 *
 * BOTH user AND AI (the standing rule):
 *   - USER path — the user sets their own tilt and names their own earliest
 *                 signal. Fully functional, no AI.
 *   - AI path   — Reframe can SURFACE a candidate (a tilt or a tell it heard in
 *                 the user's own words) as a PENDING proposal the user confirms
 *                 or dismisses. Modeled here so the surface is ready; the
 *                 Reframe-side generation wires next.
 *
 * NOTE (integrity): the anatomical "where it shows first" is NOT collected
 * anywhere today (the old signal-mapping step was never rebuilt; the signal
 * log's `body` field holds physical-state flags, not locations). So
 * earliestSignal is user-authored / AI-surfaced-from-words — never fabricated
 * from log data we don't have.
 *
 * Single mutable profile (not a list). Honest-empty, fail-silent.
 * stillform_-prefixed so it rides the existing cloud-sync / wipe path.
 */

const STORE_KEY = "stillform_v2_window_read";
const MAX_LEN = 160;
const TILTS = ["revved", "flat", "shifts"]; // wound up / shut down / state-dependent

function readStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { tilt: null, earliestSignal: null, source: null, updatedAt: null, pending: null };
    const s = JSON.parse(raw);
    return {
      tilt: TILTS.includes(s && s.tilt) ? s.tilt : null,
      earliestSignal: typeof (s && s.earliestSignal) === "string" ? s.earliestSignal : null,
      source: s && typeof s.source === "object" ? s.source : null,
      updatedAt: s && typeof s.updatedAt === "number" ? s.updatedAt : null,
      pending: s && typeof s.pending === "object" ? s.pending : null,
    };
  } catch {
    return { tilt: null, earliestSignal: null, source: null, updatedAt: null, pending: null };
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

function clean(v) {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t) return null;
  return t.slice(0, MAX_LEN);
}

/** The current read. Honest-empty: { tilt:null, earliestSignal:null }. */
export function getWindowRead() {
  const s = readStore();
  return { tilt: s.tilt, earliestSignal: s.earliestSignal };
}

/** True once the user has set at least one of the two reads. */
export function hasWindowRead() {
  const s = readStore();
  return Boolean(s.tilt || s.earliestSignal);
}

/** Set the tilt (revved | flat | shifts). Invalid → no-op, returns null. */
export function setTilt(tilt, src = "user") {
  if (!TILTS.includes(tilt)) return null;
  const s = readStore();
  s.tilt = tilt;
  s.source = { ...(s.source || {}), tilt: src === "ai" ? "ai" : "user" };
  s.updatedAt = Date.now();
  if (s.pending && s.pending.tilt) s.pending = stripPending(s.pending, "tilt");
  writeStore(s);
  return s.tilt;
}

/** Name the earliest signal (the body tell). Blank → no-op, returns null. */
export function setEarliestSignal(text, src = "user") {
  const t = clean(text);
  if (!t) return null;
  const s = readStore();
  s.earliestSignal = t;
  s.source = { ...(s.source || {}), earliestSignal: src === "ai" ? "ai" : "user" };
  s.updatedAt = Date.now();
  if (s.pending && s.pending.earliestSignal) s.pending = stripPending(s.pending, "earliestSignal");
  writeStore(s);
  return s.earliestSignal;
}

/** Clear one field (user removed it). */
export function clearField(field) {
  if (field !== "tilt" && field !== "earliestSignal") return false;
  const s = readStore();
  s[field] = null;
  if (s.source) delete s.source[field];
  s.updatedAt = Date.now();
  return writeStore(s);
}

/** Reset the whole read. */
export function clearWindowRead() {
  return writeStore({ tilt: null, earliestSignal: null, source: null, updatedAt: null, pending: null });
}

// ── AI candidate (both: AI proposes, user decides) ──

function stripPending(pending, field) {
  const next = { ...pending };
  delete next[field];
  return Object.keys(next).filter((k) => k !== "proposedAt").length ? next : null;
}

/**
 * Stash an AI-proposed candidate (a tilt and/or an earliest signal it heard in
 * the user's own words) as PENDING. Refuses to propose a field the user has
 * already set. Returns the stored pending object or null. Plain validation:
 * tilt must be a valid enum; signal must be non-blank.
 */
export function setPendingCandidate({ tilt, earliestSignal } = {}) {
  const s = readStore();
  const cand = {};
  if (TILTS.includes(tilt) && !s.tilt) cand.tilt = tilt;
  const sig = clean(earliestSignal);
  if (sig && !s.earliestSignal) cand.earliestSignal = sig;
  if (!cand.tilt && !cand.earliestSignal) return null;
  cand.proposedAt = Date.now();
  s.pending = cand;
  writeStore(s);
  return cand;
}

/** The pending AI candidate, or null. Self-heals: drops fields the user has since set. */
export function getPendingCandidate() {
  const s = readStore();
  let p = s.pending;
  if (!p) return null;
  if (p.tilt && s.tilt) p = stripPending(p, "tilt");
  if (p && p.earliestSignal && s.earliestSignal) p = stripPending(p, "earliestSignal");
  if (p !== s.pending) {
    s.pending = p;
    writeStore(s);
  }
  return p;
}

/** Clear the pending candidate (after the user acts on it). */
export function clearPendingCandidate() {
  const s = readStore();
  if (s.pending == null) return false;
  s.pending = null;
  return writeStore(s);
}

/**
 * Format the window read for the Reframe AI context. Returns null when empty.
 * The user's OWN read — the AI is aware so it never re-proposes what's set and
 * can speak to the right correction (revved → settle; flat → activate).
 */
export function formatWindowReadForAI() {
  const s = readStore();
  if (!s.tilt && !s.earliestSignal) return null;
  const parts = [];
  if (s.tilt) {
    const word = s.tilt === "revved" ? "too revved (wound up)" : s.tilt === "flat" ? "too shut-down (flat)" : "it shifts with the state";
    parts.push(`tends to tip: ${word}`);
  }
  if (s.earliestSignal) parts.push(`earliest body tell: ${s.earliestSignal}`);
  return parts.join("; ");
}
