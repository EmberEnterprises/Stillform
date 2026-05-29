import React, { useState } from "react";
import MoveRunner from "../../components/MoveRunner.jsx";
import Button from "../../components/Button.jsx";
import MonoLabel from "../../components/MonoLabel.jsx";
import { selectMoveForNotice } from "../../lib/moveCard/select.js";

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
  // Select once at mount — a re-render shouldn't reshuffle mid-move.
  const [sequence] = useState(() => selectMoveForNotice({ chip }));
  const [done, setDone] = useState(false);

  const exit = () => { if (typeof onDone === "function") onDone(); };
  const keepGoing = () => { if (typeof onKeepGoing === "function") onKeepGoing(); };

  // Selection always returns a sequence; this guard is belt-and-suspenders.
  if (!sequence) {
    exit();
    return null;
  }

  if (!done) {
    return (
      <MoveRunner
        sequence={sequence}
        onComplete={() => setDone(true)}
        onExit={exit}
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
