/**
 * chipDefinitions.js — the feel-chip ⓘ definitions registry (v2).
 *
 * Source of truth: CHIP_DEFINITIONS.md (locked Apr 30, 2026). These are the
 * user-facing definitions shown when a user taps the ⓘ next to a feel chip on
 * the Notice screen. Reproduced VERBATIM from the locked doc (the leading
 * "**Name.**" prefix is dropped — the InfoModal title carries the name).
 *
 * Per the lock-step rule (CHIP_DEFINITIONS.md + CANON §10): if a definition is
 * revised, change it in CHIP_DEFINITIONS.md AND here in the same commit.
 *
 * FEEL CHIPS ONLY. The pattern-work watch-list chips (the 15 distortions + 5
 * metacognitive-belief chips) have their own ⓘ copy in biasChips.js, wired on
 * the Bias Profile / Workshop surfaces — a separate chip family, not here.
 *
 * Keys are the chip ids used by beatConfig.js ALL_CHIPS.
 */

export const CHIP_DEFINITIONS = Object.freeze({
  excited:
    "High energy, positive — your system is up and forward. Could be anticipation, momentum, hype, or genuine joy moving through. Selecting Excited tells Stillform you're not here to come down. The system stays out of your way, helps you direct the energy, and quietly watches for the moves you might overcommit to when everything feels possible.",
  focused:
    "Locked in. Mind sharp, body settled around the work. Different from Excited — Focused is steady, not pushed. Selecting Focused tells Stillform you're already in the state, not trying to enter it. Responses stay tight and operational. The system won't try to regulate you because there's nothing that needs regulating.",
  settled:
    "Low arousal, positive valence. Body soft, breath even, nervous system at rest. Mind clear without effort. Not high energy, not low energy — at-ease. The state regulation tools are designed to produce. Selecting Settled tells Stillform you're already in the regulated state and you want to use it, not change it.",
  anxious:
    "The threat-detection system is on. Could be a specific worry or low-grade dread without an obvious target. Body usually shows up first — chest, stomach, jaw. Selecting Anxious tells Stillform to slow down with you, separate what's actually happening from what your brain is adding to it, and not rush you toward feeling better.",
  angry:
    "Heat, tension, sharper edges to your thinking. Could be at someone, at a situation, at yourself. Selecting Angry tells Stillform to acknowledge it fully before going anywhere — the state isn't a problem, the action you might take from inside it is what matters. Decisions slow down. The system helps you separate the feeling from what to do with it.",
  stuck:
    "Something hasn't clicked yet. Not strong feeling, not no feeling — a cognitive state where the thinking is unclear but you know it. Decision paralysis. Replaying without resolving. Selecting Stuck tells Stillform to skip the body work and go straight to the thinking. One question at a time. You bring the specifics; the system helps the picture come into focus.",
  mixed:
    "More than one state active at once. Could be a fight you regret but also feel justified about. Could be excited and scared. Could be sad about something good. Selecting Mixed tells Stillform not to try to resolve the complexity into a single feeling — the contradiction is real. The system helps you identify which thread is loudest right now without flattening the others.",
  flat:
    "Low energy, low motivation, things-are-grey. Not depression as a diagnosis — a state. The system feels tired, not broken. Selecting Flat tells Stillform not to cheerlead, not to push, and not to tell you it's okay to feel off. The system meets the energy you have with directness, and helps you find one concrete thing — not a vague reset, an actual specific action.",
  distant:
    "Disconnected from the body. Things feel far away, muffled, like you're watching from outside. Different from Flat — Flat is low energy still in the body; Distant is a kind of stepping-out. Selecting Distant tells Stillform that words alone won't reach, and the system routes you to Body Scan first to help you re-enter the room before re-entering the thought.",
  unsure:
    "You can't locate what you're feeling clearly — maybe several things at once, maybe nothing legible, maybe the body's giving you signal but it hasn't resolved into a name yet. Different from Mixed — Mixed is two recognizable states at once; Unsure is one state that hasn't surfaced into language. Selecting Unsure tells Stillform you want to start with naming itself as the work, not skip past it. The system slows down and gives the practice of finding the name space, instead of pretending to already know.",
});

/** The chip's definition string, or "" if unknown. Fail-soft. */
export function getChipDefinition(id) {
  return CHIP_DEFINITIONS[id] || "";
}

export default CHIP_DEFINITIONS;
