-- Stillform subscription verification table
-- Run this in Supabase SQL editor (once).

create table if not exists public.stillform_subscription_state (
  identity_key text primary key,
  user_id uuid null,
  install_id text null,
  lemon_customer_id text null,
  lemon_subscription_id text null,
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
  updated_at timestamptz not null default now()
);

create index if not exists idx_stillform_subscription_state_user_id
  on public.stillform_subscription_state (user_id);

create index if not exists idx_stillform_subscription_state_install_id
  on public.stillform_subscription_state (install_id);

create index if not exists idx_stillform_subscription_state_lemon_subscription_id
  on public.stillform_subscription_state (lemon_subscription_id);

create index if not exists idx_stillform_subscription_state_user_email_hash
  on public.stillform_subscription_state (user_email_hash);

create index if not exists idx_stillform_subscription_state_updated_at
  on public.stillform_subscription_state (updated_at desc);

-- Security baseline: backend-only table (written/read via service-role functions)
alter table public.stillform_subscription_state enable row level security;
alter table public.stillform_subscription_state force row level security;

revoke all on table public.stillform_subscription_state from anon, authenticated;
grant all on table public.stillform_subscription_state to service_role;
