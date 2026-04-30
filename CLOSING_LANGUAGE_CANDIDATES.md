# CLOSING LANGUAGE CANDIDATES — Round 2 Tier 1 Fix

**Status:** Draft for review. NOT YET WIRED to code. Same pattern as CHIP_DEFINITIONS_DRAFT — copy gets approved before App.jsx changes.

**Why this draft exists:** Round 2 consultation (Apr 30) — all four AIs converged that current closing language frames sessions as outcome-achieved instead of rehearsal-completed. Examples: "Composure restored," "Signal cleared," "System calibrated." These read as the system's verdict on whether the session "worked," not as the user marking that they practiced staying themselves.

**The integrity test:** does the close screen mark the *act* (rehearsal completed) or the *result* (state reached)? Currently it marks the result. The fix is to mark the act first, with the result as supporting data.

**This is surface fix, not architectural shift.** Arlin pushed back on round 2 feedback for being surface-level and is right to. This work ships not because it's the spark — but because it's defensible work that closes a real (if surface) integrity gap between claim and action. It's worth shipping while round 3 architectural consultation runs in parallel.

---

## Voice constraints

The replacement copy needs to:

1. **Mark the act, not the result.** "You stayed yourself through this" beats "Composure restored."
2. **Avoid clinical / system verdict language.** Round 2 Claude caught: "Concerning" reads as diagnosis, "Regulated" reads as the system grading you.
3. **Stay in Stillform's existing voice.** No cheerleading, no toxic positivity, no "you got this," no "amazing job." Honest, direct, level.
4. **Acknowledge the practice, not narrate it.** "You practiced X" is better than "You used X to feel better."
5. **Respect sessions where the state didn't shift.** A user who is still anxious after 10 minutes of practice should not feel they failed. ACT/Kabat-Zinn: sustained acceptance under unresolved state is also the practice.
6. **Be brief.** These are completion screens, not lectures.

---

## The seven closing screens that need rework

### 1. Breathe + Ground complete (line 3476)

**Current:**
> ## Composure restored.
> *System calibrated · 4:32*
> [Signal Shift display]
> [STATE SHIFT +2 · FUNCTIONAL]
> [Continue to Reframe →]
> [Exit session]

**Issue:** "Composure restored" is the system's verdict. "STATE SHIFT +2 · FUNCTIONAL" is clinical telemetry. The user did the work and is being read back to themselves like a chart.

**Candidate A — minimal (smallest change, lowest risk):**
> ## You stayed with it.
> *Practice complete · 4:32*
> [Signal Shift display unchanged]
> [STATE SHIFT +2 unchanged but reframed: "You moved from 3 to 5"]
> [Continue to Reframe →]
> [Exit session]

**Candidate B — rehearsal-frame (medium change, higher honesty):**
> ## That was practice.
> *Rehearsal logged · 4:32*
> [Signal Shift display unchanged]
> [If shift > 0: "You moved from 3 to 5. The state you reach is the state you build."]
> [If shift = 0: "State held steady. The practice is the holding."]
> [Continue to Reframe →]
> [Exit session]

**Candidate C — quieter (lowest words, highest gravity):**
> ## Stayed.
> *4:32*
> [Signal Shift display unchanged]
> [Continue to Reframe →]
> [Exit session]

**My read:** Candidate B closes the most integrity gap with one screen. It explicitly handles both shift>0 and shift=0 cases (the AIs all flagged that current language fails Persistent-state sessions). C is most aesthetically aligned with prestige refresh but may feel too sparse. A is safest.

---

### 2. Body Scan complete (line 4504)

**Current:**
> ## Signal cleared.
> *System calibrated · 5:18*
> [Signal Shift display: "Pressure released"]
> NAMING THE SHIFT…

**Issue:** "Signal cleared" is system verdict. "NAMING THE SHIFT…" already reframes toward the act (good — this was a recent Apr 30 fix). The H2 is the holdout.

**Candidate A — minimal:**
> ## You held the points.
> *Practice complete · 5:18*
> [Signal Shift display unchanged]
> NAMING THE SHIFT…

**Candidate B — rehearsal-frame:**
> ## That was practice.
> *Body work logged · 5:18*
> [Signal Shift display unchanged]
> NAMING THE SHIFT…

**Candidate C — quieter:**
> ## Six points held.
> *5:18*
> [Signal Shift display unchanged]
> NAMING THE SHIFT…

**My read:** C is honest and lets the body work speak for itself. B mirrors Breathe's B for consistency. A is fine but slightly stiff.

---

### 3. Breathe — three-rounds-done (line 3829)

**Current:**
> ## Three rounds done.
> Nervous system recalibrating. Continue or move on.
> [Ground now →]
> [Keep going]
> [Stop here]

**Issue:** "Nervous system recalibrating" is clinical. "Continue or move on" frames the choice as a transaction.

**Candidate A — minimal:**
> ## Three rounds.
> Practice landed. What's next?
> [Ground now →]
> [Keep going]
> [Stop here]

**Candidate B — rehearsal-frame:**
> ## You worked the breath.
> What's the next move?
> [Ground now →]
> [Keep going]
> [Stop here]

**My read:** B is slightly too narrative for an interstitial decision screen. A is cleaner.

---

### 4. Reframe / Panic-mode "Composure restored" (line 8128)

**Current:**
> Composure restored
> Baseline reset. You're steady. Proceed.
> [Continue to grounding →]

**Issue:** This is the most explicit "system verdict" language anywhere in the product. "Baseline reset" is clinical diagnostic; "You're steady" is the system telling the user how they feel.

**Candidate A — minimal:**
> You stayed yourself.
> The work landed. When you're ready, keep going.
> [Continue to grounding →]

**Candidate B — rehearsal-frame:**
> Practice complete.
> You held through the spike. Carry it forward.
> [Continue to grounding →]

**Candidate C — quieter:**
> You're back.
> The work is done. Move when you're ready.
> [Continue to grounding →]

**My read:** This is panic-mode specifically — a user just came down from acute activation. C respects that they need a soft landing more than a metacognitive frame. A is acceptable. B is too cognitive for this moment.

---

### 5. ToolDebriefGate skipLabel (line 8585, 8593)

**Current:**
> "Continue to Reframe"

**Issue:** Names the next destination, not the act being completed. Subtle but compounding — the user's exit option from a debrief gate is framed as "go to the next thing."

**Candidate:**
> "Done — continue"
> OR: "Continue"
> OR: "Done practicing"

**My read:** Just "Continue" — strips destination, marks completion. Cleanest.

---

### 6. Body Scan FAQ entry (line 15246)

**Current:**
> "The session completes with 'Signal cleared.'"

**Issue:** This is FAQ copy describing the close screen. If the close screen language changes, this needs to change too.

**Candidate (depends on which option above):**
> If candidate A above: "The session completes with 'You held the points.'"
> If candidate B: "The session completes by marking the practice as logged."
> If candidate C: "The session completes with 'Six points held.'"

**My read:** Whatever the close screen ends up saying, the FAQ should reflect it. Boring detail — easy to miss in a copy pass.

---

### 7. STATE SHIFT badge language (line 3476 area)

**Current:**
> STATE SHIFT +2 · FUNCTIONAL

**Issue:** "FUNCTIONAL" is the most clinical word in the whole product. Reads as the system grading whether the user reached an acceptable state.

**Candidate A — minimal:**
> STATE SHIFT +2

(Drop "FUNCTIONAL" entirely. The number speaks for itself.)

**Candidate B — rehearsal-frame:**
> SHIFT +2 · LOGGED

(Replace clinical term with practice-marker term.)

**My read:** A. The word "FUNCTIONAL" is actively undermining the integrity claim. Just remove it.

---

## Recommendation

**Ship one consistent voice across all seven screens.** Don't mix candidate styles — pick one direction (A/B/C) and apply it consistently.

**My pick: Candidate B (rehearsal-frame) for screens 1-3, Candidate C (quieter) for screen 4 (panic mode), specific picks for 5-7 as noted.**

Reasoning: B is the strongest integrity move because it explicitly names "practice" and "rehearsal logged" — which is exactly what round 2 consultation found missing. C is right for panic-mode because the user there needs a soft landing, not a metacognitive frame. Mixing these is fine because the panic-mode close is contextually different (acute regulation, not daily practice).

**One thing to flag honestly:** even with this entire copy pass shipped, the change is surface. The user will read different words at session close, and the words will be more honest than they currently are. But the *flow* of how the user arrives at those words doesn't change. Round 3 architectural consultation is where the real spark might come from. This work is worth shipping anyway because:

1. Current language actively contradicts the brand promise (system verdict vs practice marker)
2. The change is mechanical once approved
3. It closes a real (if surface) integrity gap
4. It doesn't preclude any architectural change that comes later

**What I'm NOT including in this draft:**

- The "Stayed Self" binary metric on My Progress (round 2 Tier 1 #3) — defer until Arlin sees this copy land first
- The "This is not a mood chart" sentence on history view (round 2 CoPilot suggestion) — ditto
- The auto-route from chip + bio-filter (round 2 Tier 1 #2) — separate decision; flow change, not copy change
- Three-category user-facing label rework (round 2 Tier 2 #4) — bundles with My Progress redesign work; defer

If you want any of those bundled with this copy pass instead of staged separately, tell me.

---

## Questions for Arlin before code wiring

1. **Which candidate direction?** A (minimal) / B (rehearsal-frame) / C (quieter) — pick one for screens 1-3.
2. **Confirm panic-mode (#4) gets a different treatment than daily practice closes?** Or should it use the same voice?
3. **STATE SHIFT badge — drop "FUNCTIONAL" entirely (A) or replace it (B)?**
4. **Anything in here you want to push back on?** Mark it up. The copy that ships should sound like Stillform, which means it should sound like you.

---

*ARA Embers LLC · Closing Language Candidates · April 30, 2026*
