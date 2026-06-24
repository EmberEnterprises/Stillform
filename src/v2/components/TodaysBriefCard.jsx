import React, { useEffect, useState } from "react";
import CollapsibleSection from "./CollapsibleSection.jsx";
import { readTodaysBrief } from "../lib/todaysBriefApi.js";

/**
 * TodaysBriefCard — the home-screen surface for the morning artifact (Arlin,
 * June 23: "today's brief should be on the home screen"). Generated fire-and-
 * forget when the morning beat completes (Spine), persisted day-keyed, and
 * surfaced here, re-readable all day.
 *
 * Self-gating: renders nothing when there's no brief and none is composing.
 * While a generation is in flight (the morning hook set a pending flag), it
 * shows a quiet composing line and polls until the brief lands.
 *
 * Voice is server-enforced; this component only displays the four sections.
 */

const SECTIONS = [
  { key: "hardware", label: "Hardware" },
  { key: "risks", label: "Risks" },
  { key: "moves", label: "Moves" },
  { key: "recovery", label: "Recovery" },
];

const PENDING_KEY = "stillform_todays_brief_pending";

function readPending() {
  try { return !!localStorage.getItem(PENDING_KEY); } catch { return false; }
}

export default function TodaysBriefCard() {
  const [brief, setBrief] = useState(() => readTodaysBrief());
  const [pending, setPending] = useState(() => !readTodaysBrief() && readPending());

  // Poll for arrival while a generation is pending. Stops the moment the brief
  // lands, the pending flag clears, or ~25s elapses (10 × 2.5s).
  useEffect(() => {
    if (brief || !pending) return undefined;
    let tries = 0;
    const iv = setInterval(() => {
      tries += 1;
      const b = readTodaysBrief();
      if (b) {
        setBrief(b);
        setPending(false);
        clearInterval(iv);
      } else if (!readPending() || tries >= 10) {
        setPending(false);
        clearInterval(iv);
      }
    }, 2500);
    return () => clearInterval(iv);
  }, [brief, pending]);

  if (!brief && !pending) return null;

  const hasContent = brief && SECTIONS.some(({ key }) => brief[key]);

  return (
    <div
      className="sf-fade-enter sf-fade-enter--delay-1"
      style={{ marginBottom: "var(--sf-space-32)" }}
    >
      <CollapsibleSection label="Today's Brief" defaultOpen>
        {!hasContent ? (
          <p style={COMPOSING}>Composing from this morning&rsquo;s check-in&hellip;</p>
        ) : (
          SECTIONS.map(({ key, label }) =>
            brief[key] ? (
              <div key={key} style={ROW}>
                <span style={LBL}>{label}</span>
                <p style={TXT}>{brief[key]}</p>
              </div>
            ) : null
          )
        )}
      </CollapsibleSection>
    </div>
  );
}

const ROW = {
  padding: "var(--sf-space-16) 0",
  borderBottom: "0.5px solid var(--sf-border-hairline)",
};
const LBL = {
  display: "block",
  fontFamily: "var(--sf-font-mono)",
  fontSize: "10px",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--sf-accent-line)",
  marginBottom: "var(--sf-space-8)",
};
const TXT = {
  margin: 0,
  fontFamily: "var(--sf-font-sans)",
  fontWeight: 300,
  fontSize: "15px",
  lineHeight: 1.55,
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
