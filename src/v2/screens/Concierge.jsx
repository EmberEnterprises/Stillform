import React from "react";
import MonoLabel from "../components/MonoLabel.jsx";
import EditorialBlock from "../components/EditorialBlock.jsx";
import { getUpcomingEventOffer, getConciergeVolume, getUmbrellaNote, getNoGapDayNote, getTomorrowHeavyNote, getTemporalLandmark } from "../lib/conciergeSignals.js";
import { getActiveForecast, getPendingFollowUp } from "../lib/forecastLoop.js";
import { getDecompressionCandidate } from "../lib/eodDecompression.js";
import { getNextLessonNudge } from "../lib/trackProgress.js";
import { LESSONS } from "../lib/learningTrack.js";
import { getPref } from "../lib/userPrefs.js";

/**
 * Concierge — THE ROOM (Arlin's design, 2026-07-08: "a screen just for the
 * concierge — some place I can go to see... if they dismiss the prompts they
 * have an area they can hit and go to").
 *
 * One quiet room gathering everything the concierge currently has to say,
 * across all four voices — INCLUDING prompts dismissed from home. Dismissal
 * semantics (hers): "not this one" = off-my-home, never gone. The item stays
 * here until its own window expires on its own arithmetic.
 *
 * Each voice is explained: what earns it, when it speaks, that it backs off
 * on depleted/heavy days. A voice switched OFF in Settings is silent
 * everywhere and the room says so plainly. Dials live in Settings only —
 * one source of truth, no duplicate toggles.
 *
 * Read-only by design: the room shows and explains; acting on an item
 * happens where the item lives (home cards / the practice). This keeps one
 * behavior per surface.
 *
 * @param {function(): void} onExit — back
 * @param {function(): void} onOpenSettings — the dials
 */
export default function Concierge({ onExit, onOpenSettings, onCompose }) {
  const volume = safe(() => getConciergeVolume(), "standard");

  const voices = [
    {
      key: "meetingPrompts",
      name: "Meeting prompts",
      earns: "Speaks only for a calendar event matching a trigger you yourself named, or one you marked — never every event.",
      when: "Up to 90 minutes ahead, through 10 minutes in.",
      item: safe(() => {
        const o = getUpcomingEventOffer(Date.now(), { includeDismissed: true });
        return o ? `${o.title} — ${o.minutesUntil <= 0 ? "started" : `in ${o.minutesUntil} min`}${o.matchedTrigger ? ` (your flag: ${o.matchedTrigger})` : ""}` : null;
      }, null),
    },
    {
      key: "umbrella",
      name: "Umbrella note",
      earns: "Speaks only when rain is forecast right around a calendar event — pure logistics, never about you.",
      when: "Up to about six hours before the rain lines up with something you're heading out for.",
      item: safe(() => {
        const u = getUmbrellaNote(Date.now(), { includeDismissed: true });
        return u ? u.note : null;
      }, null),
    },
    {
      key: "noGapDay",
      name: "No-gap day",
      earns: "Speaks only when your own calendar leaves no real break across the middle of the day — pure logistics.",
      when: "On a day whose 11-to-3 span is fully booked, while it's still ahead.",
      item: safe(() => {
        const g = getNoGapDayNote(Date.now(), { includeDismissed: true });
        return g ? g.note : null;
      }, null),
    },
    {
      key: "tomorrowHeavy",
      name: "Tomorrow, tonight",
      earns: "Speaks only when tomorrow morning is genuinely loaded — so tonight can bend toward sleep while it still matters.",
      when: "In the evening, when tomorrow's morning is already full.",
      item: safe(() => {
        const t = getTomorrowHeavyNote(Date.now(), { includeDismissed: true });
        return t ? t.note : null;
      }, null),
    },
    {
      key: "temporalLandmark",
      name: "Time landmarks",
      earns: "Speaks only for a real shift on the clock or calendar — daylight saving, a season turn. The world, never you.",
      when: "A few days before the shift lands.",
      item: safe(() => {
        const l = getTemporalLandmark(Date.now(), { includeDismissed: true });
        return l ? l.note : null;
      }, null),
    },
    {
      key: "forecasts",
      name: "Pattern forecasts",
      earns: "Speaks only when a pattern YOU confirmed has its trigger live again in your own log — arithmetic, never a guess, always a question.",
      when: "At the threshold; one follow-up later; at most two open at once.",
      item: safe(() => {
        const fu = getPendingFollowUp();
        if (fu) return `Following up: ${fu.question}`;
        const f = getActiveForecast();
        return f ? f.question : null;
      }, null),
    },
    {
      key: "eveningDecompression",
      name: "Evening set-down",
      earns: "The day's heaviest ended event — a moment you flagged outranks a merely long one.",
      when: "The end-of-day window only; once per day.",
      item: safe(() => {
        const c = getDecompressionCandidate(Date.now(), { includeDismissed: true });
        return c ? c.line : null;
      }, null),
    },
    {
      key: "lessonNudges",
      name: "Lesson nudges",
      earns: "Only after you've engaged the Track — the next rep on a move you named, or the next chapter you've reached.",
      when: "Quiet for a week after \u201cnot now\u201d; any new practice reopens it.",
      item: safe(() => {
        const n = getNextLessonNudge(LESSONS, { includeDismissed: true });
        if (!n || !n.id) return null;
        const lesson = LESSONS.find((l) => l.id === n.id);
        return lesson ? `Next: ${lesson.title}` : null;
      }, null),
    },
  ].map((v) => ({ ...v, on: getPrefSafe(`concierge.${v.key}`) !== false }));

  const speaking = voices.filter((v) => v.on && v.item);

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <article className="sf-fade-enter" style={{ maxWidth: 560 }}>
        <button type="button" onClick={onExit} aria-label="Back" style={BACK}>\u2190 back</button>
        <EditorialBlock
          label="The Concierge"
          headline="Everything it has to say, in one place"
          headlineSize="md"
          body={
            volume === "soft"
              ? "It's reading today as a heavy one, so it's speaking softly. Dismissing a prompt on your home moves it here — nothing is lost until its own moment passes."
              : "Dismissing a prompt on your home moves it here — nothing is lost until its own moment passes. On depleted or heavy days, every voice backs off on its own."
          }
          rule
        />

        {/* Currently speaking — including home-dismissed */}
        <section className="sf-sec">
          <div className="sf-sec-head">
            <span className="sf-sec-head-lbl">Speaking now</span>
            <div className="sf-sec-rule" />
          </div>
          {speaking.length === 0 ? (
            <p style={EMPTY}>Nothing right now. The concierge speaks when something in your own record earns it — silence means nothing has.</p>
          ) : (
            speaking.map((v) => (
              <div key={v.key} style={ITEM_BLOCK}>
                <MonoLabel size="xs" tone="faint">{v.name}</MonoLabel>
                <p style={ITEM_LINE}>{v.item}</p>
              </div>
            ))
          )}
        </section>

        {/* The voices, explained */}
        <section className="sf-sec">
          <div className="sf-sec-head">
            <span className="sf-sec-head-lbl">The voices</span>
            <div className="sf-sec-rule" />
          </div>
          {voices.map((v) => (
            <div key={`x-${v.key}`} style={ITEM_BLOCK}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <MonoLabel size="xs" tone="faint">{v.name}</MonoLabel>
                {!v.on && <span style={OFF_TAG}>off</span>}
              </div>
              <p style={EXPLAIN}>{v.earns} {v.when}</p>
              {!v.on && <p style={EMPTY}>Switched off in Settings — silent everywhere until you turn it back on.</p>}
            </div>
          ))}
          {typeof onCompose === "function" && (
            <button type="button" className="sf-link-quiet" onClick={onCompose} style={{ display: "block", marginTop: "var(--sf-space-24)" }}>
              Leave a note for later \u2192
            </button>
          )}
          {typeof onOpenSettings === "function" && (
            <button type="button" className="sf-link-quiet" onClick={onOpenSettings} style={{ marginTop: "var(--sf-space-12)" }}>
              The dials live in Settings \u2192
            </button>
          )}
        </section>
      </article>
    </main>
  );
}

function safe(fn, fallback) {
  try { return fn(); } catch { return fallback; }
}
function getPrefSafe(path) {
  try { return getPref(path); } catch { return true; }
}

const BACK = {
  background: "transparent", border: "none", color: "var(--sf-text-faint)",
  fontFamily: "var(--sf-font-mono)", fontSize: "11px", letterSpacing: "0.14em",
  textTransform: "uppercase", cursor: "pointer", padding: "8px 0",
  marginBottom: "var(--sf-space-24)", WebkitTapHighlightColor: "transparent",
};
const ITEM_BLOCK = {
  borderBottom: "0.5px solid var(--sf-border-hairline)",
  padding: "var(--sf-space-12) 0",
};
const ITEM_LINE = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "15px",
  lineHeight: 1.6, color: "var(--sf-text-primary)", margin: "var(--sf-space-8) 0 0",
};
const EXPLAIN = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "13px",
  lineHeight: 1.6, color: "var(--sf-text-secondary)", margin: "var(--sf-space-8) 0 0",
};
const EMPTY = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontStyle: "italic",
  fontSize: "13px", lineHeight: 1.6, color: "var(--sf-text-faint)", margin: "var(--sf-space-8) 0 0",
};
const OFF_TAG = {
  fontFamily: "var(--sf-font-mono)", fontSize: "10px", letterSpacing: "0.14em",
  textTransform: "uppercase", color: "var(--sf-text-faint)",
};
