// ─────────────────────────────────────────────────────────────────────────
// Self-distancing re-voicing primitive  (Phase 1 / M2)
//
// Science: Kross 2014 (JPSP), Moser 2017 — addressing the self in the second
// or third person ("you" / by name) instead of "I" lowers reactivity in under
// a second, without effortful control. The wow is hearing your OWN naming of a
// moment played back in distanced form.
//
// This module is the DETERMINISTIC PLUMBING ONLY. It is a pure perspective
// transform on text the user (or the AI) already produced. It does this:
//   • shift first-person pronouns to second/third person
// It deliberately does NOT do this:
//   • author phrasing, add content, soften, embellish, or invent anything
//   • decide WHEN or WHERE a re-voicing is shown, or how it is framed
//
// Those last decisions are voice work and are intentionally LEFT TO ARLIN.
// Nothing here is wired into a surface yet; this is a ready primitive waiting
// for its voice/usage layer. Integrity rule: this function never silently
// emits a grammatically broken sentence — for third person (which needs verb
// agreement that deterministic code cannot do reliably) it returns the result
// flagged draft:true so the voice layer must finish it.
// ─────────────────────────────────────────────────────────────────────────

// First-person → second-person. Applied in order; longer/contraction and
// auxiliary forms must run before the bare subject "I" so "I am" does not
// become "you am". Straight and curly apostrophes both covered.
const SECOND_PERSON = [
  [/\bI'm\b/g, "you're"],
  [/\bI\u2019m\b/g, "you\u2019re"],
  [/\bI've\b/g, "you've"],
  [/\bI\u2019ve\b/g, "you\u2019ve"],
  [/\bI'll\b/g, "you'll"],
  [/\bI\u2019ll\b/g, "you\u2019ll"],
  [/\bI'd\b/g, "you'd"],
  [/\bI\u2019d\b/g, "you\u2019d"],
  // "to be" is the only common verb whose form changes for second person.
  [/\bI am\b/g, "you are"],
  [/\bI was\b/g, "you were"],
  // possessive / object / reflexive before the bare subject pronoun
  [/\bmyself\b/g, "yourself"],
  [/\bmine\b/g, "yours"],
  [/\bMy\b/g, "Your"],
  [/\bmy\b/g, "your"],
  [/\bme\b/g, "you"],
  // bare subject "I" anywhere (it is always uppercase in English)
  [/\bI\b/g, "you"],
];

// First-person → third-person pronoun/possessive substitution only. Main-verb
// agreement (brace → braces, have → has, am → is) is NOT attempted here; doing
// it deterministically across English verbs is unreliable, so the result is
// returned draft:true for a human (voice) pass. NAME is inserted verbatim.
function thirdPersonMap(name) {
  return [
    [/\bI'm\b/g, `${name} is`],
    [/\bI\u2019m\b/g, `${name} is`],
    [/\bI am\b/g, `${name} is`],
    [/\bI was\b/g, `${name} was`],
    [/\bmyself\b/g, "themselves"],
    [/\bmine\b/g, `${name}'s`],
    [/\bMy\b/g, `${name}'s`],
    [/\bmy\b/g, `${name}'s`],
    [/\bme\b/g, name],
    [/\bI\b/g, name],
  ];
}

// Capitalize the first alphabetic character and any first letter that follows
// a sentence terminator + space. Conservative: only touches sentence starts.
function fixSentenceCaps(s) {
  let out = s.replace(/^(\s*)([a-z])/, (_, ws, c) => ws + c.toUpperCase());
  out = out.replace(/([.!?]\s+)([a-z])/g, (_, sep, c) => sep + c.toUpperCase());
  return out;
}

/**
 * Re-voice the user's own text in a self-distanced perspective.
 *
 * @param {string} text  The user's (or AI's) text, written in the first person.
 * @param {object} [opts]
 * @param {"second"|"third"} [opts.person="second"]  Distance form.
 * @param {string|null} [opts.name=null]  Required for person:"third".
 * @returns {{ text: string, person: "second"|"third", draft: boolean } | null}
 *   `draft:false` → safe to use as final. `draft:true` → third-person verb
 *   agreement still needs a human pass; do not show as final. `null` → input
 *   was empty/invalid, or third person was requested without a name, or the
 *   text contained no first-person markers to transform (nothing to do).
 */
export function revoice(text, opts = {}) {
  if (typeof text !== "string") return null;
  const trimmed = text.trim();
  if (!trimmed) return null;

  const person = opts.person === "third" ? "third" : "second";
  const name = typeof opts.name === "string" ? opts.name.trim() : "";

  // Nothing to distance if there is no first-person marker. Returning null here
  // keeps integrity: the primitive never hands back text it did not transform.
  if (!/\b(I|I'm|I\u2019m|I've|I\u2019ve|I'll|I\u2019ll|I'd|I\u2019d|me|my|My|mine|myself)\b/.test(trimmed)) {
    return null;
  }

  if (person === "third") {
    if (!name) return null;
    let out = trimmed;
    for (const [re, rep] of thirdPersonMap(name)) out = out.replace(re, rep);
    out = fixSentenceCaps(out);
    return { text: out, person: "third", draft: true };
  }

  let out = trimmed;
  for (const [re, rep] of SECOND_PERSON) out = out.replace(re, rep);
  out = fixSentenceCaps(out);
  return { text: out, person: "second", draft: false };
}

export default revoice;
