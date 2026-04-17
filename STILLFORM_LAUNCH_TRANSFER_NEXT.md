# STILLFORM Launch Transfer — Next Session Snapshot

Last refreshed: April 17, 2026 (current `main`).

## Scope

This file is the concise source-of-truth handoff for merged app behavior.

## Current merged-state checkpoints

1. First-run sequence is `tutorial` -> `setup-bridge` -> `setup` (calibration), and interrupted first-run resumes by `stillform_first_run_stage` (`bridge` or `calibration`) until `stillform_onboarded` is set.
2. Setup bridge identity is active (`setup-bridge` route + setup-bridge copy); legacy onboarding-step naming is not the active flow identity.
3. Home above-fold starts with morning check-in (window-gated), then adaptive dominant CTA (`Talk it out` or `Calm my body`, or balanced equal-entry buttons), then supporting surfaces (`My Progress`, loop nudges, install hints, UAT banner/feed when gated on).
4. Subscribe state behavior:
   - top nav Subscribe button renders only when local access is inactive
   - footer Subscribe link renders on non-home/non-pricing screens (except tool/panic/setup-bridge), including subscribed sessions.
5. Tool/back return-path behavior:
   - tools launched with `returnTo` go back to the caller surface
   - calibration combined flow preserves `setup-bridge`/`setup` return routing
   - share-to-Reframe launches tool view and, without `returnTo`, back falls to home.
6. Share-to-Reframe is Android-native via `ShareReceiverActivity` + `?share=` deep link and only auto-routes when first-run is complete.
7. Cloud Sync messaging is explicit: data is encrypted before upload, and restore on a different device can fail for some items when the original device key is unavailable.
8. UAT gating is explicit:
   - UAT mode is controlled by query/local storage (`?uat=...`)
   - freeze-window UX (banner + feedback panel) only appears when UAT freeze is active
   - shared UAT feed endpoint requires authenticated session.
9. Reframe contract and routing:
   - request includes mode/history and context layers (check-in, integration context, science evidence, etc.)
   - server enforces schema/voice/intention guards with retry + deterministic fallback
   - positive/resolved-state and soft-entry guards prevent forced negative reframing
   - client clarity override only triggers for short loop-signal input and is suppressed for resolved/positive signals.
10. Integration/platform truth:
    - calendar/health sync actions are iOS-native
    - Android shows integrations as unavailable.
11. Reminder/notification truth:
    - reminder scheduling exists
    - delivery depends on device/browser permission and native-shell capability (no guaranteed-delivery claim).
12. Health/composure limitation note is present in Privacy & Disclaimers: physically driven states can limit composure and should be treated as real signal for professional care.
13. Wear OS breathing bridge is implemented (`WatchBridge` + `android/wear`) and requires paired-device verification.

## Verification commands

Run before launch claims:

- `npm run build`
- `npm run ship:preflight`

Operational note:

- `npm run security:smoke` runtime endpoint checks use `SECURITY_SMOKE_FUNCTION_BASE_URL` when provided.
