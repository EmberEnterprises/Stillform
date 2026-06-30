// triggerMeta.js — the meta-pattern read over the user's Trigger Profile.
//
// Knowing what sets you off is the first layer (the Trigger Profile). The
// meta-pattern is the next one: across everything you've named, where does the
// load CONCENTRATE, and which triggers actually CARRY THE WEIGHT? Most people's
// load isn't spread evenly — it pools in one or two areas, and a handful of
// triggers do most of the firing. Seeing that is earned pattern recognition:
// the read comes from your own data, and seeing your own pattern puts a step
// between you and it (Kross & Ayduk 2011; Science Sheet; Library
// "trigger-meta-patterns").
//
// This is a deterministic READ — it never invents a pattern. Honest-empty: a
// meta-pattern needs a few triggers to exist, so under the threshold it returns
// null and the surface asks for a few more first. Both user AND AI at the data
// layer: the user names the triggers; Reframe tags encounters (tagTrigger /
// incrementTriggerEncounter) as they fire — so frequency fills in from both.

import { getTriggerProfile, TRIGGER_PROFILE_CATEGORIES } from "./triggerProfile.js";

// Plain, self-mastery labels for the frozen category enum.
const CATEGORY_LABEL = Object.freeze({
  work: "work",
  relational: "relationships",
  financial: "money",
  health: "health",
  "cross-cultural": "identity & code-switching",
  "current-events": "the wider world",
  other: "other",
});

// A meta-pattern needs at least this many named triggers to mean anything.
const MIN_TRIGGERS = 3;
// A category "concentrates" the load when it holds at least this share AND is
// the clear top. Below this, the load reads as spread.
const DOMINANT_SHARE = 0.4;

/** Plain label for a category id. */
export function triggerCategoryLabel(cat) {
  return CATEGORY_LABEL[cat] || "other";
}

/**
 * The meta-pattern read, or null when there isn't enough to read.
 *
 * Shape (when non-null):
 * {
 *   total: number,                 // how many triggers named
 *   totalEncounters: number,       // sum of encounterCounts
 *   clusters: [{ category, label, count, share }],   // desc by count
 *   dominant: { category, label, count, share } | null,  // the area the load pools in, or null if spread
 *   spread: boolean,               // true when no single area concentrates the load
 *   loadBearing: [{ label, category, encounterCount }], // the ones that fire most (top 3, encounterCount>0)
 *   untagged: boolean,             // true when nothing has been tagged firing yet
 * }
 *
 * @returns {object|null}
 */
export function getTriggerMeta() {
  let triggers;
  try {
    triggers = getTriggerProfile().triggers || [];
  } catch {
    return null;
  }
  if (!Array.isArray(triggers) || triggers.length < MIN_TRIGGERS) return null;

  const total = triggers.length;

  // cross-category clustering
  const counts = new Map();
  for (const t of triggers) {
    const cat = TRIGGER_PROFILE_CATEGORIES.includes(t && t.category) ? t.category : "other";
    counts.set(cat, (counts.get(cat) || 0) + 1);
  }
  const clusters = [...counts.entries()]
    .map(([category, count]) => ({
      category,
      label: triggerCategoryLabel(category),
      count,
      share: count / total,
    }))
    .sort((a, b) => b.count - a.count);

  // dominant = clear top that holds a real share, and isn't tied with the next
  const top = clusters[0];
  const tiedAtTop = clusters.filter((c) => c.count === top.count).length > 1;
  const dominant =
    !tiedAtTop && top.share >= DOMINANT_SHARE ? { ...top } : null;
  const spread = dominant === null;

  // encounter frequency — the load-bearing few
  const totalEncounters = triggers.reduce(
    (sum, t) => sum + (Number.isFinite(t.encounterCount) ? t.encounterCount : 0),
    0
  );
  const loadBearing = [...triggers]
    .filter((t) => (t.encounterCount || 0) > 0)
    .sort((a, b) => (b.encounterCount || 0) - (a.encounterCount || 0))
    .slice(0, 3)
    .map((t) => ({
      label: t.label,
      category: t.category,
      encounterCount: t.encounterCount || 0,
    }));
  const untagged = totalEncounters === 0;

  return { total, totalEncounters, clusters, dominant, spread, loadBearing, untagged };
}

/** True once there's enough to read a meta-pattern. */
export function hasTriggerMeta() {
  return getTriggerMeta() !== null;
}
