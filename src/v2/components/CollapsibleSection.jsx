import React, { useState } from "react";
import MonoLabel from "./MonoLabel.jsx";

/**
 * CollapsibleSection — a v7 group header for the secondary pages.
 *
 * Restores the organized, non-overwhelming sectioning the V1 Settings had
 * (8 collapsible sections, recovered from git c97411a) in the locked v7
 * language: a hairline-ruled header with an uppercase mono label and a quiet
 * brass chevron that rotates on open. Brass is kept to the chevron only
 * (≤5%); the rule is a neutral hairline; restraint over decoration.
 *
 * Used by Settings now; FAQ / Library / Progress reuse it so every secondary
 * page reads as one calm, sectioned surface rather than a dumped list.
 */
export default function CollapsibleSection({ label, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section style={{ borderTop: "1px solid var(--sf-border-hairline)" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--sf-space-16)",
          padding: "var(--sf-space-20) 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <MonoLabel size="xs" tone={open ? "primary" : "faint"}>{label}</MonoLabel>
        <span
          aria-hidden="true"
          style={{
            color: "var(--sf-accent)",
            fontSize: "11px",
            lineHeight: 1,
            transform: open ? "rotate(90deg)" : "none",
            transition: "transform var(--sf-motion-default) var(--sf-ease-prestige)",
          }}
        >
          ▸
        </span>
      </button>
      {open ? <div style={{ paddingBottom: "var(--sf-space-24)" }}>{children}</div> : null}
    </section>
  );
}
