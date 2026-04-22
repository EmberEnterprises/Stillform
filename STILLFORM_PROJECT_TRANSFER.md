# STILLFORM

**Project Transfer Document**

ARA Embers LLC · April 2026 · For Stillform Project in Claude

> *Paste this document into the **Stillform** Claude project on session start. Historical context remains useful, but always follow the "Current-main refresh" below for launch-critical truth.*

## Current-main refresh (April 17, 2026)

- Share-to-Reframe is implemented on Android and requires first-run completion before shared text auto-routes into Reframe.
- Wear OS breathing bridge is implemented (phone `WatchBridge` + `android/wear` module) and should be treated as "implemented, verify on paired devices."
- Calendar + Health integration controls are currently supported in native iOS builds; Android currently reports these integrations as unavailable.
- `STILLFORM_LAUNCH_TRANSFER_NEXT.md` is now used as a concise handoff snapshot for current merged state.

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

## Morning Check-In (BUILT — April 4, integrations partially shipped)

Daily check-in card at top of home screen. Two quick taps:

- Energy: Low / Steady / High / Ready / Wired
- Hardware check: multi-select — All clear / Depleted / Under-rested / Pain present / Activated / Medicated (user can select multiple, e.g. pain + under-rested). All selections sent to AI as combined context.
- "Set my tone →" saves and collapses to "✓ Checked in · tap to update"
- Bio-filter sends all selected hardware states to AI — combined context changes how AI interprets signals (pain + under-rested is a different baseline than either alone)
- Calendar + health integration path exists in current main, with native iOS support and Android unavailable-state messaging.

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
- Share extension: implemented on Android (verify on device after first-run completion)
- Watch haptics: implemented with Wear OS module + phone bridge (verify on paired hardware)
- Web fallback: all native features gracefully degrade on web
- PENDING: Apple Watch companion parity and Android calendar/health support
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
- **Executive coach channel** — high-fit distribution for operator framing. Partner with executive/performance coaches who can position Stillform as a between-session composure system for leaders under pressure.
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

**BEFORE EVERY PUSH — NO EXCEPTIONS:**
Pull the live file from GitHub and verify every claimed change is actually present. Do not tell Arlin something is done until it is confirmed in the live deployed file. This is non-negotiable. Integrity is the standard.

| # | Check | When it applies |
|---|-------|----------------|
| 1 | **VERIFY LIVE** | Pull live file from GitHub and confirm every change is present before claiming it's done. No exceptions. Ever. |
| 2 | **UAT dropdown** | Any user-visible change — add to ★ NEW THIS WEEK |
| 3 | **Tutorial** | Any new feature or renamed feature |
| 4 | **FAQ** | Any change to how a feature works or what it's called |
| 5 | **Transfer doc** | Every change, always |
| 6 | **Plausible event** | Any new trackable action (add Goal name to doc + code) |
| 7 | **Privacy policy note** | Any new data collected or new provider |
| 8 | **Science sheet** | Any new research-backed feature |
| 9 | **AI prompts** | Any change that affects Reframe context (new data sent to API) |
| 10 | **Promo** | Any feature worth marketing |
| 11 | **Punch list** | Add testable item for the change |
| 12 | **AI stress test** | Any AI prompt change must pass all 19 scenarios before shipping. Zero regressions. |

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


### April 8 Radiology Session — Research + Feature Specs

**Neuroscience Research Added (Science Sheet now 18 sections):**
- Affect Labeling (Lieberman 2007) — Pulse emotion chips reduce amygdala activation
- Emotional Granularity (Barrett, Kashdan 2015) — 12 distinct chips train precise emotion recognition
- Window of Tolerance (Siegel 1999) — entire product keeps users in the functional zone
- Implementation Intentions (Gollwitzer 1999) — 5-scenario assessment pre-loads regulation pathway
- Default Mode Network (Raichle, Brewer) — breathing interrupts rumination circuit
- Autonomic Flexibility (Thayer, Lehrer) — what the app trains over time
- Stress Inoculation (Meichenbaum) — daily practice model
- Interpersonal Microbiases (Nature Communications 2025) — EQ layer in AI prompts

**Interpersonal Microbiases — Layer 1 SHIPPED (AI prompts):**
- 5 microbiases: intensity amplification, state projection, attribution error, emotional contagion blindness, impact gap
- AI watches for interpersonal content and names the bias
- Connects bio-filter to interpersonal reads

**Emotion Chips Rebalanced:**
- OLD: 10 negative, 1 positive, 1 neutral
- NEW: 6 positive (Calm, Grateful, Proud, Relief, Joy, Excitement) + 2 neutral (Restless, Mixed) + 10 negative
- Positive listed FIRST — Barrett's research: positive granularity matters
- Ship checklist now 11 items — #11: Emotion coverage balance

**FAQ Expanded (10 → 15 entries):**
- Added: Composure Telemetry, morning check-in, end of day, somatic interrupt, trial expiration
- Fixed: 7-day → 14-day trial, Journal → Pulse, composure when winning

**Discharge KILLED:**
- Having a "nothing saves" screen implied Reframe wasn't private. Undermined trust.
- Removed from: app, bottom nav, tutorial, UAT, science sheet, punch list

**BrainTingle Competitive Analysis:**
- Founded 2019, dead by ~2021. Tried habits + social + gamification + donations + blockchain. Too many features, no depth.
- Stillform is the opposite: one tool, deep, personal, no gimmicks. Every feature traces to peer-reviewed research.

---


### April 8 Afternoon — AI Stress Test + Product Challenge Session

**AI Framework Overhaul (ALL PUSHED — 19/19 scenarios passing):**
- Ran 19 real-world scenarios through live AI endpoint
- Initial score: 2/6 passing. Final score: 19/19 passing
- FIX 1: Bio-filter moved to TOP of context injections (was being ignored in middle)
- FIX 2: Crisis detection hard-coded BEFORE API call (19→30+ crisis terms, normalized input)
- FIX 3: Confidence/advocacy instruction added prominently (reflect strength before advice)
- FIX 4: Real pain can't be labeled as distortion (betrayal ≠ emotional reasoning)
- FIX 5: Silencing dynamics golden example added (control loops in relationships)
- FIX 6: ADHD paralysis golden example added (freeze ≠ planning problem)
- FIX 7: Immigrant/outsider experience golden example (room-reading IS intelligence)
- FIX 8: Financial scenario golden example (no payday loan suggestions)
- CRITICAL: Liability guard hard-coded — scans input for financial/medical/legal terms, prepends prohibition to system prompt. 49 trigger terms across 3 domains.
- Test harness saved with 19 scenarios. Every prompt change must pass all 19 before shipping.

**Tested Scenarios:**
1. Attribution error ✅ | 2. Bio-filter + interpersonal ✅ | 3. Confidence/speak up ✅
4. Crisis language ✅ | 5. Composure when winning ✅ | 6. Medical leave betrayal ✅
7. Silencing spouse ✅ | 8. Immigrant imposter ✅ | 9. Parent losing it ✅
10. Manipulation attempt ✅ | 11. Racial microaggression ✅ | 12. ADHD paralysis ✅
13. Toxic positivity grief ✅ | 14. 2AM spiral ✅ | 15. Financial anxiety ✅
16. Flirting/boundary ✅ | 17. Substance use ✅ | 18. Medical advice fishing ✅
19. Legal advice fishing ✅

**Tutorial Restructure (TO BUILD):**
- CUT from 6 slides to 1 slide + assessment
- Slide 1: What Stillform is (one paragraph). Then straight into 5-scenario assessment.
- Remaining 5 slides content moves to:
  - Promo page (sells depth to people deciding)
  - FAQ page (catches users who want to understand more)
  - Contextual tooltips (delivered at the moment each feature is first encountered)
- Research links move to FAQ/Settings — credibility seekers find them, action-first users aren't blocked
- Skip button stays. Full tutorial replayable from Settings.

**Voice Integration Note:**
- Neuro voice companion needs accent/pronunciation calibration step
- "Say these 5 sentences" → builds voice profile → corrects transcription bias
- Founder's Armenian New Jersey accent turns "please" into "fiz" in transcription
- This is an accessibility requirement, not a polish feature


### April 8 Evening — Live Testing Session (post-ketamine)

**Bugs Found & Fixed:**
- FractalBreathCanvas crash on mobile — recursive drawing caused stack overflow. Rewritten as iterative stack with 200-iteration cap, 150ms mount delay. All bio-filter options now work.
- Speech recognition (mic button) only captured one phrase on Android — Chrome kills continuous recognition between pauses. Fixed with auto-restart on onend unless user intentionally stopped.
- Obsolete "Different states need different patterns" tip removed — written for 4 patterns, meaningless with 2.

**UX Improvements from Live Testing:**
- EOD energy: "Energy vs this morning?" → "Where's your energy?" (Full/Steady/Low/Empty). Old version anchored to negative comparison. AI calculates delta silently.
- EOD composure: "Hold composure when it mattered?" → "How'd you carry yourself today?" (Solid/Mixed/Rough). Old version was a pass/fail test. New version is an observation.
- Breathing simplified: 4 patterns → 2 (Quick Reset 60s, Deep Regulate 3min). Research shows pattern doesn't matter — attention to breath is the active ingredient.
- Crisis screen: all numbers now tap-to-call (tel: links), text lines tap-to-text (sms: links)
- Reframe first-time explainer: "This is an AI that learns your patterns" shows once, never again
- Pulse rotating placeholders: daily rotation of specific questions instead of vague "Add context"
- Fractal breathing visuals: working on mobile, iterative rendering, settings toggle ON by default

**Code changes shipped this evening:**
- Commits: breathing simplification, fractal rewrite, speech fix, tip removal, EOD energy, EOD composure, crisis links, Reframe explainer, Pulse placeholders


### April 8 Final Evening Session — Live Testing + Ketamine Ideas

**Code shipped this evening (all pushed, all deployed):**
- FractalBreathCanvas rewritten — iterative, mobile-safe, no more crash
- Speech recognition auto-restart on Android (mic kept dying between phrases)
- Breathing simplified 4 → 2 (Quick Reset 60s, Deep Regulate 3min)
- Obsolete breathing pattern tip removed
- Crisis screen: tap-to-call tel: links on all numbers
- Reframe first-time explainer: "This is an AI that learns your patterns"
- Pulse rotating note placeholders (daily rotation of specific questions)
- EOD energy: "Where's your energy?" (Full/Steady/Low/Empty) — no morning comparison
- EOD composure: "How'd you carry yourself today?" (Solid/Mixed/Rough) — not pass/fail
- Check-in time windows: morning only shows 4:30 AM–6 PM, EOD after 6 PM
- User-configurable check-in times in Settings
- Evening Reframe prompt after EOD: "Anything you want to clear before bed?"
- "Start Free Trial" → "Subscribe" everywhere
- Three Reframe mode buttons KILLED — AI auto-routes from feel state + input content
- Pulse entries from today proactively referenced by AI in Reframe
- Historical Pulse entries stay background context for pattern recognition

**Specs documented for future build:**
- Confirmation Loop: "Does that land?" post-session (Yes/Not quite/Off base)
- Pulse → Reframe direct flow (log entry → "Want to talk through this?")
- Pulse as entry point inside Reframe, not separate screen
- Incubation reframe for flat/stagnant states
- Voice accent calibration for Neuro
- Research partnership (after infrastructure)
- B2B clinical channel (after product proven)

**Current code state:**
- Latest commit: c7b4459
- App.jsx: ~7,987 lines
- reframe.js: ~560 lines
- 19/19 AI test scenarios passing
- Netlify auto-publish ON

**NEXT SESSION PRIORITIES (in order):**
1. Supabase cloud infrastructure (auth, sync, backup, subscription verification)
2. Paywall end-to-end test (4242 card through Lemon Squeezy)
3. TestFlight build (Xcode signing, App Store Connect)
4. Morning check-in → Reframe morning mode flow
5. Evening Reframe mode (closure AI, not analysis)
6. Mandatory post-session rating (full screen, no skip)
7. Offline reframe fallback (API failure = self-guided graduation)
8. Pulse → Reframe direct flow
9. Kill Pulse standalone screen (data entry happens in flows, viewing in My Progress)
10. "?" help icon in nav + FAQ to top of Settings
11. Promo page update


## Priority Builds — Next Sessions

### Neuro — Voice-Guided Composure Companion

**What:** Voice interface inside the app. Wake word "Neuro" while app is open.

**Interaction model:**
- "Hey Neuro" → "What do you need?"
- "Breathe" → asks pattern if no default, or starts default immediately
- "Breathe regulate" / "Breathe box" → starts specific pattern
- "Body scan" → starts body scan with voice guidance
- "Talk it out" → opens Reframe in voice mode, full conversation
- "How am I doing" → reads composure telemetry summary
- "Check in" → morning or EOD check-in by voice

**"Talk it out" is the killer feature.** Full voice conversation with Reframe AI. No typing. Neuro speaks back with full context (bio-filter, session count, patterns). For visual thinkers, people in crisis, people who can't type.

**Why it's not a novelty:** Calm's voiceovers are pre-recorded scripts. Neuro is dynamic — it knows your state, your history, your blind spots. "You're running on depleted today — let's start with Regulate, it's gentler."

**Technical approach:**
- Web Speech Recognition API (Chrome Android) for input
- Web Speech Synthesis API for Neuro's voice
- Wake word: continuous recognition while app is foreground, listening for "Neuro"
- Routes to existing tools — no new tools needed, just voice entry points
- Won't work in background (web limitation) — only when app is open
- Native build can extend to background listening later

**Build order:** 1) Mic button in Reframe (voice-to-text input) → 2) AI response read aloud → 3) Voice commands for tools → 4) Wake word detection → 5) Full voice-guided sessions

### Fractal Breathing Visual (Prototype Built, Tested)

**What:** Organic branching fractal animation behind the breathing ring. Branches grow on inhale, dissolve on exhale. Amber particles drift.

**Status:** Prototype built and tested. User tested during CT scan prep — reported it was effective for grounding. Ready for integration.

**Research:** Natural-form fractals reduce stress up to 60% (Taylor, UO). Fractal geometry induces alpha brain wave responses (Hagerhall et al. 2015). NOT proven to be additive over breathing alone — but user-tested and effective.

**Integration plan:** Settings toggle "Visual grounding: on/off" — available as background during breathing tool. Not forced. Not default. Users who need more visual grounding turn it on.

**Integrity note:** Don't ship visual features to look innovative. Ship them when users need them. The prototype exists for when user testing reveals demand.

### Visual Emotional Input (Future Build)

**What:** For visual thinkers who can't translate internal images to text. Instead of typing in Reframe, select from visual metaphors — weather patterns, pressure gauges, color gradients, textures. AI reads the visual selection and responds.

**Why:** Founder is a visual thinker. Significant portion of target users (ADHD, neurodivergent) process in images, not words. Text-based input is a broken path for them. This is accessibility, not novelty.

**Status:** Concept only. Needs design exploration. Post-launch.

### Lock Screen Quick Access

**What:** One-tap access to breathing without unlocking phone.

**Why:** In a moment of escalation, unlocking phone → finding app → navigating to tool is too many steps.

**Technical reality:**
- PWA cannot touch the lock screen. Period.
- Native Android: persistent notification with action buttons ("◎ Breathe" / "✶ Talk it out") in notification shade. One tap from lock screen.
- Native iOS: Lock Screen widgets (iOS 16+)
- Galaxy Watch companion IS the lock screen button — tap wrist, breathing starts

**Build order:** Galaxy Watch first (already planned). Persistent notification when native APK ships.

### Interpersonal Microbiases — Layer 2 (Future Build)

**What:** Expand Blind Spot Profiler with 5 interpersonal bias scenarios during calibration.

**Scenarios like:** "Your partner goes quiet after a disagreement. What's your first thought?" → maps interpersonal defaults (character judgment vs situation judgment, intensity amplification, projection)

**Status:** Documented. Layer 1 (AI prompts) already shipped. Layer 2 needs UI design.

---

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
- ✅ Server-side subscription verification foundation added (webhook + Supabase status table + app status check). Requires env vars + Lemon webhook configuration to go live.


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
- ✅ Checkout link: https://embers.lemonsqueezy.com/checkout/buy/540c609b-2534-4362-9e9f-0b07b08dbedc
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
- **DUNS — applied April 4** — Applied at dnb.com for ARA Embers LLC. Free, ~30 days, expected ~May 4. Apple approved enrollment via 5-day business verification (no DUNS needed). Google Play org account ($25) confirmed requires DUNS — blocked without one. When DUNS arrives, complete Google Play enrollment.
- **"Your data is encrypted and synced securely"** — sync claim is premature. Update to "Your data is encrypted." everywhere after Supabase is live. On punch list.
- **Dead code in ReframeTool** — `saveJournal`, `pulseChips`, `journalText`, `tab`/`setTab` states remain after Pulse tab removal. Harmless but should be cleaned up. On punch list.
- **Manual Pulse date format** — ✅ Fixed (April 8). Entries now use ISO date format so AI journalContext today-filter works correctly.
- **Post-session rating in Reframe** — ✅ Fixed (April 8). "Done for now" now gates through "Where are you now?" chip selection. preRating + postRating both saved to session record.
- **Morning check-in → Reframe handoff** — ✅ Fixed (April 8). "Set my tone →" now navigates directly to Reframe after saving.
- **AI fatigue in long conversations** — ✅ Fixed (April 8). reframe.js now injects fatigue guardrail at 6+ messages, explicitly prohibiting generic/repetitive/shortened responses.

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

## Punch List (post-cloud, post-launch)

- [ ] **Sync claim** — replace "Your data is encrypted and synced securely" with "Your data is encrypted." everywhere in the app. Update after Supabase is live.
- [ ] **Dead code cleanup in ReframeTool** — remove `saveJournal`, `pulseChips`, `journalText`, `tab`, `setTab`. All unreachable after Pulse tab removal.
- [ ] **journalContext date format (manual entries)** — existing Signal Log entries saved before April 8 use localized date format. Consider a one-time migration on app load to normalize all dates to ISO format.
- [ ] **Netlify credit usage** — deploys now manual. Batch code changes and push once per session, not per change. Claude must stage all edits locally before pushing.
- [ ] **Trial countdown integrity** — after launch, replace any static trial-day number UI with dynamic entitlement-based day count (server truth), keeping UAT static behavior only during testing.
- [ ] **Integration track visibility** — keep calendar/health/context integrations explicitly listed in launch sequencing (not implicit in roadmap only).
- [ ] **Calendar context ingestion** — scaffold complete pre-launch; provider hookup post-launch with explicit consent/revoke flow.
- [ ] **Health context ingestion** — scaffold complete pre-launch; provider hookup post-launch with explicit consent/revoke flow.

---

### April 8 — Ecosystem Audit + Fixes Session

**Ecosystem audit findings:**
- Data pipeline fully wired: feel state, bio-filter, signal profile, bias profile, check-in, EOD, session notes, session count, prior context all reach the API correctly
- Three gaps found and fixed: morning check-in dead end, no post-session rating in Reframe, manual Pulse entries never matched AI "today" filter
- AI fatigue in long conversations identified and guardrailed in reframe.js
- "Your data is encrypted and synced securely" is premature — punched for post-cloud fix
- Dead code left in ReframeTool after Pulse tab removal — punched for cleanup

**Code shipped (2 files, 1 push):**
- App.jsx: post-session rating gate, morning check-in → Reframe handoff, ISO date fix for Pulse entries
- reframe.js: AI fatigue guardrail injected at 6+ messages
- Commits: App.jsx `15f3870`, reframe.js `6a49979`

**Pulse tab removal (earlier same session):**
- Pulse tab removed from Reframe entirely — feel state auto-logs to Signal Log on session start
- FAQ, tutorial, What's New panel, naming all updated
- "Signal Log" renamed to "Pulse" everywhere user-facing
- Confirmed: `stillform_journal` is the single data store — always was. Journal/discharge were UI layers on same key.
- Commits: `bf32c61`, `5f206a9`, `af0849d`

**Netlify deploys:** Manual only. Batch all changes per session before pushing. Do not push per-change.

---

ARA Embers LLC · Stillform Project Transfer · April 2026

---

## April 9, 2026 — Full Day Session Log

### Morning (with Arlin):
- Footer shows everywhere, active screen link hidden: Subscribe · Settings · Crisis Resources
- Floating QB: draggable, repositionable, position saved, default top-right (y=80)
- Static Quick Reset removed from tool header
- Somatic nudge moved above input row — no longer overlaps typing area
- FAQ ? button added to nav bar
- Calibration: redundant screens removed (autoLaunch direct to tool, body null guard)
- My Patterns rebuilt: weekly trends, tool effectiveness, blind spot activity, temporal patterns, System Note. Fact-only language.
- Pulse merged into My Progress
- Morning check-in tension check added
- Character counter in Reframe (maxLength 2000)
- journalContext string mismatch fixed
- ciTension resets on check-in reopen
- Watch & Choose in Go Deeper, PatternsTool removed
- Ship checklist #1: verify live file before claiming done

### Afternoon:
- GPT-4o vision replaces OCR — reads bubble layout, knows who said what
- Multiple screenshots (up to 3, max 10MB each, 20MB total)
- Image guardrails: type whitelist, size limits (client + server)
- AI: HARD RULES in all 3 system prompts — banned phrases, no names, specificity, poster test
- AI: server-side post-processing — hard replacement of banned phrases
- AI: SCREENSHOT CONTEXT injection — AI knows screenshot text is not user's words
- AI: structure rule, oversharing guardrail, third-party privacy protection
- Build failures fixed: React.useRef (named imports), window.innerWidth at scope, dead tab reference

### Key lesson:
- Multiple pushes without sign-off, ship checklist not run before pushes
- Standard: build complete, ship checklist 22/22, Arlin's go, then push. Once.

### Current blockers:
- Supabase cloud sync (was supposed to be today — next priority)

---

## April 9 Evening — Cloud Sync Session

### Supabase project created
- URL: https://pxrewildfnbxlygjofpx.supabase.co
- Schema created via SQL Editor: user_data, backups, user_profiles tables
- RLS enabled on all tables — users can only access their own data
- Indexes on user_id + data_key for fast lookup

### What was built (staged, not yet pushed)
- Full Supabase sync module in App.jsx (before CryptoStore):
  - sbSignIn, sbSignUp, sbSignOut, sbRefreshSession
  - encryptForCloud, decryptFromCloud (AES-256, device key in IndexedDB)
  - sbSyncUp (uploads all SYNC_KEYS encrypted)
  - sbSyncDown (restores all keys from cloud)
  - sbPreUpdateBackup (full snapshot before any version change)
  - sbVersionCheck (runs on every app load, triggers backup if version changed)
  - sbCreateProfile (creates user_profiles row on first sign-in)
- Cloud Sync UI in Settings — sign in/out, sync now, signed-in email display
- Auto-sync after every Reframe session save (background, non-blocking)
- sbVersionCheck + sbSyncDown on every app open when signed in
- UAT, FAQ, Plausible events, punch list all updated

### Keys synced to cloud
stillform_sessions, stillform_journal, stillform_signal_profile, stillform_bias_profile, stillform_saved_reframes, stillform_ai_session_notes, stillform_regulation_type, stillform_breath_pattern, stillform_onboarded, stillform_reminder, stillform_reminder_time, stillform_audio, stillform_scan_pace, stillform_screenlight, stillform_reducedmotion, stillform_visual_grounding, stillform_subscribed, stillform_trial_start, stillform_qb_position

### Keys NOT synced (device-specific)
stillform_reframe_session_calm/clarity/hype (encrypted conversations, device-key protected)
stillform_biometric_enabled (device-specific)
stillform_sb_session (Supabase auth session)

### Post-push required
- Termly privacy policy update (new data flow: email + encrypted blobs in Supabase)
- Update "Your data is encrypted." everywhere — punch list item, post-cloud
- Paywall E2E test (4242 card, Bobby)
- TestFlight build
- 3-5 real testimonials before Reddit


---

## DEVELOPMENT STANDARDS — APPLY EVERY SESSION

### Before touching any code
1. Pull the live file fresh from GitHub. Never work from memory.
2. Read the relevant section before changing anything.
3. Plan the complete change — every file, every function, every checklist item — before writing a single line.
4. If removing a state variable: grep the entire file for every reference including JSX render.

### Ship checklist — run before every push
1. UAT dropdown — updated if user-visible change
2. Tutorial — updated if new feature
3. FAQ — updated if it changes how something works
4. Transfer doc — updated every session
5. Plausible event — added if trackable
6. Privacy policy — updated if new data collected
7. Science sheet — updated if research-backed
8. AI prompts — updated if affects Reframe context
9. Promo — updated if worth marketing
10. Punch list — testable item added
11. Emotion coverage — verify positive/negative/neutral balance if touching Pulse/chips
12. Scope lock — restate the exact request as “in scope / out of scope” before editing
13. Single-change discipline — do not make adjacent or “while I’m here” edits outside scope
14. Evidence gate — show exact changed lines + exact test evidence tied to the request
15. Push gate — no push without explicit user approval in the current thread
16. Clarification gate — if requirement is ambiguous, pause and ask before writing code

### Pushing rules
- Never push without Arlin's explicit go. No exceptions except clear crash fixes.
- One complete push per feature. Build it all, check it all, push once.
- After every push: verify every change is in the live file before saying it is done.
- Netlify deploys are manual. Arlin triggers them.

### Code rules
- Named imports only. Never React.useState, React.useRef, React.useEffect.
- Before removing any state variable: grep entire file for every reference including JSX render.
- Before any .split() or .map(): verify the variable cannot be null.
- Before any window.* call: verify it is inside a function, not at module scope.
- Every push: verify no tab refs, no React.* namespace, no broken expressions, all fragments balanced.

### AI and Reframe rules
- Banned phrases enforced server-side in post-processing — not just in prompts.
- Every AI prompt change: verify HARD RULES, FORBIDDEN phrases, SPECIFICITY TEST, POSTER TEST, OVERSHARING AWARENESS, STRUCTURE RULE all present.
- Screenshot inputs: isScreenshot detection and SCREENSHOT CONTEXT injection must both be present.
- No other person's name in AI responses.

### Diagnostic standard
- Full diagnostic before any fix. Not reactive one-line patches.
- Same issue never comes back twice.
- If checklist has failures: fix silently, rerun, only bring to Arlin at 100%.

---

## April 10, 2026 — Agent Session Log (Stability + Launch Readiness)

### What was shipped in code
- Reframe reliability hardening:
  - 3 retries with exponential backoff for AI calls
  - structured self-guided fallback after repeated failures
  - fallback sessions stored with `selfGuided: true`
  - calm inline fallback state (non-panic wording)
- Morning and evening Reframe routing:
  - morning check-in now opens Reframe directly (`entry_mode: morning`)
  - evening close prompt opens Reframe directly (`entry_mode: evening`)
  - morning/evening context instructions injected server-side
- Post-session rating:
  - "Where are you now?" completion made non-skippable
- Cloud sync:
  - safer upsert target and per-user restore behavior
  - dedupe by key on restore path
- Paywall:
  - checkout lock/loading guard added
  - safer error handling for broken trial state
  - subscribe state made reactive on redirect return
- Settings/pricing clarity:
  - removed leftover premium Cloud Sync placeholder
  - copy updated to reflect encrypted local + encrypted cloud backup path

### Ship checklist audit (this session)
1. **UAT dropdown** — ⚠️ Pending manual copy update if launch messaging is edited again.
2. **Tutorial** — ✅ Updated/checked for storage wording consistency.
3. **FAQ** — ✅ Updated for offline fallback + cloud privacy wording.
4. **Transfer doc** — ✅ Updated (this section).
5. **Plausible event** — ✅ Added/used for offline fallback path.
6. **Privacy policy** — 🔴 Pending human action in Termly (see pinned items).
7. **Science sheet** — ✅ Updated with neuroscience execution audit and risk notes.
8. **AI prompts** — ✅ Updated for morning/evening entry-mode behavior.
9. **Promo** — ⚠️ Pending; no promo copy refresh done in this session.
10. **Punch list** — ✅ Updated with new testable launch-hardening items.
11. **Emotion coverage** — ✅ No chip distribution changes in this session.

### Pinned user-required actions (do when able; not all required today)
1. Publish **Termly privacy policy update** explicitly stating:
   - encrypted cloud storage/backups via Supabase
   - email auth for Cloud Sync
   - restore behavior across devices
2. Switch **Lemon Squeezy test -> live** and replace checkout URL in app.
3. Run live checkout verification for **monthly + annual** and confirm variant mapping.
4. Run second-device cloud restore verification (sessions, pulse, profiles).
5. Configure/enable server-side subscription truth in production:
   - run `netlify/functions/_subscriptionSetup.sql` in Supabase SQL editor
   - set `SUPABASE_SERVICE_ROLE_KEY` and `LEMON_WEBHOOK_SECRET` in Netlify env vars
   - create Lemon webhook to `/.netlify/functions/subscription-webhook`
   - see `SUBSCRIPTION_SETUP.md` for exact steps

### Launch recommendation snapshot
- **Soft launch:** GO (controlled audience + close monitoring)
- **Broad launch:** WAIT until #1, #2, #3 in pinned actions are done

## April 13, 2026 — Tutorial + Onboarding Integrity Pass

### Shipped changes (published to `main`)
- Tutorial compressed from verbose multi-page stack to concise guided sequence:
  - Opening page + 5 guided pages (Calibration, Morning Check-In, Daily Regulation Tools, End-of-Day + My Progress, Run the Full Loop)
- Removed redundant standalone tutorial references that created tool confusion.
- `How You Process` assessment reduced from 5 scenarios to 3 scenarios to lower first-run repetition while preserving signal quality.
- Onboarding completion timing fixed:
  - `stillform_onboarded` now set only after final calibration step (baseline breathing selection), not at Begin Calibration.
- Home recommendations updated for combined calibration:
  - Blind Spots no longer surfaced as a separate recommended home item after combined setup.
- Visual/audit consistency fixes retained:
  - opening tutorial title no longer all-caps,
  - Jonny container behavior (`.ai-container` max-height) preserved.

### SHIP checklist audit (this pass)
1. **UAT dropdown** — N/A (no dropdown content changes in this pass).
2. **Tutorial** — ✅ Updated and locked to new guided sequence.
3. **FAQ** — N/A for this pass (FAQ content intentionally deferred for dedicated follow-up).
4. **Transfer doc** — ✅ Updated (this section).
5. **Plausible event** — N/A (no new tracked actions introduced).
6. **Privacy policy** — N/A (no new data collection paths introduced).
7. **Science sheet** — N/A (no new mechanisms introduced).
8. **AI prompts** — N/A (no Reframe prompt logic changes in this pass).
9. **Promo** — N/A (no promo copy changes in this pass).
10. **Punch list** — N/A (no new post-launch infrastructure task created by this pass).
11. **Emotion coverage** — N/A (no Pulse/chip distribution changes in this pass).

---

## April 19, 2026 — Current State Update

### ✅ Confirmed complete (do not revisit)
- Supabase cloud sync — fully built and tested across Mac + Android
- Lemon Squeezy webhook — pointing to subscription-webhook, 11 events
- Netlify env vars — all 6 set: ANTHROPIC_API_KEY, LEMON_WEBHOOK_SECRET, OPENAI_API_KEY, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL
- Termly privacy policy — updated
- Supabase SQL — all tables, RLS, policies run successfully
- Server-side subscription verification — fully wired end to end
- Biometric lock — app-open gate + foreground resume (one gate per session, optional in Settings)
- Settings restructure — 5 clean sections, complete, do not touch
- Hash routing + back button — all surfaces covered
- Setup bridge — two-page flow, 6 themes, demos, high contrast
- Daily rotating processing cues — 47 cues, rotates by day
- QR share link — fixed and working
- Watch sequence back button — fixed

### 🔴 What needs to be complete BEFORE TestFlight
TestFlight is a final QA pass, not feature discovery. Do not suggest TestFlight until every item below is done.

1. **Galaxy Watch haptic breathing** — needs Mac + Android Studio. Wear OS module exists, needs validation on paired device.
2. **Apple Watch companion** — not yet built. Needs Xcode + WatchKit.
3. **Apple HealthKit integration** — iOS native, needs real device verification.
4. **Google Health Connect** — Android, currently reports unavailable.
5. **Calendar integration** — iOS native, needs real device verification.
6. **Biometric lock** — needs native build testing on real device.
7. **Second-device cloud restore QA** — manual test.
8. **3-5 real testimonials** — required before Reddit.
9. **Reddit post** — drafted, needs final review.
10. **@stillformapp Instagram** — not yet created.
11. **Google Play closed testing build** — needs Mac + Android Studio.

### ❌ Do not suggest until app is complete
- TestFlight build
- App Store submission
- Reddit launch
- Product Hunt


---

## April 20, 2026 — Android Integration Session

### ✅ Completed today

**Android Health Connect + Calendar native plugin — WORKING:**
- `IntegrationBridgePlugin.kt` — reads sleep hours, HRV (RMSSD), resting heart rate from Health Connect last 24h; reads calendar events next 48h
- `MainActivity.kt` — converted from Java, registers all 3 plugins
- `AndroidManifest.xml` — correct `VIEW_PERMISSION_USAGE` + `HEALTH_PERMISSIONS` activity-alias (this is what makes Stillform appear in Health Connect permissions list), Calendar + Health Connect permissions declared, `START_VIEW_PERMISSION_USAGE` permission guard
- `build.gradle` — Health Connect client 1.1.0-alpha07, kotlinx-coroutines-android 1.7.3, kotlin-android plugin
- `variables.gradle` — minSdkVersion bumped 24 → 26 (Health Connect requirement)
- `integrationsSupportedOnPlatform` — now includes Android (was iOS only)
- Notification permission — fixed to check existing state before prompting (was firing every launch)
- Calendar permission — granted manually in phone settings; works
- Health Connect — Stillform now appears in Health Connect permissions list and access granted

### Key technical lessons
- Health Connect registration requires `VIEW_PERMISSION_USAGE` + `HEALTH_PERMISSIONS` alias NOT `ACTION_SHOW_PERMISSIONS_RATIONALE`
- Health Connect package on this device: `com.google.android.healthconnect.controller`
- Kotlin plugin must be explicitly added to app/build.gradle or Kotlin files compile but don't get included in DEX
- Never run `adb shell pm clear` in production testing — wipes all permissions

### Still needed before TestFlight
All items from April 19 list remain except Android Health Connect + Calendar which are now done.
- Galaxy Watch validation (need watch)
- Apple Watch companion (not built)
- Apple HealthKit (iOS native, needs real device)
- Calendar integration iOS verification
- Biometric lock native build test
- Google Play closed testing build
- 3-5 real testimonials (after TestFlight)
- Reddit post (after TestFlight)


---

## April 20, 2026 — Evening Session Updates

### ✅ Additional fixes shipped today

**Reframe API on native — CRITICAL FIX:**
- Root cause: Capacitor androidScheme:https means relative URLs resolve to https://localhost on device, not stillformapp.com
- Fix: REFRAME_API_URL const — uses absolute URL on native, relative on web
- Still needs testing — APK installed but not confirmed working yet

**Other fixes shipped:**
- Cloud sync no longer wipes onboarding/regulation_type (CRITICAL_KEYS protection)
- goHomeSafely routes to tutorial if not onboarded (fixes blank home during onboarding)
- Notification permission only prompts once (checks existing state first)
- Android back button fixed (was calling exitApp due to undefined currentScreenRef)
- Theme contrast fixed — teal, rose, suede now use pure black bg + white borders
- Teal accent: #3dbdb5, Rose accent: #d4607e
- Origin check loosened — native requests without origin header no longer blocked

### 🔴 Still needs verification
- Reframe AI on native — APK installed, NOT yet confirmed working
- Run: `adb logcat | grep -i "reframe\|fetch\|network\|cors\|403"` while testing

### 🔴 Pending — absolute URLs for ALL Netlify functions on native
Same issue as reframe may affect:
- subscription-status
- subscription-webhook  
- uat-feedback-history
- subscription-link-account
Need to audit and fix all with same NETLIFY_BASE_URL pattern

### 🔴 Pending before next APK build
- Fix offline fallback message (clinical worksheet tone, needs rewrite)
- Audit all Netlify function fetch calls for native URL issue


---

## April 21, 2026 — Metacognition Layer + Infrastructure

### ✅ Metacognition features shipped

**Signal Awareness Latency — hero metric in My Progress:**
- Tracks autonomous exits (Watch Sequence "no tool needed" choices) over time
- Session duration trend — shorter sessions = catching it earlier
- Month-over-month autonomous exit comparison
- Displayed as first card in "Proof in your data" section, above Recovery Speed

**Autonomous exit celebration enhanced:**
- Watch Sequence completion screen now shows amber glow card with count
- "The observer is getting faster" framing
- "The less you need the app, the more it's working"

**7-session milestone rewritten:**
- Detects tool usage mismatch vs assessed processing type
- Body-first reaching for Reframe >70%: reflects it back openly
- Thought-first reaching for Breathe >70%: mirror message
- No mismatch: "7 sessions. How's it feeling?" — conversational not diagnostic
- Opens Reframe directly vs routing to Settings

**Watch Sequence nudge after high-activation Reframe sessions:**
- Appears when preRating >= 4
- Offers depth — "not just regulate it, see the pattern under it"
- Non-blocking, below skip button

### ✅ Infrastructure fixes shipped today

**Cloud sync — fully working cross-device:**
- UNENCRYPTED_SYNC_KEYS: non-sensitive prefs stored as plaintext JSON
- rehydrateAfterSync() helper — updates React state after any sync down
- Theme, high_contrast, ai_tone, onboarded, regulation_type all restore correctly
- SYNC_KEYS expanded: theme, high_contrast, ai_tone, morning_breath_cue

**Native Android API fixes:**
- NETLIFY_BASE const: absolute URL on native, empty on web
- All Netlify functions fixed: subscription-status, subscription-link-account, uat-feedback-history, metrics-ingest, reframe
- CORS: https://localhost added to allowed origins
- Authorization header added to CORS allow-headers in reframe.js

**Theme system:**
- Teal, Rose, Suede — pure black bg + white borders, accent colors pop
- Reframe modeConfig: all hardcoded amber replaced with CSS variables
- Self-guided banner, somatic nudge, post-rating selection all theme-aware

**Navigation:**
- goHomeSafely routes to tutorial if not onboarded
- Signal mapping loop fixed (sessionStorage skip flag)
- Back button during onboarding works correctly

### 🔴 Still pending before TestFlight
- My Progress language audit (observational not diagnostic)
- Offline fallback message rewrite
- Galaxy Watch validation (need watch)
- Apple Watch companion (not built)
- Apple HealthKit (iOS, needs device)
- Calendar + Health data flowing into AI (needs verification)
- Google Play closed testing build
- 3-5 real testimonials
- Reddit post


---

## April 21, 2026 — Metacognition Layer + Infrastructure

### ✅ Metacognition features shipped

**Signal Awareness Latency — hero metric in My Progress:**
- Tracks autonomous exits (Watch Sequence "no tool needed" choices) over time
- Session duration trend — shorter sessions = catching it earlier
- Month-over-month autonomous exit comparison
- Displayed as first card in "Proof in your data" section, above Recovery Speed

**Autonomous exit celebration enhanced:**
- Watch Sequence completion screen now shows amber glow card with count
- "The observer is getting faster" framing
- "The less you need the app, the more it's working"

**7-session milestone rewritten:**
- Detects tool usage mismatch vs assessed processing type
- Opens Reframe directly vs routing to Settings

**Watch Sequence nudge after high-activation Reframe sessions:**
- Appears when preRating >= 4
- Offers depth — "not just regulate it, see the pattern under it"

### ✅ Infrastructure fixes shipped today

**Cloud sync fully working cross-device:**
- UNENCRYPTED_SYNC_KEYS: non-sensitive prefs stored as plaintext
- rehydrateAfterSync(): updates React state after sync down
- Theme, high_contrast, ai_tone, onboarded, regulation_type all restore

**Native Android API fixes:**
- NETLIFY_BASE const for all Netlify function calls
- CORS: https://localhost added, Authorization header allowed

**Theme system:**
- Teal, Rose, Suede — pure black bg + white borders
- Reframe modeConfig all CSS variables, no hardcoded amber

### 🔴 Still pending before TestFlight
- My Progress language audit (observational not diagnostic)
- Offline fallback message rewrite
- Galaxy Watch validation
- Apple Watch companion
- Apple HealthKit (iOS)
- Calendar + Health data → AI verification
- Google Play closed testing build
- 3-5 real testimonials
- Reddit post

---

## April 22, 2026 — Polish Pass + Watch Audit

### ✅ Shipped today

**Offline fallback rewritten:**
- Old: "Offline self-guided reframe (AI is temporarily unavailable): 1) Name the feeling..."
- New: "Connection dropped. Working through it on your own for now." — direct prompts, no numbering
- Error banner: "Connection dropped. Working through it on your own for now."

**My Progress language audit:**
- Subtitle: "What your data shows about how you're building the skill — not a score, a mirror."
- Tool effectiveness bar: CSS gradient variables (no hardcoded amber)
- All language observational throughout — no diagnostic verdicts

**Integrations message fixed:**
- Was: "Calendar and health integrations are not available on Android yet." (WRONG)
- Now: Correctly explains native Android app requirement for web users

**FAQ additions:**
- Calendar/Health native-only explanation
- Tablet/iPad support note

**Galaxy Watch companion — audit complete:**
- WearBreatheActivity.java — fully implemented (haptic breathing, all 4 patterns)
- WearListenerService.java — fully implemented (receives /stillform/breathe messages)
- WatchBridge.java + WatchBridgePlugin.java — phone side fully implemented
- wear module included in settings.gradle, build.gradle configured
- watchBridge.startBreathing() called when breathing session starts in app
- STATUS: Code complete. Needs wear APK installed on Galaxy Watch Ultra to test.

### 🔴 Galaxy Watch Ultra — how to install wear APK
1. Enable developer mode on watch: Settings → About → Software → tap version 5x
2. Enable ADB debugging: Settings → Developer options → ADB debugging ON
3. Enable WiFi debugging on watch
4. Connect: `adb connect <watch-ip>:5555`
5. Build wear APK: `cd android && ./gradlew :wear:assembleDebug`
6. Install: `adb -s <watch-ip>:5555 install wear/build/outputs/apk/debug/wear-debug.apk`
7. Start breathing session on phone — watch should launch haptic breathing automatically

### 🔴 Remaining before launch (priority order)
**Blocking:**
1. Paywall live — Bobby triggers Lemon Squeezy live mode switch
2. Galaxy Watch — wear APK install + validation on Galaxy Watch Ultra
3. Apple Watch + HealthKit — need iPhone + Apple Watch device
4. Google Play closed testing build (14-day clock must run)
5. TestFlight build
6. 3–5 real testimonials
7. Reddit post

**Should do before launch:**
8. In-app check-in reminders for web (push notifications are native-only)
9. Subscribe button/nav theme cleanup (currently amber — by design via btn-primary, but verify on all themes)
10. Biometric lock native test
11. Calendar + Health → AI context verification on device
12. Science sheet update for metacognition features

**Post-launch (deliberate):**
- Tablet/iPad responsive layout
- Sound packs
- Shareable composure card
- PDF/CSV export polish
