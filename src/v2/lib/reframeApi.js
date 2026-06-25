/*
 * reframeApi.js — wrapper for the existing reframe.js Netlify function.
 *
 * The backend at /netlify/functions/reframe.js was built over months in
 * Stillform calls this with a stable payload shape so all AI prompts
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
 * AI Context Reconnection (May 27, 2026): the backend has always consumed
 * the full context stack; the client stopped sending it after the rebuild
 * ("Phase 2 minimal context"). Wave 1 wired below — Bias Profile, Trigger
 * Profile, session count (invisible leveling). Wave 2 pending — journal
 * history, Context Profile (needs backend), check-in/EOD, AI session notes.
 * Signal Profile + bio-filter have no source module in this build.
 */

import { getOrCreateInstallId } from "./identity.js";
import { formatBiasProfileForAI } from "./biasProfile.js";
import { formatTriggerProfileForAI } from "./triggerProfile.js";
import { getSessionCount, formatRecentSessionsForAI } from "./sessions.js";
import { formatContextProfileForAI } from "./contextProfile.js";
import { formatConfirmedFindingsForAI } from "./discoveryFindings.js";

const REFRAME_API_URL = "/.netlify/functions/reframe";

/**
 * Client-side mode routing per canon §7:
 *   excited/focused → hype
 *   stuck/anxious-spiral → clarity
 *   everything else → calm
 *
 * Routing follows the canonical mode → prompt mapping in reframe.js.
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
 * @returns {Promise<{reframe: string, question?: string, next_step?: string, log_prediction?: {text:string,confidence:number}|null, error?: string, crisisDetected?: boolean}>}
 */
export async function sendReframeMessage({ input, history = [], feelState = null, beat = null, todayThread = null }) {
  const install_id = getOrCreateInstallId();
  if (!install_id) {
    return { reframe: "", error: "Could not establish session identity. Check browser storage permissions." };
  }

  const mode = routeMode(feelState, input);

  // AI Context Reconnection — Wave 1 (May 27, 2026): gather persistent
  // context from device stores here so the backend (which has always
  // consumed these) actually receives them. Caller needs no change. All
  // null/empty-safe; the backend skips falsy values (empty watch list /
  // no triggers / 0 sessions inject nothing).
  const biasProfile = formatBiasProfileForAI();
  const triggerProfile = formatTriggerProfileForAI();
  const sessionCount = getSessionCount();
  const contextProfile = formatContextProfileForAI();
  const priorSessions = formatRecentSessionsForAI();
  const confirmedFindings = formatConfirmedFindingsForAI();

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
        biasProfile,
        triggerProfile,
        contextProfile,
        priorSessions,
        confirmedFindings,
        checkinContext: null,
        eodContext: null,
        sessionCount,
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

    // log_prediction (Precision Framework §5 #2 — What You Bet On). Server
    // already shape-validated; defensive check before exposing to UI.
    let logPrediction = null;
    const lp = data && data.log_prediction;
    if (lp && typeof lp === "object" && typeof lp.text === "string" && lp.text.length > 0) {
      // CORE LOOP L2: confidence may be null (a bet without a stated number).
      const conf = typeof lp.confidence === "number" && Number.isFinite(lp.confidence) ? lp.confidence : null;
      logPrediction = { text: lp.text, confidence: conf };
    }

    // CORE LOOP L2 (CORE_LOOP_SPEC.md): the extract/work contract. Absent
    // mode = legacy/fallback shape; the screen renders both. Named workMode:
    // `mode` is the route mode in this scope, and a const here would TDZ the
    // request body above (the June 2 boot-crash bug class — caught by proof).
    const workMode = data && (data.mode === "extract" || data.mode === "work") ? data.mode : null;
    const takenApart = workMode === "work" && data.taken_apart && typeof data.taken_apart === "object"
      ? {
          verified: Array.isArray(data.taken_apart.verified) ? data.taken_apart.verified.filter((x) => typeof x === "string" && x.trim()) : [],
          assumed: Array.isArray(data.taken_apart.assumed) ? data.taken_apart.assumed.filter((x) => typeof x === "string" && x.trim()) : [],
        }
      : null;
    const shape = workMode === "work" && data.shape && typeof data.shape === "object"
      ? {
          watch_label: typeof data.shape.watch_label === "string" && data.shape.watch_label.trim() ? data.shape.watch_label.trim() : null,
          line: typeof data.shape.line === "string" && data.shape.line.trim() ? data.shape.line.trim() : null,
        }
      : null;

    return {
      mode: workMode,
      taken_apart: takenApart,
      shape,
      rebuilt: workMode === "work" && typeof data.rebuilt === "string" ? data.rebuilt.trim() : null,
      ask: workMode === "extract" && typeof data.ask === "string" ? data.ask.trim() : null,
      reframe: text,
      question: data && typeof data.question === "string" ? data.question : undefined,
      next_step: data && typeof data.next_step === "string" ? data.next_step : undefined,
      trigger: data && typeof data.trigger === "string" && data.trigger.trim() ? data.trigger.trim() : null,
      log_prediction: logPrediction,
      distortion: data && typeof data.distortion === "string" ? data.distortion : null,
      crisisDetected: !!(data && data.crisisDetected),
    };
  } catch (err) {
    return { reframe: "", error: "Connection issue. Check your network." };
  }
}

/**
 * State-to-Statement (June 2 2026): one user-initiated call converting the
 * session's landed frame into a sendable message draft. Returns
 * { draft } or { fallback: true } — callers show a quiet failure line and
 * never block the close (Self-Mode law).
 *
 * @param {{surfacedFrame?: string|null, takeaway?: string|null}} params
 * @returns {Promise<{draft: string}|{fallback: true}>}
 */
export async function draftStatement({ surfacedFrame = null, takeaway = null } = {}) {
  try {
    const response = await fetch("/.netlify/functions/reframe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "statement", surfacedFrame, takeaway, input: "statement" }),
    });
    if (!response.ok) return { fallback: true };
    const data = await response.json();
    if (data && typeof data.draft === "string" && data.draft.trim().length >= 5) {
      return { draft: data.draft.trim() };
    }
    return { fallback: true };
  } catch {
    return { fallback: true };
  }
}
