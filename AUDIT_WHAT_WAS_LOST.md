# AUDIT — WHAT WAS LOST (June 15, 2026)

Arlin directed a full audit after catching three losses in one session (fonts,
palette, breathing trees). This is the complete blast radius, found by reading
the v1 monolith (`src/App.jsx` @ `237167b^`, 34,085 lines) and the deleted
design spec against the current tree — not by trusting commit messages or prior
audits. The prior audits checked *feature presence* ("does Quick Breathe
exist?") and missed *fidelity* ("does it still have the fractal canvas?"). That
gap is how these losses shipped silently.

## ROOT CAUSE
Two unaudited seams:
1. **v1→v2 migration** (`237167b` deleted the monolith). Features were rebuilt
   as v2 components; several **visuals and one whole tool were not carried over**
   and were never tracked as owed.
2. **D1 design-system swap** (`6bca75d`). Overwrote a **locked design spec**
   without reading it.

---

## LOSS 1 — THE LOCKED PRESTIGE DESIGN SPEC (the big one)
**What:** `STILLFORM_DESIGN_SYSTEM.md` was, until D1, the **"Stillform whole-app
prestige refresh"** (April 30, 422 lines). It was synthesized from brand
references collected across FIVE AIs and anchored Stillform to **editorial
luxury — Aesop, MUBI, Cartier, Hermès, Linear, Leica, The Economist Espresso.
Explicitly: "Not wellness. Not productivity. Not consumer SaaS."**
It LOCKED:
- Ground **`#08080A`** near-true-black, slight cool undertone, "cinematic, never
  flat app-like," with a barely-visible 2% radial gradient for depth.
- **Cormorant Garamond + DM Sans + IBM Plex Mono** — called "correct anchors the
  references validated," treatment-only changes allowed.
- **0.5px hairlines** everywhere — "printed on uncoated stock."
- **Antiqued metallic gold**, explicitly NOT "wellness amber."
**What happened:** D1 (`6bca75d`) deleted all 422 lines and replaced them with a
new "Folio/Fraunces/warm-umber" direction — warm, app-like, wellness-adjacent:
exactly what the locked spec forbade. Every "looks like poop / doesn't read
prestige" reaction this session was the locked spec being right in advance.
**Recovery:** FULL spec recovered to `/tmp/prestige-spec.md` (422 lines, intact,
39 luxury-anchor references). Restorable verbatim.

## LOSS 2 — THE FONTS
**What:** Cormorant Garamond (display) + DM Sans (body), per the locked spec.
**What happened:** D1 swapped Cormorant→Fraunces, DM Sans→Inter.
**Recovery:** original `tokens.css` + `index.html` font links at `6bca75d^`.
(`/tmp/orig-tokens.css`, `/tmp/orig-index.html`.) Cormorant is materially more
elegant than Fraunces — confirmed by eye on recovered render this session.

## LOSS 3 — THE PALETTE
**What:** near-black `#08080A`/`#111114`/`#16161A`, cool blue-white text
`#E8EAF0`, antiqued gold `#B8862B`.
**What happened:** D1 swapped to warm umber browns (`#221C15` etc.) + cream.
Today's "Ink & Bone" was me reinventing — worse — the cool dark the locked spec
already specified.
**Recovery:** same source as Loss 2.

## LOSS 4 — FRACTAL BREATHING VISUALS (the "trees")
**What:** `FractalBreathCanvas` (commit `932ab88`, 99 lines): recursive organic
branches that GROW on inhale and dissolve on exhale, amber particles drifting
with breath rhythm, center glow pulsing with breath scale. Rendered behind the
breathing ring in BOTH Quick Breathe (PanicMode) and BreatheGround. "Visual
grounding" Settings toggle, on by default.
**What happened:** lived in v1 monolith; not carried into v2. The current
breathe screen (`BreathingSession.jsx`) says so in its own comment: "No animated
ring in this initial cut… polish can come later." Never tracked as owed.
**Recovery:** full component at `932ab88`. (Note: BreatheOverlay.jsx DOES have
the breathing ring/circle scaling — 13 refs — only the fractal canvas BEHIND it
is gone.)

## LOSS 5 — THE BODY SCAN TOOL (a whole core tool)
**What:** `BodyScanTool` — one of the THREE core tools per the project transfer.
6 acupressure points with timed holds, SVG body schematics, auto-advance,
"Signal cleared" completion. The Master Todo STILL lists it as a current
stabilizer (line 22: "Body Scan (6 acupressure points + scan-pace toggle)") and
a full data layer was built for it (`getBodyScanTensionHistory`, tension-trend
surfacing, Phase 0 shipped May 6).
**What happened:** the tool itself was in the v1 monolith and was NOT carried
into v2. The data plumbing that feeds it exists; the tool does not. No
`BodyScanTool` / acupressure screen anywhere in `src/v2/`. Silently dropped,
exactly like the trees — and worse, because the Todo still claims it's live.
**Recovery:** full implementation in the v1 monolith (`237167b^:src/App.jsx`),
including the 6 points + SVG schematics. Needs a v2 screen rebuild, not a copy
(monolith → component), but the source is intact.

## LOSS 6 — AMBIENT HOME / SCREEN VISUALS
**What:** v1 had named ambient animations — `heroReflection`, `entrain60` /
`entrain60glow` (60-cycle entrainment glow), `deltaGlow`/`deltaFlash` (shift
feedback), `smtLineDraw`/`stnLineDraw` (line-draw reveals), `splashIn` (splash).
21 `@keyframes` total in v1.
**What happened:** v2 SmartScreen/Home have none of these (0 refs). Some are
legitimately superseded by the D2 trace line; others (splash, hero reflection,
entrainment glow) have no v2 successor.
**Recovery:** all in the v1 monolith CSS. NEEDS ARLIN'S CALL on which were
deliberate cuts vs. losses — not all should necessarily return.

---

## NOT LOST (verified successors exist — don't restore)
- Quick Breathe pill: rebuilt as Cyclic Sighing (`a2e108f`), correct per Balban.
- Reframe, Close, Notice, MoveCard, SelfReframe: v2 spine successors, intact.
- My Progress, Trigger/Context Profile, Library/Workshop, Crisis routing,
  Settings, FAQ, Paywall, error boundary: all have v2 successors.
- Mirror/Roadmap/cloud-sync: were on the tracked rebuild backlog (known, not
  silent losses) and have since been built this session.

---

## THE FIX (Arlin decides order)
1. **Restore the locked prestige design system** — recover the 422-line spec as
   the source of truth, then restore Cormorant + DM Sans + `#08080A` + antiqued
   gold + 0.5px hairlines. This REPLACES D1's Folio/Fraunces/umber AND today's
   Ink & Bone. The structure built in D2–D5 (trace, work blocks, arbor) can be
   kept — re-skinned to the locked spec — OR re-evaluated against it.
2. **Restore FractalBreathCanvas** into the v2 breathe screen(s) + the visual-
   grounding toggle.
3. **Rebuild the Body Scan tool** as a v2 screen (data layer already waiting).
4. **Triage the ambient visuals** (Loss 6) with Arlin — keep / cut per case.
5. **Regenerate app icons** on the restored palette (they're currently on D1
   umber, which is itself wrong).

Recovery sources staged: prestige spec `/tmp/prestige-spec.md`; original
tokens/index `6bca75d^`; FractalBreathCanvas `932ab88`; Body Scan + ambient
CSS `237167b^:src/App.jsx`.
