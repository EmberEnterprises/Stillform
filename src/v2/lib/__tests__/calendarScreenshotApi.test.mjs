// calendarScreenshotApi.test.mjs — run: node src/v2/lib/__tests__/calendarScreenshotApi.test.mjs
import assert from "node:assert";

const { extractCalendarFromScreenshot } = await import("../calendarScreenshotApi.js");

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };
const mockFetch = (impl) => { globalThis.fetch = impl; };

// ── no image → no network, empty ──────────────────────────────────────────
let called = false;
mockFetch(async () => { called = true; return { ok: true, json: async () => ({ events: [] }) }; });
let r = await extractCalendarFromScreenshot({ imageBase64: "" });
ok(r.events.length === 0 && r.error, "empty image → error, no events");
ok(called === false, "empty image never hits the network");

// ── success maps events, drops malformed (fail closed) ────────────────────
mockFetch(async () => ({
  ok: true,
  json: async () => ({ events: [
    { title: "Standup", start: "2026-07-03T09:00:00-07:00", end: "2026-07-03T09:15:00-07:00" },
    { title: "", start: "2026-07-03T10:00:00-07:00" },   // dropped: no title
    { title: "No start" },                                 // dropped: no start
    { title: "All day", start: "2026-07-04" },
  ] }),
}));
r = await extractCalendarFromScreenshot({ imageBase64: "abc123" });
ok(r.error === null, "success → no error");
ok(r.events.length === 2, "malformed events dropped (2 of 4)");
ok(r.events[0].title === "Standup" && r.events[0].start.startsWith("2026-07-03"), "event mapped");

// ── non-OK status → error, empty ──────────────────────────────────────────
for (const [status, label] of [[429, "rate"], [413, "too large"], [500, "server"]]) {
  mockFetch(async () => ({ ok: false, status, json: async () => ({}) }));
  r = await extractCalendarFromScreenshot({ imageBase64: "abc" });
  ok(r.events.length === 0 && r.error, `HTTP ${status} (${label}) → error, empty`);
}

// ── malformed JSON → empty ────────────────────────────────────────────────
mockFetch(async () => ({ ok: true, json: async () => { throw new Error("bad json"); } }));
r = await extractCalendarFromScreenshot({ imageBase64: "abc" });
ok(r.events.length === 0 && r.error, "malformed JSON → error, empty");

// ── missing events field → empty, no throw ────────────────────────────────
mockFetch(async () => ({ ok: true, json: async () => ({ foo: "bar" }) }));
r = await extractCalendarFromScreenshot({ imageBase64: "abc" });
ok(r.events.length === 0 && r.error === null, "missing events field → empty, no error");

// ── network throw → empty ─────────────────────────────────────────────────
mockFetch(async () => { throw new Error("offline"); });
r = await extractCalendarFromScreenshot({ imageBase64: "abc" });
ok(r.events.length === 0 && r.error, "network throw → error, empty (fail closed)");

console.log(`calendarScreenshotApi.test.mjs — ${n}/${n} PASS`);
