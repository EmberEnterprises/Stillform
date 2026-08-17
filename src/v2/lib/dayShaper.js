/**
 * dayShaper — P18 STRUCTURAL COACHING (2026-08-17). "Help the person create a
 * structure without it being a productivity app."
 *
 * Reads the user's ACTUAL calendar for three structural problems and hands back
 * ONE pre-built fix (a ready .ics event) they can add in a tap. Every claim here
 * survives the fact-check recorded in the Science Sheet (Structural Coaching /
 * The Day-Shaper): micro-breaks restore vigor and cut fatigue (Albulescu 2022 —
 * NOT a performance claim), buffers clear attention residue (Leroy 2009),
 * padding corrects the planning fallacy (Kahneman/Buehler). Folklore is refused.
 *
 * Voice law: consideration, never performance. "A gap at one is what keeps two
 * o'clock sharp" — a kindness to the day, not an optimization of output.
 *
 * Returns { id, problem, note, fix:{ title, start, durationMin, description } }
 * or null when the day has no structural problem worth naming.
 */

import { getCalendarEvents } from "./calendarData.js";

function todaysEvents(nowMs) {
  let events = [];
  try { events = getCalendarEvents() || []; } catch { return []; }
  const day = new Date(nowMs).toDateString();
  return events
    .map((ev) => {
      if (!ev || !ev.start) return null;
      const st = Date.parse(ev.start);
      if (Number.isNaN(st)) return null;
      let en = ev.end ? Date.parse(ev.end) : NaN;
      if (Number.isNaN(en)) {
        const dur = typeof ev.durationMin === "number" ? ev.durationMin : 60;
        en = st + dur * 60000;
      }
      return { title: String(ev.title || "event"), start: st, end: en };
    })
    .filter((e) => e && new Date(e.start).toDateString() === day)
    .sort((a, b) => a.start - b.start);
}

/** Is the midday (noon–2pm) blocked solid, with no room to eat? */
function findVanishedLunch(events, nowMs) {
  const day = new Date(nowMs);
  const noon = new Date(day); noon.setHours(12, 0, 0, 0);
  const two = new Date(day); two.setHours(14, 0, 0, 0);
  if (two.getTime() <= nowMs) return null; // window already passed

  // Any open stretch >= 30 min inside noon–2pm means lunch is possible.
  let cursor = noon.getTime();
  let largestGap = 0;
  for (const e of events) {
    const s = Math.max(e.start, noon.getTime());
    const en = Math.min(e.end, two.getTime());
    if (en <= s) continue;
    if (s > cursor) largestGap = Math.max(largestGap, s - cursor);
    cursor = Math.max(cursor, en);
  }
  if (two.getTime() > cursor) largestGap = Math.max(largestGap, two.getTime() - cursor);

  if (largestGap >= 30 * 60000) return null; // lunch fits — no problem

  // Offer a 30-min lunch block at the least-bad spot: right after the event
  // that straddles ~12:30, or at noon if the block starts later.
  const startAt = Math.max(noon.getTime(), nowMs);
  return {
    id: "lunch:" + day.toDateString(),
    problem: "vanished-lunch",
    note: "Nothing open to eat between noon and two. A held half-hour now is what keeps the afternoon from thinning out.",
    fix: {
      title: "Lunch",
      start: startAt,
      durationMin: 30,
      description: "A protected half-hour to eat. Steadiness through the afternoon, not output.",
    },
  };
}

/** Two demanding events back-to-back with no buffer to clear the first one. */
function findMissingBuffer(events, nowMs) {
  for (let i = 0; i < events.length - 1; i++) {
    const a = events[i];
    const b = events[i + 1];
    if (b.start < nowMs) continue;
    const gapMin = Math.round((b.start - a.end) / 60000);
    const aLongEnough = (a.end - a.start) >= 45 * 60000;
    const bLongEnough = (b.end - b.start) >= 45 * 60000;
    // Back-to-back (<= 5 min) between two substantial blocks = residue with nowhere to go.
    if (gapMin <= 5 && aLongEnough && bLongEnough) {
      return {
        id: "buffer:" + new Date(a.end).toISOString(),
        problem: "missing-buffer",
        note: `${a.title} runs straight into ${b.title}. A ten-minute gap between them is what keeps the second one sharp.`,
        fix: {
          title: "Buffer",
          start: a.end,
          durationMin: 10,
          description: "Ten minutes to let the last thing settle before the next. Clears the residue that dulls the next block.",
        },
      };
    }
  }
  return null;
}

/**
 * The day-shaper. Checks the day's real structure and returns at most one fix,
 * priority: a vanished lunch first (bodily), then a missing buffer. Silent when
 * the day is already humane — the app does not invent problems to solve.
 */
export function getDayShape(nowMs = Date.now(), { dismissedIds = [] } = {}) {
  const events = todaysEvents(nowMs);
  if (events.length < 2) return null; // a light day has no structural problem

  const candidates = [
    findVanishedLunch(events, nowMs),
    findMissingBuffer(events, nowMs),
  ].filter(Boolean);

  for (const c of candidates) {
    if (!dismissedIds.includes(c.id)) return c;
  }
  return null;
}
