import assert from "node:assert";
const store = new Map();
globalThis.localStorage = { getItem:(k)=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:(k)=>store.delete(k) };
const cs = await import("../conciergeSignals.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};

ok("returns null or a landmark object without throwing (locale-dependent)", () => {
  const r = cs.getTemporalLandmark(Date.now(), { includeDismissed:true });
  assert.ok(r === null || (r && typeof r.note === "string" && r.kind === "dst"));
});
ok("respects the lookahead window (0 days = no scan = null)", () => {
  assert.strictEqual(cs.getTemporalLandmark(Date.now(), { includeDismissed:true, lookaheadDays:0 }), null);
});
console.log(`temporalLandmark: ${n}/2 pass`);
