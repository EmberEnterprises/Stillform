// Move Card Select — frontend selector helper
// Phase 8b · Engagement Architecture Engine 2 Build #8
//
// Per MOVE_CARD_FLOW_AUDIT.md §3b: AI path is the default, deterministic
// fallback (selectByDeterministicRule from ./library) covers AI-down,
// network-fail, schema-violation. Either way the function returns a full
// sequence object the runner (Phase 8c MoveCardTool) can execute, or null
// if even the fallback can't return a candidate (in practice never — the
// library's universal sequence #10 always matches every state).
//
// Voice: returns the picked sequence + a small metadata envelope so
// callers can route telemetry by selection-pathway (ai vs fallback).

import {
  MOVE_CARD_LIBRARY,
  getSequenceById,
  selectByDeterministicRule
} from "./library.js";

const MOVE_CARD_SELECT_API_URL = (() => {
  try {
    const isCapacitor = typeof window !== "undefined" && window?.Capacitor?.isNativePlatform?.();
    return isCapacitor
      ? "https://stillformapp.com/.netlify/functions/move-card-select"
      : "/.netlify/functions/move-card-select";
  } catch {
    return "/.netlify/functions/move-card-select";
  }
})();

// Build a compact library summary the backend AI can reason over.
// Exclude prompt text — selection only sees ids + fitness + science tags.
// Audit constraint: AI never sees or generates prompt content.
const buildLibrarySummary = () => {
  return MOVE_CARD_LIBRARY.map(s => ({
    id: s.id,
    fitness: s.fitness,
    durationMs: s.durationMs,
    scienceTags: s.scienceTags
  }));
};

// Deterministic-only path. Always works. Returns full sequence object
// + selection metadata. Used when AI is down or as the explicit
// caller-chosen fallback.
const selectFallback = ({ state, recentMoveIds }) => {
  const sequence = selectByDeterministicRule(state || {}, Array.isArray(recentMoveIds) ? recentMoveIds : []);
  return sequence ? {
    sequence,
    pathway: "deterministic",
    reason: null,
    selectedAt: new Date().toISOString()
  } : null;
};

// AI-first selection. POST state + library summary to the backend, get
// back a sequenceId, look up the full sequence in the library, return it.
// On any failure returns the deterministic fallback so caller always
// receives a usable sequence (modulo the very rare case of the library
// being empty, which would mean the app is broken — return null then).
//
// state shape: { feelState, bioFilter, signalArea, timeOfDay }
//   feelState: string from chip palette
//   bioFilter: string[] from current bio-filter array
//   signalArea: string (which body area is loud) — optional
//   timeOfDay: "morning" | "midday" | "evening" | "any" — optional
//
// recentMoveIds: array of last-N sequenceIds to avoid for variety
export const selectMoveCardSequence = async ({ state = {}, recentMoveIds = [] } = {}) => {
  if (MOVE_CARD_LIBRARY.length === 0) return null;

  // Try AI path first
  try {
    const librarySummary = buildLibrarySummary();
    const response = await fetch(MOVE_CARD_SELECT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state, recentMoveIds, librarySummary })
    });
    if (response.ok) {
      const data = await response.json();
      const sequenceId = typeof data?.sequenceId === "string" ? data.sequenceId.trim() : "";
      if (sequenceId) {
        const sequence = getSequenceById(sequenceId);
        if (sequence) {
          return {
            sequence,
            pathway: "ai",
            reason: typeof data?.reason === "string" ? data.reason : null,
            selectedAt: typeof data?.selectedAt === "string" ? data.selectedAt : new Date().toISOString()
          };
        }
        // AI returned an id we can't resolve — fall through to deterministic.
      }
    }
  } catch {
    // Network / abort / parse failure — fall through to deterministic.
  }

  return selectFallback({ state, recentMoveIds });
};

// Re-exports for callers that want to bypass AI explicitly (e.g.,
// runner debug mode, or a caller that already knows AI is unavailable
// from a global state flag).
export { selectFallback, MOVE_CARD_SELECT_API_URL };
