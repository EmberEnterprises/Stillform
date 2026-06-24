import React, { useEffect, useState } from "react";
import CollapsibleSection from "./CollapsibleSection.jsx";
import { readEodArtifact, EOD_PENDING_KEY } from "../lib/eodArtifactApi.js";

/**
 * EodArtifactCard — the home-screen surface for the evening artifact (Arlin,
 * June 23: shown on the home screen AND inline at evening close). Generated
 * when the user names their eod takeaway, persisted day-keyed, surfaced here.
 *
 * Self-gating: renders nothing with no artifact and none composing. Collapsible
 * via CollapsibleSection (the home idiom), default-open. The single artifact
 * line is the AI's read of what the day taught — distinct from the takeaway the
 * user named at close.
 *
 * Label is a PLACEHOLDER ("The day, named") — Arlin to confirm/rename.
 */

function readPending() {
  try { return !!localStorage.getItem(EOD_PENDING_KEY); } catch { return false; }
}

export default function EodArtifactCard() {
  const [record, setRecord] = useState(() => readEodArtifact());
  const [pending, setPending] = useState(() => !readEodArtifact() && readPending());

  useEffect(() => {
    if (record || !pending) return undefined;
    let tries = 0;
    const iv = setInterval(() => {
      tries += 1;
      const r = readEodArtifact();
      if (r) {
        setRecord(r);
        setPending(false);
        clearInterval(iv);
      } else if (!readPending() || tries >= 10) {
        setPending(false);
        clearInterval(iv);
      }
    }, 2500);
    return () => clearInterval(iv);
  }, [record, pending]);

  if (!record && !pending) return null;

  const hasContent = record && record.artifact;

  return (
    <div className="sf-fade-enter sf-fade-enter--delay-1" style={{ marginBottom: "var(--sf-space-32)" }}>
      <CollapsibleSection label="The day, named" defaultOpen>
        {!hasContent ? (
          <p style={COMPOSING}>Composing from today&rsquo;s practice&hellip;</p>
        ) : (
          <p style={ARTIFACT}>{record.artifact}</p>
        )}
      </CollapsibleSection>
    </div>
  );
}

const ARTIFACT = {
  margin: "var(--sf-space-8) 0 0",
  fontFamily: "var(--sf-font-serif)",
  fontWeight: 400,
  fontSize: "20px",
  lineHeight: 1.4,
  color: "var(--sf-text-cream)",
};
const COMPOSING = {
  margin: "var(--sf-space-16) 0 0",
  fontFamily: "var(--sf-font-sans)",
  fontWeight: 300,
  fontSize: "14px",
  lineHeight: 1.55,
  color: "var(--sf-text-faint)",
};
