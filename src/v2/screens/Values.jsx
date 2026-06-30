import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import {
  getValues,
  addUserValue,
  confirmValue,
  rejectCandidate,
  removeValue,
  getPendingCandidate,
  clearPendingCandidate,
} from "../lib/values.js";

/**
 * Values — the both-authored "what you're moving toward" surface. The compass.
 *
 * A value = one direction you choose to move toward, with what living it looks
 * like and one committed step (the work: a value without a step is just a word).
 * Science in the Library (your-values; ACT): values clarification (freely
 * chosen directions, yours not handed to you) + committed action. The choosing
 * stays the user's — autonomy is the point, so the AI proposes but never
 * prescribes.
 *
 * BOTH user AND AI: the user names their own AND can confirm/correct/reject a
 * direction Reframe heard in their own words. Reframe-side generation wires next
 * batch; this surface is ready for it.
 *
 * Reflection + authorship only — never asserts a value the user hasn't
 * confirmed. Self-mastery, plain language, never prescribed, never a score.
 * Copy is FIRST-PASS DRAFT; Arlin's voice to set.
 *
 * @param {function(): void} onExit — back to My Progress
 * @param {{value:string,lookLike:string,oneStep:string}|null} candidate
 */
export default function Values({ onExit, candidate = null }) {
  const [list, setList] = useState(() => getValues());
  const [authoring, setAuthoring] = useState(false);
  const [value, setValue] = useState("");
  const [look, setLook] = useState("");
  const [step, setStep] = useState("");
  const [cand, setCand] = useState(() => candidate || getPendingCandidate());

  const refresh = () => setList(getValues());
  const resetForm = () => { setValue(""); setLook(""); setStep(""); setAuthoring(false); };
  const canSave = value.trim() && look.trim() && step.trim();

  const saveOwn = () => {
    if (!canSave) return;
    addUserValue({ value, lookLike: look, oneStep: step });
    try { window.plausible?.("Value Named", { props: { source: "user" } }); } catch {}
    resetForm();
    refresh();
  };

  const confirmCand = () => {
    if (!cand) return;
    confirmValue({ ...cand, source: "ai" });
    try { window.plausible?.("Value Named", { props: { source: "ai-confirmed" } }); } catch {}
    clearPendingCandidate();
    setCand(null);
    refresh();
  };
  const editCand = () => {
    if (!cand) return;
    setValue(cand.value || ""); setLook(cand.lookLike || ""); setStep(cand.oneStep || "");
    setAuthoring(true);
    clearPendingCandidate();
    setCand(null);
  };
  const dismissCand = () => { if (cand) rejectCandidate(cand); clearPendingCandidate(); setCand(null); };

  const remove = (id) => { removeValue(id); refresh(); };

  const isEmpty = list.length === 0 && !authoring && !cand;

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      <EditorialBlock
        label="My Progress"
        headline="What you're moving toward"
        headlineSize="md"
        body="Strengths name what's strong now. This names the direction — the kind of person you're moving toward being, by your own choosing. A direction turns scattered effort into movement: when a step connects to something you actually hold, it carries its own motivation. So every one comes with a step. The choosing stays yours — nothing here is prescribed."
        rule
      />

      {/* AI-surfaced candidate (both: AI proposes, you decide) */}
      {cand && (
        <section style={cardStyle}>
          <MonoLabel size="xs" tone="faint" style={blockLabel}>Something Reframe noticed</MonoLabel>
          <p style={nameStyle}>{cand.value}</p>
          <LookStep look={cand.lookLike} step={cand.oneStep} />
          <p style={candAskStyle}>Is that one of yours?</p>
          <div style={rowStyle}>
            <button type="button" style={primaryBtn} onClick={confirmCand}>Yes, that's mine</button>
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
                <p style={nameStyle}>{v.value}</p>
                <button type="button" style={removeBtn} aria-label={`Remove ${v.value}`} onClick={() => remove(v.id)}>
                  remove
                </button>
              </div>
              <LookStep look={v.lookLike} step={v.oneStep} />
            </section>
          ))}
        </div>
      )}

      {/* Empty state — calm, with the invitation to name one */}
      {isEmpty && (
        <p style={{ ...bodyQuiet, marginTop: "var(--sf-space-24)" }}>
          Nothing named yet. When you're ready, name one — a direction you choose to move toward, what living it looks
          like, and one step you could take. Reframe may also surface one it hears in your words for you to confirm.
        </p>
      )}

      {/* Authoring flow (you name your own) */}
      {authoring ? (
        <section style={{ ...cardStyle, marginTop: "var(--sf-space-24)" }}>
          <MonoLabel size="xs" tone="faint" style={blockLabel}>Name one</MonoLabel>
          <Field label="What you're moving toward" value={value} onChange={setValue}
            placeholder="e.g. being someone people can count on" rows={1} />
          <Field label="What living it looks like" value={look} onChange={setLook}
            placeholder="how it shows in what you do" rows={2} />
          <Field label="One step toward it" value={step} onChange={setStep}
            placeholder="one concrete thing you could do this week" rows={2} />
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

function LookStep({ look, step }) {
  return (
    <div style={{ marginTop: "var(--sf-space-16)" }}>
      <div>
        <MonoLabel size="xs" tone="faint" style={edgeLabel}>What it looks like</MonoLabel>
        <p style={edgeBody}>{look}</p>
      </div>
      <div style={edgeHairline} />
      <div>
        <MonoLabel size="xs" tone="faint" style={edgeLabel}>One step</MonoLabel>
        <p style={edgeBody}>{step}</p>
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
