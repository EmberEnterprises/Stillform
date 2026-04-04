# STILLFORM

**Project Transfer Document**

ARA Embers LLC · April 2026 · For Stillform Project in Claude

> *Paste this document into the **Stillform** Claude project on session start. Everything here is current as of April 4, 2026. No decisions need to be relitigated.*

---

# 1 — What Stillform Is

> *One sentence: "Stillform is a composure system — how you carry yourself, every day, in every moment that matters."*

**Stillform is NOT positioned as a meditation app, therapy, or crisis hotline — even though it contains elements of all of these. It's a composure system. The framing matters: the target audience would never download a meditation app or book a therapy session, but they'll use a system that makes them sharper.**

Stillform IS a daily composure practice AND a fast intervention system. Morning calibration and in-the-moment reset. Both.

**Composure is a way of being — how you carry yourself every day. Not just in hard moments. Not just when things go wrong. Composure applies to excitement, patience, presence, professionalism, being steady when nothing is wrong.**

## Positioning

- You are selling Composure as a Competitive Advantage
- Target: anyone who wants more control over how they show up — professionals, parents, creatives, athletes, neurodivergent individuals, anyone who cares about composure
- They want a dashboard, not a hug. An operator, not a patient.
- People don't want to be better. They want to be functional.

## Identity Lines (locked)

- Stabilize. Then think clearly.
- Body. Then thought. (for body-first users) / Think. Then settle. (for thought-first users)
- Not meditation. Not therapy. A precision composure system.
- Initiate Session / Stabilize now — primary CTA
- ◉ Scan·Body / ✶ Reframe·Thought — secondary anchors

---

# 2 — Current Build State (April 2026)

**Live at stillformapp.com — HTTP 200. UAT mode. Password-protected for testers.**

## Infrastructure

- Hosting: Netlify Pro ($0/mo) — stillformapp.com via Cloudflare
- GitHub: EmberEnterprises/Stillform
- GitHub token: [STORED SEPARATELY — do not commit to repo]
- Framework: React + Vite
- AI: GPT-4o Mini via Netlify serverless function (/netlify/functions/reframe.js)
- Analytics: Plausible (custom script) — live
- PWA: manifest.json + sw.js + icons — installable on iOS and Android
- Capacitor 8: initialized with iOS and Android platforms added and synced

## Pricing

- $14.99/mo or $9.99/mo annual ($119.88/yr, 33% off)
- No add-ons. No toggles. One price. Cloud sync included.
- 7-day free trial planned (not yet live — blocked on Lemon Squeezy)

## Two Regulation Pathways (NEW — from research)

Research confirms two neurologically distinct regulation pathways:

- **Top-down (thought-first):** Emotions start as thoughts — spiraling, replaying, analyzing. Reframe/AI is the primary tool. Breathing comes AFTER cognitive processing.
- **Bottom-up (body-first):** Emotions start as body tension — jaw, chest, fists. Breathing/body scan is the primary tool. Reframing comes AFTER the body settles.

Top-down emotions are more successfully regulated by top-down strategies. Bottom-up by bottom-up. Stillform's core target audience (analytical, neurodivergent) is likely thought-first.

**Guided assessment at onboarding determines user's type through scenarios, not self-labeling. Three outcomes: thought-first (default to Reframe), body-first (default to Breathe), or "help me figure it out" (guided session through both).**

## Three Core Tools

**1. Breathe & Ground (merged tool)**

- Two-pathway entry: "I can't calm down" (body overwhelm) and "I need to think clearly" (spiraling/decision paralysis)
- Calm path: 4-4-8-2 breathing → sensory grounding → Reframe calm mode
- Clarity path: physiological sigh → Reframe clarity mode
- Four breathing patterns selectable: Calm (4-4-8-2), Box (4-4-4-4), 4-7-8, Quick Reset
- SVG breathing ring, tick marks, animated arc
- Scan pace toggle: Fast (~25s), Standard (~50s), Slow (~90s)

**2. Body Scan**

- 6 acupressure points with timed holds
- Body schematic SVGs for all 6 points
- Auto-advances through points
- Completion screen: "Signal cleared"

**3. Reframe (AI)**

- Three modes: Regulate (calm), Get Sharp (clarity), Lock In (hype/performance)
- GPT-4o Mini via Netlify function — rate limited 10 req/IP/min
- Conversation persistence via AES-GCM encrypted localStorage (device key in IndexedDB)
- History capped at 10 messages
- AI gets smarter by session count: <5 no patterns, 5-12 gentle, 12+ direct coaching

## System Initialization → Guided Assessment (REDESIGN PENDING)

Current flow being replaced with scenario-based assessment. New flow:

- Scenario questions that cover FULL composure spectrum (not just crisis/anger):
  - "You're about to walk into a job interview"
  - "Someone just complimented you out of nowhere"
  - "You're tired but people are counting on you"
  - "You're telling a story and everyone's listening"
  - "Your kid is testing your patience over something small"
- Scoring determines: thought-first, body-first, or unknown
- "Help me figure it out" path: guided session through both tools
- Signal mapping and bias profiling happen naturally through AI over first sessions, not as gates before starting

## 7-Session Review Milestone (NEW)

After the 7th session (regardless of frequency), the system reviews tool usage vs assessed type:

- **Mismatch detected:** "You've been here 7 times. Based on how you've been using the tools, you tend to reach for talking first — but you were set up as body-first. Is what you're using now working, or do you want to try leading with Reframe?"
- **No mismatch:** "7 sessions. You're building something. How's it feeling?"
- **7-day streak variant:** If 7 consecutive days, use "You've been here 7 days straight" instead
- No pressure, no "you were wrong" — data + their call
- First pattern note moved from session 5 to session 3 (if user doesn't feel seen in 48 hours, they leave)

## Morning Practice (NEW CONCEPT)

Stillform becomes a daily morning practice, not just an emergency tool:

- App reads device calendar
- AI knows what's ahead: "Full day. You've got this. Want to set your tone for today?"
- Brief check-in: how do you want to carry yourself today
- AI adjusts tone based on day weight (heavy Tuesday vs light Friday)
- Building daily relationship = user reaches for app naturally when something happens mid-day

## Bio-Filter (Physical State Check)

- Options: All clear, Physically depleted, Gut signal active, Sleep deprived, Hormonal shift, Pain present, Physically activated, Medicated
- Saves to localStorage, wired into Reframe API call
- AI instruction: "Some of what you're reading as [emotion] may be your system running on [filter] right now — not a permanent signal"

## AI Context Stack (what goes into every Reframe call)

- Signal Profile: body areas where intensity activates first
- Bias Profile: identified cognitive blind spots (10 distortions)
- Feel State: excited / focused / anxious / angry / flat / mixed
- Bio-Filter: physical state selected at session start
- Check-in context: sleep, energy, mood from daily check-in
- Session count: determines AI coaching intensity
- Prior tool context: what they did before Reframe this session
- Prior mode context: if they switched modes mid-session
- Journal context: recent entries (used from session 5+)

## AI Memory & Summarization Architecture (NEW)

**The summary system IS the product.** Tools do work, user provides input, AI just connects them via the summary.

### Nine Categories the AI Must Preserve

1. **What they confided** — vulnerable disclosures, the personal stuff they chose to share
2. **Their trajectory** — where they started vs where they are now
3. **Their type** — thought-first or body-first, how they process
4. **Their triggers** — what sets them off, recurring patterns
5. **Their values** — what they care about protecting, what drives them
6. **Their current life context** — calendar, what's happening this week
7. **Their aspirational identity** — who they're trying to become
8. **What made them feel understood** — moments the AI said the right thing
9. **What they've outgrown** — resolved patterns, old triggers that no longer fire

### Three-Layer Memory Architecture

- **Always sent (~50-200 tokens):** Coded profile — type, signal map, bias list, breathing pattern, today's calendar summary
- **Recent (~500 tokens):** Last 3-5 sessions in full
- **Compressed history (~200 tokens):** AI-written living summary — not transcripts, just what mattered. Updated after each session. Old resolved patterns get dropped.
- **Deep retrieval (on device):** Full session archive, encrypted, searchable. Used when user references specific past conversation.

### AI Session Notes

After each session, AI writes brief notes — not transcripts, just what mattered:
"Talked about feeling unseen at work. Second time this month. Reframed as communication gap, not rejection. Progress."

### Summary Format

Hybrid approach:
- **Coded:** Stable categorical data (type, signals, biases) — compresses well
- **Natural language:** Nuanced relationship data (confided, trajectory, aspirational) — stays in short plain sentences because nuance lives in language

## AI Response Principles (NEW — from research)

### Core Rules

- Everyone carries trauma — light or heavy. History informs but every session is fresh.
- No judgment, unconditional acceptance, patience, no dismissal, true listening.
- Never use love language — don't SAY you care, MAKE them feel it through the quality of the response. Show don't tell.
- Light warmth — like a friend who doesn't try too hard.

### Never Say

- "I understand how you feel" — you don't know their history or environment
- "That's a lot to carry" / "That must be so hard" — condescending
- "I care about you" / "I'm here for you" — creates dependency, gets weird
- Pattern labels as flaws: "You catastrophize" / "You struggle with anger"
- Repeating vulnerability as label: "You have father issues"

### Always Do

- Offer presence: "I'm here if you want to talk through it" / "What happened next?"
- Match their language — never translate "I'm pissed" into "experiencing frustration"
- Reflect back the one word that mattered — not a paragraph of performed empathy
- Let them drive — "Is that right?" beats "I know what this is"
- Hold their aspirational self, not their diagnostic self
- Frame patterns as awareness: "You've started noticing when your thinking narrows"

### AI Self-Bias Guards

1. Don't anchor on the summary — if user contradicts their pattern, believe them
2. Never imply they caused their problem — validate trigger first, explore response second
3. Match their language — don't translate their words
4. Track disengagement as signal — shorter responses = possible misstep
5. Hold aspirational self, not diagnostic self
6. Never repeat a vulnerability as a label
7. Ask before assuming — "Is that right?" beats "I know what this is"
8. People change — update model of them faster than they expect

## Widget (WORKING — April 4)

- Android home screen widget: one tap → breathing screen
- Architecture: Widget tap → Intent → SharedPreferences → Capacitor Plugin → React → Breathing
- Key files: StillformWidget.java, MainActivity.java, WidgetBridgePlugin.java, src/plugins/widgetBridge.js
- JS plugin registration via registerPlugin('WidgetBridge') from @capacitor/core (Capacitor 8 requirement)
- Known issue: brief flash of home screen before breathing appears (cosmetic, can be smoothed)
- CRITICAL: After installing new APK, run `adb shell pm clear com.araembers.stillform` to clear service worker cache

## Additional Screens & Features

- My Progress: sessions, streak, avg shift, most used tool, signal profile trends
- Signal Log: emotion chips, frequent + recent entries, optional notes
- Tension Check: daily body check-in in Settings
- Daily Reminder: push notification toggle + time picker in Settings
- Audio toggle: breathing guidance on/off
- Screen-light mode: dims screen during exercises
- Reduced motion: removes animations
- Crisis screen: resources, 988, Crisis Text Line
- Privacy screen: live at stillformapp.com/privacy.html
- Promo reel: live at stillformapp.com/promo.html
- FAQ page: live at stillformapp.com/faq.html
- Error boundary: user-facing fallback for crashes
- Contact: ARAembersllc@proton.me

## Native (Capacitor 8) — Initialized

- Capacitor initialized: appId com.araembers.stillform
- iOS and Android platforms added and synced
- Push notifications: @capacitor/push-notifications
- Haptics: @capacitor/haptics — native impact/notification patterns
- Local notifications: @capacitor/local-notifications — daily reminder scheduler
- Widget: Working (SharedPreferences → WidgetBridgePlugin → React)
- Share extension: code written, untested
- Watch haptics: code written, wear module builds, untested
- Web fallback: all native features gracefully degrade on web
- PENDING: Apple Watch companion, Health integrations, Biometric lock

---

# 3 — Hard Blockers

> *ONE blocker between Stillform and public launch: Lemon Squeezy paywall. Bobby's ID verification was submitted and is pending approval.*

## What's Waiting on Lemon Squeezy

- Paywall live on stillformapp.com
- In-app subscription products ($14.99/mo, $9.99/mo annual)
- 7-day free trial
- Reddit launch post — don't post without paywall

## What's Waiting on DUNS (~30 business days from April 4)

- Apple Developer Program ($99/yr) — requires DUNS for org account
- App Store submission
- TestFlight testers

## Pre-Launch Requirements

- No one has done a real user session yet — Ava's feedback was from the home screen, Bobby hasn't used it, Jonny did a technical audit not a user session
- Reddit launch is a one-shot moment — don't post without paywall + real testimonials
- Before any live update that touches user data: auto-backup to encrypted cloud sync BEFORE update. Non-negotiable for production.
- **PENDING: Privacy policy (stillformapp.com/privacy.html) needs update to reflect:** regulation type assessment data collection, calendar integration (local processing only), AI summarization system, 7-session review milestone, processing type storage in localStorage, and any new data flows from cloud sync architecture.

---

# 4 — Tester Status

Target: 10 testers before Reddit. Current: ~9 unique visitors logged in Plausible.

## Confirmed Testers

- Ava — "The breathe and ground helped. I loved the reframe." — first testimonial
- Bobby — co-founder, testing
- Ari — testing
- Michelle — testing
- Paula — testing
- Ive — testing
- Jonny Porto — professional dev/security audit. All findings actioned.
- Brother — said he'd use it after Apple Watch integration. Sharing with neurodivergent community.
- Bobby's coworkers — pending Bobby sharing
- Kapil — message sent, unread
- Ray — message sent
- Jonny (family friend, techy) — message sent, responded positively

---

# 5 — Next Steps to Launch

## Immediate (code ready or in progress)

1. Smooth widget flash (extend splash until screenReady)
2. Test widget when app is already open (background resume via onNewIntent)
3. Disable or update service worker so future builds aren't cached
4. Guided assessment flow — replace System Initialization
5. Morning practice view — calendar integration, daily check-in
6. AI summarization system — implement 9-category architecture
7. Encode AI response principles and bias guards into system prompt (DONE — pushed April 4)

## Native Integrations

- Samsung Galaxy Watch Ultra — haptic breathing companion (user has watch, needs Android Studio on Mac)
- Apple Health / Google Health Connect — HRV, sleep, heart rate
- Biometric lock — Face ID / fingerprint on Reframe and Signal Log
- Premium sound packs
- PDF/CSV export of session data
- Shareable composure card

## App Store Path

**Google Play Console:**
- Create account ($25 one-time)
- Fill store listing, upload AAB
- Add 12+ testers, start 14-day closed testing

**Apple App Store (after DUNS):**
- Apply for Apple Developer Program ($99/yr) with DUNS
- Create app in App Store Connect
- Upload build via Xcode → Archive → Distribute
- Add testers to TestFlight

## Launch Prep

- Write Reddit post — opening line: "People don't want to be better. They want to be functional."
- Set up @stillformapp Instagram — post promo reel
- Lemon Squeezy paywall goes live (waiting on Bobby)
- Post to Reddit: r/ADHD, r/neurodivergent, r/anxiety, r/cptsd, r/BPD, r/meditation
- Product Hunt submission

---

# 6 — Locked Decisions (Do Not Relitigate)

- Stillform is a composure SYSTEM not a wellness app. Operator framing throughout.
- Composure is a way of being — NOT crisis management, NOT damage control.
- No AI add-on pricing — AI is included. One price.
- No add-ons, no toggles, no upsells inside Stillform.
- Invisible leveling — AI gets smarter silently by session count. Never announced.
- Bio-filter = hardware diagnostics. Physical state as system check.
- Completion language: Composure restored / Signal cleared / System calibrated
- Reddit is a one-shot moment. Do not post without paywall and testimonials.
- Web launch first. App stores second. Reddit before app stores is fine.
- Trademark: file after 100 paying customers. Use ™ until then.
- AI response: never use love language, never claim to understand, show don't tell.
- People change — summary must be a living document, never lock someone into old patterns.
- Assessment covers full composure spectrum — not just crisis/anger scenarios.
- Outcome over Emotion — we don't measure happiness, we measure Signal Awareness Latency (how fast the user notices they're about to act from state instead of decision).
- Signal Clearance data only surfaces when positive. Digression handled by AI adjusting, not by dashboard showing failure.
- No "I" statements in State-to-Statement — AI helps them figure out what to say, doesn't hand them a script.

## Roadmap Concepts (From Research — Not Yet Built)

**1. Anticipatory Regulation ("Signal Delay")**
Post-event cool-down checks. If calendar shows high-stakes meeting at 2pm, AI checks in at 4:30pm: "System check. High-intensity signal detected 2 hours ago. Hardware check." Treats user like a machine that needs cool-down. Requires calendar integration.

**2. State-to-Statement Translation**
After reframing, AI helps user formulate what they want to communicate externally. Not a script — a guided "What do you need them to hear?" Moves from "feeling better" to "functional output." Must respect "let them drive" principle.

**3. Signal Awareness Speed (Calibration Recovery Velocity)**
Track how fast user catches their state before it drives an action over time. "Last month, 15 minutes of chest tightness before you opened the app. This week, 3 minutes. Your awareness latency is dropping." Only surface when positive. Proves neuroplasticity without wellness jargon.

**4. Composure Gate (Friction-Based Intervention)**
System-level interceptor. When user tries to open a trigger app (work Slack, social media) during high bio-filter load, Stillform sends: "Hardware signal: High Activation. Perform 30s Quick Reset before entering this environment?" Positions app as "System Firewall" for composure. Most ambitious feature — needs deep OS permissions. Under active discussion.

**5. Calendar-Aware Morning Practice**
Reads device calendar. AI knows what's ahead. Morning check-in includes: "You have [event] at [time]. How do you want to carry yourself?" Enables anticipatory regulation and tone-setting for specific events.

**6. Samsung Galaxy Watch Haptic Breathing**
Wear OS companion. Watch vibrates in sync with breathing pattern. No screen needed — user learns the rhythm through haptics alone. Priority before launch. Needs Android Studio on Mac.

**7. Apple Watch Haptic Breathing**
WatchKit extension. Same concept as Samsung — haptic-only breathing companion. Blocked on DUNS number and Apple Developer Program.

**8. Health Integration + Contextual Data Sources**
Goal: morning check-in becomes one tap because the system already knows. Pull from every available source on the device:

*Health app (HealthKit / Health Connect):*
- Sleep quality and duration — feeds morning check-in, system knows before you tell it
- HRV (heart rate variability) — real-time stress indicator. Dropping HRV triggers proactive nudge
- Resting heart rate — baseline comparison, detects elevated state
- Blood oxygen — fatigue indicator
- Exercise/activity minutes — sedentary all day vs just worked out = different baselines
- Menstrual cycle data — auto-sets hormonal bio-filter without asking

*Calendar:*
- What's ahead today — enables anticipatory regulation
- What just ended — enables cool-down checks
- Gap between meetings — finds composure windows
- High-stakes events flagged for pre-game mode

*Screen time API:*
- Knows if user has been on social media for 2 hours straight
- Context for AI without user having to say it
- Doom-scrolling detection as implicit state signal

*Watch sensors (Wear OS / WatchKit):*
- Ambient noise levels — sensory overload detection
- Skin temperature changes — physiological state shifts
- Real-time heart rate during session — measures actual shift, not self-reported shift

*Location:*
- Work vs home vs gym vs commute — AI adjusts response tone and recommendations
- Travel detection — jet lag and disrupted routine awareness

*Weather / barometric pressure:*
- Affects mood and pain sensitivity
- Auto-context for bio-filter without self-report
- Grey day + low HRV + 5hr sleep = system already understands the starting point

*The vision:* User opens Stillform in the morning. System already knows they slept 5 hours, HRV is low, performance review at 2pm, grey day, haven't exercised in 3 days. Morning check-in becomes one confirming tap instead of a questionnaire. Every data source strengthens the FSA case — all biometric, all research-backed, all health-related.

**9. Cloud Sync**
Encrypted cloud backup and multi-device sync. Pre-update auto-backup before any app update touches user data. Version check on app load. Non-negotiable for production.

**10. Premium Sound Packs**
Ambient soundscapes for breathing sessions. No upsell — included in subscription.

**11. PDF/CSV Export**
Export full session history, signal log, and patterns data. Supports clinical use case and FSA documentation.

**12. Shareable Composure Card**
Visual card showing composure stats. Shareable to social media. Growth visualization.

---

# 7 — Technical Reference

## Key Files

- src/App.jsx — entire frontend (6,900+ lines)
- src/plugins/widgetBridge.js — Capacitor plugin JS registration
- netlify/functions/reframe.js — AI serverless function (GPT-4o Mini)
- public/sw.js — service worker (CAUTION: caches old JS — may need disable/update)
- public/manifest.json — PWA manifest
- capacitor.config.ts — native app config
- ios/ — Xcode project
- android/ — Android Studio project
- android/app/src/main/java/com/araembers/stillform/MainActivity.java — widget intent handler
- android/app/src/main/java/com/araembers/stillform/StillformWidget.java — widget layout/intent
- android/app/src/main/java/com/araembers/stillform/WidgetBridgePlugin.java — SharedPreferences reader

## Key localStorage Keys

- stillform_onboarded — "yes" if completed onboarding
- stillform_regulation_type — "thought-first", "body-first", or "balanced"
- stillform_signal_profile — body signal mapping JSON
- stillform_bias_profile — cognitive blind spots array
- stillform_breath_pattern — default breathing pattern
- stillform_sessions — session history array
- stillform_reframe_session_calm / _clarity / _hype — encrypted conversation history
- stillform_journal — AAR entries
- stillform_bio_filter — last selected physical state
- stillform_reminder / stillform_reminder_time — push notification settings
- stillform_audio / stillform_scan_pace — settings
- stillform_ai_session_notes — AI-written post-session summaries (last 20)
- stillform_milestone_7_seen — "yes" if 7-session check-in dismissed
- stillform_notes — user-written session notes
- stillform_saved_reframes — saved AI reframe responses

## Build Commands

```
npm run build
npx cap sync
npx cap open ios
npx cap open android
```

## Android Build (from Mac)

```
cd ~/Desktop/Stillform
git pull
npm run build
npx cap sync android
cd android
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
./gradlew clean assembleDebug
~/Library/Android/sdk/platform-tools/adb install -r app/build/outputs/apk/debug/app-debug.apk
```

## Critical: Service Worker Cache

After installing new APK, if behavior doesn't change:
```
~/Library/Android/sdk/platform-tools/adb shell pm clear com.araembers.stillform
```
This clears the service worker cache. Without this, the app loads OLD cached JS files.

## Git Remote (with token)

```
git remote set-url origin https://x-access-token:[TOKEN]@github.com/EmberEnterprises/Stillform.git
```

## Netlify Function — reframe.js

- Rate limiting: 10 req/IP/min
- Input validation: max 2000 chars
- History capped at 10 messages
- Model: gpt-4o-mini (via OpenAI API)
- Max tokens: 180 per response
- Receives: input, history, mode, feelState, bioFilter, signalProfile, biasProfile, checkinContext, sessionCount, priorModeContext, priorToolContext, journalContext
- AI response principles encoded in system prompts (updated April 4)

---

# 8 — The Composure Framework

**Metacognition as Signal Calibration**
Distinguishes between a "vague feeling" and a "verified observation." Prevents spiraling into unverified assumptions. The Blind Spot Profiler and Watch & Choose tool serve this function.

**EQ as Operational Intelligence**
Not about being nice — about managing the energy of the room. Helps users navigate high-stakes interactions. The Reframe AI translates intense internal experience into functional external action.

**Bio-Filter as Hardware Diagnostics**
"I feel overwhelmed" might actually be "my system is physically depleted." The bio-filter prevents misidentifying a biological signal as a character flaw or permanent reality.

**Two Regulation Pathways (from research)**
Top-down (thought-first) emotions are more successfully regulated by cognitive strategies. Bottom-up (body-first) emotions are more successfully regulated by somatic strategies. Stillform detects and adapts to both.

> *The framework: Rate your state → Filter for hardware → Regulate → Reframe. That is the composure system. Not wellness. Diagnostics.*

---

# 9 — Product Psychology (NEW — from April 4 research)

## Key Research Findings

**People feel, not think, their way to trust.** Feeling understood matters more than being understood. The AI doesn't need perfect recall — it needs to make them FEEL known.

**Ego threats are about the gap.** When the AI's response implies a gap between who they think they are and who the AI thinks they are — that's an attack. Never label patterns as flaws. Frame as awareness.

**Validation activates reward circuitry.** Neuroimaging shows validation activates the brain's reward system. This isn't flattery — it's literally rewiring behavior.

**People change.** Neuroplasticity is real and lifelong. The summary must be a living document. Old resolved patterns get dropped. The AI must update its model faster than the person expects.

**The relationship IS the retention.** People come back not for features but because something knows them. The morning practice builds the daily habit; the quality of the AI relationship keeps them.

**Manufactured care works if it's consistent.** The user doesn't need the AI to be real. They need it to be consistent — never forgets, never judges, never gets tired of them, never makes it about itself.

---

# 10 — Cloud Sync & Data Safety (PLANNED)

## Architecture

- All data encrypted on device before upload (AES-256)
- Device key stays on device, cloud holds encrypted blobs only
- Cloud is a backup locker — cannot read contents
- New device: download blob, decrypt with device key, full history restored
- Pre-update backup: before any app update touches user data, auto-backup encrypted archive to cloud first

## Data Layers

- Full session archive: encrypted, on device + cloud backup
- Living summary: updated after each session, sent to API
- Coded profile: categorical data, sent to API
- Calendar context: processed locally, only short string sent to API

---

# 11 — Strategic Goals

## FSA/HSA Eligibility
Goal: Get Stillform approved as an FSA/HSA eligible purchase. Requires all features to be science-backed, research-cited, and psychologically validated. Every tool, every AI response principle, every assessment scenario must trace back to published research. This strengthens positioning as a health tool, not a wellness app.

## Press Target: Wired Magazine
Position Stillform for a Wired feature. Differentiators: operator framing, two-pathway neuroscience-backed assessment, AI summarization architecture, Composure Gate concept, Signal Awareness Latency as a metric. The science-backed approach and the "composure system not meditation app" angle is the hook.

## Everything Must Be Research-Backed
Every decision in the product traces to psychology, neuroscience, or behavioral research:
- Two regulation pathways → Ochsner et al., bottom-up vs top-down emotion generation
- Ego threat avoidance → Baumeister, self-affirmation theory, self-concept threat research
- Feeling understood → Reis et al., perceived responsiveness research
- Validation approach → Linehan, Rogers unconditional positive regard
- Neuroplasticity → Sapolsky, Dweck growth mindset
- AI response bias guards → Kahneman heuristics, CBT therapist bias research

---

# 12 — Implementation Status (April 4, 2026)

## Built & Live on Web

- ✅ Guided assessment (5 scenarios, full composure spectrum)
- ✅ Adaptive home screen (primary button matches regulation type)
- ✅ Updated onboarding tutorial (science-backed two pathways)
- ✅ Processing Type in Settings (changeable anytime)
- ✅ Re-run Calibration in Settings
- ✅ AI response principles in all 3 system prompts
- ✅ 80/20 cadence rule in AI prompt
- ✅ 9-category awareness in AI prompt
- ✅ Regulation type sent to AI and used in responses
- ✅ Post-session AI summary (background call, stores notes)
- ✅ Session notes fed into future API calls (last 5 notes)
- ✅ First pattern note at session 3 (moved from 5)
- ✅ 7-session review milestone with type mismatch detection
- ✅ Absence detection (14+ days, operator tone)
- ✅ First-session quick win on all completion screens
- ✅ Service worker cache bust (network-first strategy)
- ✅ Bigger textarea for Reframe input
- ✅ Positioning copy updated throughout
- ✅ Widget working (Android, SharedPreferences → Capacitor plugin)
- ✅ All Jonny audit fixes intact

## Needs Mac (Native Rebuild)

- ❌ Native APK with all changes (pull + build + install)
- ❌ Test widget with new code on device
- ❌ Watch haptics testing
- ❌ Share extension testing

## Not Yet Built

- ❌ Morning practice view (calendar integration)
- ❌ Anticipatory regulation (post-event cool-down checks)
- ❌ State-to-Statement translation
- ❌ Signal Clearance Speed visualization
- ❌ Composure Gate (system-level app interceptor)
- ❌ Cloud sync infrastructure
- ❌ Privacy policy update (stillformapp.com/privacy.html)
- ❌ Lemon Squeezy paywall (waiting on Bobby)
- ❌ DUNS number application

---

ARA Embers LLC · Stillform Project Transfer · April 2026
