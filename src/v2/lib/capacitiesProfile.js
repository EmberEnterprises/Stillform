/**
 * capacitiesProfile.js — data layer for the Bias Profile's CAPACITIES surface.
 *
 * Bias Profile build, Step 3a (the growth-mirror data store; the mirror
 * SCREEN is Step 3b). Per the May 20 architecture lock, the capacities
 * surface mirrors the user's growth in the four skills Stillform trains,
 * mapped to its own loop:
 *
 *   sense       — MAIA-2  (interoception / body sense)
 *   settle      — ERQ     (regulation; reappraisal = Reframe)
 *   see-self    — SRIS    (metacognition; reflection→insight)
 *   see-others  — IRI     (perspective-taking / empathy)
 *
 * IMPORTANT — this layer is interpretation-agnostic by design. It ONLY
 * stores and retrieves instrument results over time. The meaning of those
 * results (capacity / nuanced / profile framing, per-subscale bands,
 * before/after copy) lives with the instrument scoring (Step 5) and the
 * mirror screen (Step 3b). This layer stores whatever results object an
 * instrument produces and hands the history back; it never decides what a
 * result means. That keeps the result-framing rules in one place (the
 * specs + screen) instead of leaking into storage.
 *
 * Mirrors the triggerProfile.js / biasProfile.js pattern: localStorage,
 * fail-silent, never throws into the UI. This is NOT the watch list —
 * that's biasProfile.js (the pattern-work surface).
 */

const STORAGE_KEY = "stillform_capacities_profile";

/**
 * The four capacities Stillform trains, each fed by one Workshop instrument.
 * Structural mapping only — user-facing copy (labels, framing, practice
 * prompts) is pulled from the instrument specs in the mirror screen, not
 * hard-coded here.
 */
export const CAPACITIES = Object.freeze([
  Object.freeze({ id: "sense", loopLayer: "Sense", instrument: "maia2", label: "Body sense" }),
  Object.freeze({ id: "settle", loopLayer: "Settle", instrument: "erq", label: "Settling" }),
  Object.freeze({ id: "see-self", loopLayer: "See yourself", instrument: "sris", label: "Seeing yourself" }),
  Object.freeze({ id: "see-others", loopLayer: "See others", instrument: "iri", label: "Seeing others" }),
]);

export const CAPACITY_INSTRUMENTS = Object.freeze(CAPACITIES.map((c) => c.instrument));

export function getCapacityById(id) {
  return CAPACITIES.find((c) => c.id === id) || null;
}

export function getCapacityByInstrument(instrumentId) {
  return CAPACITIES.find((c) => c.instrument === instrumentId) || null;
}

/** Read the stored profile. Always returns a valid shape; fail-silent. */
export function getCapacitiesProfile() {
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
export function saveCapacitiesProfile(profile) {
  try {
    if (!profile || !Array.isArray(profile.takes)) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}

/**
 * Record a completed instrument result.
 * @param {Object} arg
 * @param {string} arg.instrumentId — one of CAPACITY_INSTRUMENTS
 * @param {*} arg.results — instrument-specific result object (stored as-is)
 * @returns {boolean} success
 */
export function recordInstrumentResult({ instrumentId, results } = {}) {
  if (!instrumentId || !CAPACITY_INSTRUMENTS.includes(instrumentId)) return false;
  const profile = getCapacitiesProfile();
  profile.takes.push({
    instrumentId,
    results: results ?? null,
    takenAt: new Date().toISOString(),
  });
  return saveCapacitiesProfile(profile);
}

/** Chronological history (oldest → newest) for one instrument. */
export function getInstrumentHistory(instrumentId) {
  return getCapacitiesProfile()
    .takes.filter((t) => t.instrumentId === instrumentId)
    .sort((a, b) => new Date(a.takenAt).getTime() - new Date(b.takenAt).getTime());
}

/** Most recent take for an instrument, or null. */
export function getLatestResult(instrumentId) {
  const h = getInstrumentHistory(instrumentId);
  return h.length ? h[h.length - 1] : null;
}

/** First (baseline) take for an instrument, or null — the "before" in before/after. */
export function getFirstResult(instrumentId) {
  const h = getInstrumentHistory(instrumentId);
  return h.length ? h[0] : null;
}

/** Has this instrument ever been taken? */
export function hasResult(instrumentId) {
  return getInstrumentHistory(instrumentId).length > 0;
}

/** Any capacity instrument taken at all? Drives the mirror's empty state. */
export function hasAnyResult() {
  return getCapacitiesProfile().takes.length > 0;
}

/**
 * Structured summary across the four capacities, for the mirror screen.
 * Each entry: { capacity, instrument, taken, takeCount, first, latest }.
 * Interpreting `first`/`latest` (the actual growth read) is the screen's job.
 */
export function getCapacitiesSummary() {
  return CAPACITIES.map((cap) => {
    const history = getInstrumentHistory(cap.instrument);
    return {
      capacity: cap,
      instrument: cap.instrument,
      taken: history.length > 0,
      takeCount: history.length,
      first: history.length ? history[0] : null,
      latest: history.length ? history[history.length - 1] : null,
    };
  });
}
