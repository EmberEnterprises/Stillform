/*
 * identity.js — install_id helper.
 *
 * Matches v1's stillform_install_id key exactly so v2 users have the same
 * identity v1 created. Backend (reframe.js et al.) requires install_id
 * or user_id for auth.
 *
 * Shape matches v1's getOrCreateInstallId (src/App.jsx ~line 10550):
 *   - reads stillform_install_id from localStorage
 *   - creates a crypto.randomUUID() on first call if missing
 *   - falls back to sf_<timestamp>_<random> if crypto unavailable
 */

const INSTALL_ID_KEY = "stillform_install_id";

export function getOrCreateInstallId() {
  try {
    const existing = localStorage.getItem(INSTALL_ID_KEY);
    if (existing) return existing;
    const next =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `sf_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(INSTALL_ID_KEY, next);
    return next;
  } catch {
    return null;
  }
}
