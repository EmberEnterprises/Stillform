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
 *     nextMove:          string|null,  // PCE.1 — implementation intention named at Close ("next time X, I do Y" — Gollwitzer). The forward rep.
 *     lockIn:            string|null,  // PCE.1 — forward commitment locked in at Close (Bandura mastery). With nextMove, this is "the frame you landed on" that PCE.2 reactivates on a recurring trigger.
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
      nextMove: typeof session.nextMove === "string" ? session.nextMove.trim() : null,
      lockIn: typeof session.lockIn === "string" ? session.lockIn.trim() : null,
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
 * Format recent sessions into a continuity string for the Reframe AI.
 *
 * AI Context Reconnection Wave 3 (May 27, 2026). Sessions persist what the
 * user named, the frame that surfaced, and their takeaway — genuine
 * multi-day continuity, and the only persisted session *content* in this
 * build. This feeds the AI a "what they've worked through before" read so it
 * can recognize recurring threads across days. The framing (reference
 * sparingly, never re-litigate) lives in the backend injection. Sessions with
 * no content (metadata-only) are skipped. Fields are capped to keep the AI
 * context window bounded. Fail-silent → null.
 *
 * @param {number} [n=8]  most recent sessions to consider
 * @returns {string|null}  formatted lines, or null if none carry content
 */
export function formatRecentSessionsForAI(n = 8) {
  try {
    const recent = getRecentSessions(n);
    if (!recent.length) return null;
    const now = Date.now();
    const lines = [];
    for (const sess of recent) {
      if (!sess) continue;
      const name = typeof sess.precisionName === "string" ? sess.precisionName.trim() : "";
      const frame = typeof sess.surfacedFrame === "string" ? sess.surfacedFrame.trim() : "";
      const takeaway = typeof sess.takeaway === "string" ? sess.takeaway.trim() : "";
      const nextMove = typeof sess.nextMove === "string" ? sess.nextMove.trim() : "";
      const lockIn = typeof sess.lockIn === "string" ? sess.lockIn.trim() : "";
      if (!name && !frame && !takeaway && !nextMove && !lockIn) continue; // metadata-only session
      let when = "recently";
      const t = sess.timestamp ? new Date(sess.timestamp).getTime() : NaN;
      if (Number.isFinite(t)) {
        const days = Math.floor((now - t) / 86400000);
        when = days <= 0 ? "today" : days === 1 ? "yesterday" : `${days} days ago`;
      }
      const parts = [];
      if (name) parts.push(`named "${name.slice(0, 80)}"`);
      if (frame) parts.push(`frame that surfaced: ${frame.slice(0, 120)}`);
      if (takeaway) parts.push(`takeaway: ${takeaway.slice(0, 120)}`);
      if (nextMove) parts.push(`next move they set: ${nextMove.slice(0, 120)}`);
      if (lockIn) parts.push(`locked in: ${lockIn.slice(0, 120)}`);
      lines.push(`- ${when}: ${parts.join("; ")}`);
    }
    return lines.length ? lines.join("\n") : null;
  } catch {
    return null;
  }
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
