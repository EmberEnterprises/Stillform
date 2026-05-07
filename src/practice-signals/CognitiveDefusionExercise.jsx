// Practice Signals — Cognitive Defusion exercise component
// CFM Phase 1 Sprint 3 · May 7, 2026
//
// Mechanics:
//   1. Show one thought stimulus
//   2. 60-second window, user types alternative frames into a text area
//   3. Each Enter (or comma) commits a frame and clears the input
//   4. On timeout or "Done early", send all frames to scoring function
//   5. Display the scored result (distinct/reworded/same counts)
//   6. Save via appendFunctionCheck and close
//
// What gets saved (Phase 0 schema):
//   candidate: COGNITIVE_DEFUSION
//   primaryCount: distinct count (the trend metric)
//   primaryMs: total elapsed ms (for context, not the headline number)
//   bioFilter: array of active bio-filter tokens at session start
//
// Scoring rubric (Decision 7) is applied server-side in
// netlify/functions/cognitive-defusion-score.js.

import { useState, useEffect, useRef } from "react";
import { getValidatedDefusionStimuli } from "./cognitive-defusion-stimuli";

const TIME_LIMIT_MS = 60 * 1000;
const FRAME_MAX_LEN = 300;

const pickThought = () => {
  const pool = getValidatedDefusionStimuli();
  return pool[Math.floor(Math.random() * pool.length)];
};

const SCORE_API_URL = "/.netlify/functions/cognitive-defusion-score";

export function CognitiveDefusionExercise({ onComplete, onClose, bioFilter = null }) {
  const [phase, setPhase] = useState("intro"); // intro | active | scoring | summary | error
  const [thought] = useState(() => pickThought());
  const [frames, setFrames] = useState([]);
  const [draft, setDraft] = useState("");
  const [timeLeftMs, setTimeLeftMs] = useState(TIME_LIMIT_MS);
  const [scoreResult, setScoreResult] = useState(null);
  const startTimeRef = useRef(0);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  // Countdown timer when in active phase.
  useEffect(() => {
    if (phase !== "active") return;
    timerRef.current = setInterval(() => {
      setTimeLeftMs((prev) => {
        const next = prev - 100;
        if (next <= 0) {
          clearInterval(timerRef.current);
          // Defer phase change to avoid setState-during-render warning.
          setTimeout(() => finishActive(), 0);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Auto-focus input on active phase.
  useEffect(() => {
    if (phase === "active" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase]);

  const handleStart = () => {
    startTimeRef.current = Date.now();
    setTimeLeftMs(TIME_LIMIT_MS);
    setPhase("active");
  };

  const commitFrame = () => {
    const trimmed = draft.trim();
    if (trimmed.length === 0) return;
    if (trimmed.length > FRAME_MAX_LEN) return;
    if (frames.length >= 10) return; // server caps at 10 anyway
    setFrames(prev => [...prev, trimmed]);
    setDraft("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      commitFrame();
    }
  };

  const finishActive = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    // Capture any draft still in the input.
    const finalFrames = draft.trim().length > 0 && frames.length < 10
      ? [...frames, draft.trim()]
      : frames;
    if (finalFrames.length === 0) {
      // Nothing to score — record a check with 0 distinct frames.
      const elapsedMs = Date.now() - startTimeRef.current;
      setScoreResult({ distinctCount: 0, rewordedCount: 0, sameCount: 0, scores: [], elapsedMs });
      setPhase("summary");
      return;
    }
    setPhase("scoring");
    try {
      const response = await fetch(SCORE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thought: thought.thought, frames: finalFrames })
      });
      if (!response.ok) throw new Error(`scoring failed: ${response.status}`);
      const data = await response.json();
      setScoreResult({
        ...data,
        elapsedMs: Date.now() - startTimeRef.current,
        framesSubmitted: finalFrames
      });
      setPhase("summary");
    } catch {
      setPhase("error");
    }
  };

  const handleFinish = () => {
    if (!scoreResult) return;
    const summary = {
      candidate: "cognitive-defusion",
      primaryCount: scoreResult.distinctCount || 0,
      primaryMs: scoreResult.elapsedMs || null,
      specificity: null,
      bioFilter: bioFilter,
      toolsBeforeMs: null,
      timestamp: new Date().toISOString(),
      // Extra context for trend display
      rewordedCount: scoreResult.rewordedCount || 0,
      sameCount: scoreResult.sameCount || 0,
      framesSubmitted: scoreResult.framesSubmitted?.length || 0
    };
    if (onComplete) onComplete(summary);
  };

  const stillformAmber = "var(--amber)";
  const muted = "var(--text-muted)";

  // ─── INTRO ─────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div style={{ padding: "32px 24px", textAlign: "left", maxWidth: 480, margin: "0 auto" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: muted, fontSize: 12, cursor: "pointer", marginBottom: 16, padding: "8px 0" }} aria-label="Close cognitive defusion check">← Close</button>
        <div className="t-mono-xs" style={{ color: stillformAmber, marginBottom: 12 }}>Cognitive defusion · signal check</div>
        <h2 className="t-display-md" style={{ marginBottom: 16 }}>How many distinct frames you can generate</h2>
        <div className="t-body-sm quiet" style={{ lineHeight: 1.7, marginBottom: 16 }}>
          You'll see one sticky thought. You'll have 60 seconds to type alternative frames —
          different ways of seeing the same situation. Hit Enter after each frame.
        </div>
        <div className="t-body-sm quiet" style={{ lineHeight: 1.7, marginBottom: 24 }}>
          Each frame gets scored. Distinct count is what's tracked over time —
          the function defusion practice trains.
        </div>
        <div className="t-caption quiet" style={{ marginBottom: 32, padding: "12px 14px", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)" }}>
          Quality over quantity. A reworded version of the same thought won't help your trend.
        </div>
        <button className="btn btn-primary" onClick={handleStart} style={{ width: "100%" }}>
          Begin
        </button>
      </div>
    );
  }

  // ─── ACTIVE ────────────────────────────────────────────────────────
  if (phase === "active") {
    const secondsLeft = Math.max(0, Math.ceil(timeLeftMs / 1000));
    return (
      <div style={{ padding: "32px 24px", textAlign: "left", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div className="t-mono-xs" style={{ color: muted }}>
            {frames.length} frame{frames.length !== 1 ? "s" : ""}
          </div>
          <div className="t-mono-xs" style={{ color: secondsLeft <= 10 ? stillformAmber : muted }}>
            {secondsLeft}s
          </div>
        </div>

        <div className="t-mono-xs" style={{ color: stillformAmber, marginBottom: 8 }}>The thought</div>
        <div style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", marginBottom: 24, padding: "16px 18px", background: "var(--surface)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r-lg)" }}>
          {thought.thought}
        </div>

        <div className="t-mono-xs" style={{ color: muted, marginBottom: 8 }}>Your frames</div>
        {frames.length > 0 && (
          <div style={{ marginBottom: 12, maxHeight: 160, overflowY: "auto" }}>
            {frames.map((f, i) => (
              <div key={i} style={{ padding: "8px 12px", marginBottom: 4, background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", fontSize: 13, lineHeight: 1.5, color: "var(--text-dim)" }}>
                {f}
              </div>
            ))}
          </div>
        )}
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a frame, hit Enter to commit"
          maxLength={FRAME_MAX_LEN}
          aria-label="Alternative frame for the thought"
          style={{
            width: "100%", padding: "12px 14px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
            background: "var(--ground-elev)", border: "0.5px solid var(--border-hi)", borderRadius: "var(--r-lg)",
            color: "var(--text)", resize: "none", minHeight: 60, marginBottom: 16
          }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary" onClick={commitFrame} style={{ flex: 1 }} disabled={draft.trim().length === 0}>
            Commit frame
          </button>
          <button className="btn btn-ghost" onClick={finishActive} style={{ flex: 1 }} aria-label="Finish early and score frames">
            Done early
          </button>
        </div>
      </div>
    );
  }

  // ─── SCORING ───────────────────────────────────────────────────────
  if (phase === "scoring") {
    return (
      <div style={{ padding: "48px 24px", textAlign: "center", maxWidth: 480, margin: "0 auto", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="t-mono-xs" style={{ color: stillformAmber, marginBottom: 12 }}>Scoring</div>
        <div className="t-body-sm quiet" style={{ lineHeight: 1.7 }}>
          Reading your frames against the rubric — distinct, reworded, same.
        </div>
      </div>
    );
  }

  // ─── ERROR ─────────────────────────────────────────────────────────
  if (phase === "error") {
    return (
      <div style={{ padding: "32px 24px", textAlign: "left", maxWidth: 480, margin: "0 auto" }}>
        <div className="t-mono-xs" style={{ color: stillformAmber, marginBottom: 12 }}>Couldn't reach scoring</div>
        <div className="t-body-sm quiet" style={{ lineHeight: 1.7, marginBottom: 24 }}>
          Something went wrong scoring your frames. Your check wasn't saved, but your work is preserved
          if you want to try again.
        </div>
        <button className="btn btn-primary" onClick={() => setPhase("active")} style={{ width: "100%", marginBottom: 8 }}>
          Try again
        </button>
        <button className="btn btn-ghost" onClick={onClose} style={{ width: "100%" }}>
          Close
        </button>
      </div>
    );
  }

  // ─── SUMMARY ───────────────────────────────────────────────────────
  if (phase === "summary") {
    return (
      <div style={{ padding: "32px 24px", textAlign: "left", maxWidth: 480, margin: "0 auto" }}>
        <div className="t-mono-xs" style={{ color: stillformAmber, marginBottom: 12 }}>Check complete</div>
        <h2 className="t-display-md" style={{ marginBottom: 24 }}>Your signal</h2>

        <div style={{ marginBottom: 16, padding: "16px 18px", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r-lg)" }}>
          <div className="t-caption quiet" style={{ marginBottom: 4 }}>Distinct frames</div>
          <div style={{ fontSize: 24, fontFamily: "'Cormorant Garamond', serif", color: "var(--text)" }}>
            {scoreResult?.distinctCount ?? 0}
          </div>
          <div className="t-caption quiet" style={{ marginTop: 4, fontSize: 11 }}>
            {scoreResult?.rewordedCount ?? 0} reworded · {scoreResult?.sameCount ?? 0} same
          </div>
        </div>

        {scoreResult?.scores && scoreResult.scores.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div className="t-mono-xs" style={{ color: muted, marginBottom: 8 }}>Your frames, scored</div>
            {scoreResult.scores.map((s, i) => (
              <div key={i} style={{ padding: "10px 12px", marginBottom: 4, background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", fontSize: 12, lineHeight: 1.5 }}>
                <div style={{ color: "var(--text-dim)", marginBottom: 4 }}>{s.frame}</div>
                <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
                  color: s.score === "distinct" ? stillformAmber : muted }}>
                  {s.score}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="t-body-sm quiet" style={{ lineHeight: 1.7, marginBottom: 24, marginTop: 16 }}>
          Saved to your trends. Distinct count is the function defusion practice trains.
          Take another check in a few days to see whether it shifts.
        </div>

        <button className="btn btn-primary" onClick={handleFinish} style={{ width: "100%" }}>
          Done
        </button>
      </div>
    );
  }

  return null;
}
