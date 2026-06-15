/*
 * activePrompt.js — Active prompt section data layer.
 *
 * Per master todo locked principles:
 *   A. AI as through-line guide — the active prompt is one of the
 *      surfaces where AI presence lives. Generated state-aware copy in
 *      confidant voice.
 *   B. Self Mode as architecture — every AI surface has a fallback.
 *      When AI is unavailable (offline, endpoint failure, future-endpoint-
 *      not-yet-built), the active prompt falls back to static per-beat
 *      copy in confidant voice — still observation + invitation, never
 *      generic.
 *
 * Phase 3 ship state:
 *   - Fallback path FULLY OPERATIONAL — confidant-voice static prompts
 *     ship and work today, before any backend endpoint exists.
 *   - AI generation path STUBBED — the consumer asks for a prompt
 *     via getActivePromptAsync(), the function attempts an AI fetch,
 *     and on failure (which is always in Phase 3 because the endpoint
 *     doesn't exist yet) returns the fallback. Future enhancement:
 *     build /netlify/functions/active-prompt to populate the AI path.
 *
 * Architectural note: keeping the AI call site in the module today,
 * even though it always fails, means the consumer is already coded for
 * the AI-first / fallback-second flow. When the backend endpoint comes
 * online, the consumer doesn't change — AI prompts just start showing
 * up. The locked principle ("builds with Self Mode fallback architecture
 * from day one") is preserved literally.
 *
 * Prompt voice (per User-AI relationship principle A):
 *   Observation + invitation. Never directive command.
 *   Good: "Heavy day held. Begin when ready."
 *   Bad:  "Let's begin your morning check-in now."
 */

import { getSmartFloorPrompt } from "./smartPromptFloor.js";

const AI_ACTIVE_PROMPT_URL = "/.netlify/functions/active-prompt";
const CACHE_KEY = "stillform_v2_active_prompt_cache";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 min

/* -----------------------------------------------------------------------
 * STATIC FALLBACK PROMPTS — confidant voice, observation + invitation.
 *
 * Each variant: { headline, body, actionLabel }
 *
 * Per Phase 4 #2 (locked May 16, 2026): copy refreshed across all beats
 * to align with beatConfig.js's variant configs.
 *
 * Two-state variants where the beat has a "done" signal we can read
 * from threadLength:
 *   - main: fresh (no entries yet) vs underway (>=1 entry)
 *   - morning: fresh (no entries yet) vs done (>=1 entry, anchor already
 *     set — body shifts from invitation to acknowledgment, no action)
 *
 * Wind-down: now HAS an actionLabel ("Set tomorrow's anchor") because Phase 4 #5 ships
 * the minimal wind-down flow (tomorrow anchor → Deep Regulate → close).
 * Canon §10's no-review-within-2h-of-sleep concern is preserved — the
 * wind-down flow is forward-anchor + breathing, never retrospective.
 * EOD owns the retrospective close.
 * -------------------------------------------------------------------- */

const FALLBACK_PROMPTS = {
  morning_fresh: {
    headline: "Today opens here.",
    body: "Set what it needs from you.",
    actionLabel: "Name what today needs",
  },
  morning_done: {
    headline: "Today's anchor is set.",
    body: "Use the day.",
    actionLabel: null,
  },
  main_fresh: {
    headline: "The day waits for a first rep.",
    body: "Notice what's present. Name it precisely.",
    actionLabel: "Name what's present",
  },
  main_underway: {
    headline: "The day is underway.",
    body: "Run the next rep — when something's up, or to deepen a name from earlier.",
    actionLabel: "Name what's present",
  },
  eod: {
    headline: "Day's been carried.",
    body: "Close it with care.",
    actionLabel: "Name what landed",
  },
  "wind-down": {
    headline: "Phone down soon.",
    body: "Tomorrow's one anchor?",
    actionLabel: "Set tomorrow's anchor",
  },
};

/**
 * Synchronous fallback prompt — guaranteed to return a result. Used
 * during render before any AI fetch resolves, and as the final fallback
 * when AI returns nothing.
 *
 * Main and morning both use threadLength to split between fresh and
 * "underway"/"done" variants. The signal is imperfect (a thread entry
 * could be from any beat earlier in the day) but reasonable for Phase 4;
 * the AI generation path will refine it later with full session context.
 *
 * @param {"morning"|"main"|"eod"|"wind-down"} beat
 * @param {number} threadLength  number of entries in today's thread
 * @returns {{headline: string, body: string, actionLabel: string|null, source: "fallback"}}
 */
export function getFallbackActivePrompt(beat, threadLength) {
  // M4 smart floor: deterministic pattern-aware line from local stores
  // (zero AI cost; date-gated; yields null most days by design).
  const smart = getSmartFloorPrompt(beat, threadLength);
  if (smart) return smart;

  if (beat === "main") {
    const variant = threadLength > 0 ? FALLBACK_PROMPTS.main_underway : FALLBACK_PROMPTS.main_fresh;
    return { ...variant, source: "fallback" };
  }
  if (beat === "morning") {
    const variant = threadLength > 0 ? FALLBACK_PROMPTS.morning_done : FALLBACK_PROMPTS.morning_fresh;
    return { ...variant, source: "fallback" };
  }
  const variant = FALLBACK_PROMPTS[beat] || FALLBACK_PROMPTS.main_fresh;
  return { ...variant, source: "fallback" };
}

/**
 * Try to fetch an AI-generated active prompt. Returns the fallback on
 * any failure (network, missing endpoint, malformed response).
 *
 * In Phase 3 this function ALWAYS returns the fallback because the
 * backend endpoint /netlify/functions/active-prompt doesn't exist yet
 * (it returns 404). That's by design — the fallback path is the
 * day-one user experience; AI generation slots in later without
 * changing the consumer code.
 *
 * @param {object} params
 * @param {"morning"|"main"|"eod"|"wind-down"} params.beat
 * @param {number} params.threadLength
 * @param {number} params.sessionCount
 * @returns {Promise<{headline: string, body: string, actionLabel: string|null, source: "ai"|"fallback"|"cache"}>}
 */
export async function getActivePromptAsync({ beat, threadLength, sessionCount }) {
  // Cache hit path — recent AI generation, return it.
  const cached = readCache(beat);
  if (cached) {
    return { ...cached, source: "cache" };
  }

  // AI fetch path — always fails in Phase 3 because the endpoint
  // doesn't exist yet. Catches all error types and falls through to
  // the fallback. When the backend endpoint is built, this path starts
  // returning AI-generated prompts without consumer changes.
  try {
    const response = await fetch(AI_ACTIVE_PROMPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ beat, threadLength, sessionCount }),
    });
    if (!response.ok) throw new Error("non-ok");

    const data = await response.json();
    if (!data || typeof data.headline !== "string") throw new Error("malformed");

    const ai = {
      headline: data.headline.trim(),
      body: typeof data.body === "string" ? data.body.trim() : "",
      // Phase 4 #2: wind-down no longer forces null actionLabel — the
      // wind-down flow (tomorrow anchor + Deep Regulate) ships in #5.
      actionLabel: typeof data.actionLabel === "string" ? data.actionLabel : "Begin",
    };

    writeCache(beat, ai);
    return { ...ai, source: "ai" };
  } catch {
    return getFallbackActivePrompt(beat, threadLength);
  }
}

/* -----------------------------------------------------------------------
 * CACHE — short-lived, per-beat. Avoids hitting the AI endpoint on every
 * home render. TTL ~10 min so the prompt feels fresh through a typical
 * use window but doesn't burn API calls.
 * -------------------------------------------------------------------- */

function readCache(beat) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const entry = parsed && parsed[beat];
    if (!entry || typeof entry.expiresAt !== "number") return null;
    if (Date.now() > entry.expiresAt) return null;
    return {
      headline: entry.headline,
      body: entry.body,
      actionLabel: entry.actionLabel,
    };
  } catch {
    return null;
  }
}

function writeCache(beat, prompt) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    const next = (existing && typeof existing === "object") ? existing : {};
    next[beat] = {
      headline: prompt.headline,
      body: prompt.body,
      actionLabel: prompt.actionLabel,
      expiresAt: Date.now() + CACHE_TTL_MS,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(next));
  } catch {
    /* cache write failure is non-fatal */
  }
}
