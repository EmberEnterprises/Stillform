# STILLFORM — Strategic Roadmap & Open Questions
### Everything from the April 8 Radiology Session
### Not just what was discussed — what needs to happen next

---

## BLOCKERS CLEARED TODAY

- ✅ Lemon Squeezy approved (test mode, products created)
- ✅ Apple Developer Program purchased ($99/yr) — TestFlight unlocked
- ✅ DUNS number confirmed (Apple accepted ARA Embers LLC)
- ✅ Latest build published on Netlify (commit f281548 + Bobby's fix 2587511)
- ✅ Science sheet: 18 peer-reviewed sections
- ✅ Ship checklist: 11 items, saved to memory

---

## CRITICAL PATH — IN ORDER

### 1. Cloud Infrastructure (NEXT SESSION — blocks everything)

**Why it's #1:** Nothing else matters if user data lives in localStorage. One cache clear = total loss. No real accounts = no subscription verification = honor system paywall. No cloud = no cross-device sync = users locked to one browser.

**Build:**
- Supabase free tier (Postgres + Auth + Row-level security)
- Email/password auth → ties to Lemon Squeezy subscription
- All localStorage data mirrors to Supabase on every save
- On login: pull cloud data to device (merge strategy needed for conflicts)
- Lemon Squeezy webhook → Supabase → app checks subscription on load
- Auto-backup before any schema migration

**What this unlocks:**
- Real paywall (server-verified, not localStorage)
- Real accounts (email-based, cross-device)
- Data survives cache clears, device switches, reinstalls
- Foundation for every future feature (Neuro, watch, web-to-native sync)

**Open question:** Merge strategy — if someone uses the app on two devices before cloud sync is set up, what happens when they create an account? Last-write-wins? Merge? Prompt user?

### 2. Paywall End-to-End Test

**Why it's #2:** Can't launch without confirming the money works.

**Test:**
- Start Free Trial → pricing screen → Lemon Squeezy checkout
- 4242 4242 4242 4242 test card
- Confirm redirect back sets subscription
- Confirm trial countdown works (14 days)
- Confirm expired trial forces paywall (no back button)
- Post-cloud: confirm Supabase verifies subscription server-side

### 3. TestFlight (Apple Developer now purchased)

**Build:**
- Open Xcode project (npx cap open ios)
- Configure signing with new Apple Developer account
- Archive → Distribute → App Store Connect
- Add testers to TestFlight
- 10+ testers running real sessions on real devices

**Open question:** Does the current Capacitor build compile clean? Haven't tested since initializing. May need dependency updates.

### 4. Google Play Closed Testing

**Build:**
- Google Play Console ($25 org account)
- Android App Bundle from Android Studio
- 12+ testers, 14-day closed testing clock starts
- Clock must run before public launch

**Open question:** Mac storage. Android Studio needs ~8GB. OneDrive overflow may be needed.

---

## FEATURES READY TO BUILD — PRIORITIZED

### Tier 1: Build Before Launch

**Neuro Voice Companion**
- Wake word "Neuro" while app is open
- Voice commands: "Breathe," "Body scan," "Talk it out," "Check in"
- Speech-to-text for Reframe input (Web Speech API)
- Text-to-speech for AI responses (SpeechSynthesis)
- Full voice conversation mode for "Talk it out"
- Build order: mic button → AI reads back → voice commands → wake word → full guided sessions
- **Why it matters:** Accessibility for visual thinkers, people in crisis who can't type, hands-free use. Dynamic voice companion that knows your state ≠ pre-recorded scripts (Calm). Different product category.

**Breathing Simplification**
- Research shows specific patterns don't matter — attention to breath is the active ingredient
- Consider simplifying: "Slow down" (extended exhale) and "Quick reset" (shorter cycle)
- Or keep all four but stop implying scientific superiority of specific ratios
- **Open question:** Does removing pattern choice reduce user agency? Agency may matter psychologically even if pattern doesn't matter physiologically.

**Fractal Breathing Visual**
- Prototype built and user-tested (effective for grounding during CT scan)
- Integration: Settings toggle "Visual grounding: on/off"
- Background behind breathing ring, synced to breath pace
- Ship when user testing shows demand, not before
- **Integrity rule:** Don't add visuals to look innovative. Add them when someone needs them.

### Tier 2: Build After Launch

**Galaxy Watch Companion**
- Haptic breathing companion on wrist
- User's brother specifically waiting for this
- Requires Android Studio locally on Mac
- IS the lock screen button — tap wrist, breathing starts

**Visual Emotional Input**
- For visual thinkers who can't translate images to words
- Select from visual metaphors instead of typing in Reframe
- Weather patterns, pressure gauges, color gradients, textures
- AI reads visual selection, responds accordingly
- Accessibility feature, not novelty

**Lock Screen Quick Access**
- Native Android: persistent notification with "◎ Breathe" / "✶ Talk it out" buttons
- Native iOS: Lock Screen widget (iOS 16+)
- PWA can't touch lock screen — native only

**Interpersonal Microbiases Layer 2**
- Expand Blind Spot Profiler with 5 interpersonal scenarios
- "Your partner goes quiet after a disagreement. What's your first thought?"
- Maps interpersonal defaults for the AI
- Layer 1 (AI prompts) already shipped

**If-Then Planning Screen**
- After calibration: "When [signal area] activates → open [tool]"
- Makes implementation intentions conscious and explicit
- Research says explicit if-then plans are dramatically stronger than implicit ones

**Proactive AI Check-In**
- AI initiates: "You haven't checked in today — everything ok?"
- Requires push notification infrastructure (native)
- Calendar integration discussed in prior session
- Morning nudge + evening nudge + "I noticed [pattern]" = three touchpoints
- Research: single push notification in first 90 days = 3x retention

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
- "The breathe and ground helped. I loved the reframe." — first testimonial
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

## OPEN QUESTIONS — NEED DECISIONS

1. **Simplify breathing?** Two options ("Slow down" / "Quick reset") vs keep four with honest framing?
2. **Supabase vs Firebase?** Supabase is Postgres + open source. Firebase is Google ecosystem. Both have free tiers.
3. **When to go live on Lemon Squeezy?** Switch from test to live mode — needs Bobby to trigger.
4. **Reddit timing?** Paywall must be live + cloud sync must work + 3-5 real testimonials. When?
5. **TestFlight priority?** Is this before or after cloud sync? Users on TestFlight will lose data without cloud.
6. **Neuro voice — web first or native first?** Web Speech API works in Chrome but not Safari. Native gives wider support.
7. **Pricing reconsideration?** $14.99/mo is high for an unproven app. Consider $9.99/mo flat with no annual discount for launch, raise after traction?
8. **Research partnership?** A grad student could run a pilot study for their thesis — free validation. Worth pursuing?

---

## NEXT SESSION PLAN

**Priority 1:** Cloud infrastructure (Supabase setup, auth, sync, backup)
**Priority 2:** Paywall end-to-end test with 4242 card
**Priority 3:** TestFlight build (if Xcode cooperates)
**Priority 4:** Address open questions above
**Priority 5:** Neuro voice prototype (mic button in Reframe)

---

*ARA Embers LLC · Strategic Roadmap · April 8, 2026*
*This is a living document. Update every session.*
