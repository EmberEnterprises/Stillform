import React from "react";

/**
 * HairlineDivider — 0.5px horizontal rule.
 *
 * Design system: never 1px, never colored. Section breaks use border-printed.
 * Optionally 24-40px wide centered (Aesop convention) instead of full width.
 *
 * Anchor: STILLFORM_DESIGN_SYSTEM.md §components → hairline divider
 *
 * @param {"full"|"short"|"medium"} width - default "full"
 * @param {"printed"|"hairline"|"emphasis"|"accent"} weight - default "printed"
 */
export default function HairlineDivider({
  width = "full",
  weight = "printed",
  className = "",
  style,
  ...rest
}) {
  const widthPx =
    width === "short" ? "24px" : width === "medium" ? "40px" : "100%";

  const color =
    weight === "hairline" ? "var(--sf-border-hairline)"
    : weight === "emphasis" ? "var(--sf-border-emphasis)"
    : weight === "accent" ? "var(--sf-accent-line)"
    : "var(--sf-border-printed)";

  return (
    <hr
      className={className}
      style={{
        border: 0,
        height: "0.5px",
        width: widthPx,
        background: color,
        margin: 0,
        ...style,
      }}
      {...rest}
    />
  );
}
