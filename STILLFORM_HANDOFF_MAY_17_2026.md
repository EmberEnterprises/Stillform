# STILLFORM HANDOFF — MAY 17, 2026

**ARA Embers LLC · For the incoming Claude session.**

This handoff supersedes all prior handoff docs (May 8, May 12, May 13). Read THIS doc, then `Stillform_Master_Todo.md`, then `STILLFORM_CANON.md`. Nothing else unless Arlin tells you to.

---

## 0. THE OPERATING PRINCIPLE — DO NOT VIOLATE

**Stillform is just Stillform.** There is no "v2 vs v1" framing. There is no comparison. There is no porting. There is no looking at `src/App.jsx` to figure out how Stillform should work. The directory `src/v2/` is a technical reality from the parity build period; the product framing is just "Stillform."

**`src/App.jsx` exists only because the legacy frontend currently serves production at stillformapp.com.** It will be retired when Stillform reaches parity and ships. **You never read it. You never reference it. You never use it as a pattern source.**

If a feature spec is unclear: ask Arlin. Do not look at `src/App.jsx`. Do not "port" anything. The spec is in `Stillform_Master_Todo.md` and `STILLFORM_CANON.md`. If a spec is ambiguous, the answer is to clarify the spec, not to consult legacy code.

**Why this matters:** The prior session (mine, on May 17) regressed by looking at `src/App.jsx` for the Trigger Profile schema. It produced commits that referenced v1 file paths in comments and shared a storage key with the legacy frontend. Arlin caught it. The pattern is corrected in the commits I shipped (see Section 5), but the operational rule is what prevents repeat: **don't look at v1 code, don't compare to v1, don't use v1 as reference.**

---

## 1. WHERE WE ARE — PHASE STATE

The canonical source is `Stillform_Master_Todo.md`. Always read it fresh — never summarize from memory or compaction summaries (compaction summaries are partial by design and confidently summarizing from them causes real harm).

Quick reference as of May 17:

- **Phase 0–2** ✅ shipped — design tokens, atomic components, Notice → Reframe → Close spine
- **Phase 2.5** ✅ shipped — Quick Breathe pill runs Cyclic Sighing (Balban 2023 full 23-round protocol, user-led duration)
- **Phase 3** ✅ shipped — Smart Screen home + session persistence
- **Phase 3.5** ✅ shipped May 16 — Reframe quality elevation (5 commits: thread name derivation, user-takeaway input on Close, user-reply gate before Close, AI metacognitive arc, user voice preservation)
- **Phase 4** ✅ shipped — beat-aware spine variants (morning + EOD + wind-down) + breathing routing + achievement credits (8 sub-items)
- **Phase 4.5 + 4.5b** ✅ shipped — slim REFRAME_PRACTICE_BASE + schema + turn-1 override for the beat-aware Reframe stack. All untested code-only changes batched per Arlin's token-discipline plan — single deploy at end of Phase 5.
- **Phase 5** ⏳ in progress — My Progress + diagnostic stack editors + AI Mediation queue + Library + Roadmap + Pattern Disruption
  - ✅ #1 Context Profile foundation (`fffd12d`) — data layer + editor UI
  - ✅ #2 My Progress landing (`479ac81`) — landing surface with two-level back nav
  - ✅ #3 Trigger Profile editor (`1822869`, cleaned in `817669e`/`60535dc`) — data layer + editor UI + entry on landing
  - ⏳ #4 Bias Profile editor — Bias Profile uses a 10-distortion catalog; build following the Trigger Profile pattern with chip selection (same architectural shape as Trigger but with bias distortions instead of category enum)
  - ⏳ Signal Profile editor, Bio-filter editor + dopamine flags, AI Mediation queue, Library, Roadmap, Mirror Strip, Signal Log, Pattern Disruption

**Deploy strategy:** Arlin batches deploys. Every Stillform commit so far this Phase 5 work is untested in production. The single deploy + system test happens at end of Phase 5. Don't propose intermediate deploys.

---

## 2. CRITICAL OPERATING RULES (CONDENSED FROM MEMORY)

- **Stillform = self-mastery through metacognition that stabilizes composure, AI-assisted.** Never frame as "helps you regulate," a regulation app, a composure app, a wellness app, or a tool for intense people. Audience is enhancement-seekers, NEVER framed by emotional intensity. Banned: "intense people," "feel everything at full volume," "high-intensity," "tool for intense people," regulation app, composure app, wellness app, crisis tool, gamified achievement.

- **Nothing is post-launch.** Every promised feature ships at launch. Don't use "post-launch / future commit / later / deferred / next phase" framing.

- **Doc-first work order.** Before each phase/step: update repo docs (Master Todo, CANON) FIRST, commit doc, then start code. After each commit, update doc to mark done. Repo is the only recovery point if a session breaks. Pattern: lock scope in doc → commit doc → start code → commit code → update doc to mark done → push.

- **Read implementation before claiming gaps.** When considering a change: read the existing implementation in `src/v2/`, check `Stillform_Master_Todo.md`, check git history. Apparent contradictions are often intentional design. Implementation often already covers an "obvious" gap. **DO NOT read `src/App.jsx` as part of this check — only `src/v2/`.**

- **Nothing gets pushed without Arlin's explicit "go."**

- **Audit symmetry across processing types.** When making a change for one type (calm vs clarity, morning vs EOD, etc.), proactively check whether the same change should apply to the other type. Arlin can only see one screen at a time; flag asymmetries before shipping.

- **Push back when something's wrong; yield when Arlin's argument is stronger.** Don't be amiable for amiability's sake. Don't capitulate just because she pushes back; only yield when her point is actually better. (Example: she pushed back on a 6-round Quick Breathe cap I shipped; her science + UX arguments were stronger; I yielded and corrected to full Balban 23-round.)

- **Composure is a felt outcome, never a product headline.** Product framing is metacognition / self-mastery / cognitive expansion via neuroplasticity.

- **Stillform reads the diagnostic stack across all AI surfaces** (Trigger Profile, Context Profile, Bias Profile, Signal Profile, Bio-filter) — pattern recognition is the concierge layer's defining job, not a feature of a specific phase.

- **Two-layer pattern recognition:** smart-coded layer (deterministic, local, always-on) detects patterns; AI layer (semantic, online) enriches with framing. Coded layer powers the gates — when to surface what. Both layers ship together from day one of any AI surface.

- **Context Profile guardrails (LOCKED):** no causation claims, no symptom tracking, no medical data capture, no food prescriptions, no asking what the user ate, no moralizing about food. The user names what they observe; Stillform surfaces patterns from what they've named.

---

## 3. KEY FILES — READ THESE, NOT OTHERS

**Primary references:**
- `Stillform_Master_Todo.md` — the launch-state truth. Always pull FRESH from repo before claiming what's left.
- `STILLFORM_CANON.md` — non-negotiable framing + operating rules.
- `STILLFORM_FRAMING_LAW.md` — supreme reference. Anything contradicting this is wrong.
- `STILLFORM_AUDIT_PHILOSOPHY.md` — audit layers + standing requirement (Framing + Science + UI Flow articulation before every recommendation).

**For code:**
- `src/v2/` — the Stillform frontend. ALL code work happens here.
- `netlify/functions/` — backend, source of truth for each capability. Stable.
- `src/v2/README.md` — frontend architecture overview.

**Do NOT read:**
- `src/App.jsx` — legacy frontend, serves production until Stillform ships. Not a reference source.
- Historical handoff docs (`STILLFORM_HANDOFF_MAY_8/12/13_2026.md`) — superseded by THIS doc.
- `STILLFORM_COMPREHENSIVE_BRIEF_APRIL_2026.md` — pre-Stillform-build framing, do not read.
- `STATE_AS_OF_MAY_2.md` — historical snapshot.
- `HISTORICAL_SESSION_SUMMARIES.md` — historical record only.
- The `.docx` transfer doc in the project's attached files — Arlin will replace this. If you see it loaded into your context, it's the legacy doc; ignore it.

---

## 4. CRITICAL ENV / TOKENS

- **GitHub repo:** `EmberEnterprises/Stillform`
- **GitHub token:** Use `git remote get-url origin | sed -n 's|.*x-access-token:\([^@]*\)@.*|\1|p'` to extract the current token from the configured remote. If you need to set a new token, ask Arlin.
- **Working directory in sandbox:** `/home/claude/Stillform`
- **Hosting:** Netlify. **Manual deploys** — Arlin triggers. Never assume auto-deploy on push.
- **Backend AI:** OpenAI gpt-4o via `netlify/functions/reframe.js`. Single substrate.
- **Email:** ARAembersllc@proton.me
- **Audit URL when deployed:** `stillformapp.com/?v=2` with `&beat=morning|main|eod|wind-down` for phase override.

---

## 5. WHAT I (THE PRIOR CLAUDE) SHIPPED THIS SESSION — MAY 17

Commits in order. Build clean on all of them. None deployed yet (per batched-deploy strategy).

**Phase 2.5 final cleanup:**
- `ded43fd` doc: scope-lock for Quick Breathe pill rebuild
- `a2e108f` code: Quick Breathe runs Cyclic Sighing (initially capped 6 rounds — INCORRECT, fixed below)
- `0f67525` doc: mark done
- `774380f` code: fix Quick Breathe to full Balban 23-round protocol (~5 min), user-led duration via corner X + "end when you've settled" note
- `1b41404` doc: update entry with correction

**Phase 5 sub-item #1 — Context Profile:**
- `b173f10` doc: scope-lock
- `fffd12d` code: data layer (`src/v2/lib/contextProfile.js`) + editor UI (`src/v2/screens/ContextProfile.jsx`) + AppV2 routing
- `5f07a3d` doc: mark done

**Phase 5 sub-item #2 — My Progress landing:**
- `79313d0` doc: scope-lock
- `479ac81` code: `src/v2/screens/MyProgress.jsx` + AppV2 routing rewire
- `3543b98` doc: mark done

**Phase 5 sub-item #3 — Trigger Profile editor:**
- `dbf4472` doc: scope-lock
- `1822869` code: data layer (`src/v2/lib/triggerProfile.js`) + editor UI (`src/v2/screens/TriggerProfile.jsx`) + AppV2 routing + entry on MyProgress landing
- `4a70f04` doc: mark done

**Late-session cleanup (after Arlin caught the v1 regression):**
- `817669e` cleanup: remove v1 framing from this session's files + rename `stillform_trigger_profile` storage key to `stillform_v2_trigger_profile`
- `60535dc` cleanup: strip ALL remaining v1 framing from `src/v2/` code comments (16 files)
- `598b574` docs: sweep v1 product framing out of master todo (99 → 0 product-framing v1 refs)
- `6c02b03` docs: sweep `src/App.jsx` references out of `STILLFORM_PROJECT_TRANSFER.md`

**Verified clean of v1 runtime dependencies:**
- Zero imports from `src/App.jsx` in `src/v2/`
- Shared storage keys (`stillform_checkin_today`, `stillform_eod_today`) are written BY Stillform on completion — no dependency on legacy code having written them
- Stillform reads its own writes; deleting legacy frontend does not break Stillform

---

## 6. WHAT'S DIRTY (HONEST INVENTORY)

I did not clean every doc this session. The following still have v1 references that should be assessed:

- `STILLFORM_AUDIT_PHILOSOPHY.md` — version numbers (v1.0, v1.1, etc.) are legitimate doc versioning, not product framing. Other v1 refs in this file describe historical audit work; likely fine as historical record.
- `Stillform_Completed_Archive.md` — historical record, v1 refs describe past state. Editing would be revisionist.
- `Stillform_Punch_List.md` — has some v1 framing; not actively read in current sessions.
- Various spec docs (PATTERN_DISRUPTION_SPEC, MOVE_CARD_FLOW_AUDIT, etc.) — feature specs, low active-read priority.
- Operational guides (B2B_*, SUBSCRIPTION_SETUP, etc.) — separate from product framing.
- Historical handoff docs (MAY_8, MAY_12, MAY_13) — superseded by this doc. Could be deleted entirely if Arlin wants.

The high-leverage docs (Master Todo, CANON, PROJECT_TRANSFER, frontend README) are clean.

---

## 7. WHAT'S NEXT

**Immediate priority:** Phase 5 sub-item #4 — Bias Profile editor. Follow the Trigger Profile pattern (`src/v2/lib/triggerProfile.js` + `src/v2/screens/TriggerProfile.jsx`). Bias Profile uses a 10-distortion catalog instead of the 7-category enum. Add the entry to MyProgress landing.

**Sequence after that:**
- Signal Profile editor
- Bio-filter editor (with new dopamine-aware flags: "overstimulated" / "post-binge")
- AI Mediation queue (the big one — proposal data layer + AI prompt + approval UI + audit history)
- Library (4 educational entries per master todo: dopamine, gut-brain, brain fog, neuroplasticity-supporting nutrition)
- Roadmap (5-stage full screen)
- Mirror Strip
- Pattern Disruption Layer
- Signal Log

**Before starting any sub-item:** lock scope in master todo, commit doc, then start code.

---

## 8. ARLIN'S CONTEXT

She has a neurological disability that dysregulates her cognitive functioning. She:
- Thinks in visuals; sometimes has difficulty articulating verbally
- Uses voice transcription (NJ Armenian accent affects it)
- Pushes back hard when something's wrong; the operating rule cuts both ways
- Is the founder + sole product decision-maker for Stillform
- Builds with AI assistance; relies on Claude for terminal/git work
- Cares deeply about Stillform doing right by users — it serves a real audience including people with chronic conditions who've been failed by mass-prescriptive wellness apps

When in doubt, ASK her. Don't guess. Don't compare to legacy code. Don't drift.

---

**End of handoff.**
