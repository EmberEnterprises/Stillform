# LOW-DEMAND MODE PHASE 3 — REFRAME SPEC

**Status:** Spec draft for review. Awaiting Arlin's call before code wiring.

**Date:** April 30, 2026

**Context:** Phase 1 (Breathe) shipped Apr 30 (commit `81e2c0b7`). Phase 2 (Body Scan) spec drafted Apr 30 (`d4c2ed8b`), awaiting approval. **Phase 3 (Reframe) is the most complex of the three** because the AI's behavior changes too, not just the UI. This spec scopes both surfaces.

---

## Why this is the most complex phase

Breathe (Phase 1) and Body Scan (Phase 2) are somatic tools. Their work is non-verbal — paced breathing, focused interoceptive attention, timed holds. The science doesn't care whether the user is medicated; the body responds to paced respiration and applied pressure regardless. Stripping cognitive gates around a somatic tool is straightforward.

Reframe is verbal. The AI generates language, the user reads and responds, and the back-and-forth IS the work. **A medicated user cannot do Reframe at full cognitive load.** The complex sentence structure, the open-ended questions ("what does that bring up for you?"), the multi-part reframings — these all require executive function the cohort doesn't have available.

So Phase 3 has two surfaces to address:
1. **The AI behavior** must change — shorter sentences, simpler language, fewer questions demanding cognitive work, no multi-part reframings.
2. **The UI** must change — same stripping pattern as Phase 1 and 2 (no chip selection, no State-to-Statement option, simplified close).

---

## The AI behavior changes

**The honest framing:** in low-demand mode, Reframe is doing less of what makes Reframe powerful in normal mode — and that's correct. A medicated user doesn't need the AI to surface deep cognitive patterns; they need the AI to be present, regulating, and brief. Holding rather than working.

### Simpler language

**Current AI voice (CALM_SYSTEM example):** *"It sounds like you're sitting with something heavy. The way you described that meeting — the part about your hands shaking — that's worth naming. What were you needing in that moment that you didn't get?"*

**Low-demand voice:** *"That sounds heavy. Your hands were shaking. You can rest with that."*

The shift: shorter sentences, simpler vocabulary, fewer abstract concepts, no questions requiring the user to introspect. The AI is companion-presence, not cognitive coach.

### Fewer (or no) questions

Reframe's normal mode asks questions that prompt the user to reach further into their own thinking. In low-demand, those questions are tax. The AI should default to **statements that hold what the user said**, not questions that ask them to do more.

When the AI does ask a question (rare), it should be:
- Closed (yes/no) not open
- Concrete not abstract
- Short

Wrong (low-demand): *"What do you think this connects to from earlier in your week?"*  
Right (low-demand): *"Are you safe right now?"*

### No multi-part reframings

Normal mode might reframe a thought across three angles: *"That's one read. Another is X. A third is Y."* For a medicated user, three reads are three things to hold. Low-demand: one reframe at a time, if any.

### Shorter responses overall

Normal mode AI responses run 2-4 sentences typical, sometimes longer. Low-demand: 1-2 sentences typical. Strict ceiling at 3 sentences.

### Same safety / liability behaviors

The HARD RULES, SAFETY OVERRIDE (suicide language detection), LIABILITY GUARD, and CALENDAR HARD RULE all stay active in low-demand. **These are non-negotiable across all modes.** A medicated user is statistically more vulnerable to crisis; if anything, the safety behaviors must be more reliable in low-demand, not less.

---

## Implementation: AI side (`netlify/functions/reframe.js`)

### New low-demand system prompt block

Add a block that gets prepended to the system prompt when low-demand mode is active. Pattern is the same as the existing SAFETY OVERRIDE / LIABILITY GUARD / CALENDAR HARD RULE blocks — high-priority instructions that override the default voice for this specific session.

**Sketch:**
```javascript
if (bioFilter && bioFilter.includes("medicated")) {
  systemPrompt = `LOW-DEMAND OVERRIDE — THIS USER IS COGNITIVELY COMPROMISED:
The user has self-reported being medicated (SSRIs, post-anesthesia, sleep aids, chemo, recreational substance, or similar). Their executive function is reduced. You must adapt:

1. Shorter sentences. 1-2 sentences per response typical. Hard ceiling of 3 sentences.
2. Simpler vocabulary. No abstract concepts. No multi-part reframings.
3. Fewer questions. When you ask, ask closed (yes/no) and concrete. Default to statements that hold what they said, not questions that ask them to do more.
4. Companion presence, not cognitive coach. Your job is to be there, regulate alongside them, and not increase their load.
5. Safety rules above are NOT relaxed. If anything, more vigilant — medicated users are statistically more vulnerable. If you detect crisis language, follow the SAFETY OVERRIDE protocol fully.

Do NOT mention to the user that you've shifted into a different mode. They should just feel met where they are.

` + systemPrompt;
}
```

Position: prepend AFTER safety/liability blocks (which are first), so the medicated context informs how those overrides land but doesn't override their priority.

**Risk:** the AI might still produce too-long responses if the rest of the system prompt has examples that don't match this constraint. Mitigation: also add this constraint to the QUALITY_RETRY_PROMPT validation — if a low-demand response runs >3 sentences, it gets retried.

### Validation update

The existing post-processing filter (banned phrases, specificity test) needs a new check for low-demand: response length. Add a `responseLengthOk` check: if `bioFilter.includes("medicated")` and response sentence count > 3, flag for retry.

---

## Implementation: UI side (`src/App.jsx`, ReframeTool component)

### Strip chip selection at entry

Normal flow: Reframe entry includes feel-chip selection (PresentStateChips). The chip drives mode routing (anxious/angry → calm; stuck → clarity; excited/focused → hype) and AI prompt context.

**Low-demand:** skip chip selection. Use the user's current persisted feel state (from morning check-in or previous session) if available; otherwise default to calm mode. The chip selection IS a cognitive task — picking among 9 options requires the executive function this cohort doesn't have.

**Implementation:** in ReframeTool, conditional on `isLowDemand`:
- Skip the chip selection screen
- Initialize `feelState` from persisted state OR default to undefined
- Initialize `mode` to "calm" (the safest default for cognitively compromised users)

### Strip State-to-Statement option

Normal flow: after Reframe completion, optionally the user can convert the internal shift to a sendable message draft (State-to-Statement). This requires real cognitive work — drafting language to send to another person.

**Low-demand:** skip State-to-Statement entirely. Direct path to completion. State-to-Statement is for users with cognitive capacity to do social work; medicated users don't need this option in this session.

### Simplified close

Same pattern as Phase 1 and 2: skip ToolDebriefGate, skip Next Move, direct call to LowDemandComplete component (which should be extracted into shared component during Phase 2 build per Phase 2 spec).

### Conversation UI itself

The conversation interface stays largely the same — text input, send button, message history. The user's ability to type may be reduced in low-demand, but the interface doesn't need to change for that. The constraint is on the AI's responses, not on the input mechanism.

**One small consideration:** the input placeholder copy currently might be elaborate (e.g., "Tell me what's on your mind..."). For low-demand, simpler is better: "Type when you're ready." or just empty placeholder. Worth a small copy pass.

---

## What stays the same in low-demand Reframe

- Conversation persistence within session
- Safety overrides (suicide detection, liability guard, calendar context)
- AI memory of session context
- Plausible event firing (with `lowDemand: true` prop added)
- Session save with `source: "low-demand-reframe-complete"`

The AI infrastructure stays the same. Only the AI's voice within that infrastructure changes.

---

## Implementation surface

**`netlify/functions/reframe.js`:** ~30-50 lines
- Add LOW-DEMAND OVERRIDE prompt block
- Update validation to include response length check for medicated users

**`src/App.jsx` (ReframeTool):** ~80-120 lines
- `isLowDemand` derived state at top of ReframeTool
- Skip chip selection conditional
- Skip State-to-Statement conditional
- Use shared LowDemandComplete component (from Phase 2 build)
- Input placeholder copy adjustment

**Total:** ~110-170 lines across two files. Larger than Phase 1 or 2 because of the AI side.

**Risk profile:** medium. The AI behavior change is non-trivial to get right — too aggressive a restriction and the AI feels cold; too permissive and we haven't actually changed anything. **Worth testing extensively** before shipping.

---

## Testing protocol before ship

This phase needs more rigorous testing than Phase 1 or 2 because the AI behavior change is qualitative.

**Test 1: send 10 representative user messages with `bioFilter: "medicated"` to the API.** Verify all responses are:
- ≤3 sentences
- Free of abstract concepts and multi-part reframings
- Predominantly statements not questions

**Test 2: send the same 10 messages with `bioFilter: "clear"` (normal mode).** Verify normal voice is preserved — the override only fires when explicitly triggered.

**Test 3: send 5 messages containing crisis language with `bioFilter: "medicated"`.** Verify SAFETY OVERRIDE still fires fully — full resource block, ask the question, stay present. No softening of safety behavior.

**Test 4: end-to-end session in low-demand from phone.** Arlin or trusted tester runs through the full flow on actual phone with `bioFilter: "medicated"` set. Note what feels right and what feels off. Adjust copy.

---

## Open questions for Arlin

1. **The override prompt language.** Drafted above; Arlin's voice review needed. The instruction to the AI is high-stakes copy because it shapes how the model behaves with the most vulnerable cohort. Want her read on tone.

2. **State-to-Statement skip — strictly or with optional override?** I lean strictly skip (the cohort can't do this work; offering it is asking them to do work they shouldn't be doing). But Arlin might prefer "skip default, show small link to enable if user really wants it." Both defensible.

3. **Default mode (calm) when no chip selected.** I assumed this; want to confirm. Alternative: detect from message content (the AI prompt routing already does this in normal mode for some cases). Probably more reliable to just default to calm and let the prompt adapt.

4. **Shared LowDemandComplete component — build during Phase 2 or Phase 3?** Phase 2 spec recommends bundling in Phase 2 build. If Phase 2 doesn't extract it, Phase 3 will. Either way the work happens once.

5. **Testing rigor — how much before ship?** I've drafted a 4-test protocol. Adequate? Or want more before shipping to real users?

---

## Ship checklist

1. **UAT dropdown** — yes, low-demand state detectable; UAT entry needed.
2. **Tutorial** — minimal.
3. **FAQ** — yes, "What happens in low-demand mode?" entry now covers all three tools.
4. **Transfer doc** — yes.
5. **Plausible event** — Reframe events need `lowDemand: true` prop.
6. **Privacy policy** — no.
7. **Science sheet** — yes, low-demand mode section now covers full coverage; mention briefly.
8. **AI prompts** — YES, this IS an AI prompt change. Document carefully.
9. **Promo** — Phase 1+2+3 ship together = "Stillform redesigns the practice for users on medication, including how the AI talks." Real differentiator. Worth a founder voice mention.
10. **Punch list** — yes.
11. **Emotion coverage** — no chip changes.

---

## What this is NOT

- Not a redesign of normal-mode Reframe. Normal voice stays exactly as it is.
- Not the body-first pre-rate fix.
- Not the AI's general voice quality (separate concern).
- Not Cognitive Function Measurement.

**This is the AI learning to be more present and less coaching for one specific cohort in one specific tool.** The AI side is harder than UI changes, but the principle is the same as Phases 1 and 2: respect what the user can and can't do right now, and don't ask them to do work that's beyond their available capacity.

---

## After Phase 3 ships

Low-demand mode is complete across all three primary tools. Self Mode (the 5-step metacognitive practice) might warrant Phase 4 in the future, but Self Mode is the most cognitively demanding tool by design — it might be appropriate that medicated users not be routed there. Worth a separate decision when Phase 3 lands.

---

*ARA Embers LLC · Low-Demand Mode Phase 3 Spec · April 30, 2026*
