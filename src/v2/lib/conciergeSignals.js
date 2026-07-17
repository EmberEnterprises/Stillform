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
import { getRecentSessions } from "./sessions.js";
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

/**
 * P14 RECOVERY GRACE (2026-07-15): re-entry as the warmest moment. Someone
 * returning after days or weeks away gets zero ledger, zero guilt, no streak
 * debt — "pick up where the day is, not where you left off." The anti-shame
 * moment every other app fails. Care carried in the response, never spoken.
 *
 * Fires only on a genuine gap (>= gapDays since the last session). Silent for
 * daily/near-daily use (nothing to forgive) and for brand-new users (no prior
 * session to have been away from).
 */
export function getRecoveryGrace(nowMs = Date.now(), { gapDays = 4 } = {}) {
  let recent = [];
  try { recent = getRecentSessions(1) || []; } catch { return null; }
  if (!recent.length) return null; // new user — no absence to grace

  const last = recent[0];
  const lastMs = last && typeof last.ts === "number" ? last.ts : null;
  if (lastMs === null) return null;

  const days = Math.floor((nowMs - lastMs) / (24 * 60 * 60 * 1000));
  if (days < gapDays) return null; // not really away

  // Warm, factual, no streak language. Scale the phrasing gently by length.
  let note;
  if (days >= 21) note = "However long it's been, you're not behind — pick up where today is, not where you left off.";
  else if (days >= 7) note = "Been a little while. Nothing's lost — start from where the day is.";
  else note = "Welcome back. Pick up where today is, not where you left off.";

  return { key: "recovery:" + new Date(nowMs).toDateString(), note, daysAway: days };
}

/**
 * P29 THE PACKING NOTE (2026-07-15): a trip on the calendar earns an OFFERED
 * packing-note template — season- and length-aware, always optional, edited or
 * declined. Accepting it writes a P28 future-note that arrives the evening
 * before. Never a checklist-with-state (it becomes a futureNote, which by
 * construction cannot be a task).
 *
 * Trip detection: a multi-day event (>= ~20h span) or a travel-titled event.
 * Returns { key, tripTitle, startMs, template } to offer, or null.
 */
export function getPackingNoteOffer(nowMs = Date.now(), { includeDismissed = false } = {}) {
  let events = [];
  try { events = getCalendarEvents() || []; } catch { return null; }
  if (!events.length) return null;

  const TRAVEL_RE = /\b(trip|flight|vacation|holiday|travel|getaway|retreat|conference)\b/i;
  const dismissed = readJSON(DISMISS_KEY, {});

  for (const ev of events) {
    if (!ev || !ev.start || !ev.title) continue;
    const st = Date.parse(ev.start);
    if (Number.isNaN(st) || st < nowMs) continue;
    // only offer within ~10 days ahead (actionable, not far-future noise)
    if (st - nowMs > 10 * 24 * 60 * 60 * 1000) continue;

    let en = ev.end ? Date.parse(ev.end) : NaN;
    const spanHours = Number.isFinite(en) ? (en - st) / 3600000 : 0;
    const isMultiDay = spanHours >= 20;
    const looksTravel = TRAVEL_RE.test(ev.title);
    if (!isMultiDay && !looksTravel) continue;

    const key = "packing:" + (ev.start + "|" + ev.title).slice(0, 60);
    if (!includeDismissed && dismissed[key]) continue;

    // Season-aware base list (northern-hemisphere month heuristic; honest and simple).
    const month = new Date(st).getMonth();
    const cold = month <= 1 || month === 11; // Dec-Feb
    const warm = month >= 5 && month <= 8;    // Jun-Sep
    const nights = isMultiDay ? Math.max(1, Math.round(spanHours / 24)) : 1;

    const items = ["charger", "any meds you take", "the good headphones"];
    if (cold) items.push("a warm layer");
    if (warm) items.push("sunscreen");
    if (nights >= 3) items.push(`enough for ${nights} nights`);

    const template = `For ${String(ev.title)}: ${items.join(", ")}.`;
    return { key, tripTitle: String(ev.title), startMs: st, template };
  }
  return null;
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
 * THE SHELF (2026-07-16): the restore half of the guilt-free sovereignty law.
 * Dismissing a concierge item never destroys it — it goes to a quiet history
 * (the room already shows dismissed items via includeDismissed). restoreOffer
 * is the inverse of dismissEventOffer: it lifts the "not this one" so the item
 * can speak on home again. Nothing is ever truly gone; dismissing carries no
 * cost, which is the whole point — no guilt, fully reversible.
 */
export function restoreOffer(key) {
  if (!key || typeof key !== "string") return false;
  const dismissed = readJSON(DISMISS_KEY, {});
  if (!(key in dismissed)) return true; // already not-dismissed = restored
  delete dismissed[key];
  return writeJSON(DISMISS_KEY, dismissed);
}

/** True if a given item key is currently shelved (dismissed from home). */
export function isShelved(key) {
  if (!key || typeof key !== "string") return false;
  const dismissed = readJSON(DISMISS_KEY, {});
  return key in dismissed;
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
