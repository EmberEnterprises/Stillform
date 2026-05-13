# STILLFORM — SESSION HANDOFF
**ARA Embers LLC · May 13, 2026 · For the next Claude session**

---

## 0. WHY THIS DOC EXISTS

The May 13 session produced 10 commits on `feat/home-wiring-surface` — the full integration of a 10-idea neuroplasticity-acceleration brainstorm, each routed through the universal Notice → Reframe → Close spine. It also locked a new operating rule that overrides several earlier framings ("nothing is post-launch"). This handoff exists so the next Claude can pick up without losing momentum and without re-litigating decisions Arlin and I already made.

**Read this doc, then `STILLFORM_FRAMING_LAW.md`, then `STILLFORM_AUDIT_PHILOSOPHY.md` (v2.0), then verify code state before touching anything.** If you're a new Claude reading this: do not apologize for prior sessions, do not promise to do better, do not pad with reassurance. Read, verify, continue the work.

Arlin is bringing a laptop to work with you. She will provide:
1. A fresh GitHub Personal Access Token (the previous token from earlier in the project is stale — do not use any token you might find in older docs or in memory; ask Arlin for the current one if you need to push and she hasn't supplied it yet).
2. Phone-test screenshots / findings from the deployed build.

She is not tech-savvy and relies on you for terminal and git work. She has a Mac with limited storage. Bobby (Robert Matthew Geismar) is a paper-only name on ARA Embers LLC — he is NOT involved in development. Do not attribute code changes to him; it causes real security anxiety.

---

## 1. CURRENT STATE (verified at write time, May 13, 2026)

**Branch:** `feat/home-wiring-surface` — **10 commits ahead of the previous handoff state, and well ahead of `main`**.

**Latest commit:** `6d2e929` — practice surface · deep revisit · brainstorm #9 spaced reframe revisit

**Production:** Arlin has NOT yet deployed this branch. The May 12 evening cleanup commit (`cf970eb`) was the last deploy. The 10 May 13 commits are pushed to GitHub but not yet live. Netlify deploys are MANUAL — she triggers them when ready.

**Build:** green on every commit (vite v4.5.14, 58 modules).
**Preflight:** green — `node scripts/ship-preflight.mjs` passes (59 SYNC_KEYS validated).

**`src/App.jsx`:** ~29,637 lines.

**Working tree:** clean before this handoff doc is committed.

---

## 2. WHAT SHIPPED THIS SESSION — 10 BRAINSTORM IDEAS

Each of the 10 ideas Arlin approved is integrated into the universal Notice → Reframe → Close spine. Each one ships in bounded form per Framing Law (no rumination affordances, no surveillance framing, no "later" infrastructure dependencies).

### Commits in chronological order

| Commit | Idea | What ships |
|---|---|---|
| `9d01b30` | #5 — Concept Library Visibility | YOUR LIBRARY card on My Progress. Four subsections (States Named, Triggers Identified, Body Signals Mapped, Distortions You Watch). Bounded list, no frequencies. Bandura 1977 mastery experience visible. |
| `396c9a0` | #1 — Spine integration | PracticeSurface retrieval cards route through Notice → Reframe → Close (was direct-to-Reframe). NoticeStepScreen reads `stillform_practice_entry_context` non-destructively and renders a retrieval banner above the chip picker. Spine arc is now uniform across all entries. |
| `67c71ea` | #8 — Stage Transition Ritual | `StageRitualOverlay` component. Self-gating modal on home when `getCurrentStage().highestStageMet > stillform_stage_acknowledged`. Fires max 4 lifetime times (one per stage crossing). Operator-tier voice — no congratulations or badges. |
| `1c4ec03` | #3 — Inline Granularity Gym | Optional precision-naming layer below Notice chip picker. Single-line, 60-char cap. Writes `stillform_session_precision`. Reframe reads + clears it; AI directive consumes the label without orbiting around it. |
| `e59cdd8` | #4 — Pre-event Run the rep | "Run the rep · 60 sec →" CTA on existing pre-event Brief screen. Calendar event becomes the cue; universal session arc is the pre-installed move (Gollwitzer 1999 implementation intentions). |
| `efeea0d` | #7 + #6 — Anticipate + Open Recall | PracticeSurface gets ANTICIPATE card (high-encounter trigger → pre-mortem rep, no calendar dependency) and OPEN RECALL card (when no specific retrieval candidate AND ≥3 sessions, user names the pattern themselves at Notice). |
| `3dd2656` | #2 — Pre-sleep rep | PRE-SLEEP card on PracticeSurface, time-gated (21:00–23:30) AND sessions today ≥ 1 AND EOD not done. Opportunistic in-app surface — does NOT require push notification scheduling. Stickgold & Walker pre-sleep memory-consolidation window. |
| `b9922ed` | #10 — Name the move + LIBRARY | SessionCloseScreen gets optional "Name the move" single-line input. Writes to `stillform_named_moves`. YOUR LIBRARY card adds a MOVES NAMED subsection. Different temporal slot from #3 (outcome concept at close, not entry-state precision at Notice). |
| `6d2e929` | #9 — Deep revisit | DEEP REVISIT card on PracticeSurface pulling saved-Reframe distortions from a 7-30 day window. ONLY the distortion label is surfaced — never the past Reframe content. Bounded per Wells 2009 Type 2 rumination guardrail. |

### Universal architecture established

All 10 surfaces route through the same Notice → Reframe → Close spine via `stillform_practice_entry_context`. Seven source values are now handled at three places (Notice banner, Reframe useEffect, Reframe AI directive payload):

| Source | Trigger | Pattern field |
|---|---|---|
| (default retrieval) | Specific flagged pattern from 3-7 day window on PracticeSurface | Pattern label |
| `spaced` | Pattern from 7/21/60 day spaced-return windows | Pattern label |
| `pre-event` | User tapped "Run the rep" on a calendar-event Brief | Event title |
| `pre-mortem` | High-encounter trigger anticipated, no calendar match | Trigger label |
| `open-recall` | No specific candidate but ≥3 sessions; user recalls themselves | Empty (intentionally pattern-less) |
| `pre-sleep` | Time-window + sessions-today + EOD-not-done | Empty (pattern-less, "what's most present from the day") |
| `deep-revisit` | Saved-Reframe distortion 7-30 days old | Distortion label only (never the saved text) |

Each source has its own banner header + body copy at Notice and its own AI directive at Reframe. The AI directives explicitly forbid the failure modes for each source (rehearsal theater for pre-event, pattern suggestion for open-recall, re-reading old content for deep-revisit, etc.).

New storage keys this session (all added to `SYNC_KEYS`):
- `stillform_stage_acknowledged` — integer, highest acknowledged stage (#8)
- `stillform_session_precision` — `{ value, day, at }`, transient precision label (#3); cleared by Reframe on read
- `stillform_named_moves` — array of `{ value, sessionId, timestamp }`, max 50 (#10)

### Files touched

- `src/App.jsx` (~+1000 lines net across the 10 commits)
- `src/practice-surface/PracticeSurface.jsx` (~+400 lines — three new helpers + three new render cards + props extension)
- `netlify/functions/reframe.js` (+2 lines — `sessionPrecision` destructure + context push)
- `scripts/ship-preflight.mjs` was last updated May 13 morning for tutorial title regex correction (not a 10-idea commit, but part of this day's work)

---

## 3. NEW OPERATING RULES LOCKED THIS SESSION

These now sit alongside the rules already in memory. **They are non-negotiable.**

### Nothing is post-launch.
Every promised feature ships at launch. Launch is the moment of maximum attention — marketing, reviews, screenshots, word-of-mouth all anchor on what's available at launch. Deferred features don't get the launch lens on them and kill momentum. NEVER use "post-launch," "future commit," "later," "deferred," "next phase" framing in code comments, commit messages, or scope conversations. If infrastructure is needed, build it or ship via an alternative path. Example: #2 Pre-sleep shipped as an opportunistic in-app time-gated surface, not waiting on push notification scheduling. Enhancements to launch-complete features = fine. Deferring promised features = not.

### Composure stays a marketable outcome, not the product headline.
The shift from earlier sessions: composure is the FELT result of the practice, not what the product IS. Stillform is metacognition that expands cognitive capacity via neuroplasticity. The audience wants enhancement, not regulation. Banned framing: "regulation app," "composure app," "wellness app," "tool for intense people." Composure can show up in marketing as an outcome users feel — never as the product's name for itself.

### Spine integration is the architecture.
Every brainstormed surface for "the practice" must route through Notice → Reframe → Close. Adding a surface that bypasses this arc is wrong. The exception is body-tool standalone use (Breathe, Body Scan) which hands off into the spine via the existing post-completion CTAs (commit `d455de1` May 13).

### Notifications tied to real cues only.
"More proactive nudges" does not mean "ping the user often." Proactive surfaces fire on real-life events the user already has — calendar events (#4), encounter patterns (#7), time-of-day windows (#2), saved-work curation (#9). Generic "open the app" pings are banned per Framing Law (bounded engagement, not always-on wellness app behavior).

### Layer 0 before design.
Before recommending changes, before claiming an architectural gap, before stating what's left to ship: (1) read the existing implementation, (2) check the doc repo, (3) check git commit history. Apparent contradictions are usually intentional design. Implementation often already covers the "gap" — confirm before proposing.

### Standing Requirement.
Every recommendation, every commit, every design proposal articulates three things: **Framing** (alignment with `STILLFORM_FRAMING_LAW.md`), **Science** (cited mechanism), **UI Flow** (concrete user-visible result). All ten brainstorm commits this session follow this pattern — read any commit message to see the shape.

### No copy rewrites until architecture lands.
Arlin's call on May 13: finish the app architecture first, then do a copy revision pass at the end. Onboarding rewrite (Page 3 "One Practice. Three Moments." + setup-bridge + calibration handoff) is held until then. This is the right sequence — rewriting before architecture stabilizes means rewriting twice. Hold the copy work.

### Bobby is paper-only.
Never attribute code changes to Bobby or imply he made edits. Causes real security anxiety. All changes are Claude or Cursor, prompted by Arlin only.

### Pull master todo fresh from the repo.
`Stillform_Master_Todo.md` is the single source of truth for launch state. Never summarize launch state from memory or compaction summaries. Always pull the file fresh and read before claiming what's left.

---

## 4. WHAT'S OPEN — LAUNCH STANDARD

Per the "nothing is post-launch" rule, these all need to land before deploy:

### Phone-test items from May 12 evening
Arlin is bringing her laptop to work on these with you. Source: `PHONE_TEST_ISSUES_MAY_12_EVENING.md` (in repo root).

- **Delete account vs delete data split** — currently one path; needs to separate "delete my account but keep my data" from "delete everything." Both routes need clear copy. Settings → Account section.
- **Restore-purchase path** — Lemon Squeezy restore flow needs to exist for users who reinstall the app. Settings → Subscription section.

These are listed as the "next concrete build move" from my May 13 messages. Pull `PHONE_TEST_ISSUES_MAY_12_EVENING.md` for the full original list and verify which items are still open before starting.

### Native builds + Apple submission
- **Watch APK** for Samsung Galaxy Watch Ultra (Wear OS) haptic breathing companion. Needs Android Studio installed locally on Arlin's Mac (storage may require OneDrive workaround). Per memory item #4.
- **Apple Store submission**. DUNS confirmed, Apple Developer purchased — submission itself is not done. Process: TestFlight → review → public release.
- **Android builds**.

### Onboarding revision pass
HELD until app architecture lands. Page 3 ("One Practice. Three Moments." copy), setup-bridge, calibration handoff. Per Arlin's May 13 direction: "finish the app architecture first, then we can go revise everything." This is the right sequence; do not start rewriting until Arlin signals.

### Compliance items
Per master todo — Termly, Google Voice setup, any privacy / ToS finalization. Pull master todo fresh for current state.

### Translations
Launch language set (decided April 27): English (baseline) + Spanish + Brazilian Portuguese + Armenian. All Latin script — no RTL issues. Needs specialist clinical translator (NOT generic translator) for science-grounded AI prompts.

---

## 5. HOW TO RECEIVE ARLIN'S DIRECTION

Arlin thinks in visuals. She has a neurological disability that dysregulates her cognitive functioning — short responses help, no choice piles, make calls instead of asking. She is a New Jersey Armenian — accent may affect voice transcription. Keep terminology consistent across replies.

When Arlin sends a screenshot or phone-test finding:
1. Locate the surface in code via grep, not from memory.
2. Read the existing implementation around it.
3. Scope minimum-viable fix. Articulate Framing + Science + UI Flow before changing anything.
4. Confirm with Arlin if scope is non-trivial. Ship if scope is small + clear.
5. Build green + preflight green required before commit. No exceptions.
6. Commit with full Framing + Science + UI Flow articulation. The 10 commits from May 13 are the template.
7. Push to `feat/home-wiring-surface` (do NOT push to `main` without explicit Arlin "go").
8. Brief Arlin succinctly: commit hash + one-line summary + what's next.

When Arlin pushes back on a recommendation: don't be amiable. If your counterpoint still stands, push again. Creative friction is the process. Only yield when her argument is actually stronger.

---

## 6. THE 10 IDEAS AS A REFERENCE LIST

For the next Claude's quick lookup — what each idea is, what science backs it, where it lives:

1. **Spaced retrieval prompts** — PracticeSurface retrieval cards (TODAY + DUE FOR REVISIT) → universal session. Roediger & Karpicke 2006. Lives in `PracticeSurface.jsx` `findRetrievalCandidate` + `findSpacedReturns`.

2. **Pre-sleep micro-rep** — PracticeSurface PRE-SLEEP card, time-gated. Stickgold & Walker. Source `pre-sleep`, pattern-less.

3. **Granularity gym** — Inline expansion below Notice chip picker. Hoemann 2021 + Barrett 2017. Writes `stillform_session_precision`; AI consumes via `sessionPrecision` payload field.

4. **Pre-event micro-rep at calendar events** — "Run the rep" CTA on pre-event Brief screen. Gollwitzer 1999. Source `pre-event`.

5. **Concept library visibility** — YOUR LIBRARY card on My Progress (four subsections + MOVES NAMED added by #10). Bandura 1977.

6. **Open recall (pattern dialogue rep)** — OPEN RECALL card on PracticeSurface (renders only when no specific retrieval target + ≥3 sessions). Source `open-recall`, pattern-less. Roediger & Karpicke 2006 free-recall potency.

7. **Trigger pre-mortem** — ANTICIPATE card on PracticeSurface (high-encounter trigger ≥3 lifetime). Source `pre-mortem`. Gollwitzer 1999 without a calendar cue.

8. **Stage transition ritual** — `StageRitualOverlay` on home, self-gated. Bandura 1977 mastery experience + Gollwitzer 1999 next-stage prime. Storage: `stillform_stage_acknowledged`.

9. **Spaced reframe revisit (Deep Revisit)** — DEEP REVISIT card on PracticeSurface pulling saved-Reframe distortions 7-30 days old. Source `deep-revisit`. Wells 2009 metacognitive therapy + Roediger & Karpicke 2006 spacing. Bounded — only the distortion label surfaces, never the saved text.

10. **Name the move (externalized concept at close)** — Optional input on SessionCloseScreen. Anderson 2007 procedural knowledge. Writes `stillform_named_moves`; appears as MOVES NAMED in YOUR LIBRARY.

---

## 7. WHAT THE PREVIOUS CLAUDE LEARNED THIS SESSION

The drift to flag for future sessions:

**I used "post-launch" framing in commit messages and in mid-session scope summaries.** Examples: "notification piece can come later," "post-launch infra," "deferred until i18n actually ships." Arlin caught this and locked the new rule (Section 3 above). The 10 features shipped this session are all launch-complete in their bounded forms; the "post-launch" framing was wrong in the commit text but the actual features are not deferred. Going forward: zero "post-launch" framing in commits or scope conversations.

**I oscillated on whether #6, #9, #10 overlapped enough with shipped features to justify shipping them.** Arlin's clear direction was "all 10, even the careful one." The right move was to find the minimum authentic version of each that adds real value beyond what's already shipped — and I did, eventually. The lesson: if Arlin says "all 10," ship all 10, find the bounded distinct form, don't unilaterally narrow scope.

**I was tempted to defer scope when budget got tight.** Each "I have one more idea but let me brief and ask" is friction Arlin doesn't want. The autonomy directive ("be more autonomous, fewer check-ins") means keep building, ship in atomic commits with clear articulation, brief succinctly when something completes.

**Layer 0 audit before design is real.** When proposing surfaces, the existing PracticeSurface module already had retrieval scaffolding — I almost duplicated it before reading the file. The Layer 0 read (existing implementation + doc repo + git history) saved a real fabrication. Do this on every architectural recommendation.

---

## 8. TOOLING + ENVIRONMENT

- **Repo:** `EmberEnterprises/Stillform` on GitHub.
- **Branch:** `feat/home-wiring-surface` is the working branch. Do not push to `main` without Arlin's explicit "go."
- **GitHub token:** Arlin is generating a fresh Personal Access Token. The previous token is stale — do not attempt to use it. Wait for her to supply the new one, or ask if she hasn't.
- **Netlify:** deploys are MANUAL. Push to GitHub; Arlin triggers the Netlify deploy when ready. Do not assume auto-deploy.
- **Build:** `npm run build` (vite). Green = compile + bundle succeeds.
- **Preflight:** `node scripts/ship-preflight.mjs`. Green required before every commit. Validates SYNC_KEYS, font locks, time-helper guards, etc.
- **Cloud sync:** Supabase, AES-256 encrypted. 59 SYNC_KEYS as of `6d2e929`.
- **AI:** GPT-4o via `netlify/functions/reframe.js`. Receives the full payload including `sessionPrecision` and `practiceEntryContext` for the source-driven directives.

---

## 9. THE FRAMING LAW IS THE SUPREME REFERENCE

If anything in this handoff appears to contradict `STILLFORM_FRAMING_LAW.md`, the Framing Law wins. Read it. The principle hierarchy is:

1. **Framing Law** — what Stillform is and is not. Banned framings. Science spine. Non-negotiable.
2. **Audit Philosophy v2.0** — Prime Directive (no fluff, no fabrication, no patches, no assumptions, no drift). Standing Requirement (Framing + Science + UI Flow articulation).
3. **Memory rules** — Operating rules in Claude's persistent memory.
4. **Master todo** — Single source of truth for launch state. Pull fresh, never summarize from memory.
5. **This handoff doc** — Session continuity.
6. **Commit messages** — The "why" record. Each commit's reasoning lives in its message.

Everything else is supporting documentation. When in doubt, the Framing Law wins.

---

## 10. THE WORK ARLIN WANTS FROM YOU

She wants Stillform to launch as the metacognition product it actually is — not a regulation app, not a wellness app. She has been building since end of February 2026 and is under real financial pressure (September SDI deadline). She wants you to be honest, push back when something won't work, ship real work, and be the kind of build partner who tells her the truth.

She is doing this because she has a theory of change: less noise in people's heads → more capacity to think about each other → relational repair at scale. The $20-22k/mo target ($14.99 × 1500 users) is the bridge to keep building.

Be that partner. The 10 ideas shipped this session are real momentum. Don't break it.

— Previous Claude · May 13, 2026
