# STILLFORM MASTER TODO
**ARA Embers LLC · April 27, 2026**

---

## 🚨 ARCHITECTURAL — Decide Before TestFlight

### Body-first metacognition access gap
**The problem:** Body-first calibration currently routes the hero CTA into Breathe by default. Body work is the entry, Reframe is a follow-on. But Stillform is a composure practice, and composure requires both somatic regulation AND metacognition. A body-first user whose state is already regulated (no body tension, no off-baseline) and who needs to think something through has no direct path to Reframe — they're forced through Breathe first.

The dead-code Stuck routing at line 12199 was the planned bridge (body-first + Stuck chip → Reframe clarity), but it's broken because:
1. `feelState` is declared inside each tool, not at App level — the check at line 12199 always evaluates `undefined === "stuck"` → false
2. Even if fixed, the Stuck chip currently only exists inside Reframe, so a user on home has no way to set it before tapping the hero CTA — chicken-and-egg

**Three options to decide between:**
- **(a)** Secondary CTA on body-first home: a small "Just need to think this through →" link below the main Breathe CTA, routes directly to Reframe calm
- **(b)** Add chip row to home screen so users self-select state before tool entry. Stuck routes to Reframe, others route to default
- **(c)** Make hero CTA conditional: if bio-filter is "clear" (body baseline) AND user taps an "I want to process" affordance, route to Reframe; otherwise Breathe

This needs a design decision from Arlin. All three are defensible. Option (a) is the smallest surgical change. Option (b) is the most data-rich. Option (c) is the most automatic.

---

## ⚠️ TESTFLIGHT-BLOCKING — Audit Findings (April 27, 2026)

- [ ] **AI conversation persistence — IndexedDB encrypted overflow** (`App.jsx:4984, 4997`). When `secureSet` to localStorage fails (quota or encryption error), conversation is silently lost. Fix: fall through to encrypted IndexedDB write using same AES-GCM device key. IndexedDB has ~50% disk quota (gigabytes) vs localStorage's 5–10MB. Encryption never compromised. Read path checks both. Plus proactive pruning when localStorage hits ~80% capacity (prune orphaned old data, never active conversations). The infrastructure is already in place — `CryptoStore` at line 4555 already uses IndexedDB for the device key, just need to extend it to data overflow.
- [ ] **Cloud sync batching** (`App.jsx:4404`). `sbSyncUp` currently sends ~34 sequential HTTP requests. On flaky cellular this means partial syncs with no retry. Fix: batch into single POST with array body — Supabase REST supports it via `?on_conflict=user_id,data_key` with array payload.
- [ ] **Stuck dead-branch cleanup at hero CTA** (`App.jsx:12199`). Delete the `if (feelState === "stuck")` branch — `feelState` is out of scope at App level, the check never fires. **Important:** the chip itself stays untouched — its data flows into journal, My Progress, AI context, and routes correctly inside Reframe via autoMode (line 4711). Only the dead App-level check is removed. Resolution of the body-first metacognition path moves to the architectural decision above.
- [ ] **Body-first override narrowing — actual science alignment** (`App.jsx` hero CTA). Currently body-first + ANY off-baseline triggers Body Scan suggestion. Per Ochsner & Gross 2005, body-first + Activated/Sleep/Depleted/Medicated should route directly to Breathe (their default IS the science answer — no override needed). Narrow to: body-first + Pain → Body Scan suggestion (Kabat-Zinn / Reiner / Farb), body-first + Off-baseline/Something → Body Scan suggestion (locate the unnamed signal), body-first + Activated/Sleep/Depleted/Medicated → straight to Breathe.
- [ ] **`routeObserveEntry` bio-filter parity** (lines 10491, 10494). Secondary entry path still routes thought signals + thought-first regType to Reframe without offBaseline check. Hero CTA got the smarts; this mirror needs them too.
- [ ] **ErrorBoundary cloud-restore + reset-and-restart** (`App.jsx:5`). On error, if signed in: trigger `sbSyncDown` first, then reload — cloud is source of truth, corrupt local gets overwritten. If not signed in: offer secondary "Reset and restart" button that clears non-critical localStorage keys (preserves regulation_type, signal_profile, bias_profile, onboarded). Log error to `stillform_last_error` with timestamp for support visibility.

---

## ⚠️ TESTFLIGHT-BLOCKING — Second Audit Pass (April 27, 2026 morning)

- [ ] **Bio-filter staleness — yesterday's hardware state silently drives today's routing.** `stillform_bio_filter` has no date guard anywhere. If a user did morning check-in Monday with bio_filter="activated", Tuesday's hero CTA still reads "activated" until they re-check-in. Affects: hero CTA routing, AI context, override suggestions. Fix: introduce `getActiveBioFilter()` helper that returns "" when `stillform_checkin_today.date !== getStillformToday()`, and replace all 5 raw read sites (lines 6077, 6624, 10641, 12167, 5256). Real correctness bug — yesterday's state shouldn't drive today's routing.
- [ ] **Three remaining UTC date sites** my earlier date-alignment commit missed. Lines 5109 (journal write — auto-logged feelState entries get UTC dates), 5160 (journal context filter — "today" computed in UTC), 5205 (eodContext "yesterday" computed in UTC, but `eod.date` is now stored in local time, so the comparison breaks near midnight UTC and yesterday's close never gets surfaced to AI). All three use `new Date().toISOString().split("T")[0]` pattern — same as the 15 I migrated, just used `.split("T")[0]` instead of `.slice(0,10)` so my regex missed them. Fix: migrate to local-time via existing `toLocalDateKey()` and `getStillformToday()` helpers.

---

## 🟡 REDDIT-BLOCKING — Existing Prelaunch List

- [ ] Resolve body-first metacognition gap (architectural decision above) — must land before launch positioning
- [ ] Add Disconnected chip — hypoarousal state, Body Scan first, feelMap entry in `reframe.js`
- [ ] Onboarding redesign — 2 intro pages max, calibration, interactive first-use walkthrough
- [ ] Language preferences in Settings — needed for global launch, currently no user-facing language selector exists in code (only auto-locale detection for crisis region routing at line 8913)
- [ ] 3–5 real testimonials
- [ ] Reddit launch post — r/ADHD, r/neurodivergent, r/anxiety, r/cptsd, r/BPD (do not post before stores are live)

---

## 📝 POST-LAUNCH — Noted, Not Blocking

- [ ] **AI prompt framing — "metacognition" never appears.** Stillform is positioned in `reframe.js` as "composure tool / stabilizer / companion" — never as a metacognition tool. The architectural truth is that this IS a metacognition tool that produces composure. Composure is the user-facing outcome word, but the AI prompts never make the metacognition core explicit, which may dilute the AI's behavior in subtle ways. Decide whether to weave "metacognition" into the system prompts so the model treats every interaction as metacognitive scaffolding, not just emotional support.
- [ ] **AI prompt "not therapy" framing** (`reframe.js:904, 925, 998`). Three places where prompts use negation framing ("NOT therapy homework," "not a therapy session"). Per Stillform's product principle: "Never define it by what it isn't." These are AI tone instructions (operational), not user-facing copy, but technically violate the rule. Either accept the operational use or rewrite as positive instructions ("Tight, direct, confident — pre-game language" instead of "not therapy").
- [ ] **"Add state to statement" / "What Shifted" label inconsistency** (`App.jsx:5757, 5768, 5778`). Same screen has both names. Header says "What Shifted", buttons say "Add state to statement" / "Hide state to statement", expanded section header says "State-to-Statement (optional)". They're slightly different concepts (What Shifted = internal observation, State-to-Statement = external message conversion) but the names should make that clearer. Recommend: rename buttons to "Convert to message" / "Hide message draft" and section header to "Make it sendable".
- [ ] **Subscription URL param trust window** (`App.jsx:8869`). `?subscribed=true` URL param sets local subscribed=yes immediately on page load — server reconciliation happens via `sbCheckSubscriptionStatus` within ~20-min grace period. A bad actor could append the param and have full access until the grace window closes. Acceptable design (handles webhook lag) but worth flagging. Stronger fix: signed query param from Lemon Squeezy redirect.
- [ ] **Stale "OBSERVE AND CHOOSE" comment** (`App.jsx:6014`). Cosmetic — internal comment uses old name (renamed to Self Mode in completed work). One-word fix.
- [ ] **AI payload size cap** (`App.jsx:5253–5340`). `signalProfile`, `biasProfile`, `priorToolContext`, `priorModeContext`, `sessionNotes` all bundle into every Reframe request with no size cap. The 2000-char input cap is good but doesn't bound the context payload. For a heavy user 6+ months in this could hit token limits or get expensive. Add per-field truncation with most-recent-first selection.
- [ ] **useEffect cleanup audit** — 47 useEffects, 18 cleanup returns. Possible timer/listener leaks. Post-launch sweep, not urgent.
- [ ] **Chip touch target sizes** — currently ~28px tall, iOS HIG recommends 44px. Adult users won't notice; an accessibility audit would flag it.
- [ ] **DST manual test** — `getStillformToday()` uses local Date so it should handle DST correctly, but worth one manual test on a DST night to confirm date guards behave.
- [ ] **Cloud-corruption edge case for ErrorBoundary** — if corruption got synced up before error fires, `sbSyncDown` pulls it back. Cover via `backups` table restore (the three-table schema already includes pre-update backups). Not blocking — covers <5% of error scenarios.
- [ ] **GitHub PAT rotation** — scope `repo` only, 90-day expiry, revoke old. Low practical risk per Arlin (separate identity, no overlap with Claude account).

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
- [ ] Reddit launch post (do not post before stores are live)

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
- [x] Stuck chip — pre and post session chips, routes to Reframe clarity (in-Reframe routing works; hero-CTA bridge is dead and pending architectural decision above)
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
