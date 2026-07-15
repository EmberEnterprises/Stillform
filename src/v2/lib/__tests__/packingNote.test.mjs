import assert from "node:assert";
const store = new Map();
globalThis.localStorage = { getItem:(k)=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:(k)=>store.delete(k) };
store.set("stillform_calendar_consent","yes");
const cal = await import("../calendarData.js");
const cs = await import("../conciergeSignals.js");
const fn = await import("../futureNotes.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};
const now = Date.now();

ok("offers for a travel-titled event within 10 days", () => {
  const start = now + 3*24*3600*1000;
  cal.setCalendarEvents([{ title:"Trip to Boston", start:new Date(start).toISOString() }]);
  const o = cs.getPackingNoteOffer(now, { includeDismissed:true });
  assert.ok(o && /charger/.test(o.template) && /Boston/.test(o.tripTitle));
});
ok("silent for an ordinary short meeting", () => {
  cal.setCalendarEvents([{ title:"Standup", start:new Date(now+2*3600*1000).toISOString(), end:new Date(now+2.5*3600*1000).toISOString() }]);
  assert.strictEqual(cs.getPackingNoteOffer(now, { includeDismissed:true }), null);
});
ok("accepting writes a P28 note that arrives before the trip", () => {
  store.clear(); store.set("stillform_calendar_consent","yes");
  const start = now + 3*24*3600*1000;
  const offer = { tripTitle:"Trip", startMs:start, template:"For Trip: charger, meds." };
  const id = fn.acceptPackingNote(offer);
  assert.ok(id);
  const all = fn.getAllNotes();
  assert.strictEqual(all.length, 1);
  assert.ok(!("done" in all[0])); // still not a task
});
console.log(`packingNote: ${n}/3 pass`);
