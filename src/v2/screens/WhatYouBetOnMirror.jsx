import React from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import {
  getResolvedPredictions,
  getPendingPredictions,
  getPredictionCount,
} from "../lib/predictionLog.js";

/**
 * WhatYouBetOnMirror — the full §5 #2 calibration mirror (Precision Framework).
 * Displays paired entries: prediction + stated confidence + outcome, in plain
 * language with no aggregate accuracy scores. The juxtaposition itself IS the
 * gap — per framework §4, "the gap is the data."
 *
 * Framing (CANON §10 / framing law / framework §5 #2):
 * Reflect-not-score. No "you were right N% of the time" stat. No trajectory
 * verdict. No good/bad framing. Each resolved entry simply lays the user's
 * stated confidence next to the outcome they named in their own words — the
 * brain quietly updates the prior by re-encountering the accumulation. This
 * is the persistent companion to "What Didn't Come True" (which logs marked
 * disconfirmations) — together they cover both halves of framework §4
 * (catch + calibrate).
 *
 * Source data: src/v2/lib/predictionLog.js. Predictions captured during
 * Reframe via Precision Probe LOGGING OFFER (METACOGNITIVE_ARC #6) →
 * outcomes captured at EOD Close → resolved entries surface here.
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

export default function WhatYouBetOnMirror({ onExit }) {
  const resolved = getResolvedPredictions(); // newest-first per API
  const pendingCount = getPendingPredictions().length;
  const resolvedCount = resolved.length;
  const totalCount = getPredictionCount();
  const recent = resolved.slice(0, RECENT_N);
  const latestOutcomeAt = recent[0]?.outcomeAt;

  // Quiet count line. Resolved-count primary; pending shown if any. Latest-
  // date appended once any outcomes exist. No accuracy %, no trajectory verdict.
  const measureLine = (() => {
    if (resolvedCount === 0) return null;
    const head = `${resolvedCount} outcome${resolvedCount === 1 ? "" : "s"}`;
    const pendingPart = pendingCount > 0 ? ` · ${pendingCount} pending` : "";
    const datePart = latestOutcomeAt ? ` · latest ${formatDate(latestOutcomeAt)}` : "";
    return `${head}${pendingPart}${datePart}`;
  })();

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      <EditorialBlock
        label="My Progress"
        headline="What You Bet On"
        headlineSize="md"
        body="What you were sure of, next to what actually happened. The gap is the data — seeing it accumulate quietly lowers the prior. No score, nothing to track."
        rule
      />

      {resolvedCount > 0 ? (
        <>
          <div style={{ marginTop: "var(--sf-space-24)" }}>
            <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
              Recent
            </MonoLabel>
            {recent.map((entry) => (
              <div key={entry.id} style={entryRowStyle}>
                <p style={predictionStyle}>&ldquo;{entry.text}&rdquo;</p>
                <p style={confidenceStyle}>You were {entry.confidence}% sure</p>
                <p style={outcomeStyle}>
                  <span style={outcomeLabelStyle}>What happened: </span>
                  {entry.outcome}
                </p>
                <span style={dateStyle}>{formatDate(entry.outcomeAt)}</span>
              </div>
            ))}
          </div>
          {measureLine ? <p style={measureStyle}>{measureLine}</p> : null}
        </>
      ) : pendingCount > 0 ? (
        <p style={{ ...framingStyle, marginTop: "var(--sf-space-24)" }}>
          {pendingCount} prediction{pendingCount === 1 ? "" : "s"} waiting on an outcome.
          Mark what happened at end of day and they&rsquo;ll land here paired with the
          confidence you stated.
        </p>
      ) : (
        <p style={{ ...framingStyle, marginTop: "var(--sf-space-24)" }}>
          Predictions land here once you log one inside a Reframe and mark what happened.
          No score, nothing to track — just your stated confidence laid against the outcome,
          the gap visible.
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

const entryRowStyle = {
  padding: "var(--sf-space-16) 0",
  borderBottom: "0.5px solid var(--sf-border-quiet)",
};

const predictionStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "15px",
  lineHeight: 1.5,
  fontStyle: "italic",
  color: "var(--sf-text-quiet)",
  margin: "0 0 var(--sf-space-4)",
};

const confidenceStyle = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "11px",
  letterSpacing: "0.04em",
  color: "var(--sf-text-faint)",
  margin: "0 0 var(--sf-space-8)",
};

const outcomeStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "16px",
  lineHeight: 1.5,
  color: "var(--sf-text-primary)",
  margin: "0 0 var(--sf-space-8)",
};

const outcomeLabelStyle = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "11px",
  letterSpacing: "0.04em",
  color: "var(--sf-text-faint)",
  textTransform: "uppercase",
  marginRight: "var(--sf-space-4)",
};

const dateStyle = {
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
