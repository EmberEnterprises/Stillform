import React, { useEffect, useState } from "react";

/**
 * BreatheOverlay — the Quick Breathe surface.
 *
 * Triggered by the persistent Quick Breathe pill on the home (canon
 * §10: "stabilization safety valve — the ONE exception" to one-element-
 * per-beat). A short, bounded breathing pacer the user can pull up
 * anytime to stabilize.
 *
 * Pattern: Cyclic Sighing (Balban 2023) — 4s inhale through nose, 1s
 * top-off (second small inhale to fully expand lungs), 8s slow exhale
 * through mouth. Double-inhale + extended exhale is the signature shape
 * of the protocol and the active ingredient in the Balban et al. 2023
 * study showing cyclic sighing outperforming box breathing and mindful
 * meditation on daily mood + state-anxiety reduction over a 28-day
 * comparison.
 *
 * Duration: 23 rounds (~5 min) — Balban et al. 2023's studied protocol
 * dose. The user runs it for as long as feels necessary; the corner X
 * close is always available for early exit. This is the user-led
 * framing: Stillform doesn't decide when you're done, you do. The
 * studied benefits (mood + state-anxiety reduction) accrue throughout
 * the protocol, not at a magic 5-min threshold — exiting at 60s or 3
 * min is fine if that's when you've settled.
 *
 * Canon §10 ("breath is a tool, not the product") rules out engagement
 * loops around breath — no streaks, no required practice, no breath-
 * use metrics — but does NOT require brevity. A 5-min optional session
 * with always-available early exit is fully consistent with the canon.
 *
 * Bounded: ~5 min if you run the full protocol, less if you don't.
 * Either way the surface auto-fades to a "done" state with a Return
 * button after the configured round count. It opens, you use it, it
 * closes. No engagement loop.
 *
 * @param {boolean} open
 * @param {function(): void} onClose
 */

// Cyclic Sighing phases. Per-phase duration (seconds) and scale value
// drive both timing and the visual breath-circle scaling. Top-off
// pushes the circle slightly larger than the main inhale (2.6 vs 2.4)
// because that second inhale meaningfully expands the lungs further —
// the geometry mirrors the breath.
const PHASES = [
  { id: "in",      label: "Breathe in",  scale: 2.4, durationMs: 4000 },
  { id: "top-off", label: "Top off",     scale: 2.6, durationMs: 1000 },
  { id: "out",     label: "Breathe out", scale: 1.0, durationMs: 8000 },
];

const TARGET_CYCLES = 23; // Full Balban 2023 protocol (~5 min at 13s/cycle)

export default function BreatheOverlay({ open, onClose, onOpenBodyScan }) {
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
    let timeoutId = null;

    // Per-phase scheduling because Cyclic Sighing has variable phase
    // durations (4s / 1s / 8s) — can't use a single setInterval. Each
    // tick reads the CURRENT phase's duration before scheduling the
    // next advance. A cycle completes when we wrap back to index 0.
    const scheduleNext = () => {
      const currentPhaseDuration = PHASES[i].durationMs;
      timeoutId = setTimeout(() => {
        i = (i + 1) % PHASES.length;
        setPhaseIndex(i);
        if (i === 0) {
          cycles += 1;
          setCycleCount(cycles);
          if (cycles >= TARGET_CYCLES) {
            setDone(true);
            return; // stop the chain
          }
        }
        scheduleNext();
      }, currentPhaseDuration);
    };
    scheduleNext();

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);

    // Lock background scroll while the overlay is open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
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
        <DoneState onClose={onClose} onDeeper={onOpenBodyScan} />
      ) : (
        <ActiveState phase={phase} cycleCount={cycleCount} onStop={onClose} />
      )}
    </div>
  );
}

/* -----------------------------------------------------------------------
 * ActiveState — the breathing pacer in motion.
 *
 * A circle that expands and contracts with the breath phase. The scale
 * transition uses the current phase's duration so the user's breath can
 * follow the geometry. Phase label below, cycle count quietly below that.
 * -------------------------------------------------------------------- */
function ActiveState({ phase, cycleCount, onStop }) {
  return (
    <>
      {/* The breath circle. Scale is set inline based on current phase,
          so React state changes drive the transition — the CSS transition
          smoothly interpolates between scales over the current phase's
          duration. Per-phase duration means Cyclic Sighing's 1s top-off
          gets a snappy expansion while the 8s exhale gets the long
          slow contraction that defines the protocol's effect. */}
      <div
        aria-hidden="true"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184, 134, 43, 0.18) 0%, rgba(184, 134, 43, 0.04) 60%, transparent 100%)",
          border: "0.5px solid var(--sf-accent-line, rgba(184, 134, 43, 0.32))",
          transform: `scale(${phase.scale})`,
          transition: `transform ${phase.durationMs}ms cubic-bezier(0.4, 0, 0.2, 1)`,
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

      {/* User-led duration note — the protocol runs up to 5 min, but
          you exit when you've settled. Subtle, mono-faint, not a
          prompt to act, just an orientation. */}
      <div
        style={{
          marginTop: "var(--sf-space-8, 8px)",
          fontFamily: "var(--sf-font-mono, monospace)",
          fontSize: "9px",
          letterSpacing: "0.12em",
          color: "var(--sf-text-faint, rgba(255,255,255,0.28))",
          textTransform: "lowercase",
        }}
      >
        the full reset runs ~5 min — but stop the moment you've settled
      </div>

      {/* Explicit early-stop. Quick Breathe often needs only a few cycles;
          the full Cyclic Sighing protocol can run long. This is the
          user-led stop — a clear control, not a hunt for the corner ×.
          Tapping it ends the practice immediately (same as onClose). */}
      <button
        type="button"
        onClick={onStop}
        style={{
          marginTop: "var(--sf-space-32, 32px)",
          background: "transparent",
          border: "none",
          borderTop: "0.5px solid var(--sf-accent-line, rgba(184,134,43,0.32))",
          borderBottom: "0.5px solid var(--sf-accent-line, rgba(184,134,43,0.32))",
          padding: "10px 22px",
          fontFamily: "var(--sf-font-mono, monospace)",
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--sf-accent, #B8862B)",
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        I've settled — done
      </button>
    </>
  );
}

/* -----------------------------------------------------------------------
 * DoneState — the bounded close.
 *
 * If the user runs the full Balban 23-round protocol (~5 min), the
 * pacer auto-completes and shows Done. If they exit early via the
 * corner X (the more common case in practice — users settle before
 * the 5-min mark), they bypass this state entirely.
 *
 * Canon §10: breath is a tool not the product. The done state is
 * restrained — single line, single Return button, no engagement
 * affordances ("how did that feel," "track your practice," etc.).
 * -------------------------------------------------------------------- */
function DoneState({ onClose, onDeeper }) {
  return (
    <>
      <h2
        style={{
          margin: 0,
          fontFamily: "var(--sf-font-serif, serif)",
          fontSize: "var(--sf-text-display-md, 28px)",
          lineHeight: 1.2,
          fontWeight: 300,
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
      {/* The deeper option (Arlin's design 2026-07-08): the quick breath just
          finished — the honest moment to offer the next rung. Quiet, below,
          never during the breath itself. */}
      {typeof onDeeper === "function" && (
        <button
          type="button"
          onClick={onDeeper}
          className="sf-link-quiet"
          style={{
            marginTop: "var(--sf-space-24, 24px)",
            background: "transparent",
            border: "none",
            color: "var(--sf-text-faint)",
            fontFamily: "var(--sf-font-serif, serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "14px",
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          Need something deeper? Run a quick Body Scan {"\u2192"}
        </button>
      )}
    </>
  );
}
