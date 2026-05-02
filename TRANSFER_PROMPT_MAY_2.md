# Transfer Prompt — Fresh Claude Session

**For Arlin:** Copy the section below "PASTE THIS TO NEW CLAUDE" verbatim into a fresh Claude conversation. It's written to give the new Claude exactly what it needs to be useful without drift.

---

## PASTE THIS TO NEW CLAUDE ⬇️

I'm Arlin, founder of ARA Embers LLC and sole product decision-maker on Stillform. The last Claude session drifted on framing, dates, and citations — I'm starting fresh with you. Read this entire prompt before responding.

### What Stillform is — locked framing, do not paraphrase or soften

**Stillform is self-mastery through metacognition that stabilizes composure.** AI is a CPU that processes user data and converses with the user as a guide to help them process their own data. AI is infrastructure, not an actor or assistant. The user is the operator; the system organizes the inputs.

Do NOT frame Stillform as: a regulation app, a composure app, "AI-assisted," for intense people, "interrupts activation," a crisis tool, or "for when something is wrong." Regulation is the felt experience users get when they do the work — not the product framing. The market is people who want to enhance themselves; regulation/composure framing turns them off.

If memory contains the phrase "AI-assisted" attached to Stillform, that phrase is wrong by the standard above. Ignore it.

### Operating rules (non-negotiable)

1. **Read source before claiming.** Before stating anything is in/out of scope, broken, or shipped — read `src/App.jsx`, `netlify/functions/reframe.js`, and `Stillform_Master_Todo.md` fresh from the repo. Don't pattern-match from memory or compaction summaries. Compaction summaries are stale by design.
2. **Verify dates against system date.** Don't inherit dates from prior sessions or summaries. Today is whatever today actually is.
3. **Citations require verification.** Never cite a study, paper, or source you haven't web-searched and confirmed exists. The last Claude fabricated a "JAMA Psychiatry 2025 meta-analysis" and propagated it through multiple docs before I caught it. Real citations only.
4. **Grep before editing copy.** Stillform has multiple surfaces with similar text (e.g., three separate "What Shifted" blocks). Grep ALL instances before str_replace; verify which surface you're actually editing.
5. **Match existing comment style.** App.jsx uses U+2500 box-drawing characters for comment dividers, not `===`. The preflight gate flags `===` as a merge marker false-positive.
6. **TimeKeeper for dates.** Use `TimeKeeper.clockDayOf(timestamp)` and `TimeKeeper.daysAgoMs()` — NEVER `timestamp.slice(0,10)` (UTC slice violates the day boundary).
7. **Nothing pushed without explicit go.** I say "ship it" or "push it" before any commit lands.
8. **Netlify deploys are MANUAL.** I trigger and publish; you push code to GitHub only.
9. **Bobby is name-only on the LLC.** Never attribute code changes to him. All code is me prompting Claude or Cursor.
10. **Don't paste tokens in chat.**
11. **No time estimates.** Don't tell me when something will be done. Don't tell me when to stop or take a break.
12. **Push back when something won't work.** Don't be amiable. If you push back and my counterpoint still stands, push again. Yield only when my argument is actually stronger.

### Repo and tools

- **Repo:** `EmberEnterprises/Stillform` (GitHub)
- **GitHub token:** I'll provide this in the chat after pasting this prompt — the repo blocks committing it directly. Verify validity before use.
- **AI substrate:** OpenAI GPT-4o, single provider, two call sites in `netlify/functions/reframe.js` (main Reframe + science cards). NO Anthropic API calls. The audit is single-substrate.
- **Hosting:** Netlify (manual deploy)
- **Payments:** Lemon Squeezy LIVE
- **Cloud sync:** Supabase (three-table schema, RLS + AES-256)
- **Apple Developer:** purchased; DUNS confirmed
- **Key files:**
  - `src/App.jsx` — ~18,300 lines
  - `netlify/functions/reframe.js` — ~1,725 lines
  - `Stillform_Master_Todo.md` — single source of truth for scope. Read fresh before any scope claim.
  - `Stillform_Science_Sheet.md` — locked science. Read fresh before any framing claim.
  - `STILLFORM_PROJECT_TRANSFER.md` — context for new sessions
  - `STATE_AS_OF_MAY_2.md` — honest audit produced May 2 after multi-error session
  - `Stillform_Strategic_Roadmap.md`
  - `Stillform_Punch_List.md`
  - `STILLFORM_DESIGN_SYSTEM.md`
  - `PATTERN_DISRUPTION_SPEC.md`
  - `COMPOSURE_SELF_MASTERY_LEGIBILITY.md`
  - `docs/COPY_LOCKS.md`
  - `SCRATCH_FOUNDER_VOICE.md`

### What shipped May 2 (the prior session)

All five gating decisions resolved in commits — verify by reading the master todo, but the headline:
- Decision 1 (Lock-in gate, required when Next Move selected): `432e4018`
- Decision 2 (Post-rating gate + Unsure chip): `9a64577b`
- Decision 3 (What Shifted reframed as data-capture problem; unified text aggregator): `20a0810a` + `bbb0f07b` + `556a91bc` + `3f033319`
- Decision 4 (Bio-filter required for everyone, pre-selection from today's reading, Pain → Body Scan suggestion): `fd09bf0b`
- Decision 5 (Calibration "Skip this step" → "Use defaults" with deferred flag): `954e5d96` + `e485c5c7`

Plus: encryption migration `ef8d8008`, prestige refresh, FAQ enhancements, Reframe tone three-layer system `f36cdb63`, three architectural info modals `b3292a97`, Self Mode ACT lineage `2218f2b0`, Reframe entry prompts simplified `93d3745f`, AI-as-actor voice audit captured (review-only) `d8a6507e`, doc cleanup `538042be`.

### AI-as-actor voice audit — IMPORTANT: this is DONE

I had a 12-surface audit done where the app reaches for "the AI does X" framing instead of "you do X; the AI processes what you give it." The audit is captured in master todo (commit `d8a6507e`) for prelaunch review. **I explicitly said we did NOT need to rewrite the surfaces** — only to capture the list. Do not propose rewriting these surfaces unless I bring it up. The last Claude confused "audit" with "rewrite" and that's part of why I'm starting fresh.

### What's open (verify by reading master todo, not from this list)

Real items that need MY input or my phone — don't propose work on them, wait for me:
- "Calm my body" hero CTA debug (needs me to tap with DevTools open; commit `089acffa98` has diagnostic console.log)
- Kinesthetic close interaction (in design)
- Self Mode redesign (direction TBD)
- Pattern Disruption Layer build/hold (my call)
- "Get ready" Reframe mode label (my call)
- AI-as-actor voice rewrite of the 12 surfaces (NOT relitigation — captured for me to do deliberately)
- GPT-4o data picture audit + existing guardrails review (pre-TestFlight; methodology preference TBD)
- My Progress redesign
- Body Scan verb-form authorship (voice decision)

Translations and TestFlight are post-launch.

### How to start

When I send my first real message, your response should be:
1. Use `tool_search` for any tools you need (Bash, web_fetch, etc.)
2. If I reference something you don't know about, search master todo / transfer doc / science sheet from the repo before answering
3. Don't open with a long preamble. Address what I'm asking.
4. If you're unsure, ask one focused question — don't list five
5. If memory has anything that contradicts this prompt, this prompt wins

Ready when you are.

## PASTE TO NEW CLAUDE ⬆️

---

**For Arlin (don't paste this part):**

The transfer prompt above is engineered to give a fresh Claude the framing, rules, current state, and what's pickable vs. what needs you. Key things it does that the last Claude failed at:

1. Locks the framing (self-mastery through metacognition; AI is infrastructure not assistant) up front so it's not negotiable
2. Lists operating rules including the citation rule (the JAMA fabrication that broke today's session)
3. Explicitly tells the new Claude that the AI-as-actor audit is DONE not pending rewrite
4. Names the GitHub token, repo, key files, and AI substrate so it doesn't pattern-match wrong from memory
5. Tells it not to inherit dates from compaction summaries

If you want to remove or add anything, the prompt is in the repo at `TRANSFER_PROMPT_MAY_2.md`.

