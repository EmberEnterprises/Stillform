import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import Button from "../components/Button.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import InfoModal from "../components/InfoModal.jsx";
import {
  getWatchListChips,
  addChipToWatchList,
  removeChipFromWatchList,
  isOnWatchList,
  patternConfidence,
} from "../lib/biasProfile.js";
import { BIAS_CHIP_TYPES, chipsByType } from "../lib/biasChips.js";

/**
 * BiasProfile — diagnostic stack editor for the pattern-work watch list.
 *
 * Phase 5 sub-item #4, build Step 2. Follows the TriggerProfile editor
 * pattern (back affordance to MyProgress, list with mono-faint metadata,
 * two-step remove confirm). KEY DIFFERENCE from TriggerProfile: the user
 * does NOT author labels — they browse the frozen catalog (biasChips.js,
 * 20 chips: 15 distortions + 5 metacognitive beliefs) and add fixed chips
 * to a watch list. So this is a browse-and-add screen, not a text form.
 *
 * The chip ⓘ shows the Stillform-voice definition (chip.info). The clinical
 * spine (chip.spine) is NOT shown to the user — it's AI-grounding only, per
 * the two-register rule. Watch-listed chips are flagged by the AI during
 * Reframe and tracked over time (encounterCount).
 *
 * @param {function(): void} onExit — back to MyProgress
 */
export default function BiasProfile({ onExit }) {
  const [watchList, setWatchList] = useState(() => getWatchListChips());
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);
  const [infoChip, setInfoChip] = useState(null); // chip whose ⓘ is open

  const refresh = () => setWatchList(getWatchListChips());

  const handleAdd = (chipId) => {
    addChipToWatchList({ chipId, source: "manual" });
    refresh();
  };

  const handleRemove = (chipId) => {
    removeChipFromWatchList(chipId);
    setConfirmRemoveId(null);
    refresh();
  };

  const TYPE_HEADERS = {
    distortion: "Cognitive distortions",
    metacognitive: "Beliefs about your thinking",
  };

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
        label="Bias Profile"
        headline="Pattern watch list"
        headlineSize="md"
        body={
          <>
            Patterns you've chosen to keep an eye on — the recurring shapes
            your thinking takes. When one is on your watch list, the Reframe AI
            watches for it and notes when it shows up, so over time you can see
            it loosen. Tap the ⓘ on any pattern to read what it is. Add what
            rings true; remove what doesn't.
          </>
        }
        rule
      />

      {/* ── Current watch list ── */}
      {watchList.length === 0 ? (
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
          Nothing on your watch list yet.
          <br />
          Add a pattern below when one rings true.
        </div>
      ) : (
        <div style={{ marginBottom: "var(--sf-space-32)" }}>
          <MonoLabel
            size="xs"
            tone="faint"
            style={{ display: "block", marginBottom: "var(--sf-space-16)" }}
          >
            Watching ({watchList.length})
          </MonoLabel>

          {watchList.map(({ chip, encounterCount, addedAt, lastSeen }) => (
            <WatchRow
              key={chip.id}
              chip={chip}
              encounterCount={encounterCount}
              addedAt={addedAt}
              lastSeen={lastSeen}
              onInfo={() => setInfoChip(chip)}
              isConfirmingRemove={confirmRemoveId === chip.id}
              onRemove={() => setConfirmRemoveId(chip.id)}
              onConfirmRemove={() => handleRemove(chip.id)}
              onCancelRemove={() => setConfirmRemoveId(null)}
            />
          ))}
        </div>
      )}

      {/* ── Catalog: browse + add, grouped by type ── */}
      <div style={{ marginTop: "var(--sf-space-32)" }}>
        <MonoLabel
          size="xs"
          style={{ display: "block", marginBottom: "var(--sf-space-16)" }}
        >
          Add a pattern
        </MonoLabel>

        {BIAS_CHIP_TYPES.map((type) => (
          <div key={type} style={{ marginBottom: "var(--sf-space-32)" }}>
            <MonoLabel
              size="xs"
              tone="faint"
              style={{ display: "block", marginBottom: "var(--sf-space-12)" }}
            >
              {TYPE_HEADERS[type] || type}
            </MonoLabel>

            {chipsByType(type).map((chip) => (
              <CatalogRow
                key={chip.id}
                chip={chip}
                onInfo={() => setInfoChip(chip)}
                onAdd={() => handleAdd(chip.id)}
                added={isOnWatchList(chip.id)}
              />
            ))}
          </div>
        ))}
      </div>

      <InfoModal
        open={!!infoChip}
        title={infoChip ? infoChip.label : ""}
        body={infoChip ? infoChip.info : ""}
        onClose={() => setInfoChip(null)}
      />
    </main>
  );
}

/**
 * WatchRow — a chip currently on the watch list. Serif label + ⓘ +
 * mono metadata (encounters / last seen) + two-step remove.
 */
function WatchRow({
  chip,
  encounterCount,
  addedAt,
  lastSeen,
  onInfo,
  isConfirmingRemove,
  onRemove,
  onConfirmRemove,
  onCancelRemove,
}) {
  // 5.11(d): provisional → emerging → confirmed, by how many distinct days the
  // AI has detected this pattern recurring. Reflect-not-score; accent only when
  // confirmed (recurring across sessions).
  const { tier } = patternConfidence({ encounterCount });
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
          gap: "var(--sf-space-8)",
          marginBottom: "var(--sf-space-8)",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--sf-font-serif)",
            fontSize: "18px",
            fontWeight: 400,
            color: "var(--sf-text-primary)",
            lineHeight: 1.3,
          }}
        >
          {chip.label}
        </span>
        <InfoDot onClick={onInfo} label={chip.label} />
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--sf-font-mono)",
            fontSize: "10px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color:
              tier === "confirmed"
                ? "var(--sf-accent, #B8862B)"
                : "var(--sf-text-faint)",
          }}
        >
          {tier === "confirmed" ? "Confirmed" : tier === "emerging" ? "Emerging" : "Provisional"}
        </span>
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
        {formatEncounterCount(encounterCount)} ·{" "}
        {formatSeen(lastSeen, addedAt, encounterCount)}
      </div>

      {isConfirmingRemove ? (
        <div style={{ display: "flex", gap: "var(--sf-space-12)", alignItems: "center" }}>
          <MonoLabel size="xs" tone="faint">Remove from watch list?</MonoLabel>
          <Button variant="ghost" size="sm" onClick={onConfirmRemove}>
            Yes, remove
          </Button>
          <Button variant="ghost" size="sm" onClick={onCancelRemove}>
            Cancel
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onRemove}
          style={textLinkStyle}
          aria-label={`Remove ${chip.label} from watch list`}
        >
          remove
        </button>
      )}
    </div>
  );
}

/**
 * CatalogRow — a browsable catalog chip. Serif label + ⓘ + add affordance.
 * Once on the watch list, shows a quiet "on watch list" state instead.
 */
function CatalogRow({ chip, onInfo, onAdd, added }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--sf-space-12)",
        padding: "var(--sf-space-12) 0",
        borderBottom: "0.5px solid var(--sf-border-quiet)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--sf-space-8)", flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: "var(--sf-font-serif)",
            fontSize: "16px",
            fontWeight: 400,
            color: added ? "var(--sf-text-faint)" : "var(--sf-text-primary)",
            lineHeight: 1.3,
          }}
        >
          {chip.label}
        </span>
        <InfoDot onClick={onInfo} label={chip.label} />
      </div>

      {added ? (
        <span
          style={{
            fontFamily: "var(--sf-font-mono)",
            fontSize: "10px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--sf-text-faint)",
            whiteSpace: "nowrap",
          }}
        >
          on watch list
        </span>
      ) : (
        <button
          type="button"
          onClick={onAdd}
          aria-label={`Add ${chip.label} to watch list`}
          style={{
            ...textLinkStyle,
            color: "var(--sf-accent, #B8862B)",
            whiteSpace: "nowrap",
          }}
        >
          + watch
        </button>
      )}
    </div>
  );
}

/** InfoDot — the quiet ⓘ affordance next to a chip label. */
function InfoDot({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`What is ${label}?`}
      style={{
        background: "transparent",
        border: "none",
        color: "var(--sf-text-faint)",
        fontSize: "13px",
        lineHeight: 1,
        cursor: "pointer",
        padding: "4px",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      ⓘ
    </button>
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
  if (n === 0) return "not yet seen";
  if (n === 1) return "seen once";
  return `seen ${n} times`;
}

function formatSeen(lastSeen, addedAt, encounterCount) {
  if (!encounterCount || encounterCount === 0) return "just added";
  const iso = lastSeen || addedAt;
  if (!iso) return "—";
  try {
    const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (minutes < 1) return "noted just now";
    if (minutes < 60) return `noted ${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `noted ${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "noted yesterday";
    if (days < 30) return `noted ${days} days ago`;
    return `noted ${new Date(iso).toLocaleDateString()}`;
  } catch {
    return "—";
  }
}
