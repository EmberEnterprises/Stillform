/**
 * defusion.js — Phase 4 (Cognitive defusion / ACT)
 *
 * Sibling to selfDistance.js in the voice-primitive family. Deterministically
 * re-presents the user's OWN naming as an observed thought, loosening fusion:
 *   "everyone hates me"  →  "I'm having the thought that everyone hates me"
 *   "I'm a failure"      →  "I'm having the thought that I'm a failure"
 *
 * Science: Hayes / ACT — seeing a thought AS a thought (not a fact) reduces its
 * believability and grip; defusion mediates ACT change. The AI is already
 * prompted to use this conversationally; this is the deterministic hardening.
 *
 * ── INTEGRITY LAWS (same family as selfDistance) ────────────────────────────
 *   1. DETERMINISTIC — same input, same output.
 *   2. IT ONLY WRAPS the user's existing words in the observed-thought frame.
 *      It never invents, adds, reinterprets, or evaluates content.
 *   3. RETURNS null on empty / non-string / over-length input.
 *
 * ── SCOPE: PLUMBING ONLY ────────────────────────────────────────────────────
 *   The frame STEM below is the canonical ACT phrasing as a DEFAULT — the exact
 *   wording is Arlin's voice to revise. The aim is loosening grip, NOT removing
 *   the thought. Nothing here is wired live; when/where it's used, and any
 *   combination with selfDistance.revoice (e.g. third-person + defusion), are
 *   voice/usage decisions that belong to Arlin. Integration seam noted below.
 */

const MAX_LEN = 600;

// Canonical ACT defusion stem (DEFAULT — Arlin's voice to revise).
const STEM = "I'm having the thought that ";

/**
 * defuse — wrap a piece of the user's own first-person naming as an observed
 * thought. Returns the re-voiced string, or null.
 *
 * @param {string} text
 * @returns {string|null}
 */
export function defuse(text) {
  if (typeof text !== "string") return null;
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > MAX_LEN) return null;

  // Lowercase the opening letter so the wrap reads as one sentence — UNLESS the
  // statement begins with the pronoun "I" (I / I'm / I've / I'd / I'll), which
  // stays capitalized. This is a perspective wrap only; no content is changed.
  const firstWord = trimmed.split(/\s+/)[0];
  const keepsCap = /^I(['’]|$)/.test(firstWord);
  const inner = keepsCap ? trimmed : trimmed[0].toLowerCase() + trimmed.slice(1);

  return STEM + inner;
}

/* ── INTEGRATION SEAM (deferred — Arlin owns the voice/usage) ─────────────────
 *
 * Not wired into any live surface. Intended use is 7.1a step-2 interpretation,
 * as a sibling option to self-distancing: offer the user's own naming back as
 * an observed thought, sparingly (not every turn). The stem wording, the WHEN,
 * and any pairing with revoice() are Arlin's voice decisions.
 */
