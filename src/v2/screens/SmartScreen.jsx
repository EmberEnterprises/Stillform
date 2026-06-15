import React, { useEffect, useState } from "react";
import Button from "../components/Button.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import { getCurrentBeat, getBeatOverride } from "../lib/beat.js";
import { getTodayThread } from "../lib/thread.js";
import TraceUnit from "../components/TraceUnit.jsx";
import { getActivePromptAsync, getFallbackActivePrompt } from "../lib/activePrompt.js";
import { getMirrorObservation } from "../lib/mirror.js";
import { getTrajectoryStats, formatTrajectoryLine } from "../lib/trajectory.js";
import { getSessionCount } from "../lib/sessions.js";
import { maybeRunMediation, getPendingProposals } from "../lib/mediationApi.js";
import MediationQueue from "../components/MediationQueue.jsx";

/**
 * SmartScreen — the v2 home, Phase 3.
 *
 * Per the locked v2 truth, the smart screen is composed editorially with
 * multiple substantive sections that progressively activate based on the
 * user's actual practice. It replaces the prior Today.jsx (kept for
 * compatibility but no longer mounted from Home).
 *
 * Section composition (top → bottom):
 *
 *   1. Mirror strip
 *        AI observation about the user's named patterns. Reflects what
 *        the USER produced through practice — not what AI thinks about
 *        their life (User-AI relationship principle A).
 *        Renders when getMirrorObservation() returns a cached entry.
 *        Hidden otherwise — never faked (Self Mode as architecture,
 *        principle B).
 *        Phase 3 ship state: always hidden today (Phase 5 / AI
 *        Mediation pipeline writes here).
 *
 *   2. Thread
 *        The accumulating named work from today. Compounding visible
 *        on home — the day's vocabulary growing line by line.
 *        Hidden during wind-down (canon §10, no review near sleep).
 *        Hidden when empty.
 *
 *   3. Active prompt
 *        Always renders (except wind-down has a minimal variant with
 *        no action). AI-generated when possible, confidant-voice
 *        static fallback when AI unavailable. Per locked principle B,
 *        the fallback path is the day-one experience; AI generation
 *        slots in later without changing this component.
 *
 *   4. Trajectory
 *        Quiet stats line. Mechanical (no AI). Renders only at
 *        ≥3 sessions to avoid carrying false signal for new users.
 *        Hidden during wind-down per canon §10.
 *
 * Per locked v2 sharpening:
 *   - Home rule: multiple substantive sections composed editorially OK;
 *     never surface-level widgets. Each section here carries practice
 *     weight; nothing is a widget filling space.
 *   - Achievement credits: quiet observation, never gamified pep.
 *
 * Debug: ?beat=morning|main|eod|wind-down forces a phase AND fills the
 * thread with a fully-lived day's mock data (existing thread.js
 * behavior preserved). The Mirror + Trajectory sections do not get
 * mock data — they reflect real cache + real session storage even in
 * audit mode, so audit reads honestly.
 *
 * @param {function(): void} onBeginSession — opens the spine.
 */
export default function SmartScreen({ onBeginSession, onOpenRoadmap = null }) {
  const [beat, setBeat] = useState(() => getBeatOverride() || getCurrentBeat());
  const [thread, setThread] = useState(() => getTodayThread(beat));
  const [sessionCount, setSessionCount] = useState(() => getSessionCount());
  const [mirror, setMirror] = useState(() => getMirrorObservation());
  const [showQueue, setShowQueue] = useState(false);
  const [trajectory, setTrajectory] = useState(() => getTrajectoryStats());

  // Active prompt starts with the synchronous fallback so the surface
  // renders immediately. The async AI fetch then resolves and (when AI
  // is available) replaces the fallback. Self Mode fallback architecture
  // in practice: the user never waits for AI to render the screen.
  const [activePrompt, setActivePrompt] = useState(() =>
    getFallbackActivePrompt(beat, thread.length)
  );

  // Re-read on tab focus so the home stays current when the user
  // returns from another tab or completes a session.
  // Concierge gate (CONCIERGE_CLUSTER_SPEC v1.0): evaluate Arlin's three
  // cadences at the single home-mount gate. Fire-and-forget — failure
  // leaves the Mirror and queue unchanged; the practice never blocks.
  useEffect(() => {
    maybeRunMediation();
  }, []);

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      const nextBeat = getBeatOverride() || getCurrentBeat();
      setBeat(nextBeat);
      const nextThread = getTodayThread(nextBeat);
      setThread(nextThread);
      setSessionCount(getSessionCount());
      setMirror(getMirrorObservation());
      setTrajectory(getTrajectoryStats());
      setActivePrompt(getFallbackActivePrompt(nextBeat, nextThread.length));
    };
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, []);

  // Try the AI prompt path. If it succeeds, update the prompt. If it
  // fails (which it does today — endpoint doesn't exist yet), the
  // fallback already in state stays. The user sees a working surface
  // either way.
  useEffect(() => {
    let cancelled = false;
    getActivePromptAsync({ beat, threadLength: thread.length, sessionCount })
      .then((next) => {
        if (cancelled) return;
        // Only swap if AI returned something different from the
        // fallback we're already showing (avoid unnecessary re-render).
        if (next && next.source !== "fallback") setActivePrompt(next);
      })
      .catch(() => { /* fallback already in state */ });
    return () => { cancelled = true; };
  }, [beat, thread.length, sessionCount]);

  const isWindDown = beat === "wind-down";
  const showThread = !isWindDown && thread.length > 0;
  const showMirror = !isWindDown && !!mirror;
  const showTrajectory = !isWindDown && !!trajectory;

  const handleBegin = () => {
    if (typeof onBeginSession === "function") onBeginSession();
  };

  return (
    <main className="sf-page sf-page--hero">
      <article className="sf-fade-enter" style={{ width: "100%" }}>

        {/* Card label */}
        <header style={{ marginBottom: "var(--sf-space-32)" }}>
          <MonoLabel
            size="xs"
            infoTitle="Today"
            infoBody="The home reflects your practice as it accumulates. Each rep adds a precise name to your library. Over weeks the library compounds into sharper differentiation, better strategic moves, expanded cognitive flexibility. Hoemann 2021 (granular naming improves emotion differentiation), Barrett 2017 (constructed emotion theory), Wells 2009 (metacognitive capacity)."
          >Today</MonoLabel>
        </header>

        {/* Trace — D2: today's entries on the day's continuous line.
            Renders only when real entries exist (no fabricated lines). */}
        {showThread ? <TraceUnit entries={thread} /> : null}

        {/* Mirror strip — AI observation about user's named patterns.
            Renders only when cached observation exists; hidden otherwise.
            D2: the observation is set as MARGINALIA — the concierge's own
            hand (Caveat, brass). The voice annotates; it never interrupts. */}
        {showMirror ? (
          <section
            className="sf-fade-enter sf-fade-enter--delay-1"
            style={{ marginBottom: "var(--sf-space-32)", cursor: "pointer" }}
            aria-label="Pattern reflection — tap for proposed updates"
            role="button"
            tabIndex={0}
            onClick={() => setShowQueue(true)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setShowQueue(true); }}
          >
            <MonoLabel
              size="xs"
              tone="faint"
              style={{ display: "block", marginBottom: "var(--sf-space-12)" }}
            >
              Pattern noticed
            </MonoLabel>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--sf-font-annotation)",
                fontSize: "21px",
                lineHeight: 1.35,
                fontWeight: 400,
                color: "var(--sf-accent)",
                transform: "rotate(-1.2deg)",
                transformOrigin: "left top",
              }}
            >
              {"— "}{mirror.observation}
            </p>
            {getPendingProposals().length > 0 ? (
              <MonoLabel size="xs" tone="faint" style={{ display: "block", marginTop: "var(--sf-space-12)" }}>
                Tap — proposed updates waiting
              </MonoLabel>
            ) : null}
            <div
              className="sf-thread-divider"
              aria-hidden="true"
              style={{ marginTop: "var(--sf-space-24)" }}
            />
          </section>
        ) : null}

        {showQueue ? (
          <MediationQueue onClose={() => setShowQueue(false)} />
        ) : null}

        {/* Thread — today's accumulating named work. */}
        {showThread ? (
          <section
            className="sf-fade-enter sf-fade-enter--delay-1"
            style={{ marginBottom: "var(--sf-space-32)" }}
            aria-label="Today's thread"
          >
            {thread.map((entry, i) => (
              <ThreadLine key={i} time={entry.time} text={entry.text} />
            ))}
            <div className="sf-thread-divider" aria-hidden="true" />
          </section>
        ) : null}

        {/* Active prompt — observation + invitation, AI-generated with
            confidant-voice fallback. Always renders. */}
        <section
          className={
            showThread || showMirror
              ? "sf-fade-enter sf-fade-enter--delay-2"
              : "sf-fade-enter sf-fade-enter--delay-1"
          }
          aria-label="What's next"
        >
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--sf-font-serif)",
              fontSize: "var(--sf-text-display-md)",
              lineHeight: "var(--sf-leading-display)",
              fontWeight: 400,
              color: "var(--sf-text-cream)",
              letterSpacing: "-0.01em",
            }}
          >
            {activePrompt.headline}
          </h1>

          {activePrompt.body ? (
            <p
              style={{
                margin: "var(--sf-space-12) 0 0",
                fontFamily: "var(--sf-font-sans)",
                fontSize: "var(--sf-text-body-md)",
                lineHeight: "var(--sf-leading-body)",
                color: "var(--sf-text-quiet)",
                fontWeight: 300,
              }}
            >
              {activePrompt.body}
            </p>
          ) : null}

          {/* Entry into the practice ALWAYS renders — every home state must
              have an obvious way in. Per-beat label when set; a clean default
              otherwise (returning / anchor-already-set states). */}
          <div style={{ marginTop: "var(--sf-space-48)" }}>
            <Button variant="primary" onClick={handleBegin}>
              {activePrompt.actionLabel || "Open a session"}
            </Button>
          </div>
        </section>

        {/* Trajectory — quiet stats line, no AI involvement, hidden
            below threshold and during wind-down. */}
        {showTrajectory ? (
          <section
            className="sf-fade-enter sf-fade-enter--delay-2"
            style={{ marginTop: "var(--sf-space-64)", cursor: onOpenRoadmap ? "pointer" : "default" }}
            aria-label="Practice trajectory — tap for the roadmap"
            role={onOpenRoadmap ? "button" : undefined}
            tabIndex={onOpenRoadmap ? 0 : undefined}
            onClick={onOpenRoadmap || undefined}
            onKeyDown={onOpenRoadmap ? (e) => { if (e.key === "Enter" || e.key === " ") onOpenRoadmap(); } : undefined}
          >
            <div
              className="sf-thread-divider"
              aria-hidden="true"
              style={{ marginBottom: "var(--sf-space-16)" }}
            />
            <MonoLabel size="xs" tone="faint">
              {formatTrajectoryLine(trajectory)}
            </MonoLabel>
          </section>
        ) : null}
      </article>
    </main>
  );
}

/* -----------------------------------------------------------------------
 * ThreadLine — one stitch in today's thread.
 *
 * Two-column layout: monospace time on the left (44px fixed), serif
 * named precision on the right. Time gives structure; the named thing
 * carries the substance. Reads like a journal log:
 *   "7:34   tired but settled."
 *
 * Faint cream tone — accumulated content, not focal action.
 * -------------------------------------------------------------------- */
function ThreadLine({ time, text }) {
  return (
    <div className="sf-thread-line">
      <span className="sf-thread-time">{time}</span>
      <span className="sf-thread-text">{text}</span>
    </div>
  );
}
