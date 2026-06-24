import React, { useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import QuickBreathe from "../components/QuickBreathe.jsx";
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
  const nav = onNavigate || (() => {});

  return (
    <>
      <div className="sf-home-aura" aria-hidden="true" />
      <div className="sf-home-grain" aria-hidden="true" />

      <AppHeader onSignIn={() => nav("paywall")} />

      <SmartScreen onEnterPractice={onEnterPractice} onOpenRoadmap={() => nav("roadmap")} />

      <div className="sf-fade-enter sf-fade-enter--delay-2">
        <HomeFooter onNavigate={nav} />
      </div>

      <QuickBreathe onTap={() => setBreatheOpen(true)} />

      <BreatheOverlay open={breatheOpen} onClose={() => setBreatheOpen(false)} />
    </>
  );
}
