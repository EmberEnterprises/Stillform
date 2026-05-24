# STILLFORM DISTORTION VOCABULARY — SINGLE SOURCE OF TRUTH

**ARA Embers LLC · locked May 20, 2026 · reconciliation item (b) from the Bias Profile architecture lock**

> **Purpose:** ONE distortion vocabulary that serves all three places distortions appear, so we never ship two competing lists:
> 1. **reframe.js** — in-session AI naming (the `distortion` output field + the prompt's pattern-handling guidance)
> 2. **CD-Quest Workshop instrument** — the pattern-work strand's cognitive-distortion tool (teach-recognize)
> 3. **Pattern-work chips** — the Bias Profile watch-list chips
>
> This is the canonical list. reframe.js, the CD-Quest adaptation spec, and the chip catalog all draw from it. When the Bias Profile is built, reframe.js gets aligned to these names (build-time task, with Arlin's go + testing — not edited now).

---

## THE PRINCIPLE — ONE LIST, TWO REGISTERS

The tension this resolves: reframe.js deliberately names patterns in Stillform's **loop voice** ("You are running comparisons") and never uses clinical labels at the user — because a diagnostic label ("you're catastrophizing") violates the USER TREATMENT principles (observation, not pathology; no judgment). But CD-Quest's teach-recognize mechanism *works* precisely because the distortions have recognizable names people can self-identify with.

Resolution: **each canonical pattern has two registers.**
- **Clinical spine** (underneath) — the research-grounded name (CD-Quest / Beck-Burns). This is what the pattern maps to in the literature; it's how the construct stays honest and citable. The user does not see this as a verdict.
- **Stillform loop-voice** (on the surface) — how the pattern is named to the user, in-session and on chips: as a *process the system is running*, never as a label the user *is*. Same pattern, named as motion, not identity.

The Workshop can *teach* the recognizable name (psychoeducation register — "this pattern is called all-or-nothing thinking") because teaching the map is different from pinning the label on the person mid-spiral. The in-session AI and the chips use the loop-voice.

---

## THE CANONICAL 15 (CD-Quest spine · Beck/Burns)

For each: **clinical spine** · **Stillform loop-name (chip label candidate)** · **in-session phrasing seed** (aligned to existing reframe.js voice) · **precision read** (the characteristic shape of over-weighted prior — ties to the Precision Framework: every distortion is a specific miscalibration).

1. **All-or-nothing / dichotomous** · *the two-setting dial* · "The dial only has two settings right now. Most of what's true lives between them." · *Prior collapses a graded reality into a categorical one — over-weights the extremes.*
2. **Catastrophizing / fortune-telling** · *rehearsing the worst* · "Your system is rehearsing for something that hasn't happened." · *Over-weights the worst-outcome prior against its actual likelihood.*
3. **Discounting the positive** · *the good doesn't count* · "The wins are landing and sliding off. Notice the sliding." · *Down-weights confirming evidence so the negative prior never updates.*
4. **Emotional reasoning** · *the feeling as the fact* · "The feeling is real. It's being read as proof. Those are two different things." · *Treats the affective signal as high-precision evidence about the world.*
5. **Labeling / fusion** · *the thought wearing your name* · "That's a thought your system is producing. You are not the thought." · *A single judgment becomes a high-precision prior about identity.*
6. **Magnification / minimization** · *the stuck zoom* · "The zoom is jammed — one thing huge, the rest shrunk." · *Mis-scales the precision of one element relative to the rest.*
7. **Mental filter / selective abstraction** · *the one dark thread* · "Your system pulled one thread and called it the whole cloth." · *Over-weights a single salient detail as the whole picture.*
8. **Mind-reading** · *filling in the why* · "Your system is filling in the why with no data. The not-knowing is the loud part." · *High-precision social-inference prior with no evidence behind it.*
9. **Overgeneralization** · *one time becomes always* · "One instance just became 'always.' Watch the jump." · *A single data point sets a high-precision general prior.*
10. **Personalization** · *making yourself the cause* · "Your system is routing the cause back to you. Check whether the line actually runs there." · *Over-weights self-as-cause prior over other explanations.*
11. **Should statements** · *the rulebook* · "There's a rulebook running — should, must, have-to. Who wrote it?" · *Rigid high-precision prior about how things ought to be; the rigidity is the cost, not the having of values.*
12. **Jumping to conclusions** · *verdict before evidence* · "The verdict landed before the evidence is in. Notice the speed." · *Commits to a prior before sampling the data (the CRT reflective-override failure).* 
13. **Blaming (self or other)** · *sorting who pays* · "Your system is sorting who pays. That's the protective move. Let the sorting settle before the plan locks in." · *Over-weights a single-cause attribution prior, inward or outward.*
14. **What-if** · *the what-if ladder* · "Each what-if is building the next rung. The ladder only goes down." · *Recursive worst-case prior generation, each step inheriting the last's precision.*
15. **Unfair comparison** · *running comparisons* · "You are running comparisons. Comparisons are a process, not data about you." · *Over-weights an external benchmark prior as evidence about the self.*

---

## THE BOUNDARY — WHAT IS *NOT* IN THIS LIST

The distortion strand is one of two pattern-work strands. Keep these distinct:

- **Metacognitive beliefs → MCQ-30 strand, NOT here.** "Replaying a conversation," "stuck on whether the thought is true," worry-about-worry, mind-as-uncontrollable — these are *beliefs about thinking*, the MCQ-30 territory. They are pattern-work too, but a different instrument and a different chip set. Don't fold them into the distortion list.
- **Real patterns and states → NOT distortions, ever.** reframe.js already handles these correctly and that handling must be preserved: silencing dynamics (a partner who cries / a boss who escalates every time), outsider experience (treated as less-than for accent/origin/background), ADHD/freeze. Per the locked rule (reframe.js line ~952): *"If someone was actually betrayed, discriminated against, dismissed, talked over, harmed — the read is data, not a pattern. Do not call lived experience a distortion."* The pattern, if any, is what the system runs *on top of* the real data — never the data itself. These keep their existing data-first handling and are NEVER chipped as distortions.

---

## WHERE THIS IS USED + ALIGNMENT NOTES

- **reframe.js — ✅ ALIGNED to this list (May 23, 2026, `c982ffb`; Step 6b):** a shared `DISTORTION_VOCABULARY` contextPart now carries all 15 (loop-voice seeds toward the user, extended from the original #2/#5/#8/#13/#15), and the `distortion` output field emits the canonical clinical-spine name (machine-side, for chip mapping) while the user-facing `reframe` text stays loop-voice. Distortion field = spine name (internal); user never sees the clinical label as a verdict.
- **CD-Quest Workshop adaptation:** the 15 above are the items. Original Stillform-voiced item text (never CD-Quest verbatim). Teach-recognize register may name the clinical spine as psychoeducation. Preserve CD-Quest's intensity rating = the precision self-report (per catalog brief #2).
- **Pattern-work chips:** chip label = the Stillform loop-name; chip maps internally to the clinical spine; chip definition can teach the recognizable name. Five metacognitive-belief chips (MCQ-30) + these distortion chips populate the pattern-work strand together.

---

ARA Embers LLC · Distortion Vocabulary · single source of truth · locked May 20, 2026
