import React, { useEffect, useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import Button from "../components/Button.jsx";
import AppHeader from "../components/AppHeader.jsx";
import QuickBreathe from "../components/QuickBreathe.jsx";
import HomeFooter from "../components/HomeFooter.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import { getCurrentBeat, getBeatOverride } from "../lib/beat.js";

/**
 * Home — the journey entry.
 *
 * Per STILLFORM_CANON.md §10: "One element per beat. Sequential transitions,
 * not stacked panels. The home renders ONE current-beat surface per view."
 *
 * Beats render mutually exclusively:
 *   morning   — open the day, run the check-in
 *   main      — begin a session (Notice → Reframe → Close)
 *   eod       — close the day, two-sentence takeaway
 *   wind-down — phone down, no review content (canon §10)
 *
 * Persistent across beats:
 *   - Stillform wordmark (AppHeader, top)
 *   - Quick Breathe pill (bottom-right — stabilization safety valve, ONE exception)
 *   - Quiet Progress / Library / Settings links (HomeFooter, bottom)
 *
 * Copy follows canon's "surface gets practice action, science name stays
 * in code" rule. No "Composure is the foundation." No "you are the
 * architect." No wellness greeting. No status strips.
 *
 * Phase 1 scope: visual + structural only. Button onClick is a no-op —
 * the Notice → Reframe → Close spine routes in Phase 2.
 *
 * Debug: ?beat=morning|main|eod|wind-down forces a specific beat for audit.
 */
export default function Home() {
  // Re-detect beat on mount + when localStorage signals change. For Phase 1
  // a single read on mount is sufficient for the visual audit; production
  // will likely subscribe to a TimeKeeper tick or visibility change.
  const [beat, setBeat] = useState(() => getBeatOverride() || getCurrentBeat());

  useEffect(() => {
    // If the user comes back to the tab after time has passed, re-detect.
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        setBeat(getBeatOverride() || getCurrentBeat());
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  return (
    <>
      <AppHeader />

      <main className="sf-page sf-page--hero">
        <div className="sf-fade-enter">
          {beat === "morning" ? <MorningBeat /> : null}
          {beat === "main" ? <MainBeat /> : null}
          {beat === "eod" ? <EodBeat /> : null}
          {beat === "wind-down" ? <WindDownBeat /> : null}
        </div>
      </main>

      <div className="sf-fade-enter sf-fade-enter--delay-2">
        <HomeFooter onNavigate={() => { /* Phase 3+ */ }} />
      </div>

      <QuickBreathe onTap={() => { /* Phase 2 wires the actual breath tool */ }} />

      {/* Phase 1 audit indicator — removed when surfaces become functional in Phase 2. */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: "var(--sf-space-8)",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      >
        <MonoLabel size="xs" tone="faint">
          v2 · phase 1 · visual audit
        </MonoLabel>
      </div>
    </>
  );
}

/* -----------------------------------------------------------------------
 * BEAT SURFACES
 *
 * Each beat is its own component so the file structure mirrors the canon:
 * one element per beat, sequential. Adding a beat means adding a component,
 * not adding panels to an existing surface.
 * -------------------------------------------------------------------- */

function MorningBeat() {
  return (
    <BeatLayout
      label="Today · morning"
      headline="Open the day."
      body="Three minutes to name where you start, so the day has a shape."
      actionLabel="Begin check-in"
    />
  );
}

function MainBeat() {
  return (
    <BeatLayout
      label="Today"
      headline="Begin a session."
      body="Notice what's present. Build a precise name for it. Add it to your library."
      actionLabel="Begin"
    />
  );
}

function EodBeat() {
  return (
    <BeatLayout
      label="Today · evening"
      headline="Close the day."
      body="Two sentences for what today taught. It accumulates."
      actionLabel="Close"
    />
  );
}

/**
 * WindDownBeat — no review content per canon §10. Pre-sleep cognitive
 * consolidation (Walker, Stickgold) means content the user processes near
 * sleep affects sleep quality. So: no primary action, no review prompt,
 * no "begin." Just a quiet directive and a forward continuity line.
 */
function WindDownBeat() {
  return (
    <BeatLayout
      label="Tonight"
      headline="Phone down."
      body="No review now. Tomorrow's practice begins where today's ends."
    />
  );
}

/**
 * BeatLayout — internal layout primitive shared by all four beats.
 * Keeps spacing rhythm and action treatment consistent across beats.
 * If a beat has no action, action area is omitted entirely.
 */
function BeatLayout({ label, headline, body, actionLabel }) {
  return (
    <div>
      <EditorialBlock
        label={label}
        headline={headline}
        headlineSize="lg"
        body={body}
      />

      {actionLabel ? (
        <div style={{ marginTop: "var(--sf-space-48)" }}>
          <Button variant="primary" onClick={() => { /* Phase 2 wires the spine */ }}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
