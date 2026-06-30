// frameworkModel.js — the framework, surfaced as the map you stand inside.
//
// Stillform's three premise concepts already live in the Science Library as
// browsable entries (metacognition, neuroplasticity, reconsolidation). This is
// the layer above that: the three of them tied into ONE understood structure,
// in plain language, each connected to the practice and to WHY the work
// compounds. The point isn't to teach trivia — it's so the person grasps the
// model they're working inside, and stops bracing against their own mind and
// starts building it.
//
// Content is data-driven (testable, single source) and FIRST-PASS — Arlin's
// voice to set. Each premise links to its existing Library entry for the deeper
// science (reuse, never duplicate). All three are vetted in the Science Sheet
// (metacognition: Flavell 1979 etc.; neuroplasticity: Davidson, Lazar 2005,
// Calderone 2024; reconsolidation: Ecker/Ticic/Hulley 2012, Schiller 2010,
// Lane 2015) — no new citation, guard unchanged.
//
// A light store records which premises the user has opened, so My Progress can
// reflect it ("the model, explored"). Honest-empty, fail-silent.

const STORE_KEY = "stillform_v2_framework_model";

/**
 * The three premises, in the order they build on each other:
 *   see your own mind (metacognition)
 *     → the reps wire it in (neuroplasticity)
 *       → working it live rewrites it (reconsolidation)
 */
export const FRAMEWORK_PREMISES = Object.freeze([
  Object.freeze({
    id: "metacognition",
    libraryId: "metacognition",
    name: "You're building a sharper read on your own mind",
    plainWhat:
      "Metacognition is noticing what your mind is doing while it's doing it. The more precisely you can name what's happening — “this is catastrophizing,” “this is my jaw, not a real threat” — the more handle you get on it. A vague feeling runs you; a named one you can work.",
    whyItCompounds:
      "Every time you name something more precisely, you add a word to the vocabulary your brain uses to read itself. That vocabulary is the leverage — it's why the work gets easier over time. You're not just feeling less. You're seeing more.",
    theMove: "Every Reframe, and every thing you name on these pages, sharpens it.",
  }),
  Object.freeze({
    id: "neuroplasticity",
    libraryId: "neuroplasticity",
    name: "The reps physically rewire you",
    plainWhat:
      "Your brain changes with use — repeated practice lays down and strengthens the wiring behind it. This isn't a metaphor. Done often enough, a new response stops being effortful and becomes the one that fires by default.",
    whyItCompounds:
      "This is why the work compounds instead of resetting overnight. You're not holding onto a state you'll lose by tomorrow — each rep builds on the last. The version of you that practices is, physically, not the same one that didn't.",
    theMove: "Coming back to the practice — especially the same move on the same recurring thing — is what wires it in.",
  }),
  Object.freeze({
    id: "reconsolidation",
    libraryId: "reconsolidation",
    name: "Working a live trigger rewrites it — not just papers over it",
    plainWhat:
      "When a charged memory or pattern is recalled while it's active — while you actually feel it — and met with a truer frame, the memory itself can update. Not buried, not argued with from the outside. Updated at the source.",
    whyItCompounds:
      "It's why Stillform asks you to work a trigger when it's live, not when it's gone cold. Rehearsing a better response while calm changes little. Recalling the real thing while it's activated and pairing it with a truer read changes the trigger itself — so next time it fires smaller, or not at all.",
    theMove: "Reframe, run on a recurring trigger while it's still active, is built on this.",
  }),
]);

const PREMISE_IDS = FRAMEWORK_PREMISES.map((p) => p.id);

/** All three premises, in order. */
export function getFrameworkPremises() {
  return FRAMEWORK_PREMISES;
}

function safeLocalStorage() {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch {}
  try {
    if (typeof globalThis !== "undefined" && globalThis.localStorage) return globalThis.localStorage;
  } catch {}
  return null;
}

function readStore() {
  const ls = safeLocalStorage();
  if (!ls) return { explored: [] };
  try {
    const raw = ls.getItem(STORE_KEY);
    if (!raw) return { explored: [] };
    const s = JSON.parse(raw);
    const explored = Array.isArray(s && s.explored)
      ? s.explored.filter((id) => PREMISE_IDS.includes(id))
      : [];
    return { explored: [...new Set(explored)] };
  } catch {
    return { explored: [] };
  }
}

function writeStore(next) {
  const ls = safeLocalStorage();
  if (!ls) return next;
  try { ls.setItem(STORE_KEY, JSON.stringify(next)); } catch {}
  return next;
}

/** Mark a premise as opened. Invalid id → no-op. Returns the explored array. */
export function markPremiseExplored(id) {
  if (!PREMISE_IDS.includes(id)) return readStore().explored;
  const s = readStore();
  if (s.explored.includes(id)) return s.explored;
  const explored = [...s.explored, id];
  writeStore({ explored });
  return explored;
}

/** Which premises the user has opened. Honest-empty: []. */
export function getExploredPremises() {
  return readStore().explored;
}

/** How many of the three the user has opened. */
export function getExploredCount() {
  return readStore().explored.length;
}

/** Total number of premises (3). */
export function getPremiseCount() {
  return PREMISE_IDS.length;
}

/** Clear explored state. */
export function clearFrameworkModel() {
  return writeStore({ explored: [] });
}
