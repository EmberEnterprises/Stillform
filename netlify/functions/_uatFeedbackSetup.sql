-- Stillform UAT feedback table
-- Run in Supabase SQL editor once.

create table if not exists public.stillform_uat_feedback (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  submitted_at timestamptz null,
  app_version text null,
  package_version text null,
  source_screen text null,
  question_id text not null,
  question_prompt text null,
  feedback_text text not null,
  install_id text null,
  user_id uuid null
);

create index if not exists idx_stillform_uat_feedback_created_at
  on public.stillform_uat_feedback (created_at desc);

create index if not exists idx_stillform_uat_feedback_question_id
  on public.stillform_uat_feedback (question_id);

create index if not exists idx_stillform_uat_feedback_user_id
  on public.stillform_uat_feedback (user_id);

create index if not exists idx_stillform_uat_feedback_install_id
  on public.stillform_uat_feedback (install_id);

-- Security baseline: backend-only table (written/read via service-role functions)
alter table public.stillform_uat_feedback enable row level security;
alter table public.stillform_uat_feedback force row level security;

revoke all on table public.stillform_uat_feedback from anon, authenticated;
grant all on table public.stillform_uat_feedback to service_role;
