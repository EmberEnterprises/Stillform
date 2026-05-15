import React from "react";
import "./tokens.css";
import "./components.css";
import Home from "./screens/Home.jsx";
import FoundationVerify from "./screens/FoundationVerify.jsx";

/**
 * AppV2 — root of the v2 frontend.
 *
 * Default: renders the Home surface (Phase 1+). Foundation verification
 * screen remains accessible via `?v=2&verify=1` for re-auditing tokens
 * and primitives whenever the design system gets updated.
 *
 * As Notice → Reframe → Close lands in Phase 2 and other surfaces follow,
 * this becomes a minimal router (state-driven, no library) between
 * Journey (home), Progress, and Library per the canon's three-surface
 * architecture.
 *
 * The .sf-v2 root scopes every v2 style so the existing App.jsx is
 * completely untouched.
 *
 * Anchor: STILLFORM_CANON.md §architecture (Notice → Reframe → Close spine,
 * three engines, three home surfaces, one element per beat).
 */
function pickScreen() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verify") === "1") return "verify";
  } catch {
    /* noop */
  }
  return "home";
}

export default function AppV2() {
  const screen = pickScreen();
  return (
    <div className="sf-v2">
      {screen === "verify" ? <FoundationVerify /> : <Home />}
    </div>
  );
}
