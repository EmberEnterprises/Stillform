/*
 * protectiveMoves.js — the both-authored "how you protect yourself" data layer.
 *
 * A protective move = one automatic move you make under pressure, shown with
 * BOTH its edges:
 *   - where it protected you  (the safety it gave / gives)
 *   - where it costs you      (where the old reflex runs you now)
 * One move, two edges. The science (Library: moves-under-pressure /
 * first-move-under-threat / two-edges) is that the move that kept you safe once
 * is the move that can run you now — so you keep the read on it and choose,
 * never frame it as a flaw and never try to amputate it.
 *
 * This is the defenses + threat-reflex layer ("the moves you make under
 * pressure" / "what you do first under threat"). It folds into the same
 * two-edges / both-authored family as vulnerabilities — kept as its own module
 * because this codebase favors explicit, single-purpose stores.
 *
 * BOTH user AND AI, never one (the standing rule):
 *   - USER path  — the user names a move and both edges themselves. Stored
 *                  immediately as source "user". Fully functional, no AI.
 *   - AI path    — Reframe surfaces a candidate from the user's own material;
 *                  the user confirms (optionally correcting the edges) or
 *                  rejects it. A rejected candidate NEVER resurfaces. This file
 *                  models the candidate confirm/reject so the surface is ready;
 *                  the Reframe generation + context wiring is the next batch.
 *
 * Integrity bar (the discovery-engine standard): never fabricate. A candidate
 * is only stored once the user confirms it; the user can always correct or
 * delete. Blank/whitespace fields are rejected, not stored. All reads
 * fail-silent and honest-empty. Storage is stillform_-prefixed so it rides the
 * existing cloud-sync / wipe path.
 *
 * Framing: clinical-grade evaluation underneath, self-mastery delivery on top.
 * No clinical / disorder / trauma labels anywhere user-facing — plain language,
 * pointed at mastery.
 */

const STORE_KEY = "stillform_v2_protective_moves"; // { confirmed: Record[], rejected: string[], pending: Record|null }
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

/** Stable id from the move (so the same move dedups + a rejected one stays rejected). */
export function protectiveMoveId(move) {
  const t = clean(move);
  if (!t) return null;
  return (
    "move-" +
    t
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48)
  );
}

/** A valid record from raw fields, or null if any required field is blank. */
function makeRecord({ id, move, protectedEdge, costEdge, source }) {
  const m = clean(move);
  const protect = clean(protectedEdge);
  const cost = clean(costEdge);
  if (!m || !protect || !cost) return null;
  return {
    id: id || protectiveMoveId(m),
    move: m,
    protectedEdge: protect,
    costEdge: cost,
    source: source === "ai" ? "ai" : "user",
    confirmedAt: Date.now(),
  };
}

/**
 * Confirmed protective moves, most-recently-confirmed first. Honest-empty on
 * missing/corrupt. Ties on confirmedAt break by insertion order (later first)
 * so ordering is deterministic even within the same tick.
 */
export function getProtectiveMoves() {
  return readStore()
    .confirmed.map((r, i) => ({ r, i }))
    .filter(({ r }) => r && r.id && r.move && r.protectedEdge && r.costEdge)
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
 * Confirm a protective move (user-authored or an AI candidate the user
 * accepted). `fields` may carry user corrections to the edges. Dedups by id; a
 * previously rejected id is un-rejected on confirm. Returns the stored record,
 * or null if any required field is blank.
 */
export function confirmProtectiveMove(fields) {
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
export function addUserProtectiveMove({ move, protectedEdge, costEdge }) {
  return confirmProtectiveMove({ move, protectedEdge, costEdge, source: "user" });
}

/**
 * Reject an AI candidate so it never resurfaces. Takes the candidate or its id.
 * Does not touch a confirmed record (reject is for pending suggestions).
 */
export function rejectCandidate(candidateOrId) {
  const id =
    typeof candidateOrId === "string"
      ? candidateOrId
      : candidateOrId && (candidateOrId.id || protectiveMoveId(candidateOrId.move));
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
 * mid-session. Refuses to stash a move already confirmed or previously rejected
 * (it must never re-nag). A newer valid proposal replaces an older un-acted one.
 * Returns the stored candidate or null.
 */
export function setPendingCandidate(fields) {
  const m = clean(fields && fields.move);
  const protect = clean(fields && fields.protectedEdge);
  const cost = clean(fields && fields.costEdge);
  if (!m || !protect || !cost) return null;
  const id = protectiveMoveId(m);
  if (isConfirmed(id) || isRejected(id)) return null;
  const store = readStore();
  store.pending = {
    id,
    move: m,
    protectedEdge: protect,
    costEdge: cost,
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
  if (!p || !p.id || !p.move || !p.protectedEdge || !p.costEdge) return null;
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

/** Edit an existing confirmed move's fields. Blank fields are ignored (not cleared). */
export function updateProtectiveMove(id, fields) {
  if (!id || !fields) return null;
  const store = readStore();
  const i = store.confirmed.findIndex((r) => r && r.id === id);
  if (i < 0) return null;
  const next = { ...store.confirmed[i] };
  for (const k of ["move", "protectedEdge", "costEdge"]) {
    const c = clean(fields[k]);
    if (c) next[k] = c;
  }
  store.confirmed[i] = next;
  writeStore(store);
  return next;
}

/** Remove a confirmed move the user no longer wants tracked. */
export function removeProtectiveMove(id) {
  if (!id) return false;
  const store = readStore();
  const before = store.confirmed.length;
  store.confirmed = store.confirmed.filter((r) => r && r.id !== id);
  return store.confirmed.length !== before ? writeStore(store) : false;
}

/**
 * Format confirmed protective moves for the Reframe AI context. Most-recent
 * first. Returns null when empty (honest-empty). This is the user's OWN
 * confirmed data, both edges, so the AI can reference it — never assert a new
 * one without user confirmation.
 */
export function formatProtectiveMovesForAI() {
  const list = getProtectiveMoves();
  if (list.length === 0) return null;
  return list
    .slice(0, 5)
    .map((m) => `${m.move} — protected them: ${m.protectedEdge}; costs them: ${m.costEdge}`)
    .join("\n");
}
