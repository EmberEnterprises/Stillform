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

## What's coming next (after copy approval)

If you approve the copy:

1. **Registry constant in App.jsx** — `const CHIP_DEFINITIONS = { excited: {...}, focused: {...}, ... }` near the existing `TOOL_DEBRIEF_COPY` declaration. Single source of truth.
2. **ⓘ button next to each chip** — small ⓘ glyph in the chip row, tappable, opens existing `setInfoModal` with the chip's definition. Same pattern as bio-filter ⓘ, Lock-in ⓘ, etc.
3. **Wired across all chip render sites** — three locations: `feelChips` in showPostRating block (~line 6512), `feelChips` in PresentStateChips component (~line 8140), `feelChips` in Body Scan What Shifted screen (~line 4224 of staged file). Single registry, three wirings.
4. **No copy duplication** — the AI prompt feelMap in reframe.js stays the operational voice for AI behavior; the registry is the user-facing voice. Both reference the same state, in different audiences' languages.
5. **v2 spine ⓘ wiring** — the v2 `Notice.jsx` chip row should also surface the ⓘ definitions. Same registry, fourth wiring point.

If you want changes to any of the 10 definitions, mark them up and I'll redraft. If a chip definition needs to lean harder in any direction (more body-focused, more contrast with adjacent chips, more on what the system does when it's selected), tell me which way.

---

*ARA Embers LLC · Chip Definitions Draft · April 30, 2026 · last updated May 16, 2026 (Unsure added + Phase 4 beat-subset reconciliation)*
