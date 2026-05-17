# Stillform Copy Locks

> **⚠️ V2 RECONCILIATION PENDING — May 17, 2026.** Phase A deleted the v1 frontend (`src/App.jsx`) and the preflight enforcement script (`scripts/ship-preflight.mjs`). Most entries below were locked against v1 surfaces that no longer exist. Only TWO entries currently point at live surfaces: the **Splash tagline** (in `public/manifest.json`) and the **Reframe soft-entry greeting** (in `netlify/functions/reframe.js`). All other entries — Tutorial Page 0 lines, Pulse descriptor, Signal Profile + Pattern Check, Proof area 2, Science Evidence section, setupFlow keys, Focus Check labels — reference v1 surfaces deleted in Phase A. They are not currently enforced (preflight gone) and may or may not have v2 equivalents. The FAQ CONSTRAINED entries also use "composure" framing that needs reconciliation against `STILLFORM_FRAMING_LAW.md`. **Until reconciliation is done, treat this doc as historical reference for what was locked in v1, not as current enforcement.** Master Todo Bugs/Defects tracks the reconciliation as a launch-readiness item.

This document defines locked and constrained copy anchors for setup bridge, tutorial, and AI entry copy surfaces.
Any edits to **LOCKED** strings require explicit approval and a matching preflight update.

> **Framing law alignment — May 12, 2026:** Per Arlin's direction: today's framing rebuild is FROM research (Flavell 1979; Schraw & Moshman 1995; Veenman et al. 2006; Frontiers 2026; Barrett 2017; Hoemann 2021; Wells 2009; Hitchcock 2024; Bandura; Ericsson; Davidson; Lazar; Calderone; Lieberman; Porges; Lehrer), not synthesis. The pre-research locks were stale relative to the research. Path A cascade applied — splash tagline, full Tutorial Page 0 opening sequence, FAQ bodies, all disclaimers, and AI prompt surfaces now aligned with the research-grounded product framing. Tutorial Page 0 opening lines re-locked to reflect the actual shipped copy (the previous "Composure is a full-spectrum practice..." LOCKED entry referred to deprecated/never-shipped content; removed to match reality). The full FAQ bodies for "What is Stillform?" and "How is this different from meditation or therapy?" were rewritten in-place to substitute regulation-framing phrases (where regulation takes hold, structured interventions that interrupt activation, restore a functional baseline) with practice/expansion framing (where the practice takes hold, daily cognitive work that builds the concept library, expands cognitive capacity over time).

## Status Legend
- **LOCKED**: Must remain exact.
- **CONSTRAINED**: Can change only with explicit approved replacement text.
- **FLEX**: Can be tuned for clarity without changing intent.

## Locked Anchors

| Surface | Status | Exact copy |
|---|---|---|
| Splash tagline | LOCKED | `Metacognition practice` |
| Tutorial Page 0 opening line 1 | LOCKED | `Most people don't catch themselves until after the moment has passed. After the text they shouldn't have sent. After the decision they regret. After the reaction that cost them.` |
| Tutorial Page 0 opening line 2 | LOCKED | `Stillform trains you to catch it earlier — before your state drives the outcome. That's the practice. And it builds.` |
| Tutorial Page 0 opening line 3 | LOCKED | `This is instrumentation for metacognition. A practice you operate.` |
| Tutorial opening close | LOCKED | `Stillform. Metacognition Practice.` |
| Tutorial FAQ guidance sentence | LOCKED | `If you want to know more about the app, please go to our FAQ page.` |
| Combined setup step title | LOCKED | `Signal Profile + Pattern Check` |
| Combined setup flow key | LOCKED | `setupFlow: "calibration-combined"` |
| Reframe soft-entry greeting (`netlify/functions/reframe.js`) | LOCKED | `Hey good to see you. How are you doing?` |
| Pulse progress-layer descriptor | LOCKED | `Pulse is fed by completed tools and check-ins. It lives here as part of My Progress.` |
| Science evidence section title | LOCKED | `Science Evidence` |
| Tutorial progression labels | LOCKED | `Tutorial · 1 of 4` / `Tutorial · 2 of 4` / `Tutorial · 3 of 4` / `Tutorial · 4 of 4` |
| Tutorial page titles | LOCKED | `This Setup Is For You` / `Cognitive Baseline — Your First Read` / `One Practice. Three Moments.` / `The Skill Builds Over Time` |
| Tutorial CTA row | LOCKED | Non-final pages use `Next →`; final page uses `Continue →` (or `Return to settings` on replay) |
| Setup bridge title | LOCKED | `Set up your customizations and map your signals` |
| Setup bridge signal action | LOCKED | `Map signals now` |
| Setup bridge primary CTA | LOCKED | `Continue to calibration` |
| Proof area 2 title | LOCKED | `Check-in consistency` |

## Constrained Anchors

| Surface | Status | Current copy |
|---|---|---|
| Setup bridge visual block title | CONSTRAINED | `Visual customization` |
| Setup bridge signal block title | CONSTRAINED | `Signal mapping` |
| Setup bridge signal status labels | CONSTRAINED | `Status: configured` / `Status: not configured` |
| FAQ method question | CONSTRAINED | `What is the method behind Stillform?` |
| FAQ science question | CONSTRAINED | `What science basis does Stillform use?` |
| FAQ method answer | CONSTRAINED | `Stillform is a metacognitive composure practice. Calibration maps how your system tends to process pressure so the platform can route support intelligently. From there, daily use follows one loop: set the tone, read the signal, use the right support, then close the loop and learn from it.` |
| FAQ science answer | CONSTRAINED | `Stillform draws from metacognitive therapy, behavioral and cognitive neuroscience, and stress regulation research: paced breathing for autonomic downshift, body scanning for interoceptive awareness, and cognitive distancing in Reframe so you can separate signal from story. It is a composure and performance platform, not diagnosis or treatment.` |

## Structural Locks

1. Tutorial uses multi-page progressive disclosure (not single-page compression).
2. FAQ in tutorial is guidance text at tutorial end (not a tutorial FAQ CTA button).
3. First-run flow routes to tutorial before setup.
4. First-run flow is tutorial → setup bridge → setup calibration.
5. Setup keeps combined calibration sequencing:
   - How You Process
   - Signal Profile + Pattern Check
6. Calibration step 2 may skip signal mapping when profile is already configured, then proceed directly to Pattern Check.
7. Preview routing supports: `tutorial`, `setup-bridge`, `home`, `settings`, `faq`, `privacy`.
8. Tutorial uses four concise guided pages after the opening page, with exact tool naming aligned to active daily tools.
9. Pulse is part of My Progress data interpretation and not a standalone manual-entry tool surface.
10. Focus Check action launches from Home (`Quick Check`) and Settings > More (`Run Focus Check (30s)` · *"Quick signal on focus, inhibition, and response control."*).
11. Focus Check appears inside My Progress evidence outputs only (not as a standalone tool card).
12. Tutorial includes a Go / No-Go TTFV step with an on-page Post-Check Briefing before proceeding.

## Prohibited Claims

- No founder credential claims in app copy.
- No low-integrity social-media/hype phrasing.
- No pressure-only framing of composure capability.
