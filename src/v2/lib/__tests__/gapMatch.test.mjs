/* P31 gap-matching floor — note + real open gap. */
import assert from "node:assert";
const store = new Map();
globalThis.localStorage = { getItem:(k)=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:(k)=>store.delete(k) };
store.set("stillform_calendar_consent","yes");
const cal = await import("../calendarData.js");
const fn = await import("../futureNotes.js");
const cs = await import("../conciergeSignals.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};

const now = Date.now();

ok("null when there are no notes to place", () => {
  cal.setCalendarEvents([]);
  assert.strictEqual(cs.getGapMatch(now, { includeDismissed:true }), null);
});
ok("matches a note to an open gap and PLACES it", () => {
  fn.attachNote({ text: "pick up medication", surfaceAt: now + 6*3600*1000 });
  cal.setCalendarEvents([]); // wide open
  const g = cs.getGapMatch(now, { includeDismissed:true });
  assert.ok(g && /pick up medication/.test(g.note));
  assert.ok(/open around/.test(g.note));
});
ok("null when the day is wall-to-wall (no gap to place into)", () => {
  const busy = [];
  for (let i = 0; i < 8; i++) {
    busy.push({ title: "block"+i, start: new Date(now + i*3600*1000).toISOString(), end: new Date(now + (i+1)*3600*1000).toISOString() });
  }
  cal.setCalendarEvents(busy);
  assert.strictEqual(cs.getGapMatch(now, { includeDismissed:true }), null);
});
console.log(`gapMatch: ${n}/3 pass`);
