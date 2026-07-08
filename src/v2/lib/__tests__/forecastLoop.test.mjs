// forecastLoop.test.mjs — ARLIN'S forecast-and-verify contract, guardrails as tests.
import assert from "node:assert";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => void store.set(k, String(v)),
  removeItem: (k) => void store.delete(k),
  clear: () => store.clear(),
};
const reset = () => store.clear();
globalThis.window = { localStorage: globalThis.localStorage }; // signalLog reads window.localStorage

const NOW = Date.parse("2026-07-08T12:00:00.000Z");
const HOUR = 3600_000;
const DAY = 24 * HOUR;

// Seed a CONFIRMED sequence finding (real store shape from discoveryFindings)
const seedFinding = () =>
  store.set(
    "stillform_discovery_findings",
    JSON.stringify({
      confirmed: [{
        id: "seq:trigger:deadline pressure>chip:drained",
        kind: "sequence",
        label: "\u201cdrained\u201d tends to follow \u201cdeadline pressure\u201d by about 1 day.",
        confirmedAt: NOW - 10 * DAY,
      }],
      rejected: [],
    })
  );

// Seed signal-log entries (real shape: chip/triggers/loggedAt)
const seedSignals = (entries) =>
  store.set("stillform_signal_log", JSON.stringify({ entries }));

const fl = await import("../forecastLoop.js");
// sanity: confirm the findings store key matches what discoveryFindings uses
const df = await import("../discoveryFindings.js");

let passed = 0;
const ok = (name, fn) => { fn(); passed++; console.log("PASS " + name); };

ok("SANITY: seeded finding is readable via the real discoveryFindings store", () => {
  reset(); seedFinding();
  assert.strictEqual(df.getConfirmedFindings().length, 1);
});

ok("honest-empty: no confirmed findings -> no forecast (guardrail 1: only user-confirmed math speaks)", () => {
  reset();
  seedSignals([{ chip: "drained", triggers: ["deadline pressure"], loggedAt: new Date(NOW - HOUR).toISOString() }]);
  assert.strictEqual(fl.getActiveForecast(NOW), null);
});

ok("no recent trigger token -> silent (the trigger isn't around)", () => {
  reset(); seedFinding();
  seedSignals([{ chip: "calm", triggers: ["deadline pressure"], loggedAt: new Date(NOW - 5 * DAY).toISOString() }]);
  assert.strictEqual(fl.getActiveForecast(NOW), null);
});

ok("(a) FORECAST fires when the confirmed trigger recurs; the line IS a question (guardrail 2)", () => {
  reset(); seedFinding();
  seedSignals([{ chip: "focused", triggers: ["deadline pressure"], loggedAt: new Date(NOW - 6 * HOUR).toISOString() }]);
  const f = fl.getActiveForecast(NOW);
  assert.ok(f);
  assert.strictEqual(f.trigger, "deadline pressure");
  assert.strictEqual(f.follows, "drained");
  assert.ok(/\?\s*$/.test(f.question), "forecast must end as a question, never a verdict");
});

ok("refire window: one forecast per finding per 3 days", () => {
  reset(); seedFinding();
  seedSignals([{ chip: "focused", triggers: ["deadline pressure"], loggedAt: new Date(NOW - 6 * HOUR).toISOString() }]);
  const f = fl.getActiveForecast(NOW);
  fl.recordForecastShown(f, NOW);
  assert.strictEqual(fl.getActiveForecast(NOW + HOUR), null);
  // At +4d the old sighting has aged out — silence is CORRECT (never nag on
  // stale data). A FRESH sighting past the refire window fires again.
  assert.strictEqual(fl.getActiveForecast(NOW + 4 * DAY), null);
  seedSignals([{ chip: "focused", triggers: ["deadline pressure"], loggedAt: new Date(NOW + 4 * DAY - HOUR).toISOString() }]);
  assert.ok(fl.getActiveForecast(NOW + 4 * DAY));
});

ok("(c) FOLLOW UP arrives after 12h, phrased as a question", () => {
  reset(); seedFinding();
  seedSignals([{ chip: "focused", triggers: ["deadline pressure"], loggedAt: new Date(NOW - 6 * HOUR).toISOString() }]);
  const f = fl.getActiveForecast(NOW);
  fl.recordForecastShown(f, NOW);
  assert.strictEqual(fl.getPendingFollowUp(NOW + HOUR), null); // too soon
  const fu = fl.getPendingFollowUp(NOW + 13 * HOUR);
  assert.ok(fu);
  assert.ok(/\?\s*$/.test(fu.question));
});

ok("(d) BREAK: 'different' + the followed emotion ABSENT from the log -> possible break, as a question", () => {
  reset(); seedFinding();
  seedSignals([{ chip: "focused", triggers: ["deadline pressure"], loggedAt: new Date(NOW - 6 * HOUR).toISOString() }]);
  const f = fl.getActiveForecast(NOW);
  fl.recordForecastShown(f, NOW);
  const fu = fl.getPendingFollowUp(NOW + 13 * HOUR);
  const out = fl.recordFollowUpOutcome(fu.id, "different", NOW + 13 * HOUR);
  assert.strictEqual(out.closed, true);
  assert.strictEqual(out.possibleBreak, true);
  assert.ok(/\?\s*$/.test(out.line), "break reflection must be a question the user owns");
  assert.strictEqual(fl.getBreakMoments().length, 1);
});

ok("(d) NO false break: user says 'different' but the record shows the emotion DID follow -> no break claim (double gate)", () => {
  reset(); seedFinding();
  seedSignals([
    { chip: "focused", triggers: ["deadline pressure"], loggedAt: new Date(NOW - 6 * HOUR).toISOString() },
  ]);
  const f = fl.getActiveForecast(NOW);
  fl.recordForecastShown(f, NOW);
  // after the forecast, "drained" appears in their own log
  seedSignals([
    { chip: "focused", triggers: ["deadline pressure"], loggedAt: new Date(NOW - 6 * HOUR).toISOString() },
    { chip: "drained", triggers: [], loggedAt: new Date(NOW + 5 * HOUR).toISOString() },
  ]);
  const fu = fl.getPendingFollowUp(NOW + 13 * HOUR);
  const out = fl.recordFollowUpOutcome(fu.id, "different", NOW + 13 * HOUR);
  assert.strictEqual(out.possibleBreak, false, "their record contradicts — never fabricate a break");
  assert.strictEqual(out.line, null);
});

ok("(d) 'same' closes the loop quietly — no break, no line", () => {
  reset(); seedFinding();
  seedSignals([{ chip: "focused", triggers: ["deadline pressure"], loggedAt: new Date(NOW - 6 * HOUR).toISOString() }]);
  const f = fl.getActiveForecast(NOW);
  fl.recordForecastShown(f, NOW);
  const fu = fl.getPendingFollowUp(NOW + 13 * HOUR);
  const out = fl.recordFollowUpOutcome(fu.id, "same", NOW + 13 * HOUR);
  assert.strictEqual(out.closed, true);
  assert.strictEqual(out.possibleBreak, false);
});

ok("stale open forecasts (4+ days) are dropped silently — never interrogate about last week", () => {
  reset(); seedFinding();
  seedSignals([{ chip: "focused", triggers: ["deadline pressure"], loggedAt: new Date(NOW - 6 * HOUR).toISOString() }]);
  const f = fl.getActiveForecast(NOW);
  fl.recordForecastShown(f, NOW);
  assert.strictEqual(fl.getPendingFollowUp(NOW + 5 * DAY), null);
});

console.log(`forecastLoop: ${passed}/10 pass`);
