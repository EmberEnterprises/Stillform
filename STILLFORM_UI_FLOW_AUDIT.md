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

#### 6. Bio-filter invisible at Reframe entry
- **Where:** Reframe entry surface. The user can see chips, tone dropdown, processing primer — but cannot see what bio-filter the AI is currently reading them in. Bio-filter now drives major behavior changes (low-demand mode triggers on six bio-filter values).
- **What's wrong:** transparency gap. The user signed up for AI-assisted composure architecture; the AI's read of their hardware state should be visible and editable.
- **Spec ref:** Master Todo line 511. Approach is locked: status line (NOT a chip row) between "FROM THIS MORNING" and "ANYTHING TO ADD?" — `ACTIVE: depleted · set this morning ⓘ ✎`. Edit drawer reuses existing chip array, renders inline.
- **Fix scope:** ~30 min. New `BioFilterStatusLine` mini-component, slot into `PresentStateChips`.
- **Why prestige tier:** invisible-but-load-bearing state is the opposite of the operator-tier transparency the brand promises.

#### 7. Tone dropdown reads as label, not control
- **Where:** Reframe AI tone dropdown (App.jsx ~9329). Implemented in the May 2 three-layer system but visually reads as static caption — fontSize 10, monospace caps, `--text-muted`, transparent bg, thin border. After the May 6 prestige refresh it's even easier to skip on a phone.
- **What's wrong:** users don't know it's interactive. A control they paid for is visually inert.
- **Spec ref:** Master Todo line 532.
- **Fix scope:** ~10 min. Bump font slightly, less-muted color (`--text-dim` or `--text`), more obvious border or subtle accent fill, possibly relabel.
- **Why prestige tier:** prestige standard requires that interactive elements *look* interactive without flashing for attention.

#### 8. Splash wordmark inconsistent with nav wordmark
- **Where:** Splash renders `Stillform` as single block in `var(--amber)` (line 15384). Nav renders `Still<span>form</span>` with split treatment — body color + amber on `form` (line 15400).
- **What's wrong:** first impression doesn't match the rest of the app's wordmark treatment. On the teal theme the splash reads all-teal while nav reads split.
- **Spec ref:** Master Todo line 537.
- **Fix scope:** ~2 min. Either split the splash to match nav, OR accept ceremonial all-accent as deliberate. Design call needed.
- **Why prestige tier:** the wordmark is the brand. Two treatments in two surfaces is the kind of thing prestige users notice.

#### 9. "How much do you owe this guy?" ad-tracking link visible at home footer
- **Where:** Home screen, very bottom (visible in your May 7 screenshot).
- **What's wrong:** appears to be a Plausible or browser-injected tracker rendering visible text in the chrome. This shouldn't be visible in production.
- **Source unknown:** not located in App.jsx grep. Likely Chrome's "ad/tracker blocked" debug overlay or a similar browser-extension artifact, NOT app code. Verify on your phone with extensions disabled before flagging as a bug.
- **Why prestige tier:** if it's app-side, it breaks the editorial-luxury frame. If it's browser-side, it's not the app — but you should know which.

#### 10. "Pull to refresh" affordance on home — reconsider
- **Where:** Home screen top — "PULL TO REFRESH" hint visible above the greeting (your May 7 screenshot).
- **What's wrong:** instructional text on the home screen breaks the editorial restraint. Aesop / Cartier / MUBI never instruct the user. The gesture should work without on-screen narration.
- **Fix scope:** make the instruction appear ONLY on the actual pull (during interaction), not as static caption.
- **Why prestige tier:** silent affordances are a brand signal. Captioned ones are wellness-app default.

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

> **Verification update May 7:** Block 1 is mostly already shipped. Sequence below reflects current actionable state.

**Block 1 — must ship before TestFlight:**
1. ~~Auto-sync + restore-purchases on app open (#1)~~ — ✅ already resolved May 7
2. ~~Morning check-in `mood` contract restore (#2)~~ — ✅ already resolved May 7
3. ~~QBPill clamp on mount (#3)~~ — ✅ already resolved May 7
4. **Low-demand close — keep post-state chip (#5)** — ⛔ ACTIONABLE TODAY

**Block 2 — prestige polish for launch:**
5. Bio-filter status line at Reframe entry (#6)
6. Tone dropdown affordance (#7)
7. Splash wordmark consistency (#8)
8. Pull-to-refresh instructional text (#10)
9. Verify "How much do you owe this guy?" footer text source (#9)

**Block 3 — flow walks (no edits, just observation):**
10. First-run cold-open walk (#12)
11. EOD surface walk (#13)
12. AI failure → Self Mode handoff voice walk (#14)

**Block 4 — environment-blocked:**
13. Watch pattern ID mismatch (#4) — source already fixed; APK build pending Android Studio

Block 1 is mostly done — only #5 remains as a code task. Block 2 is what makes the app *land* the way the brand demands. Block 3 surfaces things I haven't verified yet — the audit is honest about its gaps. Block 4 is real but separate from the path to web/iOS launch.

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
