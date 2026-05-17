import React from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";

/**
 * MyProgress — landing surface for the diagnostic stack + practice
 * surfaces under the home's "Progress" link.
 *
 * Phase 5 sub-item #2 (locked May 17, 2026): minimal landing. Lists
 * currently-available editors only (no placeholder slots for non-
 * functional items per canon "no broken affordances"). Future
 * editors plug in by adding their own entries here.
 *
 * Currently lists:
 *   - Context Profile (Phase 5 sub-item #1)
 *
 * Future entries (each gated by their own sub-item shipping):
 *   - Trigger Profile (v1 data layer exists; UI pending)
 *   - Bias Profile
 *   - Signal Profile
 *   - Bio-filter
 *   - Library
 *   - Roadmap / Mirror Strip / Signal Log / Pattern Disruption
 *
 * Routing: AppV2 passes onExit (back to home) and onNavigate (target
 * editor id, AppV2 maps id → screen state) handlers. The landing
 * itself doesn't know what screens exist — it just emits navigation
 * intents.
 *
 * @param {function(): void} onExit — back to home
 * @param {function(string): void} onNavigate — navigate to target editor
 */
export default function MyProgress({ onExit, onNavigate }) {
  const handleNavigate = (target) => {
    if (typeof onNavigate === "function") onNavigate(target);
  };

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      {/* Top back affordance — mono-faint, top left. Matches the
          ContextProfile back-button treatment for consistency
          across the My Progress sub-tree. */}
      <button
        type="button"
        onClick={onExit}
        aria-label="Back to home"
        style={{
          background: "transparent",
          border: "none",
          color: "var(--sf-text-faint)",
          fontFamily: "var(--sf-font-mono)",
          fontSize: "11px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          cursor: "pointer",
          padding: "8px 0",
          marginBottom: "var(--sf-space-24)",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        ← back
      </button>

      <EditorialBlock
        label="Progress"
        headline="My Progress"
        headlineSize="md"
        body={
          <>
            Where what you've named lives. Edit your profile, review what you've observed, see your patterns over time.
          </>
        }
        rule
      />

      <section style={{ marginTop: "var(--sf-space-16)" }}>
        <MonoLabel
          size="xs"
          tone="faint"
          style={{ display: "block", marginBottom: "var(--sf-space-16)" }}
        >
          Your diagnostic stack
        </MonoLabel>

        <ProgressEntry
          title="Context Profile"
          description="Ambient conditions you've noticed correlate with how you feel — weather, hydration, the kind of conversation you just left."
          onTap={() => handleNavigate("context-profile")}
        />
      </section>
    </main>
  );
}

/**
 * ProgressEntry — single tappable row in the landing list. Editorial
 * treatment: serif title + sans body + faint arrow indicator. Full row
 * is the tap target.
 */
function ProgressEntry({ title, description, onTap }) {
  return (
    <button
      type="button"
      onClick={onTap}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "var(--sf-space-16) 0",
        borderBottom: "0.5px solid var(--sf-border-quiet)",
        background: "transparent",
        border: "none",
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--sf-space-16)",
          marginBottom: "var(--sf-space-4)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--sf-font-serif)",
            fontSize: "18px",
            fontWeight: 400,
            color: "var(--sf-text-primary)",
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        <div
          aria-hidden="true"
          style={{
            fontFamily: "var(--sf-font-mono)",
            fontSize: "14px",
            color: "var(--sf-text-faint)",
            flexShrink: 0,
          }}
        >
          →
        </div>
      </div>
      <div
        style={{
          fontSize: "14px",
          color: "var(--sf-text-secondary)",
          lineHeight: 1.5,
        }}
      >
        {description}
      </div>
    </button>
  );
}
