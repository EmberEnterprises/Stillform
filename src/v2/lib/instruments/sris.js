/**
 * sris.js — Self-Reflection & Insight instrument (Workshop instrument #3).
 * Bias Profile build, Step 5d. The FIRST capacities-surface instrument.
 *
 * THIS MODULE DEFINES THE CAPACITY-RESULT CONTRACT — the way cdquest.js
 * defined the pattern-work contract. Pure: the definition + a pure
 * score(responses). No persistence, no React. The runner imports this,
 * renders it, and (on completion) writes the result to the capacities mirror
 * via capacitiesProfile.recordInstrumentResult. ERQ / MAIA-2 / IRI follow the
 * { reading, facets, aiSteer } shape this establishes.
 *
 * Spec: STILLFORM_WORKSHOP_SRIS_SPEC.md (locked May 20, 2026).
 * Source: SRIS (Grant, Franklin & Langford 2002). Items here are ORIGINAL
 * Stillform-voiced adaptations faithful to each factor's construct — the
 * verbatim SRIS items are NOT reproduced. Fidelity is to the construct.
 *
 * Feeds the CAPACITIES mirror (capacitiesProfile.js), capacity "see-self".
 * Produces NO watch-list chip. The two factors — Self-Reflection and Insight —
 * are read as a RELATIONSHIP, never two standalone scores, never a number:
 * reflection that loops is rumination; reflection that lands is insight, and
 * the conversion is the skill the practice trains (spec §6).
 */

// ---------------------------------------------------------------------------
// Response model — four-point capacity self-report (the locked capacities
// shape). Single rating per item; no reverse-keyed items in this adaptation.
// ---------------------------------------------------------------------------

export const RESPONSE = Object.freeze({
  prompt: "Where does this sit for you?",
  options: Object.freeze([
    Object.freeze({ value: 0, label: "Rarely true" }),
    Object.freeze({ value: 1, label: "Sometimes" }),
    Object.freeze({ value: 2, label: "Often" }),
    Object.freeze({ value: 3, label: "Almost always true" }),
  ]),
});

// ---------------------------------------------------------------------------
// The two factors. Read TOGETHER — the relationship is the signal (spec §6).
// ---------------------------------------------------------------------------

export const FACTORS = Object.freeze({
  SR: Object.freeze({ id: "SR", label: "Reflection", name: "Self-Reflection" }),
  IN: Object.freeze({ id: "IN", label: "Insight", name: "Insight" }),
});

// ---------------------------------------------------------------------------
// The 20 items, interleaved for production (spec §4). Each carries its factor
// tag so scoring is order-independent. Texts are Stillform-voiced adaptations.
// ---------------------------------------------------------------------------

const ITEMS = Object.freeze([
  Object.freeze({ id: "sr1", factor: "SR", text: "I spend time looking at why I feel the way I do." }),
  Object.freeze({ id: "sr2", factor: "SR", text: "When something affects me, I go back over it to understand what happened." }),
  Object.freeze({ id: "in1", factor: "IN", text: "I usually understand why I feel the way I do." }),
  Object.freeze({ id: "sr3", factor: "SR", text: "I'm the kind of person who examines my own reactions." }),
  Object.freeze({ id: "in2", factor: "IN", text: "I have a clear sense of what drives my behavior." }),
  Object.freeze({ id: "sr4", factor: "SR", text: "I notice myself thinking about my own thinking." }),
  Object.freeze({ id: "sr5", factor: "SR", text: "I make a point of understanding my own behavior, not just acting." }),
  Object.freeze({ id: "in3", factor: "IN", text: "When I reflect, I tend to actually arrive somewhere — not just circle." }),
  Object.freeze({ id: "sr6", factor: "SR", text: "When I'm off, I try to work out what's underneath it." }),
  Object.freeze({ id: "in4", factor: "IN", text: "I can usually name what's going on inside me." }),
  Object.freeze({ id: "sr7", factor: "SR", text: "I'm curious about why I do what I do." }),
  Object.freeze({ id: "sr8", factor: "SR", text: "I take time to reflect on my choices after I make them." }),
  Object.freeze({ id: "in5", factor: "IN", text: "My reasons for acting are clear to me most of the time." }),
  Object.freeze({ id: "sr9", factor: "SR", text: "I pay attention to the patterns in how I respond to things." }),
  Object.freeze({ id: "in6", factor: "IN", text: "When I'm upset, I can usually figure out what it's really about." }),
  Object.freeze({ id: "sr10", factor: "SR", text: "I think about how my feelings connect to what I do." }),
  Object.freeze({ id: "sr11", factor: "SR", text: "I question my own assumptions about myself." }),
  Object.freeze({ id: "in7", factor: "IN", text: "I tend to come away from thinking-it-over with more clarity, not less." }),
  Object.freeze({ id: "sr12", factor: "SR", text: "Examining myself is something I do on my own, not only when something's wrong." }),
  Object.freeze({ id: "in8", factor: "IN", text: "I trust my read on my own inner state." }),
]);

export const SRIS = Object.freeze({
  id: "sris",
  surface: "capacities",
  capacityId: "see-self",
  name: "Seeing Yourself",
  subtitle: "How clearly you see your own mind — and whether the looking lands",
  estMinutes: 5,
  responseModel: "capacity-likert-4",
  response: RESPONSE,
  intro:
    "This is a look at the skill underneath everything else here: how you watch your own mind, and how clearly that watching pays off. Two halves — how much you turn things over, and how much that turning-over actually resolves into understanding. There's no good score; this is a starting line, not a grade. Mark where each sits for you. About 5 minutes.",
  factors: FACTORS,
  items: ITEMS,
});

// ---------------------------------------------------------------------------
// The four readings (spec §5) — from the SR × Insight RELATIONSHIP, not from
// either factor alone. The looping reading (reflect-high + insight-low) is the
// one SRIS exists to catch. No scores, no value judgment; every reading has a
// path forward (here, the practice itself is the converter).
// ---------------------------------------------------------------------------

export const READINGS = Object.freeze({
  generative: Object.freeze({
    key: "generative",
    title: "Generative self-awareness",
    body: "You turn things over, and the turning-over lands somewhere. That's the engine of this whole practice already running — Stillform sharpens it.",
  }),
  looping: Object.freeze({
    key: "looping",
    title: "The looping signal",
    body: "You examine yourself a lot, but it doesn't always resolve — the reflection circles instead of clarifying. That's not a flaw; it's the exact gap the practice closes. Reflection that loops is rumination; reflection that lands is insight, and the conversion is the whole job.",
  }),
  reflect_low_insight_high: Object.freeze({
    key: "reflect_low_insight_high",
    title: "Clear when you look",
    body: "You don't spend much time examining your mind, but when you do, it's clear. The room to grow is in the looking, not the understanding.",
  }),
  both_low: Object.freeze({
    key: "both_low",
    title: "Room to build",
    body: "This is a skill you haven't built much yet — which means it's the most direct place the practice pays off. Everything else here trains it.",
  }),
});

// Internal high/low cut on the 0–3 scale. NEVER shown. The spec (§10) defers
// the final threshold to testing, so this midpoint is a tunable default:
// ≥ 1.5 leans toward "Often / Almost always," below it toward "Rarely / Sometimes."
export const LEVEL_THRESHOLD = 1.5;

/** @returns {"high"|"low"} from a 0–3 factor mean. */
export function levelFor(mean) {
  return Number(mean) >= LEVEL_THRESHOLD ? "high" : "low";
}

/** Map the two factor levels to one of the four readings. */
export function readingFor(srLevel, inLevel) {
  if (srLevel === "high" && inLevel === "high") return READINGS.generative;
  if (srLevel === "high" && inLevel === "low") return READINGS.looping;
  if (srLevel === "low" && inLevel === "high") return READINGS.reflect_low_insight_high;
  return READINGS.both_low;
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
 * Score a completed take. Pure. This return shape is the CAPACITY-RESULT
 * CONTRACT that ERQ / MAIA-2 / IRI also satisfy.
 *
 * @param {Object<string, number>} responses  itemId -> 0..3
 * @returns {{
 *   instrumentId: "sris",
 *   surface: "capacities",
 *   capacityId: "see-self",
 *   reading: { key:string, title:string, body:string },  // the relationship-level read
 *   facets: Array<{ id:string, label:string, level:"high"|"low" }>, // "where each sits", qualitative
 *   aiSteer: ?string   // internal-only Reframe steer; never shown
 * }}
 */
export function score(responses = {}) {
  const srLevel = levelFor(factorMean(responses, "SR"));
  const inLevel = levelFor(factorMean(responses, "IN"));
  const reading = readingFor(srLevel, inLevel);

  // Internal-only steer for reframe.js (spec §5/§6): the looping signature
  // steers toward insight-closing / prediction-error prompts. Never surfaced.
  const aiSteer = reading.key === "looping" ? "reflects-without-resolving" : null;

  return {
    instrumentId: "sris",
    surface: "capacities",
    capacityId: "see-self",
    reading: { key: reading.key, title: reading.title, body: reading.body },
    facets: [
      { id: "SR", label: FACTORS.SR.label, level: srLevel },
      { id: "IN", label: FACTORS.IN.label, level: inLevel },
    ],
    aiSteer,
  };
}

export default SRIS;
