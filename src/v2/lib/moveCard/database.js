// Move Card Database — Stillform Phase 6 (Support Sheet · Disruptors)
//
// SOURCE: the 22 sequences below are the pair-authored (Arlin + Claude) Move
// card library preserved in MOVE_CARD_FLOW_AUDIT.md §10. They originated as
// `src/move-card/library.js` in the prior frontend (deleted in the v2
// rebuild). Their content — prompts, durations, prompt kinds, fitness
// taxonomy, science tags — is LOCKED. Ported here verbatim.
//
// RENAME (per the §10 naming note): constant is MOVE_CARD_DATABASE (was
// MOVE_CARD_LIBRARY) to disambiguate from the user-facing User-Invented Move
// Library (REFRAME_UI_FOUNDATION_SPEC.md). This Database is the curated,
// science-locked source the Support Sheet draws from; the User-Invented Move
// Library is where users save moves they invent. Do not conflate.
//
// PATH: lives under src/v2/lib/moveCard/ (v2 lib convention — mirrors
// src/v2/lib/instruments/) rather than the old build's src/move-card/.
//
// PHASE 6 ADDITION: sequence #23, the freeze-restart move (Master Todo §6) —
// the canonical in-the-moment Disruptor. Appended (the 22 keep their locked
// order); the Support Sheet surfaces it as the headline move via
// FREEZE_RESTART_ID, not array position.
//
// SCIENCE SPINE (somatic-redirection sequences #1–22):
//   - Sokolov 1963: orienting response — novel stimulus captures attention,
//     breaking the loop
//   - Porges polyvagal theory: vagal-tone-engaging moves downregulate
//     sympathetic activation (long exhales, jaw release, soft gaze)
//   - Levine somatic experiencing: completing thwarted fight/flight via
//     discharge moves (full exhale, tension-and-release, titration)
//   - Gollwitzer 1999 implementation intentions: "if X then Y" pre-committed
//     reduces execution cost under load
// SCIENCE SPINE (freeze-restart #23):
//   - Lieberman 2007: affect labeling ("name it" downregulates the amygdala)
//   - Kross 2014: self-distanced self-talk (using your own name)
//   - Beilock: choke/freeze under load — narrowing to one concrete actionable
//     fact restarts stalled execution
//   - Wells 2009 MCT: stepping out of the content to act, not ruminate
//
// FITNESS TAXONOMY:
//   feelStates  — angry / anxious / stuck / flat / mixed / clear / focused
//   bioFilters  — activated / depleted / clear / hormonal / pain / sleep-deprived
//   signalAreas — jaw / neck / chest / shoulders / stomach / hands / general
//   timeOfDay   — morning / midday / evening / any
//
// PROMPT KIND VOCABULARY: pressure | breath | temperature | posture | attention
//
// VOICE: prestige-operator declarative. Second person imperative is fine here
// because these are bodily instructions, not advice. "Press your feet flat"
// not "you might want to try pressing your feet flat." NOT gamified — no
// streak, no count, no score.

export const MOVE_CARD_DATABASE = [
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
  },

  // ─── 11. Hands tension — grip-release for keyboard/gripping users ─────
  {
    id: "hands-grip-release-45s",
    durationMs: 45000,
    prompts: [
      { text: "Make a tight fist with both hands. Hold.", durationMs: 8000, kind: "pressure" },
      { text: "Release. Spread your fingers wide.", durationMs: 8000, kind: "pressure" },
      { text: "Let your hands rest loose. Notice the difference.", durationMs: 10000, kind: "attention" },
      { text: "Slow exhale. Drop the rest with it.", durationMs: 10000, kind: "breath" },
      { text: "Hands soft now. That's the line you can come back to.", durationMs: 9000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["anxious", "mixed", "focused", "stuck"],
      bioFilters: ["activated", "clear"],
      signalAreas: ["hands", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["levine-somatic", "porges-vagal"]
  },

  // ─── 12. Gut signal — belly-hand contact for anxious gut activation ────
  {
    id: "gut-soothe-anxious-60s",
    durationMs: 60000,
    prompts: [
      { text: "Place one hand on your belly. Light contact.", durationMs: 10000, kind: "posture" },
      { text: "Slow inhale. Let your belly press into your hand.", durationMs: 12000, kind: "breath" },
      { text: "Slow exhale. Belly falls under your hand.", durationMs: 14000, kind: "breath" },
      { text: "Another. Same shape.", durationMs: 12000, kind: "breath" },
      { text: "Hand still there. Belly soft.", durationMs: 12000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["anxious", "mixed", "stuck"],
      bioFilters: ["clear", "activated", "hormonal"],
      signalAreas: ["stomach", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["porges-vagal", "levine-somatic"]
  },

  // ─── 13. Pain-aware — breath-only, no movement that could aggravate ───
  {
    id: "pain-aware-breath-90s",
    durationMs: 90000,
    prompts: [
      { text: "Stay where you are. No movement needed.", durationMs: 12000, kind: "attention" },
      { text: "Soft inhale through your nose. Smaller than usual.", durationMs: 14000, kind: "breath" },
      { text: "Soft exhale through your mouth. Longer than the inhale.", durationMs: 16000, kind: "breath" },
      { text: "Find one place that isn't hurting. Rest your attention there.", durationMs: 16000, kind: "attention" },
      { text: "Another soft inhale. Another longer exhale.", durationMs: 16000, kind: "breath" },
      { text: "The breath is here. The pain is here. Both. Just notice.", durationMs: 16000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["flat", "stuck", "mixed", "clear", "anxious"],
      bioFilters: ["pain", "depleted"],
      signalAreas: ["general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["porges-vagal"]
  },

  // ─── 14. Hormonal-soft — no sharp transitions, no jaw moves ───────────
  {
    id: "hormonal-soft-90s",
    durationMs: 90000,
    prompts: [
      { text: "Sit or lie where you're held. Let the surface take your weight.", durationMs: 14000, kind: "posture" },
      { text: "Slow inhale. Not big. Just slow.", durationMs: 14000, kind: "breath" },
      { text: "Slow exhale. Longer.", durationMs: 14000, kind: "breath" },
      { text: "Find one steady thing in your body. Just one.", durationMs: 16000, kind: "attention" },
      { text: "Stay there for two more breaths.", durationMs: 16000, kind: "attention" },
      { text: "You're not asking your system to perform right now.", durationMs: 16000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["flat", "stuck", "mixed", "clear", "anxious"],
      bioFilters: ["hormonal", "depleted", "sleep-deprived"],
      signalAreas: ["general", "stomach"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["porges-vagal", "levine-somatic"]
  },

  // ─── 15. Anger discharge — controlled physical release ────────────────
  {
    id: "anger-discharge-60s",
    durationMs: 60000,
    prompts: [
      { text: "Press both feet hard into the floor. Push.", durationMs: 10000, kind: "pressure" },
      { text: "Hold for five. Then let go.", durationMs: 10000, kind: "pressure" },
      { text: "Shake your hands out. Loose.", durationMs: 10000, kind: "posture" },
      { text: "Long exhale. Loud is fine.", durationMs: 12000, kind: "breath" },
      { text: "Open your jaw. Let it drop.", durationMs: 10000, kind: "posture" },
      { text: "The heat moves. You're still here.", durationMs: 8000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["angry"],
      bioFilters: ["activated", "clear"],
      signalAreas: ["jaw", "hands", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["levine-somatic", "porges-vagal"]
  },

  // ─── 16. Stuck mind — somatic anchor, not more thinking ───────────────
  {
    id: "cognitive-anchor-stuck-60s",
    durationMs: 60000,
    prompts: [
      { text: "Stop trying to figure it out for sixty seconds.", durationMs: 12000, kind: "attention" },
      { text: "Press your feet flat. Notice the floor.", durationMs: 12000, kind: "pressure" },
      { text: "Name three things you can see. Out loud or in a whisper.", durationMs: 14000, kind: "attention" },
      { text: "Slow exhale. Drop the loop with it.", durationMs: 12000, kind: "breath" },
      { text: "Notice you're standing or sitting. That's the anchor.", durationMs: 10000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["stuck", "mixed", "flat"],
      bioFilters: ["clear", "depleted", "sleep-deprived"],
      signalAreas: ["general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["sokolov-orienting", "porges-vagal"]
  },

  // ─── 17. Focused-sharpening — maintain alert state, don't settle ──────
  {
    id: "focused-sharpening-45s",
    durationMs: 45000,
    prompts: [
      { text: "Sit or stand sharp. Spine long.", durationMs: 10000, kind: "posture" },
      { text: "Eyes alert. Take in the whole field.", durationMs: 10000, kind: "attention" },
      { text: "Sharp inhale through the nose.", durationMs: 8000, kind: "breath" },
      { text: "Slow exhale, longer.", durationMs: 10000, kind: "breath" },
      { text: "You're locked in. Stay there.", durationMs: 7000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["focused", "clear"],
      bioFilters: ["activated", "clear"],
      signalAreas: ["general", "shoulders"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["gollwitzer-implementation", "porges-vagal"]
  },

  // ─── 18. Late-night winddown — evening-specific, settle not activate ──
  {
    id: "late-night-winddown-90s",
    durationMs: 90000,
    prompts: [
      { text: "Settle into where you are. Don't sit up straighter for this.", durationMs: 14000, kind: "posture" },
      { text: "Slow inhale through your nose. Soft.", durationMs: 14000, kind: "breath" },
      { text: "Long exhale through your mouth. Longer than the inhale.", durationMs: 16000, kind: "breath" },
      { text: "Let your eyes soften or close. You don't need to track anything.", durationMs: 14000, kind: "posture" },
      { text: "Another long exhale. The day is done.", durationMs: 16000, kind: "breath" },
      { text: "Nothing else needs to happen tonight.", durationMs: 16000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["stuck", "anxious", "mixed", "flat"],
      bioFilters: ["sleep-deprived", "depleted", "clear", "hormonal"],
      signalAreas: ["general"],
      timeOfDay: "evening"
    },
    pathway: "somatic-redirection",
    scienceTags: ["porges-vagal", "levine-somatic", "gollwitzer-implementation"]
  },

  // ─── 19. Morning prime — morning-specific, activate not settle ────────
  {
    id: "morning-prime-45s",
    durationMs: 45000,
    prompts: [
      { text: "Open your shoulders. Lift your chest.", durationMs: 10000, kind: "posture" },
      { text: "Look up. Take in light.", durationMs: 8000, kind: "attention" },
      { text: "Sharp inhale. Two short pulls.", durationMs: 8000, kind: "breath" },
      { text: "Long slow exhale.", durationMs: 10000, kind: "breath" },
      { text: "You're awake. The day is here.", durationMs: 9000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["flat", "stuck", "mixed", "clear", "focused"],
      bioFilters: ["sleep-deprived", "depleted", "clear"],
      signalAreas: ["general", "shoulders"],
      timeOfDay: "morning"
    },
    pathway: "somatic-redirection",
    scienceTags: ["sokolov-orienting", "porges-vagal"]
  },

  // ─── 20. Discreet-public — invisible to others, for meetings/desk ─────
  {
    id: "discreet-public-60s",
    durationMs: 60000,
    prompts: [
      { text: "Feet flat under your chair. Nobody sees this.", durationMs: 12000, kind: "pressure" },
      { text: "Let your jaw release behind your closed mouth.", durationMs: 12000, kind: "posture" },
      { text: "Slow inhale through your nose. Quiet.", durationMs: 12000, kind: "breath" },
      { text: "Slow exhale through your nose. Longer.", durationMs: 12000, kind: "breath" },
      { text: "Soften your gaze. Stay in the room.", durationMs: 12000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["angry", "anxious", "mixed", "stuck", "focused"],
      bioFilters: ["activated", "clear"],
      signalAreas: ["jaw", "chest", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["porges-vagal"]
  },

  // ─── 21. Counter-rhythm breath — §4.2 named, was unenacted ────────────
  {
    id: "counter-rhythm-breath-60s",
    durationMs: 60000,
    prompts: [
      { text: "Notice the rhythm you're breathing in right now.", durationMs: 12000, kind: "attention" },
      { text: "Change it. Shorter inhale than usual.", durationMs: 12000, kind: "breath" },
      { text: "Pause at the top. Two seconds.", durationMs: 10000, kind: "breath" },
      { text: "Longer exhale than the inhale. Doubled.", durationMs: 14000, kind: "breath" },
      { text: "Pause at the bottom. Two seconds. Then repeat.", durationMs: 12000, kind: "breath" }
    ],
    fitness: {
      feelStates: ["anxious", "stuck", "mixed", "angry"],
      bioFilters: ["clear", "activated"],
      signalAreas: ["chest", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["sokolov-orienting", "porges-vagal"]
  },

  // ─── 22. Shoulders-deep yoke release — shoulders-signal specific ──────
  {
    id: "shoulders-deep-yoke-60s",
    durationMs: 60000,
    prompts: [
      { text: "Lift both shoulders up to your ears. Hold.", durationMs: 10000, kind: "posture" },
      { text: "Hold for five. Tight.", durationMs: 8000, kind: "pressure" },
      { text: "Drop them hard. Let them fall.", durationMs: 10000, kind: "posture" },
      { text: "Roll back. Open the chest.", durationMs: 10000, kind: "posture" },
      { text: "Long exhale. Stay open.", durationMs: 12000, kind: "breath" },
      { text: "Shoulders softer now than thirty seconds ago.", durationMs: 10000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["anxious", "stuck", "mixed", "angry"],
      bioFilters: ["activated", "depleted", "clear"],
      signalAreas: ["shoulders", "neck", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["levine-somatic", "porges-vagal"]
  },

  // ─── 23. Freeze-restart — Phase 6 addition (Master Todo §6) ───────────
  // The canonical in-the-moment Disruptor: a cognitive restart for freeze
  // under load, not a somatic down-regulation. Physiological sigh →
  // affect label → self-distance → one actionable fact. ~30 sec.
  {
    id: "freeze-restart-30s",
    durationMs: 34000,
    prompts: [
      { text: "Two inhales through your nose — a full one, then a short sip on top. Then a long exhale through your mouth.", durationMs: 12000, kind: "breath" },
      { text: "Name it silently: \"I'm frozen.\" That's all. Just name it.", durationMs: 7000, kind: "attention" },
      { text: "Say your own name to yourself, then ask: what do you actually know right now?", durationMs: 8000, kind: "attention" },
      { text: "One fact. Not the whole problem — the first true thing you can act on. Name it.", durationMs: 7000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["stuck", "anxious", "mixed"],
      bioFilters: ["activated", "clear"],
      signalAreas: ["chest", "general"],
      timeOfDay: "any"
    },
    pathway: "freeze-restart",
    scienceTags: ["lieberman-affect-label", "kross-self-distance", "beilock-choke", "wells-mct"]
  }
];

// The canonical headline Disruptor surfaced first by the Support Sheet.
// Decoupled from array order so the locked 22 keep their position.
export const FREEZE_RESTART_ID = "freeze-restart-30s";

// Lookup helper. Returns null if id not found.
export const getSequenceById = (id) => {
  if (!id) return null;
  return MOVE_CARD_DATABASE.find((s) => s.id === id) || null;
};

// Deterministic selection — offline-safe floor (AI selection is a later
// enhancement gated on the detection layer, out of Phase 6 scope). Filter by
// feelState → bioFilter → signalArea → timeOfDay → not-recent; each filter is
// best-effort (falls through to the broader pool rather than emptying it).
// The universal sequence (#10, body-first) matches every state combination
// and is timeOfDay:"any", so the pool is never empty.
//
// state shape: { feelState, bioFilter, signalArea, timeOfDay }
// recentMoveIds: array of sequence ids shown in last few invocations
export const selectByDeterministicRule = (state = {}, recentMoveIds = []) => {
  const feelState = state.feelState || null;
  const bioFilter = Array.isArray(state.bioFilter)
    ? state.bioFilter
    : state.bioFilter
    ? [state.bioFilter]
    : [];
  const signalArea = state.signalArea || null;
  const timeOfDay = state.timeOfDay || null;

  let pool = MOVE_CARD_DATABASE;

  if (feelState) {
    const filtered = pool.filter((s) => s.fitness.feelStates.includes(feelState));
    if (filtered.length > 0) pool = filtered;
  }

  if (bioFilter.length > 0) {
    const filtered = pool.filter((s) => bioFilter.some((b) => s.fitness.bioFilters.includes(b)));
    if (filtered.length > 0) pool = filtered;
  }

  if (signalArea) {
    const filtered = pool.filter((s) => s.fitness.signalAreas.includes(signalArea));
    if (filtered.length > 0) pool = filtered;
  }

  if (timeOfDay) {
    const filtered = pool.filter((s) => s.fitness.timeOfDay === "any" || s.fitness.timeOfDay === timeOfDay);
    if (filtered.length > 0) pool = filtered;
  }

  if (recentMoveIds.length > 0) {
    const filtered = pool.filter((s) => !recentMoveIds.includes(s.id));
    if (filtered.length > 0) pool = filtered;
  }

  // Stable choice — first remaining (predictable on repeat fallback).
  return pool[0] || MOVE_CARD_DATABASE[MOVE_CARD_DATABASE.length - 1];
};
