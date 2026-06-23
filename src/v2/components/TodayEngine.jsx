import React, { useState } from "react";

/**
 * TodayEngine — a quiet, expandable readout of what the practice can read
 * from the device today: calendar, heart-rate variability, sleep.
 *
 * INTEGRITY (v7 scope-lock): these are native-only signals. On web they are
 * unavailable; until the native integrations connect they read "not
 * connected." This panel NEVER fabricates data — it only ever reflects real
 * state ("never guessed"). The "reading your day" calculating flourish is
 * reserved for when a real source is actually connected; with nothing
 * connected the panel stays honestly empty.
 *
 * Receding by design: collapsed and faint so the naming surface leads.
 */
function isNativePlatform() {
  try {
    return !!(
      typeof window !== "undefined" &&
      window.Capacitor &&
      typeof window.Capacitor.isNativePlatform === "function" &&
      window.Capacitor.isNativePlatform()
    );
  } catch {
    return false;
  }
}

const SOURCES = [
  { id: "calendar", name: "Calendar" },
  { id: "hrv", name: "Heart-rate variability" },
  { id: "sleep", name: "Sleep" },
];

export default function TodayEngine() {
  const [open, setOpen] = useState(false);
  const native = isNativePlatform();
  const stateLabel = native ? "Not connected" : "Not available on web";

  return (
    <div className="sf-today">
      <button
        type="button"
        className="sf-today-head"
        aria-expanded={open}
        aria-label="What the practice can read from your day"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="sf-today-lbl">Today</span>
        <span className="sf-today-caret" aria-hidden="true">{open ? "\u25b4" : "\u25be"}</span>
      </button>

      {open ? (
        <div className="sf-today-body">
          {SOURCES.map((s) => (
            <div className="sf-today-row" key={s.id}>
              <span className="sf-today-name">{s.name}</span>
              <span className="sf-today-state">{stateLabel}</span>
            </div>
          ))}
          <p className="sf-today-note">
            {native
              ? "These read from your phone. None are connected yet \u2014 when they are, your day shows here, drawn from real signals, never guessed."
              : "These read from your phone \u2014 calendar, heart-rate, sleep. Not available on web. In the app they connect and your day shows here, never guessed."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
