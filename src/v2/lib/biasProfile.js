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
export function addChipToWatchList({ chipId, source } = {}) {
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
