// src/v2/lib/signalLog.js
//
// SIGNAL LOG — the per-occurrence, timestamped, DISCRETE-token substrate the
// deterministic discovery engine runs on (CANON §7.1a step 3; Master Todo
// keystone build, step 0). Scoped June 18 2026 after a data-layer read showed
// no such log existed: sessions persist free-text (precisionName/takeaway) plus
// coarse discrete fields (mode/beat); the feel-state chip is selected every
// session in Reframe but was DROPPED, never logged to a time-series; triggers
// were aggregate-only (label + lastSeen + count, no per-occurrence timeline).
//
// This log stops discarding what is already captured in the moment: one entry
// per occurrence holding the DISCRETE tokens (feel-state chip + any trigger
// label(s) present) with a timestamp. That is the only honest substrate for
// co-occurrence / sequence math — free text would require NLP, which is the
// fabrication door the app keeps shut.
//
// INTEGRITY: discrete tokens only. `chip` is recorded ONLY when it is a real
// discrete chip the user selected (never free text). No inference here — this
// module only records what was literally selected/named.
//
// Storage: localStorage key "stillform_signal_log" (stillform_-prefixed ⇒
// auto-included in prefix-based cloud backup AND data-wipe; readers tolerate
// missing fields — no schema-migration system exists yet).
//
// Shape: { entries: [{ id, chip, triggers, beat, mode, loggedAt, dateKey }] }
//   - id:       unique string "sig_{ts}_{rand}"
//   - chip:     string|null   discrete feel-state chip label/id (null if free-text/none)
//   - triggers: string[]      trigger label(s) present this occurrence (may be [])
//   - body:     string[]      discrete body-state token(s) this occurrence (may be []); fed by the body-capture surface (form = Arlin's design)
//   - beat:     string|null   "morning"|"main"|"eod"|"wind-down"
//   - mode:     string|null   "calm"|"clarity"|"hype"|"self"
//   - loggedAt: ISO 8601
//   - dateKey:  "YYYY-M-D" local
//
// Fail-silent: never throws to the UI; returns nullish/empty on error.

const STORAGE_KEY = "stillform_signal_log";

function safeLocalStorage() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage;
    }
  } catch (e) {
    // privacy mode / sandboxed env throws on access
  }
  return null;
}

function generateId() {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `sig_${ts}_${rand}`;
}

function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function getSignalLog() {
  const ls = safeLocalStorage();
  if (!ls) return { entries: [] };
  try {
    const raw = ls.getItem(STORAGE_KEY);
    if (!raw) return { entries: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.entries)) return { entries: [] };
    return { entries: parsed.entries };
  } catch (e) {
    return { entries: [] };
  }
}

export function saveSignalLog(store) {
  const ls = safeLocalStorage();
  if (!ls) return false;
  try {
    if (!store || !Array.isArray(store.entries)) return false;
    ls.setItem(STORAGE_KEY, JSON.stringify({ entries: store.entries }));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Record one occurrence's discrete tokens. Returns the entry or null.
 * Records nothing-of-interest entries too (chip null, triggers []) ONLY when
 * caller passes something — but to avoid noise we require at least one real
 * token (a chip OR at least one trigger). A fully-empty signal is dropped.
 *
 * @param {object} input
 * @param {string|null} input.chip      discrete feel-state chip (null if free-text/none)
 * @param {string[]}    input.triggers  trigger labels present this occurrence
 * @param {string[]}    input.body      discrete body-state token(s) this occurrence (may be [])
 * @param {string|null} input.beat
 * @param {string|null} input.mode
 */
export function recordSignal({ chip = null, triggers = [], body = [], beat = null, mode = null } = {}) {
  const cleanChip =
    typeof chip === "string" && chip.trim() ? chip.trim() : null;
  const cleanTriggers = Array.isArray(triggers)
    ? Array.from(
        new Set(
          triggers
            .filter((t) => typeof t === "string" && t.trim())
            .map((t) => t.trim()),
        ),
      )
    : [];

  const cleanBody = Array.isArray(body)
    ? Array.from(
        new Set(
          body
            .filter((b) => typeof b === "string" && b.trim())
            .map((b) => b.trim()),
        ),
      )
    : [];

  // Drop fully-empty signals — nothing discrete to learn from.
  if (!cleanChip && cleanTriggers.length === 0 && cleanBody.length === 0) return null;

  const now = new Date();
  const entry = {
    id: generateId(),
    chip: cleanChip,
    triggers: cleanTriggers,
    body: cleanBody,
    beat: typeof beat === "string" ? beat : null,
    mode: typeof mode === "string" ? mode : null,
    loggedAt: now.toISOString(),
    dateKey: todayKey(now),
  };

  const store = getSignalLog();
  store.entries.push(entry);
  const ok = saveSignalLog(store);
  return ok ? entry : null;
}

/** All entries, oldest-first (chronological — the order the engine reasons over). */
export function getSignals() {
  return getSignalLog().entries.slice().sort((a, b) => {
    const aT = a && a.loggedAt ? new Date(a.loggedAt).getTime() : 0;
    const bT = b && b.loggedAt ? new Date(b.loggedAt).getTime() : 0;
    return aT - bT;
  });
}

/** Count of logged occurrences (used for honest-empty-state gating). */
export function getSignalCount() {
  return getSignalLog().entries.length;
}

// Maps StateCheck body-state ids → the reframe.js bioFilter token vocabulary
// (LOW_DEMAND_FLAGS = medicated/depleted/sleep/pain/hormonal/gut). REQUIRED, not
// raw ids: StateCheck emits "sleep-deprived" but reframe.js matches "sleep", and
// "clear" is NOT an active filter (it means nothing notable is running).
const BIOFILTER_TOKEN_MAP = {
  activated: "activated",
  depleted: "depleted",
  "sleep-deprived": "sleep",
  pain: "pain",
  hormonal: "hormonal",
  // "clear" intentionally absent — excluded below.
};

/**
 * getLatestBodyBioFilter — the most recent SAME-DAY body-state capture, mapped
 * to reframe.js's bioFilter token vocabulary, as a comma-joined string (or
 * null). Populates the otherwise-null bioFilter slot in the reframe context so
 * the AI can read the user's current hardware state (M3, Arlin's call June 26).
 *
 * SAME-DAY ONLY — a stale read must never mis-frame today's session. Returns
 * null when there is no same-day body capture, or when the only state was
 * "clear" (nothing notable running → no active filter → AI defaults safely).
 *
 * NOTE (flagged for Arlin): StateCheck fires at session CLOSE, so this is the
 * latest same-day CLOSE read, not a fresh start-of-session read. The same-day
 * gate keeps it current; the start-read-vs-close-read nuance is the open M3
 * design question.
 */
export function getLatestBodyBioFilter() {
  let entries;
  try {
    entries = getSignalLog().entries;
  } catch {
    return null;
  }
  if (!Array.isArray(entries) || entries.length === 0) return null;
  const today = todayKey();
  // Walk newest→oldest (entries are stored in chronological push order).
  let latestBody = null;
  for (let i = entries.length - 1; i >= 0; i--) {
    const e = entries[i];
    if (!e || e.dateKey !== today) continue;
    if (Array.isArray(e.body) && e.body.length > 0) { latestBody = e.body; break; }
  }
  if (!latestBody) return null;
  const tokens = latestBody.map((id) => BIOFILTER_TOKEN_MAP[id]).filter(Boolean);
  if (tokens.length === 0) return null; // e.g. only "clear"
  return Array.from(new Set(tokens)).join(", ");
}
