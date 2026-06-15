# SPEC-VS-LIVE AUDIT — June 15 2026

**Purpose:** honest map of what is specified vs. what is actually built, wired, and reachable in live code. Produced as a reading-and-verifying pass against `src/v2/` + `netlify/functions/`, not from memory. Triggered by Arlin's concern that "none of the documented scope has been implemented" — which the audit does NOT bear out: the app is overwhelmingly built and wired. The "nothing's there" feeling traced to the HOME SCREEN being broken + stripped of its concierge (fixed this session, commit ffee465), not missing features.

## Method
Each major spec checked for: (1) does its artifact exist in code, (2) is it wired/imported, (3) is it reachable by a user. Verified by grep + file inventory against live source.

## BUILT + WIRED + REACHABLE (verified live)
- **Core loop** (CORE_LOOP_SPEC) — `netlify/functions/reframe.js` emits `mode:extract`/`mode:work` with `taken_apart`{verified,assumed}/`shape`/`rebuilt`/`bet`; `src/v2/lib/reframeApi.js` parses the full contract; `src/v2/screens/spine/Reframe.jsx` renders TAKEN APART / THE SHAPE / REBUILT blocks (sage/oxblood tags). De-mirrored doctrine LIVE.
- **Concierge cluster** (CONCIERGE_CLUSTER_SPEC) — `mirror.js`, `mediationApi.js`, MediationQueue, trajectory, thread. Restored to home this session (composed with the live naming surface).
- **Workshop** — ALL 7 instruments built (`src/v2/lib/instruments/`: cdquest, sris, erq, maia2, iri, mcq30, dospert) + reachable via `Library.jsx` Workshop section.
- **Precision Framework** — `predictionErrors.js`, `predictionLog.js`, `PredictionErrorMirror.jsx`, `WhatYouBetOnMirror.jsx`, `RiskProfileMirror.jsx`; reachable from `MyProgress.jsx`.
- **Spine forks** — Notice → Reframe → Close + Move + Reset + Scripts + SelfReframe + WindDown; all reachable in the `Spine.jsx` state machine.
- **Accounts + backup** (ACCOUNTS_ARC) — `authApi.js` (email OTP), `backupApi.js` (save/list/restore to Supabase), `backupAuto.js` (version-gated + opportunistic; requires sign-in).
- **Profiles** — Context, Trigger, Bias, Capacities mirrors; all routed in AppV2 (18 routed screens total).
- **Settings, Crisis Resources, Roadmap, Paywall, FAQ** — all routed + reachable.

## BUILT but NOT WIRED (correctly pending Arlin's decision)
- **Step Out disruptor** (PATTERN_DISRUPTION) — `patternInterrupt.js` engine + `StepOutOverlay.jsx` exist and are complete, but NOTHING imports/triggers them (verified: no import outside their own files). This is CORRECT — the detection→offer trigger flow (re-fire window, transparency depth, AI-cost pre-filter, body-first variant) is Arlin's undecided §7 design call. The experience is ready; it needs the trigger decision to go live.

## NOT BUILT (correctly blocked on Arlin's decisions)
- **Cognitive Function Measurement** (COGNITIVE_FUNCTION_MEASUREMENT_SPEC) — no live artifact. Matches the spec's Phase-1 audit: 4 decisions need Arlin's sign-off (naming, authoring affect-labeling stimuli, screen surface vs Self Mode, AI rubric) before Sprint 1 starts. Blocks Practice Signals.

## DRIFT FOUND + CORRECTED (this session)
- **STILLFORM_DESIGN_SYSTEM.md** described the REJECTED D1 "Synthesis" direction as current: "Fraunces display · Inter body" and "ground #221C15 / brass #C9A45C." Live tokens are Cormorant Garamond · DM Sans · ground #08080A · accent #B8862B (the locked prestige spec, restored this session after D1's wrong swap). Corrected to live truth with dated notes. The doc's STRUCTURE (trace/arbor/marginalia/accent-law) remains accurate and live.
- **CORE_LOOP_SPEC.md** said the extract question "renders as the Fraunces question" — corrected to Cormorant.
- NON-issues (left as-is, accurate): AUDIT_WHAT_WAS_LOST.md and PRESTIGE_SPEC mention Fraunces correctly (documenting the mistake / a font-pricing comparison).

## HOME SCREEN (resolved this session)
The live home was a primer ("Today opens here" → tap → separate Notice screen) — the "announce then hand off" pattern the archive calls architecturally wrong. Fixed: home now renders the concierge layer composed WITH the live naming surface inline (commit ffee465). You open the app and land in the practice, ready to name, with the smart layer above.

## BOTTOM LINE
The documented scope is overwhelmingly implemented. Two genuinely-incomplete items (Step Out trigger flow, Cognitive Function Measurement) are both correctly waiting on Arlin's design decisions — not dropped, not forgotten. The remaining-scope list is short and decision-gated, not build-gated.
