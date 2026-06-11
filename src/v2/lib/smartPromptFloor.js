/*
 * smartPromptFloor.js — M4: the deterministic smart-prompt floor.
 *
 * Makes the Active Prompt pattern-aware WITHOUT any AI call: everything
 * here derives from local stores (watch list lifecycle, session
 * recency). Zero cost, works offline, Self-Mode native.
 *
 * Voice law (User-AI relationship principle A): observation +
 * invitation, never directive, never guilt. A practice gap is "the
 * thread holds," never a broken streak. A quiet pattern is the user's
 * work observed, never a celebration animation.
 *
 * Anti-nagging integrity: at most ONE smart-floor line per day
 * (date-gated), and a given observation key is surfaced at most once
 * every 14 days — the floor speaks when it has something, then yields
 * back to the standard per-beat copy. Engagement honesty over
 * engagement volume.
 *
 * Beats: morning + main only. EOD and wind-down keep their dedicated
 * copy — those moments have their own jobs.
 *
 * Storage: stillform_v2_smart_floor → { lastShownDate, surfaced: {key: ISO} }
 */

import { getWatchListChips, patternConfidence } from "./biasProfile.js";
import { getSessions } from "./sessions.js";

const KEY = "stillform_v2_smart_floor";
const RESURFACE_DAYS = 14;
const GAP_DAYS = 4;
const RECENT_ENCOUNTER_DAYS = 7;

function readMeta() {
  try {
    const raw = localStorage.getItem(KEY);
    const m = raw ? JSON.parse(raw) : {};
    return m && typeof m === "object" ? { surfaced: {}, ...m } : { surfaced: {} };
  } catch {
    return { surfaced: {} };
  }
}

function writeMeta(m) {
  try {
    localStorage.setItem(KEY, JSON.stringify(m));
  } catch {
    /* non-fatal */
  }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function daysSince(iso) {
  const t = new Date(iso || 0).getTime();
  if (!t) return Infinity;
  return (Date.now() - t) / (1000 * 60 * 60 * 24);
}

/**
 * The candidate ladder, priority order. Each returns
 * { key, headline, body } or null. Keys gate resurfacing.
 */
function pickCandidate(threadLength) {
  const chips = getWatchListChips();

  // 1) A pattern recently gone quiet — the product's promise, observed.
  for (const c of chips) {
    const { tier } = patternConfidence({
      encounterCount: c.encounterCount,
      lastSeen: c.lastSeen,
      addedAt: c.addedAt,
    });
    if (tier === "retired" && daysSince(c.lastSeen) <= 45) {
      const label = c.chip?.label || "A pattern";
      return {
        key: `quiet:${c.chip?.id || label}`,
        headline: "Something has gone quiet.",
        body: `${label} hasn't shown in your sessions for weeks. That came from the work. Begin when ready.`,
      };
    }
  }

  // 2) Practice gap — the thread holds. No guilt, no streak language.
  const sessions = getSessions();
  if (sessions.length > 0) {
    const last = sessions[sessions.length - 1];
    const gap = daysSince(last.timestamp || last.dateKey);
    if (gap >= GAP_DAYS && threadLength === 0) {
      return {
        key: `gap:${todayKey()}`,
        headline: "The thread holds.",
        body: "A few days since the last session. Nothing lost. Begin when ready.",
      };
    }
  }

  // 3) A confirmed pattern active this week — worth a look.
  for (const c of chips) {
    const { tier } = patternConfidence({
      encounterCount: c.encounterCount,
      lastSeen: c.lastSeen,
      addedAt: c.addedAt,
    });
    if (tier === "confirmed" && daysSince(c.lastSeen) <= RECENT_ENCOUNTER_DAYS) {
      const label = c.chip?.label || "A named pattern";
      return {
        key: `active:${c.chip?.id || label}`,
        headline: "Worth a look.",
        body: `${label} has been showing up this week. Name it when it arrives. Begin when ready.`,
      };
    }
  }

  return null;
}

/**
 * Smart-floor prompt, or null to yield to the standard per-beat copy.
 *
 * @param {"morning"|"main"|"eod"|"wind-down"} beat
 * @param {number} threadLength
 * @returns {{headline: string, body: string, actionLabel: null, source: "smart-floor"} | null}
 */
export function getSmartFloorPrompt(beat, threadLength) {
  if (beat !== "morning" && beat !== "main") return null;

  const meta = readMeta();
  if (meta.lastShownDate === todayKey()) return null; // one per day

  const cand = pickCandidate(threadLength);
  if (!cand) return null;

  const lastSurfaced = meta.surfaced?.[cand.key];
  if (lastSurfaced && daysSince(lastSurfaced) < RESURFACE_DAYS) return null;

  writeMeta({
    ...meta,
    lastShownDate: todayKey(),
    surfaced: { ...(meta.surfaced || {}), [cand.key]: new Date().toISOString() },
  });

  return { headline: cand.headline, body: cand.body, actionLabel: null, source: "smart-floor" };
}
