# CONCIERGE CLUSTER — SCOPE (v0.1, June 2 2026, FOR ARLIN'S DECISIONS)

**Goal:** give the concierge layer its voice. The diagnostic stack (memory) is live;
nothing surfaces it unprompted. This cluster wires the two dark surfaces that make the
AI feel like a through-line: the **Mirror strip** and the **AI Mediation queue**.

## Ground truth (verified June 2)
- `mirror.js`: reader + staleness + honest-absence DONE; SmartScreen auto-renders when
  the cache is non-null. Only the WRITER is missing (`setMirrorObservation`, 0 callers).
- `reframe.js propose_update` mode: COMPLETE backend. Input: triggerProfile, anchors,
  growthBaseline, last-10 reframes/checkins/EODs, sessionCount, existingPendingTargets.
  Output: structured proposals (operation · target · payload · verbatim reasoning ·
  evidence refs).
- Missing: any client caller, a proposals store, an approval-queue UI, a Mirror writer.

## Design (one call, two lights)
A single `propose_update` call per trigger returns BOTH the mediation proposals AND one
Mirror observation (backend gains an `observation` field in the same response — one
GPT-4o call, no second spend). Client: `mediationApi.js` (caller + proposals store
`stillform_v2_mediation_queue`) → writes Mirror via existing `setMirrorObservation` →
approval-queue UI renders pending proposals with verbatim reasoning; user approves or
declines each; approve applies the operation to the target store; decline records it
to `existingPendingTargets` suppression.

Doctrine held: user-led (nothing applies without explicit approval), observations
reflect the user's own named work (mirror.js Good/Bad examples are the law), honest
absence until real evidence, Self-Mode fallback (AI down → queue/Mirror unchanged,
practice unaffected). No push, no notification — surfaces light when the user is
already there.

## Build order
M1 `mediationApi.js` (caller + queue store + Mirror write) → M2 approval-queue UI →
M3 trigger wiring per Arlin's cadence decision → M4 (follow-on, separate scope):
deterministic smart-prompt floor.

## Cost picture (honest)
One propose_update call ≈ a few KB context + small completion ≈ on the order of a cent
per call at GPT-4o rates. Cadence decides monthly cost per active user: EOD-only ≈ ≤30
calls/mo; every-3rd-close ≈ proportional to practice volume; home-open w/ 24h cooldown
≈ ≤30/mo but spends on idle opens. All trivial vs. the $14.99 default price; cadence is
a feel decision more than a cost one.

## ARLIN'S DECISIONS (blocking M3; M1–M2 buildable now)
1. **Trigger cadence:** EOD completion only · every 3rd session close · home-open with
   24h cooldown.
2. **Queue placement:** tap the Mirror strip opens the queue · a My Progress section ·
   both.
3. **Mirror evidence floor:** minimum sessions before the Mirror may light (proposal: 5
   — matches lifecycle quiet-floor logic; honest absence below it).
