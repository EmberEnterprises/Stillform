# AI PROMPT FRAMING AUDIT — `netlify/functions/reframe.js`
**ARA Embers LLC · May 12, 2026 · v1.1 · EXECUTED**

> **STATUS UPDATE — May 12, 2026 (later that day):** All 5 violations cataloged below have been fixed across all three prompts (CALM, CLARITY, HYPE). Fix commits on branch `feat/home-wiring-surface`:
>
> - **Commit 2.1** (`ed85427`) — CALM_SYSTEM framing law alignment
> - **Commit 2.2** (`d3acf46`) — CLARITY_SYSTEM framing law alignment
> - **Commit 2.3** (`90836ea`) — HYPE_SYSTEM framing law alignment
>
> Verification: `grep -n -E 'self-mastery tool|Low conceptual processing|composure as a discipline|composure as a daily discipline' netlify/functions/reframe.js` returns **zero matches**.
>
> PracticeSurface (commit `d84a916`) is now safe to expose to users — the AI surface no longer contradicts the home framing.
>
> The catalog below is preserved as the design record. Each "Proposed fix" was applied as documented; see commit messages for fix-specific details.

---

## ORIGINAL CATALOG (May 12, 2026 morning)

This audit catalogs framing violations in the three AI system prompts in `netlify/functions/reframe.js` against STILLFORM_FRAMING_LAW.md (May 12, 2026). It is **catalog only** — no edits to the prompts are applied in this commit. Reframe system prompts shape the deepest user-facing surface (every Reframe session is built on them); changes need Arlin's eyes before they land.

This doc sits as the input to a future commit that applies the fixes.

---

## Scope

Three system prompts audited:

- **CALM_SYSTEM** — line 858, used when feel state suggests activation/grief/overwhelm
- **CLARITY_SYSTEM** — line 987, used when feel state suggests spiraling/decision friction
- **HYPE_SYSTEM** — line 1091, used pre-event (interview, performance, hard conversation)

Routing in `reframe.js` selects which prompt to send based on `mode` + `feelState`.

The rest of `reframe.js` (~1825 lines) contains: science card system prompt (line ~160), CITATIONS_INDEX with research-grounded findings (lines 86+), affect-labeling helpers, rate limiting, and the various deterministic fallback paths. Those are addressed separately — this audit focuses on the three Reframe AI prompts because they directly shape user experience in the deepest practice surface.

---

## Violation #1 — "self-mastery tool"

**Found in all three prompts:**
- CALM_SYSTEM line 858: `"Stillform's Reframe — a self-mastery tool for people building composure as a daily discipline"`
- CALM_SYSTEM line 871: `"Someone using a self-mastery tool"`
- CLARITY_SYSTEM line 1000: `"Someone using a self-mastery tool"`
- HYPE_SYSTEM line 1104: `"Someone using a self-mastery tool"`

**Why it's a violation:** Per STILLFORM_FRAMING_LAW.md (WHAT STILLFORM IS), Stillform IS a metacognition practice that builds the concept library the brain uses to perceive its own internal states. Self-mastery is one part of the science spine (Bandura 1977 — sense of mastery as the strongest source of self-efficacy) but it is a supporting concept, not the product framing. Calling Stillform "a self-mastery tool" mis-names what the product is. Also: "tool" framing locates Stillform as a device the user reaches for; "practice" framing locates it as an ongoing engagement.

**Proposed fix (all three prompts):** Replace "self-mastery tool" with "metacognition practice." Replace "Someone using a self-mastery tool" with "Someone in their metacognition practice." This naming aligns with the framing law's supreme definition and with the new home's PracticeSurface naming.

---

## Violation #2 — "composure as a daily discipline" / "Composure is a discipline; they are practicing it"

**Found in all three prompts:**
- CALM_SYSTEM line 858: `"a self-mastery tool for people building composure as a daily discipline"`
- CALM_SYSTEM line 873: `"They are an operator practicing composure as a discipline"`
- CLARITY_SYSTEM line 1000: `"Composure is a discipline; they are practicing it."`
- HYPE_SYSTEM line 1104: `"Composure is a discipline; they are practicing it. They are an operator preparing for performance."`

**Why it's a violation:** Per STILLFORM_FRAMING_LAW.md (REGULATION AND COMPOSURE WITHIN THE PRACTICE), composure is one felt outcome that signals the practice is working — NOT the product, NOT what is being practiced, NOT a "discipline" the user practices. The user practices metacognition (concept-formation through repeated structured analytical work). Composure is what they may notice after. Framing composure as the discipline itself misdirects every Reframe session toward composure-as-goal rather than concept-building-as-substance.

**Proposed fix:** Replace with framing-law-aligned language. Example rewrites:

- "for people building composure as a daily discipline" → "for people in an ongoing metacognition practice"
- "They are an operator practicing composure as a discipline" → "They are an operator deepening their metacognition practice — they came here to name a pattern, build a concept, reach a takeaway"
- "Composure is a discipline; they are practicing it" → "The practice is metacognition — naming what their thinking is doing with specificity. Composure follows as one felt outcome; it is not the goal."

---

## Violation #3 — "Low conceptual processing: minimal analysis"

**Found in all three prompts:**
- CALM_SYSTEM line 864: `"Low conceptual processing: minimal analysis, minimal interpretation"`
- CLARITY_SYSTEM line 993: `"Low conceptual processing: minimal analysis"`
- HYPE_SYSTEM line 1097: `"Low conceptual processing: minimal analysis"`

**Why it's a violation:** This is the most severe violation in the prompts. Per STILLFORM_FRAMING_LAW.md (WHAT THE PRACTICE LOOKS LIKE — analysis as concept-formation) and the May 12 conversation: Stillform's practice is ANALYTICAL work that produces fast observation. Per Barrett (2017) constructed emotion theory, the brain perceives internal states by constructing them using concepts; analytical work IS concept-formation; without analytical work there is nothing for observation to operate on. The "minimal analysis" instruction in the prompts directly contradicts the framing law — it tells the AI to suppress the substance of the practice.

This is also a Layer 4.8 violation (graduate-from-analysis anti-patterns). "Minimal analysis" implies the user should be doing less analysis; the framing law says the user is BUILDING ANALYTICAL CAPACITY that becomes fast over time.

**Proposed fix:** This is the most consequential change. The six-element list (Meta-awareness / Decentering / Attentional flexibility / Low conceptual processing / Low goal-directed coping / Decentered relationship) comes from Wells (2009) detached mindfulness which is ONE supporting approach but is NOT the full mechanism per the framing law. The element list itself needs reframing.

Replacement framing for the mechanism block (all three prompts):

```
The mechanism is metacognition — building the concept library the brain uses
to perceive its own internal states. The user is engaging in analytical work
that, repeated over time, becomes fast pattern recognition. You help them
name what is happening with increasing specificity. Wells (2009) detached
mindfulness is one supporting move (seeing the thought as a thought, not
the truth); the broader practice is analytical concept-formation that
deepens granularity (Barrett 2017 constructed emotion theory; Hoemann 2021
on experience sampling as granularity intervention).

Bounded analytical engagement:
- Name what their thinking is doing, with specificity
- Help them reach for the precise word that fits the pattern
- Build the concept — make the mental representation more granular
- Decentered relationship: the user has the thought; the user is not the thought
- Closed loop: each session reaches a takeaway, then closes (per failure-mode
  prevention from Hitchcock et al. 2024 on meta-control failure — open-ended
  introspection is rumination, not practice)
```

Removes the "minimal analysis" instruction. Adds the analytical-substance directive. Preserves the Wells decentering work as one supporting move rather than the whole mechanism.

---

## Violation #4 — Mechanism narrowed to Wells 2009 alone

**Found in all three prompts:**
- CALM_SYSTEM line 860: `"The mechanism is metacognitive observation (Wells 2009 detached mindfulness)"`
- CLARITY_SYSTEM line 989: `"The mechanism is metacognitive observation (Wells 2009 detached mindfulness)"`
- HYPE_SYSTEM line 1093: `"The mechanism is metacognitive observation (Wells 2009 detached mindfulness)"`

**Why it's a violation:** The framing law's science spine for metacognition includes Flavell (1979) foundational metacognition, Schraw & Moshman (1995), Veenman et al. (2006), Frontiers in Psychology (2026) synthesis of metacognition + neuroplasticity. Wells (2009) is in the spine but as ONE supporting approach — specifically for detached mindfulness work. Naming Wells alone as "the mechanism" narrows the science to one author/approach.

**Proposed fix:** Cite the broader spine. Example (combined with Violation #3 fix):

```
The mechanism is metacognition (Flavell 1979; Schraw & Moshman 1995; Veenman
et al. 2006; Frontiers 2026) — building the concept library the brain uses
to perceive its own internal states. Wells (2009) detached mindfulness is
one supporting move inside this mechanism, not the whole thing.
```

This positions Wells correctly — supporting move, not full mechanism.

---

## Violation #5 — Observation framed as endpoint, not as mature analytical work

**Found in all three prompts:**
- CALM_SYSTEM line 858: `"to observe their own thinking when their state is loud"`
- CALM_SYSTEM line 875-877: `"Surface what their thinking is doing — name the pattern, not the content"` (good — analytical) but framed inside `"The user came here to observe their own thinking"` (observation framing)
- CLARITY_SYSTEM line 989: `"the user steps out of the loop by observing it, not by solving it"` — observation as the move
- CLARITY_SYSTEM line 997: `"You name what their thinking is doing; the user observes it"` — split: AI names (analytical), user observes (observational)

**Why it's a partial violation:** The framing law says: "The 'observational' experience in mature practice is what high-skill analysis looks like from the inside." Pure observation framing misses that the user is doing ANALYTICAL work that *becomes* observational over time. Asking the user to "just observe" when their library is still being built is asking them to skip the substance.

Important nuance: in the CALM/CLARITY/HYPE prompts, the AI is already doing the analytical work (naming patterns with specificity — "Your system is rehearsing for something that hasn't happened"). That's correct. What needs adjustment is the meta-framing of WHO is doing what: it's not "AI names, user observes." It's "AI scaffolds the analytical work, user does the analytical work, observation is what mature analysis feels like from the inside."

**Proposed fix:** Slight rewording to position observation as the *experience* of the practice working, not the *task* of the practice. Example:

- "The user came here to observe their own thinking" → "The user came here to name a pattern in their thinking with specificity — to do the analytical work that builds their concept library. The observational quality emerges as the analytical work becomes fast."
- "You name what their thinking is doing; the user observes it" → "You scaffold the analytical work — naming the pattern with the precision the user is reaching for. The user does the analytical work alongside you. What feels like observation is fast analysis."

---

## Non-violations (verified framing-law-aligned)

These passages are kept as-is — they are framing-law-aligned and important:

- The "WHEN THE EXPERIENCE IS REAL" block (CALM line 882-883) correctly distinguishes data from pattern. Aligned with the framing law's audience grounding.
- The "Do not pull toward repair, trauma, intensity, or 'you're carrying a lot' framing" instruction is correct — matches the framing law audience (enhancement-seekers, not relief-seekers).
- The "VOICE" block (line 896-899) — banned phrases list ("I hear you," "sit with that," "unpack that," "what comes up for you") is correct and framing-aligned.
- The "WHAT MAKES OBSERVATION WORK" example responses (lines 886-895) are analytically substantive — they name patterns with specificity, which is the framing-law-aligned move. The framing INSIDE the examples is correct. The header word "OBSERVATION" could be renamed to "WHAT THE PRACTICE LOOKS LIKE" to align with the analytical-work positioning, but the examples themselves stay.
- The CITATIONS_INDEX (lines 86-130+) is per-feature science evidence and is fine.

---

## Recommended fix sequence

**One commit per system prompt**, each independently shippable and revertable:

**Commit 2.1 (CALM_SYSTEM fix):**
- Replace "self-mastery tool" → "metacognition practice" (2 sites)
- Replace "composure as a daily discipline" / "operator practicing composure as a discipline" with framing-law-aligned language
- Rewrite the six-element mechanism block to remove "Low conceptual processing: minimal analysis" and add analytical-substance directive
- Cite the broader science spine instead of Wells alone
- Adjust observation framing (Violation #5)
- All other content preserved

**Commit 2.2 (CLARITY_SYSTEM fix):**
- Same five changes applied to CLARITY_SYSTEM
- Plus: CLARITY mode is for spiraling/decision friction — clarify that the analytical work in spiraling sessions is naming the loop and reaching one bounded takeaway (per Hitchcock 2024 — open-ended introspection IS the failure mode, bounded analysis is the correction)

**Commit 2.3 (HYPE_SYSTEM fix):**
- Same five changes applied to HYPE_SYSTEM
- Plus: HYPE mode framing of "ready" instead of "calm" stays — that's already correct. Just remove the "composure is a discipline" framing.

**Optional Commit 2.4 (cross-prompt deduplication):**
After 2.1-2.3, the six-element block and "WHO YOU'RE TALKING TO" framing are nearly identical across the three prompts. Consider extracting to a shared constant `METACOG_PRACTICE_PREAMBLE` and composing each system prompt as preamble + mode-specific tail. This is a separate concern — code cleanliness, not framing fix. Defer until after framing fixes ship and validate.

---

## Risk assessment

- **User-facing impact:** HIGH. Reframe is the deepest practice surface; every session uses one of these prompts. Changes to the AI's read of "what Stillform is" propagate to every response the user reads.
- **Reversibility:** HIGH per commit — each commit is one constant assignment in one file. Trivial to revert.
- **Build risk:** LOW. No new code, no new dependencies, no new state. Just system prompt content changes.
- **Validation:** Each commit should be reviewed by Arlin in branch before merging. Recommend running 2-3 test sessions per mode after each commit, since AI behavior changes are hard to predict from prompt diffs alone.

Per audit philosophy v2.0 Prime Directive #5 (NO FRAMING DRIFT): these changes are not optional. They are the application of the framing law to the deepest practice surface. Whether 2.1/2.2/2.3 ship together or sequentially, all three must ship before the new home (PracticeSurface) reaches users — otherwise the home will route users to AI prompts that contradict what the home tells them they're entering.

---

*ARA Embers LLC · AI Prompt Framing Audit · May 12, 2026*
