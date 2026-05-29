import React, { useState, useEffect, useRef } from "react";
import MonoLabel from "./MonoLabel.jsx";
import Button from "./Button.jsx";

/**
 * MoveRunner — Move card sequence runner (Phase 6.2a).
 *
 * The somatic-disruptor analog of BreathingSession. Where BreathingSession
 * runs a breathing pattern (rounds × phases), MoveRunner walks a single Move
 * card sequence — a linear list of timed prompts from MOVE_CARD_DATABASE
 * (src/v2/lib/moveCard/database.js). Each prompt shows its text for
 * prompt.durationMs, then auto-advances; total run ≈ sequence.durationMs.
 *
 * Decoupled from the handoff on purpose: finishing the last prompt fires
 * onComplete; "End early" fires onExit. The reflection / "keep going vs done"
 * choice is the caller's job (Spine move step — 6.2c), so the runner stays a
 * pure, reusable player — the same separation BreathingSession has from
 * Close / WindDown.
 *
 * Not gamified (MOVE_CARD_FLOW_AUDIT.md §8 voice): no count toward a goal, no
 * streak, no score — just the prompt and the time left on it. The step
 * indicator is orientation, not a tally.
 *
 * @param {object} props
 * @param {object} props.sequence  a MOVE_CARD_DATABASE entry:
 *   { id, durationMs, prompts: [{ text, durationMs, kind }], ... }
 * @param {function({sequenceId, durationMs, completed})} props.onComplete
 *   fired when the final prompt finishes
 * @param {function({sequenceId, durationMs, completed, stepsCompleted})} props.onExit
 *   fired on "End early"
 */
export default function MoveRunner({ sequence, onComplete, onExit }) {
  const prompts = Array.isArray(sequence?.prompts) ? sequence.prompts : [];
  const secondsFor = (i) => Math.max(1, Math.round((prompts[i]?.durationMs || 0) / 1000));

  const [promptIndex, setPromptIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(() => secondsFor(0));
  const startTimestampRef = useRef(Date.now());

  // Degenerate input (no prompts) — fail safe: complete immediately rather
  // than render a broken runner. Can't happen from the Database, but the
  // runner shouldn't trust its caller.
  useEffect(() => {
    if (prompts.length === 0 && typeof onComplete === "function") {
      onComplete({ sequenceId: sequence?.id || null, durationMs: 0, completed: true });
    }
    // mount-only guard for the degenerate case
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1-second tick. At 0, advance to the next prompt, or complete after the
  // last. Mirrors BreathingSession's tick — linear (no rounds).
  useEffect(() => {
    if (prompts.length === 0) return;
    if (secondsLeft <= 0) {
      const isLast = promptIndex >= prompts.length - 1;
      if (!isLast) {
        const next = promptIndex + 1;
        setPromptIndex(next);
        setSecondsLeft(secondsFor(next));
      } else if (typeof onComplete === "function") {
        onComplete({
          sequenceId: sequence?.id || null,
          durationMs: Date.now() - startTimestampRef.current,
          completed: true,
        });
      }
      return;
    }
    const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, promptIndex, prompts, sequence, onComplete]);

  const handleEndEarly = () => {
    if (typeof onExit === "function") {
      onExit({
        sequenceId: sequence?.id || null,
        durationMs: Date.now() - startTimestampRef.current,
        completed: false,
        stepsCompleted: promptIndex,
      });
    }
  };

  if (prompts.length === 0) return null;

  const current = prompts[promptIndex];
  const totalSeconds = secondsFor(promptIndex);
  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <main className="sf-page sf-page--hero">
      <div className="sf-fade-enter" style={{ textAlign: "center" }}>
        <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
          Quick Move · Step {promptIndex + 1} of {prompts.length}
        </MonoLabel>

        <div
          style={{
            fontSize: "clamp(1.25rem, 4.5vw, 1.875rem)",
            fontFamily: "var(--sf-font-display)",
            fontWeight: "var(--sf-weight-light)",
            color: "var(--sf-text-primary)",
            lineHeight: 1.4,
            letterSpacing: "-0.01em",
            maxWidth: "32rem",
            margin: "0 auto var(--sf-space-32)",
          }}
        >
          {current.text}
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
          aria-valuenow={Math.round(progressPercent)}
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
              width: `${progressPercent}%`,
              background: "var(--sf-accent)",
              transition: "width 1s linear",
            }}
          />
        </div>

        <Button variant="ghost" onClick={handleEndEarly}>
          End early
        </Button>
      </div>
    </main>
  );
}
