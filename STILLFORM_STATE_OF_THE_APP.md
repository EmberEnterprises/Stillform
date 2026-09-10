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
2. **Watch companion — no JS trigger + pattern-id mismatch (code, Claude's).** The native watch halves are built and wired, but nothing in the app starts the watch, and the pattern ids reference the deleted src/App.jsx. Fixable from here; Mac only for compile/test.
3. **No user-facing data export (Tier-2, Claude's, NOT launch-blocking).** "Download my record" is absent.
4. **Verify OPENAI_API_KEY set in Netlify (Arlin, env).** Reframe code is correct; confirm the key like the Supabase ones.
5. **Internal .md docs still carry old $14.99/$9.99 pricing** — record hygiene, not user-facing.

## 5. NOT-BLOCKING / OPEN BY DESIGN (scoped, not broken)
Becoming, The Re-Read, library expansion, engagement architecture, catalog items P20/P26/P32-34 — these are scoped-but-not-fully-built by design (future work, awaiting Arlin's direction), NOT broken flow.

## 6. DEVICE / ACCOUNT GATED (not code, not tonight)
- Android + Watch native BUILD (needs Arlin's Mac + Android Studio — later, her call).
- iOS (gated behind Android revenue, her decision).
- Lemon Squeezy product creation (her dashboard).
