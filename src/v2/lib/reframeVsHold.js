// reframeVsHold.js — the user's lean between reframing and holding it in.
//
// Two ways to handle a hard feeling (Gross & John 2003; Science Sheet
// "Reframing vs holding it in"; Library "reframe-vs-hold"):
//   - reframe — change the read to change the feeling (cognitive reappraisal)
//   - hold    — feel it but keep the lid on and carry it (expressive suppression)
//   - both    — depends on the moment
//
// Habitual reframers tend to feel more positive / less negative emotion, stay
// closer, and pay no memory cost; habitual holders get the reverse. Holding it
// in isn't always wrong, but as a DEFAULT it costs — and reframing is the
// trainable move (it's exactly what Reframe does). This stores the user's
// self-identified lean so My Progress can reflect it and the work can point to
// the move.
//
// Both user AND AI (standing rule): the user names their lean here; the ERQ
// instrument already measures the same reappraisal/suppression lean and feeds
// the Growth mirror + Reframe steer, so the AI side is covered system-wide
// without duplicate plumbing. Honest-empty, fail-silent. No fabrication: only
// what the user picked is ever stored.

const STORE_KEY = "stillform_v2_reframe_vs_hold";
const LEANS = ["reframe", "hold", "both"];

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
  if (!ls) return { lean: null, setAt: null };
  try {
    const raw = ls.getItem(STORE_KEY);
    if (!raw) return { lean: null, setAt: null };
    const s = JSON.parse(raw);
    return {
      lean: LEANS.includes(s && s.lean) ? s.lean : null,
      setAt: typeof (s && s.setAt) === "string" ? s.setAt : null,
    };
  } catch {
    return { lean: null, setAt: null };
  }
}

function writeStore(next) {
  const ls = safeLocalStorage();
  if (!ls) return next;
  try { ls.setItem(STORE_KEY, JSON.stringify(next)); } catch {}
  return next;
}

/** The user's lean (reframe | hold | both), or null if unset. Honest-empty. */
export function getLean() {
  return readStore().lean;
}

/** True once the user has set a lean. */
export function hasLean() {
  return Boolean(readStore().lean);
}

/** Set the lean. Invalid value → no-op, returns null. */
export function setLean(lean) {
  if (!LEANS.includes(lean)) return null;
  writeStore({ lean, setAt: new Date().toISOString() });
  return lean;
}

/** Clear the lean. */
export function clearLean() {
  return writeStore({ lean: null, setAt: null });
}

/** The three self-read options, in order. */
export function reframeHoldOptions() {
  return [
    { id: "reframe", label: "I reframe it" },
    { id: "hold", label: "I hold it in" },
    { id: "both", label: "Both — depends" },
  ];
}
