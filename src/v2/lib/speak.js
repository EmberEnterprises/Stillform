/**
 * speak — P22 audio brief (2026-07-15). A thin, honest wrapper over the
 * browser's SpeechSynthesis API: free, no service, no network. Lets the Brief
 * be listened to hands-free ("coffee-making-compatible"). Degrades to a no-op
 * where speech synthesis isn't available (older webviews), reported via
 * isSpeechAvailable so the UI can hide the control rather than offer a dead tap.
 */

export function isSpeechAvailable() {
  try {
    return typeof window !== "undefined"
      && "speechSynthesis" in window
      && typeof window.SpeechSynthesisUtterance === "function";
  } catch {
    return false;
  }
}

/**
 * Speak an array of text segments in order, with a small pause between them so
 * sections don't run together. Returns a stop() function; calling it (or calling
 * speakSegments again) cancels any in-progress speech. onEnd fires when the last
 * segment finishes naturally (not on manual stop).
 */
export function speakSegments(segments, { rate = 1, onEnd } = {}) {
  if (!isSpeechAvailable()) return () => {};
  const synth = window.speechSynthesis;
  try { synth.cancel(); } catch { /* ignore */ }

  const clean = (Array.isArray(segments) ? segments : [segments])
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean);
  if (!clean.length) return () => {};

  let cancelled = false;
  let i = 0;

  const next = () => {
    if (cancelled || i >= clean.length) {
      if (!cancelled && typeof onEnd === "function") onEnd();
      return;
    }
    const u = new window.SpeechSynthesisUtterance(clean[i]);
    u.rate = rate;
    u.onend = () => { i += 1; next(); };
    u.onerror = () => { i += 1; next(); };
    try { synth.speak(u); } catch { /* ignore */ }
  };
  next();

  return function stop() {
    cancelled = true;
    try { synth.cancel(); } catch { /* ignore */ }
  };
}
