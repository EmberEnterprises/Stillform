// ambientSignals.test.mjs — run: node src/v2/lib/__tests__/ambientSignals.test.mjs
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
  getMoonPhase,
  getWeatherConsent, setWeatherConsent, setWeather, getWeather, weatherDescriptor,
  getAmbientContext, _config,
} = await import("../ambientSignals.js");

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };

// ── moon phase: deterministic + known dates ───────────────────────────────
ok(getMoonPhase(new Date("2000-01-06T18:14:00Z")).name === "new moon", "reference epoch → new moon");
ok(getMoonPhase(new Date("2000-01-21T04:40:00Z")).name === "full moon", "~14.8 days later → full moon");
const a = getMoonPhase(new Date("2026-07-01T12:00:00Z"));
const b = getMoonPhase(new Date("2026-07-01T12:00:00Z"));
ok(a.name === b.name && a.fraction === b.fraction, "same date → identical phase (deterministic)");
ok(MOONVALID(getMoonPhase().name), "current phase is one of the 8 names");
ok(getMoonPhase(new Date("2000-01-21T04:40:00Z")).illumination > 0.9, "full moon → high illumination");
function MOONVALID(name) {
  return ["new moon","waxing crescent","first quarter","waxing gibbous","full moon","waning gibbous","last quarter","waning crescent"].includes(name);
}

// ── weather: consent-gated ────────────────────────────────────────────────
store.clear();
ok(getWeatherConsent() === false, "weather consent defaults false");
ok(setWeather({ tempC: 20 }) === false, "weather write blocked without consent");
ok(getWeather() === null, "weather read null without consent");

setWeatherConsent(true);
setWeather({ tempC: -3, pressureHpa: 999, condition: "Overcast", daylightHours: 8 });
const w = getWeather();
ok(w && w.tempC === -3, "weather stored with consent");

// ── descriptor: neutral, notable-only ─────────────────────────────────────
ok(weatherDescriptor() === "a low-pressure, overcast, very cold, little daylight day", "descriptor lists notable features");
setWeather({ tempC: 21, pressureHpa: 1015, condition: "Clear", daylightHours: 14 });
ok(weatherDescriptor() === null, "mild clear day → no notable descriptor (null)");

// ── freshness: a stale reading is ignored ─────────────────────────────────
store.clear(); setWeatherConsent(true);
setWeather({ tempC: 30, pressureHpa: 1000, condition: "Rain", at: Date.now() - (_config.WEATHER_FRESH_MS + 60000) });
ok(getWeather() === null, "stale weather (> fresh window) → null");

// ── ambient context: moon always present, weather gated ───────────────────
store.clear();
let amb = getAmbientContext();
ok(MOONVALID(amb.moon), "ambient always includes a moon phase (no consent needed)");
ok(amb.weather === null, "ambient weather null without consent/data");

setWeatherConsent(true);
setWeather({ pressureHpa: 1000, condition: "Fog" });
amb = getAmbientContext();
ok(amb.weather === "a low-pressure, overcast day", "ambient weather present when consented + notable");
ok(MOONVALID(amb.moon), "moon still present alongside weather");

// ── revoke wipes weather ──────────────────────────────────────────────────
setWeatherConsent(false);
ok(store.has(_config.WEATHER_KEY) === false, "revoke wipes weather");
ok(getWeather() === null, "weather null after revoke");
ok(MOONVALID(getAmbientContext().moon), "moon unaffected by weather revoke");

console.log(`ambientSignals.test.mjs — ${n}/${n} PASS`);
