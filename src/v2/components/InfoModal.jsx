import React, { useEffect } from "react";
import MonoLabel from "./MonoLabel.jsx";

/**
 * InfoModal — quiet overlay for science-grounded info cards.
 *
 * Triggered by the ⓘ button on labels throughout the app. The body
 * is plain prose, the title is a mono label, the dismissal is a single
 * "Close" link. No icons, no chrome, no animation beyond the standard
 * fade — just an editorial card that briefly explains what's behind
 * the surface.
 *
 * Tap outside or press ESC dismisses.
 *
 * @param {boolean} open
 * @param {string} title
 * @param {string} body
 * @param {function(): void} onClose
 */
export default function InfoModal({ open, title, body, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    // Lock background scroll while the modal is open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        // Tap on the scrim (not on the card itself) dismisses.
        if (e.target === e.currentTarget) onClose?.();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0, 0, 0, 0.72)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--sf-space-24)",
        animation: "sfFadeUp 320ms var(--sf-ease-prestige) both",
      }}
    >
      <div
        style={{
          maxWidth: "440px",
          width: "100%",
          padding: "var(--sf-space-32)",
          background: "var(--sf-ground)",
          border: "0.5px solid var(--sf-border-emphasis)",
        }}
      >
        {title ? (
          <header style={{ marginBottom: "var(--sf-space-16)" }}>
            <MonoLabel size="xs">{title}</MonoLabel>
          </header>
        ) : null}

        <p
          style={{
            margin: 0,
            color: "var(--sf-text-cream)",
            fontFamily: "var(--sf-font-sans)",
            fontSize: "var(--sf-text-body-md)",
            lineHeight: "var(--sf-leading-body)",
            fontWeight: 300,
            whiteSpace: "pre-wrap",
          }}
        >
          {body}
        </p>

        <div style={{ marginTop: "var(--sf-space-32)" }}>
          <button
            type="button"
            className="sf-btn-ghost"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--sf-accent)",
              fontFamily: "var(--sf-font-mono)",
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: 0,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
