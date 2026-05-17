/*
 * contextProfile.js — v2 Context Profile data layer.
 *
 * Context Profile = user-named ambient/ongoing conditions the user has
 * observed correlate with their cognitive/emotional state. Different
 * from Trigger Profile because Triggers = external events that happen
 * TO the user (a hard conversation, a missed deadline); Context =
 * ambient states the user is IN (rainy day, third coffee, post-call
 * fog). Master todo lock: May 16, 2026.
 *
 * STRICT GUARDRAILS (locked in master todo, do not soften):
 *   - No causation claims. The label is the user's hypothesis, not
 *     Stillform's diagnosis.
 *   - No symptom tracking. This is not a medical record.
 *   - No medical data capture (no diagnoses, no medications, no
 *     dosages, no test results).
 *   - No food prescriptions. Stillform NEVER asks what the user ate,
 *     never lists foods, never moralizes about food.
 *   - The user names what they observe. Stillform helps them surface
 *     patterns they've already noticed.
 *
 * Schema:
 *   {
 *     contexts: [{
 *       id:             string,    // ctx_{base36-ts}_{6-rand}
 *       label:          string,    // user's named condition
 *       description:    string|"", // optional longer note (also user-written)
 *       createdAt:      ISO 8601,  // when added
 *       lastSeen:       ISO 8601,  // last time this context was associated with a state observation
 *       encounterCount: number     // how many times surfaced/associated (incremented externally)
 *     }],
 *     updatedAt: ISO 8601 | null
 *   }
 *
 * Storage key: stillform_context_profile
 *
 * Storage pattern matches v2 convention (sessions.js): plain localStorage,
 * fail-silent on unavailable storage. Cloud sync (Supabase) layers later
 * when Phase 5 sub-items get to the sync surface; for now local-first.
 *
 * Architectural mirror: v1 Trigger Profile (src/App.jsx:5611-5704) was
 * the template. Key adaptations for Context semantics:
 *   - No category enum (Triggers have 7 frozen categories; Context is
 *     freeform because conditions don't categorize cleanly — "rainy
 *     days" + "third coffee" + "post-call from mom" don't share a
 *     taxonomy and forcing one is the kind of mass-prescriptive design
 *     the guardrails reject)
 *   - description field (Context entries often need a longer note —
 *     "rainy days" vs "rainy days when I haven't slept enough" — and
 *     the user writes both)
 *   - No appendArtifactHistoryEntry yet (v2 audit history is a later
 *     architectural piece; manual mutations don't track lineage now,
 *     will retrofit when AI Mediation queue ships and starts proposing
 *     additions that need provenance)
 */

const STORAGE_KEY = "stillform_context_profile";

function emptyProfile() {
  return { contexts: [], updatedAt: null };
}

function generateContextId() {
  // ctx_ prefix mirrors v1's trig_ pattern for Trigger Profile. base36
  // timestamp + 6-char random suffix gives collision-free IDs in a
  // profile that stays under the practical ceiling of ~50 contexts.
  return `ctx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Read the user's Context Profile from localStorage.
 * Returns empty profile if storage is empty or unparseable.
 *
 * @returns {{ contexts: Array, updatedAt: string|null }}
 */
export function getContextProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProfile();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return emptyProfile();
    const contexts = Array.isArray(parsed.contexts) ? parsed.contexts : [];
    // Defensive filter: only return entries with the required shape.
    // Drops any malformed entries silently rather than crashing the
    // editor on bad data.
    return {
      contexts: contexts.filter(
        (c) => c && typeof c === "object" && typeof c.id === "string" && typeof c.label === "string"
      ),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
    };
  } catch {
    return emptyProfile();
  }
}

/**
 * Write a Context Profile to localStorage. Stamps updatedAt with
 * current time. Returns the saved profile or null on storage failure.
 *
 * @param {{ contexts: Array }} profile
 * @returns {{ contexts: Array, updatedAt: string }|null}
 */
export function saveContextProfile(profile) {
  if (!profile || typeof profile !== "object") return null;
  try {
    const safe = {
      contexts: Array.isArray(profile.contexts) ? profile.contexts : [],
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    return safe;
  } catch {
    return null;
  }
}

/**
 * Add a new context entry. Deduplicates by case-insensitive label
 * match — if an entry with this label already exists, returns the
 * existing entry rather than adding a duplicate.
 *
 * @param {{ label: string, description?: string }} input
 * @returns {object|null}  the new (or existing) context entry, or null if label is empty
 */
export function addContextEntry({ label, description = "" } = {}) {
  const trimmedLabel = typeof label === "string" ? label.trim() : "";
  if (!trimmedLabel) return null;
  const trimmedDescription = typeof description === "string" ? description.trim() : "";

  const profile = getContextProfile();
  const existing = profile.contexts.find(
    (c) => c.label.toLowerCase() === trimmedLabel.toLowerCase()
  );
  if (existing) return existing;

  const now = new Date().toISOString();
  const newEntry = {
    id: generateContextId(),
    label: trimmedLabel,
    description: trimmedDescription,
    createdAt: now,
    lastSeen: now,
    encounterCount: 0,
  };
  profile.contexts.push(newEntry);
  saveContextProfile(profile);
  return newEntry;
}

/**
 * Update an existing context entry. Only label + description are
 * mutable through this path; id / createdAt / encounterCount /
 * lastSeen are immutable here (the last two get their own
 * incrementer below).
 *
 * @param {string} id
 * @param {{ label?: string, description?: string }} updates
 * @returns {object|null}  the updated entry, or null if id not found
 */
export function updateContextEntry(id, updates) {
  if (!id || !updates || typeof updates !== "object") return null;
  const profile = getContextProfile();
  const idx = profile.contexts.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const existing = profile.contexts[idx];

  const allowed = {};
  if (typeof updates.label === "string" && updates.label.trim()) {
    allowed.label = updates.label.trim();
  }
  if (typeof updates.description === "string") {
    // Allow setting to empty string (user wants to clear the note).
    allowed.description = updates.description.trim();
  }
  if (Object.keys(allowed).length === 0) return existing;

  const updated = { ...existing, ...allowed };
  profile.contexts[idx] = updated;
  saveContextProfile(profile);
  return updated;
}

/**
 * Delete a context entry by id. Returns true if deleted, false if
 * id not found.
 *
 * @param {string} id
 * @returns {boolean}
 */
export function deleteContextEntry(id) {
  if (!id) return false;
  const profile = getContextProfile();
  const before = profile.contexts.length;
  profile.contexts = profile.contexts.filter((c) => c.id !== id);
  if (profile.contexts.length === before) return false;
  saveContextProfile(profile);
  return true;
}

/**
 * Increment the encounterCount and bump lastSeen for a context entry.
 * Called when external surfaces (AI Mediation, future autodetection,
 * manual associations) note this context applied to a state
 * observation.
 *
 * @param {string} id
 * @returns {object|null}  the updated entry, or null if id not found
 */
export function incrementContextEncounter(id) {
  if (!id) return null;
  const profile = getContextProfile();
  const idx = profile.contexts.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  profile.contexts[idx] = {
    ...profile.contexts[idx],
    encounterCount: (profile.contexts[idx].encounterCount || 0) + 1,
    lastSeen: now,
  };
  saveContextProfile(profile);
  return profile.contexts[idx];
}

/**
 * Format the Context Profile as a string for AI Mediation queue
 * consumption. Sorts by encounterCount desc + lastSeen desc so the
 * most load-bearing contexts surface first. Caps to top N to keep
 * the AI context window bounded.
 *
 * Forward-looking — used by AI Mediation queue sub-item, not by
 * Phase 5 sub-item #1 (Context Profile foundation). Included here
 * so the data layer is complete; consumer ships in its own sub-item.
 *
 * @param {number} [topN=12]
 * @returns {string|null}  formatted string or null if profile is empty
 */
export function formatContextProfileForAI(topN = 12) {
  const profile = getContextProfile();
  if (!profile.contexts.length) return null;
  const sorted = [...profile.contexts].sort((a, b) => {
    const aCount = a.encounterCount || 0;
    const bCount = b.encounterCount || 0;
    if (bCount !== aCount) return bCount - aCount;
    const aSeen = a.lastSeen || a.createdAt || "";
    const bSeen = b.lastSeen || b.createdAt || "";
    return bSeen.localeCompare(aSeen);
  });
  const lines = sorted.slice(0, topN).map((c) => {
    const count = c.encounterCount || 0;
    const countLabel = count === 1 ? "1 encounter" : `${count} encounters`;
    const descSuffix = c.description ? ` — ${c.description}` : "";
    return `- ${c.label} (${countLabel})${descSuffix}`;
  });
  return [
    "USER'S CONTEXT PROFILE — ambient/ongoing conditions the user has named as correlating with their state. The user has the baseline; you do not. These are observations they've already made; do NOT propose new ones, do NOT diagnose causation, do NOT prescribe behavior changes. If a current message clearly references one of these (the conditions, the timing, the wording), you may name the continuity once: \"This sounds like [context] again.\" Otherwise leave them alone.",
    "",
    ...lines,
  ].join("\n");
}
