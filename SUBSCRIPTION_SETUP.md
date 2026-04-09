# Subscription Verification Setup (Lemon Squeezy + Supabase)

This project now includes server-side subscription truth via:

- `/.netlify/functions/subscription-webhook` (receives Lemon webhook events)
- `/.netlify/functions/subscription-status` (app checks current access)
- Supabase table: `stillform_subscription_state`

## 1) Supabase SQL setup

Run the SQL in:

- `netlify/functions/_subscriptionSetup.sql`

This creates:

- table `public.stillform_subscription_state`
- index + RLS policy (service role only)

## 2) Netlify environment variables

Set these in Netlify site settings:

- `SUPABASE_URL`  
  Example: `https://pxrewildfnbxlygjofpx.supabase.co`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` **(required)**
- `LEMON_WEBHOOK_SECRET` **(required)**

## 3) Lemon Squeezy webhook setup (LIVE mode)

In Lemon dashboard (Live mode), create a webhook:

- URL: `https://stillformapp.com/.netlify/functions/subscription-webhook`
- Secret: use same value as `LEMON_WEBHOOK_SECRET`
- Events:
  - `subscription_created`
  - `subscription_updated`
  - `subscription_cancelled`
  - `subscription_resumed`
  - `subscription_expired`
  - `subscription_paused`
  - `subscription_unpaused`
  - `subscription_payment_success`
  - `subscription_payment_failed`
  - `subscription_payment_recovered`
  - `subscription_payment_refunded`

## 4) How matching works

The app now sends this custom data at checkout:

- `checkout[custom][install_id]` (device install identifier)
- `checkout[custom][user_id]` (Supabase user id when signed in)
- `checkout[custom][variant]` (existing monthly/annual tag)

Lemon includes those in webhook payload `meta.custom_data`, and the webhook stores status server-side.

## 5) App behavior after this setup

- Redirect from checkout still sets a temporary local subscribed flag for immediate UX.
- App then checks `/.netlify/functions/subscription-status` and reconciles to server truth.
- If webhook is delayed, app keeps local subscribed state for a short grace window.

## 6) Canceling your own trial/subscription

Fastest path:

1. Open your Lemon order receipt email
2. Click **Manage Subscription**
3. Cancel there (or in Lemon dashboard under Subscriptions)

If you already have the customer portal link from order details, use that directly.
