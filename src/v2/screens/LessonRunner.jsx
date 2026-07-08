import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import Button from "../components/Button.jsx";
import { getScienceEntry } from "../lib/scienceLibrary.js";
import { isWorkingOn, toggleWorkingOn, recordPractice, getPractice, getLiveUsage } from "../lib/trackProgress.js";

/**
 * LessonRunner — runs one Learning Track lesson as a deep practice unit in two
 * phases, preserving rep-before-name:
 *
 *   PHASE 1 "the drill"  — the move (intro) -> watch it once (worked example)
 *                          -> the anchor rep (the user DOES it) -> drills
 *                          (foundation, then take-it-further / harder reps).
 *   PHASE 2 "the depth"  — what you just did (name) -> run it live -> what to
 *                          notice -> when it's hard -> the deeper cut
 *                          (why/trap/when/pairs) -> the levels it climbs ->
 *                          where it carries (transfer + science link) ->
 *                          come back (spaced retrieval, from memory).
 *
 * The depth is revealed only after the rep page, so the user does the move
 * before reading what it was — the rep-then-name order is the pedagogy.
 *
 * Reps are not graded and not stored; the value is the doing. Continue is never
 * gated on input — some users read, some type, both are fine (autonomy). No
 * scores, streaks, or points anywhere.
 *
 * @param {object} lesson — a LESSONS item (deep move-template)
 * @param {function(): void} onExit — back to the Track list
 */
const PHASES = ["drill", "depth"];

export default function LessonRunner({ lesson, onExit }) {
  const [phase, setPhase] = useState(0);
  const [word, setWord] = useState("");
  const [lineA, setLineA] = useState("");
  const [lineB, setLineB] = useState("");
  const [choice, setChoice] = useState("");
  const [working, setWorking] = useState(() => (lesson ? isWorkingOn(lesson.id) : false));

  if (!lesson) {
    if (typeof onExit === "function") onExit();
    return null;
  }

  const which = PHASES[phase];
  const last = phase === PHASES.length - 1;
  const advance = () => {
    if (last) {
      recordPractice(lesson.id);
      onExit();
    } else {
      setPhase((p) => p + 1);
    }
  };
  const practice = getPractice(lesson.id);
  const live = getLiveUsage(lesson.id);
  const concept = getScienceEntry(lesson.conceptId);
  const dc = lesson.deeperCut || {};
  const drills = lesson.drills || {};

  return (
    <>
      <div className="sf-home-aura" aria-hidden="true" />
      <div className="sf-home-grain" aria-hidden="true" />
      <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)", position: "relative", zIndex: 1 }}>
        <button type="button" onClick={onExit} aria-label="Back to the track" style={backStyle}>
          ← the track
        </button>

        <div style={progressStyle}>
          {String(phase + 1).padStart(2, "0")} / {String(PHASES.length).padStart(2, "0")}
          <span style={{ marginLeft: "12px", color: "var(--sf-text-faint)" }}>
            {which === "drill" ? "the drill" : "the depth"}
          </span>
        </div>

        {which === "drill" && (
          <>
            <EditorialBlock label="The move" headline={lesson.title} headlineSize="md" body={lesson.intro} rule />

            {lesson.workedExample ? (
              <Section label="Watch it once">
                <p style={proseStyle}>{lesson.workedExample}</p>
              </Section>
            ) : null}

            <Section label="Your turn">
              <Rep lesson={lesson} word={word} setWord={setWord} lineA={lineA} setLineA={setLineA} lineB={lineB} setLineB={setLineB} choice={choice} setChoice={setChoice} />
            </Section>

            {(drills.foundation?.length || drills.further?.length) ? (
              <Section label="Drills">
                {drills.foundation?.length ? (
                  <ul style={drillListStyle}>
                    {drills.foundation.map((d, i) => (
                      <li key={`f${i}`} style={drillItemStyle}>{d}</li>
                    ))}
                  </ul>
                ) : null}
                {drills.further?.length ? (
                  <>
                    <div style={subLabelStyle}>Take it further</div>
                    <ul style={drillListStyle}>
                      {drills.further.map((d, i) => (
                        <li key={`x${i}`} style={drillItemStyle}>{d}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </Section>
            ) : null}
          </>
        )}

        {which === "depth" && (
          <>
            <Section label="What you just did">
              <p style={proseStyle}>{lesson.name}</p>
            </Section>

            {lesson.runLive ? (
              <Section label="Run it live">
                <p style={proseStyle}>{lesson.runLive}</p>
              </Section>
            ) : null}

            {lesson.notice ? (
              <Section label="What to notice">
                <p style={proseStyle}>{lesson.notice}</p>
              </Section>
            ) : null}

            {lesson.whenHard ? (
              <Section label="When it's hard">
                <p style={proseStyle}>{lesson.whenHard}</p>
              </Section>
            ) : null}

            {(dc.why || dc.trap || dc.when || dc.pairsWith) ? (
              <Section label="The deeper cut">
                {dc.why ? <DeepItem label="Why it works" body={dc.why} /> : null}
                {dc.trap ? <DeepItem label="The trap" body={dc.trap} /> : null}
                {dc.when ? <DeepItem label="When to use it" body={dc.when} /> : null}
                {dc.pairsWith ? <DeepItem label="Pairs with" body={dc.pairsWith} /> : null}
              </Section>
            ) : null}

            {lesson.levels?.length ? (
              <Section label="The levels it climbs">
                <ol style={levelListStyle}>
                  {lesson.levels.map((lv, i) => (
                    <li key={i} style={levelItemStyle}>
                      <span style={levelNumStyle}>{String(i + 1).padStart(2, "0")}</span>
                      <span>{lv}</span>
                    </li>
                  ))}
                </ol>
              </Section>
            ) : null}

            <Section label="Where it carries">
              <p style={proseStyle}>{lesson.transfer}</p>
              {concept ? (
                <p style={footerStyle}>
                  Where to check it: <span style={{ color: "var(--sf-text-quiet)" }}>{concept.title}</span> — in the Library.
                </p>
              ) : null}
            </Section>

            {lesson.comeBack ? (
              <Section label="Come back">
                <p style={proseStyle}>{lesson.comeBack}</p>
              </Section>
            ) : null}

            <Section label="This move">
              <button
                type="button"
                onClick={() => setWorking(toggleWorkingOn(lesson.id))}
                aria-pressed={working}
                style={markStyle(working)}
              >
                {working ? "\u2713 Working on this" : "Mark as working on this"}
              </button>
              {(practice.count > 0 || live.count > 0) ? (
                <p style={tallyStyle}>
                  {practice.count > 0 ? `Practiced here ${practice.count}\u00d7.` : ""}
                  {practice.count > 0 && live.count > 0 ? " " : ""}
                  {live.count > 0 ? `Reached for it in ${live.count} session${live.count === 1 ? "" : "s"}.` : ""}
                </p>
              ) : null}
            </Section>
          </>
        )}

        <div style={{ marginTop: "var(--sf-space-48)" }}>
          <Button variant="primary" fullWidth onClick={advance}>
            {which === "drill" ? (lesson.rep?.doneLabel ? lesson.rep.doneLabel : "Done — what was that?") : "Finish"}
          </Button>
        </div>
      </main>
    </>
  );
}

function Section({ label, children }) {
  return (
    <section style={{ marginTop: "var(--sf-space-32)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "var(--sf-space-16)" }}>
        <span style={labelStyle}>{label}</span>
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg,var(--sf-accent-line),transparent)" }} />
      </div>
      {children}
    </section>
  );
}

function DeepItem({ label, body }) {
  return (
    <div style={{ marginBottom: "var(--sf-space-16)" }}>
      <div style={deepLabelStyle}>{label}</div>
      <p style={{ ...proseStyle, fontSize: "1.12rem" }}>{body}</p>
    </div>
  );
}

function Rep({ lesson, word, setWord, lineA, setLineA, lineB, setLineB, choice, setChoice }) {
  const r = lesson.rep || {};
  if (r.kind === "word") {
    return (
      <>
        <p style={promptStyle}>{r.prompt}</p>
        <input style={inputStyle} value={word} onChange={(e) => setWord(e.target.value)} placeholder={r.placeholder || ""} aria-label={r.prompt} />
      </>
    );
  }
  if (r.kind === "twoline") {
    return (
      <>
        <p style={promptStyle}>{r.prompt1}</p>
        <input style={inputStyle} value={lineA} onChange={(e) => setLineA(e.target.value)} placeholder={r.placeholder1 || ""} aria-label={r.prompt1} />
        <p style={{ ...promptStyle, marginTop: "var(--sf-space-24)" }}>{r.prompt2}</p>
        <input style={inputStyle} value={lineB} onChange={(e) => setLineB(e.target.value)} placeholder={r.placeholder2 || ""} aria-label={r.prompt2} />
      </>
    );
  }
  if (r.kind === "choice") {
    return (
      <>
        <p style={promptStyle}>{r.prompt}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "var(--sf-space-16)" }}>
          {(r.options || []).map((opt) => {
            const on = choice === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setChoice(opt)}
                style={{
                  ...chipStyle,
                  color: on ? "var(--sf-text-cream)" : "var(--sf-text-secondary)",
                  borderColor: on ? "var(--sf-accent)" : "var(--sf-border-quiet)",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {r.allowOther ? (
          <input style={inputStyle} value={choice && !(r.options || []).includes(choice) ? choice : ""} onChange={(e) => setChoice(e.target.value)} placeholder={r.placeholder || "a sharper word"} aria-label="a sharper word" />
        ) : null}
      </>
    );
  }
  // breath (or any instruction-only rep): just the instruction; Continue acts as "done".
  return <p style={promptStyle}>{r.prompt}</p>;
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
  marginBottom: "var(--sf-space-16)",
  WebkitTapHighlightColor: "transparent",
};
const progressStyle = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "10px",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--sf-text-faint)",
  marginBottom: "var(--sf-space-24)",
};
const labelStyle = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "10px",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--sf-accent)",
  whiteSpace: "nowrap",
};
const subLabelStyle = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "9px",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--sf-text-faint)",
  margin: "var(--sf-space-16) 0 var(--sf-space-12)",
};
const deepLabelStyle = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "9px",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--sf-text-quiet)",
  marginBottom: "6px",
};
const proseStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "1.32rem",
  lineHeight: 1.5,
  color: "var(--sf-text-secondary)",
  margin: 0,
  fontWeight: 300,
};
const promptStyle = {
  fontFamily: "var(--sf-font-sans)",
  fontSize: "1rem",
  lineHeight: 1.55,
  color: "var(--sf-text-secondary)",
  margin: "0 0 var(--sf-space-16)",
};
const drillListStyle = { listStyle: "none", padding: 0, margin: 0 };
const drillItemStyle = {
  fontFamily: "var(--sf-font-sans)",
  fontSize: "1rem",
  lineHeight: 1.55,
  color: "var(--sf-text-secondary)",
  padding: "0 0 var(--sf-space-16) 16px",
  borderLeft: "1px solid var(--sf-accent-line)",
  marginLeft: "2px",
  marginBottom: "var(--sf-space-12)",
};
const levelListStyle = { listStyle: "none", padding: 0, margin: 0 };
const levelItemStyle = {
  display: "flex",
  gap: "14px",
  fontFamily: "var(--sf-font-serif)",
  fontSize: "1.18rem",
  lineHeight: 1.45,
  color: "var(--sf-text-secondary)",
  marginBottom: "var(--sf-space-12)",
};
const levelNumStyle = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "10px",
  letterSpacing: "0.12em",
  color: "var(--sf-accent)",
  paddingTop: "6px",
  flexShrink: 0,
};
const inputStyle = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid var(--sf-accent-line)",
  color: "var(--sf-text-primary)",
  fontFamily: "var(--sf-font-serif)",
  fontSize: "1.4rem",
  padding: "8px 2px",
  outline: "none",
  borderRadius: 0,
  WebkitTapHighlightColor: "transparent",
};
const chipStyle = {
  background: "transparent",
  border: "1px solid var(--sf-border-quiet)",
  borderRadius: "999px",
  padding: "8px 16px",
  fontFamily: "var(--sf-font-sans)",
  fontSize: "0.95rem",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
};
const footerStyle = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "11px",
  lineHeight: 1.6,
  color: "var(--sf-text-faint)",
  marginTop: "var(--sf-space-24)",
};
const markStyle = (on) => ({
  background: "transparent",
  border: `1px solid ${on ? "var(--sf-accent)" : "var(--sf-border-quiet)"}`,
  borderRadius: "999px",
  padding: "9px 18px",
  fontFamily: "var(--sf-font-sans)",
  fontSize: "0.95rem",
  color: on ? "var(--sf-text-cream)" : "var(--sf-text-secondary)",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
});
const tallyStyle = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "11px",
  letterSpacing: "0.06em",
  color: "var(--sf-text-faint)",
  marginTop: "var(--sf-space-16)",
};
