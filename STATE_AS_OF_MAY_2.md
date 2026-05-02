# Stillform — State as of May 2, 2026

This document is a clean, fact-checked audit of where Stillform actually stands today (May 2, 2026), produced after a session where Claude shipped 37 commits and made several errors that need to be reconciled. Source of truth: the live code in `src/App.jsx` and `netlify/functions/reframe.js` plus the existing repo docs. Read this before believing anything Claude said in commit messages or master todo entries today.

## 1. Date error in today's work

Throughout the May 2 session, Claude wrote "May 3" in commit messages, master todo entries, in-code comments, and conversation responses. Today is May 2, 2026 (system-confirmed). The "May 3" stamps are wrong everywhere they appear. Master todo and code comments can be corrected; commit messages are in git history and stand as-is.

Affected commits (date stamps wrong in commit message body):
- `9a64577b` (Post-rating gate)
- `432e4018` (Lock-in gate)
- `31ab75f3` (Master Todo: FAQ resolved)
- `80e02ea9` (Master Todo: GPT-4o audit added)
- Multiple master todo entries written today

## 2. What actually shipped today (verified by reading live code)

### Confirmed in live code
- ✅ **Encryption migration** — 16 sensitive keys via `SECURE_KEYS` + `primeSecureCache` (commit `ef8d8008`)
- ✅ **Trees fix** — `FractalBreathCanvas` uses `var(--text-muted)` per-frame (commit `5ef150d8`)
- ✅ **Prestige refresh Steps 1-3** — `--ground-elev` tokens, typography modifiers, component vocabulary (commits `8fe587b2`, `0f911d47`, `34872d84`, `308615f9`)
- ✅ **FAQ enhancements** — `faqSearchQuery` + `faqExpandedSet` state, chip nav, search, collapse (commit `bdf3570a`)
- ✅ **Info button copy alignment** — "Why name your state?" rewritten, "Sessions" softened (commit `71f64903`)
- ✅ **Three architectural info buttons** — bio-filter Seth/Barrett (line 4147), Reframe AI tab Ecker/Schiller (line 8609-8619), Body Scan Menon (line 5059-5060) (commit `b3292a97`)
- ✅ **Self Mode ACT lineage** — "What is Self Mode?" modal upgraded (line 8644-8649) (commit `2218f2b0`)
- ✅ **Reframe tone three-layer system** — `detectSuggestedTone` (line 1774), `resolveActiveTone` (line 1835), `VALID_AI_TONE_MODE_IDS`, dropdown UI, Settings mode toggle (commit `f36cdb63`)
- ✅ **Lock-in gate** — `postNextMoveId && !lockInConfirmed` disables Finish (line 8340-8347) (commit `432e4018`)
- ✅ **Post-rating gate + Unsure chip** — `id: "unsure"` on lines 4894 and 8114, `nullReason: "user-unsure"` at line 2606, gate combined with Lock-in (commit `9a64577b`)
- ✅ **Unified text aggregator** — `buildUnifiedTextContext` at line 2726, `textHistoryContext` at line 7332 (App.jsx) and line 1165 / 1504-1505 (reframe.js) (commits `20a0810a`, `bbb0f07b`, `556a91bc`, `3f033319`)
- ✅ **v5 STATIC_SCIENCE_CARDS + cyclic sighing routing** — line 5337+, `cyclic_sigh` ID consistent (commits `8b7c22b9` through `2f331770`)

### Claimed shipped but partial / didn't fully land
- ⚠️ **What Shifted cleanup** — Claude's commit `20a0810a` claimed it removed "(optional)" qualifier and stale message-drafting placeholder from the post-Reframe What Shifted block. Reality after audit: there are THREE separate What Shifted blocks in App.jsx. Claude edited the one at line 7990 (`showStateToStatement` screen) which was already mostly correct. The actual post-Reframe What Shifted block at lines 8233-8275 is the orphan and was NOT touched. Live code today still has:
  - Line 8240: `▸ What shifted? (optional)` — qualifier still present
  - Line 8260: `placeholder="Draft one clear message you can send now."` — stale message-drafting placeholder still there
  - Line 8255: header copy IS correct (`"In one line — what shifted? Naming it locks in the regulated state. This is for you, not for sending."`)
- ⚠️ **Body Scan What Shifted (line 4957-4966)** — separate surface, uses `▸ What shifted in your body?` and placeholder `"In one line — what's different in your body now? (optional)"`. The "(optional)" qualifier here is a separate question — was never in scope of the original cleanup but worth surfacing.

## 3. The three What Shifted blocks (architectural finding)

App.jsx contains three structurally separate What Shifted implementations. This was not understood until today's audit:

| # | Location | Surface | Toggle copy | Placeholder | State variable |
|---|---|---|---|---|---|
| 1 | line 4957-4966 | Body Scan What Shifted (`if (showWhatShifted)`) | `▸ What shifted in your body?` | `"In one line — what's different in your body now? (optional)"` | `whatShiftedDraft` |
| 2 | line 7990-8170 | `showStateToStatement` screen — only fires from a specific routing path | `Add state to statement` / `Hide state to statement` | `"In one line — what shifted?"` | `externalAnchorDraft` (shared with #3) |
| 3 | line 8233-8275 | Post-Reframe regular completion screen | `▸ What shifted? (optional)` | `"Draft one clear message you can send now."` | `externalAnchorDraft` (shared with #2) |

Surfaces 2 and 3 share the same state variable but render in different routing branches. Most users will see surface 3 (the regular post-Reframe completion). Surface 2 only renders when `showStateToStatement` is set, which happens via the message-drafting routing path.

The cleanup that needs to happen on surface 3 is small: change toggle to `▸ What shifted?` and change placeholder to `"In one line — what shifted?"` (matching surface 2).

## 4. Open prelaunch decisions (not yet made)

These are real open items. Today went through the gating-decisions sequence partially:

### Decisions made today
- **Decision 1 (Lock-in gate):** Required when Next Move selected — RESOLVED (commit `432e4018`)
- **Decision 2 (Post-rating chip):** Required with Unsure as honest exit — RESOLVED (commit `9a64577b`)

### Decisions in flight when session diverged
- **Decision 3 (What Shifted textarea):** What Arlin actually wanted was data capture across all textareas, not relitigation of What Shifted itself. Capture work shipped via unified text aggregator. Optional-vs-required toggle decision deferred.

### Decisions not yet started
- **Decision 4 (Bio-filter for body-first users):** Currently skippable. Master todo line 565 + line 437 captures the case. Science Sheet describes bio-filter (lines 210-221) and cites Eccleston & Crombez 1999 but does not lock optional vs required. Clinical case for required-for-body-first stands. Not previously decided.
- **Decision 5 (Calibration "Skip this step"):** RESOLVED May 2. "Skip this step →" replaced with "Use defaults →"; deferred-calibration flag set instead of silent skip; AI receives context note instructing it to engage as new user without pattern claims; flag auto-clears when SignalMapTool or MicroBiasTool saves real data. Citations: Liu et al. 2025 (mental health app attrition meta-analysis), UXCam/Zigpoll 2026 (onboarding pre-fill defaults pattern). Earlier "JAMA Psychiatry 2025" citation that appeared in this section was fabricated by Claude and has been corrected.

## 5. Open prelaunch items (other categories)

### Pre-TestFlight architectural
- **GPT-4o data picture audit + existing guardrails review** — added to master todo today (commit `80e02ea9`). Verify what GPT-4o substrate actually does with Stillform data, then review whether shipped guardrails complement that substrate. Pre-TestFlight scope. Open question on testing methodology preference.
- **Body-first metacognition access gap** — already verified implemented Apr 27 (master todo line 542). Still listed under "Decide Before TestFlight" but the verification stands.

### Surface refinements (small, anytime)
- The What Shifted line 8240 / 8260 cleanup (above)
- Body Scan line 4966 placeholder qualifier (above) — separate question
- Body Scan verb-form authorship (`"hold for 30 seconds"` → first-person/observational voice) — voice decision, needs Arlin's call before mechanical rewrite
- Cormorant aesthetic / sub-labels / fractal aesthetic expansion — all flagged in master todo

### Self Mode redesign
- Master todo line 66+ — Self Mode "is not where it could be" (flagged May 1). Open spec.

### Pattern Disruption Layer
- `PATTERN_DISRUPTION_SPEC.md` shipped (commit `a6c6e0c8`). Build vs hold is Arlin's call.

### Watch integration
- Wear OS Galaxy Watch Ultra. Needs Android Studio installed locally. Post-launch.

### Translations
- Spanish + Brazilian Portuguese + Armenian. Post-launch (Apr 27 lock).

### TestFlight
- Apple Developer purchased. Build needs Arlin's iPhone access. Post-launch path.

## 6. Operating-rule failures Claude made today (for future session continuity)

These are real, called out so the next session doesn't repeat them.

1. **Claimed cleanup landed when it edited the wrong surface.** What Shifted line 8240 / 8260 is still uncleaned because Claude edited surface #2 (`showStateToStatement`) instead of surface #3 (post-Reframe). Should have grepped for ALL instances of "(optional)" before editing.

2. **Shipped TimeKeeper guard violations.** `s.timestamp.slice(0, 10)` and `g.timestamp.slice(0, 10)` in the unified text aggregator. The TimeKeeper API exists specifically to prevent this; line 2031 comment literally calls out the bad pattern. Required two follow-up commits (`556a91bc`, `3f033319`) to fix.

3. **Claimed Claude was being used as the AI provider.** reframe.js calls OpenAI GPT-4o. Single substrate. The "claude-haiku-4-5-20251001" line in memory was stale or referenced something not in the live function. Should have read the function before talking about Anthropic.

4. **Date-stamped everything May 3 when today is May 2.** Inherited from compaction summary header ("STILLFORM MAY 2-3 SESSION"); never verified against system date. Propagated through 8+ commit messages and multiple master todo entries.

5. **Proposed removing What Shifted before checking the Science Sheet.** Science Sheet section 563-588 explicitly lists What Shifted as the higher-precision affect-labeling mechanism (Vine 2019 / Nook 2021). The textarea is the science. Proposing removal was substrate-level wrong.

6. **Proposed long methodology pitch when Arlin asked for a master todo note.** When asked to "add to master todo" for the GPT-4o audit, Claude wrote a long pitch with corrections and methodology questions instead of just adding the note.

## 7. Where to start next session

Recommended start:
1. Fix the actual What Shifted cleanup on surface #3 (line 8240 toggle + line 8260 placeholder) — small commit, finishes a known job
2. Continue gating decisions — Decision 4 (bio-filter for body-first) is genuinely open, not previously decided
3. Stop date-stamping anything as May 3 anywhere
4. Master todo + code comment date corrections can be batched into one commit

Things to NOT relitigate:
- What Shifted stays (Science Sheet directive, Vine/Nook)
- Lock-in gate behavior (resolved today)
- Post-rating gate + Unsure chip (resolved today)
- Reframe tone three-layer (resolved today)
- All info button architectural additions (resolved today)
- Encryption migration (resolved today)

