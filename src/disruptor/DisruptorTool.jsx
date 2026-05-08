// Pattern Disruption — Disruptor Tool component
// May 7, 2026 · per PATTERN_DISRUPTION_SPEC.md §4
// May 8, 2026 · refactored to consume SomaticPromptRunner (Phase 8c) so the
// running-phase state machine is shared with MoveCardTool. Intro and
// reflection screens unchanged from the May 7 ship.
//
// Locked science (spec §4.2):
//   - Attentional capture by novel stimulus (Sokolov orienting response)
//   - Somatic anchoring (Porges, Levine)
//   - Brief duration (60-120s)
//
// Mechanic: somatic redirection — single-track guided body experience.
// Mix of pressure, breath, temperature attention, posture shift over ~90s.
// Auto-advances through prompts; no verbal input required (body-first
// compliant per spec §2.3 + Q6).
//
// What gets saved:
//   stillform_disruptor_sessions: { id, timestamp, patternId, dimension,
//     durationMs, completed, pathway: "somatic-redirection" }
//
// What it is NOT (spec §4.4):
//   - Not Reframe replacement
//   - Not meditation
//   - Not a treatment intervention. The mechanic is a felt experience of
//     the loop breaking. Anything more is over-claim.

import { useState } from "react";
import { SomaticPromptRunner } from "../move-card/SomaticPromptRunner.jsx";

// 8 prompts over ~90 seconds. Each prompt has a duration and a beat. Beats
// are short tactile moves; durations vary so the rhythm itself feels novel
// (not a mechanical timer). Mix of pressure / breath / temperature /
// posture per spec §4.2.
const SOMATIC_PROMPTS = [
  { text: "Press your feet flat into the floor.", durationMs: 8000, kind: "pressure" },
  { text: "Slow inhale through your nose. Then a longer exhale through your mouth.", durationMs: 12000, kind: "breath" },
  { text: "Push your hands together for five seconds.", durationMs: 8000, kind: "pressure" },
  { text: "Notice the temperature of the air on your skin.", durationMs: 10000, kind: "temperature" },
  { text: "Roll your shoulders back. Hold them there.", durationMs: 8000, kind: "posture" },
  { text: "Let your jaw open slightly. Let your tongue rest on the floor of your mouth.", durationMs: 10000, kind: "posture" },
  { text: "One long exhale through your mouth. All the way out.", durationMs: 12000, kind: "breath" },
  { text: "Open your gaze. Take in the room.", durationMs: 14000, kind: "attention" },
];

const TOTAL_DURATION_MS = SOMATIC_PROMPTS.reduce((sum, p) => sum + p.durationMs, 0);

export function DisruptorTool({ patternId = null, dimension = null, onComplete, onClose }) {
  const [phase, setPhase] = useState("intro"); // intro | running | reflection

  const handleStart = () => {
    setPhase("running");
  };

  const handleRunnerComplete = () => {
    setPhase("reflection");
  };

  const handleRunnerEarlyExit = ({ elapsedMs }) => {
    // Treat early exit as not completed but still record the session.
    const session = {
      patternId,
      dimension,
      durationMs: elapsedMs,
      completed: false,
      pathway: "somatic-redirection"
    };
    if (onComplete) onComplete(session);
  };

  const handleFinish = () => {
    const session = {
      patternId,
      dimension,
      durationMs: TOTAL_DURATION_MS,
      completed: true,
      pathway: "somatic-redirection"
    };
    if (onComplete) onComplete(session);
  };

  const stillformAmber = "var(--amber)";
  const muted = "var(--text-muted)";

  // ─── INTRO ─────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div style={{ padding: "32px 24px", textAlign: "left", maxWidth: 480, margin: "0 auto" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: muted, fontSize: 12, cursor: "pointer", marginBottom: 16, padding: "8px 0" }} aria-label="Close disruptor">← Close</button>
        <div className="t-mono-xs" style={{ color: stillformAmber, marginBottom: 12 }}>Pattern interrupt</div>
        <h2 className="t-display-md" style={{ marginBottom: 16 }}>Step out for 90 seconds</h2>
        <div className="t-body-sm quiet" style={{ lineHeight: 1.7, marginBottom: 16 }}>
          The mechanic is novelty in the body — pressure, breath, temperature,
          posture. The loop lives in thinking. Stepping into the body briefly
          interrupts it.
        </div>
        <div className="t-body-sm quiet" style={{ lineHeight: 1.7, marginBottom: 24 }}>
          No reading after this. No questions. Just a sequence of cues. Follow what
          the screen says. Skip anything that doesn't apply to your body right now.
        </div>
        <div className="t-caption quiet" style={{ marginBottom: 32, padding: "12px 14px", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)" }}>
          You can leave at any point. The loop you're stepping out of will still be there.
          The point is the felt experience of the break.
        </div>
        <button className="btn btn-primary" onClick={handleStart} style={{ width: "100%" }}>
          Start
        </button>
      </div>
    );
  }

  // ─── RUNNING ───────────────────────────────────────────────────────
  if (phase === "running") {
    return (
      <SomaticPromptRunner
        prompts={SOMATIC_PROMPTS}
        onComplete={handleRunnerComplete}
        onEarlyExit={handleRunnerEarlyExit}
      />
    );
  }

  // ─── REFLECTION ────────────────────────────────────────────────────
  if (phase === "reflection") {
    return (
      <div style={{ padding: "32px 24px", textAlign: "left", maxWidth: 480, margin: "0 auto" }}>
        <div className="t-mono-xs" style={{ color: stillformAmber, marginBottom: 12 }}>That was 90 seconds out</div>
        <h2 className="t-display-md" style={{ marginBottom: 24, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300 }}>
          That's what stepping out feels like.
        </h2>
        <div className="t-body-sm quiet" style={{ lineHeight: 1.7, marginBottom: 16 }}>
          Next time the pattern pulls, you can come back here — or do that move on your own.
        </div>
        <div className="t-body-sm quiet" style={{ lineHeight: 1.7, marginBottom: 32 }}>
          The break is the mechanism. Whatever the loop was, your system just demonstrated
          it can step out of it.
        </div>
        <button className="btn btn-primary" onClick={handleFinish} style={{ width: "100%" }}>
          Done
        </button>
      </div>
    );
  }

  return null;
}
