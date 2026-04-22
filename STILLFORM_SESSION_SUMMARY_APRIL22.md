# Stillform — Session Summary April 22, 2026
## Where we are when you get back from ketamine

---

## ✅ IMPLEMENTED TODAY (code shipped, live on web)

### Bug Fixes
- **Reframe crash on Done** — fixed. Was `preRating` (breathe component) referenced in Reframe component. Changed to `feelState`.
- **Reframe AI bubbles** — all hardcoded amber replaced with CSS variables. Teal theme shows teal bubbles. All themes correct.
- **Signal mapping loop** — fixed. Skipping Map Your Signals then completing How You Process no longer re-launches signals.
- **Back button during onboarding** — fixed. Goes back to tutorial not blank home.
- **Offline fallback message** — rewritten. "Connection dropped. Working through it on your own for now." Direct prompts, not clinical worksheet.
- **Integrations message** — fixed. Was wrongly saying "not available on Android yet." Now correctly explains native app requirement.
- **btn-send hover** — was hardcoded amber. Now CSS variable.
- **Tool effectiveness bar** — was hardcoded amber gradient. Now CSS variables.

### Features Shipped
- **Metacognition layer** — Signal Awareness hero card in My Progress, autonomous exit celebration in Observe and Choose, 7-session milestone rewritten as genuine AI observation, Observe and Choose nudge after high-activation Reframe sessions (angry/anxious/mixed).
- **Tutorial rewritten** — opening page leads with "Most people don't catch themselves until after the moment has passed." Calibration slide explains one-time setup, why it matters, and sets expectation clearly.
- **Observe and Choose** — renamed from Watch Sequence everywhere user-facing. Plausible analytics intentionally kept old name for continuity.
- **FAQ** — added calendar/health native-only explanation, tablet/iPad support note.
- **My Progress subtitle** — "What your data shows about how you're building the skill — not a score, a mirror."

### Docs
- **STILLFORM_COMPREHENSIVE_BRIEF_APRIL_2026.md** — created, iterated, factual errors corrected (GPT-4o not Claude Haiku, 14,500 lines not 7,900, Health Connect data flow not yet confirmed).
- **STILLFORM_PROJECT_TRANSFER.md** — updated with calibration rationale, recovered time spec, export PDF spec, pre-launch doc queue, session summary.

---

## ✅ CONFIRMED WORKING (verified earlier sessions, not changed today)

- Reframe AI on native Android ✅
- Cloud sync cross-device (theme, onboarding, regulation type restore) ✅
- Health Connect permissions granted on Android ✅
- Calendar permissions granted on Android ✅
- All Netlify functions use absolute URLs on native (NETLIFY_BASE) ✅
- CORS fixed for https://localhost (native Android origin) ✅
- Themes — Teal, Rose, Suede look correct without high contrast ✅
- Paywall — tested live ✅

---

## ❌ DECIDED NOT TO DO (and why)

- **Gamify metrics** — open risk accepted. "Time returned to your life" will be observational not a score to chase. If users game it, data reflects it honestly.
- **Warning users not to game metrics** — rejected. Hand-holding, defensive, undermines integrity.
- **Shorten onboarding** — rejected. Calibration is the platform. It's one time, 3 minutes, and everything runs on it. The tutorial now explains this clearly.
- **Reddit launch now** — rejected. Needs native tested via Google Play closed testing first. Needs real testimonials. This is a one-shot moment.
- **Fake testimonials** — hard no. Integrity is the brand.
- **"Executive Composure" as primary category** — removed from brief. They're a key market but not the definition. Welcoming to everyone.
- **"The target user runs hot mentally" / cooling system framing** — removed. Too narrow, factually wrong (tools do slow the mind — that's the point).

---

## 🔴 QUEUED — BUILT NEXT (in order)

### 1. Recovered Time metric (My Progress)
- Shows gap between early session avg duration and recent avg duration
- "Time returned to your life" — X minutes back per session
- Only surfaces after 10+ sessions, only when trend is positive
- Purely observational — no verdict, no target, no celebration
- Full spec in transfer doc

### 2. Export PDF with metric explanations
- Plain language explanation of every metric
- Science citations
- Supports clinical channel, FSA/HSA documentation, skeptical users
- Build after recovered time is stable

### 3. Google Play closed testing build
- Needs Mac + Android Studio
- 14-day clock must run before public launch
- This is how you get real testers on native
- Real testimonials come from this cohort

### 4. Galaxy Watch wear APK install
- Code is complete both sides
- Needs developer mode on watch + ADB over WiFi
- Instructions in transfer doc
- Step by step when you're back at your Mac

### 5. Apple Watch + HealthKit
- Blocked on hardware (need iPhone + Apple Watch)
- Cannot build without the device

---

## 🔴 STILL BLOCKING LAUNCH (in priority order)

1. **Google Play closed testing** — 14-day clock, gets real native testers
2. **Galaxy Watch validation** — code done, needs APK on watch
3. **Apple Watch + HealthKit** — hardware blocked
4. **Real testimonials** — from Google Play testers
5. **Health Connect + Calendar → AI context** — permissions granted, data flow not confirmed on device
6. **Biometric lock** — needs native test
7. **In-app check-in reminders for web** — push notifications are native only, web users get nothing right now
8. **Science sheet update** — metacognition features not documented yet

---

## 💡 KEY PRODUCT DECISIONS MADE TODAY

**What Stillform is (locked):**
Stillform is a metacognition trainer that stabilizes composure. It builds the skill of observing your own state before it drives behavior — then choosing deliberately.

**Category:** Composure Architecture. Not wellness. Not therapy. Not meditation.

**The proof metric:** Signal Awareness Latency — how fast the user catches themselves before acting from state instead of decision. Sessions getting shorter over time + autonomous exits increasing = the skill compounding.

**Calibration is the platform.** Not onboarding friction. Everything runs on it. The tutorial now says this clearly.

**The path to 1,500 subscribers ($20K/month):**
- Google Play closed testing → real testers → real testimonials
- Reddit post (one shot, written right, r/ADHD + r/anxiety)
- Neurodivergent community via your brother
- Therapist channel — one therapist recommends to 30 clients = 30 qualified leads
- The product itself distributes — when the AI says something that lands, people screenshot it

**Launch sequence:**
Web → Google Play closed testing → testimonials → Reddit → broader launch → App Store

---

## 📋 WHEN YOU'RE BACK

Start with: **Google Play closed testing build** — this unblocks everything downstream (real testers, real testimonials, Watch validation, native QA).

You'll need:
```bash
cd ~/Desktop/Stillform
git pull
npm run build
npx cap sync android
cd android
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
./gradlew assembleDebug
```

Then Google Play Console → upload AAB → add testers → start 14-day closed testing.

---

Go rest. Treatment first. Product second.

