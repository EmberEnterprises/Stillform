import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import Button from "../components/Button.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import InfoModal from "../components/InfoModal.jsx";
import { addChipToWatchList, isOnWatchList } from "../lib/biasProfile.js";
import { getChipById } from "../lib/biasChips.js";

/**
 * InstrumentRunner — the generic Workshop take-flow runner.
 *
 * Phase 5 sub-item #4, build Step 5b. One screen drives ANY instrument:
 * it reads the instrument definition (the contract cdquest.js defines),
 * renders its items per `responseModel`, collects responses, calls the
 * instrument's pure `scoreFn`, and presents the result in the frame that
 * matches the instrument's `surface`.
 *
 * Reuse seams (so later instruments don't need a new runner):
 *   - renderItem() dispatches on instrument.responseModel. Only the
 *     "two-part-freq-grip" model (CD-Quest) is built now; an unknown model
 *     throws loudly rather than rendering a broken/empty take.
 *   - the result view dispatches on instrument.surface. Only the
 *     "pattern-work" dysfunction-pattern frame is built now (the surface
 *     CD-Quest feeds); capacities/profile frames are added when their
 *     first instruments build (Step 5 continues).
 *
 * Framing law (USER TREATMENT / CANON §10) governs the result copy:
 * no scores, no prevalence framing, honesty paired with acceptance,
 * every result carries a path forward. The grip ("intensity") reading is
 * USED (it orders proposals strongest-first inside scoreFn) but never shown
 * back as a number or severity label — see the CD-Quest spec §5.
 *
 * The lived-experience guard (CD-Quest spec §3) is load-bearing: an accurate
 * read of a real harm is NEVER a distortion. Every proposed chip carries a
 * one-tap "this was real, not a pattern" path that removes it from the
 * distortion read and adds nothing. The user is the authority.
 *
 * @param {object}   instrument  the frozen instrument definition (e.g. CDQUEST)
 * @param {function} scoreFn     the instrument's pure score(responses) fn
 * @param {function} onExit      back to the launching surface (Workshop / MyProgress)
 */
export default function InstrumentRunner({ instrument, scoreFn, onExit }) {
  const [phase, setPhase] = useState("intro"); // intro | items | result
  const [itemIndex, setItemIndex] = useState(0);
  const [responses, setResponses] = useState({}); // itemId -> { frequency, intensity }
  const [result, setResult] = useState(null);
  const [infoChip, setInfoChip] = useState(null); // chip whose ⓘ is open
  const [tick, setTick] = useState(0); // force re-read of watch-list "added" state
  const [livedExperience, setLivedExperience] = useState(() => new Set()); // chipIds taken out of the read

  const fire = (event, props) => {
    try {
      window.plausible?.(event, props ? { props } : undefined);
    } catch {
      /* telemetry never blocks the flow */
    }
  };

  // ── intro ──────────────────────────────────────────────────────────────
  const begin = () => {
    fire("Workshop Instrument Started", { instrument: instrument.id });
    setPhase("items");
  };

  // ── items ──────────────────────────────────────────────────────────────
  const setResponse = (itemId, patch) =>
    setResponses((prev) => ({ ...prev, [itemId]: { ...prev[itemId], ...patch } }));

  const goNext = () => {
    if (itemIndex < instrument.items.length - 1) {
      setItemIndex((i) => i + 1);
    } else {
      const scored = scoreFn(responses);
      setResult(scored);
      fire("Workshop Instrument Completed", {
        instrument: instrument.id,
        endorsed: scored.proposedChips.length,
      });
      setPhase("result");
    }
  };

  const goBack = () => setItemIndex((i) => Math.max(0, i - 1));

  // ── result actions ───────────────────────────────────────────────────────
  const addChip = (chipId) => {
    addChipToWatchList({ chipId, source: "workshop" });
    fire("Workshop Chip Added", { instrument: instrument.id, chip: chipId });
    setTick((t) => t + 1);
  };

  const markLivedExperience = (chipId) => {
    setLivedExperience((prev) => {
      const next = new Set(prev);
      next.add(chipId);
      return next;
    });
    fire("Lived Experience Marked", { instrument: instrument.id, chip: chipId });
  };

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button
        type="button"
        onClick={onExit}
        aria-label="Leave"
        style={backStyle}
      >
        ← back
      </button>

      {phase === "intro" && (
        <>
          <EditorialBlock
            label="Workshop"
            headline={instrument.name}
            headlineSize="md"
            body={instrument.intro}
            rule
          />
          <div style={{ marginTop: "var(--sf-space-32)" }}>
            <Button variant="primary" fullWidth onClick={begin}>
              Begin
            </Button>
          </div>
        </>
      )}

      {phase === "items" && (
        <ItemStep
          instrument={instrument}
          index={itemIndex}
          response={responses[instrument.items[itemIndex].id] || {}}
          onSetResponse={(patch) => setResponse(instrument.items[itemIndex].id, patch)}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {phase === "result" && result && (
        <ResultView
          instrument={instrument}
          result={result}
          livedExperience={livedExperience}
          onInfo={setInfoChip}
          onAdd={addChip}
          onMarkLived={markLivedExperience}
          onDone={onExit}
        />
      )}

      <InfoModal
        open={!!infoChip}
        title={infoChip ? infoChip.label : ""}
        body={infoChip ? infoChip.info : ""}
        onClose={() => setInfoChip(null)}
      />
    </main>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* ITEM STEP — dispatches on responseModel                                    */
/* ───────────────────────────────────────────────────────────────────────── */

function ItemStep({ instrument, index, response, onSetResponse, onNext, onBack }) {
  const item = instrument.items[index];
  const total = instrument.items.length;

  // Reuse seam: only the two-part frequency×grip model is built. A future
  // instrument with a different model should fail loud here, not silently
  // render an empty step.
  if (instrument.responseModel !== "two-part-freq-grip") {
    throw new Error(
      `InstrumentRunner: unsupported responseModel "${instrument.responseModel}"`
    );
  }

  const freq = response.frequency;
  const grip = response.intensity;
  const freqChosen = freq != null;
  const needsGrip = freqChosen && freq > 0;
  const canAdvance = freq === 0 || (needsGrip && grip != null);

  return (
    <>
      <MonoLabel
        size="xs"
        tone="faint"
        style={{ display: "block", marginBottom: "var(--sf-space-24)" }}
      >
        {index + 1} / {total}
      </MonoLabel>

      <p
        style={{
          fontFamily: "var(--sf-font-serif)",
          fontSize: "20px",
          lineHeight: 1.45,
          color: "var(--sf-text-primary)",
          margin: "0 0 var(--sf-space-32)",
        }}
      >
        {item.text}
      </p>

      {/* Q1 — frequency */}
      <MonoLabel
        size="xs"
        style={{ display: "block", marginBottom: "var(--sf-space-12)" }}
      >
        {instrument.frequency.prompt}
      </MonoLabel>
      <div style={{ marginBottom: needsGrip ? "var(--sf-space-32)" : "var(--sf-space-24)" }}>
        {instrument.frequency.options.map((opt) => (
          <OptionButton
            key={opt.value}
            label={opt.label}
            selected={freq === opt.value}
            onClick={() =>
              onSetResponse(
                opt.value === 0
                  ? { frequency: 0, intensity: null } // "Didn't" clears any grip
                  : { frequency: opt.value }
              )
            }
          />
        ))}
      </div>

      {/* Q2 — grip, only when it actually showed up */}
      {needsGrip && (
        <>
          <MonoLabel
            size="xs"
            style={{ display: "block", marginBottom: "var(--sf-space-12)" }}
          >
            {instrument.intensity.prompt}
          </MonoLabel>
          <div style={{ marginBottom: "var(--sf-space-24)" }}>
            {instrument.intensity.options.map((opt) => (
              <OptionButton
                key={opt.value}
                label={opt.label}
                selected={grip === opt.value}
                onClick={() => onSetResponse({ intensity: opt.value })}
              />
            ))}
          </div>
        </>
      )}

      {/* Footer — Back / Next */}
      <div
        style={{
          display: "flex",
          gap: "var(--sf-space-12)",
          alignItems: "center",
          marginTop: "var(--sf-space-16)",
        }}
      >
        {index > 0 && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            Back
          </Button>
        )}
        <div style={{ flex: 1 }} />
        <Button variant="primary" onClick={onNext} disabled={!canAdvance}>
          {index < total - 1 ? "Next" : "See what's running"}
        </Button>
      </div>
    </>
  );
}

/** A large, forgiving select button for a frequency/grip option. */
function OptionButton({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "var(--sf-space-16)",
        marginBottom: "var(--sf-space-8)",
        background: selected ? "var(--sf-surface-raised, rgba(184,134,43,0.08))" : "transparent",
        border: selected
          ? "1px solid var(--sf-accent, #B8862B)"
          : "1px solid var(--sf-border-quiet)",
        borderRadius: "8px",
        color: "var(--sf-text-primary)",
        fontFamily: "var(--sf-font-serif)",
        fontSize: "16px",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {label}
    </button>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* RESULT VIEW — dispatches on surface                                        */
/* ───────────────────────────────────────────────────────────────────────── */

function ResultView({ instrument, result, livedExperience, onInfo, onAdd, onMarkLived, onDone }) {
  // Reuse seam: only the pattern-work dysfunction frame is built (the surface
  // CD-Quest feeds). Capacities/profile frames build with their instruments.
  if (instrument.surface !== "pattern-work") {
    throw new Error(
      `InstrumentRunner: unsupported result surface "${instrument.surface}"`
    );
  }

  // Proposed chips minus any the user has reclaimed as lived experience.
  const proposed = result.proposedChips
    .filter((id) => !livedExperience.has(id))
    .map((id) => getChipById(id))
    .filter(Boolean);
  const light = result.lightChips.map((id) => getChipById(id)).filter(Boolean);
  const reclaimed = [...livedExperience].map((id) => getChipById(id)).filter(Boolean);

  const nothingRunning = proposed.length === 0 && light.length === 0 && reclaimed.length === 0;

  return (
    <>
      <EditorialBlock
        label={`${instrument.name} · what's running`}
        headline="Here's what showed up"
        headlineSize="md"
        body="No scores, no verdict — just the shapes your thinking took this week, and what you can do with each one. Add the ones that ring true to your watch list; leave the rest."
        rule
      />

      {/* Endorsed — proposed for the watch list */}
      {proposed.length > 0 && (
        <div style={{ marginTop: "var(--sf-space-32)" }}>
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
            Showed up this week
          </MonoLabel>
          {proposed.map((chip) => (
            <ProposedRow
              key={chip.id}
              chip={chip}
              added={isOnWatchList(chip.id)}
              onInfo={() => onInfo(chip)}
              onAdd={() => onAdd(chip.id)}
              onMarkLived={() => onMarkLived(chip.id)}
            />
          ))}
        </div>
      )}

      {/* Lightly present — named gently, no push */}
      {light.length > 0 && (
        <div style={{ marginTop: "var(--sf-space-32)" }}>
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
            Also in the mix
          </MonoLabel>
          {light.map((chip) => (
            <div
              key={chip.id}
              style={{ padding: "var(--sf-space-16) 0", borderBottom: "0.5px solid var(--sf-border-quiet)" }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: "var(--sf-space-8)", marginBottom: "var(--sf-space-8)" }}>
                <span style={chipLabelStyle}>{chip.label}</span>
                <InfoDot onClick={() => onInfo(chip)} label={chip.label} />
              </div>
              <p style={gentleBodyStyle}>
                Showed up once or twice and didn't get much hold — worth knowing it's in your repertoire, nothing more.
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Reclaimed as lived experience — acknowledgment */}
      {reclaimed.length > 0 && (
        <div style={{ marginTop: "var(--sf-space-32)" }}>
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
            You took these out of the read
          </MonoLabel>
          {reclaimed.map((chip) => (
            <p key={chip.id} style={{ ...gentleBodyStyle, marginBottom: "var(--sf-space-12)" }}>
              <span style={{ color: "var(--sf-text-primary)" }}>{chip.label}</span> — an accurate
              read of something real isn't a distortion. Left off the list.
            </p>
          ))}
        </div>
      )}

      {/* All quiet — honest, not a clean bill */}
      {nothingRunning && (
        <p style={{ ...gentleBodyStyle, marginTop: "var(--sf-space-32)" }}>
          Nothing ran with much grip this week. This isn't a clean bill — it just reports what's
          running, and right now it's quiet. The map's here whenever a pattern shows up.
        </p>
      )}

      <div style={{ marginTop: "var(--sf-space-32)" }}>
        <Button variant="secondary" fullWidth onClick={onDone}>
          Done
        </Button>
      </div>
    </>
  );
}

/**
 * ProposedRow — an endorsed pattern: named in loop-voice, with the path
 * forward (add to watch list) AND the lived-experience exit (this was real).
 */
function ProposedRow({ chip, added, onInfo, onAdd, onMarkLived }) {
  return (
    <div style={{ padding: "var(--sf-space-16) 0", borderBottom: "0.5px solid var(--sf-border-quiet)" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--sf-space-8)", marginBottom: "var(--sf-space-8)" }}>
        <span style={chipLabelStyle}>{chip.label}</span>
        <InfoDot onClick={onInfo} label={chip.label} />
      </div>

      <p style={gentleBodyStyle}>
        One of the patterns the distortion map names. On your watch list, the Reframe AI flags it
        when it shows up — and the practice can loosen its grip over time.
      </p>

      {added ? (
        <span style={onListStyle}>on watch list</span>
      ) : (
        <div style={{ display: "flex", gap: "var(--sf-space-16)", alignItems: "center", flexWrap: "wrap", marginTop: "var(--sf-space-12)" }}>
          <button type="button" onClick={onAdd} aria-label={`Add ${chip.label} to watch list`} style={{ ...textLinkStyle, color: "var(--sf-accent, #B8862B)" }}>
            + add to watch list
          </button>
          <button type="button" onClick={onMarkLived} aria-label={`${chip.label} was a real situation, not a pattern`} style={textLinkStyle}>
            this was real, not a pattern
          </button>
        </div>
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

const backStyle = {
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
};

const chipLabelStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "18px",
  fontWeight: 400,
  color: "var(--sf-text-primary)",
  lineHeight: 1.3,
};

const gentleBodyStyle = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "15px",
  lineHeight: 1.5,
  color: "var(--sf-text-faint)",
  margin: 0,
};

const onListStyle = {
  display: "inline-block",
  marginTop: "var(--sf-space-12)",
  fontFamily: "var(--sf-font-mono)",
  fontSize: "10px",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--sf-text-faint)",
};

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
