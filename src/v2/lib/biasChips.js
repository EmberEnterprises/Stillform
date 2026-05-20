/*
 * biasChips.js — Stillform's frozen pattern-work chip catalog.
 *
 * The 20 pattern-work chips of the Bias Profile (Phase 5 sub-item #4):
 * 15 cognitive-distortion chips (from CD-Quest) + 5 metacognitive-belief
 * chips (from MCQ-30). These are FIXED — a user adds chips from this
 * catalog to their watch list (see biasProfile.js); they do not author
 * their own, unlike Trigger/Context Profile freeform labels.
 *
 * ONE LIST, TWO REGISTERS (per STILLFORM_DISTORTION_VOCABULARY.md):
 *   - label  = Stillform loop-voice (what the user sees; names the
 *              MOTION, never the person)
 *   - spine  = clinical research name (internal grounding + machine
 *              mapping; NEVER shown to the user as a verdict)
 *   - info   = the ⓘ definition (user-facing; mirrors the canonical
 *              copy in CHIP_DEFINITIONS.md — keep the two in lock-step)
 *
 * Source of truth for the ⓘ copy is CHIP_DEFINITIONS.md. This file is
 * the code mirror; if one changes the other must follow.
 */

/**
 * Frozen 20-chip catalog. Order is stable (distortions first, then
 * metacognitive beliefs) but presentation order is the screen's call.
 */
export const BIAS_PROFILE_CHIPS = Object.freeze([
  // ── Cognitive distortions (CD-Quest, pattern-work strand) ──
  {
    id: "d_all_or_nothing",
    label: "The two-setting dial",
    spine: "all-or-nothing",
    type: "distortion",
    info: `Your read snaps to one of two extremes — total win or total wreck, all good or all ruined — with nothing in between. The dial only has two settings, but most of what's true lives in the middle. On your watch list, Stillform catches the snap when your thinking goes binary and helps you find the gradient again.`,
  },
  {
    id: "d_catastrophizing",
    label: "Rehearsing the worst",
    spine: "catastrophizing",
    type: "distortion",
    info: `Your mind runs the worst version of what's coming and treats the rehearsal like a forecast. The fear is real; the certainty isn't. Watch-listed, Stillform catches the rehearsal when it starts and helps you set the worst case next to the likely one — so the rehearsal stops standing in for fact.`,
  },
  {
    id: "d_discounting_positive",
    label: "The good doesn't count",
    spine: "discounting the positive",
    type: "distortion",
    info: `Wins land and slide right off — explained away, shrunk, filed as luck — while the misses stick. The ledger stays lopsided on its own. With this tracked, Stillform notices the sliding and slows it down, so what actually went right gets to count for what it is.`,
  },
  {
    id: "d_emotional_reasoning",
    label: "The feeling as the fact",
    spine: "emotional reasoning",
    type: "distortion",
    info: `A feeling gets read as proof — "I feel like a failure, so I must be one." The feeling is real and worth hearing; it isn't evidence about the world. On your watch list, Stillform helps you keep the two apart: the feeling is data about you, not a verdict on what's true.`,
  },
  {
    id: "d_labeling",
    label: "The thought wearing your name",
    spine: "labeling",
    type: "distortion",
    info: `A passing judgment hardens into an identity — "I messed up" becomes "I'm a mess." The thought puts on your name and walks around as fact. Watch-listed, Stillform catches the moment the verb becomes a noun and reminds you: that's a thought your system made, not the shape of you.`,
  },
  {
    id: "d_magnification",
    label: "The stuck zoom",
    spine: "magnification and minimization",
    type: "distortion",
    info: `The lens jams — one thing blown up huge while everything else shrinks to nothing. Scale goes out of true. With this tracked, Stillform notices when the zoom is stuck and helps you pull back to actual size, so one detail stops swallowing the whole frame.`,
  },
  {
    id: "d_mental_filter",
    label: "The one dark thread",
    spine: "mental filter",
    type: "distortion",
    info: `Out of a whole mixed picture, your attention pulls the single darkest thread and calls it the cloth. The rest is still there — it just went quiet. On your watch list, Stillform flags the narrowing and widens the frame back to everything that was actually in it.`,
  },
  {
    id: "d_mind_reading",
    label: "Filling in the why",
    spine: "mind-reading",
    type: "distortion",
    info: `Someone goes quiet, doesn't reply, gives a look — and your system fills in the why with no data, usually the worst one. The not-knowing is the loud part. Watch-listed, Stillform catches the gap between what you saw and what you assumed, and leaves the why open until there's something real to fill it with.`,
  },
  {
    id: "d_overgeneralization",
    label: "One time becomes always",
    spine: "overgeneralization",
    type: "distortion",
    info: `A single instance turns into a rule — "this happened" becomes "this always happens." The leap from once to always is the move to watch. With this tracked, Stillform flags the jump and brings it back to the one actual data point, before it sets as a law.`,
  },
  {
    id: "d_personalization",
    label: "Making yourself the cause",
    spine: "personalization",
    type: "distortion",
    info: `When something goes wrong, your system routes the cause straight back to you — even when the line doesn't actually run there. On your watch list, Stillform notices the routing and helps you check whether you're really the cause, or just the nearest place to set it down.`,
  },
  {
    id: "d_should",
    label: "The rulebook",
    spine: "should statements",
    type: "distortion",
    info: `A rulebook runs underneath — should, must, have-to, ought — and falling short of it lands as failing. The standards aren't the problem; the rigidity is. Watch-listed, Stillform flags the rulebook when it's running and asks the useful question: who wrote it, and does it still serve you?`,
  },
  {
    id: "d_jumping",
    label: "Verdict before evidence",
    spine: "jumping to conclusions",
    type: "distortion",
    info: `The conclusion lands before the evidence is in — reached at speed, then defended. The quickness is the tell. With this tracked, Stillform catches the jump and holds the gap open a beat longer, so the read has a chance to meet the facts before it locks.`,
  },
  {
    id: "d_blaming",
    label: "Sorting who pays",
    spine: "blaming",
    type: "distortion",
    info: `When something hurts, your system sorts who's at fault — pinning it outward or inward, fast. It's a protective move, and it can run ahead of the facts. Watch-listed, Stillform notices the sorting, especially before a high-stakes call, and lets it settle before the blame — or the plan — locks in.`,
  },
  {
    id: "d_what_if",
    label: "The what-if ladder",
    spine: "what-if",
    type: "distortion",
    info: `One what-if builds the next, each rung lower than the last, and the ladder only goes down. The questions feel like problem-solving but they're manufacturing dread. On your watch list, Stillform catches the climb early and helps you step off, back to the one thing actually in front of you.`,
  },
  {
    id: "d_comparison",
    label: "Running comparisons",
    spine: "unfair comparison",
    type: "distortion",
    info: `Your system benchmarks you against someone else and reads the result as data about your worth. Comparison is a process the mind runs — not a measurement of you. Watch-listed, Stillform flags it when it starts and brings the focus back to your own line, where the useful information actually is.`,
  },

  // ── Metacognitive beliefs (MCQ-30, pattern-work strand) ──
  {
    id: "m_pos",
    label: "Worry-as-engine",
    spine: "positive beliefs about worry (MCQ-30 POS)",
    type: "metacognitive",
    info: `A quiet belief that worrying is what keeps you sharp — that if you stopped turning it over, you'd drop the ball. So the worry feels productive, even necessary. Watch-listed, Stillform helps you test whether the worry is actually doing the work, or just running the engine hot while you do the work anyway.`,
  },
  {
    id: "m_neg",
    label: "Mind-as-mercy",
    spine: "negative beliefs about uncontrollability and danger (MCQ-30 NEG)",
    type: "metacognitive",
    info: `The sense that your thoughts run you, not the other way — that once a spiral starts it can't be stopped, and that's dangerous. The belief itself stacks fear on top of the thought. On your watch list, Stillform helps you see the thought as something passing through, not something with its hand on the wheel.`,
  },
  {
    id: "m_cc",
    label: "Memory-distrust",
    spine: "cognitive confidence (MCQ-30 CC)",
    type: "metacognitive",
    info: `A standing doubt in your own mind — did I really do that, did I get it right, can I trust what I remember. The distrust drives the re-checking, not any actual failure. Tracked, Stillform notices when the doubt is running and helps you tell a real gap from the habit of second-guessing.`,
  },
  {
    id: "m_nc",
    label: "Mind-as-discipline",
    spine: "need to control thoughts (MCQ-30 NC)",
    type: "metacognitive",
    info: `The belief that you should be able to control which thoughts show up — and that the wrong ones mean something's wrong with you. So you fight the thought, which keeps it loud. Watch-listed, Stillform helps you let a thought be there without it being a command or a verdict: control the response, not the arrival.`,
  },
  {
    id: "m_csc",
    label: "Inward-attention quality",
    spine: "cognitive self-consciousness (MCQ-30 CSC)",
    type: "metacognitive",
    info: `You watch your own thinking closely — which is the whole practice here, when it opens something up. The same attention can tip into looping, where watching becomes circling with no exit. On your watch list, Stillform helps you tell the two apart: the attention that moves you forward, versus the kind that just keeps the wheel spinning.`,
  },
]);

/** Chip types present in the catalog. */
export const BIAS_CHIP_TYPES = Object.freeze(["distortion", "metacognitive"]);

/** Fast id → chip lookup, built once. */
const CHIP_BY_ID = Object.freeze(
  BIAS_PROFILE_CHIPS.reduce((acc, chip) => {
    acc[chip.id] = chip;
    return acc;
  }, {})
);

/**
 * Look up a catalog chip by id.
 * @param {string} id
 * @returns {object|null} the frozen chip, or null if not in the catalog
 */
export function getChipById(id) {
  return CHIP_BY_ID[id] || null;
}

/**
 * True if id refers to a real catalog chip.
 * @param {string} id
 * @returns {boolean}
 */
export function isValidChipId(id) {
  return typeof id === "string" && Object.prototype.hasOwnProperty.call(CHIP_BY_ID, id);
}

/**
 * All chips of a given type.
 * @param {"distortion"|"metacognitive"} type
 * @returns {Array}
 */
export function chipsByType(type) {
  return BIAS_PROFILE_CHIPS.filter((c) => c.type === type);
}
