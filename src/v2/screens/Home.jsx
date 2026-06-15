import React, { useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import QuickBreathe from "../components/QuickBreathe.jsx";
import HomeFooter from "../components/HomeFooter.jsx";
import Spine from "./Spine.jsx";
import BreatheOverlay from "./BreatheOverlay.jsx";

/**
 * Home — the page shell of the v2 home route.
 *
 * THE HOME *IS* THE PRACTICE (locked architecture, CANON §7 + archive
 * "one continuous surface that transitions between beats"). There is no
 * primer/landing screen that announces the practice and hands off to a
 * separate naming screen — that pattern is explicitly architecturally
 * wrong (archive: "part of the main card / journey arc, not a parallel
 * surface the user dismisses to reveal a separate hero"). The user opens
 * the app and is ALREADY in the current beat's practice surface — the
 * Notice naming step, textarea live, ready to use.
 *
 * Layers:
 *   1. AppHeader — the quiet Stillform wordmark
 *   2. Spine (isBaseEntry) — the live practice; starts at the beat's
 *      Notice naming surface (no back affordance on the base step —
 *      nothing is behind home). Naming → Reframe → Close flows in place.
 *   3. HomeFooter — Progress · Library · FAQ · Settings (stays reachable)
 *   4. QuickBreathe — stabilization safety valve (CANON §271 exception)
 *
 * onBeginSession is retained for callers that still launch a session
 * explicitly (e.g. a forced beat from elsewhere); the base home no longer
 * needs a "begin" tap because the practice is already on screen.
 *
 * @param {function(): void} onNavigate — footer navigation target router
 */
export default function Home({ onNavigate }) {
  const [breatheOpen, setBreatheOpen] = useState(false);

  const nav = onNavigate || (() => {});

  return (
    <>
      <AppHeader />

      <Spine
        isBaseEntry={true}
        onExit={() => {
          // "Exit"/completion from the base practice returns to the base
          // practice — there is no separate home behind it. Re-mounting the
          // Spine resets to a fresh naming surface for the current beat.
          nav("home-refresh");
        }}
        onNavigate={nav}
      />

      <div className="sf-fade-enter sf-fade-enter--delay-2">
        <HomeFooter onNavigate={nav} />
      </div>

      <QuickBreathe onTap={() => setBreatheOpen(true)} />

      <BreatheOverlay open={breatheOpen} onClose={() => setBreatheOpen(false)} />
    </>
  );
}
