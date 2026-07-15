/* keepShelf contract — J6. */
import assert from "node:assert";
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};
const ks = await import("../keepShelf.js");
let n = 0; const ok = (name, f) => { f(); n++; console.log("PASS", name); };

ok("keep + isKept + dedupe", () => {
  store.clear();
  assert.strictEqual(ks.keepLine({ text: "the frame is not the fact", source: "guide" }), true);
  assert.strictEqual(ks.isKept("the frame is not the fact"), true);
  ks.keepLine({ text: "the frame is not the fact", source: "guide" });
  assert.strictEqual(ks.getKeptLines().length, 1); // deduped
});
ok("rejects trivial + unkeep is clean", () => {
  assert.strictEqual(ks.keepLine({ text: "" }), false);
  ks.unkeepLine("the frame is not the fact");
  assert.strictEqual(ks.isKept("the frame is not the fact"), false);
});
ok("resurface returns most recent or null", () => {
  store.clear();
  assert.strictEqual(ks.getResurfaceLine(), null);
  ks.keepLine({ text: "first", source: "you" });
  ks.keepLine({ text: "second", source: "guide" });
  assert.strictEqual(ks.getResurfaceLine().text, "second");
});
console.log(`keepShelf: ${n}/3 pass`);
