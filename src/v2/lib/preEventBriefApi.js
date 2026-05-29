/**
 * preEventBriefApi — v2 client for the Pre-event Brief artifact.
 *
 * Thin wrapper over netlify/functions/pre-event-brief.js (built May 23,
 * 2026). The backend takes one upcoming event and returns a four-section
 * operator-tier brief:
 *   - hardware  — the body state walking in (Barrett 2017, granular bio label)
 *   - risks     — what's load-bearing about THIS event (Heider 1958 / Lazarus 1991)
 *   - moves     — if-then implementation intentions for it (Gollwitzer 1999)
 *   - recovery  — the downregulation move after it ends (Sheppes & Gross 2011)
 * gpt-4o, origin + IP-rate-limit gated (10/min), no install_id required.
 *
 * This client shapes the request, handles the status cases, and returns a
 * clean object the surface renders. Voice is enforced server-side; the
 * client never re-prompts or post-processes the brief text.
 */

const PRE_EVENT_BRIEF_API_URL = "/.netlify/functions/pre-event-brief";

/**
 * Generate a Pre-event Brief for one upcoming event.
 *
 * @param {object} args
 * @param {string} args.eventTitle — the event subject (required)
 * @param {string} [args.eventStart] — start time / when (free text or ISO)
 * @param {string} [args.eventDescription] — optional extra context
 * @returns {Promise<{hardware: string|null, risks: string|null, moves: string|null, recovery: string|null, error: string|null}>}
 */
export async function generatePreEventBrief({
  eventTitle,
  eventStart = "",
  eventDescription = "",
} = {}) {
  const title = String(eventTitle || "").trim();
  if (!title) {
    return {
      hardware: null,
      risks: null,
      moves: null,
      recovery: null,
      error: "What's the event? A title to brief against.",
    };
  }

  const body = {
    eventTitle: title,
    eventStart: String(eventStart || "").trim(),
    eventDescription: String(eventDescription || "").trim(),
  };

  try {
    const response = await fetch(PRE_EVENT_BRIEF_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status === 403) {
      return { hardware: null, risks: null, moves: null, recovery: null, error: "Origin not allowed." };
    }
    if (response.status === 429) {
      return { hardware: null, risks: null, moves: null, recovery: null, error: "Take a moment, then try again." };
    }
    if (!response.ok) {
      return {
        hardware: null,
        risks: null,
        moves: null,
        recovery: null,
        error: `Connection issue (${response.status}). Try again.`,
      };
    }

    const data = await response.json();
    const get = (k) => (data && typeof data[k] === "string" && data[k].trim() ? data[k].trim() : null);
    const hardware = get("hardware");
    const risks = get("risks");
    const moves = get("moves");
    const recovery = get("recovery");

    if (!hardware && !risks && !moves && !recovery) {
      return { hardware: null, risks: null, moves: null, recovery: null, error: "Empty brief. Try again." };
    }

    return { hardware, risks, moves, recovery, error: null };
  } catch {
    return { hardware: null, risks: null, moves: null, recovery: null, error: "Couldn't reach the network. Try again." };
  }
}
