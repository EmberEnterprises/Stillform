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
 * This explicitly fixes the surface critique Arlin gave the earlier Notice
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
 * Phase 4 #2 (locked May 16, 2026): Notice now accepts an optional
 * `config` prop (from beatConfig.getBeatConfig(beat)). When provided,
 * headline / body / placeholder / chips render from the config's notice
 * section, letting morning ("Anchor today.") and EOD ("Close the day.")
 * variants drive their own copy + chip subsets without forking this
 * component. When config is omitted, Notice falls back to the main-beat
 * defaults — backward-compatible with any caller that hasn't been
 * updated yet.
 *
 * Wind-down does NOT use this component — wind-down's minimal shape
 * has its own WindDown.jsx screen (Phase 4 #5).
 *
 * @param {object} [config]  optional beatConfig object. If present,
 *   uses config.notice.{headline, body, placeholder, chips}.
 * @param {function(string, string|null, object?): void} onContinue
 *   Called with (precisionName, selectedChip|null, opts?) when user
 *   advances. opts.selfMode === true if user picked self-led path.
 * @param {function(): void} onExit  Called when user exits the spine.
 */
export default function Notice({ config, onContinue, onExit }) {
  // Resolve render values from config when present; fall back to main-
  // beat defaults otherwise. Backward-compatible — existing callers that
  // don't pass config get the same surface they always did.
  const headline = config?.notice?.headline ?? "Name what's present.";
  // Body is intentionally allowed to be null (suppresses the secondary
  // line) — wind-down doesn't use this component, but morning's body
  // ("Name what today needs from you.") and main's ("As precisely as
  // you can.") both render. Use ?? so null in config is respected, not
  // treated as missing.
  const body = config?.notice?.body !== undefined
    ? config.notice.body
    : "As precisely as you can.";
  const placeholder = config?.notice?.placeholder ??
    "Specifics — what it feels like, where, when, what triggered it…";
  // Per-beat chip subset, or the full default if no config.
  const chips = config?.notice?.chips ?? DEFAULT_SCAFFOLDING_CHIPS;

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
    // If the textarea is empty (or only contains a prior chip word from
    // the CURRENT beat's chip set), replace contents with the new chip
    // word as a starting point.
    const isTextEmpty = text.trim().length === 0;
    const isOnlyPriorChipWord =
      chips.some((c) => text.trim().toLowerCase() === c.label.toLowerCase());
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

  const handleSelfLed = () => {
    if (!canContinue) return;
    onContinue(text.trim(), selectedChip, { selfMode: true });
  };

  return (
    <main className="sf-page sf-page--hero">
      <div className="sf-fade-enter">
        <EditorialBlock
          label="Notice"
          headline={headline}
          headlineSize="lg"
          body={body}
          labelInfoTitle="Notice"
          labelInfoBody="Naming precisely is the practice. A vague feeling is a starting point; a specific name is built mental real estate. The brain encodes what gets named in detail. Granular naming compounds over time into a sharper cognitive vocabulary. Hoemann 2021, Barrett 2017 (constructed emotion theory)."
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
          placeholder={placeholder}
          rows={4}
          aria-label="Name what is present"
        />
      </div>

      {chips.length > 0 ? (
        <div
          className="sf-fade-enter sf-fade-enter--delay-2"
          style={{ marginTop: "var(--sf-space-32)" }}
        >
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-12)" }}>
            Start here if you're stuck
          </MonoLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sf-space-8)" }}>
            {chips.map((chip) => (
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
      ) : null}

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

      {/* Self-led link — quiet, opt-in path that routes through SelfReframe
          instead of the AI Reframe. Same practice, you write it yourself.
          Tucked below the primary action so it doesn't compete; visible
          enough that users who prefer silence can find it without hunting. */}
      <div
        className="sf-fade-enter sf-fade-enter--delay-3"
        style={{ marginTop: "var(--sf-space-24)" }}
      >
        <button
          type="button"
          onClick={handleSelfLed}
          disabled={!canContinue}
          aria-disabled={!canContinue}
          className="sf-link-quiet"
        >
          Or self-led ›
        </button>
      </div>
    </main>
  );
}

/* -----------------------------------------------------------------------
 * DEFAULT_SCAFFOLDING_CHIPS — main-beat chip set when no variant config
 * is passed (backward compatibility for callers that haven't been
 * updated). Should stay in sync with beatConfig.js's main config.
 *
 * Tapping a chip seeds the textarea with the chip word so the user can
 * extend it into something specific. Selecting a chip also passes a
 * feel-state hint to the backend for AI mode routing (excited/focused
 * → hype, stuck → clarity, everything else → calm — per canon §7 and
 * reframeApi.js routeMode).
 * -------------------------------------------------------------------- */
const DEFAULT_SCAFFOLDING_CHIPS = [
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
