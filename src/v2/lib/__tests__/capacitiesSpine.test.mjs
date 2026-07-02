// capacitiesSpine.test.mjs — run: node src/v2/lib/__tests__/capacitiesSpine.test.mjs
// The longitudinal spine: getGrowthRead / getRetakeInvitation / formatCapacitiesForAI.
import assert from "node:assert";

const store = new Map();
const ls = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};
globalThis.localStorage = ls;
globalThis.window = { localStorage: ls };

const {
  getGrowthRead, getRetakeInvitation, formatCapacitiesForAI, _spine,
} = await import("../capacitiesProfile.js");

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };
const eq = (a, b, m) => { assert.strictEqual(a, b, m); n++; };

const KEY = "stillform_capacities_profile";
const DAY = 24 * 60 * 60 * 1000;
const iso = (msAgo) => new Date(Date.now() - msAgo).toISOString();

function seed(takes) {
  store.set(KEY, JSON.stringify({ takes }));
}
const take = (instrumentId, msAgo, reading, facets = [], aiSteer = null) => ({
  instrumentId,
  takenAt: iso(msAgo),
  results: { reading, facets, aiSteer },
});

// ── getGrowthRead ──────────────────────────────────────────────────────────
store.clear();
eq(getGrowthRead("sris"), null, "no takes → null");

seed([take("sris", 100 * DAY, { key: "looping", title: "Reflecting without landing" })]);
eq(getGrowthRead("sris"), null, "one take → null (no growth story from one point)");

seed([
  take("sris", 100 * DAY, { key: "looping", title: "Reflecting without landing" },
    [{ id: "sr", label: "Self-reflection", level: "high" }, { id: "in", label: "Insight", level: "low" }]),
  take("sris", 5 * DAY, { key: "integrated", title: "Reflection that lands" },
    [{ id: "sr", label: "Self-reflection", level: "high" }, { id: "in", label: "Insight", level: "high" }]),
]);
let g = getGrowthRead("sris");
ok(g && g.moved === true, "reading key changed → moved");
eq(g.from.title, "Reflecting without landing", "baseline title carried");
eq(g.to.key, "integrated", "latest key carried");
eq(g.facetShifts.length, 1, "one facet shifted");
eq(g.facetShifts[0].label, "Insight", "shifted facet labeled");
eq(`${g.facetShifts[0].from}→${g.facetShifts[0].to}`, "low→high", "shift direction is words");

// same reading, no facet change → moved false, no shifts (mirror renders nothing)
seed([
  take("sris", 100 * DAY, { key: "looping", title: "T" }, [{ id: "sr", label: "SR", level: "high" }]),
  take("sris", 5 * DAY, { key: "looping", title: "T" }, [{ id: "sr", label: "SR", level: "high" }]),
]);
g = getGrowthRead("sris");
ok(g && g.moved === false && g.facetShifts.length === 0, "consistent read → moved:false, no shifts");

// three takes: growth = FIRST vs LATEST (middle ignored)
seed([
  take("sris", 200 * DAY, { key: "a", title: "A" }),
  take("sris", 100 * DAY, { key: "b", title: "B" }),
  take("sris", 1 * DAY, { key: "c", title: "C" }),
]);
g = getGrowthRead("sris");
eq(`${g.from.key}→${g.to.key}`, "a→c", "growth is baseline vs latest");

// malformed takes fail closed
seed([take("sris", 100 * DAY, null), take("sris", 5 * DAY, { key: "x", title: "X" })]);
eq(getGrowthRead("sris"), null, "missing baseline reading → null (fail closed)");

// ── getRetakeInvitation ────────────────────────────────────────────────────
store.clear();
eq(getRetakeInvitation("erq"), null, "never taken → no invitation");

seed([take("erq", 10 * DAY, { key: "k", title: "K" })]);
eq(getRetakeInvitation("erq"), null, "10 days since → still recent, no invitation");

seed([take("erq", (_spine.RETAKE_DAYS + 5) * DAY, { key: "k", title: "K" })]);
let inv = getRetakeInvitation("erq");
ok(inv && inv.daysSince >= _spine.RETAKE_DAYS, "a season since → invitation with daysSince");

// the LATEST take gates it, not the first
seed([
  take("erq", 400 * DAY, { key: "k", title: "K" }),
  take("erq", 10 * DAY, { key: "k", title: "K" }),
]);
eq(getRetakeInvitation("erq"), null, "recent re-take resets the season clock");

// bad timestamp fails closed
seed([{ instrumentId: "erq", takenAt: "not-a-date", results: { reading: { key: "k" } } }]);
eq(getRetakeInvitation("erq"), null, "unparseable takenAt → null");

// ── formatCapacitiesForAI ──────────────────────────────────────────────────
store.clear();
eq(formatCapacitiesForAI(), null, "nothing taken → null (backend skips)");

seed([take("sris", 5 * DAY, { key: "looping", title: "T" }, [], "reflects-without-resolving")]);
let s = formatCapacitiesForAI();
ok(s.includes("See yourself: looping"), "loop-layer + reading key present");
ok(s.includes("(reflects-without-resolving)"), "aiSteer finally consumed");

// moved flag included when the read shifted
seed([
  take("sris", 100 * DAY, { key: "looping", title: "T1" }),
  take("sris", 5 * DAY, { key: "integrated", title: "T2" }),
]);
s = formatCapacitiesForAI();
ok(s.includes("[moved from looping"), "moved-since flag reaches the AI");

// multiple capacities join; untaken ones absent
seed([
  take("sris", 5 * DAY, { key: "integrated", title: "T" }),
  take("erq", 5 * DAY, { key: "reappraises", title: "T" }),
]);
s = formatCapacitiesForAI();
ok(s.includes("See yourself: integrated") && s.includes("Settle: reappraises"), "both taken capacities present");
ok(!s.includes("Sense:") && !s.includes("See others:"), "untaken capacities absent — never fabricated");

console.log(`capacitiesSpine.test.mjs — ${n}/${n} PASS`);
