/*
 * becoming.js — the evidence-of-self data layer (Arlin, 2026-07-08 spec).
 *
 * The user names qualities they are moving toward — DIRECTIONS ("becoming"),
 * never decrees ("I am"). The record then supplies EVIDENCE: concrete logged
 * moments where they already acted with the quality. The mechanic closes the
 * belief-gap with proof the user generated — never widens it with a wish.
 *
 * FACT-CHECKED DESIGN (Science Sheet: "Becoming (Evidence-of-Self)"):
 *   - Wood 2009: bare positive self-statements ("I am X") BACKFIRE at low
 *     self-esteem — the naive mirror-affirmation version is NOT built.
 *   - Steele: values-affirmation + concrete evidence-based statements work.
 *   - So: direction not decree; specific logged instance, never "you are X."
 *
 * FAIR QUALITIES (Arlin's rule): expressed through thought/choice with
 * evidence possible in-record — courage, patience, honesty, discipline,
 * compassion, resilience, integrity, restraint. If it needs the outside
 * world's verdict (likability, attractiveness), it's out. Appearance: never.
 *
 * EVIDENCE = both-authored: the user can pin a moment themselves, and the AI
 * (via Reframe context) may CITE a concrete logged instance — but an evidence
 * moment only lands here when the USER confirms it. Nothing is asserted on
 * their behalf. Opportunities/hardships count only as evidence of the USER's
 * own response ("you were given this — what did you do with it?"), never a
 * guess about anyone else's intentions (mind-reading is a distortion the bias
 * engine exists to catch).
 *
 * All reads fail-silent + honest-empty. stillform_-prefixed (sync/wipe path).
 */

const KEY = "stillform_v2_becoming";

export const FAIR_QUALITIES = [
  "courage",
  "patience",
  "honesty",
  "discipline",
  "compassion",
  "resilience",
  "integrity",
  "restraint",
];

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { directions: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.directions)) return { directions: [] };
    return parsed;
  } catch {
    return { directions: [] };
  }
}
function write(store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

/** All named directions: [{ quality, namedAt, evidence: [{ text, at }] }]. */
export function getDirections() {
  return read().directions;
}

/**
 * Name a direction — a quality the user chooses to move toward.
 * Free-text allowed (their word beats the list), lightly normalized.
 * Refuses empty/appearance-coded words at the data layer as a backstop
 * (the surface is the real gate; this is defense in depth).
 */
export function nameDirection(quality) {
  const q = String(quality || "").trim().toLowerCase().slice(0, 40);
  if (q.length < 3) return false;
  const APPEARANCE_BLOCK = /\b(attractive|beautiful|handsome|pretty|hot|skinny|thin|fit-looking|younger)\b/i;
  const OTHERS_VERDICT_BLOCK = /\b(likable|likeable|popular|admired|impressive|respected by)\b/i;
  if (APPEARANCE_BLOCK.test(q) || OTHERS_VERDICT_BLOCK.test(q)) return false;
  const store = read();
  if (store.directions.some((d) => d.quality === q)) return true; // already named
  if (store.directions.length >= 5) return false; // a direction set, not a wishlist
  store.directions.push({ quality: q, namedAt: new Date().toISOString(), evidence: [] });
  return write(store);
}

/** Remove a direction (and its evidence) — the choosing stays the user's. */
export function removeDirection(quality) {
  const q = String(quality || "").trim().toLowerCase();
  const store = read();
  const before = store.directions.length;
  store.directions = store.directions.filter((d) => d.quality !== q);
  return before !== store.directions.length ? write(store) : false;
}

/**
 * Confirm an evidence moment under a direction — USER-confirmed only.
 * text = the concrete moment in plain words ("stayed in the hard
 * conversation on Tuesday instead of leaving"). Capped; newest kept.
 */
export function confirmEvidence(quality, text) {
  const q = String(quality || "").trim().toLowerCase();
  const t = String(text || "").trim().slice(0, 240);
  if (!q || t.length < 8) return false;
  const store = read();
  const dir = store.directions.find((d) => d.quality === q);
  if (!dir) return false;
  dir.evidence.push({ text: t, at: new Date().toISOString() });
  if (dir.evidence.length > 12) dir.evidence = dir.evidence.slice(-12);
  return write(store);
}

/**
 * Format for the AI context (reframe). Directions + a few recent evidence
 * moments, with the usage rules restated inline so the model carries them.
 * Honest-empty: returns null when nothing is named.
 */
export function formatBecomingForAI() {
  const dirs = getDirections();
  if (!dirs.length) return null;
  const lines = dirs.map((d) => {
    const ev = (d.evidence || []).slice(-2).map((e) => `"${e.text}"`).join("; ");
    return `- ${d.quality}${ev ? ` (their confirmed moments: ${ev})` : " (no confirmed moments yet)"}`;
  });
  return (
    `BECOMING — directions the user has chosen to move toward (their words, their choosing):\n${lines.join("\n")}\n` +
    `RULES: These are DIRECTIONS, never verdicts. NEVER say "you are ${dirs[0].quality}" or any bare trait claim — ` +
    `global self-statements backfire (Wood 2009). What you MAY do, sparingly and only when the record genuinely shows it: ` +
    `cite ONE concrete moment from what they actually wrote or logged as evidence of a named direction ` +
    `("that choice on Tuesday — that's the ${dirs[0].quality} you said you're building"). Evidence must be specific and theirs. ` +
    `An opportunity or hardship counts only as a mirror of THEIR response — never infer what others believed or intended. ` +
    `If the record shows nothing, say nothing; never manufacture proof.`
  );
}
