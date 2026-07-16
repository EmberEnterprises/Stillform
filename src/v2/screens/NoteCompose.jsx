import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import Button from "../components/Button.jsx";
import MicButton from "../components/MicButton.jsx";
import { attachNote } from "../lib/futureNotes.js";

/**
 * NoteCompose — "a note to future you" (P28 attach entry point, 2026-07-15).
 *
 * The note engine (futureNotes.js) was fully built but had no way for a user to
 * CREATE a note. This is the standalone composer: write something, choose when
 * it should reach you, and it arrives at that moment — read it, use it, done.
 *
 * Honors the law the engine encodes: a note is NEVER a task. No checkbox, no
 * completion, nothing owed back. The composer's language keeps that promise.
 */

// When options map to a surfacing time. Deliberately human, not a date-picker
// wall — most future-notes are "around then," not a precise minute.
function whenOptions(now = new Date()) {
  const opts = [];
  const tomorrowEve = new Date(now); tomorrowEve.setDate(now.getDate() + 1); tomorrowEve.setHours(18, 0, 0, 0);
  const inThreeDays = new Date(now); inThreeDays.setDate(now.getDate() + 3); inThreeDays.setHours(9, 0, 0, 0);
  const nextWeek = new Date(now); nextWeek.setDate(now.getDate() + 7); nextWeek.setHours(9, 0, 0, 0);
  opts.push({ id: "tomorrow", label: "Tomorrow evening", atMs: tomorrowEve.getTime() });
  opts.push({ id: "threeDays", label: "In a few days", atMs: inThreeDays.getTime() });
  opts.push({ id: "nextWeek", label: "Next week", atMs: nextWeek.getTime() });
  return opts;
}

export default function NoteCompose({ onExit, event = null }) {
  // P28/P29: a per-event or packing note hands its event/template off via
  // pendingNoteEvent (avoids threading through the tree). Explicit prop wins.
  const [resolvedEvent] = useState(() => event || (() => { try { return takePendingNoteEvent(); } catch { return null; } })());
  const [text, setText] = useState(() => (resolvedEvent && resolvedEvent.template) ? resolvedEvent.template : "");
  const [saved, setSaved] = useState(false);
  const [wantWord, setWantWord] = useState(false); // P30: default HOLD; opt-in to a spoken arrival
  const eventStartMs = resolvedEvent && resolvedEvent.start ? Date.parse(resolvedEvent.start) : null;
  const anchored = Number.isFinite(eventStartMs);
  const [when, setWhen] = useState(anchored ? "event" : null);
  const options = whenOptions();

  const save = () => {
    if (!text.trim()) return;
    let id = null;
    if (anchored) {
      // Surface the evening before the event — "arrives on time" for a plan.
      const eve = new Date(eventStartMs - 24 * 60 * 60 * 1000);
      eve.setHours(18, 0, 0, 0);
      id = attachNote({
        text: text.trim(),
        surfaceAt: eventStartMs,
        leadMinutes: Math.max(0, Math.round((eventStartMs - eve.getTime()) / 60000)),
        label: resolvedEvent.title ? String(resolvedEvent.title).slice(0, 80) : "",
        anchor: { kind: "event", title: resolvedEvent.title || "", at: eventStartMs },
        voice: wantWord ? "speak" : "hold",
      });
    } else {
      const chosen = options.find((o) => o.id === when);
      if (!chosen) return;
      id = attachNote({
        text: text.trim(),
        surfaceAt: chosen.atMs,
        leadMinutes: 0,
        label: "",
        anchor: { kind: "date", at: chosen.atMs },
        voice: wantWord ? "speak" : "hold",
      });
    }
    if (id) setSaved(true);
  };

  if (saved) {
    return (
      <main className="sf-page sf-page--hero">
        <div className="sf-fade-enter">
          <EditorialBlock
            label="Noted"
            headline="It'll reach you then."
            headlineSize="lg"
            body="Nothing to track, nothing owed. It arrives, you read it, that's the whole of it."
          />
          <div style={{ marginTop: "var(--sf-space-48)" }}>
            <Button variant="primary" onClick={onExit}>Done</Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="sf-page sf-page--hero">
      <div className="sf-fade-enter">
        <EditorialBlock
          label="A note to future you"
          headline="Leave something for later."
          headlineSize="lg"
          body="Write it now; it reaches you when you'll want it. A note, never a task — read it and it's done."
        />
      </div>

      <div className="sf-fade-enter sf-fade-enter--delay-2" style={{ marginTop: "var(--sf-space-32)" }}>
        <textarea
          className="sf-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="The thing you'll want to remember…"
          rows={3}
          aria-label="Your note"
        />
        <div style={{ marginTop: "var(--sf-space-8)", display: "flex", justifyContent: "flex-end" }}>
          <MicButton onTranscript={(t) => setText((d) => (d ? d + " " : "") + t.trim())} />
        </div>
      </div>

      {anchored ? (
        <div className="sf-fade-enter sf-fade-enter--delay-3" style={{ marginTop: "var(--sf-space-24)" }}>
          <p style={{ margin: 0, fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontStyle: "italic", fontSize: "14px", color: "var(--sf-text-faint)" }}>
            It'll reach you the evening before {resolvedEvent.title ? `"${resolvedEvent.title}"` : "your event"}.
          </p>
        </div>
      ) : (
        <div className="sf-fade-enter sf-fade-enter--delay-3" style={{ marginTop: "var(--sf-space-24)" }}>
          <p style={{ margin: "0 0 var(--sf-space-12)", fontFamily: "var(--sf-font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--sf-text-faint)" }}>
            When should it reach you?
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sf-space-8)" }}>
            {options.map((o) => (
              <button
                key={o.id}
                type="button"
                className="sf-chip"
                onClick={() => setWhen(o.id)}
                aria-pressed={when === o.id}
                style={when === o.id ? { borderColor: "var(--sf-accent)", color: "var(--sf-accent)" } : undefined}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="sf-fade-enter sf-fade-enter--delay-3" style={{ marginTop: "var(--sf-space-24)" }}>
        <button
          type="button"
          className="sf-link-quiet"
          onClick={() => setWantWord((v) => !v)}
          aria-pressed={wantWord}
          style={{ fontSize: "13px" }}
        >
          {wantWord ? "It'll speak up when it arrives \u2713" : "Want a word when it arrives, or just keep it quietly?"}
        </button>
      </div>
      <div className="sf-fade-enter sf-fade-enter--delay-3" style={{ marginTop: "var(--sf-space-24)", display: "flex", alignItems: "center", gap: "var(--sf-space-16)" }}>
        <Button variant="primary" onClick={save} disabled={!text.trim() || !when}>Leave the note</Button>
        <button type="button" onClick={onExit} className="sf-link-quiet">Not now ›</button>
      </div>
    </main>
  );
}
