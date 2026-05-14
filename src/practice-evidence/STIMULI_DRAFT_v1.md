# Practice Evidence — Stimulus Library DRAFT v1

**For Arlin's ratification.** Sprint 1 deliverable per `COGNITIVE_FUNCTION_MEASUREMENT_PHASE_1_AUDIT.md` Decision 3.

Once Arlin marks scenarios (✅ keep / ✏️ edit / ❌ drop), this converts to `stimuli.json` for Sprint 2 consumption. Disputed entries don't ship.

---

## Open question — second rater

The audit recommended Arlin + Bobby as two-rater validation. Per current state, Bobby is paper-only on the LLC and not involved in product decisions. Options for the second rater:

- **(a)** Arlin alone, accept lower inter-rater confidence
- **(b)** A trusted beta tester (Ava was named as first user with first testimonial)
- **(c)** AI as second-pass cross-check rater (lower quality than human but available)

Arlin's call before Sprint 2 validation pass.

---

## Affect-Labeling Scenarios (30)

**Chip set in use:** Excited · Focused · Settled · Anxious · Angry · Stuck · Mixed · Flat · Distant · Unsure

*Mixed and Unsure are escape hatches, not measurement targets. Three Mixed scenarios are deliberately included as ambiguity-tests for rater agreement.*

Each scenario: primary chip, optional secondary if reasonably ambiguous, trigger category for demographic-spread tracking.

---

### EXCITED — positive activation, forward-leaning

**AL_001** — *"You just got a yes from someone whose opinion you've been chasing for months."*
Primary: **Excited** · Secondary: Focused · Trigger: external-validation
Arlin: ☐

**AL_002** — *"You walk out of an audition, a pitch, or a first date and you can feel something landed."*
Primary: **Excited** · Trigger: post-performance
Arlin: ☐

**AL_003** — *"A close friend tells you they bought the tickets for the trip you've been planning together."*
Primary: **Excited** · Trigger: anticipation-positive
Arlin: ☐

---

### FOCUSED — productive activation, attentive

**AL_004** — *"You've been on a problem for two hours and you can see the shape of the solution."*
Primary: **Focused** · Trigger: creative-flow
Arlin: ☐

**AL_005** — *"You sit down at your desk after a strong morning routine and the work is right there."*
Primary: **Focused** · Secondary: Settled · Trigger: routine-anchor
Arlin: ☐

**AL_006** — *"You're walking into a meeting where you know what you're going to say and you've prepared everything."*
Primary: **Focused** · Trigger: preparedness
Arlin: ☐

---

### SETTLED — positive low-activation, regulated

**AL_007** — *"It's Sunday afternoon. The dishes are done. You have no plans."*
Primary: **Settled** · Trigger: rest
Arlin: ☐

**AL_008** — *"You just had a hard conversation that landed well and the other person left feeling seen."*
Primary: **Settled** · Secondary: Focused · Trigger: relational-resolution
Arlin: ☐

**AL_009** — *"You finish a long walk and your breathing has slowed without you noticing."*
Primary: **Settled** · Trigger: physiological-downshift
Arlin: ☐

---

### ANXIOUS — forward-anticipation, high activation

**AL_010** — *"Your phone buzzes with a text from someone you've been waiting to hear from. You pick it up and your hand is shaking before you read it."*
Primary: **Anxious** · Trigger: anticipation-uncertain
Arlin: ☐

**AL_011** — *"You're walking into a room where you know the conversation will land on you."*
Primary: **Anxious** · Secondary: Stuck · Trigger: social-exposure
Arlin: ☐

**AL_012** — *"Email subject line: 'we need to talk' from someone you can't ignore."*
Primary: **Anxious** · Trigger: work-confrontation-pending
Arlin: ☐

**AL_013** — *"Your doctor's office called and left a voicemail asking you to call back. The office is closed for the weekend."*
Primary: **Anxious** · Trigger: health-uncertainty
Arlin: ☐

---

### ANGRY — high-activation, violation

**AL_014** — *"Someone interrupts you for the third time in the same meeting and looks at the person who actually asked the question."*
Primary: **Angry** · Trigger: workplace-erasure
Arlin: ☐

**AL_015** — *"Your partner tells you they handled something the way you specifically asked them not to."*
Primary: **Angry** · Trigger: boundary-violation-domestic
Arlin: ☐

**AL_016** — *"You read a message thread where someone takes credit for your work in front of people you respect."*
Primary: **Angry** · Secondary: Stuck · Trigger: professional-violation
Arlin: ☐

**AL_017** — *"A driver cuts you off and gives you the finger when you honk."*
Primary: **Angry** · Trigger: public-aggression
Arlin: ☐

---

### STUCK — cognitive looping, not moving

**AL_018** — *"You've rewritten the same email seven times and the cursor is still blinking at the end."*
Primary: **Stuck** · Trigger: decision-paralysis-output
Arlin: ☐

**AL_019** — *"You keep checking the chat to see if they replied. They haven't replied for an hour."*
Primary: **Stuck** · Secondary: Anxious · Trigger: rumination-relational
Arlin: ☐

**AL_020** — *"You can't decide between two options and you've been deciding for three days."*
Primary: **Stuck** · Trigger: decision-paralysis-choice
Arlin: ☐

**AL_021** — *"A conversation from two days ago is replaying in your head and you keep finding new things you should have said."*
Primary: **Stuck** · Trigger: rumination-replay
Arlin: ☐

---

### FLAT — low energy, neutral valence

**AL_022** — *"You wake up, look at the day, and feel nothing about any of it. Not bad. Not good. Just nothing."*
Primary: **Flat** · Trigger: anhedonia-morning
Arlin: ☐

**AL_023** — *"Your favorite meal is on the table and you can't think of why you wanted it."*
Primary: **Flat** · Trigger: pleasure-disconnect
Arlin: ☐

**AL_024** — *"You finish work and stare at the wall. The to-do list is on your phone and you can't open it."*
Primary: **Flat** · Secondary: Distant · Trigger: depletion-eod
Arlin: ☐

---

### DISTANT — disconnection from body or moment

**AL_025** — *"You're listening to someone tell you something important and you realize you stopped hearing them three sentences ago."*
Primary: **Distant** · Trigger: dissociation-conversation
Arlin: ☐

**AL_026** — *"You catch your reflection in a window and don't recognize the expression on your face."*
Primary: **Distant** · Trigger: depersonalization-mirror
Arlin: ☐

**AL_027** — *"You're in the middle of a conversation and your body feels like it's a foot behind you."*
Primary: **Distant** · Trigger: dissociation-body
Arlin: ☐

---

### MIXED — deliberately ambiguous (rater-agreement tests)

**AL_028** — *"You just got the promotion you wanted. You can't tell if what you feel is excitement or dread."*
Primary: **Mixed** · Secondary: Anxious · Trigger: ambivalence-success
Arlin: ☐

**AL_029** — *"Your kid moves out for college today. You're proud of them and you can barely look at the empty room."*
Primary: **Mixed** · Trigger: ambivalence-loss
Arlin: ☐

**AL_030** — *"A relationship just ended that needed to end. You're relieved and you can't stop crying."*
Primary: **Mixed** · Trigger: ambivalence-resolution
Arlin: ☐

---

## Cognitive Defusion Thoughts (15)

Each thought is a sticky cognition the user attempts to defuse from — generating alternative frames that get scored Distinct / Reworded / Same per Decision 7 rubric. Each spans a distortion category for coverage.

---

**DEF_001** — *"If I push back on this, they'll cut me off."*
Distortion: fortune-telling, catastrophizing · Domain: relational
Arlin: ☐

**DEF_002** — *"I'm a bad parent because I lost my temper."*
Distortion: self-labeling, overgeneralization · Domain: parenting
Arlin: ☐

**DEF_003** — *"She didn't reply because she's mad at me."*
Distortion: mind-reading, personalization · Domain: relational
Arlin: ☐

**DEF_004** — *"If I rest, everything will fall apart."*
Distortion: catastrophizing, control fallacy · Domain: identity-productivity
Arlin: ☐

**DEF_005** — *"I should have known better."*
Distortion: should-statement, hindsight bias · Domain: self-judgment
Arlin: ☐

**DEF_006** — *"I'm too much for people."*
Distortion: self-labeling, overgeneralization · Domain: relational
Arlin: ☐

**DEF_007** — *"They're going to figure out I don't actually belong here."*
Distortion: fortune-telling, impostor pattern · Domain: identity-professional
Arlin: ☐

**DEF_008** — *"If I'm not productive, I have nothing to offer."*
Distortion: worth-as-output, dichotomous thinking · Domain: identity-productivity
Arlin: ☐

**DEF_009** — *"I keep doing this — something is wrong with me."*
Distortion: self-labeling, overgeneralization · Domain: self-judgment
Arlin: ☐

**DEF_010** — *"If I take the day off, it means I'm lazy."*
Distortion: should-statement, dichotomous thinking · Domain: identity-productivity
Arlin: ☐

**DEF_011** — *"He didn't text back because I came on too strong."*
Distortion: mind-reading, personalization · Domain: relational-romantic
Arlin: ☐

**DEF_012** — *"It's already too late to fix this."*
Distortion: fortune-telling, catastrophizing · Domain: situational
Arlin: ☐

**DEF_013** — *"I have to handle this alone or I'm weak."*
Distortion: should-statement, dichotomous thinking · Domain: identity-strength
Arlin: ☐

**DEF_014** — *"If I cry in front of them, they'll lose respect for me."*
Distortion: fortune-telling, mind-reading · Domain: relational-vulnerability
Arlin: ☐

**DEF_015** — *"This always happens to me."*
Distortion: overgeneralization, victim framing · Domain: situational
Arlin: ☐

---

## Notes for ratification pass

Arlin: when reviewing on phone or desktop, for each entry —
- ✅ keep as written
- ✏️ edit (note the edit inline or in chat)
- ❌ drop
- ↔ change primary chip (specify which)

After ratification, this file converts to `src/practice-evidence/stimuli.json` for Sprint 2 consumption (affect-labeling exercise UI and AI defusion scorer respectively).

---

*ARA Embers LLC · Practice Evidence Sprint 1 — Stimulus Library v1 · DRAFT for ratification*
