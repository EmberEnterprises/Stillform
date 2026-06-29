/*
 * vulnerabilities.js — the both-authored "your vulnerabilities" data layer.
 *
 * A vulnerability = one charged trait shown with BOTH its edges:
 *   - where it tips you   (the cost / the hijack)
 *   - where it serves you (the strength / the bright spot)
 * One trait, two edges. The science (Library: two-edges / everyone-has-them /
 * work-with-it) is that the same sensitivity that costs under bad conditions is
 * a disproportionate strength under good ones — so you keep the strength while
 * you watch the cost, never amputate the trait.
 *
 * BOTH user AND AI, never one (the standing rule):
 *   - USER path  — the user names a trait and both edges themselves. Stored
 *                  immediately as source "user". Fully functional, no AI.
 *   - AI path    — Reframe surfaces a candidate from the user's own material;
 *                  the user confirms (optionally correcting the edges) or
 *                  rejects it. A rejected candidate NEVER resurfaces. This file
 *                  models the candidate confirm/reject so the surface is ready;
 *                  the actual AI generation + Reframe-context wiring is staged
 *                  for Arlin's live walk (the sensitive voice tuning).
 *
 * Integrity (the discovery-engine bar): never fabricate. A candidate is only
 * stored once the user confirms it; the user can always correct or delete.
 * Blank/whitespace fields are rejected, not stored. All reads fail-silent and
 * honest-empty. Storage is stillform_-prefixed so it rides the existing
 * cloud-sync / wipe path.
 */

const STORE_KEY = "stillform_v2_vulnerabilities"; // { confirmed: Record[], rejected: string[] }
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

/** Stable id from the trait (so the same trait dedups + a rejected one stays rejected). */
export function vulnerabilityId(trait) {
  const t = clean(trait);
  if (!t) return null;
  return (
    "vuln-" +
    t
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48)
  );
}

/** A valid record from raw fields, or null if any required field is blank. */
function makeRecord({ id, trait, costEdge, strengthEdge, source }) {
  const t = clean(trait);
  const cost = clean(costEdge);
  const strength = clean(strengthEdge);
  if (!t || !cost || !strength) return null;
  return {
    id: id || vulnerabilityId(t),
    trait: t,
    costEdge: cost,
    strengthEdge: strength,
    source: source === "ai" ? "ai" : "user",
    confirmedAt: Date.now(),
  };
}

/**
 * Confirmed vulnerabilities, most-recently-confirmed first. Honest-empty on
 * missing/corrupt. Ties on confirmedAt break by insertion order (later first)
 * so ordering is deterministic even within the same tick.
 */
export function getVulnerabilities() {
  return readStore()
    .confirmed.map((r, i) => ({ r, i }))
    .filter(({ r }) => r && r.id && r.trait && r.costEdge && r.strengthEdge)
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
 * Confirm a vulnerability (user-authored or an AI candidate the user accepted).
 * `fields` may carry user corrections to the edges. Dedups by id; a previously
 * rejected id is un-rejected on confirm. Returns the stored record, or null if
 * any required field is blank.
 */
export function confirmVulnerability(fields) {
  const rec = makeRecord(fields || {});
  if (!rec) return null;
  const store = readStore();
  const i = store.confirmed.findIndex((r) => r && r.id === rec.id);
  if (i >= 0) {
    // update in place, keep the original confirmedAt
    store.confirmed[i] = { ...store.confirmed[i], ...rec, confirmedAt: store.confirmed[i].confirmedAt || rec.confirmedAt };
  } else {
    store.confirmed.push(rec);
  }
  store.rejected = store.rejected.filter((r) => r !== rec.id);
  if (store.pending && store.pending.id === rec.id) store.pending = null;
  writeStore(store);
  return rec;
}

/** Convenience: the user authoring their own (source "user"). */
export function addUserVulnerability({ trait, costEdge, strengthEdge }) {
  return confirmVulnerability({ trait, costEdge, strengthEdge, source: "user" });
}

/**
 * Reject an AI candidate so it never resurfaces. Takes the candidate or its id.
 * Does not touch a confirmed record (reject is for pending suggestions).
 */
export function rejectCandidate(candidateOrId) {
  const id =
    typeof candidateOrId === "string"
      ? candidateOrId
      : candidateOrId && (candidateOrId.id || vulnerabilityId(candidateOrId.trait));
  if (!id) return false;
  const store = readStore();
  if (!store.rejected.includes(id)) store.rejected.push(id);
  if (store.pending && store.pending.id === id) store.pending = null;
  return writeStore(store);
}

/**
 * Stash an AI-proposed candidate as PENDING (not confirmed). Reframe surfaces
 * one from the user's own material; it waits here until the user confirms /
 * corrects / rejects it on the Vulnerabilities surface — never asserted, never
 * shown mid-session. Refuses to stash a trait already confirmed or previously
 * rejected (it must never re-nag). A newer valid proposal replaces an older
 * un-acted one. Returns the stored candidate or null.
 */
export function setPendingCandidate(fields) {
  const t = clean(fields && fields.trait);
  const cost = clean(fields && fields.costEdge);
  const strength = clean(fields && fields.strengthEdge);
  if (!t || !cost || !strength) return null;
  const id = vulnerabilityId(t);
  if (isConfirmed(id) || isRejected(id)) return null;
  const store = readStore();
  store.pending = { id, trait: t, costEdge: cost, strengthEdge: strength, source: "ai", proposedAt: Date.now() };
  writeStore(store);
  return store.pending;
}

/** The pending AI candidate, or null. Self-heals: clears if since confirmed/rejected. */
export function getPendingCandidate() {
  const store = readStore();
  const p = store.pending;
  if (!p || !p.id || !p.trait || !p.costEdge || !p.strengthEdge) return null;
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

/** Edit an existing confirmed vulnerability's fields. Blank fields are ignored (not cleared). */
export function updateVulnerability(id, fields) {
  if (!id || !fields) return null;
  const store = readStore();
  const i = store.confirmed.findIndex((r) => r && r.id === id);
  if (i < 0) return null;
  const next = { ...store.confirmed[i] };
  for (const k of ["trait", "costEdge", "strengthEdge"]) {
    const c = clean(fields[k]);
    if (c) next[k] = c;
  }
  store.confirmed[i] = next;
  writeStore(store);
  return next;
}

/** Remove a confirmed vulnerability the user no longer wants tracked. */
export function removeVulnerability(id) {
  if (!id) return false;
  const store = readStore();
  const before = store.confirmed.length;
  store.confirmed = store.confirmed.filter((r) => r && r.id !== id);
  return store.confirmed.length !== before ? writeStore(store) : false;
}

/**
 * Format confirmed vulnerabilities for the Reframe AI context. Most-recent first.
 * Returns null when empty (honest-empty). Built now; the Reframe-context wiring is
 * staged for Arlin's walk — this is the user's OWN confirmed data, both edges, so
 * the AI can reference it (never assert a new one without user confirmation).
 */
export function formatVulnerabilitiesForAI() {
  const list = getVulnerabilities();
  if (list.length === 0) return null;
  return list
    .slice(0, 5)
    .map((v) => `${v.trait} — tips them: ${v.costEdge}; serves them: ${v.strengthEdge}`)
    .join("\n");
}
