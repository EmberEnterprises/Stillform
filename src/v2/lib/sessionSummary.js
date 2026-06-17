/**
 * sessionSummary.js — the "to help you talk to someone" handoff summary.
 *
 * PURPOSE (Arlin, June 15 2026): an OPT-IN button on the Crisis Resources
 * screen. The user taps it WHEN THEY CHOOSE — it is never surfaced
 * automatically. It generates a calm, plain summary of what THEY have
 * named across their practice, so they have something concrete to say
 * when they reach a counsellor, a helpline, or a trusted person:
 * "here's what I've been working through."
 *
 * SAFETY / FRAMING (non-negotiable):
 *   1. DETERMINISTIC — NO AI CALL. Built purely from the user's own stored
 *      named data (Trigger Profile labels + session precisionNames /
 *      takeaways). It cannot hallucinate, cannot invent, cannot misread.
 *      On a crisis-adjacent surface that safety matters more than warm prose.
 *   2. THEIR WORDS, REFLECTED — never the app's interpretation. The summary
 *      lists what the user themselves named. It does NOT diagnose, label,
 *      pathologise, or infer a mental state. Stillform's frame: the user is
 *      the authority on their own experience (CANON USER TREATMENT).
 *   3. MEASURED, NOT DRAMATIC — counts and the user's own phrases, stated
 *      plainly. No "you've been spiralling about X." Just "X — named 4 times."
 *      Never amplifies distress.
 *   4. HONEST EMPTY STATE — if there is little or nothing named yet, it says
 *      so plainly and points back to the lines above. It never fabricates a
 *      pattern to fill space.
 *
 * Pure module: no React, no I/O beyond the local-storage reads in the data
 * layers it calls, no network.
 */

import { getTriggerProfile } from "./triggerProfile.js";
import { getRecentSessions } from "./sessions.js";

const RECENT_WINDOW_DAYS = 30;
const MAX_TRIGGERS = 5;
const MAX_NAMINGS = 6;

/**
 * Build the handoff summary from the user's own named material.
 *
 * @returns {{
 *   hasContent: boolean,
 *   intro: string,
 *   recurring: Array<{ label: string, count: number }>,  // top triggers by count
 *   namings: string[],                                    // recent precise namings (their words)
 *   closingNote: string
 * }}
 */
export function buildSessionSummary() {
  const cutoffMs = Date.now() - RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  // --- recurring triggers (their named labels, by how often they returned) ---
  let recurring = [];
  try {
    const profile = getTriggerProfile();
    const triggers = Array.isArray(profile?.triggers) ? profile.triggers : [];
    recurring = triggers
      .filter((t) => t && typeof t.label === "string" && t.label.trim())
      .map((t) => ({
        label: t.label.trim(),
        count: typeof t.encounterCount === "number" && t.encounterCount > 0 ? t.encounterCount : 1,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, MAX_TRIGGERS);
  } catch {
    recurring = [];
  }

  // --- recent namings (the user's own precise names + takeaways) ---
  let namings = [];
  try {
    const sessions = getRecentSessions(20) || [];
    const seen = new Set();
    for (const s of sessions) {
      if (!s || typeof s.timestamp !== "string") continue;
      const t = new Date(s.timestamp).getTime();
      if (Number.isFinite(t) && t < cutoffMs) continue;
      // Prefer the precise name; fall back to the takeaway — both are the
      // user's own words, never the AI's.
      const phrase =
        (typeof s.precisionName === "string" && s.precisionName.trim()) ||
        (typeof s.takeaway === "string" && s.takeaway.trim()) ||
        "";
      if (!phrase) continue;
      const key = phrase.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      namings.push(phrase);
      if (namings.length >= MAX_NAMINGS) break;
    }
  } catch {
    namings = [];
  }

  const hasContent = recurring.length > 0 || namings.length > 0;

  return {
    hasContent,
    intro: hasContent
      ? "These are things you've named in your own words while practicing. You don't have to explain all of it — it's just here so you have somewhere to start."
      : "",
    recurring,
    namings,
    closingNote: hasContent
      ? "However you say it is enough. The people on the lines above are there for exactly this."
      : "You haven't named much here yet, and that's okay — you don't need anything prepared to reach out. The lines above are there for exactly this moment.",
  };
}
