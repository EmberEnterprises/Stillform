import React, { useEffect } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import { assembleNarrativeArc } from "../lib/narrativeArc.js";

/**
 * NarrativeArc — the surface for the arc assembler (wow-layer / My Progress).
 *
 * Lays the user's accumulated practice out as a through-line, built ONLY from
 * their own content: their named moments over time (beats), the patterns that
 * recur (threads), the predictions that didn't come true (turning points). The
 * assembler never imposes a story or forces a redemption arc; this surface just
 * renders what it returns, chronological, reflect-not-score — no verdict, no
 * trajectory grade.
 *
 * Honest-empty until enough beats exist to form a line.
 *
 * COPY IS FIRST-PASS — placeholder for Arlin's voice (the framing lines
 * especially). The structure is the build; the words are hers.
 *
 * @param {function(): void} onExit — back to My Progress
 */

function formatDate(dateKey) {
  try {
    // dateKey is "YYYY-MM-DD"; render local-safe without TZ drift
    const [y, m, d] = String(dateKey).split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateKey || "";
  }
}

export default function NarrativeArc({ onExit }) {
  const arc = assembleNarrativeArc();
  useEffect(() => { window.plausible?.("Narrative Arc Viewed", { props: { ready: arc.ready } }); }, [arc.ready]);

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      {!arc.ready ? (
        <EditorialBlock label="My Progress" headline="Your arc">
          <MonoLabel>
            this builds as you practice. a few more named sessions and the through-line shows
            here — in your own words, not a story we wrote for you.
          </MonoLabel>
        </EditorialBlock>
      ) : (
        <EditorialBlock label="My Progress" headline="Your arc">
          <MonoLabel>
            {arc.span.sessionCount} session{arc.span.sessionCount === 1 ? "" : "s"} ·{" "}
            {formatDate(arc.span.firstDate)} – {formatDate(arc.span.lastDate)} · your own words,
            in order
          </MonoLabel>

          {/* the beats — named moments over time */}
          <ol style={beatListStyle}>
            {arc.beats.map((b, i) => (
              <li key={b.dateKey + i} style={beatItemStyle}>
                <span style={beatDateStyle}>{formatDate(b.dateKey)}</span>
                <span style={beatTextStyle}>
                  {b.takeaway || b.precisionName}
                </span>
              </li>
            ))}
          </ol>

          {/* threads — recurring patterns the user confirmed */}
          {arc.threads.length > 0 && (
            <div style={blockStyle}>
              <MonoLabel>what kept showing up</MonoLabel>
              <p style={listLineStyle}>{arc.threads.join(" · ")}</p>
            </div>
          )}

          {/* turning points — disconfirmations */}
          {arc.turningPoints.length > 0 && (
            <div style={blockStyle}>
              <MonoLabel>turning points — things you were braced for that didn't come</MonoLabel>
              <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.1rem" }}>
                {arc.turningPoints.map((t, i) => (
                  <li key={i} style={{ margin: "0.25rem 0", opacity: 0.85 }}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </EditorialBlock>
      )}
    </main>
  );
}

/* ── styles (idiom: mirror back button + sf vars) ── */
const backStyle = {
  background: "none",
  border: "none",
  color: "var(--sf-ink-soft, #888)",
  fontSize: "0.85rem",
  cursor: "pointer",
  padding: "0 0 var(--sf-space-16, 16px)",
};
const beatListStyle = { listStyle: "none", margin: "1.25rem 0 0", padding: 0 };
const beatItemStyle = {
  display: "flex",
  gap: "0.75rem",
  padding: "0.6rem 0",
  borderTop: "1px solid var(--sf-line, #eee)",
  alignItems: "baseline",
};
const beatDateStyle = {
  flex: "0 0 3.2rem",
  fontSize: "0.7rem",
  opacity: 0.55,
  fontVariantNumeric: "tabular-nums",
};
const beatTextStyle = { flex: 1, lineHeight: 1.4 };
const blockStyle = { marginTop: "1.5rem" };
const listLineStyle = { margin: "0.4rem 0 0", opacity: 0.85, lineHeight: 1.5 };
