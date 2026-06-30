// frameworkModel.test.mjs — run: node src/v2/lib/__tests__/frameworkModel.test.mjs
import assert from "node:assert";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const {
  FRAMEWORK_PREMISES, getFrameworkPremises,
  markPremiseExplored, getExploredPremises, getExploredCount, getPremiseCount,
  clearFrameworkModel,
} = await import("../frameworkModel.js");

const KEY = "stillform_v2_framework_model";
let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };

// ── content shape ─────────────────────────────────────────────────────────
ok(Array.isArray(FRAMEWORK_PREMISES) && FRAMEWORK_PREMISES.length === 3, "exactly 3 premises");
ok(getPremiseCount() === 3, "getPremiseCount = 3");
ok(getFrameworkPremises() === FRAMEWORK_PREMISES, "getFrameworkPremises returns the list");

const ids = FRAMEWORK_PREMISES.map((p) => p.id);
ok(JSON.stringify(ids) === JSON.stringify(["metacognition", "neuroplasticity", "reconsolidation"]),
  "premises in build-order: metacognition → neuroplasticity → reconsolidation");

for (const p of FRAMEWORK_PREMISES) {
  ok(typeof p.name === "string" && p.name.length > 0, `${p.id}: has name`);
  ok(typeof p.plainWhat === "string" && p.plainWhat.length > 20, `${p.id}: has plainWhat`);
  ok(typeof p.whyItCompounds === "string" && p.whyItCompounds.length > 20, `${p.id}: has whyItCompounds`);
  ok(typeof p.theMove === "string" && p.theMove.length > 0, `${p.id}: has theMove`);
  ok(typeof p.libraryId === "string" && p.libraryId.length > 0, `${p.id}: links a Library entry`);
}

// premises are frozen (immutable content)
ok(Object.isFrozen(FRAMEWORK_PREMISES), "list frozen");
ok(Object.isFrozen(FRAMEWORK_PREMISES[0]), "premise frozen");

// ── explored store ────────────────────────────────────────────────────────
store.clear();
ok(getExploredCount() === 0, "honest-empty: 0 explored");
ok(Array.isArray(getExploredPremises()) && getExploredPremises().length === 0, "explored []");

markPremiseExplored("metacognition");
ok(getExploredCount() === 1, "explored 1 after marking");
ok(getExploredPremises().includes("metacognition"), "metacognition recorded");

// idempotent — no double count
markPremiseExplored("metacognition");
ok(getExploredCount() === 1, "marking same premise again stays 1");

markPremiseExplored("neuroplasticity");
markPremiseExplored("reconsolidation");
ok(getExploredCount() === 3, "all three explored");

// invalid id → no-op
markPremiseExplored("bogus");
ok(getExploredCount() === 3, "invalid id ignored");

// clear
clearFrameworkModel();
ok(getExploredCount() === 0, "clear resets");

// corrupt store → honest-empty, no throw
store.set(KEY, "{not json");
ok(getExploredCount() === 0, "corrupt store → 0, no throw");
// stray ids filtered out on read
store.set(KEY, JSON.stringify({ explored: ["metacognition", "bogus", "metacognition"] }));
ok(getExploredCount() === 1, "filters invalid + dedupes on read");

console.log(`frameworkModel.test.mjs — ${n}/${n} PASS`);
