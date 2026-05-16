/*
 * reframeApi.js — wrapper for the existing reframe.js Netlify function.
 *
 * The backend at /netlify/functions/reframe.js was built over months in
 * v1. v2 calls it with the same payload shape v1 uses so all AI prompts
 * (calm / clarity / hype routing, presence-first mode, framing law
 * compliance, etc.) work without modification.
 *
 * Response shape (from reframe.js ~line 2193):
 *   {
 *     reframe: string,           // main AI body — the practice content
 *     question?: string,         // optional follow-up question
 *     next_step?: string,        // optional suggested move
 *     scienceRoute: string|null, // which science route the AI took
 *     crisisDetected: boolean,   // safety flag
 *     liabilityGuard: boolean,   // financial/medical/legal flag
 *     ...telemetry
 *   }
 *
 * Phase 2 audit context: v2 sends minimal context (input, history,
 * feelState, install_id). Backend handles missing context gracefully.
 * Full context wiring (Trigger Profile, Bias Profile, Signal Profile,
 * Bio-filter, journal history, session count for invisible-leveling)
 * lands in Phase 3 with the Progress surfaces.
 */

import { getOrCreateInstallId } from "./identity.js";

const REFRAME_API_URL = "/.netlify/functions/reframe";

/**
 * Client-side mode routing per canon §7:
 *   excited/focused → hype
 *   stuck/anxious-spiral → clarity
 *   everything else → calm
 *
 * Matches v1's routing logic (src/App.jsx line 11517-11518).
 *
 * @param {string|null} feelState — chip id or free-text precision name
 * @param {string} input — the user's message (used for content-based routing)
 * @returns {"calm"|"clarity"|"hype"}
 */
export function routeMode(feelState, input = "") {
  const fs = (feelState || "").toLowerCase();
  if (fs === "excited" || fs === "focused") return "hype";
  if (fs === "stuck") return "clarity";

  // Content-based fallback — detect spiral / clarity-seeking language.
  const lower = (input || "").toLowerCase();
  const spiralCues = [
    "spiral", "spiraling", "can't think", "can't decide",
    "going in circles", "stuck on", "what if", "should i",
  ];
  if (spiralCues.some((c) => lower.includes(c))) return "clarity";

  return "calm";
}

/**
 * Send a message to the reframe AI.
 *
 * @param {object} params
 * @param {string} params.input               user message text
 * @param {Array<{role:"user"|"assistant",text:string}>} params.history  prior messages
 * @param {string|null} params.feelState      named state from Notice
 * @param {"morning"|"main"|"eod"|"wind-down"|null} [params.beat]
 *   The locked beat for this session (from Spine.jsx). The backend uses
 *   it to inject BEAT_ADDITIONS into contextParts. Defaults to null.
 * @param {Array<{time:string,text:string,source:string}>|null} [params.todayThread]
 *   Today's named thread entries (Phase 4 #4). Only EOD beat uses this
 *   — backend injects as context so AI can help user distill what
 *   landed across the day. Null/empty for non-EOD beats.
 * @returns {Promise<{reframe: string, question?: string, next_step?: string, error?: string, crisisDetected?: boolean}>}
 */
export async function sendReframeMessage({ input, history = [], feelState = null, beat = null, todayThread = null }) {
  const install_id = getOrCreateInstallId();
  if (!install_id) {
    return { reframe: "", error: "Could not establish session identity. Check browser storage permissions." };
  }

  const mode = routeMode(feelState, input);

  try {
    const response = await fetch(REFRAME_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input,
        history,
        mode,
        feelState,
        install_id,
        // Phase 4 #3 (May 16, 2026): pass beat through so backend can
        // inject BEAT_ADDITIONS. Null for any pre-Phase-4 caller is
        // back-compat — backend treats absent beat as no addition.
        beat,
        // Phase 4 #4 (May 16, 2026): pass today's thread for EOD beat
        // so AI can distill what landed. Null for non-EOD beats —
        // backend only injects when beat === "eod".
        todayThread,
        // Phase 2 minimal context. These all default safely on the backend.
        bioFilter: null,
        signalProfile: null,
        biasProfile: null,
        triggerProfile: null,
        checkinContext: null,
        eodContext: null,
        sessionCount: 0,
        priorModeContext: null,
        priorToolContext: null,
        journalContext: null,
      }),
    });

    if (response.status === 401) {
      return { reframe: "", error: "Session not recognized. Try reloading." };
    }
    if (response.status === 429) {
      return { reframe: "", error: "Rate limit — take a moment, then try again." };
    }
    if (!response.ok) {
      return { reframe: "", error: `Connection issue (${response.status}). Try again.` };
    }

    const data = await response.json();

    const text = data && typeof data.reframe === "string" ? data.reframe.trim() : "";
    if (!text) {
      return { reframe: "", error: "Empty response. Try again." };
    }

    return {
      reframe: text,
      question: data && typeof data.question === "string" ? data.question : undefined,
      next_step: data && typeof data.next_step === "string" ? data.next_step : undefined,
      crisisDetected: !!(data && data.crisisDetected),
    };
  } catch (err) {
    return { reframe: "", error: "Connection issue. Check your network." };
  }
}
