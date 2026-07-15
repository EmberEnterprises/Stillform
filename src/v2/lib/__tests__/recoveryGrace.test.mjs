import assert from "node:assert";
const store = new Map();
globalThis.localStorage = { getItem:(k)=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:(k)=>store.delete(k) };
const sess = await import("../sessions.js");
const cs = await import("../conciergeSignals.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};
const now = Date.now();

ok("silent for a brand-new user (no prior session)", () => {
  store.clear();
  assert.strictEqual(cs.getRecoveryGrace(now), null);
});
ok("silent for near-daily use (gap < 4 days)", () => {
  store.clear();
  store.set("stillform_v2_sessions", JSON.stringify([{ ts: now - 2*86400000, dateKey:"x" }]));
  assert.strictEqual(cs.getRecoveryGrace(now), null);
});
ok("fires after a real gap (>= 4 days), no streak language", () => {
  store.clear();
  store.set("stillform_v2_sessions", JSON.stringify([{ ts: now - 10*86400000, dateKey:"x" }]));
  const g = cs.getRecoveryGrace(now);
  assert.ok(g && /where the day is|where today is/.test(g.note));
  assert.ok(!/streak|behind by|missed/.test(g.note));
});
console.log(`recoveryGrace: ${n}/3 pass`);
