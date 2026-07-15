/**
 * ambientSignals.js — ambient context that quietly colors the read: weather and
 * moon phase. Fed to the AI (reframe) and the concierge (Today's Brief) as faint
 * background, NEVER surfaced to the user as an explanation of how they feel.
 *
 * MOON PHASE is computed from the date alone — no location, no consent, no API,
 * no data stored. Evidence for lunar effects on mood/sleep is weak and mixed, so
 * it is BACKGROUND ONLY: it may gently color the AI's tone, but it is never
 * named, surfaced, or attributed to the user, and it is deliberately NOT written
 * into the Science Sheet or any user-facing surface (Arlin's direction: don't
 * make the moon thing obvious). Atmosphere, not a claim.
 *
 * WEATHER is real context (barometric pressure, daylight, temperature extremes).
 * It needs the user's location, so it is consent-gated and producer-fed (a web
 * geolocation+API fetch, or a native pull, writes it here). Revoke wipes it.
 *
 * Fail-silent throughout.
 */

const WEATHER_CONSENT_KEY = "stillform_weather_consent";
const WEATHER_KEY = "stillform_weather";
const WEATHER_FRESH_MS = 4 * 60 * 60 * 1000; // a reading older than this is stale

// Reference new moon: 2000-01-06 18:14 UTC. Synodic month = 29.530588853 days.
const NEW_MOON_REF = Date.UTC(2000, 0, 6, 18, 14, 0);
const SYNODIC_MS = 29.530588853 * 24 * 60 * 60 * 1000;

function safeLocal() {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch { /* sandboxed */ }
  try {
    if (typeof localStorage !== "undefined") return localStorage;
  } catch { /* ignore */ }
  return null;
}

// ── moon phase (deterministic, no consent) ──────────────────────────────────

const MOON_NAMES = [
  "new moon", "waxing crescent", "first quarter", "waxing gibbous",
  "full moon", "waning gibbous", "last quarter", "waning crescent",
];

/**
 * getMoonPhase(date?) → { fraction (0..1, 0=new/0.5=full), name, illumination }.
 * Pure function of the date. Used ONLY as silent ambient context.
 */
export function getMoonPhase(date = new Date()) {
  const t = date instanceof Date ? date.getTime() : Date.parse(date);
  const ms = Number.isFinite(t) ? t : Date.now();
  let diff = (ms - NEW_MOON_REF) % SYNODIC_MS;
  if (diff < 0) diff += SYNODIC_MS;
  const fraction = diff / SYNODIC_MS;
  // 8 equal bins centered on new(0)/first-qtr(.25)/full(.5)/last-qtr(.75)
  const idx = Math.floor((fraction + 0.0625) * 8) % 8;
  const illumination = (1 - Math.cos(2 * Math.PI * fraction)) / 2;
  return { fraction, name: MOON_NAMES[idx], illumination };
}

// ── weather (consent-gated, producer-fed) ───────────────────────────────────

export function getWeatherConsent() {
  const ls = safeLocal();
  if (!ls) return false;
  try { return ls.getItem(WEATHER_CONSENT_KEY) === "yes"; } catch { return false; }
}

export function setWeatherConsent(granted) {
  const ls = safeLocal();
  if (!ls) return false;
  try {
    if (granted === true) { ls.setItem(WEATHER_CONSENT_KEY, "yes"); return true; }
    ls.removeItem(WEATHER_CONSENT_KEY);
    ls.removeItem(WEATHER_KEY); // revoke = forget
    return false;
  } catch { return false; }
}

/** A producer (geolocation+API or native) writes the current conditions here. */
export function setWeather({ tempC = null, pressureHpa = null, condition = null, nextRain = null, daylightHours = null, at = Date.now() } = {}) {
  if (!getWeatherConsent()) return false;
  const ls = safeLocal();
  if (!ls) return false;
  const ms = typeof at === "number" ? at : Date.parse(at);
  try {
    ls.setItem(WEATHER_KEY, JSON.stringify({
      tempC: typeof tempC === "number" ? tempC : null,
      pressureHpa: typeof pressureHpa === "number" ? pressureHpa : null,
      condition: typeof condition === "string" ? condition.slice(0, 40) : null,
      daylightHours: typeof daylightHours === "number" ? daylightHours : null,
      // P1: next rain window { at:ms, probability } — pure logistics, null when dry.
      nextRain: (nextRain && typeof nextRain.at === "number") ? { at: nextRain.at, probability: typeof nextRain.probability === "number" ? nextRain.probability : null } : null,
      at: Number.isFinite(ms) ? ms : Date.now(),
    }));
    return true;
  } catch { return false; }
}

/** Current weather if consented and fresh; else null. */
export function getWeather() {
  if (!getWeatherConsent()) return null;
  const ls = safeLocal();
  if (!ls) return null;
  try {
    const raw = ls.getItem(WEATHER_KEY);
    const w = raw ? JSON.parse(raw) : null;
    if (!w || typeof w.at !== "number") return null;
    if (Date.now() - w.at > WEATHER_FRESH_MS) return null; // stale
    return w;
  } catch { return null; }
}

/** Neutral one-line weather descriptor for context, or null if nothing notable. */
export function weatherDescriptor(w = getWeather()) {
  if (!w) return null;
  const notes = [];
  if (typeof w.pressureHpa === "number" && w.pressureHpa < 1005) notes.push("low-pressure");
  if (typeof w.condition === "string" && /cloud|overcast|rain|grey|gray|drizzle|fog/i.test(w.condition)) notes.push("overcast");
  if (typeof w.tempC === "number" && w.tempC >= 32) notes.push("very warm");
  else if (typeof w.tempC === "number" && w.tempC <= 0) notes.push("very cold");
  if (typeof w.daylightHours === "number" && w.daylightHours < 9) notes.push("little daylight");
  return notes.length ? `a ${notes.join(", ")} day` : null;
}

// ── the combined ambient read for the AI / concierge ────────────────────────

/**
 * getAmbientContext() → { weather: string|null, moon: string }.
 * Moon is always present (public, computed); weather only when consented + fresh.
 * The CALLER (reframe.js / brief) applies the discretion rule: weather may gently
 * inform tone; the moon is background only — never named or attributed.
 */
export function getAmbientContext(date = new Date()) {
  return {
    weather: weatherDescriptor(),
    moon: getMoonPhase(date).name,
  };
}

export const _config = { WEATHER_CONSENT_KEY, WEATHER_KEY, WEATHER_FRESH_MS };
