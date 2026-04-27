# STILLFORM PROJECT TRANSFER
**ARA Embers LLC · April 2026 · Stillform Project**

Paste this document into the Stillform Claude project at session start. Everything here is current. No decisions need to be relitigated.

---

## 0. Vision, Values and Product Philosophy

**This section is non-negotiable. Read it before touching anything.**

### What Stillform Is — and Is Not

Stillform is composure architecture. That is the precise and complete product definition. Never define it by what it is not. Never position it against meditation or therapy. Never frame it around crisis, damage control, or negative scenarios. Composure applies equally when nothing is wrong.

Stillform is not a wellness app. Not a self-improvement program. Not a mental health treatment. It is a precision composure system — structured interventions that interrupt activation and restore functional baseline in real time.

The people who use it are not broken. They feel everything at full intensity and need to stay functional inside it. They want a dashboard, not a hug. An operator, not a patient. They want to be the best version of themselves — clear, functional, and self-aware. This app helps them recognize their patterns and understand who they actually are.

### The Product Philosophy

Regulate yourself. See yourself clearly. See others clearly. Let them in.

That is the sequence. That is the architecture. Every feature maps to one of those four stages.

Composure is a form of class — poise under pressure, accessible to everyone. Not a personality trait. A trainable skill. Anyone who has ever needed to hold it together before they were ready. Anyone who has ever said something they did not mean because their system fired before their thinking caught up.

### The Four Pillars

**Body first, then thought.** The nervous system activates before the mind can intervene. Stillform works with that sequence. It does not fight human biology — it follows it. Breathe settles the nervous system. Body Scan clears somatic tension. Reframe processes the cognitive layer once the system is ready to receive it.

**Precision over gentleness.** The user is not fragile. The tools are fast, structured, and direct. The language is clean. There is no toxic positivity, no affirmations, no encouragement that isn't earned by data. The AI does not tell you what to feel. It reflects what is happening and asks one precise question.

**Science without jargon.** Every feature is grounded in published research. The science is woven into the experience — the user feels it working without being told why. The info buttons explain the mechanism in plain language when curiosity hits. The app is self-documenting. It does not need a tutorial because the science is always one tap away.

**Composure as daily practice.** Not a crisis tool. Not something you open when you're falling apart. A daily structure — morning check-in, in-moment regulation, end of day close — that trains the nervous system the way physical training trains the body. Practiced when calm so it is available under pressure. Stress inoculation applied to everyday life.

### Voice and Tone

Direct. Precise. Confident. No drama. No filler. No toxic positivity.

The app speaks like someone who has done the work and trusts you to do yours. It does not over-explain. It does not reassure unnecessarily. It does not celebrate minor actions. It holds a standard without being cold.

Never use:
- Crisis language (spiraling, alarm, breakdown, rage, meltdown)
- Dramatic framing (overwhelmed, shattered, destroyed)
- Toxic positivity (amazing, you've got this, proud of you)
- Medical language (symptoms, diagnosis, treatment, disorder)
- Vague wellness language (healing, journey, space, energy)

### AI Response Principles

Everyone carries history — light or heavy. The AI assumes it without asking. Every session is fresh. No judgment. No dismissal. Unconditional acceptance. True listening.

Do not say you care. Make the user feel it through response quality. Show do not tell.

The AI never:
- Tells the user what to feel
- Suggests they are wrong about their experience
- Uses love language or performs warmth
- Gives advice unprompted
- Makes assumptions about what the user should do next

The AI always:
- Names what it observes, not what it concludes
- Asks one precise question, not multiple
- Separates what is factually present from what the user's interpretation is adding
- Adjusts its register based on session count — observational early, pattern-based later
- Reads physical state from bio-filter and adjusts framing accordingly

### What Cannot Change

- "Stillform is composure architecture" — this is the product definition, always
- The sequence: body first then thought (or thought first then body — calibration determines, never overridden by opinion)
- Science grounding — every feature must have a published research basis
- No medical claims — never position as treatment for any condition
- No crisis escalation language anywhere in the product
- The user interprets the product however they want — Arlin does not position it against other categories
- Composure applies equally in positive states — excitement, preparation, focus — not only under stress



---

## 1. What Stillform Is

**Stillform is composure architecture.**

Based on proven neuroscience, we built a system that identifies how each person processes their internal state. A short calibration determines whether you are body-first or thought-first — the entry point where regulation actually takes hold. From there, the system routes you precisely. Body-first users settle the nervous system before the thinking can clear. Thought-first users process the cognition before the body releases. Every session trains you to notice, name, and choose your response — replacing automatic reactions with intentional clarity. That is the practice that clears out the noise and stabilizes a state in clarity. That is composure.

**Not meditation. Not therapy. A precision composure system.**

**Calibration identifies a default regulation tendency — not a fixed type.** Tendencies are probabilistic and state-dependent. The bio-filter, feel state chips, and morning check-in modulate routing each session based on current state.

---

## 2. Current Build State — April 27, 2026

**Live at stillformapp.com. UAT mode. Password-protected.**

### Infrastructure
- Hosting: Netlify Pro
- GitHub: EmberEnterprises/Stillform
- Framework: React plus Vite
- AI: GPT-4o via Netlify function (netlify/functions/reframe.js)
- Analytics: Plausible (live)
- PWA: installable iOS and Android
- Capacitor: initialized, iOS and Android platforms added and synced
- Cloud sync: Supabase, AES-256 encrypted, three-table schema (user_data, backups, user_profiles)

### Pricing
- $14.99/mo or $9.99/mo annual ($119.88/yr) — LIVE via Lemon Squeezy
- One price. Everything included. No add-ons.

### Three Core Tools
1. Breathe — paced breathing activates vagus nerve. Two patterns: Quick Reset and Deep Regulate
2. Body Scan — six acupressure points, timed holds, auto-advancing
3. Reframe — AI cognitive reappraisal. Self Mode tab for independent processing (5-step MCT protocol: Notice, Name, Recognize, Perspective, Choose)

### Post-Session Flow
- Feel chips (pre and post session)
- What Shifted — one-line affect labeling after Reframe (Lieberman 2007)
- Next Move — 4 buttons: Send a message / Hold a boundary / Delay your response / Let it go
- Lock-in — personalized statement by Next Move plus regulation type, 20-second pause
- LOCK_IN_STATEMENTS constant in App.jsx — 8 approved statements, regulation-type personalized

### Lock-in Statements (approved — do not change)
- Send message body-first: "The physical state cleared first, which made the response possible."
- Send message thought-first: "The cognitive pattern was identified and separated from the facts before responding."
- Hold boundary body-first: "The body signaled the limit before the mind could articulate it."
- Hold boundary thought-first: "The boundary was defined through clear thinking, not reaction."
- Delay response body-first: "The activation was recognized before it could produce a premature response."
- Delay response thought-first: "The missing information was identified before committing to a position."
- Let it go body-first: "The physical activation dissolved, and with it, the need to respond."
- Let it go thought-first: "A clear assessment determined that no response was the right response."

### Daily Loop
- Morning check-in (energy, physical state, somatic tension — under 30 seconds)
- In-moment regulation (routed by calibration plus bio-filter plus feel state)
- End of day close (after 6 PM — three inputs, AI carries into next morning)

### AI Context Stack (every Reframe call)
- Signal profile, bias profile, feel state, bio-filter, check-in context
- Session count (silent leveling — <5 no patterns, 5-12 gentle, 12+ direct)
- Prior tool context, prior mode context, journal context
- Calendar context (hard override when vague greeting plus upcoming event)
- feelMap: excited/focused = hype | stuck = clarity | anxious/angry/mixed = body pattern | disconnected = PLANNED

### Key Features Built
- Composure Check (formerly GO/NO-GO) — 30-trial cognitive inhibition test
- Bio-filter — physical state check before Reframe
- Signal Log — emotion tracking with granular chips (Excited, Focused, Anxious, Angry, Flat, Mixed, Stuck)
- My Progress — 12-week telemetry, session stats, pattern data
- Cloud sync — Supabase AES-256 encrypted
- Calendar integration — native Android, AI references upcoming events
- Pre-meeting notifications — 30min plus 15min before event, Settings toggle plus time pickers, native only
- Biometric lock — Face ID / fingerprint
- Info buttons on every element — science-backed copy, verified against Stillform_Science_Sheet.md
- Show/hide password — login screen
- Stuck chip — cognitive state, routes to Reframe clarity, no body prompts in AI
- Home link — Stillform logo routes home on all screens except home

### Current Routing Logic (App.jsx line 11968 — hero CTA onClick)
```
offBaseline = bioFilter includes: activated, depleted, pain, sleep, medicated

if (isThoughtFirst) {
  always Reframe — NO bio-filter override (KNOWN GAP — fix before launch)
} else if (isBodyFirst) {
  if (feelState === "stuck") → Reframe clarity mode
  else if (offBaseline) → Body Scan
  else → Breathe
}
```

### autoMode (feel state to AI mode)
- excited or focused = hype
- stuck = clarity
- everything else = calm (clarity triggered per-message by content)

---

## 3. Open Issues — Fix Before Launch (Priority Order)

### CRITICAL: Bio-filter routing gap

**The problem:** Thought-first users who flag physical activation in bio-filter still route straight to Reframe. Bio-filter informs AI context but does NOT affect routing for thought-first users. Only body-first gets rerouted by bio-filter.

**Science:** Ochsner and Gross (2005) — at high arousal, physiological intervention must come first regardless of regulation type.

**Fix needed:** Thought-first plus bio-filter active (activated, pain, depleted, sleep) should route to Breathe first. State-based override only. NOT forcing a type switch. Same principle body-first already has.

**Arlin's position:** Bio-filter is the correct routing override mechanism. Feel chips are NOT routing signals — they inform AI context only. Does not want to force users into the other type's default. Wants the system to read current physical signal and adjust.

### CRITICAL: Disconnected chip — agreed, not built

**Label:** Disconnected — umbrella term for hypoarousal, does not make user feel less than.

**Routing:** All types to Body Scan first. Gentle somatic activation, NOT downregulation, NOT Reframe until user is present.

**AI context needed in reframe.js feelMap:** Below-baseline state. System is in hypoarousal not hyperarousal. Gentle language. No breathing down. No cognitive heavy lifting until grounded.

**Science:** Porges Polyvagal Theory, Ogden et al. 2006 Trauma and the Body, Siegel Window of Tolerance.

### IMPORTANT: Stuck chip routing — unresolved question

**Current:** Stuck always routes to Reframe clarity regardless of type.

**Problem for thought-first:** Stuck to Reframe is their default anyway — chip does nothing different.

**Problem for body-first:** What does Stuck mean for them? Cognitively unclear (Reframe makes sense) vs physically frozen (different). This question was not resolved. Needs a decision.

**Arlin's position:** Does not want to force a type into the other type's pathway unless clearly necessary. State-based signal should drive the decision, not the type label. Bio-filter is the right override mechanism, not the feel chip.

### Onboarding redesign — pending

2 intro pages max then calibration then interactive first-use walkthrough. Replaces current multi-step setup flow.

---

## 4. Launch Sequence

1. Fix bio-filter routing for thought-first users
2. Resolve Stuck routing question for body-first users
3. Add Disconnected chip with routing and reframe.js feelMap entry
4. Onboarding redesign
5. Android Studio build APK upload to Google Play Console start 14-day closed testing (need 12 Gmail addresses — Arlin has 5 of her own)
6. Xcode archive upload to App Store Connect TestFlight
7. Both stores approved then flip to public
8. Reddit post then launch (r/ADHD, r/neurodivergent, r/anxiety, r/cptsd, r/BPD)

**Remaining blockers:** Routing fixes plus Disconnected chip plus Onboarding plus Native app setup. Testimonials optional — Ava confirmed, 1 in hand.

---

## 5. Locked Decisions

- Stillform is composure architecture. Never dilute this.
- Calibration identifies default tendency not fixed identity. Recalibrate anytime in Settings.
- Bio-filter is hardware diagnostics. Physical state as system check.
- Feel chips are AI context signals only. NOT routing signals.
- No AI add-on pricing. One price. Everything included.
- Invisible leveling — AI gets smarter by session count. Never announced to user.
- Completion language: Composure restored / Signal cleared / System calibrated
- Reddit is a one-shot moment. Do not post without paywall live and at least 1 testimonial.
- Netlify deploys are MANUAL. Arlin triggers. Claude never triggers.
- Bobby is name-only on LLC. NOT involved in code. Never attribute code changes to Bobby — causes Arlin real anxiety about security.
- Pricing: $14.99/mo or $9.99/mo annual ($119.88/yr)

---

## 6. Key Files

- src/App.jsx — entire frontend (15,000+ lines)
- netlify/functions/reframe.js — AI serverless function (GPT-4o, 1444 lines)
- scripts/ship-preflight.mjs — 41 must-match security checks (run before every push)
- STILLFORM_PROJECT_TRANSFER.md — this document (single source of truth)
- Stillform_Science_Sheet.md — all science citations and verification
- Stillform_Master_Todo.md — build checklist

---

## 7. Workflow Rules (Non-Negotiable)

1. Run security gate check locally before every push — verify all 41 checks pass
2. Run npm run build before every push — build must be clean
3. Fetch live file fresh before every change — never edit stale local copy
4. Verify every change string exists before replacing
5. Push with current SHA and re-fetch after to verify changes are present
6. The same issue must never require fixing twice
7. Nothing gets pushed without Arlin's explicit go
8. Netlify deploy is MANUAL — Arlin triggers, Claude never does
9. Security gate failures send emails to Arlin — fix before she notices
10. Push back hard when something won't work. Be honest not amiable.
11. Diagnostics must be thorough before any fix — not reactive

---

## 8. People

- **Arlin** — founder, sole product decision-maker, visual thinker, New Jersey Armenian accent affects voice transcription, neurological disability affects cognitive functioning
- **Bobby (Robert Matthew Geismar)** — name only on LLC paper, NOT involved in development, never attribute code changes to him
- **Ava** — first testimonial: "The breathe and ground helped. I loved the reframe"

---

## 9. Science Foundation

Primary framework: Metacognitive Therapy (Wells 2009)

Supporting: vagal nerve activation (Gerritsen & Band 2018), interoceptive awareness (Mehling 2012), cognitive reappraisal (Ochsner & Gross 2005), affect labeling (Lieberman 2007), implementation intentions (Gollwitzer 1999), emotional granularity (Barrett et al. 2001), self-efficacy (Bandura 1977), reflective practice (Schön 1983), Window of Tolerance (Siegel 1999, Porges 2011), stress inoculation (Meichenbaum 1985), visual entrainment (Thayer & Lane 2000), autonomic flexibility (Appelhans & Luecken 2006), regulation tendency vs fixed type (Gross 2015, Ochsner & Gross 2005).

Full citations in Stillform_Science_Sheet.md.

---

*ARA Embers LLC · Stillform Project Transfer · April 27, 2026*
