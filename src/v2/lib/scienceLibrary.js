/**
 * scienceLibrary.js — the curated science behind the practice, for the Library's
 * "The Science" section (the Library headline's promised second half — "the
 * science worth checking it against").
 *
 * SOURCE OF TRUTH: every entry is lifted faithfully from `Stillform_Science_Sheet.md`
 * (Arlin's vetted research sheet). Citations are reproduced exactly as the Sheet
 * has them — NO citation is invented or altered here (the citation-discipline rule;
 * a prior fabricated citation was caught and removed, so the Sheet's current
 * citations are the vetted survivors). If a claim isn't in the Sheet, it isn't here.
 *
 * This is a principled CORE set — the mechanisms behind what the user actually
 * does — not the full ~30-section Sheet. Ships whole (no "coming soon").
 *
 * `oneLiner`, the trimmed `whatItDoes`/`theScience` framing, and the ordering are
 * FIRST-PASS — Arlin's voice / curation to refine. The science claims + sources
 * are faithful to the Sheet and should not drift from it.
 */

export const SCIENCE_ENTRIES = [
  {
    id: "breathing",
    title: "Paced breathing",
    oneLiner: "Why a longer breath out settles the body.",
    whatItDoes:
      "Three patterns — Quick Reset, Deep Regulate, Cyclic Sighing — all built around an exhale longer than the inhale.",
    theScience:
      "An extended exhale activates the vagus nerve and the parasympathetic nervous system — the body's brake pedal — which measurably lowers heart rate within minutes. Cyclic Sighing is the most-studied of the three: a 2023 Stanford RCT (n=111) compared it to box breathing, cyclic hyperventilation, and mindfulness over a month of daily five-minute practice, and cyclic sighing produced the greatest mood improvement and respiratory-rate reduction. Stillform runs the published protocol exactly.",
    sources: [
      "Balban et al. (2023) — cyclic sighing vs. mindfulness, Stanford RCT — Cell Reports Medicine",
      "Lehrer et al. (2020) — HRV biofeedback and autonomic flexibility",
    ],
  },
  {
    id: "feel-chips",
    title: "The feel chips",
    oneLiner: "Naming a state more precisely changes how you handle it.",
    whatItDoes:
      "The chips name your state across the full map of feeling — high and low energy, easier and harder — instead of just \u201cgood\u201d or \u201cbad.\u201d",
    theScience:
      "The chips are grounded in Russell's dimensional model of affect, which organizes states by valence and arousal. The finer the distinctions you can make between emotions — emotional granularity — the better you regulate and the less you reach for harmful coping. Granularity is a trainable skill that improves with exactly this kind of repeated self-assessment.",
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
      "Putting a feeling into words directly reduces amygdala activation and increases prefrontal engagement. fMRI studies show this happens automatically, even without any conscious intent to regulate. You don't have to understand the feeling for the naming to change the neural response.",
    sources: [
      "Lieberman et al. (2007) — \u201cPutting Feelings Into Words\u201d — Psychological Science",
      "Torre & Lieberman (2018) — affect labeling as implicit emotion regulation — Emotion Review",
      "Burklund et al. (2014) — Psychological Science",
    ],
  },
  {
    id: "reframe",
    title: "Reframe \u2014 metacognitive observation",
    oneLiner: "Seeing a thought as a thought, not as the truth.",
    whatItDoes:
      "Reframe helps you observe your own thinking, name what it's doing, and choose a response \u2014 without arguing about whether the thought is \u201crational.\u201d",
    theScience:
      "The mechanism is metacognitive observation: seeing the thought as a thought rather than being fused with it. This is Metacognitive Therapy, not CBT \u2014 CBT targets the content of a thought (\u201cis this rational?\u201d); MCT targets your relationship to it (\u201cI'm having this thought\u201d vs. \u201cI am this thought\u201d). As you shift from fused to observing, amygdala activation drops and prefrontal engagement rises. Stillform does this conversationally because self-directed observation is hardest to start at the moment of distress.",
    sources: [
      "Wells (2009) — Metacognitive Therapy for Anxiety and Depression",
      "Normann & Morina (2018) — meta-analysis of MCT efficacy — Frontiers in Psychology",
      "Ochsner & Gross (2005) — the cognitive control of emotion — Trends in Cognitive Sciences",
    ],
  },
  {
    id: "reconsolidation",
    title: "Memory reconsolidation",
    oneLiner: "Why working a recurring trigger can change it, not just rehearse around it.",
    whatItDoes:
      "Returning to the same recurring trigger across sessions \u2014 while it's actually active \u2014 and pairing it with a new read.",
    theScience:
      "When a memory is recalled in an activated state and met with a new interpretive frame, the memory itself can update \u2014 not just the response you rehearse around it. The felt contradiction, delivered while the learning is active, is the working ingredient. Stillform only surfaces the candidate mismatch from your own logged history, as a question; your agreement is what makes it true.",
    sources: [
      "Ecker, Ticic & Hulley (2012) — Unlocking the Emotional Brain",
      "Schiller et al. (2010) — Nature",
      "Lane et al. (2015)",
    ],
  },
  {
    id: "bio-filter",
    title: "The bio-filter",
    oneLiner: "Telling a hardware problem from a software one.",
    whatItDoes:
      "Before the AI responds, you flag your physical state \u2014 under-rested, in pain, hormonal shift \u2014 and it reads everything through that.",
    theScience:
      "Physical states change emotional perception directly. On four hours of sleep, the amygdala reacts far more strongly to negative stimuli, and people read neutral faces as threatening. Misattribution of arousal \u2014 reading a biological signal as an emotional one \u2014 is well-documented. Flagging the state lets \u201cI feel overwhelmed\u201d be re-read as \u201cmy system is physically depleted.\u201d",
    sources: [
      "Yoo et al. (2007) — sleep deprivation amplifies amygdala reactivity — Current Biology",
      "Schachter & Singer (1962) — two-factor theory / misattribution of arousal — Psychological Review",
      "Seth (2013); Barrett & Simmons (2015) — interoceptive predictive coding",
    ],
  },
  {
    id: "body-first",
    title: "The body-first path",
    oneLiner: "Why the body has to settle before the thinking work can land.",
    whatItDoes:
      "When you're too activated (panic, rage) or too shut down (numb, distant), Stillform routes you to breath or body work first \u2014 not straight to analysis.",
    theScience:
      "There's a zone of arousal \u2014 the window of tolerance \u2014 where higher-order work like naming and reframing is possible. Activation outside that zone makes it nearly impossible. Single-pointed attention on the breath or body resets what the brain's salience network treats as urgent, widening the window enough for the metacognitive work to land. Repeated practice widens it over time.",
    sources: [
      "Siegel (1999) — the window of tolerance",
      "Menon (2011) — salience network",
      "Porges (2011) — Polyvagal Theory; Ogden, Minton & Pain (2006)",
    ],
  },
  {
    id: "neuroplasticity",
    title: "Why it compounds",
    oneLiner: "How practice deepens across sessions instead of resetting.",
    whatItDoes:
      "The thing that makes Stillform a skill with a track record rather than a mood that evaporates \u2014 each session builds on the last.",
    theScience:
      "Repeated contemplative practice produces measurable change in the brain \u2014 cortical thickening and connectivity shifts, with BDNF as a mediator. Done as a daily, in-the-moment practice paired with the natural cues of your day, the work wires in rather than resetting. Mastery experience \u2014 seeing yourself get better in your own data \u2014 is the strongest source of the self-efficacy that keeps it going.",
    sources: [
      "Calderone et al. (2024) — meditation and cortical thickness/connectivity",
      "Lazar et al. (2005) — cortical thickening from meditation",
      "Davidson (Center for Healthy Minds) — contemplative neuroplasticity",
      "Bandura (1977) — mastery experience and self-efficacy",
    ],
  },
];

/** Lookup one entry by id, or null. */
export function getScienceEntry(id) {
  if (!id || typeof id !== "string") return null;
  return SCIENCE_ENTRIES.find((e) => e.id === id) || null;
}
