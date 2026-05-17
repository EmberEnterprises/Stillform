import React, { useState } from "react";
import "./tokens.css";
import "./components.css";
import Home from "./screens/Home.jsx";
import Spine from "./screens/Spine.jsx";
import FoundationVerify from "./screens/FoundationVerify.jsx";
import ContextProfile from "./screens/ContextProfile.jsx";

/**
 * AppV2 — root of the v2 frontend.
 *
 * Phase 5 routing (state machine, no URL hash for now):
 *   home            → main journey home, beat-aware (Phase 1)
 *   spine           → Notice → Reframe → Close (Phase 2)
 *   context-profile → diagnostic stack editor (Phase 5 sub-item #1)
 *   verify          → foundation primitives audit (?v=2&verify=1)
 *
 * Phase 5 note: context-profile is currently routed directly from
 * HomeFooter's Progress link as a placeholder. When the full My Progress
 * landing surface ships (later Phase 5 sub-item), Progress will route
 * to that landing and ContextProfile becomes one tab inside it.
 *
 * Browser back behavior: state machine doesn't intercept the back
 * button. Each editor screen passes an onExit handler that returns
 * to home.
 *
 * The .sf-v2 root scopes every v2 style so the existing App.jsx is
 * completely untouched.
 *
 * Anchor: STILLFORM_CANON.md §architecture (Notice → Reframe → Close spine,
 * three engines, three home surfaces, one element per beat).
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

  if (screen === "context-profile") {
    return (
      <div className="sf-v2">
        <ContextProfile onExit={() => setScreen("home")} />
      </div>
    );
  }

  return (
    <div className="sf-v2">
      <Home
        onBeginSession={() => setScreen("spine")}
        onNavigate={(target) => {
          // Phase 5 sub-item #1: "progress" is the only nav id with a
          // real destination right now. Routes directly to the Context
          // Profile editor as a placeholder until the full My Progress
          // landing surface ships (later sub-item). Other ids (library,
          // faq, settings, crisis-resources) stay no-op for now.
          if (target === "progress") setScreen("context-profile");
        }}
      />
    </div>
  );
}
