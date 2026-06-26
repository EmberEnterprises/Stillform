import React from "react";
import EditorialBlock from "./EditorialBlock.jsx";
import MonoLabel from "./MonoLabel.jsx";
import Button from "./Button.jsx";

/**
 * FunctionCheckOffer — the end-of-session nudge toward a Practice-evidence
 * round. Rendered by the spine ONLY after the session is fully saved, only
 * when shouldOfferFunctionCheck() passes (capped weekly, mature practice,
 * quiet for active practicers), and never on wind-down or eod.
 *
 * A gentle offer, never a nag: one clear "do it" and an unpunished "not now".
 * COPY IS FIRST-PASS — Arlin's voice to set.
 *
 * @param {function(): void} onAccept  — go to Practice Evidence
 * @param {function(): void} onDecline — proceed home, no penalty
 */
export default function FunctionCheckOffer({ onAccept, onDecline }) {
  return (
    <main className="sf-page">
      <EditorialBlock label="Before you go" headline="A quick check on what this is training?">
        <MonoLabel>
          a couple of minutes — name a few feelings, or find angles on a thought. it's how you
          watch the practice working over time. [ offer copy — Arlin ]
        </MonoLabel>
        <div style={{ marginTop: "var(--sf-space-32, 32px)" }}>
          <Button variant="primary" onClick={onAccept}>
            Do a check
          </Button>
          <button
            type="button"
            className="sf-link-quiet"
            style={{ display: "block", margin: "var(--sf-space-16, 16px) auto 0" }}
            onClick={onDecline}
          >
            Not now
          </button>
        </div>
      </EditorialBlock>
    </main>
  );
}
