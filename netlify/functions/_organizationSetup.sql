-- Stillform B2B organization schema
-- Run this in Supabase SQL editor (once).
--
-- ──────────────────────────────────────────────────────────────────────────────
-- ARCHITECTURAL PRIVACY WALL — READ THIS BEFORE TOUCHING THESE TABLES
-- ──────────────────────────────────────────────────────────────────────────────
--
-- Stillform B2B has one non-negotiable architectural commitment:
--
--     An organization admin can NEVER see a member's practice data.
--     Not ever. Not for any reason. Not even aggregated.
--
-- That commitment is enforced at THREE layers:
--
--   1. SCHEMA   — these tables contain ZERO references to user_data, backups,
--                 sessions, journal entries, reframes, biometrics, check-ins,
--                 or anything else that constitutes practice content. There is
--                 no foreign key. There is no shared column. The practice
--                 surface and the org surface are architecturally disjoint.
--
--   2. FUNCTION — all access to these tables routes through Netlify functions
--                 using the service_role key (anon and authenticated have zero
--                 grants). No function that an admin can call ever queries
--                 user_data, backups, or user_profiles. There is no code path
--                 that mixes the two domains.
--
--   3. AUDIT    — every admin action against these tables writes to
--                 stillform_org_audit_log with actor_user_id, action,
--                 target_user_id, IP, and timestamp. SOC 2 evidence chain
--                 starts here.
--
-- What admins CAN see:
--   - Organization metadata (name, plan tier, seat limit, billing status)
--   - Member email addresses + role + invite/active/removed status
--   - Audit log of admin actions taken WITHIN the org surface
--
-- What admins CANNOT see, ever:
--   - Any session, journal, reframe, body scan, breathing, brief, or EOD entry
--   - Any check-in, biometric reading, mood signal, or feel-state
--   - Usage frequency, last-active dates, session counts, "engagement metrics"
--   - Anything inferrable from practice — including "is this seat being used"
--
-- The pitch to enterprise procurement is exactly this commitment:
-- the only B2B self-mastery tool where employees actually trust it
-- because the company genuinely cannot see what they do.
--
-- If you ever find yourself writing code that joins an org table to a
-- practice table, STOP. That join is a violation. The fix is to not do it.
--
-- ──────────────────────────────────────────────────────────────────────────────

begin;

-- ──────────────────────────────────────────────────────────────────────────────
-- stillform_organizations
-- The organization itself. One row per B2B customer.
-- ──────────────────────────────────────────────────────────────────────────────

create table if not exists public.stillform_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  billing_email text not null,
  owner_user_id uuid not null,            -- the user who created/owns the org (auth.users)
  plan_tier text not null,                -- 'small_team' | 'mid_market' | 'enterprise'
  seat_limit int not null default 1,
  lemon_subscription_id text null,        -- LemonSqueezy subscription for this org
  lemon_customer_id text null,
  sso_provider text null,                 -- 'okta' | 'azure_ad' | 'google_workspace' | null
  sso_metadata jsonb null,                -- SAML config, IdP URLs, cert fingerprints
  auto_join_domain text null,             -- e.g. 'acme.com' for domain-based auto-enrollment
  status text not null default 'active',  -- 'active' | 'suspended' | 'cancelled'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint plan_tier_valid check (plan_tier in ('small_team','mid_market','enterprise')),
  constraint status_valid check (status in ('active','suspended','cancelled'))
);

create index if not exists idx_stillform_organizations_owner_user_id
  on public.stillform_organizations (owner_user_id);
create index if not exists idx_stillform_organizations_lemon_subscription_id
  on public.stillform_organizations (lemon_subscription_id);
create index if not exists idx_stillform_organizations_auto_join_domain
  on public.stillform_organizations (auto_join_domain);
create index if not exists idx_stillform_organizations_status
  on public.stillform_organizations (status);

-- ──────────────────────────────────────────────────────────────────────────────
-- stillform_org_members
-- Membership table. One row per (org, user) pair, regardless of role.
--
-- NOTE on email: stored here for admin-side seat management
-- (admin needs to identify who they're adding/removing). This is org-management
-- data, NOT practice data. It cannot reveal anything about what the user does
-- inside Stillform.
-- ──────────────────────────────────────────────────────────────────────────────

create table if not exists public.stillform_org_members (
  id bigserial primary key,
  org_id uuid not null references public.stillform_organizations(id) on delete cascade,
  user_id uuid not null,                  -- auth.users
  email text not null,                    -- for admin seat management; see NOTE above
  role text not null default 'member',    -- 'admin' | 'member'
  status text not null default 'active',  -- 'invited' | 'active' | 'removed'
  invited_at timestamptz null,
  joined_at timestamptz null,
  removed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint role_valid check (role in ('admin','member')),
  constraint member_status_valid check (status in ('invited','active','removed'))
);

-- A user can only have one active membership per org. Removed rows are kept
-- for audit history.
create unique index if not exists idx_stillform_org_members_org_user_active
  on public.stillform_org_members (org_id, user_id)
  where status != 'removed';

create index if not exists idx_stillform_org_members_org_id
  on public.stillform_org_members (org_id);
create index if not exists idx_stillform_org_members_user_id
  on public.stillform_org_members (user_id);
create index if not exists idx_stillform_org_members_email
  on public.stillform_org_members (email);
create index if not exists idx_stillform_org_members_status
  on public.stillform_org_members (status);

-- ──────────────────────────────────────────────────────────────────────────────
-- stillform_org_invites
-- Pending invites by email. Once accepted, a row in stillform_org_members
-- is created and the invite is marked accepted_at.
-- ──────────────────────────────────────────────────────────────────────────────

create table if not exists public.stillform_org_invites (
  id bigserial primary key,
  org_id uuid not null references public.stillform_organizations(id) on delete cascade,
  email text not null,
  role text not null default 'member',
  invite_token text not null unique,
  invited_by_user_id uuid not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  accepted_at timestamptz null,
  accepted_by_user_id uuid null,
  revoked_at timestamptz null,
  revoked_by_user_id uuid null,
  constraint invite_role_valid check (role in ('admin','member'))
);

create index if not exists idx_stillform_org_invites_org_id
  on public.stillform_org_invites (org_id);
create index if not exists idx_stillform_org_invites_email
  on public.stillform_org_invites (email);
create index if not exists idx_stillform_org_invites_token
  on public.stillform_org_invites (invite_token);
create index if not exists idx_stillform_org_invites_expires_at
  on public.stillform_org_invites (expires_at);

-- ──────────────────────────────────────────────────────────────────────────────
-- stillform_org_audit_log
-- SOC 2 evidence chain. Every admin action against the org surface logs here.
-- Append-only from application code; no UPDATE or DELETE.
-- ──────────────────────────────────────────────────────────────────────────────

create table if not exists public.stillform_org_audit_log (
  id bigserial primary key,
  org_id uuid not null references public.stillform_organizations(id) on delete cascade,
  actor_user_id uuid not null,            -- who performed the action
  action text not null,                   -- canonical action name (see below)
  target_user_id uuid null,               -- who the action was against (if applicable)
  target_email text null,                 -- for invites where user_id doesn't exist yet
  metadata jsonb null,                    -- e.g. { "old_seat_limit": 25, "new_seat_limit": 50 }
  ip_address text null,
  user_agent text null,
  created_at timestamptz not null default now()
);

-- Canonical action names (enforced in application code, not DB):
--   org_created
--   org_renamed
--   org_plan_changed
--   org_seat_limit_changed
--   org_sso_configured
--   org_sso_removed
--   org_auto_join_domain_set
--   org_suspended
--   org_cancelled
--   org_billing_created          -- LS webhook: subscription_created
--   org_billing_updated          -- LS webhook: catch-all change event
--   org_billing_payment_failed   -- LS webhook: subscription_payment_failed
--   org_billing_recovered        -- LS webhook: payment_recovered / resumed
--   org_billing_cancelled        -- LS webhook: subscription_cancelled
--   org_billing_expired          -- LS webhook: subscription_expired
--   invite_sent
--   invite_resent
--   invite_revoked
--   invite_accepted
--   member_added           -- direct add (admin provisioned without invite)
--   member_role_changed
--   member_removed

create index if not exists idx_stillform_org_audit_log_org_id_created_at
  on public.stillform_org_audit_log (org_id, created_at desc);
create index if not exists idx_stillform_org_audit_log_actor_user_id
  on public.stillform_org_audit_log (actor_user_id);
create index if not exists idx_stillform_org_audit_log_target_user_id
  on public.stillform_org_audit_log (target_user_id);
create index if not exists idx_stillform_org_audit_log_action
  on public.stillform_org_audit_log (action);

-- ──────────────────────────────────────────────────────────────────────────────
-- Security baseline: backend-only tables (service_role via Netlify functions).
-- anon and authenticated have ZERO grants on any org table. This is intentional.
-- ──────────────────────────────────────────────────────────────────────────────

alter table public.stillform_organizations  enable row level security;
alter table public.stillform_organizations  force  row level security;
alter table public.stillform_org_members    enable row level security;
alter table public.stillform_org_members    force  row level security;
alter table public.stillform_org_invites    enable row level security;
alter table public.stillform_org_invites    force  row level security;
alter table public.stillform_org_audit_log  enable row level security;
alter table public.stillform_org_audit_log  force  row level security;

revoke all on table public.stillform_organizations  from public, anon, authenticated;
revoke all on table public.stillform_org_members    from public, anon, authenticated;
revoke all on table public.stillform_org_invites    from public, anon, authenticated;
revoke all on table public.stillform_org_audit_log  from public, anon, authenticated;

grant all on table public.stillform_organizations  to service_role;
grant all on table public.stillform_org_members    to service_role;
grant all on table public.stillform_org_invites    to service_role;
grant all on table public.stillform_org_audit_log  to service_role;

-- Sequences for bigserial primary keys.
do $$
begin
  if to_regclass('public.stillform_org_members_id_seq') is not null then
    execute 'grant usage, select on sequence public.stillform_org_members_id_seq to service_role';
    execute 'revoke all on sequence public.stillform_org_members_id_seq from public, anon, authenticated';
  end if;
  if to_regclass('public.stillform_org_invites_id_seq') is not null then
    execute 'grant usage, select on sequence public.stillform_org_invites_id_seq to service_role';
    execute 'revoke all on sequence public.stillform_org_invites_id_seq from public, anon, authenticated';
  end if;
  if to_regclass('public.stillform_org_audit_log_id_seq') is not null then
    execute 'grant usage, select on sequence public.stillform_org_audit_log_id_seq to service_role';
    execute 'revoke all on sequence public.stillform_org_audit_log_id_seq from public, anon, authenticated';
  end if;
end $$;

-- Drop any leftover policies (safe re-run).
do $$
declare
  rec record;
begin
  for rec in (
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'stillform_organizations',
        'stillform_org_members',
        'stillform_org_invites',
        'stillform_org_audit_log'
      )
  ) loop
    execute format('drop policy if exists %I on %I.%I', rec.policyname, rec.schemaname, rec.tablename);
  end loop;
end $$;

commit;

-- ──────────────────────────────────────────────────────────────────────────────
-- Verification queries
-- ──────────────────────────────────────────────────────────────────────────────

-- 1) Confirm RLS is forced on all org tables.
select schemaname, tablename, rowsecurity, forcerowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'stillform_organizations',
    'stillform_org_members',
    'stillform_org_invites',
    'stillform_org_audit_log'
  )
order by tablename;

-- 2) Confirm anon and authenticated have ZERO grants on org tables.
--    This query should return ZERO rows. If it returns anything, the
--    privacy wall is breached at the schema layer.
select table_schema, table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in (
    'stillform_organizations',
    'stillform_org_members',
    'stillform_org_invites',
    'stillform_org_audit_log'
  )
  and grantee in ('anon','authenticated')
order by table_name, grantee, privilege_type;

-- 3) Confirm service_role has full grants on all org tables.
select table_schema, table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in (
    'stillform_organizations',
    'stillform_org_members',
    'stillform_org_invites',
    'stillform_org_audit_log'
  )
  and grantee = 'service_role'
order by table_name, privilege_type;
