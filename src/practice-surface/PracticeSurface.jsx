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
 * Find the trigger most likely to come up again — for the Anticipate /
 * pre-mortem rep surface (brainstorm idea #7, May 13, 2026).
 *
 * Returns the trigger with the highest encounterCount, gated by minimum
 * encounter threshold (>= 3 lifetime encounters so we don't surface
 * one-time triggers). Returns { label, encounterCount } | null.
 *
 * Why this is distinct from the calendar pre-event rep (#4): #4 fires when
 * a calendar event matches an identified trigger or is generally pressuring.
 * #7 fires WITHOUT a calendar match — based purely on encounter pattern.
 * The user has hit this trigger ≥3 times historically; today might bring it
 * again. Anticipating it as a pre-installed move (Gollwitzer 1999) is the
 * rep — even when the moment isn't on a calendar.
 *
 * Bounded design (Framing Law / Wells 2009): one trigger surfaced at a time,
 * no analytics on encounter frequency shown, no "you've encountered this N
 * times" surveillance framing. Just the name and an invitation to rep.
 */
export function findAnticipateCandidate(triggers = []) {
  if (!Array.isArray(triggers) || triggers.length === 0) return null;
  const eligible = triggers
    .filter(t => t && t.label && Number.isFinite(t.encounterCount) && t.encounterCount >= 3)
    .sort((a, b) => (b.encounterCount || 0) - (a.encounterCount || 0));
  if (eligible.length === 0) return null;
  const top = eligible[0];
  return {
    label: String(top.label),
    encounterCount: top.encounterCount,
  };
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
 *   showPreSleep     — boolean (parent computes time-of-day + sessions-today + EOD-done gating)
 */
export function PracticeSurface({
  sessions = [],
  biasProfile = null,
  triggers = [],
  onEnterPractice,
  onOpenInfo,
  showPreSleep = false,
}) {
  const patternsNamed = countPatternsNamed(sessions, biasProfile);
  const triggersMapped = Array.isArray(triggers) ? triggers.length : 0;
  const newThisWeek = countNewPatternsThisWeek(sessions);
  const retrieval = findRetrievalCandidate(sessions, triggers);
  const spaced = findSpacedReturns(sessions, triggers);
  const anticipate = findAnticipateCandidate(triggers);
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
      {/* ── PRE-SLEEP — brainstorm #2 (May 13, 2026) ───────────────────────
          Opportunistic surface — visible only when the parent passes
          showPreSleep=true (late-evening time window AND user has practiced
          today AND EOD not yet completed). Stickgold/Walker memory-
          consolidation literature: practice within the sleep-window
          encoding band has stronger consolidation than mid-day practice.
          One bounded rep before sleep cements the day's concept gains.

          Bounded design: appears at most once per day (gated by EOD-done
          flag in parent), opportunistic surface only (no notification
          scheduling — that's post-launch infra). The user opens the app
          in the evening and the rep is there; they don't open the app
          and the rep doesn't fire. Aligned with Framing Law principle:
          bounded engagement, not unbounded notification noise. */}
      {showPreSleep && (
        <div
          style={{
            marginBottom: 18,
            padding: "12px 14px",
            border: "0.5px solid var(--amber-dim)",
            borderRadius: "var(--r-lg, 12px)",
            background: "var(--amber-glow, rgba(255,180,80,0.05))",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "var(--amber)",
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: "0.14em",
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>PRE-SLEEP</span>
            {onOpenInfo && (
              <button
                aria-label="About pre-sleep rep"
                onClick={() =>
                  onOpenInfo(
                    "Pre-sleep rep",
                    "A short rep before sleep consolidates the day's concept gains. Sleep is when the brain encodes what it learned that day into long-term structure (Stickgold & Walker). A 2-3 minute rep in the late-evening window cements naming you've done across the day. Bounded: one rep, then close the day."
                  )
                }
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--amber)",
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
          <div
            style={{
              fontSize: 14,
              color: "var(--text)",
              lineHeight: 1.5,
              marginBottom: 10,
            }}
          >
            One short rep before sleep cements the day.
          </div>
          <button
            onClick={() =>
              onEnterPractice &&
              onEnterPractice("reframe", {
                pattern: "",
                source: "pre-sleep",
                daysAgo: null,
              })
            }
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "var(--surface)",
              border: "0.5px solid var(--amber)",
              borderRadius: "var(--r, 8px)",
              color: "var(--amber)",
              fontSize: 13,
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: "0.06em",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            Close the day · 2 min →
          </button>
        </div>
      )}

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

      {/* ── ANTICIPATE — brainstorm #7 (May 13, 2026) ──────────────────────
          Surfaces the highest-encounter trigger so the user can run a
          pre-mortem rep BEFORE the trigger fires today. Distinct from #4
          pre-event rep (which needs a calendar event match) — #7 fires
          purely on encounter pattern (≥3 lifetime encounters). Gollwitzer
          1999 implementation intentions made operational without a
          calendar dependency. Bounded: one trigger surfaced at a time,
          no frequency counts displayed (Type 2 rumination guardrail per
          Wells 2009). */}
      {anticipate && (
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
            <span>ANTICIPATE</span>
            {onOpenInfo && (
              <button
                aria-label="About anticipate"
                onClick={() =>
                  onOpenInfo(
                    "Anticipate",
                    "A trigger you've encountered before is likely to come up again. Running a pre-mortem rep BEFORE the moment hits is implementation intentions in practice (Gollwitzer 1999) — the pre-installed move that fires automatically when the cue arrives. The rep is short. The pattern is named, the move is rehearsed, the user walks into the rest of the day with the response already loaded."
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
          <button
            onClick={() =>
              onEnterPractice &&
              onEnterPractice("reframe", {
                pattern: anticipate.label,
                source: "pre-mortem",
                daysAgo: 0,
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
            <span style={{ color: "var(--amber)" }}>{anticipate.label.toLowerCase()}</span>
            <span style={{ margin: "0 6px", color: "var(--text-muted)", opacity: 0.6 }}>·</span>
            <span style={{ color: "var(--text-muted)" }}>pre-mortem rep</span>
          </button>
        </div>
      )}

      {/* ── OPEN RECALL — brainstorm #6 (May 13, 2026) ─────────────────────
          When no specific retrieval target exists (no recent flagged
          pattern in the 3-7 day window), surface an open-recall prompt.
          Active recall from the user's own memory (Roediger & Karpicke
          2006 testing effect) is more potent for consolidation than
          recognition. The user names the pattern themselves at Notice
          (no pre-fill); the AI receives source = "open-recall" and
          opens the conversation accordingly.

          Gated on: no specific retrieval candidate AND at least 3
          sessions logged (otherwise the user has nothing to recall from).
          Renders only when retrieval card is absent — never doubles up. */}
      {!retrieval && sessions.length >= 3 && (
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
            OPEN RECALL
          </div>
          <div
            style={{
              fontSize: 15,
              color: "var(--text)",
              lineHeight: 1.55,
              marginBottom: 16,
            }}
          >
            What's a pattern you've noticed since the last session?
          </div>
          <button
            onClick={() =>
              onEnterPractice &&
              onEnterPractice("reframe", {
                pattern: "",
                source: "open-recall",
                daysAgo: null,
              })
            }
            style={{
              width: "100%",
              padding: "14px 18px",
              background: "transparent",
              border: "0.5px solid var(--border)",
              borderRadius: "var(--r, 8px)",
              color: "var(--text)",
              fontSize: 14,
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: "0.04em",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            Name it at Notice →
          </button>
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
