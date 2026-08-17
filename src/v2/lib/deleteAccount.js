/**
 * deleteAccount — client side of S6 / #1 THE ONE HARD BUILD.
 *
 * Calls the server to delete the account and its server-side records, then wipes
 * everything on this device: every stillform* key in localStorage, which in v2
 * is where all practice history lives (sessions, journal, signal log, settings,
 * auth). After this the app is a clean install — nothing of the user remains,
 * here or on the server.
 *
 * (v2 stores practice data as plain localStorage under stillform* keys. The
 * older v1 IndexedDB device-key store is gone; as a belt-and-suspenders we still
 * attempt to delete that legacy DB in case an old install left one behind, but
 * the receipt only ever claims what actually happened.)
 *
 * Order matters: server first (while we still hold a valid token), local wipe
 * second. If the server call fails we do NOT wipe locally — the user keeps their
 * data and can retry, rather than losing their history to a half-done deletion.
 */

import { fnUrl } from "./apiBase.js";
import { getAccessToken } from "./authApi.js";

const LEGACY_IDB_NAME = "stillform-keys"; // v1 device-key DB, absent in v2 installs

/** Remove every stillform* key from localStorage. Returns count removed. */
function wipeLocalStorage() {
  let removed = 0;
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("stillform")) keys.push(k);
    }
    for (const k of keys) {
      try { localStorage.removeItem(k); removed += 1; } catch { /* keep going */ }
    }
  } catch { /* localStorage unavailable — nothing to wipe */ }
  return removed;
}

/** Best-effort delete of the LEGACY v1 device-key DB, if an old install left one. */
function wipeLegacyDeviceKey() {
  return new Promise((resolve) => {
    try {
      if (typeof indexedDB === "undefined") { resolve(false); return; }
      const req = indexedDB.deleteDatabase(LEGACY_IDB_NAME);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
      req.onblocked = () => resolve(false); // don't hang on an open connection
      setTimeout(() => resolve(false), 2000); // never hang the flow on IDB
    } catch {
      resolve(false);
    }
  });
}

/**
 * Delete the account. Returns a plain result the UI turns into a receipt.
 * @returns {Promise<{ ok:boolean, error?:string, receipt?:object }>}
 */
export async function deleteAccount() {
  let token = null;
  try { token = await getAccessToken(); } catch { token = null; }
  if (!token) {
    return { ok: false, error: "You'll need to be signed in to delete your account." };
  }

  let res;
  try {
    res = await fetch(fnUrl("delete-account"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: "{}",
    });
  } catch {
    return { ok: false, error: "Couldn't reach the server. Your account is untouched — try again when you're back online." };
  }

  let body = null;
  try { body = await res.json(); } catch { body = null; }

  if (!res.ok || !body?.ok) {
    return {
      ok: false,
      error: (body && body.error) || "Something went wrong. Your account is untouched — please try again.",
    };
  }

  // Server side is gone. Now wipe this device.
  const localKeysRemoved = wipeLocalStorage();
  await wipeLegacyDeviceKey(); // best-effort; not claimed in the receipt

  return {
    ok: true,
    receipt: {
      account: true,
      serverTables: (body.deleted && body.deleted.personalDataTables) || [],
      localKeysRemoved,
    },
  };
}
