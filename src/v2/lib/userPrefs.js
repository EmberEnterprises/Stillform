/*
 * userPrefs.js — the preferences spine (FULL BUILD item 9, settings depth).
 *
 * One namespaced store for every user-owned dial, with honest defaults.
 * Design laws:
 *   - A preference is a DIAL THE USER OWNS — never something the app infers
 *     and locks (the observe-don't-diagnose architecture applies to
 *     personalization too; CANON 7.1c bans type-matching).
 *   - Defaults are the app's current shipped behavior — turning the system
 *     on changes nothing until the user moves a dial.
 *   - Every default is FLAGGED FOR ARLIN below; her walk decides the picks.
 *
 * PREFS (v1 set):
 *   practice.defaultBreathing — "quick-reset" | "deep-regulate" | "cyclic-sighing"
 *     Which pattern the practice reaches for first. Default "quick-reset"
 *     (the shipped fast-settle default). [ARLIN: confirm default]
 *   concierge.volume — "adaptive" | "soft"
 *     The master dial over the proactive concierge. "adaptive" = the shipped
 *     behavior (state-adaptive: soft on depleted/heavy days, standard
 *     otherwise). "soft" = ALWAYS soft — the user's floor wins over the
 *     arithmetic. There is deliberately NO "loud" option: adaptation only
 *     ever backs off (Arlin's doctrine). [ARLIN: confirm the two-option set]
 *   sensory.audioCues — true | false
 *     Breathing/timer audio cues on or off. Default true. [ARLIN: confirm]
 *
 * All reads fail-silent with defaults; stillform_-prefixed (sync/wipe path).
 */

const KEY = "stillform_v2_prefs";

export const PREF_DEFAULTS = {
  practice: { defaultBreathing: "quick-reset" },
  concierge: { volume: "adaptive" },
  sensory: { audioCues: true },
};

const VALID = {
  "practice.defaultBreathing": ["quick-reset", "deep-regulate", "cyclic-sighing"],
  "concierge.volume": ["adaptive", "soft"],
  "sensory.audioCues": [true, false],
};

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const s = JSON.parse(raw);
    return s && typeof s === "object" ? s : {};
  } catch {
    return {};
  }
}

/** One pref by dotted path, with the shipped default as fallback. */
export function getPref(path) {
  const [ns, name] = String(path || "").split(".");
  if (!ns || !name || !(path in VALID)) return undefined;
  const stored = read();
  const v = stored && stored[ns] ? stored[ns][name] : undefined;
  if (VALID[path].includes(v)) return v;
  return PREF_DEFAULTS[ns][name];
}

/**
 * Whether the user has EXPLICITLY set this pref (vs riding the shipped
 * default). Overrides of designed behavior (e.g. the beat-driven breathing
 * offer) gate on this — a default must never silently beat a design.
 */
export function hasExplicitPref(path) {
  const [ns, name] = String(path || "").split(".");
  if (!ns || !name || !(path in VALID)) return false;
  const stored = read();
  const v = stored && stored[ns] ? stored[ns][name] : undefined;
  return VALID[path].includes(v);
}

/** Set one pref by dotted path. Invalid values are refused (returns false). */
export function setPref(path, value) {
  const [ns, name] = String(path || "").split(".");
  if (!ns || !name || !(path in VALID)) return false;
  if (!VALID[path].includes(value)) return false;
  const stored = read();
  if (!stored[ns] || typeof stored[ns] !== "object") stored[ns] = {};
  stored[ns][name] = value;
  try {
    localStorage.setItem(KEY, JSON.stringify(stored));
    return true;
  } catch {
    return false;
  }
}
