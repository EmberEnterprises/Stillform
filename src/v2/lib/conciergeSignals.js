/*
 * conciergeSignals.js — the proactive concierge's deterministic signal layer
 * (Arlin's corrected doctrine, 2026-07-08: the concierge SPEAKS UP — both
 * anticipatory and in-the-moment — but only when it genuinely has something
 * grounded in the user's own data, and its assertiveness ADAPTS to the user's
 * state that day. Never naggy, never surveillance, always dismissible.)
 *
 * This module is PURE ARITHMETIC over the user's own stores — no AI, no
 * guessing (the forecast-and-verify guardrail family: the engine finds it,
 * the user decides). Two exports carry item 3:
 *
 *   getUpcomingEventOffer() — the ANTICIPATORY half: the next calendar event
 *     within the speak-ahead window that is WORTH speaking about — meaning it
 *     matches a trigger the user themselves named in their Trigger Profile
 *     (case-insensitive label match against the event title), or the user
 *     marked it. Spec §2.1's open question ("every matching event vs
 *     user-marked?") resolved to the safe default: trigger-profile matches +
 *     user-marked only — never every event (that would be a task manager,
 *     which the concierge is forbidden to be). Dismissal is remembered per
 *     event; consent-gated by the calendar consent that already exists.
 *
 *   getConciergeVolume() — the STATE-ADAPTIVE dial: reads the same-day
 *     bio-filter capture (depleted / sleep-deprived / pain / etc.) and the
 *     day's calendar density. Returns "soft" | "standard" — soft on a
 *     depleted or heavy day (one gentle line, easy to pass), standard
 *     otherwise. It NEVER goes louder than standard: adaptation means backing
 *     off when the person is low, not escalating when they're sharp.
 *
 * All reads fail-silent + honest-empty. stillform_-prefixed storage.
 */

import { getCalendarEvents, getCalendarSummary } from "./calendarData.js";
import { getWeather } from "./ambientSignals.js";
import { getTriggerProfile } from "./triggerProfile.js";
import { getLatestBodyBioFilter } from "./signalLog.js";
import { getPref } from "./userPrefs.js";

const DISMISS_KEY = "stillform_v2_concierge_event_dismissed"; // { [eventKey]: iso }
const SPEAK_AHEAD_MIN = 90;  // start speaking up to 90 min before the event
const SPEAK_FLOOR_MIN = -10; // keep speaking until 10 min in (they may be late)

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed == null ? fallback : parsed;
  } catch {
    return fallback;
  }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}

function eventKey(ev) {
  return `${ev.start}|${String(ev.title || "").slice(0, 40)}`;
}

/** Active (non-retired) trigger labels from the user's OWN profile, lowercase. */
function activeTriggerLabels() {
  try {
    const profile = getTriggerProfile();
    const triggers = (profile && Array.isArray(profile.triggers)) ? profile.triggers : [];
    return triggers
      .filter((t) => t && typeof t.label === "string" && t.label.trim().length >= 3)
      .map((t) => t.label.trim().toLowerCase());
  } catch {
    return [];
  }
}

/**
 * The anticipatory offer — the next event within the speak-ahead window worth
 * speaking about. Returns { key, title, start, minutesUntil, matchedTrigger }
 * or null (honest-empty). Deterministic; consent rides getCalendarEvents().
 *
 * WORTH = the event title contains a trigger label the user named, OR the
 * event carries a userMarked flag. Never every event.
 */
export function getUpcomingEventOffer(nowMs = Date.now(), { includeDismissed = false } = {}) {
  let events = [];
  try { events = getCalendarEvents() || []; } catch { return null; }
  if (!events.length) return null;

  const labels = activeTriggerLabels();
  const dismissed = readJSON(DISMISS_KEY, {});

  for (const ev of events) {
    if (!ev || !ev.start || !ev.title) continue;
    const startMs = Date.parse(ev.start);
    if (Number.isNaN(startMs)) continue;
    const minutesUntil = Math.round((startMs - nowMs) / 60000);
    if (minutesUntil > SPEAK_AHEAD_MIN || minutesUntil < SPEAK_FLOOR_MIN) continue;

    const key = eventKey(ev);
    // "not this one" = off-my-home, never gone (Arlin's dismissal semantics):
    // home skips dismissed; The Concierge room shows them until expiry.
    if (!includeDismissed && dismissed[key]) continue;

    const title = String(ev.title).toLowerCase();
    const matchedTrigger = labels.find((l) => title.includes(l)) || null;
    const userMarked = ev.userMarked === true;
    if (!matchedTrigger && !userMarked) continue; // not worth speaking about

    return {
      key,
      title: String(ev.title),
      start: ev.start,
      minutesUntil,
      matchedTrigger,
      // P13: the offer knows how much room it has, so a surface never suggests
      // a practice that won't fit before this event.
      sized: sizeOfferToWindow(minutesUntil),
    };
  }
  return null;
}

/**
 * P1 UMBRELLA NOTE (2026-07-15): rain window (from weather) intersecting a
 * calendar event near that time -> a pure-logistics note. No personal inference,
 * no trigger matching — the world, not the person. Returns null when it's dry,
 * no event straddles the rain, or the note was dismissed from home.
 *
 * Dismissal: same off-my-home-never-gone semantics as the event offer.
 */
export function getUmbrellaNote(nowMs = Date.now(), { includeDismissed = false } = {}) {
  let w = null;
  try { w = getWeather(); } catch { return null; }
  if (!w || !w.nextRain || typeof w.nextRain.at !== "number") return null;

  const rainAt = w.nextRain.at;
  // Only speak about rain that's ahead and within the anticipation window.
  const minsToRain = Math.round((rainAt - nowMs) / 60000);
  if (minsToRain < 0 || minsToRain > 6 * 60) return null;

  let events = [];
  try { events = getCalendarEvents() || []; } catch { return null; }

  // Find an event whose start sits within ~90 min of the rain window — the
  // "right when you head out" intersection.
  const WINDOW_MS = 90 * 60 * 1000;
  const dismissed = readJSON(DISMISS_KEY, {});
  for (const ev of events) {
    if (!ev || !ev.start || !ev.title) continue;
    const startMs = Date.parse(ev.start);
    if (Number.isNaN(startMs)) continue;
    if (Math.abs(startMs - rainAt) > WINDOW_MS) continue;
    if (startMs < nowMs) continue;

    const key = "umbrella:" + eventKey(ev);
    if (!includeDismissed && dismissed[key]) continue;

    const hh = new Date(rainAt).getHours();
    const clock = hh === 0 ? "midnight" : hh < 12 ? `${hh} AM` : hh === 12 ? "noon" : `${hh - 12} PM`;
    return {
      key,
      note: `Rain around ${clock}, right when you head out for ${String(ev.title)} — umbrella by the door.`,
      rainAt,
      eventTitle: String(ev.title),
    };
  }
  return null;
}

/**
 * P2 NO-GAP DAY (2026-07-15): calendar arithmetic across the midday span. If
 * events leave no open gap of a meaningful length between 11:00 and 15:00 on a
 * given day, surface a pure-logistics eat-ahead note. Hunger crashes ruin
 * afternoons — this is the world (a packed schedule), not the person.
 *
 * Only speaks for TODAY (or the target day passed), only when the span is
 * genuinely blocked. Honest with unknown-end events: treats them as a default
 * 60-min block so it never invents free time that may not exist.
 */
export function getNoGapDayNote(nowMs = Date.now(), { includeDismissed = false, spanStartHour = 11, spanEndHour = 15, minGapMin = 45 } = {}) {
  let events = [];
  try { events = getCalendarEvents() || []; } catch { return null; }
  if (!events.length) return null;

  const day = new Date(nowMs);
  const spanStart = new Date(day); spanStart.setHours(spanStartHour, 0, 0, 0);
  const spanEnd = new Date(day); spanEnd.setHours(spanEndHour, 0, 0, 0);
  const spanStartMs = spanStart.getTime();
  const spanEndMs = spanEnd.getTime();
  // If the whole span is already in the past, nothing to warn about.
  if (spanEndMs <= nowMs) return null;

  // Build busy intervals clipped to the span.
  const busy = [];
  for (const ev of events) {
    if (!ev || !ev.start) continue;
    const st = Date.parse(ev.start);
    if (Number.isNaN(st)) continue;
    let en = ev.end ? Date.parse(ev.end) : NaN;
    if (Number.isNaN(en)) {
      const dur = typeof ev.durationMin === "number" ? ev.durationMin : 60; // honest default
      en = st + dur * 60000;
    }
    // clip to span
    const cs = Math.max(st, spanStartMs);
    const ce = Math.min(en, spanEndMs);
    if (ce > cs) busy.push([cs, ce]);
  }
  if (!busy.length) return null; // span is wide open — no warning

  // Merge and find the largest open gap within the span.
  busy.sort((a, b) => a[0] - b[0]);
  let cursor = spanStartMs;
  let largestGap = 0;
  for (const [cs, ce] of busy) {
    if (cs > cursor) largestGap = Math.max(largestGap, cs - cursor);
    cursor = Math.max(cursor, ce);
  }
  if (spanEndMs > cursor) largestGap = Math.max(largestGap, spanEndMs - cursor);

  if (largestGap >= minGapMin * 60000) return null; // there's a real gap — no note

  const key = "nogap:" + new Date(day).toDateString();
  const dismissed = readJSON(DISMISS_KEY, {});
  if (!includeDismissed && dismissed[key]) return null;

  const fmt = (h) => (h === 12 ? "noon" : h > 12 ? `${h - 12}` : `${h}`);
  return {
    key,
    note: `Nothing open ${fmt(spanStartHour)}\u2013${fmt(spanEndHour)} \u2014 eat before ${fmt(spanStartHour)}.`,
  };
}

/**
 * P3 TOMORROW VISIBLE TONIGHT (2026-07-15): a loaded morning tomorrow, seen
 * TONIGHT while it's still actionable. Counts tomorrow's early events (before
 * ~11:00) and their total load; if the morning is heavy, returns a note whose
 * job is to reshape the evening toward sleep. Prediction while it can still
 * change tonight's choices — logistics (a full tomorrow), not a claim about the
 * person.
 *
 * Only speaks in the evening (after ~17:00) so it lands at set-down, not midday.
 */
export function getTomorrowHeavyNote(nowMs = Date.now(), { includeDismissed = false, eveningFromHour = 17, heavyCount = 3, heavyLoadMin = 180 } = {}) {
  const now = new Date(nowMs);
  if (now.getHours() < eveningFromHour) return null; // only at set-down

  let events = [];
  try { events = getCalendarEvents() || []; } catch { return null; }
  if (!events.length) return null;

  const tmr = new Date(nowMs + 24 * 60 * 60 * 1000);
  const tmrKey = tmr.toDateString();
  const morningCutoff = new Date(tmr); morningCutoff.setHours(11, 0, 0, 0);
  const cutoffMs = morningCutoff.getTime();

  let count = 0;
  let loadMin = 0;
  let earliest = null;
  for (const ev of events) {
    if (!ev || !ev.start) continue;
    const st = Date.parse(ev.start);
    if (Number.isNaN(st)) continue;
    if (new Date(st).toDateString() !== tmrKey) continue;
    if (st > cutoffMs) continue; // only the morning load
    count += 1;
    const dur = typeof ev.durationMin === "number" ? ev.durationMin : 60;
    loadMin += dur;
    if (earliest === null || st < earliest) earliest = st;
  }

  const heavy = count >= heavyCount || loadMin >= heavyLoadMin;
  if (!heavy) return null;

  const key = "tmrheavy:" + tmrKey;
  const dismissed = readJSON(DISMISS_KEY, {});
  if (!includeDismissed && dismissed[key]) return null;

  return {
    key,
    note: "Tomorrow morning is loaded \u2014 tonight's job is sleep.",
    count,
    loadMin,
  };
}

/**
 * P11 TEMPORAL LANDMARKS (2026-07-15): the calendar's own weather — pure
 * date arithmetic, no external data. Currently: the DST transition (detected by
 * comparing timezone offsets across the coming week — works in any locale that
 * observes it, silent where none). Deterministic; the standing DST manual-test
 * becomes this mechanic's own test case.
 *
 * Returns the nearest upcoming landmark within a lookahead window, or null.
 */
export function getTemporalLandmark(nowMs = Date.now(), { includeDismissed = false, lookaheadDays = 4 } = {}) {
  const now = new Date(nowMs);
  const baseOffset = now.getTimezoneOffset();

  // DST: scan the next N days for an offset change (the clock shift).
  for (let d = 1; d <= lookaheadDays; d++) {
    const future = new Date(nowMs + d * 24 * 60 * 60 * 1000);
    if (future.getTimezoneOffset() !== baseOffset) {
      // A shift happens on day d. springs forward = offset decreases.
      const springsForward = future.getTimezoneOffset() < baseOffset;
      const key = "dst:" + future.toDateString();
      const dismissed = readJSON(DISMISS_KEY, {});
      if (!includeDismissed && dismissed[key]) return null;
      const when = d === 1 ? "tonight" : `in ${d} days`;
      const note = springsForward
        ? `Clocks jump forward ${when} — you lose an hour; an earlier night costs you nothing.`
        : `Clocks fall back ${when} — an extra hour, but the light shifts; ease into it.`;
      return { key, kind: "dst", note };
    }
  }
  return null;
}

/**
 * P13 TIME-SIZED OFFERS (2026-07-15): the guard that kills the daily micro-
 * failure of unusable suggestions. Given the minutes actually available (from a
 * calendar gap), return the largest practice that FITS — never a 5-minute
 * practice into a 3-minute window. Pure arithmetic; the offer surfaces phrase it.
 *
 * Practice floors (minutes): quick breath ~2, body scan ~5, full spine ~12.
 * Returns { fits:boolean, size:"breath"|"scan"|"full"|null, label } — label is
 * the honest offer phrase, or null when nothing fits (then the offer stays silent).
 */
export function sizeOfferToWindow(minutesAvailable) {
  const m = typeof minutesAvailable === "number" && Number.isFinite(minutesAvailable) ? minutesAvailable : 0;
  if (m >= 12) return { fits: true, size: "full", label: `${Math.floor(m)} minutes — room for the full practice.` };
  if (m >= 5) return { fits: true, size: "scan", label: `${Math.floor(m)} minutes — the body scan fits.` };
  if (m >= 2) return { fits: true, size: "breath", label: `${Math.floor(m)} minutes — the short version.` };
  return { fits: false, size: null, label: null };
}

/** Remember "not this one" for a specific event offer. */
export function dismissEventOffer(key) {
  if (!key || typeof key !== "string") return false;
  const dismissed = readJSON(DISMISS_KEY, {});
  dismissed[key] = new Date().toISOString();
  // Keep the map small: drop entries older than 7 days.
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  for (const k of Object.keys(dismissed)) {
    const t = Date.parse(dismissed[k]);
    if (!Number.isNaN(t) && t < cutoff) delete dismissed[k];
  }
  return writeJSON(DISMISS_KEY, dismissed);
}

/**
 * The state-adaptive volume dial. "soft" when the same-day body read shows a
 * depleted state (physically depleted / sleep-deprived / pain) OR the day is
 * heavy (4+ events or back-to-back); "standard" otherwise. Never louder than
 * standard — adaptation is backing off, not escalating.
 */
export function getConciergeVolume(nowMs = Date.now()) {
  // The user's master dial (item 9): "soft" is a FLOOR the user owns — it
  // wins over the arithmetic. There is deliberately no "loud" (adaptation
  // only ever backs off; Arlin's doctrine).
  try { if (getPref("concierge.volume") === "soft") return "soft"; } catch { /* default: adaptive */ }
  let depleted = false;
  try {
    const bio = getLatestBodyBioFilter(); // comma-joined tokens or null
    if (bio && /depleted|sleep|pain/i.test(bio)) depleted = true;
  } catch { /* fail-silent */ }

  let heavy = false;
  try {
    const summary = getCalendarSummary(nowMs);
    if (summary && (summary.count >= 4 || summary.backToBack === true)) heavy = true;
  } catch { /* fail-silent */ }

  return depleted || heavy ? "soft" : "standard";
}
