# STILLFORM — INTEGRATIONS LAYER + CONCIERGE BEHAVIORS

**ARA Embers LLC · created May 14, 2026 evening · purpose: durable capture of all integration ideas and concierge behaviors so nothing scatters across PR notes, audit logs, and compressed CANON operating rules.**

---

## 0. WHY THIS DOC EXISTS

Arlin, May 14, 2026 evening:

> "I wanna make sure that we capture the ideas that I generated with the integrations of the calendar and all... and the HRV and the sleep and the other tools as well as, um, the concierge and also that the b2b is properly setup."

The operating rules in `STILLFORM_CANON.md` Section 10 compress the underlying ideas into single-paragraph rules. The actual specifications are scattered across:

- `STILLFORM_ENGAGEMENT_ARCHITECTURE.md` (§3.2 application-layer surfaces consuming integrations)
- `STILLFORM_B2B_PRIVACY_ARCHITECTURE.md` (the privacy wall, but not the setup)
- `TODAYS_BRIEF_FLOW_AUDIT.md`, `PRE_EVENT_BRIEF_FLOW_AUDIT.md`, `MOVE_CARD_FLOW_AUDIT.md` (flow audits)
- `Stillform_Master_Todo.md` (line items and PR commits)
- Various PR commit messages (e.g. PR #75 ICS decompression, PR #76 calendar screenshot import)

This doc consolidates everything into one durable reference. It is NOT the source of truth for any single integration (the specs are still authoritative for their domain). It IS the single place to find what Stillform's integration + concierge layer is, what's shipped, what's specified, and what still needs Arlin's expansion.

When this doc and another doc conflict, the more recent dated doc wins. Cosmetic edits don't require a version bump; substantive additions do.

---

## 1. CANON OPERATING RULES THAT DRIVE THIS WORK

These are the locked principles every integration + concierge decision flows through. Pulled from `STILLFORM_CANON.md` Section 10:

1. **Integrations protect the practice. They are not the practice.** Calendar, health data, voice, focus modes, smart event detection, screenshot import, watch biometrics — these clear noise so the metacognition work can land. They are protective infrastructure. Stillform is never positioned as a personal assistant, a productivity tool, or a wellness service. Every integration must answer: does this remove friction that prevents the practice, or does it become the product? If the latter, redesign.

2. **Reduce cognitive load on everything that is not the practice.** Fewer meta-decisions = more capacity for the work itself. Even 30 seconds of friction removed is 30 seconds the user can spend on themselves. Filter every feature through: does this subtract decisions the user otherwise has to make? Anything that ADDS meta-decisions to non-practice surfaces fails the filter. Voice register: red-carpet / prestige / concierge — never buddy-buddy or wellness-coach.

3. **Concierge is a third pillar — design philosophy, never a surface.** Stillform stands on three pillars: (1) metacognition practice for self-mastery, (2) emotional honesty as cognitive material, (3) concierge layer that handles logistics so the user does the work. The concierge is NOT a tab, a screen, or a feature. It's a structural behavior distributed across every existing surface.

4. **Silent data input with neutral/loaded filter.** Default is silent use — the system USES the data to inform the brief and hardware reading without displaying it as a tracker surface. Filter on WHAT we pull: **neutral data safe to import silently** (sleep duration, HRV, heart rate, calendar density, weather, sunrise/sunset, step count, commute timing). **Loaded data is unanonymizable** — even silent use carries the emotional weight the source app accumulated (mood trackers, exercise streaks, food tracking, broken habit streaks). For loaded data: don't pull, or pull only abstract signal with no specifics. Conservative default: neutral on with permission, loaded opt-in only.

5. **Match surfaces to cognitive states.** Never put review content within ~2 hours of sleep. Pre-sleep cognitive consolidation (Walker, Stickgold) means content the user processes near sleep affects sleep quality and emotional regulation. EOD review (mentally active) gets emotional-load summary + meeting decompression + email summary. Bedtime wind-down (~1 hour before sleep) gets no review content — only consolidation, release, breath, sleep prep, phone-down ritual.

6. **Three-layer framework for every positioning decision.** Category (Health & Fitness shelf — acknowledged quietly, never voiced) / Framing (metacognition practice for self-mastery, emotional honesty, concierge layer — hard line, never drifted) / Marketing (TBD pending build completion). Keep them separate or framing drift follows.

---

## 2. INTEGRATIONS LAYER — EACH SOURCE

For each integration: what it does, what data flows in, what surfaces consume it, status, and where the specifics live. Where Arlin's original generative ideas are not captured in detail, the section ends with a flagged gap.

### 2.1 Calendar

**Purpose:** anticipation of triggers before they fire (Heider 1958 / Lazarus 1991), decompression after they end, calendar decompression as a concierge behavior.

**Data pulled (neutral, silent by default):**
- Event titles, start time, end time, duration
- Day density (how many events, total event hours)
- Event spacing (back-to-back vs gaps)
- Day-of-week patterns

**Data NOT pulled:**
- Attendee names (PII concern, also loaded — implies relationships)
- Event descriptions (often contain loaded content)
- Meeting platform (Zoom links, etc. — irrelevant to practice)

**Source paths:**
- Native: HealthKit-adjacent Calendar API (iOS) / Google Calendar (Android, web)
- Universal fallback path: **ICS decompression** (shipped, PR #75) — user uploads `.ics` file or pastes URL, parsed silently
- Universal fallback path 2: **Calendar screenshot import via GPT-4o vision** (shipped, PR #76) — user screenshots their calendar from any app, image goes to GPT-4o, structured events extracted

**Storage keys:** `stillform_calendar_events` (event array), `stillform_calendar_consent` (gate)

**Surfaces that consume calendar data:**

- **Today's Brief** (shipped, Build #3) — uses calendar events array + calendar summary to anticipate the day's load. Generated at morning check-in close. Four sections (Hardware / Risks / Moves / Recovery). Spec in `TODAYS_BRIEF_FLOW_AUDIT.md`.
- **Pre-event Brief** (shipped, Build #7) — fires 30 minutes before a calendar event flagged as a trigger or high-load. User taps notification, sees a brief scoped to that specific event. Spec in `PRE_EVENT_BRIEF_FLOW_AUDIT.md`.
- **EOD review** — meeting decompression. The day's events that consumed the most resources surface as decompression candidates in the EOD review window. Status: spec'd in CANON Operating Rule §5 ("Match surfaces to cognitive states"); implementation detail not yet shipped.
- **Day-density read into hardware** — calendar density (number of meetings, total meeting time) flows into hardware state as a load signal. Status: spec'd; implementation detail not separately shipped (folded into Today's Brief generation).

**Concierge behavior on calendar:**

- **Anticipation:** Today's Brief surfaces the day's risks before the user enters it. Pre-event Brief fires for high-load events.
- **Decompression:** EOD review surfaces what the user actually moved through. The concierge does not ask "how was your day?" — it shows what the day was.
- **Curation:** events that are clearly not practice-relevant (lunch, gym, transit blocks) get deprioritized in the brief. Concierge filters the noise so the brief lands on what matters.
- **Discretion:** Pre-event Briefs are NEVER about telling the user to skip / leave / avoid the event. Hard rule in the system prompt. The brief prepares, never substitutes.
- **Threshold awareness:** when calendar shows a heavy day approaching (5+ meetings, no breaks), the concierge surfaces extra hardware-protection signals (sleep priority, hydration reminder, etc.). Status: spec'd in concierge rule; not separately implemented.

**[ARLIN — please fill in or confirm]:**
- What specifically should the Pre-event Brief contain for different event types (1:1 with manager vs all-hands vs interview vs personal appointment)?
- Should Pre-event Brief fire on EVERY calendar event matching a Trigger Profile keyword, or only on user-marked events?
- For ICS / screenshot import: should imported events expire after N days, or stay as the working calendar until manually refreshed?
- Calendar decompression — what's the actual flow at EOD? A list? A single surfaced event? An AI-generated summary?
- Concierge "sequence step D" is mentioned as unshipped in audit notes (steps A, B, C, E shipped). What was step D originally scoped as?

### 2.2 HRV (Heart Rate Variability)

**Purpose:** physiological signal that feeds into the hardware reading. High HRV correlates with parasympathetic dominance + regulation capacity (Porges polyvagal). Low HRV correlates with sympathetic load + reduced regulation capacity.

**Status:** NOT YET SHIPPED. Listed in Master Todo as "post-launch milestone, multi-session work" but Arlin's late-May 2026 direction reclassified post-launch framings as banned (CANON Operating Rule §1: "Nothing is post-launch"). Reconciliation needed — is HRV pre-launch infrastructure or post-launch? Likely pre-launch per the new rule.

**Data pulled (neutral, silent by default):**
- 24-hour HRV trend (rolling 7-day average + today's value)
- Resting heart rate
- Heart rate during specific time windows (morning wake, EOD, bedtime)

**Data NOT pulled:**
- Specific HRV time-series data (over-precision; the practice doesn't need it)
- HRV during workouts (loaded — exercise streaks, performance framing)

**Source paths:**
- iOS: HealthKit (`HKQuantityTypeIdentifierHeartRateVariabilitySDNN`)
- Android: Health Connect (`HeartRateVariabilityRmssd`)
- Watch: Apple Watch via HealthKit; Galaxy Watch via Samsung Health → Health Connect

**Surfaces that should consume HRV (per Arlin's direction):**

- **Hardware reading at morning check-in** — HRV flows into the bio-filter state silently. Low HRV → hardware reads as "depleted" or "off-baseline" without the user having to identify it.
- **Today's Brief Hardware section** — references HRV signal when relevant ("your nervous system is reading lower-recovery than usual; today's risks should be approached with that in mind").
- **Bedtime wind-down trigger** — if evening HRV is very low (suggesting unprocessed sympathetic load), bedtime wind-down surfaces a longer cyclic-sighing recommendation before sleep.

**Concierge behavior on HRV:**

- **Silent input:** the user is NOT shown HRV numbers, graphs, or trends inside Stillform. The data informs the brief; it never becomes a tracker surface.
- **Threshold awareness:** when HRV drops below the user's rolling-7-day baseline, the concierge softens recommendations (no high-intensity moves, longer regulation windows).
- **Memory:** HRV pattern over weeks (not visible to user but visible to the AI) informs whether the user's current hardware reading is normal-for-them or off-baseline-for-them. The brief calibrates accordingly.

**[ARLIN — please fill in or confirm]:**
- HRV measurement source: Apple Watch / Galaxy Watch / Oura / WHOOP / phone-only via photoplethysmography?
- Permission flow: opt-in on first import, or a Settings toggle the user has to find?
- HRV-driven bio-filter override: should low HRV automatically set hardware state, or just inform the AI's read?
- HRV trend over time — is this ever shown to the user, or always silent?
- HRV during practice: should HRV during a Reframe session be measured + fed back as a regulation effectiveness signal? (Risk: turns the practice into a quantified-self surface; would violate "silent data input" if exposed.)

### 2.3 Sleep

**Purpose:** sleep is the largest exogenous driver of next-day regulation capacity. Sleep debt amplifies threat detection, impairs prefrontal regulation, increases emotional reactivity. The integration informs morning hardware reading and bedtime wind-down trigger.

**Status:** partially shipped (sleep deprivation already a bio-filter state). Native data pull NOT yet shipped (HRV/HealthKit/Health Connect listed as integration milestone in Master Todo).

**Data pulled (neutral, silent by default):**
- Total sleep duration last night
- Sleep efficiency (time asleep / time in bed)
- Wake time + bedtime (for circadian-aware surface timing)
- Rolling 7-day sleep average

**Data NOT pulled:**
- Sleep stages breakdown (over-precision)
- Sleep score / proprietary score from source app (loaded — performance framing)

**Source paths:**
- iOS: HealthKit (`HKCategoryTypeIdentifierSleepAnalysis`)
- Android: Health Connect (`SleepSessionRecord`)
- Watch: same as HRV — Apple Watch / Galaxy Watch / Oura / etc. via HealthKit / Health Connect

**Surfaces that consume sleep data:**

- **Morning hardware reading** — sleep duration below 6 hours auto-flags "sleep-deprived" bio-filter state (or strengthens the manual flag if user already selected it). Already shipped behavior in bio-filter; sleep-source pull not yet wired.
- **Today's Brief Hardware section** — references sleep signal ("running on 5 hours; threat detection will be amplified; today's reads will skew negative").
- **Bedtime wind-down timing** — WeatherKit sunrise/sunset + user's typical bedtime determine when the wind-down surface fires (~1 hour before sleep).

**Concierge behavior on sleep:**

- **Silent input:** sleep numbers never shown as a dashboard. The data colors the brief; it doesn't become a screen.
- **Surface routing:** if sleep is short, AI prompts shift toward gentler regulation (less analytical demand). If sleep is normal, full analytical depth available.
- **Pre-sleep cognitive consolidation guard:** review content NEVER fires within ~2 hours of typical sleep. Bedtime wind-down is consolidation only.
- **Threshold awareness:** N consecutive nights below baseline triggers a quiet adjustment in the brief ("your nervous system is running on cumulative sleep debt; today's load should be approached with that in mind") — no nagging, no "you need more sleep" coaching.

**[ARLIN — please fill in or confirm]:**
- Sleep auto-detection threshold: at what duration does it flip bio-filter to "sleep-deprived" automatically? (6 hours? 5? 5.5?) Or does it only INFORM AI without auto-setting state?
- Sleep tracker source: does the user pick (Apple Watch / Oura / phone-detected), or does Stillform read whatever's in HealthKit/Health Connect without specifying source?
- What happens when no sleep data is available (user doesn't wear a tracker)? Manual quick-tap "how did you sleep?" in morning check-in, or silent default?
- Bedtime wind-down trigger — fixed 1-hour-before-bed, or smart (e.g. when phone shows winding-down behavior + circadian time)?

### 2.4 Watch (Apple Watch / Galaxy Watch / Wear OS)

**Purpose:** wrist-accessible quick-breathe + ambient biometric input. Stillform's stabilization safety valve (Quick Breathe pill on home) extends to the wrist for in-the-moment access without phone retrieval.

**Status:** Watch APK build pending (Master Todo line item — environment-blocked on Android Studio install). Watch haptic breathing companion specified for Wear OS / Galaxy Watch Ultra. iOS Watch companion follows.

**What the watch surfaces:**

- **Quick Breathe** — wrist-tap → haptic-guided 60-second breath sequence. Same Quick Breathe pattern as the phone. The wrist is the stabilization safety valve when the phone isn't in hand.
- **Ambient biometric input** — HRV + heart rate + sleep all flow from watch via HealthKit / Health Connect (covered above in §2.2, §2.3).
- **Possible: pre-event nudge on wrist** — when a Pre-event Brief fires, wrist taps before the phone notification, for users who keep their phone silent in meetings. Status: spec'd? Need Arlin to confirm.

**What the watch does NOT surface:**

- No full session entry (the watch is too small for differentiation work; sessions stay on phone)
- No tracker dashboard
- No streak / achievement display

**Concierge behavior on watch:**

- **Anticipation:** wrist taps before phone for Pre-event Briefs (if specified)
- **Quiet logistics:** haptic-only Quick Breathe — no audio, no screen brightness changes
- **Discretion:** any wrist surface is briefer than its phone counterpart (operator-tier holds at all sizes)

**[ARLIN — please fill in or confirm]:**
- What other watch surfaces did you want beyond Quick Breathe?
- Should the watch show the current bio-filter state at a glance, or stay completely silent except on tap?
- Wear OS / Apple Watch / both at launch? (Galaxy Watch Ultra is your device; pattern ID mismatch already in punch list.)
- Should the watch fire its own EOD / bedtime wind-down nudge, or only mirror phone notifications?

### 2.5 Voice capture

**Purpose:** voice-to-text entry for users for whom typing is friction (neurodivergent users, motor difficulty, on-the-go). Reduces friction on a non-practice surface so more capacity remains for the practice.

**Status:** Web Speech API on web shipped. Native voice synthesis on iOS/Android pending (Master Todo — "closes the Safari gap and gives platform-quality voice").

**What voice enables:**

- **Reframe input by voice** — user speaks their situation; transcribed into the Reframe textarea
- **Signal Log entry by voice** — quick voice note → transcribed entry
- **EOD reflection by voice** — speak the day's reflection rather than typing

**Voice accent calibration (per user-memories):**
- Arlin has a New Jersey Armenian accent that affects transcription accuracy
- Native voice features should include accent calibration / training mode
- Critical for Arlin's own workflow

**Concierge behavior on voice:**

- **Reduce cognitive load:** the user produces material verbally without the friction of typing. The transcribed text then enters the same flow as typed text — the AI does the differentiation work on whichever form the user produced.
- **Quiet logistics:** voice capture is permission-gated and ON-DEMAND only (user taps the mic icon). Never always-listening. No background audio. Never used for ambient stress detection.

**[ARLIN — please fill in or confirm]:**
- Voice accent calibration UX: a one-time training step, or continuous learning as the user corrects transcripts?
- Voice for AI response playback: should the AI's reframe responses be read aloud (text-to-speech)? Spec'd as "simulated human contact" in Master Todo retention research note. What voice register? (Operator-tier prestige is the voice rubric for text; for audio, what does that translate to?)
- Push-to-talk only, or tap-to-start / tap-to-stop?

### 2.6 Weather

**Purpose:** environmental context that subtly informs hardware reading. Weather affects sleep, mood, circadian rhythms.

**Status:** WeatherKit (iOS) mentioned in CANON Operating Rule §5 for sunrise/sunset (circadian-aware surface timing). Full weather pull not separately spec'd.

**Data pulled (neutral, silent by default):**
- Sunrise / sunset (circadian-aware timing — when does morning beat fire, when does bedtime wind-down fire?)
- Daylight hours (seasonal context for Today's Brief)
- Major weather events (storm, heat dome, extreme cold) — context for the brief

**Data NOT pulled:**
- Precise temperature / humidity (over-precision)
- Air quality (could become a tracker surface)

**Surfaces that consume weather data:**

- **Surface timing** — sunrise / sunset determine when morning beat and bedtime wind-down fire on the home journey
- **Today's Brief** — context for the day ("first sub-zero morning; circadian markers may be off")

**Concierge behavior on weather:**

- **Silent input:** never shown as a weather widget. Informs timing + brief, never becomes a screen.
- **Threshold awareness:** seasonal transition windows (DST, equinox) may shift the user's circadian baseline; concierge adapts surface timing accordingly.

**[ARLIN — please fill in or confirm]:**
- Beyond sunrise/sunset, what specific weather data did you want pulled?
- Should weather flow into the AI's reframe context (e.g. "user is in a heatwave, hardware is depleted from heat")?
- Weather source: WeatherKit (iOS) is named; what for Android/web? Open-Meteo? AccuWeather?

### 2.7 Screenshot import (calendar + other)

**Purpose:** universal-path data import for users without native calendar access (work calendars locked to Outlook, family calendars in shared apps, etc.). User screenshots from any app; GPT-4o vision extracts structured data.

**Status:** Calendar screenshot import via GPT-4o vision SHIPPED (PR #76).

**What it enables:**

- **Calendar from any source** — screenshot of Outlook / Google Calendar / Apple Calendar / printed schedule, GPT-4o extracts events
- **Future possible: schedule screenshots from school / work / shared family calendars**

**Concierge behavior on screenshot import:**

- **Reduce cognitive load:** the user doesn't have to manually re-enter events. Screenshot is the lowest-friction universal path.
- **Quiet logistics:** image is processed once, structured data stored, image discarded. No image retention.
- **Discretion:** the screenshot is sent to GPT-4o with explicit privacy guardrails — only event-structured data extracted, no PII transmitted back, no image retained server-side.

**[ARLIN — please fill in or confirm]:**
- What other data types should be screenshot-importable beyond calendar? (Health summary from another app? Sleep summary?)
- Loaded-data risk: if user screenshots their workout-tracker dashboard, does Stillform extract it (would violate the neutral/loaded filter)? Or does the screenshot path only accept calendar-shaped inputs?
- Should screenshot import flow show the user what was extracted before saving, or accept silently?

### 2.8 Focus modes / Do Not Disturb integration

**Purpose:** Stillform sessions and bedtime wind-down should respect (and potentially trigger) the OS focus state. Reduces the surface area for interruptions during practice.

**Status:** SPEC'D NOT SHIPPED. Mentioned in CANON Operating Rule §1 ("focus modes" as an integration that protects the practice).

**What it would enable:**

- **Session-time focus** — when user starts a Reframe session, OS focus mode auto-enables (Do Not Disturb). When session closes, focus returns to previous state.
- **Bedtime wind-down focus** — wind-down surface triggers OS bedtime mode if the user opts in.
- **Pre-event Brief reception even during focus** — Stillform notifications classified as time-sensitive so they break through user-set focus modes for high-priority events.

**Concierge behavior on focus modes:**

- **Anticipation:** the system clears interruptions before the user has to ask for it.
- **Removal:** focus auto-disables when practice ends. User doesn't have to remember to turn it off.
- **Threshold awareness:** if user's focus mode is already active when a session starts, Stillform doesn't try to override — it respects their existing state.

**[ARLIN — please fill in or confirm]:**
- Focus modes are iOS Focus / Android Do Not Disturb / both?
- Auto-enable during sessions: opt-in only, or default-on?
- Should Stillform's bedtime wind-down chain into the OS Sleep Mode?

---

## 3. CONCIERGE LAYER — BEHAVIORS BY SURFACE

The concierge is not a tab. It's structural behavior distributed across every existing surface (CANON Operating Rule §3). This section names the concrete behaviors per surface so the principle stays implementable, not abstract.

### 3.1 Morning (waking → check-in close)

**Concierge behaviors:**

- **Anticipation:** Today's Brief generated automatically at check-in close. User doesn't request it; it appears.
- **Quiet logistics:** Brief integrates HRV, sleep, calendar density, weather, recent trigger profile — all silently. User sees the synthesis, not the inputs.
- **Curation:** Brief surfaces what matters for THIS day, not generic morning content. If a calendar shows a high-load day, that's what the brief focuses on. If calendar is light, brief focuses on integration / consolidation.
- **Memory:** Yesterday's EOD takeaway flows into today's brief context. The concierge remembers what's pending.
- **Threshold awareness:** Low sleep + high calendar density triggers softer brief language and explicit hardware-protection moves.
- **Elegance of presentation:** Brief renders as four operator-tier sections (Hardware / Risks / Moves / Recovery), hairline-separated, no decoration.

### 3.2 In-the-moment (Reframe session entry through close)

**Concierge behaviors:**

- **Anticipation:** Bio-filter state and feel-state are pre-populated from morning check-in (the user doesn't re-enter what they already entered).
- **Quiet logistics:** AI receives full context (bio-filter, calendar, recent triggers, journal history, signal profile, named-moves library) silently. User just types or speaks.
- **Removal:** Quick Breathe pill is always available without leaving current screen (the one persistent surface).
- **Discretion:** Sessions are encrypted at rest. Privacy guarantee renders quietly on the screen header ("Your data is encrypted").

### 3.3 EOD review (after work, mentally active)

**Concierge behaviors:**

- **Anticipation:** EOD trigger fires when user's circadian-aware EOD window opens (not at a hardcoded clock time).
- **Curation:** EOD prompt isn't "how was your day?" — it's "anything to clear before bed?" The day's events surface as decompression candidates if the user wants them.
- **Memory:** Today's sessions, today's Reframe artifacts, today's Pre-event Briefs, today's calendar events all available for the EOD review without the user requesting them.
- **Threshold awareness:** if the day's load was high (multiple Reframes, high meeting density), EOD gets longer breath + heavier consolidation content. Light day gets a brief check-out.

### 3.4 Bedtime wind-down (~1 hour before sleep)

**Concierge behaviors:**

- **Anticipation:** Wind-down surface fires at the right time (circadian-aware via sunrise/sunset + user's typical bedtime).
- **Quiet logistics:** No review content. Pre-sleep cognitive consolidation guard fires here (CANON Operating Rule §5). Only consolidation, release, breath, sleep prep.
- **Removal:** Phone-down ritual closes the surface — concierge ends the surface so the user doesn't have to.
- **Threshold awareness:** if HRV is very low (unprocessed sympathetic load), wind-down includes longer cyclic-sighing recommendation before sleep prep.

### 3.5 Integration handling (ambient, all hours)

**Concierge behaviors:**

- **Silent data input:** HRV, sleep, calendar, weather all flow in silently per the neutral/loaded filter.
- **No tracker surfaces:** Stillform never becomes a health dashboard. Inputs inform; they never become screens.
- **Threshold awareness:** patterns over time (sleep debt accumulating, HRV trending down, calendar density rising) inform AI prompts but never get surfaced as "you've been X" framing.
- **Memory:** integration data is read by the AI for context. The user doesn't manage it; the concierge does.

### 3.6 What the concierge NEVER does

- Never builds its own surface. No "concierge tab," no "your assistant" framing, no AI sidekick metaphor.
- Never uses buddy-buddy or wellness-coach voice.
- Never asks the user to do logistics that the system could have handled silently.
- Never makes itself visible. The user notices things are easier than they should be — that's the only signal the concierge worked.

**[ARLIN — please fill in or confirm]:**
- The concierge behaviors listed above are reconstructed from CANON Operating Rule §3's behavior list ("anticipation, quiet logistics, curation, memory, discretion, removal, elegance of presentation, threshold awareness"). Are there specific concierge moves you generated that aren't captured above?
- Concierge sequence step D (unshipped, mentioned in Master Todo audit notes — steps A, B, C, E shipped) — what was D originally?
- Beyond the five surface contexts above, are there other surfaces where concierge behavior should explicitly live?

---

## 4. B2B SETUP — WHAT'S CAPTURED, WHAT'S NOT

The B2B privacy wall is fully captured in `STILLFORM_B2B_PRIVACY_ARCHITECTURE.md` — that doc is authoritative for what admins can see, what they cannot, and the three-layer enforcement (schema / function / audit). Reference it directly for privacy questions.

What's captured ABOUT B2B SETUP across CANON Section 10 + Master Todo:

### 4.1 The five revenue paths (CANON Operating Rule "Launch gates on SOC 2 Type 2")

All five ship at launch:

1. **Individual executive (expensed)** — the highest-margin path. Single user pays $X/mo, expenses through their company. No org admin, no SSO. Same product as consumer.
2. **Coach / practitioner channel** — coaches and therapists buy seats to recommend to clients. Some form of bulk seat purchase + practitioner attribution.
3. **Small team (<50 seats)** — bulk seats with one admin. Lighter admin dashboard. No SSO requirement.
4. **Mid-market (50–500 seats)** — full admin dashboard, optional SSO, bulk seat management.
5. **Fortune 500 enterprise (500+ seats)** — full SOC 2 Type 2 attestation, full SSO (Okta / Azure AD / Google Workspace), full MDM compatibility (Intune / Jamf / Workspace ONE), DPA + privacy policy addendum + IT deployment guide.

### 4.2 Build sequence (CANON Operating Rule + Master Todo)

- SSO (Okta / Azure AD / Google Workspace)
- Admin dashboard with bulk seat management
- B2B privacy policy + DPA template
- MDM compatibility verification (Intune / Jamf / Workspace ONE)
- SOC 2 Type 1 audit kickoff
- SOC 2 Type 2 observation cycle (6 months, runs in parallel with build)

Existing related docs:
- `STILLFORM_B2B_PRIVACY_ARCHITECTURE.md` — privacy wall, authoritative
- `B2B_DPA_TEMPLATE.md` — DPA template draft
- `B2B_IT_DEPLOYMENT_GUIDE.md` — IT-side deployment instructions
- `B2B_PRIVACY_POLICY_ADDENDUM.md` — privacy policy addendum for B2B
- `B2B_SSO_INTEGRATION.md` — SSO integration spec

### 4.3 What is NOT yet captured (B2B setup gaps)

- **Per-tier pricing.** Individual exec $X, small team $Y/seat, mid-market $Z/seat, Fortune 500 enterprise contract. Currently unspecified.
- **Coach / practitioner attribution mechanism.** Coaches buy bulk seats — how do clients see who recommended them? How does the coach see usage metrics WITHOUT violating the B2B privacy wall (admins can't see practice data; does this apply to coach-channel admins too)?
- **Admin dashboard scope.** What can an admin DO beyond seat management? Per CANON privacy wall: nothing. So the admin dashboard is essentially: invite seats / revoke seats / view org metadata / view audit log. Anything else violates the wall. Spec this explicitly.
- **Onboarding flow for orgs.** When a CTO buys 200 seats, what's the user-facing setup? Self-serve checkout + IT receives DPA + employees get magic-link invites? Or sales-touch for Fortune 500 path?
- **Per-tier SLA / support level.** Fortune 500 needs SLAs. Mid-market may. Small team / individual don't. Where's the line?
- **The procurement pitch.** CANON says "the only B2B self-mastery tool where employees actually trust it because the company genuinely cannot see what they do" is the pitch. The full pitch deck / one-pager for procurement teams — not yet captured.

**[ARLIN — please fill in or confirm]:**
- Pricing tiers — what's the per-seat cost at each level?
- Coach channel attribution — how do coaches see anything when the privacy wall says they can't?
- Sales motion — self-serve up to what tier, sales-touch above?
- Procurement pitch — should this become its own doc (`STILLFORM_B2B_PROCUREMENT_PITCH.md`)?
- What other B2B setup pieces did you generate that aren't in any of the existing docs?

---

## 5. CROSS-REFERENCES + WHERE EACH IDEA LIVES

For anyone reading this doc later: when you need the deep spec on any topic, this is where to look.

| Topic | Primary source | Supporting sources |
|---|---|---|
| Calendar ICS decompression | PR #75 commit message + code | This doc §2.1 |
| Calendar screenshot import | PR #76 commit message + code | This doc §2.1 |
| Today's Brief | `TODAYS_BRIEF_FLOW_AUDIT.md` | `STILLFORM_ENGAGEMENT_ARCHITECTURE.md` §3.2 ; this doc §2.1, §3.1 |
| Pre-event Brief | `PRE_EVENT_BRIEF_FLOW_AUDIT.md` | `STILLFORM_ENGAGEMENT_ARCHITECTURE.md` §3.2 ; this doc §2.1 |
| HRV integration | This doc §2.2 | `STILLFORM_CANON.md` Operating Rules §2 + §4 |
| Sleep integration | This doc §2.3 | `STILLFORM_CANON.md` Operating Rules §4 + §5 |
| Watch surfaces | This doc §2.4 + `WATCH_GUIDE.md` | `Stillform_Master_Todo.md` watch entries |
| Voice capture | This doc §2.5 | `Stillform_Master_Todo.md` native voice entry |
| Weather | This doc §2.6 | `STILLFORM_CANON.md` Operating Rule §5 (sunrise/sunset for surface timing) |
| Screenshot import (any) | This doc §2.7 | PR #76 (calendar instance) |
| Focus modes | This doc §2.8 | `STILLFORM_CANON.md` Operating Rule §1 |
| Concierge philosophy | `STILLFORM_CANON.md` Operating Rule §3 | This doc §3 |
| Concierge per-surface behaviors | This doc §3 | `STILLFORM_CANON.md` Operating Rule §3 (named behaviors) |
| B2B privacy wall | `STILLFORM_B2B_PRIVACY_ARCHITECTURE.md` | `STILLFORM_CANON.md` Operating Rules §7 + §8 |
| B2B setup (revenue paths, SSO, build sequence) | This doc §4 | `STILLFORM_CANON.md` Operating Rule §7 ; `B2B_*.md` family |
| Three-layer positioning framework | `STILLFORM_CANON.md` v1.2 versioning + Operating Rule §6 | (referenced when integrations need positioning calls) |

---

## 6. WHAT THIS DOC IS HONEST ABOUT NOT YET HAVING

Every section above ends with **[ARLIN — please fill in or confirm]** flags. Those are the gaps. They're gaps because:

1. The compressed CANON Operating Rules don't preserve the specifics of the original generative conversation
2. Compaction summaries that fed prior Claude sessions retained the rule but not the deeper idea
3. The current session's Claude (May 14 evening) doesn't have the original generative-conversation context — only the rules-as-captured

When Arlin fills in any flagged gap, this doc gets updated. The flags are explicit so nothing slips by silently.

The remaining work after Arlin's fill-in pass:
- Pricing tiers (B2B §4.3)
- Coach attribution model (B2B §4.3)
- Concierge sequence step D (concierge §3.6)
- HRV permission flow + auto-bio-filter behavior (HRV §2.2)
- Sleep auto-detection threshold (Sleep §2.3)
- Watch surfaces beyond Quick Breathe (Watch §2.4)
- Voice accent calibration UX (Voice §2.5)
- Pre-event Brief content shape per event type (Calendar §2.1)
- Calendar decompression at EOD — actual flow (Calendar §2.1)

This is the punch list of "ideas Arlin generated that aren't yet captured in detail." When she's ready to do a fill-in pass, this doc is where the answers go.

---

## VERSIONING

**v1.0 — May 14, 2026 evening.** Created as consolidated reference per Arlin's direction: "make sure that we capture the ideas that I generated with the integrations of the calendar and all... and the HRV and the sleep and the other tools as well as, um, the concierge and also that the b2b is properly setup."

Future versions update this doc when integrations + concierge + B2B setup evolves. Cosmetic edits don't require a version bump; substantive changes do.

---

*ARA Embers LLC · Stillform Integrations Layer + Concierge Behaviors · May 14, 2026*
