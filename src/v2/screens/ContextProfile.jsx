import React, { useState, useEffect } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import Button from "../components/Button.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import HairlineDivider from "../components/HairlineDivider.jsx";
import {
  getContextProfile,
  addContextEntry,
  updateContextEntry,
  deleteContextEntry,
} from "../lib/contextProfile.js";

/**
 * ContextProfile — diagnostic stack editor for ambient/ongoing conditions
 * the user has observed correlate with their state.
 *
 * Phase 5 sub-item #1 (locked May 17, 2026): CRUD UI only. Pattern of
 * AI-mediated additions + autodetection ship in later sub-items
 * (AI Mediation queue + two-layer pattern detection). This screen is
 * how the user manually names what they've already observed.
 *
 * GUARDRAILS (do not soften):
 *   - Copy orients the user to "name what you observe" — not "log
 *     your symptoms" or "track your food."
 *   - No category enum, no taxonomy. Freeform labels.
 *   - No prompts for medical / food / symptom data. Description is
 *     a freeform user note.
 *
 * @param {function(): void} onExit — called when user taps back to home
 */
export default function ContextProfile({ onExit }) {
  const [profile, setProfile] = useState(() => getContextProfile());
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Form state for both add and edit flows. Single set of fields reused
  // for both because the shape is identical (label + description).
  const [draftLabel, setDraftLabel] = useState("");
  const [draftDescription, setDraftDescription] = useState("");

  const refresh = () => setProfile(getContextProfile());

  // Reset form state when transitioning between modes
  useEffect(() => {
    if (!isAdding && !editingId) {
      setDraftLabel("");
      setDraftDescription("");
    }
  }, [isAdding, editingId]);

  const startAdd = () => {
    setEditingId(null);
    setConfirmDeleteId(null);
    setDraftLabel("");
    setDraftDescription("");
    setIsAdding(true);
  };

  const startEdit = (entry) => {
    setIsAdding(false);
    setConfirmDeleteId(null);
    setDraftLabel(entry.label);
    setDraftDescription(entry.description || "");
    setEditingId(entry.id);
  };

  const cancelForm = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = () => {
    const trimmed = draftLabel.trim();
    if (!trimmed) return;
    if (isAdding) {
      addContextEntry({ label: trimmed, description: draftDescription.trim() });
    } else if (editingId) {
      updateContextEntry(editingId, { label: trimmed, description: draftDescription.trim() });
    }
    setIsAdding(false);
    setEditingId(null);
    refresh();
  };

  const handleDelete = (id) => {
    deleteContextEntry(id);
    setConfirmDeleteId(null);
    refresh();
  };

  const formActive = isAdding || editingId !== null;

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      {/* Top back affordance — minimal, mono-faint, top left. The
          editor is not a destination the user came to with intention;
          it's a place they can leave easily. */}
      <button
        type="button"
        onClick={onExit}
        aria-label="Back to home"
        style={{
          background: "transparent",
          border: "none",
          color: "var(--sf-text-faint)",
          fontFamily: "var(--sf-font-mono)",
          fontSize: "11px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          cursor: "pointer",
          padding: "8px 0",
          marginBottom: "var(--sf-space-24)",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        ← back
      </button>

      <EditorialBlock
        label="Context"
        headline="Conditions you've named"
        headlineSize="md"
        body={
          <>
            Ambient conditions you've noticed correlate with how you feel — weather, hydration, hours since you last ate, the kind of conversation you just left. Stillform doesn't prescribe, doesn't track symptoms, doesn't ask what you ate. You name what you've observed; the system helps you see patterns over time.
          </>
        }
        rule
      />

      {/* Add affordance — when not in a form mode, shows a simple
          "+ Add a context" button. When in add mode, shows the inline
          form. Add and edit share the same form below. */}
      {!formActive && (
        <div style={{ marginBottom: "var(--sf-space-32)" }}>
          <Button variant="secondary" onClick={startAdd}>
            + Add a context
          </Button>
        </div>
      )}

      {/* Inline form for add OR edit. Single set of fields reused. */}
      {formActive && (
        <div
          style={{
            marginBottom: "var(--sf-space-32)",
            padding: "var(--sf-space-24)",
            border: "0.5px solid var(--sf-border-quiet)",
            borderRadius: "var(--sf-r-default)",
            background: "var(--sf-ground-elev)",
          }}
        >
          <MonoLabel size="xs" style={{ display: "block", marginBottom: "var(--sf-space-12)" }}>
            {isAdding ? "New context" : "Edit context"}
          </MonoLabel>

          <input
            type="text"
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
            placeholder="e.g., rainy days, after long calls, when I haven't eaten enough"
            aria-label="Context label"
            maxLength={120}
            style={{
              width: "100%",
              padding: "12px 14px",
              marginBottom: "var(--sf-space-12)",
              background: "var(--sf-ground-elev)",
              border: "0.5px solid var(--sf-border-quiet)",
              borderRadius: "var(--sf-r-default)",
              color: "var(--sf-text-primary)",
              fontFamily: "var(--sf-font-sans)",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <textarea
            value={draftDescription}
            onChange={(e) => setDraftDescription(e.target.value)}
            placeholder="Optional note. What have you noticed about this condition?"
            aria-label="Context description (optional)"
            maxLength={500}
            rows={3}
            style={{
              width: "100%",
              padding: "12px 14px",
              marginBottom: "var(--sf-space-16)",
              background: "var(--sf-ground-elev)",
              border: "0.5px solid var(--sf-border-quiet)",
              borderRadius: "var(--sf-r-default)",
              color: "var(--sf-text-primary)",
              fontFamily: "var(--sf-font-sans)",
              fontSize: "14px",
              outline: "none",
              resize: "vertical",
              minHeight: "60px",
              boxSizing: "border-box",
            }}
          />

          <div style={{ display: "flex", gap: "var(--sf-space-12)", alignItems: "center" }}>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              style={{
                opacity: draftLabel.trim() ? 1 : 0.4,
                pointerEvents: draftLabel.trim() ? "auto" : "none",
              }}
            >
              {isAdding ? "Add" : "Save"}
            </Button>
            <Button variant="ghost" size="sm" onClick={cancelForm}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* List of existing context entries. Empty state when none. */}
      {profile.contexts.length === 0 ? (
        <div
          style={{
            padding: "var(--sf-space-32) 0",
            textAlign: "center",
            color: "var(--sf-text-faint)",
            fontFamily: "var(--sf-font-serif)",
            fontStyle: "italic",
            fontSize: "15px",
            lineHeight: 1.5,
          }}
        >
          Nothing named yet.
          <br />
          Add the first observation when you're ready.
        </div>
      ) : (
        <div>
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
            Your contexts ({profile.contexts.length})
          </MonoLabel>

          {profile.contexts.map((entry) => (
            <ContextEntryRow
              key={entry.id}
              entry={entry}
              onEdit={() => startEdit(entry)}
              onDelete={() => setConfirmDeleteId(entry.id)}
              isConfirmingDelete={confirmDeleteId === entry.id}
              onConfirmDelete={() => handleDelete(entry.id)}
              onCancelDelete={() => setConfirmDeleteId(null)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

/**
 * ContextEntryRow — single row in the contexts list with edit + delete
 * affordances. Delete is two-step (tap → confirm) to avoid accidental
 * loss; matches the v2 "user is the operator" principle (no surprise
 * destructive actions).
 */
function ContextEntryRow({ entry, onEdit, onDelete, isConfirmingDelete, onConfirmDelete, onCancelDelete }) {
  return (
    <div
      style={{
        padding: "var(--sf-space-16) 0",
        borderBottom: "0.5px solid var(--sf-border-quiet)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--sf-font-serif)",
          fontSize: "18px",
          fontWeight: 400,
          color: "var(--sf-text-primary)",
          marginBottom: entry.description ? "var(--sf-space-4)" : "var(--sf-space-8)",
          lineHeight: 1.3,
        }}
      >
        {entry.label}
      </div>

      {entry.description && (
        <div
          style={{
            fontSize: "14px",
            color: "var(--sf-text-secondary)",
            marginBottom: "var(--sf-space-8)",
            lineHeight: 1.5,
          }}
        >
          {entry.description}
        </div>
      )}

      <div
        style={{
          fontFamily: "var(--sf-font-mono)",
          fontSize: "11px",
          letterSpacing: "0.12em",
          color: "var(--sf-text-faint)",
          marginBottom: "var(--sf-space-12)",
        }}
      >
        {formatEncounterCount(entry.encounterCount)} · {formatLastSeen(entry.lastSeen, entry.encounterCount)}
      </div>

      {isConfirmingDelete ? (
        <div style={{ display: "flex", gap: "var(--sf-space-12)", alignItems: "center" }}>
          <MonoLabel size="xs" tone="faint">Delete this?</MonoLabel>
          <Button variant="ghost" size="sm" onClick={onConfirmDelete}>
            Yes, delete
          </Button>
          <Button variant="ghost" size="sm" onClick={onCancelDelete}>
            Cancel
          </Button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "var(--sf-space-16)" }}>
          <button
            type="button"
            onClick={onEdit}
            style={textLinkStyle}
            aria-label={`Edit ${entry.label}`}
          >
            edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            style={textLinkStyle}
            aria-label={`Delete ${entry.label}`}
          >
            delete
          </button>
        </div>
      )}
    </div>
  );
}

const textLinkStyle = {
  background: "transparent",
  border: "none",
  color: "var(--sf-text-faint)",
  fontFamily: "var(--sf-font-mono)",
  fontSize: "11px",
  letterSpacing: "0.12em",
  textTransform: "lowercase",
  cursor: "pointer",
  padding: 0,
  WebkitTapHighlightColor: "transparent",
};

function formatEncounterCount(count) {
  const n = count || 0;
  if (n === 0) return "not yet encountered";
  if (n === 1) return "1 encounter";
  return `${n} encounters`;
}

function formatLastSeen(iso, encounterCount) {
  // If the user has never associated this context with a state observation,
  // lastSeen still has a value (it was set to createdAt at add time), but
  // showing "seen 5 minutes ago" for an entry the user JUST CREATED and
  // hasn't actually observed yet is misleading. Show the createdAt-vs-
  // lastSeen distinction via encounterCount: if 0, say "just added."
  if (!encounterCount || encounterCount === 0) return "just added";
  if (!iso) return "—";
  try {
    const then = new Date(iso).getTime();
    const now = Date.now();
    const diffMs = now - then;
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "seen just now";
    if (minutes < 60) return `seen ${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `seen ${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "seen yesterday";
    if (days < 30) return `seen ${days} days ago`;
    return `seen ${new Date(iso).toLocaleDateString()}`;
  } catch {
    return "—";
  }
}
