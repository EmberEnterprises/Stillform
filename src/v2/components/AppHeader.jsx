import React from "react";

/**
 * AppHeader — the Stillform wordmark, the top chrome on every surface.
 *
 * June 23 2026 (Arlin): the wordmark is the consistent identity + HOME link on
 * every page, and Sign in lives in the header (not buried in Settings). This
 * updates canon §10's "home header is one wordmark and nothing else" per
 * Arlin's direction — restraint kept (the wordmark + a quiet text "Sign in,"
 * no icons; she clarified the wordmark-as-home-link is the consistent identity
 * she has asked for, not an override).
 *
 * Props (all optional, backward-compatible — no props = the original silent
 * wordmark):
 *   onHome   — when provided, the wordmark is a home-link button. Omit on the
 *              home surface itself (identity only; nothing to link to).
 *   onSignIn — when provided, renders a quiet "Sign in" at the right, routing
 *              to where auth lives (currently Settings → Account; a dedicated
 *              login surface is a flagged refinement).
 */
export default function AppHeader({ onHome, onSignIn }) {
  const wordmark = (
    <>
      <span style={{ fontWeight: 300 }}>Still</span>
      <span style={{ fontWeight: 400, fontStyle: "italic", color: "var(--sf-accent)" }}>form</span>
    </>
  );
  const wordmarkStyle = {
    fontFamily: "var(--sf-font-serif)",
    fontSize: "22px",
    lineHeight: 1,
    letterSpacing: 0,
    color: "var(--sf-text-cream)",
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--sf-space-16)",
        padding: "var(--sf-space-24) var(--sf-space-24) 0",
        maxWidth: "640px",
        margin: "0 auto",
      }}
    >
      {typeof onHome === "function" ? (
        <button
          type="button"
          onClick={onHome}
          aria-label="Stillform — home"
          style={{
            ...wordmarkStyle,
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {wordmark}
        </button>
      ) : (
        <div style={wordmarkStyle} aria-label="Stillform">
          {wordmark}
        </div>
      )}

      {typeof onSignIn === "function" ? (
        <button
          type="button"
          onClick={onSignIn}
          className="sf-foot-link"
          style={{
            background: "none",
            border: "none",
            padding: "var(--sf-space-4)",
            cursor: "pointer",
            color: "var(--sf-text-faint)",
            fontFamily: "var(--sf-font-mono)",
            fontSize: "9px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            position: "relative",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          Sign in
        </button>
      ) : null}
    </header>
  );
}
