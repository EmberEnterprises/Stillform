import React from "react";

/**
 * InstrumentCard — bordered card for when an enclosed surface is genuinely
 * needed (e.g., a session in a list, a setting toggle).
 *
 * Design system: background ground-elev, 0.5px hairline border, 4px radius,
 * inset top highlight at rgba(255,255,255,0.025) for material depth (handled
 * in components.css via ::before). No shadow.
 *
 * Use sparingly. Most v2 surfaces prefer EditorialBlock + HairlineDivider
 * over enclosed cards.
 *
 * Anchor: STILLFORM_DESIGN_SYSTEM.md §components → instrument card
 */
export default function InstrumentCard({
  children,
  className = "",
  style,
  ...rest
}) {
  return (
    <div
      className={`sf-instrument-card ${className}`.trim()}
      style={{
        backgroundColor: "var(--sf-ground-elev)",
        border: "0.5px solid var(--sf-border-hairline)",
        borderRadius: "var(--sf-r-default)",
        padding: "var(--sf-space-16)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
