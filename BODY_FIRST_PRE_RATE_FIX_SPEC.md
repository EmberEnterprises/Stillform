# BODY-FIRST PRE-RATE FRICTION FIX SPEC

**Status:** Spec draft for review. Awaiting Arlin's call on direction before code wiring.

**Date:** April 30, 2026

**The catch (GPT, Round 3):** Body-first users currently flow through pre-rate → bio-filter → breathe. The pre-rate is a 1-5 self-rating ("How steady are you?") that requires conscious cognitive assessment. For body-first users specifically, this contradicts the entire claim of body-first regulation: the architecture is asking them to perform a cognitive task before letting them get to the somatic work that's supposed to be their entry point.

**Confirmed in code:** `BreatheGroundTool` reads `regulationType` from localStorage (line 3213) and uses it for debrief copy and shift event metadata, but **NOT** for altering the phase entry flow. Body-first and thought-first users get identical entry sequences. That's the bug.

---

## The science

Body-first regulation works because activation pattern in the body needs to settle before cognition becomes reliable. When someone whose dominant regulation type is body-first opens Stillform under load, asking them to consciously rate their state on a numeric scale puts them through cognitive load they specifically reach for the body to bypass.

The relevant literature:
- **Polyvagal theory** (Porges 2011) — autonomic state shapes cognitive availability. A body-first user under sympathetic activation has reduced prefrontal access; numeric self-rating taxes the system that needs to settle before it works well.
- **Bottom-up vs top-down regulation** (Ochsner & Gross 2005, 2014) — bottom-up regulation (body-first) precedes and enables top-down regulation (cognitive). Reversing the order works against the mechanism.
- **Interoceptive predictive coding** (Seth 2013, Barrett & Simmons 2015) — bio-filter is body-coded (asks "what is your hardware running"). Pre-rate is cognition-coded (asks "how steady are you"). For body-first users, the bio-filter is the appropriate entry; the pre-rate is asking them to do top-down work before bottom-up settling.

**Stillform's own science sheet says it explicitly:** "Two-Pathway System (Body-First vs Thought-First)" treats these as distinct flows with different entry priorities. The current implementation contradicts the stated architecture.

---

## Three approach options

### Option A — Skip pre-rate entirely for body-first users

**Flow change:** body-first users open Breathe → bio-filter (already body-coded) → breathe. No pre-rate at all on entry.

**Implementation:** modify the initial `useState` for `phase` in `BreatheGroundTool`:
```javascript
const [phase, setPhase] = useState(
  isLowDemand ? "breathe" : 
  quickStart ? "breathe" : 
  regulationType === "body-first" ? "bio-filter" :
  "pre-rate"
);
```

**What we lose:** the pre-rating data point for body-first users (used in shift delta tracking and "Last session: +2" display).

**Mitigation:** add a post-session rating prompt instead. Body-first users rate AFTER the work, when their nervous system has settled and their cognitive capacity is back online. This is also more interoceptively honest — the post-rate is comparing felt state at end vs. felt state at start, and they can answer the start question better in retrospect than they could in the moment.

**Risk:** retrospective pre-rating is a different psychometric than concurrent pre-rating. The "shift delta" calculated from pre-after-the-fact vs post-during isn't strictly comparable to the thought-first version. **Worth flagging in the data layer** so future analytics don't conflate them.

**Best for:** the cleanest body-first integrity. No cognitive task before the breath.

### Option B — Move pre-rate after bio-filter

**Flow change:** body-first users open Breathe → bio-filter → pre-rate → breathe.

**Reasoning:** bio-filter is body-coded; once the user has named their physical hardware state, they're already in body-attention mode. The pre-rate becomes less of a cognitive interruption because the user is already self-reading.

**Implementation:** modify the bio-filter completion handlers to route to `pre-rate` for body-first users instead of `breathe`. Pre-rate then routes to `breathe`.

**What we keep:** concurrent pre-rating (better psychometric for shift tracking).

**What we don't fully solve:** the user is still asked to do a cognitive 1-5 rating before getting to the breath. We've reordered, not removed.

**Best for:** maintaining analytics consistency with thought-first while reducing the friction. Half-measure, but defensible.

### Option C — Replace pre-rate with somatic check for body-first users

**Flow change:** body-first users open Breathe → somatic check (chip-style "where do you feel it?" or short body schematic) → bio-filter → breathe. Numeric pre-rating happens post-session only.

**Reasoning:** body-first users should orient via body, not via abstract numeric scale. A somatic check (single tap on a body location) IS the kind of thing body-first regulation primes. It's both data capture and the start of the somatic work.

**Implementation:** new `body-check` phase, replaces `pre-rate` for body-first users. UI uses existing body schematic from Body Scan or a simplified version.

**What we gain:** body-first users get a body-coded entry that captures useful data AND begins the work in one move.

**What we add:** new screen, new component, more code surface.

**Risk:** more work. More UI to maintain. The somatic check has to be designed carefully (Body Scan already does this well; reusing that component is the obvious move but may not fit the entry context).

**Best for:** the maximalist body-first integrity move. Most ambitious. Most complete.

---

## Recommendation

**Option A is the right starting move.** Reasons:

1. **Cleanest integrity match.** Body-first users deserve the body-first claim made operative. Skipping pre-rate is the most direct way to honor that.
2. **Smallest implementation surface.** ~5 lines of code change in the `useState` + add a post-session rating prompt (the post-rate phase already exists; it just runs unconditionally after breathe today).
3. **Reversible.** If the post-rate-only approach produces less reliable shift data than expected, we can fall back to Option B easily.
4. **Doesn't preclude Option C later.** If a somatic check becomes worth building, it can replace the entire pre-rate concept for body-first users in a future iteration.

Option B is the conservative middle ground. Defensible if Arlin wants to preserve concurrent pre-rating. Honestly doesn't fully solve the problem — body-first users still do a cognitive task before the breath, just later in the sequence.

Option C is the right destination eventually, but it's premature now. Build the data on Option A first; if the post-rating-only approach has limitations, design the somatic check then with the actual signal in hand.

---

## Specific implementation for Option A

**File:** `src/App.jsx`, `BreatheGroundTool` component (line 3173).

**Change 1 — Initial phase logic (line ~3190):**
```javascript
const [phase, setPhase] = useState(
  isLowDemand ? "breathe" : 
  quickStart ? "breathe" : 
  regulationType === "body-first" ? "bio-filter" :
  "pre-rate"
);
```

**Change 2 — Handle missing preRating downstream:**
Search for all uses of `preRating` in the component. Where preRating is read:
- Shift delta calculation (likely line in completion handler)
- localStorage shift writing
- Plausible event payload

For body-first users, `preRating` will be `null` initially. After the breath completes, the post-rate phase runs and captures `postRating`. The fix: for body-first users, *use the post-rate phase to capture BOTH ratings* — first ask "how do you feel now?" then "thinking back, how were you when you started?" (retrospective pre).

This adds one extra question to the post-rate flow for body-first users only. Two short numeric taps after the breath, vs. one cognitive task before it.

**Change 3 — Update shift event metadata:**
Add `preRatingMethod: "concurrent" | "retrospective"` field to the shift event payload. For thought-first users: `concurrent`. For body-first users: `retrospective`. This protects the data layer's integrity — analytics can filter or weight differently if needed.

**Change 4 — Mirror the same fix in BodyScanTool:**
Body Scan has the same flow (pre-rate → bio-filter → 6-point sequence). Body-first users should get the same treatment there. **Worth checking BodyScanTool code** to confirm the parallel structure exists and apply Option A to it consistently.

Reframe is different — Reframe is cognition-coded by definition (it's a cognitive reappraisal tool). Pre-rate before Reframe is appropriate even for body-first users because Reframe IS the cognitive work.

---

## Ship checklist (per Stillform's 11-item standard)

1. **UAT dropdown if user-visible** — yes, body-first users will see different entry. Add UAT entry.
2. **Tutorial if new feature** — minor; body-first users notice they go straight to bio-filter. Probably adequate without tutorial.
3. **FAQ if it changes how something works** — yes. Update the "How does Stillform decide what to show me?" entry.
4. **Transfer doc** — yes, capture the fix and the reasoning.
5. **Plausible event if trackable** — add `preRatingMethod` field to shift event.
6. **Privacy policy if new data collected** — no new data; just labeling existing data.
7. **Science sheet if new research-backed feature** — yes, add the body-first entry rationale grounded in Porges, Ochsner & Gross, Seth.
8. **AI prompts if it affects Reframe context** — no, this fix doesn't touch Reframe.
9. **Promo if worth marketing** — possibly. "We respect your nervous system enough to not ask it to do math when it's activated" is a real differentiator. Worth a Reddit/founder voice mention.
10. **Punch list** — yes, add to Stillform_Punch_List.
11. **Emotion coverage if touching Pulse/chips** — no chip changes.

---

## Open questions for Arlin

1. **Option A, B, or C?** My recommendation is A. Your call.
2. **Mirror to BodyScanTool?** I assume yes — same logic. Want me to confirm the BodyScanTool flow before scoping that part?
3. **Retrospective pre-rating UX:** how do we ask it? "How were you when you started?" vs "Now that you're here, how would you say you felt at the start?" Drafted both; want your read on tone.
4. **Should the post-session order be post-rate first then retrospective pre, or retrospective pre first then post-rate?** Different cognitive ordering. The first asks "where am I now" → "how does that compare to start." The second asks "where was I" → "where am I now." I lean the first for body-first users (start with present-state, comparison comes naturally).

---

## What this is NOT

- Not a closing-language change (that decision is locked: current language stays).
- Not an architectural shift (calibration, processing types, sessions, tools all preserved).
- Not Cognitive Function Measurement (separate spec, separate moonshot).
- Not low-demand mode (separate work; this is for non-low-demand body-first users).

**This is one specific friction point being fixed.** Small surface. Real impact. The kind of integrity work that doesn't show up on a feature list but makes the difference between a body-first user finishing their first session feeling met or feeling tax-imposed.

---

*ARA Embers LLC · Body-First Pre-Rate Friction Fix Spec · April 30, 2026*
