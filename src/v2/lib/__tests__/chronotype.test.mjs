/* P25 chronotype-aware timing — best hours from the engaged-session record. */
import assert from "node:assert";
const store = new Map();
globalThis.localStorage = { getItem:(k)=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:(k)=>store.delete(k) };
const ch = await import("../chronotype.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};
const sess=(h, engaged=true)=>{
  const d=new Date(); d.setHours(h,0,0,0);
  return { id:"s"+Math.random(), timestamp:d.toISOString(), mode:"calm", takeaway: engaged ? "learned something" : null };
};
const setSessions=(arr)=>store.set("stillform_v2_sessions", JSON.stringify(arr));

ok("null below the engaged-session floor", () => {
  setSessions([sess(9), sess(9)]); // only 2 engaged
  assert.strictEqual(ch.getBestHours(), null);
});
ok("null when sessions exist but none are engaged", () => {
  setSessions([sess(9,false), sess(9,false), sess(9,false), sess(9,false), sess(9,false), sess(9,false)]);
  assert.strictEqual(ch.getBestHours(), null);
});
ok("names the concentrated best band from engaged sessions", () => {
  const arr = [];
  for (let i=0;i<7;i++) arr.push(sess(10)); // late morning, engaged
  arr.push(sess(20)); arr.push(sess(15));   // some spread
  setSessions(arr);
  const b = ch.getBestHours();
  assert.ok(b && b.bandId === "late-morning");
  assert.ok(/late morning/.test(b.line));
});
ok("null when engaged sessions are evenly spread (no real best window)", () => {
  const hours = [7,10,13,16,19,23,8]; // one per band-ish, no concentration
  setSessions(hours.map((h)=>sess(h)));
  assert.strictEqual(ch.getBestHours(), null);
});
ok("isWithinBestHours reflects the learned band", () => {
  const arr = [];
  for (let i=0;i<7;i++) arr.push(sess(10));
  arr.push(sess(20)); arr.push(sess(15));
  setSessions(arr);
  const tenAM = new Date(new Date().setHours(10,0,0,0)).getTime();
  const eightPM = new Date(new Date().setHours(20,0,0,0)).getTime();
  assert.strictEqual(ch.isWithinBestHours(tenAM), true);
  assert.strictEqual(ch.isWithinBestHours(eightPM), false);
});
console.log(`chronotype: ${n}/5 pass`);
