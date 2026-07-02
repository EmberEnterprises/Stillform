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

/* ── The longitudinal spine (2026-07-01, Arlin's go — the 1yr+ retention build).
      Three pure reads on the take history that already exists. ────────────── */

// First-pass default (flagged for Arlin): a "season" between re-takes.
const RETAKE_DAYS = 90;

/**
 * getGrowthRead — WHAT moved between the baseline take and the latest, for one
 * instrument. Null until there are >= 2 takes (no growth story from one point).
 * Qualitative only, per the framing law: reading titles and facet level words,
 * never numbers or scores.
 *
 * @returns {?{
 *   moved: boolean,                       // reading-level change
 *   from: {key:string, title:string},     // baseline reading
 *   to:   {key:string, title:string},     // latest reading
 *   facetShifts: Array<{label:string, from:string, to:string}>, // e.g. low → high
 *   firstAt: string, latestAt: string,
 * }}
 */
export function getGrowthRead(instrumentId) {
  const h = getInstrumentHistory(instrumentId);
  if (h.length < 2) return null;
  const first = h[0];
  const latest = h[h.length - 1];
  const fr = first?.results?.reading || null;
  const lr = latest?.results?.reading || null;
  if (!fr || !lr || !fr.key || !lr.key) return null;

  const facetShifts = [];
  const firstFacets = Array.isArray(first?.results?.facets) ? first.results.facets : [];
  const latestFacets = Array.isArray(latest?.results?.facets) ? latest.results.facets : [];
  for (const lf of latestFacets) {
    if (!lf || !lf.id) continue;
    const ff = firstFacets.find((f) => f && f.id === lf.id);
    if (ff && ff.level && lf.level && ff.level !== lf.level) {
      facetShifts.push({ label: lf.label || lf.id, from: ff.level, to: lf.level });
    }
  }

  return {
    moved: fr.key !== lr.key,
    from: { key: fr.key, title: fr.title || "" },
    to: { key: lr.key, title: lr.title || "" },
    facetShifts,
    firstAt: first.takenAt,
    latestAt: latest.takenAt,
  };
}

/**
 * getRetakeInvitation — invite (never auto-run) a re-take when the latest take
 * of an instrument is a season old. Null when never taken or still recent.
 * The user-initiated law holds: this only says "it's been a while."
 *
 * @returns {?{ daysSince: number }}
 */
export function getRetakeInvitation(instrumentId, nowMs = Date.now()) {
  const latest = getLatestResult(instrumentId);
  if (!latest || !latest.takenAt) return null;
  const takenMs = new Date(latest.takenAt).getTime();
  if (!Number.isFinite(takenMs)) return null;
  const daysSince = Math.floor((nowMs - takenMs) / (24 * 60 * 60 * 1000));
  return daysSince >= RETAKE_DAYS ? { daysSince } : null;
}

/**
 * formatCapacitiesForAI — the instruments' internal-only steer, finally
 * consumed. One compact line per TAKEN capacity: the latest relationship-level
 * reading key, plus the instrument's aiSteer when it set one, plus a moved-flag
 * when the read has changed since baseline. Null when nothing has been taken.
 * NEVER surfaced to the user; the backend carries the discretion rule.
 */
export function formatCapacitiesForAI() {
  const lines = [];
  for (const cap of CAPACITIES) {
    const latest = getLatestResult(cap.instrument);
    const reading = latest?.results?.reading;
    if (!reading || !reading.key) continue;
    let line = `${cap.loopLayer}: ${reading.key}`;
    const steer = latest?.results?.aiSteer;
    if (typeof steer === "string" && steer.trim()) line += ` (${steer.trim()})`;
    const growth = getGrowthRead(cap.instrument);
    if (growth && growth.moved) line += ` [moved from ${growth.from.key} since ${String(growth.firstAt).slice(0, 10)}]`;
    lines.push(line);
  }
  return lines.length ? lines.join("; ") : null;
}

export const _spine = { RETAKE_DAYS };
