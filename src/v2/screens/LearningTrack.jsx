import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import LessonRunner from "./LessonRunner.jsx";
import { LESSONS, getLesson, getPopulatedChapters, getLessonsForChapter } from "../lib/learningTrack.js";
import { getMovesBuilding } from "../lib/trackProgress.js";

/**
 * LearningTrack — the self-paced Track surface. The structured-proactive
 * complement to the live-reactive spine: the spine is metacognition of your
 * emotional life as it happens; the Track is metacognition of your learning,
 * on purpose. Both build the same thing.
 *
 * Shares the home/Library design system (sf-sec rows, EditorialBlock). Tapping
 * a lesson runs it in-place via LessonRunner; leaving returns to this list.
 *
 * @param {function(): void} onExit — back to Home
 */
export default function LearningTrack({ onExit }) {
  const [activeId, setActiveId] = useState(null);

  if (activeId) {
    return <LessonRunner lesson={getLesson(activeId)} onExit={() => setActiveId(null)} />;
  }

  const building = getMovesBuilding(LESSONS.map((l) => l.id));

  return (
    <>
      <div className="sf-home-aura" aria-hidden="true" />
      <div className="sf-home-grain" aria-hidden="true" />
      <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)", position: "relative", zIndex: 1 }}>
        <button type="button" onClick={onExit} aria-label="Back home" style={backStyle}>
          ← back
        </button>

        <EditorialBlock
          label="Learning Track"
          headline="The Track"
          headlineSize="md"
          body="Short lessons where you don't read about a move — you do it once, then watch how your own mind did it. The same move turns out to run under learning almost anything."
          rule
        />

        {building.length > 0 ? (
          <section className="sf-sec">
            <div className="sf-sec-head">
              <span className="sf-sec-head-lbl">The moves you're building</span>
              <div className="sf-sec-rule" />
            </div>
            {building.map((m) => {
              const lesson = getLesson(m.id);
              if (!lesson) return null;
              const bits = [];
              if (m.working) bits.push("working on");
              if (m.practice.count > 0) bits.push(`practiced ${m.practice.count}\u00d7`);
              if (m.live.count > 0) bits.push(`${m.live.count} session${m.live.count === 1 ? "" : "s"}`);
              return (
                <button
                  key={m.id}
                  type="button"
                  className="sf-sec-row"
                  aria-label={`Open move: ${lesson.title}`}
                  onClick={() => setActiveId(m.id)}
                >
                  <span className="sf-sec-mark" aria-hidden="true">{m.working ? "\u25c9" : "\u00b7"}</span>
                  <span className="sf-sec-row-main">
                    <span className="sf-sec-row-top">
                      <span className="sf-sec-name">{lesson.title}</span>
                    </span>
                    {bits.length ? <span className="sf-sec-sub">{bits.join(" \u00b7 ")}</span> : null}
                  </span>
                  <span className="sf-sec-arrow" aria-hidden="true">→</span>
                </button>
              );
            })}
          </section>
        ) : null}

        {getPopulatedChapters().map((chapter) => {
          const lessons = getLessonsForChapter(chapter.id);
          return (
            <section className="sf-sec" key={chapter.id}>
              <div className="sf-sec-head">
                <span className="sf-sec-head-lbl">{chapter.title}</span>
                <div className="sf-sec-rule" />
              </div>
              {chapter.blurb ? <p className="sf-sec-lead">{chapter.blurb}</p> : null}

              {lessons.map((lesson, i) => (
                <button
                  key={lesson.id}
                  type="button"
                  className="sf-sec-row"
                  aria-label={`Start lesson: ${lesson.title}`}
                  onClick={() => setActiveId(lesson.id)}
                >
                  <span className="sf-sec-mark" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="sf-sec-row-main">
                    <span className="sf-sec-row-top">
                      <span className="sf-sec-name">{lesson.title}</span>
                    </span>
                    {lesson.transferLine ? <span className="sf-sec-sub">{lesson.transferLine}</span> : null}
                  </span>
                  <span className="sf-sec-arrow" aria-hidden="true">→</span>
                </button>
              ))}
            </section>
          );
        })}
      </main>
    </>
  );
}

const backStyle = {
  background: "transparent",
  border: "none",
  color: "var(--sf-text-faint)",
  fontFamily: "var(--sf-font-mono)",
  fontSize: "11px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  cursor: "pointer",
  padding: "8px 0",
  marginBottom: "var(--sf-space-24)",
  WebkitTapHighlightColor: "transparent",
};
