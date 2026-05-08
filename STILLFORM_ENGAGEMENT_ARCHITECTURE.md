# Stillform Engagement Architecture

**Status (May 8, 2026):** Foundation phases SHIPPED to repo. Build queue paused pending Arlin's manual Netlify deploy + direction on Build #2 Phase 2 (Trigger Profile UI design).

**SHIPPED (HEAD = `1f49ddb`, awaiting deploy):** Phase 0 Stage Definitions data layer · Phase 1 Mirror surface (anchor + sheet) · Build #2 Phase 1 Trigger Profile data layer · Build #5 Phases 1-4 (Body Scan + Reframe + Breathe + EOD micro-credits at every close).

**NOT YET BUILT:** Build #2 Phase 2 (Trigger Profile capture UI — pending Layer 0.6 flow audit before any UI proposal) · Today's Brief · Roadmap full screen · Pre-event Brief · Move card · Scripts · EOD artifact.

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

- **Goals, streaks, badges, dopamine loops.** Betrays the audience (high-intensity, neurodivergent, hates being manipulated). Turns Stillform into Calm. Calm wins that race because they have 10x the resources.
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

This document is the source of truth for the engagement architecture work. Updates flow through here first, then into Master Todo as build items.
