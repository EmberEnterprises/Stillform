import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import {
  getStrengths,
  addUserStrength,
  confirmStrength,
  rejectCandidate,
  removeStrength,
  getPendingCandidate,
  clearPendingCandidate,
} from "../lib/strengths.js";

/**
 * Strengths — the both-authored "what's strong in you" surface. The bright pole.
 *
 * A strength = one real thing you're good at, with where it shows and one way to
 * lean on it deliberately (the work: spend it on purpose — using, not knowing,
 * is what moves anything). Science in the Library (your-strengths /
 * strength-on-purpose / two-edges): a strength is often the bright edge of a
 * charged trait, and using a signature strength in a new way moves well-being.
 *
 * BOTH user AND AI: the user names their own AND can confirm/correct/reject a
 * candidate Reframe surfaces from their own material. Reframe-side generation
 * wires next batch; this surface is ready for it.
 *
 * Reflection + authorship only — never asserts a strength the user hasn't
 * confirmed. Self-mastery, plain language, never a score or badge. Empty state
 * is honest and calm. Copy is FIRST-PASS DRAFT; Arlin's voice to set.
 *
 * @param {function(): void} onExit — back to My Progress
 * @param {{strength:string,whereItShows:string,leanInto:string}|null} candidate
 */
export default function Strengths({ onExit, candidate = null }) {
  const [list, setList] = useState(() => getStrengths());
  const [authoring, setAuthoring] = useState(false);
  const [strength, setStrength] = useState("");
  const [where, setWhere] = useState("");
  const [lean, setLean] = useState("");
  const [cand, setCand] = useState(() => candidate || getPendingCandidate());

  const refresh = () => setList(getStrengths());
  const resetForm = () => { setStrength(""); setWhere(""); setLean(""); setAuthoring(false); };
  const canSave = strength.trim() && where.trim() && lean.trim();

  const saveOwn = () => {
    if (!canSave) return;
    addUserStrength({ strength, whereItShows: where, leanInto: lean });
    try { window.plausible?.("Strength Named", { props: { source: "user" } }); } catch {}
    resetForm();
    refresh();
  };

  const confirmCand = () => {
    if (!cand) return;
    confirmStrength({ ...cand, source: "ai" });
    try { window.plausible?.("Strength Named", { props: { source: "ai-confirmed" } }); } catch {}
    clearPendingCandidate();
    setCand(null);
    refresh();
  };
  const editCand = () => {
    if (!cand) return;
    setStrength(cand.strength || ""); setWhere(cand.whereItShows || ""); setLean(cand.leanInto || "");
    setAuthoring(true);
    clearPendingCandidate();
    setCand(null);
  };
  const dismissCand = () => { if (cand) rejectCandidate(cand); clearPendingCandidate(); setCand(null); };

  const remove = (id) => { removeStrength(id); refresh(); };

  const isEmpty = list.length === 0 && !authoring && !cand;

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      <EditorialBlock
        label="My Progress"
        headline="What's strong in you"
        headlineSize="md"
        body="Most of this work watches for where you tip. This is the other pole: the traits you can lean on — named on purpose, so you can reach for them instead of leaving them to chance. A strength is often the bright edge of a charged trait; the all-in that overwhelms is the same all-in that gives fully. And it's the using, not the knowing, that moves anything — so each one comes with a way to spend it."
        rule
      />

      {/* AI-surfaced candidate (both: AI proposes, you decide) */}
      {cand && (
        <section style={cardStyle}>
          <MonoLabel size="xs" tone="faint" style={blockLabel}>Something Reframe noticed</MonoLabel>
          <p style={nameStyle}>{cand.strength}</p>
          <ShowLean where={cand.whereItShows} lean={cand.leanInto} />
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
          {list.map((s) => (
            <section key={s.id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <p style={nameStyle}>{s.strength}</p>
                <button type="button" style={removeBtn} aria-label={`Remove ${s.strength}`} onClick={() => remove(s.id)}>
                  remove
                </button>
              </div>
              <ShowLean where={s.whereItShows} lean={s.leanInto} />
            </section>
          ))}
        </div>
      )}

      {/* Empty state — calm, with the invitation to name one */}
      {isEmpty && (
        <p style={{ ...bodyQuiet, marginTop: "var(--sf-space-24)" }}>
          Nothing named yet. When you're ready, name one — something you're genuinely good at, where it already shows
          up, and one way to use it on purpose. Reframe may also surface one from your own words for you to confirm.
        </p>
      )}

      {/* Authoring flow (you name your own) */}
      {authoring ? (
        <section style={{ ...cardStyle, marginTop: "var(--sf-space-24)" }}>
          <MonoLabel size="xs" tone="faint" style={blockLabel}>Name one</MonoLabel>
          <Field label="The strength" value={strength} onChange={setStrength}
            placeholder="e.g. I read a room fast" rows={1} />
          <Field label="Where it shows up" value={where} onChange={setWhere}
            placeholder="where it already shows in you" rows={2} />
          <Field label="One way to lean on it" value={lean} onChange={setLean}
            placeholder="a way to use it on purpose this week" rows={2} />
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

function ShowLean({ where, lean }) {
  return (
    <div style={{ marginTop: "var(--sf-space-16)" }}>
      <div>
        <MonoLabel size="xs" tone="faint" style={edgeLabel}>Where it shows</MonoLabel>
        <p style={edgeBody}>{where}</p>
      </div>
      <div style={edgeHairline} />
      <div>
        <MonoLabel size="xs" tone="faint" style={edgeLabel}>Lean on it</MonoLabel>
        <p style={edgeBody}>{lean}</p>
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
const nameStyle = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "20px",
  lineHeight: 1.3, color: "var(--sf-text-primary)", margin: 0,
};
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
