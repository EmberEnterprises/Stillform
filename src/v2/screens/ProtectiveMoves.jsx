import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import {
  getProtectiveMoves,
  addUserProtectiveMove,
  confirmProtectiveMove,
  rejectCandidate,
  removeProtectiveMove,
  getPendingCandidate,
  clearPendingCandidate,
} from "../lib/protectiveMoves.js";

/**
 * ProtectiveMoves — the both-authored "how you protect yourself" surface.
 *
 * A protective move = one automatic move you make under pressure (a defense or
 * a threat reflex), shown with BOTH edges: where it protected you, and where it
 * costs you now. One move, two edges — the science in the Library
 * (moves-under-pressure / first-move-under-threat / two-edges).
 *
 * Clinical-grade evaluation underneath, self-mastery delivery on top: no
 * clinical / disorder / trauma language anywhere here. Plain, pointed at
 * mastery — the move isn't a flaw, it's standard equipment you learn to read.
 *
 * BOTH user AND AI (the standing rule):
 *   - the user can NAME their own (the authoring flow), and
 *   - Reframe can SURFACE one from the user's own material as a candidate the
 *     user confirms/corrects/rejects (the `candidate` prop / pending stash).
 * Reframe-side generation wires next batch; this surface is ready for it.
 *
 * Reflection + authorship only — never asserts a move the user hasn't
 * confirmed. Empty state is honest and calm (no inflated type — substance).
 * Copy here is FIRST-PASS DRAFT; Arlin's voice to set.
 *
 * @param {function(): void} onExit — back to My Progress
 * @param {{move:string,protectedEdge:string,costEdge:string}|null} candidate
 *        — an AI-surfaced suggestion to confirm/correct/reject (optional)
 */
export default function ProtectiveMoves({ onExit, candidate = null }) {
  const [list, setList] = useState(() => getProtectiveMoves());
  const [authoring, setAuthoring] = useState(false);
  const [move, setMove] = useState("");
  const [protect, setProtect] = useState("");
  const [cost, setCost] = useState("");
  const [cand, setCand] = useState(() => candidate || getPendingCandidate());

  const refresh = () => setList(getProtectiveMoves());
  const resetForm = () => { setMove(""); setProtect(""); setCost(""); setAuthoring(false); };
  const canSave = move.trim() && protect.trim() && cost.trim();

  const saveOwn = () => {
    if (!canSave) return;
    addUserProtectiveMove({ move, protectedEdge: protect, costEdge: cost });
    try { window.plausible?.("Protective Move Named", { props: { source: "user" } }); } catch {}
    resetForm();
    refresh();
  };

  const confirmCand = () => {
    if (!cand) return;
    confirmProtectiveMove({ ...cand, source: "ai" });
    try { window.plausible?.("Protective Move Named", { props: { source: "ai-confirmed" } }); } catch {}
    clearPendingCandidate();
    setCand(null);
    refresh();
  };
  const editCand = () => {
    if (!cand) return;
    setMove(cand.move || ""); setProtect(cand.protectedEdge || ""); setCost(cand.costEdge || "");
    setAuthoring(true);
    clearPendingCandidate();
    setCand(null);
  };
  const dismissCand = () => { if (cand) rejectCandidate(cand); clearPendingCandidate(); setCand(null); };

  const remove = (id) => { removeProtectiveMove(id); refresh(); };

  const isEmpty = list.length === 0 && !authoring && !cand;

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      <EditorialBlock
        label="My Progress"
        headline="How you protect yourself"
        headlineSize="md"
        body="Under pressure you reach for a move before you think — going still, smoothing it over, taking charge, retreating into analysis. None of them is a flaw; each one protected you somewhere. Every move has two edges: where it kept you safe, and where it runs you now. You keep the read on it, and choose."
        rule
      />

      {/* AI-surfaced candidate (both: AI proposes, you decide) */}
      {cand && (
        <section style={cardStyle}>
          <MonoLabel size="xs" tone="faint" style={blockLabel}>Something Reframe noticed</MonoLabel>
          <p style={moveStyle}>{cand.move}</p>
          <EdgePair protect={cand.protectedEdge} cost={cand.costEdge} />
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
          {list.map((m) => (
            <section key={m.id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <p style={moveStyle}>{m.move}</p>
                <button type="button" style={removeBtn} aria-label={`Remove ${m.move}`} onClick={() => remove(m.id)}>
                  remove
                </button>
              </div>
              <EdgePair protect={m.protectedEdge} cost={m.costEdge} />
            </section>
          ))}
        </div>
      )}

      {/* Empty state — calm, with the invitation to name one */}
      {isEmpty && (
        <p style={{ ...bodyQuiet, marginTop: "var(--sf-space-24)" }}>
          Nothing named yet. When you're ready, name one — a move you make under pressure, where it once protected
          you, and where it costs you now. Reframe may also surface one from your own words for you to confirm.
        </p>
      )}

      {/* Authoring flow (you name your own) */}
      {authoring ? (
        <section style={{ ...cardStyle, marginTop: "var(--sf-space-24)" }}>
          <MonoLabel size="xs" tone="faint" style={blockLabel}>Name one</MonoLabel>
          <Field label="The move" value={move} onChange={setMove}
            placeholder="e.g. going quiet when things heat up" rows={1} />
          <Field label="Where it protected you" value={protect} onChange={setProtect}
            placeholder="what it once kept you safe from" rows={2} />
          <Field label="Where it costs you now" value={cost} onChange={setCost}
            placeholder="where the old reflex runs you today" rows={2} />
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

function EdgePair({ protect, cost }) {
  return (
    <div style={{ marginTop: "var(--sf-space-16)" }}>
      <div style={edgeRow}>
        <MonoLabel size="xs" tone="faint" style={edgeLabel}>Where it protected you</MonoLabel>
        <p style={edgeBody}>{protect}</p>
      </div>
      <div style={edgeHairline} />
      <div style={edgeRow}>
        <MonoLabel size="xs" tone="faint" style={edgeLabel}>Where it costs you now</MonoLabel>
        <p style={edgeBody}>{cost}</p>
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
const moveStyle = {
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
