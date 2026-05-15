import React from "react";

/**
 * MonoLabel — small-caps editorial label.
 *
 * Design system: mono-xs / mono-sm / mono-md sizes. Wide tracking gives the
 * "engraved" feel referenced by Cartier, Leica, Teenage Engineering.
 * Used for section labels, status indicators, small caps editorial moments.
 *
 * Anchor: STILLFORM_DESIGN_SYSTEM.md §typography
 *
 * @param {"xs"|"sm"|"md"} size - default "sm"
 * @param {"quiet"|"faint"|"primary"|"accent"} tone - default "quiet"
 * @param {React.ElementType} as - default "span"
 */
export default function MonoLabel({
  children,
  size = "sm",
  tone = "quiet",
  as: Tag = "span",
  className = "",
  style,
  ...rest
}) {
  const sizeClass =
    size === "xs" ? "sf-mono-xs" : size === "md" ? "sf-mono-md" : "sf-mono-sm";

  const color =
    tone === "primary" ? "var(--sf-text-primary)"
    : tone === "accent" ? "var(--sf-accent)"
    : tone === "faint" ? "var(--sf-text-faint)"
    : "var(--sf-text-quiet)";

  return (
    <Tag
      className={`${sizeClass} ${className}`.trim()}
      style={{ color, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
