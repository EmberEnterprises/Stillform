import React, { useState } from "react";
import { getPref } from "../lib/userPrefs.js";
import MonoLabel from "../components/MonoLabel.jsx";
import {
  getUpcomingEventOffer,
  dismissEventOffer,
  getConciergeVolume,
} from "../lib/conciergeSignals.js";

/**
 * PreEventOffer — the ANTICIPATORY half of the proactive concierge (Arlin's
 * corrected doctrine, 2026-07-08: it speaks up, ahead of time, when it
 * genuinely has something). The meeting prompt she asked for, firing on its
 * own: "that thing is coming — want to get ahead of it?"
 *
 * Deterministic + earned (conciergeSignals.js): only an event that matches a
 * trigger the user THEMSELVES named, or one they marked — never every event,
 * never a task manager. Dismissal remembered per event. Consent-gated by the
 * existing calendar consent.
 *
 * STATE-ADAPTIVE VOLUME (her spec): on a depleted or heavy day the line goes
 * soft — shorter, easier to pass by. Adaptation backs off; it never escalates.
 *
 * Renders nothing when it has nothing (honest-empty). One quiet hairline row
 * — never a modal, never a badge. Tap-through opens the Pre-event Brief.
 *
 * @param {function(): void} onOpenBrief — routes to the Pre-event Brief
 */
export default function PreEventOffer({ onOpenBrief }) {
  // Item 9 depth: this voice is individually silenceable (concierge.meetingPrompts).
  try { if (getPref("concierge.meetingPrompts") === false) return null; } catch { /* default: on */ }
  const [offer, setOffer] = useState(() => {
    try { return getUpcomingEventOffer(); } catch { return null; }
  });
  const volume = (() => {
    try { return getConciergeVolume(); } catch { return "standard"; }
  })();

  if (!offer || typeof onOpenBrief !== "function") return null;

  const dismiss = () => {
    try { dismissEventOffer(offer.key); } catch { /* fail-silent */ }
    setOffer(null);
  };

  const when =
    offer.minutesUntil <= 0 ? "starting now" :
    offer.minutesUntil < 60 ? `in ${offer.minutesUntil} min` :
    "coming up";

  // Volume shapes the line, not the mechanics: soft = shorter, no history
  // reference; standard = names the trigger connection the user drew.
  const line =
    volume === "soft"
      ? `${offer.title} — ${when}. A brief is here if you want it.`
      : offer.matchedTrigger
        ? `${offer.title} — ${when}. This is the kind of moment you've flagged (${offer.matchedTrigger}). Want to walk in ahead of it?`
        : `${offer.title} — ${when}. You marked this one. Want to walk in ahead of it?`;

  return (
    <section className="sf-sec" aria-label="Coming up">
      <button
        type="button"
        className="sf-sec-row"
        aria-label={`Prepare for ${offer.title}`}
        onClick={onOpenBrief}
      >
        <span className="sf-sec-mark" aria-hidden="true">{"\u2197"}</span>
        <span className="sf-sec-row-main">
          <span className="sf-sec-row-top">
            <span className="sf-sec-name">Coming up</span>
            <span className="sf-sec-meta">{when}</span>
          </span>
          <span className="sf-sec-sub">{line}</span>
        </span>
        <span className="sf-sec-arrow" aria-hidden="true">→</span>
      </button>
      <button
        type="button"
        className="sf-link-quiet"
        onClick={dismiss}
        aria-label="Not this one"
        style={{ marginTop: "4px" }}
      >
        not this one
      </button>
    </section>
  );
}
