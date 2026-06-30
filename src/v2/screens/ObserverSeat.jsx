import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import {
  observerSeatForms,
  recordObserverSeatUse,
} from "../lib/observerSeat.js";

/**
 * ObserverSeat — "step out of the thought and watch it" surface (layer 6).
 *
 * Self-distancing, made workable. There's a difference between being INSIDE a
 * thought ("I'm failing" = a fact) and watching it from a step back ("I'm
 * having the thought that I'm failing" = one thought, passing through). The
 * words don't change; your distance from them does — and that gap loosens the
 * grip (Kross & Ayduk 2011, psychological distancing; Han & Kim 2022, ACT
 * cognitive defusion; Science Sheet; Library "observer-seat").
 *
 * This is the live home for the two perspective primitives that were built but
 * deliberately left unwired for Arlin's voice: defuse() (the observed-thought
 * wrap) and revoice() (second-person self-distance). The user puts in a thought
 * that's running them; the surface hands it back from the seat. The step back
 * IS the resolution — it ends in the shift, never open staring (rumination
 * guard). Honest: if there's nothing to step back from, it says so plainly
 * rather than fake a transform.
 *
 * Copy here is FIRST-PASS DRAFT; Arlin's voice to set.
 *
 * @param {function(): void} onExit — back to My Progress
 */
export default function ObserverSeat({ onExit }) {
  const [text, setText] = useState("");
  const [forms, setForms] = useState(null);
  const [noStep, setNoStep] = useState(false);

  function takeSeat() {
    const f = observerSeatForms(text);
    if (!f) {
      setForms(null);
      setNoStep(true);
      return;
    }
    setForms(f);
    setNoStep(false);
    recordObserverSeatUse();
    try { window.plausible?.("Observer Seat Used"); } catch {}
  }

  function reset() {
    setText("");
    setForms(null);
    setNoStep(false);
  }

  const canTake = text.trim().length > 0;

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      <EditorialBlock
        label="My Progress"
        headline="Take the observer seat"
        headlineSize="md"
        body="There's a difference between being inside a thought and watching it. Inside it, “I'm failing” is just true. From a step back, it's a thought you're having — one of many, passing through. The words are the same. What changes is that you're holding the thought instead of it holding you, and that small gap is enough to loosen its grip. It's a move you can make on purpose. Put a thought that's running you below, and see it from the seat."
        rule
      />

      {/* The work: a thought in, the seat back */}
      <section style={{ ...cardStyle, marginTop: "var(--sf-space-24)" }}>
        <MonoLabel size="xs" tone="faint" style={blockLabel}>A thought that's got a grip on you</MonoLabel>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); if (noStep) setNoStep(false); }}
          placeholder="In your own words — e.g. “I'm going to mess this up”"
          rows={3}
          style={textareaStyle}
        />
        <div style={{ display: "flex", gap: "10px", marginTop: "var(--sf-space-16)" }}>
          <button type="button" onClick={takeSeat} disabled={!canTake} style={canTake ? btnOn : btnOff}>
            Take the seat
          </button>
          {(forms || noStep) && (
            <button type="button" onClick={reset} style={btnGhost}>
              another
            </button>
          )}
        </div>
      </section>

      {/* The seat: the same thought, seen from a step back */}
      {forms && (
        <section style={{ ...cardStyle, marginTop: "var(--sf-space-16)" }}>
          <MonoLabel size="xs" tone="faint" style={blockLabel}>From the seat</MonoLabel>

          <p style={seatLine}>{forms.defused}</p>

          {forms.distanced && (
            <>
              <MonoLabel size="xs" tone="faint" style={{ ...blockLabel, marginTop: "var(--sf-space-24)" }}>
                A step further
              </MonoLabel>
              <p style={seatLine}>{forms.distanced}</p>
              <p style={seatNote}>— said to yourself, the way you'd steady someone you were looking out for.</p>
            </>
          )}

          <p style={closeLine}>
            The thought didn't change. Your distance from it did — and that gap is where the choice lives.
            When you're ready to work it, that's what Reframe is for.
          </p>
        </section>
      )}

      {noStep && (
        <p style={{ ...bodyQuiet, marginTop: "var(--sf-space-24)" }}>
          There's nothing to step back from there yet — try it as a thought in your own words, the kind that
          starts with “I”. That's the one the seat is for.
        </p>
      )}
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
const textareaStyle = {
  width: "100%", boxSizing: "border-box", resize: "vertical",
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "17px",
  lineHeight: 1.4, color: "var(--sf-text-primary)", background: "transparent",
  border: "0.5px solid var(--sf-border-quiet)", borderRadius: "var(--sf-r-tight)",
  padding: "12px 14px", outline: "none",
};
const btnBase = {
  fontFamily: "var(--sf-font-mono)", fontSize: "12px", letterSpacing: "0.04em",
  padding: "9px 16px", borderRadius: "var(--sf-r-tight)", cursor: "pointer",
  background: "transparent", WebkitTapHighlightColor: "transparent",
};
const btnOn = { ...btnBase, color: "var(--sf-accent)", border: "1px solid var(--sf-accent)" };
const btnOff = { ...btnBase, color: "var(--sf-text-faint)", border: "0.5px solid var(--sf-border-quiet)", cursor: "default" };
const btnGhost = { ...btnBase, color: "var(--sf-text-quiet)", border: "0.5px solid var(--sf-border-quiet)" };
const seatLine = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "19px",
  lineHeight: 1.35, color: "var(--sf-text-primary)", margin: 0,
};
const seatNote = {
  fontFamily: "var(--sf-font-serif)", fontSize: "14px", lineHeight: 1.5,
  color: "var(--sf-text-faint)", margin: "8px 0 0",
};
const closeLine = {
  fontFamily: "var(--sf-font-serif)", fontSize: "15px", lineHeight: 1.6,
  color: "var(--sf-text-quiet)", margin: "var(--sf-space-24) 0 0",
};
const bodyQuiet = {
  fontFamily: "var(--sf-font-serif)", fontSize: "15px", lineHeight: 1.6,
  color: "var(--sf-text-quiet)", margin: 0,
};
