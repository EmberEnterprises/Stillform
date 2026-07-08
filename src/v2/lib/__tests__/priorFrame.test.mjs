// priorFrame.test.mjs — the reconsolidation bridge: only the user's own words,
// only on a token match, honest-empty otherwise.
import assert from "node:assert";
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => void store.set(k, String(v)),
  removeItem: (k) => void store.delete(k),
  clear: () => store.clear(),
};
globalThis.window = { localStorage: globalThis.localStorage };
const reset = () => store.clear();
const seedSessions = (arr) => store.set("stillform_v2_sessions", JSON.stringify(arr));

const pf = await import("../priorFrame.js");
let passed = 0;
const ok = (name, fn) => { fn(); passed++; console.log("PASS " + name); };

const NOW = Date.now();
const sess = (over) => ({
  precisionName: "", selectedChip: null, takeaway: null, nextMove: null,
  lockIn: null, surfacedFrame: null, timestamp: new Date(NOW - 2 * 86400000).toISOString(),
  ...over,
});

ok("honest-empty: no sessions -> null", () => {
  reset();
  assert.strictEqual(pf.getPriorFrame({ trigger: "deadline pressure" }), null);
});

ok("no lock-in/next-move in the matching session -> silence (nothing they landed on)", () => {
  reset();
  seedSessions([sess({ precisionName: "deadline pressure again", takeaway: "it passed" })]);
  assert.strictEqual(pf.getPriorFrame({ trigger: "deadline pressure" }), null);
});

ok("token match on the trigger resurfaces THEIR lock-in, with when", () => {
  reset();
  seedSessions([sess({
    precisionName: "deadline pressure spiraling",
    lockIn: "One task at a time; the deadline is a schedule, not a verdict.",
    nextMove: "Next time deadline pressure hits, I list three concrete steps first.",
  })]);
  const f = pf.getPriorFrame({ trigger: "deadline pressure" });
  assert.ok(f);
  assert.ok(f.lockIn.includes("schedule, not a verdict"));
  assert.strictEqual(f.when, "2 days ago");
});

ok("match can come from the follows token when the trigger is absent", () => {
  reset();
  seedSessions([sess({ takeaway: "named that drained feeling honestly", lockIn: "Rest is part of the work." })]);
  const f = pf.getPriorFrame({ trigger: "quarterly review", follows: "drained" });
  assert.ok(f);
  assert.strictEqual(f.lockIn, "Rest is part of the work.");
});

ok("no token match anywhere -> null (never a loose association)", () => {
  reset();
  seedSessions([sess({ precisionName: "traffic frustration", lockIn: "Leave ten minutes earlier." })]);
  assert.strictEqual(pf.getPriorFrame({ trigger: "deadline pressure", follows: "drained" }), null);
});

ok("bad input -> null", () => {
  reset();
  assert.strictEqual(pf.getPriorFrame(null), null);
  assert.strictEqual(pf.getPriorFrame({}), null);
});

console.log(`priorFrame: ${passed}/6 pass`);
