/**
 * calendarData.js — the calendar integration's data seam.
 *
 * The concierge consumes calendar events (Today's Brief reads
 * `stillform_calendar_events` today; Pre-event Brief + EOD decompression will).
 * This module is the PRODUCER side of that contract — consent gate + event
 * store + a day-density summary — built forward-compatible so ANY source can
 * populate it: a native Calendar pull (iOS/Android, later), an ICS import, or a
 * screenshot→GPT-4o extraction. On web with no producer yet it simply stays
 * empty, and every consumer already handles empty. Nothing false is surfaced.
 *
 * PRIVACY MODEL (spec 2.1 — neutral, silent by default, consent-gated):
 *   - Data is stored ONLY when the user has granted consent. No consent → no
 *     write (writes are dropped), and reads return empty.
 *   - Revoking consent WIPES the stored events (revoke = forget).
 *   - We keep only title + start/end/duration. NEVER attendees, descriptions, or
 *     meeting-platform data (PII / loaded content — spec "Data NOT pulled").
 *   - stillform_-prefixed keys → covered by the existing sync/wipe scans.
 *
 * Fail-silent: never throws to the UI.
 */

const CONSENT_KEY = "stillform_calendar_consent";
const EVENTS_KEY = "stillform_calendar_events";
const MAX_EVENTS = 100;

function safeLocal() {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch { /* sandboxed */ }
  try {
    if (typeof localStorage !== "undefined") return localStorage;
  } catch { /* ignore */ }
  return null;
}

// ── consent gate ────────────────────────────────────────────────────────────

/** True only if the user has explicitly granted calendar consent. */
export function getCalendarConsent() {
  const ls = safeLocal();
  if (!ls) return false;
  try {
    return ls.getItem(CONSENT_KEY) === "yes";
  } catch {
    return false;
  }
}

/**
 * Grant or revoke calendar consent. Revoking WIPES stored events (revoke =
 * forget). Returns the resulting consent boolean. Fail-silent.
 */
export function setCalendarConsent(granted) {
  const ls = safeLocal();
  if (!ls) return false;
  try {
    if (granted === true) {
      ls.setItem(CONSENT_KEY, "yes");
      return true;
    }
    ls.removeItem(CONSENT_KEY);
    ls.removeItem(EVENTS_KEY); // revoke = forget
    return false;
  } catch {
    return false;
  }
}

// ── event store ─────────────────────────────────────────────────────────────

function parseTime(v) {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const t = Date.parse(v);
  return Number.isFinite(t) ? t : null;
}

/** Keep only the neutral, non-PII fields; drop anything without a title+start. */
function cleanEvent(e) {
  if (!e || typeof e !== "object") return null;
  const title = typeof e.title === "string" ? e.title.trim().slice(0, 80) : "";
  const startMs = parseTime(e.start);
  if (!title || startMs === null) return null;
  const endMs = parseTime(e.end);
  let durationMin = null;
  if (typeof e.durationMin === "number" && Number.isFinite(e.durationMin)) {
    durationMin = Math.max(0, Math.round(e.durationMin));
  } else if (endMs !== null && endMs >= startMs) {
    durationMin = Math.round((endMs - startMs) / 60000);
  }
  return {
    title,
    start: new Date(startMs).toISOString(),
    end: endMs !== null ? new Date(endMs).toISOString() : null,
    durationMin,
  };
}

/** Read the stored events. Consent-gated: no consent → []. Fail-silent. */
export function getCalendarEvents() {
  if (!getCalendarConsent()) return [];
  const ls = safeLocal();
  if (!ls) return [];
  try {
    const raw = ls.getItem(EVENTS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/**
 * Replace the working calendar with a fresh event set (a pull/import is
 * authoritative, not additive). CONSENT-GATED: without consent the write is
 * dropped. Cleans to neutral fields, sorts by start, caps the count. Returns the
 * stored events (or [] if blocked). Fail-silent.
 *
 * @param {Array<{title:string, start:string|number, end?:string|number, durationMin?:number}>} events
 */
export function setCalendarEvents(events) {
  if (!getCalendarConsent()) return [];
  const ls = safeLocal();
  if (!ls) return [];
  const cleaned = (Array.isArray(events) ? events : [])
    .map(cleanEvent)
    .filter(Boolean)
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start))
    .slice(0, MAX_EVENTS);
  try {
    ls.setItem(EVENTS_KEY, JSON.stringify(cleaned));
  } catch {
    /* persistence failure is non-fatal */
  }
  return cleaned;
}

// ── day-density summary (spec 2.1: density + spacing, into hardware read) ────

function dayKey(ms) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/**
 * A neutral density read for a given day (default today): how many events, total
 * event hours, and whether any are back-to-back. The concierge uses this as a
 * load signal — never to tell the user to skip anything. Returns null when there
 * are no events that day. Fail-silent.
 *
 * @param {number} [nowMs] — reference time; defaults to Date.now()
 */
export function getCalendarSummary(nowMs = Date.now()) {
  const events = getCalendarEvents();
  if (events.length === 0) return null;
  const key = dayKey(nowMs);
  const today = events
    .filter((e) => dayKey(Date.parse(e.start)) === key)
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
  if (today.length === 0) return null;

  let totalMin = 0;
  let backToBack = false;
  for (let i = 0; i < today.length; i++) {
    if (typeof today[i].durationMin === "number") totalMin += today[i].durationMin;
    if (i > 0) {
      const prevEnd = today[i - 1].end ? Date.parse(today[i - 1].end) : null;
      const curStart = Date.parse(today[i].start);
      if (prevEnd !== null && curStart - prevEnd <= 5 * 60000) backToBack = true;
    }
  }
  return {
    count: today.length,
    totalHours: Math.round((totalMin / 60) * 10) / 10,
    backToBack,
    firstStart: today[0].start,
    lastStart: today[today.length - 1].start,
  };
}

export const _keys = { CONSENT_KEY, EVENTS_KEY, MAX_EVENTS };

/**
 * Store an imported event set, keeping only now-forward events (past events add
 * nothing to anticipation and would eat the cap). Shared by every producer (ICS
 * import, screenshot extract, native pull) so they store identically. Consent-
 * gated via setCalendarEvents. Returns the stored events.
 */
export function setUpcomingEvents(events) {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const forward = (Array.isArray(events) ? events : []).filter((e) => {
    if (!e) return false;
    const ms = Date.parse(e.end || e.start);
    return !Number.isFinite(ms) || ms >= cutoff;
  });
  return setCalendarEvents(forward);
}
