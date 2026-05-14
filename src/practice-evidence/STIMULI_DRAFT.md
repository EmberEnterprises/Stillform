# Practice Evidence — Stimulus Library DRAFT

**For Arlin's ratification.** Sprint 1 deliverable per `COGNITIVE_FUNCTION_MEASUREMENT_PHASE_1_AUDIT.md` Decision 3.

Once Arlin marks scenarios (✅ keep / ✏️ edit / ❌ drop / ↔ change primary chip), this converts to `stimuli.json` for Sprint 2 consumption. Disputed entries don't ship.

---

## Integrity statement on cultural inclusion

Stillform is a global app. The stimulus library can't default to Anglo-American knowledge-work middle-class scenarios. v1 of this draft did exactly that. v2 expands across cultural, racial, identity, ability, age, class, religious, gender, caregiving, and geographic axes, and adds **moral, ethical, and cultural-difference encounters** as their own trigger category — these are real stuck states that the library was missing entirely.

### What v2 spans (beyond v1's Western individualist baseline)

- **Race / ethnicity** — workplace microaggression, code-switching fatigue, witnessed disrespect, comments-section exposure, generational distance from family of origin
- **Immigration / mobility** — border crossing with status precarity, distance from family, bilingual identity-switching
- **LGBTQ+** — disclosure decision-making (intentionally generic so it covers any identity disclosure)
- **Disability / chronic illness** — pain remission, post-treatment let-down, body estrangement, accommodation friction
- **Religious / spiritual practice** — prayer completion, faith doubt, religious community pressure
- **Caregiving / family load** — aging parent, child illness, parental protective response, post-shift decompression
- **Class / financial** — rent precarity, shift work decompression, scholarship anticipation, class-marker exposure
- **Gendered scripts** — body-policing from a relative, beauty-standard moment, emotional-expression cost
- **Age-stage variation** — younger first-yes, older "I used to enjoy these" contrast, mid-life caregiving simultaneity
- **Collectivist family/honor framings** — siblings sharing inherited food, family-expectation vs personal-path conflict, shame-on-family thoughts
- **Body diversity** — chronic-pain remission, body change from medication/illness/pregnancy/age/surgery
- **Skilled trade and care work** — holding tools before work begins, sitting with a client when the right question lands
- **NEW: moral / ethical / cultural-difference encounters** — witnessing wrongdoing and weighing whether to speak up, holding a secret confession, sitting with a moral dilemma where either choice harms someone, being asked to compromise values, navigating culturally-different unwritten rules in real time

### Known limits even in v2

- Author bias persists even when expanded. Cultural fluency comes from lived experience, not careful research.
- Religious content covers Abrahamic shapes more thoroughly than dharmic, indigenous, or non-theistic traditions.
- "Universal" triggers are still written in English with English-language idioms.
- Disability content is authored from observation, not lived experience.
- Validation requires raters from across the axes named above — same-background raters miss what same-background authors miss. (See "Open question: second-rater plan" below.)

These limits are named here so they aren't invisible defaults. v3 expansion explicitly invites community-authored scenarios from users in underrepresented groups.

---

## Open question: second-rater plan

The audit recommended Arlin + Bobby. Per current state, Bobby is paper-only on the LLC and not involved in product decisions. The cultural-inclusion commitment also requires raters across the axes the library covers — same-background raters won't catch what same-background authors miss.

Options:

- **(a)** Arlin alone — fastest, lowest validation confidence
- **(b)** Ava + 1-2 others as a small in-circle panel — closer, still likely same-demographic
- **(c)** AI as cross-check rater — available, lower quality than human, fits the "AI drafts, Arlin ratifies" pattern already used here
- **(d)** Small diverse panel drawn from beta tester pool across underrepresented backgrounds (LGBTQ+, BIPOC, disabled/chronically ill, religious/spiritual, immigrant/multicultural, caregivers, hourly/shift workers) — each scenario rated by 2-3 people including at least one from outside the author's demographic. Highest integrity, slowest.
- **(e)** Hybrid: Arlin rates all, AI cross-checks as secondary, targeted lived-experience review for scenarios in someone's specific context. Faster than (d), higher integrity than (a) or (c).

Arlin's call.

---

## Rubric for cognitive defusion scoring — non-moralizing language

The user generates alternate frames for a sticky thought. Each frame gets categorized — no numerical scoring (no "1.0 / 0.5 / 0.0" hierarchy that implies one is morally better):

- **Distinct** — generated a new perspective from the original thought. The frame introduces a different actor's intent, reality-tests the assumption, surfaces an underlying value, or accepts the worst case without amplifying it.
- **Reworded** — same perspective, different words. Synonym swap, voice change, hedging added.
- **Same** — accepted the thought as-is, no perspective shift.

**Tracked metric:** distinct count over time.

**What this measurement tracks (explicit):** *cognitive flexibility* — the user's capacity to generate alternate perspectives on a sticky thought. Flexibility is one valid response to a sticky thought; sometimes accepting the thought as-is (radical acceptance, contemplative traditions, situations where the thought is accurate and best honored by being witnessed rather than reframed) is also valid. The measurement isn't a moral score. It tracks one specific capacity the practice trains.

**User-facing display:** *"5 frames generated. 3 distinct, 1 reworded, 1 same. Distinct count is what's tracked over time."*

No partial-credit numbers. Categorical observation + tracked count.

---

## Affect-Labeling Scenarios (60)

**Chip set in use:** Excited · Focused · Settled · Anxious · Angry · Stuck · Mixed · Flat · Distant · Unsure

*Mixed and Unsure are escape hatches, not measurement targets. Three Mixed scenarios are deliberately included as ambiguity-tests for rater agreement.*

Each scenario: primary chip, optional secondary if reasonably ambiguous, trigger category, cultural/identity context where relevant.

---

### EXCITED — positive activation, forward-leaning

**AL_E1** — *"You just got a yes from someone whose opinion you've been chasing for months."*
Primary: **Excited** · Secondary: Focused · Trigger: external-validation
Arlin: ☐

**AL_E2** — *"You walk out of an audition, a pitch, or a first date and you can feel something landed."*
Primary: **Excited** · Trigger: post-performance
Arlin: ☐

**AL_E3** — *"A close friend tells you they bought the tickets for the trip you've been planning together."*
Primary: **Excited** · Trigger: anticipation-positive
Arlin: ☐

**AL_E4** — *"Your grandmother calls to say a recipe she's been holding back for years is finally yours to learn."*
Primary: **Excited** · Secondary: Settled · Trigger: heritage-handoff · Context: family-tradition
Arlin: ☐

**AL_E5** — *"A scholarship or grant application you were sure you wouldn't get comes through."*
Primary: **Excited** · Trigger: financial-relief-aspirational · Context: economic-access
Arlin: ☐

**AL_E6** — *"Your team won the championship and the city is going to celebrate tonight."*
Primary: **Excited** · Trigger: collective-victory · Context: community-shared-event
Arlin: ☐

**AL_E7** — *"Your name appears on a list you didn't expect to be on."*
Primary: **Excited** · Secondary: Anxious · Trigger: recognition-unexpected
Arlin: ☐

---

### FOCUSED — productive activation, attentive

**AL_F1** — *"You've been on a problem for two hours and you can see the shape of the solution."*
Primary: **Focused** · Trigger: creative-flow
Arlin: ☐

**AL_F2** — *"You sit down at your desk after a strong morning routine and the work is right there."*
Primary: **Focused** · Secondary: Settled · Trigger: routine-anchor
Arlin: ☐

**AL_F3** — *"You're walking into a meeting where you know what you're going to say and you've prepared everything."*
Primary: **Focused** · Trigger: preparedness
Arlin: ☐

**AL_F4** — *"You're cooking a meal that takes seven hours and you're three hours in."*
Primary: **Focused** · Trigger: extended-craft · Context: domestic-creative
Arlin: ☐

**AL_F5** — *"You're sitting with a client and the right question to ask just came to you."*
Primary: **Focused** · Trigger: presence-attentive · Context: care-work-OR-consulting
Arlin: ☐

**AL_F6** — *"The student in your class who never raises their hand just raised it."*
Primary: **Focused** · Trigger: attention-shift-relational · Context: teaching-caregiving
Arlin: ☐

**AL_F7** — *"You're holding tools you're trained to use and the work is about to start."*
Primary: **Focused** · Trigger: skilled-trade-execution · Context: skilled-labor
Arlin: ☐

---

### SETTLED — positive low-activation, regulated

**AL_S1** — *"Your shift just ended. You're sitting on the bus home and your shoulders are starting to drop."*
Primary: **Settled** · Trigger: post-shift-decompression · Context: shift-work
Arlin: ☐

**AL_S2** — *"You just had a hard conversation that landed well and the other person left feeling seen."*
Primary: **Settled** · Secondary: Focused · Trigger: relational-resolution
Arlin: ☐

**AL_S3** — *"You finish a long walk and your breathing has slowed without you noticing."*
Primary: **Settled** · Trigger: physiological-downshift
Arlin: ☐

**AL_S4** — *"You're holding your baby and they finally fell asleep on your chest."*
Primary: **Settled** · Trigger: caregiving-rest · Context: parenting
Arlin: ☐

**AL_S5** — *"You and your siblings are eating something your mother used to make. Nobody has to explain anything."*
Primary: **Settled** · Trigger: heritage-shared · Context: collectivist-family
Arlin: ☐

**AL_S6** — *"You finished morning prayers and the quiet after them is yours."*
Primary: **Settled** · Trigger: spiritual-practice-completion · Context: religious-practice
Arlin: ☐

**AL_S7** — *"You've been in pain for three days and this morning you woke up and it isn't there."*
Primary: **Settled** · Secondary: Distant · Trigger: pain-remission · Context: chronic-illness
Arlin: ☐

---

### ANXIOUS — forward-anticipation, high activation

**AL_AN1** — *"Your phone buzzes with a text from someone you've been waiting to hear from. You pick it up and your hand is shaking before you read it."*
Primary: **Anxious** · Trigger: anticipation-uncertain
Arlin: ☐

**AL_AN2** — *"Email subject line: 'we need to talk' from someone you can't ignore."*
Primary: **Anxious** · Trigger: work-confrontation-pending
Arlin: ☐

**AL_AN3** — *"Your doctor's office called and left a voicemail asking you to call back. The office is closed for the weekend."*
Primary: **Anxious** · Trigger: health-uncertainty
Arlin: ☐

**AL_AN4** — *"Rent is due in three days and the deposit you were expecting hasn't landed."*
Primary: **Anxious** · Trigger: financial-acute · Context: housing-precarity
Arlin: ☐

**AL_AN5** — *"You're crossing a border with a document situation that's complicated to explain."*
Primary: **Anxious** · Secondary: Stuck · Trigger: status-precarity · Context: immigration
Arlin: ☐

**AL_AN6** — *"Your parent calls outside their usual time. Their voice on the message is different."*
Primary: **Anxious** · Trigger: family-emergency-anticipation · Context: caregiving-distance
Arlin: ☐

**AL_AN7** — *"You're about to disclose something about yourself to someone whose reaction you can't predict."*
Primary: **Anxious** · Secondary: Stuck · Trigger: disclosure · Context: identity-OR-health-OR-belief
Arlin: ☐

**AL_AN8** — *"The pregnancy test is on the counter and the timer hasn't gone off yet."*
Primary: **Anxious** · Trigger: anticipation-life-altering · Context: reproductive
Arlin: ☐

---

### ANGRY — high-activation, violation

**AL_AG1** — *"Someone interrupts you for the third time in the same meeting and looks at the person who actually asked the question."*
Primary: **Angry** · Trigger: workplace-erasure
Arlin: ☐

**AL_AG2** — *"Your partner tells you they handled something the way you specifically asked them not to."*
Primary: **Angry** · Trigger: boundary-violation-domestic
Arlin: ☐

**AL_AG3** — *"You read a message thread where someone takes credit for your work in front of people you respect."*
Primary: **Angry** · Secondary: Stuck · Trigger: professional-violation
Arlin: ☐

**AL_AG4** — *"Someone makes a joke about people like you. The room laughs. Nobody looks at you."*
Primary: **Angry** · Secondary: Distant · Trigger: identity-marked-violation · Context: marginalization
Arlin: ☐

**AL_AG5** — *"A relative says something casual about your body that they meant as helpful."*
Primary: **Angry** · Secondary: Stuck · Trigger: body-policing-familial · Context: family-of-origin
Arlin: ☐

**AL_AG6** — *"You overhear two coworkers calling someone you know by a nickname they wouldn't use to their face."*
Primary: **Angry** · Trigger: witnessed-disrespect · Context: workplace
Arlin: ☐

**AL_AG7** — *"Your child comes home and tells you what was said to them at school today."*
Primary: **Angry** · Secondary: Stuck · Trigger: parental-protective · Context: parenting
Arlin: ☐

**AL_AG8** — *"You see a news story about something that happened in your community and the comments are below it."*
Primary: **Angry** · Secondary: Distant · Trigger: collective-violation · Context: public-discourse
Arlin: ☐

---

### STUCK — cognitive looping, not moving · includes the new moral / ethical / cultural-difference triggers

**AL_ST1** — *"You've rewritten the same email seven times and the cursor is still blinking at the end."*
Primary: **Stuck** · Trigger: decision-paralysis-output
Arlin: ☐

**AL_ST2** — *"You keep checking the chat to see if they replied. They haven't replied for an hour."*
Primary: **Stuck** · Secondary: Anxious · Trigger: rumination-relational
Arlin: ☐

**AL_ST3** — *"You can't decide between two options and you've been deciding for three days."*
Primary: **Stuck** · Trigger: decision-paralysis-choice
Arlin: ☐

**AL_ST4** — *"A conversation from two days ago is replaying in your head and you keep finding new things you should have said."*
Primary: **Stuck** · Trigger: rumination-replay
Arlin: ☐

**AL_ST5** — *"Your boss asked you to do something that isn't quite right, and you can't tell if the cost of speaking up is worth it."*
Primary: **Stuck** · Secondary: Mixed · Trigger: **moral-dilemma-workplace** · Context: ethics
Arlin: ☐

**AL_ST6** — *"Your family expects one thing for your future and you're starting to see a different one."*
Primary: **Stuck** · Trigger: **identity-vs-family-cultural** · Context: collectivist-family-expectation
Arlin: ☐

**AL_ST7** — *"You're sitting with a choice that affects someone you care about, and either way somebody loses."*
Primary: **Stuck** · Trigger: **moral-dilemma-relational** · Context: ethics-caregiving
Arlin: ☐

**AL_ST8** — *"Someone shared a confession with you that you're not sure you should be holding alone."*
Primary: **Stuck** · Secondary: Anxious · Trigger: **secret-burden-witness** · Context: ethics-witness
Arlin: ☐

---

### FLAT — low energy, neutral valence

**AL_FL1** — *"You wake up, look at the day, and feel nothing about any of it. Not bad. Not good. Just nothing."*
Primary: **Flat** · Trigger: anhedonia-morning
Arlin: ☐

**AL_FL2** — *"Your favorite meal is on the table and you can't think of why you wanted it."*
Primary: **Flat** · Trigger: pleasure-disconnect
Arlin: ☐

**AL_FL3** — *"You finish work and stare at the wall. The to-do list is on your phone and you can't open it."*
Primary: **Flat** · Secondary: Distant · Trigger: depletion-eod
Arlin: ☐

**AL_FL4** — *"Your kids are calling you to come watch something they're excited about. You're getting up, but you can't feel it."*
Primary: **Flat** · Trigger: caregiving-depletion · Context: parenting
Arlin: ☐

**AL_FL5** — *"You're at a celebration and you remember you used to enjoy these."*
Primary: **Flat** · Trigger: contrast-past-self · Context: aging-OR-grief-OR-burnout
Arlin: ☐

**AL_FL6** — *"You finished a treatment cycle and the relief you were promised hasn't arrived."*
Primary: **Flat** · Trigger: post-medical · Context: chronic-illness-OR-mental-health
Arlin: ☐

---

### DISTANT — disconnection from body or moment · includes the new cultural-difference triggers

**AL_DT1** — *"You're listening to someone tell you something important and you realize you stopped hearing them three sentences ago."*
Primary: **Distant** · Trigger: dissociation-conversation
Arlin: ☐

**AL_DT2** — *"You catch your reflection in a window and don't recognize the expression on your face."*
Primary: **Distant** · Trigger: depersonalization-mirror
Arlin: ☐

**AL_DT3** — *"You're in the middle of a conversation and your body feels like it's a foot behind you."*
Primary: **Distant** · Trigger: dissociation-body
Arlin: ☐

**AL_DT4** — *"You're at a family event where you used to feel like you belonged, and today you don't."*
Primary: **Distant** · Secondary: Flat · Trigger: **belonging-shift-cultural** · Context: family-OR-cultural-difference
Arlin: ☐

**AL_DT5** — *"You're switching between two languages in the same hour and your sense of who you are is switching with them."*
Primary: **Distant** · Trigger: **code-switching-fatigue** · Context: bilingual-multicultural
Arlin: ☐

**AL_DT6** — *"You're in a body that doesn't feel like yours right now — illness, pregnancy, injury, medication, age, surgery."*
Primary: **Distant** · Trigger: body-estrangement · Context: physical-change
Arlin: ☐

---

### MIXED — deliberately ambiguous (rater-agreement tests)

**AL_MX1** — *"You just got the promotion you wanted. You can't tell if what you feel is excitement or dread."*
Primary: **Mixed** · Secondary: Anxious · Trigger: ambivalence-success
Arlin: ☐

**AL_MX2** — *"Your kid moves out today. You're proud of them and you can barely look at the empty room."*
Primary: **Mixed** · Trigger: ambivalence-loss
Arlin: ☐

**AL_MX3** — *"A relationship just ended that needed to end. You're relieved and you can't stop crying."*
Primary: **Mixed** · Trigger: ambivalence-resolution
Arlin: ☐

---

## Cognitive Defusion Thoughts (30)

Each thought is a sticky cognition the user attempts to defuse from — generating alternative frames that get categorized per the non-moralizing rubric above. Spans distortion categories AND cultural/identity contexts.

---

### Mind-reading / Personalization

**DEF_M1** — *"She didn't reply because she's mad at me."*
Distortion: mind-reading, personalization · Domain: relational
Arlin: ☐

**DEF_M2** — *"He didn't text back because I came on too strong."*
Distortion: mind-reading, personalization · Domain: relational-romantic
Arlin: ☐

**DEF_M3** — *"They're going to figure out I don't actually belong here."*
Distortion: fortune-telling, impostor pattern · Domain: identity-professional
Arlin: ☐

**DEF_M4** — *"If I speak up, they'll think I'm playing the [identity] card."*
Distortion: mind-reading, fortune-telling · Domain: identity-marginalization · Context: race-gender-disability-orientation
Arlin: ☐

**DEF_M5** — *"They're judging me right now."*
Distortion: mind-reading · Domain: social
Arlin: ☐

---

### Fortune-telling / Catastrophizing

**DEF_F1** — *"If I push back on this, they'll cut me off."*
Distortion: fortune-telling, catastrophizing · Domain: relational
Arlin: ☐

**DEF_F2** — *"If I rest, everything will fall apart."*
Distortion: catastrophizing, control fallacy · Domain: identity-productivity
Arlin: ☐

**DEF_F3** — *"It's already too late to fix this."*
Distortion: fortune-telling, catastrophizing · Domain: situational
Arlin: ☐

**DEF_F4** — *"If I tell my parents, they'll be devastated and never forgive me."*
Distortion: fortune-telling, catastrophizing · Domain: family-disclosure · Context: collectivist-family-honor
Arlin: ☐

**DEF_F5** — *"If I'm seen with this body, they'll dismiss what I have to say."*
Distortion: fortune-telling, mind-reading · Domain: body-politics · Context: weight-disability-marked-body
Arlin: ☐

---

### Self-labeling / Overgeneralization

**DEF_L1** — *"I'm a bad parent because I lost my temper."*
Distortion: self-labeling, overgeneralization · Domain: parenting
Arlin: ☐

**DEF_L2** — *"I'm too much for people."*
Distortion: self-labeling, overgeneralization · Domain: relational
Arlin: ☐

**DEF_L3** — *"I keep doing this — something is wrong with me."*
Distortion: self-labeling, overgeneralization · Domain: self-judgment
Arlin: ☐

**DEF_L4** — *"This always happens to me."*
Distortion: overgeneralization, victim framing · Domain: situational
Arlin: ☐

**DEF_L5** — *"I'm taking up too much space."*
Distortion: self-labeling, should-statement · Domain: identity-presence · Context: gendered-OR-marginalized
Arlin: ☐

---

### Should-statements / Dichotomous

**DEF_S1** — *"I should have known better."*
Distortion: should-statement, hindsight bias · Domain: self-judgment
Arlin: ☐

**DEF_S2** — *"If I take the day off, it means I'm lazy."*
Distortion: should-statement, dichotomous thinking · Domain: identity-productivity · Context: capitalist-Protestant-work-ethic (one of multiple work-ethic shapes — included as one distortion among others, not a universal default)
Arlin: ☐

**DEF_S3** — *"I have to handle this alone or I'm weak."*
Distortion: should-statement, dichotomous thinking · Domain: identity-strength
Arlin: ☐

**DEF_S4** — *"If I rest, I'm letting my family down."*
Distortion: should-statement, catastrophizing · Domain: family-obligation · Context: collectivist-family-OR-caregiver
Arlin: ☐

**DEF_S5** — *"I should be over this by now."*
Distortion: should-statement, hindsight bias · Domain: grief-recovery-trauma
Arlin: ☐

---

### Worth-as-output / Productivity framings

**DEF_W1** — *"If I'm not productive, I have nothing to offer."*
Distortion: worth-as-output, dichotomous thinking · Domain: identity-productivity
Arlin: ☐

---

### Religious / spiritual

**DEF_R1** — *"God is testing me and I'm failing."*
Distortion: should-statement, self-labeling · Domain: faith · Context: Abrahamic-monotheistic
Arlin: ☐

**DEF_R2** — *"If I had more faith, this would be easier."*
Distortion: should-statement, self-labeling · Domain: faith · Context: religious-practice
Arlin: ☐

---

### Collectivist / family-honor

**DEF_C1** — *"I'm bringing shame on my family."*
Distortion: self-labeling, catastrophizing · Domain: family-honor · Context: collectivist
Arlin: ☐

**DEF_C2** — *"I started behind where they did, so I'll never catch up."*
Distortion: fortune-telling, dichotomous thinking · Domain: identity-class-mobility · Context: class-OR-immigrant
Arlin: ☐

---

### Body / health

**DEF_B1** — *"My body is failing me."*
Distortion: self-labeling, personalization · Domain: body-illness · Context: chronic-illness-OR-aging
Arlin: ☐

**DEF_B2** — *"My pain isn't as bad as someone else's so I shouldn't complain."*
Distortion: should-statement, comparison-minimization · Domain: pain-validity · Context: chronic-illness-invalidation
Arlin: ☐

---

### Moral / ethical witness

**DEF_E1** — *"I should have said something."*
Distortion: should-statement, hindsight bias · Domain: **moral-witness** · Context: ethics
Arlin: ☐

**DEF_E2** — *"I caused this by being there."*
Distortion: personalization, control fallacy · Domain: **moral-witness** · Context: ethics-OR-trauma
Arlin: ☐

---

### Identity / disclosure

**DEF_I1** — *"If I cry in front of them, they'll lose respect for me."*
Distortion: fortune-telling, mind-reading · Domain: relational-vulnerability · Context: gendered-emotional-expression
Arlin: ☐

**DEF_I2** — *"If they really knew me, they'd leave."*
Distortion: fortune-telling, mind-reading · Domain: relational-disclosure · Context: identity-OR-trauma-OR-secret
Arlin: ☐

---

## Notes for ratification pass

Arlin: for each entry —
- ✅ keep as written
- ✏️ edit (note the edit inline or send to me in chat)
- ❌ drop
- ↔ change primary chip (specify which)

Disputed entries don't ship. After ratification, this file converts to `src/practice-evidence/stimuli.json` for Sprint 2 consumption (affect-labeling exercise UI and AI defusion scorer).

### Phone-friendly review

90 entries is a lot to rate on a phone. If a Sprint 1.5 build of a phone-batched ratification UI would help, say so — could be a checklist screen with swipe-to-keep, swipe-to-drop, tap-to-edit, save state. Or this stays a markdown file you mark up at desktop pace.

---

*ARA Embers LLC · Practice Evidence Sprint 1 — Stimulus Library DRAFT · global app · cultural inclusion + non-moralizing rubric built in*
