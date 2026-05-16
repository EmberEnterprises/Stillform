import React, { useState, useEffect, useRef } from "react";
import EditorialBlock from "../../components/EditorialBlock.jsx";
import Button from "../../components/Button.jsx";
import BreathingSession from "../../components/BreathingSession.jsx";
import { localDateKey } from "../../lib/beat.js";

/**
 * WindDown — minimal flow for the wind-down beat.
 *
 * Phase 4 #5 (locked May 16, 2026): wind-down is its own surface, not
 * the Notice → Reframe → Close spine. The work at this beat is forward-
 * anchor (tomorrow's one thing) + optional Deep Regulate breathing +
 * phone-down close. Canon §10: no review content within ~2h of sleep
 * (Walker, Stickgold) — wind-down is forward-only.
 *
 * State machine:
 *   anchor       → user names tomorrow's anchor (or skips)
 *   breathing    → Deep Regulate runs (or user skipped from anchor or skips mid-flow)
 *   close        → "Phone down. See you tomorrow." → return home
 *
 * Persistence happens at the close→home handler (matches Phase 3.5 #2
 * principle: nothing persists until the user reaches close):
 *   - stillform_tomorrow_anchor — if anchor text was entered. Read by
 *     next morning's beat as concierge context per Pillar 3.
 *   - stillform_winddown_today — completion flag, v1-compatible shape.
 *   - stillform_v2_sessions — session record with beat: "wind-down",
 *     precisionName: anchor, mode: "self", selfMode: true. Threads
 *     are NOT updated (wind-down is tomorrow-facing, not today-thread).
 *   - Plausible: Beat Completed, Tomorrow Anchor Set, Breathing Offer
 *     Shown/Tapped/Skipped per the locked telemetry plan.
 *
 * @param {function(object): void} onReturnHome
 *   Called with the wind-down completion payload when the user exits.
 *   Parent (Spine) handles the actual persistence + onExit transition.
 */
export default function WindDown({ onReturnHome }) {
  const [step, setStep] = useState("anchor");
  const [anchorText, setAnchorText] = useState("");
  const [breathingResult, setBreathingResult] = useState(null);
  const breathingOfferTrackedRef = useRef(false);

  const textareaRef = useRef(null);

  // Focus the anchor textarea on mount.
  useEffect(() => {
    if (step === "anchor" && textareaRef.current) {
      const t = setTimeout(() => textareaRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Track breathing offer shown once when we land on the breathing step
  // for the first time (regardless of whether the user taps or skips).
  useEffect(() => {
    if (step === "breathing" && !breathingOfferTrackedRef.current) {
      breathingOfferTrackedRef.current = true;
      try {
        window.plausible?.("Breathing Offer Shown", { props: { beat: "wind-down", pattern: "deep-regulate" } });
      } catch { /* analytics non-fatal */ }
    }
  }, [step]);

  // ---------------- Anchor step ----------------

  const handleAnchorContinue = () => {
    const trimmed = anchorText.trim();
    setAnchorText(trimmed);
    setStep("breathing");
  };

  const handleAnchorSkip = () => {
    // User chose to skip the anchor — proceed to breathing offer with
    // no anchor captured. They can still do the breathing if they want.
    setAnchorText("");
    setStep("breathing");
  };

  // ---------------- Breathing step ----------------

  const handleBreathingStart = () => {
    try {
      window.plausible?.("Breathing Offer Tapped", { props: { beat: "wind-down", pattern: "deep-regulate" } });
    } catch { /* analytics non-fatal */ }
    // The actual breathing session is rendered when breathingResult is
    // null AND user has tapped start. We use a separate state flag.
    setBreathingResult({ status: "running" });
  };

  const handleBreathingSkip = () => {
    try {
      window.plausible?.("Breathing Offer Skipped", { props: { beat: "wind-down", pattern: "deep-regulate" } });
    } catch { /* analytics non-fatal */ }
    setBreathingResult({ status: "skipped" });
    setStep("close");
  };

  const handleBreathingComplete = (meta) => {
    setBreathingResult({ status: "completed", ...meta });
    setStep("close");
  };

  const handleBreathingEndEarly = (meta) => {
    setBreathingResult({ status: "ended-early", ...meta });
    setStep("close");
  };

  // ---------------- Close step ----------------

  const handleReturnHome = () => {
    const payload = {
      anchorText,
      breathingResult,
      completedAt: new Date().toISOString(),
      dateKey: localDateKey(),
    };
    if (typeof onReturnHome === "function") onReturnHome(payload);
  };

  // ---------------- Render ----------------

  if (step === "anchor") {
    return (
      <main className="sf-page sf-page--hero">
        <div className="sf-fade-enter">
          <EditorialBlock
            label="Wind-down"
            headline="Tomorrow's one anchor?"
            headlineSize="lg"
            body="One person, moment, or stretch of tomorrow that's worth being deliberate about."
            labelInfoTitle="Wind-down"
            labelInfoBody="Writing tomorrow's anchor at end-of-day reduces sleep onset latency by ~10 minutes vs writing about completed tasks (Scullin 2018). Forward-direction work closes the day cleanly — your brain consolidates what gets rehearsed last (Walker, Stickgold). Tomorrow's anchor surfaces next morning so the day opens where this one ended."
          />
        </div>

        <div
          className="sf-fade-enter sf-fade-enter--delay-1"
          style={{ marginTop: "var(--sf-space-48)" }}
        >
          <textarea
            ref={textareaRef}
            className="sf-textarea"
            value={anchorText}
            onChange={(e) => setAnchorText(e.target.value)}
            placeholder="Tomorrow, the thing worth being deliberate about is…"
            rows={3}
            aria-label="Tomorrow's anchor"
          />
        </div>

        <div
          className="sf-fade-enter sf-fade-enter--delay-2"
          style={{
            marginTop: "var(--sf-space-32)",
            display: "flex",
            alignItems: "center",
            gap: "var(--sf-space-16)",
          }}
        >
          <Button
            variant="primary"
            onClick={handleAnchorContinue}
            disabled={anchorText.trim().length === 0}
            aria-disabled={anchorText.trim().length === 0}
          >
            Continue
          </Button>
          <button
            type="button"
            onClick={handleAnchorSkip}
            className="sf-link-quiet"
          >
            Skip anchor ›
          </button>
        </div>
      </main>
    );
  }

  if (step === "breathing") {
    // If user has tapped Start, render the BreathingSession.
    if (breathingResult && breathingResult.status === "running") {
      return (
        <BreathingSession
          pattern="deep-regulate"
          onComplete={handleBreathingComplete}
          onSkip={handleBreathingEndEarly}
        />
      );
    }
    // Otherwise show the offer.
    return (
      <main className="sf-page sf-page--hero">
        <div className="sf-fade-enter">
          <EditorialBlock
            label="Wind-down"
            headline="Deep Regulate?"
            headlineSize="lg"
            body="Three minutes of downregulation breathing before you put the phone down."
            labelInfoTitle="Deep Regulate"
            labelInfoBody="4-4-8-2 pattern (inhale 4s · hold 4s · exhale 8s · rest 2s) over ~3 minutes. Extended exhale phase recruits the parasympathetic nervous system and lowers physiological arousal — what the body needs going into sleep (Jerath et al. 2006; Brown & Gerbarg 2005)."
          />
        </div>

        <div
          className="sf-fade-enter sf-fade-enter--delay-2"
          style={{
            marginTop: "var(--sf-space-48)",
            display: "flex",
            alignItems: "center",
            gap: "var(--sf-space-16)",
          }}
        >
          <Button variant="primary" onClick={handleBreathingStart}>
            Start
          </Button>
          <button
            type="button"
            onClick={handleBreathingSkip}
            className="sf-link-quiet"
          >
            Skip to close ›
          </button>
        </div>
      </main>
    );
  }

  // step === "close"
  return (
    <main className="sf-page sf-page--hero">
      <div className="sf-fade-enter">
        <EditorialBlock
          label="Wind-down"
          headline="Phone down."
          headlineSize="lg"
          body={anchorText ? "See you tomorrow." : "Nothing more tonight. See you tomorrow."}
        />
      </div>

      <div
        className="sf-fade-enter sf-fade-enter--delay-2"
        style={{ marginTop: "var(--sf-space-48)" }}
      >
        <Button variant="primary" onClick={handleReturnHome}>
          Done
        </Button>
      </div>
    </main>
  );
}
