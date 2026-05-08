// SomaticPromptRunner — shared running-phase component
// Phase 8c · Engagement Architecture Engine 2 Build #8
//
// Extracted from src/disruptor/DisruptorTool.jsx (May 7) so both DisruptorTool
// and the new MoveCardTool can consume the same timing-and-display logic.
// Reduces drift, single source of truth for somatic-prompt cadence.
//
// Props:
//   prompts       — array of { text, durationMs, kind } (kind is informational
//                   only — pressure | breath | temperature | posture | attention)
//   onComplete()  — fires after the last prompt's timer elapses
//   onEarlyExit({ elapsedMs }) — fires when user taps "End early"
//
// What this component owns:
//   - prompt index advancement (auto, beat-driven by each prompt's durationMs)
//   - elapsed-time ticking (100ms cadence for the progress bar)
//   - the running-phase visual (progress bar + pulse ring + prompt + remaining + exit)
//   - timer cleanup on unmount and on prompts change
//
// What the parent owns:
//   - phase orchestration (intro → running → reflection)
//   - intro screen (tool-specific copy)
//   - reflection screen (tool-specific copy)
//   - persistence on completion / early exit
//
// Voice rule (carried from DisruptorTool source comment, May 7):
//   "Auto-advances through prompts; no verbal input required (body-first
//    compliant per PATTERN_DISRUPTION_SPEC §2.3 + Q6)."

import { useState, useEffect, useRef } from "react";

export function SomaticPromptRunner({ prompts = [], onComplete, onEarlyExit }) {
  const [promptIdx, setPromptIdx] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startTimeRef = useRef(0);
  const promptTimeoutRef = useRef(null);
  const tickIntervalRef = useRef(null);

  // Total duration computed from props — recomputed if prompts change
  // (would only happen if parent swaps the sequence mid-run, which neither
  // current consumer does, but the recompute is cheap).
  const totalDurationMs = prompts.reduce((sum, p) => sum + (Number.isFinite(p?.durationMs) ? p.durationMs : 0), 0);

  // Initialize start time on mount and reset state when prompts change.
  useEffect(() => {
    startTimeRef.current = Date.now();
    setElapsedMs(0);
    setPromptIdx(0);
  }, [prompts]);

  // Cleanup timers on unmount.
  useEffect(() => {
    return () => {
      if (promptTimeoutRef.current) clearTimeout(promptTimeoutRef.current);
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, []);

  // Advance through prompts. Each prompt's durationMs determines when the
  // next one fires. After the last prompt's timer elapses, onComplete()
  // fires (parent transitions to reflection).
  useEffect(() => {
    if (prompts.length === 0) return;
    if (promptIdx >= prompts.length) {
      // Completed all prompts. Defer the parent transition to the next
      // tick so the final prompt has time to render its full duration in
      // the user's perception (otherwise the screen flickers to reflection
      // immediately on the last setTimeout fire).
      const t = setTimeout(() => {
        if (typeof onComplete === "function") onComplete();
      }, 0);
      return () => clearTimeout(t);
    }
    const current = prompts[promptIdx];
    const delay = Number.isFinite(current?.durationMs) ? current.durationMs : 8000;
    promptTimeoutRef.current = setTimeout(() => {
      setPromptIdx(i => i + 1);
    }, delay);
    return () => {
      if (promptTimeoutRef.current) clearTimeout(promptTimeoutRef.current);
    };
  }, [promptIdx, prompts, onComplete]);

  // Tick elapsed time for the progress indicator. 100ms cadence is what
  // the old DisruptorTool used; smooth enough for the bar without
  // flooding the React reconciler.
  useEffect(() => {
    tickIntervalRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 100);
    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, []);

  // Empty / malformed prompts — fire onComplete on next tick so parent
  // can move to reflection rather than hanging on a blank screen. Hook
  // is always called per React rules; the effect body is gated.
  useEffect(() => {
    if (prompts.length === 0 && typeof onComplete === "function") {
      const t = setTimeout(onComplete, 0);
      return () => clearTimeout(t);
    }
  }, [prompts, onComplete]);

  const handleEarlyExit = () => {
    const elapsed = Date.now() - startTimeRef.current;
    if (typeof onEarlyExit === "function") onEarlyExit({ elapsedMs: elapsed });
  };

  // Empty render — onComplete will fire from the effect above.
  if (prompts.length === 0) return null;

  const current = prompts[Math.min(promptIdx, prompts.length - 1)];
  const totalProgress = totalDurationMs > 0 ? Math.min(1, elapsedMs / totalDurationMs) : 0;
  const remainingSec = Math.max(0, Math.ceil((totalDurationMs - elapsedMs) / 1000));

  const stillformAmber = "var(--amber)";
  const muted = "var(--text-muted)";

  return (
    <div style={{
      padding: "32px 24px", textAlign: "center", maxWidth: 480, margin: "0 auto",
      minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center"
    }}>
      {/* Progress bar — minimal, doesn't compete with the prompt */}
      <div style={{ width: "100%", height: 2, background: "var(--border)", borderRadius: 1, marginBottom: 48, overflow: "hidden" }}>
        <div style={{
          width: `${(totalProgress * 100).toFixed(1)}%`,
          height: "100%",
          background: stillformAmber,
          transition: "width 100ms linear"
        }} />
      </div>

      {/* Pulsing focus ring — visual anchor synchronized to prompt cadence */}
      <div style={{
        width: 120, height: 120, borderRadius: "50%",
        border: `1px solid ${stillformAmber}`,
        margin: "0 auto 32px",
        opacity: 0.4,
        animation: "stillformSomaticPulse 4s ease-in-out infinite"
      }} />

      <div style={{
        fontSize: 22, lineHeight: 1.5, color: "var(--text)",
        fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
        padding: "0 16px", maxWidth: 360, margin: "0 auto"
      }}>
        {current.text}
      </div>

      <div className="t-mono-xs" style={{ color: muted, marginTop: 48 }}>
        {remainingSec}s remaining
      </div>

      <button onClick={handleEarlyExit} style={{
        background: "none", border: "none", color: muted, fontSize: 11,
        cursor: "pointer", marginTop: 32, padding: 8
      }} aria-label="End early">
        End early
      </button>

      <style>{`
        @keyframes stillformSomaticPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.08); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
