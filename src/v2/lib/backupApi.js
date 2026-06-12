/*
 * backupApi.js — ACCOUNTS ARC A2 (June 2 2026)
 *
 * Snapshot build + save/list/restore against the A1 backend functions.
 *
 * SNAPSHOT RULES (security-relevant, deliberate):
 *  - Includes every localStorage key starting with "stillform".
 *  - EXCLUDES stillform_v2_auth — session tokens never leave the device
 *    inside a backup.
 *  - The device's install_id is recorded in the envelope for provenance,
 *    but RESTORE never writes stillform_install_id — this device keeps
 *    its own identity (subscription linkage stays sane across devices).
 *
 * Self-Mode law: every export fails soft; backup being unavailable never
 * touches the practice.
 */

import { getAccessToken } from "./authApi.js";
import { AUTH_KEY } from "./authApi.js";

const SAVE_URL = "/.netlify/functions/backup-save";
const LIST_URL = "/.netlify/functions/backup-list";
const RESTORE_URL = "/.netlify/functions/backup-restore";

const NEVER_SNAPSHOT = new Set([AUTH_KEY]);
const NEVER_RESTORE_WRITE = new Set([AUTH_KEY, "stillform_install_id"]);

export const APP_VERSION =
  (typeof __APP_VERSION__ !== "undefined" && __APP_VERSION__) || "dev";

/** Build the full-keyspace snapshot envelope. */
export function buildSnapshot() {
  const keys = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith("stillform")) continue;
      if (NEVER_SNAPSHOT.has(k)) continue;
      keys[k] = localStorage.getItem(k);
    }
  } catch {
    /* storage blocked — empty snapshot is honest */
  }
  let installId = null;
  try { installId = localStorage.getItem("stillform_install_id") || null; } catch { /* ok */ }
  return {
    schema: 1,
    appVersion: APP_VERSION,
    installId,
    takenAt: new Date().toISOString(),
    keys,
  };
}

async function authedPost(url, body) {
  const token = await getAccessToken();
  if (!token) return { ok: false, status: 401, data: null, signedOut: true };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body || {}),
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data, signedOut: res.status === 401 };
  } catch {
    return { ok: false, status: 0, data: null, signedOut: false };
  }
}

/**
 * A5: link this device's install to the signed-in account, so an existing
 * subscription (keyed by install_id) follows the user across devices.
 * Backend: subscription-link-account (backfills user_id, never new rows).
 * Fire on sign-in; fails soft.
 */
export async function linkInstallToAccount() {
  let installId = null;
  try { installId = localStorage.getItem("stillform_install_id") || null; } catch { /* ok */ }
  if (!installId) return { ok: false, error: "no_install_id" };
  const r = await authedPost("/.netlify/functions/subscription-link-account", { install_id: installId });
  return r.ok ? { ok: true, linked: !!r.data?.linked } : { ok: false, error: r.signedOut ? "signed_out" : "link_failed" };
}

/** Upload a snapshot. @returns {Promise<{ok, id?, error?}>} */
export async function saveBackup() {
  const payload = buildSnapshot();
  const installId = payload.installId;
  const r = await authedPost(SAVE_URL, {
    payload,
    install_id: installId,
    app_version: APP_VERSION,
    schema: 1,
  });
  if (!r.ok) return { ok: false, error: r.signedOut ? "signed_out" : "save_failed" };
  try { localStorage.setItem("stillform_v2_last_backup_at", new Date().toISOString()); } catch { /* ok */ }
  return { ok: true, id: r.data?.id || null, createdAt: r.data?.created_at || null };
}

/** Newest snapshots, metadata only. @returns {Promise<{ok, backups: []}>} */
export async function listBackups() {
  const r = await authedPost(LIST_URL, {});
  if (!r.ok) return { ok: false, backups: [], error: r.signedOut ? "signed_out" : "list_failed" };
  return { ok: true, backups: Array.isArray(r.data?.backups) ? r.data.backups : [] };
}

/**
 * Pull one snapshot's payload (no writes). UI confirms before applying.
 * @returns {Promise<{ok, payload?, error?}>}
 */
export async function fetchBackup(backupId) {
  const r = await authedPost(RESTORE_URL, { backup_id: backupId });
  if (!r.ok || !r.data?.payload) {
    return { ok: false, error: r.signedOut ? "signed_out" : r.status === 404 ? "not_found" : "restore_failed" };
  }
  return { ok: true, payload: r.data.payload, createdAt: r.data.created_at || null };
}

/**
 * Whether this device already carries practice data (drives the typed
 * confirm on restore — fresh installs restore freely).
 */
export function deviceHasPracticeData() {
  try {
    const raw = localStorage.getItem("stillform_v2_sessions");
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) && arr.length > 0;
  } catch {
    return false;
  }
}

/**
 * Apply a fetched snapshot to this device. Writes every snapshot key
 * EXCEPT auth + install_id; removes stillform keys that the snapshot
 * doesn't carry (a restore is a restore, not a merge — spec default).
 * Caller reloads the app after this resolves true.
 */
export function applyRestore(payload) {
  if (!payload || typeof payload !== "object" || typeof payload.keys !== "object") return false;
  try {
    const incoming = payload.keys;
    // Remove current stillform keys not present in the snapshot
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith("stillform")) continue;
      if (NEVER_RESTORE_WRITE.has(k)) continue;
      if (!(k in incoming)) toRemove.push(k);
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
    // Write the snapshot
    for (const [k, v] of Object.entries(incoming)) {
      if (!k.startsWith("stillform")) continue;
      if (NEVER_RESTORE_WRITE.has(k)) continue;
      if (typeof v === "string") localStorage.setItem(k, v);
    }
    return true;
  } catch {
    return false;
  }
}
