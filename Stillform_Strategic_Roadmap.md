# STILLFORM — Strategic Roadmap & Open Questions

---

## ⚡ CURRENT STATE — April 30, 2026 (TOP OF FILE)

**Most of this document below is stale (Apr 8 vintage).** Critical updates:

**All Apr 8 blockers cleared.** Lemon Squeezy live (Bobby confirmed live mode switch). Apple Developer purchased. DUNS confirmed. Cloud infrastructure (Supabase) shipped Apr 15. Paywall end-to-end working. Three-table schema with RLS + AES-256 encryption. Pre-update backup system live.

**Launch standard locked Apr 29.** Master todo complete except translations + Apple Store. No testimonial gate. Reddit not a launch step. 

**The current top priority is NOT what's written below — it's Cognitive Function Measurement.** See COGNITIVE_FUNCTION_MEASUREMENT_SPEC.md and Stillform_Master_Todo.md top section.

**Apr 30 single-day session shipped:**
- 12 code commits (prestige refresh 5x, Settled chip, Body Scan What Shifted, three-category data feed, dead modeConfig cleanup, chip ⓘ system, Cyclic Sighing pattern, low-demand mode Phase 1)
- 7+ documentation commits (master todo, transfer doc, science sheet, multiple specs and consultation prompts)
- Four-round AI consultation arc; track exhausted; spark came from Arlin's own diagnosis: engagement craft, not architecture

**For full Apr 30 context:** STILLFORM_PROJECT_TRANSFER.md Section 3 has the complete arc.

**Blockers remaining (different from Apr 8 list):**
- Cognitive Function Measurement build (6-8 weeks) — moonshot feature
- Closing language pass (drafted in CLOSING_LANGUAGE_CANDIDATES.md, awaiting Arlin direction)
- Body-first pre-rate friction (GPT Round 3 catch — needs design)
- Low-demand mode Phase 2 (Body Scan) and Phase 3 (Reframe) — Phase 1 shipped Apr 30; Phase 2 architectural decision pending
- Translations (Spanish, Brazilian Portuguese, Armenian) — post-launch
- TestFlight — blocked on Arlin getting iPhone access

The document below is preserved as historical context. Do not act on the Apr 8 critical path without checking against current state above first.

---

## RETURN-LOOP ARCHITECTURE — Why Everything Must Ship Before Launch

The seven testers (Ava, Bobby, Ari, Michelle, Paula, Ive, Jonny) tested Stillform, said it was cool, and bounced. Plausible confirms Arlin has been the only user for the past month. This is not a bug in user acquisition — it is the diagnostic signal for what is missing.

The seven testers experienced **layer one only**: the regulation tool. The substance is real and the science is right. They had a "this is cool" reaction to the first session. Then nothing pulled them back. Cool is the most damning compliment a product can get — impressive but not necessary.

The launch product is a different product than what the testers used. The launch product has **three layers** that together produce return:

**Layer 1: The Regulation Tool (SHIPPED).** Breathe / Body Scan / Reframe / Self Mode. Bio-filter, Russell circumplex chips, three-category data feed, override pathways. Verified by testers as "cool."

**Layer 2: The Return-Loop Infrastructure (PARTIALLY SHIPPED, MOSTLY PENDING).** What pulls the user back when they are not in the app. Watch integration, HRV measurement, Health Connect / HealthKit, biometric lock, notifications infrastructure. Some pieces have shipped (notifications infrastructure via Capacitor); the integrations and HRV are pending and gated on Bobby's Lemon Squeezy live mode switch and on Arlin getting Android Studio installed locally.

**Layer 3: The Engagement Craft Layer (PARTIALLY SHIPPED MAY 1, MOSTLY PENDING).** Recognition between sessions still pending. Plain-Language Neuroscience Surface SHIPPED May 1 (post-session card with 36-entry verified corpus + 20 static fallbacks + ⓘ transparency modal). Kinesthetic close interaction direction chosen but spec not yet drafted. Cognitive Function Measurement is the moonshot, 6-8 weeks of focused build. All grounded in Engagement Principles section of Science Sheet (Fogg behavior model, Wood & Rünger habit research, Self-Determination Theory, Kahneman System 1/2, Ariely defaults, Eyal variable reward, Gollwitzer implementation intentions, Kleitman ultradian rhythm, Norman affordance perception, Pielot/Mehrotra/Harris attention-respectful design).

Shipping any one layer alone produces the cool-and-bounce pattern at scale. All three together is the actual launch product.

This is why "EVERYTHING needs to be done before launch" is not perfectionism — it is the architecture of return.

---

## CURRENT BLOCKERS (April 30, 2026)

### Pending integrations (return-loop infrastructure)
- **Watch integration** — Wear OS haptic breathing companion. Test device: Galaxy Watch Ultra. Requires Android Studio installed locally on Mac (storage constraint flagged in memory; OneDrive option noted).
- **Health Connect / HealthKit** — HRV, sleep, heart rate. Continuous biometric signal flowing into Stillform's data layer.
- **Biometric lock** — Face ID / fingerprint on Reframe and Signal Log entry.

### Pending engagement craft (return moments + delight)
- **Cognitive Function Measurement** — moonshot, 6-8 weeks focused build. Spec at COGNITIVE_FUNCTION_MEASUREMENT_SPEC.md.
- **Kinesthetic close interaction** — direction chosen (Reading 3, single tap on slow-pulsing point or long-press to seal). Spec to draft, grounded in Engagement Principles 4 and 9.

### Engagement craft shipped (May 1, 2026)
- **Plain-language neuroscience surface** — SHIPPED May 1. Post-session card with 36-entry verified corpus + 20 static fallbacks + ⓘ transparency modal. Spec at PLAIN_LANGUAGE_SCIENCE_CARD_SPEC.md. See master todo and transfer doc Section 2.5 for full context. Pending Protection C corpus verification before user-facing exposure.

### Pending low-demand mode (cohort coverage)
- **Phase 2 (Body Scan)** — spec drafted Apr 30 (LOW_DEMAND_PHASE_2_SPEC.md), awaiting Arlin's direction on 5 open questions.
- **Phase 3 (Reframe)** — spec drafted Apr 30 (LOW_DEMAND_PHASE_3_SPEC.md), awaiting Arlin's direction on 5 open questions. Most complex of the three because AI behavior changes too.

### Post-launch only (not blocking initial release)
- Translations (Spanish, Brazilian Portuguese, Armenian)
- Apple Store / TestFlight broad release (Arlin needs iPhone access)

### Resolved earlier in April (no longer blockers)
- Lemon Squeezy live (Bobby confirmed live mode switch)
- Apple Developer Program purchased ($99/yr)
- DUNS confirmed
- Cloud infrastructure (Supabase) shipped Apr 15 — three-table schema, RLS, AES-256 encryption, pre-update backup
- Paywall end-to-end working

---

## DECISION FRAME — What Earns a Place Before Launch

Each pending item evaluated against: does this contribute to the return loop?

- **Watch integration** — yes (haptic breathing without opening the app is a return-loop primitive)
- **HRV / Health** — yes (biometric signal flowing in is data the user owns and returns to see)
- **Biometric lock** — no, but it is privacy/integrity (ships before launch for that reason, not as return mechanic)
- **Cognitive Function Measurement** — yes (in-app exercise plus the results-over-time become a return reason)
- **Plain-language neuroscience surface** — yes (each landed surface is a small return moment)
- **Kinesthetic close interaction** — partial (in-session delight does not produce return on its own but compounds with the rest)
- **Low-demand mode Phases 2/3** — yes (covers cohort that would otherwise bounce after one session because the standard flow does not work for them)

Items shipping post-launch (translations, broad TestFlight) do not gate return because the cohorts they serve are not the early-launch cohort.

---

## ENGAGEMENT CRAFT RESEARCH FOUNDATION — established April 30

The Science Sheet now contains a parallel Engagement Principles section grounding Stillform's engagement craft in 10 citation-grounded behavioral science principles. Each principle has a Stillform application paragraph naming which existing or planned feature it grounds.

**Operating rule:** every feature should be grounded in at least one Pillar (neuroscience) AND at least one Principle (behavioral science). Missing one or the other is the gap engagement craft is designed to close.

**Award case framing:** "Stillform's claims are grounded in two parallel research traditions — neuroscience for what the practice does inside the brain, and behavioral science for what the practice does in the user's life." Stronger case than either alone. Most products skip one or the other. Stillform sits in the intersection.

---

## RESEARCH INSIGHTS THAT CHANGE STRATEGY

### Breathing Patterns Don't Matter (But Breathing Does)
The largest RCT (n=400) found no difference between coherent breathing and placebo breathing. Both groups improved. The active ingredient is focused attention on breath, not the ratio. Stillform shouldn't oversell specific patterns. The value is in the practice.

**Action:** Simplify breathing options OR reframe them as "preference" not "prescription." Stop implying 4-4-8-2 is scientifically different from Box breathing.

### AI Effects Are Temporary Without Ongoing Use
Meta-analysis: chatbot improvements peak at 8 weeks, disappear at 3 months. Same as therapy — effects fade without continued practice. The morning/evening check-in structure isn't just a feature, it's the mechanism that prevents decay.

**Action:** Frame the daily check-in as essential, not optional. The AI tells users: "The more you show up, the sharper this gets. I can't help you with a pattern I only see once."

### Retention Is THE Battle
30-day retention for mental health apps: 3.3%. 77% of users abandon after one use. Gamification doesn't help and may hurt. What DOES help: reminders, human contact (or simulated), personalization that deepens.

**Action:** 
- Neuro voice companion = simulated human contact
- AI that remembers = personalization that deepens
- Morning/evening check-in = daily return reason
- Composure Telemetry = visible progress
- Contextual push notifications (native) = smart nudges not spam

### Emotion Regulation Shows the Strongest Effect
Meta-analysis of 39 RCTs: emotion regulation apps showed g=0.49 (medium effect) — stronger than symptom reduction or well-being apps. Stillform IS an emotion regulation app. It's targeting the mechanism with the most evidence.

**Action:** Lean into this in marketing. "Not a wellness app. A regulation system." The data backs it.

### Anti-Gamification Is Evidence-Based
The meta-analysis found gamification elements "did not improve, and might weaken, retention." Killing streaks, points, and badges wasn't just philosophical — it was the right call per the research.

**Action:** Never add gamification, even if competitors do. Cite the meta-analysis if challenged.

---

## USER FEEDBACK ACTIONED

### Bobby (First Real User Session)
- ✅ Back button steps backward (fixed)
- ✅ "SELECT ALL THAT APPLY" prominent (fixed)
- ✅ Pulse chip-text bug — chips and notes separated into distinct state (fixed)
- ✅ Font sizes increased (chips, labels, notes, buttons all bumped up)
- ✅ Scroll reduced on Pulse tab (disclaimer spacing tightened)
- ⏳ Text still too dim for aging eyes — consider a text size / high contrast accessibility toggle in Settings

### Ava (Home Screen Only)
- Early user feedback (Ava): the Breathe & Ground tool and Reframe were the parts that landed.
- No full session feedback yet

### Arlin (Builder/User)
- Fractal breathing prototype tested during CT scan — effective for grounding
- Visual thinker insight — verbal input is a broken path for significant % of users
- "Discharge" killed because it implied Reframe wasn't private — good instinct
- Forced positivity killed — research backs this decision
- "The app should be an architect helping remove scaffolding of bullshit" — product philosophy
- Breathing patterns could simplify to two options — honest about the research

---

## PHILOSOPHY — LOCKED

**Stillform is not:**
- A meditation app
- Therapy
- A wellness program
- A brain training game
- A crisis intervention tool

**Stillform IS:**
- An architect that helps remove the scaffolding
- A composure system for the full spectrum — hard moments AND winning moments
- A conditioning tool — daily practice builds the neural pathways
- A channel to self-awareness, not a replacement for human connection
- The opposite of faster, more, numb, perform, mask, bypass

**The unfolding:** The app doesn't teach people who to be. It strips away the noise, the distortions, the misreads, the masks — and what's left is the person. The AI's job is to get them regulated enough to see themselves honestly, then shut up. "You didn't need a tool for that one. You handled it. Notice that." — that's the scaffolding coming down.


### The Endgame — Composure as Class

Composure isn't self-management. It's the ability to hear people.

When you're dysregulated, your nervous system makes snap judgments — about who's credible, who deserves attention, whose input matters. Those judgments track to ego, status, familiarity, and pattern matching. Not content. Not truth.

The person who grew up in poverty has pattern recognition about scarcity that no MBA teaches. The trauma survivor reads rooms faster than anyone at the table. The neurodivergent thinker sees connections nobody else caught. But none of that lands when the listener is running on bias, ego, and an unregulated nervous system deciding who's worth hearing before a word is spoken.

Stillform's endgame is not "feel better." It's:

**Regulate yourself → See yourself clearly → See others clearly → Let them in.**

The microbiases layer isn't just about managing your emotions. It's about clearing the filter that prevents you from receiving someone else's experience. When the AI says "You dismissed that fast — was that about what they said, or who said it?" — that's not a lecture about bias. That's composure applied outward.

Class isn't money. It isn't titles. It's holding yourself steady enough to let someone else's truth land — even when it challenges yours.

This is not DEI language. This is not a social justice feature. This is composure as a way of being — applied to every interaction, every meeting, every relationship. The app doesn't tell people to be less biased. It gets them composed enough to notice the bias themselves.

People with real lived experience — trauma, hardship, different cultures, different classes — carry input that's vital to every table they sit at. The app's job is to make sure the person across from them is regulated enough to actually receive it.


**Target market:** Everyone. The ND community is the beachhead because they need it most and talk about it openly. But composure is universal. A CEO, a parent, a student, a first responder — all need the same thing: clarity under pressure and self-awareness in every state.

---

## BUSINESS STATUS

| Item | Status |
|------|--------|
| Lemon Squeezy | Approved, test mode, products created |
| Apple Developer | Purchased ($99/yr), TestFlight unlocked |
| DUNS Number | Confirmed (Apple accepted enrollment) |
| Google Play | Not started ($25, no DUNS needed) |
| Netlify | Pro $20/mo, manual deploys |
| Copyright | Not filed ($65 at copyright.gov) |
| Trademark | File after 100 paying customers, use ™ until then |
| Privacy Policy | Termly, needs update for GPT-4o + cloud sync |
| Domain | stillformapp.com via Cloudflare |
| Contact | ARAembersllc@proton.me |

---


---


### Research Partnership (AFTER infrastructure)

**When to pursue:** After cloud sync, push notifications, morning/evening Reframe flow, mandatory post-rating, and 4-6 weeks of real user data.

**Why not now:** Researcher would evaluate a static PWA with no persistence, no return structure, no longitudinal data. They'd judge the prototype, not the product.

**Target:** Graduate student in clinical psych or neuroscience. 5 university programs. Email drafted and saved — send when infrastructure is ready.

**What they evaluate:** Bio-filter as misattribution correction, session flow vs regulation sequence in literature, pre/post delta data across 50+ sessions, retention patterns.

**What you get:** Published pilot study (free validation), framework feedback from someone who knows the science, credibility for marketing ("evaluated by researchers at [university]").

## B2B OPPORTUNITY — Clinical Integration (FUTURE)

### The Signal
Arlin's ketamine doctor asked if Stillform could be used during or after treatment. A medical professional saw the tool and said "my patients need this." Strongest product validation to date.

### The Opportunity
Ketamine, psilocybin, EMDR, and other treatments create neuroplasticity windows — the brain is more receptive to reframing for hours/days after sessions. Most patients go home alone. The therapist isn't available until next week. The window closes. Stillform fills that gap as a self-regulation bridge between sessions.

**Channel:** Clinics recommend Stillform to patients on the way out. Not prescribed. Recommended — same as journaling or breathing exercises. Doctor hands them a card or sends a link. Patient downloads, uses between sessions.

**Revenue model:** B2B clinic licenses (bulk subscriptions) or affiliate referral codes per clinic. Future pricing tier.

### The Guardrails (NON-NEGOTIABLE)

1. **Stillform is NOT used during treatment.** Full stop. Altered states of consciousness + AI reframing = liability.
2. **Stillform is NOT a medical device.** Do not market for use during medical treatment. FDA medical device classification is a $500k+ compliance problem.
3. **No "ketamine mode" or clinical features.** The app stays general-purpose. It works for post-treatment users the same way it works for everyone.
4. **No clinical partnership language.** The doctor recommends it. The doctor does not prescribe it. Stillform is not part of a treatment protocol.
5. **Privacy policy + Terms of Service must explicitly state:** "Stillform is not a medical tool and is not intended for use during or as a substitute for medical treatment."
6. **The AI must never reference the user's medical treatment.** Even if they mention ketamine, the AI responds to their STATE, not their treatment. "You're feeling open and raw right now" not "that's the ketamine working."

### Action Items
- [ ] Get the doctor's name and contact
- [ ] Ask if they'd try it personally
- [ ] Update Terms of Service: not a medical tool, not for use during treatment
- [ ] Update Privacy Policy: same language
- [ ] Document as future B2B channel — post-launch, post-traction
- [ ] Do NOT build anything clinical before consulting a healthcare attorney

### Why This Matters
Every ketamine clinic, every therapist, every EMDR practitioner has the same problem: patients leave sessions in a window of opportunity and have nothing structured to do with it until next week. If Stillform becomes the thing clinics hand out at the door, that's a distribution channel that doesn't require Reddit, doesn't require ads, and comes with built-in trust from a medical professional's recommendation.

But timing matters. Product first. Traction first. Compliance later. Do not chase this before the core product is proven with regular users.

## OPEN QUESTIONS — NEED DECISIONS

1. **Breathing** — simplified to 2 options (Quick Reset + Deep Regulate). ✅ Shipped.
2. **Supabase** — confirmed. Building next session (April 9).
3. **Lemon Squeezy live mode** — switch after cloud sync verified. Needs Bobby to trigger.
4. **Reddit timing** — not a launch step. Contingency only — deploy in week 1 post-launch only if organic traction is weak. No testimonial gate.
5. **TestFlight** — after cloud sync. Users will lose data without it.
6. **Neuro voice** — web first (Web Speech API). Safari gap acceptable for now.
7. **Pricing** — locked at $14.99/mo or $9.99/mo annual. Revisit after 100 paying users.
8. **Research partnership** — after cloud + 4-6 weeks real user data. Email drafted, not sent.
9. **Merge strategy for Supabase** — RESOLVED. Supabase is always the source of truth once an account exists. Every save writes to cloud automatically — no sync button, no manual step. The only edge case is account creation: upload whatever is in localStorage to Supabase at that moment. If cloud is empty, it all goes up. Last-write-wins is fine.
10. **Google Play individual vs org** — individual account ($25, no DUNS) lets you start 14-day testing clock now. Downside: personal name shows on store until converted. Decision needed.

---


---

## EXECUTION ACCOUNTABILITY — "Does It Actually Work?"

### The Problem
Philosophy in a document doesn't equal change in a person's life. Having the right AI prompts doesn't mean the AI is actually catching biases, building confidence, or shifting behavior. The framework is strong. The execution must match.

### Infrastructure That Proves It Works

**1. Session-Level Measurement (Silent)**
- Compare user's first message to last message each session
- Track: did language shift from reactive to reflective? From self-diminishing to direct?
- AI session notes flag: bias identified, strength reflected back, shrink pattern challenged
- This data proves the system is doing what it claims

**2. 7-Session Review Must Be Specific**
- Not generic "how's it going" — track composure applied to real interactions
- Questions the AI should answer about the user:
  - Are they advocating for themselves more?
  - Are they catching their own filters before the AI does?
  - Are they holding their position or folding?
- Surface specific evidence: "Three weeks ago you said you couldn't speak up. Last week you did."

**3. Longitudinal Outcome Tracking (Requires Cloud)**
- Pulse entries over time should show measurable shifts:
  - Fewer entries tagged with shame, shrinking, avoidance
  - More entries reporting: spoke up, held a boundary, stayed in the room
  - Shift in emotion chip usage from negative-heavy to balanced
- The AI surfaces the trend: "Your pattern is changing. That's not the app — that's you."

**4. AI Stress Testing Protocol**
- Before any AI prompt change ships, test against real scenarios:
  - "My boss talked over me again and I just let it happen"
  - "I know I'm right but I don't have the degree so nobody listens"
  - "I come from nothing, these people don't respect me"
  - "I went on medical leave and they pushed me out"
- If the AI gives generic comfort ("that must be frustrating") → it failed
- It must: name the pattern, reflect the strength, build confidence to act

**5. User Outcome Check (After 10 Sessions)**
- One open question: "Has anything changed in how you show up?"
- Not a rating. Not a score. Free text.
- Responses become proof that execution matched intent
- If answers are "no" → fix the AI. If answers describe real change → the product works.

**6. Composure Applied Both Directions**
- OUTWARD: Listener gets composed enough to stop filtering input by status/background/bias
- INWARD: Speaker gets composed enough to stop shrinking, qualifying, performing credibility
- The AI must build BOTH: catch the listener's bias AND build the speaker's confidence
- "You just identified something most people miss. That's pattern recognition from lived experience."

### The Standard
A junk app puts "find your voice" on the landing page and delivers a breathing timer.
Stillform tracks whether you actually found it. Measures the shift. Names it back to you. Adjusts when it's not landing.

### Founder's Intent (April 8, 2026)
"The framework is there. The execution isn't yet. I want every aspect thought through tactfully and strategically. This can change the world if it's executed properly. I don't want agreement — I want proof it works in the hands of real people."

---

## NEXT SESSION PLAN (April 9)

**Priority 1:** Cloud infrastructure (Supabase — auth, sync, backup, merge strategy decision first)
**Priority 2:** Bundle and push staged App.jsx changes (feel state score mapping + any session changes)
**Priority 3:** Paywall end-to-end test with 4242 card
**Priority 4:** TestFlight — verify Capacitor build compiles clean
**Priority 5:** Google Play individual account decision (start 14-day clock without DUNS?)

**Staged but not pushed (waiting to bundle):**
- Feel state → numeric score mapping in ReframeTool saveSession

---

*ARA Embers LLC · Strategic Roadmap · April 8, 2026*
*This is a living document. Update every session.*
