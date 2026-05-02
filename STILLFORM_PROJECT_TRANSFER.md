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
- Stillform is a metacognition tool. Helping people understand their own processes is the mechanism. Composure is the outcome. Every feature serves one of four pillars: metacognition (mechanism), emotional awareness (input), microbiases (outward gaze), neuroplasticity (glue). See Section 9 for the architecture.



---

## 1. What Stillform Is

**Stillform is composure architecture.**

Based on proven neuroscience, we built a system that identifies how each person processes their internal state. A short calibration determines whether you are body-first or thought-first — the entry point where regulation actually takes hold. From there, the system routes you precisely. Body-first users settle the nervous system before the thinking can clear. Thought-first users process the cognition before the body releases. Every session trains you to notice, name, and choose your response — replacing automatic reactions with intentional clarity. That is the practice that clears out the noise and stabilizes a state in clarity. That is composure.

**Not meditation. Not therapy. A precision composure system.**

**Calibration identifies a default regulation tendency — not a fixed type.** Tendencies are probabilistic and state-dependent. The bio-filter, feel state chips, and morning check-in modulate routing each session based on current state.

---

## 2. Current Build State — April 30, 2026

**Live at stillformapp.com. Lemon Squeezy LIVE — paywall active.** App.jsx currently 15,881 lines after Apr 28 morning research-driven cleanup.

**Three Apr 28 morning commits pushed (a121a48a, ae43f4db, c86ec0ba)** — see Section 3 Open Issues for current deploy state and the active ErrorBoundary bug.

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
- Bio-filter — physical state check before Reframe (with shouldBodyRouteToScan helper for routing)
- Signal Log — emotion tracking with granular chips (Excited, Focused, Anxious, Angry, Flat, Mixed, Stuck, Distant)
- Morning outcome chooser — Sharp/Composed/Recover daily intention drives recommended protocol. Per Gollwitzer (1999) Implementation Intentions + Oettingen Mental Contrasting (MCII).
- AI-error → Self Mode handoff — counter-based (1 fail = offer card, 2+ = auto-switch). New `/health` Netlify endpoint polls every 45s while in Self Mode due to AI failure. Pill prompt when AI recovers. State persists across tool close/reopen via sessionStorage. Self Mode itself = MetacognitionTool, grounded in Wells (2009) MCT.
- TimeKeeper module — single source of truth for date/time across the app. 8 methods (clockDay, clockDayOf, stillformDay, stillformYesterday, stillformDayOf, daysAgoMs, timezone, detectTravel) + 8 lint preflight guards prevent regression.
- My Progress — 12-week telemetry, session stats, pattern data
- Cloud sync — Supabase AES-256 encrypted, batched POSTs (single round trip), pre-update auto-backup
- AI conversation persistence — SecureStore wraps IndexedDB with localStorage fallback, AES-GCM encrypted overflow
- ErrorBoundary → App Diagnostics — crash logs ride existing opt-in metrics-ingest pipeline
- Calendar integration — native Android, AI references upcoming events
- Pre-meeting notifications — 30min plus 15min before event, Settings toggle plus time pickers, native only
- Biometric lock — Face ID / fingerprint
- Info buttons on every element — science-backed copy, verified against Stillform_Science_Sheet.md
- Show/hide password — login screen
- Stuck chip — cognitive state, routes to Reframe clarity, no body prompts in AI
- Distant chip — hypoarousal state, routes to Body Scan via ReframeTool useEffect
- Home link — Stillform logo routes home on all screens except home
- Internationalization scaffolding — captureDeviceLocale fires Plausible event for demand data, Settings → Language section with "Request a language" mailto button. NO i18next install yet — translation work deferred until translator budget exists.

### Current Routing Logic (App.jsx hero CTA onClick)
```
offBaseline = bioFilter includes: activated, depleted, pain, sleep, medicated

if (isThoughtFirst) {
  if (offBaseline) → bio-filter suggestion (Pain → Body Scan, other → Breathe)
  else → Reframe (calm)
} else if (isBodyFirst) {
  if (offBaseline && shouldBodyRouteToScan) → Body Scan suggestion
  else → Breathe (calm pathway)
}
// balanced branch retired Apr 29 — defensive fallback now mirrors thought-first
```

**Apr 29 changes:** Balanced regulation type fully retired. ObserveEntryLite shell removed. Calibration ties and skip button default to thought-first. Existing balanced users force-migrated on app load.

### autoMode (feel state to AI mode)
- excited or focused = hype
- stuck = clarity
- everything else = calm (clarity triggered per-message by content)

---

## 2.5 May 1, 2026 Session Log — Plain-Language Neuroscience Surface ship + voice corrections

### Shipped today (10+ commits)

1. **6e82d689** — Hero CTA reflection sweep replacing breathing border
2. **e643cf80** — COMPOSURE_SELF_MASTERY_LEGIBILITY.md committed as dated artifact
3. **b34e8765** — Tool sub-labels with unified "How you..." framing + Self Mode unfinished-business note
4. **afad053c** — Body Scan voice refinement: Stay/Staying/Stayed
5. **5a773785** — Plain-Language Neuroscience Surface spec v2 with verified corpus, 20 static cards, ⓘ modal copy, 3 protections
6. **c18d7fc3** — Science card server side: 36-entry corpus + routing + validation + science_card branch in reframe.js
7. **2d9007ce** — Science card frontend foundation: ScienceCard component + 20 static fallback cards + ⓘ modal + 4 Plausible events
8. **6cf4b8fe** — Science card wiring into close flow of Breathe, Body Scan, Reframe
9. **821faa09 / 64c2e3b1 / fc4e8158** — Three follow-up fix commits cleaning up build errors (React namespace, literal backslash-n, comment-divider Security Gate trip)

### Stillform discipline / market positioning correction

Arlin pushed back on repeated drift toward repair-coded / trauma-coded / intensity-coded copy across yesterday's consultation rounds and this morning's home copy proposals. The corrected positioning, locked May 1:

- **Composure is a discipline** — not therapy, not wellness, not "enhancement" in the consumer-tech sense
- **Anyone who wants to enhance themselves is the market** — not people in distress
- Safeguards exist for users in distress because Stillform is capable enough that they might try to use it as a clinical substitute. Responsible accommodation of edge cases is NOT the same as positioning the product for those edge cases
- **Composure Architecture** is already the load-bearing definition (present in 5 places in product). Don't generate new framings.
- "Composure is the foundation. You are its architect." (Apr 30 home banner copy by Arlin) is already doing the plainspoken inclusive work

Future Claude reading this: do NOT propose copy with phrases like "for people who carry a lot," "for the intensity carriers," "internal weather affects external function," or other repair-coded framings. The market is enhancement-seekers practicing composure as a discipline. The aesthetic IS the egalitarianism — anyone can be an architect of their own composure.

### Engineering accountability — three broken builds today

Of my 8 substantive code commits today, 3 had real bugs that broke the Vite build:
- React.useState/useEffect/useRef in ScienceCard component when codebase imports hooks as named exports (build would have failed on "React is not defined")
- Literal backslash-n characters in three scienceCardShown state declarations from a Python escape pollution issue (broke JSX parsing)
- Decorative `// =====` comment dividers triggered Security Gate's git conflict marker regex (`=======`)

Another instance of Claude (via Cursor, with the same EmberEnterprises GitHub token) made 3 follow-up commits to fix these. The science card feature is now working on main; latest CI run on fc4e8158 is green.

What I missed and what changes:
- Should have checked existing import pattern in App.jsx BEFORE writing the new component. The pattern was visible in the file.
- Python scripts embedding JS code should never use `\n` threaded through `str.replace()`. Either triple-quoted Python strings or direct file write via create_file.
- Decorative comment dividers must use dashes or other non-conflict-pattern characters.
- After every code commit, file should be re-read from main and visually inspected. "Shipped clean, ready for trigger" is wrong framing when only Security Gate green confirms clean.

### Pending — Protection C corpus verification

Plain-Language Neuroscience Surface is shipped but not corpus-verified. Before any user encounters a card, Arlin reads the 36 corpus entries + 20 static fallback cards in PLAIN_LANGUAGE_SCIENCE_CARD_SPEC.md and flags any entry where the plain-language summary doesn't match what the Science Sheet says about that study. Without this verification, an inaccurate card could land on a real user.

Verification can happen at Arlin's pace — no decisions required, just flagging.

### May 1 evening — Corpus rebuild and primary-source verification

After the Plain-Language Neuroscience Surface shipped, the work shifted to the corpus content itself. Three iterations:

- **v3 corpus** drafted, abandoned for being too long-winded (80-100 words/finding) and overcorrected toward Science Sheet defensive completeness rather than 15-second readability
- **v4 corpus** drafted with locked structure: 22 studies × 2-3 angles each (mechanism / effect size / application) = 50 findings, 40-50 words each, multi-angle architecture so a returning user sees a different angle of the same study across sessions
- **v5 corpus** built by primary-source verification of every study against PubMed/PMC/journal pages

**Locked architectural decisions:**

- Multi-finding-per-study structure: same study, multiple angles spread across the user's return visits
- "Read the study →" link on every finding, with paywall note where applicable; free where possible (PMC, author lab pages); abstract page where paywalled
- "Finding" replaces "card" as user-facing language
- **Ownership principle (load-bearing):** Stillform owns its tools, instruments, and practices. Stillform NEVER claims ownership of the science. Science is the researchers'; implementation is Stillform's. The principle was sharpened twice in the May 1 session — overcorrection is also a form of ownership claim (e.g., "delivers the granularity training" understates what Stillform built; "IS the granularity training" correctly identifies the chip system as the practice that instantiates the published mechanism).

**Locked ⓘ modal copy** (replaces v2 copy in App.jsx on next code update):

```
THE SCIENCE BEHIND THIS

The findings shown here are drawn from the peer-reviewed 
research underlying Stillform's tools.

Drawn from a curated library that grounds Stillform's 
mechanisms. AI-generated when available, static otherwise.

The "Read the study" link goes to the source research. Some 
studies are openly published; others remain behind academic 
paywalls.

Stillform isn't affiliated with any of these journals or 
publishers. The science stands on its own; we cite it 
because it's proven.
```

### May 1 evening — Primary-source verification (v4 → v5)

Saved to `/mnt/user-data/outputs/V5_CORPUS_VERIFICATION_COMPLETE.md` (679 lines, 7,940 words). Each of 22 studies verified against PubMed, PMC, or journal page. Every URL fetched live. Each v4 finding compared against the actual abstract / paper text to catch overstatements.

**8 citation/journal corrections found in the Science Sheet** (these propagated into the v4 corpus and are now corrected in v5):

1. **Au et al. 2015** — Journal: *Journal of Advanced Nursing* → **Acupuncture in Medicine** (33(5):353-9)
2. **Critchley & Garfinkel 2017** — Journal: *Current Opinion in Behavioral Sciences* → **Current Opinion in Psychology** (17:7-14)
3. **"Goldstein et al. 2007"** for sleep amygdala → **Yoo et al. 2007** in Current Biology (Goldstein is on the 2014 Walker review, not the 2007 primary paper)
4. **Doll et al. 2015 SCAN** for breathing-DMN claim → **Doll et al. 2016 NeuroImage** (the 2015 paper is about resting-state mindfulness; the 2016 paper is the breath-attention paper)
5. **Lehrer & Gevirtz 2014** — Journal: *Frontiers in Public Health* → **Frontiers in Psychology** (5:756)
6. **Eccleston & Crombez 1999** — Journal: *Pain* → **Psychological Bulletin** (125(3):356-66)
7. **Mehling et al. 2012** — Treated as if it established interoception-emotion correlations directly. Actually the instrument paper (introduces MAIA scale); subsequent studies using MAIA established the correlations
8. **Ma et al. 2017 cortisol** — Science Sheet says "reduces cortisol levels"; actual finding was significant time effect on cortisol, but NO significant group×time interaction. Strongest findings were on negative affect and sustained attention. Cortisol claim should be softened or framed precisely.

**6 content overstatements fixed in v5 corpus** (places I, the v4-corpus-author Claude, added precision the source didn't support):

- Ma 2017 cortisol claim ("measurably reduced" overstated the actual time-effect-only finding)
- Mehling 2012 framing (instrument paper, not correlation paper)
- Ochsner & Gross 2005 "most well-researched" (editorial superlative, not in source)
- Buhle 2014 generic claim ("reduces negative emotion across designs/methods/populations") replaced with the actual specific finding (cognitive control + lateral temporal cortex + bilateral amygdala modulation, NOT vmPFC)
- Yoo 2007 stimulus description ("perceived neutral faces as threatening" replaced with "60% greater amygdala activation in response to increasingly aversive stimuli")
- Genzer 2025 application ("stops being adaptive when depleted" was Stillform extrapolation, not finding from paper)

**10 studies whose v4 entries were largely accurate** with only minor refinement:
Balban 2023, Lieberman 2007, Torre & Lieberman 2018, Barrett 2001, Kashdan 2015, Hoemann 2021, Meichenbaum 1985, Gollwitzer 1999, Siegel 1999, Wells 2009 / Normann & Morina 2018.

**Honest meta-finding:** The corrections are mostly at the documentation layer — citation errors that propagated from Science Sheet to corpus, plus places where summaries got progressively simpler at each layer. The tools themselves are grounded in real, well-supported research. Nothing in this verification suggests the product was built on misunderstood science. What it does suggest: documentation discipline at every layer matters, and a reviewer who only checks "did this match the Science Sheet" will not catch errors that originated in the Science Sheet.

### Pending — actions out of v5 verification

1. Update Science Sheet to fix the 8 citation/journal errors and soften the Ma 2017 cortisol framing
2. Replace v4 corpus in `netlify/functions/reframe.js` with v5 (50 findings across 22 studies, multi-angle keys, `paywalled` flag per entry, `source_url` field, "Read the study →" link rendering, multi-finding-per-study routing logic)
3. Replace `STATIC_SCIENCE_CARDS` in `src/App.jsx` with 20 selected v5 findings
4. Replace ⓘ modal copy in App.jsx with the locked v4 modal text above
5. Manual deploy via Netlify (Arlin triggers)

### IP / copyright risk assessment (May 1 evening)

Question raised after v5 verification surfaced the cyclic sighing implementation. Risk surfaces and reads:

- **Cyclic sighing protocol (Balban 2023).** Breathing techniques themselves are not patentable or copyrightable — they are biological practices. The Cell Reports Medicine paper is published CC BY-NC-ND 4.0 (paper text restricted from commercial use; underlying technique is not). No Stanford patent on the protocol exists (the Stanford team and Huberman have publicly promoted the technique through free media). Stillform attributes the source on every science card surfacing the work. **No IP issue.**

- **MAIA scale (Mehling 2012).** The 32-item instrument itself is copyrighted; researchers wanting to administer it follow permission protocols. **Stillform does not administer the MAIA in-product** — we reference interoception research as inspiration for Body Scan but do not deploy the questionnaire. If at any future point we wanted to administer the MAIA in-app, that would need permissions/licensing.

- **Window of Tolerance (Siegel 1999), MCT (Wells 2009), cognitive reappraisal, affect labeling, granularity, implementation intentions.** All scientific concepts and frameworks. Not protected as IP.

- **Acupressure points and protocol.** Traditional Chinese medicine origin, thousands of years old. No IP.

- **Science card prose.** All Stillform corpus entries are original, paraphrased findings in Stillform's own voice with citations. Editorial fair use of academic findings, equivalent to science journalism. No reproduction of paper abstracts, figures, or copyrighted text.

- **Trademark "Stillform"** — separate question; Arlin's locked plan is to file after 100 paying customers; ™ used until then.

**Where real legal review is the right move (not Claude):**
- Before commercial scaling beyond launch
- Before launching B2B / clinical channels
- For trademark filing
- If any future product surface incorporates a proprietary instrument, validated clinical scale, or branded therapeutic protocol

**The clear-eyed read:** No copyright or patent issue I can see for the launch as currently specified. "No issue I can see" is not the same as "legal clearance." Real legal review for the surfaces above before scaling significantly.

## 3. Open Issues — Tracked Status

This section is a status snapshot, not an exhaustive list of prelaunch work. The full prelaunch scope lives in `Stillform_Master_Todo.md`. Items here are issues that have been triaged with diagnostic notes attached.

### ✅ RESOLVED: Post-Reframe ErrorBoundary on Finish session (Apr 29)
**Was the highest launch-blocker.** Verified fixed on live phone via Chrome remote debug.

**Root cause:** `TOOL_DEBRIEF_COPY` constant was referenced at line 2092 (in `getToolDebriefPromptSet`, called by `ToolDebriefGate` during render on session finish) but the constant didn't exist. The debrief data had been written but accidentally nested *inside* `TOOL_ENTRY_PRIMER_COPY` instead of declared as its own top-level constant. When the user finished a Reframe session, `ToolDebriefGate` mounted, called the helper, the helper threw `ReferenceError: TOOL_DEBRIEF_COPY is not defined`, the ErrorBoundary caught it.

**Fix (commit `1ca445ce`, Apr 29):** Extracted the debrief data into its own `TOOL_DEBRIEF_COPY` top-level constant. Cleaned up `TOOL_ENTRY_PRIMER_COPY` to contain only entry primers (its actual purpose). Added missing `breathe` debrief copy in Framing A pattern (Pillar 1 metacognition close — name the strategy used).

**Diagnostic method that worked:** Chrome remote debug via `chrome://inspect/#devices` once `adb` was available on the Mac (`/Users/kaneg/Library/Android/sdk/platform-tools/adb`). Phone showed up as `SM-S937U R3CY50BE7KV` once Android Studio was installed. Exact error visible in Console panel: `ReferenceError: TOOL_DEBRIEF_COPY is not defined at index-eac377bb.js:1134`. This took roughly two minutes once dev tools were connected; static analysis alone had been stuck for a while.

**Lesson for future bugs:** The phone debug capability is now established. For any future ErrorBoundary or runtime crash, the first move is connect the phone via USB, open `chrome://inspect/#devices`, click inspect on the Stillform tab, reproduce on phone, read the Console panel. This is faster than static analysis for runtime errors.

### ✅ RESOLVED Apr 30: Major build session — 12 code commits, 5 doc commits

The largest single-day build session since launch standard locked Apr 29. Work shipped reflects the prelaunch standard: master todo complete except translations and Apple Store.

**Code commits shipped Apr 30 (in order):**
1. `5ad058eb` Prestige refresh 1 — CSS root calibration (palette deepened, accent antiqued #C8922A→#B8862B, hairline borders 0.06, full spacing scale 2-80px, motion tokens 180/300/480/650ms with prestige/page-turn/shutter easing)
2. `8c10f851` Prestige refresh 2 — theme-aware outlines via color-mix; 6 amber-fill buttons converted to outline-with-accent-text
3. `a16865a9` Prestige refresh 3 — THEME_PRESETS calibrated to match new :root; 3 more buttons; ErrorBoundary updated
4. `a13cbae3` Prestige refresh 4 — cards-on-ground convention (--surface flattened to match --bg across 7 themes); Talk it out hero CTA serif headline centered, arrow removed
5. `721a3220` Prestige refresh 5 — Mac rendering fix (-webkit-font-smoothing: antialiased + grayscale, removed grain texture, strengthened radial gradient)
6. `41f184d5` Home page banner: "Composure is a practice. You're building it." → "Composure is the foundation. You are its architect." Reasoning: composure is OUTCOME (per Science Sheet line 11), metacognition is MECHANISM. Tool = composure architecture.
7. `768b56ed` + `ad4a43f1` Settled chip — 9th feel chip closes Russell circumplex low-arousal-positive coverage gap. Russell-grouped chip ordering. AI feelMap entry added (no regulate-down posture, surface patterns more freely, no Self Mode nudge, no protective suppression).
8. `890469aa` Body Scan What Shifted + three-category data feed — Russell circumplex classifier (Russell 1980 J.Pers.Soc.Psychol. 39:1161-1178). Categories: Regulated (A) / Persistent (B) / Concerning (C). Schema versioned at v1, never recompute. Storage key `stillform_shift_events`. Plausible "Shift Classified" aggregate event (4 props, no PII). Body Scan post-completion What Shifted screen wired (post-state chip + optional free-text label + skip path).
9. `d10bad23` Removed dead `title: "Talk it out"` and `subtitle` fields from Reframe modeConfig (verified mc.title and mc.subtitle never referenced).
10. `d207ef16` Chip ⓘ button system — CHIP_DEFINITIONS registry as top-level constant (line 1555). 9 user-facing definitions covering all chips. ⓘ buttons wired at all 3 chip render sites. Reuses existing setInfoModal pattern. ARIA labels added.
11. `818f8444` Cyclic Sighing breathing pattern — third option alongside Quick Reset and Deep Regulate. Per Balban et al. 2023 (Cell Reports Medicine 4:100895, Stanford RCT n=111). Protocol: Inhale 1 (deep nasal) 4s + Inhale 2 (top-off nasal) 1s + Exhale (slow oral) 8s. 1:2 ratio. Default behavior preserved (Quick Reset stays default; opt-in via Settings). Strengthens Dr. Yilmaz Balban outreach credibility (top scientific outreach candidate per memory).
12. `81e2c0b7` **Low-demand mode Phase 1 (Breathe)** — state-of-existing-tool architecture (NOT separate tool). Triggered by `bioFilter.includes("medicated")`. Audio force-enabled. Pre-rate, bio-filter screen, three-rounds-done decision, post-rate, debrief gate, Next Move all bypassed. Pulse circle + "Tap anywhere to close" + 1.5s grace period. Session auto-saves with source='low-demand-complete'.

**Documentation commits shipped Apr 30:**
- Master Todo: 4 items marked ✅ RESOLVED (Composure copy fix, Reframe title, Chip ⓘ button, Cyclic sighing); Body Scan What Shifted, Three-category data feed, Settled chip marked ✅ RESOLVED in subsequent update; Low-demand mode entry updated to reflect Phase 1 shipped + Phase 2 paused
- 5 specs committed to repo root: BODY_SCAN_WHAT_SHIFTED_SPEC.md, SETTLED_CHIP_SPEC.md, THREE_CATEGORY_DATA_FEED_SPEC.md, STILLFORM_DESIGN_SYSTEM.md, MY_PROGRESS_REDESIGN_SPEC.md
- CHIP_DEFINITIONS_DRAFT.md committed (Arlin approved before code wiring)

**Conceptual decisions made Apr 30 (NOT YET SHIPPED — captured for context):**

*Composure / self-mastery legibility decision (locked Apr 30 evening).* Four-AI consultation (ChatGPT, Gemini, Claude in fresh session, Copilot) returned convergent signal: 3-of-4 said "composure is one altitude too low" and proposed alternative umbrellas (sovereignty, self-continuity, cognitive access, identity/pedagogy). Arlin's response: "those all fall under self-mastery, which is what contributes to composure." She had collapsed self-mastery and composure into one term deliberately. The four AIs were each naming a facet of self-mastery without seeing the whole. Final decision: composure stays as the umbrella; self-mastery is the through-line that carries it. Composure is the visible silhouette; self-mastery is the practice. Internal vocabulary uses both; public surface stays composure-led.

*The integrity gap (named by Arlin Apr 30).* Words don't mean anything without action behind them. The reason the four AIs sensed something missing wasn't brand altitude — it's that the user-facing experience doesn't yet fully *be* what the brand says. The user is positioned as operator of a regulation toolkit more than practitioner of self-mastery. Five specific gaps identified in COMPOSURE_SELF_MASTERY_LEGIBILITY.md (sitting in /mnt/user-data/outputs/, not yet committed because Arlin hasn't decided whether to commit pending action work):
1. AI posture in reframe.js currently optimizes for regulation, not for demonstrating self-mastery to the user — highest-leverage fix
2. Self Mode is the explicit self-mastery practice but is named generically ("Self Mode")
3. Closing language ("Composure restored," "Signal cleared") frames as outcome, not rehearsal
4. My Progress framing tracks regulation, not pattern of staying-yourself
5. Bio-filter requires user to perform diagnostic at moment of low executive function

These gaps are real prelaunch work. None are "must close before publish" — but the integrity principle (claim must match action) means they accumulate as debt against the brand promise.

*Phase 2 + 3 of low-demand mode — paused.* Phase 2 (Body Scan low-demand) hit an architectural decision Arlin needs to make: when a medicated user opens Body Scan directly (not routed there from bio-filter), what should happen? Four options surfaced via ask_user_input_v0 widget. User dismissed without selecting. Awaiting decision when she returns. Phase 3 (Reframe low-demand) not started — most complex of three because AI behavior changes (shorter sentences, simpler language, no questions demanding reasoning), not just UI stripping. Spec needed before build.

*Four-round consultation arc (Apr 30 evening).* Arlin felt 'good bones, not reaching for the stars' and asked for outside AI feedback. Four rounds run; track exhausted by Round 4. In chronological order:

- Round 1 (STILLFORM_CONSULTATION_PROMPT.md): What's missing at brand altitude? Three of four AIs converged on 'rename the umbrella concept' (sovereignty / cognitive access / self-continuity / identity). Arlin correctly identified this as wrong: she'd already collapsed self-mastery and composure into one term deliberately.
- Round 2 (STILLFORM_COMPREHENSIVE_CONSULTATION.md): Where does experience break the claim? Three convergent gaps: closing language frames as outcome not rehearsal; tool selection at low EF is unowned load; data view reads as state-tracking not practice-tracking. Useful surface punch list. Arlin: 'this is kind of disappointing... not legit major shifts.'
- Round 3 (STILLFORM_ARCHITECTURAL_CONSULTATION.md): What does the SHAPE look like? Three AIs proposed major architectural shifts (Death of the Tool / Constant Thread / Zero-setup onboarding). All proposed removing things Arlin had already built. GPT pushed back hard. Arlin: the AIs were describing the architecture she already built and calling it new.
- Round 4 (STILLFORM_ROUND_4_CONSULTATION.md): Drafted but not sent. Arlin's read: consultation track was producing diminishing returns; the spark wouldn't come from another round.

*The actual diagnosis (named by Arlin, not AIs).* After Round 3 disappointment: 'I got a bunch of science based prompts that are flat and not interested in engaging for the user. It feels more like a chore than something I actually want to do.' Aria asked her to win an award. The product has truth, rigor, and integrity. What's missing is engagement craft — the layer that makes a serious tool feel alive without becoming gamified.

*The reframe to engagement mechanics from non-wellness products.* Nine candidates examined: Duolingo's League, Strava's Local Legend, Beli's relative ranking, Letterboxd's diary, Wikipedia's Random Article, NYT Games scarcity, Headspace voice persona (rejected as wrong for Stillform), Notion's empty page, Strava's Year-End recap. Arlin selected two for further pursuit:
1. Plain-language neuroscience as recurring surface (Wikipedia Random Article principle with Stillform's science as corpus)
2. Cognitive function measurement as evidence of neuroplasticity — chosen as the moonshot

*Cognitive Function Measurement spec drafted (COGNITIVE_FUNCTION_MEASUREMENT_SPEC.md).* Five candidate functions evaluated: affect labeling speed (Lieberman 2007), interoceptive latency (Mehling 2012), cognitive defusion / reframe generation (ACT), bias recognition speed (CBT/MCT), HRV biofeedback coherence (Lehrer 2020). Recommended Phase 1: candidates 1-3. Differentiation: every wellness app measures sessions/minutes/streaks; nobody measures the cognitive functions the practice trains. Stillform would be first. 6-8 weeks focused build. Lumosity-overclaim risk explicitly designed against.

*Closing language candidates also drafted (CLOSING_LANGUAGE_CANDIDATES.md).* Round 2 surface fix worth shipping in parallel. All seven closing screens covered with three voice options each (minimal / rehearsal-frame / quieter). Awaiting Arlin's direction before code wiring.

*Body-first pre-rate friction RETRACTED.* Initially drafted as BODY_FIRST_PRE_RATE_FIX_SPEC.md after GPT Round 3 catch. Arlin caught Claude not checking master todo first. Master todo line 321: "Body-first metacognition access gap — VERIFIED ALREADY IMPLEMENTED Apr 27" with explicit note "Going forward: read the existing flow before claiming a gap." Master todo line 361: pre-rate science gap RESOLVED via commit ae43f4db (chip rows removed per Nook 2021 + replications). The 1-5 numeric pre-rate that remains is the minimal residual measurement driving shift delta tracking and three-category data feed. Not a science violation. Spec retracted with full retraction notice; preserved as artifact-of-the-lesson rather than deleted.

*Closing language reconsideration RESOLVED Apr 30 evening (NOT shipping).* Round 2 consultation found 4 AIs converged on "current language frames as outcome not rehearsal." CLOSING_LANGUAGE_CANDIDATES.md drafted with 3 voice options across 7 close screens. Arlin's pushback: "the current language has a science behind it too. The language feels more prestige and less putting words into someone's mouth." Closing language stays as-is. The reasoning was captured durably in the Science Sheet as new section "System Observation + User Override (Architectural Conditioning Pattern)" — current language ("Composure restored," "Signal cleared," "STATE SHIFT +2 · FUNCTIONAL") is precise observation paired with explicit override pathways ("I don't feel regulated yet" button). Together they train interoceptive accuracy via supervised-learning-like pattern: system makes prediction, user accepts or corrects, both directions improve over time. Round 2 AIs read words in isolation without seeing override architecture. Future maintenance: do NOT remove override pathways or soften closing language — pattern would break if "cleaned up" later. Grounded in Barrett 2001 granularity, Mehling 2012 + Garfinkel 2015 interoceptive accuracy, Lieberman 2007.

*The deeper engagement craft reframe (Apr 30 late evening).* Arlin pushed past the "engagement craft" frame to a sharper one: "data/research that helps with user engagement outside of neuroscience" and "human behavior in app data proven research." This reframed engagement craft as a parallel research domain to neuroscience — not decoration, not afterthought, but its own citable empirical tradition. Result: NEW Science Sheet section "Engagement Principles (Behavioral Science Foundation)" with 10 citation-grounded principles: Fogg's Behavior Model (B=MAT), Wood & Rünger 2016 (context-cue habit formation), Deci & Ryan SDT (autonomy/competence/relatedness), Kahneman System 1/2, Thaler-Sunstein-Ariely (defaults shape behavior), Eyal Hooked + Skinner (variable reward done ethically), Gollwitzer + Sheeran-Webb (implementation intention specificity), Kleitman-Rossi (ultradian rhythm), Norman + Tognazzini-Cooper-Krug (affordance perception), Pielot-Mehrotra-Harris (attention-respectful design). Each principle has a "Stillform application" paragraph naming which existing or planned feature it grounds.

Operating rule established: every feature in Stillform should be grounded in at least one Pillar (neuroscience) AND at least one Principle (behavioral science). Missing one or the other is the gap engagement craft is designed to close. This is the architecture under which future engagement choices (kinesthetic close, plain-language science surface, etc.) get evaluated and defended.

*The award case strengthened.* Pitch becomes: "Stillform's claims are grounded in two parallel research traditions — neuroscience for what the practice does inside the brain, and behavioral science for what the practice does in the user's life." Stronger case than either alone. Most products skip one or the other. Stillform sits in the intersection.

*Kinesthetic close direction chosen for next session.* After Arlin flagged the close as feeling redundant ("five text-and-button screens in a row"), explored three readings of "more interactive": (1) more responsive to what the user did, (2) more dialogical, (3) more tactile/kinesthetic. Arlin chose Reading 3 — kinesthetic interaction grounded in engagement craft research not neuroscience. Single tap on slow-pulsing point recommended as the prestige-aligned, lowest-cognitive-demand option. Long-press-to-seal as alternative. Both replace the current 5-screen close cascade with one tactile moment. The 20-second forced wait on ToolDebriefGate ("20-second capture required before exit") flagged as the most defensible piece to question first — clinical "required" framing should go regardless of larger redesign. Spec to draft next session, grounded in Engagement Principles 4 (Kahneman System 1/2) and 9 (Norman affordance perception).

---

### 🟡 GitHub Actions Security Gate failing on recent commits
Commits c86ec0ba and f807bced both show as failed in GitHub Actions, BUT investigation revealed jobs were **CANCELLED — no runner ever assigned**. Not a code-level gate failure. Likely cause: GitHub Actions billing exhausted for the org account (free tier 2000 min/mo), OR transient infrastructure issue. **Action to take:** check Settings → Billing → Actions on GitHub.com (org settings); if at limit, that explains it. Re-running the cancelled jobs should succeed once resource constraint clears. **Does not block Netlify deploy** — Netlify pulls from main HEAD independently of GitHub Actions status.

### 🟢 Apr 28 Morning Commits — Status
Three commits pushed today:
- `a121a48a` — Science Sheet update with Nook 2021 + 2024-2025 replications cited; mechanism description updated from "intensification" to "crystallization"
- `ae43f4db` — Pre-regulation `<PresentStateChips>` removed from BreatheGroundTool (line 3228) and BodyScanTool (line 3880) per Nook, Satpute & Ochsner 2021 + replications. Kept in ReframeTool entry (line 6568) — defensible because Reframe IS cognitive intervention
- `c86ec0ba` — Post-Reframe screen cleanup (-79 net lines): removed two unreachable dead-code screens (showStateToStatement, showPostInsight), three orphan helper functions, stripped message-drafting overlay from What Shifted block, added new Send-a-message expansion under Next Move per Gollwitzer 1999 implementation intention specificity research. **This commit is the source of the ErrorBoundary bug — see above.**

### 🟡 Post-Reframe Optionality Gating Decisions — Pending
Five gating decisions identified during Apr 28 morning research-driven cleanup. Placement fixes shipped today; gating decisions deferred to a fresh session post-launch:
1. Lock-in card confirmation gates Finish button (Schön reflection-on-action / Lavi-Rotenberg 2020 MERIT findings)
2. Post-rating chip selection required (Lieberman 2007 — post-regulation timing supported)
3. What Shifted textarea — required vs optional vs remove (Vine 2019 / Nook 2021 free-text labels stronger than predetermined)
4. Bio-filter required for body-first users (Eccleston & Crombez 1999 — pain users skipping bio-filter route to wrong tool)
5. Calibration "Skip this step" → "Use defaults" fallback (JAMA Psychiatry 2025 attrition risk)

### 🟡 Science Sheet Audit Findings (Apr 28 afternoon) — Pending Fix
Full audit in `/mnt/user-data/outputs/SCIENCE_AUDIT_APR28.md`. Three must-fix items:

1. **60 BPM Visual Entrainment section** — citations don't support the claim. Trost 2017 cited as PLOS ONE but is actually in Neuropsychologia and is about MUSICAL not visual entrainment. Kalda & Kello 2012 cannot be located in any database (likely fabricated or seriously misnamed). Recommendation: remove section OR reframe as ambient design not entrainment.

2. **Lieberman et al. (2025) Nature Communications miscitation** — actual authors are Genzer, Rubin, Sened, Rafaeli, Ochsner, Cohen et al. (2025). Kevin Ochsner is on it; Matthew Lieberman is NOT. The "20-30%" specific magnitude needs verification in the paper. AND the framing in the science sheet is opposite to the paper's finding — paper concludes the bias may be ADAPTIVE for empathy and relationship satisfaction.

3. **Acupressure mechanism claim** — "specific points correspond to tension release pathways" leans on TCM meridian theory which has weaker support. The effect is real (Chen 2022 meta-analysis SMD=1.152). Recommendation: keep effect claim, swap mechanism to interoceptive attention.

**Plus 1 should-strengthen:** Paced breathing "60-90 seconds" cortisol claim — soften to "within minutes" for HR/BP, "sustained practice reduces cortisol response" for cortisol.

**Plus 1 opportunity:** Add Balban et al. 2023 cyclic sighing (n=111 RCT, Cell Reports Medicine) — outperformed mindfulness AND box breathing. Direct relevance: Melis Yilmaz Balban is already top scientific outreach candidate. Adding cyclic sigh as a breathing option AND citing the paper strengthens both science sheet AND outreach pitch.

### 🟡 "Calm my body" hero CTA doesn't act on tap — Open
Body-first user, Composure Check / Settings show normally, but tapping "Calm my body" on home does nothing. Static analysis showed no obvious break. Diagnostic console.log shipped commit `089acffa98` — next time Arlin taps, browser DevTools console (or Chrome remote debug) will reveal which branch the click takes. Suspect: stale `stillform_biofilter_choice` localStorage entry routing into silent skip path, or React state batching issue specific to mobile WebView.

### 🟢 Onboarding redesign — Status
2 intro pages max, calibration, interactive first-use walkthrough. Status uncertain — earlier transfer doc listed this as "only remaining engineering item" but unclear if shipped or deferred. Verify state on session pickup.

### 🟢 Trees graphic theme mismatch — Easy fix, can ship anytime
Trees at bottom of breathing screen render in fixed orange/amber regardless of theme. On teal theme this creates dissonance. Fix: change trees to `var(--text-muted)` or desaturated neutral. Glow stays warm amber as the one accent note. Inside `BreatheGroundTool`.

### Resolved April 27, 2026 — kept for reference

The following were CRITICAL/pending in earlier versions of this doc and are now shipped:

- **Bio-filter routing gap** — RESOLVED via `shouldBodyRouteToScan(bioFilter)` helper. Pain/Off-baseline/Something route to Body Scan; Activated/Sleep/Depleted/Medicated route to Breathe. Per Ochsner & Gross (2005). Commit `d74fe6bc`.

- **Disconnected/Distant chip** — RESOLVED. Chip added to both chip arrays at App.jsx:6202 and 7176. New ReframeTool useEffect routes feelState=="distant" → Body Scan via onComplete("scan"). feelMap entry added to reframe.js:1190 with science-grounded prompt. Per Porges (2011) polyvagal + Siegel (1999) window of tolerance. Commit `aaa64d89`.

- **Stuck chip routing question** — CLOSED by implementation. Dead branch at hero CTA (line 12418) was removed. Per design: chips inform AI context, bio-filter is routing override mechanism. Stuck stays as Reframe-clarity routing for all types. Commit `86b89844`.

- **Apr 27 evening bug fixes** — FocusCheckValidation restored (b98d347f), 4 bugs fixed including getFocusCheckHistoryFromStorage helper and ErrorBoundary CSS vars (3bf9dfa0), PanicMode + FractalBreathCanvas restored with undefined-component preflight guard (089acffa).

---

## 4. Launch Sequence

**Arlin's launch standard (locked Apr 29):**

> The app is launch-ready when the master todo is complete, with two explicit exceptions: translations and Apple Store. Everything else on the master todo is prelaunch. This standard does not move. Stop renegotiating it.

**What this means in practice:**

- The master todo (`Stillform_Master_Todo.md`) is the source of truth for prelaunch scope.
- Translations beyond English are explicitly deferred to post-launch (Spanish, Brazilian Portuguese, Armenian, then later German, French, Mandarin, Japanese, Korean, Hindi, Arabic). Locked Apr 27.
- Apple Store / TestFlight is explicitly deferred — currently blocked on iPhone access, picks up after Google Play track is established.
- Every other item on the master todo is in scope before launch.

**The post-Reframe ErrorBoundary bug** — RESOLVED Apr 29 (see Section 3). Verified on live phone via Chrome remote debug. Root cause was orphaned `TOOL_DEBRIEF_COPY` reference; fixed in commit `1ca445ce`.

**No testimonials are required for launch.** The previous version of this doc listed "3-5 real testimonials" as a launch prerequisite. That was wrong and has been retired. Arlin is not running a testimonial campaign before launch. Any organic testimonials that appear are bonus, not gating.

**Reddit is not a launch step.** Held in reserve as a contingency lever only if organic post-launch traction is weak.

---

## 5. Locked Decisions

- Stillform is composure architecture. Never dilute this.
- Calibration identifies default tendency not fixed identity. Recalibrate anytime in Settings.
- Bio-filter is hardware diagnostics. Physical state as system check.
- Feel chips are AI context signals only. NOT routing signals.
- No AI add-on pricing. One price. Everything included.
- Invisible leveling — AI gets smarter by session count. Never announced to user.
- Completion language: Composure restored / Signal cleared / System calibrated
- Launch standard: master todo complete, except translations and Apple Store. No other launch gates exist. Testimonials are not a prerequisite. Reddit is not a launch step.
- Netlify deploys are MANUAL. Arlin triggers AND publishes (TWO STEP — trigger ≠ publish, confirmed Apr 27). Claude never triggers.
- Bobby is name-only on LLC. NOT involved in code. Never attribute code changes to Bobby — causes Arlin real anxiety about security.
- Pricing: $14.99/mo or $9.99/mo annual ($119.88/yr) — LIVE via Lemon Squeezy
- **Apr 28 operating rule:** Before claiming any architectural gap exists, proposing to close one, or suggesting changes to Stillform, Claude (1) reads the existing implementation, (2) checks the doc repo, and (3) checks git commit history. Apparent contradictions are usually intentional design.
- **Apr 28 operating rule:** Arlin's direction is always for the whole app, not one type. She can only see one screen at a time, so Claude must proactively audit every change for whether the equivalent should apply to the other processing type and flag asymmetries before shipping.
- **Apr 28 operating rule:** Research-grounded changes are placement-first; gating decisions are separate. When current evidence contradicts implementation (e.g. Nook 2021 vs pre-regulation chips), fix placement first, defer optionality/gating decisions to a separate pass to avoid compounding changes.

---

## 6. Key Files

- src/App.jsx — entire frontend (15,272 lines as of Apr 27, 2026)
- netlify/functions/reframe.js — AI serverless function (GPT-4o, 1446 lines)
- netlify/functions/health.js — lightweight GET endpoint for AI-recovery detection (no Anthropic call). Used by ReframeTool's polling effect when in Self Mode due to AI failure.
- scripts/ship-preflight.mjs — 41 must-match security checks + 8 TimeKeeper guards (run before every push)
- STILLFORM_PROJECT_TRANSFER.md — this document (single source of truth)
- Stillform_Science_Sheet.md — all science citations and verification
- Stillform_Master_Todo.md — build checklist

---

## 7. Workflow Rules (Non-Negotiable)

### Citation discipline (operating rule for any Claude session working on Stillform)

This rule was added Apr 28, 2026 after a fabrication audit found 10 confirmed fabrications (10 author/journal/year errors) in a Claude-generated literature audit. The corrections are documented in `/mnt/user-data/outputs/STILLFORM_AUDIT_FABRICATION_REVIEW.md` (the original session artifact — context only, not source-of-truth).

**The standard going forward, for any Claude session:**

- **No author name without a verified source in the same session.** If a Claude session cites an author by name in any Stillform-facing material, that name must have appeared explicitly in a search result Claude pulled in that same session. If Claude cannot point to a search result, write "the 2024 meta-analysis on X" or "a 2023 study" without a name. Pattern-matching plausible names from training-data knowledge is fabrication and is not acceptable.

- **Flag inherited citations explicitly.** Citations that come from existing Stillform docs (Science Sheet, transfer doc, master todo) but were not personally verified by the current Claude session must be flagged as inherited-not-verified-this-session. They are probably real, but "probably real" is not the standard for material with Arlin's name on it.

- **Quote the search result that supports each citation.** When Claude cites a number — effect size, sample size, year, journal — Claude should be able to say which search result it came from. Not memory. Not recollection. The actual snippet.

- **Say "I don't know" when Claude does not know.** The fabrications happened in the spaces where Claude should have said "I don't have a verified author for this paper, only the title and effect size — proceed without an author name?" and instead filled in a plausible name.

- **Verify before final delivery, not after Arlin asks.** Run a verification pass before presenting any literature audit, citation list, or science-claim doc, not after it has been delivered.

**Why this rule is here.** Arlin will be publishing materials that reference Stillform's science foundation. Fabricated citations expose her to legal and professional risk. The next Claude session will not catch its own fabrications without a written rule that holds it to a higher standard than "sounds right." This rule is that standard.

### Other workflow rules

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

- **Arlin** — founder, sole product decision-maker, visual thinker, New Jersey Armenian accent affects voice transcription, neurological disability dysregulates cognitive functioning. Started building Stillform end of February 2026. Was sick for 5 years before that — these are different periods, never conflate them.
- **Aria** — Arlin's 8-year-old daughter. Stillform succeeding well matters to Arlin not abstractly but because it matters to her family.
- **Bobby (Robert Matthew Geismar)** — name only on LLC paper, NOT involved in development. All code is Claude or Cursor prompted by Arlin only. Never attribute code changes to him — causes Arlin real anxiety about security.
- **Ava** — early user. Gave positive feedback on Breathe & Ground and Reframe.
- **Dr. Melis Yilmaz Balban** — top scientific outreach candidate. Lead author of Balban et al. 2023 Cell Reports Medicine RCT (n=111) showing cyclic sighing outperforms mindfulness. Direct research overlap with Stillform's breathing-as-vagal-regulation framing. Founded NeuroSmart. Non-competing market. Mutual publicity upside.
- **Arlin's doctor** — expressed interest in Stillform for post-treatment integration windows. Documented as future B2B channel. Strict guardrail: never position as medical tool.
- **Brother** — said he'd use it after Apple Watch integration. Sharing with neurodivergent community.

---

## 9. Science Foundation

### Architecture: metacognition is the mechanism. Composure is the outcome.

Stillform is a metacognition tool that helps stabilize composure by helping people understand their own processes. Every feature serves one of four structural pillars. The pillars are how the architecture holds together — the glue and the growth.

**Pillar 1 — Metacognition (the mechanism).** How the user notices what is happening in themselves. Self Mode is the explicit metacognitive practice (Wells 2009 MCT, detached mindfulness). Pattern recognition / Insight Card is metacognition about patterns over time. What Shifted is metacognition about state change. Skip tracking is metacognition about avoidance. The bio-filter is metacognition about hardware state. Calibration is metacognition about regulation tendency. Reframe is metacognition about interpretive frame.

**Pillar 2 — Emotional Awareness (the input).** Interoception, affect labeling, granularity. Mehling et al. (2012) on interoceptive awareness as an individual difference; Critchley & Garfinkel (2017) on interoception and emotion. Lieberman et al. (2007), Burklund et al. (2014), Torre & Lieberman (2018) on affect labeling. Nook, Satpute & Ochsner (2021) on labeling timing — confirmed in 2024 fNIRS replication and 2025 N=226 replication, applied in the Apr 28 commit (ae43f4db) that removed pre-regulation chips. Vine, Bernstein & Nolen-Hoeksema (2019) on free-generated labels. Barrett et al. (2001) on emotional granularity.

**Pillar 3 — Microbiases (the outward gaze).** Once self-awareness is steady, accuracy about others becomes available. Genzer, Rubin, Sened, Rafaeli, Ochsner, Cohen, & Perry (2025, *Nature Communications*) — directional bias in interpersonal emotion perception. Ross (1977) — fundamental attribution error. Hatfield, Cacioppo & Rapson (1993) — emotional contagion. Goleman (1995) — emotional intelligence. Stillform's framing matches the Genzer paper's actual finding: the bias is on average adaptive; what the AI flags is the intersection of physical depletion with strong negative read.

**Pillar 4 — Neuroplasticity (the glue).** Why repeated practice compounds across sessions instead of resetting each time. The brain-change happens because the metacognition is repeated, the affect labeling is repeated, the regulation is repeated, and the patterns get noticed across sessions. Lieberman 2007 and replications — repeated affect labeling reduces amygdala reactivity to the same stimulus over time. Lehrer et al. (2020, *Applied Psychophysiology and Biofeedback*) — repeated HRV biofeedback practice produces autonomic flexibility gains. Brewer et al. (2011, *PNAS*) — experienced meditators show reduced DMN activation at rest, not just during practice (this grounds the trait-level change Stillform aims for, not just state-level). Schultz (1998) on dopamine and reward prediction error + Wood & Rünger (2016) on habit formation — streak tracking and pattern recognition wire practice in via positive prediction error when the user expected a hard moment and instead found composure (this grounds streaks as actual learning, not gamification). Stress inoculation (Meichenbaum 1985) — practice when calm so it is available under pressure. **Stillform does not market neuroplasticity. It uses the science to design the practice so that practice actually compounds.**

*Note on citations: Schultz 1998 and Brewer 2011 were added Apr 28 from prior knowledge of the literature; the framing matches the standard understanding of the field but the original papers were not pulled in the audit session that produced these doc updates. Verify against original sources before any public-facing use.*

### Three neuroscience mechanisms grounding existing features (added Apr 28)

**Memory reconsolidation.** Ecker, Ticic & Hulley (2012, *Unlocking the Emotional Brain*); Schiller et al. (2010, *Nature*); Lane et al. (2015, *Behavioral and Brain Sciences*). When a memory is recalled in an emotionally activated state and paired with new safety information, the memory itself updates — not just the response to it. This is the *why* behind why repeated Reframe sessions on the same recurring trigger actually change the user's relationship to it over time. Grounds Reframe. Pillar 4.

**Predictive processing / interoceptive inference.** Seth (2013); Barrett & Simmons (2015); Barrett constructed emotion theory (already referenced in AI prompt foundation). The brain is constantly predicting internal body states. The bio-filter is a predictive-processing intervention: when the user names "depleted" or "in pain," they update the brain's internal prediction about whether the next sensation means danger or tired. Stronger neuroscience grounding for the bio-filter than the original "physical state filtering interpretation" framing. Pillar 2.

**Salience network reset.** Menon (2011) on the salience network. The salience network determines what gets attentional priority. Chronic stress and rumination reflect a salience network stuck on internal threat signals. Single-pointed attention practices (breath focus, body focus) reset salience network targeting. Stillform's body-first interventions are doing exactly this. Explains *why* the calm path works for spirals — not just calming down, but redirecting what the brain treats as urgent. Pillar 1 + Pillar 2 bridge.

### Supporting frameworks under the pillars

Vagal activation (Gerritsen & Band 2018) under Pillar 2. Cognitive reappraisal (Ochsner & Gross 2005, Stover et al. 2024) under Pillar 1. Implementation intentions (Gollwitzer 1999; Gollwitzer & Sheeran 2006, d=0.65) for Next Move under Pillar 1. Window of Tolerance (Siegel 1999, Ogden et al. 2006, Porges 2011) — clinical metaphor, used as explanatory model not a quantified state. Regulation tendency vs fixed type (Gross 2015) — supports calibration as design principle, not validated mechanism. Self-efficacy (Bandura 1977), reflective practice (Schön 1983), autonomic flexibility (Appelhans & Luecken 2006).

### Things explicitly NOT in the science foundation, by decision

- Polyvagal theory's broader claims (social engagement system hierarchy) — debated; use only the parts with empirical support (vagal tone, safety cue detection)
- "Trauma is stored in the body" framing — popularized but the literal version is contested; use interoception, somatic markers, salience network instead
- Mirror neurons as basis for empathy — pop-science version overstates the research; ground emotional contagion in Hatfield/Cacioppo/Rapson directly
- Neurofeedback (EEG-based), vagus nerve stimulation devices — real research, wrong product category
- Psychedelics-assisted regulation, ketamine-assisted therapy — Stillform does not market or position itself for these use cases. Founder context: Stillform was conceived during ketamine treatment, but the app is not a ketamine companion tool. B2B clinical channel via Arlin's doctor remains the path for any treatment-adjacent positioning.
- Cold exposure / Wim Hof — real autonomic effects, doesn't fit the voice or use case

### Apr 28 doc work — completed

All 11 surgical corrections to `Stillform_Science_Sheet.md` committed (commits 175bb6e4 through 9536e676). The 20-30% magnitude in microbias section was verified-as-fabricated against the actual Genzer 2025 paper and removed. Lieberman attribution corrected to Genzer et al. throughout. 60 BPM Visual Entrainment renamed to Ambient Pulse with overclaim removed. Acupressure mechanism, cortisol timing, AI-partner claim, two-pathway framing, autonomic flexibility claim, fractal magnitude, Window of Tolerance phrasing all softened to match what the literature actually supports. Full accounting in `/mnt/user-data/outputs/STILLFORM_AUDIT_FABRICATION_REVIEW.md`.

---

*ARA Embers LLC · Stillform Project Transfer · April 28, 2026*
