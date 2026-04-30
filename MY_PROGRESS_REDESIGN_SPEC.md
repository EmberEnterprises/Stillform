# MY PROGRESS — REDESIGN SPEC
**ARA Embers LLC · April 30, 2026 · Pillar 4 (Neuroplasticity) anchor screen**

---

## What this spec is

A redesign of the My Progress screen grounded in Pillar 4 (neuroplasticity) science from your Science Sheet, addressing your specific feedback that the current screen is "data heavy" with "redundancy" and that data needs to "show trends, patterns" rather than raw counts. The new architecture moves heavy computation backend / PDF and surfaces only patterns the user actually needs to see in the live screen.

This spec is design-complete except for visual treatment, which is held until the whole-app visual refresh defines the design system. When that lands, this spec is ready to build into it.

---

## Diagnosis of the current screen

### What the data layer captures (rich and correct)

The MyProgress component computes 30+ derived metrics from session, journal, focus check, AI notes, loop completion, debrief, signal/bias profile, and grounding data. The data architecture is strong. The component already calculates:

- Session count, streak, day set, sessions-with-ratings, avg delta
- Tool counts and top tool
- Emotion frequency, signal frequency, trigger frequency, outcome frequency
- Recent vs prior duration trend (positive = catching it earlier)
- Recent vs prior autonomous exit trend (last 30d vs prior 30d)
- Loop completion percentages (morning, evening, 14d combined)
- Loop dropoff and nudge recovery rates
- Default pattern accuracy (user stuck to body-first/thought-first per calibration)
- Switch agility (within-day tool switching)
- Focus check accuracy, inhibition, reaction-time deltas across sessions
- Recovery speed from high activation
- Acute shift rate (30d)
- Follow-through % from drafted actions

**Conclusion: the computation layer doesn't need to change.** The UI layer is what's wrong.

### What the current UI does (the problem)

Eight collapsible sections rendered in sequence:

1. **Observer growth** (proof areas — Signal Awareness hero card + Recovery + Check-in consistency + Cleaner choices)
2. **Composure telemetry** — 12-week activity heat map
3. **Proof — outcome and protocol evidence**
4. **Shareable composure card** — exportable artifact
5. **Additional stats — supporting stats**
6. **My patterns — diagnostic intelligence**
7. **AI session notes**
8. **Saved Reframes**

Plus: full inline Pulse (Signal Log) at the bottom, not in an accordion.

The redundancy you flagged is real and visible:
- "Observer growth" and "Proof" both surface session-rating delta data, just framed differently
- "Additional stats" and "Composure telemetry" both surface activity counts and cadence
- "Recovery when needed" in Observer growth and recovery-speed metrics in Proof overlap
- Streak appears in multiple places (top stats, telemetry, sometimes Observer growth)
- Three places reference "follow-through from drafted actions"

The information layer is doing the same job three different ways. That's why it feels heavy.

### The deeper problem (the science gap)

**The current screen presents data, not patterns.**

A streak count of 7 is data. "You've held your morning practice 7 days running — that's the window where new behavior consolidates from effort to default" (Wood & Rünger 2016) is the same data presented as the science earning the Pillar 4 claim. The computation is identical. The presentation is the difference.

Pillar 4 from your Science Sheet:
> *"Schultz (1998) on dopamine and reward prediction error + Wood & Rünger (2016) on habit formation — streak tracking and pattern recognition wire practice in via positive prediction error (grounds streaks as actual learning, not gamification)."*
>
> *"Stillform does not market neuroplasticity. It uses the science to design the practice so that practice actually compounds."*

My Progress is the screen where compounding has to *be visible*. If the screen reads as a stats dashboard, it doesn't earn that. It earns it when the user sees their own brain rewiring — the specific shift that the science says is happening.

---

## Design principles for the redesign

These govern the rebuild. They're how I'll evaluate every UI decision against the goal.

**1. Patterns over counts.** No raw number that doesn't carry a trend or comparison. "7-day streak" alone is data. "7 days, your longest run yet" is a pattern. "47 sessions" is data. "Sessions are getting 1.3 minutes shorter on average — you're catching it earlier" is a pattern.

**2. Compress to non-redundant surface.** Reduce eight sections to four or fewer. Each section answers a different question. No two sections present the same data with different framing.

**3. Live screen = trends + patterns. PDF/export = full diagnostic data.** The user looking at My Progress sees what's compounding. The user who wants to take their data to a clinician, partner, or quantitative review exports the PDF where every metric exists with full granularity. This separation is the architectural fix.

**4. Earn the Pillar 4 claim.** Each pattern surfaced needs a small science citation or mechanism note that a curious user can tap to see why this number means anything. Lieberman 2007 reactivity reduction. Wood & Rünger habit consolidation. Brewer 2011 trait-level DMN reduction. Schultz 1998 reward prediction error. The science is already in your Science Sheet — surface it where the patterns appear.

**5. Privacy architecture honored.** Everything in My Progress remains on-device only. Stillform never sees individual user data. Aggregate Plausible events stay aggregate. PDF export is local generation, no cloud round-trip required.

**6. Default to the headline.** A user opening My Progress should see the most important pattern from their last 30 days within 1-2 seconds of loading. Not a navigation menu. Not "tap to expand." The headline pattern lives at the top, always.

**7. Visual restraint pending design system.** This spec doesn't lock visual treatment. Cards, accordions, charts, sparklines — the design system from the whole-app refresh decides the vocabulary. Spec is structural and content-level only.

---

## The redesigned structure

### Four sections, in this order

**1. The headline pattern** (always visible, no expansion required)
**2. The compounding view** (12-week trend visualization)
**3. Patterns and intelligence** (what's true about *you* specifically)
**4. Archive and export** (raw history + PDF)

That's it. Four. Down from eight.

The sections that disappear: Observer growth (folded into headline), Proof (folded into compounding), Additional stats (compressed into compounding), Shareable composure card (moved into export), AI session notes (moved into archive), Saved Reframes (moved into archive), inline Pulse (kept but visually quieter, integrated into archive).

Each section below is specced with: what it shows, what data backs it, what the user takes away, what gets cut.

---

### Section 1 — The headline pattern

**Purpose:** Within seconds of opening My Progress, the user sees the single most important pattern from their recent practice. No navigation. No menu. The thing that's actually compounding for them right now is the first thing they see.

**Content rules:**
- One headline pattern, surfaced based on what's strongest in the last 30 days
- Calculated by ranking available patterns by signal strength and recency, pick the top one
- A small "what this means" affordance opens a science note (mechanism + citation) the user can read or dismiss

**Pattern selection logic (priority order, take first that qualifies):**

1. **First-time autonomous exit** — if `autonomousExits === 1` in the last 30 days, headline is "First time you saw it and didn't need a tool. The observer just activated." Mechanism: Wells 2009 Detached Mindfulness — meta-awareness becoming automatic.

2. **Reactivity reduction trend** — if `secondAvg > firstAvg` AND `sessionsWithRatings >= 6`, headline is "Your sessions are landing softer. Average state shift is up [X] over your earlier sessions." Mechanism: Lieberman 2007 — repeated affect labeling reduces amygdala reactivity to recurring triggers.

3. **Catching-it-earlier trend** — if `durationTrend > 0.5` AND `timedSessions.length >= 6`, headline is "You're catching it [X] minutes earlier than you used to. The signal is registering before it drives action." Mechanism: Meichenbaum 1985 stress inoculation — practice when calm makes regulation available under pressure.

4. **Habit consolidation milestone** — if `streak === 7 || streak === 14 || streak === 30`, headline is "[N] days running. You're in the window where new behavior consolidates into default." Mechanism: Wood & Rünger 2016 — habit formation timeline; Schultz 1998 — dopamine reward prediction error wires practice in.

5. **Pattern recognition emerging** — if a recurring trigger or thought has appeared 3+ times in journal entries, headline is "[Pattern] has shown up [N] times this month. Recognition is the regulation." Mechanism: Wells 2009 MCT pattern surfacing.

6. **Recovery speed improvement** — if `recoverySpeedMinutesForProof` decreased between recent and prior 30d, headline is "Recovery from high activation is [X] minutes faster than it was. The vagal pathway is getting trained." Mechanism: Lehrer 2020 — repeated HRV practice produces autonomic flexibility gains.

7. **Default state** (first 7 sessions or no qualifying pattern) — "You've practiced [N] times. The data layer is building. Patterns surface around session 8-10."

**Visual treatment (held for design system):**
- Single hero card or full-width statement at top of screen
- Accent color (whatever the design system specifies for "this matters")
- Small ⓘ button to expand the science note
- Below the headline: 1-2 supporting micro-numbers (streak, sessions completed) — small, secondary, not competing for attention

**What gets cut from the current implementation:**
- Observer growth section header (the headline IS observer growth, no need to label it)
- The four-card grid of Signal Awareness / Recovery / Check-in consistency / Cleaner choices (these break apart and recombine — the strongest one becomes the headline, the others move into Section 3 as patterns)
- "Recovery when needed" as standalone card (becomes a pattern in Section 3 if the trend exists)
- Multiple competing accent treatments

---

### Section 2 — The compounding view

**Purpose:** Show the user the shape of their practice over time. This is the screen-level visualization of the Pillar 4 claim. Not a heat map of activity counts (that's gamification). A visualization of the metrics that actually compound.

**Content:**

A 12-week timeline showing three parallel lines or sparklines:

1. **Reactivity line** — 7-day rolling average of post-session minus pre-session rating delta. Trending up = getting softer landings. Lieberman 2007.
2. **Catch-time line** — 7-day rolling average of session duration. Trending down = catching it earlier. Meichenbaum 1985.
3. **Independence line** — 7-day rolling count of autonomous/self-regulated exits. Trending up = needing tools less. Wells 2009 detached mindfulness becoming default.

Each line gets a small label and a science citation tap. The chart is the central visual element of Section 2. Not three separate charts. Three lines on one timeline so the user can see them moving together.

Below the chart, a small text summary in plain language:

*"Over the last 12 weeks, your reactivity is [trending softer / holding steady / increasing]. Sessions are [getting shorter / about the same / getting longer]. You needed tools [less / about the same / more] often."*

That's it. Three trend lines. One sentence interpretation. No raw numbers cluttering the screen.

**Data already exists for this:**
- `sessionsWithRatings` array → 7-day rolling delta average
- `timedSessions` array → 7-day rolling duration average
- `autonomousExits` filter on sessions → 7-day rolling count

**What gets cut:**
- The current "Composure telemetry" 12-week activity heat map (counting events doesn't show compounding — it shows activity. Replaced by trend lines that show the shape of the practice changing.)
- The "Proof — outcome and protocol evidence" section (its data folds into the trend lines and into Section 3)
- The "Recovery when needed" / "Recovery speed" duplicate framings (one trend line covers it)
- Loop completion percentages as a separate display (folded into Section 3)
- "Switch agility" as a top-level metric (moved to PDF export — interesting but not headline)

**Visual treatment (held for design system):**
- Chart treatment depends on design system — could be sparklines, area chart, line chart, dot plot
- Y-axis values likely don't need to be labeled in the live view — the *shape* is the message, not the magnitudes
- Hover/tap on a line shows exact value at that week
- Below the chart: clear two-line text summary

---

### Section 3 — Patterns and intelligence

**Purpose:** What's true about *this user specifically* that they wouldn't see without the data. This is the section where "My Patterns — diagnostic intelligence" already lives in the current implementation. Keeps that framing, tightens content.

**Content (each as a small distinct pattern card):**

Surface only patterns that have actually emerged in this user's data. Don't render the card if the pattern hasn't reached threshold. Real ones, in priority order:

1. **Default tendency vs actual practice** — "Your calibration is [thought-first / body-first]. Over the last 30 days, [X]% of your tools matched that default. [Insight]." Insight wording differs by alignment: high alignment = "Your default is steady." Low alignment = "You're regulating across both pathways. That's range, not inconsistency."

2. **Recurring triggers** — top 3 trigger types from journal data, displayed as a list with counts. Headline: "Three triggers showed up most this month: [trigger] ([N]), [trigger] ([N]), [trigger] ([N])." Insight: "Naming them is the first half of regulation."

3. **Recurring body signals** — top 3 signal areas from journal data. "Your body locks it in [region], [region], [region] most." Insight: "These are your interoceptive markers — the early warning system."

4. **Most-used tool** — "[Tool] is your most-used regulator ([N]/[total] sessions)." Insight: matches calibration → "consistent with your default." Doesn't match → "You've found a different anchor than your calibration suggested."

5. **Most-named distortion** — if bias profile has data, top distortion from saved Reframes / journal / Self Mode Name step structure tags. "[Distortion] is the thought-shape that fires most often." Insight: "Naming the form weakens the grip. Lieberman 2007."

6. **Loop adherence** — "[X]% of mornings, [Y]% of evenings completed in the last 14 days." Only show if completion is genuinely above or below threshold. Suppress if mid-range and uninteresting.

7. **Time-of-day pattern** — if sessions cluster at specific times, surface it. "Most sessions happen between [time] and [time]." This is informational only — no insight needed; the user notices the pattern themselves.

**Pattern card structure (each):**
- Bold pattern statement (1 line)
- Optional supporting numbers (1 line)
- Small italic insight or mechanism (1 line)
- Optional "what this means" tap → small science modal

**Threshold logic:**
- Only surface patterns where data exists at meaningful volume (e.g., minimum 3 occurrences for trigger frequency, minimum 5 sessions for default tendency, etc.)
- If fewer than 3 patterns qualify, show a single line: "More patterns surface around session 8-10. Keep going."

**What gets cut:**
- "AI session notes" section (move to archive — these are reference content, not patterns)
- "Saved Reframes" section (move to archive — same reasoning)
- The inline Pulse / Signal Log (move to archive)
- The "Composure telemetry heat map" (cut entirely — replaced by Section 2 trend lines)
- The shareable composure card (moves to Section 4 export)
- "Additional stats" section (the genuinely useful stats moved into pattern cards; the rest moves to PDF)

---

### Section 4 — Archive and export

**Purpose:** Where the user goes when they want history (read past Reframes, see AI session notes, scroll Pulse) or when they want to export full data for deeper review.

**Content:**

Three subsections, each as a single tappable row that opens its own view:

1. **Reframe history** — list of saved Reframes, chronologically. Each entry tappable to read full conversation. (This is current "Saved Reframes" moved here.)

2. **Pulse / Signal Log** — full chronological journal of feel-states, body signals, triggers, outcomes. Searchable/filterable. (This is current inline Pulse moved into a row.)

3. **AI insights** — the user-facing AI session notes (matches current `aiUserFacingInsights` filter). Read-only chronological list. (Current "AI session notes" moved here.)

Below those three rows, a single full-width primary button:

**Export full report** — generates the PDF.

**The PDF contains:**
- Everything currently surfaced on screen
- Plus everything moved out of the live screen for redundancy reasons (raw counts, switch agility, loop dropoff details, nudge recovery rates, focus check deltas, default pattern accuracy, all 30+ derived metrics from the data layer)
- Plus full session history with timestamps
- Plus full journal/Pulse history
- Plus AI internal session notes (which are not user-facing in the live screen but should be in the user's own export — they own their data)
- Generated entirely on-device, no cloud round-trip

**What gets cut:**
- The shareable composure card as a separate section (folded into PDF export — it's an artifact you generate, not a section you visit)

---

## What's removed from the current implementation

- 4 of the 8 sections (Observer growth, Proof, Additional stats, Shareable composure card)
- The activity heat map visualization (replaced by 3-line trend chart in Section 2)
- All redundant framings of the same data (Recovery/Recovery when needed/Recovery speed all became one trend line + one optional pattern card)
- The "data dump" feel (raw counts move to PDF; live screen shows patterns only)
- 4 of the streak displays (kept once, in the headline section)

---

## What stays from the current implementation

- All 30+ data computations in the component (none removed; some only used in PDF now)
- The privacy architecture (on-device only, no cloud telemetry)
- The Pulse / Signal Log content (relocated to archive, not killed)
- AI session notes user-facing filter (relocated, not killed)
- Saved Reframes (relocated, not killed)
- The PDF export functionality (expanded)
- The on-screen "is the observer getting faster" subtitle question (this is the right framing — it stays, possibly elevated)

---

## Honest gaps

**1. The trend chart visualization needs the design system.** Three-line chart with sparklines / area / dot-plot / something — that's a design system call. Could be built as a placeholder against current styles but would need refresh when whole-app design system lands. Worth it to wait if the design system is coming soon.

**2. The headline pattern ranking logic is opinionated.** The priority order I specced is a guess based on what feels most meaningful. Real testing might reveal different priorities matter more to users. Worth flagging for post-launch refinement based on which patterns users actually find resonant.

**3. PDF generation infrastructure.** Current implementation has a basic PDF export. The expanded PDF (everything that gets cut from live screen, plus full history) is real work — needs jsPDF or similar, careful layout for multi-page report, charts rendered as images. Not impossible but real engineering, not just a UI swap.

**4. Pattern card thresholds are placeholders.** "Minimum 3 occurrences for trigger frequency" etc. — these are reasonable defaults but should be calibrated against real user data. Risk: if thresholds are too low, every pattern shows for every user immediately and the screen is noisy. Too high, and most users see "more patterns surface around session 8-10" forever.

**5. The science notes / "what this means" modal copy needs writing.** Each citation needs a 2-3 sentence user-facing explanation that's accurate without being clinical. Real writing work, not engineering. Could be drafted from the existing Science Sheet content.

**6. Visual treatment held entirely.** Cards, accents, typography, motion, dimensions — all wait for the design system. This spec is structural only. The build pass against the new design system will fill in those layers.

---

## Why this design earns the Pillar 4 claim

The current screen shows the user data. The redesign shows the user *their own brain rewiring*:

- Headline section names the specific shift happening right now with the science behind it
- Compounding view makes the trends visible — the practice changing the user's reactivity, catch-time, and independence over weeks
- Patterns section makes the *individual user's* signal visible — their specific triggers, their specific body markers, their specific thought-shapes
- PDF export gives them everything else if they want quantitative depth or want to share with a clinician

That's "Stillform uses the science to design the practice so that practice actually compounds" expressed in a screen. Not stats. Not gamification. Compounding made legible.

---

*ARA Embers LLC · My Progress Redesign Spec · April 30, 2026*
