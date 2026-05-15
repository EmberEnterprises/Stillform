import React, { useState } from "react";
import Notice from "./spine/Notice.jsx";
import Reframe from "./spine/Reframe.jsx";
import SelfReframe from "./spine/SelfReframe.jsx";
import Close from "./spine/Close.jsx";

/**
 * Spine — the universal session container.
 *
 * Per STILLFORM_CANON.md §7: "The universal session spine: Notice →
 * Reframe → Close. Every practice surface routes through this architecture."
 *
 * State machine:
 *   notice → user names what's present (free-text + optional chip)
 *   reframe → AI metacognition partner (or SelfReframe if self mode)
 *   close → takeaway display, session ends
 *
 * Self Mode: routes to SelfReframe instead of Reframe. Triggered by:
 *   1. User taps "Or self-led ›" link on Notice
 *   2. Reframe surface auto-fallback when reframe.js errors persistently
 *      (Reframe calls onSwitchToSelfMode when the user accepts the offer)
 *
 * State held in-memory only for Phase 2. Reload mid-session returns to
 * home. Session persistence to v1 storage shapes (stillform_sessions,
 * journal entries, saved reframes, EOD context, etc.) ships in Phase 2.5.
 *
 * @param {function(): void} onExit  Called when user exits or returns home.
 */
export default function Spine({ onExit }) {
  const [step, setStep] = useState("notice");
  const [precisionName, setPrecisionName] = useState("");
  const [selectedChip, setSelectedChip] = useState(null);
  const [selfMode, setSelfMode] = useState(false);
  const [takeaway, setTakeaway] = useState(null);

  const handleNoticeContinue = (text, chip, opts = {}) => {
    setPrecisionName(text);
    setSelectedChip(chip);
    if (opts.selfMode) setSelfMode(true);
    setStep("reframe");
  };

  const handleReframeContinue = ({ takeaway: t }) => {
    setTakeaway(t);
    setStep("close");
  };

  const handleSwitchToSelfMode = () => {
    setSelfMode(true);
    // Stay on "reframe" step; the conditional render below will swap
    // from Reframe to SelfReframe.
  };

  if (step === "notice") {
    return <Notice onContinue={handleNoticeContinue} onExit={onExit} />;
  }

  if (step === "reframe") {
    if (selfMode) {
      return (
        <SelfReframe
          precisionName={precisionName}
          onContinue={handleReframeContinue}
          onExit={onExit}
        />
      );
    }
    return (
      <Reframe
        precisionName={precisionName}
        selectedChip={selectedChip}
        onContinue={handleReframeContinue}
        onSwitchToSelfMode={handleSwitchToSelfMode}
        onExit={onExit}
      />
    );
  }

  // step === "close"
  return <Close takeaway={takeaway} onReturnHome={onExit} />;
}
