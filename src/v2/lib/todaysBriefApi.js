/**
 * todaysBriefApi — v2 client for the Today's Brief artifact (the morning end of
 * the app→life bridge; the evening end is the EOD artifact).
 *
 * Thin wrapper over netlify/functions/todays-brief.js (built in V1, never given
 * a v2 front end until now — June 23 2026). The backend returns a four-section
 * operator-tier brief:
 *   - hardware  — the body/state read for the day (Barrett 2017)
 *   - risks     — today's load-bearing events or triggers (Lazarus 1991)
 *   - moves     — if-then implementation intentions (Gollwitzer 1999)
 *   - recovery  — the downregulation plan that buys back capacity (Sheppes & Gross 2011)
 * gpt-4o, origin + IP-rate-limit gated. Voice is enforced server-side; the
 * client never re-prompts or post-processes the brief text.
 *
 * NOTE on inputs (read-before-build, June 23): the backend was written for V1's
 * richer morning check-in (energy / bio-filter / tension sliders). The v2 spine
 * morning beat collects far less — Notice + chip + precision. So the gatherer
 * maps what v2 actually has (mood, precision, trigger/bias profiles, recent
 * practice, calendar if present) and leaves the rest empty. The backend is
 * empty-safe; the brief is leaner than V1's until/unless the morning beat is
 * enriched (separate, flagged decision).
 */

import { formatTriggerProfileForAI } from "./triggerProfile.js";
import { formatBiasProfileForAI } from "./biasProfile.js";
import { getSessionCount } from "./sessions.js";

const TODAYS_BRIEF_API_URL = "/.netlify/functions/todays-brief";
const STORAGE_KEY = "stillform_todays_brief";

/** Local date key (YYYY-MM-DD) in the user's own timezone. */
function localDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Assemble the backend payload from whatever v2 actually has. Every field is
 * optional and empty-safe — the backend slices empties and the model skips
 * falsy values. Never throws.
 *
 * @param {object} [checkinPayload] — the morning beat completion payload
 *   ({ date, mood, precision, beat }) written to stillform_checkin_today.
 * @returns {object} payload for POST /todays-brief
 */
export function gatherTodaysBriefInputs(checkinPayload = {}) {
  const safe = (fn, fallback) => {
    try { return fn(); } catch { return fallback; }
  };

  const mood = checkinPayload && typeof checkinPayload.mood === "string" ? checkinPayload.mood : "";
  // The named precision is the closest thing v2's morning beat has to an
  // "outcome focus" — what the user is orienting the day around.
  const precision = checkinPayload && typeof checkinPayload.precision === "string" ? checkinPayload.precision : "";

  const triggerProfile = safe(() => formatTriggerProfileForAI() || "", "");
  const biasProfile = safe(() => formatBiasProfileForAI() || "", "");
  const recentSessionsCount = safe(() => Number(getSessionCount()) || 0, 0);

  // Calendar is best-effort: only present if the user granted consent and the
  // events array exists. Absent → empty (no calendar-driven risks line).
  const calendarEvents = safe(() => {
    const raw = localStorage.getItem("stillform_calendar_events");
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr)
      ? arr.slice(0, 6).map((e) => ({ title: String(e?.title || "").slice(0, 80), start: String(e?.start || "").slice(0, 40) }))
      : [];
  }, []);

  return {
    morningMood: mood,
    outcomeFocus: precision,
    triggerProfile,
    biasProfile,
    recentSessionsCount,
    calendarEvents,
    // Fields v2's morning beat does not collect — empty, backend-safe:
    morningEnergy: "",
    bioFilter: [],
    tensionAreas: [],
    signalProfile: "",
  };
}

/**
 * Generate Today's Brief. Returns a clean object the surface renders.
 *
 * @param {object} inputs — payload from gatherTodaysBriefInputs (or any subset)
 * @returns {Promise<{hardware: string|null, risks: string|null, moves: string|null, recovery: string|null, error: string|null}>}
 */
export async function generateTodaysBrief(inputs = {}) {
  const empty = { hardware: null, risks: null, moves: null, recovery: null };
  try {
    const response = await fetch(TODAYS_BRIEF_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs || {}),
    });

    if (response.status === 403) return { ...empty, error: "Origin not allowed." };
    if (response.status === 429) return { ...empty, error: "Take a moment, then try again." };
    if (!response.ok) return { ...empty, error: `Connection issue (${response.status}). Try again.` };

    const data = await response.json();
    const get = (k) => (data && typeof data[k] === "string" && data[k].trim() ? data[k].trim() : null);
    const hardware = get("hardware");
    const risks = get("risks");
    const moves = get("moves");
    const recovery = get("recovery");

    if (!hardware && !risks && !moves && !recovery) {
      return { ...empty, error: "Empty brief. Try again." };
    }
    try { window.plausible?.("Today's Brief Generated"); } catch { /* analytics non-fatal */ }
    return { hardware, risks, moves, recovery, error: null };
  } catch {
    return { ...empty, error: "Couldn't reach the network. Try again." };
  }
}

/**
 * Persist today's brief, day-keyed. One brief per day; a new day replaces the
 * prior. Never throws.
 */
export function saveTodaysBrief(brief) {
  if (!brief || (!brief.hardware && !brief.risks && !brief.moves && !brief.recovery)) return false;
  try {
    const record = {
      date: localDateKey(),
      hardware: brief.hardware || null,
      risks: brief.risks || null,
      moves: brief.moves || null,
      recovery: brief.recovery || null,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    return true;
  } catch {
    return false;
  }
}

/**
 * Read today's brief if one exists for the current local day, else null.
 * A stored brief from a prior day is treated as absent (one per day).
 */
export function readTodaysBrief() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const record = JSON.parse(raw);
    if (!record || record.date !== localDateKey()) return null;
    return record;
  } catch {
    return null;
  }
}
