/*
 * thread.js — the "Today" thread data layer.
 *
 * The home renders one editorial card titled "Today" containing a thread
 * of the precise names the user has built so far today, plus ONE active
 * prompt at the bottom — the next thing to do.
 *
 * This module provides the two reads the home needs:
 *
 *   getTodayThread(beat)
 *     → array of { time: "HH:MM", text: "named precision", source }
 *
 *   getActivePrompt(beat, threadLength)
 *     → { headline, body, actionLabel | null }
 *
 * Phase 2 audit: when the URL has `?beat=...` override, returns rich mock
 * data so every phase reads as a fully-lived day. When there's no
 * override, returns whatever today has actually accumulated from real
 * sessions (currently empty — Phase 2.5 wires session persistence to
 * stillform_v2_today_thread).
 *
 * Real-data path (Phase 2.5):
 *   - On Close of any session, append { time, text, source } to
 *     stillform_v2_today_thread localStorage key.
 *   - Reset the key when the local date changes (rollover at midnight
 *     in the user's timezone).
 *   - For users with prior history, optionally backfill from
 *     stillform_sessions on first v2 visit.
 */

import { getBeatOverride } from "./beat.js";

const THREAD_KEY = "stillform_v2_today_thread";

/* -----------------------------------------------------------------------
 * MOCK THREADS — what each phase looks like with a fully-lived day so far.
 *
 * Used when ?beat=... override is active. The thread should read as the
 * actual cognitive vocabulary a practitioner builds across a day — not
 * abstract emotion labels, but specific named situations.
 * -------------------------------------------------------------------- */

const MOCK_THREADS = {
  morning: [],
  main: [
    { time: "7:34", text: "tired but settled", source: "morning" },
  ],
  eod: [
    { time: "7:34",  text: "tired but settled", source: "morning" },
    { time: "10:12", text: "criticism spiraling about the pitch", source: "main" },
    { time: "14:33", text: "stuck before the team review", source: "main" },
    { time: "17:48", text: "wired but landing okay", source: "main" },
  ],
  "wind-down": [
    { time: "7:34",  text: "tired but settled", source: "morning" },
    { time: "10:12", text: "criticism spiraling about the pitch", source: "main" },
    { time: "14:33", text: "stuck before the team review", source: "main" },
    { time: "17:48", text: "wired but landing okay", source: "main" },
    { time: "21:30", text: "shipped the conversation I'd been avoiding", source: "eod" },
  ],
};

/* -----------------------------------------------------------------------
 * ACTIVE PROMPTS — one per phase, context-aware where needed.
 *
 * The active prompt block sits below the thread (separated by a hairline
 * divider when the thread isn't empty). It's the ONE thing to do next.
 *
 * Copy follows canon's "surface gets practice action" rule. No wellness
 * greeting, no "Composure is the foundation," no didactic explanation of
 * the practice. Just the invitation.
 *
 * Wind-down has NO actionLabel — per canon §10 (no review content within
 * ~2h of sleep, Walker / Stickgold). The user opens the app, sees "phone
 * down," and closes the app. The active prompt is the directive.
 * -------------------------------------------------------------------- */

const PROMPTS = {
  morning: {
    headline: "Open the day.",
    body: "A short check-in to set today's reps.",
    actionLabel: "Begin",
  },
  // Main has two variants depending on whether the thread has entries —
  // the user reads them differently when the day is fresh vs. underway.
  main_fresh: {
    headline: "Run today's first rep.",
    body: "Notice what's present. Build a precise name for it.",
    actionLabel: "Begin",
  },
  main_underway: {
    headline: "Run the next rep.",
    body: "When something's up. Or deepen a name from earlier.",
    actionLabel: "Begin",
  },
  eod: {
    headline: "Close the day.",
    body: "Two sentences. What stayed.",
    actionLabel: "Begin",
  },
  // Wind-down: no action. The directive IS the practice.
  "wind-down": {
    headline: "Phone down.",
    body: "Nothing more tonight. Tomorrow's reps begin where today's ended.",
    actionLabel: null,
  },
};

/**
 * Get the thread of named entries for today, for the given phase.
 *
 * In audit mode (?beat=... override set), returns mock data for the
 * overridden phase. Otherwise reads stillform_v2_today_thread and filters
 * to entries from today.
 *
 * @param {"morning"|"main"|"eod"|"wind-down"} beat
 * @returns {Array<{time: string, text: string, source: string}>}
 */
export function getTodayThread(beat) {
  // Audit mode: ?beat= override returns mock data so every phase reads as
  // a fully-lived day. This lets Arlin audit all four states on her phone
  // without having to wait for time to pass or fake sessions.
  if (getBeatOverride()) {
    return MOCK_THREADS[beat] || [];
  }

  // Real-data path: read stillform_v2_today_thread and filter to today's
  // entries. Empty for Phase 2 since the spine doesn't persist sessions
  // yet — Phase 2.5 wires this end-to-end.
  try {
    const raw = localStorage.getItem(THREAD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter to entries from today (user's local timezone).
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    return parsed.filter((entry) => entry && entry.dateKey === todayKey);
  } catch {
    return [];
  }
}

/**
 * Get the active prompt for the given phase. Resolves the main beat
 * variant (fresh vs underway) based on whether the thread has entries.
 *
 * @param {"morning"|"main"|"eod"|"wind-down"} beat
 * @param {number} threadLength
 * @returns {{headline: string, body: string, actionLabel: string|null}}
 */
export function getActivePrompt(beat, threadLength) {
  if (beat === "main") {
    return threadLength > 0 ? PROMPTS.main_underway : PROMPTS.main_fresh;
  }
  return PROMPTS[beat] || PROMPTS.main_fresh;
}

/**
 * Append an entry to the today thread (Phase 2.5 wiring point).
 *
 * Sessions in the spine will call this on Close, persisting their named
 * precision into the day's thread. The Home re-reads on mount /
 * visibilitychange so the line appears the next time the user lands on
 * home.
 *
 * Not used yet in Phase 2; exported now so the API is fixed before 2.5.
 *
 * @param {{text: string, source: "morning"|"main"|"eod"}} entry
 */
export function appendTodayEntry(entry) {
  if (!entry || typeof entry.text !== "string" || !entry.text.trim()) return;

  try {
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    const dateKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

    const raw = localStorage.getItem(THREAD_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const filtered = Array.isArray(existing)
      ? existing.filter((e) => e && e.dateKey === dateKey)
      : [];

    filtered.push({
      time,
      text: entry.text.trim(),
      source: entry.source || "main",
      dateKey,
      timestamp: now.toISOString(),
    });

    localStorage.setItem(THREAD_KEY, JSON.stringify(filtered));
  } catch {
    /* localStorage unavailable — fail silently */
  }
}
