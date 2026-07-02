import React, { useEffect } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import { getSeasonReview } from "../lib/seasonReview.js";

/**
 * SeasonReview — the derived look back over the last season of practice
 * (retention batch 2/3). Reachable from My Progress only when the review
 * exists (the entry self-gates); this screen still guards for a direct hit.
 *
 * Framing law: words, never scores. Every section renders only when it has
 * something real; honest absence is silence, not a zero. FIRST-PASS COPY —
 * Arlin's voice to set.
 *
 * @param {function(): void} onExit — back to My Progress
 */
export default function SeasonReview({ onExit }) {
  const review = getSeasonReview();
  useEffect(() => {
    try { window.plausible?.("Season Review Opened"); } catch { /* non-fatal */ }
  }, []);

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      <EditorialBlock
        label="My Progress"
        headline="The season"
        headlineSize="md"
        body="A look back over the last three months of the practice — what you did, what it changed. Drawn from your own record; read against your own past, never anyone else's."
        rule
      />

      {!review ? (
        <p style={bodyStyle}>
          Not enough of a season on record yet. This page writes itself from your practice — it
          will be here once the last three months hold enough work to read honestly.
        </p>
      ) : (
        <div style={{ marginTop: "var(--sf-space-24)" }}>
          <Section label="The work">
            <p style={bodyStyle}>
              {review.practice.sessions} sessions across {review.practice.distinctDays} different
              days. That&rsquo;s the substrate — everything below came out of it.
            </p>
          </Section>

          {review.thoughts.tested > 0 && (
            <Section label="Thoughts tested">
              <p style={bodyStyle}>
                You put {review.thoughts.tested === 1 ? "one thought" : `${review.thoughts.tested} thoughts`} through
                the work.
                {review.thoughts.eased > 0 && (
                  <> {review.thoughts.eased === 1 ? "One" : `${review.thoughts.eased}`} loosened its grip when you looked at it straight.</>
                )}
                {review.thoughts.held > 0 && (
                  <> {review.thoughts.held === 1 ? "One" : `${review.thoughts.held}`} held — which is also information: not every hard thought is a distortion.</>
                )}
              </p>
            </Section>
          )}

          {review.capacitiesMoved.length > 0 && (
            <Section label="What moved">
              {review.capacitiesMoved.map((c) => (
                <p key={c.label} style={bodyStyle}>
                  {c.label}: when the season opened this read as &ldquo;{String(c.fromTitle).toLowerCase()}&rdquo; —
                  it now reads as &ldquo;{String(c.toTitle).toLowerCase()}.&rdquo;
                </p>
              ))}
            </Section>
          )}

          {review.quietTriggers.length > 0 && (
            <Section label="Gone quiet">
              <p style={bodyStyle}>
                {review.quietTriggers.length === 1
                  ? `A trigger you named — \u201c${review.quietTriggers[0]}\u201d — hasn\u2019t fired in a long stretch of practice.`
                  : `${review.quietTriggers.length} triggers you named have stopped firing across a long stretch of practice: ${review.quietTriggers.map((t) => `\u201c${t}\u201d`).join(", ")}.`}
                {" "}Quiet isn&rsquo;t gone — but it is different, and it&rsquo;s yours.
              </p>
            </Section>
          )}

          {(review.named.vulnerabilities + review.named.strengths + review.named.values) > 0 && (
            <Section label="Named this season">
              <p style={bodyStyle}>
                {[
                  review.named.vulnerabilities > 0 &&
                    `${review.named.vulnerabilities} ${review.named.vulnerabilities === 1 ? "vulnerability" : "vulnerabilities"}`,
                  review.named.strengths > 0 &&
                    `${review.named.strengths} ${review.named.strengths === 1 ? "strength" : "strengths"}`,
                  review.named.values > 0 &&
                    `${review.named.values} ${review.named.values === 1 ? "value" : "values"}`,
                ]
                  .filter(Boolean)
                  .join(", ")}{" "}
                — self-knowledge you confirmed in your own words. It stays; it compounds.
              </p>
            </Section>
          )}
        </div>
      )}
    </main>
  );
}

function Section({ label, children }) {
  return (
    <section className="sf-sec" style={{ marginBottom: "var(--sf-space-24)" }}>
      <div className="sf-sec-head">
        <span className="sf-sec-head-lbl">{label}</span>
        <div className="sf-sec-rule" />
      </div>
      {children}
    </section>
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

const bodyStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontWeight: 300,
  fontSize: "15px",
  lineHeight: 1.65,
  color: "var(--sf-text-secondary)",
  margin: "var(--sf-space-8) 0 0",
};
