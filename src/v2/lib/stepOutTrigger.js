/*
 * stepOutTrigger — the VALUES-CLEAN trigger for the Step Out disruptor.
 *
 * The pattern-disruption spec (May 3) called for AI-PUSH notifications when an
 * AI judges a loop across data points. A LATER locked decision (May 26) KILLED
 * AI-push as "the engagement-nudge pattern Stillform exists not to be," and the
 * keystone doctrine is "the engine finds it by MATH; the user decides; the AI
 * voices, never detects." So this trigger is DETERMINISTIC and USER-LED, not a
 * push and not an AI judgment:
 *
 *   DETECTION  — a pattern the user ALREADY CONFIRMED (discoveryFindings) whose
 *                own token has RECURRED in recent signals (signalLog). Pure
 *                arithmetic over the user's own confirmed tokens. No inference.
 *   SURFACE    — a gentle PROMPT-ON-OPEN offer (the spec's clean channel), never
 *                a push, never mid-session funnelling. Dismissable, capped.
 *   CADENCE    — the spec's dismissal state machine: offer → dismiss → one
 *                re-offer after a window → dismiss → closed for that loop.
 *
 * Pure data + a small dismissal store. No React. Home reads getActiveLoopOffer()
 * on open and renders the offer; the offer opens StepOutOverlay.
 *
 * ⚠️ FIRST-PASS DESIGN DEFAULTS (flagged for Arlin — tune in one place below):
 *   ACTIVE_WINDOW_DAYS  how recently a confirmed loop's token must recur to
 *                       count as "active now" (default 3)
 *   MAX_DISMISSALS      dismissals before a loop instance is closed (spec = 2)
 *   REFIRE_WINDOW_MS    quiet gap before the same loop may be offered again
 *                       (default 1 day)
 */

import { getConfirmedFindings } from "./discoveryFindings.js";
import { getSignals } from "./signalLog.js";

// ── tunable defaults (Arlin's §7 design calls) ──────────────────────────────
const ACTIVE_WINDOW_DAYS = 3;
const MAX_DISMISSALS = 2;
const REFIRE_WINDOW_MS = 24 * 60 * 60 * 1000; // 1 day

const STORE_KEY = "stillform_stepout_dismissals";
const DAY_MS = 24 * 60 * 60 * 1000;

// ── fail-silent localStorage (mirrors the other stores) ─────────────────────
function safeGet(key) {
  try {
    return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}
function safeSet(key, val) {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(key, val);
    return true;
  } catch {
    return false;
  }
}

function readDismissals() {
  const raw = safeGet(STORE_KEY);
  if (!raw) return {};
  try {
    const s = JSON.parse(raw);
    return s && typeof s === "object" ? s : {};
  } catch {
    return {};
  }
}
function writeDismissals(store) {
  safeSet(STORE_KEY, JSON.stringify(store || {}));
}

// ── token helpers ───────────────────────────────────────────────────────────

/**
 * The user's own token VALUES for a confirmed finding. The label carries them
 * in curly quotes (\u201c…\u201d) — these originate from the same chip/trigger
 * vocabulary the signal log records, so they match the user's discrete tokens.
 * Falls back to parsing the deterministic id (seq:from>to | co:lo|hi).
 */
function findingTokens(finding) {
  const out = new Set();
  const label = finding && typeof finding.label === "string" ? finding.label : "";
  const quoted = label.match(/\u201c([^\u201d]+)\u201d/g) || [];
  quoted.forEach((q) => {
    const v = q.replace(/[\u201c\u201d]/g, "").trim().toLowerCase();
    if (v) out.add(v);
  });
  // fallback: parse the id's encoded keys if the label yielded nothing
  if (out.size === 0 && finding && typeof finding.id === "string") {
    finding.id
      .replace(/^seq:|^co:/, "")
      .split(/>|\|/)
      .forEach((k) => {
        const v = String(k || "").trim().toLowerCase();
        if (v) out.add(v);
      });
  }
  return out;
}

/** The discrete tokens seen in signals within the active window, lowercased. */
function recentSignalTokens() {
  let signals = [];
  try {
    const s = getSignals();
    signals = Array.isArray(s) ? s : Array.isArray(s && s.entries) ? s.entries : [];
  } catch {
    signals = [];
  }
  const cutoff = Date.now() - ACTIVE_WINDOW_DAYS * DAY_MS;
  const tokens = new Set();
  signals.forEach((e) => {
    if (!e) return;
    // keep entries with no/unparseable timestamp (treat as recent); else gate
    // by window. signalLog writes loggedAt as an ISO string; accept a numeric
    // epoch too, for resilience.
    const ts = typeof e.loggedAt === "number" ? e.loggedAt : Date.parse(e.loggedAt);
    if (Number.isFinite(ts) && ts < cutoff) return;
    const bag = [e.chip, ...(Array.isArray(e.triggers) ? e.triggers : []), ...(Array.isArray(e.body) ? e.body : [])];
    bag.forEach((t) => {
      const v = typeof t === "string" ? t.trim().toLowerCase() : "";
      if (v) tokens.add(v);
    });
  });
  return tokens;
}

// ── cadence (the dismissal state machine) ───────────────────────────────────

function eligible(findingId, store) {
  const rec = store[findingId];
  if (!rec) return true; // never offered
  if ((rec.dismissals || 0) >= MAX_DISMISSALS) return false; // closed
  if (typeof rec.lastOfferedAt === "number" && Date.now() - rec.lastOfferedAt < REFIRE_WINDOW_MS) {
    return false; // too soon since last surfaced
  }
  return true;
}

/**
 * getActiveLoopOffer — the deterministic prompt-on-open decision.
 * Returns { findingId, label } for the most-recently-confirmed loop that is
 * BOTH active (its own token recurred recently) AND eligible (cadence allows),
 * or null. Reading is side-effect-free; Home marks it offered when it surfaces.
 */
export function getActiveLoopOffer() {
  let confirmed = [];
  try {
    confirmed = getConfirmedFindings() || [];
  } catch {
    confirmed = [];
  }
  if (!Array.isArray(confirmed) || confirmed.length === 0) return null;

  const recent = recentSignalTokens();
  if (recent.size === 0) return null; // nothing active right now

  const store = readDismissals();
  const ordered = confirmed
    .slice()
    .sort((a, b) => (b && b.confirmedAt ? b.confirmedAt : 0) - (a && a.confirmedAt ? a.confirmedAt : 0));

  for (const f of ordered) {
    if (!f || !f.id) continue;
    if (!eligible(f.id, store)) continue;
    const tokens = findingTokens(f);
    let active = false;
    for (const t of tokens) {
      if (recent.has(t)) {
        active = true;
        break;
      }
    }
    if (active) {
      return { findingId: f.id, label: typeof f.label === "string" ? f.label : null };
    }
  }
  return null;
}

/** Mark that the offer surfaced (gates the re-fire window; not a dismissal). */
export function markStepOutOffered(findingId) {
  if (!findingId) return;
  const store = readDismissals();
  const rec = store[findingId] || { dismissals: 0, lastOfferedAt: 0 };
  rec.lastOfferedAt = Date.now();
  store[findingId] = rec;
  writeDismissals(store);
}

/** Mark a dismissal ("not now") — advances the state machine toward closed. */
export function markStepOutDismissed(findingId) {
  if (!findingId) return;
  const store = readDismissals();
  const rec = store[findingId] || { dismissals: 0, lastOfferedAt: 0 };
  rec.dismissals = (rec.dismissals || 0) + 1;
  rec.lastOfferedAt = Date.now();
  store[findingId] = rec;
  writeDismissals(store);
}

/** Mark that the user accepted + did the disruptor — quiets it for the window. */
export function markStepOutAccepted(findingId) {
  if (!findingId) return;
  const store = readDismissals();
  const rec = store[findingId] || { dismissals: 0, lastOfferedAt: 0 };
  rec.lastOfferedAt = Date.now(); // re-fire window applies; not counted as dismissal
  store[findingId] = rec;
  writeDismissals(store);
}

export const _config = { ACTIVE_WINDOW_DAYS, MAX_DISMISSALS, REFIRE_WINDOW_MS };
