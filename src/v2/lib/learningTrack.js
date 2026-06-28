/**
 * learningTrack.js — the Learning Track's lesson registry (rep-then-name).
 *
 * The Track is the thesis made concrete: "expand cognitive capacity via
 * neuroplasticity → self-mastery" is a claim until the user DOES the move and
 * watches their own mind do it. Each lesson is structured per the locked spec:
 *
 *   1. intro   — name a real concept (no passive lecture)
 *   2. rep     — the user DOES a small firsthand rep of it (active)
 *   3. name    — "what you just did was X" (the metacognitive move, named)
 *   4. transfer— the cross-domain beat: "the same move you use learning an
 *                instrument." Making transfer EXPLICIT is how metacognitive
 *                transfer actually happens — this is the innovation, built hardest.
 *
 * conceptId links each lesson to its scienceLibrary entry (the "name" half the
 * user can go read in the Library). Lessons reuse concepts that already exist;
 * no new science is introduced here.
 *
 * HARD GUARDRAIL (non-negotiable): NO learning-styles / VAK / brain-type
 * matching anywhere in the Track (Pashler et al. 2008 — debunked neuromyth).
 * Task-level difference is real ("this skill works your brain differently than
 * that one"); a PERSON having a "brain-type" is false and never shipped.
 *
 * COPY STATUS: intro / rep prompts / name / transfer are FIRST-PASS DRAFT —
 * Arlin's curriculum voice to set. The structure + the transfer mechanic are
 * the build; the wording is hers to shape.
 *
 * Rep `kind`: "word" (one short input) · "twoline" (two inputs, the second
 * reframes the first) · "choice" (pick or type a sharper option) · "breath"
 * (a single guided cycle, tap when done). Reps are not graded and not stored —
 * the value is the doing, not a record.
 */

export const LESSONS = [
  {
    id: "naming-a-feeling",
    conceptId: "affect-labeling",
    title: "Naming a feeling",
    transferLine: "the same move a musician makes naming a note by ear",
    intro:
      "The fastest way to take the edge off a feeling isn\u2019t to fix it or explain it. It\u2019s to name it — precisely, in one word. Let\u2019s do it once, right now.",
    rep: {
      kind: "word",
      prompt: "One word for what you feel right now. Not a sentence — one word.",
      placeholder: "one word",
    },
    name: "That was affect labeling. You didn\u2019t analyze the feeling or argue with it — you put one precise word on it. That alone lowers the alarm: naming a state changes how your brain holds it.",
    transfer:
      "It\u2019s the same move underneath a lot of skill — a musician naming an interval by ear, a writer naming why a line falls flat. You can\u2019t work with what you can\u2019t name. So naming precisely is the first move in learning almost anything — you just ran it.",
  },
  {
    id: "stepping-outside-a-thought",
    conceptId: "reframe",
    title: "Stepping outside a thought",
    transferLine: "the same move a chess player makes seeing the board from the other side",
    intro:
      "A thought you\u2019re inside of feels like the truth. The same thought, seen from the outside, is just a thought you\u2019re having. Here\u2019s the move that flips one into the other.",
    rep: {
      kind: "twoline",
      prompt1: "Write a thought that\u2019s been nagging you — in the words it actually uses in your head.",
      placeholder1: "the thought",
      prompt2: "Now write it again, starting with: \u201cI\u2019m having the thought that\u2026\u201d",
      placeholder2: "I\u2019m having the thought that\u2026",
    },
    name: "Read the two back. The first is you inside the thought; the second is you watching it. That small shift — from fused with it to observing it — is the engine of the whole practice. The thought didn\u2019t change. Your position on it did.",
    transfer:
      "It\u2019s the same move a chess player makes turning the board to see it from the opponent\u2019s side, or anyone catching themselves mid-assumption. Stepping out of your own point of view to see the structure is how you stop being run by it — in a thought, a game, or an argument.",
  },
  {
    id: "getting-more-precise",
    conceptId: "feel-chips",
    title: "Getting more precise",
    transferLine: "the same skill as a sommelier telling \u201coaky\u201d from \u201ctannic\u201d",
    intro:
      "\u201cBad\u201d is a blunt instrument. The gap between \u201cbad\u201d and \u201coverwhelmed but not angry\u201d is the gap between spiraling and knowing what to do next. Let\u2019s sharpen one word.",
    rep: {
      kind: "choice",
      prompt: "Think of the last time you felt off. Which is closest — or type a sharper one?",
      options: ["upset", "anxious", "overwhelmed", "let down"],
      allowOther: true,
      placeholder: "a sharper word",
    },
    name: "That\u2019s granularity — making finer distinctions between states. People who can do it regulate better and reach less often for the easy, harmful exits. And it\u2019s trainable: every time you pick the sharper word, you get better at it.",
    transfer:
      "It\u2019s the same skill as a sommelier telling \u201coaky\u201d from \u201ctannic,\u201d or an engineer telling \u201cslow\u201d from \u201cmemory-bound.\u201d Expertise in almost anything is mostly the precision of your distinctions. You just ran the rep that builds it.",
  },
  {
    id: "the-exhale-lever",
    conceptId: "breathing",
    title: "The exhale lever",
    transferLine: "the same reset an athlete uses between points",
    intro:
      "You carry one regulation lever everywhere you go: your exhale. Longer out than in, and the body tips toward its brake. One rep — right now.",
    rep: {
      kind: "breath",
      prompt:
        "Breathe in through your nose. Then take a second, smaller sip of air on top. Now let it out slowly through your mouth — twice as long as the way in. Do it once, then tap below.",
      doneLabel: "Done",
    },
    name: "That was one cyclic sigh — the most-studied breath for settling down. The double inhale opens the lungs; the long exhale is what flips the parasympathetic brake. One did a little. A few minutes does a lot.",
    transfer:
      "It\u2019s the same reset an athlete uses between points and a singer uses for breath support. Controlling the exhale is a lever that works the same way under any kind of load. You didn\u2019t learn a Stillform trick — you located something you already carry.",
  },
];

/** Lookup one lesson by id, or null. */
export function getLesson(id) {
  if (!id || typeof id !== "string") return null;
  return LESSONS.find((l) => l.id === id) || null;
}
