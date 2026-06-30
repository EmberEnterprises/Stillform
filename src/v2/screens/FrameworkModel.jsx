import React, { useState, useMemo } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import {
  getFrameworkPremises,
  markPremiseExplored,
  getExploredCount,
  getPremiseCount,
} from "../lib/frameworkModel.js";

/**
 * FrameworkModel — the framework, surfaced as the map you stand inside (layer 10).
 *
 * The capstone of the surfacing program and Arlin's "layer 1" (the framework
 * itself, made understandable — the ground the user stands on). The three
 * premise concepts already live in the Library as browsable science; this ties
 * them into ONE understood structure, in plain language, each connected to WHY
 * the work compounds and to the practice that uses it. The point is orientation:
 * the person grasps the model they're working inside and stops bracing against
 * their own mind.
 *
 * Self-contained exposition (the deeper science stays in the Library). A light
 * store records which premises they've opened so My Progress can reflect it.
 * Content is FIRST-PASS; Arlin's voice to set.
 *
 * @param {function(): void} onExit — back to My Progress
 */
export default function FrameworkModel({ onExit }) {
  const premises = useMemo(() => getFrameworkPremises(), []);
  const total = getPremiseCount();
  const [open, setOpen] = useState(() => new Set());
  const [exploredCount, setExploredCount] = useState(() => getExploredCount());

  function toggle(id) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        const before = exploredCount;
        const arr = markPremiseExplored(id);
        if (arr.length !== before) {
          setExploredCount(arr.length);
          try { window.plausible?.("Premise Explored", { props: { premise: id } }); } catch {}
        }
      }
      return next;
    });
  }

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      <EditorialBlock
        label="My Progress"
        headline="What's actually happening"
        headlineSize="md"
        body="Stillform isn't symptom management. It's rewiring — and the practice is built on three things the science is clear about. Knowing them changes how you use it: you stop bracing against your own mind and start building it. Here's the model you're working inside."
        rule
      />

      <div style={{ marginTop: "var(--sf-space-24)" }}>
        {premises.map((p, i) => {
          const isOpen = open.has(p.id);
          return (
            <section key={p.id} style={cardStyle}>
              <button
                type="button"
                onClick={() => toggle(p.id)}
                aria-expanded={isOpen}
                style={headRow}
              >
                <MonoLabel size="xs" tone="faint" style={{ marginRight: "12px" }}>
                  {String(i + 1).padStart(2, "0")}
                </MonoLabel>
                <span style={premiseName}>{p.name}</span>
                <span style={{ ...chev, transform: isOpen ? "rotate(90deg)" : "none" }}>›</span>
              </button>

              {isOpen && (
                <div style={{ marginTop: "var(--sf-space-16)" }}>
                  <p style={whatLine}>{p.plainWhat}</p>

                  <MonoLabel size="xs" tone="faint" style={subLabel}>Why it compounds</MonoLabel>
                  <p style={bodyLine}>{p.whyItCompounds}</p>

                  <MonoLabel size="xs" tone="faint" style={subLabel}>The move</MonoLabel>
                  <p style={moveLine}>{p.theMove}</p>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* The synthesis — the three as one structure */}
      <div style={synthWrap}>
        <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
          Put together
        </MonoLabel>
        <p style={synthLine}>
          You build the vocabulary to see your own mind, the reps wire the new responses in, and working a
          trigger while it's live rewrites it at the source. That's why this compounds — and why it's
          building, not maintaining. You're not the same machine running better. You're a machine being
          rebuilt.
        </p>
        {exploredCount < total && (
          <p style={hintLine}>The deeper science for each of these lives in the Library.</p>
        )}
      </div>
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
  padding: "var(--sf-space-24)", marginBottom: "var(--sf-space-16)",
  border: "0.5px solid var(--sf-border-quiet)", borderRadius: "var(--sf-r-default)",
  background: "transparent",
};
const headRow = {
  display: "flex", alignItems: "center", width: "100%",
  background: "transparent", border: "none", padding: 0, cursor: "pointer",
  textAlign: "left", WebkitTapHighlightColor: "transparent",
};
const premiseName = {
  flex: 1, fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "19px",
  lineHeight: 1.3, color: "var(--sf-text-primary)",
};
const chev = {
  fontFamily: "var(--sf-font-mono)", fontSize: "16px", color: "var(--sf-text-faint)",
  marginLeft: "12px", transition: "transform 160ms ease", lineHeight: 1,
};
const whatLine = {
  fontFamily: "var(--sf-font-serif)", fontSize: "16px", lineHeight: 1.6,
  color: "var(--sf-text-primary)", margin: 0,
};
const subLabel = { display: "block", marginTop: "var(--sf-space-24)", marginBottom: "8px" };
const bodyLine = {
  fontFamily: "var(--sf-font-serif)", fontSize: "15px", lineHeight: 1.6,
  color: "var(--sf-text-quiet)", margin: 0,
};
const moveLine = {
  fontFamily: "var(--sf-font-serif)", fontStyle: "italic", fontSize: "15px", lineHeight: 1.6,
  color: "var(--sf-text-quiet)", margin: 0,
};
const synthWrap = {
  marginTop: "var(--sf-space-32)", paddingTop: "var(--sf-space-24)",
  borderTop: "0.5px solid var(--sf-border-hairline)",
};
const synthLine = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "17px", lineHeight: 1.55,
  color: "var(--sf-text-primary)", margin: 0,
};
const hintLine = {
  fontFamily: "var(--sf-font-serif)", fontSize: "14px", lineHeight: 1.5,
  color: "var(--sf-text-faint)", margin: "var(--sf-space-24) 0 0",
};
