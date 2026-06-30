/**
 * scienceLibrary.js — the science behind the practice, for the Library's
 * "The Science" section.
 *
 * SOURCE OF TRUTH: every entry is lifted faithfully from `Stillform_Science_Sheet.md`
 * (Arlin's vetted research sheet). Citations are reproduced as the Sheet has them —
 * NO citation is invented or altered. If a claim or source isn't in the Sheet, it
 * isn't here. The fabrication-check (scripts/check-science-citations.mjs) greps every
 * source against the Sheet and must pass.
 *
 * PURPOSE TEST (June 27, Arlin's call): every entry must be science about the USER's
 * mind — something you do or notice — NOT a description of the app's machinery.
 * Entries that revealed the engine (how routing works, the classifier, skip-logging,
 * the closing-language conditioning loop, the engagement-design playbook, the AI
 * sharpening by session count) were REWORKED into practices: same science, the wiring
 * removed. Two reasons, one cut — the machinery doesn't teach the user anything about
 * themselves, AND it's the blueprint a cloner would want. The session-count adaptation
 * was additionally a violation of the locked invisible-leveling rule and is gone.
 *
 * Full non-redundant set: 32 entries. `oneLiner` + framing are first-pass draft
 * (Arlin's voice to set, OK for testing). Science + sources are faithful to the Sheet.
 */

export const SCIENCE_ENTRIES = [
  // ── the core ──────────────────────────────────────────────
  {
    id: "metacognition",
    title: "Metacognition",
    oneLiner: "Building the concept library your brain uses to read itself.",
    whatItDoes:
      "The practice underneath every tool: naming, analyzing, and observing your own processing with more and more precision over time.",
    theScience:
      "Metacognition — thinking about your own thinking — is a trainable capacity, and one of the strongest predictors of how well people regulate. Underneath it sits concept-building: the brain perceives an internal state by constructing it from the concepts it has, so a richer, more granular concept library means more accurate perception. Each session adds to that library; over time the reading gets faster and finer.",
    sources: [
      "Flavell (1979) — metacognition and cognitive monitoring — American Psychologist",
      "Schraw & Moshman (1995) — metacognitive theories",
      "Barrett (2017) — constructed emotion theory; richer concept library, more granular perception",
    ],
  },
  {
    id: "mct",
    title: "Metacognitive therapy",
    oneLiner: "Observing a thought instead of being it.",
    whatItDoes:
      "The one shift the whole practice trains — from being in a state to observing it. You never have to argue whether a thought is \u201crational\u201d; you observe the state, name it, and choose a response.",
    theScience:
      "CBT works on the content of a thought; Metacognitive Therapy works on your relationship to it — \u201cI\u2019m having this thought\u201d rather than \u201cI am this thought.\u201d Its core moves are detached mindfulness (watching thoughts without arguing with them), breaking the worry-and-rumination loop, and training flexible attention. Meta-analyses put MCT\u2019s effect sizes at or above CBT across several conditions.",
    sources: [
      "Wells (2009) — Metacognitive Therapy for Anxiety and Depression",
      "Wells & Matthews (1994) — the original CAS model",
      "Normann & Morina (2018) — meta-analysis of MCT efficacy — Frontiers in Psychology",
      "Fisher & Wells (2008) — MCT vs. CBT for OCD",
    ],
  },

  // ── how you read yourself (the inputs) ────────────────────
  {
    id: "feel-chips",
    title: "Naming the state",
    oneLiner: "Naming a state more precisely changes how you handle it.",
    whatItDoes:
      "Naming what you feel across the full map — high and low energy, easier and harder — instead of just \u201cgood\u201d or \u201cbad.\u201d",
    theScience:
      "Emotional states organize along two axes — how pleasant, how activated — in Russell\u2019s dimensional model of affect. The finer the distinctions you can make between emotions — emotional granularity — the better you regulate and the less you reach for harmful coping. Granularity is a trainable skill that improves with exactly this kind of repeated naming.",
    sources: [
      "Russell (1980) — a circumplex model of affect",
      "Barrett et al. (2001) — granularity and emotion regulation — Cognition & Emotion",
      "Kashdan, Barrett & McKnight (2015) — Current Directions in Psychological Science",
      "Hoemann, Barrett & Quigley (2021) — granularity increases with repeated self-assessment — Frontiers in Psychology",
    ],
  },
  {
    id: "affect-labeling",
    title: "Affect labeling",
    oneLiner: "Putting a word on a feeling turns down the alarm.",
    whatItDoes:
      "Naming what you feel — just naming it — without having to analyze or argue with it.",
    theScience:
      "Putting a feeling into words directly reduces amygdala activation and increases prefrontal engagement. fMRI studies show this happens automatically, even without any conscious intent to regulate. You don\u2019t have to understand the feeling for the naming to change the neural response.",
    sources: [
      "Lieberman et al. (2007) — \u201cPutting Feelings Into Words\u201d — Psychological Science",
      "Torre & Lieberman (2018) — affect labeling as implicit emotion regulation — Emotion Review",
      "Burklund et al. (2014) — Psychological Science",
    ],
  },
  {
    id: "bio-filter",
    title: "Hardware vs. software",
    oneLiner: "Telling a hardware problem from a software one.",
    whatItDoes:
      "Flagging your physical state — under-rested, in pain, hormonal shift — so it can be read for what it is, instead of mistaken for an emotion.",
    theScience:
      "Physical states change emotional perception directly. On four hours of sleep, the amygdala reacts far more strongly to negative stimuli, and people read neutral faces as threatening. Misattribution of arousal — reading a biological signal as an emotional one — is well-documented. The move is letting \u201cI feel overwhelmed\u201d be re-read as \u201cmy system is physically depleted.\u201d",
    sources: [
      "Yoo et al. (2007) — sleep deprivation amplifies amygdala reactivity — Current Biology",
      "Schachter & Singer (1962) — two-factor theory / misattribution of arousal — Psychological Review",
      "Eccleston & Crombez (1999) — pain disrupts cognitive function — Psychological Bulletin",
      "Seth (2013); Barrett & Simmons (2015) — interoceptive predictive coding",
    ],
  },

  // ── what you do (the tools) ───────────────────────────────
  {
    id: "breathing",
    title: "Paced breathing",
    oneLiner: "Why a longer breath out settles the body.",
    whatItDoes:
      "Three patterns — Quick Reset, Deep Regulate, Cyclic Sighing — all built around an exhale longer than the inhale.",
    theScience:
      "An extended exhale activates the vagus nerve and the parasympathetic nervous system — the body\u2019s brake pedal — which measurably lowers heart rate within minutes. Cyclic Sighing is the most-studied of the three: a 2023 Stanford RCT (n=111) compared it to box breathing, cyclic hyperventilation, and mindfulness over a month of daily five-minute practice, and cyclic sighing produced the greatest mood improvement and respiratory-rate reduction. Stillform runs the published protocol exactly.",
    sources: [
      "Balban et al. (2023) — cyclic sighing vs. mindfulness, Stanford RCT — Cell Reports Medicine",
      "Lehrer et al. (2020) — HRV biofeedback and autonomic flexibility",
    ],
  },
  {
    id: "body-scan",
    title: "Body scan",
    oneLiner: "Why pressing six points quiets the noise.",
    whatItDoes: "Six pressure points with timed, auto-advancing holds.",
    theScience:
      "Acupressure works through focused interoceptive attention — directing awareness to specific points on the body interrupts rumination by pulling cognitive resources toward physical sensation, and the pressure itself adds parasympathetic activation through tactile vagal stimulation. It\u2019s the same principle as an MBSR body scan, faster and with points.",
    sources: [
      "Au et al. (2015) — self-administered acupressure reduces anxiety — Acupuncture in Medicine",
      "Mehling et al. (2012) — interoceptive awareness (MAIA) — PLOS ONE",
      "Critchley & Garfinkel (2017) — interoception and emotional awareness — Current Opinion in Psychology",
    ],
  },
  {
    id: "reframe",
    title: "Reframe \u2014 metacognitive observation",
    oneLiner: "Seeing a thought as a thought, not as the truth.",
    whatItDoes:
      "Observing your own thinking, naming what it\u2019s doing, and choosing a response — without arguing about whether the thought is \u201crational.\u201d",
    theScience:
      "The mechanism is metacognitive observation: seeing the thought as a thought rather than being fused with it. This is Metacognitive Therapy, not CBT — CBT targets the content of a thought (\u201cis this rational?\u201d); MCT targets your relationship to it (\u201cI\u2019m having this thought\u201d vs. \u201cI am this thought\u201d). As you shift from fused to observing, amygdala activation drops and prefrontal engagement rises. Doing it as a conversation lowers the friction, because self-directed observation is hardest to start at the moment of distress.",
    sources: [
      "Wells (2009) — Metacognitive Therapy for Anxiety and Depression",
      "Normann & Morina (2018) — meta-analysis of MCT efficacy — Frontiers in Psychology",
      "Ochsner & Gross (2005) — the cognitive control of emotion — Trends in Cognitive Sciences",
    ],
  },
  {
    id: "somatic-interrupt",
    title: "A cue back to the body",
    oneLiner: "Drop your shoulders — you didn\u2019t notice they were up.",
    whatItDoes:
      "Catching the body when it tightens mid-spiral — shoulders at your ears, jaw clenched — and letting a small release interrupt the escalation.",
    theScience:
      "Physical tension during emotional processing amplifies the emotional response. A brief cue back to the body interrupts the escalation without interrupting the thought. The tension was running underneath your awareness — that\u2019s exactly why a nudge to notice it works.",
    sources: [
      "Bernstein et al. (2015) — brief body-focused interventions reduce reactivity — Behaviour Research and Therapy",
      "Farb et al. (2015) — interoceptive awareness training changes emotion processing — Social Cognitive and Affective Neuroscience",
    ],
  },
  {
    id: "urge-surfing",
    title: "Urge-surfing",
    oneLiner: "An urge is a wave, not a command.",
    whatItDoes:
      "For an acute pull (scroll, check, the text you want to send): name the pull, watch it without acting, then decide. Acting or not is your call.",
    theScience:
      "An urge rises, peaks, and subsides on its own, usually within minutes, whether or not you act. Watching it with attention instead of obeying it lets it crest and pass, and weakens the urge\u2192action link over repetitions. Naming it first is affect labeling, which dampens the limbic response. The choice is left to you deliberately — being told \u201cdon\u2019t\u201d tends to strengthen an urge.",
    sources: [
      "Marlatt & Gordon (1985); Marlatt & Donovan (2005) — urge surfing — relapse-prevention literature",
      "Bowen et al. (2014) — mindfulness-based relapse prevention lowers craving reactivity — JAMA Psychiatry",
      "Lieberman et al. (2007) — affect labeling dampens amygdala response — Psychological Science",
    ],
  },
  {
    id: "reconsolidation",
    title: "Memory reconsolidation",
    oneLiner: "Why working a recurring trigger can change it, not just rehearse around it.",
    whatItDoes:
      "Returning to the same recurring trigger — while it\u2019s actually active — and pairing it with a new read.",
    theScience:
      "When a memory is recalled in an activated state and met with a new interpretive frame, the memory itself can update — not just the response you rehearse around it. The felt contradiction, delivered while the learning is active, is the working ingredient.",
    sources: [
      "Ecker, Ticic & Hulley (2012) — Unlocking the Emotional Brain",
      "Schiller et al. (2010) — Nature",
      "Lane et al. (2015)",
    ],
  },

  // ── what you notice and decide ────────────────────────────
  {
    id: "data-feed",
    title: "Reading your own shift",
    oneLiner: "Did it move, hold, or drop? Naming that is the skill.",
    whatItDoes:
      "Noticing where you started and where you landed — whether a session moved you toward steadier ground, held you in place, or pulled you lower.",
    theScience:
      "Emotional states map onto how pleasant and how activated they are — Russell\u2019s circumplex. A move from a negative-valence state toward a positive one is what regulation looks like; but staying put isn\u2019t failure — sometimes the work is the holding, which the acceptance traditions treat as practice, not defeat. And a slide into numb, disconnected shutdown is itself worth noticing. Learning to read your own movement across those axes is the skill.",
    sources: [
      "Russell (1980) — a circumplex model of affect",
      "Hayes, Strosahl & Wilson (2011) — ACT; sustained acceptance as practice",
      "Kabat-Zinn (1990) — mindfulness-based stress reduction",
      "Porges (2011) — hypoarousal as signal",
    ],
  },
  {
    id: "routing",
    title: "The right move depends on your state",
    oneLiner: "Not a fixed type — what works shifts with the day.",
    whatItDoes:
      "Knowing that sometimes you settle the body before the mind will follow, and sometimes the reverse — and which one depends on the state you\u2019re in, not a label you wear.",
    theScience:
      "People show genuine leanings toward body-first or thought-first regulation, but those leanings are probabilistic and state-dependent, not fixed identities: cognitive strategies tend to work better at moderate arousal, physical ones at high arousal. The same person needs body-first when flooded and thought-first when calm but stuck in rumination. And how well you read your own body is trainable, not a trait.",
    sources: [
      "Gross (2015) — emotion regulation: current status and future prospects — Psychological Inquiry",
      "Ochsner & Gross (2005) — the cognitive control of emotion — Trends in Cognitive Sciences",
      "Price & Hooven (2018) — interoceptive awareness and regulation — Appetite",
      "Webb et al. (2012) — regulation-strategy effects vary by person — Psychological Bulletin",
      "Mehling et al. (2012) — interoceptive awareness is trainable (MAIA) — PLOS ONE",
    ],
  },
  {
    id: "implementation-intentions",
    title: "Implementation intentions",
    oneLiner: "Deciding your move before the moment hits.",
    whatItDoes:
      "Deciding your one concrete next move while you\u2019re still clear — including \u201clet it go\u201d as a real, valid choice — instead of leaving it to a flooded version of you.",
    theScience:
      "Forming a specific \u201cif X, then Y\u201d plan dramatically increases follow-through versus a general intention, because it pre-decides the response and bypasses the decision paralysis of being flooded. Meta-analysis puts the effect at medium-to-large on goal attainment. Closing the intention\u2192action gap while you\u2019re still regulated is the whole point.",
    sources: [
      "Gollwitzer (1999) — \u201cImplementation Intentions: Strong Effects of Simple Plans\u201d — American Psychologist",
      "Gollwitzer & Sheeran (2006) — meta-analysis on goal attainment — Advances in Experimental Social Psychology",
      "Webb & Sheeran (2004) — implementation intentions and behavior change — British Journal of Social Psychology",
    ],
  },
  {
    id: "lock-in",
    title: "Name the move so it repeats",
    oneLiner: "Saying how you got there makes it repeatable.",
    whatItDoes:
      "After you\u2019ve made a decision, naming the processing move that got you there — \u201cmy body settled before I chose my words,\u201d \u201cI separated the facts from the story.\u201d",
    theScience:
      "Naming the move that led to a decision, after the fact — reflection-on-action — consolidates the insight and makes it repeatable. Tying the words to how you actually got there captures the pathway, not just the outcome, so next time you can find it again. A short pause before you move on is what keeps the reflection genuine rather than reflexive.",
    sources: [
      "Sch\u00f6n (1983) — The Reflective Practitioner; reflection-on-action",
      "Mann et al. (2009) — reflective practice improves self-awareness — Advances in Health Sciences Education",
      "Flavell (1979) — metacognitive monitoring — American Psychologist",
    ],
  },
  {
    id: "after-action-review",
    title: "After-action review",
    oneLiner: "Pulling the one thing worth keeping while it\u2019s still sharp.",
    whatItDoes:
      "Right after something happens, naming it, then a quick post-mortem — what worked, what didn\u2019t, what to keep — ending with one carry-forward move.",
    theScience:
      "Structured reflection after an event measurably improves the next one — but only when it\u2019s structured. Reviewing both what worked and what didn\u2019t produces more learning than dwelling on either alone, and stating the lesson as a concrete \u201cnext time X, I do Y\u201d is what makes it transfer. Doing it while the episode is fresh is part of why it works.",
    sources: [
      "Tannenbaum & Cerasoli (2013) — structured debriefs improve performance — Human Factors",
      "Ellis & Davidi (2005) — reviewing successes and failures beats failure-only — Journal of Applied Psychology",
      "Gollwitzer (1999) — implementation intentions carry the lesson forward — American Psychologist",
    ],
  },
  {
    id: "end-of-day",
    title: "End-of-day check-in",
    oneLiner: "Closing the loop you opened in the morning.",
    whatItDoes:
      "In the evening: energy vs. this morning, whether composure held, one word for the day — closing the bookend you opened when you woke.",
    theScience:
      "Structured end-of-day reflection improves self-regulation and metacognitive awareness, and the morning-evening bookend creates a feedback loop that speeds up pattern recognition. You set your tone in the morning and close it at night; the connection between the two is where patterns become visible.",
    sources: [
      "Sch\u00f6n (1983) — The Reflective Practitioner",
      "Mann et al. (2009) — reflective practice in health professions — Advances in Health Sciences Education",
      "Boud et al. (1985) — Reflection: Turning Experience into Learning",
    ],
  },
  {
    id: "pre-event-brief",
    title: "Pre-event brief",
    oneLiner: "Walking in having already thought about the moment once.",
    whatItDoes:
      "Before a hard event: the state you\u2019re walking in with, what\u2019s load-bearing about this one, if-then moves, and the recovery after — with an optional rehearsal of a few likely moments.",
    theScience:
      "Naming a forecast pressure in advance lowers its grip; pre-committing a response as \u201cif X, then Y\u201d roughly halves the cognitive cost of producing it under load; and pre-planning the downregulation afterward buys back capacity. Rehearsing likely moments before they happen measurably improves performance, because the response is already partly built when the moment arrives.",
    sources: [
      "Barrett (2017) — constructed emotion (the hardware read)",
      "Lazarus (1991) — anticipatory appraisal",
      "Gollwitzer (1999) — implementation intentions cut the cost of acting under load",
      "Sheppes & Gross (2011) — pre-planned regulation buys back capacity",
      "Driskell, Copper & Moran (1994) — meta-analysis: mental rehearsal improves performance",
    ],
  },
  {
    id: "ghost-echo",
    title: "Your own track record",
    oneLiner: "You\u2019ve done this before — that\u2019s evidence, not a pep talk.",
    whatItDoes:
      "Remembering, at the hard moment, that you\u2019ve handled something like this before — your own history as proof you can.",
    theScience:
      "Self-efficacy — believing you can handle a situation — is the strongest predictor of whether you actually will, and its most powerful source is mastery experience: evidence you\u2019ve done the thing before. Bringing that evidence to mind at the moment of difficulty is the difference between encouragement and proof.",
    sources: [
      "Bandura (1977) — \u201cSelf-efficacy: Toward a unifying theory of behavioral change\u201d — Psychological Review",
      "Bandura (1997) — Self-Efficacy: The Exercise of Control",
    ],
  },
  {
    id: "skip-tracking",
    title: "Avoidance is information",
    oneLiner: "The step you keep skipping is the one worth noticing.",
    whatItDoes:
      "Paying attention to the part of the practice you tend to avoid — the reflection you skip, the action you don\u2019t take.",
    theScience:
      "In behavioral research, avoidance is as informative as engagement — what you consistently don\u2019t do reveals as much as what you do. In metacognitive terms, skipping the step where you\u2019d name a feeling can mean you\u2019re still inside the state rather than observing it. Noticing the skip, without shame, is the opening.",
    sources: [
      "Hayes et al. (1996) — experiential avoidance as a transdiagnostic process — Psychological Review",
      "Wells (2009) — avoidance maintains metacognitive beliefs — Metacognitive Therapy",
      "Gollwitzer & Sheeran (2006) — the intention-action gap — Advances in Experimental Social Psychology",
    ],
  },
  {
    id: "system-override",
    title: "Trust your own read",
    oneLiner: "You\u2019re the final authority on how you feel.",
    whatItDoes:
      "Naming your state as precisely as you can — and trusting your own felt sense over any label, including a flattering one.",
    theScience:
      "Two things at once. A precise label attached to a real internal state sharpens granularity in a way generic reassurance can\u2019t — your body gets a specific referent to attach to. And staying the higher authority on your own state is what keeps that honest: if a label doesn\u2019t match what you feel, your felt sense wins. Precision and self-trust, together, are how the reading gets more accurate over time.",
    sources: [
      "Barrett et al. (2001) — granularity is trainable through specific labeling — Cognition and Emotion",
      "Lieberman et al. (2007) — precise labels engage prefrontal regulation — Psychological Science",
      "Garfinkel et al. (2015) — interoceptive accuracy vs. sensibility — Biological Psychology",
      "Mehling et al. (2012) — interoceptive awareness (MAIA) — PLOS ONE",
    ],
  },
  {
    id: "pattern-recognition",
    title: "Seeing your own patterns",
    oneLiner: "A pattern seen from the outside loses its grip.",
    whatItDoes:
      "Catching the shapes your reactions keep making — the recurring trigger, the move you always make — by seeing them laid out instead of living inside them.",
    theScience:
      "Seeing a pattern from the outside — externalized, not just felt — creates psychological distance, and that distance lowers emotional reactivity and clears the way for a better decision. The pattern stops being the weather you\u2019re inside and becomes something you can look at.",
    sources: [
      "Flavell (1979) — metacognitive monitoring — American Psychologist",
      "Kross & Ayduk (2011) — psychological distancing reduces reactivity — JPSP",
      "Gross (2015) — the extended process model of emotion regulation — Biological Psychology",
    ],
  },
  {
    id: "practice-evidence",
    title: "Measured against your own past",
    oneLiner: "Progress is you vs. your earlier self — never a standard.",
    whatItDoes:
      "Watching the functions the practice trains get a little sharper over time — how quickly and precisely you can name a feeling, how many real angles you can find on a thought — measured only against where you started.",
    theScience:
      "Re-rating how strongly you believe a thought after weighing the evidence is cognitive reappraisal — and it connects to reconsolidation when you do it while the thought is live. Naming faster and finer is a real practice signal (the honest bound: it reflects practice, not a brain scan). And flexibility — how many genuinely different angles you can take — is the defusion skill, measured as range, not correctness.",
    sources: [
      "Ochsner & Gross (2005) — cognitive reappraisal — Trends in Cognitive Sciences",
      "Lieberman et al. (2007) — affect labeling as regulation — Psychological Science",
      "Ecker, Ticic & Hulley (2012) — memory reconsolidation",
      "Mehling et al. (2012) — interoceptive awareness (MAIA) — PLOS ONE",
    ],
  },

  // ── why it works deeper (the frameworks) ──────────────────
  {
    id: "body-first",
    title: "The body-first path",
    oneLiner: "Why the body has to settle before the thinking work can land.",
    whatItDoes:
      "When you\u2019re too activated (panic, rage) or too shut down (numb, distant), going to breath or body work first — not straight to analysis.",
    theScience:
      "There\u2019s a zone of arousal — the window of tolerance — where higher-order work like naming and reframing is possible. Activation outside that zone makes it nearly impossible. Single-pointed attention on the breath or body resets what the brain\u2019s salience network treats as urgent, widening the window enough for the metacognitive work to land. Repeated practice widens it over time.",
    sources: [
      "Siegel (1999) — the window of tolerance",
      "Menon (2011) — salience network",
      "Porges (2011) — Polyvagal Theory; Ogden, Minton & Pain (2006)",
    ],
  },
  {
    id: "dmn",
    title: "Quieting the rumination circuit",
    oneLiner: "You can\u2019t ruminate and count 4-4-8-2 at the same time.",
    whatItDoes:
      "Pulling attention onto the count and the ring, which interrupts the brain circuit that runs mind-wandering and rumination.",
    theScience:
      "The default mode network is active at rest and drives repetitive, self-focused thought — \u201cwhy did I say that,\u201d \u201cwhat if this happens.\u201d Task-focused activity like paced breathing recruits the task-positive network, which suppresses the DMN. The visual focus, the counting rhythm, and the controlled breath form a triple-lock: rumination can\u2019t run while you\u2019re tracking the pattern.",
    sources: [
      "Raichle et al. (2001) — \u201cA default mode of brain function\u201d — PNAS",
      "Brewer et al. (2011) — meditation reduces DMN activity — PNAS",
      "Doll et al. (2016) — breath-focused attention raises amygdala\u2013prefrontal connectivity — NeuroImage",
    ],
  },
  {
    id: "autonomic-flexibility",
    title: "Autonomic flexibility",
    oneLiner: "The capacity the practice builds over time.",
    whatItDoes:
      "What repeated practice trains underneath the individual sessions: your nervous system\u2019s ability to shift cleanly between activation and recovery.",
    theScience:
      "Autonomic flexibility — moving fluidly between fight-or-flight and rest-and-digest — is one of the strongest markers of emotional resilience, and higher heart-rate variability reflects it. Regulation practice trains that flexibility like a muscle. The training-flexibility claim comes from the literature; tracked directly as HRV once biosensor integration ships.",
    sources: [
      "Thayer & Lane (2000) — HRV as an index of regulated responding — Review of General Psychology",
      "Appelhans & Luecken (2006) — HRV reflects regulation capacity — Review of General Psychology",
      "Lehrer & Gevirtz (2014) — HRV biofeedback improves autonomic regulation — Frontiers in Psychology",
    ],
  },
  {
    id: "stress-inoculation",
    title: "Stress inoculation",
    oneLiner: "Practice the skill when it\u2019s easy so it\u2019s there when it\u2019s not.",
    whatItDoes:
      "Making regulation a small daily practice even on good days, so the capacity is built before it\u2019s needed.",
    theScience:
      "Stress inoculation — controlled, manageable practice of stress and regulation — builds resilience for future high-stress events, because skills rehearsed when calm deploy more automatically under pressure. Military, first responders, and surgeons train on this principle. \u201cComposure when winning\u201d is that theory applied: set your tone when nothing\u2019s wrong, so the muscle is there when something is.",
    sources: [
      "Meichenbaum (1985) — Stress Inoculation Training",
      "Saunders et al. (1996) — SIT across anxiety, PTSD, performance anxiety — Clinical Psychology Review",
      "Robson & Manacapilli (2014) — stress inoculation in military performance — RAND Corporation",
    ],
  },
  {
    id: "neuroplasticity",
    title: "Why it compounds",
    oneLiner: "How practice deepens across sessions instead of resetting.",
    whatItDoes:
      "The thing that makes Stillform a skill with a track record rather than a mood that evaporates — each session builds on the last.",
    theScience:
      "Repeated contemplative practice produces measurable change in the brain — cortical thickening and connectivity shifts, with BDNF as a mediator. Done as a daily, in-the-moment practice paired with the natural cues of your day, the work wires in rather than resetting. Mastery experience — seeing yourself get better — is the strongest source of the self-efficacy that keeps it going.",
    sources: [
      "Calderone et al. (2024) — meditation and cortical thickness/connectivity",
      "Lazar et al. (2005) — cortical thickening from meditation",
      "Davidson (Center for Healthy Minds) — contemplative neuroplasticity",
      "Bandura (1977) — mastery experience and self-efficacy",
    ],
  },

  // ── the outward turn ──────────────────────────────────────
  {
    id: "microbiases",
    title: "Reading the room when you\u2019re depleted",
    oneLiner: "When you\u2019re running low, your read of others can sharpen wrong.",
    whatItDoes:
      "Catching the moment your physical depletion is bending how you read someone else — and asking \u201cis this them, or my hardware?\u201d",
    theScience:
      "People systematically over-read the intensity of others\u2019 negative emotions — usually harmless, but when you\u2019re depleted, in pain, or under-rested it compounds with hardware load into reactive decisions. Add the pull to blame character instead of situation, and the way we absorb others\u2019 states unconsciously, and the danger isn\u2019t the perception — it\u2019s the intersection of a low system and a hard read. Catching that intersection is the skill.",
    sources: [
      "Genzer, Rubin, Sened, Rafaeli, Ochsner, Cohen & Perry (2025) — directional bias in interpersonal emotion perception — Nature Communications",
      "Ross (1977) — fundamental attribution error",
      "Hatfield, Cacioppo & Rapson (1993) — emotional contagion",
      "Goleman (1995) — emotional intelligence as interpersonal awareness",
    ],
  },

  // ── the craft, honestly ───────────────────────────────────
  {
    id: "fractal",
    title: "Fractal visual grounding",
    oneLiner: "Why the branching visual behind the breath settles you.",
    whatItDoes:
      "Organic amber branching grows on the inhale and dissolves on the exhale behind the breathing ring — natural fractal geometry synced to your breath. Optional in Settings.",
    theScience:
      "Natural fractal patterns — trees, rivers, coastlines — in the mid-complexity range produce measurable relaxation in lab exposure, with the visual cortex shifting toward the alpha-wave activity of relaxed alertness. The lab effect on skin conductance doesn\u2019t translate one-to-one to a phone screen, but the visual is built in the same complexity range and serves the same restorative purpose.",
    sources: [
      "Taylor et al. (University of Oregon) — mid-complexity fractals reduce stress — Nonlinear Dynamics, Psychology, and Life Sciences",
      "Hagerhall et al. (2015) — fractal patterns induce alpha-wave EEG — Nonlinear Dynamics, Psychology, and Life Sciences",
      "Joye & Van den Berg (2011) — restorative effects driven partly by fractal geometry — Environment and Behavior",
    ],
  },
  {
    id: "ambient-pulse",
    title: "The ambient pulse",
    oneLiner: "An honest one: design language, not a claimed mechanism.",
    whatItDoes:
      "The slow glow on the home screen, at roughly the rhythm of a calm resting heart rate — a quiet cue that this is a place to slow down.",
    theScience:
      "We don\u2019t claim the glow entrains your heart rate or autonomic state — the literature on visual HRV entrainment at ~1Hz doesn\u2019t support that (most rhythmic-entrainment evidence is auditory, with a motor response). It stays because ambient design that signals slowness sets the tone of the screen, and that tone is part of the experience. We\u2019d rather keep it as design language than overclaim a mechanism the research doesn\u2019t back.",
    sources: [],
  },
  {
    id: "engagement-principles",
    title: "Your attention is worth protecting",
    oneLiner: "The less you need the app, the more it\u2019s working.",
    whatItDoes:
      "The principle the whole thing is built to honor: your attention and autonomy are yours. The practice anchors to natural moments, keeps one clear action, and refuses the tricks that turn other apps into traps.",
    theScience:
      "Autonomy, competence, and a sense of being understood are what actually sustain engagement over time — not compulsion. And design that respects your attention predicts better long-term retention than design that extracts it. The aim is to make the practice effective enough that you don\u2019t need to live in the app — a deliberate refusal of the attention-trap playbook, not an accident.",
    sources: [
      "Deci & Ryan (2000) — self-determination theory; autonomy sustains engagement",
      "Pielot et al. (2014, 2017) — attention-respectful design and long-term retention",
    ],
  },
  // ── working with your vulnerabilities ──
  {
    id: "everyone-has-them",
    title: "Everyone has them",
    oneLiner: "A blind spot isn\u2019t a verdict on you \u2014 it\u2019s standard equipment.",
    whatItDoes:
      "Lets you look at a charged part of yourself without the shame that usually makes you look away \u2014 because that looking-away is the thing that actually blocks the work.",
    theScience:
      "Self-compassion has three parts: self-kindness, common humanity, and mindfulness. Common humanity \u2014 knowing that failings and weak spots are part of being human, not yours alone \u2014 is what lowers shame and isolation, the two things that keep a person from examining their own material. And the harsh inner critic doesn\u2019t drive improvement the way it promises to; meeting yourself with some understanding supports more durable change than self-judgment does.",
    sources: [
      "Neff (2003) \u2014 self-compassion: self-kindness, common humanity, mindfulness \u2014 Self and Identity",
      "Neff (2023) \u2014 common humanity reduces shame and isolation; self-compassion supports sustainable change \u2014 Annual Review of Psychology",
    ],
  },
  {
    id: "two-edges",
    title: "The same trait, two edges",
    oneLiner: "What tips you over and what makes you go all-in are usually one trait.",
    whatItDoes:
      "Shows a charged part of you as one thing with two edges \u2014 the cost and the strength \u2014 so you can keep the strength while you watch the cost, instead of trying to amputate the whole trait.",
    theScience:
      "The part that makes someone susceptible to harm under bad conditions is often the same part that makes them benefit disproportionately under good ones. Research on differential susceptibility found that the more sensitive aren\u2019t simply more fragile \u2014 they\u2019re more malleable in both directions, gaining more from supportive conditions than others do. Vantage sensitivity names that positive edge directly. One sensitivity, for better and for worse \u2014 one root, two outcomes depending on what it meets.",
    sources: [
      "Belsky & Pluess (2009) \u2014 differential susceptibility: the sensitive are more plastic, not just more vulnerable \u2014 Psychological Bulletin",
      "Pluess & Belsky (2013) \u2014 vantage sensitivity: heightened response to positive experiences \u2014 Psychological Bulletin",
      "Belsky, Bakermans-Kranenburg & van IJzendoorn (2007) \u2014 sensitivity operates \u2018for better and for worse\u2019 \u2014 Current Directions in Psychological Science",
      "Aron & Aron (1997) \u2014 sensory processing sensitivity, one trait carrying both edges \u2014 Journal of Personality and Social Psychology",
    ],
  },
  {
    id: "work-with-it",
    title: "Working with it, not around it",
    oneLiner: "You don\u2019t get rid of a charged part \u2014 you stop letting it drive unseen.",
    whatItDoes:
      "Turns a vulnerability from something you avoid into something you can sit with on purpose \u2014 which loosens its grip more reliably than fighting or suppressing it.",
    theScience:
      "Trying to push a charged part down or steer around it tends to keep it in charge. The more workable move is acceptance \u2014 making room for the state instead of avoiding it \u2014 which reduces its pull without a fight. Sometimes the work isn\u2019t making a feeling shift; it\u2019s holding it without being run by it. That holding is the practice, not a failure of it.",
    sources: [
      "Hayes, Strosahl & Wilson (2011) \u2014 ACT; acceptance and willingness over avoidance",
      "Neff (2023) \u2014 self-compassion as a productive way to meet distressing states \u2014 Annual Review of Psychology",
    ],
  },
  // ── how you protect yourself under pressure ──
  {
    id: "moves-under-pressure",
    title: "The moves you make under pressure",
    oneLiner: "When a truth is hard to face, you reach for a move \u2014 usually without noticing.",
    whatItDoes:
      "Names the automatic ways you handle a threatening truth \u2014 deflecting, minimizing, explaining it away, turning it on someone else, retreating into analysis \u2014 so you can catch the move as it runs instead of being run by it.",
    theScience:
      "These protective moves were organized into a hierarchy from less to more adaptive across decades of longitudinal research. The same move can serve you or cost you depending on which one it is and how rigidly it runs \u2014 none of them is a flaw, they\u2019re standard equipment. The work isn\u2019t to delete the move; it\u2019s to see it clearly enough to choose.",
    sources: [
      "Vaillant (1977) \u2014 empirically-derived hierarchy of defenses (less to more adaptive), Harvard longitudinal study",
      "Vaillant (1992) \u2014 protective moves that reduce the shock of sudden stress; adaptive or costly by how they\u2019re used",
    ],
  },
  {
    id: "first-move-under-threat",
    title: "What you do first under threat",
    oneLiner: "Before you think, your system already picked a move: stand, leave, go still, or smooth it over.",
    whatItDoes:
      "Names your body\u2019s first reflex when it reads threat \u2014 squaring up, getting away, going still, or smoothing things over \u2014 so you can recognize your default and not mistake an old reflex for the only option.",
    theScience:
      "The first response to threat is automatic and bodily, not something you reason your way into. The go-still reflex in particular is involuntary and documented \u2014 protection, not weakness. Each reflex has two edges: the one that kept you safe once is the one that can run you now. Recognizing yours is the first move toward having a say in it.",
    sources: [
      "Moller et al. (2017) \u2014 the involuntary still/freeze reflex (tonic immobility), documented and protective",
      "Walker (2013) \u2014 the smooth-it-over / appease pattern as a protective strategy (clinically described)",
    ],
  },
  // ── what's strong in you (the bright pole) ──
  {
    id: "your-strengths",
    title: "What's strong in you",
    oneLiner: "The traits you can lean on \u2014 named on purpose, not left to chance.",
    whatItDoes:
      "Names a real strength of yours and where it already shows up, so it becomes something you can reach for deliberately instead of a thing that only happens by accident. Most self-knowledge watches for what tips you; this is the other pole.",
    theScience:
      "There\u2019s a whole classification of human strengths \u2014 built deliberately as the inverse of a disorder manual \u2014 cataloguing two dozen a person holds in varying degrees. A strength is often the bright edge of a charged trait: the all-in that overwhelms is the same all-in that gives fully. Naming it is how you keep the bright edge while you watch the cost.",
    sources: [
      "Peterson & Seligman (2004) \u2014 the VIA classification of character strengths (the inverse of a disorder manual); the strengths are the robust part, the virtue grouping more theoretical",
    ],
  },
  {
    id: "strength-on-purpose",
    title: "Using a strength on purpose",
    oneLiner: "Knowing a strength does little; using one deliberately moves something.",
    whatItDoes:
      "Turns a named strength into a move: pick one and use it in a new way where it fits. Not a personality badge \u2014 a deliberate act you can repeat.",
    theScience:
      "In a randomized study, people who used one of their signature strengths in a new way each day for a week showed lasting gains in well-being at six-month follow-up, and strengths use predicts increases in well-being over time. The effect is in the using, not the knowing \u2014 which is why the work attached to a strength is to spend it on purpose.",
    sources: [
      "Seligman et al. (2005) \u2014 signature-strength-in-a-new-way intervention; lasting well-being gains, RCT with six-month follow-up \u2014 American Psychologist 60(5):410\u2013421",
      "Wood et al. (2011) \u2014 strengths use predicts increases in well-being over time \u2014 Personality and Individual Differences",
    ],
  },
  // ── what you're moving toward (the directional pole) ──
  {
    id: "your-values",
    title: "What you're moving toward",
    oneLiner: "A direction you choose turns scattered effort into movement.",
    whatItDoes:
      "Names where you're pointed \u2014 the kind of person you're moving toward being, by your own choosing \u2014 and one concrete step toward it. Strengths name what's strong now; this names the direction.",
    theScience:
      "Naming a freely chosen direction (values clarification) and taking value-driven steps even when it\u2019s uncomfortable (committed action) are two of the core processes behind psychological flexibility, with a deep evidence base. The point is that the direction is YOURS, not handed to you \u2014 when an action connects to a value you actually hold, it carries its own motivation. So the work attached to a value is always one concrete step.",
    sources: [
      "Hayes, Strosahl & Wilson (2011) \u2014 ACT: values clarification (freely chosen directions) + committed action (value-driven behavior despite discomfort)",
    ],
  },
  // ── reframing vs holding it in ──
  {
    id: "reframe-vs-hold",
    title: "Reframing vs holding it in",
    oneLiner: "Two ways to handle a hard feeling \u2014 and most people lean one way without noticing.",
    whatItDoes:
      "Names your default: do you reframe a hard feeling (change the read to change the feeling) or hold it in (feel it, but keep the lid on and carry it)? Seeing your lean is the first step to having a say in it.",
    theScience:
      "Across five studies, people who habitually reframe tended to feel more positive and less negative emotion, stay closer in their relationships, and paid no memory cost; people who habitually held it in got the reverse \u2014 less positive emotion, more negative, worse memory, less closeness. Holding it in isn\u2019t always wrong \u2014 sometimes it\u2019s the right call for the moment \u2014 but as a default it costs. Reframing is the trainable move, so the work is direct: when you catch yourself carrying something, that\u2019s the cue to reframe it.",
    sources: [
      "Gross & John (2003) \u2014 reappraisal vs expressive suppression; reappraisers feel more positive / less negative emotion + closer relationships + no memory cost \u2014 JPSP 85(2):348\u2013362",
    ],
  },
];

/** Lookup one entry by id, or null. */
export function getScienceEntry(id) {
  if (!id || typeof id !== "string") return null;
  return SCIENCE_ENTRIES.find((e) => e.id === id) || null;
}
