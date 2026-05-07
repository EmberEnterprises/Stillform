# STILLFORM — UI FLOW AUDIT
**ARA Embers LLC · May 7, 2026**
**Walked from the canonical docs and the actual code, not from memory.**

---

## Method

Layer 0 (read the docs) before any walk. What I read:

- `STILLFORM_PROJECT_TRANSFER.md` §0 (Vision/Values), §1 (What Stillform Is), §2 (Build State), §2.6 (Engagement Architecture decision)
- `Stillform_Master_Todo.md` (entire Bugs/Defects + UX Surface Refinements + Prestige Refresh sections)
- `Stillform_Punch_List.md` (Core Ship Gate + recent session entries)
- `Stillform_Strategic_Roadmap.md` (Return-Loop Architecture + Engagement decisions)
- `STILLFORM_DESIGN_SYSTEM.md` (Apr 30 prestige refresh spec)
- `COMPOSURE_SELF_MASTERY_LEGIBILITY.md` (locked positioning)
- `SCRATCH_FOUNDER_VOICE.md` (Arlin's voice patterns)
- `STILLFORM_ENGAGEMENT_ARCHITECTURE.md` §3.1 (5-stage Roadmap)

What I walked in code: `src/App.jsx` — top-level screen routes, setup/onboarding flow, home render order, three core tools (Reframe, Body Scan, Breathe), Self Mode, post-session flow (close screens), prestige design tokens at `:root` (line 82), error/loading/empty state patterns.

---

## What's working

Naming this so the audit isn't only complaint:

- The prestige design system is **actually wired**. Tokens at `App.jsx:82-146` — `#08080A` ground, antiqued `#B8862B` amber, hairline borders at 0.06 opacity, 2/4/6 radius scale, motion easings. This is the editorial-luxury family the design system spec called for, in production.
- Voice is largely consistent. No "amazing," "you've got this," "your journey," "wellness," "self-care" in user-facing copy. Banned-phrase scans clean. Therapy-coded language scrubbed.
- Calibration tendency is honored as probabilistic, not as fixed type — the per-session bio-filter and feel state modulate routing as the locked decision requires.
- AI failure → Self Mode handoff is built (counter-based, /health endpoint polling, recovery pill). The fallback flow exists.
- Post-session flow is fully composed: pre-rate → tool → post-rate → What Shifted → Next Move → Lock-in → Plain-Language Science card. End-to-end.
- Pattern Disruption surfaces (in-modal + Settings transparency screen) are wired and now tightened (today).
- 15 top-level screens routed and reachable: home, settings, pricing, progress, faq, privacy, crisis, focus-check, tutorial, setup, setup-bridge, reset-password, panic, pattern-transparency, tool. None orphaned.

The bones are right. The work below is calibration, not reconstruction.

---

## Findings ranked by tier

Tiers:
- 🔴 **BROKEN CONTRACT** — behavior is wrong or absent. Must fix before launch.
- 🟠 **PRESTIGE GAP** — visible polish issue eroding the brand standard.
- 🟡 **FLOW SEAM** — transition or coherence issue between surfaces.
- 🟢 **TRACKED** — already in Master Todo, surfaced here for ordering.

---

### 🔴 BROKEN CONTRACTS (fix before launch)

> **Verification update May 7, 2026:** After publishing this audit I re-walked each item against current code state (Layer 6 self-skepticism check after Arlin pushed back). Three of five items below were already shipped May 7 but Master Todo entries weren't crossed off, so my initial audit took stale entries at face value. Status flags below reflect the corrected state. Process lesson: read code first, docs second — not the reverse.

#### 1. Auto-sync + restore-purchases on app open — ✅ ALREADY RESOLVED MAY 7
- **Where:** Returning user opens the app already signed in.
- **What was wrong:** Cloud data and subscription entitlement did not auto-restore.
- **Resolution:** Launch Sync useEffect at `src/App.jsx:14000-14028` (added May 7, debounced 2 minutes, deps `[syncSignedIn]`). On app open, fires `sbSyncDown()` then `setSubscriptionCheckTick(n => n + 1)` which triggers `sbCheckSubscriptionStatus()` at line 13958. Comment at 13988 explicitly references the Master Todo entry.
- **Verified on phone May 7 (Arlin):** subscription shows active without manual restore tap.

#### 2. Morning check-in `mood` field — broken writer/reader contract — ✅ ALREADY RESOLVED MAY 7
- **Where:** Morning check-in writes mood; `PresentStateChips` at Reframe entry reads it.
- **What was wrong:** Writer dropped `mood` field in a refactor; consumer still expected it.
- **Resolution:** `saveCheckin()` at `src/App.jsx:17577` now writes `mood: ciMood || null`. Comment explicitly says *"morning emotional state, restored after broken-contract fix."* Fix was option (a) per the original recommendation — restored capture, kept the feature intent.

#### 3. QBPill saved position not clamped on mount — ✅ ALREADY RESOLVED MAY 7
- **Where:** Quick Breathe pill at App.jsx ~13662.
- **What was wrong:** `getSavedPos()` returned saved position without clamping; off-screen on smaller phones.
- **Resolution:** `getSavedPos()` at `src/App.jsx:13678-13686` now wraps the saved position through `clamp()` before returning. Comment at line 13666 references this fix and the bug it addressed.

#### 4. Watch haptic breathing — pattern ID mismatch — ⚠️ SOURCE FIXED, APK BUILD PENDING
- **Where:** Galaxy Watch Ultra companion.
- **Source state:** `WearBreatheActivity.java` switch already handles all three current phone-side IDs (`quick`, `deep`, `cyclic_sigh`) with correct phase durations. Source code is no longer the bug.
- **Remaining work:** Watch APK on Arlin's physical device hasn't been rebuilt with the source change. Genuinely environment-blocked — requires Android Studio installed locally to run `npx cap sync` + Gradle build + install on watch. Not a code task.

#### 5. Low-demand close strips post-state chip — ⛔ GENUINELY UNFIXED
- **Where:** `src/App.jsx:5520-5525` (Breathe close) + similar in Body Scan close.
- **What's wrong:** When `isLowDemand` is true, code bypasses post-rate + debrief + Next Move and renders `<LowDemandComplete>` directly. The post-state chip is the lowest-demand metacognitive act in the app — stripping it means a depleted user who *did* shift has no way to mark it.
- **Spec ref:** Master Todo line 542. The Apr 28 locked decision sets the population for low-demand; it does NOT set the strip list. Strip list went too far.
- **Fix scope:**
  - Keep post-state chip screen for low-demand users (single tap, no required follow-up).
  - Add "tap anywhere to close" if user doesn't feel shifted.
  - Drop everything *after* chip (State-to-Statement, science card, debrief, Next Move/Lock-in).
  - Apply same pattern to Body Scan close.
- **Why broken-contract tier:** the lowest-effort metacognitive act is unreachable for the users who most need it to be effortless.
- **STATUS: ACTIONABLE TODAY.** This is the only Block-1 item that needs code work. All other "broken contracts" already shipped or are environment-blocked.

---

### 🟠 PRESTIGE GAPS (calibration, not reconstruction)

> **Verification update May 7, 2026:** Same pattern as Block 1 — most items already shipped May 7 but Master Todo entries weren't crossed off. Re-verified all five against current code state.

#### 6. Bio-filter invisible at Reframe entry — ✅ ALREADY RESOLVED MAY 7
- **Where:** `PresentStateChips` at `src/App.jsx:11636-11788`.
- **What was wrong:** No transparency on what bio-filter the AI was reading the user in.
- **Resolution:** Status line slot built into `PresentStateChips` exactly per spec — monospace caps `Bio-filter · {label}`, ⓘ for explanation modal (Seth 2013, Barrett & Simmons 2015), inline edit drawer with all `BIO_FILTER_OPTIONS`. 2-tap mid-day update path delivered.

#### 7. Tone dropdown reads as label, not control — ✅ ALREADY RESOLVED MAY 7
- **Where:** Reframe AI tone dropdown at `src/App.jsx:10019-10048`.
- **What was wrong:** Visually read as static caption.
- **Resolution:** Comment at line 10025 explicitly cites the May 7 affordance bump — fontSize 10→11, muted color → dim, plain border → amber-dim accent, subtle resting bg, brighter chevron. All five items from the original proposal applied.

#### 8. Splash wordmark inconsistent with nav wordmark — ✅ ALREADY RESOLVED MAY 7
- **Where:** Splash render at `src/App.jsx:16473`.
- **What was wrong:** Splash rendered "Stillform" all-amber; nav rendered split (text-color "Still" + amber "form").
- **Resolution:** Splash now renders `Still<span style={{ color: var(--amber) }}>form</span>` matching the nav. Visual consistency restored across surfaces.

#### 9. "How much do you owe this guy?" footer text — ⚠️ LIKELY BROWSER OVERLAY, NOT APP
- **Where:** Visible in May 7 home screenshot.
- **Verification:** Searched the entire `src/App.jsx` codebase — no such text exists in app source. Likely a Chrome extension overlay, browser tracker-block message, or similar non-app artifact.
- **Action:** Verify on phone with extensions disabled. If still present in clean browser context, dig deeper. If gone, this is a non-issue — close out.

#### 10. "Pull to refresh" affordance on home — ✅ ALREADY CORRECT
- **Where:** Pull-to-refresh indicator at `src/App.jsx:21281-21323`.
- **What I claimed was wrong:** Static instructional text breaking editorial restraint.
- **Resolution:** Re-read code. Indicator is gated on `(isPulling || isRefreshing)` — only renders during the actual gesture, not as static caption. The text in Arlin's original screenshot was likely captured mid-pull. Audit finding was incorrect; existing implementation already follows the editorial-luxury pattern (silent affordance, surfaces only on interaction).

---

### 🟡 FLOW SEAMS (coherence between surfaces)

#### 11. Sessions count is now redundant in Talk it out subtitle + My Progress
- **Where:** Today I added `Last · Reframe · 1H AGO` as a subtle subtitle inside the Talk it out tile. My Progress (when expanded) shows `Reframe MOST USED`. Same data, two surfaces.
- **What's wrong:** I introduced this redundancy this session by moving the pill into the tile. The Talk it out subtitle and the My Progress "Most Used" overlap conceptually.
- **Possible fix:** the subtitle is contextual ("you can pick up where you left off") — it has unique purpose. My Progress "Most Used" is aggregate. They probably aren't redundant — the test is whether they say the same thing or different things. Most Used is `Reframe`; the subtitle says `Last · Reframe · 1h ago`. Different facts, same tool name. Acceptable.
- **Verdict:** keep both. Flagging here so you know I considered it after your feedback on the stats banner.

#### 12. First-run flow → home transition
- **Where:** User completes setup → setup-bridge → home. Three named stages: `tutorial`, `bridge`, `calibration`.
- **What I haven't verified:** whether the transition from completed calibration to first home loads as a celebratory moment OR drops the user into a cold home with no orientation. Per Engagement Architecture spec, the Stage-1-crossing moment is the generalized form of milestone-7 — but that's for *future* stage crossings, not for the first-time-home arrival.
- **Recommended walk:** open the app fresh (clear localStorage), complete setup, and audit what the first home screen looks like for a user who has never seen it. Specifically: does the greeting know it's their first time? Does Talk it out's "Last · Reframe · 1h ago" subtitle make sense for someone with zero sessions? (Per the gating I added today, no — `getMostRecentSession` returns null, subtitle returns null. ✓ verified.)
- **Why flow-seam tier:** this surface is the first 30 seconds of the product. It deserves a focused walk that I haven't done yet.

#### 13. End-of-day surface placement
- **Where:** EOD prompt fires after 6pm — "Anything you want to clear before bed?" → optional evening Reframe (per Project Transfer §2 Daily Loop).
- **What I haven't verified:** how the EOD card surfaces, what it looks like, whether it interrupts or invites. Per Project Transfer this is part of the daily loop's three inputs.
- **Recommended walk:** simulate post-6pm cold-open and audit the EOD surface against the four pillars (specifically: precision over gentleness — does it sound like an invitation or a guilt trip?).

#### 14. AI failure → Self Mode handoff voice
- **Where:** Single failure offers "Switch to Self Mode" card; two+ failures auto-switches. Polling /health every 45s. Pill prompt when AI recovers.
- **What I haven't verified:** the actual copy on the offer card, the auto-switch transition, the recovery pill. The handoff is a high-stakes moment — if the user is mid-spiral and AI fails, the Self Mode invitation has to land *without* feeling like a downgrade.
- **Recommended walk:** read the literal strings in those three surfaces. Compare against `SELF_MODE_REDESIGN_RESEARCH.md` (Past Self / Present Self framing locked May 7). The current offer card may pre-date the framing lock and need voice review.

---

### 🟢 TRACKED (already in Master Todo, listed here for ordering)

- Engagement Architecture build (12-18 builds, post-launch per current decision)
- My Progress redesign (consolidate 8 sections → 4, depends on prestige refresh — already partially landed)
- "Additional morning chips" — needs Arlin's direction (Master Todo line 555)
- Processing primer threshold tunable (Master Todo line 507)
- Surface refinements per spec §282
- AI-as-actor voice audit (Master Todo line 307)

---

## Recommended ship order

> **Verification update May 7 (final pass):** Both Block 1 and Block 2 are now essentially complete. Most items were already shipped May 7 but Master Todo entries weren't crossed off. The actionable launch path is much shorter than my initial audit suggested.

**Block 1 — must ship before TestFlight:**
1. ~~Auto-sync + restore-purchases on app open (#1)~~ — ✅ already resolved May 7
2. ~~Morning check-in `mood` contract restore (#2)~~ — ✅ already resolved May 7
3. ~~QBPill clamp on mount (#3)~~ — ✅ already resolved May 7
4. ~~Low-demand close — keep post-state chip (#5)~~ — ✅ resolved May 7 (Reframe + Body Scan early; Breathe late same day)

**Block 2 — prestige polish for launch:**
5. ~~Bio-filter status line at Reframe entry (#6)~~ — ✅ already resolved May 7
6. ~~Tone dropdown affordance (#7)~~ — ✅ already resolved May 7
7. ~~Splash wordmark consistency (#8)~~ — ✅ already resolved May 7
8. ~~Pull-to-refresh instructional text (#10)~~ — ✅ already correct (was audit error)
9. **Verify "How much do you owe this guy?" footer text source (#9)** — ⚠️ Phone test with browser extensions disabled. Likely browser overlay, not app.

**Block 3 — flow walks (no edits, just observation):**
10. First-run cold-open walk (#12) — entrance, calibration, first home
11. EOD surface walk (#13) — post-6pm experience
12. AI failure → Self Mode handoff voice walk (#14) — handoff card copy review

**Block 4 — environment-blocked:**
13. Watch pattern ID mismatch (#4) — source already fixed; APK build pending Android Studio

The actual remaining launch path is: **#9 verification + Block 3 walks + Block 4 build environment**. Plus any new findings the walks surface.

---

## What this audit does not cover

I did not walk:
- The Settings screen in detail (sub-sections, edit affordances)
- The Crisis Resources screen (sensitive — needs careful walk before flagging anything)
- Pricing screen (Lemon Squeezy paywall live — separate concern)
- FAQ screen content
- The Body Scan tool internal flow (acupressure sequence, pace toggles)
- Translations / language scaffolding

Each of these deserves its own walk. They're not flagged as findings here because I haven't earned the right to call them.

---

## Honest method note

This audit was produced after Arlin pointed out that I (Claude) habitually start audits without reading the canonical docs first. I did Layer 0 this time — listed above with specific sections cited. I cross-referenced findings against `Stillform_Master_Todo.md` so this audit doesn't duplicate already-tracked items but ranks them in flow-impact order.

If anything in this audit reads as a guess, flag it. Guesses are exactly the failure mode the audit philosophy is supposed to prevent.

---

**Next step:** Arlin reviews. Approves Block 1 ordering or reorders. Then I start at the top.
