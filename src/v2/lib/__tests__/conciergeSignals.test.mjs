// conciergeSignals.test.mjs — the proactive concierge's deterministic contract.
// Doctrine (Arlin 2026-07-08): speaks only when it genuinely has something
// (trigger-match or user-marked — NEVER every event), dismissal remembered
// per event, volume adapts DOWN on depleted/heavy days, never escalates.
import assert from "node:assert";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => void store.set(k, String(v)),
  removeItem: (k) => void store.delete(k),
  clear: () => store.clear(),
};
const reset = () => store.clear();

const NOW = Date.parse("2026-07-08T12:00:00.000Z");
const iso = (minFromNow) => new Date(NOW + minFromNow * 60000).toISOString();

const seedConsent = () => store.set("stillform_calendar_consent", "yes"); // real format: literal "yes"
const seedEvents = (evs) => store.set("stillform_calendar_events", JSON.stringify(evs));
const seedTriggers = (labels) =>
  store.set(
    "stillform_v2_trigger_profile",
    JSON.stringify({ triggers: labels.map((l, i) => ({ id: `t${i}`, label: l })), updatedAt: iso(0) })
  );

const cs = await import("../conciergeSignals.js");
let passed = 0;
const ok = (name, fn) => { fn(); passed++; console.log("PASS " + name); };

ok("honest-empty: no consent / no events -> null", () => {
  reset();
  assert.strictEqual(cs.getUpcomingEventOffer(NOW), null);
});

ok("an ordinary event is NEVER spoken about (not a task manager)", () => {
  reset(); seedConsent();
  seedEvents([{ title: "Lunch with Sam", start: iso(45) }]);
  seedTriggers(["performance review"]);
  assert.strictEqual(cs.getUpcomingEventOffer(NOW), null);
});

ok("a trigger-matched event inside the window is offered", () => {
  reset(); seedConsent();
  seedEvents([{ title: "Q3 performance review with director", start: iso(45) }]);
  seedTriggers(["performance review"]);
  const offer = cs.getUpcomingEventOffer(NOW);
  assert.ok(offer);
  assert.strictEqual(offer.matchedTrigger, "performance review");
  assert.strictEqual(offer.minutesUntil, 45);
});

ok("a user-marked event is offered without any trigger match", () => {
  reset(); seedConsent();
  seedEvents([{ title: "Call with landlord", start: iso(30), userMarked: true }]);
  seedTriggers([]);
  const offer = cs.getUpcomingEventOffer(NOW);
  assert.ok(offer);
  assert.strictEqual(offer.matchedTrigger, null);
});

ok("outside the speak-ahead window -> silent (too far / long past)", () => {
  reset(); seedConsent();
  seedTriggers(["review"]);
  seedEvents([{ title: "review far", start: iso(180) }]);
  assert.strictEqual(cs.getUpcomingEventOffer(NOW), null);
  seedEvents([{ title: "review long past", start: iso(-30) }]);
  assert.strictEqual(cs.getUpcomingEventOffer(NOW), null);
});

ok("just-started events (within 10 min) still speak — they may be late", () => {
  reset(); seedConsent();
  seedTriggers(["review"]);
  seedEvents([{ title: "review", start: iso(-5) }]);
  assert.ok(cs.getUpcomingEventOffer(NOW));
});

ok("dismissal is remembered per event; other events still speak", () => {
  reset(); seedConsent();
  seedTriggers(["review", "standup"]);
  seedEvents([
    { title: "review", start: iso(20) },
    { title: "standup", start: iso(60) },
  ]);
  const first = cs.getUpcomingEventOffer(NOW);
  assert.strictEqual(first.title, "review");
  cs.dismissEventOffer(first.key);
  const second = cs.getUpcomingEventOffer(NOW);
  assert.ok(second);
  assert.strictEqual(second.title, "standup");
});

ok("volume: standard on a clear light day", () => {
  reset(); seedConsent();
  assert.strictEqual(cs.getConciergeVolume(NOW), "standard");
});

ok("volume: soft on a heavy day (4+ events)", () => {
  reset(); seedConsent();
  seedEvents([0, 1, 2, 3].map((i) => ({ title: `m${i}`, start: iso(60 + i * 120), durationMin: 30 })));
  assert.strictEqual(cs.getConciergeVolume(NOW), "soft");
});

console.log(`conciergeSignals: ${passed}/9 pass`);
