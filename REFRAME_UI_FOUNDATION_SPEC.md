# REFRAME UI FOUNDATION — Commit 2 Spec
**ARA Embers LLC · v1.0 · Drafted May 13, 2026**

The spec for the next code commit on the Reframe screen. No code touches `src/App.jsx` until Arlin signs off on this spec.

---

## Overview

The Reframe response screen currently pattern-matches every AI-coach app since 2020: serif text in a dark card with a glowing border, a small Save button below, an input bar at the bottom with paperclip / mic / Send, and an action row of pill buttons. The container does the work; the typography does not.

Stillform's framing is metacognition as self-mastery practice — operator-tier, prestige-coded, structurally exposed. The current screen does not convey that. The fix is structural, not decorative: the typography becomes the architecture; the chrome reduces; the user's interaction with the response shifts from receive-and-button-tap to read-and-curate.

**In scope for Commit 2:**
1. Drop the card container around AI responses
2. First sentence as typographic event
3. Action reduction (input row + action row collapse to Reply pill + overflow)
4. Mono for user input, serif for AI output (voice separation in thread)
5. Reply pill collapse during read (folded into Move 3; pulled out for clarity in the spec)

**Out of scope** (next iteration):
- Carrying-forward line as left-margin marginalia
- Long-press individual sentences to save
- State continuity in the Reply pill (chip tag inside the expanded input)
- User-Invented Move Library and ingenuity feature layer (Commit 3)

**Files affected:**
- `src/App.jsx` — CSS block (lines 825-935 area), message rendering (lines 13768-13810), input + action row (lines 13858-14020)

---

## Prestige references

The look we're moving toward, with what each contributes:

- **iA Writer / Substack reading view** — full-screen prose, typography is the architecture, no chrome. Source: how the response itself is contained (or rather, not contained).
- **Things 3** — breathing room, no decorative containers, each element earns its place. Source: spacing rhythm.
- **Linear** — restraint, mono for system metadata, sans for content, no chrome unless functional. Source: voice separation between system and user.
- **Notion / Roam** — content as primary surface, chrome recedes. Source: trust in the content to carry the screen without decoration.
- **iMessage / Substack post composer** — input collapses during reading, expands during composition. Source: the Reply pill interaction.

---

## Move 1 · Drop the card container

### Framing
The current `.message-bubble` (surface bg + 1px border + 10px border-radius + 14px/18px padding) reads as "AI coach card." That's the wellness-app signature. Removing it shifts the screen from "AI delivers content in a card" to "the practice is text on the page." Operator-tier UIs show content; they don't frame content. (Canon §10 — operating rules / brand voice.)

### Science / Design rationale
Chrome around content increases extraneous cognitive load (Sweller 1988). Every visual element competing with the AI's recognition is a microsecond of attention spent on the frame rather than on what was said. For users in vulnerable states — where Section 4 of CANON says empathy needs to land — reducing chrome lets the felt safety of recognition register. (Polyvagal: ventral vagal state requires unobstructed perception; visual noise keeps sympathetic engaged.)

### UI flow change
- Bubble background removed. Text floats on `var(--bg)` (#08080A).
- Border removed.
- Border-radius removed.
- Internal padding reduced — from `14px 18px` to `0` for the bubble itself. Spacing between messages comes from outer margin.
- Avatar circle removed for AI messages. The mode color was being conveyed by the avatar; instead, it migrates to the first-sentence color or a thin left-edge bar (see Move 2).
- Avatar circle for user messages also removed. The mono typography (Move 4) will distinguish user input visually.

### Implementation specifics
- **CSS (line ~899-934):** modify `.message` and `.message-bubble`:
  - `.message` — keep flex/gap, but remove avatar slot logic. New: `padding: 24px 0;` for vertical rhythm. Bottom hairline rule via `border-bottom: 1px solid var(--border-printed);` for visual separation between consecutive AI/user exchanges.
  - `.message-bubble` — strip `background`, `border`, `border-radius`, `padding`. Keep `max-width: 100%`. Remove `color` override (inherit from message).
  - `.message-avatar` — set `display: none` for both AI and user (keep CSS rule for potential future use; just hide).
- **JSX (line 13771-13773):** keep the class names so the cascade applies; remove inline `style={msg.role === "ai" ? { background: mc.aiBubble, borderColor: mc.border } : {}}` since the cascade now handles it. The mode color (`mc.aiBubble`, `mc.border`, `mc.color`) is preserved but applied differently — see Move 2.

### Risks / verification
- **Message separation:** without containers, consecutive messages could visually blur. Verification: phone-test with a 3-turn conversation (user → AI → user → AI). Hairline rule + 24px padding should give enough rhythm. If not, increase padding to 32px.
- **Mode color visibility:** the amber/teal/etc. mode tint was in the bubble background. Without it, mode color must surface elsewhere — see Move 2's first-sentence color.
- **The `distortion` label** (line 13774-13777) — currently shown above the bubble as a 10px mono uppercase tag. Stays; just renders without a card around it. Color stays `mc.color` so mode is still signaled at the top of each AI response.

---

## Move 2 · First sentence as typographic event

### Framing
"Land on it before anything else" — the CALM/CLARITY/HYPE system prompts all instruct the AI to start with attunement. The first sentence is where recognition lives. Typographically weighting it makes the recognition visible at a glance before the rest unfolds. The user sees what was registered without having to read for it. (Canon §1, §4 — the recognition IS the work.)

### Science / Design rationale
Visual hierarchy (Tufte; Bringhurst on typography) — when one element is given typographic weight, the eye lands on it first and uses it as the anchor for everything else. For Reframe responses, the anchor is the recognition. The rest of the response is exposition or invitation; both are easier to read when the anchor is already absorbed.

### UI flow change
- Parse the AI response text client-side on render: split on the first occurrence of `. ` (period-space).
- The first sentence renders at Cormorant Garamond 22px / weight 400 / line-height 1.4 (matches `.t-display-sm`), color `mc.color` (the mode color — amber for calm, varies for clarity/hype). This is the "lead."
- The rest of the response renders at Cormorant Garamond 16px / weight 300 / line-height 1.65 (current AI text style), color `var(--text)`. This is the "body."
- A 12px vertical gap between lead and body.
- The italic emphasis logic (line 13781-13785) continues to work in the body. If the first sentence itself contains a `*emphasis*`, it stays italic within the lead at 22px.

### Edge cases
- **No period in response:** if `text.split(/\. /)[0] === text`, render the whole response as lead size (22px). Better to over-weight a single-sentence response than to silently lose the typographic event.
- **Multiple periods early (e.g., abbreviations like "Mr. Smith"):** the split-on-first heuristic will break the lead at the abbreviation. Acceptable for now — the prompts steer the AI away from honorifics, and the cost of a wrong-split is low (lead is short, body is the remainder). Schema change to have AI return `{ lead, body }` separately is deferred to a future iteration if drift shows up in practice.
- **Very long first sentence (>40 words):** still renders at 22px. The visual event is preserved even if the lead wraps.

### Implementation specifics
- **JSX (line 13779-13786):** replace the single Cormorant span with a two-block render:
```jsx
{msg.role === "ai" ? (() => {
  const periodIdx = msg.text.indexOf(". ");
  const hasLead = periodIdx > 0 && periodIdx < msg.text.length - 2;
  const lead = hasLead ? msg.text.slice(0, periodIdx + 1) : msg.text;
  const body = hasLead ? msg.text.slice(periodIdx + 2) : "";
  const renderText = (text) => text.split(/(\*[^*]+\*)/).map((part, j) =>
    part.startsWith("*") && part.endsWith("*")
      ? <em key={j} style={{ fontStyle: "italic", color: mc.color }}>{part.slice(1, -1)}</em>
      : <span key={j}>{part}</span>
  );
  return (
    <>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 22, fontWeight: 400, lineHeight: 1.4,
        color: mc.color, marginBottom: body ? 12 : 0
      }}>
        {renderText(lead)}
      </div>
      {body && (
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 16, fontWeight: 300, lineHeight: 1.65,
          letterSpacing: "0.01em", color: "var(--text)"
        }}>
          {renderText(body)}
        </div>
      )}
    </>
  );
})() : (
  // ... user rendering — see Move 4
)}
```

### Risks / verification
- **Mode color readability on dark bg:** amber (#B8862B) is a known good against #08080A. Other mode colors need spot-check on phone (clarity/hype variants stored in `mc.color`).
- **Lead too dominant:** 22px Cormorant 400 vs 16px Cormorant 300 is a roughly 1.4x size jump. Should feel weighted, not overwhelming. Phone-test for "does the lead pull attention without dominating?"
- **Italic emphasis in lead:** the `*word*` syntax should still render italic. Verify on a response containing `*emphasis*` in the first sentence.

---

## Move 3 · Action reduction (Reply pill + overflow)

### Framing
The current screen has eleven affordances visible simultaneously: paperclip, mic, Send, Done for now, Start new, Quick Breathe (floating), Save this (per AI message), "I want a different response," Crisis resources, Back, plus the textarea itself. That's a control panel, not a thinking tool. Operator-tier UIs hide controls until needed (Linear's command palette, Things 3's minimal toolbar). The reduction signals trust in the user to engage when they want to engage. (Canon §10 — no chrome unless functional.)

### Science / Design rationale
Hick's Law — decision time scales logarithmically with the number of choices. For users in vulnerable states (Canon §4), every visible option is a microsecond of cognitive overhead. Reducing visible affordances to the minimum needed for the current action lets the user receive what's on the screen without parsing the chrome.

### UI flow change

**Primary affordances (always visible):**
- **Reply pill** — single thin pill at the bottom of the screen, ~44px tall, full-width minus 32px side margin. Reads "Reply ↑" in mono. Tap to expand into the full textarea + paperclip + mic + Send (current input row).
- **Save this** — stays inline with each AI message. Visual treatment unchanged for Commit 2 (small DM Sans 11px text-muted button below each AI message). Future iteration may shift to long-press-to-save.

**Overflow (hidden behind ••• icon at top-right of screen):**
- Done for now
- Start new
- "I want a different response"
- Crisis resources
- Back

**Quick Breathe** stays as the floating draggable pill (separate; already its own surface).

### Reply pill states
- **Collapsed (default after AI response renders):** thin pill, mono "Reply ↑" text, amber-dim border, surface background. Position: fixed bottom, 16px from edge, 32px side margin.
- **Expanded (after tap):** smoothly slides up into the full input row (textarea + paperclip + mic + Send). Same controls as today, just hidden until invoked.
- **Auto-collapse:** when user sends a message AND the AI's response finishes rendering, the pill auto-collapses again. Manual collapse via tapping outside the input or via a small × in the expanded state.
- **Active typing:** stays expanded as long as `input.length > 0`. Doesn't collapse mid-type.

### Animation
- Collapse: `transform: translateY(0)` → `translateY(calc(100% - 44px))` over 200ms with `cubic-bezier(0.4, 0, 0.2, 1)` (the existing `--ease-prestige` ease).
- Expand: reverse, 240ms.
- No opacity fade; pure translate. Opacity-fades read as cheap; translate reads as physical.

### Overflow menu
- Icon: `•••` (three dots) at top-right of the Reframe screen header, 24px tap target, text-dim color.
- Tap opens a sheet from the top (slide down 280ms) listing: Done for now, Start new, I want a different response, Crisis resources, Back. Each row is 48px tall, full-width tap target, DM Sans 15px text-dim, with a 1px border-printed separator between rows.
- Tap outside dismisses the sheet (240ms slide up).

### Implementation specifics
- **CSS:** add `.reply-pill` and `.reply-pill-expanded` states. Add `.overflow-menu` sheet styles.
- **JSX (line 13858-14020):** wrap the current input + action row in a conditional render. Default state: render the `.reply-pill`. Expanded state: render the existing textarea + paperclip + mic + Send (current code). Add overflow icon to the Reframe screen header (location TBD — likely near the existing "Carrying forward · MIXED" line).
- **State:** add `const [replyExpanded, setReplyExpanded] = useState(false);` and `const [overflowOpen, setOverflowOpen] = useState(false);`. Toggle `replyExpanded` on pill tap, on Send (back to collapsed after AI responds), on outside-tap.
- **Auto-expand on first render:** when `messages.length === 0` (fresh session), pill should be expanded by default so the user can start typing immediately. Only collapses after the first AI response renders.

### Risks / verification
- **Discoverability:** users might not realize the pill expands. Mitigation: the "↑" glyph plus subtle bounce animation on first appearance (single bounce, 600ms, then static).
- **Accessibility:** the overflow icon must have `aria-label="More options"`. The pill must have `aria-label="Reply to the AI"` when collapsed.
- **Phone-test priority:** can the user actually find Reply when they want to respond? Can they find Done for now when they want to exit? Verify both paths in a 2-minute walk-through.

---

## Move 4 · Mono for user, serif for AI (voice separation)

### Framing
The user is the operator; the AI is the practice partner. Currently they're typographically indistinguishable except for which side of the screen they appear on. Mono for user input renders the user as the one issuing the command-line — their words have weight, structure, intent. Serif for AI keeps the reflection register. This is operator-tier signaling at the typographic level. (Canon §1, §7 — user as architect, AI as scaffold.)

### Science / Design rationale
Voice separation through typography (Bringhurst; Tschichold) is a long-running convention in editorial design — interviewer in roman, subject in italic; or speaker in caps, narrator in lowercase. The eye uses font shifts as voice cues without conscious parsing. For Stillform, this reinforces that the user is doing the work; the AI is responding to the work.

### UI flow change
- User message text renders in IBM Plex Mono 14px / weight 400 / line-height 1.6 / letter-spacing 0.02em.
- Color: `var(--text-dim)` (a touch lighter than the AI's text-cream — the user's voice is more present than the AI's reflection, but visually slightly less weighted because the AI's content is what the user is processing).
- AI text stays Cormorant Garamond (Move 2's lead/body split).
- Image attachment indicator (line 13791-13793) — keep as-is (already mono).

### Implementation specifics
- **JSX (line 13787-13795):** replace the inner `<div>{msg.text}</div>` with a Plex Mono styled block:
```jsx
<div style={{
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 14, fontWeight: 400, lineHeight: 1.6,
  letterSpacing: "0.02em", color: "var(--text-dim)"
}}>
  {msg.text}
</div>
```

### Risks / verification
- **Readability of mono at length:** Plex Mono at 14px is comfortable for short paragraphs but long user messages (>200 words) may feel dense. Verification: phone-test with a 3-paragraph user vent. If readability degrades, bump letter-spacing to 0.025em or font-size to 15px.
- **Letter-spacing harmony:** existing mono in the app uses 0.06em / 0.12em / 0.16em for uppercase microtype. The user-input mono is sentence-case at 0.02em — slightly looser than default mono but tighter than the microtype. Verify it reads as "input" not "system label."

---

## Move 5 · Reply pill collapse during read (folded into Move 3)

Already specified in Move 3 above. Pulled out here for the audit trail since it was originally a separate item in the earlier scoping discussion. The behavior — input collapses to a thin pill while user reads the AI response, expands on tap or fresh-session — is part of Move 3's overall action reduction.

---

## Implementation order

1. **CSS first** — update `.message`, `.message-bubble`, `.message-avatar`, add `.reply-pill` + states, add `.overflow-menu` + states. (~20 lines changed, ~40 lines added.)
2. **JSX — message rendering** — replace the single Cormorant span with the lead/body split for AI; switch user input to mono. (~30 lines changed.)
3. **JSX — Reply pill + overflow** — wrap existing input/action row in conditional render, add Reply pill component, add overflow icon + sheet. (~80 lines added.)
4. **State + handlers** — `replyExpanded`, `overflowOpen`, transition logic. (~20 lines added.)
5. **Verification pass** — read entire ReframeTool function end-to-end as the user would, simulating a 3-turn conversation. Note anything that feels off in the read-through.

Total scope estimate: ~150 lines changed/added in App.jsx. No new files. No schema changes. No SYNC_KEY additions.

---

## Verification checklist (before commit)

Per audit philosophy Standing Requirement — Framing + Science + UI Flow:

**Framing audit (Layer 0):**
- [ ] No banned framings re-introduced (regulation, wellness, etc.)
- [ ] Voice separation (mono user, serif AI) reinforces operator-tier framing per Canon §1
- [ ] Empathy register still lands — first-sentence weighting + dropped chrome supports felt safety per Canon §4

**Code hygiene (Layer 2):**
- [ ] `node -c src/App.jsx` parses (well — JSX needs a build step; verify `npm run build` is green)
- [ ] `node scripts/ship-preflight.mjs` is green (59 SYNC_KEYS intact)

**Behavior (Layer 3):**
- [ ] Reply pill expands on tap, collapses on send + AI response render
- [ ] Overflow icon opens sheet; all five options accessible; Back works
- [ ] First-sentence parsing handles: normal response, no-period response, abbreviation-bearing response, italic-emphasis-in-lead response

**Voice + brand (Layer 4):**
- [ ] User mono reads as input voice, not as system label
- [ ] AI lead + body reads as one statement, not two unrelated blocks
- [ ] Chrome reduction reads as restraint, not as missing UI

**Visual coherence (Layer 5):**
- [ ] Phone screenshot of: fresh session, mid-conversation (3 messages each side), with overflow open, with Reply expanded.
- [ ] All five screenshots show consistent typography rhythm, no visual orphans, no broken layouts.

---

## Open questions for sign-off

1. **First-sentence color:** spec says `mc.color` (mode color — amber for calm). Alternative: keep first sentence in `var(--text-cream)` and let the mode-color signal stay on the distortion label only. Either reads as prestige; mode-color is bolder. Default: spec as written. Override if you want a different read.

2. **Avatar removal — total or just for AI?** Spec says both. User-side avatar (the ● dot) was minimal anyway. Keeping just the user-side avatar might soften the chrome reduction slightly. Default: remove both. Override if you want a single-side avatar.

3. **Save this — visual change in Commit 2 or defer?** Spec defers the visual change of Save (long-press-to-save is in next iteration). For Commit 2, Save stays as the small DM Sans button under each AI message. Confirm this is fine.

4. **Reply pill first-render state:** spec says expanded by default when `messages.length === 0` so user can start typing. Collapses after first AI response. Override if you want the pill always collapsed by default.

---

## Out of scope (Commit 3 and beyond)

- **User-Invented Move Library** — new artifact surface for what users invent (separate from AI templates). Commit 3.
- **State-aware generative prompt at Reframe close** — only in Move mode, never in Presence mode. Asks "what's a move you haven't tried?" Commit 3.
- **Long-press to save individual sentences** — replaces per-response Save button. Future commit.
- **Carrying-forward line as left-margin marginalia** — operator-tier marginalia layout. Future commit.
- **State continuity in Reply pill** — chip tag inside expanded input showing carried-forward feel-state. Future commit.

---

*ARA Embers LLC · Reframe UI Foundation Spec · May 13, 2026*
