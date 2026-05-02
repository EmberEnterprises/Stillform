# Pattern Disruption — Spec v1

**Status:** Drafted May 3, 2026. Conversational decisions captured. Engineering scope outlined. Open questions called out.

**Source conversation:** May 2–3 session with Arlin. The product theory, the seven-loop taxonomy, the three-data-point threshold, the dismissal state machine, and the body-first chip detection insight all came from Arlin during dialogue. This document is capture, not invention.

---

## 1. Why this exists

Stillform's existing tools make patterns **legible**. Pulse chips name the state. Bio-filter surfaces hardware context. Reframe offers alternative interpretation. My Patterns shows the user their own data. Self Mode trains the metacognitive 5-step practice.

What Stillform doesn't yet do: **disrupt** a pattern the user is inside of and can't see clearly enough to break alone.

The legibility-only ceiling is real. A user can know they're in a loop and stay in it. The product theory underwriting this spec is: *the user needs a felt experience of the loop breaking — once, mechanically delivered — to have a reference point they can reach for later.* The app doesn't disrupt the user against their judgment; it teaches them what disruption feels like, then steps back.

This is consistent with composure-as-discipline. The disruptor extends agency rather than removing it: the user is learning a move they can eventually do alone.

This is also explicitly **not EMDR**, **not bilateral stimulation**, **not memory reconsolidation**, **not any treatment-adjacent mechanic that requires clinical containment**. Hard line, locked May 2.

---

## 2. The detection layer

### 2.1 Unit of detection: the data point, not the session

A loop is detected from **three data points of the same loop signal**, regardless of which surface produced them. Three Self Mode entries. One Self Mode + two Reframes. Three Pulse chips of the same shape. Three bio-filter readings. Whatever combination — the threshold is three loop-signal data points.

Sessions are containers. Data points are what counts.

### 2.2 What counts as a loop signal

The AI runs an open-ended pattern read against the user's recent data with the following dimensions surfaced as guidance (not rigid checks):

1. **Same feeling, different surface causes.** Reframes about boss / partner / mother that all carry "dismissed, unseen."
2. **Same action or behavior across different framings.** Sent the message / set the boundary / withdrew — three different stories defending the same move.
3. **Same context.** Same time window (late night), same physical location, same person triggering.
4. **Same somatic signal.** Bio-filter showing "physically depleted" or "gut signal active" repeatedly across sessions.
5. **Same interpersonal posture.** Confront / withdraw / comply / perform — landing on the same relational stance regardless of content.
6. **Same cognitive distortion.** Bias profiler signal repeating across Reframes.
7. **Same emotional ramp shape.** Three sessions in a row that don't reach composed — unfinished regulation as the loop.
8. **Same chip selection across check-ins (body-first detection vector).** "Settled" three days running while behaviors drift. "Distant" three days running. The body-first user who doesn't surface loops verbally surfaces them through repeated state selection.

The AI gets full session history (Self Mode entries, Reframe transcripts, Pulse chip selections, bio-filter readings, check-in data, signal log entries) and forms a single judgment: *"do I see a pattern across at least three data points?"* If yes, what is it. If no, no surface fires.

This is open-ended AI judgment with the eight dimensions as system-prompt guidance. Rule-based detection on each dimension would miss loops that don't fit a single rule and produce false positives on loops that look like one rule but aren't.

### 2.3 The body-first / calm-process detection problem

Arlin flagged this directly: a body-first user might never surface a loop verbally. They may not enter Reframe. They may do Self Mode rarely. Their loop lives in repeated chip selections, repeated bio-filter readings, and behavioral patterns that don't show up in language.

The chip data is the primary loop-detection vector for these users. Three "Distant" selections across three check-ins, especially paired with bio-filter signals, is a loop signal even if the user never wrote a word in Self Mode or Reframe. The pattern check has to weight chip + bio-filter signals as full data points, not as supplementary context.

This is also the user type for whom the disruptor mechanic matters most, because they're least likely to detect the loop themselves through self-reflection. The mechanic should be designed assuming this user — not the verbal Reframe user — is the primary recipient.

### 2.4 Detection cadence

The AI runs the pattern check **after every data point lands** that could be the third instance of any pattern. Real-time, not batched. When the third data point closes a pattern, the notification fires immediately. No waiting for a "good moment."

### 2.5 AI-offline backup case

When the AI is down and the user falls back to Self Mode, captured data is stored. When the AI comes back online, it reads the gap-period data and folds it into pattern detection same as live data. Backlogged patterns trigger notifications identically to live ones — no special language, no apology framing. The user opted into AI-assisted composure architecture; the AI catching up after an outage is exactly what was promised. Transparency, not softening.

---

## 3. The notification + prompt flow

### 3.1 The two-channel surface

Both fire when a pattern is detected:

- **Push notification.** Phone push, breaks through the home screen. Required because phone banners can be silenced and missed. Goes through APNs (iOS) and FCM (Android). Both platforms get the same notification logic.
- **In-app prompt on app open.** When the user opens the app, the prompt is the first surface they hit. Not a banner — a modal or full-screen prompt that requires interaction to proceed.

Both fire because each catches a different user moment. Push catches users who aren't in the app. Prompt-on-open catches users who silenced push or who open the app for an unrelated reason.

### 3.2 The dismissal state machine

For each detected pattern instance:

1. **First fire.** Push + prompt-on-open. User dismisses → state: "first dismissal."
2. **Second fire.** Push + prompt-on-open re-fires within a defined window. User dismisses → state: "second dismissal." Pattern is now closed.
3. **No third fire for this pattern instance.** Once dismissed twice, the pattern instance is dropped.

If the **same loop signal accrues a fresh round of three data points** after closure, a new pattern instance opens and the cycle restarts: push → prompt → dismiss → push → prompt → dismiss → drop.

A user who repeatedly hits the threshold and dismisses will repeatedly see the surface. The app does not adapt downward to learned dismissal. The pattern is real or it isn't, and the user's response doesn't change the underlying data.

### 3.3 Acceptance routes into the disruptor tool

When the user accepts the offer (taps the prompt, opens push), they are routed into the disruptor tool — a new tool defined in §4 below.

### 3.4 Language

Direct, not diagnostic. Anchored in the user's data, not the app's interpretation.

Example phrasings (final copy TBD):

- *"This has come up three times this week. Want to work with it?"*
- *"You've named [feeling] across [N] check-ins. Here's a different move."*
- *"Pattern showing up. Ready to step out?"*

The word **loop** is fine if Arlin wants it; *spiral, stuck, trapped* are not (diagnostic-coded). *Pattern* and *situation* are the safe registers.

The phrasing must not say "in Self Mode" or "in Reframe" specifically, because patterns pool across surfaces. *In your work this week* is the framing that survives.

---

## 4. The new disruptor tool

### 4.1 Why it's new, not an extension

Routing the user into a regular Reframe session — even one pre-loaded with pattern context — is still a Reframe. It's the same cognitive lane the user was already looping in. The disruptor must be a *different shape of session* to deliver the felt experience of the loop breaking.

### 4.2 What it is — mechanic open question

This is the load-bearing unbuilt piece. The science direction is locked; the experience design is not.

**Locked science:**

- **Attentional capture by novel stimulus** (Sokolov's orienting response, salience network literature). A sufficiently novel sensory input briefly suppresses the default-mode network where rumination lives. The window is roughly 3–10 seconds. This is the mechanism that gives the user a felt break from the loop.
- **Somatic anchoring** (Porges, Levine). A specific bodily sensation introduced at the moment of disruption gives the user a future-recall handle. *"When I feel that, I remember the loop broke."*
- **Brief duration.** 60–120 seconds maximum. Long enough to deliver an experience, short enough not to become a new pattern.

**Open question — actual experience design:**

Possible directions:

- **Sensory disorientation pattern.** Visual + auditory novelty calibrated to the user's stated sensory tolerances. Not jarring — *novel*. The fractal canvas already in Stillform is half this; an enhanced variant could deliver pattern-break without ramping into anything destabilizing.
- **Somatic redirection.** A guided 90-second somatic experience — pressure, breath, temperature attention, posture shift — that pulls cognitive resources out of the loop content and into present-moment body awareness.
- **Counter-rhythm breath.** A breath pattern deliberately *unlike* the user's default and unlike whatever they've been doing recently. Novelty in the breath itself.
- **Sensory grounding sequence.** A structured 5-4-3-2-1 variant or similar, but mechanically delivered with novelty calibration.

All four are scientifically defensible. None are EMDR-coded. The choice between them — or the synthesis — is the design call to make. **Recommendation: build the simplest first (somatic redirection, ~90 seconds, single-track guided experience) and iterate based on user response.**

### 4.3 Post-disruptor reflection

After the disruptor experience:

- Brief reflection surface: *"That's what stepping out feels like. Next time the pattern pulls, you can come back here — or do that move on your own."*
- Logs the disruptor session as its own data point — the *break* is recorded so the AI can see whether disruptors are working for this user over time.
- No forced follow-up. The user can leave, journal, return to home, or open another tool freely.

### 4.4 What the disruptor is *not*

- Not a Reframe replacement. The user can still go to Reframe; the disruptor is offered when *the loop itself is the thing to break*, not the content.
- Not a meditation practice. Different mechanic — orienting response, not sustained attention.
- Not a treatment intervention. No claims about resolving trauma, processing memory, or modifying patterns at depth. The mechanic is a felt experience of the loop breaking. Anything more is over-claim.

---

## 5. Transparency surface

The user can view, at any time, what the AI is analyzing across their sessions.

**Settings → Patterns the AI is watching for in your work.**

The surface shows:

- Active pattern detections in flight (e.g., *"Two data points of [pattern]; one more to surface."*)
- History of patterns the AI has surfaced, accepted, dismissed
- The eight detection dimensions described in plain language so the user can see the AI's analytical lens
- An option to clear the history

This is the agency principle in concrete form. The user signed up for AI-assisted composure architecture. The AI doing pattern reads is not a violation — it's the deal. Transparency about *what the AI sees* is what makes the deal honest.

There is no off-switch for pattern detection itself. The user can dismiss notifications, dismiss prompts, ignore offers. They cannot turn off the AI's read. Doing so would defeat the architecture they signed up for.

---

## 6. Engineering scope

### 6.1 What's already in place

- Capacitor with `@capacitor/push-notifications` and `@capacitor/local-notifications` initialized (per transfer doc)
- Self Mode capturing 5-step entries
- Reframe capturing AI conversations
- Pulse chips capturing chip selections + timestamps
- Bio-filter capturing physical state readings
- Signal Log capturing emotion entries

### 6.2 What needs to be built

1. **Server-side pattern detection job.** Runs after each new data point lands. Sends recent session history to AI with the system prompt guidance from §2.2. Returns either "pattern detected: [description]" or "no pattern."
2. **Pattern instance state machine.** Tracks active patterns, dismissal counts, closure, re-opening on fresh accrual. Persists across devices.
3. **Notification dispatcher.** Routes detection results to APNs (iOS) and FCM (Android). Same payload shape, same dismissal logic both platforms.
4. **In-app prompt-on-open flow.** Modal that fires when a pending pattern exists at app open. Cannot be dismissed without explicit interaction.
5. **The disruptor tool itself.** New tool component, ~90 seconds guided experience. Logs as its own data point. (Mechanic per §4.2.)
6. **Transparency surface in Settings.** Read-only view of active and historical pattern detections.

### 6.3 Honest scope estimate

This is **not a small feature.** Realistic scope: 3–5 days of focused engineering across detection, dispatch, state machine, disruptor tool, transparency surface, and end-to-end testing. Push notification platform setup (Firebase project for FCM, APNs cert wiring beyond Capacitor's defaults) is real work even with Capacitor abstracting most of it.

### 6.4 Ship-or-hold question

The master todo has Self Mode redesign flagged as ongoing prelaunch work. This pattern disruption layer is either:

- **(a)** Part of the Self Mode redesign and ships prelaunch — defers public launch by 3–5 days
- **(b)** A v1.1 feature that ships post-launch — keeps current launch standard intact

Both are defensible. Recommendation deferred to Arlin. **My honest read:** the legibility-only ceiling is real, but the existing toolkit is already a coherent product. Shipping pattern disruption post-launch as a meaningful v1.1 announcement is probably stronger than delaying launch and shipping it inside the noise of v1. But this is a judgment call on Stillform's positioning, and Arlin owns that call.

---

## 7. Open questions called out

1. **Disruptor mechanic:** which of §4.2's four directions, or which synthesis. Single biggest unbuilt design call.
2. **Notification re-fire window:** what's the duration between first dismissal and second fire of the same pattern instance? Hours? Same day? Next session?
3. **Transparency surface depth:** does the user see the AI's actual reasoning, or just the conclusion? Reasoning is more transparent but exposes raw AI output to UX risk.
4. **Pattern detection cost:** running the AI after every new data point is expensive at scale. Is the threshold check (≥3 candidates) a deterministic pre-filter that gates the AI call, or does the AI run regardless? Recommendation: deterministic pre-filter checks if any signal has ≥3 instances in the recent window before invoking the AI.
5. **Disruptor effectiveness signal:** how do we know if disruptors are working? Possible: track post-disruptor pattern recurrence — if the same pattern surfaces again within X days of disruptor acceptance, the disruptor didn't break it. This is a longitudinal product-effectiveness measure, not a feature requirement.
6. **Body-first user experience design:** the body-first user surfaces loops via chips and bio-filter, not language. Does the disruptor tool need a body-first variant that doesn't ask for verbal input at any point? Probably yes. Worth explicit design pass.

---

## 8. What this document is not

This is a v1 spec. It is not a final design doc. It captures decisions made during the May 2–3 conversation, surfaces open questions, and provides a buildable scope. Any of the following could change with further conversation:

- Detection threshold (currently three data points)
- Dismissal logic (currently two-strikes-and-drop)
- Disruptor mechanic (currently open)
- Ship timing (currently deferred to Arlin)
- Notification copy (currently sketches only)

---

*Spec author: Claude, May 3 2026, in conversation with Arlin.*
*Architectural decisions are Arlin's. Capture, scope, and open-question articulation are mine.*
