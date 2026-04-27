# STILLFORM MASTER TODO
**ARA Embers LLC · April 27, 2026**

---

## 🚨 ARCHITECTURAL — Decide Before TestFlight

### Body-first metacognition access gap
**The problem:** Body-first calibration currently routes the hero CTA into Breathe by default. Body work is the entry, Reframe is a follow-on. But Stillform is a metacognition tool that architects composure — composure requires both somatic regulation AND metacognition. A body-first user whose state is already regulated (no body tension, no off-baseline) and who needs to think something through has no direct path to Reframe — they're forced through Breathe first.

The dead-code Stuck routing at `App.jsx:12199` was the planned bridge (body-first + Stuck chip → Reframe clarity), but it's broken because:
1. `feelState` is declared inside each tool component, not at App level — the check at line 12199 always evaluates `undefined === "stuck"` → false
2. Even if the scope were fixed, the Stuck chip currently only exists *inside* Reframe, so a user on home has no way to set it before tapping the hero CTA — chicken-and-egg

**Three options to decide between:**
- **(a)** Secondary CTA on body-first home: a small "Just need to think this through →" link below the main Breathe CTA, routes directly to Reframe calm
- **(b)** Add chip row to home screen so users self-select state before tool entry. Stuck routes to Reframe, others route to default
- **(c)** Make hero CTA conditional: if bio-filter is "clear" (body baseline) AND user taps an "I want to process" affordance, route to Reframe; otherwise Breathe

This needs a design decision from Arlin. All three are defensible. Option (a) is the smallest surgical change. Option (b) is the most data-rich. Option (c) is the most automatic.

---

## ⚠️ TESTFLIGHT-BLOCKING — Recommended Order

Items tackled in this sequence build on each other and minimize risk. Each item gets reviewed and signed off before the next is touched.

### Sequence 1 — Quick wins (low risk, build momentum)
1. ~~Stale `OBSERVE AND CHOOSE` comment cleanup~~ — **DONE Apr 27.** Comment renamed to `Self Mode nudge` at line 6217 (current internal name).
2. ~~Three remaining UTC date sites~~ — **DONE Apr 27.** Resolved by TimeKeeper rollout (Phases 2-4 covered all 17 broken sites including these three plus the streak counter and 13 others).

### Sequence 2 — Real bugs that affect routing
3. ~~Bio-filter staleness~~ — **DONE Apr 27.** Schema migration (rather than the simpler check-in proxy) — bio-filter now stores its own date stamp `{value, date}`, getActiveBioFilter() returns "" when date doesn't match today's Stillform-day. 5 reads + 4 writes migrated. Handles both morning-check-in path and Reframe-direct path. Legacy plain-string values treated as expired (one-day blip for existing users, then everyone on new schema).
4. ~~Body-first override narrowing~~ — **DONE Apr 27.** New `shouldBodyRouteToScan(bioFilter)` helper. Three sites narrowed (hero CTA body-first branch + routeObserveEntry priority 1 + routeObserveEntry understand branch). Pain/Off-baseline/Something → Body Scan suggestion; Activated/Sleep/Depleted/Medicated → straight to Breathe (Ochsner & Gross 2005). Removes Body Scan friction for states where breathing IS the science answer.
5. ~~`routeObserveEntry` bio-filter parity~~ — **DONE Apr 27.** Three understand-branch paths brought into parity with hero CTA: thought-signal, unsure+thought-first regType, and unsure+body-first regType. Each now applies the offBaseline narrowing (Pain → Scan, other off-baseline → Breathe for thought paths; shouldBodyRouteToScan for body paths). User who's activated and goes through Observe Entry no longer gets routed to Reframe before regulating.

### Sequence 3 — Architectural decision + dead code
6. ~~Body-first metacognition access gap~~ — **VERIFIED ALREADY IMPLEMENTED Apr 27.** Initial review missed that the metacognition route is built into the existing pathway flow. Body-first user goes Pre-rate → Bio-filter → Breathe → Post-rate → Ground, and the grounding-complete screen has "Continue to Reframe →" as the PRIMARY CTA (line 3094, button className btn-primary). Post-rate screen also has "Skip to Reframe instead" escape hatch (line 3471) for users who want metacognition without the full grounding step. Body Scan auto-routes to reframe-calm after completion (line 3834). PresentStateChips component captures feel-state in BreatheGroundTool with the same chips as Reframe entry (line 3229, comment: "same chips as Reframe entry, data parity for body-first users"). Body-first users land on Breathe (science-aligned), are offered Reframe as the next step (metacognition route preserved), and their state is captured identically to thought-first users so the AI has the same context. Nothing to build. Going forward: read the existing flow before claiming a gap.
7. ~~Stuck dead-branch cleanup at hero CTA~~ — **DONE Apr 27.** `if (feelState === "stuck")` at line 12418 removed. The variable was undefined at App scope (declared only inside ReframeTool/ScanTool/MorningCheckIn), AND the Stuck chip never existed on home (only inside Reframe), so the branch was guaranteed dead. Body-first user still has full Reframe access via the tool grid and post-Breathe flow. Live `feelState === "stuck"` check at line 4910 inside ReframeTool's autoMode preserved untouched — that one is reachable and working correctly when a user inside Reframe selects Stuck.

### Sequence 4 — Resilience (medium-effort, important)
8. ~~ErrorBoundary error logging via App Diagnostics~~ — **DONE Apr 27 (revised).** Initial implementation overshot: built cloud-restore button and calibration-preserving reset path, both of which duplicated existing infrastructure (Settings has Restore now and Delete all data; Reframe has Start fresh). Reverted UI to original single-button form. Kept ONE addition: componentDidCatch writes the most-recent crash to stillform_last_error (timestamp, message, truncated stack, component stack). buildPerformanceMetricsSnapshot reads it as last_crash and includes in the existing daily diagnostics push. After successful send, the key is cleared. Crashes now ride the opt-in metrics-ingest pipeline the user already controls. Real reuse of existing infrastructure, not new layers. Sequence 4 — Resilience pillar — complete.
9. ~~AI conversation persistence — IndexedDB encrypted overflow~~ — **DONE Apr 27.** New `SecureStore` IndexedDB module (storage layer only — encryption still happens in secureSet/secureGet via existing CryptoStore). secureSet tries localStorage first, falls through to IndexedDB on quota/error. secureGet checks localStorage first, then IndexedDB. Same AES-GCM encryption either way. localStorage success path also clears any stale IndexedDB copy for the key to keep reads consistent. Diagnostics marker written to sessionStorage if both stores fail (rare). Zero call site changes — three existing call sites in ReframeTool (line 5159 read, 5183 + 5196 write) work transparently. Conversation preserved through localStorage quota overflow.
10. ~~Cloud sync batching~~ — **DONE Apr 27.** `sbSyncUp` rewritten: encrypts all keys in parallel via Promise.all, then single batched POST to Supabase REST with array body. 34 round trips → 1. Atomic from the user's perspective — no more partial-sync silent inconsistency. No retry baked in (deliberate — keeps helper contract simple, lets call sites decide retry policy with their user-facing context). Return shape preserved; all 4 call sites verified compatible.

---

## 🟡 LAUNCH-GATING — Google Play Closed Testing → Public Launch

Launch path: Google Play closed testing → public launch. TestFlight blocked until Arlin has access to an iPhone. Reddit held in reserve as a contingency lever if the app doesn't sell itself in the first week post-launch — NOT a launch step.

**ACTIVE — work that can ship now:**

- [ ] Onboarding redesign — 2 intro pages max, calibration, interactive first-use walkthrough
- [ ] Language preferences in Settings — needed for global launch, currently no user-facing language selector exists in code (only auto-locale detection for crisis region routing at line 8913)
- [ ] AI-error → Self Mode auto-flip after 2-3 consecutive failures — per Arlin Apr 27, consider: when the AI returns an error or fails to come back online for 2-3 send attempts in a row, automatically flip the user into the existing Self Mode (`runSelfGuidedFallback` + `selfGuidedActive`) for the rest of the session. Right now the user gets the self-guided card per-attempt; this would persist it once the threshold is hit so they get a steady experience instead of repeatedly hitting timeouts. Existing infrastructure handles the per-message case at App.jsx:5805. Pre-launch consideration — not gating but worth thinking through.
- [ ] Google Play Console setup ($25 one-time) — required for closed testing track, 14-day clock before public launch can begin. Build the Android App Bundle from existing Capacitor android/ project.

**BLOCKED — pending hardware/access:**

- [ ] TestFlight build + tester invites — Apple Developer Program is paid, but BLOCKED on Arlin acquiring iPhone access for build testing. Pick up after Google Play track is established.

## 📡 CONTINGENCY — If App Doesn't Sell Itself Week 1

- [ ] Reddit launch post — r/ADHD, r/neurodivergent, r/anxiety, r/cptsd, r/BPD. Held in reserve, not a launch step. Only deploy if organic post-launch traction is weak.

---

## 📝 POST-LAUNCH — Noted, Not Blocking

- [ ] **Service worker disabled in production** (`index.html`). The current index.html actively unregisters all service workers and clears caches on every page load — `sw.js` exists in `/public` but is never used. Impact: no offline support beyond the in-app self-guided fallback, no asset caching for repeat visits, weak PWA install experience on mobile. Likely intentional during UAT (avoiding stale-cache bugs) but should be re-enabled before public launch so the offline fallback feature has cached assets to work with. Decision needed: keep disabled or re-enable + set up proper cache invalidation.
- [ ] **ARIA labels minimal across the app** — only 6 `aria-label` / `aria-labelledby` / `role=` attributes across 14,680 lines. Screen reader users would struggle. App Store accessibility audits could flag this. Not blocking launch but needs a sweep on chips, info buttons, and tool entries.
- [ ] **IndexedDB device key not cleared on delete-all-data** (`App.jsx:14538`). The "Delete all data" flow clears all `stillform_*` localStorage keys and Supabase cloud data, but the AES-GCM device key in IndexedDB (`stillform_keys` DB) persists. Practically harmless (cloud data is gone, so nothing to decrypt) but for forensic deletion completeness, add `CryptoStore.deleteKey()` to the wipe.
- [ ] **AI prompt framing — "metacognition" never appears.** Stillform is positioned in `reframe.js` as "composure tool / stabilizer / companion" — never as a metacognition tool. The architectural truth is that this IS a metacognition tool that produces composure. Composure is the user-facing outcome word, but the AI prompts never make the metacognition core explicit, which may dilute the AI's behavior in subtle ways. Decide whether to weave "metacognition" into the system prompts so the model treats every interaction as metacognitive scaffolding, not just emotional support.
- [ ] **AI prompt "not therapy" framing** (`reframe.js:904, 925, 998`). Three places use negation framing ("NOT therapy homework," "not a therapy session"). Per Stillform's product principle: "Never define it by what it isn't." These are AI tone instructions (operational), not user-facing copy, but technically violate the rule. Either accept the operational use or rewrite as positive instructions ("Tight, direct, confident — pre-game language" instead of "not therapy").
- [ ] **"Add state to statement" / "What Shifted" label inconsistency** (`App.jsx:5757, 5768, 5778`). Same screen has both names. Header says "What Shifted", buttons say "Add state to statement" / "Hide state to statement", expanded section header says "State-to-Statement (optional)". They're slightly different concepts (What Shifted = internal observation, State-to-Statement = external message conversion) but the names should make that clearer. Recommend: rename buttons to "Convert to message" / "Hide message draft" and section header to "Make it sendable".
- [ ] **Subscription URL param trust window** (`App.jsx:8869`). `?subscribed=true` URL param sets local subscribed=yes immediately on page load — server reconciliation happens via `sbCheckSubscriptionStatus` within ~20-min grace period. A bad actor could append the param and have full access until the grace window closes. Acceptable design (handles webhook lag) but worth flagging. Stronger fix: signed query param from Lemon Squeezy redirect.
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

- [x] **Disconnected/Distant chip** — added "Distant" chip to both chip arrays (post-rate feelChips at App.jsx:6202 and PresentStateChips at App.jsx:7176). New `useEffect` in ReframeTool watches feelState — when "distant" is selected, routes to Body Scan via `onComplete("scan")`. Per Porges 2011 polyvagal + Siegel 1999 window of tolerance: hypoarousal is below the window, prefrontal cortex offline, verbal reframing has limited reach until somatic re-engagement. Body Scan is the science answer, not Reframe. The chip overrides calibration (both processing types route the same way) because the science is calibration-agnostic at this state. feelMap entry added to reframe.js with science-grounded AI prompt for cases where user lands back in Reframe after Body Scan: short sentences, concrete language, body-and-room grounding, no abstraction, no "how does that make you feel" (feeling access is what's offline). scoreState left untouched — Distant returns null same as Stuck because hypoarousal is off the reactive↔composed dial. Data layer inherits everything automatically: session records, Pulse journal auto-write, My Progress emotion frequency, CSV export.
- [x] **ErrorBoundary cleanup + App Diagnostics integration** — Reverted earlier-in-day overshoot (cloud-restore path, calibration-preserving reset, three-button decision UI) since all duplicated existing infrastructure (Settings → Restore now / Delete all data; Reframe → Start fresh). Boundary back to original single-button form with original copy. KEPT one addition: componentDidCatch persists last crash to `stillform_last_error`. `buildPerformanceMetricsSnapshot` now reads it and includes as `last_crash` field in the existing opt-in daily metrics push to `/.netlify/functions/metrics-ingest`. After successful send, key is cleared so no duplicate crash reports. Crashes ride the diagnostics flow the user has already opted into — no new pipeline, no new permission grant. Also removed 4 dead TimeKeeper methods (clockYesterday, nowMs, nowIso, formatForUser — never called). Net: ~118 lines lighter.
- [x] **ErrorBoundary cloud-restore + reset-and-restart** — ErrorBoundary class rewritten with three paths. Signed-in users see primary "Restore from cloud" button → navigates to `/?restore=1` → App component detects flag, sets `restoring` state, splash subtitle changes to "Restoring your data…" until existing `sbSyncDown` completes, flag stripped from URL via `history.replaceState`. All users get "Reset and restart" → clears all `stillform_*` keys except calibration (`onboarded`, `regulation_type`, `signal_profile`, `bias_profile`, `morning_start`) and auth (`sb_session`) — user keeps setup, doesn't have to re-log-in. Every error logs to `stillform_last_error` (timestamp + message + truncated stack + component stack) for support visibility. Double-reset guard: 60-second cooldown surfaces support email instead of looping. Final Sequence 4 item — Resilience pillar complete.
- [x] **Cloud sync batching** — `sbSyncUp` rewritten as a single batched POST. Encryption parallelized via `Promise.all` over `SYNC_KEYS` (35 keys, independent per-key, parallel-safe). Single `POST /rest/v1/user_data?on_conflict=user_id,data_key` with array body, native Supabase REST upsert. 34 sequential round trips → 1. Atomic from the user's perspective — either all rows landed or none, no partial-sync silent inconsistency. Empty/null-keyed rows still skipped before batching. UNENCRYPTED_SYNC_KEYS distinction still applied per-key. Return shape `{ok, uploaded, errors}` preserved; all 4 call sites verified compatible (Settings manual sync button reads `r.ok`/`r.uploaded`/`r.errors?.length`, all preserved). No retry baked into the helper — deliberate architectural choice to keep helper contract simple and let call sites decide retry policy with their user-facing context (manual button vs auto-sync after Reframe vs background tab — all want different responses).
- [x] **AI conversation persistence — IndexedDB encrypted overflow** — new `SecureStore` IndexedDB module wraps a single object store (`secure_data`). `secureSet` now tries localStorage first, falls through to IndexedDB on quota/throw; `secureGet` checks localStorage first then IndexedDB. Same AES-GCM encryption applied before either store path. When localStorage write succeeds, stale IndexedDB copy for that key is cleared to keep reads consistent. If both stores fail, a non-blocking timestamp marker is written to sessionStorage for diagnostic visibility. Zero call site changes — ReframeTool's three persistence touchpoints (load on mount, save on Done-for-now, save on every message) work transparently. Conversations no longer silently lost on long Reframe threads or low-storage devices.
- [x] **Body-first metacognition gap — verified already implemented.** Re-checked the existing BreatheGroundTool flow after Arlin pushed back on the initial "no real gap" reading. Found: grounding-complete screen has "Continue to Reframe →" as PRIMARY CTA (line 3094), post-rate has "Skip to Reframe" escape hatch (line 3471), Body Scan auto-routes to reframe-calm (line 3834), feel-state chips already captured in Breathe with deliberate "data parity for body-first users" framing (line 3229). Initial reading was wrong; pathway flow already routes body-first users into metacognition cleanly. Not closed-without-action, just already-built.
- [x] **Stuck dead-branch cleanup + stale comment fix** — `if (feelState === "stuck")` removed at hero CTA body-first branch (line 12418). Variable was undefined at that scope and Stuck chip didn't exist on home anyway. Live ReframeTool autoMode check preserved. Stale `OBSERVE AND CHOOSE` comment also renamed to current `Self Mode nudge` name (line 6217).
- [x] **routeObserveEntry bio-filter parity** — three understand-branch paths brought into parity with hero CTA: thought-signal, unsure+thought-first regType, and unsure+body-first regType. Each applies the offBaseline narrowing (Pain → Scan, other off-baseline → Breathe; shouldBodyRouteToScan for body paths). Activated user going through Observe Entry no longer routes to Reframe without regulating first.
- [x] **Body-first override narrowing** — `shouldBodyRouteToScan(bioFilter)` helper added; 3 routing sites narrowed (hero CTA body-first branch, routeObserveEntry priority 1, routeObserveEntry understand branch). Pain/Off-baseline/Something route to Body Scan; Activated/Sleep/Depleted/Medicated route straight to Breathe per Ochsner & Gross 2005 (parasympathetic regulation, not body-locating). Removes a friction step for body-first users in states where breathing is the appropriate science answer.
- [x] **Bio-filter staleness fix** — schema migration to `{value, date}` shape. New `getActiveBioFilter()` / `setActiveBioFilter()` helpers gate by today's Stillform-day. Fixes routing accuracy for any user who doesn't re-check-in daily (i.e. most users on most days). 5 reads + 4 writes migrated. Affects: AI bio-filter context, win-feedback suppression, body-first routing in ObserveEntry, primary routeObserveEntry, hero CTA Body Scan override.
- [x] **TimeKeeper consolidation** — 26 direct calls to underlying date helpers migrated to TimeKeeper.* methods. Helpers renamed to `_toLocalDateKey` / `_getStillformToday` (private). 2 new preflight guards block direct external use. Codebase has ONE canonical path for date/time operations. Commit f02225bce3.
- [x] **TimeKeeper Phase 6** — 6 preflight guards added to `scripts/ship-preflight.mjs` to prevent reintroduction of broken date patterns (UTC date keys via slice/split, inline ms day arithmetic, hidden UTC extraction from timestamps). All guards verified passing. Commit 135e8355fb.
- [x] **TimeKeeper Phase 5** — Travel detection wired into AI context. `APP_LOAD_TRAVEL` runs `TimeKeeper.detectTravel()` once at module load; result piped through to Reframe AI as `travelContext` when timezone changed since last open. Server (reframe.js) destructures and pushes into context parts. Atomic commit (App.jsx + reframe.js). Commit 74d32bb41d.
- [x] **TimeKeeper Phase 4** — 5 Class C sites migrated (inline ms day arithmetic → `TimeKeeper.daysAgoMs(N)`). Sliding-window period filters: 30d/60d trends, 7d/14d patterns, 7d signal divergence. Zero behavior change. Commit 81f0678ea8.
- [x] **TimeKeeper Phase 3** — 7 Class B sites + 2 streak-loop comparisons migrated. **Streak counter now correct for all non-UTC users** (the original bug Arlin reported). Also fixes proof active days, daily aggregation for transfer score, AI transfer count, metrics dedup write/read mismatch. Commit 52cdcc1619.
- [x] **TimeKeeper Phase 2** — 3 Class A sites migrated (direct UTC date keys via `.split("T")[0]`). Auto-Pulse journal write, AI journal context filter, eodContext yesterday. Late-night journal entries now group with the practice day they belong to; AI's "today" filter aligns with entry dates; yesterday's EOD close actually surfaces. Commit 291c5334dd.
- [x] **TimeKeeper Phase 1** — Foundational module added with 12 methods. Single source of truth for all date/time operations. Wraps existing helpers; provides clockDay/stillformDay flavors, period filters, timestamps, timezone, travel detection, display formatting. Commit a6934b8cf9.
- [x] **Cleanup orphan** — `const now = new Date()` rendered unused by Phase 4's migration to TimeKeeper.daysAgoMs(). Verified zero references in scope before removal. Commit 54f1351b0b.
- [x] Bio-filter refinements — Pain detection now routes thought-first users to Body Scan instead of Breathe (Kabat-Zinn 1982 MBSR, Reiner et al. 2013, Farb et al. 2013). State-specific copy per signal — Pain reads differently than Activated, Sleep, Depleted, Medicated, Off-baseline. Day-memory keyed to (date, bioFilter snapshot) — once a user accepts or skips, their choice sticks until either the day rolls over (via `getStillformToday()`) or they update their bio-filter (which naturally creates a new memory key). Quieter visual treatment — softer border, smaller header, less interrupt-y. QB pill now available on home too (was excluded; user has instant safety valve regardless of what's showing). Commit 26feab55.
- [x] Chip parity for body-first tools — `PresentStateChips` shared component captures "What is present" (read-only morning check-in pre-fill, never overwrites the historical record) and "Anything to add?" feel chips. Added to Breathe pre-rate screen and Body Scan new intro phase. Reframe refactored to use the same shared component. Both tools' debriefs now include `feelState` so AI gets data parity for body-first users — they no longer contribute less context to the system than thought-first users. Also fixed pre-existing dead-on-click `setInfoModal` references in Breathe (lines 3026, 3182) by passing it through the props bag. Commit 6e1d8fb4.
- [x] Date/time alignment for global launch — added `getStillformToday()` helper that respects user's morning_start setting; migrated all 15 UTC date-key sites (`toISOString().slice(0,10)`) to local time; added date guards on 5 unguarded `stillform_checkin_today` reads (feelState inference, AI checkinContext, "From this morning" chips, progress dashboard, EOD save). All "is it today?" comparisons now consistent across the app. Calendar-day stamps (debrief writes, download filenames) kept as `toLocalDateKey()`. Fixes the morning-chip rollover bug. Commit 9d44050f. (Note: 3 additional sites missed in this pass — see TestFlight Sequence 1 item 2.)
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
