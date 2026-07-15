import React, { useState } from "react";
import QuickBreathe from "./QuickBreathe.jsx";
import BreatheOverlay from "../screens/BreatheOverlay.jsx";
import BodyScan from "../screens/BodyScan.jsx";

/**
 * BreathAnywhere — the Quick Breathe pill, everywhere (Arlin's v1 decision,
 * restored 2026-07-14). The v2 rebuild had regressed the pill to Home-only;
 * this lifts the whole cluster (pill + overlay + info + Body-Scan escalation)
 * into one component mounted once at the app shell, so it floats over EVERY
 * screen — all mirrors, profiles, Settings, Library, Progress, and every
 * practice beat, because a practice is exactly where something can surface
 * that needs breath now.
 *
 * The one screen without a visible pill is the active breathe overlay itself —
 * because the pill BECOMES that overlay when tapped. One system, not an
 * exception: the pill hides while `breatheOpen` so it never floats over the
 * breath it launched.
 *
 * Body Scan is the ESCALATION, never a parallel choice — offered only when
 * breath didn't land ("not yet"), owned by the overlay's did-that-land tap and
 * the info panel's deeper-option link.
 */
export default function BreathAnywhere() {
  const [breatheOpen, setBreatheOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  // The scan takes the whole surface when escalated to.
  if (scanOpen) return <BodyScan onExit={() => setScanOpen(false)} />;

  return (
    <>
      {/* The pill hides while the overlay is open — the pill IS the overlay,
          fulfilled, so it must not float over the breath it launched. */}
      {!breatheOpen && (
        <QuickBreathe onTap={() => setBreatheOpen(true)} onOpenInfo={() => setInfoOpen(true)} />
      )}

      <BreatheOverlay
        open={breatheOpen}
        onClose={() => setBreatheOpen(false)}
        onEscalateToScan={() => setScanOpen(true)}
      />

      {infoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="About Quick Breathe"
          onClick={() => setInfoOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 320, background: "rgba(0,0,0,0.82)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--sf-space-24)" }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420, background: "var(--sf-ground-elev)", border: "0.5px solid var(--sf-border-hairline)", padding: "var(--sf-space-24)" }}>
            <p style={{ fontFamily: "var(--sf-font-mono)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--sf-accent)", margin: "0 0 var(--sf-space-12)" }}>Quick Breathe</p>
            <p style={{ fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "15px", lineHeight: 1.65, color: "var(--sf-text-primary)", margin: "0 0 var(--sf-space-12)" }}>
              About a minute · no typing · stop whenever you want. A physiological sigh, paced: breathe in, a small top-off inhale, then a long slow exhale. The extended out-breath is the lever — it settles the system faster than any other single move.
            </p>
            <p style={{ fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "15px", lineHeight: 1.65, color: "var(--sf-text-primary)", margin: "0 0 var(--sf-space-16)" }}>
              The length is completely up to you — most runs land around a minute, no typing ever. There's no target count; run it as long as feels right and stop with the &times; whenever you're done.
            </p>
            <button
              type="button"
              className="sf-link-quiet"
              onClick={() => { setInfoOpen(false); setScanOpen(true); }}
              style={{ background: "transparent", border: "none", color: "var(--sf-text-faint)", fontFamily: "var(--sf-font-serif)", fontStyle: "italic", fontWeight: 300, fontSize: "14px", cursor: "pointer", padding: 0, WebkitTapHighlightColor: "transparent" }}
            >
              Need something deeper? Run a quick Body Scan {"\u2192"}
            </button>
            <div style={{ marginTop: "var(--sf-space-16)" }}>
              <button type="button" onClick={() => setInfoOpen(false)} style={{ background: "transparent", border: "0.5px solid var(--sf-accent-line)", color: "var(--sf-accent)", fontFamily: "var(--sf-font-mono)", fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", padding: "10px 18px", cursor: "pointer", minHeight: "40px", WebkitTapHighlightColor: "transparent" }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
