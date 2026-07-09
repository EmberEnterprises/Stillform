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
  practice: { defaultBreathing: "quick-reset", hapticPacing: false },
  ai: { directness: "standard" },
  concierge: {
    volume: "adaptive",
    meetingPrompts: true,
    forecasts: true,
    eveningDecompression: true,
    lessonNudges: true,
  },
};

const VALID = {
  "practice.defaultBreathing": ["quick-reset", "deep-regulate", "cyclic-sighing"],
  // W5 (2026-07-09): eyes-free pacing — vibration marks each phase so the
  // screen becomes optional (low vision, closed eyes, walking). Android web
  // supports navigator.vibrate; unsupported devices no-op silently. Default
  // OFF (nothing-forced). NOTE: this is the honest consumer the earlier
  // audio-toggle refusal was waiting for — vibration shipped first; audio
  // joins when real sound design exists.
  "practice.hapticPacing": [true, false],
  // AI directness: how straight the Reframe voice lands. "gentle" = more
  // space, softer edges; "direct" = fewer cushions, straighter naming.
  // Doctrine unchanged at every setting: suggestive never deterministic.
  "ai.directness": ["gentle", "standard", "direct"],
  "concierge.volume": ["adaptive", "soft"],
  // Per-voice switches: each concierge voice individually silenceable —
  // consent granular, never all-or-nothing.
  "concierge.meetingPrompts": [true, false],
  "concierge.forecasts": [true, false],
  "concierge.eveningDecompression": [true, false],
  "concierge.lessonNudges": [true, false],
  // NOTE (honesty): sensory.audioCues was REMOVED 2026-07-08 — nothing in v2
  // consumes audio; a toggle controlling nothing is theater. Re-add with the
  // first real sound consumer.
};

// Free-text prefs (validated by shape, not enum).
const TEXT_PREFS = {
  // How the AI addresses the user — their word, used sparingly and only
  // when natural. Empty = no name used (the shipped behavior).
  "ai.addressAs": { maxLen: 24 },
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
  if (!ns || !name) return undefined;
  const stored = read();
  const v = stored && stored[ns] ? stored[ns][name] : undefined;
  if (path in TEXT_PREFS) {
    return typeof v === "string" ? v.slice(0, TEXT_PREFS[path].maxLen) : "";
  }
  if (!(path in VALID)) return undefined;
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
  if (!ns || !name) return false;
  const stored = read();
  const v = stored && stored[ns] ? stored[ns][name] : undefined;
  if (path in TEXT_PREFS) return typeof v === "string" && v.trim().length > 0;
  if (!(path in VALID)) return false;
  return VALID[path].includes(v);
}

/** Set one pref by dotted path. Invalid values are refused (returns false). */
export function setPref(path, value) {
  const [ns, name] = String(path || "").split(".");
  if (!ns || !name) return false;
  if (path in TEXT_PREFS) {
    if (typeof value !== "string") return false;
    value = value.trim().slice(0, TEXT_PREFS[path].maxLen);
  } else {
    if (!(path in VALID)) return false;
    if (!VALID[path].includes(value)) return false;
  }
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
