# STILLFORM_DESIGN_SYSTEM.md
**Stillform whole-app prestige refresh — design system spec**
**ARA Embers LLC · April 30, 2026**

---

## What this document is

The locked design language for Stillform after the April 30 prestige refresh. Synthesized from references collected from four AIs (ChatGPT, Gemini, GPT 5.4, Copilot) plus an additional Claude pass — five sets of references in total. The references converged hard. This spec is the operationalization of that convergence.

Read this doc when:
- Building or rebuilding any screen
- Specifying any new component
- Reviewing whether a proposed design choice matches Stillform
- Onboarding any AI agent or developer

This spec governs every visual decision in the app. If something on screen doesn't match this spec, the spec wins until it's amended deliberately.

---

## The thesis

Stillform sits in **editorial luxury** — the visual family of Aesop, MUBI, Cartier, Hermès, Linear, Leica, The Economist Espresso. Not wellness. Not productivity. Not consumer SaaS.

The signal is *quiet intelligence*. Material restraint that suggests the product has judgment before the user reads a word. Typography carries authority. Motion has weight. Negative space is treated as material, not absence.

The current Stillform visual reads as wellness-app-default — flat amber on dark, cards on cards, generic borders. The bones are correct (near-black ground, serif-and-mono pairing, hairline borders). The calibration is wrong. This spec is the calibration.

---

## What's preserved from the current system

These aren't legacy choices — they're correct anchors that the references validated. Keep:

- **Near-black ground as base** — references converged on this
- **Refined serif + precise sans pairing** — Aesop, Espresso, Bloomberg, Cartier, Hermès, Claude's full proposal all confirmed
- **Single accent color discipline** — amber-on-dark is the right idea; the calibration of amber is what changes
- **Hairline borders at 0.5px** — references called this "printed not drawn" — Stillform already does this
- **The Cormorant Garamond + DM Sans + IBM Plex Mono triad** — these three fonts are correctly paired; treatment of them is what changes

What changes is treatment, fidelity, and discipline — not the fundamental palette decisions.

---

## Palette — the calibrated version

### Grounds

```
--ground-deep:    #08080A    /* primary background — slightly cooler/deeper than current */
--ground-elev:    #111114    /* elevated surface (cards, modals) — was --surface */
--ground-elev-2:  #16161A    /* secondary elevated (nested cards, input fields) — was --surface2 */
```

**Why deeper than current `#0A0A0C`:** the references emphasized true black depth (MUBI, Leica) but warmth in the undertone (Aesop, Hermès). `#08080A` is near-true-black with the slightest cool undertone — reads as cinematic without going to flat #000 (which feels app-like, per the references).

**Cinematic depth via subtle gradient:** the body background should not be flat. Apply a barely-visible radial gradient at 2% lightness shift toward center. References called this "saturated dark with subtle dimensionality" (Linear, Hermès).

```css
body {
  background: radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.018) 0%, transparent 60%), var(--ground-deep);
}
```

### Borders & dividers

```
--border-hairline:  rgba(255,255,255,0.06)   /* default — was 0.07 */
--border-emphasis:  rgba(255,255,255,0.10)   /* hover/active — was 0.12 */
--border-printed:   rgba(255,255,255,0.04)   /* low-emphasis section dividers */
```

All borders rendered at **0.5px**, never 1px. Reference: Aesop, Hermès, Cartier all use hairlines that feel printed on uncoated stock.

### Accent — calibrated amber

The current `#C8922A` reads as wellness amber. The references pointed to **antiqued metallic** treatment — gold-leaf, brushed bronze, muted ember. Not bright. Not warm-saturated. Antiqued.

```
--accent:         #B8862B    /* primary accent — slightly desaturated, more antiqued than current */
--accent-deep:    #8C6420    /* hover/pressed states */
--accent-glow:    rgba(184,134,43,0.06)    /* very subtle glow for hero moments */
--accent-line:    rgba(184,134,43,0.35)    /* hairline accent — used at 0.5px on edges */
```

**Discipline rule (non-negotiable):** accent occupies maximum 5% of any screen. Never as a button fill. Never as a background. Used as:
- A 0.5px hairline (e.g., active tab indicator, headline underline)
- A single character or word in a headline
- A small status dot at <8px
- A tiny indicator on the active state of a control

This is the Hermès / Cartier discipline. Once accent is used as a button fill or large area, the design becomes "wellness app." Hold the line.

### Typography colors

```
--text-primary:   #E8EAF0    /* main body text */
--text-quiet:     rgba(232,234,240,0.62)    /* secondary text, was --text-dim */
--text-faint:     rgba(232,234,240,0.40)    /* metadata, captions, was --text-muted */
--text-cream:     #EDE8DC    /* warmer cream tone for editorial moments — used at headline */
```

The `--text-cream` is new — based on Hermès / Cartier convention of cream-on-black instead of pure-white-on-black. Pure white on near-black reads as system UI. Cream-on-black reads as printed. Used selectively at editorial moments (page headlines, hero text), not everywhere.

### Status colors

Stillform doesn't need success/error states with bold colors. Per reference convergence, status is conveyed through subtle tonal shifts:

```
--state-positive:  #8FA88A    /* sage — for positive shifts, was-amber-success */
--state-negative:  #B47A6A    /* terracotta — for concerning trends */
--state-neutral:   #A8A29A    /* warm gray — for "no change" */
```

These three are used only where the data layer needs to signal direction. They are **not** used as backgrounds, fills, or borders. They appear as small dots, brief text moments, or subtle tonal weights on micro-elements.

---

## Typography — calibrated

### The triad

**Cormorant Garamond** (serif, headlines + identity) — Google Fonts, free
**DM Sans** (sans, body + system text) — Google Fonts, free
**IBM Plex Mono** (mono, metadata + instrument moments) — Google Fonts, free

All three free via Google Fonts. Already loaded in the current build — no font integration work required.

**Pricing review Apr 30:** the editorial-luxury references the design system anchors against use Lyon Display + Söhne + Berkeley Mono in production (Aesop, Linear, Teenage Engineering). Pricing review found Web + App licenses for all three would total ~$812. Comparison passes against free alternatives (Fraunces, EB Garamond, Inter, JetBrains Mono) confirmed there is no full-fidelity free substitute for Lyon Display specifically — paid fonts genuinely deliver something free fonts don't at editorial scale. **However**, the fidelity gap is most visible to designers staring at type all day; users on phones, against the rest of the calibrated system (palette, spacing, motion, hierarchy), see a much smaller difference than the price gap suggests.

**Decision:** ship the prestige refresh with the existing free triad. Paid font upgrade deferred to post-launch as a discrete project. Once the rest of the design system is live and Stillform is operating in market, decide whether typography is genuinely the limiting factor based on real evidence rather than abstract specification.

**Why this is fine:** the reason Stillform currently reads as low-fi is not the fonts. It is the calibration — wrong scale, wrong leading, wrong tracking, wrong weight discipline, wrong color application. All of those fixes are free. Cormorant Garamond at the right scale with the right leading and the right hierarchy in the right palette is a credible editorial-luxury serif. The same fonts that read as 32-bit NES today will read as editorial luxury tomorrow because the calibration around them has changed.

### When to use each

**Cormorant Garamond** — Editorial moments. Page titles, hero text, section headlines, identity statements, single-word emphasis. Used at large scale (24-48px). Light weight (300) for delicate prestige; regular (400) when more presence needed. Italic available for sparing emphasis.

**DM Sans** — System text, body copy, paragraphs, labels, button text, anything readable in volume. Regular (400) default. Medium (500) for emphasis. 300 for de-emphasized large text.

**IBM Plex Mono** — Instrument moments (timestamps, session counts, metadata, technical labels), small-caps treatments, anything that should read as "measurement, not decoration." Used at small sizes (9-13px) typically with letter-spacing for prestige feel.

### The scale

A defined typographic scale, not arbitrary sizes. Use only these values:

```
display-xl:   48px / serif 300 / line 1.15 / tracking -0.01em
display-lg:   36px / serif 300 / line 1.20 / tracking -0.005em
display-md:   28px / serif 400 / line 1.30 / tracking 0
display-sm:   22px / serif 400 / line 1.35 / tracking 0
body-lg:      17px / sans 400 / line 1.65 / tracking 0
body-md:      15px / sans 400 / line 1.55 / tracking 0
body-sm:      13px / sans 400 / line 1.50 / tracking 0
caption:      12px / sans 400 / line 1.45 / tracking 0.01em
mono-md:      12px / mono 400 / line 1.40 / tracking 0.06em / uppercase
mono-sm:      10px / mono 400 / line 1.30 / tracking 0.12em / uppercase
mono-xs:      9px  / mono 400 / line 1.20 / tracking 0.16em / uppercase
```

Use mono-sm and mono-xs for section labels, status indicators, small caps editorial labels. The wide tracking is what makes them feel "engraved" rather than "rendered" — reference: Cartier, Leica, Teenage Engineering.

### Reading rhythm (Aesop / Espresso anchor)

For any screen with a paragraph of text:

- Line height **1.55-1.65** for body copy (currently 1.6 in places — lock at 1.6)
- Measure **52-62 characters** wide (this is critical — current implementation uses full-width text columns which read as low-fi)
- Vertical rhythm: **24px** between paragraphs, **40px** between sections, **64-80px** between major content blocks
- Top of any screen: **at least 40px** of negative space before content begins (currently most screens start at ~24px — increase to 48px minimum)

### Headline usage

Hero headlines (`display-xl` or `display-lg`) appear at **most one per screen**. The hero is the moment of authority. If a screen has two display-scale typographic moments, demote one.

Cormorant italic exists. Use it almost never. When you do, it's for a single word in a sentence — Hermès convention. Never for full headlines. Never for body copy.

---

## Spacing — calibrated rhythm

A defined spacing scale, not arbitrary values:

```
space-2:    2px   /* hairline gap */
space-4:    4px   /* tight (icon + text) */
space-8:    8px   /* small (stacked tight elements) */
space-12:   12px  /* base (within a card) */
space-16:   16px  /* default (between elements) */
space-24:   24px  /* between paragraphs */
space-32:   32px  /* between sub-sections */
space-48:   48px  /* between major sections */
space-64:   64px  /* between major content blocks */
space-80:   80px  /* breathing space (page edges, hero margins) */
```

Use only these values. No 6px, no 18px, no 30px. The scale is what creates rhythm.

### Page margins

- Mobile horizontal: **24px** at sides (currently varies; lock at 24)
- Mobile top of content: **48-64px** below header chrome (depending on whether headline is hero)
- Mobile bottom: **80px** trailing space at bottom of any scrollable content (so the last element has breathing room before the safe area)

These are larger than current. The references called this "negative space as material" (Hermès, Aesop, Herzog & de Meuron). The current app doesn't breathe; the redesign does.

---

## Components — the new vocabulary

### What goes away

**Cards-in-cards.** The current system stacks bordered cards inside bordered sections. References universally rejected this. Replace with typography-led hierarchy and hairline dividers.

**Heavy fills.** Solid colored backgrounds for status, callouts, etc. References rejected this. Use border + tint instead.

**Bullet lists with icons.** Reference: editorial publications, luxury maisons — they use prose, not bullet lists with check icons. Lists become typographic stacks with hairline dividers.

**Loud CTAs.** Buttons with high-contrast fills shouting for attention. References rejected this. Buttons become outline-only or hairline-bordered.

### What replaces them

**The editorial block.** Single typographic unit — small mono label, large serif headline, body text, optional hairline rule. No background, no border. Sits directly on the ground.

```
[mono-sm uppercase tracked label]
[display-md serif headline]
[body-md paragraph text]
[optional 0.5px hairline rule, 24px wide]
```

**The instrument card.** When a card is genuinely needed (e.g., a session in a list, a setting toggle), use:

- Background: `--ground-elev`
- Border: 0.5px hairline `--border-hairline`
- Radius: 4px (calibrated below)
- Inset highlight: 0.5px top edge in `rgba(255,255,255,0.025)` for material depth
- Padding: `space-16` minimum
- No shadow

**The hairline divider.** Section breaks use a 0.5px horizontal rule in `--border-printed`, never a thicker line, never a colored line. Optionally 24-40px wide centered (Aesop convention) instead of full-width.

**Buttons.**

```
btn-primary:    background var(--ground-elev), border 0.5px var(--accent-line),
                color var(--accent), padding 14px 28px, no shadow,
                hover: border opacity 0.6, transition 300ms ease

btn-secondary:  background transparent, border 0.5px var(--border-emphasis),
                color var(--text-primary), padding 14px 28px,
                hover: border var(--accent-line), color var(--accent), transition 300ms

btn-ghost:      background transparent, no border,
                color var(--text-quiet), padding 14px 20px,
                hover: color var(--accent), transition 200ms
```

**Critical change:** primary buttons are no longer amber-fill-on-dark. They are dark-with-amber-hairline-and-amber-text. This is the Hermès / Aesop convention — the action is dignified, not loud. References called this out specifically (Apple TV+, Soho House, MUBI, Aesop).

### Radius — calibrated

The current system uses 2/4/6px. References suggested even tighter:

```
--r-tight:    2px    /* inputs, small buttons, status pills */
--r-default:  4px    /* cards, primary buttons */
--r-large:    6px    /* modals, hero containers — used sparingly */
```

Most elements at 4px. Inputs and small things at 2px. Avoid 8px+ entirely — it reads as consumer SaaS.

---

## Motion — the weighted language

References agreed strongly: motion is the highest-leverage prestige signal Stillform currently fails. Default iOS spring animations and 200ms transitions read as app-default. Prestige uses **slower, custom-eased motion that feels physical**.

### Duration scale

```
motion-quick:    180ms    /* hover states, subtle feedback (Leica shutter) */
motion-default:  300ms    /* most state changes, tab switches */
motion-weighted: 480ms    /* page transitions, section reveals (Hermès page turn) */
motion-slow:     650ms    /* hero entrances, ceremonial moments (Cartier reveal) */
```

### Easing

Replace the default `ease` and `ease-in-out` with custom curves:

```
--ease-prestige:   cubic-bezier(0.22, 0.61, 0.36, 1)      /* default — decelerates heavily at end */
--ease-page-turn:  cubic-bezier(0.32, 0.08, 0.24, 1)      /* weighted — for navigation */
--ease-shutter:    cubic-bezier(0.55, 0.06, 0.68, 0.19)   /* mechanical — for actions */
```

The page-turn easing (used on screen transitions) makes navigation feel like turning a heavy book page. Reference: Hermès. The shutter easing is for confirmations / submissions / decisive actions. Reference: Leica.

### Transition principles

- **Fades over slides.** When transitioning between screens or states, prefer crossfade. Reference: MUBI.
- **Sequence over simultaneity.** Image emerges first, then headline fades in 100ms later, then metadata fades in another 100ms later. The 200ms total feels considered. Everything appearing simultaneously feels generic.
- **No bounces.** Spring animations that overshoot read as iOS default. Replace with weighted ease-out.

### Concrete patterns

**Tab switch:** content cross-fades over `motion-default` (300ms) with `--ease-prestige`. The new tab's underline (0.5px accent line) animates in over `motion-weighted` (480ms) with a slight delay (100ms after content begins).

**Modal open:** background dims to `rgba(0,0,0,0.7)` over 200ms, then modal fades in + scales from 0.96 to 1.0 over `motion-weighted` (480ms) with `--ease-prestige`. Modal close reverses but `motion-default` (300ms).

**Input commit (e.g., typing finished, button tapped):** subtle scale-down (0.98) + slight color shift over `motion-quick` (180ms) with `--ease-shutter`. Mechanical, not bouncy.

**Page enter:** entire screen fades in from black over `motion-slow` (650ms) with `--ease-prestige`. Hero element appears first (0ms), section labels fade in at 200ms, body content fades in at 350ms. Layered, sequential.

---

## Imagery — the rule

References agreed: Stillform should use imagery rarely and well. The current app uses no real imagery, which is fine. If imagery is added, follow these rules:

- **Full-bleed only.** Never inside a card. Never with a border. Never with rounded corners >4px.
- **Edge-dissolve into the ground** via 60-80px linear gradient. Reference: MUBI. The image and the ground should not have a hard edge.
- **Editorial framing.** The image is one element among others on a typographic page, not decoration around text.
- **No stock imagery.** No abstract gradients. No "wellness" visuals. If imagery is used, it's specific (a real photograph of a real subject) or it's not used.

For Stillform v1, imagery may be deferred entirely. Editorial typography against the ground is sufficient and aligned with references (Aesop product pages, Espresso briefings, Cartier landing).

---

## Iconography — minimal and technical

References rejected cute icons unanimously. Stillform's current iconography is mostly neutral but a few elements (cute info icons, decorative dots) lean wellness-default.

**The rules:**

- Icons are **outlined, single-stroke**, never filled
- Stroke weight: 1.25px (thin enough to feel etched)
- Size: 16px or 20px — never larger
- Color: `--text-quiet` default, `--accent` for active state
- Geometric / technical / diagrammatic — never illustrative
- When in doubt, use a typographic glyph instead (• → ‹ ✦ ◯ — these read as material, not decoration)

The mono accent characters Stillform already uses elsewhere (◎ ✦ ◌) are correct — they're closer to typographic glyphs than icons. Keep using these. Phase out any actual icon component over time.

---

## What this spec doesn't include yet

These are real questions but they're not blocking the screen rebuild. Capture them as decisions to make as the build proceeds:

**1. Sound design.** References didn't address this; Stillform doesn't currently have sound design. Open question for later — Bang & Olufsen / B&O reference suggests there's room here, but it's not v1 scope.

**2. Haptic feedback.** Real prestige uses subtle haptics (Apple Pay confirmations, Things 3 task completion). Stillform's Capacitor integration supports this. Worth a small spec pass once the visual language is stable.

**3. Loading / empty states.** Need their own pass. References suggest minimal — a single small mono label that says "Loading session" with a single dot animation, not a spinner. Defer until a screen with real loading lands.

**4. Dark mode is the only mode.** Light mode is in the current code but the references all anchored on dark. v1 of the prestige refresh ships dark-only. Light mode can return post-refresh as a real adaptation, not a parallel system.

**5. Theme variants (Suede, Teal, Rose, Midnight) — kept, recalibrated as part of refresh.** Locked Apr 30. These exist as CSS palette overrides in current code; recalibrating them against the new design system is light work (palette token swaps, no structural changes). Each theme inherits the new typography, spacing, motion, and component vocabulary — only ground/accent/border tokens shift per theme. Implementation: after the canonical palette ships and is verified, do one pass per theme variant against the new tokens. Each theme commit is small.

---

## What's actually paid

**Nothing in v1.** Decision locked Apr 30 — current free triad ships with the prestige refresh. Paid font upgrade deferred to post-launch.

**Post-launch upgrade path** (for reference, not for v1):

- **Lyon Display** — Commercial Type — https://commercialtype.com/catalog/lyon — would replace Cormorant Garamond at headlines. Highest-leverage upgrade because headlines carry the most prestige weight. Smallest viable purchase: Lyon Display Light, Web license only = ~$50. Add weights and App license incrementally as needed.
- **Söhne** — Klim Type Foundry — https://klim.co.nz/retail-fonts/sohne/ — would replace DM Sans at body/system text. Smaller fidelity gain than Lyon — Inter (free) is the credible stand-in if going free, DM Sans (current) is also fine.
- **Berkeley Mono** — Berkeley Graphics — https://berkeleygraphics.com/typefaces/berkeley-mono/ — would replace IBM Plex Mono. Smallest fidelity gain — IBM Plex Mono is genuinely close.

**Upgrade timing:** once the prestige refresh ships and Stillform is in market, evaluate whether typography is genuinely the limiting factor based on actual user feedback and Arlin's lived-in experience of the live app. Buy the upgrade incrementally — Lyon Light Web first ($50), add weights and license types as evidence dictates.

**Other costs in v1:** none. No paid CSS framework, no paid motion library, no paid component library. The rest of the design system is buildable with the existing stack (React + Tailwind core utilities + custom CSS).

---

## Implementation order

When the rebuild starts, work in this order:

1. **Update CSS variables** at the top of App.jsx — palette, borders, radii, motion tokens. This is one commit and changes how everything renders without touching individual components.

2. **Update font import + base typography** — add the typographic scale as utility classes. Update body styles. One commit.

3. **Update primary components** — buttons, cards, inputs to match the new vocabulary. One commit per component class.

4. **Rebuild screens in priority order:**
   1. Home (the first thing users see, sets the tone)
   2. Reframe entry (most-used tool, highest leverage)
   3. Self Mode (already specced, blocked on this design system)
   4. My Progress (already specced, blocked on this design system)
   5. Body Scan
   6. Breathe & Ground
   7. Pulse / Signal Log
   8. Settings
   9. FAQ
   10. Onboarding (defer — onboarding redesign is a separate prelaunch item)

5. **Pass through every remaining screen** to catch leftover wellness-default treatments.

6. **Theme variant recalibration** — after canonical palette ships and verifies, recalibrate Suede / Teal / Rose / Midnight against the new system. One commit per variant. Light work — only ground/accent/border tokens shift per theme; typography/spacing/motion/components inherited from canonical.

Each screen rebuild is verified on phone debug before moving to the next. No screen is "done" until it renders on Arlin's phone and matches the spec.

**Font integration:** none required for v1. Current fonts (Cormorant Garamond + DM Sans + IBM Plex Mono) are already loaded and stay loaded. The prestige refresh changes how these fonts are scaled, weighted, leaded, tracked, and paired against the calibrated palette — not which fonts render. Post-launch font upgrades (if any) become discrete CSS commits at that time, not v1 scope.

---

## How to use this spec

When in doubt, ask: *would Aesop ship this? Would MUBI? Would Cartier?* If the answer is no, redo it. If the answer is yes for some elements but no for others, the no-elements are the ones that need work.

The four AI references all converged on the same family because there is a real visual coherence to editorial luxury. Once Stillform is rebuilt against this spec, every new screen has a clear precedent — you don't have to redesign from scratch each time. The spec carries the design vocabulary forward.

This is the system. Hold the line.

---

*ARA Embers LLC · Stillform Design System Spec · April 30, 2026*
