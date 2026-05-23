/**
 * iri.js — Interpersonal Reactivity instrument (Workshop instrument #6).
 * Bias Profile build, Step 5h. Capacities surface — "See others".
 *
 * Pure module (definition + pure score), capacity-result contract. Completes
 * the philosophy loop: Sense (MAIA-2) → Settle (ERQ) → See yourself (SRIS) →
 * See others (IRI). 16 items, 4 per subscale across 4 subscales. Capacity
 * `see-others`; feeds the growth mirror, not a chip.
 *
 * THE DEFINING RULE (spec §5/§8): per-subscale frames, NO total / NO average.
 * The build must not collapse IRI into one "empathy score." Each subscale gets
 * the frame its construct demands:
 *   - Perspective Taking → capacity (the tracked "see others" marker; the
 *     adaptive INVERSE of the mind-reading / "filling in the why" chip). Lead read.
 *   - Empathic Concern → capacity (strength where present; low = room to grow,
 *     NEVER coldness-as-deficit).
 *   - Personal Distress → nuanced / regulation-adjacent. High is NOT "more
 *     empathy" — it's getting swept up, which routes to the Settle layer. NEVER
 *     framed as "too much heart" or a flaw in caring.
 *   - Fantasy → value-neutral profile (just a trait; no better/worse — a
 *     preview of DOSPERT's profile frame).
 *
 * Mapping to the contract: PT is the headline `reading` (the tracked growth
 * marker); EC / PD / Fantasy are each their own framed `note`. Four distinct
 * frames, nothing averaged.
 *
 * Spec: STILLFORM_WORKSHOP_IRI_SPEC.md (locked May 20, 2026).
 * Source: IRI (Davis 1980, 1983). Items are ORIGINAL Stillform-voiced
 * adaptations faithful to each subscale — verbatim IRI items NOT reproduced.
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

export const SUBSCALES = Object.freeze({
  PT: Object.freeze({ id: "PT", label: "Perspective Taking", kind: "capacity" }),
  EC: Object.freeze({ id: "EC", label: "Empathic Concern", kind: "capacity" }),
  FS: Object.freeze({ id: "FS", label: "Fantasy", kind: "profile" }),
  PD: Object.freeze({ id: "PD", label: "Personal Distress", kind: "regulation-adjacent" }),
});

// 16 items, interleaved round-robin (PT, EC, FS, PD repeating) so no two
// same-subscale items sit adjacent.
const ITEMS = Object.freeze([
  Object.freeze({ id: "pt1", subscale: "PT", text: "I try to see things from the other person's side before I land on a judgment." }),
  Object.freeze({ id: "ec1", subscale: "EC", text: "I feel for people who are having a hard time." }),
  Object.freeze({ id: "fs1", subscale: "FS", text: "I get pulled into the feelings of characters in a story or film." }),
  Object.freeze({ id: "pd1", subscale: "PD", text: "When someone near me is upset, I get rattled myself." }),

  Object.freeze({ id: "pt2", subscale: "PT", text: "When someone disagrees with me, I try to picture how it looks from where they sit." }),
  Object.freeze({ id: "ec2", subscale: "EC", text: "Someone else's struggle moves me." }),
  Object.freeze({ id: "fs2", subscale: "FS", text: "I imagine myself in the place of people I'm reading about or watching." }),
  Object.freeze({ id: "pd2", subscale: "PD", text: "Being in a tense emotional situation throws me off." }),

  Object.freeze({ id: "pt3", subscale: "PT", text: "I can usually understand why someone did what they did, even when I don't agree." }),
  Object.freeze({ id: "ec3", subscale: "EC", text: "When someone's hurting, I'm drawn to care rather than turn away." }),
  Object.freeze({ id: "fs3", subscale: "FS", text: "A good story can put me right inside someone else's experience." }),
  Object.freeze({ id: "pd3", subscale: "PD", text: "Other people's strong emotions can swamp me." }),

  Object.freeze({ id: "pt4", subscale: "PT", text: "Before I decide what someone meant, I consider that there might be more than one read." }),
  Object.freeze({ id: "ec4", subscale: "EC", text: "I notice and feel the weight of what others are going through." }),
  Object.freeze({ id: "fs4", subscale: "FS", text: "I get absorbed in the inner lives of characters." }),
  Object.freeze({ id: "pd4", subscale: "PD", text: "When things get emotionally intense around me, I struggle to stay steady." }),
]);

export const IRI = Object.freeze({
  id: "iri",
  surface: "capacities",
  capacityId: "see-others",
  name: "Seeing Others",
  subtitle: "The outward half of seeing clearly — how you read and respond to other people",
  estMinutes: 3,
  responseModel: "capacity-likert-4",
  response: RESPONSE,
  intro:
    "This looks at how you read and respond to other people — the outward half of seeing clearly. How easily you step into someone else's view, how much you feel with them, and whether that feeling stays steady or sweeps you up. No right answer; just where each sits for you. About 3 minutes.",
  subscales: SUBSCALES,
  items: ITEMS,
});

// ---------------------------------------------------------------------------
// Result copy (spec §5). PT is the lead reading; EC / PD / Fantasy are notes,
// each in its own frame. No averaging across the four.
// ---------------------------------------------------------------------------

export const PT_READING = Object.freeze({
  high: Object.freeze({
    key: "pt_high",
    title: "You step into other viewpoints readily",
    body: "How readily you step into someone else's view before landing on a judgment — this is the outward edge of the practice, and the exact opposite of filling in the why with no data. It's a real foundation for letting people in, and it's already there.",
  }),
  low: Object.freeze({
    key: "pt_low",
    title: "The outward edge to grow",
    body: "Stepping into someone else's view before deciding what they meant isn't a move you reach for much yet — which makes it the most direct place the outward work grows. It's the exact inverse of filling in the why with no data: the practice builds the habit of checking the read instead of guessing it.",
  }),
});

export const EC_NOTE = Object.freeze({
  high: Object.freeze({
    title: "Feeling with people",
    body: "You feel for people having a hard time and are drawn to care rather than turn away. That's a real strength — and a foundation the rest of the outward work builds on.",
  }),
  low: Object.freeze({
    title: "Feeling with people",
    body: "Feeling the weight of what others carry isn't where your attention lands most readily yet. That's room to grow, not coldness — it builds alongside the perspective work, at its own pace.",
  }),
});

export const PD_NOTE = Object.freeze({
  high: Object.freeze({
    title: "When it gets intense",
    body: "When others are in distress, you tend to get swept up rather than stay steady. That's not too much heart — it's the feeling-with outrunning your footing. The regulation work (Settle) is exactly what lets you stay with someone without drowning in it.",
  }),
  low: Object.freeze({
    title: "When it gets intense",
    body: "When emotions run high around you, you tend to keep your footing rather than get pulled under — steady enough to stay with someone without losing yourself in it.",
  }),
});

export const FS_NOTE = Object.freeze({
  high: Object.freeze({
    title: "Stories and other minds",
    body: "You get pulled right inside the inner lives of characters in a story or film. That's just how you're wired toward other minds — no better or worse. Noted, not graded.",
  }),
  low: Object.freeze({
    title: "Stories and other minds",
    body: "Stories and characters don't tend to pull you all the way in — which is simply how you're wired, no better or worse. Noted, not graded.",
  }),
});

export const LEVEL_THRESHOLD = 1.5;

/** @returns {"high"|"low"} from a 0–3 subscale mean. */
export function levelFor(mean) {
  return Number(mean) >= LEVEL_THRESHOLD ? "high" : "low";
}

function subscaleMean(responses, subscaleId) {
  const vals = ITEMS.filter((it) => it.subscale === subscaleId)
    .map((it) => responses[it.id])
    .filter((v) => v != null)
    .map((v) => Number(v));
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

/**
 * Score a completed take. Pure. Capacity-result contract with per-subscale
 * frames (NOT averaged): PT is the lead reading; EC / PD / Fantasy are notes.
 * All four subscale levels are recorded in facets for the mirror + AI.
 *
 * @param {Object<string, number>} responses  itemId -> 0..3
 */
export function score(responses = {}) {
  const ptLevel = levelFor(subscaleMean(responses, "PT"));
  const ecLevel = levelFor(subscaleMean(responses, "EC"));
  const fsLevel = levelFor(subscaleMean(responses, "FS"));
  const pdLevel = levelFor(subscaleMean(responses, "PD"));

  const reading = PT_READING[ptLevel];

  // EC (capacity) → PD (regulation-adjacent) → Fantasy (value-neutral profile).
  const notes = [EC_NOTE[ecLevel], PD_NOTE[pdLevel], FS_NOTE[fsLevel]].map((n) => ({
    title: n.title,
    body: n.body,
  }));

  const facets = [
    { id: "PT", label: SUBSCALES.PT.label, level: ptLevel },
    { id: "EC", label: SUBSCALES.EC.label, level: ecLevel },
    { id: "FS", label: SUBSCALES.FS.label, level: fsLevel },
    { id: "PD", label: SUBSCALES.PD.label, level: pdLevel },
  ];

  // Internal-only steer (spec §6 push signatures): low PT = the mind-reading
  // signature (the chip's inverse); high PD = the swamped signature → Settle.
  // PT-low prioritized; both levels also live in facets for reframe.js.
  const aiSteer =
    ptLevel === "low" ? "low-perspective-taking" : pdLevel === "high" ? "high-personal-distress" : null;

  return {
    instrumentId: "iri",
    surface: "capacities",
    capacityId: "see-others",
    reading: { key: reading.key, title: reading.title, body: reading.body },
    notes,
    facets,
    aiSteer,
  };
}

export default IRI;
