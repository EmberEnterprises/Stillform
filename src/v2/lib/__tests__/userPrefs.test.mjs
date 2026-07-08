// userPrefs.test.mjs — the dials contract: defaults, validation, ownership.
import assert from "node:assert";
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => void store.set(k, String(v)),
  removeItem: (k) => void store.delete(k),
  clear: () => store.clear(),
};
const reset = () => store.clear();
const up = await import("../userPrefs.js");
let passed = 0;
const ok = (name, fn) => { fn(); passed++; console.log("PASS " + name); };

ok("defaults = shipped behavior (nothing changes until a dial moves)", () => {
  reset();
  assert.strictEqual(up.getPref("practice.defaultBreathing"), "quick-reset");
  assert.strictEqual(up.getPref("concierge.volume"), "adaptive");
  assert.strictEqual(up.getPref("sensory.audioCues"), true);
});

ok("set + get round-trips a valid value", () => {
  reset();
  assert.strictEqual(up.setPref("concierge.volume", "soft"), true);
  assert.strictEqual(up.getPref("concierge.volume"), "soft");
});

ok("invalid values are refused — there is deliberately no 'loud'", () => {
  reset();
  assert.strictEqual(up.setPref("concierge.volume", "loud"), false);
  assert.strictEqual(up.getPref("concierge.volume"), "adaptive");
});

ok("unknown paths are refused, corrupt storage falls back to defaults", () => {
  reset();
  assert.strictEqual(up.setPref("ai.hypnosis", true), false);
  store.set("stillform_v2_prefs", "{corrupt");
  assert.strictEqual(up.getPref("practice.defaultBreathing"), "quick-reset");
});

console.log(`userPrefs: ${passed}/4 pass`);
