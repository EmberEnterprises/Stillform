/**
 * protectedBlocks — P24 PROTECTED-BLOCK WATCHKEEPER (2026-08-17).
 *
 * The user marks a recurring block of the day as THEIRS — lunch, the afternoon
 * walk, the quiet hour. The watchkeeper notices when a calendar event lands on
 * that block and hands over a pre-built .ics for the next-best free slot, so the
 * protected thing survives the collision. Reclaim's signature move, done our
 * way: we NEVER write to their calendar. We hand them the fix; they place it.
 *
 * A protected block is { id, label, startMin, endMin } where start/endMin are
 * minutes-from-midnight (a daily window, not a dated event). Opt-in per block.
 */

const KEY = "stillform_v2_protected_blocks";

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
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 20)));
    return true;
  } catch {
    return false;
  }
}

function genId() {
  return "pb_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 6);
}

/** All protected blocks, for a settings/room list. */
export function getProtectedBlocks() {
  return read().filter((b) => b && typeof b.startMin === "number" && typeof b.endMin === "number");
}

/**
 * Mark a block as protected. Requires a label and a valid window.
 * @param {{ label:string, startMin:number, endMin:number }} input
 * @returns {string|null} the id, or null if refused
 */
export function protectBlock({ label, startMin, endMin } = {}) {
  const l = typeof label === "string" ? label.trim() : "";
  if (l.length < 2) return null;
  if (!Number.isFinite(startMin) || !Number.isFinite(endMin)) return null;
  if (endMin <= startMin) return null;
  const list = read();
  const id = genId();
  list.push({ id, label: l.slice(0, 60), startMin, endMin });
  write(list);
  return id;
}

/** Stop protecting a block. The user's call. */
export function unprotectBlock(id) {
  if (!id) return false;
  return write(read().filter((b) => b && b.id !== id));
}

function minutesOfDay(ms) {
  const d = new Date(ms);
  return d.getHours() * 60 + d.getMinutes();
}

/**
 * The watchkeeper. For a protected block that a today event collides with,
 * finds the next-best free slot of the same length later today and returns a
 * pre-built fix. Returns the FIRST collision found, or null when every
 * protected block is safe.
 *
 * @returns {{ id, label, conflictTitle, fix:{ title, start, durationMin, description } }|null}
 */
export function getProtectedBlockRescue(nowMs = Date.now(), { dismissedIds = [] } = {}) {
  const blocks = getProtectedBlocks();
  if (!blocks.length) return null;

  let events = [];
  try {
    const raw = localStorage.getItem("stillform_calendar_events");
    events = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(events)) events = [];
  } catch {
    return null;
  }

  const day = new Date(nowMs).toDateString();
  const todays = events
    .map((ev) => {
      if (!ev || !ev.start) return null;
      const st = Date.parse(ev.start);
      if (Number.isNaN(st)) return null;
      let en = ev.end ? Date.parse(ev.end) : NaN;
      if (Number.isNaN(en)) en = st + (typeof ev.durationMin === "number" ? ev.durationMin : 60) * 60000;
      return { title: String(ev.title || "an event"), startMin: minutesOfDay(st), endMin: minutesOfDay(en), startMs: st, endMs: en };
    })
    .filter((e) => e && new Date(e.startMs).toDateString() === day)
    .sort((a, b) => a.startMin - b.startMin);

  for (const block of blocks) {
    if (dismissedIds.includes(block.id)) continue;
    const collider = todays.find((e) => e.startMin < block.endMin && e.endMin > block.startMin);
    if (!collider) continue;

    const durationMin = block.endMin - block.startMin;

    // Find the next free slot of the same length, later today, after the collider.
    const dayEndMin = 22 * 60; // don't push a protected block past 10pm
    let cursorMin = Math.max(collider.endMin, minutesOfDay(nowMs));
    // Walk forward, skipping over any events, until a gap of durationMin fits.
    let placed = null;
    while (cursorMin + durationMin <= dayEndMin) {
      const overlapping = todays.find((e) => e.startMin < cursorMin + durationMin && e.endMin > cursorMin);
      if (!overlapping) { placed = cursorMin; break; }
      cursorMin = overlapping.endMin; // jump past the blocker
    }
    if (placed === null) continue; // no room left today — stay silent rather than fake a fix

    const startOfDay = new Date(nowMs); startOfDay.setHours(0, 0, 0, 0);
    const startMs = startOfDay.getTime() + placed * 60000;
    const h = Math.floor(placed / 60);
    const clock = h === 0 ? "midnight" : h < 12 ? `${h} AM` : h === 12 ? "noon" : `${h - 12} PM`;

    return {
      id: block.id,
      label: block.label,
      conflictTitle: collider.title,
      note: `${collider.title} lands on your ${block.label}. There's room at ${clock} \\u2014 here's ${block.label} moved there, ready to drop in.`,
      fix: {
        title: block.label,
        start: startMs,
        durationMin,
        description: `Your ${block.label}, rescued from a calendar collision. Held for you, not written over your day.`,
      },
    };
  }
  return null;
}
