/*
 * threadEntry.js — derives a short, glanceable name for the today thread
 * from the user's Notice input.
 *
 * Per Phase 3.5 spec item #1 (Stillform_Master_Todo.md, locked May 16, 2026):
 *
 *   Free-typed Notice input currently appears verbatim in TODAY thread
 *   (entire paragraph). Needs derivation: first clause / first sentence /
 *   AI-extracted theme. Thread becomes unreadable as days accumulate
 *   without this. Chip-only sessions already render correctly (chip name
 *   only — the chip seeds the textarea with "ChipLabel — ", which trims
 *   to "ChipLabel —" and stays short).
 *
 * Architectural notes:
 * - Pure derivation, deterministic, no AI dependency. Per Pillar B (Self
 *   Mode as architecture), the thread must render correctly with zero
 *   network and zero AI. AI-extracted thematic naming may layer on later
 *   as an enhancement (see Phase 5 Mirror work) but is not in Phase 3.5
 *   scope.
 * - The FULL precisionName is preserved on the session record in
 *   sessions.js (`precisionName` field). Derivation here only affects the
 *   thread DISPLAY. Downstream surfaces — Mirror strip, Pattern Disruption
 *   Layer, AI Mediation — still see the full user input.
 * - Em-dash glyph (—) is treated as a clause separator because Notice
 *   seeds chip-selected text with "ChipLabel — " (see Notice.jsx line 62).
 *
 * Target length (THREAD_MAX_LEN below) is calibrated to the mobile single-
 * line glance budget. Empirically: ~50 characters fits comfortably on a
 * narrow mobile column without wrapping aggressively, while still letting
 * the user differentiate "Anxious about Tuesday board" from "Anxious about
 * son's grades" at a glance.
 */

const THREAD_MAX_LEN = 50;
const CLAUSE_BREAKS = /[,.;:—]/;

/**
 * Derive a short, glanceable thread-display name from the user's Notice
 * input.
 *
 * @param {string} precisionName  the full text from Notice
 * @param {string|null} selectedChip  the chip id if user tapped one (informational only — text already contains the chip prefix)
 * @returns {string}  the short name to render in the thread (empty string if input is empty)
 */
export function deriveThreadName(precisionName, selectedChip) {
  // Defensive: empty / non-string returns empty so appendTodayEntry skips.
  if (typeof precisionName !== "string") return "";
  const text = precisionName.trim();
  if (!text) return "";

  // Short input is already glanceable. Return as-is.
  // Covers chip-only sessions ("Unsure —" = 8 chars) and short free-typed
  // sessions ("Anxious about Tuesday's board meeting" = 39 chars).
  if (text.length <= THREAD_MAX_LEN) return text;

  // Long input — try clause-split first. The first clause is usually the
  // most semantically dense in stream-of-consciousness writing. This
  // handles patterns like:
  //   "Anxious — about my son's grades and how I'm reacting"
  //     → "Anxious"  (then the rest is context)
  //   "Stuck, like I can't see the next move, even though..."
  //     → "Stuck"
  // If the first clause is very short (just a feeling word), we keep going
  // to include some context.
  const firstClause = text.split(CLAUSE_BREAKS)[0].trim();
  if (firstClause.length >= 4 && firstClause.length <= THREAD_MAX_LEN) {
    // Re-attach trailing em-dash if the split was on em-dash, because that
    // matches the visual idiom established by chip-only entries
    // ("Unsure —"). Only do this when the original used em-dash as the
    // first break — otherwise the dash misrepresents what the user wrote.
    const usesDash = text.indexOf("—") > 0 && text.indexOf("—") <= firstClause.length + 1;
    return usesDash ? `${firstClause} —` : firstClause;
  }

  // Stream-of-consciousness with no punctuation (the case that motivated
  // this fix: "I'm exhausted I'm I'm in pain I have a roller coaster of
  // motions I want to get this app done..."). Take words until we hit the
  // length budget, then ellipsis.
  const words = text.split(/\s+/);
  let buf = "";
  for (const w of words) {
    const next = buf ? `${buf} ${w}` : w;
    // Reserve 1 char for the ellipsis. If adding this word would exceed
    // the budget, stop with what we have.
    if (next.length > THREAD_MAX_LEN - 1) break;
    buf = next;
  }

  // Edge: a single word longer than the budget. Hard-truncate.
  if (!buf) buf = text.slice(0, THREAD_MAX_LEN - 1);

  return `${buf}…`;
}
