/**
 * patternInterrupt.js — the engine behind the Step-Out (pattern-interrupt).
 *
 * WHAT THIS IS (and is not):
 *  - It is a sensory-grounding sequence that suppresses default-mode-network
 *    activity (where rumination lives) by flooding limited attention bandwidth
 *    with concrete present-moment input. Best-evidenced acute loop-break.
 *  - It is NOT EMDR, NOT bilateral stimulation, NOT memory reconsolidation,
 *    NOT a treatment. It delivers a *felt experience of the loop breaking* —
 *    a reference point the user can reach for later. Nothing more is claimed.
 *  - It NEVER uses physical discomfort, cold/ice, pain, or sensory shock.
 *    Those are self-harm-adjacent and banned regardless of folk evidence.
 *
 * THE INGENUITY — habituation resistance:
 *  The orienting response (Sokolov) decreases and eventually CEASES with
 *  repeated introduction of the SAME stimulus. A fixed grounding exercise
 *  loses its loop-breaking power over time. So this engine VARIES the
 *  sequence every time — modality order, counts, and prompt phrasing rotate
 *  deterministically by a per-run seed — so the orienting response stays
 *  fresh. Novelty is the mechanism, not a flourish.
 *
 * THE DIFFERENTIATOR — pattern awareness:
 *  Stillform knows the user's specific loop (the watch list). The closing
 *  somatic anchor references that the step-out happened WHILE that pattern
 *  was pulling — giving a future-recall handle ("when it pulls, I can step
 *  out"), without ever re-engaging the loop content (that would feed it).
 *
 * Pure data — no React, no storage. The overlay renders what this returns.
 */

// Sensory channels. Each is present-moment, external-or-bodily-neutral,
// never discomfort-based. Prompts are phrased as gentle direction.
const CHANNELS = {
  see: {
    label: "see",
    prompts: [
      "Find {n} things you can see. Name each one to yourself — plainly.",
      "Look for {n} things in the room. The duller the better.",
      "Pick out {n} things you can see right now. Edges, colors, small objects.",
      "Name {n} things in front of you. Say what they are, nothing more.",
    ],
  },
  hear: {
    label: "hear",
    prompts: [
      "Catch {n} sounds. Let them come from outside you — not your thoughts.",
      "Notice {n} things you can hear. The faint ones count most.",
      "Find {n} sounds in the space around you. Near and far.",
      "Listen for {n} sounds. The hum, the distant, the almost-silent.",
    ],
  },
  touch: {
    label: "feel",
    prompts: [
      "Notice {n} things you can feel. Where you're sitting. Fabric. Air.",
      "Find {n} points of contact — your feet, your hands, the surface under you.",
      "Feel {n} textures. Whatever your skin is touching right now.",
      "Notice {n} physical sensations. Weight, temperature of the air, contact.",
    ],
  },
  breath: {
    label: "breath",
    prompts: [
      "Take {n} slow breaths. Let each one be a little longer than the last.",
      "Breathe {n} times, unhurried. Feel the air turn around at the top.",
      "{n} easy breaths. Notice the pause where the in-breath becomes the out.",
      "Draw {n} full breaths. Nothing to fix — just follow the air.",
    ],
  },
  move: {
    label: "move",
    prompts: [
      "Make {n} small movements. Roll your shoulders, turn your head, flex a hand.",
      "Shift {n} times — change your posture, unclench somewhere, settle again.",
      "Move {n} small ways. Wherever you're holding, let it loosen.",
      "{n} gentle movements. Let the body change shape, even slightly.",
    ],
  },
};

const CHANNEL_KEYS = Object.keys(CHANNELS);

// Deterministic small PRNG (mulberry32) so a given seed always yields the
// same sequence — testable, reproducible, but varied across seeds/runs.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rand) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build a varied grounding sequence.
 *
 * @param {object}  opts
 * @param {number}  [opts.seed]        - run seed; defaults to time-based.
 * @param {string}  [opts.patternLabel]- the user's loop label for the anchor
 *                                        (e.g. "the criticism spiral"). May be null.
 * @returns {{ steps: Array<{channel, label, count, prompt}>, anchor: string }}
 */
export function buildInterrupt({ seed, patternLabel = null } = {}) {
  const s = Number.isFinite(seed) ? seed : (Date.now() & 0xffffffff);
  const rand = rng(s);

  // Pick 4 of the 5 channels in a fresh order each run (novelty), then assign
  // descending counts 4→1 (a 5-4-3-2-1 cousin that never repeats its shape).
  const channels = shuffle(CHANNEL_KEYS, rand).slice(0, 4);
  const counts = [4, 3, 2, 1];

  const steps = channels.map((key, i) => {
    const ch = CHANNELS[key];
    const prompt = ch.prompts[Math.floor(rand() * ch.prompts.length)];
    return {
      channel: key,
      label: ch.label,
      count: counts[i],
      prompt: prompt.replace("{n}", String(counts[i])),
    };
  });

  // Somatic anchor — references THAT the pattern was pulling, never its
  // content (re-engaging content feeds the loop). Future-recall handle.
  const anchor = patternLabel
    ? `That's stepping out — while ${patternLabel} was pulling. Next time it pulls, you can come back here, or make the move on your own.`
    : "That's what stepping out feels like. Next time the loop pulls, you can come back here — or make the move on your own.";

  return { steps, anchor };
}

export default buildInterrupt;
