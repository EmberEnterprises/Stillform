/**
 * calendarScreenshotApi.js — client for netlify/functions/calendar-screenshot-extract.
 *
 * For people who can't export a .ics (locked-down corporate calendars): send a
 * screenshot, GPT-4o vision reads the visible events, we get back {title, start,
 * end} and store them in the same consent-gated calendar seam. Only titles and
 * times come back; the image is NOT stored server-side.
 *
 * Fails CLOSED: any non-OK response, malformed payload, or network error yields
 * an empty event list — never a fabricated event.
 *
 * ⚠️ PRIVACY: the screenshot itself is sent to OpenAI to be read. It may show
 * attendees or notes on screen even though we only keep titles/times. The UI
 * must say so plainly before the user uploads.
 */
import { fnUrl } from "./apiBase.js";

const CALENDAR_EXTRACT_URL = fnUrl("calendar-screenshot-extract");

export async function extractCalendarFromScreenshot({ imageBase64, imageMime = "image/png", referenceDate = null, tzOffsetMinutes = null } = {}) {
  const data = String(imageBase64 || "").trim();
  if (!data) return { events: [], error: "No image." };

  const body = {
    image_data: data,
    image_mime: imageMime,
    reference_date: referenceDate || new Date().toISOString().slice(0, 10),
    tz_offset_minutes: typeof tzOffsetMinutes === "number" ? tzOffsetMinutes : -new Date().getTimezoneOffset(),
  };

  let response;
  try {
    response = await fetch(CALENDAR_EXTRACT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return { events: [], error: "Couldn't reach the reader." };
  }

  if (!response.ok) {
    const msg = response.status === 429
      ? "Too many imports right now — try again in a bit."
      : response.status === 413
        ? "That image is too large."
        : "Couldn't read that screenshot.";
    return { events: [], error: msg };
  }

  let json;
  try {
    json = await response.json();
  } catch {
    return { events: [], error: "Couldn't read that screenshot." };
  }

  const raw = Array.isArray(json && json.events) ? json.events : [];
  const events = raw
    .map((e) => ({
      title: e && typeof e.title === "string" ? e.title.trim().slice(0, 80) : "",
      start: e && (typeof e.start === "string" || typeof e.start === "number") ? e.start : null,
      end: e && (typeof e.end === "string" || typeof e.end === "number") ? e.end : null,
    }))
    .filter((e) => e.title && e.start);

  return { events, error: null };
}
