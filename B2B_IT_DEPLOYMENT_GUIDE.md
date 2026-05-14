# Stillform IT Deployment Guide

**For IT administrators rolling out Stillform to a team or
organization.**

**Version 1.0 — May 2026**

---

## Overview

Stillform is a metacognition practice for self-mastery, delivered
as:

- A progressive web application (PWA) at
  `https://stillformapp.com`
- Native iOS application via the App Store
- Native Android application via Google Play

This guide covers what IT needs to deploy Stillform across an
organization, including network requirements, MDM compatibility,
SSO posture, and the architectural privacy guarantees that
typically come up in procurement.

---

## 1. Privacy Architecture (Required Reading for Procurement)

Stillform's organizational offering rests on one architectural
commitment: **organization administrators can never see a
member's practice data.** Not ever. Not for any reason. Not even
aggregated.

The commitment is enforced at three layers:

1. **Schema.** No bridge column or foreign key links the
   organization tables to the practice-content tables.
2. **Function.** No admin-reachable Netlify function queries
   practice tables.
3. **Audit.** Every admin action is logged in an append-only
   audit table that admins can read; the SOC 2 evidence chain
   for organizational controls starts there.

The procurement consequence: Stillform does not offer team
dashboards, manager check-ins, "is the seat being used?"
telemetry, or any other surface that would require bridging
the two domains.

Full architectural reference:
`STILLFORM_B2B_PRIVACY_ARCHITECTURE.md` in the Stillform
repository.

This is the differentiator from most corporate wellness tools.
We surface it explicitly because procurement reviews benefit
from seeing it stated.

---

## 2. Network Requirements

Stillform requires outbound HTTPS (TCP 443) access from the
user device to the following hosts:

| Host                                       | Purpose                            |
|--------------------------------------------|------------------------------------|
| `stillformapp.com`                         | Application + serverless functions |
| `*.supabase.co`                            | Database + authentication          |
| `*.lemonsqueezy.com`                       | Subscription management            |
| `api.resend.com`                           | Transactional email (server-side only) |
| `plausible.io`                             | Privacy-respecting analytics       |
| `*.anthropic.com`                          | AI inference (server-side only)    |
| `api.openai.com`                           | Image-only AI (server-side only)   |

No inbound connections are required. Stillform does not run a
local server, does not listen on any port, and does not require
firewall rule changes for inbound traffic.

WebSockets, Server-Sent Events, and long-polling are not used in
the current deployment. Standard HTTPS only.

---

## 3. Mobile Application Distribution

### iOS

- **App Store distribution.** Stillform is published on the iOS
  App Store. IT may deploy via standard MDM tools such as
  Microsoft Intune, Jamf, or VMware Workspace ONE.
- **App ID.** `com.araembers.stillform`
- **TestFlight.** A TestFlight build is available for pre-launch
  testing. Contact `ARAembersllc@proton.me` to be added.
- **Required Capabilities.** Push notifications (for daily
  practice reminders, opt-in), Local notifications, Haptic
  feedback. No camera, microphone, location, contacts, or
  motion access requested.
- **Background Modes.** None required.
- **Data Sharing.** App Tracking Transparency: Stillform does
  not collect data linked to the user across other companies'
  apps or websites.

### Android

- **Google Play distribution.** Stillform is published on
  Google Play. IT may deploy via Managed Google Play in
  Workspace, Intune, or other Android MDM solutions.
- **Package name.** `com.araembers.stillform`
- **Required Permissions.** `RECEIVE_BOOT_COMPLETED` (for daily
  reminder scheduling), `POST_NOTIFICATIONS` (Android 13+),
  `VIBRATE` (for haptic feedback).
- **Background Work.** Only local notification scheduling. No
  background data sync.

### Progressive Web App

- The PWA at `https://stillformapp.com` is installable on any
  modern browser supporting service workers.
- Recommended browsers: Safari (iOS), Chrome (Android), Edge
  / Chrome / Safari / Firefox (desktop).
- The PWA is identical in functionality to the native apps
  apart from native push notifications, haptics, and biometric
  unlock (the PWA falls back to web-standard equivalents where
  available).

---

## 4. Authentication and SSO

### Current State

- Authentication is via email + password, backed by Supabase
  Auth.
- Magic-link sign-in is available.

### SSO

Stillform's schema and architecture support SSO via Okta, Azure
AD (Microsoft Entra ID), and Google Workspace. The SSO flow is
configured by the organization Admin in the Stillform admin
dashboard once the schema migration has been applied and the
SSO endpoints are configured.

If your organization requires SSO before deployment, please
contact `ARAembersllc@proton.me` to confirm current SSO
availability and to schedule a configuration session.

### Automatic Domain Join

Organizations may optionally configure an `auto_join_domain`
(e.g., `acme.com`). Members signing up with an email at that
domain will automatically be enrolled in the organization,
subject to seat availability.

This is opt-in per organization and does not happen by default.

---

## 5. Data Residency and Sub-Processors

Stillform's primary infrastructure is in the United States. The
following sub-processors handle Customer data on Stillform's
behalf:

- Supabase, Inc. (US) — database, authentication
- Netlify, Inc. (US) — hosting, serverless functions
- Lemon Squeezy (US) — payments
- Resend (US) — transactional email
- Plausible (EU) — analytics (no PII)
- Anthropic (US) — AI inference
- OpenAI (US) — image-only AI

For customers requiring EU data residency or specific
sub-processor exclusions, please contact us to discuss whether a
custom configuration is feasible. A Data Processing Agreement is
available as `B2B_DPA_TEMPLATE.md` in the repository or by
request.

---

## 6. Security Controls

### In transit
TLS 1.2 or higher on all endpoints.

### At rest
- AES-256 at the Supabase database layer.
- Device-local AES-GCM encryption of conversation history
  before cloud sync.

### Access
- Supabase Row-Level Security (RLS) enforced on all user-facing
  tables.
- Backend operational tables accessible only via service-role
  key, held by serverless functions.
- Multi-factor authentication required for all administrative
  access to sub-processor consoles.

### Audit Trail
- Every admin action on the organization surface is logged in
  an append-only audit table.
- Audit log entries include actor, action, target, timestamp,
  IP address, and user agent.
- Audit log is readable by org admins through the admin
  dashboard; it is paginated and filterable.

### Compliance Posture
- SOC 2 Type 1 readiness program documented at
  `SOC2_TYPE_1_READINESS.md`. Formal Type 1 attestation engaged
  alongside the product build; Type 2 attestation follows the
  required 6-month external observation window.
- GDPR Article 28 covered by the DPA template.
- CCPA covered by the privacy policy and the
  B2B addendum.

---

## 7. Bulk Provisioning

### Current
- Admins invite members one-by-one through the admin dashboard.
- Invites are sent by email; recipients accept via a tokenized
  link.

### Planned (Pre-Launch)
- SCIM-style bulk provisioning API for organizations with more
  than a handful of seats.
- CSV upload of email + role pairs.

Contact us if you need a bulk-provisioning workflow scheduled
into your rollout plan.

---

## 8. Member Experience

### What members see

On first sign-in to an org-provisioned account, members see an
affiliation card with the org name and a privacy guarantee
statement, surfaced inline:

> Your organization pays for this seat. They cannot see anything
> you do inside Stillform — not your sessions, journal,
> reframes, or any other practice content. Ever.

The same statement is available in Settings → Organization for
the member to revisit.

### What admins cannot interfere with

- Members may leave the organization at any time. The seat is
  freed for the org; the member's practice continues under their
  own subscription or trial.
- Members may delete their practice content at any time
  through Settings → Data.
- Admins cannot reverse, prevent, or be notified of these
  member-initiated actions, except that they will see the seat
  is now available.

---

## 9. Pre-Launch Coordination

If you are deploying Stillform to a team before public launch
(currently anticipated to gate on SOC 2 Type 2 attestation,
external 6-month window), please contact
`ARAembersllc@proton.me` to discuss:

- TestFlight or Managed Play Store access for a pilot
- Custom rollout schedule
- Specific procurement-review questions
- Pre-published versions of the privacy policy addendum or DPA

---

## 10. Contact

**ARA Embers LLC**
Email: `ARAembersllc@proton.me`
Repository: `github.com/EmberEnterprises/Stillform`

For privacy-architecture questions referencing specific code,
the canonical source is
`STILLFORM_B2B_PRIVACY_ARCHITECTURE.md` in the repository.

For DPA execution, see `B2B_DPA_TEMPLATE.md`.

For privacy policy specifics, see
`B2B_PRIVACY_POLICY_ADDENDUM.md`.

---

*ARA Embers LLC · Stillform IT Deployment Guide · v1.0 ·
May 2026*
