# MOVE CARD — LAYER 0.6 FLOW AUDIT

**Engagement Architecture · Engine 2 (Application Layer) · Build #8**
**Author: Claude · Reviewer: Arlin · Status: pending Arlin's review of open calls**
**Last updated: May 8, 2026 (post Phase 2 capture stack + Today's Brief audit)**

---

## What this doc is

A pre-code flow audit for Move card — *"single 30-90-second somatic move generated for the user's current state, available anywhere"* per `STILLFORM_ENGAGEMENT_ARCHITECTURE.md` §3.2 line 132-134.

Layer 0.6 work. No code in this commit. Same template as `TRIGGER_PROFILE_PHASE_2_FLOW_AUDIT.md` and `TODAYS_BRIEF_FLOW_AUDIT.md`. The audit's purpose is to surface and resolve the architectural choices that underspecified scope tends to hide — and Move card is materially more underspecified than Today's Brief because the spec gives no example output and the conceptual overlap with shipped surfaces (Quick Reset, Disruptor) needs a hard differentiation call.

---

## 1. Ground truth — facts this proposal is built on

### 1.1 The architectural source

`STILLFORM_ENGAGEMENT_ARCHITECTURE.md` §3.2 line 132-134, verbatim:

> **Move card.** Single 30-90-second somatic move generated for the user's current state, available anywhere (bathroom at work, car, between calls). Disruptor tool concept as a takeaway, not just at pattern-detection time.

That spec line gives:
- **Duration window:** 30-90 seconds (overlapping Quick Reset's 60s and Disruptor's 90s)
- **Adaptivity:** "generated for the user's current state" — not fixed
- **Placement:** "available anywhere" — implies a discoverable surface, not buried in a tool
- **Conceptual lineage:** Disruptor tool concept as a takeaway. Disruptor today fires only on pattern-detection (in-flow); Move card lifts the same mechanism but makes it user-summonable
- **Class:** somatic (body-first), per Disruptor's pathway

Spec ship order line 314: *"Move card | Stage definitions | 1-2 builds"*. Build #8 in the architecture sequence; depends on stage definitions but not on Today's Brief or Trigger Profile.

### 1.2 What's already shipped that overlaps

Three surfaces already live in the same conceptual neighborhood. Each is fixed (not generated), each lives in its own context. Move card is positioned as a synthesis, not a replacement.

| Surface | Duration | Generated? | Lives where | Use case |
|---|---|---|---|---|
| **Quick Reset** breathing | 60s | No (fixed phases) | Reframe, home Quick Breathe pill | Fast downregulation |
| **Cyclic Sighing** breathing | 300s (5min) | No (fixed) | Reframe breathing options | Studied downregulation (Balban 2023) |
| **Disruptor Tool** | ~90s | No (fixed 8 prompts mixing pressure/breath/temperature/posture) | Auto-fires on pattern detection inside Reframe | Loop interruption when AI detects a recurring pattern |

What Disruptor specifically gives Move card:
- The 8-prompt somatic vocabulary (`SOMATIC_PROMPTS` array at `src/disruptor/DisruptorTool.jsx:30-39`) is already locked science: Sokolov orienting response + Porges/Levine somatic anchoring
- Persistence layer (`stillform_disruptor_sessions` array, `DISRUPTOR_SESSIONS_KEY`) already exists with `appendDisruptorSession`, `getDisruptorSessionsFromStorage`
- Self-initiated path is already supported: `patternId === null` means user hit Disruptor not via pattern detection (verified at `[Stillform code]`)

That last point matters. There's already an "available anywhere" path into Disruptor — Arlin shipped it. So part of what Move card is asking for already exists. The novel piece is the **GENERATION** — selecting/composing prompts based on user state — and the **DISCOVERABILITY** ("available anywhere" surface, currently Disruptor self-initiated entry is buried).

### 1.3 The "Next Move" naming clash (worth surfacing early)

`postNextMoveId` and `NEXT_MOVE_ACTION_LABELS` in the Reframe close flow refer to a DIFFERENT "next move" — an external action the user commits to taking after a session (e.g., "send the email," "talk to my manager"). That's an external behavioral commitment, not a somatic move.

Move card is somatic. Different concept. The naming collision will create confusion in the codebase if not handled. Audit recommends `MoveCardTool` / `moveCardSession` / `stillform_move_card_history` — explicit "card" suffix everywhere — to keep the two concepts non-colliding.

### 1.4 The current state inputs Move card would consume

All shipped, all readable.

| Input | Source | Why it matters for move generation |
|---|---|---|
| Bio-filter | `getActiveBioFilter()` | Activated states (high arousal) → downregulation moves; depleted states → gentle re-energizing |
| Feel-state | `secureRead("stillform_feelstate")` | Current chip (angry / anxious / flat / etc.) drives move category |
| Signal profile | `stillform_signal_profile` | User's known body-area activation pattern (jaw / chest / shoulders) — moves can target it |
| Recent practice | last few entries from `getSessionsFromStorage()` | Avoid prescribing the move they just did 10 minutes ago |
| Stage | `getCurrentStage()` | Stage 1 user gets simpler / shorter; Stage 4+ user gets more nuanced moves |
| Time of day | derived | Morning vs evening shifts the somatic palette (no caffeine analogues, etc.) |
| Trigger Profile (Phase 2) | `getTriggerProfile()` | If user opens Move card 30 minutes before a known trigger event, anticipatory move palette differs from neutral |

The intersection with calendar (anticipatory regulation before a known meeting) is real, but per Build #7 (Pre-event Brief) that's a separate scoped surface. Move card stays state-driven; calendar-driven anticipatory work is Pre-event Brief's job.

### 1.5 AI cost / generation pattern question

Move card is positioned as on-demand. If a user opens it 5 times a day at $0.003 per call, that's $0.015/day per active user — modest in absolute terms but additive to the EOD artifact + Today's Brief + Reframe load already in scope.

The audit raises but does not resolve: is "generated for the user's current state" actually AI-generated content (novel prompt text composed each call) or AI-SELECTED content (a prompt sequence picked from a library based on state)? Both are "generated for current state" linguistically. The cost and quality profiles are very different.

This is one of the open calls in §6.

---

## 2. The architectural choice this audit must make

The audit identifies three viable mechanism architectures, parallel to the A/B/C structure in Phase 2 and Today's Brief audits.

### Option A: AI-composed novel prompts per call

Each Move card invocation calls a Netlify function that composes 3-5 novel somatic prompts based on current state. Output is fresh each time. Voice variety, contextual fit, can reference user's known signal areas verbatim ("press your jaw — the place that holds it for you").

- **Pros:** Highest contextual fit. Most "operator-tier personal." Reuses existing AI infrastructure. The "generated" word in the spec reads literally.
- **Cons:** AI cost on every invocation. AI failure = no move (no fallback the operator-tier voice rubric allows). Risk of AI generating prompts that aren't somatically sound (the locked science in PATTERN_DISRUPTION_SPEC §4.2 was hand-verified; AI-generated may drift from it).
- **Failure mode:** AI 500s → no card. Acceptable per other artifact patterns (EOD artifact, Today's Brief), but Move card is meant to be in-the-moment relief — failure cost is higher than for an EOD vocabulary entry.

### Option B: AI-selected from a curated library

A library of ~20-40 hand-written somatic prompt sequences (each 30-90s, each tagged with state fitness). Move card invocation calls AI (or a deterministic rule) to PICK the best-fit sequence for current state. The prompts themselves are stable; selection is the adaptive layer.

- **Pros:** Locked-science prompts always (curated). Fast (no AI generation latency). Low cost per call. Fallback story is clean — if AI fails, deterministic fallback to "best-fit by feel-state alone" still ships a reasonable card. Easier to audit science compliance because every sequence is hand-reviewed.
- **Cons:** Less personal. Can repeat sequences. Library upkeep is its own ongoing work. "Generated" reads less true literally — but the spec line is loose enough to accommodate this reading.
- **Failure mode:** AI 500s → deterministic fallback selects from library by feel-state — Move card still fires. Substantially better failure surface than Option A.

### Option C: Deterministic rule-based selection from library

No AI at all. Move card Database + a state-to-sequence mapping rule. State chip + bio-filter + signal area determine the sequence. Pure code.

- **Pros:** Free at the margin (no API). Fully deterministic. Predictable. Auditable. No latency. No failure mode. Library upkeep is the only ongoing work.
- **Cons:** Loses the "generated for the user's current state" personalization the spec calls for. Risk of repeated sequences feeling stale. Doesn't ladder up to the AI-personalization story Stillform's pricing implies.
- **Failure mode:** None — there's no async dependency.

### Audit recommendation: **Option B (AI-selected from curated library, deterministic fallback)**

Reasoning:
1. **Locked-science fidelity.** Move card is a clinical-adjacent surface (somatic regulation). The PATTERN_DISRUPTION_SPEC explicitly grounded the Disruptor's prompts in Sokolov + Porges + Levine. AI composing somatic prompts on the fly risks drifting from that science. A curated library keeps every prompt sequence reviewable and audit-aligned.
2. **In-the-moment surface needs reliability.** Move card fires when the user is reaching for something — bathroom at work, between calls. AI failure that leaves the user with nothing is a worse experience than EOD artifact silence (an artifact is reflection; Move card is intervention). Option A's failure mode is too punishing for this surface class.
3. **AI is still in the loop.** Selection from a library by AI gives the personalization Stillform's positioning implies. The user's experience is "this fits me right now" — same felt experience as Option A — without Option A's brittleness.
4. **Library is a one-time write.** ~30 sequences hand-authored once. Future additions are additive, never blocking. Maintenance is closer to data work than code work.
5. **Deterministic fallback for AI-down state preserves the value.** Per Self Mode's posture (`SELF_MODE_REDESIGN_RESEARCH.md` line 3), the product should function when AI is unavailable. Option B is the only one that does so without abandoning personalization entirely.

Hybrid leaning: ship Option B, but keep the library design pluggable so a future Option A "compose if state is novel" augmentation could be layered on. The library is the foundation; AI-composition could grow from there without needing rearchitecture.

---

## 3. The proposed surface set

Six distinct surfaces. Numbered by ship priority.

### 8a. Move card Database (foundation)

A new module `src/move-card/database.js` (or inline in the Stillform frontend alongside existing breathing pattern arrays). Each entry:

```
{
  id: "ground-and-soften-jaw-90s",
  durationMs: 90000,
  prompts: [
    { text: "...", durationMs: 8000, kind: "pressure" },
    ...
  ],
  fitness: {
    feelStates: ["angry", "anxious", "stuck"],
    bioFilters: ["activated", "clear"],
    signalAreas: ["jaw", "neck"],
    timeOfDay: "any" // or "morning" | "evening"
  },
  pathway: "somatic-redirection",
  scienceTags: ["sokolov-orienting", "porges-vagal", "levine-somatic"]
}
```

Initial library size: ~25-30 sequences covering the cross product of 4 feel-state buckets × 3 bio-filter buckets × major signal areas. Less than that risks repetition; more than that is YAGNI.

**Open call:** library size and authoring source. Audit recommends Arlin and Claude pair-author the initial library against PATTERN_DISRUPTION_SPEC §4.2 mechanisms — same approach that produced the original 8 Disruptor prompts. Keeps science fidelity high.

### 8b. Move card selection logic (the AI/deterministic call)

A function that takes current state + library and returns the chosen sequence ID.

Two paths in one function:
1. **AI path (default):** POST to `/.netlify/functions/move-card-select` with `{state, recentMoveIds}`. Backend reads the library (server-bundled), picks best fit, returns `{sequenceId, reason}`.
2. **Fallback path:** if AI is unavailable or call fails, deterministic local selection: filter library by feel-state match → narrow by bio-filter match → exclude `recentMoveIds` (last 3) → random pick from remaining.

The AI side reads the library; client never sends prompt text up. This matters: it means the library can be edited server-side without app updates and the AI's view of it stays current.

### 8c. Move card runner UI (executes the selected sequence)

Reuses DisruptorTool's prompt-runner pattern. The new component `<MoveCardTool sequence={...} onComplete onClose />` differs from DisruptorTool only in:
- Source of prompts (passed in vs hardcoded)
- Storage key on completion (`stillform_move_card_history` vs `stillform_disruptor_sessions`)
- Telemetry events (`Move Card Completed` vs Disruptor events)

Same auto-advance, same beat-driven timing, same intro/running/reflection 3-phase state machine. Audit recommends a careful refactor: extract a shared `<SomaticPromptRunner />` from DisruptorTool that both DisruptorTool and MoveCardTool consume. Reduces drift, single source of timing-and-display logic.

### 8d. Discoverability surface ("available anywhere")

The spec's "available anywhere" line is the architecturally hard part. Three placement options the audit recommends Arlin choose between:

- **8d-A:** Floating Quick Action button near the existing Quick Breathe pill (which is also "available anywhere"). Tap → Move card runs.
- **8d-B:** Tile on the home screen alongside other tools.
- **8d-C:** Long-press gesture on the existing Quick Breathe pill — gives users a "Quick Breathe vs. Quick Move" choice without adding a new visible surface.

Audit recommendation: **8d-A** (separate floating affordance). Reasoning: Quick Breathe is already known to users; adding modes to it via long-press is a discoverability fail. A separate pill keeps the affordance findable. Position: lower-right opposite Quick Breathe's lower-left, or stacked above it. Same draggable-with-position-persistence treatment Quick Breathe already has.

### 8e. Move card history & re-do

Persistent history: `stillform_move_card_history` (SECURE_KEYS, SYNC_KEYS, `keysToRemove`). 90-item trim parallel to other history surfaces. Each entry: `{id, timestamp, sequenceId, durationMs, completed, sourceState}`.

A "do that one again" affordance from the most recent move (in the runner's reflection screen, or as a Quick Action shortcut) gives users the takeaway character the spec calls for ("Disruptor as a takeaway, not just at pattern-detection time"). Audit recommends shipping this in 8e — it's what makes Move card a takeaway rather than just an in-app tool.

### 8f. Telemetry parity with Disruptor

Plausible events mirroring Disruptor:
- `Move Card Opened` (with surface prop: pill / home-tile / re-do)
- `Move Card Completed` (with sequenceId in props for which sequences land)
- `Move Card Abandoned` (with elapsedMs to see where users drop)
- `Move Card Repeated` (when user picks "do that one again")

This data feeds future library curation — sequences that get abandoned often get revised; sequences that get repeated often get amplified.

---

## 4. AI integration check (Layer 1.2 — science alignment)

Per audit philosophy Layer 1.2, every new AI surface needs explicit alignment to the science the product claims.

The somatic mechanisms Move card builds on (inherited from `PATTERN_DISRUPTION_SPEC.md` §4.2):
- **Sokolov orienting response (1963):** novel stimulus captures attention, breaking the loop. Move card prompts should include at least one novel element per sequence (a temperature notice, an unexpected pressure, a posture shift).
- **Porges polyvagal theory:** vagal-tone-engaging moves (long exhales, jaw release, gentle gaze shifts) downregulate sympathetic activation.
- **Levine somatic experiencing:** completing a thwarted fight/flight impulse via discharge moves (full exhale, body tension-and-release).
- **Implementation intentions (Gollwitzer 1999):** the user's choice to OPEN Move card is itself a pre-committed regulation move ("if state X, then 60-second move") — the surface acts on a pre-committed implementation intention rather than asking for one.

The library curation (8a) is where this science check happens. Each sequence should be tagged with which mechanism it primarily targets. Sequences that don't ladder up to one of the four named mechanisms don't ship.

The AI-selection layer (8b) does NOT touch the prompts themselves — it picks among hand-verified sequences. So AI drift from the science is structurally prevented.

**Open call:** science review of the initial library. Audit recommends Arlin walks through the library before 8a ships, same way Phase 1 Trigger Profile category list was Arlin-locked before code.

---

## 5. What this audit does NOT propose

Boundaries the audit explicitly holds:

1. **No replacement of Disruptor or Quick Reset.** Both stay where they are. Disruptor stays pattern-detection-triggered. Quick Reset stays a fixed 60s breath option. Move card is additive.
2. **No AI-composed novel prompt text.** Locked science fidelity wins per Option B. Future Option A augmentation is possible but not in Build #8.
3. **No calendar-driven Move card.** Anticipatory move-by-event is Build #7 (Pre-event Brief) territory.
4. **No multi-move sequences in one card.** Each card = one sequence. If user wants more, they re-open.
5. **No share / export / shareable card.** Same posture as other Engine 2 surfaces — design call after real usage data.
6. **No push notification fire of Move card.** It's user-summoned. Push surfaces are their own scope.
7. **No "rate this move" feedback loop in Build #8.** Library-curation telemetry is the feedback signal; explicit rating is friction Move card doesn't need.

---

## 6. Open calls for Arlin to make

The audit cannot resolve these.

1. **Architectural choice (§2): A vs B vs C.** Audit defaults to B (AI-selected from curated library, deterministic fallback). Arlin override: any of A / C / hybrid.

2. **Library size & authoring (§3 / 8a).** Audit defaults to ~25-30 sequences, Arlin + Claude pair-authored against PATTERN_DISRUPTION_SPEC §4.2 mechanisms. Arlin override: smaller library / different authoring path / external clinical reviewer.

3. **Discoverability surface (§3 / 8d): A vs B vs C.** Audit defaults to 8d-A (separate floating pill). Arlin override: home tile / long-press gesture / different surface entirely.

4. **Naming.** Audit defaults to `MoveCardTool`, `stillform_move_card_history`, etc. — explicit "card" suffix to avoid Next-Move collision. Arlin override: rename to "Quick Move" / "Somatic Move" / something else if "Move card" reads off in production copy.

5. **Library science review timing.** Audit recommends review before 8a ships. Arlin override: trust the audit + ship, review post-deploy.

6. **Re-do affordance scope (§3 / 8e).** Audit recommends shipping in 8e per the "takeaway" framing. Arlin override: defer re-do until usage shows demand.

7. **AI cost guardrail.** Each Move card open hits the selection function. Should there be a per-day cap (e.g., max 10 selections per user per day, beyond that fall to deterministic only)? Audit recommends NO cap initially — usage data tells us if caps are needed. Arlin override: bake in a guardrail.

8. **Disruptor integration.** Should opening Move card from inside a pattern-detected Disruptor flow be allowed (i.e., user already in Disruptor wants a different sequence)? Audit recommends NO — Disruptor's locked sequence is its specific clinical mechanism; intra-Disruptor swap muddies that. Arlin override: yes, let users pivot.

---

## 7. Build scope if audit defaults are accepted

Per `STILLFORM_ENGAGEMENT_ARCHITECTURE.md` ship order line 314 ("1-2 builds").

| Phase | Scope | Approx diff size |
|---|---|---|
| 8a | Move card Database + science-tagged sequences | ~250 lines (data-heavy) |
| 8b | Selection function (Netlify + deterministic fallback) | ~180 lines (60 client + 120 backend) |
| 8c | `<MoveCardTool>` runner + extracted shared `<SomaticPromptRunner>` from Disruptor | ~150 lines net (refactor + new component) |
| 8d | Discoverability pill on home with draggable persistence | ~120 lines |
| 8e | History storage + re-do affordance | ~80 lines |
| 8f | Telemetry events | ~20 lines |

Total: ~800 lines across 6 commits, single session if Arlin's tap-through reviews keep up. Larger than Today's Brief's ~500 line scope; smaller than Phase 2's full arc.

**Recommended ship order:** 8a (library) → 8b (selection) → 8c (runner refactor) → 8d (discoverability) → 8e (history) → 8f (telemetry). Foundation-first. The runner refactor (8c) is the riskiest piece — pulling shared logic out of DisruptorTool that's already shipped and stable. It needs careful regression-testing against existing Disruptor flows before 8d places the new pill.

---

## 8. Audit philosophy compliance check

This doc complies with `STILLFORM_AUDIT_PHILOSOPHY.md`:

- **Layer 0:** Read engagement architecture §3.2 line 132-134, ship order line 314, PATTERN_DISRUPTION_SPEC §4.2, DisruptorTool source, breathing pattern arrays, signal/feel-state plumbing, Trigger Profile audits as precedent — all read.
- **Layer 0.6:** This is the audit; no code in this commit.
- **Layer 1.0:** Every claim in §1 has a file/line citation.
- **Layer 1.1:** N/A (no edits).
- **Layer 1.2:** §4 ties library curation to four cited mechanisms.
- **Layer 6.1:** §2 makes a recommendation. §6 lists open calls Arlin must answer. No false neutrality.
- **Layer 6.7:** Doc-only commit. Diff is one new file.
- **Operating Rule 5:** Master todo entry will be added to this commit.

---

## 9. What ships next once Arlin reviews

If Arlin accepts the audit defaults wholesale, implementation proceeds 8a → 8b → 8c → 8d → 8e → 8f, six commits in sequence (load-bearing first).

If Arlin overrides any default in §6, the audit is updated in place. The biggest scope-shift override would be Option A (AI-composed novel prompts) — that would change 8a from a hand-curated library to a "library template + AI completion" architecture. The audit would be revised to walk through that path before code.

Move card is independent of Today's Brief audit's open calls. Either build can ship first depending on Arlin's preference.


## 10. Pair-authored sequence Database — preserved content

**Status:** 22 pair-authored Move card sequences (10 from May 8 + 12 from May 14 coverage-gap fill) preserved here as locked content for the Phase 6 Stillform Move card build. This content originated as `src/move-card/library.js` in the prior frontend implementation; that file was deleted with the rest of the prior frontend code, but its content is the work product of an Arlin + Claude pair-author session against `PATTERN_DISRUPTION_SPEC.md` §4.2 mechanisms and represents real cognitive work that should not be lost. When Phase 6 builds Move card, this is the foundation Database.

**Naming note for Phase 6 rebuild:** The preserved code below uses the constant name `MOVE_CARD_LIBRARY` and the file name `library.js`, reflecting the original naming at the time of authoring. When Phase 6 rebuilds, **rename to `MOVE_CARD_DATABASE`** (file: `src/move-card/database.js`) to disambiguate from the user-facing **User-Invented Move Library** specced in `REFRAME_UI_FOUNDATION_SPEC.md`. The two are distinct: this Database is the AI-side curated source of pair-authored sequences; the User-Invented Move Library is the user-facing surface where users save moves they invent. Conflating them in code or copy would confuse both layers.

**What's locked here vs what's revisable:** The 22 sequences (prompts, durations, prompt kinds, fitness taxonomy, science tags) are locked — they were pair-authored against locked science. The helper functions at the bottom (`getSequenceById`, `selectByDeterministicRule`) document a deterministic-fallback selection pattern that Phase 6 may keep or adapt; the audit's §3b backend selection function and §2 architectural recommendation (Option B: AI-selected from Database, deterministic fallback) still stand as the architecture.

**Voice note from the source file:** "prestige-operator declarative. Same as Disruptor. Second person imperative is fine here because these are bodily instructions, not advice. 'Press your feet flat' not 'you might want to try pressing your feet flat.'"

**Science spine the library operationalizes** (from the source-file header):
- Sokolov 1963: orienting response — novel stimulus captures attention, breaking the loop
- Porges polyvagal theory: vagal-tone-engaging moves downregulate sympathetic activation (long exhales, jaw release, soft gaze)
- Levine somatic experiencing: completing thwarted fight/flight via discharge moves (full exhale, tension-and-release, titration)
- Gollwitzer 1999 implementation intentions: "if X then Y" moves pre-committed reduce execution cost under load

**Fitness taxonomy** (preserved from source):
- `feelStates` — angry / anxious / stuck / flat / mixed / clear / focused
- `bioFilters` — activated / depleted / clear / hormonal / pain / sleep-deprived
- `signalAreas` — jaw / neck / chest / shoulders / stomach / hands / general
- `timeOfDay` — morning / midday / evening / any

**Prompt kind vocabulary** (preserved from source, matches `DisruptorTool.jsx` pattern):
- `pressure` | `breath` | `temperature` | `posture` | `attention`

**Coverage gaps the May 14 additions filled** (each gap → sequence number):
- hands signalArea uncovered → #11 hands-grip-release-45s
- stomach signalArea undercovered → #12 gut-soothe-anxious-60s
- pain bioFilter only general-covered → #13 pain-aware-breath-90s
- hormonal bioFilter only general-covered → #14 hormonal-soft-90s
- angry feelState without sharing slot → #15 anger-discharge-60s
- stuck without somatic anchor option → #16 cognitive-anchor-stuck-60s
- focused state with no sharpening variant → #17 focused-sharpening-45s
- evening timeOfDay uncovered → #18 late-night-winddown-90s
- morning timeOfDay uncovered → #19 morning-prime-45s
- no public-space discreet variant → #20 discreet-public-60s
- PATTERN_DISRUPTION_SPEC §4.2 names "counter-rhythm breath" but no sequence enacted it → #21 counter-rhythm-breath-60s
- shoulders signalArea covered only via stacking → #22 shoulders-deep-yoke-60s

### The Database — full preserved content

```javascript
// Move Card Library — Engagement Architecture Engine 2, Build #8 Phase 8a
// Per MOVE_CARD_FLOW_AUDIT.md (May 8) §3a default + §6 call 2 (Arlin + Claude
// pair-author against PATTERN_DISRUPTION_SPEC §4.2 mechanisms).
//
// STATUS: DRAFT LIBRARY. 22 sequences (10 shipped May 8 Phase 8a + 12 added
// May 14 to fill identified coverage gaps). Audit recommends 25-30 in
// production; this draft is within the target band. Arlin reviews each
// sequence against PATTERN_DISRUPTION_SPEC §4.2 before Move card surfaces
// ship to deploy. Each sequence is hand-tagged with the primary science
// mechanism it operationalizes — same locked science PATTERN_DISRUPTION_SPEC
// §4.2 grounds Disruptor in:
//   - Sokolov 1963: orienting response (novel stimulus captures attention,
//     breaking the loop)
//   - Porges polyvagal theory: vagal-tone-engaging moves downregulate
//     sympathetic activation (long exhales, jaw release, soft gaze)
//   - Levine somatic experiencing: completing thwarted fight/flight via
//     discharge moves (full exhale, tension-and-release, titration)
//   - Gollwitzer 1999 implementation intentions: "if X then Y" moves
//     pre-committed reduce execution cost under load
//
// COVERAGE GAPS THE MAY 14 ADDITIONS FILL (each gap → sequence number):
//   - hands signalArea uncovered → #11 hands-grip-release-45s
//   - stomach signalArea undercovered → #12 gut-soothe-anxious-60s
//   - pain bioFilter only general-covered → #13 pain-aware-breath-90s
//   - hormonal bioFilter only general-covered → #14 hormonal-soft-90s
//   - angry feelState without sharing slot → #15 anger-discharge-60s
//   - stuck without somatic anchor option → #16 cognitive-anchor-stuck-60s
//   - focused state with no sharpening variant → #17 focused-sharpening-45s
//   - evening timeOfDay uncovered → #18 late-night-winddown-90s
//   - morning timeOfDay uncovered → #19 morning-prime-45s
//   - no public-space discreet variant → #20 discreet-public-60s
//   - PATTERN_DISRUPTION_SPEC §4.2 names "counter-rhythm breath" but no
//     sequence enacted it → #21 counter-rhythm-breath-60s
//   - shoulders signalArea covered only via stacking → #22 shoulders-deep-yoke-60s
//
// FITNESS TAXONOMY (used by selection function below + AI selector backend):
//   feelStates  — angry / anxious / stuck / flat / mixed / clear / focused
//   bioFilters  — activated / depleted / clear / hormonal / pain / sleep-deprived
//   signalAreas — jaw / neck / chest / shoulders / stomach / hands / general
//   timeOfDay   — morning / midday / evening / any
//
// PROMPT KIND VOCABULARY (matches DisruptorTool.jsx):
//   pressure | breath | temperature | posture | attention
//
// VOICE: prestige-operator declarative. Same as Disruptor. Second person
// imperative is fine here because these are bodily instructions, not advice.
// "Press your feet flat" not "you might want to try pressing your feet flat."

export const MOVE_CARD_LIBRARY = [
  // ─── 1. Activated + jaw signal — Porges vagal jaw release ─────────────
  {
    id: "jaw-release-vagal-60s",
    durationMs: 60000,
    prompts: [
      { text: "Let your jaw open slightly. Tongue rests on the floor of your mouth.", durationMs: 12000, kind: "posture" },
      { text: "Slow inhale through your nose.", durationMs: 8000, kind: "breath" },
      { text: "Long exhale through your mouth. All the way out.", durationMs: 14000, kind: "breath" },
      { text: "Soften your face. Let the muscles around your eyes go.", durationMs: 12000, kind: "posture" },
      { text: "One more long exhale. Slower than the inhale before it.", durationMs: 14000, kind: "breath" }
    ],
    fitness: {
      feelStates: ["angry", "anxious", "mixed"],
      bioFilters: ["activated", "clear"],
      signalAreas: ["jaw", "neck", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["porges-vagal", "levine-somatic"]
  },

  // ─── 2. Activated + chest signal — long exhale focus ─────────────────
  {
    id: "long-exhale-chest-60s",
    durationMs: 60000,
    prompts: [
      { text: "Drop your shoulders. Let them fall.", durationMs: 8000, kind: "posture" },
      { text: "Inhale slowly through your nose. Count to four.", durationMs: 10000, kind: "breath" },
      { text: "Exhale through pursed lips. Count to eight. Let it all out.", durationMs: 14000, kind: "breath" },
      { text: "Notice your chest. The pressure changes between inhale and exhale.", durationMs: 12000, kind: "attention" },
      { text: "One more cycle. Inhale four, exhale eight.", durationMs: 16000, kind: "breath" }
    ],
    fitness: {
      feelStates: ["anxious", "angry", "mixed"],
      bioFilters: ["activated"],
      signalAreas: ["chest", "shoulders", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["porges-vagal", "levine-somatic"]
  },

  // ─── 3. Anxious + general — orienting + grounding ────────────────────
  {
    id: "orient-and-ground-90s",
    durationMs: 90000,
    prompts: [
      { text: "Open your eyes wide. Take in the whole room.", durationMs: 12000, kind: "attention" },
      { text: "Find five things you can see. Name each one in your head.", durationMs: 18000, kind: "attention" },
      { text: "Press your feet flat into the floor.", durationMs: 12000, kind: "pressure" },
      { text: "Notice the temperature where your skin meets the air.", durationMs: 14000, kind: "temperature" },
      { text: "Long exhale. Drop your shoulders.", durationMs: 12000, kind: "breath" },
      { text: "One more thing you can see. Just one.", durationMs: 12000, kind: "attention" },
      { text: "You're here. You're in the room.", durationMs: 10000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["anxious", "mixed"],
      bioFilters: ["activated", "sleep-deprived", "clear"],
      signalAreas: ["chest", "stomach", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["sokolov-orienting", "levine-somatic"]
  },

  // ─── 4. Stuck / flat + general — activation move ─────────────────────
  {
    id: "activate-from-flat-60s",
    durationMs: 60000,
    prompts: [
      { text: "Stand up if you're sitting. Sit up straight if you can't stand.", durationMs: 8000, kind: "posture" },
      { text: "Roll your shoulders back three times. Slow.", durationMs: 10000, kind: "posture" },
      { text: "Press your hands together for five seconds.", durationMs: 8000, kind: "pressure" },
      { text: "Quick inhale through the nose. Two short ones.", durationMs: 8000, kind: "breath" },
      { text: "Slow exhale through the mouth.", durationMs: 12000, kind: "breath" },
      { text: "Notice anything sharper now than thirty seconds ago.", durationMs: 14000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["flat", "stuck"],
      bioFilters: ["depleted", "clear"],
      signalAreas: ["general", "shoulders"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["sokolov-orienting"]
  },

  // ─── 5. Depleted + steady — gentle re-up without push ────────────────
  {
    id: "gentle-titration-depleted-60s",
    durationMs: 60000,
    prompts: [
      { text: "Sit somewhere supported. Let the chair hold you.", durationMs: 12000, kind: "posture" },
      { text: "Slow inhale. Soft, not big.", durationMs: 10000, kind: "breath" },
      { text: "Slow exhale. Longer than the inhale.", durationMs: 12000, kind: "breath" },
      { text: "Notice one place in your body that feels okay. Just one.", durationMs: 14000, kind: "attention" },
      { text: "Stay there for three breaths.", durationMs: 12000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["flat", "stuck", "mixed", "clear"],
      bioFilters: ["depleted", "sleep-deprived", "hormonal", "pain"],
      signalAreas: ["general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["levine-somatic", "porges-vagal"]
  },

  // ─── 6. Quick downregulate — fastest path (~30s) ─────────────────────
  {
    id: "quick-downregulate-30s",
    durationMs: 30000,
    prompts: [
      { text: "Two short inhales through the nose.", durationMs: 6000, kind: "breath" },
      { text: "One long exhale through the mouth. Slow.", durationMs: 12000, kind: "breath" },
      { text: "Drop your shoulders.", durationMs: 6000, kind: "posture" },
      { text: "One more cycle. Two in, one long out.", durationMs: 6000, kind: "breath" }
    ],
    fitness: {
      feelStates: ["angry", "anxious", "mixed", "stuck"],
      bioFilters: ["activated", "clear"],
      signalAreas: ["chest", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["porges-vagal"]
  },

  // ─── 7. Pre-event prep — implementation intention reset ──────────────
  {
    id: "pre-event-reset-60s",
    durationMs: 60000,
    prompts: [
      { text: "Press your feet flat. Both at once.", durationMs: 10000, kind: "pressure" },
      { text: "One long exhale. Empty your chest.", durationMs: 12000, kind: "breath" },
      { text: "Roll your shoulders back. Hold them open.", durationMs: 10000, kind: "posture" },
      { text: "Slow inhale. Slow exhale longer.", durationMs: 14000, kind: "breath" },
      { text: "You're ready. Walk in slow.", durationMs: 14000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["focused", "anxious", "mixed", "clear"],
      bioFilters: ["clear", "activated"],
      signalAreas: ["chest", "shoulders", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["gollwitzer-implementation", "porges-vagal"]
  },

  // ─── 8. Post-event recovery — completion of discharge ────────────────
  {
    id: "post-event-discharge-90s",
    durationMs: 90000,
    prompts: [
      { text: "Shake out your hands. Let them go loose.", durationMs: 10000, kind: "posture" },
      { text: "Roll your neck slowly side to side.", durationMs: 14000, kind: "posture" },
      { text: "One long exhale. All the way out.", durationMs: 14000, kind: "breath" },
      { text: "Notice where you held tension during the thing. Don't fix it. Just notice.", durationMs: 14000, kind: "attention" },
      { text: "Another long exhale. Slower.", durationMs: 14000, kind: "breath" },
      { text: "Let your jaw open slightly.", durationMs: 12000, kind: "posture" },
      { text: "It's over. You're back.", durationMs: 12000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["mixed", "stuck", "flat", "clear"],
      bioFilters: ["activated", "depleted", "clear"],
      signalAreas: ["jaw", "shoulders", "neck", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["levine-somatic", "porges-vagal"]
  },

  // ─── 9. Foggy / cognitive load — orienting + breath ──────────────────
  {
    id: "fog-clear-orienting-60s",
    durationMs: 60000,
    prompts: [
      { text: "Look up. Find a point on the ceiling or sky.", durationMs: 10000, kind: "attention" },
      { text: "Track your eyes slowly to the left. Then back.", durationMs: 14000, kind: "attention" },
      { text: "Track slowly to the right. Then back.", durationMs: 14000, kind: "attention" },
      { text: "Two short inhales. One long exhale.", durationMs: 10000, kind: "breath" },
      { text: "Notice the room is quieter than it was thirty seconds ago.", durationMs: 12000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["flat", "stuck", "mixed", "anxious"],
      bioFilters: ["sleep-deprived", "hormonal", "depleted", "clear"],
      signalAreas: ["general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["sokolov-orienting", "porges-vagal"]
  },

  // ─── 10. Body-first universal — for users without a clear state ──────
  {
    id: "body-first-universal-60s",
    durationMs: 60000,
    prompts: [
      { text: "Press your feet flat into the floor.", durationMs: 10000, kind: "pressure" },
      { text: "Notice the temperature of the air on your skin.", durationMs: 12000, kind: "temperature" },
      { text: "Slow inhale through your nose.", durationMs: 10000, kind: "breath" },
      { text: "Long exhale through your mouth.", durationMs: 14000, kind: "breath" },
      { text: "Open your gaze. Take in the room.", durationMs: 14000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["clear", "mixed", "focused", "stuck", "flat", "angry", "anxious"],
      bioFilters: ["clear", "activated", "depleted", "sleep-deprived"],
      signalAreas: ["general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["sokolov-orienting", "porges-vagal", "levine-somatic"]
  },

  // ─── 11. Hands tension — grip-release for keyboard/gripping users ─────
  // Levine tension-release cycle. Hands often hold loop-time stress that
  // never gets discharged; explicit clench-release gives the discharge a
  // path. Brief (45s) so it fits between calls or between writing sessions.
  {
    id: "hands-grip-release-45s",
    durationMs: 45000,
    prompts: [
      { text: "Make a tight fist with both hands. Hold.", durationMs: 8000, kind: "pressure" },
      { text: "Release. Spread your fingers wide.", durationMs: 8000, kind: "pressure" },
      { text: "Let your hands rest loose. Notice the difference.", durationMs: 10000, kind: "attention" },
      { text: "Slow exhale. Drop the rest with it.", durationMs: 10000, kind: "breath" },
      { text: "Hands soft now. That's the line you can come back to.", durationMs: 9000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["anxious", "mixed", "focused", "stuck"],
      bioFilters: ["activated", "clear"],
      signalAreas: ["hands", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["levine-somatic", "porges-vagal"]
  },

  // ─── 12. Gut signal — belly-hand contact for anxious gut activation ────
  // Hand-on-belly is direct interoceptive cue; the contact gives the user
  // a felt reference point that the breath is reaching the belly (Porges
  // vagal — diaphragmatic engagement). Specifically designed for stomach
  // signal which was only side-covered before.
  {
    id: "gut-soothe-anxious-60s",
    durationMs: 60000,
    prompts: [
      { text: "Place one hand on your belly. Light contact.", durationMs: 10000, kind: "posture" },
      { text: "Slow inhale. Let your belly press into your hand.", durationMs: 12000, kind: "breath" },
      { text: "Slow exhale. Belly falls under your hand.", durationMs: 14000, kind: "breath" },
      { text: "Another. Same shape.", durationMs: 12000, kind: "breath" },
      { text: "Hand still there. Belly soft.", durationMs: 12000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["anxious", "mixed", "stuck"],
      bioFilters: ["clear", "activated", "hormonal"],
      signalAreas: ["stomach", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["porges-vagal", "levine-somatic"]
  },

  // ─── 13. Pain-aware — breath-only, no movement that could aggravate ───
  // Pain bioFilter was only general-covered by #5. This sequence is
  // pain-FIRST design: no posture changes, no pressure cues, no
  // temperature shifts. Breath and attention only. Porges vagal via long
  // exhale — accessible even when most movement isn't.
  {
    id: "pain-aware-breath-90s",
    durationMs: 90000,
    prompts: [
      { text: "Stay where you are. No movement needed.", durationMs: 12000, kind: "attention" },
      { text: "Soft inhale through your nose. Smaller than usual.", durationMs: 14000, kind: "breath" },
      { text: "Soft exhale through your mouth. Longer than the inhale.", durationMs: 16000, kind: "breath" },
      { text: "Find one place that isn't hurting. Rest your attention there.", durationMs: 16000, kind: "attention" },
      { text: "Another soft inhale. Another longer exhale.", durationMs: 16000, kind: "breath" },
      { text: "The breath is here. The pain is here. Both. Just notice.", durationMs: 16000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["flat", "stuck", "mixed", "clear", "anxious"],
      bioFilters: ["pain", "depleted"],
      signalAreas: ["general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["porges-vagal"]
  },

  // ─── 14. Hormonal-soft — no sharp transitions, no jaw moves ───────────
  // Hormonal disruption (premenstrual, perimenopausal, postpartum, thyroid
  // flare) can come with jaw clenching that's painful to engage and
  // sensory hypersensitivity. This sequence is the slowest in the library,
  // avoids any sharp posture shifts, and is breath-anchored with soft
  // attention. Levine titration applied to non-pain states.
  {
    id: "hormonal-soft-90s",
    durationMs: 90000,
    prompts: [
      { text: "Sit or lie where you're held. Let the surface take your weight.", durationMs: 14000, kind: "posture" },
      { text: "Slow inhale. Not big. Just slow.", durationMs: 14000, kind: "breath" },
      { text: "Slow exhale. Longer.", durationMs: 14000, kind: "breath" },
      { text: "Find one steady thing in your body. Just one.", durationMs: 16000, kind: "attention" },
      { text: "Stay there for two more breaths.", durationMs: 16000, kind: "attention" },
      { text: "You're not asking your system to perform right now.", durationMs: 16000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["flat", "stuck", "mixed", "clear", "anxious"],
      bioFilters: ["hormonal", "depleted", "sleep-deprived"],
      signalAreas: ["general", "stomach"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["porges-vagal", "levine-somatic"]
  },

  // ─── 15. Anger discharge — controlled physical release ────────────────
  // Levine: anger held without discharge runs the loop. This sequence
  // gives anger a structured physical path — feet pressure (grounding) +
  // hand shake (discharge) + loud exhale + jaw open. Not catharsis; not
  // "let it all out" — bounded discharge that completes thwarted activation.
  {
    id: "anger-discharge-60s",
    durationMs: 60000,
    prompts: [
      { text: "Press both feet hard into the floor. Push.", durationMs: 10000, kind: "pressure" },
      { text: "Hold for five. Then let go.", durationMs: 10000, kind: "pressure" },
      { text: "Shake your hands out. Loose.", durationMs: 10000, kind: "posture" },
      { text: "Long exhale. Loud is fine.", durationMs: 12000, kind: "breath" },
      { text: "Open your jaw. Let it drop.", durationMs: 10000, kind: "posture" },
      { text: "The heat moves. You're still here.", durationMs: 8000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["angry"],
      bioFilters: ["activated", "clear"],
      signalAreas: ["jaw", "hands", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["levine-somatic", "porges-vagal"]
  },

  // ─── 16. Stuck mind — somatic anchor, not more thinking ───────────────
  // When stuck cognitively, more thinking deepens the loop. Sokolov
  // orienting response: external sensation interrupts internal repetition.
  // Explicit "stop trying to figure it out" framing because the stuck
  // state's tendency is to push harder on the thinking.
  {
    id: "cognitive-anchor-stuck-60s",
    durationMs: 60000,
    prompts: [
      { text: "Stop trying to figure it out for sixty seconds.", durationMs: 12000, kind: "attention" },
      { text: "Press your feet flat. Notice the floor.", durationMs: 12000, kind: "pressure" },
      { text: "Name three things you can see. Out loud or in a whisper.", durationMs: 14000, kind: "attention" },
      { text: "Slow exhale. Drop the loop with it.", durationMs: 12000, kind: "breath" },
      { text: "Notice you're standing or sitting. That's the anchor.", durationMs: 10000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["stuck", "mixed", "flat"],
      bioFilters: ["clear", "depleted", "sleep-deprived"],
      signalAreas: ["general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["sokolov-orienting", "porges-vagal"]
  },

  // ─── 17. Focused-sharpening — maintain alert state, don't settle ──────
  // Different from #7 pre-event reset, which moves toward composure.
  // Focused-sharpening is for the user already in flow who wants to
  // re-anchor mid-task without dropping out of the state. Shorter (45s).
  // Maintains the activation rather than dissipating it.
  {
    id: "focused-sharpening-45s",
    durationMs: 45000,
    prompts: [
      { text: "Sit or stand sharp. Spine long.", durationMs: 10000, kind: "posture" },
      { text: "Eyes alert. Take in the whole field.", durationMs: 10000, kind: "attention" },
      { text: "Sharp inhale through the nose.", durationMs: 8000, kind: "breath" },
      { text: "Slow exhale, longer.", durationMs: 10000, kind: "breath" },
      { text: "You're locked in. Stay there.", durationMs: 7000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["focused", "clear"],
      bioFilters: ["activated", "clear"],
      signalAreas: ["general", "shoulders"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["gollwitzer-implementation", "porges-vagal"]
  },

  // ─── 18. Late-night winddown — evening-specific, settle not activate ──
  // Evening timeOfDay was uncovered. This sequence is the opposite of
  // morning-prime: longer (90s), softer, eyes can close. Porges vagal via
  // extended exhale. Closing line acknowledges the day is over — Gollwitzer
  // implementation: pre-committed "if it's late, then this" reduces the
  // execution cost of stopping the day.
  {
    id: "late-night-winddown-90s",
    durationMs: 90000,
    prompts: [
      { text: "Settle into where you are. Don't sit up straighter for this.", durationMs: 14000, kind: "posture" },
      { text: "Slow inhale through your nose. Soft.", durationMs: 14000, kind: "breath" },
      { text: "Long exhale through your mouth. Longer than the inhale.", durationMs: 16000, kind: "breath" },
      { text: "Let your eyes soften or close. You don't need to track anything.", durationMs: 14000, kind: "posture" },
      { text: "Another long exhale. The day is done.", durationMs: 16000, kind: "breath" },
      { text: "Nothing else needs to happen tonight.", durationMs: 16000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["stuck", "anxious", "mixed", "flat"],
      bioFilters: ["sleep-deprived", "depleted", "clear", "hormonal"],
      signalAreas: ["general"],
      timeOfDay: "evening"
    },
    pathway: "somatic-redirection",
    scienceTags: ["porges-vagal", "levine-somatic", "gollwitzer-implementation"]
  },

  // ─── 19. Morning prime — morning-specific, activate not settle ────────
  // Morning timeOfDay was uncovered. Sharp, short (45s), bright. Sokolov
  // orienting via "look up / take in light" — visual orientation outward
  // shifts attention from internal residue of sleep to external present.
  // Counter-shape to late-night winddown.
  {
    id: "morning-prime-45s",
    durationMs: 45000,
    prompts: [
      { text: "Open your shoulders. Lift your chest.", durationMs: 10000, kind: "posture" },
      { text: "Look up. Take in light.", durationMs: 8000, kind: "attention" },
      { text: "Sharp inhale. Two short pulls.", durationMs: 8000, kind: "breath" },
      { text: "Long slow exhale.", durationMs: 10000, kind: "breath" },
      { text: "You're awake. The day is here.", durationMs: 9000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["flat", "stuck", "mixed", "clear", "focused"],
      bioFilters: ["sleep-deprived", "depleted", "clear"],
      signalAreas: ["general", "shoulders"],
      timeOfDay: "morning"
    },
    pathway: "somatic-redirection",
    scienceTags: ["sokolov-orienting", "porges-vagal"]
  },

  // ─── 20. Discreet-public — invisible to others, for meetings/desk ─────
  // All-internal sequence. No visible movement. The user can run this
  // mid-meeting without anyone noticing. Porges vagal via nasal breathing
  // and jaw release "behind the closed mouth". Critical for the user-types
  // who need composure tools in environments where breaking attention
  // visibly carries social cost.
  {
    id: "discreet-public-60s",
    durationMs: 60000,
    prompts: [
      { text: "Feet flat under your chair. Nobody sees this.", durationMs: 12000, kind: "pressure" },
      { text: "Let your jaw release behind your closed mouth.", durationMs: 12000, kind: "posture" },
      { text: "Slow inhale through your nose. Quiet.", durationMs: 12000, kind: "breath" },
      { text: "Slow exhale through your nose. Longer.", durationMs: 12000, kind: "breath" },
      { text: "Soften your gaze. Stay in the room.", durationMs: 12000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["angry", "anxious", "mixed", "stuck", "focused"],
      bioFilters: ["activated", "clear"],
      signalAreas: ["jaw", "chest", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["porges-vagal"]
  },

  // ─── 21. Counter-rhythm breath — §4.2 named, was unenacted ────────────
  // PATTERN_DISRUPTION_SPEC §4.2 explicitly names "counter-rhythm breath:
  // A breath pattern deliberately *unlike* the user's default and unlike
  // whatever they've been doing recently. Novelty in the breath itself."
  // No prior sequence enacted this. Sokolov orienting via novel rhythm.
  // Deliberately NOT a named pattern (box, 4-7-8) — those live in Breathe
  // tool and would compete.
  {
    id: "counter-rhythm-breath-60s",
    durationMs: 60000,
    prompts: [
      { text: "Notice the rhythm you're breathing in right now.", durationMs: 12000, kind: "attention" },
      { text: "Change it. Shorter inhale than usual.", durationMs: 12000, kind: "breath" },
      { text: "Pause at the top. Two seconds.", durationMs: 10000, kind: "breath" },
      { text: "Longer exhale than the inhale. Doubled.", durationMs: 14000, kind: "breath" },
      { text: "Pause at the bottom. Two seconds. Then repeat.", durationMs: 12000, kind: "breath" }
    ],
    fitness: {
      feelStates: ["anxious", "stuck", "mixed", "angry"],
      bioFilters: ["clear", "activated"],
      signalAreas: ["chest", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["sokolov-orienting", "porges-vagal"]
  },

  // ─── 22. Shoulders-deep yoke release — shoulders-signal specific ──────
  // Existing sequences touch shoulders incidentally; this one targets the
  // shoulder-yoke specifically with a Levine tension-release cycle (lift,
  // hold, drop) before the postural opening. Useful for users who carry
  // load in the upper traps and rhomboids — desk workers, parents, anyone
  // bracing through their shoulders.
  {
    id: "shoulders-deep-yoke-60s",
    durationMs: 60000,
    prompts: [
      { text: "Lift both shoulders up to your ears. Hold.", durationMs: 10000, kind: "posture" },
      { text: "Hold for five. Tight.", durationMs: 8000, kind: "pressure" },
      { text: "Drop them hard. Let them fall.", durationMs: 10000, kind: "posture" },
      { text: "Roll back. Open the chest.", durationMs: 10000, kind: "posture" },
      { text: "Long exhale. Stay open.", durationMs: 12000, kind: "breath" },
      { text: "Shoulders softer now than thirty seconds ago.", durationMs: 10000, kind: "attention" }
    ],
    fitness: {
      feelStates: ["anxious", "stuck", "mixed", "angry"],
      bioFilters: ["activated", "depleted", "clear"],
      signalAreas: ["shoulders", "neck", "general"],
      timeOfDay: "any"
    },
    pathway: "somatic-redirection",
    scienceTags: ["levine-somatic", "porges-vagal"]
  }
];

// Lookup helper. Returns null if id not found.
export const getSequenceById = (id) => {
  if (!id) return null;
  return MOVE_CARD_LIBRARY.find(s => s.id === id) || null;
};

// Deterministic selection — used by Phase 8b's selection function as the
// fallback path when AI is unavailable. Filter by feelState, narrow by
// bioFilter, narrow by signalArea, narrow by timeOfDay, exclude recently-
// shown sequences, then pick the first remaining (or a wraparound if
// nothing left).
//
// Per audit Option B (audit §2): the selection itself is the adaptive
// layer. The library content is locked-science. AI selection is preferred
// when available (Phase 8b backend); this function is the offline-safe
// floor.
//
// timeOfDay filter (added May 14 alongside library expansion to 22): a
// sequence's fitness.timeOfDay = "any" passes for every input timeOfDay;
// a specific value ("morning"/"midday"/"evening") only passes for that
// exact bucket. The library always has timeOfDay:"any" sequences in every
// state combination, so this filter never empties the pool to nothing.
//
// state shape: { feelState, bioFilter, signalArea, timeOfDay }
// recentMoveIds: array of sequenceIds shown in last few invocations
export const selectByDeterministicRule = (state = {}, recentMoveIds = []) => {
  const feelState = state.feelState || null;
  const bioFilter = Array.isArray(state.bioFilter) ? state.bioFilter : (state.bioFilter ? [state.bioFilter] : []);
  const signalArea = state.signalArea || null;
  const timeOfDay = state.timeOfDay || null;

  // Filter pipeline: feelState → bioFilter → signalArea → timeOfDay → not-recent.
  // Each filter is best-effort: if no candidate matches, fall through to
  // the broader pool rather than returning null. The library always has
  // a universal sequence (id #10) that matches every state combination
  // and is timeOfDay:"any", so the floor is always non-empty.
  let pool = MOVE_CARD_LIBRARY;

  if (feelState) {
    const filtered = pool.filter(s => s.fitness.feelStates.includes(feelState));
    if (filtered.length > 0) pool = filtered;
  }

  if (bioFilter.length > 0) {
    const filtered = pool.filter(s => bioFilter.some(b => s.fitness.bioFilters.includes(b)));
    if (filtered.length > 0) pool = filtered;
  }

  if (signalArea) {
    const filtered = pool.filter(s => s.fitness.signalAreas.includes(signalArea));
    if (filtered.length > 0) pool = filtered;
  }

  if (timeOfDay) {
    const filtered = pool.filter(s => s.fitness.timeOfDay === "any" || s.fitness.timeOfDay === timeOfDay);
    if (filtered.length > 0) pool = filtered;
  }

  // Exclude recent unless that empties the pool.
  if (recentMoveIds.length > 0) {
    const filtered = pool.filter(s => !recentMoveIds.includes(s.id));
    if (filtered.length > 0) pool = filtered;
  }

  // Pick a stable choice — first remaining. Shuffled selection is the AI
  // path's job (Phase 8b backend); the deterministic fallback prefers
  // predictability so users in repeat-fallback scenarios at least see the
  // same sequence and can recognize it.
  return pool[0] || MOVE_CARD_LIBRARY[MOVE_CARD_LIBRARY.length - 1];
};
```

---

ARA Embers LLC · Stillform · Engagement Architecture Engine 2 · Build #8 audit
