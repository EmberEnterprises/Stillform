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

**Phase 0 storage infrastructure SHIPPED May 6, 2026.** The data layer the rest of the feature plugs into. No UI, no stimulus libraries, no surfacing logic — those ship in subsequent phases per the spec. Phase 0 includes:
- `stillform_function_checks` registered as a secure-storage key (encrypted at rest like sessions and journal)
- Registered in SYNC_KEYS so records persist to cloud sync if the user is signed in
- `FUNCTION_CHECK_CANDIDATES` constant for the three Phase 1 candidates: AFFECT_LABELING, INTEROCEPTIVE_LATENCY, COGNITIVE_DEFUSION
- `getFunctionChecksFromStorage()`, `appendFunctionCheck()`, `getLatestFunctionCheck(candidate)`, `getFunctionCheckTrend(candidate, limit)` helpers
- Schema versioned (`v: 1`) so future schema changes don't break historical reads
- 200-record cap on storage (4+ years of weekly checks at the spec's recommended cadence)
- Honest-framing rules from spec §"What it can't do" enforced at surfacing time, not storage — storage stays dumb so future surfacing work can iterate freely

After three rounds of consultation produced surface fixes and architectural overcorrections, Arlin diagnosed the actual gap: 'I got a bunch of science based prompts that are flat and not interested in engaging for the user. It feels more like a chore than something I actually want to do.' This is engagement craft, not architecture.

Out of nine engagement mechanics from non-wellness products examined, Arlin chose: cognitive function measurement as evidence of neuroplasticity. Small repeatable cognitive exercises grounded in Stillform's existing cited literature, performed periodically by the user, with results tracked over time. Improvements over weeks are measurable evidence the practice is producing the neuroplasticity Stillform claims.

This is the moonshot. Centerpiece feature. Scope: three measurement modules in Phase 1 (affect labeling speed, interoceptive latency, cognitive defusion), results tracking with longitudinal storage, integration into existing surfaces (My Progress, post-session, Settings). Built across multiple sessions paced by Arlin's review and decision availability — not estimated in calendar time.

**Differentiation:** every wellness app measures sessions/minutes/streaks. Nobody measures the cognitive functions the practice trains. Stillform would be first.

**Recommended Phase 1 (3 of 5 candidates):**
- Affect labeling speed (Lieberman 2007) — measures the function chips train
- Interoceptive latency (Mehling 2012) — measures the function body work trains
- Cognitive defusion / reframe generation (ACT lineage) — measures the function Reframe trains

**Lumosity overclaim risk explicitly designed against.** Spec mandates narrow honest framing — 'this specific function is faster than it was, which is consistent with the practice working' — never 'your brain is X% better.'

**Why this matters for the award case Aria asked for:** Stillform claims neuroplasticity. With this, Stillform proves it for each user individually. Nobody else in wellness has it. It's grounded in real science. It's executed at prestige altitude. It does something the user can't get anywhere else.

**Phase 1 decision audit drafted May 6, 2026.** See `COGNITIVE_FUNCTION_MEASUREMENT_PHASE_1_AUDIT.md` (375 lines). Walks every undecided question in the spec with stakes, options, and a recommendation grounded in the spec + codebase. Four decisions need Arlin's explicit sign-off before Sprint 1 can start: Decision 1 (naming — "Practice evidence" recommended), Decision 3 (Arlin authoring 30 affect-labeling + 15 defusion stimuli), Decision 5 (dedicated screen surface vs Self Mode integration), Decision 7 (AI distinctiveness rubric). Decisions 2, 4, 6 are lockable from the doc directly. Audit also proposes a four-sprint Phase 1 build sequence with Phase 1.5 (interoceptive latency, Self Mode integration, My Progress trend curves) deferred to after Self Mode + My Progress redesigns ship.

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

Engineering scope: detection, dispatch, state machine, disruptor tool, transparency surface, end-to-end testing across multiple sessions. Capacitor push-notifications and local-notifications already initialized.

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
- **Composure self-mastery legibility doc** — ✅ already in repo as `COMPOSURE_SELF_MASTERY_LEGIBILITY.md`. Master todo entry was stale.
- **Text size / high contrast accessibility toggle in Settings** — High contrast: ✅ shipped (verified May 3, 2026, App.jsx line ~14592 with HIGH_CONTRAST_OVERLAY values that meaningfully lift dim-text contrast). Text size: ✅ shipped May 3, 2026 (commit lands a Default/Larger/Largest three-button selector in Settings between Theme and High contrast, applies CSS `zoom` on the React root mount point at scale values 1.0/1.15/1.30 matching iOS standard accessibility text scale steps). Sourced from Bobby's first user session feedback ("text still too dim for aging eyes"). Connects to existing accessibility line items (ARIA labels line ~702, chip touch targets line ~710 — verify line numbers).
- **Fractal aesthetic expansion (May 2 idea, captured not committed)** — Arlin liked the trees. Possible directions if the existing audio/visual roadmap leaves room: branches that visibly extend on inhale and settle on exhale (synchronizing gaze with breath, not bilateral stimulation); additional fractal forms unlocked over session milestones (ferns, water rings, crystalline growth) as engagement-craft palette; pure "watch and breathe" mode that strips all UI and lets the canvas carry the session. NONE of this is EMDR or bilateral stimulation — the explicit rule from May 2 conversation is no EMDR-coded mechanics, with or without the name. Aesthetic and gaze-synchrony only.
- **✅ Watch haptic-by-index → haptic-by-name — SHIPPED May 6, 2026.** `WearBreatheActivity.hapticPhaseStart()` now switches on `phaseNames[currentPhase]` instead of `currentPhase` index. cyclic_sigh's phase 1 (secondary top-off inhale) now correctly fires the Inhale haptic instead of the Hold haptic. Validation on physical Wear OS watch through all three breathing patterns deferred until a watch is available — code change is mechanical (string switch over existing array values) and low-risk.
- **✅ Body Scan tension data → My Progress surface — Phase 0 SHIPPED May 6, 2026.** The data-layer utility helpers are in place so the My Progress redesign can plug straight in without retrofitting later. Full surfacing UI ships with My Progress redesign per Apr 30 spec sequencing decision (prestige refresh → My Progress redesign in implementation order). Five tension helpers + four EOD helpers + persistence gap fix:
    - `BODY_SCAN_AREAS` — canonical 6-area constant ("Jaw & Face", "Shoulders & Neck", "Chest & Breath", "Hands & Arms", "Gut & Core", "Legs & Feet")
    - `getMorningTensionHistory()` — chronological morning check-in tension records
    - `getBodyScanTensionHistory()` — chronological post-Body-Scan tension records (excludes low-demand sessions where tension input was skipped)
    - `getLatestTensionByArea(source, limit)` — most recent reading per area in window of N records
    - `getTensionTrend(source, limit)` — first/latest/delta per area across last N records (negative delta = improvement, positive = worsening)
    - `getMorningToScanDelta(limitDays)` — same-day pre/post pairs across morning + scan: the strongest signal Stillform has for proving practice works
    - `getEodHistory()` — chronological EOD records with energy, composure, word, morningEnergy
    - `getComposureTrend(limit)` — counts and ratios of strong/mostly/rough composure across last N EOD records
    - `getEnergyArc(limitDays)` — same-day morning→evening energy comparison
    - `getEodReflections(limit)` — user's one-word EOD reflections for surfacing
    - **Persistence gap fix bundled:** `trackMorningComplete` was only persisting `{ date, timestamp, energy, tensionAreas: COUNT }` to `stillform_checkin_history` — the actual tension `{ areaName: 1-5 }` was being dropped. Same gap on EOD: `trackEodComplete` was only persisting `{ date, timestamp, composure }`, dropping energy/word/morningEnergy. Both fixed today; helpers above will now return real data going forward. Records before today have the partial shape; helpers handle missing fields gracefully.
    - Originally entered May 4, 2026 as follow-up to low-demand Phase 2 commit. Body Scan tension was being captured in React state and discarded; commit 3f148b6 fixed the persistence; today's commit closes the helpers gap + the parallel morning/EOD persistence gap discovered during this work.

---

### AI-as-actor voice audit — review only, May 2

**Captured May 2, 2026 — review only, no edits.**

The audit found that across info modals, FAQ items, system prompts in reframe.js, and one literal UI surface ("What the AI has noticed"), the app reaches for "the AI does X for you" framing instead of "you do X; the AI processes what you give it."

The mechanism is correct — AI does read inputs, process them, and surface user data. The voice register is what's off. Subject of every sentence keeps landing on the AI when it should land on the user.

**Items found (high-leverage first):**

1. **reframe.js system prompts** (CALM_SYSTEM, CLARITY_SYSTEM, HYPE_SYSTEM) — tell the AI to think of itself as "companion" or "coach." Shapes every AI response. Highest-leverage single edit because it cascades through all responses.

2. ✅ **"Patterns surfaced"** — RESOLVED May 3, 2026. Was: "What the AI has noticed" (3 occurrences across post-session insight headers and My Progress archive). Now: "Patterns surfaced" — works in monospace caps and as a list header with insight count.

3. ✅ **FAQ "What happens in Reframe?"** — RESOLVED May 3, 2026. Question reframed from "What does the AI do in Reframe?" Answer now leads with "Reframe reads..." instead of "It [the AI] reads...", uses "Reframe surfaces what your processing is doing" instead of "The AI introduces a perspective," and frames the screenshot work as Reframe (the tool) reading the message rather than the AI being a diagnostician of the user's read.

4. ✅ **FAQ "Does Stillform learn about me?"** — RESOLVED May 3, 2026. Question reframed from "Does the AI learn about me?" Answer now: "Yes — the system reads your signal profile..." and "From session five onward, cross-session observations surface directly in your sessions." Removes "the AI" as the entity with observations; the system reads, observations surface.

5. ✅ **FAQ "What is Next Move?"** — RESOLVED May 3, 2026. Last sentence changed from "The AI reads your session context and surfaces the relevant options" to "Reframe surfaces the relevant options based on your session context." Rest of answer unchanged.

6. ✅ **FAQ "What is the Bio-Filter?"** — RESOLVED May 3, 2026. Last clause changed from "the AI contextualizes your input accurately" to "the system carries those variables into how your input is read." Matches phrasing used in Item 9 fix for consistency across audit.

7. ✅ **FAQ "Can I attach screenshots?"** — RESOLVED May 3, 2026. Was: "The AI reads visual context — layout, attribution, sequence — to improve coaching for interpersonal situations." Now: "Visual context — layout, attribution, sequence — is folded into the session so Reframe can read interpersonal situations more accurately." Three sentences after this remained the original limits/disclaimers.

8. ✅ **Reframe info modal "Why Reframe?"** — RESOLVED May 3, 2026. Was: "the AI introduces a perspective that interrupts the loop you're already in." Now: "you step back from the loop you're already in by surfacing a different angle on it. The work is yours; the system organizes what you give it and asks the next question." Fixed in both duplicate strings (click handler + keydown handler).

9. ✅ **Bio-filter info modal extension** — RESOLVED May 3, 2026. Was: "the AI updates the predictive model with the actual hardware state." Now: "you mark depleted, in pain, sleep-deprived, the system carries that hardware state into how your input is read." User as actor (marks); system as substrate.

10. ✅ **"Why name your state?" modal** — RESOLVED May 3, 2026. Was: "tells Stillform what is present so the AI can meet you accurately... how the AI interprets what you type." Now: "tells Stillform what's present so what comes next meets you accurately... how your input is read." Removed "AI" as sentence subject in both phrases without introducing developer jargon (tried "routing" first, dropped because it's not a user word).

11. 🔒 **Privacy/screenshot disclosure** — KEPT AS-IS May 3, 2026. Original audit flagged "the image is sent to the AI model for interpretation" as AI-as-actor drift. On review during the May 3 voice pass, this was determined to be a different category from items 2-10. Privacy disclosures need to identify the actual data processor — and "AI model" is the technically precise term for what receives the image (third-party LLM). Replacing it would obscure the privacy fact that the image leaves the device and goes to a third party. Termly and legal counsel would want this disclosure exactly this clear. Closed as deliberately preserved.

12. ✅ **Hero CTA "Calm my body" body-first subtitle** — RESOLVED May 3, 2026. Was: "Start where the pressure lands." Now: "Start with what the body is doing." Now parallels the thought-first subtitle ("Start with what the mind is doing.") and removes the assumption that body-first users arrive with pressure. CTA label "Calm my body" itself unchanged — audit only flagged the subtitle.

**Voice that would match Arlin's framing:**
- User reads their own state. The system organizes the inputs.
- User notices their patterns. The system surfaces what they've already given it.
- User does the work. The system asks the next question.
- Stillform is the architecture. The user is the operator.

**Notes for whoever does this work:**
- Items 2-10 and 12 RESOLVED May 3, 2026 across two commits (411f2d5 for 8-10; new commit for 2-7 and 12). Item 11 closed as deliberately preserved for legal precision.
- Item 1 (reframe.js system prompts) remains the only open AI-as-actor item. The May 3 reframe.js prompt rewrite (commit 43d51a6) addressed the "you are infrastructure / composure companion" opening register and consolidated bloat, but the audit's full sweep across CALM/CLARITY/HYPE for AI-as-actor sentence subjects wasn't the goal of that commit. Item 1 still pending.
- The 19-scenario AI Framework regression test artifact is now ready to run. See `AI_REGRESSION_TEST_19.md` (test spec with pass/fail signals per scenario) and `scripts/run-ai-regression.mjs` (runner that posts each scenario to the deployed Reframe API and writes responses to `ai_regression_results.json`). Cost ~$0.05 per full run, ~2.5 minutes. Has not been run yet against the May 3 prompt rewrite or the May 4 Phase 3 LOW-DEMAND OVERRIDE. Pre-deploy gate before TestFlight broad release.

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

### Composure-applied-both-directions verification — AUDIT FINDINGS May 6, 2026 (test-blocked)
The AI must build BOTH outward composure (listener stops filtering input by status, background, bias) AND inward composure (speaker stops shrinking, qualifying, performing credibility). Verification needed: does the current prompt set produce both? May connect to the AI-as-actor voice audit (12 surfaces, captured commit `d8a6507e`) — if not already a verification dimension there, add it.

**Code-side audit findings (May 6, 2026):**

Reading `netlify/functions/reframe.js` (1655 lines):
- Calm mode system prompt (line 724) frames composure as inward: *"observe their own thinking when their state is loud"* and *"see what their mind is doing so they can step back from it and choose their next move."* Inward-only framing.
- Hype mode system prompt (line 952) addresses both directions implicitly: *"Composure is power. Whoever stays composed controls the room."* (line 994 — confrontation context). This names outward effect.
- Medical advocacy is hard-coded as a hype-mode context (line 992): *"they have a right to be heard. Help them name what they need in one clear sentence."* This is the speaker-stops-shrinking dimension.
- "Stop pulling toward repair, trauma, intensity" guard (line 739) prevents the AI from triggering speaker-shrinking but doesn't actively build outward composure framing.

**Verdict on code side:** the prompts produce inward composure consistently. Outward composure is implicit (mostly in hype mode context lines) but not named as a dimension the AI is supposed to support. The 19-scenario regression test (`AI_REGRESSION_TEST_19.md`) covers self-diminishment / silencing / advocacy scenarios that would surface whether the AI actively builds outward framing or only inward framing. Cannot verify behaviorally without running that test against the deployed Reframe API. Test is on the May 7 test plan.

**Decision pending test results:** if the 19-scenario test shows the AI defaults to inward-only framing in scenarios that need outward-composure framing (boss talked over user, missing-degree credibility, immigrant outsider), that's a prompt rewrite item before TestFlight. If the test shows the AI handles both directions adequately because the per-state contexts and hype-mode framing carry enough load, this audit closes without further work.


---

## 🎨 Prestige Refresh — whole-app visual track


**Spec drafted Apr 30 — see `STILLFORM_DESIGN_SYSTEM.md` in repo root.**

Arlin's diagnosis: "It looks like a 32-bit NES platform. Whole app needs to be prestige." Refresh authorized as prelaunch work. Visual language synthesized from 5 AI reference passes converging on editorial luxury family (Aesop + MUBI + Cartier + Linear, not wellness apps). Spec covers calibrated palette, type scale, spacing rhythm, motion tokens, component vocabulary, implementation order. Ships with existing free font triad — no paid fonts required.

This work blocks visible execution of Self Mode redesign and My Progress redesign (both already specced — `SELF_MODE_FOUR_WAY_SYNTHESIS.md` and `MY_PROGRESS_REDESIGN_SPEC.md`). Both redesigns are designed against the new system, not the current one. Build the design system first, then the redesigns land into it cleanly.

Implementation order in spec: CSS variables → typography → components → screens (Home → Reframe entry → Self Mode → My Progress → Body Scan → Breathe → Pulse → Settings → FAQ). Each screen verified on phone debug before next.

---

## 🐛 Bugs / Defects

### 🔄 Auto-trigger cloud sync + restore purchases on app open for logged-in users — added May 6, 2026
When a user is already signed in, opening the app does not automatically sync cloud data or restore purchases. Both require a manual tap in Settings.

**Impact:**
- Returning users see stale or missing data on launch until they sync
- Subscription entitlement can read as inactive until restore is tapped
- During phone-testing this is indistinguishable from a real bug

**To ship:**
- On app open with active session, auto-trigger cloud sync
- On app open with active session, auto-trigger restore purchases
- Surface failure or conflict; keep success silent

**Why TestFlight-blocking:** Apple reviewers will sign in and expect their data and active subscription to be present without manual Settings actions. Real UX gap for any returning user.

### ⌚ Watch haptic breathing companion — pattern ID mismatch (Galaxy Watch Ultra / Wear OS)
Requires Android Studio for fix.

- Code chain wired end-to-end: App.jsx line 4265 → watchBridge → WatchBridgePlugin → WatchBridge.java → MessageClient `/stillform/breathe` → WearListenerService → WearBreatheActivity. Plumbing is structurally complete.
- **Known bug (May 2): pattern ID mismatch between phone and watch.** Phone-side `BREATHING_PATTERNS` IDs are `quick`, `deep`, and `cyclic_sigh` (App.jsx line 3629-3650). Watch-side switch in `WearBreatheActivity.java` line 51-63 only handles `box`, `478`, and `quick`. Net effect:
  - `quick` → matches on both sides ✅
  - `deep` → no match on watch, falls back to default `{4, 4, 8, 2}` Regulate pattern. Coincidentally identical to deep so it works by luck.
  - `cyclic_sigh` → no match on watch, falls back to default Regulate pattern. **Watch runs the wrong breathing pattern when user picks Cyclic Sighing on the phone.** This is the broken case.
  - `box` and `478` referenced in WatchBridge.java javadoc don't exist on the phone side anymore — stale comment.
- Fix scope: update `WearBreatheActivity.java` switch cases to match current phone-side IDs (`quick`, `deep`, `cyclic_sigh`) with correct phase durations from `BREATHING_PATTERNS`. Update `WatchBridge.java` javadoc to reflect current pattern IDs.
- Cannot verify from code (requires device testing): wear module builds into APK, watch app installs alongside phone app, haptics fire correctly on real hardware, message round-trip works under real conditions.

---

## 🎨 UX / Surface refinements

### My Progress redesign

**Spec drafted Apr 30 — see `MY_PROGRESS_REDESIGN_SPEC.md` in repo root.**

Arlin's diagnosis: data heavy with redundancy. Heavy compute should run backend/PDF for deeper analysis; live screen should surface trends and patterns only. Eight sections collapse to four (headline pattern, compounding view, patterns and intelligence, archive and export). Earns Pillar 4 neuroplasticity claim by surfacing the science behind each pattern (Lieberman 2007, Wood & Rünger 2016, Schultz 1998, Lehrer 2020, Brewer 2011, Meichenbaum 1985, Wells 2009). Privacy architecture preserved — on-device only, Stillform never sees individual user data.

Visual treatment held until whole-app design system locks (whole-app prestige refresh authorized Apr 30). Some redundancy may resolve naturally during the design system pass; new patterns may emerge. Build the spec into the new design system rather than the current one.

### Processing primer threshold tunable (currently 5 sessions)

Decay logic ships at session > 5 (App.jsx ~line 14257). If 5 is too long after live testing, threshold is one number to change. Captured Apr 29 for revisit after real user data.

---

## 📋 Compliance / Apple / Legal

### 📞 Set up Google Voice business line + update Termly ToS phone number — REQUIRED before TestFlight (added May 4, 2026 during Termly ToS questionnaire)
The Termly ToS generated today lists Arlin's personal cell (+1 201-388-8437) as the company contact phone in two places (opening paragraph and Section 31 "Contact Us"). Personal cell published in legal docs = spam exposure, subpoena service exposure, and personal/business boundary erosion.

**Steps:**
1. Set up free Google Voice number at voice.google.com. Pick a number from any area code (NJ 201/973/908 keeps it regional). Forward to Arlin's personal cell so calls/texts route through but the published number is the Google Voice one.
2. Update Termly ToS questionnaire — replace the personal cell with the new Google Voice number in the company contact section. Re-generate ToS. Re-publish.
3. Optional: also update Termly Privacy Policy if it references the same phone (need to check — Privacy Policy review yesterday didn't surface a phone field).

**Why TestFlight-blocking:** the ToS published today is technically active even before App Store launch. Anyone who reads it has the personal cell. Better to fix BEFORE the ToS goes wide. Five-minute setup, real privacy protection.

### 🔧 Fix Termly ToS free-trial billing answer — REQUIRED before publishing the ToS (added May 4, 2026 during Termly ToS questionnaire)
The ToS generated today reads: *"The account will not be charged and the subscription will be suspended until upgraded to a paid version at the end of the free trial."* This **contradicts the actual Lemon Squeezy billing setup** — the trial auto-converts to paid charging on day 15. Real legal exposure: a user charged on day 15 could cite the ToS as evidence the charge was unauthorized.

**Steps:**
1. Go back to Termly ToS questionnaire. Find the Free Trial question.
2. Change the answer from "The account will not be charged and the subscription will be suspended until upgraded to a paid version" to **"The account will be charged according to the user's chosen subscription."**
3. Re-generate ToS. Re-publish at https://stillformapp.com/terms (or wherever the ToS embed lives).

**Why must-fix before publishing:** the current ToS makes a false billing commitment. This is the single biggest exposure in the generated document. Five-minute fix.

---

## 🏗️ Infrastructure

Backend, schema, cloud sync, deploy, env-var, Supabase migrations.

*Currently empty. Reserved for new items as they surface.*

---

## ✍️ Copy / Voice / Content

User-facing copy, AI prompt voice, FAQ, science cards, info modals.

*Currently empty. AI-as-actor Item 1 (reframe.js system prompts) lives in Engagement Craft where the audit lives.*

---

## 📒 OPERATING NOTES — for future sessions

### Watch deploy → publish flow on Netlify
Triggering a deploy in Netlify is NOT the same as publishing it. After triggering, the new build sits ready on the Deploys tab and must be explicitly Published to go live. Reminder: Claude pushes → Arlin triggers deploy → Arlin publishes → fix is live.

---
## 🟡 STORE SUBMISSION PATH — Google Play Closed Testing → Public Launch

This section covers the store submission mechanics, not the prelaunch product scope. **The launch standard (locked Apr 29) is: master todo complete, except translations and Apple Store.** Every section above this one is prelaunch work — that scope must be resolved before public launch.

Launch path: Google Play closed testing → public launch. Apple Store is the explicit exception — TestFlight blocked until Arlin has access to an iPhone. Reddit is not a launch step; held as a contingency lever for week-1 traction support.

**ACTIVE — work that can ship now:**

- [ ] Google Play Console setup ($25 one-time) — required for closed testing track, 14-day clock before public launch can begin. Build the Android App Bundle from existing Capacitor android/ project.
- [ ] Onboarding redesign — 2 intro pages max, calibration, interactive first-use walkthrough. **Sequenced last on purpose (Arlin direction May 4):** onboarding teaches users what the app does, so the calibration questions and tutorial flow can't be designed until the rest of the prelaunch product scope is locked. Building it earlier means rebuilding it as features land.

**BLOCKED — pending hardware/access:**

- [ ] TestFlight build + tester invites — Apple Developer Program is paid, but BLOCKED on Arlin acquiring iPhone access for build testing. Pick up after Google Play track is established.

## 📡 CONTINGENCY — If App Doesn't Sell Itself Week 1

- [ ] Reddit launch post — r/ADHD, r/neurodivergent, r/anxiety, r/cptsd, r/BPD. Held in reserve, not a launch step. Only deploy if organic post-launch traction is weak.

---
## 📝 POST-LAUNCH — Noted, Not Blocking

- [x] **In-app "Manage Subscription" link in Settings — SHIPPED May 4, 2026.** Built during Termly ToS questionnaire walkthrough rather than deferred. New Netlify function `subscription-portal.js` calls Lemon Squeezy `/v1/customers/{id}` API with the user's `lemon_customer_id`, returns the signed `customer_portal` URL (Lemon Squeezy provides per-customer signed URLs valid ~24h, bypassing re-authentication). Settings → Account → Subscription card (when active) now has a "Manage subscription" button that opens the portal in a new tab. Users can cancel, update payment method, view receipts. Helper text below the button: "Opens the billing portal where you can cancel, update payment, or view receipts." Error handling for: not signed in, no subscription record (`lemon_customer_id` missing), Lemon Squeezy API failure, network error. **Requires `LEMON_SQUEEZY_API_KEY` env var on Netlify** (read-only API key sufficient — only GETs customer records). ToS questionnaire answer for cancellation now: "Through the Manage subscription button in Settings → Account, or by emailing araembersllc@proton.me."
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
  
  **Cost reality:** ~6,500 lines UI strings + ~1,500 lines AI prompts × 3 target languages × translator rates × QA review. Not free, not bolt-on. Plan as multi-session work with budget allocated.
  
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

---

## LAUNCH

- [ ] Master todo complete (this entire document, except translations and Apple Store sections)
- [ ] Google Play store approved — flip to public
- [ ] Apple Store: deferred (post-launch)
- [ ] Reddit post: not a launch step (contingency only — see Store Submission Path section)

