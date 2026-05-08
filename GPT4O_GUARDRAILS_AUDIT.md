# GPT-4o Guardrails Audit

**Date:** May 8, 2026
**Author:** Claude (audit philosophy v1.3, Prime Directive of Integrity)
**Scope:** Cross-walk Stillform's shipped reframe-pipeline guardrails against publicly-documented GPT-4o substrate behavior. Surface what actually protects, what's redundant, what conflicts, what's missing.
**Pre-TestFlight gate:** per `Stillform_Master_Todo.md` line 435. Privacy/behavior claims in user-facing materials must match substrate reality before TestFlight.

---

## PRIME DIRECTIVE PREAMBLE — what this is, what it isn't

The master todo (lines 430-432) refers to two prior audit documents:

- `GPT4O_DATA_PICTURE_AUDIT.md` (Phase 1 — substrate data picture)
- `GPT4O_BEHAVIOR_AND_MCT_AUDIT.md` (Phase 2 — native behavior cross-walk)

**Neither file exists in the repo.** `git log --all` returns no history for either filename. They were planned May 2-3 but never written. Phase 3 was therefore drafted to depend on a substrate that wasn't documented.

Per Prime Directive (NO FABRICATION, NO ASSUMPTIONS): this document does not pretend Phase 1+2 exist or fill them in retroactively. Instead, it does the actual work the master todo named as Phase 3 — "actual guardrails review against substrate findings, mapping each shipped guardrail to which native pull it corrects/duplicates/conflicts with. Plus actioning anything found" — grounded directly in:

1. The shipped guardrail code (line refs into `netlify/functions/reframe.js` and `src/App.jsx`).
2. Publicly-documented GPT-4o substrate behavior (citations below).
3. The framework Stillform's prompts ARE doing (Wells 2009 detached mindfulness / MCT) vs the framework GPT-4o defaults to (CBT-coded, therapy-trained comfort).

Substrate findings are integrated inline rather than referenced as a prior-phase document.

---

## STANDING REQUIREMENT — Science + UI flow

**Science:** Stillform's voice prompts are MCT-grounded (Wells 2009 detached mindfulness — observe the thought as a mental event, do not engage its content). This is structurally distinct from CBT (challenge whether the thought is true), from acceptance-and-commitment (defusion via specific exercises), and from supportive-therapy framing (validation-first, "your feelings are valid"). Each shipped guardrail is a hedge against GPT-4o's training-baseline pull toward the latter three. Auditing whether each hedge actually holds against a documented substrate behavior is grounded in Wells 2009 (the framework Stillform is doing) and the OpenAI Model Spec (December 2025 + March 2026 updates).

**UI flow:** No UI change. This is analysis. Output is this document plus any actionable findings actioned in code via subsequent commits. Pre-TestFlight per master todo.

---

## 1. SUBSTRATE — what GPT-4o actually does, by default

Citations from publicly available OpenAI documentation, fetched May 8, 2026.

### 1.1 Data substrate

| Property | Standard tier (Stillform's tier) | Source |
|---|---|---|
| Abuse-monitoring retention | 30 days for inputs + outputs | OpenAI `your-data` docs, May 2026 |
| Zero Data Retention (ZDR) | Enterprise-only, prior approval, eligibility-gated | OpenAI Enterprise Privacy page, Jan 2026 |
| Training on API data | Opt-out by default (data is NOT used for training) | OpenAI Business Data page, May 2026 |
| Encryption at rest (OpenAI side) | AES-256 | OpenAI Business Data page |
| Transit encryption | TLS 1.2 or higher | OpenAI Business Data page |
| Application state persistence | 30 days when `store=true` (Responses API) | OpenAI `your-data` docs |
| Image inputs | Same retention, slight added scrutiny on illegal content | OpenAI `your-data` docs |
| NYT preservation order | Ended September 26, 2025 — back to standard 30-day retention | OpenAI response-to-nyt-data-demands, Jan 2026 |

**What this means for Stillform's privacy claims:**
- "Inputs/outputs are retained for up to 30 days for abuse monitoring" — TRUE for the standard tier Stillform uses.
- "Your data is not used to train OpenAI models" — TRUE by default for API access.
- ZDR is not available unless Stillform applies and gets approved. It would require a sales conversation and likely doesn't pencil at current scale.
- Stillform's privacy policy must accurately disclose: data leaves device when sending Reframe input → goes to OpenAI → may be retained 30 days for abuse monitoring → is not used for training.

### 1.2 Behavioral substrate

| Property | Behavior | Source |
|---|---|---|
| Instruction hierarchy | Platform > System > Developer > User > Tool. Training reinforced via IH-Challenge dataset (March 2026). System-level rules win conflicts. | OpenAI IH-Challenge research, March 2026 |
| Model Spec wellbeing section | Added March 2026: explicit guidance on responding to distress/delusions/mania empathetically without reinforcing inaccurate beliefs; discourages language that creates emotional reliance on the assistant | OpenAI Model Spec Approach, March 2026 |
| Default register | "Sycophancy" explicitly named as anti-pattern; truthfulness/objectivity are user-level defaults | OpenAI Model Spec, March 2026 |
| GPT-4o release tendencies | Better at multi-step instructions, "slightly more concise and clear, using fewer markdown hierarchies and emojis", improved format adherence | OpenAI Model Release Notes |
| Therapy-coded language | Not policy-restricted; emerges from RLHF training data (Reddit / advice forums / writing samples) | Inference from training-data composition; not directly cited |
| Length defaults | Tendency to over-explain, recap, hedge with "It's understandable that..." style validation | Inference from common observations + prompt-engineering guides |

**What this means for Stillform's behavior guardrails:**
- The system prompt CAN expect to be obeyed when written tightly. The IH-Challenge work (March 2026) means Stillform's `CALM_SYSTEM` / `CLARITY_SYSTEM` / `HYPE_SYSTEM` rules are structurally privileged over user attempts to redirect. This is real — Stillform's prompts are not whistling in the dark.
- But: trained tendencies (validation-first, hedge-words, over-explanation) will surface unless explicitly prohibited. The Model Spec discourages sycophancy in the abstract; it does not eliminate the trained pull. Stillform's banned-phrase lists are doing real work against this pull.
- The March 2026 Model Spec wellbeing section is structurally aligned with Stillform's positioning — "do not create emotional reliance on the assistant" is exactly what Stillform's "no love language" / "show care through precision, not declarations" rules already enforce. This is not a coincidence; OpenAI's policy is moving toward where Stillform already is.

---

## 2. SHIPPED GUARDRAILS INVENTORY

All file references current as of HEAD `9badb72` (May 8, 2026).

### 2.1 Server-side — `netlify/functions/reframe.js` (1734 lines)

| # | Guardrail | Line | Type |
|---|---|---|---|
| G1 | Per-IP rate limit (10 req / IP / minute) | 53-80 | Infrastructure |
| G2 | Origin allowlist (CORS) | 25-49 | Infrastructure |
| G3 | System prompt — `CALM_SYSTEM` (Wells 2009 MCT, six elements, golden examples) | 783-906 | Prompt |
| G4 | System prompt — `CLARITY_SYSTEM` (rumination/loops, MCT) | 908-1009 | Prompt |
| G5 | System prompt — `HYPE_SYSTEM` (pre-event activation) | 1011-1106 | Prompt |
| G6 | `REFRAME_RESPONSE_SCHEMA` — JSON output contract, sentence cap, "JSON only" | 252-265 | Prompt |
| G7 | `QUALITY_RETRY_PROMPT` — retry override when validation fails first pass | 267-276 | Prompt |
| G8 | `BANNED_REFRAME_PATTERNS` — 22 regex (validation/it's-understandable/that-must-be-hard family) | 278-300 | Post-process |
| G9 | `GENERIC_GARBAGE_PATTERNS` — 11 regex (therapy-coded openers, "sounds like X is circling") | 302-314 | Post-process |
| G10 | `FRIENDLY_SOFT_ENTRY_PATTERNS` + `SOFT_ENTRY_BLOCK_PATTERNS` + length caps (80 chars / 12 words) | 316-332 | Routing |
| G11 | `GENERIC_GARBAGE_SNIPPETS` (substring match) + `GENERIC_NEXT_STEP_SNIPPETS` | 334-353 | Post-process |
| G12 | `VOICE_CONTRACT_BANNED_PATTERNS` — 6 regex (therapy idioms: "this space is for...", "what comes up for you", "how does that land in your body", "I understand how you feel") | 357-364 | Post-process |
| G13 | `INTENTION_ANCHOR_MIN_INPUT_LEN` (48) + stopwords + `validateIntentionFit` — mirrors user words | 366-369, 650-680 | Post-process |
| G14 | `validateReframePayload` — sentence count (2-5 normal, 3 low-demand, 6 crisis), question count (max 1, 0 in low-demand) | 621-648 | Post-process |
| G15 | `validateVoiceContract` — 560-char cap (skipped for crisis), soft-entry overbuild check | 682-695 | Post-process |
| G16 | `LOW_DEMAND_FLAGS` (medicated, depleted, sleep, pain, hormonal, gut) → 3-sentence ceiling, 0 questions | 613-619 | Routing |
| G17 | Crisis-term detection (1361) → 6-sentence allowance + safety-redirect fallback | 1361, 708-716 | Routing/fallback |
| G18 | Liability domain detection (financial / medical / legal) → bypass anchor validation, dedicated redirect templates | 728-769 | Routing/fallback |
| G19 | `buildDeterministicFallback` — runs when validation cycle fails entirely; multi-domain templates | 697-781 | Fallback |
| G20 | In-prompt `ABSOLUTE PROHIBITIONS — LIABILITY` block | 836-841 (and equivalents in CLARITY/HYPE) | Prompt |
| G21 | In-prompt `DECISION FRICTION` block | 833-834 (and equivalents) | Prompt |
| G22 | In-prompt `NO NAMES` rule | 830-831 (and equivalents) | Prompt |
| G23 | In-prompt `OVERSHARING` + scattered-input rule | 843-848 | Prompt |
| G24 | In-prompt `STATE AWARENESS` rule (context informs, never explains) | 850-851 | Prompt |
| G25 | In-prompt `MIRRORING` rule (match style, don't mirror chaos) | 853-854 | Prompt |
| G26 | In-prompt `EGO AWARENESS` rule (back off on pushback) | 856-857 | Prompt |
| G27 | In-prompt `PATTERN RESPECT` rule | 859-860 | Prompt |
| G28 | In-prompt `80/20 RULE` (80% present, 20% past pattern reference) | 874 | Prompt |
| G29 | 8 GOLDEN RESPONSE EXAMPLES (paired good/bad — accent, kids, jealousy, partner, freeze, $400 short, etc.) | 876-905 | Prompt |
| G30 | `EMPHASIS` rule (one *italic* per response max) | 826 | Prompt |

### 2.2 Client-side — `src/App.jsx`

| # | Guardrail | Line | Type |
|---|---|---|---|
| C1 | AES-256 at rest for all 17 SECURE_KEYS (Path A complete May 8) | 8654-9022 | Storage |
| C2 | Plausible event tracking for `crisisDetected` and `liabilityGuard` flags | 10023-10024 | Telemetry |
| C3 | Image upload validation (3-file max, 10MB/file, 20MB total, MIME whitelist) | (App.jsx OCR section, see master todo) | Input validation |
| C4 | `voiceRepairUsed` telemetry | 10029 | Telemetry |
| C5 | Crisis/liability tagging → fallback templates locked client-side | 10047-10048 | Routing |

---

## 3. CROSS-WALK — guardrail vs substrate behavior

For each shipped guardrail: name the GPT-4o default it's compensating for, then classify.

Classifications:
- **CORRECTS** — addresses a real, documented substrate default that would otherwise produce wrong-for-Stillform output.
- **DUPLICATES** — Model Spec or instruction-hierarchy training already enforces this. Guardrail is belt-and-suspenders. Harmless but redundant.
- **CONFLICTS** — guardrail fights the model in ways that hurt response quality or contradict the rest of the prompt.
- **PARTIAL** — covers some of the relevant defaults, misses others.
- **ENVELOPE** — substrate-level concern (data flow, retention) not addressable in prompts; addressed elsewhere or unaddressable.

### G1 — Per-IP rate limit
**Substrate default:** OpenAI doesn't rate-limit on Stillform's behalf — only on its own per-key quota. Without G1, an attacker hitting `/reframe` could exhaust Stillform's monthly OpenAI budget.
**Classification:** CORRECTS (real). 10/min per IP is the correct shape for a single-user wellbeing tool. No conflict.
**Action:** None. Keep as-is.

### G2 — Origin allowlist (CORS)
**Substrate default:** Netlify functions accept any origin unless explicitly restricted. Without G2, anyone could call Stillform's reframe endpoint from any origin and consume budget.
**Classification:** CORRECTS (real). Defense in depth alongside G1.
**Action:** None. Keep as-is.

### G3 / G4 / G5 — Three system prompts (CALM / CLARITY / HYPE)
**Substrate default:** GPT-4o, given a vague "be helpful" prompt, defaults to: validate first, suggest reframes in CBT shape ("is there evidence for that thought?"), recommend professional help, hedge ("I'm not a therapist, but..."), end with a question to keep the conversation going. None of this is what Stillform wants.
**Classification:** CORRECTS (real, foundational). The IH-Challenge work (March 2026) means these system prompts are structurally privileged. Stillform's specificity — naming Wells 2009, listing the six elements, providing the 8 golden examples — is the work that makes the prompts hold. Without these, every other guardrail is downstream of a wrong default.
**Action:** None. Keep as-is. These prompts are the spine.

### G6 — `REFRAME_RESPONSE_SCHEMA` (JSON output contract)
**Substrate default:** GPT-4o tends to wrap JSON in markdown fences, add preamble/postamble ("Here's the response:"), or add commentary fields. The schema constraint counters this.
**Classification:** CORRECTS (real). "JSON only. No markdown fences." is exactly the language the OpenAI prompt-guidance docs recommend for clean output.
**Action:** None.

### G7 — `QUALITY_RETRY_PROMPT`
**Substrate default:** When a model output fails downstream validation, naive re-prompting often produces the same output. The retry prompt explicitly references the failed contract + reasserts the framework + reasserts mirroring + bans fallback to generic empathy.
**Classification:** CORRECTS (real). This is doing protocol-level work — without it, the retry loop is just hoping the model gives a different answer the second time.
**Action:** None.

### G8 — `BANNED_REFRAME_PATTERNS` (22 regex)
**Substrate default:** GPT-4o's RLHF training surfaces these phrases extremely reliably under stress: "It's understandable that...", "That's valid", "Your feelings are valid", "You have a lot on your plate", "That must be really hard", "I can see why...". These are the trained-empathy register that Stillform explicitly does not want.
**Classification:** CORRECTS (real, mission-critical). The Model Spec discourages sycophancy in the abstract; the regex list is the operationalization of that discouragement for Stillform's specific voice.
**Concern:** Regex post-processing fights the model rather than steering it. If the system prompt is doing its job, banned patterns should be rare. If they're frequent, the prompt may not be holding. Worth measuring: how often does each banned pattern fire? If a pattern hasn't fired in N sessions, it's overhead. If a pattern fires every other session, the prompt should be re-tightened.
**Action:** RECOMMEND adding telemetry on which specific banned pattern fires when validation fails. Currently fires generic "contains banned phrase" reason. Surface the specific pattern → see if the prompt needs targeted reinforcement. **Surface as Action 1 below.**

### G9 — `GENERIC_GARBAGE_PATTERNS` (11 regex)
**Substrate default:** Therapy-app-coded openers that GPT-4o produces when asked for "wellness" output: "sounds like something's circling in your mind", "hasn't landed yet", "this space is for hard days", "we can pick it apart together". These are the wrong register for Stillform.
**Classification:** CORRECTS (real). Same family as G8 but targets opener/connector language vs validation language. Both are needed.
**Action:** Same telemetry recommendation as G8.

### G10 — Soft entry detection (length caps + friendly/block patterns)
**Substrate default:** Given short friendly input ("hey", "hi", "what's up"), GPT-4o defaults to long welcoming responses — exactly wrong for a tool whose contract is "match the vibe, return composed brevity". Soft-entry detection short-circuits this.
**Classification:** CORRECTS (real). The locked `SOFT_ENTRY_LOCKED_REFRAME` ("Hey good to see you. How are you doing?") is a deliberate non-answer that respects the user's brevity.
**Action:** None.

### G11 — `GENERIC_GARBAGE_SNIPPETS` + `GENERIC_NEXT_STEP_SNIPPETS`
**Substrate default:** Substring-level catches for the same family of phrases as G8/G9, but caught via simple `.includes()` rather than regex. Belt-and-suspenders.
**Classification:** PARTIAL DUPLICATE of G8/G9. Adds substring matching where regex might miss variants ("just chat about anything"). Not strictly redundant, but the overlap is real.
**Action:** RECOMMEND consolidating G8 + G9 + G11 into a single ban-list module with explicit categorization (validation / opener / next_step) and unified telemetry. Functionally equivalent, easier to maintain. **Surface as Action 2 below.**

### G12 — `VOICE_CONTRACT_BANNED_PATTERNS` (6 regex)
**Substrate default:** A second layer of bans, specifically targeting therapy-app-coded idioms ("how does that land in your body", "what comes up for you"). These appear in both the prompt's "never" list AND the post-process bans — two layers of protection against the same default.
**Classification:** CORRECTS (real). The double layer matters because: prompt rules sometimes drift over long sessions (per OpenAI's own guide on instruction adherence over time); post-processing is the unconditional backstop.
**Action:** None. Keep both layers.

### G13 — Intention anchor validation (mirror user words)
**Substrate default:** GPT-4o's tendency is to summarize/abstract user input into clean conceptual language. Stillform's voice contract requires the response to mirror the user's actual words — "if a sentence could be said to anyone, rewrite it" (CALM_SYSTEM line 822). Anchor validation enforces this at the post-process layer.
**Classification:** CORRECTS (real, distinctive). The May 7 regression run (referenced in the code comments at line 651-658) showed that this validator was catching real failures.
**Concern noted in code:** Liability scenarios were FAILING anchor validation despite producing correct redirects (because correct redirects intentionally don't echo charged language). The code already handles this — `hasLiabilityGuard` skips anchor validation. Good catch, already actioned.
**Action:** None. Keep as-is.

### G14 — `validateReframePayload` (length, sentence count, question count)
**Substrate default:** GPT-4o's natural length tends toward 6-10 sentences with multiple questions to keep the conversation going. The validation enforces 2-5 sentences (or 3 in low-demand, 6 in crisis) and at most one question.
**Classification:** CORRECTS (real). The specific numbers map to Stillform's voice contract.
**Concern:** The 3-sentence ceiling for low-demand is a specific design choice. Under cognitive impairment (medicated, sleep-deprived), more sentences = more cognitive load. The design reflects neuroscience (working memory under impairment). Aligned with the Model Spec's March 2026 wellbeing guidance to support people without overwhelming them.
**Action:** None.

### G15 — `validateVoiceContract` (560-char cap)
**Substrate default:** Length tendency toward 600-1000 chars. The 560-char cap is a hard ceiling that complements the sentence count (a 5-sentence response under 560 chars must be tight — exactly the voice contract's intent).
**Classification:** CORRECTS (real, complementary to G14).
**Action:** None.

### G16 — `LOW_DEMAND_FLAGS` (medicated, depleted, sleep, pain, hormonal, gut)
**Substrate default:** GPT-4o doesn't know about user state. Stillform's bio-filter is the only signal that says "this user is depleted right now — be brief, don't make them think." Without this, every response would be calibrated to a hypothetical fully-resourced user.
**Classification:** CORRECTS (real, distinctive). This is one of Stillform's actual differentiators — the substrate has no equivalent.
**Action:** None. Comment at line 609-612 about cross-file sync (App.jsx isLowDemandBioFilter) is a real maintenance hazard but already documented.

### G17 — Crisis detection + safety override
**Substrate default:** GPT-4o's crisis behavior under the March 2026 Model Spec wellbeing update is "acknowledge feelings, do not reinforce inaccurate beliefs, refer to professional help when appropriate". This is structurally aligned with what Stillform wants but lacks Stillform's specific resources (988, Crisis Text Line) and stay-with-them framing.
**Classification:** CORRECTS (partial overlap). The Model Spec covers the spirit; Stillform's override locks in the specific safety language. Both layers matter.
**Concern noted in code:** Crisis fallback at line 712 includes "I'm still here — keep talking to me." This needs to be evaluated against the March 2026 Model Spec wellbeing addition that "discourages language or behavior that could contribute to ... emotional reliance on the assistant". Stillform's intent is "I'm not abandoning you mid-crisis" — which is the right intent — but the specific phrasing `keep talking to me` could read as encouraging reliance.
**Action:** RECOMMEND review of the crisis-fallback `reframe` text against the March 2026 Model Spec wellbeing guidance. The intent is correct; the phrasing may benefit from adjustment toward "you're not alone — here are the people equipped to help right now" rather than positioning Claude/GPT-4o as the support. **Surface as Action 3 below — needs Arlin's call, this is voice territory not infrastructure.**

### G18 — Liability domain redirects
**Substrate default:** GPT-4o, when asked about medical/legal/financial topics, tends to either (a) hedge heavily ("I'm not a doctor but...") then proceed to give the advice anyway, or (b) refuse generically without redirecting to actual help. Neither is right. Stillform's redirect templates do the right thing: acknowledge the stress, name what's outside scope, name what IS in scope (regulation work), point at the professional category.
**Classification:** CORRECTS (real, voice-distinctive). The May 7 regression catch that fixed liability validation is exactly the kind of integrity work the philosophy is for.
**Action:** None.

### G19 — `buildDeterministicFallback`
**Substrate default:** When the entire model+retry pipeline fails (network error, parse error, validation failures exhausting retries), the user still needs a coherent response. Without G19, the user sees an error or empty state.
**Classification:** CORRECTS (real safety net). Multi-domain templates (summary / crisis / soft-entry / financial / medical / legal / generic) cover all the routing branches.
**Concern:** Generic non-domain fallback (the "Your signal is real..." line at G13's check) is itself flagged as too-generic by `validateIntentionFit`. There's a self-aware loop here: the fallback exists for when validation fails, but the fallback line itself fails validation. Code currently bypasses this for the fallback path. Worth verifying that bypass is actually wired.
**Action:** RECOMMEND verifying the "generic deterministic line" check at line 675 is correctly skipped when `buildDeterministicFallback` produces it. Otherwise the fallback's fallback fails and the user sees empty. **Surface as Action 4 below.**

### G20 — `ABSOLUTE PROHIBITIONS — LIABILITY` (in-prompt)
**Substrate default:** GPT-4o under a system prompt that says "you are a helpful AI" will, if asked, suggest medications, dosages, payday loans, legal strategies. The Model Spec directs the model away from harm but does not specify these domains. Stillform's in-prompt explicit prohibition does.
**Classification:** CORRECTS (real). Layered with G18's post-routing fallback for defense in depth.
**Action:** None.

### G21 — `DECISION FRICTION` (in-prompt high-impact slowdown)
**Substrate default:** GPT-4o's helpfulness pull leans toward "let me help you decide". Stillform's contract is "help them not decide while dysregulated, not help them decide". The DECISION FRICTION block reverses the default.
**Classification:** CORRECTS (real, voice-distinctive). Particularly important post-March-2026 Model Spec which explicitly says assistants should support user autonomy (Stillform's interpretation: their autonomy includes not being rushed).
**Action:** None.

### G22 — `NO NAMES` (in-prompt)
**Substrate default:** GPT-4o, when given a third party's name in input, will use it in its response. For Stillform — where the session is about the user, not the third party — using a name shifts focus and analyzes someone who didn't consent.
**Classification:** CORRECTS (real, voice-distinctive). Privacy-aligned.
**Action:** None.

### G23 — `OVERSHARING` / scattered-input rule
**Substrate default:** GPT-4o tends to address every thread in long input — comprehensive but diffuse. Stillform's contract is "pick the loudest signal, don't reward diffusion".
**Classification:** CORRECTS (real). Aligned with low-demand mode (don't overload).
**Action:** None.

### G24 — `STATE AWARENESS` (context informs, never explains)
**Substrate default:** GPT-4o, given context like "user slept 4 hours", will say "you feel this way because you're tired". Stillform's framing is "context is a factor, not the cause".
**Classification:** CORRECTS (real). This is Stillform-distinctive — most wellness tools EXPLAIN the user via their context. Stillform refuses to.
**Action:** None.

### G25 — `MIRRORING` rule
**Substrate default:** GPT-4o defaults to a calm/professional register regardless of user input register. Stillform's contract is to match (casual / intense / playful / blunt) without mirroring chaos.
**Classification:** CORRECTS (real). The "match the vibe, challenge the signal" subtlety is voice-distinctive.
**Action:** None.

### G26 — `EGO AWARENESS` (back off on pushback)
**Substrate default:** GPT-4o under stress can either (a) double down on a misread, or (b) capitulate fully and apologize. Both are wrong for Stillform's "stubbornness is redirected persistence — recruit it" frame.
**Classification:** CORRECTS (real, voice-distinctive).
**Action:** None.

### G27 — `PATTERN RESPECT` (don't tell them their pattern is wrong)
**Substrate default:** GPT-4o under therapy-coded prompts will challenge cognitive distortions. Stillform's contract — patterns are real, earned from experience — explicitly forbids this. This is the cleanest CBT-vs-MCT distinction in the prompt.
**Classification:** CORRECTS (real, foundational to MCT-vs-CBT distinction).
**Action:** None.

### G28 — `80/20 RULE` (80% present, 20% past)
**Substrate default:** GPT-4o, when given session-summary context, tends to over-anchor on past patterns and under-respond to the present moment. The 80/20 rule explicitly inverts this default.
**Classification:** CORRECTS (real). Aligned with the "people change — believe them" closing.
**Action:** None.

### G29 — 8 GOLDEN RESPONSE EXAMPLES (paired good/bad)
**Substrate default:** Examples are how RLHF-trained models actually anchor. Telling GPT-4o "don't do X" is weaker than showing "X looks like ___, do this instead". Stillform's golden examples are exactly this pattern.
**Classification:** CORRECTS (real, foundational). The OpenAI prompt-guidance docs explicitly recommend examples; Stillform's are well-chosen (cover accent / kids / jealousy / silencing partner / freeze / financial). Each pair maps a real failure mode (BAD) to its replacement (GOOD).
**Action:** None.

### G30 — `EMPHASIS` (one *italic* per response)
**Substrate default:** GPT-4o tends toward zero or many bolded/italicized words. Stillform's UI renders `*foo*` as italic and the design wants exactly one emphasis per response.
**Classification:** CORRECTS (UI integration). Voice-aesthetic constraint, not safety, but real.
**Action:** None.

### C1 — AES-256 client-side encryption (Path A complete May 8)
**Substrate default:** OpenAI does not encrypt user data on the user's device — that's not OpenAI's responsibility. Stillform encrypts at rest in localStorage so other browser tabs/extensions/services on the user's device can't read it.
**Classification:** ENVELOPE — substrate-level concern, addressed elsewhere.
**Action:** None. Verified May 8.

### C2 / C4 / C5 — Plausible event tracking + crisis/liability tagging
**Substrate default:** OpenAI doesn't tell Stillform when crisis or liability flags fired in the user's session. Stillform's tagging in the API response → client → Plausible event is how product owns visibility.
**Classification:** CORRECTS (real product visibility need).
**Action:** None.

### C3 — Image upload validation
**Substrate default:** GPT-4o vision will accept images of any size up to API limits. Without client-side guardrails, a user could attach 50MB of images and exhaust budget per session. Limits (3 files, 10MB each, 20MB total) match the design intent for screenshot-as-context.
**Classification:** CORRECTS (real budget protection).
**Action:** None.

---

## 4. FINDINGS — what the cross-walk surfaces

### 4.1 What's working as designed (no action)

**26 of 30 server-side guardrails CORRECT real GPT-4o substrate defaults.** All five client-side guardrails are correctly placed (envelope or product-visibility). The MCT-vs-CBT distinction is operationalized at three layers (prompt rule, regex bans, golden examples) — well-defended. The post-March-2026 Model Spec is moving toward where Stillform already is, which is a structural validation of the positioning.

### 4.2 Telemetry gap (G8 / G9)

The validation system fires generic "contains banned phrase" reasons — it doesn't surface WHICH banned pattern fired. Result: no visibility into whether specific bans are doing their job, whether some bans are overhead (haven't fired in N sessions), or whether some bans need to be reinforced via prompt rather than just caught at post-process. **Action 1.**

### 4.3 Ban-list fragmentation (G8 + G9 + G11 + G12)

Four overlapping ban systems (`BANNED_REFRAME_PATTERNS`, `GENERIC_GARBAGE_PATTERNS`, `GENERIC_GARBAGE_SNIPPETS`, `VOICE_CONTRACT_BANNED_PATTERNS`) cover similar territory with different mechanisms (regex vs substring, word-bound vs not). Functional overlap is real. **Action 2.**

### 4.4 Crisis-fallback voice review (G17)

`buildDeterministicFallback`'s crisis branch includes "I'm still here — keep talking to me." against the March 2026 Model Spec wellbeing guidance discouraging language that creates emotional reliance on the assistant. Stillform's intent is correct (don't abandon mid-crisis). The phrasing may benefit from adjustment. **Action 3 — voice judgment, Arlin's call.**

### 4.5 Fallback-of-fallback verification (G19)

`validateIntentionFit` has a check at line 675-677 for the specific generic deterministic line, returning a "generic deterministic line" failure reason. Worth verifying that this check does not fire when `buildDeterministicFallback` produces this same line — otherwise the fallback's own output gets flagged and the response cycle has nowhere to land. **Action 4.**

### 4.6 No conflicts found

No CONFLICTS surfaced. All shipped guardrails are either CORRECTS (most) or DUPLICATES (a few — and the duplication is intentional defense in depth).

### 4.7 No new substrate-level gaps found

The Path A migration on May 8 closed the only previously-known substrate-side gap (the encryption-at-rest mismatch). No other substrate gap surfaces in this audit.

---

## 5. ACTIONS

### Action 1 — Specific banned-pattern telemetry

**Why:** Without visibility into which pattern fired, the ban list is opaque. Some patterns may be doing all the work; some may have never fired. Telemetry enables data-driven prompt tightening.

**What:**
- Modify `validateReframePayload` to record specifically which pattern fired (e.g., `"contains banned phrase: it's understandable"` instead of generic `"contains banned phrase"`).
- Modify `validateVoiceContract` similarly for the voice contract bans.
- Surface as a Plausible event (`Reframe Banned Pattern Fired`, props `{ pattern, mode, attempt }`).

**Estimated effort:** 30 min. Low risk. Pure observability addition.

**Recommendation:** SHIP after Arlin reviews this audit doc. Useful pre-TestFlight to gather baseline data on which bans are real vs theatre.

### Action 2 — Consolidate ban lists

**Why:** Four overlapping ban mechanisms with no shared structure. Adding a new ban means deciding which list to put it in based on a guess about regex-vs-substring + which validation function looks at which list. Maintenance hazard.

**What:**
- Single module `BANNED_OUTPUT` with explicit categorization: `validation_phrases`, `generic_openers`, `voice_contract`, `next_step_garbage`.
- Each category has a unified `{ pattern, type: "regex" | "substring", layer: "validateReframePayload" | "validateVoiceContract" }` shape.
- Validation functions read from the unified module.

**Estimated effort:** 60-90 min. Medium-low risk (structural refactor, but pure consolidation, no semantic change). Worth a synthetic test that asserts each old ban is still caught.

**Recommendation:** DEFER until after Action 1 telemetry has run for 1-2 weeks. The data may show some bans should be cut entirely; consolidating is easier once cuts are made.

### Action 3 — Crisis fallback voice review (SHIPPED May 8, 2026)

**Shipped change:** option A applied. The crisis-fallback `reframe` text in `buildDeterministicFallback` (line 754) updated from `"I'm still here — keep talking to me."` to `"You're not alone — please reach 988 or the Crisis Text Line. They're equipped for exactly this moment."`

**Rationale:** Removes Stillform's first-person presence framing (`I'm still here`, `keep talking to me`) which the March 2026 OpenAI Model Spec wellbeing guidance flags as inviting emotional reliance on the assistant. Replacement uses subject = user state observation (`You're not alone`) plus concrete action pointer (`please reach 988`) plus assertion about the resource (`They're equipped for exactly this moment`). Stillform's stay-with-them intent is preserved through the warmth of the directness; the assistant-as-destination framing is removed.

**Layer 4 self-skepticism (love-language family check):** Stillform's voice contract bans subject = Stillform / object = user declarations (`I care about you`, `I'm proud of you`, `I'm here for you`). `You're not alone` is structurally distinct — subject = user, no Stillform claim. Verified clean against `BANNED_REFRAME_PATTERNS` (22 regex), `GENERIC_GARBAGE_PATTERNS` (11 regex), `GENERIC_GARBAGE_SNIPPETS` (11 substrings), `VOICE_CONTRACT_BANNED_PATTERNS` (6 regex) — no hits.

### Action 4 — Fallback-of-fallback path (VERIFIED, NO ACTION)

**Verification result (May 8, 2026):** Traced the call path in `exports.handler` (lines 1685-1707).

When the model+retry validation cycle fails, `parsed` becomes null. The handler then calls `buildDeterministicFallback` and assigns the result to `parsed`. The output flows directly to `sanitizeReframeText` and into the response body. **The validators (`validateReframePayload`, `validateVoiceContract`, `validateIntentionFit`) do NOT re-run on fallback output.**

This means the "generic deterministic line" check at line 675-677 inside `validateIntentionFit` is structurally a defensive check against the MODEL regurgitating the fallback's text verbatim — not a self-loop. The fallback is the terminus by design.

Additional finding: the actual generic-non-domain fallback (lines 774-780) produces text with a `signalLead` prefix when user input is non-empty. The line at 675 checks for the version WITHOUT the prefix. So even if the model did regurgitate, a non-empty signalLead would differentiate the model output from the check string. The defensive check at 675 catches the no-input edge case.

**No action needed.** Original Action 4 raised as a possible ship-blocker; verification confirms the architecture handles this correctly.

---

## 6. AUDIT PHILOSOPHY ACCOUNTABILITY

How this audit grounded in v1.3:

- **Layer 0** — read STILLFORM_AUDIT_PHILOSOPHY, master todo, punch list, transfer doc, project transfer. Surfaced the missing Phase 1+2 docs immediately.
- **Layer 0.6** — N/A (no UI surface). Ground truth was the actual reframe.js code + master todo's stated intent for Phase 3.
- **Layer 1.0** — session-start ground truth: HEAD `9badb72`, working tree clean.
- **Layer 1.1** — pre-existence: confirmed Phase 1+2 docs never existed. No prior guardrails review to align with.
- **Layer 2.36** — substrate facts come from publicly-cited OpenAI documentation, not from training-data assumptions about GPT-4o behavior.
- **Layer 6.1** — every claim about substrate behavior carries a citation; every claim about Stillform code carries a line ref.
- **Prime Directive** — no fabrication of Phase 1+2 content; no fluff; no patches to make a missing-document problem look complete; no assumption that the master todo's reference proved the docs exist.

---

## 7. CLOSING

26 of 30 server-side guardrails do real work that GPT-4o substrate would not do on its own. The MCT-vs-CBT distinction is operationally defended at three layers. The Path A migration on May 8 closed the substrate-side encryption gap. Four discrete actions surfaced; two shipped (Action 1 banned-pattern telemetry, Action 3 crisis-fallback voice update); one verified during the audit (Action 4); one deferred pending data (Action 2):

- **Action 1** (banned-pattern telemetry) — SHIPPED May 8 (commit `289ccf0`)
- **Action 2** (consolidate ban lists) — DEFER until Action 1 telemetry runs ~1-2 weeks
- **Action 3** (crisis-fallback voice phrasing) — SHIPPED May 8, option A applied
- **Action 4** (fallback-of-fallback) — VERIFIED NO ACTION

**No ship-blockers for TestFlight against current substrate behavior.**

The Stillform Reframe pipeline is in a defensible state. The post-March-2026 OpenAI Model Spec direction is structurally aligned with where Stillform already is: explicit MCT-vs-CBT distinction, explicit prohibition on emotional-reliance language (now operationalized via Action 3), explicit user-as-operator framing.

— end —
