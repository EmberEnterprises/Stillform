import assert from "node:assert";
const store = new Map();
globalThis.localStorage = { getItem:(k)=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:(k)=>store.delete(k) };
const cs = await import("../conciergeSignals.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};

ok("dismiss then isShelved is true", () => {
  cs.dismissEventOffer("umbrella:test");
  assert.strictEqual(cs.isShelved("umbrella:test"), true);
});
ok("restore lifts the dismissal (guilt-free reversibility)", () => {
  cs.restoreOffer("umbrella:test");
  assert.strictEqual(cs.isShelved("umbrella:test"), false);
});
ok("restore on a never-dismissed key is a safe no-op", () => {
  assert.strictEqual(cs.restoreOffer("never:dismissed"), true);
});
ok("restore rejects junk keys", () => {
  assert.strictEqual(cs.restoreOffer(null), false);
});
console.log(`shelf: ${n}/4 pass`);
