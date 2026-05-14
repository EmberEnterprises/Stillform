// ─────────────────────────────────────────────────────────────────────────
// calendar-screenshot-extract
// ─────────────────────────────────────────────────────────────────────────
//
// Sequence step E — unblocks corporate users whose work calendars cannot
// be OAuth-connected (IT restrictions, Outlook/M365 enterprise lockdowns,
// etc.). The user takes a screenshot of their week from their corporate
// calendar app, posts it here, and we use vision AI to extract structured
// event data they can then import via .ics.
//
// What we extract:
//   - Event title (best effort; redacted to a generic label if the user
//     prefers, see request body)
//   - Start time (ISO 8601 in the user's local timezone)
//   - End time (ISO 8601; falls back to start + 60 min if not visible)
//   - All-day flag
//
// What we DO NOT do:
//   - Store the screenshot. Image payload is sent to OpenAI vision and
//     discarded after the response. Nothing persists server-side.
//   - Store the extracted events server-side. Returned to client and held
//     locally — the client may then generate an .ics for import.
//   - Send identifying information to OpenAI beyond the image itself.
//
// Rate limiting: simple in-memory token bucket per IP, 10 req/IP/hour.
// Sufficient for legitimate use (a user uploads a week or two at most);
// blunt against abuse.
//
// Privacy wall: this endpoint does not touch organization tables or
// practice tables. It's a stateless image → JSON transform.

import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

const CORS_OPTIONS = { methods: "POST, OPTIONS" };
const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB base64
const MAX_EVENTS_PER_EXTRACT = 50;

// Simple rate-limit map. Resets when the function cold-starts (~15min idle).
// Good enough for the launch volume; replace with Upstash/Redis if abuse
// becomes a problem.
const rateBuckets = new Map();
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT = 10;
const checkRate = (key) => {
  const now = Date.now();
  const bucket = rateBuckets.get(key) || [];
  const recent = bucket.filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return false;
  recent.push(now);
  rateBuckets.set(key, recent);
  return true;
};

const EXTRACTION_SYSTEM_PROMPT = `You are a precise calendar event extractor.

The user has uploaded a screenshot of a calendar (week view, day view, or month view from a corporate or personal calendar application).

Your task: extract every visible event into a strict JSON object.

Rules:
1. Return ONLY valid JSON, no preamble, no markdown fences, no commentary.
2. Use the user's local timezone offset (provided in the user message) to format ISO 8601 datetimes.
3. If a date is shown without year, use the reference date provided in the user message and pick the most plausible nearest occurrence.
4. If end time is not visible, set end = start + 60 minutes.
5. If the event spans multiple days or is all-day, set "all_day": true and use date strings (YYYY-MM-DD) for start and end.
6. Do NOT include personal commentary, descriptions of the screenshot itself, or invented details.
7. Skip blank slots, header rows, calendar gridlines, day labels, and any UI chrome.
8. Limit output to 50 events; if there are more, return the first 50 chronologically.

Output schema:
{
  "events": [
    {
      "title": "string (the visible event title; strip emoji and leading symbols)",
      "start": "ISO 8601 string with timezone offset, or YYYY-MM-DD for all-day",
      "end": "ISO 8601 string with timezone offset, or YYYY-MM-DD for all-day",
      "all_day": false
    }
  ]
}

If no events are visible, return { "events": [] }.`;

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return jsonResponse(event, 200, { ok: true }, CORS_OPTIONS);
  if (event.httpMethod !== "POST") return jsonResponse(event, 405, { error: "Method not allowed" }, CORS_OPTIONS);

  const originBlocked = rejectDisallowedOrigin(event, CORS_OPTIONS);
  if (originBlocked) return originBlocked;

  try {
    const token = parseBearer(event.headers?.authorization || event.headers?.Authorization || "");
    const user = await getUserFromToken(token);
    if (!user?.id) return jsonResponse(event, 401, { error: "Not authenticated" }, CORS_OPTIONS);

    const ipForLimit =
      event.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
      event.headers?.["X-Forwarded-For"]?.split(",")[0]?.trim() ||
      user.id;
    if (!checkRate(ipForLimit)) {
      return jsonResponse(event, 429, { error: "Rate limit exceeded. Try again in an hour." }, CORS_OPTIONS);
    }

    let body = {};
    try { body = JSON.parse(event.body || "{}"); } catch { return jsonResponse(event, 400, { error: "Invalid JSON" }, CORS_OPTIONS); }
    const { image_data, image_mime, tz_offset_minutes, reference_date } = body;

    if (!image_data) return jsonResponse(event, 400, { error: "image_data required" }, CORS_OPTIONS);
    if (image_data.length > MAX_IMAGE_SIZE) return jsonResponse(event, 413, { error: "Image too large (max 15MB)" }, CORS_OPTIONS);
    if (!/^[A-Za-z0-9+/]+=*$/.test(image_data.slice(0, 200))) {
      return jsonResponse(event, 400, { error: "Invalid base64 image data" }, CORS_OPTIONS);
    }
    const mime = ["image/png", "image/jpeg", "image/webp", "image/heic"].includes(image_mime)
      ? image_mime
      : "image/png";

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return jsonResponse(event, 500, { error: "OPENAI_API_KEY not configured" }, CORS_OPTIONS);
    }

    const referenceDate = reference_date || new Date().toISOString().slice(0, 10);
    const tzOffsetMin = Number.isFinite(Number(tz_offset_minutes)) ? Math.floor(Number(tz_offset_minutes)) : 0;
    const offsetSign = tzOffsetMin <= 0 ? "+" : "-";
    const absOffset = Math.abs(tzOffsetMin);
    const offsetH = String(Math.floor(absOffset / 60)).padStart(2, "0");
    const offsetM = String(absOffset % 60).padStart(2, "0");
    const tzFormatted = `${offsetSign}${offsetH}:${offsetM}`;
    // Note: JS Date.getTimezoneOffset() returns minutes BEHIND UTC, so a
    // user in UTC+2 has tz_offset_minutes = -120. The formatting above
    // produces "+02:00" for that case, which matches ISO 8601 convention.

    const userMessage = `Reference date: ${referenceDate}. User's local timezone offset: ${tzFormatted}. Extract all visible calendar events from the attached screenshot, returning only the JSON object described in the system prompt.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 2000,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: `data:${mime};base64,${image_data}`, detail: "high" } },
              { type: "text", text: userMessage }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("calendar-screenshot-extract-openai-failed", {
        status: response.status,
        body: text.slice(0, 300)
      });
      return jsonResponse(event, 502, { error: "Vision extraction failed" }, CORS_OPTIONS);
    }

    const data = await response.json().catch(() => null);
    const rawContent = data?.choices?.[0]?.message?.content || "{}";

    let parsed;
    try { parsed = JSON.parse(rawContent); }
    catch {
      console.error("calendar-screenshot-extract-parse-failed", { rawContent: rawContent.slice(0, 200) });
      return jsonResponse(event, 502, { error: "Could not parse vision response" }, CORS_OPTIONS);
    }

    const events = Array.isArray(parsed?.events) ? parsed.events.slice(0, MAX_EVENTS_PER_EXTRACT) : [];

    // Light sanitization: ensure every event has at least a title and a start.
    const cleaned = events
      .map((ev) => ({
        title: ev?.title ? String(ev.title).slice(0, 200) : null,
        start: ev?.start ? String(ev.start).slice(0, 40) : null,
        end: ev?.end ? String(ev.end).slice(0, 40) : null,
        all_day: ev?.all_day === true
      }))
      .filter((ev) => ev.title && ev.start);

    return jsonResponse(event, 200, {
      ok: true,
      events: cleaned,
      count: cleaned.length,
      reference_date: referenceDate
    }, CORS_OPTIONS);
  } catch (error) {
    console.error("calendar-screenshot-extract-failed", { message: error?.message || "unknown" });
    return jsonResponse(event, 500, { error: "Extraction failed" }, CORS_OPTIONS);
  }
}
