import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import AffectLabelingRound from "./AffectLabelingRound.jsx";
import DefusionRound from "./DefusionRound.jsx";
import { getProgressVsBaseline } from "../lib/functionChecks.js";

/**
 * PracticeEvidence — the CFM hub (placeholder name "Practice evidence";
 * NAMING + this being its own surface are Arlin's locked calls). Reachable
 * from My Progress, never auto-rendered. Holds the exercises that produce
 * honest evidence the practice is changing specific cognitive functions, read
 * only against the user's own past.
 *
 * Owns the exercise sub-navigation internally (one AppV2 route for the hub);
 * each round renders here and returns on exit. Result voice is the rounds'
 * blank for Arlin; the hub's framing lines are first-pass too.
 *
 * @param {function(): void} onExit — back to My Progress
 */

export default function PracticeEvidence({ onExit }) {
  const [view, setView] = useState("hub"); // hub | affect-labeling | defusion

  if (view === "affect-labeling") return <AffectLabelingRound onExit={() => setView("hub")} />;
  if (view === "defusion") return <DefusionRound onExit={() => setView("hub")} />;

  const al = getProgressVsBaseline("affect-labeling");
  const df = getProgressVsBaseline("defusion");

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      <EditorialBlock label="My Progress" headline="Practice evidence">
        {/* first-pass framing — Arlin's voice to set */}
        <MonoLabel>
          short exercises on the functions the practice trains. the numbers are evidence it's
          working — read against your own past, never anyone else's.
        </MonoLabel>

        <div style={{ marginTop: "1.5rem" }}>
          <ExerciseRow
            title="Affect labeling"
            note="name the feeling — measured for speed and precision over time"
            progress={al}
            unit="round"
            onTap={() => setView("affect-labeling")}
          />
          <ExerciseRow
            title="Cognitive defusion"
            note="generate different angles on a thought — measured for flexibility"
            progress={df}
            unit="round"
            onTap={() => setView("defusion")}
          />
        </div>
      </EditorialBlock>
    </main>
  );
}

function ExerciseRow({ title, note, progress, unit, onTap }) {
  return (
    <button type="button" onClick={onTap} aria-label={title} style={rowStyle}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: "0.8rem", opacity: 0.65, marginTop: "0.2rem" }}>{note}</div>
        {progress.count > 0 && (
          <div style={{ fontSize: "0.75rem", opacity: 0.5, marginTop: "0.35rem" }}>
            {progress.count} {unit}
            {progress.count === 1 ? "" : "s"} so far
          </div>
        )}
      </div>
      <span style={{ opacity: 0.4 }}>→</span>
    </button>
  );
}

/* ── styles ── */
const backStyle = {
  background: "none", border: "none", color: "var(--sf-ink-soft, #888)",
  fontSize: "0.85rem", cursor: "pointer", padding: "0 0 var(--sf-space-16, 16px)",
};
const rowStyle = {
  display: "flex", alignItems: "center", gap: "0.75rem", width: "100%",
  textAlign: "left", padding: "1rem 0", background: "none",
  border: "none", borderTop: "1px solid var(--sf-line, #eee)",
  color: "var(--sf-ink, #111)", font: "inherit", cursor: "pointer",
};
