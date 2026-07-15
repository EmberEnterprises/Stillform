/**
 * futureNotes — notes that arrive on time (P28, 2026-07-15).
 *
 * The user attaches a note to any future thing — an event, a date, a trip — and
 * it surfaces at exactly the right moment. Arlin's law is built into the SHAPE,
 * not just the copy: a note is NEVER a task. There is no `done` field, no
 * checkbox, no completion tracking, no follow-up chase, nothing owed back. You
 * read it, you use it, it retires itself once its moment has passed. The data
 * model literally cannot express "overdue" — that's the point.
 *
 * We hold ZERO financial data: this generalizes the finance apps' renewal-date
 * mechanic only for USER-AUTHORED dates (they type "trial ends the 14th"), never
 * by reading accounts.
 */

const KEY = "stillform_v2_future_notes";
const CAP = 200;

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(-CAP)));
    return true;
  } catch {
    return false;
  }
}

/**
 * Attach a note to a future moment.
 * @param {{ text: string, surfaceAt: number|string, leadMinutes?: number, label?: string }} input
 *   surfaceAt — when the underlying thing happens (ms or ISO).
 *   leadMinutes — how far ahead to surface the note (default 0 = at the moment).
 * @returns {string|null} the note id, or null on invalid input
 */
export function attachNote({ text, surfaceAt, leadMinutes = 0, label = "" } = {}) {
  const t = typeof text === "string" ? text.trim() : "";
  if (t.length < 1) return null;
  const atMs = typeof surfaceAt === "number" ? surfaceAt : Date.parse(surfaceAt);
  if (!Number.isFinite(atMs)) return null;
  const id = "note_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);
  const list = read();
  // NOTE THE SHAPE: no `done`, no `completed`, no `status`. A note cannot be a task.
  list.push({
    id,
    text: t.slice(0, 600),
    label: typeof label === "string" ? label.slice(0, 80) : "",
    atMs,
    leadMs: Math.max(0, (Number.isFinite(leadMinutes) ? leadMinutes : 0) * 60000),
  });
  return write(list) ? id : null;
}

/**
 * The notes whose moment is NOW (within their lead window, not yet past their
 * moment by more than a short grace). This is a READ — surfacing a note never
 * mutates it; there is nothing to check off.
 * @param {number} [nowMs]
 * @returns {Array<{id,text,label,atMs}>}
 */
export function getDueNotes(nowMs = Date.now()) {
  const GRACE_MS = 60 * 60 * 1000; // stays visible up to an hour past its moment
  return read().filter((n) => {
    if (!n || typeof n.atMs !== "number") return false;
    const opensAt = n.atMs - (n.leadMs || 0);
    return nowMs >= opensAt && nowMs <= n.atMs + GRACE_MS;
  });
}

/** All attached notes (for a management view — still no task semantics). */
export function getAllNotes() {
  return read();
}

/**
 * Remove a note. This is deletion by the user's choice — NOT completion.
 * (There is no "mark done"; a note that's served its purpose is simply removed,
 * or it retires itself via sweepExpired.)
 */
export function removeNote(id) {
  return write(read().filter((n) => n && n.id !== id));
}

/**
 * Self-retire notes whose moment has fully passed (beyond the grace). Called
 * opportunistically on read surfaces. A note leaving is silent — no "you missed
 * this," no ledger of un-read notes. It simply had its moment and is gone.
 */
export function sweepExpired(nowMs = Date.now()) {
  const GRACE_MS = 60 * 60 * 1000;
  const kept = read().filter((n) => n && typeof n.atMs === "number" && nowMs <= n.atMs + GRACE_MS);
  write(kept);
  return kept;
}

/**
 * P29 helper: accept a packing-note offer -> a future note that arrives the
 * evening before the trip. `editedText` lets the user amend the template first.
 * Returns the note id or null.
 * @param {{ tripTitle: string, startMs: number, template: string }} offer
 * @param {string} [editedText]
 */
export function acceptPackingNote(offer, editedText) {
  if (!offer || typeof offer.startMs !== "number") return null;
  const text = (typeof editedText === "string" && editedText.trim()) ? editedText.trim() : offer.template;
  // "Evening before": surface at ~18:00 the day before the trip starts.
  const dayBefore = new Date(offer.startMs - 24 * 60 * 60 * 1000);
  dayBefore.setHours(18, 0, 0, 0);
  return attachNote({
    text,
    surfaceAt: offer.startMs,
    leadMinutes: Math.max(0, Math.round((offer.startMs - dayBefore.getTime()) / 60000)),
    label: "Packing",
  });
}