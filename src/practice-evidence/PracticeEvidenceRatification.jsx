// Practice Evidence Ratification Screen
// Arlin-only review UI for the 60 affect-labeling + 30 defusion stimuli drafted for Sprint 1.
// Phone-friendly: big buttons, one entry at a time, save state in localStorage, resume on reopen.
// Output: a JSON payload Arlin can copy and paste back so the validated set commits to stimuli.js.

import { useState } from "react";
import { AFFECT_LABELING_STIMULI, DEFUSION_THOUGHTS, CHIP_LABELS, CHIP_IDS } from "./stimuli";

const STORAGE_KEY = "stillform_stimuli_ratification";

function loadRatifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveRatifications(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function PracticeEvidenceRatification({ onClose }) {
  const allEntries = [
    ...AFFECT_LABELING_STIMULI.map(s => ({ ...s, _type: "affect" })),
    ...DEFUSION_THOUGHTS.map(s => ({ ...s, _type: "defusion" })),
  ];
  const total = allEntries.length;
  const affectCount = AFFECT_LABELING_STIMULI.length;

  const [ratifications, setRatifications] = useState(() => loadRatifications());
  const [index, setIndex] = useState(() => {
    // Resume at first unrated entry (defer counts as unrated for resume purposes)
    const rat = loadRatifications();
    const firstUnrated = allEntries.findIndex(e => !rat[e.id] || rat[e.id].status === "defer");
    return firstUnrated === -1 ? total : firstUnrated;
  });
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [changingChip, setChangingChip] = useState(false);
  const [newChip, setNewChip] = useState("");

  const setRating = (status, extra = {}) => {
    const current = allEntries[index];
    if (!current) return;
    const updated = { ...ratifications, [current.id]: { status, ...extra } };
    setRatifications(updated);
    saveRatifications(updated);
    setEditing(false);
    setChangingChip(false);
    setEditText("");
    setNewChip("");
    setIndex(idx => Math.min(idx + 1, total));
  };

  const goPrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setEditing(false);
      setChangingChip(false);
    }
  };

  const ratedCount = Object.values(ratifications).filter(r => r.status && r.status !== "defer").length;
  const progressPct = total > 0 ? Math.round((ratedCount / total) * 100) : 0;

  // Completion view
  if (index >= total) {
    const exportPayload = {
      ratifiedAt: new Date().toISOString(),
      rater: "arlin",
      counts: {
        total,
        rated: ratedCount,
        deferred: Object.values(ratifications).filter(r => r.status === "defer").length,
        kept: Object.values(ratifications).filter(r => r.status === "keep").length,
        edited: Object.values(ratifications).filter(r => r.status === "edit").length,
        chipChanged: Object.values(ratifications).filter(r => r.status === "chipChange").length,
        dropped: Object.values(ratifications).filter(r => r.status === "drop").length,
      },
      affectLabeling: AFFECT_LABELING_STIMULI
        .map(s => ({ id: s.id, ...(ratifications[s.id] || {}) }))
        .filter(r => r.status),
      defusion: DEFUSION_THOUGHTS
        .map(s => ({ id: s.id, ...(ratifications[s.id] || {}) }))
        .filter(r => r.status),
    };

    return (
      <section style={{ maxWidth: 480, margin: "0 auto", padding: "48px 24px" }}>
        <button className="intervention-back" onClick={onClose}>← Back to Settings</button>
        <h1 className="t-display-lg" style={{ marginBottom: 16, marginTop: 12 }}>Review complete</h1>
        <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
          {ratedCount} of {total} entries rated.<br />
          Keep: {exportPayload.counts.kept} · Edit: {exportPayload.counts.edited} · Chip change: {exportPayload.counts.chipChanged} · Drop: {exportPayload.counts.dropped} · Deferred: {exportPayload.counts.deferred}
        </div>

        <button
          onClick={() => {
            const json = JSON.stringify(exportPayload, null, 2);
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(json).then(
                () => alert("Copied to clipboard. Paste back to commit as the validated set."),
                () => alert("Clipboard blocked. Long-press the next screen to copy manually.")
              );
            } else {
              alert("Clipboard API unavailable. Long-press to copy manually.");
            }
          }}
          style={{
            width: "100%", padding: "16px", background: "var(--amber)", color: "var(--bg)",
            border: "none", borderRadius: "var(--r-lg)", fontSize: 15, fontWeight: 500,
            cursor: "pointer", marginBottom: 12
          }}
        >Copy ratification JSON</button>

        <details style={{ marginBottom: 16 }}>
          <summary style={{ fontSize: 12, color: "var(--text-muted)", cursor: "pointer", padding: "8px 0" }}>
            Show raw JSON (for manual copy if clipboard blocked)
          </summary>
          <pre style={{
            fontSize: 10, fontFamily: "'IBM Plex Mono', monospace",
            background: "var(--surface)", padding: 12, borderRadius: "var(--r-md)",
            overflow: "auto", maxHeight: 300, whiteSpace: "pre-wrap", wordBreak: "break-word",
            color: "var(--text)", border: "1px solid var(--border)"
          }}>
            {JSON.stringify(exportPayload, null, 2)}
          </pre>
        </details>

        <button
          onClick={() => setIndex(0)}
          style={{
            width: "100%", padding: "12px", background: "transparent", color: "var(--text)",
            border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 13,
            cursor: "pointer", marginBottom: 8
          }}
        >← Go back and review again</button>

        <button
          onClick={() => {
            if (window.confirm("Reset all ratifications? This can't be undone.")) {
              localStorage.removeItem(STORAGE_KEY);
              setRatifications({});
              setIndex(0);
            }
          }}
          style={{
            width: "100%", padding: "10px", background: "transparent", color: "var(--text-muted)",
            border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 12,
            cursor: "pointer"
          }}
        >Reset all ratifications</button>
      </section>
    );
  }

  const current = allEntries[index];
  const isAffect = current._type === "affect";
  const sectionLabel = isAffect
    ? `Affect Labeling · ${index + 1} of ${affectCount}`
    : `Defusion Thought · ${index + 1 - affectCount} of ${DEFUSION_THOUGHTS.length}`;
  const currentRating = ratifications[current.id];

  return (
    <section style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px" }}>
      <button className="intervention-back" onClick={onClose}>← Back to Settings</button>

      {/* Progress strip */}
      <div style={{ marginTop: 16, marginBottom: 18 }}>
        <div style={{
          fontSize: 10, fontFamily: "'IBM Plex Mono', monospace",
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "var(--text-muted)", marginBottom: 6
        }}>
          {sectionLabel} · {ratedCount}/{total} rated ({progressPct}%)
        </div>
        <div style={{ height: 3, background: "var(--surface)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progressPct}%`, background: "var(--amber)", transition: "width 0.2s" }} />
        </div>
      </div>

      {/* Entry card */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--r-lg)", padding: "20px 18px", marginBottom: 14
      }}>
        <div style={{
          fontSize: 10, fontFamily: "'IBM Plex Mono', monospace",
          letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 10
        }}>{current.id}</div>
        <div style={{
          fontSize: 16, color: "var(--text)", lineHeight: 1.5,
          fontStyle: "italic", marginBottom: 14
        }}>
          "{isAffect ? current.prompt : current.thought}"
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
          {isAffect ? (
            <>
              Primary: <strong style={{ color: "var(--amber)" }}>{CHIP_LABELS[current.primaryChip]}</strong>
              {current.secondaryChip && <> · Secondary: {CHIP_LABELS[current.secondaryChip]}</>}
              <br />Trigger: {current.trigger}
              {current.context && <> · Context: {current.context}</>}
            </>
          ) : (
            <>
              Distortion: {current.distortion}<br />
              Domain: {current.domain}
              {current.context && <> · Context: {current.context}</>}
            </>
          )}
        </div>
      </div>

      {/* Current rating indicator if previously rated */}
      {currentRating && currentRating.status && (
        <div style={{
          fontSize: 11, color: "var(--amber)", marginBottom: 12,
          textAlign: "center", padding: "6px 12px",
          background: "var(--amber-glow)", borderRadius: "var(--r-md)"
        }}>
          Previously rated: {currentRating.status}{currentRating.newChip ? ` → ${CHIP_LABELS[currentRating.newChip]}` : ""}
        </div>
      )}

      {/* Edit mode */}
      {editing && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Rewrite the {isAffect ? "scenario" : "thought"}:</div>
          <textarea
            value={editText}
            onChange={e => setEditText(e.target.value)}
            style={{
              width: "100%", minHeight: 80, padding: 12,
              background: "var(--surface)", border: "1px solid var(--amber-dim)",
              borderRadius: "var(--r-md)", color: "var(--text)",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginBottom: 8,
              boxSizing: "border-box", resize: "vertical"
            }}
          />
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setRating("edit", { newText: editText })}
              disabled={!editText.trim()}
              style={{
                flex: 1, padding: "12px",
                background: editText.trim() ? "var(--amber)" : "var(--surface)",
                color: editText.trim() ? "var(--bg)" : "var(--text-muted)",
                border: "none", borderRadius: "var(--r-md)",
                fontSize: 14, cursor: editText.trim() ? "pointer" : "default"
              }}
            >Save edit</button>
            <button
              onClick={() => { setEditing(false); setEditText(""); }}
              style={{
                padding: "12px 16px", background: "transparent", color: "var(--text-muted)",
                border: "1px solid var(--border)", borderRadius: "var(--r-md)",
                fontSize: 14, cursor: "pointer"
              }}
            >Cancel</button>
          </div>
        </div>
      )}

      {/* Chip change mode */}
      {changingChip && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>New primary chip:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {CHIP_IDS.map(cid => (
              <button
                key={cid}
                onClick={() => setNewChip(cid)}
                style={{
                  padding: "8px 12px",
                  background: newChip === cid ? "var(--amber-glow)" : "var(--surface)",
                  border: `1px solid ${newChip === cid ? "var(--amber)" : "var(--border)"}`,
                  borderRadius: 20, fontSize: 12,
                  color: newChip === cid ? "var(--amber)" : "var(--text)",
                  cursor: "pointer"
                }}
              >{CHIP_LABELS[cid]}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setRating("chipChange", { newChip })}
              disabled={!newChip || newChip === current.primaryChip}
              style={{
                flex: 1, padding: "12px",
                background: (newChip && newChip !== current.primaryChip) ? "var(--amber)" : "var(--surface)",
                color: (newChip && newChip !== current.primaryChip) ? "var(--bg)" : "var(--text-muted)",
                border: "none", borderRadius: "var(--r-md)",
                fontSize: 14,
                cursor: (newChip && newChip !== current.primaryChip) ? "pointer" : "default"
              }}
            >Save chip change</button>
            <button
              onClick={() => { setChangingChip(false); setNewChip(""); }}
              style={{
                padding: "12px 16px", background: "transparent", color: "var(--text-muted)",
                border: "1px solid var(--border)", borderRadius: "var(--r-md)",
                fontSize: 14, cursor: "pointer"
              }}
            >Cancel</button>
          </div>
        </div>
      )}

      {/* Primary action buttons (hidden during edit/chipChange) */}
      {!editing && !changingChip && (
        <>
          <button
            onClick={() => setRating("keep")}
            style={{
              width: "100%", padding: "18px", background: "var(--amber)", color: "var(--bg)",
              border: "none", borderRadius: "var(--r-lg)", fontSize: 16, fontWeight: 500,
              cursor: "pointer", marginBottom: 8
            }}
          >Keep as written</button>

          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <button
              onClick={() => { setEditText(isAffect ? current.prompt : current.thought); setEditing(true); }}
              style={{
                flex: 1, padding: "12px 8px", background: "var(--surface)", color: "var(--text)",
                border: "1px solid var(--border)", borderRadius: "var(--r-md)",
                fontSize: 12, cursor: "pointer"
              }}
            >Edit text</button>
            {isAffect && (
              <button
                onClick={() => { setNewChip(current.primaryChip); setChangingChip(true); }}
                style={{
                  flex: 1, padding: "12px 8px", background: "var(--surface)", color: "var(--text)",
                  border: "1px solid var(--border)", borderRadius: "var(--r-md)",
                  fontSize: 12, cursor: "pointer"
                }}
              >Change chip</button>
            )}
            <button
              onClick={() => setRating("defer")}
              style={{
                flex: 1, padding: "12px 8px", background: "var(--surface)", color: "var(--text-muted)",
                border: "1px solid var(--border)", borderRadius: "var(--r-md)",
                fontSize: 12, cursor: "pointer"
              }}
            >Defer</button>
          </div>

          <button
            onClick={() => setRating("drop")}
            style={{
              width: "100%", padding: "14px", background: "transparent", color: "var(--text-muted)",
              border: "1px solid var(--border)", borderRadius: "var(--r-lg)", fontSize: 14,
              cursor: "pointer"
            }}
          >Drop</button>
        </>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: 12 }}>
        <button
          onClick={goPrev}
          disabled={index === 0}
          style={{
            background: "none", border: "none",
            color: index === 0 ? "var(--text-muted)" : "var(--amber)",
            cursor: index === 0 ? "default" : "pointer", padding: 4
          }}
        >← Previous</button>
        <button
          onClick={() => setIndex(total)}
          style={{
            background: "none", border: "none", color: "var(--text-muted)",
            cursor: "pointer", padding: 4
          }}
        >Skip to summary →</button>
      </div>
    </section>
  );
}
