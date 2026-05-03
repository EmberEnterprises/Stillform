# STILLFORM MASTER TODO
**ARA Embers LLC · last updated May 3, 2026**

---

## Design Lens (apply to every feature decision)

Stillform is a metacognition tool. Helping people understand their own processes is the mechanism. Composure is the outcome. Every feature serves one of four pillars:

1. **Metacognition** (the mechanism) — does this help the user see their own process?
2. **Emotional awareness** (the input) — does this sharpen interoception, affect labeling, or granularity?
3. **Microbiases** (the outward gaze) — does this support seeing others accurately, *after* self-awareness is steady?
4. **Neuroplasticity** (the glue) — does this compound across sessions, or does it reset?

A feature that doesn't clearly serve one of these is dressing. Push back when it shows up.

---

## 🔒 LOCKED DECISIONS — do not re-propose

These are decisions that have been made and locked. If a new Claude session reads from outside critique and surfaces any of these as problems, point them here. Re-proposing wastes session time and erodes trust in the framework.

### Closing language stays as-is (locked May 1, 2026)
After Round 2 consultation found 4 AIs converged on "closing language frames as outcome not rehearsal," CLOSING_LANGUAGE_CANDIDATES.md was drafted with three voice options across 7 close screens. Arlin's pushback: "the current language has a science behind it too" and "feels more prestige and less putting words into someone's mouth." Captured in Science Sheet section "System Observation + User Override (Architectural Conditioning Pattern)" — the current language ("Composure restored," "Signal cleared," "STATE SHIFT +2 · FUNCTIONAL") is precise observation paired with explicit override pathways ("I don't feel regulated yet" button). Together they train interoceptive accuracy via supervised-learning-like pattern: system makes prediction, user accepts or corrects, both directions improve over time. Round 2 AIs read words in isolation without seeing override architecture; they were wrong.

### Stillform discipline / market positioning correction (locked May 1, 2026)
After repeated drift toward repair-coded / trauma-coded / intensity-coded language across consultation rounds and home copy proposals, Arlin named the actual market correctly: "This is a self mastery tool using metacognition with composure as its final outcome... Anyone who wants to enhance themselves are [our market]." Safeguards exist for users in distress — they are not the market.

**Key reframes locked:**
- Composure is a discipline (not therapy, not wellness, not consumer-tech enhancement)
- Composure Architecture is the load-bearing definition (already present in 5 places in product)
- "Composure is the foundation. You are its architect." (home banner copy from Apr 30) is doing the plainspoken inclusive work — already shipped
- Future copy must NOT pull toward repair / trauma / intensity / "carry a lot" framing

This positioning correction has implications for: future Reframe AI prompt language, marketing surfaces, the Science Sheet introduction, and any user-facing description of what Stillform IS.

### Body-first pre-rate decision (locked Apr 30, 2026)
Body-first pre-rate friction is NOT an open architectural gap. The pre-regulation chip rows in BreatheGroundTool and BodyScanTool were removed Apr 28 (commit `ae43f4db`) per Nook 2021 + replications. The residual 1-5 numeric pre-rate is intentional — it captures the user's self-rated state for shift-delta tracking ("Last session: +2") and feeds the three-category data feed (Categories A/B/C). Removing the 1-5 would break the data layer. Body-first metacognition access was verified already implemented Apr 27 — body-first users go Pre-rate → Bio-filter → Breathe → Post-rate → Ground, and the grounding-complete screen has "Continue to Reframe →" as primary CTA. A spec proposing to fix this gap was drafted then retracted Apr 30 because the gap doesn't exist. See project transfer Section 5 locked decision "Apr 30 do-not-re-propose" for the full lesson.

### Round 4 consultation track exhausted (locked Apr 30, 2026)
Round 4 consultation prompt was drafted but never sent. After three rounds of multi-AI consultation produced surface fixes and architectural overcorrections, Arlin's read: track exhausted. The diagnosis came from her, not from another consultation. The actual gap was engagement craft — not architecture. Source doc not preserved.

### Low-demand mode designed for broad cognitive-bandwidth-limited population (locked Apr 28, 2026)
Low-demand mode serves anyone whose cognition is partly offline — Medicated bio-filter users (broad scope: SSRI, post-anesthesia, sleep aids, chemo, recreational), post-panic users still cognitively rattled, sleep-deprived parents at 3am, migraine sufferers, dissociative episodes from trauma, sensory overload, anyone coming down from any altered state.

**Why we designed for the broad population, not k-hole users specifically.** Three reasons. (1) Most Medicated chip selections are NOT k-hole users — they're someone on an SSRI, someone post-dental anesthesia, someone who took a sleep aid, someone on chemo, someone with a migraine, a sleep-deprived parent. Overfitting to k-hole users would underserve the actual majority. (2) The clinical/regulatory boundary. The moment Stillform positions itself for any specific altered-state use case, it crosses the medical-adjacent boundary the transfer doc explicitly guards against. The mode must be discoverable for any cognitive-bandwidth-limited use case without naming any of them. (3) The design that works for the broadest population is the same design that serves k-hole users — minimal demand, no decisions, no reading, no input. Designing for the broad case produces a feature that serves the specific case without ever naming it.

**What it MUST NOT be labeled as.** Not "ketamine mode." Not "for altered states." Not "crisis mode." If a future session asks "why doesn't this route k-hole users somewhere specific?" — the answer is above. We chose the broad design deliberately.

**Founder context (private, never marketed).** Stillform was conceived by Arlin during ketamine treatment. The app is not a ketamine companion tool. B2B clinical channel via Arlin's doctor remains the path for any treatment-adjacent positioning. The low-demand mode serves the broad cognitive-bandwidth-limited population, of which k-hole users are one sub-population.

---

## 🌟 NEW TOP PRIORITY — Cognitive Function Measurement

**Spec drafted Apr 30 — see COGNITIVE_FUNCTION_MEASUREMENT_SPEC.md in repo root.**

After three rounds of consultation produced surface fixes and architectural overcorrections, Arlin diagnosed the actual gap: 'I got a bunch of science based prompts that are flat and not interested in engaging for the user. It feels more like a chore than something I actually want to do.' This is engagement craft, not architecture.

Out of nine engagement mechanics from non-wellness products examined, Arlin chose: cognitive function measurement as evidence of neuroplasticity. Small repeatable cognitive exercises grounded in Stillform's existing cited literature, performed periodically by the user, with results tracked over time. Improvements over weeks are measurable evidence the practice is producing the neuroplasticity Stillform claims.

This is the moonshot. Multi-week build (6-8 weeks focused work). Centerpiece feature.

**Differentiation:** every wellness app measures sessions/minutes/streaks. Nobody measures the cognitive functions the practice trains. Stillform would be first.

**Recommended Phase 1 (3 of 5 candidates):**
- Affect labeling speed (Lieberman 2007) — measures the function chips train
- Interoceptive latency (Mehling 2012) — measures the function body work trains
- Cognitive defusion / reframe generation (ACT lineage) — measures the function Reframe trains

**Lumosity overclaim risk explicitly designed against.** Spec mandates narrow honest framing — 'this specific function is faster than it was, which is consistent with the practice working' — never 'your brain is X% better.'

**Why this matters for the award case Aria asked for:** Stillform claims neuroplasticity. With this, Stillform proves it for each user individually. Nobody else in wellness has it. It's grounded in real science. It's executed at prestige altitude. It does something the user can't get anywhere else.

Open questions for Arlin's review listed in spec.

---

## 🌟 ENGAGEMENT CRAFT — Active items

Foundation is in `Stillform_Strategic_Roadmap.md` (Engagement Craft Research Foundation section). Active items below.

### ⏳ Kinesthetic close interaction (engagement craft) — IN DESIGN
Arlin chose Reading 3 from the close redesign options: kinesthetic / tactile interaction at session close. Engagement craft as design frame, not neuroscience. Replaces the 5-screen text-and-button sequence at session close with a single tactile moment — most likely single tap on slow-pulsing point or long-press to seal. Grounded in Engagement Principles 4 (Kahneman System 1/2 — match interaction style to user state) and 9 (Norman affordance perception). Spec to draft next session.

### ⏳ Self Mode is not where it could be (flagged May 1, 2026)
Self Mode is the differentiated tool — it's the trainable solo metacognitive practice (Notice/Name/Recognize/Perspective/Choose) that ideally makes Reframe less necessary over time. But it's named generically ("Self Mode" reads as anonymous), it's described in ways that previously overlapped with Reframe (now improved with the "How you train the move you make alone" sub-label, but the broader work remains), and the 5-step structure could be more visible/honored as the explicit muscle being trained.

What's not right yet:
- The name itself is generic and doesn't signal what the practice is
- The 5 steps are present but not visually weighted as the architecture they are (compared to Reframe's chat which is unmistakably "what this is")
- The relationship between Self Mode and Reframe (Self Mode = solo training; Reframe = with-partner work in real time) isn't legible to a user encountering both
- Nothing in the product surfaces the user's growing capacity at the 5 steps over time — it's the trainable thing but the training isn't measured (the Cognitive Function Measurement moonshot would address this)

Not for now — Arlin flagged this as ongoing work to come back to. Future session task: redesign Self Mode's framing, naming, and visual treatment so it stands as the differentiated practice it is. Track also includes Arlin-driven in-app exploration to surface any specific bugs or unintuitive flows in the current Self Mode build (originally tracked separately, captured Apr 29; consolidated here May 3).

### ⏳ Pattern Disruption Layer (architectural direction, May 2, 2026)

The move from legibility-only product to active disruptor. Stillform's existing tools make patterns visible; this layer adds mechanical disruption when a pattern repeats. Arlin's framing: *"this is where it stops being flat and is actually more of a useful tool, and also brings back users, which creates retention."*

Full spec in repo: `PATTERN_DISRUPTION_SPEC.md`

Core architecture:
- **Three data points** of the same loop signal triggers detection — pooled across Self Mode entries, Reframe sessions, Pulse chip selections, bio-filter readings. Not three sessions; three data points of the loop signal.
- **AI runs full read** on session history. Eight loop-signal dimensions surfaced as system prompt guidance (same feeling, same action, same context, same somatic, same posture, same distortion, same arc, same chip selection). Open-ended judgment, not rigid rules.
- **Body-first detection vector explicit:** chip + bio-filter signals weighted as full data points so calm/body-process users (who don't surface loops verbally) get caught.
- **Push notification + in-app prompt** fire immediately on detection. Both APNs (iOS) and FCM (Android). Prompt-on-open requires interaction, not dismissable as banner.
- **Two-strikes-and-drop dismissal:** pattern offered, dismissed → re-fired once → dismissed again → pattern instance closed. Fresh accrual of three new data points opens a new instance.
- **AI-down backup case:** AI catches up on gap-period data when service restores. No special language, no apology framing.
- **Acceptance routes into a new disruptor tool** (~90 sec mechanic, attentional capture by novel stimulus + somatic anchoring; not EMDR, not bilateral stimulation).
- **Transparency surface in Settings** shows what AI is watching for. No off-switch for detection itself — user opted into AI-assisted composure architecture.

Open questions called out in spec §7 (six items, biggest is the disruptor mechanic itself).

Ship-or-hold timing: deferred to Arlin. Spec recommendation defers the call; both prelaunch (as part of Self Mode redesign) and post-launch (as v1.1 announcement) are defensible.

Engineering scope: 3-5 days focused work across detection, dispatch, state machine, disruptor tool, transparency surface, end-to-end testing. Capacitor push-notifications and local-notifications already initialized.

### ✅ ToolDebriefGate friction reduction — SHIPPED Apr 30 (commit 51493cce)
20-second forced wait dropped; Continue enables on selection alone; skip button added. Full record in Completed — April 30 archive.

### ✅ Plain-Language Neuroscience Surface — SHIPPED May 1, 2026
Post-session card surfacing one finding from a verified 36-entry corpus tied to what the user just practiced. AI-generated at runtime with three protections (system prompt rule, server-side citation validation, corpus verification). 20 static fallbacks. Full architecture, ship arc, and engineering lessons in Completed — May 1 archive.

**Pending — Protection C corpus verification:** Arlin reads 36 corpus entries + 20 static cards in PLAIN_LANGUAGE_SCIENCE_CARD_SPEC.md, flags any entry where plain-language summary doesn't match Science Sheet's framing of that study. Until verified, science card feature is shipped but not corpus-validated.

### ⏳ Surface refinements (small, anytime)
- Sub-labels under tools ("Train how you talk to yourself under load") — CoPilot Round 2
- Plainspoken inclusive home copy ("Composure, built for people who carry a lot") — CoPilot Round 2
- Body Scan verb-form authorship ("I'm staying here" not "hold for 30 seconds") — Claude Round 2
- Cormorant aesthetic question (demote to ceremonial moments?) — Claude Round 2 — possibly resolved by Apr 30 prestige refresh; needs phone-test
- Composure self-mastery legibility doc commit — sitting in /mnt/user-data/outputs, conceptual decision already made
- **Text size / high contrast accessibility toggle in Settings** (added May 2 — surfaced from Bobby's first user session feedback, lost in earlier docs cleanup). Bobby's feedback: text still too dim for aging eyes. Toggle for text size and/or high contrast in Settings. Connects to existing accessibility line items (ARIA labels line ~702, chip touch targets line ~710 — verify line numbers).
- **Fractal aesthetic expansion (May 2 idea, captured not committed)** — Arlin liked the trees. Possible directions if the existing audio/visual roadmap leaves room: branches that visibly extend on inhale and settle on exhale (synchronizing gaze with breath, not bilateral stimulation); additional fractal forms unlocked over session milestones (ferns, water rings, crystalline growth) as engagement-craft palette; pure "watch and breathe" mode that strips all UI and lets the canvas carry the session. NONE of this is EMDR or bilateral stimulation — the explicit rule from May 2 conversation is no EMDR-coded mechanics, with or without the name. Aesthetic and gaze-synchrony only.
- **Watch haptic-by-index → haptic-by-name** (added May 3, 2026, commit `3b29c31` follow-up). `WearBreatheActivity.hapticPhaseStart()` selects haptic intensity by phase index (0 = Inhale-medium, 1 = Hold-light, 2 = Exhale-long, 3 = Rest-very-light). Works for `quick` and `deep` patterns where index = phase type. Mismatch on `cyclic_sigh` where phase 1 is the secondary inhale (top-off), not a hold — currently fires the Hold light pulse. For a 1-second phase the perceptual difference is small and a lighter pulse arguably matches the smaller top-off breath, so the bug fix commit accepted this as known. Cleaner long-term implementation: switch on `phaseNames[currentPhase]` instead of `currentPhase` index, so haptic intensity follows what the breath actually is. Single-file change in `android/wear/src/main/java/com/araembers/stillform/WearBreatheActivity.java`. Validate on physical watch through all three patterns.

---

### AI-as-actor voice audit — review only, May 2

**Captured May 2, 2026 — review only, no edits.**

The audit found that across info modals, FAQ items, system prompts in reframe.js, and one literal UI surface ("What the AI has noticed"), the app reaches for "the AI does X for you" framing instead of "you do X; the AI processes what you give it."

The mechanism is correct — AI does read inputs, process them, and surface user data. The voice register is what's off. Subject of every sentence keeps landing on the AI when it should land on the user.

**Items found (high-leverage first):**

1. **reframe.js system prompts** (CALM_SYSTEM, CLARITY_SYSTEM, HYPE_SYSTEM) — tell the AI to think of itself as "companion" or "coach." Shapes every AI response. Highest-leverage single edit because it cascades through all responses.

2. **"What the AI has noticed"** (App.jsx lines 8073, 8152, 11851) — literal screen title + count label visible to user. UI surface, not info modal.

3. **FAQ "What does the AI do in Reframe?"** (line 16580) — "It identifies what is actually happening... introduces a perspective that interrupts that pattern... separates what is factually present from your read." Three sentences put AI in the diagnostician seat.

4. **FAQ "Does the AI learn about me?"** (line 16584) — "It begins surfacing cross-session observations directly." AI as the one with observations.

5. **FAQ "What is Next Move?"** — "The AI reads your session context and surfaces the relevant options."

6. **FAQ "What is the Bio-Filter?"** — "AI contextualizes your input accurately rather than coaching past..."

7. **FAQ "Can I attach screenshots?"** — "The AI reads visual context to improve coaching."

8. ✅ **Reframe info modal "Why Reframe?"** — RESOLVED May 3, 2026. Was: "the AI introduces a perspective that interrupts the loop you're already in." Now: "you step back from the loop you're already in by surfacing a different angle on it. The work is yours; the system organizes what you give it and asks the next question." Fixed in both duplicate strings (click handler + keydown handler).

9. ✅ **Bio-filter info modal extension** — RESOLVED May 3, 2026. Was: "the AI updates the predictive model with the actual hardware state." Now: "you mark depleted, in pain, sleep-deprived, the system carries that hardware state into how your input is read." User as actor (marks); system as substrate.

10. ✅ **"Why name your state?" modal** — RESOLVED May 3, 2026. Was: "tells Stillform what is present so the AI can meet you accurately... how the AI interprets what you type." Now: "tells Stillform what's present so what comes next meets you accurately... how your input is read." Removed "AI" as sentence subject in both phrases without introducing developer jargon (tried "routing" first, dropped because it's not a user word).

11. **Privacy/screenshot disclosure** (line 16539) — "the image is sent to the AI model for interpretation."

12. **Hero CTA "Calm my body"** subtitle "Start where the pressure lands" — assumes pressure (separate but related narrowing problem already on audit).

**Voice that would match Arlin's framing:**
- User reads their own state. The system organizes the inputs.
- User notices their patterns. The system surfaces what they've already given it.
- User does the work. The system asks the next question.
- Stillform is the architecture. The user is the operator.

**Notes for whoever does this work:**
- Items 8, 9, 10 (Claude's own drift from May 2) RESOLVED May 3, 2026. Items 1-7 and 11-12 remain captured for a deliberate voice pass.
- Item 1 (reframe.js system prompts) is invasive — changes how the AI behaves, not just how the app describes itself. Needs care. Note: the May 3 reframe.js prompt rewrite (commit 43d51a6) addressed the "you are infrastructure / composure companion" opening register but the audit's full sweep across CALM/CLARITY/HYPE wasn't the goal of that commit; items 1's broader scope remains.
- Item 2 ("What the AI has noticed") is a literal user-facing surface; copy change is also a UX change.
- Items 3-7 are FAQ canon; whatever voice lands here sets register for the whole app.
- Hero CTA Group 2 items partially overlap with the existing "narrowing assumptions" surface refinement work — possibly batchable.

**Out of scope today.** Captured for a deliberate voice pass when Arlin chooses to do it.

---

## 🚨 ARCHITECTURAL — Decide Before TestFlight

### GPT-4o data picture audit + existing guardrails review (Added May 2, 2026)

**The ask (Arlin, May 2):** Before adding more guardrails to the AI surface, understand what GPT-4o's data substrate actually is — what it does with the data we send, what its retention is, what its defaults are — AND review the guardrails Stillform already implemented against that substrate. The point is not to layer more guardrails on assumptions; the point is to verify the guardrails we have actually complement how GPT-4o behaves, across the whole app.

**Why now:** Stillform is no longer just-Reframe-uses-AI. The AI surface has expanded:
- Reframe text conversations → GPT-4o chat completions
- Reframe screenshot vision → GPT-4o vision (`detail:"low"`, max 15MB per image)
- Science cards → GPT-4o chat completions (separate call, its own validation layer)
- Unified text aggregator (shipped May 2) → feeds buildUnifiedTextContext into every Reframe call, which now includes Self Mode responses, What Shifted free-text, grounding writes, Signal Log entries

Every textarea the user fills in now has a path to GPT-4o via the unified aggregator. The guardrail layer was designed when Reframe was the only AI surface. It needs review against current scope.

**Single AI provider confirmed:** reframe.js calls only `https://api.openai.com/v1/chat/completions` with `model: "gpt-4o"` (verified May 2 by reading the function). Two call sites (main Reframe response + science card generation) — same endpoint, same key, same retention regime. No Anthropic API calls, no Claude in the picture. The audit is single-substrate.

**What needs to be answered (proposed scope of audit doc):**

*GPT-4o substrate side:*
- OpenAI API data retention — current default is 30 days for abuse monitoring; verify what Stillform's account is on (standard, zero-retention, enterprise tier)
- Training opt-out status of the API key — API data is opted out of training by default but verify
- Vision-API-specific policies — does image data have different retention than text?
- What `detail: "low"` actually transmits to OpenAI vs the original image bytes
- Whether system-prompt content is logged or treated differently than user-turn content
- What appears in Netlify function logs vs OpenAI's logs (we currently `console.error` full payloads on API errors — that lands in Netlify, separate retention)
- Whether the API key is rotated on a known cadence and what the procedure is
- Whether OpenAI's response is logged anywhere on our side beyond the user's device

*Stillform guardrail side (review what's already shipped):*
- System prompt rules — never quote entries back verbatim, session-count gating (≥3 vs <3), "for context only — do not reference patterns yet" framing
- Voice contract validation — does it leak any user data when validation fails and falls back?
- Voice repair retry path — same question, does the repair call carry user context?
- Banned-phrase post-processing filter on AI output — verify what it catches and what it misses
- Rate limiting (10 req/IP/min) — does it leak user identifiers?
- AES-256 encryption at rest on device — verified via SECURE_KEYS list (16 keys); does anything sensitive bypass?
- The Apr 15 OCR→GPT-4o vision migration's guardrails (type whitelist, 3-file max, 10MB/file, 20MB total, server-side validation) — still aligned with current scope?
- Crisis detection + liability guard flags fire Plausible events — verify those carry no user content
- The new textHistoryContext field — does the prompt instruction "never quote entries back verbatim, do not flag AI-down gaps" actually hold against GPT-4o's behavior, or does it sometimes leak?

**Status as of May 3:**
- Phase 1 drafted May 2 — substrate side (data retention, training opt-out, vision policy, logging). See `GPT4O_DATA_PICTURE_AUDIT.md` in repo. Citations web-verified May 2.
- Phase 2 drafted May 2 — model behavior side (GPT-4o native pulls, Model Spec instruction hierarchy, OpenAI safety routing, MCT mechanism alignment). See `GPT4O_BEHAVIOR_AND_MCT_AUDIT.md` in repo. Citations web-verified May 2.
- Phase 3 PENDING — actual guardrails review against substrate findings, mapping each shipped guardrail to which native pull it corrects/duplicates/conflicts with. Plus actioning anything found.
- Today's prompt rewrites (May 2 CBT→MCT shift) connect to this — the new MCT-aligned prompts need verification against the substrate guardrails picture.

**Pre-launch or post-launch:** Phase 3 should be pre-TestFlight. The privacy policy makes data-handling claims that depend on the substrate behaving as we believe it does. Shipping to TestFlight without verifying creates real liability if the policy and the reality are misaligned.

---

### AI stress testing protocol (added May 2 — surfaced from old ideas sweep; reconciled May 3)
**Pre-deploy gate, not optional.** Before any AI prompt change ships, run the existing **19-scenario AI Framework regression test list** in `Stillform_Punch_List.md` (under "Added April 8 — Afternoon Session" → "AI Framework"). The list covers the kind of self-diminishment / silencing / advocacy scenarios the prompts are supposed to catch (boss talked over user, missing degree credibility, immigrant outsider, medical leave betrayal, ADHD freeze, etc.).

Pass criterion per scenario: AI names the pattern, reflects the strength, builds confidence to act. Fail criterion: AI gives generic comfort ("that must be frustrating") or matches negative framing.

**Especially relevant given May 2 prompt rewrites** — the new MCT-aligned prompts in `netlify/functions/reframe.js` have not yet been stress tested against the 19 scenarios. Reading the punch list confirms these scenarios already exist as work-product, not aspirational; what was missing was the pre-deploy discipline of running them. Master todo and punch list now reference each other.

### Composure-applied-both-directions verification (added May 2 — surfaced from old ideas sweep)
The AI must build BOTH outward composure (listener stops filtering input by status, background, bias) AND inward composure (speaker stops shrinking, qualifying, performing credibility). Verification needed: does the current prompt set produce both? May connect to the AI-as-actor voice audit (12 surfaces, captured commit `d8a6507e`) — if not already a verification dimension there, add it.

### Terms of Service + Privacy Policy "not a medical tool" language (added May 2 — liability item)
Both legal docs need explicit language: "Stillform is not a medical tool and is not intended for use during or as a substitute for medical treatment." This is liability-critical for the KetaRevive integration and the mental-health-adjacent positioning. Termly privacy policy is set up; verify whether this specific language is present. If not, add to both docs before TestFlight broad release.

---

## ⚠️ PRELAUNCH — Whole-app prestige refresh (Added April 30, 2026)

**Spec drafted Apr 30 — see `STILLFORM_DESIGN_SYSTEM.md` in repo root.**

Arlin's diagnosis: "It looks like a 32-bit NES platform. Whole app needs to be prestige." Refresh authorized as prelaunch work. Visual language synthesized from 5 AI reference passes converging on editorial luxury family (Aesop + MUBI + Cartier + Linear, not wellness apps). Spec covers calibrated palette, type scale, spacing rhythm, motion tokens, component vocabulary, implementation order. Ships with existing free font triad — no paid fonts required.

This work blocks visible execution of Self Mode redesign and My Progress redesign (both already specced — `SELF_MODE_FOUR_WAY_SYNTHESIS.md` and `MY_PROGRESS_REDESIGN_SPEC.md`). Both redesigns are designed against the new system, not the current one. Build the design system first, then the redesigns land into it cleanly.

Implementation order in spec: CSS variables → typography → components → screens (Home → Reframe entry → Self Mode → My Progress → Body Scan → Breathe → Pulse → Settings → FAQ). Each screen verified on phone debug before next.

---

## ⚠️ PRELAUNCH — Added April 29, 2026

### ✅ SECURITY-CRITICAL — Encrypt all sensitive on-device localStorage — RESOLVED May 2 (commit ef8d8008)
Extended existing AES-GCM `secureSet`/`secureGet` infrastructure to wrap all sensitive localStorage keys. Full record in Completed — May 2 archive.

### ✅ What Shifted three-category data feed — RESOLVED Apr 30 (commit 890469aa)
Russell circumplex three-category classifier shipped. Pure function classifyShiftDirection. Full record (architecture, wiring, privacy preservation) in Completed — April 30 / May 1 archive.

### ✅ Body Scan post-completion What Shifted moment — RESOLVED Apr 30 (commit 890469aa)
What Shifted screen added to BodyScanTool. Full record in Completed archive.

### ✅ Add "Settled" chip — low-arousal positive — RESOLVED Apr 30 (commits 768b56ed + ad4a43f1)
Settled added as 9th chip; Russell-circumplex-grouped chip ordering implemented at all chip render sites; AI prompt branch added for maintain-state framing. Full record in Completed archive.

### ✅ Chip ⓘ button — define what each chip covers — RESOLVED Apr 30
CHIP_DEFINITIONS registry added; ⓘ buttons wired at all 3 chip render sites; ARIA labels added. Full record in Completed archive.

### Category C gentle nudge — referral to existing crisis resources

When a user trends toward Category C across multiple sessions (sustained Flat, persistent high-arousal negative without shift, or any session resulting in Distant), Stillform should surface a gentle nudge toward the existing Crisis Resources screen.

**Honest acknowledgment of evidence base (locked Apr 29):** The literature on app-based escalation prompts ("you've been struggling — here are resources") is **thin, not contested.** Studies haven't been done at scale for this specific intervention type. So when we build the nudge, we're making a clinical-judgment call without strong empirical guidance. We acknowledge that explicitly rather than hide behind ambiguous "contested research" framing.

**The defensible move:** Refer users to the existing Crisis Resources screen (which is real, vetted, professional infrastructure — 988, Crisis Text Line) rather than invent new escalation logic. Stillform is not a clinical replacement. Users who need medication, therapy, or professional support need those things. Stillform's job is to be honest about its own scope and route appropriately.

**Framing principle (Arlin's words, captured for future sessions):** "If they need to be medicated, that's on them. The app isn't a substitute for clinical care." This isn't dismissive — it's the correct scope statement. A user with clinical depression that requires medication is not a Stillform failure. A user who could be helped by Stillform but the tool didn't reach them is a separate signal worth understanding from the data feed.

### ✅ Reframe tone — auto-detect + in-Reframe dropdown + personalization default — RESOLVED May 2 (commit f36cdb63)
Three-layer system shipped: auto-detect from state/content, in-Reframe dropdown override, Settings personalization default. Full record (Layer 1 detectSuggestedTone helper, Layer 2 dropdown wiring, Layer 3 'Use my default' vs 'Auto-suggest') in Completed — May 2 archive.

### ✅ Unified text capture for AI context — RESOLVED May 2 (commits 20a0810a + bbb0f07b + 556a91bc + 3f033319)
buildUnifiedTextContext aggregator pulls recent text from every persistence store on the device for AI continuity. AI-down resilient (synchronous local-first read). Full record including AI-down resilience architecture and pre-deploy stumbles in Completed — May 2 archive.

### "Get ready" Reframe mode label needs context

Currently line 14242 in App.jsx, `hype: "◌ Get ready"`. The label appears in the upper-right of Reframe screen when feelState is `excited` or `focused`. Without context, a user who has never used hype mode reads "Get ready" as ambiguous — get ready for what?

Options to evaluate (Arlin's call, not Claude's): rename for clarity ("Lock in", "Get focused", "Sharpen"), add a one-line description below the label, add an info button next to the label, or hide the label and let the AI's behavior carry the mode. Captured for Arlin to decide. Not Claude's call.

### ✅ FAQ enhancements — RESOLVED May 2 (commit bdf3570a)
Search bar, chip navigation (auto-expand + smooth scroll), collapse-by-question with rotating chevron, no-results state, mailto email link with pre-filled subject. Full record in Completed — May 2 archive.

### ✅ Reframe title doesn't reflect mode — RESOLVED Apr 30
Investigation found the bug as described didn't exist in code; modeConfig.title and subtitle were defined but never referenced. Removed dead title/subtitle fields. Full record in Completed archive.

### My Progress redesign

**Spec drafted Apr 30 — see `MY_PROGRESS_REDESIGN_SPEC.md` in repo root.**

Arlin's diagnosis: data heavy with redundancy. Heavy compute should run backend/PDF for deeper analysis; live screen should surface trends and patterns only. Eight sections collapse to four (headline pattern, compounding view, patterns and intelligence, archive and export). Earns Pillar 4 neuroplasticity claim by surfacing the science behind each pattern (Lieberman 2007, Wood & Rünger 2016, Schultz 1998, Lehrer 2020, Brewer 2011, Meichenbaum 1985, Wells 2009). Privacy architecture preserved — on-device only, Stillform never sees individual user data.

Visual treatment held until whole-app design system locks (whole-app prestige refresh authorized Apr 30). Some redundancy may resolve naturally during the design system pass; new patterns may emerge. Build the spec into the new design system rather than the current one.

### ✅ "Composure is a practice. You're building it." copy is corny — RESOLVED Apr 30
Replaced with "Composure is the foundation. You are its architect." Foundation/architect frame is precise to what Stillform actually is. Full record in Completed archive.

### Processing primer threshold tunable (currently 5 sessions)

Decay logic ships at session > 5 (App.jsx ~line 14257). If 5 is too long after live testing, threshold is one number to change. Captured Apr 29 for revisit after real user data.

---

## ⚠️ PRELAUNCH — Added April 28, 2026

### ⚠️ Low-demand mode — Phase 1 SHIPPED Apr 30, Phases 2-3 OPEN

Decision-locked architecture: low-demand is a state-of-existing-tool, not a separate tool. Triggered by `bioFilter.includes("medicated")`. The broad-design rationale is captured in Locked Decisions section above (do not re-propose).

**Phase 1 (Breathe) shipped Apr 30** (commit 81e2c0b7). Implementation detail in Completed — April 30 / May 1 archive.

**Phase 2 (Body Scan) — IN-FLIGHT, paused.** Architectural decision pending Arlin's call (4 options surfaced via ask_user_input_v0 widget; user dismissed without selecting; awaiting decision when user returns to it).

**Phase 3 (Reframe) — NOT STARTED.** Most complex of the three because AI behavior changes too (shorter sentences, simpler language, no questions demanding reasoning), not just UI stripping. ~100-150 lines across App.jsx + reframe.js. Spec needed before build.

### ✅ Memory reconsolidation grounding for Reframe — RESOLVED May 2 (commit b3292a97)
"Why Reframe?" info button added; cites Ecker/Ticic/Hulley 2012, Schiller 2010, Lane 2015. Connects to Pattern Disruption Layer spec.

### ✅ Predictive processing grounding for bio-filter — RESOLVED May 2 (commit b3292a97)
"Why the bio-filter?" modal extended with Seth 2013, Barrett & Simmons 2015 citations.

### ✅ Salience network reset grounding for body-first pathway — RESOLVED May 2 (commit b3292a97)
"Why Body Scan?" info button added; cites Menon 2011. Frames Body Scan as attentional rerouting, not calming.

### ✅ Cyclic sighing as third breathing option — RESOLVED Apr 30
Balban 2023 protocol implemented. Outreach implication: strongest credibility lever for Dr. Melis Yilmaz Balban outreach.

### ✅ ACT cognitive defusion lineage acknowledgment — RESOLVED May 2 (commit 2218f2b0)
Self Mode tab info upgraded to full modal naming MCT (Wells 2009) primary and acknowledging ACT (Hayes/Strosahl/Wilson 1999; Han & Kim 2022) as parallel research.

### ✅ In-app info button copy alignment with Apr 28 Science Sheet corrections — RESOLVED May 2 (commit 71f64903)
18 modals audited; two misalignments fixed (Why name your state? + Sessions modal).

---

## ⚠️ TESTFLIGHT-BLOCKING — Recommended Order

All items in Sequences 1-4 RESOLVED Apr 27. Full record (Quick wins, Real bugs that affect routing, Architectural decision + dead code, Resilience) in Completed — April 27 archive. Sequence 4 (Resilience pillar) was the last to land.

---

## 🔴 OPEN — Surfaced During Apr 27–28 Testing

### "Calm my body" hero CTA doesn't act on tap
Body-first user, Composure Check / Settings show normally, but tapping "Calm my body" on home does nothing — no navigation, no state change visible. Static analysis (full trace of click handler → startPathway → startTool → setScreen → BreatheGroundTool mount → hashchange listener) showed no obvious break. **Diagnostic console.log shipped in commit 089acffa98** — next time Arlin taps, browser DevTools console (or Chrome remote debugging via chrome://inspect/#devices) will reveal which branch the click takes. Once that data is available, fix is likely a one-liner. Suspect: stale `stillform_biofilter_choice` localStorage entry routing the click into a silent "skip" path, or React state batching issue specific to mobile WebView.

(Other items from Apr 27-28 testing — optionality decisions, trees theme fix, Resolved Apr 28 morning items — all RESOLVED May 2. Full records in Completed archives.)

---

## 📒 OPERATING NOTES — for future sessions

### Watch deploy → publish flow on Netlify
Triggering a deploy in Netlify is NOT the same as publishing it. After triggering, the new build sits ready on the Deploys tab and must be explicitly Published to go live. Reminder: Claude pushes → Arlin triggers deploy → Arlin publishes → fix is live.

---

## 🟡 STORE SUBMISSION PATH — Google Play Closed Testing → Public Launch

This section covers the store submission mechanics, not the prelaunch product scope. **The launch standard (locked Apr 29) is: master todo complete, except translations and Apple Store.** Every section above this one is prelaunch work — that scope must be resolved before public launch.

Launch path: Google Play closed testing → public launch. Apple Store is the explicit exception — TestFlight blocked until Arlin has access to an iPhone. Reddit is not a launch step; held as a contingency lever for week-1 traction support.

**ACTIVE — work that can ship now:**

- [ ] Onboarding redesign — 2 intro pages max, calibration, interactive first-use walkthrough
- [ ] Google Play Console setup ($25 one-time) — required for closed testing track, 14-day clock before public launch can begin. Build the Android App Bundle from existing Capacitor android/ project.

**BLOCKED — pending hardware/access:**

- [ ] TestFlight build + tester invites — Apple Developer Program is paid, but BLOCKED on Arlin acquiring iPhone access for build testing. Pick up after Google Play track is established.

## 📡 CONTINGENCY — If App Doesn't Sell Itself Week 1

- [ ] Reddit launch post — r/ADHD, r/neurodivergent, r/anxiety, r/cptsd, r/BPD. Held in reserve, not a launch step. Only deploy if organic post-launch traction is weak.

---

## 📝 POST-LAUNCH — Noted, Not Blocking

- [ ] **User outcome check after 10 sessions (added May 2 — surfaced from old ideas sweep)** — one open-text question after a user's 10th session: "Has anything changed in how you show up?" Not a rating, not a score, free text. Becomes proof that execution matched intent. Small enough to spec into the existing post-session flow. Defer to post-launch since it requires real users completing 10 sessions.
- [ ] **7-session review specificity verification (added May 2 — surfaced from old ideas sweep)** — verify what the existing post-7-sessions surface currently does (session notes, longitudinal data are shipped but the 7-session review with specific evidence callouts may not exist as a discrete surface). Spec gap or already-shipped — read code to determine.
- [ ] **Research partnership outreach email (added May 2 — surfaced from old ideas sweep)** — email drafted for grad student / clinical psych researcher outreach per strategic roadmap. Locate the draft in archives or rewrite. Send when 4-6 weeks of post-launch user data accumulates.
- [ ] **KetaRevive doctor contact (added May 2 — surfaced from old ideas sweep)** — get name and contact. Ask if they'd try Stillform personally. The signal that started the B2B clinical thread. Captured in KETAREVIVE_ONEPAGER.md but the specific contact details aren't in any active list.
- [ ] **Internationalization (V1 launch language set chosen Apr 27)** — committed launch set: **English (baseline) + Spanish + Brazilian Portuguese + Armenian**. Reasoning grounded in market analysis:
  - **Spanish** — 500M+ speakers, covers US Hispanic + all Latin America. Strong clinical-translation tradition, abundant translator availability.
  - **Brazilian Portuguese** — Brazil is the fastest-growing wellness app market globally. 220M speakers. Close enough to Spanish that some translation infrastructure can be reused.
  - **Armenian** — founder heritage (Arlin). Non-negotiable.
  - All four use Latin script — no RTL engineering, no character-width layout issues. Translation work only.
  
  **Deferred (post-launch international expansion):** German, French, Mandarin, Japanese, Korean, Hindi, Arabic. Each has distinct deferral rationale:
  - German — strong wellness market but local-tool preference; needs enterprise partnerships first
  - French — smaller wellness market than Brazilian Portuguese; defer
  - Mandarin — China requires WeChat ecosystem + local hosting + regulatory work
  - Hindi — needs country-specific pricing strategy first ($14.99/mo too high for India)
  - Arabic — RTL layout requires real engineering work across every screen, not just translation
  - Japanese/Korean — small total audience for the cost + script-width concerns
  
  **Build path (NOT yet implemented):** (1) i18n library install (i18next), (2) string extraction from all UI components into a translation table, (3) language picker in Settings persisted to localStorage + Supabase, (4) AI prompt translation for each language — REQUIRES clinical translator, not generic, because Porges polyvagal / Siegel window of tolerance / Ochsner & Gross suppression-vs-reappraisal must keep precision. (5) Per-language QA review.
  
  **Cost reality:** ~6,500 lines UI strings + ~1,500 lines AI prompts × 3 target languages × translator rates × QA review. Not free, not bolt-on. Plan as multi-session work with budget allocated. Realistic timeline 4-6 weeks of mixed engineering + translation work.
  
  Crisis region routing (App.jsx line 9538) already handles locale-driven hotline routing.

- [ ] **Service worker disabled in production** (`index.html`). The current index.html actively unregisters all service workers and clears caches on every page load — `sw.js` exists in `/public` but is never used. Impact: no offline support beyond the in-app self-guided fallback, no asset caching for repeat visits, weak PWA install experience on mobile. Likely intentional during UAT (avoiding stale-cache bugs) but should be re-enabled before public launch so the offline fallback feature has cached assets to work with. Decision needed: keep disabled or re-enable + set up proper cache invalidation.
- [ ] **ARIA labels minimal across the app** — only 6 `aria-label` / `aria-labelledby` / `role=` attributes across 14,680 lines. Screen reader users would struggle. App Store accessibility audits could flag this. Not blocking launch but needs a sweep on chips, info buttons, and tool entries.
- [ ] **IndexedDB device key not cleared on delete-all-data** (`App.jsx:14538`). The "Delete all data" flow clears all `stillform_*` localStorage keys and Supabase cloud data, but the AES-GCM device key in IndexedDB (`stillform_keys` DB) persists. Practically harmless (cloud data is gone, so nothing to decrypt) but for forensic deletion completeness, add `CryptoStore.deleteKey()` to the wipe.
- [ ] **AI prompt framing — "metacognition" (verify against May 2 prompt rewrites).** Stillform was historically positioned in `reframe.js` as "composure tool / stabilizer / companion" — never as a metacognition tool. The architectural truth is that this IS a metacognition tool that produces composure. **Status May 3:** May 2 CBT→MCT prompt rewrites in `netlify/functions/reframe.js` introduced explicit detached-mindfulness language and Wells 2009 references in CALM, CLARITY, and HYPE openings, plus the QUALITY_RETRY_PROMPT and runtime context appendix. Those rewrites are made but not committed yet. After commit, verify whether this item is now resolved or whether further weaving is still needed.
- [ ] **AI prompt "not therapy" framing** (`reframe.js:904, 925, 998`). Three places use negation framing ("NOT therapy homework," "not a therapy session"). Per Stillform's product principle: "Never define it by what it isn't." These are AI tone instructions (operational), not user-facing copy, but technically violate the rule. **Status May 3:** May 2 prompt rewrites may have changed these line locations. After commit, re-grep for "not therapy" or "NOT therapy" in reframe.js and decide: accept operational use or rewrite as positive instructions.
- [ ] **"Add state to statement" / "What Shifted" label inconsistency** (`App.jsx:5757, 5768, 5778`). Same screen has both names. Header says "What Shifted", buttons say "Add state to statement" / "Hide state to statement", expanded section header says "State-to-Statement (optional)". They're slightly different concepts (What Shifted = internal observation, State-to-Statement = external message conversion) but the names should make that clearer. Recommend: rename buttons to "Convert to message" / "Hide message draft" and section header to "Make it sendable".
- [ ] **Subscription URL param trust window** (`App.jsx:8869`). `?subscribed=true` URL param sets local subscribed=yes immediately on page load — server reconciliation happens via `sbCheckSubscriptionStatus` within ~20-min grace period. A bad actor could append the param and have full access until the grace window closes. Acceptable design (handles webhook lag) but worth flagging. Stronger fix: signed query param from Lemon Squeezy redirect.
- [ ] **AI payload size cap** (`App.jsx:5253–5340`). `signalProfile`, `biasProfile`, `priorToolContext`, `priorModeContext`, `sessionNotes` all bundle into every Reframe request with no size cap. The 2000-char input cap is good but doesn't bound the context payload. For a heavy user 6+ months in this could hit token limits or get expensive. Add per-field truncation with most-recent-first selection.
- [ ] **useEffect cleanup audit** — 47 useEffects, 18 cleanup returns. Possible timer/listener leaks. Post-launch sweep, not urgent.
- [ ] **Chip touch target sizes** — currently ~28px tall, iOS HIG recommends 44px. Adult users won't notice; an accessibility audit would flag it.
- [ ] **DST manual test** — `getStillformToday()` uses local Date so it should handle DST correctly, but worth one manual test on a DST night to confirm date guards behave.
- [ ] **Cloud-corruption edge case for ErrorBoundary** — if corruption got synced up before error fires, `sbSyncDown` pulls it back. Cover via `backups` table restore (the three-table schema already includes pre-update backups). Not blocking — covers <5% of error scenarios.
- [ ] **GitHub PAT rotation** — scope `repo` only, 90-day expiry, revoke old. Low practical risk per Arlin (separate identity, no overlap with Claude account).

---

## NATIVE APP

- [ ] Android Studio setup — build signed APK
- [ ] Google Play Console — create account, fill store listing, upload APK, add 12 testers, start 14-day closed testing clock (Arlin has 5 Gmail addresses, needs 7 more)
- [ ] Xcode — archive, upload to App Store Connect
- [ ] TestFlight — invite testers
- [ ] **Native neuro voice (added May 2 — surfaced from old ideas sweep)** — Web Speech API on web shipped. Native voice synthesis on iOS/Android pending — closes the Safari gap and gives platform-quality voice. Not blocking launch but real return-loop value (simulated human contact per retention research).
- [ ] **Contextual push notification logic (added May 2 — surfaced from old ideas sweep)** — Notification infrastructure shipped via Capacitor. The *logic* for contextual nudges (smart, not spam) was never built. Open question: gated by something else (cognitive function measurement data?), or buildable now? Decision needed before deciding launch vs post-launch placement.
- [ ] **HRV / Health Connect / HealthKit integration (added May 2 — surfaced from old ideas sweep)** — continuous biometric signal flowing into Stillform's data layer. Heart rate, sleep, HRV. Listed as Layer 2 return-loop infrastructure in roadmap. Post-launch milestone — not blocking initial release but flagged here so it doesn't drop off the radar entirely.
- [ ] Watch haptic breathing companion — Galaxy Watch Ultra / Wear OS (requires Android Studio)
  - Code chain wired end-to-end: App.jsx line 4265 → watchBridge → WatchBridgePlugin → WatchBridge.java → MessageClient `/stillform/breathe` → WearListenerService → WearBreatheActivity. Plumbing is structurally complete.
  - **Known bug (May 2): pattern ID mismatch between phone and watch.** Phone-side `BREATHING_PATTERNS` IDs are `quick`, `deep`, and `cyclic_sigh` (App.jsx line 3629-3650). Watch-side switch in `WearBreatheActivity.java` line 51-63 only handles `box`, `478`, and `quick`. Net effect:
    - `quick` → matches on both sides ✅
    - `deep` → no match on watch, falls back to default `{4, 4, 8, 2}` Regulate pattern. Coincidentally identical to deep so it works by luck.
    - `cyclic_sigh` → no match on watch, falls back to default Regulate pattern. **Watch runs the wrong breathing pattern when user picks Cyclic Sighing on the phone.** This is the broken case.
    - `box` and `478` referenced in WatchBridge.java javadoc don't exist on the phone side anymore — stale comment.
  - Fix scope: update `WearBreatheActivity.java` switch cases to match current phone-side IDs (`quick`, `deep`, `cyclic_sigh`) with correct phase durations from `BREATHING_PATTERNS`. Update `WatchBridge.java` javadoc to reflect current pattern IDs.
  - Cannot verify from code (requires device testing): wear module builds into APK, watch app installs alongside phone app, haptics fire correctly on real hardware, message round-trip works under real conditions.

---

## LAUNCH

- [ ] Master todo complete (this entire document, except translations and Apple Store sections)
- [ ] Google Play store approved — flip to public
- [ ] Apple Store: deferred (post-launch)
- [ ] Reddit post: not a launch step (contingency only — see Store Submission Path section)

---

## Completed — May 2, 2026

### ✅ SECURITY-CRITICAL — Encrypt all sensitive on-device localStorage (commit ef8d8008)
Extended existing AES-GCM `secureSet`/`secureGet` infrastructure to wrap all sensitive localStorage keys. Same key management pattern (per-device key in IndexedDB), no new primitives. Closes the gap between cloud (already AES-GCM encrypted before upload) and device (previously partially protected — only Reframe AI conversations).

Keys now encrypted: `stillform_sessions`, `stillform_journal`, `stillform_signal_profile`, `stillform_bias_profile`, `stillform_checkin_history`, `stillform_eod_history`, `stillform_communication_events`, `stillform_tool_debriefs`, `stillform_focus_check_history`, `stillform_feelstate`, plus settings/preferences/regulation type/biometric flags.

Why this was launch-critical: a prestige composure architecture cannot ship with users' raw emotional content sitting in plain text on their device.

### ✅ Reframe tone — auto-detect + in-Reframe dropdown + personalization default (commit f36cdb63)
Three-layer system shipped replacing the Settings-only static tone choice.

**Layer 1 (auto-detect):** detectSuggestedTone helper computes tone from bio-filter / feelState / input per render. Rules: depleted/pain/sleep → gentle, excited → motivational, focused → direct, long+distress → gentle, long+composed → clinical, otherwise null.

**Layer 2 (in-Reframe dropdown):** Static tone label (line ~6578) replaced with tappable dropdown showing Reason header (Auto/Session/Default) + 5 options with descriptions + reset link. Manual selection sets sessionToneOverride which takes top priority. Surfaces the *reason* for auto-selection ("Gentle — because you marked depleted") — metacognitive surface (Pillar 1).

**Layer 3 (Settings personalization):** Default tone selection now includes Balanced (was missing). New 'How your default applies' toggle: 'Use my default' (override) vs 'Auto-suggest, default as fallback' (fallback). Override is recommended default per spec — Stillform doesn't presume to know better than the user.

`stillform_ai_tone_mode` added to SYNC_KEYS / UNENCRYPTED_SYNC_KEYS / keysToRemove. rehydrateAfterSync extended to restore tone + mode after cloud sync. resolveActiveTone surfaces source ('auto' / 'session' / 'default' / 'fallback') so user always sees why a tone is active.

### ✅ Unified text capture for AI context (commits 20a0810a + bbb0f07b + 556a91bc + 3f033319)
**Spec source:** Arlin direction May 2 — "I want AI to capture all text areas, not just in self mode, in all of them. So specifically in what shifted captured by AI. So we have the data points so we can move forward and guide them the correct way."

**Shipped:** New `buildUnifiedTextContext` aggregator in App.jsx pulls recent text from every persistence store on the device:
- `stillform_shift_events` → shiftLabel free-text from Body Scan + Reframe What Shifted moments
- `stillform_sessions` → responses{} from Self Mode 5-step protocol
- `stillform_grounding_data` → text from grounding 5-senses writes
- `stillform_journal` → existing Signal Log entries

Defaults: 20 entries, 14-day lookback, sorted newest first. Uses `TimeKeeper.clockDayOf` for proper local-day extraction.

**Wired into reframe.js:** New `textHistoryContext` parameter alongside `journalContext`. Same session-count gating: at sessionCount ≥ 3 AI uses for pattern recognition; at < 3 context only. AI is instructed never to quote text back verbatim, never to flag AI-down gaps in conversation.

**AI-down resilience (Arlin's specific architectural ask):** Aggregator is a synchronous read of localStorage. No network dependency. When the user writes into any textarea during an AI outage:
1. Text persists locally regardless of network state (storage was always local-first)
2. The runSelfGuidedFallback path handles the AI-down user experience at the UI layer
3. When AI returns, buildUnifiedTextContext reads whatever's in localStorage — including everything written during the gap
4. No special "catch up" code needed because the data layer was never AI-dependent

**Pre-deploy stumbles (operating-rule violations on Claude's part):** Initial commit shipped `s.timestamp.slice(0, 10)` — TimeKeeper guard caught it; should have used `TimeKeeper.clockDayOf` from the start (fixed in 556a91bc). Initial commit used `// ===` decorative dividers; preflight's merge-marker check matched the pattern (replaced with U+2500 box-drawing chars in 3f033319).

### ✅ FAQ enhancements (commit bdf3570a)
Search bar with no-results state. Chip navigation at top (auto-expand + smooth scroll to target). Collapse-by-question with rotating chevron. Mailto email link with pre-filled subject (ARAembersllc@proton.me). The 'How do the feel chips work?' entry already existed in the FAQ items array (Apr 29 work). Two useState hooks added (faqSearchQuery, faqExpandedSet) alongside existing faqBackScreen. Stable question IDs (slugified) used for both chip nav and expanded-state tracking.

### ✅ Memory reconsolidation grounding for Reframe (commit b3292a97)
Added "Why Reframe?" info button next to the AI tab in ReframeTool. Cites Ecker, Ticic & Hulley (2012); Schiller et al. (2010, *Nature*); Lane et al. (2015). Frames why repeated Reframe sessions on a recurring trigger update what the trigger means at the memory level. Connects to the Pattern Disruption Layer spec — repeat Reframes are reconsolidation opportunities, not redundant work.

### ✅ Predictive processing grounding for bio-filter (commit b3292a97)
Extended the existing "Why the bio-filter?" modal (line 3889) with a second paragraph citing Seth (2013); Barrett & Simmons (2015). Frames bio-filter as updating the brain's predictive model of itself — the same situation interpreted through a depleted body produces a different prediction than the same situation interpreted through a rested body.

### ✅ Salience network reset grounding for body-first pathway (commit b3292a97)
Added "Why Body Scan?" info button next to the "Body scan." header in BodyScanTool intro phase. Cites Menon (2011). Frames Body Scan as an attentional rerouting tool, not a calming technique — pulling attention into the body interrupts the salience network's stuck cognitive priority.

### ✅ ACT cognitive defusion lineage acknowledgment (commit 2218f2b0)
Upgraded the Self Mode tab info from static tooltip to full info modal. Names primary lineage as Metacognitive Therapy (Wells 2009) and explicitly acknowledges ACT cognitive defusion (Hayes, Strosahl & Wilson 1999; Han & Kim 2022) as parallel research converging on the same underlying mechanism. MCT remains primary framework as required.

### ✅ In-app info button copy alignment with Apr 28 Science Sheet corrections (commit 71f64903)
11 corrections committed to Science Sheet Apr 28 (commits 175bb6e4 through 9536e676). Audit completed May 2 against all 18 info modals in App.jsx.

**Two real misalignments fixed:**
1. "Why name your state?" modal claimed pre-Reframe-entry naming reduces amygdala activation — now contradicted by Nook 2021 crystallization correction. Reframed to position chip selection as context-setting for the AI, not as the amygdala-reduction effect (which is preserved for POST-regulation labeling claims).
2. "Sessions" modal claimed each session is autonomic flexibility training — overclaim per Science Sheet line 441 which explicitly says Stillform doesn't measure HRV directly. Softened to "regulation practice" with literature framed as "mechanism Stillform draws from."

16 other modals audited and confirmed aligned with current Science Sheet (Yoo 2007 bio-filter, Lieberman + Vine + Nook for What Shifted, Schön for Lock-in, Barrett for Signal Log, Gollwitzer for Next Move + outcome, Meichenbaum for Day Streak, no overclaim for analytical metrics).

### ✅ Optionality decisions resolved — 4 of 5 fully resolved; Decision 3 reframed
The Apr 28 audit identified mechanisms the science sheet names as core training but that were optional or skippable. All five gating decisions resolved May 2:

1. **Lock-in card confirmation** (commit `432e4018`): Required when Next Move selected. Finish button disabled (40% opacity, not-allowed cursor) when `postNextMoveId && !lockInConfirmed`. Schön (1983) reflection-on-action + Lavi-Rotenberg 2020 MERIT — durability mechanism preserved.
2. **Post-rating chip selection** (commit `9a64577b`): Required with "Unsure" as the legitimate honest exit. 10th chip "Unsure" added to post-rating row in both Reframe and Body Scan What Shifted. Finish button disabled when postRating is null. classifyShiftDirection gains explicit unsure handler returning `nullReason: "user-unsure"`. Lieberman 2007 + Vine 2019 + Nook 2021 — affect-labeling mechanism preserved without forcing inaccurate labels.
3. **What Shifted textarea** — reframed from "should we keep it?" to "should we capture and surface what users write?" — capture shipped via the unified text aggregator (commits `20a0810a` + `3f033319`). Required-vs-optional toggle decision deferred.
4. **Bio-filter for body-first users** (commit `fd09bf0b`): Skip → button removed; bio-filter now a required gate for everyone. Pre-selection from getActiveBioFilter() reads today's prior reading and pre-highlights matching option. Pain Active routes to bio-filter-suggest-scan sub-phase showing soft suggestion (Eccleston & Crombez 1999 + Kabat-Zinn 1982 + Reiner 2013 + Farb 2013) with two paths — Body Scan first or Continue to Breathe anyway (preserves autonomy).
5. **Calibration "Skip this step"** (commits `954e5d96` + `e485c5c7`): Replaced with "Use defaults →" on calibration step 2. Sets `localStorage.stillform_calibration_deferred = "yes"` and proceeds to home. No fake profiles created; signalProfile and biasProfile remain null. AI receives a context note explaining the user has not completed calibration and should engage as a new user, avoid pattern claims about body signals or thinking patterns, and limit to discovery questions when relevant. SignalMapTool and MicroBiasTool save handlers automatically clear the deferred flag.

**Citations (verified May 2):** Liu et al. 2025 meta-analysis of 79 RCTs (Deakin University, *via HCPLive Feb 2026 / AJMC Nov 2025*) — mental health app attrition averaged 18.6% at endpoint and 28.4% at follow-up, 49% higher than waitlist controls. UXCam 2026 best-practices analysis, Zigpoll 2025 onboarding research, multiple 2026 sources on deferring optional setup.

**Note on a prior fabricated citation (called out for the record):** an earlier version of this entry attributed the recommended fix to a "JAMA Psychiatry 2025 meta-analysis on hard-gating attrition risk." Claude wrote that citation today (May 2) without verification and propagated it through master todo, transfer doc, state-of-may-2 doc, and conversation responses. After Arlin pushed back, web search confirmed the cited study does not exist as described. The architectural argument for the fix stands on the verified sources above; the fabricated citation is replaced. Lesson preserved.

### ✅ Trees in Body Scan / Breathe theme mismatch (commit `5ef150d8`)
FractalBreathCanvas trees now use `var(--text-muted)` per-frame so they follow the active theme. Amber glow under the ring preserved as the warmth anchor.

---

## Completed — April 30 / May 1, 2026

### ✅ ToolDebriefGate friction reduction — SHIPPED Apr 30 (commit 51493cce)
The 20-second forced wait dropped. Continue enables on selection alone. Copy softened from "20-second capture required before exit" to "Take a moment to name what you used." Skip button added in footer (same skip pattern as What Shifted and Next Move). All three completeDebriefGate functions (Breathe / Body Scan / Reframe) updated to capture `skipped:boolean` on stored debrief record + new Plausible event "Tool Debrief Completed" with tool + skipped props for cohort visibility into engagement-vs-skip rates per tool.

What stayed: header copy, three preset options + "I need another pass to lock this in" fourth option, Continue as primary CTA, tool-specific and regulation-type-specific options (Pillar 1 metacognition load-bearing science).

This was the small focused engagement craft change that addresses Round 2 consultation finding ("close feels heavy") without committing to the full kinesthetic close redesign. The kinesthetic close spec is still next session.

### ✅ Plain-Language Neuroscience Surface — SHIPPED May 1, 2026 (8 commits + 3 follow-up build fixes)
Second engagement mechanic Arlin flagged interest in alongside Cognitive Function Measurement. Now live as the Plain-Language Neuroscience Surface — post-session card that surfaces one finding from a verified 36-entry corpus tied to what the user just practiced.

**Architecture:**
- AI-generated at runtime via reframe.js with mode='science_card'
- 36-entry verified corpus, every entry traceable to a Science Sheet section (Protection C: paraphrased from Science Sheet's own framing, not training-data recall)
- 20 hand-written static fallback cards activate on any AI failure
- Variety guard via stillform_card_history localStorage (last 5 topics retained)
- Three protections: SEVERE-failure system prompt rule (A) + server-side citation validation against SCIENCE_CARD_VALID_CITATIONS Set (B) + Arlin verification pass on corpus before ship (C — pending)
- ⓘ button on card opens info modal explaining the three card types (AI-generated / static fallback / generic)
- 4 Plausible events: Science Card Shown / Continued / Skipped / Info Opened
- Once per session. Skip button. Shows on first session.

**Insertion point:** post-session, after What Shifted (Body Scan) and post-rate (all tools), BEFORE ToolDebriefGate. Each tool's `if (debriefTarget)` block now renders ScienceCard first if scienceCardShown is false.

**Cost:** ~$0.002/card via gpt-4o; ~$1.50/user/year at 2 sessions/day. Negligible against subscription.

**Ship arc — 8 commits + 3 build fixes May 1:**
- 5a773785 — Spec v2 with verified corpus + 20 static cards + ⓘ modal copy + 3 protections
- c18d7fc3 — Server side: corpus + routing + system prompt builder + science_card branch in handler + Protection B validation
- 2d9007ce — Frontend foundation: ScienceCard component + STATIC_SCIENCE_CARDS array + helpers + ⓘ modal + 4 Plausible events
- 6cf4b8fe — Wiring: ScienceCard inserted into close flow of Breathe, Body Scan, Reframe with scienceCardShown state per tool
- 821faa09 — FIX: ScienceCard React imports (had used React.useState namespace pattern; codebase uses named hook imports; build was failing on Vite's "React is not defined")
- 64c2e3b1 — FIX: Literal backslash-n in scienceCardShown state declarations (Python string escaping issue in build script; three places had broken JSX syntax)
- fc4e8158 — FIX: Decorative comment dividers tripping Security Gate (// =====... matched git conflict marker regex; replaced with dashes)
- Final state on main: all checks pass, Security Gate green

**Engineering lessons from the three broken commits:**
- React component patterns must match existing codebase (named hooks, not namespace) — should be checked before writing component
- Python scripts that build JS files must not embed `\n` in string replacements — triple-quoted strings or direct file write only
- Decorative comment dividers must avoid `=======` pattern (matches git conflict marker regex in Security Gate)
- After every code commit, file should be re-read from main and visually inspected for obvious issues — three commits today shipped with bugs that re-reading would have caught
- "Shipped clean, ready for trigger" is the wrong framing when only Security Gate proves clean — should be "shipped, awaiting Security Gate green"

### ✅ What Shifted three-category data feed — SHIPPED Apr 30 (commit 890469aa, combined with Body Scan What Shifted)
Russell circumplex three-category classifier implemented (Russell 1980 J.Pers.Soc.Psychol. 39:1161-1178, confirmed Watson 2024). Pure function `classifyShiftDirection(preState, postState, sessionContext)` returns Category A (regulated shift), Category B (persistent state), Category C (concerning shift), or null with reason. Schema versioned at v1 — never recompute existing entries.

**Architecture:** SHIFT_CHIP_QUADRANTS maps all 9 chips to Russell quadrants (HAP/LAP/HAN/LAN/cognitive/undifferentiated). Pattern-context helper (`getRecentSustainedPatterns`) computes sustained Flat ≥5 / sustained HAN ≥5 in 14-day window. Storage key `stillform_shift_events`, capped at 2000 entries. buildShiftEvent helper assembles full event with bioFilter, sessionCount, regulationType frozen at write-time.

**Wired into:** Reframe finishStateToStatement (classifier runs on State-to-Statement complete + skip paths), Body Scan What Shifted (handleWhatShiftedLockIn + handleWhatShiftedSkip), Plausible "Shift Classified" event with 4 props (category, subcategory, tool, mode) — zero user identifiers, zero chip values, zero free text.

**Privacy architecture preserved:** Aggregate-anonymous → Plausible (Stillform sees percentages across users); per-user encrypted on-device → My Progress (Stillform never sees individual data).

Spec at THREE_CATEGORY_DATA_FEED_SPEC.md (committed to repo root). My Progress visual integration ships in My Progress redesign (deferred — needs real categorized data accumulation post-publish).

### ✅ Body Scan post-completion What Shifted moment — SHIPPED Apr 30 (commit 890469aa, combined with three-category data feed)
What Shifted screen added to BodyScanTool. After 6-point sequence completes, "Signal cleared" → 2s pause → What Shifted screen (post-state chip picker + collapsed-by-default optional free-text label + Lock it in / Skip buttons). Russell-grouped chip ordering. Pre-state shown as "Started: X" for orientation. Lock-In disabled until post-state selected. After lock-in or skip, queueDebriefAndCompleteNow runs the existing ToolDebriefGate. Closes Pillar 1 metacognitive gap.

State additions: showWhatShifted, postStateChip, shiftLabel, shiftLabelExpanded, shiftSkipReason. Handlers: handleWhatShiftedLockIn / handleWhatShiftedSkip. Pre-push audit caught wrong-tool placement bug (handlers initially placed in BreatheGroundTool scope) — fixed before push.

Spec at BODY_SCAN_WHAT_SHIFTED_SPEC.md (committed to repo root).

### ✅ Settled chip — low-arousal positive — SHIPPED Apr 30 (commits 768b56ed in App.jsx + ad4a43f1 in reframe.js)
Settled added as 9th chip. Russell-circumplex-grouped chip ordering implemented at all chip render sites: Excited · Focused · Settled · Anxious · Angry · Stuck · Mixed · Flat · Distant. AI prompt branch added in reframe.js feelMap for maintain-state framing (no regulate-down posture, surface patterns more freely, no Self Mode nudge, no protective suppression). Chip definition copy committed via CHIP_DEFINITIONS_DRAFT.md (Arlin approved).

**Why this mattered for the data feed:** Without a low-arousal positive chip, Category A (regulated shift) was impossible to detect when users actually arrived at the regulated state. With Settled live, the three-category framework works end-to-end.

Spec at SETTLED_CHIP_SPEC.md (committed to repo root).

### ✅ Chip ⓘ button — define what each chip covers — SHIPPED Apr 30
CHIP_DEFINITIONS registry added to App.jsx as top-level constant. ⓘ buttons wired at all 3 chip render sites (Body Scan What Shifted, showPostRating, PresentStateChips). Per CHIP_DEFINITIONS_DRAFT.md (Arlin approved Apr 30 after copy review).

Each chip definition is ~40-60 words, anchored to reframe.js feelMap voice but rewritten for user-facing context — no clinical jargon, no pathologizing, body and mind both named, tells user what selecting the chip does in the system. Tapping ⓘ opens existing setInfoModal pattern.

ARIA labels added on every ⓘ button — addresses part of the prelaunch ARIA sweep item.

### ✅ Cyclic sighing as third breathing option — SHIPPED Apr 30
Cyclic Sighing added as third breathing pattern alongside Quick Reset and Deep Regulate. Protocol implements published Balban et al. 2023 (Cell Reports Medicine 4:100895, n=111 Stanford RCT under Spiegel/Huberman/Balban) exactly: Inhale 1 (deep, nasal) 4s + Inhale 2 (top-off, nasal) 1s + Exhale (slow, oral) 8s. 1:2 inhale-to-exhale ratio. 5 minutes recommended (~23 cycles).

Settings picker entry cites the published study. Default behavior preserved — Quick Reset stays default for new users; cyclic_sigh is opt-in.

**Outreach implication:** Now that Stillform implements her published protocol, this is the single strongest credibility lever for outreach to Dr. Melis Yilmaz Balban (founder of NeuroSmart, top outreach candidate per memory). Direct research overlap, non-competing market.

### ✅ Reframe title doesn't reflect mode — SHIPPED Apr 30
**Investigation finding:** the bug as described in the original todo entry doesn't exist in the codebase. Audit found that `modeConfig.title` and `modeConfig.subtitle` were defined but NEVER referenced anywhere in the rendering. The only 'Talk it out' the user sees is the home page CTA at App.jsx line 13977, already conditional based on regulation type. Inside Reframe, mode identity is carried by the icon glyph (◎ calm / ✦ clarity / ◌ hype) plus AI prompt behavior — not by any title field.

**Resolution:** removed the dead `title` and `subtitle` fields from modeConfig (6 dead lines across calm/clarity/hype entries). No user-facing change.

### ✅ Low-demand mode Phase 1 (Breathe) — SHIPPED Apr 30 (commit 81e2c0b7)
Decision-locked architecture: low-demand is a state-of-existing-tool, not a separate tool. Triggered by `bioFilter.includes("medicated")`. No home-screen entry — activates within existing flow when bio-filter signals it.

**Phase 1 changes:**
- isLowDemand derived state at top of BreatheGroundTool
- Phase init bypass: phase=='breathe' on entry (skips pre-rate, skips bio-filter screen)
- Audio force-enabled in low-demand (overrides user's saved setting). Per the science: paced auditory cueing is mechanism for cognitively-compromised users (Balban 2023, Ochsner & Gross 2005), not preference. Audio infrastructure was already built — this commit gates it on for the cohort that needs it.
- Three-rounds-done screen replaced with low-demand minimal-completion render: pulse circle + "Tap anywhere to close" label. Bypasses three-button decision.
- Tap-anywhere-to-exit with 1.5s grace period (lowDemandGraceOverRef prevents entry-tap from immediately dismissing).
- Debrief gate + Next Move screen bypassed entirely. Direct call to onComplete(undefined). No metacognitive demand on a cognitively-impaired user.
- Session still auto-saves with source='low-demand-complete' for record integrity.

(Broad-design decision rationale captured in Locked Decisions section at top of master todo.)

### ✅ "Composure is a practice. You're building it." copy fix — SHIPPED Apr 30
Replaced with "Composure is the foundation. You are its architect." Foundation/architect frame is precise to what Stillform actually is — composure is the outcome (the foundation that gets built), user is the architect (active agent), Stillform is the architecture/practice through which it's built. Per Science Sheet line 11: composure is outcome, metacognition is mechanism. Committed to App.jsx line 16032.

---

## Completed — April 28, 2026 (morning)

Three-commit research-driven cleanup. Triggered by Arlin's pushback "the whole app is based off proven research and if it's been debunked then we need to change it now" after the morning research audit found that `Stillform_Science_Sheet.md` line 410 was citing science contradicted by Nook 2021 + 2024-2025 replications.

- [x] **Science Sheet update** (commit `a121a48a`) — the "What Shifted — Post-Session Affect Labeling" section was citing only the Lieberman 2007 affect-labeling tradition. That framing has been refined by replicated work post-Lieberman: Nook, Satpute & Ochsner (2021, *Affective Science*) showed that emotion naming impedes BOTH cognitive reappraisal AND mindful acceptance strategies — not just intensifies the state, but "crystallizes" it (solidifies initial appraisals, limits generation of alternative appraisals). The 2025 Springer paper (N=226, two studies) replicated. The 2024 BMC Psychology fNIRS paper confirmed at the neural level. Updated section now cites Nook 2021 + 2024-2025 replications + Vine et al. 2019 (free-text labels stronger than predetermined choices). Five new citations added. Mechanism description updated from "intensification" to "crystallization." Design rule unchanged: regulate first, label after — but now defended by current literature instead of dated-only-Lieberman framing. Honest engagement with current research is what the product's "based on proven research" claim requires.

- [x] **Pre-regulation chips removed from Breathe and Body Scan** (commit `ae43f4db`) — `<PresentStateChips>` was rendered in three locations: BreatheGroundTool pre-rate (line 3228), BodyScanTool pre-rate (line 3880), and ReframeTool entry (line 6568). Per Nook 2021 + replications, the first two locations were science violations — pre-regulation labeling crystallizes the affective state. Removed from Breathe and Body Scan pre-rate. Stays in Reframe entry (defensible because Reframe IS cognitive intervention; labeling there is part of the regulation mechanism per Lieberman 2007, not pre-regulation cognitive load). Inline comments left at each removal site citing the research so future contributors don't reintroduce pre-regulation chips without checking the literature. State implications: `feelState` state hooks preserved in BreatheGroundTool/BodyScanTool for post-rating use; `preState` field in saved sessions now reflects morning check-in inference OR null, no longer in-the-moment chip override (acceptable — morning check-in was already primary data source; chips were redundant data parity). The PROCESSING_PRIMER copy ("Downshift physiology first; your cognition clears after the body settles") is no longer contradicted by the screen layout.

- [x] **Post-Reframe screen cleanup + Send-a-message CTA wired in** (commit `c86ec0ba`) — three architectural problems compounded each other in the post-Reframe finish flow. **(A)** Two completely unreachable screens existed in the codebase: `if (showStateToStatement)` block (80 lines, setter only fired from `continueFromPostInsight`) and `if (showPostInsight && postSessionInsight)` block (28 lines, setter never called from anywhere). Verified via grep — zero callers in live code paths. Both screens removed plus their helper functions (`finishStateToStatement`, `skipStateToStatement`, `continueFromPostInsight`) and orphaned state hooks (`showPostInsight`, `showStateToStatement`). **(B)** The live What Shifted block had identity confusion — wrapper text said "naming consolidates the regulated state" while textarea placeholder said "Draft one clear message you can send now" and had Copy/Share/Mark sent buttons attached. Single UI element trying to serve two distinct mechanisms (Lieberman affect labeling vs external communication) with contradictory copy. Stripped the message-drafting overlay; What Shifted now serves only post-regulation affect labeling per Lieberman 2007 / Vine 2019 / Nook 2021. Toggle label changed from "▸ What shifted? (optional)" to "▸ What shifted?". **(C)** Added Send-a-message expansion under Next Move — when the user selects the "Send a message" chip, an expansion appears immediately (BEFORE Lock-in) with "Draft the message" header, textarea, and Copy/Share/Mark sent buttons. Per Gollwitzer 1999 + Hallam et al. 2015 fMRI study + Sheeran 2016 review of intention-behavior gap research: implementation intention specificity at the moment of intention formation is what closes the intention-behavior gap. The chip selection is the science-required if-then plan formation; the textarea is execution rehearsal that helps users carry it out. Drafting is OPTIONAL (chip = required intention formation; drafting = aid). Only "send-message" gets the expansion this commit; "Hold a boundary" might benefit similarly but the literature on boundary-statement drafting is not specifically researched, deferred to v2 if testing surfaces user demand. New state: `messageDraft`, `messageDraftCopied`, `messageDraftSent` separate from `externalAnchorDraft` (which now serves only as What Shifted affect label) so the two textareas don't collide. New helpers: `copyMessageDraft`, `shareMessageDraft`, `markMessageDraftSent` parallel to existing externalAnchor helpers, separate Plausible event namespace ('Message Draft' vs 'State to Statement'). Render order in `showPostRating` screen verified: FEEL CHIPS → POST SESSION INSIGHT → NEXT MOVE chips → SEND A MESSAGE expansion (when active) → LOCK-IN card → WHAT SHIFTED textarea → Self Mode nudge → FINISH session. Each element does ONE job, in the right scientific order. Net line change: 15,960 → 15,881 lines (-79 net) — removed ~180 lines of dead code + duplicate textarea infrastructure, added ~60 lines for new Send-a-message expansion + helpers. Codebase is leaner and more honest about what each piece does.

**Verification across all three commits:**
- esbuild parse: clean (exit 0)
- Undefined-component preflight: clean (exit 0)
- No remaining references to deleted functions or dead state in code (only in explanatory comments)
- New mechanisms verified present at expected locations

**Companion documents created during this session** (in `/mnt/user-data/outputs/`, not in repo):
- `OPTIONALITY_PLACEMENT_AUDIT.md` — initial audit mapping science sheet mechanisms to live code
- `RESEARCH_AUDIT_OPTIONALITY_VERDICTS.md` — research-driven audit using web search of post-2021 literature; identified the Nook 2021 contradiction
- `PRE_RATE_FLOW_DESIGN_MEMO.md` and `PRE_RATE_FLOW_PROMPT_V2.md` — design analysis with multi-AI input from earlier in the session

---

## Completed — April 27, 2026

- [x] **Undefined-component preflight guard** — new `scripts/check-undefined-components.mjs` script wired into ship-preflight.mjs. Parses App.jsx for every `<PascalCase>` JSX usage and every `(function|const|let|var|class) PascalCase` declaration, fails if any usage has no declaration. Catches the bug class that shipped FocusCheckValidation, PanicMode, and FractalBreathCanvas as silent crashes (esbuild parses these as valid; they only crash when the rendering path is hit at runtime). Whitelists React/library names + ErrorBoundary. Tested both ways (passes against current state, correctly catches artificial regression). Should have existed before today — adding it now closes the gap that let three components ship as undefined references over a 36-hour window. Commit 089acffa98.
- [x] **PanicMode + FractalBreathCanvas restored** — same yesterday-deletion that took FocusCheckValidation (commit 571074ee7381, "-600 lines") also took these two. PanicMode (329 lines) is the Quick Breathe panic screen — tapping the QB pill anywhere in the app fired `setScreen("panic")` which rendered an undefined component → ErrorBoundary crash. The QB pill (the safety valve users rely on when activated) had been broken since Apr 26. FractalBreathCanvas (99 lines) is the visual grounding canvas inside Breathe, only rendered when the bgtVisualGrounding setting is on. Both restored verbatim from commit efc17183f6b5. Commit 089acffa98.
- [x] **Duplicate ⓘ button on hero card removed** — absolute-positioned "Why 60 BPM?" ⓘ at top:0/right:0 was rendering adjacent to the inline "Why body first?" / "Why thought first?" ⓘ next to the italic subtitle, creating visible duplicate ⓘ where the corner one looked empty/orphaned. The 60 BPM concept is subtle by design — explaining it next to a separate inline ⓘ created visual noise without payoff. Inline contextual ⓘ retained. Commit 089acffa98.
- [x] **Diagnostic instrumentation for "Calm my body doesn't act" bug** — temporary console.log added to hero CTA onClick that surfaces runtime values at click time (regType, isBodyFirst, isThoughtFirst, bioFilter, offBaseline, hasPain, priorChoice, showBioFilterSuggestion, showObserveEntry). Static analysis traced click handler → startPathway → startTool → setScreen → BreatheGroundTool mount → hashchange listener with no obvious break, so runtime data is needed. Marked clearly as temporary instrumentation to remove once root cause identified. Next time Arlin taps the button, browser DevTools console (or Chrome remote debugging via chrome://inspect) will reveal which branch the click takes (or doesn't take). Commit 089acffa98.
- [x] **Four bugs found by Arlin testing on phone** (commit 3bf9dfa0):
  - **getFocusCheckHistoryFromStorage helper restored** — called 4 times in App.jsx (lines 6983, 6989, 7062, 8057) but never defined. Same root cause as FocusCheckValidation deletion: commit 571074ee7381 deleted both the component AND its supporting helper. Yesterday I restored only the component and missed the helper, so the app crashed on Finish session in Reframe (path traverses helper indirectly), opening My Progress (line 8057 calls helper directly on mount), and Composure Check (FocusCheckValidation calls it on mount). All three crashes propagated to ErrorBoundary showing "Something went wrong." Restored from commit efc17183f6b5, placed immediately above FocusCheckValidation matching original structure.
  - **Duplicate Next Move screen on Reframe Finish** — finishReframeSession saved the inline Next Move chip selection to the session record AND called queueDebriefAndComplete which set nextMoveTarget triggering a SECOND Next Move screen. User picks "Send a message" inline → hits Finish session → forced to pick again on a separate screen. Fix: added hadInlineNextMove flag captured before clearing postNextMoveId. If user selected inline, skip to queueDebriefAndCompleteNow (no second Next Move screen, straight to debrief gate).
  - **ⓘ button tap-through bug** — "What shifted? (optional) / ▾ Hide" toggle button at line 6408 had the ⓘ info button NESTED INSIDE it as a child element. HTML buttons can't contain other interactive elements; tapping the inner ⓘ bubbled the click to the parent toggle, collapsing the section instead of opening the info modal. Fix: restructured as flex container with two SIBLING buttons — toggle on left, ⓘ on right. Added e.stopPropagation() on the info button as defense-in-depth.
  - **ErrorBoundary theme mismatch** — boundary used hex literals (#C8922A bg, #0A0A0C text, etc.) so on Suede/Teal/Rose/Light/Midnight themes the crash screen showed dark-theme gold. Fix: use CSS custom properties with hex fallbacks (var(--bg, #0A0A0C), var(--amber, #C8922A), var(--text, #E8EAF0), var(--text-muted, #9496A1), var(--btn-primary-text, #0A0A0C)). Themes set these on document.documentElement so they're available even when React's tree errors out. Fallbacks ensure the boundary still renders if vars are unset.
- [x] **FocusCheckValidation component restored** (commit b98d347f) — Composure Check screen rendered as blank white. Component was referenced at two call sites (line 11569 inside tutorial focus-check briefing, line 13600 for the focus-check screen) but was never defined — yesterday's commit 571074ee7381 ("Remove Composure Check description") deleted 600 lines including the entire FocusCheckValidation function. Esbuild parses JSX with undefined components as valid; only runtime crashes. Composure Check was broken on stillformapp.com for over 24 hours without any preflight or smoke check catching it. Component restored verbatim from commit efc17183f6b5.
- [x] **Transfer doc accuracy update** (commit 2d1ceae7) — Section 3 (Open Issues): bio-filter routing gap, Disconnected/Distant chip, and Stuck chip routing question all RESOLVED, moved to "Resolved April 27, 2026 — kept for reference" subsection with commit hashes. Onboarding redesign now the only remaining launch-gating engineering item. Section 4 (Launch Sequence): renumbered, Reddit removed from launch path (contingency-only), testimonials dropped, TestFlight flagged as iPhone-blocked. Section 2 (Key Features Built): added today's significant work (outcome chooser, AI-error → Self Mode handoff, TimeKeeper, batched cloud sync, AI conversation persistence, Distant chip, internationalization scaffolding). Section 6 (Key Files): line counts updated, health.js added, preflight guard count corrected.
- [x] **Internationalization scaffolding** — `stillform_language` added to SYNC_KEYS + UNENCRYPTED_SYNC_KEYS so future preference cross-device syncs. `captureDeviceLocale()` runs once per install: captures `navigator.language` + `navigator.languages[0]` + `Intl.DateTimeFormat()` locale, stores to localStorage, fires Plausible event "Device Locale Captured" with locale code so demand data is visible in analytics from day one of testing. Settings → Language section (collapsible, between Theme and Display): shows "English ✓ Active" card with honest copy ("Stillform launches in English. Additional languages coming post-launch — clinically translated so the science holds in every language, not machine-translated."), "Request a language" mailto button → ARAembersllc@proton.me, Plausible event "Language Request Tapped". NO i18next install, NO JSON files, NO fake picker. Pure demand-data capture + visible user-facing commitment to expansion. Translation work itself deferred to post-launch sessions with real translator review per language.
- [x] **Outcome chooser in morning check-in (completed unbuilt scaffolding)** — feature was scaffolded (state slot, protocol filter, Plausible event) but UI to actually let users pick was never built. Found during dead-code audit. Built the missing UI: three chips in morning check-in (Sharp / Composed / Recover) with science modal citing Gollwitzer 1999 (Implementation Intentions) + Oettingen (Mental Contrasting / MCII). Replaced order-dependent `.find()` filter with explicit `outcomeProtocolMap` so routing is decoupled from protocols array order. Routing: Sharp → Reframe·Hype, Composed → Reframe·Clarity, Recover → Breathe. Skipping the chooser still works — falls back to existing default protocol. Outcome auto-clears each day (today's choice doesn't persist into tomorrow). Restored `setOutcomeFocus` and persistence useEffect that were removed in the first dead-code pass when it looked truly dead.
- [x] **Dead-code cleanup** — removed unused `setPatternId` setter (state is read-only after init from localStorage) and unused `setActiveMode` setter (state captured from mode prop on mount). Verified through exhaustive ref audit before removing.
- [x] **AI-error → Self Mode handoff with health-check recovery + sessionStorage persistence** — full system with the offer-then-auto-switch threshold (1st failure = offer, 2nd+ = auto-switch), new `/.netlify/functions/health` endpoint for AI-recovery detection, polling effect that runs only when in Self Mode because of AI failure, amber pill inside Self Mode tab when AI recovers ("AI's back. Continue here, or return.") with Return → and × dismiss actions, and sessionStorage persistence across tool close/reopen so an interrupted user (phone call, accidental nav) returns to exactly where they were. Replaces and deletes `buildOfflineFallback` writeup function — Self Mode (MetacognitionTool, grounded in Wells 2009 Metacognitive Therapy, science sheet) is the science-aligned protocol for AI-down moments. Distinguishes deliberate Self Mode entry (no polling, no pill ever) from ai-failure handoff. Plausible events: Self Mode Offered, Self Mode Auto-Switch, Self Mode Recovery Returned, Self Mode Recovery Dismissed.
- [x] **Disconnected/Distant chip** — added "Distant" chip to both chip arrays (post-rate feelChips at App.jsx:6202 and PresentStateChips at App.jsx:7176). New `useEffect` in ReframeTool watches feelState — when "distant" is selected, routes to Body Scan via `onComplete("scan")`. Per Porges 2011 polyvagal + Siegel 1999 window of tolerance: hypoarousal is below the window, prefrontal cortex offline, verbal reframing has limited reach until somatic re-engagement. Body Scan is the science answer, not Reframe. The chip overrides calibration (both processing types route the same way) because the science is calibration-agnostic at this state. feelMap entry added to reframe.js with science-grounded AI prompt for cases where user lands back in Reframe after Body Scan: short sentences, concrete language, body-and-room grounding, no abstraction, no "how does that make you feel" (feeling access is what's offline). scoreState left untouched — Distant returns null same as Stuck because hypoarousal is off the reactive↔composed dial. Data layer inherits everything automatically: session records, Pulse journal auto-write, My Progress emotion frequency, CSV export.
- [x] **ErrorBoundary cleanup + App Diagnostics integration** — Reverted earlier-in-day overshoot (cloud-restore path, calibration-preserving reset, three-button decision UI) since all duplicated existing infrastructure (Settings → Restore now / Delete all data; Reframe → Start fresh). Boundary back to original single-button form with original copy. KEPT one addition: componentDidCatch persists last crash to `stillform_last_error`. `buildPerformanceMetricsSnapshot` now reads it and includes as `last_crash` field in the existing opt-in daily metrics push to `/.netlify/functions/metrics-ingest`. After successful send, key is cleared so no duplicate crash reports. Crashes ride the diagnostics flow the user has already opted into — no new pipeline, no new permission grant. Also removed 4 dead TimeKeeper methods (clockYesterday, nowMs, nowIso, formatForUser — never called). Net: ~118 lines lighter.
- [x] **ErrorBoundary cloud-restore + reset-and-restart** — ErrorBoundary class rewritten with three paths. Signed-in users see primary "Restore from cloud" button → navigates to `/?restore=1` → App component detects flag, sets `restoring` state, splash subtitle changes to "Restoring your data…" until existing `sbSyncDown` completes, flag stripped from URL via `history.replaceState`. All users get "Reset and restart" → clears all `stillform_*` keys except calibration (`onboarded`, `regulation_type`, `signal_profile`, `bias_profile`, `morning_start`) and auth (`sb_session`) — user keeps setup, doesn't have to re-log-in. Every error logs to `stillform_last_error` (timestamp + message + truncated stack + component stack) for support visibility. Double-reset guard: 60-second cooldown surfaces support email instead of looping. Final Sequence 4 item — Resilience pillar complete.
- [x] **Cloud sync batching** — `sbSyncUp` rewritten as a single batched POST. Encryption parallelized via `Promise.all` over `SYNC_KEYS` (35 keys, independent per-key, parallel-safe). Single `POST /rest/v1/user_data?on_conflict=user_id,data_key` with array body, native Supabase REST upsert. 34 sequential round trips → 1. Atomic from the user's perspective — either all rows landed or none, no partial-sync silent inconsistency. Empty/null-keyed rows still skipped before batching. UNENCRYPTED_SYNC_KEYS distinction still applied per-key. Return shape `{ok, uploaded, errors}` preserved; all 4 call sites verified compatible (Settings manual sync button reads `r.ok`/`r.uploaded`/`r.errors?.length`, all preserved). No retry baked into the helper — deliberate architectural choice to keep helper contract simple and let call sites decide retry policy with their user-facing context (manual button vs auto-sync after Reframe vs background tab — all want different responses).
- [x] **AI conversation persistence — IndexedDB encrypted overflow** — new `SecureStore` IndexedDB module wraps a single object store (`secure_data`). `secureSet` now tries localStorage first, falls through to IndexedDB on quota/throw; `secureGet` checks localStorage first then IndexedDB. Same AES-GCM encryption applied before either store path. When localStorage write succeeds, stale IndexedDB copy for that key is cleared to keep reads consistent. If both stores fail, a non-blocking timestamp marker is written to sessionStorage for diagnostic visibility. Zero call site changes — ReframeTool's three persistence touchpoints (load on mount, save on Done-for-now, save on every message) work transparently. Conversations no longer silently lost on long Reframe threads or low-storage devices.
- [x] **Body-first metacognition gap — verified already implemented.** Re-checked the existing BreatheGroundTool flow after Arlin pushed back on the initial "no real gap" reading. Found: grounding-complete screen has "Continue to Reframe →" as PRIMARY CTA (line 3094), post-rate has "Skip to Reframe" escape hatch (line 3471), Body Scan auto-routes to reframe-calm (line 3834), feel-state chips already captured in Breathe with deliberate "data parity for body-first users" framing (line 3229). Initial reading was wrong; pathway flow already routes body-first users into metacognition cleanly. Not closed-without-action, just already-built.
- [x] **Stuck dead-branch cleanup + stale comment fix** — `if (feelState === "stuck")` removed at hero CTA body-first branch (line 12418). Variable was undefined at that scope and Stuck chip didn't exist on home anyway. Live ReframeTool autoMode check preserved. Stale `OBSERVE AND CHOOSE` comment also renamed to current `Self Mode nudge` name (line 6217).
- [x] **routeObserveEntry bio-filter parity** — three understand-branch paths brought into parity with hero CTA: thought-signal, unsure+thought-first regType, and unsure+body-first regType. Each applies the offBaseline narrowing (Pain → Scan, other off-baseline → Breathe; shouldBodyRouteToScan for body paths). Activated user going through Observe Entry no longer routes to Reframe without regulating first.
- [x] **Body-first override narrowing** — `shouldBodyRouteToScan(bioFilter)` helper added; 3 routing sites narrowed (hero CTA body-first branch, routeObserveEntry priority 1, routeObserveEntry understand branch). Pain/Off-baseline/Something route to Body Scan; Activated/Sleep/Depleted/Medicated route straight to Breathe per Ochsner & Gross 2005 (parasympathetic regulation, not body-locating). Removes a friction step for body-first users in states where breathing is the appropriate science answer.
- [x] **Bio-filter staleness fix** — schema migration to `{value, date}` shape. New `getActiveBioFilter()` / `setActiveBioFilter()` helpers gate by today's Stillform-day. Fixes routing accuracy for any user who doesn't re-check-in daily (i.e. most users on most days). 5 reads + 4 writes migrated. Affects: AI bio-filter context, win-feedback suppression, body-first routing in ObserveEntry, primary routeObserveEntry, hero CTA Body Scan override.
- [x] **TimeKeeper consolidation** — 26 direct calls to underlying date helpers migrated to TimeKeeper.* methods. Helpers renamed to `_toLocalDateKey` / `_getStillformToday` (private). 2 new preflight guards block direct external use. Codebase has ONE canonical path for date/time operations. Commit f02225bce3.
- [x] **TimeKeeper Phase 6** — 6 preflight guards added to `scripts/ship-preflight.mjs` to prevent reintroduction of broken date patterns (UTC date keys via slice/split, inline ms day arithmetic, hidden UTC extraction from timestamps). All guards verified passing. Commit 135e8355fb.
- [x] **TimeKeeper Phase 5** — Travel detection wired into AI context. `APP_LOAD_TRAVEL` runs `TimeKeeper.detectTravel()` once at module load; result piped through to Reframe AI as `travelContext` when timezone changed since last open. Server (reframe.js) destructures and pushes into context parts. Atomic commit (App.jsx + reframe.js). Commit 74d32bb41d.
- [x] **TimeKeeper Phase 4** — 5 Class C sites migrated (inline ms day arithmetic → `TimeKeeper.daysAgoMs(N)`). Sliding-window period filters: 30d/60d trends, 7d/14d patterns, 7d signal divergence. Zero behavior change. Commit 81f0678ea8.
- [x] **TimeKeeper Phase 3** — 7 Class B sites + 2 streak-loop comparisons migrated. **Streak counter now correct for all non-UTC users** (the original bug Arlin reported). Also fixes proof active days, daily aggregation for transfer score, AI transfer count, metrics dedup write/read mismatch. Commit 52cdcc1619.
- [x] **TimeKeeper Phase 2** — 3 Class A sites migrated (direct UTC date keys via `.split("T")[0]`). Auto-Pulse journal write, AI journal context filter, eodContext yesterday. Late-night journal entries now group with the practice day they belong to; AI's "today" filter aligns with entry dates; yesterday's EOD close actually surfaces. Commit 291c5334dd.
- [x] **TimeKeeper Phase 1** — Foundational module added with 12 methods. Single source of truth for all date/time operations. Wraps existing helpers; provides clockDay/stillformDay flavors, period filters, timestamps, timezone, travel detection, display formatting. Commit a6934b8cf9.
- [x] **Cleanup orphan** — `const now = new Date()` rendered unused by Phase 4's migration to TimeKeeper.daysAgoMs(). Verified zero references in scope before removal. Commit 54f1351b0b.
- [x] Bio-filter refinements — Pain detection now routes thought-first users to Body Scan instead of Breathe (Kabat-Zinn 1982 MBSR, Reiner et al. 2013, Farb et al. 2013). State-specific copy per signal — Pain reads differently than Activated, Sleep, Depleted, Medicated, Off-baseline. Day-memory keyed to (date, bioFilter snapshot) — once a user accepts or skips, their choice sticks until either the day rolls over (via `getStillformToday()`) or they update their bio-filter (which naturally creates a new memory key). Quieter visual treatment — softer border, smaller header, less interrupt-y. QB pill now available on home too (was excluded; user has instant safety valve regardless of what's showing). Commit 26feab55.
- [x] Chip parity for body-first tools — `PresentStateChips` shared component captures "What is present" (read-only morning check-in pre-fill, never overwrites the historical record) and "Anything to add?" feel chips. Added to Breathe pre-rate screen and Body Scan new intro phase. Reframe refactored to use the same shared component. Both tools' debriefs now include `feelState` so AI gets data parity for body-first users — they no longer contribute less context to the system than thought-first users. Also fixed pre-existing dead-on-click `setInfoModal` references in Breathe (lines 3026, 3182) by passing it through the props bag. Commit 6e1d8fb4.
- [x] Date/time alignment for global launch — added `getStillformToday()` helper that respects user's morning_start setting; migrated all 15 UTC date-key sites (`toISOString().slice(0,10)`) to local time; added date guards on 5 unguarded `stillform_checkin_today` reads (feelState inference, AI checkinContext, "From this morning" chips, progress dashboard, EOD save). All "is it today?" comparisons now consistent across the app. Calendar-day stamps (debrief writes, download filenames) kept as `toLocalDateKey()`. Fixes the morning-chip rollover bug. Commit 9d44050f. (Note: 3 additional sites missed in this pass — see TestFlight Sequence 1 item 2.)
- [x] Bio-filter routing override — hero CTA now reroutes thought-first users to Breathe when bio-filter flags off-baseline (Ochsner & Gross 2005 alignment); body-first behavior unchanged. Commit efe6abe3.
- [x] Info buttons on every element — science-verified copy, all 24 locations
- [x] Screen 2 — Next Move 4 buttons plus lock-in statements (regulation-type personalized)
- [x] Balanced regulation type removed — calibration binary, fallbacks to thought-first
- [x] Pre-meeting notifications — 30min plus 15min, Settings toggle, time pickers
- [x] Composure Check rename (from GO/NO-GO)
- [x] Self Mode rename (from Observe and Choose)
- [x] Stuck chip — pre and post session chips, routes to Reframe clarity (in-Reframe routing works; hero-CTA bridge is dead and pending architectural decision above)
- [x] FAQ rewrite — 27 questions, Stillform voice, science woven in
- [x] Calibration framed as tendency not fixed type
- [x] spiraling replaced with cycling
- [x] Composure Check description removed from screen (redundant with info button)
- [x] FocusCheckValidation function boundary restored
- [x] Security gate — all 41 checks passing

---

## Completed — Earlier Sessions

- [x] Lemon Squeezy LIVE — paywall active
- [x] Show/hide password at login
- [x] Stillform logo routes home on all screens except home
- [x] Skip and finish — copy fixed, theme color amber
- [x] Static home tip card removed
- [x] Most used tile — on My Progress home card
- [x] What Shifted (renamed from State to Statement)
- [x] Self Mode tab inside Reframe
- [x] Post-session merged screen — chips plus What Shifted plus Next Move
- [x] Calendar AI integration — references upcoming events, hard override for vague greetings
- [x] Supabase cloud sync — AES-256 encrypted, three-table schema
- [x] Biometric lock
- [x] Bio-filter expanded (Activated, Medicated states added)
- [x] Bias profiler rewritten (10 distortions)
- [x] Breathing favicon (needs polish — revisit when mobile supports animated favicons)
- [x] Apple Developer purchased ($99/yr, TestFlight unlocked)
- [x] DUNS confirmed
- [x] Security gate — 41 must-match checks
