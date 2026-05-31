# COGNITIVE FUNCTION MEASUREMENT — Phase 1 Decision Audit

> **⚠️ STALE — May 17, 2026:** Per Completed Archive line 456, this audit "covers a feature that no longer exists." The implementation that derived from these decisions (Builds #31-37, #46) was **reverted entirely May 7** due to UX failures (see status header in `COGNITIVE_FUNCTION_MEASUREMENT_SPEC.md`). The 4 lockable decisions inside (naming, Arlin-authored stimuli, surface placement, AI distinctiveness rubric) may still inform a future redesign — Cognitive Function Measurement was Arlin's chosen engagement mechanic and the spec remains good — but the specific implementation approach this audit committed to was wrong and won't be re-attempted. Preserved as a redesign input, not as current direction. If a redesign happens, expect these decisions to be revisited from scratch with the revert lessons in hand.

**Date:** May 6, 2026
**Source:** COGNITIVE_FUNCTION_MEASUREMENT_SPEC.md (Apr 30, 2026, 283 lines)
**Purpose:** Lock the Phase 1 decisions before build starts. Each section names a real question, the stakes, the realistic options, and a recommendation grounded in what the spec already says + what the codebase already supports.

This is not a re-spec. The spec is good. This is the decision layer Phase 1 needs to start.

---

## Status of Phase 0 (already shipped)

⚠️ [NOTE: the entire Cognitive Function Measurement layer is NOT in the live build as of May 30 2026 — verified absent; it lived in deleted v1. The below describes intended/v1 design.] `stillform_function_checks` storage key, `FUNCTION_CHECK_CANDIDATES` enum (AFFECT_LABELING, INTEROCEPTIVE_LATENCY, COGNITIVE_DEFUSION), helpers `appendFunctionCheck`, `getLatestFunctionCheck`, `getFunctionCheckTrend`. Schema versioned (`v: 1`), 200-record cap, registered for cloud sync. No UI, no stimulus libraries, no surfacing logic — those are Phase 1.

The stored record shape is locked:
```js
{
  v: 1,
  id: "fc_<timestamp>",
  candidate: "affect-labeling" | "interoceptive-latency" | "cognitive-defusion",
  timestamp: ISO8601,
  primaryMs: number | null,         // latency for Candidates 1, 2
  primaryCount: number | null,       // count for Candidate 3
  specificity: 0 | 0.5 | 1 | null,   // for Candidate 2
  bioFilter: string[] | null,        // user's state at measurement
  toolsBeforeMs: object | null       // recent practice context
}
```

Phase 1 must produce records that fit this shape. If a candidate exercise produces data that doesn't fit, either expand the schema (bump version to v:2 with backward-compat read) or rework the exercise. Don't write outside the schema.

---

## Decision 1: Naming

The spec leaves this open. Three candidates Arlin proposed:

- **"Function tests"** — clinical-feeling. Aligns with "test", which can either signal scientific rigor (good) or feel like school (bad).
- **"Capacity tests"** — softer than function but still measurement-flavored. Implies growth ("capacity expands").
- **"Practice evidence"** — academic, deliberately not test-flavored. Aligns with the spec's "recognition through evidence, not narrative" framing.

### The real distinction

The name is what users see in their UI. It's the category the feature inhabits in their mental model:

- **"Tests"** → users will compare their results to a normal range, ask "did I pass," feel anxiety
- **"Evidence"** → users will read it as longitudinal data about themselves, no pass/fail

The spec is explicit (line 39): *"recognition through evidence, not narrative"*. The locked positioning (locked May 1) says Stillform is *"instrumentation for self-mastery"*. Both push toward "evidence" or something that signals measurement-without-judgment.

### The tradeoff

"Practice evidence" is most accurate to the spec's intent but reads slightly academic for a user who hasn't read the spec. A new user seeing "Practice evidence" in a tab might not know what it does. "Function tests" is more discoverable but invites the test-anxiety pattern.

### Recommendation

**"Practice evidence"** as the primary label, with the in-product description doing the work of disambiguation: *"Brief exercises that measure the cognitive functions your practice trains. Repeated over time, your own data shows whether the work is producing change."*

Don't combine words ("Capacity Practice") — composite labels read as marketing.

If you reject "Practice evidence" as too academic: **"Practice signals"** — same intent, slightly more accessible, still escapes the test framing.

### What this commits to

The label is referenced everywhere this feature surfaces. Settings tab name, post-session offer copy, My Progress section header. Pick once, stick to it.

---

## Decision 2: Phase 1 candidate set

Spec recommended 1, 2, 3. Phase 0 storage already encodes those three constants. Question is whether to ship all three at once, or sequence within Phase 1.

### The sequencing options

**Option A — All three at once.** Ship affect labeling + interoceptive latency + cognitive defusion as a complete set. Most coherent story to users: "we measure all three because the practice trains all three."

**Option B — One at a time, validate each before next.** Start with affect labeling (cleanest, most validated), see how users engage, refine before adding interoception, refine again before adding defusion.

**Option C — Two at once (1 + 3, defer 2).** Affect labeling + cognitive defusion ship together because they share UI complexity (timed selection from a vocabulary, free-text generation with timer). Interoceptive latency requires a custom body schematic component which is bigger build.

### The build-cost honest read

Per the spec's Phase 1 section (line 192):
- **Affect labeling**: 50-100 validated scenario stimuli + chip-selection UI (chips already exist) + timing precision
- **Interoceptive latency**: body schematic component (new build) + audio cue pacing + specificity scoring
- **Cognitive defusion**: 30-50 thought stimuli + free-text input with timer + AI distinctiveness evaluator

Affect labeling and cognitive defusion both leverage existing UI primitives (chips and text input). Interoceptive latency requires a brand-new body schematic component that doesn't exist anywhere in the app — Body Scan uses a 6-area dot grid, not a manipulable schematic.

### The user-engagement honest read

Per the spec's "engagement craft" framing (lines 16-22): the gap is *"science based prompts that are flat and not interested in engaging for the user."* The candidates that engage best are the ones that feel like brief games, not assessments.

- **Affect labeling**: scenario flashes for 1s → chip tap. Genuinely game-like. <30 seconds.
- **Cognitive defusion**: thought appears → 30-second writing window. Like a creative-thinking flash drill. Engaging if the prompts are interesting.
- **Interoceptive latency**: tap "Begin", wait for audio, name a body location. Slower, more meditative. Less engaging in the engagement-craft sense — closer to Body Scan's existing pacing.

### Recommendation

**Option C — ship affect labeling + cognitive defusion together; defer interoceptive latency to later in Phase 1.**

Reasoning:
- They share UI primitives (chips, text input) — one build pass produces both
- They ARE more engaging — match the spec's stated engagement-craft motivation
- Interoceptive latency is the most subjective candidate (spec line 89 acknowledges this risk) — deferring buys time to design the schematic component carefully
- Two candidates is enough to demonstrate the "we measure functions" claim — not as comprehensive as three but more credible than one

### What this commits to

Phase 0 storage already accommodates all three. No schema change needed. The constant `INTEROCEPTIVE_LATENCY` stays in `FUNCTION_CHECK_CANDIDATES` for when Phase 1.5 ships it.

---

## Decision 3: Stimulus libraries

The spec says (line 194): *"For Candidate 1 (affect labeling): 50-100 validated scenarios paired with chip labels. For Candidate 3 (defusion): 30-50 thought stimuli with quality rubrics."*

This is real content authoring work. Stillform has 9 chips currently — let me get them:

### The chips Stillform uses (need to verify; pulling from memory of the codebase)

Based on the chips referenced throughout the codebase: clear, activated, depleted, gut, sleep, hormonal, pain, medicated (bio-filter set, 8 chips), and the affect chips like Stuck, Spinning, Hot, Heavy, etc.

For the affect-labeling stimulus library, the 50-100 scenarios should each map cleanly to ONE chip as the "best fit" answer. Examples:

- *"You walk into a meeting and three colleagues stop talking when they see you."* → Stuck (or similar — depends on the chip set)
- *"Your kid asks why you didn't pick them up on time and you have no good answer."* → Heavy
- *"Email from boss says 'we need to talk' with no context."* → Spinning

### The two real risks

1. **Authoring bias.** If Arlin writes the scenarios, they reflect her specific cognitive patterns. The library needs to span universal triggers (work confrontation, social rejection, parenting failure, health uncertainty, financial stress, identity threat) so users with different lives still find the scenarios resonant.

2. **Validation cost.** Each scenario needs the "correct" chip. If two reasonable raters disagree on the right chip, the scenario is bad — too ambiguous to score reliably. Spec line 75: *"Faces are research-backed (Ekman) but need to be ethically sourced. Scenarios are easier to construct but require validation."*

### Recommendation

**Author 30 scenarios for Phase 1 launch (lower than spec's 50-100 minimum), validate by hand with two raters (Arlin + Bobby), accept that this caps measurement quality but gets the system in front of users for iteration.**

Reasoning:
- The spec's 50-100 number is for full Phase 2 polish; Phase 1 launch can ship a smaller set as long as the scoring averages over enough stimuli per measurement (12-15 scenarios per check is sufficient for trend signal)
- Hand-validation by two raters catches the worst ambiguities. Inter-rater agreement on chip choice is a known-good validity check.
- The "this label feels wrong" feedback path Arlin already has in mind (per spec line 117) lets the library improve in production

### What this commits to

A 30-scenario library file, with each scenario annotated with: scenario text, primary chip, secondary acceptable chip (if any), Arlin/Bobby rater agreement (yes/no/disputed). Disputed entries don't ship. Format: structured JSON or markdown table, doesn't matter.

For cognitive defusion: 15 thought stimuli for Phase 1 (lower than spec's 30-50). Same hand-validation by two raters for the "what counts as a distinctive frame" rubric.

### Who authors

Arlin authors. AI can help generate first drafts but the final list is Arlin's call because the voice, demographic spread, and cognitive-pattern coverage are her domain. AI generation that doesn't reflect Arlin's specific life-context and the user-base she's building for would produce flat scenarios.

---

## Decision 4: Cadence

Spec recommended weekly (line 163). Arlin's open question (line 261): *"Could be every 3-5 days. Could be opportunistic ('we noticed you've practiced 4 times since your last function check'). What feels right?"*

### The cadence options

**Weekly fixed** — every 7 days from last check. Simple. Predictable.

**Practice-gated** — every N sessions since last check. Couples measurement to engagement. User who practices a lot gets measured more; user who barely practices barely gets measured.

**Opportunistic surface** — system suggests when contextually appropriate (after a Self Mode exit, after a Reframe with a clear breakthrough, etc).

### The honest read on each

**Weekly fixed** is least friction to build. It's also the most likely to produce a "you have a function check waiting" notification fatigue. Users skip it once, skip it twice, never engage.

**Practice-gated** pairs measurement to active practice — produces strongest comparison data because measurement happens during high-engagement periods, not during low-engagement valleys when results would look worse for non-practice reasons. But it punishes consistent low-engagement users (who might be the ones who need the feedback most).

**Opportunistic** is best UX in theory but builds the most complex surfacing logic — when is "after a clear Reframe breakthrough" detectable? It also risks gaming (user games the system to avoid the surface).

### Recommendation

**Practice-gated, weekly cap.** Trigger: 5+ sessions since last function check OR 7 days since last check, whichever comes first. Capped at one offer per week regardless of practice volume.

Reasoning:
- Practice-gated produces the strongest signal data
- Weekly cap prevents over-measurement fatigue
- The 5-session floor means low-engagement users still get the offer (they hit 7 days first)
- The "or whichever comes first" rule means the user always sees it weekly at minimum

### What this commits to

A simple computed flag: `shouldOfferFunctionCheck()` that reads `getLatestFunctionCheck()` (already shipped) plus the session count since that timestamp. Returns `true` if practice-gated OR time-gated OR no check ever. This is one new helper to ship in Phase 1.

---

## Decision 5: Surfacing — where the offer appears

Spec gave 3 options (lines 149-156):
- A: Inside Self Mode as 6th step
- B: Separate "Practice Evidence" surface in My Progress
- C: Both

Spec recommended C.

### The audit on C

The "both" recommendation is correct in concept but the implementation has a real cost:

- **Self Mode integration** requires touching the Self Mode flow. Self Mode is already flagged for redesign (master todo line 95: *"Self Mode is not where it could be"*). Adding a 6th step before the redesign means re-doing it after the redesign.
- **My Progress surface** also requires touching My Progress, which has a pending redesign (master todo line 368: *"My Progress redesign"*).

Both surfaces have pending redesigns. Building Phase 1 against either current surface means rebuilding when the redesign lands.

### The strategic question

Phase 1 either ships before or after the Self Mode + My Progress redesigns. Ordering matters:

**Path A — Phase 1 ships first against current surfaces.** User sees the function-check offers earlier. Has to be re-integrated after the redesigns land. Some throwaway work.

**Path B — Self Mode + My Progress redesigns ship first; Phase 1 ships into them.** No throwaway work. But Phase 1 is gated on two redesigns that themselves are gated on the prestige refresh phone-validation.

### Recommendation

**Path B with a fallback surface.**

Concretely: ship Phase 1 with a single dedicated screen accessible from a Settings link (or the home dock if you want it more visible). Don't integrate it into Self Mode or My Progress until those screens redesign. The dedicated screen is the testable, debuggable, isolated surface for Phase 1.

When Self Mode redesign lands: add the 6th-step entry that links into that dedicated screen.
When My Progress redesign lands: add the trend-curve surface that reads from the same data.

The dedicated screen is the source of truth either way. Self Mode and My Progress become entry points, not duplicates.

### What this commits to

One new screen for Phase 1: **Practice Evidence** (or whatever Decision 1 settles on). Accessible from Settings. Contains: brief explainer, "Take a check" button, history of past checks with their trends. No Self Mode or My Progress changes in Phase 1 scope.

---

## Decision 6: Failure framing

Spec calls this the most important question (line 167). When a user's function isn't improving, what does the result message say?

Spec gave a draft (line 184):
> *"Affect labeling latency: 2.1s. Six weeks ago: 1.9s. Function isn't showing growth this period. This happens. The practice still works; the measurement noise is real. Check again next week."*

### The audit

This is good. It does three things at once:
1. States the data without softening
2. Names that this is normal ("This happens")
3. Refuses to draw a conclusion from a single comparison

The phrase *"the measurement noise is real"* is the key move. It tells the user the data is honest AND that they shouldn't over-interpret it.

### The risk

A user who sees this message multiple weeks in a row might lose trust in the entire system. *"Function isn't showing growth this period"* the first time is fine. The fourth time becomes *"this isn't working for me."*

### Recommendation

**Add a fourth move: name what's actually true at higher altitude when the trend persists.**

Two-tier framing:

**Single-period non-improvement (1-2 weeks):**
> *"Affect labeling latency: 2.1s. Six weeks ago: 1.9s. Function isn't showing growth this period. Measurement noise is real. Check again next week."*

**Sustained non-improvement (3+ checks without growth):**
> *"Affect labeling latency hasn't moved in your last [N] checks. The function might be at your stable baseline, the practice might need to change, or something outside Stillform might be affecting your results. Stillform measures one specific thing well — it can't tell you which of these is true."*

The second framing does what the first doesn't: acknowledges that the system's measurement is honest enough to surface "we don't know what's going on" rather than blaming the user or the practice.

### What this commits to

Two distinct copy strings per candidate:
- non-improvement-single (the spec's draft)
- non-improvement-sustained (the new framing)

Plus the surfacing logic to choose between them based on `getFunctionCheckTrend()`'s `recordCount` and consecutive non-improvement count.

---

## Decision 7: AI distinctiveness rubric (cognitive defusion)

The spec acknowledges (line 103): *"the AI evaluation of 'distinctiveness' introduces subjectivity. Mitigation: combine human-validated rubric with AI scoring; transparent criteria visible to the user."*

The rubric needs to be specific enough that AI scoring is consistent and a user can read it and understand why their frame got the score it got.

### Recommendation rubric

Each user-generated frame gets one of three scores:

- **Distinct (1.0)** — a genuinely different perspective from the original thought. Examples: introduces a different actor's intent, reality-tests the assumption, surfaces an underlying value, or accepts the worst case.
- **Reworded (0.5)** — same content, different words. Examples: synonym swap, passive↔active voice, hedging language added.
- **Same (0.0)** — restates the original or expands it without changing perspective.

The user sees their full set scored:
> *"5 frames generated. 3 distinct, 1 reworded, 1 same. Distinct count is what's tracked over time."*

This makes the AI's scoring legible. The user can disagree with a specific score (mitigation: feedback button "this should be distinct, not reworded" — same lever as Candidate 4's "this label feels wrong" affordance).

### Build cost

Real but contained. The AI evaluator is one Netlify function call per measurement, takes the original thought + the user's frame list, returns a JSON map of frame → score. The function uses a few-shot prompt anchored to this rubric. Cost: one new Netlify function (~100 lines).

### What this commits to

A new function `netlify/functions/cognitive-defusion-score.js`. Takes original thought + frame array. Returns scored frames. Deployment same as `reframe.js` and `science-card.js`.

---

## Build sequencing — proposed Phase 1 plan

Given the decisions above, ordered for shippability:

### Sprint 1 (foundation)
1. Lock the name (Decision 1)
2. Author 30 affect-labeling scenarios + 15 cognitive-defusion thoughts (Decision 3)
3. Hand-validate with two raters; drop disputed
4. Build the Practice Evidence screen shell (Decision 5) — empty for now
5. Build `shouldOfferFunctionCheck()` helper (Decision 4)

### Sprint 2 (affect labeling)
1. Build affect-labeling exercise UI (chip-array reuse)
2. Wire to `appendFunctionCheck()` (Phase 0 helper)
3. Wire result rendering with both single- and sustained-non-improvement copy (Decision 6)
4. End-to-end test: record → store → display

### Sprint 3 (cognitive defusion)
1. Build cognitive-defusion exercise UI (timed text input)
2. Build `cognitive-defusion-score.js` Netlify function (Decision 7)
3. Wire to `appendFunctionCheck()`
4. End-to-end test

### Sprint 4 (polish)
1. Surface offer prompt at correct cadence (Decision 4)
2. Refine result copy based on internal testing
3. Privacy & disclaimer copy: "this is not a clinical assessment"
4. Plausible event taxonomy: function_check_offered, function_check_started, function_check_completed, function_check_skipped

### Phase 1.5 (deferred)
1. Interoceptive latency (Candidate 2) — body schematic component build, then exercise wire-up
2. Self Mode 6th-step integration (after Self Mode redesign)
3. My Progress trend curves (after My Progress redesign)

---

## What the user-facing label can't say

Even after all this, the spec's anti-Lumosity rule is the hardest constraint to honor. The labels and copy must NOT say:

- "Your brain is faster"
- "Cognitive ability is improving"
- "You're more emotionally regulated than [percentile]"
- "Function score: 87/100" (any single composite)
- Any comparison to "average users"

What they CAN say:
- "Affect labeling latency: 2.1s. Eight weeks ago: 3.2s. The literature predicts this function gets faster with practice. It has."
- "Distinct frame count: 4. Six weeks ago: 2."
- Specific function. Specific change. Specific timeframe.

This is the prestige + real work tension the spec talks about. Hold the line on it during all copy review.

---

## What still needs Arlin's call before Sprint 1 can start

1. **Decision 1 (Name)**: "Practice evidence" vs "Practice signals" vs Arlin's pick
2. **Decision 3 (Authoring)**: Arlin commits to authoring 30 + 15 stimuli
3. **Decision 5 (Surface)**: confirm dedicated screen approach (Path B + fallback) over either current surface
4. **Decision 7 (Rubric)**: confirm distinct/reworded/same three-tier or propose alternative

Decisions 2, 4, 6 can be locked from this doc; 1, 3, 5, 7 need explicit Arlin sign-off because they involve voice, content authoring, and visible UX choices.

---

*ARA Embers LLC · Cognitive Function Measurement Phase 1 Decision Audit · May 6, 2026*
