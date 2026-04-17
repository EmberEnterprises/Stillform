# Stillform Copy Locks

This document defines locked and constrained copy anchors for setup bridge, tutorial, and AI entry copy surfaces.
Any edits to **LOCKED** strings require explicit approval and a matching preflight update.

## Status Legend
- **LOCKED**: Must remain exact.
- **CONSTRAINED**: Can change only with explicit approved replacement text.
- **FLEX**: Can be tuned for clarity without changing intent.

## Locked Anchors

| Surface | Status | Exact copy |
|---|---|---|
| Splash tagline | LOCKED | `Composure architecture` |
| Tutorial opening line | LOCKED | `Composure is a full-spectrum practice. It governs how you respond in difficulty, in momentum, and in daily life. Composure is a daily choice: build grace, poise, and better reflexes under every kind of pressure.` |
| Tutorial opening support line | LOCKED | `Stillform disciplines how you respond with a daily system for regulation, perception, and deliberate action.` |
| Tutorial opening close | LOCKED | `Stillform. Composure Architecture.` |
| Tutorial FAQ guidance sentence | LOCKED | `If you want to know more about the app, please go to our FAQ page.` |
| Combined setup step title | LOCKED | `Signal Profile + Pattern Check` |
| Combined setup flow key | LOCKED | `setupFlow: "calibration-combined"` |
| Reframe soft-entry greeting (`netlify/functions/reframe.js`) | LOCKED | `Hey good to see you. How are you doing?` |
| Pulse progress-layer descriptor | LOCKED | `Pulse is fed by completed tools and check-ins. It lives here as part of My Progress.` |
| Science evidence section title | LOCKED | `Science Evidence` |
| Tutorial progression labels | LOCKED | `Tutorial · 1 of 4` / `Tutorial · 2 of 4` / `Tutorial · 3 of 4` / `Tutorial · 4 of 4` |
| Tutorial page titles | LOCKED | `Calibration — Build Your Baseline` / `Go / No-Go Quick Check — Time to First Value` / `Morning + Daily Tools — Active Execution Layer` / `Run the Full Loop Daily` |
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
| FAQ method answer | CONSTRAINED | `One architecture, three loops: Morning Check-In sets context, in-the-moment regulation tools (Reframe, Breathe, Body Scan) stabilize execution, and End-of-Day Close consolidates learning. Calibration sets your default routing (thought-first or body-first) so the right tool appears first.` |
| FAQ science answer | CONSTRAINED | `Stillform applies established mechanisms from behavioral and cognitive neuroscience: autonomic down-regulation through paced breathing, interoceptive awareness through body scanning, cognitive reappraisal and defusion in Reframe, and implementation-intention style next-step selection. It is a composure and performance tool, not diagnosis or treatment.` |

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
