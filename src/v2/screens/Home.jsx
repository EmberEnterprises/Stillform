import React, { useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import QuickBreathe from "../components/QuickBreathe.jsx";
import HomeFooter from "../components/HomeFooter.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import SmartScreen from "./SmartScreen.jsx";
import BreatheOverlay from "./BreatheOverlay.jsx";

/**
 * Home — the page shell of the v2 home route.
 *
 * Renders the four persistent layers of the home:
 *
 *   1. AppHeader (top) — the quiet Stillform wordmark, nothing else
 *   2. SmartScreen (main) — Phase 3 smart screen (Mirror + Thread +
 *      Active prompt + Trajectory, progressively activating per practice).
 *   3. HomeFooter (below main) — Progress · Library · FAQ · Settings
 *   4. QuickBreathe (fixed bottom-right) — stabilization safety valve
 *
 * Quick Breathe wiring: the pill opens BreatheOverlay (the actual breath
 * pacer surface).
 *
 * Phase 3 swapped the prior single-card "Today" surface for the smart
 * screen — same compounding-visible-on-home spirit, but with editorial
 * composition of multiple substantive sections per the locked v2 truth
 * (Mirror strip + Thread + Active prompt + Trajectory). Today.jsx is
 * kept in the repo for git history but is no longer mounted.
 *
 * @param {function(): void} onBeginSession — opens the spine when the
 *   Active prompt's Begin button is tapped.
 */
export default function Home({ onBeginSession }) {
  const [breatheOpen, setBreatheOpen] = useState(false);

  return (
    <>
      <AppHeader />

      <SmartScreen onBeginSession={onBeginSession} />

      <div className="sf-fade-enter sf-fade-enter--delay-2">
        <HomeFooter onNavigate={() => { /* Phase 5+ */ }} />
      </div>

      <QuickBreathe onTap={() => setBreatheOpen(true)} />

      <BreatheOverlay open={breatheOpen} onClose={() => setBreatheOpen(false)} />

      {/* Phase indicator — removed when all surfaces are fully functional. */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: "var(--sf-space-8)",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      >
        <MonoLabel size="xs" tone="faint">
          v2 · phase 3 · smart screen
        </MonoLabel>
      </div>
    </>
  );
}
