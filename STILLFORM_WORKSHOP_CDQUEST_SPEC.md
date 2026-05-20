# STILLFORM WORKSHOP — INSTRUMENT #2: COGNITIVE DISTORTIONS

**ARA Embers LLC · spec locked May 20, 2026 · status: SPEC LOCKED, build pending**

Workshop instrument #2, adapted from the CD-Quest (de Oliveira 2015). Second instrument in the Workshop layer of Bias Profile (Phase 5 sub-item #4). Serves the **cognitive-distortions pattern-work strand**, alongside MCQ-30 (metacognitive beliefs). Per the May 20 architecture lock (`STILLFORM_WORKSHOP_CATALOG_RESEARCH.md`): the four-domain model was retired; this instrument lives in the pattern-work surface.

---

## 1 · WHAT THIS IS

The cognitive-distortions tool of the Workshop. Where MCQ-30 surfaces the *beliefs that run beneath* thinking, CD-Quest surfaces the *shapes the thinking itself takes* — the recurring distortions in how a situation gets read. It's the most directly recognizable Workshop instrument: people can self-identify "yeah, I do that" once given the language, which makes it the strongest teach-recognize tool in the catalog. Each endorsed distortion can land on the Bias Profile watch list as a pattern-work chip; the 15 chips and their ⓘ definitions are already written (`CHIP_DEFINITIONS.md`, `STILLFORM_DISTORTION_VOCABULARY.md`).

---

## 2 · SOURCE RESEARCH (integrity-through-research)

**Primary citation:** de Oliveira, I. R. (2015). Cognitive Distortions Questionnaire (CD-Quest). Validated across English, Brazilian-Portuguese, Turkish, Australian, and adolescent samples; strongest psychometric evidence of the cognitive-distortion measures (total-score α .80–.86, test-retest ICC ~.87, unitary factor structure).

**Structure of the source instrument:** 15 items, one per cognitive distortion, each rated on BOTH frequency and intensity over the past week (a two-dimensional grid). Designed explicitly as a self-monitoring + psychoeducation tool — to help people commit the distortions to memory and recognize them in daily life. Validated 9-item and 5-item short forms exist (Morrison et al. 2022).

**The 15 distortions** (standard Beck/Burns CBT vocabulary — public terms, the *clinical spine* per the two-register rule): all-or-nothing/dichotomous · catastrophizing/fortune-telling · discounting the positive · emotional reasoning · labeling · magnification/minimization · mental filter/selective abstraction · mind-reading · overgeneralization · personalization · should statements · jumping to conclusions · blaming · what-if · unfair comparison.

**The verbatim CD-Quest items are NOT reproduced in this spec or anywhere in Stillform.** They are copyrighted. Stillform's items are original adaptations faithful to each distortion's construct, in Stillform's voice. Fidelity is to the *construct*, not the wording. (Distortion *names* are public CBT vocabulary and fine to use in the clinical spine; they stay out of the user-facing chip ⓘ per the two-register rule.)

---

## 3 · ADAPTATION PRINCIPLES (from USER TREATMENT framing law)

Holds the USER TREATMENT principles (FRAMING_LAW v1.4 / CANON v1.9):

- **Non-clinical voice.** The science is the rigor; the voice is Stillform's. Items read as plain first-person observations, not clinical statements.
- **No scores shown.** No number, rank, or good/bad judgment — including the intensity dimension (it feeds precision data internally; the user never sees a score).
- **No prevalence framing.** Results never claim a distortion is common/typical/rare. Grounding comes from the model that names it (the Beck/Burns distortion framework), not distribution.
- **Honesty paired with acceptance.** Results name the pattern honestly; the voice softens delivery, never substance.
- **Every result has a path forward** (watch-list add + practice).
- **★ The lived-experience guard (critical for THIS instrument).** A distortion is what the mind does *on top of* the data — never the data itself. If a read is accurate (someone was actually dismissed, betrayed, discriminated against), it is NOT a distortion. Items are framed around the *shape of the thinking*, not whether a situation was real, and the result must never tell a user their accurate read of a real harm is a distortion. This is the reframe.js rule (~line 952) carried into the instrument.

---

## 4 · THE 15 ADAPTED ITEMS

First-person, plain, past-week framing. **In production, items present in a fixed but non-thematic order** (a distortion's name is never shown beside its item during the take — recognition is taught in the result, not pre-loaded).

### Workshop intro (shown before the user starts)
> This is a closer look at the shapes your thinking takes under pressure — the moves a mind makes when it's reading a hard situation fast. These patterns come from a long-studied map of how thinking bends. No scores, no right answers, no judgment. For each one: did it show up this week, and when it did, how much did it grip you? About 5 minutes.

### Response shape (two-part, every item)
The two-part shape is deliberate. Frequency = how often the pattern ran. **Intensity = how hard the thought gripped you — and that grip is the precision self-report** (how much confidence your mind handed the thought; see the Precision Framework). Both are captured; neither is shown back as a number.

- **This week, how often?** → *Didn't · Once or twice · Several times · A lot*
- **When it showed up, how much did it grip you?** → *Barely · Some grip · Strong grip* (only asked if frequency > "Didn't")

### The items (original adaptations, faithful to construct)
1. *(all-or-nothing)* "I read something as all good or all bad — a total win or a total wreck — with nothing in the middle."
2. *(catastrophizing)* "I ran the worst version of what might happen and treated it like what would happen."
3. *(discounting the positive)* "Something went right and I explained it away, shrank it, or chalked it up to luck."
4. *(emotional reasoning)* "I took a feeling as proof — I felt it, so it must be true."
5. *(labeling)* "A single slip turned into a statement about who I am — not 'I failed at this' but 'I'm a failure.'"
6. *(magnification/minimization)* "I blew one thing way up, or shrank something down so it barely counted."
7. *(mental filter)* "Out of a mixed situation, I locked onto the one bad part and lost the rest."
8. *(mind-reading)* "I decided I knew what someone thought or felt about me, without them telling me."
9. *(overgeneralization)* "One thing happened and I turned it into 'always' or 'never.'"
10. *(personalization)* "Something went wrong and I treated myself as the cause, without clear evidence the line ran to me."
11. *(should statements)* "I held myself or someone else to a should / must / have-to, and falling short of it stung."
12. *(jumping to conclusions)* "I landed on a conclusion fast, before I actually had the evidence for it."
13. *(blaming)* "I sorted who was at fault — pinned it on myself or someone else — quickly."
14. *(what-if)* "I ran a chain of what-ifs, each one worse than the last."
15. *(unfair comparison)* "I measured myself against someone else and read the result as proof of my worth."

---

## 5 · RESULT PRESENTATION (no scores, no prevalence — dysfunction-pattern frame)

### Endorsed (frequency ≥ "Several times," OR "Once or twice" with "Strong grip")
Name the pattern in loop-voice (the chip label + its ⓘ definition), then offer the watch-list add. Example shape:

> **Running comparisons** showed up for you this week, and when it did it had a strong hold. This is one of the patterns the distortion map names — the mind benchmarking you against someone else and reading the result as data about your worth. Want to add it to your Bias Profile watch list? Stillform's AI will flag it during Reframe, and the practice can loosen its grip over time.

The "how much it gripped you" reading is *used*, not shown — strong-grip distortions are the high-precision priors, surfaced first and weighted in the AI's Reframe context. No number, no severity label.

### Lightly present (low frequency, low grip)
Named gently, no push to watch-list: *"[Pattern] showed up once or twice and didn't get much hold — worth knowing it's in your repertoire, nothing more."* Honest, no inflation.

### Not endorsed (clustered at "Didn't")
Not surfaced as absence-of-problem; simply not named. The instrument reports what's running, not a clean bill.

### The lived-experience turn (always available)
Any result carries a one-tap "this was a real situation, not a pattern" path that removes the item from the distortion read and logs it as data, not distortion (per §3 guard). The user is the authority on whether their read was accurate.

---

## 6 · NOTES ON SPECIFIC DISTORTIONS (judgment-free framing)

- **Should statements** — never imply the user is wrong to hold standards. The chip and result frame the *rigidity* of the should, not the having of values ("the standards aren't the problem; the rigidity is").
- **Blaming** — never blame the user for blaming. Framed as a protective sorting move that can run ahead of the facts.
- **Emotional reasoning** — the feeling is always honored as real and worth hearing; only its use *as evidence about the world* is the pattern.
- **Mind-reading** — distinct from accurate social reading. The pattern is filling the gap with no data; an accurate read of a real signal is not the pattern (lived-experience guard).

---

## 7 · PATTERN-WORK CHIP MAPPING

Each of the 15 items maps to one distortion chip, already named and defined: the two-setting dial · rehearsing the worst · the good doesn't count · the feeling as the fact · the thought wearing your name · the stuck zoom · the one dark thread · filling in the why · one time becomes always · making yourself the cause · the rulebook · verdict before evidence · sorting who pays · the what-if ladder · running comparisons (`CHIP_DEFINITIONS.md` + `STILLFORM_DISTORTION_VOCABULARY.md`). These share the pattern-work strand with the 5 MCQ-30 metacognitive-belief chips. A chip is *proposed* on endorsement; the user confirms before any chip lands (AI never adds to the diagnostic stack without consent — concierge Principle C).

---

## 8 · THRESHOLD + ACCESS (push and pull)

- **Push:** the AI proposes CD-Quest when distortion-shaped language recurs across Reframe sessions (≥3 sessions in 14 days carrying the same distortion shape — e.g., repeated all-or-nothing or catastrophizing language). The proposal names the observed shape and offers the closer look. Never auto-administered.
- **Pull:** always available in the Library → Workshop section.
- **Re-administration:** take-once, then user-initiated. On retake, the result shifts to a data-mirror register (what's changed in frequency/grip over time) rather than a fresh diagnosis — without showing scores.

---

## 9 · FREQUENCY

~5 minutes (15 items, two-part). The 9-item short form (Morrison et al. 2022) is the fallback if the full take proves too long in testing. Past-week recall window (CD-Quest standard).

---

## 10 · ADAPTATION CHALLENGES NOTED (for future review)

- **Vocabulary unification is a hard prerequisite** and is DONE — `STILLFORM_DISTORTION_VOCABULARY.md` reconciles reframe.js in-session naming, this instrument, and the chips into one list. reframe.js alignment to the full 15 is a build-time task (with Arlin's go + testing).
- **The two-part response adds length.** 15 × 2 ratings. Watch for fatigue in testing; short form is the lever.
- **Intensity-as-precision must stay internal.** It's tempting to show the user their "grip" trend; resist — it becomes a score. It feeds the AI and the data mirror, not the user-facing result.
- **Overlap with MCQ-30 at the edges** (e.g., what-if/catastrophizing shade toward worry-beliefs). The two instruments are distinct strands; if a user takes both, the result presentation should cross-reference, not double-name the same loop.

---

## 11 · OPEN ITEMS / DEPENDENCIES

- Pattern-work strand data layer + watch-list editor must exist before chips can land (Bias Profile core build).
- Final confirmation of the two-part response wording (Didn't/Once-or-twice/Several/A-lot · Barely/Some/Strong) in testing.
- reframe.js distortion-shape detection for the push trigger (build-time; uses the unified vocabulary).
- Build sequence: this is instrument #2, after MCQ-30. Next: SRIS (capacities/See-yourself).

---

ARA Embers LLC · Workshop Instrument #2 (Cognitive Distortions) · spec locked May 20, 2026
