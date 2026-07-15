/**
 * keepShelf — lines worth keeping (J6, 2026-07-14).
 *
 * People screenshot the therapy-adjacent moment — the line that landed. This
 * gives that moment a home inside the app instead of the camera roll: any line
 * (theirs or the AI's) kept with one tap, resurfaced later in Close and My
 * Progress. Their words, their record, on-device only.
 *
 * Laws honored: a keep is a KEEP, not a task (tending test — nothing to manage,
 * no overdue, no ledger of un-kept lines). Deleting is set-aside, restorable —
 * so this stores kept lines only; removal is clean and unshamed.
 */

const KEY = "stillform_v2_keep_shelf";
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
 * Keep a line. `source` is "you" or "guide" (never "AI" in user copy — the
 * guide register). Deduplicates on exact text so double-taps don't pile up.
 * @param {{ text: string, source?: "you"|"guide" }} entry
 * @returns {boolean}
 */
export function keepLine(entry = {}) {
  const text = typeof entry.text === "string" ? entry.text.trim() : "";
  if (text.length < 2) return false;
  const list = read();
  if (list.some((k) => k.text === text)) return true; // already kept
  list.push({
    text,
    source: entry.source === "you" ? "you" : "guide",
    ts: Date.now(),
  });
  return write(list);
}

/** Is this exact line already on the shelf? (for toggle UI) */
export function isKept(text) {
  const t = typeof text === "string" ? text.trim() : "";
  return read().some((k) => k.text === t);
}

/** Remove a kept line (clean, no shame). */
export function unkeepLine(text) {
  const t = typeof text === "string" ? text.trim() : "";
  return write(read().filter((k) => k.text !== t));
}

/** All kept lines, newest last. */
export function getKeptLines() {
  return read();
}

/** One kept line to resurface (most recent by default). Null if the shelf is empty. */
export function getResurfaceLine() {
  const list = read();
  return list.length ? list[list.length - 1] : null;
}
