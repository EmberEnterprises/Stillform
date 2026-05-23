/**
 * cdquest.js — CD-Quest instrument definition (Workshop instrument #2,
 * cognitive distortions). Bias Profile build, Step 5a.
 *
 * THIS MODULE DEFINES THE INSTRUMENT CONTRACT the generic take-flow runner
 * (Step 5b) and every later instrument follow. It is pure: the definition +
 * a pure score(responses) function. No persistence, no React — the runner
 * imports this, renders it, and (on the user's confirmation) writes proposed
 * chips to the watch list via biasProfile.js. Keeping scoring pure keeps the
 * result-framing rules testable and in one place.
 *
 * Spec: STILLFORM_WORKSHOP_CDQUEST_SPEC.md (locked May 20, 2026).
 * Source: de Oliveira 2015 (CD-Quest). Items here are ORIGINAL Stillform-voiced
 * adaptations faithful to each distortion's construct — the verbatim CD-Quest
 * items are copyrighted and are NOT reproduced. Distortion names live in the
 * internal `spine` field only (the clinical spine, two-register rule) and are
 * NEVER shown beside an item during the take — recognition is taught in the
 * result, not pre-loaded.
 *
 * Feeds the PATTERN-WORK watch list (biasProfile.js), not the capacities
 * mirror. Each item maps 1:1 to a distortion chip in biasChips.js by chipId.
 */

// ---------------------------------------------------------------------------
// Response model — two-part (frequency × grip). Per spec §4:
//   frequency: how often the pattern ran this week
//   intensity ("grip"): how hard the thought gripped you — the PRECISION
//     self-report. Captured and used internally (surface order + AI weight);
//     NEVER shown back to the user as a number or severity label.
// ---------------------------------------------------------------------------

export const FREQUENCY = Object.freeze({
  prompt: "This week, how often?",
  options: Object.freeze([
    Object.freeze({ value: 0, label: "Didn't" }),
    Object.freeze({ value: 1, label: "Once or twice" }),
    Object.freeze({ value: 2, label: "Several times" }),
    Object.freeze({ value: 3, label: "A lot" }),
  ]),
});

export const INTENSITY = Object.freeze({
  prompt: "When it showed up, how much did it grip you?",
  // Only asked when frequency > 0.
  options: Object.freeze([
    Object.freeze({ value: 0, label: "Barely" }),
    Object.freeze({ value: 1, label: "Some grip" }),
    Object.freeze({ value: 2, label: "Strong grip" }),
  ]),
});

// ---------------------------------------------------------------------------
// The 15 items. Order is fixed but non-thematic; `spine` is internal only.
// chipId maps 1:1 to the distortion chips in biasChips.js.
// ---------------------------------------------------------------------------

const ITEMS = Object.freeze([
  Object.freeze({ id: "q1", chipId: "d_all_or_nothing", spine: "all-or-nothing", text: "I read something as all good or all bad — a total win or a total wreck — with nothing in the middle." }),
  Object.freeze({ id: "q2", chipId: "d_catastrophizing", spine: "catastrophizing", text: "I ran the worst version of what might happen and treated it like what would happen." }),
  Object.freeze({ id: "q3", chipId: "d_discounting_positive", spine: "discounting the positive", text: "Something went right and I explained it away, shrank it, or chalked it up to luck." }),
  Object.freeze({ id: "q4", chipId: "d_emotional_reasoning", spine: "emotional reasoning", text: "I took a feeling as proof — I felt it, so it must be true." }),
  Object.freeze({ id: "q5", chipId: "d_labeling", spine: "labeling", text: "A single slip turned into a statement about who I am — not 'I failed at this' but 'I'm a failure.'" }),
  Object.freeze({ id: "q6", chipId: "d_magnification", spine: "magnification and minimization", text: "I blew one thing way up, or shrank something down so it barely counted." }),
  Object.freeze({ id: "q7", chipId: "d_mental_filter", spine: "mental filter", text: "Out of a mixed situation, I locked onto the one bad part and lost the rest." }),
  Object.freeze({ id: "q8", chipId: "d_mind_reading", spine: "mind-reading", text: "I decided I knew what someone thought or felt about me, without them telling me." }),
  Object.freeze({ id: "q9", chipId: "d_overgeneralization", spine: "overgeneralization", text: "One thing happened and I turned it into 'always' or 'never.'" }),
  Object.freeze({ id: "q10", chipId: "d_personalization", spine: "personalization", text: "Something went wrong and I treated myself as the cause, without clear evidence the line ran to me." }),
  Object.freeze({ id: "q11", chipId: "d_should", spine: "should statements", text: "I held myself or someone else to a should / must / have-to, and falling short of it stung." }),
  Object.freeze({ id: "q12", chipId: "d_jumping", spine: "jumping to conclusions", text: "I landed on a conclusion fast, before I actually had the evidence for it." }),
  Object.freeze({ id: "q13", chipId: "d_blaming", spine: "blaming", text: "I sorted who was at fault — pinned it on myself or someone else — quickly." }),
  Object.freeze({ id: "q14", chipId: "d_what_if", spine: "what-if", text: "I ran a chain of what-ifs, each one worse than the last." }),
  Object.freeze({ id: "q15", chipId: "d_comparison", spine: "unfair comparison", text: "I measured myself against someone else and read the result as proof of my worth." }),
]);

// ---------------------------------------------------------------------------
// The instrument definition (the shape the generic runner consumes).
// `name`/`subtitle` are the final Workshop copy (Step 5j, May 23, 2026).
// ---------------------------------------------------------------------------

export const CDQUEST = Object.freeze({
  id: "cdquest",
  surface: "pattern-work",
  name: "Thinking Shapes",
  subtitle: "The shapes your thinking takes under pressure",
  estMinutes: 5,
  responseModel: "two-part-freq-grip",
  intro:
    "This is a closer look at the shapes your thinking takes under pressure — the moves a mind makes when it's reading a hard situation fast. These patterns come from a long-studied map of how thinking bends. No scores, no right answers, no judgment. For each one: did it show up this week, and when it did, how much did it grip you? About 5 minutes.",
  frequency: FREQUENCY,
  intensity: INTENSITY,
  items: ITEMS,
});

// ---------------------------------------------------------------------------
// Scoring — pure. Per spec §5:
//   endorsed = frequency ≥ "Several times" (2)  OR
//              ("Once or twice" (1) with "Strong grip" (2))
//   light    = any frequency ≥ 1 that isn't endorsed
//   not      = "Didn't" (0)
// Endorsed items become PROPOSED chips (the user confirms before any chip
// lands — consent, never auto-add). Grip orders the proposals (strongest
// first) and is retained for AI weighting, but is never surfaced as a number.
// ---------------------------------------------------------------------------

/** @returns {"endorsed"|"light"|"not"} */
export function tierFor(frequency, intensity) {
  const f = Number(frequency) || 0;
  const g = intensity == null ? null : Number(intensity);
  if (f === 0) return "not";
  if (f >= 2) return "endorsed";
  if (f === 1 && g === 2) return "endorsed"; // once/twice but strong grip
  return "light";
}

/**
 * Score a completed take.
 * @param {Object<string,{frequency:number,intensity:?number}>} responses
 *   keyed by item id.
 * @returns {{
 *   instrumentId: "cdquest",
 *   surface: "pattern-work",
 *   items: Array<{itemId:string, chipId:string, frequency:number, intensity:?number, tier:string}>,
 *   proposedChips: string[],   // endorsed chipIds, strongest-grip first
 *   lightChips: string[]       // lightly-present chipIds (named gently, no push)
 * }}
 */
export function score(responses = {}) {
  const scored = ITEMS.map((item) => {
    const r = responses[item.id] || {};
    const frequency = Number(r.frequency) || 0;
    const intensity = frequency === 0 ? null : (r.intensity == null ? null : Number(r.intensity));
    return {
      itemId: item.id,
      chipId: item.chipId,
      frequency,
      intensity,
      tier: tierFor(frequency, intensity),
    };
  });

  const endorsed = scored
    .filter((s) => s.tier === "endorsed")
    .sort((a, b) => {
      const gi = (b.intensity ?? -1) - (a.intensity ?? -1); // strongest grip first
      if (gi !== 0) return gi;
      return b.frequency - a.frequency;
    });

  const light = scored.filter((s) => s.tier === "light");

  return {
    instrumentId: "cdquest",
    surface: "pattern-work",
    items: scored,
    proposedChips: endorsed.map((s) => s.chipId),
    lightChips: light.map((s) => s.chipId),
  };
}

export default CDQUEST;
