/* P22 audio brief — speech utility contract with a simulated synthesis. */
import assert from "node:assert";
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};

let spoken = [];
let cancelled = 0;
globalThis.window = {
  speechSynthesis: { speak: (u) => { spoken.push(u.text); if (u.onend) u.onend(); }, cancel: () => { cancelled++; } },
  SpeechSynthesisUtterance: class { constructor(t){ this.text = t; this.rate = 1; } },
};
const sp = await import("../speak.js");

ok("isSpeechAvailable true when synthesis present", () => {
  assert.strictEqual(sp.isSpeechAvailable(), true);
});
ok("speaks segments in order, onEnd fires (synchronous synthesis)", () => {
  spoken = [];
  let ended = false;
  sp.speakSegments(["one", "two", "three"], { onEnd: () => { ended = true; } });
  assert.deepStrictEqual(spoken, ["one", "two", "three"]);
  assert.ok(ended);
});
ok("stop() cancels synthesis", () => {
  cancelled = 0;
  const stop = sp.speakSegments(["a", "b"]);
  stop();
  assert.ok(cancelled > 0);
});
ok("empty/garbage input never throws", () => {
  assert.strictEqual(typeof sp.speakSegments([]), "function");
  assert.strictEqual(typeof sp.speakSegments(null), "function");
  assert.strictEqual(typeof sp.speakSegments(["", "  "]), "function");
});
console.log(`speak: ${n}/4 pass`);
