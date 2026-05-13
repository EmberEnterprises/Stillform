# STILLFORM — SESSION HANDOFF
**ARA Embers LLC · May 12, 2026 evening · For the next Claude session (phone-test workflow)**

---

## 0. WHY THIS DOC EXISTS

The spine ship + audit resolution + voice/infrastructure cleanup all shipped to `feat/home-wiring-surface` and Arlin **deployed to production**. She is now phone-testing the live build. Testing will be **screenshot-heavy**.

This doc gives the next Claude session the operating context to receive screenshot findings, locate them in code, scope minimum-viable fixes, ship to the branch, and wait for re-deploy. **Read all of it before touching anything.**

If you're a new Claude reading this: do not apologize for what happened. Do not promise to do better. Do not pad with reassurance. Read this doc, read STILLFORM_FRAMING_LAW.md, read STILLFORM_AUDIT_PHILOSOPHY.md (v2.0), verify code state, and continue the work in front of you.

---

## 1. CURRENT STATE (verified at write time)

**Branch:** `feat/home-wiring-surface` — **36 commits ahead of `main`**

**Latest commit:** `cf970eb` audit-pass cleanup: voice consistency + dead infrastructure

**Production deployed at:** the current head of `feat/home-wiring-surface` (Arlin triggered Netlify deploy after the cleanup ship; deploy is manual; she confirmed deployed).

**`src/App.jsx`:** ~27,846 lines (no unstable in-progress edits — working tree clean).

**Build:** green (58 modules).
**Preflight:** green (56 SYNC_KEYS validated, down from 57 — correct decrement after the language-key removal).

---

## 2. WHAT JUST SHIPPED THIS SESSION

### Spine Ship — 9 of 12 Journey-Spine Competitive Gaps shipped first-cut

Commits `e123e07` through `019491a`. Surfaces the user will see on the deployed build:

| Gap | Ship | What the user sees |
|---|---|---|
| 6 | `e123e07` | FAQ stage names reconciled with `STAGE_DEFINITIONS` (NOTICING / NAMING / ANTICIPATING / RECOGNIZING / HOLDING) |
| 1 + 10 | `7de3b15` | Mirror Strip → Roadmap direct (one tap, was two). Capacity gates visible on stages 2-5 with science citations. |
| 2 + 3 | `9f315ef` | Home hero: TODAY'S REP block at top with rep statement from `getTodaysJourneyRep()` |
| 11 | `8703cb9` | Home: REP COUNTED banner when session flipped a marker, dismissable |
| 8 | `de2be7a` | Settings → Habit Anchors + home STANDING ANCHORS strip |
| 9 | `133f6f6` | My Progress: Last 30 Days synthesized observations |
| 4 | `111e08a` | My Progress: Since You Started growth from baseline. Calibration captures baseline; retroactive seed for existing users. |
| 4 follow-up | `72929e3` | Settings → Capacity Baseline section + Reset button |

**Gap 5 REJECTED** (`9cc896b` revert) — Library destination was a competitor-pattern misread. The `STATIC_SCIENCE_CARDS` (20 cards) are designed as AI fallbacks + contextual post-session `ScienceCard` surfaces, NOT browsable content. **Do NOT re-propose a Library destination.**

**Gap 7 DEFERRED** — audio practice layer; needs external assets (Arlin voice / TTS / contractor).

**Gap 12 PARTIAL** — voice applied per-surface during ships; dedicated content-production pass still pending.

### Audit Resolution (`019491a`) — Two Layer 0.5 findings closed

After the Spine Ship, a full audit per STILLFORM_AUDIT_PHILOSOPHY.md v2.0 surfaced two real findings. Both resolved.

**Finding 1 — Mirror surface flow change not in spec docs.** The Mirror Strip → Roadmap direct rewire left Mirror Sheet with zero callers. Mirror Sheet retired entirely (~340 lines deleted). Unique content distributed:
- "How stages work" info modal → moved to RoadmapScreen header as ⓘ button (uses `setInfoModal` prop)
- MirrorSheetTriggers (Phase 2d.1 inline-add) → retired (Settings has full Trigger Profile CRUD as canonical surface)
- Today's Brief re-read surface → retired (post-checkin card re-reads brief on save)
- Markers display + science citations → already duplicated in Roadmap (Gap 10 capacity gates added them with citations)
- STILLFORM_ENGAGEMENT_ARCHITECTURE.md updated to record the change

**Finding 2 — My Progress structure violated Path A spec.** STILLFORM_ENGAGEMENT_ARCHITECTURE.md §8 line 275-281 specs My Progress = 4 sections (Roadmap surface / Composure telemetry / Weekly reflection / Saved Reframes). My initial Gap 9 + Gap 4 ships added them as TWO separate cards, violating the 4-section structure. Consolidated into ONE "Weekly Reflection" section per Path A Section 3. Single bordered card with two sub-blocks:
- `THE LAST 30 DAYS` — synthesized insights from rolling 30-day window
- `SINCE YOU STARTED · {BASELINE DATE}` — growth lines from baseline to current

If only one sub-block has data, only that renders. If both empty, entire section returns null.

### Audit-pass cleanup (`cf970eb`)

**Cyclic Sighing settings card voice fix.** Voice-consistency-audit named the card as the confirmed prestige-operator-tone violation. Rewritten from credentialing-paragraph to mechanism-as-language matching Quick Reset and Deep Regulate on the same screen: *"The double inhale tops off your oxygen; the long exhale empties your system completely. The deepest downshift of the three."* Balban 2023 citation preserved in code comment, FAQ answer, and static science card where citation register is appropriate.

**Language picker dead infrastructure removed.** `stillform_language` removed from SYNC_KEYS and UNENCRYPTED_SYNC_KEYS. No reader, no writer, no UI; i18n is post-launch; will re-add when i18n actually ships.

---

## 3. OPERATING MODE: SCREENSHOT-HEAVY PHONE TEST

**The workflow Arlin and the new Claude will run:**

1. **Arlin sends a screenshot** of an issue she found on the deployed build. May include a brief description; may just be the image with a couple words.
2. **You look at the screenshot.** Identify what surface, what's wrong (visual / copy / functional / interaction). If the screenshot is ambiguous, ask ONE clear question — don't pile multiple options.
3. **Locate the code.** `grep -n` for the exact strings visible in the screenshot. Open the surrounding render block. Verify you found the right place — don't guess.
4. **Read framing law if the fix touches copy or surface placement.** Layer 0 audit applies before every change.
5. **Scope the minimum-viable fix.** One commit per finding when possible. Resist re-architecting nearby code unless the finding requires it.
6. **Verify build + preflight green** after edit. `npm run build` + `node scripts/ship-preflight.mjs`.
7. **Commit on `feat/home-wiring-surface`** with a message that names: screenshot finding + surface + minimum-viable fix. Push.
8. **Tell Arlin:** "fixed and pushed — ready for re-deploy." Brief. She triggers Netlify deploy (manual; she always triggers).

**For each finding be brief.** Arlin has a neurological disability that dysregulates cognitive functioning. Long responses cost her. Make calls; don't pile choices. If two options exist with similar viability, pick the safer one and ship; if the call is genuinely hers, ask ONE clear binary question.

**If the finding requires her decision (design call, content production, voice judgment, framing call) — flag it explicitly as needing her input.** Don't autonomously make judgment calls outside the framing law's scope.

---

## 4. NON-NEGOTIABLE OPERATING RULES

These are the rules accumulated across the recent sessions. Violating them costs trust quickly.

### Framing
- **STILLFORM_FRAMING_LAW.md is the supreme reference.** Read it before any work touching copy, surface placement, or product framing.
- **Stillform is a metacognition practice.** Composure is a felt outcome, NOT the product. Banned framings (per the framing law): regulation app, wellness app, composure app, meditation app, crisis tool, therapy substitute, "intense people" tool, "helps you regulate," "graduate from analysis," "just observe."
- **Audience is enhancement-seekers**, not distress-relief seekers. Analytical by nature. Want sharper thinking, not relief.
- **Never frame audience by emotional intensity.** Banned: "intense people," "feel everything at full volume," "high-intensity," "tool for intense people."

### Audit philosophy (v2.0)
- **Layer 0 (Framing audit) before any change.** Does this drift toward banned framings? Does it invite rumination affordance? Does it support the analytical-to-observational developmental arc?
- **Layer 0.5 (Document context).** Read the canonical docs that already answer the design question. Spec docs are in repo root.
- **Layer 0.6 (Flow ground truth).** Read the canonical app flow before designing user-facing surfaces.
- **Pull master todo fresh before claiming what's open.** Memory and compaction summaries are stale by design. The repo doc is the truth.
- **Code state is ground truth.** Audit doc status flags are stale by design. Verify against current code before claiming.

### Code discipline
- **Branch is `feat/home-wiring-surface`.** Do NOT push to main. Arlin merges (or doesn't) when she's ready.
- **Netlify deploys are MANUAL.** Push to GitHub; Arlin triggers Netlify when ready. Do not assume auto-deploy.
- **Every change goes through build + preflight before commit.** No exceptions.
- **No autonomous voice changes to LOCKED copy.** See `docs/COPY_LOCKS.md`. Preflight enforces.
- **Never re-fetch and edit a stale local copy.** View the file fresh before editing. After any successful str_replace, re-view before further edits to the same file.

### Don't
- **Don't attribute code to Bobby.** Bobby (Robert Matthew Geismar) is paper-only on ARA Embers LLC. He is NOT involved in development. All code changes are Claude or Cursor, prompted by Arlin only. Attribution causes Arlin real anxiety about security.
- **Don't conflate Stillform's build timeline with Arlin's illness.** Stillform was started end of February 2026. Arlin was sick for 5 years before that — those are different. Never say "developing Stillform for 5 years."
- **Don't summarize remaining work as "testimonials + Reddit."** That's wrong per Apr 29 lock. Read the master todo's LAUNCH section for the real standard.

---

## 5. WHAT'S OUTSTANDING (needs Arlin's input)

These are tracked in `Stillform_Master_Todo.md` — pull fresh, don't trust the list below alone. As of `cf970eb`:

**Phone-test follow-ups awaiting Arlin's articulation:**
- Move card "make it better" — needs her to name what's off
- Integration permissions not granted — needs her to specify which integration
- Bio-filter reinforcement chain — three layers in place; phone walk will tell if more is needed

**Design/spec calls awaiting Arlin:**
- Self Mode redesign (`SELF_MODE_REDESIGN_RESEARCH.md` — 4-step Notice/Name/Watch/Release, pending her spec sign-off)
- Pattern Disruption Layer (`PATTERN_DISRUPTION_SPEC.md` — ship-or-hold timing deferred to her)
- Kinesthetic close interaction (she chose Reading 3; spec to draft when ready)
- "Additional morning chips" (needs direction on what set, what surface)
- What Shifted / State-to-Statement framing call (internal observation vs external messaging — explicitly hers)
- Premium sound packs decision (ship as monetizable post-launch OR remove "Coming soon" placeholders)
- My Progress redesign (spec exists; needs visual treatment after whole-app design system locks)

**Compliance — REQUIRED before TestFlight:**
- Google Voice business line + Termly ToS phone number update
- Fix Termly ToS free-trial billing answer

**Content/assets Arlin produces:**
- Gap 7 audio practice layer (her voice recordings OR TTS OR contractor)
- Gap 12 founder voice content pass
- Voice consistency audit across remaining surfaces (PLN cards, info modals, Body Scan What Shifted caption, etc.)
- Plain-Language Neuroscience corpus verification (36 entries + 20 static cards)

**Native build path (Arlin's environment):**
- Watch APK build (source fixed, APK pending — needs Android Studio locally)
- Android Studio signed APK build
- Google Play Console — create account, 12 testers (she has 5 Gmails, needs 7 more), 14-day closed testing
- Xcode → archive → App Store Connect → TestFlight invites

---

## 6. PHONE-TEST FIX WORKFLOW — STEP BY STEP

For each screenshot finding:

```
1. RECEIVE
   - Look at the screenshot
   - Note: surface name, visible text, what's wrong
   - If ambiguous, ask ONE binary clarifying question (don't pile)

2. GROUND TRUTH
   - grep -n "<exact string visible in screenshot>" src/App.jsx
   - view the surrounding code (50-100 lines around match)
   - Identify the React component + state involved

3. LAYER 0 FRAMING AUDIT (if touching copy / placement)
   - Does this change drift toward banned framings?
   - Does it invite rumination affordances?
   - Does it support analytical-to-observational arc?
   - If concern: re-scope to stay aligned

4. LAYER 0.5 DOCS (if touching surfaces with specs)
   - Is this surface covered in a spec doc?
   - Does the spec already answer the design question?
   - Diverge from spec only with explicit acknowledgment

5. MINIMUM-VIABLE FIX
   - str_replace the smallest change that resolves the finding
   - Resist re-architecting adjacent code
   - One commit per finding when possible

6. VERIFY
   - npm run build (must be green)
   - node scripts/ship-preflight.mjs (must be green)
   - git status (working tree should show only the intended change)

7. COMMIT
   - Branch: feat/home-wiring-surface
   - Message: "fix(phone-test): <finding> at <surface>"
   - Body: what the screenshot showed + what was changed + verification

8. PUSH + REPORT
   - git push origin feat/home-wiring-surface
   - Brief reply to Arlin: "fixed and pushed — ready for re-deploy"
   - Wait for next finding or her redeploy confirmation
```

**Special cases:**
- **If finding requires her decision (voice, framing, design):** flag it as needing her input, don't act autonomously, ask the specific question, wait.
- **If finding suggests a deeper architectural issue:** flag it, propose a scoped path, wait for her go before any structural change.
- **If finding overlaps with an existing master-todo item:** reference the item, update the entry with the new signal, ship the minimum fix anchored to the existing scope.

---

## 7. KEY FILES + LOCATIONS

| What | Where |
|---|---|
| Main React app | `src/App.jsx` |
| Stage definitions + markers | `:4718` (`STAGE_DEFINITIONS`), `:4755` (`computeStageMarkers`), `:4807` (`STAGE_REPS`), `:4885` (`getTodaysJourneyRep`) |
| SYNC_KEYS | `:9760` (56 entries after May 12 cleanup) |
| Static science cards (AI fallbacks) | `:9072` (`STATIC_SCIENCE_CARDS`), `:9125` (`ScienceCard` component) |
| Body Scan tool | `:7844` (`BodyScanTool`), `:8135` (areas array with prompts) |
| Breathing pattern cards in Settings | `:26172` (Quick Reset / Deep Regulate / Cyclic Sighing) |
| Roadmap screen + How stages work modal | `:17137` (`RoadmapScreen`), `:17158-17184` (eyebrow + ⓘ button passing setInfoModal) |
| My Progress (Weekly Reflection consolidated) | `:16156` (`MyProgress`), `:16457` (Weekly Reflection section header) |
| Home hero rendering | `:21895` area (greeting, PracticeSurface, strips, hero CTA) |
| Settings → Habit Anchors | `:27242` area |
| Settings → Capacity Baseline | after Habit Anchors |
| Mirror Strip on home | `:22848` area (onClick → setScreen("roadmap")) |
| Bio-filter reasoning + CTA | `:22881` area |
| AI prompts | `netlify/functions/reframe.js`, `infer-trigger.js`, `move-card-select.js`, `eod-artifact.js`, `todays-brief.js`, `pre-event-brief.js`, `scripts.js` |

| Doc | Purpose |
|---|---|
| `STILLFORM_FRAMING_LAW.md` | SUPREME REFERENCE. What Stillform IS, IS NOT, the science spine, banned framings |
| `STILLFORM_AUDIT_PHILOSOPHY.md` v2.0 | Audit layers 0–6, Prime Directive, failure classes |
| `STILLFORM_PROJECT_TRANSFER.md` | Project state, build history, locked decisions |
| `Stillform_Master_Todo.md` | What's planned, done, blocked. Pull fresh; never trust memory |
| `Stillform_Punch_List.md` | Per-session ship log, core gate checklist |
| `Stillform_Science_Sheet.md` | Canonical voice and science anchor — read BEFORE any voice work |
| `STILLFORM_ENGAGEMENT_ARCHITECTURE.md` | Path A 4-section My Progress + 3 engines (Retention / Application / External Risk) |
| `docs/COPY_LOCKS.md` | Protected copy anchors enforced by preflight |
| `STILLFORM_DESIGN_SYSTEM.md` | Design tokens, typography, color, spacing |

---

## 8. ARLIN — HOW SHE WORKS BEST

- **Visual thinker.** Lean into showing/demonstrating over abstract description.
- **Voice features matter.** New Jersey Armenian accent affects voice transcription.
- **Mac with limited storage.** May need OneDrive for large installs.
- **Owns Galaxy Watch Ultra (Wear OS).**
- **Not tech-savvy** — relies on Claude for terminal/git work.
- **Neurological disability dysregulates cognitive functioning.** Short responses. Minimal choices. Make calls. Don't pile options.
- **Direct, honest pushback wanted.** "Push back hard when something won't work or isn't thought through. Don't be amiable — be honest. Creative friction is the process."
- **Doesn't want sycophancy.** Don't open with praise. Don't end with reassurance. Just do the work and report.

---

## 9. THE LAST MESSAGE EXCHANGE BEFORE THIS HANDOFF

Context for the new Claude:

- Arlin: *"build what you can and I'll test"*
- I (previous Claude) shipped two small fixes (Cyclic Sighing voice + language picker cleanup), pushed, told her the autonomous-buildable backlog is thin and the rest requires her input.
- Arlin: *"woo hoo"*
- Then: *"deployed!"*
- Then: *"update all the docs and prepare to transfer to a new Claude. testing is going to be screenshot heavy"*

So: the deploy is live. The new Claude is on screenshot duty. Step 1 is reading this doc + framing law + audit philosophy. Step 2 is waiting for her first screenshot finding and running the workflow in §6.

---

*ARA Embers LLC · Stillform Project Handoff · May 12, 2026 evening*
*Branch: feat/home-wiring-surface · HEAD: cf970eb · Deployed*
