/**
 * dayBridge.js — the night→morning bridge (audit fix, 2026-09-14).
 *
 * Two things the app writes at the end of a day were never read the next
 * morning: the wind-down's "tomorrow's anchor" (Spine.jsx writes
 * stillform_tomorrow_anchor) and the EOD artifact (eodArtifactApi writes the
 * evening read, date-keyed). The specs (Todo lines 838/865, CANON §7.2,
 * INTEGRATIONS §3.1 "Memory") say both surface the next morning. This is the
 * reader side. Deterministic, local, fail-silent. Nothing is written here.
 *
 * "For today" means: written on the previous local date (last night) — or,
 * for the anchor only, written earlier today (a wind-down that happened after
 * midnight still belongs to this morning). Anything older is ignored, so a
 * stale anchor never haunts a later week.
 */
import { localDateKey } from "./beat.js";

const ANCHOR_KEY = "stillform_tomorrow_anchor";
const EOD_KEY = "stillform_eod_artifact";

function yesterdayKey(now = new Date()) {
  const d = new Date(now.getTime());
  d.setDate(d.getDate() - 1);
  return localDateKey(d);
}

/**
 * The anchor set at last night's wind-down, if it was set for today.
 * @returns {{ anchor: string, setOn: string } | null}
 */
export function getTomorrowAnchorForToday(now = new Date()) {
  try {
    const raw = localStorage.getItem(ANCHOR_KEY);
    if (!raw) return null;
    const rec = JSON.parse(raw);
    const anchor = rec && typeof rec.anchor === "string" ? rec.anchor.trim() : "";
    if (!anchor) return null;
    const today = localDateKey(now);
    const setOn = typeof rec.date === "string" ? rec.date : "";
    if (setOn !== yesterdayKey(now) && setOn !== today) return null;
    return { anchor: anchor.slice(0, 200), setOn };
  } catch {
    return null;
  }
}

/**
 * Yesterday's EOD artifact (the evening read), if one was generated yesterday.
 * @returns {string} the artifact text, or "" when none.
 */
export function getYesterdayEodArtifact(now = new Date()) {
  try {
    const raw = localStorage.getItem(EOD_KEY);
    if (!raw) return "";
    const rec = JSON.parse(raw);
    if (!rec || rec.date !== yesterdayKey(now)) return "";
    return typeof rec.artifact === "string" ? rec.artifact.trim().slice(0, 400) : "";
  } catch {
    return "";
  }
}
