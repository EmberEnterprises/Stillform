# Research Prep — Self Mode Redesign + 7-Session Evidence Callouts

**Last updated:** May 7, 2026
**Status:**
- *Self Mode redesign:* **Active research item.** Engagement architecture (May 7) clarified that Mirror/Achievement/Roadmap surfaces survive AI being down, but those answer "what does the user see about progress" — NOT "what does the user actually DO when activated and AI is unavailable." Self Mode's processing flow is its own design challenge. Detailed research + design proposal in **SELF_MODE_REDESIGN_RESEARCH.md**.
- *7-session evidence callouts:* **Absorbed into engagement architecture.** Become Roadmap markers tied to specific stages with evidence-backed dose-response timelines.

The notes below remain as supplementary research-frame for both items.

---

## Item 5 — Self Mode Engagement Craft + Innovative Design

### Why this is hard

Self Mode currently exists as the AI-down fallback — when the Reframe API is unreachable (network out, OpenAI 5xx, deploy in progress, fail-streak triggered, etc.), the user is routed into a deterministic flow that doesn't depend on GPT. This means it's been engineered as a *degradation*, not as a mode in its own right. The risk: when users hit Self Mode they feel like the app is broken. That's a churn moment, not a practice moment.

The question Arlin is asking is whether Self Mode can be designed as a *distinct, valuable mode* — not a downgrade.

### What currently exists (read before researching)

- **Self Mode trigger conditions** — search for `selfMode` and `aiDown` in `src/App.jsx`. Current triggers include: 3+ consecutive AI failures, explicit user toggle, network offline detection.
- **Self Mode UI surfaces** — search for `screen === "selfMode"` or similar conditional render blocks. Compare to Reframe entry surfaces.
- **Health endpoint** — `/.netlify/functions/health.js` is the AI-availability probe used to detect when Self Mode should auto-exit back to AI Reframe.
- **Existing fallback templates** — `netlify/functions/reframe.js` deterministic templates around line 650+ (liability redirects, intent validation failures, generic fallback). These are content models for what "Self Mode without GPT" can produce.

### Research questions

1. **What does engagement craft mean for a regulation tool?**
   Most engagement research is from gaming and consumer apps (variable rewards, streaks, push). Stillform's engagement model is the *opposite* — the goal is for the user to come back because the practice produces a felt experience of regulation, not because we manipulated their dopamine. What does "engagement craft" look like for a tool that explicitly rejects gamification?
   - Survey: existing wellness apps and what they get right/wrong (Headspace, Calm, Insight Timer, Othership, Othership, Wim Hof App, How We Feel)
   - Counterexamples: what gamification looks like in this space and why it's wrong for Stillform (streaks, rewards, leaderboards)
   - Anchor: Stillform's existing engagement models — return-loop architecture, plain-language neuroscience, post-session science cards. These are the lineage Self Mode needs to extend, not replace.

2. **What is the felt experience of "AI is unavailable" supposed to be?**
   - Option A — "AI is the user's compass; without it the app is incomplete" (current implicit framing)
   - Option B — "AI is one of multiple modes; Self Mode is a deliberately stripped-back practice surface that some users may prefer" (needs design)
   - Option C — "Self Mode is for situations where the user doesn't want AI mediation — by choice, not by failure" (needs UX research with target users)
   The right answer probably depends on what target users actually want. Worth a small qualitative pass with current testers.

3. **What's the innovative design opportunity?**
   - Is there a competitor doing this well? (Probably not — most apps either fail catastrophically without their AI/cloud or have basic offline modes that feel exactly that.)
   - Is there a sister discipline to draw from? (e.g., physical practices like yoga and martial arts that don't have an AI coach but still produce quality engagement — what makes them work?)
   - What would a Self Mode look like that's so good users intentionally choose it sometimes?

### Suggested research path

1. **Codebase audit** (1 session) — read all current Self Mode triggers, UI, content. Document the actual user-facing experience today.
2. **Competitor scan** (1 session) — pick 5-7 wellness/mindfulness apps, document their offline/disconnected behavior. Look for innovation, not parity.
3. **Conceptual literature** (1 session) — short scan on engagement craft outside gaming (Mihály Csíkszentmihályi flow, Kelly McGonigal embodiment, Stuart Brown play). What carries to a regulation tool?
4. **User input** (lightweight, post-launch) — once the launch cohort exists, ask 5-10 users what they'd want from a "no-AI" mode. The current testers (Bobby, Ava, etc.) can also weigh in pre-launch.
5. **Design proposals** (1 session) — present 2-3 directions to Arlin for selection. Then design and build.

### Anti-pattern flags

- Don't gamify Self Mode (streaks, rewards). That's a betrayal of the core brand.
- Don't brand Self Mode as "for crisis" or "for emergencies." The app isn't crisis management — composure architecture works in stillness too.
- Don't build a separate brand-feel for Self Mode. It's still Stillform.

---

## Item 7 — 7-Session Review Evidence Callouts

### Context

The plain-language neuroscience surface shipped in late April 2026 with the v5 verified corpus (22 studies, 50 multi-angle findings, post-session science cards). The next layer of that surface is the *longitudinal callout*: at session N, surface evidence that something is changing across the user's practice — not generic neuroscience, but personalized observation linked to verified literature.

The question Arlin is asking is whether the milestone count (currently "7 sessions") is right and what evidence should be presented at that milestone.

### What currently exists

- **`Stillform_Science_Sheet.md`** — v5 verified corpus, single source of truth for what claims Stillform can make.
- **`stillform_milestone_7_seen` localStorage key** + `milestone7Seen` state in `src/App.jsx` ~13712 — current 7-session milestone tracking.
- **Practice Signals trends** (just shipped this batch) — first/latest values per CFM candidate, rendered with anti-Lumosity framing. This is the *closest existing surface* to what evidence callouts will look like.
- **Post-session science cards** — already pulling from verified corpus per session. The 7-session callout would be the next abstraction layer up: "across these N sessions, here's what the research predicts is happening."

### Research questions

1. **Is 7 the right number?**
   - Plasticity timeline literature: how long does it take for neural change to become observable in self-report? (Lazar 2005 — 8 weeks; Tang 2010 — 11 hours; Holzel 2011 — 8 weeks. These are MBSR/meditation studies, not direct analogs.)
   - Dose-response in regulation practice: at what frequency/duration does benefit become detectable? Worth a pass through the corpus to see which findings have the shortest dose-to-effect window.
   - User psychology: 7 days, 7 sessions, 7 weeks — different units. Which is the right one for "you can start to expect change"?

2. **What evidence should be presented at the milestone?**
   - Personal trend data (Stillform-internal): pre-rate vs post-rate trajectories, tool path consolidation, chip vocabulary expansion, function-check trends from Practice Signals.
   - Verified corpus claims (Science Sheet) keyed to what the user has actually been practicing (not generic).
   - Anti-Lumosity rule: never composite scores, never "your brain is X% better." Specific function. Specific change. Specific timeframe.

3. **What's the framing?**
   - Honest: "These are the changes the literature predicts at this dose. Here's what your data shows."
   - Inviting: "You've done enough work that the research starts to apply to you specifically."
   - Cautious: "These are predictions, not measurements. Your felt experience is the ground truth."

### Suggested research path

1. **Corpus pass** (1 session) — re-read Science Sheet specifically looking for findings with short-dose evidence (4-8 sessions). Tag those as candidates for the 7-session callout.
2. **Internal data audit** (1 session) — look at what data Stillform actually has after 7 sessions of a typical user. Pre/post rates, tool paths, chip vocabulary, body scan tension trends, focus check history. What's robust enough to show as evidence?
3. **Milestone count** (45 min) — pick a number with rationale. Could be 7. Could be 5. Could be variable per dimension.
4. **Design proposal** (1 session) — wireframe the surface. Where it appears, what it shows, what the user can do with it.
5. **Build** — once Arlin signs off on the proposal.

### Anti-pattern flags

- Don't make this a streak surface. "You've done 7 in a row!" is gamification.
- Don't make claims about *the user's* brain change — only what the literature predicts at this dose.
- Don't lock the milestone to consecutive practice. Real lives have gaps. Practice volume matters, not perfection.

---

## What's not in this doc

- The actual research output — that's the next phase.
- Specific design proposals — those come after research.
- Build estimates — those come after design proposals.

This document is the *frame* for the research, not the research itself. Per Arlin's May 7 directive: research first, design second, build third.
