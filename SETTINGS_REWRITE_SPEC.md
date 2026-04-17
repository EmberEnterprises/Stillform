# Settings Rewrite Spec
**Locked April 17, 2026 — confirm before coding**

This is the agreed structure. Every section key, label, and sub-item is listed.
No code changes until Arlin confirms this is correct.

---

## State key changes

Current `settingsSectionOpen` keys:
`processing, breathing, schedule, notifications, audio, scanPace, display, security, advanced, integrations, subscription, sound, cloudsync, logs, customization, signal, data, more`

New keys needed:
`personalization, account, integrations, data, more`

Removed: `processing, breathing, schedule, notifications, audio, scanPace, display, security, advanced, subscription, sound, cloudsync, logs, customization, signal`
(All absorbed into the new grouped sections above)

---

## New settings structure

### FAQ (top)
- Button → opens FAQ screen
- No collapse/expand — stays as a CTA button, unchanged

---

### PERSONALIZATION
Section key: `personalization`
Collapsed by default.

#### Sub-group: App Customization
Label: `APP CUSTOMIZATION` (monospace uppercase, dim)

- **Theme** — Dark / Midnight Blue / Warm Amber / Light (existing logic)
- **AI Reframe Tone** — Balanced / Gentle / Direct & blunt / Clinical / Motivational (existing logic)
- **Display** — Screen-light mode toggle / Reduced motion toggle / Visual grounding toggle (existing logic)
- **Audio** — Breathing audio guidance toggle (existing logic)
- **Sound** — Tone / Rhythm / Silence + Coming soon premium sounds (existing logic)

#### Sub-group: Your Setup
Label: `YOUR SETUP` (monospace uppercase, dim)

- **Processing Type** — Thought-first / Body-first / Balanced (existing logic)
- **Breathing Pattern** — Quick Reset / Deep Regulate (existing logic)
- **Body Scan Pace** — Fast / Standard / Slow (existing logic)
- **Signal Mapping** — "Map your signals →" button launches signals tool (existing logic)
- **Schedule & Notifications** — COMBINED: morning time picker + evening time picker + daily reminder toggle + reminder time picker (merge of old schedule + notifications sections)
- **Re-run calibration** — button that clears regulation_type, signal_profile, bias_profile, bio_filter and launches setup bridge (moved from More)
- **Replay setup bridge visual comfort →** — button that launches setup bridge from settings without clearing data (existing logic from old customization section)

---

### ACCOUNT
Section key: `account`
Collapsed by default.

Contents (single unified section — no sub-groups):

**If signed out:**
- Email + password inputs
- "Sign in / Create account" button
- "New to Stillform? Enter your email and a password — your account is created automatically." helper text

**If signed in:**
- "Signed in as [email]"
- Subscription status row: Access label + ACTIVE/INACTIVE badge
- Subscription sub-copy (trial / UAT / expired / active copy — existing logic)
- "If access looks wrong, refresh from server." / "Recent checkout detected…" copy
- Last checked timestamp
- "Refresh from server" button
- Sync copy: "Your data is encrypted before upload…"
- Restore limitation note
- "Sync now" button
- "Restore now" button
- **Biometric lock toggle** (native shell only — `isNative()` guard, existing logic)
- "Sign out" button

Status/error feedback (syncSuccess, syncError, subscriptionStatusMessage) displayed inline.

---

### INTEGRATIONS
Section key: `integrations`
Collapsed by default. No structural change — same content as today.

- Calendar context status + connect/revoke/sync/clear controls
- Health context status + connect/revoke/sync/clear controls
- Platform-honest copy (iOS native only, Android unavailable)
- Refresh status / Clear stale context buttons
- Integration action status message

---

### DATA MANAGEMENT
Section key: `data`
Collapsed by default.

Sub-group label: `YOUR LOGS` (monospace uppercase, dim) — at top of data section

- **Session history** — expandable list (existing logic)
- **Pulse** — expandable list (existing logic)
- **Saved reframes** — expandable list (existing logic)
- **Signal profile** — status card (existing logic)

Divider

- **Auto backup** — "Weekly encrypted backup of all your data" card
- **Performance metrics** — toggle + "Send metrics now" + "Copy metrics snapshot (JSON)" (existing logic)
- **Export pulse log (PDF)** — button (existing logic)
- **Export session history (CSV)** — button (existing logic)
- Export status message
- Metrics status message
- **Delete all data** — small understated button, double confirm (existing logic)

---

### MORE
Section key: `more`
Collapsed by default.

- **Privacy & Disclaimers** — button → privacy screen (existing)
- **Contact us** — mailto link (existing)
- **Replay tutorial** — button (existing)
- **Share app link (QR)** — expandable QR card (existing)
- **Run Focus Check (30s)** — button → `openFocusCheck("settings")`
  Sub-copy: `"Quick signal on focus, inhibition, and response control."`

Note: Re-run calibration is REMOVED from here (moved to Personalization > Your Setup).

---

## What is being removed

- **Advanced Controls** section — eliminated entirely. Everything it contained has a proper home now.
- **Security** as a standalone section — absorbed into Account.
- **Cloud Sync** as a standalone section — absorbed into Account.
- **Subscription status** as a standalone section — absorbed into Account.
- **Customization (colors + motion)** section — renamed to Personalization, restructured.
- **Signal Mapping** as a standalone section — absorbed into Personalization > Your Setup.
- **Check-In Schedule** as a standalone section — merged into Schedule & Notifications under Personalization.
- **Notifications** as a standalone section — merged into Schedule & Notifications under Personalization.
- **Processing Type** as a standalone section — absorbed into Personalization > Your Setup.
- **Breathing Pattern** as a standalone section — absorbed into Personalization > Your Setup.
- **Audio** as a standalone section — absorbed into Personalization > App Customization.
- **Body Scan Pace** as a standalone section — absorbed into Personalization > Your Setup.
- **Sound** as a standalone section — absorbed into Personalization > App Customization.
- **Your Logs** as a standalone section — absorbed into Data Management.

---

## What is NOT changing

- All existing logic, state, and localStorage operations — unchanged.
- All existing UI copy within each section — unchanged.
- Biometric guard still uses `isNative()`.
- Integration section content — no structural change.
- Data management delete flow — unchanged.
- All tool launchers, screen transitions, back navigation — unchanged.
- Preflight guards and copy locks — updated separately (COPY_LOCKS.md already updated for Focus Check location).

---

## COPY_LOCKS.md change already made

Structural Lock #10 updated:
> "Focus Check action launches from Home (`Quick Check`) and Settings > More (`Run Focus Check (30s)` · *"Quick signal on focus, inhibition, and response control."*)."

---

*Confirm this spec before any App.jsx changes.*
