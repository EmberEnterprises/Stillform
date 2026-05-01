# Plain-Language Neuroscience Surface — Spec (REVISED)

*Drafted May 1, 2026. Decisions locked. Corpus verified against Science Sheet. Ready for Arlin's verification pass before code.*

---

## What changed from v1

- Six open questions are now decisions: skip button = yes, AI failure = static fallback (~20 cards), first session = yes, frequency = once per session, "what this means for you" line = no, citation = always with full attribution
- ⓘ button added — small info icon on the card opens a modal explaining the three card types
- Three protections applied to my own corpus-drafting work (not just runtime AI) — no false claims, every entry traceable to Science Sheet text
- Corpus rebuilt from Science Sheet only — every entry has a source reference
- 20 static fallback cards drafted — same constraints as the runtime AI

---

## Decisions locked

| Question | Decision |
|---|---|
| Skip button on card? | Yes — matches close flow pattern |
| AI generation failure? | Static fallback — ~20 hand-written cards drawn from corpus |
| First-ever session? | Yes — show on first session |
| Frequency? | Once per session — every session, no daily cap |
| "What this means for you" observation line? | No — let user make their own connection |
| Citation format? | Always full attribution — Author year · Journal/Framework |

---

## User-facing behavior

### When the card appears

Post-session, after What Shifted (if reached), BEFORE ToolDebriefGate. The card sits in its own moment — one screen, one card, two buttons (Skip + Continue).

### Card layout

- System label: THE SCIENCE BEHIND THIS (Plex Mono mono-uppercase amber) with ⓘ button right-aligned
- Optional opening line referencing what the user did (Cormorant)
- Body: 60-120 words, plain language, ends on the finding (DM Sans)
- Citation: Author year · Journal (Plex Mono small)
- Footer: Skip button (ghost) + Continue button (primary)

### ⓘ info modal copy

```
THE SCIENCE BEHIND THIS

This card surfaces one finding from the research grounding 
Stillform's tools. Three things you should know about how 
these cards work:

Most cards are AI-generated at session close. The AI is given 
a curated library of peer-reviewed studies — the same studies 
documented in Stillform's Science Sheet — and writes a card 
in plain language tied to what you just practiced. The AI is 
NOT allowed to cite studies outside this library, invent 
findings, or attribute claims to researchers not in the corpus.

If the AI is unavailable, you'll see a hand-written static card. 
The static cards come from the same library, are written in the 
same voice, and are vetted before shipping.

If the AI can't find a study that closely matches what you just 
did, you may see a more general card about regulation practice 
itself. Better to give you broadly true information than 
falsely-specific information.

You can read more about the underlying science in Stillform's 
Science Sheet. Every citation here ties back to a real study 
or established framework.
```

### What the card body does NOT contain

- No prescription or advice
- No "what this means for you today" tie-back
- No first-person AI voice
- No emoji, exclamation points, "fun fact" framing
- No clinical labels applied to the user
- No marketing voice

---

## Architecture

### Generation flow

1. Session ends → user reaches close flow
2. After What Shifted (if shown), frontend calls `reframe.js` with `mode: "science_card"` plus session context
3. Server uses science-card system prompt
4. On success: returns `{ openingLine, body, citation, topic, source: "ai" }`
5. On failure: frontend selects random static card, marks `source: "static"`
6. Frontend renders → user taps Skip or Continue → ToolDebriefGate appears

### System prompt (4 layers)

**Layer 1 — Stillform voice foundation** (reused from existing reframe.js):
No clinical labels, no love language, plain language, show-don't-tell, honest and specific, no emoji, no marketing voice.

**Layer 2 — Science card-specific rules:**
- Reference exactly ONE study/framework per card
- Study MUST come from the corpus in Layer 3
- Do NOT cite studies, researchers, or frameworks not in the corpus
- Do NOT invent findings, statistics, or claims
- If no corpus entry matches, return a card from a generally-applicable corpus entry
- 60-120 words body. Hard cap.
- End on the finding. Not on prescription, suggestion, or what-this-means-for-you observation.
- Always include citation in format: `Author year · Journal` (or `Framework name`)
- Optional opening line should reference what user did, in plain language

**Layer 3 — Verified corpus** (see below)

**Layer 4 — Session context:**
- lastTool, lastBreathPattern, lastBodyScanArea, feelStateBefore, feelStateAfter, recentTopics (last 5), sessionCount

---

## VERIFIED CORPUS (v1) — every entry traceable to Science Sheet

### Breathing & autonomic

**`cyclic_sighing`** — Balban et al. 2023 · Cell Reports Medicine
*Source: Science Sheet "Paced Breathing" section*
Stanford RCT compared four breath practices over 28 days. Cyclic sighing — two nasal inhales followed by a long oral exhale — produced the greatest mood improvement and respiratory rate reduction. Outperformed mindfulness meditation at the same dose.

**`breath_vagal_model`** — Gerritsen & Band 2018 · Frontiers in Human Neuroscience
*Source: Science Sheet "Paced Breathing" section*
Slow breathing works through the vagus nerve. The respiratory pattern itself is the lever — extended exhale activates the parasympathetic system, the body's brake pedal.

**`slow_breathing_general`** — Zaccaro et al. 2018 · Frontiers in Human Neuroscience
*Source: Science Sheet "Paced Breathing" section*
Slow breathing techniques improve autonomic function, emotional control, and psychological well-being. Mechanism is consistent: extended exhale, vagal activation, parasympathetic shift.

**`diaphragmatic_cortisol`** — Ma et al. 2017 · Frontiers in Psychology
*Source: Science Sheet "Paced Breathing" section*
Diaphragmatic breathing reduces cortisol levels — measurably. The body's stress chemistry is responsive to how you breathe.

### Body Scan & interoception

**`acupressure_anxiety`** — Au et al. 2015 · Journal of Advanced Nursing
*Source: Science Sheet "Body Scan (Acupressure)" section*
Self-administered acupressure reduces anxiety. Pressure is part of the mechanism — but so is the focused attention on the body that pressure requires.

**`interoception_emotion`** — Mehling et al. 2012 · PLOS ONE
*Source: Science Sheet "Body Scan (Acupressure)" section*
Interoceptive awareness — the ability to accurately sense what your body is doing — is linked to emotional regulation. The more accurately you read the body, the better you regulate the mind.

**`interoception_emotional_awareness`** — Critchley & Garfinkel 2017 · Current Opinion in Behavioral Sciences
*Source: Science Sheet "Body Scan (Acupressure)" section*
Emotional awareness is built on interoception. You can't accurately know what you feel without accurately reading what the body is doing.

### Reframe & cognitive reappraisal

**`cognitive_reappraisal`** — Ochsner & Gross 2005 · Trends in Cognitive Sciences
*Source: Science Sheet "Reframe (AI Cognitive Reappraisal)" section*
Reinterpreting an emotional trigger — cognitive reappraisal — is the most well-researched emotion regulation strategy. Reduces amygdala activation, increases prefrontal cortex engagement.

**`reappraisal_neuroimaging`** — Buhle et al. 2014 · Cerebral Cortex
*Source: Science Sheet "Reframe (AI Cognitive Reappraisal)" section*
Reappraisal consistently reduces negative emotion in neuroimaging studies. Effect is reliable across studies, methods, populations.

**`reappraisal_prefrontal`** — Denny et al. 2015 · Neuroscience & Biobehavioral Reviews
*Source: Science Sheet "Reframe (AI Cognitive Reappraisal)" section*
Reappraisal engages the lateral and medial prefrontal cortex — brain regions responsible for flexible thinking and self-control.

### Affect labeling

**`affect_labeling`** — Lieberman et al. 2007 · Psychological Science
*Source: Science Sheet "Affect Labeling" section*
Putting a name on an emotion — affect labeling — directly reduces amygdala activation and increases prefrontal cortex engagement. fMRI shows this happens automatically.

**`affect_labeling_implicit`** — Torre & Lieberman 2018 · Emotion Review
*Source: Science Sheet "Affect Labeling" section*
Affect labeling works as implicit emotion regulation — meaning you don't have to consciously try to regulate. The act of naming the feeling is itself the regulation.

**`affect_labeling_vlpfc`** — Burklund et al. 2014 · Psychological Science
*Source: Science Sheet "Affect Labeling" section*
Affect labeling activates the right ventrolateral prefrontal cortex — a brain region tied to inhibition and emotional control.

### Emotional granularity

**`granularity_regulation`** — Barrett et al. 2001 · Cognition & Emotion
*Source: Science Sheet "Emotional Granularity" section*
People who can make fine-grained distinctions between emotions regulate better. The skill is trainable, improves with practice.

**`granularity_protective`** — Kashdan, Barrett & McKnight 2015 · Current Directions in Psychological Science
*Source: Science Sheet "Emotional Granularity" section*
Higher emotional granularity protects against binge drinking, aggression, and self-harm. The more precisely you can name what you feel, the less likely you reach for harmful coping.

**`granularity_trainable`** — Hoemann, Barrett & Quigley 2021 · Frontiers in Psychology
*Source: Science Sheet "Emotional Granularity" section*
Emotional granularity increases with repeated self-assessment. Naming what you feel — over and over, accurately — builds the capacity itself.

### Bio-filter

**`sleep_amygdala`** — Goldstein et al. 2007 · Current Biology
*Source: Science Sheet "Bio-Filter" section*
Sleep deprivation amplifies amygdala reactivity. Running on too little sleep, neutral faces register as threatening. Hardware shapes perception before the mind gets a vote.

**`misattribution_arousal`** — Schachter & Singer 1962 · Psychological Review
*Source: Science Sheet "Bio-Filter" section*
People misattribute physical arousal to emotional causes. A racing heart from caffeine can feel like anxiety. Body signals are interpretable, and interpretation isn't always accurate.

**`pain_attention`** — Eccleston & Crombez 1999 · Pain
*Source: Science Sheet "Bio-Filter" section*
Pain demands attentional resources and disrupts cognitive function. When the body is sending a pain signal, less of you is available for thinking clearly.

### Two-pathway routing

**`interoception_regulation_strategy`** — Price & Hooven 2018 · Appetite
*Source: Science Sheet "Two-Pathway System" section*
Interoceptive awareness mediates the relationship between emotion regulation and emotional eating. Reading the body accurately changes what regulation strategy works.

**`regulation_individual_differences`** — Webb et al. 2012 · Psychological Bulletin
*Source: Science Sheet "Two-Pathway System" section*
Different regulation strategies have different effect sizes depending on the person. There is no one strategy best for everyone — knowing your tendency is part of the work.

### MCT (primary framework)

**`mct_detached_mindfulness`** — Wells 2009 · Metacognitive Therapy framework
*Source: Science Sheet "Metacognitive Therapy (MCT)" section*
Detached mindfulness — observing thoughts and feelings without engaging, suppressing, or arguing with them — is a clinical practice. The shift from "I am anxious" to "I'm noticing anxiety" is the entire mechanism.

**`mct_efficacy`** — Normann & Morina 2018 · Frontiers in Psychology
*Source: Science Sheet "Metacognitive Therapy (MCT)" section*
Meta-analysis of MCT efficacy across anxiety and depression — effect sizes exceeded CBT in several conditions.

### Implementation intentions

**`implementation_intentions`** — Gollwitzer 1999 · American Psychologist
*Source: Science Sheet "Implementation Intentions" section*
"If X happens, I will do Y" planning dramatically increases follow-through. Pre-deciding bypasses decision paralysis at the moment.

**`implementation_intentions_meta`** — Gollwitzer & Sheeran 2006 · Advances in Experimental Social Psychology
*Source: Science Sheet "Implementation Intentions" section*
Meta-analysis of implementation intentions found medium-to-large effect on goal attainment across hundreds of studies.

### Default Mode Network

**`dmn_discovery`** — Raichle et al. 2001 · PNAS
*Source: Science Sheet "Default Mode Network Interruption" section*
The brain has a default mode of activity during rest — a network that drives mind-wandering, rumination, self-referential thought.

**`dmn_meditation`** — Brewer et al. 2011 · PNAS
*Source: Science Sheet "Default Mode Network Interruption" section*
Meditation reduces default mode network activity. The neural circuit responsible for rumination quiets when attention is held elsewhere.

**`dmn_breathing`** — Doll et al. 2015 · Social Cognitive and Affective Neuroscience
*Source: Science Sheet "Default Mode Network Interruption" section*
Mindful breathing shifts brain activation from default mode network to task-positive network. Can't ruminate and follow a breath count at the same time.

### Autonomic flexibility / HRV

**`hrv_emotion_regulation`** — Thayer & Lane 2000 · Review of General Psychology
*Source: Science Sheet "Autonomic Flexibility" section*
Heart rate variability is an index of regulated emotional responding. The more flexibly your nervous system shifts between states, the more emotionally regulated you tend to be.

**`hrv_capacity`** — Appelhans & Luecken 2006 · Review of General Psychology
*Source: Science Sheet "Autonomic Flexibility" section*
HRV reflects emotion regulation capacity. The body's flexibility is the regulation capacity.

**`hrv_biofeedback`** — Lehrer & Gevirtz 2014 · Frontiers in Public Health
*Source: Science Sheet "Autonomic Flexibility" section*
HRV biofeedback training improves autonomic regulation. Capacity is trainable, not fixed.

### Stress inoculation

**`stress_inoculation`** — Meichenbaum 1985 · Stress Inoculation Training
*Source: Science Sheet "Stress Inoculation" section*
Controlled, manageable exposure to stress paired with regulation practice builds resilience. Practicing when calm trains skills that deploy automatically under pressure.

**`sit_clinical`** — Saunders et al. 1996 · Clinical Psychology Review
*Source: Science Sheet "Stress Inoculation" section*
Stress Inoculation Training is effective across anxiety disorders, PTSD, performance anxiety. Mechanism translates across domains.

### Window of Tolerance

**`window_of_tolerance`** — Siegel 1999 · The Developing Mind
*Source: Science Sheet "Window of Tolerance" section*
There's a zone where you can think clearly, regulate emotions, and function — the window of tolerance. Above it: hyperarousal. Below it: hypoarousal. Regulation practice widens the window over time.

**`polyvagal`** — Porges 2011 · The Polyvagal Theory
*Source: Science Sheet "Window of Tolerance" section*
The vagus nerve is central to the body's ability to shift between states. Polyvagal theory describes how the nervous system manages threat, calm, and connection.

### Interpersonal microbiases

**`interpersonal_perception_bias`** — Genzer et al. 2025 · Nature Communications
*Source: Science Sheet "Interpersonal Microbiases" section*
People systematically overestimate the intensity of others' negative emotions. Bias is on average adaptive — predicting greater empathy with strangers. Stops being adaptive when perceiver is depleted, in pain, or sleep-deprived.

### Fractal Visual Grounding

**`fractal_grounding`** — Hagerhall et al. 2015 · Nonlinear Dynamics, Psychology, and Life Sciences
*Source: Science Sheet "Fractal Visual Grounding" section*
Natural fractal patterns at mid-range complexity induce alpha wave EEG responses associated with relaxed wakefulness. Visual cortex responds to the geometry itself.

---

## Static fallback cards (20)

Each drawn directly from a corpus entry. Same constraints: under 120 words, plain language, end on finding, full citation.

**Card 1 — Cyclic Sighing**
> Stanford researchers studied this exact pattern. In a 28-day RCT, cyclic sighing — two nasal inhales then a long oral exhale — produced the greatest mood improvement and respiratory rate reduction of the four practices tested. It outperformed mindfulness meditation at the same dose.
>
> *Balban et al. 2023 · Cell Reports Medicine*

**Card 2 — Slow breathing**
> Slow breathing techniques improve autonomic function, emotional control, and psychological well-being. The mechanism is consistent across patterns: extended exhale, vagal activation, parasympathetic shift. The breath is the lever; the body responds.
>
> *Zaccaro et al. 2018 · Frontiers in Human Neuroscience*

**Card 3 — Affect labeling**
> Putting a name on an emotion directly reduces amygdala activation. fMRI studies show this happens automatically, even without conscious intent to regulate. You don't have to analyze the feeling. Naming it turns down the alarm.
>
> *Lieberman et al. 2007 · Psychological Science*

**Card 4 — Cognitive reappraisal**
> Reinterpreting an emotional trigger is the most well-researched emotion regulation strategy. It reduces amygdala activation and increases prefrontal cortex engagement. The same situation, seen differently, lands differently in the body.
>
> *Ochsner & Gross 2005 · Trends in Cognitive Sciences*

**Card 5 — Interoception**
> Interoceptive awareness — the ability to accurately sense what your body is doing — is linked to emotional regulation. The more accurately you read the body, the better you regulate the mind.
>
> *Mehling et al. 2012 · PLOS ONE*

**Card 6 — Emotional granularity**
> People who can make fine-grained distinctions between emotions regulate better. Higher granularity protects against binge drinking, aggression, and self-harm. The more precisely you name what you feel, the less likely you are to reach for harmful coping.
>
> *Kashdan, Barrett & McKnight 2015 · Current Directions in Psychological Science*

**Card 7 — Sleep & threat perception**
> Sleep deprivation amplifies the brain's threat-detection. A person running on too little sleep perceives neutral faces as threatening. The hardware shapes the perception before the mind gets a vote.
>
> *Goldstein et al. 2007 · Current Biology*

**Card 8 — DMN interruption**
> The brain has a circuit that drives rumination — the default mode network. It quiets when attention is held by something concrete, like a breath count. You can't ruminate and follow a 4-1-8 pattern at the same time.
>
> *Doll et al. 2015 · Social Cognitive and Affective Neuroscience*

**Card 9 — HRV & regulation**
> Heart rate variability is an index of regulated emotional responding. The more flexibly your nervous system shifts between states, the more emotionally regulated you tend to be. The capacity is trainable — not fixed.
>
> *Lehrer & Gevirtz 2014 · Frontiers in Public Health*

**Card 10 — Implementation intentions**
> "If X happens, I will do Y" planning dramatically increases follow-through on intended behavior. Pre-deciding your response — when calm — bypasses decision paralysis at the moment of distress.
>
> *Gollwitzer 1999 · American Psychologist*

**Card 11 — MCT detached mindfulness**
> The shift from "I am anxious" to "I'm noticing anxiety" is the foundation of metacognitive therapy. Observing the state instead of being fused with it is the entire mechanism.
>
> *Wells 2009 · Metacognitive Therapy framework*

**Card 12 — Stress inoculation**
> Practicing regulation when calm trains the skills that deploy automatically under pressure. Special operators, surgeons, and first responders use this principle. Daily practice, before it's needed, builds the capacity for when it is.
>
> *Meichenbaum 1985 · Stress Inoculation Training*

**Card 13 — Window of tolerance**
> There's a zone where you can think clearly, regulate emotions, and function. Above it: hyperarousal — panic, rage, overwhelm. Below it: hypoarousal — numbness, shutdown. Regulation practice widens the window over time.
>
> *Siegel 1999 · The Developing Mind*

**Card 14 — Acupressure & anxiety**
> Self-administered acupressure reduces anxiety. The pressure itself is part of the mechanism — but so is the focused attention on the body that pressure requires. Two things at once: tactile and attentional.
>
> *Au et al. 2015 · Journal of Advanced Nursing*

**Card 15 — Reappraisal in neuroimaging**
> Reappraisal consistently reduces negative emotion in neuroimaging studies. The effect is reliable enough to show up across studies, methods, and populations. The brain genuinely processes the reinterpreted situation differently.
>
> *Buhle et al. 2014 · Cerebral Cortex*

**Card 16 — Pain & attention**
> Pain demands attentional resources and disrupts cognitive function. When the body is sending a pain signal, less of you is available for thinking clearly about anything else. The bio-filter is honest about this.
>
> *Eccleston & Crombez 1999 · Pain*

**Card 17 — Granularity trainable**
> Emotional granularity increases with repeated self-assessment. Naming what you feel — over and over, accurately — builds the capacity itself. The chips are training disguised as chips.
>
> *Hoemann, Barrett & Quigley 2021 · Frontiers in Psychology*

**Card 18 — Affect labeling implicit**
> Affect labeling works as implicit emotion regulation. You don't have to consciously try. The act of naming the feeling is itself the regulation. The brain treats the naming as the work.
>
> *Torre & Lieberman 2018 · Emotion Review*

**Card 19 — Diaphragmatic breathing & cortisol**
> Diaphragmatic breathing reduces cortisol levels — measurably. The body's stress chemistry is responsive to how you breathe. The lever is real.
>
> *Ma et al. 2017 · Frontiers in Psychology*

**Card 20 — MCT efficacy**
> Meta-analysis of metacognitive therapy across anxiety and depression found effect sizes exceeding CBT in several conditions. Observing the state — rather than challenging the content of thoughts — produces measurable clinical outcomes.
>
> *Normann & Morina 2018 · Frontiers in Psychology*

---

## Routing logic (tool → topic chain)

When AI generates a card, picks first topic in the chain that's NOT in `recentTopics`. Falls back to a generally-applicable topic if all session-specific options are recent.

| Tool / Pattern | Topic chain |
|---|---|
| Breathe (Cyclic Sighing) | cyclic_sighing → breath_vagal_model → slow_breathing_general → diaphragmatic_cortisol |
| Breathe (Deep Regulate / Quick Reset / 4-7-8) | slow_breathing_general → breath_vagal_model → diaphragmatic_cortisol → dmn_breathing |
| Body Scan | acupressure_anxiety → interoception_emotion → interoception_emotional_awareness |
| Reframe | cognitive_reappraisal → reappraisal_neuroimaging → reappraisal_prefrontal → affect_labeling |
| Self Mode | mct_detached_mindfulness → mct_efficacy → implementation_intentions |
| Big shift (delta ≥ 3) | hrv_emotion_regulation → hrv_capacity → window_of_tolerance |
| No-shift session (delta = 0/null) | stress_inoculation → sit_clinical → granularity_trainable |
| Generic fallback | window_of_tolerance → mct_detached_mindfulness → hrv_capacity |

---

## Storage & analytics

- Generated cards NOT stored beyond display (transient)
- `stillform_card_history` localStorage — last 5 topics retained for `recentTopics`
- Plausible event `Science Card Shown` — props: topic, tool, source ("ai" | "static"), hadOpeningLine
- Plausible event `Science Card Continued` — fires on Continue tap
- Plausible event `Science Card Skipped` — fires on Skip tap
- Plausible event `Science Card Info Opened` — fires on ⓘ tap

---

## Defense-in-depth — three protections

**Protection A: Hard system prompt rule.** Layer 2 explicitly forbids citing studies outside corpus, inventing findings, attributing claims to researchers not in corpus. Phrased as SEVERE failure clause.

**Protection B: Server-side validation.** Before returning to frontend, `reframe.js` checks that the AI's `citation` field matches a known corpus entry's citation string. Mismatch → discard, return static fallback.

**Protection C: Corpus verified before ship.** Every entry includes a Science Sheet source reference. Each plain-language summary is a paraphrase of what Science Sheet itself says about that study. Arlin reviews corpus and flags any entry where summary feels off.

---

## Implementation files

### `netlify/functions/reframe.js`
- New branch: `if (mode === "science_card") { ... }`
- New system prompt with corpus + rules
- Citation validation against corpus before return
- Returns: `{ openingLine, body, citation, topic, source }`
- ~120 lines added

### `src/App.jsx`
- New `ScienceCard` component (~80 lines + ⓘ modal)
- Static fallback array (20 cards)
- Insertion point in close flow
- localStorage helper for `stillform_card_history`
- 4 Plausible events
- Loading state for API call
- ~150 lines added

### Total: ~270 lines across two files + 36 corpus entries (drafted, awaiting verification)

---

## Pre-build checklist for Arlin

Before code is written:

1. **Corpus entries** — read each plain-finding line. Flag any that feel off
2. **Static fallback cards** — read each card. Flag any out of voice
3. **ⓘ modal copy** — confirm it accurately describes architecture
4. **Corpus completeness** — anything important missing from Science Sheet that should be here?
5. **Routing chains** — does tool→topic mapping make sense?

Once verified, code proceeds.

---

## What this is NOT

- Not a notification system
- Not a content library user can browse
- Not "Did You Know" trivia
- Not a marketing surface
- Not a replacement for the Science Sheet
- Not the Cognitive Function Measurement moonshot (separate)
- Not the kinesthetic close interaction (separate)

---

*ARA Embers LLC · Plain-Language Neuroscience Surface Spec v2 · May 1, 2026*
