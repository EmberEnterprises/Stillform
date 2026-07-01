// hardwareSignals.test.mjs — run: node src/v2/lib/__tests__/hardwareSignals.test.mjs
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
  getHealthConsent, setHealthConsent,
  setSleepReading, setHrvReading, getSleepReading, getHrvReading,
  getHardwareBioFilter, getCombinedBioFilter, _config,
} = await import("../hardwareSignals.js");

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };

const today = ((d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`)(new Date());
const SIG_KEY = "stillform_signal_log";
const seedStateCheck = (bodyTokens) =>
  store.set(SIG_KEY, JSON.stringify({ entries: [{ id: "s1", body: bodyTokens, dateKey: today }] }));

// ── consent gates the store ───────────────────────────────────────────────
store.clear();
ok(getHealthConsent() === false, "health consent defaults false");
ok(setSleepReading({ hours: 5 }) === false, "sleep write blocked without consent");
ok(getSleepReading() === null, "sleep read empty without consent");

setHealthConsent(true);
ok(getHealthConsent() === true, "consent granted");

// ── sleep reading + derivation ────────────────────────────────────────────
setSleepReading({ hours: 5 });
ok(getSleepReading().hours === 5, "sleep reading stored");
ok(getHardwareBioFilter() === "sleep", "short night (<6h) → 'sleep' token");

setSleepReading({ hours: 8 });
ok(getHardwareBioFilter() === null, "full night (8h) → no token");

// ── HRV: only belowBaseline counts (never guessed from raw value) ─────────
setHrvReading({ value: 42, belowBaseline: false });
ok(getHardwareBioFilter() === null, "HRV present but not below baseline → no token");
setHrvReading({ value: 42, belowBaseline: true });
ok(getHardwareBioFilter() === "depleted", "HRV below baseline → 'depleted' token");

// both
setSleepReading({ hours: 4 });
ok(getHardwareBioFilter() === "sleep, depleted", "short sleep + low HRV → both tokens");

// ── same-day only: a stale reading is ignored ─────────────────────────────
const yesterdayMs = Date.now() - 36 * 60 * 60 * 1000;
store.clear(); setHealthConsent(true);
setSleepReading({ hours: 4, at: yesterdayMs });
ok(getSleepReading() === null, "yesterday's sleep is stale → null");
ok(getHardwareBioFilter() === null, "stale reading yields no token");

// ── combined with StateCheck, de-duplicated ───────────────────────────────
store.clear(); setHealthConsent(true);
seedStateCheck(["pain"]);                 // StateCheck → "pain"
setSleepReading({ hours: 4 });            // hardware → "sleep"
ok(getCombinedBioFilter() === "pain, sleep", "StateCheck + hardware merged");

seedStateCheck(["sleep-deprived"]);       // StateCheck → "sleep" (dup with hardware)
ok(getCombinedBioFilter() === "sleep", "overlapping token de-duplicated");

// StateCheck only (no hardware) still works
store.clear();
seedStateCheck(["pain"]);
ok(getCombinedBioFilter() === "pain", "StateCheck alone → its tokens (health empty)");

// nothing anywhere → null
store.clear();
ok(getCombinedBioFilter() === null, "no signals anywhere → null");

// ── revoke wipes health readings ──────────────────────────────────────────
setHealthConsent(true);
setSleepReading({ hours: 4 });
ok(getSleepReading() !== null, "reading present before revoke");
setHealthConsent(false);
ok(store.has(_config.SIGNALS_KEY) === false, "revoke wipes health signals");
ok(getSleepReading() === null, "read empty after revoke");

console.log(`hardwareSignals.test.mjs — ${n}/${n} PASS`);
