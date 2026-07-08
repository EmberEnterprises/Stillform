// becoming.test.mjs — the evidence-of-self contract (anti-backfire by design).
import assert from "node:assert";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => void store.set(k, String(v)),
  removeItem: (k) => void store.delete(k),
  clear: () => store.clear(),
};
const reset = () => store.clear();

const b = await import("../becoming.js");
let passed = 0;
const ok = (name, fn) => { fn(); passed++; console.log("PASS " + name); };

ok("honest-empty fresh", () => {
  reset();
  assert.deepStrictEqual(b.getDirections(), []);
  assert.strictEqual(b.formatBecomingForAI(), null);
});

ok("naming a fair direction round-trips", () => {
  reset();
  assert.strictEqual(b.nameDirection("Courage"), true);
  assert.strictEqual(b.getDirections()[0].quality, "courage");
});

ok("appearance qualities are refused (Arlin's rule: never appearance)", () => {
  reset();
  assert.strictEqual(b.nameDirection("attractive"), false);
  assert.strictEqual(b.nameDirection("skinny"), false);
  assert.deepStrictEqual(b.getDirections(), []);
});

ok("others'-verdict qualities are refused (needs the world's vote = out)", () => {
  reset();
  assert.strictEqual(b.nameDirection("likable"), false);
  assert.deepStrictEqual(b.getDirections(), []);
});

ok("capped at 5 — a direction set, not a wishlist", () => {
  reset();
  for (const q of ["courage", "patience", "honesty", "discipline", "restraint"]) b.nameDirection(q);
  assert.strictEqual(b.nameDirection("integrity"), false);
  assert.strictEqual(b.getDirections().length, 5);
});

ok("evidence lands only under a named direction, user-confirmed", () => {
  reset();
  assert.strictEqual(b.confirmEvidence("courage", "stayed in the hard talk"), false); // not named yet
  b.nameDirection("courage");
  assert.strictEqual(b.confirmEvidence("courage", "stayed in the hard talk on Tuesday"), true);
  assert.strictEqual(b.getDirections()[0].evidence.length, 1);
});

ok("remove direction removes its evidence", () => {
  reset();
  b.nameDirection("patience");
  b.confirmEvidence("patience", "waited out the urge to fire back");
  assert.strictEqual(b.removeDirection("patience"), true);
  assert.deepStrictEqual(b.getDirections(), []);
});

ok("AI format carries the anti-backfire rules verbatim anchors", () => {
  reset();
  b.nameDirection("resilience");
  b.confirmEvidence("resilience", "came back to the project after the rejection");
  const f = b.formatBecomingForAI();
  assert.ok(f.includes("DIRECTIONS, never verdicts"));
  assert.ok(f.includes("Wood 2009"));
  assert.ok(f.includes("never infer what others believed or intended"));
  assert.ok(f.includes("never manufacture proof"));
  assert.ok(f.includes("resilience"));
});

console.log(`becoming: ${passed}/8 pass`);
