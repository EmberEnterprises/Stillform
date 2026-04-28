# Stillform Testing Checklist

**Purpose:** Deterministic test pass before any deploy publish, before TestFlight build, before public launch. Every item is a discrete observable behavior with an expected outcome. If something doesn't match, that's a bug — no interpretation needed.

**How to use:**
1. Open `stillformapp.com` (or local dev) in a clean browser session — incognito works best for first-time-user tests
2. Have a notebook or text file open to log any item that fails
3. Work top to bottom — sections build on each other (calibration before tools, tools before progress)
4. Don't skip the "negative" checks (item should NOT do X) — those catch silent bugs
5. After each session, clear `localStorage` and refresh to test next state

**Last reviewed:** April 28, 2026

---

## SECTION 0 — First Load (clean browser, no localStorage)

- [ ] Page loads. URL shows `stillformapp.com` (or `/#home` after splash).
- [ ] Splash shows "Stillform" then subtitle "Composure architecture" then fades.
- [ ] After splash, lands on Tutorial (NOT home — first-run users see tutorial).
- [ ] Tutorial card 1 of 4 visible: opening lock copy `Stillform. Composure Architecture.`
- [ ] "Next →" button advances through cards.
- [ ] Tutorial card 2 of 4: "Composure Check — Time to First Value".
- [ ] Tutorial card 2 contains the embedded Composure Check (auto-starts a 30-trial Go/No-Go).
- [ ] Tap "GO" trials within 1s → trial advances. Don't tap on "NO-GO" → trial advances after 1s.
- [ ] After 30 trials, "Post-Check Briefing" card appears with three metrics.
- [ ] Tutorial card 3 of 4 advances next.
- [ ] Tutorial card 4 of 4 final card has FAQ guidance footer: "If you want to know more about the app, please go to our FAQ page."
- [ ] Final "Continue →" button on card 4 routes to setup-bridge.

**If any of the above fails, STOP. Tutorial is the first-impression and must work before testing further.**

---

## SECTION 1 — Calibration (Setup Bridge)

- [ ] Setup bridge step 0 visible. Hash should be `#setup-bridge-0`.
- [ ] "Map signals now →" button. Tap → enters Signal Map Tool.
- [ ] Signal Map Tool: select 1+ body areas where intensity activates first. Tap "Continue".
- [ ] Returns to setup-bridge step 0. Button now reads "Update signal mapping →" (already configured).
- [ ] "Continue to calibration →" button. Tap → enters Pattern Check (bias profiler).
- [ ] Pattern Check: 5-scenario assessment. Each scenario has multiple options. Select for each.
- [ ] After completion, returns to setup. Calibration result visible (thought-first or body-first).
- [ ] "Done. Start the day. →" button. Tap → routes to home.
- [ ] URL is now `#home`.
- [ ] localStorage `stillform_onboarded` = "yes".
- [ ] localStorage `stillform_regulation_type` = "thought-first" OR "body-first" (never "balanced", never null).

---

## SECTION 2 — Home Screen (returning user, no bio-filter active)

### Top nav
- [ ] "Stillform" wordmark visible top-left.
- [ ] "?" (FAQ) icon button — tap opens FAQ screen, "← Back" returns.
- [ ] Settings cog icon — tap opens Settings, "← Back" returns.
- [ ] "Subscribe" button visible top-right (or "Subscribed ✓" if subscribed).

### Greeting + tip
- [ ] Time-aware greeting visible (Good morning / afternoon / evening + name if set).
- [ ] If first-time-on-home: contextual tip card visible. Dismissible. Once dismissed, doesn't return on next page load.

### Morning check-in card
- [ ] "Morning check-in" card visible with ⓘ button.
- [ ] ⓘ tap opens info modal titled "Morning check-in" with science-backed body. Modal close (×) returns to home.
- [ ] If not yet checked in today: card prompts to check in. Tap → enters check-in flow.
- [ ] Check-in flow: outcome chooser (Sharp / Composed / Recover) appears with ⓘ titled "Why choose your outcome?" — Gollwitzer + MCII citation.
- [ ] Selecting an outcome stores `stillform_outcome_focus` for today only (clears next day).
- [ ] After check-in completes: card collapses to "✓ Done for today" or similar quiet state.

### Hero CTA
**Body-first user:**
- [ ] Subtitle reads `Settle the body. Then think.` with inline ⓘ titled "Why body first?".
- [ ] Hero button label `Calm my body` with subtitle `Start where the pressure lands.`
- [ ] Tap → routes directly to Breathe (no intermediate screen).
- [ ] When bio-filter is active and matches body-routing rule (Pain / Off-baseline / Something): bio-filter suggestion card replaces hero button. Two buttons: accept (route to Body Scan) and skip (route to Breathe). Choice persists for the day.

**Thought-first user:**
- [ ] Subtitle reads `Think clearly. Then settle.` with inline ⓘ titled "Why thought first?".
- [ ] Hero button label `Talk it out` with subtitle `Start with what the mind is doing.`
- [ ] Tap → routes directly to Reframe (calm mode).
- [ ] When bio-filter is off-baseline: bio-filter suggestion card replaces hero button. Pain → Body Scan suggestion. Other off-baseline → Breathe suggestion.

**Both types:**
- [ ] Only ONE ⓘ visible in hero card area (no orphan duplicate).
- [ ] No bio-filter suggestion appears if bio-filter is empty (no morning check-in done) or bio-filter is "all clear".

### Close The Loop card
- [ ] Visible if morning check-in done. Reads `Closed · tap to update` (if loop closed) or prompt to close.
- [ ] Tap → enters EOD close flow.

### My Progress section
- [ ] Title "My Progress" with chevron expand/collapse + pin icon.
- [ ] Pin icon toggles persistence — pinned state survives reload.
- [ ] When expanded: stats grid visible (Sessions / Day Streak / Reframe Most Used).
- [ ] Each stat has its own ⓘ:
  - "Sessions" ⓘ → modal titled "Sessions"
  - "Day Streak" ⓘ → modal titled "Day Streak"
  - "Most Used" ⓘ → modal titled "Most Used"
- [ ] "OPEN FULL MY PROGRESS →" button — tap routes to full Progress screen.

### Bottom of home
- [ ] "Composure Check" small text button — tap routes to focus-check screen. Hash becomes `#focus-check`.
- [ ] ⓘ next to it opens modal titled "Composure Check".
- [ ] Quick Breathe pill (◎ Quick Breathe) visible somewhere on screen. Draggable. Position persists across reload.
- [ ] Tap (no drag) → routes to PanicMode screen (Quick Breathe panic protocol).

---

## SECTION 3 — Bio-Filter (called from in-tool entry, not home directly)

When user opens any tool (Breathe / Body Scan / Reframe) and bio-filter prompt fires:
- [ ] "What is your hardware doing right now?" visible.
- [ ] Six options: All clear / Activated / Depleted / Pain / Sleep deprived / Medicated / Off-baseline / Something.
- [ ] ⓘ titled "Why the bio-filter?" with Mason / Damasio / Craig interoception citation.
- [ ] Selection stores `stillform_bio_filter` as `{value, date}` JSON (NOT plain string — staleness check requires date).
- [ ] After selection, routing happens automatically.
- [ ] Once chosen for the day, choice persists. Same combo same day = no re-prompt.
- [ ] Day rolls over (using stillform-day, not UTC) → bio-filter clears, prompt re-fires next time.

---

## SECTION 4 — Breathe Tool (BreatheGroundTool)

### Pre-rate phase
- [ ] PROCESSING PRIMER text visible:
  - Body-first: "Downshift physiology first; your cognition clears after the body settles."
  - Thought-first: similar processing-aware copy.
- [ ] "How steady are you?" 1–5 scale (Reactive ↔ Composed). Tap captures `preRating`.
- [ ] WHAT IS PRESENT chip row: Excited / Focused / Anxious / Angry / Flat / Distant / Mixed / Stuck. ⓘ titled "Why name your state?".
- [ ] Selecting a chip captures `feelState`. AI gets this in context.
- [ ] **DISTANT chip behavior:** selecting Distant fires `useEffect` → routes to Body Scan via `onComplete("scan")`. Per Porges polyvagal hypoarousal science.
- [ ] "Continue →" button (or auto-advance) moves to breathe phase.

### Breathing phase
- [ ] Breathing ring visible, animates phases.
- [ ] Inhale / Hold / Exhale / Hold counts visible matching selected pattern (default: 4-7-8 or whatever Settings → Breathing Pattern is set to).
- [ ] Audio cue plays IF Audio toggle is on in Settings.
- [ ] Trees graphic visible at bottom (currently fixed orange — see Open Bug #2 below).
- [ ] Glow under ring is amber (this is intentional — a warmth anchor).
- [ ] Quick Breathe pill remains accessible during breathe phase.
- [ ] After all cycles complete: routes to ground phase.

### Ground phase
- [ ] Sensory grounding prompts (5-4-3-2-1 or similar).
- [ ] Each step advances on tap.
- [ ] After completion: routes to post-rate phase.

### Post-rate phase
- [ ] "How steady are you now?" same 1–5 scale.
- [ ] "Skip to Reframe instead" escape hatch visible.
- [ ] Selection captures `postRating`. Delta calculated and shown briefly.

### Grounding-complete screen
- [ ] PRIMARY CTA: "Continue to Reframe →".
- [ ] Secondary actions: Quick Breathe again, return home.
- [ ] Tap PRIMARY CTA → enters Reframe in calm mode with body-first context preserved.

### Session save
- [ ] localStorage `stillform_sessions` array gets appended with `{timestamp, duration, durationFormatted, tools, exitPoint, source, preRating, postRating, delta, preState, postState}`.
- [ ] If signed in: cloud sync fires (non-blocking, doesn't gate UI).

---

## SECTION 5 — Body Scan Tool

- [ ] Pre-rate phase mirrors Breathe (1–5 scale + chips).
- [ ] Six acupressure points visible in sequence (LI4, GB21, etc.) with body schematic SVG.
- [ ] Each point has timed hold (default 30s, varies by Body Scan Pace setting).
- [ ] Auto-advances through all 6 points.
- [ ] "Signal cleared" completion screen.
- [ ] Auto-routes to Reframe-calm after completion (per Apr 27 implementation).
- [ ] Session saves with `tools: ["body-scan"]`.

---

## SECTION 6 — Reframe Tool

### Entry
- [ ] Tool opens with title visible (Calm / Clarity / Hype based on entry mode).
- [ ] Bio-filter prompt fires if not set today.
- [ ] PROCESSING PRIMER visible.
- [ ] PresentStateChips row visible (same chips as Breathe pre-rate).
- [ ] If selected feel state matches autoMode logic, mode adjusts:
  - excited / focused → hype
  - spiral language ("can't stop thinking", "stuck in my head", "looping") → clarity
  - everything else → calm
- [ ] Stuck chip → forces clarity mode.
- [ ] Distant chip → routes OUT to Body Scan (does not stay in Reframe).

### Conversation
- [ ] Soft-entry greeting on empty input: `Hey good to see you. How are you doing?` (LOCKED COPY).
- [ ] Type a message → "Send" button enables. Tap → message appears in conversation.
- [ ] AI response renders. Loading indicator visible during fetch.
- [ ] Conversation persists across navigating away and back (sessionStorage + IndexedDB encrypted overflow).
- [ ] Voice contract: AI never uses banned phrases (preflight enforces this list — at runtime AI has post-processing filter).
- [ ] After 1+ AI exchanges, post-rating appears at bottom.

### Post-rating + Finish flow
- [ ] "How steady are you now?" 1–5 scale.
- [ ] NEXT MOVE chips visible: Send a message / Hold a boundary / Delay your response / Let it go. ⓘ titled "Why Next Move?".
- [ ] Selecting a chip immediately reveals the Lock-in card with regulation-type personalized statement.
- [ ] Lock-in card: 20s countdown ("Take a moment with this."). After 20s, "Locked in" button enables. Tap → "✓ Locked in" confirmation.
- [ ] Lock-in card has its own ⓘ titled "Lock in" with Schön reflection-on-action citation.
- [ ] "▸ What shifted? (optional)" toggle below. Tap to expand textarea + ⓘ titled "Why one line?".
- [ ] **⨯ ⓘ next to Hide must NOT trigger the Hide collapse.** (Was a tap-through bug — verify it's now sibling-not-child.)
- [ ] Textarea expanded: "Draft one clear message you can send now." prompt with Copy / Share / Mark sent buttons.
- [ ] "Finish session" button. Tap →
  - If user already chose Next Move chip inline: skip second Next Move screen, go straight to Tool Debrief Gate.
  - If user did NOT choose inline: show NextMoveStep screen (Save next move / Skip for now).
- [ ] Tool Debrief Gate: "Lock in how you processed" with 20s countdown + radio options + "I need another pass" option. Continue button disabled until 20s elapsed AND option selected.
- [ ] After Debrief: returns home (or evening-close if entryMode === "evening").

### AI failure handling
- [ ] Disable network → send a message. First failure: amber offer card "Try Self Mode while AI's down" with two buttons (Yes → Self Mode / Stay).
- [ ] Send another message that also fails: auto-switches to Self Mode tab (does not require user choice).
- [ ] In Self Mode tab via failure: amber pill polls `/health` every 45s. When AI recovers: pill shows "AI's back. Continue here, or return." with Return → and × buttons.
- [ ] Self Mode entered DELIBERATELY (not via failure): no polling, no pill ever, even if AI fails on parallel send.
- [ ] State persists across tool close/reopen via sessionStorage `stillform_reframe_self_mode_state`.

---

## SECTION 7 — Composure Check (Focus Check Validation)

- [ ] Routes via `#focus-check` hash OR home button OR Settings button OR Tutorial card 2.
- [ ] Pre-run: "30-second Go/No-Go validation. Tap for GO. Hold on NO-GO." visible.
- [ ] "Start 30s" button. Tap → trial sequence begins.
- [ ] Each trial: "GO" or "NO-GO" label, 1s window, "Respond" button OR Spacebar/Enter.
- [ ] Trial counter: "Trial N / 30".
- [ ] After 30 trials: completion screen with three metrics: Accuracy / Inhibition / Avg RT.
- [ ] If prior run exists: "Delta vs prior" line shows accuracy/inhibition deltas.
- [ ] localStorage `stillform_focus_check_history` array gets appended (capped at 20 entries).
- [ ] Plausible event "Focus Check Completed" fires.
- [ ] "← Back" returns to whichever screen called focus-check (home, settings, etc.).

**Crash regression test:**
- [ ] Composure Check loads without "Something went wrong" error (was undefined-component bug).
- [ ] After completing Composure Check, opening My Progress doesn't crash (was undefined helper bug).

---

## SECTION 8 — Quick Breathe / Panic Mode

- [ ] Quick Breathe pill tap → routes to panic screen (`screen === "panic"`).
- [ ] PanicMode screen renders (NOT "Something went wrong" — was undefined-component bug).
- [ ] Auto-starts breathing immediately, no decisions required.
- [ ] Cycle counter visible ("X of N").
- [ ] After completion: returns home.
- [ ] Session saves with `source: "panic"` or similar.

---

## SECTION 9 — My Progress

- [ ] Routes via home "OPEN FULL MY PROGRESS →" or `#progress` hash.
- [ ] Loads without crash (was undefined helper bug — verify once more).
- [ ] Top: stats grid (sessions, days, etc.)
- [ ] Proof snapshot section: Acute shift rate (30d), Recovery speed, Transfer score (14d), Lock-in Rate, Check-in consistency.
- [ ] Each stat has ⓘ where applicable (Avg Shift, Lock-in Rate at minimum).
- [ ] Sessions list visible. Each entry: timestamp, tool, pre/post ratings, delta.
- [ ] Tap a session entry → opens detail view.
- [ ] Bottom: Shareable composure card with PDF export.
- [ ] CSV / PDF export buttons fire Plausible events.

---

## SECTION 10 — Settings

- [ ] Routes via home cog icon or `#settings`.
- [ ] FAQ card at top (Settings FAQ top card placement).
- [ ] Collapsible sections, all start collapsed:
  - **Theme** — 6 options (Dark / Midnight / Suede / Teal / Rose / Light). Tap one → theme applies immediately. CSS variables update on `document.documentElement`. Persists across reload.
  - **AI Reframe Tone** — tone options visible.
  - **Language** — "English ✓ Active" card. "Request a language" button → mailto `ARAembersllc@proton.me`. NO actual language picker yet (translation work post-launch).
  - **Display** — high contrast toggle, screenlight, reduced motion, visual grounding toggles.
  - **Audio** — breathing audio on/off.
  - **Sound** — sound type / pack.
  - **Processing Type** — current shows "thought-first" or "body-first". "Re-run calibration" button.
  - **Breathing Pattern** — picker with 4-7-8, 4-4-4-4 box, etc.
  - **Body Scan Pace** — Fast / Standard / Slow.
  - **Signal Mapping** — re-enter signal map flow.
  - **Schedule & Notifications** — Morning starts / Evening starts time pickers + reminder toggles + pre-meeting notification toggles (30min + 15min).
  - **Re-run calibration** — restarts setup bridge.
  - **Replay setup bridge** — replays the bridge.
  - **Subscription** — refresh status, manage, cancel info.
  - **App Diagnostics / Metrics** — opt-in toggle for performance metrics ingestion.
  - **Cloud Sync** — sign in / sign out / restore now / sync now buttons.
  - **Exports** — Pulse PDF, Session CSV.
  - **Biometric Lock** — toggle for Face ID / fingerprint.
  - **Delete all data** — destructive button at bottom. Tap → confirmation → clears all `stillform_*` keys + cloud data.

### Cloud Sync specific
- [ ] If not signed in: "Sign in / Create account" form visible. Email + password (with show/hide toggle on password).
- [ ] Wrong credentials → "Incorrect email or password. Please try again." (NOT a generic error).
- [ ] Rate limit hit → cooldown timer visible, "Wait Ns" button.
- [ ] After sign in: profile email visible. "Sync now" / "Restore now" buttons.
- [ ] "Sync now" → "Synced N items ✓" feedback.
- [ ] "Restore now" → "Restored N items from cloud ✓" feedback.

### Biometric Lock specific
- [ ] If supported: toggle works. Enabling requires immediate biometric prompt.
- [ ] Reload with lock on → splash holds until biometric clears.

---

## SECTION 11 — FAQ

- [ ] Routes via home "?" icon or `#faq`.
- [ ] 27+ questions with science-grounded answers.
- [ ] First question: "What is Stillform?" with composure-architecture answer.
- [ ] Second question: "How is this different from meditation or therapy?" — answer DOES NOT use "not therapy" framing as primary; positions Stillform as a precision regulation system.
- [ ] All questions tappable to expand/collapse.

---

## SECTION 12 — Crisis Resources

- [ ] Routes via `#crisis` hash, or footer link, or in-AI crisis trigger.
- [ ] 988 Suicide & Crisis Lifeline visible at top (US default).
- [ ] Crisis Text Line visible.
- [ ] "Other resources" collapse — tap to expand region-specific resources.
- [ ] Region routing per locale (US / UK / EU / AU / etc.).

---

## SECTION 13 — Themes (cross-cutting visual check)

For each theme (Dark / Midnight / Suede / Teal / Rose / Light):
- [ ] Settings → Theme → tap each. App re-renders without reload.
- [ ] Hero button visible and readable in all themes.
- [ ] Chips legible in all themes (selected and unselected states).
- [ ] Info modal background matches theme.
- [ ] ErrorBoundary "Something went wrong" screen uses CSS vars (var(--amber, #C8922A) etc.) — was hardcoded gold bug, now respects active theme.
- [ ] Trees graphic in Breathe — currently fixed orange (KNOWN BUG, doesn't shift with theme).

---

## SECTION 14 — Cross-cutting Behaviors

### Stillform-day rollover
- [ ] Set device clock past `morning_start` time setting (e.g., 4 AM if morning_start = 5 AM).
- [ ] Reload app — yesterday's morning check-in still considered "today" until clock crosses morning_start.
- [ ] Cross morning_start → today's chips reset, yesterday's session no longer flagged as "today" for AI context.
- [ ] DST night manual test: device crosses DST boundary → date guards behave (no double-counting, no missed days).

### Cloud sync resilience
- [ ] Signed in user. Make a journal entry. `stillform_journal` updates.
- [ ] After auto-sync (or "Sync now"): single batched POST to Supabase (NOT 34 round trips — was sync batching work).
- [ ] Sign out → sign back in on same device → "Restore now" → entries return.
- [ ] Two browsers signed in same account: change in one, "Sync now" then "Restore now" in the other → change visible.

### Pre-update auto-backup
- [ ] App version bumps in code (simulated): on next load, version check fires sbVersionCheck. Pre-update encrypted backup writes to `backups` table BEFORE app update completes. Confirm in Supabase row count.

### Travel detection
- [ ] Change device timezone. Reload app. Open Reframe.
- [ ] AI receives `travelContext` in payload (verify via Network tab).

### IndexedDB conversation overflow
- [ ] Simulate localStorage near-quota (fill with junk data). Open Reframe.
- [ ] Send 50+ messages — conversation should still persist (falls through to IndexedDB encrypted overflow).

### Plausible events
- [ ] Open Network tab. Filter for `pa-IHuJRyHrr5FleW5dE8AtB.js`.
- [ ] Tap any tool / chip / completion → corresponding event fires.
- [ ] Key events to verify at minimum:
  - `Tool Started`
  - `Session Initiated`
  - `Composure Card PDF Export`
  - `Focus Check Completed`
  - `Loop Nudge Shown` / `Loop Nudge Actioned` / `Loop Nudge Dismissed`
  - `Self Mode Offered` / `Self Mode Auto-Switch` / `Self Mode Recovery Returned`
  - `Device Locale Captured`
  - `Language Request Tapped`

---

## SECTION 15 — Subscription / Paywall

- [ ] Free trial: localStorage `stillform_trial_start` writes on first onboard.
- [ ] Trial within 7 days: full access. No paywall.
- [ ] Trial expired (manually rewind localStorage trial_start): paywall fires. Routes to `#pricing`.
- [ ] Pricing screen: $14.99/mo OR $9.99/mo annual ($119.88/yr) options.
- [ ] "Subscribe" → Lemon Squeezy checkout opens with proper redirect URL + custom params (variant, install_id, user_id).
- [ ] After successful Lemon Squeezy webhook: `stillform_subscribed` = "yes". Paywall clears.
- [ ] URL `?subscribed=true` param triggers immediate local subscribed=yes (server reconciles within 20-min grace window).
- [ ] Refresh subscription status button → fetches from `/.netlify/functions/subscription-status`.
- [ ] If subscription pending webhook: shows "PENDING WEBHOOK" diagnostic.
- [ ] Cancel: handled via Lemon Squeezy customer portal.

---

## SECTION 16 — PWA / Native

### PWA install
- [ ] Mobile browser visit: install banner visible (after some return visits).
- [ ] Install → app icon on home screen.
- [ ] Open from icon: launches in standalone mode (no browser chrome).
- [ ] Service worker currently DISABLED in production index.html (intentional during UAT — no offline support beyond in-app self-guided fallback).

### Native (Capacitor)
- [ ] iOS: Xcode build → archive → upload to App Store Connect → TestFlight invite. (Currently BLOCKED — no iPhone access.)
- [ ] Android: Android Studio build → signed APK → Google Play Console upload → 12+ closed testers → 14-day clock starts.
- [ ] Push notifications: permission request fires on first install.
- [ ] Local notifications: daily reminder schedules per Settings time picker.
- [ ] Haptics: native impact patterns on Breathe phase transitions.
- [ ] Share extension: text shared from another app routes to Reframe with prefilled input.

---

## SECTION 17 — Negative Tests (things that should NOT happen)

- [ ] App does NOT show "Something went wrong" screen on any of:
  - Tapping Composure Check
  - Tapping Quick Breathe pill
  - Opening My Progress
  - Tapping Finish Session in Reframe
  - Visual Grounding setting toggled on (FractalBreathCanvas was undefined-bug)
- [ ] Tapping Calm my body / Talk it out hero CTA always navigates somewhere (NEVER appears to do nothing). **CURRENTLY OPEN BUG #1 — diagnostic console.log shipped, awaiting runtime data.**
- [ ] Info button (ⓘ) anywhere does NOT trigger the parent toggle. (Tap-through fixed in Apr 27 commits.)
- [ ] After Reframe Finish with inline Next Move chip selected: NO second Next Move screen appears. (Duplicate fixed Apr 27.)
- [ ] First-time user does NOT land on home — lands on Tutorial.
- [ ] On any screen, tapping Stillform logo does NOT do nothing — routes home (except already on home).
- [ ] Reframe AI: NEVER uses banned phrases (voice contract). Verify by sending intentionally provocative input — response should not contain "I understand", "I hear you", etc. per voice contract.
- [ ] No console errors in browser DevTools on any normal flow.

---

## SECTION 18 — Performance / Polish

- [ ] First load to interactive: under 3 seconds on mid-range mobile.
- [ ] Splash holds at most 2.5s after page load.
- [ ] No visible layout shift after splash fade.
- [ ] Animations smooth at 60fps (breathing ring, entrain60 pulse).
- [ ] Battery: 10-minute Reframe session doesn't drain noticeably.
- [ ] No memory leaks: open/close 20 sessions in succession — no UI lag.

---

## KNOWN OPEN BUGS (do NOT mark these as fixed in this checklist)

These are documented in `Stillform_Master_Todo.md` under "OPEN — Surfaced During Apr 27 Testing" and won't be fixed by mistake-pattern testing alone:

1. **"Calm my body" hero CTA doesn't navigate** — diagnostic log shipped, awaiting runtime data via Chrome remote debug.
2. **Pre-rate flow architecture for both processing types** — needs science-grounded redesign session, not patch.
3. **Post-Reframe screen redundancy** — Next Move + Lock-in + What Shifted + Message Draft overlap conceptually. Architectural decision pending.
4. **Trees graphic theme mismatch** — fixed orange ignores active theme. Likely moot if pre-rate flow redesigns this screen.
5. **Static tip removal** — partial. Toggle still present per Arlin's prelaunch memory.
6. **Service worker disabled in production** — intentional during UAT, decision needed before public launch.

---

## RUNNING THIS CHECKLIST

**Time investment:** Full pass = ~90 minutes carefully, ~45 minutes if you know the app cold.

**Recommended cadence:**
- Before any deploy publish: Sections 0–3 + the specific area you changed.
- Before TestFlight build: full pass.
- Before public launch: full pass on web AND on each native build.
- After any bug fix: re-test the specific section + Section 17 (negative tests).

**When something fails:** Note exact reproduction steps. Screenshot if visual. Don't guess root cause — paste the failure + screenshot into next Claude session and ask for diagnosis.
