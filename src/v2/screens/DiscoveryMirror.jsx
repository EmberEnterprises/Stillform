import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import Button from "../components/Button.jsx";
import {
  getTopUnsurfacedFinding,
  getConfirmedFindings,
  describeFinding,
  confirmFinding,
  rejectFinding,
} from "../lib/discoveryFindings.js";
import { getSignalCount } from "../lib/signalLog.js";

/**
 * DiscoveryMirror — the OUTPUT surface of the keystone loop (CANON §7.1a
 * steps 2 + 4). The deterministic engine computes a candidate pattern from the
 * user's own logged tokens; THIS surface asks the user "does this land?" and
 * records their call. The math found it — the USER is the authority on whether
 * it's real. A confirmed finding joins the set the AI may later voice; a
 * rejected one NEVER resurfaces (no nagging).
 *
 * Framing (framework §4 / framing law / reflect-not-score): correlation,
 * NEVER causation. No scores, no good/bad, no trajectory verdict. A finding is
 * arithmetic over what the user logged — offered as a question, not a verdict.
 *
 * NOTE (June 18 2026): the surfacing phrasing + cadence still need Arlin's
 * live walk (the ~100 situational conversations) before this ships. The
 * deterministic store/orchestrator beneath it is unit-tested; the felt
 * experience here is not yet tuned.
 *
 * @param {function(): void} onExit — back to My Progress
 */
export default function DiscoveryMirror({ onExit }) {
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  const top = getTopUnsurfacedFinding();
  const confirmed = getConfirmedFindings();
  const count = getSignalCount();

  const handleConfirm = () => {
    if (top) confirmFinding(top);
    refresh();
  };
  const handleReject = () => {
    if (top) rejectFinding(top);
    refresh();
  };

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      <EditorialBlock
        label="My Progress"
        headline="What the Engine Noticed"
        headlineSize="md"
        body="These come from your own logged moments — patterns the math found, not guesses. Each is a question, not a verdict: you decide whether it's real. Two things showing up together isn't one causing the other."
        rule
      />

      {top ? (
        <div style={cardStyle}>
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
            Does this land?
          </MonoLabel>
          <p style={findingStyle}>{describeFinding(top)}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sf-space-16)", marginTop: "var(--sf-space-24)" }}>
            <Button variant="ghost" onClick={handleConfirm}>Yes, that's real</Button>
            <button type="button" className="sf-link-quiet" onClick={handleReject}>
              Not really
            </button>
          </div>
        </div>
      ) : null}

      {confirmed.length ? (
        <div style={{ marginTop: "var(--sf-space-32)" }}>
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
            What's held up
          </MonoLabel>
          {confirmed.map((c, i) => (
            <p key={i} style={confirmedRowStyle}>{describeFinding(c)}</p>
          ))}
        </div>
      ) : null}

      {!top && !confirmed.length ? (
        <p style={{ ...framingStyle, marginTop: "var(--sf-space-24)" }}>
          {count < 8
            ? "Nothing here yet — patterns surface once there's enough logged to be more than coincidence. Keep doing the work; this fills in on its own. Nothing forced."
            : "No new patterns to look at right now. As you keep logging, anything the math notices will show up here for your call."}
        </p>
      ) : null}
    </main>
  );
}

const backStyle = {
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
};

const framingStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "15px",
  lineHeight: 1.5,
  color: "var(--sf-text-faint)",
  margin: 0,
};

const cardStyle = {
  marginTop: "var(--sf-space-24)",
  paddingTop: "var(--sf-space-24)",
  borderTop: "1px solid var(--sf-hairline)",
};

const findingStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "19px",
  lineHeight: 1.45,
  color: "var(--sf-text)",
  margin: 0,
};

const confirmedRowStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "16px",
  lineHeight: 1.5,
  color: "var(--sf-text-faint)",
  padding: "var(--sf-space-12) 0",
  borderBottom: "0.5px solid var(--sf-border-quiet)",
  margin: 0,
};
