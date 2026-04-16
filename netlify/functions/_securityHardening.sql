-- Stillform security hardening baseline
-- Run in Supabase SQL editor (safe to re-run).
--
-- Goals:
-- 1) Lock backend-only operational tables to service_role only.
-- 2) Enforce owner-only RLS policies on cloud-sync user tables.
-- 3) Provide verification queries to confirm security posture.

begin;

-- ─────────────────────────────────────────────────────────────────────────────
-- Backend-only operational tables
-- ─────────────────────────────────────────────────────────────────────────────

alter table if exists public.stillform_uat_feedback enable row level security;
alter table if exists public.stillform_uat_feedback force row level security;
alter table if exists public.stillform_metrics_daily enable row level security;
alter table if exists public.stillform_metrics_daily force row level security;
alter table if exists public.stillform_subscription_state enable row level security;
alter table if exists public.stillform_subscription_state force row level security;

alter table if exists public.stillform_subscription_state
  add column if not exists user_email_hash text null;

update public.stillform_subscription_state
set user_email = null
where user_email is not null;

revoke all on table public.stillform_uat_feedback from public, anon, authenticated;
revoke all on table public.stillform_metrics_daily from public, anon, authenticated;
revoke all on table public.stillform_subscription_state from public, anon, authenticated;

grant all on table public.stillform_uat_feedback to service_role;
grant all on table public.stillform_metrics_daily to service_role;
grant all on table public.stillform_subscription_state to service_role;

-- Ensure no permissive leftover policies remain on backend-only tables.
do $$
declare
  rec record;
begin
  for rec in (
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('stillform_uat_feedback', 'stillform_metrics_daily', 'stillform_subscription_state')
  ) loop
    execute format('drop policy if exists %I on %I.%I', rec.policyname, rec.schemaname, rec.tablename);
  end loop;
end $$;

-- Sequences used by bigserial primary keys.
do $$
begin
  if to_regclass('public.stillform_uat_feedback_id_seq') is not null then
    execute 'grant usage, select on sequence public.stillform_uat_feedback_id_seq to service_role';
    execute 'revoke all on sequence public.stillform_uat_feedback_id_seq from public, anon, authenticated';
  end if;
  if to_regclass('public.stillform_metrics_daily_id_seq') is not null then
    execute 'grant usage, select on sequence public.stillform_metrics_daily_id_seq to service_role';
    execute 'revoke all on sequence public.stillform_metrics_daily_id_seq from public, anon, authenticated';
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- User-facing cloud sync tables
-- Requires strict owner-scoped RLS because client reads/writes directly.
-- ─────────────────────────────────────────────────────────────────────────────

alter table if exists public.user_data enable row level security;
alter table if exists public.user_data force row level security;
alter table if exists public.backups enable row level security;
alter table if exists public.backups force row level security;
alter table if exists public.user_profiles enable row level security;
alter table if exists public.user_profiles force row level security;

-- Reset broad grants; re-grant only required rights.
revoke all on table public.user_data from public, anon;
revoke all on table public.backups from public, anon;
revoke all on table public.user_profiles from public, anon;

grant select, insert, update, delete on table public.user_data to authenticated;
grant select, insert, update, delete on table public.backups to authenticated;
grant select, insert, update on table public.user_profiles to authenticated;
grant all on table public.user_data to service_role;
grant all on table public.backups to service_role;
grant all on table public.user_profiles to service_role;

do $$
begin
  if to_regclass('public.user_data_id_seq') is not null then
    execute 'grant usage, select on sequence public.user_data_id_seq to authenticated, service_role';
    execute 'revoke all on sequence public.user_data_id_seq from public, anon';
  end if;
  if to_regclass('public.backups_id_seq') is not null then
    execute 'grant usage, select on sequence public.backups_id_seq to authenticated, service_role';
    execute 'revoke all on sequence public.backups_id_seq from public, anon';
  end if;
  if to_regclass('public.user_profiles_id_seq') is not null then
    execute 'grant usage, select on sequence public.user_profiles_id_seq to authenticated, service_role';
    execute 'revoke all on sequence public.user_profiles_id_seq from public, anon';
  end if;
end $$;

-- Drop previous policies (if any), then apply explicit owner-only policies.
do $$
declare
  rec record;
begin
  for rec in (
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('user_data', 'backups', 'user_profiles')
  ) loop
    execute format('drop policy if exists %I on %I.%I', rec.policyname, rec.schemaname, rec.tablename);
  end loop;
end $$;

create policy user_data_select_own
  on public.user_data
  for select
  to authenticated
  using (user_id = auth.uid());

create policy user_data_insert_own
  on public.user_data
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy user_data_update_own
  on public.user_data
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy user_data_delete_own
  on public.user_data
  for delete
  to authenticated
  using (user_id = auth.uid());

create policy backups_select_own
  on public.backups
  for select
  to authenticated
  using (user_id = auth.uid());

create policy backups_insert_own
  on public.backups
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy backups_update_own
  on public.backups
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy backups_delete_own
  on public.backups
  for delete
  to authenticated
  using (user_id = auth.uid());

create policy user_profiles_select_own
  on public.user_profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy user_profiles_insert_own
  on public.user_profiles
  for insert
  to authenticated
  with check (id = auth.uid());

create policy user_profiles_update_own
  on public.user_profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

commit;

-- ─────────────────────────────────────────────────────────────────────────────
-- Verification queries
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Confirm RLS status for Stillform tables.
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'user_data',
    'backups',
    'user_profiles',
    'stillform_uat_feedback',
    'stillform_metrics_daily',
    'stillform_subscription_state'
  )
order by tablename;

-- 2) Confirm policy surface.
select schemaname, tablename, policyname, permissive, roles, cmd
from pg_policies
where schemaname = 'public'
  and tablename in (
    'user_data',
    'backups',
    'user_profiles',
    'stillform_uat_feedback',
    'stillform_metrics_daily',
    'stillform_subscription_state'
  )
order by tablename, policyname;

-- 3) Confirm grants for anon/authenticated/service_role.
select table_schema, table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in (
    'user_data',
    'backups',
    'user_profiles',
    'stillform_uat_feedback',
    'stillform_metrics_daily',
    'stillform_subscription_state'
  )
  and grantee in ('anon', 'authenticated', 'service_role')
order by table_name, grantee, privilege_type;
