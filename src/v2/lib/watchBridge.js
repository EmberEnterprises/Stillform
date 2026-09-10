/**
 * watchBridge — the web/JS side of the Wear OS haptic breathing companion.
 *
 * When a breathing session starts on the phone, this tells the paired Samsung /
 * Wear OS watch to run the same pattern with haptic pacing (the native halves:
 * WatchBridgePlugin -> WatchBridge.java -> /stillform/breathe -> WearListenerService
 * -> WearBreatheActivity). On web or iOS or when no watch is paired, it does
 * nothing and never throws — the phone session is unaffected.
 *
 * Pattern ids are the LIVE v2 ids from BreathingSession.jsx:
 *   "deep-regulate" | "cyclic-sighing" | "quick-reset"
 * (the native activity also accepts the legacy aliases deep/cyclic_sigh/quick).
 */

const VALID_PATTERNS = new Set(["deep-regulate", "cyclic-sighing", "quick-reset"]);

function nativePlugin() {
  try {
    const cap = typeof window !== "undefined" ? window.Capacitor : null;
    if (!cap || typeof cap.isNativePlatform !== "function" || !cap.isNativePlatform()) return null;
    const plugin = cap.Plugins && cap.Plugins.WatchBridge;
    return plugin && typeof plugin.startBreathing === "function" ? plugin : null;
  } catch {
    return null;
  }
}

/**
 * Start the given breathing pattern on the watch, if one is reachable.
 * Fire-and-forget: never blocks or throws; the phone session runs regardless.
 * @param {"deep-regulate"|"cyclic-sighing"|"quick-reset"} pattern
 * @returns {boolean} true if the native call was dispatched, false otherwise
 */
export function startBreathingOnWatch(pattern) {
  const id = VALID_PATTERNS.has(pattern) ? pattern : "deep-regulate";
  const plugin = nativePlugin();
  if (!plugin) return false;
  try {
    // Fire and forget — the native side resolves immediately; we don't await.
    plugin.startBreathing({ pattern: id });
    return true;
  } catch {
    return false;
  }
}

/** Whether a watch companion could be driven right now (native platform present). */
export function isWatchBridgeAvailable() {
  return nativePlugin() !== null;
}
