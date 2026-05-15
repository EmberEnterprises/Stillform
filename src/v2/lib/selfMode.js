/*
 * selfMode.js — the self-led practice prompts.
 *
 * Self Mode is a first-class alternative to the AI Reframe — same
 * Notice → Reframe → Close spine, but the user writes their way
 * through four metacognitive prompts instead of conversing with the AI.
 *
 * Triggers:
 *   1. User opts in from Notice ("Or self-led ›" link)
 *   2. Auto-fallback when reframe.js errors persistently (Reframe
 *      surface shows "Switch to self-led" prominently in error state)
 *
 * Prompts mirror what the AI would ask: somatic specificity, granular
 * naming, assumption check, next move. They don't replace the AI in
 * sophistication, but they keep the practice usable when the AI is
 * unavailable AND give users who prefer silence a first-class path.
 *
 * Canon refs:
 *   - Hoemann 2021, Barrett 2017 (granular naming)
 *   - Wells 2009 (metacognitive therapy — assumption check)
 *   - Bandura 1977 (self-efficacy through self-led practice)
 *
 * Per canon §10 (one element per beat), the prompts are sequential —
 * one screen per prompt, tap to advance. No step counter, no progress
 * bar (those collapse practice into form transactions).
 */

export const SELF_PROMPTS = [
  {
    id: "somatic",
    headline: "Where does this register in the body?",
    body: "Specifics. Chest, jaw, gut, shoulders, breath. Where you notice it.",
  },
  {
    id: "granular",
    headline: "What's the smaller, more specific version of this?",
    body: "Beneath the first name, what's the more precise one.",
  },
  {
    id: "assumption",
    headline: "What were you assuming — and what's actually true?",
    body: "The story you were telling yourself, and the more grounded one.",
  },
  {
    id: "move",
    headline: "What's one small move from here?",
    body: "Not the perfect move. One you can actually make.",
  },
];

export const SELF_MODE_INFO = {
  title: "Self-led practice",
  body:
    "Same practice — you write it instead of conversing. Four metacognitive prompts you answer at your own pace. Sometimes the AI is offline; sometimes you just prefer the silence. The naming work is yours either way.",
};
