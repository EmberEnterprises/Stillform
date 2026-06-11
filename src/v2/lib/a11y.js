/*
 * a11y.js — accessibility display settings (contrast + text size).
 *
 * Rebuild-backlog item (re-audited June 2 2026; Arlin chose rebuild).
 * Two binary settings, persisted on-device, applied as data attributes
 * on <html> so tokens.css can override design tokens app-wide:
 *
 *   html[data-sf-contrast="high"]   — brighter quiet/faint text, stronger
 *                                     borders (token overrides only; no
 *                                     per-component changes)
 *   html[data-sf-textsize="large"]  — whole-UI scale bump via zoom (the
 *                                     codebase sizes in px; zoom scales all
 *                                     of it uniformly and is supported by
 *                                     every WebView this app ships in —
 *                                     Chromium, WebKit, and Firefox 126+)
 *
 * applyA11y() runs at AppV2 mount (before first paint of the tree) and on
 * every change from Settings. Honest scope: this is display accessibility
 * only — reduced-motion already respects the OS preference elsewhere.
 *
 * Storage: stillform_v2_a11y → {"contrast":"default"|"high",
 *                               "textSize":"default"|"large"}
 */

const KEY = "stillform_v2_a11y";

const DEFAULTS = { contrast: "default", textSize: "default" };

/** @returns {{contrast:string, textSize:string}} */
export function getA11y() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw);
    return {
      contrast: parsed.contrast === "high" ? "high" : "default",
      textSize: parsed.textSize === "large" ? "large" : "default",
    };
  } catch {
    return { ...DEFAULTS };
  }
}

/** Persist one setting and re-apply. @param {"contrast"|"textSize"} k */
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
}
