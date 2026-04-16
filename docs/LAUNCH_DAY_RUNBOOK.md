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

---

### 4.5) Integration Truth Gate (launch-critical for TestFlight)

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

### 5) User-Safety and Trust Checks

Confirm in live app:
- Crisis resources open and links work (`tel`, `sms`, web)
- AI insights remain guarded (no clinical labels/judgmental language)
- Post-rating reflection appears only when threshold is met

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

