// weatherProducer.test.mjs — run: node src/v2/lib/__tests__/weatherProducer.test.mjs
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

const { setWeatherConsent, getWeather } = await import("../ambientSignals.js");
const { wmoCondition, roundCoord, mapOpenMeteo, refreshWeather, maybeRefreshWeather } =
  await import("../weatherProducer.js");

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };
const eq = (a, b, m) => { assert.strictEqual(a, b, m); n++; };

// ── wmoCondition ──────────────────────────────────────────────────────────
eq(wmoCondition(0), "clear", "code 0 → clear");
eq(wmoCondition(3), "overcast", "code 3 → overcast");
eq(wmoCondition(45), "fog", "code 45 → fog");
eq(wmoCondition(63), "rain", "code 63 → rain");
eq(wmoCondition(81), "rain showers", "code 81 → rain showers");
eq(wmoCondition(200), null, "unknown code → null");
eq(wmoCondition("x"), null, "non-number → null");

// ── roundCoord (privacy: ~1km) ──────────────────────────────────────────────
eq(roundCoord(40.710335), 40.71, "coord rounded to 2 decimals");
eq(roundCoord(-73.99308), -73.99, "negative coord rounded");

// ── mapOpenMeteo (real-shaped payload) ─────────────────────────────────────
const live = {
  current: { temperature_2m: 33.0, surface_pressure: 1010.3, weather_code: 0 },
  daily: { daylight_duration: [54140.78] },
};
const m = mapOpenMeteo(live);
eq(m.tempC, 33.0, "temp mapped");
eq(m.pressureHpa, 1010.3, "pressure mapped");
eq(m.condition, "clear", "condition mapped from code");
eq(m.daylightHours, 15.0, "daylight seconds → hours (1dp)");
eq(mapOpenMeteo(null), null, "null json → null");
eq(mapOpenMeteo({}), null, "no current → null");
eq(mapOpenMeteo({ current: {} }), null, "empty current, no daily → null");

// ── refreshWeather: fail-closed control flow ───────────────────────────────
const goodPos = async () => ({ lat: 40.710335, lon: -73.99308 });
const goodFetch = async () => ({ ok: true, json: async () => live });

store.clear();
let r = await refreshWeather({ getPosition: goodPos, fetchImpl: goodFetch });
eq(r.ok, false, "no consent → not ok");
eq(r.reason, "no-consent", "reason no-consent");
ok(getWeather() === null, "no weather stored without consent");

setWeatherConsent(true);
r = await refreshWeather({ getPosition: goodPos, fetchImpl: goodFetch });
eq(r.ok, true, "consent + good position + good fetch → ok");
ok(getWeather() && getWeather().condition === "clear", "weather now stored + fresh");

// geolocation denied → fail-closed
store.clear(); setWeatherConsent(true);
r = await refreshWeather({ getPosition: async () => { throw new Error("denied"); }, fetchImpl: goodFetch });
eq(r.ok, false, "geo denied → not ok");
eq(r.reason, "no-location", "reason no-location");
ok(getWeather() === null, "no weather on geo denial");

// fetch non-ok → fail-closed
store.clear(); setWeatherConsent(true);
r = await refreshWeather({ getPosition: goodPos, fetchImpl: async () => ({ ok: false }) });
eq(r.ok, false, "fetch non-ok → not ok");
eq(r.reason, "fetch-failed", "reason fetch-failed");

// malformed json (throws) → network fail-closed
store.clear(); setWeatherConsent(true);
r = await refreshWeather({ getPosition: goodPos, fetchImpl: async () => ({ ok: true, json: async () => { throw new Error("bad"); } }) });
eq(r.ok, false, "malformed json → not ok");
eq(r.reason, "network", "reason network");

// usable-but-empty payload → unusable
store.clear(); setWeatherConsent(true);
r = await refreshWeather({ getPosition: goodPos, fetchImpl: async () => ({ ok: true, json: async () => ({ current: {} }) }) });
eq(r.reason, "unusable", "empty conditions → unusable");

// ── maybeRefreshWeather ────────────────────────────────────────────────────
store.clear();
r = await maybeRefreshWeather({ getPosition: goodPos, fetchImpl: goodFetch });
eq(r.reason, "no-consent", "maybe: skips without consent");

setWeatherConsent(true);
r = await maybeRefreshWeather({ getPosition: goodPos, fetchImpl: goodFetch });
eq(r.ok, true, "maybe: refreshes when consented + empty");
r = await maybeRefreshWeather({ getPosition: goodPos, fetchImpl: goodFetch });
eq(r.reason, "fresh", "maybe: skips when a fresh reading is already on hand");

console.log(`weatherProducer.test.mjs — ${n}/${n} PASS`);
