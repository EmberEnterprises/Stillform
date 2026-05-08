# TRIGGER PROFILE PHASE 2 — FLOW AUDIT
**ARA Embers LLC · May 8, 2026 · Layer 0.6 audit output per audit philosophy v1.3**

---

## What this doc is

Layer 0.6 flow audit per `STILLFORM_AUDIT_PHILOSOPHY.md` Question 0.6.1 (canonical flow read before designing user-facing surfaces). Output: a design proposal for Trigger Profile Phase 2 capture UI.

**No code yet.** Spec proposal first, Arlin reviews, then build follows.

This audit was triggered by `STILLFORM_ENGAGEMENT_ARCHITECTURE.md` line 7 (verbatim): *"NOT YET BUILT: Build #2 Phase 2 (Trigger Profile capture UI — pending Layer 0.6 flow audit before any UI proposal)"* — and by `STILLFORM_HANDOFF_MAY_8_2026.md` §7 sequencing which gates Today's Brief and Pre-event Brief on this work.

---

## 1. Ground truth — facts this proposal is built on

Every flow claim below traces to a quoted source. No paraphrases of where things live.

### 1.1 Phase 1 schema is shipped and locked

From `src/App.jsx:4332–4347`:

```
stillform_trigger_profile = {
  triggers: [
    { id, label, category, createdAt, lastSeen, encounterCount }
  ],
  updatedAt
}
```

Categories (frozen, `Object.freeze`): `work | relational | financial | health | cross-cultural | current-events | other` (7 total).

Helper inventory at `src/App.jsx:4357–4479`: `getTriggerProfile`, `saveTriggerProfile`, `addTrigger({label, category})`, `updateTrigger(id, updates)`, `deleteTrigger(id)`, `incrementTriggerEncounter(id)`, `formatTriggerProfileForAI(limit=8)`. SECURE_KEYS membership at `src/App.jsx:9086`. SYNC_KEYS membership at `src/App.jsx:8480`. `addTrigger` already deduplicates by case-insensitive label match.

Phase 2 must consume this layer unchanged. Schema shape is not in scope for Phase 2.

### 1.2 The critical distinction Phase 1 already commits to

From `src/App.jsx:4310–4318` (verbatim):

> *Signal Profile already has a `triggers` field — a chip-picker selecting from a predefined 30+ option taxonomy (work pressure, family dynamics, sensory overload, etc). That's TYPE-level data: which categories of trigger affect this user. Trigger Profile is INSTANCE-level data: specific named people, contexts, kinds of moments. "My boss Mike" not "work pressure." "Mom's Sunday dinners" not "family dynamics." "Quarterly OKR reviews" not "deadlines."*

This means Phase 2 capture UI must accept **free-text labels**. Not chip-pickers. Not closed taxonomies. The category is closed (7 options); the label is open user input.

This also resolves engagement architecture §9 Q6 *("Predefined category list? Free-form user generation? Hybrid?")* — Phase 1 already locked **hybrid: categories closed, labels open**. Phase 2 inherits that decision.

### 1.3 The downstream surfaces Trigger Profile feeds

From `STILLFORM_ENGAGEMENT_ARCHITECTURE.md` §3.3 line 158 (verbatim):

> *Once named, Trigger Profile feeds:*
> *- **Anticipation:** Today's Brief, Pre-event Brief*
> *- **In-the-moment:** Reframe context, Pattern Disruption tagging*
> *- **Recovery:** post-event reflection scoped to the named trigger*

Reframe context is already wired — `formatTriggerProfileForAI` is called in the Reframe API path (`src/App.jsx:~9797`). Today's Brief, Pre-event Brief, Pattern Disruption tagging, and post-event reflection are all **NOT YET BUILT** per `STILLFORM_ENGAGEMENT_ARCHITECTURE.md` line 7.

**Implication:** Phase 2 doesn't need to touch any of those — its only job is to put labels into the profile. AI consumption already works.

### 1.4 Stage 3 threshold gates on Trigger Profile

From `STILLFORM_ENGAGEMENT_ARCHITECTURE.md` line 97 (verbatim):

> *Threshold (proposed): 3+ triggers named in Trigger Profile (gated on Trigger Profile ship) + 1+ Pre-event Brief used in last 14 days (gated on Pre-event Brief ship) + Pre→post rate delta ≥ 1.5 on named-trigger sessions average.*

Mirror sheet's Stage 3 marker at `src/App.jsx:3923` (verbatim from code):

> *{ id: "triggers-named", label: "Triggers named in your profile", value: 0, threshold: STAGE_THRESHOLDS.S3_TRIGGERS_NAMED_MIN, met: false, status: "deferred", deferReason: "Trigger Profile not yet shipped (Build #2 in spec shipping order)" }*

Phase 2 unblocks this marker. Once a user names 3 triggers, Stage 3 progress becomes computable.

### 1.5 Daily Loop entry points (from project transfer)

From `STILLFORM_PROJECT_TRANSFER.md` line 140–143 (verbatim):

> *- Morning check-in (energy, physical state, somatic tension — under 30 seconds)*
> *- In-moment regulation (routed by calibration plus bio-filter plus feel state)*
> *- End of day close (after 6 PM — three inputs, AI carries into next morning)*

Hero CTA routing from `STILLFORM_PROJECT_TRANSFER.md` line 173–185 (verbatim):

```
if (isThoughtFirst) {
  if (offBaseline) → bio-filter suggestion (Pain → Body Scan, other → Breathe)
  else → Reframe (calm)
} else if (isBodyFirst) {
  if (offBaseline && shouldBodyRouteToScan) → Body Scan suggestion
  else → Breathe (calm pathway)
}
```

Both processing types eventually hit Reframe (thought-first directly, body-first after Breathe → Ground). Both hit EOD. Both see Mirror anchor on home. Both see Settings.

**No daily-loop entry point is exclusive to one processing type.** Phase 2 capture surfaces will be visible to both.

### 1.6 Existing diagnostic-layer capture-flow precedents in code

Two patterns shipped, both reachable from `startTool()`:

**`SignalMapTool` (`src/App.jsx:13349`)** — multi-step wizard. Step 0 intro, then steps for body areas, sensations, and TYPE-level triggers (chip-picker from 5 grouped categories with ~30 options). Each save calls `secureWrite("stillform_signal_profile", updated)` immediately. Re-entry from Settings → Personalization (`src/App.jsx:22473–22501`) opens the same wizard via `startTool(TOOLS.find(t => t.id === "signals"))`. Caption: *"One-time setup. The app uses this to personalize your sessions."*

**`MicroBiasTool` (`src/App.jsx:12685`)** — linear 4-question flow. User confirms or denies recognition of 4 cognitive distortions (Confirmation Loop, Threat Weighting, Fast Conclusions, Overcontrol Mode). On completion, writes the array of recognized names to `stillform_bias_profile`.

Both patterns: invoked once during calibration, re-runnable from Settings, capture with discrete completion.

**Neither is a fit for Trigger Profile.** Reasons:
- The Signal Mapping wizard captures from a **closed taxonomy** (chip-picker). Trigger Profile is INSTANCE-level free-text. The pattern doesn't transfer.
- The Pattern Check linear flow uses **researcher-authored prompts** the user accepts or rejects. Trigger Profile asks the user to **author content from scratch**. Different cognitive load, different UX.
- Both are **one-shot at calibration**, with re-runnable Settings entry. Trigger Profile is **continuously growing** — users will name new triggers as they encounter them in life.

This is the gap the audit must close. The new pattern is closer to a list/CRUD surface than a wizard.

---

## 2. The architectural choice this audit must make

Engagement architecture §9 Q2 (verbatim): *"Trigger Profile onboarding. Initial onboarding step? Progressive disclosure as user identifies triggers in sessions? Editable always? Default category list or fully user-generated?"*

The "editable always" and "default category list" parts are answered by Phase 1 (yes, helpers exist; categories are 7-frozen with free-text label). What's open is **when does the user first encounter the surface** — at onboarding, or progressively in the daily loop?

### Option A: Initial onboarding step
Add a third calibration step after Signal Mapping + Pattern Check. User names 3–5 triggers up front in a wizard.

- **Pro:** Seeds profile to Stage 3 threshold (3+ triggers) immediately. Today's Brief works on day 1 with real data. Mirrors the existing two-step calibration pattern users already accept.
- **Con:** Extends onboarding (already calibration + Signal Mapping + Pattern Check + bio-filter). Users on day 1 may not know their triggers yet — the Practice Signals revert (May 7) named "users asked to volunteer data they don't have yet produces hostile UX" as a failure class. Brand pull is wrong: forcing the user to introspect for novel content under onboarding load.

### Option B: Pure progressive disclosure
No onboarding prompt. Surface "name a trigger" affordances during natural daily-loop reflection moments (EOD save, Reframe close). Settings has the management surface for explicit add/edit/delete.

- **Pro:** Matches Stillform's "data emerges from practice" philosophy. No onboarding bloat. Triggers get captured at the moment they were just felt, which is when label accuracy is highest. Brand-aligned.
- **Con:** Stage 3 takes weeks to reach. Today's Brief (Build #3) launches with empty Trigger Profile sections for new users until they accumulate data. Build #3 needs degraded-data fallback copy.

### Option C: Hybrid (recommended)
Single optional seed prompt at end of calibration, plus full progressive capture in the daily loop, plus Settings management.

The seed prompt is **one screen, one input**: *"Name one or two situations or people that reliably destabilize you. You can add more anytime."* with a category chip row, an inline text field, and a "Skip for now" affordance equally weighted with "Add". User can land 0–2 triggers and move on. Not a wizard. Not 4 steps.

- **Pro:** Surfaces the concept on day 1 so users know the feature exists (Mirror sheet shows Trigger Profile as a layer; if users have never encountered the concept, the empty-state reads as a hole). Lets motivated users land seed data immediately. Doesn't force introspection on users who don't have the language yet. Daily-loop capture deepens the profile organically over time. Brand-aligned.
- **Con:** Slight calibration extension (~30 seconds for users who fill it). Two surfaces to design instead of one.

**Audit recommendation: Option C.** Reasoning:
1. Mirror sheet (already shipped) shows Trigger Profile as a diagnostic layer. Users with empty profiles see a hole. The seed prompt addresses that asymmetry on day 1.
2. The seed prompt is dismissible with one tap, so it doesn't force introspection — it offers it.
3. Stage 3 threshold (3+ triggers) is reachable in 1–2 weeks of EOD capture from a non-zero starting point, instead of 4–6 weeks from zero.
4. Today's Brief design (next build) gets cleaner inputs because most users will have ≥1 trigger named within their first session.

Open call for Arlin: confirm Option C, or override to A or B. Decision drives Phase 2 scope.

---

## 3. The proposed capture-surface set

Five surfaces. Each is independently shippable. Order is by load-bearing-first (Settings management is the foundation; everything else writes to the same data layer).

### 3a. Settings → Personalization → Triggers (CRUD list view)
**Status:** required first; everything else depends on this layer existing as a fallback.

Collapsible sub-section in Settings → Personalization, mirrors the existing Signal Mapping placement at `src/App.jsx:22473`. Contents:

- Read state: list of triggers sorted by `encounterCount` desc, then `lastSeen` desc. Each row: label, category badge, encounter count if ≥ 1, last-seen date if encounterCount ≥ 1. Inline pencil icon → edit mode (label + category editable). Inline X → delete with confirm-once flow (no destructive action without confirm).
- Empty state: *"No triggers named yet. Add the situations or people that reliably destabilize you — specific names, not categories."* + "Add a trigger" button.
- Add affordance: free-text label field (max 64 chars) + category chip row (7 options). Submit calls `addTrigger({label, category})`; existing dedupe at line 4389 handles re-submission.

This surface owns the contract that the user can always view, edit, or delete their named triggers from one place. Brand: operator-tier, list view, no decoration.

### 3b. EOD post-save trigger prompt
**Status:** highest-leverage capture moment. EOD already has the user reflecting on the day.

After `saveEod` commits (the same trigger point Build #10 just landed in), surface: *"Did one specific thing show up today? Name it."* Single screen. Optional. Dismiss with "Not today." Submit with label + category chip row.

- If submitted, calls `addTrigger({label, category})` and then `incrementTriggerEncounter(id)` (the second call captures "encountered today" on a fresh entry; Phase 1's `addTrigger` initializes `encounterCount: 0` so we increment to 1).
- If the typed label matches an existing trigger by case-insensitive match, `addTrigger` returns the existing record; we then call `incrementTriggerEncounter` on that id.
- If dismissed, no write. EOD save flow proceeds normally.

This surface is the daily-loop heartbeat for Trigger Profile growth. Brand: prestige-operator close, declarative prompt, no asterisks.

### 3c. Reframe close trigger prompt
**Status:** second-highest-leverage capture moment. User just processed something specific.

After `saveSession` commits in Reframe (`src/App.jsx:9379`), if the user wrote ≥ 1 message in the conversation, surface: *"Was today's session about something specific? Name it (optional)."* Same form pattern as EOD prompt: label + category + Submit / Skip.

Symmetry note (Operating Rule 8): both processing types reach Reframe — thought-first direct, body-first after Breathe → Ground. Same close screen serves both. No asymmetry to flag.

- **Privacy boundary I'm naming:** the Reframe message history sits in encrypted local storage. It is **NOT** parsed for label suggestions. The user types the label. Suggestion-from-conversation is out of scope unless Arlin explicitly asks for it (open call below). This stays brand-aligned: Stillform observes what the user gives it, doesn't read their conversations to infer.

### 3d. Mirror sheet — Trigger Profile section
**Status:** completes the architecture's "Mirror at home (3 layers visible)" claim from §4.

Mirror sheet is shipped (`c673dac` / `25a9bfe`). It shows Stage status + Signal Profile + Bias Profile reflections. Adding a Triggers section that displays:

- Top 3 triggers by `encounterCount`. Format: *"Mike (12 encounters) · work · last seen Tuesday"*. No more than 3.
- Empty state: *"No triggers named yet. Triggers are specific people, contexts, or moments that destabilize you. Name them anywhere — Settings, EOD close, Reframe close."* + small "Add a trigger" link to 3a form.
- "See all →" link if there are more than 3, opens the Settings sub-section (3a).

This surface is read-mostly. Add affordance routes to 3a, not a third capture point. Brand: anchored mirror, names what's there, doesn't perform.

### 3e. Calibration seed prompt (Option C only)
**Status:** ships only if Arlin picks Option C. Skip if A or B chosen.

Single screen at end of calibration, after Pattern Check completes, before "Initialization complete" pill. Same form as 3a-add. Dismissible with weight-equal "Skip for now" affordance.

- Copy: *"Name one or two situations or people that reliably destabilize you. You can add more anytime."*
- Body-first / thought-first symmetry: both types complete calibration the same way; both see this prompt in the same position.
- On skip: nothing written. User reaches home.
- On submit: writes 1–2 triggers. User reaches home with profile seeded.

---

## 4. AI integration check (Layer 1.2)

`formatTriggerProfileForAI(limit=8)` is already wired into Reframe at `src/App.jsx:~9797` (per Phase 1 SHIPPED entry, master todo line 71). Phase 2 does **not** touch this. New triggers added via any of the 5 capture surfaces flow into AI context automatically on the next Reframe call.

The Phase 1 implementation cites Heider 1958 attribution theory and Lazarus 1991 cognitive appraisal in the code header (`src/App.jsx:4320–4324`). The mechanism: naming specific external causes binds internal experience to external triggers, enabling appraisal-focused regulation. Phase 2 capture surfaces serve this mechanism by giving the user the act of naming. The **act** of writing the label IS the regulation work, not just the data side effect.

This grounds the capture-form copy: prestige-operator, declarative, no padding. *"Name it"* is correct voice. *"Take a moment to consider what triggered you today and gently name what you're feeling"* is wrong voice (therapy-coded, not what the user is doing).

---

## 5. What this audit does NOT propose

Out of scope for Phase 2, named here so they don't drift in:

- **Encounter auto-tracking from session content.** Phase 3 territory per code comment at `src/App.jsx:4329`. Requires NLP-ish matching against user-typed labels. Has its own design call. Not in Phase 2.
- **Multi-category triggers.** The schema has one `category` field per trigger. A trigger that's both "health" and "financial" picks one or uses "other". Schema change to support multi is non-trivial (storage, AI formatter, UI complexity). Recommend: stay 7-frozen single-category.
- **Trigger-tagged sessions.** Adding a `triggerId` field to session records to enable Stage 3 marker *"Pre→post rate delta ≥ 1.5 on named-trigger sessions average"*. This is its own scoped piece — needs UI for tagging (which trigger was this session about?) plus session schema extension. Recommend: queue as Phase 2f or separate Build #2.5 after capture surfaces ship.
- **Conversation parsing for label suggestions.** Privacy line. Don't ship without explicit Arlin yes.
- **Trigger Profile sync to Pre-event Brief / Today's Brief.** Those are downstream builds (Build #3 and Build #7 per shipping order). They consume `formatTriggerProfileForAI` and the raw `getTriggerProfile()` helpers. Phase 2 doesn't touch them.

---

## 6. Open calls for Arlin to make

These are decisions only you make. The audit names them; the build doesn't proceed until you call them.

1. **Architectural choice (§2 above):** Option A (calibration step) / Option B (progressive only) / Option C (hybrid recommended)?
2. **If Option C: ship 3e (calibration seed) in initial Phase 2, or defer to post-launch?** The 4 daily-loop surfaces (3a–3d) deliver the architecture without 3e; 3e is additive.
3. **Surface ship order.** I recommend 3a (Settings) → 3b (EOD) → 3d (Mirror) → 3c (Reframe close) → 3e (calibration seed, if applicable). 3a is the foundation. 3b is highest-leverage capture. 3d completes the Mirror promise. 3c and 3e are additive. Confirm or reorder.
4. **Reframe-close conversation parsing for label suggestions** — yes/no? My audit recommendation is no. Privacy boundary worth holding.
5. **Trigger-tagged sessions (out of scope for Phase 2):** queue for Phase 2f, or absorb into Build #3 (Today's Brief) work? Either is defensible.
6. **Surface copy review.** All copy in §3 is draft. Voice rubric: prestige-operator declarative. Worth a pass before any of these ship — happy to draft alternates per surface for review.

---

## 7. Build scope if Option C is accepted

| Phase | Surface | Estimated build size | Dependencies |
|-------|---------|----------------------|--------------|
| 2a | Settings → Triggers (CRUD) | 1 build (~150-200 lines + form component) | Phase 1 helpers ✓ |
| 2b | EOD post-save trigger prompt | 1 build (~100 lines, reuses 2a form) | 2a |
| 2d | Mirror sheet Triggers section | 1 build (~80 lines, read + link to 2a) | 2a + Mirror shipped ✓ |
| 2c | Reframe close trigger prompt | 1 build (~100 lines, reuses 2a form) | 2a |
| 2e | Calibration seed prompt | 1 build (~80 lines, reuses 2a form) | 2a |

Total: 5 small builds. ~510 lines if all 5 ship. Each independently reviewable.

**After Phase 2 lands, Today's Brief (Build #3) is unblocked.** Today's Brief consumes Trigger Profile data alongside calendar + diagnostic stack to produce the morning artifact. Pre-event Brief (Build #7) follows once Today's Brief is in.

---

## 8. Audit philosophy compliance check

Per `STILLFORM_AUDIT_PHILOSOPHY.md` Layer 0.6 question 0.6.1 (verbatim): *"Have I read the canonical flow documentation before proposing this surface or capture point?"* — required reading: `STILLFORM_PROJECT_TRANSFER.md` Daily Loop section, Current Routing Logic section, Key Features Built; the actual `TOOLS` array in `src/App.jsx`; the hero CTA routing logic.

Reading evidence: §1.1 quotes Phase 1 schema from code, §1.2 quotes the type-vs-instance distinction from code, §1.3 quotes engagement architecture §3.3, §1.4 quotes the Stage 3 threshold from spec + code, §1.5 quotes project transfer Daily Loop + routing, §1.6 quotes existing capture flows from code with line refs.

Per question 0.6.2 (verbatim): *"For each user-facing surface, which processing type sees it?"* — addressed in §1.5 (no capture surface is exclusive to one processing type) and §3c (Reframe close serves both types via existing routing).

Per question 0.6.3 (verbatim): *"Where does the user encounter this for the first time?"* — addressed in §2 (Option A first encounter at calibration, Option B first encounter at first EOD or first Reframe close, Option C first encounter at calibration but optional).

Standing requirement (science + UI flow articulation) addressed in §4 (science: Heider 1958 attribution, Lazarus 1991 appraisal — already cited in Phase 1 code; mechanism: naming as regulation work) and §3 (flow: each surface preserves symmetry across processing types, preserves data continuity Phase 3 will need, removes no decisions because all surfaces are dismissible, brand consistency held to operator-tier voice).

---

## 9. What ships next once Arlin reviews

1. Arlin picks Option A / B / C (§6 question 1).
2. Arlin confirms or reorders the surface ship sequence (§6 question 3).
3. Arlin makes the conversation-parsing call (§6 question 4).
4. I draft Phase 2a (Settings CRUD) as the foundation. Surface copy gets a voice review pass before code lands.
5. After 2a ships and you've tapped through it, 2b through 2e follow in the agreed order.
6. After Phase 2 is in, Today's Brief design audit begins.

This audit doc, plus master todo entry pointing to it, lands in this commit. No code changes in this commit.
