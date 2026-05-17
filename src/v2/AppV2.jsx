import React, { useState } from "react";
import "./tokens.css";
import "./components.css";
import Home from "./screens/Home.jsx";
import Spine from "./screens/Spine.jsx";
import FoundationVerify from "./screens/FoundationVerify.jsx";
import MyProgress from "./screens/MyProgress.jsx";
import ContextProfile from "./screens/ContextProfile.jsx";
import TriggerProfile from "./screens/TriggerProfile.jsx";

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
 * The .sf-v2 root scopes every v2 style so the existing App.jsx is
 * completely untouched.
 *
 * Anchor: STILLFORM_CANON.md §architecture.
 */
function pickInitialScreen() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verify") === "1") return "verify";
  } catch {
    /* noop */
  }
  return "home";
}

export default function AppV2() {
  const [screen, setScreen] = useState(pickInitialScreen);

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
        <Spine onExit={() => setScreen("home")} />
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

  return (
    <div className="sf-v2">
      <Home
        onBeginSession={() => setScreen("spine")}
        onNavigate={(target) => {
          // Phase 5: 'progress' routes to the MyProgress landing.
          // Library / FAQ / Settings / Crisis-Resources stay no-op
          // until their own sub-items ship.
          if (target === "progress") setScreen("my-progress");
        }}
      />
    </div>
  );
}
