# COMPLETE V1 → V2 MIGRATION GAP AUDIT
**June 15, 2026 · the full accounting Arlin asked for**

Method: read the v1 monolith (`237167b^:src/App.jsx`, 34,085 lines), extracted
every named component/surface (35 total), and checked each against the live v2
tree by FUNCTION not just name (v2 deliberately renamed things — ReframeTool →
Reframe.jsx — so name-misses were verified by concept before being called lost).
This supersedes the earlier partial audit (`AUDIT_WHAT_WAS_LOST.md`); the design-
system/palette/font findings there still hold and are not repeated in full here.

Every "LOST" item below was verified absent in `src/v2/` by concept search, not
assumed. Every recovery path is real (the v1 code is intact in git history).

---

## ✅ SURVIVED — has a real v2 successor (do NOT touch)
- **Reframe (AI)** — ReframeTool → `spine/Reframe.jsx`.
- **Close** — SessionCloseScreen → `spine/Close.jsx` (rebuilt, user-takeaway).
- **Notice / PresentStateChips** — → `spine/Notice.jsx` (feel chips live).
- **My Progress** — → `screens/MyProgress.jsx`.
- **Roadmap** — RoadmapScreen → `screens/Roadmap.jsx`.
- **Scripts** — ScriptsTool → `spine/Scripts.jsx`.
- **Trigger Profile** — TriggerForm/TriggerProfileSection → `TriggerProfile.jsx`.
- **Quick Breathe** — QBPill → `QuickBreathe.jsx` + `BreatheOverlay.jsx`
  (Cyclic Sighing; early-stop just added).
- **Physiological Sigh** — folded into the Cyclic Sighing breathe protocol.
- **Bias / Blind-spot work** — MicroBiasTool → `BiasProfile.jsx` + Workshop.
- **Crisis / FAQ / Settings / Pricing** — all have v2 screens.

## ⚠️ PARTIAL — surface exists but lost fidelity/pieces
- **BreatheGround visuals** — the breathe screen exists, but the
  **FractalBreathCanvas** behind the ring is gone (see LOST #2).
- **Library / ScienceCard** — Library.jsx exists but its OWN code says the
  "curated-knowledge / neuroscience cards are a separate **not-yet-started**
  section." So the science-card content surface is **absent** (acknowledged
  as unbuilt, not silently dropped — but missing for launch).

---

## ❌ LOST — verified absent, no v2 successor

### 1. VOICE INPUT / dictation  ← **hits Arlin directly**
v1 `MicButton` + `useSpeechToText`: a mic button on any text field, speech-to-
text. **Fully absent in v2** (`useSpeechToText`/`SpeechRecognition`/`onTranscript`
return nothing). Given the accent + typing-friction workflow, losing dictation
is a real accessibility regression, not a nicety.
**Recover:** v1 `MicButton` + the `useSpeechToText` hook, intact in history.

### 2. FRACTAL BREATHING VISUALS ("the trees")
`FractalBreathCanvas` (commit `932ab88`, 99 lines): organic branches grow on
inhale / dissolve on exhale, amber particles, breath-scaled center glow. Behind
the ring in Quick Breathe + BreatheGround. "Visual grounding" toggle, on by
default. **Absent in v2.**
**Recover:** `932ab88`.

### 3. BODY SCAN TOOL (a whole core tool)
`BodyScanTool`: 6 acupressure points, timed holds, SVG body schematics, auto-
advance, "Signal cleared." One of the THREE core tools per the project transfer.
**Absent in v2** — though the Master Todo STILL lists it as a live stabilizer
and its data layer (`getBodyScanTensionHistory`, tension trends) was built.
**Recover:** v1 monolith (`237167b^`), incl. the 6 points + SVG schematics.

### 4. SIGNAL MAP (body-signal setup)
`SignalMapTool`: the onboarding/setup step where the user maps WHERE intensity
activates in the body (jaw, shoulders, chest…), producing a Signal Profile the
AI then reads. **Absent in v2** — no onboarding or setup surface maps body
signals; v2 `Onboarding.jsx` has none. The Signal Profile that fed Reframe
context is therefore unpopulated.
**Recover:** v1 `SignalMapTool` + `SignalMapHeader` + `SignalMapTransition`.

### 5. METACOGNITION "WATCH & CHOOSE" TOOL
`MetacognitionTool`: a guided watch-the-thought sequence (fired a "Reframe Watch
Sequence" event). A distinct metacognitive exercise, separate from Reframe.
**Absent in v2.**
**Recover:** v1 monolith.

### 6. AMBIENT / MOTION VISUALS
21 named `@keyframes` in v1 — `heroReflection`, `entrain60`/`entrain60glow`
(entrainment glow), `deltaGlow`/`deltaFlash` (shift feedback), `smtLineDraw`/
`stnLineDraw` (line-draw reveals), `splashIn` (splash screen). v2 has none of
these (some legitimately superseded by the D2 trace; splash/hero/entrainment
have no successor).
**Recover:** v1 CSS. NEEDS TRIAGE — keep/cut per item, not a blanket restore.

### 7. SUPPORTING SURFACES (smaller, verify-want before rebuilding)
- **LowDemandComplete** — the low-demand-day completion screen (gentler close).
- **BioFilterSuggestion** — the in-flow bio-filter suggestion card (note:
  bio-filter capture was a deliberate prior DROP — confirm before any rebuild).
- **StageRitualOverlay / SessionTransition** — the between-stage ritual/
  transition animations.
- **FocusCheckValidation / Calibration** — the focus/calibration check flow
  (some calibration concepts may live in predictionLog — verify).
- **ScienceCard** — see PARTIAL above.

---

## DESIGN SYSTEM (from the prior audit, still open — summary)
- Locked **prestige spec overwritten** by D1 (recovered:
  `STILLFORM_PRESTIGE_SPEC_RECOVERED.md`).
- **Fonts** reverted to Cormorant + DM Sans ✅ (`220b0ee`).
- **Palette** still wrong (D1 warm-umber vs spec's #08080A near-black +
  antiqued gold + 0.5px hairlines) — pending the dedicated COLOR+FONT audit
  (punch-list item 6). The recurring "blur" is unresolved and needs diagnosis.

---

## PRIORITY READ (Claude's opinion, Arlin decides)
1. **Voice input** — accessibility regression that hits Arlin's own use. High.
2. **Color/font audit + palette restore** — the thing making everything read
   wrong; blocks honest judgment of every other fix. High.
3. **Body Scan tool** — a whole advertised core tool, data layer waiting. High.
4. **Fractal breathing visuals** — named loss, beloved, self-contained. Medium.
5. **Signal Map setup** — restores Signal Profile context to the AI. Medium.
6. Watch & Choose, ambient visuals, supporting surfaces — triage individually.

Nothing here is unrecoverable. All of it is in git. None of it is Arlin's
laptop work — it is Claude's to rebuild.
