# BODY-FIRST PRE-RATE FRICTION FIX SPEC — RETRACTED

**Status:** WITHDRAWN April 30, 2026.

## Why this spec was retracted

Arlin caught it: I drafted this spec without first checking what was already planned and resolved in the master todo. Three things I missed:

1. **Master Todo line 46** — there's already an architectural entry titled "Body-first metacognition access gap" that examined this same concern.

2. **Master Todo line 321** — that exact gap was VERIFIED ALREADY IMPLEMENTED Apr 27. Body-first users go Pre-rate → Bio-filter → Breathe → Post-rate → Ground, and the grounding-complete screen has "Continue to Reframe →" as PRIMARY CTA. The metacognition route is built into the existing pathway flow. The closing note on that entry explicitly said: "Going forward: read the existing flow before claiming a gap."

3. **Master Todo line 361** — the pre-rate science gap was already RESOLVED via commit ae43f4db. The chip rows in BreatheGroundTool pre-rate and BodyScanTool pre-rate were removed per Nook 2021 + replications. "The PROCESSING_PRIMER copy ('Downshift physiology first; your cognition clears after the body settles') is no longer contradicted by the screen layout — it now matches what the screen actually does."

## What this means for GPT's Round 3 catch

GPT was reading from outside the codebase and didn't know:
- The pre-regulation chip rows had already been removed from Breathe and Body Scan pre-rate (Apr 28)
- The body-first metacognition pathway had been examined and verified already implemented (Apr 27)
- The 1-5 numeric pre-rate that remains is the minimal residual measurement that drives the shift delta tracking ("Last session: +2") and the three-category data feed

The 1-5 pre-rate is not a science violation. It's a small data point that captures the user's self-rated state for shift tracking. Removing it would break the data layer's ability to compute Categories A/B/C, which is load-bearing for the practice feedback the architecture provides.

## What I should have done

Read the master todo before drafting. The operating rule already in the transfer doc says: "Before claiming any architectural gap exists, proposing to close one, or suggesting changes to Stillform, Claude (1) reads the existing implementation, (2) checks the doc repo, and (3) checks git commit history." I checked the implementation but skipped step 2. That's why this spec was wrong.

## Retraction is not a deletion

This file is preserved as a record of the false-positive finding so future-Claude reading the repo doesn't accidentally re-propose this same spec from outside critique. The lesson is the artifact, not the proposal.

---

*ARA Embers LLC · Body-First Pre-Rate Spec — Retracted · April 30, 2026*
