import assert from "node:assert";
const pne = await import("../pendingNoteEvent.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};
ok("stash then take (one-shot, clears)", () => {
  pne.setPendingNoteEvent({ title: "Dentist", start: "2026-07-20T14:00:00Z" });
  const e = pne.takePendingNoteEvent();
  assert.strictEqual(e.title, "Dentist");
  assert.strictEqual(pne.takePendingNoteEvent(), null); // cleared
});
ok("rejects non-objects cleanly", () => {
  pne.setPendingNoteEvent(null);
  assert.strictEqual(pne.takePendingNoteEvent(), null);
});
console.log(`pendingNoteEvent: ${n}/2 pass`);
