import React, { useState, useRef, useEffect } from "react";
import EditorialBlock from "../../components/EditorialBlock.jsx";
import Button from "../../components/Button.jsx";
import MonoLabel from "../../components/MonoLabel.jsx";
import SpineBack from "../../components/SpineBack.jsx";
import InfoModal from "../../components/InfoModal.jsx";
import { getChipDefinition } from "../../lib/chipDefinitions.js";

/** InfoDot — the quiet ⓘ affordance next to a chip label. Matches the
 *  InstrumentRunner / BiasProfile treatment exactly; local copy per the
 *  existing pattern (DRY extraction is a flagged future cleanup). */
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
export default function Notice({ config, onContinue, onExit, initialText = null, isBase = false }) {
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

  const [text, setText] = useState(() => (typeof initialText === "string" ? initialText : ""));
  const [selectedChip, setSelectedChip] = useState(null);
  const [infoChip, setInfoChip] = useState(null);
  const [showChipGuide, setShowChipGuide] = useState(false);
  const [infoEntry, setInfoEntry] = useState(null); // "selfled" | "quickmove" | "reset" | null
  const textareaRef = useRef(null);
  const [listenLive, setListenLive] = useState(false);
  const idleRef = useRef(null);

  // Focus the textarea on mount — the practice starts when the user can write.
  useEffect(() => {
    if (textareaRef.current) {
      // Small delay so the fade-enter animation feels considered, not jumpy.
      const t = setTimeout(() => textareaRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, []);

  const canContinue = text.trim().length > 0;

  // Clean up the listening idle timer on unmount.
  useEffect(() => () => { if (idleRef.current) clearTimeout(idleRef.current); }, []);

  // Listening indicator: alive even at rest (the CSS rest-wave), ramps to
  // the energetic equalizer while the user is actively typing, then settles.
  const handleType = (e) => {
    setText(e.target.value);
    setListenLive(true);
    if (idleRef.current) clearTimeout(idleRef.current);
    idleRef.current = setTimeout(() => setListenLive(false), 900);
  };

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

  const handleQuickMove = () => {
    // Ungated on purpose: the quick move is the one path a user can take
    // before they've named anything — body first, then the thinking.
    // Whatever they've typed / selected so far is carried so "Keep going"
    // can resume the spine afterward.
    onContinue(text.trim(), selectedChip, { quickMove: true });
  };

  const handleReset = () => {
    // Ungated, same as quick move: the urge-surf is for the acute pull
    // (scroll / check / scratch / send it) — a moment you reach for before
    // anything is named. The Support Sheet's second tool (Phase 6.3).
    onContinue(text.trim(), selectedChip, { reset: true });
  };

  return (
    <main className="sf-page sf-page--hero">
      {!isBase ? <SpineBack onBack={onExit} /> : null}
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
        className="sf-fade-enter sf-fade-enter--delay-1 sf-naming-field"
        style={{ marginTop: "var(--sf-space-48)" }}
      >
        <textarea
          ref={textareaRef}
          className="sf-textarea"
          value={text}
          onChange={handleType}
          placeholder={placeholder}
          rows={2}
          aria-label="Name what is present"
        />
        <div className={`sf-listening${listenLive ? " is-live" : ""}`} aria-hidden="true">
          <span className="sf-listening-bars"><i /><i /><i /><i /><i /></span>
          <span className="sf-listening-word">
            {listenLive ? "Hearing you" : text.trim() ? "Got it" : "Listening"}
          </span>
        </div>
      </div>

      {chips.length > 0 ? (
        <div
          className="sf-fade-enter sf-fade-enter--delay-2"
          style={{ marginTop: "var(--sf-space-32)" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "2px", marginBottom: "var(--sf-space-12)" }}>
            <MonoLabel size="xs" tone="faint" style={{ display: "block" }}>
              Start here if you're stuck
            </MonoLabel>
            <InfoDot onClick={() => setShowChipGuide(true)} label="these states" />
          </div>
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

      <InfoModal
        open={!!infoChip}
        title={infoChip?.label}
        body={infoChip ? getChipDefinition(infoChip.id) : ""}
        onClose={() => setInfoChip(null)}
      />

      <InfoModal
        open={showChipGuide}
        title="These states"
        body={
          "Each is a starting point, not a box. Tap the one that fits, or name your own above.\n\n" +
          chips
            .map((chip) => `${chip.label} — ${getChipDefinition(chip.id)}`)
            .join("\n\n")
        }
        onClose={() => setShowChipGuide(false)}
      />

      <InfoModal
        open={!!infoEntry}
        title={
          infoEntry === "selfled" ? "Self-led" :
          infoEntry === "quickmove" ? "Quick move" :
          infoEntry === "reset" ? "Reset an urge" : ""
        }
        body={
          infoEntry === "selfled"
            ? "The same practice, but you write the reframe yourself — no AI. For when you'd rather work it through in your own words, in silence."
            : infoEntry === "quickmove"
            ? "A roughly 60-second body reset for the moments you can't think yet. Body first, before words — then you can come back and name what's present."
            : infoEntry === "reset"
            ? "For an acute urge or compulsion pull. Name the pull, watch it for about 20 seconds without acting, then decide. The wave crests and passes — you don't have to act on it."
            : ""
        }
        onClose={() => setInfoEntry(null)}
      />

      <div
        className="sf-fade-enter sf-fade-enter--delay-3"
        style={{
          marginTop: "var(--sf-space-48)",
          display: "flex",
          alignItems: "baseline",
          gap: "var(--sf-space-24)",
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
        {!isBase ? (
          <button
            type="button"
            onClick={onExit}
            style={{
              background: "transparent",
              border: "none",
              padding: "15px 0",
              cursor: "pointer",
              fontFamily: "var(--sf-font-serif)",
              fontSize: "19px",
              fontWeight: 460,
              lineHeight: 1,
              letterSpacing: "0.01em",
              color: "var(--sf-text-faint)",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            Back
          </button>
        ) : null}
      </div>

      {/* Other ways in — the drawn modes row (v7). Self-led is gated on a
          name (handleSelfLed); quick move + reset are ungated. */}
      <div
        className="sf-fade-enter sf-fade-enter--delay-3"
        style={{ marginTop: "var(--sf-space-32)" }}
      >
        <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-12)" }}>
          Other ways in
        </MonoLabel>
        <div className="sf-modes">
          <div className="sf-mode">
            <button
              type="button"
              className="sf-mode-btn"
              onClick={handleSelfLed}
              disabled={!canContinue}
              aria-disabled={!canContinue}
            >
              <span className="sf-mode-glyph" aria-hidden="true">○</span>
              <span className="sf-mode-label">Self-led</span>
            </button>
            <span className="sf-mode-info"><InfoDot onClick={() => setInfoEntry("selfled")} label="self-led" /></span>
          </div>
          <div className="sf-mode">
            <button type="button" className="sf-mode-btn" onClick={handleQuickMove}>
              <span className="sf-mode-glyph" aria-hidden="true">↗</span>
              <span className="sf-mode-label">Quick move</span>
            </button>
            <span className="sf-mode-info"><InfoDot onClick={() => setInfoEntry("quickmove")} label="quick move" /></span>
          </div>
          <div className="sf-mode">
            <button type="button" className="sf-mode-btn" onClick={handleReset}>
              <span className="sf-mode-glyph" aria-hidden="true">↺</span>
              <span className="sf-mode-label">Reset urge</span>
            </button>
            <span className="sf-mode-info"><InfoDot onClick={() => setInfoEntry("reset")} label="reset an urge" /></span>
          </div>
        </div>
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
