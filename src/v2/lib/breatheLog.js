/**
 * breatheLog — the quick-breathe record (Pre-Walk Wave W2, 2026-07-09).
 *
 * Found during the exits audit: the app's MOST-USED practice was invisible
 * to the record — BreatheOverlay completed sessions into nothing. This log
 * fixes that with the smallest honest shape: timestamp + pattern + cycles.
 *
 * Deliberately NOT a spine session (saveSession is spine-shaped and feeds
 * milestones/AI context — polluting it would distort both). This is its own
 * quiet ledger. Consumers today: the DoneState acknowledgment ("2 today ·
 * in your record"). Consumers designed (S1, the catalog): P12 learned
 * preferences — which pattern actually works for this person.
 *
 * Laws honored: no streaks, no guilt, no ledger-of-absence — the log only
 * ever counts what happened, never what didn't.
 */

const KEY = "stillform_v2_breathe_log";
const CAP = 400; // plenty for pattern-learning; trimmed oldest-first

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function dayKey(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * Record a completed quick-breathe. Fail-silent (the practice never breaks
 * on storage problems — the session just doesn't persist this run).
 * @param {{ patternId?: string, cycles?: number }} entry
 * @returns {boolean}
 */
export function recordBreathe(entry = {}) {
  try {
    const log = read();
    log.push({
      ts: Date.now(),
      patternId: typeof entry.patternId === "string" ? entry.patternId : "unknown",
      cycles: Number.isFinite(entry.cycles) ? entry.cycles : null,
    });
    while (log.length > CAP) log.shift();
    localStorage.setItem(KEY, JSON.stringify(log));
    return true;
  } catch {
    return false;
  }
}

/** How many quick-breathes so far TODAY (including one just recorded). */
export function getTodayBreatheCount(nowMs = Date.now()) {
  const today = dayKey(nowMs);
  return read().filter((e) => dayKey(e.ts) === today).length;
}

/** Total on record. */
export function getBreatheCount() {
  return read().length;
}
