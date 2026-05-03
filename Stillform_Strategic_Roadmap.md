# STILLFORM — Strategic Roadmap & Open Questions

---

## Current state

For current scope, status, and open items, see `Stillform_Master_Todo.md`. The strategy this roadmap holds is below; the operational truth lives in master todo.

---

## RETURN-LOOP ARCHITECTURE — Why Everything Must Ship Before Launch

The seven testers (Ava, Bobby, Ari, Michelle, Paula, Ive, Jonny) tested Stillform, said it was cool, and bounced. Plausible confirms Arlin has been the only user for the past month. This is not a bug in user acquisition — it is the diagnostic signal for what is missing.

The seven testers experienced **layer one only**: the regulation tool. The substance is real and the science is right. They had a "this is cool" reaction to the first session. Then nothing pulled them back. Cool is the most damning compliment a product can get — impressive but not necessary.

The launch product is a different product than what the testers used. The launch product has **three layers** that together produce return:

**Layer 1: The Regulation Tool (SHIPPED).** Breathe / Body Scan / Reframe / Self Mode. Bio-filter, Russell circumplex chips, three-category data feed, override pathways. Verified by testers as "cool."

**Layer 2: The Return-Loop Infrastructure (PARTIALLY SHIPPED, MOSTLY PENDING).** What pulls the user back when they are not in the app. Watch integration, HRV measurement, Health Connect / HealthKit, biometric lock, notifications infrastructure. Notifications infrastructure has shipped via Capacitor. Biometric lock has shipped. Watch integration is wired in code but has a known pattern-ID bug and is not yet device-tested (see master todo). HRV and health platform integrations are still pending.

**Layer 3: The Engagement Craft Layer (PARTIALLY SHIPPED MAY 1, MOSTLY PENDING).** Recognition between sessions still pending. Plain-Language Neuroscience Surface SHIPPED May 1 (post-session card with 36-entry verified corpus + 20 static fallbacks + ⓘ transparency modal). Kinesthetic close interaction direction chosen but spec not yet drafted. Cognitive Function Measurement is the moonshot, 6-8 weeks of focused build. All grounded in Engagement Principles section of Science Sheet (Fogg behavior model, Wood & Rünger habit research, Self-Determination Theory, Kahneman System 1/2, Ariely defaults, Eyal variable reward, Gollwitzer implementation intentions, Kleitman ultradian rhythm, Norman affordance perception, Pielot/Mehrotra/Harris attention-respectful design).

Shipping any one layer alone produces the cool-and-bounce pattern at scale. All three together is the actual launch product.

This is why "EVERYTHING needs to be done before launch" is not perfectionism — it is the architecture of return.

---

## DECISION FRAME — What Earns a Place Before Launch

Each pending item evaluated against: does this contribute to the return loop?

Items shipping post-launch (translations, broad TestFlight) do not gate return because the cohorts they serve are not the early-launch cohort.

---

## ENGAGEMENT CRAFT RESEARCH FOUNDATION

The Science Sheet contains a parallel Engagement Principles section grounding Stillform's engagement craft in 10 citation-grounded behavioral science principles. Each principle has a Stillform application paragraph naming which existing or planned feature it grounds.

**Operating rule:** every feature should be grounded in at least one Pillar (neuroscience) AND at least one Principle (behavioral science). Missing one or the other is the gap engagement craft is designed to close.

**Award case framing:** "Stillform's claims are grounded in two parallel research traditions — neuroscience for what the practice does inside the brain, and behavioral science for what the practice does in the user's life." Stronger case than either alone. Most products skip one or the other. Stillform sits in the intersection.

---

## RESEARCH INSIGHTS THAT CHANGE STRATEGY

### Breathing Patterns Don't Matter (But Breathing Does)
The largest RCT (n=400) found no difference between coherent breathing and placebo breathing. Both groups improved. The active ingredient is focused attention on breath, not the ratio. Stillform shouldn't oversell specific patterns. The value is in the practice.

**Status:** Breathing simplified to three patterns — Quick (Cyclic Sighing), Deep (4-4-8-2), and a third option — framed as preference not prescription. Box breathing dropped.

### AI Effects Are Temporary Without Ongoing Use
Meta-analysis: chatbot improvements peak at 8 weeks, disappear at 3 months. Same as therapy — effects fade without continued practice. The morning/evening check-in structure isn't just a feature, it's the mechanism that prevents decay.

**Status:** Daily check-in framed as essential. AI memory implemented via cloud sync (Supabase three-table schema). Check-in flow shipped Apr 27.

### Retention Is THE Battle
30-day retention for mental health apps: 3.3%. 77% of users abandon after one use. Gamification doesn't help and may hurt. What DOES help: reminders, human contact (or simulated), personalization that deepens.

**Status:** 
- Neuro voice — Web Speech API on web shipped, native voice pending
- AI memory — shipped via cloud sync (Supabase)
- Morning/evening check-in — shipped Apr 27
- Three-category data feed (visible practice tracking, not state tracking) — shipped Apr 30
- Push notifications via Capacitor — infrastructure shipped, contextual nudge logic pending

### Emotion Regulation Shows the Strongest Effect
Meta-analysis of 39 RCTs: emotion regulation apps showed g=0.49 (medium effect) — stronger than symptom reduction or well-being apps. Stillform IS an emotion regulation app. It's targeting the mechanism with the most evidence.

**Status:** Mechanism the strongest evidence supports. Marketing positioning per locked framing: composure architecture / self-mastery practiced through metacognition. Regulation language is not the product framing — composure is the visible silhouette, self-mastery is the substance, metacognition is the mechanism.

### Anti-Gamification Is Evidence-Based
The meta-analysis found gamification elements "did not improve, and might weaken, retention." Killing streaks, points, and badges wasn't just philosophical — it was the right call per the research.

**Action:** Never add gamification, even if competitors do. Cite the meta-analysis if challenged.

---

## USER FEEDBACK THEMES

Durable signal from early users and founder testing:

- **Visual thinkers need non-verbal paths.** Verbal input is a broken path for a significant percentage of users. This is the rationale for Body Scan, low-demand mode, and the bio-filter as primary entry.
- **Aging eyes / accessibility need attention.** Text size and contrast remain on the table. Open item tracked in master todo.
- **Privacy is foundational.** "Discharge" was killed as a name early because it implied Reframe wasn't private. The instinct is correct and load-bearing.
- **Founder is the deepest user.** Arlin tests during real medical events (CT scans, mast cell episodes), returns specific signal that gets implemented. Stillform's edge is being built by someone who needs it under load, not theorizing about it.

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
| Lemon Squeezy | LIVE, products live, paywall end-to-end working |
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

**When to pursue:** Infrastructure gates have been met (cloud sync shipped Apr 15, push notifications shipped via Capacitor, check-in flow shipped Apr 27, post-rating verified). Remaining gate is 4-6 weeks of real user data after launch.

**Why not now:** Researcher would evaluate without longitudinal data. They'd judge the prototype, not the product.

**Target:** Graduate student in clinical psych or neuroscience. 5 university programs. Email drafted, ready to send when user data accumulates.

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

### Why This Matters
Every ketamine clinic, every therapist, every EMDR practitioner has the same problem: patients leave sessions in a window of opportunity and have nothing structured to do with it until next week. If Stillform becomes the thing clinics hand out at the door, that's a distribution channel that doesn't require Reddit, doesn't require ads, and comes with built-in trust from a medical professional's recommendation.

But timing matters. Product first. Traction first. Compliance later. Do not chase this before the core product is proven with regular users.

## EXECUTION ACCOUNTABILITY — "Does It Actually Work?"

### The Problem
Philosophy in a document doesn't equal change in a person's life. Having the right AI prompts doesn't mean the AI is actually catching biases, building confidence, or shifting behavior. The framework is strong. The execution must match.

### Infrastructure That Proves It Works

Session-level, longitudinal, and AI stress-test measurement systems are how the framework gets proved. Session-level measurement (silent first-message vs last-message tracking, AI session notes) and longitudinal outcome tracking (three-category data feed across pulse entries over time) shipped Apr 30. The deeper measurement work is specced in COGNITIVE_FUNCTION_MEASUREMENT_SPEC.md. AI stress testing as a formal pre-deploy gate, composure-applied-both-directions verification, and structured user outcome check after 10 sessions are tracked in master todo (architectural and post-launch sections respectively).

### The Standard
A junk app puts "find your voice" on the landing page and delivers a breathing timer.
Stillform tracks whether you actually found it. Measures the shift. Names it back to you. Adjusts when it's not landing.

### Founder's Intent (April 8, 2026)
"The framework is there. The execution isn't yet. I want every aspect thought through tactfully and strategically. This can change the world if it's executed properly. I don't want agreement — I want proof it works in the hands of real people."

---

*ARA Embers LLC · Strategic Roadmap · last updated May 2, 2026*
*Strategy doc — operational status lives in master todo and punch list.*
