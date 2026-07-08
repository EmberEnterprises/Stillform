import React, { useState } from "react";
import Button from "../components/Button.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import EditorialBlock from "../components/EditorialBlock.jsx";
import {
  FAIR_QUALITIES,
  getDirections,
  nameDirection,
  removeDirection,
  confirmEvidence,
} from "../lib/becoming.js";

/**
 * Becoming — the evidence-of-self surface (Arlin, 2026-07-08 spec).
 *
 * The user names qualities they're moving toward — DIRECTIONS, never decrees.
 * Evidence accrues under each: concrete moments they confirm ("stayed in the
 * hard conversation Tuesday"), and moments the AI cites in Reframe that they
 * choose to keep. Nothing is ever asserted on their behalf; nothing here says
 * "you are X" (Wood 2009 — bare trait claims backfire; specific evidence
 * closes the belief-gap instead).
 *
 * Fair qualities only: expressed through thought/choice, evidence possible in
 * the record. Appearance and others'-verdict qualities are refused at both
 * the surface and the data layer.
 *
 * @param {function(): void} onExit — back to My Progress
 */
export default function Becoming({ onExit }) {
  const [dirs, setDirs] = useState(() => getDirections());
  const [ownWord, setOwnWord] = useState("");
  const [evidenceFor, setEvidenceFor] = useState(null);
  const [evidenceText, setEvidenceText] = useState("");
  const [note, setNote] = useState(null);

  const refresh = () => setDirs(getDirections());

  const add = (q) => {
    const ok = nameDirection(q);
    setNote(ok ? null : "That one needs the world's verdict — pick a quality your own choices can show.");
    setOwnWord("");
    refresh();
  };

  const keepEvidence = () => {
    if (!evidenceFor) return;
    const ok = confirmEvidence(evidenceFor, evidenceText);
    if (ok) {
      setEvidenceFor(null);
      setEvidenceText("");
      refresh();
    }
  };

  const named = dirs.map((d) => d.quality);
  const available = FAIR_QUALITIES.filter((q) => !named.includes(q));

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <article className="sf-fade-enter" style={{ maxWidth: 560 }}>
        <button type="button" onClick={onExit} aria-label="Back" style={BACK}>← back</button>
        <EditorialBlock
          label="Becoming"
          headline="Who you're moving toward"
          headlineSize="md"
          body="Name a quality you're building — a direction, not a verdict. The record does the rest: real moments where you already acted with it. Not a wish repeated at a mirror; evidence you generated."
          rule
        />

        {/* Named directions + their evidence */}
        {dirs.length > 0 && (
          <section className="sf-sec">
            <div className="sf-sec-head">
              <span className="sf-sec-head-lbl">Your directions</span>
              <div className="sf-sec-rule" />
            </div>
            {dirs.map((d) => (
              <div key={d.quality} style={DIR_BLOCK}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={QUALITY}>{d.quality}</span>
                  <button type="button" className="sf-link-quiet" onClick={() => { removeDirection(d.quality); refresh(); }} aria-label={`Remove ${d.quality}`}>
                    remove
                  </button>
                </div>
                {(d.evidence || []).length > 0 ? (
                  d.evidence.slice(-3).map((e) => (
                    <p key={e.at + e.text.slice(0, 12)} style={EVIDENCE}>· {e.text}</p>
                  ))
                ) : (
                  <p style={EMPTY}>No confirmed moments yet — they'll come from the work, not from wanting.</p>
                )}
                {evidenceFor === d.quality ? (
                  <div style={{ marginTop: "var(--sf-space-8)" }}>
                    <textarea
                      className="sf-textarea"
                      rows={2}
                      value={evidenceText}
                      onChange={(e) => setEvidenceText(e.target.value)}
                      placeholder="The concrete moment, plainly — what you did, when…"
                      aria-label="The moment as evidence"
                    />
                    <div style={{ display: "flex", gap: "var(--sf-space-12)", marginTop: "var(--sf-space-8)" }}>
                      <Button variant="ghost" onClick={keepEvidence} disabled={evidenceText.trim().length < 8}>Keep it</Button>
                      <button type="button" className="sf-link-quiet" onClick={() => { setEvidenceFor(null); setEvidenceText(""); }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button type="button" className="sf-link-quiet" onClick={() => { setEvidenceFor(d.quality); setEvidenceText(""); }} style={{ marginTop: "var(--sf-space-8)" }}>
                    Pin a moment as evidence
                  </button>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Name a new direction */}
        {dirs.length < 5 && (
          <section className="sf-sec">
            <div className="sf-sec-head">
              <span className="sf-sec-head-lbl">Name a direction</span>
              <div className="sf-sec-rule" />
            </div>
            <p className="sf-sec-lead">
              A quality your own thinking and choices can show — courage, patience, restraint.
              If it needs the world's vote, it doesn't belong here.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sf-space-8)" }}>
              {available.map((q) => (
                <button key={q} type="button" style={CHIP} onClick={() => add(q)} aria-label={`Move toward ${q}`}>
                  {q}
                </button>
              ))}
            </div>
            <div style={{ marginTop: "var(--sf-space-16)" }}>
              <textarea
                className="sf-textarea"
                rows={1}
                value={ownWord}
                onChange={(e) => setOwnWord(e.target.value)}
                placeholder="Or your own word for it…"
                aria-label="Your own quality word"
              />
              <div style={{ marginTop: "var(--sf-space-8)" }}>
                <Button variant="ghost" onClick={() => add(ownWord)} disabled={ownWord.trim().length < 3}>
                  Name it
                </Button>
              </div>
            </div>
            {note && <p style={EMPTY}>{note}</p>}
          </section>
        )}
      </article>
    </main>
  );
}

const BACK = {
  background: "transparent", border: "none", color: "var(--sf-text-faint)",
  fontFamily: "var(--sf-font-mono)", fontSize: "11px", letterSpacing: "0.14em",
  textTransform: "uppercase", cursor: "pointer", padding: "8px 0",
  marginBottom: "var(--sf-space-24)", WebkitTapHighlightColor: "transparent",
};
const DIR_BLOCK = {
  borderBottom: "0.5px solid var(--sf-border-hairline)",
  padding: "var(--sf-space-16) 0",
};
const QUALITY = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "18px",
  color: "var(--sf-text-cream)", textTransform: "capitalize",
};
const EVIDENCE = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "14px",
  lineHeight: 1.65, color: "var(--sf-text-secondary)", margin: "var(--sf-space-8) 0 0",
  borderLeft: "0.5px solid var(--sf-accent-line)", paddingLeft: "var(--sf-space-12)",
};
const EMPTY = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontStyle: "italic",
  fontSize: "13px", lineHeight: 1.6, color: "var(--sf-text-faint)", margin: "var(--sf-space-8) 0 0",
};
const CHIP = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "14px",
  color: "var(--sf-text-secondary)", background: "transparent",
  border: "0.5px solid var(--sf-border-hairline)", padding: "8px 14px",
  cursor: "pointer", textTransform: "capitalize",
};
