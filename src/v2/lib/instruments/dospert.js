/**
 * dospert.js — Risk Profile instrument (Workshop instrument #7).
 * Bias Profile build, Step 4a. The PROFILE-surface instrument.
 *
 * THIS MODULE DEFINES THE PROFILE-RESULT CONTRACT — the third and final
 * result frame, the way cdquest.js defined the pattern-work contract and
 * sris.js defined the capacities contract. Pure: the definition + a pure
 * score(responses). No persistence, no React. The runner imports this,
 * renders it, and (on completion) writes the result to the risk-profile
 * store via riskProfile.recordRiskProfile (Step 4b). The standalone profile
 * surface (Step 4d) consumes this shape.
 *
 * Spec: STILLFORM_WORKSHOP_DOSPERT_SPEC.md (locked May 20, 2026).
 * Source: DOSPERT (Weber, Blais & Betz 2002; Blais & Weber 2006). Items here
 * are ORIGINAL Stillform-voiced everyday scenarios faithful to each domain —
 * the verbatim DOSPERT activities are NOT reproduced. Fidelity is to the
 * construct: risk-taking likelihood across five life domains.
 *
 * THE PROFILE FRAME (spec §3/§5) — value-neutral, the discipline is NO
 * prescription at all:
 *   - No "right" level. Neither high nor low risk-taking is a problem, a
 *     capacity to grow, or a deficit. The result is a self-portrait.
 *   - No scores, no prevalence. "Here's your shape," never a number.
 *   - Lead with the SPREAD across domains — the domain-specificity insight
 *     (within-person variation ~7× between-person; risk is NOT a global
 *     trait, spec §2) is the whole point. Never lead with a single domain.
 *   - No domain framed good or bad. High social-risk isn't "brave," low
 *     health-risk isn't "wise" — just you.
 *
 * Feeds the RISK PROFILE store (riskProfile.js), NOT a chip and NOT the
 * capacities growth mirror. Lowest-stakes Workshop output — pure mirror.
 */

// ---------------------------------------------------------------------------
// Response model — four-point likelihood self-report. Uniform across items;
// the stem "How likely are you to…" completes with each item's text.
// ---------------------------------------------------------------------------

export const RESPONSE = Object.freeze({
  prompt: "How likely are you to…",
  options: Object.freeze([
    Object.freeze({ value: 0, label: "Very unlikely" }),
    Object.freeze({ value: 1, label: "Unlikely" }),
    Object.freeze({ value: 2, label: "Likely" }),
    Object.freeze({ value: 3, label: "Very likely" }),
  ]),
});

// ---------------------------------------------------------------------------
// The five life domains. The spread ACROSS these is the read — never any one
// of them alone (spec §5).
// ---------------------------------------------------------------------------

export const DOMAINS = Object.freeze({
  ethical: Object.freeze({ id: "ethical", label: "Ethical" }),
  financial: Object.freeze({ id: "financial", label: "Financial" }),
  health: Object.freeze({ id: "health", label: "Health & safety" }),
  recreational: Object.freeze({ id: "recreational", label: "Recreational" }),
  social: Object.freeze({ id: "social", label: "Social" }),
});

// ---------------------------------------------------------------------------
// The 15 items (spec §4), 3 per domain, interleaved round-robin so no two
// same-domain items sit adjacent. Each carries its domain tag so scoring is
// order-independent. Texts are original Stillform-voiced scenarios.
// ---------------------------------------------------------------------------

const ITEMS = Object.freeze([
  Object.freeze({ id: "eth1", domain: "ethical", text: "Bend the truth a little to keep a situation smooth." }),
  Object.freeze({ id: "fin1", domain: "financial", text: "Put a meaningful chunk of money into something risky for a bigger possible return." }),
  Object.freeze({ id: "hea1", domain: "health", text: "Skip a precaution you know you're supposed to take." }),
  Object.freeze({ id: "rec1", domain: "recreational", text: "Try an activity that scares you a little, just for the thrill." }),
  Object.freeze({ id: "soc1", domain: "social", text: "Share an unpopular opinion in a group that disagrees." }),
  Object.freeze({ id: "eth2", domain: "ethical", text: "Cut a corner you know you probably shouldn't." }),
  Object.freeze({ id: "fin2", domain: "financial", text: "Make a bet where the odds are long but the payoff is large." }),
  Object.freeze({ id: "hea2", domain: "health", text: "Do something physical that carries a real chance of getting hurt." }),
  Object.freeze({ id: "rec2", domain: "recreational", text: "Go somewhere unfamiliar without a plan." }),
  Object.freeze({ id: "soc2", domain: "social", text: "Tell someone close a hard truth that might upset them." }),
  Object.freeze({ id: "eth3", domain: "ethical", text: "Take credit that wasn't fully yours when no one would notice." }),
  Object.freeze({ id: "fin3", domain: "financial", text: "Spend on something significant without a clear plan to cover it." }),
  Object.freeze({ id: "hea3", domain: "health", text: "Put off dealing with a health thing you know you should handle." }),
  Object.freeze({ id: "rec3", domain: "recreational", text: "Take on a physical challenge well outside your comfort zone." }),
  Object.freeze({ id: "soc3", domain: "social", text: "Put yourself out there socially where you might be rejected." }),
]);

export const DOSPERT = Object.freeze({
  id: "dospert",
  surface: "profile",
  name: "Where You Lean", // working name (§ Step 4 doc) — Arlin to confirm/replace
  subtitle: "Where you take risk and where you hold back — across the parts of a life",
  estMinutes: 3,
  responseModel: "single-select-4",
  response: RESPONSE,
  intro:
    "This one's just a mirror — no right answers, nothing to work on. It maps where you lean toward risk and where you hold back, across different parts of life. Most people find they're not simply \u201ccautious\u201d or \u201cbold\u201d \u2014 they're one thing here and the opposite there. About 3 minutes.",
  domains: DOMAINS,
  items: ITEMS,
});

// ---------------------------------------------------------------------------
// Lean bands (spec §5: "where you lean toward risk and where you hold back").
// Qualitative, NEVER a score. Two thresholds on the 0–3 likelihood mean carve
// three bands. Tunable defaults (like sris LEVEL_THRESHOLD) — never shown.
// ---------------------------------------------------------------------------

export const LEAN_TOWARD = 2.0; // mean ≥ this → leans toward risk here
export const LEAN_BACK = 1.0; // mean ≤ this → holds back here

const LEAN_LABEL = Object.freeze({
  toward: "leans toward risk",
  even: "somewhere in between",
  back: "holds back",
});

/** @returns {"toward"|"even"|"back"} from a 0–3 domain mean. */
export function leanFor(mean) {
  const m = Number(mean);
  if (m >= LEAN_TOWARD) return "toward";
  if (m <= LEAN_BACK) return "back";
  return "even";
}

function domainMean(responses, domainId) {
  const vals = ITEMS.filter((it) => it.domain === domainId)
    .map((it) => responses[it.id])
    .filter((v) => v != null)
    .map((v) => Number(v));
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

// The spread-lead framing (spec §5). Fixed prose; the per-domain shape lives
// in `domains[]` and is rendered by the profile surface. Stillform-voiced,
// NOT the copyrighted DOSPERT — and deliberately free of any "good/bad."
const READING = Object.freeze({
  title: "Where you lean",
  body:
    "Here's where you lean toward risk and where you hold back. Look at the spread before any single line of it \u2014 most people aren't simply cautious or bold; they're one way in one part of life and the opposite in another. That spread is the interesting part. Nothing here needs fixing \u2014 it's just a clearer picture of how you actually move.",
});

/**
 * Score a completed take. Pure. This return shape is the PROFILE-RESULT
 * CONTRACT — the third/final result frame.
 *
 * @param {Object<string, number>} responses  itemId -> 0..3
 * @returns {{
 *   instrumentId: "dospert",
 *   surface: "profile",
 *   reading: { title:string, body:string },   // spread-lead framing (§5)
 *   domains: Array<{ id:string, label:string, lean:"toward"|"even"|"back", leanLabel:string }>,
 *   notes: Array<{ title:string, body:string }>,  // optional precision note; default EMPTY (held for Arlin, §5/§8)
 *   aiSteer: null   // profile is value-neutral; no Reframe steer
 * }}
 */
export function score(responses = {}) {
  const domains = Object.values(DOMAINS).map((d) => {
    const lean = leanFor(domainMean(responses, d.id));
    return { id: d.id, label: d.label, lean, leanLabel: LEAN_LABEL[lean] };
  });

  // The optional §5 precision note is the one editorializing element. Held off
  // by default per §8 (the profile frame must never inherit a "here's a
  // problem" tone) and this build's no-surface-a-problem posture. The contract
  // SUPPORTS notes[]; the surface renders them if present. Inclusion/wording
  // is Arlin's call (see Master Todo Step 4).
  const notes = [];

  return {
    instrumentId: "dospert",
    surface: "profile",
    reading: { title: READING.title, body: READING.body },
    domains,
    notes,
    aiSteer: null,
  };
}

export default DOSPERT;
