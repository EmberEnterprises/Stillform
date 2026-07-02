// seasonReview.test.mjs — run: node src/v2/lib/__tests__/seasonReview.test.mjs
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

const { getSeasonReview, _review } = await import("../seasonReview.js");

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };
const eq = (a, b, m) => { assert.strictEqual(a, b, m); n++; };

const DAY = 86400000;
const iso = (daysAgo) => new Date(Date.now() - daysAgo * DAY).toISOString();

function seedSessions(count, spreadDays) {
  // count sessions across spreadDays distinct days, inside the window
  const arr = Array.from({ length: count }, (_, i) => ({
    timestamp: iso(1 + (i % spreadDays)),
  }));
  store.set("stillform_v2_sessions", JSON.stringify(arr));
}

// ── the gate ───────────────────────────────────────────────────────────────
store.clear();
eq(getSeasonReview(), null, "empty record → no review");

seedSessions(_review.MIN_SESSIONS - 1, 10);
eq(getSeasonReview(), null, "below MIN_SESSIONS → gated");

seedSessions(_review.MIN_SESSIONS + 3, 3); // enough sessions, too few days
eq(getSeasonReview(), null, "below MIN_DISTINCT_DAYS → gated (binge ≠ a season)");

seedSessions(_review.MIN_SESSIONS + 3, _review.MIN_DISTINCT_DAYS + 2);
let r = getSeasonReview();
ok(r !== null, "enough practice across enough days → review exists");
eq(r.practice.sessions, _review.MIN_SESSIONS + 3, "session count carried");
ok(r.practice.distinctDays >= _review.MIN_DISTINCT_DAYS, "distinct days carried");

// old sessions outside the window don't count
store.clear();
const old = Array.from({ length: 40 }, (_, i) => ({ timestamp: iso(_review.WINDOW_DAYS + 5 + i) }));
store.set("stillform_v2_sessions", JSON.stringify(old));
eq(getSeasonReview(), null, "practice outside the window → gated");

// ── sections derive from real stores ───────────────────────────────────────
seedSessions(20, 12);
// thoughts: 2 eased, 1 held, 1 unrated (tested=4)
store.set("stillform_belief_ratings", JSON.stringify({ entries: [
  { id: "b1", thought: "t", before: 80, after: 40, delta: -40, markedAt: iso(3) },
  { id: "b2", thought: "t", before: 70, after: 30, delta: -40, markedAt: iso(5) },
  { id: "b3", thought: "t", before: 60, after: 70, delta: 10, markedAt: iso(6) },
  { id: "b4", thought: "t", before: 50, after: null, delta: null, markedAt: iso(7) },
  { id: "b5", thought: "t", before: 50, after: 10, delta: -40, markedAt: iso(200) }, // outside window
]}));
// capacities: one moved
store.set("stillform_capacities_profile", JSON.stringify({ takes: [
  { instrumentId: "sris", takenAt: iso(80), results: { reading: { key: "looping", title: "Reflecting without landing" }, facets: [] } },
  { instrumentId: "sris", takenAt: iso(4), results: { reading: { key: "integrated", title: "Reflection that lands" }, facets: [] } },
]}));
// triggers: one retired (needs detection-active sessions since lastSeen — the 20 seeded sessions serve)
store.set("stillform_v2_trigger_profile", JSON.stringify({ triggers: [
  { id: "t1", label: "deadline pressure", category: "work", encounterCount: 6, lastSeen: iso(40) },
]}));
// named this season: 1 vulnerability in-window, 1 strength out-of-window
store.set("stillform_v2_vulnerabilities", JSON.stringify({ confirmed: [
  { id: "v1", trait: "x", costEdge: "c", strengthEdge: "s", confirmedAt: Date.now() - 10 * DAY },
]}));
store.set("stillform_v2_strengths", JSON.stringify({ confirmed: [
  { id: "s1", strength: "y", confirmedAt: Date.now() - 200 * DAY },
]}));

r = getSeasonReview();
ok(r !== null, "full review derives");
eq(r.thoughts.tested, 4, "in-window thoughts counted (out-of-window excluded)");
eq(r.thoughts.eased, 2, "eased = delta<0");
eq(r.thoughts.held, 1, "held = delta>=0 (unrated excluded)");
eq(r.capacitiesMoved.length, 1, "moved capacity surfaced");
eq(r.capacitiesMoved[0].toTitle, "Reflection that lands", "titles carried, not numbers");
eq(r.quietTriggers.length, 1, "retired trigger listed");
eq(r.quietTriggers[0], "deadline pressure", "by label");
eq(r.named.vulnerabilities, 1, "in-window confirmation counted");
eq(r.named.strengths, 0, "out-of-window confirmation excluded");

// ── fail-soft: a corrupt store contributes nothing, never kills the review ─
store.set("stillform_belief_ratings", "{{{corrupt");
r = getSeasonReview();
ok(r !== null, "corrupt belief store → review still derives");
eq(r.thoughts.tested, 0, "corrupt section contributes zero");

console.log(`seasonReview.test.mjs — ${n}/${n} PASS`);
