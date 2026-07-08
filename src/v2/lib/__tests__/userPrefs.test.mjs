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

ok("per-voice concierge switches default ON, round-trip OFF", () => {
  reset();
  assert.strictEqual(up.getPref("concierge.forecasts"), true);
  assert.strictEqual(up.setPref("concierge.forecasts", false), true);
  assert.strictEqual(up.getPref("concierge.forecasts"), false);
});

ok("ai.directness validated; addressAs is free text, trimmed and capped", () => {
  reset();
  assert.strictEqual(up.setPref("ai.directness", "direct"), true);
  assert.strictEqual(up.setPref("ai.directness", "brutal"), false);
  assert.strictEqual(up.getPref("ai.addressAs"), "");
  assert.strictEqual(up.setPref("ai.addressAs", "  Arlin  "), true);
  assert.strictEqual(up.getPref("ai.addressAs"), "Arlin");
  assert.strictEqual(up.hasExplicitPref("ai.addressAs"), true);
});

ok("removed audioCues pref is dead: unknown path refused", () => {
  reset();
  assert.strictEqual(up.setPref("sensory.audioCues", true), false);
  assert.strictEqual(up.getPref("sensory.audioCues"), undefined);
});

console.log(`userPrefs: ${passed}/7 pass`);
