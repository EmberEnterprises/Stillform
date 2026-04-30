# THREE_CATEGORY_DATA_FEED_SPEC.md
**Stillform — What Shifted three-category data feed implementation spec**
**ARA Embers LLC · April 30, 2026**

---

## What this is

Spec for the classifier function and downstream pipeline that converts every What Shifted moment (Reframe + Body Scan, both now equipped with What Shifted UI) into a **categorized longitudinal signal** rather than a raw chip pair. Implements the Russell-circumplex-grounded three-category framework already decided in master todo (Category A — Regulated shift, Category B — Persistent state, Category C — Concerning shift).

This is the work that makes the Settled chip + Body Scan What Shifted + Reframe What Shifted produce **architectural data**, not just inputs. Without it, those features capture useful signal that nothing reads. With it, the four-pillar architecture's Pillar 4 (neuroplasticity / compounding practice) earns its claim because every session contributes a comparable, classified data point to the user's longitudinal record.

---

## Why this gap matters

**Pillar 4 (neuroplasticity).** The compounding-practice claim depends on a longitudinal record that gets *more useful* over time. A raw chip pair (preState=anxious, postState=settled) has no scoring meaning by itself — it's just data. A categorized record (Category A) is a comparable unit that aggregates across sessions, weeks, and months into observable patterns.

**Privacy architecture (locked Apr 29).** The framework already decides:
- **Aggregate, anonymous → Plausible.** Stillform sees percentages across all users.
- **Per-user, encrypted, on-device → user's own My Progress.** Stillform never sees individual user data.

The classifier is the function that runs on-device (per-user view) and runs as an aggregate signal (Plausible event) at the same time. One function, two surfaces, zero individual user data ever leaves the device.

**Decision integrity.** The chip is the structured data. Free-text labels are for the user, not the dataset. The classifier reads the chip pair only — this rule is what makes data comparable across users without invading privacy.

**Without this spec, the Settled chip and Body Scan What Shifted ship as features that produce data the architecture doesn't read.** With it, every chip selection produces a learnable signal both for the user (My Progress patterns) and for Anthropic-anonymous aggregate insight (Plausible).

---

## The classifier — Russell circumplex mapping

### Chip placement on the Russell two-axis grid

Each chip maps to a (valence, arousal) coordinate:

```
                    HIGH AROUSAL
                         |
   [ANGRY]   [ANXIOUS]   |   [EXCITED]   [FOCUSED]
                         |
   - - - - - - - - - - - + - - - - - - - - - - - -
NEGATIVE                 |                    POSITIVE
                         |
   [DISTANT]    [FLAT]   |   [SETTLED]
                         |
                    LOW AROUSAL

[STUCK]   [MIXED] — cognitive states, span quadrants — see special handling
```

### Coordinate table (formal mapping)

```
chip      | valence | arousal | quadrant
----------|---------|---------|---------
excited   | +       | high    | HAP (high-arousal positive)
focused   | +       | high    | HAP
settled   | +       | low     | LAP (low-arousal positive)
anxious   | −       | high    | HAN (high-arousal negative)
angry     | −       | high    | HAN
flat      | −       | low     | LAN (low-arousal negative)
distant   | −       | low     | LAN — special: dissociative subtype
stuck     | −       | mid     | cognitive-fog — span
mixed     | mixed   | mid     | undifferentiated — span
```

### The three categories — formal rules

```
classifyShiftDirection(preState, postState, sessionContext) →
  "regulated" | "persistent" | "concerning" | null
```

**Category A — Regulated shift (the tool worked)**

Triggered when ANY of:
1. Pre-state in HAN or LAN, post-state in HAP or LAP. (Negative → positive valence shift.)
2. Pre-state in HAN, post-state in LAN excluding Distant. (High-arousal negative → low-arousal negative — came down off activation, valence unchanged but arousal regulated.)
3. Pre-state Stuck, post-state in any positive quadrant (HAP or LAP). (Cognitive fog cleared into clarity or settledness.)
4. Pre-state Mixed, post-state in any non-Mixed positive quadrant. (Differentiation toward positive.)

Returns: `"regulated"`

**Category B — Persistent state (no shift detected)**

Triggered when:
1. Pre-state and post-state in the same quadrant (HAP→HAP, LAP→LAP, HAN→HAN, LAN→LAN).
2. Pre-state and post-state are the same chip.
3. Pre-state Mixed → post-state Mixed.
4. Pre-state Stuck → post-state Stuck.
5. Pre-state Mixed → post-state any negative-quadrant chip. (Differentiation toward negative — naming as a more specific negative state isn't a regulated shift; it's the user identifying what the Mixed actually was. Useful signal but not Category A.)

Returns: `"persistent"`

**Important:** Persistent is not failure. Sometimes naming and holding a state IS the work. The category captures signal value without scoring quality.

**Category C — Concerning shift (needs human attention pattern)**

Triggered when ANY of:
1. Pre-state in any quadrant, post-state Distant. (Routing into dissociation regardless of starting point.)
2. Pre-state Distant, post-state Distant. (Sustained dissociation across the session.)
3. Sustained Flat across **5 or more consecutive sessions** within a 14-day window. (Computed at session-time using the session context — not by looking at this single shift.)
4. Persistent HAN (Anxious or Angry pre AND post) across **5 or more consecutive sessions** within a 14-day window. (High-arousal negative without ability to come down.)

Returns: `"concerning"`

**Critical scope note:** Category C is a pattern-level classifier, not a per-session judgment. Cases 1 and 2 are per-session (any user can hit them once); cases 3 and 4 require pattern context. The function takes `sessionContext` to read recent history when needed.

**Why this matters:** Most Distant post-states are Category C cases 1 or 2, not 3 or 4 — that's correct, those are the per-session concerning shifts (a single Distant post-state is signal worth surfacing). Cases 3 and 4 catch the sustained-pattern users who never tag Distant but never come down either.

### Edge cases the classifier must handle

**No pre-state chip captured.** User started a session without selecting a feel chip. The classifier returns `null` (uncategorizable). This signal is logged as `category: null` with a `nullReason: "no-pre-state"` field for data integrity. Doesn't break the pipeline; just doesn't contribute to A/B/C aggregates.

**Pre-state captured, no post-state (user skipped What Shifted).** Returns `null` with `nullReason: "skipped"`. The skip itself is its own signal, captured separately by the skip-event logging in Reframe and Body Scan What Shifted (per their respective specs). Don't double-log.

**User picks the same chip pre and post but in fact moved through a state.** Classifier returns `"persistent"` because the chip is the structured data. The free-text label might describe a real shift, but the rule is locked: free text doesn't override chip. Comparable data wins over interpretive data. This is by design.

**Settled appears as pre-state.** Possible — user opened Stillform regulated, just for practice. Pre-state Settled + post-state Settled = `"persistent"` (LAP→LAP). Pre-state Settled + post-state HAN = `"concerning"` only if it triggers case 3 or 4 patterns; otherwise it's just a Category B signal (LAP→HAN is a quadrant shift, but the per-session rule for "concerning" doesn't fire because it requires Distant or sustained patterns). This case enters the data as `category: null` with `nullReason: "regulated-to-negative-non-pattern"` — a real edge case but rare enough it doesn't need its own category. Worth tracking for future framework refinement.

**Both pre and post are cognitive (Stuck/Mixed).** Stuck → Mixed = `"persistent"`; Mixed → Stuck = `"persistent"`. Neither is regulated nor concerning by itself.

---

## Schema — per-event log fields

When What Shifted completes (Reframe State-to-Statement OR Body Scan What Shifted), the event log entry includes:

```js
{
  id: "shift_<timestamp>_<random>",
  schemaVersion: 1,
  timestamp: "<ISO 8601>",
  date: "<TimeKeeper.clockDay()>",
  stillformDate: "<TimeKeeper.stillformDay()>",

  // Source identification
  source: "reframe-state-to-statement" | "body-scan-what-shifted",
  sessionTimestamp: "<sessions key>",  // joins to session record
  toolId: "reframe" | "scan",
  toolMode: "calm" | "clarity" | "hype" | null,  // null for body-scan

  // The chip pair (the structured data)
  preState: "<chip-id>" | null,
  postState: "<chip-id>" | null,

  // The classification (computed at write-time, never recomputed)
  category: "regulated" | "persistent" | "concerning" | null,
  nullReason: "no-pre-state" | "skipped" | "regulated-to-negative-non-pattern" | null,

  // Free text — for the user only, never aggregated
  shiftLabel: "<user free text>" | null,
  hasLabel: true | false,

  // Session context at time of write (frozen — for retroactive analysis)
  bioFilter: ["<bio-filter-id>", ...],
  sessionCount: <integer>,
  regulationType: "thought-first" | "body-first",

  // Pattern-classification context (read-only at write-time)
  recentSustainedFlat: <integer>,    // count of consecutive Flat sessions in last 14 days
  recentSustainedHAN: <integer>,     // count of consecutive HAN sessions in last 14 days
}
```

**Schema versioning.** `schemaVersion: 1` is critical. The classifier rules will likely evolve (additional cases, refinements based on real data). Each entry locks in the version it was classified under. Future re-classification passes (if needed) can be done deliberately, not silently.

**Computed at write-time, never recomputed.** Once `category` is written, it doesn't change. If we later add Category D or refine Category C rules, existing entries keep their original classification. New entries use the new rules. This preserves data integrity.

**Storage:** new localStorage key `stillform_shift_events`. Same `secureSet`/`secureGet` AES-GCM encryption pattern as other sensitive keys (per encryption extension Phase 2.0+). Capped at 2000 entries (~3 years of daily-practice density). Old entries dropped from the local cache after that — but if export-to-PDF is wired up before then (per master todo), users can keep their full history offline.

---

## Implementation — the classifier function

Add to a new code section near the top of App.jsx, alongside `TimeKeeper`:

```js
// ─────────────────────────────────────────────────────────────────────────────
// SHIFT CLASSIFIER — Russell circumplex three-category framework
// Russell 1980 (J. Pers. Soc. Psychol. 39:1161-1178), confirmed Watson 2024
// Master todo "What Shifted data feed — three-category positive selection framework"
// ─────────────────────────────────────────────────────────────────────────────

const SHIFT_CHIP_QUADRANTS = {
  excited:  { valence: "+", arousal: "high", quadrant: "HAP" },
  focused:  { valence: "+", arousal: "high", quadrant: "HAP" },
  settled:  { valence: "+", arousal: "low",  quadrant: "LAP" },
  anxious:  { valence: "-", arousal: "high", quadrant: "HAN" },
  angry:    { valence: "-", arousal: "high", quadrant: "HAN" },
  flat:     { valence: "-", arousal: "low",  quadrant: "LAN" },
  distant:  { valence: "-", arousal: "low",  quadrant: "LAN-distant" },
  stuck:    { valence: "-", arousal: "mid",  quadrant: "cognitive" },
  mixed:    { valence: "mixed", arousal: "mid", quadrant: "undifferentiated" }
};

const SHIFT_CATEGORY_PATTERN_THRESHOLD = 5;   // consecutive sessions
const SHIFT_CATEGORY_PATTERN_WINDOW_DAYS = 14;

const SHIFT_SCHEMA_VERSION = 1;

function classifyShiftDirection(preState, postState, sessionContext = {}) {
  // Null-handling first
  if (!preState && !postState) return { category: null, nullReason: "no-pre-state" };
  if (!preState) return { category: null, nullReason: "no-pre-state" };
  if (!postState) return { category: null, nullReason: "skipped" };

  const pre = SHIFT_CHIP_QUADRANTS[preState];
  const post = SHIFT_CHIP_QUADRANTS[postState];
  if (!pre || !post) return { category: null, nullReason: "unknown-chip" };

  // CATEGORY C — concerning (per-session cases first)
  if (post.quadrant === "LAN-distant") {
    return { category: "concerning", subcategory: "distant-post-state" };
  }

  // CATEGORY C — concerning (pattern cases)
  const recentFlat = sessionContext.recentSustainedFlat || 0;
  const recentHAN = sessionContext.recentSustainedHAN || 0;
  if (recentFlat >= SHIFT_CATEGORY_PATTERN_THRESHOLD &&
      post.quadrant === "LAN" && postState === "flat") {
    return { category: "concerning", subcategory: "sustained-flat" };
  }
  if (recentHAN >= SHIFT_CATEGORY_PATTERN_THRESHOLD && post.quadrant === "HAN") {
    return { category: "concerning", subcategory: "sustained-HAN" };
  }

  // CATEGORY A — regulated shift
  if ((pre.quadrant === "HAN" || pre.quadrant === "LAN") &&
      (post.quadrant === "HAP" || post.quadrant === "LAP")) {
    return { category: "regulated", subcategory: "negative-to-positive" };
  }
  if (pre.quadrant === "HAN" && post.quadrant === "LAN" && postState !== "distant") {
    return { category: "regulated", subcategory: "high-arousal-down" };
  }
  if (preState === "stuck" && (post.quadrant === "HAP" || post.quadrant === "LAP")) {
    return { category: "regulated", subcategory: "stuck-to-clarity" };
  }
  if (preState === "mixed" && (post.quadrant === "HAP" || post.quadrant === "LAP") &&
      postState !== "mixed") {
    return { category: "regulated", subcategory: "mixed-to-positive" };
  }

  // CATEGORY B — persistent (default for everything else where chips matched)
  if (pre.quadrant === post.quadrant) {
    return { category: "persistent", subcategory: "same-quadrant" };
  }
  if (preState === postState) {
    return { category: "persistent", subcategory: "same-chip" };
  }
  if (preState === "mixed" && post.valence === "-") {
    return { category: "persistent", subcategory: "mixed-to-negative-differentiation" };
  }

  // Edge case: regulated → non-pattern negative
  if ((pre.quadrant === "HAP" || pre.quadrant === "LAP") &&
      (post.quadrant === "HAN" || post.quadrant === "LAN")) {
    return { category: null, nullReason: "regulated-to-negative-non-pattern" };
  }

  // Final fallback
  return { category: "persistent", subcategory: "unmatched-rule" };
}
```

The function is **pure** — same inputs always produce same output. No side effects. Easy to unit-test (which we should add when the build lands; pattern is well-established for testing classifier functions).

---

## Pattern-context computation

The classifier takes `sessionContext.recentSustainedFlat` and `sessionContext.recentSustainedHAN` as inputs. These need to be computed before the classifier is called. New helper function:

```js
function getRecentSustainedPatterns(shiftEvents) {
  // Read recent shift events; count consecutive sessions ending in Flat or HAN
  // within the 14-day window. Reset counter on any non-matching session.
  const cutoff = TimeKeeper.daysAgoMs(SHIFT_CATEGORY_PATTERN_WINDOW_DAYS);
  const recent = (shiftEvents || [])
    .filter(e => e.timestamp && new Date(e.timestamp).getTime() > cutoff)
    .filter(e => e.postState)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  let sustainedFlat = 0;
  let sustainedHAN = 0;
  let breakingFlat = false;
  let breakingHAN = false;

  for (const event of recent) {
    if (!breakingFlat) {
      if (event.postState === "flat") sustainedFlat++;
      else breakingFlat = true;
    }
    if (!breakingHAN) {
      if (event.postState === "anxious" || event.postState === "angry") sustainedHAN++;
      else breakingHAN = true;
    }
    if (breakingFlat && breakingHAN) break;
  }

  return { recentSustainedFlat: sustainedFlat, recentSustainedHAN: sustainedHAN };
}
```

Called before classification. Reads from the same `stillform_shift_events` localStorage key.

---

## Where it gets called — wiring into Reframe + Body Scan

### Reframe — `finishStateToStatement` (App.jsx ~line 6260)

Existing handler clears feelState on completion. Add classifier call before that:

```js
const finishStateToStatement = () => {
  // ... existing logic ...

  // CLASSIFY THE SHIFT — new
  const shiftEvents = readShiftEventsFromStorage();
  const patternContext = getRecentSustainedPatterns(shiftEvents);
  const sessionContext = {
    ...patternContext,
    bioFilter: getCurrentBioFilter(),
    sessionCount: getSessionCountFromStorage(),
    regulationType
  };
  const { category, subcategory, nullReason } = classifyShiftDirection(
    feelState,
    postRating,        // Reframe's existing post-rating chip captures the post-state
    sessionContext
  );

  // Build and persist the shift event
  appendShiftEventToStorage({
    id: `shift_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    schemaVersion: SHIFT_SCHEMA_VERSION,
    timestamp: new Date().toISOString(),
    date: TimeKeeper.clockDay(),
    stillformDate: TimeKeeper.stillformDay(),
    source: "reframe-state-to-statement",
    sessionTimestamp: sessionShareSummary?.timestamp || null,
    toolId: "reframe",
    toolMode: effectiveMode,
    preState: feelState || null,
    postState: postRating || null,
    category,
    subcategory: subcategory || null,
    nullReason: nullReason || null,
    shiftLabel: externalAnchorDraft.trim() || null,
    hasLabel: externalAnchorDraft.trim().length > 0,
    bioFilter: sessionContext.bioFilter,
    sessionCount: sessionContext.sessionCount,
    regulationType,
    recentSustainedFlat: patternContext.recentSustainedFlat,
    recentSustainedHAN: patternContext.recentSustainedHAN
  });

  // Plausible aggregate event — anonymous, percentages only
  try {
    window.plausible("Shift Classified", {
      props: {
        category: category || "null",
        subcategory: subcategory || "none",
        tool: "reframe",
        mode: effectiveMode
      }
    });
  } catch {}

  // ... existing feelState clear + queueDebriefAndComplete ...
};
```

### Body Scan What Shifted — `handleWhatShiftedLockIn` (per separate spec)

Mirror the same pattern. Same classifier call. Same Plausible event with `tool: "body-scan"`.

### Skip cases — `skipStateToStatement` and `handleWhatShiftedSkip`

Skip events log `category: null, nullReason: "skipped"` and fire a separate Plausible event `Shift Skipped` (already specced). Don't run the classifier; the answer is mechanically null.

---

## My Progress surfacing — the user view

Per the My Progress redesign spec, the data feed surfaces in the **Patterns and Intelligence** section. Specific surfaces:

**1. Headline pattern (top of My Progress).** The single most-active pattern from the user's last 14 days. Examples:
- "Your tools are landing — 12 of your last 18 sessions ended Category A (regulated)."
- "You've been holding intensity — 9 of your last 14 sessions stayed in HAN. Naming and holding is part of the work."
- "Stuck has been clearing reliably — last 5 Stuck sessions all ended in HAP or LAP."

The headline is computed by reading the last 14 days of shift events and surfacing the largest signal. Replaces nothing; it's a new top-of-page element.

**2. Compounding view (3-line chart).** The line chart in the redesign spec shows three series across time:
- Category A rate (%)
- Category B rate (%)
- Category C rate (%)

12-week sliding window. Lines are the same hairline weight as the rest of the design; no fills, no animation. The y-axis is percentage, x-axis is week. References Lehrer 2020 (HRV biofeedback compounding) and Brewer 2011 (mindfulness skill compounding) in a small caption below the chart — earns the Pillar 4 neuroplasticity claim with citation.

**3. Tool-specific Category A rate.** Small mono-typed line: "Reframe Cat-A: 67% · Body Scan Cat-A: 71%." Surfaces which tool is landing better per the user's data. No editorializing, just numbers.

**4. Concerning patterns.** Surfaces only when relevant. If the user has a sustained Category C pattern, a quiet section appears: "You've had 6 sessions ending Distant in the last two weeks. This is the kind of pattern that benefits from talking to someone you trust." Crisis resources surfaced inline. No alarm framing; this is signal, not warning.

All four are read-only surfaces of the data feed — no separate computation, just display logic.

---

## Plausible aggregate events — what Stillform sees

**One event type total: `Shift Classified`.** Properties:
- `category`: "regulated" | "persistent" | "concerning" | "null"
- `subcategory`: the granular subtype string
- `tool`: "reframe" | "body-scan"
- `mode`: "calm" | "clarity" | "hype" | "none"

**No user identifiers. No chip values. No timestamps beyond what Plausible captures by default.** Stillform's view of the data is a histogram across categories, tools, and modes — never per-user.

**Aggregate insights Stillform can derive (examples):**
- "Across all users this week: 34% Category A, 51% Category B, 12% Category C, 3% null."
- "Reframe calm mode has higher Category A rate (38%) than Reframe hype mode (22%)."
- "Body Scan Category A rate is highest in users with `pain` in their bio-filter (68%)."
- "Category C rate trends up Mondays."

These are research-grade signals about the architecture's effectiveness without invading any individual user's privacy. The data feed is what makes Stillform able to refine the architecture over time without compromising trust.

**What Stillform never sees:**
- Which user had which chip
- Any free-text shift label
- Per-user time series
- Any correlation between user identity and category

The privacy architecture is preserved because the classifier produces a category at session-time, the category is the only thing that goes to Plausible, and Plausible's own architecture aggregates without identifiers.

---

## What this is *not* — explicit non-scope

**No new categories beyond A/B/C.** The framework is locked at three. If real data shows a fourth pattern needs its own category, that's a future spec, not this one. Schema versioning is in place for that future.

**No AI-context injection of category.** The AI doesn't see "user is in Category A" as an input. The AI sees the chip (via existing feelState plumbing). Category is a downstream classification for the user's view + aggregate signal — not an upstream input that changes AI behavior. This rule keeps the AI's behavior driven by the live state, not by retrospective scoring.

**No retroactive classification of pre-spec sessions.** Sessions completed before this ships have no chip pair captured (Body Scan didn't ask, Reframe sometimes did). Retroactive backfill would create a phantom dataset that misrepresents history. New sessions from ship date forward; old sessions stay as-is in the session record without category fields.

**No cross-user comparison surfacing in My Progress.** Each user sees their own categorized data. No "you're in the top 30% of regulated practitioners" framing. That would require Stillform to know user identities and compare them, which the privacy architecture forbids. The user's comparison is to their own trajectory — that's the point.

**No notification or alert behavior on Category C.** Quiet surfacing in My Progress only. No push notifications, no banner alerts, no auto-routing to crisis resources. The user discovers the pattern; the architecture doesn't push it on them. Category C with sustained Distant or sustained-HAN-without-shift carries the inline mention of talking to someone — that's the intervention. No more.

**No tutorial or FAQ entry yet.** Defer until tutorial pass batches with Settled chip + Body Scan What Shifted (single user-facing copy update covering all three).

---

## Ship checklist

When the data feed lands:

1. **UAT dropdown** — add "Shift classifier"
2. **Tutorial deck** — defer; batch with Settled + Body Scan What Shifted single tutorial pass
3. **FAQ** — add one entry: "How does Stillform measure whether sessions are working?" Short answer covers the three categories and the privacy rule (chip is data, free text is yours, Stillform sees aggregates only). One paragraph each on A/B/C with the science citation.
4. **Transfer doc** — add the classifier rules and the privacy architecture summary to the technical reference section
5. **Plausible** — `Shift Classified` event with the four props specced; verify event arrives in dashboard with no PII
6. **Privacy policy** — add one line: "Stillform classifies your session shifts into three anonymous categories (regulated, persistent, concerning) for your own pattern surface. Aggregate, anonymous category counts are sent to our analytics — never your individual chip selections, free-text labels, or any data that could identify you."
7. **Science Sheet** — add the classifier framework as a new subsection under Pillar 4. Cite Russell 1980, Watson 2024 (replication), and Lieberman 2007 (affect labeling as the underlying mechanism that makes the chip selection itself a regulation event).
8. **AI prompts** — no change. AI sees chips; classifier is downstream.
9. **Promo** — worth a small mention in launch copy: "Every session leaves a categorized signal. Your patterns become visible." Don't lead with it; this is depth, not headline.
10. **Punch list** — verify classifier function unit-testable; verify shift events encrypt at storage; verify Plausible event has no PII; verify My Progress surfaces are read-only views, not recomputations.
11. **Emotion coverage** — depends on Settled chip having shipped (Settled is part of the LAP quadrant the classifier maps). Order matters.

---

## Build order — recommended

1. **Whole-app prestige refresh** (in progress)
2. **Settled chip** ships — needs to be in the chip set before classifier runs
3. **Body Scan What Shifted** ships — adds the second What Shifted source the classifier reads
4. **Three-category data feed** (this spec) — classifier function + storage + wiring into both Reframe + Body Scan + My Progress surface
5. **Tutorial + FAQ batch update** — single user-facing copy pass covering Settled, Body Scan What Shifted, and the three-category framework

Each step is its own commit. Each unblocks the next.

---

## Why this is a moderate-sized lift

What's already there:
- **Chip array** — Settled added in step 2; classifier reads from the chip ID strings
- **Reframe What Shifted UI** — exists; just adds classifier call before the existing feelState clear
- **Body Scan What Shifted UI** — exists per separate spec; same classifier call pattern
- **localStorage helpers** — pattern exists (`appendToolDebriefToStorage`); add one more (`appendShiftEventToStorage`)
- **Plausible events** — pattern exists; add one more event type
- **Encryption** — `secureSet`/`secureGet` already in place; new key wraps via existing infrastructure

What's new:
- **Classifier function** (`classifyShiftDirection`) — ~80 lines of mostly conditional logic; pure function; testable
- **Pattern context helper** (`getRecentSustainedPatterns`) — ~30 lines; reads recent shift events
- **Schema constants and chip quadrant map** — ~30 lines of data
- **Two wiring sites** — finishStateToStatement (Reframe) and handleWhatShiftedLockIn (Body Scan) — ~25 lines each
- **My Progress data layer** — read-only computation of headline pattern, three-line chart series, tool-specific Cat-A rates, concerning-pattern surface — most of this is in the My Progress redesign spec; this spec adds the source data shape it reads from

**Total: ~250 lines of code for the classifier + storage + wiring. My Progress surfacing lands inside the My Progress redesign work, not this commit.** Single classifier-and-wiring commit, then one or two follow-up commits for My Progress integration if scope warrants.

---

*ARA Embers LLC · Three-Category Data Feed Spec · April 30, 2026*
