import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import Button from "../components/Button.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import InfoModal from "../components/InfoModal.jsx";
import { addChipToWatchList, isOnWatchList } from "../lib/biasProfile.js";
import { getChipById } from "../lib/biasChips.js";
import { recordInstrumentResult } from "../lib/capacitiesProfile.js";
import { recordRiskProfile } from "../lib/riskProfile.js";

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
  // Replace semantics: each item's stored value is model-shaped (an object for
  // the two-part model, a scalar for capacity). Each item renderer owns its
  // own shape and merging.
  const currentItem = instrument.items[itemIndex];
  const setItemResponse = (value) =>
    setResponses((prev) => ({ ...prev, [currentItem.id]: value }));

  const goNext = () => {
    if (itemIndex < instrument.items.length - 1) {
      setItemIndex((i) => i + 1);
    } else {
      const scored = scoreFn(responses);
      setResult(scored);
      if (instrument.surface === "capacities") {
        // Record the take to the growth mirror — a private baseline, not a chip.
        recordInstrumentResult({
          instrumentId: scored.instrumentId || instrument.id,
          results: scored,
        });
        fire("Workshop Instrument Completed", {
          instrument: instrument.id,
          reading: scored.reading?.key,
        });
      } else if (instrument.surface === "profile") {
        // Record to the risk-profile store — a private self-portrait, not a
        // chip and not the capacities growth mirror (spec §5/§9).
        recordRiskProfile({ results: scored });
        fire("Workshop Instrument Completed", { instrument: instrument.id });
      } else {
        fire("Workshop Instrument Completed", {
          instrument: instrument.id,
          endorsed: scored.proposedChips?.length ?? 0,
        });
      }
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
          response={responses[currentItem.id]}
          onSetResponse={setItemResponse}
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
  const model = instrument.responseModel;
  if (model === "two-part-freq-grip") {
    return (
      <TwoPartItem
        instrument={instrument}
        index={index}
        response={response}
        onSetResponse={onSetResponse}
        onNext={onNext}
        onBack={onBack}
      />
    );
  }
  // capacity-likert-4 (capacities) and single-select-4 (MCQ-30 pattern-work)
  // share the same single 4-point renderer; they differ only in scale labels,
  // which the renderer reads from the instrument/item.
  if (model === "capacity-likert-4" || model === "single-select-4") {
    return (
      <CapacityItem
        instrument={instrument}
        index={index}
        value={response}
        onSetValue={onSetResponse}
        onNext={onNext}
        onBack={onBack}
      />
    );
  }
  // A future instrument with an unbuilt model fails loud, not silent.
  throw new Error(`InstrumentRunner: unsupported responseModel "${model}"`);
}

/* Two-part frequency × grip item (CD-Quest). Owns its own object merge. */
function TwoPartItem({ instrument, index, response, onSetResponse, onNext, onBack }) {
  const item = instrument.items[index];
  const total = instrument.items.length;
  const r = response || {};

  const freq = r.frequency;
  const grip = r.intensity;
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
                  : { ...r, frequency: opt.value }
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
                onClick={() => onSetResponse({ ...r, intensity: opt.value })}
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

/* Single 4-point item, single-select (capacities: SRIS/ERQ/MAIA-2/IRI; and
   MCQ-30 pattern-work). Stores one value per item (replace semantics). Options
   and prompt come from the item when it overrides them (e.g. MCQ-30's CSC
   direction scale), else from the instrument default. */
function CapacityItem({ instrument, index, value, onSetValue, onNext, onBack }) {
  const item = instrument.items[index];
  const total = instrument.items.length;
  const canAdvance = value != null;
  const opts = item.options || instrument.response.options;
  const prompt = item.prompt !== undefined ? item.prompt : instrument.response.prompt;
  const finishLabel = instrument.finishLabel || "See where it sits";

  return (
    <>
      <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-24)" }}>
        {index + 1} / {total}
      </MonoLabel>

      <p style={{ fontFamily: "var(--sf-font-serif)", fontSize: "20px", lineHeight: 1.45, color: "var(--sf-text-primary)", margin: "0 0 var(--sf-space-32)" }}>
        {item.text}
      </p>

      {prompt ? (
        <MonoLabel size="xs" style={{ display: "block", marginBottom: "var(--sf-space-12)" }}>
          {prompt}
        </MonoLabel>
      ) : null}
      <div style={{ marginBottom: "var(--sf-space-24)" }}>
        {opts.map((opt) => (
          <OptionButton
            key={opt.value}
            label={opt.label}
            selected={value === opt.value}
            onClick={() => onSetValue(opt.value)}
          />
        ))}
      </div>

      <div style={{ display: "flex", gap: "var(--sf-space-12)", alignItems: "center", marginTop: "var(--sf-space-16)" }}>
        {index > 0 && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            Back
          </Button>
        )}
        <div style={{ flex: 1 }} />
        <Button variant="primary" onClick={onNext} disabled={!canAdvance}>
          {index < total - 1 ? "Next" : finishLabel}
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
  // Capacities surface — the growth-mirror frame (SRIS + later ERQ/MAIA-2/IRI).
  if (instrument.surface === "capacities") {
    return <CapacityResult instrument={instrument} result={result} onDone={onDone} />;
  }
  // Profile surface — the value-neutral self-portrait frame (DOSPERT, §3/§5).
  if (instrument.surface === "profile") {
    return <ProfileResult instrument={instrument} result={result} onDone={onDone} />;
  }
  // Reuse seam: only the pattern-work dysfunction frame is built beyond that.
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

  // Framing copy is configurable per instrument — CD-Quest's weekly-distortion
  // copy is the default; MCQ-30 supplies belief-inventory copy. Per-chip rows
  // use each chip's own definition, so only the section framing varies.
  const rc = instrument.resultCopy || {};
  const headline = rc.headline || "Here's what showed up";
  const introBody =
    rc.body ||
    "No scores, no verdict — just the shapes your thinking took this week, and what you can do with each one. Add the ones that ring true to your watch list; leave the rest.";
  const sectionLabel = rc.sectionLabel || "Showed up this week";
  const nothingCopy =
    rc.nothing ||
    "Nothing ran with much grip this week. This isn't a clean bill — it just reports what's running, and right now it's quiet. The map's here whenever a pattern shows up.";
  const notes = Array.isArray(result.notes) ? result.notes : [];

  return (
    <>
      <EditorialBlock
        label={`${instrument.name} · what's running`}
        headline={headline}
        headlineSize="md"
        body={introBody}
        rule
      />

      {/* Endorsed — proposed for the watch list */}
      {proposed.length > 0 && (
        <div style={{ marginTop: "var(--sf-space-32)" }}>
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
            {sectionLabel}
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
          {nothingCopy}
        </p>
      )}

      {/* Quality read (e.g. MCQ-30's CSC) — an observation, never a chip. */}
      {notes.length > 0 && (
        <div style={{ marginTop: "var(--sf-space-32)" }}>
          {notes.map((note, i) => (
            <div key={i} style={{ marginBottom: "var(--sf-space-24)" }}>
              {note.title && (
                <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-8)" }}>
                  {note.title}
                </MonoLabel>
              )}
              <p style={gentleBodyStyle}>{note.body}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "var(--sf-space-32)" }}>
        <Button variant="secondary" fullWidth onClick={onDone}>
          Done
        </Button>
      </div>
    </>
  );
}

/* CapacityResult — the growth-mirror frame. Relationship-first per SRIS spec
   §5–6: shows the RELATIONSHIP reading, never two standalone high/low scores
   (the documented #1 risk). No numbers, no grade; the path forward is the
   practice itself. The per-factor levels live in the recorded result (for the
   mirror + AI context) but are deliberately not shown as a scorecard here. */
function CapacityResult({ instrument, result, onDone }) {
  const reading = result.reading || {};
  const notes = Array.isArray(result.notes) ? result.notes : [];
  return (
    <>
      <EditorialBlock
        label={`${instrument.name} · where it sits`}
        headline={reading.title || "Where it sits"}
        headlineSize="md"
        body={reading.body || ""}
        rule
      />
      {notes.length > 0 && (
        <div style={{ marginTop: "var(--sf-space-32)" }}>
          {notes.map((note, i) => (
            <div key={i} style={{ marginBottom: "var(--sf-space-24)" }}>
              {note.title && (
                <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-8)" }}>
                  {note.title}
                </MonoLabel>
              )}
              <p style={gentleBodyStyle}>{note.body}</p>
            </div>
          ))}
        </div>
      )}
      <p style={{ ...gentleBodyStyle, marginTop: "var(--sf-space-24)" }}>
        No score, no grade — this is a starting line. Take it again down the road and the shift is
        the data; it shows up in your growth mirror.
      </p>
      <div style={{ marginTop: "var(--sf-space-32)" }}>
        <Button variant="secondary" fullWidth onClick={onDone}>
          Done
        </Button>
      </div>
    </>
  );
}

/* ProfileResult — the value-neutral PROFILE frame (DOSPERT, spec §3/§5). The
   third result template. NOT the pattern-work "here's a problem" tone and NOT
   the capacities "skill to grow" tone — a mirror, no prescription. Leads with
   the SPREAD (the reading), then the plain domain-by-domain shape. No scores,
   no good/bad. notes[] (the optional §5 precision note) renders only if the
   score function emits one — off by default. */
function ProfileResult({ instrument, result, onDone }) {
  const reading = result.reading || {};
  const domains = Array.isArray(result.domains) ? result.domains : [];
  const notes = Array.isArray(result.notes) ? result.notes : [];
  return (
    <>
      <EditorialBlock
        label={`${instrument.name} · your shape`}
        headline={reading.title || "Where you lean"}
        headlineSize="md"
        body={reading.body || ""}
        rule
      />

      {domains.length > 0 && (
        <div style={{ marginTop: "var(--sf-space-32)" }}>
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
            Across the domains
          </MonoLabel>
          {domains.map((d) => (
            <div
              key={d.id}
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: "var(--sf-space-16)",
                padding: "var(--sf-space-16) 0",
                borderBottom: "0.5px solid var(--sf-border-quiet)",
              }}
            >
              <span style={chipLabelStyle}>{d.label}</span>
              <span style={{ ...gentleBodyStyle, textAlign: "right", flexShrink: 0 }}>{d.leanLabel}</span>
            </div>
          ))}
        </div>
      )}

      {notes.length > 0 && (
        <div style={{ marginTop: "var(--sf-space-32)" }}>
          {notes.map((note, i) => (
            <div key={i} style={{ marginBottom: "var(--sf-space-24)" }}>
              {note.title && (
                <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-8)" }}>
                  {note.title}
                </MonoLabel>
              )}
              <p style={gentleBodyStyle}>{note.body}</p>
            </div>
          ))}
        </div>
      )}

      <p style={{ ...gentleBodyStyle, marginTop: "var(--sf-space-24)" }}>
        No score, nothing to fix — just your shape. Risk shape holds fairly steady; take it again
        sometime and it's less "have you grown" than "has anything shifted."
      </p>
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
      </div>

      <p style={gentleBodyStyle}>
        {chip.info}
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
