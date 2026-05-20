# CHIP_DEFINITIONS.md
**Stillform — chip ⓘ definitions (feel chips + pattern-work chips)**
**ARA Embers LLC · Locked Apr 30, 2026 · Last updated May 20, 2026 (pattern-work chip definitions added — Bias Profile, spec stage)**

---

## What this is

**The locked source of truth for the 10 feel chips and their user-facing definitions.** Definitions appear when a user taps the ⓘ button next to a chip. Single source of truth for chip semantics across the app; `src/v2/lib/beatConfig.js` and any future chip surface reads from this file's vocabulary. If a chip is added, removed, or revised, this file is the canonical destination for the change.

## Voice anchor

The authoritative voice for chip-state language is the `feelMap` in `netlify/functions/reframe.js` (the AI prompt that loads when each chip is selected). User-facing definitions need to match that voice without paraphrasing badly. Specifically:

- **No pathologizing.** No chip describes a "problem to fix." Each one names a real human state.
- **Body and mind both.** Where the AI prompt names somatic mechanism, the user-facing version names what it feels like in the body.
- **Tells the user what selecting it does.** The ⓘ should answer: "Why pick this one over an adjacent one? What changes in the system if I do?"
- **No clinical jargon.** "Hypoarousal," "amygdala," "prefrontal cortex" — these stay in the AI prompt and the science sheet, not in the user-facing chip definition.
- **~40-60 words each.** Long enough to differentiate, short enough to read fast.

## The 9 definitions

---

### Excited

**Excited.** High energy, positive — your system is up and forward. Could be anticipation, momentum, hype, or genuine joy moving through. Selecting Excited tells Stillform you're not here to come down. The system stays out of your way, helps you direct the energy, and quietly watches for the moves you might overcommit to when everything feels possible.

---

### Focused

**Focused.** Locked in. Mind sharp, body settled around the work. Different from Excited — Focused is steady, not pushed. Selecting Focused tells Stillform you're already in the state, not trying to enter it. Responses stay tight and operational. The system won't try to regulate you because there's nothing that needs regulating.

---

### Settled

**Settled.** Low arousal, positive valence. Body soft, breath even, nervous system at rest. Mind clear without effort. Not high energy, not low energy — at-ease. The state regulation tools are designed to produce. Selecting Settled tells Stillform you're already in the regulated state and you want to use it, not change it.

---

### Anxious

**Anxious.** The threat-detection system is on. Could be a specific worry or low-grade dread without an obvious target. Body usually shows up first — chest, stomach, jaw. Selecting Anxious tells Stillform to slow down with you, separate what's actually happening from what your brain is adding to it, and not rush you toward feeling better.

---

### Angry

**Angry.** Heat, tension, sharper edges to your thinking. Could be at someone, at a situation, at yourself. Selecting Angry tells Stillform to acknowledge it fully before going anywhere — the state isn't a problem, the action you might take from inside it is what matters. Decisions slow down. The system helps you separate the feeling from what to do with it.

---

### Stuck

**Stuck.** Something hasn't clicked yet. Not strong feeling, not no feeling — a cognitive state where the thinking is unclear but you know it. Decision paralysis. Replaying without resolving. Selecting Stuck tells Stillform to skip the body work and go straight to the thinking. One question at a time. You bring the specifics; the system helps the picture come into focus.

---

### Mixed

**Mixed.** More than one state active at once. Could be a fight you regret but also feel justified about. Could be excited and scared. Could be sad about something good. Selecting Mixed tells Stillform not to try to resolve the complexity into a single feeling — the contradiction is real. The system helps you identify which thread is loudest right now without flattening the others.

---

### Flat

**Flat.** Low energy, low motivation, things-are-grey. Not depression as a diagnosis — a state. The system feels tired, not broken. Selecting Flat tells Stillform not to cheerlead, not to push, and not to tell you it's okay to feel off. The system meets the energy you have with directness, and helps you find one concrete thing — not a vague reset, an actual specific action.

---

### Distant

**Distant.** Disconnected from the body. Things feel far away, muffled, like you're watching from outside. Different from Flat — Flat is low energy still in the body; Distant is a kind of stepping-out. Selecting Distant tells Stillform that words alone won't reach, and the system routes you to Body Scan first to help you re-enter the room before re-entering the thought.

---

### Unsure

**Unsure.** You can't locate what you're feeling clearly — maybe several things at once, maybe nothing legible, maybe the body's giving you signal but it hasn't resolved into a name yet. Different from Mixed — Mixed is two recognizable states at once; Unsure is one state that hasn't surfaced into language. Selecting Unsure tells Stillform you want to start with naming itself as the work, not skip past it. The system slows down and gives the practice of finding the name space, instead of pretending to already know.

---

## Phase 4 — per-beat chip subsets (locked May 16, 2026)

When the v2 spine ships beat-aware variants (`src/v2/lib/beatConfig.js`), the chip vocabulary above is not surfaced as a flat 10-chip row on every beat. Each beat exposes a subset that matches the cognitive work that beat is for. The 10-chip canon stays the single source of truth — chip subsets are filters, not redefinitions.

**Main beat:** all 10 chips. Default in-the-moment surface; user may be in any state.

**Morning beat (7 chips):** Excited, Focused, Settled, Anxious, Mixed, Flat, Unsure. Excludes Angry, Stuck, Distant — morning is not the time to surface unresolved residue from the prior day; that work belongs to main beat or EOD. If a user wakes feeling angry/stuck/distant, the framing of "anchor today" doesn't fit, and we'd rather they route to main beat than try to ship those states through anticipatory work.

**EOD beat (8 chips):** Settled, Anxious, Angry, Stuck, Mixed, Flat, Distant, Unsure. Excludes Excited, Focused — excitement and focus at end-of-day signal the user is still engaged with work that hasn't closed yet, not in a state to integrate. EOD asks for retrospective distillation; a user still riding excited/focused state isn't done with the day yet.

**Wind-down beat:** no chips. Wind-down bypasses Notice entirely and uses its own minimal flow (tomorrow-anchor → Deep Regulate → close). The work is forward-anchor, not state-naming.

These subsets are configured in `beatConfig.js` (`selectChips()` helper) and rendered conditionally by `Notice.jsx` per the variant config. If chip definitions are ever revised, this section MUST be updated to reflect any new chip's per-beat inclusion before the change ships.

---

## v2 ⓘ wiring — pending Phase 4 action

The 10 definitions above need to be wired as ⓘ glyphs on the chip row in Stillform's v2 spine (`src/v2/`). v1 wired this via `CHIP_DEFINITIONS` constant in App.jsx with 3 render sites (showPostRating, PresentStateChips, Body Scan What Shifted); that wiring was deleted with v1 in Phase A.

**What v2 needs:**

1. **Registry constant** — `CHIP_DEFINITIONS` exported from a shared v2 module (likely `src/v2/lib/chipDefinitions.js` or inlined in `beatConfig.js` since both consume from the same 10-chip canon). Single source of truth in code.
2. **ⓘ glyph on chip row** — small tappable ⓘ next to each chip in `src/v2/notice/Notice.jsx`. Same visual treatment as bio-filter ⓘ and Lock-in ⓘ in the v1 build (carried into v2 design system).
3. **infoModal wiring** — tapping ⓘ opens the existing modal pattern with the chip's definition string.
4. **Beat-aware** — per beat-subset rules in §"Phase 4 — per-beat chip subsets" below, only the chips the beat surfaces get rendered, but each rendered chip gets its ⓘ.

**Rule:** if any chip definition is revised here, the registry must be updated and the change ships together — the doc and the code stay in lock-step (per CANON Section 10 "Spec → master todo entry, same session").

If a chip definition needs to lean harder in any direction (more body-focused, more contrast with adjacent chips, more on what the system does when it's selected), revise in this file and update the registry in the same commit.

---

## PATTERN-WORK CHIP DEFINITIONS (Bias Profile — spec stage)

> **Second chip family.** These are the **pattern-work watch-list chips** for the Bias Profile (Phase 5 sub-item #4, not yet built). Unlike feel chips — which the user *selects* to set a state at check-in — pattern-work chips are patterns the user *adds to a watch list*, and the AI flags them during Reframe. Full anatomy for each chip (clinical spine, mapping, in-session phrasing) lives in `STILLFORM_DISTORTION_VOCABULARY.md` (the 15 distortions) and `STILLFORM_WORKSHOP_MCQ30_SPEC.md` (the 5 metacognitive-belief chips). This section holds the user-facing ⓘ copy.
>
> **Voice for these** (same anchor as the feel chips, plus two pattern-work specifics): **name the motion, not the person** — loop-voice, a process the system runs, never a label the user *is*; **no clinical jargon in the ⓘ** — the recognizable clinical name is taught in the Workshop, not pinned on the chip (per the two-register rule in the vocabulary doc); the ⓘ answers "what is this pattern, and what does watch-listing it do"; **never a problem without a path forward.** ~40–60 words each.

### Distortion chips (15 — CD-Quest, pattern-work strand)

### The two-setting dial
**The two-setting dial.** Your read snaps to one of two extremes — total win or total wreck, all good or all ruined — with nothing in between. The dial only has two settings, but most of what's true lives in the middle. On your watch list, Stillform catches the snap when your thinking goes binary and helps you find the gradient again.

### Rehearsing the worst
**Rehearsing the worst.** Your mind runs the worst version of what's coming and treats the rehearsal like a forecast. The fear is real; the certainty isn't. Watch-listed, Stillform catches the rehearsal when it starts and helps you set the worst case next to the likely one — so the rehearsal stops standing in for fact.

### The good doesn't count
**The good doesn't count.** Wins land and slide right off — explained away, shrunk, filed as luck — while the misses stick. The ledger stays lopsided on its own. With this tracked, Stillform notices the sliding and slows it down, so what actually went right gets to count for what it is.

### The feeling as the fact
**The feeling as the fact.** A feeling gets read as proof — "I feel like a failure, so I must be one." The feeling is real and worth hearing; it isn't evidence about the world. On your watch list, Stillform helps you keep the two apart: the feeling is data about you, not a verdict on what's true.

### The thought wearing your name
**The thought wearing your name.** A passing judgment hardens into an identity — "I messed up" becomes "I'm a mess." The thought puts on your name and walks around as fact. Watch-listed, Stillform catches the moment the verb becomes a noun and reminds you: that's a thought your system made, not the shape of you.

### The stuck zoom
**The stuck zoom.** The lens jams — one thing blown up huge while everything else shrinks to nothing. Scale goes out of true. With this tracked, Stillform notices when the zoom is stuck and helps you pull back to actual size, so one detail stops swallowing the whole frame.

### The one dark thread
**The one dark thread.** Out of a whole mixed picture, your attention pulls the single darkest thread and calls it the cloth. The rest is still there — it just went quiet. On your watch list, Stillform flags the narrowing and widens the frame back to everything that was actually in it.

### Filling in the why
**Filling in the why.** Someone goes quiet, doesn't reply, gives a look — and your system fills in the why with no data, usually the worst one. The not-knowing is the loud part. Watch-listed, Stillform catches the gap between what you saw and what you assumed, and leaves the why open until there's something real to fill it with.

### One time becomes always
**One time becomes always.** A single instance turns into a rule — "this happened" becomes "this always happens." The leap from once to always is the move to watch. With this tracked, Stillform flags the jump and brings it back to the one actual data point, before it sets as a law.

### Making yourself the cause
**Making yourself the cause.** When something goes wrong, your system routes the cause straight back to you — even when the line doesn't actually run there. On your watch list, Stillform notices the routing and helps you check whether you're really the cause, or just the nearest place to set it down.

### The rulebook
**The rulebook.** A rulebook runs underneath — should, must, have-to, ought — and falling short of it lands as failing. The standards aren't the problem; the rigidity is. Watch-listed, Stillform flags the rulebook when it's running and asks the useful question: who wrote it, and does it still serve you?

### Verdict before evidence
**Verdict before evidence.** The conclusion lands before the evidence is in — reached at speed, then defended. The quickness is the tell. With this tracked, Stillform catches the jump and holds the gap open a beat longer, so the read has a chance to meet the facts before it locks.

### Sorting who pays
**Sorting who pays.** When something hurts, your system sorts who's at fault — pinning it outward or inward, fast. It's a protective move, and it can run ahead of the facts. Watch-listed, Stillform notices the sorting, especially before a high-stakes call, and lets it settle before the blame — or the plan — locks in.

### The what-if ladder
**The what-if ladder.** One what-if builds the next, each rung lower than the last, and the ladder only goes down. The questions feel like problem-solving but they're manufacturing dread. On your watch list, Stillform catches the climb early and helps you step off, back to the one thing actually in front of you.

### Running comparisons
**Running comparisons.** Your system benchmarks you against someone else and reads the result as data about your worth. Comparison is a process the mind runs — not a measurement of you. Watch-listed, Stillform flags it when it starts and brings the focus back to your own line, where the useful information actually is.

### Metacognitive-belief chips (5 — MCQ-30, pattern-work strand)

### Worry-as-engine
**Worry-as-engine.** A quiet belief that worrying is what keeps you sharp — that if you stopped turning it over, you'd drop the ball. So the worry feels productive, even necessary. Watch-listed, Stillform helps you test whether the worry is actually doing the work, or just running the engine hot while you do the work anyway.

### Mind-as-mercy
**Mind-as-mercy.** The sense that your thoughts run you, not the other way — that once a spiral starts it can't be stopped, and that's dangerous. The belief itself stacks fear on top of the thought. On your watch list, Stillform helps you see the thought as something passing through, not something with its hand on the wheel.

### Memory-distrust
**Memory-distrust.** A standing doubt in your own mind — did I really do that, did I get it right, can I trust what I remember. The distrust drives the re-checking, not any actual failure. Tracked, Stillform notices when the doubt is running and helps you tell a real gap from the habit of second-guessing.

### Mind-as-discipline
**Mind-as-discipline.** The belief that you should be able to control which thoughts show up — and that the wrong ones mean something's wrong with you. So you fight the thought, which keeps it loud. Watch-listed, Stillform helps you let a thought be there without it being a command or a verdict: control the response, not the arrival.

### Inward-attention quality
**Inward-attention quality.** You watch your own thinking closely — which is the whole practice here, when it opens something up. The same attention can tip into looping, where watching becomes circling with no exit. On your watch list, Stillform helps you tell the two apart: the attention that moves you forward, versus the kind that just keeps the wheel spinning.

**Wiring (pending Bias Profile build):** same pattern as the feel-chip ⓘ — when the Bias Profile watch-list surface is built, these definitions wire as ⓘ glyphs on each chip, reading from a shared registry. Doc and registry stay in lock-step (per the rule in the feel-chip wiring section above). Until then this is spec-stage copy; no live surface consumes it yet.

---

*ARA Embers LLC · Chip Definitions · Locked Apr 30, 2026 · last updated May 20, 2026 (pattern-work chip ⓘ definitions added — 15 distortion + 5 metacognitive-belief, Bias Profile spec stage; in Stillform voice, sourced from the distortion vocabulary doc + MCQ-30 spec)*
