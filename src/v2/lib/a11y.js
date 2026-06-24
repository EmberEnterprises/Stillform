/*
 * a11y.js — accessibility display settings (contrast + text size + motion).
 *
 * Settings persisted on-device, applied as data attributes on <html> so
 * tokens.css / components.css can override app-wide:
 *
 *   html[data-sf-contrast="high"]   — brighter quiet/faint text, stronger
 *                                     borders (token overrides only)
 *   html[data-sf-textsize="large"]  — whole-UI scale bump via zoom (the
 *                                     codebase sizes in px; zoom scales all of
 *                                     it uniformly; supported by every WebView
 *                                     this app ships in)
 *   html[data-sf-motion="reduced"]  — stops the ambient/decorative animation
 *                                     (aura breath + drift, film grain, focus
 *                                     bloom, draws, listening wave). An IN-APP
 *                                     control: the app already honors the OS
 *                                     "reduce motion" preference, but many
 *                                     people don't have it set system-wide and
 *                                     still want the screen to hold still.
 *
 * applyA11y() runs at AppV2 mount (before first paint) and on every change
 * from Settings.
 *
 * Storage: stillform_v2_a11y → {"contrast":"default"|"high",
 *                               "textSize":"default"|"large",
 *                               "motion":"full"|"reduced"}
 */

const KEY = "stillform_v2_a11y";

const DEFAULTS = { contrast: "default", textSize: "default", motion: "full" };

/** @returns {{contrast:string, textSize:string, motion:string}} */
export function getA11y() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw);
    return {
      contrast: parsed.contrast === "high" ? "high" : "default",
      textSize: parsed.textSize === "large" ? "large" : "default",
      motion: parsed.motion === "reduced" ? "reduced" : "full",
    };
  } catch {
    return { ...DEFAULTS };
  }
}

/** Persist one setting and re-apply. @param {"contrast"|"textSize"|"motion"} k */
export function setA11y(k, value) {
  const cur = getA11y();
  const next = { ...cur, [k]: value };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full/blocked — setting still applies for this session */
  }
  applyA11y(next);
  return next;
}

/** Apply settings to <html> as data attributes. Idempotent. */
export function applyA11y(settings) {
  const s = settings || getA11y();
  const el = document.documentElement;
  if (s.contrast === "high") el.setAttribute("data-sf-contrast", "high");
  else el.removeAttribute("data-sf-contrast");
  if (s.textSize === "large") el.setAttribute("data-sf-textsize", "large");
  else el.removeAttribute("data-sf-textsize");
  if (s.motion === "reduced") el.setAttribute("data-sf-motion", "reduced");
  else el.removeAttribute("data-sf-motion");
}
