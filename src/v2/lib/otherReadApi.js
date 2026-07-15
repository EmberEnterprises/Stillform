/**
 * otherReadApi — v2 client for "the other read" (devil's-advocate offer).
 *
 * Thin wrapper over netlify/functions/devils-advocate.js. The user is testing a
 * belief in their Thought Record; this asks for the single strongest case for
 * the OTHER read, so they can weigh it and re-rate. Take-it-or-leave-it — the
 * user stays the authority.
 *
 * The backend owns the safety judgment: it refuses to argue values, boundaries,
 * grief, an accurate read of a bad situation, or a feeling itself (returns
 * arguable:false with an honest note), and short-circuits crisis language before
 * the model. This client never re-prompts or softens — it shapes the request,
 * handles the status cases, and returns a clean object the surface renders.
 *
 * Backend gates by origin + an 8/min IP rate-limit; no identity required.
 */
import { fnUrl } from "./apiBase.js";

const OTHER_READ_API_URL = fnUrl("devils-advocate");

/**
 * Ask for the strongest case for the other read of a belief.
 *
 * @param {object} args
 * @param {string} args.thought — the belief being tested (required, >= 4 chars)
 * @param {string} [args.evidence] — the user's own counter-evidence so far (optional)
 * @returns {Promise<{arguable: boolean, otherRead: string|null, note: string|null, crisis: boolean, error: string|null}>}
 */
export async function getOtherRead({ thought, evidence = "" } = {}) {
  const trimmed = String(thought || "").trim();
  if (trimmed.length < 4) {
    return { arguable: false, otherRead: null, note: null, crisis: false, error: "Name the thought first." };
  }

  const body = { thought: trimmed, evidence: String(evidence || "").trim() };

  try {
    const response = await fetch(OTHER_READ_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status === 403)
      return { arguable: false, otherRead: null, note: null, crisis: false, error: "Origin not allowed." };
    if (response.status === 429)
      return { arguable: false, otherRead: null, note: null, crisis: false, error: "Take a moment, then try again." };
    if (!response.ok)
      return { arguable: false, otherRead: null, note: null, crisis: false, error: `Connection issue (${response.status}). Try again.` };

    const data = await response.json();

    // Not-arguable (incl. crisis short-circuit): arguable false + an honest note.
    // Surface the note as-is; never override it.
    if (!data || data.arguable !== true) {
      return {
        arguable: false,
        otherRead: null,
        note: data && typeof data.note === "string" && data.note.trim() ? data.note.trim() : null,
        crisis: !!(data && data.isCrisis),
        error: null,
      };
    }

    const otherRead = typeof data.other_read === "string" ? data.other_read.trim() : "";
    if (!otherRead) {
      return { arguable: false, otherRead: null, note: null, crisis: false, error: "Empty response. Try again." };
    }

    return {
      arguable: true,
      otherRead,
      note: typeof data.note === "string" && data.note.trim() ? data.note.trim() : null,
      crisis: false,
      error: null,
    };
  } catch {
    return { arguable: false, otherRead: null, note: null, crisis: false, error: "Couldn't reach the network. Try again." };
  }
}
