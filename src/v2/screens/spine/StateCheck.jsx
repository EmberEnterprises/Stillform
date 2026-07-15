import React, { useState, useEffect } from "react";
import Button from "../../components/Button.jsx";
import MonoLabel from "../../components/MonoLabel.jsx";

/**
 * StateCheck — per-session body-state capture (M3 interoceptive strand, increment 2a).
 *
 * A quick read of what the body is running on right now, captured as discrete
 * state tokens that feed the discovery engine's body strand (signalLog `body`
 * field → tokensOf `body` token → body↔feel / body↔trigger patterns). Reuses the
 * six state tags already carried by the Move-card database, so the captured
 * state lines up with move-matching and finally populates the (currently empty)
 * bioFilter slots.
 *
 * Body-first, never diagnostic (CANON): it reads state, it does not judge it.
 * Trauma-sensitive: fully skippable, never forced, multi-select (states co-occur).
 *
 * ⚠️ VOICE IS A DRAFT. The mono label, headline, body copy, and the final state
 * LABELS are placeholders for Arlin's voice pass — only the state `id`s (the
 * discrete tokens the engine sees) are load-bearing.
 * PLACEMENT (Arlin's call, set June 23 2026): AT SESSION CLOSE — wired via the
 * Spine (Close → handleCloseToStateCheck → "statecheck" step → onDone →
 * handleCloseReturn(payload, bodyTokens) → recordSignal({ body })). The
 * ?statecheck=1 debug route remains for isolated preview. Remaining: voice pass.
 *
 * @param {object} props
 * @param {function} props.onDone   (bodyTokens: string[]) selected state ids (may be [])
 * @param {function} [props.onSkip] skipped without selecting (falls back to onDone([]))
 */

// Reused from the Move-card database's bioFilter vocabulary. The `id` is the
// discrete token the engine reads; the `label` is a DRAFT for Arlin's voice.
const STATES = [
  { id: "clear", label: "Clear" },
  { id: "activated", label: "Activated" },
  { id: "depleted", label: "Depleted" },
  { id: "sleep-deprived", label: "No sleep" },
  { id: "pain", label: "In pain" },
  { id: "hormonal", label: "Hormonal shift" },
];

export default function StateCheck({ onDone, onSkip }) {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    try { window.plausible?.("State Check Opened"); } catch { /* analytics non-fatal */ }
  }, []);

  const toggle = (id) => {
    setSelected((prev) => {
      // "clear" is exclusive — it means nothing else notable is running.
      if (id === "clear") return prev.includes("clear") ? [] : ["clear"];
      const without = prev.filter((x) => x !== "clear");
      return without.includes(id) ? without.filter((x) => x !== id) : [...without, id];
    });
  };

  const done = () => {
    try { window.plausible?.("State Check Completed", { props: { count: selected.length } }); } catch { /* analytics non-fatal */ }
    try { onDone?.(selected); } catch { /* parent owns flow */ }
  };
  const skip = () => {
    try { window.plausible?.("State Check Skipped"); } catch { /* analytics non-fatal */ }
    (typeof onSkip === "function" ? onSkip : () => onDone?.([]))();
  };

  return (
    <main className="sf-page sf-page--hero">
      <div className="sf-fade-enter" style={{ textAlign: "center" }}>
        <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
          {/* DRAFT — Arlin's voice */}
          System check
        </MonoLabel>
        <div style={HEADLINE}>What's your body running on right now?</div>
        <div style={BODY}>
          {/* DRAFT — Arlin's voice */}
          Not how you feel — what your hardware's carrying. Tap any that fit, or skip.
        </div>
        <div style={CHIPS}>
          {STATES.map((s) => {
            const on = selected.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggle(s.id)}
                aria-pressed={on}
                style={{ ...CHIP, ...(on ? CHIP_ON : null) }}
              >
                {s.label}
              </button>
            );
          })}
        </div>
        <div style={ROW}>
          <Button variant="primary" onClick={done}>Continue</Button>
        </div>
        <button
          type="button"
          onClick={skip}
          className="sf-link-quiet"
          style={{ marginTop: "var(--sf-space-24)" }}
        >
          Skip this ›
        </button>
      </div>
    </main>
  );
}

// Shared inline style tokens — parity with Reset / MoveCard / BreathingSession.
const HEADLINE = {
  fontSize: "clamp(1.5rem, 5vw, 2rem)",
  fontFamily: "var(--sf-font-display)",
  fontWeight: "var(--sf-weight-light)",
  color: "var(--sf-text-primary)",
  lineHeight: 1.35,
  letterSpacing: "-0.01em",
  maxWidth: "28rem",
  margin: "0 auto var(--sf-space-16)",
};
const BODY = {
  fontSize: "clamp(1rem, 3vw, 1.125rem)",
  color: "var(--sf-text-secondary)",
  lineHeight: 1.5,
  maxWidth: "28rem",
  margin: "0 auto var(--sf-space-32)",
};
const CHIPS = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--sf-space-12)",
  justifyContent: "center",
  maxWidth: "30rem",
  margin: "0 auto var(--sf-space-32)",
};
const CHIP = {
  padding: "var(--sf-space-12) var(--sf-space-16)",
  borderRadius: "999px",
  border: "1px solid var(--sf-border-quiet)",
  background: "transparent",
  color: "var(--sf-text-secondary)",
  fontSize: "0.95rem",
  fontFamily: "var(--sf-font-sans)",
  cursor: "pointer",
  transition: "border-color 0.15s, color 0.15s",
};
const CHIP_ON = { borderColor: "var(--sf-accent)", color: "var(--sf-text-primary)" };
const ROW = { display: "flex", gap: "var(--sf-space-16)", justifyContent: "center", flexWrap: "wrap" };
