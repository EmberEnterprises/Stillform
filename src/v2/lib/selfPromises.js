/**
 * selfPromises — P17 GUARDED SELF-PROMISES (2026-08-17). Strictly opt-in.
 *
 * The user can explicitly HIRE the concierge to hold ONE named commitment for a
 * chosen day: "you told Thursday-you about the draft — it's Thursday." Every
 * promise is created by a deliberate act; nothing here is ambient accountability
 * and nothing nags. A promise surfaces ONCE on its day, then retires whether or
 * not it was acted on — there is no overdue, no streak, nothing owed back.
 *
 * This is the opposite of a task list: the user is not accountable TO the app.
 * The app is holding something FOR them, and lets go on schedule.
 */

const KEY = "stillform_v2_self_promises";

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
    localStorage.setItem(KEY, JSON.stringify(list.slice(-50)));
    return true;
  } catch {
    return false;
  }
}

function genId() {
  return "sp_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);
}

/**
 * Hire the concierge to hold a promise. Requires real text and a real day —
 * an orphan promise (no day) is refused, same discipline as anchored notes.
 * @param {{ text:string, forDateMs:number }} input
 * @returns {string|null} the promise id, or null if refused
 */
export function makePromise({ text, forDateMs } = {}) {
  const t = typeof text === "string" ? text.trim() : "";
  if (t.length < 2) return null;
  if (!Number.isFinite(forDateMs)) return null; // no day = no promise

  const day = new Date(forDateMs);
  day.setHours(9, 0, 0, 0); // surfaces on the morning of its day

  const list = read();
  const id = genId();
  list.push({
    id,
    text: t.slice(0, 200),
    forDateKey: day.toDateString(),
    surfaceAtMs: day.getTime(),
    madeAtMs: Date.now(),
    surfaced: false,
  });
  write(list);
  return id;
}

/**
 * The promise to surface right now, if any: one whose day has arrived and that
 * hasn't been surfaced yet. Surfacing MARKS it surfaced so it never repeats —
 * it speaks once and lets go. Returns { id, text, forDateKey } or null.
 */
export function getDuePromise(nowMs = Date.now()) {
  const list = read();
  let due = null;
  let changed = false;
  for (const p of list) {
    if (!p || p.surfaced) continue;
    if (typeof p.surfaceAtMs !== "number") continue;
    if (p.surfaceAtMs <= nowMs) {
      if (!due) { due = p; p.surfaced = true; changed = true; }
    }
  }
  if (changed) write(list);
  return due ? { id: due.id, text: due.text, forDateKey: due.forDateKey } : null;
}

/** All promises still ahead, for a transparent list the user can see/cancel. */
export function getUpcomingPromises(nowMs = Date.now()) {
  return read()
    .filter((p) => p && !p.surfaced && typeof p.surfaceAtMs === "number" && p.surfaceAtMs > nowMs)
    .map((p) => ({ id: p.id, text: p.text, forDateKey: p.forDateKey, surfaceAtMs: p.surfaceAtMs }))
    .sort((a, b) => a.surfaceAtMs - b.surfaceAtMs);
}

/** Cancel a promise the user no longer wants held. Their call, always. */
export function cancelPromise(id) {
  if (!id) return false;
  const list = read();
  const next = list.filter((p) => p && p.id !== id);
  return write(next);
}
