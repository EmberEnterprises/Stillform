# Stillform Engagement Architecture

> **Session-start ground truth lives in `STILLFORM_CANON.md`.** This file retained for deep reference (full three-engine architecture, Path A consolidation map, retention research). Read CANON first.

> **SUPERSESSION NOTE — May 12, 2026:** Framing language in this document predates STILLFORM_FRAMING_LAW.md (May 12, 2026). Specifically: the Roadmap section frames the user's journey as "Stages of self-mastery" (§77). Under the framing law, Stillform's product is a **metacognition practice** that produces self-mastery and composure as felt outcomes — not the product itself. Bandura (1977) self-efficacy / sense of mastery is in the science spine of the framing law, so "mastery" as an OUTCOME the user develops over the journey is valid; but the UMBRELLA framing of the Roadmap as "stages of self-mastery" needs Arlin's structural review under the framing law lens before any external-facing surfaces (App Store copy, marketing, partner outreach) use the phrase. The stage names themselves (NOTICING → NAMING → ANTICIPATING → RECOGNIZING → HOLDING) ARE framing-law-aligned — they describe metacognitive capacities. Internal naming of the umbrella concept can stay until structural review; do not propagate to external surfaces without checking framing law first.

**Status (May 12, 2026 — Spine Ship audit resolution):** Two structural changes recorded from the Layer 0.5 audit (audit philosophy v2.0):
1. **Mirror surface flow simplified.** The Mirror Strip on home now opens Roadmap directly (one tap to journey overview). Mirror Sheet retired — the "How stages work" educational content moved into Roadmap as an info button on the header; the Phase 2d Trigger Profile reflection display (MirrorSheetTriggers) retired, since Settings already provides the full Trigger Profile CRUD surface; the Phase 3e Today's Brief re-read surface retired (alternate paths in post-checkin card and home flow already exist). Phase 1's drill-down architecture (Strip → Sheet → Roadmap) is superseded by Strip → Roadmap direct.
2. **My Progress section consolidation.** Path A's Section 3 "Weekly reflection (narrative)" was unfulfilled in code. Last 30 Days (Gap 9) and Since You Started (Gap 4) consolidated into one Weekly Reflection section with two sub-blocks (rolling 30-day window + since-baseline arc). My Progress now matches Path A's 4-section structure (Weekly Reflection + Roadmap surface + existing sections).

**Status (May 8, 2026 — updated late session):** Engine 2 (application-layer) build queue COMPLETE. All originally-listed surfaces ship to repo. Build queue paused pending Arlin's deploy + phone tap-through across the full pile.

**SHIPPED:** Phase 0 Stage Definitions data layer · Phase 1 Mirror surface (anchor → Roadmap direct as of May 12) · Build #2 Trigger Profile (Phase 1 data layer + Phase 2 capture UI: Settings CRUD, EOD post-save, Reframe close) · Build #3 Today's Brief (3a backend + 3b helpers + 3c saveCheckin hook + 3d inline display) · Build #5 Phases 1-4 (Body Scan + Reframe + Breathe + EOD micro-credits at every close) · Build #6 Roadmap full screen (RoadmapScreen) · Build #7 Pre-event Brief (7a backend + 7b helpers + 7c notification routing + 7d display screen) · Build #8 Move card (8a starter library + 8b selection function + 8c SomaticPromptRunner extraction + 8d pill + 8e history + 8f telemetry) · Build #9 Scripts (full backend + ScriptsTool component + home card) · Build #10 EOD artifact (frontend) · Spine Ship May 12 (9 of 12 gaps shipped first-cut on `feat/home-wiring-surface`).

**DEFERRED post-launch (per audit defaults):** Build #3 Phase 3e (Today's Brief re-read surface) · Build #7 Phase 7e (Pre-event Brief Trigger Profile match detection).

**Pre-deploy gates:** Move card 10-sequence starter library (`src/move-card/library.js`) needs Arlin's science-fidelity pass against `PATTERN_DISRUPTION_SPEC` §4.2 mechanisms + expansion toward 25-30 sequences in production · Layer 5 phone tap-through across the full pile (Disruptor regression on the 8c refactor, Move card flow end-to-end, Today's Brief, Pre-event Brief, Phase 2 Trigger Profile, Scripts).

**Audit philosophy v1.3** governs all build work. See `STILLFORM_AUDIT_PHILOSOPHY.md`.

**Original status:** Architectural design, May 7, 2026.
**Author of this draft:** Claude, synthesizing the May 7 brainstorm with Arlin.
**Supersedes:** the "3 to-dos for the day" thread, the 90-day attribution report idea, and absorbs research-prep items 5 (Self Mode) and 7 (evidence callouts) into a unified architecture.

---

## 1. The problem this architecture solves

### 1.1 Self-obsoleting product risk

Composure work, when it works, becomes the user's new baseline. By month 2-3 the user feels "fine, I don't need this anymore" and churns. This is the actual retention killer in the regulation/wellness/composure category, and Stillform without intervention is fully exposed to it.

This is documented in product literature as *graduation* — successful tools in this category lose their users to their own success. The fix is not better tools; it's making the user's progress visible enough that they keep returning to see what's next.

### 1.2 Attribution drift

Heider 1958, attribution theory: when humans improve, they default to crediting themselves and forgetting the tool. If Stillform doesn't actively claim the change, the user silently attributes their progress to "I just got better" and walks. The app has to take the credit, honestly, with data, in-flow.

### 1.3 Engagement gap

Stillform currently has no visible "I'm getting better at this" arc. No map. No journey. Everything we collect — chips, bio-filter, signal profile, bias profile, Practice Signals, Pattern Disruption, Body Scan tension — produces internal observation but almost nothing produces a real-world artifact the user takes into their day. State to Statement is the only existing app-to-life bridge.

### 1.4 Internal-only framing is incomplete

External elements always influence internal composure. Users don't spiral in a vacuum — they spiral because of the 2pm meeting, the dinner with their mother-in-law, the news cycle, the doctor's appointment. Internal regulation without external context misses the source of the disruption. The app needs to mitigate external risk, not just reflect internal state.

---

## 2. What this architecture is NOT

These are explicitly out of scope and would betray the brand if introduced:

- **Goals, streaks, badges, dopamine loops.** Betrays the trust the practice depends on — Stillform's users notice manipulation and disengage. Turns Stillform into Calm. Calm wins that race because they have 10x the resources.
- **Productivity-task framing** ("3 to-dos for the day"). Category drift. Makes Stillform a habit tracker.
- **Bias-reduction claims.** Forscher et al. 2019 meta-analysis (492 studies): brief implicit-bias interventions produce small, fragile changes that don't reliably translate to behavior change. Dobbin & Kalev 2018: some bias training INCREASES backlash. The Science Sheet standard wouldn't let any "reduces bias" claim pass.
- **90-day retrospective surfaces.** Too far from in-flow daily life. Whoop shows daily recovery scores, not quarterly reports. Strava shows the run you just finished.
- **Therapy-coded language** ("you have issues to heal," "you're not alone," "I care"). Stillform is operator-mode. Same data, different voice.
- **"You missed X today" / completion-failure framing.** Installs the self-criticism loop the app claims to disrupt.

---

## 3. The architecture — three engines running in parallel

### 3.1 Engine 1: Retention engine (three layers in-flow)

#### The Mirror — always visible, refreshed daily

"Here's what you're working on." Surfaced at home screen entry. Not buried in Settings. The user sees their own loops reflected back honestly. Built from the diagnostic stack (Signal Profile + Bias Profile + Trigger Profile). Operator language, not therapy language. Names what it sees without exposing the user.

Example surface (illustrative, not final copy):
> *Working on:* catastrophizing under uncertainty · jaw is your tell · 9pm spiral window
> *Today's risks:* 2pm meeting, kid pickup
> *Stage:* 2 of 5 — naming what's present accurately and fast

#### The Achievement — in-flow micro-credit at every meaningful close

End of every Reframe: "Stuck → focused in 6 minutes. 3rd time this week."
End of every Body Scan: "Jaw tension 4 → 2. Down from 4.1 average last week."
End of every EOD: one specific data point.

Every interaction surfaces ONE specific number, picked by relevance. Embedded in the moment. The credit IS the close. NOT a dashboard. NOT a multi-stat readout. ONE specific number that says "this is what just happened, and it's measurably part of your trend."

#### The Roadmap — visible from day 1, before earned

Stages of mastery shown as a path the user is currently walking. Stage 1 today, stage 5 visible at the path's end. Personalized markers from existing data show position on each stage. Not levels, not points, not badges. Stages of self-mastery, with objective markers tied to data we already collect.

The user signs up for the journey on day 1, not on day 90. The roadmap is the contract.

**Stage definitions (May 7 — names locked, markers attach to existing metrics, thresholds first-pass for review):**

The pattern: each stage is a single verb describing the user's CAPACITY at that level, not their status. They build sequentially — notice before you can name, name before you can anticipate, anticipate before you can recognize, recognize before you can hold under load.

- **Stage 1 — NOTICING** — catching what's happening in your body before thought.
  - Markers (existing data): autonomous exits ("X times you saw it and chose without tools"), duration trend (sessions getting shorter), bio-filter accuracy, body-area chip specificity (not "everywhere")
  - Science: Farb 2015 (interoceptive awareness), van der Kolk 2014, Porges polyvagal
  - **Threshold (proposed):** completed onboarding bio-filter setup + 5+ sessions with body-area chip selection (specificity, not "everywhere") + 1+ session entered during active state (not retrospective)
  - Stage-1-crossing moment generalizes the existing milestone-7 surface

- **Stage 2 — NAMING** — language for what's present, fast and accurate.
  - Markers (existing data + Practice Signals): affect-labeling latency from Practice Signals, affect-labeling accuracy, chip variety expanding (using more of 9 chips)
  - Science: Lieberman 2007 (affect labeling reduces amygdala reactivity), Barrett 2017 (emotional granularity)
  - **Threshold (proposed):** median affect-labeling latency under 4 seconds (Practice Signals data — soft dependency: requires user to have completed at least 1 Practice Signals check) + 5+ different chips used across last 30 days (variety) + 2+ check-ins per week sustained for 2+ weeks (consistency)

- **Stage 3 — ANTICIPATING** — pre-loading composure for known triggers.
  - Markers: Trigger Profile coverage (NEW data), Pre-event Brief usage (NEW), pre-trigger session ratio (existing — pre-event vs post-event), check-in consistency / loop completion (existing), default pattern accuracy (existing — alignment of action with calibrated default under pressure)
  - Science: Gollwitzer 1999 (implementation intentions), Meichenbaum stress inoculation, Gross 1998
  - **Threshold (proposed):** 3+ triggers named in Trigger Profile (gated on Trigger Profile ship) + 1+ Pre-event Brief used in last 14 days (gated on Pre-event Brief ship) + Pre→post rate delta ≥ 1.5 on named-trigger sessions average

- **Stage 4 — RECOGNIZING** — seeing your own loops as they form.
  - Markers (existing data): Pattern Disruption acceptance rate, self-initiated Disruptor sessions (vs surfaced), user-flagged patterns in journal preceding AI detection, switch agility (existing — within-day tool switching)
  - Science: Wells 2009 MCT, Kross 2014 self-distancing, Kabat-Zinn
  - **Threshold (proposed):** 1+ user-flagged pattern in journal/EOD preceding AI detection (within 30 days) + 50%+ Pattern Disruption acceptance rate over last 5 surfaced patterns + 1+ self-initiated Disruptor session (not from a surfaced prompt) in last 30 days

- **Stage 5 — HOLDING** — composure under maximum load.
  - Markers (existing data): pre→post rate deltas during bio-filter "depleted/activated/pain" sessions (existing computation), recovery speed from high activation (existing), acute shift rate 30d (existing), follow-through % from drafted actions (existing)
  - Science: Meichenbaum stress inoculation outcomes, McEwen allostatic load, Porges vagal tone
  - **Threshold (proposed):** 5+ sessions completed under bio-filter "depleted/activated/pain" in last 60 days + pre→post rate delta ≥ 2.0 on those high-load sessions average + recovery time (return to baseline rate) trending downward over last 30 days

**Threshold logic:** each stage requires ALL listed markers to cross threshold simultaneously. User advances when conditions are met; user can drift backward if data regresses (honest reflection — capacity is real, not granted permanently). Display shows current stage AND progress toward next (% of next stage's markers met). All threshold values held in a constants block for easy tuning post-launch against real cohort data.

**Note on Stage 3 dependencies:** Stage 3 is gated on Trigger Profile + Pre-event Brief shipping. At initial launch (before those ship), no user can reach Stage 3 by definition. This is correct — the architecture is sequential, and the build order matches.

The point: ~80% of stage markers attach to data Stillform already computes. Only Stage 3's Trigger Profile + Pre-event Brief usage represent genuinely new data collection. The other markers are existing 30+ metrics (per MY_PROGRESS_REDESIGN_SPEC.md) reorganized into a developmental narrative.

These need Arlin's review and refinement on threshold values specifically. Names locked May 7. Stage-crossing moment design (bold reveal vs quiet surface) deferred pending Arlin's review of overall flow + intent.

### 3.2 Engine 2: Application layer (what the user takes from app to life)

Stillform's existing surfaces produce internal observation. The application layer produces real-world artifacts the user uses outside the app.

#### Today's Brief

Morning artifact summarizing hardware + risks + moves + recovery. Generated at morning check-in from bio-filter + outcome focus + calendar + Trigger Profile + bias profile. Re-readable all day. AI-generated, brand-voice locked.

Example (illustrative):
> Hardware: depleted. Today's risks: 2pm meeting with [boss], kid pickup at 3:30. Today's move: feet flat, slow exhale before each. If you spiral: text [partner] before reacting. Recovery: 10 minutes alone after the kid is settled.

#### Pre-event Brief

Same shape as Today's Brief, scoped to a specific calendar trigger. Fires 30 minutes before. User has it on their phone walking into the room.

#### Move card

Single 30-90-second somatic move generated for the user's current state, available anywhere (bathroom at work, car, between calls). Disruptor tool concept as a takeaway, not just at pattern-detection time.

#### Scripts

Extension of State to Statement. Given a situation, generate verbatim language for the hard conversation. Either ready-to-send or starting point.

#### EOD artifact

2-sentence summary of what the day taught the user, accumulating into a vocabulary of their own life. Distinct from existing EOD reflection — this one is the AI-named takeaway, not the user's freewrite.

### 3.3 Engine 3: External risk mitigation (Trigger Profile)

The complete diagnostic stack should be three layers, not two:

| Layer | What it captures | Status |
|-------|------------------|--------|
| Signal Profile | Where intensity activates in the body | EXISTS |
| Bias Profile | Cognitive distortions the user falls into | EXISTS |
| **Trigger Profile** | **External situations, contexts, relationships where composure is hardest** | **NEW** |

User names what reliably destabilizes them — specific people, contexts, kinds of moments. Categories include but not limited to: work power dynamics, family triggers, cross-cultural moments, financial pressure, health stress, news cycles, sensory overwhelm.

**Cross-cultural is one category among many.** Handled by composure tools scoped to the specific external risk. NOT by claiming to fix external bias. Composure under cross-cultural stress is real, hard, and Stillform-aligned. Bias reduction is not.

Once named, Trigger Profile feeds:
- **Anticipation:** Today's Brief, Pre-event Brief
- **In-the-moment:** Reframe context, Pattern Disruption tagging
- **Recovery:** post-event reflection scoped to the named trigger

---

## 4. How the engines integrate

```
DIAGNOSTIC STACK (3 layers — what we observe about the user)
    ↓
SIGNAL PROFILE  +  BIAS PROFILE  +  TRIGGER PROFILE
    ↓
SURFACES (daily flow — what the user sees)
    Mirror at home (3 layers visible)
    Today's Brief in morning (3 layers + calendar)
    Pre-event Brief at trigger time (3 layers + specific event)
    In-flow micro-credits at every close
    EOD artifact accumulates
    ↓
TRAJECTORY (long-term — what the user is building)
    Roadmap visible from day 1 (5 stages)
    Mastery Map shows current stage + next markers
    Each stage has objective data markers from existing collection
```

The diagnostic stack feeds the surfaces. The surfaces produce the data that proves trajectory. The trajectory gives the user reason to keep returning. Closed loop.

---

## 5. Credit-claiming / attribution layer

Stillform has better attribution data than any competitor in this space. Specific:

- **Pre-rate vs post-rate per session** — literally measures the app's effect on regulation in the moment. Calm doesn't have this.
- **Practice Signals trends** — function-level: affect-labeling latency, defusion distinct count.
- **Pattern Disruption catch timing** — you used to catch this loop after 6 instances; now after 3.
- **Body Scan tension trends per area** — jaw 4.1 → 2.6 over 60 days.
- **Composure across bio-filter states** — held composure through "depleted" hardware 14 times this quarter.

These become:
- **Achievement micro-credits** (in-the-moment)
- **Roadmap markers** (which stage, what's next)
- **EOD artifact entries** (what shifted today)

Whoop does this for physical recovery. Strava does this for running. **Nobody has done this for nervous system regulation at this granularity.** That's the award-winning angle — not gamification. Hard data on internal state change, presented as proof of work.

---

## 6. Research backing

| Source | What it supports |
|--------|------------------|
| Self-determination theory (Deci & Ryan) | Three needs: autonomy, competence, relatedness. Stillform nails autonomy, correctly skips relatedness, misses competence. Mastery Map + Achievement layer fill the competence gap. |
| Implementation intentions (Gollwitzer 1999) | Premeditation has documented effect on follow-through. Trigger Profile + Pre-event Brief operationalize this. |
| Attribution theory (Heider 1958) | Default drift toward self-attribution; needs counter-surface to claim what the tool did. |
| Forscher et al. 2019 (meta-analysis 492 studies) | Brief bias interventions produce small, fragile changes. Why we DON'T claim bias reduction. |
| Dobbin & Kalev 2018 | Some bias training increases backlash. Why we DON'T pivot Stillform into DEI. |

---

## 7. What this absorbs from earlier discussion

- **"3 to-dos for the day"** — absorbed into Trigger Profile premeditation work + Today's Brief. Not a standalone surface.
- **90-day attribution report** — replaced by daily-flow micro-credits. Faster feedback signal.
- **"Building goals" / "feel successful"** — answered by Roadmap visible from day 1 + Achievement micro-credits.
- **Self Mode redesign (decision item 5, research-first)** — **NOT absorbed.** The architecture's deterministic surfaces (Mirror, Achievement, Roadmap) remain available when AI is down — but those solve "what does the user see about their progress" not "what does the user actually DO when they're activated and need to process something and AI isn't there." Self Mode's processing flow is a separate design challenge that stays research-first. See SELF_MODE_REDESIGN_RESEARCH.md.
- **7-session evidence callouts (decision item 7, research-first)** — becomes part of Roadmap markers. Specific stages have specific evidence-backed markers tied to known dose-response timelines.
- **Cross-cultural composure** — fits as one category in Trigger Profile. Composure tools scoped to high-charge cross-cultural moments. No bias-reduction claims.

---

## 8. Consolidation map — Path A (decided May 7, 2026)

**This architecture is a REFACTOR of existing surfaces, not an addition on top.** Stillform already has substantial mastery-tracking infrastructure shipped (per Arlin's audit May 7). The engagement architecture consolidates that work into a coherent narrative rather than layering new surfaces alongside it.

### What retires

- **"Processing Mastery" card** in My Progress (line ~13456). Three sub-metrics (default pattern accuracy / switch agility / debrief capture) → folded into Stage markers across the Roadmap. The card itself is retired; the data lives on as stage signal.
- **"Observer Growth" section** in My Progress (line ~12897). Five capacity claims (Signal Awareness hero card with autonomous exits + duration trend, Recovery when needed, Check-in consistency, Cleaner choices / follow-through) → moved to Achievement micro-credits at session close instead of bundled in My Progress. Same data, different surface placement.
- **Milestone-7 surface** (line ~18577). One-shot at session 7 with bespoke streak/mismatch/standard variants → generalized into Stage-1-crossing moment specifically. The "I noticed something" framing carries forward into all stage-crossing moments.

### What gets refactored (not new code, reorganization)

- **30+ existing computed metrics** (per MY_PROGRESS_REDESIGN_SPEC.md) → categorized by which stage they're markers FOR. No new computation; stage attachment.
- **"My Patterns" diagnostic section** in My Progress → feeds the Mirror surface on home (named loops surface). Same data, surfaced earlier in the user's flow.
- **Bias Profile + Signal Profile** (already in Settings) → become inputs to Mirror surface. They stay where they are for editing; Mirror reads them for display.

### What stays as-is

- Pattern Disruption Layer + Pattern Transparency screen (shipped May 7)
- Practice Signals (CFM Phase 1, shipped May 7)
- Saved Reframes inventory
- AI session notes
- Shareable composure card
- Composure telemetry 12-week heat map
- Weekly reflection narrative

### What's genuinely new

- **Trigger Profile** as third diagnostic layer (NEW data collection)
- **Today's Brief** as morning artifact (NEW surface, NEW Netlify function)
- **Pre-event Brief** at calendar trigger (NEW surface, reuses Brief infrastructure)
- **Move card** as standalone takeaway (NEW surface, reuses Disruptor)
- **The 5-stage developmental NARRATIVE** wrapping existing metrics (NEW frame)
- **Mirror as a HOME-screen surface** (NEW placement; data sources existing)
- **Stage-crossing moments** as a generalized system (NEW; replaces hardcoded milestone-7)

### Implication for My Progress

The MY_PROGRESS_REDESIGN_SPEC.md (which has been waiting on a visual refresh) IS the engagement architecture if we commit to Path A. The redundancy that spec called out — "Observer growth and Proof both surface session-rating delta data," "Additional stats and Composure telemetry both surface activity counts," "Three places reference follow-through from drafted actions" — is resolved by consolidating those metrics into stage markers. One narrative, not eight overlapping sections.

After Path A, My Progress becomes:
1. **Roadmap surface** (stage display + markers + what's next per stage) — new framing, existing data
2. **Composure telemetry** (12-week heat map) — kept as-is
3. **Weekly reflection** (narrative) — kept as-is
4. **Saved Reframes / AI session notes / Shareable card** — kept as-is, lower in the page

That's it. Four sections instead of eight. The Mastery story is told in one place with one vocabulary.

---

## 9. Open questions (must resolve before build)

1. **5 stage definitions.** Working draft above. Need Arlin's review for: precise stage names, what each means in plain language, exact data markers per stage, threshold logic for "user is at stage N."

2. **Trigger Profile onboarding.** Initial onboarding step? Progressive disclosure as user identifies triggers in sessions? Editable always? Default category list or fully user-generated?

3. **Mirror surface placement.** Top of home screen? Side rail? Collapsible card? How does it interact with existing home tiles?

4. **Achievement threshold.** ONE number per close, picked by relevance. Need ranking logic — which number is most relevant in any given session close. Don't want dashboard drift.

5. **EOD artifact format.** Separate surface from existing EOD reflection, or absorbed into it? Probably absorbed — one EOD flow producing both user freewrite AND AI-named takeaway.

6. **Trigger Profile categories.** Predefined category list? Free-form user generation? Hybrid (categories + custom values)?

7. **Roadmap surface placement.** Standalone screen? Section of My Progress? Always visible at home? How prominent?

8. **Stage progression visibility.** Does the user see exactly when they cross a stage threshold (achievement moment) or is it a soft "you're between 2 and 3" indicator?

9. **Self Mode interaction.** When AI is down, what version of these surfaces still works? Mirror is OK (deterministic data). Achievement is OK (deterministic). Roadmap is OK (cached). Today's Brief loses AI personalization — falls back to template? Or skips?

10. **Accountability and integrity in the training (added May 15, 2026).** *(open — not yet spec'd)* The practice — the ongoing reps over days and weeks — needs a mechanism that pushes the user toward honest engagement and away from going through the motions. Stillform should not be tap-tap-tappable for streak credit. What this could touch (none committed): AI calling out vague or generic input rather than accepting it; self-attestation prompts on locked-in next moves ("did you actually do the X you locked in?"); session-quality signals visible in My Progress (depth, not just count); guardrails that prevent ghost-mode chip-tapping. Open question: what does "integrity" mean in measurable form — the user is honest with themselves, the AI calls out drift, the streak only counts real reps? Likely some combination. Needs Arlin's framing before any build. *Read of "the training": the user's cumulative metacognition practice, not AI model training or onboarding. Correct me if wrong.*

---

## 10. Shipping order (load-bearing first)

| # | Build | Dependency | Estimated scope |
|---|-------|------------|-----------------|
| 1 | Stage definitions (5 stages, names, markers, thresholds) | None — load-bearing | Design work, 1-2 sessions |
| 2 | Trigger Profile (onboarding + storage + sync + Reframe integration) | Stage definitions | 2-3 builds |
| 3 | Today's Brief (uses all 3 diagnostic layers + calendar) | Trigger Profile | 1-2 builds + Netlify function |
| 4 | Mirror surface on home (3 layers visible) | Trigger Profile | 1 build |
| 5 | Achievement micro-credits at every close (Reframe, Body Scan, EOD) | Stage definitions | 2-3 builds |
| 6 | Roadmap screen (current position + markers + what's next per stage) | Stage definitions + Trigger Profile | 2-3 builds |
| 7 | Pre-event Brief (calendar trigger fires brief 30min before) | Today's Brief | 1 build |
| 8 | Move card | Stage definitions | 1-2 builds |
| 9 | Scripts (State-to-Statement extension) | Existing | 1 build |
| 10 | EOD artifact accumulation | Existing EOD | 1 build |

Total estimated scope: 12-18 builds. Multi-session work but each build is independently shippable and verifiable.

---

## 11. Doc cross-references

- **Master Todo:** new top section pointing here
- **Strategic Roadmap:** strategic decision recorded as engagement architecture commitment
- **Project Transfer:** updated to reference this architecture as the launch-defining priority
- **CFM Phase 1 audit (already shipped):** Practice Signals trends become Achievement-layer data points
- **Pattern Disruption Spec (already shipped):** integrates into Stage 4 markers (spotting loops before AI)
- **Research Prep — Self Mode + Evidence Callouts:** absorbed; both items resolved within this architecture

---

## 12. Substance critique — the AI's job is differentiation, not empathy (added May 14, 2026 evening)

This section captures the substance critique surfaced during Arlin's late-evening testing of the deployed Reframe flow. It is the single biggest realization from that session and is upstream of everything else in this document — every engine in §3 assumes the in-flow tools are doing real concept-building work. If the tools themselves are hollow, the engines retain a user inside a generic experience.

### 12.1 The critique, in Arlin's words

> "the app is a great idea but we don't have a lot working for us right now the tools feel so generic press this button press that button like where's the actual work"
>
> — Arlin, May 14, 2026 evening, testing the deployed Reframe Step 2

### 12.2 What's actually shipped vs what the framing law requires

The framing law (`STILLFORM_FRAMING_LAW.md` §WHAT THE PRACTICE LOOKS LIKE) says the work is **naming with specificity** — the user leaves a session with more precision than they entered. Concept-building (Hoemann 2021 / Barrett 2017 — emotional granularity is the trainable substrate). Bounded engagements with start, scope, and close. Generative, not circular.

What's actually shipped in Reframe (verified May 14 evening by Arlin's screenshots of the deployed flow):

1. User types a paragraph naming their situation (e.g., "I'm in a Lyme rage. I've done everything spiritual I can from uncrossing kits, fiery wall protection, going to church, manifesting, taking the wheel but I am constantly met with chaos, stagnation, stress, anxiety, and health issues")
2. AI returns empathy + textbook reflection ("The chaos and stagnation you're feeling sound overwhelming…")
3. User picks a coarse chip ("Flat" / "Anxious" / etc.) — one of 10 broad Russell-circumplex states
4. User picks one of 4 hardcoded Next Move actions (Send a message / Hold a boundary / Delay your response / Let it go) — generic regardless of situation
5. User taps Lock In

Nowhere in that flow does precision get pushed. The session does not produce a precise named thing the user couldn't have written on a napkin alone. The user enters with "Lyme rage" and exits with "Lyme rage" — same coarse name. No concept added to the library. No granularity built. No generative output.

### 12.3 The Lyme rage example as concrete illustration

The session SHOULD have ended with the user knowing what's underneath "Lyme rage":
- Grief about the body's betrayal
- Anger at the medical system continuing to fail
- Fear that the stagnation continues forever
- Frustration at the gap between spiritual effort and physical outcome
- Or something none of those four names

Each is a real, specific, nameable thing. Each is a different concept the user could carry forward as a building block of their library. The actual session named none of them. The AI's response opened with validation ("sound overwhelming") — not differentiation.

### 12.4 Why the current Granularity Gym is not enough

The Granularity Gym (the inline "Say it more precisely" affordance below the chip pick, renamed from jargon in PR #83) is the seed of real work. The precision label does flow to the AI when present (`reframe.js` reads `stillform_session_precision`). But:

- The gym is **optional** — the session completes without it
- It is **hidden until tapped** — most users never see it
- It is **disconnected from the spine of the session** — the user types a precise word, but the next surface (chip pick, Next Move chips, Lock In) doesn't reorganize around that precision
- The AI doesn't **push** the user toward producing precision — the AI validates first, doesn't probe for the underneath thing

Result: the most important act of the practice — producing a precise name — sits as a decorative side affordance instead of being the thing the whole flow drives toward.

### 12.5 The direction (the change of role)

Three load-bearing shifts together:

#### 12.5.1 AI's job becomes differentiation, not empathy

The AI's opening move on receiving a vague entry: surface candidate underlying names and force a pick. Example: "You said *Lyme rage*. Underneath that is grief about the body's betrayal, anger at the medical system, fear of stagnation continuing forever, frustration at the gap between spiritual effort and physical outcome, or something I haven't named — which is it actually?" Then it probes until the precise thing is pinned down. No textbook paragraphs. No "that sounds hard." No "I hear you." Real analytical pressure toward specificity. Empathy is not the work; pinning down the underneath thing IS the work.

This is consistent with the framing law's `WHAT IS NOT` list:
- NOT looping on already-built concepts (validation circles a concept; differentiation builds new ones)
- NOT self-judgment dressed as analysis (probing for precision is curious, not judgy)
- NOT unbounded introspection (the question is bounded: "which is it actually?")

#### 12.5.2 Every Reframe session produces a precise NAMED THING added to the user's library

The session has an artifact. Not text the user reads. Not a paragraph the AI wrote. A specific name the user **produced through the session** that they didn't have before they started. Stored in the user's concept library (`stillform_named_moves` or a new `stillform_named_concepts` table — to be specified). Each named thing is a building block of the user's granularity. Visible in My Progress as the library grows. Referenced by future sessions ("you've named this before — is this the same thing or a new variant?").

This is the **measurable output** of the practice. The user can point to a list of precise names they have produced. Each one is a real concept-library addition (Hoemann 2021). The library grows over time and the user perceives their internal states with more nuance because of it.

#### 12.5.3 Step 2's sub-beats compose around producing that name

The Reframe Step 2 architecture decision from this same evening (one-element-per-sub-beat, sequential transitions) was correct as structure, but the substance work above is what gives each sub-beat real work to do. The sub-beats reorganize as:

1. **Read the AI's differentiation prompt** — the candidates the AI surfaced based on what the user wrote
2. **Pick / type the precise name** — the granularity production moment (the gym becomes the spine here)
3. **Pick where you are now** — the chip pick, now ANCHORED to the precise name (not floating)
4. **Pick a next move** — proposed by the AI based on the precise name (not hardcoded 4 actions)
5. **Lock in with closure** — "Today you named *grief about the body's betrayal*. Added to your library." The artifact is the closure.

Each sub-beat does real conceptual work. None of them are "press this button press that button." The user produces something specific by the end.

### 12.6 Implications for the rest of this document

§3.2 Application Layer (Today's Brief, Pre-event Brief, Move card, Scripts, EOD artifact) — most assume the in-flow sessions are producing real named concepts that the application layer can carry into life. The substance critique makes this explicit: the in-flow session's artifact (the precise named thing) is the input the application layer needs. Without it, the application layer has nothing to carry.

§3.1 Engine 1 Retention (Mirror, Achievement, Roadmap) — the Achievement layer counts shipped reps. Once the substance work lands, a "rep" is no longer "completed a session" but "produced a precise named thing." Higher signal, harder to fake, real concept-library growth.

§3.3 Engine 3 Trigger Profile — the trigger profile becomes richer when each session's named thing flows into it (precise names are better triggers than coarse states).

### 12.7 What needs to happen before this ships

1. **Read current `netlify/functions/reframe.js`** end-to-end and map the existing system prompts (CALM, CLARITY, HYPE, QUALITY_RETRY). Identify where validation lives, where empathy phrases are anchored, where the AI's role is set.
2. **Rewrite system prompts** to encode differentiation-first behavior. The AI's job description in the prompt becomes: "Your role is to help the user produce a more precise name for what they're experiencing than the one they started with. Surface 3-4 candidate underlying names based on what they wrote. Ask which one is actually it. Probe until the precise thing is pinned down. Do not validate. Do not paragraph."
3. **Add structured output** for the AI: a list of candidate underlying names returned alongside the response text. The UI surfaces these as chips the user can tap, or the user can type their own.
4. **Storage schema** for the named-thing-library: `stillform_named_concepts` array entries `{ name, sessionId, timestamp, sourceState, sourceText }`. May extend `stillform_named_moves` (brainstorm #10) or be a new key.
5. **Step 2 sub-beat restructure** wired around the named-thing production.
6. **My Progress surface update** — the named-concept library is the most important surface (the user's actual produced output).
7. **AI regression test refresh** — the audit (PR #77 baseline) must include a "differentiation, not validation" check across the corpus.

This is multi-build work. The estimate from §10 (12-18 builds for the original engagement architecture) was scoped before this critique was articulated; the substance work adds approximately 4-6 builds and is upstream of build #1 (Stage definitions) because the named-thing-library is what the stages count.

### 12.8 The standing question

Arlin's call: "Say go on the substance direction and I'll start by reading the current reframe.js prompts to map exactly what changes."

When Arlin says go, the first build is the `reframe.js` prompt-mapping audit. Everything else queues behind that.

---

This document is the source of truth for the engagement architecture work. Updates flow through here first, then into Master Todo as build items.
