import React, { useEffect, useState } from "react";
import Button from "../components/Button.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import { getCurrentBeat, getBeatOverride } from "../lib/beat.js";
import { getTodayThread, getActivePrompt } from "../lib/thread.js";

/**
 * Today — the ONE unified beat on home.
 *
 * Locked May 15, 2026 evening after multiple rebuilds. Replaces the four-
 * mutually-exclusive-beats architecture (morning / main / eod / wind-down
 * as separate surfaces that swap) with ONE editorial card called "Today"
 * that the user writes through the day:
 *
 *   - The card holds a THREAD of precise names built so far today,
 *     line by line, faint cream serif. The day's vocabulary
 *     accumulating in plain sight.
 *
 *   - Below the thread (separated by a hairline when the thread isn't
 *     empty) sits ONE ACTIVE PROMPT — the next thing to do. Headline +
 *     body + Begin button.
 *
 *   - Everything routes through the same Notice → Reframe → Close spine
 *     behind Begin. The spine adapts to time-of-day context internally.
 *     The user sees ONE door all day; the day behind the door changes.
 *
 * Why this architecture (per Arlin May 15 directive):
 *   "I wanted a unified beat. I wanted all of it wrapped up into one."
 *
 * The thread + active prompt are sections WITHIN one card, separated by
 * a hairline. Not competing widgets. Not stacked panels. One composed
 * editorial view that evolves through the day.
 *
 * Why this serves the practice:
 *   Compounding visible ON the home — most apps hide it behind a stats
 *   tab. Here the day's named vocabulary accumulates in plain sight.
 *   Line 1 leads to line 2 leads to line 3. The proof the practice is
 *   working is the home itself.
 *
 * Wind-down behavior: thread is HIDDEN during wind-down per canon §10
 * (no review content within ~2h of sleep — Walker, Stickgold). The user
 * opens the app, sees only "Phone down." and closes it. No content to
 * ruminate on near sleep.
 *
 * Debug: ?beat=morning|main|eod|wind-down forces a phase AND fills the
 * thread with a fully-lived day's mock data for that phase, so every
 * state is auditable on a phone without waiting for time to pass.
 *
 * @param {function(): void} onBeginSession — opens the spine.
 */
export default function Today({ onBeginSession }) {
  const [beat, setBeat] = useState(() => getBeatOverride() || getCurrentBeat());
  const [thread, setThread] = useState(() => getTodayThread(beat));

  // Re-detect phase + re-read thread when the tab regains visibility.
  // The thread can grow during the day (each completed session appends
  // a line), so re-reading on visibilitychange keeps the home in sync
  // when the user returns from another tab.
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      const nextBeat = getBeatOverride() || getCurrentBeat();
      setBeat(nextBeat);
      setThread(getTodayThread(nextBeat));
    };
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, []);

  const prompt = getActivePrompt(beat, thread.length);
  const showThread = beat !== "wind-down" && thread.length > 0;

  const handleBegin = () => {
    if (typeof onBeginSession === "function") onBeginSession();
  };

  return (
    <main className="sf-page sf-page--hero">
      <article
        className="sf-fade-enter"
        style={{ width: "100%" }}
      >
        {/* Card label — the editorial title of the surface. */}
        <header style={{ marginBottom: "var(--sf-space-32)" }}>
          <MonoLabel
            size="xs"
            infoTitle="Today"
            infoBody="Each rep adds a precise name to your library. The thread above is today's named work — accumulating evidence the practice is building your cognitive vocabulary. Over weeks the library compounds into sharper differentiation, better strategic moves, expanded cognitive flexibility. Hoemann 2021 (granular naming improves emotion differentiation), Barrett 2017 (constructed emotion theory), Wells 2009 (metacognitive capacity)."
          >Today</MonoLabel>
        </header>

        {/* Thread — the day's accumulating named vocabulary. Hidden when
            empty (morning fresh open) or during wind-down (no review). */}
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

        {/* Active prompt — ONE thing to do next. Headline + body + Begin. */}
        <section
          className={
            showThread
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
            {prompt.headline}
          </h1>

          {prompt.body ? (
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
              {prompt.body}
            </p>
          ) : null}

          {prompt.actionLabel ? (
            <div style={{ marginTop: "var(--sf-space-48)" }}>
              <Button variant="primary" onClick={handleBegin}>
                {prompt.actionLabel}
              </Button>
            </div>
          ) : null}
        </section>
      </article>
    </main>
  );
}

/* -----------------------------------------------------------------------
 * ThreadLine — one stitch in today's thread.
 *
 * Two-column layout: monospace time on the left (44px fixed), serif
 * named precision on the right (flex). The time gives structure; the
 * named thing carries the substance. Reads like a journal log:
 * "7:34   tired but settled."
 *
 * Faint cream tone — accumulated content, not focal action. The active
 * prompt below is what the user acts on.
 * -------------------------------------------------------------------- */
function ThreadLine({ time, text }) {
  return (
    <div className="sf-thread-line">
      <span className="sf-thread-time">{time}</span>
      <span className="sf-thread-text">{text}</span>
    </div>
  );
}
