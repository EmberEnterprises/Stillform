# Stillform — Frontend

The Stillform frontend. Built against `STILLFORM_CANON.md`,
`STILLFORM_DESIGN_SYSTEM.md`, and `STILLFORM_ENGAGEMENT_ARCHITECTURE.md`.

## Foundation verification checks (phone-screenshot level)

1. **Ground reads as cinematic.** Subtle radial center brightness, not flat.
2. **Hairlines feel printed-not-drawn.** 0.5px, faint, never 1px.
3. **Cormorant headlines have refined weight.** 300 at display-xl/lg, 400 at md/sm.
4. **Mono labels feel engraved.** Wide letter-spacing (0.12-0.16em), small caps.
5. **Cream tone reads warmer than pure white body.** `#EDE8DC` on headlines.
6. **Amber accent appears only as hairline + word emphasis.** Never fill.
7. **Buttons feel dignified, not loud.** Dark with amber hairline + amber text.
8. **Negative space breathes.** 48-64px top, 24px paragraph rhythm.

## Authoring rules (mandatory)

- **Tokens only.** No arbitrary colors, font sizes, spacings, or motion durations. If a value isn't in `tokens.css`, it doesn't go in a component.
- **One element per beat on every surface.** No stacked panels.
- **No amber fills.** Accent only as hairline / single-character emphasis / small dot. Max 5% of any screen.
- **Surface copy uses the practice action, not the science name.** "Say it more precisely" not "granularity gym."
- **Settings is for preferences.** Practice content lives in My Progress as the user's library.
- **Composure is a felt outcome, never a product headline.** Headline framing is metacognition practice / self-mastery.
- **Read the canon before adding any surface.** Specifically `STILLFORM_CANON.md` and `STILLFORM_FRAMING_LAW.md`. Layer 0 (Framing) and Layer 0.5 (Document Context) gates every commit.

## Backend (used as-is)

Every Netlify function in `netlify/functions/` is the source of truth for its capability:

- `reframe` — AI metacognition (Notice → Reframe → Close)
- `todays-brief` — morning artifact
- `pre-event-brief` — 30-min-before-event artifact
- `move-card-select` — somatic move selection
- `scripts` — verbatim language for hard conversations
- `eod-artifact` — 2-sentence AI-named takeaway
- `infer-trigger` — trigger pattern inference
- `pattern-enrichment` — pattern analysis
- `calendar-screenshot-extract` — GPT-4o vision for calendar imports
- `subscription-*` — LemonSqueezy
- `organization-*` — B2B foundation (privacy wall enforced at three layers)

Supabase schema + RLS exist as backend design. ⚠️ **NOT wired in the live frontend (May 30 2026 audit):** no Supabase client, no sync, no encryption — user data is plain `localStorage`, device-only. "Encrypted storage" describes intended design, not current reality.

## Current phase

See `Stillform_Master_Todo.md` for the canonical phase state.
