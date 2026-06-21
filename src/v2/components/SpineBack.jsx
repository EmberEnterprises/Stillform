/**
 * SpineBack — the back-to-home affordance for mid-practice spine screens.
 *
 * The spine (Notice → Reframe → Close) previously had no visible way home
 * once entered: a wrong tap trapped the user mid-practice. This is the quiet
 * escape hatch. Styled to the spec (mono, restrained, hairline — never loud),
 * top-left, generous tap target. Calls the onExit the spine already provides.
 *
 * Legibility note (June 18 2026 punch-list #1): a SAFETY affordance has to be
 * findable when someone is stressed and looking for the exit — so it sits on
 * the "quiet" text tier, not the faintest "faint" tier (which read as the same
 * under-contrast haze flagged in punch-list #6). Restrained, but legible.
 *
 * Note: Close intentionally does NOT use this — Close IS the deliberate exit
 * (it asks the user to name what landed), so a back affordance there would
 * undercut the close ritual.
 *
 * @param {{ onBack: () => void, label?: string }} props
 */
import MonoLabel from "./MonoLabel.jsx";

export default function SpineBack({ onBack, label = "← home" }) {
  return (
    <button
      type="button"
      onClick={onBack}
      aria-label="Back to home"
      style={{
        position: "absolute",
        top: "var(--sf-space-16, 16px)",
        left: "var(--sf-space-16, 16px)",
        minWidth: "44px",
        minHeight: "44px",
        display: "inline-flex",
        alignItems: "center",
        background: "transparent",
        border: "none",
        padding: "10px 8px",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        zIndex: 10,
      }}
    >
      <MonoLabel size="sm" tone="quiet">{label}</MonoLabel>
    </button>
  );
}
