import assert from "node:assert";
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};
const sl = await import("../scanLog.js");
let n = 0; const ok = (name, f) => { f(); n++; console.log("PASS", name); };
ok("records partial + full, flags full correctly", () => {
  store.clear();
  assert.strictEqual(sl.recordScan({ areasRead: 3, totalAreas: 6 }), true);
  assert.strictEqual(sl.recordScan({ areasRead: 6, totalAreas: 6 }), true);
  assert.strictEqual(sl.getScanCount(), 2);
});
ok("rejects zero-area scans", () => {
  assert.strictEqual(sl.recordScan({ areasRead: 0 }), false);
});
console.log(`scanLog: ${n}/2 pass`);
