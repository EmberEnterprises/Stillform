import React, { useState } from "react";
import { LESSONS, getLesson } from "../lib/learningTrack.js";
import { getNextLessonNudge, dismissLessonNudge } from "../lib/trackProgress.js";

/**
 * LearnNudge — the Track's one earned home nudge (concierge, corrected
 * 2026-07-08: proactive-when-earned, never naggy).
 *
 * Self-gating: renders nothing unless getNextLessonNudge() has something
 * honest to offer — the user has engaged with the Track AND a concrete next
 * lesson exists AND no fresh dismissal is standing. "Not now" is remembered
 * (quiet window); a new practice reopens the conversation deterministically.
 *
 * Quiet by design: a single hairline row in the daily-context zone, mono
 * label + serif lesson name, brass arrow. Never a modal, never a badge.
 *
 * @param {function(): void} onOpenLearn — routes to the Library's Learn tab
 */
export default function LearnNudge({ onOpenLearn }) {
  const [nudge, setNudge] = useState(() => {
    try {
      return getNextLessonNudge(LESSONS);
    } catch {
      return null;
    }
  });

  if (!nudge || typeof onOpenLearn !== "function") return null;
  const lesson = getLesson(nudge.id);
  if (!lesson) return null;

  const dismiss = () => {
    try { dismissLessonNudge(); } catch { /* fail-silent */ }
    setNudge(null);
  };

  return (
    <section className="sf-sec" aria-label="Next lesson ready">
      <button
        type="button"
        className="sf-sec-row"
        aria-label={`Next lesson ready: ${lesson.title}`}
        onClick={onOpenLearn}
      >
        <span className="sf-sec-mark" aria-hidden="true">{"\u25c9"}</span>
        <span className="sf-sec-row-main">
          <span className="sf-sec-row-top">
            <span className="sf-sec-name">{lesson.title}</span>
            <span className="sf-sec-meta">next lesson</span>
          </span>
          <span className="sf-sec-sub">Ready when you are — pick it up in the Library.</span>
        </span>
        <span className="sf-sec-arrow" aria-hidden="true">→</span>
      </button>
      <button
        type="button"
        className="sf-link-quiet"
        onClick={dismiss}
        aria-label="Not now"
        style={{ marginTop: "4px" }}
      >
        not now
      </button>
    </section>
  );
}
