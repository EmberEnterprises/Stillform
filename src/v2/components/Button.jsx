import React from "react";

/**
 * Button — Stillform button vocabulary.
 *
 * THE SYNTHESIS (June 2 2026): primary and secondary actions are CHAPTER
 * RULES — a top and bottom rule with the label set in the display serif,
 * no box, no fill. An action reads as a heading in the manuscript, not a
 * pill in an app. Ghost stays the quiet sans utility.
 *
 * Anchor: STILLFORM_DESIGN_SYSTEM.md §rollout D3
 *
 * @param {"primary"|"secondary"|"ghost"} variant - default "primary"
 * @param {"md"|"sm"} size - default "md"
 * @param {boolean} fullWidth - default false
 */
export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  style,
  children,
  ...rest
}) {
  const paddingX = size === "sm" ? "14px" : "18px";
  const paddingY = size === "sm" ? "11px" : "15px";
  const isRule = variant === "primary" || variant === "secondary";

  const baseStyle = {
    fontFamily: isRule ? "var(--sf-font-serif)" : "var(--sf-font-sans)",
    fontSize: isRule ? (size === "sm" ? "16px" : "19px") : (size === "sm" ? "13px" : "15px"),
    fontWeight: isRule ? 460 : 400,
    letterSpacing: "0.01em",
    lineHeight: 1,
    padding: `${paddingY} ${paddingX}`,
    borderRadius: isRule ? 0 : "var(--sf-r-default)",
    cursor: "pointer",
    textAlign: "center",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: fullWidth ? "100%" : "auto",
    transition: "border-color var(--sf-motion-default) var(--sf-ease-prestige), color var(--sf-motion-default) var(--sf-ease-prestige), background-color var(--sf-motion-quick) var(--sf-ease-shutter)",
    WebkitTapHighlightColor: "transparent",
    appearance: "none",
    boxShadow: "none",
  };

  let variantStyle;
  let variantClass = "";

  if (variant === "primary") {
    // Chapter rule: brass rules above and below, bone label in the serif.
    variantStyle = {
      backgroundColor: "transparent",
      border: "none",
      borderTop: "1px solid var(--sf-accent)",
      borderBottom: "1px solid var(--sf-accent)",
      color: "var(--sf-text-primary)",
    };
    variantClass = "sf-btn-primary";
  } else if (variant === "secondary") {
    // Quiet chapter rule: bone-alpha rules.
    variantStyle = {
      backgroundColor: "transparent",
      border: "none",
      borderTop: "1px solid var(--sf-border-emphasis)",
      borderBottom: "1px solid var(--sf-border-emphasis)",
      color: "var(--sf-text-primary)",
    };
    variantClass = "sf-btn-secondary";
  } else {
    variantStyle = {
      backgroundColor: "transparent",
      border: "0.5px solid transparent",
      color: "var(--sf-text-quiet)",
    };
    variantClass = "sf-btn-ghost";
  }

  return (
    <button
      type="button"
      className={`${variantClass} ${className}`.trim()}
      style={{ ...baseStyle, ...variantStyle, ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}
