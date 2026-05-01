# STILLFORM MASTER TODO
**ARA Embers LLC · April 28, 2026**

---

## Design Lens (apply to every feature decision)

Stillform is a metacognition tool. Helping people understand their own processes is the mechanism. Composure is the outcome. Every feature serves one of four pillars:

1. **Metacognition** (the mechanism) — does this help the user see their own process?
2. **Emotional awareness** (the input) — does this sharpen interoception, affect labeling, or granularity?
3. **Microbiases** (the outward gaze) — does this support seeing others accurately, *after* self-awareness is steady?
4. **Neuroplasticity** (the glue) — does this compound across sessions, or does it reset?

A feature that doesn't clearly serve one of these is dressing. Push back when it shows up.

---

## 🌟 NEW TOP PRIORITY (Added April 30, 2026 evening) — Cognitive Function Measurement

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

## 🌟 ENGAGEMENT CRAFT — Research Foundation (Added April 30, 2026 evening)

**Spec drafted Apr 30 — see Stillform_Science_Sheet.md "Engagement Principles" section.**

After three rounds of consultation produced surface fixes and architectural overcorrections, Arlin diagnosed the actual gap as engagement craft — not architecture. After acknowledging that diagnosis, she pushed further: "data/research that helps with user engagement outside of neuroscience" and "human behavior in app data proven research."

The science sheet now contains a parallel Engagement Principles section that grounds Stillform's engagement craft in 10 citation-grounded behavioral science principles — Fogg's Behavior Model, Wood & Rünger habit research, Self-Determination Theory, Kahneman System 1/2, Ariely defaults, Eyal variable reward, Gollwitzer implementation intentions, ultradian rhythm, Norman affordance perception, Pielot/Mehrotra/Harris attention-respectful design.

**Why this matters for the award case:** Stillform's claims are grounded in two parallel research traditions — neuroscience for what the practice does inside the brain, and behavioral science for what the practice does in the user's life. Stronger case than either alone. Most products skip one or the other. Stillform sits in the intersection.

**Operating rule going forward:** every feature in Stillform should be grounded in at least one Pillar (neuroscience) AND at least one Principle (behavioral science). Missing one or the other is the gap engagement craft is designed to close.

**Open engagement craft items spec'd or pending:**

### ✅ Closing language reconsideration — RESOLVED Apr 30 (NOT shipping)
After Round 2 consultation found 4 AIs converged on "closing language frames as outcome not rehearsal," CLOSING_LANGUAGE_CANDIDATES.md was drafted with three voice options across 7 close screens. Arlin's pushback: "the current language has a science behind it too" and "feels more prestige and less putting words into someone's mouth." 

Captured in Science Sheet new section "System Observation + User Override (Architectural Conditioning Pattern)" — the current language ("Composure restored," "Signal cleared," "STATE SHIFT +2 · FUNCTIONAL") is precise observation paired with explicit override pathways ("I don't feel regulated yet" button). Together they train interoceptive accuracy via supervised-learning-like pattern: system makes prediction, user accepts or corrects, both directions improve over time. Round 2 AIs read words in isolation without seeing override architecture; they were wrong. **Closing language stays as-is.**

### ⏳ Kinesthetic close interaction (engagement craft) — IN DESIGN
Arlin chose Reading 3 from the close redesign options: kinesthetic / tactile interaction at session close. Engagement craft as design frame, not neuroscience. Replaces the 5-screen text-and-button sequence at session close with a single tactile moment — most likely single tap on slow-pulsing point or long-press to seal. Grounded in Engagement Principles 4 (Kahneman System 1/2 — match interaction style to user state) and 9 (Norman affordance perception). Spec to draft next session.

### ⏳ Self Mode is not where it could be (flagged May 1, 2026)
Self Mode is the differentiated tool — it's the trainable solo metacognitive practice (Notice/Name/Recognize/Perspective/Choose) that ideally makes Reframe less necessary over time. But it's named generically ("Self Mode" reads as anonymous), it's described in ways that previously overlapped with Reframe (now improved with the "How you train the move you make alone" sub-label, but the broader work remains), and the 5-step structure could be more visible/honored as the explicit muscle being trained.

What's not right yet:
- The name itself is generic and doesn't signal what the practice is
- The 5 steps are present but not visually weighted as the architecture they are (compared to Reframe's chat which is unmistakably "what this is")
- The relationship between Self Mode and Reframe (Self Mode = solo training; Reframe = with-partner work in real time) isn't legible to a user encountering both
- Nothing in the product surfaces the user's growing capacity at the 5 steps over time — it's the trainable thing but the training isn't measured (the Cognitive Function Measurement moonshot would address this)

Not for now — Arlin flagged this as ongoing work to come back to. Future session task: redesign Self Mode's framing, naming, and visual treatment so it stands as the differentiated practice it is.

### ✅ ToolDebriefGate friction reduction — SHIPPED Apr 30 (commit 51493cce)
The 20-second forced wait dropped. Continue enables on selection alone. Copy softened from "20-second capture required before exit" to "Take a moment to name what you used." Skip button added in footer (same skip pattern as What Shifted and Next Move). All three completeDebriefGate functions (Breathe / Body Scan / Reframe) updated to capture `skipped:boolean` on stored debrief record + new Plausible event "Tool Debrief Completed" with tool + skipped props for cohort visibility into engagement-vs-skip rates per tool.

What stayed: header copy, three preset options + "I need another pass to lock this in" fourth option, Continue as primary CTA, tool-specific and regulation-type-specific options (Pillar 1 metacognition load-bearing science).

This was the small focused engagement craft change that addresses Round 2 consultation finding ("close feels heavy") without committing to the full kinesthetic close redesign. The kinesthetic close spec is still next session.

### ⏳ Plain-language neuroscience as recurring surface — NOT YET SPEC'D
Second engagement mechanic Arlin flagged interest in alongside Cognitive Function Measurement. Wikipedia Random Article principle with Stillform's existing science as corpus. User encounters one specific finding from neuroscience or affective research, translated to plain language, with a one-line tie to what they're doing in Stillform. Converts science from "things in a sheet I'd never open" to moments of recognition. Aesop / Criterion lineage.

### ⏳ Asynchronous metacognitive close — REFRAMED as kinesthetic close
Round 3 finding from Gemini and Copilot flagged the close as too synchronous. After Arlin's pushback that ambient mode contradicts "less you need the app, the more it's working," this reframed as the kinesthetic close above. Same gap addressed; different solution.

### ⏳ Surface refinements (small, anytime)
- Sub-labels under tools ("Train how you talk to yourself under load") — CoPilot Round 2
- Plainspoken inclusive home copy ("Composure, built for people who carry a lot") — CoPilot Round 2
- Body Scan verb-form authorship ("I'm staying here" not "hold for 30 seconds") — Claude Round 2
- Cormorant aesthetic question (demote to ceremonial moments?) — Claude Round 2 — possibly resolved by Apr 30 prestige refresh; needs phone-test
- Composure self-mastery legibility doc commit — sitting in /mnt/user-data/outputs, conceptual decision already made

### ❌ Round 4 consultation prompt — DRAFTED but Arlin's read: track exhausted
STILLFORM_ROUND_4_CONSULTATION.md committed but never sent. The diagnosis came from Arlin, not from another consultation.

### ❌ Body-first pre-rate friction fix — RETRACTED
BODY_FIRST_PRE_RATE_FIX_SPEC.md drafted then retracted Apr 30 after Arlin caught Claude not checking master todo first. Master todo line 321 already had "Body-first metacognition access gap — VERIFIED ALREADY IMPLEMENTED Apr 27" with explicit note: "Going forward: read the existing flow before claiming a gap." Master todo line 361 already had "Pre-rate flow needed science-grounded redesign — RESOLVED via commit ae43f4db" (chip rows removed per Nook 2021). The 1-5 numeric pre-rate that remains is the minimal residual measurement that drives shift delta tracking and three-category data feed. Not a science violation. Spec retracted with full retraction notice.

---

## 🚨 ARCHITECTURAL — Decide Before TestFlight

### Body-first metacognition access gap
**The problem:** Body-first calibration currently routes the hero CTA into Breathe by default. Body work is the entry, Reframe is a follow-on. But Stillform is a metacognition tool that architects composure — composure requires both somatic regulation AND metacognition. A body-first user whose state is already regulated (no body tension, no off-baseline) and who needs to think something through has no direct path to Reframe — they're forced through Breathe first.

The dead-code Stuck routing at `App.jsx:12199` was the planned bridge (body-first + Stuck chip → Reframe clarity), but it's broken because:
1. `feelState` is declared inside each tool component, not at App level — the check at line 12199 always evaluates `undefined === "stuck"` → false
2. Even if the scope were fixed, the Stuck chip currently only exists *inside* Reframe, so a user on home has no way to set it before tapping the hero CTA — chicken-and-egg

**Three options to decide between:**
- **(a)** Secondary CTA on body-first home: a small "Just need to think this through →" link below the main Breathe CTA, routes directly to Reframe calm
- **(b)** Add chip row to home screen so users self-select state before tool entry. Stuck routes to Reframe, others route to default
- **(c)** Make hero CTA conditional: if bio-filter is "clear" (body baseline) AND user taps an "I want to process" affordance, route to Reframe; otherwise Breathe

This needs a design decision from Arlin. All three are defensible. Option (a) is the smallest surgical change. Option (b) is the most data-rich. Option (c) is the most automatic.

---

## ⚠️ PRELAUNCH — Whole-app prestige refresh (Added April 30, 2026)

**Spec drafted Apr 30 — see `STILLFORM_DESIGN_SYSTEM.md` in repo root.**

Arlin's diagnosis: "It looks like a 32-bit NES platform. Whole app needs to be prestige." Refresh authorized as prelaunch work. Visual language synthesized from 5 AI reference passes converging on editorial luxury family (Aesop + MUBI + Cartier + Linear, not wellness apps). Spec covers calibrated palette, type scale, spacing rhythm, motion tokens, component vocabulary, implementation order. Ships with existing free font triad — no paid fonts required.

This work blocks visible execution of Self Mode redesign and My Progress redesign (both already specced — `SELF_MODE_FOUR_WAY_SYNTHESIS.md` and `MY_PROGRESS_REDESIGN_SPEC.md`). Both redesigns are designed against the new system, not the current one. Build the design system first, then the redesigns land into it cleanly.

Implementation order in spec: CSS variables → typography → components → screens (Home → Reframe entry → Self Mode → My Progress → Body Scan → Breathe → Pulse → Settings → FAQ). Each screen verified on phone debug before next.

---

## ⚠️ PRELAUNCH — Added April 29, 2026

### 🔒 SECURITY-CRITICAL — Encrypt all sensitive on-device localStorage

**Status:** Currently only Reframe AI conversations are AES-GCM encrypted on-device (uses `secureSet`/`secureGet` infrastructure with IndexedDB fallback). All other sensitive user data is stored as plain JSON in localStorage and is readable by any code running on stillformapp.com, browser extensions, or anyone with device access.

**Unencrypted on-device today (must be encrypted before launch):**
- `stillform_sessions` — session history
- `stillform_journal` — Pulse / Signal Log entries (free-text emotional content)
- `stillform_signal_profile` — body signal mapping
- `stillform_bias_profile` — cognitive distortion profile
- `stillform_checkin_history` — morning check-ins
- `stillform_eod_history` — end of day entries
- `stillform_communication_events`, `stillform_tool_debriefs`, `stillform_focus_check_history`
- `stillform_feelstate` (added Apr 29 for chip persistence) — sensitive, not encrypted yet
- All settings, preferences, regulation type, biometric flags

**Already protected:**
- Cloud sync to Supabase: AES-GCM encrypted before upload (in place since cloud sync deploy)
- Reframe AI conversations on-device: encrypted via `secureSet`

**The fix:** Extend existing `secureSet`/`secureGet` infrastructure to wrap all sensitive keys. Not a from-scratch crypto build — same AES-GCM pattern, same key management (per-device key in IndexedDB). Real engineering work but no new primitives needed.

**Why this is launch-critical (not deferrable):** A prestige composure architecture cannot ship with users' raw emotional content sitting in plain text on their device. The cloud is protected; the device is partially protected. The gap closes before launch.

### ✅ What Shifted data feed — three-category positive selection framework — RESOLVED Apr 30

**Shipped Apr 30** (commit 890469aa, combined with Body Scan What Shifted).

Russell circumplex three-category classifier implemented (Russell 1980 J.Pers.Soc.Psychol. 39:1161-1178, confirmed Watson 2024). Pure function `classifyShiftDirection(preState, postState, sessionContext)` returns Category A (regulated shift), Category B (persistent state), Category C (concerning shift), or null with reason. Schema versioned at v1 — never recompute existing entries.

**Architecture:**
- SHIFT_CHIP_QUADRANTS maps all 9 chips to Russell quadrants (HAP/LAP/HAN/LAN/cognitive/undifferentiated)
- Pattern-context helper (`getRecentSustainedPatterns`) computes sustained Flat ≥5 / sustained HAN ≥5 in 14-day window
- Storage key `stillform_shift_events`, capped at 2000 entries
- buildShiftEvent helper assembles full event with bioFilter, sessionCount, regulationType frozen at write-time

**Wired into:**
- Reframe finishStateToStatement — classifier runs on State-to-Statement complete + skip paths
- Body Scan What Shifted — handleWhatShiftedLockIn + handleWhatShiftedSkip
- Plausible "Shift Classified" event with 4 props (category, subcategory, tool, mode) — zero user identifiers, zero chip values, zero free text

**Privacy architecture preserved:** Aggregate-anonymous → Plausible (Stillform sees percentages across users); per-user encrypted on-device → My Progress (Stillform never sees individual data).

Spec at THREE_CATEGORY_DATA_FEED_SPEC.md (committed to repo root). My Progress visual integration ships in My Progress redesign (deferred — needs real categorized data accumulation post-publish).


### ✅ Body Scan post-completion What Shifted moment — RESOLVED Apr 30

**Shipped Apr 30** (commit 890469aa, combined with three-category data feed).

What Shifted screen added to BodyScanTool. After 6-point sequence completes, "Signal cleared" → 2s pause → What Shifted screen (post-state chip picker + collapsed-by-default optional free-text label + Lock it in / Skip buttons). Russell-grouped chip ordering. Pre-state shown as "Started: X" for orientation. Lock-In disabled until post-state selected. After lock-in or skip, queueDebriefAndCompleteNow runs the existing ToolDebriefGate. Closes Pillar 1 metacognitive gap.

State additions: showWhatShifted, postStateChip, shiftLabel, shiftLabelExpanded, shiftSkipReason. Handlers: handleWhatShiftedLockIn / handleWhatShiftedSkip. Pre-push audit caught wrong-tool placement bug (handlers initially placed in BreatheGroundTool scope) — fixed before push.

Spec at BODY_SCAN_WHAT_SHIFTED_SPEC.md (committed to repo root).

### ✅ Add "Settled" chip — low-arousal positive — RESOLVED Apr 30

**Shipped Apr 30** (commits 768b56ed in App.jsx + ad4a43f1 in reframe.js).

Settled added as 9th chip. Russell-circumplex-grouped chip ordering implemented at all chip render sites: Excited · Focused · Settled · Anxious · Angry · Stuck · Mixed · Flat · Distant. AI prompt branch added in reframe.js feelMap for maintain-state framing (no regulate-down posture, surface patterns more freely, no Self Mode nudge, no protective suppression). Chip definition copy committed via CHIP_DEFINITIONS_DRAFT.md (Arlin approved).

**Why this mattered for the data feed:** Without a low-arousal positive chip, Category A (regulated shift) was impossible to detect when users actually arrived at the regulated state. With Settled live, the three-category framework works end-to-end.

Spec at SETTLED_CHIP_SPEC.md (committed to repo root).

### ✅ Chip ⓘ button — define what each chip covers — RESOLVED Apr 30

**Shipped Apr 30:** CHIP_DEFINITIONS registry added to App.jsx as top-level constant. ⓘ buttons wired at all 3 chip render sites (Body Scan What Shifted, showPostRating, PresentStateChips). Per CHIP_DEFINITIONS_DRAFT.md (Arlin approved Apr 30 after copy review).

Each chip definition is ~40-60 words, anchored to reframe.js feelMap voice but rewritten for user-facing context — no clinical jargon, no pathologizing, body and mind both named, tells user what selecting the chip does in the system. Tapping ⓘ opens existing setInfoModal pattern (same modal already used for bio-filter ⓘ, Lock-in ⓘ, etc).

ARIA labels added on every ⓘ button — addresses part of the prelaunch ARIA sweep item below.

**Why this matters for the data feed:** If users interpret the same chip differently, the data is noisy at the source. Definitions reduce that noise without forcing users into rigid categories.

### Category C gentle nudge — referral to existing crisis resources

When a user trends toward Category C across multiple sessions (sustained Flat, persistent high-arousal negative without shift, or any session resulting in Distant), Stillform should surface a gentle nudge toward the existing Crisis Resources screen.

**Honest acknowledgment of evidence base (locked Apr 29):** The literature on app-based escalation prompts ("you've been struggling — here are resources") is **thin, not contested.** Studies haven't been done at scale for this specific intervention type. So when we build the nudge, we're making a clinical-judgment call without strong empirical guidance. We acknowledge that explicitly rather than hide behind ambiguous "contested research" framing.

**The defensible move:** Refer users to the existing Crisis Resources screen (which is real, vetted, professional infrastructure — 988, Crisis Text Line) rather than invent new escalation logic. Stillform is not a clinical replacement. Users who need medication, therapy, or professional support need those things. Stillform's job is to be honest about its own scope and route appropriately.

**Framing principle (Arlin's words, captured for future sessions):** "If they need to be medicated, that's on them. The app isn't a substitute for clinical care." This isn't dismissive — it's the correct scope statement. A user with clinical depression that requires medication is not a Stillform failure. A user who could be helped by Stillform but the tool didn't reach them is a separate signal worth understanding from the data feed.

### Reframe tone — auto-detect + in-Reframe dropdown + personalization default

Full prestige design. Replace the current Settings-only static tone with a three-layer system.

**Layer 1: Auto-detect from state and content.** Use bio-filter, feelState, and input characteristics to suggest a tone for each Reframe call. Rules to design (start point):
- bio-filter depleted/pain/sleep → suggest Gentle
- feelState excited or focused → suggest Direct or Motivational
- input pattern is long technical/analytical → suggest Clinical
- input shows distress + high emotional charge → suggest Gentle
- otherwise → Balanced

**Layer 2: In-Reframe dropdown.** Replace the current static "Reframe tone: DIRECT" label box (currently line ~6578) with a dropdown the user can change mid-conversation. Each dropdown option shows the actual prompt-level effect (sourced from netlify/functions/reframe.js toneMap, lines 1173-1179):
- Balanced — Default Stillform voice; direct, warm, precise
- Gentle — Softer edges, still specific and honest. No sharp phrasing
- Direct — Concise, minimal cushioning, cuts to signal
- Clinical — Structured, analytical, avoids jargon overload
- Motivational — Forward energy, momentum language, no hype clichés

The dropdown should also surface the *reason* for the auto-selection ("Gentle — because you marked depleted"), making it a metacognitive surface (Pillar 1).

**Layer 3: Personalization default in Settings.** User can set a "default tone" preference. Decision needed: Override mode (user's default always wins) vs Fallback mode (auto-detect wins; default is fallback when signals are ambiguous). Recommendation: Override — Stillform doesn't presume to know better than the user. Final call is Arlin's.

**Why this matters.** Current tone is a Settings-only static choice. Most users won't dig into Settings during distress. Auto-detect surfaces the appropriate tone in the moment; in-Reframe dropdown gives full control without breaking flow; personalization respects the user who knows what they want.

**Status.** Captured Apr 29. Real feature build. ErrorBoundary-blocked for shipping; design and copy ready.

### "Get ready" Reframe mode label needs context

Currently line 14242 in App.jsx, `hype: "◌ Get ready"`. The label appears in the upper-right of Reframe screen when feelState is `excited` or `focused`. Without context, a user who has never used hype mode reads "Get ready" as ambiguous — get ready for what?

Options to evaluate (Arlin's call, not Claude's): rename for clarity ("Lock in", "Get focused", "Sharpen"), add a one-line description below the label, add an info button next to the label, or hide the label and let the AI's behavior carry the mode. Captured for Arlin to decide. Not Claude's call.

### FAQ enhancements — chips + search + email link + collapse-by-question + feel chip entry

Add to FAQ page:
- Small chips at the top as hyperlinks for all the questions answered (jump-to-section navigation)
- Search bar below the chips for filtering questions
- "Can't find what you're looking for" email link at the end (mailto to ARAembersllc@proton.me)
- **Collapse FAQ entries by question (added Apr 29):** Each Q is collapsed by default; tapping the question expands the answer. Reduces scroll fatigue, makes the FAQ usable as a reference, and lets the chip-jump navigation actually land cleanly on a target question.
- **Add FAQ entry "How do the feel chips work?" (added Apr 29):** Comprehensive entry grounded in published mechanism. Covers: (1) affect labeling regulation effect (Lieberman 2007), (2) state-matched routing — Distant→Body Scan, calm/clarity/hype mode bias, (3) auto-log to Signal Log + bio-filter pairing, (4) pre/post tracking and longitudinal pattern, (5) persistence across the day until What Shifted or next morning check-in, (6) protective behaviors at high activation (Ghost Echo suppression, Self Mode nudge for angry/anxious/mixed states), (7) granularity over time (Barrett 2001 family). Replaces the upper-right Reframe mode label that was removed Apr 29. Draft text in `/mnt/user-data/outputs/FAQ_DRAFTS.md`.
- **What each chip means** lives on the chips themselves via ⓘ button (separate item below), not in the FAQ. Definitions belong at point-of-selection where the user actually needs them, not buried in a help section.

Real prelaunch UX win for self-service support. ErrorBoundary-blocked for shipping.

### ✅ Reframe title doesn't reflect mode — RESOLVED Apr 30

**Investigation finding:** the bug as described in the original master todo entry doesn't exist in the codebase. Audit found that `modeConfig.title` and `modeConfig.subtitle` were defined but NEVER referenced anywhere in the rendering. The only 'Talk it out' the user sees is the home page CTA at App.jsx line 13977, which is already conditional based on regulation type (`isThoughtFirst ? 'Talk it out' : isBodyFirst ? 'Calm my body' : 'Start here'`). Inside Reframe, mode identity is carried by the icon glyph (◎ calm / ✦ clarity / ◌ hype) plus AI prompt behavior — not by any title field.

The original Apr 29 bug report likely captured a state that existed before the Reframe entry redesign work landed; the fix happened as part of that redesign without this todo being updated.

**Resolution Apr 30:** removed the dead `title` and `subtitle` fields from modeConfig (6 dead lines across calm/clarity/hype entries). No user-facing change. App.jsx commit removes dead code only.

### Self Mode needs work

Specific issues TBD by Arlin. Needs in-app exploration to identify what's missing or broken. Self Mode is the explicit MCT 5-step practice (Notice, Name, Recognize, Perspective, Choose) — Pillar 1 anchor feature. Captured Apr 29.

### My Progress redesign

**Spec drafted Apr 30 — see `MY_PROGRESS_REDESIGN_SPEC.md` in repo root.**

Arlin's diagnosis: data heavy with redundancy. Heavy compute should run backend/PDF for deeper analysis; live screen should surface trends and patterns only. Eight sections collapse to four (headline pattern, compounding view, patterns and intelligence, archive and export). Earns Pillar 4 neuroplasticity claim by surfacing the science behind each pattern (Lieberman 2007, Wood & Rünger 2016, Schultz 1998, Lehrer 2020, Brewer 2011, Meichenbaum 1985, Wells 2009). Privacy architecture preserved — on-device only, Stillform never sees individual user data.

Visual treatment held until whole-app design system locks (whole-app prestige refresh authorized Apr 30). Some redundancy may resolve naturally during the design system pass; new patterns may emerge. Build the spec into the new design system rather than the current one.

### ✅ "Composure is a practice. You're building it." copy is corny — RESOLVED Apr 30

Replace with a less-precious version. Captured Apr 29.
**RESOLVED Apr 30:** replaced with "Composure is the foundation. You are its architect." Foundation/architect frame is precise to what Stillform actually is — composure is the outcome (the foundation that gets built), user is the architect (active agent), Stillform is the architecture/practice through which it's built. Per Science Sheet line 11: composure is outcome, metacognition is mechanism. Committed to App.jsx line 16032.

### Processing primer threshold tunable (currently 5 sessions)

Decay logic ships at session > 5 (App.jsx ~line 14257). If 5 is too long after live testing, threshold is one number to change. Captured Apr 29 for revisit after real user data.

---

## ⚠️ PRELAUNCH — Added April 28, 2026

### ⚠️ Low-demand mode (anyone with impaired cognition) — Phase 1 SHIPPED Apr 30

**Phase 1 (Breathe) shipped Apr 30** (commit 81e2c0b7). Decision-locked architecture: low-demand is a state-of-existing-tool, not a separate tool. Triggered by `bioFilter.includes("medicated")`. No home-screen entry — activates within existing flow when bio-filter signals it.

**Phase 1 changes:**
- isLowDemand derived state at top of BreatheGroundTool
- Phase init bypass: phase=='breathe' on entry (skips pre-rate, skips bio-filter screen)
- Audio force-enabled in low-demand (overrides user's saved setting). Per the science: paced auditory cueing is mechanism for cognitively-compromised users (Balban 2023, Ochsner & Gross 2005), not preference. Audio infrastructure was already built — this commit gates it on for the cohort that needs it.
- Three-rounds-done screen replaced with low-demand minimal-completion render: pulse circle + "Tap anywhere to close" label. Bypasses three-button decision.
- Tap-anywhere-to-exit with 1.5s grace period (lowDemandGraceOverRef prevents entry-tap from immediately dismissing).
- Debrief gate + Next Move screen bypassed entirely. Direct call to onComplete(undefined). No metacognitive demand on a cognitively-impaired user.
- Session still auto-saves with source='low-demand-complete' for record integrity.

**Phase 2 (Body Scan) — IN-FLIGHT, paused.** Architectural decision pending Arlin's call (4 options surfaced via ask_user_input_v0 widget; user dismissed without selecting; awaiting decision when user returns to it).

**Phase 3 (Reframe) — NOT STARTED.** Most complex of the three because AI behavior changes too (shorter sentences, simpler language, no questions demanding reasoning), not just UI stripping. ~100-150 lines across App.jsx + reframe.js. Spec needed before build.

---

ORIGINAL ENTRY (preserved for context — Phase 1 closes some of this; Phases 2+3 still address the rest):



Single-tap entry from home screen and from Medicated bio-filter chip. Stripped-down experience: ambient pulse + paced breath visual + optional audio. No inputs, no decisions, no chips, no reading required. Exit on tap.

**Who it serves:** Anyone whose cognition is partly offline. Medicated bio-filter users (broad scope: SSRI, post-anesthesia, sleep aids, chemo, recreational), post-panic users still cognitively rattled, sleep-deprived parents at 3am, migraine sufferers, dissociative episodes from trauma, sensory overload, anyone coming down from any altered state.

**Why we designed for the broad population, not k-hole users specifically (decision rationale).** It would be possible to design low-demand mode primarily around k-hole users — Arlin's founder context, the specific cognitive-impairment profile of dissociative anesthetics, the integration window literature. We deliberately chose not to. Three reasons. (1) Most Medicated chip selections are not k-hole users. They're someone on an SSRI, someone post-dental anesthesia, someone who took a sleep aid, someone on chemo, someone with a migraine, a sleep-deprived parent. Overfitting the mode to k-hole users would underserve the actual majority. (2) The clinical/regulatory boundary. The moment Stillform positions itself for any specific altered-state use case, it crosses the medical-adjacent boundary the transfer doc explicitly guards against. The mode must be discoverable for any cognitive-bandwidth-limited use case without naming any of them. (3) The design that works for the broadest population is the same design that serves k-hole users — minimal demand, no decisions, no reading, no input. Designing for the broad case produces a feature that serves the specific case without ever naming it. If a future session asks "why doesn't this route k-hole users somewhere specific?" — that is the answer. We chose the broad design deliberately.

**What it MUST NOT be labeled as.** Not "ketamine mode." Not "for altered states." Not "crisis mode." The mode is discoverable for any cognitive-bandwidth-limited use case without naming any of them. Suggested labels: "Just sit with me" / "Quiet mode" / a large unlabeled obvious-on-the-home-screen visual.

**Mechanism.** Salience network reset (Menon 2011) + interoceptive grounding (Pillar 2). Body-first pathway stripped of every cognitive demand.

**Optional second-tap calibration once inside.** "How much can you do right now? Nothing / A little / Normal" — serves every Medicated user with k-hole users picking Nothing.

**Status.** Design captured. Code work ErrorBoundary-blocked. Diagnostic step before build: fetch App.jsx and bio-filter logic to confirm current Medicated chip routing, so build is grounded in current behavior not guessed.

**Founder context (private, never marketed).** Stillform was conceived by Arlin during ketamine treatment. The app is not a ketamine companion tool. B2B clinical channel via Arlin's doctor remains the path for any treatment-adjacent positioning. The low-demand mode serves the broad cognitive-bandwidth-limited population, of which k-hole users are one sub-population.

### Memory reconsolidation grounding for Reframe

Add to Reframe info button copy and Science Sheet Reframe section. Science Sheet Architecture section (Apr 28) covers the architectural framing; in-app copy still pending. ErrorBoundary-blocked for in-app copy. Cite Ecker, Ticic & Hulley (2012); Schiller et al. (2010, *Nature*); Lane et al. (2015, *BBS*). Frames why repeated Reframe sessions actually update memory, not just response.

### Predictive processing grounding for bio-filter

Add to bio-filter info button copy and Science Sheet bio-filter section. Science Sheet Architecture section (Apr 28) covers the architectural framing; in-app copy still pending. ErrorBoundary-blocked for in-app copy. Cite Seth (2013); Barrett & Simmons (2015). Frames bio-filter as updating the brain's predictive model, not just "filtering interpretation."

### Salience network reset grounding for body-first pathway

Add to Breathe and Body Scan info button copy and Science Sheet body-first section. Science Sheet Architecture section (Apr 28) covers the architectural framing; in-app copy still pending. ErrorBoundary-blocked for in-app copy. Cite Menon (2011). Frames why body-first works for spirals: redirects attentional priority, not just "calms down."

### ✅ Cyclic sighing as third breathing option — RESOLVED Apr 30

**Shipped Apr 30:** Cyclic Sighing added as third breathing pattern alongside Quick Reset and Deep Regulate. Protocol implements published Balban et al. 2023 (Cell Reports Medicine 4:100895, n=111 Stanford RCT under Spiegel/Huberman/Balban) exactly: Inhale 1 (deep, nasal) 4s + Inhale 2 (top-off, nasal) 1s + Exhale (slow, oral) 8s. 1:2 inhale-to-exhale ratio. 5 minutes recommended (~23 cycles).

Settings picker entry cites the published study. Default behavior preserved — Quick Reset stays default for new users; cyclic_sigh is opt-in.

**Outreach implication:** Now that Stillform implements her published protocol, this is the single strongest credibility lever for outreach to Dr. Melis Yilmaz Balban (founder of NeuroSmart, top outreach candidate per memory). Direct research overlap, non-competing market.

### ACT cognitive defusion lineage acknowledgment

Self Mode 5-step protocol (Notice, Name, Recognize, Perspective, Choose) overlaps with ACT cognitive defusion. MCT remains primary framework. Add Hayes, Strosahl & Wilson (1999) and Han & Kim (2022) acknowledgment to Self Mode info copy and Science Sheet Self Mode section. ErrorBoundary-blocked for in-app copy.

### In-app info button copy alignment with Apr 28 Science Sheet corrections

11 corrections committed to Science Sheet Apr 28 (commits 175bb6e4 through 9536e676). Wherever those claims appear in App.jsx ⓘ buttons, copy needs to match the corrected Science Sheet. Diagnostic step: grep App.jsx for the changed strings (60-90 seconds, 60 BPM, 20-30%, Lieberman, etc.) and produce a punch list. ErrorBoundary-blocked.

---

## ⚠️ TESTFLIGHT-BLOCKING — Recommended Order

Items tackled in this sequence build on each other and minimize risk. Each item gets reviewed and signed off before the next is touched.

### Sequence 1 — Quick wins (low risk, build momentum)
1. ~~Stale `OBSERVE AND CHOOSE` comment cleanup~~ — **DONE Apr 27.** Comment renamed to `Self Mode nudge` at line 6217 (current internal name).
2. ~~Three remaining UTC date sites~~ — **DONE Apr 27.** Resolved by TimeKeeper rollout (Phases 2-4 covered all 17 broken sites including these three plus the streak counter and 13 others).

### Sequence 2 — Real bugs that affect routing
3. ~~Bio-filter staleness~~ — **DONE Apr 27.** Schema migration (rather than the simpler check-in proxy) — bio-filter now stores its own date stamp `{value, date}`, getActiveBioFilter() returns "" when date doesn't match today's Stillform-day. 5 reads + 4 writes migrated. Handles both morning-check-in path and Reframe-direct path. Legacy plain-string values treated as expired (one-day blip for existing users, then everyone on new schema).
4. ~~Body-first override narrowing~~ — **DONE Apr 27.** New `shouldBodyRouteToScan(bioFilter)` helper. Three sites narrowed (hero CTA body-first branch + routeObserveEntry priority 1 + routeObserveEntry understand branch). Pain/Off-baseline/Something → Body Scan suggestion; Activated/Sleep/Depleted/Medicated → straight to Breathe (Ochsner & Gross 2005). Removes Body Scan friction for states where breathing IS the science answer.
5. ~~`routeObserveEntry` bio-filter parity~~ — **DONE Apr 27.** Three understand-branch paths brought into parity with hero CTA: thought-signal, unsure+thought-first regType, and unsure+body-first regType. Each now applies the offBaseline narrowing (Pain → Scan, other off-baseline → Breathe for thought paths; shouldBodyRouteToScan for body paths). User who's activated and goes through Observe Entry no longer gets routed to Reframe before regulating.

### Sequence 3 — Architectural decision + dead code
6. ~~Body-first metacognition access gap~~ — **VERIFIED ALREADY IMPLEMENTED Apr 27.** Initial review missed that the metacognition route is built into the existing pathway flow. Body-first user goes Pre-rate → Bio-filter → Breathe → Post-rate → Ground, and the grounding-complete screen has "Continue to Reframe →" as the PRIMARY CTA (line 3094, button className btn-primary). Post-rate screen also has "Skip to Reframe instead" escape hatch (line 3471) for users who want metacognition without the full grounding step. Body Scan auto-routes to reframe-calm after completion (line 3834). PresentStateChips component captures feel-state in BreatheGroundTool with the same chips as Reframe entry (line 3229, comment: "same chips as Reframe entry, data parity for body-first users"). Body-first users land on Breathe (science-aligned), are offered Reframe as the next step (metacognition route preserved), and their state is captured identically to thought-first users so the AI has the same context. Nothing to build. Going forward: read the existing flow before claiming a gap.
7. ~~Stuck dead-branch cleanup at hero CTA~~ — **DONE Apr 27.** `if (feelState === "stuck")` at line 12418 removed. The variable was undefined at App scope (declared only inside ReframeTool/ScanTool/MorningCheckIn), AND the Stuck chip never existed on home (only inside Reframe), so the branch was guaranteed dead. Body-first user still has full Reframe access via the tool grid and post-Breathe flow. Live `feelState === "stuck"` check at line 4910 inside ReframeTool's autoMode preserved untouched — that one is reachable and working correctly when a user inside Reframe selects Stuck.

### Sequence 4 — Resilience (medium-effort, important)
8. ~~ErrorBoundary error logging via App Diagnostics~~ — **DONE Apr 27 (revised).** Initial implementation overshot: built cloud-restore button and calibration-preserving reset path, both of which duplicated existing infrastructure (Settings has Restore now and Delete all data; Reframe has Start fresh). Reverted UI to original single-button form. Kept ONE addition: componentDidCatch writes the most-recent crash to stillform_last_error (timestamp, message, truncated stack, component stack). buildPerformanceMetricsSnapshot reads it as last_crash and includes in the existing daily diagnostics push. After successful send, the key is cleared. Crashes now ride the opt-in metrics-ingest pipeline the user already controls. Real reuse of existing infrastructure, not new layers. Sequence 4 — Resilience pillar — complete.
9. ~~AI conversation persistence — IndexedDB encrypted overflow~~ — **DONE Apr 27.** New `SecureStore` IndexedDB module (storage layer only — encryption still happens in secureSet/secureGet via existing CryptoStore). secureSet tries localStorage first, falls through to IndexedDB on quota/error. secureGet checks localStorage first, then IndexedDB. Same AES-GCM encryption either way. localStorage success path also clears any stale IndexedDB copy for the key to keep reads consistent. Diagnostics marker written to sessionStorage if both stores fail (rare). Zero call site changes — three existing call sites in ReframeTool (line 5159 read, 5183 + 5196 write) work transparently. Conversation preserved through localStorage quota overflow.
10. ~~Cloud sync batching~~ — **DONE Apr 27.** `sbSyncUp` rewritten: encrypts all keys in parallel via Promise.all, then single batched POST to Supabase REST with array body. 34 round trips → 1. Atomic from the user's perspective — no more partial-sync silent inconsistency. No retry baked in (deliberate — keeps helper contract simple, lets call sites decide retry policy with their user-facing context). Return shape preserved; all 4 call sites verified compatible.

---

## 🔴 OPEN — Surfaced During Apr 27–28 Testing

These are real bugs/architectural questions still open after the Apr 28 morning research-driven cleanup commits. Items resolved by those commits are listed under "Resolved Apr 28" subsection below.

### "Calm my body" hero CTA doesn't act on tap
Body-first user, Composure Check / Settings show normally, but tapping "Calm my body" on home does nothing — no navigation, no state change visible. Static analysis (full trace of click handler → startPathway → startTool → setScreen → BreatheGroundTool mount → hashchange listener) showed no obvious break. **Diagnostic console.log shipped in commit 089acffa98** — next time Arlin taps, browser DevTools console (or Chrome remote debugging via chrome://inspect/#devices) will reveal which branch the click takes. Once that data is available, fix is likely a one-liner. Suspect: stale `stillform_biofilter_choice` localStorage entry routing the click into a silent "skip" path, or React state batching issue specific to mobile WebView.

### Optionality decisions still pending
The Apr 28 audit identified mechanisms the science sheet names as core training but that are currently optional or skippable. Three commits Apr 28 morning fixed the **placement** issues (chips before regulation removed, post-Reframe screen architectural redundancy resolved). The **gating** decisions remain open:

1. **Lock-in card confirmation** — currently the user can tap "Finish session" without ever tapping "Locked in" on the Schön reflection-on-action card. Per `Stillform_Science_Sheet.md` and Lavi-Rotenberg 2020 MERIT findings, reflection-on-action consolidation is the named durability mechanism. Should be required to gate Finish.
2. **Post-rating chip selection** — single tap of an emotion chip is the lightest possible affect labeling intervention. Currently optional. Per Lieberman 2007 (post-regulation timing supported), should be required.
3. **What Shifted textarea** — Vine 2019 / Nook 2021 say free-text labels are scientifically stronger than predetermined choices. Currently optional toggle. Decision needed: required (stronger consolidation), optional (less friction), or remove (chip already covers labeling).
4. **Bio-filter for body-first users** — currently skippable via Baseline default. Pain users who skip bio-filter route to Breathe instead of Body Scan, which is clinically incorrect per Eccleston & Crombez 1999. Should be a required gate for body-first users; can stay skippable for thought-first.
5. **Calibration "Skip this step"** — currently allows users to skip signal mapping or bias profiler entirely, leaving the AI without a profile. JAMA Psychiatry 2025 meta-analysis shows asymmetric attrition risk if hard-gated. Recommended fix: replace skip with "Use defaults" fallback that creates a minimal default profile.

These five gating decisions are deferred to a fresh session post-deploy. Implementing them was deferred today because the placement fixes (commits a121a48a, ae43f4db, c86ec0ba) had to land first to make the gating questions answerable cleanly.

### Trees in Body Scan / Breathe theme mismatch
The trees graphic at the bottom of the breathing screen renders in fixed orange/amber color regardless of active theme. On the teal theme this creates dissonance (orange trees against teal breathing ring). **The amber glow under the ring is doing useful work as a warmth anchor and Arlin wants to keep it.** Recommended fix: change trees to `var(--text-muted)` or a desaturated neutral so they shift with theme (brown-ish on dark, muted teal-gray on teal, muted rose on rose). Glow stays warm amber as the one accent note. Trees are a grounding visual element — quiet color makes more design sense than competing accent. Inside `BreatheGroundTool`. Small visual fix, easy commit, can ship anytime.

### Watch deploy → publish flow on Netlify
Confirmed Apr 27 testing: triggering a deploy in Netlify is NOT the same as publishing it. After triggering, the new build sits ready on the Deploys tab and must be explicitly Published to go live. Reminder for future sessions: Claude pushes → Arlin triggers deploy → Arlin publishes → fix is live.

---

### Resolved Apr 28 morning — kept for reference

These items were genuinely open coming into Apr 28 morning and have been resolved by the three-commit research-driven cleanup. Listed here so the resolution path is documented and findable later.

**🧭 Pre-rate flow needed science-grounded redesign for both processing types** — RESOLVED via commit `ae43f4db`. The chip rows in `BreatheGroundTool` pre-rate (line 3228) and `BodyScanTool` pre-rate (line 3880) have been removed entirely per Nook, Satpute & Ochsner (2021, *Affective Science*) + 2024 BMC Psychology fNIRS replication + 2025 Springer N=226 replication. Pre-regulation affect labeling crystallizes the affective state and impedes subsequent reappraisal/mindful acceptance. The PROCESSING_PRIMER copy ("Downshift physiology first; your cognition clears after the body settles") is no longer contradicted by the screen layout — it now matches what the screen actually does. Chips remain in ReframeTool entry (defensible because Reframe IS the cognitive intervention, not pre-regulation cognitive load).

**Architectural redundancy in post-Reframe screen** — RESOLVED via commit `c86ec0ba`. Two unreachable screens (`showStateToStatement` and `showPostInsight`) were removed from the codebase entirely — both had setters that never fired from any live code path, so 108 lines of orphaned UI plus their helper functions (`finishStateToStatement`, `skipStateToStatement`, `continueFromPostInsight`) sat in the file but never executed. The live What Shifted block had identity confusion (wrapper text said "naming consolidates," placeholder said "draft a message") — that's been resolved by stripping the message-drafting overlay from the textarea. The Send a message Next Move chip now has a proper draft expansion UI underneath it (textarea + Copy/Share/Mark sent), placed between chip selection and Lock-in card per Gollwitzer 1999 + Hallam 2015 implementation intention specificity research.

**Static tip removal — partial** — RESOLVED via commit `c86ec0ba`. The "(optional)" framing on "What shifted?" toggle was misleading because the textarea was doing two contradictory jobs. After the cleanup, the textarea serves only post-regulation affect labeling (Lieberman 2007, Vine 2019), so the toggle now reads "▸ What shifted?" without the "(optional)" qualifier. The decision about whether to make it required or remove the toggle entirely is part of the optionality decisions still pending.

**Stuck chip status clarification** — RESOLVED earlier (Apr 27 chip-parity work). The chip is live and works in Reframe entry and post-rating. Whether home screen needs a Stuck chip is part of the body-first metacognition access question in the ARCHITECTURAL section.

**Science Sheet line 410 outdated** — RESOLVED via commit `a121a48a`. Updated to cite Nook, Satpute & Ochsner (2021), Affective Science (2025) replication, BMC Psychology (2024) fNIRS replication, and Vine et al. (2019). Mechanism updated from "intensification" (Lieberman tradition, older framing) to "crystallization" (Nook 2021 mechanism — labeling solidifies initial appraisals and limits generation of alternative appraisals). The design rule (regulate first, label after) is unchanged but is now defended by the more current literature.

---

## 🟡 STORE SUBMISSION PATH — Google Play Closed Testing → Public Launch

This section covers the store submission mechanics, not the prelaunch product scope. **The launch standard (locked Apr 29) is: master todo complete, except translations and Apple Store.** Every section above this one — encryption, data feed, Settled chip, chip ⓘ button, Reframe entry redesign, tone system, low-demand mode, Self Mode, My Progress, watch integration, Body Scan What Shifted, all of it — is prelaunch. This is the store-mechanics outline only.

Launch path: Google Play closed testing → public launch. Apple Store is the explicit exception — TestFlight blocked until Arlin has access to an iPhone. Reddit is not a launch step; held as a contingency lever for week-1 traction support.

**ACTIVE — work that can ship now:**

- [ ] Onboarding redesign — 2 intro pages max, calibration, interactive first-use walkthrough
- [x] ~~AI-error → Self Mode auto-flip~~ — **DONE Apr 27.** Full handoff system shipped. New `health.js` Netlify endpoint (lightweight GET, no Anthropic call). `buildOfflineFallback` writeup function deleted (was a worse-version of MetacognitionTool's MCT protocol). Replaced with: counter-based handoff (1st failure = offer card with two buttons, 2nd+ failure = auto-switch to Self Mode tab + plausible event). `selfModeEntryReason` flag distinguishes ai-failure handoff from deliberate Self Mode entry. `/health` polled every 45s (5s initial delay) ONLY when in Self Mode because of AI failure — surfaces an amber pill inside the Self Mode tab when AI recovers: "AI's back. Continue here, or return." with Return → and × buttons. All five state values (counter, offer card, entry reason, ai-back signal, active tab) persist to sessionStorage so a user mid-Self-Mode interrupted by phone call/notification returns to where they were. Self Mode entered deliberately = no polling, no pill ever, even if AI fails on parallel send.
- [ ] Google Play Console setup ($25 one-time) — required for closed testing track, 14-day clock before public launch can begin. Build the Android App Bundle from existing Capacitor android/ project.

**BLOCKED — pending hardware/access:**

- [ ] TestFlight build + tester invites — Apple Developer Program is paid, but BLOCKED on Arlin acquiring iPhone access for build testing. Pick up after Google Play track is established.

## 📡 CONTINGENCY — If App Doesn't Sell Itself Week 1

- [ ] Reddit launch post — r/ADHD, r/neurodivergent, r/anxiety, r/cptsd, r/BPD. Held in reserve, not a launch step. Only deploy if organic post-launch traction is weak.

---

## 📝 POST-LAUNCH — Noted, Not Blocking

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
- [ ] **AI prompt framing — "metacognition" never appears.** Stillform is positioned in `reframe.js` as "composure tool / stabilizer / companion" — never as a metacognition tool. The architectural truth is that this IS a metacognition tool that produces composure. Composure is the user-facing outcome word, but the AI prompts never make the metacognition core explicit, which may dilute the AI's behavior in subtle ways. Decide whether to weave "metacognition" into the system prompts so the model treats every interaction as metacognitive scaffolding, not just emotional support.
- [ ] **AI prompt "not therapy" framing** (`reframe.js:904, 925, 998`). Three places use negation framing ("NOT therapy homework," "not a therapy session"). Per Stillform's product principle: "Never define it by what it isn't." These are AI tone instructions (operational), not user-facing copy, but technically violate the rule. Either accept the operational use or rewrite as positive instructions ("Tight, direct, confident — pre-game language" instead of "not therapy").
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
- [ ] Watch haptic breathing companion — Galaxy Watch Ultra / Wear OS (requires Android Studio)

---

## LAUNCH

- [ ] Master todo complete (this entire document, except translations and Apple Store sections)
- [ ] Google Play store approved — flip to public
- [ ] Apple Store: deferred (post-launch)
- [ ] Reddit post: not a launch step (contingency only — see Store Submission Path section)

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
