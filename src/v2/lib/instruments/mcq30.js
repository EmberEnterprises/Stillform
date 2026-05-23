/**
 * mcq30.js — Metacognitive Beliefs instrument (Workshop instrument #1).
 * Bias Profile build, Step 5i. PATTERN-WORK surface (proposes chips, like
 * CD-Quest) — NOT capacities, NOT profile.
 *
 * Pure module (definition + pure score). Measures the beliefs a person holds
 * ABOUT their own thinking — the layer Stillform's practice operates on. Five
 * subscales of six items:
 *   - POS  Positive Beliefs about Worry      → chip m_pos  (Worry-as-engine)
 *   - NEG  Negative Beliefs (uncontrollable/dangerous) → m_neg (Mind-as-mercy)
 *   - CC   Cognitive Confidence (self-distrust)        → m_cc  (Memory-distrust)
 *   - NC   Need to Control Thoughts                    → m_nc  (Mind-as-discipline)
 *   - CSC  Cognitive Self-Consciousness — REFORMULATED (spec §6): not "do you
 *          monitor your thinking" (Stillform's whole practice is yes) but
 *          "when you observe it, does it move toward STRUCTURE or LOOP BACK."
 *          CSC is a QUALITY READ (rumination vs generative metacognition),
 *          surfaced as a note — it does NOT propose a chip (spec §5).
 *
 * The four belief subscales use a 4-point ENDORSEMENT scale; CSC uses a
 * categorical DIRECTION scale (handled via per-item options). A belief subscale
 * is endorsed when ≥4 of its 6 items ring true or sometimes (spec §5); an
 * endorsed subscale proposes its chip for the watch list (user confirms — AI
 * never adds without consent). No scores, no numbers, no prevalence (§3).
 *
 * Spec: STILLFORM_WORKSHOP_MCQ30_SPEC.md (locked May 20, 2026).
 * Source: MCQ-30 (Wells & Cartwright-Hatton 2004). Items are ORIGINAL
 * Stillform-voiced adaptations faithful to each construct — the copyrighted
 * MCQ-30 items are NOT reproduced.
 */

// Belief subscales (POS/NEG/CC/NC): 4-point endorsement. ≥2 counts as endorsed.
export const BELIEF_OPTIONS = Object.freeze([
  Object.freeze({ value: 3, label: "Rings true" }),
  Object.freeze({ value: 2, label: "Sometimes" }),
  Object.freeze({ value: 1, label: "Not really" }),
  Object.freeze({ value: 0, label: "Haven't noticed" }),
]);

// CSC: categorical direction (NOT an endorsement scale). Quality read only.
export const CSC_OPTIONS = Object.freeze([
  Object.freeze({ value: "structure", label: "Toward structure" }),
  Object.freeze({ value: "loop", label: "Loops back" }),
  Object.freeze({ value: "both", label: "Both, depending" }),
  Object.freeze({ value: "none", label: "Haven't noticed" }),
]);

export const SUBSCALES = Object.freeze({
  POS: Object.freeze({ id: "POS", chip: "m_pos", name: "Worry-as-engine" }),
  NEG: Object.freeze({ id: "NEG", chip: "m_neg", name: "Mind-as-mercy" }),
  CC: Object.freeze({ id: "CC", chip: "m_cc", name: "Memory-distrust" }),
  NC: Object.freeze({ id: "NC", chip: "m_nc", name: "Mind-as-discipline" }),
  CSC: Object.freeze({ id: "CSC", chip: null, name: "Inward-attention quality" }),
});

// Per-subscale item text, in spec order (§4). Assembled into interleaved
// production order below.
const BY_SUBSCALE = {
  POS: [
    "Turning something over in my head before it happens helps me avoid problems later.",
    "When something is hard, mental rehearsal helps me cope with it.",
    "I need a level of worry running to perform at my best.",
    "Turning something over in my head is how I sort it out — without that, I can't think clearly.",
    "If I stopped worrying about things that matter, I'd be careless or something would slip.",
    "The thinking I do under pressure is what produces the answer — without the pressure, I'd miss the solution.",
  ],
  NEG: [
    "Once my mind starts running on something, I can't switch it off — it keeps going on its own.",
    "When the thinking won't quiet down, I sense it's costing me my clarity or my edge.",
    "When I've been turning something over for a while, I notice it in my body — tension that won't release, sleep that won't come.",
    "Even when I try to redirect my attention, the thinking pulls me back in. The control isn't mine.",
    "Some part of me worries that if the thinking keeps going at this pace, something in me is going to give.",
    "Once a thought is in my system, I can't just set it aside. It stays running whether I want it there or not.",
  ],
  CC: [
    "When I try to remember something important — a detail, a number, what was said — I don't fully trust what comes back.",
    "When I try to reconstruct what happened — who said what, in what order — I'm not sure my memory has it right.",
    "I sometimes question whether I actually did something I think I did — sent the message, locked the door, said the words.",
    "I check things twice because part of me doesn't trust that I got it right the first time.",
    "My attention slips and I lose track of what I was paying attention to — and I don't fully trust my read on what I noticed and what I missed.",
    "When my mind tells me something — a recollection, a sense of what's happening — I don't take it at face value. I check against something else.",
  ],
  NC: [
    "A disciplined mind doesn't let thoughts drift wherever they want — control should be steady.",
    "Some thoughts shouldn't be allowed to come up in the first place — they're evidence I'm slipping somewhere.",
    "When my thinking goes where I don't want it to, that's on me. I should be able to hold the line.",
    "I'd be more capable if I had tighter control over what runs through my mind.",
    "Certain kinds of thinking don't belong in someone serious. When they show up, something's off.",
    "If I couldn't manage what my mind is doing, I wouldn't be able to do what I need to do.",
  ],
  // CSC stems — completed by the CSC_OPTIONS direction choice. No prompt label
  // (the stem already trails into the options).
  CSC: [
    "When I observe my thinking running on something hard, the observation tends to move…",
    "When I catch myself watching my own thoughts, the watching usually goes…",
    "After I've been paying attention to my own mental patterns for a while, what I have is what comes from going…",
    "When something is bothering me and I turn inward to look at how I'm processing it, the looking goes…",
    "When I'm aware of my thinking, the awareness tends to move…",
    "Looking at my mental patterns over time, my self-observation seems to go…",
  ],
};

// Interleave round-robin (spec §4: items interleave across subscales so a
// subscale's theme can't be gamed). Order per round: POS, NEG, CC, NC, CSC.
const ORDER = ["POS", "NEG", "CC", "NC", "CSC"];
const ITEMS = Object.freeze(
  Array.from({ length: 6 }).flatMap((_, i) =>
    ORDER.map((sub) => {
      const id = `${sub.toLowerCase()}${i + 1}`;
      const base = { id, subscale: sub, text: BY_SUBSCALE[sub][i] };
      // CSC items carry their own categorical options + no prompt label.
      return Object.freeze(
        sub === "CSC" ? { ...base, options: CSC_OPTIONS, prompt: "" } : base
      );
    })
  )
);

export const MCQ30 = Object.freeze({
  id: "mcq30",
  surface: "pattern-work",
  name: "Beneath Your Thinking",
  subtitle: "The beliefs that run beneath your thinking — how you relate to your own mind",
  estMinutes: 8,
  finishLabel: "See what's running",
  responseModel: "single-select-4",
  // Default response (belief subscales). CSC items override via item.options.
  response: Object.freeze({ prompt: "Where does this sit for you?", options: BELIEF_OPTIONS }),
  intro:
    "This is a closer look at the beliefs that run beneath your thinking — not what you think, but how you relate to your own mind. The patterns named here come from a well-studied model of how thinking works. No scores, no right answers, no judgment. Read each statement; mark where it sits for you. About 5–10 minutes.",
  subscales: SUBSCALES,
  items: ITEMS,
  // Belief-inventory framing for the pattern-work result (CD-Quest's weekly
  // "shapes your thinking took this week" copy is wrong for a beliefs tool).
  resultCopy: Object.freeze({
    headline: "What showed up",
    body: "No scores, no verdict — just the beliefs that showed up running beneath your thinking, and what you can do with each. Add the ones that ring true to your watch list; leave the rest.",
    sectionLabel: "Running beneath",
    nothing:
      "None of these beliefs ran with much grip in your responses. This isn't a clean bill — it just reports what's running, and right now it's quiet. Re-take anytime; these patterns can shift.",
  }),
});

// ---------------------------------------------------------------------------
// CSC quality read (spec §5/§6). Generative metacognition vs rumination —
// never framed as a dysfunction; the looping read points to the practice.
// ---------------------------------------------------------------------------

export const CSC_READ = Object.freeze({
  loop: Object.freeze({
    title: "When you look inward, it tends to loop",
    body: "When you observe your own thinking, the observation tends to loop back on itself rather than resolve. That's the line between rumination — looping without resolution — and generative metacognition. The practice is the work that converts looping into structure; that's what Reframe is for.",
  }),
  structure: Object.freeze({
    title: "Your self-observation moves toward structure",
    body: "When you observe your own thinking, it tends to move toward naming and structure rather than looping back. That's generative metacognition — already the direction the practice is built to deepen.",
  }),
  varies: Object.freeze({
    title: "It goes both ways",
    body: "When you observe your own thinking, sometimes it moves toward structure and sometimes it loops back, depending. The practice is what tips more of it toward structure — turning looping into something named and usable.",
  }),
});

const BELIEF_SUBS = ["POS", "NEG", "CC", "NC"];
export const ENDORSE_MIN = 4; // ≥4 of 6 ring-true-or-sometimes (spec §5)
const ENDORSE_VALUE = 2; // value ≥ 2 = "Rings true"(3) or "Sometimes"(2)

function itemsOf(subId) {
  return ITEMS.filter((it) => it.subscale === subId);
}

/** A belief subscale is endorsed when ≥ENDORSE_MIN of its items ring-true/sometimes. */
function subscaleEndorsed(responses, subId) {
  const count = itemsOf(subId).filter((it) => {
    const v = responses[it.id];
    return v != null && Number(v) >= ENDORSE_VALUE;
  }).length;
  return count >= ENDORSE_MIN;
}

/** CSC direction from the categorical tallies. Ties / "both"-dominant → varies. */
function cscDirection(responses) {
  const tally = { structure: 0, loop: 0, both: 0 };
  itemsOf("CSC").forEach((it) => {
    const v = responses[it.id];
    if (v === "structure" || v === "loop" || v === "both") tally[v] += 1;
  });
  if (tally.loop > tally.structure && tally.loop > tally.both) return "loop";
  if (tally.structure > tally.loop && tally.structure > tally.both) return "structure";
  return "varies";
}

/**
 * Score a completed take. Pure. Pattern-work shape (mirrors cdquest.js) plus a
 * CSC quality note:
 *   { instrumentId, surface:"pattern-work", proposedChips:[chipId...], notes:[CSC read] }
 * proposedChips = endorsed belief subscales' chips (CSC never proposes a chip).
 *
 * @param {Object<string, number|string>} responses  itemId -> value
 */
export function score(responses = {}) {
  const proposedChips = BELIEF_SUBS.filter((s) => subscaleEndorsed(responses, s)).map(
    (s) => SUBSCALES[s].chip
  );

  const csc = CSC_READ[cscDirection(responses)];

  return {
    instrumentId: "mcq30",
    surface: "pattern-work",
    proposedChips,
    lightChips: [],
    notes: [{ title: csc.title, body: csc.body }],
  };
}

export default MCQ30;
