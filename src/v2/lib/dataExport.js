/**
 * dataExport — "Download my record." Gathers everything Stillform keeps on this
 * device into a single JSON file the user can save. Their data is theirs; this
 * makes that literal.
 *
 * Design choices for honesty and safety:
 *  - Gathers EVERY key under the "stillform" prefix (not a hardcoded list, which
 *    would silently drift out of date as features are added). One source of
 *    truth: whatever the app actually stored.
 *  - EXCLUDES auth/credential keys — an export the user downloads and might email
 *    or share should never contain a live access token. Those are secrets, not
 *    "their record."
 *  - Values are JSON-parsed where possible so the file is readable, not a wall of
 *    escaped strings; raw string kept as fallback.
 *  - Never throws to the UI; returns a best-effort object.
 */

// Keys that hold secrets/credentials, not personal record — never exported.
const EXCLUDED_KEYS = new Set([
  "stillform_v2_auth", // live access/refresh tokens
]);

// Substrings that mark a key as sensitive even if the exact name changes.
const EXCLUDED_SUBSTRINGS = ["auth", "token", "secret", "install_id"];

function isExcluded(key) {
  if (EXCLUDED_KEYS.has(key)) return true;
  const lower = key.toLowerCase();
  return EXCLUDED_SUBSTRINGS.some((s) => lower.includes(s));
}

/**
 * Gather the whole record as a plain object: { key: parsedValue }.
 * @returns {{ exportedAt:string, app:string, keys:number, data:object }}
 */
export function gatherRecord() {
  const data = {};
  let count = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("stillform")) continue;
      if (isExcluded(key)) continue;
      let raw;
      try { raw = localStorage.getItem(key); } catch { continue; }
      if (raw == null) continue;
      let value;
      try { value = JSON.parse(raw); } catch { value = raw; } // keep raw string if not JSON
      data[key] = value;
      count += 1;
    }
  } catch {
    // localStorage unavailable — return whatever we have (possibly empty).
  }
  return {
    exportedAt: new Date().toISOString(),
    app: "Stillform",
    keys: count,
    data,
  };
}

/**
 * Trigger a browser download of the record as a pretty-printed JSON file.
 * @returns {boolean} true if the download was dispatched
 */
export function downloadRecord() {
  try {
    const record = gatherRecord();
    const json = JSON.stringify(record, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().slice(0, 10);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stillform-record-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Release the object URL shortly after the click is handled.
    setTimeout(() => { try { URL.revokeObjectURL(url); } catch { /* noop */ } }, 1000);
    return true;
  } catch {
    return false;
  }
}
