/*
 * beatConfig.js — variant configuration layer for the v2 spine.
 *
 * Per Stillform_Master_Todo.md Phase 4 scope item #1 (locked May 16, 2026):
 *
 *   "New src/v2/lib/beatConfig.js exports getBeatConfig(beat). Returns
 *   config object with notice/reframe/close sections. Extensible —
 *   adding post-event (Phase 6) or Reset (Phase 6) = one new config
 *   object."
 *
 * Why this exists:
 *
 * The v2 spine currently runs identical Notice → Reframe → Close for
 * all four beats. The home (SmartScreen) routes by beat correctly, but
 * the spine itself is beat-blind. Morning check-in feels the same as
 * noon reframe feels the same as EOD close — defeating the purpose of
 * having beats. This module makes the spine beat-aware by exposing a
 * per-beat config that drives Notice screen content, Reframe behavior,
 * Close treatment, and storage flags.
 *
 * Architectural principles:
 *
 * 1. Pure module. No React, no AI dependency, no I/O. getBeatConfig is
 *    a deterministic lookup. Per the locked Self Mode as architecture
 *    principle (Pillar B), the variant config must work with AI
 *    unavailable — the config itself is local-only.
 *
 * 2. AI prompts stay server-side. Client sends `beat` as a parameter;
 *    netlify/functions/reframe.js has BEAT_ADDITIONS keyed by beat (Phase
 *    4 sub-item #3/#4). The config does NOT carry prompt strings — that
 *    would put prompt content in client bundles where it doesn't belong.
 *
 * 3. Notice shape governs flow. `notice.shape === "standard"` runs the
 *    full Notice → Reframe → Close. `notice.shape === "minimal"` is the
 *    wind-down pattern: direct capture → breathing → close, no Reframe
 *    step. Future variants (Reset surface in Phase 6) also use minimal.
 *
 * 4. Chip vocabulary is consistent across beats; subsets vary. The 10
 *    feel chips (per CHIP_DEFINITIONS.md April 30 2026) form the
 *    user's emotional vocabulary; per-beat configs select subsets that
 *    scaffold the right frame (morning forward-leaning, EOD retrospective).
 *    Same word = same meaning across beats.
 *
 * 5. Storage shape stable. `completionFlag` values use canonical
 *    storage keys (stillform_checkin_today, stillform_eod_today) that the rest of the app's
 *    beat.js detection keeps working during the dual-live period. New
 *    flags (stillform_winddown_today) are v2-only.
 *
 * 6. Falls back to main on unknown beat. Defensive: if anything passes
 *    an unrecognized beat, the user gets the main-beat spine — never
 *    a broken screen.
 *
 * Schema (every config has all fields; null where N/A):
 *
 *   {
 *     beat: string                  // identity, matches the key
 *     notice: {
 *       shape: "standard" | "minimal"
 *       headline: string            // serif display text
 *       body: string | null         // optional secondary line
 *       placeholder: string         // textarea placeholder
 *       chips: Array<{id, label}>   // empty array for minimal
 *     }
 *     reframe: {
 *       minTurns: number            // user reply gate (Phase 3.5 #3)
 *       contextExtras: object       // extra context to pass to AI
 *     } | null                      // null when notice.shape === "minimal"
 *     close: {
 *       headline: string
 *       body: string
 *       takeawayPlaceholder: string | null  // null for wind-down (no takeaway capture)
 *       breathingOffer: "box" | "deep-regulate" | "cyclic-sighing" | null
 *       completionFlag: string | null       // localStorage key to mark
 *       completionShape: "morning" | "eod" | "winddown" | null
 *     }
 *   }
 */

// The full feel-chip vocabulary, per CHIP_DEFINITIONS.md April 30 2026.
// Single source for chip ids + labels within the variant layer. If the
// user-facing definitions are updated, this list updates in lockstep.
//
// Order is deliberate: positive states first (excited → focused → settled),
// then activated states (anxious → angry), then stuck/uncertain states
// (stuck → mixed → flat → distant → unsure). When variants subset this
// list they preserve the relative order so the same chip is always in
// the same place across beats.
const ALL_CHIPS = [
  { id: "excited", label: "Excited" },
  { id: "focused", label: "Focused" },
  { id: "settled", label: "Settled" },
  { id: "anxious", label: "Anxious" },
  { id: "angry", label: "Angry" },
  { id: "stuck", label: "Stuck" },
  { id: "mixed", label: "Mixed" },
  { id: "flat", label: "Flat" },
  { id: "distant", label: "Distant" },
  { id: "unsure", label: "Unsure" },
];

// Helper: select chips by id while preserving the ALL_CHIPS order.
function selectChips(ids) {
  const set = new Set(ids);
  return ALL_CHIPS.filter((c) => set.has(c.id));
}

// ---------------------------------------------------------------------
// Configs per beat. Each is a complete config object.
// ---------------------------------------------------------------------

const MAIN_CONFIG = {
  beat: "main",
  notice: {
    shape: "standard",
    headline: "Name what's present.",
    body: "As precisely as you can.",
    placeholder: "Specifics — what it feels like, where, when, what triggered it…",
    // Main beat shows the full chip vocabulary — any state can land in
    // the moment.
    chips: ALL_CHIPS.slice(),
  },
  reframe: {
    minTurns: 1,
    contextExtras: {},
  },
  close: {
    headline: "Name what landed.",
    body: "What you name here becomes part of your library.",
    takeawayPlaceholder: "What landed for you…",
    // Main close has no fixed breathing offer — Reframe's close-readiness
    // AI routing (existing) handles pattern suggestion in-conversation.
    breathingOffer: null,
    completionFlag: null,
    completionShape: null,
  },
};

const MORNING_CONFIG = {
  beat: "morning",
  notice: {
    shape: "standard",
    headline: "Anchor today.",
    body: "Name what today needs from you.",
    placeholder: "What's the one thing — focus, presence, patience, something specific…",
    // Forward-leaning subset. Stuck / Angry / Distant feel more in-the-
    // moment than morning-frame, so they're omitted here (still available
    // mid-day on the main beat). This matches the rationale: morning is
    // anticipation, not pattern-naming.
    chips: selectChips(["excited", "focused", "settled", "anxious", "flat", "mixed", "unsure"]),
  },
  reframe: {
    minTurns: 1,
    contextExtras: {
      // The morning AI prompt addition lives server-side in
      // BEAT_ADDITIONS.morning (Phase 4 sub-item #3). Client just
      // signals which beat is active.
    },
  },
  close: {
    headline: "Today's anchor.",
    body: "Set the move. The day will test it.",
    takeawayPlaceholder: "The anchor for today…",
    // Box breathing (4-4-4-4) for sustained focus through the day.
    breathingOffer: "box",
    // Completion flag — beat.js reads this same key.
    completionFlag: "stillform_checkin_today",
    completionShape: "morning",
  },
};

const EOD_CONFIG = {
  beat: "eod",
  notice: {
    shape: "standard",
    headline: "Close the day.",
    body: "What did today carry?",
    placeholder: "The weight of it. The shape. What stayed with you…",
    // Retrospective subset. Excited / Focused feel less retrospective.
    // The day's been carried — what's emerged is what shows up here.
    chips: selectChips(["settled", "anxious", "angry", "stuck", "mixed", "flat", "distant", "unsure"]),
  },
  reframe: {
    minTurns: 1,
    contextExtras: {
      // EOD-specific: pass today's thread entries as additional context
      // so the AI can help distill what landed across the day. Server
      // reads this and pulls the thread before constructing the prompt.
      includeTodayThread: true,
    },
  },
  close: {
    headline: "Day closed.",
    body: "What you named is part of the library now.",
    takeawayPlaceholder: "What stays from today…",
    // Deep Regulate (coherent ~5-6 bpm) for integrative down-regulation.
    breathingOffer: "deep-regulate",
    // Completion flag — beat.js reads this same key.
    completionFlag: "stillform_eod_today",
    completionShape: "eod",
  },
};

const WIND_DOWN_CONFIG = {
  beat: "wind-down",
  notice: {
    // Minimal shape: NOT Notice → Reframe → Close. Direct capture →
    // breathing → close. Per locked design call May 16: tomorrow anchor
    // over offload (Scullin 2018 — writing tomorrow's anchor before bed
    // cuts sleep onset latency vs writing about completed tasks; sovereign
    // self-mastery framing — anchor tomorrow's move, don't relitigate
    // today).
    shape: "minimal",
    headline: "Tomorrow's one anchor?",
    body: null,
    placeholder: "The one thing tomorrow gets from you…",
    // No chips — wind-down is single-purpose, direct capture.
    chips: [],
  },
  // No Reframe step in wind-down. The shape skips it.
  reframe: null,
  close: {
    headline: "Phone down.",
    body: "See you tomorrow.",
    // No takeaway capture — the tomorrow anchor IS the artifact and was
    // captured at notice. Close is just the power-down moment.
    takeawayPlaceholder: null,
    // Deep Regulate embedded inline before the close moment.
    breathingOffer: "deep-regulate",
    // Completion flag for the wind-down beat.
    completionFlag: "stillform_winddown_today",
    completionShape: "winddown",
  },
};

const POST_EVENT_CONFIG = {
  beat: "post-event",
  notice: {
    shape: "standard",
    headline: "What just happened?",
    body: "Name it while it's fresh.",
    placeholder: "The meeting, the call, the moment — what happened and how it left you…",
    // Full spectrum, like main: an event just happened and it can leave any
    // state — a win as much as a hit. Post-event is NOT only for the rough
    // ones (framing law). Positive states lead the list by design.
    chips: ALL_CHIPS.slice(),
  },
  reframe: {
    minTurns: 1,
    contextExtras: {
      // Post-event is a SINGLE episode, not a day's accumulation — no
      // today-thread include (that's EOD's integrative move). The just-
      // named episode is the whole material; the post-mortem framing lives
      // server-side in BEAT_ADDITIONS["post-event"].
      includeTodayThread: false,
    },
  },
  close: {
    headline: "Logged.",
    body: "What you keep from this is yours to carry into the next one.",
    takeawayPlaceholder: "What you take from this…",
    // Deep Regulate — integrative down-regulation after working an episode.
    breathingOffer: "deep-regulate",
    // Post-event is MANUAL and repeatable — not a once-daily beat. No daily
    // completion flag (unlike morning / eod / wind-down), so it never
    // advances the time-router or blocks re-entry.
    completionFlag: null,
    completionShape: null,
  },
};

// Registry keyed by beat string. post-event (Phase 6.4) registers here with
// the same shape — no infrastructure changes elsewhere. (Reset ships as its
// own self-contained screen, not a beat config — see spine/Reset.jsx.)
const CONFIGS = {
  main: MAIN_CONFIG,
  morning: MORNING_CONFIG,
  eod: EOD_CONFIG,
  "wind-down": WIND_DOWN_CONFIG,
  "post-event": POST_EVENT_CONFIG,
};

/**
 * Return the variant config for a given beat.
 *
 * Defensive: unknown beats fall back to main. The spine never crashes
 * on a bad beat — the user gets the standard practice surface.
 *
 * @param {string} beat — one of "main" | "morning" | "eod" | "wind-down" (more in Phase 6)
 * @returns {object} the config object (see schema above)
 */
export function getBeatConfig(beat) {
  return CONFIGS[beat] || CONFIGS.main;
}

/**
 * Return all registered beat ids. For tests, debug surfaces, and any
 * code that wants to iterate variants without hard-coding the list.
 *
 * @returns {Array<string>}
 */
export function getAllBeats() {
  return Object.keys(CONFIGS);
}

/**
 * Return the full chip vocabulary. Exposed for code that needs the
 * canonical chip list (e.g., Notice.jsx default when no variant is
 * active). Same source the variant configs subset from.
 *
 * @returns {Array<{id: string, label: string}>}
 */
export function getAllChips() {
  return ALL_CHIPS.slice();
}
