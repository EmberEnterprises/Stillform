# CORE LOOP — THE SITTING REBUILT (v1.0, June 2026 — direction LOCKED by Arlin)

Arlin's verdict on the live walk: the sitting reads empty — "you name your day,
it mirrors what you say and adds a question. This is not how I want it. It
needs to be elite." Diagnosis confirmed in code: the prompt MANDATED mirroring
("anchored reflection IS the precision"). The shell is built; the core loop is
one move deep. This spec rebuilds the four minutes that are the product.

Approved shape (mock: outputs/from-one-word.html, this conversation):
**one word → tiny extractions → the work lands, visibly.**

## The doctrine (replaces mirroring)
1. **Mirroring is banned.** Restating the user's words back is not work.
2. **Extraction, not conversation.** Until material is sufficient, the AI's
   entire turn is ONE tiny concrete question — answerable in ≤6 words,
   thumbs-only. Never "tell me more." Never two questions.
3. **The work lands as structure, not prose.** When material suffices, the AI
   returns the work product: taken apart (verified vs assumed), the shape
   (matched against the USER'S OWN watch list when it truly matches),
   rebuilt (constructed, never restated), the bet (when the user made a
   falsifiable claim), one earned question.
4. **ZERO FABRICATION governs the split.** verified[] = facts the user stated,
   tight to their words. assumed[] = the spiral's claims, in their words.
   Nothing invented, no trend from one data point. An empty category stays
   empty.
5. **Low-demand days shrink everything**: one extraction max, a lighter work
   product (split + rebuilt only), statements over questions. Capacity-
   adaptive, never announced.

## Wire contract (v2 spine — replaces REFRAME_PRACTICE_SCHEMA)
Every turn returns ONE of:
- `{"mode":"extract", "ask":"≤12-word concrete question", "distortion":…,
   "log_prediction":null}`
- `{"mode":"work", "taken_apart":{"verified":[…],"assumed":[…]},
   "shape":{"watch_label":"EXACT label from the user's watch list or null",
            "line":"one plain sentence naming the shape"},
   "rebuilt":"1-3 sentences, constructed",
   "bet":{"text","confidence"}|null,
   "question":"one earned question or null", "distortion":…}`

Mode rules: extract while EITHER a concrete verifiable fact OR the spiral's
claim is missing from the user's own words; **max 2 extraction turns — the 3rd
AI turn MUST be work**; first input already rich (specifics present) → work
immediately. After a work turn, later turns may be extract (new thread) or
work (refined) — same rules.

## Client (Reframe screen)
- extract → the ask renders as the Cormorant question (manuscript register). *(corrected June 15 2026 — live serif token is Cormorant Garamond, not Fraunces)*
- work → ruled work blocks per the approved mock: TAKEN APART / THE SHAPE /
  REBUILT / ON RECORD / the question. Shape block pulls encounter meta
  (count, last seen) from the LOCAL watch list by label — server never
  invents counts. Bet renders LOG-THE-BET (existing recordPrediction).
- Close consumes `rebuilt` as the session's landing line.

## Honesty boundaries
- The mock's "0 for 4 on disasters foretold" requires bet RESOLUTION, which
  does not exist yet. V1 ships logging only; the record line ships with the
  follow-on resolution touch ("how did Thursday land?" at a later sitting).
  Never fake a record.
- `watch_label` must match the user's list exactly or be null — no forced
  matches, no flattering pattern-spotting.

## Build order
- L1 server ✅ (9738732): schema + doctrine + de-mirrored retry + mechanical
  anti-mirror validator (v2 spine path only; v1 legacy untouched). Proven 7/7.
- L2 client ✅ (June 2026): reframeApi parses extract/work (TDZ shadow on the
  route `mode` caught by proof — contract var renamed workMode);
  predictionLog accepts null confidence (a bet without a stated number is
  still a bet — fabricating one would violate zero-fabrication); Reframe
  renders the work blocks in the approved-mock order TAKEN APART → THE
  SHAPE (meta from LOCAL records only — flat-entry lookup fixed) → REBUILT
  → ON RECORD (bet text visible + LOG THE BET ruled tag; legacy quiet
  affordance preserved for fallback shape) → the earned question. Close
  consumes rebuilt via the legacy bridge. Proven 7/7 e2e + order check +
  null-confidence bet records to storage.
- L3 proofs: mocked model outputs → render assertions; extraction-cap logic;
  zero-fabrication spot checks. Live prompt behavior verified on Arlin's
  next deploy walk.
- Follow-on (separate): bet resolution; honest D5 redo incl. Crisis screen.
