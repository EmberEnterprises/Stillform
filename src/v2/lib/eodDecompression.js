/*
 * eodDecompression.js — EOD meeting decompression (FULL BUILD item 6, web
 * scope; spec: STILLFORM_INTEGRATIONS_AND_CONCIERGE.md §2.1 "the day's events
 * that consumed the most resources surface as decompression candidates in the
 * EOD review window").
 *
 * The concierge's evening half of the calendar loop: the morning anticipated
 * the day's load (Today's Brief), the threshold met it (PreEventOffer), and
 * the evening SETS IT DOWN — one candidate, the day's heaviest ended event,
 * offered once: "the day held [event] — want to set it down before bed?"
 *
 * DETERMINISTIC + EARNED (the concierge laws): pure arithmetic over the
 * user's own consented calendar. Heaviest = trigger-matched first (an event
 * matching a Trigger Profile label outranks everything — it's the one their
 * own record says costs them), then longest duration. Only ENDED events —
 * never decompress what hasn't happened. One candidate per day, dismissal
 * remembered day-keyed. Consent rides getCalendarEvents. Honest-empty
 * everywhere. No model call.
 */

import { getCalendarEvents } from "./calendarData.js";
import { getTriggerProfile } from "./triggerProfile.js";

const DISMISS_KEY = "stillform_v2_eod_decompress_dismissed"; // "YYYY-M-D"

function dayKey(ms) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function safeGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key, val) {
  try { localStorage.setItem(key, val); return true; } catch { return false; }
}

function triggerLabels() {
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
 * Today's decompression candidate — the heaviest ENDED event of the day —
 * or null. { title, matchedTrigger, durationMin, line }. The line is an
 * offer phrased as a question (the concierge never instructs).
 */
export function getDecompressionCandidate(nowMs = Date.now(), { includeDismissed = false } = {}) {
  if (!includeDismissed && safeGet(DISMISS_KEY) === dayKey(nowMs)) return null; // off-my-home today

  let events = [];
  try { events = getCalendarEvents() || []; } catch { return null; }
  if (!events.length) return null;

  const key = dayKey(nowMs);
  const labels = triggerLabels();

  const ended = events
    .filter((ev) => ev && ev.title && ev.start && dayKey(Date.parse(ev.start)) === key)
    .map((ev) => {
      const startMs = Date.parse(ev.start);
      const endMs = ev.end ? Date.parse(ev.end)
        : typeof ev.durationMin === "number" ? startMs + ev.durationMin * 60000
        : startMs + 30 * 60000; // unknown length: assume a short block
      const title = String(ev.title);
      const matchedTrigger = labels.find((l) => title.toLowerCase().includes(l)) || null;
      const durationMin = Math.max(0, Math.round((endMs - startMs) / 60000));
      return { title, matchedTrigger, durationMin, endMs };
    })
    .filter((ev) => Number.isFinite(ev.endMs) && ev.endMs <= nowMs); // ENDED only

  if (!ended.length) return null;

  // Heaviest: trigger-matched outranks all; then longest.
  ended.sort((a, b) => {
    if (!!b.matchedTrigger !== !!a.matchedTrigger) return b.matchedTrigger ? 1 : -1;
    return b.durationMin - a.durationMin;
  });
  const top = ended[0];

  return {
    title: top.title,
    matchedTrigger: top.matchedTrigger,
    durationMin: top.durationMin,
    line: top.matchedTrigger
      ? `The day held ${top.title} — the kind of moment you've flagged. Want to set it down before it follows you to bed?`
      : `The day held ${top.title}. Want to set it down before the day closes?`,
  };
}

/** The candidate was worked or passed — quiet for the rest of the day. */
export function dismissDecompression(nowMs = Date.now()) {
  return safeSet(DISMISS_KEY, dayKey(nowMs));
}

/**
 * P10 IMMEDIATE DECOMPRESSION (2026-07-19): the set-down offered NOW, not only
 * at bedtime. A calendar event the user themselves flagged (its title matches a
 * trigger they named) that ended within the last few minutes earns one quiet
 * offer while the residue is still live.
 *
 * Deliberately narrower than the EOD candidate: trigger-matched ONLY. An
 * ordinary meeting ending is not an event — the app doesn't chase every hour.
 * One offer per event, off-my-home-never-gone dismissal.
 */
export function getImmediateDecompression(nowMs = Date.now(), { includeDismissed = false, windowMin = 20 } = {}) {
  let events = [];
  try { events = getCalendarEvents() || []; } catch { return null; }
  if (!events.length) return null;

  const labels = triggerLabels();
  if (!labels.length) return null; // nothing flagged = nothing to speak about

  for (const ev of events) {
    if (!ev || !ev.title || !ev.start) continue;
    const startMs = Date.parse(ev.start);
    if (Number.isNaN(startMs)) continue;
    const endMs = ev.end ? Date.parse(ev.end)
      : typeof ev.durationMin === "number" ? startMs + ev.durationMin * 60000
      : startMs + 30 * 60000;
    if (!Number.isFinite(endMs)) continue;

    const sinceMin = Math.round((nowMs - endMs) / 60000);
    if (sinceMin < 0 || sinceMin > windowMin) continue; // only just-ended

    const title = String(ev.title);
    const matchedTrigger = labels.find((l) => title.toLowerCase().includes(l));
    if (!matchedTrigger) continue; // flagged events only

    const key = "immediate:" + (ev.start + "|" + title).slice(0, 60);
    if (!includeDismissed && safeGet(key)) continue;

    return {
      key,
      title,
      matchedTrigger,
      sinceMin,
      note: `${title} just ended. Setting it down now costs less than carrying it to tonight.`,
    };
  }
  return null;
}

/** P10: wave off one just-ended offer. Off my home, not deleted, never chased. */
export function dismissImmediateDecompression(key) {
  if (!key || typeof key !== "string") return false;
  try { safeSet(key, "1"); return true; } catch { return false; }
}
