/*
 * values.js — the both-authored "what you're moving toward" data layer.
 *
 * A value = one direction you choose to move toward, with:
 *   - lookLike  — what living it looks like
 *   - oneStep   — one committed action toward it (the work: values without a
 *                 step are just words — committed action is the move)
 * The directional pole / the compass. Strengths name what's strong now; this
 * names where you're pointed. Science (Library: your-values; ACT): values
 * clarification (freely chosen directions, yours not handed to you) + committed
 * action (value-driven steps despite discomfort). The choosing stays the
 * user's — autonomy is the point.
 *
 * BOTH user AND AI, never one (the standing rule):
 *   - USER path  — the user names a direction, what it looks like, one step.
 *                  Stored immediately as source "user". Fully functional.
 *   - AI path    — Reframe surfaces a candidate (a direction it hears in the
 *                  user's own words); the user confirms (optionally correcting)
 *                  or rejects it. A rejected candidate NEVER resurfaces. The AI
 *                  proposes; the user chooses — never the AI prescribing a value.
 *                  Reframe generation + context wiring is the next batch.
 *
 * Integrity bar (the discovery-engine standard): never fabricate. A candidate
 * is only stored once the user confirms it; the user can always correct or
 * delete. Blank/whitespace fields are rejected, not stored. All reads
 * fail-silent and honest-empty. Storage is stillform_-prefixed so it rides the
 * existing cloud-sync / wipe path.
 *
 * Self-mastery framing: a direction you set and act on, never prescribed, never
 * a score. Plain language.
 */

const STORE_KEY = "stillform_v2_values"; // { confirmed: Record[], rejected: string[], pending: Record|null }
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

/** Stable id from the value (so the same one dedups + a rejected one stays rejected). */
export function valueId(value) {
  const t = clean(value);
  if (!t) return null;
  return (
    "value-" +
    t
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48)
  );
}

/** A valid record from raw fields, or null if any required field is blank. */
function makeRecord({ id, value, lookLike, oneStep, source }) {
  const v = clean(value);
  const look = clean(lookLike);
  const step = clean(oneStep);
  if (!v || !look || !step) return null;
  return {
    id: id || valueId(v),
    value: v,
    lookLike: look,
    oneStep: step,
    source: source === "ai" ? "ai" : "user",
    confirmedAt: Date.now(),
  };
}

/**
 * Confirmed values, most-recently-confirmed first. Honest-empty on
 * missing/corrupt. Ties on confirmedAt break by insertion order (later first)
 * so ordering is deterministic even within the same tick.
 */
export function getValues() {
  return readStore()
    .confirmed.map((r, i) => ({ r, i }))
    .filter(({ r }) => r && r.id && r.value && r.lookLike && r.oneStep)
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
 * Confirm a value (user-authored or an AI candidate the user accepted).
 * `fields` may carry user corrections. Dedups by id; a previously rejected id is
 * un-rejected on confirm. Returns the stored record, or null if any required
 * field is blank.
 */
export function confirmValue(fields) {
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
export function addUserValue({ value, lookLike, oneStep }) {
  return confirmValue({ value, lookLike, oneStep, source: "user" });
}

/**
 * Reject an AI candidate so it never resurfaces. Takes the candidate or its id.
 * Does not touch a confirmed record (reject is for pending suggestions).
 */
export function rejectCandidate(candidateOrId) {
  const id =
    typeof candidateOrId === "string"
      ? candidateOrId
      : candidateOrId && (candidateOrId.id || valueId(candidateOrId.value));
  if (!id) return false;
  const store = readStore();
  if (!store.rejected.includes(id)) store.rejected.push(id);
  if (store.pending && store.pending.id === id) store.pending = null;
  return writeStore(store);
}

/**
 * Stash an AI-proposed candidate as PENDING (not confirmed). Reframe surfaces a
 * direction it hears in the user's own words; it waits here until the user
 * confirms / corrects / rejects it — never asserted, never shown mid-session,
 * never prescribed. Refuses to stash a value already confirmed or previously
 * rejected. A newer valid proposal replaces an older un-acted one. Returns the
 * stored candidate or null.
 */
export function setPendingCandidate(fields) {
  const v = clean(fields && fields.value);
  const look = clean(fields && fields.lookLike);
  const step = clean(fields && fields.oneStep);
  if (!v || !look || !step) return null;
  const id = valueId(v);
  if (isConfirmed(id) || isRejected(id)) return null;
  const store = readStore();
  store.pending = {
    id,
    value: v,
    lookLike: look,
    oneStep: step,
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
  if (!p || !p.id || !p.value || !p.lookLike || !p.oneStep) return null;
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

/** Edit an existing confirmed value's fields. Blank fields are ignored (not cleared). */
export function updateValue(id, fields) {
  if (!id || !fields) return null;
  const store = readStore();
  const i = store.confirmed.findIndex((r) => r && r.id === id);
  if (i < 0) return null;
  const next = { ...store.confirmed[i] };
  for (const k of ["value", "lookLike", "oneStep"]) {
    const c = clean(fields[k]);
    if (c) next[k] = c;
  }
  store.confirmed[i] = next;
  writeStore(store);
  return next;
}

/** Remove a confirmed value the user no longer wants tracked. */
export function removeValue(id) {
  if (!id) return false;
  const store = readStore();
  const before = store.confirmed.length;
  store.confirmed = store.confirmed.filter((r) => r && r.id !== id);
  return store.confirmed.length !== before ? writeStore(store) : false;
}

/**
 * Format confirmed values for the Reframe AI context. Most-recent first.
 * Returns null when empty (honest-empty). The user's OWN chosen directions so
 * the AI can reference them — never assert/prescribe a new one without user
 * confirmation.
 */
export function formatValuesForAI() {
  const list = getValues();
  if (list.length === 0) return null;
  return list
    .slice(0, 5)
    .map((v) => `${v.value} — looks like: ${v.lookLike}; next step: ${v.oneStep}`)
    .join("\n");
}
