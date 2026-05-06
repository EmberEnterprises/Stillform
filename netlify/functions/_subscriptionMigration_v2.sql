-- ─────────────────────────────────────────────────────────────────────────
-- Stillform subscription state architecture rewrite
-- Per Stillform_Master_Todo.md "Subscription state table architecture rewrite"
-- ─────────────────────────────────────────────────────────────────────────
--
-- WHY THIS MIGRATION EXISTS
--
-- The original schema used identity_key as primary key, allowing four rows
-- per user (customer:, install:, subscription:, user:). Each new identity
-- created another row. By May 5, 2026, the founder account had nine rows
-- in the table for one person — some marked active, some inactive, all for
-- the same Lemon Squeezy customer. Client reads picked the "best" row using
-- pickBestState arbitration, which was load-bearing fragility.
--
-- The new schema uses lemon_subscription_id as primary key. ONE row per
-- subscription, period. user_id and install_id become indexed lookup
-- columns, not part of the row identity.
--
-- WHAT THIS MIGRATION DOES
--
-- 1. Creates a new table stillform_subscription_state_v2 with the new schema
-- 2. Consolidates existing rows by lemon_subscription_id, preferring rows
--    with user_id populated and most recent updated_at
-- 3. Records migrated_at timestamp on each consolidated row for audit
-- 4. Renames the old table to stillform_subscription_state_v1_archive
-- 5. Renames the new table to stillform_subscription_state
-- 6. Re-creates indexes and RLS policies
--
-- ROLLBACK
--
-- If anything goes wrong, the v1_archive table preserves the original data.
-- To roll back: drop stillform_subscription_state, rename v1_archive back to
-- stillform_subscription_state.
--
-- HOW TO RUN
--
-- 1. Take a Supabase backup first (Supabase dashboard → Database → Backups)
-- 2. Open Supabase SQL editor
-- 3. Paste this entire file and run as one transaction
-- 4. Verify row counts match expectations:
--      select count(*) from stillform_subscription_state;  -- should equal
--                                                          -- count(distinct
--                                                          -- lemon_subscription_id)
--                                                          -- from v1_archive
-- 5. Spot-check the founder row has correct is_subscribed/status/lemon_status
-- 6. Update Netlify functions to use the new schema (separate code commit)
-- 7. Once functions are deployed and validated, drop v1_archive
--
-- ─────────────────────────────────────────────────────────────────────────

begin;

-- 1. Create the new table with lemon_subscription_id as primary key
create table if not exists public.stillform_subscription_state_v2 (
  lemon_subscription_id text primary key,
  lemon_customer_id text null,
  user_id uuid null,
  install_id text null,
  user_email text null,
  user_email_hash text null,
  plan_variant text null,
  product_name text null,
  status text null,
  lemon_status text null,
  is_subscribed boolean not null default false,
  source_event text null,
  status_expires_at timestamptz null,
  trial_ends_at timestamptz null,
  renews_at timestamptz null,
  ends_at timestamptz null,
  updated_at timestamptz not null default now(),
  migrated_at timestamptz null
);

-- 2. Consolidate existing rows by lemon_subscription_id
-- Strategy: for each lemon_subscription_id that has any non-null row, pick
-- the row with the most recent updated_at AND user_id populated if any such
-- row exists; otherwise fall back to most recent updated_at regardless of
-- user_id.
insert into public.stillform_subscription_state_v2 (
  lemon_subscription_id,
  lemon_customer_id,
  user_id,
  install_id,
  user_email,
  user_email_hash,
  plan_variant,
  product_name,
  status,
  lemon_status,
  is_subscribed,
  source_event,
  status_expires_at,
  trial_ends_at,
  renews_at,
  ends_at,
  updated_at,
  migrated_at
)
select distinct on (lemon_subscription_id)
  lemon_subscription_id,
  lemon_customer_id,
  user_id,
  install_id,
  user_email,
  user_email_hash,
  plan_variant,
  product_name,
  status,
  lemon_status,
  is_subscribed,
  source_event,
  status_expires_at,
  trial_ends_at,
  renews_at,
  ends_at,
  updated_at,
  now() as migrated_at
from public.stillform_subscription_state
where lemon_subscription_id is not null
order by
  lemon_subscription_id,
  case when user_id is not null then 0 else 1 end,  -- prefer user_id present
  updated_at desc;                                   -- then most recent

-- 3. Capture orphaned rows (no lemon_subscription_id) into a separate audit
-- table. These are rows where the subscription identifier was never written.
-- Should be zero or near-zero in practice; this exists to make any data loss
-- visible rather than silent.
create table if not exists public.stillform_subscription_state_orphans as
select * from public.stillform_subscription_state
where lemon_subscription_id is null;

-- 4. Rename the old table to v1_archive for safety
alter table public.stillform_subscription_state
  rename to stillform_subscription_state_v1_archive;

-- 5. Rename the new table to the canonical name
alter table public.stillform_subscription_state_v2
  rename to stillform_subscription_state;

-- 6. Recreate indexes (the old indexes followed the old table to the archive)
create index if not exists idx_stillform_subscription_state_user_id
  on public.stillform_subscription_state (user_id);

create index if not exists idx_stillform_subscription_state_install_id
  on public.stillform_subscription_state (install_id);

create index if not exists idx_stillform_subscription_state_lemon_customer_id
  on public.stillform_subscription_state (lemon_customer_id);

create index if not exists idx_stillform_subscription_state_user_email_hash
  on public.stillform_subscription_state (user_email_hash);

create index if not exists idx_stillform_subscription_state_updated_at
  on public.stillform_subscription_state (updated_at desc);

-- 7. RLS policies: backend-only table, same posture as v1
alter table public.stillform_subscription_state enable row level security;
alter table public.stillform_subscription_state force row level security;

revoke all on table public.stillform_subscription_state from anon, authenticated;
grant all on table public.stillform_subscription_state to service_role;

-- Same for the archive table — keep it locked down
alter table public.stillform_subscription_state_v1_archive enable row level security;
alter table public.stillform_subscription_state_v1_archive force row level security;

revoke all on table public.stillform_subscription_state_v1_archive from anon, authenticated;
grant all on table public.stillform_subscription_state_v1_archive to service_role;

-- And the orphans audit table
alter table public.stillform_subscription_state_orphans enable row level security;
alter table public.stillform_subscription_state_orphans force row level security;

revoke all on table public.stillform_subscription_state_orphans from anon, authenticated;
grant all on table public.stillform_subscription_state_orphans to service_role;

commit;

-- ─────────────────────────────────────────────────────────────────────────
-- POST-MIGRATION VERIFICATION QUERIES (run separately, not in the txn above)
-- ─────────────────────────────────────────────────────────────────────────

-- 1. New table row count vs distinct subscription_ids in archive
-- Should match exactly:
--   select count(*) from stillform_subscription_state;
--   select count(distinct lemon_subscription_id)
--     from stillform_subscription_state_v1_archive
--     where lemon_subscription_id is not null;

-- 2. Founder account row check
--   select * from stillform_subscription_state
--     where user_id = '3ed32eb5-ab80-4d7b-a4b1-491132100c8a';
-- Expected: ONE row, is_subscribed=true, lemon_subscription_id=2127474

-- 3. Orphan check
--   select count(*) from stillform_subscription_state_orphans;
-- Expected: zero or near-zero

-- 4. After Netlify functions are deployed and webhooks/portal/status all
--    work end-to-end against the new schema, drop the archive:
--      drop table public.stillform_subscription_state_v1_archive;
--      drop table public.stillform_subscription_state_orphans;
--    Do NOT drop these until end-to-end is validated. Keep for at least
--    one billing cycle in case a debugging trail is needed.
