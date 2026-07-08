import React from "react";
import MonoLabel from "./MonoLabel.jsx";
import Button from "./Button.jsx";

/**
 * StepOutOffer — the inline prompt for the Step Out (pattern-interrupt).
 *
 * Surfaced by SmartScreen as the LEAD element of the home's concierge
 * composition when stepOutTrigger.getActiveLoopOffer() returns a loop: a
 * pattern the user ALREADY CONFIRMED whose own token has recurred in the
 * last few days (pure arithmetic — the engine finds it, the user decides;
 * see stepOutTrigger.js). NEVER a push, never AI judgment, never a doorstep
 * — the naming surface stays reachable below it.
 *
 * Quieter inline, but with honest influence (Arlin, June 26): the pull comes
 * from it being TRUE, TIMELY, and SALIENT — it names the user's own confirmed
 * pattern, says it's active now, and offers one clear move, sitting as the
 * lead of the surface. NOT manufactured urgency, nag, or craving-engineering
 * (the no-push / intrinsic-reward line, CANON reward rule).
 *
 * Per PATTERN_DISRUPTION_SPEC §3.4: direct, not diagnostic; anchored in the
 * user's own named pattern. "Pattern / pulling" is the safe register; "spiral
 * / stuck / trapped" are diagnostic-coded and banned. The move is framed as
 * breaking the loop's grip so the user can SEE it — never "stop thinking"
 * (the framing-law Q4.8 graduate-from-analysis anti-pattern).
 *
 * COPY IS FIRST-PASS — Arlin's voice to set.
 *
 * @param {string|null} patternLabel — the user's own confirmed loop label
 * @param {function(): void} onAccept  — open the Step Out overlay
 * @param {function(): void} onDecline — dismiss (records a dismissal), reveal home
 */
export default function StepOutOffer({ patternLabel = null, onAccept, onDecline }) {
  return (
    <section
      className="sf-fade-enter"
      style={{ marginBottom: "var(--sf-space-32)" }}
      aria-label="A pattern you named is active — step out"
    >
      <MonoLabel
        size="xs"
        tone="faint"
        style={{ display: "block", marginBottom: "var(--sf-space-12)" }}
      >
        Pulling again
      </MonoLabel>

      {patternLabel ? (
        <p
          style={{
            margin: 0,
            marginBottom: "var(--sf-space-12)",
            fontFamily: "var(--sf-font-serif)",
            fontSize: "20px",
            lineHeight: 1.4,
            fontWeight: 300,
            color: "var(--sf-text-cream)",
          }}
        >
          {patternLabel}
        </p>
      ) : null}

      <p
        style={{
          margin: 0,
          marginBottom: "20px",
          fontFamily: "var(--sf-font-serif)",
          fontSize: "17px",
          lineHeight: 1.45,
          fontWeight: 300,
          color: "var(--sf-accent)",
        }}
      >
        You named this one, and it's moving again the last few days. Stepping out
        breaks the pull for a moment — so you can see it instead of running it.
        [ offer copy — Arlin ]
      </p>

      <Button variant="primary" onClick={onAccept}>
        Step out
      </Button>
      <button
        type="button"
        className="sf-link-quiet"
        style={{ display: "block", margin: "var(--sf-space-16) auto 0" }}
        onClick={onDecline}
      >
        Not now
      </button>

      <div
        className="sf-thread-divider"
        aria-hidden="true"
        style={{ marginTop: "var(--sf-space-24)" }}
      />
    </section>
  );
}
