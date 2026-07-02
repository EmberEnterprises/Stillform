import React from "react";
import MonoLabel from "./MonoLabel.jsx";

/**
 * ProofMoment — the Felt Layer's designed delivery (F1). One quiet editorial
 * event: a labeled, hairline-framed card that leads the home composition the
 * day one of the four firsts becomes true. Shown once ever per moment; the
 * lib enforces once-per-day; Step Out outranks it (wired in SmartScreen).
 *
 * Restraint idiom: Cormorant 300, modest sizes, brass hairline — an event by
 * COMPOSITION, not by size or noise. No buttons to "claim" anything; one
 * acknowledgment that dismisses. FIRST-PASS COPY — Arlin's voice to set.
 *
 * @param {{id:string, label?:string, text?:string}} moment
 * @param {function(): void} onAcknowledge
 * @param {function(string): void} [onNavigate] — optional deep link
 */

const COPY = {
  "first-finding": (m) => ({
    kicker: "A first",
    line: (
      <>
        The record found something, and you confirmed it: <em>{m.label}</em>. Not a guess — arithmetic
        on your own logged history, standing only because you said it lands. This is the practice
        starting to know you in your own words.
      </>
    ),
    dest: "my-progress",
  }),
  "first-prediction": (m) => ({
    kicker: "A first",
    line: (
      <>
        You braced for something — <em>{m.text}</em> — and it didn&rsquo;t happen. That gap between
        the forecast and the day is now on your record. Watch it: it&rsquo;s the most honest measure
        of a mind recalibrating.
      </>
    ),
    dest: "prediction-mirror",
  }),
  "first-quiet": (m) => ({
    kicker: "A first",
    line: (
      <>
        Something you named — <em>{m.label}</em> — has gone quiet. It kept not-showing-up across a
        long stretch of real practice, and the record noticed. Quiet isn&rsquo;t gone. But it is
        different, and it&rsquo;s yours.
      </>
    ),
    dest: "my-progress",
  }),
  "first-season": () => ({
    kicker: "A first",
    line: (
      <>
        Three months of practice are now on record — enough for the app to write your first season
        back to you: what you did, what moved, what went quiet. It&rsquo;s waiting in My Progress,
        under <em>Read the season</em>.
      </>
    ),
    dest: "season-review",
  }),
};

export default function ProofMoment({ moment, onAcknowledge, onNavigate }) {
  if (!moment || !COPY[moment.id]) return null;
  const c = COPY[moment.id](moment);

  return (
    <section
      aria-label="A first in your practice"
      style={{
        border: "0.5px solid var(--sf-accent-line)",
        background: "var(--sf-accent-glow)",
        padding: "var(--sf-space-24)",
        marginBottom: "var(--sf-space-32)",
      }}
    >
      <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-12)" }}>
        {c.kicker}
      </MonoLabel>
      <p
        style={{
          fontFamily: "var(--sf-font-serif)",
          fontWeight: 300,
          fontSize: "16px",
          lineHeight: 1.7,
          color: "var(--sf-text-primary)",
          margin: 0,
        }}
      >
        {c.line}
      </p>
      <div style={{ display: "flex", gap: "var(--sf-space-16)", marginTop: "var(--sf-space-16)", alignItems: "center" }}>
        {typeof onNavigate === "function" && c.dest && (
          <button type="button" className="sf-link-quiet" onClick={() => onNavigate(c.dest)}>
            See it
          </button>
        )}
        <button type="button" className="sf-link-quiet" onClick={onAcknowledge}>
          Noted
        </button>
      </div>
    </section>
  );
}
