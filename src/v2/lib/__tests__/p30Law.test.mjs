/* P30 ANCHORED ANNOTATIONS — the law, enforced. */
import assert from "node:assert";
const store = new Map();
globalThis.localStorage = { getItem:(k)=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:(k)=>store.delete(k) };
const fn = await import("../futureNotes.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};

ok("orphan refused — a note with no real moment is rejected", () => {
  const id = fn.attachNote({ text: "someday reorganize the garage", surfaceAt: "not a date" });
  assert.strictEqual(id, null); // no anchor = refused
});
ok("anchored note accepted — real moment stands", () => {
  const id = fn.attachNote({ text: "prep for review", surfaceAt: Date.now() + 86400000 });
  assert.ok(typeof id === "string");
});
ok("voice defaults to HOLD — unshamed waiting, no auto-speak", () => {
  store.clear();
  const id = fn.attachNote({ text: "x", surfaceAt: Date.now() + 86400000 });
  const all = fn.getAllNotes();
  const note = all.find((n) => n.id === id);
  assert.strictEqual(note.voice, "hold"); // default is keep quietly
});
ok("acceptPackingNote also defaults HOLD (P30 uniform)", () => {
  const id = fn.acceptPackingNote({ startMs: Date.now() + 3*86400000, tripTitle: "Trip" }, "charger, meds");
  const note = fn.getAllNotes().find((n) => n.id === id);
  assert.strictEqual(note.voice, "hold");
});
ok("no note carries a task field — never a to-do", () => {
  const all = fn.getAllNotes();
  for (const note of all) {
    assert.strictEqual(note.done, undefined);
    assert.strictEqual(note.completed, undefined);
    assert.strictEqual(note.status, undefined);
  }
});
console.log(`p30Law: ${n}/5 pass`);
