import {
  jsonResponse,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

const CORS_OPTIONS = { methods: "GET, OPTIONS" };

// Lightweight health check for AI availability detection.
// Used by ReframeTool to detect when the network/Netlify are reachable
// after a fail-streak triggered Self Mode. Does NOT call Anthropic — this
// is purely a "can I reach our backend" probe so we can prompt the user
// that AI is likely available again. The actual AI call still validates
// on the user's next send.
export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return jsonResponse(event, 200, { ok: true }, CORS_OPTIONS);
  if (event.httpMethod !== "GET") return jsonResponse(event, 405, { error: "Method not allowed" }, CORS_OPTIONS);

  const originBlocked = rejectDisallowedOrigin(event, CORS_OPTIONS);
  if (originBlocked) return originBlocked;

  return jsonResponse(event, 200, { ok: true, ts: Date.now() }, CORS_OPTIONS);
}
