import React, { useState, useEffect } from "react";
import MoveRunner from "../../components/MoveRunner.jsx";
import Button from "../../components/Button.jsx";
import MonoLabel from "../../components/MonoLabel.jsx";
import { selectMoveForNotice } from "../../lib/moveCard/select.js";
import { recordMoveRun, getRecentMoveIds } from "../../lib/moveCard/history.js";

/**
 * MoveCard — the quick-move flow (Phase 6.2c).
 *
 * The Support Sheet's first live tool, surfaced via the Notice "quick move ›"
 * fork. Encapsulates the whole move: pick a sequence (deterministic — 6.2b) →
 * run it (MoveRunner — 6.2a) → a quiet reflection offering the handoff.
 *
 * Handoff (decided May 28, 2026 — dual exit; body-first → cognitive, per the
 * Apr 27 breathe-and-ground precedent):
 *   - "Keep going ›" → onKeepGoing(): back into the spine to name / reframe.
 *   - "Done for now" → onDone(): the reset was enough; leave it here.
 * Ending the run early also exits via onDone — the user is out.
 *
 * Spine owns where "keep going" lands (reframe if they had already named
 * something, else back to Notice to name it). MoveCard just signals intent.
 *
 * @param {object} props
 * @param {string|null} [props.chip]  the Notice feel chip, for selection
 * @param {function} props.onKeepGoing  continue into the spine
 * @param {function} props.onDone  exit (reset was enough, or ended early)
 */
export default function MoveCard({ chip = null, onKeepGoing, onDone }) {
  // Select once at mount — a re-render shouldn't reshuffle mid-move. Recent
  // moves are excluded so the quick-move doesn't hand back the same sequence
  // two times running (6.2d).
  const [sequence] = useState(() => selectMoveForNotice({ chip, recentMoveIds: getRecentMoveIds() }));
  const [done, setDone] = useState(false);

  // 6.2d: "Move Started" telemetry — once on mount, before any early return
  // so the hook order stays stable.
  useEffect(() => {
    try {
      window.plausible?.("Move Started", { props: { sequence: sequence?.id || "unknown" } });
    } catch { /* analytics non-fatal */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exit = () => { if (typeof onDone === "function") onDone(); };
  const keepGoing = () => { if (typeof onKeepGoing === "function") onKeepGoing(); };

  // 6.2d: record each run (history, not a score — selection reads it to avoid
  // repeats) + fire telemetry. Complete → reflection; ended early → exit.
  const handleComplete = (run) => {
    recordMoveRun({ sequenceId: run?.sequenceId || sequence?.id || null, durationMs: run?.durationMs || 0, completed: true, sourceState: chip || null });
    try { window.plausible?.("Move Completed", { props: { sequence: run?.sequenceId || sequence?.id || "unknown" } }); } catch { /* non-fatal */ }
    setDone(true);
  };
  const handleEndedEarly = (run) => {
    recordMoveRun({ sequenceId: run?.sequenceId || sequence?.id || null, durationMs: run?.durationMs || 0, completed: false, sourceState: chip || null });
    try { window.plausible?.("Move Ended Early", { props: { sequence: run?.sequenceId || sequence?.id || "unknown", steps_completed: run?.stepsCompleted ?? 0 } }); } catch { /* non-fatal */ }
    exit();
  };

  // Selection always returns a sequence; this guard is belt-and-suspenders.
  if (!sequence) {
    exit();
    return null;
  }

  if (!done) {
    return (
      <MoveRunner
        sequence={sequence}
        onComplete={handleComplete}
        onExit={handleEndedEarly}
      />
    );
  }

  // Reflection — understated, not gamified (no praise, no count). Names the
  // shape of what happened and hands back the two real choices.
  return (
    <main className="sf-page sf-page--hero">
      <div className="sf-fade-enter" style={{ textAlign: "center" }}>
        <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
          Move complete
        </MonoLabel>

        <div
          style={{
            fontSize: "clamp(1.5rem, 5vw, 2rem)",
            fontFamily: "var(--sf-font-display)",
            fontWeight: "var(--sf-weight-light)",
            color: "var(--sf-text-primary)",
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
            maxWidth: "28rem",
            margin: "0 auto var(--sf-space-16)",
          }}
        >
          That's the reset.
        </div>

        <div
          style={{
            fontSize: "clamp(1rem, 3vw, 1.125rem)",
            color: "var(--sf-text-secondary)",
            lineHeight: 1.5,
            maxWidth: "28rem",
            margin: "0 auto var(--sf-space-48)",
          }}
        >
          Pick the thread back up, or leave it here.
        </div>

        <div style={{ display: "flex", gap: "var(--sf-space-16)", justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="primary" onClick={keepGoing}>
            Keep going ›
          </Button>
          <Button variant="ghost" onClick={exit}>
            Done for now
          </Button>
        </div>
      </div>
    </main>
  );
}
