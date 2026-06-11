/*
 * growthBaseline.js — the user's current capacity baseline.
 *
 * A single label describing where the user's practice baseline sits
 * (e.g., "names the spiral before it closes"). The ONLY mutation is
 * graduation — the AI Mediation pipeline proposes moving the baseline
 * forward when there are 14+ days of evidence of sustained growth
 * (backend contract: graduate { newBaselineLabel, evidence_summary
 * <200 chars }), and it applies only on the user's explicit approval.
 *
 * Prior baselines are kept in history — graduation is visible growth,
 * and the trail is part of the evidence (same honesty rule as the
 * pattern lifecycle: claims must be backed, history is never erased).
 *
 * Storage: stillform_v2_growth_baseline →
 *   { label, since, history: [{ label, since, graduatedAt, evidenceSummary }] }
 */

const KEY = "stillform_v2_growth_baseline";

/** Current baseline object, or null if none has been set yet. */
export function getGrowthBaseline() {
  try {
    const raw = localStorage.getItem(KEY);
    const obj = raw ? JSON.parse(raw) : null;
    return obj && typeof obj === "object" && typeof obj.label === "string" ? obj : null;
  } catch {
    return null;
  }
}

/**
 * Graduate the baseline forward (mediation-approved only).
 * @param {{newBaselineLabel: string, evidenceSummary?: string}} input
 * @returns {object|null} the new baseline, or null if invalid.
 */
export function graduateBaseline({ newBaselineLabel, evidenceSummary = "" } = {}) {
  const label = typeof newBaselineLabel === "string" ? newBaselineLabel.trim().slice(0, 120) : "";
  if (label.length < 4) return null;
  const now = new Date().toISOString();
  const prev = getGrowthBaseline();
  const history = prev
    ? [
        ...(Array.isArray(prev.history) ? prev.history : []),
        {
          label: prev.label,
          since: prev.since || null,
          graduatedAt: now,
          evidenceSummary: String(evidenceSummary || "").slice(0, 200),
        },
      ]
    : [];
  const next = { label, since: now, history };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    return null;
  }
  return next;
}
