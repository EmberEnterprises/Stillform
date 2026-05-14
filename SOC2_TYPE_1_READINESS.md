# Stillform SOC 2 Type 1 Readiness

**Internal control inventory for SOC 2 Type 1 attestation.**
**Status: pre-audit. Working document.**
**Version 1.0 — May 2026**

> **PURPOSE.** This document inventories Stillform's existing
> security controls in a structure that matches the SOC 2 Trust
> Service Criteria, so that an audit firm engaging with us has a
> clear starting picture. Type 1 is a point-in-time attestation;
> Type 2 is the 6-month observation window that follows. Per
> CANON v1.3, public launch gates on Type 2 attestation
> completing for the Fortune 500 procurement path; Type 1 audit
> work begins in parallel with the product build.
>
> **OWNERSHIP.** ARA Embers LLC (`ARAembersllc@proton.me`) is the
> point of contact for the audit firm. Arlin is the
> decision-maker on scope, schedule, and remediation.

---

## Trust Service Criteria Coverage

SOC 2 Type 1 evaluates the design of controls against the
applicable Trust Service Criteria. Stillform's initial scope is
**Security** (CC series), with optional add-ons of
**Confidentiality** and **Privacy** for the B2B engagement.

### CC1 — Control Environment

**CC1.1 Integrity and Ethical Values**
- ARA Embers LLC is a single-founder company. The founder, Arlin
  Yousefian, is responsible for all material business decisions
  and signs all agreements.
- No employees or contractors with production access at the
  current time. Bobby Geismar is named on the LLC paperwork only
  and has no operational role.
- Personnel are bound by written confidentiality obligations
  for any work involving production systems.

**CC1.2 Board Oversight**
- Sole-owner LLC. Board oversight responsibilities reside with
  the founder.

**CC1.3 Management Philosophy and Operating Style**
- Operational documentation maintained in the Stillform
  repository as a single source of truth.
- Changes to product, security, or operational practice are
  committed and audited through pull requests.
- A documented framing law (`STILLFORM_FRAMING_LAW.md`) and
  canon (`STILLFORM_CANON.md`) govern product decisions.

**CC1.4 Commitment to Competence**
- All security-relevant work (cryptography, access control,
  cloud sync) is documented inline in code, with rationale and
  references to source research.
- The privacy architecture is documented in
  `STILLFORM_B2B_PRIVACY_ARCHITECTURE.md` and is referenced from
  the canon as authoritative.

**CC1.5 Accountability**
- Every backend mutation against organization data is logged in
  an append-only audit table (`stillform_org_audit_log`),
  including actor identity, action, target, timestamp, IP
  address, and user agent.
- Every personal subscription mutation is mirrored to a
  Lemon Squeezy webhook event and stored in
  `stillform_subscription_state`.

### CC2 — Communication and Information

**CC2.1 Internal Communication of Information**
- Operational state, including build status, deployment
  history, and outstanding issues, is recorded in the repository
  README, the master todo, and the punch list.
- The session-handoff documents serve as a rolling record of
  context across work sessions.

**CC2.2 External Communication**
- Privacy policy is published at `stillformapp.com/privacy.html`
  via Termly.
- B2B-specific commitments are documented in
  `B2B_PRIVACY_POLICY_ADDENDUM.md` and surfaced inline in the
  member's affiliation card every time it renders.

### CC3 — Risk Assessment

**CC3.1 Specifies Objectives**
- Product security objectives are documented in CANON v1.3,
  Section 10 (Operating Rules), including "B2B privacy wall is
  architectural, not optional."

**CC3.2 Identifies Risks**
- The known risk categories tracked:
  - Member practice content disclosure to unauthorized parties
    (including org admins): mitigated by the privacy wall.
  - Account takeover: mitigated by Supabase Auth, biometric
    lock on sensitive surfaces, and conversation history
    encryption.
  - Subscription billing fraud: mitigated by Lemon Squeezy
    webhook signature verification.
  - Data loss: mitigated by encrypted backups before each app
    version update.
  - Third-party AI provider data retention: mitigated by
    contractual no-training clauses and not sending PII
    unrelated to the user's voluntary reframe input.

**CC3.3 Identifies and Assesses Changes**
- Changes to security-relevant code are guarded by
  ship-preflight checks that fail the build on regression
  patterns:
  - SECURE_KEYS guard (no raw localStorage reads on encrypted
    keys)
  - SYNC_KEYS guard (every cloud-synced key references real
    storage)
  - B2B privacy wall guard (no org code accesses practice
    tables)
  - Undefined-component guard (catches React component
    references with no declaration)
  - TimeKeeper guards (no UTC extraction or direct date
    formatting bypassing the abstraction)

### CC4 — Monitoring Activities

**CC4.1 Conducts Ongoing and/or Separate Evaluations**
- Build and ship preflight runs on every release.
- Security smoke tests verify anon access to backend tables is
  refused.
- Plausible analytics surface unusual event rates without
  collecting personal identifiers.

**CC4.2 Communicates Internal Control Deficiencies**
- Deficiencies are filed in the master todo or punch list and
  reviewed during work sessions.

### CC5 — Control Activities

**CC5.1 Selects and Develops Control Activities**
- Documented in the operational rules in CANON.

**CC5.2 Selects and Develops General Controls over Technology**
- Production access is mediated by service-role keys held only
  by serverless functions and named operations personnel.
- Source code is hosted on GitHub with branch protection on
  `main`.
- Deployments are gated on manual review (Netlify auto-publishing
  is disabled).

**CC5.3 Deploys Through Policies and Procedures**
- Build, preflight, smoke test, commit, push, review, merge,
  deploy. Documented in the ship checklist.

### CC6 — Logical and Physical Access Controls

**CC6.1 Implements Logical Access Controls**
- Supabase Auth with email + password and magic-link options.
- Row-Level Security (RLS) enforced on all user-facing tables:
  - `user_data`, `backups`, `user_profiles`: owner-only via
    `auth.uid()` match.
  - Backend operational tables: service-role only, no anon or
    authenticated grants.
  - Organization tables: backend-only, accessed exclusively
    through admin-authorized Netlify functions.

**CC6.2 Authenticates Users**
- Supabase Auth.
- Biometric lock available on the practice surface (Face ID,
  Touch ID, fingerprint) gated by `@aparajita/capacitor-biometric-auth`.

**CC6.3 Authorizes Access**
- Role-based authorization in the organization surface:
  admin and member roles, with admin actions guarded by
  `requireOrgAdmin` server-side.
- Sub-processor consoles require multi-factor authentication
  for all administrative access.

**CC6.4 Restricts Physical Access**
- No on-premises infrastructure. All systems are cloud-hosted
  by Supabase, Netlify, and Lemon Squeezy.

**CC6.5 Discontinues Access**
- Personnel access is provisioned per individual; access can be
  revoked at the sub-processor console level.
- No shared accounts.

**CC6.6 Authentication and Authorization Process Implements**
- Webhook signatures verified using HMAC-SHA256 with a shared
  secret stored in Netlify environment variables.

**CC6.7 Restricts the Transmission of Sensitive Information**
- TLS 1.2+ for all data in transit.
- Lemon Squeezy webhook payloads pass through signature
  verification before any data is consumed.

**CC6.8 Implements Controls to Prevent Malicious Software**
- Dependencies pinned in `package.json` and reviewed before
  upgrades.
- npm audit run periodically.

### CC7 — System Operations

**CC7.1 Monitors System Components**
- Plausible analytics surface anomalous traffic.
- Sub-processor consoles (Supabase, Netlify, Lemon Squeezy)
  surface error rates and access patterns.

**CC7.2 Monitors System Vulnerabilities**
- Dependency audits via `npm audit`.
- Vulnerability bulletins from sub-processors monitored.

**CC7.3 Communicates Material Information About Security**
- Public-facing security disclosures handled by the founder.
- Sub-processor incidents are evaluated for downstream
  notification obligations.

**CC7.4 Responds to Identified Security Events**
- Documented incident response: assess, contain, notify within
  72 hours where Customer Personal Data is involved.

**CC7.5 Recovery of System Affected by Identified Security Events**
- Encrypted backups taken before each app version update; full
  restore tested.

### CC8 — Change Management

**CC8.1 Authorizes Changes**
- Pull requests on GitHub. Branch protection on `main`.
- Merges executed via squash by the founder.

### CC9 — Risk Mitigation

**CC9.1 Identifies, Selects, and Develops Risk Mitigation Activities**
- Documented in the operational rules in CANON and in the
  architectural commitments in the privacy architecture document.

**CC9.2 Assesses and Manages Risks Associated with Vendors and Business Partners**
- Sub-processor list maintained.
- Data Processing Agreements in place or template-ready for
  each sub-processor.
- Notification obligations passed through to customers in the
  DPA template.

---

## Confidentiality Criteria (C1) — Optional Add-On

**C1.1 Identifies and Maintains Confidential Information**
- Practice content, audit logs, billing records, and member
  email addresses are classified as confidential.

**C1.2 Disposes of Confidential Information**
- Upon termination or member removal, member practice content
  remains under member control. Customer audit logs are
  retained per the DPA.

---

## Privacy Criteria (P-series) — Optional Add-On

The B2B privacy commitments are documented in
`B2B_PRIVACY_POLICY_ADDENDUM.md`. The architectural enforcement
of the privacy wall (schema, function, audit) is documented in
`STILLFORM_B2B_PRIVACY_ARCHITECTURE.md`.

The combination provides the substantive material an auditor
would review for P-series coverage.

---

## Known Gaps and Remediation Plan

### Personnel
- No formal background-check process for additional personnel.
  **Remediation:** documented background-check policy before
  any additional personnel onboard with production access.

### Vendor Management
- DPA template prepared (`B2B_DPA_TEMPLATE.md`); not yet
  executed with sub-processors that require a counter-signed
  DPA from Stillform.
  **Remediation:** execute DPAs with each sub-processor that
  offers one (Supabase, Lemon Squeezy, Resend, others as
  applicable) before Type 1 fieldwork begins.

### Penetration Testing
- Initial penetration test not yet engaged.
  **Remediation:** engage a third-party penetration test
  during the Type 1 fieldwork window.

### Continuous Monitoring
- No SIEM in place. Plausible + sub-processor consoles serve as
  the current observability layer.
  **Remediation:** evaluate lightweight SIEM options
  appropriate to current scale during Type 1 fieldwork.

### Disaster Recovery
- Backup-and-restore tested informally. No documented RTO/RPO.
  **Remediation:** document RTO/RPO targets and conduct a
  full restore drill before Type 1 fieldwork closes.

---

## Audit Firm Engagement

When engaging an audit firm:

1. Provide this document as the initial control inventory.
2. Provide `STILLFORM_B2B_PRIVACY_ARCHITECTURE.md` as the
   privacy-architecture reference.
3. Provide `B2B_DPA_TEMPLATE.md` for the vendor management
   review.
4. Provide read-only access to the Stillform repository.
5. Coordinate with sub-processors to share their own SOC 2
   reports (e.g., Supabase SOC 2 Type 2, Netlify SOC 2 Type 2,
   Lemon Squeezy SOC 2 Type 2) for inheritance under the
   carve-out method.

---

*ARA Embers LLC · Stillform SOC 2 Type 1 Readiness · v1.0 ·
working document.*
