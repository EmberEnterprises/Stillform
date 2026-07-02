// feltMoments.test.mjs — run: node src/v2/lib/__tests__/feltMoments.test.mjs
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

const { getPendingProofMoment, markProofMomentShown } = await import("../feltMoments.js");

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };
const eq = (a, b, m) => { assert.strictEqual(a, b, m); n++; };

const DAY = 86400000;
const iso = (daysAgo) => new Date(Date.now() - daysAgo * DAY).toISOString();

// ── empty record → no moment (fail-closed) ────────────────────────────────
store.clear();
eq(getPendingProofMoment(), null, "empty record → null");

// ── first finding fires, carries the label ────────────────────────────────
store.set("stillform_discovery_findings", JSON.stringify({ confirmed: [
  { id: "f1", kind: "co-occurrence", label: "\u201cirritable\u201d tends to show up near \u201cpoor sleep\u201d", confirmedAt: Date.now() - 2 * DAY },
], rejected: [] }));
let m = getPendingProofMoment();
ok(m && m.id === "first-finding", "confirmed finding → first-finding moment");
ok(m.label.includes("irritable"), "label carried verbatim");

// ── once ever: marked shown → never again ─────────────────────────────────
markProofMomentShown(m.id);
eq(getPendingProofMoment(Date.now() + DAY), null, "shown moment never re-fires (next day, nothing else true)");

// ── one per day: a second true moment waits for tomorrow ──────────────────
store.set("stillform_prediction_errors", JSON.stringify({ entries: [
  { id: "p1", text: "braced for the review going badly", markedAt: Date.now() - DAY },
] }));
eq(getPendingProofMoment(), null, "same day as last shown → gated even though prediction moment is true");
m = getPendingProofMoment(Date.now() + DAY);
ok(m && m.id === "first-prediction", "next day → the prediction moment fires");
ok(m.text.includes("braced for the review"), "user's own words carried");
markProofMomentShown(m.id, Date.now() + DAY);

// ── quiet moment: retired trigger detected (with session evidence) ────────
store.set("stillform_v2_trigger_profile", JSON.stringify({ triggers: [
  { id: "t1", label: "deadline pressure", category: "work", encounterCount: 6, lastSeen: iso(45) },
] }));
store.set("stillform_v2_sessions", JSON.stringify(
  Array.from({ length: 14 }, (_, i) => ({ timestamp: iso(2 + i) }))
));
m = getPendingProofMoment(Date.now() + 2 * DAY);
ok(m && m.id === "first-quiet", "retired trigger → first-quiet moment");
eq(m.label, "deadline pressure", "quiet label carried");
markProofMomentShown(m.id, Date.now() + 2 * DAY);

// ── ordering: detectors run in fixed order (finding before prediction) ────
store.clear();
store.set("stillform_discovery_findings", JSON.stringify({ confirmed: [
  { id: "f1", kind: "sequence", label: "X tends to follow Y", confirmedAt: Date.now() },
], rejected: [] }));
store.set("stillform_prediction_errors", JSON.stringify({ entries: [
  { id: "p1", text: "braced", markedAt: Date.now() },
] }));
m = getPendingProofMoment();
eq(m.id, "first-finding", "finding outranks prediction in the fixed order");

// ── corrupt store → fail-closed, no throw ─────────────────────────────────
store.clear();
store.set("stillform_discovery_findings", "{{{corrupt");
eq(getPendingProofMoment(), null, "corrupt store → null, no throw");

console.log(`feltMoments.test.mjs — ${n}/${n} PASS`);
