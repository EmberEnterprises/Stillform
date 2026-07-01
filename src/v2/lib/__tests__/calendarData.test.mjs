// calendarData.test.mjs — run: node src/v2/lib/__tests__/calendarData.test.mjs
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

const {
  getCalendarConsent, setCalendarConsent,
  getCalendarEvents, setCalendarEvents, getCalendarSummary, _keys,
} = await import("../calendarData.js");

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };

const iso = (h, m = 0, dayOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

// ── consent defaults off; nothing stored without it ──────────────────────
store.clear();
ok(getCalendarConsent() === false, "consent defaults false");
ok(setCalendarEvents([{ title: "Standup", start: iso(9) }]).length === 0, "write blocked without consent");
ok(getCalendarEvents().length === 0, "read empty without consent");
ok(store.has(_keys.EVENTS_KEY) === false, "no events key written without consent");

// ── grant consent → writes persist, cleaned ───────────────────────────────
setCalendarConsent(true);
ok(getCalendarConsent() === true, "consent granted");
let stored = setCalendarEvents([
  { title: "  1:1 with manager  ", start: iso(14), end: iso(15) },
  { title: "Standup", start: iso(9), durationMin: 15 },
  { title: "", start: iso(10) },                 // dropped: no title
  { title: "No start", start: "not-a-date" },     // dropped: bad start
  { title: "Has attendees", start: iso(16), attendees: ["a@b.com"], description: "secret" }, // PII stripped
]);
ok(stored.length === 3, "invalid events dropped (3 of 5 kept)");
ok(stored[0].title === "Standup", "sorted by start (Standup first)");
ok(stored[0].durationMin === 15, "explicit durationMin kept");
ok(stored[1].durationMin === 60, "duration derived from start/end (60 min)");
ok(!("attendees" in stored[2]) && !("description" in stored[2]), "PII fields never stored");
ok(stored[1].title === "1:1 with manager", "title trimmed");

// ── read reflects the store ────────────────────────────────────────────────
ok(getCalendarEvents().length === 3, "getCalendarEvents returns stored");

// ── revoke consent WIPES events ───────────────────────────────────────────
setCalendarConsent(false);
ok(getCalendarConsent() === false, "consent revoked");
ok(store.has(_keys.EVENTS_KEY) === false, "revoke wipes stored events");
ok(getCalendarEvents().length === 0, "read empty after revoke");

// ── day-density summary ───────────────────────────────────────────────────
setCalendarConsent(true);
setCalendarEvents([
  { title: "A", start: iso(9), end: iso(10) },       // 60m
  { title: "B", start: iso(10), end: iso(10, 30) },  // 30m, back-to-back with A
  { title: "C", start: iso(15), end: iso(16) },      // 60m, gap
  { title: "Tomorrow", start: iso(9, 0, 1), end: iso(10, 0, 1) }, // different day
]);
const sum = getCalendarSummary();
ok(sum !== null, "summary present when today has events");
ok(sum.count === 3, "summary counts only today's events (3, not 4)");
ok(sum.totalHours === 2.5, "total hours = 2.5");
ok(sum.backToBack === true, "back-to-back detected (A→B)");

// no events today → null
setCalendarEvents([{ title: "Future", start: iso(9, 0, 3), end: iso(10, 0, 3) }]);
ok(getCalendarSummary() === null, "no events today → summary null");

// ── cap + corrupt store ────────────────────────────────────────────────────
setCalendarConsent(true);
const many = Array.from({ length: _keys.MAX_EVENTS + 20 }, (_, i) => ({ title: `E${i}`, start: iso(0, i % 59) }));
ok(setCalendarEvents(many).length === _keys.MAX_EVENTS, "event count capped");
store.set(_keys.EVENTS_KEY, "{bad json");
ok(getCalendarEvents().length === 0, "corrupt store → empty, no throw");

console.log(`calendarData.test.mjs — ${n}/${n} PASS`);
