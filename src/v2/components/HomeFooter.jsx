import React from "react";

/**
 * HomeFooter — three quiet links to the other home surfaces, plus a
 * sub-footer for Crisis Resources.
 *
 * Per STILLFORM_CANON.md: home stands on three surfaces — Journey (the
 * current beat, rendered above), My Progress (data + practice library),
 * and Library (external knowledge). FAQ and Settings are quiet preference
 * entries. Crisis Resources is a safety affordance — present and accessible,
 * but visually subordinate to the practice nav so it does not signal
 * "this is a crisis tool" (canon framing law).
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

  const handleNavigate = (id) => {
    if (typeof onNavigate === "function") onNavigate(id);
  };

  return (
    <nav
      aria-label="Stillform navigation"
      style={{
        padding: "var(--sf-space-48) var(--sf-space-24) var(--sf-space-32)",
        maxWidth: "640px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "var(--sf-space-24)",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleNavigate(item.id)}
            className="sf-btn-ghost sf-foot-link"
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
      </div>

      {/* Sub-footer — Crisis Resources sits quietly below the practice nav.
          Present + accessible, but visually subordinate so it doesn't signal
          "this is a crisis tool." */}
      <div
        style={{
          marginTop: "var(--sf-space-16)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          type="button"
          onClick={() => handleNavigate("crisis-resources")}
          className="sf-btn-ghost sf-foot-link"
          style={{
            background: "transparent",
            border: "none",
            padding: "var(--sf-space-4)",
            cursor: "pointer",
            color: "rgba(232, 234, 240, 0.32)",
            fontFamily: "var(--sf-font-mono)",
            fontSize: "9px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            WebkitTapHighlightColor: "transparent",
            transition: "color var(--sf-motion-default) var(--sf-ease-prestige)",
          }}
        >
          Crisis Resources
        </button>
      </div>
    </nav>
  );
}
