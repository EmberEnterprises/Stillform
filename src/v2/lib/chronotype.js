/**
 * chronotype — P25 CHRONOTYPE-AWARE TIMING (2026-08-17).
 *
 * Learns the user's best hours from THEIR OWN record — not a template, not an
 * imposed "you're a morning person" label. The honest signal is behavioral:
 * the hours when they actually complete ENGAGED sessions (ones where they named
 * a takeaway or locked something in). Those are their good hours, by their own
 * evidence, and offers can be timed to land in them.
 *
 * Record-deterministic and conservative: below a real evidence floor it returns
 * null (no guess), and it never names a chronotype category — only "you tend to
 * do your best work around [their actual band]."
 */

import { getSessions } from "./sessions.js";

const MIN_ENGAGED = 5;       // fewer than this = not enough to read a rhythm
const CONCENTRATION = 1.6;   // a band must beat an even spread by this factor

const BANDS = [
  { id: "early-morning", label: "early morning", from: 5, to: 9 },
  { id: "late-morning", label: "late morning", from: 9, to: 12 },
  { id: "early-afternoon", label: "early afternoon", from: 12, to: 15 },
  { id: "late-afternoon", label: "late afternoon", from: 15, to: 18 },
  { id: "evening", label: "evening", from: 18, to: 22 },
  { id: "night", label: "night", from: 22, to: 5 },
];

function inBand(hour, b) {
  return b.from < b.to ? hour >= b.from && hour < b.to : hour >= b.from || hour < b.to;
}

/** A session counts as "engaged" if the user left something of their own in it. */
function isEngaged(s) {
  if (!s) return false;
  return Boolean(
    (typeof s.takeaway === "string" && s.takeaway.trim()) ||
    (typeof s.nextMove === "string" && s.nextMove.trim()) ||
    (typeof s.lockIn === "string" && s.lockIn.trim())
  );
}

/**
 * The user's best band, or null when the record can't honestly say yet.
 * @returns {{ bandId:string, bandLabel:string, count:number, share:number, line:string }|null}
 */
export function getBestHours() {
  let sessions = [];
  try { sessions = getSessions() || []; } catch { return null; }

  const engaged = sessions.filter(isEngaged);
  if (engaged.length < MIN_ENGAGED) return null;

  const counts = new Map();
  let total = 0;
  for (const s of engaged) {
    const t = s.timestamp ? Date.parse(s.timestamp) : NaN;
    if (Number.isNaN(t)) continue;
    const h = new Date(t).getHours();
    const band = BANDS.find((b) => inBand(h, b));
    if (!band) continue;
    counts.set(band.id, (counts.get(band.id) || 0) + 1);
    total += 1;
  }
  if (total < MIN_ENGAGED) return null;

  const evenShare = 1 / BANDS.length;
  let best = null;
  for (const band of BANDS) {
    const c = counts.get(band.id) || 0;
    if (!best || c > best.count) best = { band, count: c };
  }
  if (!best || best.count < 3) return null;

  const share = best.count / total;
  if (share < evenShare * CONCENTRATION) return null; // not concentrated enough to claim

  return {
    bandId: best.band.id,
    bandLabel: best.band.label,
    count: best.count,
    share: Math.round(share * 100) / 100,
    line: `Your most engaged sessions land in the ${best.band.label}. That's your window \\u2014 worth protecting for the work that matters.`,
  };
}

/**
 * Whether a given moment falls in the user's learned best band. Lets callers
 * time an offer to land in their good hours. Returns false (never throws) when
 * there isn't enough record to know.
 */
export function isWithinBestHours(nowMs = Date.now()) {
  const best = getBestHours();
  if (!best) return false;
  const band = BANDS.find((b) => b.id === best.bandId);
  if (!band) return false;
  return inBand(new Date(nowMs).getHours(), band);
}
