import React from "react";
import { getTrajectoryStats } from "../lib/trajectory.js";
import { getWatchListChips } from "../lib/biasProfile.js";
import { getGrowthBaseline } from "../lib/growthBaseline.js";

/**
 * GrowthArbor — DESIGN SYSTEM D4 (June 2 2026): GROWTH belongs to the
 * Cajal arbor. The practice drawn as a neural specimen.
 *
 * HONESTY CONTRACT (mirror of TraceUnit's):
 *   - Every branch is a real, earned item: one branch per watch-list
 *     pattern, one per graduated baseline. Nothing decorative.
 *   - Branch order along the trunk = age (oldest nearest the soma).
 *   - Branch length = evidence (encounterCount, capped), so worked
 *     patterns reach further than newly added ones.
 *   - ACCENT LAW: oxblood marks ONLY new growth — items with activity in
 *     the last 7 days (lastSeen / graduatedAt). Everything else is brass.
 *   - Zero items → zero arbor (returns null). The first branch is earned,
 *     not drawn in advance. No soma without at least one session.
 *
 * Layout is deterministic from the data (index-based curvature, no
 * randomness) so the same practice always draws the same specimen.
 */

const W = 380;
const H = 150;
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

function isRecent(iso) {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) && Date.now() - t < SEVEN_DAYS;
}

function buildItems() {
  const items = [];
  try {
    for (const c of getWatchListChips()) {
      items.push({
        addedAt: c.addedAt || null,
        evidence: Math.min(Number(c.encounterCount) || 0, 12),
        recent: isRecent(c.lastSeen),
      });
    }
  } catch { /* fail soft */ }
  try {
    const gb = getGrowthBaseline();
    const history = Array.isArray(gb?.history) ? gb.history : [];
    for (const b of history) {
      items.push({
        addedAt: b.graduatedAt || null,
        evidence: 8, // a graduated baseline is substantial growth by definition
        recent: isRecent(b.graduatedAt),
      });
    }
  } catch { /* fail soft */ }
  items.sort((a, b) => new Date(a.addedAt || 0) - new Date(b.addedAt || 0));
  return items;
}

export default function GrowthArbor() {
  let stats = null;
  try { stats = getTrajectoryStats(); } catch { stats = null; }
  const items = buildItems();
  const reps = Number(stats?.sessionCount) || 0;

  // The first branch is earned, not drawn in advance.
  if (reps === 0 || items.length === 0) return null;

  // Trunk: soma low-left, rising gently right. Branches leave it at
  // even parameters, alternating sides, length by evidence.
  const somaX = 26;
  const somaY = H - 26;
  const trunkEndX = W - 60;
  const trunkEndY = 44;
  const trunkAt = (t) => ({
    x: somaX + (trunkEndX - somaX) * t,
    y: somaY + (trunkEndY - somaY) * t * (0.7 + 0.3 * t),
  });

  const n = items.length;
  const branches = items.map((item, i) => {
    const t = (i + 1) / (n + 1);
    const root = trunkAt(t);
    const up = i % 2 === 0; // alternate sides, deterministic
    const len = 34 + item.evidence * 5;
    const tipX = Math.min(root.x + len * 0.9, W - 8);
    const tipY = up ? Math.max(root.y - len * 0.8, 8) : Math.min(root.y + len * 0.45, H - 8);
    const cx = root.x + len * 0.45;
    const cy = up ? root.y - len * 0.25 : root.y + len * 0.18;
    return {
      d: `M${root.x.toFixed(1)},${root.y.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)}`,
      tipX, tipY,
      recent: item.recent,
    };
  });

  const newCount = branches.filter((b) => b.recent).length;
  const trunkD = `M${somaX},${somaY} Q${somaX + (trunkEndX - somaX) * 0.45},${somaY - 14} ${trunkEndX},${trunkEndY}`;

  return (
    <figure style={{ margin: 0 }} aria-label={`Your practice drawn as a growing arbor: ${n} branches, ${newCount} new this week`}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }} className="sf-arbor" aria-hidden="true">
        <circle cx={somaX} cy={somaY} r="5.5" style={{ fill: "var(--sf-accent)" }} />
        <path d={trunkD} style={{ stroke: "var(--sf-accent)", strokeWidth: 1.3 }} />
        {branches.map((b, i) => (
          <path
            key={i}
            d={b.d}
            style={{
              stroke: b.recent ? "var(--sf-growth)" : "var(--sf-accent)",
              strokeWidth: b.recent ? 0.85 : 0.95,
            }}
          />
        ))}
        {branches.filter((b) => b.recent).map((b, i) => (
          <circle key={`bud-${i}`} cx={b.tipX} cy={b.tipY} r="2.6" style={{ fill: "var(--sf-growth)" }} />
        ))}
      </svg>
      <figcaption
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginTop: "var(--sf-space-8)",
          fontFamily: "var(--sf-font-mono)",
          fontSize: "9px",
          letterSpacing: "0.22em",
          color: "var(--sf-text-faint)",
          textTransform: "uppercase",
        }}
      >
        <span>{n} {n === 1 ? "branch" : "branches"} · {reps} sittings</span>
        {newCount > 0 ? (
          <span style={{ color: "var(--sf-growth)" }}>{newCount} new this week</span>
        ) : null}
      </figcaption>
    </figure>
  );
}
