# STILLFORM MASTER TODO
**ARA Embers LLC · April 27, 2026**

---

## IN PROGRESS — Next Session

- [ ] Bio-filter parity in `routeObserveEntry` (line 10491, 10494) — secondary entry point still routes thought signals + thought-first regType to Reframe without offBaseline check. Hero CTA fix landed; this mirror needs the same override.
- [ ] Resolve Stuck chip routing for body-first users (what does Stuck mean for body-first?)
- [ ] Add Disconnected chip — hypoarousal state, Body Scan first, feelMap entry in reframe.js
- [ ] Onboarding redesign — 2 intro pages max, calibration, interactive first-use walkthrough
- [ ] Talk it out "From this morning" chips persist past day rollover — should clear at user's configured morning start time (default 4:30 AM, Settings override) so stale signals aren't injected when today's check-in hasn't happened yet
- [ ] CRITICAL — Date/time alignment for global launch. Two date methods mixed in App.jsx: `toLocalDateKey()` (local, correct) and `new Date().toISOString().slice(0,10)` (UTC, breaks evening hours west of UTC). 18+ call sites including check-in writes, streak counts, calendar grid, metrics, loop history. Even line 11879 writes the check-in date in UTC while every other write uses local — same field, two formats. Fix: introduce `getStillformToday()` helper that uses local time AND respects user's morning_start setting, migrate all date-key sites. Timestamps with full ISO time stay UTC (sync metadata is correct as-is).
- [ ] Language preferences missing in Settings — needed for global launch, currently no user-facing language selector exists in code (only auto-locale detection for crisis region routing at line 8913)

---

## NATIVE APP

- [ ] Android Studio setup — build signed APK
- [ ] Google Play Console — create account, fill store listing, upload APK, add 12 testers, start 14-day closed testing clock (Arlin has 5 Gmail addresses, needs 7 more)
- [ ] Xcode — archive, upload to App Store Connect
- [ ] TestFlight — invite testers
- [ ] Watch haptic breathing companion — Galaxy Watch Ultra / Wear OS (requires Android Studio)

---

## LAUNCH

- [ ] Both stores approved — flip to public
- [ ] Reddit launch post — r/ADHD, r/neurodivergent, r/anxiety, r/cptsd, r/BPD (do not post before stores are live)

---

## Completed — April 27, 2026

- [x] Bio-filter routing override — hero CTA now reroutes thought-first users to Breathe when bio-filter flags off-baseline (Ochsner & Gross 2005 alignment); body-first behavior unchanged. Commit efe6abe3.
- [x] Info buttons on every element — science-verified copy, all 24 locations
- [x] Screen 2 — Next Move 4 buttons plus lock-in statements (regulation-type personalized)
- [x] Balanced regulation type removed — calibration binary, fallbacks to thought-first
- [x] Pre-meeting notifications — 30min plus 15min, Settings toggle, time pickers
- [x] Composure Check rename (from GO/NO-GO)
- [x] Self Mode rename (from Observe and Choose)
- [x] Stuck chip — pre and post session chips, routes to Reframe clarity
- [x] FAQ rewrite — 27 questions, Stillform voice, science woven in
- [x] Calibration framed as tendency not fixed type
- [x] spiraling replaced with cycling
- [x] Composure Check description removed from screen (redundant with info button)
- [x] FocusCheckValidation function boundary restored
- [x] Security gate — all 41 checks passing

---

## Completed — Earlier Sessions

- [x] Lemon Squeezy LIVE — paywall active
- [x] Show/hide password at login
- [x] Stillform logo routes home on all screens except home
- [x] Skip and finish — copy fixed, theme color amber
- [x] Static home tip card removed
- [x] Most used tile — on My Progress home card
- [x] What Shifted (renamed from State to Statement)
- [x] Self Mode tab inside Reframe
- [x] Post-session merged screen — chips plus What Shifted plus Next Move
- [x] Calendar AI integration — references upcoming events, hard override for vague greetings
- [x] Supabase cloud sync — AES-256 encrypted, three-table schema
- [x] Biometric lock
- [x] Bio-filter expanded (Activated, Medicated states added)
- [x] Bias profiler rewritten (10 distortions)
- [x] Breathing favicon (needs polish — revisit when mobile supports animated favicons)
- [x] Apple Developer purchased ($99/yr, TestFlight unlocked)
- [x] DUNS confirmed
- [x] Security gate — 41 must-match checks
