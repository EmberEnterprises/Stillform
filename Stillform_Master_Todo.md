# STILLFORM MASTER TODO
**ARA Embers LLC · April 27, 2026**

---

## IN PROGRESS — Next Session

- [ ] Bio-filter parity in `routeObserveEntry` (line 10491, 10494) — secondary entry point still routes thought signals + thought-first regType to Reframe without offBaseline check. Hero CTA fix landed; this mirror needs the same override.
- [ ] Resolve Stuck chip routing for body-first users (what does Stuck mean for body-first?)
- [ ] Add Disconnected chip — hypoarousal state, Body Scan first, feelMap entry in reframe.js
- [ ] Onboarding redesign — 2 intro pages max, calibration, interactive first-use walkthrough
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

- [x] Bio-filter refinements — Pain detection now routes thought-first users to Body Scan instead of Breathe (Kabat-Zinn 1982 MBSR, Reiner et al. 2013, Farb et al. 2013). State-specific copy per signal — Pain reads differently than Activated, Sleep, Depleted, Medicated, Off-baseline. Day-memory keyed to (date, bioFilter snapshot) — once a user accepts or skips, their choice sticks until either the day rolls over (via `getStillformToday()`) or they update their bio-filter (which naturally creates a new memory key). Quieter visual treatment — softer border, smaller header, less interrupt-y. QB pill now available on home too (was excluded; user has instant safety valve regardless of what's showing). Commit 26feab55.
- [x] Chip parity for body-first tools — `PresentStateChips` shared component captures "What is present" (read-only morning check-in pre-fill, never overwrites the historical record) and "Anything to add?" feel chips. Added to Breathe pre-rate screen and Body Scan new intro phase. Reframe refactored to use the same shared component. Both tools' debriefs now include `feelState` so AI gets data parity for body-first users — they no longer contribute less context to the system than thought-first users. Also fixed pre-existing dead-on-click `setInfoModal` references in Breathe (lines 3026, 3182) by passing it through the props bag. Commit 6e1d8fb4.
- [x] Date/time alignment for global launch — added `getStillformToday()` helper that respects user's morning_start setting; migrated all 15 UTC date-key sites (`toISOString().slice(0,10)`) to local time; added date guards on 5 unguarded `stillform_checkin_today` reads (feelState inference, AI checkinContext, "From this morning" chips, progress dashboard, EOD save). All "is it today?" comparisons now consistent across the app. Calendar-day stamps (debrief writes, download filenames) kept as `toLocalDateKey()`. Fixes the morning-chip rollover bug. Commit 9d44050f.
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
