# COGNITIVE FUNCTION MEASUREMENT SPEC

**Working title:** Function Tests / Capacity Tests / Practice Evidence (final naming TBD with Arlin)

**Status:** Specification draft. NOT YET BUILT. For Arlin's review when she wakes.

**Date:** April 30, 2026

**One-line summary:** A small set of repeatable cognitive exercises grounded in the neuroscience Stillform already cites, performed periodically by the user, with results tracked over time. Improvements over weeks are measurable evidence the practice is producing the neuroplasticity Stillform claims. Recognition through measurement, not narrative.

---

## Why this exists

After three rounds of consultation that produced surface fixes and architectural overcorrections, Arlin diagnosed the actual gap herself: *"I got a bunch of science based prompts that are flat and not interested in engaging for the user. It feels more like a chore than something I actually want to do."*

The product has truth, rigor, and integrity. What it lacks is **engagement craft** — the layer that makes a serious tool feel alive.

Out of nine engagement mechanics from non-wellness products examined, two emerged as worth pursuing:
1. Plain-language neuroscience as recurring surface (Wikipedia Random Article principle with Stillform's science as corpus)
2. **This — cognitive function measurement as evidence of neuroplasticity**

Arlin chose #2. This spec is the design.

---

## Why this is differentiated

Wellness apps universally measure surface activity:
- Headspace measures sessions completed
- Calm measures minutes practiced
- Insight Timer measures streaks
- Finch measures self-care actions

**None measure the cognitive functions the practice is supposed to be training.** This is a real gap in the category.

Stillform claims neuroplasticity ("repeated practice compounds across sessions"). The cited science (Lieberman 2007 affect labeling, Mehling 2012 interoception, Lehrer 2020 HRV biofeedback, Brewer 2011 trait-level changes) all point to specific cognitive functions that improve with practice. **The functions are measurable. Stillform should measure them.**

The honest framing: *"Eight weeks ago you took 4.2 seconds to name your state. Today you took 1.8. That's measurable. The function the practice is supposed to train has gotten faster."* This is recognition through evidence, not narrative. The user encounters their own neuroplasticity as data — not as a "good job!" message.

This works WITH Stillform's prestige + real work tension. The exercises ARE work. The results are honest evidence, not motivational gimmicks.

## The risk that has to be designed against

**Lumosity.** They got sued by the FTC in 2016 for overclaiming brain training benefits ($2M settlement). They claimed performance improvements would generalize to real-world cognitive function. The science didn't support those generalization claims.

Stillform's claim must be narrower and more honest: *"This specific function is faster than it was, which is consistent with the practice working as the literature predicts."* Not "your brain is X% better." Not "you've improved your cognitive abilities." The specific function. The specific measurement. The specific change.

Anything broader than that is overclaiming and dilutes Stillform's credibility — the thing that's most load-bearing about the brand.

---

## What functions to measure

Each measurement must satisfy four criteria:
1. **Grounded in Stillform's existing cited literature** (no new science introduced; this is recognition of practice already happening)
2. **Trainable by Stillform's existing tools** (the practice should produce measurable change in this function within weeks)
3. **Measurable in the app** (no special equipment; runs on phone in <60 seconds)
4. **Honest narrow claim** (the specific function improving, not general "brain better")

Five candidates emerge from the science sheet:

### Candidate 1: Affect Labeling Speed (Lieberman 2007)

**The science:** Translating an emotional experience into language reduces activation in the brain's threat-detection center. Lieberman et al. 2007 (psychological science). Confirmed across 15+ years of replications. The act of labeling IS regulation. Practice should make the labeling faster and more granular.

**The exercise:** User sees a brief scenario or facial expression for 1 second. Then a chip array appears (the same 9 chips Stillform already uses). User taps the chip that best fits. Time-to-tap is measured.

**Measurement:** Latency in milliseconds. Granularity (do they consistently pick a precise chip vs. fall back to "Mixed"?).

**What improvement looks like:** A user who took 3.2 seconds to identify "Stuck" eight weeks ago now takes 1.4 seconds. Across a sample of 20 stimuli, average latency drops 30%+. Granularity also improves — fewer "Mixed" fallbacks, more precise picks.

**Why this fits Stillform specifically:** the chip system is already the user's vocabulary. The exercise reuses their existing affect-labeling tool. No new conceptual model introduced. Just the same naming move, faster.

**Risk:** stimulus library has to be carefully constructed. Faces are research-backed (Ekman) but need to be ethically sourced. Scenarios are easier to construct but require validation.

### Candidate 2: Interoceptive Latency (Mehling 2012)

**The science:** Interoceptive awareness is the ability to read internal body signals. Mehling et al. 2012 (Multidimensional Assessment of Interoceptive Awareness — MAIA). Critchley & Garfinkel 2017. Not a fixed trait — trainable. Body Scan and Bio-filter are the practice that builds it.

**The exercise:** User taps "Begin." Audio cue starts. Question: "Where in your body do you feel pressure right now?" User selects from a body schematic (same one Body Scan uses) within 30 seconds. Stillform tracks specificity (single point vs. multiple vs. "I don't know") and latency.

**Measurement:** Time to identify. Specificity score (1 = single precise location, 0.5 = general region, 0 = "I don't know"). Stability over time (does the user's interoceptive read get more stable session-over-session?).

**What improvement looks like:** A user who took 22 seconds and selected "general chest area" now takes 8 seconds and selects "right side of jaw, low pressure." Specificity and speed both improve.

**Why this fits Stillform specifically:** the bio-filter and Body Scan ARE training this exact function. Measuring it directly proves the body work is doing what it claims.

**Risk:** more subjective than Candidate 1. The user might just get better at giving the answer they think the system wants. Mitigation: the exercise occasionally asks "where is there NO pressure right now" to break pattern-matching.

### Candidate 3: Cognitive Defusion / Reframe Generation (ACT lineage)

**The science:** Cognitive flexibility — the ability to generate alternative perspectives on a thought — is what Reframe practices. Hayes (ACT) on cognitive defusion. Trainable. Direct measurement of the cognitive function Reframe is training.

**The exercise:** User sees a thought ("My boss is going to fire me"). 30-second timer. User types as many alternative frames as they can in that window. ("Maybe my boss is having a hard week." "I'm reading rejection into a neutral tone." "Even if I am fired, I'd survive it." Etc.)

**Measurement:** Count of alternative frames generated. Distinctiveness (are the frames just rewordings or actually different perspectives?). Includes a quality dimension auto-evaluated by the AI.

**What improvement looks like:** Six weeks ago: 2 frames in 30 seconds, mostly variations on the same theme. Today: 5 frames, three of which are genuinely different perspectives (other-mind, reality-check, acceptance). Cognitive flexibility measured directly.

**Why this fits Stillform specifically:** Reframe is the most-used tool. This measures whether Reframe is actually training the function it claims to train.

**Risk:** the AI evaluation of "distinctiveness" introduces subjectivity. Mitigation: combine human-validated rubric with AI scoring; transparent criteria visible to the user.

### Candidate 4: Bias Recognition Speed (cognitive distortion identification)

**The science:** Beck's cognitive distortion taxonomy plus the bias profile Stillform already builds during calibration. Recognizing one's own distortions in real time is the function metacognitive practice trains. Wells 2009 MCT.

**The exercise:** User sees a thought ("Everyone at work hates me"). 10 seconds. Choose from: catastrophizing / mind-reading / all-or-nothing / personalization / mental filter / [other]. Time and accuracy measured.

**Measurement:** Latency to selection. Accuracy (against pre-validated label). Improvement against the user's specific bias profile (Stillform already knows which biases are theirs).

**What improvement looks like:** A user whose bias profile flags catastrophizing now identifies their own catastrophizing thoughts 50% faster. Direct measurement of metacognitive sharpening for THIS user's specific pattern.

**Why this fits Stillform specifically:** uses the bias profile that already exists. Personalized to the user's own actual cognitive patterns. Can't be gamified by external research because the bias profile is theirs.

**Risk:** validated stimulus library required. Each thought has to have a "correct" label, which is contestable. Mitigation: use research-validated CBT exercise sets where labels are established; offer "this label feels wrong" feedback to the user that improves the library over time.

### Candidate 5: HRV Biofeedback Coherence (Lehrer 2020)

**The science:** HRV (heart rate variability) coherence improves with paced breathing practice. Lehrer et al. 2020 (Applied Psychophysiology and Biofeedback). The function being trained: autonomic flexibility.

**The exercise:** Phone camera detects pulse via PPG (the green flash on the back camera, used in apps like Welltory). User holds finger on camera lens for 60 seconds while breathing at their preferred pace. HRV coherence measured.

**Measurement:** Coherence ratio (a specific HRV metric). Compared session-over-session.

**What improvement looks like:** Eight weeks of cyclic sighing practice produces measurable autonomic flexibility gains. The user sees their own coherence improving over time.

**Why this fits Stillform specifically:** the breathing tools claim parasympathetic activation; this measures whether it's working at the autonomic level.

**Risk:** technical complexity (PPG implementation), accuracy concerns on phone cameras (varies by device), introduces hardware dependency. Highest implementation cost. **Probably defer to a later phase.**

---

## Recommended starting set

For initial build: **Candidates 1, 2, 3.** They cover the three major Stillform mechanisms (affect labeling = chips, interoception = body work, cognitive defusion = Reframe). They're implementable without special hardware. They have the cleanest narrow claims. Together they form a coherent story: "Stillform is training three specific cognitive functions; here's the evidence."

Defer Candidate 4 (bias recognition) to phase 2 — it's good but requires more careful stimulus validation.

Defer Candidate 5 (HRV) to phase 3+ — the implementation cost is real and the additional signal isn't proportional yet.

---

## How it surfaces in the product

Three architectural questions to resolve:

### Q1: Where does the exercise live?

**Option A — Inside Self Mode as a sixth optional step.** The user finishes Notice/Name/Recognize/Perspective/Choose and is offered "Want to test the function you just practiced?" The practice and the measurement live together.

**Option B — As a separate "Practice Evidence" surface in My Progress.** User goes there deliberately. Sees their function curves over time. Can take a new measurement on demand.

**Option C — Both.** Self Mode offers it as optional 6th step (low-friction occasional capture); My Progress has the deep view (intentional engagement).

**My recommendation: C.** Captures opportunistically AND lets the curious user dig in. The measurement happens often enough to produce signal without being intrusive.

### Q2: How often should measurement happen?

The science requires baseline + repeated capture + comparison. If the user takes the test every day, fatigue produces false improvement. If they never take it, no time-series.

**Recommendation:** weekly cadence, opt-in, surfaced once a week as an optional add to a regular session. "It's been 7 days since your last function check. Want to take 60 seconds now?" User can always say no.

This produces ~52 data points per year per user. Enough for trend analysis. Not enough to fatigue.

### Q3: How is the result framed?

This is the most important question in the entire spec. The framing has to be honest, narrow, and motivating without being motivational.

**Wrong framing:**
- "Your brain is 18% faster!" (overclaiming, Lumosity-coded)
- "Great job! You're improving!" (toxic positivity)
- "Compare to other users!" (gamification, violates non-negotiables)

**Right framing examples:**
- "Affect labeling latency: 1.4s. Eight weeks ago: 3.2s. The literature predicts this function gets faster with practice. It has."
- "Interoceptive specificity: stable for the last four weeks. The body work is producing consistent reads."
- "Cognitive defusion frame count: 4. Six weeks ago: 2. The function Reframe trains is showing growth."

The voice anchors to what the science predicts and what the data shows. No interpretation beyond the evidence.

When the user has NOT improved, the framing has to be equally honest:
- "Affect labeling latency: 2.1s. Six weeks ago: 1.9s. Function isn't showing growth this period. This happens. The practice still works; the measurement noise is real. Check again next week."

This is service-that-demands. Honest data, no flattery, no shame. Just evidence.

---

## What this requires to build

### Phase 1: foundation (~3-4 weeks of focused work)

1. **Stimulus libraries.** For Candidate 1 (affect labeling): 50-100 validated scenarios paired with chip labels. For Candidate 3 (defusion): 30-50 thought stimuli with quality rubrics.
2. **Exercise UI components.** Reusable components for: timed selection, body schematic input, free-text generation with timer. These are real engineering — touch handling, timing precision, accessibility.
3. **Measurement infrastructure.** Per-user time-series storage encrypted on-device. Schema versioned. Comparison logic. The spec for THIS storage system needs its own care because it's evidence the user will trust over months.
4. **Surfacing logic.** When does the system suggest a measurement? How does it appear inside Self Mode? How does My Progress show the curves?
5. **Framing copy.** Every result message needs to be drafted, reviewed, locked. This is high-stakes copy because it's where the integrity claim lives.

### Phase 2: validation (~2 weeks before public release)

1. **Stimulus validation.** Pilot the exercises with 10-20 users to confirm they measure what they claim. Iterate the libraries.
2. **Time-series sanity.** Run Stillform staff (Arlin, Bobby, friendly testers) through 4+ weeks of measurement to verify the curves look like real practice signals, not random noise.
3. **Edge case audit.** What happens when a user is medicated during measurement? What about post-illness? What if they take it once and never again? Each edge case needs a defined behavior.

### Phase 3: launch (~1 week)

1. Release behind a feature flag to existing users first.
2. Monitor for misuse (users gaming the system, users reading results as diagnostic, users overweighting noise).
3. Adjust framing copy based on observed reactions.
4. Open to all users.

**Total realistic build time: 6-8 weeks of focused work.** This is moonshot scope. It's the centerpiece feature.

---

## The integrity check

Does this spec respect every non-negotiable from the Round 4 prompt?

1. **Calibration preserved** — yes. Bias profile actively used by Candidate 4.
2. **Processing types preserved** — yes. Routing logic untouched.
3. **Morning/EOD preserved** — yes. Function checks are weekly, not daily.
4. **Differentiated tools preserved** — yes. Each measurement maps to a specific tool's claim.
5. **Sessions as units preserved** — yes. Function checks happen INSIDE sessions or as their own brief sessions.
6. **My Progress as deliberate destination** — yes. Function curves live there; the system doesn't push them.
7. **No always-on ambient mode** — yes. Measurements happen in defined moments, not continuously.

Does it satisfy the prestige + real work tension?

**Prestige:** the framing is restrained, scientific, evidence-based. No badges. No streaks. No celebration. The data itself is the recognition.

**Real work:** the exercises ARE work. They take time. They require honest engagement. They produce measurable results that the user can't fake without faking themselves.

Both at once. This is the shape.

---

## What it gives Stillform that nothing else has

1. **A signature feature.** "Stillform measures the cognitive functions the practice trains. Nobody else does." That's a one-line pitch that's both true and differentiating.

2. **Real evidence the practice works.** Right now Stillform claims neuroplasticity. With this, Stillform proves it for each user individually.

3. **Recognition without gamification.** The user encounters their own progress as data, not as celebration. Respects them as adults practicing under load.

4. **A reason to return.** "I want to see if my labeling is faster" is a different return motivation than "I should regulate." It's curiosity-driven, not duty-driven. That's the engagement Arlin is missing.

5. **A research story.** Stillform's data layer becomes citable in its own right. Aggregate-anonymous trends in cognitive function improvement across the user base could be published. Strengthens the Dr. Yilmaz Balban outreach. Becomes the kind of product that academics write about.

6. **A defensible award case.** Aria asked Arlin to win an award. This is the feature that wins it. Nobody else in wellness has it. It's grounded in real science. It's executed at prestige altitude. It does something the user can't get anywhere else.

---

## Open questions for Arlin's review

1. **Naming.** "Function tests" / "Capacity tests" / "Practice evidence" / something else. The name matters because it sets the user's relationship to the feature. "Tests" might feel clinical; "evidence" might feel academic; "practice check" might be right.

2. **Five candidates → starting three.** Candidates 1, 2, 3 are recommended for Phase 1. Want to confirm or adjust.

3. **Cadence.** Weekly suggested. Could be every 3-5 days. Could be opportunistic ("we noticed you've practiced 4 times since your last function check"). What feels right?

4. **Self Mode integration.** Inside Self Mode as a 6th step, or separate? My recommendation is both, but it's Arlin's call.

5. **Failure framing.** When function isn't improving, the message has to be honest without discouraging. Draft proposed; needs Arlin's voice review.

6. **Phase ordering.** Spec assumes Phase 1 = build foundation. Could ship a smaller version first (just Candidate 1) to test reception. Faster to market; less complete claim.

---

## What I'm not including in this spec

- Specific stimulus library content (separate spec when build begins)
- Exact UI mockups (designed in build phase)
- Exact copy for result messages (designed in build phase, with Arlin's voice review)
- Backend storage schema details (engineering spec)
- Plausible event names (analytics spec)

These are real and necessary but they belong in build-phase specs, not in this conceptual one. This document defines what the feature IS. Build specs define HOW it ships.

---

*ARA Embers LLC · Cognitive Function Measurement Spec · April 30, 2026*
