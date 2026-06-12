# ACCOUNTS ARC — SPEC (v1.0, June 2 2026 — architecture LOCKED by Arlin: ACCOUNTS)

**Goal:** email sign-in · everything backed up · restore anywhere · and the locked
pre-launch non-negotiable made real: **auto-backup BEFORE any app update touches
user data.**

## Ground truth (verified June 2)
- Supabase Auth is already the identity layer server-side: `getUserFromToken`
  (plain GoTrue REST, `_httpSecurity.js`), Bearer contracts live on
  `account-delete` + `subscription-link-account` (which already implements
  install→user linking — the migration precedent).
- v1 tables (`user_data`, `backups`, `user_profiles`) exist in Supabase,
  RLS-hardened (`_securityHardening.sql`), schemas NOT in repo. **Decision:
  leave v1 tables locked and untouched; fresh v2 schema.**
- Client stays dependency-free: email-OTP via plain fetch to GoTrue
  (`/auth/v1/otp` → `/auth/v1/verify`) — no supabase-js.

## Design
- **Auth: email + 6-digit code** (OTP), not magic link — in-app code entry has
  no email-app context switch on mobile. Session tokens in localStorage
  (`stillform_v2_auth`), refresh handled by `authApi`.
- **Backup: one JSONB snapshot of the entire `stillform*` localStorage keyspace**
  (versioned envelope: `{ schema: 1, appVersion, installId, takenAt, keys: {...} }`).
  Append-only table, server trims to the newest **10** per user.
- **Restore:** list snapshots → pull one → write keys → reload. Default-safe:
  restoring onto a device with existing practice data requires an explicit
  typed confirm (same gravity as deletion); fresh installs restore freely.
- **Auto-backup-before-update (the non-negotiable):** client pins the running
  bundle version (`__APP_VERSION__` via Vite define). On boot, if signed in AND
  version differs from `stillform_v2_last_version` → snapshot FIRST, then
  proceed. Plus opportunistic backup after session close (24h-gated).
- **Sign-in side-effects:** link install to user via existing
  `subscription-link-account`; first backup immediately after link.
- **Self-Mode law:** auth down / offline → practice unaffected, backup queues
  for next open. No feature gates behind sign-in except backup/restore itself.

## Build order
- **A1 — backend:** `_backupSetup.sql` (table `stillform_v2_backups`, RLS:
  owner-only via `auth.uid()`, anon revoked) + `backup-save.js` +
  `backup-list.js` + `backup-restore.js` (all Bearer-authed, origin-checked,
  rate-limited, payload cap ~256KB).
- **A2 — client:** `authApi.js` (request code / verify / refresh / signOut /
  getAccessToken) + `backupApi.js` (snapshot build, save, list, restore-write).
- **A3 — Settings Account section:** signed-out (email → code → in) ·
  signed-in (email shown, Back up now, Restore…, Sign out) · honest copy.
- **A4 — version hook:** `__APP_VERSION__` define + boot check + post-session
  opportunistic backup.
- **A5 — link + first backup on sign-in.**
- Proofs at every step (node contract tests + headless e2e); security smoke
  must stay green (new table joins the anon-401 probe list).

## Proposed defaults (Arlin veto window — building with these)
1. 6-digit email code over magic link.
2. Keep newest 10 snapshots.
3. Restore onto non-empty device = typed confirm ("RESTORE").
