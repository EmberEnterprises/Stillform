/**
 * pendingNoteEvent — a tiny hand-off for "leave a note for THIS event" (P28).
 *
 * The per-event note affordance (PreEventOffer) and the composer (NoteCompose)
 * live in different branches of the tree; threading an event object through
 * three intermediate components would be fragile. This holds the one pending
 * event in module scope between the tap and the composer mounting. Session-only,
 * never persisted — it's a nav argument, not data.
 */
let pending = null;

/** Stash the event the user wants to note (title + start). */
export function setPendingNoteEvent(ev) {
  pending = ev && typeof ev === "object" ? { title: ev.title || "", start: ev.start || null } : null;
}

/** Read and CLEAR the pending event (one-shot — the composer consumes it once). */
export function takePendingNoteEvent() {
  const e = pending;
  pending = null;
  return e;
}
