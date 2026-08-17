/* P17 guarded self-promises — opt-in, speak once, no overdue, cancelable. */
import assert from "node:assert";
const store = new Map();
globalThis.localStorage = { getItem:(k)=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:(k)=>store.delete(k) };
const sp = await import("../selfPromises.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};
const DAY = 86400000;

ok("orphan promise refused (no day = no promise)", () => {
  assert.strictEqual(sp.makePromise({ text:"the draft" }), null);
  assert.strictEqual(sp.makePromise({ text:"x", forDateMs: NaN }), null);
});
ok("empty text refused", () => {
  assert.strictEqual(sp.makePromise({ text:"", forDateMs: Date.now()+DAY }), null);
});
ok("a promise surfaces on its day, once, then never again", () => {
  store.clear();
  const now = Date.now();
  sp.makePromise({ text:"send the draft", forDateMs: now });
  const due1 = sp.getDuePromise(now + 10*3600*1000); // later that day
  assert.ok(due1 && /send the draft/.test(due1.text));
  const due2 = sp.getDuePromise(now + 11*3600*1000); // same promise shouldn't repeat
  assert.strictEqual(due2, null);
});
ok("no promise surfaces before its day", () => {
  store.clear();
  const now = Date.now();
  sp.makePromise({ text:"future thing", forDateMs: now + 3*DAY });
  assert.strictEqual(sp.getDuePromise(now), null);
});
ok("upcoming promises are listed transparently and are cancelable", () => {
  store.clear();
  const now = Date.now();
  const id = sp.makePromise({ text:"call the clinic", forDateMs: now + 2*DAY });
  const up = sp.getUpcomingPromises(now);
  assert.strictEqual(up.length, 1);
  assert.ok(/call the clinic/.test(up[0].text));
  sp.cancelPromise(id);
  assert.strictEqual(sp.getUpcomingPromises(now).length, 0);
});
console.log(`selfPromises: ${n}/5 pass`);
