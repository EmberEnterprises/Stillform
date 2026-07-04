/**
 * startingRead.js — persists The Read from onboarding (2026-07-01; the day-one
 * gap Arlin's push found: the seen moment was shown once and thrown away).
 *
 * The starting read lives on home for the user's FIRST DAYS — the bridge
 * between minute three and the compounding record — then retires on its own:
 * the moment a real Today's Brief exists (the record has taken over) or after
 * MAX_DAYS, whichever comes first. Honest absence after that; it never
 * lingers as a stale relic.
 */

const KEY = "stillform_starting_read";
const MAX_DAYS = 10; // first-pass default, flagged

function safeLocal() {
  try { if (typeof window !== "undefined" && window.localStorage) return window.localStorage; } catch { /* */ }
  try { if (typeof localStorage !== "undefined") return localStorage; } catch { /* */ }
  return null;
}

export function saveStartingRead({ portrait = [], seen = [] } = {}) {
  const ls = safeLocal();
  if (!ls) return false;
  if (!Array.isArray(portrait) || portrait.length === 0) return false;
  try {
    ls.setItem(KEY, JSON.stringify({ portrait, seen: Array.isArray(seen) ? seen : [], at: Date.now() }));
    return true;
  } catch { return false; }
}

/** The read, while it's still the user's freshest self-knowledge. Null once retired. */
export function getActiveStartingRead(nowMs = Date.now()) {
  const ls = safeLocal();
  if (!ls) return null;
  try {
    const raw = ls.getItem(KEY);
    if (!raw) return null;
    const rec = JSON.parse(raw);
    if (!rec || !Array.isArray(rec.portrait) || rec.portrait.length === 0) return null;
    if (typeof rec.at !== "number" || nowMs - rec.at > MAX_DAYS * 86400000) return null;
    // The record has taken over: a real brief supersedes the starting read.
    try { if (ls.getItem("stillform_todays_brief")) return null; } catch { /* */ }
    return rec;
  } catch { return null; }
}

export const _startingRead = { KEY, MAX_DAYS };
