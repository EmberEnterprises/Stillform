/**
 * scienceLibrary.js — the science behind the practice, for the Library's
 * "The Science" section (the Library headline's promised second half — "the
 * science worth checking it against").
 *
 * SOURCE OF TRUTH: every entry is lifted faithfully from `Stillform_Science_Sheet.md`
 * (Arlin's vetted research sheet). Citations are reproduced as the Sheet has
 * them — NO citation is invented or altered here (the citation-discipline rule;
 * a prior fabricated citation was caught and removed, so the Sheet's current
 * citations are the vetted survivors). If a claim or source isn't in the Sheet,
 * it isn't here. A fabrication-check script (scripts/check-science-citations.mjs)
 * greps every source in this file against the Sheet; it must pass.
 *
 * This is the full NON-REDUNDANT set — one entry per distinct mechanism. Where
 * the Sheet repeats itself, the sections are folded (emotional granularity sits
 * inside "feel chips"; window of tolerance inside "body-first"; Next Move inside
 * "implementation intentions"; the AI Insight Card inside "pattern recognition";
 * regulation-tendency inside "routing"). Internal/retired/audit sections are not
 * surfaced. Ships whole (no "coming soon").
 *
 * `oneLiner` and the trimmed framing are FIRST-PASS draft (Arlin's voice to set,
 * OK for testing). The science claims + sources are faithful to the Sheet.
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
    oneLiner: "The clinical framework the whole app is built on.",
    whatItDoes:
      "Every tool trains one shift — from being in a state to observing it. The app never asks whether a thought is \u201crational\u201d; it helps you observe the state, name it, and choose a response.",
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
    title: "The feel chips",
    oneLiner: "Naming a state more precisely changes how you handle it.",
    whatItDoes:
      "The chips name your state across the full map of feeling — high and low energy, easier and harder — instead of just \u201cgood\u201d or \u201cbad.\u201d",
    theScience:
      "The chips are grounded in Russell\u2019s dimensional model of affect, which organizes states by valence and arousal. The finer the distinctions you can make between emotions — emotional granularity — the better you regulate and the less you reach for harmful coping. Granularity is a trainable skill that improves with exactly this kind of repeated self-assessment.",
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
    title: "The bio-filter",
    oneLiner: "Telling a hardware problem from a software one.",
    whatItDoes:
      "Before the AI responds, you flag your physical state — under-rested, in pain, hormonal shift — and it reads everything through that.",
    theScience:
      "Physical states change emotional perception directly. On four hours of sleep, the amygdala reacts far more strongly to negative stimuli, and people read neutral faces as threatening. Misattribution of arousal — reading a biological signal as an emotional one — is well-documented. Flagging the state lets \u201cI feel overwhelmed\u201d be re-read as \u201cmy system is physically depleted.\u201d",
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
      "Reframe helps you observe your own thinking, name what it\u2019s doing, and choose a response — without arguing about whether the thought is \u201crational.\u201d",
    theScience:
      "The mechanism is metacognitive observation: seeing the thought as a thought rather than being fused with it. This is Metacognitive Therapy, not CBT — CBT targets the content of a thought (\u201cis this rational?\u201d); MCT targets your relationship to it (\u201cI\u2019m having this thought\u201d vs. \u201cI am this thought\u201d). As you shift from fused to observing, amygdala activation drops and prefrontal engagement rises. Stillform does this conversationally because self-directed observation is hardest to start at the moment of distress.",
    sources: [
      "Wells (2009) — Metacognitive Therapy for Anxiety and Depression",
      "Normann & Morina (2018) — meta-analysis of MCT efficacy — Frontiers in Psychology",
      "Ochsner & Gross (2005) — the cognitive control of emotion — Trends in Cognitive Sciences",
    ],
  },
  {
    id: "somatic-interrupt",
    title: "Somatic interrupt",
    oneLiner: "A nudge back to the body when the typing speeds up.",
    whatItDoes:
      "When your typing in Reframe goes rapid, the app drops in a brief body cue — \u201cdrop your shoulders\u201d — without breaking the thread.",
    theScience:
      "Physical tension during emotional processing amplifies the emotional response. A brief somatic cue that redirects attention to the body interrupts the escalation loop without interrupting the thought. Your shoulders were at your ears and you didn\u2019t notice — that\u2019s the point.",
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
      "A ~30-second flow for an acute pull (scroll, check, the text you want to send): name the pull, watch it ~20 seconds without acting, then decide. Acting or not is your call; nothing is scored.",
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
      "Returning to the same recurring trigger across sessions — while it\u2019s actually active — and pairing it with a new read.",
    theScience:
      "When a memory is recalled in an activated state and met with a new interpretive frame, the memory itself can update — not just the response you rehearse around it. The felt contradiction, delivered while the learning is active, is the working ingredient. Stillform only surfaces the candidate mismatch from your own logged history, as a question; your agreement is what makes it true.",
    sources: [
      "Ecker, Ticic & Hulley (2012) — Unlocking the Emotional Brain",
      "Schiller et al. (2010) — Nature",
      "Lane et al. (2015)",
    ],
  },

  // ── how it routes, closes, and learns ─────────────────────
  {
    id: "routing",
    title: "Routing by state, not type",
    oneLiner: "Your default pathway — not a fixed type.",
    whatItDoes:
      "Calibration identifies whether you tend to settle better body-first or thought-first, and loads that pathway first — but the day\u2019s state can override it.",
    theScience:
      "People do show genuine biases toward somatic vs. cognitive regulation, but those tendencies are probabilistic and state-dependent, not fixed identities: cognitive strategies tend to work better at moderate arousal, physiological ones at high arousal. So Stillform treats calibration as a weighted default and lets the bio-filter and feel-state signals re-route in real time. Interoceptive awareness itself is trainable, not a trait.",
    sources: [
      "Gross (2015) — emotion regulation: current status and future prospects — Psychological Inquiry",
      "Ochsner & Gross (2005) — the cognitive control of emotion — Trends in Cognitive Sciences",
      "Price & Hooven (2018) — interoceptive awareness and regulation — Appetite",
      "Webb et al. (2012) — regulation-strategy effects vary by person — Psychological Bulletin",
      "Mehling et al. (2012) — interoceptive awareness is trainable (MAIA) — PLOS ONE",
    ],
  },
  {
    id: "data-feed",
    title: "The three-category read",
    oneLiner: "How a shift gets read — from what you said, not what the app decided.",
    whatItDoes:
      "At each Reframe or Body Scan close, your entry chip and exit chip are run through a classifier that returns one of three reads: a regulated shift, a persistent state, or a concerning one — computed on your device, from your own picks.",
    theScience:
      "Russell\u2019s circumplex gives the three categories defensible structure by valence and arousal. A move from a negative-valence to a positive-valence quadrant is what regulation success looks like measurably; staying in the same quadrant isn\u2019t failure — sometimes the work is the holding, which the ACT and mindfulness traditions treat as practice, not defeat; and a drop into hypoarousal is flagged as a signal worth watching. The classifier is a pure function reading what you said — the app reflects, it doesn\u2019t grade.",
    sources: [
      "Russell (1980) — a circumplex model of affect",
      "Hayes, Strosahl & Wilson (2011) — ACT; sustained acceptance as practice",
      "Kabat-Zinn (1990) — mindfulness-based stress reduction",
      "Porges (2011) — hypoarousal as signal",
    ],
  },
  {
    id: "implementation-intentions",
    title: "Implementation intentions",
    oneLiner: "Deciding your move before the moment hits.",
    whatItDoes:
      "After Reframe — and in the calibration that pre-loads your home screen — you pick one concrete action from options tailored to the moment, including \u201clet it go\u201d as a real, valid choice.",
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
    title: "Lock-in statements",
    oneLiner: "Naming the move you just made so it repeats.",
    whatItDoes:
      "After choosing a next move, you pick one short lock-in statement, tailored to your action and your regulation style. The pair forms one sentence about how you processed and what you decided — with a 20-second pause that can\u2019t be skipped.",
    theScience:
      "Reflection-on-action — naming the processing move that led to a decision, after the fact — consolidates the insight and makes it repeatable. Tying the wording to how you actually got there (\u201cmy body settled before I chose my words\u201d vs. \u201cI separated facts from story\u201d) captures the pathway, not just the outcome. The forced pause is the feature: it keeps the reflection genuine rather than reflexive.",
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
      "A close for the moment right after something happens: name it, then run a quick post-mortem — what worked, what didn\u2019t, what to keep — ending with one carry-forward move.",
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
      "After 6 PM, three taps: energy vs. this morning, whether composure held, one word for the day. The AI carries it as context into tomorrow.",
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
      "Before a hard event, a four-part brief — the state you\u2019re walking in with, what\u2019s load-bearing about this one, if-then moves, and the recovery move after — with an optional rehearsal of two or three likely moments.",
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
    title: "Ghost echo",
    oneLiner: "Your own data showing you\u2019ve done this before.",
    whatItDoes:
      "Faint text on Pulse screens surfacing a past successful session — \u201cApr 3 — you shifted +2.4 in 2m 30s.\u201d",
    theScience:
      "Self-efficacy — believing you can handle a situation — is the strongest predictor of whether you actually will, and the most powerful source of it is mastery experience: evidence you\u2019ve done the thing before. Showing that evidence at the moment of current difficulty activates it. That\u2019s the difference between encouragement and evidence.",
    sources: [
      "Bandura (1977) — \u201cSelf-efficacy: Toward a unifying theory of behavioral change\u201d — Psychological Review",
      "Bandura (1997) — Self-Efficacy: The Exercise of Control",
    ],
  },
  {
    id: "skip-tracking",
    title: "Skip tracking",
    oneLiner: "What you keep skipping says as much as what you do.",
    whatItDoes:
      "Every skip on the post-Reframe screens is quietly recorded — and only surfaced after enough sessions to tell a pattern from a one-off, in curious, non-shaming language.",
    theScience:
      "In behavioral research, avoidance is as diagnostically informative as engagement — what someone consistently doesn\u2019t do reveals as much as what they do. In MCT specifically, skipping the labeling step can mean the person is still fused with the state rather than observing it. Single skips are noise; consistent skips are signal, which is why nothing surfaces until there\u2019s enough data.",
    sources: [
      "Hayes et al. (1996) — experiential avoidance as a transdiagnostic process — Psychological Review",
      "Wells (2009) — avoidance maintains metacognitive beliefs — Metacognitive Therapy",
      "Gollwitzer & Sheeran (2006) — the intention-action gap — Advances in Experimental Social Psychology",
    ],
  },
  {
    id: "system-override",
    title: "Observation + override",
    oneLiner: "The app offers a precise word — you\u2019re the final say.",
    whatItDoes:
      "Stillform names what it observes (\u201ccomposure restored\u201d) and always gives you a way to disagree — the \u201cI don\u2019t feel regulated yet\u201d button, and the same pattern under chip selection, routing, and rating.",
    theScience:
      "Two things at once. Precise labels paired with a real internal state train granularity in a way generic praise can\u2019t — there\u2019s a specific referent for the body to attach to. And keeping you as the higher authority on your own state is what makes that honest rather than gaslighting: each \u201cnot yet\u201d is a correction signal. The prediction-and-correction loop sharpens the app\u2019s read and your own self-perception at the same time.",
    sources: [
      "Barrett et al. (2001) — granularity is trainable through specific labeling — Cognition and Emotion",
      "Lieberman et al. (2007) — precise labels engage prefrontal regulation — Psychological Science",
      "Garfinkel et al. (2015) — interoceptive accuracy vs. sensibility — Biological Psychology",
      "Mehling et al. (2012) — interoceptive awareness (MAIA) — PLOS ONE",
    ],
  },
  {
    id: "pattern-recognition",
    title: "Pattern recognition",
    oneLiner: "Seeing your patterns in data, not just in your head.",
    whatItDoes:
      "The AI tracks session notes, recognizes recurring patterns, and surfaces them over time — observational early, pattern-based only once repetition earns it.",
    theScience:
      "Seeing your patterns externalized in data creates psychological distance, which lowers emotional reactivity and improves decisions. But claiming a pattern from one session is presumptuous and can trigger resistance, so the language stays observational early and only names a pattern once there\u2019s enough repetition to support it — honest about what the data actually shows at each stage.",
    sources: [
      "Flavell (1979) — metacognitive monitoring requires sufficient data — American Psychologist",
      "Kross & Ayduk (2011) — psychological distancing reduces reactivity — JPSP",
      "Gross (2015) — the extended process model of emotion regulation — Biological Psychology",
      "Brehm (1966) — reactance; premature labeling triggers resistance",
    ],
  },
  {
    id: "practice-evidence",
    title: "Practice evidence",
    oneLiner: "Measuring trained functions against your own past — never a norm.",
    whatItDoes:
      "Short exercises that track functions the practice trains — like how fast and how precisely you label a feeling, or how many genuinely different angles you can take on a thought — read only against your own history.",
    theScience:
      "Re-rating how strongly you believe a thought, after examining the evidence, operationalizes cognitive reappraisal — and connects to reconsolidation when the thought is worked while it\u2019s active. Affect-labeling speed and granularity are behavioral practice signals (the research supports labeling-as-regulation, so the honest bound is that these are practice signals, not a brain-change readout). Defusion is measured as flexibility — how many real vantage points — not correctness.",
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
      "When you\u2019re too activated (panic, rage) or too shut down (numb, distant), Stillform routes you to breath or body work first — not straight to analysis.",
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
      "Paced breathing pulls attention onto the count and the ring, which interrupts the brain circuit that runs mind-wandering and rumination.",
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
      "Autonomic flexibility — moving fluidly between fight-or-flight and rest-and-digest — is one of the strongest markers of emotional resilience, and higher heart-rate variability reflects it. Regulation practice trains that flexibility like a muscle. Stillform doesn\u2019t measure HRV yet; it tracks your self-reported shift each session and draws the training-flexibility claim from the literature, to be measured directly once biosensor integration ships.",
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
      "The daily loop — morning check-in, tools, end of day — is a micro-dose of regulation practice even on good days, building capacity before it\u2019s needed.",
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
      "Repeated contemplative practice produces measurable change in the brain — cortical thickening and connectivity shifts, with BDNF as a mediator. Done as a daily, in-the-moment practice paired with the natural cues of your day, the work wires in rather than resetting. Mastery experience — seeing yourself get better in your own data — is the strongest source of the self-efficacy that keeps it going.",
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
    title: "Interpersonal microbiases",
    oneLiner: "Reading the room accurately is part of composure.",
    whatItDoes:
      "When you describe a situation with someone else, the AI watches for a few subtle biases that distort how we read other people — and flags the intersection when your physical depletion meets a strong negative read.",
    theScience:
      "People systematically over-read the intensity of others\u2019 negative emotions — a bias that\u2019s usually adaptive, but stops serving you when you\u2019re depleted, in pain, or under-rested and it compounds with hardware load into reactive decisions. Combined with attributing others\u2019 behavior to character instead of situation, and unconsciously absorbing others\u2019 states, these intersections — not the perception itself — are what the AI surfaces, as a question, never a verdict.",
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
    title: "Built to respect your attention",
    oneLiner: "No infinite scroll, no dark patterns — on purpose.",
    whatItDoes:
      "The behavioral-science floor under how the app is built — why it anchors to natural moments in your day, keeps one clear action, gives you override everywhere, and never uses attention traps.",
    theScience:
      "Behavior happens when motivation, ability, and a trigger converge (Fogg), and habits form by pairing an action with a context until the context itself is the cue (Wood & R\u00fcnger) — which is why the practice anchors to your morning and evening rather than arbitrary reminders. Autonomy, competence, and relatedness sustain engagement (Deci & Ryan), so override pathways are everywhere. And attention-respectful design predicts better long-term retention than attention-extraction does.",
    sources: [
      "Fogg (2009) — a behavior model for persuasive design",
      "Wood & R\u00fcnger (2016) — the psychology of habit — Annual Review of Psychology",
      "Deci & Ryan (2000) — self-determination theory",
      "Thaler & Sunstein (2008) — Nudge; defaults shape behavior",
      "Pielot et al. (2014, 2017) — attention-respectful design and retention",
      "Norman (1988, 2013) — The Design of Everyday Things",
    ],
  },
];

/** Lookup one entry by id, or null. */
export function getScienceEntry(id) {
  if (!id || typeof id !== "string") return null;
  return SCIENCE_ENTRIES.find((e) => e.id === id) || null;
}
