/**
 * rehearsalApi — v2 client for the Rehearsal tool (Phase 7c).
 *
 * Wraps netlify/functions/rehearsal.js. Given a situation (+ optional
 * recipient / context), the backend returns 2-3 anticipated exchanges —
 * each a pair of the other person's likely line and the user's say-ready
 * response — to practice before the conversation. Operator-tier voice
 * (server-enforced), crisis-aware, origin + IP-rate-limit gated, no
 * install_id. This client shapes the request, normalizes the exchange list,
 * and surfaces the crisis/error cases cleanly.
 */
import { fnUrl } from "./apiBase.js";

const REHEARSAL_API_URL = fnUrl("rehearsal");

/**
 * @param {object} args
 * @param {string} args.situation — the conversation / what's coming (required, >= 8 chars)
 * @param {string} [args.recipient] — who it's with
 * @param {string} [args.context] — extra context
 * @returns {Promise<{exchanges: Array<{they:string, you:string}>, note: string|null, crisis: boolean, error: string|null}>}
 */
export async function generateRehearsal({ situation, recipient = "", context = "" } = {}) {
  const trimmed = String(situation || "").trim();
  if (trimmed.length < 8) {
    return { exchanges: [], note: null, crisis: false, error: "Tell me a sentence about the situation first." };
  }

  const body = {
    situation: trimmed,
    recipient: String(recipient || "").trim(),
    context: String(context || "").trim(),
  };

  try {
    const response = await fetch(REHEARSAL_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status === 403) {
      return { exchanges: [], note: null, crisis: false, error: "Origin not allowed." };
    }
    if (response.status === 429) {
      return { exchanges: [], note: null, crisis: false, error: "Take a moment, then try again." };
    }
    if (!response.ok) {
      return { exchanges: [], note: null, crisis: false, error: `Connection issue (${response.status}). Try again.` };
    }

    const data = await response.json();

    if (data && data.crisis) {
      return { exchanges: [], note: data.note || null, crisis: true, error: null };
    }

    const exchanges = Array.isArray(data && data.exchanges)
      ? data.exchanges
          .filter((e) => e && typeof e.they === "string" && typeof e.you === "string" && e.they.trim() && e.you.trim())
          .map((e) => ({ they: e.they.trim(), you: e.you.trim() }))
      : [];

    if (exchanges.length === 0) {
      return { exchanges: [], note: null, crisis: false, error: "Empty response. Try again." };
    }

    return {
      exchanges,
      note: data && typeof data.note === "string" && data.note.trim() ? data.note.trim() : null,
      crisis: false,
      error: null,
    };
  } catch {
    return { exchanges: [], note: null, crisis: false, error: "Couldn't reach the network. Try again." };
  }
}
