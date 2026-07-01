/**
 * weatherProducer.js — makes weather LIVE on the web. Reads the user's coarse
 * location (opt-in, off by default) and the day's conditions from Open-Meteo
 * (free, no API key), then writes them into the ambientSignals store so the read
 * and the brief can quietly account for a heavy day.
 *
 * PRIVACY:
 * - Off by default; only runs when the user has explicitly turned weather on
 *   (getWeatherConsent). Revoking wipes stored conditions.
 * - Location is used transiently for the fetch and NEVER stored. Coordinates are
 *   rounded to ~1km before they leave the device — city-scale is all weather needs.
 * - Only derived conditions are kept (temp / pressure / a one-word sky / daylight),
 *   never the coordinates.
 *
 * Fail-CLOSED: any permission denial, network error, or malformed response leaves
 * weather null. Nothing is ever fabricated.
 *
 * Dependencies (getPosition, fetchImpl) are injectable so the mapping and control
 * flow are testable without a browser.
 */

import { getWeatherConsent, setWeather, getWeather } from "./ambientSignals.js";

const OPEN_METEO = "https://api.open-meteo.com/v1/forecast";
const GEO_TIMEOUT_MS = 8000;
const FETCH_TIMEOUT_MS = 8000;

// WMO weather codes → a neutral one-word sky. Only words that carry real signal
// for weatherDescriptor's "overcast/rain/fog" test need to be exact; the rest are
// plain description. Unmapped → null (no false condition).
export function wmoCondition(code) {
  if (typeof code !== "number") return null;
  if (code === 0) return "clear";
  if (code === 1) return "mainly clear";
  if (code === 2) return "partly cloudy";
  if (code === 3) return "overcast";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 57) return "drizzle";
  if (code >= 61 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain showers";
  if (code === 85 || code === 86) return "snow showers";
  if (code >= 95 && code <= 99) return "thunderstorm";
  return null;
}

/** Round to ~2 decimals (~1km) so only coarse location ever leaves the device. */
export function roundCoord(n) {
  return Math.round(n * 100) / 100;
}

/** Pure: Open-Meteo JSON → the setWeather shape, or null if unusable. */
export function mapOpenMeteo(json) {
  if (!json || typeof json !== "object") return null;
  const cur = json.current;
  if (!cur || typeof cur !== "object") return null;
  const tempC = typeof cur.temperature_2m === "number" ? cur.temperature_2m : null;
  const pressureHpa = typeof cur.surface_pressure === "number" ? cur.surface_pressure : null;
  const condition = wmoCondition(cur.weather_code);
  let daylightHours = null;
  const dd = json.daily && Array.isArray(json.daily.daylight_duration) ? json.daily.daylight_duration[0] : null;
  if (typeof dd === "number" && Number.isFinite(dd)) daylightHours = Math.round((dd / 3600) * 10) / 10;
  if (tempC === null && pressureHpa === null && condition === null && daylightHours === null) return null;
  return { tempC, pressureHpa, condition, daylightHours };
}

// Default browser geolocation, promise-wrapped with a timeout. Coarse accuracy.
function defaultGetPosition() {
  return new Promise((resolve, reject) => {
    try {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        reject(new Error("no-geolocation"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => reject(new Error("geo-denied")),
        { enableHighAccuracy: false, timeout: GEO_TIMEOUT_MS, maximumAge: 30 * 60 * 1000 }
      );
    } catch {
      reject(new Error("geo-error"));
    }
  });
}

function defaultFetch(url) {
  const f = typeof fetch !== "undefined" ? fetch : null;
  if (!f) return Promise.reject(new Error("no-fetch"));
  const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
  const t = ctrl ? setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS) : null;
  return f(url, ctrl ? { signal: ctrl.signal } : undefined).finally(() => { if (t) clearTimeout(t); });
}

/**
 * refreshWeather — the full opt-in flow: confirm consent → coarse location →
 * Open-Meteo → store. Returns { ok, reason }. Fail-closed on every path.
 */
export async function refreshWeather({ getPosition = defaultGetPosition, fetchImpl = defaultFetch } = {}) {
  if (!getWeatherConsent()) return { ok: false, reason: "no-consent" };
  let pos;
  try {
    pos = await getPosition();
  } catch {
    return { ok: false, reason: "no-location" };
  }
  if (!pos || typeof pos.lat !== "number" || typeof pos.lon !== "number") {
    return { ok: false, reason: "no-location" };
  }
  const lat = roundCoord(pos.lat);
  const lon = roundCoord(pos.lon);
  const url =
    `${OPEN_METEO}?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,surface_pressure,weather_code&daily=daylight_duration` +
    `&timezone=auto&forecast_days=1`;
  let json;
  try {
    const res = await fetchImpl(url);
    if (!res || !res.ok) return { ok: false, reason: "fetch-failed" };
    json = await res.json();
  } catch {
    return { ok: false, reason: "network" };
  }
  const mapped = mapOpenMeteo(json);
  if (!mapped) return { ok: false, reason: "unusable" };
  const wrote = setWeather(mapped);
  return wrote ? { ok: true } : { ok: false, reason: "store-failed" };
}

/** Refresh only when it's worth it: consented and no fresh reading on hand. */
export async function maybeRefreshWeather(deps = {}) {
  if (!getWeatherConsent()) return { ok: false, reason: "no-consent" };
  if (getWeather()) return { ok: false, reason: "fresh" }; // already have a fresh one
  return refreshWeather(deps);
}
