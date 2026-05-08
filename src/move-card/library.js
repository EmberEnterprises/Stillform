// Move Card Library — Engagement Architecture Engine 2, Build #8 Phase 8a
// Per MOVE_CARD_FLOW_AUDIT.md (May 8) §3a default + §6 call 2 (Arlin + Claude
// pair-author against PATTERN_DISRUPTION_SPEC §4.2 mechanisms).
//
// STATUS: DRAFT STARTER LIBRARY. 10 sequences. Audit recommends 25-30 in
// production. This file is the Phase 8a draft Arlin reviews and expands
// before Move card surfaces ship to deploy. Each sequence is hand-tagged
// with the primary science mechanism it operationalizes — same locked
// science PATTERN_DISRUPTION_SPEC §4.2 grounds Disruptor in:
//   - Sokolov 1963: orienting response (novel stimulus captures attention,
//     breaking the loop)
//   - Porges polyvagal theory: vagal-tone-engaging moves downregulate
//     sympathetic activation (long exhales, jaw release, soft gaze)
//   - Levine somatic experiencing: completing thwarted fight/flight via
//     discharge moves (full exhale, tension-and-release, titration)
//   - Gollwitzer 1999 implementation intentions: "if X then Y" moves
//     pre-committed reduce execution cost under load
//
// FITNESS TAXONOMY (used by selection function in Phase 8b):
//   feelStates  — angry / anxious / stuck / flat / mixed / clear / focused
//   bioFilters  — activated / depleted / clear / hormonal / pain / sleep-deprived
//   signalAreas — jaw / neck / chest / shoulders / stomach / hands / general
//   timeOfDay   — morning / midday / evening / any
//
// PROMPT KIND VOCABULARY (matches DisruptorTool.jsx):
//   pressure | breath | temperature | posture | attention
//
// VOICE: prestige-operator declarative. Same as Disruptor. Second person
// imperative is fine here because these are bodily instructions, not advice.
// "Press your feet flat" not "you might want to try pressing your feet flat."

export const MOVE_CARD_LIBRARY = [
  // ─── 1. Activated + jaw signal — Porges vagal jaw release ─────────────
  {
    id: "jaw-release-vagal-60s",
    durationMs: 60000,
    prompts: [
      { text: "Let your jaw open slightly. Tongue rests on the floor of your mouth.", durationMs: 12000, kind: "posture" },
      { text: "Slow inhale through your nose.", durationMs: 8000, kind: "breath" },
      { text: "Long exhale through your mouth. All the way out.", durationMs: 14000, kind: "breath" },
      { text: "Soften your face. Let the muscles around your eyes go.", durationMs: 12000, kind: "posture" },
      { text: "One more long exhale. Slower than the inhale before it.", durationMs: 14000, kind: "breath" }
    ],
    fitness: {
      feelStates: ["angry", "anxious", "mixed"],
      bioFilters: ["activated", "clear"],
      signalAreas: ["jaw", "neck", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["porges-vagal", "levine-somatic"]
  },

  // ─── 2. Activated + chest signal — long exhale focus ─────────────────
  {
    id: "long-exhale-chest-60s",
    durationMs: 60000,
    prompts: [
      { text: "Drop your shoulders. Let them fall.", durationMs: 8000, kind: "posture" },
      { text: "Inhale slowly through your nose. Count to four.", durationMs: 10000, kind: "breath" },
      { text: "Exhale through pursed lips. Count to eight. Let it all out.", durationMs: 14000, kind: "breath" },
      { text: "Notice your chest. The pressure changes between inhale and exhale.", durationMs: 12000, kind: "attention" },
      { text: "One more cycle. Inhale four, exhale eight.", durationMs: 16000, kind: "breath" }
    ],
    fitness: {
      feelStates: ["anxious", "angry", "mixed"],
      bioFilters: ["activated"],
      signalAreas: ["chest", "shoulders", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["porges-vagal", "levine-somatic"]
  },

  // ─── 3. Anxious + general — orienting + grounding ────────────────────
  {
    id: "orient-and-ground-90s",
    durationMs: 90000,
    prompts: [
      { text: "Open your eyes wide. Take in the whole room.", durationMs: 12000, kind: "attention" },
      { text: "Find five things you can see. Name each one in your head.", durationMs: 18000, kind: "attention" },
      { text: "Press your feet flat into the floor.", durationMs: 12000, kind: "pressure" },
      { text: "Notice the temperature where your skin meets the air.", durationMs: 14000, kind: "temperature" },
      { text: "Long exhale. Drop your shoulders.", durationMs: 12000, kind: "breath" },
      { text: "One more thing you can see. Just one.", durationMs: 12000, kind: "attention" },
      { text: "You're here. You're in the room.", durationMs: 10000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["anxious", "mixed"],
      bioFilters: ["activated", "sleep-deprived", "clear"],
      signalAreas: ["chest", "stomach", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["sokolov-orienting", "levine-somatic"]
  },

  // ─── 4. Stuck / flat + general — activation move ─────────────────────
  {
    id: "activate-from-flat-60s",
    durationMs: 60000,
    prompts: [
      { text: "Stand up if you're sitting. Sit up straight if you can't stand.", durationMs: 8000, kind: "posture" },
      { text: "Roll your shoulders back three times. Slow.", durationMs: 10000, kind: "posture" },
      { text: "Press your hands together for five seconds.", durationMs: 8000, kind: "pressure" },
      { text: "Quick inhale through the nose. Two short ones.", durationMs: 8000, kind: "breath" },
      { text: "Slow exhale through the mouth.", durationMs: 12000, kind: "breath" },
      { text: "Notice anything sharper now than thirty seconds ago.", durationMs: 14000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["flat", "stuck"],
      bioFilters: ["depleted", "clear"],
      signalAreas: ["general", "shoulders"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["sokolov-orienting"]
  },

  // ─── 5. Depleted + steady — gentle re-up without push ────────────────
  {
    id: "gentle-titration-depleted-60s",
    durationMs: 60000,
    prompts: [
      { text: "Sit somewhere supported. Let the chair hold you.", durationMs: 12000, kind: "posture" },
      { text: "Slow inhale. Soft, not big.", durationMs: 10000, kind: "breath" },
      { text: "Slow exhale. Longer than the inhale.", durationMs: 12000, kind: "breath" },
      { text: "Notice one place in your body that feels okay. Just one.", durationMs: 14000, kind: "attention" },
      { text: "Stay there for three breaths.", durationMs: 12000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["flat", "stuck", "mixed", "clear"],
      bioFilters: ["depleted", "sleep-deprived", "hormonal", "pain"],
      signalAreas: ["general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["levine-somatic", "porges-vagal"]
  },

  // ─── 6. Quick downregulate — fastest path (~30s) ─────────────────────
  {
    id: "quick-downregulate-30s",
    durationMs: 30000,
    prompts: [
      { text: "Two short inhales through the nose.", durationMs: 6000, kind: "breath" },
      { text: "One long exhale through the mouth. Slow.", durationMs: 12000, kind: "breath" },
      { text: "Drop your shoulders.", durationMs: 6000, kind: "posture" },
      { text: "One more cycle. Two in, one long out.", durationMs: 6000, kind: "breath" }
    ],
    fitness: {
      feelStates: ["angry", "anxious", "mixed", "stuck"],
      bioFilters: ["activated", "clear"],
      signalAreas: ["chest", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["porges-vagal"]
  },

  // ─── 7. Pre-event prep — implementation intention reset ──────────────
  {
    id: "pre-event-reset-60s",
    durationMs: 60000,
    prompts: [
      { text: "Press your feet flat. Both at once.", durationMs: 10000, kind: "pressure" },
      { text: "One long exhale. Empty your chest.", durationMs: 12000, kind: "breath" },
      { text: "Roll your shoulders back. Hold them open.", durationMs: 10000, kind: "posture" },
      { text: "Slow inhale. Slow exhale longer.", durationMs: 14000, kind: "breath" },
      { text: "You're ready. Walk in slow.", durationMs: 14000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["focused", "anxious", "mixed", "clear"],
      bioFilters: ["clear", "activated"],
      signalAreas: ["chest", "shoulders", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["gollwitzer-implementation", "porges-vagal"]
  },

  // ─── 8. Post-event recovery — completion of discharge ────────────────
  {
    id: "post-event-discharge-90s",
    durationMs: 90000,
    prompts: [
      { text: "Shake out your hands. Let them go loose.", durationMs: 10000, kind: "posture" },
      { text: "Roll your neck slowly side to side.", durationMs: 14000, kind: "posture" },
      { text: "One long exhale. All the way out.", durationMs: 14000, kind: "breath" },
      { text: "Notice where you held tension during the thing. Don't fix it. Just notice.", durationMs: 14000, kind: "attention" },
      { text: "Another long exhale. Slower.", durationMs: 14000, kind: "breath" },
      { text: "Let your jaw open slightly.", durationMs: 12000, kind: "posture" },
      { text: "It's over. You're back.", durationMs: 12000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["mixed", "stuck", "flat", "clear"],
      bioFilters: ["activated", "depleted", "clear"],
      signalAreas: ["jaw", "shoulders", "neck", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["levine-somatic", "porges-vagal"]
  },

  // ─── 9. Foggy / cognitive load — orienting + breath ──────────────────
  {
    id: "fog-clear-orienting-60s",
    durationMs: 60000,
    prompts: [
      { text: "Look up. Find a point on the ceiling or sky.", durationMs: 10000, kind: "attention" },
      { text: "Track your eyes slowly to the left. Then back.", durationMs: 14000, kind: "attention" },
      { text: "Track slowly to the right. Then back.", durationMs: 14000, kind: "attention" },
      { text: "Two short inhales. One long exhale.", durationMs: 10000, kind: "breath" },
      { text: "Notice the room is quieter than it was thirty seconds ago.", durationMs: 12000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["flat", "stuck", "mixed", "anxious"],
      bioFilters: ["sleep-deprived", "hormonal", "depleted", "clear"],
      signalAreas: ["general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["sokolov-orienting", "porges-vagal"]
  },

  // ─── 10. Body-first universal — for users without a clear state ──────
  {
    id: "body-first-universal-60s",
    durationMs: 60000,
    prompts: [
      { text: "Press your feet flat into the floor.", durationMs: 10000, kind: "pressure" },
      { text: "Notice the temperature of the air on your skin.", durationMs: 12000, kind: "temperature" },
      { text: "Slow inhale through your nose.", durationMs: 10000, kind: "breath" },
      { text: "Long exhale through your mouth.", durationMs: 14000, kind: "breath" },
      { text: "Open your gaze. Take in the room.", durationMs: 14000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["clear", "mixed", "focused", "stuck", "flat", "angry", "anxious"],
      bioFilters: ["clear", "activated", "depleted", "sleep-deprived"],
      signalAreas: ["general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["sokolov-orienting", "porges-vagal", "levine-somatic"]
  }
];

// Lookup helper. Returns null if id not found.
export const getSequenceById = (id) => {
  if (!id) return null;
  return MOVE_CARD_LIBRARY.find(s => s.id === id) || null;
};

// Deterministic selection — used by Phase 8b's selection function as the
// fallback path when AI is unavailable. Filter by feelState, narrow by
// bioFilter, exclude recently-shown sequences, then pick the first
// remaining (or a wraparound if nothing left).
//
// Per audit Option B (audit §2): the selection itself is the adaptive
// layer. The library content is locked-science. AI selection is preferred
// when available (Phase 8b backend); this function is the offline-safe
// floor.
//
// state shape: { feelState, bioFilter, signalArea, timeOfDay }
// recentMoveIds: array of sequenceIds shown in last few invocations
export const selectByDeterministicRule = (state = {}, recentMoveIds = []) => {
  const feelState = state.feelState || null;
  const bioFilter = Array.isArray(state.bioFilter) ? state.bioFilter : (state.bioFilter ? [state.bioFilter] : []);
  const signalArea = state.signalArea || null;

  // Filter pipeline: feelState → bioFilter → signalArea → not-recent.
  // Each filter is best-effort: if no candidate matches, fall through to
  // the broader pool rather than returning null. The library always has
  // a universal sequence (id #10) that matches every state combination.
  let pool = MOVE_CARD_LIBRARY;

  if (feelState) {
    const filtered = pool.filter(s => s.fitness.feelStates.includes(feelState));
    if (filtered.length > 0) pool = filtered;
  }

  if (bioFilter.length > 0) {
    const filtered = pool.filter(s => bioFilter.some(b => s.fitness.bioFilters.includes(b)));
    if (filtered.length > 0) pool = filtered;
  }

  if (signalArea) {
    const filtered = pool.filter(s => s.fitness.signalAreas.includes(signalArea));
    if (filtered.length > 0) pool = filtered;
  }

  // Exclude recent unless that empties the pool.
  if (recentMoveIds.length > 0) {
    const filtered = pool.filter(s => !recentMoveIds.includes(s.id));
    if (filtered.length > 0) pool = filtered;
  }

  // Pick a stable choice — first remaining. Shuffled selection is the AI
  // path's job (Phase 8b backend); the deterministic fallback prefers
  // predictability so users in repeat-fallback scenarios at least see the
  // same sequence and can recognize it.
  return pool[0] || MOVE_CARD_LIBRARY[MOVE_CARD_LIBRARY.length - 1];
};
