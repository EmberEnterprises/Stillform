# FRAMING LAW vs COPY_LOCKS — Structural Conflict
**ARA Embers LLC · May 12, 2026 · v2.0 · RESOLVED via Path A (framing law cascades)**

> **RESOLUTION — May 12, 2026 (same day):** Arlin's direction: *"ALL OF THE THINGS WE CREATED TODAY ARE FROM RESEARCH."* and *"CONTINUE BUILDING PLEASE"*. The framing law established today is the research-grounded truth; the pre-research COPY_LOCKS and external brand surfaces are stale relative to the research. Path A executed across multiple commits — framing law cascades to ALL user-facing surfaces where surgical alignment is possible.
>
> **Surgical substitutions applied (across commits 53076bd → 8d456c0 → [this commit]):**
> - Splash tagline: "Composure architecture" → "Metacognition practice"
> - Browser tab title: "Stillform — Composure Mastery" → "Stillform — Metacognition Practice"
> - Meta description (search results, social previews): rewritten to framing-law-aligned
> - PWA manifest description (install dialog): "Stabilize in under two minutes" → "Build the in-the-moment skill of catching your state"
> - Tutorial Page 0 (all 4 opening lines): aligned including "That's the practice. And it builds." replacement
> - Tutorial close: "Stillform. Composure Architecture." → "Stillform. Metacognition Practice."
> - App description: "stabilize composure" → "build capacity over time"
> - FAQ "What is Stillform?": full body alignment — "regulation takes hold" → "the practice takes hold"; "architecture of composure" → "That is metacognition. Composure follows."
> - FAQ "How is this different from meditation or therapy?": full body alignment — "structured interventions that interrupt activation and restore a functional baseline" → "daily cognitive work that builds the concept library... expands cognitive capacity over time"
> - All disclaimer surfaces (subscription, crisis, privacy footer): aligned
> - UAT roadmap public page footer: "Stillform is a composure tool" → "Stillform is a metacognition practice"
> - Internal architecture stage-definitions comment: aligned
> - `docs/COPY_LOCKS.md` updated with new LOCKED entries (Tutorial Page 0 lines now correctly reflect shipped copy; stale "Composure is a full-spectrum practice..." entries removed)
> - `scripts/ship-preflight.mjs` regex updated to enforce new locked strings
> - `docs/STILLFORM_TESTING_CHECKLIST.md` test steps updated to match new locked copy
>
> **Deferred — substantive content with voice that requires Arlin's structural review:**
>
> 1. **`public/promo.html`** — 11-slide marketing deck. Built on TWO pre-research framings: (a) audience targeting "Built for intensity" / "You feel everything at full volume" — per framing law memory, banned: "tool for intense/high-intensity people"; (b) product framing "A composure system" (slide 01) and "A precision composure system." (slide 11) — banned per framing law. Both require brand voice rewrite, not substring substitution. The whole deck is positioned around the banned audience framing.
>
> 2. **`public/blog-two-pathway-regulation.html`** — Thought leadership blog post titled "Two-Pathway Regulation: Why Composure Apps Should Assess Before They Intervene." Mostly legitimate scientific content about Gross (2015) emotion regulation strategy families — that science discussion isn't framing-law-conflicting. But the post frames Stillform itself as "A composure system" (line 63) which IS product framing violation. Plus the title's "Why Composure Apps Should Assess" still uses "composure apps" framing. Requires editorial decision: does this blog post stay at all under the new framing, or does it get rewritten as a metacognition-practice piece, or does it pivot to a different topic entirely?
>
> The internal AI surface + brand-identifier surfaces (splash, tutorial, FAQ bodies, disclaimers, manifest, browser title, meta description, UAT roadmap) + all internal docs all now speak the framing-law language. Two substantive content surfaces (promo deck + thought leadership blog) remain flagged for Arlin's voice/editorial work.

---

## ORIGINAL CONFLICT DOC (preserved as design record)

## The conflict

`STILLFORM_FRAMING_LAW.md` (May 12, 2026, commit `853ddda`) establishes that "composure architecture" is **banned** as product framing. Stillform IS a metacognition practice; composure is one felt outcome of the practice, not what the product IS.

`docs/COPY_LOCKS.md` (predates the framing law) **LOCKS** "composure architecture" as the splash tagline and tutorial close. The preflight `scripts/ship-preflight.mjs` enforces these locks — unauthorized changes are blocked at the script level.

These are in direct conflict. **The framing law cannot be applied to user-facing brand surfaces without first resolving this conflict.**

---

## Concrete sites — user-facing "composure architecture" strings

### A. COPY_LOCKS-protected (preflight-enforced, cannot autonomously change):

| Surface | Status | Locked copy |
|---|---|---|
| Splash tagline | LOCKED | `Composure architecture` |
| Tutorial opening close | LOCKED | `Stillform. Composure Architecture.` |

### B. Not in COPY_LOCKS but user-facing (consistency-coupled to the LOCKED tagline):

| File | Line | Context |
|---|---|---|
| `src/App.jsx` | 24689 | Subscription disclaimer: "Stillform is composure architecture, not medical treatment." |
| `src/App.jsx` | 24703 | App description: "Stillform is composure architecture. It provides structured breathing..." |
| `src/App.jsx` | 24746 | FAQ answer (full response uses the framing throughout) |
| `src/App.jsx` | 24754 | FAQ answer: "Stillform is composure architecture — structured interventions..." |
| `src/App.jsx` | 25145 | Crisis disclaimer: "Stillform is composure architecture, not a crisis service." |
| `src/App.jsx` | 25343 | Privacy/footer: "for AI-assisted composure architecture; transparency is the deal." |

**Why "consistency-coupled":** these 6 strings are technically free to edit (not in the lock manifest), but they were written aligned with the LOCKED splash tagline. Changing them without changing the LOCKED tagline produces brand fragmentation — the user reads "Composure architecture" on splash + tutorial, then "metacognition practice" in disclaimers / FAQ / footer.

### C. CONSTRAINED in COPY_LOCKS (already partially framing-law-aligned):

| Surface | Status | Copy |
|---|---|---|
| FAQ method answer | CONSTRAINED | "Stillform is a metacognitive composure practice. Calibration maps how your system tends to process pressure..." |
| FAQ science answer | CONSTRAINED | "Stillform draws from metacognitive therapy, behavioral and cognitive neuroscience..." |

These already say "metacognitive composure practice" — closer to the framing law than the splash tagline. They are CONSTRAINED (not LOCKED), so they could be tuned to match the framing law more precisely with explicit approval.

---

## Resolution paths — Arlin's call

### Path A — Framing law cascades to user surfaces

The framing law is the supreme reference, and COPY_LOCKS updates to match. Changes required:

- Splash tagline → something like `Metacognition practice` or `A metacognition practice` or another framing-law-aligned phrase
- Tutorial close → parallel update
- The 6 unlocked App.jsx strings → surgically fix in line with the new tagline
- COPY_LOCKS.md → version bump, new locked strings recorded
- Preflight regex → updates to enforce the new locked strings

**Pros:** Complete brand-framing alignment. Internal and external surfaces speak the same language. The framing law's stated supreme-reference status is real, not partial.

**Cons:** "Composure architecture" has been the public-facing tagline since launch prep. Changing it changes the brand voice. It is the splash — the first thing every user reads. This is a major brand decision that should not be made under fatigue.

### Path B — Framing law scopes to internal surfaces

The framing law applies to: AI prompts (done), internal docs (done), partner outreach drafts, marketing collateral pre-launch. The locked user-facing brand tagline ("Composure architecture") stays. The 6 unlocked App.jsx strings stay aligned with the locked tagline.

The framing law gets a scope clarification: "Internal framing guidance. User-facing brand surfaces (splash tagline, tutorial copy, App Store) follow `docs/COPY_LOCKS.md` — changes there require explicit approval and lock-manifest updates."

**Pros:** Preserves the existing public brand. No risk of breaking external-facing copy under fatigue. Internal/AI alignment (which is what the rebuild was actually about) is achieved.

**Cons:** A more nuanced framing law. Two sets of language depending on surface (internal vs external). Risk of drift if the scope distinction isn't clearly communicated.

### Path C — Hybrid

The most likely real answer. Examples:

- Update the splash tagline to a third phrase that satisfies both ("A metacognition practice that builds composure" or similar)
- Update tutorial close to use the framing law's language while the splash retains "composure" voice
- Keep some surfaces as-is, update others

The hybrid requires line-by-line judgment. Each line is a brand voice call.

---

## What I cannot do autonomously

Per audit philosophy v2.0 Layer 0 (framing audit) + Operating Rule from memory ("Before drafting external-facing Stillform content, check framing"):

1. **Cannot change LOCKED copy** without explicit approval + COPY_LOCKS update + preflight regex update.
2. **Cannot rewrite the 6 consistency-coupled unlocked strings** without picking between Path A / B / C, which is a brand decision.
3. **Cannot pick a path on Arlin's behalf** because all three are defensible and the choice has lasting brand implications.

This is exactly the "apparent contradictions are usually intentional design" pattern from the audit philosophy. The framing law I synthesized today may have over-reached its scope — or COPY_LOCKS may be stale and need updating. Only Arlin knows which.

---

## What I CAN continue with autonomously

Items that don't touch user-facing brand language:

1. The preflight regex improvement (skip JS comments — small, clear, low-value)
2. Any further framing audit work in internal docs (Phase D was completed; further passes available if new violations surface)
3. Continued bug fixes from your phone walks
4. Other clear-right-answer code work that doesn't conflict with COPY_LOCKS

---

## Status as of this doc

- ✅ Framing law established (commit `853ddda`)
- ✅ Audit philosophy v2.0 with Layer 0 framing audit (commit `e43398e`)
- ✅ All Reframe AI prompts framing-law-aligned (commits 2.1 / 2.2 / 2.3)
- ✅ All 6 other Netlify AI functions framing-law-aligned (commit `ecc2ce1`)
- ✅ Phase A/B/C/D internal doc audits complete
- ⏸️ User-facing brand copy (`src/App.jsx` + COPY_LOCKS-protected surfaces): **PAUSED awaiting Arlin's resolution path A / B / C**

The internal AI surface is fully aligned with the framing law. The external brand surface is unchanged. The conflict between the two is documented here.

---

*ARA Embers LLC · Framing Law vs Copy Locks Conflict · May 12, 2026*
