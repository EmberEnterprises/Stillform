// beliefRating.test.mjs — run: node src/v2/lib/__tests__/beliefRating.test.mjs
import assert from "node:assert";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const {
  recordBeliefRating, getBeliefRatings, getBeliefRatingCount,
  getRecentBeliefRatings, setReRating, getOtherReadEffect,
} = await import("../beliefRating.js");

const KEY = "stillform_belief_ratings";
let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };

// ── honest-empty ──────────────────────────────────────────────────────────
store.clear();
ok(getBeliefRatingCount() === 0, "empty count 0");
ok(getBeliefRatings().entries.length === 0, "empty entries");
ok(getOtherReadEffect() === null, "no data → effect null");

// ── record shape + delta + usedOtherRead default ─────────────────────────
store.clear();
let r = recordBeliefRating({ thought: "they're done with me", before: 80, after: 55 });
ok(r && r.id.startsWith("br_"), "record has id");
ok(r.before === 80 && r.after === 55, "before/after stored");
ok(r.delta === -25, "delta = after - before (belief dropped)");
ok(r.usedOtherRead === false, "usedOtherRead defaults false");

// ── usedOtherRead recorded when passed ────────────────────────────────────
r = recordBeliefRating({ thought: "I'll fail", before: 70, after: 40, usedOtherRead: true });
ok(r.usedOtherRead === true, "usedOtherRead true when passed");
// only strict true counts
r = recordBeliefRating({ thought: "x is bad", before: 60, after: 50, usedOtherRead: "yes" });
ok(r.usedOtherRead === false, "non-boolean truthy does NOT set usedOtherRead");

// ── clamp + validation ────────────────────────────────────────────────────
r = recordBeliefRating({ thought: "clamp", before: 140, after: -20 });
ok(r.before === 100 && r.after === 0, "ratings clamp to 0-100");
ok(recordBeliefRating({ thought: "", before: 50 }) === null, "empty thought → null");
ok(recordBeliefRating({ thought: "no before", before: "x" }) === null, "non-numeric before → null");
r = recordBeliefRating({ thought: "before only", before: 50 });
ok(r.after === null && r.delta === null, "after optional → delta null");

// ── setReRating updates delta ─────────────────────────────────────────────
const rr = setReRating(r.id, { after: 30 });
ok(rr && rr.after === 30 && rr.delta === -20, "setReRating recomputes delta");

// ── getOtherReadEffect: compares the two groups ──────────────────────────
store.clear();
// with other read: deltas -30, -20 (avg -25)
recordBeliefRating({ thought: "a", before: 80, after: 50, usedOtherRead: true });
recordBeliefRating({ thought: "b", before: 70, after: 50, usedOtherRead: true });
// without: deltas -10, -20 (avg -15)
recordBeliefRating({ thought: "c", before: 60, after: 50, usedOtherRead: false });
recordBeliefRating({ thought: "d", before: 70, after: 50 });
// no-delta record (before only) is ignored by the aggregator
recordBeliefRating({ thought: "e", before: 40, usedOtherRead: true });

const eff = getOtherReadEffect();
ok(eff !== null, "effect computed when both groups present");
ok(eff.withOtherRead.n === 2, "with-other-read counts only delta records (2, not 3)");
ok(eff.withOtherRead.avgDelta === -25, "with-other-read avg delta -25");
ok(eff.withoutOtherRead.n === 2, "without-other-read n 2");
ok(eff.withoutOtherRead.avgDelta === -15, "without-other-read avg delta -15");

// one-sided → null
store.clear();
recordBeliefRating({ thought: "only-with", before: 80, after: 50, usedOtherRead: true });
ok(getOtherReadEffect() === null, "only one group → null (nothing to compare)");

// ── recent, ordering ──────────────────────────────────────────────────────
store.clear();
recordBeliefRating({ thought: "first", before: 50, after: 40 });
recordBeliefRating({ thought: "second", before: 50, after: 40 });
ok(getRecentBeliefRatings(1).length === 1, "recent capped");

// ── corrupt store → honest-empty ─────────────────────────────────────────
store.set(KEY, "{bad json");
ok(getBeliefRatings().entries.length === 0, "corrupt store → empty, no throw");
ok(getOtherReadEffect() === null, "corrupt store → effect null");

console.log(`beliefRating.test.mjs — ${n}/${n} PASS`);
