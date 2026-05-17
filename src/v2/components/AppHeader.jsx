import React from "react";

/**
 * AppHeader — single quiet Stillform wordmark at top-left.
 *
 * Per STILLFORM_CANON.md §10: "Splash gets the wordmark or it gets nothing."
 * Operator-tier silence beats a wrong word. The home header is one
 * wordmark and nothing else — no help icon, no settings icon, no
 * subscribe link. Those live as quiet footer affordances.
 *
 * Design system: Cormorant Garamond serif at display-sm scale, with
 * intentional weight contrast — "Still" at 300, "form" at 400 with the
 * accent color as a single-character emphasis
 * wordmark identity treatment).
 */
export default function AppHeader() {
  return (
    <header
      style={{
        padding: "var(--sf-space-24) var(--sf-space-24) 0",
        maxWidth: "640px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          fontFamily: "var(--sf-font-serif)",
          fontSize: "22px",
          lineHeight: 1,
          letterSpacing: 0,
          color: "var(--sf-text-cream)",
        }}
        aria-label="Stillform"
      >
        <span style={{ fontWeight: 300 }}>Still</span>
        <span style={{ fontWeight: 400, fontStyle: "italic", color: "var(--sf-accent)" }}>form</span>
      </div>
    </header>
  );
}
