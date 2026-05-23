/**
 * maia2.js — Interoceptive Awareness instrument (Workshop instrument #5).
 * Bias Profile build, Step 5g. Capacities surface — "Sense" (interoception).
 *
 * Pure module (definition + pure score), capacity-result contract.
 * Brief MAIA-2 base: 24 items, 3 per subscale across 8 subscales. Capacity
 * `sense`; feeds the growth mirror, not a chip.
 *
 * GUARDS (non-negotiable, per spec §3/§5/§8):
 *   - Trauma-sensitivity: interoceptive attention can be activating for trauma
 *     histories. The intro carries an explicit escape hatch ("you can stop"),
 *     and pacing is gentle (one item per screen — the runner default). The take
 *     never pushes deeper body-attention than the user offers.
 *   - Not-Distracting / Not-Worrying are NOT higher-is-better. They are the
 *     adaptive construct: staying with a sensation without suppressing it OR
 *     spiraling about it. Framed that way, never "more = better."
 *   - Trusting handled with extra care: low Trusting (body doesn't feel safe)
 *     is NEVER a failing — named gently as a place the slow body work helps.
 *   - State vs trait: the result distinguishes "how you read your body in
 *     general" (this) from "what your body's doing right now" (the bio-filter).
 *
 * Spec: STILLFORM_WORKSHOP_MAIA2_SPEC.md (locked May 20, 2026).
 * Source: MAIA-2 (Mehling et al. 2018). Items are ORIGINAL Stillform-voiced
 * adaptations faithful to each subscale — verbatim MAIA-2 items NOT reproduced.
 */

export const RESPONSE = Object.freeze({
  prompt: "Where does this sit for you?",
  options: Object.freeze([
    Object.freeze({ value: 0, label: "Rarely true" }),
    Object.freeze({ value: 1, label: "Sometimes" }),
    Object.freeze({ value: 2, label: "Often" }),
    Object.freeze({ value: 3, label: "Almost always true" }),
  ]),
});

// Eight subscales. `standard` = higher-is-more-capacity (folded into the overall
// Sense read). The two adaptive subscales (not_distracting / not_worrying) are
// excluded from the overall; Trusting IS in the overall (standard) but also
// carries its own note framing (low Trusting is never a failing).
export const SUBSCALES = Object.freeze({
  noticing: Object.freeze({ id: "noticing", label: "Noticing", standard: true }),
  not_distracting: Object.freeze({ id: "not_distracting", label: "Not-Distracting", standard: false }),
  not_worrying: Object.freeze({ id: "not_worrying", label: "Not-Worrying", standard: false }),
  attention: Object.freeze({ id: "attention", label: "Attention Regulation", standard: true }),
  emotional: Object.freeze({ id: "emotional", label: "Emotional Awareness", standard: true }),
  self_reg: Object.freeze({ id: "self_reg", label: "Self-Regulation", standard: true }),
  body_listening: Object.freeze({ id: "body_listening", label: "Body Listening", standard: true }),
  trusting: Object.freeze({ id: "trusting", label: "Trusting", standard: true }),
});

// 24 items, interleaved round-robin so no two same-subscale items sit adjacent.
const ITEMS = Object.freeze([
  Object.freeze({ id: "no1", subscale: "noticing", text: "I notice when something shifts in my body." }),
  Object.freeze({ id: "nd1", subscale: "not_distracting", text: "When something's uncomfortable in my body, I can stay with it rather than instantly distract from it." }),
  Object.freeze({ id: "nw1", subscale: "not_worrying", text: "I can feel discomfort without it turning into worry about what it means." }),
  Object.freeze({ id: "ar1", subscale: "attention", text: "I can keep my attention on a body sensation when I choose to." }),
  Object.freeze({ id: "ea1", subscale: "emotional", text: "I notice how my emotions show up in my body." }),
  Object.freeze({ id: "sg1", subscale: "self_reg", text: "I can calm myself by paying attention to my body." }),
  Object.freeze({ id: "bl1", subscale: "body_listening", text: "I listen to my body for information about what's going on with me." }),
  Object.freeze({ id: "tr1", subscale: "trusting", text: "I feel at home in my body." }),

  Object.freeze({ id: "no2", subscale: "noticing", text: "I'm aware of comfortable sensations, not just uncomfortable ones." }),
  Object.freeze({ id: "nd2", subscale: "not_distracting", text: "I don't always need to drown out a physical discomfort with something else." }),
  Object.freeze({ id: "nw2", subscale: "not_worrying", text: "A physical sensation being unpleasant doesn't automatically alarm me." }),
  Object.freeze({ id: "ar2", subscale: "attention", text: "I can bring my focus back to my body after it drifts." }),
  Object.freeze({ id: "ea2", subscale: "emotional", text: "I can feel where a feeling lives physically." }),
  Object.freeze({ id: "sg2", subscale: "self_reg", text: "When I'm worked up, turning to my breath or body helps me settle." }),
  Object.freeze({ id: "bl2", subscale: "body_listening", text: "My body tells me something useful if I pay attention." }),
  Object.freeze({ id: "tr2", subscale: "trusting", text: "I trust my body's signals." }),

  Object.freeze({ id: "no3", subscale: "noticing", text: "I pick up on subtle signals — a change in my breath, my chest, my stomach." }),
  Object.freeze({ id: "nd3", subscale: "not_distracting", text: "I can let an unpleasant sensation be there without rushing to escape it." }),
  Object.freeze({ id: "nw3", subscale: "not_worrying", text: "I can stay steady when my body feels off, without spiraling about it." }),
  Object.freeze({ id: "ar3", subscale: "attention", text: "I can hold steady attention on my breath." }),
  Object.freeze({ id: "ea3", subscale: "emotional", text: "When my mood shifts, I notice the body change that comes with it." }),
  Object.freeze({ id: "sg3", subscale: "self_reg", text: "I use body awareness to bring myself back to steady." }),
  Object.freeze({ id: "bl3", subscale: "body_listening", text: "I check in with my body to understand how I'm doing." }),
  Object.freeze({ id: "tr3", subscale: "trusting", text: "My body feels like a safe place to be." }),
]);

export const MAIA2 = Object.freeze({
  id: "maia2",
  surface: "capacities",
  capacityId: "sense",
  name: "Reading Your Body",
  subtitle: "How you notice and relate to what's happening inside",
  estMinutes: 4,
  responseModel: "capacity-likert-4",
  response: RESPONSE,
  // Intro carries the trauma-sensitivity escape hatch (spec §3, non-negotiable).
  intro:
    "This looks at how you sense what's happening inside your body — the signals underneath thoughts and feelings, and how you relate to them. There's no right amount; this is the ground floor the rest of the practice is built on. If any of it feels like too much to look at right now, you can stop. About 4 minutes.",
  subscales: SUBSCALES,
  items: ITEMS,
});

// ---------------------------------------------------------------------------
// Result copy (spec §5). Overall = the standard-direction subscales. The two
// adaptive subscales and Trusting carry their own framing as notes. Every read
// leads to the practice; nothing is a failing.
// ---------------------------------------------------------------------------

const STATE_TRAIT = "First — this is about how you read your body in general, not how it happens to feel today. ";

export const OVERALL_READING = Object.freeze({
  high: Object.freeze({
    key: "sense_high",
    title: "Your body sense is a foundation",
    body: STATE_TRAIT +
      "You already pick up your body's signals fairly well — the subtle shifts, where a feeling lives physically, the way attention can settle you. That sensing is the ground floor the rest of the practice builds on, and it's already there.",
  }),
  low: Object.freeze({
    key: "sense_low",
    title: "The ground floor to build",
    body: STATE_TRAIT +
      "Reading your body's signals — the subtle shifts, where a feeling lives physically — isn't something you reach for much yet. That's not a gap so much as the most directly trainable thing in the whole practice: every breath and every body scan builds it.",
  }),
});

export const STAYING_NOTE = Object.freeze({
  high: Object.freeze({
    title: "Staying with a sensation",
    body: "When something's uncomfortable in your body, you can mostly stay with it — without rushing to numb it out, and without it spiraling into worry about what it means. That steady middle is the adaptive version: not feeling more, just not fleeing it or alarming about it.",
  }),
  low: Object.freeze({
    title: "Staying with a sensation",
    body: "When something's uncomfortable in your body, the pull is usually to push it away or to worry about what it means. The practice builds the steady middle — staying with a sensation without suppressing it or spiraling about it. (More body-attention isn't the goal here; that steadiness is.)",
  }),
});

export const TRUSTING_NOTE = Object.freeze({
  high: Object.freeze({
    title: "Feeling at home in your body",
    body: "Your body feels like a fairly safe place to be — and that's a real foundation, since so much of this work happens through the body.",
  }),
  low: Object.freeze({
    title: "Feeling at home in your body",
    body: "Your body doesn't always feel like a safe place to be right now — and that is not a failing of any kind. It's one of the places the slow body work tends to help, gently, over time. No pressure, no rush.",
  }),
});

export const LEVEL_THRESHOLD = 1.5;

/** @returns {"high"|"low"} from a 0–3 mean. */
export function levelFor(mean) {
  return Number(mean) >= LEVEL_THRESHOLD ? "high" : "low";
}

function meanOver(responses, predicate) {
  const vals = ITEMS.filter(predicate)
    .map((it) => responses[it.id])
    .filter((v) => v != null)
    .map((v) => Number(v));
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

const subscaleMean = (responses, subscaleId) =>
  meanOver(responses, (it) => it.subscale === subscaleId);

/**
 * Score a completed take. Pure. Capacity-result contract. The result presents
 * the three distinct framings the spec defines (overall standard read, the
 * adaptive ND/NW pair, Trusting); all 8 subscale levels are recorded in facets
 * for the mirror + AI but not shown as a scorecard.
 *
 * @param {Object<string, number>} responses  itemId -> 0..3
 */
export function score(responses = {}) {
  // Overall = the six standard-direction subscales (excludes the adaptive pair).
  const overallLevel = levelFor(
    meanOver(responses, (it) => SUBSCALES[it.subscale]?.standard)
  );
  const reading = OVERALL_READING[overallLevel];

  // Adaptive pair, read together as the "staying with a sensation" construct.
  const ndnwLevel = levelFor(
    meanOver(responses, (it) => it.subscale === "not_distracting" || it.subscale === "not_worrying")
  );
  const trustingLevel = levelFor(subscaleMean(responses, "trusting"));

  const notes = [STAYING_NOTE[ndnwLevel], TRUSTING_NOTE[trustingLevel]].map((n) => ({
    title: n.title,
    body: n.body,
  }));

  // All 8 subscale levels — internal, recorded for the mirror + AI, not shown.
  const facets = Object.values(SUBSCALES).map((s) => ({
    id: s.id,
    label: s.label,
    level: levelFor(subscaleMean(responses, s.id)),
  }));

  const aiSteer = overallLevel === "low" ? "low-interoceptive-clarity" : null;

  return {
    instrumentId: "maia2",
    surface: "capacities",
    capacityId: "sense",
    reading: { key: reading.key, title: reading.title, body: reading.body },
    notes,
    facets,
    aiSteer,
  };
}

export default MAIA2;
