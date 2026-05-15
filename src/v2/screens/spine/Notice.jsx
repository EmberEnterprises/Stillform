import React, { useState, useRef, useEffect } from "react";
import EditorialBlock from "../../components/EditorialBlock.jsx";
import Button from "../../components/Button.jsx";
import MonoLabel from "../../components/MonoLabel.jsx";

/**
 * Notice — the first step of the spine.
 *
 * Per STILLFORM_CANON.md §7: "name what's present." Per the framing law,
 * the practice IS analytical naming — building rich, specific mental
 * representations. So the surface treats free-text precision as the
 * primary action and small chips as scaffolding for users who freeze.
 *
 * This explicitly fixes the surface critique Arlin gave the v1 Notice
 * screen (May 15, 2026):
 *   - No "EACH SPECIFIC NAME IS A CONCEPT BUILT" meta-talk (it described
 *     the practice instead of being it)
 *   - No "STEP 1 OF 2" form-transaction framing
 *   - Free-text precision is the primary action, not buried as a
 *     "+ SAY IT MORE PRECISELY" afterthought
 *   - Chips are scaffolding (insertable starting points), not the focal
 *     interaction. Tapping a chip puts that word in the textarea so the
 *     user can extend it into something specific.
 *
 * @param {function(string, string|null): void} onContinue
 *   Called with (precisionName, selectedChip|null) when user advances.
 * @param {function(): void} onExit  Called when user exits the spine.
 */
export default function Notice({ onContinue, onExit }) {
  const [text, setText] = useState("");
  const [selectedChip, setSelectedChip] = useState(null);
  const textareaRef = useRef(null);

  // Focus the textarea on mount — the practice starts when the user can write.
  useEffect(() => {
    if (textareaRef.current) {
      // Small delay so the fade-enter animation feels considered, not jumpy.
      const t = setTimeout(() => textareaRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, []);

  const canContinue = text.trim().length > 0;

  const handleChipTap = (chipId, chipLabel) => {
    // The chip becomes a starting point in the user's writing — they can
    // extend it into something specific. This is the concept-building
    // behavior: chip is scaffolding, the user's full text is the practice.
    if (selectedChip === chipId) {
      // Tapping the same chip again unselects + leaves text alone.
      setSelectedChip(null);
      return;
    }

    setSelectedChip(chipId);
    // If the textarea is empty (or only contains a prior chip word),
    // replace contents with the new chip word as a starting point.
    const isTextEmpty = text.trim().length === 0;
    const isOnlyPriorChipWord =
      SCAFFOLDING_CHIPS.some((c) => text.trim().toLowerCase() === c.label.toLowerCase());
    if (isTextEmpty || isOnlyPriorChipWord) {
      setText(chipLabel + " — ");
      // Re-focus + move cursor to end so the user keeps writing immediately.
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const len = (chipLabel + " — ").length;
          textareaRef.current.setSelectionRange(len, len);
        }
      }, 0);
    }
    // If the user has already written something substantive, don't
    // clobber their text — the chip selection is just routing signal.
  };

  const handleContinue = () => {
    if (!canContinue) return;
    onContinue(text.trim(), selectedChip);
  };

  return (
    <main className="sf-page sf-page--hero">
      <div className="sf-fade-enter">
        <EditorialBlock
          label="Notice"
          headline="Name what's present."
          headlineSize="lg"
          body="As precisely as you can."
        />
      </div>

      <div
        className="sf-fade-enter sf-fade-enter--delay-1"
        style={{ marginTop: "var(--sf-space-48)" }}
      >
        <textarea
          ref={textareaRef}
          className="sf-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Specifics — what it feels like, where, when, what triggered it…"
          rows={4}
          aria-label="Name what is present"
        />
      </div>

      <div
        className="sf-fade-enter sf-fade-enter--delay-2"
        style={{ marginTop: "var(--sf-space-32)" }}
      >
        <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-12)" }}>
          Start here if you're stuck
        </MonoLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sf-space-8)" }}>
          {SCAFFOLDING_CHIPS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className="sf-chip"
              aria-selected={selectedChip === chip.id ? "true" : "false"}
              onClick={() => handleChipTap(chip.id, chip.label)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="sf-fade-enter sf-fade-enter--delay-3"
        style={{
          marginTop: "var(--sf-space-48)",
          display: "flex",
          alignItems: "center",
          gap: "var(--sf-space-16)",
        }}
      >
        <Button
          variant="primary"
          onClick={handleContinue}
          disabled={!canContinue}
          aria-disabled={!canContinue}
        >
          Continue
        </Button>
        <Button variant="ghost" onClick={onExit}>
          Back
        </Button>
      </div>
    </main>
  );
}

/* -----------------------------------------------------------------------
 * SCAFFOLDING CHIPS — starting points for users who freeze.
 *
 * These are NOT the primary action. They appear below the textarea, in
 * smaller faint mono treatment, with a label that says "start here if
 * you're stuck." Tapping a chip seeds the textarea with the chip word
 * so the user can extend it into something specific.
 *
 * Selecting a chip also passes a feel-state hint to the backend for
 * client-side AI mode routing (excited/focused → hype, stuck → clarity,
 * everything else → calm — per canon §7 and reframeApi.js routeMode).
 * -------------------------------------------------------------------- */
const SCAFFOLDING_CHIPS = [
  { id: "excited",  label: "Excited" },
  { id: "focused",  label: "Focused" },
  { id: "settled",  label: "Settled" },
  { id: "anxious",  label: "Anxious" },
  { id: "angry",    label: "Angry" },
  { id: "stuck",    label: "Stuck" },
  { id: "mixed",    label: "Mixed" },
  { id: "flat",     label: "Flat" },
  { id: "distant",  label: "Distant" },
  { id: "unsure",   label: "Unsure" },
];
