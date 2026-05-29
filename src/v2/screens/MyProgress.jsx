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
 *   - Context Profile
 *
 * Future entries (each gated by their own sub-item shipping):
 *   - Trigger Profile
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

      {/* Phase 6.4c: post-event reflection — a manual ACTION (launch a
          post-event session), set apart from the diagnostic mirrors below
          so it reads as "do this now," not "view this." Off-home per canon;
          the one deliberate manual beat. Routes via AppV2's forcedBeat. */}
      <section style={{ marginTop: "var(--sf-space-16)", marginBottom: "var(--sf-space-32)" }}>
        <ProgressEntry
          title="Break down something that just happened"
          description="A meeting, a call, a moment — while it's fresh. What worked, what didn't, what to keep for next time."
          onTap={() => handleNavigate("post-event")}
        />
      </section>

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

        <ProgressEntry
          title="Trigger Profile"
          description="External situations you've named as consistently hitting hard — performance reviews, hard conversations, certain people."
          onTap={() => handleNavigate("trigger-profile")}
        />

        <ProgressEntry
          title="Bias Profile"
          description="Recurring shapes your thinking takes — the patterns you've put on a watch list for the Reframe AI to notice and help loosen over time."
          onTap={() => handleNavigate("bias-profile")}
        />

        <ProgressEntry
          title="Growth mirror"
          description="The four capacities Stillform trains — Sense, Settle, Seeing yourself, Seeing others — reflected back as you do the work."
          onTap={() => handleNavigate("capacities-mirror")}
        />

        <ProgressEntry
          title="Where You Lean"
          description="Where you take risk and where you hold back, across the parts of a life — a value-neutral picture of your shape, nothing to fix."
          onTap={() => handleNavigate("risk-profile")}
        />

        <ProgressEntry
          title="What Didn't Come True"
          description="What you were sure would go wrong that didn't — the disconfirmations your mind otherwise forgets to count."
          onTap={() => handleNavigate("prediction-mirror")}
        />

        <ProgressEntry
          title="What You Bet On"
          description="What you were sure of, next to what actually happened. The gap is the data."
          onTap={() => handleNavigate("what-you-bet-on")}
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
