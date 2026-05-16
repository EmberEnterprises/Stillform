/*
 * sessions.js — v2 session persistence module.
 *
 * Per master todo Phase 3 spec: "Session persistence:
 * `stillform_v2_sessions` storage key; saves after Reframe Close."
 *
 * Each completed Notice → Reframe → Close session writes one record
 * here. Other v2 surfaces (Mirror strip, Trajectory, future AI mediation)
 * read from this store. The store is local-first (offline-capable);
 * cloud sync layers on later via the existing Supabase backend.
 *
 * Self Mode fallback architecture (per locked principle B): this module
 * has zero AI dependency. Sessions persist regardless of AI state.
 *
 * Storage shape per session:
 *   {
 *     id:                string,    // ulid-like, generated client-side
 *     timestamp:         string,    // ISO 8601
 *     dateKey:           string,    // "YYYY-M-D" local
 *     precisionName:     string,    // user's named precision from Notice
 *     selectedChip:      string|null,  // optional chip from Notice
 *     takeaway:          string|null,  // USER'S named takeaway from Close (Phase 3.5 #2 — formerly the AI's final reframe; now the user's own naming)
 *     surfacedFrame:     string|null,  // what was surfaced before Close (AI's last reply OR SelfReframe's last answer). Preserved for Mirror / Library / Pattern Disruption downstream surfaces. (Phase 3.5 #2)
 *     mode:              "calm"|"clarity"|"hype"|"self",
 *     selfMode:          boolean,
 *     conversationLength: number,   // turns in the Reframe step
 *     beat:              "morning"|"main"|"eod"|"wind-down",
 *   }
 *
 * Cap: 500 most-recent sessions. Older sessions drop off (FIFO). For the
 * affluence audience this is roughly 1+ year of daily practice; beyond
 * that, cloud sync history holds the long tail.
 */

const SESSIONS_KEY = "stillform_v2_sessions";
const MAX_SESSIONS = 500;

/**
 * Generate a sortable session id (timestamp-based, not cryptographically
 * unique but unique enough within a single user's local store).
 */
function generateSessionId() {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${ts}-${rand}`;
}

/**
 * Compute local-date key in user's timezone (matches thread.js shape so
 * the two stores can cross-reference cleanly).
 */
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * Save a completed session. Called from Spine.jsx when transitioning to
 * Close, with all session state collected in one place.
 *
 * Fails silently when localStorage is unavailable (incognito with strict
 * settings, etc.). The user's practice doesn't break — the session just
 * doesn't persist this run.
 *
 * @param {object} session  — partial session record (id + timestamp filled here)
 * @returns {boolean}  true on success, false on any failure
 */
export function saveSession(session) {
  if (!session || typeof session !== "object") return false;

  try {
    const now = new Date();
    const record = {
      id: generateSessionId(),
      timestamp: now.toISOString(),
      dateKey: todayKey(),
      precisionName: typeof session.precisionName === "string" ? session.precisionName.trim() : "",
      selectedChip: typeof session.selectedChip === "string" ? session.selectedChip : null,
      takeaway: typeof session.takeaway === "string" ? session.takeaway.trim() : null,
      surfacedFrame: typeof session.surfacedFrame === "string" ? session.surfacedFrame.trim() : null,
      mode: typeof session.mode === "string" ? session.mode : "calm",
      selfMode: !!session.selfMode,
      conversationLength: typeof session.conversationLength === "number" ? session.conversationLength : 0,
      beat: typeof session.beat === "string" ? session.beat : "main",
    };

    const raw = localStorage.getItem(SESSIONS_KEY);
    let existing = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) existing = parsed;
      } catch {
        existing = [];
      }
    }

    existing.push(record);

    // FIFO cap. Keep most recent MAX_SESSIONS.
    if (existing.length > MAX_SESSIONS) {
      existing = existing.slice(existing.length - MAX_SESSIONS);
    }

    localStorage.setItem(SESSIONS_KEY, JSON.stringify(existing));
    return true;
  } catch {
    return false;
  }
}

/**
 * Read all stored sessions (newest last in storage; callers reverse if
 * they want newest-first).
 *
 * @returns {Array<object>}  empty array on any read failure
 */
export function getSessions() {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Total lifetime session count. Used by trajectory + invisible-leveling
 * features (sessionCount feeds into AI prompts as one of the routing
 * inputs).
 *
 * @returns {number}
 */
export function getSessionCount() {
  return getSessions().length;
}

/**
 * Most recent N sessions (newest first). Used by Mirror strip + future
 * Spaced return surface.
 *
 * @param {number} n  default 10
 * @returns {Array<object>}
 */
export function getRecentSessions(n = 10) {
  const all = getSessions();
  return all.slice(-n).reverse();
}

/**
 * Distinct days the user has practiced. For Trajectory's "days active"
 * stat. Distinct date-keys across the session store.
 *
 * @returns {number}
 */
export function getDistinctPracticeDays() {
  const sessions = getSessions();
  const keys = new Set();
  for (const s of sessions) {
    if (s && typeof s.dateKey === "string") keys.add(s.dateKey);
  }
  return keys.size;
}
