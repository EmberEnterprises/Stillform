import React, { useState, useEffect } from "react";
import Button from "../../components/Button.jsx";
import MonoLabel from "../../components/MonoLabel.jsx";

/**
 * Reset — urge-surf surface (Phase 6.3a).
 *
 * The Support Sheet's second in-the-moment tool. For acute compulsion pulls —
 * scroll, check, scratch, the text you want to send. A ~30-second flow:
 *   name the pull (brief affect-label — Lieberman 2007)
 *   → watch it ~22s without acting (interoception; urges crest and pass —
 *     Marlatt urge-surfing — the freeze-restart pattern adapted for compulsion)
 *   → decide: act or don't (the user's call, never forced, never scored).
 *
 * NOT gamified — no streak, no count, no "you resisted" tally. Acting and not
 * acting exit the same way; the practice is the watching, not the outcome
 * (CANON §10 reflect-don't-score — the act-or-don't is agency, not a test).
 *
 * Self-contained like MoveCard: fires onDone when the user leaves the decide
 * step (either choice), onExit on backing out before deciding, and onDoMove if
 * the parent wires the cross-route to the Move card.
 *
 * @param {object} props
 * @param {function} props.onDone     finished (acted or not — same exit)
 * @param {function} [props.onExit]   backed out before deciding (falls back to onDone)
 * @param {function} [props.onDoMove] optional cross-route to the Move card
 */

// Watch-phase prompts — interoception, ~22s total. Hold with or without a
// named pull. Urge-surfing: ride the wave, watch it crest and pass (Marlatt).
const WATCH_PROMPTS = [
  { text: "Don't act on it. Just watch it.", seconds: 7 },
  { text: "Where do you feel the pull? Put your attention right there.", seconds: 8 },
  { text: "It's already changing. Urges rise, peak, and pass — watch this one move.", seconds: 7 },
];

export default function Reset({ onDone, onExit, onDoMove }) {
  const [phase, setPhase] = useState("name"); // name → watch → decide
  const [pull, setPull] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(WATCH_PROMPTS[0].seconds);

  // "Reset Started" once on mount (telemetry, not a score).
  useEffect(() => {
    try { window.plausible?.("Reset Started"); } catch { /* analytics non-fatal */ }
  }, []);

  // Watch-phase tick — mirrors MoveRunner. Active only during "watch".
  useEffect(() => {
    if (phase !== "watch") return;
    if (secondsLeft <= 0) {
      if (promptIndex >= WATCH_PROMPTS.length - 1) {
        setPhase("decide");
      } else {
        const next = promptIndex + 1;
        setPromptIndex(next);
        setSecondsLeft(WATCH_PROMPTS[next].seconds);
      }
      return;
    }
    const t = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, secondsLeft, promptIndex]);

  const startWatch = () => setPhase("watch");
  const toDecide = () => setPhase("decide");
  const done = () => { if (typeof onDone === "function") onDone(); };
  const back = () => { if (typeof onExit === "function") onExit(); else done(); };
  const doMove = () => {
    try { window.plausible?.("Reset to Move"); } catch { /* non-fatal */ }
    if (typeof onDoMove === "function") onDoMove();
  };

  // ── name ───────────────────────────────────────────────────────────────
  if (phase === "name") {
    return (
      <main className="sf-page sf-page--hero">
        <div className="sf-fade-enter" style={{ textAlign: "center" }}>
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
            Reset
          </MonoLabel>
          <div style={HEADLINE}>Name the pull.</div>
          <div style={BODY}>
            What do you feel pulled to do right now? Naming it is the first step out of it.
          </div>
          <input
            type="text"
            value={pull}
            onChange={(e) => setPull(e.target.value)}
            placeholder="scroll, check, the text you want to send…"
            aria-label="Name the pull"
            className="sf-input"
            style={{ maxWidth: "26rem", margin: "0 auto var(--sf-space-32)", display: "block" }}
          />
          <div style={ROW}>
            <Button variant="primary" onClick={startWatch}>Watch it ›</Button>
            <Button variant="ghost" onClick={back}>Not now</Button>
          </div>
        </div>
      </main>
    );
  }

  // ── watch ──────────────────────────────────────────────────────────────
  if (phase === "watch") {
    const cur = WATCH_PROMPTS[promptIndex];
    const pct = ((cur.seconds - secondsLeft) / cur.seconds) * 100;
    const named = pull.trim();
    return (
      <main className="sf-page sf-page--hero">
        <div className="sf-fade-enter" style={{ textAlign: "center" }}>
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
            {named ? `Watch it · ${named}` : "Watch it"}
          </MonoLabel>
          <div style={{ ...HEADLINE, marginBottom: "var(--sf-space-32)" }}>{cur.text}</div>
          <div style={COUNTDOWN} aria-live="polite" aria-atomic="true">{secondsLeft}</div>
          <ProgressBar pct={pct} />
          <Button variant="ghost" onClick={toDecide}>I've watched it</Button>
        </div>
      </main>
    );
  }

  // ── decide ─────────────────────────────────────────────────────────────
  return (
    <main className="sf-page sf-page--hero">
      <div className="sf-fade-enter" style={{ textAlign: "center" }}>
        <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
          Your call
        </MonoLabel>
        <div style={HEADLINE}>The wave's already moving.</div>
        <div style={BODY}>
          Urges pass whether you act on them or not. What you do now is yours — both ways are fine.
        </div>
        <div style={ROW}>
          <Button variant="primary" onClick={done}>Let it pass</Button>
          <Button variant="ghost" onClick={done}>I'm going to act</Button>
        </div>
        {typeof onDoMove === "function" && (
          <button
            type="button"
            onClick={doMove}
            className="sf-link-quiet"
            style={{ marginTop: "var(--sf-space-24)" }}
          >
            Do a move instead ›
          </button>
        )}
      </div>
    </main>
  );
}

// Shared inline style tokens — parity with MoveRunner / MoveCard / BreathingSession.
// Module-scoped (initialized before any render), referenced by the component above.
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
const COUNTDOWN = {
  fontSize: "clamp(3rem, 12vw, 4.5rem)",
  fontFamily: "var(--sf-font-display)",
  fontWeight: "var(--sf-weight-light)",
  color: "var(--sf-accent)",
  marginBottom: "var(--sf-space-24)",
  fontVariantNumeric: "tabular-nums",
};
const ROW = { display: "flex", gap: "var(--sf-space-16)", justifyContent: "center", flexWrap: "wrap" };

function ProgressBar({ pct }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        width: "100%",
        maxWidth: "20rem",
        height: "2px",
        background: "var(--sf-border-quiet)",
        margin: "0 auto var(--sf-space-48)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${pct}%`,
          background: "var(--sf-accent)",
          transition: "width 1s linear",
        }}
      />
    </div>
  );
}
