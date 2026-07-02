import React from "react";
import { getSessionCount } from "../lib/sessions.js";
import { getConfirmedFindings } from "../lib/discoveryFindings.js";
import { getCapacitiesSummary } from "../lib/capacitiesProfile.js";
import { getTriggerProfile } from "../lib/triggerProfile.js";

/**
 * StillFormMark — the signature object (2026-07-01, Arlin: "it doesn't feel
 * like holy shit yet"). The app is named Stillform; this is the form.
 *
 * A quiet generative mark, brass line on the dark ground, that IS the user's
 * record made visible — grown deterministically, never randomly:
 *   - a breathing base ring (everyone, day one)
 *   - one orbital THREAD per confirmed finding (the math they confirmed)
 *   - one NODE per capacity they've measured
 *   - inner-structure density that deepens with session count
 * Day one it's a simple breathing ring. Month six it's an intricate form
 * nobody else has. Their data moat, felt at a glance.
 *
 * RESTRAINT LAWS: modest size, hairline strokes, near-invisible fills, one
 * slow breath (~9s), prefers-reduced-motion → static. No color noise, no
 * gamification, no numbers. Deterministic from the record (same record, same
 * form). All reads fail-safe → the day-one ring, never a crash.
 * Self-contained: one component + one keyframe; one-commit revertable.
 */

function safe(fn, fb) { try { const v = fn(); return v === undefined ? fb : v; } catch { return fb; } }

// Deterministic pseudo-random stream from an integer seed (mulberry32).
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function StillFormMark() {
  const sessions = safe(() => Number(getSessionCount()) || 0, 0);
  const findings = safe(() => getConfirmedFindings().length, 0);
  const capacities = safe(() => getCapacitiesSummary().filter((c) => c.taken).length, 0);
  const triggers = safe(() => getTriggerProfile().triggers.length, 0);

  const seed = 7 + sessions * 31 + findings * 131 + capacities * 517 + triggers * 97;
  const r = rng(seed);

  const S = 200, C = S / 2;
  const paths = [];

  // Base ring — always present. The still point.
  paths.push(
    <circle key="base" cx={C} cy={C} r={54} fill="none"
      stroke="var(--sf-accent-line)" strokeWidth="0.75" />
  );

  // Session depth: faint inner rings, one per ~8 sessions (cap 5) — the
  // record thickening from the inside.
  const innerRings = Math.min(5, Math.floor(sessions / 8));
  for (let i = 0; i < innerRings; i++) {
    paths.push(
      <circle key={`in-${i}`} cx={C} cy={C} r={46 - i * 7} fill="none"
        stroke="var(--sf-accent-line)" strokeWidth="0.4" opacity={0.55 - i * 0.08} />
    );
  }

  // Findings: orbital threads — elliptical arcs at deterministic tilts (cap 6).
  const threads = Math.min(6, findings);
  for (let i = 0; i < threads; i++) {
    const tilt = Math.round(r() * 180);
    const rx = 62 + Math.round(r() * 22);
    const ry = 30 + Math.round(r() * 18);
    paths.push(
      <ellipse key={`th-${i}`} cx={C} cy={C} rx={rx} ry={ry} fill="none"
        stroke="var(--sf-accent-line)" strokeWidth="0.4" opacity="0.6"
        transform={`rotate(${tilt} ${C} ${C})`} />
    );
  }

  // Capacities: still nodes on the base ring (cap 4) — the measured points.
  for (let i = 0; i < Math.min(4, capacities); i++) {
    const ang = (r() * Math.PI * 2);
    const x = C + Math.cos(ang) * 54;
    const y = C + Math.sin(ang) * 54;
    paths.push(
      <circle key={`nd-${i}`} cx={x} cy={y} r={2}
        fill="var(--sf-accent)" opacity="0.55" />
    );
  }

  // Triggers named: hairline radial ticks just outside the ring (cap 8) —
  // the named perimeter.
  for (let i = 0; i < Math.min(8, triggers); i++) {
    const ang = r() * Math.PI * 2;
    const x1 = C + Math.cos(ang) * 57, y1 = C + Math.sin(ang) * 57;
    const x2 = C + Math.cos(ang) * 61, y2 = C + Math.sin(ang) * 61;
    paths.push(
      <line key={`tk-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="var(--sf-accent-line)" strokeWidth="0.5" opacity="0.7" />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="sf-stillform-mark"
      style={{ display: "flex", justifyContent: "center", margin: "0 0 var(--sf-space-24)" }}
    >
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} className="sf-stillform-breathe">
        {paths}
      </svg>
    </div>
  );
}
