/* P18 day-shaper — structural detection + science-honest framing. */
import assert from "node:assert";
const store = new Map();
globalThis.localStorage = { getItem:(k)=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:(k)=>store.delete(k) };
store.set("stillform_calendar_consent","yes");
const cal = await import("../calendarData.js");
const ds = await import("../dayShaper.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};
const at=(h,m=0)=>{const d=new Date();d.setHours(h,m,0,0);return d;};

ok("silent on a light day (fewer than 2 events)", () => {
  cal.setCalendarEvents([{ title:"One", start: at(10).toISOString(), end: at(11).toISOString() }]);
  assert.strictEqual(ds.getDayShape(at(8).getTime()), null);
});
ok("flags a vanished lunch (noon-2 blocked solid)", () => {
  cal.setCalendarEvents([
    { title:"A", start: at(11,30).toISOString(), end: at(13).toISOString() },
    { title:"B", start: at(13).toISOString(), end: at(14,30).toISOString() },
  ]);
  const r = ds.getDayShape(at(9).getTime());
  assert.ok(r && r.problem === "vanished-lunch");
  assert.strictEqual(r.fix.title, "Lunch");
  assert.strictEqual(r.fix.durationMin, 30);
});
ok("lunch note is consideration, not performance (no 'productive'/'optimize')", () => {
  cal.setCalendarEvents([
    { title:"A", start: at(11,30).toISOString(), end: at(13).toISOString() },
    { title:"B", start: at(13).toISOString(), end: at(14,30).toISOString() },
  ]);
  const r = ds.getDayShape(at(9).getTime());
  assert.ok(!/productiv|optimi|efficien|maximi/i.test(r.note + r.fix.description));
});
ok("flags a missing buffer between two long back-to-back blocks", () => {
  cal.setCalendarEvents([
    { title:"Deep review", start: at(9).toISOString(), end: at(10).toISOString() },
    { title:"Strategy session", start: at(10).toISOString(), end: at(11).toISOString() },
  ]);
  const r = ds.getDayShape(at(8).getTime());
  assert.ok(r && r.problem === "missing-buffer");
  assert.strictEqual(r.fix.title, "Buffer");
});
ok("silent when the day already has a real lunch gap", () => {
  cal.setCalendarEvents([
    { title:"A", start: at(9).toISOString(), end: at(10).toISOString() },
    { title:"B", start: at(15).toISOString(), end: at(16).toISOString() },
  ]);
  // noon-2 is wide open, and the two events aren't back-to-back
  assert.strictEqual(ds.getDayShape(at(8).getTime()), null);
});
ok("respects dismissed ids", () => {
  // Lunch-only problem: one long block over all of noon-2, plus an unrelated
  // early event (so >=2 events) that is NOT back-to-back — no buffer candidate.
  cal.setCalendarEvents([
    { title:"Morning", start: at(8).toISOString(), end: at(9).toISOString() },
    { title:"All-midday", start: at(11,45).toISOString(), end: at(14,15).toISOString() },
  ]);
  const first = ds.getDayShape(at(9,30).getTime());
  assert.ok(first && first.problem === "vanished-lunch");
  assert.strictEqual(ds.getDayShape(at(9,30).getTime(), { dismissedIds:[first.id] }), null);
});
console.log(`dayShaper: ${n}/6 pass`);
