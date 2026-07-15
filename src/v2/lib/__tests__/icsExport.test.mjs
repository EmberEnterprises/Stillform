/* icsExport contract — J7. */
import assert from "node:assert";
const ie = await import("../icsExport.js");
let n = 0; const ok = (name, f) => { f(); n++; console.log("PASS", name); };

ok("builds a valid single VEVENT", () => {
  const ics = ie.buildEventIcs({ title: "pause before I answer", durationMin: 15 });
  assert.ok(ics.includes("BEGIN:VCALENDAR"));
  assert.ok(ics.includes("BEGIN:VEVENT"));
  assert.ok(ics.includes("END:VEVENT"));
  assert.ok(ics.includes("SUMMARY:pause before I answer"));
  assert.ok(/DTSTART:\d{8}T\d{6}Z/.test(ics));
});
ok("escapes special characters", () => {
  const ics = ie.buildEventIcs({ title: "review; then, decide" });
  assert.ok(ics.includes("SUMMARY:review\\; then\\, decide"));
});
ok("end follows start by duration", () => {
  const start = new Date("2026-07-16T14:00:00Z");
  const ics = ie.buildEventIcs({ title: "x", start, durationMin: 30 });
  assert.ok(ics.includes("DTSTART:20260716T140000Z"));
  assert.ok(ics.includes("DTEND:20260716T143000Z"));
});
console.log(`icsExport: ${n}/3 pass`);
