import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import InstrumentRunner from "./InstrumentRunner.jsx";
import CDQUEST, { score as cdquestScore } from "../lib/instruments/cdquest.js";
import SRIS, { score as srisScore } from "../lib/instruments/sris.js";
import ERQ, { score as erqScore } from "../lib/instruments/erq.js";
import MAIA2, { score as maia2Score } from "../lib/instruments/maia2.js";
import IRI, { score as iriScore } from "../lib/instruments/iri.js";
import MCQ30, { score as mcq30Score } from "../lib/instruments/mcq30.js";

/**
 * Library — the curated-knowledge surface, reached from the Home footer.
 *
 * Phase 5 sub-item #4, build Step 5c. The locked architecture places the
 * Workshop as a SECTION of the Library ("Workshop section of Library,
 * alongside the Plain-Language Neuroscience cards" — MCQ-30 spec). This is
 * the thin container that makes that surface exist: today its one live
 * section is the Workshop. The curated-knowledge / neuroscience cards are a
 * separate, not-yet-started workstream (Master Todo: "Library content") and
 * are intentionally NOT built or stubbed here — and NOT shown as "coming,"
 * per the no-deferred-framing rule. They join this screen when their
 * workstream ships.
 *
 * Workshop registry: each runnable instrument adds one entry. Only
 * instruments with a built definition + scorer appear; the other six locked
 * specs (MCQ-30, SRIS, ERQ, MAIA-2, IRI, DOSPERT) join as their modules
 * build. This is build sequencing, not deferral.
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
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
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

      {/* ── Workshop section ── */}
      <div style={{ marginTop: "var(--sf-space-32)" }}>
        <MonoLabel
          size="xs"
          tone="faint"
          style={{ display: "block", marginBottom: "var(--sf-space-8)" }}
        >
          Workshop
        </MonoLabel>
        <p style={sectionLeadStyle}>
          Short, structured takes that show how your mind works under pressure. No scores, no
          judgment — take one whenever you want a closer look.
        </p>

        {INSTRUMENTS.map(({ id, instrument }) => (
          <InstrumentRow
            key={id}
            name={instrument.name}
            subtitle={instrument.subtitle}
            estMinutes={instrument.estMinutes}
            onTake={() => setActiveId(id)}
          />
        ))}
      </div>

      {/* Curated-knowledge / neuroscience cards: separate not-yet-started
          workstream (Master Todo · Library content). They join here when
          built — not stubbed, not shown as "coming," per no-deferred-framing. */}
    </main>
  );
}

/**
 * InstrumentRow — a tappable Workshop instrument: serif name + est-minutes,
 * subtitle below, faint arrow. Whole row is the tap target (ProgressEntry idiom).
 */
function InstrumentRow({ name, subtitle, estMinutes, onTake }) {
  return (
    <button
      type="button"
      onClick={onTake}
      aria-label={`Take ${name}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--sf-space-16)",
        width: "100%",
        textAlign: "left",
        background: "transparent",
        border: "none",
        borderBottom: "0.5px solid var(--sf-border-quiet)",
        padding: "var(--sf-space-16) 0",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "var(--sf-space-12)",
            flexWrap: "wrap",
            marginBottom: "var(--sf-space-4)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--sf-font-serif)",
              fontSize: "18px",
              fontWeight: 400,
              color: "var(--sf-text-primary)",
              lineHeight: 1.3,
            }}
          >
            {name}
          </span>
          {estMinutes ? (
            <span
              style={{
                fontFamily: "var(--sf-font-mono)",
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--sf-text-faint)",
                whiteSpace: "nowrap",
              }}
            >
              ~{estMinutes} min
            </span>
          ) : null}
        </span>
        {subtitle ? (
          <span
            style={{
              display: "block",
              fontFamily: "var(--sf-font-sans)",
              fontSize: "14px",
              lineHeight: 1.5,
              color: "var(--sf-text-faint)",
            }}
          >
            {subtitle}
          </span>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        style={{ color: "var(--sf-text-faint)", fontSize: "16px", lineHeight: 1, flexShrink: 0 }}
      >
        →
      </span>
    </button>
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

const sectionLeadStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "15px",
  lineHeight: 1.5,
  color: "var(--sf-text-faint)",
  margin: "0 0 var(--sf-space-16)",
};
