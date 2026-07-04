import React from "react";
import MonoLabel from "./MonoLabel.jsx";
import { getActiveStartingRead } from "../lib/startingRead.js";

/**
 * StartingReadCard — the day-one bridge (2026-07-01). The Read from
 * calibration, carried onto home for the user's first days so the app's most
 * powerful early possession doesn't evaporate at the door. Self-gating:
 * renders nothing once a real Today's Brief exists or the window closes —
 * the compounding record takes over. FIRST-PASS COPY — Arlin's voice.
 */
export default function StartingReadCard() {
  let read = null;
  try { read = getActiveStartingRead(); } catch { read = null; }
  if (!read) return null;

  return (
    <section
      aria-label="Your starting read"
      style={{
        border: "0.5px solid var(--sf-border-hairline)",
        padding: "var(--sf-space-24)",
        marginBottom: "var(--sf-space-32)",
      }}
    >
      <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-12)" }}>
        Your starting read
      </MonoLabel>
      {read.portrait.map((l) => (
        <p key={l.slice(0, 24)} style={LINE}>{l}</p>
      ))}
      {read.seen && read.seen.length > 0 && (
        <p style={{ ...LINE, borderLeft: "0.5px solid var(--sf-accent-line)", paddingLeft: "var(--sf-space-12)" }}>
          {read.seen[read.seen.length - 1]}
        </p>
      )}
      <p style={FOOT}>From your calibration. The daily practice sharpens it — and soon replaces it with the real thing.</p>
    </section>
  );
}

const LINE = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "14px",
  lineHeight: 1.7, color: "var(--sf-text-secondary)", margin: "0 0 var(--sf-space-8)",
};
const FOOT = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontStyle: "italic",
  fontSize: "12px", color: "var(--sf-text-faint)", margin: "var(--sf-space-8) 0 0",
};
