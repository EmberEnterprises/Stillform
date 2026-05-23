/**
 * erq.js — Emotion Regulation instrument (Workshop instrument #4).
 * Bias Profile build, Step 5f. Capacities surface — "Settle".
 *
 * Pure module (definition + pure score), following the capacity-result
 * contract SRIS established. Two INDEPENDENT strategies, read separately —
 * there is NO total score (spec §2):
 *   - Cognitive Reappraisal (CR): reinterpreting a situation to change how it
 *     lands. This is exactly what Reframe does — ERQ reads how habitually the
 *     user already runs Stillform's core move. The headline read.
 *   - Expressive Suppression (ES): keeping a feeling from showing. The thing
 *     Stillform explicitly is NOT. Named honestly (it has real costs) but
 *     WITHOUT moralizing — the user may have good reasons in context (spec §3).
 *
 * Spec: STILLFORM_WORKSHOP_ERQ_SPEC.md (locked May 20, 2026).
 * Source: ERQ (Gross & John 2003). Items are ORIGINAL Stillform-voiced
 * adaptations faithful to each construct — the verbatim ERQ items are NOT
 * reproduced.
 *
 * Feeds the CAPACITIES mirror (capacitiesProfile.js), capacity "settle".
 * Produces NO watch-list chip.
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

export const FACTORS = Object.freeze({
  CR: Object.freeze({ id: "CR", label: "Reframing", name: "Cognitive Reappraisal" }),
  ES: Object.freeze({ id: "ES", label: "Holding in", name: "Expressive Suppression" }),
});

// 10 items, interleaved (spec §4). CR = the move Reframe trains; ES = holding in.
const ITEMS = Object.freeze([
  Object.freeze({ id: "cr1", factor: "CR", text: "When something's getting to me, I change how I think about it to change how it feels." }),
  Object.freeze({ id: "cr2", factor: "CR", text: "I handle stress by finding a different way to see the situation." }),
  Object.freeze({ id: "es1", factor: "ES", text: "I keep my emotions to myself." }),
  Object.freeze({ id: "cr3", factor: "CR", text: "When I want to feel less of a hard emotion, I rethink what's actually going on." }),
  Object.freeze({ id: "cr4", factor: "CR", text: "I can shift my feeling about something by shifting my read of it." }),
  Object.freeze({ id: "es2", factor: "ES", text: "When I'm feeling something strong, I make sure it doesn't show." }),
  Object.freeze({ id: "cr5", factor: "CR", text: "When I want to feel more of a good emotion, I think about the situation in a way that brings it up." }),
  Object.freeze({ id: "es3", factor: "ES", text: "I control my feelings by not expressing them." }),
  Object.freeze({ id: "cr6", factor: "CR", text: "Reframing a situation is something I do to manage how I feel about it." }),
  Object.freeze({ id: "es4", factor: "ES", text: "I hold back what I'm feeling around other people." }),
]);

export const ERQ = Object.freeze({
  id: "erq",
  surface: "capacities",
  capacityId: "settle",
  name: "How You Settle",
  subtitle: "The move you reach for when a feeling shows up",
  estMinutes: 3,
  responseModel: "capacity-likert-4",
  response: RESPONSE,
  intro:
    "This looks at how you already handle a feeling when it shows up — the move you reach for. There are two here. One is reinterpreting the situation so it hits differently; the other is keeping the feeling from showing. No right answer, no score — just where each sits for you. About 3 minutes.",
  factors: FACTORS,
  items: ITEMS,
});

// ---------------------------------------------------------------------------
// Result copy (spec §5). Reappraisal is the headline read (it maps to the
// practice). Suppression is a secondary, honest, non-moralizing note.
// ---------------------------------------------------------------------------

export const REAPPRAISAL_READING = Object.freeze({
  high: Object.freeze({
    key: "reappraisal_high",
    title: "Your reframing muscle is strong",
    body: "You already do the core move Stillform trains — you change the read to change the feeling. That's the reappraisal muscle, and it's strong. The practice sharpens what's already there.",
  }),
  low: Object.freeze({
    key: "reappraisal_low",
    title: "The lever the practice builds",
    body: "Reinterpreting a situation to shift how it lands isn't a move you reach for much yet — which makes it the most direct thing the practice builds. Reframe is this skill, rep by rep.",
  }),
});

export const SUPPRESSION_NOTE = Object.freeze({
  high: Object.freeze({
    title: "On holding it in",
    body: "You tend to hold feelings in rather than let them show. That's a real strategy with real costs over time — and it's worth knowing it's your default. Stillform doesn't ask you to perform feeling; it builds the other lever, so holding-in isn't the only option you've got.",
  }),
  low: Object.freeze({
    title: "On holding it in",
    body: "Holding feelings in isn't much of a default for you — worth knowing, nothing more.",
  }),
});

export const LEVEL_THRESHOLD = 1.5;

/** @returns {"high"|"low"} from a 0–3 factor mean. */
export function levelFor(mean) {
  return Number(mean) >= LEVEL_THRESHOLD ? "high" : "low";
}

function factorMean(responses, factorId) {
  const vals = ITEMS.filter((it) => it.factor === factorId)
    .map((it) => responses[it.id])
    .filter((v) => v != null)
    .map((v) => Number(v));
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

/**
 * Score a completed take. Pure. Satisfies the capacity-result contract
 * (reading + notes + facets + aiSteer). The two strategies are independent —
 * reappraisal is the headline reading; suppression is a secondary note.
 *
 * @param {Object<string, number>} responses  itemId -> 0..3
 */
export function score(responses = {}) {
  const crLevel = levelFor(factorMean(responses, "CR"));
  const esLevel = levelFor(factorMean(responses, "ES"));

  const reading = REAPPRAISAL_READING[crLevel];
  const suppression = SUPPRESSION_NOTE[esLevel];

  // Internal-only steer (spec §5/§6): low spontaneous reappraisal steers the AI
  // toward generating reinterpretations with the user. Never surfaced.
  const aiSteer = crLevel === "low" ? "low-spontaneous-reappraisal" : null;

  return {
    instrumentId: "erq",
    surface: "capacities",
    capacityId: "settle",
    reading: { key: reading.key, title: reading.title, body: reading.body },
    notes: [{ title: suppression.title, body: suppression.body }],
    facets: [
      { id: "CR", label: FACTORS.CR.label, level: crLevel },
      { id: "ES", label: FACTORS.ES.label, level: esLevel },
    ],
    aiSteer,
  };
}

export default ERQ;
