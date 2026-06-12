-- _backupSetup.sql — ACCOUNTS ARC A1 (June 2 2026)
--
-- Fresh v2 backup table. The v1 tables (user_data, backups, user_profiles)
-- stay locked and untouched (_securityHardening.sql) — this table is the
-- accounts arc's only storage.
--
-- One row = one full-keyspace snapshot (JSONB envelope built client-side:
-- { schema, appVersion, installId, takenAt, keys: {...} }). Server keeps
-- the newest 10 per user (trim enforced in backup-save.js after insert).
--
-- RUN ONCE in the Supabase SQL editor (Arlin's dashboard step). After it
-- runs, add `stillform_v2_backups` to the anon-401 probe list in
-- scripts/security-smoke.mjs (left out until the table exists so the gate
-- doesn't fail on a missing table).

create table if not exists public.stillform_v2_backups (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null,
  install_id  text null,
  app_version text null,
  schema      int  not null default 1,
  payload     jsonb not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_stillform_v2_backups_user_created
  on public.stillform_v2_backups (user_id, created_at desc);

-- Lock it down: RLS on + forced, anon/public fully revoked. The
-- authenticated role gets owner-only access; the service role (used by the
-- Netlify functions) bypasses RLS by design — the functions verify
-- ownership explicitly before returning payloads.
alter table public.stillform_v2_backups enable row level security;
alter table public.stillform_v2_backups force row level security;

revoke all on table public.stillform_v2_backups from public, anon;
grant select, insert, delete on table public.stillform_v2_backups to authenticated;

drop policy if exists "backups owner select" on public.stillform_v2_backups;
create policy "backups owner select" on public.stillform_v2_backups
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "backups owner insert" on public.stillform_v2_backups;
create policy "backups owner insert" on public.stillform_v2_backups
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "backups owner delete" on public.stillform_v2_backups;
create policy "backups owner delete" on public.stillform_v2_backups
  for delete to authenticated using (auth.uid() = user_id);
