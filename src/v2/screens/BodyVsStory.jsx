import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import {
  getBodyStoryReadings,
  bodyCheckOptions,
  isLowState,
} from "../lib/bodyVsStory.js";

/**
 * BodyVsStory — "is it the situation, or your body?" surface.
 *
 * The bio-filter move made workable. A heavy feeling that lands while the body
 * is running low (depleted / no sleep / in pain / hormonal / revved) is partly
 * the BODY, not a verdict on you or your situation. Naming the body-state
 * changes how the brain reads the next signal — as danger, or just as tired
 * (interoceptive inference: Seth 2013; Barrett & Simmons 2015; Library
 * "bio-filter").
 *
 * Three parts, all from real material — never fabricated:
 *   1. the move, in plain self-mastery language (never clinical);
 *   2. an honest MIRROR of the user's own logged low-body moments, each paired
 *      with the feeling logged alongside (deterministic read of the signal log);
 *   3. the CHECK — run it now: name what the body's doing, get the read back.
 * It ends in a move (rumination guard: a check + a direction, never open staring).
 *
 * Both user AND AI (standing rule): the AI already receives the latest
 * body-state as bioFilter context in Reframe; this is where the user sees the
 * pattern and runs the check themselves.
 *
 * Copy here is FIRST-PASS DRAFT; Arlin's voice to set.
 *
 * @param {function(): void} onExit — back to My Progress
 */
export default function BodyVsStory({ onExit }) {
  const [readings] = useState(() => getBodyStoryReadings());
  const [picked, setPicked] = useState(null);

  const options = bodyCheckOptions();
  const pickedLow = picked && isLowState(picked);

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      <EditorialBlock
        label="My Progress"
        headline="Is it the situation — or your body?"
        headlineSize="md"
        body="When a feeling lands hard, it's easy to take it as the truth about you, or about what's in front of you. But a body running low — depleted, no sleep, in pain, a hormonal shift, physically revved — colors the read. Naming that doesn't make the feeling fake; it changes how your brain reads the next signal: as danger, or just as tired. The move is to check the body before you trust the story."
        rule
      />

      {/* The check — run it now (the work, attached) */}
      <section style={{ ...cardStyle, marginTop: "var(--sf-space-24)" }}>
        <MonoLabel size="xs" tone="faint" style={blockLabel}>The check — right now</MonoLabel>
        <p style={promptStyle}>What's your body doing?</p>
        <div style={chipWrap}>
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              style={picked === o.id ? chipOn : chipOff}
              aria-pressed={picked === o.id}
              onClick={() => {
                setPicked(o.id);
                try { window.plausible?.("Body Story Checked", { props: { state: o.id } }); } catch {}
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
        {picked && (
          <p style={readbackStyle}>
            {pickedLow
              ? "Then some of this may be the body, not the whole truth. You've named it — that's the move. Hold the story lightly, and re-read it once you're restored."
              : "Then the read's probably clean — you can trust the conclusion. Naming it was still the move; that's the part that makes the read honest."}
          </p>
        )}
      </section>

      {/* Honest mirror of the user's own low-body moments */}
      {readings.length > 0 ? (
        <div style={{ marginTop: "var(--sf-space-24)" }}>
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
            When your body was running low
          </MonoLabel>
          {readings.map((r, i) => (
            <section key={(r.when || "") + i} style={readingCard}>
              <div style={readingTop}>
                <span style={bodyTag}>{r.bodyLabels.join(" · ")}</span>
                <span style={whenTag}>{relTime(r.dateKey, r.when)}</span>
              </div>
              <p style={feelingLine}>
                {r.feeling ? `You felt ${r.feeling.toLowerCase()} here.` : "A feeling landed here."}
              </p>
            </section>
          ))}
          <p style={{ ...bodyQuiet, marginTop: "var(--sf-space-16)" }}>
            Not proof the feeling was wrong — just that the body had a hand in it. Worth a second read on the ones that mattered.
          </p>
        </div>
      ) : (
        <p style={{ ...bodyQuiet, marginTop: "var(--sf-space-24)" }}>
          Nothing logged yet where your body was running low. When there is, it'll show here — and the pairing of a
          low body with a heavy feeling gets easy to see.
        </p>
      )}
    </main>
  );
}

/** Short relative day label from a dateKey (YYYY-MM-DD), falling back to ISO. */
function relTime(dateKey, iso) {
  try {
    const d = dateKey ? new Date(dateKey + "T00:00:00") : iso ? new Date(iso) : null;
    if (!d || isNaN(d.getTime())) return "";
    const today = new Date();
    const ms = new Date(today.toDateString()).getTime() - new Date(d.toDateString()).getTime();
    const days = Math.round(ms / 86400000);
    if (days <= 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
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
const promptStyle = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "19px",
  lineHeight: 1.3, color: "var(--sf-text-primary)", margin: 0,
};
const chipWrap = { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "var(--sf-space-16)" };
const chipBase = {
  fontFamily: "var(--sf-font-mono)", fontSize: "12px", letterSpacing: "0.04em",
  padding: "8px 14px", borderRadius: "var(--sf-r-tight)", cursor: "pointer",
  background: "transparent", WebkitTapHighlightColor: "transparent",
};
const chipOff = { ...chipBase, color: "var(--sf-text-quiet)", border: "0.5px solid var(--sf-border-quiet)" };
const chipOn = { ...chipBase, color: "var(--sf-accent)", border: "1px solid var(--sf-accent)" };
const readbackStyle = {
  fontFamily: "var(--sf-font-serif)", fontSize: "15px", lineHeight: 1.6,
  color: "var(--sf-text-quiet)", margin: "var(--sf-space-24) 0 0",
};
const readingCard = {
  marginTop: "var(--sf-space-16)", padding: "var(--sf-space-24)",
  border: "0.5px solid var(--sf-border-quiet)", borderRadius: "var(--sf-r-default)",
  background: "transparent",
};
const readingTop = { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 };
const bodyTag = {
  fontFamily: "var(--sf-font-mono)", fontSize: "12px", letterSpacing: "0.04em",
  color: "var(--sf-text-primary)",
};
const whenTag = {
  fontFamily: "var(--sf-font-mono)", fontSize: "10px", letterSpacing: "0.1em",
  textTransform: "uppercase", color: "var(--sf-text-faint)", whiteSpace: "nowrap",
};
const feelingLine = {
  fontFamily: "var(--sf-font-serif)", fontSize: "15px", lineHeight: 1.55,
  color: "var(--sf-text-quiet)", margin: "8px 0 0",
};
const bodyQuiet = {
  fontFamily: "var(--sf-font-serif)", fontSize: "15px", lineHeight: 1.6,
  color: "var(--sf-text-quiet)", margin: 0,
};
