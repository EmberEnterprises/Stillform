# TODAY'S BRIEF — LAYER 0.6 FLOW AUDIT

**Engagement Architecture · Engine 2 (Application Layer) · Build #3**
**Author: Claude · Reviewer: Arlin · Status: pending Arlin's review of open calls**
**Last updated: May 8, 2026 (post Phase 2 capture stack + 2d.1 inline add)**

> **STATUS — May 17, 2026.** This Layer 0.6 audit informed shipped work: **Phases 3a–3d SHIPPED** per Completed Archive line 451 and Master Todo line 1709 (3a backend `be4f23d`, 3b frontend helpers `b4cba8a`, 3c saveCheckin hook `19a81a6`, 3d inline display with poll `87ecfdf`). **Phase 3e (re-read surface) DEFERRED post-launch** per audit recommendation. The architectural rationale (Option A: auto-generate inline on morning check-in close), science alignment, boundaries, and 8 open-call decisions remain the substantive WHY of the shipped Today's Brief. Note: "high intensity" usage in §4 references Barrett's constructed-emotion research vocabulary (low/high arousal labeling), not audience characterization — preserved as scientific terminology per the subtle-case convention.

---

## What this doc is

A pre-code flow audit for Today's Brief — the morning artifact specced in `STILLFORM_ENGAGEMENT_ARCHITECTURE.md` §3.2 line 121. Same shape and intent as `TRIGGER_PROFILE_PHASE_2_FLOW_AUDIT.md`: ground the proposal in what's already shipped, surface the architectural choices that must be made before any code, recommend defaults where the audit can recommend, and flag the calls only Arlin can make.

This is Layer 0.6 work. No code in this commit. The audit's purpose is to prevent the failure mode where Phase 2 nearly hit (a 250-line surface gets built before anyone has decided whether it should fire on home open or after morning check-in completion). When this doc is reviewed, Build #3 is unblocked.

---

## 1. Ground truth — facts this proposal is built on

### 1.1 The architectural source

`STILLFORM_ENGAGEMENT_ARCHITECTURE.md` line 121-126, verbatim:

> **Today's Brief.** Morning artifact summarizing hardware + risks + moves + recovery. Generated at morning check-in from bio-filter + outcome focus + calendar + Trigger Profile + bias profile. Re-readable all day. AI-generated, brand-voice locked.
>
> Example: *Hardware: depleted. Today's risks: 2pm meeting with [boss], kid pickup at 3:30. Today's move: feet flat, slow exhale before each. If you spiral: text [partner] before reacting. Recovery: 10 minutes alone after the kid is settled.*

That spec line gives:
- **Generation trigger:** "at morning check-in" — implies after the user completes the existing morning check-in flow, not on cold home-screen open
- **Inputs:** bio-filter, outcome focus, calendar, Trigger Profile, bias profile (all already-shipped data layers)
- **Output character:** 4 named sections (Hardware / Risks / Moves / Recovery), prose-style
- **Persistence:** "re-readable all day" — implies one stored artifact per day, surfaced repeatedly
- **AI:** Yes, brand-voice locked (matches the operator-tier voice rubric the EOD-artifact backend already enforces)

`Stillform_Strategic_Roadmap.md` line 41-46 frames the application layer as *"what the user takes from app to life"* — Today's Brief is the morning end of that bridge, EOD artifact (Build #10, shipped) is the evening end.

### 1.2 The data layers Today's Brief consumes (all shipped)

Already in storage and ready to read. No new schema needed.

| Layer | Source key | Shape | Shipped |
|---|---|---|---|
| Bio-filter | `stillform_bio_filter` (also derived from `stillform_checkin_today.bio`) | Array of states (e.g., `["sleep-deprived"]`, `["clear"]`) | Yes |
| Morning check-in | `stillform_checkin_today` | `{ date, energy, mood, bio, tension }` | Yes |
| Outcome focus | `stillform_outcome_focus` | User-selected daily focus | Yes |
| Calendar events | `stillform_calendar_events` | `[{ start, title, ... }]` from Google Calendar via consent flow | Yes |
| Calendar summary | `stillform_calendar_summary` | Pre-computed summary string | Yes |
| Trigger Profile | `stillform_trigger_profile` (Phase 1 + 2a-d.1) | `{ triggers: [{label, category, encounterCount, lastSeen}] }` | Yes (Phase 2 complete May 8) |
| Bias profile | `stillform_bias_profile` | User's identified cognitive distortions | Yes |
| Signal profile | `stillform_signal_profile` | Body-area activation map | Yes |
| Stage | `getCurrentStage()` (derived) | `{ stage, currentStageId, markers, nextStage }` | Yes |
| Recent practice | `getSessionsFromStorage()` filtered last 7d | Session entries with delta + duration | Yes |
| Yesterday's EOD | `stillform_eod_today` (read filtered) + `stillform_eod_artifacts[0]` | Composure + AI vocab | Yes |

Every input the spec line names is already collected. Today's Brief is a synthesis surface, not a data-collection surface.

### 1.3 Existing AI-artifact precedents in code

Two precedents to model from. Both shipped, both validate the pattern.

**EOD artifact (Build #10, commit `843d66a`):**
- Backend `netlify/functions/eod-artifact.js` (commit `4c36283`)
- Frontend helper `generateEodArtifact(eodSnapshot)` fires fire-and-forget POST after `saveEod`
- Persists to `stillform_eod_artifacts` (SECURE_KEYS encrypted at rest, SYNC_KEYS for cross-device) ⚠️ [encryption/cross-device-sync NOT in live build as of May 30 2026 — plain localStorage; the feature flow audited here is still valid, only this storage detail is stale; see CANON]
- Replaces same-day record on re-fire
- AI-down → no artifact persisted, no fallback template (operator-tier voice rubric forbids generic filler)
- Display surface deferred — vocabulary persists, design call after a few days of real data

**Reframe AI (`netlify/functions/reframe.js`):**
- Receives signalProfile, biasProfile, triggerProfile, bioFilter, sessionCount, etc.
- Brand-voice locked in system prompt
- Rate-limited per IP
- Auth-aware (sbGetSession()?.access_token)

Today's Brief should mirror this pattern: new `netlify/functions/todays-brief.js` consuming the same diagnostic stack + calendar, with the same brand-voice prompt envelope and the same fire-and-forget client wiring.

### 1.4 Calendar plumbing is already wired (and partial)

This is non-obvious and worth pulling forward. Calendar IS already integrated:
- `stillform_calendar_consent`, `stillform_calendar_events`, `stillform_calendar_summary`, `stillform_calendar_updated_at` are in localStorage
- `scheduleMeetingNotifications()` already fires pre-meeting Local Notifications (Capacitor) with configurable lead time
- `PRE_MEETING_NOTIF_KEY` toggle exists in Settings
- `hasCalendar` boolean is checked at home (line 23314) for some surface gating

What's NOT wired:
- The Pre-event Brief that those notifications nominally point at (Build #7 — depends on Today's Brief per `STILLFORM_ENGAGEMENT_ARCHITECTURE.md` ship order line 313)
- Calendar-aware Today's Brief composition

The implication: Today's Brief is being designed against calendar plumbing that ALREADY EXISTS but doesn't yet have a brief surface to feed. The infrastructure is waiting on the brief, not the other way around.

### 1.5 The morning check-in flow as integration point

`saveCheckin()` at line 20213 commits the morning state and triggers a chain of side effects: feelState seeded, off-baseline flag, trackMorningComplete event. Today's Brief generation is a natural addition to this chain — after the user completes morning check-in is the moment when the input data is freshest and the user is in a "ready to receive guidance" posture.

This matches the spec ("Generated at morning check-in") and matches the EOD artifact pattern (fires after `saveEod` commits). Symmetry between the morning end and the evening end of the daily loop is a feature: same fire-and-forget pattern, same backend shape, same display question deferred.

### 1.6 What Today's Brief is NOT replacing

The morning check-in itself stays. It's a 30-second input flow that captures bio + energy + mood + tension. Today's Brief is the OUTPUT of that input — same relationship as `eod_today` (input) → `eod_artifact` (output).

The home screen's existing morning surfaces (calendar event peek, check-in prompt, last-session reflection) all stay. Today's Brief is a new artifact, not a redesign of the morning home screen.

---

## 2. The architectural choice this audit must make

The spec says "generated at morning check-in" but doesn't constrain the WHEN/WHERE/HOW of display. Three viable patterns:

### Option A: Auto-generate on check-in completion, display inline

Mirror EOD artifact exactly: after `saveCheckin` commits, fire-and-forget POST to `/.netlify/functions/todays-brief`. Brief renders inline in a card immediately below the check-in confirmation. User reads, taps continue, Brief persists for the rest of the day on a dedicated surface (TBD).

- **Pros:** Strongest temporal coupling — user just told the system how they're doing, system tells the user what to expect. Highest brief-relevance window. Mirrors EOD artifact pattern verbatim, lowest implementation risk. User actively engaged at the moment of generation.
- **Cons:** Adds a step to morning check-in (which is currently 30 seconds → done). Pushes the "I want this fast" user into reading. AI failure leaves an awkward gap mid-flow.
- **Failure mode:** AI 500s during morning check-in close → silent fail per EOD artifact precedent → user sees normal close screen, no brief, no notification of failure.

### Option B: Auto-generate on check-in completion, display on dedicated surface

Same generation trigger, but the brief does NOT appear inline. A small marker appears on home (e.g., "Today's Brief ready") and tapping it opens a dedicated `<TodaysBriefScreen />`.

- **Pros:** Doesn't slow down morning check-in. Honors users who want to check in fast and read brief later. Cleaner surface separation. Respects the "re-readable all day" spec language — it lives somewhere stable, not buried in a dismissed card.
- **Cons:** Decoupled from the moment of highest readiness. Creates a new home-screen surface, which means a placement decision (already an open question on Mirror placement per arch §9.3).
- **Failure mode:** AI 500s → marker never appears → brief silently absent.

### Option C: User-triggered, lazy generation

Brief is not auto-generated. Home screen shows "Generate Today's Brief" affordance after morning check-in is done. User taps when ready. Brief generates and renders.

- **Pros:** Zero forced-reading. Costs nothing in API spend if user doesn't engage. User chooses the moment.
- **Cons:** Adds friction to a surface meant to BE the morning compass. If users have to remember to tap a thing, most won't. Defeats the spec's "morning artifact" framing.
- **Failure mode:** Same as B — silent fail; user retries.

### Audit recommendation: **Option A (auto-generate on check-in, display inline)**

Reasoning:
1. The spec explicitly says "Generated at morning check-in." Option A is the literal reading.
2. EOD artifact already runs this exact pattern (fire after saveEod) and has been live. Pattern is proven and the user mental model is established (morning input → AI-named output).
3. The moment of highest receptivity is when the user has just done the input. Decoupling generation from display (Options B/C) is engineering convenience, not user benefit.
4. Inline display in the check-in close card (a beat between "saved" and "back to home") is actually shorter than navigating to a separate surface. Speed is preserved.
5. Display surface CAN still be dedicated for re-reads through the day (additive). Option A doesn't preclude a re-read surface — it just makes the first read inline.

Hybrid leaning: ship Option A first, then add a re-read affordance (probably from home anchor or My Progress) as a follow-up. This matches the 2d / 2d.1 sequence — ship the high-leverage core first, additive surfaces second.

---

## 3. The proposed surface set

Five distinct surfaces. Numbered by ship priority.

### 3a. New Netlify function `netlify/functions/todays-brief.js` (foundation)

Backend that the morning check-in calls. Same shape as `eod-artifact.js`:
- Auth-aware (Bearer token)
- Rate-limited per install_id
- Receives the diagnostic stack + calendar + outcome focus
- Returns JSON with named sections (hardware, risks, moves, recovery) — TBD whether a single prose blob or structured fields
- Brand-voice locked in system prompt
- Failure modes return 4xx/5xx and the client persists nothing

**Open call:** structured JSON (4 fields) vs single prose string. Audit recommends structured JSON because (a) it lets the client render section headers in operator typography rather than relying on the AI to format consistently, (b) it makes future search/export trivial, (c) display flexibility (collapse/expand sections, surface "Today's risks" alone in a calendar-tap context for Build #7).

### 3b. Frontend helper + storage layer

Mirroring the EOD artifact helpers:
```
TODAYS_BRIEF_API_URL = (capacitor-aware URL)
TODAYS_BRIEF_STORAGE_KEY = "stillform_todays_briefs"
getTodaysBriefs()
appendTodaysBrief(brief)   // replaces same-day, trims to 90
buildTodaysBriefPayload()  // assembles inputs from storage
generateTodaysBrief()      // fire-and-forget POST, persists on success only
```

Storage key joins SECURE_KEYS (encrypted at rest, parallel to journal/profiles/eod_artifacts) and SYNC_KEYS (cross-device). Added to `keysToRemove` for delete-all.

The 90-item trim matches EOD artifact's policy. No reason to diverge.

### 3c. Hook from `saveCheckin` (the trigger)

Add at the end of `saveCheckin()`:
```js
try { generateTodaysBrief().catch(() => {}); } catch {}
```

Fire-and-forget. Does NOT block check-in close UX. Mirror EOD pattern verbatim. Plausible event `Today's Brief Generated` (with success/fail in props) for telemetry.

### 3d. Inline display in check-in close screen

After `setCiSaved(true)`, the close card currently shows a confirmation. Add a render branch: if today's brief exists in storage, render its 4 sections (Hardware / Risks / Moves / Recovery) below the confirmation. If not yet (AI in flight), show a quiet placeholder ("Brief generating…"). If generation failed, no brief section shown — silent failure, don't surface the error to the user mid-morning.

Operator-tier visual treatment:
- 4 mono-xs section labels (HARDWARE / RISKS / MOVES / RECOVERY)
- DM Sans body for content
- 0.5px hairline separators (matches Mirror sheet rhythm)
- No section label icons (the operator-tier rubric forbids decorative icons)
- Time-from-generation footer ("Generated 7:42 AM") for trust

### 3e. Re-read surface (deferred)

A way to re-read today's brief later in the day (per spec: "re-readable all day"). Options:
- New tile on home screen ("Today's Brief")
- Section in Mirror sheet
- Section in My Progress
- Pull from calendar event tap (which would actually be Build #7's job)

**Audit recommendation:** defer this decision until 3a-3d are live and Arlin has read a few days of real briefs. The surface choice depends on what a brief actually feels like in production. Premature placement decisions on the redesign-in-flight home screen will create rework. Same posture as the EOD-artifact display deferral (line 72 of master todo).

---

## 4. AI integration check (Layer 1.2 — science alignment)

Per audit philosophy Layer 1.2, every new AI surface needs explicit alignment to the science the product claims.

The spec calls for: bio-filter (interoception), outcome focus (intention-setting), calendar (event-driven anticipatory regulation), Trigger Profile (named load-bearing patterns), bias profile (cognitive distortion awareness).

The mechanism stack:
- **Heider 1958 / Lazarus 1991** — naming a stressor in advance reduces autonomic load when it arrives. Today's Brief operationalizes this for known calendar events.
- **Implementation intentions (Gollwitzer 1999)** — "If [trigger] then [action]" cards have outsized effects on follow-through versus "I'll try to be calm." The spec's "If you spiral: text [partner] before reacting" line is literally an implementation intention.
- **Anticipatory regulation (Sheppes & Gross 2011)** — choosing a regulation strategy before the event has lower cognitive cost than choosing during. Brief's "Today's move" section is anticipatory move-selection.
- **Construction effect (Barrett, constructed emotion theory)** — labeling forecast affect at low intensity primes more granular labeling at high intensity. Brief's "Hardware" section serves as a granular bio label that the user re-uses through the day.

The brief is not a horoscope. It's an applied-science intervention. The system prompt for the Netlify function must be written so the AI generates content that ACTUALLY DOES the four mechanisms above — not vague affirmations that look helpful but don't trigger pre-event planning.

**Open call:** The system prompt will need to be reviewed against this mechanism list before going live. The audit recommends drafting it in a `TODAYS_BRIEF_SYSTEM_PROMPT_DRAFT.md` and reviewing against the four mechanisms before the netlify function ships.

---

## 5. What this audit does NOT propose

Boundaries the audit explicitly holds:

1. **No new data collection.** Every input is already stored. This is a synthesis surface, not a profiler.
2. **No silent merging with EOD artifact.** They are separate artifacts on separate triggers. The accumulating "vocabulary" arc is the EOD artifact's job; the morning compass is Today's Brief's job. (Spec arch §3.2 confirms: separate.)
3. **No replacement of morning check-in.** The check-in stays. Brief is the output.
4. **No calendar-event-tap brief.** That's Build #7 (Pre-event Brief). The spec is clear: same shape, scoped to one event, fires 30min before via existing notification plumbing. Do not conflate.
5. **No push-notification fire of Today's Brief.** Morning push is its own scope and arch §9 question 9 hasn't been resolved. Today's Brief is opened-app context, not OS-notification content.
6. **No fallback template on AI failure.** Per EOD artifact precedent and the operator-tier voice rubric — generic filler betrays the prestige tier. Silent absence is correct.
7. **No share/export in Build #3.** The shareable composure card pattern exists for sessions; deciding whether briefs share is a design call after several have been written.

---

## 6. Open calls for Arlin to make

The audit cannot resolve these. They need Arlin's call before code begins.

1. **Architectural choice (§2): A vs B vs C.** Audit defaults to A (auto-generate inline on check-in close). Arlin override: any of B / C / hybrid.

2. **Backend output shape (§3a): structured 4-field JSON vs single prose string.** Audit defaults to structured JSON for display flexibility and Build #7 reuse. Arlin override: prose-only if the prestige-tier voice reads better unsegmented.

3. **System prompt draft & review (§4).** Should the system prompt be drafted in this same audit doc, in a separate `TODAYS_BRIEF_SYSTEM_PROMPT_DRAFT.md`, or composed during 3a implementation and reviewed in code? Audit recommends separate doc, parallel to how the EOD artifact prompt was drafted before backend ship.

4. **Re-read surface (§3e): defer or pick now.** Audit defaults to defer — pick a surface after a few days of real briefs. Arlin override: pick now (home tile / Mirror section / My Progress section).

5. **Empty-state / first-day behavior.** Day 1 user has no Trigger Profile, no calendar consent, no recent practice deltas. Audit recommends: brief still generates on day 1 with whatever IS available, AI prompt instructed to be honest about thin context ("no triggers named yet, I'll be brief today" — operator-tier candor, not apologetic). Arlin override: brief skips on first day until N days of data exist.

6. **Silent-failure copy.** When AI fails and the brief never lands, the user sees the normal check-in close. Audit recommends NO error surfaced. Arlin override: a soft line like "Brief unavailable today" if she'd rather acknowledge than disappear.

7. **Calendar-without-consent behavior.** If user hasn't granted calendar access, Today's Brief still generates but skips the "Risks" section (or the "Risks" section becomes "What's flagged from your Trigger Profile today"). Audit recommends graceful degradation — brief reads as still-useful without calendar. Arlin override: gate the brief entirely on calendar consent (would push more users to grant).

8. **Brief regeneration on data change.** If user updates morning check-in later in the morning (it allows updates per existing pattern), does the brief regenerate? Audit recommends YES — same as EOD artifact's re-fire on EOD update. Arlin override: NO if the cost or noise outweighs the precision.

---

## 7. Build scope if audit defaults are accepted

Conservative estimate, per `STILLFORM_ENGAGEMENT_ARCHITECTURE.md` ship order line 309 ("1-2 builds + Netlify function").

| Phase | Scope | Approx diff size |
|---|---|---|
| 3a | Netlify function `todays-brief.js` + system prompt | ~300 lines net new |
| 3b | Frontend helpers + storage layer + SECURE_KEYS / SYNC_KEYS membership | ~80 lines net new |
| 3c | Hook from `saveCheckin` (3-line addition) | <10 lines |
| 3d | Inline check-in close screen render branch (4 sections + placeholder) | ~120 lines net new |
| 3e | Re-read surface (deferred per recommendation) | TBD |

Total core (3a-3d): ~500 lines, 4 commits, single session. Compared to Phase 2's 6-surface arc (~700 lines across 6 commits), Today's Brief is materially smaller per the spec's existing infrastructure leverage.

**Recommended ship order:** 3a (backend) → 3b (frontend plumbing) → 3c (trigger hook) → 3d (display). Same load-bearing-first approach Phase 2 used. Backend shipping first means the hook and display can be tested against a real working endpoint instead of mocked.

---

## 8. Audit philosophy compliance check

This doc complies with `STILLFORM_AUDIT_PHILOSOPHY.md`:

- **Layer 0 (read everything first):** Engagement architecture §3.2, strategic roadmap line 41-46, project transfer Daily Loop, EOD artifact precedent (Build #10), Reframe Netlify function pattern, calendar plumbing (line 5365+), morning check-in saveCheckin (line 20213), Trigger Profile Phase 2 audit doc as precedent — all read.
- **Layer 0.6 (audit before code):** This is the audit; no code in this commit.
- **Layer 1.0 (ground truth before claims):** Every claim in §1 is a verifiable file/line citation.
- **Layer 1.1 (grep before edit):** N/A this commit (no edits); next commit must follow.
- **Layer 1.2 (science alignment):** §4 ties the brief's structure to four cited mechanisms.
- **Layer 6.1 (don't deflect):** §2 makes a recommendation. §6 lists open calls Arlin must answer. No false neutrality on resolvable questions.
- **Layer 6.7 (diff size matches scope):** Doc-only commit. Diff is purely additive — one new file, no edits.
- **Operating Rule 5:** Master todo entry will be added to this commit alongside the doc.

---

## 9. What ships next once Arlin reviews

If Arlin accepts the audit defaults wholesale:
- 3a netlify function (with prompt drafted in side doc) — single commit
- 3b frontend plumbing — single commit
- 3c saveCheckin hook + 3d inline display — single commit

Three implementation commits, same session if Arlin's tap-through review holds.

If Arlin overrides any default in §6, the audit is updated in place (Arlin's call replaces the default + the doc records the call), then implementation proceeds against the revised spec. No new audit doc needed for overrides — this one is the source of truth and gets revisions.

---

ARA Embers LLC · Stillform · Engagement Architecture Engine 2 · Build #3 audit
