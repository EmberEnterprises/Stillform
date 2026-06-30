// triggerMeta.test.mjs — run: node src/v2/lib/__tests__/triggerMeta.test.mjs
import assert from "node:assert";

// localStorage mock (triggerProfile uses bare global localStorage)
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const KEY = "stillform_v2_trigger_profile";
const { getTriggerMeta, hasTriggerMeta, triggerCategoryLabel } = await import("../triggerMeta.js");

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };

function seed(triggers) {
  store.set(KEY, JSON.stringify({ triggers, updatedAt: new Date().toISOString() }));
}
const trig = (label, category, encounterCount = 0) => ({
  id: `t_${label}`, label, category, encounterCount,
  lastSeen: null, createdAt: new Date().toISOString(),
});

// ── honest-empty ──────────────────────────────────────────────────────────
store.clear();
ok(getTriggerMeta() === null, "no profile → null");
ok(hasTriggerMeta() === false, "no profile → hasTriggerMeta false");

seed([trig("a", "work"), trig("b", "relational")]);
ok(getTriggerMeta() === null, "2 triggers (under threshold) → null");

// ── clustering: a dominant area ───────────────────────────────────────────
seed([
  trig("boss reviews", "work", 5),
  trig("deadlines", "work", 2),
  trig("mom calls", "relational", 1),
  trig("rent", "financial", 0),
]);
let m = getTriggerMeta();
ok(m !== null, "4 triggers → reads");
ok(m.total === 4, "total counted");
ok(m.clusters[0].category === "work" && m.clusters[0].count === 2, "work is top cluster (2)");
ok(m.dominant && m.dominant.category === "work", "work is dominant (>=40%, clear top)");
ok(m.spread === false, "not spread when dominant");
ok(m.clusters[0].label === "relationships" ? false : m.clusters[0].label === "work", "cluster carries plain label");

// ── frequency: load-bearing few ──────────────────────────────────────────
ok(m.totalEncounters === 8, "encounters summed (5+2+1+0)");
ok(m.loadBearing.length === 3, "top 3 load-bearing (only those with encounters>0)");
ok(m.loadBearing[0].label === "boss reviews" && m.loadBearing[0].encounterCount === 5, "most-fired first");
ok(!m.loadBearing.some((t) => t.encounterCount === 0), "zero-encounter triggers excluded from load-bearing");
ok(m.untagged === false, "untagged false when encounters exist");

// ── spread: no area concentrates (tie at top) ────────────────────────────
seed([
  trig("a", "work"),
  trig("b", "relational"),
  trig("c", "financial"),
]);
m = getTriggerMeta();
ok(m.dominant === null, "tie at top (1/1/1) → no dominant");
ok(m.spread === true, "spread true when no concentration");

// ── spread: top exists but under 40% share ───────────────────────────────
seed([
  trig("a", "work"), trig("b", "relational"), trig("c", "financial"),
  trig("d", "health"), trig("e", "current-events"),
]);
m = getTriggerMeta();
ok(m.dominant === null, "all distinct, no category >=40% → no dominant");
ok(m.spread === true, "spread true");

// ── untagged: named but never fired ──────────────────────────────────────
seed([trig("a", "work"), trig("b", "work"), trig("c", "relational")]);
m = getTriggerMeta();
ok(m.totalEncounters === 0, "no encounters → 0");
ok(m.untagged === true, "untagged true when nothing tagged");
ok(m.loadBearing.length === 0, "no load-bearing when untagged");
ok(m.dominant && m.dominant.category === "work", "still reads cluster when untagged (2 work vs 1)");

// ── unknown category coerced to 'other' ──────────────────────────────────
seed([trig("a", "bogus"), trig("b", "bogus"), trig("c", "work")]);
m = getTriggerMeta();
ok(m.clusters.some((c) => c.category === "other"), "unknown category folded to 'other'");

// ── label helper ─────────────────────────────────────────────────────────
ok(triggerCategoryLabel("relational") === "relationships", "label: relational→relationships");
ok(triggerCategoryLabel("cross-cultural") === "identity & code-switching", "label: cross-cultural");
ok(triggerCategoryLabel("nope") === "other", "unknown label → other");

// ── corrupt store → honest null, no throw ────────────────────────────────
store.set(KEY, "{not json");
ok(getTriggerMeta() === null, "corrupt store → null, no throw");

console.log(`triggerMeta.test.mjs — ${n}/${n} PASS`);
