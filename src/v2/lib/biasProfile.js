/*
 * biasProfile.js — Stillform's Bias Profile (pattern-work) data layer.
 *
 * Pattern-work strand of the Bias Profile (Phase 5 sub-item #4): the
 * user's WATCH LIST of cognitive-distortion + metacognitive-belief
 * chips drawn from the frozen catalog (biasChips.js). Watch-listed
 * chips are flagged by the AI during Reframe and tracked over time.
 *
 * Distinct from the capacities surface (SRIS/ERQ/MAIA-2/IRI growth
 * mirror) and the optional profile surface (DOSPERT) — those are
 * separate data shapes built in later steps. This file is the
 * pattern-work watch list only.
 *
 * Schema:
 *   {
 *     watchList: [{
 *       chipId:         string,   // references biasChips catalog
 *       addedAt:        ISO 8601,
 *       lastSeen:       ISO 8601,
 *       encounterCount: number,
 *       source:         "workshop" | "in-session" | "manual"
 *     }],
 *     updatedAt: ISO 8601 | null
 *   }
 *
 * Follows the triggerProfile.js pattern: plain localStorage, fail-silent
 * on storage unavailable. Cloud sync layers later via Supabase. Unlike
 * Trigger Profile, the user does NOT author labels — they add fixed
 * catalog chips, so entries store a chipId, not freeform text.
 */

import { isValidChipId, getChipById } from "./biasChips.js";
import { getSessions } from "./sessions.js";

const STORAGE_KEY = "stillform_v2_bias_profile";

/** How a chip got onto the watch list. */
export const BIAS_WATCH_SOURCES = Object.freeze([
  "workshop", // added from a Workshop instrument result
  "in-session", // proposed by the AI during a Reframe and confirmed
  "manual", // added by the user browsing the catalog
]);

function emptyProfile() {
  return { watchList: [], updatedAt: null };
}

/**
 * Read the user's Bias Profile from localStorage. Returns empty profile
 * if storage is empty or unparseable. Filters entries to valid catalog
 * chip ids (drops anything that no longer maps to a real chip).
 *
 * @returns {{ watchList: Array, updatedAt: string|null }}
 */
export function getBiasProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProfile();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return emptyProfile();
    const list = Array.isArray(parsed.watchList) ? parsed.watchList : [];
    return {
      watchList: list.filter(
        (e) => e && typeof e === "object" && isValidChipId(e.chipId)
      ),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
    };
  } catch {
    return emptyProfile();
  }
}

/**
 * Write a Bias Profile to localStorage. Stamps updatedAt.
 * Returns the saved profile or null on storage failure.
 *
 * @param {{ watchList: Array }} profile
 * @returns {{ watchList: Array, updatedAt: string }|null}
 */
export function saveBiasProfile(profile) {
  if (!profile || typeof profile !== "object") return null;
  try {
    const safe = {
      watchList: Array.isArray(profile.watchList) ? profile.watchList : [],
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    return safe;
  } catch {
    return null;
  }
}

/**
 * Is a given chip currently on the watch list?
 * @param {string} chipId
 * @returns {boolean}
 */
export function isOnWatchList(chipId) {
  return getBiasProfile().watchList.some((e) => e.chipId === chipId);
}

/**
 * Add a catalog chip to the watch list. Validates against the catalog,
 * deduplicates by chipId. Source falls back to "manual".
 *
 * @param {{ chipId: string, source?: string }} input
 * @returns {object|null} the watch-list entry, or null on invalid chip
 */
export function addChipToWatchList({ chipId, source, state } = {}) {
  if (!isValidChipId(chipId)) return null;
  const validSource = BIAS_WATCH_SOURCES.includes(source) ? source : "manual";

  const profile = getBiasProfile();
  const existing = profile.watchList.find((e) => e.chipId === chipId);
  if (existing) return existing;

  const now = new Date().toISOString();
  const entry = {
    chipId,
    addedAt: now,
    lastSeen: now,
    encounterCount: 0,
    source: validSource,
    // 5.11 (b): the self-reported state at take-time, so a pattern added on a
    // depleted day carries that context (provisional vs. trait). null if the
    // user didn't flag a state. encounterCount above is the behavioral-
    // confirmation counter the AI increments as the pattern recurs in real
    // sessions (5.11 d) — repetition in practice, not retakes, is the proof.
    addedUnderState: typeof state === "string" && state ? state : null,
  };
  profile.watchList.push(entry);
  saveBiasProfile(profile);
  return entry;
}

/**
 * Remove a chip from the watch list.
 * @param {string} chipId
 * @returns {boolean} true if something was removed
 */
export function removeChipFromWatchList(chipId) {
  if (!chipId) return false;
  const profile = getBiasProfile();
  const before = profile.watchList.length;
  profile.watchList = profile.watchList.filter((e) => e.chipId !== chipId);
  if (profile.watchList.length === before) return false;
  saveBiasProfile(profile);
  return true;
}

/**
 * Increment encounterCount + bump lastSeen for a watch-listed chip.
 * Called when a surface (Reframe, EOD review) notes this pattern fired.
 *
 * @param {string} chipId
 * @returns {object|null} the updated entry, or null if not watch-listed
 */
export function incrementChipEncounter(chipId) {
  if (!chipId) return null;
  const profile = getBiasProfile();
  const idx = profile.watchList.findIndex((e) => e.chipId === chipId);
  if (idx === -1) return null;
  profile.watchList[idx] = {
    ...profile.watchList[idx],
    encounterCount: (profile.watchList[idx].encounterCount || 0) + 1,
    lastSeen: new Date().toISOString(),
  };
  saveBiasProfile(profile);
  return profile.watchList[idx];
}

/**
 * 5.11(d) — AI behavioral confirmation. Record an AI-detected pattern
 * occurrence against the watch list.
 *
 * Called from Reframe when the AI's machine-side `distortion` read (a clinical
 * spine) is present. We translate that spine to a watch-listed chip and, IF
 * the user already tracks it, count the occurrence. Governed by ZERO
 * FABRICATION: this only ever fires on the AI's genuine, confidence-gated read
 * of a pattern the user themselves flagged — never an invented or auto-added
 * pattern (a spine with no matching watch-list entry does nothing).
 *
 * Dedupe is per distinct DAY (a pattern already counted today is not counted
 * again), so encounterCount approximates how many separate days the pattern
 * has recurred — recurrence over time, not depth in one sitting. That is the
 * behavioral evidence that moves a pattern from provisional toward confirmed.
 *
 * @param {string} spine  the AI's clinical-spine read (matches chip.spine)
 * @returns {object|null}  the updated entry if counted, else null
 */
export function noteAiPatternDetection(spine) {
  if (!spine || typeof spine !== "string") return null;
  const target = spine.trim().toLowerCase();
  if (!target) return null;
  const profile = getBiasProfile();
  const idx = profile.watchList.findIndex((e) => {
    const chip = getChipById(e.chipId);
    return chip && typeof chip.spine === "string" && chip.spine.toLowerCase() === target;
  });
  if (idx === -1) return null; // not a pattern the user tracks → do nothing
  const entry = profile.watchList[idx];
  // Per-day dedupe: a pattern already counted today is not counted again.
  const todayKey = new Date().toDateString();
  if (entry.lastSeen && new Date(entry.lastSeen).toDateString() === todayKey) return null;
  // 5.12 (L2) — if this pattern had derived-state RETIRED ("gone quiet") at
  // the moment of re-detection, record the quiet episode before lastSeen
  // moves. Internal-only honesty about recurrence — never displayed as
  // failure; re-activation is information, not a setback (spec §6).
  const wasRetired = patternConfidence(entry).tier === "retired";
  profile.watchList[idx] = {
    ...entry,
    encounterCount: (entry.encounterCount || 0) + 1,
    lastSeen: new Date().toISOString(),
    quietEpisodes: (entry.quietEpisodes || 0) + (wasRetired ? 1 : 0),
  };
  saveBiasProfile(profile);
  return profile.watchList[idx];
}

/**
 * Number of distinct days the AI must detect a pattern before it reads as
 * confirmed (recurring across sessions, not a one-off).
 */
export const PATTERN_CONFIRMED_DAYS = 3;

/*
 * 5.12 — Pattern Lifecycle ("Gone Quiet"). Locked thresholds (spec v1.0,
 * Arlin June 2 2026 — "looser, show progress sooner", integrity floor =
 * never below two weeks for the first claim):
 *   quieting: ≥5 detection-active sessions AND ≥14 days since lastSeen
 *   retired:  ≥10 detection-active sessions AND ≥30 days since lastSeen
 * Both axes required (ZERO FABRICATION): sessions guarantee the AI had real
 * opportunities to detect; days guarantee it isn't depth-in-one-week (the
 * 5.11 state-vs-trait rule in reverse). A lapsed user accrues neither —
 * their patterns simply hold state, honestly.
 */
export const QUIET_MIN_SESSIONS = 5;
export const QUIET_MIN_DAYS = 14;
export const RETIRED_MIN_SESSIONS = 10;
export const RETIRED_MIN_DAYS = 30;

/**
 * Count sessions since an ISO timestamp in which AI detection was ACTIVE.
 * Self Mode sessions are excluded — they run with zero AI, so they are not
 * detection opportunities and counting them would fabricate quiet evidence.
 *
 * @param {string} sinceIso  ISO timestamp (typically entry.lastSeen)
 * @param {Array<object>} [sessionsArg]  injectable for testing; defaults to the store
 * @returns {number}
 */
export function countDetectionActiveSessionsSince(sinceIso, sessionsArg) {
  if (!sinceIso) return 0;
  const sinceMs = new Date(sinceIso).getTime();
  if (!Number.isFinite(sinceMs)) return 0;
  const sessions = Array.isArray(sessionsArg) ? sessionsArg : getSessions();
  return sessions.filter((s) => {
    if (!s || s.selfMode === true || s.mode === "self") return false;
    const t = new Date(s.timestamp || 0).getTime();
    return Number.isFinite(t) && t > sinceMs;
  }).length;
}

/**
 * Confidence tier for a watch-list entry, derived from how many distinct days
 * the AI has detected the pattern recurring (encounterCount), extended (5.12)
 * with the leaving half of the lifecycle. Plain language, no scores — the
 * watch list reflects, it does not grade.
 *
 * Derived at read time — nothing stored, no migration:
 *   provisional → emerging → confirmed   (shipped 5.11d, unchanged)
 *   confirmed → quieting → retired       (5.12: confirmed entries whose spine
 *     has NOT been detected across continued detection-active practice)
 * Re-detection at any point updates lastSeen via noteAiPatternDetection,
 * which restarts the quiet clock — derived state returns to confirmed
 * automatically.
 *
 * @param {{ encounterCount?: number, lastSeen?: string }} entry
 * @param {Array<object>} [sessionsArg]  injectable for testing
 * @returns {{ tier: "provisional"|"emerging"|"confirmed"|"quieting"|"retired",
 *             count: number,
 *             quiet: { sessionsSince: number, daysSince: number } | null }}
 */
export function patternConfidence(entry, sessionsArg) {
  const count = (entry && entry.encounterCount) || 0;
  let tier = "provisional";
  if (count >= PATTERN_CONFIRMED_DAYS) tier = "confirmed";
  else if (count >= 1) tier = "emerging";

  // 5.12 — only a CONFIRMED pattern can go quiet (a provisional flag that
  // never recurred was never established as a pattern; nothing to retire).
  if (tier !== "confirmed" || !entry || !entry.lastSeen) {
    return { tier, count, quiet: null };
  }
  const lastMs = new Date(entry.lastSeen).getTime();
  if (!Number.isFinite(lastMs)) return { tier, count, quiet: null };
  const daysSince = Math.floor((Date.now() - lastMs) / 86400000);
  const sessionsSince = countDetectionActiveSessionsSince(entry.lastSeen, sessionsArg);
  if (sessionsSince >= RETIRED_MIN_SESSIONS && daysSince >= RETIRED_MIN_DAYS) {
    tier = "retired";
  } else if (sessionsSince >= QUIET_MIN_SESSIONS && daysSince >= QUIET_MIN_DAYS) {
    tier = "quieting";
  }
  return { tier, count, quiet: { sessionsSince, daysSince } };
}

/**
 * Join the watch list with catalog data, sorted by encounterCount desc
 * then lastSeen desc (most load-bearing patterns first). Each item
 * carries the full chip (label/spine/info/type) plus the user's
 * tracking metadata. Used by the editor screen.
 *
 * @returns {Array<{ chip: object, addedAt: string, lastSeen: string, encounterCount: number, source: string }>}
 */
export function getWatchListChips() {
  const profile = getBiasProfile();
  return [...profile.watchList]
    .sort((a, b) => {
      const ec = (b.encounterCount || 0) - (a.encounterCount || 0);
      if (ec !== 0) return ec;
      const at = new Date(a.lastSeen || a.addedAt || 0).getTime();
      const bt = new Date(b.lastSeen || b.addedAt || 0).getTime();
      return bt - at;
    })
    .map((e) => ({
      chip: getChipById(e.chipId),
      addedAt: e.addedAt,
      lastSeen: e.lastSeen,
      encounterCount: e.encounterCount || 0,
      source: e.source || "manual",
    }))
    .filter((x) => x.chip); // guard: drop any orphaned entry
}

/**
 * Format the watch list for AI context injection. Sorts by
 * encounterCount desc + lastSeen desc, caps to top N. Includes the
 * clinical spine for the AI's grounding (the user never sees it).
 *
 * Output shape:
 *   User's watch-list patterns: "Running comparisons" [unfair comparison] (3 encounters), "The rulebook" [should statements]
 *
 * @param {number} [limit=8]
 * @returns {string|null}
 */
export function formatBiasProfileForAI(limit = 8) {
  try {
    const items = getWatchListChips();
    if (!items.length) return null;
    const formatted = items
      .slice(0, limit)
      .map(({ chip, encounterCount }) => {
        const countLabel =
          encounterCount === 0
            ? ""
            : ` (${encounterCount} encounter${encounterCount === 1 ? "" : "s"})`;
        return `"${chip.label}" [${chip.spine}]${countLabel}`;
      })
      .join(", ");
    return `User's watch-list patterns: ${formatted}`;
  } catch {
    return null;
  }
}
