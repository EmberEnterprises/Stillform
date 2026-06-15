/**
 * StepOutOverlay — the pattern-interrupt ("Step Out") experience.
 *
 * Offered when the loop ITSELF is the thing to break (not the content). A
 * short, user-paced sensory-grounding sequence that suppresses the default-
 * mode network where rumination lives, delivered with NOVELTY each time so
 * the orienting response doesn't habituate (see patternInterrupt.js).
 *
 * User-paced, not auto-timed: the user taps "Done" on each step when they've
 * actually done it. Grounding only works if performed, not watched. 4 steps
 * + a closing somatic anchor. 60–120s in practice. Escape / corner-× exits
 * any time — never traps.
 *
 * Mirrors BreatheOverlay's overlay mechanics (fixed, scroll-lock, Escape).
 *
 * @param {boolean}  open
 * @param {function(): void} onClose
 * @param {string|null} patternLabel  the user's loop label, for the anchor
 * @param {function(): void} [onComplete]  fired once if the user reaches the
 *                                         anchor (logs the break as a data point)
 */
import { useState, useEffect, useMemo } from "react";
import { buildInterrupt } from "../lib/patternInterrupt.js";
import MonoLabel from "../components/MonoLabel.jsx";

export default function StepOutOverlay({ open, onClose, patternLabel = null, onComplete }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [atAnchor, setAtAnchor] = useState(false);
  // Fresh seed each time the overlay opens → a different sequence (novelty).
  const [seed, setSeed] = useState(() => Date.now() & 0xffffffff);

  const { steps, anchor } = useMemo(
    () => buildInterrupt({ seed, patternLabel }),
    [seed, patternLabel]
  );

  useEffect(() => {
    if (!open) return;
    setStepIdx(0);
    setAtAnchor(false);
    setSeed(Date.now() & 0xffffffff); // new sequence every open

    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const advance = () => {
    if (stepIdx < steps.length - 1) {
      setStepIdx((i) => i + 1);
    } else if (!atAnchor) {
      setAtAnchor(true);
      try { onComplete?.(); } catch { /* logging is non-fatal */ }
    }
  };

  const step = steps[stepIdx];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Step out"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "var(--sf-ground-deep, #08080A)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--sf-space-24, 24px)",
        animation: "sfFadeUp 400ms var(--sf-ease-prestige, ease-out) both",
      }}
    >
      {/* Corner exit — always available, never traps. */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute",
          top: "var(--sf-space-16, 16px)",
          right: "var(--sf-space-16, 16px)",
          width: "44px",
          height: "44px",
          background: "transparent",
          border: "none",
          color: "var(--sf-text-quiet, rgba(232,234,240,0.62))",
          fontSize: "28px",
          lineHeight: 1,
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
          padding: 0,
        }}
      >
        ×
      </button>

      {!atAnchor ? (
        <div style={{ maxWidth: "440px", width: "100%", textAlign: "center" }}>
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-24)" }}>
            Step out · {stepIdx + 1} of {steps.length}
          </MonoLabel>

          <p
            key={stepIdx}
            className="sf-fade-enter"
            style={{
              fontFamily: "var(--sf-font-serif, serif)",
              fontWeight: 300,
              fontSize: "26px",
              lineHeight: 1.35,
              color: "var(--sf-text-cream, #EDE8DC)",
              margin: 0,
            }}
          >
            {step.prompt}
          </p>

          <button
            type="button"
            onClick={advance}
            style={{
              marginTop: "var(--sf-space-48, 48px)",
              background: "transparent",
              border: "none",
              borderTop: "0.5px solid var(--sf-accent-line, rgba(184,134,43,0.35))",
              borderBottom: "0.5px solid var(--sf-accent-line, rgba(184,134,43,0.35))",
              padding: "10px 28px",
              fontFamily: "var(--sf-font-mono, monospace)",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--sf-accent, #B8862B)",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {stepIdx < steps.length - 1 ? "Done — next" : "Done"}
          </button>
        </div>
      ) : (
        <div className="sf-fade-enter" style={{ maxWidth: "460px", width: "100%", textAlign: "center" }}>
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-24)" }}>
            Stepped out
          </MonoLabel>
          <p
            style={{
              fontFamily: "var(--sf-font-serif, serif)",
              fontWeight: 300,
              fontSize: "22px",
              lineHeight: 1.45,
              color: "var(--sf-text-cream, #EDE8DC)",
              margin: 0,
            }}
          >
            {anchor}
          </p>
          <button
            type="button"
            onClick={onClose}
            style={{
              marginTop: "var(--sf-space-48, 48px)",
              background: "transparent",
              border: "none",
              borderTop: "0.5px solid var(--sf-accent-line, rgba(184,134,43,0.35))",
              borderBottom: "0.5px solid var(--sf-accent-line, rgba(184,134,43,0.35))",
              padding: "10px 28px",
              fontFamily: "var(--sf-font-mono, monospace)",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--sf-accent, #B8862B)",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            Return
          </button>
        </div>
      )}
    </div>
  );
}
