/**
 * cfmApi.js — client calls for Cognitive Function Measurement exercises.
 *
 * Currently: the cognitive-defusion scorer. Sends the original thought and the
 * frames the user generated; the server classifies each frame
 * (distinct | reworded | same) and owns the score mapping. The model never
 * invents a number. Fail-soft: any failure returns nulls, never a fabricated
 * score and never a throw to the caller.
 */

const DEFUSION_URL = "/.netlify/functions/cognitive-defusion-score";

/**
 * @param {{ thought: string, frames: string[] }} input
 * @returns {Promise<{ scores: Array|null, distinctCount: number|null, total: number|null, error: string|null }>}
 */
export async function scoreDefusionFrames({ thought, frames } = {}) {
  const failSoft = { scores: null, distinctCount: null, total: null, error: "unavailable" };

  const cleanThought = typeof thought === "string" ? thought.trim() : "";
  const cleanFrames = Array.isArray(frames)
    ? frames.map((f) => (typeof f === "string" ? f.trim() : "")).filter(Boolean)
    : [];
  if (!cleanThought || cleanFrames.length === 0) return failSoft;

  try {
    const res = await fetch(DEFUSION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ thought: cleanThought, frames: cleanFrames }),
    });
    if (!res.ok) return failSoft;
    const data = await res.json();
    if (!data || typeof data !== "object") return failSoft;
    return {
      scores: Array.isArray(data.scores) ? data.scores : null,
      distinctCount: typeof data.distinctCount === "number" ? data.distinctCount : null,
      total: typeof data.total === "number" ? data.total : null,
      error: data.error ?? null,
    };
  } catch {
    return failSoft;
  }
}
