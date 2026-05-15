import React from "react";
import AppHeader from "../components/AppHeader.jsx";
import QuickBreathe from "../components/QuickBreathe.jsx";
import HomeFooter from "../components/HomeFooter.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import Today from "./Today.jsx";

/**
 * Home — the page shell of the v2 home route.
 *
 * Renders the four persistent layers of the home:
 *
 *   1. AppHeader (top) — the quiet Stillform wordmark, nothing else
 *   2. Today (main) — the ONE unified beat (thread + active prompt)
 *   3. HomeFooter (below main) — Progress · Library · FAQ · Settings
 *   4. QuickBreathe (fixed bottom-right) — stabilization safety valve
 *
 * Plus the crisis sub-footer (App Store / safety baseline) under the
 * nav row, visually subordinate so it doesn't signal crisis-tool framing.
 *
 * The journey content lives in Today.jsx. Home is just the page-level
 * composition — the shell that contains it.
 *
 * @param {function(): void} onBeginSession — opens the spine when the
 *   Today card's Begin button is tapped.
 */
export default function Home({ onBeginSession }) {
  return (
    <>
      <AppHeader />

      <Today onBeginSession={onBeginSession} />

      <div className="sf-fade-enter sf-fade-enter--delay-2">
        <HomeFooter onNavigate={() => { /* Phase 3+ */ }} />
      </div>

      <QuickBreathe onTap={() => { /* Phase 2.5 wires the actual breath tool */ }} />

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
          v2 · phase 2 · today thread
        </MonoLabel>
      </div>
    </>
  );
}
