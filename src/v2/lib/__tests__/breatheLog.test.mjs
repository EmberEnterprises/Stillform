/* breatheLog contract — W2, the most-used practice enters the record. */
import assert from "node:assert";
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};
const bl = await import("../breatheLog.js");
let passed = 0;
function ok(name, fn) { fn(); passed++; console.log(`PASS ${name}`); }

ok("records and counts today", () => {
  store.clear();
  assert.strictEqual(bl.recordBreathe({ patternId: "cyclic-sighing", cycles: 4 }), true);
  assert.strictEqual(bl.recordBreathe({ patternId: "cyclic-sighing", cycles: 4 }), true);
  assert.strictEqual(bl.getTodayBreatheCount(), 2);
  assert.strictEqual(bl.getBreatheCount(), 2);
});

ok("caps the log oldest-first", () => {
  store.clear();
  for (let i = 0; i < 405; i++) bl.recordBreathe({ cycles: 1 });
  assert.strictEqual(bl.getBreatheCount(), 400);
});

ok("fail-silent without storage", () => {
  const real = globalThis.localStorage;
  globalThis.localStorage = { getItem() { throw new Error("no"); }, setItem() { throw new Error("no"); } };
  assert.strictEqual(bl.recordBreathe({}), false);
  assert.strictEqual(bl.getTodayBreatheCount(), 0);
  globalThis.localStorage = real;
});

console.log(`breatheLog: ${passed}/3 pass`);
