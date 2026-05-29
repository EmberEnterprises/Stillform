// Move card run history — Phase 6.2d.
//
// A plain localStorage store, per the v2 convention: predictionLog,
// riskProfile, predictionErrors etc. are all plain stores. The old v1
// SYNC_KEYS / SECURE_KEYS registries do NOT apply here, by design (see the
// notes in predictionErrors.js / riskProfile.js). Records each Move card run
// so (a) selection can avoid repeating the last few moves, and (b) future
// surfaces can reflect what the user has actually run.
//
// Not a score and not a streak — this is history, not a tally. Nothing here
// counts toward a goal or is shown back as a number to beat (MOVE_CARD_FLOW
// _AUDIT.md §8 voice; CANON §10 reflect-don't-score).

const STORAGE_KEY = "stillform_move_card_history";
const MAX_ITEMS = 90; // parallel to other v2 history surfaces

function ls() {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch {
    /* localStorage can throw in privacy mode — treat as absent */
  }
  return null;
}

function genId() {
  return `move_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function readAll() {
  const store = ls();
  if (!store) return [];
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Record a Move card run (completed or ended early). Fail-silent.
 *
 * @param {object} run
 * @param {string|null} [run.sequenceId]
 * @param {number} [run.durationMs]
 * @param {boolean} [run.completed]   true if the full sequence finished
 * @param {string|null} [run.sourceState]  optional context (e.g. the Notice chip)
 * @returns {boolean}
 */
export function recordMoveRun({ sequenceId = null, durationMs = 0, completed = false, sourceState = null } = {}) {
  const store = ls();
  if (!store) return false;
  try {
    const list = readAll();
    list.push({
      id: genId(),
      timestamp: new Date().toISOString(),
      sequenceId: typeof sequenceId === "string" ? sequenceId : null,
      durationMs: typeof durationMs === "number" ? durationMs : 0,
      completed: !!completed,
      sourceState: typeof sourceState === "string" ? sourceState : null,
    });
    const trimmed = list.length > MAX_ITEMS ? list.slice(list.length - MAX_ITEMS) : list;
    store.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return true;
  } catch {
    return false;
  }
}

/**
 * Most-recent sequence ids (newest first), so selection can avoid repeating
 * the last few moves. Fail-silent → [].
 *
 * @param {number} [n=3]
 * @returns {string[]}
 */
export function getRecentMoveIds(n = 3) {
  try {
    const list = readAll();
    const ids = [];
    for (let i = list.length - 1; i >= 0 && ids.length < n; i--) {
      const id = list[i] && list[i].sequenceId;
      if (typeof id === "string" && id) ids.push(id);
    }
    return ids;
  } catch {
    return [];
  }
}
