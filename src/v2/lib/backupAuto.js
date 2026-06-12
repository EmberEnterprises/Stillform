/*
 * backupAuto.js — ACCOUNTS ARC A4 (June 2 2026)
 *
 * THE LOCKED NON-NEGOTIABLE: before an app update touches user data,
 * back the data up. Implemented as a version gate: the running bundle
 * carries __APP_VERSION__ (commit-pinned, vite define); when the stored
 * last-seen version differs and the user is signed in, a snapshot is
 * taken FIRST.
 *
 * NOTE for future migration work: any schema-migration system added
 * later MUST await runVersionGatedBackup() before mutating stores —
 * that ordering is the whole point. Today no migrations exist, so the
 * boot call is fire-and-forget from AppV2's mount.
 *
 * Plus the opportunistic layer: after a session closes, if the last
 * backup is older than 24h, refresh it quietly. Fire-and-forget, fails
 * soft, never touches the practice (Self-Mode law).
 */

import { getAuthState } from "./authApi.js";
import { saveBackup, APP_VERSION } from "./backupApi.js";

const LAST_VERSION_KEY = "stillform_v2_last_version";
const LAST_BACKUP_KEY = "stillform_v2_last_backup_at";
const OPPORTUNISTIC_MS = 24 * 60 * 60 * 1000;

/**
 * Boot hook. Returns { backedUp: boolean, versionChanged: boolean }.
 */
export async function runVersionGatedBackup() {
  let last = null;
  try { last = localStorage.getItem(LAST_VERSION_KEY); } catch { /* ok */ }
  const versionChanged = !!last && last !== APP_VERSION;
  let backedUp = false;

  if (versionChanged && getAuthState().signedIn) {
    try {
      const r = await saveBackup();
      backedUp = !!r?.ok;
    } catch { backedUp = false; }
  }

  // Always pin the running version — including first run and signed-out
  // (nothing to back up / no way to). The gate arms for the NEXT change.
  try { localStorage.setItem(LAST_VERSION_KEY, APP_VERSION); } catch { /* ok */ }
  return { backedUp, versionChanged };
}

/** Post-session quiet refresh, 24h-gated. Fire-and-forget. */
export function maybeOpportunisticBackup() {
  if (!getAuthState().signedIn) return;
  let lastAt = 0;
  try {
    const raw = localStorage.getItem(LAST_BACKUP_KEY);
    lastAt = raw ? new Date(raw).getTime() : 0;
  } catch { lastAt = 0; }
  if (Number.isFinite(lastAt) && Date.now() - lastAt < OPPORTUNISTIC_MS) return;
  saveBackup().catch(() => { /* soft */ });
}
