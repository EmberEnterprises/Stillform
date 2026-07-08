/*
 * forecastLoop.js — FORECAST-AND-VERIFY (ARLIN'S canonical spec, June 15 2026;
 * built verbatim to her four beats and three guardrails).
 *
 * The closed loop where the USER'S OWN EMOTION is the truth source:
 *   (a) FORECAST — a trigger from a CONFIRMED sequence finding ("Y tends to
 *       follow X") shows up again in the recent signal log. The app meets the
 *       user at the threshold: "X is around again — the last few times, Y
 *       followed. Does it feel like that, or different?" THE QUESTION IS THE
 *       INTERVENTION (acknowledgment breaks the automatic loop — Wells MCT;
 *       active inference: an explicit prior can update).
 *   (b) GET AHEAD — the offer routes to prep (Reframe / the brief).
 *   (c) FOLLOW UP — after the forecast's window passes, one question: "how
 *       did it go?"
 *   (d) BREAK DETECTION WITHOUT FABRICATION — pure observation of ABSENCE:
 *       if the historically-following emotion does NOT appear in the user's
 *       own subsequent log, reflect a POSSIBLE break as a question — "last
 *       few times this drained you; this time it didn't — something
 *       shifted?" Never a claim. The user owns it.
 *
 * THREE GUARDRAILS (Arlin, non-negotiable — structural here, not stylistic):
 *   1. NEVER the AI guessing — every forecast comes ONLY from a finding the
 *      arithmetic found AND THE USER CONFIRMED, re-triggered by tokens in
 *      their own log. This module contains no model call at all.
 *   2. NEVER a verdict — every surfaced line ends as a confirmable question;
 *      the phrasing helpers below only produce questions.
 *   3. NEVER surveillance — the app remembers WITH the user: it only speaks
 *      of tokens the user logged themselves and findings they confirmed;
 *      dismissals are remembered; caps mirror stepOutTrigger's cadence.
 *
 * All reads fail-silent + honest-empty. stillform_-prefixed storage.
 */

import { getConfirmedFindings } from "./discoveryFindings.js";
import { getSignals } from "./signalLog.js";

const STORE_KEY = "stillform_v2_forecast_loop"; // { forecasts: [...] }
const TRIGGER_WINDOW_DAYS = 2;   // the "it's around again" recency window
const FOLLOW_UP_AFTER_MS = 12 * 60 * 60 * 1000;  // ask "how did it go" after 12h
const FOLLOW_UP_EXPIRE_MS = 4 * 24 * 60 * 60 * 1000; // stale after 4 days — drop silently
const REFIRE_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;    // one forecast per finding per 3 days
const MAX_OPEN = 2; // never stack forecasts — one voice, not a feed
const DAY_MS = 24 * 60 * 60 * 1000;

function read() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { forecasts: [] };
    const s = JSON.parse(raw);
    return s && Array.isArray(s.forecasts) ? s : { forecasts: [] };
  } catch {
    return { forecasts: [] };
  }
}
function write(store) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); return true; } catch { return false; }
}

/* ── the arithmetic (mirrors stepOutTrigger's token idiom) ── */

function seqParts(finding) {
  // A confirmed sequence finding: id "seq:from>to"; label carries the quoted
  // user tokens. from = the trigger side, to = the historically-following one.
  if (!finding || typeof finding.id !== "string" || !finding.id.startsWith("seq:")) return null;
  const body = finding.id.slice(4);
  const gt = body.indexOf(">");
  if (gt <= 0) return null;
  const from = body.slice(0, gt).split(":").pop().trim().toLowerCase();
  const to = body.slice(gt + 1).split(":").pop().trim().toLowerCase();
  if (!from || !to) return null;
  return { from, to };
}

function signalEntries() {
  try {
    const s = getSignals();
    return Array.isArray(s) ? s : Array.isArray(s && s.entries) ? s.entries : [];
  } catch {
    return [];
  }
}

function entryTokens(e) {
  const bag = [e.chip, ...(Array.isArray(e.triggers) ? e.triggers : []), ...(Array.isArray(e.body) ? e.body : [])];
  return bag.map((t) => (typeof t === "string" ? t.trim().toLowerCase() : "")).filter(Boolean);
}

function tokenSeenSince(token, sinceMs) {
  for (const e of signalEntries()) {
    if (!e) continue;
    const ts = typeof e.loggedAt === "number" ? e.loggedAt : Date.parse(e.loggedAt);
    if (Number.isFinite(ts) && ts < sinceMs) continue;
    if (entryTokens(e).includes(token)) return true;
  }
  return false;
}

/* ── (a) FORECAST — meet them at the threshold ── */

/**
 * The active forecast, or null. Fires when a CONFIRMED sequence finding's
 * trigger token appears in the last TRIGGER_WINDOW_DAYS of the user's own
 * log, honoring per-finding refire windows and the open cap.
 * Returns { id, findingId, trigger, follows, question } — question ends in
 * "?" by construction (guardrail 2).
 */
export function getActiveForecast(nowMs = Date.now()) {
  const store = read();
  const open = store.forecasts.filter((f) => f && !f.outcome && nowMs - f.at < FOLLOW_UP_EXPIRE_MS);
  if (open.length >= MAX_OPEN) return null;

  let confirmed = [];
  try { confirmed = getConfirmedFindings() || []; } catch { return null; }

  const sinceMs = nowMs - TRIGGER_WINDOW_DAYS * DAY_MS;
  for (const finding of confirmed) {
    const seq = seqParts(finding);
    if (!seq) continue; // co-occurrence findings don't forecast (no direction)

    // refire window per finding
    const last = store.forecasts
      .filter((f) => f && f.findingId === finding.id)
      .sort((a, b) => b.at - a.at)[0];
    if (last && nowMs - last.at < REFIRE_WINDOW_MS) continue;

    if (!tokenSeenSince(seq.from, sinceMs)) continue; // the trigger isn't around

    return {
      id: `${finding.id}@${nowMs}`,
      findingId: finding.id,
      trigger: seq.from,
      follows: seq.to,
      question: `\u201c${seq.from}\u201d is around again — the last few times, \u201c${seq.to}\u201d tended to follow. Does it feel like that this time, or different?`,
    };
  }
  return null;
}

/** Record that a forecast was shown (opens the loop; enables the follow-up). */
export function recordForecastShown(forecast, nowMs = Date.now()) {
  if (!forecast || !forecast.findingId) return false;
  const store = read();
  store.forecasts.push({
    id: forecast.id || `${forecast.findingId}@${nowMs}`,
    findingId: forecast.findingId,
    trigger: forecast.trigger,
    follows: forecast.follows,
    at: nowMs,
    outcome: null, // null = loop open
  });
  if (store.forecasts.length > 30) store.forecasts = store.forecasts.slice(-30);
  return write(store);
}

/* ── (c) FOLLOW UP — "how did it go?" ── */

/**
 * The oldest open forecast whose follow-up window has arrived. Returns
 * { id, trigger, follows, question } or null. Stale opens (past expiry)
 * are dropped silently — never interrogate about last week.
 */
export function getPendingFollowUp(nowMs = Date.now()) {
  const store = read();
  let changed = false;
  store.forecasts = store.forecasts.filter((f) => {
    if (f && !f.outcome && nowMs - f.at >= FOLLOW_UP_EXPIRE_MS) { changed = true; return false; }
    return !!f;
  });
  if (changed) write(store);

  const due = store.forecasts
    .filter((f) => !f.outcome && nowMs - f.at >= FOLLOW_UP_AFTER_MS)
    .sort((a, b) => a.at - b.at)[0];
  if (!due) return null;
  return {
    id: due.id,
    trigger: due.trigger,
    follows: due.follows,
    question: `Earlier, \u201c${due.trigger}\u201d came around. How did it go?`,
  };
}

/* ── (d) BREAK DETECTION — observing an absence, never inferring ── */

/**
 * Close the loop with the user's own report. feel = "same" | "different"
 * (their answer to the follow-up). The break read is DOUBLE-gated: the user
 * said "different" AND the historically-following token has NOT appeared in
 * their log since the forecast. Both must hold — their word plus their
 * record — before even a POSSIBLE break is reflected, and then only as a
 * question they own.
 * Returns { closed, possibleBreak, line } — line is a question or null.
 */
export function recordFollowUpOutcome(id, feel, nowMs = Date.now()) {
  const store = read();
  const f = store.forecasts.find((x) => x && x.id === id && !x.outcome);
  if (!f) return { closed: false, possibleBreak: false, line: null };

  const reported = feel === "different" ? "different" : "same";
  const followedAppeared = tokenSeenSince(f.follows, f.at);
  const possibleBreak = reported === "different" && !followedAppeared;

  f.outcome = { reported, followedAppeared, at: nowMs };
  write(store);

  return {
    closed: true,
    possibleBreak,
    line: possibleBreak
      ? `The last few times \u201c${f.trigger}\u201d came around, \u201c${f.follows}\u201d followed — this time it didn't. Something shifted?`
      : null,
  };
}

/** Closed loops with a possible break — the record of pattern-breaks the user owns. */
export function getBreakMoments() {
  return read().forecasts.filter(
    (f) => f && f.outcome && f.outcome.reported === "different" && f.outcome.followedAppeared === false
  );
}
