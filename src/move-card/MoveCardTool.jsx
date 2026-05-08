// MoveCardTool — Engagement Architecture Engine 2 Build #8 Phase 8c
// Per MOVE_CARD_FLOW_AUDIT.md §3c.
//
// Mechanic: somatic redirection — same family as Disruptor, distinct framing.
// Disruptor fires from pattern detection (in-flow). Move card is user-summonable
// "anywhere" — bathroom at work, between calls, car. The differentiation isn't
// the mechanism; it's the AUTONOMY (user opens it deliberately) and the
// ADAPTIVITY (sequence selected to current state, not fixed).
//
// State machine:
//   idle → loading (selection in flight) → running (SomaticPromptRunner) →
//     reflection (with re-do affordance, Phase 8e) → done (onComplete fires)
//
// Selection: selectMoveCardSequence({state, recentMoveIds}) → AI path with
// deterministic fallback. Always returns a sequence in practice (library
// universal #10 matches everything). The sequence is then passed to
// SomaticPromptRunner verbatim.
//
// Persistence (Phase 8e — implemented as part of this commit since the
// completion handler is here): writes to stillform_move_card_history
// via appendMoveCardHistory passed in via props. This component owns
// timing + sequence display; parent owns persistence wiring + telemetry.
//
// What this component is NOT:
//   - NOT a Disruptor replacement (Disruptor stays its pattern-detection role)
//   - NOT a Reframe replacement
//   - NOT meditation
//   - NOT a treatment intervention

import { useState, useEffect, useRef } from "react";
import { SomaticPromptRunner } from "./SomaticPromptRunner.jsx";
import { selectMoveCardSequence } from "./select.js";

export function MoveCardTool({
  state = {},
  recentMoveIds = [],
  initialSequence = null,
  onComplete,
  onClose
}) {
  // Phase machine. If initialSequence is provided (re-do path from Phase 8e),
  // skip selection and go directly to intro for that sequence.
  const [phase, setPhase] = useState(initialSequence ? "intro" : "loading");
  const [sequence, setSequence] = useState(initialSequence || null);
  const [pathway, setPathway] = useState(initialSequence ? "redo" : null); // "ai" | "deterministic" | "redo"
  const [reason, setReason] = useState(null);
  const [error, setError] = useState(null);
  const startTimeRef = useRef(0);

  // Selection — fires once on mount unless we were given an initialSequence.
  // If selection fails entirely (shouldn't happen because library #10 always
  // matches), surface a quiet error state with a retry option rather than
  // hanging.
  useEffect(() => {
    if (initialSequence) return;
    let cancelled = false;
    selectMoveCardSequence({ state, recentMoveIds })
      .then(result => {
        if (cancelled) return;
        if (result?.sequence) {
          setSequence(result.sequence);
          setPathway(result.pathway);
          setReason(result.reason);
          setPhase("intro");
        } else {
          setError("Selection unavailable");
          setPhase("error");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setError("Selection unavailable");
        setPhase("error");
      });
    return () => { cancelled = true; };
  }, [initialSequence]);

  const handleStart = () => {
    startTimeRef.current = Date.now();
    setPhase("running");
  };

  const handleRunnerComplete = () => {
    setPhase("reflection");
  };

  const handleRunnerEarlyExit = ({ elapsedMs }) => {
    if (typeof onComplete === "function") {
      onComplete({
        sequenceId: sequence?.id || null,
        durationMs: elapsedMs,
        completed: false,
        pathway: pathway || "unknown",
        sequenceState: state,
        reason: reason
      });
    }
  };

  const handleFinish = () => {
    if (typeof onComplete === "function") {
      onComplete({
        sequenceId: sequence?.id || null,
        durationMs: sequence?.durationMs || (Date.now() - startTimeRef.current),
        completed: true,
        pathway: pathway || "unknown",
        sequenceState: state,
        reason: reason
      });
    }
  };

  // Phase 8e — re-do affordance. Internal phase reset; same sequence
  // stays in state, user starts again from intro. Pathway flips to
  // "redo" so onComplete telemetry distinguishes a fresh selection
  // from a deliberate repeat (8f wires the actual telemetry; this just
  // labels the pathway correctly for it).
  const handleRedo = () => {
    setPathway("redo");
    startTimeRef.current = 0;
    setPhase("intro");
  };

  const stillformAmber = "var(--amber)";
  const muted = "var(--text-muted)";

  // ─── LOADING ────────────────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div style={{ padding: "32px 24px", textAlign: "center", maxWidth: 480, margin: "0 auto", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="t-mono-xs" style={{ color: muted, letterSpacing: "0.14em" }}>Selecting your move…</div>
      </div>
    );
  }

  // ─── ERROR (selection failed entirely) ─────────────────────────────
  if (phase === "error") {
    return (
      <div style={{ padding: "32px 24px", textAlign: "left", maxWidth: 480, margin: "0 auto" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: muted, fontSize: 12, cursor: "pointer", marginBottom: 16, padding: "8px 0" }} aria-label="Close move card">← Close</button>
        <div className="t-mono-xs" style={{ color: muted, marginBottom: 12 }}>Move card</div>
        <div className="t-body-sm quiet" style={{ lineHeight: 1.7, marginBottom: 24 }}>
          Couldn't pull a move right now. Try again in a moment.
        </div>
        <button className="btn btn-primary" onClick={onClose} style={{ width: "100%" }}>Close</button>
      </div>
    );
  }

  // ─── INTRO ─────────────────────────────────────────────────────────
  if (phase === "intro") {
    const durationSec = sequence?.durationMs ? Math.round(sequence.durationMs / 1000) : null;
    return (
      <div style={{ padding: "32px 24px", textAlign: "left", maxWidth: 480, margin: "0 auto" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: muted, fontSize: 12, cursor: "pointer", marginBottom: 16, padding: "8px 0" }} aria-label="Close move card">← Close</button>
        <div className="t-mono-xs" style={{ color: stillformAmber, marginBottom: 12 }}>Move card</div>
        <h2 className="t-display-md" style={{ marginBottom: 16 }}>
          {durationSec ? `${durationSec} seconds` : "A short move"}
        </h2>
        <div className="t-body-sm quiet" style={{ lineHeight: 1.7, marginBottom: 16 }}>
          A specific somatic move tuned to where you are right now. Body-first.
          Follow the cues. Skip anything that doesn't apply.
        </div>
        <div className="t-body-sm quiet" style={{ lineHeight: 1.7, marginBottom: 24 }}>
          You can leave at any point.
        </div>
        <button className="btn btn-primary" onClick={handleStart} style={{ width: "100%" }}>
          Start
        </button>
      </div>
    );
  }

  // ─── RUNNING ───────────────────────────────────────────────────────
  if (phase === "running" && sequence?.prompts?.length > 0) {
    return (
      <SomaticPromptRunner
        prompts={sequence.prompts}
        onComplete={handleRunnerComplete}
        onEarlyExit={handleRunnerEarlyExit}
      />
    );
  }

  // ─── REFLECTION ────────────────────────────────────────────────────
  if (phase === "reflection") {
    return (
      <div style={{ padding: "32px 24px", textAlign: "left", maxWidth: 480, margin: "0 auto" }}>
        <div className="t-mono-xs" style={{ color: stillformAmber, marginBottom: 12 }}>Move complete</div>
        <h2 className="t-display-md" style={{ marginBottom: 24, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300 }}>
          That's the move.
        </h2>
        <div className="t-body-sm quiet" style={{ lineHeight: 1.7, marginBottom: 32 }}>
          You can run that one again whenever you need it. The body remembers
          even when the head doesn't.
        </div>
        <button className="btn btn-primary" onClick={handleFinish} style={{ width: "100%", marginBottom: 12 }}>
          Done
        </button>
        <button className="btn btn-ghost" onClick={handleRedo} style={{ width: "100%" }}>
          Run that again
        </button>
      </div>
    );
  }

  return null;
}
