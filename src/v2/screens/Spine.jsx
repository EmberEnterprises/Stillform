import React, { useState } from "react";
import Notice from "./spine/Notice.jsx";
import Reframe from "./spine/Reframe.jsx";
import Close from "./spine/Close.jsx";

/**
 * Spine — the universal session container.
 *
 * Per STILLFORM_CANON.md §7: "The universal session spine: Notice →
 * Reframe → Close. Every practice surface routes through this architecture."
 *
 * State machine:
 *   notice  → user names what's present (free-text + optional chip)
 *   reframe → AI metacognition partner; multi-turn
 *   close   → takeaway display, session ends
 *
 * State held in-memory only for Phase 2. Reload mid-session returns to
 * home. Session persistence to v1 storage shapes (stillform_sessions,
 * journal entries, saved reframes, EOD context, etc.) ships in Phase 2.5
 * once the data shape integration is verified end-to-end.
 *
 * @param {function(): void} onExit  Called when user exits or returns home.
 */
export default function Spine({ onExit }) {
  const [step, setStep] = useState("notice");
  const [precisionName, setPrecisionName] = useState("");
  const [selectedChip, setSelectedChip] = useState(null);
  const [takeaway, setTakeaway] = useState(null);

  const handleNoticeContinue = (text, chip) => {
    setPrecisionName(text);
    setSelectedChip(chip);
    setStep("reframe");
  };

  const handleReframeContinue = ({ takeaway: t }) => {
    setTakeaway(t);
    setStep("close");
  };

  if (step === "notice") {
    return <Notice onContinue={handleNoticeContinue} onExit={onExit} />;
  }

  if (step === "reframe") {
    return (
      <Reframe
        precisionName={precisionName}
        selectedChip={selectedChip}
        onContinue={handleReframeContinue}
        onExit={onExit}
      />
    );
  }

  // step === "close"
  return <Close takeaway={takeaway} onReturnHome={onExit} />;
}
