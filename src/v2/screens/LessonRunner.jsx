import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import Button from "../components/Button.jsx";
import { getScienceEntry } from "../lib/scienceLibrary.js";

/**
 * LessonRunner — runs one Learning Track lesson as the rep-then-name flow:
 * intro → rep (the user DOES it) → name (what you just did) → transfer (the
 * cross-domain beat — the payoff). Shares the home/Library design system.
 *
 * Reps are not graded and not stored; the value is the doing. Continue is never
 * gated on input — some users will read, some will type, both are fine (autonomy).
 *
 * @param {object} lesson — a LESSONS item
 * @param {function(): void} onExit — back to the Track list
 */
const STEPS = ["intro", "rep", "name", "transfer"];

export default function LessonRunner({ lesson, onExit }) {
  const [step, setStep] = useState(0);
  const [word, setWord] = useState("");
  const [lineA, setLineA] = useState("");
  const [lineB, setLineB] = useState("");
  const [choice, setChoice] = useState("");

  if (!lesson) {
    if (typeof onExit === "function") onExit();
    return null;
  }

  const which = STEPS[step];
  const last = step === STEPS.length - 1;
  const advance = () => (last ? onExit() : setStep((s) => s + 1));

  const concept = getScienceEntry(lesson.conceptId);

  return (
    <>
      <div className="sf-home-aura" aria-hidden="true" />
      <div className="sf-home-grain" aria-hidden="true" />
      <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)", position: "relative", zIndex: 1 }}>
        <button type="button" onClick={onExit} aria-label="Back to the track" style={backStyle}>
          ← the track
        </button>

        <div style={progressStyle}>
          {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
        </div>

        {which === "intro" && (
          <EditorialBlock
            label="Lesson"
            headline={lesson.title}
            headlineSize="md"
            body={lesson.intro}
            rule
          />
        )}

        {which === "rep" && (
          <section style={{ marginTop: "var(--sf-space-12)" }}>
            <SectionLabel>Your turn</SectionLabel>
            <Rep lesson={lesson} word={word} setWord={setWord} lineA={lineA} setLineA={setLineA} lineB={lineB} setLineB={setLineB} choice={choice} setChoice={setChoice} />
          </section>
        )}

        {which === "name" && (
          <section style={{ marginTop: "var(--sf-space-12)" }}>
            <SectionLabel>What you just did</SectionLabel>
            <p style={proseStyle}>{lesson.name}</p>
          </section>
        )}

        {which === "transfer" && (
          <section style={{ marginTop: "var(--sf-space-12)" }}>
            <SectionLabel>Where it transfers</SectionLabel>
            <p style={proseStyle}>{lesson.transfer}</p>
            {concept ? (
              <p style={footerStyle}>
                The science behind it: <span style={{ color: "var(--sf-text-quiet)" }}>{concept.title}</span> — in the Library.
              </p>
            ) : null}
          </section>
        )}

        <div style={{ marginTop: "var(--sf-space-48)" }}>
          <Button variant="primary" fullWidth onClick={advance}>
            {which === "rep" && lesson.rep?.doneLabel ? lesson.rep.doneLabel : last ? "Finish" : "Continue"}
          </Button>
        </div>
      </main>
    </>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "var(--sf-space-16)" }}>
      <span style={labelStyle}>{children}</span>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg,var(--sf-accent-line),transparent)" }} />
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
const proseStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "1.32rem",
  lineHeight: 1.5,
  color: "var(--sf-text-secondary)",
  margin: 0,
  fontWeight: 400,
};
const promptStyle = {
  fontFamily: "var(--sf-font-sans)",
  fontSize: "1rem",
  lineHeight: 1.55,
  color: "var(--sf-text-secondary)",
  margin: "0 0 var(--sf-space-16)",
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
  marginTop: "var(--sf-space-32)",
};
