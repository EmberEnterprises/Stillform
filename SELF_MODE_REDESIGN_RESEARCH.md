# Self Mode Redesign — Research & Design Proposal

**Status:** Research + design proposal, May 7, 2026. Per Arlin's May 7 directive. Awaiting sign-off before any build.
**Author of this draft:** Claude, synthesizing existing implementation + literature + design principles.
**Replaces "absorbed into engagement architecture" framing.** Self Mode is its own design challenge — the engagement architecture's deterministic surfaces (Mirror, Achievement, Roadmap) survive AI being down, but those answer "what does the user see about progress." Self Mode answers "what does the user actually DO when activated and AI is unavailable." Different problem.

---

## 1. The problem in concrete terms

The user is mid-spiral. They opened Stillform. AI is down — could be a network hiccup, a deploy in progress, an OpenAI 5xx, the user's offline. They expected Reframe and got an unavailable surface.

What's currently there: a 5-step Metacognitive Therapy flow (Wells 2009 MCT) — Notice / Name / Recognize / Perspective / Choose. Each step is a free-text prompt. The user types into 5 paragraphs. Last step routes to a tool (Breathe, Body Scan, etc.).

The science is right. The flow is sound. The execution is the problem.

What goes wrong with the current implementation:

1. **Heavy typing load when the user is cognitively narrowed.** High arousal compresses working memory and attention. The user opening Self Mode is in the worst possible state to write five paragraphs of structured self-reflection. The interface asks more cognitive work than the user has available.

2. **No use of the user's accumulated data.** Every Self Mode session starts blank. The user has spent weeks building a Bias Profile, a Signal Profile, saved Reframes, journal entries, Pattern Disruption history — none of it shows up in Self Mode. The app forgets who it's talking to the moment AI is gone.

3. **Visually it reads as a downgrade.** Same general layout as AI Reframe but with the "good part" removed. Users in this audience (high-intensity, neurodivergent, hates manipulation) read this as "the app is broken right now" — which is the worst possible read.

4. **No skip path for high-arousal states.** Linear 5-step flow with required input. A user in a panic spiral can't complete it and gets stuck mid-flow with no graceful exit.

5. **Closing routes to other tools but doesn't carry the work forward.** The last step says "Choose" and offers Breathe / Body Scan / etc. — but the work the user did in Self Mode (the 4 prior steps of self-reflection) doesn't accompany them into the chosen tool. The processing is done in isolation and then discarded.

6. **No feedback that anything happened.** Effort with no payoff. The user did 5 prompts of work and the app responds with "ok pick a tool." That's the opposite of the "felt experience" Stillform's other surfaces produce.

---

## 2. The user's actual state when they hit Self Mode

Critical to design from this state, not from a calm hypothetical user:

- Activated. Why else would they open the app?
- Possibly mid-spiral. Heart rate elevated, attention narrowed.
- Cognitively bandwidth-limited. Working memory reduced 30-40% under high arousal (Eysenck attentional control theory).
- Already let down once today (the AI they expected isn't there).
- Decision-making compromised. Six options is five too many.
- Time-pressured (often). The thing that activated them isn't going to wait while they journal for 10 minutes.

This is not the state in which to ask the user to type free text into five sequential prompts.

---

## 3. Design principles (locked)

**The user's own past self is the answer, not generic prompts.**
The thing that distinguishes Stillform from any other regulation app is that it's been collecting the user's self-knowledge. Bias Profile, Signal Profile, saved Reframes, journal entries, Pattern Disruption history — that's a cached intelligence about THIS specific user. Self Mode should USE it. Not regenerate from scratch. The user's past self speaks to their current self.

**Body-first when arousal is high.**
When activated, language doesn't work yet. Body does. Self Mode entry should default to a somatic anchor before any verbal processing is asked of the user. This matches Stillform's existing four pillars (body first, then thought).

**One thing on screen at a time.**
Decision load is the enemy. Each step shows one prompt, one or two responses, no menus, no nav. The user processes one beat then advances.

**Skip is a primary action, not a secondary.**
At every step, an explicit "I can't do this right now" path exits to a body-only flow (breathing + Disruptor). No shame, no friction.

**The work has to LAND somewhere.**
Whatever the user does in Self Mode gets saved as their work. Pulled forward to the next session's AI Reframe (when AI is back). Surfaced in the Mirror. Counted in Achievement. The user's processing never disappears.

**Self Mode is a deliberate choice, not a fallback.**
Visual treatment, copy, pacing all should make Self Mode feel like an intentional surface some users might choose even when AI is up. Not a degraded version of Reframe.

**Precision flawless prestige.**
Every screen earns its existence. No filler, no padding, no "you got this!" Every word, every interaction, every animation considered. The level of execution is what the price tag promises.

---

## 4. Science backing

### 4.1 Metacognitive Therapy (Wells 2009)

The existing 5-step flow (Notice / Name / Recognize / Perspective / Choose) is grounded in Wells's Metacognitive Therapy framework. The mechanism: stepping out of the contents of thought to observe the process of thinking. Detached mindfulness as the operative move, not problem-solving on the thought itself.

**What survives in the redesign:** the metacognitive stance, the noticing → naming → choosing arc.

**What changes:** the delivery. Less typing, more selection-based input where appropriate. Cached personal data fills in what AI would otherwise generate.

### 4.2 Self-distancing (Kross & Ayduk 2017)

Robust evidence that referring to oneself in the third person, or accessing past-self perspective, improves emotional regulation in real-time. People who reflect on a stressor from a temporally-distant perspective show lower physiological reactivity and clearer thinking.

**Application:** Self Mode can surface the user's past saved Reframes and journal entries as "your past self said this." That's literal self-distancing — the user reads their own past insight, written in calmer state, applied to current moment.

### 4.3 Implementation intentions (Gollwitzer 1999)

Pre-formed if-then plans outperform freeform decision-making under cognitive load. "If I notice catastrophizing, then I will [specific move]" is more effective than "what would help right now?"

**Application:** Self Mode can surface the user's bias profile + previously-effective moves as a structured if-then prompt: "Catastrophizing is showing up. Last time, [past saved reframe] is what helped." User can accept, modify, or skip.

### 4.4 Polyvagal theory (Porges 2011) + somatic experiencing (Levine 1997)

Body-based regulation interventions work without verbal mediation when arousal is high. Cyclic sighing, vagal toning, posture shift, temperature attention — these don't require cognitive bandwidth.

**Application:** Self Mode entry defaults to a body-first 60-90 second anchor before any verbal processing. The Disruptor tool already shipped is one ready-made variant; Self Mode could use it directly.

### 4.5 Narrative therapy (White & Epston 1990)

The self talks to the self over time. Externalizing problems and internalizing wisdom across time periods produces durable insight. Reading what you wrote three weeks ago about a similar moment is therapeutic in itself.

**Application:** Self Mode's "your past self" surface — pulling saved Reframes, journal entries, patterns the user has named — operationalizes this directly.

### 4.6 Cognitive load under arousal (Eysenck attentional control theory)

Working memory is reduced 30-40% under high arousal. Selection-based input (tap a chip, pick from 2-3 options) outperforms free-text input under this load. Free text is fine for low-arousal reflection but fails for in-the-moment processing.

**Application:** Self Mode should be selection-first with optional free-text expansion for users who want it. Not a 5-paragraph fillable form.

---

## 5. Concept proposal — "Past Self / Present Self"

**LOCKED May 7, 2026** (Arlin sign-off).

The frame: Self Mode is where your past self talks to your present self. But the deeper claim — and the one that lands the brand — is constitutive, not transactional. The user's past self isn't a resource the app borrows from. It IS what the user currently is. Influence and experience are what every present output rests on. Stillform doesn't store the user's data and play it back — it reflects them, accumulated, back to themselves.

This is why the "Past Self / Present Self" framing earns its keep beyond Self Mode specifically:

- It explains why Stillform's data architecture matters at all (the data isn't features, it's the user's accumulated self)
- It positions Stillform against apps that treat user data as inputs to manipulate (we treat it as identity to reflect)
- It gives Self Mode a reason to exist beyond AI-down (some users may choose Self Mode even when AI is up because reading their own past wisdom is more grounding than receiving generated insight)
- It aligns with the broader Stillform thesis (composure architecture is built FROM the user's accumulated self-knowledge, not imposed on it)

Functional version (what Self Mode does): when AI is down, surface the user's saved Reframes, journal entries, and named patterns as the in-the-moment intervention.

Constitutive version (what Self Mode IS): a surface where the user encounters who they have been becoming, applied to who they are right now.

Both are true. The functional version is the build target. The constitutive version is the brand voice.

This concept earns its keep on every dimension Arlin named:

- **Science** — Kross self-distancing, narrative therapy, MCT all converge here.
- **User interface** — One past-self quote on screen at a time. Single CTA. Everything else falls away.
- **Engagement** — Unique to Stillform. No other app turns the user's accumulated self-knowledge into the in-the-moment intervention.
- **Display** — Cormorant Garamond italic for past-self quotes (visual weight). IBM Plex Mono for structural labels. Amber sparingly. Slow pacing.
- **Consolidates tools** — Pulls together Bias Profile, Signal Profile, saved Reframes, journal entries, Disruptor moves, breathing — all already shipped, brought into one flow.
- **Flow** — Body-first anchor → locate (chip selection) → name (distortion picker from THEIR profile) → past-self speaks (their own saved insight) → close with one specific move.
- **Red carpet** — Entry feels like opening a private room. Each step has weight. The handoff from past-self insights is a moment, not a feature.
- **Not overwhelming** — One thing per screen. Selection-based. Skip available everywhere.
- **Precision flawless prestige** — Typography locked, pacing slow, copy short, every word earned.

---

## 6. Flow specification (proposal)

### 6.1 Entry

Single screen. No "AI unavailable" framing. Just:

> *Self Mode*
> *Where your past self talks to your present self.*
>
> **Begin** — primary CTA
> *Body only* — secondary, skips to 90s Disruptor and exits

No apology, no explanation of why AI is gone. The user either wants to engage or doesn't. Both paths respected.

### 6.2 Step 1 — Body anchor (60-90 seconds, automatic)

Reuses the Disruptor tool component (already shipped). 8 prompts auto-advance: pressure, breath, temperature attention, posture. No verbal input required. This is the body-first principle in action.

End of body anchor: "Ready when you are." User taps to advance, or taps "End here" to exit cleanly.

### 6.3 Step 2 — Locate (selection, 10 seconds)

Single screen. User's Signal Profile chips (their named somatic markers) presented as taps:

> *Where is it sitting right now?*
> [Jaw] [Shoulders] [Chest] [Gut] [Hands] [Other]

One tap advances. "Other" allows free-text expansion if they want. Nothing required beyond a tap.

If user has not built a Signal Profile yet (new user, AI-down on first session), fall back to a generic 6-area body chip set.

### 6.4 Step 3 — Name (selection, 10-15 seconds)

User's Bias Profile distortions presented as taps. Only the 2-4 distortions THEY have flagged, not the full library:

> *What's the thinking pattern showing up?*
> [Catastrophizing] [Mind-reading] [Comparison]
> *Or — something else.*

One tap advances. "Something else" allows free-text. Nothing required beyond a tap.

If user has not built a Bias Profile yet, fall back to a curated 4-pattern set.

### 6.5 Step 4 — Past self (the centerpiece)

Based on the distortion just selected, surface the most relevant cached personal data. In priority order:

1. **A saved Reframe** the user has explicitly saved that addressed this distortion previously
2. **A journal entry** tagged or matched to this distortion
3. **A pattern in their Pattern Disruption history** that fits
4. **A generic past-self prompt** as final fallback (rare)

The presentation:

> *Your past self said this:*
>
> *"[The actual saved insight, in italic Cormorant Garamond, full-width with breathing room]"*
>
> *— You, [date relative to now: "3 weeks ago" / "last month"]*
>
> **Sit with that** — primary, advances
> *Different one* — cycles to next-best match in the list
> *Skip past self* — advances without engaging

Critical UI moment. This is where the magic earns its keep. The user reads their OWN past words, written when they were clearer, applied to current pain. That's the intervention.

### 6.6 Step 5 — Close

Single prompt with optional free-text:

> *What's one thing you can do in the next 10 minutes?*
>
> *[free-text input, 200 char max, optional]*
>
> **Done** — saves and exits
> *Skip writing* — exits without saving

If user types something, it gets saved as a journal entry tagged "Self Mode close." It pulls forward into the next AI Reframe session's context. AI sees it, references it: "You wrote yesterday in Self Mode that you'd take a 10-minute walk. Did that happen?"

If user skips, the session is still saved (timestamp, distortion selected, past-self read) so Mirror/Achievement/Roadmap can credit it.

### 6.7 Exit feedback

Final screen, ~2 seconds, then auto-dismiss back to home:

> *That was Self Mode.*
> *[The specific past-self insight they sat with, repeated quietly.]*
> *[Achievement micro-credit: "3rd Self Mode session this week."]*

Closes the loop. Effort produced felt completion.

---

## 7. UI / display considerations

### Typography
- **Past-self quotes:** Cormorant Garamond, italic, 22px, 1.6 line-height. The serif gives the quote weight; the italic marks it as quotation.
- **Structural labels:** IBM Plex Mono, 11px, uppercase, 0.08em letter-spacing, --amber. Same as existing Stillform structural labels.
- **Body copy:** DM Sans, 14-16px, 1.7 line-height, --text-dim. Restrained.
- **CTAs:** existing btn-primary / btn-ghost. No new button styles.

### Color
- --amber sparingly. Reserved for the past-self quote attribution and the structural labels. Not for the quote itself.
- Background --bg, surfaces --surface. No contrast spikes.
- The past-self surface gets a thin --amber-dim border around the quote card to mark it as the moment that matters.

### Pacing
- Body anchor: ~90 seconds (existing Disruptor timing)
- Locate: 5-10 seconds
- Name: 5-15 seconds
- Past self: as long as the user wants. No timer. The entire surface holds steady until they tap.
- Close: 30-60 seconds
- Exit: ~2 seconds

Total: 2-4 minutes. Shorter than current Self Mode (which often runs 5-8 minutes due to typing load). More felt impact.

### Animation
- No celebratory animations. No confetti. No badges.
- Crossfades between steps (200ms). Calm, not snappy.
- Pulsing focus ring on body anchor (already in Disruptor).
- Past-self quote card fades in slowly (~600ms) once data is loaded. Gives the moment its weight.

### Empty states
- No prior data → graceful fallbacks at every step (generic chip sets, generic past-self prompts).
- New user on first Self Mode session → an explicit moment that says: *"Self Mode gets sharper as you build your profiles. For now, here's a generic version. Your past self is being recorded."* — sets expectation honestly.

---

## 8. How it consolidates existing tools

| Existing tool | Role in Self Mode |
|---------------|-------------------|
| Disruptor (90s somatic redirection) | Body anchor at Step 1 |
| Signal Profile chips | Step 2 selection set |
| Bias Profile distortions | Step 3 selection set |
| Saved Reframes (storage) | Past-self quote source |
| Journal entries | Past-self quote source (secondary) |
| Pattern Disruption history | Past-self quote source (tertiary) |
| Breathing patterns | Available via "Body only" fast path |
| Body Scan | Available via close-step "next 10 minutes" suggestion |
| Mirror/Achievement/Roadmap | Surface that Self Mode session happened, count it, credit it |

Nothing new gets built tool-wise. Self Mode is a NEW FLOW that wires existing tools together with the user's own data as the connective tissue.

---

## 9. Each Arlin dimension addressed

**Science** — Kross self-distancing, MCT (Wells 2009), Porges polyvagal, Eysenck attentional load, Gollwitzer implementation intentions. Every design choice cited.

**User interface** — One thing per screen. Selection over free-text. Past-self quote as the visual centerpiece. No menus, no nav, no distraction.

**Engagement** — The "your past self talks to your present self" frame is unique in this market. Some users will choose Self Mode over AI Reframe even when AI is up. Compounds engagement instead of just preserving it.

**Display** — Typography locked to existing system, restrained color, slow pacing, generous whitespace. Quote treatment with weight.

**Consolidates tools** — All existing Stillform tools (Disruptor, profiles, saved data, breathing, Body Scan) brought into one coherent flow. Nothing new built; everything orchestrated.

**Flow** — Body → Locate → Name → Past Self → Close. Linear with skip-everywhere. ~3 minutes.

**Red carpet** — Entry feels like opening a private room. Past-self quote step is a moment, not a feature. Pacing is deliberate. Every word earned.

**Not overwhelming** — Selection-based input. One screen at a time. Skip path always available. Total time 2-4 min, less than current.

**Precision flawless prestige** — Locked typography, locked color, locked pacing. No filler copy, no extraneous interaction. Quality of execution is what makes it feel premium.

---

## 10. Anti-patterns to avoid

- **No "AI is offline" framing.** Don't apologize, don't explain the failure. The user doesn't need to know why; they need a path forward.
- **No fake AI presence.** Don't pretend AI is generating something when it's just a template. The audience smells it instantly.
- **No celebration of "you completed Self Mode."** The reward is the felt completion, not a confetti moment.
- **No streaks or consecutive-Self-Mode-sessions counting.** Achievement layer credits the session, but no manufactured habit pressure.
- **No "AI is back!" interruption.** When AI recovers mid-Self-Mode, finish what you started. Offer AI return at the next session, not mid-flow.
- **No therapy-coded language.** "Process," "feel into," "honor," "self-compassion" — all banned. Stillform is operator-mode.
- **No required free-text input.** Selection always primary. Free-text always optional.
- **No multi-step undo.** Linear advance only. Skip is the relief valve.

---

## 11. Open questions before building

1. **First-time user with no profile data.** How does Self Mode work on day 1 when there's no Bias Profile, no saved Reframes, no journal entries? Generic fallback set is one answer; another is to require profile setup before Self Mode is unlocked. What does Arlin prefer?

2. **Past-self quote selection algorithm.** Most-recent? Most-relevant (matched to current distortion)? Pattern-tagged? Manual user-curated "favorites"? Probably hybrid — relevance first, recency tie-break — but worth deciding before build.

3. **Skip threshold.** If user skips 3+ steps in a row, does Self Mode auto-exit to body-only? Or does it keep offering? Skip-friendliness is good but at some point it's not a session.

4. **Self Mode while AI is up — the deliberate-choice path.** If a user chooses Self Mode when AI is available, do we still cache the session like an AI Reframe? Same data shape? Same Mirror/Achievement integration?

5. **Multi-session momentum.** If a user does Self Mode 3 times in a week, should Self Mode evolve based on their pattern? E.g., if they always pick "catastrophizing," does it lead with that distortion next time? Risk: creates a rut. Benefit: faster.

6. **Onboarding the past-self frame.** First time user encounters the "your past self said this" surface — needs a beat of explanation. How long? What copy?

7. **Ambient versions.** Could there be a 30-second ultra-short Self Mode for moments when 3 minutes is too much? "Past self, one quote, body anchor, exit"?

8. **Audio reading of past-self quotes.** Could the user hear their past self instead of read? Particularly powerful for Self Mode but TTS is its own engineering scope.

---

## 12. Comparison to current implementation

| Dimension | Current Self Mode | Proposed Self Mode |
|-----------|-------------------|---------------------|
| Total time | 5-8 min (typing-heavy) | 2-4 min (selection-heavy) |
| Input modality | Free text x 5 | Selection x 3 + optional free text x 1 |
| Cognitive load | High (working memory under arousal) | Low (recognition over recall) |
| Use of personal data | None — every session blank | Centerpiece — past self surfaces user's own work |
| Visual treatment | Reframe-without-AI feel | Distinct mode with own visual weight |
| Skip path | Implicit (close button) | Explicit at every step |
| Effort payoff | Lands at "pick a tool" | Lands at felt completion + achievement credit |
| First-time user experience | Identical to repeat user | Honest fallback + sets expectation |
| AI-recovery handling | Pill prompt during flow | Defer to next session, finish current |

---

## 13. Build scope estimate

**Smaller than the engagement architecture overall — most pieces already exist:**

- Body anchor: existing DisruptorTool
- Profile chip surfaces: existing Signal/Bias profile data + selection UI patterns from morning check-in
- Past-self quote surface: NEW component (high-care UI moment)
- Close-step journal write: existing journal writer
- Achievement integration: hooks into engagement architecture

**Estimated builds: 4-6.**
1. Past-self quote surface component (visual-design-heavy)
2. Self Mode flow orchestrator (state machine + step wiring)
3. Past-self selection algorithm (server or client)
4. Empty-state / first-time-user handling
5. Engagement architecture integration (Mirror/Achievement)
6. Polish + animations + copy QA

Smaller than CFM Phase 1 was. Much smaller than the engagement architecture overall.

---

## 14. Sequencing within the broader launch plan

Self Mode redesign sits AFTER engagement architecture stage definitions and Trigger Profile, BEFORE Today's Brief and the application layer. Reason: Self Mode depends on the user having a populated Bias Profile and Signal Profile, which are existing — but Self Mode also benefits from the engagement architecture's Mirror/Achievement integration which doesn't exist yet.

Cleanest order:
1. Engagement architecture stage definitions (load-bearing for everything)
2. Trigger Profile (third diagnostic layer)
3. **Self Mode redesign (this doc)** — uses Bias Profile + Signal Profile + saved data
4. Today's Brief, Mirror surface, Achievement micro-credits, Roadmap (engagement architecture surfaces)
5. Pre-event Brief, Move card, Scripts, EOD artifact (application layer)

---

## 15. Open question for Arlin

**RESOLVED May 7, 2026.** "Past Self / Present Self" framing confirmed, with Arlin's sharpening: the user's past self isn't a resource the app borrows from, it IS what the user currently is. Influence and experience are what present output rests on. The framing is constitutive, not transactional — Stillform reflects the user's accumulated self back to them. This sharpening landed in §5 (Concept proposal) above.

Other framings considered and rejected:

- **"Solo practice mode"** — felt too gym-coded, performance-oriented
- **"Quiet mode"** — felt like a setting, not a practice
- **"Off-grid mode"** — felt evasive about what it actually does
- **"Self-led Reframe"** — too close to AI Reframe nomenclature; loses distinctiveness
- **"Inside Mode"** — interesting but ambiguous

"Past Self / Present Self" is the lock. Remaining open items are execution-level (§11) — secondary to framing.
