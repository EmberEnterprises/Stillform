import React from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import { getLatestRiskResult, getRiskHistory, hasRiskResult } from "../lib/riskProfile.js";
import DOSPERT from "../lib/instruments/dospert.js";

/**
 * RiskProfileMirror — the Workshop's PROFILE surface (Step 4d).
 *
 * Reflects the recorded DOSPERT shape (riskProfile store, Step 4b) back as a
 * persistent surface in My Progress — parallel to CapacitiesMirror, but the
 * value-neutral PROFILE frame (spec §3/§5/§9): no scores, no good/bad, nothing
 * to fix. Leads with the SPREAD (the domain-specificity insight), then the
 * plain domain-by-domain shape.
 *
 * Reflection only — it shows the LATEST recorded shape (+ a plain take
 * count/date, never a "moved/consistent" trajectory verdict; the read is
 * reflected, not scored — CANON §10 mirror posture). Empty state when no take
 * exists yet; retake happens in the Library → Workshop, not here.
 *
 * @param {function(): void} onExit — back to My Progress
 */

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export default function RiskProfileMirror({ onExit }) {
  const taken = hasRiskResult();
  const latest = getLatestRiskResult();
  const takeCount = getRiskHistory().length;
  const result = latest?.results || null;
  const reading = result?.reading || {};
  const domains = Array.isArray(result?.domains) ? result.domains : [];
  const notes = Array.isArray(result?.notes) ? result.notes : [];

  const measureLine =
    takeCount <= 1
      ? `Measured ${formatDate(latest?.takenAt)}`
      : `Measured ${takeCount}× · latest ${formatDate(latest?.takenAt)}`;

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      <EditorialBlock
        label="My Progress"
        headline={DOSPERT.name}
        headlineSize="md"
        body="Where you take risk and where you hold back, across the parts of a life — reflected back as your shape. Nothing here is a score, and nothing needs fixing."
        rule
      />

      {taken && domains.length > 0 ? (
        <>
          {reading.body && (
            <p style={{ ...readingBodyStyle, marginTop: "var(--sf-space-24)" }}>{reading.body}</p>
          )}

          <div style={{ marginTop: "var(--sf-space-24)" }}>
            <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
              Across the domains
            </MonoLabel>
            {domains.map((d) => (
              <div key={d.id} style={domainRowStyle}>
                <span style={domainLabelStyle}>{d.label}</span>
                <span style={leanStyle}>{d.leanLabel}</span>
              </div>
            ))}
          </div>

          {notes.length > 0 && (
            <div style={{ marginTop: "var(--sf-space-24)" }}>
              {notes.map((note, i) => (
                <div key={i} style={{ marginBottom: "var(--sf-space-16)" }}>
                  {note.title && (
                    <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-8)" }}>
                      {note.title}
                    </MonoLabel>
                  )}
                  <p style={readingBodyStyle}>{note.body}</p>
                </div>
              ))}
            </div>
          )}

          <p style={measureStyle}>{measureLine}</p>
        </>
      ) : (
        <p style={{ ...framingStyle, marginTop: "var(--sf-space-24)" }}>
          Not yet measured. Take it in the Workshop — about three minutes — and your shape shows up
          here. No score, nothing to prepare for.
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

const framingStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "15px",
  lineHeight: 1.5,
  color: "var(--sf-text-faint)",
  margin: 0,
};

const readingBodyStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "15px",
  lineHeight: 1.55,
  color: "var(--sf-text-quiet)",
  margin: 0,
};

const domainRowStyle = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: "var(--sf-space-16)",
  padding: "var(--sf-space-16) 0",
  borderBottom: "0.5px solid var(--sf-border-quiet)",
};

const domainLabelStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "17px",
  fontWeight: 400,
  color: "var(--sf-text-primary)",
  lineHeight: 1.3,
};

const leanStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "15px",
  lineHeight: 1.4,
  color: "var(--sf-text-quiet)",
  textAlign: "right",
  flexShrink: 0,
};

const measureStyle = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "11px",
  letterSpacing: "0.04em",
  color: "var(--sf-text-primary)",
  margin: "var(--sf-space-24) 0 0",
};
