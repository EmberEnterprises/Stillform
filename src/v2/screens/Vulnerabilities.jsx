import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import {
  getVulnerabilities,
  addUserVulnerability,
  confirmVulnerability,
  rejectCandidate,
  removeVulnerability,
} from "../lib/vulnerabilities.js";

/**
 * Vulnerabilities — the both-authored "your vulnerabilities" surface.
 *
 * A vulnerability = one charged trait shown with BOTH edges: where it tips you
 * (the cost) and where it serves you (the strength). One trait, two edges —
 * the science in the Library (two-edges / everyone-has-them / work-with-it).
 *
 * BOTH user AND AI (the standing rule):
 *   - the user can NAME their own (the authoring flow), and
 *   - Reframe can SURFACE one from the user's own material as a candidate the
 *     user confirms/corrects/rejects (the `candidate` prop).
 * The AI generation + Reframe-context wiring is staged for Arlin's live walk;
 * this surface already renders + stores both paths so it's ready for it.
 *
 * Reflection + authorship only — never asserts a vulnerability the user hasn't
 * confirmed. Empty state is honest and calm (no inflated type — substance).
 * Copy here is FIRST-PASS DRAFT; Arlin's voice to set.
 *
 * @param {function(): void} onExit — back to My Progress
 * @param {{trait:string,costEdge:string,strengthEdge:string}|null} candidate
 *        — an AI-surfaced suggestion to confirm/correct/reject (optional)
 */
export default function Vulnerabilities({ onExit, candidate = null }) {
  const [list, setList] = useState(() => getVulnerabilities());
  const [authoring, setAuthoring] = useState(false);
  const [trait, setTrait] = useState("");
  const [cost, setCost] = useState("");
  const [strength, setStrength] = useState("");
  const [cand, setCand] = useState(candidate);

  const refresh = () => setList(getVulnerabilities());
  const resetForm = () => { setTrait(""); setCost(""); setStrength(""); setAuthoring(false); };
  const canSave = trait.trim() && cost.trim() && strength.trim();

  const saveOwn = () => {
    if (!canSave) return;
    addUserVulnerability({ trait, costEdge: cost, strengthEdge: strength });
    try { window.plausible?.("Vulnerability Named", { props: { source: "user" } }); } catch {}
    resetForm();
    refresh();
  };

  const confirmCand = () => {
    if (!cand) return;
    confirmVulnerability({ ...cand, source: "ai" });
    try { window.plausible?.("Vulnerability Named", { props: { source: "ai-confirmed" } }); } catch {}
    setCand(null);
    refresh();
  };
  const editCand = () => {
    if (!cand) return;
    setTrait(cand.trait || ""); setCost(cand.costEdge || ""); setStrength(cand.strengthEdge || "");
    setAuthoring(true);
    setCand(null);
  };
  const dismissCand = () => { if (cand) rejectCandidate(cand); setCand(null); };

  const remove = (id) => { removeVulnerability(id); refresh(); };

  const isEmpty = list.length === 0 && !authoring && !cand;

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      <EditorialBlock
        label="My Progress"
        headline="Your vulnerabilities"
        headlineSize="md"
        body="A charged part of how you're built — a need, a sensitivity, a reflex. Everyone has them. Each one has two edges: where it tips you, and where it serves you. Usually they're the same trait. You keep the strength while you learn to watch the cost."
        rule
      />

      {/* AI-surfaced candidate (both: AI proposes, you decide) */}
      {cand && (
        <section style={cardStyle}>
          <MonoLabel size="xs" tone="faint" style={blockLabel}>Something Reframe noticed</MonoLabel>
          <p style={traitStyle}>{cand.trait}</p>
          <EdgePair cost={cand.costEdge} strength={cand.strengthEdge} />
          <p style={candAskStyle}>Does that land?</p>
          <div style={rowStyle}>
            <button type="button" style={primaryBtn} onClick={confirmCand}>Yes, that's me</button>
            <button type="button" style={ghostBtn} onClick={editCand}>Not quite — edit</button>
            <button type="button" style={ghostBtn} onClick={dismissCand}>No</button>
          </div>
        </section>
      )}

      {/* Confirmed list */}
      {list.length > 0 && (
        <div style={{ marginTop: "var(--sf-space-24)" }}>
          {list.map((v) => (
            <section key={v.id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <p style={traitStyle}>{v.trait}</p>
                <button type="button" style={removeBtn} aria-label={`Remove ${v.trait}`} onClick={() => remove(v.id)}>
                  remove
                </button>
              </div>
              <EdgePair cost={v.costEdge} strength={v.strengthEdge} />
            </section>
          ))}
        </div>
      )}

      {/* Empty state — calm, with the invitation to name one */}
      {isEmpty && (
        <p style={{ ...bodyQuiet, marginTop: "var(--sf-space-24)" }}>
          Nothing named yet. When you're ready, name one — the part of you that tends to run the show, and the
          strength that lives in the same place. Reframe may also surface one from your own words for you to confirm.
        </p>
      )}

      {/* Authoring flow (you name your own) */}
      {authoring ? (
        <section style={{ ...cardStyle, marginTop: "var(--sf-space-24)" }}>
          <MonoLabel size="xs" tone="faint" style={blockLabel}>Name one</MonoLabel>
          <Field label="The trait" value={trait} onChange={setTrait}
            placeholder="e.g. my need for attention and care" rows={1} />
          <Field label="Where it tips you" value={cost} onChange={setCost}
            placeholder="how it runs you when it's unseen" rows={2} />
          <Field label="Where it serves you" value={strength} onChange={setStrength}
            placeholder="the strength that lives in the same place" rows={2} />
          <div style={rowStyle}>
            <button type="button" style={canSave ? primaryBtn : primaryBtnDisabled} disabled={!canSave} onClick={saveOwn}>
              Keep this
            </button>
            <button type="button" style={ghostBtn} onClick={resetForm}>Cancel</button>
          </div>
        </section>
      ) : (
        <button type="button" style={{ ...addBtn, marginTop: "var(--sf-space-24)" }} onClick={() => setAuthoring(true)}>
          + Name one
        </button>
      )}
    </main>
  );
}

function EdgePair({ cost, strength }) {
  return (
    <div style={{ marginTop: "var(--sf-space-16)" }}>
      <div style={edgeRow}>
        <MonoLabel size="xs" tone="faint" style={edgeLabel}>Where it tips you</MonoLabel>
        <p style={edgeBody}>{cost}</p>
      </div>
      <div style={edgeHairline} />
      <div style={edgeRow}>
        <MonoLabel size="xs" tone="faint" style={edgeLabel}>Where it serves you</MonoLabel>
        <p style={edgeBody}>{strength}</p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, rows = 2 }) {
  return (
    <div style={{ marginBottom: "var(--sf-space-16)" }}>
      <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: 6 }}>{label}</MonoLabel>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={inputStyle}
      />
    </div>
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
const traitStyle = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "20px",
  lineHeight: 1.3, color: "var(--sf-text-primary)", margin: 0,
};
const edgeRow = {};
const edgeLabel = { display: "block", marginBottom: 4 };
const edgeBody = {
  fontFamily: "var(--sf-font-serif)", fontSize: "15px", lineHeight: 1.55,
  color: "var(--sf-text-quiet)", margin: 0,
};
const edgeHairline = { height: "0.5px", background: "var(--sf-border-quiet)", margin: "var(--sf-space-16) 0" };
const candAskStyle = { ...edgeBody, marginTop: "var(--sf-space-16)", color: "var(--sf-text-faint)" };
const bodyQuiet = {
  fontFamily: "var(--sf-font-serif)", fontSize: "15px", lineHeight: 1.6,
  color: "var(--sf-text-quiet)", margin: 0,
};
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
