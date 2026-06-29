import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import {
  getWindowRead,
  setTilt as saveTilt,
  setEarliestSignal as saveSignal,
  clearField,
  getPendingCandidate,
  clearPendingCandidate,
} from "../lib/windowRead.js";

/**
 * WindowRead — the both-authored "your window" surface.
 *
 * Two reads of your own activation, with the work attached:
 *   - which way you tip outside your window (too revved / too shut-down / it
 *     shifts) — and the correction that matches (revved → settle; flat →
 *     activate), so the read is never just a label.
 *   - your earliest signal (the body tell that shows up first) — where you have
 *     the most leverage to catch it.
 *
 * Science (Library, vetted): the window of tolerance — a zone of arousal where
 * naming and reframing are possible; outside it the work gets hard (Siegel
 * 1999; Porges 2011 on the shut-down end). Clinical-grade underneath, plain
 * self-mastery on top — no "hyperarousal/hypoarousal," no clinical/trauma words.
 *
 * BOTH user AND AI: the user sets their own; Reframe can surface a candidate
 * (a tilt or a tell heard in their words) to confirm — the `candidate` prop /
 * pending stash. Reframe-side generation wires next; surface is ready.
 *
 * Copy here is FIRST-PASS DRAFT; Arlin's voice to set.
 *
 * @param {function(): void} onExit — back to My Progress
 */
export default function WindowRead({ onExit }) {
  const [read, setRead] = useState(() => getWindowRead());
  const [editingSignal, setEditingSignal] = useState(false);
  const [signalDraft, setSignalDraft] = useState("");
  const [cand, setCand] = useState(() => getPendingCandidate());

  const refresh = () => setRead(getWindowRead());

  const pickTilt = (t) => {
    saveTilt(t, "user");
    try { window.plausible?.("Window Read Set", { props: { field: "tilt", value: t } }); } catch {}
    refresh();
  };

  const startSignal = () => { setSignalDraft(read.earliestSignal || ""); setEditingSignal(true); };
  const saveSignalEdit = () => {
    if (signalDraft.trim()) {
      saveSignal(signalDraft, "user");
      try { window.plausible?.("Window Read Set", { props: { field: "signal" } }); } catch {}
    }
    setEditingSignal(false);
    refresh();
  };
  const removeSignal = () => { clearField("earliestSignal"); refresh(); };

  const acceptCand = () => {
    if (!cand) return;
    if (cand.tilt) saveTilt(cand.tilt, "ai");
    if (cand.earliestSignal) saveSignal(cand.earliestSignal, "ai");
    try { window.plausible?.("Window Read Set", { props: { field: "ai-confirmed" } }); } catch {}
    clearPendingCandidate();
    setCand(null);
    refresh();
  };
  const dismissCand = () => { clearPendingCandidate(); setCand(null); };

  const tiltCopy = {
    revved: {
      label: "Too revved",
      hint: "wound up, racing, can't sit still, quick to react",
      work: "Your correction is downward — settle the body before the mind. A slower breath with a longer exhale, or a few minutes of stillness, brings you back into range.",
    },
    flat: {
      label: "Too shut-down",
      hint: "flat, numb, foggy, pulled back, hard to engage",
      work: "Your correction is upward — gentle activation. Movement, a faster breath, cool water, or more light brings you back up into range.",
    },
    shifts: {
      label: "It shifts",
      hint: "depends on the day — sometimes one, sometimes the other",
      work: "Read it live: when you're revved, settle (slow the breath, lengthen the exhale); when you're flat, activate (move, brighten, cool water).",
    },
  };

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      <EditorialBlock
        label="My Progress"
        headline="Your window"
        headlineSize="md"
        body="There's a zone where you can think clearly. Pushed past it, you tip one of two ways — too revved, or too shut-down. Knowing your direction tells you which way to correct. And catching it at your earliest signal is where you have the most say."
        rule
      />

      {/* AI-surfaced candidate (both: AI proposes, you decide) */}
      {cand && (cand.tilt || cand.earliestSignal) && (
        <section style={cardStyle}>
          <MonoLabel size="xs" tone="faint" style={blockLabel}>Something Reframe noticed</MonoLabel>
          {cand.tilt && <p style={candLine}>You tend to tip: <span style={candStrong}>{tiltCopy[cand.tilt]?.label.toLowerCase()}</span></p>}
          {cand.earliestSignal && <p style={candLine}>Your earliest tell: <span style={candStrong}>{cand.earliestSignal}</span></p>}
          <p style={candAskStyle}>Does that land?</p>
          <div style={rowStyle}>
            <button type="button" style={primaryBtn} onClick={acceptCand}>Yes, keep it</button>
            <button type="button" style={ghostBtn} onClick={dismissCand}>No</button>
          </div>
        </section>
      )}

      {/* Which way you tip */}
      <section style={{ ...cardStyle, marginTop: "var(--sf-space-24)" }}>
        <MonoLabel size="xs" tone="faint" style={blockLabel}>Which way you tip</MonoLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {["revved", "flat", "shifts"].map((t) => {
            const on = read.tilt === t;
            return (
              <button key={t} type="button" onClick={() => pickTilt(t)} style={on ? optionOn : optionOff}>
                <span style={optionLabel}>{tiltCopy[t].label}</span>
                <span style={optionHint}>{tiltCopy[t].hint}</span>
              </button>
            );
          })}
        </div>
        {read.tilt && (
          <div style={workBox}>
            <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: 6 }}>The correction</MonoLabel>
            <p style={workBody}>{tiltCopy[read.tilt].work}</p>
          </div>
        )}
      </section>

      {/* Your earliest signal */}
      <section style={{ ...cardStyle, marginTop: "var(--sf-space-16)" }}>
        <MonoLabel size="xs" tone="faint" style={blockLabel}>Your earliest signal</MonoLabel>
        {!editingSignal && read.earliestSignal && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <p style={signalValue}>{read.earliestSignal}</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" style={removeBtn} onClick={startSignal}>edit</button>
              <button type="button" style={removeBtn} onClick={removeSignal}>remove</button>
            </div>
          </div>
        )}
        {!editingSignal && !read.earliestSignal && (
          <>
            <p style={bodyQuiet}>
              The body place activation shows up first for you — the jaw, the chest, the shoulders, the gut. Naming your
              earliest tell is what lets you catch it before it builds. Reframe may also surface it from your own words.
            </p>
            <button type="button" style={{ ...addBtn, marginTop: "var(--sf-space-16)" }} onClick={startSignal}>
              + Name your tell
            </button>
          </>
        )}
        {editingSignal && (
          <>
            <textarea
              value={signalDraft}
              onChange={(e) => setSignalDraft(e.target.value)}
              placeholder="e.g. my jaw tightens before I notice anything else"
              rows={2}
              style={inputStyle}
            />
            <div style={rowStyle}>
              <button type="button" style={signalDraft.trim() ? primaryBtn : primaryBtnDisabled} disabled={!signalDraft.trim()} onClick={saveSignalEdit}>
                Keep this
              </button>
              <button type="button" style={ghostBtn} onClick={() => setEditingSignal(false)}>Cancel</button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

const backStyle = {
  background: "transparent", border: "none", color: "var(--sf-text-faint)",
  fontFamily: "var(--sf-font-mono)", fontSize: "11px", letterSpacing: "0.14em",
  textTransform: "uppercase", cursor: "pointer", padding: "8px 0",
  marginBottom: "var(--sf-space-24)", WebkitTapHighlightColor: "transparent",
};
const cardStyle = {
  marginTop: "var(--sf-space-16)", padding: "var(--sf-space-24)",
  border: "0.5px solid var(--sf-border-quiet)", borderRadius: "var(--sf-r-default)",
  background: "transparent",
};
const blockLabel = { display: "block", marginBottom: "var(--sf-space-16)" };
const optionBase = {
  display: "flex", flexDirection: "column", gap: "3px", textAlign: "left",
  padding: "12px 14px", borderRadius: "var(--sf-r-tight)", cursor: "pointer",
  background: "transparent", WebkitTapHighlightColor: "transparent",
};
const optionOff = { ...optionBase, border: "0.5px solid var(--sf-border-quiet)" };
const optionOn = { ...optionBase, border: "1px solid var(--sf-accent)" };
const optionLabel = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "17px",
  color: "var(--sf-text-primary)",
};
const optionHint = {
  fontFamily: "var(--sf-font-mono)", fontSize: "11px", letterSpacing: "0.02em",
  color: "var(--sf-text-faint)",
};
const workBox = {
  marginTop: "var(--sf-space-16)", paddingTop: "var(--sf-space-16)",
  borderTop: "0.5px solid var(--sf-border-quiet)",
};
const workBody = {
  fontFamily: "var(--sf-font-serif)", fontSize: "15px", lineHeight: 1.55,
  color: "var(--sf-text-quiet)", margin: 0,
};
const signalValue = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "18px",
  lineHeight: 1.35, color: "var(--sf-text-primary)", margin: 0,
};
const bodyQuiet = {
  fontFamily: "var(--sf-font-serif)", fontSize: "15px", lineHeight: 1.6,
  color: "var(--sf-text-quiet)", margin: 0,
};
const candLine = {
  fontFamily: "var(--sf-font-serif)", fontSize: "16px", lineHeight: 1.5,
  color: "var(--sf-text-quiet)", margin: "0 0 6px",
};
const candStrong = { color: "var(--sf-text-primary)" };
const candAskStyle = { ...bodyQuiet, marginTop: "var(--sf-space-16)", color: "var(--sf-text-faint)" };
const rowStyle = { display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "var(--sf-space-24)" };
const baseBtn = {
  fontFamily: "var(--sf-font-mono)", fontSize: "12px", letterSpacing: "0.08em",
  padding: "10px 16px", borderRadius: "var(--sf-r-tight)", cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
};
const primaryBtn = { ...baseBtn, background: "transparent", color: "var(--sf-accent)", border: "1px solid var(--sf-accent)" };
const primaryBtnDisabled = { ...primaryBtn, opacity: 0.4, cursor: "default" };
const ghostBtn = { ...baseBtn, background: "transparent", color: "var(--sf-text-quiet)", border: "0.5px solid var(--sf-border-quiet)" };
const addBtn = { ...ghostBtn, display: "inline-block" };
const removeBtn = {
  background: "transparent", border: "none", color: "var(--sf-text-faint)",
  fontFamily: "var(--sf-font-mono)", fontSize: "10px", letterSpacing: "0.1em",
  textTransform: "uppercase", cursor: "pointer", padding: "4px 0", WebkitTapHighlightColor: "transparent",
};
const inputStyle = {
  width: "100%", boxSizing: "border-box", background: "transparent",
  border: "0.5px solid var(--sf-border-quiet)", borderRadius: "var(--sf-r-tight)", padding: "10px 12px",
  fontFamily: "var(--sf-font-serif)", fontSize: "15px", lineHeight: 1.5,
  color: "var(--sf-text-primary)", resize: "vertical",
};
