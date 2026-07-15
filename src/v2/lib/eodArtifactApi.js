/**
 * eodArtifactApi — v2 client for the EOD artifact (the evening end of the
 * app→life bridge; the morning end is Today's Brief).
 *
 * Wraps netlify/functions/eod-artifact.js (built in V1, no v2 front end until
 * now — June 23 2026). The backend returns a single ~2-sentence AI-named
 * takeaway of what the day taught the user (≤400 chars) — distinct from the
 * takeaway the user names themselves at close. gpt-4o, origin + rate-limit
 * gated. Voice is server-enforced; the client never re-prompts or rewrites.
 *
 * Placement (Arlin, June 23): shown BOTH inline at the evening close AND on the
 * home screen. Generation fires once when the user names their eod takeaway;
 * both surfaces read the same day-keyed stored artifact.
 *
 * Inputs are best-effort from what v2 has (eod takeaway, morning mood, today's
 * session count, today's feel-states/patterns where available); the backend is
 * empty-safe for the rest.
 */
import { fnUrl } from "./apiBase.js";

import { getSessions } from "./sessions.js";

const EOD_ARTIFACT_API_URL = fnUrl("eod-artifact");
const STORAGE_KEY = "stillform_eod_artifact";
const PENDING_KEY = "stillform_eod_artifact_pending";

/** Local date key (YYYY-MM-DD) in the user's own timezone, for storage. */
function localDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Sessions store date-key shape ("YYYY-M-D", non-padded) for today's count. */
function sessionDateKey(d = new Date()) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/**
 * Assemble the backend payload from what v2 has. Every field is optional and
 * empty-safe. Never throws.
 *
 * @param {object} [closePayload] — the eod close payload ({ takeaway, ... }).
 * @returns {object} payload for POST /eod-artifact
 */
export function gatherEodArtifactInputs(closePayload = {}) {
  const safe = (fn, fallback) => {
    try { return fn(); } catch { return fallback; }
  };

  const eodWord =
    closePayload && typeof closePayload.takeaway === "string" ? closePayload.takeaway.slice(0, 64) : "";

  const morningEnergy = safe(() => {
    const raw = localStorage.getItem("stillform_checkin_today");
    const c = raw ? JSON.parse(raw) : null;
    return c && typeof c.mood === "string" ? c.mood : "";
  }, "");

  const todayKey = sessionDateKey();
  const sessionsToday = safe(
    () => getSessions().filter((s) => s && s.dateKey === todayKey).length,
    0
  );

  // Feel-states named in today's sessions (the chips), de-duplicated.
  const feelStatesToday = safe(() => {
    const today = getSessions().filter((s) => s && s.dateKey === todayKey);
    const set = new Set();
    today.forEach((s) => {
      const chip = s && (s.chip || s.feelState || s.mood);
      if (chip && typeof chip === "string") set.add(chip);
    });
    return [...set].slice(0, 10);
  }, []);

  return {
    eodWord,
    morningEnergy,
    sessionsToday,
    feelStatesToday,
    // Fields v2 doesn't reliably collect yet — empty, backend-safe:
    eodEnergy: closePayload && typeof closePayload.energy === "string" ? closePayload.energy : "",
    eodComposure: closePayload && typeof closePayload.composure === "string" ? closePayload.composure : "",
    toolsUsed: [],
    recentShifts: [],
    patternsCaughtToday: [],
  };
}

/**
 * Generate the EOD artifact.
 * @returns {Promise<{artifact: string|null, error: string|null}>}
 */
export async function generateEodArtifact(inputs = {}) {
  try {
    const response = await fetch(EOD_ARTIFACT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs || {}),
    });

    if (response.status === 403) return { artifact: null, error: "Origin not allowed." };
    if (response.status === 429) return { artifact: null, error: "Take a moment, then try again." };
    if (!response.ok) return { artifact: null, error: `Connection issue (${response.status}). Try again.` };

    const data = await response.json();
    const artifact = data && typeof data.artifact === "string" && data.artifact.trim() ? data.artifact.trim() : null;
    if (!artifact) return { artifact: null, error: "Empty artifact. Try again." };
    try { window.plausible?.("EOD Artifact Generated"); } catch { /* analytics non-fatal */ }
    return { artifact, error: null };
  } catch {
    return { artifact: null, error: "Couldn't reach the network. Try again." };
  }
}

/** Persist today's artifact, day-keyed (one per day). Never throws. */
export function saveEodArtifact(artifact) {
  if (!artifact || typeof artifact !== "string" || !artifact.trim()) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: localDateKey(), artifact: artifact.trim(), savedAt: Date.now() }));
    return true;
  } catch {
    return false;
  }
}

/** Read today's artifact if one exists for the current local day, else null. */
export function readEodArtifact() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const record = JSON.parse(raw);
    if (!record || record.date !== localDateKey()) return null;
    return record;
  } catch {
    return null;
  }
}

export { PENDING_KEY as EOD_PENDING_KEY };
