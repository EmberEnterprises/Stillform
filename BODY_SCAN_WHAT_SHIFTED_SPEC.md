# BODY_SCAN_WHAT_SHIFTED_SPEC.md
**Stillform Body Scan What Shifted — implementation spec**
**ARA Embers LLC · April 30, 2026**

---

## What this is

Spec for adding the post-completion What Shifted moment to Body Scan. Currently Body Scan completes, runs ToolDebriefGate (the metacognitive close), then exits. It never asks the user to **name what shifted in their body** — which means the persisted `feelState` chip stays stuck on whatever was selected before the scan, and the somatic shift the user just experienced is never captured as a labeled signal.

Mirrors the architecture of Reframe's State-to-Statement / What Shifted moment, with body-specific copy and a body-specific scope.

---

## Why this gap matters

**Pillar 1 (metacognition) loss.** Reframe asks "what shifted?" and captures the answer. Body Scan touches state but never closes the loop with a label. A user can finish a 4-minute body scan and exit with the same chip selected as when they entered, even if their body is in a measurably different state. The metacognitive close is the moment that converts the experience into a learnable signal — without it, Body Scan is a regulation tool but not a self-knowledge tool.

**Pre/post chip integrity loss.** Stillform tracks pre-state and post-state for longitudinal pattern surfacing in My Progress. Body Scan currently only captures pre-state (the chip selected at entry). Post-state goes unlogged. Half the data is missing.

**Affect labeling research.** Lieberman 2007 (and subsequent fMRI replications) showed that putting an emotion or sensation into a single word measurably reduces amygdala activity and increases right ventrolateral prefrontal cortex activity. The act of naming what shifted is itself a regulation event, not just a record-keeping one. Reframe already does this. Body Scan should too.

**Pillar 4 (neuroplasticity) loss.** The compounding-practice claim depends on every session producing learnable signal. Sessions without post-state labels produce no signal — they're just minutes spent.

---

## What's already there

Body Scan is not bare. The existing infrastructure:

- **Pre-state chip selection** — at Body Scan entry, the user can select a feel chip (Anxious, Angry, Stuck, Mixed, etc.). Falls back to inferring from morning check-in if not explicitly set. Same persistence as Reframe.
- **Six acupressure point sequence** — jaw/face, shoulders, chest, hands, sacrum, feet. Each with prompt + hold observation + point effect + point name + point location + point instruction.
- **ToolDebriefGate (metacognitive close)** — runs after scan completion. Body-scan-specific prompts already exist:
  - Prompt: "What did the scan teach you about your pattern?"
  - Thought-first options: 3 lines about body signals being clearer than assumptions.
  - Body-first options: 3 lines about identifying where activation concentrates.
- **Session save** — appendSessionToStorage with toolId="body-scan", duration, exitPoint, source, entryMode, entryProtocolId.
- **Plausible event** — "Body Scan Completed" fires.

What's missing: the moment between "scan complete" and "ToolDebriefGate runs" where the user names what shifted in their body and that label is captured as post-state.

---

## What this adds

A new screen state in BodyScanTool: **`showWhatShifted`** — appears after the six-point sequence finishes, before ToolDebriefGate. The user does three things in order:

1. Selects a post-state chip (which feel chip describes them now)
2. Optionally types a one-line "What shifted in your body?" free-text label
3. Taps "Lock it in" to commit, or "Skip" to bypass

After commit or skip, the existing ToolDebriefGate runs unchanged. Then `onComplete` fires.

---

## Component architecture

### State additions to BodyScanTool

```
const [showWhatShifted, setShowWhatShifted] = useState(false);
const [postStateChip, setPostStateChip] = useState(null);
const [shiftLabel, setShiftLabel] = useState("");
const [shiftLabelExpanded, setShiftLabelExpanded] = useState(false);
const [shiftSkipReason, setShiftSkipReason] = useState(null);
```

### Flow change

Currently: scan complete → `queueDebriefAndCompleteNow()` → ToolDebriefGate → onComplete

New: scan complete → `setShowWhatShifted(true)` → user finishes/skips → `queueDebriefAndCompleteNow()` → ToolDebriefGate → onComplete

The hand-off into ToolDebriefGate is unchanged. Only one new screen inserted before it.

### Render

```
if (showWhatShifted) {
  return <BodyScanWhatShiftedStep
    preState={feelState}
    postStateChip={postStateChip}
    onSelectChip={setPostStateChip}
    shiftLabel={shiftLabel}
    onLabelChange={setShiftLabel}
    expanded={shiftLabelExpanded}
    onToggleExpanded={() => setShiftLabelExpanded(prev => !prev)}
    skipReason={shiftSkipReason}
    onSetSkipReason={setShiftSkipReason}
    onLockIn={handleWhatShiftedLockIn}
    onSkip={handleWhatShiftedSkip}
  />;
}
```

The component itself can live as a sub-component of BodyScanTool (not a separate file) — keeps the diff localized.

---

## UI design — exact copy and structure

The screen has three sections vertically:

### 1. Header
- Mono micro-label: `WHAT SHIFTED` (10px, IBM Plex Mono, 0.18em letter-spacing, uppercase, var(--amber))
- Body line: *"Your body just moved through six points. Name where it lands now — that's what locks the regulation in."*

### 2. Post-state chip picker

Same chip set as everywhere else in the app — uses the canonical FEEL_CHIPS array. Display the **pre-state chip** with a small label "Started: [chip]" (text-muted, mono-sm) above the chip grid for orientation, then the chip grid for post-state selection. User taps one chip. Selected chip gets the standard active styling (border var(--amber-dim), color var(--amber)).

Settled chip — once that ships per master todo line 110 — must appear here too. It's the chip a user is most likely to select after a body scan landed cleanly.

### 3. Free-text shift label (collapsed by default)

Toggle: `▸ What shifted in your body?` (text-dim, body-sm)

When expanded, a textarea:
- Placeholder: *"In one line — what's different in your body now? (optional)"*
- 3 rows
- Same styling as Reframe's textarea (var(--surface2) bg, 0.5px border, var(--r) radius)
- Body-sm text

Below the textarea, a quiet caption (text-muted, caption size):
*"Naming the somatic shift — even in one line — strengthens the pattern. Optional."*

This mirrors Reframe's State-to-Statement structure exactly (collapsed-by-default toggle revealing optional textarea), so users don't have to learn a new pattern between the two tools.

### 4. Action row

Three buttons in a row, in this order:
1. **Lock it in** — primary outline-with-amber-text button (matches new design system spec). Disabled until a post-state chip is selected.
2. **Add a line** — ghost button. Toggles the textarea expanded state. Hidden if textarea is already expanded.
3. **Skip** — ghost button. Triggers skipWhatShifted with default reason `"not-needed"`.

Same button vocabulary as Reframe's State-to-Statement screen. The user already knows this pattern.

### 5. Skip-reason selector (only when Skip is tapped)

If the user taps Skip, an inline prompt appears: *"One tap — why are you skipping? (helps the data quality)"* with three options:
- "Not needed for this session"
- "Already named it elsewhere"
- "Will name it later"

Same options Reframe uses (COMMUNICATION_SKIP_REASONS pattern, adapted). User selection commits the skip.

---

## Logic — what happens on Lock In and Skip

### handleWhatShiftedLockIn

```
const handleWhatShiftedLockIn = () => {
  if (!postStateChip) return; // safety — should be disabled in UI
  const cleanLabel = shiftLabel.trim();

  // Save shift to a body-scan-specific log
  appendBodyScanShiftToStorage({
    id: `bsshift_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    date: TimeKeeper.clockDay(),
    sessionTimestamp: latestSessionTimestampRef.current,
    preState: feelState || null,
    postState: postStateChip,
    shiftLabel: cleanLabel || null,
    hasLabel: cleanLabel.length > 0
  });

  // Update persisted feelState — user named the shift, so post-state replaces stale pre-state chip
  try { localStorage.setItem("stillform_feelstate", postStateChip); } catch {}

  // Plausible event
  try {
    window.plausible("Body Scan What Shifted Completed", {
      props: {
        had_label: cleanLabel.length > 0 ? "yes" : "no",
        pre_state: feelState || "none",
        post_state: postStateChip,
        shift_direction: classifyShiftDirection(feelState, postStateChip) // "regulated" / "persistent" / "concerning" — uses Russell circumplex three-category framework once that's implemented
      }
    });
  } catch {}

  // Clear local state and proceed to existing debrief
  setShowWhatShifted(false);
  setShiftLabelExpanded(false);
  queueDebriefAndCompleteNow(null, "body-scan-what-shifted-complete");
};
```

### handleWhatShiftedSkip

```
const handleWhatShiftedSkip = () => {
  const reason = shiftSkipReason || "not-needed";

  // Log the skip itself as signal (same as Reframe does)
  appendBodyScanShiftToStorage({
    id: `bsshift_skip_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    date: TimeKeeper.clockDay(),
    sessionTimestamp: latestSessionTimestampRef.current,
    preState: feelState || null,
    postState: null,
    shiftLabel: null,
    hasLabel: false,
    skipped: true,
    skipReason: reason
  });

  try {
    window.plausible("Body Scan What Shifted Skipped", {
      props: { skip_reason: reason }
    });
  } catch {}

  setShowWhatShifted(false);
  setShiftLabelExpanded(false);
  queueDebriefAndCompleteNow(null, "body-scan-what-shifted-skip");
};
```

### Storage helpers

Add to the storage helper section near `appendToolDebriefToStorage`:

```
const BODY_SCAN_SHIFT_STORAGE_KEY = "stillform_body_scan_shifts";
const BODY_SCAN_SHIFT_MAX_ITEMS = 320;

const appendBodyScanShiftToStorage = (entry, maxItems = BODY_SCAN_SHIFT_MAX_ITEMS) => {
  try {
    const existing = JSON.parse(localStorage.getItem(BODY_SCAN_SHIFT_STORAGE_KEY) || "[]");
    const list = Array.isArray(existing) ? existing : [];
    list.unshift(entry);
    const next = list.slice(0, maxItems);
    localStorage.setItem(BODY_SCAN_SHIFT_STORAGE_KEY, JSON.stringify(next));
  } catch {}
};
```

This is a separate localStorage key from session storage and from tool debriefs — keeps body scan shift signal cleanly queryable for My Progress later. Pattern matches existing `appendToolDebriefToStorage` and `appendSessionToStorage`.

---

## Edge cases

**User entered with no pre-state chip set.** The header still works — just say "Where does your body land now?" without the "Started: [chip]" label. PreState is null in the log entry; postState is whatever the user picks.

**User selects a chip then taps Skip without locking in.** Treat as skip. Don't save a shift entry; save a skip entry. Don't write postState to feelState.

**User adds a label but doesn't pick a chip.** Lock-in button is disabled. Even with a label, the chip is the structural data we need — labels are optional, chips aren't (because chips are what My Progress and the AI context use).

**User locks in with a chip but no label.** Standard case — that's why label is optional. Saves a complete entry with `hasLabel: false`.

**User leaves the screen / closes the app mid-flow.** No persistence layer for this in-progress state. If they come back, they're at the home screen. The pre-state chip is still in localStorage. The session was already saved at scan completion (current behavior). The user just doesn't get the metacognitive close for that session. That's acceptable — the existing post-completion flow already has the same behavior on early exits.

**User has Distant chip selected pre-scan.** Distant routes to Body Scan in the first place (per Reframe entry routing logic). The post-scan chip picker is the user's chance to label whether the body work brought them out of dissociation. This is one of the highest-signal moments in the entire app — Distant → Settled (or Distant → still Distant) is exactly the data the AI's longitudinal pattern recognition needs. No special-casing needed; just make sure Settled is in the chip set when this ships.

**User has Activated/Sleep/Depleted bio-filter active.** Those bio-filter states route straight to Breathe, not Body Scan, per the existing routing logic (Ochsner & Gross 2005 — body-scanning would be friction without benefit for those states). So Body Scan What Shifted only runs for users who actually came through to Body Scan in the first place. No bio-filter-specific gating needed at the Lock In layer.

---

## What this is *not* — things to explicitly leave out

**No State-to-Statement clone.** Reframe's State-to-Statement is about converting a regulated cognitive state into a sendable external message (Slack, email, talking point). That's a Reframe-specific affordance because Reframe is about cognition. Body Scan is about somatic regulation — there's nothing external to send. Don't add Copy/Share/Mark sent buttons here.

**No three-category data feed implementation in this spec.** That's the separate "What Shifted data feed — three-category positive selection framework" item in master todo (Russell circumplex Category A/B/C). The Lock In handler can call a placeholder `classifyShiftDirection()` that returns `null` until that work lands; the schema field is captured so backfill is trivial when categorization ships.

**No tutorial card update for this work.** Add to tutorial deck after the three-category data feed lands (those should ship together so tutorial isn't updated twice).

**No FAQ entry yet.** When this ships, add a single small FAQ entry: "Why does Body Scan ask 'what shifted' at the end?" — short answer mirrors the existing chip FAQ entry's affect-labeling section. Save until the three-category data feed ships so the FAQ entry can describe both at once.

---

## Ship checklist for this work

When this lands, run through:

1. **UAT dropdown** — add new entry "Body Scan What Shifted"
2. **Tutorial deck** — defer until three-category data feed ships, then add card covering both
3. **FAQ** — defer until three-category data feed ships, then add single entry
4. **Transfer doc** — mark Body Scan as having three completion stages: scan → What Shifted → ToolDebriefGate. Update the Pillar 1 metacognition section to confirm both Reframe and Body Scan have post-tool naming.
5. **Plausible events** — `Body Scan What Shifted Completed`, `Body Scan What Shifted Skipped` (with props as specced)
6. **Privacy policy** — no change (data stays on-device, same as everything else)
7. **Science Sheet** — small addition to Pillar 1 section: Body Scan now has the same affect-labeling close that Reframe has. Reference Lieberman 2007 (already cited).
8. **AI prompts** — `feelState` reads will now reflect post-Body-Scan state correctly. The AI naturally gets better context on the next session because the chip is current. No prompt changes needed; the data layer change does the work.
9. **Promo** — not promo-worthy as a single feature; rolls into the larger "every tool now has a metacognitive close" Pillar 1 narrative.
10. **Punch list** — none. Self-contained change.
11. **Emotion coverage** — same chip set as everywhere; ensure Settled is wired in if it's shipped by the time this ships.

---

## Build order — recommended

Build this AFTER the design system prestige refresh has landed, because the new screen will use the new component vocabulary (outline buttons, calibrated typography utility classes, hairline borders) directly. Building before would mean rebuilding the screen during the refresh pass.

Build order:
1. Whole-app prestige refresh (in progress)
2. **Settled chip ships** (master todo line 110) — Body Scan What Shifted needs Settled in the chip set to land cleanly
3. **Body Scan What Shifted** (this spec)
4. **Three-category data feed** (Russell circumplex A/B/C) — hooks into the post-state classification both Reframe and Body Scan now produce
5. Tutorial + FAQ updates for both Body Scan What Shifted and three-category data feed (single pass)

Each step is its own commit. Each is self-contained.

---

## Why this is a small lift

Most of the architecture is already there:

- **Pre-state chip** — already captured at entry
- **ToolDebriefGate metacognitive close** — already runs post-scan with body-scan-specific copy
- **Session save infrastructure** — already exists, includes pre-state context
- **Reframe What Shifted UI pattern** — already built and tested, just adapt copy
- **localStorage helpers** — pattern exists (`appendToolDebriefToStorage`, `appendSessionToStorage`); add one more
- **Plausible event pattern** — already established

What's new: one component (BodyScanWhatShiftedStep), two handlers, one storage helper, three localStorage writes per session. ~120 lines of code total. Single commit.

The conceptual work — "what should this screen do, what copy, what flow" — is what this spec is for. The build itself is mechanical against this spec.

---

*ARA Embers LLC · Body Scan What Shifted Spec · April 30, 2026*
