# LOW-DEMAND MODE PHASE 2 — BODY SCAN SPEC

**Status:** Spec draft for review. Awaiting Arlin's call before code wiring.

**Date:** April 30, 2026

**Context:** Low-demand mode Phase 1 (Breathe) shipped Apr 30 (commit `81e2c0b7`). Phase 2 (Body Scan) was paused mid-build pending an architectural decision Arlin needs to make. This spec resolves that decision and scopes the Body Scan implementation.

---

## The architectural decision (resolved)

**Original question:** when a medicated user opens Body Scan directly (not routed there from bio-filter), what should happen? Four options were surfaced earlier; user dismissed without selecting.

**Resolution after re-reading the code:** the question was harder than it needed to be. Body Scan's normal flow has fewer cognitive gates than Breathe. There's no pre-rate, no bio-filter screen at entry — just an intro screen → "Begin" button → scan phase. So the question of "block them and route somewhere else" doesn't actually need to be asked. Body Scan IS appropriate for medicated users — focused interoceptive attention with auto-advance is exactly the kind of practice the cohort can do. **The right move is to strip the intro and the post-completion gates, same architectural pattern as Phase 1.**

**State-of-existing-tool, not separate tool.** Same as Phase 1.

---

## What changes in low-demand Body Scan

### Changes at entry

**Current flow:** intro screen ("Body scan. Six areas, head to feet. Notice what's there before you change anything.") → "Begin" button → scan phase.

**Low-demand flow:** skip intro entirely. Phase initializes to `"scan"` not `"intro"`. User sees the scan immediately.

**Reasoning:** the intro screen asks for cognitive engagement (read instructions, decide to begin). For a medicated user, even those small cognitive steps are tax. The amber point + the holding sensation is enough scaffolding.

### Changes during the scan

**Tension dot selection.** Current flow asks the user to tap 1-5 tension level for each area before applying pressure. This is a cognitive task during what should be somatic attention.

**Low-demand:** skip tension selection entirely. Auto-advance from prompt to pressure with no rating. **Important context confirmed May 4, 2026:** in normal mode the tension data IS captured in React state during the scan but is NOT currently persisted to the session record — it lives only in the rendering layer and is garbage collected at unmount. Phase 2 build wires the tension persistence as part of the same commit (it's not a "data we lose" tradeoff — it's a data gap that's being closed in normal mode at the same time as it's being suppressed in low-demand). My Progress will gain post-practice tension data per session for the first time.

**Implementation:** in low-demand, the tension bar component does not render. The "Apply pressure here →" button appears immediately under the prompt + observation copy. User can tap to advance to pressure phase. **Manual tap retained** (not auto-advance — Arlin direction May 4: tapping requires reading the affordance, which is a small cognitive ask worth keeping for some control over pace; auto-advance would remove pace control for medicated users).

**Audio force-enabled.** Same as Phase 1 — paced auditory cueing is mechanism for cognitively-compromised users (Balban 2023, Ochsner & Gross 2005), not preference. Body Scan already has audio infrastructure (the low grounding tone during holds); low-demand turns it on regardless of user setting. **No additional audio added** — the literature supports auditory rhythm tied to motor action (paced sound for breath/movement) but does not support adding ambient hum or transition tones during a body scan. Adding more audio in low-demand contradicts the purpose of low-demand (reducing cognitive demand). Force-enable existing only.

### Changes at completion

**Current flow:** scan completes → 2s pause → What Shifted screen (post-state chip + optional label + Lock-in / Skip) → ToolDebriefGate → Next Move screen → onComplete.

**Low-demand flow:** skip What Shifted entirely. Skip ToolDebriefGate. Skip Next Move. Direct call to `onComplete(undefined)` after a "Tap anywhere to close" minimal completion render.

**The completion render itself:** pulse circle + "Tap anywhere to close" label + 1.5s grace period before tap-to-close becomes active. Same pattern as Phase 1 (the `lowDemandGraceOverRef` mechanism).

**Reasoning:** What Shifted demands chip selection and optional reflection — exactly the kind of metacognition a medicated user can't honestly do. ToolDebriefGate demands typed reflection — same problem. Next Move demands implementation intention — same problem. Stripping all three lets the practice land without subsequent tax.

**Session still saves.** `appendSessionToStorage` runs with `source: "low-demand-body-scan-complete"` for record integrity. Plausible event fires same as normal completion.

---

## Implementation surface

**File:** `src/App.jsx`, `BodyScanTool` component (line 3948).

**New derived state at top:**
```javascript
const isLowDemand = (() => {
  try {
    const bf = getActiveBioFilter();
    return bf.includes("medicated");
  } catch { return false; }
})();
```

**Phase initialization change:**
```javascript
const [phase, setPhase] = useState(isLowDemand ? "scan" : "intro");
```

**Tension bar render conditional:**
Wrap the existing tension bar JSX in `{!isLowDemand && (...)}`.

**Audio force-enable:**
Wherever the audio behavior is gated by user setting, override to enabled when `isLowDemand`.

**Auto-advance timer (optional):**
If we want low-demand to auto-advance from prompt → pressure → next area without requiring taps, add a timer at the prompt phase that triggers `setPhase("pressure")` after N seconds. Worth discussing the right N. Probably 15s for prompt phase, then existing hold timer for pressure phase.

**Completion render:**
Replace the current What Shifted gate with low-demand minimal completion:
```javascript
if (done && isLowDemand) {
  // Render: pulse circle + "Tap anywhere to close" + 1.5s grace
  // On tap (after grace): saveSession() + onComplete(undefined)
  return <LowDemandComplete onClose={() => { saveSession(); onComplete(undefined); }} />;
}
```

The `LowDemandComplete` component pattern already exists in Phase 1 — likely refactorable into a shared component used by both Breathe and Body Scan. **Worth doing the refactor in this commit** since Phase 3 (Reframe) will need it too.

**What Shifted gate conditional:**
Wrap the existing `setShowWhatShifted(true)` trigger logic in `if (!isLowDemand) { ... }`. For low-demand, scan completion goes directly to the completion render.

**Total surface estimate:** ~40-60 lines of code change in BodyScanTool, plus ~20 lines if we extract the LowDemandComplete component. Single commit. Low risk because the changes are conditional on `isLowDemand` and don't touch the normal-mode code paths.

---

## Open questions for Arlin

**RESOLVED May 4, 2026:**

1. ✅ **Auto-advance during scan?** RESOLVED: keep manual tap. Tap requires reading the affordance, which is a small cognitive ask worth keeping for some control over pace. Auto-advance would take pace control away from medicated users.

2. ✅ **What about the tension data we lose?** REFRAMED: this question was based on a wrong premise. Body Scan DOES capture tension data (1-5 dot scale per area) but does NOT currently persist it. So nothing is being "lost" in low-demand because nothing is being saved in normal mode either. Phase 2 build closes the gap: wire tension persistence in normal mode AND skip the input in low-demand. Arlin direction May 4: do not throw away the strongest signal Stillform has for proving practice works; the pre/post delta from morning check-in tension to post-Body-Scan tension is the data My Progress should be using.

3. ✅ **Audio behavior specifics.** RESOLVED: force-enable existing audio only, no additions. Literature on body scan supports auditory rhythm tied to motor action (Balban 2023, MBSR/MBCT clinical norms) but does not support adding ambient hum or transition tones. Adding audio in low-demand contradicts low-demand's purpose. Existing low grounding tone during holds is already evidence-aligned design.

4. ✅ **LowDemandComplete component refactor — bundle with this commit or separate?** RESOLVED: bundle. Extracting the shared component while already in this code is more efficient than two commits. Phase 3 (Reframe) will use the same component.

5. ✅ **Mirror to Reframe (Phase 3) — separate spec or reference this one?** ALREADY RESOLVED: separate spec exists at `LOW_DEMAND_PHASE_3_SPEC.md`. Phase 3 is more complex because AI behavior changes too (shorter sentences, simpler language, no questions demanding reasoning).

---

## Ship checklist

1. **UAT dropdown if user-visible** — yes, low-demand state is detectable from outside; UAT entry needed.
2. **Tutorial if new feature** — minimal; users in this state won't see tutorial anyway.
3. **FAQ if it changes how something works** — yes. "What happens when I'm in low-demand mode?" entry needs Body Scan added.
4. **Transfer doc** — yes, capture Phase 2 ship.
5. **Plausible event if trackable** — `Body Scan Completed` event already fires; consider adding `lowDemand: true` prop.
6. **Privacy policy if new data collected** — no.
7. **Science sheet if new research-backed feature** — minor update; the low-demand mode section can mention Body Scan now covered.
8. **AI prompts if it affects Reframe context** — no.
9. **Promo if worth marketing** — Phase 1 + Phase 2 together: "Stillform respects users on medication enough to redesign the tools for cognitive bandwidth limits." Worth a founder voice mention when both ship.
10. **Punch list** — yes.
11. **Emotion coverage if touching Pulse/chips** — no chip changes.

---

## What this is NOT

- Not a redesign of normal-mode Body Scan. Normal flow stays exactly as it is.
- Not Phase 3 (Reframe low-demand). Separate spec, separate work.
- Not the body-first pre-rate fix (separate spec, separate concern — that affects ALL body-first users, not just medicated).
- Not Cognitive Function Measurement.

**This is one specific cohort getting an honest experience inside one specific tool.** Small surface. Real impact. Phase 2 of the three-phase low-demand mode build that started Apr 30.

---

## After this ships

Phase 3 (Reframe) is the most complex of three because AI behavior changes. Spec needed before build:
- AI system prompt branch for low-demand state (shorter sentences, simpler language, no open questions, fewer cognitive demands)
- UI stripping (no chip selection, no State-to-Statement option, simplified close)
- ~100-150 lines across App.jsx + reframe.js

Phase 3 spec drafted next session, after Arlin reviews this Phase 2 spec.

---

*ARA Embers LLC · Low-Demand Mode Phase 2 Spec · April 30, 2026*
