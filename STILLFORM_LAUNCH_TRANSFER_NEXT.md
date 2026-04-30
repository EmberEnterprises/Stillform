# STILLFORM Launch Transfer — Next Session Snapshot

Last refreshed: April 30, 2026.

## Source of truth

For current state, refer to:
- **STILLFORM_PROJECT_TRANSFER.md** — single source of truth, full session arcs
- **Stillform_Master_Todo.md** — current top priority + open items + ✅ resolved entries
- **Stillform_Strategic_Roadmap.md** — return-loop architecture frame, current blockers
- **Stillform_Science_Sheet.md** — neuroscience pillars + engagement principles (10 behavioral science principles added Apr 30)

This file is the short launch-state handoff between sessions.

## Current merged-state checkpoints (April 30, 2026)

1. **Lemon Squeezy LIVE.** Bobby confirmed live mode switch. Paywall active.
2. **Cloud sync shipped Apr 15.** Supabase three-table schema, RLS, AES-256 encryption, pre-update backup on version change.
3. **Apr 30 user-facing code commits:** prestige refresh (5 commits), home banner copy, Settled chip (9th feel chip), Body Scan What Shifted, three-category data feed, dead modeConfig cleanup, chip ⓘ button system, Cyclic Sighing breathing pattern, low-demand mode Phase 1 (Breathe). 12 commits total. All sit in Netlify publish queue awaiting Arlin trigger.
4. **Wear OS breathing bridge (`WatchBridge` + `android/wear`)** — implemented, needs validation on paired Galaxy Watch Ultra. Requires Android Studio installed locally on Mac.
5. **Calendar/Health integrations** — iOS-native only; Android still reports integration unavailable.
6. **Share-to-Reframe** — Android only; auto-routes when first-run is complete.

## What's pending — return-loop architecture (per Strategic Roadmap)

**Layer 2 — Return-loop infrastructure (mostly pending):**
- Watch integration validation (Wear OS haptic breathing companion)
- Health Connect / HealthKit (HRV, sleep, heart rate)
- Biometric lock (Face ID / fingerprint on Reframe + Signal Log)
- Notification triggers wired into morning/EOD anchors

**Layer 3 — Engagement craft (mostly pending):**
- Cognitive Function Measurement moonshot (spec: COGNITIVE_FUNCTION_MEASUREMENT_SPEC.md)
- Plain-language neuroscience surface (not yet spec'd)
- Kinesthetic close interaction (direction chosen — single tap on slow-pulsing point or long-press to seal)
- Low-demand mode Phase 2 + Phase 3 (specs: LOW_DEMAND_PHASE_2_SPEC.md / LOW_DEMAND_PHASE_3_SPEC.md)

## Why all of this must ship before launch

The seven testers (Ava, Bobby, Ari, Michelle, Paula, Ive, Jonny) tested the regulation tool and bounced. Plausible confirms Arlin has been the only user for the past month. Cool-and-bounced is the diagnostic signal: substance worked, return loop did not exist. Layer 2 (return-loop infrastructure) and Layer 3 (engagement craft) are the missing return loop. Shipping any layer alone produces cool-and-bounced at scale. All three together is the actual launch product.

## Copy-lock and launch preflight source docs

- `docs/COPY_LOCKS.md`
- `docs/LAUNCH_DAY_RUNBOOK.md`

## Operator reminder

Before launch claims, run:
- `npm run build`
- `npm run ship:preflight`

Netlify deploys are MANUAL — Arlin triggers in Netlify after Claude pushes to GitHub.
