# SETTLED_CHIP_SPEC.md
**Stillform — Settled chip implementation spec**
**ARA Embers LLC · April 30, 2026**

---

## What this is

Spec for adding **Settled** as a ninth feel chip to Stillform. Closes the low-arousal positive quadrant of Russell's circumplex of affect, which the current eight chips (Excited, Focused, Anxious, Angry, Stuck, Mixed, Flat, Distant) leave structurally empty. Without Settled, a user in a regulated state has no accurate option — they either skip the chips (no data) or pick something inaccurate. Word choice and routing decisions were locked Apr 29; this spec is the build-ready operationalization.

---

## Why this gap matters

**Russell circumplex coverage gap.** Russell 1980 (*J. Pers. Soc. Psychol.* 39:1161–1178) maps affect onto two orthogonal axes — valence (negative ↔ positive) and arousal (low ↔ high). The eight current chips cover three of the four quadrants:

- **High arousal + negative** — Anxious, Angry (covered)
- **Low arousal + negative** — Flat, Distant (covered)
- **High arousal + positive** — Excited, Focused (covered)
- **Low arousal + positive** — *empty*

Stuck and Mixed are cognitive states that span quadrants but don't anchor in the low-arousal-positive zone where calm/regulated/at-ease lives. The fourth quadrant — what every regulation tool is trying to produce — has no representative chip in the input vocabulary.

**The downstream consequence.** Reframe's What Shifted, Body Scan's What Shifted (per separate spec), morning check-in, post-session post-rating — all of these use the same chip set. Every regulation tool has a moment where it asks "where are you now?" If the answer is "I feel calm and grounded," the user has nothing to tap. They can:

- Pick Focused (inaccurate — Focused is high-arousal)
- Pick Flat (actively wrong — Flat is low-arousal *negative*, the deadness/numbness state)
- Skip the chip entirely (no data captured)

None of those preserve signal integrity. The user's most-regulated post-tool state is invisible to the AI and to the longitudinal record.

**What this means for the four-pillar architecture.**

- **Pillar 1 (metacognition).** Affect labeling is the mechanism. Lieberman 2007 showed that putting an emotion into a single word reduces amygdala activity. If the user's actual state has no available label, the labeling intervention can't run. The most regulated moment in the practice is the moment the architecture goes silent on.
- **Pillar 4 (neuroplasticity).** The compounding-practice claim depends on every session producing learnable signal. Sessions that end with the user in a low-arousal-positive state currently produce zero post-state signal. Compounding practice produces compounding *missing data* unless this fixes.

---

## Word choice — locked Apr 29

**"Settled"** over alternatives:

- **"Calm"** — overlaps with the calm Reframe mode label and would create new confusion. The user would see "Reframe • Calm mode" as a label, then have to ask whether tapping the Calm chip *means* they want calm mode. The architecture is cleaner if these words don't collide.
- **"Steady"** — reads more cognitive than affective. Captures stable thinking but not bodily settledness; users in low-arousal-positive states often describe the body first ("my chest feels open," "shoulders down") not the mind.
- **"Calm and steady" / "At ease"** — multi-word, breaks the visual rhythm of the chip row (every other chip is one word).
- **"Okay"** — too neutral, doesn't anchor the positive valence; "okay" is also what users default to when they don't want to be asked.
- **"Regulated"** — clinical jargon, doesn't belong in the user-facing vocabulary.

**"Settled"** lives in both body and mind. It's a word people actually use to describe being grounded after intensity has passed ("I'm settled now," "let me settle"). It anchors low-arousal positive without colliding with mode labels.

---

## Where the chip appears

Settled is added to the canonical chip array. The chip array is referenced in (at minimum) these three locations in App.jsx:

1. **Line ~6512** — `feelChips` array inside the `showPostRating` block of ReframeTool. Used at the post-Reframe rating moment.
2. **Line ~8140** — duplicate array used in another flow. Both arrays must be updated identically — this should be consolidated to a single canonical export at refactor time, but for this build the simpler change is to update both in lockstep.
3. **Pre-state chip selection** at home / Reframe entry / Body Scan entry — all reference the same array directly or import from a shared source.

The chip ordering matters for Russell circumplex visual logic — the row should read left-to-right by quadrant grouping. **Recommended order:**

```
Excited · Focused · Settled · Anxious · Angry · Stuck · Mixed · Flat · Distant
```

Reasoning: high-arousal-positive (Excited, Focused) → low-arousal-positive (Settled) → high-arousal-negative (Anxious, Angry) → cognitive (Stuck, Mixed) → low-arousal-negative (Flat, Distant). This reads as a gradient from most-activated-positive to most-disconnected, with Settled as the regulated anchor between activation and intensity. If the visual row gets too long on narrow phones, the row already wraps — no layout change needed.

---

## Routing — what Settled does in the AI / tool architecture

Per the existing chip routing logic at App.jsx ~lines 5301-5317:

```
- excited / focused → hype mode (maintain momentum)
- stuck → clarity mode (cognitive fog → talk it out)
- distant → routes user to Body Scan instead of Reframe (hypoarousal, somatic re-engagement first)
- anxious / angry / mixed → calm mode + protective behaviors (Ghost Echo suppression, Self Mode nudge)
- flat → calm mode (default)
```

**Settled routes to calm mode but with a different intent.** Calm mode for Anxious/Angry/Flat is *bringing down activation*; Calm mode for Settled is *maintaining regulation*. The mode is the same; the AI's posture inside it should differ.

**Recommended Settled-specific behaviors:**

1. **Calm mode, with maintain-state framing.** AI doesn't try to regulate further — instead, it asks what the user wants to do *with* the regulated state. ("You're settled. What do you want to think through, now that you have the space?") This is the only chip that prompts toward use-the-state rather than change-the-state.

2. **No protective behavior suppression.** Anxious/Angry/Mixed trigger Ghost Echo suppression (don't reflect prior intensity back, don't surface earlier journal entries that could re-activate). Settled doesn't need this — the user is regulated; surfacing patterns is fine and possibly useful.

3. **Self Mode is available but not nudged.** Self Mode currently auto-suggests on Anxious/Angry/Mixed because those are the high-intensity states where metacognition skills are most needed. For Settled, Self Mode is reachable from the tab bar but not actively offered. The architecture trusts the user to choose.

4. **Post-session insight surfacing — yes.** This is one of the highest-leverage moments to surface a longitudinal pattern observation. ("Over the past two weeks, your Settled sessions cluster in the morning before 9am. Worth noting.") Settled state has the cognitive bandwidth to absorb pattern observations that Anxious/Angry sessions couldn't.

5. **What Shifted post-rating** — Settled appears as a post-state chip option (the most likely accurate option for users who came in Anxious and finished regulated). This is Settled's most data-valuable position in the flow.

---

## What the chip means — the ⓘ definition

Per the master todo ⓘ button work (separate item, not blocking this), each chip will have a tap-to-define affordance. Drafting Settled's ⓘ copy here so it ships ready:

> **Settled.** Low arousal, positive valence. Body soft, breath even, nervous system at rest. Mind clear without effort. Not high energy, not low energy — at-ease. The state regulation tools are designed to produce. Selecting Settled tells the system you're already in the regulated state and you want to use it, not change it.

About 40 words, fits the existing chip-definition cadence. Lives in the chip ⓘ entry registry once that ships; for now, captured here so it's not lost.

---

## What this is *not* — explicit non-scope

**No new mode added.** "Settled mode" is not a thing. Settled is a chip; calm mode handles it with different posture. Adding a fourth Reframe mode would be a much bigger architectural change and isn't needed.

**No new bio-filter state.** Bio-filter is hardware diagnostics (Activated, Medicated, Sleep, Depleted, Pain, Off-baseline, Baseline). Settled is an emotional state, not a hardware state. Don't conflate.

**No tutorial card update yet.** Defer until the chip ⓘ system ships and Settled is wired in. Both updates should happen as one tutorial pass.

**No FAQ entry update.** The existing chip FAQ entry (added Apr 29, draft in `/mnt/user-data/outputs/FAQ_DRAFTS.md`) already mentions the chip set generically. When Settled ships, add one paragraph to that entry covering the low-arousal-positive quadrant; don't write a separate Settled FAQ entry.

**No Signal Log retro-categorization.** Existing Signal Log entries use the eight-chip vocabulary. Don't backfill or recategorize. New entries from the Settled ship date onward will use the nine-chip vocabulary; older entries stay as-is. Mixing is fine — the data layer is timestamp-keyed.

**No analytics event for Settled specifically.** The existing chip-tap event logs the chip ID; Settled will appear in that data automatically as soon as users start tapping it. No new Plausible event needed.

---

## Implementation — exact changes

### 1. Update both `feelChips` arrays

App.jsx ~line 6512 and ~line 8140. Both arrays change from 8 entries to 9. Settled inserted after Focused:

```js
const feelChips = [
  { id: "excited", label: "Excited" },
  { id: "focused", label: "Focused" },
  { id: "settled", label: "Settled" },  // NEW
  { id: "anxious", label: "Anxious" },
  { id: "angry", label: "Angry" },
  { id: "stuck", label: "Stuck" },
  { id: "mixed", label: "Mixed" },
  { id: "flat", label: "Flat" },
  { id: "distant", label: "Distant" }
];
```

Note the reordering — Stuck moves from position 8 to position 6 to keep cognitive-states (Stuck, Mixed) together and low-arousal-negative (Flat, Distant) together. This is per the Russell circumplex visual grouping above.

### 2. Routing logic — App.jsx ~line 5304

The autoMode switch handles `excited`, `focused`, `stuck` explicitly and falls through to `calm` for everything else. Settled hits the `calm` fallback, which is correct.

**No code change needed in routing.** The chip lands in calm mode by default, which is the right behavior. The "maintain-state framing" recommendation above is an AI-prompt change, not a routing-code change.

### 3. AI prompt update — netlify/functions/reframe.js

In the calm mode prompt, add a Settled-specific branch. Pseudo-code:

```
if (feelState === "settled") {
  systemPromptAddition = "
The user has selected Settled. They are already regulated.
Posture: do not try to bring them down further or up further.
Ask what they want to think through or do with this regulated state.
Surface patterns and observations more freely than you would for activated states —
the user has the bandwidth to absorb them.
Do not suggest Self Mode unless directly asked.
";
}
```

Place after the existing protective-state branches (anxious/angry/mixed). One conditional, ~10 lines. The system prompt structure already supports this kind of state-specific addition.

### 4. PresentStateChips component — App.jsx ~line 6781

This is the chip row component used inside Reframe entry. It reads from a shared chip definition. If it currently imports/references a different list than the duplicates at 6512/8140, that list also needs updating. Audit before commit; one of the goals of this work is to leave the codebase in a state where the chip set is consistent across every appearance.

**Recommended sub-task:** if there's time during the same commit, consolidate the three chip-array definitions into a single exported constant at the top of App.jsx (e.g., `const FEEL_CHIPS = [...]`) and have all three locations import from it. Reduces future drift risk. Separate consideration — if it grows the diff too much, ship Settled first and consolidate later.

### 5. Plausible event check

Existing chip-tap logging captures the chip ID as a property. No event change needed; Settled will appear in the data automatically.

### 6. PROCESSING_TYPE_CHIP_LOGIC — confirm

Some chips are body-first-routing-relevant (Distant goes to Body Scan; Anxious/Angry go to Reframe with protective behaviors). Settled is **type-agnostic** — both thought-first and body-first users have access to it; both route to calm mode; behavior is identical regardless of regulation type.

---

## Edge cases

**User taps Settled, then types something distressed.** The AI's calm-mode-with-maintain-framing posture should override into normal calm mode if input content suggests actual distress. Standard input-content classification (the existing per-message clarity-vs-calm shift logic) handles this. The chip is the entry signal, not the locked-for-session signal.

**User selects Settled at morning check-in.** Signals a regulated start. AI's morning posture is unchanged; the chip just feeds into the bio-filter pairing and the daily record. No special morning-check-in behavior needed.

**Settled selected as What Shifted post-state after Reframe / Body Scan.** Highest-signal moment for this chip. Pre-state Anxious + post-state Settled = clear regulated shift, the gold-standard signal for the three-category data feed (Category A — Regulated shift). Schema-wise the three-category framework already accommodates this; once that ships, Settled will be the single most common Category A post-state value.

**User selects Settled three sessions in a row.** Genuine regulated practice. AI surfaces the pattern in post-session insight ("You've been Settled for three sessions running. Worth noticing what's working."). No protective behavior needed; this is healthy practice, not concerning state.

**Settled selected immediately at app launch with no recent sessions.** Possible the user just opened Stillform out of curiosity in a regulated state, not because they need regulation. Calm mode handles it — AI's first message can ask "what brings you here?" without assuming distress. Don't add gating; the state is what the user reports.

---

## Ship checklist

When Settled lands, verify:

1. **UAT dropdown** — add "Settled chip"
2. **Tutorial deck** — defer; batch with chip ⓘ system ship
3. **FAQ** — update existing chip FAQ entry (one paragraph, low-arousal-positive coverage). Don't write a separate entry.
4. **Transfer doc** — update chip set from 8 to 9 in any place chips are enumerated
5. **Plausible** — no new event; existing chip-tap event captures the new chip ID automatically
6. **Privacy policy** — no change
7. **Science Sheet** — add one line to the Pillar 1 / chip section: "The chip set spans all four quadrants of Russell's circumplex, including the low-arousal-positive state (Settled) added Apr 30, 2026 to close the regulated-state coverage gap."
8. **AI prompts** — add Settled branch to reframe.js calm mode prompt (per implementation step 3)
9. **Promo** — not promo-worthy as standalone; rolls into the larger "every regulated state is now an available label" Pillar 1 / Pillar 4 narrative
10. **Punch list** — verify both feelChips arrays updated, AI prompt updated, chip ⓘ entry copy captured
11. **Emotion coverage** — this work IS the emotion coverage fix; verify the chip row reads cleanly across the app at narrow phone widths after the change

---

## Build order — recommended

1. **Whole-app prestige refresh** (in progress) — needs to land before Settled because the new chip will use the calibrated component vocabulary directly
2. **Settled chip** (this spec)
3. **Body Scan What Shifted** (separate spec, blocked on Settled landing first)
4. **Three-category data feed** (Russell circumplex A/B/C — uses Settled in Category A scoring)
5. **Chip ⓘ system** (separate item) — Settled's definition copy is captured in this spec, ready when the ⓘ system ships
6. **Tutorial + FAQ updates** — single pass after both Body Scan What Shifted and three-category data feed are live

---

## Why this is a small lift

Most of the architecture is already there:

- **Chip array** — exists in two places, just add one entry to each
- **Routing logic** — Settled hits the calm fallback; no routing code change needed
- **Storage** — chip IDs are strings; new ID just works
- **Plausible** — chip-tap event already captures arbitrary chip IDs
- **AI prompt structure** — already has state-specific branches; add one more
- **Component rendering** — chip row already iterates the array; one more chip just renders

What's new: 1 array update (×2 locations), 1 AI prompt branch, 1 chip ⓘ definition (captured here, lives in registry when ⓘ system ships). ~25 lines of code total. Single commit.

The conceptual work — "what does Settled mean, where does it route, what AI posture does it produce, what's its position in the chip row" — is what this spec is for. The build itself is mechanical.

---

*ARA Embers LLC · Settled Chip Spec · April 30, 2026*
