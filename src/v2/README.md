# Stillform v2 — Foundation

The v2 frontend rebuild. Built from scratch against `STILLFORM_CANON.md`,
`STILLFORM_DESIGN_SYSTEM.md`, and `STILLFORM_ENGAGEMENT_ARCHITECTURE.md`.

## Why v2 exists

The v1 frontend in `src/App.jsx` is 34,000+ lines in one file with
accumulated drift over months. Architectural violations (stacked widgets
on home, framing-law violations in copy, wellness-default aesthetic) are
hidden in the file's size. The backend (Netlify functions, Supabase
schema, LemonSqueezy, B2B foundation) is well-organized and stays.

v2 rebuilds only the frontend, calling the same backend, against the
canonical architecture and design system.

## How to view v2

Append `?v=2` to any URL. Default routing renders v1 (`App.jsx`)
unchanged — existing users see no change.

Local: `http://localhost:5173/?v=2`
Production (after deploy): `https://stillformapp.com/?v=2`

The flag is URL-driven, not localStorage. A bare `stillformapp.com` tap
always returns to v1. v2 is reachable only by deliberate opt-in.

## Current scope

**Foundation only.** Tokens + atomic components + one verification
screen. No product surfaces yet.

```
src/v2/
  tokens.css              ← every design-system token (palette, typography, motion, spacing)
  components.css          ← pseudo-class states that inline styles can't express
  AppV2.jsx               ← v2 root, scopes everything under .sf-v2
  components/
    MonoLabel.jsx         ← small-caps editorial label (mono-xs / sm / md)
    HairlineDivider.jsx   ← 0.5px horizontal rule
    EditorialBlock.jsx    ← core typographic unit (label + headline + body + optional rule)
    Button.jsx            ← primary / secondary / ghost — never amber fill
    InstrumentCard.jsx    ← enclosed surface, used sparingly
  screens/
    FoundationVerify.jsx  ← renders every primitive once for phone-level audit
```

## What the foundation verifies

Phone-screenshot checks (`?v=2` route, before any product surface
gets built):

1. **Ground reads as cinematic.** Subtle radial center brightness, not flat.
2. **Hairlines feel printed-not-drawn.** 0.5px, faint, never 1px.
3. **Cormorant headlines have refined weight.** 300 at display-xl/lg, 400 at md/sm.
4. **Mono labels feel engraved.** Wide letter-spacing (0.12-0.16em), small caps.
5. **Cream tone reads warmer than pure white body.** `#EDE8DC` on headlines.
6. **Amber accent appears only as hairline + word emphasis.** Never fill.
7. **Buttons feel dignified, not loud.** Dark with amber hairline + amber text.
8. **Negative space breathes.** 48-64px top, 24px paragraph rhythm.

If any of these read as wellness-default — the tokens get the fix before
any screen gets built. Foundation iteration is cheap; rebuilding screens
on a wrong foundation is not.

## Next phases (do not build until foundation is verified on phone)

1. **Phase 1 — Home as one-element-per-beat.** Single transforming surface
   that shows current beat (morning / main / EOD / wind-down). Existing
   backend endpoints called from the new home (Today's Brief, etc).
2. **Phase 2 — Spine (Notice → Reframe → Close).** Routing structure for
   every practice surface. Sub-beats inside each step, one element per
   sub-beat.
3. **Phase 3 — My Progress.** Roadmap, weekly reflection, practice content
   library, AI proposals queue, audit history.
4. **Phase 4 — Support Sheet.** Move card + Scripts behind it.
5. **Phase 5 — Library.** External curated knowledge surface.

## Authoring rules for v2 (mandatory)

- **Tokens only.** No arbitrary colors, font sizes, spacings, or motion
  durations. If a value isn't in `tokens.css`, it doesn't go in a
  component.
- **One element per beat on every surface.** No stacked panels. If a
  screen has two display-scale moments, demote one.
- **No amber fills.** Accent only as hairline / single-character emphasis /
  small dot. Max 5% of any screen.
- **Surface copy uses the practice action, not the science name.** "Say
  it more precisely" not "granularity gym." Science terms live in code
  comments and the Science Sheet.
- **Settings is for preferences.** Practice content lives in My Progress
  as the user's library.
- **Composure is a felt outcome, never a product headline.** Headline
  framing is metacognition practice / self-mastery.
- **Read the canon before adding any surface.** Specifically
  `STILLFORM_CANON.md` and `STILLFORM_FRAMING_LAW.md`. The audit
  philosophy's Layer 0 (Framing) and Layer 0.5 (Document Context) gates
  every v2 commit.

## Backend (unchanged, used as-is)

Every Netlify function in `netlify/functions/` remains the source of
truth for its capability. v2 components call them with the same payload
shapes v1 uses:

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

Supabase schema, RLS, encrypted local storage shapes — all unchanged.
User data migrates because data shapes are stable.
