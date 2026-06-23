import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import InstrumentRunner from "./InstrumentRunner.jsx";
import CDQUEST, { score as cdquestScore } from "../lib/instruments/cdquest.js";
import SRIS, { score as srisScore } from "../lib/instruments/sris.js";
import ERQ, { score as erqScore } from "../lib/instruments/erq.js";
import MAIA2, { score as maia2Score } from "../lib/instruments/maia2.js";
import IRI, { score as iriScore } from "../lib/instruments/iri.js";
import MCQ30, { score as mcq30Score } from "../lib/instruments/mcq30.js";
import DOSPERT, { score as dospertScore } from "../lib/instruments/dospert.js";

/**
 * Library — the curated-knowledge surface, reached from the Home footer.
 *
 * Shares the home design system (FRAMING/cohesion law, June 23 2026): the same
 * warm aura + grain ground, mono section labels sitting on a DRAWN BRASS rule,
 * serif item names, dim-brass meta, and a brass arrow that draws on hover —
 * via the shared .sf-sec* classes in components.css. No page invents its own
 * look; everything is uniform with home.
 *
 * Today its one live section is the Workshop. The curated-knowledge /
 * neuroscience cards are a separate, not-yet-started workstream and are NOT
 * built, stubbed, or shown as "coming" here, per the no-deferred-framing rule.
 * They join this screen as a second section when their workstream ships.
 *
 * Tapping an instrument launches the generic InstrumentRunner in-place;
 * leaving the runner returns to the Library list (not home).
 *
 * @param {function(): void} onExit — back to Home
 */
const INSTRUMENTS = [
  { id: "cdquest", instrument: CDQUEST, scoreFn: cdquestScore },
  { id: "sris", instrument: SRIS, scoreFn: srisScore },
  { id: "erq", instrument: ERQ, scoreFn: erqScore },
  { id: "maia2", instrument: MAIA2, scoreFn: maia2Score },
  { id: "iri", instrument: IRI, scoreFn: iriScore },
  { id: "mcq30", instrument: MCQ30, scoreFn: mcq30Score },
  { id: "dospert", instrument: DOSPERT, scoreFn: dospertScore },
];

export default function Library({ onExit }) {
  const [activeId, setActiveId] = useState(null);

  const active = activeId ? INSTRUMENTS.find((e) => e.id === activeId) : null;
  if (active) {
    return (
      <InstrumentRunner
        instrument={active.instrument}
        scoreFn={active.scoreFn}
        onExit={() => setActiveId(null)}
      />
    );
  }

  return (
    <>
      <div className="sf-home-aura" aria-hidden="true" />
      <div className="sf-home-grain" aria-hidden="true" />
      <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)", position: "relative", zIndex: 1 }}>
        <button type="button" onClick={onExit} aria-label="Back home" style={backStyle}>
          ← back
        </button>

        <EditorialBlock
          label="Library"
          headline="The Library"
          headlineSize="md"
          body="Where you take a closer look — at the shapes your own thinking makes, and the science worth checking it against."
          rule
        />

        <section className="sf-sec">
          <div className="sf-sec-head">
            <span className="sf-sec-head-lbl">Workshop</span>
            <div className="sf-sec-rule" />
          </div>
          <p className="sf-sec-lead">
            Short, structured takes that show how your mind works under pressure. No scores, no
            judgment — take one whenever you want a closer look.
          </p>

          {INSTRUMENTS.map(({ id, instrument }, i) => (
            <button
              key={id}
              type="button"
              className="sf-sec-row"
              aria-label={`Take ${instrument.name}`}
              onClick={() => setActiveId(id)}
            >
              <span className="sf-sec-mark" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="sf-sec-row-main">
                <span className="sf-sec-row-top">
                  <span className="sf-sec-name">{instrument.name}</span>
                  {instrument.estMinutes ? (
                    <span className="sf-sec-meta">~{instrument.estMinutes} min</span>
                  ) : null}
                </span>
                {instrument.subtitle ? <span className="sf-sec-sub">{instrument.subtitle}</span> : null}
              </span>
              <span className="sf-sec-arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </section>
      </main>
    </>
  );
}

const backStyle = {
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
