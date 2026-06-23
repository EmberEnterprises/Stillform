import React, { useState } from "react";
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
const idOf = (it) =>
  it.id || it.q.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function FAQ({ onExit }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(() => new Set());
  const q = query.trim().toLowerCase();
  const filtered = q ? ITEMS.filter((it) => it.q.toLowerCase().includes(q)) : ITEMS;

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Jump chip: auto-expand the target, then smooth-scroll to it once rendered.
  const jump = (id) => {
    setOpen((prev) => new Set(prev).add(id));
    setTimeout(() => {
      try {
        document.getElementById(`faq-q-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch {
        /* non-fatal */
      }
    }, 60);
  };

  return (
    <>
      <div className="sf-home-aura" aria-hidden="true" />
      <div className="sf-home-grain" aria-hidden="true" />
      <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)", position: "relative", zIndex: 1 }}>
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

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search the FAQ"
        aria-label="Search the FAQ"
        style={SEARCH}
      />

      {/* Jump index — tap a question to open it and scroll to it. */}
      {filtered.length > 0 && (
        <div style={CHIPS}>
          {filtered.map((it) => {
            const id = idOf(it);
            return (
              <button key={id} type="button" onClick={() => jump(id)} style={CHIP}>
                {it.q.replace(/\?$/, "")}
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && <p style={NORESULTS}>No questions match that search.</p>}

      {/* Entries — expand/collapse per question. */}
      {filtered.map((it) => {
        const id = idOf(it);
        const isOpen = open.has(id);
        return (
          <div key={id} id={`faq-q-${id}`} style={ENTRY}>
            <button type="button" onClick={() => toggle(id)} aria-expanded={isOpen} style={QBTN}>
              <span aria-hidden="true" style={{ ...CHEV, transform: isOpen ? "rotate(90deg)" : "none" }}>
                ▸
              </span>
              <span style={QTEXT}>{it.q}</span>
            </button>
            {isOpen && <div style={ANSWER}>{it.a}</div>}
          </div>
        );
      })}

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
    </>
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

const SEARCH = {
  width: "100%",
  boxSizing: "border-box",
  background: "var(--sf-ground-elev)",
  border: "1px solid var(--sf-border-hairline)",
  borderRadius: "8px",
  padding: "12px 14px",
  color: "var(--sf-text-primary)",
  fontSize: "14px",
  lineHeight: 1.5,
  outline: "none",
  marginTop: "var(--sf-space-24)",
  marginBottom: "var(--sf-space-20)",
};

const CHIPS = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
  marginBottom: "var(--sf-space-32)",
};

const CHIP = {
  background: "transparent",
  border: "1px solid var(--sf-border-hairline)",
  borderRadius: "999px",
  padding: "6px 11px",
  fontSize: "11px",
  letterSpacing: "0.02em",
  color: "var(--sf-text-faint)",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
};

const NORESULTS = {
  color: "var(--sf-text-faint)",
  fontSize: "13px",
  fontStyle: "italic",
  textAlign: "center",
  padding: "var(--sf-space-32) var(--sf-space-16)",
};

const ENTRY = { borderTop: "1px solid var(--sf-border-hairline)" };

const QBTN = {
  width: "100%",
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  background: "transparent",
  border: "none",
  textAlign: "left",
  padding: "16px 0",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
};

const CHEV = {
  flexShrink: 0,
  marginTop: "3px",
  color: "var(--sf-accent)",
  fontSize: "11px",
  lineHeight: 1,
  transition: "transform var(--sf-motion-default) var(--sf-ease-prestige)",
};

const QTEXT = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "19px",
  fontWeight: 400,
  lineHeight: 1.3,
  color: "var(--sf-text-cream)",
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
