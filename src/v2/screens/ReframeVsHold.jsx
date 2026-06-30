import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import { getLean, setLean, reframeHoldOptions } from "../lib/reframeVsHold.js";

/**
 * ReframeVsHold — "do you reframe it, or hold it in?" surface (layer 5).
 *
 * The reappraisal-vs-suppression distinction, made workable. Two ways to handle
 * a hard feeling: reframe it (cognitive reappraisal — change the read to change
 * the feeling) or hold it in (expressive suppression — feel it, keep the lid on,
 * carry it). Habitual reframers tend to feel more positive / less negative
 * emotion, stay closer, and pay no memory cost; habitual holders get the
 * reverse — but holding it in isn't always wrong, only costly as a DEFAULT
 * (Gross & John 2003; Science Sheet "Reframing vs holding it in"; Library
 * "reframe-vs-hold").
 *
 * Three parts: the teaching (plain, never "suppression is bad", never clinical);
 * the self-read (which do you lean toward?); and the readback that ENDS IN THE
 * MOVE — reframing is exactly what Reframe does, so the directive is concrete:
 * when you catch yourself carrying something, that's the cue to reframe it
 * (rumination guard: a direction, never open staring).
 *
 * Both user AND AI (standing rule): the user names their lean here; the ERQ
 * instrument already measures the same lean and feeds the Growth mirror +
 * Reframe steer. The lean persists so My Progress reflects it. Honest-empty.
 *
 * Copy here is FIRST-PASS DRAFT; Arlin's voice to set.
 *
 * @param {function(): void} onExit — back to My Progress
 */
export default function ReframeVsHold({ onExit }) {
  const [picked, setPicked] = useState(() => getLean());

  const options = reframeHoldOptions();

  function choose(id) {
    setPicked(id);
    setLean(id);
    try { window.plausible?.("Reframe Lean Set", { props: { lean: id } }); } catch {}
  }

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      <EditorialBlock
        label="My Progress"
        headline="Do you reframe it — or hold it in?"
        headlineSize="md"
        body="When something hits hard, there are two ways to handle it. You can reframe it — change the read so it lands differently. Or you can hold it in — feel it, but keep the lid on and carry it. Most people lean one way without noticing. The reframers tend to come out lighter: more of the good feeling, less of the heavy kind, and they don't carry it as long. Holding it in isn't wrong — sometimes it's the right call — but as a habit it costs. The good news: reframing is trainable. It's the move Stillform is built around."
        rule
      />

      {/* The self-read (the work, attached) */}
      <section style={{ ...cardStyle, marginTop: "var(--sf-space-24)" }}>
        <MonoLabel size="xs" tone="faint" style={blockLabel}>Which do you tend to do?</MonoLabel>
        <p style={promptStyle}>When a hard feeling lands, your first move is usually to —</p>
        <div style={chipWrap}>
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              style={picked === o.id ? chipOn : chipOff}
              aria-pressed={picked === o.id}
              onClick={() => choose(o.id)}
            >
              {o.label}
            </button>
          ))}
        </div>
        {picked && <p style={readbackStyle}>{READBACK[picked]}</p>}
      </section>

      {picked && (
        <p style={{ ...bodyQuiet, marginTop: "var(--sf-space-24)" }}>
          {picked === "reframe"
            ? "You can change this anytime — leans shift as you do the work."
            : "Next time you catch yourself carrying something, open Reframe and work it through. That's the rep."}
        </p>
      )}
    </main>
  );
}

const READBACK = {
  reframe:
    "That's the move Stillform trains — you already reach for it. The work now is range: keep widening what you can reframe, especially the ones that feel too big to touch.",
  hold:
    "Holding it in isn't a failure — sometimes it's the right call. But as a default it tends to cost: less of the good feeling, more of the heavy kind, and it sits with you longer. The move is to catch the moment you're carrying something and reframe it instead — that's exactly what Reframe is for.",
  both:
    "Honest answer — most people shift by the moment. What matters is noticing which one you're in. When you catch yourself holding something in and carrying it, treat that as the cue to reframe it instead.",
};

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
const promptStyle = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "19px",
  lineHeight: 1.3, color: "var(--sf-text-primary)", margin: 0,
};
const chipWrap = { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "var(--sf-space-16)" };
const chipBase = {
  fontFamily: "var(--sf-font-mono)", fontSize: "12px", letterSpacing: "0.04em",
  padding: "8px 14px", borderRadius: "var(--sf-r-tight)", cursor: "pointer",
  background: "transparent", WebkitTapHighlightColor: "transparent",
};
const chipOff = { ...chipBase, color: "var(--sf-text-quiet)", border: "0.5px solid var(--sf-border-quiet)" };
const chipOn = { ...chipBase, color: "var(--sf-accent)", border: "1px solid var(--sf-accent)" };
const readbackStyle = {
  fontFamily: "var(--sf-font-serif)", fontSize: "15px", lineHeight: 1.6,
  color: "var(--sf-text-quiet)", margin: "var(--sf-space-24) 0 0",
};
const bodyQuiet = {
  fontFamily: "var(--sf-font-serif)", fontSize: "15px", lineHeight: 1.6,
  color: "var(--sf-text-quiet)", margin: 0,
};
