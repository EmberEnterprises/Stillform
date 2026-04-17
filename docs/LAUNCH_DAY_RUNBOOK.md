## Stillform Launch-Day Runbook (Code + Ops)

Use this checklist in order. Stop on any failed gate.

### Launch timing note (operator lock)

- Do **not** run broad launch this week.
- Next feasible target: **Monday, April 20, 2026 (local)** for coordinated launch execution.
- Until then: keep UAT controlled, stabilize Settings UX, and avoid countdown messaging that creates tester anxiety.

---

### 1) Code Integrity Gate (required)

Run:

```bash
npm run build
npm run ship:preflight
node scripts/core-loop-smoke.mjs
npm run security:smoke
```

Expected:
- Build passes
- SHIP preflight passes
- Core loop smoke prints all checks as `✓`
- Security smoke passes
- SHIP preflight validates current copy-lock + routing contract checks for `src/App.jsx` and `netlify/functions/reframe.js`

---

### 2) Deployment Fingerprint Check

In Settings, verify:
- Build label is visible (App version / package / build timestamp)
- Build timestamp matches current deploy

If users report old behavior:
- Hard reload app/webview
- Confirm build timestamp changed

---

### 3) Payment/Subscription Ops (external)

1. Switch Lemon Squeezy from test to live
2. Verify variant mapping (monthly/annual)
3. Complete live checkout test
4. Confirm webhook updates subscription truth
5. Confirm app reads server-side subscription as source of truth

---

### 4) Cloud/Data Ops (external + app)

1. Sign in with cloud account
2. Sync now
3. Restore on second device
4. Verify:
   - sessions
   - pulse log
   - profiles/insights
5. Confirm restore limitation copy remains honest:
   - restore depends on the original device encryption key
   - cross-device restore can report undecryptable items

---

### 4.5) Integration Truth Gate (launch-critical for iOS native builds)

Platform truth before testing:
- Calendar + Health integration actions are currently supported on native iOS builds.
- Android currently reports these integrations as not available.
- Do not claim cross-platform parity for integrations yet.

Run on a physical iOS device build:

1. Settings → Integrations → **Connect calendar**
   - Permission prompt appears
   - If granted, calendar summary + freshness appears
   - If denied/restricted, status reflects denied/restricted (not connected)
2. Settings → Integrations → **Connect health**
   - Health authorization appears
   - If granted, health summary/snapshot appears (or explicit no-data)
   - If denied/restricted, status reflects denied/restricted (not connected)
3. Verify **Sync calendar now** and **Sync health now** update timestamps/errors appropriately
4. Verify **Revoke calendar/health** clears cached integration context and returns to manual mode copy
5. Confirm integration context usage in flow:
   - Morning check-in shows upcoming pressure banner when calendar context exists
   - Reframe request includes calendar + health context fields when available

Go/No-Go rule:
- Do not claim “connected” unless provider permission + real device data pull are both confirmed.

---

### 4.6) First-run + setup-bridge flow gate

Verify first-run sequence and resume behavior:
- First-run order is `tutorial` → `setup-bridge` → `setup` (calibration flow).
- If first run is interrupted, app resumes by `stillform_first_run_stage` (`bridge` or `calibration`) instead of restarting at home.
- Setup bridge uses current identity/copy (“Set up your customizations and map your signals”), not legacy onboarding wizard language.

---

### 4.7) Home + return-path behavior gate

Verify current navigation behavior:
- Home above-fold starts with morning check-in window card, then adaptive dominant CTA block.
- Nav “Subscribe” button appears only when local access is inactive.
- Footer “Subscribe” link appears on non-home/non-pricing screens (including subscribed sessions) and is hidden on active screen links.
- Tool back behavior:
  - tools launched with `returnTo` return to their caller surface
  - calibration combined flow preserves `setup-bridge`/`setup` return paths
  - share-to-Reframe launches tool view and falls back to home when no explicit `returnTo` is set.

---

### 4.8) UAT gating + shared feedback feed gate

Verify UAT controls are not broad-surface defaults:
- UAT state is gated by `?uat=on|true|1` (or saved local storage toggle), with freeze window behavior applied only in UAT mode.
- Home UAT banner + feedback panel appear only while UAT freeze is active.
- “Shared UAT feed” fetch requires authenticated session; unauthenticated requests are rejected by `/.netlify/functions/uat-feedback-history`.

---

### 5) User-Safety and Trust Checks

Confirm in live app:
- Crisis resources open and links work (`tel`, `sms`, web)
- AI insights remain guarded (no clinical labels/judgmental language)
- Post-rating reflection appears only when threshold is met
- Privacy/disclaimer text includes composure limitation note for physically driven states (illness, pain, inflammation, hormonal shifts, medication, severe sleep disruption)
- Reminder reliability copy remains explicit: notification delivery depends on device/browser permissions and native shell capabilities (no guaranteed delivery claim)

---

### 6) App Store / Play Track (external)

- iOS: archive + upload + TestFlight sanity pass
- Android: AAB upload + closed test track checks

---

### 7) Policy/Legal Publish

- Privacy policy reflects encrypted cloud backup + restore
- Terms/disclaimer copy aligned with in-app claims

---

### 8) Launch-Go Decision

Go only if:
- All code gates pass
- Payment truth verified in live mode
- Cloud restore verified on second device
- Policy pages published and accurate

If any gate fails: do not launch broad.

---

### 9) Metrics Telemetry Validation (metrics-only)

1. In Settings > Data management, confirm metrics toggle is ON
2. Tap **Send metrics now**
3. Confirm success status appears in-app
4. Verify row appears in `stillform_metrics_daily` for today

Note: this payload is counts/rates only (no journal or AI text content).

