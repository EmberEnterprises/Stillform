// Practice Signals — AffectLabeling exercise component
// CFM Phase 1 Sprint 2 · May 7, 2026
//
// Mechanics (per CFM_PHASE_1_AUDIT.md Decision 2):
//   1. Show scenario for ~1.5s, then chip row appears
//   2. User taps chip → record latency (ms from chip appearance) + accuracy
//      (chip matched primary or secondary acceptable from stimulus library)
//   3. Repeat for 12 scenarios (sufficient for trend signal per audit Decision 3)
//   4. Show summary (median latency, accuracy %)
//   5. Save via appendFunctionCheck and close
//
// What gets saved (matches Phase 0 schema):
//   candidate: AFFECT_LABELING
//   primaryMs: median latency across the 12 trials
//   primaryCount: accuracy count (matches out of 12)
//   bioFilter: array of active bio-filter tokens at session start
//   toolsBeforeMs: null (Practice Signals checks are standalone, not post-session)

import { useState, useEffect, useRef } from "react";
import { getValidatedAffectStimuli } from "./affect-labeling-stimuli";

const TRIAL_COUNT = 12;
const SCENARIO_DISPLAY_MS = 1500;
const RESPONSE_TIMEOUT_MS = 8000; // user has 8s to respond before trial auto-skips

const FEEL_CHIPS = [
  { id: "excited", label: "Excited" },
  { id: "focused", label: "Focused" },
  { id: "settled", label: "Settled" },
  { id: "anxious", label: "Anxious" },
  { id: "angry", label: "Angry" },
  { id: "stuck", label: "Stuck" },
  { id: "mixed", label: "Mixed" },
  { id: "flat", label: "Flat" },
  { id: "distant", label: "Distant" },
];

// Pick N scenarios from the validated pool. Random sample so users get
// variety across multiple checks.
const pickScenarios = (n) => {
  const pool = getValidatedAffectStimuli();
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, pool.length));
};

const median = (arr) => {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

export function AffectLabelingExercise({ onComplete, onClose, bioFilter = null }) {
  const [phase, setPhase] = useState("intro"); // intro | scenario | chips | summary
  const [trialIdx, setTrialIdx] = useState(0);
  const [scenarios] = useState(() => pickScenarios(TRIAL_COUNT));
  const [results, setResults] = useState([]); // { id, latencyMs, picked, primary, accurate }
  const chipsShownAtRef = useRef(0);
  const trialTimeoutRef = useRef(null);

  const trial = scenarios[trialIdx] || null;
  const totalTrials = scenarios.length;

  // Start a trial: show scenario for SCENARIO_DISPLAY_MS, then chips.
  useEffect(() => {
    if (phase !== "scenario") return;
    const showChipsTimer = setTimeout(() => {
      chipsShownAtRef.current = Date.now();
      setPhase("chips");
    }, SCENARIO_DISPLAY_MS);
    return () => clearTimeout(showChipsTimer);
  }, [phase, trialIdx]);

  // Response timeout — if user doesn't pick within RESPONSE_TIMEOUT_MS, mark as skip and advance.
  useEffect(() => {
    if (phase !== "chips") return;
    trialTimeoutRef.current = setTimeout(() => {
      handlePick(null);
    }, RESPONSE_TIMEOUT_MS);
    return () => {
      if (trialTimeoutRef.current) clearTimeout(trialTimeoutRef.current);
    };
  }, [phase, trialIdx]);

  const handlePick = (chipId) => {
    if (trialTimeoutRef.current) {
      clearTimeout(trialTimeoutRef.current);
      trialTimeoutRef.current = null;
    }
    const now = Date.now();
    const latencyMs = chipId === null ? null : (now - chipsShownAtRef.current);
    const accurate = chipId === null
      ? false
      : (chipId === trial.primary || chipId === trial.secondary);
    setResults(prev => [...prev, {
      id: trial.id,
      latencyMs,
      picked: chipId,
      primary: trial.primary,
      secondary: trial.secondary || null,
      accurate
    }]);
    if (trialIdx + 1 >= totalTrials) {
      setPhase("summary");
    } else {
      setTrialIdx(trialIdx + 1);
      setPhase("scenario");
    }
  };

  const handleStart = () => {
    setPhase("scenario");
  };

  const handleFinish = () => {
    // Compute summary metrics. Median latency (excluding skipped trials).
    const validLatencies = results.filter(r => typeof r.latencyMs === "number").map(r => r.latencyMs);
    const accurateCount = results.filter(r => r.accurate).length;
    const summary = {
      candidate: "affect-labeling",
      primaryMs: validLatencies.length > 0 ? Math.round(median(validLatencies)) : null,
      primaryCount: accurateCount,
      bioFilter: bioFilter,
      toolsBeforeMs: null,
      // Extra context for future analysis — not part of the Phase 0 schema
      // but the appendFunctionCheck helper preserves whatever it gets passed.
      trialCount: totalTrials,
      timestamp: new Date().toISOString()
    };
    if (onComplete) onComplete(summary);
  };

  const stillformAmber = "var(--amber)";
  const muted = "var(--text-muted)";

  // ─── INTRO ─────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div style={{ padding: "32px 24px", textAlign: "left", maxWidth: 480, margin: "0 auto" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: muted, fontSize: 12, cursor: "pointer", marginBottom: 16, padding: "8px 0" }} aria-label="Close affect labeling check">← Close</button>
        <div className="t-mono-xs" style={{ color: stillformAmber, marginBottom: 12 }}>Affect labeling · signal check</div>
        <h2 className="t-display-md" style={{ marginBottom: 16 }}>How fast you label what's present</h2>
        <div className="t-body-sm quiet" style={{ lineHeight: 1.7, marginBottom: 24 }}>
          You'll see {totalTrials} short scenarios. Each one flashes briefly. Pick the chip that fits best.
          We measure how quickly you label what's present — the function emotional granularity practice trains.
        </div>
        <div className="t-caption quiet" style={{ marginBottom: 32, padding: "12px 14px", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)" }}>
          Pace yourself. There's no rank, no comparison. Your data, your timeframe.
        </div>
        <button className="btn btn-primary" onClick={handleStart} style={{ width: "100%" }}>
          Begin
        </button>
      </div>
    );
  }

  // ─── SCENARIO PHASE ────────────────────────────────────────────────
  if (phase === "scenario" && trial) {
    return (
      <div style={{ padding: "48px 24px", textAlign: "center", maxWidth: 480, margin: "0 auto", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="t-mono-xs" style={{ color: muted, marginBottom: 24 }}>
          {trialIdx + 1} of {totalTrials}
        </div>
        <div style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
          {trial.scenario}
        </div>
      </div>
    );
  }

  // ─── CHIPS PHASE ───────────────────────────────────────────────────
  if (phase === "chips" && trial) {
    return (
      <div style={{ padding: "32px 24px", textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
        <div className="t-mono-xs" style={{ color: muted, marginBottom: 16 }}>
          {trialIdx + 1} of {totalTrials}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)", marginBottom: 24, fontStyle: "italic" }}>
          {trial.scenario}
        </div>
        <div className="t-mono-xs" style={{ color: stillformAmber, marginBottom: 12 }}>
          What's present
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {FEEL_CHIPS.map(chip => (
            <button
              key={chip.id}
              onClick={() => handlePick(chip.id)}
              aria-label={chip.label}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: 20,
                padding: "10px 14px",
                fontSize: 13,
                color: "var(--text)",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                minHeight: 44
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
        <button onClick={() => handlePick(null)} style={{ background: "none", border: "none", color: muted, fontSize: 11, cursor: "pointer", marginTop: 24, padding: 8 }}>
          Skip this one
        </button>
      </div>
    );
  }

  // ─── SUMMARY ───────────────────────────────────────────────────────
  if (phase === "summary") {
    const validLatencies = results.filter(r => typeof r.latencyMs === "number").map(r => r.latencyMs);
    const accurateCount = results.filter(r => r.accurate).length;
    const skippedCount = results.filter(r => r.picked === null).length;
    const medianMs = validLatencies.length > 0 ? Math.round(median(validLatencies)) : null;

    return (
      <div style={{ padding: "32px 24px", textAlign: "left", maxWidth: 480, margin: "0 auto" }}>
        <div className="t-mono-xs" style={{ color: stillformAmber, marginBottom: 12 }}>Check complete</div>
        <h2 className="t-display-md" style={{ marginBottom: 24 }}>Your signal</h2>

        <div style={{ marginBottom: 16, padding: "16px 18px", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r-lg)" }}>
          <div className="t-caption quiet" style={{ marginBottom: 4 }}>Median latency</div>
          <div style={{ fontSize: 24, fontFamily: "'Cormorant Garamond', serif", color: "var(--text)" }}>
            {medianMs !== null ? `${(medianMs / 1000).toFixed(2)}s` : "—"}
          </div>
        </div>

        <div style={{ marginBottom: 16, padding: "16px 18px", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r-lg)" }}>
          <div className="t-caption quiet" style={{ marginBottom: 4 }}>Accuracy</div>
          <div style={{ fontSize: 24, fontFamily: "'Cormorant Garamond', serif", color: "var(--text)" }}>
            {accurateCount} / {totalTrials}
          </div>
          {skippedCount > 0 && (
            <div className="t-caption quiet" style={{ marginTop: 4, fontSize: 11 }}>
              {skippedCount} skipped — counted as not matched
            </div>
          )}
        </div>

        <div className="t-body-sm quiet" style={{ lineHeight: 1.7, marginBottom: 24, marginTop: 24 }}>
          Saved to your trends. Take another check in a few days to see whether the function
          shifts with practice.
        </div>

        <button className="btn btn-primary" onClick={handleFinish} style={{ width: "100%" }}>
          Done
        </button>
      </div>
    );
  }

  return null;
}
