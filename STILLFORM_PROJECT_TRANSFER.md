# STILLFORM

**Project Transfer Document**

ARA Embers LLC · April 2026 · For Stillform Project in Claude

> *Paste this document into the **Stillform** Claude project on session start. Everything here is current as of April 7, 2026. No decisions need to be relitigated.*

## CRITICAL: Multi-Session Rules

Arlin runs multiple Claude sessions on this project. Sessions can die mid-conversation. To prevent conflicts and lost work:

1. **ALWAYS `git pull --rebase origin main` before ANY push.** Another session may have pushed since you started.
2. **ALWAYS push every change immediately after making it.** Do not batch. Do not wait. If the session dies, unpushed work is lost.
3. **Update this transfer doc with every significant change.** This doc is the single source of truth. If it's not in here, the next session won't know about it.
4. **Never have two sessions pushing to the repo simultaneously.** Finish one session's work before starting another.
5. **GitHub repo:** EmberEnterprises/Stillform — Netlify auto-deploys within ~1 minute of push.
6. **After any push, verify deploy at stillformapp.com** (incognito tab to bypass service worker cache).

---

# 1 — What Stillform Is

> *One sentence: "Stillform is a composure system — how you carry yourself, every day, in every moment that matters."*

**Stillform is NOT positioned as a meditation app, therapy, or crisis hotline — even though it contains elements of all of these. It's a composure system. The framing matters: the target audience would never download a meditation app or book a therapy session, but they'll use a system that makes them sharper.**

Stillform IS a daily composure practice AND a fast intervention system. Morning calibration and in-the-moment reset. Both.

**Composure is a way of being — how you carry yourself every day. Not just in hard moments. Not just when things go wrong. Composure applies to excitement, patience, presence, professionalism, being steady when nothing is wrong.**

## Positioning

- **Category: Executive Composure.** Not mental health. Not wellness. A new category. Use this phrase for Product Hunt, press, and Reddit.
- You are selling Composure as a Competitive Advantage
- Target: anyone who wants more control over how they show up — professionals, parents, creatives, athletes, neurodivergent individuals, anyone who cares about composure
- They want a dashboard, not a hug. An operator, not a patient.
- People don't want to be better. They want to be functional.
- **Trainer, not a crutch.** Signal Awareness Latency (how fast they catch themselves) is proof the app is building a skill they eventually own. The less you need the app, the more it's working. If it creates dependency, it's failed.

## Core Use Case: The Rebuilder's Burnout

The brain runs hot. The body pays the tax. The mind doesn't need to slow down — the body needs a cooling system so the mind CAN keep running at full speed.

This is Stillform's exact user: high-speed mental processing with no physical cooling system. They don't burn out because they're doing too much — they burn out because the body has no way to shed the heat the mind generates. By the time they notice, the system is already shutting down.

**How Stillform maps to this:**
- Morning check-in = pre-flight check on the hardware before the engine starts
- Bio-filter = real-time temperature gauge ("running on depleted, not your mind")
- Breathe = active cooling — 90 seconds, parasympathetic reset, engine keeps running
- Body Scan = finding where heat is building before it becomes a shutdown
- Reframe = the mind processes at full speed WITH a cooling system online
- Signal Awareness = noticing the heat before the shutdown — the skill that compounds

**What's needed:** proactive intervention. The rebuilder doesn't notice the heat until the system shuts down. Watch haptics, timed micro-resets, and AI frequency awareness close this gap.

## Identity Lines (locked)

- Stabilize. Then think clearly.
- Think clearly. Then settle. (thought-first) / Settle the body. Then think. (body-first) / Choose your entry point. (balanced)
- A precision composure system.
- ◉ Scan·Body / ✶ Reframe·Thought — secondary anchors

---

# 2 — Current Build State (April 2026)

**Live at stillformapp.com — HTTP 200. UAT mode. Password-protected for testers.**

## Infrastructure

- Hosting: Netlify Pro ($0/mo) — stillformapp.com via Cloudflare
- GitHub: EmberEnterprises/Stillform
- GitHub token: [STORED SEPARATELY — do not commit to repo]
- Framework: React + Vite
- AI: GPT-4o via Netlify serverless function (/netlify/functions/reframe.js)
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

Top-down emotions are more successfully regulated by top-down strategies. Bottom-up by bottom-up. The guided assessment determines each user's default pathway.

**Guided assessment at onboarding determines user's type through 5 scenarios covering the full composure spectrum — not just crisis/anger. Three outcomes: thought-first (Reframe dominant), body-first (Breathe dominant), balanced (equal weight). "Help me figure it out" option sets balanced.**

## Three Core Tools

**1. Breathe & Ground (merged tool)**

- Two-pathway entry: "Settle the system" (body overwhelm, thoughts or energy running fast) and "I need to think clearly" (spiraling/decision paralysis)
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

- Three modes: Talk it through (process + reframe), Break the loop (cut thought spirals), Get ready (pre-moment anchor)
- GPT-4o via Netlify function — rate limited 10 req/IP/min
- Conversation persistence via AES-GCM encrypted localStorage (device key in IndexedDB)
- History capped at 10 messages
- AI gets smarter by session count: <3 no patterns, 3-12 gentle, 12+ direct coaching

## System Calibration (BUILT — April 4)

Guided 5-scenario assessment determines regulation type. Followed by signal mapping and blind spot profiling. Flow:

- 5 scenarios covering full composure spectrum (interview, compliment, fatigue, attention, patience)
- Each scenario: "What happens first?" → Body response / Thought response / Both equally
- Scoring determines: thought-first, body-first, or balanced
- "Help me figure it out" skip option → sets balanced
- After assessment: signal mapping → blind spot profiler → breathing pattern → done
- Completed tools hide from home screen. "Calibration complete. Update anytime in Settings."
- Re-run calibration button in Settings

## 7-Session Review Milestone (NEW)

After the 7th session (regardless of frequency), the AI reflects on tool usage vs assessed type. This must feel like the AI noticed something, NOT like the software ran a diagnostic:

- **Mismatch detected (AI says):** "I've noticed something. You came in as body-first, but you keep reaching for conversation. That's not wrong — it might mean your system is telling you something about how you actually process. Want to explore that?"
- **No mismatch:** "7 sessions. You're building something. How's it feeling?"
- **7-day streak variant:** If 7 consecutive days, use "You've been here 7 days straight" instead
- NEVER frame as: "Based on your data, you should switch." That's a notification, not metacognition.
- The user decides. The AI observes. That's the product.
- First pattern note moved from session 5 to session 3 (if user doesn't feel seen in 48 hours, they leave)

## Morning Check-In (BUILT — April 4, calendar integration pending)

Daily check-in card at top of home screen. Two quick taps:

- Energy: Low / Steady / High / Ready / Wired
- Hardware check: multi-select — All clear / Depleted / Under-rested / Pain present / Activated / Medicated (user can select multiple, e.g. pain + under-rested). All selections sent to AI as combined context.
- "Set my tone →" saves and collapses to "✓ Checked in · tap to update"
- Bio-filter sends all selected hardware states to AI — combined context changes how AI interprets signals (pain + under-rested is a different baseline than either alone)
- PENDING: Calendar integration — reads device calendar so system knows what's ahead before you tell it

## Bio-Filter (Physical State Check)

- Now integrated into morning check-in (not a separate step)
- Options: All clear, Depleted, Under-rested, Pain present, Activated, Medicated
- Auto-sets from morning check-in hardware selection
- Wired into every Reframe API call
- AI instruction: "Some of what you're reading as [emotion] may be your system running on [filter] right now — not a permanent signal"

## AI Context Stack (what goes into every Reframe call)

- Regulation Type: thought-first, body-first, or balanced (from assessment)
- Signal Profile: body areas where intensity activates first
- Bias Profile: identified cognitive blind spots (10 distortions)
- Feel State: excited / focused / anxious / angry / flat / mixed
- Bio-Filter: physical state from morning check-in (depleted, under-rested, pain, activated, medicated)
- Morning energy: low / steady / high / ready / wired
- Session count: determines AI coaching intensity (<3 no patterns, 3-12 gentle, 12+ direct)
- Prior tool context: what they did before Reframe this session
- Prior mode context: if they switched modes mid-session
- Journal context: recent Pulse entries (used from session 3+)
- AI session notes: last 5 post-session summaries written by AI (from session 3+)
- Check-in context: daily check-in data

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

- Mirror their personality — read how they write and match it. Casual gets casual, intense gets intense, humor gets humor. Don't be stiffer than them.
- Mirroring boundary: mirror STYLE, never distortions. If they're flirting, redirect warmly. If hostile, stay steady. If self-destructive, don't validate. Match the vibe, challenge the signal. (Research: "warm-reliability tradeoff" — over-validation leads to sycophancy and dependency.)
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

- Morning Check-In: daily energy + hardware check at top of home screen
- My Progress: sessions, streak, avg shift, most used tool, signal profile trends
- Pulse: emotion chips, frequent + recent entries, optional notes
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
- PENDING: Apple Watch companion, Health integrations
- IN PROGRESS: Biometric lock — @aparajita/capacitor-biometric-auth installed by other Claude session (April 7)

---

# 3 — Hard Blockers

> *ONE blocker between Stillform and public launch: Lemon Squeezy paywall. Lemon Squeezy APPROVED April 7. Paywall ready to implement.*

## What's Waiting on Lemon Squeezy

- Paywall live on stillformapp.com
- In-app subscription products ($14.99/mo, $9.99/mo annual)
- 7-day free trial
- Reddit launch post — don't post without paywall

## What's Waiting on DUNS (applied, pending approval)

- Google Play Console org account ($25 one-time) — requires DUNS
- Apple Developer Program ($99/yr) — requires DUNS for org account
- App Store + Play Store submissions
- TestFlight testers (Apple) / Closed testing (Google)

## Pre-Launch Requirements

- No one has done a real user session yet — Ava's feedback was from the home screen, Bobby hasn't used it, Jonny did a technical audit not a user session
- Reddit launch is a one-shot moment — don't post without paywall + real testimonials
- Before any live update that touches user data: auto-backup to encrypted cloud sync BEFORE update. Non-negotiable for production.
- **PENDING: Privacy policy (managed in Termly) needs update to reflect:** regulation type assessment data collection, calendar integration (local processing only), AI summarization system, 7-session review milestone, processing type storage in localStorage, and any new data flows from cloud sync architecture.

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

## Immediate (next session — needs Mac)

1. Native APK rebuild with all April 4 web changes (dozens of commits)
2. Test widget with new code on device
3. `adb shell pm clear com.araembers.stillform` after install (SW cache)
4. Test morning check-in, assessment, adaptive home screen on native
5. Watch haptics testing on Galaxy Watch Ultra
6. Share extension testing

## Completed (April 4 — all live on web)

1. ✅ Guided assessment flow — replaces old System Initialization
2. ✅ Morning check-in card — energy + hardware, daily
3. ✅ AI summarization system — post-session notes, 9-category awareness
4. ✅ AI response principles and bias guards in all 3 system prompts
5. ✅ Regulation type wired into AI
6. ✅ Tutorial rewritten — 6 slides, science-backed, research links, swipe
7. ✅ Reframe modes renamed with distinct AI behavior descriptions
8. ✅ Neutral signal language throughout
9. ✅ UAT early access dropdown with full roadmap
10. ✅ Service worker cache bust

## Native Integrations

- Samsung Galaxy Watch Ultra — haptic breathing companion (user has watch, needs Android Studio on Mac)
- Apple Health / Google Health Connect — HRV, sleep, heart rate
- Biometric lock — Face ID / fingerprint on Reframe and Pulse
- Premium sound packs
- PDF/CSV export of session data + metrics (signal awareness speed, tool usage, regulation patterns)
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
- Lemon Squeezy paywall goes live (APPROVED — ready to implement)
- Post to Reddit: r/ADHD, r/neurodivergent, r/anxiety, r/cptsd, r/BPD, r/meditation
- Product Hunt submission

---

# 6 — Locked Decisions (Do Not Relitigate)

**Integrity is foundational.** Every decision — visual, structural, linguistic — must be honest. We choose language carefully not to hide anything, but to be more accurate. "Off-composure" was replaced because composure applies to all states. "Crisis management" was replaced because the app is for daily practice. "High-intensity people" was replaced because composure is for everyone. Every change moves toward precision, not away from truth. The science is real. The claims link to published papers. The AI doesn't perform understanding — it demonstrates it. The pricing has no tricks. The data practices are exactly what we say they are.

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
- The app never punishes you for not using it. Living without your phone IS composure. Metrics track what you brought here, not what you missed. No coverage scores, no "you only logged 60% of your signals." Depth over frequency.
- Metacognition is the product. The user should never feel like they're "logging data" — they should feel like they're observing their own system. Every feature must pass this test: "Am I asking the user to enter data, or am I training them to notice what's already happening?" The logging is a side effect of the noticing. If a feature feels like a form, it's wrong. If it feels like a mirror, it's right.
- The mirror must have integrity. All data is always honest, always complete, always accessible. We never hide, filter, or suppress what's real. The guardrails are about FRAMING, not filtering:
  - Present data neutrally. "You came here 14 times this week" is fact. Don't add a red arrow or a green checkmark. Let them interpret.
  - Patterns surface as observations, not labels. "You tend to reach for breathing on Mondays" — not "you spiral every Sunday night."
  - No comparisons to other users. Ever. Your composure practice is yours.
  - Composure matters MOST when things are going well. Ego is loudest when you're winning — overcommitment, impulsive decisions, burning bridges because you feel untouchable. The app serves good days as much as bad ones. This is not an afterthought — it's core to the product.
  - The AI addresses trends in conversation, not as dashboard verdicts. "I've noticed something — want to talk about it?" invites reflection. A declining chart invites shame.
  - Frequency is neutral. Using the app more isn't failure. Using it less isn't success. Both are data.
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

**13. Timed Micro-Resets (Cooling System)**
Proactive intervention throughout the day — not just morning and crisis. Scheduled 60-second breathing or body check notifications. Based on calendar density, HRV trends, and session frequency. The rebuilder doesn't notice the heat until shutdown — micro-resets shed heat before it accumulates. Watch tap: "Quick Reset. 60 seconds. Your system has been running for 4 hours."

**14. Session Frequency Awareness**
AI detects when user opens Stillform 3+ times in a day. Instead of treating each session as independent: "You've been here three times today. Your system is running hot — not broken. This might be a body day, not a mind day. Want to try a body scan instead of talking?" Prevents the rebuilder from using cognitive tools to outrun physical burnout.

**15. Composure Index (Single Prestige Metric)**
One elegant number visible on home screen. Not gamification — mastery tracking. Derived from data that already exists: session depth, tool variety, Signal Awareness speed over time. Prestige performance framing: "Your composure practice deepened this month" not "You logged 80% of your emotions." Never punishes for NOT using the app — only reflects what you brought here when you did.

**16. Monthly Composure Summary**
End-of-month summary of what you worked through — from sessions, AI notes, and signal log entries that already exist. Not surveillance of missed signals. Framing: "You came here 14 times. Here's what shifted." Celebrates depth, not coverage. Living without your phone is composure. The app should never make you feel like you need it for every feeling.

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
- Model: gpt-4o (upgraded April 7 — first impressions are everything) (via OpenAI API)
- Max tokens: 180 per response
- Receives: input, history, mode, feelState, bioFilter, signalProfile, biasProfile, checkinContext, sessionCount, priorModeContext, priorToolContext, journalContext
- AI response principles encoded in system prompts (updated April 4)

---

# 8 — The Composure Framework

**Metacognition as Signal Calibration**
Distinguishes between a "vague feeling" and a "verified observation." Prevents spiraling into unverified assumptions. The Blind Spot Profiler and Watch & Choose tool serve this function.

**Pattern Awareness — Not Pattern Rejection**
Humans are pattern-seeking. Every pattern was learned from real experience — it served a purpose. The problem isn't that patterns exist. The problem is assuming A=A again without checking. Past experience informs but doesn't dictate. The AI's job is not to tell users their patterns are wrong — it's to create a pause between recognizing a pattern and acting on it. "This feels familiar. Is it the same, or just similar?"

**EQ as Operational Intelligence**
Not about being nice — about managing the energy of the room. Helps users navigate high-stakes interactions. The Reframe AI translates intense internal experience into functional external action.

**Bio-Filter as Hardware Diagnostics**
"I feel overwhelmed" might actually be "my system is physically depleted." The bio-filter prevents misidentifying a biological signal as a character flaw or permanent reality.

**Two Regulation Pathways (from research)**
Top-down (thought-first) emotions are more successfully regulated by cognitive strategies. Bottom-up (body-first) emotions are more successfully regulated by somatic strategies. Stillform detects and adapts to both.

**Composure as the Foundation of Courage and Confidence**
Stillform doesn't teach courage or confidence directly. It builds the foundation both require. Courage isn't the absence of fear — it's acting clearly while the signal is running high. Confidence isn't believing you'll succeed — it's trusting yourself to stay steady regardless. Signal Awareness compounding over time is the mechanism that produces both. You stop being afraid of your own reactions. That's where real confidence comes from.

**Composure Clears the Path**
Composure doesn't add capability. It removes what was blocking access to capability that was always there. The potential isn't unlocked — the noise gets quieter and you can finally hear yourself think. This is a documented outcome, not a marketing promise: the founder experienced intellectual clarity emerging as a direct result of building and using the composure framework. The implication for users: what feels like "not being able to think" may actually be "too much noise to access what you already know."

**Most people don't know the noise is there.** They think their default state IS their baseline. They've never experienced themselves without it. The first breathing session or the first body scan isn't just a tool — it's the first time many people feel the difference between "me thinking" and "noise running." That recognition — "oh, that wasn't me, that was noise" — is the first real metacognitive shift. Everything else builds on it.

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

**Trauma blocks potential, not ability.** Trauma — especially the kind that targets confidence — physically alters neural processing. The brain prunes pathways associated with risk-taking and shifts from exploration to protection. The talent, intelligence, and capability are still there but sequestered behind a safety vault. Reaching potential isn't about trying harder — it's about convincing the mind it's safe enough to unlock the door. Stillform's entire design philosophy supports this: low-friction entry, no judgment, safety foundation before growth.

**Fear and ego are tag-team security guards.** Fear is the alarm ("don't move or you'll get hurt again"). Ego is the architect that defends the current identity — even a painful one — because change threatens the "you" that's understood. The ego uses stubbornness to say: "I'd rather be right about being less-than than risk the unknown." When someone pushes back on a reframe, that's the ego protecting. The AI should never push harder — it should name it: "Something about that landed wrong. What part?"

**Stubbornness is redirected persistence.** The same trait that blocks someone is the exact tool they need to break through. Don't break the stubbornness — recruit it. "I am going to stubbornly insist on doing this one tiny thing today, regardless of how I feel about myself." The AI should recognize stubbornness as fuel, not resistance.

**Lower the stakes to bypass the ego.** If the ego is triggered by big goals, don't give it any. Focus on things so small they don't feel like a threat to identity. Two-tap morning check-in. One breathing cycle. One reframe. The ego doesn't activate defenses against something that small — and micro-wins rebuild confidence circuitry because the brain's confidence system runs on evidence, not affirmation.

**The Observer Hack IS metacognition.** Instead of "I am afraid," the shift to "I'm noticing a fear-based response" creates distance. That distance IS composure. That distance IS the product. Every feature in Stillform trains this shift — from experiencing a state to observing a state.

**Chronic illness changes the ego equation.** When energy is a limited budget, stubbornness becomes a survival tactic — not a character flaw. The ego protects against two bankruptcies:
1. *Energy bankruptcy* — "Don't try that new thing. We don't have the funds for a setback." The ego treats change as a high-maintenance luxury you can't afford.
2. *Hope bankruptcy* — "If we don't try, we can't fail. If we don't hope for full potential, we don't have to feel the crushing weight of disappointment when the body doesn't cooperate." Blocking your own potential is a way to control the "no" before life says it for you.
The AI must recognize this: when someone is depleted and resistant, pushing harder is spending energy they don't have. "I see you're trying to save your energy. We can afford five minutes of this." Acknowledge the ego's job. Negotiate with it, don't override it. Potential for someone with chronic illness isn't "pushing through" — it's mastering composure and clarity even when the body is failing. That IS full potential. The bio-filter exists so the AI knows when someone is in low-power mode and adjusts expectations accordingly.

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
Position Stillform for a Wired feature. Differentiators: operator framing, two-pathway neuroscience-backed assessment, AI summarization architecture, Composure Gate concept, Signal Awareness as a metric. The science-backed precision composure system angle is the hook.

## Everything Must Be Research-Backed
Every decision in the product traces to psychology, neuroscience, or behavioral research:
- Two regulation pathways → Ochsner et al., bottom-up vs top-down emotion generation
- Ego threat avoidance → Baumeister, self-affirmation theory, self-concept threat research
- Feeling understood → Reis et al., perceived responsiveness research
- Validation approach → Linehan, Rogers unconditional positive regard
- Neuroplasticity → Sapolsky, Dweck growth mindset
- AI response bias guards → Kahneman heuristics, CBT therapist bias research

## Revenue Target: $20K/month

**The number:** ~1,500 paying subscribers at blended rate (~$13/mo average, mix of $14.99 monthly and $9.99 annual).

**The math:**
- API cost at 1,500 users: ~$600/month (GPT-4o Mini, 3 sessions/day avg)
- Netlify: ~$20-50/month
- Margin: ~95%
- $20K covers all household costs + safety net if Bobby loses job or disability changes

**Pricing:** $14.99/mo or $9.99/mo annual ($119.88/yr, 33% off). One price. No tiers. No upsells. AI included. Cloud sync included. Quick Breathe always free (anyone in crisis can use it without paying — that's integrity).

### Phase 1: First 100 users (weeks 1-4 after paywall)

**Pre-launch (NOW — waiting on DUNS):**
- Lemon Squeezy APPROVED — set up products + paywall integration
- Collect 3-5 real testimonials from current testers
- Instagram story for UAT testers (posted)
- Personal network outreach (in progress)
- Finish native APK rebuild with all April changes

**Launch:**
- Reddit: ONE post, ONE shot. r/ADHD (2.3M), r/neurodivergent, r/anxiety, r/cptsd. Not an ad — a story. Opening line: "People don't want to be better. They want to be functional."
- Product Hunt submission same week
- @stillformapp Instagram — post promo reel

### Phase 2: 100-500 users (months 2-3)

Word of mouth kicks in or dies here. What makes people share:
- The AI said something that hit them — they screenshot it
- They felt understood for the first time by software
- They told a friend "this thing actually works"
- Shareable composure card (build this early — people share growth, not tools)

### Phase 3: 500-1,500 users (months 4-8)

- **FSA/HSA eligibility** — "my insurance pays for it" is a massive conversion unlock
- **App store presence** — organic discovery on Google Play + Apple App Store
- **One press hit** — Wired, Verge, or similar could do this in a week
- **Therapist channel** — the sleeper. One therapist with 40 clients who says "try this between sessions" = 40 qualified leads. Build relationships with therapists who can't see clients daily but want them to have a tool between sessions.
- **Clinical partnerships** — approach practices that treat ADHD, anxiety, PTSD. Offer provider dashboard (future feature).

### What Drives Retention (keeps users paying)

The AI relationship. Period. After 10 sessions the AI is irreplaceable because starting over means losing the relationship. That's not a dark pattern — that's earned trust through:
- 9-category memory that makes them feel known
- Session notes that prove it remembers what mattered
- Personality mirroring that makes it feel like their person
- Pattern tracking that shows growth they can't see themselves

### What Keeps Integrity

- No engagement tricks. No streaks. No "you missed a day" notifications.
- The product works or it doesn't. Retention is proof of value.
- One price. No upsells. No "premium AI" tier.
- Quick Breathe free for anyone in crisis.
- Data is theirs. Delete everything anytime.
- The less you need the app, the more it's working.

### Pre-Launch Checklist (blocked on DUNS, ~25 days)

- [ ] DUNS number received
- [ ] Google Play org account ($25)
- [ ] Apple Developer Program ($99)
- [ ] Lemon Squeezy products created ($14.99/mo + $9.99/mo annual)
- [ ] Paywall integrated into stillformapp.com
- [ ] Test mode purchases verified
- [ ] 7-day free trial configured
- [ ] Native APK rebuilt with all April changes
- [ ] 3-5 real testimonials collected
- [ ] Reddit post drafted and reviewed
- [ ] @stillformapp Instagram created
- [ ] Promo reel posted
- [ ] Privacy policy updated in Termly

---

# 12 — Implementation Status (April 4, 2026)

## Built & Live on Web

- ✅ Guided assessment (5 scenarios, full composure spectrum)
- ✅ Adaptive home screen (thought-first: Reframe dominant. Body-first: Breathe dominant. Balanced: all tools equal weight, no hierarchy)
- ✅ Home screen rebalances immediately when processing type changes in Settings
- ✅ Morning check-in card on home screen (energy + hardware, daily)
- ✅ Updated onboarding tutorial (6 slides, science-backed, research links, swipe navigation)
- ✅ Processing Type in Settings (changeable anytime)
- ✅ Re-run Calibration in Settings
- ✅ AI response principles in all 3 system prompts
- ✅ 80/20 cadence rule in AI prompt
- ✅ 9-category awareness in AI prompt
- ✅ Regulation type sent to AI and used in responses
- ✅ Post-session AI summary (background call, stores last 20 notes)
- ✅ Session notes fed into future API calls (last 5 notes)
- ✅ First pattern note at session 3 (moved from 5)
- ✅ 7-session review milestone with type mismatch detection
- ✅ Absence detection (14+ days, operator tone)
- ✅ First-session quick win on all completion screens (breathing + body scan)
- ✅ Service worker cache bust (network-first strategy)
- ✅ Bigger textarea for Reframe input (3 rows, Shift+Enter for newlines)
- ✅ Reframe loading state auto-resets on mount + 30s safety timeout
- ✅ Continue button when returning to Reframe conversation
- ✅ Reframe modes renamed: Talk it through / Break the loop / Get ready
- ✅ Mode descriptors show what AI does differently
- ✅ Neutral signal language throughout (no negative-only framing)
- ✅ Completed calibration tools hidden from home screen
- ✅ Positioning copy updated throughout
- ✅ Widget working (Android, SharedPreferences → Capacitor plugin)
- ✅ All Jonny audit fixes intact
- ✅ "Sudden urgency" replaces "clarity spike" in sensations
- ✅ "Ready" added to morning check-in energy options

### April 7 Session — All pushed and live:

**AI Engine Overhaul:**
- ✅ GPT-4o Mini → GPT-4o (dramatically better quality)
- ✅ Max tokens 180 → 500 (AI was being strangled)
- ✅ CRITICAL BUG FIX: Multi-turn conversations were broken — history sent role "ai" but API expects "assistant." Every follow-up was silently erroring. Fixed.
- ✅ Perspectives-first response format in all 3 prompts — AI gives 2-3 angles BEFORE asking questions
- ✅ Questions now OPTIONAL — sometimes the reframe IS the response
- ✅ Questions must sound like a friend ("Sound right?") not a therapist ("What would help you feel more aligned?")
- ✅ Voice directive: "Talk like someone who's been through some shit. If your response could appear on a motivational poster, rewrite it."
- ✅ Therapy jargon banned: "dynamics," "aligned," "processing," "sit with that," "unpack that," "space to explore"
- ✅ 5 golden response examples (GOOD vs BAD) in calm + clarity prompts
- ✅ Pattern respect added to all 3 prompts ("Is it the same, or just similar?")
- ✅ Ego awareness added to all 3 prompts ("Something about that landed wrong. What part?")
- ✅ Chronic illness energy conservation in bio-filter ("We can afford five minutes of this")
- ✅ Time awareness — AI knows day of week + time of day. Late night sessions hit different.
- ✅ "On fire" energy option + AI overcommitment/blind spot handler for positive states
- ✅ Flat state instruction rewritten — match casual energy, be specific not generic
- ✅ 7-session review rewritten as AI insight, not software correction

**Naming & Language:**
- ✅ Signal Log → Pulse (everywhere: app, docs, promo, FAQ, settings, export, biometric lock, delete confirmation)
- ✅ "Journal" tab → "Pulse" on Reframe screen
- ✅ "Not meditation. Not therapy." removed from all docs and app
- ✅ Clinical language simplified: parasympathetic → "tells your body to slow down," cognitive biases → "thinking patterns that run on autopilot," cognitive baseline → "brain running slower than usual"

**UX Fixes:**
- ✅ AI message font 19px → 16px (more conversation visible on mobile)
- ✅ Removed competing "What triggered this?" input from active Reframe conversation
- ✅ Butterflies added to signal mapping sensations
- ✅ Multi-select hardware check (pain + under-rested = different baseline, "All clear" deselects others)
- ✅ "On fire" energy option in morning check-in
- ✅ Home screen greeting updated: "when things are hard AND when things are going great"
- ✅ Standalone Pulse screen: "Check your pulse" → unified with Reframe tab

**Analytics:**
- ✅ Behavioral analytics: 5 new Plausible events — Breathing Completed, Body Scan Completed, Reframe Deep Engagement (5+ messages), Morning Check-In, Assessment Completed
- ✅ (User must add Goals in Plausible settings for events to show)

**UAT Dropdown:**
- ✅ Rebuilt with 3 sections: ★ NEW THIS WEEK (red, flashing badge) / ✓ ALREADY SHIPPED / ⬡ COMING SOON
- ✅ Full 19-item roadmap restored + "+ more in development"

**Content & Credibility:**
- ✅ Blog post live: stillformapp.com/blog-two-pathway-regulation.html (cites Ochsner, Gross, Price & Hooven, Buhle, Kanbara)
- ✅ Mobile-friendly project transfer HTML generated

**Positioning & Strategy:**
- ✅ "Executive Composure" as category name (for Product Hunt, press, Reddit)
- ✅ "Trainer, not a crutch" — Signal Awareness Latency proves the app builds a skill
- ✅ $20K/month revenue strategy documented (3 phases, pre-launch checklist)
- ✅ Composure when winning — locked decision: "This is core, not an afterthought"
- ✅ Pricing confirmed: $14.99/mo or $9.99/mo annual. 14-day free trial.
- ✅ Courage line: "Courage isn't the absence of fear. It's acting clearly while the signal is still running."
- ✅ Confidence line: "Confidence isn't knowing you'll win. It's knowing you won't lose yourself in the process."

**Psychology (documented in Section 9):**
- ✅ Metacognition is the product — "If a feature feels like a form, it's wrong. If it feels like a mirror, it's right."
- ✅ Data integrity always — framing protects, filtering lies. Never hide, suppress, or curate.
- ✅ The mirror has guardrails — present neutrally, let them interpret.
- ✅ Trauma blocks potential, not ability — capability is sequestered, not lost
- ✅ Fear + ego as tag-team security guards (energy bankruptcy + hope bankruptcy)
- ✅ Stubbornness = redirected persistence — recruit it, don't fight it
- ✅ Lower stakes to bypass ego — micro-wins rebuild confidence circuitry
- ✅ Observer Hack IS metacognition IS the product
- ✅ Chronic illness ego dynamics — resistance in low-energy = system conserving resources
- ✅ Composure clears the path — noise gets quieter, you hear yourself think
- ✅ Most people don't know the noise is there — first session is the revelation

**Business:**
- ✅ Lemon Squeezy APPROVED (April 7) — paywall ready to implement, products not yet created
- ✅ DUNS applied — blocks BOTH Google Play + Apple (~25 days)
- ✅ Multi-session coordination rules added to top of doc
- ✅ Instagram story drafted for UAT testers
- ✅ Text message drafted for existing testers

**Tester Analytics (April 7):**
- Irvington NJ → Kapil (confirmed, near Short Hills)
- Ridgewood NJ → Sean Emmerling (+ user's own visits)
- Bergenfield NJ → Paula (near Teaneck)
- Brooklyn → likely Ronnie (Jonny Porto's sibling — Jonny may have shared link)
- Holtsville → sister-in-law on Long Island
- NYC × 3 → Ive + link previews + unknowns
- 9 unique visitors from Instagram story where link was NOT included — people found it on their own

## Needs Mac (Native Rebuild — WIP, DUNS pending ~25 more days — required for Google Play + Apple)

- ❌ Native APK with all changes (pull + build + install + clear SW cache)
- ❌ Test widget with new code on device
- ❌ Watch haptics testing
- ❌ Share extension testing

## Ship Checklist (MANDATORY — every code change)

Before pushing any change, Claude must check each item. If it applies, update it in the same commit. No exceptions.

| # | Check | When it applies |
|---|-------|----------------|
| 1 | **UAT dropdown** | Any user-visible change — add to ★ NEW THIS WEEK |
| 2 | **Tutorial** | Any new feature or renamed feature |
| 3 | **FAQ** | Any change to how a feature works or what it's called |
| 4 | **Transfer doc** | Every change, always |
| 5 | **Plausible event** | Any new trackable action (add Goal name to doc + code) |
| 6 | **Privacy policy note** | Any new data collected or new provider |
| 7 | **Science sheet** | Any new research-backed feature |
| 8 | **AI prompts** | Any change that affects Reframe context (new data sent to API) |
| 9 | **Promo** | Any feature worth marketing |
| 10 | **Punch list** | Add testable item for the change |
| 11 | **Emotion coverage** | Any change to Pulse/chips — verify balance of positive, negative, and neutral emotions. No bias toward negative. |

**Interpersonal Microbiases — Layer 1 (SHIPPED):**
- 5 microbiases added to AI prompts: intensity amplification, state projection, attribution error, emotional contagion blindness, impact gap
- AI watches for interpersonal content and names the bias cleanly
- Connects bio-filter state to interpersonal reads (depleted + reading hostility = flag it)

**Interpersonal Microbiases — Layer 2 (NOT YET BUILT):**
- Expand Blind Spot Profiler with interpersonal bias scenarios
- 5 scenarios testing for the 5 microbiases
- "Your partner goes quiet after a disagreement. What's your first thought?" → maps default
- AI gets interpersonal bias profile in addition to cognitive distortion profile

## Not Yet Built

- ❌ Calendar-aware morning practice (reads device calendar)
- ❌ Health integration (HRV, sleep, heart rate, cycle data auto-populating)
- ❌ Screen time awareness context
- ❌ Location-aware AI responses
- ❌ Weather/barometric pressure context
- ❌ Anticipatory regulation (post-event cool-down checks)
- ❌ State-to-Statement translation
- ❌ Signal Awareness speed visualization
- ❌ Composure Gate (system-level app interceptor)
- ❌ Cloud sync infrastructure
- ❌ Premium sound packs
- ❌ PDF/CSV export
- ❌ Shareable composure card
- ❌ Privacy policy update (managed in Termly — update through Termly dashboard)
- ❌ DUNS number (applied, waiting on approval)
- ❌ Weekly AAR (After-Action Report) — AI-generated 3-sentence weekly briefing. Parked: needs API call, not a quick UI build.
- ❌ Haptic entrainment on native — 60 BPM vibration on long-press of CTA. Parked: Capacitor haptics installed but native-only, can't test from web.
- ❌ Server-side subscription verification — current paywall is localStorage honor system. Needs cloud sync infrastructure for real verification.


### April 8 Morning Session — All pushed:

**Discharge: KILLED**
- Having a "nothing saves" screen implied Reframe wasn't private. Undermined trust. Removed from all touchpoints.

**End of Day Check-In:**
- Appears after 6 PM, three taps: energy vs morning, composure held, one word
- AI gets yesterday's close as context next morning
- Plausible event: "End of Day Check-In"
- No forced positivity — "Heavy" is valid data

**Install Banner:**
- Amber banner when Chrome fires beforeinstallprompt
- Fallback text hint when Chrome throttles: "Install: tap menu → Add to Home Screen"
- beforeinstallprompt captured in index.html before React loads
- Hidden in standalone mode, dismissible

**PWA Fixes:**
- Service worker v5 with precache restored
- Chrome 146 confirmed: "Add to Home Screen" IS the install path (Chrome renamed it)
- PWA Builder: 0 errors, 2 warnings, 14 passes
- nav-logo user-select: none (STILLFORM tap no longer triggers Google search)

**Calibration Fixes (Bobby's first user session):**
- Back button steps backward instead of ejecting to home
- "SELECT ALL THAT APPLY" now prominent amber callout on all 3 steps

**FAQ Expanded (10 → 15 entries):**
- Added: Composure Telemetry, morning check-in, end of day, somatic interrupt, trial expiration
- Fixed: 7-day → 14-day trial, Journal → Pulse, composure when winning

**Tutorial Updated:**
- Heat map mentioned in "Your growth" slide
- End of Day mentioned in "Daily practice" slide
- Discharge removed from "Daily practice" slide

**Science Sheet Updated:**
- Added: Ghost Echo (self-efficacy, Bandura), End of Day (reflective practice, Schön)
- Removed: Discharge section

**Ship Checklist Established:**
- 10-point mandatory checklist for every code change
- Saved to Claude memory + transfer doc
- UAT, Tutorial, FAQ, Transfer doc, Plausible, Privacy, Science sheet, AI prompts, Promo, Punch list

### April 7 Late Night Session — All pushed:

**Lemon Squeezy Products (LIVE in test mode):**
- ✅ Product created: "Stillform" with two variants
- ✅ Monthly variant: $14.99/month, 14-day free trial, SaaS tax category
- ✅ Annual variant: $119.88/year ($9.99/month), 14-day free trial
- ✅ Both visible on single checkout page with radio selector
- ✅ Checkout link: https://embers.lemonsqueezy.com/checkout/buy/a150deb3-79d1-4418-904d-434662c9eed7
- ✅ Bobby (Robert Geismar) is registered owner — name shows on PayPal, normal for merchant accounts

**Paywall Integration:**
- ✅ Trial tracking: 14-day countdown starts on onboarding completion (stillform_trial_start in localStorage)
- ✅ Trial badge on home screen showing days remaining (turns red at 3 days, "Subscribe" link)
- ✅ Paywall gate: trial expired → forced to pricing screen, no back button
- ✅ Checkout button opens Lemon Squeezy with redirect back to ?subscribed=true
- ✅ Subscription detection from redirect param (stillform_subscribed in localStorage)
- ✅ Pricing screen updated: 7-day → 14-day trial
- ✅ Privacy section updated: GPT-4o Mini → GPT-4o
- ✅ Honor-system paywall (localStorage). Server-side verification comes with cloud sync.

**Composure Telemetry (Heat Map):**
- ✅ GitHub-style contribution graph on My Progress screen
- ✅ 12 weeks of data, sessions + Pulse entries combined
- ✅ Amber intensity by frequency per day
- ✅ M/W/F day labels, Less→More legend, hover shows date + event count
- ✅ Header: "Composure Telemetry" — flight recorder, not diary

**60 BPM Ambient Entrainment:**
- ✅ Two CSS animations at exactly 1s cycle (60 BPM = calm resting heart rate)
- ✅ entrain60: barely perceptible opacity shift (0.85→1→0.85) on identity line text
- ✅ entrain60glow: faint amber box-shadow pulse on CTA area
- ✅ Home screen only — tools have their own rhythms. Home is where user lingers before deciding.
- ✅ User feels calmer without knowing why. Body-first design.

**Discharge: REMOVED**
- Killed April 8. Having a 'nothing saves' screen implied Reframe wasn't private. Undermined trust.
- ❌ Removed from: app, bottom nav, tutorial, UAT, science sheet, punch list
- ✅ Full textarea, nothing saves to localStorage. Ever.
- ✅ Text opacity fades as user types (inverse of character count)
- ✅ "Discharge" button flashes amber "Cleared" and dissolves text
- ✅ "The value is in the act, not the record."

**Somatic Interrupt:**
- ✅ Monitors keystroke velocity in Reframe textarea
- ✅ 15+ keystrokes in 3 seconds = rapid typing detected
- ✅ Injects one amber line above input: "Drop your shoulders." / "Unclench your jaw." / "Soften your hands." / "Breathe out slowly." / "Feet on the floor."
- ✅ Fades after 5 seconds. No popup. No modal. Just a nudge.
- ✅ The system watches the body, not just the words.

**End of Day Check-In:**
- ✅ Appears after 6 PM on home screen if not already completed today
- ✅ Three taps: Energy vs morning (Better/Same/Worse), Composure held (Yes/Mostly/No), One word (Solid/Heavy/Sharp/Scattered/Quiet/Grateful/Drained/Proud)
- ✅ "Close the day →" saves to localStorage (stillform_eod_today)
- ✅ AI gets yesterday's close as context next morning session
- ✅ Plausible event: "End of Day Check-In"
- ✅ Morning sets the tone, evening closes the loop
- ✅ No forced positivity — "Heavy" is valid data. Silver lining comes from the AI next morning, earned not forced.

**Install Banner:**
- ✅ Amber banner with Install button when Chrome fires beforeinstallprompt
- ✅ Fallback text hint "Install: tap ⋮ menu → Add to Home Screen" when Chrome throttles the event
- ✅ Both hidden in standalone mode (already installed)
- ✅ Dismissible with ✕
- ✅ beforeinstallprompt captured in index.html before React loads (Chrome fires early)

**PWA Fixes:**
- ✅ Service worker v5 with precache restored (Chrome installability signal)
- ✅ Manifest reverted to working version (no experimental fields)
- ✅ Chrome 146 confirmed: "Add to Home Screen" menu item IS the install path — renamed by Chrome, not broken
- ✅ PWA Builder score: 0 errors, 2 warnings, 14 passes
- ✅ nav-logo user-select: none — tapping STILLFORM no longer triggers Google search

**Calibration Fix:**
- ✅ Back button in System Calibration now steps backward (3→2→1→0→home) instead of ejecting to home
- ✅ "SELECT ALL THAT APPLY" now prominent amber monospace callout on all 3 signal mapping steps
- ✅ Bobby's first real user session caught both issues

**Ghost Echo:**
- ✅ Faint line at 35% opacity on Pulse screens (standalone + Reframe tab)
- ✅ Pulls random past session with positive delta
- ✅ Shows: "Apr 3 — you shifted +2.4 in 2m 30s."
- ✅ Not motivational — evidential. Evidence you've navigated this before.

**Language & UX:**
- ✅ Clinical language simplified: "cognitive biases" → "thinking patterns that run on autopilot", "cognitive baseline" → "brain running slower than usual", "physiological sighs" → "Three deep sighs"
- ✅ UAT dropdown rebuilt: 3 sections (★ NEW THIS WEEK / ✓ ALREADY SHIPPED / ⬡ COMING SOON) with flashing NEW! badge
- ✅ Full 19-item roadmap restored in Coming Soon + "+ more in development"
- ✅ Composure when winning threaded through: home screen, FAQ, AI energy handler, morning check-in ("On fire" option), doc locked decision

**Netlify:**
- ✅ Auto-publishing LOCKED — deploys are now manual. Claude pushes to GitHub, user triggers deploy in Netlify when ready.
- ✅ Pro plan $20/month — 383 deploys burned 5,745 credits. Manual deploys will cut this 90%.
- ✅ Consider downgrading to free tier after launch (password protection removed, bandwidth is 0.06GB of 100GB free tier).

## Known Issues / Gaps for Next Session

- **Plausible Goals not set up** — User must add Goals in Plausible dashboard for: "Breathing Completed", "Body Scan Completed", "Reframe Deep Engagement", "Morning Check-In", "Assessment Completed", "Pulse Entry", "End of Day Check-In"
- **AI quality still tuning** — GPT-4o is live, prompts significantly improved, but novel scenarios can still produce generic responses. Continue testing and adding golden examples.
- **Privacy policy outdated** — needs update in Termly for: regulation type assessment, AI session notes, morning check-in storage, bio-filter data, Plausible events, GPT-4o as AI provider, device-local storage, AES-GCM encryption.
- **No real user sessions yet** — Need 3+ real user sessions with testimonials before Reddit launch.
- **Paywall needs end-to-end testing** — Test with 4242 card in Lemon Squeezy test mode. Verify redirect back to app marks subscription. Verify trial countdown works correctly.
- **Annual checkout link is shared** — both Monthly and Annual variants show on the same checkout page. One link handles both. Confirmed working.
- **Android APK is stale** — dozens of web changes since last native build. Must rebuild before any native testing.
- **Service worker caching** — remains a dev-time issue. After every deploy, old JS may be served. Incognito tab or clear cache to test fresh.
- **Copyright not filed** — $65 at copyright.gov. Bobby wants this done ASAP.
- **DUNS number pending** — blocks both Google Play ($25 org) and Apple Developer ($99). ~25 days from application.
- **Discharge screen uses useState inside IIFE** — may cause React warnings. Watch for issues on deploy. If problems, refactor to component-level state.

## Parked Features (evaluated, not built — revisit later)

- **Velocity Indicator** (amber color shift based on typing speed) — Somatic interrupt already does the functional version. Showing state without intervening is a mirror without a hand. Skip.
- **Gestural Blind Logging** (swipe zones for state logging) — conflicts with normal scrolling. Accidental logs remove intention, and intention is the product. Skip.
- **Focus Lock / Deep Mode** — PWA fullscreen already handles this. Native status bar hiding via Capacitor. Not a web build.
- **State Delta Vector Lines** (connecting pre/post dots on scatter plot) — pre/post rating + avg shift already exist. Visual vector is polish for 200+ users. Park.
- **"High-Stakes Presets"** (named composure modes like "The Boardroom") — 3 Reframe modes already do this functionally. Named presets add complexity for no functional gain. Skip.
- **Dynamic Resistance UI** (longer button press when agitated) — interesting concept but adds friction when the user needs speed. Contradicts zero-friction principle. Skip.
- **Influencer outreach strategy** — 30-day extended trial then subscription at cost (~$2-3/month, covers API). NOT free — at cost preserves integrity. Standard users get 14-day trial at $14.99/mo. Influencers get 30-day evaluation then cost-only rate. No paid endorsements. Their honest take IS the endorsement.

**Growth sequence (locked):**
1. Reddit launch — free, r/ADHD + r/anxiety + r/neurodivergent. Prove the product converts.
2. Hit 100 subscribers — validate pricing, collect testimonials, learn conversion rate.
3. Nano/micro influencer outreach — spend money only after free channels prove the product works.
4. Instagram ads — only after social proof exists and conversion rate is known.

**Tier 1 targets (perfect alignment — reach out at 100 subs):**
- Jessica McCabe (How to ADHD) — 1.9M YouTube. Her channel IS the ADHD toolbox.
- Dani Donovan — comic artist, keynote speaker, "The Anti-Planner" author
- Connor DeWolfe — 5.2M TikTok, ADHD + anxiety
- Dr. Sasha — board-certified psychiatrist, 900K+ TikTok
- Jenna (ADHD therapist who HAS ADHD) — therapist channel in one person

**Tier 2 targets (strong alignment):**
- Chalene Johnson — 780K+ Instagram, business owner with ADHD (Executive Composure fit)
- ndwellness — 157K TikTok, Autism + ADHD, late diagnosis
- Tracy — holistic coaching post-accident (Rebuilder persona)
- Hayley Honeyman — 280K YouTube + 233K Instagram
- Rich & Rox (ADHD Love) — 789K TikTok, ADHD couple

**Tier 3 targets (niche, high trust):**
- Kelly B — 357K TikTok, ADHD coach
- René Brooks (Black Girl, Lost Keys) — deep ADHD research, high trust
- Nik — ADHD lifestyle mentor, "ADHD superpowers" framing

**Outreach approach:** "I built a composure system for people who feel everything at full intensity. I'd like you to try it for 30 days. If you subscribe after, it's at cost — just covers the AI. If it doesn't work for you, no obligation. If it does, I'd love your honest take."

**Performance tier:** Each influencer gets a unique discount code for their audience. If their code generates enough subscribers (25 active subscribers from their code still paying at the 3-month mark = free access earned. One number, one date, one check. Discount code price: $12.99/mo (vs $14.99 standard). Discount exists to track attribution, not to compete on price), their subscription becomes free. We're a startup and can't afford free lifetime access upfront — but we can earn our way there together. This keeps it honest: they're not getting paid to promote, they're getting rewarded for results.
- **State-to-Statement** — on roadmap, planned for pre-launch sprint (one session build)
- **Shareable composure card** — on roadmap, planned for pre-launch sprint (one session build)

## Pre-Launch Sprint (during DUNS wait, ~25 days)

- [x] Lemon Squeezy paywall products created (test mode)
- [x] Paywall wired into app (trial tracking + checkout redirect)
- [ ] Test paywall end-to-end (4242 card, verify redirect + subscription detection)
- [ ] Switch Lemon Squeezy to live mode when ready
- [ ] State-to-Statement feature
- [ ] Shareable composure card
- [ ] Native APK rebuild (needs Mac)
- [ ] Copyright filed ($65)
- [ ] Plausible Goals configured (6 events)
- [ ] Privacy policy updated in Termly
- [ ] 3-5 real testimonials collected
- [ ] Reddit post drafted
- [ ] @stillformapp Instagram created
- [ ] Influencer outreach list finalized
- [ ] Evaluate Netlify downgrade to free tier (password protection removed)
- [ ] Test checkout in LIVE mode before launch — verify: variant selector shows Monthly/Annual, PayPal doesn't show personal name, receipt button says "Open Stillform" linking to stillformapp.com

---

ARA Embers LLC · Stillform Project Transfer · April 2026
