
import { patternConfidence } from "./biasProfile.js";
/*
 * triggerProfile.js — Stillform's Trigger Profile data layer.
 *
 * Trigger Profile = user-named external/situational provocations the
 * user has noticed consistently hit harder than expected. Different
 * from Context Profile: Context = ambient conditions the user is IN
 * (rainy day, low blood sugar); Trigger = events that happen TO the
 * user (performance review, hard conversation, missed deadline).
 *
 * Schema:
 *   {
 *     triggers: [{
 *       id:             string,    // trig_{base36-ts}_{6-rand}
 *       label:          string,    // user's named trigger
 *       category:       string,    // one of TRIGGER_PROFILE_CATEGORIES
 *       createdAt:      ISO 8601,
 *       lastSeen:       ISO 8601,
 *       encounterCount: number
 *     }],
 *     updatedAt: ISO 8601 | null
 *   }
 *
 * Categories are a frozen 7-enum (work / relational / financial /
 * health / cross-cultural / current-events / other). Unlike Context
 * Profile (freeform labels, no taxonomy), triggers DO have a
 * taxonomy because the system needs the structural distinction —
 * "performance review" + "hard conversation with sister" + "tight
 * deadline" share enough categorical shape that the AI Mediation
 * queue can surface cross-category patterns ("you've named 4
 * relational triggers this month, all involving the same person").
 *
 * Storage: plain localStorage, fail-silent on storage unavailable.
 * Cloud sync layers later via Supabase. Audit history integration
 * arrives with the AI Mediation queue work.
 */

const STORAGE_KEY = "stillform_v2_trigger_profile";

/**
 * Frozen 7-category enum. Categories are fixed because the system
 * uses them for cross-stack pattern surfacing (AI Mediation queue
 * later). Adding a new category requires deliberate product
 * decision, not on-the-fly user customization.
 */
export const TRIGGER_PROFILE_CATEGORIES = Object.freeze([
  "work",            // power dynamics, deadlines, performance
  "relational",      // specific people, family dynamics
  "financial",       // money pressure, scarcity
  "health",          // medical stress, chronic conditions
  "cross-cultural",  // code-switching, identity navigation
  "current-events",  // news cycles, collective stress
  "other",           // user-defined catch-all
]);

function emptyProfile() {
  return { triggers: [], updatedAt: null };
}

function generateTriggerId() {
  return `trig_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Read the user's Trigger Profile from localStorage.
 * Returns empty profile if storage is empty or unparseable.
 *
 * @returns {{ triggers: Array, updatedAt: string|null }}
 */
export function getTriggerProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProfile();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return emptyProfile();
    const triggers = Array.isArray(parsed.triggers) ? parsed.triggers : [];
    return {
      triggers: triggers.filter(
        (t) =>
          t &&
          typeof t === "object" &&
          typeof t.id === "string" &&
          typeof t.label === "string"
      ),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
    };
  } catch {
    return emptyProfile();
  }
}

/**
 * Write a Trigger Profile to localStorage. Stamps updatedAt.
 * Returns the saved profile or null on storage failure.
 *
 * @param {{ triggers: Array }} profile
 * @returns {{ triggers: Array, updatedAt: string }|null}
 */
export function saveTriggerProfile(profile) {
  if (!profile || typeof profile !== "object") return null;
  try {
    const safe = {
      triggers: Array.isArray(profile.triggers) ? profile.triggers : [],
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    return safe;
  } catch {
    return null;
  }
}

/**
 * Add a new trigger. Deduplicates by case-insensitive label match.
 * Category falls back to "other" if not in the enum.
 *
 * @param {{ label: string, category?: string }} input
 * @returns {object|null}
 */
export function addTrigger({ label, category } = {}) {
  const trimmed = typeof label === "string" ? label.trim() : "";
  if (!trimmed) return null;
  const validCategory = TRIGGER_PROFILE_CATEGORIES.includes(category)
    ? category
    : "other";

  const profile = getTriggerProfile();
  const existing = profile.triggers.find(
    (t) => t.label.toLowerCase() === trimmed.toLowerCase()
  );
  if (existing) return existing;

  const now = new Date().toISOString();
  const newTrigger = {
    id: generateTriggerId(),
    label: trimmed,
    category: validCategory,
    createdAt: now,
    lastSeen: now,
    encounterCount: 0,
  };
  profile.triggers.push(newTrigger);
  saveTriggerProfile(profile);
  return newTrigger;
}

/**
 * Update an existing trigger. Only label + category are mutable.
 *
 * @param {string} id
 * @param {{ label?: string, category?: string }} updates
 * @returns {object|null}
 */
export function updateTrigger(id, updates) {
  if (!id || !updates || typeof updates !== "object") return null;
  const profile = getTriggerProfile();
  const idx = profile.triggers.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  const existing = profile.triggers[idx];

  const allowed = {};
  if (typeof updates.label === "string" && updates.label.trim()) {
    allowed.label = updates.label.trim();
  }
  if (
    typeof updates.category === "string" &&
    TRIGGER_PROFILE_CATEGORIES.includes(updates.category)
  ) {
    allowed.category = updates.category;
  }
  if (Object.keys(allowed).length === 0) return existing;

  const updated = { ...existing, ...allowed };
  profile.triggers[idx] = updated;
  saveTriggerProfile(profile);
  return updated;
}

/**
 * Delete a trigger by id.
 *
 * @param {string} id
 * @returns {boolean}
 */
export function deleteTrigger(id) {
  if (!id) return false;
  const profile = getTriggerProfile();
  const before = profile.triggers.length;
  profile.triggers = profile.triggers.filter((t) => t.id !== id);
  if (profile.triggers.length === before) return false;
  saveTriggerProfile(profile);
  return true;
}

/**
 * Increment encounterCount + bump lastSeen for a trigger.
 * Called when external surfaces note this trigger fired.
 *
 * @param {string} id
 * @returns {object|null}
 */
export function incrementTriggerEncounter(id) {
  if (!id) return null;
  const profile = getTriggerProfile();
  const idx = profile.triggers.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  profile.triggers[idx] = {
    ...profile.triggers[idx],
    encounterCount: (profile.triggers[idx].encounterCount || 0) + 1,
    lastSeen: new Date().toISOString(),
  };
  saveTriggerProfile(profile);
  return profile.triggers[idx];
}


/**
 * getTriggerDecay — the trigger's derived life-cycle tier, on the SAME engine
 * and thresholds the bias watch list uses (biasProfile.patternConfidence):
 * provisional → emerging → confirmed → quieting → retired. Nothing stored;
 * a fresh tag via tagTrigger bumps lastSeen and the tier walks back to
 * confirmed on its own. This is how discovery becomes evidence of change —
 * a trigger that stops firing is a finding, not a stale row.
 */
export function getTriggerDecay(entry, sessionsArg) {
  try {
    return patternConfidence(entry, sessionsArg);
  } catch {
    return { tier: "provisional", count: (entry && entry.encounterCount) || 0, quiet: null };
  }
}

/**
 * Tag a trigger for the current session (keystone trigger-tagging, June 18 2026):
 * create-or-match the label, then mark one encounter. This is the path that
 * finally WIRES incrementTriggerEncounter (previously defined but never called),
 * keeping the trigger profile and the signal log consistent on the same
 * discrete label. The caller passes a USER-CONFIRMED label only (AI elicits,
 * user confirms — never an AI-assigned trigger).
 *
 * @param {string} label  user-confirmed discrete trigger label
 * @returns {string|null} the canonical label (for the signal log) or null
 */
export function tagTrigger(label) {
  const trimmed = typeof label === "string" ? label.trim() : "";
  if (!trimmed) return null;
  const t = addTrigger({ label: trimmed });
  if (!t || !t.id) return null;
  incrementTriggerEncounter(t.id);
  return t.label;
}

/**
 * Format the Trigger Profile as a string for AI context injection.
 * Sorts by encounterCount desc + lastSeen desc so most load-bearing
 * triggers surface first. Caps to top N. Plural-aware count labels.
 *
 * Output shape:
 *   User's named external triggers: "label1" [category1] (3 encounters), "label2" [category2]
 *
 * @param {number} [limit=8]
 * @returns {string|null}
 */
export function formatTriggerProfileForAI(limit = 8) {
  try {
    const profile = getTriggerProfile();
    if (!profile.triggers.length) return null;
    const sorted = [...profile.triggers].sort((a, b) => {
      const ec = (b.encounterCount || 0) - (a.encounterCount || 0);
      if (ec !== 0) return ec;
      const at = new Date(a.lastSeen || a.createdAt || 0).getTime();
      const bt = new Date(b.lastSeen || b.createdAt || 0).getTime();
      return bt - at;
    });
    const top = sorted.slice(0, limit);
    const formatted = top
      .map((t) => {
        const count = t.encounterCount || 0;
        const countLabel =
          count === 0 ? "" : ` (${count} encounter${count === 1 ? "" : "s"})`;
        // Decay annotation (2026-07-01): a confirmed trigger that has gone
        // quiet is flagged so the model stops treating it as live load.
        const decay = getTriggerDecay(t);
        const quietLabel =
          decay.tier === "retired"
            ? ` [gone quiet — not seen in ${decay.quiet?.daysSince ?? "many"} days; treat as HISTORY unless the user raises it]`
            : decay.tier === "quieting"
            ? ` [quieting — not seen recently]`
            : "";
        return `"${t.label}" [${t.category}]${countLabel}${quietLabel}`;
      })
      .join(", ");
    return `User's named external triggers: ${formatted}`;
  } catch {
    return null;
  }
}
