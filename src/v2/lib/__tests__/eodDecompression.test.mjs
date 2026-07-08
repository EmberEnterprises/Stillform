// eodDecompression.test.mjs — the evening set-it-down contract.
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

const NOW = Date.parse("2026-07-08T20:00:00.000Z"); // evening
const iso = (minFromNow) => new Date(NOW + minFromNow * 60000).toISOString();
const seedConsent = () => store.set("stillform_calendar_consent", "yes");
const seedEvents = (evs) => store.set("stillform_calendar_events", JSON.stringify(evs));
const seedTriggers = (labels) =>
  store.set("stillform_v2_trigger_profile",
    JSON.stringify({ triggers: labels.map((l, i) => ({ id: `t${i}`, label: l })), updatedAt: iso(0) }));

const ed = await import("../eodDecompression.js");
let passed = 0;
const ok = (name, fn) => { fn(); passed++; console.log("PASS " + name); };

ok("honest-empty: no events -> null", () => {
  reset(); seedConsent();
  assert.strictEqual(ed.getDecompressionCandidate(NOW), null);
});

ok("only ENDED events decompress — a future event never does", () => {
  reset(); seedConsent();
  seedEvents([{ title: "late planning", start: iso(60), durationMin: 60 }]);
  assert.strictEqual(ed.getDecompressionCandidate(NOW), null);
});

ok("heaviest by duration when nothing is trigger-matched", () => {
  reset(); seedConsent();
  seedEvents([
    { title: "standup", start: iso(-600), durationMin: 15 },
    { title: "quarterly planning", start: iso(-480), durationMin: 120 },
  ]);
  const c = ed.getDecompressionCandidate(NOW);
  assert.strictEqual(c.title, "quarterly planning");
  assert.ok(/\?\s*$/.test(c.line), "the offer is a question");
});

ok("a trigger-matched event outranks a longer plain one (their record decides weight)", () => {
  reset(); seedConsent();
  seedTriggers(["performance review"]);
  seedEvents([
    { title: "quarterly planning", start: iso(-480), durationMin: 180 },
    { title: "performance review", start: iso(-300), durationMin: 30 },
  ]);
  const c = ed.getDecompressionCandidate(NOW);
  assert.strictEqual(c.title, "performance review");
  assert.strictEqual(c.matchedTrigger, "performance review");
});

ok("dismissal is day-keyed — quiet for the rest of the day", () => {
  reset(); seedConsent();
  seedEvents([{ title: "review", start: iso(-300), durationMin: 60 }]);
  assert.ok(ed.getDecompressionCandidate(NOW));
  ed.dismissDecompression(NOW);
  assert.strictEqual(ed.getDecompressionCandidate(NOW), null);
  // next day speaks again (a new day's own events would seed it)
  const TOMORROW = NOW + 24 * 3600_000;
  seedEvents([{ title: "review", start: new Date(TOMORROW - 3600_000).toISOString(), durationMin: 60 }]);
  assert.ok(ed.getDecompressionCandidate(TOMORROW));
});

console.log(`eodDecompression: ${passed}/5 pass`);
