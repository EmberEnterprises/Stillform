import React, { useEffect, useState } from "react";

/**
 * BreatheOverlay — the Quick Breathe surface.
 *
 * Triggered by the persistent Quick Breathe pill on the home (canon
 * §10: "stabilization safety valve — the ONE exception" to one-element-
 * per-beat). A short, bounded breathing pacer the user can pull up
 * anytime to stabilize.
 *
 * Pattern: box breathing — 4s inhale · 4s hold · 4s exhale · 4s hold.
 * Universally calming, no contraindications, well-understood (Naval
 * SEALs / Andrew Huberman / clinical literature). v2 ships with this
 * one pattern; cyclic-sigh and quick-reset variants can come back in
 * Phase 3 alongside the user-config layer.
 *
 * Bounded: ~96s (six cycles), then auto-fades to a "done" state with a
 * Return button. Per canon framing law: breath is a TOOL not the product.
 * It opens, you use it, it closes. No engagement loop.
 *
 * @param {boolean} open
 * @param {function(): void} onClose
 */

const PHASES = [
  { id: "in",     label: "Breathe in", scale: 2.4 },
  { id: "hold-1", label: "Hold",       scale: 2.4 },
  { id: "out",    label: "Breathe out", scale: 1   },
  { id: "hold-2", label: "Hold",       scale: 1   },
];

const PHASE_DURATION_MS = 4000;
const TARGET_CYCLES = 6; // ~96s total

export default function BreatheOverlay({ open, onClose }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    // Reset state on open.
    setPhaseIndex(0);
    setCycleCount(0);
    setDone(false);

    let i = 0;
    let cycles = 0;
    const tick = setInterval(() => {
      i = (i + 1) % PHASES.length;
      setPhaseIndex(i);
      // A cycle completes when we wrap back to 'in' (index 0).
      if (i === 0) {
        cycles += 1;
        setCycleCount(cycles);
        if (cycles >= TARGET_CYCLES) {
          clearInterval(tick);
          setDone(true);
        }
      }
    }, PHASE_DURATION_MS);

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);

    // Lock background scroll while the overlay is open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      clearInterval(tick);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const phase = PHASES[phaseIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Quick Breathe"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(0, 0, 0, 0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--sf-space-24, 24px)",
        animation: "sfFadeUp 400ms var(--sf-ease-prestige, ease-out) both",
      }}
    >
      {/* Corner close — generous 44pt tap target. The done state also
          surfaces a primary Return button; the corner X is there during
          the practice for early exits. */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close Quick Breathe"
        style={{
          position: "absolute",
          top: "var(--sf-space-16, 16px)",
          right: "var(--sf-space-16, 16px)",
          width: "44px",
          height: "44px",
          background: "transparent",
          border: "none",
          color: "var(--sf-text-quiet, rgba(255,255,255,0.55))",
          fontSize: "28px",
          lineHeight: 1,
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
          padding: 0,
        }}
      >
        ×
      </button>

      {done ? (
        <DoneState onClose={onClose} />
      ) : (
        <ActiveState phase={phase} cycleCount={cycleCount} />
      )}
    </div>
  );
}

/* -----------------------------------------------------------------------
 * ActiveState — the breathing pacer in motion.
 *
 * A circle that expands and contracts with the breath phase. The scale
 * transition uses the phase's full 4s duration so the user's breath can
 * follow the geometry. Phase label below, cycle count quietly below that.
 * -------------------------------------------------------------------- */
function ActiveState({ phase, cycleCount }) {
  return (
    <>
      {/* The breath circle. Scale is set inline based on current phase,
          so React state changes drive the transition — the CSS transition
          smoothly interpolates between scales over PHASE_DURATION_MS. */}
      <div
        aria-hidden="true"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184, 134, 43, 0.18) 0%, rgba(184, 134, 43, 0.04) 60%, transparent 100%)",
          border: "0.5px solid var(--sf-accent-line, rgba(184, 134, 43, 0.32))",
          transform: `scale(${phase.scale})`,
          transition: "transform 4000ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      <div
        // Keyed by phase so the label fades in on each phase change.
        key={phase.id}
        className="sf-fade-enter"
        style={{
          marginTop: "var(--sf-space-64, 64px)",
          fontFamily: "var(--sf-font-mono, monospace)",
          fontSize: "12px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--sf-text-cream, #EDE8DC)",
        }}
      >
        {phase.label}
      </div>

      <div
        style={{
          marginTop: "var(--sf-space-16, 16px)",
          fontFamily: "var(--sf-font-mono, monospace)",
          fontSize: "10px",
          letterSpacing: "0.14em",
          color: "var(--sf-text-faint, rgba(255,255,255,0.35))",
        }}
      >
        Cycle {cycleCount + 1} of {TARGET_CYCLES}
      </div>
    </>
  );
}

/* -----------------------------------------------------------------------
 * DoneState — the bounded close.
 *
 * Six cycles is enough for a stabilization pass; longer drifts into
 * meditation-app territory (canon: breath is a tool, not the product).
 * The user sees a single restrained "Done." line + Return button.
 * -------------------------------------------------------------------- */
function DoneState({ onClose }) {
  return (
    <>
      <h2
        style={{
          margin: 0,
          fontFamily: "var(--sf-font-serif, serif)",
          fontSize: "var(--sf-text-display-md, 28px)",
          lineHeight: 1.2,
          fontWeight: 400,
          color: "var(--sf-text-cream, #EDE8DC)",
          letterSpacing: "-0.01em",
        }}
      >
        Done.
      </h2>
      <button
        type="button"
        onClick={onClose}
        style={{
          marginTop: "var(--sf-space-48, 48px)",
          padding: "14px 28px",
          background: "var(--sf-ground-elev, #111114)",
          border: "0.5px solid var(--sf-accent-line, rgba(184, 134, 43, 0.32))",
          color: "var(--sf-accent, #B8862B)",
          fontFamily: "var(--sf-font-mono, monospace)",
          fontSize: "12px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          cursor: "pointer",
          minHeight: "44px",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        Return
      </button>
    </>
  );
}
