// Practice Signals — Cognitive Defusion stimulus library
// CFM Phase 1 · May 7, 2026 · Author: Claude (draft for Arlin's review + tweak)
//
// 15 thought stimuli for the cognitive-defusion exercise. The user gets one
// thought + a 30-second window to generate alternative frames. Each frame is
// scored by the AI rubric (Decision 7): distinct (1.0) / reworded (0.5) / same (0.0).
// Distinct count over time is the trend.
//
// Authoring criteria per CFM Phase 1 audit Decision 3:
// - Each thought is a "sticky thought" — the kind users actually have, not
//   straw thoughts that are easy to dismiss
// - Coverage spans the categories Stillform's four pillars touch:
//   self-criticism, catastrophizing, social comparison, identity threat,
//   relational reading, perfectionism, time pressure, control
// - Each thought is short (1-2 sentences) so the user reads it fast and
//   spends the 30 seconds generating, not parsing
// - Hand-validated by Arlin + second rater for "would a real user think this?"
//   and "is the rubric scorable for this thought?"

export const COGNITIVE_DEFUSION_STIMULI = [
  // ─── Self-criticism / impostor ──────────────────────────────────────
  { id: 1, thought: "I'll never get this right.", category: "self-criticism" },
  { id: 2, thought: "Everyone else figured this out a long time ago.", category: "self-criticism" },
  { id: 3, thought: "If they really knew me, they'd see I'm faking it.", category: "impostor" },

  // ─── Catastrophizing ────────────────────────────────────────────────
  { id: 4, thought: "If this falls apart, everything falls apart.", category: "catastrophizing" },
  { id: 5, thought: "There's no recovery from this kind of mistake.", category: "catastrophizing" },

  // ─── Social comparison ──────────────────────────────────────────────
  { id: 6, thought: "Everyone my age has it more figured out than I do.", category: "comparison" },
  { id: 7, thought: "They're more talented than I am, and they always will be.", category: "comparison" },

  // ─── Relational reading ─────────────────────────────────────────────
  { id: 8, thought: "They didn't say anything because they're disappointed in me.", category: "mind-reading" },
  { id: 9, thought: "They were short with me — I must have done something wrong.", category: "mind-reading" },
  { id: 10, thought: "If they really cared, they would have called by now.", category: "relational" },

  // ─── Perfectionism / control ────────────────────────────────────────
  { id: 11, thought: "It has to be perfect or it doesn't count.", category: "perfectionism" },
  { id: 12, thought: "If I stop holding it together, the whole thing will collapse.", category: "control" },

  // ─── Time pressure / stuckness ──────────────────────────────────────
  { id: 13, thought: "I'm running out of time and there's nothing I can do.", category: "time-pressure" },
  { id: 14, thought: "I should be further along than I am.", category: "stuckness" },

  // ─── Identity threat ────────────────────────────────────────────────
  { id: 15, thought: "Maybe I'm just not the kind of person who can do this.", category: "identity" },
];

// Inter-rater agreement (filled after Arlin + second rater review).
export const COGNITIVE_DEFUSION_RATER_AGREEMENT = [
  // To be filled in during May 9 review.
  // Example: { id: 1, agreement: "yes" },
  //          { id: 5, agreement: "no", notes: "Sounds therapy-coded — drop or rewrite" },
];

export const getValidatedDefusionStimuli = () => {
  if (COGNITIVE_DEFUSION_RATER_AGREEMENT.length === 0) {
    return COGNITIVE_DEFUSION_STIMULI;
  }
  const okIds = new Set(
    COGNITIVE_DEFUSION_RATER_AGREEMENT
      .filter((r) => r.agreement === "yes")
      .map((r) => r.id)
  );
  return COGNITIVE_DEFUSION_STIMULI.filter((s) => okIds.has(s.id));
};

// Few-shot examples for the AI scoring prompt. These anchor the rubric
// (distinct / reworded / same) with concrete examples so AI scoring stays
// consistent across thoughts. Wire into netlify/functions/cognitive-defusion-score.js
// when that ships in Sprint 3.
export const DEFUSION_SCORING_EXAMPLES = [
  {
    thought: "I'll never get this right.",
    frames: [
      { text: "I'll never figure this out.", expected: "reworded" },
      { text: "This is harder than I expected, and that's information.", expected: "distinct" },
      { text: "I never get anything right.", expected: "same" },
      { text: "What does 'right' look like, and who decided that?", expected: "distinct" },
    ],
  },
  {
    thought: "If they really knew me, they'd see I'm faking it.",
    frames: [
      { text: "They'd realize I'm a fraud.", expected: "reworded" },
      { text: "What I'm calling 'faking' might be the part of me still learning.", expected: "distinct" },
      { text: "I'm a fake.", expected: "same" },
      { text: "The version they see is one of many real versions.", expected: "distinct" },
    ],
  },
];
