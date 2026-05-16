/*
 * mirror.js — Mirror strip data layer.
 *
 * The Mirror strip is the smart screen's most concentrated expression
 * of the User-AI relationship principles:
 *
 *   A. AI as through-line guide. The Mirror reflects what the USER has
 *      produced through their practice — patterns the AI has observed
 *      across the user's named work. It is NOT the AI interpreting the
 *      user's life. The user did the naming; the system reflects it
 *      back as a third-person observation.
 *
 *      Good: "Seven variants of criticism spiraling named over three
 *             weeks. Body always: shoulders, jaw."
 *      Bad:  "You seem stressed about criticism lately."
 *
 *   B. Self Mode as architecture. Mirror has TWO fallback states:
 *      - Cached observation (if AI Mediation pipeline previously
 *        generated one and it's still relevant)
 *      - Honest absence (section hidden entirely if no cache)
 *      NEVER show a faked or generic observation. Empty is better than
 *      degraded.
 *
 * Phase 3 ship state:
 *   - Cache reader implemented (returns null today because no AI
 *     Mediation pipeline writes here yet)
 *   - Mirror section in SmartScreen renders only when reader returns
 *     non-null — Phase 3 users see the smart screen without Mirror
 *   - Phase 5 (My Progress / AI Mediation) populates the cache with
 *     real observations; Mirror activates automatically
 *
 * Storage key: stillform_v2_mirror_cache
 * Shape:
 *   {
 *     observation: string,    // the editorial observation line
 *     generatedAt: ISO string,
 *     evidenceCount: number,  // how many sessions backed this observation
 *     stale_at?: ISO string,  // observation expires when user has had
 *                             //   significant new practice and the
 *                             //   pattern needs re-observation
 *   }
 */

const MIRROR_CACHE_KEY = "stillform_v2_mirror_cache";

/**
 * Read the current Mirror observation from cache. Returns null when no
 * cache exists or the cached observation has gone stale.
 *
 * In Phase 3 this returns null for all users — the AI Mediation
 * pipeline that writes here ships in Phase 5. The Mirror section in
 * SmartScreen is hidden until then.
 *
 * @returns {{observation: string, generatedAt: string, evidenceCount: number} | null}
 */
export function getMirrorObservation() {
  try {
    const raw = localStorage.getItem(MIRROR_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.observation !== "string" || !parsed.observation.trim()) {
      return null;
    }

    // Stale check — if the observation has an expiration timestamp and
    // we've passed it, treat as no observation (Phase 5+ may use this
    // to invalidate observations after enough new practice has happened
    // to warrant a fresh reading).
    if (parsed.stale_at) {
      try {
        const staleTime = new Date(parsed.stale_at).getTime();
        if (Date.now() > staleTime) return null;
      } catch {
        /* malformed stale_at — ignore the check */
      }
    }

    return {
      observation: parsed.observation.trim(),
      generatedAt: parsed.generatedAt || null,
      evidenceCount: typeof parsed.evidenceCount === "number" ? parsed.evidenceCount : 0,
    };
  } catch {
    return null;
  }
}

/**
 * Write a Mirror observation to cache. Called by the AI Mediation
 * pipeline (Phase 5+) when it generates a new observation worth
 * surfacing.
 *
 * Not called in Phase 3 — exported here so the API surface is fixed
 * before Phase 5 lands.
 *
 * @param {{observation: string, evidenceCount?: number, stale_at?: string}} entry
 */
export function setMirrorObservation(entry) {
  if (!entry || typeof entry.observation !== "string" || !entry.observation.trim()) return;
  try {
    const record = {
      observation: entry.observation.trim(),
      generatedAt: new Date().toISOString(),
      evidenceCount: typeof entry.evidenceCount === "number" ? entry.evidenceCount : 0,
      stale_at: typeof entry.stale_at === "string" ? entry.stale_at : null,
    };
    localStorage.setItem(MIRROR_CACHE_KEY, JSON.stringify(record));
  } catch {
    /* non-fatal */
  }
}
