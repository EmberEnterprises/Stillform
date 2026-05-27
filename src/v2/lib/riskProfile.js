/**
 * riskProfile.js — data layer for the Workshop's PROFILE surface (DOSPERT).
 *
 * Bias Profile build, Step 4b. Parallel to capacitiesProfile.js but for the
 * value-neutral PROFILE frame: DOSPERT feeds its OWN light surface
 * (spec §5/§9), NOT the capacities growth mirror and NOT the pattern-work
 * watch list. capacitiesProfile.recordInstrumentResult deliberately REJECTS
 * non-capacity instruments, so the profile surface needs its own store.
 *
 * Like capacitiesProfile / triggerProfile / biasProfile: localStorage,
 * fail-silent, never throws into the UI. Interpretation-agnostic — it stores
 * whatever result object dospert.score() produces and hands history back; the
 * MEANING (the profile/mirror framing) lives with the instrument scoring and
 * the profile surface (Step 4d), never here.
 *
 * NOT registered in any SYNC_KEYS system — the v2 profile stores are plain
 * localStorage stores and this mirrors them exactly. (The old v1 SYNC_KEYS
 * registry lived in the deleted src/App.jsx.)
 */

const STORAGE_KEY = "stillform_risk_profile";

/** Read the stored profile. Always returns a valid shape; fail-silent. */
export function getRiskProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { takes: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.takes)) return { takes: [] };
    return parsed;
  } catch {
    return { takes: [] };
  }
}

/** Persist the profile. Returns true on success; fail-silent. */
export function saveRiskProfile(profile) {
  try {
    if (!profile || !Array.isArray(profile.takes)) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}

/**
 * Record a completed DOSPERT take.
 * @param {Object} arg
 * @param {*} arg.results — dospert.score() result object (stored as-is)
 * @returns {boolean} success
 */
export function recordRiskProfile({ results } = {}) {
  const profile = getRiskProfile();
  profile.takes.push({
    instrumentId: "dospert",
    results: results ?? null,
    takenAt: new Date().toISOString(),
  });
  return saveRiskProfile(profile);
}

/** Chronological history (oldest → newest). */
export function getRiskHistory() {
  return getRiskProfile()
    .takes.slice()
    .sort((a, b) => new Date(a.takenAt).getTime() - new Date(b.takenAt).getTime());
}

/** Most recent take, or null. */
export function getLatestRiskResult() {
  const h = getRiskHistory();
  return h.length ? h[h.length - 1] : null;
}

/** First (baseline) take, or null — the "before" in a "has anything shifted" read. */
export function getFirstRiskResult() {
  const h = getRiskHistory();
  return h.length ? h[0] : null;
}

/** Has DOSPERT ever been taken? Drives the profile surface's empty state. */
export function hasRiskResult() {
  return getRiskProfile().takes.length > 0;
}
