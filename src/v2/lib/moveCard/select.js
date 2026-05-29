import { selectByDeterministicRule, getSequenceById, FREEZE_RESTART_ID } from "./database.js";

/**
 * Move card selection adapter (Phase 6.2b).
 *
 * Bridges what the Notice step actually has (an optional feel chip) to the
 * Move card Database's deterministic selector. Deliberately thin: the
 * deterministic rule (database.js) already floors on the freeze-restart move
 * and never returns null, so this always yields a runnable sequence even with
 * no signal at all — which is the point, since the quick-move entry is the
 * one path a user can take before they've named anything.
 *
 * AI-driven selection (audit Option B) is a later enhancement gated on the
 * detection layer; this is the offline-safe floor.
 */

// Notice chip id → Move card fitness feelState. Only clean matches map;
// ambiguous chips (excited / distant / unsure) pass null and let the
// deterministic rule fall through to the broader pool rather than forcing a
// bad fit.
const CHIP_TO_FEELSTATE = Object.freeze({
  focused: "focused",
  anxious: "anxious",
  angry: "angry",
  stuck: "stuck",
  mixed: "mixed",
  flat: "flat",
  settled: "clear",
});

function timeOfDayNow(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return "morning";
  if (h < 17) return "midday";
  return "evening";
}

/**
 * Pick a Move card sequence for the quick-move entry from Notice.
 *
 * @param {object} [opts]
 * @param {string|null} [opts.chip]  the selected Notice chip id, if any
 * @param {string[]} [opts.recentMoveIds]  recently-run sequence ids to avoid
 * @returns {object} a MOVE_CARD_DATABASE sequence (never null)
 */
export function selectMoveForNotice({ chip = null, recentMoveIds = [] } = {}) {
  const feelState = chip ? (CHIP_TO_FEELSTATE[chip] || null) : null;
  const seq = selectByDeterministicRule(
    { feelState, timeOfDay: timeOfDayNow() },
    Array.isArray(recentMoveIds) ? recentMoveIds : []
  );
  return seq || getSequenceById(FREEZE_RESTART_ID);
}
