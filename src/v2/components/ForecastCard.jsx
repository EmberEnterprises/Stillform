import React, { useState } from "react";
import MonoLabel from "../components/MonoLabel.jsx";
import {
  getActiveForecast,
  recordForecastShown,
  getPendingFollowUp,
  recordFollowUpOutcome,
} from "../lib/forecastLoop.js";

/**
 * ForecastCard — FORECAST-AND-VERIFY on the home (Arlin's canonical spec).
 *
 * Carries the whole closed loop in one quiet card:
 *   FORECAST  — the threshold question ("X is around again — the last few
 *               times Y followed. Feel like that, or different?"). THE
 *               QUESTION IS THE INTERVENTION; answering it IS the
 *               acknowledgment that breaks the automatic loop.
 *   GET AHEAD — "work it now" hands into the practice (onEnterPractice).
 *   FOLLOW UP — when a prior forecast's window has passed: "how did it go?"
 *               Two honest answers: about the same / different this time.
 *   BREAK     — a possible break is reflected ONLY when their word AND their
 *               record agree (double-gated in forecastLoop), and only as a
 *               question they own. Never a claim, never a celebration.
 *
 * Guardrails live in the lib (arithmetic only, questions only, remembered-
 * with-you); this surface adds nothing on top of them. Renders nothing when
 * the loop has nothing (honest-empty). Follow-up takes precedence over a new
 * forecast — close the open loop before opening another.
 *
 * @param {function(): void} onEnterPractice — the get-ahead route
 */
export default function ForecastCard({ onEnterPractice }) {
  const [followUp, setFollowUp] = useState(() => {
    try { return getPendingFollowUp(); } catch { return null; }
  });
  const [forecast, setForecast] = useState(() => {
    try {
      const f = getPendingFollowUp() ? null : getActiveForecast();
      if (f) { try { recordForecastShown(f); } catch { /* fail-silent */ } }
      return f;
    } catch { return null; }
  });
  const [breakLine, setBreakLine] = useState(null);

  const answer = (feel) => {
    if (!followUp) return;
    try {
      const out = recordFollowUpOutcome(followUp.id, feel);
      setFollowUp(null);
      if (out.possibleBreak && out.line) setBreakLine(out.line);
    } catch {
      setFollowUp(null);
    }
  };

  /* ── the break reflection (theirs to own; one tap and it rests) ── */
  if (breakLine) {
    return (
      <section className="sf-sec" aria-label="Something shifted">
        <div className="sf-sec-head">
          <span className="sf-sec-head-lbl">From your record</span>
          <div className="sf-sec-rule" />
        </div>
        <p style={LINE}>{breakLine}</p>
        <button type="button" className="sf-link-quiet" onClick={() => setBreakLine(null)}>
          noted
        </button>
      </section>
    );
  }

  /* ── the follow-up (close the open loop first) ── */
  if (followUp) {
    return (
      <section className="sf-sec" aria-label="Following up">
        <div className="sf-sec-head">
          <span className="sf-sec-head-lbl">Following up</span>
          <div className="sf-sec-rule" />
        </div>
        <p style={LINE}>{followUp.question}</p>
        <div style={{ display: "flex", gap: "var(--sf-space-12)", marginTop: "var(--sf-space-8)" }}>
          <button type="button" className="sf-link-quiet" onClick={() => answer("same")}>
            about the same
          </button>
          <button type="button" className="sf-link-quiet" onClick={() => answer("different")}>
            different this time
          </button>
        </div>
      </section>
    );
  }

  /* ── the forecast (the threshold question) ── */
  if (forecast) {
    return (
      <section className="sf-sec" aria-label="From your own pattern">
        <div className="sf-sec-head">
          <span className="sf-sec-head-lbl">From your own pattern</span>
          <div className="sf-sec-rule" />
        </div>
        <p style={LINE}>{forecast.question}</p>
        <div style={{ display: "flex", gap: "var(--sf-space-12)", marginTop: "var(--sf-space-8)", alignItems: "center" }}>
          {typeof onEnterPractice === "function" && (
            <button type="button" className="sf-link-quiet" onClick={onEnterPractice}>
              work it now
            </button>
          )}
          <button type="button" className="sf-link-quiet" onClick={() => setForecast(null)}>
            noted — I've got it
          </button>
        </div>
      </section>
    );
  }

  return null;
}

const LINE = {
  fontFamily: "var(--sf-font-serif)",
  fontWeight: 300,
  fontSize: "15px",
  lineHeight: 1.65,
  color: "var(--sf-text-primary)",
  margin: "0 0 var(--sf-space-8)",
};
