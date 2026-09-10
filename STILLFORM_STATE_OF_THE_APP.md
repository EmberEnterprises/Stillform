# STILLFORM — STATE OF THE APP
**Complete audit from the ground up. Started 2026-08-17 (Arlin: "start from the beginning, complete + thorough, no fabrications").**
**Every line here is verified against live code in `src/v2/`, not memory. This file is the single honest map.**

## 0. HEALTH (verified 2026-08-17)
- `npm run build`: clean.
- Test suite: 68/68 test files pass.
- `boot-static`: PASS — every lazy screen route resolves and emits a chunk.
- HEAD commit: f730a66.
- **The app is NOT broken. It builds, tests pass, every screen loads.** Whatever needs work, the foundation is sound.

## 1. WHAT THE APP IS (verified inventory)
- **42 screens routed and reachable** in AppV2 (49 screen files total; the extra few are sub-components/overlays reached inside flows).
- **37 backend Netlify functions** (AI, backups, subscription, organization/B2B, briefs, enrichment).
- **4 public pages**: privacy.html, terms.html, deletion.html, uat-roadmap.html.
This is a DEEP app, not a thin one.

## 2. THE CORE USER FLOW (verified reachable)
Entry -> Onboarding (first time) -> Home (SmartScreen). From Home the user reaches:
- **State check** (statecheck / Spine) -> the Reframe AI flow
- **Breathe** (BreatheOverlay / QuickBreathe — quick breath from anywhere)
- **Body Scan**
- **Concierge** (the room: all the P1-P34 calendar/weather/pattern voices)
- **My Progress**, **Library** (education + lessons), **Settings**
- Profile setup: Context / Trigger / Bias / Values / Vulnerabilities / Strengths profiles
- The "mirror" family: Capacities, Risk, Prediction-Error, What-You-Bet-On, Naming Ledger, Season Review, Becoming
- Practice mechanics: Thought Record, Defusion, Affect Labeling, Narrative Arc, The Re-Read, Observer Seat, Framework Model

## 3. LAUNCH GATES — VERIFIED STATUS (2026-08-17)
- **Account deletion**: DONE + LIVE (env vars confirmed present). Server fn + client + screen + web page.
- **Terms of Service**: DONE (public/terms.html, live link in Settings).
- **Subscription PORTAL** (manage/cancel existing): DONE (embers.lemonsqueezy.com/billing wired).
- **Pricing DISPLAYED**: CORRECT as of today — $24.99/mo, or $17.49/mo billed annually (save 30%). Fixed on Paywall + Terms.

## 4. THE REAL GAPS (verified, ranked — this is the actual to-do)
1. **CHECKOUT DOESN'T FUNCTION (launch/revenue blocker).** The Lemon Squeezy subscription PRODUCTS don't exist yet at $24.99/$17.49-annual. Until Arlin creates them in the LS dashboard, there are no checkout links to wire, so NO ONE CAN SUBSCRIBE. **This is the #1 thing blocking launch. It is Arlin's dashboard step.**
2. **Watch companion — DONE IN CODE 2026-08-17.** JS trigger wired (src/v2/lib/watchBridge.js -> WatchBridgePlugin, fired from BreathingSession.jsx on session start, degrades silently off-Android) AND pattern-id mismatch fixed (WearBreatheActivity now matches the real v2 ids deep-regulate/cyclic-sighing/quick-reset, with legacy aliases; WatchBridge comment corrected off the dead App.jsx; plugin default fixed from invalid 'calm' to 'deep-regulate'). Tested 4/4. REMAINING: compile + on-device test needs Arlin's Mac (device-gated only).
3. **Data export — DONE IN CODE 2026-08-17.** src/v2/lib/dataExport.js gathers all stillform* keys (EXCLUDING auth/token/install-id secrets), downloads as pretty JSON; Settings -> Privacy & contact -> Download my record. Tested 4/4.
4. **Verify OPENAI_API_KEY set in Netlify (Arlin, env).** Reframe code is correct; confirm the key like the Supabase ones.
5. **Internal .md docs still carry old $14.99/$9.99 pricing** — record hygiene, not user-facing.

## 5. NOT-BLOCKING / OPEN BY DESIGN (scoped, not broken)
Becoming, The Re-Read, library expansion, engagement architecture, catalog items P20/P26/P32-34 — these are scoped-but-not-fully-built by design (future work, awaiting Arlin's direction), NOT broken flow.

## 6. DEVICE / ACCOUNT GATED (not code, not tonight)
- Android + Watch native BUILD (needs Arlin's Mac + Android Studio — later, her call).
- iOS (gated behind Android revenue, her decision).
- Lemon Squeezy product creation (her dashboard).

## ===== DEEP CODE AUDIT (2026-08-17, Arlin: "thorough, from the code, not memory") =====
Verified facts only. No adjectives, no comparisons.

### FACTS (counted from the repo)
- build: succeeds. test files: 70/70 pass. boot-static: PASS.
- 49 screen files; 42 routed in AppV2; 99 lib files; 37 netlify functions; 70 test files.

### SCREEN INTEGRITY (verified)
- Every routed screen resolves to a real, loadable component (boot-static loads each one — authoritative).
- ZERO orphan screens: every screen file is referenced somewhere. Nothing built-and-abandoned.
- No zero-line stubs. Smallest screen = Home (46 lines, simple by design).
- (Caught + discarded a FALSE "missing screens" alarm from a buggy path-check script — files all exist.)

### REAL FINDING #1 — AI ACTIVE-PROMPT PATH IS STUBBED (by design, not broken)
- src/v2/lib/activePrompt.js: the AI-generated prompt path is STUBBED. It attempts to fetch /netlify/functions/active-prompt, which DOES NOT EXIST, and always falls back to static confidant-voice prompts.
- CONSEQUENCE: prompts WORK (static fallback ships and functions), but the AI-PERSONALIZED version of them was never built. This is a planned-enhancement-not-built, not a broken feature.
- (Corrected my own earlier inventory: I implied "active-prompt" was among the 37 functions; it is NOT — verified by listing the directory.)
- STATUS: known gap, not launch-blocking (feature degrades to working static prompts). Arlin's call whether the AI version matters for launch.

### BREATHING METHODS (verified against decision record)
- Code has THREE patterns: deep-regulate (4-4-8-2, 10 rounds), cyclic-sighing (4-1-8, 23 rounds), quick-reset (4-4-6, 4 rounds). Each has a HARDCODED totalRounds.
- Searched full git history + all docs: NO record of a decision to reduce to one method or make duration user-controlled. If that decision was made, it was never committed anywhere — it lives only in memory. THIS IS A CAPTURE GAP: the decision (if real) needs to be recorded, then implemented. The code currently contradicts what Arlin remembers deciding.

### LIB + BACKEND AUDIT (verified)
- 99 lib files: ZERO orphaned. Every lib is imported somewhere. No dead feature code.

### FINDING #2 — [ALREADY EXPLAINED, NOT A MYSTERY] duplicate deletion function
- TWO exist: netlify/functions/account-delete.js (4281 bytes, NOT called by anything) and delete-account.js (4578 bytes, the LIVE one wired to AppV2). account-delete is orphaned older/duplicate — dead code. Both are auth-gated (not a security hole), but account-delete.js is the ORIGINAL May 6 deletion build (commit 42ed650), superseded when delete-account.js was built. Known-superseded, not random cruft. Trivial optional cleanup; NOT a finding that needs Arlin's attention. (I over-flagged this.)

### FINDING #3 — [ALREADY DECIDED, NOT A GAP] B2B/org backend staged ahead of frontend
- 11 organization-* functions exist (create, invite, accept-invite, list-members, remove-member, update, status, audit-log, billing-checkout, billing-portal) — a complete B2B team-management backend. ZERO frontend references it (no screen/component mentions organizations). It is entirely unreachable from the app.
- All auth-gated (parseBearer + getUserFromToken) — NOT an open security hole, just unused.
- ALREADY DECIDED — NOT A GAP. Dedicated docs exist: B2B_SSO_INTEGRATION.md, STILLFORM_B2B_PRIVACY_ARCHITECTURE.md (names organization-invite.js etc. as 'Future write endpoints, PR B+'), and STILLFORM_CANON.md:333 'All five B2B revenue paths ship at launch.' The backend-ahead-of-frontend is DELIBERATE and PLANNED. I wrongly presented a settled, documented strategy as a mystery gap — corrected. NOTHING for Arlin to decide here; it's decided.
- Functions correctly NOT-frontend-called for legitimate reasons (NOT findings): subscription-webhook (Lemon Squeezy webhook), link-sentinel (@daily cron), metrics-ingest (server-side). These are supposed to be non-frontend.
