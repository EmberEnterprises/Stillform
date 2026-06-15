# STILLFORM DESIGN SYSTEM — "THE SYNTHESIS" (v1.0 LOCKED by Arlin, June 2 2026)

Three directions were built and presented (Cajal · Signal · Folio); Arlin loved all
three; the synthesis was built and approved: **one system, three signatures with
strict jobs.** Mock: outputs/synthesis.html (this conversation, June 2).

## The system
- **BASE = Folio.** Cormorant Garamond display · DM Sans body · IBM Plex Mono
  utility · Caveat for marginalia only. *(Corrected June 15 2026 to live tokens — D1 "The Synthesis" originally swapped to Fraunces/Inter; that swap was reverted and the locked prestige type (Cormorant + DM Sans) restored. Doc was describing the rejected direction.)* Ruled-manuscript rhythm; chapter-rule
  buttons (top+bottom brass rules, no boxes).
- **TIME = the Signal trace.** The day as one continuous line; sittings and live
  catches are events ON the line.
- **GROWTH = the Cajal arbor.** Practice drawn as a neural specimen; new growth
  buds at the tips.
- **VOICE = marginalia.** The concierge writes in the margin, in its own hand
  (Caveat, brass). It annotates; it never interrupts.

## Palette (ONE ground · ONE ink · ONE metal · two sworn accents)
- ground: #08080A / elev #111114 / elev-2 #16161A (near-black, per the locked prestige spec) *(corrected June 15 2026 — D1 used warm umber #221C15; reverted to the locked near-black ground)*
- ink (text): #EDE8DC cream headlines · #E8EAF0 cool body · faint .52 (AA-passing)
- metal: #B8862B antiqued gold (the ONLY decorative accent — rules, labels, marginalia) *(corrected June 15 2026 — D1 used #C9A45C; reverted to spec #B8862B)*
- --sf-live: #6FE3C4 phosphor — EXCLUSIVELY live data (the trace, live catches)
- --sf-growth: #8C3B2A oxblood — EXCLUSIVELY new growth (arbor buds, gone-quiet
  strikethrough)
- states keep sage/terracotta/warm-gray (they sit naturally in the warm field)

## Accent law (do not soften)
Phosphor never decorates. Oxblood never decorates. If it isn't live data it is
not phosphor; if it isn't growth it is not oxblood. Brass does everything else.

## Rollout (each step: build green → boot smoke → screenshot critique → commit)
- D1 tokens.css palette+type swap + index.html fonts (re-skins every screen) ✅→
- D2 home: the trace unit + marginalia treatment for Mirror/smart-floor
- D3a chapter-rule buttons ✅ June 2 (Button.jsx primary/secondary -> top+bottom rules, serif labels, no box; hover = glow not border; regression-shot on home + Settings) → D3b ✅ June 2: the dialog IS the manuscript — user turns serif italic 17px FULL INK (were 13px dim sans: the user's own words were the most demoted text in their own practice — inverted), AI main text already serif cream (kept), AI question serif italic, shared .sf-textarea = the writer's hand (serif italic 18px). Screenshot-proven on a mocked full dialog.
- D4 ✅ June 2: GrowthArbor.jsx on Roadmap + My Progress — every branch EARNED (one per watch-list pattern by age along the trunk, length by encounter evidence; one per graduated baseline), oxblood + buds ONLY on items active in the last 7 days, deterministic layout (same practice = same specimen), zero items → zero arbor ('the first branch is earned, not drawn in advance'). Proven 4/4 + zero-state + boot.
- D5 ✅ June 2: swept Paywall/FAQ/Crisis/Library/Settings (all clean on tokens — Paywall already reads the system: Fraunces + serif feature list). Nits killed: ONE-RULE-PER-ROW principle (Reframe: Send keeps the chapter rule, I'm-done goes ghost — adjacent rules read fragmented); Quick Breathe pill -> ruled tag (brass top/bottom rules, 2px radius — the floating valve speaks the system). ROLLOUT D1-D5 — see honest correction below.


## D5 HONEST CORRECTION (June 2026)
The original D5 commit claimed Paywall/FAQ/Crisis/Library/Settings all swept
clean. That was only partly true: Paywall, FAQ, and Library were verified by
eyes here and ARE clean (serif headlines, hairline rules, framing-law copy
intact). But the CRISIS screen was screenshotted and never VIEWED — it shipped
as a wall of stock bone-filled slabs, off the manuscript system entirely. This
is the same shortcut the whole rebuild was called out for. Fixed honestly: the
crisis actions keep their unmissable one-tap weight (functionally required —
you must not miss a crisis line) but now render in the system's OWN materials —
warm elevated ground, full brass rule, brass serif label — instead of pale
generic blocks. Eyes confirmed on every screen this time.
ROLLOUT NOW GENUINELY COMPLETE D1-D5.


## PALETTE CHANGE — INK & BONE (June 15 2026, Arlin's call)
The original Folio palette (warm umber ground #221C15 / #2A231A, cream text
#ECE3D0, brass #C9A45C) was rejected on the live walk: the warm browns read
muddy and dated, not elite — "does not read high-end prestige." STRUCTURE
UNCHANGED — every D1-D5 decision (Fraunces manuscript type, chapter-rule
buttons, trace line, growth arbor, marginalia voice, work-block layout) is
intact; this was a pure VALUE swap, possible because the palette is fully
tokenized (zero hardcoded color literals in components — verified).
New ground: true cool charcoal — deep #0F0F10, elev #1E1E20, elev-2 #161617
(no brown). Text: bone-white #EDEAE3 (rgba base 237,234,227). Accent: muted
gold #C2A878 (cooled from the brassy brown-gold to read gold-on-graphite).
Sworn accents preserved in meaning: live/phosphor #6FE0CA (cooled a hair),
growth/oxblood -> cooler clay #B5654A. State colors de-warmed (sage #88A882,
clay #C88A6A, cool gray #9C9C9E). Verified by eyes on home, work-turn, and
crisis screens — the structure now reads as the elite manuscript it was
designed to be, on a ground that doesn't undercut it.
