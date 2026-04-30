# CHIP_DEFINITIONS_DRAFT.md
**Stillform — Feel chip ⓘ definitions**
**ARA Embers LLC · April 30, 2026**

---

## What this is

User-facing definitions for each of the 9 feel chips. These appear when a user taps the ⓘ button next to a chip. **For Arlin's review before code wiring** — the registry isn't shipped to App.jsx until copy is approved.

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

## What's coming next (after copy approval)

If you approve the copy:

1. **Registry constant in App.jsx** — `const CHIP_DEFINITIONS = { excited: {...}, focused: {...}, ... }` near the existing `TOOL_DEBRIEF_COPY` declaration. Single source of truth.
2. **ⓘ button next to each chip** — small ⓘ glyph in the chip row, tappable, opens existing `setInfoModal` with the chip's definition. Same pattern as bio-filter ⓘ, Lock-in ⓘ, etc.
3. **Wired across all chip render sites** — three locations: `feelChips` in showPostRating block (~line 6512), `feelChips` in PresentStateChips component (~line 8140), `feelChips` in Body Scan What Shifted screen (~line 4224 of staged file). Single registry, three wirings.
4. **No copy duplication** — the AI prompt feelMap in reframe.js stays the operational voice for AI behavior; the registry is the user-facing voice. Both reference the same state, in different audiences' languages.

If you want changes to any of the 9 definitions, mark them up and I'll redraft. If a chip definition needs to lean harder in any direction (more body-focused, more contrast with adjacent chips, more on what the system does when it's selected), tell me which way.

---

*ARA Embers LLC · Chip Definitions Draft · April 30, 2026*
