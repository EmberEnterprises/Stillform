/**
 * learningTrack.js — the Learning Track's lesson registry (rep-then-name, deep).
 *
 * The Track is the thesis made concrete: "expand cognitive capacity via
 * neuroplasticity -> self-mastery" is a claim until the user DOES the move and
 * watches their own mind do it. Each lesson is a full PRACTICE UNIT.
 *
 * The Track teaches the DOABLE moves (each has a firsthand rep). The rest of the
 * science stays in the Library to read — not every vetted concept is a move you
 * drill. Every lesson's conceptId maps to a REAL scienceLibrary entry; no new
 * science is invented here.
 *
 * DEEP MOVE-TEMPLATE (approved; mockup-reviewed). Order of a move:
 *   intro/title   "The move"        · workedExample "Watch it once"
 *   rep           the anchor drill (the user DOES it)
 *   drills        foundation / further (further = harder, desirable difficulty)
 *   name          "what you just did" · runLive · notice · whenHard
 *   deeperCut     why / trap / when / pairsWith
 *   levels        the rungs it climbs · transfer "Where it carries"
 *   conceptId     "Where to check it" (Library) · comeBack (spaced retrieval)
 *
 * TRANSFER DISCIPLINE (locked): far transfer is rare and NOT automatic
 * (Detterman 1993; Sala & Gobet 2017; Barnett & Ceci 2002). The transfer beat
 * names the SAME move across domains by explicit abstraction (high-road
 * transfer; Salomon & Perkins 1989). NEVER a promise this practice makes you
 * better at an unrelated skill. Same overclaim-refusal family as the
 * learning-styles ban below.
 *
 * HARD GUARDRAIL: NO learning-styles / VAK / brain-type matching (Pashler 2008).
 * NO gamification: no scores, streaks, points, pep. Reps are not graded/stored.
 *
 * COPY STATUS: ALL prose is FIRST-PASS DRAFT — Arlin's curriculum voice to set.
 * The structure, transfer mechanic, spaced come-back, and disciplines are the
 * build; the wording is hers.
 *
 * HELD FOR SIGN-OFF (not in LESSONS): a "Reading others" chapter + a microbiases
 * move ("check your read when you're running low") is drafted but withheld —
 * same interpersonal-sensitivity gate as B1 (Arlin sign-off before live ship).
 *
 * Rep `kind`: "word" | "twoline" | "choice" | "breath" | "do" (instruction-only;
 * the user does the action, Continue acts as done — uses rep.doneLabel).
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
    blurb: "Getting outside a thought or a pattern so it stops being the air you breathe and becomes something you can see.",
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
    id: "check-the-hardware",
    chapter: "naming",
    conceptId: "bio-filter",
    title: "Check the hardware first",
    transferLine: "the same check a pilot runs before trusting an instrument",
    intro:
      "Before you trust a feeling as a fact about your life, check whether it\u2019s a fact about your body. A bleak mood on four hours of sleep is often just four hours of sleep. One check, right now.",
    workedExample:
      "Watch it once: someone reads their flat, hopeless afternoon as \u2018my work is going nowhere.\u2019 Then they notice they haven\u2019t eaten since morning. The hopelessness doesn\u2019t fully lift \u2014 but it stops being a verdict on their life and becomes a low-fuel reading. Different problem, different fix.",
    rep: {
      kind: "choice",
      prompt: "What\u2019s your hardware doing right now? Pick the closest.",
      options: ["under-slept", "hungry / low fuel", "wired / over-caffeinated", "in pain", "run-down", "all clear"],
      allowOther: false,
    },
    drills: {
      foundation: [
        "Take the feeling you came in with and ask: how much of this is the hardware you just named?",
        "Recall a recent \u2018everything is wrong\u2019 moment \u2014 what was your body doing that day?",
      ],
      further: [
        "Catch a feeling in real time today and run the hardware check before you act on it.",
        "Notice a feeling that ISN\u2019T explained by the hardware \u2014 that\u2019s the one worth working. The check tells you which is which.",
      ],
    },
    name: "That\u2019s the bio-filter \u2014 separating the software (what you\u2019re feeling about your life) from the hardware (what your body is running on). Misreading a depleted body as a permanent truth is one of the most common ways a feeling lies to you.",
    runLive:
      "Next time a feeling arrives heavy today, run the check before the story: slept? eaten? in pain? The check doesn\u2019t dismiss the feeling \u2014 it tells you what you\u2019re actually dealing with.",
    notice:
      "The tell: once you name the hardware, the feeling often loosens its grip on \u2018this is my life\u2019 and settles into \u2018this is my body right now.\u2019 That shift is the whole move.",
    whenHard:
      "If everything reads \u2018all clear\u2019 but the feeling\u2019s still strong, good \u2014 that\u2019s the signal it\u2019s real software, worth working with the other moves. The check isn\u2019t meant to explain everything away.",
    deeperCut: {
      why: "The body\u2019s state sets the baseline your brain interprets everything against \u2014 the same event lands differently fed vs starving, rested vs wrecked. Naming the hardware re-bases the read.",
      trap: "Using it to dismiss every feeling (\u2018I\u2019m just tired\u2019) and never working the real ones. The check sorts hardware from software; it doesn\u2019t delete software.",
      when: "First thing when a feeling seems bigger than the situation, or recurs at the same time of day \u2014 a clue it\u2019s a body rhythm.",
      pairsWith: "Pairs with Naming a feeling \u2014 name it, then check whether the body is the author.",
    },
    levels: [
      "Run the check after a feeling has already run you.",
      "Run it in the moment, before acting.",
      "Notice the body\u2019s contribution forming and re-base the read before the story even sets.",
    ],
    transfer:
      "It\u2019s the same check a pilot runs before trusting an instrument, or a good engineer runs before trusting a reading \u2014 is the gauge telling me about the world, or about the gauge? Knowing the difference between signal and instrument-error is most of good judgment, anywhere.",
    comeBack:
      "In a few days, before re-reading, recall the check from memory \u2014 what were the things you ask about? Pull the list back yourself; the small effort of recalling it is what makes it automatic when you need it.",
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
    id: "watching-the-watcher",
    chapter: "stepping-back",
    conceptId: "metacognition",
    title: "Watching the watcher",
    transferLine: "the same step a scientist takes observing their own method, not just the result",
    intro:
      "Most of the day you think your thoughts. This move is different: you watch yourself thinking them. That one step up is where every other move in here lives. Let\u2019s take it once.",
    workedExample:
      "Watch it once: mid-worry, someone catches it \u2014 \u2018I\u2019m spinning the same loop again.\u2019 Nothing about the worry changed. But for a second they were standing one level above it, watching the loop instead of being the loop. That vantage point is the move.",
    rep: {
      kind: "do",
      prompt: "Notice one thought you\u2019re having right now \u2014 any thought. Then notice the thing that just noticed it. Sit with that \u2018noticer\u2019 for a breath, then tap below.",
      doneLabel: "Done",
    },
    drills: {
      foundation: [
        "Name what your mind is doing right now as an activity \u2014 \u2018planning,\u2019 \u2018rehearsing,\u2019 \u2018judging\u2019 \u2014 not the content, the activity.",
        "Catch yourself mid-thought once more and label the mode it\u2019s in.",
      ],
      further: [
        "Do it while a feeling\u2019s active \u2014 watch the thinking AND the feeling from one step up, without getting pulled in. Harder, and the rep that matters.",
        "Notice the gap between you and your thoughts widen the longer you watch. Stay in that gap for three breaths.",
      ],
    },
    name: "That\u2019s metacognition \u2014 thinking about your own thinking. It\u2019s the master move: you can\u2019t change a process you\u2019re inside of, only one you can see. Every other move here is a specific use of this one step up.",
    runLive:
      "Once today, when your mind is busy, take the step up: \u2018what is my mind doing right now?\u2019 Name the activity. You\u2019ve just gone meta on it.",
    notice:
      "The tell: a small sense of room. The thoughts keep coming, but there\u2019s now a \u2018you\u2019 watching them arrive, slightly apart from them.",
    whenHard:
      "If you keep getting pulled back into the content, that\u2019s normal \u2014 the pull IS the thing you\u2019re learning to feel. Each time you notice you got pulled in, that noticing is another rep, not a failure.",
    deeperCut: {
      why: "Watching your own thinking recruits the brain\u2019s capacity to model itself \u2014 and a process you can observe is one you can interrupt and steer. That\u2019s the root of self-mastery, not a metaphor for it.",
      trap: "Turning it into more thinking \u2014 analyzing the thought instead of simply watching it. The move is to observe the activity, not to add commentary on it.",
      when: "Any time you\u2019re caught in a loop \u2014 the watching is itself the way out, because a loop runs on not being seen.",
      pairsWith: "Pairs with Stepping outside a thought \u2014 watching the watcher is the wide move; stepping out of a specific thought is the precise one.",
    },
    levels: [
      "Notice you were thinking, after the fact.",
      "Catch the thinking as it happens and name its mode.",
      "Hold the vantage point under load \u2014 watching the process while it\u2019s hot, and steering from there.",
    ],
    transfer:
      "It\u2019s the same step a scientist takes observing their own method, not just the result, or a writer reading their draft as a stranger would. Stepping above your own process to see how it runs is what lets you improve it \u2014 in thinking, in craft, in anything.",
    comeBack:
      "In a few days, recall from memory what the step actually was before re-reading. If you have to reach for it, good \u2014 reaching is the rep that wires it in.",
  },
  {
    id: "spot-a-repeat",
    chapter: "stepping-back",
    conceptId: "pattern-recognition",
    title: "Spot a repeat",
    transferLine: "the same eye a coach has for the move you keep making",
    intro:
      "A reaction you have once is an event. The same reaction three times is a pattern \u2014 and a pattern you can see is one you can get ahead of. Let\u2019s find one of yours.",
    workedExample:
      "Watch it once: someone notices they go quiet and curt most Sunday evenings. Once, it\u2019s a bad mood. Named as a repeat \u2014 \u2018this happens most Sundays\u2019 \u2014 it stops being random weather and becomes a thing with a shape, a trigger, and a possible exit.",
    rep: {
      kind: "word",
      prompt: "Name one reaction you\u2019ve had more than once lately \u2014 a mood, a move, a spiral that keeps recurring. A few words.",
      placeholder: "the thing that repeats",
    },
    drills: {
      foundation: [
        "For the repeat you named, what tends to come right before it? Name the trigger.",
        "Has it shown up this week? When?",
      ],
      further: [
        "Find a repeat you\u2019d rather not admit to \u2014 the harder-to-see ones run you the most.",
        "Name a repeat that\u2019s GOOD \u2014 something steady you do that works. Patterns aren\u2019t only problems.",
      ],
    },
    name: "That\u2019s pattern recognition \u2014 the engine under self-knowledge. A pattern stays in charge as long as it\u2019s invisible; the moment you can name \u2018this happens, around then, after that,\u2019 it stops being weather and becomes something you can meet on purpose.",
    runLive:
      "When a familiar feeling hits today, ask: \u2018is this a one-off, or the repeat?\u2019 If it\u2019s the repeat, you already know its shape \u2014 that\u2019s the advantage.",
    notice:
      "The tell: a click of recognition \u2014 \u2018oh, this again.\u2019 That recognition is the distance that lets you choose instead of just react.",
    whenHard:
      "If nothing obvious repeats, look at times, places, or people rather than feelings \u2014 patterns often hide in the WHEN and WHO, not the what. And some take weeks to see; that\u2019s what the app\u2019s own pattern surfacing is for.",
    deeperCut: {
      why: "Naming a recurrence turns an automatic loop into an explicit prediction \u2014 and a prediction can be checked, met early, and updated. Invisible patterns just run; named ones become choices.",
      trap: "Forcing a pattern that isn\u2019t there, or treating correlation as cause (\u2018X always makes me Y\u2019). Name what recurs; stay honest that it\u2019s a tendency, not a law.",
      when: "Most useful just before a known trigger \u2014 that\u2019s when seeing the repeat lets you get ahead of it instead of inside it.",
      pairsWith: "Pairs with the app\u2019s own pattern surfacing \u2014 you spot the repeats you can feel; the app surfaces the ones only the data shows.",
    },
    levels: [
      "Name a repeat after you\u2019ve noticed it a few times.",
      "Catch the repeat as it\u2019s starting.",
      "See the trigger that fires it and meet the pattern before it runs \u2014 the whole point.",
    ],
    transfer:
      "It\u2019s the same eye a coach has for the move an athlete keeps making, or an analyst has for the recurring setup. Seeing the repeat in the noise is what separates reacting from anticipating \u2014 in your own mind as much as anywhere.",
    comeBack:
      "In a few days, before re-reading, try to recall the repeat you named \u2014 and whether it\u2019s shown up since. Tracking it from memory is itself the practice of watching your own patterns.",
  },
  {
    id: "ride-the-urge",
    chapter: "stepping-back",
    conceptId: "urge-surfing",
    title: "Ride the urge",
    transferLine: "the same patience a free-diver has waiting out the urge to breathe",
    intro:
      "An urge feels like a command \u2014 do it now. It\u2019s actually a wave: it rises, peaks, and falls on its own if you don\u2019t act. This move is learning to ride it instead of obey it. One rep.",
    workedExample:
      "Watch it once: the pull to check the phone hits. Instead of grabbing it, someone just watches the urge \u2014 notices it climb, feel almost unbearable, then, unobeyed, start to fade. The phone\u2019s still there. The urge passed without being fed. They learned it would.",
    rep: {
      kind: "do",
      prompt: "Bring to mind an urge you feel right now \u2014 to check something, react, snack, escape. Don\u2019t act on it. Just watch it: where it sits in your body, how strong it is. Watch for a few breaths as it shifts, then tap below.",
      doneLabel: "It shifted",
    },
    drills: {
      foundation: [
        "Name where the urge lives in your body \u2014 chest, hands, jaw. Urges are physical before they\u2019re decisions.",
        "Rate it 1\u201310, watch for thirty seconds, rate it again. Notice it moved.",
      ],
      further: [
        "Ride a stronger urge \u2014 one you usually obey instantly. The bigger the wave, the more the rep teaches.",
        "Do it without white-knuckling \u2014 not gritting against the urge, just watching it, curious. Resisting feeds it; watching starves it.",
      ],
    },
    name: "That was urge-surfing \u2014 staying with an urge as a passing sensation instead of an order. Every time you watch one crest and fall without acting, you teach your nervous system that the urge isn\u2019t a command, and its grip loosens for next time.",
    runLive:
      "Next time an urge says \u2018now,\u2019 today, put one breath between the urge and the action. Watch the wave for that breath. Often that\u2019s all it takes for the peak to pass.",
    notice:
      "The tell: the urge that felt like it would last forever noticeably eases while you watch it \u2014 and you\u2019re still here, not having obeyed it. That\u2019s the proof it was a wave, not a command.",
    whenHard:
      "If the urge wins sometimes, that\u2019s expected \u2014 you\u2019re not after a perfect record, you\u2019re building a capacity. Even watching it for two seconds before acting is a rep that counts.",
    deeperCut: {
      why: "Urges follow a rise-and-fall curve; acting on one reinforces it for next time, while watching it pass without acting weakens that loop. You\u2019re retraining the response through the not-acting.",
      trap: "Turning it into a willpower clench \u2014 fighting the urge. The fight keeps you fused to it. The move is detached watching, not gritted resistance.",
      when: "The instant an urge says \u2018now\u2019 \u2014 that \u2018now\u2019 is the wave telling you it\u2019s near its peak and about to fall.",
      pairsWith: "Pairs with the exhale lever \u2014 one long exhale gives you the breath of space to watch the urge instead of obey it.",
    },
    levels: [
      "Watch a mild urge pass.",
      "Ride a strong urge you\u2019d normally obey.",
      "Feel the urge arrive and watch it without effort \u2014 no clench, just the calm knowledge it\u2019ll pass.",
    ],
    transfer:
      "It\u2019s the same patience a free-diver has waiting out the urge to breathe, or anyone resisting the easy quick move for the better slow one. Tolerating a strong pull without obeying it is the muscle under most discipline \u2014 you just worked it directly.",
    comeBack:
      "In a few days, recall the move from memory before re-reading: what did you do with the urge? Not fight it, not feed it \u2014 watch it. Pulling that back yourself is what makes it available when an urge actually hits.",
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
  {
    id: "drop-into-the-body",
    chapter: "the-body",
    conceptId: "somatic-interrupt",
    title: "Drop back into the body",
    transferLine: "the same reset a performer uses to get out of their head and into the room",
    intro:
      "When you\u2019re spun up in your head, the fastest exit isn\u2019t another thought \u2014 it\u2019s a single point of physical contact. Feet on the floor. Jaw unclenched. The body is the door out of the spiral. Let\u2019s use it once.",
    workedExample:
      "Watch it once: mid-spiral, someone presses their feet flat into the floor and feels the contact for a moment. The thoughts don\u2019t stop \u2014 but they get a half-step quieter, because attention can\u2019t be fully in the runaway story and fully in the soles of the feet at once. The body pulled focus back.",
    rep: {
      kind: "do",
      prompt: "Right now: plant both feet flat and feel the floor pushing back. Unclench your jaw. Drop your shoulders. Stay with the physical sensation for three breaths \u2014 not the thoughts, the contact. Then tap below.",
      doneLabel: "Done",
    },
    drills: {
      foundation: [
        "Name what you feel in contact with the world right now \u2014 the chair, the floor, your feet. Anything physical.",
        "Find one spot of tension you didn\u2019t know you were holding, and let it go.",
      ],
      further: [
        "Do it while a thought is actively pulling \u2014 drop to the body without waiting for the thought to finish. Hard, and the point.",
        "Use a tiny cue with eyes open in a normal moment \u2014 feet, breath, jaw \u2014 so it works in a meeting, not just in private.",
      ],
    },
    name: "That\u2019s a somatic interrupt \u2014 using a physical anchor to break the pull of a runaway mental loop. Attention is mostly single-channel; filling it with a body sensation leaves less room for the spiral. It\u2019s not avoidance \u2014 it\u2019s changing which channel you\u2019re on.",
    runLive:
      "Next time your head runs away today, drop to one physical point \u2014 feet, breath, hands \u2014 for a few seconds before you do anything else. The body is the handle when thoughts won\u2019t give you one.",
    notice:
      "The tell: a small drop in the volume of the thoughts, and a sense of being HERE \u2014 in the room, in the body \u2014 rather than lost in the loop. Even a little counts.",
    whenHard:
      "If the thoughts pull you back out instantly, that\u2019s fine \u2014 just return to the body again. The move isn\u2019t holding the body forever; it\u2019s the returning, as many times as it takes.",
    deeperCut: {
      why: "Attention is largely single-channel \u2014 a vivid physical sensation competes directly with the mental loop for it, which is why grounding in the body quiets the head without your having to argue the thoughts down.",
      trap: "Doing it as another thing to think ABOUT (\u2018am I grounding right?\u2019) instead of actually feeling the contact. The move is sensation, not analysis of sensation.",
      when: "The moment you notice you\u2019ve left the room and gone into your head \u2014 the leaving is the cue to drop back.",
      pairsWith: "Pairs with the exhale lever \u2014 the breath is itself a body anchor; the long exhale and the felt contact work the same channel.",
    },
    levels: [
      "Use a body anchor when you remember to, in private.",
      "Use it mid-spiral, deliberately.",
      "Drop to the body automatically, eyes open, in the middle of real life \u2014 before the spiral builds.",
    ],
    transfer:
      "It\u2019s the same reset a performer uses to get out of their head and into the room, or an athlete uses to stop overthinking and feel the movement. Coming back to the body to quiet the mind is a lever that works the same under any kind of pressure.",
    comeBack:
      "In a few days, recall the anchors from memory before re-reading \u2014 what were the contact points? Feet, jaw, shoulders, breath. Pulling them back yourself is what makes one available the instant you need it.",
  },
  {
    id: "scan-once",
    chapter: "the-body",
    conceptId: "body-scan",
    title: "Scan once",
    transferLine: "the same sweep a mechanic does listening to an engine before guessing at it",
    intro:
      "Your body is usually holding a feeling somewhere before your mind has named it \u2014 a tight jaw, locked shoulders, a held breath. A quick scan reads the signal at its source. Let\u2019s take one pass.",
    workedExample:
      "Watch it once: someone feeling vaguely \u2018off\u2019 does a slow sweep \u2014 jaw (tight), shoulders (up by the ears), stomach (knotted). Suddenly the vague \u2018off\u2019 has a location and a shape. They didn\u2019t think their way to it; they read it off the body, which knew first.",
    rep: {
      kind: "do",
      prompt: "Take one slow pass, top to bottom. Jaw \u2014 what\u2019s it doing? Shoulders \u2014 up or down? Chest and breath \u2014 tight or open? Stomach \u2014 settled or knotted? Don\u2019t fix anything yet. Just read each one. Then tap below.",
      doneLabel: "Done reading",
    },
    drills: {
      foundation: [
        "Name the single tightest spot you found. That\u2019s where the feeling is living.",
        "For that one spot, let it soften a little on an exhale. Notice if the feeling shifts with it.",
      ],
      further: [
        "Scan before you know what you feel \u2014 use the body to tell you, instead of asking your mind first.",
        "Catch a body signal in real time today (a clenched jaw mid-email) and read it as information before it builds.",
      ],
    },
    name: "That was a body scan \u2014 reading your state from the bottom up instead of the top down. The body often registers a feeling before the mind has words for it, so the scan can name what\u2019s happening earlier and more honestly than thinking can.",
    runLive:
      "Once today, before you decide how you\u2019re \u2018doing,\u2019 take a ten-second scan first. Let the body answer before the mind does. It\u2019s often the more honest report.",
    notice:
      "The tell: a vague feeling gets a location and a texture \u2014 \u2018off\u2019 becomes \u2018tight across the chest.\u2019 Once it has a place, it has a handle, and the body-first moves can work on it.",
    whenHard:
      "If you don\u2019t feel much, that\u2019s a real reading too \u2014 a quiet body is information, not a failed scan. And reading the body is trainable; the signal gets clearer with reps.",
    deeperCut: {
      why: "Bodily states feed directly into emotion \u2014 reading them accurately (interoception) is tied to better regulation, because you\u2019re working with the signal at its source instead of the story built on top of it.",
      trap: "Rushing to fix the tension instead of reading it first. The scan is diagnosis, not treatment \u2014 name what\u2019s there before you change it.",
      when: "When a feeling is vague or you\u2019re not sure what you feel \u2014 the body usually already knows.",
      pairsWith: "Pairs with Naming a feeling \u2014 the scan finds where it lives; naming puts the word on it.",
    },
    levels: [
      "Scan when prompted, slowly.",
      "Scan quickly and accurately on your own.",
      "Catch a body signal forming in real time and read it before it becomes a feeling you have to manage.",
    ],
    transfer:
      "It\u2019s the same sweep a mechanic does listening to an engine before guessing at the fault, or a clinician does before treating. Reading the system at its source before acting on the surface symptom is what good diagnosis is \u2014 you just did it on yourself.",
    comeBack:
      "In a few days, run a scan from memory before re-reading \u2014 what were the checkpoints? Jaw, shoulders, chest, stomach. Recalling the route yourself is what makes the scan something you own, not something you read.",
  },
  {
    id: "catching-the-wander",
    chapter: "stepping-back",
    conceptId: "dmn",
    title: "Catching the wander",
    transferLine: "the same catch a driver makes noticing they\u2019ve drifted lanes",
    intro:
      "Your mind runs a background channel \u2014 replays, rehearsals, what-ifs. You can\u2019t switch it off. But you can catch it running, and the catch itself is the skill. Let\u2019s do one catch, now.",
    workedExample:
      "Watch it once: someone\u2019s reading a report and realizes they\u2019ve read the same paragraph three times \u2014 the mind was replaying this morning\u2019s meeting. The moment they NOTICE the replay, they\u2019re back. Nothing was fixed, nothing argued with. Just: caught it.",
    rep: {
      kind: "do",
      prompt: "Sit for a few breaths and let your mind do whatever it does. Your only job: the instant you notice it has wandered somewhere \u2014 a replay, a plan, a worry \u2014 silently mark it: \u201cwandered.\u201d One catch is the rep. Then tap below.",
      doneLabel: "Caught one",
    },
    drills: {
      foundation: [
        "Catch the wander once during an ordinary task today \u2014 dishes, a walk, an email.",
        "When you catch it, notice WHERE it went: past replay or future rehearsal. Just notice which.",
      ],
      further: [
        "Catch it mid-conversation \u2014 the moment you realize you\u2019re composing your reply instead of listening.",
        "Catch the quiet version: the wander that feels like \u2018thinking something through\u2019 but is really the same loop on its third lap.",
      ],
    },
    name: "That was catching the default mode \u2014 the brain\u2019s resting circuit that runs mind-wandering and rumination. You can\u2019t stop it starting. Catching it running is the whole move, and the catch gets faster with reps.",
    runLive:
      "Next time you notice you\u2019ve read a paragraph twice or lost the thread of what someone said \u2014 that\u2019s the wander, already caught. Mark it and come back. That\u2019s the move in the wild.",
    notice:
      "The tell it\u2019s working: the gap between when the mind leaves and when you notice gets shorter. First it\u2019s minutes. With reps it\u2019s seconds.",
    whenHard:
      "If you sit down to catch a wander and the mind won\u2019t wander \u2014 that\u2019s fine, and it\u2019s temporary. Watching FOR the wander is itself the focused state. It will slip eventually; the catch still counts.",
    deeperCut: {
      why: "Task-focused attention and the wandering circuit suppress each other \u2014 which is why a counted breath can interrupt a rumination loop. Catching the wander recruits the task side on demand.",
      trap: "Judging the wander \u2014 \u2018I\u2019m so distracted\u2019 \u2014 is just more wandering, now about you. The rep is the neutral catch, not the verdict.",
      when: "Anytime. It\u2019s the most portable rep in the track \u2014 no tool, no pause, no privacy needed.",
      pairsWith: "Pairs with Meeting the noticer \u2014 the catch shows you the wander; the noticer is what did the catching.",
    },
    levels: [
      "Catch one wander when you\u2019re sitting still and looking for it.",
      "Catch one mid-task, unprompted.",
      "Catch one under load \u2014 mid-conflict, mid-deadline \u2014 while the pull to stay in the loop is strong.",
    ],
    transfer:
      "It\u2019s the same catch underneath a lot of skill \u2014 a driver noticing the drift, a chess player noticing they\u2019ve stopped calculating and started hoping. Every craft has a version of \u2018notice you\u2019ve left the task.\u2019 You just trained the raw form of it.",
    comeBack:
      "Come back in a few days \u2014 and don\u2019t re-read this first. Ask yourself from memory: what counts as the rep? The recall effort is what files it.",
  },
  {
    id: "letting-it-pass",
    chapter: "stepping-back",
    conceptId: "mct",
    title: "Letting a thought pass",
    transferLine: "the same restraint a fisherman has watching a fish he isn\u2019t going to take",
    intro:
      "Most thoughts don\u2019t need an answer. But answering is a reflex \u2014 a thought arrives and you engage: argue, plan, fix. There\u2019s another option almost nobody practices: watch it arrive, and let it leave. Once, now.",
    workedExample:
      "Watch it once: the thought \u201cI should check if she replied\u201d arrives. Normally: phone\u2019s already in hand. This time the person just \u2026 watches it sit there. Doesn\u2019t argue it\u2019s irrational, doesn\u2019t obey it. Ten seconds later it\u2019s gone on its own, like weather.",
    rep: {
      kind: "do",
      prompt: "Wait for the next thought to arrive \u2014 any thought. Don\u2019t answer it, don\u2019t push it away, don\u2019t follow it. Just watch it the way you\u2019d watch a car pass your window. When it\u2019s moved on by itself, tap below.",
      doneLabel: "It passed",
    },
    drills: {
      foundation: [
        "Let one low-stakes thought pass today \u2014 an urge to check, a small \u2018I should\u2019.",
        "Notice the difference in your hands and jaw between answering a thought and letting it pass.",
      ],
      further: [
        "Let a sticky one pass \u2014 a thought that usually gets a full internal debate. You\u2019re not agreeing with it; you\u2019re declining the meeting.",
        "When a worry arrives at a bad time, tell it \u2018later\u2019 \u2014 and actually give it two minutes later, on your schedule. Postponing is a form of passing.",
      ],
    },
    name: "That\u2019s detached mindfulness \u2014 the core move of metacognitive work. You changed your relationship to the thought instead of its content: \u2018I\u2019m having this thought\u2019 rather than \u2018I am this thought.\u2019 No argument was needed.",
    runLive:
      "Next time a thought demands an immediate internal response \u2014 a replay, a defense, a checking urge \u2014 try declining once. Watch it instead. Most of them leave on their own.",
    notice:
      "The tell it\u2019s working: thoughts start feeling like events that happen TO the room, not orders addressed to you.",
    whenHard:
      "Some thoughts won\u2019t pass \u2014 they circle back harder. That\u2019s information, not failure: a thought that insists is usually carrying a real signal, and it\u2019s a candidate for the actual work (Reframe), not for passing. Letting-pass is for the traffic, not the freight.",
    deeperCut: {
      why: "Working on your RELATIONSHIP to thoughts \u2014 rather than debating each one\u2019s content \u2014 is the metacognitive layer. One skill covers ten thousand thoughts; content-work has to be done one thought at a time.",
      trap: "\u2018Letting it pass\u2019 can quietly become suppression \u2014 pushing it away and calling it detachment. Passing is open-handed: the thought is allowed to be there. It just isn\u2019t obeyed.",
      when: "Traffic thoughts: urges, replays, small what-ifs. Not for grief, not for real decisions \u2014 those deserve the full work.",
      pairsWith: "Pairs with Catching the wander \u2014 the catch notices you\u2019ve been taken; letting-pass is how you decline being taken in the first place.",
    },
    levels: [
      "Let one neutral thought pass while sitting quietly.",
      "Let a mildly charged one pass \u2014 an urge or small worry \u2014 mid-day.",
      "Under load, watch a hot thought arrive and hold the watching stance for even three seconds before choosing your response.",
    ],
    transfer:
      "It\u2019s the same restraint underneath good judgment everywhere \u2014 the negotiator who hears the provocation and doesn\u2019t take the bait, the editor who lets a first idea pass to see if a better one is behind it. Not every arrival deserves an answer. You just practiced the raw form.",
    comeBack:
      "Come back in a few days \u2014 from memory first: what\u2019s the difference between letting a thought pass and pushing it away? If you can answer that cold, it\u2019s filing.",
  },
  {
    id: "the-mismatch-move",
    chapter: "stepping-back",
    conceptId: "reconsolidation",
    title: "The mismatch move",
    transferLine: "the same update a scientist runs when the data contradicts the model",
    intro:
      "Some reads don\u2019t fade with time \u2014 \u201cI freeze under pressure,\u201d \u201cpeople leave.\u201d They\u2019re old learning, and old learning doesn\u2019t update from argument. It updates from contradiction, held while the read is warm. Let\u2019s run the shape of it once.",
    workedExample:
      "Watch it once: the read is \u201cI go blank when it matters.\u201d The person recalls it \u2014 actually lets it be felt for a beat \u2014 and then holds ONE lived moment against it: the night the deploy broke and they were the one who stayed clear. Both are true in the room at once. The old read has to sit in the same space as the moment that contradicts it \u2014 and that\u2019s the condition under which it can change.",
    rep: {
      kind: "twoline",
      prompt1: "A read about yourself that keeps recurring \u2014 write it the way it says itself.",
      placeholder1: "the recurring read",
      prompt2: "One specific lived moment \u2014 real, yours \u2014 that doesn\u2019t fit it.",
      placeholder2: "the moment that doesn\u2019t fit",
    },
    drills: {
      foundation: [
        "Run the pair again on the same read tomorrow \u2014 same read, a DIFFERENT moment that doesn\u2019t fit. Contradictions compound.",
        "Notice the felt \u2018click\u2019 or friction when both lines are in view at once. That friction is the working part, not a problem.",
      ],
      further: [
        "Run it while the read is actually active \u2014 right after it fires \u2014 not from a calm distance. Warm is when it updates.",
        "Take a read someone gave you long ago and find the moment your own record contradicts it.",
      ],
    },
    name: "That\u2019s the mismatch move \u2014 the shape memory reconsolidation research points at. A recalled read, met with a felt contradiction while it\u2019s active, can update the learning itself \u2014 not just add a rehearsed comeback on top.",
    runLive:
      "The live version matters most: next time the old read FIRES \u2014 in the moment, heart rate up \u2014 hold your contradicting moment against it right there. Warm beats calm for this one move.",
    notice:
      "The tell it\u2019s working: the read starts arriving with less authority \u2014 same words, weaker voltage. Eventually it arrives as a memory of a belief, not a belief.",
    whenHard:
      "If no contradicting moment comes, don\u2019t invent one \u2014 a manufactured contradiction updates nothing. Ask the app\u2019s own record: your sessions and logs often hold the moment you can\u2019t recall. And some reads are accurate; those aren\u2019t for this move, they\u2019re for the work.",
    deeperCut: {
      why: "Recalled-and-active is the state in which old learning is editable; the felt contradiction, delivered in that window, is the working ingredient. Argument from a calm distance mostly bounces off.",
      trap: "Turning it into a debate \u2014 prosecuting the old read with logic. The move isn\u2019t winning the argument; it\u2019s holding two true things in one space and letting the mismatch do the work.",
      when: "Recurring reads with history behind them. For a one-off distorted thought, the ordinary Reframe work is the right tool.",
      pairsWith: "Pairs with Reframe itself \u2014 Reframe finds the new read; the mismatch move is how a new read gets under an old one.",
    },
    levels: [
      "Run the pair on paper, calm, for a mild read.",
      "Run it on a read with real history, and feel the friction without flinching to one side.",
      "Run it live \u2014 inside the minutes after the read fires \u2014 and hold both.",
    ],
    transfer:
      "It\u2019s the same update underneath real learning anywhere \u2014 the scientist holding the anomaly against the model, the coach replaying the loss against \u2018we always choke.\u2019 Beliefs that meet their counter-evidence while activated are the ones that actually move.",
    comeBack:
      "Come back in a few days \u2014 recall first: what are the two ingredients, and which state does the read need to be in? Then re-read to check yourself.",
  },
  {
    id: "body-before-story",
    chapter: "the-body",
    conceptId: "body-first",
    title: "Body before story",
    transferLine: "the same order a pilot runs \u2014 instruments first, interpretation second",
    intro:
      "When something hits, the mind starts writing the story immediately \u2014 who did what, what it means. The body knew first, and it speaks plainer. The move: read the body BEFORE you read the story. Once, now.",
    workedExample:
      "Watch it once: a message lands badly. The story engine spins up \u2014 \u201cthey\u2019re annoyed with me.\u201d The person pauses and checks the instruments instead: jaw tight, breath high, shoulders up. THAT\u2019s the data. The story was one interpretation of it \u2014 and reading the body first made it visible as an interpretation.",
    rep: {
      kind: "twoline",
      prompt1: "Right now: what is your body doing? Sensation words only \u2014 tight, warm, buzzing, heavy.",
      placeholder1: "the body, in sensation words",
      prompt2: "Now the story that was waiting to be written about it \u2014 one line.",
      placeholder2: "the story it was about to become",
    },
    drills: {
      foundation: [
        "Once today, when a feeling arrives, name the body first \u2014 three sensation words before any story words.",
        "Notice which comes to you more easily, body or story. No fixing; just notice the default order.",
      ],
      further: [
        "Mid-conversation, do a silent instrument check \u2014 jaw, shoulders, breath \u2014 without leaving the conversation.",
        "When you\u2019re too activated to think straight, skip the story entirely: body words, then breath, and only then decide if the story needs writing at all.",
      ],
    },
    name: "That\u2019s the body-first path. Outside a certain zone of activation, the thinking work \u2014 naming, reframing \u2014 barely lands; the body has to settle first. Reading the body before the story is how you check which zone you\u2019re in.",
    runLive:
      "Next spike: instruments first. Three sensation words before a single story word. If the instruments read \u2018far outside the zone,\u2019 that\u2019s your cue for breath work before any thinking work.",
    notice:
      "The tell it\u2019s working: stories start arriving with a label on them \u2014 \u2018this is my read, written while my jaw was tight\u2019 \u2014 instead of arriving as plain fact.",
    whenHard:
      "If the body reads as \u2018nothing\u2019 \u2014 blank, numb \u2014 that\u2019s a reading too, and a meaningful one: shutdown is outside the zone on the low side. Don\u2019t force sensation; note \u2018flat\u2019 and be gentle with the thinking work for now.",
    deeperCut: {
      why: "There\u2019s a window of activation inside which higher-order work is possible; outside it, analysis mostly fails. The body is the fastest honest gauge of where you are relative to that window.",
      trap: "Turning the body-read into a story about the body \u2014 \u2018my chest is tight, something must be wrong with me.\u2019 Sensation words only. The story engine will try to annex anything.",
      when: "First seconds after impact, before the story sets. Also any time thinking feels like wading \u2014 check the instruments; you may be outside the zone.",
      pairsWith: "Pairs with Naming a feeling \u2014 body-first tells you WHETHER the naming work can land yet; naming is the first move once it can.",
    },
    levels: [
      "Read the body on request, calm.",
      "Read it inside the first minute of a real spike, before the story finishes writing.",
      "Make it the default order under load \u2014 instruments first, every time it matters.",
    ],
    transfer:
      "It\u2019s the same discipline underneath every high-stakes craft \u2014 the pilot trusting instruments over the feeling that the horizon moved, the medic checking vitals before the patient\u2019s theory. Data before interpretation. You carry the instruments everywhere; this rep is learning to read them first.",
    comeBack:
      "Come back in a few days \u2014 recall first: what\u2019s the order, and what kind of words count as a body read?",
  },
  {
    id: "shifting-gears",
    chapter: "the-body",
    conceptId: "autonomic-flexibility",
    title: "Shifting gears",
    transferLine: "the same range an athlete trains \u2014 fast recovery, not just fast effort",
    intro:
      "The capacity underneath all of this isn\u2019t staying calm \u2014 it\u2019s SHIFTING: moving cleanly between effort and recovery, activation and rest. That range is trainable, and every deliberate shift is a rep. Do one down-shift now.",
    workedExample:
      "Watch it once: end of a charged call. Instead of carrying the charge into the next thing, the person takes sixty seconds and shifts down on purpose \u2014 long exhales, shoulders released. Then into the next meeting clean. The skill wasn\u2019t avoiding the charge; it was the gear change after.",
    rep: {
      kind: "breath",
      prompt: "Wherever your system is right now, shift it one gear down on purpose: breathe in through your nose, then out through your mouth twice as long, three times. Feel for the shift itself \u2014 that\u2019s the thing being trained. Then tap below.",
      doneLabel: "Shifted",
    },
    drills: {
      foundation: [
        "One deliberate down-shift today at a transition \u2014 after a call, before walking in the door.",
        "Notice your recovery time after the next small spike: how long until baseline? Just notice; the number isn\u2019t a grade.",
      ],
      further: [
        "Train the other direction too: before something that needs energy, shift UP on purpose \u2014 quicker breaths, posture up, then go. Range is both directions.",
        "Chain it: full effort in a hard moment, then a clean deliberate down-shift after \u2014 the full gear cycle, on purpose.",
      ],
    },
    name: "That\u2019s autonomic flexibility \u2014 your nervous system\u2019s ability to move between activation and recovery. It\u2019s among the strongest markers of resilience, and it trains like a muscle: every deliberate shift is a rep, and the sessions here have been training it all along.",
    runLive:
      "Put one deliberate gear change at a real transition today \u2014 the commute\u2019s end, the meeting\u2019s end. Transitions are where the reps hide.",
    notice:
      "The tell it\u2019s working over weeks: spikes still come, but the RETURN gets faster. Recovery speed, not calm, is the metric that moves.",
    whenHard:
      "If a down-shift won\u2019t take \u2014 system stays revved \u2014 don\u2019t fight it into submission. Do the three exhales, accept whatever partial shift happens, and let it be a rep anyway. Range builds from attempts, not from perfect landings.",
    deeperCut: {
      why: "Flexibility between fight-or-flight and rest-and-digest \u2014 not the absence of activation \u2014 is what tracks with resilience. A system that can rev is fine; a system that can\u2019t come back down is the problem being trained away.",
      trap: "Chasing calm as the goal. Calm is a state; flexibility is a capacity. Training only the down-shift builds half the range.",
      when: "Transitions, recoveries, and on-ramps \u2014 any seam between two different demands on you.",
      pairsWith: "Pairs with the breathing patterns you already run \u2014 they\u2019re the mechanism; this lesson is what they\u2019re building underneath.",
    },
    levels: [
      "One clean deliberate down-shift, calm conditions.",
      "A down-shift inside two minutes of a real spike.",
      "The full cycle on demand \u2014 up for the thing that needs you, down clean after \u2014 in one day, on purpose.",
    ],
    transfer:
      "It\u2019s the same range underneath elite performance anywhere \u2014 the athlete whose heart rate drops between points, the surgeon who\u2019s fully on in the field and fully off at the sink. The skill was never staying level; it was owning the gearbox. That\u2019s what the practice has been building.",
    comeBack:
      "Come back in a few days \u2014 recall first: what\u2019s actually being trained \u2014 the calm, or the shift? If your answer is the shift, it\u2019s in.",
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
