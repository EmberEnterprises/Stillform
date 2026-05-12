# STILLFORM DOC INVENTORY AUDIT
**ARA Embers LLC · May 12, 2026 · v1.0**

This audit categorizes every markdown doc in the Stillform repo root against STILLFORM_FRAMING_LAW.md. It is the output of step (c) in the May 11–12 framing rebuild sequence (framing law → audit philosophy v2 → doc inventory audit → feature audit → external expert outreach → memory pass 2).

This doc is itself living. Each per-doc finding has a status field that gets updated as work happens. When all targets reach `DONE`, this audit is complete.

---

## Methodology

**Scope:** 52 markdown docs in repo root, 16,476 total lines.

**Categorization:**
- **HIGH priority** — identity / voice / positioning / public-facing docs (10 docs, ~3,167 lines)
- **MEDIUM priority** — feature specs with framing-bearing content (5 docs, ~1,485 lines)
- **LOW priority** — operational / tracking / technical / flow-audit docs (~30 docs). Not audited at inventory level; Layer 0 of the audit philosophy catches framing drift in these at usage time.

**Scanning method per doc:**
1. Quantitative scan — grep counts for banned framings (regulation app, composure app, wellness app, "helps you regulate," "just observe," crisis tool, "tool for intense") and regulation/composure language density
2. Quantitative scan — old-narrow citation list (Lieberman / Mehling / Russell / Lehrer) vs framing-law citations (metacognit / granular / Hoemann / Myin-Germey / Calderone / EMI / self-mastery / Bandura / Kashdan)
3. Content read — assess actual usage of flagged terms (composure used correctly as felt outcome vs incorrectly as product framing) and citations
4. Categorize into action class

**Action classes:**
- **REWRITE** — major framing violations, needs significant content rework
- **SURGICAL EDIT** — localized violations, fixable with targeted changes
- **HEADER UPDATE** — body is historical or operational, just header/warning needs framing-law alignment
- **ADD NOTE** — raw material or working doc, body is fine, just add framing-audit note at top
- **ARCHIVE** — dated artifact, preserve historical record but move out of canonical reading path
- **HOLD** — defer until contingency activates (e.g., Reddit launch contingency)
- **CLEAN** — no framing content, no action

---

## The pattern across all contaminated docs

Most contaminated docs are **self-contradictory** — some sections were updated as framing evolved (correct framing-law-aligned content) while older sections weren't (banned framings preserved). This is partial-update drift over weeks of work. The fix per doc is **systematic reconciliation**, not selective removal.

Also: the word "composure" itself isn't banned — it's a valid felt outcome of the practice. What's banned is "composure architecture," "composure app," "composure tool," "compose yourself" (as imperative) — composure used as product framing rather than as outcome. The audit distinguishes usage at every hit.

---

## HIGH PRIORITY — Findings + Actions

### 1. STILLFORM_PROJECT_TRANSFER.md
**Size:** 683 lines · **Hits:** 59 reg/comp · **Old-narrow citations:** 15
**Action:** REWRITE sections 0, 1; AUDIT section 9 citations; PRESERVE rest
**Status:** DONE (Phase B, commit 9664808) — Sections 0 + 1 fully rewritten under framing law. Section 5 (Locked Decisions) updated. Section 2.5 (May 1 session log) + April 30 conceptual decisions subsection have supersession notes. Section 9 citation audit deferred — Architecture section in Science Sheet has the supersession reference Stillform needs.

**Findings:**
- Section 0 (Vision/Philosophy): "Stillform is composure architecture" (line 14), "precision composure system" (line 16), "Regulate yourself → see yourself clearly → see others clearly → let them in" as Product Philosophy (line 22), "Stillform is composure architecture — this is the product definition, always" in "What Cannot Change" (line 73)
- Section 1 (What Stillform Is): "Stillform is composure architecture" (line 88), "Not meditation. Not therapy. A precision composure system" (line 92 — defines by negation)
- Section 9 (Science Foundation): Line 80 is CORRECT ("Stillform is a metacognition tool... Composure is the outcome") — direct contradiction with sections 0–1
- Sections 2–8 (operational): build state, deploys, feature inventory — preserve

### 2. Stillform_Science_Sheet.md
**Size:** 700 lines · **Hits:** 81 reg/comp · **Old-narrow citations:** 24
**Action:** Section-by-section audit + reconciliation + citation expansion
**Status:** PARTIAL (Phase C critical fixes done) — Top-of-doc supersession note added pointing at framing law. Architecture section rewritten with framing-law alignment + full citation spine added (Hoemann 2021, Kashdan/Barrett/McKnight 2015, Calderone 2024, Frontiers 2026, Myin-Germeys 2016/2018, Hitchcock 2024, Bandura 1977 all integrated). "Window of Tolerance (The Entire Product Purpose)" section fully rewritten as supporting framework for body-first noise-cutters only. Remaining ~30 feature sections deferred to subsequent sessions — Layer 0 of audit philosophy catches drift at usage time.

**Findings:**
- Architecture section (lines 9–22): CORRECT — "Stillform is a metacognition tool. Composure is the outcome."
- "Window of Tolerance (The Entire Product Purpose)" section (lines 380–395): DIRECT CONTRADICTION with Architecture. Claims to be the "entire product purpose," frames all tools as "window management." Violation.
- Multiple other feature sections likely have similar local violations — needs section-by-section read
- Missing key framing-law citations: Hoemann (2021), Kashdan/Barrett/McKnight (2015), Calderone (2024), Frontiers (2026), Myin-Germeys (2016/2018), Hitchcock (2024), Bandura (1977)
- Largest doc in the audit; 2–3 sessions of work given size

### 3. STILLFORM_COMPREHENSIVE_BRIEF_APRIL_2026.md
**Size:** 410 lines · **Hits:** 27 reg/comp · **Old-narrow citations:** 2
**Action:** REWRITE "What Stillform Is" + Core Idea + Identity Lines; preserve operational sections
**Status:** DONE (Phase B, commit 9664808) — Identity sections fully rewritten under framing law. Layer 1 in return-loop architecture renamed from "Regulation tool" to "Practice surface." Locked Decisions updated.

**Findings:**
- Line 10: "Stillform is a composure architecture" — violation
- Line 12: "Category: Composure Architecture" — violation
- Line 22: "regulate yourself → see yourself clearly → see others clearly → let them in" — Product Philosophy starts with banned framing
- Line 32: "Composure architecture" in Identity Lines (locked) — violation

### 4. Stillform_Strategic_Roadmap.md
**Size:** 241 lines · **Hits:** 23 reg/comp · **Old-narrow citations:** 1
**Action:** SURGICAL EDIT — rename Layer 1 from "Regulation Tool" + reframe category language
**Status:** DONE (Phase B, commit 9664808) — Layer 1 renamed to "Practice Surface." "Regulation/wellness category" reframed. "Emotion Regulation Shows the Strongest Effect" section reframed. Microbiases section rewritten with concept-rich-perception framing.

**Findings:**
- "Layer 1: The Regulation Tool (SHIPPED)" — frames existing app as regulation tool
- "Composure work... documented graduation problem in the regulation/wellness category" — categorizes Stillform as regulation/wellness
- Three-layer architecture (Regulation Tool / Return-Loop / Engagement Craft) — built on regulation premise but architecture concept is sound
- Strategic thinking preserved; layer naming + category language updates

### 5. KETAREVIVE_ONEPAGER.md
**Size:** 62 lines · **Hits:** 5 reg/comp · public-facing B2B
**Action:** REWRITE under framing law
**Status:** DONE (Phase A, commit 76dbc8e) — Full rewrite. Stillform positioned as metacognition practice; regulation tools framed as noise-cutters; composure as one felt outcome.

**Findings:**
- Subtitle: "A composure companion for the integration window" — violation
- "It is not therapy" — defines by negation
- "Breathing patterns... regulate the nervous system... composure tracking" throughout — regulation/composure framing
- Public-facing B2B material — high stakes if used as-is

### 6. COMPOSURE_SELF_MASTERY_LEGIBILITY.md
**Size:** 104 lines
**Action:** ARCHIVE (move to archive/ subdirectory)
**Status:** DONE (Phase A, commit 76dbc8e) — Moved to archive/ with strengthened warning header.

**Findings:**
- Has "DATED ARTIFACT" warning header (lines 1–23) — rejected actions documented
- Body still contains framing-violating "load-bearing paragraph" (lines 37–39) that future-Claude could grab
- Preserves Arlin's thinking trail; archive removes from canonical reading path

### 7. Stillform_Reddit_Draft.md
**Size:** 169 lines · **Hits:** 7 reg/comp
**Action:** HOLD with clear "DO NOT USE WITHOUT FRAMING REVIEW" header
**Status:** DONE (Phase A, commit 76dbc8e) — HOLD notice added at top.

**Findings:**
- Marked as contingency-only (Reddit no longer launch step per Apr 29 lock)
- Heavy framing violations throughout: "composure tool," "Regulate your body. Reset your thinking," defines by negation
- If contingency activates, full rewrite under framing law required

### 8. Stillform_Research_Assessment.md
**Size:** 193 lines · **Hits:** 14 reg/comp · **Old-narrow:** 2
**Action:** UPDATE HEADER ONLY
**Status:** DONE (Phase A, commit 76dbc8e) — Warning header updated to point at framing law as supreme reference.

**Findings:**
- Has "HISTORICAL DOCUMENT — SUPERSEDED FOR FRAMING PURPOSES" warning
- Warning header itself reflects pre-framing-law thinking ("self-mastery through metacognition that stabilizes composure")
- Body is historical research due diligence; preserve as-is
- Update warning to point to STILLFORM_FRAMING_LAW.md as supreme reference

### 9. SCRATCH_FOUNDER_VOICE.md
**Size:** 180 lines · **Hits:** 6 reg/comp
**Action:** ADD NOTE at top
**Status:** DONE (Phase A, commit 76dbc8e) — Framing audit notice added.

**Findings:**
- Raw founder-quote material, already marked "Review before using publicly"
- Arlin's personal quotes are source material — not contaminated framing
- Some AI reflections (Gemini's) mention "Two Regulation Pathways" / "find your center" — framing-adjacent
- Add note: "Public use requires framing audit against STILLFORM_FRAMING_LAW.md"

### 10. TERMLY_TOS_ACTION_BRIEF.md
**Size:** 125 lines · **Hits:** 0
**Action:** CLEAN — no action needed
**Status:** DONE

---

## MEDIUM PRIORITY — Spot-Check Findings

### PLAIN_LANGUAGE_SCIENCE_CARD_SPEC.md
**Size:** 493 lines · **Hits:** 27 reg/comp · 20 metacog/mastery
**Action:** DEEPER CHECK NEEDED — mixed signal, could be balanced (regulation tools in service of metacognition) or partial contamination
**Status:** PENDING

### STILLFORM_ENGAGEMENT_ARCHITECTURE.md
**Size:** 335 lines · **Hits:** 14 reg/comp · 3 metacog/mastery
**Action:** DEEPER CHECK NEEDED — May 7 Engagement Architecture decision doc
**Status:** PENDING

### CLOSING_LANGUAGE_CANDIDATES.md
**Size:** 245 lines · **Hits:** 8 reg/comp · 2 metacog/mastery
**Action:** DEEPER CHECK — closing language is locked per memory, verify framing alignment
**Status:** PENDING

### SELF_MODE_REDESIGN_RESEARCH.md
**Size:** 412 lines · **Hits:** 1 banned · 4 reg/comp · 4 metacog/mastery
**Action:** Low signal, scan-only verification
**Status:** PENDING

### CHIP_DEFINITIONS_DRAFT.md
**Size:** 92 lines · **Hits:** 0 banned · 2 reg/comp
**Action:** Likely CLEAN, scan-only verification
**Status:** PENDING

---

## LOW PRIORITY — Not Audited at Inventory Level

~30 operational/tracking/technical/flow-audit docs:
- Stillform_Master_Todo.md (1151) — operational
- Stillform_Punch_List.md (527) — operational
- Stillform_Completed_Archive.md (546) — historical
- HISTORICAL_SESSION_SUMMARIES.md (221) — historical
- STILLFORM_HANDOFF_MAY_8_2026.md, STATE_AS_OF_MAY_2.md, TRANSFER_PROMPT_MAY_2.md, STILLFORM_LAUNCH_TRANSFER_NEXT.md — transfer docs
- All feature specs (BODY_SCAN_WHAT_SHIFTED, MY_PROGRESS_REDESIGN, PATTERN_DISRUPTION, SETTLED_CHIP, SETTINGS_REWRITE, LOW_DEMAND_PHASE_2/3, THREE_CATEGORY_DATA_FEED, COGNITIVE_FUNCTION_MEASUREMENT × 2, RESEARCH_PREP_SELF_MODE_AND_EVIDENCE_CALLOUTS) — operational
- All flow audits (MOVE_CARD, PRE_EVENT_BRIEF, TODAYS_BRIEF, TRIGGER_PROFILE_PHASE_2, STILLFORM_UI_FLOW_AUDIT) — operational
- Technical docs (BUILD_GUIDE, WATCH_GUIDE, SHARE_EXTENSION_GUIDE, SUBSCRIPTION_SETUP, METRICS_SETUP, README_GUIDES, AI_REGRESSION_×3, GPT4O_GUARDRAILS_AUDIT, STILLFORM_DESIGN_SYSTEM, Test_Day_Plan)

Framing drift in these docs is caught by Layer 0 (Framing Audit) of STILLFORM_AUDIT_PHILOSOPHY.md v2.0 at the moment they're used for feature work.

---

## Execution Order

**Phase A — Quick Wins (small surface area, build momentum):**
1. COMPOSURE_SELF_MASTERY_LEGIBILITY.md → archive
2. Stillform_Research_Assessment.md → header update
3. SCRATCH_FOUNDER_VOICE.md → add note
4. Stillform_Reddit_Draft.md → hold notice
5. KETAREVIVE_ONEPAGER.md → rewrite (62 lines)

**Phase B — Framing-Defining Rewrites:**
6. Stillform_Strategic_Roadmap.md → rename Layer 1 + category reframe
7. STILLFORM_COMPREHENSIVE_BRIEF_APRIL_2026.md → rewrite identity sections
8. STILLFORM_PROJECT_TRANSFER.md → rewrite sections 0–1

**Phase C — Deep Audit:**
9. Stillform_Science_Sheet.md → section-by-section reconciliation + citation expansion

**Phase D — Medium Priority Spot-Checks:**
10. PLAIN_LANGUAGE_SCIENCE_CARD_SPEC.md (deeper)
11. STILLFORM_ENGAGEMENT_ARCHITECTURE.md (deeper)
12. CLOSING_LANGUAGE_CANDIDATES.md (verify)
13. SELF_MODE_REDESIGN_RESEARCH.md (scan)
14. CHIP_DEFINITIONS_DRAFT.md (scan)

---

## Versioning

**v1.0 — May 12, 2026.** Initial inventory after framing rebuild. 14 docs identified for action across HIGH and MEDIUM priorities. Execution sequence A → B → C → D defined.

**v1.1 — May 12, 2026 (same day, end of session).** Phase A (quick wins) DONE: 5 of 10 HIGH targets complete (commit 76dbc8e — archive of COMPOSURE_SELF_MASTERY_LEGIBILITY, header updates on Research_Assessment / FOUNDER_VOICE / Reddit_Draft, full rewrite of KETAREVIVE_ONEPAGER). Phase B (framing-defining rewrites) DONE: 3 of 10 HIGH targets complete (commit 9664808 — Strategic_Roadmap surgical edits, COMPREHENSIVE_BRIEF identity rewrites, PROJECT_TRANSFER sections 0+1+5+supersession notes). Phase C (Science Sheet) CRITICAL FIXES DONE: top-of-doc supersession note + Architecture section strengthened with framing-law citation spine + "Window of Tolerance (The Entire Product Purpose)" rewritten as supporting framework only. Remaining Phase C work (section-by-section audit of 30+ feature sections) and all of Phase D (medium priority spot-checks) deferred to subsequent sessions — Layer 0 of audit philosophy catches drift at usage time.

**Status summary as of v1.1:** 10 of 10 HIGH priority targets have meaningful framing-law alignment (some DONE, Science Sheet PARTIAL with critical contradictions fixed). 5 MEDIUM priority docs still pending. The framing rebuild's gate-keeping infrastructure is in place: STILLFORM_FRAMING_LAW.md (supreme reference), STILLFORM_AUDIT_PHILOSOPHY.md v2.0 (Layer 0 Framing Audit enforces the law), and the most actively-used docs are aligned. Subsequent feature work runs under the new framing.

This doc updates as targets reach DONE status. When all targets are DONE, the inventory audit is closed.
