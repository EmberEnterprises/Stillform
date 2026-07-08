import React from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import { getCapacitiesSummary, hasAnyResult, getGrowthRead, getRetakeInvitation } from "../lib/capacitiesProfile.js";

/**
 * CapacitiesMirror — the Bias Profile's CAPACITIES surface (Step 3b).
 *
 * Reads the interpretation-agnostic 3a store (`getCapacitiesSummary`) and
 * reflects back the four capacities Stillform trains, in loop order:
 * Sense → Settle → See yourself → See others.
 *
 * 2026-07-01 (longitudinal spine, Arlin's go): all four capacity instruments
 * (maia2/erq/sris/iri) are BUILT and live in the Workshop — the header note
 * below about "no instrument yet" was stale and is corrected. This surface now
 * also renders the GROWTH DELTA (what moved between baseline and latest —
 * reading titles + facet-level word shifts, never numbers) and the season
 * re-take invitation (>=90 days since the last take; invites only, never
 * auto-runs). First-pass copy — Arlin's voice to set.
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
        {summary.map(({ capacity, taken, takeCount, first, latest }) => {
          // Reflect the read back — not just that a take happened. reading.{title,body}
          // per the capacity result contract; guarded (results may be null). Once
          // measured, the user's own read supersedes the generic framing.
          const lr = latest?.results?.reading;
          const fr = first?.results?.reading;
          const moved = takeCount > 1 && fr?.key && lr?.key && fr.key !== lr.key;
          const measureLine =
            takeCount <= 1
              ? `Measured ${formatDate(latest.takenAt)}`
              : moved
              ? `Measured ${takeCount}× · the read has moved since ${formatDate(first.takenAt)}`
              : `Measured ${takeCount}× · consistent since ${formatDate(first.takenAt)}`;
          return (
            <div
              key={capacity.id}
              style={{ padding: "var(--sf-space-24) 0", borderBottom: "0.5px solid var(--sf-border-quiet)" }}
            >
              <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-8)" }}>
                {capacity.loopLayer}
              </MonoLabel>

              <p style={titleStyle}>{capacity.label}</p>

              {taken && lr?.body ? (
                <>
                  {lr.title && <p style={readingTitleStyle}>{lr.title}</p>}
                  <p style={readingBodyStyle}>{lr.body}</p>
                  <p style={measureStyle}>{measureLine}</p>
                  {/* Growth delta (2026-07-01): WHAT moved, not just that it did.
                      Qualitative per framing law — titles + facet words, no numbers. */}
                  {(() => {
                    let g = null;
                    try { g = getGrowthRead(capacity.instrument); } catch { g = null; }
                    if (!g || (!g.moved && g.facetShifts.length === 0)) return null;
                    return (
                      <p style={growthStyle}>
                        {g.moved && g.from.title
                          ? `When first measured this read as \u201c${g.from.title.toLowerCase()}\u201d \u2014 it doesn\u2019t anymore.`
                          : null}
                        {g.facetShifts.length > 0 && (
                          <>
                            {g.moved && g.from.title ? " " : ""}
                            {g.facetShifts
                              .map((s) => `${s.label} has moved ${s.from} \u2192 ${s.to}`)
                              .join("; ")}
                            {"."}
                          </>
                        )}
                      </p>
                    );
                  })()}
                  {/* Season re-take invitation (2026-07-01): invites only, never
                      auto-runs. Self-gating on >=90 days since the last take. */}
                  {(() => {
                    let inv = null;
                    try { inv = getRetakeInvitation(capacity.instrument); } catch { inv = null; }
                    if (!inv) return null;
                    return (
                      <p style={inviteStyle}>
                        It&rsquo;s been a season since this was measured. A fresh read &mdash; from
                        the Workshop, when you want it &mdash; is how the mirror stays honest.
                      </p>
                    );
                  })()}
                </>
              ) : taken ? (
                <>
                  <p style={framingStyle}>{CAPACITY_FRAMING[capacity.id]}</p>
                  <p style={measureStyle}>Measured {takeCount}×</p>
                </>
              ) : (
                <>
                  <p style={framingStyle}>{CAPACITY_FRAMING[capacity.id]}</p>
                  <p style={emptyStyle}>Not yet measured — its check is in the Workshop, when you want it.</p>
                </>
              )}
            </div>
          );
        })}
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
  fontWeight: 300,
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

const readingTitleStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "16px",
  fontWeight: 300,
  color: "var(--sf-text-cream)",
  lineHeight: 1.4,
  margin: "0 0 var(--sf-space-8)",
};

const readingBodyStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "15px",
  lineHeight: 1.55,
  color: "var(--sf-text-quiet)",
  margin: 0,
};

const measureStyle = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "11px",
  letterSpacing: "0.04em",
  color: "var(--sf-text-primary)",
  margin: "var(--sf-space-12) 0 0",
};

// Growth delta — the quiet "what moved" line. Serif, faint, no numbers ever.
const growthStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontWeight: 300,
  fontSize: "14px",
  lineHeight: 1.6,
  color: "var(--sf-text-secondary)",
  margin: "var(--sf-space-8) 0 0",
};

// Season re-take invitation — fainter still; an offer, not a nudge-badge.
const inviteStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontWeight: 300,
  fontStyle: "italic",
  fontSize: "13px",
  lineHeight: 1.6,
  color: "var(--sf-text-faint)",
  margin: "var(--sf-space-8) 0 0",
};

const emptyStyle = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "11px",
  letterSpacing: "0.04em",
  color: "var(--sf-text-faint)",
  margin: "var(--sf-space-12) 0 0",
};
