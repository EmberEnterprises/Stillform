// Move Card Library — Engagement Architecture Engine 2, Build #8 Phase 8a
// Per MOVE_CARD_FLOW_AUDIT.md (May 8) §3a default + §6 call 2 (Arlin + Claude
// pair-author against PATTERN_DISRUPTION_SPEC §4.2 mechanisms).
//
// STATUS: DRAFT LIBRARY. 22 sequences (10 shipped May 8 Phase 8a + 12 added
// May 14 to fill identified coverage gaps). Audit recommends 25-30 in
// production; this draft is within the target band. Arlin reviews each
// sequence against PATTERN_DISRUPTION_SPEC §4.2 before Move card surfaces
// ship to deploy. Each sequence is hand-tagged with the primary science
// mechanism it operationalizes — same locked science PATTERN_DISRUPTION_SPEC
// §4.2 grounds Disruptor in:
//   - Sokolov 1963: orienting response (novel stimulus captures attention,
//     breaking the loop)
//   - Porges polyvagal theory: vagal-tone-engaging moves downregulate
//     sympathetic activation (long exhales, jaw release, soft gaze)
//   - Levine somatic experiencing: completing thwarted fight/flight via
//     discharge moves (full exhale, tension-and-release, titration)
//   - Gollwitzer 1999 implementation intentions: "if X then Y" moves
//     pre-committed reduce execution cost under load
//
// COVERAGE GAPS THE MAY 14 ADDITIONS FILL (each gap → sequence number):
//   - hands signalArea uncovered → #11 hands-grip-release-45s
//   - stomach signalArea undercovered → #12 gut-soothe-anxious-60s
//   - pain bioFilter only general-covered → #13 pain-aware-breath-90s
//   - hormonal bioFilter only general-covered → #14 hormonal-soft-90s
//   - angry feelState without sharing slot → #15 anger-discharge-60s
//   - stuck without somatic anchor option → #16 cognitive-anchor-stuck-60s
//   - focused state with no sharpening variant → #17 focused-sharpening-45s
//   - evening timeOfDay uncovered → #18 late-night-winddown-90s
//   - morning timeOfDay uncovered → #19 morning-prime-45s
//   - no public-space discreet variant → #20 discreet-public-60s
//   - PATTERN_DISRUPTION_SPEC §4.2 names "counter-rhythm breath" but no
//     sequence enacted it → #21 counter-rhythm-breath-60s
//   - shoulders signalArea covered only via stacking → #22 shoulders-deep-yoke-60s
//
// FITNESS TAXONOMY (used by selection function below + AI selector backend):
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
  },

  // ─── 11. Hands tension — grip-release for keyboard/gripping users ─────
  // Levine tension-release cycle. Hands often hold loop-time stress that
  // never gets discharged; explicit clench-release gives the discharge a
  // path. Brief (45s) so it fits between calls or between writing sessions.
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
  // Hand-on-belly is direct interoceptive cue; the contact gives the user
  // a felt reference point that the breath is reaching the belly (Porges
  // vagal — diaphragmatic engagement). Specifically designed for stomach
  // signal which was only side-covered before.
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
  // Pain bioFilter was only general-covered by #5. This sequence is
  // pain-FIRST design: no posture changes, no pressure cues, no
  // temperature shifts. Breath and attention only. Porges vagal via long
  // exhale — accessible even when most movement isn't.
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
  // Hormonal disruption (premenstrual, perimenopausal, postpartum, thyroid
  // flare) can come with jaw clenching that's painful to engage and
  // sensory hypersensitivity. This sequence is the slowest in the library,
  // avoids any sharp posture shifts, and is breath-anchored with soft
  // attention. Levine titration applied to non-pain states.
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
  // Levine: anger held without discharge runs the loop. This sequence
  // gives anger a structured physical path — feet pressure (grounding) +
  // hand shake (discharge) + loud exhale + jaw open. Not catharsis; not
  // "let it all out" — bounded discharge that completes thwarted activation.
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
  // When stuck cognitively, more thinking deepens the loop. Sokolov
  // orienting response: external sensation interrupts internal repetition.
  // Explicit "stop trying to figure it out" framing because the stuck
  // state's tendency is to push harder on the thinking.
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
  // Different from #7 pre-event reset, which moves toward composure.
  // Focused-sharpening is for the user already in flow who wants to
  // re-anchor mid-task without dropping out of the state. Shorter (45s).
  // Maintains the activation rather than dissipating it.
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
  // Evening timeOfDay was uncovered. This sequence is the opposite of
  // morning-prime: longer (90s), softer, eyes can close. Porges vagal via
  // extended exhale. Closing line acknowledges the day is over — Gollwitzer
  // implementation: pre-committed "if it's late, then this" reduces the
  // execution cost of stopping the day.
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
  // Morning timeOfDay was uncovered. Sharp, short (45s), bright. Sokolov
  // orienting via "look up / take in light" — visual orientation outward
  // shifts attention from internal residue of sleep to external present.
  // Counter-shape to late-night winddown.
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
  // All-internal sequence. No visible movement. The user can run this
  // mid-meeting without anyone noticing. Porges vagal via nasal breathing
  // and jaw release "behind the closed mouth". Critical for the user-types
  // who need composure tools in environments where breaking attention
  // visibly carries social cost.
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
  // PATTERN_DISRUPTION_SPEC §4.2 explicitly names "counter-rhythm breath:
  // A breath pattern deliberately *unlike* the user's default and unlike
  // whatever they've been doing recently. Novelty in the breath itself."
  // No prior sequence enacted this. Sokolov orienting via novel rhythm.
  // Deliberately NOT a named pattern (box, 4-7-8) — those live in Breathe
  // tool and would compete.
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
  // Existing sequences touch shoulders incidentally; this one targets the
  // shoulder-yoke specifically with a Levine tension-release cycle (lift,
  // hold, drop) before the postural opening. Useful for users who carry
  // load in the upper traps and rhomboids — desk workers, parents, anyone
  // bracing through their shoulders.
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
  }
];

// Lookup helper. Returns null if id not found.
export const getSequenceById = (id) => {
  if (!id) return null;
  return MOVE_CARD_LIBRARY.find(s => s.id === id) || null;
};

// Deterministic selection — used by Phase 8b's selection function as the
// fallback path when AI is unavailable. Filter by feelState, narrow by
// bioFilter, narrow by signalArea, narrow by timeOfDay, exclude recently-
// shown sequences, then pick the first remaining (or a wraparound if
// nothing left).
//
// Per audit Option B (audit §2): the selection itself is the adaptive
// layer. The library content is locked-science. AI selection is preferred
// when available (Phase 8b backend); this function is the offline-safe
// floor.
//
// timeOfDay filter (added May 14 alongside library expansion to 22): a
// sequence's fitness.timeOfDay = "any" passes for every input timeOfDay;
// a specific value ("morning"/"midday"/"evening") only passes for that
// exact bucket. The library always has timeOfDay:"any" sequences in every
// state combination, so this filter never empties the pool to nothing.
//
// state shape: { feelState, bioFilter, signalArea, timeOfDay }
// recentMoveIds: array of sequenceIds shown in last few invocations
export const selectByDeterministicRule = (state = {}, recentMoveIds = []) => {
  const feelState = state.feelState || null;
  const bioFilter = Array.isArray(state.bioFilter) ? state.bioFilter : (state.bioFilter ? [state.bioFilter] : []);
  const signalArea = state.signalArea || null;
  const timeOfDay = state.timeOfDay || null;

  // Filter pipeline: feelState → bioFilter → signalArea → timeOfDay → not-recent.
  // Each filter is best-effort: if no candidate matches, fall through to
  // the broader pool rather than returning null. The library always has
  // a universal sequence (id #10) that matches every state combination
  // and is timeOfDay:"any", so the floor is always non-empty.
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

  if (timeOfDay) {
    const filtered = pool.filter(s => s.fitness.timeOfDay === "any" || s.fitness.timeOfDay === timeOfDay);
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
