-- Stillform B2B billing migration
-- Run in Supabase SQL editor (once, after _organizationSetup.sql).
--
-- Adds the columns needed to wire org-level Lemon Squeezy subscriptions:
--   - subscription_status — the live billing state from LS
--     (active / on_trial / past_due / paused / unpaid / cancelled /
--     expired / null). Used by the admin UI to surface billing health;
--     not the same as org.status, which is Stillform's own gating signal.
--   - lemon_variant_id — which LS product/variant this org's seats are
--     priced against. Set on first checkout.
--
-- The webhook (subscription-webhook.js) maps incoming Lemon Squeezy
-- events for org subscriptions onto these columns and ALSO updates
-- org.status — payment failure → suspended, cancellation/expiry →
-- cancelled, recovery/resume/creation → active. That keeps the paywall
-- bypass logic (orgMemberActive) tied to a single field while admins
-- can see the precise billing state.

begin;

alter table if exists public.stillform_organizations
  add column if not exists subscription_status text null;

alter table if exists public.stillform_organizations
  add column if not exists lemon_variant_id text null;

create index if not exists idx_stillform_organizations_subscription_status
  on public.stillform_organizations (subscription_status);

commit;

-- Verification:
-- 1) Confirm new columns exist.
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'stillform_organizations'
  and column_name in ('subscription_status', 'lemon_variant_id', 'lemon_subscription_id', 'lemon_customer_id', 'status')
order by column_name;
