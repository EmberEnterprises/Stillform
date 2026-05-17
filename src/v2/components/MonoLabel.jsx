import React, { useState } from "react";
import InfoModal from "./InfoModal.jsx";

/**
 * MonoLabel — small-caps editorial label.
 *
 * Design system: mono-xs / mono-sm / mono-md sizes. Wide tracking gives the
 * "engraved" feel referenced by Cartier, Leica, Teenage Engineering.
 * Used for section labels, status indicators, small caps editorial moments.
 *
 * Optional info button: when `infoBody` (and optional `infoTitle`) are
 * provided, MonoLabel renders an inline ⓘ button next to its text.
 * Tapping the button opens a quiet InfoModal with science-grounded
 * explanation. Info-button affordance for editorial copy (PRE-SLEEP,
 * granularity-gym, etc.), now built into the label primitive itself so
 * any section heading can carry its rationale.
 *
 * Anchor: STILLFORM_DESIGN_SYSTEM.md §typography
 *
 * @param {"xs"|"sm"|"md"} size - default "sm"
 * @param {"quiet"|"faint"|"primary"|"accent"} tone - default "quiet"
 * @param {React.ElementType} as - default "span"
 * @param {string} [infoTitle] - title in the info modal; defaults to the label text
 * @param {string} [infoBody]  - body prose. When present, renders the ⓘ button.
 */
export default function MonoLabel({
  children,
  size = "sm",
  tone = "quiet",
  as: Tag = "span",
  className = "",
  style,
  infoTitle,
  infoBody,
  ...rest
}) {
  const [open, setOpen] = useState(false);

  const sizeClass =
    size === "xs" ? "sf-mono-xs" : size === "md" ? "sf-mono-md" : "sf-mono-sm";

  const color =
    tone === "primary" ? "var(--sf-text-primary)"
    : tone === "accent" ? "var(--sf-accent)"
    : tone === "faint" ? "var(--sf-text-faint)"
    : "var(--sf-text-quiet)";

  const hasInfo = typeof infoBody === "string" && infoBody.trim().length > 0;
  const resolvedTitle =
    infoTitle ||
    (typeof children === "string" ? children : "");

  const baseStyle = { color, ...style };
  const inlineFlexStyle = hasInfo
    ? { ...baseStyle, display: "inline-flex", alignItems: "center", gap: "8px" }
    : baseStyle;

  return (
    <>
      <Tag
        className={`${sizeClass} ${className}`.trim()}
        style={inlineFlexStyle}
        {...rest}
      >
        <span>{children}</span>
        {hasInfo ? (
          <button
            type="button"
            aria-label={`About ${resolvedTitle}`}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            className="sf-info-btn"
          >
            ⓘ
          </button>
        ) : null}
      </Tag>

      {hasInfo ? (
        <InfoModal
          open={open}
          title={resolvedTitle}
          body={infoBody}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
