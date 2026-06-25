# STILLFORM CONCIERGE CLUSTER — SPEC

**ARA Embers LLC · Draft v0.1 · June 2, 2026 · Status: FOR ARLIN'S DECISIONS (3 flagged below)**

## 1 · WHY THIS CLUSTER

The concierge (Pillar 3) is doctrine: distributed AI through-line, never a screen.
Its *memory* exists (full diagnostic stack feeds every AI call). Its *voice* is dark:
the Mirror strip has zero writers, the AI Mediation backend has zero callers, and the
Smart Prompt Mechanism's deterministic floor was never built. Result (Arlin, June 2):
"I don't see a concierge in the app." Correct — the app never says anything
unprompted. This cluster is the felt-intelligence build: the moment the interface
shows the user it knows them. Same gap the Fable-5 assessment named "the signals
never meet."

## 2 · WHAT EXISTS (verified June 2)

- `src/v2/lib/mirror.js` — cache reader + `setMirrorObservation` writer, honest-absence
  design (renders only when an observation exists; never fakes). 0 callers.
- `netlify/functions/reframe.js` mode `propose_update` (lines ~2012–2217) — full AI
  mediation: takes triggerProfile/anchors/growthBaseline/recentReframes/recentCheckins/
  recentEod/sessionCount/existingPendingTargets; returns evidence-grounded proposals
  with verbatim reasoning; guardrails built in (≥5 pending → hold; <3 reframes &
  <2 EODs → insufficient_signal). NO client caller.
- `eod-artifact.js` + `todays-brief.js` — existing AI calls that already synthesize
  across the user's sessions (the natural piggyback carriers for Mirror observations).
- Active Prompt (`activePrompt.js`) — per-beat prompt surface, static fallback copy.
- Diagnostic stack — trigger/bias/context/capacities/risk profiles + prediction log,
  all local, all readable by deterministic rules at zero cost.

## 3 · THE THREE BUILDS

### L1 — Mirror wiring (the concierge's face)
Feed: **piggyback** — extend the eod-artifact and todays-brief prompts to also return
an optional `mirror_observation` field (third-person, evidence-grounded, counts not
interpretation, per mirror.js's Good/Bad examples + evidenceCount). Client caches it
via `setMirrorObservation`; SmartScreen lights up automatically (already wired to the
reader). Honest absence preserved: below evidence floor the field comes back null and
nothing renders.
**Marginal cost: ≈$0** (+~60 output tokens on calls the app already makes).

### L2 — AI Mediation client (the approval queue)
Wire the existing `propose_update` backend: a client lib (`mediationApi.js`) that
assembles the context payload, calls sparingly (cadence = Decision 1), stores
proposals locally, and a queue section where the user sees each proposal's reasoning
verbatim and taps Approve (applies the artifact update) or Dismiss (logged, never
re-proposed for that target). User remains the authority — AI proposes, never writes.
**Cost: ~$0.01 per mediation call** (≈2–3k in / ≈300 out). Weekly cadence ≈
$0.04/active user/mo; every-5th-close similar order. Estimates, capped by the
backend's own guardrails either way.

### L3 — Smart-prompt deterministic floor (zero-AI, zero-cost)
Layer-1 of the locked two-layer pattern-recognition architecture: local rules reading
the diagnostic stack, surfacing through the existing Active Prompt slot. First rules:
(a) upcoming pre-event entry within 24h → offer Pre-event Brief; (b) same watch-list
chip detected in 3 of last 5 sessions → offer that pattern's review; (c) wind-down
beat + no EOD today → offer the EOD. Rules fire at most one suggestion at a time,
quiet copy, always dismissible. No AI call anywhere in L3.

## 4 · BUILD ORDER

L3 → L1 → L2. (L3 is pure local + instantly visible; L1 needs one backend prompt
extension + tiny client cache write; L2 is the largest client surface.) Each step:
build green + headless boot proof + commit; ship checklist on L2 (FAQ entry for the
queue, privacy note — proposals derived on-device-supplied context only).

## 5 · FRAMING LAW APPLICATION

Mirror voice: counts and observations of the user's own named work, never diagnosis,
never "you seem." Mediation reasoning shown verbatim; approve language is user-authority
("Apply this to my profile"). No push notifications anywhere in this cluster — all
three surfaces are pull/ambient, visible only inside the app the user opened.

## 6 · TEACHING POSTURE — teach the posture, refuse the domain

Source: the @execute / Dan Koe "modern artisan" carousels (project knowledge, June 23).
They teach *well* — the value is the pedagogy, not the subject. The concierge borrows
the teaching posture; it refuses the productivity domain.

**The posture the concierge teaches with:**
- **Name it to loosen its grip.** Naming a vague thing so it stops running you is the
  core move — and it already *is* Stillform. Teaching surfaces lead with naming, not instruction.
- **One scannable unit at a time.** Small beats, never a wall. Lower friction, and it's
  how the practice lands.
- **A framework they keep.** Hand over a portable model the user internalizes and reuses
  — the spine of the practice, not a dependency on the app.
- **Meet them where they are.** Personalize the path from the diagnostic stack the
  concierge already holds.
- **One concrete, low-friction move.** One if-then, never a menu.

**Self-mastery is built, not willed — through structure, frictionless movement, and good
routines (Arlin, June 23).** These are NOT the domain to refuse; they are the scaffolding
self-mastery is made of, and the concierge teaches them openly:
- **Structure.** The practice has a spine (beats, briefs, anchors). The concierge makes
  that spine legible.
- **Frictionless movement.** The path state → named → moved must be near-zero friction.
  The concierge *removes* steps; it never adds them.
- **Good routines.** Repetition is the neuroplastic engine. The concierge teaches the
  routine (morning brief, evening close) as the thing that compounds capacity.
All three serve seeing-yourself-clearly and expanding baseline — never output.

**The line (what tips it into a productivity tool):**
- **Output as the pitch.** "8 hours in 4," "ahead of 99%." The instant the concierge
  promises output, it's a productivity tool. Sharper work and composure are *felt results*,
  never the sell.
- **Task management.** The concierge never manages tasks or treats the calendar as a todo
  list. It changes how the user meets their states.
- **Grind / optimization tone.** Operator-calm, not hustle.

**Telos test — apply to every teaching surface (onboarding, the briefs, in-flow nudges):**
does it teach the user to *see themselves more clearly* / build the routine that *expands
capacity*? → keep. Does it promise *output*, manage *tasks*, or sell *productivity*? → refuse.

**Already live (the exemplar):** Today's Brief — hardware / risks / moves / recovery — is
this posture: a portable, friction-reducing framework pointed at the user's state and
patterns, not a task list. Hold every teaching surface to that bar.

*(Expandable — the structure / frictionless-movement / routine doctrine may detail further.)*

## 7 · ARLIN'S DECISIONS (the 3 that are hers)

1. **Mediation cadence (cost lever):** weekly · every 5th session close · manual-only
   ("Review my patterns" button) · skip L2 for now.
2. **Queue placement:** My Progress section (recommended) · Settings · its own card on
   SmartScreen.
3. **Mirror feed confirm:** piggyback-$0 as specced (recommended) · dedicated call
   (fresher, adds cost) — piggyback can upgrade later without rework.
