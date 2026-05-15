import React from "react";

/**
 * HomeFooter — three quiet links to the other home surfaces.
 *
 * Per STILLFORM_CANON.md: home stands on three surfaces — Journey (the
 * current beat, rendered above), My Progress (data + practice library),
 * and Library (external knowledge). Settings is a fourth quiet entry for
 * preferences only.
 *
 * Phase 1: text links only, no icons, no nav bar. mono-xs tracked,
 * faint by default. Tapping is a no-op for now — destination surfaces
 * are Phase 3+.
 */
export default function HomeFooter({ onNavigate }) {
  const items = [
    { id: "progress", label: "Progress" },
    { id: "library", label: "Library" },
    { id: "faq", label: "FAQ" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <nav
      aria-label="Stillform navigation"
      style={{
        padding: "var(--sf-space-48) var(--sf-space-24) var(--sf-space-32)",
        maxWidth: "640px",
        margin: "0 auto",
        display: "flex",
        gap: "var(--sf-space-24)",
        justifyContent: "center",
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => typeof onNavigate === "function" && onNavigate(item.id)}
          className="sf-btn-ghost sf-mono-xs"
          style={{
            background: "transparent",
            border: "none",
            padding: "var(--sf-space-8) var(--sf-space-4)",
            cursor: "pointer",
            color: "var(--sf-text-faint)",
            fontFamily: "var(--sf-font-mono)",
            fontSize: "9px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            WebkitTapHighlightColor: "transparent",
            transition: "color var(--sf-motion-default) var(--sf-ease-prestige)",
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
