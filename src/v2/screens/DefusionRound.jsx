import React, { useState, useMemo } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import { getDefusionStimuli } from "../lib/cfmStimuli.js";
import { scoreDefusionFrames } from "../lib/cfmApi.js";
import { recordFunctionCheck, getProgressVsBaseline } from "../lib/functionChecks.js";

/**
 * DefusionRound — the cognitive-defusion exercise (CFM Candidate 3, ACT
 * lineage). One distressing thought appears; the user generates as many
 * genuinely DIFFERENT angles on it as they can. The scorer classifies each
 * (distinct | reworded | same) and the tracked metric is the distinct count —
 * cognitive flexibility, not correctness. No frame is "wrong"; rewording just
 * doesn't count as a new vantage point.
 *
 * Silent: no visible timer. Fail-soft: if the scorer is unreachable, the round
 * ends gently and records NOTHING (a null result must never pollute the
 * baseline). Result voice is left blank for Arlin.
 *
 * @param {function(): void} onExit — back to the Practice-evidence hub
 */

export default function DefusionRound({ onExit }) {
  const [phase, setPhase] = useState("intro"); // intro | item | reading | result | unavailable
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const stimulus = useMemo(() => {
    const all = getDefusionStimuli();
    return all[Math.floor(Math.random() * all.length)];
  }, []);

  const frames = text
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);

  const submit = async () => {
    setPhase("reading");
    const scored = await scoreDefusionFrames({ thought: stimulus.thought, frames });
    if (scored.distinctCount == null) {
      setPhase("unavailable"); // do NOT record — keep the baseline honest
      return;
    }
    const metrics = { distinctCount: scored.distinctCount, total: scored.total };
    recordFunctionCheck({ exercise: "defusion", metrics });
    setResult({ metrics, progress: getProgressVsBaseline("defusion") });
    setPhase("result");
  };

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back" style={backStyle}>
        ← back
      </button>

      {phase === "intro" && (
        <EditorialBlock label="Practice evidence" headline="Cognitive defusion">
          <MonoLabel>
            one thought appears. write as many genuinely different angles on it as you can — not
            kinder versions, actually different vantage points. the more distinct, the more
            flexible the move. no right answers.
          </MonoLabel>
          <button type="button" onClick={() => setPhase("item")} style={ctaStyle(false)}>
            Begin
          </button>
        </EditorialBlock>
      )}

      {phase === "item" && (
        <EditorialBlock label="The thought" headline={stimulus.thought}>
          <MonoLabel>your angles — one per line</MonoLabel>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"a different way to see it…\nanother…"}
            rows={6}
            style={inputStyle}
          />
          <div style={{ opacity: 0.5, fontSize: "0.75rem", marginBottom: "0.75rem" }}>
            {frames.length} angle{frames.length === 1 ? "" : "s"}
          </div>
          <button type="button" onClick={submit} disabled={frames.length === 0} style={ctaStyle(frames.length === 0)}>
            Done
          </button>
        </EditorialBlock>
      )}

      {phase === "reading" && (
        <EditorialBlock label="Practice evidence" headline="Reading your angles…">
          <MonoLabel>one moment</MonoLabel>
        </EditorialBlock>
      )}

      {phase === "unavailable" && (
        <EditorialBlock label="Practice evidence" headline="Couldn't read this round just now">
          <MonoLabel>
            the scoring isn't reachable this moment, so nothing's recorded — your baseline stays
            clean. the angles you found still count as the practice. try again later.
          </MonoLabel>
          <button type="button" onClick={onExit} style={ctaStyle(false)}>
            Done
          </button>
        </EditorialBlock>
      )}

      {phase === "result" && result && (
        <EditorialBlock label="Practice evidence" headline="Round complete">
          <div style={factBlock}>
            <MonoLabel>this round</MonoLabel>
            <p style={factLine}>
              {result.metrics.distinctCount} distinct angle
              {result.metrics.distinctCount === 1 ? "" : "s"}
              {result.metrics.total != null ? ` of ${result.metrics.total}` : ""}
            </p>
          </div>
          {result.progress.hasComparison && (
            <div style={factBlock}>
              <MonoLabel>your first round</MonoLabel>
              <p style={factLine}>{result.progress.baseline.metrics.distinctCount} distinct</p>
            </div>
          )}

          {/* RESULT VOICE — blank for Arlin. */}
          <div style={voiceSlot}>
            <MonoLabel>[ result voice — Arlin: what this means, honestly, vs their own past ]</MonoLabel>
          </div>

          <button type="button" onClick={onExit} style={ctaStyle(false)}>
            Done
          </button>
        </EditorialBlock>
      )}
    </main>
  );
}

/* ── styles ── */
const backStyle = {
  background: "none", border: "none", color: "var(--sf-ink-soft, #888)",
  fontSize: "0.85rem", cursor: "pointer", padding: "0 0 var(--sf-space-16, 16px)",
};
const inputStyle = {
  width: "100%", margin: "0.75rem 0 0.5rem", padding: "0.75rem", borderRadius: "8px",
  border: "1px solid var(--sf-line, #ddd)", background: "var(--sf-surface, #fff)",
  color: "var(--sf-ink, #111)", font: "inherit", resize: "vertical",
};
const factBlock = { margin: "0.25rem 0 1rem" };
const factLine = { margin: "0.2rem 0 0", fontSize: "1.1rem", fontVariantNumeric: "tabular-nums" };
const voiceSlot = {
  margin: "1.25rem 0", padding: "0.75rem", borderRadius: "8px",
  border: "1px dashed var(--sf-line, #ccc)", opacity: 0.7,
};
const ctaStyle = (disabled) => ({
  width: "100%", padding: "0.85rem", borderRadius: "10px", border: "none",
  background: disabled ? "var(--sf-line, #ccc)" : "var(--sf-ink, #111)",
  color: disabled ? "var(--sf-ink-soft, #888)" : "var(--sf-surface, #fff)",
  font: "inherit", fontWeight: 600, cursor: disabled ? "default" : "pointer",
});
