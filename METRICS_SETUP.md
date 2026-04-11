# Metrics-Only Performance Telemetry Setup

This adds daily metrics ingestion so Stillform can measure if core loops are working without collecting user text content.

## What is collected

Metrics only (counts/rates), for example:

- session totals
- rated session totals
- average pre→post shift
- 14-day morning/EOD completion rates
- loop nudge shown/actioned/dismissed and recovery rate
- tool usage counts

Not collected:

- journal text
- AI conversation text
- free-form notes

## 1) Supabase SQL setup

Run:

- `netlify/functions/_metricsSetup.sql`

This creates:

- table `public.stillform_metrics_daily`
- unique key by `(identity_key, metric_date)` for daily upsert

## 2) Netlify functions included

- `/.netlify/functions/metrics-ingest`
- helper: `netlify/functions/_metricsState.js`

The ingest endpoint:

- requires Supabase auth token (signed-in user)
- enabled by default in-app; users can turn metrics sharing off anytime in Settings
- ingest endpoint still requires `metrics_opt_in: true` in payload to accept writes
- sanitizes payload to numeric/boolean metrics fields

## 3) App behavior

In Settings > Data management:

- Metrics telemetry toggle (on/off)
- Send metrics now
- Copy metrics snapshot (JSON)

Auto behavior:

- if metrics sharing is enabled and user is signed in, app auto-sends at most once per day
