import React from "react";
import MonoLabel from "./MonoLabel.jsx";

/**
 * QuickBreathe — the ONE persistent surface across home beats.
 *
 * Per STILLFORM_CANON.md §10: "The home renders ONE current-beat surface
 * per view... plus the persistent Quick Breathe pill (stabilization
 * safety valve — the ONE exception)."
 *
 * Phase 1: fixed bottom-right, hairline border, ghost amber dot, mono-sm
 * label. No actual breath tool yet — that wires in Phase 2 with the spine.
 * Tapping the pill is a no-op for now; visual placement and treatment is
 * what Phase 1 verifies.
 *
 * Future: drag mechanics + position persistence are an optional polish
 * pass once the static placement is verified.
 *
 * Design system notes: amber is used at MAX 5% of any screen. Here the
 * accent appears as a small dot (4px) + the border hairline. Never as fill.
 */
export default function QuickBreathe({ onTap }) {
  const handleTap = () => {
    if (typeof onTap === "function") onTap();
  };

  return (
    <button
      type="button"
      onClick={handleTap}
      aria-label="Quick Breathe"
      style={{
        position: "fixed",
        right: "var(--sf-space-16)",
        bottom: "var(--sf-space-16)",
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--sf-space-8)",
        padding: "10px 16px",
        background: "var(--sf-ground-elev)",
        /* D5 (June 2 2026): the floating valve speaks the system — ruled
           tag, not a rounded pill. */
        border: "none",
        borderTop: "1px solid var(--sf-accent-line)",
        borderBottom: "1px solid var(--sf-accent-line)",
        borderRadius: "2px",
        cursor: "pointer",
        appearance: "none",
        boxShadow: "none",
        WebkitTapHighlightColor: "transparent",
        transition: "border-color var(--sf-motion-default) var(--sf-ease-prestige)",
        zIndex: 10,
      }}
      className="sf-btn-secondary"
    >
      <span
        aria-hidden="true"
        style={{
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: "var(--sf-accent)",
          display: "inline-block",
        }}
      />
      <MonoLabel size="sm" tone="primary" as="span">
        Quick Breathe
      </MonoLabel>
    </button>
  );
}
