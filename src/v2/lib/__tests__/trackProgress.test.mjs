// trackProgress.test.mjs — honest counting for "the moves you're building".
import assert from "node:assert";

// localStorage shim (Map-backed), installed before importing the module.
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => void store.set(k, String(v)),
  removeItem: (k) => void store.delete(k),
  clear: () => store.clear(),
};
const SESSIONS_KEY = "stillform_v2_sessions";
const seedSessions = (arr) => store.set(SESSIONS_KEY, JSON.stringify(arr));
const reset = () => store.clear();

const tp = await import("../trackProgress.js");
let passed = 0;
const ok = (name, fn) => { fn(); passed++; console.log("PASS " + name); };

ok("honest-empty on fresh store", () => {
  reset();
  assert.deepStrictEqual(tp.getWorkingOn(), []);
  assert.strictEqual(tp.isWorkingOn("naming-a-feeling"), false);
  assert.deepStrictEqual(tp.getPractice("naming-a-feeling"), { count: 0, last: null });
  assert.deepStrictEqual(tp.getLiveUsage("naming-a-feeling"), { count: 0, last: null });
  assert.deepStrictEqual(tp.getMovesBuilding(["naming-a-feeling"]), []);
});

ok("working-on toggle round-trips", () => {
  reset();
  assert.strictEqual(tp.toggleWorkingOn("reframe-x"), true);
  assert.strictEqual(tp.isWorkingOn("reframe-x"), true);
  assert.deepStrictEqual(tp.getWorkingOn(), ["reframe-x"]);
  assert.strictEqual(tp.toggleWorkingOn("reframe-x"), false);
  assert.strictEqual(tp.isWorkingOn("reframe-x"), false);
});

ok("practice counts each finish", () => {
  reset();
  tp.recordPractice("the-exhale-lever");
  tp.recordPractice("the-exhale-lever");
  const p = tp.getPractice("the-exhale-lever");
  assert.strictEqual(p.count, 2);
  assert.ok(p.last);
});

ok("live usage counts ONLY sessions whose movesUsed includes the id (never fabricated)", () => {
  reset();
  seedSessions([
    { timestamp: "2026-06-01T10:00:00Z", movesUsed: ["naming-a-feeling"] },
    { timestamp: "2026-06-03T10:00:00Z", movesUsed: ["naming-a-feeling", "reframe-x"] },
    { timestamp: "2026-06-02T10:00:00Z", movesUsed: [] },           // no moves → no count
    { timestamp: "2026-06-04T10:00:00Z" },                           // no movesUsed field → no count
  ]);
  const naming = tp.getLiveUsage("naming-a-feeling");
  assert.strictEqual(naming.count, 2);
  assert.strictEqual(naming.last, "2026-06-03T10:00:00Z"); // newest of the two matches
  assert.strictEqual(tp.getLiveUsage("reframe-x").count, 1);
  assert.strictEqual(tp.getLiveUsage("never-used").count, 0); // not in any movesUsed → 0, not invented
});

ok("getMovesBuilding = union(marked, practiced, live), valid-id filtered, working first", () => {
  reset();
  seedSessions([{ timestamp: "2026-06-03T10:00:00Z", movesUsed: ["naming-a-feeling"] }]);
  tp.recordPractice("the-exhale-lever");
  tp.toggleWorkingOn("reframe-x");
  tp.toggleWorkingOn("STALE-ID"); // not a valid move → must be dropped
  const valid = ["naming-a-feeling", "the-exhale-lever", "reframe-x"];
  const b = tp.getMovesBuilding(valid);
  const ids = b.map((x) => x.id);
  assert.deepStrictEqual([...ids].sort(), ["naming-a-feeling", "reframe-x", "the-exhale-lever"]);
  assert.ok(!ids.includes("STALE-ID"), "stale id dropped");
  assert.strictEqual(b[0].id, "reframe-x", "working-on sorts first");
  const naming = b.find((x) => x.id === "naming-a-feeling");
  assert.strictEqual(naming.live.count, 1);
  assert.strictEqual(naming.working, false);
});

ok("corrupt store does not throw (fail-silent honest-empty)", () => {
  reset();
  store.set("stillform_v2_track_working_on", "{not json");
  store.set("stillform_v2_track_practice", "[broken");
  store.set(SESSIONS_KEY, "nope");
  assert.deepStrictEqual(tp.getWorkingOn(), []);
  assert.deepStrictEqual(tp.getPractice("x"), { count: 0, last: null });
  assert.deepStrictEqual(tp.getLiveUsage("x"), { count: 0, last: null });
  assert.deepStrictEqual(tp.getMovesBuilding(["x"]), []);
});

console.log(`\n${passed}/${passed} trackProgress tests pass`);
