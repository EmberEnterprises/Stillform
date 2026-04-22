# STILLFORM — Comprehensive Product Brief
## April 22, 2026 | ARA Embers LLC

---

## What Stillform Is

**One sentence:** Stillform is a composure architecture — how you carry yourself every day, in every moment that matters.

**Category:** Composure Architecture. Metacognition applied to daily life — building the inner clarity that produces outward steadiness, better decisions, and fewer regrets.

### The Core Idea

Stillform is a metacognition trainer that stabilizes composure. It builds the skill of observing your own state before it drives your behavior — then choosing your response deliberately.

Metacognition is the ability to observe your own thinking and emotional state as it happens — and then choose what to do with it. Stillform makes that skill trainable, daily, in real moments. The result is inner poise and outward presence: fewer impulsive actions, fewer regrets, fewer moments of guilt or shame after the fact.

Composure is a way of being — not just damage control. It applies to excitement, patience, presence, professionalism, and being steady when nothing is wrong. The daily practice and the in-the-moment intervention are the same skill: notice, regulate, choose.

The product philosophy: regulate yourself → see yourself clearly → see others clearly → let them in.

**Trainer, not a crutch.** Signal Awareness Latency (how fast the user catches themselves before acting from state instead of decision) is the proof the app is building a skill they eventually own. The less you need the app, the more it's working.

**Every feature must train noticing — not collect data.** The shift from "I am this state" to "I can see this state happening and choose my response" is what gets built over time. If a feature feels like a form, it's wrong. If it feels like a mirror, it's right.

### Identity Lines (locked)

- Stabilize. Then think clearly.
- Body. Then thought.
- Composure architecture.
- The less you need the app, the more it's working.

---

## Current Build State (April 22, 2026)

**Live at stillformapp.com — HTTP 200. UAT mode. Password-protected for testers.**

### Infrastructure

- **Hosting:** Netlify Pro — stillformapp.com via Cloudflare
- **Repo:** GitHub: EmberEnterprises/Stillform
- **Framework:** React + Vite (src/App.jsx — ~7,900 lines)
- **AI:** Claude API (claude-haiku-4-5-20251001) via Netlify serverless function (netlify/functions/reframe.js)
- **Analytics:** Plausible — live
- **PWA:** manifest.json + sw.js — installable on iOS and Android
- **Native:** Capacitor 8 — Android platform synced, iOS initialized
- **Cloud sync:** Supabase (three-table schema: user_data, backups, user_profiles; RLS + AES-256)
- **Payments:** Lemon Squeezy (test mode approved; Bobby triggers live mode switch)
- **Netlify deploys:** MANUAL — Arlin triggers in Netlify after Claude pushes to GitHub

### Pricing

- $14.99/month or $9.99/month annual ($119.88/year, 33% off)
- One price. Everything included. No add-ons.
- 14-day free trial (not yet live — blocked on Lemon Squeezy live mode)

---

## Two Regulation Pathways

Research confirms two neurologically distinct regulation pathways:

- **Top-down (thought-first):** Emotions start as thoughts — spiraling, replaying, analyzing. Reframe/AI is the primary tool. Breathing comes AFTER cognitive processing.
- **Bottom-up (body-first):** Emotions start as body tension — jaw, chest, fists. Breathing/body scan is the primary tool. Reframing comes AFTER the body settles.

Guided 3-scenario assessment at onboarding determines each user's default pathway. Three outcomes: thought-first (Reframe dominant), body-first (Breathe dominant), balanced (equal weight). "Help me figure it out" option sets balanced.

---

## The Four Core Tools

### 1. Breathe
Two entry points: "Settle the system" (body overwhelm) and "I need to think clearly" (spiraling). Two patterns: Quick Reset (60s physiological sigh) and Deep Regulate (3min 4-4-8-2). SVG breathing ring with animated arc. Connects directly to Reframe after completion.

### 2. Body Scan
6 acupressure points with timed holds. Body schematic SVGs. Auto-advances. Completion: "Signal cleared."

### 3. Reframe (AI)
The AI relationship tool. Single mode — auto-routes based on feel state and input content. Claude API via Netlify function. Rate limited 10 req/IP/min. Conversation persistence via AES-GCM encrypted localStorage. History capped at 10 messages. AI coaching intensity scales silently with session count (<3 no patterns, 3-12 gentle, 12+ direct).

### 4. Observe and Choose
The metacognition tool. A structured reflection sequence: Notice → Name → Recognize → Perspective → Choose. Users work through 4 prompts about what happened in their mind, then choose: Breathe, Sit with it (self-regulated), Talk it through (Reframe), or Move on (autonomous — no tool needed). Autonomous exits are tracked as Signal Awareness Latency proof.

---

## System Architecture

### Onboarding Flow

1. Tutorial (condensed, science-backed, swipe navigation)
2. How You Process assessment (3 scenarios, determines thought-first/body-first/balanced)
3. Signal Profile (body areas where intensity activates first)
4. Pattern Check (10 cognitive distortions — blind spot profiling)
5. Breathing pattern selection
6. "Initialization complete → Enter system"

### Daily Loop

**Morning:** Check-in card on home screen — energy (Low/Steady/High/Ready/Wired/On Fire) + hardware check (multi-select: All clear / Depleted / Under-rested / Pain present / Activated / Medicated). Saves to localStorage, feeds AI context.

**Intraday:** Tools available anytime. Quick Breathe floating pill (draggable, position saved). Pulse (signal log) for quick state logging.

**Evening:** EOD check-in after 6PM — "Where's your energy?" + "How'd you carry yourself today?" + one word. AI gets yesterday's close as context next morning.

### AI Context Stack (every Reframe call receives)

- Regulation type (thought-first / body-first / balanced)
- Signal profile (body areas)
- Bias profile (10 cognitive distortions)
- Feel state (excited / focused / anxious / angry / flat / mixed)
- Bio-filter (physical state from morning check-in)
- Morning energy level
- Session count (determines coaching intensity)
- Prior tool context (what they did before Reframe)
- Journal/Pulse context (recent entries, from session 3+)
- AI session notes (last 5 post-session summaries)
- Check-in context (morning + EOD data)
- Calendar context (when available via native integration)
- Health context (sleep/HRV/HR when available via native)

### AI Response Principles

**Never say:** "I understand how you feel" / "That's a lot to carry" / "I care about you" / Pattern labels as flaws / Therapy jargon (dynamics, aligned, processing, sit with that, unpack that)

**Always do:** Mirror their personality style. Match their language exactly — never translate "I'm pissed" to "experiencing frustration". Reflect back the one word that mattered. Let them drive. Hold their aspirational self, not their diagnostic self.

**Voice directive:** "Talk like someone who's been through some shit. If your response could appear on a motivational poster, rewrite it."

**HARD RULES (server-side enforced):** No other person's names. No labels without permission. Specificity test — if response could apply to anyone, rewrite it. Poster test — if it sounds motivational, rewrite it.

**Post-session AI summary:** After each session, AI writes 2-3 sentences on what mattered — not a transcript, a friend's mental note. Stored in `stillform_ai_session_notes` (last 20). Fed back into future sessions.

---

## Metacognition Layer (shipped April 21, 2026)

### Signal Awareness Latency — Hero Metric

**What it measures:** How fast the user catches their state before it drives action. Proxy: session duration trending shorter over time = catching it earlier. Autonomous exits (Observe and Choose completions where user chose "no tool needed") tracked over time.

**In My Progress:** First card in "Proof in your data" section — above Recovery Speed and Check-in Consistency. Shows:
- Autonomous exits total and trend
- Session duration trend ("Your sessions are getting X min shorter. You're catching it earlier.")
- Month-over-month autonomous exit comparison

**Language:** "The observer is getting faster." / "The less you need the app, the more it's working."

### Autonomous Exit Celebration

When user completes Observe and Choose and chooses "Sit with it" or "Move on" (no tool needed), the completion screen shows an amber glow card:
- Count of all autonomous exits
- "First time choosing without a tool. That's the observer activating." (first time)
- "X times now. The observer is getting faster." (repeat)
- "The less you need the app, the more it's working."

### 7-Session Milestone

After session 7, the app surfaces a reflection — feels like the AI noticed something, not like software ran a diagnostic:

- **Tool usage mismatch detected (body-first reaching for Reframe >70%):** "I've noticed something. You came in as body-first, but you keep reaching for conversation. That's not wrong — it might mean your system is telling you something about how you actually process. Want to explore that?"
- **No mismatch:** "7 sessions. You're building something. How's it feeling?"
- **7-day streak:** "You've been here every day this week. I've noticed something — want to talk about it?"
- Buttons: "Talk it through →" (opens Reframe) and "Got it" (dismisses)

### Observe and Choose Nudge

After high-activation Reframe sessions (feel state = angry/anxious/mixed), post-session rating screen shows a light prompt: "You came in at a high intensity. Observe and Choose helps you see the pattern under the moment — not just regulate it." Non-blocking, below the skip button.

---

## Theme System

Six themes: Dark (default), Midnight, Suede, Teal, Rose, Light.

All themes use CSS variables — every color in the app responds to theme changes:
- `--amber` — accent color (amber in Dark, teal in Teal, rose in Rose, blue in Midnight, etc.)
- `--amber-dim` / `--amber-glow` / `--amber-20` — accent opacity variants
- `--bg` / `--surface` / `--surface2` — backgrounds
- `--border` / `--border-hi` — borders
- `--text` / `--text-dim` / `--text-muted` — text

Teal, Rose, Suede: pure black `--bg` + neutral white borders so accent colors pop without blending into background. High contrast overlay available (boosts borders to 0.45-0.70 opacity).

All Reframe conversation bubbles, AI messages, send button, and interactive elements use CSS variables — no hardcoded amber.

---

## Cloud Sync Architecture

**Non-sensitive keys stored as plaintext JSON in cloud (cross-device readable):**
stillform_onboarded, stillform_regulation_type, stillform_breath_pattern, stillform_theme, stillform_high_contrast, stillform_ai_tone, stillform_audio, stillform_scan_pace, stillform_screenlight, stillform_reducedmotion, stillform_visual_grounding, stillform_morning_breath_cue, stillform_reminder, stillform_reminder_time, stillform_qb_position

**Sensitive keys encrypted with device-specific AES-256 key (IndexedDB):**
stillform_sessions, stillform_journal, stillform_signal_profile, stillform_bias_profile, stillform_saved_reframes, stillform_ai_session_notes — these are NOT cross-device restorable (device key stays on device by design)

**On sign-in:** sbSyncDown runs, restores all available keys, rehydrateAfterSync() updates React state (theme, regulation type, high contrast, etc.), navigates to home if onboarded.

**Pre-update backup:** Before any app version change, auto-backup encrypted snapshot to Supabase `backups` table.

**rehydrateAfterSync():** After any sync down, reads key prefs from localStorage and updates React state + CSS variables — ensures theme, regulation type, and other prefs apply immediately without page reload.

---

## Native Android (Current State)

### What Works
- Health Connect — reads sleep hours, HRV (RMSSD), resting HR from last 24h. Stillform appears in Health Connect permissions list.
- Calendar — reads events from next 48h. Permission granted in phone settings.
- Biometric lock — app-open gate + foreground resume, optional in Settings.
- Push notifications — permission requested on first launch (checks existing state first to avoid repeat prompts).
- Widget — home screen widget, one tap → breathing screen.
- Share extension — share text from other apps → auto-routes to Reframe.
- All Netlify function calls — NETLIFY_BASE const ensures absolute URLs on native (Capacitor androidScheme:https resolves relative URLs to https://localhost which is wrong).
- CORS — https://localhost added to allowed origins. Authorization header allowed in reframe.js.
- Reframe AI — confirmed working on native.

### What Needs to Be Built/Tested
- Galaxy Watch Ultra haptic breathing — code complete (WearBreatheActivity.java + WearListenerService.java + WatchBridge.java), needs wear APK installed on watch via ADB over WiFi
- Apple Watch companion — not built, needs iPhone + Apple Watch + Xcode
- Apple HealthKit — not built, needs real iOS device
- Calendar on iOS — not verified, needs real iOS device

### Android Build Commands
```bash
cd ~/Desktop/Stillform
git pull
npm run build
npx cap sync android
cd android
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
./gradlew assembleDebug
~/Library/Android/sdk/platform-tools/adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### Galaxy Watch Ultra — Install Wear APK
```bash
# On watch: Settings → About → Software → tap version 5x → Developer options → ADB debugging ON
adb connect <watch-ip>:5555
cd android && ./gradlew :wear:assembleDebug
adb -s <watch-ip>:5555 install wear/build/outputs/apk/debug/wear-debug.apk
# Start breathing session on phone → watch auto-launches haptic breathing
```

---

## My Progress — What It Shows

**"Proof in your data" section (in order):**

1. **Signal Awareness (hero card)** — autonomous exits count + trend, session duration trend
2. **Recovery speed** — avg session duration from high-activation states, 30-day acute shift rate, avg session delta
3. **Check-in consistency** — 14-day loop completion %, morning/evening breakdown
4. **Follow-through** — sessions that included a tool after check-in
5. **Transfer under pressure** — high-activation sessions (preRating 4-5) with positive shift

**My Patterns section:**
- This week: sessions, avg shift, shift trend vs last week, most logged signal
- Tool effectiveness: bar graph per tool with avg shift and % of sessions
- Primary activation zone: top body area from Pulse entries
- Temporal pattern: day-of-week concentration (observation only, no verdict)
- Blind spot activity: which distortions appear in AI session notes
- System Note: one observational recommendation based on data

**Language standard:** All observational, not diagnostic. "X% of sessions on Mondays" not "you spiral on Sunday nights." Data presented neutrally. Patterns surfaced as observations. No comparisons to other users. No verdicts.

---

## Additional Features

- **Somatic interrupt:** Rapid typing in Reframe (15+ keystrokes in 3s) → one ambient line above input: "Drop your shoulders." / "Unclench your jaw." / "Soften your hands." Fades after 5s. No modal.
- **Ghost echo:** Faint evidential line on Pulse screens — pulls random prior session with positive delta. "Apr 3 — you shifted +2.4 in 2m 30s." Not motivational. Evidential.
- **Composure telemetry:** GitHub-style contribution graph (12 weeks, amber intensity by frequency).
- **60 BPM entrainment:** Barely perceptible CSS animation on home screen identity line — body notices, mind doesn't.
- **Fractal breathing visual:** Organic branching fractal behind breathing ring — toggle in Settings.
- **Quick Breathe pill:** Floating, draggable, position saved, always accessible.
- **EOD prompt:** "Anything you want to clear before bed?" after EOD check-in, routes to Reframe with evening context.
- **Offline fallback:** "Connection dropped. Working through it on your own for now." — direct prompts, not a numbered worksheet.
- **Crisis screen:** 988, Crisis Text Line, all tap-to-call/text.
- **Privacy screen:** live at stillformapp.com/privacy.html
- **Promo reel:** live at stillformapp.com/promo.html
- **FAQ:** 17+ entries covering all features including native-only integrations and tablet support.

---

## What Web vs Native Looks Like

**Web only lacks:**
- Push notifications (morning/EOD check-in reminders) — native only. Web has in-app timing but no system notifications.
- Calendar integration — device API access not available in browser.
- Health Connect — device API access not available in browser.
- Biometric lock — native device sensors.
- Widget — Android home screen only.
- Galaxy Watch haptic breathing — requires Wear OS companion app.

**Everything else (Reframe AI, all tools, cloud sync, themes, My Progress, Observe and Choose, metacognition layer) works identically on web and native.**

---

## What's Left Before Launch

### Blocking
1. **Paywall live** — Bobby triggers Lemon Squeezy live mode switch (test mode is approved, products created)
2. **Galaxy Watch** — wear APK install + validation on Galaxy Watch Ultra
3. **Apple Watch + HealthKit** — need iPhone + Apple Watch device (currently blocked on hardware)
4. **Google Play closed testing build** — 14-day clock must run before public launch
5. **TestFlight build** — iOS App Store requirement
6. **3–5 real testimonials** — required before Reddit launch
7. **Reddit post** — one shot, don't post without paywall + testimonials

### Should Do Before Launch
8. In-app check-in reminders for web (since system push notifications are native-only)
9. Biometric lock native test on device
10. Calendar + Health → AI context verification on Android (permissions granted, data flow not confirmed)
11. Science sheet update for metacognition features

### Post-Launch (Deliberate Updates)
- Tablet/iPad responsive layout
- Sound packs
- Shareable composure card
- PDF/CSV export polish
- Apple Watch / HealthKit (when device available)

---

## Locked Decisions (Do Not Relitigate)

- Stillform is a composure SYSTEM, not a wellness app.
- Composure applies equally when nothing is wrong — not just crisis management.
- One price. AI included. Cloud sync included. No add-ons. No upsells.
- AI gets smarter silently by session count. Never announced.
- Reddit is a one-shot moment. Do not post without paywall and testimonials.
- Web launch first. App stores second.
- Quick Breathe always free — anyone in crisis can use it without paying.
- The mirror has integrity — never filter, suppress, or curate data. Framing protects, filtering lies.
- No engagement tricks. No streaks. No "you missed a day" notifications.
- The less you need the app, the more it's working. Dependency = failure.
- Metacognition is the product. Every feature trains noticing. If it feels like a form, it's wrong. If it feels like a mirror, it's right.
- Signal Awareness Latency (how fast the user catches themselves) is the proof metric. Not DAU, not session count.
- "Observe and Choose" is the name for the metacognition tool — not "Watch Sequence" (sounds like hardware).

---

## Science Foundation

Every feature traces to published research:
- Two regulation pathways → Ochsner et al., bottom-up vs top-down emotion regulation
- Physiological sigh → Balban et al. (Stanford, 2023) — fastest parasympathetic reset
- Box breathing → Busch et al. (2022) — HRV improvement, cortisol reduction
- Acupressure → Hou et al. (2015) — LI4, PC6, HT7, ST36 for anxiety reduction
- Affect labeling (Pulse) → Lieberman (2007) — naming emotion reduces amygdala activation
- Emotional granularity → Barrett, Kashdan (2015) — precise labeling improves regulation
- Cognitive distortion reframing → Beck (1976), Burns (1980)
- Window of tolerance → Siegel (1999)
- Implementation intentions → Gollwitzer (1999) — assessment pre-loads regulation pathway
- Fractal visuals → Taylor (UO), Hagerhall et al. (2015) — natural fractals reduce stress up to 60%
- Interpersonal microbiases → Nature Communications (2025)
- Metacognition / Observer → metacognitive therapy research (Wells), mindfulness-based stress reduction (Kabat-Zinn)

---

## Key Files

- `src/App.jsx` — entire frontend (~7,900 lines)
- `netlify/functions/reframe.js` — Claude API serverless function
- `netlify/functions/_httpSecurity.js` — shared CORS/security for other functions
- `android/app/src/main/java/com/araembers/stillform/IntegrationBridgePlugin.kt` — Health Connect + Calendar native plugin
- `android/app/src/main/java/com/araembers/stillform/WatchBridge.java` — sends breathing pattern to watch
- `android/wear/src/main/java/com/araembers/stillform/WearBreatheActivity.java` — haptic breathing on watch
- `android/wear/src/main/java/com/araembers/stillform/WearListenerService.java` — receives messages from phone
- `STILLFORM_PROJECT_TRANSFER.md` — full session history and technical reference

---

## Key People

- **Arlin** — founder, sole product decision-maker, visual thinker, NJ Armenian accent affects voice transcription
- **Bobby (Robert Matthew Geismar)** — co-developer, first real user, sole LLC member on paper, needs to trigger Lemon Squeezy live mode switch
- **Ava** — early user, first testimonial: "The breathe and ground helped. I loved the reframe"

---

ARA Embers LLC · Stillform Comprehensive Brief · April 22, 2026
