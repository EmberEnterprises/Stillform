/*
 * strengths.js — the both-authored "what's strong in you" data layer.
 *
 * A strength = one real thing you're good at, named on purpose, with:
 *   - whereItShows  — where it already shows up in you
 *   - leanInto      — one way to use it deliberately (the work: spend it on purpose)
 * The bright pole. Most of the surfacing watches for what tips a person; this
 * names what's strong so it can be reached for, not left to chance. Science
 * (Library: your-strengths / strength-on-purpose / two-edges): there's a whole
 * classification of human strengths built as the inverse of a disorder manual,
 * a strength is often the bright edge of a charged trait, and USING one on
 * purpose (not just knowing it) is what moves well-being.
 *
 * BOTH user AND AI, never one (the standing rule):
 *   - USER path  — the user names a strength, where it shows, one way to lean on
 *                  it. Stored immediately as source "user". Fully functional.
 *   - AI path    — Reframe surfaces a candidate from the user's own material;
 *                  the user confirms (optionally correcting) or rejects it. A
 *                  rejected candidate NEVER resurfaces. This file models the
 *                  candidate confirm/reject so the surface is ready; the Reframe
 *                  generation + context wiring is the next batch.
 *
 * Integrity bar (the discovery-engine standard): never fabricate. A candidate
 * is only stored once the user confirms it; the user can always correct or
 * delete. Blank/whitespace fields are rejected, not stored. All reads
 * fail-silent and honest-empty. Storage is stillform_-prefixed so it rides the
 * existing cloud-sync / wipe path.
 *
 * Self-mastery framing: a strength is a real capacity to use, never a score,
 * badge, or test result. Plain language.
 */

const STORE_KEY = "stillform_v2_strengths"; // { confirmed: Record[], rejected: string[], pending: Record|null }
const MAX_LEN = 240;

function readStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { confirmed: [], rejected: [], pending: null };
    const s = JSON.parse(raw);
    return {
      confirmed: Array.isArray(s && s.confirmed) ? s.confirmed : [],
      rejected: Array.isArray(s && s.rejected) ? s.rejected : [],
      pending: s && typeof s.pending === "object" ? s.pending : null,
    };
  } catch {
    return { confirmed: [], rejected: [], pending: null };
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

/** Trimmed non-empty string within length, else null. */
function clean(v) {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t) return null;
  return t.slice(0, MAX_LEN);
}

/** Stable id from the strength (so the same one dedups + a rejected one stays rejected). */
export function strengthId(strength) {
  const t = clean(strength);
  if (!t) return null;
  return (
    "strength-" +
    t
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48)
  );
}

/** A valid record from raw fields, or null if any required field is blank. */
function makeRecord({ id, strength, whereItShows, leanInto, source }) {
  const s = clean(strength);
  const where = clean(whereItShows);
  const lean = clean(leanInto);
  if (!s || !where || !lean) return null;
  return {
    id: id || strengthId(s),
    strength: s,
    whereItShows: where,
    leanInto: lean,
    source: source === "ai" ? "ai" : "user",
    confirmedAt: Date.now(),
  };
}

/**
 * Confirmed strengths, most-recently-confirmed first. Honest-empty on
 * missing/corrupt. Ties on confirmedAt break by insertion order (later first)
 * so ordering is deterministic even within the same tick.
 */
export function getStrengths() {
  return readStore()
    .confirmed.map((r, i) => ({ r, i }))
    .filter(({ r }) => r && r.id && r.strength && r.whereItShows && r.leanInto)
    .sort((a, b) => (b.r.confirmedAt || 0) - (a.r.confirmedAt || 0) || b.i - a.i)
    .map(({ r }) => r);
}

export function isConfirmed(id) {
  if (!id) return false;
  return readStore().confirmed.some((r) => r && r.id === id);
}

export function isRejected(id) {
  if (!id) return false;
  return readStore().rejected.includes(id);
}

/**
 * Confirm a strength (user-authored or an AI candidate the user accepted).
 * `fields` may carry user corrections. Dedups by id; a previously rejected id is
 * un-rejected on confirm. Returns the stored record, or null if any required
 * field is blank.
 */
export function confirmStrength(fields) {
  const rec = makeRecord(fields || {});
  if (!rec) return null;
  const store = readStore();
  const i = store.confirmed.findIndex((r) => r && r.id === rec.id);
  if (i >= 0) {
    store.confirmed[i] = {
      ...store.confirmed[i],
      ...rec,
      confirmedAt: store.confirmed[i].confirmedAt || rec.confirmedAt,
    };
  } else {
    store.confirmed.push(rec);
  }
  store.rejected = store.rejected.filter((r) => r !== rec.id);
  if (store.pending && store.pending.id === rec.id) store.pending = null;
  writeStore(store);
  return rec;
}

/** Convenience: the user authoring their own (source "user"). */
export function addUserStrength({ strength, whereItShows, leanInto }) {
  return confirmStrength({ strength, whereItShows, leanInto, source: "user" });
}

/**
 * Reject an AI candidate so it never resurfaces. Takes the candidate or its id.
 * Does not touch a confirmed record (reject is for pending suggestions).
 */
export function rejectCandidate(candidateOrId) {
  const id =
    typeof candidateOrId === "string"
      ? candidateOrId
      : candidateOrId && (candidateOrId.id || strengthId(candidateOrId.strength));
  if (!id) return false;
  const store = readStore();
  if (!store.rejected.includes(id)) store.rejected.push(id);
  if (store.pending && store.pending.id === id) store.pending = null;
  return writeStore(store);
}

/**
 * Stash an AI-proposed candidate as PENDING (not confirmed). Reframe surfaces
 * one from the user's own material; it waits here until the user confirms /
 * corrects / rejects it on the surface — never asserted, never shown
 * mid-session. Refuses to stash a strength already confirmed or previously
 * rejected. A newer valid proposal replaces an older un-acted one. Returns the
 * stored candidate or null.
 */
export function setPendingCandidate(fields) {
  const s = clean(fields && fields.strength);
  const where = clean(fields && fields.whereItShows);
  const lean = clean(fields && fields.leanInto);
  if (!s || !where || !lean) return null;
  const id = strengthId(s);
  if (isConfirmed(id) || isRejected(id)) return null;
  const store = readStore();
  store.pending = {
    id,
    strength: s,
    whereItShows: where,
    leanInto: lean,
    source: "ai",
    proposedAt: Date.now(),
  };
  writeStore(store);
  return store.pending;
}

/** The pending AI candidate, or null. Self-heals: clears if since confirmed/rejected. */
export function getPendingCandidate() {
  const store = readStore();
  const p = store.pending;
  if (!p || !p.id || !p.strength || !p.whereItShows || !p.leanInto) return null;
  if (isConfirmed(p.id) || isRejected(p.id)) {
    store.pending = null;
    writeStore(store);
    return null;
  }
  return p;
}

/** Clear the pending candidate (after the user acts on it). */
export function clearPendingCandidate() {
  const store = readStore();
  if (store.pending == null) return false;
  store.pending = null;
  return writeStore(store);
}

/** Edit an existing confirmed strength's fields. Blank fields are ignored (not cleared). */
export function updateStrength(id, fields) {
  if (!id || !fields) return null;
  const store = readStore();
  const i = store.confirmed.findIndex((r) => r && r.id === id);
  if (i < 0) return null;
  const next = { ...store.confirmed[i] };
  for (const k of ["strength", "whereItShows", "leanInto"]) {
    const c = clean(fields[k]);
    if (c) next[k] = c;
  }
  store.confirmed[i] = next;
  writeStore(store);
  return next;
}

/** Remove a confirmed strength the user no longer wants tracked. */
export function removeStrength(id) {
  if (!id) return false;
  const store = readStore();
  const before = store.confirmed.length;
  store.confirmed = store.confirmed.filter((r) => r && r.id !== id);
  return store.confirmed.length !== before ? writeStore(store) : false;
}

/**
 * Format confirmed strengths for the Reframe AI context. Most-recent first.
 * Returns null when empty (honest-empty). The user's OWN confirmed strengths so
 * the AI can reference/lean on them — never assert a new one without user
 * confirmation.
 */
export function formatStrengthsForAI() {
  const list = getStrengths();
  if (list.length === 0) return null;
  return list
    .slice(0, 5)
    .map((s) => `${s.strength} — shows up: ${s.whereItShows}; lean on it: ${s.leanInto}`)
    .join("\n");
}
