/* P30 ANCHORED ANNOTATIONS — the law: mandatory anchor, hold-by-default voice. */
import assert from "node:assert";
const store = new Map();
globalThis.localStorage = { getItem:(k)=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:(k)=>store.delete(k) };
const fn = await import("../futureNotes.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};

ok("orphan (no valid anchor time) is REFUSED", () => {
  const id = fn.attachNote({ text: "someday reorganize the garage", surfaceAt: "not-a-date" });
  assert.strictEqual(id, null);
});
ok("a real anchor is accepted", () => {
  const id = fn.attachNote({ text: "prep for review", surfaceAt: Date.now() + 86400000 });
  assert.ok(typeof id === "string" && id.length > 0);
});
ok("voice defaults to HOLD when not explicitly speak", () => {
  store.clear();
  fn.attachNote({ text: "held note", surfaceAt: Date.now() + 86400000 });
  const all = fn.getAllNotes();
  assert.strictEqual(all[all.length-1].voice, "hold");
});
ok("voice is speak ONLY when explicitly chosen", () => {
  fn.attachNote({ text: "spoken note", surfaceAt: Date.now() + 86400000, voice: "speak" });
  const all = fn.getAllNotes();
  assert.strictEqual(all[all.length-1].voice, "speak");
});
console.log(`p30AnchorLaw: ${n}/4 pass`);
