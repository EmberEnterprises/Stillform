import React, { useState, useEffect, useRef } from "react";
import Notice from "./spine/Notice.jsx";
import Reframe from "./spine/Reframe.jsx";
import SelfReframe from "./spine/SelfReframe.jsx";
import Close from "./spine/Close.jsx";
import MoveCard from "./spine/MoveCard.jsx";
import Reset from "./spine/Reset.jsx";
import Scripts from "./spine/Scripts.jsx";
import WindDown from "./spine/WindDown.jsx";
import { saveSession } from "../lib/sessions.js";
import { recordSignal } from "../lib/signalLog.js";
import { appendTodayEntry, getTodayThread } from "../lib/thread.js";
import { deriveThreadName } from "../lib/threadEntry.js";
import { getCurrentBeat, getBeatOverride, localDateKey } from "../lib/beat.js";
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
export default function Spine({ onExit, forcedBeat = null, initialText = null, isBaseEntry = false, entryPayload = null }) {
  // Phase 4 #2 (locked May 16, 2026): beat is locked at session mount.
  // A session belongs to the beat it started in, even if it crosses a
  // beat boundary mid-flow (e.g., user starts at 8:59pm in main beat and
  // finishes at 9:01pm in wind-down — stays a main-beat session).
  // Lazy useState init guarantees one read at mount, never per-render.
  // Phase 6.4c: a one-shot forcedBeat (manual launch — e.g. post-event from
  // My Progress) wins; then the ?beat= debug override; then the time-router.
  // AppV2 clears forcedBeat on exit, so it never makes a normal session sticky.
  const [beat] = useState(() => forcedBeat || getBeatOverride() || getCurrentBeat());
  // Resolve the variant config once from the locked beat. Pure object,
  // no per-render cost; passed to spine surfaces (Notice now; Reframe /
  // Close in later #6–#7 steps).
  const config = getBeatConfig(beat);

  // Phase 4 #4 (May 16, 2026): for beats that opt in via config.reframe
  // .contextExtras.includeTodayThread (EOD currently), read today's
  // thread once at session mount and pass to Reframe. The thread is
  // what the user named earlier today; EOD uses it to help distill
  // what landed. Locked at mount so the AI sees a stable snapshot of
  // "the day before this close" — entries added during this session
  // shouldn't recursively show up in the same session's context.
  const [todayThread] = useState(() => {
    const includeThread = config?.reframe?.contextExtras?.includeTodayThread === true;
    if (!includeThread) return null;
    try {
      return getTodayThread(beat);
    } catch {
      return null;
    }
  });

  const [step, setStep] = useState("notice");
  const entryPayloadConsumed = useRef(false);
  const [precisionName, setPrecisionName] = useState("");
  const [selectedChip, setSelectedChip] = useState(null);
  const [selfMode, setSelfMode] = useState(false);
  // surfacedFrame = the frame from Reframe (AI's last reply OR SelfReframe's
  // last user answer). Passed to Close where the user can anchor on it,
  // edit it, or write something entirely their own. Not the user's takeaway.
  const [surfacedFrame, setSurfacedFrame] = useState(null);
  // Phase 6.5c: the seed (a takeaway/frame string) handed to the Scripts
  // surface when the user takes the "Need the words for it?" ride-out at Close.
  const [scriptSeed, setScriptSeed] = useState(null);
  const [conversationLength, setConversationLength] = useState(0);

  const handleNoticeContinue = (text, chip, opts = {}) => {
    setPrecisionName(text);
    setSelectedChip(chip);
    // Quick-move fork (Phase 6.2c): a body-first reset before the spine.
    // Carry text/chip so "Keep going" can resume; route to the move step.
    if (opts.quickMove) {
      setStep("move");
      return;
    }
    // Reset fork (Phase 6.3b): urge-surf for an acute compulsion pull.
    if (opts.reset) {
      setStep("reset");
      return;
    }
    if (opts.selfMode) setSelfMode(true);
    setStep("reframe");
  };

  // Home now owns the naming step. When the user commits a naming on the
  // home practice surface, AppV2 launches the spine with that payload; we
  // replay it once here so the spine lands at Reframe (or move/reset/self)
  // without re-asking the user to name what they already named.
  useEffect(() => {
    if (entryPayload && !entryPayloadConsumed.current) {
      entryPayloadConsumed.current = true;
      handleNoticeContinue(entryPayload.text || "", entryPayload.chip || null, entryPayload.opts || {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const handleCloseReturn = (closePayload) => {
    // PCE.1: Close now returns { takeaway, nextMove, lockIn }. Tolerate a
    // bare string for safety (any older/edge caller) so persistence never
    // breaks on shape.
    const payload =
      closePayload && typeof closePayload === "object"
        ? closePayload
        : { takeaway: closePayload, nextMove: null, lockIn: null };

    // Phase 4 #2: use the beat locked at mount (not re-read fresh here),
    // so the session record matches the variant the user actually
    // experienced if they crossed a beat boundary mid-flow.
    const mode = selfMode ? "self" : routeMode(selectedChip, precisionName);

    // The session is now committed. takeaway = USER's named takeaway;
    // surfacedFrame = what was surfaced during reframe (preserved for
    // downstream Mirror / Library / Pattern Disruption surfaces);
    // nextMove + lockIn = PCE.1 forward frame (fuel for PCE.2 reconsolidation).
    saveSession({
      precisionName,
      selectedChip,
      takeaway: payload.takeaway,
      nextMove: payload.nextMove,
      lockIn: payload.lockIn,
      surfacedFrame,
      mode,
      selfMode,
      conversationLength,
      beat,
    });

    // KEYSTONE step 0 (signal log): stop discarding the discrete feel-state
    // chip this session — record it as a per-occurrence token for the
    // deterministic discovery engine. selectedChip is always a discrete chip
    // id (or null); free text never lands here. triggers:[] for now — no
    // per-session trigger token source exists yet (incrementTriggerEncounter
    // is defined but never called); capturing that is the readdress item that
    // unlocks trigger↔feel patterns. Fail-silent; drops empty signals.
    recordSignal({ chip: selectedChip, triggers: [], beat, mode });

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

    // Phase 4 #3 (May 16, 2026): write the per-beat completion flag so
    // the beat router (getCurrentBeat) advances to the next beat on
    // subsequent loads. Schema is { date: "YYYY-MM-DD", ... }
    // — so readers (stillform_checkin_today, stillform_eod_today,
    // stillform_winddown_today) recognize v2-completed beats. The
    // selectedChip is carried as a lightweight "mood" hint; remaining
    // Legacy fields (energy / bio / tension / etc.) are null because the
    // v2 spine doesn't ask those questions — Notice + chip is the
    // entire morning check-in surface in v2.
    if (config.completionFlag) {
      try {
        const payload = {
          date: localDateKey(),
          mood: selectedChip || null,
          precision: precisionName || null,
          source: "v2-spine",
          beat,
        };
        localStorage.setItem(config.completionFlag, JSON.stringify(payload));
      } catch {
        /* localStorage write failure is non-fatal — session is still saved */
      }
    }

    // Phase 4 #3 (May 16, 2026): Plausible event for beat completion
    // telemetry. Props mirror the session record so we can correlate
    // beats with mode / selfMode / conversation depth.
    try {
      window.plausible?.("Beat Completed", {
        props: {
          beat,
          mode,
          self_mode: selfMode ? "yes" : "no",
          conversation_length: conversationLength,
        }
      });
    } catch {
      /* analytics failure is non-fatal */
    }

    onExit();
  };

  const handleSwitchToSelfMode = () => {
    setSelfMode(true);
    // Stay on "reframe" step; the conditional render below will swap
    // from Reframe to SelfReframe.
  };

  // Phase 4 #5 (May 16, 2026): wind-down handler. Wind-down bypasses
  // the Notice → Reframe → Close spine entirely — it has its own
  // minimal flow (tomorrow-anchor → Deep Regulate → close) in
  // WindDown.jsx. Persistence pattern matches Phase 3.5 #2: nothing
  // saves until the user reaches close. WindDown invokes
  // onReturnHome with the captured payload; this handler persists
  // (a) the tomorrow anchor for next morning's concierge surface,
  // (b) the completion flag via config.completionFlag, (c) a
  // minimal session record so wind-down completions show up in
  // session history, and (d) Plausible telemetry.
  const handleWindDownReturn = (payload) => {
    const anchorTrimmed = (payload && typeof payload.anchorText === "string")
      ? payload.anchorText.trim()
      : "";

    // (a) Tomorrow anchor — surfaces next morning per the concierge
    // architecture (Pillar 3 — "things easier than they should be").
    if (anchorTrimmed) {
      try {
        localStorage.setItem("stillform_tomorrow_anchor", JSON.stringify({
          date: localDateKey(),
          anchor: anchorTrimmed,
          source: "v2-spine",
        }));
      } catch { /* non-fatal */ }
    }

    // (b) Completion flag via config (stillform_winddown_today).
    if (config.completionFlag) {
      try {
        localStorage.setItem(config.completionFlag, JSON.stringify({
          date: localDateKey(),
          anchor: anchorTrimmed || null,
          breathingResult: payload?.breathingResult || null,
          source: "v2-spine",
          beat,
        }));
      } catch { /* non-fatal */ }
    }

    // (c) Session record for history / future pattern detection.
    // precisionName = tomorrow anchor, mode = self (no AI involved),
    // selfMode = true. surfacedFrame + takeaway are null because the
    // wind-down flow doesn't have those steps.
    saveSession({
      precisionName: anchorTrimmed,
      selectedChip: null,
      takeaway: null,
      surfacedFrame: null,
      mode: "self",
      selfMode: true,
      conversationLength: 0,
      beat,
    });

    // (d) Plausible telemetry — Beat Completed (parallel to the
    // Reframe-spine path) plus Tomorrow Anchor Set with a hasAnchor
    // prop for downstream correlation.
    try {
      window.plausible?.("Beat Completed", {
        props: {
          beat,
          mode: "self",
          self_mode: "yes",
          conversation_length: 0,
        }
      });
      window.plausible?.("Tomorrow Anchor Set", {
        props: {
          beat,
          has_anchor: anchorTrimmed ? "yes" : "no",
          anchor_length: anchorTrimmed.length,
          breathing_status: payload?.breathingResult?.status || "none",
        }
      });
    } catch { /* non-fatal */ }

    onExit();
  };

  // Phase 4 #5: route wind-down to its dedicated screen BEFORE the
  // standard spine. Wind-down doesn't use Notice / Reframe / Close.
  if (beat === "wind-down") {
    return <WindDown onReturnHome={handleWindDownReturn} />;
  }

  // Phase 6.2c: quick-move step. The reset runs, then MoveCard offers the
  // handoff — "Keep going" lands in Reframe if they had already named
  // something, else back to Notice to name it first (body-first → cognitive);
  // "Done for now" exits.
  if (step === "move") {
    return (
      <MoveCard
        chip={selectedChip}
        onKeepGoing={() => setStep(precisionName && precisionName.trim() ? "reframe" : "notice")}
        onDone={onExit}
      />
    );
  }

  // Phase 6.3b: reset step — urge-surf. Name → watch → act-or-don't (neutral,
  // never scored). onDoMove cross-routes to the Move card; both exits leave.
  if (step === "reset") {
    return (
      <Reset
        onDone={onExit}
        onExit={onExit}
        onDoMove={() => setStep("move")}
      />
    );
  }

  if (step === "notice") {
    // Phase 4 #2: pass the variant config down. Notice resolves its
    // headline / body / placeholder / chips from config.notice, falling
    // back to main-beat defaults if config is absent (it isn't, but the
    // component is defensive).
    return <Notice config={config} onContinue={handleNoticeContinue} onExit={onExit} initialText={initialText} isBase={isBaseEntry} />;
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
        beat={beat}
        todayThread={todayThread}
        precisionName={precisionName}
        selectedChip={selectedChip}
        onContinue={handleReframeContinue}
        onSwitchToSelfMode={handleSwitchToSelfMode}
        onExit={onExit}
      />
    );
  }

  if (step === "scripts") {
    return (
      <Scripts
        seed={scriptSeed}
        onDone={onExit}
        onExit={onExit}
      />
    );
  }

  // step === "close"
  return (
    <Close
      surfacedFrame={surfacedFrame}
      breathingOffer={config?.close?.breathingOffer || null}
      beat={beat}
      onReturnHome={handleCloseReturn}
      onWantScript={(seed) => {
        setScriptSeed(seed);
        setStep("scripts");
      }}
    />
  );
}
