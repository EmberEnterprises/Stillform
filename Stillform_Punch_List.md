# STILLFORM — PUNCH LIST
### Every change made in Session 4 (April 7-8, 2026)
### Test each item. Check it off when verified on live site.

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
- [ ] Reframe API fails 3 times -> self-guided fallback appears automatically
- [ ] Fallback shows 5-step structure (feeling -> brain adding -> friend advice -> one action -> completion)
- [ ] Fallback session saved in `stillform_sessions` with `selfGuided: true`
- [ ] "Offline fallback active" message appears without panic-style language
- [ ] Post-session "Where are you now?" cannot be skipped

### Morning/Evening Reframe routing
- [ ] Morning check-in "Set my tone ->" opens Reframe directly
- [ ] Evening prompt "Talk it out ->" opens Reframe directly
- [ ] Morning entry produces forward-looking response style
- [ ] Evening entry produces closure-style response (no new thread opening)

### Paywall hardening
- [ ] Subscribe button cannot be double-clicked into duplicate checkout launches
- [ ] Checkout loading state appears ("Opening checkout...")
- [ ] Missing trial-start guard shows clear message instead of silent failure
- [ ] Monthly/Annual toggle choice is reflected correctly in Lemon checkout (manual verify)
- [ ] Post-launch: replace any static "X days left" trial display with server-backed dynamic trial-day calculation (UAT static display is acceptable for now)

### Settings / pricing clarity
- [ ] No "Premium" gating language appears for included subscriber options
- [ ] Pricing features mention encrypted cloud backup

### Integrations track (aligned to roadmap, can be built in parallel)
- [ ] Calendar context ingestion scaffold in app (local summary key + AI context field)
- [ ] Health context ingestion scaffold in app (sleep/HRV/readiness summary key + AI context field)
- [ ] Morning loop displays upcoming pressure window when calendar context is present
- [ ] Reframe request includes integration context payload (calendar + health) when available
- [ ] Integration settings copy added (planned/connected/error states) without requiring live provider auth
- [ ] Integration consent scaffold in Settings (pending / granted / revoked for calendar and health)
- [ ] Revoke action clears integration cache for the revoked source
- [ ] Retry action records retry timestamp and clears stale integration error state
- [ ] Daily loop adherence telemetry persists check-in and EOD completion history over time
- [ ] My Progress shows 14-day loop completion metrics (overall + morning + EOD)
- [ ] Home screen loop intervention nudge appears when 14-day morning/EOD drop-off is high (non-punitive copy + direct resume action + daily dismiss)
- [ ] Loop intervention telemetry logs shown/actioned/dismissed events and My Progress shows "Nudge recovery (14d)"
- [ ] Adaptive nudge sensitivity adjusts threshold/min-opens by recent completion and dismissal behavior, and surfaces diagnostics in My Progress
- [ ] Post-launch: provider hookups (Apple/Google calendar + health providers) with explicit consent and revoke paths

### Pinned human-required actions (can do later if not feeling well)
- [ ] Termly privacy policy published with explicit cloud storage + encrypted backup language
- [ ] Lemon Squeezy moved from test mode to live mode
- [ ] Live-mode checkout tested for monthly + annual variants
- [ ] Server-side subscription verification planned (webhook + Supabase truth table)

---

## SHIP BASELINE — NON-NEGOTIABLE INVARIANTS (Required before every push)

### Invariant lock (must all be true)
- [ ] Audience framing is universal: Stillform is for everyone (no niche-only positioning language)
- [ ] Composure is described as a daily trainable skill, not a trait for specific groups
- [ ] No copy contradicts trust/integrity posture (no overclaiming, no manipulative urgency)
- [ ] Ecosystem logic preserved (strengthen existing loops before adding branchy modules)
- [ ] Public-facing deck/app wording is aligned (no strategy/app mismatch)

### Execution quality gate (must all be true)
- [ ] One coherent pass completed (no reactive patch-chain edits left unresolved)
- [ ] Constraint check performed before implementation (what changes / what does not)
- [ ] Post-change verification performed against invariants and product purpose
- [ ] Build passes (`npm run build`)
- [ ] SHIP preflight passes (`npm run ship:preflight`)

### Escalation rule
- [ ] If any invariant fails, release is blocked and changes are reworked before push
