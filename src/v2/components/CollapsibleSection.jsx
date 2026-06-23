import React, { useState } from "react";

/**
 * CollapsibleSection — a v7 group header for the secondary pages.
 *
 * Matches the home/Library/Progress section language exactly: a mono uppercase
 * label sitting on a DRAWN BRASS rule (the home "TODAY" idiom — label · rule ·
 * chevron on one baseline), with a brass chevron that rotates on open. Brass
 * stays to the rule + chevron (≤5%). One system across every secondary page.
 *
 * NOTE: padding uses real spacing tokens (no var(--sf-space-20) — that token
 * does not exist; it was silently collapsing header padding to zero and
 * cramming the sections together).
 */
export default function CollapsibleSection({ label, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "var(--sf-space-12)",
          padding: "var(--sf-space-20, 20px) 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <span
          style={{
            flexShrink: 0,
            fontFamily: "var(--sf-font-mono)",
            fontSize: "10px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: open ? "var(--sf-text-primary)" : "var(--sf-text-quiet)",
          }}
        >
          {label}
        </span>
        <span
          aria-hidden="true"
          style={{
            flex: 1,
            height: "1px",
            background:
              "linear-gradient(90deg, var(--sf-accent) 0%, var(--sf-accent-line) 42%, transparent 100%)",
            opacity: 0.9,
          }}
        />
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
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
