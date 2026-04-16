-- Subscription data minimization + retention maintenance
-- Run in Supabase SQL editor (safe to re-run).

begin;

-- Ensure hashed-email column exists for privacy-preserving reconciliation.
alter table if exists public.stillform_subscription_state
  add column if not exists user_email_hash text null;

-- Remove raw email values from all historical rows.
update public.stillform_subscription_state
set user_email = null
where user_email is not null;

-- Keep table operationally lean by removing long-stale inactive identities.
-- These rows are no longer active subscribers and haven't been updated in > 365 days.
delete from public.stillform_subscription_state
where coalesce(is_subscribed, false) = false
  and coalesce(updated_at, now() - interval '1000 years') < now() - interval '365 days';

commit;
