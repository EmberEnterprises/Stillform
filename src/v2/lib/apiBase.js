/**
 * apiBase — the one place that decides where serverless functions live
 * (2026-07-15, pre-native #1).
 *
 * On web, functions are same-origin: "/.netlify/functions/x" resolves against
 * stillformapp.com and works. Inside the native app the origin becomes
 * capacitor://localhost (Android) or a file/app scheme (iOS), so a relative
 * "/.netlify/..." resolves to the local webview and every AI call, brief,
 * backup, and subscription check breaks silently.
 *
 * Fix: route every function URL through fnUrl(). On web it stays relative
 * (byte-for-byte the current behavior). On native it becomes absolute against
 * the deployed origin. One source of truth — no call site can be missed, and
 * flipping the origin later is a one-line change here.
 */

// The deployed origin that hosts the Netlify functions. Native builds call
// here; web ignores it (stays same-origin relative).
const DEPLOYED_ORIGIN = "https://stillformapp.com";

/**
 * True when running inside the Capacitor native shell (not a normal browser).
 * Defensive: if Capacitor isn't present (pure web build), always false.
 */
export function isNativeRuntime() {
  try {
    // Capacitor injects a global; checking it avoids a hard import dependency
    // in web-only bundles.
    const cap = typeof window !== "undefined" ? window.Capacitor : null;
    return !!(cap && typeof cap.isNativePlatform === "function" && cap.isNativePlatform());
  } catch {
    return false;
  }
}

/**
 * Build a full URL for a Netlify function.
 * @param {string} name  e.g. "reframe" or "/.netlify/functions/reframe" or "reframe"
 * @returns {string}
 */
export function fnUrl(name) {
  // Accept a bare name, a leading-slash path, or a full functions path.
  let path = String(name || "").trim();
  if (!path.startsWith("/.netlify/functions/")) {
    path = "/.netlify/functions/" + path.replace(/^\/+/, "").replace(/^\.netlify\/functions\//, "");
  }
  return isNativeRuntime() ? DEPLOYED_ORIGIN + path : path;
}

/**
 * Build a URL for the first-party /go/* redirect layer (crisis links, outbound
 * destinations). Same rule as fnUrl: relative on web, absolute against the
 * deployed origin on native — so a crisis redirect never dead-ends in the
 * webview.
 * @param {string} path  e.g. "/go/helpline" or "go/helpline"
 * @returns {string}
 */
export function goUrl(path) {
  let p = String(path || "").trim();
  if (!p.startsWith("/go/")) p = "/go/" + p.replace(/^\/+/, "").replace(/^go\//, "");
  return isNativeRuntime() ? DEPLOYED_ORIGIN + p : p;
}
