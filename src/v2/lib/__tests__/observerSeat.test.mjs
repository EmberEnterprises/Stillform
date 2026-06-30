// observerSeat.test.mjs — run: node src/v2/lib/__tests__/observerSeat.test.mjs
import assert from "node:assert";

// localStorage mock (lib reads window.localStorage first, then globalThis)
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { observerSeatForms, recordObserverSeatUse, getObserverSeatCount, clearObserverSeat } =
  await import("../observerSeat.js");

const KEY = "stillform_v2_observer_seat";
let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };

// ── observerSeatForms ─────────────────────────────────────────────────────
// honest: nothing in → null
ok(observerSeatForms("") === null, "empty → null");
ok(observerSeatForms("   ") === null, "whitespace → null");
ok(observerSeatForms(null) === null, "non-string → null");
ok(observerSeatForms(42) === null, "number → null");

// a first-person thought → both readings
const f1 = observerSeatForms("I'm failing at this");
ok(f1 && typeof f1 === "object", "first-person → object");
ok(typeof f1.defused === "string" && f1.defused.length > 0, "defused present");
ok(f1.defused.startsWith("I'm having the thought that"), "defused is the observed-thought wrap");
ok(typeof f1.distanced === "string" && f1.distanced.length > 0, "distanced present for first-person");
ok(/\byou\b/i.test(f1.distanced), "distanced uses second person");

// a thought with no first-person marker → defused still works, distanced null
const f2 = observerSeatForms("this will never work out");
ok(f2 && typeof f2 === "object", "no-I thought → object (defusion is universal)");
ok(typeof f2.defused === "string" && f2.defused.length > 0, "defused present for no-I thought");
ok(f2.distanced === null, "distanced null when there's no I to step back from");

// too long to wrap (defuse caps at 600) AND no first-person → null
const long = "x".repeat(700);
ok(observerSeatForms(long) === null, "too-long no-I thought → null (nothing to hand back)");

// the forms never mutate the count (pure read)
store.clear();
observerSeatForms("I'm overwhelmed");
ok(getObserverSeatCount() === 0, "forms() does not record a use");

// ── count store ───────────────────────────────────────────────────────────
store.clear();
ok(getObserverSeatCount() === 0, "honest-empty count 0");

recordObserverSeatUse();
ok(getObserverSeatCount() === 1, "count increments to 1");
recordObserverSeatUse();
recordObserverSeatUse();
ok(getObserverSeatCount() === 3, "count increments to 3");

// lastAt stamped
const raw = JSON.parse(store.get(KEY));
ok(typeof raw.lastAt === "string" && raw.lastAt.length > 0, "lastAt stamped");

// clear resets
clearObserverSeat();
ok(getObserverSeatCount() === 0, "clear resets count");

// corrupt store → honest-empty, no throw
store.set(KEY, "{not json");
ok(getObserverSeatCount() === 0, "corrupt store → 0, no throw");
store.set(KEY, JSON.stringify({ count: -5 }));
ok(getObserverSeatCount() === 0, "negative count coerced to 0");
store.set(KEY, JSON.stringify({ count: 2.5 }));
ok(getObserverSeatCount() === 0, "non-integer count coerced to 0");

// survives no-storage (degrade gracefully): just assert no throw on read
ok(typeof getObserverSeatCount() === "number", "count is always a number");

console.log(`observerSeat.test.mjs — ${n}/${n} PASS`);
