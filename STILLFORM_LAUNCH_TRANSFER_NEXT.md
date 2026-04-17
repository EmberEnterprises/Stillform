# STILLFORM Launch Transfer — Next Session Snapshot

Last refreshed: April 17, 2026 (from current `main`).

## Source of truth

- Strategic/historical context remains in `STILLFORM_PROJECT_TRANSFER.md`.
- This file is the short launch-state handoff for current merged behavior.

## Current merged-state checkpoints

1. Share-to-Reframe is implemented on Android and only auto-routes when first-run is complete.
2. Wear OS breathing bridge is implemented (`WatchBridge` + `android/wear`) and should be validated on paired devices.
3. Calendar/Health integrations are currently iOS-native only; Android currently reports integration unavailable.
4. Copy-lock and launch preflight source docs:
   - `docs/COPY_LOCKS.md`
   - `docs/LAUNCH_DAY_RUNBOOK.md`

## Operator reminder

Before launch claims, run:

- `npm run build`
- `npm run ship:preflight`
