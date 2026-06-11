import React, { useState, useEffect } from "react";
import "./tokens.css";
import "./components.css";
import Home from "./screens/Home.jsx";
import Spine from "./screens/Spine.jsx";
import FoundationVerify from "./screens/FoundationVerify.jsx";
import MyProgress from "./screens/MyProgress.jsx";
import ContextProfile from "./screens/ContextProfile.jsx";
import TriggerProfile from "./screens/TriggerProfile.jsx";
import BiasProfile from "./screens/BiasProfile.jsx";
import CapacitiesMirror from "./screens/CapacitiesMirror.jsx";
import RiskProfileMirror from "./screens/RiskProfileMirror.jsx";
import PredictionErrorMirror from "./screens/PredictionErrorMirror.jsx";
import WhatYouBetOnMirror from "./screens/WhatYouBetOnMirror.jsx";
import Library from "./screens/Library.jsx";
import PreEventBrief from "./screens/PreEventBrief.jsx";
import Paywall from "./screens/Paywall.jsx";
import Onboarding from "./screens/Onboarding.jsx";
import Settings from "./screens/Settings.jsx";
import FAQ from "./screens/FAQ.jsx";
import CrisisResources from "./screens/CrisisResources.jsx";
import { isOnboarded, setOnboarded } from "./lib/onboarding.js";
import { shouldGate } from "./lib/gating.js";
import { refreshSubscriptionStatus } from "./lib/subscriptionApi.js";

/**
 * AppV2 — root of the v2 frontend.
 *
 * Phase 5 routing (state machine, no URL hash for now):
 *   home            → main journey home, beat-aware (Phase 1)
 *   spine           → Notice → Reframe → Close (Phase 2)
 *   my-progress     → diagnostic stack landing (Phase 5 sub-item #2)
 *   context-profile → diagnostic stack editor (Phase 5 sub-item #1)
 *   verify          → foundation primitives audit (?v=2&verify=1)
 *
 * Two-level back behavior under Progress:
 *   home → my-progress (Progress link in HomeFooter)
 *   my-progress → context-profile (entry tap)
 *   context-profile → my-progress (back from editor)
 *   my-progress → home (back from landing)
 *
 * Anchor: STILLFORM_CANON.md §architecture.
 */
function pickInitialScreen() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verify") === "1") return "verify";
    if (params.get("paywall") === "1") return "paywall";
    if (params.get("onboard") === "1") return "onboarding";
  } catch {
    /* noop */
  }
  // First-run: a brand-new device sees the intro before Home.
  if (!isOnboarded()) return "onboarding";
  return "home";
}

export default function AppV2() {
  const [screen, setScreen] = useState(pickInitialScreen);
  // Phase 6.4c: one-shot forced beat for a manual launch (post-event from
  // My Progress). Set right before routing to "spine", consumed by Spine at
  // mount, cleared on exit. Null for the normal time-routed home session.
  const [spineBeat, setSpineBeat] = useState(null);

  // Phase 8c: warm the subscription-status cache once on mount so the gate
  // decision (shouldGate) has a resolved status to read. Fail-open: until
  // this lands, shouldGate returns false (no wall), so a slow/failed fetch
  // never blocks a session.
  useEffect(() => {
    refreshSubscriptionStatus();
  }, []);

  if (screen === "verify") {
    return (
      <div className="sf-v2">
        <FoundationVerify />
      </div>
    );
  }

  if (screen === "spine") {
    return (
      <div className="sf-v2">
        <Spine
          forcedBeat={spineBeat}
          onExit={() => {
            setSpineBeat(null);
            setScreen("home");
          }}
        />
      </div>
    );
  }

  if (screen === "my-progress") {
    return (
      <div className="sf-v2">
        <MyProgress
          onExit={() => setScreen("home")}
          onNavigate={(target) => {
            // Map editor ids → screen state. As future editors ship,
            // they add their case here. Unknown targets fall through
            // silently (defensive — landing only emits known ids).
            if (target === "context-profile") setScreen("context-profile");
            else if (target === "trigger-profile") setScreen("trigger-profile");
            else if (target === "bias-profile") setScreen("bias-profile");
            else if (target === "capacities-mirror") setScreen("capacities-mirror");
            else if (target === "risk-profile") setScreen("risk-profile");
            else if (target === "prediction-mirror") setScreen("prediction-mirror");
            else if (target === "what-you-bet-on") setScreen("what-you-bet-on");
            // Phase 6.4c: post-event reflection — launch the spine in the
            // post-event beat (one-shot). The one manual, deliberate beat.
            else if (target === "post-event") {
              setSpineBeat("post-event");
              setScreen("spine");
            }
            // Phase 7d: Pre-event Brief — its own standalone artifact screen
            // (not a beat). Manual entry now; calendar-driven entry is Phase 9.
            else if (target === "pre-event-brief") setScreen("pre-event-brief");
          }}
        />
      </div>
    );
  }

  if (screen === "context-profile") {
    return (
      <div className="sf-v2">
        {/* onExit returns to my-progress (parent), NOT home. AppV2
            owns the route stack; ContextProfile doesn't know its
            parent. */}
        <ContextProfile onExit={() => setScreen("my-progress")} />
      </div>
    );
  }

  if (screen === "trigger-profile") {
    return (
      <div className="sf-v2">
        <TriggerProfile onExit={() => setScreen("my-progress")} />
      </div>
    );
  }

  if (screen === "bias-profile") {
    return (
      <div className="sf-v2">
        <BiasProfile onExit={() => setScreen("my-progress")} />
      </div>
    );
  }

  if (screen === "capacities-mirror") {
    return (
      <div className="sf-v2">
        <CapacitiesMirror onExit={() => setScreen("my-progress")} />
      </div>
    );
  }

  if (screen === "risk-profile") {
    return (
      <div className="sf-v2">
        <RiskProfileMirror onExit={() => setScreen("my-progress")} />
      </div>
    );
  }

  if (screen === "prediction-mirror") {
    return (
      <div className="sf-v2">
        <PredictionErrorMirror onExit={() => setScreen("my-progress")} />
      </div>
    );
  }

  if (screen === "what-you-bet-on") {
    return (
      <div className="sf-v2">
        <WhatYouBetOnMirror onExit={() => setScreen("my-progress")} />
      </div>
    );
  }

  if (screen === "library") {
    return (
      <div className="sf-v2">
        <Library onExit={() => setScreen("home")} />
      </div>
    );
  }

  if (screen === "pre-event-brief") {
    return (
      <div className="sf-v2">
        <PreEventBrief
          onDone={() => setScreen("home")}
          onExit={() => setScreen("my-progress")}
        />
      </div>
    );
  }

  if (screen === "paywall") {
    return (
      <div className="sf-v2">
        <Paywall onClose={() => setScreen("home")} />
      </div>
    );
  }

  if (screen === "onboarding") {
    return (
      <div className="sf-v2">
        <Onboarding
          onComplete={() => {
            setOnboarded();
            setScreen("home");
          }}
        />
      </div>
    );
  }

  if (screen === "settings") {
    return (
      <div className="sf-v2">
        <Settings onExit={() => setScreen("home")} />
      </div>
    );
  }

  if (screen === "crisis-resources") {
    return (
      <div className="sf-v2">
        <CrisisResources onExit={() => setScreen("home")} />
      </div>
    );
  }

  if (screen === "faq") {
    return (
      <div className="sf-v2">
        <FAQ onExit={() => setScreen("home")} />
      </div>
    );
  }

  return (
    <div className="sf-v2">
      <Home
        onBeginSession={() => {
          // Normal session = the time-routed beat. Clear any stale forced
          // beat so a prior post-event launch can't leak into this one.
          setSpineBeat(null);
          // Phase 8c: gate the practice after the free limit (fail-open —
          // shouldGate only returns true when confidently past-limit AND
          // confirmed not-subscribed). Quick Breathe stays free regardless.
          if (shouldGate()) {
            setScreen("paywall");
            return;
          }
          setScreen("spine");
        }}
        onNavigate={(target) => {
          // Phase 5: 'progress' routes to the MyProgress landing,
          // 'library' to the Library (Workshop section live; curated
          // knowledge cards join later). 'settings' to the Settings surface.
          // FAQ and Crisis-Resources route to their screens.
          if (target === "progress") setScreen("my-progress");
          else if (target === "library") setScreen("library");
          else if (target === "settings") setScreen("settings");
          else if (target === "faq") setScreen("faq");
          else if (target === "crisis-resources") setScreen("crisis-resources");
        }}
      />
    </div>
  );
}
