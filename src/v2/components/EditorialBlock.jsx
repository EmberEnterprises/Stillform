import React from "react";
import MonoLabel from "./MonoLabel.jsx";
import HairlineDivider from "./HairlineDivider.jsx";

/**
 * EditorialBlock — the core typographic unit. Replaces the wellness-app card.
 *
 * Single typographic unit: small mono label + large serif headline + body
 * text + optional 24px hairline rule. No background, no border. Sits
 * directly on the ground. References: Aesop, Espresso, Cartier landing.
 *
 * Anchor: STILLFORM_DESIGN_SYSTEM.md §components → editorial block
 *
 * Sizing rule: at most ONE display-xl or display-lg per screen. If a screen
 * needs two display-scale moments, demote one to display-md.
 *
 * @param {string} label - mono-xs uppercase label above the headline
 * @param {string|React.Node} headline - serif headline text
 * @param {"xl"|"lg"|"md"|"sm"} headlineSize - default "md"
 * @param {React.Node} body - optional body text
 * @param {boolean} rule - render 24px hairline beneath, default false
 * @param {"start"|"center"} align - default "start"
 * @param {string} [labelInfoTitle] - title for the info modal on the label
 * @param {string} [labelInfoBody]  - body for the info modal on the label
 */
export default function EditorialBlock({
  label,
  headline,
  headlineSize = "md",
  body,
  rule = false,
  align = "start",
  className = "",
  style,
  children,
  labelInfoTitle,
  labelInfoBody,
  ...rest
}) {
  const headlineClass =
    headlineSize === "xl" ? "sf-display-xl"
    : headlineSize === "lg" ? "sf-display-lg"
    : headlineSize === "sm" ? "sf-display-sm"
    : "sf-display-md";

  return (
    <div
      className={className}
      style={{
        textAlign: align,
        ...style,
      }}
      {...rest}
    >
      {label ? (
        <MonoLabel
          size="xs"
          style={{ display: "block", marginBottom: "var(--sf-space-16)" }}
          infoTitle={labelInfoTitle}
          infoBody={labelInfoBody}
        >
          {label}
        </MonoLabel>
      ) : null}

      {headline ? (
        <h2 className={headlineClass} style={{ margin: 0 }}>
          {headline}
        </h2>
      ) : null}

      {body ? (
        <div
          className="sf-body-md"
          style={{
            marginTop: "var(--sf-space-16)",
            color: "var(--sf-text-quiet)",
            maxWidth: "58ch",
            ...(align === "center" ? { marginLeft: "auto", marginRight: "auto" } : null),
          }}
        >
          {body}
        </div>
      ) : null}

      {children}

      {rule ? (
        <div
          style={{
            marginTop: "var(--sf-space-24)",
            display: "flex",
            justifyContent: align === "center" ? "center" : "flex-start",
          }}
        >
          <HairlineDivider width="short" />
        </div>
      ) : null}
    </div>
  );
}
