import React from "react";
import "./tokens.css";
import "./components.css";
import FoundationVerify from "./screens/FoundationVerify.jsx";

/**
 * AppV2 — root of the v2 frontend.
 *
 * Currently renders only the foundation verification screen. As surfaces
 * land, this becomes a minimal router (state-driven, no library) that
 * routes between Journey / Progress / Library per the canon architecture.
 *
 * The .sf-v2 root scopes every v2 style so the existing App.jsx is
 * completely untouched.
 *
 * Anchor: STILLFORM_CANON.md §architecture (Notice → Reframe → Close spine,
 * three engines, three home surfaces)
 */
export default function AppV2() {
  return (
    <div className="sf-v2">
      <FoundationVerify />
    </div>
  );
}
