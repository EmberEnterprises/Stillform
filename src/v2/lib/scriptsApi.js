/**
 * scriptsApi — v2 client for the Scripts ("State to Statement") tool.
 *
 * Thin wrapper over netlify/functions/scripts.js. The backend (built
 * May 23, 2026) does the work: it takes a situation plus optional
 * recipient / outcome / channel and returns one verbatim, send-ready line
 * in the user's own voice — "the line itself, not advice" (per
 * STILLFORM_ENGAGEMENT_ARCHITECTURE.md §3.2). Voice is enforced
 * server-side (operator-tier, voice-contract-validated); this client never
 * re-prompts or post-processes the script text — it only shapes the
 * request, handles the status / crisis cases, and returns a clean object
 * the surface can render.
 *
 * The backend gates by origin + an 8/min IP rate-limit; no install_id /
 * session identity is required (unlike reframe.js), so this stays simple.
 */

const SCRIPTS_API_URL = "/.netlify/functions/scripts";

const VALID_CHANNELS = ["text", "email", "in-person", "voice"];

/**
 * Generate a script for a hard conversation.
 *
 * @param {object} args
 * @param {string} args.situation — what's going on / what they need to say (required, >= 8 chars)
 * @param {string} [args.recipient] — who it's for (optional)
 * @param {string} [args.outcome] — what they want to happen (optional)
 * @param {"text"|"email"|"in-person"|"voice"} [args.channel] — defaults to "text"
 * @returns {Promise<{script: string|null, tone: string|null, note: string|null, crisis: boolean, error: string|null}>}
 */
export async function generateScript({
  situation,
  recipient = "",
  outcome = "",
  channel = "text",
} = {}) {
  const trimmed = String(situation || "").trim();
  if (trimmed.length < 8) {
    return {
      script: null,
      tone: null,
      note: null,
      crisis: false,
      error: "Tell me a sentence about the situation first.",
    };
  }

  const body = {
    situation: trimmed,
    recipient: String(recipient || "").trim(),
    outcome: String(outcome || "").trim(),
    channel: VALID_CHANNELS.includes(channel) ? channel : "text",
  };

  try {
    const response = await fetch(SCRIPTS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status === 403) {
      return { script: null, tone: null, note: null, crisis: false, error: "Origin not allowed." };
    }
    if (response.status === 429) {
      return { script: null, tone: null, note: null, crisis: false, error: "Take a moment, then try again." };
    }
    if (!response.ok) {
      return {
        script: null,
        tone: null,
        note: null,
        crisis: false,
        error: `Connection issue (${response.status}). Try again.`,
      };
    }

    const data = await response.json();

    // Crisis-redirect shape (HTTP 200): script null + tone "crisis-redirect",
    // note carries the redirect copy. Surface this as-is; never override it.
    if (data && data.tone === "crisis-redirect") {
      return {
        script: null,
        tone: "crisis-redirect",
        note: data.note || null,
        crisis: true,
        error: null,
      };
    }

    const script = data && typeof data.script === "string" ? data.script.trim() : "";
    if (!script) {
      return { script: null, tone: null, note: null, crisis: false, error: "Empty response. Try again." };
    }

    return {
      script,
      tone: data && typeof data.tone === "string" ? data.tone.trim() : null,
      note: data && typeof data.note === "string" && data.note.trim() ? data.note.trim() : null,
      crisis: false,
      error: null,
    };
  } catch {
    return { script: null, tone: null, note: null, crisis: false, error: "Couldn't reach the network. Try again." };
  }
}
