/* P24 protected-block watchkeeper — mark, detect collision, hand next-best slot. */
import assert from "node:assert";
const store = new Map();
globalThis.localStorage = { getItem:(k)=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:(k)=>store.delete(k) };
const pb = await import("../protectedBlocks.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};
const iso=(h,m=0)=>{const d=new Date();d.setHours(h,m,0,0);return d.toISOString();};
const setEvents=(evs)=>store.set("stillform_calendar_events", JSON.stringify(evs));
const noon=()=>{const d=new Date();d.setHours(12,0,0,0);return d.getTime();};

ok("protectBlock refuses bad input", () => {
  assert.strictEqual(pb.protectBlock({ label:"", startMin:720, endMin:765 }), null);
  assert.strictEqual(pb.protectBlock({ label:"Lunch", startMin:765, endMin:720 }), null);
  assert.strictEqual(pb.protectBlock({ label:"Lunch", startMin:NaN, endMin:765 }), null);
});
ok("protectBlock stores a valid block, listable and removable", () => {
  store.clear();
  const id = pb.protectBlock({ label:"Lunch", startMin:12*60, endMin:12*60+45 });
  assert.ok(id);
  assert.strictEqual(pb.getProtectedBlocks().length, 1);
  pb.unprotectBlock(id);
  assert.strictEqual(pb.getProtectedBlocks().length, 0);
});
ok("no rescue when nothing collides with the protected block", () => {
  store.clear();
  pb.protectBlock({ label:"Lunch", startMin:12*60, endMin:12*60+45 });
  setEvents([{ title:"Morning", start: iso(9), end: iso(10) }]);
  assert.strictEqual(pb.getProtectedBlockRescue(noon()-3*3600*1000), null); // 9am, lunch safe
});
ok("rescue fires when an event lands on the protected block, hands next free slot", () => {
  store.clear();
  pb.protectBlock({ label:"Lunch", startMin:12*60, endMin:12*60+45 });
  setEvents([{ title:"Client call", start: iso(12), end: iso(13) }]); // collides with 12-12:45
  const r = pb.getProtectedBlockRescue(new Date(new Date().setHours(11,0,0,0)).getTime());
  assert.ok(r && /Client call lands on your Lunch/.test(r.note));
  assert.strictEqual(r.fix.title, "Lunch");
  assert.strictEqual(r.fix.durationMin, 45);
  // fix should start at/after 1pm (after the colliding call ends)
  assert.ok(new Date(r.fix.start).getHours() >= 13);
});
ok("stays silent (no fake fix) when there's no room left today", () => {
  store.clear();
  pb.protectBlock({ label:"Lunch", startMin:12*60, endMin:12*60+45 });
  // wall-to-wall from noon to 10pm
  const evs = [];
  for (let h = 12; h < 22; h++) evs.push({ title:"m"+h, start: iso(h), end: iso(h+1) });
  setEvents(evs);
  assert.strictEqual(pb.getProtectedBlockRescue(new Date(new Date().setHours(11,30,0,0)).getTime()), null);
});
ok("respects dismissed block ids", () => {
  store.clear();
  const id = pb.protectBlock({ label:"Lunch", startMin:12*60, endMin:12*60+45 });
  setEvents([{ title:"Call", start: iso(12), end: iso(13) }]);
  const at11 = new Date(new Date().setHours(11,0,0,0)).getTime();
  assert.ok(pb.getProtectedBlockRescue(at11));
  assert.strictEqual(pb.getProtectedBlockRescue(at11, { dismissedIds:[id] }), null);
});
console.log(`protectedBlocks: ${n}/6 pass`);
