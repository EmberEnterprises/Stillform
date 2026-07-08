import React, { useState } from "react";

/**
 * FocusModeLine — the focus-mode prompt, WEB SCOPE (FULL BUILD item 6; spec
 * §2.8). The web cannot read or set OS focus state — so the honest web
 * version is an OFFER, not control: one quiet wind-down line suggesting the
 * person set their phone to Do Not Disturb for the night. Opt-in by nature,
 * dismissible forever ("don't show this again" remembered), and it respects
 * their state by never claiming to know it (threshold awareness, §2.8:
 * never override what the user already runs).
 *
 * NATIVE TIME (recorded in the todo's native block): session-time focus
 * auto-enable/restore, bedtime chaining into OS Sleep Mode, and time-
 * sensitive classification for the Pre-event Brief — all need Capacitor
 * hooks and Arlin's §2.8 answers (opt-in vs default-on).
 *
 * @param {boolean} active — the caller's wind-down gate
 */
const HIDE_KEY = "stillform_v2_focus_line_hidden";

export default function FocusModeLine({ active = false }) {
  const [hidden, setHidden] = useState(() => {
    try { return localStorage.getItem(HIDE_KEY) === "yes"; } catch { return false; }
  });

  if (!active || hidden) return null;

  const hideForever = () => {
    try { localStorage.setItem(HIDE_KEY, "yes"); } catch { /* fail-silent */ }
    setHidden(true);
  };

  return (
    <p style={LINE} aria-label="Quiet suggestion">
      If the phone is still loud, Do Not Disturb holds the door for the night.{" "}
      <button type="button" className="sf-link-quiet" onClick={hideForever} style={{ display: "inline" }}>
        don't show this again
      </button>
    </p>
  );
}

const LINE = {
  fontFamily: "var(--sf-font-serif)",
  fontWeight: 300,
  fontStyle: "italic",
  fontSize: "13px",
  lineHeight: 1.65,
  color: "var(--sf-text-faint)",
  margin: "var(--sf-space-16) 0 0",
};
