/**
 * icsImport.js — the web-buildable calendar PRODUCER: turn an .ics file (or
 * pasted .ics text) into events the concierge can use, with no native access.
 *
 * The user exports/pastes their calendar (Google/Apple/Outlook all emit .ics);
 * we parse it locally and hand the events to calendarData.setCalendarEvents
 * (consent-gated, PII-stripped). A native Calendar pull later writes to the same
 * store — this is one of several producers behind the one seam.
 *
 * Deliberately a pragmatic subset of RFC 5545 (VEVENT SUMMARY/DTSTART/DTEND),
 * enough for real exports; not a full iCalendar implementation. Timezone note:
 * UTC ("...Z") and all-day (VALUE=DATE) are handled exactly; a TZID local time
 * is read as the device's local time (no per-zone table). Good enough for a
 * day-load read; flagged for Arlin if precise cross-zone handling is needed.
 *
 * Pure + fail-silent: parseIcs never throws; bad input yields [].
 */

import { setCalendarEvents } from "./calendarData.js";

/** Unescape an ICS TEXT value (\\, \; \, \n). */
function unescapeText(s) {
  return String(s || "")
    .replace(/\\n/gi, " ")
    .replace(/\\([,;\\])/g, "$1")
    .trim();
}

/**
 * Parse an ICS datetime value (the part after the colon) into an ISO string.
 * Handles: 20260703T140000Z (UTC), 20260703T140000 (local), 20260703 (all-day).
 * Returns null if unparseable.
 */
function parseIcsDate(value) {
  const v = String(value || "").trim();
  // date-time
  let m = v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/);
  if (m) {
    const [, y, mo, d, h, mi, s, z] = m;
    const nums = [y, mo, d, h, mi, s].map(Number);
    const ms = z
      ? Date.UTC(nums[0], nums[1] - 1, nums[2], nums[3], nums[4], nums[5])
      : new Date(nums[0], nums[1] - 1, nums[2], nums[3], nums[4], nums[5]).getTime();
    return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
  }
  // all-day date
  m = v.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (m) {
    const [, y, mo, d] = m.map(Number);
    const ms = new Date(y, mo - 1, d, 0, 0, 0).getTime();
    return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
  }
  return null;
}

/** Split a content line "PROP;PARAMS:VALUE" into { name, value }. */
function splitLine(line) {
  const colon = line.indexOf(":");
  if (colon === -1) return null;
  const left = line.slice(0, colon);
  const value = line.slice(colon + 1);
  const name = left.split(";")[0].toUpperCase();
  return { name, value };
}

/**
 * Parse ICS text into a raw event list: [{ title, start, end }] (start/end ISO,
 * end may be null). Never throws.
 */
export function parseIcs(text) {
  const raw = typeof text === "string" ? text : "";
  if (!raw) return [];
  // unfold folded lines (a leading space/tab continues the previous line)
  const unfolded = raw.replace(/\r?\n[ \t]/g, "");
  const lines = unfolded.split(/\r?\n/);

  const events = [];
  let cur = null;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "BEGIN:VEVENT") {
      cur = { title: "", start: null, end: null };
      continue;
    }
    if (trimmed === "END:VEVENT") {
      if (cur && cur.title && cur.start) events.push(cur);
      cur = null;
      continue;
    }
    if (!cur) continue;
    const kv = splitLine(trimmed);
    if (!kv) continue;
    if (kv.name === "SUMMARY") cur.title = unescapeText(kv.value).slice(0, 80);
    else if (kv.name === "DTSTART") cur.start = parseIcsDate(kv.value);
    else if (kv.name === "DTEND") cur.end = parseIcsDate(kv.value);
  }
  return events.filter((e) => e.title && e.start);
}

/**
 * Import ICS text into the working calendar. Filters to now-forward (past events
 * add nothing to anticipation and would eat the store cap), then hands them to
 * the consent-gated store. Returns the stored events (or [] if no consent / no
 * parseable events).
 *
 * EXPIRY (open [ARLIN] spec-2.1 question) — first-pass default: imported events
 * are kept until the next import refreshes them; events already in the past are
 * dropped on import. Easy to change to a fixed TTL if she prefers.
 */
export function importIcs(text) {
  const parsed = parseIcs(text);
  const cutoff = Date.now() - 24 * 60 * 60 * 1000; // keep today + forward
  const forward = parsed.filter((e) => {
    const ref = e.end || e.start;
    const ms = Date.parse(ref);
    return !Number.isFinite(ms) || ms >= cutoff;
  });
  return setCalendarEvents(forward);
}
