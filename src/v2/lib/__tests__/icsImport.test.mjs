// icsImport.test.mjs — run: node src/v2/lib/__tests__/icsImport.test.mjs
import assert from "node:assert";

const store = new Map();
const ls = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};
globalThis.localStorage = ls;
globalThis.window = { localStorage: ls };

const { parseIcs, importIcs } = await import("../icsImport.js");
const { setCalendarConsent, getCalendarEvents } = await import("../calendarData.js");

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };

// build a future/past UTC stamp helper (ICS basic format YYYYMMDDTHHMMSSZ)
const stamp = (dayOffset, h = 12) => {
  const d = new Date(Date.now() + dayOffset * 86400000);
  const p = (x) => String(x).padStart(2, "0");
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T${p(h)}0000Z`;
};

const ICS = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "BEGIN:VEVENT",
  "SUMMARY:1:1 with manager",
  `DTSTART:${stamp(1, 14)}`,
  `DTEND:${stamp(1, 15)}`,
  "ATTENDEE:mailto:someone@example.com",
  "DESCRIPTION:private notes here",
  "END:VEVENT",
  "BEGIN:VEVENT",
  "SUMMARY:All-day offsite",
  "DTSTART;VALUE=DATE:20260805",
  "END:VEVENT",
  "END:VCALENDAR",
].join("\r\n");

// ── parseIcs: pure, extracts title + start/end, ignores PII ───────────────
let events = parseIcs(ICS);
ok(events.length === 2, "two VEVENTs parsed");
ok(events[0].title === "1:1 with manager", "SUMMARY → title");
ok(/T14:00:00\.000Z$/.test(events[0].start), "UTC DTSTART parsed to ISO");
ok(/T15:00:00\.000Z$/.test(events[0].end), "UTC DTEND parsed to ISO");
ok(events[1].title === "All-day offsite" && events[1].start.startsWith("2026-08-05"), "all-day VALUE=DATE parsed");
ok(JSON.stringify(events).indexOf("someone@example.com") === -1, "attendees never parsed");
ok(JSON.stringify(events).indexOf("private notes") === -1, "description never parsed");

// ── folded lines + escaped text ───────────────────────────────────────────
const folded = [
  "BEGIN:VEVENT",
  "SUMMARY:Sync about Q3\\, budget",
  "  and planning",              // folded continuation (fold-space + a real space)
  `DTSTART:${stamp(2)}`,
  "END:VEVENT",
].join("\r\n");
events = parseIcs(folded);
ok(events.length === 1 && events[0].title === "Sync about Q3, budget and planning", "unfold + unescape comma");

// ── malformed / empty → [] (never throws) ─────────────────────────────────
ok(parseIcs("").length === 0, "empty → []");
ok(parseIcs("not an ics at all").length === 0, "garbage → []");
ok(parseIcs("BEGIN:VEVENT\r\nSUMMARY:no start\r\nEND:VEVENT").length === 0, "event with no DTSTART dropped");
ok(parseIcs(null).length === 0, "null → []");

// ── importIcs: consent-gated ──────────────────────────────────────────────
store.clear();
ok(importIcs(ICS).length === 0, "import blocked without consent");
ok(getCalendarEvents().length === 0, "nothing stored without consent");

setCalendarConsent(true);
const stored = importIcs(ICS);
ok(stored.length >= 1, "import stores events with consent");
ok(stored.every((e) => e.title && e.start), "stored events well-formed");

// ── importIcs drops past events (now-forward filter) ──────────────────────
store.clear();
setCalendarConsent(true);
const withPast = [
  "BEGIN:VEVENT", "SUMMARY:Last week", `DTSTART:${stamp(-7)}`, `DTEND:${stamp(-7, 13)}`, "END:VEVENT",
  "BEGIN:VEVENT", "SUMMARY:Next week", `DTSTART:${stamp(7)}`, `DTEND:${stamp(7, 13)}`, "END:VEVENT",
].join("\r\n");
const kept = importIcs(withPast);
ok(kept.length === 1 && kept[0].title === "Next week", "past event dropped, future kept");

console.log(`icsImport.test.mjs — ${n}/${n} PASS`);
