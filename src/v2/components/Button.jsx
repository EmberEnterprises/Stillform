import React from "react";

/**
 * Button — Stillform v2 button vocabulary.
 *
 * Critical design system change: primary buttons are NO LONGER amber-fill-
 * on-dark. They are dark-with-amber-hairline-and-amber-text. This is the
 * Hermès / Aesop convention — the action is dignified, not loud.
 *
 * Anchor: STILLFORM_DESIGN_SYSTEM.md §components → buttons
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
  const paddingX = size === "sm" ? "20px" : "28px";
  const paddingY = size === "sm" ? "10px" : "14px";

  const baseStyle = {
    fontFamily: "var(--sf-font-sans)",
    fontSize: size === "sm" ? "13px" : "15px",
    fontWeight: 400,
    letterSpacing: "0.01em",
    lineHeight: 1,
    padding: `${paddingY} ${paddingX}`,
    borderRadius: "var(--sf-r-default)",
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
    variantStyle = {
      backgroundColor: "var(--sf-ground-elev)",
      border: "0.5px solid var(--sf-accent-line)",
      color: "var(--sf-accent)",
    };
    variantClass = "sf-btn-primary";
  } else if (variant === "secondary") {
    variantStyle = {
      backgroundColor: "transparent",
      border: "0.5px solid var(--sf-border-emphasis)",
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
