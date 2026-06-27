import React, { useState, useEffect, useRef } from "react";
import MonoLabel from "./MonoLabel.jsx";
import Button from "./Button.jsx";

/**
 * BreathingSession — pattern-driven breath runner.
 *
 * Phase 4 #5 (locked May 16, 2026): the v2 reusable breathing component
 * shared between wind-down (Deep Regulate post-anchor) and the close
 * breathing offer (#7) on any beat where config.close.breathingOffer is
 * set. Pattern-driven so callers don't need to know phase durations.
 *
 * No animated ring in this initial cut — phase text + progress bar +
 * countdown number. The ring/breathing-visual polish can come later;
 * what matters for Phase 4 is the architectural plumbing and the
 * pattern data being correct. A clear text instruction + visible
 * progress is functionally complete for the user — they don't need a
 * pulsing circle to follow a 4-4-8-2 cycle.
 *
 * Patterns (single source of truth here):
 *   - "deep-regulate": 4-4-8-2 cycle, ~3 minutes, downregulation
 *   - "cyclic-sighing": 4-1-8 cycle, ~5 minutes, Balban 2023
 *   - "quick-reset": 4-4-6, ~1 minute, fast settle
 *
 * Always-available skip button — the user is in charge of whether the
 * full pattern runs. Skipping fires onSkip; completing fires
 * onComplete with metadata about the run.
 *
 * @param {object} props
 * @param {"deep-regulate"|"cyclic-sighing"|"quick-reset"} props.pattern
 * @param {function({patternId, completedRounds, totalRounds})} props.onComplete
 * @param {function({patternId, completedRounds, totalRounds})} props.onSkip
 */
export default function BreathingSession({ pattern = "deep-regulate", onComplete, onSkip }) {
  const config = PATTERNS[pattern] || PATTERNS["deep-regulate"];
  const { phases, totalRounds, label, why } = config;

  const [roundIndex, setRoundIndex] = useState(0);   // 0-based
  const [phaseIndex, setPhaseIndex] = useState(0);   // 0-based within current round
  const [secondsLeft, setSecondsLeft] = useState(phases[0].duration);
  const startTimestampRef = useRef(Date.now());

  // Run a single 1-second tick. When seconds hit 0, advance to next phase
  // (or next round, or complete if all rounds done).
  useEffect(() => {
    if (secondsLeft <= 0) {
      // Advance: next phase, or next round, or complete.
      const isLastPhase = phaseIndex >= phases.length - 1;
      if (!isLastPhase) {
        const nextPhase = phaseIndex + 1;
        setPhaseIndex(nextPhase);
        setSecondsLeft(phases[nextPhase].duration);
      } else {
        // End of a round.
        const isLastRound = roundIndex >= totalRounds - 1;
        if (!isLastRound) {
          setRoundIndex(roundIndex + 1);
          setPhaseIndex(0);
          setSecondsLeft(phases[0].duration);
        } else {
          // Final phase of final round complete.
          if (typeof onComplete === "function") {
            onComplete({
              patternId: pattern,
              completedRounds: totalRounds,
              totalRounds,
              durationMs: Date.now() - startTimestampRef.current,
            });
          }
        }
      }
      return;
    }

    const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, phaseIndex, roundIndex, phases, totalRounds, pattern, onComplete]);

  const handleSkip = () => {
    if (typeof onSkip === "function") {
      onSkip({
        patternId: pattern,
        completedRounds: roundIndex,
        totalRounds,
        durationMs: Date.now() - startTimestampRef.current,
      });
    }
  };

  const currentPhase = phases[phaseIndex];
  const phaseProgressPercent = ((currentPhase.duration - secondsLeft) / currentPhase.duration) * 100;

  return (
    <main className="sf-page sf-page--hero">
      <div className="sf-fade-enter" style={{ textAlign: "center" }}>
        <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
          {label} · Round {roundIndex + 1} of {totalRounds}
        </MonoLabel>

        <div
          style={{
            fontSize: "clamp(2.5rem, 8vw, 3.5rem)",
            fontFamily: "var(--sf-font-display)",
            fontWeight: "var(--sf-weight-light)",
            color: "var(--sf-text-primary)",
            marginBottom: "var(--sf-space-12)",
            letterSpacing: "-0.01em",
          }}
        >
          {currentPhase.name}
        </div>

        <div
          style={{
            fontSize: "clamp(1rem, 3vw, 1.125rem)",
            color: "var(--sf-text-secondary)",
            marginBottom: "var(--sf-space-32)",
            maxWidth: "32rem",
            margin: "0 auto var(--sf-space-32)",
            lineHeight: 1.5,
          }}
        >
          {currentPhase.instruction}
        </div>

        <div
          style={{
            fontSize: "clamp(3rem, 12vw, 4.5rem)",
            fontFamily: "var(--sf-font-display)",
            fontWeight: "var(--sf-weight-light)",
            color: "var(--sf-accent)",
            marginBottom: "var(--sf-space-24)",
            fontVariantNumeric: "tabular-nums",
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {secondsLeft}
        </div>

        <div
          role="progressbar"
          aria-valuenow={Math.round(phaseProgressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{
            width: "100%",
            maxWidth: "20rem",
            height: "2px",
            background: "var(--sf-border-quiet)",
            margin: "0 auto var(--sf-space-48)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${phaseProgressPercent}%`,
              background: "var(--sf-accent)",
              transition: "width 1s linear",
            }}
          />
        </div>

        <Button variant="primary" onClick={handleSkip}>
          Settled
        </Button>

        {/* The breath's rationale + the exit-is-success cue, folded into the
            empty space below the control (Arlin, June 27: no intro page — keep
            it one screen, low-friction). COPY IS FIRST-PASS — Arlin's voice. */}
        <div style={{ maxWidth: "26rem", margin: "var(--sf-space-48) auto 0" }}>
          <p style={{ fontSize: "clamp(0.9rem, 2.6vw, 0.95rem)", color: "var(--sf-text-secondary)", lineHeight: 1.55, marginBottom: "var(--sf-space-16)" }}>
            {why}
          </p>
          <p style={{ fontSize: "clamp(0.9rem, 2.6vw, 0.95rem)", color: "var(--sf-text-faint)", lineHeight: 1.55 }}>
            You don&rsquo;t have to finish every round &mdash; end whenever you feel settled.
          </p>
        </div>
      </div>
    </main>
  );
}

/* -----------------------------------------------------------------------
 * PATTERNS — single source of truth for Stillform's breathing patterns.
 *
 * Each pattern: { label, phases: [{name, duration, instruction}], totalRounds }
 *
 * Total time = sum(phase.duration) × totalRounds. Approximations:
 *   deep-regulate:  18s × 10 = ~3 min
 *   cyclic-sighing: 13s × 23 = ~5 min
 *   quick-reset:    14s × 4  = ~1 min
 * -------------------------------------------------------------------- */
const PATTERNS = {
  "deep-regulate": {
    label: "Deep Regulate",
    why: "The long exhale is the lever: a slow breath out pulls your heart rate down and signals your body the alarm can stand down.",
    phases: [
      { name: "Inhale", duration: 4, instruction: "In through your nose." },
      { name: "Hold",   duration: 4, instruction: "Hold." },
      { name: "Exhale", duration: 8, instruction: "Out through your mouth. Long and slow." },
      { name: "Rest",   duration: 2, instruction: "Rest." },
    ],
    totalRounds: 10,
  },
  "cyclic-sighing": {
    label: "Cyclic Sighing",
    why: "The two stacked inhales reopen your lungs; the long exhale offloads the most. It's the pattern research points to as one of the fastest ways to settle.",
    phases: [
      { name: "Inhale",     duration: 4, instruction: "Deep breath in through your nose." },
      { name: "Top-off",    duration: 1, instruction: "Small top-off — fill your lungs completely." },
      { name: "Exhale",     duration: 8, instruction: "Slow, complete exhale through your mouth." },
    ],
    totalRounds: 23,
  },
  "quick-reset": {
    label: "Quick Reset",
    why: "The breath out runs longer than the breath in. That longer exhale is what eases your system down.",
    phases: [
      { name: "Inhale", duration: 4, instruction: "In through your nose." },
      { name: "Hold",   duration: 4, instruction: "Hold." },
      { name: "Exhale", duration: 6, instruction: "Out through your mouth." },
    ],
    totalRounds: 4,
  },
};
