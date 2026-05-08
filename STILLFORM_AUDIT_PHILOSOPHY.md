# STILLFORM AUDIT PHILOSOPHY
**ARA Embers LLC · May 7, 2026 · v1.3**

*v1.0 (May 7 morning) established after Practice Signals revert.*
*v1.1 (May 7 afternoon) added the Science + UI Flow standing requirement.*
*v1.2 (May 7 evening) added Layer 1.0 (session-start ground truth), refined Layer 1.1 (adjacent-name grep), added Layer 6.4 (diff anomaly investigation) — all from the Mirror-duplicate near-miss.*
*v1.3 (May 7 night) added the Prime Directive of Integrity, Layer 0.6 (flow ground truth), Layer 2.36 (test-against-real-helpers), Layer 2.37 (field-name verification), Layer 2.38 (regex-guard completeness) — all from the Build #2 Trigger Profile flow-assumption failure and Phase 1 Body Scan field-name bugs where synthetic tests verified fiction instead of reality.*

---

## PRIME DIRECTIVE — added v1.3

**EVERYTHING NEEDS TO HAVE INTEGRITY IN EVERY ASPECT OF WHAT WE DO. NO FLUFF. NO FABRICATION. NO PATCHES. NO ASSUMPTIONS. NO DRIFT.**

This is the operating instruction Arlin gave on May 7, 2026 after a night of work I shipped on assumptions that didn't hold. It is the lens every other layer of this philosophy runs through. If a check is technically passing but built on assumed knowledge of the codebase, the user, the flow, or the helper return shape, **it is failing this directive regardless of what the layered audits say.**

The eight layers below are the mechanism. The Prime Directive is the standard.

A passing audit is not the goal. A correct, grounded, verified system is the goal. When the two diverge, the audit is wrong.

---

## Why this exists

On May 7, I shipped Practice Signals to production. All 35 pre-commit audits passed. Build was green. Preflight was green. Sync keys validated. AI regression confirmed. Six clean commits, single push, manual deploy by Arlin.

The feature was broken in three independent ways the audits didn't catch:
1. AffectLabelingExercise rendered on every screen (no conditional wrapper)
2. Orphaned `)}` rendered as visible JSX text content
3. The 9-chip vocabulary duplicated existing app chips on the same screen
4. The science (Lieberman 2007 affect labeling) was misapplied — the exercise asked users to label hypothetical scenarios instead of their own current state
5. The skip-all path produced "0/12 counted as not matched" — a hostile UX violating Stillform brand

**The audits passed and the product was broken.** That's the failure mode this philosophy is designed to prevent.

The core insight: *code hygiene is necessary but insufficient.* Clean code can be broken UI. Passing checks can be false confidence. The 35-item checklist I had was answering "is this code clean?" when the question that mattered was "does this thing actually work and serve the user?"

This document is the answer to "how should we audit so that doesn't happen again."

---

## How Arlin uses this document

You don't need to read code. You just need to ask me the questions in this document. Every question has:

- **What you ask**
- **What I have to show as evidence** (screenshot, grep, flow walkthrough — something verifiable, not "trust me")
- **Pass / fail criterion**

If I can't show the evidence, the audit didn't happen. If the evidence is sloppy, the audit was sloppy. You can hold me to this without needing to know what JSX or `useEffect` is.

---

## The eight layers

Audits run at eight layers, in order. Skipping a layer is the bug class that ships broken features.

0. **Document context** — before anything else, read the canonical docs that already answer the design questions
1. **Pre-existence** — before writing any code (existing surfaces, science, worst-case paths)
2. **Code-hygiene** — while writing (the 35-item checklist, refined)
3. **Behavior** — after writing, before staging
4. **Voice + brand** — after writing, before staging
5. **Visual coherence** — phone screenshot, the irreducible final gate
6. **Self-skepticism** — continuous, meta-layer
7. **Recovery** — what happens when something does slip through

Plus one **standing requirement** that runs in parallel with the layered audit:

**↗ Science + UI Flow justification** — before every recommendation, articulate two things explicitly: how the change serves the science (specific citations, mechanism), and how it improves UI flow (symmetry, continuity, decisions, data integrity, brand). No recommendation without both. See section below.

Each layer below has the questions you ask, the evidence I have to show, and the pass/fail.

---

## STANDING REQUIREMENT — Science + UI Flow justification before any recommendation
**Added May 7, 2026 (Arlin's call).**

This requirement runs in parallel with all other layers. Every proposed change — code edit, surface adjustment, copy change, removal — must come with explicit articulation in BOTH dimensions before the proposal is offered. Not after the fact. Not when asked. Up front.

### Why this exists

When I propose a change without articulating WHY in the dimensions that matter most to Stillform, two things happen:

1. **I might be making the change for the wrong reason.** A change that fixes a UI symptom but breaks the science isn't a fix — it's a regression. A change that aligns with the science but breaks the flow is the same. Forcing both articulations up front prevents me from optimizing for one and unintentionally hurting the other.

2. **Arlin has to do the verification work I should be doing.** Without the justification baked in, she has to ask "how does this serve the science?" / "how does this improve flow?" each time. That's verification work that should live with the proposal, not the reviewer.

### The two articulations required

#### Science alignment
- **Which specific citations does this serve or violate?** Not "the science generally." Named: Lieberman 2007 / Barrett 2017 / Mehling 2012 / Wells 2009 / Russell circumplex / Lehrer 2020 / etc.
- **What mechanism is being preserved or restored?** Affect labeling reduces amygdala reactivity. Interoceptive granularity is trainable. Pre/post measurement is the practice's claim. Pattern detection requires session data. Etc.
- **What would this change do to the science if it went wrong?** If I'm wrong, what gets broken? The honesty of the measurement claim? The mechanism the practice depends on? Name it.

#### UI flow improvement
- **Symmetry** — does the same user get the same architectural treatment across tools, or does this fix one place at the cost of asymmetry?
- **Continuity** — does the change preserve the data continuity My Progress, Pattern Disruption, and Roadmap markers depend on?
- **Decisions** — does this add or remove cognitive choices for the user? Sometimes a "fix" that adds a feature also adds a decision.
- **Data integrity** — does the change preserve, augment, or compromise the data the system collects?
- **Brand consistency** — does the change land within the editorial-luxury frame, or does it drift toward wellness-app default?

### The standard

Every proposal must include both articulations. If I cannot articulate the science alignment, I have not done Layer 0 / Layer 1.2 properly and shouldn't propose yet. If I cannot articulate the flow improvement, I'm proposing a code change that hasn't earned its place in the architecture yet.

### What this looks like in practice

**Bad (pre-May-7 standard):** *"Proposed change: keep the post-state chip for low-demand users. Diff size: ~30 lines. Want me to proceed?"*

**Good (post-May-7 standard):** *"Proposed change: keep the post-state chip for low-demand users.*

*Science: preserves Lieberman 2007 affect labeling mechanism for the cohort that benefits most from accessible labeling moments. Restores Stillform's pre/post measurement claim for depleted users who currently contribute zero data. Preserves Russell circumplex granularity work that Barrett 2017 names as the trainable capacity.*

*UI flow: restores symmetry across the three tools (Body Scan + Reframe already kept the chip May 7; Breathe is the lonely asymmetry). Preserves continuity for Pattern Disruption Layer detection, which reads session pre/post deltas. Restores Roadmap Stage 5 markers that explicitly depend on this data on depleted/activated/pain sessions. Counter-intuitively REMOVES a decision (skips the 3-option choice screen entirely).*

*Diff size: ~30 lines. Want me to proceed?"*

The second version is the same change, but the reviewer can see WHY in the dimensions that matter without having to ask.

---

## LAYER 0 — Document context audit
**Before pre-existence, before any code, before any design.**

This layer was added May 7 after Practice Signals. The CFM spec (20k characters, in the repo) explicitly answered the design questions I made up answers to. I never opened it.

The repo contains 43+ markdown documents that are canonical sources of truth. They're not optional reading. They're the working memory of the project.

### Question 0.1: "Which docs are relevant to this work?"
- **Evidence:** Written list with reasoning. "This work touches [feature/area]. The relevant docs are [list]. I am reading them in this order: [order]."
- **Pass:** I name the docs that touch this area, ordered by relevance.
- **Fail:** I jumped into work without identifying applicable docs.

### Question 0.2: "Have I read them, end to end, not skimmed?"
- **Evidence:** Brief written summary of what each relevant doc says. Three to five sentences per doc covering: what it specifies, what decisions are locked, what's open. I have to be able to answer specific questions about content.
- **Pass:** I can summarize each relevant doc accurately and quote key passages.
- **Fail:** I read titles and section headers only; I didn't read the substance.

### Question 0.3: "What does the doc say that constrains or directs this work?"
- **Evidence:** Explicit list of constraints and decisions from the docs. "Spec says X. Punch list says Y. Science Sheet says Z. Decision Z' was already made on date W."
- **Pass:** Constraints are surfaced before design begins.
- **Fail:** I designed without knowing what the docs already decided.

### Question 0.4: "Does my proposed approach match what the docs say?"
- **Evidence:** Side-by-side comparison. "Spec calls for [X]. I am proposing [Y]. They match." OR "They diverge because [reason]. The divergence is justified because [Z]." OR "I am proposing to update the spec because the docs are stale."
- **Pass:** Approach either matches docs or has explicit, justified divergence.
- **Fail:** Divergence from docs without acknowledgment — i.e., I'm contradicting a locked decision without realizing it.

### Question 0.5: "Is there an existing punch list entry, decision, or open question for this?"
- **Evidence:** Search results from `Stillform_Punch_List.md`, `Stillform_Master_Todo.md`, recent decision docs. List of relevant entries.
- **Pass:** I checked the punch list and todo before building anything new.
- **Fail:** Built something that was already on the punch list, or contradicted a recent decision, or duplicated already-tracked work.

### The canonical doc inventory (always-in-context for any work)

These are read or re-read whenever any feature work starts, regardless of scope:

| Doc | What it is | When required |
|---|---|---|
| `STILLFORM_PROJECT_TRANSFER.md` | Single source of truth for project state | Always |
| `Stillform_Master_Todo.md` | What's planned, what's done, what's blocked | Always |
| `Stillform_Punch_List.md` | Known issues + fixes pending | Always |
| `Stillform_Strategic_Roadmap.md` | Broader direction + locked decisions | Always |
| `Stillform_Science_Sheet.md` | Science foundation + cited literature | Whenever touching science-grounded features |
| `STILLFORM_DESIGN_SYSTEM.md` | Design tokens, typography, color, spacing | Whenever touching UI |
| `STILLFORM_AUDIT_PHILOSOPHY.md` | This document | Always |
| `COMPOSURE_SELF_MASTERY_LEGIBILITY.md` | Voice + positioning principles | Whenever touching user-facing copy |
| `SCRATCH_FOUNDER_VOICE.md` | Arlin's voice patterns | Whenever touching user-facing copy |

Plus the feature-specific spec for whatever I'm working on:

| Feature | Spec doc(s) |
|---|---|
| Practice Signals / cognitive function measurement | `COGNITIVE_FUNCTION_MEASUREMENT_SPEC.md`, `COGNITIVE_FUNCTION_MEASUREMENT_PHASE_1_AUDIT.md` |
| Pattern Disruption | `PATTERN_DISRUPTION_SPEC.md` |
| My Progress / engagement architecture | `MY_PROGRESS_REDESIGN_SPEC.md`, `STILLFORM_ENGAGEMENT_ARCHITECTURE.md` |
| Self Mode | `SELF_MODE_REDESIGN_RESEARCH.md`, `RESEARCH_PREP_SELF_MODE_AND_EVIDENCE_CALLOUTS.md` |
| Body Scan What Shifted | `BODY_SCAN_WHAT_SHIFTED_SPEC.md` |
| Settings | `SETTINGS_REWRITE_SPEC.md` |
| Settled chip / Russell circumplex | `SETTLED_CHIP_SPEC.md` |
| Low-demand mode | `LOW_DEMAND_PHASE_2_SPEC.md`, `LOW_DEMAND_PHASE_3_SPEC.md` |
| Plain Language Science cards | `PLAIN_LANGUAGE_SCIENCE_CARD_SPEC.md` |
| Three-category data feed | `THREE_CATEGORY_DATA_FEED_SPEC.md` |
| Chip definitions | `CHIP_DEFINITIONS_DRAFT.md` |
| Closing language | `CLOSING_LANGUAGE_CANDIDATES.md` |
| AI regression test | `AI_REGRESSION_TEST_19.md`, `AI_REGRESSION_RESULTS_MAY_7.md` |
| Build / launch | `BUILD_GUIDE.md`, `STILLFORM_LAUNCH_TRANSFER_NEXT.md`, `Test_Day_Plan_2026-05-07.md` |
| Watch companion | `WATCH_GUIDE.md` |
| Subscription / paywall | `SUBSCRIPTION_SETUP.md` |
| Share extension | `SHARE_EXTENSION_GUIDE.md` |

When new specs are added, this table gets updated.

### Why this layer matters more than any other

If I'd done Layer 0 for Practice Signals, I'd have read the spec that said:
- The 9-chip vocabulary was intentional
- The scenario-based approach was intentional
- The framing was *"recognition through evidence, not narrative"*
- *"Not 'your brain is X%' or single composite scores"* was an explicit anti-pattern

Three of those four things I would have built differently. The fourth ("0/12 counted as not matched") was MY drift away from the spec's stated philosophy — and I wouldn't have drifted if I'd had the spec's exact framing in front of me.

**Reading the docs before coding isn't an audit step. It's the prerequisite for design.**

---

## LAYER 0.6 — Flow ground truth (added v1.3)
**Required before designing any user-facing surface, capture point, or feature placement.**

Layer 0 covers reading the spec for the feature being built. Layer 0.6 covers reading the canonical app flow — what users *actually do* day-to-day, which tools each processing type defaults to, where canonical entry points are.

I added this layer because I designed Trigger Profile capture points for Build #2 Phase 1 without first reading the canonical flow doc. I proposed Self Mode as primary capture; Self Mode is actually the AI-fallback / deliberate-practice tool, not the canonical primary entry for either processing type. The proposal was confidently wrong because I hadn't grounded it in the actual flow.

### Question 0.6.1: "Have I read the canonical flow documentation before proposing this surface or capture point?"
- **Required reading:**
  - `STILLFORM_PROJECT_TRANSFER.md` — Daily Loop section (canonical user day)
  - `STILLFORM_PROJECT_TRANSFER.md` — Current Routing Logic section (which tools each processing type defaults to)
  - `STILLFORM_PROJECT_TRANSFER.md` — Key Features Built (existing affordances I might be duplicating)
  - The actual `TOOLS` array in `src/App.jsx`
  - The hero CTA routing logic in code
- **Evidence:** Quotes from the doc with line references for the flow facts I'm building on. Not summaries — exact text.
- **Pass:** Every flow claim in my proposal traces to a quoted line in the canonical docs or code.
- **Fail:** I proposed where a feature lives, when it surfaces, or what cohort sees it without grounded references. Symptoms: "primary tool" / "users typically" / "main entry point" without citation.

### Question 0.6.2: "For each user-facing surface, which processing type sees it?"
- **Evidence:** Explicit mapping. "Thought-first users see this at [step] because [routing logic at line N]. Body-first users see this at [step] because [routing logic at line M]."
- **Pass:** Both processing types accounted for. Asymmetries flagged.
- **Fail:** Designed for one type, didn't verify the other type's path.

### Question 0.6.3: "Where does the user encounter this for the first time?"
- **Evidence:** Walked through onboarding + first-session paths in code. Confirmed where this surface appears in those paths.
- **Pass:** First-encounter moment is clear and grounded.
- **Fail:** Surface only fires when user has 5+ sessions; new users never see it; I didn't notice.

### Why this matters more than a code-level audit

A code-level audit can confirm "the function does X." Layer 0.6 confirms "X is the right thing to do for this user, in this flow, at this moment." Practice Signals shipped with passing code-level audits and was wrong because the flow didn't support what the code did. Trigger Profile Phase 2 was about to ship the same way.

**The Prime Directive lives or dies here. Most assumption failures in this codebase have been flow assumptions, not syntax assumptions.**

---

## LAYER 1 — Pre-existence audit
**After Layer 0 and 0.6, before writing code.**

This layer was the original Layer 1. It still applies — but Layer 0 (read the docs) comes first.

This is the layer I skipped for Practice Signals. The cost: built parallel UI on top of existing UI, with the same vocabulary, on the same screen.

It's also the layer I skipped for the Mirror duplicate incident (May 7 evening). The cost: nearly shipped a duplicate inline card on top of an already-shipped Mirror anchor + sheet, because my pre-existence grep was too narrow and I had no session-start ground truth.

### Question 1.0: "What's the actual current state of HEAD?"
**Added v1.2 — the failure mode that nearly shipped a duplicate Mirror surface.**
- **Evidence:** Output of `git log --oneline -10` AND `wc -l` on every file I'll touch AND `git diff HEAD --stat` for any uncommitted state. All copied into the audit log for this session before any code is written.
- **Pass:** I have written, ground-truth references for what's been committed recently and the line counts of files I'll modify. I do not assume "the last commit I remember" or "the last thing I worked on" matches HEAD.
- **Fail:** I started writing code based on a mental model of HEAD that turned out to be wrong. Symptom: diff math doesn't add up later (see Question 6.4 — diff anomaly).

This question matters most after a context-window compaction, after a session break, or after parallel work by Arlin or another collaborator. The post-compaction summary is partial by design — confidently summarizing scope from a partial summary causes real harm.

### Question 1.1: "Does this already exist in some form?"
- **Evidence:** Grep results showing every related surface, vocabulary, mechanism in the existing codebase. List of "here's what's already there that touches this concept."
- **Pass:** I can show that I searched for and inventoried existing related surfaces, with file/line references.
- **Fail:** I built something without first inventorying what's already there.

**v1.2 refinement — what to grep for:**
- The FEATURE name itself (e.g., grep "Mirror", "Achievement", "Roadmap") — not just the specific constant or function I'm about to write
- Adjacent React state names: `showXSheet`, `XCard`, `XPanel`, `XOverlay` — modals and surfaces commonly use these patterns
- All comment markers: `── X ──`, `// X —`, `// XX-Y ─` — feature regions are usually labeled
- Storage keys: `stillform_x_*` — features that persist data leave a key trail
- For UI work: also grep tokens that appear in comments naming the surface (e.g., `STAGE LABEL`, `CAPACITY LINE`)

The Mirror duplicate would have been caught by any of: `grep "Mirror" src/App.jsx` (would have shown the existing anchor + sheet), `grep "showMirrorSheet"` (would have shown the existing useState), `grep "MIRROR ANCHOR"` (would have shown the existing comment block). I grepped for "STAGE_DEFINITIONS" and "computeStageMarkers" — the names of NEW code — but not for the feature name itself.

### Question 1.2: "Does the science actually match the implementation?"
- **Evidence:** Side-by-side written comparison. "The research [Author Year] measures X by doing Y. The implementation does Z. They match because [reason]" — OR — "They don't match because [gap]; here's how to close it."
- **Pass:** Mechanism in implementation produces the effect the research measures.
- **Fail:** I cited a paper but the implementation does something different from what the paper measures.

### Question 1.3: "What's the user's emotional state at the point of contact?"
- **Evidence:** Written description. "User arrives here when [trigger]. Their cognitive bandwidth is [high/low]. They're feeling [state]. They have [time/attention] available."
- **Pass:** Implementation respects the user's actual state, not an idealized one.
- **Fail:** I designed for a hypothetical calm user when the actual user is activated, depleted, or in crisis.

### Question 1.4: "What does the worst-case user path produce?"
- **Evidence:** Written walkthrough of the four worst paths: zero data, skip-all, network down, hostile context. What does the user literally see and feel at each?
- **Pass:** All four worst paths produce experiences that respect the user.
- **Fail:** Any path produces shame, blame, grading, judgment, or technical incoherence.

### Question 1.5: "Build new, integrate with existing, or skip?"
- **Evidence:** Explicit verdict with reasoning. "Build new because [X]" / "Integrate with existing [surface] because [Y]" / "Skip because [Z]."
- **Pass:** A genuine choice was made between three options, not assumed-build.
- **Fail:** I jumped to "build new" without considering integration or skip.

---

## LAYER 2 — Code hygiene (the existing 35-item list, refined)
**While writing.**

These checks are necessary but insufficient. They catch syntax/structure bugs but say nothing about whether the feature works correctly.

The 35 audits stay (state integrity, build green, preflight green, sync key parity, component reachability, debug leak, useEffect cleanup, banned phrases, encryption boundaries, etc.). They're the floor, not the ceiling.

### Question 2.1: "Did all 35 hygiene audits pass?"
- **Evidence:** Output of each audit script + grep results captured.
- **Pass:** Every audit returns clean.
- **Fail:** Any audit fails OR I skipped any audit.

**Critical:** passing this layer does NOT mean the feature works. It means the code is structurally sound. Don't let "all 35 passed" produce false confidence.

### Question 2.36: "Are my synthetic tests verifying behavior against ACTUAL helper implementations?" (added v1.3)
**Required for any code that calls existing helpers, reads existing storage, or constructs synthetic shapes that are passed to other functions.**

- **Evidence:** For every helper my code calls, I read the helper's actual implementation FIRST, document its real return shape in a comment at the top of the test file, and mock the helper to return THAT shape. Reference: file path + line number where I read the implementation.
- **Pass:** Mocks match actual helper return shapes verbatim. The test verifies what production code will actually receive.
- **Fail:** Mocks return whatever shape my code expects, regardless of what the real helper returns. The test verifies fiction.

This question was added because Phase 1 Body Scan credit shipped with two field-name bugs (`tensionByArea` instead of actual `tension` and `bodyScanTension`) and "all 9 synthetic tests passed" because I mocked the helpers to match my buggy assumption. Tests verifying fiction is the same false-confidence class as Practice Signals' passing audits.

The discipline: **a test is only as valid as its mocks. A mock based on assumption is a fiction. A fiction-based test produces zero confidence even when it passes.**

### Question 2.37: "Did I verify every field-name read against the source's actual schema?" (added v1.3)
**Five-second check; skipping it produces silent feature-degradation bugs.**

- **Evidence:** For every line of code that reads a field from a helper return, storage payload, or session entry (`obj.fieldName`), I grepped for the field's source-of-truth definition before persisting code. Reference: line number where the field is actually written.
- **Pass:** Every field-read has a verified source.
- **Fail:** I assumed a field name based on what made sense or what other handlers used. Symptom: code never throws but always evaluates `undefined`, feature silently degrades.

If I cannot point to the line where a field is *written* with that exact name, I have not done Layer 2.37 for that field.

### Question 2.38: "Are the regex guards in ship-preflight watertight, or do they have known bypasses?" (added v1.3)
**Whenever I add a check via regex, or follow an existing regex-guarded pattern, verify the regex catches every shape of the violation.**

- **Evidence:** For each regex-based preflight guard I'm relying on (TimeKeeper inline ms math, banned phrases, etc), I write out the variants the regex SHOULD catch and confirm each one against the regex. Reference: list of variants tested.
- **Pass:** Regex catches every documented violation shape.
- **Fail:** I followed an existing pattern that bypasses the regex. My code is "guarded" by a check that doesn't see it.

This question was added after discovering 5 call sites in the codebase use `Date.now() - (variableName * 24 * 60 * 60 * 1000)` — a form the TimeKeeper guard regex doesn't catch because it requires a literal-number multiplier. My Phase 0 stage marker code followed that bypass pattern. The guard "passed" while the violation was right there.

**A regex guard with a known bypass is worse than no guard, because it produces false confidence.**

### Question 2.39: "For any read of persisted data, does the read path actually match the write path?" (added v1.3, May 8 night)
**Required for any read of localStorage / SecureCache / IndexedDB data.**

A read can be field-name-correct, schema-correct, regex-guard-clean, and still return stale or empty data if the read path doesn't match the write path. The bug is invisible at every other audit layer — only Question 2.39 catches it.

- **Evidence:** For every helper that reads persisted data, I locate the write path (where the data is actually persisted) and confirm: (a) the read API and write API access the same underlying store, (b) writes are visible to subsequent reads in the same session.
- **Pass:** Read path and write path use the same storage mechanism (both raw localStorage, OR both secureRead/secureWrite, OR both IndexedDB).
- **Fail:** Read uses secureRead but write uses raw localStorage.setItem (or vice versa). Symptom: helper returns boot-time snapshot, missing all writes that happened in the current session. Tests pass against pre-seeded data; production fails silently for data created in-session.

This question was added because two of my v1.3 fixes (commit 1f49ddb) introduced exactly this bug: I changed `getEodHistory` and `_s2LongestSustainedCheckinRun` from raw localStorage reads to `secureRead` to "fix" the encryption inconsistency — without checking that the WRITES for those keys still go through raw `localStorage.setItem` (in `appendDailyLoopHistory` line 5139). My "fix" produced stale reads. Reverted in the next commit after audit caught it.

The Stillform codebase has a pre-existing architectural inconsistency: some SECURE_KEYS use secureWrite (encryption-at-rest works), others use raw localStorage (encryption-at-rest is broken for those keys). Tonight's audit aligned reads to writes for the broken-encryption keys via explicit `// SECURE-KEYS-ALLOW: ...` markers. The broader architectural consistency is flagged as failure class 15 for future broader audit.

---

## LAYER 3 — Behavior audit
**After writing, before staging. This is the layer I missed entirely on May 7.**

Behavior audits answer "does this thing actually work?" — the question hygiene audits never ask.

### Question 3.1: "Does each new component have an explicit conditional wrapper?"
- **Evidence:** For every new render block in App.jsx (or any file), show the conditional that gates it: `{condition && (<Component />)}` or `{condition ? <A /> : <B />}`. List each new component, show its gate.
- **Pass:** Every new component has an explicit conditional. None render unconditionally.
- **Fail:** Any new component renders without a conditional wrapper. ← This is the bug that shipped Practice Signals.

### Question 3.2: "Are there any orphaned `)}`, `}}`, `}` that JSX would render as text?"
- **Evidence:** Grep for standalone closing tokens at indentation levels where JSX text would render. Also visual scan of the diff for closing tokens not preceded by an opening match.
- **Pass:** No orphaned closing tokens.
- **Fail:** Any closing token that doesn't match an opening expression. ← This is what produced the visible `)}` text on Arlin's screen.

### Question 3.3: "Did I walk the full user flow end-to-end?"
- **Evidence:** Written walkthrough. Entry → action → state changes → completion → exit. Including success path AND skip path AND error path. State variables traced: "When user taps X, state Y goes from A to B, component Z mounts/unmounts."
- **Pass:** Walkthrough covers entry, every branch, exit, state cleanup. No gaps.
- **Fail:** Any branch unverified, any state transition assumed-but-not-traced.

### Question 3.4: "What does the user see at zero data, skip-all, error?"
- **Evidence:** Written description of what literally renders for each case. Including copy.
- **Pass:** All three cases produce coherent, brand-consistent experiences.
- **Fail:** Any case produces empty / broken / hostile UX. ← This is what produced "0/12 counted as not matched."

### Question 3.5: "Does this new UI duplicate any existing UI element on the same screen, in the same flow, or in the user's near-term experience?"
- **Evidence:** Side-by-side comparison. "Existing UI [X] uses vocabulary [V] in surface [S]. New UI also uses vocabulary [V] in surface [S']. They are different because [reason]." OR "They overlap, here's how I'm consolidating."
- **Pass:** No vocabulary, mechanism, or interaction pattern duplicated within the user's near-term experience.
- **Fail:** Same chips, same prompts, same interactions appearing twice. ← Practice Signals failed this.

---

## LAYER 4 — Voice + brand audit
**After writing, before staging.**

Code can be technically correct and brand-broken. The banned-phrase scan catches some violations but misses category-level voice failures.

### Question 4.1: "Does any user-facing copy grade, judge, fail, or shame the user?"
- **Evidence:** Grep + visual scan for: "incorrect", "wrong", "failed", "missed", "you didn't", "score", "accuracy", "% correct", "not matched", "below average", "you should have", "try again", percentage scores presented as performance.
- **Pass:** No grading, judging, or shaming language anywhere. Including in error/empty/skip paths.
- **Fail:** Any such language. ← "0/12 counted as not matched" failed this.

**Note:** Numbers can be facts about the user's own data (e.g., "5 sessions this week") but become judgments when framed as performance against an unstated standard ("0/12" implies failing 12).

### Question 4.2: "Does this position Stillform as authority over the user?"
- **Evidence:** Review of copy. Does it tell the user what they should feel, do, become? Or does it reflect the user back to themselves?
- **Pass:** Stillform is mirror, instrument, architecture. User is operator and architect of their own capacity.
- **Fail:** Stillform speaks as therapist, coach, parent, teacher, judge.

### Question 4.3: "Does any copy use 'not X' framing to define Stillform?"
- **Evidence:** Grep for "not therapy", "not meditation", "not coaching", "not a patient", "not a [...]", "this isn't [...]"
- **Pass:** Stillform always defined positively. Never by negation.
- **Fail:** Any "not X" framing in user-facing copy. (Internal docs may use "not X" to clarify scope; user-facing copy may not.)

### Question 4.4: "Does this serve self-mastery?"
- **Evidence:** Written check. "User does this. Capability they develop is [X]. The capability transfers because [reason]."
- **Pass:** Action builds a capacity the user owns and can apply outside the app.
- **Fail:** Action builds a dependency on the app, on the AI, on streaks, on metrics — anything that lives inside the product instead of inside the user.

### Question 4.5: "Does the worst-case copy still respect the user?"
- **Evidence:** Walk the worst path (skip-all, error, empty data, regression). Read the copy aloud. Does it treat the user with dignity?
- **Pass:** Even the worst path lands respectfully.
- **Fail:** Any path produces copy that would feel bad to read aloud to a friend.

---

## LAYER 5 — Visual coherence (the irreducible gate)
**Phone screenshot. Mandatory. No exceptions.**

This is the audit that would have caught everything Practice Signals shipped broken. I never did it.

### Question 5.1: "Did you take phone screenshots of every surface this feature touches?"
- **Evidence:** Actual screenshots. Of: empty state, mid-flow, completion, skip path, error state. Plus: every adjacent surface this feature could potentially affect (home, settings, the screen the user navigates from and to).
- **Pass:** Screenshots exist for all states, on phone, before push.
- **Fail:** Any state unscreenshotted, any "I'll check after deploy" — that's after-the-fact, doesn't count.

### Question 5.2: "Does it visually fit existing Stillform aesthetic?"
- **Evidence:** Side-by-side. New surface vs adjacent existing surface. Same typography? Same color palette? Same spacing rhythm? Same density?
- **Pass:** Indistinguishable as belonging to the same app.
- **Fail:** New surface feels like a different app or a layer pasted on top.

### Question 5.3: "Does anything bleed across screens?"
- **Evidence:** Screenshot of every screen in the app after the new feature ships. (Not all 15 screens — but at minimum: home, settings, every screen reachable from the new feature.) Verify no rendering bleeds where it shouldn't.
- **Pass:** Each screen renders only its own content. No bleed.
- **Fail:** New feature visible on screens where it shouldn't be. ← Practice Signals on home, settings.

### Question 5.4: "Does any visible text look like code (`)}`, `</div>`, `[object Object]`, `undefined`, `NaN`)?"
- **Evidence:** Visual scan of every screenshot.
- **Pass:** All visible text is intentional copy.
- **Fail:** Any code-shaped text rendered as content.

---

## LAYER 6 — Self-skepticism (the meta-layer)
**Continuous, throughout. The hardest audit.**

These are checks against my own cognitive failures. The most dangerous bug is the one I'm confident isn't there.

### Question 6.1: "Am I confident or have I verified?"
- **Evidence:** For every claim I make about the code state, can I point to the verification (grep output, screenshot, file view)? Or am I working from memory?
- **Pass:** Every claim is backed by verifiable evidence I can show right now.
- **Fail:** I'm asserting something based on what I assume is true.

### Question 6.2: "Did 'all checks pass' produce false confidence?"
- **Evidence:** Honest reflection. "The 35 audits all passed. What does that NOT tell me about the feature?"
- **Pass:** I name the things the audits don't check (behavior, voice, visual coherence) and run those audits separately.
- **Fail:** I conflated "checks passed" with "feature works."

### Question 6.3: "What am I assuming works that I haven't verified?"
- **Evidence:** Written list. "I am assuming [X] works because I haven't tested it. To verify, I would need [Y]."
- **Pass:** Every assumption named, every assumption either tested or explicitly accepted as risk.
- **Fail:** Hidden assumptions that ship into production untested.

### Question 6.4: "If a stranger opened the app cold and used this feature, what's their first reaction?"
- **Evidence:** Written walkthrough from stranger's POV. No prior context, no goodwill, no understanding of intent.
- **Pass:** Stranger's first reaction is positive or neutral.
- **Fail:** Stranger's first reaction would be confusion, irritation, distrust, or dismissal.

### Question 6.5: "Stale view check — is what I'm working from current?"
- **Evidence:** After any `str_replace`, did I re-view the file before next edit? After any commit, did I re-fetch before next claim about state?
- **Pass:** Every claim about file/repo state is based on current evidence.
- **Fail:** Working from memory of an earlier state that's now stale.

### Question 6.6: "Pattern-matching trap check — am I shipping based on 'this looks like things I've shipped before'?"
- **Evidence:** Honest reflection. "What's actually different about this feature from my prior work?"
- **Pass:** I treat each feature on its own terms, not as a pattern-match.
- **Fail:** I assumed something works because similar things worked before.

### Question 6.7: "Diff anomaly — does the math add up?"
**Added v1.2 — the failure mode that nearly shipped a duplicate Mirror surface.**
- **Evidence:** Before any commit, sanity-check the diff against the work I think I did. If `git diff --stat` shows +303 lines but I think I typed ~75 lines, INVESTIGATE. If it shows -78 deletions only when I expected ~150 net additions, INVESTIGATE. The investigation tools are: `git show HEAD:file | wc -l` vs `wc -l file` for raw line-count truth, raw `diff` (not `git diff`) for full unfiltered output, and `git log --oneline -5` to verify HEAD is what I think it is.
- **Pass:** When diff math is surprising, I stop and verify before committing. I treat surprise as a signal that my mental model is wrong, not as a curiosity to ignore.
- **Fail:** I notice the diff math is off, shrug, and commit anyway. Symptom in production: duplicate code, missing code, or commits whose titles describe work that wasn't actually done in that commit.

This question caught the Mirror duplicate before it shipped. Diff stat said "+303 lines" when I'd only typed a small inline card. Investigation revealed the anchor + sheet were already in HEAD (committed earlier in the day, lost from context after compaction), and my new card was a duplicate on top. The diff anomaly was the audit gate.

---

## LAYER 7 — Recovery (when something slips through)
**Patches accumulate technical debt. Reverts force reckoning.**

### Question 7.1: "Patch or revert?"
- **Evidence:** Written analysis. "The bug is [X]. A patch would [Y]. A revert would [Z]. The right choice is [W] because [reason]."
- **Pass:** Revert chosen unless the bug is genuinely surface-level AND the underlying feature is conceptually sound.
- **Fail:** Patch chosen when revert was the honest move. ← The default for prestige discipline is revert.

### Question 7.2: "Does the revert commit message contain a comprehensive post-mortem?"
- **Evidence:** Commit message includes: what shipped broken, why the audits missed it, what the audit philosophy needs to learn from this.
- **Pass:** Future-self can read the commit and understand the failure class.
- **Fail:** Commit message is just "revert X."

### Question 7.3: "Does the audit philosophy need updating?"
- **Evidence:** Written check. "This failure was caught by [audit] / not caught by any audit. The audit philosophy needs [no change / a new audit / a refinement of an existing audit]."
- **Pass:** Philosophy is updated when a new failure class is identified.
- **Fail:** Same failure class slips through twice.

---

## The irreducible non-negotiables

These are not audits. These are absolute rules. Violation = the prestige standard is broken, regardless of any other audit results.

1. **Read the canonical docs before any feature work.** No exceptions. The repo has 43+ docs that already answer most design questions. Building a feature without reading its spec is the failure class that shipped Practice Signals.

2. **Articulate science alignment + UI flow improvement before any recommendation.** Both, named, up front. No proposal without both. (Standing requirement, added May 7.)

3. **Phone screenshot before push.** No exceptions. Even for "small" changes. The Practice Signals failure took 5 seconds to surface in a phone screenshot.

4. **Existing surfaces inventoried before new ones built.** No new UI without first showing what's already there.

5. **Worst-case path checked before happy path approved.** Empty / skip / error / hostile context all walked before sign-off.

6. **Every component has explicit conditional wrapper.** No exceptions. Unconditional render is the bug class that hides until production.

7. **Revert > patch when something ships broken.** Patches don't force reckoning; reverts do.

8. **Voice held at the worst-case copy.** If the worst path produces copy that would feel bad to read aloud to a friend, the feature isn't ready.

9. **Science citations verified, not just cited.** Implementation must produce the effect the research measures.

10. **Self-skepticism is the hardest audit.** Confidence is the most dangerous bug.

---

## How a feature actually ships under this philosophy

Step-by-step, in order. Skipping any step = audit philosophy violated.

1. **Document context audit (Layer 0).** Identify and read all relevant docs. Summarize what they specify. Note constraints, decisions, open questions. Compare proposed approach to docs.

2. **Pre-existence audit (Layer 1).** Inventory existing surfaces in code. Verify science. Walk worst-case paths. Make explicit choice: build / integrate / skip.

3. **Science + UI flow articulation (standing requirement).** Before proposing any change to Arlin: name the citations being served or violated, name the mechanism being preserved or restored, name the flow improvement (symmetry / continuity / decisions / data integrity / brand). If I can't articulate either dimension, I haven't earned the right to propose yet.

4. **Design pass.** Address Layer 0 + 1 findings. Decide what to actually build.

5. **Write code.**

6. **Code-hygiene audit (Layer 2).** All 35 hygiene audits pass.

7. **Behavior audit (Layer 3).** Render gating verified. JSX text-leakage scan clean. Full user flow walked end-to-end. Empty / skip / error paths verified. Existing-surface delta confirmed.

8. **Voice + brand audit (Layer 4).** No grading/shaming. No "not X" framings. Self-mastery served. Worst-case copy respected.

9. **Visual coherence audit (Layer 5).** Phone screenshots taken. All states + adjacent screens. No bleed. No code-shaped text.

10. **Self-skepticism pass (Layer 6).** Assumptions named and tested. False-confidence check. Stranger walkthrough.

11. **Stage commit.**

12. **Pre-push audit.** State integrity. Build green. All audits re-run if any code changed.

13. **Push.**

14. **Deploy.**

15. **Post-deploy verification.** AI regression if applicable. Phone test of newly-deployed surface. Update relevant docs.

If any step fails, return to the earliest failed layer. Don't push partial-pass states.

---

## What changes in how I report to Arlin

**Before:** "All 35 audits passed, ready to push."

**After:** A brief report covering:
- Layer 1: Pre-existence findings (existing surfaces, science verification, build/integrate/skip verdict)
- Layer 2: Hygiene audit results
- Layer 3: Behavior audit results — render gating per component, user flow walkthrough, worst-case paths
- Layer 4: Voice audit results
- Layer 5: Phone screenshots (yes / no / which states)
- Layer 6: Self-skepticism check — what am I assuming, what's the stranger reaction
- Recommendation: push / hold / rework / revert

Arlin can scan the report, ask follow-up questions on any layer, and hold me accountable to evidence.

---

## What this philosophy doesn't fix

This philosophy prevents the failure class that shipped Practice Signals. It does not:

- Make me a better designer (still need design judgment)
- Replace user testing (still need real users on real devices)
- Catch every possible bug (still need humility and recovery protocols)
- Make me faster (this is slower than what I was doing — that's the point)

The trade-off is honest: prestige discipline is slower than ship-it-and-fix-it. The Practice Signals failure cost a half-day of recovery work. The audit philosophy adds maybe 30 minutes per feature to prevent that. Net positive.

---

## Failure classes this philosophy prevents

Documented from real failures so far:

1. **Render bleed** (Practice Signals, May 7) — Layer 3.1
2. **JSX text leakage** (Practice Signals, May 7) — Layer 3.2
3. **Vocabulary redundancy with existing UI on the same screen** (Practice Signals, May 7) — Layer 3.5 + Layer 1.1
4. **Science misapplication** (Practice Signals, May 7) — Layer 1.2
5. **Hostile UX on skip-all path** (Practice Signals, May 7) — Layer 4.1 + Layer 3.4
6. **False confidence from passing hygiene audits** (Practice Signals, May 7) — Layer 6.2
7. **Skipping phone test before push** (Practice Signals, May 7) — Layer 5
8. **Building a feature that has a spec without reading the spec** (Practice Signals, May 7) — Layer 0
9. **Duplicate work from missed pre-existence audit** (Mirror surface, May 7 evening) — Layer 1.0 + Layer 1.1 (v1.2 refinements). Failed because pre-existence grep was too narrow (only checked names of NEW code, not feature name) and there was no session-start commit-log review.
10. **Ignoring diff anomaly signals** (Mirror surface, May 7 evening) — Layer 6.7. Failed because surprising diff stat ("+303 lines when I typed ~75") was almost ignored. Investigation revealed the truth, but only because the discipline of audit philosophy v1.1 forced "verify before claiming."
11. **Flow-assumption design** (Build #2 Trigger Profile capture points, May 7 night) — Layer 0.6. Designed where capture points lived without reading the canonical user-flow doc. Proposed Self Mode as primary capture; Self Mode is actually AI-fallback / deliberate-practice, not canonical primary entry for either processing type. The proposal was confidently wrong because no flow grounding.
12. **Synthetic tests verifying fiction** (Phase 1 Body Scan credit, May 7 night) — Layer 2.36. Mocked helpers in tests with field names matching MY ASSUMPTION (`tensionByArea`) instead of actual implementation (`tension`, `bodyScanTension`). All 9 tests passed against fictional data shapes. Production code: morning-delta and trend-context lines never fire because field reads always evaluate undefined.
13. **Field-name read without source verification** (Phase 1 Body Scan credit, May 7 night) — Layer 2.37. Read `sameDay.tensionByArea` and `h.tensionByArea` without grepping where those fields are written. Five-second check would have caught it.
14. **Regex-guard bypass via following existing pattern** (Phase 0 Stage Definitions data layer, May 7 evening, surfaced May 7 night) — Layer 2.38. Used `Date.now() - (variable * 24 * 60 * 60 * 1000)` — preflight regex requires literal-number multiplier and missed the variable form. Followed an existing pattern (4 pre-existing call sites bypass identically). Guard "passed" while violation was visible.
15. **Read-write path mismatch on persisted data** (commit 1f49ddb, May 8 night, surfaced same session) — Layer 2.39. Changed `getEodHistory` and `_s2LongestSustainedCheckinRun` from raw localStorage reads to `secureRead` to address the encryption-at-rest inconsistency, without checking that the corresponding WRITES still went through raw `localStorage.setItem` in `appendDailyLoopHistory` (line 5139). Result: those helpers returned stale boot-time SecureCache snapshots, missing all writes from the current session. Tests passed against pre-seeded data; production was broken for any in-session data. Reverted in the same session. Two more sites (line 17223 getSignalDivergence, line 19704 My Progress sessions reader) had the same pre-existing bug; both fixed via raw read alignment with explicit `// SECURE-KEYS-ALLOW:` markers. The broader encryption-at-rest architectural inconsistency (some SECURE_KEYS use secureWrite, others use raw localStorage) is pre-existing tech debt flagged for future audit, not fixed in scope.

When new failure classes appear, document them here and add the audit that catches them.

---

## Versioning

**v1.0 — May 7, 2026 morning.** Established after Practice Signals revert. The original 8 layers + failure classes 1-8.

**v1.1 — May 7, 2026 afternoon.** Added the Standing Requirement: science + UI flow articulation before every recommendation. Promoted to irreducible non-negotiable #2.

**v1.2 — May 7, 2026 evening.** Added Question 1.0 (session-start ground truth — `git log --oneline -10` + `wc -l` checks) and refined Question 1.1 (explicit grep guidance: feature name, adjacent state names, comment markers, storage keys — not just the names of new code being written). Added Question 6.7 (diff anomaly investigation — when the math is surprising, stop and verify, don't commit). Documented failure classes 9 and 10 from the Mirror surface duplicate near-miss.

**v1.3 — May 7-8, 2026 night.** Added the **Prime Directive of Integrity** (all-caps standing rule from Arlin's directive after a night of assumption-based work). Added Layer 0.6 (flow ground truth — read canonical flow docs before designing user-facing surfaces). Added Question 2.36 (synthetic tests must mock against actual helper return shapes, not assumed shapes). Added Question 2.37 (field-name reads must be verified against source-of-truth definition). Added Question 2.38 (regex guards must catch every documented violation shape — known bypasses are worse than no guard). Added Question 2.39 (for any persisted-data read, the read path must match the write path — secureRead/secureWrite mismatch produces stale-read bugs invisible to other audit layers). Documented failure classes 11-15 from Build #2 Trigger Profile flow assumption + Phase 1 Body Scan field-name bugs + Phase 0 TimeKeeper guard bypass + secureRead/secureWrite read-write path mismatch.

Future versions update this doc when a new failure class is identified. The audit philosophy itself is reviewable, fallible, and evolves.
