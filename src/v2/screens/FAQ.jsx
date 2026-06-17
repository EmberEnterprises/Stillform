import React from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import HairlineDivider from "../components/HairlineDivider.jsx";

/**
 * FAQ — a plain informational screen that closes the dead-end HomeFooter
 * "FAQ" entry (previously a no-op).
 *
 * REBUILD v1 (scope locked May 30, 2026). Standalone Q&A surface, reached via
 * HomeFooter "FAQ" → onNavigate("faq") → setScreen("faq") in AppV2.
 *
 * COPY STATUS: DRAFT — positioning is Arlin's call, so these answers are a
 * first pass for her to approve or rewrite, not finalized product voice.
 *
 * GUARDRAILS (do not soften):
 *   - Framing-law clean: Stillform is self-mastery via metacognition / sharper
 *     thinking; steadiness is a FELT OUTCOME, never the pitch. NO "regulation,"
 *     "wellness," "calm-down," or "crisis-tool" framing. No positioning by a
 *     "not-X, not-Y" litany.
 *   - Feature-accurate: every answer describes only what the live build does.
 *     No encryption claim. No hard price (pricing is not locked — point to the
 *     subscribe screen). No in-app path that isn't actually wired.
 *   - The crisis/safety answer must carry real, current resources.
 *
 * @param {function(): void} onExit — called when the user taps back to home.
 */
export default function FAQ({ onExit }) {
  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to home" style={BACK_BTN}>
        ← back
      </button>

      <EditorialBlock
        label="FAQ"
        headline="Common questions"
        headlineSize="md"
        body={<>The short version of what Stillform is, how it works, and what happens to your data.</>}
        rule
      />

      {ITEMS.map((item, i) => (
        <React.Fragment key={item.id}>
          <section style={SECTION}>
            <MonoLabel label={`Q · ${String(i + 1).padStart(2, "0")}`} />
            <p style={QUESTION}>{item.q}</p>
            <div style={ANSWER}>{item.a}</div>
          </section>
          {i < ITEMS.length - 1 && <HairlineDivider />}
        </React.Fragment>
      ))}

      <HairlineDivider />
      <section style={{ ...SECTION, marginBottom: "var(--sf-space-32)" }}>
        <p style={FAINT}>
          Still stuck?{" "}
          <a href="mailto:ARAembersllc@proton.me" style={LINK}>
            ARAembersllc@proton.me
          </a>
        </p>
      </section>
    </main>
  );
}

/**
 * DRAFT Q&A. Answers are JSX so contact/crisis links render inline.
 * Reviewed against the framing law and the live build before shipping.
 */
// Style consts live ABOVE ITEMS deliberately: ITEMS is a module-level array
// whose JSX evaluates at import time — referencing a const declared below it
// is a TDZ crash in the production bundle (boot blank-screen, June 2 2026).

const BACK_BTN = {
  background: "transparent",
  border: "none",
  color: "var(--sf-text-faint)",
  fontFamily: "var(--sf-font-mono)",
  fontSize: "11px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  cursor: "pointer",
  padding: "8px 0",
  marginBottom: "var(--sf-space-24)",
  WebkitTapHighlightColor: "transparent",
};

const SECTION = {
  marginTop: "var(--sf-space-32)",
  marginBottom: "var(--sf-space-32)",
};

const QUESTION = {
  fontSize: "17px",
  lineHeight: 1.4,
  fontWeight: 600,
  margin: "8px 0 12px",
};

const ANSWER = {
  fontSize: "15px",
  lineHeight: 1.55,
  margin: 0,
};

const FAINT = {
  color: "var(--sf-text-faint)",
  fontSize: "13px",
  lineHeight: 1.5,
  margin: 0,
};

const LINK = {
  color: "inherit",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
};


const ITEMS = [
  {
    id: "what",
    q: "What is Stillform?",
    a: (
      <>
        A practice for seeing how you think — and thinking more clearly because of it. You move
        through a short, guided sequence; over time it sharpens how you read a situation and what
        you do next. Steadiness is something you feel as a result of the work, not the point of it.
      </>
    ),
  },
  {
    id: "session",
    q: "How does a session work?",
    a: (
      <>
        Open the app and it meets you where the day is — a brief check-in, a guided reframe, and a
        close. You can start a quick breathing reset any time, too. Most sessions take a few minutes.
      </>
    ),
  },
  {
    id: "scope",
    q: "Is Stillform a substitute for professional help?",
    a: (
      <>
        No — it's a self-directed practice, not a substitute for professional care. If you're in
        crisis or thinking about harming yourself, reach out to a professional or a crisis line now.
        In the US you can call or text <strong>988</strong>, or text <strong>HOME</strong> to{" "}
        <strong>741741</strong>.
      </>
    ),
  },
  {
    id: "data",
    q: "Where does my data live? Is it private?",
    a: (
      <>
        Everything you enter stays on your device. The only thing that leaves it is an anonymous
        check that confirms your access — no journal content, nothing personal. You can wipe
        everything from this device any time in Settings.
      </>
    ),
  },
  {
    id: "crisis-summary",
    q: "What is the summary on the Crisis Resources screen?",
    a: (
      <>
        It's an optional button you tap only if you want it. It gathers what you've already
        named in your own words across your practice — the things that have come up most, and
        your own phrasings — into a short, plain summary, so you have somewhere to start if
        you reach out to a crisis line, a clinician, or someone you trust. It's built entirely
        from what you wrote; it never interprets, labels, or diagnoses you, and it stays on your
        device like everything else. You never have to use it, and reaching out without it is
        always enough.
      </>
    ),
  },
  {
    id: "cost",
    q: "What does \u201cgone quiet\u201d mean on my watch list?",
    a: "A pattern you watch is confirmed when it keeps showing up in your sessions. If it then stops appearing across continued practice \u2014 real sessions, over weeks \u2014 it moves to \u201cgone quiet.\u201d That\u2019s observed change, not a cure claim: it reflects your sessions, and if the pattern shows up again it simply moves back. That\u2019s information, not a setback.",
  },
  {
    q: "What does it cost?",
    a: (
      <>
        Stillform is a subscription, with a free tier that stays free — the quick breathing reset and
        the core stabilization tools never sit behind a paywall. You'll see current pricing on the
        subscribe screen.
      </>
    ),
  },
  {
    id: "manage",
    q: "How do I manage or cancel my subscription?",
    a: (
      <>
        Through the billing portal from your subscription provider. If you can't find it, email{" "}
        <a href="mailto:ARAembersllc@proton.me" style={LINK}>
          ARAembersllc@proton.me
        </a>{" "}
        and we'll take care of it.
      </>
    ),
  },
  {
    id: "inactive",
    q: "I paid, but it says my access is inactive.",
    a: (
      <>
        Open Settings and tap “Refresh from server” — that re-checks your subscription. If it still
        looks wrong, email{" "}
        <a href="mailto:ARAembersllc@proton.me" style={LINK}>
          ARAembersllc@proton.me
        </a>{" "}
        and we'll fix it.
      </>
    ),
  },
];
