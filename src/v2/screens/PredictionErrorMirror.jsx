import React from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import {
  getRecentPredictionErrors,
  getPredictionErrorCount,
  hasPredictionError,
} from "../lib/predictionErrors.js";

/**
 * PredictionErrorMirror — the v1 reflection of the disconfirmation log
 * (Precision Framework §5 #2, v1). Closes the prediction-error loop:
 * mark (at EOD Close) → log (predictionErrors store) → SEE (here).
 *
 * Framing (CANON §10 / framing law / framework §4): this is the INVERSE of a
 * pattern-data tracking surface. It surfaces accumulated DISCONFIRMING
 * evidence — "things I was sure would happen that didn't" — which is exactly
 * the update signal §4 says the mind otherwise drops. Re-encountering the
 * accumulation compounds the prior-lowering: each new mark, and each return
 * here, makes the dark prior a little less loud. No scores, no good/bad, no
 * trajectory verdict — reflect-not-score.
 *
 * SCOPE NOTE: this is v1, NOT the full §5 #2 calibration mirror. The full
 * spec (stated confidence vs actual outcomes over time) needs forward-
 * prediction-logging infrastructure the current log doesn't capture; that's
 * the heavier piece, held until that infra exists. v1 reflects what the v1
 * log has — the marks themselves.
 *
 * @param {function(): void} onExit — back to My Progress
 */

const RECENT_N = 10;

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export default function PredictionErrorMirror({ onExit }) {
  const has = hasPredictionError();
  const count = getPredictionErrorCount();
  const recent = getRecentPredictionErrors(RECENT_N);
  const latestDate = recent[0]?.markedAt;

  const measureLine =
    count <= 1
      ? `${count} mark${count === 1 ? "" : "s"}${latestDate ? ` · ${formatDate(latestDate)}` : ""}`
      : `${count} marks · latest ${formatDate(latestDate)}`;

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      <EditorialBlock
        label="My Progress"
        headline="What Didn't Come True"
        headlineSize="md"
        body="Some of what your mind tells you is coming doesn't. Catching those moments — and seeing them accumulate — turns down the volume on the prior. Here's what you've caught."
        rule
      />

      {has ? (
        <>
          <div style={{ marginTop: "var(--sf-space-24)" }}>
            <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
              Recent
            </MonoLabel>
            {recent.map((entry) => (
              <div key={entry.id} style={markRowStyle}>
                <p style={markTextStyle}>{entry.text}</p>
                <span style={markDateStyle}>{formatDate(entry.markedAt)}</span>
              </div>
            ))}
          </div>
          <p style={measureStyle}>{measureLine}</p>
        </>
      ) : (
        <p style={{ ...framingStyle, marginTop: "var(--sf-space-24)" }}>
          Marks land here as you catch them. Take the optional prompt at end-of-day and they'll
          start filling in. No score, nothing to track — just the disconfirmations the mind
          otherwise forgets to count.
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

const markRowStyle = {
  padding: "var(--sf-space-16) 0",
  borderBottom: "0.5px solid var(--sf-border-quiet)",
};

const markTextStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "16px",
  lineHeight: 1.5,
  color: "var(--sf-text-primary)",
  margin: "0 0 var(--sf-space-8)",
};

const markDateStyle = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "11px",
  letterSpacing: "0.04em",
  color: "var(--sf-text-faint)",
};

const measureStyle = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "11px",
  letterSpacing: "0.04em",
  color: "var(--sf-text-primary)",
  margin: "var(--sf-space-24) 0 0",
};
