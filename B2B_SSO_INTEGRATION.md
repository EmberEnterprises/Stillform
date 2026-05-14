# Stillform B2B SSO Integration Guide

**Version 1.0 — May 2026**
**Status: configuration UI shipped; auth handler pending implementation choice**

> **CRITICAL CLARITY ON STATUS.**
>
> Stillform's B2B schema and admin UI support SSO **configuration**.
> The actual SAML assertion verification / OIDC token validation
> code is **not yet shipped**. This is intentional: implementing
> SAML from scratch without integration testing against the
> customer's IdP is error-prone. The deliberate choice is to:
>
> 1. Ship the admin-facing config surface so customers can set up
>    their org's SSO metadata.
> 2. Decide the implementation path (Supabase Auth SSO vs.
>    `samlify` library vs. WorkOS) based on the first customer
>    engagement and pricing.
> 3. Wire up the auth handler in a follow-up PR with integration
>    tests against the customer's actual IdP.
>
> Until step 3 ships, the SSO admin form persists configuration
> but no SSO sign-in flow exists. Members continue to sign in
> with email + password.

---

## 1. What's in the schema

`stillform_organizations` carries the following SSO-related columns
(from `_organizationSetup.sql`):

| Column            | Type   | Purpose                                          |
|-------------------|--------|--------------------------------------------------|
| `sso_provider`    | text   | `'okta'` / `'azure_ad'` / `'google_workspace'` / `null` |
| `sso_metadata`    | jsonb  | IdP entity ID, SSO URL, x509 cert, attribute map |
| `auto_join_domain`| text   | Email domain that auto-enrolls (e.g. `acme.com`)|

The `sso_metadata` JSON shape (recommended):

```json
{
  "idp_entity_id": "https://sso.example.com/saml/idp",
  "idp_sso_url": "https://sso.example.com/saml/sso",
  "idp_x509_cert": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
  "attribute_mappings": {
    "email": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
    "name": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
  },
  "want_signed_response": true,
  "want_signed_assertion": true,
  "name_id_format": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
}
```

The admin UI persists exactly this shape via `organization-update`.

## 2. Implementation paths

Three paths considered. Pick one before customer onboarding.

### Path A — Supabase Auth SSO (recommended for cleanest integration)

Supabase Auth supports SAML 2.0 SSO natively on the **Team plan**
($599/mo at the time of writing — verify current pricing). When
enabled, Supabase handles the entire SAML flow: SP metadata,
assertion verification, just-in-time user provisioning, session
issuance.

**Configuration**:
1. Upgrade to Supabase Team plan
2. Create a Supabase SSO Provider per customer org via Supabase
   Dashboard or Management API
3. Map the Supabase SSO provider id to the org's `sso_metadata`
   (we'd store the `provider_id` in `sso_metadata.supabase_provider_id`)
4. In the sign-in UI, when `?sso=<org_id>` is present, look up
   the org's `supabase_provider_id` and call
   `supabase.auth.signInWithSSO({ providerId })`

**Pros**: zero custom SAML code; Supabase team owns the security
review for assertion verification; just-in-time provisioning out
of the box.

**Cons**: $599/mo plan cost; tied to Supabase as auth provider
(already a constraint, but worth noting).

### Path B — `samlify` library (self-hosted SAML)

Install `samlify` as a dependency. Implement two Netlify functions:

- `sso-metadata.js` — returns the SP metadata XML (entity ID,
  ACS URL, certificate)
- `sso-acs.js` — receives the SAML response POST from the IdP,
  validates the assertion, extracts the email, calls Supabase
  Auth admin API to find-or-create the user, returns a session

**Required env vars**:
- `SAML_SP_PRIVATE_KEY` — PEM-encoded private key for SP signing
- `SAML_SP_CERTIFICATE` — PEM-encoded SP certificate
- `SAML_SP_ENTITY_ID` — typically `https://stillformapp.com/saml`

**Pros**: no additional vendor cost; full control; works on any
Supabase plan.

**Cons**: own the SAML security review; one new dependency
(small one); need to be careful about signature verification,
replay protection, audience restriction validation.

### Path C — WorkOS

WorkOS is a B2B SSO-as-a-service (~$125/connection/mo or
flat $999/mo). Drop-in API handles SAML/OIDC for any IdP.

**Pros**: zero SAML code; broad IdP coverage including OIDC,
multi-tenant SSO with per-org connections; SCIM provisioning
add-on.

**Cons**: per-customer cost; new vendor in the stack.

## 3. Recommended decision criteria

- **First customer is on Okta or Azure AD only**: Path B
  (samlify) is the cheapest and fully sufficient.
- **First customer is mid-market with multi-IdP needs and
  willingness to pay**: Path C (WorkOS) is fastest and most
  scalable.
- **Already planning to upgrade Supabase for other reasons (audit
  logs, dedicated resources)**: Path A is the cleanest.

For most realistic first-customer scenarios, **Path B (samlify)
is the recommended default**.

## 4. Auth flow once implemented (any path)

```
1. Admin sets up org SSO via the admin UI
2. Admin distributes the SSO sign-in URL:
   https://stillformapp.com/?sso=<org_id>
3. Member clicks the URL → app detects `?sso=<org_id>` param
4. App calls SSO initiation endpoint:
   POST /netlify/functions/organization-sso-initiate
   { org_id }
   → returns { redirect_url } pointing to the IdP
5. App redirects browser to IdP SSO URL
6. IdP authenticates the user, POSTs SAML response to ACS:
   https://stillformapp.com/netlify/functions/sso-acs
7. ACS endpoint:
   - Verifies SAML response signature
   - Validates conditions (audience, expiration, not-before)
   - Extracts email from assertion
   - Looks up matching org membership (must already be invited
     or auto-join domain match)
   - Creates Supabase Auth session for the user
   - Sets session cookie + redirects to the app
8. App finds session, completes sign-in, loads org context
```

## 5. Just-in-time provisioning

When SSO succeeds for a user with no existing Stillform account:

- **If `auto_join_domain` matches the user's email domain AND
  org has seat capacity**: create a member account, attach to
  org, write `member_added` audit entry with `metadata.source =
  "sso_jit"`.

- **If no matching auto-join and no pending invite**: reject with
  a clear error message. Admins must invite the member first.

This balances frictionless SSO with seat-control discipline.

## 6. SCIM provisioning (future)

SCIM is a separate protocol from SSO for automated user
provisioning from the IdP. WorkOS includes it; standalone SCIM
requires a separate library (e.g., `scimmy`) and a dedicated
endpoint. Defer until customer demand.

## 7. What ships today (PR G)

- **Admin SSO config UI** in the org admin screen. Admin selects
  provider (Okta / Azure AD / Google Workspace) and pastes IdP
  entity ID, SSO URL, x509 certificate, and (optional) attribute
  mappings. Config persists via `organization-update`.
- **Auto-join domain input** in the same UI. Persists to
  `auto_join_domain`.
- **Admin-visible status** showing whether SSO is configured
  (config saved, no auth flow yet).
- **No actual SSO sign-in** until Path A / B / C is wired up.

## 8. Privacy wall (still architectural)

SSO does not change the privacy wall. Admins can configure SSO
and see whether members signed in via SSO (via the audit log when
JIT provisioning fires), but admins still cannot see anything a
member does inside Stillform post-sign-in.

Specifically:
- SAML assertions are not stored beyond the session creation
  moment
- Attribute mappings are used to extract identity (email, name)
  and discarded
- The Members' practice content remains under the architectural
  privacy wall

## 9. Configuration steps when ready to wire up

When choosing the implementation path, the steps for each:

### Path A — Supabase SSO

1. Upgrade Supabase plan to Team
2. Enable SSO on the project
3. Add `SUPABASE_SSO_ENABLED=true` to Netlify env
4. Update `organization-sso-initiate.js` (to be created) to call
   the Supabase SSO API
5. The admin UI's existing config form continues to persist
   `sso_metadata`; add a step where Stillform also calls the
   Supabase Management API to register the SSO provider on
   config save

### Path B — samlify

1. `npm install samlify`
2. Generate SP key + certificate; store in Netlify env
3. Create `sso-metadata.js`, `sso-acs.js`, `organization-sso-initiate.js`
4. Set `SAML_SP_PRIVATE_KEY`, `SAML_SP_CERTIFICATE`,
   `SAML_SP_ENTITY_ID` in Netlify env
5. Pass each customer's SP metadata URL (the `sso-metadata.js`
   output) to their IdP admin

### Path C — WorkOS

1. Sign up for WorkOS account
2. Set `WORKOS_API_KEY`, `WORKOS_CLIENT_ID` in Netlify env
3. Create one WorkOS organization per Stillform org
4. Store WorkOS org id in `sso_metadata.workos_org_id`
5. Implement `organization-sso-initiate.js` to call WorkOS
   AuthKit `authorizationUrl()`

## 10. Contact

For SSO setup with a specific customer engagement:
`ARAembersllc@proton.me`

---

*ARA Embers LLC · Stillform B2B SSO Integration Guide · v1.0*
