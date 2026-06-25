/**
 * narrativeArc.js — Phase 4 (Narrative authoring / McAdams)
 *
 * DETERMINISTIC arc assembly. Gathers the through-line from the user's OWN
 * session history into a structured "spine" that an authoring surface can
 * render and the user can author. It assembles MATERIALS; it never imposes a
 * story and never forces a redemption arc — redemption is culturally bound, so
 * the user authors the meaning; this only lays out the pieces in order.
 *
 * CONTENTS (a sensible DEFAULT for Arlin's feedback — reshape freely):
 *   • beats         — each session's named moment: { dateKey, precisionName,
 *                     takeaway, mode }. Only sessions where the user named a
 *                     takeaway (their own words = the narrative beats).
 *   • threads       — confirmed-finding labels (recurring patterns the user
 *                     confirmed).
 *   • turningPoints — logged prediction-errors ("I was braced for X, it didn't
 *                     happen") = the shifts / where a prior loosened.
 *   • span          — { firstDate, lastDate, sessionCount, beatCount }.
 *
 * INTEGRITY: only the user's OWN content (their takeaways, their confirmations,
 * their logged shifts). No AI inference, no invention, no imposed arc. Honest
 * empty (ready:false) until there are enough beats to form a through-line.
 *
 * SCOPE: PLUMBING ONLY. The authoring SURFACE (My Progress rendering + how the
 * user authors the narrative) and its VOICE are Arlin's, deferred.
 */
import { getSessions } from "./sessions.js";
import { getConfirmedFindings } from "./discoveryFindings.js";
import { getPredictionErrors } from "./predictionErrors.js";

const DEFAULTS = { minBeats: 3 };

/** Best-effort timestamp for ordering: savedAt if present, else the local dateKey. */
function sessionTime(s) {
  if (s && typeof s.savedAt === "string") {
    const t = Date.parse(s.savedAt);
    if (!Number.isNaN(t)) return t;
  }
  if (s && typeof s.dateKey === "string") {
    const m = s.dateKey.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]).getTime();
  }
  return null;
}

/**
 * Assemble the narrative arc from the user's own history.
 * @param {{minBeats?: number}} [opts]
 * @returns {{ready: boolean, reason?: string, beats: Array, threads: Array, turningPoints: Array, span: object|null}}
 */
export function assembleNarrativeArc(opts = {}) {
  const cfg = { ...DEFAULTS, ...opts };

  let sessions, confirmed, peStore;
  try { sessions = getSessions(); } catch { sessions = []; }
  try { confirmed = getConfirmedFindings(); } catch { confirmed = []; }
  try { peStore = getPredictionErrors(); } catch { peStore = { entries: [] }; }
  if (!Array.isArray(sessions)) sessions = [];
  if (!Array.isArray(confirmed)) confirmed = [];
  const peEntries = peStore && Array.isArray(peStore.entries) ? peStore.entries : [];

  // Beats: sessions where the user named a takeaway (their own words), oldest→newest.
  const beats = sessions
    .map((s) => ({ s, t: sessionTime(s) }))
    .filter((x) => x.s && typeof x.s.takeaway === "string" && x.s.takeaway.trim())
    .sort((a, b) => (a.t ?? 0) - (b.t ?? 0))
    .map(({ s }) => ({
      dateKey: typeof s.dateKey === "string" ? s.dateKey : null,
      precisionName: typeof s.precisionName === "string" ? s.precisionName : "",
      takeaway: s.takeaway.trim(),
      mode: typeof s.mode === "string" ? s.mode : null,
    }));

  if (beats.length < cfg.minBeats) {
    return { ready: false, reason: "not_enough_beats", beats: [], threads: [], turningPoints: [], span: null };
  }

  const threads = confirmed
    .slice()
    .sort((a, b) => (a && a.confirmedAt ? a.confirmedAt : 0) - (b && b.confirmedAt ? b.confirmedAt : 0))
    .map((f) => f && f.label)
    .filter((l) => typeof l === "string" && l.trim());

  const turningPoints = peEntries
    .filter((e) => e && typeof e.text === "string" && e.text.trim())
    .sort((a, b) => (Date.parse(a.markedAt) || 0) - (Date.parse(b.markedAt) || 0))
    .map((e) => ({ text: e.text.trim(), markedAt: typeof e.markedAt === "string" ? e.markedAt : null }));

  const span = {
    firstDate: beats[0].dateKey,
    lastDate: beats[beats.length - 1].dateKey,
    sessionCount: sessions.length,
    beatCount: beats.length,
  };

  return { ready: true, beats, threads, turningPoints, span };
}
