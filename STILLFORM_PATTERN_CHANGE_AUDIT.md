# STILLFORM — Pattern-Change Engine Audit

**Locked May 28, 2026 (Arlin: "this is the entire app — do it with full integrity").**
The audit that determines whether Stillform actually moves a person from *noticing* a
pattern to *changing* it — not just managing it. This is the core mechanism, not a
feature. Capture exists so the work is tracked in the repo, not in a code comment.

Source of the question (Arlin, lived): *"I already understand my pattern. CBT helps me
not blame myself and see another perspective — but the pattern is still there.
Understanding it doesn't end it."* That gap is the thing this engine has to close.

---

## The mechanism

```
RECOGNIZE  →  REFRAME  →  IMPLEMENTATION INTENTION  →  RECONSOLIDATION  →  (reps over time)
(notice the   (form a      (pre-decide the new          (the recurring        (the default
 pattern,      truer        response: "next time X,      trigger's memory       slowly re-grooves;
 in the        frame)       I do Y" — Gollwitzer)        updates, not just      Stillform is the
 moment)                                                 rehearses)             thing present each rep)
```

Insight sits at the front of this chain. The chain is why insight alone doesn't change
anything: understanding produces RECOGNIZE and part of REFRAME, and then stops. The
change lives in the back half — committing a new response and updating the memory
through repetition. CBT hands you the map (and removes self-blame, real and not nothing);
it does not stand next to you at the fork when the pattern fires, and it doesn't update
the memory. That back half is Stillform's lane.

## The science — COVERED (no gaps)

All grounded and cited in `Stillform_Science_Sheet.md`. The pillars that ground the
"insight → change" arc specifically:

- **Metacognition** — Flavell (1979); Schraw & Moshman (1995); Wells (2009) MCT. The
  noticing. Built as Reframe.
- **Implementation intentions** — Gollwitzer (1999). Pre-deciding "next time X, I do Y"
  closes the intention–behavior gap so the new response fires under load. → the deferred
  *next move* sub-beat.
- **Memory reconsolidation** — Ecker, Ticic & Hulley (2012); Schiller et al. (2010,
  *Nature*); Lane et al. (2015). A memory recalled in an activated state and paired with a
  new frame is rewritten, not just overlaid. This is the science of *changing* a pattern
  vs. *managing* it — and it requires the prior frame to be reactivated. → the
  reconsolidation loop.
- **Neuroplasticity + habit (context-cue)** — Davidson; Lazar (2005); Calderone (2024);
  Wood & Rünger (2016). Reps compound; the recurring *context* (the trigger) is the cue.
- **EMI — Ecological Momentary Intervention** — Myin-Germeys (2016/2018). Intervention in
  the real moment, not the clinic. The Science Sheet states Stillform *IS* EMI. This is
  the literal research name for "the therapist isn't in your pocket; Stillform is."

Determination: the science backing is complete. Nothing to add on the science side.

## Built vs. gap — verified against v2 code (May 28)

**BUILT — the *recognition* half is real:**
- Cross-session pattern recognition: AI pattern-detection (`noteAiPatternDetection` /
  `patternConfidence`, biasProfile.js — Phase 5.11d) + Trigger Profile recurrence
  (`incrementTriggerEncounter`, triggerProfile.js).
- The metacognitive Reframe conversation that forms a truer frame (Reframe.jsx + reframe.js).
- Prior sessions fed to the AI (`formatRecentSessionsForAI` → `priorSessions`,
  reframeApi.js:97/123, wired this session). The reconsolidation *input* is present.
- Closing takeaway (Close.jsx names what landed).

**CORRECTION 2026-07-08 (verified against live code, not this doc):** PCE.1 is BUILT — Close.jsx carries the nextMove + lock-in beats (lines ~74-430), sessions.js persists takeaway/nextMove/lockIn, Spine saves them, and formatRecentSessionsForAI already feeds prior lock-ins to the AI (PCE.2's AI half). The genuinely missing piece was ONLY the user-visible reactivation — built today as priorFrame.js + the ForecastCard prior-frame line ("Last time this came up, you landed on: ..."). The section below is preserved as the original audit state:

**NOT BUILT — the *conversion* half (insight → enacted change) [STALE as of 2026-07-08, see correction above]:**
1. **Structured Reframe close — `next move` + `lock in`.** Verified deferred: Reframe.jsx
   lines 24–27 — *"The Reframe Step 2 sub-beats (pick where you are now → name what
   shifted → pick a next move → lock in) are deferred to a later phase."* Tracked nowhere
   but that comment until now. This is the Gollwitzer bridge; without it a session ends at
   understanding + a backward takeaway, never a committed forward rep.
2. **The reconsolidation loop.** The prior frame is fed to the AI quietly, but there is no
   designed reactivate-and-update loop and no user-visible *"last time this came up you
   landed on X"* surfacing. Reconsolidation only fires if the prior frame is reactivated;
   right now that's left to chance in the AI's context. Highest-leverage missing piece for
   the "it's still there" problem.
3. **In-the-moment recognition (concierge).** Already known — Phase 5 AI-mediation +
   Phase 9 surfacing. Out of scope here.

## Build decomposition — sequential, runs BEFORE Phase 6.2

**PCE.1 — Structured Reframe close (completes the deferred Step 2 sub-beats).**
After the conversation, the close becomes one-element-per-beat (canon §271), tap to
advance: pick where you are now → name what shifted → **pick a next move** (implementation
intention: the pre-decided "next time X, I do Y") → **lock in** (a plain forward
commitment, not a score). Persist `nextMove` + `lockIn` (+ `whatShifted`) into the session
record (sessions.js) so they become continuity data AND the "frame you landed on" that
PCE.2 reactivates. Science: Gollwitzer; Lieberman (affect labeling); Bandura (mastery);
Roediger & Karpicke (active recall).

**PCE.2 — Reconsolidation loop.** When the current trigger/pattern matches a prior one
(Trigger Profile recurrence + AI pattern detection + priorSessions), surface the real
prior frame — *"Last time this came up, you landed on: [prior lock-in]"* — at the right
moment, and signal reframe.js to deliberately reactivate it and pair it with an updated
frame rather than starting cold. Science: Ecker/Schiller/Lane reconsolidation. Depends on
PCE.1 (the lock-in/next-move IS the frame it resurfaces) — hence the order.

(Then resume **Phase 6.2** — Support Sheet + Move card via the Notice fork.)

## Integrity guards (non-negotiable on this engine)

- **Zero fabrication.** PCE.2 surfaces only REAL prior frames; the AI never invents a
  "last time." Inherits the standing ZERO FABRICATION law (FRAMING_LAW).
- **Not gamified.** Reps are felt change, never a counter. `lock in` is a reflective
  forward statement, not points/streaks (dopamine-concern lock).
- **Reflect, don't score** (CANON §10 mirror-integrity). The loop reflects what the user
  already landed on; it does not grade progress.
- **Framing law.** Self-mastery / metacognition expansion — the next move is agency ("a
  move you can do alone"), not compliance or "regulation."
- **Not therapy.** This is the in-the-moment practice + reps. Origin work (the template
  underneath a pattern) stays with a person over time; Stillform is the complement that's
  present each rep, between sessions. Never positioned as treatment.

## The degradation layer (added May 28 — Arlin)

A distinct concern from shifting the pattern: protecting the user's *analysis itself* from
degrading — the tired over-analysis that tips from productive metacognition into
rumination, and specifically the signature where analysis curdles from the situation onto
a **self-verdict** ("I've always lived in someone's shadow"). Recognizing a pattern is
worthless if the recognizing IS the loop.

**Largely already built, distributed (verified vs reframe.js + Science Sheet):**
- *Detection:* loop-language match (reframe.js `loopPattern` ~L595) + CLARITY-mode AI
  rumination recognition ("you are running this through again — what is the running
  doing?" ~L1119).
- *Interruption (CAS / DMN):* breathing routes, somatic interrupt, Quick Breathe pill,
  acupressure — all framed as Cognitive Attentional Syndrome interruption; DMN suppression
  ("you can't ruminate and count 4-4-8-2"). Science Sheet §242 / §423.
- *Structural bound:* every session closes at a takeaway — Hitchcock et al. 2024
  meta-control: open-ended introspection IS the rumination failure mode; bounded analysis
  is the correction (reframe.js ~L948 / L1090).
- *AI behavior:* instructed not to feed the loop, not to reach conclusions while spiraling
  (~L1147–1150).
- Science fully cited: Wells MCT / detached mindfulness, Hitchcock 2024 meta-control,
  Brewer 2011 DMN, CAS interruption.

**The gap — complete it, don't build from scratch:**
1. It isn't a *named, deliberate* layer — it's distributed and implicit. Make it one so it
   reliably fires.
2. The specific degradation Arlin lived isn't caught as its own signal: analysis tipping
   into a self-verdict ("I've always…") and tired over-analysis past usefulness (not the
   classic "can't stop" spiral language). The AI should catch the analysis→self-sentence
   tip, name it as the tired loop's output — never validate the verdict (framing law) —
   and redirect out of analysis (to body / to close). Cross-session fatigue detection
   (depletion, time-of-day, repeated re-opens) is concierge territory (Phase 5/9).

→ tracked as PCE.3.

## Process (per the v1-scar rule)

Each step: lock scope in repo → commit doc → build → verify (node --check / build green) →
commit code → mark done → push → confirm local == origin. Nothing deployed by Claude;
Arlin deploys + device-tests.
