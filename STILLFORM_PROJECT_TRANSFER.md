# STILLFORM Project Transfer (Current Main Source of Truth)

Last refreshed: April 17, 2026.

## Purpose

This document tracks current merged behavior only.

## Canonical references

- `STILLFORM_LAUNCH_TRANSFER_NEXT.md` (short handoff snapshot)
- `docs/LAUNCH_DAY_RUNBOOK.md` (launch validation gates)
- `docs/COPY_LOCKS.md` (locked and constrained copy)
- `scripts/ship-preflight.mjs` (preflight checks)

## Current merged app behavior

### First-run and setup bridge

- First-run sequence is `tutorial` -> `setup-bridge` -> `setup` (calibration).
- Resume state is persisted in `stillform_first_run_stage` with values `bridge` or `calibration`.
- Completion state is `stillform_onboarded = "yes"`.
- Setup bridge is the active flow identity (`setup-bridge` route and setup-bridge copy surface).

### Home sequence and navigation state

- Returning-home surface starts with morning check-in window logic, then adaptive dominant CTA(s), then supporting cards.
- Top nav Subscribe button is shown only when local access is inactive.
- Footer Subscribe link is shown on non-home/non-pricing screens (except tool/panic/setup-bridge), including subscribed sessions.

### Tool routing and back behavior

- Tool sessions launched with `returnTo` return to that caller surface.
- Combined calibration flow preserves setup return paths:
  - `signals` back -> `setup-bridge`
  - `bias` back -> `setup`
- Share-to-Reframe launches the tool surface; without explicit `returnTo`, back returns home.

### Share behavior

- Share intent is implemented on Android through `ShareReceiverActivity`.
- Share menu label is `Stillform · Reframe`.
- Shared text is URL-encoded into `?share=...` and consumed in `src/App.jsx`.
- Auto-routing from share only occurs when first run is complete.

### Reframe request contract and routing

- Client request includes mode, history, check-in context, integration context, and science evidence snapshot fields.
- Mode routing behavior:
  - default mode follows feel-state mapping
  - clarity override is used for short loop-signal input
  - clarity override is suppressed for resolved/positive-state text.
- Server applies:
  - science-route selection by mode/input/context
  - response schema normalization
  - voice contract validation
  - intention-fit validation
  - retry pass and deterministic fallback when needed
  - positive/resolved-state and soft-entry guidance guards.

### UAT gating and shared feedback history

- UAT mode is enabled/disabled via query (`?uat=...`) and persisted local state.
- UAT freeze behavior gates home UAT banner and feedback panel visibility.
- Shared UAT history endpoint requires authenticated session (`/.netlify/functions/uat-feedback-history`).

### Cloud Sync truth and restore limitation

- Sync stores encrypted payloads.
- Restore can report undecryptable items when the original device key is unavailable.
- This limitation is surfaced in Settings and Privacy/Disclaimers copy.

### Integrations and platform truth

- Calendar and health integrations are iOS-native surfaces.
- Android reports integrations as unavailable.
- Integrations include consent/error/retry/context-clear controls in Settings.

### Reminders and notification reliability

- Reminder scheduling controls are present in Settings.
- Notification reliability is explicitly conditional on permission + platform/native-shell capability.

### Health/composure limitation note

- Privacy/Disclaimers includes explicit language that composure can be limited by physical drivers (for example pain, illness, inflammation, hormonal shifts, medication effects, severe sleep disruption).

### Wear OS bridge

- Phone-to-watch breathing bridge is implemented (`WatchBridge` + `android/wear` module).
- Validation requires paired-device testing.

## Verification commands (current expectation)

- `npm run build`
- `npm run ship:preflight`
- `npm run security:smoke` (runtime endpoint checks run when `SECURITY_SMOKE_FUNCTION_BASE_URL` is set)

## Non-claims

- Do not claim Android calendar/health integration support.
- Do not claim cross-device restore is guaranteed without original device key continuity.
- Do not claim notification delivery guarantees.
