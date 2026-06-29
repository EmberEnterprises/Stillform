/*
 * bodyVsStory.js — "is it the situation, or your body?" data layer.
 *
 * The bio-filter move, surfaced as a workable check. A heavy feeling that lands
 * while the body is running low — depleted, no sleep, in pain, a hormonal shift,
 * physically revved — is partly the BODY, not a verdict on you or your
 * situation. Naming the body-state changes how the brain reads the next
 * sensation: as danger, or just as tired (interoceptive inference — Seth 2013;
 * Barrett & Simmons 2015; the bio-filter entry in the Library).
 *
 * This layer is a DETERMINISTIC MIRROR over the signal log — it reads the
 * body-states the user already logged at session time (signalLog `body`) and
 * pairs each with the feeling logged alongside it. It never fabricates, never
 * infers a cause, never diagnoses: it reflects the user's own record so the
 * pairing (low body + heavy feeling) becomes visible and workable.
 *
 * Both user AND AI (the standing rule): the AI already receives the latest
 * body-state as bioFilter context in Reframe (so it factors it); this surface
 * is where the user sees the pattern and runs the check themselves.
 *
 * Self-mastery framing, never clinical: the body-state is information, never a
 * flaw or a condition. Reads fail-silent and honest-empty.
 */

import { getSignals } from "./signalLog.js";

// Non-"clear" body-states that color the read. "clear" is baseline (excluded).
// Ids match StateCheck's STATES + signalLog tokens.
const LOW_STATES = Object.freeze([
  "activated",
  "depleted",
  "sleep-deprived",
  "pain",
  "hormonal",
]);

const BODY_LABELS = Object.freeze({
  activated: "Activated",
  depleted: "Depleted",
  "sleep-deprived": "No sleep",
  pain: "In pain",
  hormonal: "Hormonal shift",
});

const CHIP_LABELS = Object.freeze({
  excited: "Excited",
  focused: "Focused",
  settled: "Settled",
  anxious: "Anxious",
  angry: "Angry",
  stuck: "Stuck",
  mixed: "Mixed",
  flat: "Flat",
  distant: "Distant",
  unsure: "Unsure",
});

/** Plain label for a body-state id, or the id itself as a safe fallback. */
export function bodyStateLabel(id) {
  return (id && BODY_LABELS[id]) || id || "";
}

/** Plain label for a feel-chip id, or null. */
export function chipLabel(id) {
  return (id && CHIP_LABELS[id]) || (id || null);
}

/** The non-"clear" body-states present on a signal entry (labels), or []. */
function lowStatesOf(entry) {
  if (!entry || !Array.isArray(entry.body)) return [];
  return entry.body.filter((b) => LOW_STATES.includes(b)).map(bodyStateLabel);
}

/**
 * Recent moments where the body was running low (non-"clear"), each paired with
 * the feeling logged at the same time. Most-recent first. Honest-empty on
 * missing/corrupt. `limit` caps the list (default 5).
 *
 * Returns: [{ when: ISO, dateKey, bodyLabels: string[], feeling: string|null }]
 */
export function getBodyStoryReadings(limit = 5) {
  let signals;
  try {
    signals = getSignals(); // oldest-first, already fail-silent → []
  } catch {
    return [];
  }
  if (!Array.isArray(signals) || signals.length === 0) return [];
  const out = [];
  for (const e of signals) {
    const bodyLabels = lowStatesOf(e);
    if (bodyLabels.length === 0) continue;
    out.push({
      when: e && e.loggedAt ? e.loggedAt : null,
      dateKey: e && e.dateKey ? e.dateKey : null,
      bodyLabels,
      feeling: e ? chipLabel(e.chip) : null,
    });
  }
  out.reverse(); // most-recent first
  const n = Number.isInteger(limit) && limit > 0 ? limit : 5;
  return out.slice(0, n);
}

/** How many recent sessions had the body running low. Honest 0 on empty/corrupt. */
export function getBodyStoryCount() {
  let signals;
  try {
    signals = getSignals();
  } catch {
    return 0;
  }
  if (!Array.isArray(signals)) return 0;
  return signals.reduce((acc, e) => acc + (lowStatesOf(e).length > 0 ? 1 : 0), 0);
}

/** The current-check options the user can pick from (plain labels, ids stable). */
export function bodyCheckOptions() {
  return [
    { id: "clear", label: "Clear / well" },
    ...LOW_STATES.map((id) => ({ id, label: bodyStateLabel(id) })),
  ];
}

/** True if a picked current-state id means the body is coloring the read. */
export function isLowState(id) {
  return LOW_STATES.includes(id);
}
