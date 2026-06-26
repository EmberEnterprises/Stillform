import React, { useState, useRef, useEffect, useMemo } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import { getAllChips } from "../lib/beatConfig.js";
import { getAffectLabelingStimuli } from "../lib/cfmStimuli.js";
import { recordFunctionCheck, getProgressVsBaseline } from "../lib/functionChecks.js";

/**
 * AffectLabelingRound — the affect-labeling exercise (CFM Candidate 1,
 * Lieberman 2007). A scenario appears; the user names the feeling with their
 * OWN feel-chips. We measure two things, quietly:
 *   • latency — how fast the naming comes (timer is SILENT; no stopwatch on
 *     screen — a visible clock creates test-anxiety and corrupts the read)
 *   • granularity — how often the pick is precise vs a fallback (Mixed/Unsure)
 *
 * There is no right answer (the chip is theirs); we never score against the
 * stimulus's authoring target. A skip is neutral — not counted, never "missed."
 * Bounded round, real finish. Records one summary to functionChecks.
 *
 * RESULT COPY is left blank for Arlin — the interpretive line is the highest-
 * stakes voice in the app. The just-the-facts numbers are shown; the meaning
 * is hers to write.
 *
 * @param {function(): void} onExit — back to the Practice-evidence hub
 */

const ROUND_SIZE = 8;
const FALLBACK_CHIPS = new Set(["mixed", "unsure"]); // precise = anything else

function shuffleTake(arr, n) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

function median(nums) {
  if (!nums.length) return null;
  const s = nums.slice().sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

export default function AffectLabelingRound({ onExit }) {
  const [phase, setPhase] = useState("intro"); // intro | items | result
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState(null);

  const stimuli = useMemo(() => shuffleTake(getAffectLabelingStimuli(), ROUND_SIZE), []);
  const chips = useMemo(() => getAllChips(), []);
  const responsesRef = useRef([]); // { latencyMs, chipId } | { skipped:true }
  const shownAtRef = useRef(0);

  // silent timer: mark when each item is shown
  useEffect(() => {
    if (phase === "items") shownAtRef.current = performance.now();
  }, [phase, index]);

  const finishRound = () => {
    const answered = responsesRef.current.filter((r) => r && !r.skipped);
    const latencies = answered.map((r) => r.latencyMs);
    const precise = answered.filter((r) => !FALLBACK_CHIPS.has(r.chipId)).length;
    const metrics = {
      medianLatencyMs: median(latencies),
      granularity: answered.length ? precise / answered.length : null,
      answered: answered.length,
    };
    recordFunctionCheck({ exercise: "affect-labeling", metrics });
    window.plausible?.("Affect Labeling Round Completed", { props: { answered: metrics.answered } });
    setResult({ metrics, progress: getProgressVsBaseline("affect-labeling") });
    setPhase("result");
  };

  const advance = (entry) => {
    responsesRef.current.push(entry);
    if (index < stimuli.length - 1) setIndex((i) => i + 1);
    else finishRound();
  };

  const onPick = (chipId) =>
    advance({ latencyMs: Math.round(performance.now() - shownAtRef.current), chipId });

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back" style={backStyle}>
        ← back
      </button>

      {phase === "intro" && (
        <EditorialBlock label="Practice evidence" headline="Affect labeling">
          <MonoLabel>
            a moment appears; you name the feeling with your own words. ~2 minutes, {ROUND_SIZE}{" "}
            moments. no right answer, no pass or fail — this just watches how the naming changes
            over time.
          </MonoLabel>
          <button type="button" onClick={() => setPhase("items")} style={ctaStyle(false)}>
            Begin
          </button>
        </EditorialBlock>
      )}

      {phase === "items" && (
        <EditorialBlock label={`${index + 1} of ${stimuli.length}`} headline={stimuli[index].text}>
          <MonoLabel>name it</MonoLabel>
          <div style={chipWrapStyle}>
            {chips.map((c) => (
              <button key={c.id} type="button" onClick={() => onPick(c.id)} style={chipStyle}>
                {c.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => advance({ skipped: true })}
            style={skipStyle}
            aria-label="Skip this one"
          >
            skip
          </button>
        </EditorialBlock>
      )}

      {phase === "result" && result && (
        <EditorialBlock label="Practice evidence" headline="Round complete">
          {/* just-the-facts (data, not interpretation) */}
          <div style={factBlock}>
            <MonoLabel>this round</MonoLabel>
            <p style={factLine}>
              {result.metrics.medianLatencyMs != null
                ? `${(result.metrics.medianLatencyMs / 1000).toFixed(1)}s typical`
                : "—"}
              {result.metrics.answered
                ? ` · ${Math.round(result.metrics.granularity * result.metrics.answered)} of ${result.metrics.answered} precise`
                : ""}
            </p>
          </div>
          {result.progress.hasComparison && (
            <div style={factBlock}>
              <MonoLabel>your first round</MonoLabel>
              <p style={factLine}>
                {result.progress.baseline.metrics.medianLatencyMs != null
                  ? `${(result.progress.baseline.metrics.medianLatencyMs / 1000).toFixed(1)}s typical`
                  : "—"}
              </p>
            </div>
          )}

          {/* RESULT VOICE — blank for Arlin. The honest interpretive line tying
              the number to the task lives here, and only here. */}
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

/* ── styles (mirror/ThoughtRecord idiom) ── */
const backStyle = {
  background: "none", border: "none", color: "var(--sf-ink-soft, #888)",
  fontSize: "0.85rem", cursor: "pointer", padding: "0 0 var(--sf-space-16, 16px)",
};
const chipWrapStyle = { display: "flex", flexWrap: "wrap", gap: "0.5rem", margin: "1rem 0" };
const chipStyle = {
  padding: "0.55rem 0.95rem", borderRadius: "999px",
  border: "1px solid var(--sf-line, #ddd)", background: "var(--sf-surface, #fff)",
  color: "var(--sf-ink, #111)", font: "inherit", cursor: "pointer",
};
const skipStyle = {
  display: "block", margin: "0.5rem auto 0", background: "none", border: "none",
  color: "var(--sf-ink-soft, #999)", fontSize: "0.8rem", cursor: "pointer", padding: "0.5rem",
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
