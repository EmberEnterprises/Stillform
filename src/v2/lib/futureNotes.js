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
 * P30 THE IDENTITY TEST (2026-07-09, canon): a note must be ANCHORED to
 * something real — an event, a trip, a confirmed pattern, or a user-declared
 * date. `surfaceAt` (a real moment) IS the anchor: a note with no real time to
 * arrive at is an orphan ("someday reorganize the garage") and is REFUSED —
 * that's a task app's job, which the morning row can launch; we annotate the
 * life that exists, we never store a life of our own. This keeps Stillform from
 * becoming a productivity app at the data layer, not just in copy.
 *
 * @param {{ text: string, surfaceAt: number|string, leadMinutes?: number, label?: string, anchor?: object }} input
 *   surfaceAt — when the real underlying thing happens (ms or ISO). REQUIRED and
 *     must be a valid future-capable moment; this is the anchor.
 * @returns {string|null} the note id, or null on invalid/orphan input
 */
export function attachNote({ text, surfaceAt, leadMinutes = 0, label = "", anchor = null, voice = "hold" } = {}) {
  const t = typeof text === "string" ? text.trim() : "";
  if (t.length < 1) return null;
  // P30: the anchor is mandatory. No real moment = orphan = refused.
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
    // P30: what real thing this is anchored to (event/trip/pattern/date). The
    // note annotates that; it is not a free-floating to-do.
    anchor: (anchor && typeof anchor === "object") ? anchor : { kind: "date", at: atMs },
    // P30 KEPT: per-item voice consent. Default HOLD — the note is kept quietly
    // and only surfaces if the user asked for a word ("speak"). No overdue, no
    // red state; a held note simply waits, unshamed.
    voice: voice === "speak" ? "speak" : "hold",
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
    if (n.voice !== "speak") return false; // held notes wait silently (P30)
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
    anchor: { kind: "trip", title: offer.tripTitle, at: offer.startMs },
    voice: "speak", // the user accepted the offer — it should arrive
  });
}

/**
 * P30: grant a held note voice (the user says "yes, remind me"). Held is the
 * default; this is the opt-in to surfacing. Returns true if updated.
 */
export function letNoteSpeak(id) {
  const list = read();
  const note = list.find((n) => n && n.id === id);
  if (!note) return false;
  note.voice = "speak";
  return write(list);
}
