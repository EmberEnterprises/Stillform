# Stillform Security Hardening Runbook

This runbook is the source of truth for high-privacy launch posture.

## 1) Required environment variables

Set in Netlify:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LEMON_WEBHOOK_SECRET`
- `SECURITY_ALLOWED_ORIGINS` (comma-separated allowlist; production domains first)
- `SUBSCRIPTION_EMAIL_HASH_PEPPER` (long random secret for email hash hardening)

Example `SECURITY_ALLOWED_ORIGINS`:

```text
https://stillformapp.com,https://www.stillformapp.com,https://stillformapp.netlify.app
```

## 2) Supabase SQL hardening (mandatory)

Run these SQL files in Supabase SQL Editor:

1. `netlify/functions/_metricsSetup.sql`
2. `netlify/functions/_subscriptionSetup.sql`
3. `netlify/functions/_uatFeedbackSetup.sql`
4. `netlify/functions/_securityHardening.sql`
5. `netlify/functions/_subscriptionRetention.sql`

The scripts enforce:
- RLS + FORCE RLS on Stillform operational tables
- revoke direct `anon`/`authenticated` access on backend-only tables
- owner-only policies for `user_data`, `backups`, `user_profiles`
- subscription email minimization (`user_email` nulled, hashed field retained)

## 3) Security smoke tests

Run locally:

```bash
npm run security:smoke
```

Set `SECURITY_SMOKE_BASE_URL` if not testing prod:

```bash
SECURITY_SMOKE_BASE_URL="https://stillformapp.com" npm run security:smoke
```

Checks:
- `subscription-status` rejects unauthenticated/no-install request (`source=none`, not elevated access)
- `metrics-ingest` rejects unauthenticated calls
- `subscription-link-account` rejects unauthenticated calls
- `uat-feedback` rejects undersized payload
- `reframe` responds without permissive wildcard CORS

## 4) Manual verification queries (Supabase)

### RLS status

```sql
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
```

### Active policies

```sql
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
```

### Grants

```sql
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
```

Expected posture:
- backend-only tables: `service_role` only
- cloud sync tables: authenticated owner-only policies

## 5) Launch block rule

Do **not** launch broad if any of the following are true:

- Any Stillform table in `public` has RLS disabled
- Backend-only table is readable/writable by `anon` or broad `authenticated`
- `SECURITY_ALLOWED_ORIGINS` is unset in production
- `SUBSCRIPTION_EMAIL_HASH_PEPPER` is unset in production
- `npm run security:smoke` fails
