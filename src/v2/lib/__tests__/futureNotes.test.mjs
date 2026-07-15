import assert from "node:assert";
const store = new Map();
globalThis.localStorage = { getItem:(k)=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:(k)=>store.delete(k) };
const fn = await import("../futureNotes.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};
const now = Date.now();

ok("attach + surface at the right moment (with lead time)", () => {
  store.clear();
  const at = now + 60*60*1000; // 1h away
  fn.attachNote({ text:"charger", surfaceAt: at, leadMinutes: 90 }); // lead opens it now
  const due = fn.getDueNotes(now);
  assert.strictEqual(due.length, 1);
  assert.strictEqual(due[0].text, "charger");
});
ok("NOT due before its lead window opens", () => {
  store.clear();
  const at = now + 10*60*60*1000; // 10h away
  fn.attachNote({ text:"later", surfaceAt: at, leadMinutes: 30 });
  assert.strictEqual(fn.getDueNotes(now).length, 0);
});
ok("a note has NO task fields — cannot be a task", () => {
  store.clear();
  fn.attachNote({ text:"x", surfaceAt: now });
  const all = fn.getAllNotes();
  assert.ok(!("done" in all[0]) && !("completed" in all[0]) && !("status" in all[0]));
});
ok("sweepExpired silently retires past-moment notes", () => {
  store.clear();
  fn.attachNote({ text:"old", surfaceAt: now - 5*60*60*1000 });
  fn.sweepExpired(now);
  assert.strictEqual(fn.getAllNotes().length, 0);
});
ok("rejects empty text and bad dates", () => {
  store.clear();
  assert.strictEqual(fn.attachNote({ text:"", surfaceAt: now }), null);
  assert.strictEqual(fn.attachNote({ text:"x", surfaceAt: "not-a-date" }), null);
});
console.log(`futureNotes: ${n}/5 pass`);
