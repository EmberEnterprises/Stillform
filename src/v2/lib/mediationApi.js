/*
 * mediationApi.js — AI Mediation client (Concierge Cluster M1).
 *
 * One propose_update call lights BOTH dark concierge surfaces:
 *   - proposals → the approval queue (user-led; nothing applies without
 *     an explicit Approve)
 *   - observation → the Mirror strip (via setMirrorObservation)
 *
 * Spec: CONCIERGE_CLUSTER_SPEC.md (v1.0, decisions locked June 2 2026):
 *   - Trigger cadence = ALL THREE, evaluated at one gate (home mount):
 *       (a) EOD completed today and not yet mediated today
 *       (b) ≥3 sessions closed since the last mediation run
 *       (c) ≥24h since the last run (home-open liveness)
 *     plus a 2h global burst-guard so triggers never stack.
 *   - Mirror evidence floor = 5 real sessions (honest absence below).
 *   - Queue lives in BOTH placements (Mirror tap-through + My Progress).
 *
 * v1 SCOPE (deliberate): only `trigger_profile` proposals enter the
 * queue. The backend also proposes against `anchors` and
 * `growth_baseline`, but those stores don't exist in the rebuilt
 * frontend yet — queuing them would let a user "approve" into a void.
 * They join when their stores are rebuilt (spec M5).
 *
 * Doctrine held: user-led approval; reasoning shown verbatim; decline is
 * remembered (suppression via existingPendingTargets); Self-Mode
 * fallback — any failure leaves the queue and Mirror unchanged and the
 * practice unaffected (fire-and-forget, swallow errors).
 */

import { getTriggerProfile, addTrigger, updateTrigger, deleteTrigger } from "./triggerProfile.js";
import { formatAnchorsForAI, addAnchor, retireAnchor } from "./anchors.js";
import { getGrowthBaseline, graduateBaseline } from "./growthBaseline.js";
import { getSessionCount, formatRecentSessionsForAI } from "./sessions.js";
import { setMirrorObservation } from "./mirror.js";

const QUEUE_KEY = "stillform_v2_mediation_queue";
const LAST_RUN_KEY = "stillform_v2_mediation_last_run";

const MIRROR_SESSION_FLOOR = 5;        // Arlin, June 2 — matches lifecycle floor
const EVERY_N_SESSIONS = 3;
const HOME_OPEN_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const BURST_GUARD_MS = 2 * 60 * 60 * 1000;

/* ---------------- queue store ---------------- */

export function getQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    const q = raw ? JSON.parse(raw) : [];
    return Array.isArray(q) ? q : [];
  } catch {
    return [];
  }
}

export function getPendingProposals() {
  return getQueue().filter((p) => p.status === "pending");
}

function saveQueue(q) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-60)));
  } catch {
    /* storage full/unavailable — practice unaffected */
  }
}

/* ---------------- run gate (Arlin's all-three cadence) ---------------- */

function readLastRun() {
  try {
    const raw = localStorage.getItem(LAST_RUN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLastRun(meta) {
  try {
    localStorage.setItem(LAST_RUN_KEY, JSON.stringify(meta));
  } catch { /* non-fatal */ }
}

function isSameLocalDay(isoA, isoB) {
  const a = new Date(isoA); const b = new Date(isoB);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/**
 * Evaluate Arlin's three triggers at the single home-mount gate.
 * Returns the reason string when a run is due, else null.
 */
export function mediationRunDue() {
  const now = new Date();
  const last = readLastRun();
  const sessionCount = getSessionCount();

  // Nothing to observe yet — don't spend before there's any work to read.
  if (sessionCount < 1) return null;

  if (last) {
    const sinceMs = now - new Date(last.at);
    if (sinceMs < BURST_GUARD_MS) return null; // burst-guard: triggers never stack
    if (sessionCount >= (last.sessionCount ?? 0) + EVERY_N_SESSIONS) return "every-3rd-close";
    let eodToday = false;
    try { eodToday = !!localStorage.getItem("stillform_eod_today"); } catch { /* no flag */ }
    if (eodToday && !isSameLocalDay(last.at, now.toISOString())) return "eod";
    if (sinceMs >= HOME_OPEN_COOLDOWN_MS) return "home-open-24h";
    return null;
  }
  return "first-run";
}

/* ---------------- the call (one call, two lights) ---------------- */

export async function runMediation(reason = "manual") {
  const sessionCount = getSessionCount();
  const pendingTargets = getPendingProposals().map((p) => `${p.target}:${p.operation}:${p.targetItemId || p.proposed?.label || ""}`);
  const declined = getQueue().filter((p) => p.status === "declined").slice(-15)
    .map((p) => `${p.target}:${p.operation}:${p.targetItemId || p.proposed?.label || ""}`);

  let res;
  try {
    res = await fetch("/.netlify/functions/reframe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "propose_update",
        triggerProfile: getTriggerProfile(),
        anchors: formatAnchorsForAI(),
        growthBaseline: getGrowthBaseline(),
        recentReframes: formatRecentSessionsForAI(8),
        sessionCount,
        existingPendingTargets: [...pendingTargets, ...declined],
      }),
    });
  } catch {
    return { ran: false }; // offline — practice unaffected
  }
  if (!res.ok) return { ran: false };

  let data;
  try { data = await res.json(); } catch { return { ran: false }; }

  // Record the run regardless of yield — the gate cadence is about looking,
  // not about finding something every time.
  writeLastRun({ at: new Date().toISOString(), sessionCount, reason });

  // Proposals → queue (M5: all three targets — their stores now exist).
  const incoming = (Array.isArray(data.proposals) ? data.proposals : [])
    .filter((p) => p && ["trigger_profile", "anchors", "growth_baseline"].includes(p.target))
    .map((p) => ({
      id: `med_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      receivedAt: new Date().toISOString(),
      status: "pending",
      target: p.target,
      operation: p.operation,
      targetItemId: p.targetItemId || null,
      proposed: p.proposed || {},
      reasoning: p.reasoning || "",
      evidence: Array.isArray(p.evidence) ? p.evidence : [],
    }));
  if (incoming.length) saveQueue([...getQueue(), ...incoming]);

  // Observation → Mirror, only past the 5-session evidence floor.
  if (typeof data.observation === "string" && data.observation && sessionCount >= MIRROR_SESSION_FLOOR) {
    try {
      setMirrorObservation({ observation: data.observation, evidenceCount: sessionCount });
    } catch { /* Mirror stays honest-absent */ }
  }

  return { ran: true, proposals: incoming.length, observation: !!data.observation };
}

/** Fire-and-forget gate check for the home-mount call site. */
export function maybeRunMediation() {
  const reason = mediationRunDue();
  if (!reason) return;
  runMediation(reason).catch(() => {});
}

/* ---------------- approve / decline (user-led, the only writers) ---------------- */

export function approveProposal(id) {
  const q = getQueue();
  const p = q.find((x) => x.id === id && x.status === "pending");
  if (!p) return { applied: false };
  let applied = false;
  try {
    if (p.target === "trigger_profile") {
      if (p.operation === "add" && p.proposed?.label) {
        addTrigger({ label: p.proposed.label, category: p.proposed.category });
        applied = true;
      } else if (p.operation === "update" && p.targetItemId && p.proposed) {
        updateTrigger(p.targetItemId, p.proposed);
        applied = true;
      } else if (p.operation === "retire" && p.targetItemId) {
        deleteTrigger(p.targetItemId);
        applied = true;
      }
    } else if (p.target === "anchors") {
      if (p.operation === "add" && p.proposed?.cue && p.proposed?.action) {
        applied = !!addAnchor({ cue: p.proposed.cue, action: p.proposed.action, source: "mediation" });
      } else if (p.operation === "retire" && p.targetItemId) {
        applied = retireAnchor(p.targetItemId);
      }
    } else if (p.target === "growth_baseline" && p.operation === "graduate") {
      applied = !!graduateBaseline({
        newBaselineLabel: p.proposed?.newBaselineLabel,
        evidenceSummary: p.proposed?.evidence_summary,
      });
    }
  } catch { applied = false; }
  p.status = applied ? "approved" : "failed";
  p.resolvedAt = new Date().toISOString();
  saveQueue(q);
  return { applied };
}

export function declineProposal(id) {
  const q = getQueue();
  const p = q.find((x) => x.id === id && x.status === "pending");
  if (!p) return;
  p.status = "declined"; // remembered → suppressed on future runs
  p.resolvedAt = new Date().toISOString();
  saveQueue(q);
}
