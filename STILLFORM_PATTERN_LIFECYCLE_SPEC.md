# STILLFORM PATTERN LIFECYCLE SPEC — "Gone Quiet"
**ARA Embers LLC · v1.0 LOCKED · June 2, 2026 (Arlin's review same day)**

Extends the shipped 5.11(d) behavioral-confirmation lifecycle with its missing half:
patterns that stop appearing. Makes the product's core promise — neuroplastic change —
**visible with evidence.**

---

## 1 · FRAMING (Layer 0)

CANON §1: repeated analytical practice makes pattern recognition fast enough to feel
like direct perception. The end state of that arc is a pattern that **no longer runs
you**. Today the app can show a pattern arriving (provisional → emerging → confirmed)
but has no language for one leaving. This spec adds the leaving.

- Pure metacognition: the system reflects observed recurrence and observed quiet.
  It never claims cure, fix, or permanence.
- Reflect-not-score (CANON §10): plain language states, no numbers shown.
- ZERO FABRICATION: "gone quiet" is only claimed when there is genuine evidence —
  continued practice WITHOUT detection. Absence alone proves nothing.
- Honest limit, stated in-copy: the AI only sees what sessions touch. Quiet in
  sessions ≠ certainty it's gone everywhere. Copy says "in your sessions."
- Patterns can return. Re-detection re-activates instantly, without shame framing.

## 2 · SCIENCE

- Extinction/reconsolidation: pattern change is observable as reduced recurrence
  (Ecker; Schiller; Lane — already in STILLFORM_PATTERN_CHANGE_AUDIT.md).
- The state-vs-trait integrity of 5.11 applies in reverse: one quiet week is state;
  quiet across many sessions over weeks approximates trait change.
- Evidence-based progress display is the honest retention mechanism (CANON
  partner-credit decision, line 291): real growth only, never inflated.

## 3 · STATE MACHINE

Existing (shipped, d1–d3): `provisional` (0 detections) → `emerging` (1–2) →
`confirmed` (≥3 distinct days).

New states (computed, not stored — derived at read time):

- **`quieting`** — entry was `confirmed`, AND since `lastSeen`:
  ≥ QUIET_MIN_SESSIONS sessions with AI detection active, AND
  ≥ QUIET_MIN_DAYS elapsed, AND zero detections of this spine.
- **`retired`** ("gone quiet") — same, at RETIRED_MIN_SESSIONS / RETIRED_MIN_DAYS.
- **Re-detection at any point** → back to `confirmed` (lastSeen updates; the quiet
  clock restarts). History is kept: `quietEpisodes` count increments when a retired
  pattern re-activates (internal only — honesty about recurrence, never displayed
  as failure).

**LOCKED (Arlin, June 2 — "looser, show progress sooner"), with the integrity floor held (no claim below two weeks; 5.11 state-vs-trait):**
QUIET_MIN_SESSIONS = 5 · QUIET_MIN_DAYS = 14 · RETIRED_MIN_SESSIONS = 10 ·
RETIRED_MIN_DAYS = 30. (Original draft 8/21 · 16/45; still tunable in testing.)

**Why sessions AND days:** sessions guarantee detection opportunity existed
(ZERO FABRICATION); days guarantee it isn't depth-in-one-week (5.11 state-vs-trait).
A user who stops practicing accrues neither — their patterns simply hold state,
honestly.

## 4 · DATA

No new store. No migration. `quieting`/`retired` are **derived** in
`patternConfidence(entry)` (biasProfile.js) from:
- `entry.lastSeen`, `entry.encounterCount` (exist today)
- session timestamps from the sessions store (exists today) — count sessions
  after `lastSeen` where a Reframe ran (detection-active sessions)

One additive stored field: `quietEpisodes` (number, default 0) — set only on
re-detection of a retired pattern, inside the existing `noteAiPatternDetection`.

## 5 · SURFACES

1. **Watch list (BiasProfile.jsx)** — the existing status badge gains the two
   states. Display copy (⚠️ names adjustable, Arlin's call):
   - quieting: "going quiet — N sessions since this last showed up"
   - retired: "gone quiet in your sessions since <month>"
   Retired entries move to a separate section at the bottom: **"Gone quiet"** —
   present, honored, out of the active working set. Not deleted (the user's
   history is theirs; removal stays a manual act).
2. **My Progress** — the existing landing gains one quiet line when ≥1 retired
   pattern exists: "1 pattern has gone quiet since you started watching it."
3. **Mirror (future hook, NOT this build)** — retirement is exactly the
   cross-time observation the Mirror exists for; when the Mirror wiring decision
   lands (Arlin's open trigger/cost call), retired-pattern observations are a
   natural first feed. Noted here so the seam exists; no Mirror work in scope.

## 6 · COPY DIRECTION (loop-voice, partner register)

- Never: cured, fixed, beaten, defeated, gone forever, victory.
- Always: observed, quiet, "in your sessions," since-date, the user did the work.
- Re-activation: "Back on the active list — it showed up in today's session.
  That's information, not a setback." (No streak-loss framing. Ever.)

## 7 · EXPLICIT NON-GOALS

- No push/notification on state change (6c integrity kill stands; the change is
  discovered where the user already looks).
- No auto-removal from the watch list. No celebration animation. No score.
- No claim about life outside sessions.
- "Caught it live" (manual mid-day catch) is a compatible later extension that
  would feed the same lifecycle; out of scope here.

## 8 · BUILD DECOMPOSITION (after Arlin locks)

- **L1** — `patternConfidence` extension (derived states + session-count helper).
  Pure logic + harness. No UI.
- **L2** — `quietEpisodes` on re-detection in `noteAiPatternDetection`.
- **L3** — Watch-list badge copy + "Gone quiet" section.
- **L4** — My Progress quiet line.
Each step build-green + committed separately; ship checklist swept at L3/L4
(FAQ entry, Science Sheet pointer to reconsolidation refs, Plausible event
"Pattern Retired Viewed", transfer doc, punch list).

## 9 · DECISIONS (LOCKED — Arlin, June 2, 2026)

1. Display names: "going quiet" / "gone quiet" stand as defaults (display-only;
   renameable on screen review).
2. Thresholds: LOOSER — 5 sess/14 d quieting · 10 sess/30 d retired (integrity
   floor: never below two weeks for the first claim).
3. Manual re-add to active: ALLOWED — the user is the authority.
4. My Progress line: YES.
