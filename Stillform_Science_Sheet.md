# STILLFORM — Science Study Sheet
### If someone asks, here's the research behind every feature.

---


---

## Architecture

Stillform is a metacognition tool. Helping people understand their own processes is the mechanism. Composure is the outcome. Every feature serves one of four structural pillars.

**Metacognition (mechanism).** How the user notices what is happening in themselves. Wells (2009) MCT detached mindfulness; Flavell (1979) on metacognition; Brewer et al. (2011) on Default Mode Network suppression during single-pointed attention. Features: Self Mode (explicit MCT 5-step), Reframe (metacognition about interpretive frame), Pattern Recognition / Insight Card (metacognition about patterns), What Shifted (metacognition about state change), Skip tracking (metacognition about avoidance), bio-filter (metacognition about hardware state), calibration (metacognition about regulation tendency).

**Emotional awareness (input).** Mehling et al. (2012) on interoceptive awareness; Critchley & Garfinkel (2017) on interoception and emotion; Lieberman et al. (2007), Nook et al. (2021) on affect labeling; Vine, Bernstein & Nolen-Hoeksema (2019) on free-generated labels; Barrett et al. (2001) on emotional granularity; Seth (2013), Barrett & Simmons (2015) on interoceptive predictive coding. Features: feel chips (post-only after Apr 28 fix), What Shifted free text, bio-filter, granularity tracking.

**Microbiases (outward gaze).** Genzer, Rubin, Sened, Rafaeli, Ochsner, Cohen, & Perry (2025, *Nature Communications*); Ross (1977) on fundamental attribution error; Hatfield, Cacioppo & Rapson (1993) on emotional contagion. Features: AI microbias awareness, intersection-flagging when bio-filter shows depletion plus negative read of others.

**Neuroplasticity (glue).** What makes the practice compound across sessions instead of resetting. Lieberman 2007 and replications — repeated affect labeling reduces amygdala reactivity to same stimulus over time. Lehrer et al. (2020, *Applied Psychophysiology and Biofeedback*) — repeated HRV biofeedback practice produces autonomic flexibility gains. Brewer et al. (2011, *PNAS*) — experienced meditators show reduced DMN activation at rest (grounds trait-level change, not just state-level). Schultz (1998) on dopamine and reward prediction error + Wood & Rünger (2016) on habit formation — streak tracking and pattern recognition wire practice in via positive prediction error (grounds streaks as actual learning, not gamification). Meichenbaum (1985) stress inoculation — practice when calm so it is available under pressure. Ecker, Ticic & Hulley (2012); Schiller et al. (2010, *Nature*); Lane et al. (2015) — memory reconsolidation: memories recalled in activated state and paired with new safety information update at the memory level. Features: streak tracking, daily practice loop, repeated Reframe sessions on recurring triggers, AI session-count graduation.

Stillform does not market neuroplasticity. It uses the science to design the practice so that practice actually compounds.

### Three neuroscience mechanisms grounding existing features (added Apr 28)

**Memory reconsolidation** grounds repeated Reframe on recurring triggers. The user is not just rehearsing a different response — the memory of the trigger itself is updating because it is being recalled in an activated state and paired with a new interpretive frame. Ecker, Ticic & Hulley (2012); Schiller et al. (2010); Lane et al. (2015).

**Predictive processing / interoceptive inference** grounds the bio-filter. Naming "depleted" or "in pain" updates the brain's internal prediction about whether the next sensation should be read as danger or as tired. Seth (2013); Barrett & Simmons (2015).

**Salience network reset** grounds the body-first pathway. Single-pointed attention practices (breath focus, body focus) reset what the salience network treats as urgent. Menon (2011). This is *why* the calm path works for spirals — not just calming down, but redirecting attentional priority.

## Engagement Principles (Behavioral Science Foundation)

The Pillars above are the neuroscience that makes the practice work. The Principles below are the behavioral science that makes the practice land in the user's life. Two parallel research traditions, both rigorous, both citable. Stillform is grounded in both because being scientifically correct is not the same as being engaging — and a tool the user does not return to does not produce the neuroplasticity the science predicts.

This section captures the empirical research on human-software interaction that grounds Stillform's engagement craft. None of these citations are neuroscience. All of them are peer-reviewed behavioral, cognitive, and design research literature.

### Principle 1: Behavior happens at the convergence of motivation, ability, and trigger

**Fogg (2009)** — "A Behavior Model for Persuasive Design" (Persuasive '09). Behavior B occurs when Motivation, Ability, and a Trigger converge at the same moment. The single most-cited framework in app behavior design. Stanford Persuasive Technology Lab.

**Stillform application:** Morning and EOD anchors are the triggers. The simplicity of the home CTA is ability (one tap to enter the practice). Motivation is the felt need to regulate that draws the user to the app. When all three converge, the session happens. When any one is weak, the session does not happen even if the other two are strong. The Fogg model is the diagnostic frame Stillform uses to understand why a user did or did not return on a given day.

### Principle 2: Habits form through context-cue pairing, not through repetition alone

**Wood & Rünger (2016)** — "Psychology of Habit" *Annual Review of Psychology* 67:289-314. Habits form when the same action is performed in the same context until the context itself becomes the trigger. Repetition without context pairing produces conscious behavior, not habits.

**Stillform application:** The morning anchor leverages contextual pairing — same time of day, same physical environment (probably bed or kitchen), same internal state (waking). Over weeks the context itself becomes the cue. The EOD anchor does the same in reverse. This is why Stillform's daily practice loop is anchored to natural transitions in the user's day rather than asking the user to remember to practice at arbitrary times. The streak counter is not gamification — it is reinforcement of the context-cue pairing the research predicts.

### Principle 3: Autonomy, competence, and relatedness drive sustained engagement

**Deci & Ryan (2000)** — Self-Determination Theory. *Psychological Inquiry* 11(4):227-268. And subsequent decades of research. Three basic psychological needs predict whether engagement persists: autonomy (the user makes meaningful choices), competence (the user feels they are getting better), relatedness (the user feels seen and understood).

**Stillform application:** Autonomy is built into every override pathway — the "I don't feel regulated yet" button, the chip selection, the tool override, the skip buttons throughout. Competence is honored through the Cognitive Function Measurement spec (planned) — users see measurable evidence the practice is working at the function level. Relatedness is the AI's calibration to the user's specific signal profile, bias profile, and session history, which makes the user feel met rather than processed. Each Stillform engagement choice is examined against whether it preserves or violates these three needs.

### Principle 4: System 1 states require System 1 interactions

**Kahneman (2011)** — *Thinking, Fast and Slow*. System 1 is fast, intuitive, embodied. System 2 is slow, deliberate, cognitive. Asking for System 2 work when the user is in a System 1 state produces friction; matching the system to the state produces flow.

**Stillform application:** When the user has just completed a regulation session, they are in a System 1 state (post-regulation, embodied, integrated). Asking them for System 2 work at that moment (typing a reflection, choosing among detailed options, performing self-rating cognition) creates friction. The kinesthetic close interaction (planned) lands in System 1 — gesture, felt, automatic — which matches the state the user is in. Conversely, Reframe's metacognitive observation work happens precisely when the user needs to engage System 2 to step back from interpretive frames and see them as frames; that is the right moment for cognitive work.

### Principle 5: Defaults shape behavior more than instructions do

**Thaler & Sunstein (2008)** — *Nudge*. Choice architecture research. **Ariely (2008)** — *Predictably Irrational*. Defaults determine outcomes more reliably than user education. The default option is the option most users select.

**Stillform application:** The system observation + user override pattern (documented in the dedicated section below) is the architecture this principle predicts. Default is the system's read; override is the user's correction. Asking the user to confirm each time would produce decision fatigue and lower engagement. Setting the right default and providing an override pathway respects the research while preserving user authority.

### Principle 6: Variable reward sustains engagement; predictable reward does not

**Eyal (2014)** — *Hooked*. **Skinner's variable reinforcement schedule research** (1957). When the reward for an action is the same every time, engagement decays. When the reward varies in small honest ways, engagement persists.

**Stillform application:** Variable reward done unethically is what Instagram and slot machines exploit. Variable reward done ethically is what makes Duolingo's varying praise, Strava's surprise segment placements, and Letterboxd's diary-as-record feel alive. Stillform's variable rewards are honest: each Reframe session produces a different conversation because the AI is responsive to what the user actually said; each Body Scan reveals different tension patterns because the body is different each day; each post-session What Shifted captures a different shift because no two sessions land identically. The session structure is consistent (predictable enough to feel safe); the contents within each session are variable (alive enough to feel discovered).

### Principle 7: The intention-behavior gap is closed by implementation specificity

**Gollwitzer (1999)** — implementation intentions, *American Psychologist* 54(7):493-503. **Sheeran & Webb (2016)** — "The Intention-Behavior Gap" *Social and Personality Psychology Compass* 10(9):503-518. People who form specific if-then plans ("if I am at X location at Y time, I will do Z") are 2-3x more likely to execute on intentions than people who form general intentions.

**Stillform application:** The Next Move screen is implementation-intention formation directly grounded in this research. The Send-a-message expansion under Next Move is intention-execution specificity per Hallam et al. 2015 fMRI study. The chip selection at Next Move is the if-then plan formation; the optional drafting is execution rehearsal. This is why Next Move is a discrete decision moment rather than a gesture — the cognitive work of forming a specific implementation intention is what the research says actually closes the gap.

### Principle 8: Ultradian rhythm shapes available cognitive bandwidth across the day

**Kleitman (1963)**, **Rossi (1991)** — Ultradian rhythm research. The body cycles through 90-120 minute periods of higher and lower cognitive capacity throughout the day. The same person at 9am and 3pm has measurably different available bandwidth.

**Stillform application:** The bio-filter is partly a real-time read on this. A user opening Stillform during a low-bandwidth ultradian trough may have the same external situation as a user opening Stillform at peak, but their available cognitive resources are different. The system's responsiveness to bio-filter state is grounded in this research as well as the predictive processing science. Future Stillform features that adapt to time-of-day patterns can cite this research base.

### Principle 9: Affordance perception determines whether interaction happens

**Norman (1988, 2013)** — *The Design of Everyday Things*. Affordance research. **Tognazzini, Cooper, Krug** — foundational interaction design literature. Whether a user perceives an element as actionable determines whether they act on it. Buttons must look tappable; sliders must look draggable; hold-to-confirm must look anchored.

**Stillform application:** Engagement craft choices in the visual language — the prestige refresh, the hairline borders, the slow weighted motion, the metallic accent — all serve affordance perception. The kinesthetic close interaction (planned) succeeds or fails on whether the user perceives the gesture as available. Norman's research is the foundation under every interaction-design choice in Stillform.

### Principle 10: Attention-respectful design predicts long-term retention

**Pielot et al. (2014, 2017)** — research on notification timing and dismissal. **Mehrotra et al. (2016)** — research on interruption costs. **Tristan Harris / Center for Humane Technology** — Time Well Spent research. Products that respect users' time and attention produce higher long-term retention than products that extract attention through dark patterns.

**Stillform application:** The product principle "the less you need the app, the more it's working" is grounded in this research. Stillform is built to make sessions effective enough that users do not need to spend more time in the app than the practice requires. No infinite scroll, no dark patterns, no engagement-for-engagement's-sake mechanics. The research literature lets Stillform defend these choices as both ethical and empirically correct.

---

**How the Pillars and Principles work together:**

Every feature in Stillform is grounded in at least one Pillar (neuroscience that makes the practice work on the brain) and at least one Principle (behavioral science that makes the practice land in the user's life). When a feature is missing one or the other, that is the gap engagement craft is designed to close.

Example: the morning anchor is grounded in Pillar 4 (neuroplasticity through repeated practice) AND Principle 2 (context-cue habit formation). Both are required for the feature to actually work. If the practice produced neuroplasticity but the user never returned to do it, the neuroscience would be irrelevant. If the user returned habitually but the practice itself did nothing on the brain, the engagement would be unethical extraction. The intersection is what makes Stillform real.

---

## Paced Breathing (Breathe & Ground)

**What it does:** Three patterns. Quick Reset (4-4-6, ~60s), Deep Regulate (4-4-8-2, ~3min), Cyclic Sighing (4-1-8, ~5min). All emphasize extended exhale.

**The science:** Extended exhale activates the vagus nerve, which triggers the parasympathetic nervous system — your body's "brake pedal." This measurably lowers heart rate and blood pressure within minutes; sustained practice reduces cortisol response over weeks.

**Cyclic Sighing specifically:** The most-studied breath protocol for downregulation. Two consecutive nasal inhales (deep, then top-off) followed by a long oral exhale. 1:2 inhale-to-exhale ratio. Stanford RCT (n=111) at Spiegel/Huberman/Balban lab compared cyclic sighing to box breathing, cyclic hyperventilation, and mindfulness meditation across one month of daily 5-min practice. Cyclic sighing produced the greatest mood improvement and respiratory rate reduction (p<0.05 vs. mindfulness). Stillform's implementation is the published protocol exactly: Inhale 1 (deep, nasal) 4s + Inhale 2 (top-off, nasal) 1s + Exhale (slow, oral) 8s.

**Who says so:**
- Balban et al. (2023) — *Cell Reports Medicine* 4(1):100895 — "Brief structured respiration practices enhance mood and reduce physiological arousal." n=111 RCT, NCT05304000.
- Gerritsen & Band (2018) — "Breath of Life: The Respiratory Vagal Stimulation Model" — *Frontiers in Human Neuroscience*
- Zaccaro et al. (2018) — slow breathing techniques improve autonomic function, emotional control, and psychological well-being — *Frontiers in Human Neuroscience*
- Ma et al. (2017) — diaphragmatic breathing reduces negative affect and improves sustained attention; significant time effect on cortisol observed across the breathing intervention period (group×time interaction did not reach significance) — *Frontiers in Psychology*

**If they push back:** "This is respiratory pacing based on autonomic nervous system research. The cyclic sighing pattern specifically outperformed mindfulness meditation in a 2023 Stanford RCT."

---

## The Feel-Chip System (9 Russell Circumplex States)

**What it is:** Nine feel chips representing the user's emotional state. Excited / Focused / Settled / Anxious / Angry / Stuck / Mixed / Flat / Distant. The user taps the chip that names their state at session entry, and again at session close (What Shifted screen).

**The science:** The 9 chips are not arbitrary — they're grounded in James Russell's 1980 dimensional model of affect, the dominant framework in affective neuroscience for organizing emotional states by valence (positive/negative) and arousal (high/low). Russell's model maps emotions onto a circumplex with four quadrants: high-arousal positive (HAP), low-arousal positive (LAP), high-arousal negative (HAN), and low-arousal negative (LAN). Stillform's chips cover all four quadrants plus three additional categories: a cognitive state (Stuck — unclear thinking, not affective activation), an undifferentiated state (Mixed — multiple states active simultaneously), and a hypoarousal state (Distant — disconnected from the body, below window of tolerance).

The Russell circumplex gives the chip system data integrity: every chip selection is mappable to a defined coordinate in affective space, which means the data can be analyzed across users without losing meaning, and Category A (regulated shift) is detectable when a user moves from a negative quadrant to a positive quadrant within a session.

**Settled (added Apr 30) closes a coverage gap.** Before Settled, Stillform had no LAP chip — no way for a user to say "I feel calm" without inaccurately picking Focused (which is HAP) or Flat (which is LAN). Settled is the chip a regulated user reaches for. Without it, the data feed couldn't detect when users actually arrived at the regulated state Stillform is trying to help them reach.

**Distant is hypoarousal, not just "low energy" or "withdrawn."** Distant maps to the polyvagal freeze/shutdown response (Porges 2011). When Distant is selected, Stillform routes the user to Body Scan first (not Reframe), because verbal reframing has limited reach when the prefrontal cortex is offline. Words alone won't reach a user in shutdown; the body has to re-engage first.

**Who says so:**
- Russell (1980) — "A circumplex model of affect" — *Journal of Personality and Social Psychology* 39(6):1161-1178
- Watson (2024) — confirmed circumplex structure in modern affective measurement
- Posner, Russell & Peterson (2005) — neuroscience grounding for the circumplex model
- Porges (2011) — polyvagal theory; freeze/shutdown response (grounds Distant routing to Body Scan)
- Siegel (1999) — window of tolerance (grounds Distant as below-window state)

## The Three-Category Data Feed (Russell Circumplex Classifier)

**What it does:** Every Reframe and Body Scan close runs the user's pre-state and post-state chips through a classifier that returns one of three categories: A (Regulated shift), B (Persistent state), or C (Concerning shift). Categories are computed at write-time and stored. Schema versioned at v1; never recomputed.

**The science:** Russell's circumplex gives the categories defensible structure:
- **Category A (Regulated shift)** — pre-state in HAN or LAN, post-state in HAP or LAP. The session moved the user from negative-valence to positive-valence quadrant. This is what regulation success looks like measurably.
- **Category B (Persistent state)** — pre and post in the same quadrant, OR same chip selected. The user did the work; the state didn't shift this session. Sometimes the work is the holding, not the shifting. Per Hayes (ACT) and Kabat-Zinn — sustained acceptance under unresolved state IS the practice. Not failure.
- **Category C (Concerning shift)** — two paths: (1) per-session: post-state is Distant (hypoarousal as session result is a signal). (2) Pattern-based: ≥5 sustained Flat or ≥5 sustained HAN in 14-day window. Pattern-based catches what single sessions miss — the user whose individual sessions look fine but whose 14-day window shows a concerning trajectory.

The classifier is a pure function: same inputs always produce same output. Easy to test, easy to audit. Per-user encrypted on-device; never sees a server. Aggregate-anonymous Plausible event fires with 4 props (category, subcategory, tool, mode) — zero user identifiers, zero chip values, zero free text.

**Why this matters:** Stillform doesn't tell the user how they're doing. The user tells Stillform via the chip they picked. The classifier reads what the user said (twice — entry and close) and surfaces the pattern over time. The user owns the data; Stillform reflects it back.

**Who says so:**
- Russell (1980) — circumplex grounding
- Hayes, Strosahl & Wilson (2011) — ACT, sustained acceptance as practice (Category B legitimacy)
- Kabat-Zinn (1990) — mindfulness-based stress reduction; the practice is the holding
- Porges (2011) — Distant as hypoarousal signal (Category C grounding)

---

## Body Scan (Acupressure)

**What it does:** 6 pressure points with timed holds, auto-advancing

**The science:** Acupressure works through focused interoceptive attention — directing awareness to specific points on the body interrupts rumination by redirecting cognitive resources to physical sensation. The pressure itself adds parasympathetic activation through tactile vagal stimulation.

**Who says so:**
- Au et al. (2015) — self-administered acupressure reduces anxiety — *Acupuncture in Medicine*
- Mehling et al. (2012) — Multidimensional Assessment of Interoceptive Awareness (MAIA): development and validation of the 32-item self-report scale that subsequent research has used to link interoceptive awareness to emotion regulation outcomes — *PLOS ONE*
- Critchley & Garfinkel (2017) — interoception and emotional awareness — *Current Opinion in Psychology*

**If they push back:** "Body Scan isn't alternative medicine. It's structured interoceptive attention — the same principle behind MBSR body scans, just faster and with pressure points."

---

## Reframe (AI Metacognitive Observation)

**What it does:** AI helps users observe their own thinking patterns, name what is happening, and choose a response — without challenging the content of their thoughts.

**The science:** The mechanism is metacognitive observation (Wells 2009): seeing the thought as a thought rather than as the truth. The neural substrate that supports the shift is well-studied under the older "cognitive reappraisal" research tradition — when a user moves from *fused with* a thought to *observing* it, amygdala activation reduces and prefrontal cortex engagement increases. Stillform delivers this conversationally because conversational scaffolding lowers friction at the moment of distress, when self-directed observation is hardest to initiate. Stillform does not ask users to challenge whether their thoughts are rational; it surfaces what their thinking is doing so they can step back from it. That is metacognitive therapy, not cognitive-behavioral therapy.

**Who says so:**
- Ochsner & Gross (2005) — "The Cognitive Control of Emotion" — *Trends in Cognitive Sciences*
- Buhle et al. (2014) — reappraisal consistently reduces negative emotion in neuroimaging studies — *Cerebral Cortex*
- Denny et al. (2015) — reappraisal engages lateral prefrontal and medial prefrontal cortex — *Neuroscience & Biobehavioral Reviews*

**If they push back:** "This isn't a chatbot. It's structured metacognitive observation — the user sees their own thinking pattern, names what is happening, and chooses a response. The AI organizes the user's inputs and reflects them back; the user does the work."

---

## Two-Pathway System (Body-First vs Thought-First)

**What it does:** Users are assessed for whether they regulate better through physical intervention first or cognitive intervention first, and the app adapts

**The science:** People differ in whether bottom-up (body → brain) or top-down (brain → body) regulation is more effective at any given moment. Routing by current state — not fixed type — improves the chance the right intervention lands first. Stillform's calibration identifies a default tendency; the bio-filter and feel-state signals modulate that tendency in real time.

**Who says so:**
- Price & Hooven (2018) — interoceptive awareness mediates the relationship between emotion regulation and emotional eating — *Appetite*
- Kanbara & Fukunaga (2016) — links between interoception and emotion regulation strategies — *BioPsychoSocial Medicine*
- Webb et al. (2012) — different regulation strategies have different effect sizes depending on the person — *Psychological Bulletin*

**If they push back:** "We're not guessing. The 5-scenario assessment identifies your regulation type. The app adapts to you, not the other way around."

---

## Bio-Filter (Physical State Check)

**What it does:** Before the AI responds, the user flags their physical state (pain, under-rested, hormonal shift, etc.) and the AI filters its interpretation through that

**The science:** Physical states like sleep deprivation, chronic pain, and hormonal changes directly alter emotional perception. A person running on 4 hours of sleep perceives neutral faces as threatening. Misattribution of arousal — reading a biological signal as an emotional one — is well-documented.

**Who says so:**
- Yoo et al. (2007) — sleep deprivation amplifies amygdala reactivity (60% greater amygdala activation in response to negative emotional stimuli) — *Current Biology*
- Schachter & Singer (1962) — two-factor theory of emotion / misattribution of arousal — *Psychological Review*
- Eccleston & Crombez (1999) — pain demands attentional resources and disrupts cognitive function — *Psychological Bulletin*

**If they push back:** "'I feel overwhelmed' might actually be 'my system is physically depleted.' The bio-filter prevents misidentifying a hardware problem as a software problem."

---

## Ambient Pulse (Home Screen Glow)

**What it does:** A slow, subtle ambient glow on the home screen at roughly the rhythm of a calm resting heart rate.

**The design intent:** A quiet, non-demanding visual cue that signals "this is a place to slow down." We do not claim the visual itself entrains heart rate or autonomic state. The literature on cross-modal visual entrainment of HRV at 1Hz is unsupportive — most rhythmic-entrainment evidence is for auditory stimuli with motor responses, not passive visual rhythm.

**Why we kept it anyway:** Ambient design that signals slowness sets the tone of the screen. That tone — quiet, unhurried, unrushed — is part of the experience. The pulse stays as design language. We don't overclaim a physiological mechanism that the literature doesn't support.

---

## Metacognitive Therapy (MCT) — The Primary Framework

**What it does:** Every feature in Stillform trains one shift: from experiencing a state to observing a state. This is the clinical definition of metacognition — thinking about your own thinking and emotional processes rather than being fused with them.

**Why MCT, not just CBT:**
CBT targets the *content* of thoughts — "is this thought rational?" MCT targets the *relationship* to thoughts — "I am having this thought" vs "I am this thought." Stillform does the latter. The app never asks users to challenge whether their thoughts are logical. It asks them to observe the state, name it, and choose a response. That is MCT.

**The core MCT concepts Stillform implements:**

**Detached Mindfulness (DM)** — observing thoughts and feelings without engaging, suppressing, or arguing with them. Stillform's Observe and Choose tool is detached mindfulness in structured practice: Notice → Name → Recognize → Perspective → Choose.

**CAS Interruption (Cognitive Attentional Syndrome)** — breaking the worry/rumination/threat-monitoring loop. Breathing routes, somatic interrupt, and the QB pill all serve as CAS interruption — they break the loop before it compounds.

**Attention Training** — flexible attentional control rather than fixated threat monitoring. Breathing redirects attention to the body. Body scan redirects to physical sensation. Both train the attentional flexibility MCT prioritizes.

**Metacognitive Beliefs** — MCT addresses unhelpful beliefs about mental processes ("worrying keeps me safe," "I can't control my thoughts"). Stillform's AI is designed to surface these patterns without labeling them — "I've noticed something" not "you have this disorder."

**Who says so:**
- Wells (2009) — *Metacognitive Therapy for Anxiety and Depression* — the foundational clinical text
- Wells & Matthews (1994) — Attention and Emotion: A Clinical Perspective — original CAS model
- Wells (2000) — *Emotional Disorders and Metacognition* — detached mindfulness framework
- Normann & Morina (2018) — meta-analysis of MCT efficacy across anxiety and depression — *Frontiers in Psychology* (effect sizes exceeding CBT in several conditions)
- Fisher & Wells (2008) — metacognitive therapy vs CBT for OCD — MCT produced larger effect sizes

**If they push back:** "Stillform isn't CBT. It doesn't ask you to challenge your thoughts. It trains you to observe them — which is the evidence base for Metacognitive Therapy. The shift from 'I am anxious' to 'I'm noticing anxiety' is the entire product. Wells called it detached mindfulness. We built a daily practice around it."

---

## Pattern Recognition (AI Learning)

**What it does:** AI tracks session notes, recognizes recurring patterns, and surfaces observations over time

**The science:** Metacognition — thinking about your own thinking — is the strongest predictor of emotional regulation success. Seeing your patterns externalized (in data rather than in your head) creates psychological distance, which enables better decision-making.

**Who says so:**
- Flavell (1979) — metacognition and cognitive monitoring — *American Psychologist*
- Kross & Ayduk (2011) — psychological distancing reduces emotional reactivity — *Journal of Personality and Social Psychology*
- Gross (2015) — the extended process model of emotion regulation — *Biological Psychology*

**If they push back:** "The app doesn't tell you what to feel. It shows you what you've been feeling, when, and what was happening around it. That awareness IS the regulation."

---

## Somatic Interrupt

**What it does:** Detects rapid typing in Reframe and injects a body-awareness nudge ("Drop your shoulders")

**The science:** Physical tension during emotional processing amplifies the emotional response. A brief somatic cue — redirecting attention to the body — interrupts the escalation loop without interrupting the thought process.

**Who says so:**
- Bernstein et al. (2015) — brief body-focused interventions reduce emotional reactivity — *Behaviour Research and Therapy*
- Farb et al. (2015) — interoceptive awareness training changes how people process emotions — *Social Cognitive and Affective Neuroscience*

**If they push back:** "Your shoulders were at your ears and you didn't notice. That's the point."

---


## Ghost Echo (Past Resilience)

**What it does:** Faint text on Pulse screens showing a past successful session — "Apr 3 — you shifted +2.4 in 2m 30s."

**The science:** Self-efficacy — the belief that you can handle a situation — is the strongest predictor of whether you actually will. Showing evidence of past success at the moment of current difficulty activates mastery experience, the most powerful source of self-efficacy.

**Who says so:**
- Bandura (1977) — "Self-efficacy: Toward a unifying theory of behavioral change" — *Psychological Review*
- Bandura (1997) — "Self-Efficacy: The Exercise of Control" — foundational text on mastery experiences

**If they push back:** "It's not a motivational quote. It's your own data showing you've done this before. That's the difference between encouragement and evidence."

---

## End of Day Check-In (Reflective Close)

**What it does:** After 6 PM, three taps: energy vs morning, composure held, one word for the day. AI uses it as context next morning.

**The science:** Reflective practice — structured end-of-day review — improves self-regulation and metacognitive awareness. The morning-evening bookend creates a feedback loop that accelerates pattern recognition.

**Who says so:**
- Schön (1983) — "The Reflective Practitioner" — reflection-in-action and reflection-on-action
- Mann et al. (2009) — reflective practice in health professions improves self-awareness — *Advances in Health Sciences Education*
- Boud et al. (1985) — "Reflection: Turning Experience into Learning"

**If they push back:** "You set your tone in the morning. You close the loop at night. The AI connects the dots between the two. That's how patterns become visible."

---


## System Observation + User Override (Architectural Conditioning Pattern)

**What it does:** Stillform names what it observes — "Composure restored," "Signal cleared," "STATE SHIFT +2 · FUNCTIONAL" — and gives the user explicit override pathways when the felt state doesn't match the system's read. The "I don't feel regulated yet" button is the most direct example, but the pattern is structural: chip selection, tool routing, and post-rating all carry this design.

**The science:** This is the architectural mechanism by which Stillform builds interoceptive accuracy without overriding user authority. Three findings ground it.

First, **affect granularity is trainable** through repeated paired association of precise labels with real internal states (Barrett 2001 and successors). Generic praise — "great job, you got this" — does not condition because there is no specific referent for the body to attach to. Specific naming — "composure restored," paired with the actual physiological state of post-regulation — gives the body a precise label for a precise state. Over many sessions, the user's internal sense of "what composure feels like" sharpens and aligns with the named referent.

Second, **interoceptive accuracy requires the user remaining the higher authority** on their own state. If the system declares the user regulated and the user feels otherwise, gaslighting risk is real (Mehling et al. 2012; Garfinkel et al. 2015 on interoceptive accuracy vs. sensibility). The override pathway is what makes the conditioning loop honest. Each tap of "I don't feel regulated yet" is data — for this user, this kind of session, this kind of state shift didn't produce the felt experience yet — and is evidence to the user that their own interoception is treated as the ground truth.

Third, the **observation + override pattern parallels supervised learning in the user's own perceptual system.** The system makes a prediction ("composure restored"); the user either accepts the label as matching their experience or supplies a correction. Over time, the predictions become more accurate for that specific user, AND the user's labels for their own internal states become more granular — both directions of improvement are happening simultaneously. This is the pattern that distinguishes Stillform's closing language from outcome-coded wellness app copy: the words are doing conditioning work, not summarization work.

**Who says so:**
- Barrett et al. (2001) — emotional granularity as trainable through specific labeling — *Cognition and Emotion*
- Lieberman et al. (2007) — affect labeling reduces amygdala activity; precise labels activate prefrontal regulation — *Psychological Science*
- Mehling et al. (2012) — interoceptive awareness as multidimensional construct (MAIA) — *PLOS ONE*
- Garfinkel et al. (2015) — interoceptive accuracy vs. sensibility; the gap between objective state and felt state is real and trainable — *Biological Psychology*
- Critchley & Garfinkel (2017) — interoception and emotional awareness — *Current Opinion in Psychology*

**Why this is load-bearing for Stillform's integrity:** without the override pathway, the closing language would be the system telling the user how they feel, which would be both gaslight-coded and conditioning-incorrect (no correction signal, no learning). With the override pathway, the closing language is the system offering a precise label the user can accept or refuse based on felt experience. Future maintenance: the override pathway is structural, not redundant; do not "clean up" or remove the "I don't feel regulated yet" button or its equivalents in adjacent flows. Do not soften the closing language to remove the precise observation; precise observation paired with override authority is what makes the conditioning work.

**If they push back:** "The closing language isn't the system grading the user — it's the system offering a precise observation the user can override. Together they train interoceptive accuracy faster than either would alone."

---

## Affect Labeling (Pulse Emotion Chips)

**What it does:** Users tap emotion chips (Anger, Anxiety, Dread, etc.) to name what they're feeling

**The science:** The act of putting a name on an emotion — "affect labeling" — directly reduces amygdala activation and increases prefrontal cortex engagement. You don't have to analyze the feeling or reframe it. Just naming it turns down the alarm. fMRI studies show this happens automatically, even without conscious intent to regulate.

**Who says so:**
- Lieberman et al. (2007) — "Putting Feelings Into Words" — affect labeling reduces amygdala activity — *Psychological Science*
- Torre & Lieberman (2018) — "Putting Feelings Into Words: Affect Labeling as Implicit Emotion Regulation" — *Emotion Review*
- Burklund et al. (2014) — affect labeling activates right ventrolateral prefrontal cortex — *Psychological Science*

**If they push back:** "Tapping 'Anxiety' on a screen does more than you think. fMRI shows it literally turns down your brain's alarm center. You don't have to understand the feeling — just naming it changes the neural response."

---

## Emotional Granularity (18 Distinct Emotion Chips)

**What it does:** Offers 12 specific emotions instead of just "good" or "bad" — training users to distinguish between Anger, Dread, Overwhelm, Shame, etc.

**The science:** People who can make fine-grained distinctions between emotions regulate better, cope more effectively, and are less likely to resort to harmful coping strategies. This ability — emotional granularity — is a trainable skill that improves with practice. The Pulse chips are granularity training in disguise.

**Who says so:**
- Barrett et al. (2001) — emotional granularity linked to better emotion regulation strategies — *Cognition & Emotion*
- Kashdan, Barrett & McKnight (2015) — higher granularity protects against binge drinking, aggression, self-harm — *Current Directions in Psychological Science*
- Hoemann, Barrett & Quigley (2021) — emotional granularity increases with repeated self-assessment — *Frontiers in Psychology*

**If they push back:** "The difference between 'I feel bad' and 'I feel overwhelmed but not angry' is the difference between spiraling and knowing what to do next. The more precise you get at naming it, the better your brain gets at handling it."

---


## Window of Tolerance (The Entire Product Purpose)

**What it does:** The entire app exists to keep users inside their window of tolerance — the zone where they can think clearly, regulate emotions, and function. Breathing brings hyperaroused users down. Reframe processes looping thoughts. Body Scan releases physical tension. The morning check-in and bio-filter detect when the window is already narrowed by sleep, pain, or depletion.

**The science:** The window of tolerance is the optimal arousal zone where a person can function effectively — emotionally regulated, cognitively flexible, and socially engaged. Above it = hyperarousal (panic, rage, overwhelm). Below it = hypoarousal (numbness, shutdown, disconnection). Trauma, stress, and physical depletion narrow the window. Regulation skills widen it.

**Who says so:**
- Siegel (1999) — "The Developing Mind" — coined the Window of Tolerance model
- Ogden, Minton & Pain (2006) — "Trauma and the Body" — body-based approaches widen the window
- Porges (2011) — Polyvagal Theory — vagal nerve regulation underlies window management

**Stillform application:** Every tool maps to window management. Breathe = calms hyperarousal. Body Scan = releases held tension narrowing the window. Reframe = processes cognitive loops. Bio-filter = detects when physical state has already narrowed the window before you even start. The pre/post rating tracks self-reported movement toward the regulated zone — a useful signal, not a quantified physiological measurement.

**If they push back:** "You know that zone where you can think clearly and handle things? That's the window. Above it you're spiraling. Below it you're shut down. Every tool in Stillform is designed to put you back in that zone — or keep you there."

---

## Implementation Intentions (5-Scenario Assessment)

**What it does:** The assessment determines your regulation type and pre-programs your home screen to show the right tool first. Body-first users see Breathe. Thought-first users see Reframe. You've already decided what to do before the moment hits.

**The science:** "If X happens, I will do Y" planning — implementation intentions — dramatically increases follow-through on regulation strategies. Pre-deciding your response pathway before you need it bypasses the decision paralysis that happens during emotional flooding.

**Who says so:**
- Gollwitzer (1999) — "Implementation Intentions: Strong Effects of Simple Plans" — *American Psychologist*
- Gollwitzer & Sheeran (2006) — meta-analysis showing implementation intentions have medium-to-large effect on goal attainment — *Advances in Experimental Social Psychology*
- Webb & Sheeran (2004) — implementation intentions improve health behavior change — *British Journal of Social Psychology*

**Stillform application:** The 5-scenario assessment IS implementation intention formation. When you identify as body-first, the app pre-loads your pathway: stress → Breathe first → then Reframe. You don't have to decide in the moment. The decision was already made during calibration.

**If they push back:** "The assessment isn't just categorizing you. It's pre-loading your response. When the moment hits and you can't think straight, the app already knows your first move."

---

## Default Mode Network Interruption (Breathing Exercises)

**What it does:** Paced breathing interrupts the brain's default mode network — the neural circuit responsible for mind-wandering, rumination, and self-referential thought loops.

**The science:** The default mode network (DMN) is active during rest and drives rumination — "why did I say that," "what if this happens," repetitive self-focused thinking. Task-focused activities like paced breathing activate the task-positive network, which suppresses DMN activity. You can't ruminate and count 4-4-8-2 at the same time.

**Who says so:**
- Raichle et al. (2001) — "A default mode of brain function" — discovery of DMN — *PNAS*
- Brewer et al. (2011) — meditation reduces DMN activity — *PNAS*
- Doll et al. (2016) — mindful attention to breath reduces amygdala activation and increases amygdala-prefrontal cortex connectivity — *NeuroImage*

**Stillform application:** The breathing ring, tick marks, and counting demand task-positive attention. The visual focus + counting rhythm + controlled breathing create a triple-lock on DMN suppression. Rumination literally can't run while you're tracking a 4-4-8-2 pattern.

**If they push back:** "Your brain has a 'loop' circuit that replays worries. Focused breathing turns it off — not metaphorically. The network responsible for rumination goes quiet when you're counting breath phases."

---

## Autonomic Flexibility (What the App Trains Over Time)

**What it does:** Repeated regulation practice increases the nervous system's ability to shift between activation (sympathetic) and recovery (parasympathetic) states — the core skill Stillform builds over time.

**The science:** Autonomic flexibility — the ability to fluidly shift between fight/flight and rest/digest — is one of the strongest markers of emotional resilience. Higher heart rate variability (HRV) reflects greater autonomic flexibility. Regulation practice (breathing, reappraisal) trains this flexibility like a muscle.

**Who says so:**
- Thayer & Lane (2000) — HRV as index of regulated emotional responding — *Review of General Psychology*
- Appelhans & Luecken (2006) — HRV reflects emotion regulation capacity — *Review of General Psychology*
- Lehrer & Gevirtz (2014) — HRV biofeedback training improves autonomic regulation — *Frontiers in Psychology*

**Stillform application:** The published research on regulation practice and autonomic flexibility (Thayer & Lane 2000; Lehrer et al. 2020) suggests repeated practice is associated with HRV gains over time. Stillform does not yet measure HRV directly. The pre/post rating delta tracks self-reported state shift session by session; the Composure Telemetry heat map tracks practice frequency. The training-flexibility claim from the literature is the mechanism we draw from; we will measure it in our own users when biosensor integration ships.

**If they push back:** "Repeated regulation practice is associated with autonomic flexibility gains in the literature. Stillform tracks self-reported state shift on every session; once watch integration is in, we'll track HRV directly."

---

## Stress Inoculation (Daily Practice Model)

**What it does:** Morning check-in + tools + end of day creates a daily micro-dose of regulation practice, even on good days. This builds capacity before it's needed.

**The science:** Stress inoculation — controlled, manageable exposure to stress and regulation — builds resilience for future high-stress events. Practicing when calm trains the skills that deploy automatically under pressure. Military, first responders, and surgeons use this principle.

**Who says so:**
- Meichenbaum (1985) — Stress Inoculation Training (SIT) — foundational text
- Saunders et al. (1996) — SIT effective across anxiety disorders, PTSD, performance anxiety — *Clinical Psychology Review*
- Robson & Manacapilli (2014) — stress inoculation in military performance — RAND Corporation

**Stillform application:** The morning check-in IS the inoculation. Setting your tone when nothing's wrong builds the muscle for when something is. "Composure when winning" isn't just a philosophy — it's stress inoculation theory applied. You practice composure daily so it's available when the stakes rise.

**If they push back:** "Special forces train in controlled environments so they perform under fire. Your morning check-in is the same principle. Practice the skill when it's easy so it's there when it's not."

---


## Interpersonal Microbiases (EQ / Reframe AI)

**What it does:** The AI watches for 5 subtle biases that distort how users read other people and social situations: intensity amplification, state projection, attribution error, emotional contagion blindness, and impact gap.

**The science:** People systematically overestimate the intensity of others' negative emotions, and this bias is larger for strangers than for romantic partners. The bias is, on average, adaptive — it predicts greater empathy with strangers and contributes to relationship satisfaction with partners. The Stillform-relevant question isn't whether the bias exists. It's when it stops being adaptive. When a perceiver is depleted, in pain, or sleep-deprived, the over-reading can compound with hardware load and produce reactive decisions in relationships and at work. Combined with fundamental attribution error (judging character instead of situation) and emotional contagion (absorbing others' states unconsciously), these intersections — not the perceptual bias itself — are what Stillform's AI flags.

**Who says so:**
- Genzer, Rubin, Sened, Rafaeli, Ochsner, Cohen, & Perry (2025) — "Directional bias in interpersonal emotion perception" — *Nature Communications*
- Ross (1977) — fundamental attribution error — foundational social psychology
- Hatfield, Cacioppo & Rapson (1993) — emotional contagion — *Cambridge University Press*
- Goleman (1995) — emotional intelligence as interpersonal awareness — *Bantam Books*

**Stillform application:** When a user describes an interpersonal situation, the AI checks for these 5 microbiases. If their bio-filter is active (depleted, pain, under-rested) AND they're reading someone else negatively, the AI connects the dots. "You're running low today — is this really about them, or is your hardware amplifying the signal?" One microbias per response, named cleanly, then move on. Composure isn't just about managing yourself — it's about reading the room accurately.

**If they push back:** "When you're depleted, in pain, or under-rested, your read of someone else can sharpen in ways that aren't always serving you. The AI doesn't tell you the read is wrong. It surfaces the intersection — physical depletion meeting strong negative read — so you can decide what to do with it."

---


## Fractal Visual Grounding (Breathing Visuals)

Natural fractal patterns — branching trees, rivers, coastlines — are associated with measurable physiological relaxation effects in laboratory exposure. The visual cortex responds to mid-range fractal complexity (D ≈ 1.3-1.5) by shifting into alpha wave activity associated with relaxed alertness. The lab-condition effect on skin conductance does not directly translate to a measured outcome on a mobile breathing screen, but the visual is grounded in the same complexity range and serves the same restorative purpose.

- Taylor et al. (University of Oregon) — exposure to mid-complexity fractals reduces stress by up to 60% as measured by skin conductance — *multiple publications, Nonlinear Dynamics, Psychology, and Life Sciences*
- Hagerhall et al. (2015) — natural fractal patterns induce alpha wave EEG responses associated with relaxed wakefulness — *Nonlinear Dynamics, Psychology, and Life Sciences*
- Joye & Van den Berg (2011) — restorative effects of visual exposure to natural environments are partly driven by fractal geometry — *Environment and Behavior*

**In Stillform:** Organic amber branching visuals behind the breathing ring grow on inhale and dissolve on exhale. Users see natural fractal geometry synced to their breath cycle. Optional via Settings toggle. User-tested: reported effective for grounding during medical imaging (CT scan).

---

## Neuroscience Execution Audit (April 10, 2026)

**Question asked:** "Is what we executed the best way to help users?"

**Short answer:** It's one of the strongest practical implementations for a mobile composure app, but "best" still depends on real-world outcomes (retention, symptom shift, decision quality, safety), not architecture alone.

### What is strongly aligned with current evidence
- **Paced breathing for rapid downshift:** recent meta-analyses continue to show short-term HRV/autonomic benefits and stress reduction.
- **Affect labeling + reappraisal sequence:** neural evidence supports PFC engagement and reduced amygdala reactivity when emotions are named and reframed.
- **Interoception-first design (bio-filter, body scan, somatic interrupt):** current reviews support interoceptive training as a mediator of emotion regulation.
- **If-then pathwaying (assessment -> default tool):** implementation-intention literature remains strong for converting intention into action under stress.
- **Fallback continuity during API outages:** preserving user agency with a guided offline path aligns with what improves digital intervention adherence.

### Recent cross-check references (2023-2025)
- Shao, Man, & Lee (2024) — slow-paced breathing meta-analysis: short-term cardiovascular/autonomic gains, modest negative-emotion reduction.
- Linardon et al. (2024) — mindfulness app RCT meta-analysis: small but significant anxiety/depression improvements versus inactive controls.
- Frontiers in Digital Health (2023) — mHealth cognitive reappraisal review/meta-analysis: small-to-medium effects in complex mobile interventions.
- Lazzarelli et al. (2024) — interoception + emotion regulation integrative review: both top-down and bottom-up interventions supported.
- npj Digital Medicine (2025) — 92 RCT app meta-analysis: digital mental health apps show moderate efficacy overall; engagement metrics remain inconsistent.

### Where evidence is supportive but not definitive
- **Fractal visual grounding:** promising stress-reduction signal, but additive benefit over breathing alone is not fully established.
- **Highly personalized digital recommendations:** broadly promising for engagement, but effect-size gains over simpler approaches are mixed across reviews.
- **Conversational AI quality effects:** positive signals exist, but outcomes vary by prompt quality, user segment, and intervention dosage.

### Risk controls needed to keep neuroscience integrity high
- Keep claims calibrated: "supports regulation" not "treats conditions."
- Track pre/post delta and fallback usage as first-class outcomes.
- Ensure safety escalation remains deterministic (crisis + liability guards already in place).
- Avoid over-complexity: preserve low-friction flow and one clear next action per interaction.

### Practical verdict
- **Clinical plausibility:** High
- **Mechanistic alignment:** High
- **Evidence of user-level efficacy in this specific app:** Medium (needs live outcome data)
- **Best next scientific step:** instrument and review real outcomes weekly (activation, completion, pre/post shift, retention, fallback rate, and adverse-flow flags).

## The One-Liner

If someone asks "what is Stillform?" in 10 seconds:

**"It regulates your body first, then resets your thinking. Paced breathing, body scan, and AI reframing — all backed by published research. It takes under two minutes."**

---

*ARA Embers LLC · Stillform Science Sheet · April 2026*

---

## ObserveEntryLite — Retired April 29, 2026

The ObserveEntryLite shell was originally built for users whose calibration result was "balanced" — neither thought-first nor body-first. It implemented detached mindfulness (Wells, 2009) as a one-orienting-question gate before routing.

**Why it was retired:** The balanced regulation type was deprecated in full on April 29, 2026. Stillform's flow is designed around a single dominant processing type per user (thought-first or body-first), with bio-filter and feel chips as state-based modifiers within the moment. A balanced calibration introduced an extra branching layer the rest of the architecture was not built to support, and complicated the routing logic without producing better outcomes than defaulting to thought-first with state-aware overrides.

**What replaced it:**
- Calibration assessment ties now default to thought-first (the prior "balanced" outcome).
- The "Help me figure it out" skip button writes thought-first to localStorage instead of balanced.
- Existing users still flagged balanced are force-migrated to thought-first on app load.
- The Hero CTA uses the same routing it always did for thought-first users; the balanced branch (which routed to ObserveEntryLite) is now a defensive fallback that mirrors thought-first behavior.

**What was preserved from the MCT framing:** The off-baseline overrides — when bio-filter flags activated, depleted, pain, sleep, or medicated state, the app biases toward somatic support regardless of processing type. This is the two-regulation-pathway principle (Ochsner & Gross, 2005) and remains intact.

**The detached mindfulness mechanism (Wells, 2009)** still informs the architecture as a whole — particularly Self Mode and What Shifted — but is no longer expressed as a routing gate at the entry point.

---

## What Shifted — Post-Session Affect Labeling (April 2026)

**What it is:** A single-line prompt after Reframe — "In one line — what shifted?" — asking the user to name the change in their internal state before exiting the session.

**Why it works:**

**Affect labeling** (Lieberman et al., 2007) is the mechanism. When a person translates an emotional experience into language, amygdala activation decreases and right ventrolateral prefrontal cortex (RVLPFC) engagement increases. The prefrontal cortex is literally regulating the amygdala through the act of naming.

The one-line constraint is intentional and scientifically stronger than open-ended journaling. It forces the prefrontal cortex to distill — the user must find the precise word or phrase for what changed, which demands higher cognitive engagement than free-form writing and produces more durable regulation. Free-generated labels are also more cognitively engaging than predetermined choices (Vine et al., 2019; Nook et al., 2021), which is why the textarea is the higher-precision version of the chip selection.

This is distinct from journaling (which processes at length) and from venting (which can reinforce activation). It is a single act of precise post-regulation labeling that reinforces the regulated state before the user exits.

**Why it belongs after regulation, not before:**
The original framing for this question came from the affect-labeling-as-implicit-regulation tradition (Lieberman 2007; Torre & Lieberman 2018), which established that post-regulation labeling consolidates the shift. More recent replicated work has refined the picture for the inverse — what happens when labeling occurs *before* regulation. Nook, Satpute & Ochsner (2021) showed that emotion naming impedes both cognitive reappraisal AND mindful acceptance strategies. Participants who named their emotions before regulating reported feeling worse than those who regulated without naming. The proposed mechanism is "crystallization" — emotion naming solidifies the initial appraisal and limits the generation of alternative appraisals, making the state more resistant to modification. This was replicated at the neural level via fNIRS (BMC Psychology, 2024) and behaviorally with N=226 across two studies (Affective Science, 2025).

This refines but does not contradict the design rule: regulate first, label after. The mechanism is cleaner than originally stated — pre-regulation labeling does not "intensify" the state per se, it crystallizes it, which is arguably worse for a metacognition tool whose stated goal is teaching cognitive flexibility. Labeling after regulation is supported. Labeling before regulation, particularly via predetermined chip selection during dysregulation, is contraindicated by current literature.

**References:**
- Lieberman et al. (2007) — "Putting Feelings Into Words" — affect labeling reduces amygdala activity — *Psychological Science*
- Burklund et al. (2014) — affect labeling activates RVLPFC — *Psychological Science*
- Pennebaker (1997) — expressive writing and emotional processing — *Opening Up*
- Torre & Lieberman (2018) — putting feelings into words: affect labeling as implicit emotion regulation — *Emotion Review*
- Nook, Satpute & Ochsner (2021) — "Emotion naming impedes both cognitive reappraisal and mindful acceptance strategies of emotion regulation" — *Affective Science*
- Vine, Bernstein & Nolen-Hoeksema (2019) — labels generated by participants are more effective than predetermined options — *Cognition & Emotion*
- Affective Science (2025, N=226) — replication of Nook 2021 with two studies confirming labeling reduces effectiveness of subsequent reappraisal
- BMC Psychology (2024) — fNIRS replication confirming crystallization effect at the neural level via lateral prefrontal cortex activation patterns

---

## Next Move — Implementation Intention in Action (April 2026)

**What it does:** After Reframe, user picks one concrete action from four options tailored to their session context (interpersonal vs internal). Each action has a real execution path — not just a label, but something completable inside the regulated state.

**The science:** Implementation intention research (Gollwitzer, 1999) shows that forming a specific "if X then Y" plan dramatically increases follow-through compared to general goal-setting. The gap between intention and action is where regulation breaks down. Closing that gap while still regulated is the entire point of Next Move.

The four interpersonal actions map to the full range of regulated responses — act, commit, defer, release. Each is a valid composure outcome. "Let it go" is specifically important: it validates non-action as a regulated choice, which most productivity tools never do.

**Session context detection:** reframe.js flags each session as interpersonal or internal based on content. This is stored as a data point (`sessionContext`) and drives which buttons appear — no extra question asked of the user. Over time this feeds My Patterns with session context distribution data.

**Who says so:**
- Gollwitzer (1999) — "Implementation Intentions: Strong Effects of Simple Plans" — *American Psychologist*
- Gollwitzer & Sheeran (2006) — meta-analysis: implementation intentions have medium-to-large effect on goal attainment — *Advances in Experimental Social Psychology*
- Webb & Sheeran (2004) — implementation intentions improve behavior change follow-through — *British Journal of Social Psychology*

---

## Lock-in Statements — Reflective Practice Personalized (April 2026)

**What it does:** After selecting a Next Move, the user sees 3 lock-in statement options tailored to their chosen action AND their regulation type (thought-first / body-first / balanced). They pick one. Together the pair — lock-in + next move — forms one complete sentence about how they processed and what they decided.

**The science:** Schön's reflective practice framework (1983) distinguishes reflection-in-action (during) from reflection-on-action (after). The lock-in is reflection-on-action — naming the processing move that led to the decision. This consolidates the regulated insight and makes it repeatable.

Personalization by regulation type is critical. A body-first person who chose to send a message processed differently than a thought-first person who made the same choice. The lock-in statement should reflect that difference — "my body settled before I chose my words" vs "I separated facts from story before I acted." Same outcome, different processing pathway, different data point.

**The 20-second pause:** Cannot be skipped. The pause is the feature — it prevents rushed exit from the regulated state and ensures the reflection is genuine, not reflexive.

**Data value:** The lock-in + next move pair is the most information-dense data point in the session. It captures: what they did, how they got there, and which processing pathway they used. Over time this builds a personal composure fingerprint in My Patterns.

**Who says so:**
- Schön (1983) — *The Reflective Practitioner* — reflection-on-action framework
- Mann et al. (2009) — reflective practice improves self-awareness — *Advances in Health Sciences Education*
- Flavell (1979) — metacognitive monitoring — *American Psychologist*

---

## AI Insight Card — Adaptive Observation to Pattern (April 2026)

**What it does:** Surfaces an AI-generated observation on the post-Reframe finish screen. Language adapts by session count — observational early, pattern-based later. Same card, same location, no threshold visible to user.

**Why the adaptive register matters:**
Pattern recognition requires repetition. Claiming a pattern from one session is presumptuous and risks damaging trust at the most fragile point — early usage. The adaptive approach is honest about what the data actually supports at each stage.

- Sessions 1-4: "In this session you named something specific before choosing a response." — observation, not pattern
- Sessions 5+: "You tend to name things specifically before acting." — genuine pattern, earned by repetition

**Science:**
Premature pattern labeling can backfire — it feels presumptuous and can trigger reactance (Brehm, 1966 — psychological reactance theory). Earned pattern recognition, by contrast, produces the psychological distancing effect (Kross & Ayduk, 2011) that makes patterns useful rather than threatening.

**Who says so:**
- Flavell (1979) — metacognitive monitoring requires sufficient data — *American Psychologist*
- Kross & Ayduk (2011) — psychological distancing reduces emotional reactivity — *JPSP*
- Brehm (1966) — reactance theory — premature labeling triggers resistance

---

## Skip Tracking — Avoidance as Signal (April 2026)

**What it does:** Every skip on the post-Reframe screen (What Shifted, Next Move, Lock-in) is recorded as a data point. Not surfaced until session 10+. At that threshold, consistent skip patterns appear in My Patterns with curious, non-shaming language.

**Why skips matter scientifically:**
In behavioral research, avoidance is as diagnostically informative as engagement. What someone consistently doesn't do reveals as much about their processing patterns as what they do. In MCT specifically, avoidance of metacognitive labeling (skipping What Shifted) can indicate fusion with the emotional state — the person isn't observing it, they're still in it.

**The 10-session threshold:**
Single skips are noise. Consistent skips are signal. Surfacing skip patterns before session 10 risks false positives and premature conclusions. After session 10 there is enough data to distinguish pattern from exception.

**Specific signals:**
- Consistent What Shifted skips → possible difficulty with affect labeling, still fused with state post-session
- Consistent Next Move skips → possible gap between insight and action (intention-action gap)
- Consistent Lock-in skips → possible avoidance of reflective processing
- Skip of "Let it go" specifically → choosing not to release is itself a signal worth tracking

**Tone when surfaced:** Curious, never shaming. "You've been skipping the action step — want to explore why?" not "you never follow through."

**Who says so:**
- Hayes et al. (1996) — experiential avoidance as a transdiagnostic process — *Psychological Review*
- Wells (2009) — avoidance maintains metacognitive beliefs — *Metacognitive Therapy*
- Gollwitzer & Sheeran (2006) — intention-action gap — *Advances in Experimental Social Psychology*

---

## Regulation Tendency vs. Fixed Type — April 26, 2026

**The correction:** Calibration identifies a default regulation tendency, not a fixed processing type. This distinction matters scientifically and for product integrity.

**What the research supports:**
- Individuals show genuine biases toward certain regulation strategies — somatic grounding vs. cognitive reappraisal (Gross, 2015)
- These tendencies are probabilistic, context-dependent, and modifiable — not binary or stable across all states
- Regulation effectiveness is state-dependent: cognitive strategies work better at moderate arousal; physiological strategies work better at high arousal (Ochsner & Gross, 2005)
- The same person may need body-first when overwhelmed and thought-first when calm but stuck in rumination
- Interoceptive awareness varies between individuals but is trainable — not a fixed trait (Mehling et al., 2012)
- MCT (Wells) centers on flexibility of relationship to thought, not classification of people into processing types

**How Stillform handles this correctly:**
- Calibration identifies the most likely default entry point — not a permanent identity
- The bio-filter detects when current physical state overrides the default tendency
- Feel state chips and morning check-in feed state-based routing adjustments each session
- The user can recalibrate anytime in Settings
- The UX label ("body-first / thought-first") is preserved for clarity — internally treated as weighted tendency, state-modulated

**The product description framing (corrected):**
"Calibration identifies your default regulation tendency — the entry point most likely to work for you when nothing else is signaling otherwise. On any given day, your current state may call for a different pathway. The system reads that and adjusts."

**References:**
- Gross, J.J. (2015) — Emotion regulation: Current status and future prospects — *Psychological Inquiry*
- Ochsner, K.N. & Gross, J.J. (2005) — The cognitive control of emotion — *Trends in Cognitive Sciences*
- Mehling et al. (2012) — Body Awareness: Construct and Self-Report Measures — *PLOS ONE*
- Wells, A. (2009) — Metacognitive Therapy — flexibility over classification
