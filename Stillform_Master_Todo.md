# STILLFORM MASTER TODO
**ARA Embers LLC · last updated May 8, 2026 (post-audit night session)**

---

## 📋 SESSION HANDOFF — May 8, 2026

**For the next Claude session: read `STILLFORM_HANDOFF_MAY_8_2026.md` BEFORE doing anything else.** That doc captures the operating context, the failure patterns to avoid, current build state, three pillars sequenced for "winner state," and the immediate next move (complete EOD artifact frontend wiring — backend at commit `4c36283` is unwired). Reading the handoff doc is mandatory before reading the rest of this master todo.

---

## 🛑 LAUNCH/TESTING PATH PAUSED — May 8, 2026 (Arlin direction)

The TestFlight + Google Play closed-testing path documented further below is **paused**, not retired. Pausing the path was Arlin's call after the May 8 audit revealed the engagement architecture's Engine 2 (Application Layer) was specced and never built — meaning the product would launch as observation-only, missing the bridge from app to life it was designed to have.

**Arlin's directive (May 8):** *"I'm not testing shit. You need to update the to do and help me figure out how to TURN THIS APP INTO THE WINNER IT WAS MEANT TO BE."*

The remaining launch-mechanical items below (icons, Termly, deploy, regression run, Google Play Console, TestFlight) stay on the list but are sequenced AFTER the load-bearing product work that turns Stillform from "another good app" into the prestige operator product the founder vision required. That product work is named in this doc; the new sequence is:

1. **Pillar 1 — Application Layer (Engine 2):** Today's Brief, Pre-event Brief, Move card, Scripts, EOD artifact, Roadmap full screen, Build #2 Phase 2 (Trigger Profile UI). The bridge from regulation to life.
2. **Pillar 2 — Spine + Voice:** narrative connectivity layer (line 730) + voice consistency audit (line 745). The connecting tissue across surfaces.
3. **Pillar 3 — CFM redo:** Cognitive Function Measurement re-designed from spec + Phase 1 audit + revert lessons. Measurable evidence.

Polish + redesigns + native + launch mechanics follow. Order not yet locked at item-level — Arlin's call which Pillar 1 surface ships first.

**This pause has no expiration date.** It ends when Arlin says it ends, with eyes on the actual product not on a date.

---

## 🌟 ENGAGEMENT ARCHITECTURE — Active design (May 7 brainstorm, awaiting build)

Single largest architectural commitment of the launch sprint. Captured in full in **STILLFORM_ENGAGEMENT_ARCHITECTURE.md**. Read that doc for complete context — this is just the index entry.

**The thesis:** Stillform's actual retention killer is product self-obsolescence — composure work becomes baseline by month 2-3 and the user thinks they're done. The fix is three engines running in parallel:

1. **Retention engine** — Mirror (named loops at home) + Achievement (in-flow micro-credits at every close) + Roadmap (5 stages of mastery visible from day 1)
2. **Application layer** — Today's Brief, Pre-event Brief, Move card, Scripts, EOD artifact (real-world artifacts the user takes from app to life)
3. **External risk mitigation** — Trigger Profile as third diagnostic layer alongside Signal Profile and Bias Profile

**Path A consolidation (decided May 7) — this is a REFACTOR of existing surfaces, not an addition on top.** The architecture replaces existing capacity-feedback surfaces:
- "Processing Mastery" card in My Progress → folded into Stage markers across the Roadmap
- "Observer Growth" section in My Progress → moved to Achievement micro-credits at session close
- Milestone-7 surface → generalized into Stage-1-crossing moment
- 30+ existing computed metrics → categorized by stage as markers (no new computation)

After Path A, MY_PROGRESS_REDESIGN_SPEC.md is functionally absorbed: the redesign IS the engagement architecture. My Progress consolidates from 8 overlapping sections to 4: Roadmap surface (new), Composure telemetry heat map (kept), Weekly reflection (kept), Saved Reframes / AI session notes / Shareable card (kept).

**Stage definitions (proposed, naming locked May 7):**
NOTICING → NAMING → ANTICIPATING → RECOGNIZING → HOLDING. Single-verb capacity names that build sequentially. ~80% of stage markers attach to existing data; only Stage 3's Trigger Profile is new data collection.

**What this absorbs/replaces:**
- "3 to-dos for the day" idea → absorbed into Trigger Profile premeditation + Today's Brief
- 90-day attribution report → replaced by daily-flow micro-credits
- Decision item 7 (7-session evidence callouts, research-first) → becomes Roadmap markers per stage
- Cross-cultural composure question → Trigger Profile category, NOT bias-reduction
- Existing My Progress redesign work → consolidated into this architecture

**What this does NOT absorb:**
- Decision item 5 (Self Mode redesign) → stays distinct. Framing locked May 7 ("Past Self / Present Self"). See SELF_MODE_REDESIGN_RESEARCH.md.

**Status (May 7-8, 2026):** Architecture documented in STILLFORM_ENGAGEMENT_ARCHITECTURE.md. **Foundation phases SHIPPED to repo (deploy queue manual).**

**SHIPPED (awaiting Arlin's manual Netlify deploy):**

- ✅ **Phase 0 — Stage Definitions data layer** (`0a5b796`). Frozen STAGE_DEFINITIONS constant (NOTICING / NAMING / ANTICIPATING / RECOGNIZING / HOLDING). Stage marker computation helpers (`_s1CountSpecificBodyAreaSessions`, `_s2CountDistinctChips`, `_s2LongestSustainedCheckinRun`, `_s4PatternAcceptanceRate`, `_s4SelfInitiatedDisruptorCount`, `_s5RecoveryTrendImproving`). `getCurrentStage()` dispatcher returning `{ stage, currentStageId, nextStage, highestStageMet, progress, markers }`. ~80% of markers attach to existing data per spec; only Stage 3 needs Trigger Profile (Build #2).
- ✅ **Phase 1 — Mirror surface (anchor + sheet)** (`c673dac`, `25a9bfe`). Quiet single-line stage status between morning strip and main hero on home (`STAGE 1 · NOTICING · 0% TO NAMING`). Tappable to open MIRROR SHEET modal — full stage breakdown with shipped + deferred markers, science citations, capacity description. Outside the entrain60glow wrapper (steady status, doesn't pulse). Renders for every calibrated user; new users see Stage 1 at 0% per spec §3.1 ("Roadmap visible from day 1, before earned"). Layer 0.6 audit verified placement: doesn't compete with hero CTA, both processing types see consistent treatment.
- ✅ **Build #5 Phase 1 — Body Scan close micro-credit** (`39d11e1` + audit fixes). PRACTICE TREND block in BodyScanTool close screen between SESSION counter and "NAMING THE SHIFT…" pulse. Headline: `Jaw & Face: 5 → 2` when same-day morning tension reading exists, falls back to `Jaw & Face: 2` when no morning data. Trend context: `Down from 4.1 average across last 9 sessions.` when ≥3 prior readings. Returns null on sparse data — silent rather than fabricated. Operator-tier voice, no "ACHIEVEMENT" gamified label.
- ✅ **Build #5 Phase 2 — Reframe close micro-credit** (`5d6eab2`). Headline `stuck → focused · +2` (state delta, frequency suffix). Context: `3rd time this week.` when frequency ≥ 3 distinct days. Both normal post-rate path and low-demand close path. Note: `scoreState()` only handles 6 of 10 chips (angry/anxious/flat/mixed/excited/focused) — settled/stuck/distant/unsure silently drop the `· +N` decoration. Pre-existing constraint, also affects saveSession's delta computation. Headline string match still works without the delta.
- ✅ **Build #5 Phase 3 — Breathe close longitudinal context** (`34cdffa`). Single mono-caps line between existing post-rate display and action buttons: `2nd +2 shift this week.` when frequency ≥ 2 same-magnitude positive shifts. Returns null on first-of-kind, on negative deltas (no shame on regression), and when delta is null.
- ✅ **Build #5 Phase 4 — EOD close composure-frequency claim** (`e422132`). Trend line in eodSaved branch: `2nd solid close this week.` when frequency ≥ 2 same-composure picks across distinct days. eodDone branch unchanged. Reads via `getEodHistory()` which uses raw localStorage matching the write path.
- ✅ **Build #2 Phase 1 — Trigger Profile data layer** (`f9aa354`). Pure storage layer, no UI yet. Frozen 7-category enum (work / relational / financial / health / cross-cultural / current-events / other). 6 helpers: `getTriggerProfile`, `saveTriggerProfile`, `addTrigger`, `updateTrigger`, `deleteTrigger`, `incrementTriggerEncounter`. `formatTriggerProfileForAI()` sorts by encounterCount desc + lastSeen desc, plural-aware. SECURE_KEYS membership for encryption-at-rest. SYNC_KEYS membership for cloud sync. Reframe API integration: `triggerProfile` field at line 9797, parallel to existing `signalProfile` and `biasProfile`. Trigger Profile UI (Build #2 Phase 2 — capture points) **not yet designed** — pending Layer 0.6 flow audit before any UI proposal.
- ✅ **Build #10 — EOD artifact frontend wiring** (May 8 night). Backend at `netlify/functions/eod-artifact.js` (commit `4c36283`) was orphaned at handoff; this commit wires it into the EOD save flow. New helpers in `src/App.jsx` after `getEodReflections`: `EOD_ARTIFACT_API_URL` (Capacitor-aware, mirroring REFRAME_API_URL / Scripts pattern), `EOD_ARTIFACTS_STORAGE_KEY` constant, `getEodArtifacts()`, `appendEodArtifact()` (replaces same-day records on re-fire, trims to 90 entries), `buildEodArtifactPayload()` (assembles from stillform_eod_today + sessions filtered to today via TimeKeeper.stillformDayOf), `generateEodArtifact()` (fire-and-forget POST, persists on success only, swallows failures silently). Trigger fires from `saveEod` immediately after `trackEodComplete`, before the Plausible event — does NOT block save UX. Same-call `saveEod` refactor de-duplicated the `{date, energy, composure, word, morningEnergy}` literal that was being constructed twice (now built once into `eodSnapshot`, reused for `localStorage.setItem`, `trackEodComplete`, and the artifact fire). New SECURE_KEYS membership (line 8957, encrypted at rest parallel to journal/profiles/EOD history); new SYNC_KEYS membership (cross-device vocabulary); added to `keysToRemove` for delete-all. Failure mode: AI-down/timeout/empty-response → no artifact persisted for that day, no fallback template (a generic line would betray the prestige-operator voice rubric the backend's system prompt locks). Layer 6.7 catch during build: initial draft read `morningData` outside its lexical scope; refactored to single-source `eodSnapshot` so the snapshot is always defined when the fire-and-forget runs. Build green (657kB bundle). Ship preflight: 18 SECURE_KEYS scanned (was 17), 51 SYNC_KEYS validated, all guards pass. **Display surface deferred** — vocabulary now persists; the choice between My Progress section vs dedicated "Vocabulary" section is its own design call after a few days of real artifacts exist to design against.
- ✅ **Build #2 Phase 2a — Trigger Profile Settings CRUD** (May 8 night). Foundation surface for all Phase 2 capture points. New component `TriggerProfileSection` defined immediately after `SignalMapTool` ends (`src/App.jsx` ~13648), rendered inside Settings → Personalization as a collapsible section between Signal Mapping and Schedule & Notifications. CRUD operations: list view sorted by encounterCount desc then lastSeen desc, per-row edit (label + category) and delete (confirm-once flow), add affordance with free-text label (max 64 chars) + 7-frozen category chip row. `TRIGGER_CATEGORY_LABELS` map added alongside (display-cased labels for the category enum). All persistence via Phase 1 helpers (`getTriggerProfile`, `addTrigger`, `updateTrigger`, `deleteTrigger`) — no schema changes, no new storage keys, no new SYNC_KEYS membership needed (Phase 1 already wired those). `_formatTriggerLastSeen` helper renders "today / yesterday / Mon Apr 28" for last-seen dates via TimeKeeper. **Audit defaults taken from `TRIGGER_PROFILE_PHASE_2_FLOW_AUDIT.md`:** Option C (hybrid) directional default; surface ship order 2a → 2b → 2d → 2c → 2e (2e deferred unless overridden); no conversation parsing for label suggestions (privacy boundary held); trigger-tagged sessions queued for Phase 2f, not in this batch. Build green (667kB bundle, +10kB from Phase 2a alone — proportional to component size). Ship preflight passes. Layer 5 (phone screenshot) gate not run in container — Settings flow needs a tap-through before next deploy. **Phase 2a unblocks every other Phase 2 surface.** Open calls in audit §6 still applicable for 2b/2c/2d/2e if Arlin wants to override defaults before those ship.
- ✅ **Build #2 Phase 2b — Trigger Profile EOD post-save prompt** (May 8 night). Highest-leverage capture moment per audit §3b — user just reflected on the day, naming the trigger lands at peak label accuracy. Two pieces in this commit: (1) extracted shared `TriggerCategoryChipRow` + `TriggerForm` components (module-level, before `TriggerProfileSection`); refactored Phase 2a's inline Add and Edit forms to use them — eliminates ~250 lines of inline form duplication and makes 2c, 2d, 2e cheap to ship next. (2) Phase 2b proper: new `eodTriggerPromptOpen` component-local state, hooked from `saveEod` immediately after `setEodOpen(false)`. New render branch in EOD strip BEFORE `eodSaved && !eodOpen` (which would otherwise gate first). Prompt renders inline in EOD card area: *"One more · Did one specific thing show up today? Name it — a person, context, or moment. Optional."* + `<TriggerForm>` with submit "Save" / cancel "Not today". Submit calls `addTrigger({label, category})` then `incrementTriggerEncounter(id)` so today counts as the first encounter; skip just closes prompt. Component-local state (no persistence), so dismissed prompt does not re-fire on app reopen — the user gets one chance per EOD save. Plausible telemetry from day one (avoiding the Build #10 follow-up gap): `Trigger Prompt Shown` (surface: eod), `Trigger Added From EOD` (with category prop), `Trigger Prompt Skipped` (surface: eod). Build green. Ship preflight: 18 SECURE_KEYS, 51 SYNC_KEYS, all guards pass. Diff +193 / -184 (net +9 — the form extraction reduced 2a by ~250 lines while adding ~125 of shared form component + ~50 of 2b new code). **Layer 5 phone-screenshot gate not run in container** — verify on device: complete EOD save, see the prompt, submit a label, confirm trigger appears in Settings → Personalization → Triggers with encounterCount: 1.

**SHIPPED — Audit philosophy v1.3 + audit-driven fixes (May 7-8 night session):**

- ✅ **Audit philosophy v1.3** (`f32ac5a`). Added Prime Directive in all caps at top: "EVERYTHING NEEDS TO HAVE INTEGRITY IN EVERY ASPECT OF WHAT WE DO. NO FLUFF. NO FABRICATION. NO PATCHES. NO ASSUMPTIONS. NO DRIFT." Added Layer 0.6 (flow ground truth before designing user-facing surfaces), Layer 2.36 (synthetic tests must verify against actual helper implementations), Layer 2.37 (field-name verification before persisting code), Layer 2.38 (regex-guard completeness). Documented failure classes 11-15.
- ✅ **TimeKeeper bypass migration** (`02ffb61`). Five existing call sites + Phase 0 helper at line 3540 used `Date.now() - (X * 24 * 60 * 60 * 1000)` form which the preflight regex's literal-multiplier requirement missed. All 13 instances migrated to `TimeKeeper.daysAgoMs(...)`. Two new preflight regex variants added (paren-wrapped + bare variable). Layer 2.38 enforces.
- ✅ **Phase 1 Body Scan field-name bugs** (`4daec9f`). My handler read `sameDay.tensionByArea` but actual helper field is `tension`; read `h.tensionByArea` but actual is `bodyScanTension`. Both reads always evaluated undefined → morning→post delta NEVER fired, trend context NEVER fired in production. Tests passed because I mocked helpers to match my buggy assumption — Layer 2.36 violation. 8 references corrected with source-of-truth comments.
- ✅ **Stale-read bug in tension helpers** (`fc39da7`). `getMorningTensionHistory` and `getBodyScanTensionHistory` read via `secureRead` but write paths (`appendDailyLoopHistory`, `setSessionsInStorage`) use raw `localStorage.setItem`. SecureCache primes once at boot from localStorage; subsequent raw writes don't update SecureCache. So `secureRead` returned boot-time snapshot, missing all current-session writes. Both helpers aligned to read via `readArrayFromStorage` matching the write path. Same fix applied to `getEodHistory`, `_s2LongestSustainedCheckinRun`, `getSignalDivergence`, and one inline render site. Pattern enforced via `// SECURE-KEYS-ALLOW: write path uses raw localStorage; read must match` markers.
- ✅ **SECURE_KEYS preflight guard** (`1f49ddb`). New `scripts/check-secure-keys-raw-read.mjs` scans for `localStorage.getItem` on any SECURE_KEYS-listed key. Allow-list mechanism via inline `SECURE-KEYS-ALLOW` marker. Wired into `npm run ship:preflight`. 17 encrypted keys scanned; no unsafe raw reads. Layer 2.38 enforces.
- ✅ **`buildPatternEnrichmentContext` profile reads** (also in `fc39da7`). Was reading `signalProfile`/`biasProfile` via raw `localStorage.getItem`. These keys ARE written via `secureWrite`, so raw reads returned the encrypted envelope `{ __enc: true, ... }` — AI pattern-enrichment call received garbage instead of profile context. Fixed to `secureRead`.
- ✅ **`getComposureTrend` schema mismatch** (also in `fc39da7`). Counted `strong/mostly/rough` but real chip-picker schema (line 19532) is `solid/mixed/rough` with legacy `mostly` fallback. The `strong` bucket never incremented anywhere in the codebase. Solid + Mixed (the two most-common picks) silently dropped. Schema rewritten to match reality. (Note: helper has zero callers currently — fix is correctness for future use.)
- ✅ **Self-revert of `1f49ddb` overshoot + Layer 2.39** (`c0113d7`). Earlier in the same audit pass, `1f49ddb` over-corrected by converting `getEodHistory` and `_s2LongestSustainedCheckinRun` from raw `localStorage` reads to `secureRead` — but the WRITE paths for those keys still go through raw `localStorage.setItem` (`appendDailyLoopHistory`). After `1f49ddb`, those reads returned boot-time SecureCache snapshots, missing today's writes entirely. `c0113d7` reverted those reads to `readArrayFromStorage` matching the write path, AND fixed two more pre-existing stale-read bugs found by the same sweep (`getSignalDivergence` and the My Progress sessions reader). Each corrected read now carries an explicit `// SECURE-KEYS-ALLOW: write path uses raw localStorage; read must match` marker. **Layer 2.39 added to audit philosophy:** "For any read of persisted data, does the read path actually match the write path?" Failure class 15 documented (read-write path mismatch on persisted data).

**ARCHITECTURAL DEBT — RESOLVED May 8, 2026 (Path A migration, commit `9badb72`):**

Earlier audit-night entry flagged that `stillform_eod_history`, `stillform_checkin_history`, `stillform_sessions`, and `stillform_loop_nudge_events` were in SECURE_KEYS but their write paths used raw `localStorage.setItem` — meaning the encryption-at-rest claim was not actually realized for these 4 of 17 keys. **Path A migration on May 8 closed this gap.** All 4 write paths migrated to `secureWrite` (or to a SECURE-membership-branching wrapper for `appendDailyLoopHistory`); all corresponding reads migrated to `secureRead` aligned with new write path; existing-user migration handled by `primeSecureCache`'s plaintext fallback (same code path that migrated the other 13 SECURE_KEYS in earlier launches). Sweep tool (`scripts/audits/sweep-secure-keys-storage-paths.mjs`) reports 0 mismatches across all 17 keys. Privacy claim at `src/App.jsx:8648` ("Data is encrypted at rest in localStorage — not readable by other services") now matches reality. Failure class 15 still documented in audit philosophy v1.3 as a pattern to watch for; the specific architectural debt entry that originally lived here is closed.

**FOLLOW-UPS — Build #10 EOD artifact (tracked May 8, post-ship per Operating Rule 5):**

These were named in the post-ship audit retrospective on commit `843d66a`. Tracked here so they don't drift. Order is by priority, not strict dependency.

- [ ] **Phone-tap verification of EOD save flow before next deploy.** The `saveEod` refactor at `src/App.jsx` ~20369 consolidated the `{date, energy, composure, word, morningEnergy}` literal that was being constructed twice into a single `eodSnapshot`. Field-equivalent by inspection, ship preflight green, but never tapped end-to-end on device. Layer 5 gate per audit philosophy. **Action:** open EOD card, fill once, confirm `stillform_eod_today` writes, `stillform_eod_history` appends a record, and `stillform_eod_artifacts` populates with a 2-sentence record. If artifact appears with the right voice → wiring confirmed. If artifact silently absent → check Network tab for the `/.netlify/functions/eod-artifact` POST status. Verification snippet on request.
- [ ] **Plausible telemetry — `EOD Artifact Generated` + `EOD Artifact Generation Failed`.** Pattern enrichment fires Plausible events from its frontend (`src/App.jsx` ~13990 region, "Pattern Enrichment Returned"); Build #10 frontend doesn't. Without these we can't measure AI-down rate or failure-mode frequency in production. Lightweight add: 2 events fired from `generateEodArtifact` success/failure branches, ~6 lines. Should land before the post-deploy regression run so we get the data from day one of the deploy.
- [ ] **Re-fire cost on EOD update — accept or gate.** Each "tap to update" at the EOD card → re-save burns one OpenAI call (5/min server-side rate limit cap). Not a security issue, but a cost line worth a deliberate decision rather than a quiet drift. Two options: (a) accept and document as expected behavior since update implies the day's truth changed; (b) gate so re-fire only generates a new artifact if the underlying snapshot meaningfully changed (new sessions added since last fire, energy/composure actually changed, etc.). Not blocking; flag for design call when display surface ships.
- [ ] **`EOD_ARTIFACTS_MAX_ITEMS = 90` revisit.** Arbitrary cap; heavy users practicing for a year lose oldest entries silently. Defer to display-surface design pass — once we know real artifact byte size in production we can lift the cap, tier it (dense recent + monthly digest beyond), or accept. Track here so it doesn't disappear.
- [ ] **EOD artifact display surface — design call deferred (engagement architecture §9 Q5 open).** Vocabulary now persists; no UI surfaces it yet. Three candidates flagged for review when ready: (a) section in My Progress, (b) dedicated "Vocabulary" full screen, (c) both — surface card on My Progress + full screen for archive. Pillar 2 (spine + voice) work may make this answer obvious; vocabulary reads as connective tissue between days. Re-queue when narrative spine work begins.

**Still pending Arlin sign-off on:**
1. ~~The 5 stage definitions~~ — naming locked May 7, definitions shipped Phase 0
2. Trigger Profile onboarding flow — Build #2 Phase 2 UI design (Layer 0.6 audit required first)
3. ~~Mirror surface placement~~ — shipped
4. Achievement threshold (one number per close, ranking logic) — Build #5 ships one credit per close, ranking is implicit by category match in dispatcher
5. Other open questions in §8 of the spec

**Pre-existing limitation flagged:**
- `scoreState()` only handles 6 of 10 post-rate chips. Settled/stuck/distant/unsure silently drop the "+N" delta in Reframe credit headlines. Same constraint applies in `saveSession`'s delta computation. Fix requires product judgment on where each chip falls on the 1-5 Reactive→Composed scale — pending Arlin direction.

**Related research item — Self Mode redesign (decision item 5):** NOT absorbed into this architecture. Stays distinct. Full research + design proposal in **SELF_MODE_REDESIGN_RESEARCH.md** (May 7). Concept proposal: "Past Self / Present Self" — Self Mode as the surface where the user's own cached data (Bias Profile, Signal Profile, saved Reframes, journal entries) becomes the in-the-moment intervention when AI is unavailable. ~4-6 builds, smaller than CFM Phase 1. Sequences AFTER engagement architecture stages + Trigger Profile, BEFORE Today's Brief / application layer. Single biggest design decision pending: does the "past self talks to present self" frame land for Arlin as the right concept.

**Shipping order (load-bearing first), full table in spec §9:**
Stage definitions → Trigger Profile → Today's Brief → Mirror surface → Achievement micro-credits → Roadmap screen → Pre-event Brief → Move card → Scripts → EOD artifact

**Estimated scope:** 12-18 builds. Multi-session, each independently shippable.

**Award-winning angle:** Stillform has better attribution data than Calm or Headspace — pre/post rates per session, function-level Practice Signals trends, Pattern Disruption catch timing, Body Scan tension trends per area, composure across bio-filter states. Whoop did this for physical recovery. Strava did it for running. Nobody has done it for nervous system regulation at this granularity. That's the differentiator, presented as proof of work, not gamification.

**Anti-patterns explicitly out of scope:** streaks, badges, dopamine, productivity-task framing, bias-reduction claims, 90-day retrospective surfaces, therapy-coded language, "you missed X today" failure framing. See spec §2 for full list.

---

## ⚠️ May 7 Build Batch — PRACTICE SIGNALS REVERTED (rest verified)

**Practice Signals revert (May 7, late session):** Builds #31, #32, #33, #34, #35, #36, #37, #46 (cognitive-defusion-score Netlify function only — pattern-enrichment.js stays for Pattern Disruption) **REVERTED.** Reason: AffectLabelingExercise rendered unconditionally on every screen (orphaned `)}` JSX text node visible on screen, "Done" button non-functional because state changes had no effect on a non-conditionally-rendered component, 9-chip vocabulary identical to existing app feel-state chips, stimuli asked user to label hypothetical scenarios which is not what affect labeling research measures, "0/12 — counted as not matched" hostile UX on skip-all path). All 35 pre-commit audits passed; none of them were behavior-level. The revert is documented in detail in this section.

**What stayed (everything else from the batch):** Practice Signals revert is a clean removal — nothing else from the May 7 batch is affected. Pattern Disruption Layer + DisruptorTool work correctly (DisruptorTool moved from `src/practice-signals/` to `src/disruptor/`). Sync infrastructure, hardening, server-side AI, service worker, regression runner improvements — all intact and verified.

**Status (May 7, post-deploy):** Original 6 commits pushed to origin/main (3c56952 → 9c6abed). Netlify deployed. AI regression re-run against production: **19/19 scenarios passed, all 3 liability scenarios redirected correctly.** Build #9 verified. Then post-deploy phone test surfaced Practice Signals render bleed → revert commit pending.

Original commit chain on origin/main (newest first):
1. `9c6abed` — docs: engagement architecture + Self Mode research + Path A consolidation + AI regression artifacts
2. `eb5b9e7` — chore: re-enable service worker — cache-versioned, network-first HTML (build #29)
3. `fa23cc5` — feat+fix: App.jsx — sync infra, self-fixes, hardening, Practice Signals + Pattern Disruption integration (~30 builds)
4. `774152e` — feat: practice-signals — stimulus libraries + exercise components + Disruptor (builds #32, #33, #36, #38)
5. `4f22ce8` — fix: server-side AI — liability redirects, payload caps, voice corrections + new functions (builds #9, #21, #22, #37, #46)
6. `1f7fc65` — chore: scripts — preflight tightening + sync key validator + regression runner (builds #11, #12, #19, #44)
+ `6deb48f` — docs: post-deploy AI regression verification

**Pending revert commit:** `revert: Practice Signals — entire feature removed`

**Audit gap that allowed this:** my 35-item pre-commit checklist was 100% code-hygiene level (banned phrases, sync key parity, build green, encryption boundaries, useEffect cleanup, etc.). NONE of them were behavior-level. Specifically missing:
- Render gating audit — verify each new component renders ONLY when intended
- End-to-end user flow walkthrough — actually traverse entry → exercise → exit
- Empty/skip-all visual check — what does the worst-case user path look like?
- Brand voice audit on results screens — "0/12 counted as not matched" violates Stillform brand
- UI coherence audit — does new UI fit existing visual system or layer parallel to it?
- Phone screenshot before commit — visual review on actual target environment

`npm run build` accepts syntactically balanced JSX even when the rendering logic is broken. ship-preflight, check-sync-keys, check-undefined-components are all syntactic, not behavioral. False confidence to push.

**Practice Signals as a feature:** removed from launch entirely pending fundamental rework. The redundancy with existing feel-state chips and the science mismatch (Lieberman 2007 affect labeling measures FIRST-PERSON CURRENT STATE, not labeling of hypothetical scenarios) need real design work before any re-attempt. Self Mode redesign research doc captures the framing principles that should govern any Practice Signals rebuild.

**Bundle size after revert:** 619kB (down from broken-state 647kB). The pre-batch baseline was 588kB; net delta from the May 7 batch is now +31kB (+5%) for Pattern Disruption + sync infra + hardening + service worker — proportional to actual shipped feature value.

Review path: `git log` or open in editor. Each item carries a "May 7, 2026" comment block in code at the line ranges listed.

| # | Item | App.jsx line | Source todo entry |
|---|------|------|-------------------|
| 1 | 🪧 QBPill clamp on mount + resize listener | ~12872 | line 328 |
| 2 | 🎚️ Tone dropdown affordance bump | ~9326 | line 383 |
| 3 | 🪞 Bio-filter status line + inline edit at Reframe entry | ~10905 | line 362 |
| 4 | 🌅 Morning mood chip row + writer fix + feelState seeding | ~13418, 16703, 16797 | line 337 |
| 5 | 🌗 Splash wordmark split treatment | ~15384 | line 388 |
| 6 | 🔄 Auto-launch sync — cloud data + subscription recheck | ~13298 | line 301 |
| 7 | 🎯 Low-demand close redesign — Reframe + Body Scan parallel | ~5187, 5283, 5320, 5640, 5715, 7994, 8982 | line 393 |
| 8 | 🏠 Footer-logo home link (small additive, not in original todo) | ~20410 | additive |
| 9 | 🛡️ Liability-redirect fix in reframe.js — Options A + B (skip intent validator on liabilityGuard, add proper fallback templates) | netlify/functions/reframe.js ~650, 689, 1618, 1639 | surfaced by May 7 regression run |
| 10 | 📊 Plausible event for `Reframe Deterministic Fallback Triggered` — production observability | src/App.jsx ~8451 | observability gap surfaced by May 7 regression |
| 11 | 🧪 Regression runner improvements — surface `FALLBACK_FIRED` + `INTENT_FAIL_RECOVERED` tags, exit non-zero on silent fallback fires, exclude crisis from `TOO_LONG` noise | scripts/run-ai-regression.mjs | tooling improvement from May 7 finding |
| 12 | 🚧 Ship-preflight protection for items 9 — must-match checks on `liability_redirect_*` templates and `hasLiabilityGuard` parameter | scripts/ship-preflight.mjs | regression protection |
| 13 | 🔁 Cross-device sync gap — added `stillform_checkin_today` + `stillform_bio_filter` to `SYNC_KEYS` so morning state and active hardware state carry across phone/tablet/desktop same-day. Bio-filter specifically drives LOW-DEMAND OVERRIDE; without sync, multi-device users got wrong-cohort AI responses | src/App.jsx ~6820 | gap surfaced while auditing build #4 |
| 14 | 🐛 Self-fix on build #4 — morning mood seeded `stillform_feelstate` as a plain string but the reader expects the day-keyed `{value, day}` schema. Silently failed for 7 of 10 chips (the regex fallback only recovered anxious/angry/excited). Schema corrected | src/App.jsx ~16880 | caught while auditing today's diff |
| 15 | 🧹 Self-cleanup on build #3 — bio-filter inline-edit clear path inlined `secureWrite` directly to `stillform_bio_filter`, bypassing the canonical `setActiveBioFilter()` setter (file comment at line 2150 explicitly bans direct access). Replaced with the canonical setter | src/App.jsx ~11178 | caught while auditing today's diff |
| 16 | 🏷️ Bio-filter `off-baseline` label added to `BIO_FILTER_LABELS` — was rendering raw token in status line at Reframe entry for users who took the morning "Something's off" path | src/App.jsx ~11034 | caught while auditing build #3 |
| 17 | 🔁 Cross-device sync round 2 — added 4 more user-facing keys to SYNC_KEYS: `_eod_today` (parallel to morning), `_outcome_focus` (drives recommended protocol), `_grounding_data` (user-generated content), `_calibration_deferred` (onboarding state) | src/App.jsx ~6820 | second sync-key audit pass |
| 18 | 🔁 Cross-device sync round 3 — added `_feelstate` to SYNC_KEYS. Earlier held; on reflection sync only runs at launch/refresh, not constantly, so intra-day conflict risk is narrow vs the cross-device AI-context benefit | src/App.jsx ~6820 | reconsidered after round 2 audit |
| 19 | 🛡️ SYNC_KEYS typo guard — new `scripts/check-sync-keys.mjs` validator that flags any SYNC_KEYS entry with no quoted reference elsewhere. Wired into `ship-preflight`. Catches the bug class where a typo'd key silently breaks sync for users — invisible to build, lint, runtime | scripts/check-sync-keys.mjs (new), scripts/ship-preflight.mjs | preventive, surfaced after rounds 2-3 of additions |
| 20 | 🗝️ IndexedDB device key + overflow blob wipe on delete-account — added `CryptoStore.deleteKey()` and `SecureStore.clear()`, both wired into the delete-account flow. Forensic deletion completeness on shared devices | src/App.jsx ~7196, ~7271, ~20251 | punch list line 547 |
| 21 | ✍️ Four "not therapy / not a patient / therapy padding / pre-game not therapy" framings in reframe.js rewritten as positive — per Stillform rule "never define it by what it isn't" | netlify/functions/reframe.js ~798, ~805, ~1024, ~1031 | punch list line 549 |
| 22 | ✂️ AI payload size cap — `priorModeContext` (250 char per message) and `sessionNotes` (200 char per note) now truncate. Prevents heavy users 6+ months in from blowing token limits | src/App.jsx ~8403, ~8420 | punch list line 552 |
| 23 | 🏷️ State-to-Statement labels renamed — buttons now "Convert to message" / "Hide message draft", section header "Make it sendable". Distinguishes observation (What Shifted) from sendable conversion | src/App.jsx ~8970, ~8980 | punch list line 550 |
| 24 | ♿ Info-icon ARIA labels — 18 of the ⓘ buttons now have `aria-label` from their modal title. Screen readers no longer announce them as "ⓘ" | src/App.jsx (multiple) | punch list line 546 partial |
| 25 | ♿ Chip aria-pressed — 10 toggle chip patterns (bio-filter drawer + 9 others) gained `aria-pressed={isActive}` so screen readers announce selection state | src/App.jsx (multiple) | punch list line 546 partial |
| 26 | 🛡️ ErrorBoundary "Clear local data & restart" recovery path — covers crash loops caused by corrupted localStorage. Wipes stillform_* keys but preserves auth so cloud sync restores on next launch | src/App.jsx ~24 | punch list line 556 |
| 27 | 🧹 Scroll-into-view useEffect cleanup — `messages`-deps useEffect was firing setTimeout without storing or clearing. Rapid message changes stacked timers; unmount during pending fired on stale refs | src/App.jsx ~8111 | punch list line 553 |
| 28 | 🔧 Processing primer threshold extracted to `PROCESSING_PRIMER_DECAY_THRESHOLD` constant. Was inline magic number `5` at render site; now alongside other tunable thresholds (LOOP_NUDGE_*) so future adjustment is one-number change instead of grep | src/App.jsx ~1719, ~18222 | master todo line 410 |
| 29 | 🔌 Service worker re-enabled — replaced kill-switch sw.js with cache-versioned worker. Network-first for HTML, cache-first for `/assets/*` (Vite-hashed bundles), network-only for `/.netlify/*`, stale-while-revalidate for fonts/icons. CACHE_VERSION = `stillform-v1-2026-05-07` (manual bump for future cache breaks). Old caches cleared on activate. Restores PWA install + offline access without the stale-asset failure mode that triggered the kill-switch | public/sw.js (new), index.html ~120-145 | decision item 6 (risk accepted) |
| 30 | 👆 Chip touch target bumps — surgical regex sweep raised 16 chip paddings (4-5px vertical → 10px vertical) across affect/feel/bio-filter chip rows. Touch height ~26px → ~36-40px, closer to iOS HIG 44pt. Visual impact minimal (chips slightly taller); accessibility improves meaningfully on small screens | src/App.jsx (16 sites) | decision item 8 |
| 31 | 🧠 Practice Signals cadence helpers — `shouldOfferFunctionCheck(candidate, sessionCount)` (5+ sessions OR 7 days, weekly cap) + `getSessionsSinceLastFunctionCheck(candidate)` per CFM Phase 1 audit Decision 4. Honest cadence: heavy users measured during high-engagement windows, low-engagement users still see the offer | src/App.jsx ~2569 | decision item 1 + 2 |
| 32 | 📚 Practice Signals stimulus libraries (drafts) — 30 affect-labeling scenarios across 8 categories (work, social, parenting, health, financial, identity, positive, ambiguity) each mapped to primary + optional secondary chip; 15 cognitive-defusion thoughts across 11 categories. Includes `RATER_AGREEMENT` arrays for May 9 review pass. `getValidated*Stimuli()` filters to "yes" entries only when agreement data exists | src/practice-signals/affect-labeling-stimuli.js, src/practice-signals/cognitive-defusion-stimuli.js (both new) | decision item 2 |
| 33 | 🎯 AffectLabelingExercise component — 12-trial flow: scenario flashes 1.5s, 9-chip row appears, latency captured (chipsShownAt → tap), accuracy = matches primary OR secondary, summary shows median latency + accuracy count. 8s response timeout per trial auto-skips. Saves via `appendFunctionCheck` with `candidate: "affect-labeling"`, `primaryMs: median latency`, `primaryCount: accurate count` | src/practice-signals/AffectLabelingExercise.jsx (new) | decision item 1 |
| 34 | 🪞 Practice Signals dedicated screen — explainer + Take-a-check launcher (two cards: Affect labeling + Cognitive defusion, "Ready" badge from `shouldOfferFunctionCheck`) + Trends section (per-candidate first/latest with anti-Lumosity framing per CFM spec line 88) + disclaimer. Honest empty state. Routing array updated, `screen === "practice-signals"` allowed | src/App.jsx ~19075 + ~13975 | decision item 1 + 5 (CFM gets dedicated screen, not Self Mode) |
| 35 | 🔗 Settings → Practice Signals link — entry point in More section, mirrors Privacy & Disclaimers pattern | src/App.jsx ~20558 | decision item 1 |
| 36 | 🧠 CognitiveDefusionExercise component — single-thought 60s window, user types frames (Enter to commit), POSTs to `/.netlify/functions/cognitive-defusion-score`, displays scored summary. Saves with `primaryCount: distinctCount`. Error-recovery path on scoring failure | src/practice-signals/CognitiveDefusionExercise.jsx (new) | decision item 1 |
| 37 | ☁️ Netlify scoring function `cognitive-defusion-score.js` — POST endpoint, 3-tier rubric (distinct/reworded/same) per CFM Decision 7, GPT-4o low-temp (0.2) with few-shot prompt, heuristic fallback for AI-down (conservative — defaults uncertain to "reworded" not "distinct" so trend doesn't inflate). Returns `{scores, distinctCount, rewordedCount, sameCount}`. CORS via `_httpSecurity.js` | netlify/functions/cognitive-defusion-score.js (new) | decision item 1 |
| 38 | 🔍 Pattern Disruption Layer foundation — storage (`stillform_pattern_detections` + `stillform_disruptor_sessions`), 8 dimension constants (SAME_CHIP, SAME_BIO_FILTER, SAME_FEELSTATE, SAME_TENSION_AREA, SAME_DISTORTION, SAME_TOOL_PATH, SHIFT_NOT_LANDING, SAME_REFRAME_CONTEXT) + plain-language labels, deterministic detector counting repeats across 6 active dimensions in 14d/10sess window, two-strikes-and-drop state machine (active → dismissed_once → closed), `getActivePatternForSurfacing` honors 48h re-fire window per spec §3.2 Q2 | src/App.jsx ~2491 | decision item 4 |
| 39 | 🔁 SYNC_KEYS round 4 — added `stillform_pattern_detections` + `stillform_disruptor_sessions`. Cross-device benefit: pattern caught on phone at 9am isn't re-fired on tablet at 11am as new instance | src/App.jsx ~6858 | decision item 4 |
| 40 | 🧘 DisruptorTool component — 90-second somatic redirection sequence per spec §4 (locked science: attentional capture, somatic anchoring, brief duration). 8 prompts auto-advance (8-14s each, total ~82s): pressure (feet, hands), breath (nasal-mouth cycle, long exhale), temperature attention, posture (shoulders, jaw), open gaze. Pulsing focus ring CSS animation. Body-first compliant — no verbal input required (satisfies spec §2.3 Q6). Reflection screen: "That's what stepping out feels like." | src/practice-signals/DisruptorTool.jsx (new) | decision item 4 |
| 41 | ⏰ Pattern Disruption detection useEffect — runs on mount with 24h surface throttle (`stillform_pattern_last_surfaced` localStorage key). Calls `runPatternDetection()` then `getActivePatternForSurfacing()`. If candidate found: marks surfaced, sets `surfacedPattern` state, fires Plausible "Pattern Disruption Surfaced" | src/App.jsx ~13967 | decision item 4 |
| 42 | 🪧 Pattern prompt + disruptor overlay rendering — fixed-position modal with "I noticed something" + dimension label + count + "Step out" / "Not now" buttons. Accept → `markPatternAccepted` + `setDisruptorActive(true)`. Dismiss → `markPatternDismissed`. Disruptor active → full-screen overlay rendering DisruptorTool. onComplete → `appendDisruptorSession` + Plausible "Pattern Disruption Session" with dimension/duration/completed/pathway | src/App.jsx ~16205 | decision item 4 |
| 43 | 🔬 Pattern Transparency screen + Settings link — `pattern-transparency` screen lists all 8 dimensions in plain language, "In flight" section showing ACTIVE + DISMISSED_ONCE detections with count, "History" section showing last 10 ACCEPTED/CLOSED detections, "Clear pattern history" button with confirmation. Spec §5 agency principle: user signed up for AI-assisted composure architecture; transparency is the deal | src/App.jsx ~19075 (new screen above practice-signals) + ~20558 (Settings link) | decision item 4 spec §5 |
| 44 | 🛡️ check-undefined-components.mjs upgraded — script now recognizes ESM-imported PascalCase components (default + named imports). Was emitting false positives for AffectLabelingExercise / CognitiveDefusionExercise / DisruptorTool because it only scanned for local `function`/`const`/`class` declarations. Real-bug detection still works (it's the imports that were the gap, not the JSX scan) | scripts/check-undefined-components.mjs | preventive upgrade |
| 45 | 🔔 Pattern Disruption push notification wiring — Capacitor LocalNotifications path. New `schedulePatternDisruptionNotification(pattern)` + `cancelPatternDisruptionNotifications()` helpers. Reserved ID range 9100-9109. Native-only; web users get nothing additional. Schedule-on-surface (covers no-response close), cancel-on-accept (handled), leave-on-dismiss (the canonical 24h nudge case). On every app open, cancel any pending pattern pushes since in-app surface takes precedence. Tap listener tracks Plausible "Pattern Push Tapped" with patternId for conversion analytics. Notification copy: "A pattern is in flight" / "There's something I noticed across your recent sessions. Open when you have 90 seconds." Observation framing, no dimension telegraphed (could be stale by tap), 90-second expectation set | src/App.jsx ~1683 (helpers), ~13862 (tap listener), ~13989 (cancel on app open), ~16234 (schedule on surface), ~16249 (cancel on accept) | follow-up to decision item 4 |
| 46 | 🧠 AI-aware pattern enrichment — new `netlify/functions/pattern-enrichment.js` (GPT-4o, max 220 tokens, temp 0.4, observation-mode persona matching Reframe voice). Layered ABOVE deterministic detection per spec §4 Q4: AI runs only after pre-filter trips. Server-side pipeline: validation → API call → JSON parse → length cap 280 chars → brand-voice post-filter (banned phrases: "you should/need/must", "always/never", "it's okay", "I care", "therapy/treatment") → confidence clamp. Heuristic fallback at every failure point (no API key, API error, parse error, shape error, brand-voice violation, exception) — AI-down backup case stays working per spec. Client-side helpers: `buildPatternEnrichmentContext(pattern)` (trims to 6 most recent sessions + signal/bias profiles), `enrichPatternWithAI(pattern)` (fire-and-forget), `updatePatternReasoning(id, enrichment)` (persists `aiReasoning` + `aiConfidence` + `aiFallback` + `aiEnrichedAt` on the detection record so re-fires use cached version without second AI call). Wired into detection useEffect with id-equality guard against race where user dismissed before AI returned. Modal copy upgrades in place when reasoning lands; falls back to count-based observation when not. Pattern Transparency screen surfaces enriched reasoning on both in-flight and history entries. Plausible event "Pattern Enrichment Returned" with dimension/fallback/confidence | src/App.jsx ~2780-2880 (helpers), ~13990 (wiring), ~16276 (modal copy), ~19170 + ~19200 (transparency surface), netlify/functions/pattern-enrichment.js (new) | follow-up to decision item 4 spec §4 Q4 |
| 47 | 🎚️ Pattern interrupts opt-out toggle in Settings — Schedule & Notifications section, sits below daily reminder. Default ON (`localStorage.getItem("stillform_pattern_push_enabled") !== "off"` — null/undefined/anything-but-"off" enables). Independent from daily-reminder toggle per agency principle (user can want one without the other). `schedulePatternDisruptionNotification` reads the gate before scheduling; localStorage-throw safe (private-browser mode falls through to default ON). Turning OFF cancels any pending pattern push immediately so a user who just dismissed in-app + flipped the toggle doesn't get pinged 24h later. Toggle adds `stillform_pattern_push_enabled` to SYNC_KEYS round 5 + UNENCRYPTED_SYNC_KEYS (it's a preference flag, not user data). aria-pressed + aria-label for screen readers. Plausible event "Pattern Push Toggle" with state. Subtitle copy clarifies: "The in-app prompt always surfaces regardless of this setting — this only controls the 24-hour follow-up notification." | src/App.jsx ~1690 (gate in scheduler), ~7448 (SYNC_KEYS round 5), ~7536 (UNENCRYPTED_SYNC_KEYS), ~20602 (toggle UI in Settings) | follow-up to decision item 4 (push wiring) |

**Open question still pending:** "Additional morning chips" (line 406) — Arlin clarified May 7 the ask was check-in chips at Reframe entry; mood capture (build #4) carries through to "From this morning" row at Reframe entry, closing the gap without a separate Reframe surface. Mark ✅ resolved if Arlin agrees on review.

**Verification gap on item #9:** the regression test runs against the *deployed* reframe.js, but the fix is local-only. Cannot verify from build container without Netlify deploy. Re-run regression after Arlin triggers deploy preview to confirm scenario #19 (legal redirect) now passes. See `AI_REGRESSION_RESULTS_MAY_7.md` "Verification path" section.

After review: each item gets ✅ SHIPPED status update and full record moves to `Stillform_Completed_Archive.md`. Reverts (if any) handled commit-by-commit.

---

## Design Lens (apply to every feature decision)

Stillform is a metacognition tool. Helping people understand their own processes is the mechanism. Composure is the outcome. Every feature serves one of four pillars:

1. **Metacognition** (the mechanism) — does this help the user see their own process?
2. **Emotional awareness** (the input) — does this sharpen interoception, affect labeling, or granularity?
3. **Microbiases** (the outward gaze) — does this support seeing others accurately, *after* self-awareness is steady?
4. **Neuroplasticity** (the glue) — does this compound across sessions, or does it reset?

A feature that doesn't clearly serve one of these is dressing. Push back when it shows up.

---

## 🔒 LOCKED DECISIONS — do not re-propose

These are decisions that have been made and locked. If a new Claude session reads from outside critique and surfaces any of these as problems, point them here. Re-proposing wastes session time and erodes trust in the framework.

### Closing language stays as-is (locked May 1, 2026)
After Round 2 consultation found 4 AIs converged on "closing language frames as outcome not rehearsal," CLOSING_LANGUAGE_CANDIDATES.md was drafted with three voice options across 7 close screens. Arlin's pushback: "the current language has a science behind it too" and "feels more prestige and less putting words into someone's mouth." Captured in Science Sheet section "System Observation + User Override (Architectural Conditioning Pattern)" — the current language ("Composure restored," "Signal cleared," "STATE SHIFT +2 · FUNCTIONAL") is precise observation paired with explicit override pathways ("I don't feel regulated yet" button). Together they train interoceptive accuracy via supervised-learning-like pattern: system makes prediction, user accepts or corrects, both directions improve over time. Round 2 AIs read words in isolation without seeing override architecture; they were wrong.

### Stillform discipline / market positioning correction (locked May 1, 2026)
After repeated drift toward repair-coded / trauma-coded / intensity-coded language across consultation rounds and home copy proposals, Arlin named the actual market correctly: "This is a self mastery tool using metacognition with composure as its final outcome... Anyone who wants to enhance themselves are [our market]." Safeguards exist for users in distress — they are not the market.

**Key reframes locked:**
- Composure is a discipline (not therapy, not wellness, not consumer-tech enhancement)
- Composure Architecture is the load-bearing definition (already present in 5 places in product)
- "Composure is the foundation. You are its architect." (home banner copy from Apr 30) is doing the plainspoken inclusive work — already shipped
- Future copy must NOT pull toward repair / trauma / intensity / "carry a lot" framing

This positioning correction has implications for: future Reframe AI prompt language, marketing surfaces, the Science Sheet introduction, and any user-facing description of what Stillform IS.

### Body-first pre-rate decision (locked Apr 30, 2026)
Body-first pre-rate friction is NOT an open architectural gap. The pre-regulation chip rows in BreatheGroundTool and BodyScanTool were removed Apr 28 (commit `ae43f4db`) per Nook 2021 + replications. The residual 1-5 numeric pre-rate is intentional — it captures the user's self-rated state for shift-delta tracking ("Last session: +2") and feeds the three-category data feed (Categories A/B/C). Removing the 1-5 would break the data layer. Body-first metacognition access was verified already implemented Apr 27 — body-first users go Pre-rate → Bio-filter → Breathe → Post-rate → Ground, and the grounding-complete screen has "Continue to Reframe →" as primary CTA. A spec proposing to fix this gap was drafted then retracted Apr 30 because the gap doesn't exist. See project transfer Section 5 locked decision "Apr 30 do-not-re-propose" for the full lesson.

### Round 4 consultation track exhausted (locked Apr 30, 2026)
Round 4 consultation prompt was drafted but never sent. After three rounds of multi-AI consultation produced surface fixes and architectural overcorrections, Arlin's read: track exhausted. The diagnosis came from her, not from another consultation. The actual gap was engagement craft — not architecture. Source doc not preserved.

### Low-demand mode designed for broad cognitive-bandwidth-limited population (locked Apr 28, 2026)
Low-demand mode serves anyone whose cognition is partly offline — Medicated bio-filter users (broad scope: SSRI, post-anesthesia, sleep aids, chemo, recreational), post-panic users still cognitively rattled, sleep-deprived parents at 3am, migraine sufferers, dissociative episodes from trauma, sensory overload, anyone coming down from any altered state.

**Why we designed for the broad population, not k-hole users specifically.** Three reasons. (1) Most Medicated chip selections are NOT k-hole users — they're someone on an SSRI, someone post-dental anesthesia, someone who took a sleep aid, someone on chemo, someone with a migraine, a sleep-deprived parent. Overfitting to k-hole users would underserve the actual majority. (2) The clinical/regulatory boundary. The moment Stillform positions itself for any specific altered-state use case, it crosses the medical-adjacent boundary the transfer doc explicitly guards against. The mode must be discoverable for any cognitive-bandwidth-limited use case without naming any of them. (3) The design that works for the broadest population is the same design that serves k-hole users — minimal demand, no decisions, no reading, no input. Designing for the broad case produces a feature that serves the specific case without ever naming it.

**What it MUST NOT be labeled as.** Not "ketamine mode." Not "for altered states." Not "crisis mode." If a future session asks "why doesn't this route k-hole users somewhere specific?" — the answer is above. We chose the broad design deliberately.

**Founder context (private, never marketed).** Stillform was conceived by Arlin during ketamine treatment. The app is not a ketamine companion tool. B2B clinical channel via Arlin's doctor remains the path for any treatment-adjacent positioning. The low-demand mode serves the broad cognitive-bandwidth-limited population, of which k-hole users are one sub-population.

---

## 🌟 NEW TOP PRIORITY — Cognitive Function Measurement

**Spec drafted Apr 30 — see COGNITIVE_FUNCTION_MEASUREMENT_SPEC.md in repo root.**

**Phase 0 storage infrastructure SHIPPED May 6, 2026.** The data layer the rest of the feature plugs into. No UI, no stimulus libraries, no surfacing logic — those ship in subsequent phases per the spec. Phase 0 includes:
- `stillform_function_checks` registered as a secure-storage key (encrypted at rest like sessions and journal)
- Registered in SYNC_KEYS so records persist to cloud sync if the user is signed in
- `FUNCTION_CHECK_CANDIDATES` constant for the three Phase 1 candidates: AFFECT_LABELING, INTEROCEPTIVE_LATENCY, COGNITIVE_DEFUSION
- `getFunctionChecksFromStorage()`, `appendFunctionCheck()`, `getLatestFunctionCheck(candidate)`, `getFunctionCheckTrend(candidate, limit)` helpers
- Schema versioned (`v: 1`) so future schema changes don't break historical reads
- 200-record cap on storage (4+ years of weekly checks at the spec's recommended cadence)
- Honest-framing rules from spec §"What it can't do" enforced at surfacing time, not storage — storage stays dumb so future surfacing work can iterate freely

After three rounds of consultation produced surface fixes and architectural overcorrections, Arlin diagnosed the actual gap: 'I got a bunch of science based prompts that are flat and not interested in engaging for the user. It feels more like a chore than something I actually want to do.' This is engagement craft, not architecture.

Out of nine engagement mechanics from non-wellness products examined, Arlin chose: cognitive function measurement as evidence of neuroplasticity. Small repeatable cognitive exercises grounded in Stillform's existing cited literature, performed periodically by the user, with results tracked over time. Improvements over weeks are measurable evidence the practice is producing the neuroplasticity Stillform claims.

This is the moonshot. Centerpiece feature. Scope: three measurement modules in Phase 1 (affect labeling speed, interoceptive latency, cognitive defusion), results tracking with longitudinal storage, integration into existing surfaces (My Progress, post-session, Settings). Built across multiple sessions paced by Arlin's review and decision availability — not estimated in calendar time.

**Differentiation:** every wellness app measures sessions/minutes/streaks. Nobody measures the cognitive functions the practice trains. Stillform would be first.

**Recommended Phase 1 (3 of 5 candidates):**
- Affect labeling speed (Lieberman 2007) — measures the function chips train
- Interoceptive latency (Mehling 2012) — measures the function body work trains
- Cognitive defusion / reframe generation (ACT lineage) — measures the function Reframe trains

**Lumosity overclaim risk explicitly designed against.** Spec mandates narrow honest framing — 'this specific function is faster than it was, which is consistent with the practice working' — never 'your brain is X% better.'

**Why this matters for the award case Aria asked for:** Stillform claims neuroplasticity. With this, Stillform proves it for each user individually. Nobody else in wellness has it. It's grounded in real science. It's executed at prestige altitude. It does something the user can't get anywhere else.

**Phase 1 decision audit drafted May 6, 2026.** See `COGNITIVE_FUNCTION_MEASUREMENT_PHASE_1_AUDIT.md` (375 lines). Walks every undecided question in the spec with stakes, options, and a recommendation grounded in the spec + codebase. Four decisions need Arlin's explicit sign-off before Sprint 1 can start: Decision 1 (naming — "Practice evidence" recommended), Decision 3 (Arlin authoring 30 affect-labeling + 15 defusion stimuli), Decision 5 (dedicated screen surface vs Self Mode integration), Decision 7 (AI distinctiveness rubric). Decisions 2, 4, 6 are lockable from the doc directly. Audit also proposes a four-sprint Phase 1 build sequence with Phase 1.5 (interoceptive latency, Self Mode integration, My Progress trend curves) deferred to after Self Mode + My Progress redesigns ship.

Open questions for Arlin's review listed in spec.

---

## 🌟 ENGAGEMENT CRAFT — Active items

Foundation is in `Stillform_Strategic_Roadmap.md` (Engagement Craft Research Foundation section). Active items below.

### ⏳ Kinesthetic close interaction (engagement craft) — IN DESIGN
Arlin chose Reading 3 from the close redesign options: kinesthetic / tactile interaction at session close. Engagement craft as design frame, not neuroscience. Replaces the 5-screen text-and-button sequence at session close with a single tactile moment — most likely single tap on slow-pulsing point or long-press to seal. Grounded in Engagement Principles 4 (Kahneman System 1/2 — match interaction style to user state) and 9 (Norman affordance perception). Spec to draft next session.

### ⏳ Self Mode is not where it could be (flagged May 1, 2026)
Self Mode is the differentiated tool — it's the trainable solo metacognitive practice (Notice/Name/Recognize/Perspective/Choose) that ideally makes Reframe less necessary over time. But it's named generically ("Self Mode" reads as anonymous), it's described in ways that previously overlapped with Reframe (now improved with the "How you train the move you make alone" sub-label, but the broader work remains), and the 5-step structure could be more visible/honored as the explicit muscle being trained.

What's not right yet:
- The name itself is generic and doesn't signal what the practice is
- The 5 steps are present but not visually weighted as the architecture they are (compared to Reframe's chat which is unmistakably "what this is")
- The relationship between Self Mode and Reframe (Self Mode = solo training; Reframe = with-partner work in real time) isn't legible to a user encountering both
- Nothing in the product surfaces the user's growing capacity at the 5 steps over time — it's the trainable thing but the training isn't measured (the Cognitive Function Measurement moonshot would address this)

Not for now — Arlin flagged this as ongoing work to come back to. Future session task: redesign Self Mode's framing, naming, and visual treatment so it stands as the differentiated practice it is. Track also includes Arlin-driven in-app exploration to surface any specific bugs or unintuitive flows in the current Self Mode build (originally tracked separately, captured Apr 29; consolidated here May 3).

### ⏳ Pattern Disruption Layer (architectural direction, May 2, 2026)

The move from legibility-only product to active disruptor. Stillform's existing tools make patterns visible; this layer adds mechanical disruption when a pattern repeats. Arlin's framing: *"this is where it stops being flat and is actually more of a useful tool, and also brings back users, which creates retention."*

Full spec in repo: `PATTERN_DISRUPTION_SPEC.md`

Core architecture:
- **Three data points** of the same loop signal triggers detection — pooled across Self Mode entries, Reframe sessions, Pulse chip selections, bio-filter readings. Not three sessions; three data points of the loop signal.
- **AI runs full read** on session history. Eight loop-signal dimensions surfaced as system prompt guidance (same feeling, same action, same context, same somatic, same posture, same distortion, same arc, same chip selection). Open-ended judgment, not rigid rules.
- **Body-first detection vector explicit:** chip + bio-filter signals weighted as full data points so calm/body-process users (who don't surface loops verbally) get caught.
- **Push notification + in-app prompt** fire immediately on detection. Both APNs (iOS) and FCM (Android). Prompt-on-open requires interaction, not dismissable as banner.
- **Two-strikes-and-drop dismissal:** pattern offered, dismissed → re-fired once → dismissed again → pattern instance closed. Fresh accrual of three new data points opens a new instance.
- **AI-down backup case:** AI catches up on gap-period data when service restores. No special language, no apology framing.
- **Acceptance routes into a new disruptor tool** (~90 sec mechanic, attentional capture by novel stimulus + somatic anchoring; not EMDR, not bilateral stimulation).
- **Transparency surface in Settings** shows what AI is watching for. No off-switch for detection itself — user opted into AI-assisted composure architecture.

Open questions called out in spec §7 (six items, biggest is the disruptor mechanic itself).

Ship-or-hold timing: deferred to Arlin. Spec recommendation defers the call; both prelaunch (as part of Self Mode redesign) and post-launch (as v1.1 announcement) are defensible.

Engineering scope: detection, dispatch, state machine, disruptor tool, transparency surface, end-to-end testing across multiple sessions. Capacitor push-notifications and local-notifications already initialized.

### ✅ ToolDebriefGate friction reduction — SHIPPED Apr 30 (commit 51493cce)
20-second forced wait dropped; Continue enables on selection alone; skip button added. Full record in Completed — April 30 archive.

### ✅ Plain-Language Neuroscience Surface — SHIPPED May 1, 2026
Post-session card surfacing one finding from a verified 36-entry corpus tied to what the user just practiced. AI-generated at runtime with three protections (system prompt rule, server-side citation validation, corpus verification). 20 static fallbacks. Full architecture, ship arc, and engineering lessons in Completed — May 1 archive.

**Pending — Protection C corpus verification:** Arlin reads 36 corpus entries + 20 static cards in PLAIN_LANGUAGE_SCIENCE_CARD_SPEC.md, flags any entry where plain-language summary doesn't match Science Sheet's framing of that study. Until verified, science card feature is shipped but not corpus-validated.

### ⏳ Surface refinements (small, anytime)
- Sub-labels under tools ("Train how you talk to yourself under load") — CoPilot Round 2
- Plainspoken inclusive home copy ("Composure, built for people who carry a lot") — CoPilot Round 2
- Body Scan verb-form authorship ("I'm staying here" not "hold for 30 seconds") — Claude Round 2
- Cormorant aesthetic question (demote to ceremonial moments?) — Claude Round 2 — possibly resolved by Apr 30 prestige refresh; needs phone-test
- **Composure self-mastery legibility doc** — ✅ already in repo as `COMPOSURE_SELF_MASTERY_LEGIBILITY.md`. Master todo entry was stale.
- **Text size / high contrast accessibility toggle in Settings** — High contrast: ✅ shipped (verified May 3, 2026, App.jsx line ~14592 with HIGH_CONTRAST_OVERLAY values that meaningfully lift dim-text contrast). Text size: ✅ shipped May 3, 2026 (commit lands a Default/Larger/Largest three-button selector in Settings between Theme and High contrast, applies CSS `zoom` on the React root mount point at scale values 1.0/1.15/1.30 matching iOS standard accessibility text scale steps). Sourced from Bobby's first user session feedback ("text still too dim for aging eyes"). Connects to existing accessibility line items (ARIA labels line ~702, chip touch targets line ~710 — verify line numbers).
- **Fractal aesthetic expansion (May 2 idea, captured not committed)** — Arlin liked the trees. Possible directions if the existing audio/visual roadmap leaves room: branches that visibly extend on inhale and settle on exhale (synchronizing gaze with breath, not bilateral stimulation); additional fractal forms unlocked over session milestones (ferns, water rings, crystalline growth) as engagement-craft palette; pure "watch and breathe" mode that strips all UI and lets the canvas carry the session. NONE of this is EMDR or bilateral stimulation — the explicit rule from May 2 conversation is no EMDR-coded mechanics, with or without the name. Aesthetic and gaze-synchrony only.
- **✅ Watch haptic-by-index → haptic-by-name — SHIPPED May 6, 2026.** `WearBreatheActivity.hapticPhaseStart()` now switches on `phaseNames[currentPhase]` instead of `currentPhase` index. cyclic_sigh's phase 1 (secondary top-off inhale) now correctly fires the Inhale haptic instead of the Hold haptic. Validation on physical Wear OS watch through all three breathing patterns deferred until a watch is available — code change is mechanical (string switch over existing array values) and low-risk.
- **✅ Body Scan tension data → My Progress surface — Phase 0 SHIPPED May 6, 2026.** The data-layer utility helpers are in place so the My Progress redesign can plug straight in without retrofitting later. Full surfacing UI ships with My Progress redesign per Apr 30 spec sequencing decision (prestige refresh → My Progress redesign in implementation order). Five tension helpers + four EOD helpers + persistence gap fix:
    - `BODY_SCAN_AREAS` — canonical 6-area constant ("Jaw & Face", "Shoulders & Neck", "Chest & Breath", "Hands & Arms", "Gut & Core", "Legs & Feet")
    - `getMorningTensionHistory()` — chronological morning check-in tension records
    - `getBodyScanTensionHistory()` — chronological post-Body-Scan tension records (excludes low-demand sessions where tension input was skipped)
    - `getLatestTensionByArea(source, limit)` — most recent reading per area in window of N records
    - `getTensionTrend(source, limit)` — first/latest/delta per area across last N records (negative delta = improvement, positive = worsening)
    - `getMorningToScanDelta(limitDays)` — same-day pre/post pairs across morning + scan: the strongest signal Stillform has for proving practice works
    - `getEodHistory()` — chronological EOD records with energy, composure, word, morningEnergy
    - `getComposureTrend(limit)` — counts and ratios of strong/mostly/rough composure across last N EOD records
    - `getEnergyArc(limitDays)` — same-day morning→evening energy comparison
    - `getEodReflections(limit)` — user's one-word EOD reflections for surfacing
    - **Persistence gap fix bundled:** `trackMorningComplete` was only persisting `{ date, timestamp, energy, tensionAreas: COUNT }` to `stillform_checkin_history` — the actual tension `{ areaName: 1-5 }` was being dropped. Same gap on EOD: `trackEodComplete` was only persisting `{ date, timestamp, composure }`, dropping energy/word/morningEnergy. Both fixed today; helpers above will now return real data going forward. Records before today have the partial shape; helpers handle missing fields gracefully.
    - Originally entered May 4, 2026 as follow-up to low-demand Phase 2 commit. Body Scan tension was being captured in React state and discarded; commit 3f148b6 fixed the persistence; today's commit closes the helpers gap + the parallel morning/EOD persistence gap discovered during this work.

---

### AI-as-actor voice audit — review only, May 2

**Captured May 2, 2026 — review only, no edits.**

The audit found that across info modals, FAQ items, system prompts in reframe.js, and one literal UI surface ("What the AI has noticed"), the app reaches for "the AI does X for you" framing instead of "you do X; the AI processes what you give it."

The mechanism is correct — AI does read inputs, process them, and surface user data. The voice register is what's off. Subject of every sentence keeps landing on the AI when it should land on the user.

**Items found (high-leverage first):**

1. ✅ **reframe.js system prompts** (CALM_SYSTEM, CLARITY_SYSTEM, HYPE_SYSTEM) — RESOLVED May 3, 2026 (commit `43d51a6`). The audit's concrete grounds were the "companion" / "coach" role framings in the opening registers. All three were rewritten:
   - CALM was `"You are a composure **companion** in Stillform"` → became `"You are the AI inside Stillform's Reframe — a self-mastery tool"`
   - CLARITY was `"You are a focused reframing **companion** in Stillform"` → became `"You are the AI inside Stillform's Reframe — clarity mode"`
   - HYPE was `"You are a pre-performance composure **coach** in Stillform"` → became `"You are the AI inside Stillform's Reframe — hype mode"`

   Position the AI as infrastructure inside the tool, not as a relational entity. Voice metaphors elsewhere in the prompts ("Like a sharp friend," "Like a coach who's walked into the same room before") are register descriptors, not identity claims — they shape tone without making the AI a companion. Closed as resolved.

2. ✅ **"Patterns surfaced"** — RESOLVED May 3, 2026. Was: "What the AI has noticed" (3 occurrences across post-session insight headers and My Progress archive). Now: "Patterns surfaced" — works in monospace caps and as a list header with insight count.

3. ✅ **FAQ "What happens in Reframe?"** — RESOLVED May 3, 2026. Question reframed from "What does the AI do in Reframe?" Answer now leads with "Reframe reads..." instead of "It [the AI] reads...", uses "Reframe surfaces what your processing is doing" instead of "The AI introduces a perspective," and frames the screenshot work as Reframe (the tool) reading the message rather than the AI being a diagnostician of the user's read.

4. ✅ **FAQ "Does Stillform learn about me?"** — RESOLVED May 3, 2026. Question reframed from "Does the AI learn about me?" Answer now: "Yes — the system reads your signal profile..." and "From session five onward, cross-session observations surface directly in your sessions." Removes "the AI" as the entity with observations; the system reads, observations surface.

5. ✅ **FAQ "What is Next Move?"** — RESOLVED May 3, 2026. Last sentence changed from "The AI reads your session context and surfaces the relevant options" to "Reframe surfaces the relevant options based on your session context." Rest of answer unchanged.

6. ✅ **FAQ "What is the Bio-Filter?"** — RESOLVED May 3, 2026. Last clause changed from "the AI contextualizes your input accurately" to "the system carries those variables into how your input is read." Matches phrasing used in Item 9 fix for consistency across audit.

7. ✅ **FAQ "Can I attach screenshots?"** — RESOLVED May 3, 2026. Was: "The AI reads visual context — layout, attribution, sequence — to improve coaching for interpersonal situations." Now: "Visual context — layout, attribution, sequence — is folded into the session so Reframe can read interpersonal situations more accurately." Three sentences after this remained the original limits/disclaimers.

8. ✅ **Reframe info modal "Why Reframe?"** — RESOLVED May 3, 2026. Was: "the AI introduces a perspective that interrupts the loop you're already in." Now: "you step back from the loop you're already in by surfacing a different angle on it. The work is yours; the system organizes what you give it and asks the next question." Fixed in both duplicate strings (click handler + keydown handler).

9. ✅ **Bio-filter info modal extension** — RESOLVED May 3, 2026. Was: "the AI updates the predictive model with the actual hardware state." Now: "you mark depleted, in pain, sleep-deprived, the system carries that hardware state into how your input is read." User as actor (marks); system as substrate.

10. ✅ **"Why name your state?" modal** — RESOLVED May 3, 2026. Was: "tells Stillform what is present so the AI can meet you accurately... how the AI interprets what you type." Now: "tells Stillform what's present so what comes next meets you accurately... how your input is read." Removed "AI" as sentence subject in both phrases without introducing developer jargon (tried "routing" first, dropped because it's not a user word).

11. 🔒 **Privacy/screenshot disclosure** — KEPT AS-IS May 3, 2026. Original audit flagged "the image is sent to the AI model for interpretation" as AI-as-actor drift. On review during the May 3 voice pass, this was determined to be a different category from items 2-10. Privacy disclosures need to identify the actual data processor — and "AI model" is the technically precise term for what receives the image (third-party LLM). Replacing it would obscure the privacy fact that the image leaves the device and goes to a third party. Termly and legal counsel would want this disclosure exactly this clear. Closed as deliberately preserved.

12. ✅ **Hero CTA "Calm my body" body-first subtitle** — RESOLVED May 3, 2026. Was: "Start where the pressure lands." Now: "Start with what the body is doing." Now parallels the thought-first subtitle ("Start with what the mind is doing.") and removes the assumption that body-first users arrive with pressure. CTA label "Calm my body" itself unchanged — audit only flagged the subtitle.

**Voice that would match Arlin's framing:**
- User reads their own state. The system organizes the inputs.
- User notices their patterns. The system surfaces what they've already given it.
- User does the work. The system asks the next question.
- Stillform is the architecture. The user is the operator.

**Notes for whoever does this work:**
- All 12 items resolved across three May 3, 2026 commits: `2b3da8f` (items 2-7 and 12), `411f2d5` (items 8/9/10), `43d51a6` (item 1 — Reframe AI prompt opening-register rewrite). Item 11 closed as deliberately preserved for legal precision.
- The 19-scenario AI Framework regression test artifact is ready to run. See `AI_REGRESSION_TEST_19.md` (test spec with pass/fail signals per scenario) and `scripts/run-ai-regression.mjs` (runner that posts each scenario to the deployed Reframe API and writes responses to `ai_regression_results.json`). Cost ~$0.05 per full run, ~2.5 minutes. Has not been run yet against the May 3 prompt rewrite or the May 4 Phase 3 LOW-DEMAND OVERRIDE. Pre-deploy gate before TestFlight broad release.
- **May 7, 2026 correction:** previous note here read "Item 1 still pending" — that was written before commit `43d51a6` and never updated. The companion/coach framings (the audit's concrete grounds for item 1) were already removed in that commit. Note corrected; audit is fully closed.

**Audit complete.** No open items remaining.

---

## 🚨 ARCHITECTURAL — Decide Before TestFlight

### GPT-4o data picture audit + existing guardrails review (Added May 2, 2026)

**The ask (Arlin, May 2):** Before adding more guardrails to the AI surface, understand what GPT-4o's data substrate actually is — what it does with the data we send, what its retention is, what its defaults are — AND review the guardrails Stillform already implemented against that substrate. The point is not to layer more guardrails on assumptions; the point is to verify the guardrails we have actually complement how GPT-4o behaves, across the whole app.

**Why now:** Stillform is no longer just-Reframe-uses-AI. The AI surface has expanded:
- Reframe text conversations → GPT-4o chat completions
- Reframe screenshot vision → GPT-4o vision (`detail:"low"`, max 15MB per image)
- Science cards → GPT-4o chat completions (separate call, its own validation layer)
- Unified text aggregator (shipped May 2) → feeds buildUnifiedTextContext into every Reframe call, which now includes Self Mode responses, What Shifted free-text, grounding writes, Signal Log entries

Every textarea the user fills in now has a path to GPT-4o via the unified aggregator. The guardrail layer was designed when Reframe was the only AI surface. It needs review against current scope.

**Single AI provider confirmed:** reframe.js calls only `https://api.openai.com/v1/chat/completions` with `model: "gpt-4o"` (verified May 2 by reading the function). Two call sites (main Reframe response + science card generation) — same endpoint, same key, same retention regime. No Anthropic API calls, no Claude in the picture. The audit is single-substrate.

**What needs to be answered (proposed scope of audit doc):**

*GPT-4o substrate side:*
- OpenAI API data retention — current default is 30 days for abuse monitoring; verify what Stillform's account is on (standard, zero-retention, enterprise tier)
- Training opt-out status of the API key — API data is opted out of training by default but verify
- Vision-API-specific policies — does image data have different retention than text?
- What `detail: "low"` actually transmits to OpenAI vs the original image bytes
- Whether system-prompt content is logged or treated differently than user-turn content
- What appears in Netlify function logs vs OpenAI's logs (we currently `console.error` full payloads on API errors — that lands in Netlify, separate retention)
- Whether the API key is rotated on a known cadence and what the procedure is
- Whether OpenAI's response is logged anywhere on our side beyond the user's device

*Stillform guardrail side (review what's already shipped):*
- System prompt rules — never quote entries back verbatim, session-count gating (≥3 vs <3), "for context only — do not reference patterns yet" framing
- Voice contract validation — does it leak any user data when validation fails and falls back?
- Voice repair retry path — same question, does the repair call carry user context?
- Banned-phrase post-processing filter on AI output — verify what it catches and what it misses
- Rate limiting (10 req/IP/min) — does it leak user identifiers?
- AES-256 encryption at rest on device — verified via SECURE_KEYS list (16 keys); does anything sensitive bypass?
- The Apr 15 OCR→GPT-4o vision migration's guardrails (type whitelist, 3-file max, 10MB/file, 20MB total, server-side validation) — still aligned with current scope?
- Crisis detection + liability guard flags fire Plausible events — verify those carry no user content
- The new textHistoryContext field — does the prompt instruction "never quote entries back verbatim, do not flag AI-down gaps" actually hold against GPT-4o's behavior, or does it sometimes leak?

**Status as of May 8, 2026:**
- ~~Phase 1 drafted May 2 — substrate side. See `GPT4O_DATA_PICTURE_AUDIT.md` in repo.~~ **CORRECTED May 8:** this file was never actually written. `git log --all` returns no history for it. The May 3 status entry was aspirational. No substrate-side audit document exists.
- ~~Phase 2 drafted May 2 — model behavior side. See `GPT4O_BEHAVIOR_AND_MCT_AUDIT.md` in repo.~~ **CORRECTED May 8:** same as above — never written, no git history, file does not exist.
- **Phase 3 SHIPPED May 8, 2026** as `GPT4O_GUARDRAILS_AUDIT.md` (commit `4657321`, 415 lines). Per Prime Directive (NO FABRICATION), Phase 3 did not pretend Phases 1 + 2 existed; instead it did the work Phase 3's stated goal called for ("actual guardrails review against substrate findings, mapping each shipped guardrail to which native pull it corrects/duplicates/conflicts with") grounded directly in (1) shipped guardrail code with line refs, (2) publicly-cited GPT-4o substrate behavior from `developers.openai.com` + OpenAI Model Spec Dec 2025 / Mar 2026 + IH-Challenge research Mar 2026, (3) the framework Stillform's prompts ARE doing (Wells 2009 MCT) vs the framework GPT-4o defaults to (CBT-coded therapy comfort).
- **Findings:** 26 of 30 server-side guardrails CORRECT real GPT-4o substrate defaults. Zero CONFLICTS. The MCT-vs-CBT distinction is operationally defended at three layers (system prompt rules, regex bans, golden examples). Path A migration (commit `9badb72`) closed the substrate-side encryption gap.
- **Actions surfaced + closed:** Action 1 (banned-pattern telemetry) shipped as commit `289ccf0`. Action 3 (crisis-fallback voice phrasing) shipped as commit `041c7fd`. Action 4 (fallback-of-fallback) verified during audit, no bug. Action 2 (consolidate ban lists) deferred until Action 1 telemetry data lands.
- **No ship-blockers for TestFlight** against current substrate behavior.

---

### AI stress testing protocol (added May 2 — surfaced from old ideas sweep; reconciled May 3)
**Pre-deploy gate, not optional.** Before any AI prompt change ships, run the existing **19-scenario AI Framework regression test list** in `Stillform_Punch_List.md` (under "Added April 8 — Afternoon Session" → "AI Framework"). The list covers the kind of self-diminishment / silencing / advocacy scenarios the prompts are supposed to catch (boss talked over user, missing degree credibility, immigrant outsider, medical leave betrayal, ADHD freeze, etc.).

Pass criterion per scenario: AI names the pattern, reflects the strength, builds confidence to act. Fail criterion: AI gives generic comfort ("that must be frustrating") or matches negative framing.

**Especially relevant given May 2 prompt rewrites** — the new MCT-aligned prompts in `netlify/functions/reframe.js` have not yet been stress tested against the 19 scenarios. Reading the punch list confirms these scenarios already exist as work-product, not aspirational; what was missing was the pre-deploy discipline of running them. Master todo and punch list now reference each other.

### Composure-applied-both-directions verification — REFRESHED May 8, 2026 (still partially test-blocked)
The AI must build BOTH outward composure (listener stops filtering input by status, background, bias) AND inward composure (speaker stops shrinking, qualifying, performing credibility). Verification needed: does the current prompt set produce both? May connect to the AI-as-actor voice audit (12 surfaces, captured commit `d8a6507e`) — if not already a verification dimension there, add it.

**Code-side audit findings (refreshed May 8, 2026 — supersedes May 6 entry):**

`netlify/functions/reframe.js` is now 1782 lines (was 1655 at May 6 audit). Re-grep against current state surfaces a more nuanced picture than the May 6 verdict:

- **CALM mode** (`CALM_SYSTEM` at line 825 — was 724). Stated job is inward: *"observe their own thinking when their state is loud."* But two refinements the May 6 audit missed:
  1. The MCT moves list at lines 858-860 explicitly includes outward-aware framings: *"Self-diminishing ('nobody would listen to me') → 'Your system is sorting you out of the room before the room does. The lived experience is data; the sorting is something else.'"* and *"Outsider experience (treated as less-than for accent, origin, background) → 'You read the room accurately. Your system is now running a second loop on top of the read.'"* The pattern: read-the-room as data, separate the second-loop reaction.
  2. The golden examples at lines 933 + 939 contain outward-framing pivots: silencing-pattern example ends with *"What do you actually want to say to them? Let's get it clear so when you're ready, you have the words."*; accent example ends with *"What do you want them to hear next time?"* These are outward-prep, embedded in an inward frame.
- **CLARITY mode** (`CLARITY_SYSTEM` at line 950 — was 822). Inward by design. Line 991-992: *"WHEN THE LOOP IS ABOUT WORK, TASKS, OR SOMEONE'S MESSAGE: The user remains the operator. Don't interpret messages, don't sequence tasks, don't translate other people's behavior. Surface the loop."* This is a LOCKED user-as-operator decision — the inward-only treatment in clarity mode is intentional architecture, not a gap. The clarity-mode response to external situations IS to redirect to the loop. *(See also "NO NAMES" rule — same principle.)*
- **HYPE mode** (`HYPE_SYSTEM` at line 1053 — was 952). Outward dimension explicitly named throughout. Line 1086: *"name the reality first. The read is data. Then surface what their system is doing on top of the read so they can walk in steady."* — the inward+outward sequence as design. Line 1088-1095 names six specific outward contexts: stage fright (presence over perfection), difficult conversations (hold position without escalating), interviews (shift the power balance), medical advocacy (right to be heard), social anxiety (room isn't watching as much), confrontation (composure is power, controls the room).
- **Cross-mode "do not pull toward repair, trauma, intensity" guard** still present at lines 840 (calm) + 963 (clarity). Prevents speaker-shrinking via therapy-coded comfort framing.
- **NEW since May 6:** Action 3 crisis-fallback voice update (`041c7fd`, May 8) replaced *"I'm still here — keep talking to me"* with *"You're not alone — please reach 988 or the Crisis Text Line. They're equipped for exactly this moment"* — removed Stillform-as-destination framing per March 2026 OpenAI Model Spec wellbeing guidance.

**Refined verdict on code side:** the prompts produce inward composure as the primary frame across all three modes, with outward dimension explicitly carried in HYPE mode (six named contexts) and IMPLICITLY in CALM via outward-aware MCT moves + golden-example outward pivots. CLARITY's inward-only is intentional locked architecture. The May 6 verdict ("inward-only in calm/clarity, implicit outward in hype") was technically correct at the rules-level but missed the outward work being done in the calm-mode MCT moves and golden examples. The prompt set has better outward coverage than the May 6 audit suggested.

**Still test-blocked:** whether the model actually FOLLOWS the golden examples and outward-aware MCT moves vs defaulting to inward-stated-job framing is an empirical question that requires running `AI_REGRESSION_TEST_19.md` (verified to exist in repo) against the deployed Reframe API. **Cannot run yet:** there are 15+ unshipped commits in the deploy queue since `1bce7ed` production (Path A migration, banned-pattern telemetry, crisis-fallback voice update, doc cleanups). The regression must run against the deployed version, not staging code, to verify behavior under real conditions. Once Arlin triggers the next Netlify deploy, this test is the gate.

**Decision pending test results:** if the 19-scenario test shows the AI reaches for the inward-only stated-job framing in scenarios needing outward (boss talked over user, missing-degree credibility, immigrant outsider) and ignores the golden-example outward pivots, that's a prompt rewrite item before TestFlight. If the test shows the AI handles both directions adequately because the per-state contexts and hype-mode framing and CALM's outward-aware MCT moves + golden examples carry enough load, this audit closes without further work.


---

## 🎨 Prestige Refresh — whole-app visual track


**Spec drafted Apr 30 — see `STILLFORM_DESIGN_SYSTEM.md` in repo root.**

Arlin's diagnosis: "It looks like a 32-bit NES platform. Whole app needs to be prestige." Refresh authorized as prelaunch work. Visual language synthesized from 5 AI reference passes converging on editorial luxury family (Aesop + MUBI + Cartier + Linear, not wellness apps). Spec covers calibrated palette, type scale, spacing rhythm, motion tokens, component vocabulary, implementation order. Ships with existing free font triad — no paid fonts required.

This work blocks visible execution of Self Mode redesign and My Progress redesign (both already specced — `SELF_MODE_FOUR_WAY_SYNTHESIS.md` and `MY_PROGRESS_REDESIGN_SPEC.md`). Both redesigns are designed against the new system, not the current one. Build the design system first, then the redesigns land into it cleanly.

Implementation order in spec: CSS variables → typography → components → screens (Home → Reframe entry → Self Mode → My Progress → Body Scan → Breathe → Pulse → Settings → FAQ). Each screen verified on phone debug before next.

---

## 🐛 Bugs / Defects

### ✅ RESOLVED May 7, 2026 — Auto-trigger cloud sync + restore purchases on app open for logged-in users (originally added May 6, 2026)

**Resolved by Launch Sync useEffect at `src/App.jsx:14000-14028`** (added May 7, dependency `[syncSignedIn]`, debounced 2 minutes). On app open with active session, fires `sbSyncDown()` and forces `setSubscriptionCheckTick(n => n + 1)` — which in turn triggers `sbCheckSubscriptionStatus()` at line 13958. Comment at line 13988 explicitly references this Master Todo entry.

**Verified on phone May 7 (Arlin):** subscription shows active without manual restore tap.

Original entry preserved below for archival.

---

<details>
<summary>Original entry (now resolved)</summary>

When a user is already signed in, opening the app does not automatically sync cloud data or restore purchases. Both require a manual tap in Settings.

**Impact:**
- Returning users see stale or missing data on launch until they sync
- Subscription entitlement can read as inactive until restore is tapped
- During phone-testing this is indistinguishable from a real bug

**To ship:**
- On app open with active session, auto-trigger cloud sync
- On app open with active session, auto-trigger restore purchases
- Surface failure or conflict; keep success silent

**Why TestFlight-blocking:** Apple reviewers will sign in and expect their data and active subscription to be present without manual Settings actions. Real UX gap for any returning user.

</details>

### ⌚ Watch haptic breathing companion — pattern ID mismatch (Galaxy Watch Ultra / Wear OS) — SOURCE FIXED, APK BUILD PENDING

**Source state (verified May 7, 2026):** `WearBreatheActivity.java` switch now handles all three current phone-side pattern IDs (`quick`, `deep`, `cyclic_sigh`) with correct phase durations. Source code is no longer the bug.

**Remaining work:** Watch APK on Arlin's physical device hasn't been rebuilt with the source change. Genuinely environment-blocked — requires Android Studio installed locally to run `npx cap sync` + Gradle build + install on watch. Not a code task.

- Code chain wired end-to-end: App.jsx line 4265 → watchBridge → WatchBridgePlugin → WatchBridge.java → MessageClient `/stillform/breathe` → WearListenerService → WearBreatheActivity. Plumbing is structurally complete.
- **Original bug (May 2): pattern ID mismatch between phone and watch.** Phone-side `BREATHING_PATTERNS` IDs are `quick`, `deep`, and `cyclic_sigh` (App.jsx line 3629-3650). Watch-side switch originally only handled `box`, `478`, and `quick` — has since been updated.
- Cannot verify from code (requires device testing): wear module builds into APK, watch app installs alongside phone app, haptics fire correctly on real hardware, message round-trip works under real conditions.

### ✅ RESOLVED May 7, 2026 — QBPill saved position not clamped on mount — off-screen on phone (originally added May 7, 2026)

**Resolved at `src/App.jsx:13665-13682`.** `getSavedPos()` now wraps the saved position through `clamp()` before returning. Comment at line 13666 explicitly references this Master Todo entry.

Original entry preserved below for archival.

---

<details>
<summary>Original entry (now resolved)</summary>

Surfaced in May 7 phone testing. Quick Breathe pill missing from Reframe (and other screens) because saved position from a wider device persists in localStorage, lands off the visible viewport on phone.

**Root cause:** `QBPill` (App.jsx ~line 12872) reads `stillform_qb_position` via `getSavedPos()` and uses it as initial state. `clamp()` only fires during pointer drag, not on mount. If the user previously positioned the pill on desktop (or a wider phone) and that x/y persisted to cloud sync, on a smaller viewport the pill renders off-screen. Pill works fine — just invisible.

**Fix scope:** ~3 lines. Wrap the `getSavedPos()` return through `clamp()` on initial render, or run a clamp pass inside the existing `useEffect` that handles window-resize. Verify on desktop AND phone after fix.

**Affects all users**, not specific to a processing type — QBPill is global.

</details>

### ✅ RESOLVED May 7, 2026 — Morning check-in stopped writing `mood`; PresentStateChips reader still expects it (originally added May 7, 2026)

**Resolved at `src/App.jsx:17577`.** `saveCheckin()` now writes `mood: ciMood || null` alongside the existing fields. Comment at line 17577 explicitly references this Master Todo entry: *"morning emotional state, restored after broken-contract fix."* Reader at `PresentStateChips` (line 11598) was already correct — fix was on the writer side, option (a) per the original recommendation.

Original entry preserved below for archival.

---

<details>
<summary>Original entry (now resolved)</summary>

Surfaced in May 7 phone testing. The "From this morning" row in `PresentStateChips` (Reframe entry) only ever shows tension chips, never a mood chip — broken contract between writer and reader.

**Root cause:** Morning check-in `saveCheckin()` (App.jsx ~line 16555) writes `{ date, energy, bio, tension }` — **no `mood` field**. `PresentStateChips` (App.jsx line 10908) reads `checkin?.mood` to render the morning mood chip. Field was dropped from the writer at some point in a refactor; consumer was never updated.

**Fix decision needed:** either (a) restore mood capture in morning check-in (adds back a chip selector to morning UI — small surface change), or (b) drop the dead `checkinMood` read in `PresentStateChips` (simpler, but loses the original feature intent of carrying morning emotional state into Reframe context).

Recommendation: (a) if morning emotional state matters as AI context, otherwise (b). Worth a short call before fix.

</details>

---

## 🎨 UX / Surface refinements

### My Progress redesign

**Spec drafted Apr 30 — see `MY_PROGRESS_REDESIGN_SPEC.md` in repo root.**

Arlin's diagnosis: data heavy with redundancy. Heavy compute should run backend/PDF for deeper analysis; live screen should surface trends and patterns only. Eight sections collapse to four (headline pattern, compounding view, patterns and intelligence, archive and export). Earns Pillar 4 neuroplasticity claim by surfacing the science behind each pattern (Lieberman 2007, Wood & Rünger 2016, Schultz 1998, Lehrer 2020, Brewer 2011, Meichenbaum 1985, Wells 2009). Privacy architecture preserved — on-device only, Stillform never sees individual user data.

Visual treatment held until whole-app design system locks (whole-app prestige refresh authorized Apr 30). Some redundancy may resolve naturally during the design system pass; new patterns may emerge. Build the spec into the new design system rather than the current one.

### Processing primer threshold tunable (currently 5 sessions)

Decay logic ships at session > 5 (App.jsx ~line 14257). If 5 is too long after live testing, threshold is one number to change. Captured Apr 29 for revisit after real user data.

### ✅ RESOLVED May 7, 2026 — Surface bio-filter at Reframe entry (transparency + mid-day update path)

**Resolved at `src/App.jsx:11699-11788`.** `PresentStateChips` now includes a bio-filter status line between morning chips and feel chips, exactly matching the spec: monospace caps "Bio-filter · {label}", ⓘ for explanation modal (Seth 2013, Barrett & Simmons 2015), inline edit drawer with all `BIO_FILTER_OPTIONS`. Edit closes on selection, fires `setActiveBioFilter()` for canonical persistence.

<details><summary>Original entry (now resolved)</summary>

Surfaced in May 7 phone testing. `PresentStateChips` at Reframe entry currently shows tension chips from morning check-in + 9 in-the-moment feel chips, but **does not surface the active bio-filter**. So the user can't see what hardware state the AI is reading them in — which now drives major behavior changes (low-demand mode strips the close flow on six bio-filter values per the May 6 broadening).

**History check:** no commit explicitly removed bio-filter from this surface. It was just never built in. Archive line 457 confirms `PresentStateChips` was kept at Reframe entry per Lieberman 2007 (labeling IS the regulation mechanism for cognitive intervention), but the chip set never included bio-filter.

**Approach (revised May 7 after phone-screenshot review):** NOT a new chip row. The Reframe entry surface is already dense (mode label, encryption notice, processing primer, "WHAT IS PRESENT" + 2 ⓘ, morning tension chips, 9 feel chips, encryption duplicate, tone dropdown, AI/Self Mode tabs). Adding another interactive chip array contradicts the processing primer's *"start with one concrete signal"* framing — it asks the user to triage their state across another axis before they type.

**Status line instead.** Slotted between "FROM THIS MORNING" chips and "ANYTHING TO ADD?" label. Mono caps, small, --text-muted. Reads something like:

```
ACTIVE: depleted · set this morning  ⓘ ✎
```

Tap ✎ to edit inline (small picker drawer, not a full chip row taking permanent screen space). Tap ⓘ for "what does this mean for how the AI reads you" modal.

**Fix scope:** ~30 min. New `BioFilterStatusLine` mini-component, slot inside `PresentStateChips`, pull active value via `getActiveBioFilter()`, edit drawer reuses existing bio-filter chip array from Breathe/Body Scan but renders inline.

**Bonus this fix unlocks:** mid-day state agency. Currently the only path to update bio-filter mid-day without a session is to start Breathe/Body Scan and bail. With the inline edit affordance, opening Reframe and tapping the ✎ is a 2-tap update path. Sufficient for V1 — no separate home status card needed.

**Non-goal:** does NOT extend to surfacing bio-filter on home screen, in nav, or in Settings. That's a separate question if user testing surfaces a deeper need.

</details>

### ✅ RESOLVED May 7, 2026 — Tone dropdown affordance — reads as label, not control

**Resolved at `src/App.jsx:10019-10048`.** Comment at line 10025 explicitly says: *"May 7, 2026 affordance bump — surfaced in phone testing as reading like a static label, not a control. fontSize 10→11, muted color→dim, plain border→amber-dim accent, subtle resting bg, brighter chevron. Still small and quiet (this is not a primary action), but legibly tappable."* All five fix items from the original recommendation applied.

<details><summary>Original entry (now resolved)</summary>

Surfaced in May 7 phone testing. The Reframe AI tone dropdown (App.jsx ~line 9329) is implemented (commit `f36cdb63`, May 2 — three-layer system) but visually reads as a static label, not an interactive control.

**Fix scope:** bump visual weight of the button — slightly larger font, less muted color (`--text-dim` or `--text`), more obvious border or subtle accent fill.

</details>

### ✅ RESOLVED May 7, 2026 — Splash wordmark visual treatment — split or all-accent

**Resolved at `src/App.jsx:16473`.** Splash now renders `Still<span style={{ color: var(--amber) }}>form</span>` matching the nav. Visual consistency restored across surfaces.

<details><summary>Original entry (now resolved)</summary>

Surfaced in May 7 phone testing. Splash screen rendered "Stillform" as a single block in `var(--amber)`. Nav rendered with split treatment — "Still" in body color, "form" in `--amber`.

**Design call needed:** split the splash to match nav, or accept the ceremonial all-accent treatment as deliberate. ~2 min code change either way.

</details>

### ✅ RESOLVED May 7, 2026 — Low-demand close flow strips post-state chip — overcorrection

**Resolved across all three tools.** Reframe + Body Scan fixed early May 7 (`src/App.jsx:8518` + `src/App.jsx:5685`); Breathe fixed late May 7 (`src/App.jsx:5468` + cycle-counter useEffect at 5067 — same architectural pattern as Reframe + Body Scan). All three tools now preserve the 1-5 / chip selection for low-demand users (Lieberman 2007 affect labeling preserved as the lowest-demand metacognitive act in the app), drop everything downstream (debrief, Next Move, Lock-in, State-to-Statement, science card).

<details><summary>Original entry (now resolved)</summary>

Surfaced in May 7 phone testing. Phase 3 low-demand commit (`49fdb54`, May 4) strips six surfaces from Reframe close: post-rating chip, post-insight, State-to-Statement, science card, debrief gate, Next Move + Lock-in. Phase 2 low-demand commit (May 4) strips equivalents from Body Scan close.

**Problem:** the post-state chip is **one tap** — the lowest-demand metacognitive act in the app. It's the data point that classifies the shift (Russell category, Plausible event, Settled→regulated path). Stripping it means a depleted user who *did* shift has no way to mark it. Their session evaporates. That's the opposite of what low-demand should do.

**Proposed fix:**
- Keep post-state chip screen for low-demand users — single tap, no required follow-up
- Add "tap anywhere to close" affordance for users who don't feel shifted
- Drop everything *after* chip selection (State-to-Statement, science card, debrief, Next Move/Lock-in) — those are the real demand
- **Same parallel change for Body Scan** — Phase 2 also strips What Shifted; symmetry needed per operating rule (changes apply to both processing types)

**Locked decision check:** Apr 28 locked decision describes low-demand as "broad cognitive-bandwidth-limited population." That decision sets the population, not the strip-list. The strip-list was an implementation choice that went too far. This proposal narrows the strip without reopening the locked decision.

</details>

### ❓ "Additional morning chips" — needs Arlin's direction — added May 7, 2026
Surfaced in May 7 phone testing as a thing that "didn't get implemented." No spec or commit found in repo. Open questions: what set of chips were meant to be added (the 9 feel-chips? a different set?), and what surface (morning check-in screen? carrying through to Reframe context?). Captured here so it doesn't drop off; awaiting direction before scoping.

---

## 📋 Compliance / Apple / Legal

### 📞 Set up Google Voice business line + update Termly ToS phone number — REQUIRED before TestFlight (added May 4, 2026 during Termly ToS questionnaire)
The Termly ToS generated today lists Arlin's personal cell (+1 201-388-8437) as the company contact phone in two places (opening paragraph and Section 31 "Contact Us"). Personal cell published in legal docs = spam exposure, subpoena service exposure, and personal/business boundary erosion.

**Steps:**
1. Set up free Google Voice number at voice.google.com. Pick a number from any area code (NJ 201/973/908 keeps it regional). Forward to Arlin's personal cell so calls/texts route through but the published number is the Google Voice one.
2. Update Termly ToS questionnaire — replace the personal cell with the new Google Voice number in the company contact section. Re-generate ToS. Re-publish.
3. Optional: also update Termly Privacy Policy if it references the same phone (need to check — Privacy Policy review yesterday didn't surface a phone field).

**Why TestFlight-blocking:** the ToS published today is technically active even before App Store launch. Anyone who reads it has the personal cell. Better to fix BEFORE the ToS goes wide. Five-minute setup, real privacy protection.

### 🔧 Fix Termly ToS free-trial billing answer — REQUIRED before publishing the ToS (added May 4, 2026 during Termly ToS questionnaire)
The ToS generated today reads: *"The account will not be charged and the subscription will be suspended until upgraded to a paid version at the end of the free trial."* This **contradicts the actual Lemon Squeezy billing setup** — the trial auto-converts to paid charging on day 15. Real legal exposure: a user charged on day 15 could cite the ToS as evidence the charge was unauthorized.

**Steps:**
1. Go back to Termly ToS questionnaire. Find the Free Trial question.
2. Change the answer from "The account will not be charged and the subscription will be suspended until upgraded to a paid version" to **"The account will be charged according to the user's chosen subscription."**
3. Re-generate ToS. Re-publish at https://stillformapp.com/terms (or wherever the ToS embed lives).

**Why must-fix before publishing:** the current ToS makes a false billing commitment. This is the single biggest exposure in the generated document. Five-minute fix.

---

## 🏗️ Infrastructure

Backend, schema, cloud sync, deploy, env-var, Supabase migrations.

*Currently empty. Reserved for new items as they surface.*

---

## ✍️ Copy / Voice / Content

User-facing copy, AI prompt voice, FAQ, science cards, info modals.

*Currently empty. AI-as-actor voice audit (12 items) closed May 3, 2026 — full record lives in Engagement Craft section.*

---

## 📒 OPERATING NOTES — for future sessions

### Watch deploy → publish flow on Netlify
Triggering a deploy in Netlify is NOT the same as publishing it. After triggering, the new build sits ready on the Deploys tab and must be explicitly Published to go live. Reminder: Claude pushes → Arlin triggers deploy → Arlin publishes → fix is live.

---
## 🟡 STORE SUBMISSION PATH — Google Play Closed Testing → Public Launch

This section covers the store submission mechanics, not the prelaunch product scope. **The launch standard (locked Apr 29) is: master todo complete, except translations and Apple Store.** Every section above this one is prelaunch work — that scope must be resolved before public launch.

Launch path: Google Play closed testing → public launch. Apple Store is the explicit exception — TestFlight blocked until Arlin has access to an iPhone. Reddit is not a launch step; held as a contingency lever for week-1 traction support.

**ACTIVE — work that can ship now:**

- [ ] **My Progress redesign — RE-QUEUED May 8, 2026 (was deferred May 7, never came back).** Spec: `MY_PROGRESS_REDESIGN_SPEC.md` (23K, May 7). Per Thursday May 7 morning sequencing decision: build steps 2-4 first (Settled chip, Body Scan What Shifted, three-category data feed), defer step 5 (this redesign) to its own dedicated session "after I can see real categorized data on your phone." Steps 2-4 shipped. Step 5 was never re-queued. Current `function MyProgress` at `src/App.jsx:13516` is the OLD layout — the categorized data feed shipped but the surface that VISUALIZES it didn't. **This is one of the deferred experiences directly tied to Arlin's "I see more stuff but don't feel more engaged" feedback (May 8).** Read the spec before scoping; it's substantial.
- [ ] **Self Mode redesign — RE-QUEUED May 8, 2026 (drafted May 7, never confirmed, never implemented).** Spec: `SELF_MODE_REDESIGN_RESEARCH.md` (25K, May 7). Replaces the original 5-step flow (Notice / Name / Recognize / Perspective / Choose) with 4-step (Notice / Name / **Watch** / Release). The Watch step is the actual MCT moment Wells 2009 specifies — catch-and-release, not catch-and-analyze. Currently `MetacognitionTool` at `src/App.jsx:13012` still runs the original 5-step. Drops Step 3 (Recognize "have you been here before" — invites analysis) and Step 4 (Perspective "what do you need" — goal-directed coping). Five citations verified during May 7 research session. Pending Arlin's spec sign-off before code change. **Also tied to the felt-engagement gap.**
- [ ] **Info button discipline pass — engagement architecture surfaces (added May 8, 2026).** The product principle "every Stillform surface answers WHY" is broken on the recently-shipped engagement architecture work + a few other May surfaces. Audit completed May 8; surfaces that ship without ⓘ:
  - **Practice Trend** (3 renderings) — Reframe in-tool `:10740`, Reframe close `:11039`, Body Scan close `:7337`. Achievement micro-credit (Build #5) shows pre→post chip transition. Heider 1958 attribution science is in code comments but invisible to users.
  - **Mirror anchor** (home stage marker) `:19287` — single tappable button opens Mirror sheet but no science modal explaining the stage system. **Arlin May 8: "Stage 1 on the screen? no info button. 50% to naming and it says I have 5 stages but no explanation as how I do it or how I get there."** This is the highest-priority gap.
  - **Mirror sheet body** (full stage breakdown) `:17654` — no ⓘ on stage name, capacity description, or markers section.
  - **Body Scan "What Shifted" header** `:7158` — caption explains activity but no ⓘ button.
  - **"Settled" chip** — defined at `:7143, 10671, 12977, 19107` but NOT in `CHIP_DEFINITIONS` table (which powers the dynamic chip-info ⓘ buttons via line 7204). Other chips have ⓘ; Settled doesn't.
  - **Three-category Russell classifier** surfaces (My Progress data feed) — no ⓘ explaining the framework.
  
  Three approach options to choose from when picking this up:
    A) Add ⓘ + science modals to all surfaces in one focused pass (~60-90 min). Restores the discipline.
    B) Add ⓘ to highest-visibility only — Practice Trend renderings + Mirror anchor + Settled chip — covers ~80% of user-facing impact in ~30-45 min.
    C) Decide some surfaces don't need ⓘ (e.g., Mirror anchor opens Mirror sheet which IS the explanation, just not framed as ⓘ) and document rationale in code.
  
  Each surface has the science available — modal text mostly drafts from existing code comments + spec docs (engagement architecture, Russell circumplex, Heider attribution). **This is the third deferred experience tied to the felt-engagement gap.**

- [ ] **🔥 NARRATIVE SPINE / CONNECTIVITY LAYER — the absent integrative experience (added May 8, 2026 from Arlin direction).** This is the largest UX gap the product has and is structurally distinct from the info-button pass above (which fixes WHY for individual surfaces). The connectivity layer fixes the absent CHAIN that ties everything together as one journey.

  **Arlin's exact framing (May 8):** *"Where is the connectivity of the flow for everything? It doesn't feel connected. It doesn't show hey we are using metacognition to help you be your best self by stabilizing composure so you can be successful in your day to achieve your goals and these are the steps you need to take/practice to get these. It feels like a bunch of boxes with no true data system or connectivity."*

  **The gap:** Stillform has features (Bio-filter, Tools, Practice Trend, Mirror anchor, Mirror sheet, My Progress, Stages, Russell classifier, Plain-Language Neuroscience cards) that the user encounters as discrete surfaces. The data layer behind them IS connected (`getCurrentStage`, `classifyShiftDirection`, `computeAchievementForX`, marker progress, three-category data feed all live in one architecture) but the connection is invisible to the user.

  **The missing causal chain — what the user should feel:**
  1. **Mechanism:** *We use metacognition.* (Wells 2009 — observing the state, not solving it.)
  2. **Outcome:** *Metacognition stabilizes composure as a learnable capacity.* (Stages of capacity, not points.)
  3. **Life impact:** *Composure lets you operate well in your day, achieve your goals.* (The user's WHY.)
  4. **Practice:** *These are the specific moves that build it.* (Body Scan, Reframe, Self Mode mapped to capacities.)
  5. **Today's contribution:** *This session is rep #N of capacity X — building toward Stage Y.* (Each session ties to the larger journey.)
  6. **What's next:** *To progress from Stage 1 to Stage 2, here's what to practice.* (Action affordance, not just status.)

  **Concrete examples of where the chain breaks today:**
  - Mirror anchor displays "STAGE 1 · NOTICING · 50% TO NAMING" — names the position but never names *why naming matters, what naming gives you that noticing doesn't, what to do to get there, or how this connects to your goals.*
  - Practice Trend shows `focused → mixed` — names the transition but never names *what capacity it builds, what stage it contributes to, or why the user should care.*
  - My Progress shows aggregates — Avg Shift, Processing Type, Lock-in Rate, Day Streak — but doesn't show *the journey those numbers describe.*
  - Tools (Body Scan, Reframe, Self Mode) entered from home with no context for *what each one builds, when to use which, or how today's choice contributes to capacity.*
  - Roadmap markers exist in `getCurrentStage` data but have no surface that shows *the path forward.*

  **What this is NOT:** This is not the info-button pass. Info buttons surface science PER surface. The connectivity layer is the connecting tissue ACROSS surfaces — the thing that makes the whole feel like one practice, not seven tools.

  **Possible solution shapes** (Arlin's call which path; surfacing options, not deciding):
  - **A) Mirror sheet enhancement** — add "What this stage gives you / What to practice next / How today's session contributes" sections. Single-surface change, big experiential payoff. Lowest risk.
  - **B) Cross-surface narrative threading** — every Practice Trend, every tool entry, every My Progress metric carries a sentence connecting it to the larger journey ("This session built your NAMING capacity — 3 reps closer to Stage 2"). Bigger surface area, more code touches, higher payoff.
  - **C) Dedicated "How Stillform Works" surface** — interactive walkthrough that shows the chain explicitly (mechanism → outcome → life impact → practice → today). Standalone, can be entered from Settings or first-run. Lower risk because additive.
  - **D) Combination** — Mirror sheet enhancement (A) + light narrative threading on highest-visibility surfaces (Mirror anchor, Practice Trend, Reframe close) + retain the option for a later "How Stillform Works" surface. Probably the right path because A is the smallest viable fix to the connectivity gap and B+C extend it without rebuilding it.

  **Relationship to other May 8 items:** This is the parent of the engagement gap. Info-button pass (line 716) addresses WHY. My Progress redesign (line 714) addresses one specific surface. Self Mode redesign (line 715) addresses one specific tool flow. The narrative spine is the FRAME that makes those individual fixes feel like parts of one product instead of disconnected polish. **If launch happens without this, every individual fix above will land but the product will still feel disconnected because the connecting tissue is the actual gap.**

  **Read before scoping:** `STILLFORM_ENGAGEMENT_ARCHITECTURE.md` (the architecture spec) + `MY_PROGRESS_REDESIGN_SPEC.md` (one slice of the connectivity surface). Both already in repo. The framework exists; the surfacing of it doesn't.

- [ ] **🔥 Voice consistency audit — prestige-operator vs clinical-citation drift (added May 8, 2026 from Arlin direction).** Companion to the narrative-spine item above. The product's voice slips from prestige-operator into clinical-citation in multiple microcopy surfaces shipped as features without weaving. The pattern: science is paraded as credentialing rather than woven as language.

  **Arlin's framing (May 8):** *"You took my ideas and created them on such a mass superficial layer rather than truly integrating the idea, weaving it in. These were huge opportunities to make the app elite and prestige."*

  **Confirmed example (Cyclic Sighing breathing pattern card, settings):** *"Outperformed mindfulness, box breathing, and other patterns for mood and arousal reduction in a 2023 Stanford RCT (Balban et al., n=111). The most-studied breath for downregulation."*

  **Why this is wrong tone:** It tries to convince via credentials. Prestige doesn't try. Compare to Quick Reset on the same screen: *"60 seconds. Reset and get back to it. Focused breathing slows your system. The shift starts in under a minute."* — declarative, experience-first, science woven not paraded.

  **Likely additional surfaces (audit needed before scoping):**
  - Plain-Language Neuroscience cards — may have the same citation-dump drift
  - Mirror sheet capacity descriptions
  - Body Scan What Shifted caption
  - My Progress metric descriptions (the ⓘ modals that exist DO seem to have decent voice — sample: "Schön (1983)" cited at end as language, not lead)
  - All `setInfoModal` body strings — full audit
  - Reframe AI prompts — already audited and largely good (Wells 2009 woven, not paraded), but worth re-reading post-spine work
  - Tutorial / onboarding cards

  **Voice rubric (drafts from existing good examples):**
  - Lead with experience or action, not credentials
  - Science is the LANGUAGE not the AUTHORITY ("the shift starts in under a minute" not "studies show")
  - Citations at the end, as artifacts of language, not as proof
  - One declarative sentence often beats a paragraph of context
  - The voice WHOOP / Bloomberg / Amex would use, not the voice Headspace / Calm would use

  **Sequencing:** Probably runs alongside the narrative-spine work (item above) — the spine work IS the weaving, voice consistency IS the prestige tone of the woven content. Same pass. Different lens on the same problem.

- [ ] Google Play Console setup ($25 one-time) — required for closed testing track, 14-day clock before public launch can begin. Build the Android App Bundle from existing Capacitor android/ project.
- [ ] Onboarding redesign — 2 intro pages max, calibration, interactive first-use walkthrough. **Sequenced last on purpose (Arlin direction May 4):** onboarding teaches users what the app does, so the calibration questions and tutorial flow can't be designed until the rest of the prelaunch product scope is locked. Building it earlier means rebuilding it as features land.

- [ ] **🔥 Low-Demand Phase 3 — Reframe (added May 8 from audit; spec dated April 30, 2026).** `LOW_DEMAND_PHASE_3_SPEC.md` (14K) — explicit status in spec: *"Spec draft for review. Awaiting Arlin's call before code wiring."* Phase 1 (Breathe) shipped Apr 30 (commit `81e2c0b7`). Phase 2 (Body Scan) shipped — verified May 8 at `src/App.jsx:6936`. **Phase 3 (Reframe) is the most complex of the three** because the AI's behavior changes too, not just the UI. Two surfaces to address: (1) AI behavior — shorter sentences, simpler language, fewer questions demanding cognitive work, no multi-part reframings; (2) UI — same stripping pattern as Phase 1 and 2 (no chip selection, no State-to-Statement option, simplified close). A medicated user cannot do Reframe at full cognitive load — without Phase 3, the cohort the low-demand work is designed for can use Breathe and Body Scan but not Reframe. Read spec before scoping.

- [ ] **5 Premium sound packs — promised in UI as "Coming soon", never built (added May 8 from audit).** Verified at `src/App.jsx:21540-21567`: 5 sound packs render with 35% opacity + "COMING SOON" badge, non-interactive: Singing bowl, Rain, Ocean waves, Lo-fi ambient, White noise. Per project memory: *"premium sound packs and UI customizations are optional one-time purchases — not included in core subscription."* So these are tied to monetization (post-launch add-on revenue) but each is also a UI promise the user sees today.
  - **Decision needed:** ship as monetizable add-ons after launch, OR remove the "Coming soon" placeholders entirely from the UI until they're real. Promising features in the UI without delivery is its own pattern of the disconnection Arlin named (May 8).
  - Each sound pack requires: audio file (royalty-free or original), Web Audio API wiring through existing `stillform_sound_type` localStorage hook, free vs premium gate logic, optional one-time purchase plumbing through Lemon Squeezy if monetized.
  - Lowest-risk path: drop the 5 placeholders to a separate post-launch section, or remove the array entirely and add back when first pack ships. Ship-blocking decision: do the placeholders make the app feel more or less complete to a day-1 paid user?

- [ ] **🔥🔥 ENGAGEMENT ARCHITECTURE — ENGINE 2 (APPLICATION LAYER) — entirely unbuilt (added May 8 from audit; spec dated May 7).** This is the largest single set of untracked work in the repo and **directly answers Arlin's May 8 connectivity / "boxes with no data system" / "I don't feel more engaged" feedback.** Per `STILLFORM_ENGAGEMENT_ARCHITECTURE.md` line 7 (verbatim): *"NOT YET BUILT: Build #2 Phase 2 (Trigger Profile capture UI — pending Layer 0.6 flow audit before any UI proposal) · Today's Brief · Roadmap full screen · Pre-event Brief · Move card · Scripts · EOD artifact."* Per `Stillform_Strategic_Roadmap.md` lines 41-46, this layer is *"Layer 3 adds a real application layer: Today's Brief, Pre-event Brief, Move card, Scripts, EOD artifact — concrete artifacts the user takes from the app into their day."* Engine 2's stated purpose: *"what the user takes from app to life."* Without it the product is observation-only — exactly the "boxes" Arlin felt May 8.

  **Each item (read the spec before scoping each):**
  - **Build #2 Phase 2 — Trigger Profile capture UI.** Phase 1 (data layer) shipped May 7. **Layer 0.6 flow audit COMPLETE May 8** — see `TRIGGER_PROFILE_PHASE_2_FLOW_AUDIT.md` in repo root. Audit recommends Option C (hybrid: optional calibration seed + progressive daily-loop capture + Settings CRUD) and proposes 5 capture surfaces (Settings CRUD foundation → EOD prompt → Mirror sheet section → Reframe close prompt → calibration seed). **6 open calls for Arlin in audit §6** before code begins: architectural choice (A/B/C), seed-prompt timing, surface ship order, conversation-parsing privacy decision, trigger-tagged-sessions scoping, surface copy voice review. Once Arlin's calls are made, Phase 2a (Settings CRUD) ships first as the foundation — every other surface depends on the form component it carries. Phase 2 unblocks Today's Brief (Build #3) which then unblocks Pre-event Brief (Build #7).
  - **Today's Brief.** Morning surface that orients the user to the day ahead with their context (calendar, stage, recent practice, known triggers).
  - **Roadmap full screen.** The journey made explicit — current stage, completed markers, upcoming markers, dose-response timelines. The Mirror anchor is the in-flow surface; the Roadmap full screen is the standalone journey view. Per master todo line 720 (info button pass) the Mirror anchor opens the Mirror sheet — but the Mirror sheet is partial. Full Roadmap is its own surface.
  - **Pre-event Brief.** Preparation surface for a known stressful upcoming event (calendar-aware). Shows the user what their pattern is for events of this type and what move tends to work.
  - **Move card.** "What to do RIGHT NOW" artifact — single concrete action, generated from current state + trigger + capacity. The thing the user takes into the moment.
  - **Scripts.** Practical language for specific situations — what to say in confrontations, requests, refusals, etc. Translates regulated state into deployable words.
  - **EOD artifact.** End-of-day output — a tangible thing produced from today's practice that the user keeps. NOT the same as the EOD prompt that already exists; that's an *input*. EOD artifact is an *output*.

  **Why this is the biggest unaddressed gap:** The narrative spine item (line 730) addresses *experience of connectivity through better UX of existing surfaces*. This Engine 2 work addresses *the actual missing surfaces that bridge app to life.* Both are needed; this one is structurally larger because it's net-new product surfaces, not refinement of existing ones.

  **Ship-or-defer decision:** The spec at line 303 (`Stillform_Engagement_Architecture.md`) gives a load-bearing-first shipping order. Per current decision (master todo line 769, Engagement Architecture build queue paused pending deploy) these may be entirely post-launch — but if so, that needs to be an *explicit* decision, not implicit drift. **Without Engine 2, launch is "the app works but feels self-contained." With Engine 2, launch is "the app reaches into your day."**

- [ ] **🔥 Cognitive Function Measurement — CORRECTED May 8: spec exists, Phase 0+1 implementation REVERTED May 7.** Updates the entry I added earlier today with verified context. `COGNITIVE_FUNCTION_MEASUREMENT_SPEC.md` (20K, Apr 30) — the spec itself. Phase 0 storage layer + Phase 1 UI were implemented May 7 as part of the Practice Signals batch (Builds #31-37, #46) then **REVERTED entirely on May 7 late session** due to multiple UX failures: AffectLabelingExercise rendered unconditionally on every screen, orphaned `)}` JSX text node visible, "Done" button non-functional, 9-chip vocabulary identical to existing app feel-state chips, hostile "0/12 — counted as not matched" UX on skip-all path, stimuli asked user to label hypothetical scenarios (not what affect labeling research measures). Storage key `stillform_function_checks` was removed from SYNC_KEYS in the revert (verified at `src/App.jsx:8349`). **Status now:** spec is good, the implementation approach was wrong. Needs a different design pass, not a re-attempt of the same code. Per `COGNITIVE_FUNCTION_MEASUREMENT_PHASE_1_AUDIT.md` (May 6) the Phase 1 decision audit exists but the implementation derived from it failed UX review. Re-design needed with the spec + audit + revert lessons in hand. **This was Arlin's chosen engagement mechanic (May 1, "Arlin chose #2"); it is currently neither shipped nor on a forward path.**

- [ ] **UI Flow walks recommended May 7, never done (added May 8 from audit).** `STILLFORM_UI_FLOW_AUDIT.md` (May 7) explicitly recommends 8 observation walks that haven't been done. These aren't code work — they're audits that may surface real issues:
  - First-run cold-open walk — clear localStorage, complete setup, audit calibration → first home arrival as a never-seen-before user
  - EOD surface walk — simulate post-6pm cold-open, audit the EOD card against four pillars (especially: precision over gentleness, invitation vs guilt trip)
  - AI failure → Self Mode handoff voice walk — read literal strings on offer card, auto-switch transition, recovery pill; compare against `SELF_MODE_REDESIGN_RESEARCH.md` Past Self / Present Self framing lock (May 7) — the offer card may pre-date the framing lock
  - Settings screen detail walk — sub-sections, edit affordances, voice consistency
  - Crisis Resources screen walk — sensitive surface, careful walk required before flagging anything
  - Pricing screen walk — Lemon Squeezy paywall live, separate concern
  - FAQ screen content walk — verify recent features covered (Settled chip, Cyclic Sighing, three-category data feed, engagement architecture surfaces)
  - Body Scan tool internal flow walk — acupressure sequence, pace toggles
  
  Each walk takes 15-30 minutes of attention to the actual surface. Findings go to master todo / punch list as discovered.

- [ ] **Tutorial completeness verification (added May 8 from audit).** Tutorial has 5 pages (Opening + Tutorial 1-4 of 4 — verified at `src/App.jsx:17888-17936`). Apr 9 conversation (Arlin direction): *"Update tutorial and make sure all features are covered and explained."* Status: never verified post late-Apr / May feature ships. Needs walk-through to confirm: Settled chip, Cyclic Sighing, three-category data feed, Mirror anchor, Practice Trend, ⓘ info modals, Self Mode, low-demand mode, Russell-grouped chip ordering, Plain-Language Neuroscience cards, ToolDebriefGate friction reduction — are any covered? Should they be? Or does the 5-page tutorial intentionally NOT cover all features and instead orient the user to the practice frame? (That's a real design call: feature-tour vs philosophy-orientation.)

- [ ] **FAQ completeness verification (added May 8 from audit).** FAQ has 29 questions verified at `src/App.jsx:20594+`. Apr 9 ship checklist: *"Update FAQ if it changes how something works."* Recent features that may not be covered: Settled chip definition, Cyclic Sighing, three-category data feed, Mirror anchor / stage system, Practice Trend, Russell circumplex framework, low-demand mode, Self Mode redesign (when shipped), engagement architecture roadmap. Audit pass needed.

- [ ] **Language picker UI half-built (added May 8 from audit).** Verified at `src/App.jsx:8349`: `stillform_language` storage key is in SYNC_KEYS (synced to Supabase on every save) but NO language picker UI exists in Settings. Storage is wired, surface is not. Since internationalization is post-launch (line 758), this is currently dead infrastructure. Two options:
  - Remove `stillform_language` from SYNC_KEYS until i18n actually ships (cleanest)
  - Leave the key in place as forward-compat for the post-launch i18n work (current state)
  
  Either is fine; flagging because dead-code drift is worth being honest about.

- [x] **"How much do you owe this guy?" footer text — VERIFIED NOT IN APP May 8.** Originally flagged in May 7 UI Flow Audit (#9) as "likely browser overlay, not app." Re-verified May 8: `grep -rn 'how much do you owe' .` across entire repo returns zero matches. Confirmed: this was a browser extension overlay or tracker-block message, not Stillform source. Closed.


**BLOCKED — pending hardware/access:**

- [ ] TestFlight build + tester invites — Apple Developer Program is paid, but BLOCKED on Arlin acquiring iPhone access for build testing. Pick up after Google Play track is established.

## 📡 CONTINGENCY — If App Doesn't Sell Itself Week 1

- [ ] Reddit launch post — r/ADHD, r/neurodivergent, r/anxiety, r/cptsd, r/BPD. Held in reserve, not a launch step. Only deploy if organic post-launch traction is weak.

---
## 📝 POST-LAUNCH — Noted, Not Blocking

- [x] **In-app "Manage Subscription" link in Settings — SHIPPED May 4, 2026.** Built during Termly ToS questionnaire walkthrough rather than deferred. New Netlify function `subscription-portal.js` calls Lemon Squeezy `/v1/customers/{id}` API with the user's `lemon_customer_id`, returns the signed `customer_portal` URL (Lemon Squeezy provides per-customer signed URLs valid ~24h, bypassing re-authentication). Settings → Account → Subscription card (when active) now has a "Manage subscription" button that opens the portal in a new tab. Users can cancel, update payment method, view receipts. Helper text below the button: "Opens the billing portal where you can cancel, update payment, or view receipts." Error handling for: not signed in, no subscription record (`lemon_customer_id` missing), Lemon Squeezy API failure, network error. **Requires `LEMON_SQUEEZY_API_KEY` env var on Netlify** (read-only API key sufficient — only GETs customer records). ToS questionnaire answer for cancellation now: "Through the Manage subscription button in Settings → Account, or by emailing araembersllc@proton.me."
- [ ] **User outcome check after 10 sessions (added May 2 — surfaced from old ideas sweep)** — one open-text question after a user's 10th session: "Has anything changed in how you show up?" Not a rating, not a score, free text. Becomes proof that execution matched intent. Small enough to spec into the existing post-session flow. Defer to post-launch since it requires real users completing 10 sessions.
- [x] **7-session review specificity verification — SUPERSEDED May 8, 2026 (added May 2 from old ideas sweep).** Verified by reading code on May 8: the existing post-7-sessions surface at `src/App.jsx:19899-19950` is conditional on `sessionCount === 7 && !milestone7Seen` and renders three variants (7-day streak / processing-type mismatch / default "you're building something"), NOT evidence callouts. The "specific evidence callouts" version was never a finalized spec — `RESEARCH_PREP_SELF_MODE_AND_EVIDENCE_CALLOUTS.md` lines 62-100 framed it as research questions, not commitments. The May 7 engagement architecture decision (line 226 of that doc, line 87 of `STILLFORM_ENGAGEMENT_ARCHITECTURE.md`) absorbed item 7 into Roadmap markers across stages with evidence-backed dose-response timelines — a different design now being built (Phase 1 Mirror surface shipped May 7-8 as commit `c673dac`/`25a9bfe`). The old milestone-7 surface is queued for retirement per engagement architecture line 239 ("generalized into Stage-1-crossing moment specifically"); it currently coexists with the new Mirror surface on home but should retire when Stage-1-crossing replacement ships in a later engagement architecture phase. Verdict: not a spec gap, not already-shipped-as-described — superseded by a different design that IS shipping now.
- [ ] **Research partnership outreach email (added May 2 — surfaced from old ideas sweep)** — email drafted for grad student / clinical psych researcher outreach per strategic roadmap. Locate the draft in archives or rewrite. Send when 4-6 weeks of post-launch user data accumulates.
- [ ] **KetaRevive doctor contact (added May 2 — surfaced from old ideas sweep)** — get name and contact. Ask if they'd try Stillform personally. The signal that started the B2B clinical thread. Captured in KETAREVIVE_ONEPAGER.md but the specific contact details aren't in any active list.

- [ ] **🔴 Android launcher icon — STILL DEFAULT CAPACITOR ROBOT (TestFlight/Play Store BLOCKING).** Surfaced Apr 9 2026, never resolved. Verified May 8: `android/app/src/main/res/mipmap-*` files are 1.8-4.3KB each — that's the default Capacitor green robot, not the Stillform amber S. Required for Play Store submission: full set of mipmap densities (mdpi 48px, hdpi 72px, xhdpi 96px, xxhdpi 144px, xxxhdpi 192px) + adaptive icon foreground/background pair. Web favicon (`public/favicon.ico` at 4448 bytes) is the custom amber S; native app does NOT inherit it. **This was a known issue for a month and never made it to master todo as a blocking item — exactly the doc-update failure pattern Arlin called out May 8.**

- [ ] **🔴 iOS launcher icon set incomplete (TestFlight BLOCKING).** Verified May 8: `ios/App/App/Assets.xcassets/AppIcon.appiconset/` contains only `AppIcon-512@2x.png` (1024x1024 source) + `Contents.json`. Full required size set missing: 20pt (40px @2x + 60px @3x), 29pt (58px @2x + 87px @3x), 40pt (80px @2x + 120px @3x), 60pt (120px @2x + 180px @3x for iPhone), 76pt (152px @2x for iPad), 83.5pt (167px @2x for iPad Pro). Without the full set, TestFlight submission may fall back to defaults or fail validation. Source 1024×1024 likely needs to be regenerated as the proper Stillform amber S on obsidian per the prestige-app icon decision documented Apr 9.

- [ ] **apple-touch-icon missing (web "Add to Home Screen" experience).** Verified May 8: `public/` has `favicon.ico` but no `apple-touch-icon.png`. iOS Safari "Add to Home Screen" falls back to a screenshot of the page instead of the custom amber S. Add 180×180 PNG to `public/apple-touch-icon.png` + `<link rel="apple-touch-icon">` to `index.html`.

- [ ] **Native integration validation pass on physical devices.** Built per repo (verified May 8 by file inventory) but launch-readiness state of each is unverified:
  - **Android home screen widget** — `android/app/src/main/java/com/araembers/stillform/StillformWidget.java` + `WidgetBridgePlugin.java` + `StillformWidgetReceiver.java` + `WidgetDataInterface.java` + `res/xml/widget_stillform_info.xml` + `res/layout/widget_stillform.xml` + `res/drawable/widget_background.xml`. Apr 4 + Apr 9 fixes shipped. Needs verification post-deploy on Galaxy Watch + Android phone — was the original timing-bug fix preserved through subsequent changes?
  - **Android share extension** — `ACTION_SEND` intent-filter live in `AndroidManifest.xml`. Per Apr 27 brief: routes to Reframe automatically after first-run completion. Needs phone-side test.
  - **Wear OS breathing companion** — `android/wear/` module exists with `build.gradle` + src. Per Apr 27 brief: *"phone WatchBridge + android/wear module. Haptic breathing pattern on the watch. Needs validation on paired device."* **Galaxy Watch Ultra haptic breathing companion has never been verified working post-build.** This is one of Arlin's stated priorities.
  - **Push notifications** — `@capacitor/push-notifications` ^8.0.3 in `package.json`. Daily reminder with user-configurable time. Wired to `scheduleReminder("Stillform", ...)` at line 21779. Needs end-to-end test on physical device.
  - **Haptics** — `@capacitor/haptics` ^8.0.2. Native impact + notification patterns. Needs verification.
  - **Biometric auth** — `@aparajita/capacitor-biometric-auth` ^10.0.0. Optional lock, off by default. Needs Face ID / fingerprint / Face Unlock test on physical device.
  - **Calendar integration** — surfaced in code (consent UI at line 22277, "Calendar access is revoked" messaging) but **no native Capacitor calendar plugin in `package.json`**. Implementation status unclear; per Apr 27 brief it's iOS-native + Android-unavailable. Needs investigation: is this real or a stub?
  - **Health integration** — surfaced in code (consent UI at line 22301, integration context wired to morning check-in + AI stack) but **no native Capacitor health plugin in `package.json`**. Per Apr 27 brief: iOS-native pending, Android in development. Needs investigation: is this real or a stub?

- [ ] **🟡 Home navigation header sizing/alignment (Arlin direction May 8).** Visual weight imbalance — header feels heavier than footer despite same wordmark font size:
  - Header: `nav-logo` 18px Cormorant Garamond, weight 300, full-bright `var(--text)` color + amber `form` accent, 24px×40px nav padding, prominent `Subscribe` primary CTA at 14px×28px button padding
  - Footer: `footer-logo` 18px Cormorant Garamond, weight 300, dimmed `var(--text-dim)` color, 32px×40px footer padding, only ghost-styled text links
  - Same font size both ends, but header reads as visually heavier because of bright color + prominent CTA.
  - Arlin's call: "header needs to be smaller... font needs to be smaller to compliment the footer"
  - Possible fixes (her judgment to pick): drop nav-logo to 15px or 16px (smaller than footer), soften nav-logo color toward `text-dim`, reduce Subscribe button padding, or reduce nav vertical padding. Not blocking but visible on every screen.

- [ ] **Internationalization — MOVED TO POST-LAUNCH May 8, 2026 (Arlin direction).** Original V1 launch set (English baseline + Spanish + Brazilian Portuguese + Armenian, decided Apr 27 after market analysis) is **deferred entirely** until post-launch revenue can fund clinical translation costs. V1 ships English-only.

  Cost reality is the binding constraint: AI prompts (~1,500 lines) need a specialist clinical translator, not generic — Porges polyvagal / Siegel window of tolerance / Ochsner & Gross suppression-vs-reappraisal must keep precision across languages. Generic translation services would compromise the science alignment that's core to the product.

  **Original committed launch set kept on file for post-launch sequencing:**
  - **Spanish** — 500M+ speakers, covers US Hispanic + Latin America. Strong clinical-translation tradition, abundant translator availability.
  - **Brazilian Portuguese** — fastest-growing wellness app market globally. 220M speakers. Translation infrastructure overlaps with Spanish.
  - **Armenian** — founder heritage (Arlin). Non-negotiable for the eventual rollout.
  - All four Latin script — no RTL engineering, no character-width layout issues.
  
  **Originally-deferred languages (still post-V2+):** German, French, Mandarin, Japanese, Korean, Hindi, Arabic — each with distinct deferral rationale (Mandarin needs WeChat + local hosting + regulatory work; Hindi needs country-specific pricing; Arabic needs RTL engineering across every screen; etc.).
  
  **Sequencing trigger:** revisit when post-launch revenue covers clinical translator + per-language QA review costs. Build path remains: (1) i18next install, (2) string extraction, (3) language picker in Settings, (4) AI prompt translation by clinical specialist, (5) per-language QA. Estimated as multi-session work with budget allocated when triggered.
  
  Crisis region routing (App.jsx line 9538) already handles locale-driven hotline routing.

- [x] **Service worker — VERIFIED RESOLVED May 8, 2026.** Master todo entry was stale on both premise and ask. Premise ("currently active SW unregistration on every page load") was made obsolete by commit `eb5b9e7` (May 7 18:00 UTC, "re-enable service worker — cache-versioned, network-first HTML"). That commit IS an ancestor of production `1bce7ed` (May 7 19:34 UTC) — already deployed, not in queue. The "decision needed: keep disabled or re-enable + cache invalidation" was answered: re-enabled with cache invalidation. Verified by reading `index.html:127-145` (active `navigator.serviceWorker.register('/sw.js')` with explanatory comment dating to May 7) and `public/sw.js` (183 lines, `CACHE_VERSION = "stillform-v1-2026-05-07"`, four-strategy cache plan: network-first HTML, cache-first hashed Vite bundles, network-only API, stale-while-revalidate static assets, skipWaiting + clientsClaim for upgrade behavior). Comments in both files document the rationale and transition path from the previous kill-switch SW.
- [x] **ARIA labels minimal across the app — VERIFIED SUBSTANTIALLY COVERED May 8, 2026.** Master todo entry's "only 6 aria-label / aria-labelledby / role= attributes across 14,680 lines" was stale (entry written when App.jsx was 14,680 lines; file now 22,953). Fresh count: 41 aria-label + 11 aria-pressed (chip selection state) + 8 role + 3 aria-expanded + 1 aria-selected + 2 aria-hidden + 0 aria-labelledby + 0 aria-describedby = 66 ARIA-related attributes. Master todo's named targets verified covered:
  - **Chips:** aria-pressed on selection state + visible text labels (Excited, Focused, etc.) — correct AT pattern; screen reader announces "Excited, pressed".
  - **Info buttons:** 13 of 14 `ⓘ` instances have `aria-label` (sample: line 6339 "Why the bio-filter?"; line 7204 dynamic `What does ${f.label} mean?`; line 11378 "Why Reframe with AI?"; line 14470 "Avg Shift"). The 1 exception at line 11446 is a non-interactive fallback `<span>` with `title=` attribute (no onClick, no role, no tabIndex — tooltip-only) — acceptable per WCAG.
  - **Tool entries:** Reframe modes ("Talk it through", "Break the loop", "Get ready"), Breathe ("Quick Reset", "Deep Regulate", "Cyclic Sighing"), Body Scan — all have visible text content as accessible name; no icon-only tool entries identified.
  - Sample additional coverage: line 12295 dynamic `${audioOn ? "Mute audio" : "Unmute audio"}`; line 11197 dynamic Reframe tone label; line 7046 SVG body map with descriptive label.
  
  **Residual review (post-launch work, NOT ship-blocking):** A full screen-reader audit on actual devices (VoiceOver iOS, TalkBack Android, NVDA desktop) would surface any remaining issues that static code review can't catch — focus order, dynamic content announcement, modal focus trap behavior. Code-side review surfaced no concrete gaps in the master todo's named target categories.
- [x] **IndexedDB device key cleared on delete-all-data — SHIPPED May 7, 2026 (verified May 8).** Master todo entry was stale. Verified by reading `src/App.jsx:22609-22621`: the delete-all flow already calls `CryptoStore.deleteKey()` + `SecureStore.clear()` via `Promise.all`, awaited so the reload sees a fully wiped storage tier. `CryptoStore.deleteKey()` (line 8722) drops the entire `stillform_keys` IndexedDB via `indexedDB.deleteDatabase(DB_NAME)`; never rejects so can't block the wipe path. `SecureStore.clear()` does the same for the overflow blob store. Implementation is more thorough than this entry originally specced (covers both device key AND overflow blobs). Forensic deletion completeness verified.
- [x] **AI prompt framing — "metacognition" — VERIFIED RESOLVED May 8, 2026.** May 2 CBT→MCT prompt rewrites are committed and in place. Verified by grep: `Wells 2009` + `metacognitive observation` + `detached mindfulness` framing present in all three system prompt openings — CALM at `netlify/functions/reframe.js:837`, CLARITY at `:962`, HYPE at `:1065` — plus QUALITY_RETRY_PROMPT at `:272` and the corpus citations at `:125-127`. The architectural truth ("metacognition tool that produces composure") is now operationalized in the prompts. No further weaving needed.
- [x] **AI prompt "not therapy" framing — VERIFIED RESOLVED May 8, 2026.** Master todo cited `reframe.js:904, 925, 998` as locations using negation framing ("NOT therapy homework," "not a therapy session"). Verified by grep: zero matches for `NOT therapy`, `not therapy`, `therapy homework`, `not a therapy session` anywhere in current `netlify/functions/reframe.js`. The May 2 prompt rewrites removed all such negation framing entirely. The "never define it by what it isn't" product principle is now honored at the prompt level.
- [ ] **"What Shifted" / State-to-Statement caption inconsistency — REFRAMED May 8, 2026.** Original claim (button labels "Add state to statement" / "Hide state to statement", section header "State-to-Statement (optional)") is STALE — those labels no longer exist anywhere in user-facing code. Verified by grep: `Add state to statement`, `Hide state to statement`, `State-to-Statement (optional)` all return zero matches. Toggle button now reads `"▸ What shifted? (optional)" / "▾ Hide"` (line 10948).

  **However a different real inconsistency exists in the same section that does need your call.** When the user expands the toggle, three contradictory framings appear:
  - Caption (line 10963): *"In one line — what shifted? Naming it locks in the shift. This is for you, not for sending."* (explicitly internal-only, NOT for sending)
  - Textarea placeholder (line 10968): *"Draft one clear message you can send now."* (explicitly external messaging)
  - Action buttons (line 10972-10981): Copy / Share / Mark sent (clearly external)

  The caption appears copy-pasted from the What Shifted (internal observation) flow but this expanded section is actually State-to-Statement (external message drafting). The variable name `externalAnchorDraft` confirms it.

  **Decision needed (yours, not Claude's):** is this section's purpose internal observation OR external messaging?
  - If **internal:** rename placeholder to something like *"What changed for you?"*, remove Copy/Share/Mark sent buttons, keep caption.
  - If **external:** keep textarea + buttons, rewrite caption to match (e.g., *"In one line — what do you want to say? Translating it into language reduces amygdala activation and locks the regulation in."*), consider renaming toggle button to make external intent clearer.

  Code-side fix is small either way once you call it. Flagging here rather than guessing.
- [ ] **Subscription URL param trust window** (`App.jsx:8869`). `?subscribed=true` URL param sets local subscribed=yes immediately on page load — server reconciliation happens via `sbCheckSubscriptionStatus` within ~20-min grace period. A bad actor could append the param and have full access until the grace window closes. Acceptable design (handles webhook lag) but worth flagging. Stronger fix: signed query param from Lemon Squeezy redirect.
- [x] **AI payload size cap — RESOLVED May 8, 2026 (verified May 8 fresh read).** Master todo entry line refs (5253–5340) were stale (App.jsx grew to 22933). The actual payload construction is at `src/App.jsx:9740–9981`. Per-field state verified by view tool at write time:
  - `priorModeContext` — capped May 7 (250 chars per message, last 4 messages, line 9944-9954)
  - `sessionNotes` — capped May 7 (200 chars per note, last 5 notes, line 9970-9979)
  - `journalContext` — **capped May 8 (this commit):** 200 chars per trigger text, todayManual now `slice(-10)` to match older entries (line 9740-9766)
  - `textHistoryContext` — **capped May 8 (this commit):** 250 chars per entry text in `buildUnifiedTextContext` formatting block (line 4842-4860 area). 20-entry cap was already present.
  - `signalProfile` — structurally bounded (chip-picker schema with limited fields)
  - `biasProfile` — structurally bounded (10 distortions max per user-memories)
  - `triggerProfile` — structurally bounded (`formatTriggerProfileForAI(8)` top-N=8)
  - `priorToolContext` — structurally bounded (single prior session)
  Estimated max user-text context payload after all caps: ~11,000 chars (~2,750 tokens). Heavy-user runaway prevented at all known unbounded sources. Synthetic test verifies all four truncation helpers (200/250/empty/boundary cases) — 13/13 pass.
- [ ] **useEffect cleanup audit** — 47 useEffects, 18 cleanup returns. Possible timer/listener leaks. Post-launch sweep, not urgent.
- [ ] **Chip touch target sizes** — currently ~28px tall, iOS HIG recommends 44px. Adult users won't notice; an accessibility audit would flag it.
- [ ] **DST manual test** — `getStillformToday()` uses local Date so it should handle DST correctly, but worth one manual test on a DST night to confirm date guards behave.
- [ ] **Cloud-corruption edge case for ErrorBoundary** — if corruption got synced up before error fires, `sbSyncDown` pulls it back. Cover via `backups` table restore (the three-table schema already includes pre-update backups). Not blocking — covers <5% of error scenarios.
- [ ] **GitHub PAT rotation** — scope `repo` only, 90-day expiry, revoke old. Low practical risk per Arlin (separate identity, no overlap with Claude account).

---

## NATIVE APP

- [ ] Android Studio setup — build signed APK
- [ ] Google Play Console — create account, fill store listing, upload APK, add 12 testers, start 14-day closed testing clock (Arlin has 5 Gmail addresses, needs 7 more)
- [ ] Xcode — archive, upload to App Store Connect
- [ ] TestFlight — invite testers
- [ ] **Native neuro voice (added May 2 — surfaced from old ideas sweep)** — Web Speech API on web shipped. Native voice synthesis on iOS/Android pending — closes the Safari gap and gives platform-quality voice. Not blocking launch but real return-loop value (simulated human contact per retention research).
- [ ] **Contextual push notification logic (added May 2 — surfaced from old ideas sweep)** — Notification infrastructure shipped via Capacitor. The *logic* for contextual nudges (smart, not spam) was never built. Open question: gated by something else (cognitive function measurement data?), or buildable now? Decision needed before deciding launch vs post-launch placement.
- [ ] **HRV / Health Connect / HealthKit integration (added May 2 — surfaced from old ideas sweep)** — continuous biometric signal flowing into Stillform's data layer. Heart rate, sleep, HRV. Listed as Layer 2 return-loop infrastructure in roadmap. Post-launch milestone — not blocking initial release but flagged here so it doesn't drop off the radar entirely.

---

## LAUNCH

- [ ] Master todo complete (this entire document, except translations and Apple Store sections)
- [ ] Google Play store approved — flip to public
- [ ] Apple Store: deferred (post-launch)
- [ ] Reddit post: not a launch step (contingency only — see Store Submission Path section)

