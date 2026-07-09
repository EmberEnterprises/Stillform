import React, { useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import QuickBreathe from "../components/QuickBreathe.jsx";
import BodyScan from "./BodyScan.jsx";
import HomeFooter from "../components/HomeFooter.jsx";
import SmartScreen from "./SmartScreen.jsx";
import BreatheOverlay from "./BreatheOverlay.jsx";

/**
 * Home — the page shell of the v2 home route.
 *
 * THE HOME *IS* THE PRACTICE, composed (CANON §7 + archive "one continuous
 * surface that transitions between beats" + concierge cluster). SmartScreen
 * composes the smart/concierge layer (Mirror strip, today's thread,
 * trajectory, mediation gate) AROUND the live naming surface — the user
 * lands seeing their accumulated practice AND able to name right now. No
 * primer, no doorstep: the naming field is inline on the surface, the
 * concierge elements surface above it as evidence accrues.
 *
 *   1. AppHeader — the quiet Stillform wordmark
 *   2. SmartScreen — concierge layer + live naming surface (one surface)
 *   3. HomeFooter — Progress · Library · FAQ · Settings
 *   4. QuickBreathe — stabilization safety valve (CANON §271 exception)
 *
 * @param {function(string, string|null, object?): void} onEnterPractice
 *   — called when the user commits a naming (text, chip, opts) to route
 *   into the spine's Reframe/move/reset/self flow.
 * @param {function(): void} onNavigate — footer navigation router
 */
export default function Home({ onEnterPractice, onNavigate }) {
  const [breatheOpen, setBreatheOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [breatheInfoOpen, setBreatheInfoOpen] = useState(false);
  const nav = onNavigate || (() => {});
  if (scanOpen) return <BodyScan onExit={() => setScanOpen(false)} />;


  return (
    <>
      <div className="sf-home-aura" aria-hidden="true" />
      <div className="sf-home-grain" aria-hidden="true" />

      <AppHeader onSignIn={() => nav("paywall")} />

      <SmartScreen onEnterPractice={onEnterPractice} onOpenRoadmap={() => nav("roadmap")} onOpenProgress={() => nav("progress")} onOpenLearn={() => nav("library-learn")} onOpenPreEventBrief={() => nav("pre-event-brief")} onOpenConcierge={() => nav("concierge")} />

      <div className="sf-fade-enter sf-fade-enter--delay-2">
        <HomeFooter onNavigate={nav} />
      </div>

      <QuickBreathe onTap={() => setBreatheOpen(true)} onOpenInfo={() => setBreatheInfoOpen(true)} />

      <BreatheOverlay open={breatheOpen} onClose={() => setBreatheOpen(false)} />
      {/* Quick Breathe info (Arlin's design 2026-07-08): how it works + the
          duration being entirely the user's — and in the space beneath the
          information, the deeper option. */}
      {breatheInfoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="About Quick Breathe"
          onClick={() => setBreatheInfoOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 320, background: "rgba(0,0,0,0.82)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--sf-space-24)" }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420, background: "var(--sf-ground-elev)", border: "0.5px solid var(--sf-border-hairline)", padding: "var(--sf-space-24)" }}>
            <p style={{ fontFamily: "var(--sf-font-mono)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--sf-accent)", margin: "0 0 var(--sf-space-12)" }}>Quick Breathe</p>
            <p style={{ fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "15px", lineHeight: 1.65, color: "var(--sf-text-primary)", margin: "0 0 var(--sf-space-12)" }}>
              A physiological sigh, paced: breathe in, a small top-off inhale, then a long slow exhale. The extended out-breath is the lever — it settles the system faster than any other single move.
            </p>
            <p style={{ fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "15px", lineHeight: 1.65, color: "var(--sf-text-primary)", margin: "0 0 var(--sf-space-16)" }}>
              The length is completely up to you. There's no target count — run it as long as feels right and stop with the \u00d7 whenever you're done.
            </p>
            <button
              type="button"
              className="sf-link-quiet"
              onClick={() => { setBreatheInfoOpen(false); setScanOpen(true); }}
              style={{ background: "transparent", border: "none", color: "var(--sf-text-faint)", fontFamily: "var(--sf-font-serif)", fontStyle: "italic", fontWeight: 300, fontSize: "14px", cursor: "pointer", padding: 0, WebkitTapHighlightColor: "transparent" }}
            >
              Need something deeper? Run a quick Body Scan {"\u2192"}
            </button>
            <div style={{ marginTop: "var(--sf-space-16)" }}>
              <button type="button" onClick={() => setBreatheInfoOpen(false)} style={{ background: "transparent", border: "0.5px solid var(--sf-accent-line)", color: "var(--sf-accent)", fontFamily: "var(--sf-font-mono)", fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", padding: "10px 18px", cursor: "pointer", minHeight: "40px", WebkitTapHighlightColor: "transparent" }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
