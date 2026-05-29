import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import Button from "../components/Button.jsx";
import BreathingSession from "../components/BreathingSession.jsx";
import { generatePreEventBrief } from "../lib/preEventBriefApi.js";

/**
 * PreEventBrief — the before-the-event artifact (Phase 7b).
 *
 * A standalone surface (NOT a Notice → Reframe → Close beat): you name one
 * thing coming up, and the backend (netlify/functions/pre-event-brief.js)
 * returns a four-section operator-tier brief to walk in with —
 *   - Hardware: the body state you're in right now (Barrett 2017)
 *   - Risks:    what's load-bearing about THIS event (Heider 1958 / Lazarus 1991)
 *   - Moves:    if-then implementation intentions for it (Gollwitzer 1999)
 *   - Recovery: the downregulation move after it ends (Sheppes & Gross 2011)
 * — then an optional priming breath before you go in.
 *
 * Box breathing is the spec default; BreathingSession ships no true box
 * (4-4-4-4) pattern, so per Close's documented convention box → quick-reset
 * (the ~1-min priming pattern — settle without dropping arousal too far,
 * "regulated but engaged"). The "AI override on acute state" refinement
 * (swap priming for downregulation when the read is acute) needs state
 * detection and comes later.
 *
 * Self-contained: onDone (finished / walked in) and onExit (backed out).
 * Reached from My Progress; AppV2 routes both back. Ephemeral — the brief
 * is for the next 30 minutes, not stored.
 */

const SECTIONS = [
  { key: "hardware", label: "Hardware" },
  { key: "risks", label: "Risks" },
  { key: "moves", label: "Moves" },
  { key: "recovery", label: "Recovery" },
];

const SECTION_TEXT = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "18px",
  lineHeight: 1.5,
  color: "var(--sf-text-primary)",
  margin: 0,
};

const FIELD_LABEL = { display: "block", marginBottom: "var(--sf-space-8)" };

export default function PreEventBrief({ seed = "", onDone, onExit }) {
  const [phase, setPhase] = useState("input"); // input | generating | brief | breathing | error
  const [eventTitle, setEventTitle] = useState(typeof seed === "string" ? seed : "");
  const [eventStart, setEventStart] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [brief, setBrief] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const canGenerate = eventTitle.trim().length > 0;

  const run = async () => {
    if (!canGenerate) return;
    setPhase("generating");
    setErrorMsg("");
    try {
      const res = await generatePreEventBrief({ eventTitle, eventStart, eventDescription });
      if (res.error) {
        setErrorMsg(res.error);
        setPhase("error");
        return;
      }
      setBrief({ hardware: res.hardware, risks: res.risks, moves: res.moves, recovery: res.recovery });
      setPhase("brief");
      try { window.plausible?.("Pre-event Brief Generated"); } catch { /* analytics non-fatal */ }
    } catch {
      setErrorMsg("Couldn't reach the network. Try again.");
      setPhase("error");
    }
  };

  // ---- INPUT ----
  if (phase === "input") {
    return (
      <main className="sf-page sf-page--hero">
        <button
          type="button"
          onClick={onExit}
          aria-label="Back"
          style={{
            background: "transparent",
            border: "none",
            color: "var(--sf-text-faint)",
            fontFamily: "var(--sf-font-mono)",
            fontSize: "11px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
            padding: "8px 0",
            marginBottom: "var(--sf-space-16)",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          ← back
        </button>

        <div className="sf-fade-enter">
          <EditorialBlock
            label="Pre-event"
            headline="What's coming up?"
            headlineSize="lg"
            body="One thing on the horizon — the meeting, the call, the room you're about to walk into. A brief to walk in with, while there's still time to prep."
          />
        </div>

        <div className="sf-fade-enter sf-fade-enter--delay-1" style={{ marginTop: "var(--sf-space-32)" }}>
          <MonoLabel size="xs" tone="faint" style={FIELD_LABEL}>What is it?</MonoLabel>
          <input
            className="sf-input"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="The meeting, the conversation, the moment…"
            aria-label="The event"
            autoFocus
          />
        </div>

        <div className="sf-fade-enter sf-fade-enter--delay-2" style={{ marginTop: "var(--sf-space-24)" }}>
          <MonoLabel size="xs" tone="faint" style={FIELD_LABEL}>When? (optional)</MonoLabel>
          <input
            className="sf-input"
            value={eventStart}
            onChange={(e) => setEventStart(e.target.value)}
            placeholder="In 30 minutes · 2pm · tomorrow morning"
            aria-label="When"
          />
        </div>

        <div className="sf-fade-enter sf-fade-enter--delay-2" style={{ marginTop: "var(--sf-space-24)" }}>
          <MonoLabel size="xs" tone="faint" style={FIELD_LABEL}>Anything else worth knowing? (optional)</MonoLabel>
          <textarea
            className="sf-textarea"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            placeholder="Who's in the room, what's at stake, what you're carrying in…"
            rows={3}
            aria-label="Context"
          />
        </div>

        <div
          className="sf-fade-enter sf-fade-enter--delay-3"
          style={{ marginTop: "var(--sf-space-48)", display: "flex", alignItems: "center", gap: "var(--sf-space-16)" }}
        >
          <Button
            variant="primary"
            onClick={run}
            disabled={!canGenerate}
            aria-disabled={!canGenerate}
            style={!canGenerate ? { opacity: 0.4, cursor: "not-allowed" } : undefined}
          >
            Brief me
          </Button>
          <button type="button" onClick={onExit} className="sf-link-quiet">
            Not now ›
          </button>
        </div>
      </main>
    );
  }

  // ---- GENERATING ----
  if (phase === "generating") {
    return (
      <main className="sf-page sf-page--hero">
        <div className="sf-fade-enter" style={{ marginTop: "var(--sf-space-64)" }}>
          <MonoLabel size="xs" tone="faint">Reading the room…</MonoLabel>
        </div>
      </main>
    );
  }

  // ---- BREATHING (priming; box → quick-reset) ----
  if (phase === "breathing") {
    return (
      <BreathingSession pattern="quick-reset" onComplete={onDone} onSkip={onDone} />
    );
  }

  // ---- ERROR ----
  if (phase === "error") {
    return (
      <main className="sf-page sf-page--hero">
        <div className="sf-fade-enter">
          <EditorialBlock label="Pre-event" headline="Didn't come through." headlineSize="lg" body={errorMsg} />
        </div>
        <div
          className="sf-fade-enter sf-fade-enter--delay-2"
          style={{ marginTop: "var(--sf-space-48)", display: "flex", alignItems: "center", gap: "var(--sf-space-16)" }}
        >
          <Button variant="primary" onClick={() => setPhase("input")}>Try again</Button>
          <button type="button" onClick={onExit} className="sf-link-quiet">Leave it ›</button>
        </div>
      </main>
    );
  }

  // ---- BRIEF (4 sections + priming breath) ----
  return (
    <main className="sf-page sf-page--hero">
      <div className="sf-fade-enter">
        <EditorialBlock
          label="Pre-event brief"
          headline={eventTitle.trim() || "Walking in"}
          headlineSize="md"
          body={eventStart.trim() || null}
        />
      </div>

      <div style={{ marginTop: "var(--sf-space-32)" }}>
        {SECTIONS.map(({ key, label }, i) =>
          brief && brief[key] ? (
            <div
              key={key}
              className={`sf-fade-enter sf-fade-enter--delay-${Math.min(i + 1, 3)}`}
              style={{ marginTop: i === 0 ? 0 : "var(--sf-space-32)" }}
            >
              <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-8)" }}>
                {label}
              </MonoLabel>
              <p style={SECTION_TEXT}>{brief[key]}</p>
            </div>
          ) : null
        )}
      </div>

      <div
        className="sf-fade-enter sf-fade-enter--delay-3"
        style={{
          marginTop: "var(--sf-space-48)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "var(--sf-space-16)",
        }}
      >
        <Button variant="primary" onClick={() => setPhase("breathing")}>
          One breath before you go in
        </Button>
        <button type="button" onClick={onDone} className="sf-link-quiet">
          I'm ready ›
        </button>
      </div>
    </main>
  );
}
