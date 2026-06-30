// reframeVsHold.test.mjs — run: node src/v2/lib/__tests__/reframeVsHold.test.mjs
import assert from "node:assert";

// localStorage mock (lib reads window.localStorage first, then globalThis)
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { getLean, hasLean, setLean, clearLean, reframeHoldOptions } = await import(
  "../reframeVsHold.js"
);

const KEY = "stillform_v2_reframe_vs_hold";
let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };

// honest-empty default
store.clear();
ok(getLean() === null, "default lean null");
ok(hasLean() === false, "default hasLean false");

// set + get each valid lean
for (const L of ["reframe", "hold", "both"]) {
  store.clear();
  ok(setLean(L) === L, `setLean ${L} returns it`);
  ok(getLean() === L, `getLean ${L}`);
  ok(hasLean() === true, `hasLean true after ${L}`);
}

// invalid lean → no-op
store.clear();
ok(setLean("suppress") === null, "invalid lean returns null");
ok(getLean() === null, "invalid lean not stored");
ok(setLean("") === null, "empty lean null");
ok(setLean(null) === null, "null lean null");
ok(setLean(undefined) === null, "undefined lean null");

// persistence across reads
store.clear();
setLean("reframe");
ok(getLean() === "reframe", "persists across reads");

// overwrite
setLean("hold");
ok(getLean() === "hold", "overwrites lean");

// clear
clearLean();
ok(getLean() === null, "cleared lean null");
ok(hasLean() === false, "hasLean false after clear");

// setAt stamped
store.clear();
setLean("both");
const raw = JSON.parse(store.get(KEY));
ok(typeof raw.setAt === "string" && raw.setAt.length > 0, "setAt stamped");

// malformed JSON → honest-empty
store.clear();
store.set(KEY, "{not json");
ok(getLean() === null, "malformed JSON → null");
ok(hasLean() === false, "malformed JSON → hasLean false");

// stored garbage lean value → null
store.clear();
store.set(KEY, JSON.stringify({ lean: "xyz", setAt: "x" }));
ok(getLean() === null, "garbage lean → null");

// options shape + order
const opts = reframeHoldOptions();
ok(Array.isArray(opts) && opts.length === 3, "3 options");
ok(opts.every((o) => o.id && o.label), "options have id+label");
ok(opts.map((o) => o.id).join(",") === "reframe,hold,both", "options order");

console.log(`reframeVsHold.test.mjs — ${n}/${n} PASS`);
