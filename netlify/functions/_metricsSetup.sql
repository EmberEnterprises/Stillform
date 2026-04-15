-- Stillform daily metrics table (metrics-only, no user text payloads)
-- Run this in Supabase SQL editor (once).

create table if not exists public.stillform_metrics_daily (
  id bigserial primary key,
  identity_key text not null,
  metric_date date not null,
  user_id uuid null,
  install_id text null,
  source text not null default 'manual',
  app_version text null,
  package_version text null,
  schema_version integer not null default 1,
  generated_at timestamptz not null,
  sessions_total integer null,
  rated_sessions integer null,
  avg_delta numeric(8,4) null,
  positive_shift_rate numeric(6,4) null,
  active_days_total integer null,
  active_days_14d integer null,
  pulse_entries_total integer null,
  saved_reframes_total integer null,
  protocol_runs_total integer null,
  morning_completion_rate_14d numeric(6,4) null,
  eod_completion_rate_14d numeric(6,4) null,
  loop_completion_rate_14d numeric(6,4) null,
  nudge_shown_14d integer null,
  nudge_actioned_14d integer null,
  nudge_dismissed_14d integer null,
  nudge_recovery_rate_14d numeric(6,4) null,
  subscription_active_local boolean null,
  tool_usage jsonb not null default '{}'::jsonb,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_stillform_metrics_daily_identity_date
  on public.stillform_metrics_daily (identity_key, metric_date);

create index if not exists idx_stillform_metrics_daily_metric_date
  on public.stillform_metrics_daily (metric_date desc);

create index if not exists idx_stillform_metrics_daily_user_id
  on public.stillform_metrics_daily (user_id);

-- Security baseline: backend-only table (written/read via service-role functions)
alter table public.stillform_metrics_daily enable row level security;
alter table public.stillform_metrics_daily force row level security;

revoke all on table public.stillform_metrics_daily from anon, authenticated;
grant all on table public.stillform_metrics_daily to service_role;
