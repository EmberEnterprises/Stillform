# Stillform — Tester Guide
**May 2026 · ARA Embers LLC**

Thank you for testing Stillform. This guide tells you what to try, what to expect, and how to give feedback that helps the build move forward.

The app is at **stillformapp.com**. It works in any browser; you can also add it to your home screen.

---

## What you'll be testing

Stillform is a metacognition practice — a structured way to build a more granular understanding of how you process your own experience. The practice has multiple surfaces (morning check-in, in-the-moment reframes, end-of-day wrap, body work). Over time, an AI layer reviews your pattern signal and proposes updates to your profile (triggers you keep encountering, anchors that work for you, capacity you've built).

You don't need to "use it right" — your real reactions to the surfaces are the data we want. Confusion is a signal. Friction is a signal. So is something that lands.

---

## Day 1 — Setup and orientation

1. **Open the app** at stillformapp.com (or your install).
2. **Complete the introduction**, then the **calibration assessment**. The calibration is the moment where the app captures your baseline — it doesn't have your context yet, so it asks a series of structured questions to seed your profile.
3. **Skim the home screen.** The main hero card is the spine of the practice. Different beats render in it through the day (morning, main, end-of-day, wind-down).

**Time to allow:** 15–25 minutes for setup + a first look around.

**Watch for in particular:**
- Does the calibration feel useful or like a hoop?
- After calibration, what shows up next? Does it make sense?
- Anything that feels unclear, off-brand, or unexplained.

---

## Day 1–2 — The practice surfaces

Try at least one of each:

- **Morning check-in** (top of the day): a brief beat that captures where you're starting.
- **Reframe** (any time): an AI-assisted session you start when something is loud. You bring the situation, the AI structures the work, you end with a named takeaway.
- **Breathe & ground / body scan**: tools that exist to cut noise so the metacognitive work can land — not the product itself, but functional pieces.
- **End-of-day wrap**: a brief beat that captures what you caught and what got past you. Do this at least twice during testing — it triggers part of the AI mediation flow (more below).

**Watch for in particular:**
- AI reframe quality: does it actually help, or feel generic?
- Friction in starting or finishing a surface
- Anything that feels off-voice (apology language, generic motivational lines, anything that sounds like a wellness app)

---

## Day 2–3 — The AI mediation layer

This is the newest piece of the build. After you've done **at least 3 reframes and at least 2 end-of-day wraps**, the AI reviews your accumulated signal and may propose updates to your profile: a new trigger to watch, a habit anchor that's working for you, or a graduation of your capacity baseline.

**Where to find proposals:** the journey hero card shows a notification when proposals exist. Tap it to go to **My Progress** → top section is **AI Proposals**.

Each proposal shows:
- What the AI is proposing to change
- Its full reasoning (read this — the reasoning is the point, not just the conclusion)
- The evidence it drew from (recent reframes, EODs, check-ins)
- **Approve** or **Reject** buttons

If you reject, you can optionally tell the AI why. That feedback helps it calibrate.

**Important notes:**
- The AI **won't** propose anything until you have ≥3 reframes + ≥2 EODs. New testers see no proposals on day 1. This is by design.
- Proposals fire **after EOD save** — no other trigger right now. If you never do an EOD, you'll never see proposals.
- You can only see proposals once they exist. The notification on the journey card is your discovery surface.

**Watch for in particular:**
- Does the reasoning sound like the AI actually read your sessions, or like a generic template?
- Are the proposals at the right level of specificity?
- Does the approve/reject flow feel like real ownership, or like rubber-stamping?

---

## Day 3+ — The Change History viewer

Below the proposals queue in My Progress is a **Change history** section. Open it to see every mutation to your profile — manual edits, calibration seeds, AI-mediated changes — with timestamp, source (AI proposal vs manual), and the AI's reasoning preserved verbatim where applicable.

**Why this exists:** so you can answer "why does my profile say this?" at any moment. The audit trail is part of the product.

**Watch for in particular:**
- Anything that looks wrong in your history
- Reasoning that doesn't match what actually happened in your session
- Entries that feel like they should be in history but aren't

---

## Known things in progress (not bugs)

These are deliberately incomplete during testing and don't need feedback:

- **Methods** (user + AI co-authored protocols for situations) — not built yet.
- **Library** (curated external knowledge surface) — not built yet.
- **Side panel** (granular named-things list) — not built yet.
- **Manual "refresh AI insights" button** — intentionally absent. The post-EOD trigger is the rhythm.
- **Audit history** for manual edits to anchors and capacity baseline before May 15, 2026 — entries from before that date won't appear because the audit hooks didn't exist yet. New edits going forward will appear.

---

## How to give feedback

Two channels:

1. **In-app feedback form.** Settings → UAT Feedback. Pick a category, write the note, submit. This goes directly to Arlin.
2. **Email:** ARAembersllc@proton.me

**What's most useful:**
- Specific moments where something felt off (which screen, what you tapped, what you expected vs got)
- Voice / tone moments that sounded wrong
- Friction in starting or completing a flow
- AI reframe / proposal quality observations
- Anything that made you stop using the app

**What's less useful:**
- "I liked it" (we want specificity)
- Feature requests for new things (the build has scope already; we want signal on what's there)

---

## A note on the subscription screen

You may hit a subscription page early in the flow. **This is being reworked.** A previous tester pointed out it appears before you've had a chance to actually use the app, and lacks framing for what you'd be paying for. Both observations are correct. Treat the subscription page as not-yet-final UX; it doesn't reflect the eventual flow.

---

## Thank you

You're testing the product mid-build, which means you're catching things while they can still be fixed. Every observation lands somewhere useful.

— Arlin / ARA Embers LLC
