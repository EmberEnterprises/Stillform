import assert from "node:assert";
const store = new Map();
globalThis.localStorage = { getItem:(k)=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:(k)=>store.delete(k) };
const sess = await import("../sessions.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};

ok("null on first-ever use (no sessions)", () => {
  store.clear();
  assert.strictEqual(sess.getRecoveryGrace(Date.now()), null);
});
ok("null on same-week return (A6 owns it)", () => {
  const twoDaysAgo = new Date(Date.now() - 2*86400000).toISOString();
  store.set("stillform_v2_sessions", JSON.stringify([{ id:"a", timestamp: twoDaysAgo }]));
  assert.strictEqual(sess.getRecoveryGrace(Date.now()), null);
});
ok("warm ledger-free note after a real gap, NO number named", () => {
  const tenDaysAgo = new Date(Date.now() - 10*86400000).toISOString();
  store.set("stillform_v2_sessions", JSON.stringify([{ id:"a", timestamp: tenDaysAgo }]));
  const g = sess.getRecoveryGrace(Date.now());
  assert.ok(g && /Pick up where the day is/.test(g.note));
  assert.ok(!/\d/.test(g.note)); // no guilt number in the line
  assert.strictEqual(g.daysAway, 10);
});
console.log(`recoveryGrace: ${n}/3 pass`);
