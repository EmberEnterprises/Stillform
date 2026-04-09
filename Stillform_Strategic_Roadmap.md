# STILLFORM — Strategic Roadmap & Open Questions
### Everything from the April 8 Radiology Session
### Not just what was discussed — what needs to happen next

---

## BLOCKERS STATUS (as of April 8)

- ✅ Lemon Squeezy approved (test mode, products created)
- ✅ Apple Developer Program purchased ($99/yr) — TestFlight unlocked
- ✅ Latest build published on Netlify
- ✅ Science sheet: 18 peer-reviewed sections
- ✅ Ship checklist: 11 items
- ⏳ DUNS — applied April 4, expected ~May 4. Apple approved without it (5-day verification). Google Play org account blocked until DUNS arrives.
- ❌ Cloud infrastructure (Supabase) — next session
- ❌ Paywall end-to-end test — blocked on cloud
- ❌ Google Play closed testing — blocked on DUNS (~May 4)
- ❌ TestFlight — Xcode compile not yet verified

---

## CRITICAL PATH — IN ORDER

### 1. Cloud Infrastructure (NEXT SESSION — April 9)

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

**✅ SHIPPED April 8:**
- Pulse tab removed from Reframe — feel state auto-logs to Signal Log on session start
- Post-session rating gate in Reframe ("Where are you now?" chips, maps to 1–5 numeric scale on save)
- Morning check-in "Set my tone →" now hands off directly to Reframe
- Pulse entries now use ISO date format — AI "today" filter works correctly
- AI fatigue guardrail in reframe.js — standard rises with conversation depth, not falls
- Feel state → numeric score mapping: angry=1, anxious=2, flat=2, mixed=3, excited=4, focused=5
- Pulse renamed consistently everywhere user-facing (Signal Log killed)
- What's New panel updated (DUNS status, naming)

**Still to build:**




### Session Notes Visible to User (BUILD — post-cloud)

**Problem:** AI writes session notes after every Reframe. User never sees them. No proof the system is learning. Your Patterns shows numbers only.

**Fix:** Two note types per session:

**1. Internal note (existing, unchanged):**
- Blunt, honest, for AI context only
- "User still deflecting on dismissal. Third time. Bio-filter was active."
- Never shown to user. Feeds next session.

**2. User-facing insight (NEW):**
- Shown in Your Patterns under "What the AI has noticed"
- Last 3-5 insights visible
- Filtered through strict guardrails

**User-facing insight guardrails (NON-NEGOTIABLE):**
- NEVER label: no "you have anger issues" / "you're anxious-attached"
- NEVER judge: no "you overreact" / "you keep making the same mistake"
- NEVER repeat vulnerabilities as labels: no "your father abandoned you"
- NEVER use clinical language: no "attachment style" / "trauma response"
- NEVER claim pattern from fewer than 3 instances
- ALWAYS frame as growth: "You caught it faster" / "First time you described holding your ground"
- ALWAYS frame patterns as awareness: "This has come up a few times" not "You always do this"
- Tone: coach's observation, not therapist's note, not chart entry

**Generation prompt for user-facing insight:**
"Write ONE sentence the user will read about this session. Frame it as growth, awareness, or strength. Never label, diagnose, judge, or reference specific vulnerabilities. If nothing meaningful happened, return null — do not force an insight."

**Where it surfaces:**
- Your Patterns: new section "What the AI has noticed" below stats
- After session 5+: one insight shown after post-rating before Done
- Insight must feel earned, not generic

### Offline Reframe Fallback (PRIORITY — before launch)

**Problem:** When GPT-4o API fails, Reframe is dead. User typed something vulnerable and gets nothing back. Single point of failure on the most important feature.

**Fix:** API failure triggers a self-guided structured reframe. No internet needed.

**Flow:**
1. User's message is preserved (they don't retype)
2. Screen shifts: "Connection issue. Let's work through this manually."
3. "What's the feeling right now?" → same feel-state chips
4. "What's your brain adding that might not be true?" → text input
5. "What would you tell a friend dealing with this?" → text input
6. "One thing you can do right now." → text input
7. Completion: "You just reframed it yourself. That's the skill."

**Evidence layer:**
- Pull session history from localStorage
- Show: "You've done this X times. Average shift: X points."
- Reference specific past session: "Last Tuesday you came in Angry and left Focused."
- Reinforce: "The AI helps you see patterns faster. The work is yours."

**Why this matters beyond error recovery:**
- Teaches users the reframe skill without AI dependency
- Proves the scaffolding philosophy: the app becomes unnecessary
- AI going down = the moment the user discovers they don't need it
- Saves to session history. AI sees it next time: "You worked through that on your own. That's growth."
- Turns a failure into the most powerful moment in the app

**Technical:** 3 retries with exponential backoff. After 3 failures, offline mode activates. Manual reframe saves as session with flag "self-guided: true" so AI knows later.


### Pulse → Reframe Direct Flow (BUILD BEFORE LAUNCH)

**Problem:** User logs a Pulse entry (Angry — "boss talked over me") and it goes to a list. Dead end. Pulse and Reframe are two separate boxes.

**Fix:** After saving a Pulse entry, prompt: "Want to reframe this?" → Yes opens Reframe with that entry pre-loaded.

**Flow:**
1. User logs Pulse: chips + note
2. Save completes
3. Prompt appears: "Want to talk through this?" → Yes / Done
4. Yes → Reframe opens with entry pre-loaded as first context
5. AI opens with: "You just logged [emotion] — [note]. What happened?"
6. Full Reframe session proceeds with that Pulse entry as anchor

**Why this matters:**
- Connects the two core features into one system
- The Pulse becomes the trigger, Reframe becomes the response
- No more logging emotions into a void
- The AI starts with specific context instead of a blank "What's on your mind?"
- Creates the feedback loop: state detection → interpretation → perspective

**Technical:** Pass Pulse entry as `priorToolContext` in the Reframe API call. "User just logged: [chips] — [note]. Start from here."

**AI prompt addition for flat/stagnation states:**
When user is flat and input is low-energy: "Maybe this isn't stagnation — it's incubation. What's brewing underneath?" Don't push harder on low energy. Reframe the stillness as productive.

### Mandatory Post-Session Rating (PRIORITY — before launch)

After every session (breathing, body scan, Reframe), full-screen "Where are you now?" before Done appears. Same chips as entry. NOT skippable. One tap, 3 seconds. Enables pre/post delta, AI context, testimonial data, tool comparison. Affect labeling research: naming state IS a final regulation act.

### Check-In → Reframe Flow (PRIORITY BUILD)

**Morning Flow:**
1. Check-in opens → energy + hardware (quick taps)
2. "Set my tone →" transitions directly into Reframe MORNING MODE
3. AI has check-in data pre-loaded: "You're running depleted today. What's on your plate?"
4. Brief exchange — priming, forward-looking, 90 seconds
5. AI closes: "You're set. Go."
6. Morning mode AI behavior: sharp, directional, primes for what's ahead, flags blind spots from bio-filter state

**Evening Flow:**
1. EOD check-in → 3 taps (energy vs morning, composure, one word)
2. "Want to clear anything before bed?" → Yes / No
3. No → "Sleep well. See you tomorrow."
4. Yes → Reframe EVENING MODE (closure, not analysis)
5. Evening mode AI behavior:
   - Shorter responses than any other mode
   - "Put it down" language, not "let's work through it"
   - Never opens new threads. Never says "tell me more."
   - If they vent: let them, then close: "You said it. It's out. Now sleep."
   - Actively resists going deep: "That's a tomorrow problem. Tonight the only job is sleep."
   - Goal is calming, winding down, releasing — NOT processing
   - Never sends them to bed thinking harder than when they arrived
6. AI closes: "You're set. Sleep."

**Tomorrow morning AI has yesterday's EOD:**
"Yesterday you closed heavy with worse energy. You still showed up today. What's different this morning?"

**Three time-based Reframe modes:**
- Morning: Prime (forward, sharp, directional)
- Anytime: Full Reframe (existing 3 modes — Talk/Loop/Ready)
- Evening: Close (backward, release, calm, short)

**Technical:** Mode auto-detected from time of day when entering through check-in flow. Manual Reframe access uses existing 3 modes regardless of time.

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

**Confirmation Loop — "Does That Land?"**
After Reframe session, AI offers one summary: "It sounds like the real issue isn't [what they said] — it's [what the AI detected]." User reacts: Yes / Not quite / Off base. Yes = validated insight. Not quite = AI adjusts ("What am I missing?"). Off base = AI logs the miss. Over time builds per-user preference profile — which reframe styles land vs miss. Turns self-assessment into a recognition task. Future: extend to friction detection (stalling, rapid deletions, false starts). Depends on cloud for longitudinal learning. Basic version works with localStorage.

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
- [ ] Ask if they'd try it personally and give a testimonial
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
4. **Reddit timing** — paywall live + cloud sync working + 3-5 real testimonials. Not before.
5. **TestFlight** — after cloud sync. Users will lose data without it.
6. **Neuro voice** — web first (Web Speech API). Safari gap acceptable for now.
7. **Pricing** — locked at $14.99/mo or $9.99/mo annual. Revisit after 100 paying users.
8. **Research partnership** — after cloud + 4-6 weeks real user data. Email drafted, not sent.
9. **Merge strategy for Supabase** — UNRESOLVED. Decide before building: if user has localStorage data on two devices before account creation, what wins on sync? Options: last-write-wins (simple), merge by timestamp (complex), prompt user (best UX).
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
