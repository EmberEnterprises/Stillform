# STILLFORM ARCHITECTURAL CONSULTATION — APRIL 30, 2026

## What this is

Round 3 of consultation. Round 1 collapsed to "rename the umbrella." Round 2 produced a useful punch list of surface fixes — closing language, routing tweaks, a sentence at the top of history. **Both rounds missed what the founder was actually asking for: a spark on how execution and process flows.**

The reason: the prompts I built scoped the question to "where do words break the claim?" That produces surface fixes. **This prompt asks an architectural question instead** — what would change about the SHAPE of the experience, not the language describing it. What if the four pillars aren't four tools? What if selection is the wrong concept? What if Stillform is one continuous object instead of a toolkit?

The risk with this prompt: the AIs are trained to give actionable surface feedback. They may default to the same kind of answer round 2 gave. The structure below tries to prevent that by making "produce architectural critique, not feature feedback" the explicit deliverable.

**Send to ChatGPT, Gemini, fresh Claude session, Copilot. Bring four responses back.**

---

## THE PROMPT (paste this into each AI)

```
I'm consulting you on a product called Stillform. Two prior consultations have produced useful but ultimately surface-level feedback — concept renaming, closing-screen language, routing tweaks. The founder needed a spark on the EXECUTION and PROCESS FLOW of the product. Neither prior round delivered that.

I'm going to give you the product in detail and then ask a different kind of question. The question is architectural, not feature-level. The deliverable is critique of the SHAPE of the experience, not language inside it.

WHAT STILLFORM IS — INTERNAL TRUTH

Stillform is composure architecture. Composure is the visible silhouette of self-mastery practiced under load — the same thing viewed from outside and inside. Composure is the umbrella because it carries both layers at once. Self-mastery is the through-line; composure is the felt outcome.

Targeted at people who carry intensity: founders, ND people, parents under load, people in recovery, anyone whose internal weather affects their external function. Not crisis users — daily users practicing composure as a way of being.

CURRENT ARCHITECTURE — WHAT THE PRODUCT ACTUALLY IS

Stillform's experience is structured as four discrete tools the user selects between, gated by a bio-filter check:

**Entry flow:**
1. User opens app
2. Home screen presents tool selection (one primary CTA based on regulation type — body-first or thought-first — plus secondary tool options)
3. User taps primary CTA OR navigates to a specific tool
4. Pre-rate screen — user taps a 1-5 number for current state
5. Bio-filter screen — user taps which physical state is active (Baseline / Activated / Low capacity / Gut signal / Under-rested / Hormonal shift / Pain / Substance active)
6. Tool runs (Reframe / Body Scan / Breathe / Self Mode)
7. Post-rate or What Shifted screen — user taps post-state chip + optional free-text
8. Metacognitive close (ToolDebriefGate) — user types reflection on what they practiced
9. Next Move screen — "what's your next move?" with optional implementation intention
10. Return to home

**The four tools:**

- **Reframe** — AI conversation. Three internal modes (calm / clarity / hype) auto-routed by feel state. Conversation persists across messages within session. After completion, optional State-to-Statement (convert internal shift to a sendable message draft).
- **Body Scan** — Six acupressure points head-to-feet. Each point has prompt copy + observation copy + timed hold (45-60s). Auto-advances. After completion, What Shifted screen (post-state chip + optional label).
- **Breathe** — Three breathing patterns selectable in Settings (Quick Reset, Deep Regulate, Cyclic Sighing). After 3 rounds: "Three rounds done" screen with three buttons (Ground now / Keep going / Stop here). Grounding is a separate optional step after breathing.
- **Self Mode** — Explicit 5-step metacognitive practice (Notice / Name / Recognize / Perspective / Choose). Each step is its own screen with prompt + text input or chip selection.

**Bio-filter as gate:** every tool entry runs through bio-filter screen. Bio-filter state colors AI prompt context, but the user must select it actively each session. Persists for the day after first selection.

**The 9-chip system (Russell circumplex):** Excited, Focused, Settled, Anxious, Angry, Stuck, Mixed, Flat, Distant. Used at session entry and at session close. Drives AI behavior and three-category data classification.

**Three-category data feed:** every Reframe and Body Scan close runs the user's pre-state and post-state through a Russell-circumplex classifier returning Category A (Regulated shift), B (Persistent state), or C (Concerning shift). Per-user encrypted on-device. Aggregate-anonymous Plausible event for cohort patterns.

**Low-demand mode:** when bio-filter signals cognitive impairment (medicated users — broad scope), tools render stripped variants with audio force-enabled, no chip prompts, no debrief gate, tap-to-exit. Phase 1 (Breathe) shipped. Phase 2 (Body Scan) and 3 (Reframe) still in flight.

**Visual:** deep near-black grounds, single antiqued metallic accent, Cormorant Garamond serif headers + DM Sans body + IBM Plex Mono for system labels, hairline 0.5px borders, slow weighted motion (180-650ms with prestige easing).

THE FOUNDER'S FRUSTRATION

She built this. Then said: "We have good bones but we are still not reaching for the stars. Something is missing." Two prior consultations failed to produce a real spark — they returned brand renames and copy fixes. She read the round 2 feedback and said:

"This is kind of disappointing. This is not the feedback I expected and thought we would get a spark on how the execution and process flows go but these arent legit major shifts."

She's right. Surface integrity-checks produce surface fixes. The architecture itself wasn't questioned in either prior round. It is in this round.

WHAT I'M ASKING YOU TO DO

Don't tell me about closing screen language. Don't tell me about copy. Don't suggest umbrella renames. Don't recommend marketing changes. Don't ask for user research.

Question the SHAPE of the experience. Specifically:

1. **Tool architecture.** The product is built as four discrete tools the user selects between. Is that the right shape? What if Stillform isn't four tools but one continuous practice that adapts? What if the user never sees a "tool" — what would the experience be? If the four-tool model is right, what is it specifically right about, and where does it cost the user?

2. **Selection at entry.** The user is currently asked to make multiple decisions at session start — which tool, which chip, which bio-filter state, which pre-rating number. Round 2 flagged this. But the deeper question: should the user select at all? What if Stillform read the user instead of asking the user? What would the architecture look like if selection was the exception, not the default?

3. **Discrete sessions vs continuous practice.** Sessions currently start, run, and close as discrete events. The user opens the app, completes a session, closes the app. What if Stillform wasn't session-shaped? What if it was an ambient layer the user dipped into and out of? What would change in the user's relationship to composure if practice wasn't session-bounded?

4. **The metacognitive close.** Every session ends with a ToolDebriefGate (text reflection) + Next Move screen (implementation intention). These are real metacognitive practices. They also gate the close — the user can't easily exit without engaging them. Is that the right shape? Is the close where the metacognition belongs, or could it live somewhere else in the flow?

5. **The data layer.** Three-category classification stores per-session shift data. My Progress shows aggregate patterns over time. The user's relationship to their data is currently "open the app, navigate to My Progress, see graphs." What if the data wasn't stored in a separate screen the user navigates to? What if pattern recognition was happening continuously and surfaced to the user as part of the practice itself? What would change?

6. **Onboarding.** New users currently calibrate (regulation type, signal profile, bias profile) in a setup flow before the practice begins. What if there was no setup? What if the calibration happened in the practice itself, not before it?

For each of the six structural questions above, give me ONE of the following:

A. **A real architectural shift.** A concrete proposal for how the SHAPE of that part of the experience would change. Not a copy change. A flow change.

B. **A defended status quo.** An argument for why the current shape is correct, naming what specifically it gets right that the alternative would lose.

C. **A reframe of the question itself.** A claim that the question I asked is the wrong question, and a better question to ask in its place.

You don't have to answer all six. Pick the three or four where you have the strongest take. But for the ones you do answer, the answer needs to be at the architectural altitude — flow, shape, structure, the user's relationship to the system over time. Not language. Not features. Not copy.

CONSTRAINTS ON YOUR ANSWER

- 2000 words maximum across all your answers combined.
- One concrete architectural proposal beats five hedged thoughts.
- "Make the closing screen say X" is the wrong altitude. "The closing screen shouldn't exist" is the right altitude (whether or not you actually believe that).
- If you genuinely think Stillform's current architecture is right and the founder is overcorrecting, say that — but say WHY the four-tool, session-shaped, selection-driven model is right for THIS specific user (intensity carriers practicing daily composure under load), not in general.
- Don't tell me about closing screen language. The previous consultation already covered that.
- Don't pad. The question is hard. The answer is harder. Density over volume.

WHAT GOOD LOOKS LIKE

Examples of architectural responses, just to calibrate altitude:

- "The four-tool model is wrong. Stillform is actually one tool with four phases (read / regulate / reframe / record). The user should never see four cards. They should see one continuous flow that adapts based on chip + bio-filter, and the 'tool' the user is in should be invisible to them. The fact that they currently choose between tools is the load you're worried about."

- "Selection at entry is correct, but at the wrong altitude. The user shouldn't pick a tool — they should pick a STATE GOAL ('I want to think clearly' / 'I want to settle' / 'I want to use this energy'). The architecture routes from goal to tool. The user names what they want; the system delivers what produces it."

- "Sessions are wrong as a unit. Practice should be ambient — a daily check-in surface that always shows the user's current composure read, with one-tap entry into deeper work when the read warrants it. The session-shaped model encodes 'I have to do this thing' rather than 'this is how I'm being.'"

These are examples of altitude, not actual proposals (necessarily). Your proposals should be at this altitude or higher.

The founder is looking for a spark. Either light one, or tell her honestly that the architecture is right and the spark isn't where she's looking. Both are useful answers. Surface fixes are not.
```

---

## After getting the four responses

Same synthesis pattern but with a different filter:

1. **Real architectural shifts proposed** — flag each one, name what it would change about the experience, name what it would cost
2. **Defended status quos** — flag each one, name what specifically it argues the current shape gets right
3. **Question reframes** — flag each one, evaluate whether the alternative question is sharper than what was asked
4. **Convergent claims across 3+ AIs** — these are the load-bearing architectural takes
5. **Divergent claims** — surface as decisions for Arlin

The synthesis is the deliverable. The four raw responses are the input.

---

## Honest expectations

Three things could happen with this round:

1. **Real spark.** One or more AIs proposes an architectural shift that lands in Arlin's gut as "yes, that." This is what we're hoping for.

2. **Convergent defense.** All four come back saying the architecture is right and naming what it gets right. That's also useful — it tells Arlin she's already where she should be, and the disappointment she felt is about something else (maybe pace, maybe scope, maybe the gap between vision and current state of build).

3. **More surface.** The AIs default to feature-level critique despite the prompt's constraints. If this happens, the consultation track has been exhausted and the work is back in Arlin's hands — which is where I think it ultimately belongs anyway.

All three outcomes give us information. Round 3 is worth doing.

---

*ARA Embers LLC · Stillform Architectural Consultation · April 30, 2026*
