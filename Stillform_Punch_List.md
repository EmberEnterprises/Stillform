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
- [ ] DISCHARGE link works → goes to Discharge screen
- [ ] MY PROGRESS link works → goes to My Progress screen

### Discharge
- [ ] Screen loads with empty textarea
- [ ] Placeholder: "Type. Nobody will see this."
- [ ] Text opacity fades as you type more
- [ ] "Discharge" button lights up amber when text exists
- [ ] Tapping Discharge → "Cleared" flash → text dissolves
- [ ] After clearing, textarea is empty again
- [ ] "The value is in the act, not the record." shows at bottom
- [ ] NOTHING saves to localStorage — verify in DevTools
- [ ] Back button returns to home and clears text

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
