/*
 * beat.js — pure current-beat detection.
 *
 * Per STILLFORM_CANON.md §10: "One element per beat. Sequential transitions,
 * not stacked panels." The home renders ONE current-beat surface per view.
 *
 * Beats:
 *   morning   — morning check-in not yet done, before EOD window opens
 *   main      — main practice window (default after morning, before EOD)
 *   eod       — EOD window opens, EOD not yet done
 *   wind-down — late evening, no review content (canon §10 — match surfaces
 *               to cognitive states; pre-sleep cognitive consolidation per
 *               Walker, Stickgold)
 *
 * Thresholds:
 *   - Morning persists until check-in done OR EOD window opens (hour < 19)
 *   - EOD window: hour >= 19 until done
 *   - Wind-down: hour >= 21 (overrides EOD if EOD complete; aligns with
 *                bedtime surface per canon Phase 3 May 15)
 *
 * Storage keys:
 *   stillform_checkin_today  → { date: "YYYY-MM-DD", ... }
 *   stillform_eod_today      → { date: "YYYY-MM-DD", ... }
 *
 * Pure function. No side effects. Re-call on render to get current beat.
 */

/**
 * Local-date YYYY-MM-DD for "today." The home's beat detection uses a 4am rollover
 * which differs from midnight; Phase 1 uses midnight rollover for simplicity,
 * which means a 2-3am session reads as the prior day. This is acceptable
 * for Phase 1 visual audit; full TimeKeeper integration lands when the
 * spine ships in Phase 2 and storage writes happen in v2).
 *
 * Phase 4 #3 (May 16, 2026): exported for use in Spine.jsx so completion-
 * flag writes (stillform_checkin_today / stillform_eod_today) use the
 * same date key the beat reader checks against. Single source of truth.
 */
export function localDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function readSavedTodayFlag(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed && parsed.date === localDateKey();
  } catch {
    return false;
  }
}

/**
 * Returns the current beat string.
 *
 * @returns {"morning" | "main" | "eod" | "wind-down"}
 */
export function getCurrentBeat(now = new Date()) {
  const hour = now.getHours();
  const checkinDone = readSavedTodayFlag("stillform_checkin_today");
  const eodDone = readSavedTodayFlag("stillform_eod_today");

  // Wind-down overrides everything once we're inside the pre-sleep window.
  if (hour >= 21) return "wind-down";

  // EOD window: 19:00 onward, until done.
  if (hour >= 19 && !eodDone) return "eod";

  // Morning beat persists until done or EOD window opens.
  if (!checkinDone && hour < 19) return "morning";

  // Default: main practice window.
  return "main";
}

/**
 * For tests / debug overrides via ?beat= URL param.
 *
 * @returns {"morning" | "main" | "eod" | "wind-down" | null}
 */
export function getBeatOverride() {
  try {
    const params = new URLSearchParams(window.location.search);
    const beat = params.get("beat");
    if (beat === "morning" || beat === "main" || beat === "eod" || beat === "wind-down") {
      return beat;
    }
  } catch {
    /* noop */
  }
  return null;
}
