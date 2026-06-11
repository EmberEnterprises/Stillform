import React, { useState } from "react";
import MonoLabel from "./MonoLabel.jsx";
import { getPendingProposals, approveProposal, declineProposal } from "../lib/mediationApi.js";

/*
 * MediationQueue — the approval queue (Concierge Cluster M2).
 *
 * The user-led half of AI Mediation: the AI proposes updates to the
 * user's own artifacts; NOTHING applies without an explicit Approve.
 * Reasoning is shown verbatim (backend contract: 60–400 chars
 * referencing specific evidence). Decline is remembered and suppressed
 * on future runs.
 *
 * Two placements (Arlin, June 2): inline section in My Progress, and
 * tap-through from the Mirror strip (overlay). Same component; the
 * `inline` prop only changes the chrome.
 *
 * Doctrine: user is the authority. Verbs are quiet ("Add it" / "Not
 * this") — no urgency, no badge-counts pushed anywhere, surfaces light
 * only when the user is already here.
 */
export default function MediationQueue({ inline = false, onClose }) {
  const [items, setItems] = useState(() => getPendingProposals());
  const refresh = () => setItems(getPendingProposals());

  const verb = (p) =>
    p.operation === "add" ? "Proposed addition to your trigger profile"
    : p.operation === "update" ? "Proposed refinement to a trigger"
    : "Proposed retirement of a trigger";

  const body = (
    <>
      <div style={{ marginBottom: "var(--sf-space-16)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <MonoLabel size="xs">PROPOSED UPDATES</MonoLabel>
        {!inline && onClose ? (
          <button type="button" onClick={onClose} aria-label="Close proposals" style={CLOSE_BTN}>×</button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p style={NOTE}>
          Nothing pending. Proposals appear here when a pattern across your
          own sessions supports one — with the evidence shown.
        </p>
      ) : (
        items.map((p) => (
          <div key={p.id} style={CARD}>
            <MonoLabel size="xs" tone="faint">{verb(p).toUpperCase()}</MonoLabel>
            {p.proposed?.label ? <h3 style={H3}>{p.proposed.label}</h3> : null}
            <p style={REASONING}>{p.reasoning}</p>
            {p.evidence?.length ? (
              <p style={EVIDENCE}>Based on {p.evidence.length} of your recent sessions.</p>
            ) : null}
            <div style={ROW}>
              <button
                type="button"
                style={APPROVE}
                onClick={() => { approveProposal(p.id); refresh(); }}
              >
                {p.operation === "retire" ? "Retire it" : p.operation === "update" ? "Refine it" : "Add it"}
              </button>
              <button
                type="button"
                style={DECLINE}
                onClick={() => { declineProposal(p.id); refresh(); }}
              >
                Not this
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );

  if (inline) return <div>{body}</div>;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Proposed updates"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      style={SCRIM}
    >
      <div style={SHEET}>{body}</div>
    </div>
  );
}

/* ---- styles ---- */

const SCRIM = {
  position: "fixed", inset: 0, zIndex: 180,
  background: "rgba(0,0,0,0.88)",
  backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
  display: "flex", alignItems: "flex-end", justifyContent: "center",
};

const SHEET = {
  width: "100%", maxWidth: "520px", maxHeight: "78vh", overflowY: "auto",
  background: "var(--sf-ground-elev, #111114)",
  border: "0.5px solid var(--sf-border-emphasis, rgba(255,255,255,0.10))",
  borderRadius: "16px 16px 0 0",
  padding: "var(--sf-space-24)",
  paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + var(--sf-space-24))",
};

const CLOSE_BTN = {
  width: "44px", height: "44px", background: "transparent", border: "none",
  color: "var(--sf-text-quiet)", fontSize: "22px", cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
};

const CARD = {
  padding: "var(--sf-space-16) 0",
  borderTop: "0.5px solid var(--sf-border, rgba(255,255,255,0.06))",
};

const H3 = {
  margin: "var(--sf-space-8) 0",
  color: "var(--sf-text-primary)",
  fontFamily: "var(--sf-font-sans)", fontSize: "17px", fontWeight: 500,
};

const REASONING = {
  margin: "0 0 var(--sf-space-8)",
  color: "var(--sf-text-cream)",
  fontFamily: "var(--sf-font-sans)", fontSize: "var(--sf-text-body-sm, 14px)",
  lineHeight: "var(--sf-leading-body)", fontWeight: 300,
};

const EVIDENCE = {
  margin: "0 0 var(--sf-space-12)",
  color: "var(--sf-text-faint)",
  fontFamily: "var(--sf-font-mono)", fontSize: "11px", letterSpacing: "0.04em",
};

const NOTE = {
  margin: 0, color: "var(--sf-text-quiet)",
  fontFamily: "var(--sf-font-sans)", fontSize: "var(--sf-text-body-sm, 14px)",
  lineHeight: "var(--sf-leading-body)", fontWeight: 300,
};

const ROW = { display: "flex", gap: "var(--sf-space-12)" };

const APPROVE = {
  minHeight: "44px", padding: "0 var(--sf-space-20)",
  background: "var(--sf-text-primary, #F4F2EC)", color: "var(--sf-ground-deep, #08080A)",
  border: "none", borderRadius: "10px",
  fontFamily: "var(--sf-font-sans)", fontSize: "15px", fontWeight: 600,
  cursor: "pointer", WebkitTapHighlightColor: "transparent",
};

const DECLINE = {
  minHeight: "44px", padding: "0 var(--sf-space-20)",
  background: "transparent", color: "var(--sf-text-quiet)",
  border: "0.5px solid var(--sf-border-emphasis, rgba(255,255,255,0.10))",
  borderRadius: "10px",
  fontFamily: "var(--sf-font-sans)", fontSize: "15px", fontWeight: 400,
  cursor: "pointer", WebkitTapHighlightColor: "transparent",
};
