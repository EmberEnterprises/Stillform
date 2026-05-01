# Plain-Language Neuroscience Surface — Spec

*Drafted May 1, 2026. Awaiting Arlin's review of 6 open questions before build.*

---

## What this is

A small post-session card surfacing one specific finding from the science Stillform is grounded in, translated to plain language, tied to what the user just practiced. AI-generated at runtime via the existing reframe.js Netlify function. Once per session.

The card converts Stillform's science from "things in a sheet I'd never open" into moments of recognition. The user just used Cyclic Sighing; the card tells them about Stanford's Balban et al. 2023 RCT in plain language. The science they were told grounds the practice becomes *real* to them in 15 seconds of reading.

## Why this matters

Per the May 1 diagnosis: testers experienced Stillform's regulation tool, called it cool, and bounced. The product gives the user something *during* sessions; it gives them nothing *between* sessions. The plain-language science card is one of three engagement-craft return mechanisms designed to address this (alongside Cognitive Function Measurement and the kinesthetic close).

The card is grounded in:
- **Engagement Principle 6** — variable reward done ethically (each card is different, tied to what the user actually practiced; small surprise inside a consistent structure)
- **Engagement Principle 9** — Norman affordance perception (the card is something the user *encounters*, not something pushed at them)
- **Engagement Principle 10** — attention-respectful design (no notification, no badge, no infinite scroll; appears once at a moment the user is already settled)

It is also a small return-loop primitive. The user comes to associate session completion with learning something specific about themselves and the science. That association is part of what produces return.

---

## User-facing behavior

### When the card appears

After session completion, as part of the close flow. Specifically: after the post-rate screen, after the What Shifted screen if that was reached, BEFORE the ToolDebriefGate. The card sits in its own moment — one screen, one card, one Continue button.

If the user skips the post-rate or What Shifted screens, the card still appears (the session completed; the science still applies). The card never appears mid-session — only at the close.

### What the card looks like

```
┌─────────────────────────────────────┐
│ THE SCIENCE BEHIND THIS              │  ← Plex Mono, mono uppercase, amber
│                                      │
│ You used Cyclic Sighing.             │  ← optional first line, Cormorant
│                                      │
│ Stanford researchers studied this    │
│ exact pattern — a double inhale      │  ← body, DM Sans, plain language
│ through the nose followed by a       │
│ long exhale through the mouth.       │
│ In their 2023 randomized trial,      │
│ five minutes a day reduced anxiety   │
│ more than mindfulness meditation.    │
│                                      │
│ Balban et al. 2023 · Cell Reports    │  ← citation line, Plex Mono small
│                                      │
│           [ Continue ]               │  ← single button, primary
└─────────────────────────────────────┘
```

Visual treatment matches Stillform's prestige aesthetic — hairline border, deep ground, amber accent on the system label. The card is a deliberate object on a black surface. Not a notification. Not a popup. A moment.

### What's in the card

- **System label:** "THE SCIENCE BEHIND THIS" (Plex Mono, mono uppercase, amber)
- **Optional opening line:** references what the user did ("You used Cyclic Sighing." / "You worked with shoulders & neck tension." / "You named what shifted as 'I made space for clarity.'")
- **Body:** 60-120 words, plain language, single paragraph, ends on the finding (no prescription, no advice)
- **Citation line:** author year + journal (Plex Mono small)
- **Continue button:** primary CTA, takes user to ToolDebriefGate

### What the card does NOT contain

- No prescription (*"so try doing it again tomorrow"* — no)
- No "you should" / "you ought to" / "try" / "remember to"
- No emoji
- No exclamation points
- No clinical labels applied to the user
- No promises or claims about what the user will experience next time
- No marketing voice ("isn't that amazing?" — no)
- No "fun fact"-coded language
- No comparison to other apps or other approaches
- No first-person AI voice ("I think this is interesting" — no)

The card is a quiet observation from the science library, not a coach speaking to the user.

---

## Architecture

### Generation flow

1. Session ends, user reaches post-rate / What Shifted close flow
2. Just before ToolDebriefGate would appear, frontend calls `/.netlify/functions/reframe.js` with a new mode parameter (`mode: "science_card"`)
3. Server receives session context (tool used, breath pattern if applicable, feel state shift, recent card topics if any)
4. Server uses dedicated science-card system prompt (described below) to generate the card
5. Server returns JSON `{ "openingLine": string|null, "body": string, "citation": string, "topic": string }`
6. Frontend renders the card, user reads, taps Continue, ToolDebriefGate appears as normal

### System prompt structure

The science card system prompt has FOUR layers, in this order:

**Layer 1: Stillform voice foundation** — pulled directly from existing reframe.js calm-mode prompt:
- No clinical labels applied to the user
- No "love language" (don't say you care; show through quality)
- Plain language; if a technical term is necessary, define it in the same sentence
- Show, don't tell
- Honest, specific, not generic
- No emoji, no marketing voice, no hype

**Layer 2: Science-card-specific rules** — new for this surface:
- Reference ONE study or framework per card, only from the curated corpus below
- Do NOT invent findings. If no study in the corpus matches the user's session, return a card grounded in the broader practice (e.g., "regulation in general," not "what you specifically did")
- 60-120 words in the body. Hard cap.
- End on the finding. Not on a prescription, suggestion, or advice.
- The opening line is optional but should reference what the user actually did when present
- Always cite author + year + journal name (or framework if not a single study)
- The user just completed a session. They are settled. Match that tone.

**Layer 3: Curated science corpus** — embedded in the prompt as a structured list. Each entry is `{topic_key, study_name, plain_finding, study_type}`. Drafted v1 corpus below (~30 entries):

| Topic key | Study/framework | Plain-language finding |
|---|---|---|
| `cyclic_sighing` | Balban et al. 2023, Cell Reports Medicine | RCT: 5 min/day cyclic sighing reduced anxiety more than mindfulness in 28 days |
| `physiological_sigh` | Vlemincx et al. 2010 | Spontaneous sighs reset breathing patterns and downregulate sympathetic activation |
| `box_breathing` | Hopper et al. 2019 | 4-4-4-4 pattern improves heart rate variability and stress recovery |
| `paced_breathing_general` | Lehrer & Gevirtz 2014 | Slow breathing (5-7 breaths/min) increases vagal tone and HRV |
| `affect_labeling` | Lieberman 2007, Psychological Science | Naming an emotion reduces amygdala activity and increases prefrontal regulation |
| `cognitive_reappraisal` | Ochsner & Gross 2005 | Reframing a stimulus changes its emotional impact at the neural level |
| `memory_reconsolidation` | Schiller et al. 2010, Nature | Recalling a memory makes it temporarily updateable; reframing during recall changes future emotional response |
| `interoceptive_awareness` | Mehling 2012 / Garfinkel 2015 | Accurate body-state perception predicts emotional regulation capacity |
| `predictive_processing_emotion` | Barrett 2017 | The brain constructs emotion from interoceptive prediction; updating predictions changes felt experience |
| `granularity_emotional` | Barrett 2001 | Specific emotion vocabulary correlates with better regulation outcomes |
| `polyvagal_shutdown` | Porges 2011 | When the system shuts down (Distant), reactivation requires somatic re-engagement before words land |
| `acupressure_tension_release` | Hou et al. 2010 / Field 2014 | Pressure on specific points reduces measured muscle tension and cortisol |
| `body_scan_attention` | Kabat-Zinn 1990 / Mehling 2012 | Sustained attention to body areas trains interoceptive accuracy |
| `implementation_intentions` | Gollwitzer 1999 | If-then plans bridge intention-behavior gap; specificity 2-3x more likely to be acted on |
| `intention_behavior_gap` | Sheeran & Webb 2016 | Implementation intentions plus contextual triggers close the gap most reliably |
| `habit_formation_context` | Wood & Rünger 2016 | Habits form through context-cue pairing; repetition without context produces conscious behavior, not habits |
| `metacognition_in_dialogue` | Wells 2009 | Detached mindfulness — observing thoughts without engaging — reduces rumination |
| `acceptance_commitment` | Hayes 2006 | Cognitive defusion (separating from thoughts) reduces their emotional pull |
| `self_compassion` | Neff 2003 | Self-compassion under pressure correlates with better regulation than self-criticism |
| `prefrontal_under_load` | Arnsten 2009 | Stress reduces prefrontal cortex availability; bottom-up regulation restores it |
| `vagal_tone_regulation` | Porges 2009 | Vagal tone is trainable; higher tone correlates with emotion regulation capacity |
| `narrative_self_distance` | Ayduk & Kross 2010 | Self-distanced reflection ("you/he/she") reduces emotional reactivity vs. immersed ("I/me") |
| `emotional_suppression_cost` | Gross 2002 | Suppressing emotion increases cardiovascular load without reducing felt experience |
| `reappraisal_vs_suppression` | Gross 2015 | Reappraisal reduces emotion at the source; suppression hides it without reducing it |
| `hrv_emotion_regulation` | Thayer & Lane 2009 | HRV is a biomarker of emotion regulation capacity; trainable |
| `naming_to_regulate` | Lieberman 2018 | Affect labeling activates ventrolateral prefrontal cortex; downregulates amygdala |
| `breathing_and_attention` | Zelano et al. 2016 | Nasal breathing entrains hippocampal and amygdalar rhythms; supports attention |
| `state_dependent_thinking` | Schwarz & Clore 1983 | Current physiological state biases cognitive judgment; regulating the body changes the thinking |
| `practice_neuroplasticity` | Davidson 2008 | Repeated practice of regulation produces measurable structural brain changes |
| `composure_skill_not_trait` | Lazarus 1991 / Gross 2015 | Emotional regulation is a trainable skill, not a fixed personality trait |

(Corpus expands over time. Each entry is plain-language source-of-truth for that topic. AI translates the finding into Stillform-voice copy at generation time.)

**Layer 4: Session context** — passed at runtime:
- `lastTool`: "breathe" | "scan" | "reframe" | "metacognition"
- `lastBreathPattern`: "cyclic_sighing" | "box" | "quick_reset" | "deep_regulate" | "478" (if applicable)
- `lastBodyScanArea`: name of last area worked (if scan)
- `feelStateBefore`: chip name or null
- `feelStateAfter`: chip name or null
- `recentTopics`: array of last 3-5 card topics shown to this user
- `sessionCount`: total sessions for this user

The AI uses this to (1) pick a relevant topic from the corpus that matches what the user did, (2) avoid recently-shown topics, (3) calibrate the opening line if the session has clear contextual hooks.

### Routing logic

Tool to topic mapping (fallback chain — AI picks first match that's not in `recentTopics`):

- **Breathe (Cyclic Sighing)** → cyclic_sighing → physiological_sigh → paced_breathing_general → vagal_tone_regulation
- **Breathe (Box)** → box_breathing → paced_breathing_general → hrv_emotion_regulation
- **Breathe (Quick Reset / Deep Regulate / 4-7-8)** → paced_breathing_general → vagal_tone_regulation → breathing_and_attention
- **Body Scan** → body_scan_attention → interoceptive_awareness → acupressure_tension_release
- **Reframe (any mode)** → cognitive_reappraisal → affect_labeling → memory_reconsolidation → reappraisal_vs_suppression
- **Self Mode** → metacognition_in_dialogue → narrative_self_distance → granularity_emotional
- **Big shift detected** (delta ≥ 3) → state_dependent_thinking → reappraisal_vs_suppression → composure_skill_not_trait
- **No-shift session** (delta = 0 or null) → habit_formation_context → practice_neuroplasticity → composure_skill_not_trait

### Cost & infrastructure

- Per call: ~600-1000 tokens prompt + ~200 tokens output = ~$0.002 per card
- At 2 sessions/user/day average: ~$0.004/user/day = ~$1.50/user/year
- Negligible against subscription pricing
- Reuses existing reframe.js Netlify function infrastructure (no new endpoint)
- Reuses existing rate limiting (10 req/IP/min — well above session frequency)
- Reuses existing OpenAI API key + secret management

### Storage & analytics

- Generated cards are NOT stored (transient — generated, displayed, discarded)
- Card topic IS logged to `stillform_card_history` (last 5 topics retained, used for `recentTopics` parameter)
- Plausible event `Science Card Shown` fires with props `{ topic, tool, hadOpeningLine }`
- Plausible event `Science Card Continued` fires when user taps Continue (measures whether card is being read or skipped past)

---

## Implementation files

### `netlify/functions/reframe.js`
- Add new branch for `mode === "science_card"` 
- New system prompt assembled from Layers 1-4
- Returns structured JSON
- Same auth, rate limiting, error handling

### `src/App.jsx`
- New `ScienceCard` component (~80 lines including styling)
- Insertion point in the close flow (after What Shifted, before ToolDebriefGate)
- New localStorage helper for `stillform_card_history` (~15 lines)
- New Plausible events
- Loading state for the ~1-2s API call

### Total estimated code change
~150 lines across the two files. Plus ~30 corpus entries that need final review/approval.

---

## Open questions for Arlin

### Q1 — Skip option on the card?

The card is post-session, after the user has done real work. Options:

- **A: Yes — Skip button** (matches the rest of the close flow, respects user authority)
- **B: No — Continue is the only button** (the card is short enough that skip is unnecessary; making it skippable signals it's optional information)
- **C: Skip after first card; subsequent cards get Continue only** (treat the introduction as worth requiring; later cards are familiar)

### Q2 — What if AI generation fails?

The Netlify function call could fail (network, API down, etc.). Options:

- **A: Show a static fallback card** (one generic card written by hand, "Regulation is a trainable skill — Lazarus 1991" or similar)
- **B: Skip the card screen entirely on failure** (user goes straight to ToolDebriefGate, no card that session)
- **C: Show a "Could not load" state with retry**

### Q3 — Cards on first-ever session?

A user's very first session ever — show the card, or wait until session 2?

- **A: Show on first session** (immediate value; user encounters the science as core to the experience)
- **B: Wait until session 2** (first session is already a lot; don't add new screens until they've seen the basic close flow)
- **C: Wait until session 5** (matches existing Reframe AI's "session count threshold" pattern for journal context)

### Q4 — Frequency cap or fully every-session?

You picked "once per session" earlier. Confirming:

- **A: Every session, no cap** (~2 cards/day for daily users; over 700 cards/year)
- **B: Every session up to 2/day, then suppress** (caps the daily exposure)
- **C: Every session for first 30 days, then taper to once/day** (frequent introduction, then steady state)

### Q5 — Should the card optionally include a one-line "what this means for you"?

I argued against prescription in the card body. But there's a middle path: a single optional last line that connects the science back to the user's specific session without telling them what to do.

Example: *"Stanford researchers studied this exact pattern... five minutes a day reduced anxiety more than mindfulness meditation. **Today you did three minutes.**"*

The bold last line is observation, not prescription. It tells the user where they are relative to the science, lets them draw their own inference.

- **A: Yes — include this last line when session-context allows it** (richer personalization)
- **B: No — keep the card pure science, no observation about the user** (cleaner, less risk of feeling tracked)

### Q6 — Citation format

What does the citation line look like?

- **A: Author year · Journal** (e.g., *"Balban et al. 2023 · Cell Reports Medicine"*)
- **B: Author year only** (e.g., *"Balban et al. 2023"*)
- **C: Author year, with journal name written out fully** (e.g., *"Balban, Yilmaz, Lieberman, Spiegel & Huberman, 2023, in Cell Reports Medicine"*)

---

## What this is NOT

- Not a notification system (does not push outside session flow)
- Not a content library the user can browse (transient cards, generated and discarded)
- Not "Did You Know" trivia (every card is grounded in the science of what the user actually practiced)
- Not a marketing surface (no "Stillform uses cutting-edge research" voice)
- Not a replacement for the Science Sheet (Science Sheet is the corpus + canonical reasoning; cards are the user-facing 15-second moments)
- Not the Cognitive Function Measurement moonshot (separate spec; CFM is in-app exercises measuring trainable cognitive functions; this is plain-language science cards surfacing existing research)

---

## Future expansion (not in v1)

- Card collection / "Studies you've encountered" surface (lets user revisit prior cards) — would require storing card text, not just topic
- User-uploadable studies (community-contributed corpus) — cost & quality control implications
- Cards in morning anchor as well as post-session (different mode, different topic logic)
- Generative deep-dive (user taps card, gets longer plain-language explanation)
- Citation links to source studies (would require URL field in corpus + privacy/cost analysis on outbound clicks)

---

*ARA Embers LLC · Plain-Language Neuroscience Surface Spec · May 1, 2026*
