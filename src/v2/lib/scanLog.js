/**
 * scanLog — the body-scan record (2026-07-15, exits-audit fix).
 *
 * Found by the exits-audit: the Body Scan persisted NOTHING — completing or
 * leaving early both just navigated away, so J4's "that counts" claimed a
 * record that didn't exist. This is the smallest honest fix: timestamp +
 * areas read + whether it was a full pass. Deliberately NOT a spine session
 * (saveSession feeds milestones/AI context; a scan is its own quiet ledger,
 * same as breatheLog).
 *
 * Laws: no streaks, no guilt, no ledger-of-absence — counts what happened only.
 * Partial credit is first-class: areasRead is the truth, full or not.
 */

const KEY = "stillform_v2_scan_log";
const CAP = 400;

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/**
 * Record a body scan — full or partial. Fail-silent (the practice never breaks
 * on a storage problem).
 * @param {{ areasRead: number, totalAreas: number }} entry
 * @returns {boolean}
 */
export function recordScan(entry = {}) {
  try {
    const areasRead = Number.isFinite(entry.areasRead) ? entry.areasRead : 0;
    if (areasRead < 1) return false; // nothing read = nothing to record
    const log = read();
    log.push({
      ts: Date.now(),
      areasRead,
      totalAreas: Number.isFinite(entry.totalAreas) ? entry.totalAreas : 6,
      full: areasRead >= (entry.totalAreas || 6),
    });
    while (log.length > CAP) log.shift();
    localStorage.setItem(KEY, JSON.stringify(log));
    return true;
  } catch {
    return false;
  }
}

/** Total scans on record (any length). */
export function getScanCount() {
  return read().length;
}
