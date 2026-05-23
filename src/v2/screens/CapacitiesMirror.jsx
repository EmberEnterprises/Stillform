import React from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import { getCapacitiesSummary, hasAnyResult } from "../lib/capacitiesProfile.js";

/**
 * CapacitiesMirror — the Bias Profile's CAPACITIES surface (Step 3b).
 *
 * Reads the interpretation-agnostic 3a store (`getCapacitiesSummary`) and
 * reflects back the four capacities Stillform trains, in loop order:
 * Sense → Settle → See yourself → See others.
 *
 * WHAT THIS BUILDS NOW (and what it deliberately doesn't):
 *   - The mirror surface itself, the four-capacity framing, and the honest
 *     empty state — which is the real state for every current user, because
 *     no capacity instrument (maia2/erq/sris/iri) is built yet. CD-Quest is
 *     the only instrument, and it feeds the pattern-work watch list, not this
 *     surface. So today this screen mostly says "not yet measured."
 *   - A generic baseline→latest growth read (take count + first/latest dates)
 *     for when takes DO exist. It does NOT interpret the inner result object.
 *
 *   The per-subscale nuance (ERQ suppression, IRI Personal Distress, MAIA-2
 *   Not-Worrying, SRIS reflection-without-insight) is intentionally NOT here.
 *   It consumes each instrument's result shape, which no module yet produces;
 *   per the instrument-first reorder (b94a53c) the consumer isn't built ahead
 *   of a concrete producer. Each subscale's nuance ships WITH its instrument
 *   module — sequencing, not deferral. This surface ships now and fills in.
 *
 * @param {function(): void} onExit — back to My Progress
 */

// Concise, accurate framing derived from the 3a capacity→instrument mapping.
// Richer per-spec framing arrives with each instrument module; kept minimal
// here rather than guessing locked-spec copy.
const CAPACITY_FRAMING = {
  sense: "Noticing what your body is doing before it becomes a story — the signal underneath a feeling.",
  settle: "Bringing your system down from activation — the reappraisal move Reframe trains.",
  "see-self": "Turning reflection into actual insight about how you process — not just turning it over.",
  "see-others": "Holding someone else's perspective without losing your own.",
};

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export default function CapacitiesMirror({ onExit }) {
  const summary = getCapacitiesSummary();
  const anyMeasured = hasAnyResult();

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      <EditorialBlock
        label="My Progress"
        headline="Growth mirror"
        headlineSize="md"
        body="The four capacities Stillform trains, in the order the loop runs them. This reflects them back as you do the work — each one fills in once its Workshop instrument is part of your practice."
        rule
      />

      <div style={{ marginTop: "var(--sf-space-32)" }}>
        {summary.map(({ capacity, taken, takeCount, first, latest }) => (
          <div
            key={capacity.id}
            style={{ padding: "var(--sf-space-20) 0", borderBottom: "0.5px solid var(--sf-border-quiet)" }}
          >
            <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-8)" }}>
              {capacity.loopLayer}
            </MonoLabel>

            <p style={titleStyle}>{capacity.label}</p>
            <p style={framingStyle}>{CAPACITY_FRAMING[capacity.id]}</p>

            {taken ? (
              <p style={measureStyle}>
                Measured {takeCount}{takeCount === 1 ? " time" : " times"}
                {first && latest && first !== latest
                  ? ` · baseline ${formatDate(first.takenAt)} → latest ${formatDate(latest.takenAt)}`
                  : latest
                  ? ` · ${formatDate(latest.takenAt)}`
                  : ""}
              </p>
            ) : (
              <p style={emptyStyle}>Not yet measured — its Workshop check arrives with the practice.</p>
            )}
          </div>
        ))}
      </div>

      {!anyMeasured && (
        <p style={{ ...framingStyle, marginTop: "var(--sf-space-24)" }}>
          Nothing measured yet. This isn't a gap to close today — the mirror grows on its own as the
          Workshop instruments come online and you take them.
        </p>
      )}
    </main>
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

const titleStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "18px",
  fontWeight: 400,
  color: "var(--sf-text-primary)",
  lineHeight: 1.3,
  margin: "0 0 var(--sf-space-8)",
};

const framingStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "15px",
  lineHeight: 1.5,
  color: "var(--sf-text-faint)",
  margin: 0,
};

const measureStyle = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "11px",
  letterSpacing: "0.04em",
  color: "var(--sf-text-primary)",
  margin: "var(--sf-space-12) 0 0",
};

const emptyStyle = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "11px",
  letterSpacing: "0.04em",
  color: "var(--sf-text-faint)",
  margin: "var(--sf-space-12) 0 0",
};
