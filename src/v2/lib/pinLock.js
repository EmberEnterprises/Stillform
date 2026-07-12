/**
 * pinLock — the app-level lock, web tier (W8 v2, Arlin's design 2026-07-09).
 *
 * Her threat model: the borrowed phone, and the estranged intimate with
 * account knowledge. PIN gates the app at cold start and re-arms on
 * backgrounding (60s grace). Native adds biometric on top at that milestone.
 *
 * HONEST SECURITY NOTE (on record in the doc): a web PIN is a DETERRENT,
 * not encryption. The PIN is stored as a salted SHA-256 hash so it can't be
 * simply read out of storage, but the underlying data remains as protected
 * as the device is. Real cryptographic protection arrives with the sync
 * design (PIN-in-decryption is a flagged eyes-open decision there).
 *
 * FORGOT-PIN PATH (her locked design): the only bypass is erase-and-start-
 * over — wiping to get past the PIN destroys the very thing a snooper came
 * to read. The door doesn't open; the room empties first.
 */

const HASH_KEY = "stillform_v2_pin_hash";
const SALT_KEY = "stillform_v2_pin_salt";
const GRACE_KEY = "stillform_v2_pin_last_bg";
export const GRACE_MS = 60 * 1000;

async function digest(pin, salt) {
  const data = new TextEncoder().encode(`${salt}:${pin}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function hasPin() {
  try {
    return !!localStorage.getItem(HASH_KEY);
  } catch {
    return false;
  }
}

export async function setPin(pin) {
  if (typeof pin !== "string" || pin.length < 4) return false;
  try {
    const salt = crypto.getRandomValues(new Uint32Array(2)).join("-");
    const h = await digest(pin, salt);
    localStorage.setItem(SALT_KEY, salt);
    localStorage.setItem(HASH_KEY, h);
    return true;
  } catch {
    return false;
  }
}

export async function verifyPin(pin) {
  try {
    const salt = localStorage.getItem(SALT_KEY);
    const stored = localStorage.getItem(HASH_KEY);
    if (!salt || !stored) return false;
    return (await digest(String(pin), salt)) === stored;
  } catch {
    return false;
  }
}

/** Owner-initiated removal (requires a verified PIN upstream). */
export function clearPin() {
  try {
    localStorage.removeItem(HASH_KEY);
    localStorage.removeItem(SALT_KEY);
    localStorage.removeItem(GRACE_KEY);
    return true;
  } catch {
    return false;
  }
}

/** Mark the moment the app left the screen (for the 60s grace). */
export function markBackgrounded() {
  try {
    localStorage.setItem(GRACE_KEY, String(Date.now()));
  } catch {
    /* fine */
  }
}

/** Should the gate arm right now? Cold start = yes (no grace mark or stale). */
export function shouldLock() {
  if (!hasPin()) return false;
  try {
    const t = Number(localStorage.getItem(GRACE_KEY) || 0);
    return !t || Date.now() - t > GRACE_MS;
  } catch {
    return true;
  }
}

/**
 * The erase-and-start-over bypass (her locked design). Removes every
 * app-prefixed key — the snooper's bypass destroys the target; the owner
 * gets a clean restart (post-sync, their data returns on re-auth).
 */
export function eraseEverything() {
  try {
    const doomed = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith("stillform_") || k.startsWith("stillform-"))) doomed.push(k);
    }
    doomed.forEach((k) => localStorage.removeItem(k));
    return true;
  } catch {
    return false;
  }
}
