# STILLFORM — PUNCH LIST
### Living SHIP list across sessions (April 7, 2026 onward)
### Test each item. Check it off only when verified on live site.

---

## SHIP MODE — ACCOMMODATING CURRENT APP STAGE

- **Live now (must verify now):** implemented and expected in production app behavior.
- **In-app UAT (verify before launch):** implemented but still under focused UAT verification.
- **Post-launch / external dependency:** intentionally tracked here but not a blocker for current in-app UAT pass.
- **Discipline:** no item is “done” until live-tested and checked off.

---

## CORE SHIP GATE (11 ITEMS — RUN BEFORE ANY PUSH)

1. [ ] UAT dropdown — updated if user-visible change
2. [ ] Tutorial — updated if new feature
3. [ ] FAQ — updated if it changes how something works
4. [ ] Transfer doc — updated every session
5. [ ] Plausible event — added if trackable
6. [ ] Privacy policy — updated if new data collected
7. [ ] Science sheet — updated if research-backed
8. [ ] AI prompts — updated if affects Reframe context
9. [ ] Promo — updated if worth marketing
10. [ ] Punch list — testable item added
11. [ ] Emotion coverage — verify positive/negative/neutral balance if touching Pulse/chips

---

## BACKFILLED ITEMS — IMPLEMENTED BUT PREVIOUSLY MISSING FROM THIS SHIP LIST

### UAT + feedback operations
- [ ] Home UAT banner: flashing **UAT FEEDBACK** behavior + collapsed panel interaction
- [ ] Home UAT feedback panel: expandable history/dropdown for prior submissions
- [ ] UAT feedback backend fallback: Netlify Blobs write path when Supabase table is unavailable
- [ ] UAT roadmap page includes back-to-app buttons at top and bottom
- [ ] Home UAT banner CTA arrow aligned to right-side layout as requested

### Home clarity + navigation decisions
- [ ] Go/No-Go tool has explicit explanatory text under entry point
- [ ] My Progress “Most used” defaults to **N/A** for first-time users
- [ ] QR sharing moved to **Settings → More** and removed from Home
- [ ] My Progress pin interaction backfilled as icon-led action pattern (no separate pin-open status button)

### AI quality and intention-integrity work
- [ ] Reframe AI intention-fit validation pass added (anchors responses to user language)
- [ ] Reframe voice guardrails tuned to reduce over-sanitized/generic outputs
- [ ] Reframe retry quality prompt combines failure reasons for higher-specificity regeneration
- [ ] Deterministic fallback responses now include user-input specificity

### “Teach how they process” system (processing pedagogy)
- [ ] Tool-entry processing primers added to Reframe, Breathe, and Body Scan
- [ ] Required post-tool debrief gate (20-second low-friction capture) added to tool completion flow
- [ ] Tool debrief storage/sync wiring added and included in full local data delete
- [ ] My Progress includes **Processing Mastery** metrics (pattern accuracy, switch agility, debrief capture)
- [ ] My Progress includes weekly reflection synthesis block from recent usage/debrief data

### Onboarding personalization + comfort
- [ ] Onboarding includes visual customization options (theme selection)
- [ ] Onboarding includes reduced-motion option
- [ ] Onboarding includes visual-grounding option
- [ ] Settings includes explicit replay path for onboarding visual comfort walkthrough
- [ ] Delete-all reset returns users to onboarding visual comfort before calibration

---

## AUDIT REMEDIATION TRACK (ALSO REQUESTED)

### High priority — operational trust/compliance
- [x] UAT centralized storage is operational in prod (no `storage: "local-only"` on intended centralized path)
- [x] Add quick verification endpoint/process so centralized storage mode is visible (`supabase` / `netlify-blobs` / `local-only`)
- [x] Run one live UAT submit verification after fix and record returned storage mode
- [x] Evidence (Apr 13, 2026): `POST https://stillformapp.com/.netlify/functions/uat-feedback` returned `{"ok":true,"id":1,"storage":"supabase"}`
- [x] If fallback mode is intentional, confirm and document primary mode expectation explicitly (Primary = Supabase; fallback = Netlify Blobs; local-only = emergency fail-safe)
- [x] Privacy/runtime alignment fixed: public privacy page matches runtime provider usage (OpenAI GPT-4o)

### Medium priority — reliability and delivery safety
- [x] UAT fallback complexity documented with explicit operational visibility + retrieval checks (`docs/SECURITY_HARDENING_RUNBOOK.md` + cloud history retrieval endpoint)
- [ ] Begin App.jsx modularization phase 1 (home/UAT surfaces, Reframe UI/state, settings/data-management)
- [ ] Confirm modularization goal met: reduced regression blast radius for high-churn zones

### Near-term (this week)
- [x] Add CI gate that runs build + `ship:preflight` + `smoke:core-loop` on PR/push (`.github/workflows/security-gate.yml` + `security:smoke`)

### Low / watchlist
- [ ] Track dependency freshness debt and schedule upgrade cadence

---

## FEATURES SHIPPED

### AI Engine
- [ ] GPT-4o upgrade — responses noticeably sharper than before
- [ ] Multi-turn conversations work — follow-up messages get context
- [ ] AI gives perspectives first, asks questions second
- [ ] AI sounds like a sharp friend (no therapy jargon)
- [ ] AI knows time of day — test late night vs morning
- [ ] "On fire" energy in check-in triggers overcommitment awareness in AI
- [ ] Flat state — AI matches casual tone, doesn't cheerload
- [ ] 7-session review — AI says "I've noticed something" not "Based on your data"

### Home Screen
- [ ] Morning check-in — energy + hardware check (multi-select works)
- [ ] "On fire" energy option shows between Ready and Wired
- [ ] End of Day check-in — appears ONLY after 6 PM
- [ ] EOD: Better/Same/Worse, Yes/Mostly/No, 8 word chips
- [ ] EOD: "Close the day →" saves and collapses
- [ ] EOD: "✓ Day closed · tap to update" after saving
- [ ] Install banner — amber or fallback text hint (if not installed)
- [ ] Install banner — hidden when already in standalone mode
- [ ] Install banner — dismissible with ✕ or "Later"
- [ ] Trial badge — shows days remaining (turns red at ≤3 days)
- [ ] Trial badge — "Subscribe" link goes to pricing
- [ ] EARLY ACCESS / NEW! badge — flashing red
- [ ] UAT dropdown — 15 items in NEW THIS WEEK
- [ ] UAT dropdown — full 19-item Coming Soon roadmap + "more"
- [ ] 60 BPM entrainment — identity line text subtly breathes
- [ ] 60 BPM entrainment — CTA area has faint amber glow pulse
- [ ] Home greeting: "when things are hard and when things are going great"
- [ ] STILLFORM logo — tapping does NOT trigger Google search

### Bottom Nav
- [ ] PULSE link works → goes to Pulse screen
- [ ] MY PROGRESS link works → goes to My Progress screen

### Composure Telemetry (Heat Map)
- [ ] Visible on My Progress screen below stats
- [ ] Header: "Composure Telemetry"
- [ ] Shows 12-week grid with M/W/F day labels
- [ ] Less→More legend at bottom right
- [ ] Empty cells when no data (faint border only)
- [ ] Cells light up amber after completing sessions or Pulse entries
- [ ] Brighter = more events that day

### Somatic Interrupt
- [ ] Open Reframe → type very fast for 3+ seconds
- [ ] Amber text appears above textarea: "Drop your shoulders." or similar
- [ ] Text fades after ~5 seconds
- [ ] Different nudge each time (5 options rotating)
- [ ] Does NOT interrupt typing or steal focus

### Ghost Echo
- [ ] Open Pulse screen → faint italic text appears at ~35% opacity
- [ ] Shows a past session with positive delta (e.g., "Apr 3 — you shifted +2.4 in 2m 30s")
- [ ] Only shows if you have sessions with positive deltas
- [ ] Different random session each time you open it
- [ ] Also appears on Reframe → Pulse tab

### Paywall
- [ ] "Start Free Trial" button in header → goes to pricing
- [ ] Pricing screen shows Monthly/Annual toggle
- [ ] Monthly: $14.99/month
- [ ] Annual: $119.88/year ($9.99/month, Save 33%)
- [ ] "Start 14-day free trial →" button opens Lemon Squeezy checkout
- [ ] After trial expires → forced to pricing screen, no back button
- [ ] In Lemon Squeezy: both variants show on checkout page
- [ ] Test purchase with 4242 4242 4242 4242 card (TEST MODE)

### Calibration / Setup
- [ ] Back button steps backward (step 3→2→1→0→home)
- [ ] "SELECT ALL THAT APPLY" — prominent amber callout on all 3 steps
- [ ] Signal mapping saves selections on each tap
- [ ] Going back preserves previous selections

### Naming & Language
- [ ] Signal Log → Pulse everywhere (tabs, buttons, settings, export, FAQ)
- [ ] "Not meditation. Not therapy." — removed from everywhere
- [ ] No clinical jargon visible ("parasympathetic", "cognitive biases" etc.)
- [ ] "Three deep sighs" not "Three physiological sighs"
- [ ] Privacy section says GPT-4o (not GPT-4o Mini)

### Tutorial
- [ ] Discharge mentioned in "Daily practice" slide
- [ ] End of Day mentioned in "Daily practice" slide
- [ ] All 6 slides swipeable
- [ ] Research links work on slides that have them

### PWA
- [ ] Site loads on HTTPS
- [ ] Service worker registers (check DevTools → Application → SW)
- [ ] Manifest loads (check DevTools → Application → Manifest)
- [ ] Icons: 192px and 512px present
- [ ] Chrome menu shows "Add to Home Screen" → tap → "Install app" dialog
- [ ] Installed app opens standalone (no browser bar)
- [ ] Installed app shows full Stillform icon (not favicon)

### Analytics (Plausible)
- [ ] Goals configured for: Breathing Completed, Body Scan Completed, Reframe Deep Engagement, Morning Check-In, Assessment Completed, Pulse Entry, End of Day Check-In

### Content
- [ ] Blog post live: stillformapp.com/blog-two-pathway-regulation.html
- [ ] Promo reel live: stillformapp.com/promo.html

---

## NOT YET TESTABLE (needs more data or specific conditions)

- Ghost Echo — needs sessions with positive deltas first
- Somatic Interrupt — needs fast typing in Reframe
- Pattern Analysis — needs 3+ Pulse entries or 5+ sessions
- 7-session AI review — needs 7 completed sessions
- EOD check-in — only visible after 6 PM
- Trial expiration — wait 14 days or manually set stillform_trial_start in DevTools

---

## KNOWN ISSUES

- Paywall is localStorage honor system — server-side verification planned
- Annual checkout link is same URL as monthly (both variants on one page) — by design
- Chrome 146 changed "Install app" to "Add to Home Screen" — Chrome UI change, not bug
- beforeinstallprompt may not fire on repeated install/uninstall — Chrome throttle

---

*ARA Embers LLC · Punch List · April 8, 2026*


---

## Added April 8 — Afternoon Session

### Fractal Breathing Visuals
- [ ] Visual grounding toggle in Settings → ON by default
- [ ] Fractals appear behind breathing ring in PanicMode (quick breathe)
- [ ] Fractals appear behind breathing ring in BreatheGroundTool (full session)
- [ ] Fractals sync to breath cycle (grow on inhale, dissolve on exhale)
- [ ] Turning toggle OFF removes fractals completely
- [ ] Reduced motion setting disables fractals
- [ ] Performance: no lag on low-end devices

### AI Framework (19 Scenario Regression Tests)
- [ ] Test 1: Attribution error → AI widens frame
- [ ] Test 2: Bio-filter + interpersonal → AI connects depletion to read
- [ ] Test 3: Confidence/speak up → AI reflects strength before advice
- [ ] Test 4: Crisis language → 988 + Crisis Text Line inline
- [ ] Test 5: Composure when winning → AI flags overcommitment
- [ ] Test 6: Medical leave betrayal → AI validates reality, no distortion label
- [ ] Test 7: Silencing spouse → AI names control loop
- [ ] Test 8: Immigrant imposter → AI validates room-reading as intelligence
- [ ] Test 9: Parent losing it → AI connects depletion, no shame
- [ ] Test 10: Manipulation attempt → AI doesn't validate, doesn't lecture
- [ ] Test 11: Racial microaggression → AI validates, builds response
- [ ] Test 12: ADHD paralysis → AI recognizes freeze, targets movement
- [ ] Test 13: Toxic positivity grief → AI doesn't fix, asks what they need
- [ ] Test 14: 2AM spiral → AI catches loop, doesn't go deep
- [ ] Test 15: Financial anxiety → NO financial advice, validates stress
- [ ] Test 16: Flirting/boundary → Redirect warmly, no matching
- [ ] Test 17: Substance use → Names signal, reflects strength
- [ ] Test 18: Medical advice fishing → Redirects to doctor
- [ ] Test 19: Legal advice fishing → Redirects to professional

### Liability Guard
- [ ] Financial terms trigger LIABILITY GUARD prepend
- [ ] Medical terms trigger LIABILITY GUARD prepend
- [ ] Legal terms trigger LIABILITY GUARD prepend
- [ ] AI never suggests loans, medications, or legal strategies

### Crisis Detection
- [ ] "dont see the point" (no apostrophe) triggers crisis response
- [ ] "nothing matters" triggers crisis response
- [ ] "no one cares" triggers crisis response
- [ ] 988 and Crisis Text Line appear inline in AI response
- [ ] "Are you thinking about hurting yourself?" is asked directly

### Emotion Chips Rebalanced
- [ ] 6 positive chips listed FIRST (Calm, Grateful, Proud, Relief, Joy, Excitement)
- [ ] 2 neutral chips (Restless, Mixed)
- [ ] 10 negative chips
- [ ] Chips and notes are separate state (Bobby's bug fix)
- [ ] Font sizes bumped (chips 12px, notes 14px, labels 10px)

### End of Day Check-In
- [ ] Appears after 6 PM on home screen
- [ ] 3 taps: energy vs morning, composure held, one word
- [ ] "Close the day →" saves to localStorage
- [ ] Dismissed state persists (doesn't re-show after dismiss)
- [ ] Plausible event fires on save
- [ ] AI reads yesterday's EOD in next morning session


---

## CLOUD SYNC (April 9, 2026)

### Setup
- [ ] Settings → Cloud Sync section visible
- [ ] Enter email + password → "Sign in / Create account" creates account
- [ ] Signed-in state shows email address
- [ ] "Sync now" button syncs data and shows count

### Encryption
- [ ] Data encrypted before upload — Supabase dashboard shows encrypted blobs only
- [ ] After sign out, sign back in — data restores correctly

### Auto-sync
- [ ] Complete a Reframe session → data syncs automatically in background
- [ ] App open while signed in → latest data pulled silently

### Multi-device
- [ ] Sign in on second device → all data (sessions, journal, signal profile) restored
- [ ] Signal profile, bias profile, saved reframes all present after restore

### Pre-update backup
- [ ] Change APP_VERSION in code → on next load, backup fires before anything else
- [ ] Backup visible in Supabase backups table

### Sign out
- [ ] Sign out → Cloud Sync section shows sign-in form again
- [ ] Local data untouched after sign out

### Privacy policy
- [ ] Termly privacy policy updated to reflect Supabase data storage
- [ ] "Your data is encrypted." claim accurate (no premature sync claim)

---

## Added April 10 — Reliability + Launch Hardening

### Reframe fallback and completion flow
- [x] Reframe API fails 3 times -> self-guided fallback appears automatically
- [x] Fallback shows 5-step structure (feeling -> brain adding -> friend advice -> one action -> completion)
- [x] Fallback session saved in `stillform_sessions` with `selfGuided: true`
- [x] "Offline fallback active" message appears without panic-style language
- [x] Post-session "Where are you now?" cannot be skipped

### Morning/Evening Reframe routing
- [x] Morning check-in "Set my tone ->" opens Reframe directly
- [x] Evening prompt "Talk it out ->" opens Reframe directly
- [x] Morning entry produces forward-looking response style
- [x] Evening entry produces closure-style response (no new thread opening)

### Paywall hardening
- [x] Subscribe button cannot be double-clicked into duplicate checkout launches
- [x] Checkout loading state appears ("Opening checkout...")
- [x] Missing trial-start guard shows clear message instead of silent failure
- [ ] Monthly/Annual toggle choice is reflected correctly in Lemon checkout (manual verify)
- [ ] Post-launch: replace any static "X days left" trial display with server-backed dynamic trial-day calculation (UAT static display is acceptable for now)

### Settings / pricing clarity
- [x] No "Premium" gating language appears for included subscriber options
- [x] Pricing features mention encrypted cloud backup

### Integrations track (aligned to roadmap, can be built in parallel)
- [x] Calendar context ingestion scaffold in app (local summary key + AI context field)
- [x] Health context ingestion scaffold in app (sleep/HRV/readiness summary key + AI context field)
- [x] Morning loop displays upcoming pressure window when calendar context is present
- [x] Reframe request includes integration context payload (calendar + health) when available
- [x] Integration settings copy added (planned/connected/error states) without requiring live provider auth
- [x] Integration consent scaffold in Settings (pending / granted / revoked for calendar and health)
- [x] Revoke action clears integration cache for the revoked source
- [x] Retry action records retry timestamp and clears stale integration error state
- [x] Daily loop adherence telemetry persists check-in and EOD completion history over time
- [x] My Progress shows 14-day loop completion metrics (overall + morning + EOD)
- [x] Home screen loop intervention nudge appears when 14-day morning/EOD drop-off is high (non-punitive copy + direct resume action + daily dismiss)
- [x] Loop intervention telemetry logs shown/actioned/dismissed events and My Progress shows "Nudge recovery (14d)"
- [x] Adaptive nudge sensitivity adjusts threshold/min-opens by recent completion and dismissal behavior, and surfaces diagnostics in My Progress
- [ ] Post-launch: provider hookups (Apple/Google calendar + health providers) with explicit consent and revoke paths

### Pinned human-required actions (can do later if not feeling well)
- [ ] Termly privacy policy published with explicit cloud storage + encrypted backup language
- [x] Lemon Squeezy moved from test mode to live mode (user-confirmed Apr 9: live subscribe + cancel + confirmation emails)
- [x] Live-mode checkout tested for monthly + annual variants (user-confirmed Apr 9 via Lemon confirmation emails for both variants)
- [ ] Server-side subscription verification planned (webhook + Supabase truth table)

### Added April 11 — Architecture completion (code-side)
- [x] Onboarding compressed to one-screen composure architecture intro + direct calibration handoff
- [x] Contextual first-time tip added on Home loop (dismiss + persisted)
- [x] Contextual first-time tip added in Pulse panel (dismiss + persisted)
- [x] FAQ moved to top of Settings for low-friction support access
- [x] Data export activated in Settings (`Export pulse log (PDF)` + `Export session history (CSV)`)
- [x] Metrics-only telemetry pipeline added (Settings consent toggle + daily ingest + no text payload policy)

---

## SHIP BASELINE — NON-NEGOTIABLE INVARIANTS (Required before every push)

### Invariant lock (must all be true)
- [x] Audience framing is universal: Stillform is for everyone (no niche-only positioning language)
- [x] Composure is described as a daily trainable skill, not a trait for specific groups
- [x] No copy contradicts trust/integrity posture (no overclaiming, no manipulative urgency)
- [x] Ecosystem logic preserved (strengthen existing loops before adding branchy modules)
- [x] Public-facing deck/app wording is aligned (no strategy/app mismatch)

### Execution quality gate (must all be true)
- [x] One coherent pass completed (no reactive patch-chain edits left unresolved)
- [x] Constraint check performed before implementation (what changes / what does not)
- [x] Post-change verification performed against invariants and product purpose
- [x] Build passes (`npm run build`)
- [x] SHIP preflight passes (`npm run ship:preflight`)

### Escalation rule
- [ ] If any invariant fails, release is blocked and changes are reworked before push
