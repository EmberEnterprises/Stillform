import React, { useState } from "react";
import Notice from "./spine/Notice.jsx";
import Reframe from "./spine/Reframe.jsx";
import SelfReframe from "./spine/SelfReframe.jsx";
import Close from "./spine/Close.jsx";
import { saveSession } from "../lib/sessions.js";
import { appendTodayEntry } from "../lib/thread.js";
import { getCurrentBeat, getBeatOverride } from "../lib/beat.js";
import { routeMode } from "../lib/reframeApi.js";

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
 * Phase 3 session persistence: on transition from reframe → close, the
 * full session writes to stillform_v2_sessions (via sessions.js) AND
 * the named precision appends to today's thread (via thread.js). The
 * persistence path has no AI dependency — sessions are written from
 * local Spine state, so they persist even when AI is unavailable
 * (per locked Self Mode as architecture principle).
 *
 * @param {function(): void} onExit  Called when user exits or returns home.
 */
export default function Spine({ onExit }) {
  const [step, setStep] = useState("notice");
  const [precisionName, setPrecisionName] = useState("");
  const [selectedChip, setSelectedChip] = useState(null);
  const [selfMode, setSelfMode] = useState(false);
  const [takeaway, setTakeaway] = useState(null);
  const [conversationLength, setConversationLength] = useState(0);

  const handleNoticeContinue = (text, chip, opts = {}) => {
    setPrecisionName(text);
    setSelectedChip(chip);
    if (opts.selfMode) setSelfMode(true);
    setStep("reframe");
  };

  const handleReframeContinue = ({ takeaway: t, history }) => {
    setTakeaway(t);
    const turnCount = Array.isArray(history) ? history.length : 0;
    setConversationLength(turnCount);

    // Persist the completed session. Failure is silent — the user's
    // close-the-rep moment isn't interrupted by storage issues.
    const beat = getBeatOverride() || getCurrentBeat();
    const mode = selfMode ? "self" : routeMode(selectedChip, precisionName);

    saveSession({
      precisionName,
      selectedChip,
      takeaway: t,
      mode,
      selfMode,
      conversationLength: turnCount,
      beat,
    });

    // Append to today's thread so the home reflects the named work
    // immediately on return. Thread is the visible-on-home compounding;
    // the session record is the deeper data layer behind it.
    const threadSource = beat === "eod" ? "eod" : (beat === "morning" ? "morning" : "main");
    if (precisionName && precisionName.trim()) {
      appendTodayEntry({ text: precisionName.trim(), source: threadSource });
    }

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
