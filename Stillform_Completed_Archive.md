# STILLFORM COMPLETED ARCHIVE

Items removed from `Stillform_Master_Todo.md` during the May 6, 2026 refactor and items completed in earlier sessions. Source of truth for *what shipped when*. Chronological, newest first.

---

## Completed — May 28, 2026 (Pattern-Change Engine + Quick-move flow)

Long autonomous session. **Deploy pending — Arlin triggers Netlify (manual, two-step); reframe.js changed, so refresh twice for the function + service worker.** Recurring theme: the repo ran ahead of the working context several times (work built earlier in-session, dropped from compaction summaries, surfaced as uncommitted or already-committed) — each was verified fresh against spec before building, so nothing was duplicated. Reading-before-writing is what kept it clean.

**Pattern-Change Engine — the noticing→changing conversion half (ran before Phase 6.2):**
- **PCE.1 — Structured Reframe close** (`f07d0ed` UI/wiring + `9f329fb` persistence). After the takeaway, the close gains next-move (Gollwitzer implementation intention, free text, skippable) → lock-in (Bandura, one-tap commit, skippable); both persisted to the session record + surfaced to the AI. UI/wiring was built earlier in-session but sitting uncommitted — verified + recovered.
- **PCE.2 — Reconsolidation loop** (`6f06433`). reframe.js gains a gated reactivate-and-update instruction: on a recurring thread with a real prior frame, the AI brings back "last time you landed on X — does that still hold?" and updates it rather than starting cold (Ecker/Schiller/Lane). Gated on a real frame being present; zero-fabrication, reflect-don't-score. No client change (frames already flow via formatRecentSessionsForAI).
- **PCE.3 — Degradation layer** (`27a8681`). Named, always-on reframe.js block unifying the distributed loop-handling + adding the self-verdict catch: analysis tipping into "I've always… / I'll never change / that's just who I am" or tired over-analysis past usefulness → never validate the verdict (framing law: plasticity is the premise), name it as the loop's output, redirect to body/close (Wells MCT; Hitchcock 2024).

**Phase 6.2 — Support Sheet · Move card (first live tool):**
- **6.2a — MoveRunner** (`25fb5f2`). Timed Move-card sequence player, models BreathingSession; prompt text + per-prompt countdown + progress bar, End early; decoupled (onComplete/onExit).
- **6.2b + 6.2c** (`384adfe`, built earlier in-session, verified fresh). `select.js` (chip→feelState deterministic selection, never null) + `MoveCard.jsx` (selection → runner → ungamified dual-exit reflection) + Notice "Quick move ›" ungated fork + Spine `move` routing. Handoff = dual exit ("Keep going ›" → reframe-if-named-else-notice / "Done for now" → exit); body-first → cognitive, per the Apr 27 breathe-and-ground precedent.
- **6.2d — History + telemetry** (`bd58663`). `stillform_move_card_history` (plain v2 store; the v1 SYNC/SECURE_KEYS registries are N/A by the v2 convention); selection excludes recent ids (no back-to-back repeat); Plausible Move Started / Completed / Ended Early. History, not a score.

**Phase 6.3 — Reset surface (urge-surf), the Support Sheet's second tool:**
- **6.3a — Reset component** (`baa7c96`). `src/v2/screens/spine/Reset.jsx`: name the pull (affect-label) → watch ~22s without acting (timed interoception; Marlatt urge-surfing — the freeze-restart pattern adapted for compulsion) → decide act-or-don't (two neutral exits, never scored). Self-contained: onDone / onExit / onDoMove. Not gamified; stores nothing.
- **6.3b — Entry + routing** (`9837908`, **two-fork model — Arlin's call over the chooser**, after I revised my own recommendation: 6.4 enters as its own beat and 6.5 rides out at Close, so neither comes through a Notice fork — the chooser's scaling advantage was weak and it would have added a tap + changed shipped 6.2). Notice gains a sibling "Reset an urge ›" fork (ungated) beside "Quick move ›"; Spine `opts.reset` → `reset` step → Reset. Quick move unchanged. Cross-route: Reset "Do a move instead ›" → switches to the move step (MoveCard) — the spec's route-to-Move.
- **6.3 checklist:** Science Sheet — **added** an Urge-Surfing entry (Marlatt / Bowen MBRP / Lieberman). Plausible — Reset Started / Reset to Move. Privacy — Reset stores nothing (no new data). Tutorial — N/A (no v2 system). FAQ — pending the FAQ screen.

**Ship-checklist notes (v2 reality):** Tutorial — N/A (no tutorial/onboarding system exists in v2). FAQ — the FAQ screen isn't built in v2 yet (planned, "joins later" per AppV2); quick-move FAQ entry tracked as pending that screen. Privacy — no new data category (local usage history, same class as session history; covered by existing local-data language). Science — the move sequences' science is already in database.js + Science Sheet (Porges / Levine / Sokolov / Lieberman / Kross / Wells); the flow adds no new science. AI prompts — PCE.2 + PCE.3 changed reframe.js prompts (logged above). Plausible — events added.

---

## Completed — May 14, 2026 (late evening session)

Long-session Claude · Arlin called the session done at the end due to Claude degradation (fabrication, over-stripping, inversion of stated direction). Transfer prompt written for next session. PRs landed during this session:

- **PR #88** · Move May 14 evening session summary out of Master Todo into Completed Archive. 62 lines moved, symmetric diff.
- **PR #89** · Pull six shipped-session records out of Master Todo into Completed Archive (this was completed by a parallel context earlier in the evening; discovered mid-session). 369 lines out of Master Todo, 375 into Archive.
- **PR #90** · Delete two stale AI docs (`AI_PROMPT_FRAMING_AUDIT.md`, `AI_REGRESSION_RESULTS_MAY_7.md`). 434 lines removed. 69 → 67 root `.md` files.
- **PR #91** · Practice Evidence Sprint 1 deliverable. (a) `STIMULI_DRAFT.md` v2 with cultural inclusion + moral/ethical/cultural-difference triggers + non-moralizing rubric (60 affect-labeling + 30 defusion entries, 547 lines). (b) `stimuli.js` runtime data file. (c) `PracticeEvidenceRatification.jsx` — phone-batched ratification UI accessible from Settings → More → Stimulus Library Review. Status: stimuli library awaits Arlin's content review pass (90 entries to rate). Output is copyable JSON that converts to validated set for Sprint 2.
- **PR #92** · Home renders `Complete setup →` CTA when `regType` is null instead of returning blank. Symptom fix; root cause of how `regType` reaches null after onboarding still wants tracing — `finalizeOnboarding()` has a safety-net default to `thought-first`, so the null state shouldn't be reachable from a clean flow.
- **PR #93** · `Skip ↑` button on morning check-in + main hero visible when check-in collapsed + My Progress stat panel restored to home. **ARCHITECTURALLY WRONG per Arlin's late-evening correction:** the morning check-in is part of the main card / journey arc, not a parallel surface the user dismisses to reveal a separate hero. Needs revisiting in the next session — see Master Todo pending. The My Progress restoration portion of PR #93 is correct and stays.

### Decisions made this session

- Practice Evidence naming locked to **"Practice Evidence"** (Decision 1 of Phase 1 audit).
- Practice Evidence Decision 5 reframed per Arlin's observation that Reframe and Self Mode are now in the same journey: the function check itself lives on a dedicated screen because it's 5–7 min of concentrated work; the entry-point offer can surface from end-of-session inside the spine.
- Practice Evidence Decision 7 rubric ratified as drafted: categorical Distinct / Reworded / Same, no numerical hierarchy. Tracked metric is **distinct count over time**. Explicit framing: measures cognitive flexibility, not moral correctness; flexibility is one valid response among others (radical acceptance is also valid).
- Stimulus library v2 reflects three Arlin directions: (a) add moral / ethical / cultural-difference encounters as their own trigger category; (b) cultural-bias expansion across race / ethnicity / immigration / LGBTQ+ / disability / religious / caregiving / class / gendered / age-stage / collectivist / body diversity axes; (c) non-moralizing rubric.

### Operating-rule reinforcement during this session

- Arlin's questions are NOT positions. When she asks "what do you mean by X?" she is asking, not rejecting. Repeated failure mode this session: Claude interpreted clarifying questions as opposition and fabricated counter-arguments in thinking blocks.
- Arlin reads thinking blocks. Fabricating her positions there is the failure mode she explicitly named.
- Bobby is paper-only on the LLC. Never attribute code changes to him.
- Arlin doesn't code. She edits documents, not App.jsx. Don't blame "her edits" for code regressions.
- Settings is for preferences. Practice content (anchors / triggers / baseline) does NOT belong in My Progress per Arlin's late-evening correction.
- "One element per beat" was an architectural attempt that Arlin partially walked back tonight — she wants My Progress data on home. The morning check-in is part of the main card / journey arc, not a parallel surface. Architecture is still in flux.

---

## Completed — May 14, 2026 (evening session)

### Shipped this session (PRs merged into main, deploy when Arlin triggers Netlify)

- **PR #82 — Home complete restructure.** Six panels removed from home rendering (each preserved with early `return null` so helpers stay available for future use as their own beats):
  1. PRACTICE SURFACE (Patterns mono microline at top)
  2. MIRROR STATUS STRIP ("STAGE 1 · NOTICING · FAST CONCLUSIONS" line)
  3. REP COUNTED BANNER (inside main hero)
  4. JOURNEY REP prompt (inside main hero — "Set your hardware state...")
  5. ANCHOR STRIP (inside main hero — "Bio-filter clear · calibration thought-first")
  6. MY PROGRESS stat panel — replaced with small secondary "Review your progress →" link
  
  What remains on home: greeting + ONE current-beat surface (morning strip OR main hero OR EOD strip per `currentBeat`) + persistent Quick Breathe pill (the explicit stabilization exception, rendered outside the home component) + secondary My Progress link + rare overlays (Stage Transition Ritual, Absence Detection, Spine Intake Modal).

- **PR #83 — Granularity Gym → plain English.** Trigger button "+ Name with precision · granularity gym" → "+ Say it more precisely." Mono caption "GRANULARITY GYM" inside expanded box removed (italic instruction "The most precise word for what's here." was already self-explanatory). Internal feature name preserved in code comments + storage key (`stillform_session_precision`).

- **PR #84 — Reframe Step 2 four quick fixes.**
  1. "PROCESSING PRIMER" jargon label removed; primer line stands alone
  2. WHAT SHIFTED toggle: heading persists when expanded (`▾ What shifted? (optional)` instead of `▾ Hide`)
  3. Unsure chip added to entry-state pickers (Reframe Step 1 entry feel-state + morning check-in mood) — was 9 chips, now 10, parity with post-state picker
  4. `···` overflow trigger gets visible "More" label so it reads as a menu affordance

- **Bio-filter + Not quite right home cleanup (this commit, in this PR).** `BioFilterSuggestion` routing card and "Not quite right →" override hidden from main beat (one-element-per-beat). Logic + state + components preserved for future relocation inside the spine session (when AI proposes a routing, correction affordance lives there, not on home).

### Doc updates this session (this PR, in addition to home cleanup)

- **STILLFORM_CANON.md v1.4** — four new operating rules added to Section 10:
  - One element per beat. Sequential transitions, not stacked panels. (Recursive: applies inside the spine session, not just home. Reframe Step 2's seven stacked surfaces collapse to five sub-beat transitions in same pattern.)
  - Surface gets the practice action; the science name stays in code and docs.
  - Substance before structure. Polish on a hollow flow is worse than no polish.
  - Pointer to ENGAGEMENT_ARCHITECTURE §12 for the substance critique itself.

- **STILLFORM_ENGAGEMENT_ARCHITECTURE.md** — new §12 added: "Substance critique — the AI's job is differentiation, not empathy." Captures the May 14 evening realization that's upstream of every engagement engine. Includes Arlin's words verbatim, the gap between shipped reality and what the framing law requires, the Lyme rage example as concrete illustration, why the current Granularity Gym is not enough, the direction of the change (differentiation not empathy + per-session NAMED THING artifact + sub-beats compose around precision production), and the seven items that need to happen before the substance work ships (read current `reframe.js`, rewrite system prompts, add structured AI output, storage schema for named-thing-library, sub-beat restructure, My Progress library surface, AI regression test refresh).

### Pending — needs Arlin's go before build (in priority order)

- **[BLOCKER for everything else] Substance work — `reframe.js` prompt rewrite for differentiation, not empathy.** First build: read current `netlify/functions/reframe.js` end-to-end (CALM + CLARITY + HYPE + QUALITY_RETRY system prompts) and map exactly where validation lives, where empathy phrases are anchored, where the AI's role is set. Then propose the rewrite. Arlin needs to say go. See ENGAGEMENT_ARCHITECTURE §12.7 for the full seven-step plan and §12.8 for the standing question.

- **Settings → My Progress relocation (Trigger Profile + Habit anchors + Capacity baseline).** Locked May 14, 2026 evening (CANON Operating Rule: "Settings is for preferences. Practice content lives in My Progress / library surfaces.") Currently all three render as Settings collapsibles; should render inside My Progress alongside the existing STATES NAMED / TRIGGERS IDENTIFIED / MOVES NAMED library section. **Why not shipped May 14 evening:** ~300 lines of JSX with state-ref dependencies into the Settings parent component; rushing the relocation at 11pm risks breaking access to data the user has invested in. Clean execution wants daylight focus. **Spec for execution:**
  1. **Trigger Profile** — the easiest. `TriggerProfileSection` is already a reusable component (`src/App.jsx:17051+`). Render it inside My Progress (`MyProgress` function at `src/App.jsx:17453`) immediately AFTER the "YOUR LIBRARY" section (relative line 726, absolute ~18179) as its own collapsible section titled "Triggers you've named." Pass the same state references the current Settings invocation passes. Then hide the Settings Personalization → Trigger Profile invocation with `{false && ...}` preserving code.
  2. **Habit anchors** — inline JSX in Settings (line ~30430-30615, ~185 lines). Two clean paths: (a) extract into a new `HabitAnchorsSection` component and render in My Progress, OR (b) move the JSX wholesale into My Progress. Path (a) is correct architecturally; path (b) is faster. Either way, the `anchors` state and `setAnchors` setter need to be visible to My Progress — they're already top-level so should be accessible.
  3. **Capacity baseline** — line ~30615-30735, ~120 lines. Same pattern as Habit anchors. The baseline reset confirm flow uses `window.confirm` so no extra modal infrastructure needed. Render in My Progress just before the Roadmap section (it's a growth-tracking anchor; natural placement alongside Roadmap).
  4. **Settings cleanup** — hide the three sections with `{false && ...}` wrappers (don't delete the code; preserve for emergency rollback). Update `settingsSectionOpen` state to remove `anchors`, `baseline`, and Trigger Profile keys after relocation verified working.
  5. **Verification gates:** Layer 5 phone test — open My Progress, see all three sections rendered correctly; edit a trigger, anchor, baseline; confirm data persists; open Settings, verify those three sections are no longer visible; verify no other Settings sections broke.
  6. **One PR, four commits** (one per section + cleanup commit). Doc updates: CANON Section 11 (CURRENT STATE) updates with relocation note; INTEGRATIONS_AND_CONCIERGE doc gets a note in §3 if relevant. Estimated scope: 1 focused session, ~400 lines net change.

- **Step 2 sub-beat restructure.** Architecture call locked May 14 evening: (1) Read AI reflection, (2) Pick where you are now, (3) Name what shifted, (4) Pick a next move, (5) Lock in. One element per sub-beat, tap to advance. **Holds until substance work lands** — substance before structure (CANON Operating Rule). Without the substance fix, sub-beats just put generic content in a prettier flow.

- **Spine intake modal correction pathway relocation.** The "Not quite right →" override was hidden from home; the modal is now unreachable. State + component preserved. Pathway needs to relocate INSIDE the spine session — when the AI proposes a routing, the correction affordance lives within that session flow.

- **Science card replacement.** Currently a static textbook paragraph ("You practiced cognitive reappraisal — the shift from reactive interpretation to deliberate framing. It's a measurable skill that strengthens prefrontal-amygdala regulation") rendered identically every session regardless of what the user did. Arlin called it "super weak." Three options laid out May 14 evening: (a) kill it, (b) AI-generated session-specific one-liner, (c) named-move card — "Move named: [the precise thing the user produced]." Claude leans (c) — operator-tier, names what the user actually did, falls out naturally from the substance work above.

- **Next Move chips ingenuity.** Currently hardcoded 4 generic options (Send a message / Hold a boundary / Delay your response / Let it go) regardless of situation — fails the Lyme rage example where none of those four are the right move. Three options: (a) AI-proposed moves specific to the user's input, (b) open textarea, kill the chips, (c) wider hardcoded chip taxonomy. Claude leans (a). Falls out from the substance work above (the AI already has the user's precise named thing — propose moves from there).

### Operating rules reinforced this session

- **Make architectural calls; don't defer to Arlin on every detail.** "I don't understand why it's so difficult for you to decide" — when a principle exists (one-element-per-beat), apply it consistently across surfaces. Stop asking which panels are essential when the principle answers that.
- **Apply principles recursively.** Same one-element-per-beat that drives the home journey applies inside the spine session sub-beats. Same surface/science separation that drove the Granularity Gym fix drove the Processing Primer fix.
- **Docs are the durable record.** "I am concerned all the ideas I generated and brought back to the front might disappear like they have in the past" — compaction summaries are stale by design. Repo docs survive. Update CANON + ENGAGEMENT_ARCHITECTURE + Master Todo before context burns away.

---

## Completed — May 8 + May 12, 2026 (six session records moved out of Master Todo)

These six sections were the historical session records of the spine-ship work (May 12) and the late-May-8 audit closure. All items in these sections have closed status (shipped / rejected with reason / deferred with explicit recommendation / environment-blocked). Moved here out of Master Todo so the TODO doc carries only open work.

## SPINE SHIP — May 12, 2026 (commits `e123e07` through audit-resolution commit)

Nine gaps shipped first-cut in a single batch this session, then full audit run + two Layer 0.5 findings resolved before phone test. Branch `feat/home-wiring-surface` is well ahead of main, all green (build + preflight pass on every commit), zero deployed.

**What the user will see after the next Netlify deploy:**

1. **Home — TODAY'S REP block at top of hero.** Eyebrow names current chapter; rep statement names the metacognitive objective from `getTodaysJourneyRep()`. Bio-filter reasoning + CTA preserved below (modality entry). Anchors strip below journey rep if anchors are set.
2. **Home — REP COUNTED banner.** When a session completion flipped a marker, banner appears above journey rep with marker label + rep statement + dismiss X. Auto-clears on dismiss.
3. **Mirror Strip → Roadmap (one tap).** Mirror Sheet retired entirely as of audit resolution. "How stages work" info button moved into Roadmap header. Trigger Profile reflection display retired (Settings has full CRUD).
4. **My Progress — Weekly Reflection section (consolidated).** Path A Section 3 finally built: one bordered card with two sub-blocks: "The last 30 days" (synthesized insights from rolling 30-day window) + "Since you started" (capacity growth from baseline). Replaces the two separate cards that violated Path A's 4-section structure.
5. **Settings — Habit Anchors section.** User-defined cue/action pairs with starter suggestions, 5-anchor ceiling.
6. **Settings — Capacity Baseline section.** Shows current baseline + Reset button (lets user wipe retroactive seed for a fresh measurement point).
7. **FAQ — Stage names and Mirror naming reconciled with code.**

**What's NOT in this ship:**

- Library destination (Gap 5) — rejected after review; competitor-pattern misread. Static cards retained as AI fallbacks + contextual `ScienceCard` post-session surface (existing pattern preserved).
- Audio practice layer (Gap 7) — needs assets, deferred
- Periodic re-assessment ritual (Gap 4 second cut) — needs UX decisions on cadence
- Calibration-time anchor selection (Gap 8 second cut) — onboarding modification deferred
- Personalized first-week starter sequence at calibration (Gap 3 second cut)
- Anchor → marker auto-pairing (Gap 8 + Gap 11 integration)
- Founder voice content pass (Gap 12 dedicated content production)

**Deploy + test order (Arlin):**
1. Trigger Netlify deploy from branch when ready.
2. Phone walk: home → journey rep at top → tap Mirror Strip → Roadmap → back.
3. Complete a session that might advance a marker → return home → REP COUNTED banner.
4. Open Settings → Habit Anchors → add an anchor (or tap starter suggestion) → return home → STANDING ANCHORS strip visible.
5. Open My Progress → see Weekly Reflection section with both sub-blocks.
6. Open FAQ → "What is the Mirror and stage system?" → confirm stage names.
7. Settings → Capacity Baseline → Reset baseline from current state (recommended before a fresh full app test).
8. Tap the ⓘ icon on Roadmap → confirm "How stages work" modal renders correctly.

---

---

## 📱 MAY 12, 2026 — PHONE TEST FIX SESSION

Arlin walked the spine ships from the previous day's build session (commits `2043917` → `0e74512` covering Ships 1.2 / 1.4 / 1.6 / 2 / 1.3 / 3 / 4 + the info-button consolidation pass `f0f085b`). Found 11 issues. All fixed in three commits today plus the bio-filter label resolution.

### Issues fixed this session

| # | Issue | Commit | Surface |
|---|---|---|---|
| 1 | X close on Stage modal (opened by accident, unclear purpose) | `afc28e5` | Mirror Sheet |
| 2 | "Not quite right" should exclude tool already on home | `afc28e5` | Spine intake modal |
| 3 | Header sizing — Stillform wordmark smaller than Subscribe button | `afc28e5` | Nav header |
| 4 | Signed in user seeing Subscribe button (stale local sub state) | `0398f9e` | Nav header |
| 5 | Auto-sync not running on app open (debounce too aggressive) | `0398f9e` | Launch sync |
| 6 | PDF export = blank pages (iframe + field extraction broken) | `0398f9e` | Settings → Download My Data |
| 7 | CSV download missing data (11 fields → 19 + new pulse CSV) | `0398f9e` | Settings → Download My Data |
| 8 | Privacy & Pattern Transparency back nav → home (should be settings) | `afc28e5` | Settings sub-screens |
| 9 | Run Focus Check rendering all-black (no explicit text color) | `afc28e5` | Settings |
| 10 | Move card prompt transitions invisible to user | `0398f9e` | SomaticPromptRunner |
| 11 | Bio-filter reasoning says "body work first" but CTA labeled "Talk it out" | `dff9d3b` | Hero label |

### Open from this session — NOT YET ADDRESSED

**"Move card better" (Arlin's note: 'I also feel like we can make this tool better')**
- Status: Awaiting scoping conversation. The body-part notification cue (commit `0398f9e`) was the targeted fix for the named bug; the broader "make it better" needs Arlin to articulate what's not working before a redesign can be specced.
- Next move: Arlin walks Move card on phone post-deploy, names specifically what's off, Claude scopes redesign.

**Integration permissions not granted (Arlin's note)**
- Status: Unknown — Arlin didn't specify which integrations. Possible candidates: Apple Health (HealthKit), Google Calendar, Push notifications, native haptics, biometric lock.
- Next move: Arlin names which integration is missing permission. Claude investigates that specific binding.

**Bio-filter reinforcement when user forgets the recommendation (Arlin's question: 'how do we guide them there let's say they forget')**
- Status: Partially addressed via commit `dff9d3b` (hero label now matches recommendation). Three-layer reinforcement chain documented in commit message: reasoning line → hero label → BioFilterSuggestion modal on tap.
- Open question: Does the three-layer chain suffice, or does the app need additional reinforcement (persistent banner, more prominent reasoning line treatment, etc.)? Arlin's phone walk post-deploy will tell.
- Deferred unless phone walk surfaces specific friction.

### What to test on the next phone walk

1. **Stage modal**: open from Mirror anchor → confirm X close works + tap-outside still works.
2. **Hero label + reasoning alignment**: change bio-filter to Pain. Confirm reasoning says "body work first" AND hero says "Locate the signal" (not "Talk it out"). Tap → BioFilterSuggestion modal shows.
3. **Not quite right modal**: confirm Mind crowded / Body charged / Body Scan options shown depend on what hero is already proposing.
4. **Header**: confirm Stillform wordmark holds visual weight, Subscribe/Account button is ghost-style.
5. **Subscribe auto-check**: if you see Subscribe while signed in, tap once and see if it flips to Account (auto sub-status check before navigation).
6. **Sync**: open app, go to Settings → Cloud Sync. Confirm "Last synced X ago" indicator appears.
7. **PDF export**: Settings → Download My Data → Download pulse log (PDF). Should open new tab with print dialog. If popup blocked, downloads HTML file.
8. **Session CSV**: download and verify 19 fields (timestamp, source, mode, entryMode, tools, durationSec, preState, postState, delta, selfGuided, exitPoint, regulationType, bioFilter, feelState, triggerId, flaggedPattern, shiftLabel, breathPattern, sessionId).
9. **Privacy / Pattern Transparency back**: from Settings → Patterns I'm watching for → confirm screen loads, tap Back → confirm returns to Settings (not home).
10. **Composure Check**: Settings → Composure Check button — confirm text visible (was all-black), label matches home.
11. **Move card cues**: run a Move card sequence. On each prompt change, confirm haptic tick + visual fade-in + step counter at top.

---

## 🌀 JOURNEY-SPINE COMPETITIVE GAP ANALYSIS — May 12, 2026

Code-verified gaps cross-referenced against Liven and Healthy Minds Program (HMP) app architecture, framed through **STILLFORM_FRAMING_LAW.md** (metacognition practice / neuroplasticity spine / capacity expansion / composure as felt outcome). This section is the implementation breakdown of the narrative-spine / connectivity-layer entry below (originally added May 8) — the diagnosis was correct; the gaps are now concrete with line numbers.

**Operating principle:** Stillform's data infrastructure is stronger than either competitor (5-stage architecture with shipped markers at `src/App.jsx:4718` and `:4755`, processing-type-modulated rep delivery, bio-filter hardware-state context, Russell circumplex classifier, EOD artifact pipeline, Pattern Transparency surface, Low-Demand mode). The UI does not surface that infrastructure as a journey. **The work below is exposure, not invention.** Stillform doesn't need new mechanics — it needs the existing mechanics turned into a felt path.

**What Liven and HMP have that Stillform doesn't (architecture, not features):**
- Onboarding quiz → personalized path generated as user-facing artifact (not just AI-consumption profile)
- Single dominant daily call-to-action on home (not a feature panel)
- Visible path/chapter visualization with current position + next marker
- Re-assessment ritual that shows delta from baseline
- Library/explore surface for between-session learning
- Framework that names "what this builds" for every action

**What Stillform has that they don't (preserve when closing gaps):**
- Processing-type-modulated rep delivery (body-first vs thought-first as somatic vs cognitive entry into the same journey content — no competitor personalizes modality this way; lives inside the rep, not at the home level)
- In-moment AI Reframe with calm/clarity/hype routing (Liven's Livie is open-ended chat — much weaker structurally)
- Bio-filter hardware-state context
- Three specific breath protocols including Cyclic Sighing (Balban 2023)
- Move card somatic redirection with AI selection from a science-fidelity library
- Five-stage capacity ladder grounded in real markers (NOTICING / NAMING / ANTICIPATING / RECOGNIZING / HOLDING)
- Pre-event brief + EOD artifact pipeline
- Pattern Transparency surface
- Low-Demand mode for cognitive-bandwidth-limited users

The fix is exposing the spine, not adopting competitor patterns wholesale.

---

### Gap 1 — Path visualization for the 5-stage architecture

**STATUS: SHIPPED (first cut) — commit `7de3b15`, May 12, 2026.** Mirror Strip on home now opens the existing RoadmapScreen directly (one tap, was two). Roadmap renders all 5 chapters with current highlighted, past as built, future with capacity gates visible. Shipped alongside Gap 10 (designed together).

**Code state:** `STAGE_DEFINITIONS` at `src/App.jsx:4718` defines five capacities with science citations. `computeStageMarkers` at `:4755` tracks real progress per stage (bio-filter setup, body-area-specific sessions, distinct chips, sustained check-in weeks, triggers named, pre-event briefs, pattern acceptance, high-load sessions, recovery trend). `getCurrentStage` at `:4822` returns current stage + percent to next. **User-visible representation: one line of 10pt monospace text at `:22790`** (Mirror Status Strip).

**Competitor parallel:** Liven Journey tab — 4 chapters unlocking sequentially, current chapter highlighted. HMP My Path — self-paced lesson sequence with pillar mapping.

**Gap:** The 5-chapter journey is data-modeled and UI-invisible.

**Fix (new lens):** Path surface where each chapter names the metacognitive capacity it builds, current position visible, next marker named, prior stages shown as past chapters. Frame as a neuroplasticity build sequence — early chapters are simpler observation, later chapters are integrated metacognition under load. Capacities of practice, not stages of achievement. Mirror Sheet stays as the in-context status; the Path is the destination view from My Progress or a dedicated tab.

**Cross-references:** Supersedes solution shape A in narrative-spine entry below. Builds on `STILLFORM_ENGAGEMENT_ARCHITECTURE.md`.

---

### Gap 2 — Single dominant daily focus replacing the 9-section feature panel

**STATUS: SHIPPED (first cut) — commit `9f315ef`, May 12, 2026.** Hero on home now renders "TODAY'S REP · STAGE N · STAGENAME" eyebrow + rep statement above the existing bio-filter reasoning line + CTA. Journey rep names WHAT today's practice is (sourced from `getTodaysJourneyRep()` reading next unmet marker); processing type + bio-filter select HOW to enter (modality layer preserved). Between-stage state renders "CHAPTER BUILT" + gate-to-next-chapter framing. PracticeSurface and other home sections still present — the journey rep sits at the visual top of the hero block, not the entire home. Second cut would compress remaining sections if needed.

**Code state:** Home render at `:21895` shows: greeting + PracticeSurface + Morning Strip + Morning Check-in form + Mirror Strip + Hero CTA + Move Card promo + Scripts promo + EOD Strip. Hero CTA at `:22881` is bio-filter-routed; reasoning line names the rule that fired (Ship 2, May 11), not the journey position. Every day reads the same structural shape.

**Competitor parallel:** Liven and HMP each present ONE primary action per day at home.

**Gap:** No single daily focus. User scans 9 sections to decide what to do. Decision burden every app open.

**Fix (new lens):** Single hero unit names today's metacognitive rep — what capacity it builds, why this specific objective today, how it ties to the current chapter. *"Today: name three states by lunch — that's a Naming rep."* The rep itself is journey-positioned (from `getCurrentStage()` + the path generated at calibration via Gap 3). **Processing type (`regType`) and bio-filter are modality modifiers, not the home's organizing principle:** they choose HOW the user enters today's rep (somatic entry point vs cognitive entry point), not WHAT the rep is. A body-first user entering today's Naming rep starts with a body scan and names what each tell is telling them; a thought-first user opens Reframe and names three states they've moved through this morning — **same rep, different modality of entry**. Bio-filter beats processing type when current-state demands it; both live inside the rep entry, not at the home render level. The `if (!regType) return null;` at `:21899` stays as a safety net but stops gating home routing; the hero rendering at `:22881–22952` is restructured from "bio-filter-routed CTA with override" to "journey-positioned rep with modality entry chosen by bio-filter > processing type." PracticeSurface (built today) can move below or fold into this single hero.

**Cross-references:** Implements solution shape B from narrative-spine entry below. The 9-section feature panel is the visible expression of Arlin's May 8 diagnosis: "a bunch of boxes with no true data system or connectivity."

---

### Gap 3 — Calibration outputs a starter path, not just a profile

**STATUS: SHIPPED (first cut) — commit `9f315ef`, May 12, 2026.** No new persistence introduced. Instead: `STAGE_REPS` lookup at `:4807` maps every shipped marker to a one-sentence rep statement. `getTodaysJourneyRep()` returns the next unmet shipped marker as today's rep. The "starter path" is implicit in the markers themselves, surfaced in order as the user progresses. Cleaner than a separate path data structure — uses the existing capacity-tracking infrastructure as the path. Second cut could add calibration-time generation of personalized first-week sequence with cadence and modality variance.

**Code state:** Calibration completion writes `stillform_signal_profile`, `stillform_bias_profile`, `stillform_regulation_type`, `stillform_breath_pattern`. Zero `stillform_path_*` keys exist in `SYNC_KEYS` (`:9567`). Profile data feeds the AI; user sees no time-sequenced journey artifact at calibration end.

**Competitor parallel:** Liven 3-min quiz → personalized course unfolds with chapter structure visible immediately. HMP 3-5 min self-assessment → personalized path generated with pillar mapping shown on entry.

**Gap:** Onboarding profiles the user. It does not generate their journey.

**Fix (new lens):** Calibration completion also writes a 30-day starter sequence — daily metacognitive objectives mapped to Stage 1 markers (bio-filter setup, body-area specificity, active-state entry, autonomous exits). Each day's objective IS a metacognition rep. By Day 30, the user has hit enough Stage 1 markers to advance — re-calibration unlocks Chapter 2. Path is calibration-personalized: a body-first user gets somatic-led early reps; a thought-first user gets cognitive-led early reps.

**Cross-references:** Relates to "Onboarding redesign" item (line ~989, sequenced last). NOT redundant — the existing onboarding redesign was about teaching what the app does. This is about generating a journey artifact at calibration end. They merge cleanly: redesigned onboarding ends in a generated path.

---

### Gap 4 — Re-assessment ritual that surfaces capacity expansion

**STATUS: SHIPPED (first cut) — commit `111e08a`, May 12, 2026.** Capacity-growth baseline written to `stillform_growth_baseline` at calibration completion for new users (true baseline) or retroactively seeded on first app load for pre-existing users (source: `retroactive-seed`). Added to SYNC_KEYS so baseline persists across devices. "Since You Started" card in My Progress (above Roadmap surface) computes deltas from baseline → current and renders plain-language growth observations: stage advancement, chip vocabulary growth, triggers named, biases recognized, signal areas mapped, sessions logged. Empty growth state still renders the card so the surface exists from day one. Periodic re-assessment ritual (abbreviated calibration re-run) is the second cut — requires UX work on cadence (monthly/quarterly/user-triggered) and stripped calibration flow.

**Code state:** Calibration runs once. Stage markers update silently in background data. `computeStageMarkers` at `:4755` returns current state; nothing compares against baseline. My Progress at `:13516` shows aggregates (avg shift, processing type, lock-in rate, day streak) but not a delta from the starting calibration.

**Competitor parallel:** HMP re-runs the 4-pillar quiz periodically. Goal stated explicitly: *"increase each of the four scores from your original assessment."* Delta visible to user.

**Gap:** No felt-progress moment. Markers move in the data; user never sees the movement.

**Fix (new lens):** Monthly re-assessment ritual — abbreviated calibration that re-measures Signal Profile drift, Bias Profile granularity expansion, and Stage marker accumulation. Surface the delta from baseline. Frame as *"your concept library has grown"* (Hoemann 2021 emotional granularity) and *"your interoceptive vocabulary has expanded"* (Barrett 2017 constructed emotion), not *"you've achieved more composure"* (achievement framing). Re-assessment IS itself a metacognition rep — observing your own capacity change over time is meta-meta-cognition.

**Cross-references:** Closes a specific slice of "My Progress redesign" (line ~917). NOT redundant: My Progress redesign is the surfacing of three-category shift data; this is the surfacing of capacity-delta data. Both should land together inside the redesigned My Progress.

---

### Gap 5 — Practice library as a destination, not a buried surface

**STATUS: REJECTED after review — May 12, 2026 (commit reverting the ship).** The Library destination was a competitor-pattern import that doesn't fit Stillform's architecture. The 20 cards in `STATIC_SCIENCE_CARDS` are designed as (a) randomized fallbacks when the AI science card generator fails and (b) source material for the post-session `ScienceCard` surface that appears contextually after a tool run with the framing *"this is the science behind what you just did."* Exposing them as a browsable archive reads as a thin library (20 cards looks empty when the user expects depth) and violates the design pattern that surfaces science contextually rather than as a reading destination. No plan to write more cards. The competitor pattern doesn't transfer: Liven and HMP are content-delivery platforms; Stillform is a practice. Content lives in flows, not in destinations. Reverted in full — `LibraryScreen`, `LIBRARY_CATEGORIES`, `LIBRARY_CARD_TITLES`, `library` screen state, entry buttons in Roadmap + My Progress all removed. Static cards and contextual `ScienceCard` surface preserved.

**Code state:** Plain-Language Neuroscience cards exist (`PLAIN_LANGUAGE_SCIENCE_CARD_SPEC.md`) but aren't surfaced as a destination tab. Science is woven in moments inside tools. There is no browsable library outside of practice flow.

**Competitor parallel:** Liven Explore tab — articles, mini-courses, videos, organized for non-sequential discovery. HMP science lessons embedded inline with practices but also accessible separately.

**Gap:** No destination for between-session learning. A user who's not in a tool moment has nowhere to go that pulls them back into the practice's intellectual frame.

**Fix (new lens):** Library tab organized by capacity (one shelf per stage) + mechanism (interoception, granularity, MCT, neuroplasticity, constructed emotion, polyvagal theory). Each card teaches science as language, not credentialing — pulls in the framing law science spine without making the user do another tool rep. Founder writing lives here too. Answers *"what should I read between sessions?"*

**Cross-references:** Adjacent to solution shape C in narrative-spine entry (the "How Stillform Works" surface). Different: this is a browsable library, not a linear walkthrough.

---

### Gap 6 — FAQ stage names out of sync with code

**STATUS: SHIPPED — commit `e123e07`, May 12, 2026.** FAQ at `:24820` reconciled with STAGE_DEFINITIONS at `:4718`. Stage names now read NOTICING / NAMING / ANTICIPATING / RECOGNIZING / HOLDING (was: Naming, Pattern recognition, Flexibility, Equanimity, Steadiness). Each stage description includes science citations matching STAGE_DEFINITIONS. "Stages of mastery" replaced with "capacities of practice" per framing law. Mirror naming consistency: "Mirror" (umbrella) + "Mirror Sheet" (modal). Anti-gamification stance preserved: "markers are observable signals of expansion, not gates you have to clear."

**Code state:** `STAGE_DEFINITIONS` at `:4718` uses NOTICING / NAMING / ANTICIPATING / RECOGNIZING / HOLDING. FAQ at `:24820` describes stages as *"Naming, Pattern recognition, Flexibility, Equanimity, Steadiness."* Different lists. The user-facing copy describes a deprecated stage architecture.

**Gap:** Bug. Documentation drift between source-of-truth (code) and user-facing copy (FAQ).

**Fix:** Reconcile FAQ to current STAGE_DEFINITIONS. Stage definitions are the spine; user-facing copy follows the spine. Same fix passes through any other surface that mentions stage names (search the codebase for the old names before shipping).

**Cross-references:** Standalone — small, ship anytime.

---

### Gap 7 — Audio practice layer

**STATUS: DEFERRED — needs external assets, May 12, 2026.** Implementation blocked on either (a) Arlin's voice recordings for high-signal surfaces (founder voice for chapter intros, monthly synthesis narration, gate explanations), (b) TTS API integration with a chosen provider, or (c) pre-recorded session audio from a contractor. Code-only ship not possible without one of these. When audio assets exist, integration is straightforward: HTML5 audio with playback controls inside Library cards + Roadmap chapter pages + tool flows for ambient guidance. Library + Body Scan are the natural first integration points.

**Code state:** Body Scan, Move card, Plain-Language Neuroscience cards, Reframe — all text-only. No spoken guidance, no audio modality anywhere in the build.

**Competitor parallel:** HMP's structural spine is 600 days of audio lessons + audio-guided sittings (Davidson + colleagues as recorded voices). Liven includes audio components for some content. Audio is the primary modality for both competitors' between-session learning.

**Gap:** Stillform has zero spoken modality. A user who's eyes-closed, eyes-tired, walking, driving, or cognitively depleted has no entry point into the practice. Low-Demand mode partially addresses cognitive load but still requires reading.

**Fix (new lens):** Voice-led versions of Body Scan + Move card + PLN cards. Not meditation-app narration — operator-voice teaching of mechanism in plain language. Founder voice for PLN cards (Arlin reading the cards she wrote — voice IS the framing law in delivery). External voice for Body Scan pacing if needed. Audio IS the eyes-closed metacognition rep — turning the practice inward without screen burden. Frame: the practice is the rep; the modality is the entry point.

**Cross-references:** Standalone modality. Audio versions of PLN cards live in the Library from Gap 5. Audio Body Scan plugs into existing Body Scan flow.

---

### Gap 8 — Habit anchor system (cue → routine → reward formalized)

**STATUS: SHIPPED (first cut) — commit `de2be7a`, May 12, 2026.** `stillform_anchors` localStorage + SYNC_KEYS entry. Settings → Habit Anchors collapsible section with add/edit/delete UI, 5-anchor practical ceiling. Starter suggestions shown when zero anchors set (Slack/email, lunch, bedtime, walking, phone ringing — each paired to a specific metacognition rep). Home renders "STANDING ANCHORS" strip below journey rep showing first 2 anchors (more counted via "+N more in Settings"). Calibration flow integration (anchor selection at calibration end with auto-pairing to Stage 1 markers) is the second cut — onboarding modification deferred to its own scoped commit. No automatic marker-pairing in first ship; user maps mentally for now.

**Code state:** Day streak counter (passive), morning/EOD strips (time-of-day passive cues at `:22177` and elsewhere), notification reminders via `stillform_reminder_time`. No explicit anchor pairing of metacognition reps to existing life cues. Onboarding doesn't ask for anchors. Settings doesn't expose anchor configuration.

**Competitor parallel:** Both competitors build formal habit infrastructure (Liven's daily task system with named slots; HMP's daily reminders + path pacing). The habit-formation research (Wood 2007, Lally 2010, Gollwitzer 1999, BJ Fogg) informs both products explicitly.

**Gap:** Stillform has streaks but no formal anchor design. A metacognition rep that doesn't anchor to an existing life cue doesn't compound into capacity expansion — it stays "a thing the user does sometimes." Habits are how neuroplasticity becomes default behavior; without the anchor layer, the practice never crosses from intentional act to automatic capacity.

**Fix (new lens):** Explicit anchor pairing introduced at calibration end and editable in Settings. *"Before opening Slack, name your state."* *"After lunch, one Naming rep."* *"Phone in hand before bed → EOD."* User picks two anchors at calibration completion; system pairs them to Stage 1 markers and surfaces them in the daily focus from Gap 2. Each anchor pair IS a Gollwitzer 1999 implementation intention. Habits ARE neuroplasticity in motion — the literature is settled. Currently absent from the build.

**Cross-references:** Integrates with Gap 3 (calibration outputs starter path) — anchor selection is part of the path generation step. Integrates with Gap 2 (daily focus) — daily focus can reference the user's anchor pairing when surfacing today's rep.

---

### Gap 9 — Synthesized insight reports

**STATUS: SHIPPED (first cut) — commit `133f6f6`, May 12, 2026.** "Last 30 Days" synthesized card at the top of My Progress (before Roadmap surface). Computes up to 6 plain-English observations from real session data over the prior 30 days: session volume, distinct chip vocabulary (granularity), pre/post delta average, top bias from profile with MCT framing, top trigger by encounter count with Gollwitzer framing, streak (only when ≥3 days, escalates language at 14+ days with Lally 2010). Empty-state handled: zero-session 30-day window → card doesn't render. When monthly re-assessment (Gap 4 second cut) ships, this synthesis becomes the artifact delivered at re-assessment time.

**Code state:** Pattern Transparency surface at `:25344` shows pattern detection events as a list. EOD artifacts are per-session at `stillform_eod_artifacts`. Today's Briefs at `stillform_todays_briefs`. No periodic synthesis across sessions over a 30-day or 90-day window. Data layer is rich; synthesis layer is empty.

**Competitor parallel:** Liven's Mood Tracker analyzes behavioral patterns over time and surfaces insights. HMP shows pillar-level progress reports. Both periodically deliver "here's what the data says about you" as synthesized output.

**Gap:** Stillform's data layer is richer than either competitor (sessions, chips, biases, triggers, EOD artifacts, move-card history, brief outcomes, pattern detections) — and the user sees zero synthesized output across that data. Pattern Transparency surfaces individual events, not synthesized observations.

**Fix (new lens):** Monthly insight report — synthesized observations across the prior 30 days. Format: 4-6 plain-English statements (*"you named jaw-tension 14 times — your top somatic tell"*; *"your most common bias was personalization; your reframe rate on it held at 78%"*; *"you initiated 6 Move card sessions without prompt — that's autonomous Stage 1 mastery"*). Meta-meta-cognition: the system observes the user's metacognitive pattern accumulation and reflects it back. Frame: granularity is the practice (Hoemann 2021); the report makes the user's granularity visible TO the user. The report itself IS a metacognition rep — reading your own patterns is the next layer of practice.

**Cross-references:** Integrates with Gap 4 (re-assessment ritual) — the monthly insight report can be the artifact handed to the user at re-assessment time. Builds on Pattern Transparency surface at `:25344` — synthesis is the next layer above event listing.

---

## SECOND-PASS GAPS — surfaced by direct code walk May 12 (evening)

Three additional gaps emerged from walking `src/App.jsx` line-by-line after the initial competitor analysis. These wouldn't surface from external Liven/HMP comparison alone — they're internal structural gaps in how the spine connects to the user's per-session and per-surface experience. Not redundant with Gaps 1-9; each occupies its own structural slot.

---

### Gap 10 — Capacity gates as visible thresholds (not passive markers)

**STATUS: SHIPPED — commit `7de3b15`, May 12, 2026.** `STAGE_DEFINITIONS` at `:4718` extended with `gate` field for stages 2-5 (Stage 1 has no gate). Each gate has three fields: `headline` (cognitive prerequisite one-liner), `body` (what that means in user's practice), `citation` (literature source). Examples: Stage 2 NAMING gate: "You can't name what you can't feel." (Lieberman 2007 + Farb 2015). RoadmapScreen renders the gate inside each upcoming stage card above the marker list. The gate IS the science — not a point threshold. Anti-gamification stance preserved: AI leveling stays invisible; capacity gating is visible because the science is the gate.

**Code state:** `STAGE_DEFINITIONS` at `:4718` defines five chapters. `computeStageMarkers` at `:4755` tracks per-stage progress. But markers update **silently in background data** — there is no user-visible threshold the user can see approaching. `STILLFORM_PROJECT_TRANSFER.md` explicitly states *"Invisible leveling — AI gets smarter silently by session count. Never announced."* That anti-gamification stance, applied to the **whole journey**, makes path mechanics invisible — the user never sees what they're working toward, only what they're doing right now.

**Competitor parallel:** Liven uses numerical lesson-completion gates (points/streaks). HMP uses self-paced pillar scoring (no gates). Both are extremes; neither fits Stillform.

**Gap:** No middle path between hidden leveling and gamified gates. The user can't see *what would have to be true* for them to enter the next chapter. The 5 stages have actual science-grounded prerequisites (you can't anticipate triggers — Stage 3 — without first being able to name what you're feeling — Stage 2; this is Gollwitzer 1999 + Barrett 2017 stacked) but those prerequisites are invisible.

**Fix (new lens):** **Capacity-prerequisite gates** — not point thresholds. Each chapter names what cognitive prerequisite the next chapter requires, sourced from the science: *"Anticipating triggers requires being able to name your states fast and specifically — Naming chapter caps when you've used 8+ distinct chips in 30 days across at least 2 active-state sessions."* The gate is the literal cognitive requirement of the next capacity. User sees the gate from the moment Chapter 1 begins. AI leveling stays invisible per project-transfer rule; **capacity gating is visible because the science is the gate**.

This is structurally different from Gap 1 (which shows the path) and Gap 3 (which generates the path at calibration). This is the **progression mechanic** — how the user moves along the path. None of the existing gaps address the mechanic, only the surfaces.

**Cross-references:** Requires Gap 1 (path defined) + Gap 3 (markers serialized as user-facing prerequisites at calibration). Should be designed alongside Gap 1, not after. Anti-gamification stance preserved: gates are scientific prerequisites, not points.

---

### Gap 11 — Per-session "rep counted" feedback

**STATUS: SHIPPED (first cut) — commit `8703cb9`, May 12, 2026.** `appendSessionToStorage` at `:2538` instrumented: snapshot pre-session marker met-state across stages 1-5, write session, recompute, find first marker where pre-state was false and current is true → write payload to `stillform_last_rep_counted`. Only first flipped marker per session surfaces (discrete feedback, not flood). Home hero render reads the key and surfaces a bordered banner above the journey rep block: "✓ REP COUNTED · STAGE N · STAGENAME" + marker label + rep statement in Cormorant italic + dismiss X. Dismiss clears the key. Plausible event "Capacity Rep Counted" fires alongside. Per-session is the temporal layer that completes the trio: per-session (this) → monthly synthesis (Gap 9) → quarterly re-assessment (Gap 4 second cut).

**Code state:** Sessions write extensive data — `stillform_sessions` captures pre/post rate, delta, tools used, durationSec, exitPoint, regulationType, bioFilter, feelState, triggerId, flaggedPattern, shiftLabel, breathPattern, sessionId. Chips used populate `stillform_feelstate` history. The session completion screen at `:24459` (tool render) shows a generic completion confirmation. **The user never sees which capacity rep they just did.** A first-time use of the chip "envious" — Stage 2 NAMING progress — registers in data with zero user-visible acknowledgment. A Move card session entered during an active state — Stage 1 NOTICING progress — same. The rep counts in the data; the rep is invisible to the user.

**Competitor parallel:** Liven post-session reflection prompt (*"How are you feeling now vs before this lesson?"*). HMP shows pillar-score nudges after practices. Both reflect SOMETHING back to the user at the end of a session.

**Gap:** No per-session capacity-rep feedback. Without it, the user does the practice but never sees their capacity expanding — the felt-progress moment is missing at the most natural place to surface it (immediately after the rep). Gap 4 covers monthly re-assessment; Gap 9 covers monthly synthesis report. **Neither covers the per-session moment.**

**Fix (new lens):** Capacity-specific micro-feedback after sessions where a meaningful marker fired. *"You named 'envious' for the first time — new language in your library."* *"You entered this session in an active state — a Stage 1 rep."* *"Your pre-to-post delta on a named trigger was +3 — that's an Anticipating rep counted."* Plain language, no badges, no points. Framed as **observation of the user's growing capacity**, not reward for behavior. Connects to Hoemann 2021 emotional granularity (the practice IS the granularity expansion; the feedback names the expansion as it happens). The feedback itself is a metacognition rep — the user sees their own pattern of capacity acquisition.

This is structurally different from Gap 4 (periodic, every 30 days) and Gap 9 (synthesized, monthly insight reports). This is **per-session, in the moment, when the rep is freshest**. All three temporal layers needed: per-session (Gap 11) → monthly synthesis (Gap 9) → quarterly re-assessment (Gap 4).

**Cross-references:** Requires Gap 1 (capacity vocabulary defined). Integrates with the existing Tool Debrief flow at `:25344` adjacent surfaces. Tool completion screens are where this lands — touchpoint already exists; content layer is missing.

---

### Gap 12 — Spine voice & content language

**STATUS: PARTIAL — voice applied per-surface as each gap shipped, May 12, 2026.** Every surface shipped in Gaps 1-11 was written with framing-law voice: science as language (citations earn their space), capacity as observation not achievement ("rep counted" not "level up"), enhancement framing (the reader wants to think sharper, not get calm). No dedicated content-production pass yet — the voice is consistent across ships because the framing law was the operating reference, but a unified editorial review across all spine surfaces is the remaining work. Founder voice (Arlin) for high-signal surfaces (chapter intros, monthly synthesis prose) is the natural next pass when Arlin has bandwidth for content writing.

**Code state:** The only journey-related copy currently in the codebase is `STAGE 1 · NOTICING · JAW TELL · CLIENT CALL` (Mirror Strip at `:22790`, 10pt mono) and the FAQ entry at `:24820` (which has stale stage names — Gap 6). Every other spine surface from Gaps 1-11 — chapter pages, daily focus copy, capacity gates, re-assessment artifacts, per-session capacity feedback, insight reports — currently has **no content written**. The framing law at `STILLFORM_FRAMING_LAW.md` defines principles (capacity expansion not regulation; neuroplasticity not wellness; operator precision not warmth) but no body of journey-narration copy exists that derives from those principles.

**Competitor parallel:** Liven's voice is gentle wellness coach (*"Today, let's explore..."*). HMP's voice is neuroscience educator (*"This practice trains..."*). Both have substantial bodies of journey-surface content written in a unified voice.

**Gap:** When the surfaces from Gaps 1-11 ship, they need to **speak**. Without a unified spine voice derived from the framing law, the surfaces default to either generic AI-cheerleader copy (banned) or bare technical labels (current Mirror Strip approach — works for a strip; not enough for a chapter page). Substantial content-production work, currently zero progress.

**Fix (new lens):** Develop the Stillform spine voice as its own content track running alongside Gaps 1-11 architecture work. Voice principles derived from framing law: **operator precision** (no warmth performance), **science as language not credentialing** (mechanisms named in working English, sources cited where they earn space), **capacity as observation not achievement** (*"your library has grown"* not *"you've leveled up"*), **enhancement framing** (assume the reader wants to think sharper, not get calm). One coherent voice across chapter pages, daily focus copy, capacity gates, per-session feedback, re-assessment narration, insight reports. Founder voice (Arlin) for high-signal surfaces (chapter introductions, monthly synthesis); functional system voice for repeated surfaces (per-session feedback, gate descriptions).

This is **content production**, not architecture. Distinct from every existing gap (1-11), which all describe surfaces and mechanics. This is the **language those surfaces speak**.

**Cross-references:** Runs parallel to Gap 1 (chapter page copy), Gap 3 (calibration handoff narration), Gap 4 (re-assessment artifact prose), Gap 9 (insight report prose), Gap 11 (per-session feedback templates). Should NOT block Gaps 1-11 architecture work — voice can iterate after the surface ships. But shipping a chapter page with placeholder copy guarantees that copy becomes load-bearing; better to scope voice work in parallel and ship surfaces with voice already aligned to framing law from first deploy.

---

### Build sequencing (updated)

Gap 6 is a small fix — ship immediately, alongside the wider stage-name reconciliation pass.
Gap 1 (path visualization) is the foundation — most other gaps reference the path schema.
Gap 10 (capacity gates) is designed alongside Gap 1 — gates are part of the path schema, not after.
Gap 3 (calibration generates path) requires Gap 1's path schema defined.
Gap 8 (habit anchors) lands inside Gap 3 — anchor selection is a calibration step.
Gap 2 (daily focus) requires Gap 1 + Gap 3 + Gap 8 (the hero's journey-position needs the path AND the anchor pair).
Gap 11 (per-session capacity feedback) requires Gap 1 — capacity vocabulary defined first.
Gap 4 (re-assessment) requires Gap 3 (baseline recorded at calibration completion).
Gap 9 (insight reports) lands inside Gap 4 — the synthesized report is the re-assessment artifact.
Gap 5 (library) is independent — ship any time.
Gap 7 (audio) is independent modality — Library + Body Scan get audio versions; ships any time.
Gap 12 (spine voice) runs parallel to all surface work — content production track, not sequential.

Build order: **Gap 6 → Gap 1 + Gap 10 (designed together) → Gap 3 → Gap 8 → Gap 2 → Gap 11 → Gap 4 → Gap 9 → Gap 5 → Gap 7.**  Gap 12 voice work runs alongside every surface.

Each gap exposes more of the existing spine or adds a modality the spine already supports. None of these invents new mechanics. Data layer is already in place for every gap above; the work is surfacing what's there and adding the missing connective tissue.

---

## 🗂️ AUDIT-STATE INVENTORY — May 8 late session

Layer 0 verification across every audit doc in repo root. Recorded so future context-pickups don't misread stale status flags as unbuilt work (Claude made this mistake twice this session before doing the verification). **Audit doc status flags are stale by design — code state is ground truth.**

| Audit doc | Actionable items | Status |
|---|---|---|
| `MOVE_CARD_FLOW_AUDIT.md` | 6 phases (8a-8f) | ALL SHIPPED this session. Deploy-gated on Arlin's library science review. |
| `PRE_EVENT_BRIEF_FLOW_AUDIT.md` | 5 phases (7a-7e) | 7a-7d SHIPPED this session. 7e (Trigger Profile match detection) DEFERRED post-launch per audit recommendation. |
| `TODAYS_BRIEF_FLOW_AUDIT.md` | 5 phases (3a-3e) | 3a-3d SHIPPED this session. 3e (re-read surface) DEFERRED post-launch per audit recommendation. |
| `TRIGGER_PROFILE_PHASE_2_FLOW_AUDIT.md` | 6 phases (2a-2f) | 2a-2d.1 SHIPPED prior session. 2e (calibration seed) + 2f (trigger-tagged sessions) DEFERRED per audit defaults. |
| `AI_REGRESSION_STATIC_AUDIT_19.md` | 4 concerns | Concern 2 SHIPPED May 8. Concerns 1, 3, 4 audit-recommended **defer until live run** — building them would override audit defaults. |
| `GPT4O_GUARDRAILS_AUDIT.md` | 4 actions | Actions 1 + 3 SHIPPED May 8 (`289ccf0`). Action 2 audit-deferred 1-2 weeks pending Action 1 telemetry data. Action 4 VERIFIED NO ACTION. |
| `STILLFORM_UI_FLOW_AUDIT.md` | 14 items | Items 1-3, 6-8: shipped May 7. Item 4: environment-blocked (Watch APK build, requires Android Studio locally). Item 5: **fix shipped later May 7** (see `App.jsx:7295-7317` Breathe + `App.jsx:10271-10297` Body Scan) — audit status flag is stale. Items 9, 11-14: voice/walk reviews requiring phone time, not code. |
| `COGNITIVE_FUNCTION_MEASUREMENT_PHASE_1_AUDIT.md` | Phase 1 build | STALE — `stillform_function_checks` / Practice Signals feature was reverted entirely (May 7). Audit covers a feature that no longer exists. |
| `STILLFORM_AUDIT_PHILOSOPHY.md` | N/A — meta-doc, not buildable | Active governing doc. |

**Conclusion: zero unbuilt actionable code work across all audit docs.** Every audit is either fully shipped to its specified scope, deferred per its own recommendation, environment-blocked, or stale.

The audit-then-build cadence is closed. New build work requires either (a) a new audit on a new surface, (b) live-run data on shipped surfaces driving refinement, (c) phone tap-through findings from Arlin, or (d) launch-prerequisite work outside the engagement architecture.

---

## 📋 SESSION HANDOFF — May 8, 2026

**For the next Claude session: read `STILLFORM_HANDOFF_MAY_8_2026.md` BEFORE doing anything else.** That doc captures the operating context, the failure patterns to avoid, current build state, three pillars sequenced for "winner state," and the immediate next move (complete EOD artifact frontend wiring — backend at commit `4c36283` is unwired). Reading the handoff doc is mandatory before reading the rest of this master todo.

---

---

## Completed — May 6, 2026

### ✅ Low-demand mode — ALL PHASES SHIPPED + trigger broadened May 6, 2026

Decision-locked architecture: low-demand is a state-of-existing-tool, not a separate tool. The broad-design rationale is captured in Locked Decisions section above (do not re-propose).

**Trigger broadening shipped May 6, 2026.** Original trigger was `bioFilter.includes("medicated")` only — narrower than the Apr 28 locked decision intended. The locked decision describes low-demand as for the "broad cognitive-bandwidth-limited population: SSRI users, post-anesthesia, sleep aids, chemo, recreational, sleep-deprived parents, migraine, dissociative episodes, etc." That population overlaps every bio-filter flag except `activated` (different physiological state) and `clear` (no flag). Now triggers on: `medicated`, `depleted`, `sleep`, `pain`, `hormonal`, `gut`. Centralized as `isLowDemandBioFilter()` helper in App.jsx (line ~2174) and parallel inline copy in `netlify/functions/reframe.js` (cannot share code across client/server). Six call sites updated (Breathe, Body Scan, Reframe — App.jsx; LOW-DEMAND OVERRIDE prompt + validator — reframe.js). Reframe prompt language now flag-aware: "user reports being medicated" / "user reports being in pain" / "user reports sleep deprivation" / etc, so the AI's framing matches what the user actually marked.

Bug fix bundled: Breathe's `bioFilter` useState was hardcoding `"medicated"` when low-demand fired, even if the user actually marked `pain` or `sleep`. Now preserves the actual flag for analytics + downstream display accuracy.

**Phase 1 (Breathe) shipped Apr 30, 2026** (commit 81e2c0b7). Implementation detail in Completed — April 30 / May 1 archive.

**Phase 2 (Body Scan) shipped May 4, 2026.** Skip intro screen, hide tension bar, force-enable audio, route directly to shared LowDemandComplete component on done (skip What Shifted, ToolDebriefGate, Next Move). Bundled with: `LowDemandComplete` component extracted at module scope and shared across Breathe + Body Scan (Phase 3 also uses it); Body Scan tension data now persisted to session record in normal mode (closing data gap that existed since Body Scan shipped — see follow-up item in Surface refinements for My Progress surface).

**Phase 3 (Reframe) shipped May 4, 2026.** Two surfaces addressed: AI behavior and UI. AI side adds LOW-DEMAND OVERRIDE prompt block to `netlify/functions/reframe.js` (prepended after context, before CALENDAR/SAFETY/LIABILITY so safety still wins position #1 at runtime — final read order: LIABILITY → SAFETY → CALENDAR → LOW-DEMAND → mode prompt). Validator threaded with `isLowDemand` flag — 3-sentence ceiling enforced for medicated users (crisis still gets 6); question count tightened to 0 in low-demand. UI side hides PresentStateChips, forces mode to calm, hides State-to-Statement, short-circuits handleDoneForNow to render shared `LowDemandComplete` skipping post-rating/post-insight/State-to-Statement/ToolDebriefGate/Next Move. Input placeholder simplified from "What's on your mind..." to "Type when you're ready."

**Pending verification (test day, May 7):** the 4-test protocol from Phase 3 spec — 10 medicated messages verifying ≤3 sentences and statements over questions; 10 clear control messages verifying normal voice preserved; 5 medicated+crisis messages verifying SAFETY OVERRIDE still fires fully; end-to-end on phone. Now expanded to also cover the broadened trigger: pain, sleep, depleted should produce the same low-demand voice as medicated. Captured in Test_Day_Plan_2026-05-07.md as item B3.

### ✅ Terms of Service + Privacy Policy "not a medical tool" language — VERIFIED in app May 6, 2026
The in-app Privacy & Disclaimers screen (App.jsx line 17505) contains exact required language: *"Stillform is not medical treatment, therapy, counseling, or a crisis intervention service. It does not diagnose, treat, cure, or prevent any medical or psychological condition. It is not a substitute for professional medical advice, diagnosis, or treatment."*

The pre-subscribe pricing surface (App.jsx line 17488) carries a short version visible BEFORE payment: *"Stillform is not medical treatment. It is a composure tool."*

The acupressure section adds a parallel disclaimer: *"It is not medical treatment. The pressure points referenced are based on traditional practices and are provided for informational and self-care purposes. Consult a healthcare provider before beginning any new wellness practice, especially if you are pregnant, have a medical condition, or are taking medication."*

The Reframe AI section adds liability-critical language about AI: *"These responses are generated by AI, not by a licensed therapist or medical professional. AI responses may not always be accurate, appropriate, or applicable to your situation. Do not rely on AI-generated content as a substitute for professional mental health care."*

The published Termly ToS (per prior compaction summary) has Sections 27-30 covering medical disclaimers, crisis routing, intended use, and responsibility — published with custom clauses verified May 5, 2026. Termly Privacy Policy and ToS are both published and live at https://stillformapp.com/privacy and https://stillformapp.com/terms.

**Liability posture is consistent across:** in-app Privacy & Disclaimers screen, in-app pre-subscribe surface, in-app FAQ ("Stillform is neither. Meditation is a sustained attention practice. Therapy is clinical treatment..."), Termly ToS Sections 27-30, and the AI-disclaimer Reframe paragraph. All five surfaces use the same "not medical, not therapy, not substitute for, see professional" framework.

**No further work needed.** The May 2 audit ask is fully satisfied across published docs and in-app surfaces.

### 🏗️ ✅ Subscription state table architecture rewrite — CODE + MIGRATION SHIPPED May 6, 2026

**Code complete AND SQL migration successfully run by Arlin in Supabase SQL editor on May 6, 2026.** All four Netlify functions are updated and deployed; the migration consolidated 9 fragmented rows into 5 clean rows (one per Lemon Squeezy subscription). Founder account verified — single row, is_subscribed=true, lemon_subscription_id=2127474. Zero orphans.

**Post-migration tables (now in Supabase):**
- `stillform_subscription_state` — canonical, 5 rows, one per subscription
- `stillform_subscription_state_v1_archive` — original 9 rows preserved for rollback
- `stillform_subscription_state_orphans` — empty (every row had a subscription_id)

**What shipped (code):**
1. **`netlify/functions/_subscriptionMigration_v2.sql`** — full migration with rollback notes, post-migration verification queries, and "drop archive after one billing cycle" guidance
2. **`netlify/functions/_subscriptionState.js`** — rewritten. New `upsertSubscriptionByLemonId()` writes ONE row per webhook event. Email-based user_id fallback (the v1 patch from commit c81dbb3) is now part of normal flow inside the upsert, not a special case. `getSubscriptionStatusForLookup()` returns one row, no `pickBestState` arbitration. `linkInstallToUser()` UPDATES the existing row's user_id, doesn't write a new row. Old `upsertSubscriptionStatus()` kept as deprecated alias so any unmigrated callers still work.
3. **`netlify/functions/subscription-webhook.js`** — uses `upsertSubscriptionByLemonId` directly. Removed the inline c81dbb3 email-fallback (now in module). Now bails early if no `lemon_subscription_id` in payload (rare edge case).
4. **`netlify/functions/subscription-link-account.js`** — uses `linkInstallToUser` semantics. Single-row UPDATE on user_id column. No more multi-row write per link.
5. **`netlify/functions/subscription-status.js`** — no code change needed; `getSubscriptionStatusForLookup` interface preserved.
6. **`netlify/functions/subscription-portal.js`** — no code change needed; `getSubscriptionStatusForLookup` interface preserved.
7. **`netlify/functions/account-delete.js`** — no code change needed; only used `sbAdminFetch`.

**Outstanding (low priority, not blocking):**
- After ~30 days of clean operation through one billing cycle, drop the v1_archive and orphans tables to keep the schema tidy. No urgency.
- Tomorrow during phone testing: confirm Manage Subscription button still opens the customer portal correctly (the function reads from the new table seamlessly).

**Rollback path preserved:** `stillform_subscription_state_v1_archive` preserves original data. If anything ever needs investigation, drop the new table and rename the archive back.

**Why this architecture is correct:**
- Single source of truth keyed by `lemon_subscription_id` matches Lemon Squeezy's identity model — they assign exactly one subscription ID per subscription
- `user_id` and `install_id` become indexed lookup columns, not part of row identity. A user changing devices, signing in/out, or reinstalling doesn't create new rows
- Email-based user_id resolution (the patch from c81dbb3 that saved the founder account on May 5) is now permanent normal flow
- No more `pickBestState` arbitration → no more "load-bearing fragility"
- Webhook writes ONE row per event instead of four → simpler, faster, fewer failure modes

### ✅ Build legal update notification mechanism — SHIPPED May 6, 2026
Closes the May 4 TestFlight-blocking item from Termly walkthrough. Per Termly ToS commitment to notify users of legal updates.

Three pieces shipped:
1. **`LEGAL_VERSION` and `LEGAL_VERSION_KEY` constants** at the top of App.jsx near `APP_VERSION`. Format: YYYY-MM-DD matching Termly "Last updated" timestamps. Bump this whenever ToS or Privacy Policy is materially updated.
2. **Initialization logic on mount** — checks localStorage for last-accepted version. First-run users are silently set to current version (they're accepting by signing up under current ToS). Existing users with mismatched version trigger the modal.
3. **Legal update modal** — overlay with backdrop blur. Title "Updated legal terms," body explains ToS/Privacy were updated, two link buttons to review (Terms and Privacy on stillformapp.com), one "Accept and continue" primary button that writes new version to localStorage and dismisses.

**Soft-prompt design:** user can navigate around the modal but it re-surfaces on next launch until accepted. Per Apr 30 V1 design decision — material changes (rare) could block app access in future, but soft-prompt is sufficient for V1.

**Implementation chose localStorage over Supabase column** — simpler, no schema migration, no admin API call needed. Tradeoff: if user reinstalls and signs in, they re-accept (which is fine since the modal is non-disruptive). The Supabase column approach captured in original spec was overkill for V1.

**To trigger the modal in production:** bump `LEGAL_VERSION` constant whenever ToS or Privacy Policy is updated. All existing users will see the modal on their next app load.

**Sync with Termly:** when republishing ToS through Termly, copy the "Last updated" timestamp into `LEGAL_VERSION`. Same when republishing Privacy Policy. If only one doc updates, still bump (the modal's wording covers both).

Build verified: vite build passes, 0 errors, 587 kB main bundle / 146 kB gzipped.

### ✅ Build password reset flow — SHIPPED May 6, 2026 (commit `b4bb394`)
Surfaces a complete in-app password reset flow using Supabase auth recovery. Five pieces in one commit: (1) new auth helpers `sbResetPassword(email)` and `sbUpdatePassword(newPassword)`, (2) new routable `reset-password` screen registered in HASH_SCREENS, (3) recovery hash parser that runs once on initial mount — detects `type=recovery` in URL hash, extracts access_token + refresh_token, calls sbSetSession() to authenticate the recovering user, then cleans hash and routes to reset-password screen, (4) "Set new password" screen with password + confirm fields, Show/Hide toggle, validation (8+ chars, match), error states, success state with Continue button to home, (5) "Forgot password?" link on existing sign-in surface in Settings → Sign in card with inline panel for requesting recovery email, confirmation message includes spam-folder check reminder.

Build verified: vite build passes, 0 errors, 583 kB main bundle / 145 kB gzipped (no regression). Closes the May 4 TestFlight-blocking item from Termly walkthrough.

REQUIRES (your action — quick check, probably already configured): Supabase project → Authentication → URL Configuration → ensure https://stillformapp.com is in 'Site URL' or 'Redirect URLs' allowlist. Already required for sign-in to work, so should be in place — but verify before testing the recovery email link.

### ✅ Build in-app account deletion flow — SHIPPED May 6, 2026
**Required by Apple App Store Review Guideline 5.1.1(v)** — apps that allow account creation must allow users to initiate account deletion from within the app. Without this, the app is rejected on review.

What was already in place: a "Delete all data" button that called `sbDeleteCloudData()` (deletes user_data and backups tables via user's RLS rights), then signed out and cleared localStorage. What was missing for Apple compliance: (a) the auth.users row deletion, (b) the word "account" in the button label so reviewers can find the feature, (c) handling for users with active subscriptions.

Three pieces shipped:
1. **New Netlify function `account-delete.js`** — authenticated via user's bearer token, deletes `stillform_subscription_state` rows for the user, then calls Supabase Auth Admin API to delete the auth.users row. Auth deletion failure is fatal and surfaces a real error to the user (not a fake "success") with instructions to contact araembersllc@proton.me. Subscription state cleanup is best-effort (logged but non-fatal — pending the architecture rewrite).

2. **Renamed and rewrote the existing button to "Delete account"** — the word "account" is now visible to App Store reviewers. New flow: (a) if user has active subscription, first confirm dialog warns billing continues through Lemon Squeezy and offers to open the customer portal in a new tab to cancel first, (b) confirmation dialog explaining what gets deleted (account, all sessions, encrypted cloud data, "cannot be undone"), (c) type-DELETE-to-confirm prompt, (d) executes in order: sbDeleteCloudData → account-delete function → sign out → local cleanup → reload, (e) success alert before reload.

3. **No changes to existing `sbDeleteCloudData`** — it correctly handles user_data and backups tables via user's own access token (cleaner than admin-API deletion since the user has direct DELETE rights on their own rows via RLS). Build keeps existing data-deletion logic intact.

Build verified: vite build passes, 0 errors, 585 kB main bundle / 146 kB gzipped (small increase from password reset commit, expected).

NOT included in this build:
- Programmatic Lemon Squeezy subscription cancellation. Decision: warn user + open portal instead. Reasoning: programmatic cancel needs write-scope API key (currently read-only) and is more error-prone than letting the user manage billing through the portal we already shipped. User experience is one extra click but the architectural simplicity is worth it.
- Account deletion email confirmation. Apple does not require this. Could add post-launch if support load justifies it.

### 🔑 ✅ Set `LEMON_SQUEEZY_API_KEY` env var on Netlify — DONE May 6, 2026
Set up during May 6 founder account testing. API key created in Lemon Squeezy (named "Stillform Customer Portal", read-only scope), env var added to Netlify with scope "All scopes", site redeployed, Manage Subscription button validated end-to-end (Settings → Account → Subscription → "Manage subscription" → Lemon Squeezy customer portal opens correctly with active subscription details). Originally captured during Termly walkthrough as TestFlight-blocking.

### ✅ First-session metacognition framing lock — SHIPPED May 6, 2026
Closes the May 5 prelaunch gap. The opening tutorial page now carries an explicit category line that draws the line for users arriving with prior wellness-app context. Added between the existing "composure is a skill that builds" framing and the brand sign-off:

*"This is instrumentation for self-mastery. Not therapy. Not meditation. Not coaching. A composure system you operate."*

Names what Stillform isn't (gently — single line, not a manifesto), names what it is (instrumentation, system you operate), draws the category boundary before users see any tool. The opening page is the highest-leverage spot since some users won't make it past page 1 of onboarding. No new screen — adding one creates friction. One pointed sentence integrated into existing copy.

Compliance side benefit captured during the May 5 audit: the medical disclaimers in ToS Sections 27-30 and the Privacy Policy now have a felt anchor in the user's first 60 seconds. The disclaimer language stops being "legal stuff" and becomes "yes, this matches what they told me at the start."

Build verified.

### ✅ Within-session physiology-naming feedback — SHIPPED May 6, 2026 (full scope: Breathe, Body Scan, Reframe)
Closes the session-1 retention gap from the May 5 vision/values review across all three tool completion surfaces. Initial scope claimed Reframe lacked a discrete completion screen — that was a half-checked audit. Reframe's `showPostRating` screen is the equivalent surface (post-state circumplex chips, post-session insight, Next Move with Lock-in). Re-audit corrected the scope and shipped Reframe in the same session.

Three surfaces enhanced — each names the actual neuroscience term that maps to what the tool does:

1. **Breathe + Ground complete screen** — *"You engaged your parasympathetic nervous system through paced breathing and somatic grounding. Practice strengthens the pathway."* Names parasympathetic activation as the physiology.

2. **Body Scan What Shifted screen** — *"You practiced interoception — the awareness of internal body state. It's a measurable skill that strengthens with reps."* Names interoception as the practiced skill.

3. **Reframe Post-Rating screen** — *"You practiced cognitive reappraisal — the shift from reactive interpretation to deliberate framing. It's a measurable skill that strengthens prefrontal-amygdala regulation."* Names cognitive reappraisal (Ochsner & Gross 2002+), the validated neuroscience technique that Reframe operationalizes.

The three-surface set creates a **complete science-of-the-session arc**:
- **Affect labeling** — chip selection (already documented in FAQ and CHIP_DEFINITIONS info modal)
- **Cognitive reappraisal** — Reframe itself (new line)
- **Reflection-on-action** — Lock-in (already cited in info modal: "Schön (1983) calls this reflection-on-action — the most durable form of self-regulation learning")

Each surface gives the user a specific, named, validated mechanism for what's happening in their nervous system. Tone discipline maintained: deadpan, specific, structural, no filler words.

Build verified.

### ✅ Metrics persistence audit + signal awareness latency capture — SHIPPED May 6, 2026
Closes the May 5 read-only audit task plus the one real gap surfaced. Audited five metrics named in the original todo:

| Metric | Status | Notes |
|---|---|---|
| Signal awareness latency (time-to-recognition) | **REAL GAP — fixed today** | Was never captured; now recorded per session |
| Autonomous exit count | ✅ Already works | Persisted with timestamp, queryable, attributable |
| 7-session evidence callouts | ✅ Already works | Computed live from session history with milestone-seen flag |
| Cognitive function measurement scores | ✅ Already works | Persisted with timestamp + accuracy + inhibition + avgReactionMs + falseAlarms (last 20 retained — sufficient for trend analysis, capped depth noted) |
| Body Scan tension data | ✅ Already works | Persisted keyed by area name, aggregatable (commit 3f148b6, May 4) |

**Real gap surfaced and fixed:**
The metacognition flow recorded the *outcome* (autonomous, self-regulated, breathe-redirect, reframe-redirect) but not the *latency* — how long the user sat with the prompt before deciding. For month-3+ value articulation like *"your time-to-recognition has dropped from 45s to 12s,"* that data needed to start being captured at launch. Otherwise the launch cohort permanently has worse data than every subsequent cohort.

**What shipped:**
- `startedAtRef` captured in `MetacognitionTool` on first prompt surface
- `recognitionLatencyMs` field added to both session-storage writes (self-regulated exit + autonomous exit)
- Zero user-facing change — pure data capture
- 3-line addition; no risk to existing flows

**Caveat noted but not fixed:** focus check history caps at 20 entries (`.slice(-20)`). Sufficient for trend analysis (4-6 month windows of weekly checks) but caps historical depth. Not a true gap for V1.

**Tradeoff considered:** could have deferred latency capture to post-launch with the value-articulation surface itself. Decided against — the data has to start being captured *now* or the launch cohort gets shorted. The capture is invisible to users and adds zero risk.

Build verified.

### ✅ Crisis routing depth / warmth gap — SHIPPED May 6, 2026 (entry-context-aware acknowledgment)
Closes the May 5 prelaunch gap with a surgical addition that honors all three constraints (ToS Section 28 cannot be softened, Apple/health-app guidance requires prominent emergency direction, the user might be in acute crisis even with chronic-pattern trigger).

**Audit reasoning:** the crisis screen had three legitimate entry contexts but treated all identically — (1) acute distress (footer/panic-button entry), (2) pattern-triggered chronic state (Category C nudge entry), (3) browsing (exploring Settings → Crisis Resources). The acute framing was appropriate for #1 but mismatched for #2 and #3. Solution: detect entry context and surface a brief pattern-specific acknowledgment ABOVE the existing protective copy when entry source is Category C nudge. The protective copy and resources list remain unchanged.

**Two pieces shipped:**
1. **Entry context tracking** — `handleCategoryCNudgeAction` now writes a sessionStorage entry with source ("category-c-nudge"), subcategory (sustained-flat or sustained-HAN), and timestamp before navigating to crisis screen.
2. **Conditional acknowledgment block on crisis screen** — reads entry context, honors only if recent (60-second window to prevent stale state from earlier navigation), surfaces a brief block above the existing copy when source matches:

   *"Patterns suggest you've been at sustained high activation [or sustained flatness] for two-plus weeks. That's a real signal worth meeting. These resources are here without pressure."*

**Tone discipline:** specific (names the pattern), structural (calls it a signal), respectful (no pressure, no rescue framing). Aligns with locked positioning (instrumentation, not babying). No "just," no soothing-language drift.

**Constraint preservation:**
- ToS Section 28 protective paragraph unchanged below the new block
- Acute entries (footer link, panic button) bypass the acknowledgment entirely — they get the existing acute framing only
- Resources list unchanged — 988/Crisis Text Line still prominent

Build verified.

### ✅ Encryption key recovery clarity — SHIPPED May 6, 2026 (Path C: radical transparency, no key export)
Closes the May 5 prelaunch gap. The open question — should we add key export/backup or commit to device-bound transparency — was decided in favor of transparency after audit weighed user risk.

**Audit reasoning:** the user population (cognitively dysregulated, often dealing with mast cell, neurological, hormonal disruption) is exactly the population most at risk of saving an exported encryption key in places they don't fully think through (screenshots in iCloud Photos, notes in shared family devices, etc.). Making key export easy makes accidental key leakage easy. The privacy guarantee Stillform makes — "your data is encrypted with a key Stillform cannot access" — is worth more to this user base than convenience of cross-device historical data.

**Path A (build key export) deferred** to post-launch unless TestFlight feedback shows users actively want it. Building it without that signal risks creating accidental privacy leaks for the very users Stillform is designed to protect.

**Three pieces shipped:**
1. **Settings → Cloud Sync** — replaced cryptic "Restore works when this device has the original encryption key" line with a collapsible explainer titled "What survives a device change" that names the privacy guarantee, what survives (account, subscription, settings, AI access), what may not (encrypted historical data), and the export path (Download My Data) for users who want to keep historical data across devices.
2. **Privacy & Disclaimers screen → Your Data** — replaced the same cryptic copy with the structured explanation and the export-before-switch path.
3. **FAQ → "What survives if I change phones or reinstall?"** — new dedicated entry with the full structured explanation. Existing "What happens to my data if I cancel?" entry updated to point at the new entry instead of leaving users with the cryptic line.

All three surfaces use the same structured language: privacy guarantee → what survives → what may not → tradeoff named explicitly → user has agency (Download My Data path).

**Tone discipline maintained:** deadpan, specific, structural, no filler words. No instances of "just" in any new copy.

Build verified.

---

## Completed — May 4, 2026

### ✅ Category C gentle nudge — referral to existing crisis resources — RESOLVED May 4, 2026

**Shipped:** Pattern-based trigger only (sustained-flat or sustained-HAN per Russell circumplex; per-session Distant deliberately excluded because Distant after a hard session can be a normal practice arrival per Porges 2011). Surfaces on home screen on next session entry within 24h of triggering pattern. Once-per-Stillform-day cap; two-strikes-and-suppress for 14 days, mirroring existing LOOP_NUDGE architecture (App.jsx lines 1685-1690). Routes to existing Crisis Resources screen (988, Crisis Text Line — already at `screen === "crisis"`) rather than inventing new escalation logic.

**Voice as shipped:** "Resources are here if you want them." + two buttons: "Crisis resources →" / "Not now". No interpretation. No "you've been struggling." No "we noticed." Quiet gray surface, not alarmist amber. The user encounters infrastructure on a calm later moment, not interrupted mid-session.

**Doc-grounded design decisions (preserved for future sessions):**
- Master todo line 295: literature on app-based escalation prompts is "thin, not contested" — clinical-judgment call without strong empirical guidance, so the nudge is conservative.
- Master todo line 297: "Refer users to the existing Crisis Resources screen rather than invent new escalation logic. Stillform is not a clinical replacement."
- Science sheet line 155: "Stillform doesn't tell the user how they're doing. The user tells Stillform via the chip they picked." This ruled out "you've been struggling" framing.
- Locked decision line 33: "Future copy must NOT pull toward repair / trauma / intensity / 'carry a lot' framing." Ruled out emotional commentary copy.
- Master todo line 299 (Arlin's words): "If they need to be medicated, that's on them. The app isn't a substitute for clinical care." Scope statement: nudge surfaces, doesn't recommend.
- Comprehensive brief line 358: "Quick Breathe always free — anyone in crisis can use it without paying." Confirms emergency paths already exist; the nudge is for trajectory observation, not crisis interruption.

**Trigger logic decision (Arlin choice May 4, option 2):** Pattern-based only, NOT per-session Distant. Per-session Distant after one hard session could feel alarmist and contradict the "system observation paired with explicit override pathways" architecture (locked decision line 24). Per-session Distant landings still get classified as Category C in the data feed; they just don't fire this nudge. The 14-day pattern threshold is what "concerning trajectory" means.

**What was NOT built (per voice grounding):**
- Differentiated copy per subcategory (sustained-flat vs sustained-HAN). Differentiating would put the system in the diagnosing seat.
- Notification/push escalation. The nudge is in-app passive, never an interrupting notification.
- "We recommend you talk to someone" language. Recommendation crosses into clinical advice.
- Frequency tracking exposed to user ("you've seen this X times"). Would invite performative avoidance.

Storage keys: `stillform_category_c_nudge_dismissed_day`, `stillform_category_c_nudge_dismiss_streak`. Added to SYNC_KEYS, UNENCRYPTED_SYNC_KEYS (dismiss tracking is not sensitive — doesn't need encryption like the shift events themselves), and account purge keysToRemove list. Plausible events fire on actioned/dismissed with subcategory + dismiss_streak props.

### ✅ "Get ready" Reframe mode label — RESOLVED May 4, 2026 (no code change needed)

The user-facing concern was solved Apr 30 in the modeConfig refactor. App.jsx line 7771 inline comment confirms: *"title and subtitle fields removed Apr 30 — verified unused (mc.title and mc.subtitle never referenced). Mode identity is carried by the icon (◎/✦/◌) plus AI prompt behavior, not by a title field."* The "Get ready" label that the original entry described as appearing in the upper-right of Reframe screen no longer exists in the user's view.

Two non-user-facing uses remain and are appropriate by design:

**App.jsx line 7652** — AI prompt context block telling the AI what mode a prior conversation came from ("USER'S PRIOR CONVERSATION from Get ready mode, same session..."). The user never sees this string. Changing it would only complicate the prompt without changing AI behavior.

**App.jsx line 18433** — Saved Reframes archive in Settings/My Progress. When a user views their saved reframes weeks later, the mode tag ("Talk it through", "Break the loop", "Get ready") combined with the saved reframe content provides full context. "Get ready" is a faithful plain-language summary of what hype mode is — per HYPE_SYSTEM in reframe.js line 952, hype is for "right before something that matters: public speaking, stage performance, a difficult conversation, a job interview..."

**Doc grounding for closure:**
- App.jsx line 7771 comment confirms Apr 30 removal of the user-facing title/subtitle fields
- HYPE_SYSTEM in reframe.js line 952 makes "Get ready" precise to the moment hype mode targets
- Locked decision line 24 (closing language stays as-is when it's "precise observation paired with explicit override pathways") — "Get ready" is precise to the moment; the override pathway is mode switching

What was NOT done (deliberate): rename to abstract terms ("Lock in", "Sharpen") would require new first-time-viewer context and offers no improvement over the existing label.

### ✅ "Calm my body" hero CTA doesn't act on tap — RESOLVED May 4, 2026
Reported behavior was a deploy/publish artifact, not a code bug. Arlin tested the CTA on a build that hadn't been deployed and published yet. After deploy + publish, the CTA acts on tap as intended. Static analysis (full trace of click handler → startPathway → startTool → setScreen → BreatheGroundTool mount → hashchange listener) had already shown no break in code, which is consistent with this resolution. No fix needed. Diagnostic console.log shipped in commit 089acffa98 can be removed in next cleanup pass.

(Other items from Apr 27-28 testing — optionality decisions, trees theme fix, Resolved Apr 28 morning items — all RESOLVED May 2. Full records in Completed archives.)

---

## Completed — May 2, 2026

### ✅ SECURITY-CRITICAL — Encrypt all sensitive on-device localStorage (commit ef8d8008)
Extended existing AES-GCM `secureSet`/`secureGet` infrastructure to wrap all sensitive localStorage keys. Same key management pattern (per-device key in IndexedDB), no new primitives. Closes the gap between cloud (already AES-GCM encrypted before upload) and device (previously partially protected — only Reframe AI conversations).

Keys now encrypted: `stillform_sessions`, `stillform_journal`, `stillform_signal_profile`, `stillform_bias_profile`, `stillform_checkin_history`, `stillform_eod_history`, `stillform_communication_events`, `stillform_tool_debriefs`, `stillform_focus_check_history`, `stillform_feelstate`, plus settings/preferences/regulation type/biometric flags.

Why this was launch-critical: a prestige composure architecture cannot ship with users' raw emotional content sitting in plain text on their device.

### ✅ Reframe tone — auto-detect + in-Reframe dropdown + personalization default (commit f36cdb63)
Three-layer system shipped replacing the Settings-only static tone choice.

**Layer 1 (auto-detect):** detectSuggestedTone helper computes tone from bio-filter / feelState / input per render. Rules: depleted/pain/sleep → gentle, excited → motivational, focused → direct, long+distress → gentle, long+composed → clinical, otherwise null.

**Layer 2 (in-Reframe dropdown):** Static tone label (line ~6578) replaced with tappable dropdown showing Reason header (Auto/Session/Default) + 5 options with descriptions + reset link. Manual selection sets sessionToneOverride which takes top priority. Surfaces the *reason* for auto-selection ("Gentle — because you marked depleted") — metacognitive surface (Pillar 1).

**Layer 3 (Settings personalization):** Default tone selection now includes Balanced (was missing). New 'How your default applies' toggle: 'Use my default' (override) vs 'Auto-suggest, default as fallback' (fallback). Override is recommended default per spec — Stillform doesn't presume to know better than the user.

`stillform_ai_tone_mode` added to SYNC_KEYS / UNENCRYPTED_SYNC_KEYS / keysToRemove. rehydrateAfterSync extended to restore tone + mode after cloud sync. resolveActiveTone surfaces source ('auto' / 'session' / 'default' / 'fallback') so user always sees why a tone is active.

### ✅ Unified text capture for AI context (commits 20a0810a + bbb0f07b + 556a91bc + 3f033319)
**Spec source:** Arlin direction May 2 — "I want AI to capture all text areas, not just in self mode, in all of them. So specifically in what shifted captured by AI. So we have the data points so we can move forward and guide them the correct way."

**Shipped:** New `buildUnifiedTextContext` aggregator in App.jsx pulls recent text from every persistence store on the device:
- `stillform_shift_events` → shiftLabel free-text from Body Scan + Reframe What Shifted moments
- `stillform_sessions` → responses{} from Self Mode 5-step protocol
- `stillform_grounding_data` → text from grounding 5-senses writes
- `stillform_journal` → existing Signal Log entries

Defaults: 20 entries, 14-day lookback, sorted newest first. Uses `TimeKeeper.clockDayOf` for proper local-day extraction.

**Wired into reframe.js:** New `textHistoryContext` parameter alongside `journalContext`. Same session-count gating: at sessionCount ≥ 3 AI uses for pattern recognition; at < 3 context only. AI is instructed never to quote text back verbatim, never to flag AI-down gaps in conversation.

**AI-down resilience (Arlin's specific architectural ask):** Aggregator is a synchronous read of localStorage. No network dependency. When the user writes into any textarea during an AI outage:
1. Text persists locally regardless of network state (storage was always local-first)
2. The runSelfGuidedFallback path handles the AI-down user experience at the UI layer
3. When AI returns, buildUnifiedTextContext reads whatever's in localStorage — including everything written during the gap
4. No special "catch up" code needed because the data layer was never AI-dependent

**Pre-deploy stumbles (operating-rule violations on Claude's part):** Initial commit shipped `s.timestamp.slice(0, 10)` — TimeKeeper guard caught it; should have used `TimeKeeper.clockDayOf` from the start (fixed in 556a91bc). Initial commit used `// ===` decorative dividers; preflight's merge-marker check matched the pattern (replaced with U+2500 box-drawing chars in 3f033319).

### ✅ FAQ enhancements (commit bdf3570a)
Search bar with no-results state. Chip navigation at top (auto-expand + smooth scroll to target). Collapse-by-question with rotating chevron. Mailto email link with pre-filled subject (ARAembersllc@proton.me). The 'How do the feel chips work?' entry already existed in the FAQ items array (Apr 29 work). Two useState hooks added (faqSearchQuery, faqExpandedSet) alongside existing faqBackScreen. Stable question IDs (slugified) used for both chip nav and expanded-state tracking.

### ✅ Memory reconsolidation grounding for Reframe (commit b3292a97)
Added "Why Reframe?" info button next to the AI tab in ReframeTool. Cites Ecker, Ticic & Hulley (2012); Schiller et al. (2010, *Nature*); Lane et al. (2015). Frames why repeated Reframe sessions on a recurring trigger update what the trigger means at the memory level. Connects to the Pattern Disruption Layer spec — repeat Reframes are reconsolidation opportunities, not redundant work.

### ✅ Predictive processing grounding for bio-filter (commit b3292a97)
Extended the existing "Why the bio-filter?" modal (line 3889) with a second paragraph citing Seth (2013); Barrett & Simmons (2015). Frames bio-filter as updating the brain's predictive model of itself — the same situation interpreted through a depleted body produces a different prediction than the same situation interpreted through a rested body.

### ✅ Salience network reset grounding for body-first pathway (commit b3292a97)
Added "Why Body Scan?" info button next to the "Body scan." header in BodyScanTool intro phase. Cites Menon (2011). Frames Body Scan as an attentional rerouting tool, not a calming technique — pulling attention into the body interrupts the salience network's stuck cognitive priority.

### ✅ ACT cognitive defusion lineage acknowledgment (commit 2218f2b0)
Upgraded the Self Mode tab info from static tooltip to full info modal. Names primary lineage as Metacognitive Therapy (Wells 2009) and explicitly acknowledges ACT cognitive defusion (Hayes, Strosahl & Wilson 1999; Han & Kim 2022) as parallel research converging on the same underlying mechanism. MCT remains primary framework as required.

### ✅ In-app info button copy alignment with Apr 28 Science Sheet corrections (commit 71f64903)
11 corrections committed to Science Sheet Apr 28 (commits 175bb6e4 through 9536e676). Audit completed May 2 against all 18 info modals in App.jsx.

**Two real misalignments fixed:**
1. "Why name your state?" modal claimed pre-Reframe-entry naming reduces amygdala activation — now contradicted by Nook 2021 crystallization correction. Reframed to position chip selection as context-setting for the AI, not as the amygdala-reduction effect (which is preserved for POST-regulation labeling claims).
2. "Sessions" modal claimed each session is autonomic flexibility training — overclaim per Science Sheet line 441 which explicitly says Stillform doesn't measure HRV directly. Softened to "regulation practice" with literature framed as "mechanism Stillform draws from."

16 other modals audited and confirmed aligned with current Science Sheet (Yoo 2007 bio-filter, Lieberman + Vine + Nook for What Shifted, Schön for Lock-in, Barrett for Signal Log, Gollwitzer for Next Move + outcome, Meichenbaum for Day Streak, no overclaim for analytical metrics).

### ✅ Optionality decisions resolved — 4 of 5 fully resolved; Decision 3 reframed
The Apr 28 audit identified mechanisms the science sheet names as core training but that were optional or skippable. All five gating decisions resolved May 2:

1. **Lock-in card confirmation** (commit `432e4018`): Required when Next Move selected. Finish button disabled (40% opacity, not-allowed cursor) when `postNextMoveId && !lockInConfirmed`. Schön (1983) reflection-on-action + Lavi-Rotenberg 2020 MERIT — durability mechanism preserved.
2. **Post-rating chip selection** (commit `9a64577b`): Required with "Unsure" as the legitimate honest exit. 10th chip "Unsure" added to post-rating row in both Reframe and Body Scan What Shifted. Finish button disabled when postRating is null. classifyShiftDirection gains explicit unsure handler returning `nullReason: "user-unsure"`. Lieberman 2007 + Vine 2019 + Nook 2021 — affect-labeling mechanism preserved without forcing inaccurate labels.
3. **What Shifted textarea** — reframed from "should we keep it?" to "should we capture and surface what users write?" — capture shipped via the unified text aggregator (commits `20a0810a` + `3f033319`). Required-vs-optional toggle decision deferred.
4. **Bio-filter for body-first users** (commit `fd09bf0b`): Skip → button removed; bio-filter now a required gate for everyone. Pre-selection from getActiveBioFilter() reads today's prior reading and pre-highlights matching option. Pain Active routes to bio-filter-suggest-scan sub-phase showing soft suggestion (Eccleston & Crombez 1999 + Kabat-Zinn 1982 + Reiner 2013 + Farb 2013) with two paths — Body Scan first or Continue to Breathe anyway (preserves autonomy).
5. **Calibration "Skip this step"** (commits `954e5d96` + `e485c5c7`): Replaced with "Use defaults →" on calibration step 2. Sets `localStorage.stillform_calibration_deferred = "yes"` and proceeds to home. No fake profiles created; signalProfile and biasProfile remain null. AI receives a context note explaining the user has not completed calibration and should engage as a new user, avoid pattern claims about body signals or thinking patterns, and limit to discovery questions when relevant. SignalMapTool and MicroBiasTool save handlers automatically clear the deferred flag.

**Citations (verified May 2):** Liu et al. 2025 meta-analysis of 79 RCTs (Deakin University, *via HCPLive Feb 2026 / AJMC Nov 2025*) — mental health app attrition averaged 18.6% at endpoint and 28.4% at follow-up, 49% higher than waitlist controls. UXCam 2026 best-practices analysis, Zigpoll 2025 onboarding research, multiple 2026 sources on deferring optional setup.

**Note on a prior fabricated citation (called out for the record):** an earlier version of this entry attributed the recommended fix to a "JAMA Psychiatry 2025 meta-analysis on hard-gating attrition risk." Claude wrote that citation today (May 2) without verification and propagated it through master todo, transfer doc, state-of-may-2 doc, and conversation responses. After Arlin pushed back, web search confirmed the cited study does not exist as described. The architectural argument for the fix stands on the verified sources above; the fabricated citation is replaced. Lesson preserved.

### ✅ Trees in Body Scan / Breathe theme mismatch (commit `5ef150d8`)
FractalBreathCanvas trees now use `var(--text-muted)` per-frame so they follow the active theme. Amber glow under the ring preserved as the warmth anchor.

---
## Completed — April 30 / May 1, 2026

### ✅ ToolDebriefGate friction reduction — SHIPPED Apr 30 (commit 51493cce)
The 20-second forced wait dropped. Continue enables on selection alone. Copy softened from "20-second capture required before exit" to "Take a moment to name what you used." Skip button added in footer (same skip pattern as What Shifted and Next Move). All three completeDebriefGate functions (Breathe / Body Scan / Reframe) updated to capture `skipped:boolean` on stored debrief record + new Plausible event "Tool Debrief Completed" with tool + skipped props for cohort visibility into engagement-vs-skip rates per tool.

What stayed: header copy, three preset options + "I need another pass to lock this in" fourth option, Continue as primary CTA, tool-specific and regulation-type-specific options (Pillar 1 metacognition load-bearing science).

This was the small focused engagement craft change that addresses Round 2 consultation finding ("close feels heavy") without committing to the full kinesthetic close redesign. The kinesthetic close spec is still next session.

### ✅ Plain-Language Neuroscience Surface — SHIPPED May 1, 2026 (8 commits + 3 follow-up build fixes)
Second engagement mechanic Arlin flagged interest in alongside Cognitive Function Measurement. Now live as the Plain-Language Neuroscience Surface — post-session card that surfaces one finding from a verified 36-entry corpus tied to what the user just practiced.

**Architecture:**
- AI-generated at runtime via reframe.js with mode='science_card'
- 36-entry verified corpus, every entry traceable to a Science Sheet section (Protection C: paraphrased from Science Sheet's own framing, not training-data recall)
- 20 hand-written static fallback cards activate on any AI failure
- Variety guard via stillform_card_history localStorage (last 5 topics retained)
- Three protections: SEVERE-failure system prompt rule (A) + server-side citation validation against SCIENCE_CARD_VALID_CITATIONS Set (B) + Arlin verification pass on corpus before ship (C — pending)
- ⓘ button on card opens info modal explaining the three card types (AI-generated / static fallback / generic)
- 4 Plausible events: Science Card Shown / Continued / Skipped / Info Opened
- Once per session. Skip button. Shows on first session.

**Insertion point:** post-session, after What Shifted (Body Scan) and post-rate (all tools), BEFORE ToolDebriefGate. Each tool's `if (debriefTarget)` block now renders ScienceCard first if scienceCardShown is false.

**Cost:** ~$0.002/card via gpt-4o; ~$1.50/user/year at 2 sessions/day. Negligible against subscription.

**Ship arc — 8 commits + 3 build fixes May 1:**
- 5a773785 — Spec v2 with verified corpus + 20 static cards + ⓘ modal copy + 3 protections
- c18d7fc3 — Server side: corpus + routing + system prompt builder + science_card branch in handler + Protection B validation
- 2d9007ce — Frontend foundation: ScienceCard component + STATIC_SCIENCE_CARDS array + helpers + ⓘ modal + 4 Plausible events
- 6cf4b8fe — Wiring: ScienceCard inserted into close flow of Breathe, Body Scan, Reframe with scienceCardShown state per tool
- 821faa09 — FIX: ScienceCard React imports (had used React.useState namespace pattern; codebase uses named hook imports; build was failing on Vite's "React is not defined")
- 64c2e3b1 — FIX: Literal backslash-n in scienceCardShown state declarations (Python string escaping issue in build script; three places had broken JSX syntax)
- fc4e8158 — FIX: Decorative comment dividers tripping Security Gate (// =====... matched git conflict marker regex; replaced with dashes)
- Final state on main: all checks pass, Security Gate green

**Engineering lessons from the three broken commits:**
- React component patterns must match existing codebase (named hooks, not namespace) — should be checked before writing component
- Python scripts that build JS files must not embed `\n` in string replacements — triple-quoted strings or direct file write only
- Decorative comment dividers must avoid `=======` pattern (matches git conflict marker regex in Security Gate)
- After every code commit, file should be re-read from main and visually inspected for obvious issues — three commits today shipped with bugs that re-reading would have caught
- "Shipped clean, ready for trigger" is the wrong framing when only Security Gate proves clean — should be "shipped, awaiting Security Gate green"

### ✅ What Shifted three-category data feed — SHIPPED Apr 30 (commit 890469aa, combined with Body Scan What Shifted)
Russell circumplex three-category classifier implemented (Russell 1980 J.Pers.Soc.Psychol. 39:1161-1178, confirmed Watson 2024). Pure function `classifyShiftDirection(preState, postState, sessionContext)` returns Category A (regulated shift), Category B (persistent state), Category C (concerning shift), or null with reason. Schema versioned at v1 — never recompute existing entries.

**Architecture:** SHIFT_CHIP_QUADRANTS maps all 9 chips to Russell quadrants (HAP/LAP/HAN/LAN/cognitive/undifferentiated). Pattern-context helper (`getRecentSustainedPatterns`) computes sustained Flat ≥5 / sustained HAN ≥5 in 14-day window. Storage key `stillform_shift_events`, capped at 2000 entries. buildShiftEvent helper assembles full event with bioFilter, sessionCount, regulationType frozen at write-time.

**Wired into:** Reframe finishStateToStatement (classifier runs on State-to-Statement complete + skip paths), Body Scan What Shifted (handleWhatShiftedLockIn + handleWhatShiftedSkip), Plausible "Shift Classified" event with 4 props (category, subcategory, tool, mode) — zero user identifiers, zero chip values, zero free text.

**Privacy architecture preserved:** Aggregate-anonymous → Plausible (Stillform sees percentages across users); per-user encrypted on-device → My Progress (Stillform never sees individual data).

Spec at THREE_CATEGORY_DATA_FEED_SPEC.md (committed to repo root). My Progress visual integration ships in My Progress redesign (deferred — needs real categorized data accumulation post-publish).

### ✅ Body Scan post-completion What Shifted moment — SHIPPED Apr 30 (commit 890469aa, combined with three-category data feed)
What Shifted screen added to BodyScanTool. After 6-point sequence completes, "Signal cleared" → 2s pause → What Shifted screen (post-state chip picker + collapsed-by-default optional free-text label + Lock it in / Skip buttons). Russell-grouped chip ordering. Pre-state shown as "Started: X" for orientation. Lock-In disabled until post-state selected. After lock-in or skip, queueDebriefAndCompleteNow runs the existing ToolDebriefGate. Closes Pillar 1 metacognitive gap.

State additions: showWhatShifted, postStateChip, shiftLabel, shiftLabelExpanded, shiftSkipReason. Handlers: handleWhatShiftedLockIn / handleWhatShiftedSkip. Pre-push audit caught wrong-tool placement bug (handlers initially placed in BreatheGroundTool scope) — fixed before push.

Spec at BODY_SCAN_WHAT_SHIFTED_SPEC.md (committed to repo root).

### ✅ Settled chip — low-arousal positive — SHIPPED Apr 30 (commits 768b56ed in App.jsx + ad4a43f1 in reframe.js)
Settled added as 9th chip. Russell-circumplex-grouped chip ordering implemented at all chip render sites: Excited · Focused · Settled · Anxious · Angry · Stuck · Mixed · Flat · Distant. AI prompt branch added in reframe.js feelMap for maintain-state framing (no regulate-down posture, surface patterns more freely, no Self Mode nudge, no protective suppression). Chip definition copy committed via CHIP_DEFINITIONS.md (Arlin approved).

**Why this mattered for the data feed:** Without a low-arousal positive chip, Category A (regulated shift) was impossible to detect when users actually arrived at the regulated state. With Settled live, the three-category framework works end-to-end.

Spec at SETTLED_CHIP_SPEC.md (committed to repo root).

### ✅ Chip ⓘ button — define what each chip covers — SHIPPED Apr 30
CHIP_DEFINITIONS registry added to App.jsx as top-level constant. ⓘ buttons wired at all 3 chip render sites (Body Scan What Shifted, showPostRating, PresentStateChips). Per CHIP_DEFINITIONS.md (Arlin approved Apr 30 after copy review).

Each chip definition is ~40-60 words, anchored to reframe.js feelMap voice but rewritten for user-facing context — no clinical jargon, no pathologizing, body and mind both named, tells user what selecting the chip does in the system. Tapping ⓘ opens existing setInfoModal pattern.

ARIA labels added on every ⓘ button — addresses part of the prelaunch ARIA sweep item.

### ✅ Cyclic sighing as third breathing option — SHIPPED Apr 30
Cyclic Sighing added as third breathing pattern alongside Quick Reset and Deep Regulate. Protocol implements published Balban et al. 2023 (Cell Reports Medicine 4:100895, n=111 Stanford RCT under Spiegel/Huberman/Balban) exactly: Inhale 1 (deep, nasal) 4s + Inhale 2 (top-off, nasal) 1s + Exhale (slow, oral) 8s. 1:2 inhale-to-exhale ratio. 5 minutes recommended (~23 cycles).

Settings picker entry cites the published study. Default behavior preserved — Quick Reset stays default for new users; cyclic_sigh is opt-in.

**Outreach implication:** Now that Stillform implements her published protocol, this is the single strongest credibility lever for outreach to Dr. Melis Yilmaz Balban (founder of NeuroSmart, top outreach candidate per memory). Direct research overlap, non-competing market.

### ✅ Reframe title doesn't reflect mode — SHIPPED Apr 30
**Investigation finding:** the bug as described in the original todo entry doesn't exist in the codebase. Audit found that `modeConfig.title` and `modeConfig.subtitle` were defined but NEVER referenced anywhere in the rendering. The only 'Talk it out' the user sees is the home page CTA at App.jsx line 13977, already conditional based on regulation type. Inside Reframe, mode identity is carried by the icon glyph (◎ calm / ✦ clarity / ◌ hype) plus AI prompt behavior — not by any title field.

**Resolution:** removed the dead `title` and `subtitle` fields from modeConfig (6 dead lines across calm/clarity/hype entries). No user-facing change.

### ✅ Low-demand mode Phase 1 (Breathe) — SHIPPED Apr 30 (commit 81e2c0b7)
Decision-locked architecture: low-demand is a state-of-existing-tool, not a separate tool. Triggered by `bioFilter.includes("medicated")`. No home-screen entry — activates within existing flow when bio-filter signals it.

**Phase 1 changes:**
- isLowDemand derived state at top of BreatheGroundTool
- Phase init bypass: phase=='breathe' on entry (skips pre-rate, skips bio-filter screen)
- Audio force-enabled in low-demand (overrides user's saved setting). Per the science: paced auditory cueing is mechanism for cognitively-compromised users (Balban 2023, Ochsner & Gross 2005), not preference. Audio infrastructure was already built — this commit gates it on for the cohort that needs it.
- Three-rounds-done screen replaced with low-demand minimal-completion render: pulse circle + "Tap anywhere to close" label. Bypasses three-button decision.
- Tap-anywhere-to-exit with 1.5s grace period (lowDemandGraceOverRef prevents entry-tap from immediately dismissing).
- Debrief gate + Next Move screen bypassed entirely. Direct call to onComplete(undefined). No metacognitive demand on a cognitively-impaired user.
- Session still auto-saves with source='low-demand-complete' for record integrity.

(Broad-design decision rationale captured in Locked Decisions section at top of master todo.)

### ✅ "Composure is a practice. You're building it." copy fix — SHIPPED Apr 30
Replaced with "Composure is the foundation. You are its architect." Foundation/architect frame is precise to what Stillform actually is — composure is the outcome (the foundation that gets built), user is the architect (active agent), Stillform is the architecture/practice through which it's built. Per Science Sheet line 11: composure is outcome, metacognition is mechanism. Committed to App.jsx line 16032.

---
## Completed — April 28, 2026 (morning)

Three-commit research-driven cleanup. Triggered by Arlin's pushback "the whole app is based off proven research and if it's been debunked then we need to change it now" after the morning research audit found that `Stillform_Science_Sheet.md` line 410 was citing science contradicted by Nook 2021 + 2024-2025 replications.

- [x] **Science Sheet update** (commit `a121a48a`) — the "What Shifted — Post-Session Affect Labeling" section was citing only the Lieberman 2007 affect-labeling tradition. That framing has been refined by replicated work post-Lieberman: Nook, Satpute & Ochsner (2021, *Affective Science*) showed that emotion naming impedes BOTH cognitive reappraisal AND mindful acceptance strategies — not just intensifies the state, but "crystallizes" it (solidifies initial appraisals, limits generation of alternative appraisals). The 2025 Springer paper (N=226, two studies) replicated. The 2024 BMC Psychology fNIRS paper confirmed at the neural level. Updated section now cites Nook 2021 + 2024-2025 replications + Vine et al. 2019 (free-text labels stronger than predetermined choices). Five new citations added. Mechanism description updated from "intensification" to "crystallization." Design rule unchanged: regulate first, label after — but now defended by current literature instead of dated-only-Lieberman framing. Honest engagement with current research is what the product's "based on proven research" claim requires.

- [x] **Pre-regulation chips removed from Breathe and Body Scan** (commit `ae43f4db`) — `<PresentStateChips>` was rendered in three locations: BreatheGroundTool pre-rate (line 3228), BodyScanTool pre-rate (line 3880), and ReframeTool entry (line 6568). Per Nook 2021 + replications, the first two locations were science violations — pre-regulation labeling crystallizes the affective state. Removed from Breathe and Body Scan pre-rate. Stays in Reframe entry (defensible because Reframe IS cognitive intervention; labeling there is part of the regulation mechanism per Lieberman 2007, not pre-regulation cognitive load). Inline comments left at each removal site citing the research so future contributors don't reintroduce pre-regulation chips without checking the literature. State implications: `feelState` state hooks preserved in BreatheGroundTool/BodyScanTool for post-rating use; `preState` field in saved sessions now reflects morning check-in inference OR null, no longer in-the-moment chip override (acceptable — morning check-in was already primary data source; chips were redundant data parity). The PROCESSING_PRIMER copy ("Downshift physiology first; your cognition clears after the body settles") is no longer contradicted by the screen layout.

- [x] **Post-Reframe screen cleanup + Send-a-message CTA wired in** (commit `c86ec0ba`) — three architectural problems compounded each other in the post-Reframe finish flow. **(A)** Two completely unreachable screens existed in the codebase: `if (showStateToStatement)` block (80 lines, setter only fired from `continueFromPostInsight`) and `if (showPostInsight && postSessionInsight)` block (28 lines, setter never called from anywhere). Verified via grep — zero callers in live code paths. Both screens removed plus their helper functions (`finishStateToStatement`, `skipStateToStatement`, `continueFromPostInsight`) and orphaned state hooks (`showPostInsight`, `showStateToStatement`). **(B)** The live What Shifted block had identity confusion — wrapper text said "naming consolidates the regulated state" while textarea placeholder said "Draft one clear message you can send now" and had Copy/Share/Mark sent buttons attached. Single UI element trying to serve two distinct mechanisms (Lieberman affect labeling vs external communication) with contradictory copy. Stripped the message-drafting overlay; What Shifted now serves only post-regulation affect labeling per Lieberman 2007 / Vine 2019 / Nook 2021. Toggle label changed from "▸ What shifted? (optional)" to "▸ What shifted?". **(C)** Added Send-a-message expansion under Next Move — when the user selects the "Send a message" chip, an expansion appears immediately (BEFORE Lock-in) with "Draft the message" header, textarea, and Copy/Share/Mark sent buttons. Per Gollwitzer 1999 + Hallam et al. 2015 fMRI study + Sheeran 2016 review of intention-behavior gap research: implementation intention specificity at the moment of intention formation is what closes the intention-behavior gap. The chip selection is the science-required if-then plan formation; the textarea is execution rehearsal that helps users carry it out. Drafting is OPTIONAL (chip = required intention formation; drafting = aid). Only "send-message" gets the expansion this commit; "Hold a boundary" might benefit similarly but the literature on boundary-statement drafting is not specifically researched, deferred to v2 if testing surfaces user demand. New state: `messageDraft`, `messageDraftCopied`, `messageDraftSent` separate from `externalAnchorDraft` (which now serves only as What Shifted affect label) so the two textareas don't collide. New helpers: `copyMessageDraft`, `shareMessageDraft`, `markMessageDraftSent` parallel to existing externalAnchor helpers, separate Plausible event namespace ('Message Draft' vs 'State to Statement'). Render order in `showPostRating` screen verified: FEEL CHIPS → POST SESSION INSIGHT → NEXT MOVE chips → SEND A MESSAGE expansion (when active) → LOCK-IN card → WHAT SHIFTED textarea → Self Mode nudge → FINISH session. Each element does ONE job, in the right scientific order. Net line change: 15,960 → 15,881 lines (-79 net) — removed ~180 lines of dead code + duplicate textarea infrastructure, added ~60 lines for new Send-a-message expansion + helpers. Codebase is leaner and more honest about what each piece does.

**Verification across all three commits:**
- esbuild parse: clean (exit 0)
- Undefined-component preflight: clean (exit 0)
- No remaining references to deleted functions or dead state in code (only in explanatory comments)
- New mechanisms verified present at expected locations

**Companion documents created during this session** (in `/mnt/user-data/outputs/`, not in repo):
- `OPTIONALITY_PLACEMENT_AUDIT.md` — initial audit mapping science sheet mechanisms to live code
- `RESEARCH_AUDIT_OPTIONALITY_VERDICTS.md` — research-driven audit using web search of post-2021 literature; identified the Nook 2021 contradiction
- `PRE_RATE_FLOW_DESIGN_MEMO.md` and `PRE_RATE_FLOW_PROMPT_V2.md` — design analysis with multi-AI input from earlier in the session

---
## Completed — April 27, 2026

- [x] **Undefined-component preflight guard** — new `scripts/check-undefined-components.mjs` script wired into ship-preflight.mjs. Parses App.jsx for every `<PascalCase>` JSX usage and every `(function|const|let|var|class) PascalCase` declaration, fails if any usage has no declaration. Catches the bug class that shipped FocusCheckValidation, PanicMode, and FractalBreathCanvas as silent crashes (esbuild parses these as valid; they only crash when the rendering path is hit at runtime). Whitelists React/library names + ErrorBoundary. Tested both ways (passes against current state, correctly catches artificial regression). Should have existed before today — adding it now closes the gap that let three components ship as undefined references over a 36-hour window. Commit 089acffa98.
- [x] **PanicMode + FractalBreathCanvas restored** — same yesterday-deletion that took FocusCheckValidation (commit 571074ee7381, "-600 lines") also took these two. PanicMode (329 lines) is the Quick Breathe panic screen — tapping the QB pill anywhere in the app fired `setScreen("panic")` which rendered an undefined component → ErrorBoundary crash. The QB pill (the safety valve users rely on when activated) had been broken since Apr 26. FractalBreathCanvas (99 lines) is the visual grounding canvas inside Breathe, only rendered when the bgtVisualGrounding setting is on. Both restored verbatim from commit efc17183f6b5. Commit 089acffa98.
- [x] **Duplicate ⓘ button on hero card removed** — absolute-positioned "Why 60 BPM?" ⓘ at top:0/right:0 was rendering adjacent to the inline "Why body first?" / "Why thought first?" ⓘ next to the italic subtitle, creating visible duplicate ⓘ where the corner one looked empty/orphaned. The 60 BPM concept is subtle by design — explaining it next to a separate inline ⓘ created visual noise without payoff. Inline contextual ⓘ retained. Commit 089acffa98.
- [x] **Diagnostic instrumentation for "Calm my body doesn't act" bug** — temporary console.log added to hero CTA onClick that surfaces runtime values at click time (regType, isBodyFirst, isThoughtFirst, bioFilter, offBaseline, hasPain, priorChoice, showBioFilterSuggestion, showObserveEntry). Static analysis traced click handler → startPathway → startTool → setScreen → BreatheGroundTool mount → hashchange listener with no obvious break, so runtime data is needed. Marked clearly as temporary instrumentation to remove once root cause identified. Next time Arlin taps the button, browser DevTools console (or Chrome remote debugging via chrome://inspect) will reveal which branch the click takes (or doesn't take). Commit 089acffa98. **Update May 4, 2026:** the underlying bug turned out to be a deploy/publish artifact, not a code defect — Arlin tested before the build was deployed and published. CTA acts on tap as intended after deploy + publish, consistent with the static-analysis finding of no break in code. Diagnostic console.log can be removed in next cleanup pass.
- [x] **Four bugs found by Arlin testing on phone** (commit 3bf9dfa0):
  - **getFocusCheckHistoryFromStorage helper restored** — called 4 times in App.jsx (lines 6983, 6989, 7062, 8057) but never defined. Same root cause as FocusCheckValidation deletion: commit 571074ee7381 deleted both the component AND its supporting helper. Yesterday I restored only the component and missed the helper, so the app crashed on Finish session in Reframe (path traverses helper indirectly), opening My Progress (line 8057 calls helper directly on mount), and Composure Check (FocusCheckValidation calls it on mount). All three crashes propagated to ErrorBoundary showing "Something went wrong." Restored from commit efc17183f6b5, placed immediately above FocusCheckValidation matching original structure.
  - **Duplicate Next Move screen on Reframe Finish** — finishReframeSession saved the inline Next Move chip selection to the session record AND called queueDebriefAndComplete which set nextMoveTarget triggering a SECOND Next Move screen. User picks "Send a message" inline → hits Finish session → forced to pick again on a separate screen. Fix: added hadInlineNextMove flag captured before clearing postNextMoveId. If user selected inline, skip to queueDebriefAndCompleteNow (no second Next Move screen, straight to debrief gate).
  - **ⓘ button tap-through bug** — "What shifted? (optional) / ▾ Hide" toggle button at line 6408 had the ⓘ info button NESTED INSIDE it as a child element. HTML buttons can't contain other interactive elements; tapping the inner ⓘ bubbled the click to the parent toggle, collapsing the section instead of opening the info modal. Fix: restructured as flex container with two SIBLING buttons — toggle on left, ⓘ on right. Added e.stopPropagation() on the info button as defense-in-depth.
  - **ErrorBoundary theme mismatch** — boundary used hex literals (#C8922A bg, #0A0A0C text, etc.) so on Suede/Teal/Rose/Light/Midnight themes the crash screen showed dark-theme gold. Fix: use CSS custom properties with hex fallbacks (var(--bg, #0A0A0C), var(--amber, #C8922A), var(--text, #E8EAF0), var(--text-muted, #9496A1), var(--btn-primary-text, #0A0A0C)). Themes set these on document.documentElement so they're available even when React's tree errors out. Fallbacks ensure the boundary still renders if vars are unset.
- [x] **FocusCheckValidation component restored** (commit b98d347f) — Composure Check screen rendered as blank white. Component was referenced at two call sites (line 11569 inside tutorial focus-check briefing, line 13600 for the focus-check screen) but was never defined — yesterday's commit 571074ee7381 ("Remove Composure Check description") deleted 600 lines including the entire FocusCheckValidation function. Esbuild parses JSX with undefined components as valid; only runtime crashes. Composure Check was broken on stillformapp.com for over 24 hours without any preflight or smoke check catching it. Component restored verbatim from commit efc17183f6b5.
- [x] **Transfer doc accuracy update** (commit 2d1ceae7) — Section 3 (Open Issues): bio-filter routing gap, Disconnected/Distant chip, and Stuck chip routing question all RESOLVED, moved to "Resolved April 27, 2026 — kept for reference" subsection with commit hashes. Onboarding redesign now the only remaining launch-gating engineering item. Section 4 (Launch Sequence): renumbered, Reddit removed from launch path (contingency-only), testimonials dropped, TestFlight flagged as iPhone-blocked. Section 2 (Key Features Built): added today's significant work (outcome chooser, AI-error → Self Mode handoff, TimeKeeper, batched cloud sync, AI conversation persistence, Distant chip, internationalization scaffolding). Section 6 (Key Files): line counts updated, health.js added, preflight guard count corrected.
- [x] **Internationalization scaffolding** — `stillform_language` added to SYNC_KEYS + UNENCRYPTED_SYNC_KEYS so future preference cross-device syncs. `captureDeviceLocale()` runs once per install: captures `navigator.language` + `navigator.languages[0]` + `Intl.DateTimeFormat()` locale, stores to localStorage, fires Plausible event "Device Locale Captured" with locale code so demand data is visible in analytics from day one of testing. Settings → Language section (collapsible, between Theme and Display): shows "English ✓ Active" card with honest copy ("Stillform launches in English. Additional languages coming post-launch — clinically translated so the science holds in every language, not machine-translated."), "Request a language" mailto button → ARAembersllc@proton.me, Plausible event "Language Request Tapped". NO i18next install, NO JSON files, NO fake picker. Pure demand-data capture + visible user-facing commitment to expansion. Translation work itself deferred to post-launch sessions with real translator review per language.
- [x] **Outcome chooser in morning check-in (completed unbuilt scaffolding)** — feature was scaffolded (state slot, protocol filter, Plausible event) but UI to actually let users pick was never built. Found during dead-code audit. Built the missing UI: three chips in morning check-in (Sharp / Composed / Recover) with science modal citing Gollwitzer 1999 (Implementation Intentions) + Oettingen (Mental Contrasting / MCII). Replaced order-dependent `.find()` filter with explicit `outcomeProtocolMap` so routing is decoupled from protocols array order. Routing: Sharp → Reframe·Hype, Composed → Reframe·Clarity, Recover → Breathe. Skipping the chooser still works — falls back to existing default protocol. Outcome auto-clears each day (today's choice doesn't persist into tomorrow). Restored `setOutcomeFocus` and persistence useEffect that were removed in the first dead-code pass when it looked truly dead.
- [x] **Dead-code cleanup** — removed unused `setPatternId` setter (state is read-only after init from localStorage) and unused `setActiveMode` setter (state captured from mode prop on mount). Verified through exhaustive ref audit before removing.
- [x] **AI-error → Self Mode handoff with health-check recovery + sessionStorage persistence** — full system with the offer-then-auto-switch threshold (1st failure = offer, 2nd+ = auto-switch), new `/.netlify/functions/health` endpoint for AI-recovery detection, polling effect that runs only when in Self Mode because of AI failure, amber pill inside Self Mode tab when AI recovers ("AI's back. Continue here, or return.") with Return → and × dismiss actions, and sessionStorage persistence across tool close/reopen so an interrupted user (phone call, accidental nav) returns to exactly where they were. Replaces and deletes `buildOfflineFallback` writeup function — Self Mode (MetacognitionTool, grounded in Wells 2009 Metacognitive Therapy, science sheet) is the science-aligned protocol for AI-down moments. Distinguishes deliberate Self Mode entry (no polling, no pill ever) from ai-failure handoff. Plausible events: Self Mode Offered, Self Mode Auto-Switch, Self Mode Recovery Returned, Self Mode Recovery Dismissed.
- [x] **Disconnected/Distant chip** — added "Distant" chip to both chip arrays (post-rate feelChips at App.jsx:6202 and PresentStateChips at App.jsx:7176). New `useEffect` in ReframeTool watches feelState — when "distant" is selected, routes to Body Scan via `onComplete("scan")`. Per Porges 2011 polyvagal + Siegel 1999 window of tolerance: hypoarousal is below the window, prefrontal cortex offline, verbal reframing has limited reach until somatic re-engagement. Body Scan is the science answer, not Reframe. The chip overrides calibration (both processing types route the same way) because the science is calibration-agnostic at this state. feelMap entry added to reframe.js with science-grounded AI prompt for cases where user lands back in Reframe after Body Scan: short sentences, concrete language, body-and-room grounding, no abstraction, no "how does that make you feel" (feeling access is what's offline). scoreState left untouched — Distant returns null same as Stuck because hypoarousal is off the reactive↔composed dial. Data layer inherits everything automatically: session records, Pulse journal auto-write, My Progress emotion frequency, CSV export.
- [x] **ErrorBoundary cleanup + App Diagnostics integration** — Reverted earlier-in-day overshoot (cloud-restore path, calibration-preserving reset, three-button decision UI) since all duplicated existing infrastructure (Settings → Restore now / Delete all data; Reframe → Start fresh). Boundary back to original single-button form with original copy. KEPT one addition: componentDidCatch persists last crash to `stillform_last_error`. `buildPerformanceMetricsSnapshot` now reads it and includes as `last_crash` field in the existing opt-in daily metrics push to `/.netlify/functions/metrics-ingest`. After successful send, key is cleared so no duplicate crash reports. Crashes ride the diagnostics flow the user has already opted into — no new pipeline, no new permission grant. Also removed 4 dead TimeKeeper methods (clockYesterday, nowMs, nowIso, formatForUser — never called). Net: ~118 lines lighter.
- [x] **ErrorBoundary cloud-restore + reset-and-restart** — ErrorBoundary class rewritten with three paths. Signed-in users see primary "Restore from cloud" button → navigates to `/?restore=1` → App component detects flag, sets `restoring` state, splash subtitle changes to "Restoring your data…" until existing `sbSyncDown` completes, flag stripped from URL via `history.replaceState`. All users get "Reset and restart" → clears all `stillform_*` keys except calibration (`onboarded`, `regulation_type`, `signal_profile`, `bias_profile`, `morning_start`) and auth (`sb_session`) — user keeps setup, doesn't have to re-log-in. Every error logs to `stillform_last_error` (timestamp + message + truncated stack + component stack) for support visibility. Double-reset guard: 60-second cooldown surfaces support email instead of looping. Final Sequence 4 item — Resilience pillar complete.
- [x] **Cloud sync batching** — `sbSyncUp` rewritten as a single batched POST. Encryption parallelized via `Promise.all` over `SYNC_KEYS` (35 keys, independent per-key, parallel-safe). Single `POST /rest/v1/user_data?on_conflict=user_id,data_key` with array body, native Supabase REST upsert. 34 sequential round trips → 1. Atomic from the user's perspective — either all rows landed or none, no partial-sync silent inconsistency. Empty/null-keyed rows still skipped before batching. UNENCRYPTED_SYNC_KEYS distinction still applied per-key. Return shape `{ok, uploaded, errors}` preserved; all 4 call sites verified compatible (Settings manual sync button reads `r.ok`/`r.uploaded`/`r.errors?.length`, all preserved). No retry baked into the helper — deliberate architectural choice to keep helper contract simple and let call sites decide retry policy with their user-facing context (manual button vs auto-sync after Reframe vs background tab — all want different responses).
- [x] **AI conversation persistence — IndexedDB encrypted overflow** — new `SecureStore` IndexedDB module wraps a single object store (`secure_data`). `secureSet` now tries localStorage first, falls through to IndexedDB on quota/throw; `secureGet` checks localStorage first then IndexedDB. Same AES-GCM encryption applied before either store path. When localStorage write succeeds, stale IndexedDB copy for that key is cleared to keep reads consistent. If both stores fail, a non-blocking timestamp marker is written to sessionStorage for diagnostic visibility. Zero call site changes — ReframeTool's three persistence touchpoints (load on mount, save on Done-for-now, save on every message) work transparently. Conversations no longer silently lost on long Reframe threads or low-storage devices.
- [x] **Body-first metacognition gap — verified already implemented.** Re-checked the existing BreatheGroundTool flow after Arlin pushed back on the initial "no real gap" reading. Found: grounding-complete screen has "Continue to Reframe →" as PRIMARY CTA (line 3094), post-rate has "Skip to Reframe" escape hatch (line 3471), Body Scan auto-routes to reframe-calm (line 3834), feel-state chips already captured in Breathe with deliberate "data parity for body-first users" framing (line 3229). Initial reading was wrong; pathway flow already routes body-first users into metacognition cleanly. Not closed-without-action, just already-built.
- [x] **Stuck dead-branch cleanup + stale comment fix** — `if (feelState === "stuck")` removed at hero CTA body-first branch (line 12418). Variable was undefined at that scope and Stuck chip didn't exist on home anyway. Live ReframeTool autoMode check preserved. Stale `OBSERVE AND CHOOSE` comment also renamed to current `Self Mode nudge` name (line 6217).
- [x] **routeObserveEntry bio-filter parity** — three understand-branch paths brought into parity with hero CTA: thought-signal, unsure+thought-first regType, and unsure+body-first regType. Each applies the offBaseline narrowing (Pain → Scan, other off-baseline → Breathe; shouldBodyRouteToScan for body paths). Activated user going through Observe Entry no longer routes to Reframe without regulating first.
- [x] **Body-first override narrowing** — `shouldBodyRouteToScan(bioFilter)` helper added; 3 routing sites narrowed (hero CTA body-first branch, routeObserveEntry priority 1, routeObserveEntry understand branch). Pain/Off-baseline/Something route to Body Scan; Activated/Sleep/Depleted/Medicated route straight to Breathe per Ochsner & Gross 2005 (parasympathetic regulation, not body-locating). Removes a friction step for body-first users in states where breathing is the appropriate science answer.
- [x] **Bio-filter staleness fix** — schema migration to `{value, date}` shape. New `getActiveBioFilter()` / `setActiveBioFilter()` helpers gate by today's Stillform-day. Fixes routing accuracy for any user who doesn't re-check-in daily (i.e. most users on most days). 5 reads + 4 writes migrated. Affects: AI bio-filter context, win-feedback suppression, body-first routing in ObserveEntry, primary routeObserveEntry, hero CTA Body Scan override.
- [x] **TimeKeeper consolidation** — 26 direct calls to underlying date helpers migrated to TimeKeeper.* methods. Helpers renamed to `_toLocalDateKey` / `_getStillformToday` (private). 2 new preflight guards block direct external use. Codebase has ONE canonical path for date/time operations. Commit f02225bce3.
- [x] **TimeKeeper Phase 6** — 6 preflight guards added to `scripts/ship-preflight.mjs` to prevent reintroduction of broken date patterns (UTC date keys via slice/split, inline ms day arithmetic, hidden UTC extraction from timestamps). All guards verified passing. Commit 135e8355fb.
- [x] **TimeKeeper Phase 5** — Travel detection wired into AI context. `APP_LOAD_TRAVEL` runs `TimeKeeper.detectTravel()` once at module load; result piped through to Reframe AI as `travelContext` when timezone changed since last open. Server (reframe.js) destructures and pushes into context parts. Atomic commit (App.jsx + reframe.js). Commit 74d32bb41d.
- [x] **TimeKeeper Phase 4** — 5 Class C sites migrated (inline ms day arithmetic → `TimeKeeper.daysAgoMs(N)`). Sliding-window period filters: 30d/60d trends, 7d/14d patterns, 7d signal divergence. Zero behavior change. Commit 81f0678ea8.
- [x] **TimeKeeper Phase 3** — 7 Class B sites + 2 streak-loop comparisons migrated. **Streak counter now correct for all non-UTC users** (the original bug Arlin reported). Also fixes proof active days, daily aggregation for transfer score, AI transfer count, metrics dedup write/read mismatch. Commit 52cdcc1619.
- [x] **TimeKeeper Phase 2** — 3 Class A sites migrated (direct UTC date keys via `.split("T")[0]`). Auto-Pulse journal write, AI journal context filter, eodContext yesterday. Late-night journal entries now group with the practice day they belong to; AI's "today" filter aligns with entry dates; yesterday's EOD close actually surfaces. Commit 291c5334dd.
- [x] **TimeKeeper Phase 1** — Foundational module added with 12 methods. Single source of truth for all date/time operations. Wraps existing helpers; provides clockDay/stillformDay flavors, period filters, timestamps, timezone, travel detection, display formatting. Commit a6934b8cf9.
- [x] **Cleanup orphan** — `const now = new Date()` rendered unused by Phase 4's migration to TimeKeeper.daysAgoMs(). Verified zero references in scope before removal. Commit 54f1351b0b.
- [x] Bio-filter refinements — Pain detection now routes thought-first users to Body Scan instead of Breathe (Kabat-Zinn 1982 MBSR, Reiner et al. 2013, Farb et al. 2013). State-specific copy per signal — Pain reads differently than Activated, Sleep, Depleted, Medicated, Off-baseline. Day-memory keyed to (date, bioFilter snapshot) — once a user accepts or skips, their choice sticks until either the day rolls over (via `getStillformToday()`) or they update their bio-filter (which naturally creates a new memory key). Quieter visual treatment — softer border, smaller header, less interrupt-y. QB pill now available on home too (was excluded; user has instant safety valve regardless of what's showing). Commit 26feab55.
- [x] Chip parity for body-first tools — `PresentStateChips` shared component captures "What is present" (read-only morning check-in pre-fill, never overwrites the historical record) and "Anything to add?" feel chips. Added to Breathe pre-rate screen and Body Scan new intro phase. Reframe refactored to use the same shared component. Both tools' debriefs now include `feelState` so AI gets data parity for body-first users — they no longer contribute less context to the system than thought-first users. Also fixed pre-existing dead-on-click `setInfoModal` references in Breathe (lines 3026, 3182) by passing it through the props bag. Commit 6e1d8fb4.
- [x] Date/time alignment for global launch — added `getStillformToday()` helper that respects user's morning_start setting; migrated all 15 UTC date-key sites (`toISOString().slice(0,10)`) to local time; added date guards on 5 unguarded `stillform_checkin_today` reads (feelState inference, AI checkinContext, "From this morning" chips, progress dashboard, EOD save). All "is it today?" comparisons now consistent across the app. Calendar-day stamps (debrief writes, download filenames) kept as `toLocalDateKey()`. Fixes the morning-chip rollover bug. Commit 9d44050f. (Note: 3 additional sites missed in this pass — see TestFlight Sequence 1 item 2.)
- [x] Bio-filter routing override — hero CTA now reroutes thought-first users to Breathe when bio-filter flags off-baseline (Ochsner & Gross 2005 alignment); body-first behavior unchanged. Commit efe6abe3.
- [x] Info buttons on every element — science-verified copy, all 24 locations
- [x] Screen 2 — Next Move 4 buttons plus lock-in statements (regulation-type personalized)
- [x] Balanced regulation type removed — calibration binary, fallbacks to thought-first
- [x] Pre-meeting notifications — 30min plus 15min, Settings toggle, time pickers
- [x] Composure Check rename (from GO/NO-GO)
- [x] Self Mode rename (from Observe and Choose)
- [x] Stuck chip — pre and post session chips, routes to Reframe clarity (in-Reframe routing works; hero-CTA bridge is dead and pending architectural decision above)
- [x] FAQ rewrite — 27 questions, Stillform voice, science woven in
- [x] Calibration framed as tendency not fixed type
- [x] spiraling replaced with cycling
- [x] Composure Check description removed from screen (redundant with info button)
- [x] FocusCheckValidation function boundary restored
- [x] Security gate — all 41 checks passing

---
## Completed — Earlier Sessions

- [x] Lemon Squeezy LIVE — paywall active
- [x] Show/hide password at login
- [x] Stillform logo routes home on all screens except home
- [x] Skip and finish — copy fixed, theme color amber
- [x] Static home tip card removed
- [x] Most used tile — on My Progress home card
- [x] What Shifted (renamed from State to Statement)
- [x] Self Mode tab inside Reframe
- [x] Post-session merged screen — chips plus What Shifted plus Next Move
- [x] Calendar AI integration — references upcoming events, hard override for vague greetings
- [x] Supabase cloud sync — AES-256 encrypted, three-table schema
- [x] Biometric lock
- [x] Bio-filter expanded (Activated, Medicated states added)
- [x] Bias profiler rewritten (10 distortions)
- [x] Breathing favicon (needs polish — revisit when mobile supports animated favicons)
- [x] Apple Developer purchased ($99/yr, TestFlight unlocked)
- [x] DUNS confirmed
- [x] Security gate — 41 must-match checks
