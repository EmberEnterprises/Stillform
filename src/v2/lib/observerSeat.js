// observerSeat.js — the observer-seat move: seeing a charged thought from a
// step back instead of being run by it.
//
// Two ways to step back, both already built as primitives here:
//   - defuse(text)  — wrap the thought as something you're HAVING:
//                     "I'm having the thought that ___" (ACT cognitive defusion)
//   - revoice(text) — say it from a step away, in the second person: "you ___"
//                     (self-distancing)
//
// Stepping back like this loosens a thought's grip — the words don't change,
// your distance from them does (Kross & Ayduk 2011, psychological distancing;
// Han & Kim 2022, ACT defusion; Science Sheet; Library "observer-seat").
//
// This module turns the two primitives into the readings the surface shows, and
// keeps a light count of uses so My Progress can reflect the practice. Honest:
// if there's no first-person thought to step back from (or it's too long to
// wrap), it returns nothing rather than fake a transform. Fail-silent.

import { defuse } from "./defusion.js";
import { revoice } from "./selfDistance.js";

const STORE_KEY = "stillform_v2_observer_seat";

function safeLocalStorage() {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch {}
  try {
    if (typeof globalThis !== "undefined" && globalThis.localStorage) return globalThis.localStorage;
  } catch {}
  return null;
}

function readStore() {
  const ls = safeLocalStorage();
  if (!ls) return { count: 0, lastAt: null };
  try {
    const raw = ls.getItem(STORE_KEY);
    if (!raw) return { count: 0, lastAt: null };
    const s = JSON.parse(raw);
    return {
      count: Number.isInteger(s && s.count) && s.count >= 0 ? s.count : 0,
      lastAt: typeof (s && s.lastAt) === "string" ? s.lastAt : null,
    };
  } catch {
    return { count: 0, lastAt: null };
  }
}

function writeStore(next) {
  const ls = safeLocalStorage();
  if (!ls) return next;
  try { ls.setItem(STORE_KEY, JSON.stringify(next)); } catch {}
  return next;
}

/**
 * The two seat readings of the user's own thought, or null when there's nothing
 * to step back from.
 *
 * - `defused`   — "I'm having the thought that ___" (works on almost any thought)
 * - `distanced` — the same thought said to yourself in the second person, or
 *                 null when the thought has no "I" to distance from
 *
 * Returns null only when BOTH are unavailable (empty, or too long to wrap).
 *
 * @param {string} text
 * @returns {{ defused: string|null, distanced: string|null } | null}
 */
export function observerSeatForms(text) {
  if (typeof text !== "string" || !text.trim()) return null;
  const defused = defuse(text);
  const dr = revoice(text, { person: "second" });
  const distanced = dr && typeof dr.text === "string" && dr.text.trim() ? dr.text : null;
  if (!defused && !distanced) return null;
  return { defused: defused || null, distanced };
}

/** Record one use of the observer seat (for My Progress). Fail-silent. */
export function recordObserverSeatUse() {
  const s = readStore();
  return writeStore({ count: s.count + 1, lastAt: new Date().toISOString() });
}

/** How many times the user has taken the seat. Honest-empty: 0. */
export function getObserverSeatCount() {
  return readStore().count;
}

/** Clear the count. */
export function clearObserverSeat() {
  return writeStore({ count: 0, lastAt: null });
}
