/*
 * anchors.js — cue → action anchor store.
 *
 * An anchor is a pairing the user is already half-doing, made explicit:
 * "jaw clenches at the laptop" → "drop shoulders, one slow exhale."
 * The AI Mediation pipeline proposes them from EOD/session evidence
 * (backend contract: add { cue: 4–40 chars, action: 4–60 chars },
 * retire { id } after 21+ days unreferenced) — and NOTHING is written
 * here without the user's explicit approval in the queue.
 *
 * Soft retire only (status flips, entry kept) — consistent with the
 * watch-list rule: user-named work is honored, never auto-deleted.
 *
 * Storage: stillform_v2_anchors → [{ id, cue, action, addedAt, source,
 *   status: "active"|"retired", retiredAt? }]
 */

const KEY = "stillform_v2_anchors";

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeAll(arr) {
  try {
    localStorage.setItem(KEY, JSON.stringify(arr));
  } catch {
    /* storage full/blocked — practice unaffected */
  }
}

/** All anchors, newest first. */
export function getAnchors() {
  return readAll().sort((a, b) => (b.addedAt || "").localeCompare(a.addedAt || ""));
}

/** Active anchors only. */
export function getActiveAnchors() {
  return getAnchors().filter((a) => a.status !== "retired");
}

/**
 * Add an anchor (validated to the backend contract bands).
 * @param {{cue: string, action: string, source?: string}} input
 * @returns {object|null} the stored anchor, or null if invalid.
 */
export function addAnchor({ cue, action, source = "mediation" } = {}) {
  const c = typeof cue === "string" ? cue.trim().slice(0, 40) : "";
  const a = typeof action === "string" ? action.trim().slice(0, 60) : "";
  if (c.length < 4 || a.length < 4) return null;
  const entry = {
    id: `anc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    cue: c,
    action: a,
    addedAt: new Date().toISOString(),
    source,
    status: "active",
  };
  writeAll([...readAll(), entry]);
  return entry;
}

/** Soft-retire an anchor by id. @returns {boolean} whether it applied. */
export function retireAnchor(id) {
  const all = readAll();
  const hit = all.find((a) => a.id === id && a.status !== "retired");
  if (!hit) return false;
  hit.status = "retired";
  hit.retiredAt = new Date().toISOString();
  writeAll(all);
  return true;
}

/** Compact active list for AI context payloads. */
export function formatAnchorsForAI() {
  return getActiveAnchors().map(({ id, cue, action }) => ({ id, cue, action }));
}
