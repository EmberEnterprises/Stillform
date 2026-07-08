import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import InstrumentRunner from "./InstrumentRunner.jsx";
import CDQUEST, { score as cdquestScore } from "../lib/instruments/cdquest.js";
import SRIS, { score as srisScore } from "../lib/instruments/sris.js";
import ERQ, { score as erqScore } from "../lib/instruments/erq.js";
import MAIA2, { score as maia2Score } from "../lib/instruments/maia2.js";
import IRI, { score as iriScore } from "../lib/instruments/iri.js";
import MCQ30, { score as mcq30Score } from "../lib/instruments/mcq30.js";
import DOSPERT, { score as dospertScore } from "../lib/instruments/dospert.js";
import ScienceReader from "./ScienceReader.jsx";
import { SCIENCE_ENTRIES, getScienceEntry } from "../lib/scienceLibrary.js";
import LessonRunner from "./LessonRunner.jsx";
import { LESSONS, getLesson, getPopulatedChapters, getLessonsForChapter } from "../lib/learningTrack.js";
import { getMovesBuilding } from "../lib/trackProgress.js";

/**
 * Library — the curated-knowledge surface, reached from the Home footer.
 *
 * Shares the home design system (FRAMING/cohesion law, June 23 2026): the same
 * warm aura + grain ground, mono section labels sitting on a DRAWN BRASS rule,
 * serif item names, dim-brass meta, and a brass arrow that draws on hover —
 * via the shared .sf-sec* classes in components.css. No page invents its own
 * look; everything is uniform with home.
 *
 * THREE TABS (Arlin, 2026-07-08 — 'the learn side of the library… a tab'):
 *   Workshop — the 7 instruments (structured takes on how your mind works)
 *   Science  — the research the practice is built on (35 entries)
 *   Learn    — the Learning Track (the neuroplasticity engine: do-the-rep
 *              lessons + the moves you're building). This wiring closed the
 *              2026-07-08 UNWIRED AUDIT gap — the Track was built but
 *              reachable from nowhere.
 * Tabs keep each heavy section quiet and clear instead of one long scroll.
 *
 * Tapping an instrument/lesson launches its runner in-place; leaving the
 * runner returns to the Library list on the same tab (not home).
 *
 * @param {function(): void} onExit — back to Home
 * @param {string=} initialTab — optional deep-link: "workshop" | "science" | "learn"
 */
const INSTRUMENTS = [
  { id: "cdquest", instrument: CDQUEST, scoreFn: cdquestScore },
  { id: "sris", instrument: SRIS, scoreFn: srisScore },
  { id: "erq", instrument: ERQ, scoreFn: erqScore },
  { id: "maia2", instrument: MAIA2, scoreFn: maia2Score },
  { id: "iri", instrument: IRI, scoreFn: iriScore },
  { id: "mcq30", instrument: MCQ30, scoreFn: mcq30Score },
  { id: "dospert", instrument: DOSPERT, scoreFn: dospertScore },
];

export default function Library({ onExit, initialTab }) {
  const [tab, setTab] = useState(
    initialTab === "learn" || initialTab === "science" ? initialTab : "workshop"
  );
  const [activeId, setActiveId] = useState(null);
  const [activeScienceId, setActiveScienceId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);

  const active = activeId ? INSTRUMENTS.find((e) => e.id === activeId) : null;
  if (active) {
    return (
      <InstrumentRunner
        instrument={active.instrument}
        scoreFn={active.scoreFn}
        onExit={() => setActiveId(null)}
      />
    );
  }

  if (activeScienceId) {
    return (
      <ScienceReader
        entry={getScienceEntry(activeScienceId)}
        onExit={() => setActiveScienceId(null)}
      />
    );
  }

  if (activeLessonId) {
    return <LessonRunner lesson={getLesson(activeLessonId)} onExit={() => setActiveLessonId(null)} />;
  }

  const building = tab === "learn" ? getMovesBuilding(LESSONS.map((l) => l.id)) : [];

  return (
    <>
      <div className="sf-home-aura" aria-hidden="true" />
      <div className="sf-home-grain" aria-hidden="true" />
      <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)", position: "relative", zIndex: 1 }}>
        <button type="button" onClick={onExit} aria-label="Back home" style={backStyle}>
          ← back
        </button>

        <EditorialBlock
          label="Library"
          headline="The Library"
          headlineSize="md"
          body="Where you take a closer look — at the shapes your own thinking makes, the science worth checking it against, and the moves that grow what your mind can do."
          rule
        />

        <div className="sf-tabs" role="tablist" aria-label="Library sections">
          {[
            ["workshop", "Workshop"],
            ["science", "The Science"],
            ["learn", "Learn"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              className="sf-tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "workshop" && (
        <section className="sf-sec">
          <div className="sf-sec-head">
            <span className="sf-sec-head-lbl">Workshop</span>
            <div className="sf-sec-rule" />
          </div>
          <p className="sf-sec-lead">
            Short, structured takes that show how your mind works under pressure. No scores, no
            judgment — take one whenever you want a closer look.
          </p>

          {INSTRUMENTS.map(({ id, instrument }, i) => (
            <button
              key={id}
              type="button"
              className="sf-sec-row"
              aria-label={`Take ${instrument.name}`}
              onClick={() => setActiveId(id)}
            >
              <span className="sf-sec-mark" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="sf-sec-row-main">
                <span className="sf-sec-row-top">
                  <span className="sf-sec-name">{instrument.name}</span>
                  {instrument.estMinutes ? (
                    <span className="sf-sec-meta">~{instrument.estMinutes} min</span>
                  ) : null}
                </span>
                {instrument.subtitle ? <span className="sf-sec-sub">{instrument.subtitle}</span> : null}
              </span>
              <span className="sf-sec-arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </section>
        )}

        {tab === "science" && (
        <section className="sf-sec">
          <div className="sf-sec-head">
            <span className="sf-sec-head-lbl">The Science</span>
            <div className="sf-sec-rule" />
          </div>
          <p className="sf-sec-lead">
            The research the practice is built on — the mechanism behind each tool,
            and where to check it. Drawn from Stillform&rsquo;s science sheet.
          </p>

          {SCIENCE_ENTRIES.map((entry, i) => (
            <button
              key={entry.id}
              type="button"
              className="sf-sec-row"
              aria-label={`Read about ${entry.title}`}
              onClick={() => setActiveScienceId(entry.id)}
            >
              <span className="sf-sec-mark" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="sf-sec-row-main">
                <span className="sf-sec-row-top">
                  <span className="sf-sec-name">{entry.title}</span>
                </span>
                {entry.oneLiner ? <span className="sf-sec-sub">{entry.oneLiner}</span> : null}
              </span>
              <span className="sf-sec-arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </section>
        )}

        {tab === "learn" && (
          <>
            <p className="sf-sec-lead" style={{ marginTop: 0 }}>
              Short lessons where you don&rsquo;t read about a move — you do it once, then
              watch how your own mind did it. The same move turns out to run under learning
              almost anything.
            </p>

            {building.length > 0 ? (
              <section className="sf-sec">
                <div className="sf-sec-head">
                  <span className="sf-sec-head-lbl">The moves you&rsquo;re building</span>
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
                      onClick={() => setActiveLessonId(m.id)}
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
                      onClick={() => setActiveLessonId(lesson.id)}
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
          </>
        )}
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
