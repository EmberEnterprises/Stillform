import assert from "node:assert";
const store = new Map();
globalThis.localStorage = { getItem:(k)=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:(k)=>store.delete(k) };
store.set("stillform_calendar_consent","yes");
const cal = await import("../calendarData.js");
const cs = await import("../conciergeSignals.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};

// evening now: today at 8 PM
const evening = (()=>{ const d=new Date(); d.setHours(20,0,0,0); return d.getTime(); })();
function tmrAt(h){ const d=new Date(evening + 24*3600*1000); d.setHours(h,0,0,0); return d.toISOString(); }

ok("fires when tomorrow morning has 3+ events", () => {
  cal.setCalendarEvents([
    { title:"A", start: tmrAt(8), durationMin:60 },
    { title:"B", start: tmrAt(9), durationMin:60 },
    { title:"C", start: tmrAt(10), durationMin:60 },
  ]);
  const t = cs.getTomorrowHeavyNote(evening, { includeDismissed:true });
  assert.ok(t && /tonight's job is sleep/.test(t.note));
});
ok("silent in the daytime even if tomorrow is heavy", () => {
  const noon = (()=>{ const d=new Date(); d.setHours(12,0,0,0); return d.getTime(); })();
  assert.strictEqual(cs.getTomorrowHeavyNote(noon, { includeDismissed:true }), null);
});
ok("silent when tomorrow morning is light", () => {
  cal.setCalendarEvents([{ title:"one", start: tmrAt(9), durationMin:30 }]);
  assert.strictEqual(cs.getTomorrowHeavyNote(evening, { includeDismissed:true }), null);
});
console.log(`tomorrowHeavy: ${n}/3 pass`);
