import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import { recordBeliefRating } from "../lib/beliefRating.js";

/**
 * ThoughtRecord — the CBT-conditioning layer's surface (Precision Framework
 * §5 #4 / §2). The thought-record flow, in Stillform's spine idiom:
 *
 *   name the thought → rate belief % (the precision self-report) →
 *   examine the evidence (self-generated counter-evidence, §4) →
 *   re-rate → SEE the delta (the precision dropping, made visible).
 *
 * Honest, reflect-not-score: it never forces a drop. If the belief held, that
 * is real data too — shown plainly, no good/bad verdict. Writes one completed
 * record to beliefRating.js at the end.
 *
 * COPY IS FIRST-PASS — placeholder for Arlin's voice. The flow + structure are
 * the build; the words are hers to set on the walk.
 *
 * @param {function(): void} onExit — back to My Progress
 */

const STEPS = ["thought", "before", "examine", "after", "result"];

export default function ThoughtRecord({ onExit }) {
  const [step, setStep] = useState("thought");
  const [thought, setThought] = useState("");
  const [before, setBefore] = useState(70);
  const [evidence, setEvidence] = useState("");
  const [after, setAfter] = useState(70);
  const [saved, setSaved] = useState(false);

  const advance = (next) => setStep(next);

  const finish = () => {
    if (!saved) {
      recordBeliefRating({ thought, before, after, evidence });
      setSaved(true);
      window.plausible?.("Thought Record Completed", { props: { direction: delta < 0 ? "dropped" : delta > 0 ? "held" : "flat" } });
    }
    advance("result");
  };

  const delta = after - before; // negative = certainty dropped

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      {/* ── name the thought ── */}
      {step === "thought" && (
        <EditorialBlock label="Thought record" headline="What's the thought?">
          <MonoLabel>name it in its own words — the way it actually shows up</MonoLabel>
          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="e.g. they're done with me"
            rows={3}
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => advance("before")}
            disabled={!thought.trim()}
            style={ctaStyle(!thought.trim())}
          >
            Continue
          </button>
        </EditorialBlock>
      )}

      {/* ── rate belief (before) ── */}
      {step === "before" && (
        <EditorialBlock label="Thought record" headline="How much do you believe it — right now?">
          <MonoLabel>before you examine anything. just the gut number.</MonoLabel>
          <BeliefSlider value={before} onChange={setBefore} />
          <button type="button" onClick={() => advance("examine")} style={ctaStyle(false)}>
            Continue
          </button>
        </EditorialBlock>
      )}

      {/* ── examine the evidence ── */}
      {step === "examine" && (
        <EditorialBlock label="Thought record" headline="What's the actual evidence?">
          <MonoLabel>
            for and against. what would you tell someone else looking at this? you produce it —
            that's what moves the number.
          </MonoLabel>
          <textarea
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="what the record actually shows…"
            rows={5}
            style={inputStyle}
          />
          <button type="button" onClick={() => advance("after")} style={ctaStyle(false)}>
            Continue
          </button>
        </EditorialBlock>
      )}

      {/* ── re-rate (after) ── */}
      {step === "after" && (
        <EditorialBlock label="Thought record" headline="Now — how much do you believe it?">
          <MonoLabel>same thought, after looking. wherever it actually sits.</MonoLabel>
          <div style={{ opacity: 0.6, marginBottom: "var(--sf-space-8, 8px)" }}>
            <MonoLabel>“{thought}”</MonoLabel>
          </div>
          <BeliefSlider value={after} onChange={setAfter} />
          <button type="button" onClick={finish} style={ctaStyle(false)}>
            See it
          </button>
        </EditorialBlock>
      )}

      {/* ── the delta, made visible ── */}
      {step === "result" && (
        <EditorialBlock label="Thought record" headline={resultHeadline(delta)}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", margin: "0.5rem 0 1rem" }}>
            <span style={numStyle}>{before}</span>
            <span style={{ opacity: 0.5 }}>→</span>
            <span style={numStyle}>{after}</span>
            <span style={{ opacity: 0.6, fontSize: "0.85rem" }}>belief %</span>
          </div>
          <MonoLabel>{resultLine(delta)}</MonoLabel>
          <button type="button" onClick={onExit} style={ctaStyle(false)}>
            Done
          </button>
        </EditorialBlock>
      )}
    </main>
  );
}

/* ── first-pass result voice (placeholder — Arlin's to set) ── */
function resultHeadline(delta) {
  if (delta < 0) return "It lost some of its grip.";
  if (delta > 0) return "It held — and that's real too.";
  return "It didn't move.";
}
function resultLine(delta) {
  if (delta < 0)
    return `looking at the evidence dropped its certainty by ${Math.abs(delta)} points. that drop is the prior loosening — exactly the work.`;
  if (delta > 0)
    return `it gained ${delta} points. no verdict here — sometimes the evidence backs the thought. that's honest data, not a wrong answer.`;
  return "the number stayed put. that's information, not failure — some thoughts need more than one look.";
}

/* ── belief slider ── */
function BeliefSlider({ value, onChange }) {
  return (
    <div style={{ margin: "0.75rem 0 1.25rem" }}>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Belief strength percent"
        style={{ width: "100%" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.5, fontSize: "0.7rem" }}>
        <span>not at all</span>
        <span style={{ opacity: 1, fontWeight: 600, fontSize: "1rem" }}>{value}%</span>
        <span>completely</span>
      </div>
    </div>
  );
}

/* ── styles (idiom: PredictionErrorMirror back button + sf vars) ── */
const backStyle = {
  background: "none",
  border: "none",
  color: "var(--sf-ink-soft, #888)",
  fontSize: "0.85rem",
  cursor: "pointer",
  padding: "0 0 var(--sf-space-16, 16px)",
};
const inputStyle = {
  width: "100%",
  margin: "0.75rem 0 1rem",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid var(--sf-line, #ddd)",
  background: "var(--sf-surface, #fff)",
  color: "var(--sf-ink, #111)",
  font: "inherit",
  resize: "vertical",
};
const numStyle = { fontSize: "2rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" };
const ctaStyle = (disabled) => ({
  width: "100%",
  padding: "0.85rem",
  borderRadius: "10px",
  border: "none",
  background: disabled ? "var(--sf-line, #ccc)" : "var(--sf-ink, #111)",
  color: disabled ? "var(--sf-ink-soft, #888)" : "var(--sf-surface, #fff)",
  font: "inherit",
  fontWeight: 600,
  cursor: disabled ? "default" : "pointer",
});
