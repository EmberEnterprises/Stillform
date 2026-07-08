import React, { useState } from "react";
import { getPref } from "../lib/userPrefs.js";
import {
  getDecompressionCandidate,
  dismissDecompression,
} from "../lib/eodDecompression.js";

/**
 * EodDecompressCard — the evening half of the calendar loop (FULL BUILD
 * item 6; spec §2.1: decompression candidates in the EOD review window).
 *
 * Renders ONLY when the parent passes active=true (the eod beat — canon §10
 * keeps heavy review away from wind-down/sleep; the caller gates the beat).
 * One candidate — the day's heaviest ended event, trigger-matched first —
 * offered as a question. "Set it down" hands into the practice (the same
 * Notice → Reframe → Close work, aimed at the day's residue). "It can rest"
 * dismisses day-keyed.
 *
 * Deterministic + earned: everything comes from the user's own consented
 * calendar and their own Trigger Profile (eodDecompression.js). Honest-empty.
 *
 * @param {boolean} active — the caller's beat gate (eod window only)
 * @param {function(): void} onEnterPractice — the set-it-down route
 */
export default function EodDecompressCard({ active = false, onEnterPractice }) {
  // Item 9 depth: this voice is individually silenceable (concierge.eveningDecompression).
  try { if (getPref("concierge.eveningDecompression") === false) return null; } catch { /* default: on */ }
  const [candidate, setCandidate] = useState(() => {
    if (!active) return null;
    try { return getDecompressionCandidate(); } catch { return null; }
  });

  if (!active || !candidate) return null;

  const setDown = () => {
    try { dismissDecompression(); } catch { /* fail-silent */ }
    setCandidate(null);
    if (typeof onEnterPractice === "function") onEnterPractice();
  };
  const rest = () => {
    try { dismissDecompression(); } catch { /* fail-silent */ }
    setCandidate(null);
  };

  return (
    <section className="sf-sec" aria-label="Before the day closes">
      <div className="sf-sec-head">
        <span className="sf-sec-head-lbl">Before the day closes</span>
        <div className="sf-sec-rule" />
      </div>
      <p style={LINE}>{candidate.line}</p>
      <div style={{ display: "flex", gap: "var(--sf-space-12)", marginTop: "var(--sf-space-8)" }}>
        <button type="button" className="sf-link-quiet" onClick={setDown}>
          set it down
        </button>
        <button type="button" className="sf-link-quiet" onClick={rest}>
          it can rest
        </button>
      </div>
    </section>
  );
}

const LINE = {
  fontFamily: "var(--sf-font-serif)",
  fontWeight: 300,
  fontSize: "15px",
  lineHeight: 1.65,
  color: "var(--sf-text-primary)",
  margin: "0 0 var(--sf-space-8)",
};
