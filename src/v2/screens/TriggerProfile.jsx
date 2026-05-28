import React, { useState, useEffect } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import Button from "../components/Button.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import {
  getTriggerProfile,
  addTrigger,
  updateTrigger,
  deleteTrigger,
  TRIGGER_PROFILE_CATEGORIES,
} from "../lib/triggerProfile.js";

/**
 * TriggerProfile — diagnostic stack editor for external/situational
 * provocations the user has named as consistently hitting hard.
 *
 * Phase 5 sub-item #3 (locked May 17, 2026). Follows the ContextProfile
 * architectural pattern (inline add/edit form, two-step delete confirm,
 * list with mono-faint metadata, back affordance to MyProgress). KEY
 * DIFFERENCES from ContextProfile:
 *   - No description field (triggers are short labels by design)
 *   - Category selector chip group (7 frozen categories)
 *   - Header copy distinguishes triggers from contexts
 *
 * @param {function(): void} onExit — back to MyProgress
 */
export default function TriggerProfile({ onExit }) {
  const [profile, setProfile] = useState(() => getTriggerProfile());
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Form state — single set of fields reused for add + edit.
  const [draftLabel, setDraftLabel] = useState("");
  const [draftCategory, setDraftCategory] = useState("other");

  const refresh = () => setProfile(getTriggerProfile());

  useEffect(() => {
    if (!isAdding && !editingId) {
      setDraftLabel("");
      setDraftCategory("other");
    }
  }, [isAdding, editingId]);

  const startAdd = () => {
    setEditingId(null);
    setConfirmDeleteId(null);
    setDraftLabel("");
    setDraftCategory("other");
    setIsAdding(true);
  };

  const startEdit = (entry) => {
    setIsAdding(false);
    setConfirmDeleteId(null);
    setDraftLabel(entry.label);
    setDraftCategory(entry.category || "other");
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
      addTrigger({ label: trimmed, category: draftCategory });
    } else if (editingId) {
      updateTrigger(editingId, { label: trimmed, category: draftCategory });
    }
    setIsAdding(false);
    setEditingId(null);
    refresh();
  };

  const handleDelete = (id) => {
    deleteTrigger(id);
    setConfirmDeleteId(null);
    refresh();
  };

  const formActive = isAdding || editingId !== null;

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button
        type="button"
        onClick={onExit}
        aria-label="Back to My Progress"
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
        label="Triggers"
        headline="Recurring triggers"
        headlineSize="md"
        body={
          <>
            Specific external situations you've noticed consistently hit harder than expected — performance reviews, hard conversations, certain people. Different from contexts: contexts are conditions you're in; triggers are events that happen to you. Categories help the system surface patterns across your stack over time.
          </>
        }
        rule
      />

      {!formActive && (
        <div style={{ marginBottom: "var(--sf-space-32)" }}>
          <Button variant="secondary" onClick={startAdd}>
            + Add a trigger
          </Button>
        </div>
      )}

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
            {isAdding ? "New trigger" : "Edit trigger"}
          </MonoLabel>

          <input
            type="text"
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
            placeholder="e.g., performance review, family dinner, deadline crunch"
            aria-label="Trigger label"
            maxLength={120}
            style={{
              width: "100%",
              padding: "12px 14px",
              marginBottom: "var(--sf-space-16)",
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

          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-8)" }}>
            Category
          </MonoLabel>

          <CategoryChipGroup
            value={draftCategory}
            onChange={setDraftCategory}
          />

          <div style={{ display: "flex", gap: "var(--sf-space-12)", alignItems: "center", marginTop: "var(--sf-space-16)" }}>
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

      {profile.triggers.length === 0 ? (
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
          Add the first one when you notice it.
        </div>
      ) : (
        <div>
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
            Your triggers ({profile.triggers.length})
          </MonoLabel>

          {profile.triggers.map((entry) => (
            <TriggerEntryRow
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
 * CategoryChipGroup — wrap-friendly radio-group of category chips.
 * Selected chip uses the accent border treatment; unselected are
 * mono-quiet. Exactly one is selected at all times.
 */
function CategoryChipGroup({ value, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Trigger category"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--sf-space-8)",
      }}
    >
      {TRIGGER_PROFILE_CATEGORIES.map((cat) => {
        const selected = cat === value;
        return (
          <button
            key={cat}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(cat)}
            style={{
              padding: "8px 14px",
              background: selected ? "var(--sf-ground-elev)" : "transparent",
              border: selected
                ? "0.5px solid var(--sf-accent-line, rgba(184, 134, 43, 0.45))"
                : "0.5px solid var(--sf-border-quiet)",
              borderRadius: "var(--sf-r-default)",
              cursor: "pointer",
              fontFamily: "var(--sf-font-mono)",
              fontSize: "11px",
              letterSpacing: "0.12em",
              color: selected ? "var(--sf-accent, #B8862B)" : "var(--sf-text-secondary)",
              WebkitTapHighlightColor: "transparent",
              transition: "color var(--sf-motion-quick) var(--sf-ease-prestige), border-color var(--sf-motion-quick) var(--sf-ease-prestige)",
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

/**
 * TriggerEntryRow — single row in the triggers list. Edit + delete
 * affordances. Two-step delete confirm.
 */
function TriggerEntryRow({ entry, onEdit, onDelete, isConfirmingDelete, onConfirmDelete, onCancelDelete }) {
  return (
    <div
      style={{
        padding: "var(--sf-space-16) 0",
        borderBottom: "0.5px solid var(--sf-border-quiet)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "var(--sf-space-12)",
          marginBottom: "var(--sf-space-8)",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontFamily: "var(--sf-font-serif)",
            fontSize: "18px",
            fontWeight: 400,
            color: "var(--sf-text-primary)",
            lineHeight: 1.3,
          }}
        >
          {entry.label}
        </div>
        <div
          style={{
            fontFamily: "var(--sf-font-mono)",
            fontSize: "10px",
            letterSpacing: "0.12em",
            color: "var(--sf-text-faint)",
            textTransform: "uppercase",
          }}
        >
          {entry.category || "other"}
        </div>
      </div>

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
  if (!encounterCount || encounterCount === 0) return "just added";
  if (!iso) return "—";
  try {
    const then = new Date(iso).getTime();
    const now = Date.now();
    const diffMs = now - then;
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "fired just now";
    if (minutes < 60) return `fired ${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `fired ${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "fired yesterday";
    if (days < 30) return `fired ${days} days ago`;
    return `fired ${new Date(iso).toLocaleDateString()}`;
  } catch {
    return "—";
  }
}
