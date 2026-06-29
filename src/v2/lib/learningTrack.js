/**
 * learningTrack.js — the Learning Track's lesson registry (rep-then-name, deep).
 *
 * The Track is the thesis made concrete: "expand cognitive capacity via
 * neuroplasticity -> self-mastery" is a claim until the user DOES the move and
 * watches their own mind do it. Each lesson is a full PRACTICE UNIT, not a card.
 *
 * DEEP MOVE-TEMPLATE (approved direction; mockup-reviewed). Order of a move:
 *   intro         "The move"        — name a real concept (no passive lecture)
 *   workedExample "Watch it once"   — the move done once, narrated (a model)
 *   rep           the anchor drill  — the user DOES it (active, interactive)
 *   drills        foundation/further— more reps; further = harder (desirable
 *                                     difficulty). Prompt-strings, done by hand.
 *   name          "what you did"    — the metacognitive move, named
 *   runLive       "Run it live"     — how to use it in a real moment today
 *   notice        "What to notice"  — the tell that it worked
 *   whenHard      "When it's hard"  — the common failure + the fix
 *   deeperCut     why/trap/when/pairsWith — the mechanics under the move
 *   levels        the rungs it climbs (beginner expression -> under-load mastery)
 *   transfer      "Where it carries"— principled abstraction (see DISCIPLINE)
 *   conceptId     "Where to check it" — links to the scienceLibrary entry
 *   comeBack      spaced retrieval  — return at growing intervals, recall from
 *                                     MEMORY (not re-read); the effort is the point
 *
 * TRANSFER DISCIPLINE (locked): far transfer is rare and NOT automatic
 * (Detterman 1993; Sala & Gobet 2017; Barnett & Ceci 2002). The transfer beat
 * names the SAME move appearing across domains and teaches for transfer by
 * explicit abstraction (high-road transfer; Salomon & Perkins 1989). It is
 * NEVER a promise that this practice makes you better at an unrelated skill
 * (chess, an instrument). Same overclaim-refusal family as the learning-styles
 * ban below.
 *
 * HARD GUARDRAIL (non-negotiable): NO learning-styles / VAK / brain-type
 * matching anywhere (Pashler et al. 2008 — debunked neuromyth). Task-level
 * difference is real; a PERSON having a "brain-type" is false and never ships.
 *
 * NO gamification: no scores, streaks, points, or pep. Reps are not graded and
 * not stored — the value is the doing, not a record.
 *
 * COPY STATUS: ALL prose here (intro / workedExample / drills / name / runLive /
 * notice / whenHard / deeperCut / levels / transfer / comeBack) is FIRST-PASS
 * DRAFT — Arlin's curriculum voice to set. The STRUCTURE, the transfer mechanic,
 * the spaced come-back, and the discipline are the build; wording is hers.
 *
 * Rep `kind`: "word" | "twoline" | "choice" | "breath".
 */

export const CHAPTERS = [
  {
    id: "naming",
    title: "Naming",
    blurb: "Putting the precise word on a state \u2014 the first handle on anything you want to work with.",
  },
  {
    id: "stepping-back",
    title: "Stepping back",
    blurb: "Getting outside a thought so it stops being the air you breathe and becomes something you can see.",
  },
  {
    id: "the-body",
    title: "The body",
    blurb: "The levers you carry in your own physiology \u2014 the fastest, most portable way to shift a state.",
  },
];

export const LESSONS = [
  {
    id: "naming-a-feeling",
    chapter: "naming",
    conceptId: "affect-labeling",
    title: "Naming a feeling",
    transferLine: "the same move a musician makes naming a note by ear",
    intro:
      "The fastest way to take the edge off a feeling isn\u2019t to fix it or explain it. It\u2019s to name it \u2014 precisely, in one word. Let\u2019s do it once, right now.",
    workedExample:
      "Watch it once: someone feels a knot before a meeting. Instead of \u201cI\u2019m fine,\u201d they sit with it a beat and land on \u201capprehensive.\u201d The knot doesn\u2019t vanish \u2014 but it stops running the show. It has a name now, and a name is a handle.",
    rep: {
      kind: "word",
      prompt: "One word for what you feel right now. Not a sentence \u2014 one word.",
      placeholder: "one word",
    },
    drills: {
      foundation: [
        "Name the feeling under the feeling. You found one word \u2014 is there a quieter one beneath it?",
        "Name a feeling from earlier today that you let pass unnamed.",
      ],
      further: [
        "Name a feeling you usually avoid naming. The harder the word is to find, the more the rep is worth.",
        "Name a mixed state \u2014 two words for two things present at once.",
      ],
    },
    name: "That was affect labeling. You didn\u2019t analyze the feeling or argue with it \u2014 you put one precise word on it. That alone lowers the alarm: naming a state changes how your brain holds it.",
    runLive:
      "Next time something spikes today, before you do anything about it, put one word on it. That\u2019s the whole move in the wild.",
    notice:
      "The tell that it worked: a half-second of distance. The feeling is still there, but you\u2019re holding it instead of being held by it.",
    whenHard:
      "If no word fits, that\u2019s not failure \u2014 it\u2019s the signal you\u2019re in a blunt state. Pick the closest word anyway. Precision comes from reps, not from waiting for the perfect one.",
    deeperCut: {
      why: "Putting a feeling into words engages regions that down-regulate the alarm \u2014 naming is itself a brake. That\u2019s why it\u2019s the first move.",
      trap: "Naming can curdle into analyzing \u2014 explaining WHY you feel it. That\u2019s a different, slower operation. The rep is the word, not the essay.",
      when: "Best at the first spike, before the story forms. Later works too, but earlier is leverage.",
      pairsWith: "Pairs with Getting more precise \u2014 naming gets you a word; precision gets you the RIGHT word.",
    },
    levels: [
      "One word for an obvious feeling.",
      "One word for a feeling you\u2019d normally skip past.",
      "The precise word for a mixed or subtle state \u2014 found fast, under load.",
    ],
    transfer:
      "It\u2019s the same move underneath a lot of skill \u2014 a musician naming an interval by ear, a writer naming why a line falls flat. You can\u2019t work with what you can\u2019t name. Naming precisely is the first move in learning almost anything; you just ran it here, on yourself.",
    comeBack:
      "Come back in a few days \u2014 and don\u2019t re-read this. Try to recall the move from memory first: what was the one instruction? The little effort of pulling it back is what files it deeper. Re-reading feels easier and teaches less.",
  },
  {
    id: "getting-more-precise",
    chapter: "naming",
    conceptId: "feel-chips",
    title: "Getting more precise",
    transferLine: "the same skill as a sommelier telling \u201coaky\u201d from \u201ctannic\u201d",
    intro:
      "\u201cBad\u201d is a blunt instrument. The gap between \u201cbad\u201d and \u201coverwhelmed but not angry\u201d is the gap between spiraling and knowing what to do next. Let\u2019s sharpen one word.",
    workedExample:
      "Watch it once: \u201cI feel bad\u201d could be ten things. Someone sits with it a beat and finds \u201clet down.\u201d Suddenly there\u2019s a direction \u2014 because \u201clet down\u201d points at an expectation that wasn\u2019t met. \u201cBad\u201d pointed nowhere.",
    rep: {
      kind: "choice",
      prompt: "Think of the last time you felt off. Which is closest \u2014 or type a sharper one?",
      options: ["upset", "anxious", "overwhelmed", "let down"],
      allowOther: true,
      placeholder: "a sharper word",
    },
    drills: {
      foundation: [
        "Take the word you just picked and ask: is there a more exact one a notch over?",
        "Name the difference between two near-words \u2014 \u201canxious\u201d vs \u201coverwhelmed.\u201d What\u2019s actually different?",
      ],
      further: [
        "Find the word for a state you\u2019ve never named \u2014 one that usually just sits as \u201coff.\u201d First-time naming is the hardest, highest-value rep.",
        "Split one feeling into its parts. Most strong feelings are two or three things at once; name them separately.",
      ],
    },
    name: "That\u2019s granularity \u2014 making finer distinctions between states. People who can do it regulate better and reach less often for the easy, harmful exits. And it\u2019s trainable: every time you pick the sharper word, you get better at it.",
    runLive:
      "When you catch yourself with a blunt word today \u2014 \u201cfine,\u201d \u201cbad,\u201d \u201cstressed\u201d \u2014 trade it for one click sharper. That\u2019s the rep, done live.",
    notice:
      "The tell: the sharper word comes with information. \u201cOverwhelmed\u201d says there\u2019s too much; \u201clet down\u201d says an expectation broke. The right word points at what to do.",
    whenHard:
      "If you can\u2019t find a sharper word, you may not have the vocabulary yet \u2014 normal and fixable. Scan a list of feeling words and try each against the state. The vocabulary IS the skill.",
    deeperCut: {
      why: "Finer-grained labels give the brain more precise predictions to work with \u2014 which is why high granularity tracks with better regulation and fewer harmful exits.",
      trap: "Reaching for an intense word because it feels validating (\u201cdevastated\u201d when it\u2019s \u201cdisappointed\u201d). Precision means accurate, not dramatic.",
      when: "Most useful when a feeling is strong and vague at once \u2014 exactly when the blunt word does the most damage.",
      pairsWith: "Pairs with Naming a feeling \u2014 naming gets the handle, precision sharpens it to a point.",
    },
    levels: [
      "Trade a blunt word for a common precise one.",
      "Find a precise word for a subtle state.",
      "Name a mixed state in its parts \u2014 fast, while you\u2019re in it.",
    ],
    transfer:
      "It\u2019s the same skill as a sommelier telling \u201coaky\u201d from \u201ctannic,\u201d or an engineer telling \u201cslow\u201d from \u201cmemory-bound.\u201d Expertise in almost anything is mostly the precision of your distinctions. You just ran the rep that builds it on yourself.",
    comeBack:
      "Come back in several days and try to name three feelings more precisely from memory before you re-read anything. The recall is the rep \u2014 if it comes back slow, that slowness is the move working.",
  },
  {
    id: "stepping-outside-a-thought",
    chapter: "stepping-back",
    conceptId: "reframe",
    title: "Stepping outside a thought",
    transferLine: "the same move a chess player makes seeing the board from the other side",
    intro:
      "A thought you\u2019re inside of feels like the truth. The same thought, seen from the outside, is just a thought you\u2019re having. Here\u2019s the move that flips one into the other.",
    workedExample:
      "Watch it once: \u201cI always screw this up\u201d is a verdict you\u2019re standing inside. Rewrite it as \u201cI\u2019m having the thought that I always screw this up,\u201d and you\u2019ve stepped onto the curb \u2014 same traffic, but you\u2019re watching it instead of in it.",
    rep: {
      kind: "twoline",
      prompt1: "Write a thought that\u2019s been nagging you \u2014 in the words it actually uses in your head.",
      placeholder1: "the thought",
      prompt2: "Now write it again, starting with: \u201cI\u2019m having the thought that\u2026\u201d",
      placeholder2: "I\u2019m having the thought that\u2026",
    },
    drills: {
      foundation: [
        "Say the observer version out loud, once. Hear the difference.",
        "Catch a smaller thought right now \u2014 any nagging one \u2014 and prefix it the same way.",
      ],
      further: [
        "Reframe a thought you actually believe is true. The move isn\u2019t deciding it\u2019s false \u2014 it\u2019s un-fusing from it even when it might be right.",
        "Reframe a thought mid-feeling, while the feeling\u2019s still warm. Harder \u2014 and the rep that counts most.",
      ],
    },
    name: "Read the two back. The first is you inside the thought; the second is you watching it. That small shift \u2014 from fused with it to observing it \u2014 is the engine of the whole practice. The thought didn\u2019t change. Your position on it did.",
    runLive:
      "When a thought has you gripped today, prefix it: \u201cI\u2019m having the thought that ___.\u201d Say it once. That\u2019s you stepping out.",
    notice:
      "The tell: the thought stops feeling like the air you\u2019re breathing and starts feeling like an object you\u2019re looking at. Even slightly counts.",
    whenHard:
      "If the prefix feels fake or doesn\u2019t loosen anything, the thought may be too abstract. Make it concrete \u2014 the exact words your head uses \u2014 then step out of THAT.",
    deeperCut: {
      why: "Fusion is when a thought and reality feel identical. Defusion puts a gap between you and the thought \u2014 and in that gap is the choice the pattern was hiding.",
      trap: "Trying to argue the thought into being false. That keeps you inside it. The move changes your POSITION on it, not its verdict.",
      when: "Any time you notice you\u2019re treating a thought as a fact. The noticing is half the move.",
      pairsWith: "Pairs with Naming a feeling \u2014 name the feeling first, then step out of the thought riding on it.",
    },
    levels: [
      "Step out of a thought after it\u2019s passed.",
      "Step out of a thought while it\u2019s active.",
      "Notice the fusion forming and step out before the thought closes \u2014 catching it at the threshold.",
    ],
    transfer:
      "It\u2019s the same move a chess player makes turning the board to see it from the other side, or anyone catching themselves mid-assumption. Stepping out of your own point of view to see the structure is how you stop being run by it \u2014 in a thought, a game, or an argument.",
    comeBack:
      "In a few days, before opening this again, try to recall the exact prefix. Pull it from memory. If it comes back slow, good \u2014 the slowness is the move working.",
  },
  {
    id: "the-exhale-lever",
    chapter: "the-body",
    conceptId: "breathing",
    title: "The exhale lever",
    transferLine: "the same reset an athlete uses between points",
    intro:
      "You carry one regulation lever everywhere you go: your exhale. Longer out than in, and the body tips toward its brake. One rep \u2014 right now.",
    workedExample:
      "Watch it once: before a hard call, someone breathes in, takes a small sip more on top, then lets it out long and slow. Their voice lands a notch lower and steadier. Nothing mystical \u2014 the long exhale tipped the body toward its brake, and the body led.",
    rep: {
      kind: "breath",
      prompt:
        "Breathe in through your nose. Then take a second, smaller sip of air on top. Now let it out slowly through your mouth \u2014 twice as long as the way in. Do it once, then tap below.",
      doneLabel: "Done",
    },
    drills: {
      foundation: [
        "Do one more cyclic sigh now, slower on the way out than the first.",
        "Put a hand on your stomach and do one \u2014 feel the exhale be the long part.",
      ],
      further: [
        "Do three in a row and notice where your baseline sits after \u2014 the effect compounds.",
        "Do one WITHOUT the prompt, from memory of the rhythm. Owning the move untethered from the app is the point.",
      ],
    },
    name: "That was one cyclic sigh \u2014 the most-studied breath for settling down. The double inhale opens the lungs; the long exhale is what flips the parasympathetic brake. One did a little. A few minutes does a lot.",
    runLive:
      "Before anything that tightens you today \u2014 a call, a doorway, a send button \u2014 one cyclic sigh first. The body settles, then you act.",
    notice:
      "The tell: the out-breath is genuinely longer than the in-breath, and somewhere in it the shoulders drop a little. If nothing drops, the exhale wasn\u2019t long enough.",
    whenHard:
      "If it makes you lightheaded, you\u2019re forcing it \u2014 smaller breaths, gentler. This is a brake, not effort. The slow exhale does the work, not big lungfuls.",
    deeperCut: {
      why: "The long exhale lengthens the gap between heartbeats via the vagus nerve \u2014 a direct, mechanical line to the parasympathetic brake, not a metaphor.",
      trap: "Over-breathing \u2014 treating it like a big dramatic inhale. The lever is the EXHALE; the inhale just sets it up.",
      when: "The fastest tool you have for an acute spike, and the only one that works with zero privacy or setup.",
      pairsWith: "Pairs with everything \u2014 the body settling first is what makes the naming and stepping-out moves land.",
    },
    levels: [
      "One guided cyclic sigh.",
      "A few, unguided, from memory.",
      "Reaching for it automatically at the first sign of load \u2014 before you\u2019ve consciously decided to.",
    ],
    transfer:
      "It\u2019s the same reset an athlete uses between points and a singer uses for breath support. Controlling the exhale is a lever that works the same way under any kind of load. You didn\u2019t learn a Stillform trick \u2014 you located something you already carry.",
    comeBack:
      "In a few days, do one from memory before re-reading \u2014 can you recall the rhythm? Double sip in, long out. Pulling the pattern back from memory is what makes it yours.",
  },
];

/** Lookup one lesson by id, or null. */
export function getLesson(id) {
  if (!id || typeof id !== "string") return null;
  return LESSONS.find((l) => l.id === id) || null;
}

/** Lessons for a chapter id, in registry order. */
export function getLessonsForChapter(chapterId) {
  if (!chapterId || typeof chapterId !== "string") return [];
  return LESSONS.filter((l) => l.chapter === chapterId);
}

/** Chapters that actually have at least one lesson (honest-empty: no empty chapters). */
export function getPopulatedChapters() {
  return CHAPTERS.filter((c) => LESSONS.some((l) => l.chapter === c.id));
}
