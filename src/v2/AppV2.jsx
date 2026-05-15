import React, { useState } from "react";
import "./tokens.css";
import "./components.css";
import Home from "./screens/Home.jsx";
import Spine from "./screens/Spine.jsx";
import FoundationVerify from "./screens/FoundationVerify.jsx";

/**
 * AppV2 — root of the v2 frontend.
 *
 * Phase 2 routing (state machine, no URL hash for now):
 *   home   → main journey home, beat-aware (Phase 1)
 *   spine  → Notice → Reframe → Close (Phase 2)
 *   verify → foundation primitives audit (?v=2&verify=1)
 *
 * Browser back behavior: Phase 2 doesn't intercept the back button. If
 * the user backs out of the spine, they exit v2 entirely. Cleanly
 * handling Android back / browser back inside the spine is Phase 2.5.
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

  return (
    <div className="sf-v2">
      <Home onBeginSession={() => setScreen("spine")} />
    </div>
  );
}
