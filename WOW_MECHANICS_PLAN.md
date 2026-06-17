# WOW MECHANICS — research → spec → build plan (scope-locked, June 15 2026)

**Owner:** Arlin. **Status:** living workstream doc — the single recovery point for the
"make Stillform *act* prestige, not just look it" effort. Per scope-lock protocol:
this doc is updated BEFORE and AFTER each step; no build begins until its spec is
locked here.

---

## Why this exists

The June 15 audit established the app is overwhelmingly *built*. Arlin's sharper point:
it still *behaves* like its category — you name, it reframes, it replies. Competent, not
ingenious. The category (Daylio, Calm, Woebot, Replika, Finch, How We Feel) all do one
loop: **log a feeling → get soothed/tracked.** Stillform's job is to *behave* in a way
none of them do — to produce the "how did it know that" moment that makes someone feel
the app understands them. That layer is design/vision (Arlin leads); the engineering and
the science grounding is the build (Claude). This doc holds the pipeline.

---

## The unifying scientific spine (the prestige frame)

**Active inference / predictive processing** (Friston; Seth & Friston 2016; Paulus 2019;
Barrett 2017). The brain is a prediction machine minimizing prediction error against
priors. Maladaptive patterns = **hyperprecise priors** (over-confident catastrophic
expectations) + **limited access to corrective evidence**. Anxiety = over-precise threat
priors → hypervigilance. Depression = flattened precision for positive prediction errors.

**The single lever:** turn DOWN the precision (confidence) on a maladaptive prior by
feeding it corrective evidence / prediction error.

**Stillform reframed:** not a mood app — a **precision-recalibration instrument.** Its
unfair advantage is that it *holds the user's accumulated evidence*, so it can do the one
thing the category can't: systematically deliver the corrective evidence that recalibrates
over-certain priors. Every mechanic below is a different route to the same lever.

> Sources gathered June 15 2026 (web): Paulus et al. 2019 (hyperprecise priors / context
> rigidity, interoceptive active inference); Seth & Friston 2016 (active interoceptive
> inference and the emotional brain, Phil Trans R Soc B); predictive-coding psychiatry
> review (Frontiers Psychiatry 2025). **All citations are web-verified-before-ship per
> the zero-fabrication standard — no number/attribution ships in-app unchecked.**

---

## INVENTORY — already built (NEVER re-propose these as new)

Verified against live code June 15 2026:
- **Naming growth / language sharpening over time** — `lib/namingGrowth.js`, surfaced on
  My Progress ("YOUR NAMING, OVER TIME", early vs recent in the user's own words). Built
  this session (commit 0513300). = sharper generative model.
- **Prediction errors / "What Didn't Come True"** — `lib/predictionErrors.js` +
  `predictionLog.js` + "What You Bet On" mirror. Full prediction→outcome→disconfirmation
  loop. = logging prediction errors to lower threat-prior precision.
- **Trigger Profile, Bias Profile, Context Profile, Capacities ("Growth") mirror,
  Where You Lean (risk profile)** — all built, reachable from My Progress.
- **Concierge cluster** (Mirror strip, mediation queue, trajectory, thread) — built.
- **Crisis handoff summary** — `lib/sessionSummary.js`, opt-in, deterministic, own-words.
- **Core loop** (extract→work, de-mirrored), all 7 Workshop instruments, 5 beats.

---

## RESEARCHED — ready to spec (the wow mechanics)

### M1 — Reconsolidation-window mismatch  *(the biggest, most novel)*
**Science:** memory reconsolidation. A reactivated emotional learning is briefly *labile*
(editable) for ~hours; the active ingredient that updates it is a **felt mismatch /
prediction error** delivered while it's active — not a cognitive reframe. Produces
"transformational" not "incremental" change (the trigger genuinely stops firing).
*Sources (web, June 15): Ecker 2024 (J Psychiatry & Psychiatric Disorders, reconsolidation
behavioral updating review); three-step reactivate→mismatch→integrate.*
**The wow:** when an old, often-named pattern reactivates, Stillform catches it *live* and
delivers a felt contradiction built from the user's OWN accumulated evidence
("[Name] is bracing for the verdict again — last time, and the four before, it never came"),
timed to the editable window. Not display ("here's your pattern") — the corrective
mismatch, timed. Uses the data as ammunition, not a chart.
**Status:** researched, NOT specced. **Safety:** must not re-expose distress destructively;
deterministic evidence assembly; reflects-not-diagnoses.

### M2 — Self-distancing language  *(most buildable in text)*
**Science:** Kross & Ayduk self-distancing; Kross et al. 2014 (JPSP); Moser et al. 2017
(Sci Reports, ERP+fMRI). Referring to the self by name / "you" instead of "I" during
introspection automatically reduces the neural marker of emotional reactivity within ~1s,
*without* effortful cognitive control; improves wise reasoning (Solomon's paradox).
**The wow:** Stillform reflects the user's own spiral back in distanced language — their
naming, re-voiced as "you"/their name — which the science says lowers reactivity by itself.
A linguistic switch that lands the corrective without triggering defense. Pairs with M1
as the delivery voice.
**Status:** researched, NOT specced.

### M3 — Interoceptive precision recalibration
**Science:** anxiety as miscalibrated interoceptive precision — hyperprecise priors /
under-weighted bodily signals (Paulus 2019; Seth & Friston 2016; Verdonk 2024 HEP). MAIA-2
is already a Stillform instrument.
**The wow:** close the interoceptive loop — surface the gap between what the body predicted
and what it actually did, recalibrating the body-prediction that drives the feeling. Roots
the whole frame in the body, which is on-brand (body before thought).
**Status:** researched, NOT specced. Leverages existing MAIA-2 instrument.

---

## TO RESEARCH — queue (bring more wow candidates)

- **Narrative identity / redemptive sequencing** (McAdams) — how the user sequences their
  own story predicts wellbeing; Stillform holds the story over time.
- **Episodic future thinking** — vividly pre-experiencing a future moment shifts present choices.
- **Mental contrasting / WOOP** (Oettingen) — wish vs obstacle; fits the spine structure.
- **Self-compassion** (Neff) — buffers the threat response to one's own failures.
- **Temporal landmarks / fresh-start effect** (Dai/Milkman) — timing interventions to
  meaningful dates.
- **Affect labeling depth** (Lieberman) — beyond what's built; the neural mechanism of naming.

---

## PIPELINE (per mechanic)

1. **Research** — web-search the primary science; capture mechanism + citations here.
2. **Spec** — write a full spec (template below); commit it; lock scope.
3. **Build** — only after spec is locked. Read-before-build. Verify by eyes + e2e.
4. **Ship checklist** — UAT, tutorial, FAQ, transfer doc, Plausible, privacy, science
   sheet, AI prompts, promo, punch list, emotion coverage (as applicable).

### Spec template (per mechanic)
- **Mechanism + citation** (web-verified before ship)
- **The wow moment** (exact user-facing experience)
- **Data it uses** (existing fields / new capture)
- **Deterministic vs AI** (default deterministic on sensitive ground)
- **Surface** (where it lives; reflection-safe placement)
- **Honesty/safety bar** (no fake metrics; reflects-not-diagnoses; user-authority)
- **Build steps + verification plan**

---

## Standing constraints (carry across every mechanic)
- Zero fabrication; citations web-verified before shipping in-app.
- No fake-precise metrics (no "73% granularity"). Evidence in the user's own words.
- Deterministic where it touches sensitive/crisis-adjacent ground.
- Reflects, never diagnoses (user is the authority on their experience).
- Framing law holds: metacognition / self-mastery; composure is a felt outcome, never a headline.
- Nothing is "post-launch" — every promised mechanic ships at launch or isn't promised.
