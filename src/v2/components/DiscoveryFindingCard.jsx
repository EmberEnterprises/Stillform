import React, { useState, useCallback } from "react";
import Button from "./Button.jsx";
import {
  getNextCandidate,
  candidateLabel,
  confirmFinding,
  rejectFinding,
} from "../lib/discoveryFindings.js";

/**
 * DiscoveryFindingCard — the keystone's Step 2 confirm surface.
 *
 * The discovery engine found a pattern in the user's OWN logged tokens by
 * arithmetic (co-occurrence / lag-sequence, never causation, never the AI). This
 * card surfaces ONE undecided candidate at a time as a question — never a verdict
 * — and records the user's call. Rejected candidates never resurface; only
 * confirmed ones propagate (Step 3 hands those to the AI to voice).
 *
 * Honest empty state: renders nothing until the engine is ready and a candidate
 * is undecided. The user is the authority on whether it lands.
 */
export default function DiscoveryFindingCard() {
  const [candidate, setCandidate] = useState(() => getNextCandidate());

  const decide = useCallback(
    (accept) => {
      if (candidate) {
        if (accept) confirmFinding(candidate);
        else rejectFinding(candidate);
        try {
          window.plausible?.(accept ? "Discovery Finding Confirmed" : "Discovery Finding Rejected", {
            props: { kind: candidate.kind },
          });
        } catch { /* non-fatal */ }
      }
      // getNextCandidate now excludes the just-decided id
      setCandidate(getNextCandidate());
    },
    [candidate]
  );

  if (!candidate) return null;

  return (
    <section
      className="sf-sec sf-fade-enter"
      style={{ marginBottom: "var(--sf-space-32)" }}
    >
      <div className="sf-sec-head">
        <span className="sf-sec-head-lbl">Something surfaced</span>
        <div className="sf-sec-rule" />
      </div>

      <p
        style={{
          margin: "0 0 var(--sf-space-8) 0",
          color: "var(--sf-text-cream)",
          fontFamily: "var(--sf-font-serif)",
          fontSize: "20px",
          lineHeight: 1.4,
        }}
      >
        {candidateLabel(candidate)}
      </p>
      <p
        style={{
          margin: "0 0 var(--sf-space-24) 0",
          color: "var(--sf-text-quiet)",
          fontFamily: "var(--sf-font-sans)",
          fontSize: "14px",
          lineHeight: 1.55,
        }}
      >
        Found in what you&rsquo;ve named &mdash; not a claim, just a question. Does this land?
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--sf-space-16)" }}>
        <Button variant="primary" onClick={() => decide(true)}>
          Yes, that lands
        </Button>
        <button type="button" className="sf-link-quiet" onClick={() => decide(false)}>
          Not this &rsaquo;
        </button>
      </div>
    </section>
  );
}
