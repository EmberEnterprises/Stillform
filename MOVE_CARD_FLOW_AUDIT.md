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
- Self-initiated path is already supported: `patternId === null` means user hit Disruptor not via pattern detection (verified at `src/App.jsx:3822`)

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

No AI at all. Move card library + a state-to-sequence mapping rule. State chip + bio-filter + signal area determine the sequence. Pure code.

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

### 8a. Move card library (foundation)

A new module `src/move-card/library.js` (or inline in App.jsx alongside existing breathing pattern arrays). Each entry:

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
| 8a | Move card library + science-tagged sequences | ~250 lines (data-heavy) |
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

---

ARA Embers LLC · Stillform · Engagement Architecture Engine 2 · Build #8 audit
