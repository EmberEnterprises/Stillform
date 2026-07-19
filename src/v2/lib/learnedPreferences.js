/**
 * learnedPreferences — P12 (2026-07-19). "Never asks twice."
 *
 * Deterministic habit-reads from the user's OWN record. No model, no inference
 * about who they are: pure counting of what they have repeatedly done, used to
 * pre-select the thing they always pick and to go quiet where they always wave
 * the app off.
 *
 * Two laws hold here:
 *   1. TRANSPARENT — every read is surfaced in the Concierge room in plain
 *      language ("I've noticed you…"), never applied invisibly.
 *   2. REVERSIBLE — a learned preference is a default, never a lock. The user
 *      can always choose otherwise, and choosing otherwise re-teaches it.
 *
 * Reads only; writing the applied preference is the caller's business.
 */

import { getSessions } from "./sessions.js";

const MIN_OBSERVATIONS = 3; // below this it's a coincidence, not a habit
const CONSISTENCY = 0.8;    // "always" means at least this share of the time

function safeSessions() {
  try {
    const s = getSessions();
    return Array.isArray(s) ? s : [];
  } catch {
    return [];
  }
}

/**
 * The mode/tool the person consistently opens. Returns null until there's
 * enough evidence — an honest empty beats a confident guess.
 *
 * @returns {{ value:string, count:number, share:number, line:string }|null}
 */
export function getHabitualEntry() {
  const sessions = safeSessions();
  if (sessions.length < MIN_OBSERVATIONS) return null;

  const counts = new Map();
  let total = 0;
  for (const s of sessions) {
    const v = s && (s.mode || s.tool || s.entry);
    if (typeof v !== "string" || !v) continue;
    counts.set(v, (counts.get(v) || 0) + 1);
    total += 1;
  }
  if (total < MIN_OBSERVATIONS) return null;

  let best = null;
  for (const [value, count] of counts) {
    if (!best || count > best.count) best = { value, count };
  }
  if (!best) return null;

  const share = best.count / total;
  if (best.count < MIN_OBSERVATIONS || share < CONSISTENCY) return null;

  return {
    value: best.value,
    count: best.count,
    share: Math.round(share * 100) / 100,
    line: `You almost always start with ${best.value}. It's set as your default — pick anything else and that changes.`,
  };
}

/**
 * A weekday the person consistently dismisses the concierge on. Their record
 * decides the day — nothing here assumes a Mon–Fri week (no-default-week law).
 *
 * @param {Array<{at:number|string}>} dismissals  timestamped dismissal records
 * @returns {{ dayIndex:number, dayLabel:string, count:number, line:string }|null}
 */
export function getQuietDay(dismissals) {
  const list = Array.isArray(dismissals) ? dismissals : [];
  if (list.length < MIN_OBSERVATIONS) return null;

  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const counts = new Map();
  let total = 0;
  for (const d of list) {
    const t = d && (typeof d.at === "number" ? d.at : Date.parse(d.at));
    if (!Number.isFinite(t)) continue;
    const idx = new Date(t).getDay();
    counts.set(idx, (counts.get(idx) || 0) + 1);
    total += 1;
  }
  if (total < MIN_OBSERVATIONS) return null;

  let best = null;
  for (const [dayIndex, count] of counts) {
    if (!best || count > best.count) best = { dayIndex, count };
  }
  if (!best || best.count < MIN_OBSERVATIONS) return null;
  if (best.count / total < CONSISTENCY) return null;

  return {
    dayIndex: best.dayIndex,
    dayLabel: DAYS[best.dayIndex],
    count: best.count,
    line: `You wave this off most ${DAYS[best.dayIndex]}s. It'll stay quiet then unless you say otherwise.`,
  };
}

/** Everything learned, for the room's transparency panel. Empty when nothing is. */
export function getLearnedPreferences(dismissals) {
  const out = [];
  const entry = getHabitualEntry();
  if (entry) out.push({ id: "habitual-entry", line: entry.line });
  const quiet = getQuietDay(dismissals);
  if (quiet) out.push({ id: "quiet-day", line: quiet.line });
  return out;
}
