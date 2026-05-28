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
        // Heavier scrim than the prior 0.72 — that wasn't dark enough to
        // visually separate the modal from page content underneath.
        background: "rgba(0, 0, 0, 0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--sf-space-24, 24px)",
        animation: "sfFadeUp 320ms var(--sf-ease-prestige, ease-out) both",
      }}
    >
      <div
        style={{
          maxWidth: "440px",
          width: "100%",
          // Cap height + scroll so long info bodies don't escape the viewport
          // on small screens. The card scrolls internally if content overflows.
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "var(--sf-space-32, 32px)",
          // Was --sf-ground — that variable doesn't exist, so background
          // fell back to transparent and the page bled through. The actual
          // defined variables are --sf-ground-deep / --sf-ground-elev / --sf-ground-elev-2.
          // Using ground-elev (#111114) so the card sits visually ABOVE the
          // page ground (#08080A) — proper elevation, the way a card should read.
          background: "var(--sf-ground-elev, #111114)",
          border: "0.5px solid var(--sf-border-emphasis, rgba(255,255,255,0.10))",
          // Subtle depth — the card lifts off the page.
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
          // Needed for the absolute-positioned corner X button.
          position: "relative",
        }}
      >
        {/*
          Corner X — backup close affordance with a generous 44pt tap target.
          The bottom Close button is still the primary dismissal, but on a
          phone screen a tiny text-only close is easy to miss; the corner X
          gives the user a second clearly-tappable surface.
        */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close info"
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "44px",
            height: "44px",
            background: "transparent",
            border: "none",
            color: "var(--sf-text-quiet, rgba(255,255,255,0.55))",
            fontSize: "24px",
            lineHeight: 1,
            cursor: "pointer",
            padding: 0,
            WebkitTapHighlightColor: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>

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

        <div style={{ marginTop: "var(--sf-space-32, 32px)" }}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close info"
            style={{
              // Bordered + padded so the button has a clear hit area, was
              // previously padding:0 / font-size:11px which produced a
              // ~30px×14px tap target — well below the iOS 44pt minimum
              // and easy to miss on a phone.
              background: "transparent",
              border: "0.5px solid var(--sf-border-emphasis, rgba(255,255,255,0.10))",
              color: "var(--sf-accent, #B8862B)",
              fontFamily: "var(--sf-font-mono, monospace)",
              fontSize: "12px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "14px 24px",
              minHeight: "44px",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
