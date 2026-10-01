/**
 * shiftLog.js — where you land after a session (built 2026-10-01, Arlin: "yes").
 *
 * The audit found the app never asked how a person felt AFTER a session, so
 * "progress" was counts, not change (BODY_SCAN_WHAT_SHIFTED and the
 * three-category feed shipped in v1 and died with it). This is the v2
 * rebuild, in the stranger-test shape: ONE optional tap at Close, no typing,
 * no new screen. Pre-state = the chip the session opened with. Post-state =
 * the chip tapped here. Stored locally, read by My Progress and by the AI
 * context (one short line). Never a score; "landed softer" is the only
 * sentence, and only ever against the person's own record.
 *
 * Direction is read on Russell's circumplex (the chip system's own frame):
 *   softer  = moved toward low-arousal / positive (settled, focused)
 *   same    = same chip, or both in the same band
 *   harder  = moved toward high-arousal negative (anxious, angry, stuck)
 * "unsure" and "mixed" are neutral: a move into them from a hot state is
 * softer; from settled it is harder; between them is same.
 */

export const SHIFT_KEY = "stillform_v2_shift_log";
const MAX = 400;

// Arousal/valence band per chip: 0 = settled/positive, 1 = neutral, 2 = hot/negative.
const BAND = Object.freeze({
  settled: 0, focused: 0, excited: 0,
  mixed: 1, unsure: 1, flat: 1, distant: 1,
  anxious: 2, angry: 2, stuck: 2,
});

export function classifyShift(pre, post) {
  const a = BAND[String(pre || "").toLowerCase()];
  const b = BAND[String(post || "").toLowerCase()];
  if (a === undefined || b === undefined) return null;
  if (b < a) return "softer";
  if (b > a) return "harder";
  return "same";
}

function read() {
  try { const r = localStorage.getItem(SHIFT_KEY); const a = r ? JSON.parse(r) : []; return Array.isArray(a) ? a : []; }
  catch { return []; }
}
function write(list) {
  try { localStorage.setItem(SHIFT_KEY, JSON.stringify(list.slice(-MAX))); } catch { /* storage blocked — fail silent */ }
}

/**
 * Record a landing. Idempotent per sessionId (a second tap replaces).
 * @returns {{pre:string,post:string,direction:string,ts:number,sessionId:string|null}|null}
 */
export function recordShift({ pre, post, sessionId = null, beat = null, now = Date.now() } = {}) {
  const direction = classifyShift(pre, post);
  if (!direction) return null;
  const rec = { pre: String(pre).toLowerCase(), post: String(post).toLowerCase(), direction, beat: beat || null, sessionId, ts: now };
  const list = read().filter((r) => !(sessionId && r.sessionId === sessionId));
  list.push(rec); write(list);
  return rec;
}

export function getShifts() { return read(); }

/**
 * Summary against the person's own record (last 30 days by default).
 * @returns {{ total:number, softer:number, same:number, harder:number, lastFive:string[] }}
 */
export function getShiftSummary({ days = 30, now = Date.now() } = {}) {
  const since = now - days * 24 * 60 * 60 * 1000;
  const list = read().filter((r) => r.ts >= since);
  const count = (d) => list.filter((r) => r.direction === d).length;
  return {
    total: list.length,
    softer: count("softer"),
    same: count("same"),
    harder: count("harder"),
    lastFive: list.slice(-5).map((r) => r.direction),
  };
}

/** One quiet sentence for My Progress. Null until there is something to say. */
export function getShiftLine(opts = {}) {
  const s = getShiftSummary(opts);
  if (s.total < 3) return null;
  const n = s.total;
  if (s.softer === n) return `All ${n} sessions this month ended softer than they started.`;
  if (s.softer > 0) return `${s.softer} of ${n} sessions this month ended softer than they started; ${s.same} landed where they began.`;
  if (s.same === n) return `${n} sessions this month ended where they began. That is a steady floor, not a stall.`;
  return `${n} sessions this month; ${s.harder} ended harder than they started. Worth a look at what those had in common.`;
}

/** Compact context for the AI (never a number the AI should quote). */
export function formatShiftForAI(opts = {}) {
  const s = getShiftSummary(opts);
  if (s.total < 3) return null;
  return `LANDINGS (user-recorded where they land after sessions, last 30 days, own record only — use as background, never quote the counts): ${s.softer} softer, ${s.same} same, ${s.harder} harder of ${s.total}; last five: ${s.lastFive.join(", ")}.`;
}
