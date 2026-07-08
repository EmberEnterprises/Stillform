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
export function getUpcomingEventOffer(nowMs = Date.now()) {
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
    if (dismissed[key]) continue; // "not this one" is remembered per event

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
    };
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
