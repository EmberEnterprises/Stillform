/* pinLock contract — W8 web tier. */
import assert from "node:assert";
import { webcrypto } from "node:crypto";
if (!globalThis.crypto?.subtle) globalThis.crypto = webcrypto;
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  key: (i) => Array.from(store.keys())[i] ?? null,
  get length() { return store.size; },
};
const pl = await import("../pinLock.js");
let n = 0; const ok = (name, f) => Promise.resolve(f()).then(() => { n++; console.log("PASS", name); });

await ok("set + verify + reject", async () => {
  store.clear();
  assert.strictEqual(await pl.setPin("123"), false); // too short
  assert.strictEqual(await pl.setPin("4821"), true);
  assert.strictEqual(pl.hasPin(), true);
  assert.strictEqual(await pl.verifyPin("4821"), true);
  assert.strictEqual(await pl.verifyPin("0000"), false);
});
await ok("hash not plaintext", () => {
  assert.ok(!JSON.stringify([...store.values()]).includes("4821"));
});
await ok("grace window governs locking", () => {
  assert.strictEqual(pl.shouldLock(), true); // no grace mark = cold start
  pl.markBackgrounded();
  assert.strictEqual(pl.shouldLock(), false); // within 60s
});
await ok("eraseEverything removes only app keys", () => {
  store.set("stillform_v2_thing", "x");
  store.set("unrelated", "y");
  assert.strictEqual(pl.eraseEverything(), true);
  assert.strictEqual(store.has("unrelated"), true);
  assert.strictEqual([...store.keys()].some((k) => k.startsWith("stillform")), false);
});
console.log(`pinLock: ${n}/4 pass`);
