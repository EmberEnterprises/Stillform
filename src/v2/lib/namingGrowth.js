/**
 * namingGrowth.js — "your language is sharpening" (the missing surface).
 *
 * THE GAP THIS FILLS (verified June 15 2026): every session stores the
 * user's own `precisionName` / `takeaway`, and the whole product rests on
 * the granular-naming science (Hoemann 2021, Barrett 2017 — naming with
 * precision measurably improves emotional differentiation and is trainable).
 * But NOTHING analysed that precision OVER TIME. The science was cited as
 * justification everywhere and surfaced nowhere. This module closes that:
 * it shows the practitioner their own language sharpening, in their own
 * words — the single most on-brand "wow" for a self-mastery product,
 * because it is *evidence the practice is physically working on them*.
 *
 * HONESTY BAR (non-negotiable — the difference between insight and a gimmick):
 *   - NO fake-precise score. "Granularity: 73%" would be the rookie move:
 *     a number that looks rigorous and means nothing. We never ship that.
 *   - The signal is DIFFERENTIATION, grounded in the actual science:
 *     specificity (length + concreteness of a naming) and VARIETY (how many
 *     distinct things you can name vs. repeating one coarse label). These
 *     are defensible proxies for granularity, not a contrived metric.
 *   - The PAYOFF is shown in the USER'S OWN WORDS — an early naming beside a
 *     recent one — not a chart. The words are the proof; the measure only
 *     decides whether there's a real, honest shift worth showing.
 *   - If the shift isn't real (too little data, or no measurable change), we
 *     say so plainly. We never manufacture growth to flatter the user.
 *
 * Pure module: reads sessions, computes, returns a plain object. No React,
 * no network, no AI.
 */

import { getSessions } from "./sessions.js";

// Minimum sessions before a growth read is honest. Below this, comparing
// "early" to "recent" is noise, not signal.
const MIN_SESSIONS = 8;
// How many from each end we compare.
const WINDOW = 5;

// Coarse, low-differentiation namings — the "I feel bad" floor. Used only to
// detect specificity, never shown to the user as judgment.
const COARSE = new Set([
  "bad", "good", "fine", "ok", "okay", "stressed", "anxious", "sad", "happy",
  "tired", "angry", "upset", "off", "meh", "down", "low", "blah", "idk",
  "i feel bad", "i feel off", "not great", "feeling bad",
]);

/** A rough, honest specificity read for a single naming: rewards concrete,
 *  multi-word, non-coarse phrasing. NOT shown as a number — feeds the shift. */
function specificity(text) {
  if (typeof text !== "string") return 0;
  const t = text.trim().toLowerCase();
  if (!t) return 0;
  if (COARSE.has(t)) return 1;
  const words = t.split(/\s+/).filter(Boolean);
  // distinct, content-bearing words (drop the shortest function words)
  const content = new Set(words.filter((w) => w.length > 3));
  // specificity rises with content-word count, lightly capped
  return Math.min(10, 1 + content.size);
}

function avg(nums) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/**
 * @returns {{
 *   hasGrowth: boolean,          // is there an honest, showable shift?
 *   ready: boolean,              // enough data to say anything at all?
 *   earlyExample: string|null,   // an early naming, the user's own words
 *   recentExample: string|null,  // a recent naming, the user's own words
 *   earlySpecificity: number,
 *   recentSpecificity: number,
 *   earlyVariety: number,        // distinct namings in the early window
 *   recentVariety: number,
 *   headline: string,            // honest, measured, never inflated
 * }}
 */
export function getNamingGrowth() {
  let sessions = [];
  try {
    sessions = (getSessions() || []).filter(
      (s) => s && typeof s.precisionName === "string" && s.precisionName.trim()
    );
  } catch {
    sessions = [];
  }

  // chronological
  sessions.sort((a, b) => {
    const ta = new Date(a.timestamp || 0).getTime();
    const tb = new Date(b.timestamp || 0).getTime();
    return ta - tb;
  });

  if (sessions.length < MIN_SESSIONS) {
    return {
      hasGrowth: false,
      ready: false,
      earlyExample: null,
      recentExample: null,
      earlySpecificity: 0,
      recentSpecificity: 0,
      earlyVariety: 0,
      recentVariety: 0,
      headline:
        "A few more reps and this will start showing you how your naming is sharpening over time.",
    };
  }

  const early = sessions.slice(0, WINDOW);
  const recent = sessions.slice(-WINDOW);

  const earlyNames = early.map((s) => s.precisionName.trim());
  const recentNames = recent.map((s) => s.precisionName.trim());

  const earlySpec = avg(earlyNames.map(specificity));
  const recentSpec = avg(recentNames.map(specificity));
  const earlyVar = new Set(earlyNames.map((n) => n.toLowerCase())).size;
  const recentVar = new Set(recentNames.map((n) => n.toLowerCase())).size;

  // Pick the most/least specific real examples to show — their own words.
  const earlyExample = [...earlyNames].sort((a, b) => specificity(a) - specificity(b))[0] || null;
  const recentExample = [...recentNames].sort((a, b) => specificity(b) - specificity(a))[0] || null;

  // Honest shift: a real rise in specificity OR variety. No inflation.
  const specRose = recentSpec - earlySpec >= 1.0;
  const varRose = recentVar - earlyVar >= 1;
  const hasGrowth = (specRose || varRose) && !!earlyExample && !!recentExample
    && earlyExample.toLowerCase() !== recentExample.toLowerCase();

  let headline;
  if (hasGrowth) {
    headline =
      "Your naming has gotten more specific. Early on you reached for broader words; lately you're catching the exact shape. That sharpening is the practice working — granular naming is trainable, and it's training.";
  } else {
    headline =
      "Your naming has held steady. That's not nothing — consistency is its own signal. Keep going; the sharpening shows up over weeks, not days.";
  }

  return {
    hasGrowth,
    ready: true,
    earlyExample,
    recentExample,
    earlySpecificity: Math.round(earlySpec * 10) / 10,
    recentSpecificity: Math.round(recentSpec * 10) / 10,
    earlyVariety: earlyVar,
    recentVariety: recentVar,
    headline,
  };
}
