/**
 * PracticeSurface — new home section under STILLFORM_FRAMING_LAW.md (May 12, 2026)
 *
 * Reads the app's existing data sources (sessions, bias profile, signal profile,
 * trigger profile) and renders the home's top section as a metacognition practice
 * surface — not a regulation-tool dashboard.
 *
 * Neuroplasticity factors baked in per framing law:
 *   1. Retrieval prompt — "3 days ago you named X. What's shifted since?"
 *      (active retrieval beats re-reading, per testing effect)
 *   2. Spaced re-exposure — patterns from N days/weeks ago surfaced at intervals
 *      (timing > total reps, per spacing effect)
 *   3. Library growth visible — "+N this week"
 *      (compounding is the proof the practice is working)
 *   4. AI prediction error — placeholder for cross-session pattern detection
 *      (brain encodes what it didn't predict; reserved for future commit)
 *   5. Forward prime — primary action names specific tool + pattern, not generic
 *      ("Reframe: criticism", not "Open today's work")
 *
 * Day-1 empty state: simple invitation to start the practice. No assumptions
 * about a built library.
 *
 * This component does NOT replace the existing home. It renders ABOVE the
 * existing time-of-day greeting, Morning strip, Mirror strip, and hero CTA.
 * Subsequent commits will subordinate or remove those once the new surface
 * is validated. Per audit philosophy v2.0 Layer 1 (don't break existing
 * functionality): no existing features are removed in this commit.
 *
 * Pure presentational component. All data + callbacks are props. No
 * direct localStorage reads or routing — the caller (App.jsx) owns those.
 */

import React from "react";

/**
 * Find a retrieval candidate from session history.
 * Looks for a session 3-7 days ago that has a flaggedPattern or triggerId.
 * Returns { label, source, daysAgo, sessionTimestamp } or null.
 *
 * Why 3-7 days: spacing-effect literature shows this is the sweet spot for
 * first retrieval — long enough that the memory is no longer in working
 * memory, short enough that retrieval is still feasible.
 */
export function findRetrievalCandidate(sessions, triggers = []) {
  if (!Array.isArray(sessions) || sessions.length === 0) return null;
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const minDays = 3;
  const maxDays = 7;

  // Newest-first scan in the 3-7 day window
  const candidates = sessions
    .filter(s => s && s.timestamp)
    .map(s => {
      const t = new Date(s.timestamp).getTime();
      if (!Number.isFinite(t)) return null;
      const daysAgo = Math.floor((now - t) / dayMs);
      if (daysAgo < minDays || daysAgo > maxDays) return null;
      // Prefer sessions that have an explicit named pattern
      let label = null;
      let source = null;
      if (s.flaggedPattern) {
        label = String(s.flaggedPattern);
        source = "flagged";
      } else if (s.triggerId) {
        // Resolve trigger id to label
        const trig = triggers.find(t => t && t.id === s.triggerId);
        if (trig && trig.label) {
          label = String(trig.label);
          source = "trigger";
        }
      }
      if (!label) return null;
      return { label, source, daysAgo, sessionTimestamp: s.timestamp };
    })
    .filter(Boolean)
    .sort((a, b) => a.daysAgo - b.daysAgo); // Closest in time first

  return candidates[0] || null;
}

/**
 * Find spaced re-exposure candidates from session history.
 * Returns patterns from sessions ~7, ~21, ~60 days ago that haven't been
 * revisited since. Each interval is a neuroplasticity-aligned spacing window.
 * Returns array of { label, daysAgo, interval } sorted by daysAgo ascending.
 *
 * Limits to 1 result for the first commit — surface one returning pattern at
 * a time to avoid overload. Future commits can expand.
 */
export function findSpacedReturns(sessions, triggers = [], { intervals = [7, 21, 60], tolerance = 2 } = {}) {
  if (!Array.isArray(sessions) || sessions.length === 0) return [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // Build map of pattern label -> most recent session timestamp
  const lastSeenByLabel = new Map();
  for (const s of sessions) {
    if (!s || !s.timestamp) continue;
    let label = null;
    if (s.flaggedPattern) label = String(s.flaggedPattern);
    else if (s.triggerId) {
      const trig = triggers.find(t => t && t.id === s.triggerId);
      if (trig && trig.label) label = String(trig.label);
    }
    if (!label) continue;
    const t = new Date(s.timestamp).getTime();
    if (!Number.isFinite(t)) continue;
    const prev = lastSeenByLabel.get(label);
    if (prev === undefined || t > prev) lastSeenByLabel.set(label, t);
  }

  // For each interval, find labels whose last-seen is within tolerance days of that interval
  const out = [];
  for (const interval of intervals) {
    for (const [label, lastTs] of lastSeenByLabel.entries()) {
      const daysAgo = Math.floor((now - lastTs) / dayMs);
      if (Math.abs(daysAgo - interval) <= tolerance) {
        out.push({ label, daysAgo, interval });
        break; // One per interval for the first commit
      }
    }
  }
  return out.sort((a, b) => a.daysAgo - b.daysAgo).slice(0, 1);
}

/**
 * Count distinct patterns named in the user's library.
 * Patterns named = bias profile entries + distinct flaggedPattern values from
 * sessions. (Bias profile is what the user said "yes I recognize this" to;
 * flaggedPattern is what the user self-flagged on the What Shifted screen.)
 */
export function countPatternsNamed(sessions, biasProfile) {
  const seen = new Set();
  if (Array.isArray(biasProfile)) {
    for (const p of biasProfile) {
      if (p && typeof p === "string") seen.add(p);
    }
  }
  if (Array.isArray(sessions)) {
    for (const s of sessions) {
      if (s && s.flaggedPattern && typeof s.flaggedPattern === "string") {
        seen.add(s.flaggedPattern);
      }
    }
  }
  return seen.size;
}

/**
 * Count distinct patterns named in the last 7 days that weren't named before.
 * Used for the "+N this week" library-growth indicator.
 */
export function countNewPatternsThisWeek(sessions) {
  if (!Array.isArray(sessions) || sessions.length === 0) return 0;
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const cutoff = now - 7 * dayMs;

  // Build full set of all patterns named, sorted by timestamp ascending
  const firstSeen = new Map();
  for (const s of sessions) {
    if (!s || !s.timestamp || !s.flaggedPattern) continue;
    const label = String(s.flaggedPattern);
    const t = new Date(s.timestamp).getTime();
    if (!Number.isFinite(t)) continue;
    if (!firstSeen.has(label) || t < firstSeen.get(label)) firstSeen.set(label, t);
  }

  let count = 0;
  for (const ts of firstSeen.values()) {
    if (ts >= cutoff) count++;
  }
  return count;
}

/**
 * Main component.
 *
 * Props:
 *   sessions         — array (from getSessionsFromStorage())
 *   biasProfile      — array of pattern names (from secureRead("stillform_bias_profile"))
 *   triggers         — array (from getTriggerProfile().triggers)
 *   onEnterPractice  — function(toolId, context) called when primary action tapped
 *                      context = { pattern, source, daysAgo } | null
 *   onOpenInfo       — function(title, body) to open the info modal (for ⓘ buttons)
 */
export function PracticeSurface({
  sessions = [],
  biasProfile = null,
  triggers = [],
  onEnterPractice,
  onOpenInfo,
}) {
  const patternsNamed = countPatternsNamed(sessions, biasProfile);
  const triggersMapped = Array.isArray(triggers) ? triggers.length : 0;
  const newThisWeek = countNewPatternsThisWeek(sessions);
  const retrieval = findRetrievalCandidate(sessions, triggers);
  const spaced = findSpacedReturns(sessions, triggers);
  const watching = Array.isArray(biasProfile) ? biasProfile.slice(0, 3) : [];

  // EMPTY STATE — day-1 user, nothing in library yet.
  // Per framing law: "Day 1 users have an empty library. The home needs to
  // handle the cold-start state gracefully." First action is to start the
  // practice — not to use a tool.
  const isEmpty = patternsNamed === 0 && triggersMapped === 0 && sessions.length === 0;

  if (isEmpty) {
    return (
      <div
        style={{
          marginBottom: 32,
          padding: "20px 18px",
          background: "var(--surface)",
          border: "0.5px solid var(--border)",
          borderRadius: "var(--r-lg, 12px)",
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "var(--text-muted)",
            fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: "0.12em",
            marginBottom: 12,
          }}
        >
          YOUR PRACTICE
        </div>
        <div
          style={{
            fontSize: 15,
            color: "var(--text)",
            lineHeight: 1.5,
            marginBottom: 16,
          }}
        >
          A metacognition practice. Each session names a pattern, builds a
          concept, and adds to your library. Start with what's loudest right now.
        </div>
        <button
          onClick={() => onEnterPractice && onEnterPractice("reframe", null)}
          style={{
            width: "100%",
            padding: "14px 18px",
            background: "var(--amber-glow, rgba(255,180,80,0.08))",
            border: "0.5px solid var(--amber-dim)",
            borderRadius: "var(--r, 8px)",
            color: "var(--amber)",
            fontSize: 14,
            fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: "0.04em",
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          Open Reframe →
        </button>
      </div>
    );
  }

  // BUILT-LIBRARY STATE — user has session history; show patterns + retrieval prompt + spaced returns.
  return (
    <div style={{ marginBottom: 28 }}>
      {/* ── PATTERNS — library state at a glance ─────────────────────────── */}
      <div
        style={{
          marginBottom: 18,
          paddingBottom: 12,
          borderBottom: "0.5px solid var(--border)",
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "var(--text-muted)",
            fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: "0.14em",
            marginBottom: 6,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>PATTERNS</span>
          {onOpenInfo && (
            <button
              aria-label="About patterns"
              onClick={() =>
                onOpenInfo(
                  "Patterns",
                  "The metacognition practice builds a library of named patterns — specific mental representations of how you process. Each session adds to or refines this library. As the library grows, pattern recognition becomes faster. This is concept-formation through repeated naming, grounded in Barrett (2017) constructed emotion theory and Hoemann et al. (2021) on experience sampling as a granularity intervention."
                )
              }
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: 11,
                padding: "0 2px",
                lineHeight: 1,
              }}
            >
              ⓘ
            </button>
          )}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "var(--text)",
            fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: "0.02em",
            lineHeight: 1.6,
          }}
        >
          <span>{patternsNamed} named</span>
          {triggersMapped > 0 && (
            <>
              <span style={{ margin: "0 8px", color: "var(--text-muted)", opacity: 0.5 }}>·</span>
              <span>{triggersMapped} triggers mapped</span>
            </>
          )}
          {newThisWeek > 0 && (
            <>
              <span style={{ margin: "0 8px", color: "var(--text-muted)", opacity: 0.5 }}>·</span>
              <span style={{ color: "var(--amber)" }}>+{newThisWeek} this week</span>
            </>
          )}
        </div>
        {watching.length > 0 && (
          <div
            style={{
              marginTop: 8,
              fontSize: 11,
              color: "var(--text-muted)",
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: "0.04em",
            }}
          >
            watching:{" "}
            {watching.map((w, i) => (
              <span key={i}>
                {i > 0 && <span style={{ opacity: 0.5 }}> · </span>}
                <span>{String(w).toLowerCase()}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── TODAY — retrieval prompt + primary action ────────────────────── */}
      {retrieval ? (
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: "0.14em",
              marginBottom: 10,
            }}
          >
            TODAY
          </div>
          <div
            style={{
              fontSize: 15,
              color: "var(--text)",
              lineHeight: 1.55,
              marginBottom: 16,
            }}
          >
            {retrieval.daysAgo} {retrieval.daysAgo === 1 ? "day" : "days"} ago you named{" "}
            <span style={{ color: "var(--amber)" }}>{retrieval.label.toLowerCase()}</span>.
            <br />
            What's shifted since?
          </div>
          <button
            onClick={() =>
              onEnterPractice &&
              onEnterPractice("reframe", {
                pattern: retrieval.label,
                source: retrieval.source,
                daysAgo: retrieval.daysAgo,
              })
            }
            style={{
              width: "100%",
              padding: "14px 18px",
              background: "var(--amber-glow, rgba(255,180,80,0.08))",
              border: "0.5px solid var(--amber-dim)",
              borderRadius: "var(--r, 8px)",
              color: "var(--amber)",
              fontSize: 14,
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: "0.04em",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            Reframe: {retrieval.label.toLowerCase()} →
          </button>
        </div>
      ) : null}

      {/* ── DUE FOR REVISIT — spaced re-exposure surfacing ────────────────── */}
      {spaced.length > 0 && (
        <div
          style={{
            marginBottom: 16,
            padding: "10px 12px",
            background: "var(--surface, transparent)",
            border: "0.5px solid var(--border)",
            borderRadius: "var(--r, 8px)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: "0.12em",
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>DUE FOR REVISIT</span>
            {onOpenInfo && (
              <button
                aria-label="About spaced revisits"
                onClick={() =>
                  onOpenInfo(
                    "Spaced revisit",
                    "Patterns are surfaced at neuroplasticity-aligned intervals (around 1 week, 3 weeks, 2 months) because spaced retrieval strengthens memory more than massed repetition. Returning to a pattern after time has passed updates the concept (memory reconsolidation, Schiller et al. 2010) and deepens the library."
                  )
                }
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: 10,
                  padding: "0 2px",
                  lineHeight: 1,
                }}
              >
                ⓘ
              </button>
            )}
          </div>
          {spaced.map((item, i) => {
            const intervalLabel =
              item.interval >= 60
                ? `${Math.round(item.interval / 30)} months ago`
                : item.interval >= 21
                ? `${Math.round(item.interval / 7)} weeks ago`
                : `${item.interval} days ago`;
            return (
              <button
                key={i}
                onClick={() =>
                  onEnterPractice &&
                  onEnterPractice("reframe", {
                    pattern: item.label,
                    source: "spaced",
                    daysAgo: item.daysAgo,
                  })
                }
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  fontSize: 13,
                  color: "var(--text)",
                  fontFamily: "'IBM Plex Mono', monospace",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <span style={{ color: "var(--amber)" }}>{item.label.toLowerCase()}</span>
                <span style={{ margin: "0 6px", color: "var(--text-muted)", opacity: 0.6 }}>·</span>
                <span style={{ color: "var(--text-muted)" }}>{intervalLabel}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* PREDICTION ERROR PLACEHOLDER —
          "Stillform caught a pattern: X fires after Y" requires cross-session
          AI analysis that doesn't yet exist in the codebase. Reserved for a
          future commit that wires up the AI cross-pattern detector. Per audit
          philosophy v2.0 Layer 1.1: don't ship UI that has no backing data.
          The data source has to land first. */}
    </div>
  );
}

export default PracticeSurface;
