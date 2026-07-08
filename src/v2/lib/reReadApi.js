/**
 * reReadApi — v2 client for "The Re-Read" (memory reconsolidation widening).
 *
 * Thin wrapper over netlify/functions/re-read.js. The user has CHOSEN one
 * remembered event they carry in a single-sided telling; the backend returns
 * 2-3 GUIDING QUESTIONS aimed at the unseen angles — never a conclusion, never
 * a verdict (Arlin's epistemic doctrine: the insight lands as theirs).
 *
 * The backend owns the safety judgment (Arlin's floor, designed in first):
 * abuse / violence / severe trauma / accurate-read-of-real-mistreatment come
 * back workable:false with the "heavier than a re-read" note, and crisis
 * language short-circuits before the model. This client never re-prompts or
 * softens — the surface routes workable:false to CrisisResources + handoff
 * when isCrisis, and renders the note honestly otherwise.
 */

const RE_READ_API_URL = "/.netlify/functions/re-read";

/**
 * Ask for the guided widening of one self-selected memory.
 *
 * @param {object} args
 * @param {string} args.memory — the memory in the user's own words (required, >= 12 chars)
 * @returns {Promise<{workable: boolean, questions: string[]|null, note: string|null, crisis: boolean, error: string|null}>}
 */
export async function getReRead({ memory } = {}) {
  const trimmed = String(memory || "").trim();
  if (trimmed.length < 12) {
    return { workable: false, questions: null, note: null, crisis: false, error: "Tell it in your own words first." };
  }

  try {
    const response = await fetch(RE_READ_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memory: trimmed }),
    });

    if (response.status === 403)
      return { workable: false, questions: null, note: null, crisis: false, error: "Origin not allowed." };
    if (response.status === 429)
      return { workable: false, questions: null, note: null, crisis: false, error: "Take a moment, then try again." };
    if (!response.ok)
      return { workable: false, questions: null, note: null, crisis: false, error: `Connection issue (${response.status}). Try again.` };

    const data = await response.json();

    if (!data || data.workable !== true) {
      return {
        workable: false,
        questions: null,
        note: data && typeof data.note === "string" && data.note.trim() ? data.note.trim() : null,
        crisis: !!(data && data.isCrisis),
        error: null,
      };
    }

    const questions = Array.isArray(data.questions)
      ? data.questions.filter((q) => typeof q === "string" && q.trim()).map((q) => q.trim())
      : [];
    if (questions.length < 2) {
      return { workable: false, questions: null, note: "Couldn't find an honest wider angle. Try again with more of the room in it.", crisis: false, error: null };
    }

    return {
      workable: true,
      questions,
      note: typeof data.note === "string" && data.note.trim() ? data.note.trim() : null,
      crisis: false,
      error: null,
    };
  } catch {
    return { workable: false, questions: null, note: null, crisis: false, error: "Couldn't reach the practice. Check the connection and try again." };
  }
}
