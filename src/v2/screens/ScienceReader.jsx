import React from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";

/**
 * ScienceReader — reads one entry from the science library (scienceLibrary.js).
 *
 * Shares the Library/home design system (FRAMING/cohesion law): warm aura +
 * grain ground, mono section labels on a drawn brass rule, serif body. Reached
 * from Library's "The Science" list; leaving returns to that list (not home),
 * mirroring how the Workshop's InstrumentRunner returns to the Library.
 *
 * Content (including citations) comes verbatim from scienceLibrary.js, which is
 * sourced faithfully from the Science Sheet. The reader invents nothing.
 *
 * @param {object} entry — a SCIENCE_ENTRIES item {title, oneLiner, whatItDoes, theScience, sources[]}
 * @param {function(): void} onExit — back to the Library list
 */
export default function ScienceReader({ entry, onExit }) {
  if (!entry) {
    // Defensive: never render a blank reader. Bounce back to the list.
    if (typeof onExit === "function") onExit();
    return null;
  }

  return (
    <>
      <div className="sf-home-aura" aria-hidden="true" />
      <div className="sf-home-grain" aria-hidden="true" />
      <main
        className="sf-page"
        style={{ paddingTop: "var(--sf-space-32)", position: "relative", zIndex: 1 }}
      >
        <button type="button" onClick={onExit} aria-label="Back to the library" style={backStyle}>
          ← the science
        </button>

        <EditorialBlock
          label="The Science"
          headline={entry.title}
          headlineSize="md"
          body={entry.oneLiner}
          rule
        />

        <section className="sf-sec">
          <div className="sf-sec-head">
            <span className="sf-sec-head-lbl">What it does</span>
            <div className="sf-sec-rule" />
          </div>
          <p className="sf-sec-lead">{entry.whatItDoes}</p>
        </section>

        <section className="sf-sec">
          <div className="sf-sec-head">
            <span className="sf-sec-head-lbl">The science</span>
            <div className="sf-sec-rule" />
          </div>
          <p className="sf-sec-lead">{entry.theScience}</p>
        </section>

        {Array.isArray(entry.sources) && entry.sources.length ? (
          <section className="sf-sec">
            <div className="sf-sec-head">
              <span className="sf-sec-head-lbl">Sources</span>
              <div className="sf-sec-rule" />
            </div>
            <ul style={sourcesListStyle}>
              {entry.sources.map((s, i) => (
                <li key={i} style={sourceItemStyle}>
                  {s}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
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

const sourcesListStyle = {
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const sourceItemStyle = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "12px",
  lineHeight: 1.6,
  color: "var(--sf-text-faint)",
  paddingLeft: "var(--sf-space-16)",
  textIndent: "calc(-1 * var(--sf-space-16))",
  marginBottom: "var(--sf-space-12)",
};
