import React, { useState } from "react";
import Notice from "./spine/Notice.jsx";
import Reframe from "./spine/Reframe.jsx";
import SelfReframe from "./spine/SelfReframe.jsx";
import Close from "./spine/Close.jsx";
import { saveSession } from "../lib/sessions.js";
import { appendTodayEntry } from "../lib/thread.js";
import { deriveThreadName } from "../lib/threadEntry.js";
import { getCurrentBeat, getBeatOverride } from "../lib/beat.js";
import { getBeatConfig } from "../lib/beatConfig.js";
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
 *   close → user names what landed; session persists ON RETURN HOME, not before
 *
 * Self Mode: routes to SelfReframe instead of Reframe. Triggered by:
 *   1. User taps "Or self-led ›" link on Notice
 *   2. Reframe surface auto-fallback when reframe.js errors persistently
 *      (Reframe calls onSwitchToSelfMode when the user accepts the offer)
 *
 * Phase 3 session persistence: completed session writes to
 * stillform_v2_sessions (via sessions.js) AND the named precision appends
 * to today's thread (via thread.js). The persistence path has no AI
 * dependency — sessions are written from local Spine state, so they
 * persist even when AI is unavailable (per locked Self Mode as
 * architecture principle).
 *
 * Phase 3.5 #2 (locked May 16, 2026): persistence moved from the
 * reframe→close transition to the close→home transition. The session
 * doesn't count until the user names what landed in Close. If the user
 * abandons before Close completes, nothing persists — quitting is not
 * a session. This enforces the user-led principle architecturally:
 * the AI's frame alone doesn't compound; only the user's named takeaway
 * does. See CANON §7.1.
 *
 * @param {function(): void} onExit  Called when user exits or returns home.
 */
export default function Spine({ onExit }) {
  // Phase 4 #2 (locked May 16, 2026): beat is locked at session mount.
  // A session belongs to the beat it started in, even if it crosses a
  // beat boundary mid-flow (e.g., user starts at 8:59pm in main beat and
  // finishes at 9:01pm in wind-down — stays a main-beat session).
  // Lazy useState init guarantees one read at mount, never per-render.
  const [beat] = useState(() => getBeatOverride() || getCurrentBeat());
  // Resolve the variant config once from the locked beat. Pure object,
  // no per-render cost; passed to spine surfaces (Notice now; Reframe /
  // Close in later #6–#7 steps).
  const config = getBeatConfig(beat);

  const [step, setStep] = useState("notice");
  const [precisionName, setPrecisionName] = useState("");
  const [selectedChip, setSelectedChip] = useState(null);
  const [selfMode, setSelfMode] = useState(false);
  // surfacedFrame = the frame from Reframe (AI's last reply OR SelfReframe's
  // last user answer). Passed to Close where the user can anchor on it,
  // edit it, or write something entirely their own. Not the user's takeaway.
  const [surfacedFrame, setSurfacedFrame] = useState(null);
  const [conversationLength, setConversationLength] = useState(0);

  const handleNoticeContinue = (text, chip, opts = {}) => {
    setPrecisionName(text);
    setSelectedChip(chip);
    if (opts.selfMode) setSelfMode(true);
    setStep("reframe");
  };

  // Phase 3.5 #2: ReframeContinue no longer persists. It only captures
  // the surfaced frame and conversation length, then transitions to Close.
  // The save happens in handleCloseReturn after the user names their own
  // takeaway.
  const handleReframeContinue = ({ takeaway: t, history }) => {
    setSurfacedFrame(t);
    const turnCount = Array.isArray(history) ? history.length : 0;
    setConversationLength(turnCount);
    setStep("close");
  };

  // Phase 3.5 #2: persistence point. Called when the user has named what
  // landed in Close and tapped Return home. Persists session + thread,
  // then exits the spine.
  const handleCloseReturn = (userTakeaway) => {
    // Phase 4 #2: use the beat locked at mount (not re-read fresh here),
    // so the session record matches the variant the user actually
    // experienced if they crossed a beat boundary mid-flow.
    const mode = selfMode ? "self" : routeMode(selectedChip, precisionName);

    // The session is now committed. takeaway = USER's named takeaway;
    // surfacedFrame = what was surfaced during reframe (preserved for
    // downstream Mirror / Library / Pattern Disruption surfaces).
    saveSession({
      precisionName,
      selectedChip,
      takeaway: userTakeaway,
      surfacedFrame,
      mode,
      selfMode,
      conversationLength,
      beat,
    });

    // Append to today's thread so the home reflects the named work
    // immediately on return. Thread is the visible-on-home compounding;
    // the session record is the deeper data layer behind it.
    //
    // Phase 3.5 #1: deriveThreadName() shortens long free-typed input.
    const threadSource = beat === "eod" ? "eod" : (beat === "morning" ? "morning" : "main");
    const threadText = deriveThreadName(precisionName, selectedChip);
    if (threadText) {
      appendTodayEntry({ text: threadText, source: threadSource });
    }

    onExit();
  };

  const handleSwitchToSelfMode = () => {
    setSelfMode(true);
    // Stay on "reframe" step; the conditional render below will swap
    // from Reframe to SelfReframe.
  };

  if (step === "notice") {
    // Phase 4 #2: pass the variant config down. Notice resolves its
    // headline / body / placeholder / chips from config.notice, falling
    // back to main-beat defaults if config is absent (it isn't, but the
    // component is defensive).
    return <Notice config={config} onContinue={handleNoticeContinue} onExit={onExit} />;
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
  return <Close surfacedFrame={surfacedFrame} onReturnHome={handleCloseReturn} />;
}
