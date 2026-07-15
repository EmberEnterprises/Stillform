import assert from "node:assert";
const store = new Map();
globalThis.localStorage = { getItem:(k)=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:(k)=>store.delete(k) };
store.set("stillform_calendar_consent","yes");
const cal = await import("../calendarData.js");
const cs = await import("../conciergeSignals.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};

// build "today at hour"
function at(h,m=0){ const d=new Date(); d.setHours(h,m,0,0); return d; }
const now = at(9).getTime(); // 9 AM today, span 11-3 is ahead

ok("fires when 11-3 is wall-to-wall", () => {
  cal.setCalendarEvents([
    { title:"A", start: at(11).toISOString(), end: at(13).toISOString() },
    { title:"B", start: at(13).toISOString(), end: at(15).toISOString() },
  ]);
  const g = cs.getNoGapDayNote(now, { includeDismissed:true });
  assert.ok(g && /eat before 11/.test(g.note));
});
ok("silent when there's a real midday gap", () => {
  cal.setCalendarEvents([{ title:"A", start: at(11).toISOString(), end: at(11,30).toISOString() }]);
  assert.strictEqual(cs.getNoGapDayNote(now, { includeDismissed:true }), null);
});
ok("silent when calendar is empty across the span", () => {
  cal.setCalendarEvents([]);
  assert.strictEqual(cs.getNoGapDayNote(now, { includeDismissed:true }), null);
});
console.log(`noGapDay: ${n}/3 pass`);
