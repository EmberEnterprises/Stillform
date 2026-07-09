/*
 * trackProgress.js — the "moves you're building" data layer.
 *
 * Two HONEST, distinct signals per Learning Track move, never blurred:
 *
 *   PRACTICED HERE  — the user ran the move in the Track (recordPractice on
 *                     lesson finish). Fully unambiguous: they did the rep here.
 *   REACHED FOR IT  — the move was UNAMBIGUOUSLY involved in a real session,
 *   LIVE              derived from sessions.movesUsed (written at session save
 *                     by Spine.deriveMovesUsed). Only signals that unmistakably
 *                     mean the move happened are counted; fuzzy ones are held.
 *                     This is the same integrity bar as the discovery engine:
 *                     never claim usage the data doesn't unambiguously show.
 *
 * PLUS user-marked "working on this" — a personal focus set the user assembles
 * as they go (autonomy + metacognition). NOT a quiz, NOT typing the user.
 *
 * No gamification: counts are quiet observations, never streaks or scores.
 * All reads fail-silent and honest-empty. Storage is stillform_-prefixed so it
 * rides the existing cloud-sync / wipe path.
 */

import { getSessions } from "./sessions.js";

const WORKING_KEY = "stillform_v2_track_working_on"; // string[] of move ids
const PRACTICE_KEY = "stillform_v2_track_practice";  // { [id]: { count, last } }
const NUDGE_KEY = "stillform_v2_track_nudge";        // { dismissedAt }

/* Re-offer window after a dismissal. The nudge respects a "not now": it stays
 * quiet for this long unless the user practices again (new engagement resets
 * the conversation). Concierge doctrine: earned + dismissible, never naggy. */
const NUDGE_QUIET_DAYS = 5;

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed == null ? fallback : parsed;
  } catch {
    return fallback;
  }
}
function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/* ---- working-on marks ---- */

/** Array of move ids the user has marked as working on. */
export function getWorkingOn() {
  const arr = readJSON(WORKING_KEY, []);
  return Array.isArray(arr) ? arr.filter((x) => typeof x === "string" && x) : [];
}

/** True if the move is in the working-on set. */
export function isWorkingOn(id) {
  if (!id || typeof id !== "string") return false;
  return getWorkingOn().includes(id);
}

/** Toggle a move in/out of the working-on set. Returns the new state (bool). */
export function toggleWorkingOn(id) {
  if (!id || typeof id !== "string") return false;
  const cur = getWorkingOn();
  const has = cur.includes(id);
  const next = has ? cur.filter((x) => x !== id) : [...cur, id];
  writeJSON(WORKING_KEY, next);
  return !has;
}

/* ---- practiced here (Track lesson runs) ---- */

/** Record that the user ran this move in the Track. Idempotent-safe (counts each finish). */
export function recordPractice(id) {
  if (!id || typeof id !== "string") return false;
  const store = readJSON(PRACTICE_KEY, {});
  const prev = store && typeof store === "object" && store[id] ? store[id] : { count: 0, last: null };
  store[id] = { count: (prev.count || 0) + 1, last: new Date().toISOString() };
  // New engagement clears any nudge dismissal — deterministic re-engagement
  // (no timestamp comparison; the act of practicing reopens the conversation).
  try { localStorage.removeItem(NUDGE_KEY); } catch { /* fail-silent */ }
  return writeJSON(PRACTICE_KEY, store);
}

/** { count, last } for a move's Track practice, honest-empty. */
export function getPractice(id) {
  if (!id || typeof id !== "string") return { count: 0, last: null };
  const store = readJSON(PRACTICE_KEY, {});
  const rec = store && typeof store === "object" ? store[id] : null;
  return rec && typeof rec === "object"
    ? { count: rec.count || 0, last: rec.last || null }
    : { count: 0, last: null };
}

/* ---- reached for it live (from sessions.movesUsed) ---- */

/**
 * { count, last } — how many real sessions unambiguously involved this move.
 * Derived from sessions.movesUsed (the source of truth; auto sync/wipe). Never
 * inferred here — only counts what Spine recorded as unambiguous.
 */
export function getLiveUsage(id) {
  if (!id || typeof id !== "string") return { count: 0, last: null };
  let sessions = [];
  try {
    sessions = getSessions() || [];
  } catch {
    sessions = [];
  }
  let count = 0;
  let last = null;
  for (const s of sessions) {
    const used = s && Array.isArray(s.movesUsed) ? s.movesUsed : [];
    if (used.includes(id)) {
      count += 1;
      const t = s.timestamp || null;
      if (t && (!last || t > last)) last = t;
    }
  }
  return { count, last };
}

/**
 * The moves the user is building — any move that is marked, practiced, or used
 * live. Returns [{ id, working, practice:{count,last}, live:{count,last} }],
 * with the strongest signal first. Honest-empty ([]) when nothing yet.
 * `allIds` = the full set of valid move ids (so we never surface a stale id).
 */
export function getMovesBuilding(allIds) {
  const valid = Array.isArray(allIds) ? new Set(allIds) : null;
  const marked = getWorkingOn();
  const practiceStore = readJSON(PRACTICE_KEY, {});
  const ids = new Set();
  for (const id of marked) ids.add(id);
  if (practiceStore && typeof practiceStore === "object") {
    for (const id of Object.keys(practiceStore)) if ((practiceStore[id]?.count || 0) > 0) ids.add(id);
  }
  let sessions = [];
  try { sessions = getSessions() || []; } catch { sessions = []; }
  for (const s of sessions) {
    const used = s && Array.isArray(s.movesUsed) ? s.movesUsed : [];
    for (const id of used) ids.add(id);
  }
  const out = [];
  for (const id of ids) {
    if (valid && !valid.has(id)) continue; // drop stale/unknown ids
    out.push({
      id,
      working: marked.includes(id),
      practice: getPractice(id),
      live: getLiveUsage(id),
    });
  }
  // strongest signal first: working, then most live, then most practiced
  out.sort((a, b) => {
    if (a.working !== b.working) return a.working ? -1 : 1;
    if (b.live.count !== a.live.count) return b.live.count - a.live.count;
    return b.practice.count - a.practice.count;
  });
  return out;
}

/* ---- the earned next-lesson nudge (concierge, Learn) ---- */

/**
 * The one home nudge the Track earns. Deterministic, and it only speaks when
 * it genuinely has something (concierge doctrine, corrected 2026-07-08):
 *
 *   EARNED  — the user has actually engaged with the Track (practiced at least
 *             one lesson, or marked a move "working on"). A user who has never
 *             touched the Track is NEVER nudged — that would be a push.
 *   REAL    — there is a concrete next lesson (unpracticed, in registry order;
 *             a "working on" move that hasn't been practiced yet leads).
 *   POLITE  — a dismissal is remembered: quiet for NUDGE_QUIET_DAYS unless the
 *             user practices again (new engagement reopens the conversation).
 *
 * @param {Array<{id:string}>} allLessons — the LESSONS registry (ordered)
 * @returns {{ id:string }|null} the next lesson to offer, or null (honest-empty)
 */
export function getNextLessonNudge(allLessons, { includeDismissed = false } = {}) {
  if (!Array.isArray(allLessons) || allLessons.length === 0) return null;

  const practice = readJSON(PRACTICE_KEY, {});
  const working = getWorkingOn();

  const practicedIds = Object.keys(practice).filter(
    (id) => practice[id] && practice[id].count > 0
  );
  const engaged = practicedIds.length > 0 || working.length > 0;
  if (!engaged) return null; // never nudge someone who hasn't opted into the Track

  // Dismissal memory — quiet for the window. Any new practice CLEARS this key
  // (see recordPractice), so re-engagement deterministically reopens the nudge.
  const nudgeState = readJSON(NUDGE_KEY, null);
  if (!includeDismissed && nudgeState && nudgeState.dismissedAt) {
    const quietUntil = new Date(
      new Date(nudgeState.dismissedAt).getTime() + NUDGE_QUIET_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();
    if (new Date().toISOString() < quietUntil) return null;
  }

  const isPracticed = (id) => practicedIds.includes(id);

  // A marked-but-unpracticed move leads (the user named it; honor that first).
  for (const id of working) {
    if (!isPracticed(id) && allLessons.some((l) => l && l.id === id)) return { id };
  }
  // Otherwise: the first unpracticed lesson in registry order.
  for (const l of allLessons) {
    if (l && l.id && !isPracticed(l.id)) return { id: l.id };
  }
  return null; // everything practiced — nothing honest to offer
}

/** Remember a dismissal so the nudge goes quiet (see NUDGE_QUIET_DAYS). */
export function dismissLessonNudge() {
  writeJSON(NUDGE_KEY, { dismissedAt: new Date().toISOString() });
}
