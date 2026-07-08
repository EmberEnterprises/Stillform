import React from "react";
import MonoLabel from "../components/MonoLabel.jsx";
import HairlineDivider from "../components/HairlineDivider.jsx";
import { getTrajectoryStats } from "../lib/trajectory.js";
import { getWatchListChips, patternConfidence } from "../lib/biasProfile.js";
import { getGrowthBaseline } from "../lib/growthBaseline.js";
import GrowthArbor from "../components/GrowthArbor.jsx";

/**
 * Roadmap — the trajectory, full screen.
 *
 * Opened by tapping the trajectory line on home (the line is the teaser;
 * this is the territory). Rebuilt June 2 2026 — the old frontend had a
 * roadmap screen; this one is designed fresh against the v2 stores.
 *
 * VOICE LAW: quiet observation, never gamified (no streaks, no progress
 * bars, no badges — canon §6). Partner-credit framing per the locked
 * Progress Library decision: the user's real growth, made together —
 * "you did the work, we held the structure." Professional, no gush.
 *
 * MECHANICAL TRUST: every number derives from local stores the user can
 * audit (sessions, watch list, baseline). No AI involvement — this
 * surface is deliberately mechanical so the numbers can be trusted.
 * Honest absence throughout: sections render only when their stores
 * carry real signal.
 *
 * @param {function(): void} onExit — back to home.
 */
export default function Roadmap({ onExit }) {
  const stats = getTrajectoryStats(); // null below 3 sessions
  const chips = getWatchListChips();
  const baseline = getGrowthBaseline();

  const tiers = { emerging: 0, confirmed: 0, quieting: 0, retired: 0, provisional: 0 };
  const quietLabels = [];
  for (const c of chips) {
    const { tier } = patternConfidence({
      encounterCount: c.encounterCount,
      lastSeen: c.lastSeen,
      addedAt: c.addedAt,
    });
    tiers[tier] = (tiers[tier] || 0) + 1;
    if (tier === "retired" && c.chip?.label) quietLabels.push(c.chip.label);
  }
  const namedCount = chips.length;
  const graduations = baseline?.history?.length || 0;

  return (
    <div style={WRAP}>
      <button type="button" onClick={onExit} style={BACK_BTN} aria-label="Back to home">
        ← Back
      </button>

      <header style={{ marginBottom: "var(--sf-space-24)" }}>
        <MonoLabel size="xs">ROADMAP</MonoLabel>
        <h1 style={H1}>Where the practice has been.</h1>
      </header>

      {!stats ? (
        <p style={BODY}>
          The roadmap draws from your sessions. After a few reps, there will
          be territory to show here.
        </p>
      ) : (
        <>
          {/* D4: the arbor — the practice as a living specimen. */}
          <div style={{ marginBottom: "var(--sf-space-24)" }}>
            <GrowthArbor />
          </div>

          <section style={SECTION}>
            <MonoLabel size="xs" tone="faint">PRACTICE</MonoLabel>
            <p style={STAT_LINE}>
              {stats.sessionCount} rep{stats.sessionCount === 1 ? "" : "s"} ·{" "}
              {stats.daysActive} day{stats.daysActive === 1 ? "" : "s"} active
              {stats.recentNamingsCount > 0
                ? ` · ${stats.recentNamingsCount} in the last week`
                : ""}
            </p>
            <p style={NOTE}>
              Reps are sittings, not scores. The count is here because the
              volume of looking is what rewires — not because bigger is the
              point.
            </p>
          </section>

          {namedCount > 0 && (
            <section style={SECTION}>
              <HairlineDivider />
              <div style={{ marginTop: "20px" }}>
                <MonoLabel size="xs" tone="faint">PATTERNS</MonoLabel>
                <p style={STAT_LINE}>
                  {namedCount} named
                  {tiers.confirmed > 0 ? ` · ${tiers.confirmed} confirmed in session work` : ""}
                  {tiers.quieting > 0 ? ` · ${tiers.quieting} going quiet` : ""}
                  {tiers.retired > 0 ? ` · ${tiers.retired} gone quiet` : ""}
                </p>
                {quietLabels.length > 0 && (
                  <p style={NOTE}>
                    Gone quiet: {quietLabels.join(" · ")}. Quiet means weeks of
                    sessions without it showing — observed, not declared.
                  </p>
                )}
              </div>
            </section>
          )}

          {baseline && (
            <section style={SECTION}>
              <HairlineDivider />
              <div style={{ marginTop: "20px" }}>
                <MonoLabel size="xs" tone="faint">BASELINE</MonoLabel>
                <p style={STAT_LINE}>{baseline.label}</p>
                {graduations > 0 && (
                  <p style={NOTE}>
                    {graduations} graduation{graduations === 1 ? "" : "s"} behind
                    it — each one moved on evidence you approved.
                  </p>
                )}
              </div>
            </section>
          )}

          <HairlineDivider />
          <p style={{ ...NOTE, marginTop: "20px" }}>
            You did the work. The structure held it. The map is just what
            that built.
          </p>
        </>
      )}
    </div>
  );
}

/* ---- styles ---- */

const WRAP = {
  minHeight: "100dvh",
  padding:
    "calc(env(safe-area-inset-top, 0px) + var(--sf-space-24)) var(--sf-space-24) calc(env(safe-area-inset-bottom, 0px) + var(--sf-space-32))",
  maxWidth: "520px",
  margin: "0 auto",
};

const BACK_BTN = {
  background: "transparent",
  border: "none",
  color: "var(--sf-text-quiet)",
  fontFamily: "var(--sf-font-mono)",
  fontSize: "13px",
  letterSpacing: "0.08em",
  padding: "12px 0",
  marginBottom: "var(--sf-space-8)",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
};

const H1 = {
  margin: "var(--sf-space-12) 0 0",
  color: "var(--sf-text-primary)",
  fontFamily: "var(--sf-font-serif)",
  fontSize: "var(--sf-text-display-sm, 28px)",
  lineHeight: 1.2,
  fontWeight: 300,
};

const SECTION = { marginBottom: "var(--sf-space-24)" };

const STAT_LINE = {
  margin: "var(--sf-space-8) 0 var(--sf-space-8)",
  color: "var(--sf-text-primary)",
  fontFamily: "var(--sf-font-serif)",
  fontSize: "20px",
  lineHeight: 1.35,
  fontWeight: 300,
};

const BODY = {
  margin: 0,
  color: "var(--sf-text-cream)",
  fontFamily: "var(--sf-font-sans)",
  fontSize: "var(--sf-text-body-md)",
  lineHeight: "var(--sf-leading-body)",
  fontWeight: 300,
};

const NOTE = {
  margin: 0,
  color: "var(--sf-text-quiet)",
  fontFamily: "var(--sf-font-sans)",
  fontSize: "14px",
  lineHeight: "var(--sf-leading-body)",
  fontWeight: 300,
};
