# Stillform B2B Privacy Policy Addendum

**Effective: [Effective Date]**
**Version 1.0 — Draft pending legal review**

> **NOTE FOR ARLIN / COUNSEL.** This is the source text for the
> organization-specific privacy commitments. It is intended to be
> integrated into Stillform's primary privacy policy (currently
> managed via Termly at `stillformapp.com/privacy.html`) or
> published as a separate addendum linked from the procurement
> page. **Review with counsel before publication.** The substantive
> commitments below are architectural and enforced in code; the
> legal formulation may benefit from professional review.

---

## 1. Scope

This Addendum supplements Stillform's primary Privacy Policy and
applies whenever an organization ("Customer") purchases Stillform
seats for its employees, contractors, members, or other natural
persons ("Members"). It describes:

- What Customer data flows between the Member and the
  Organization Administrator ("Admin")
- What Customer data flows from the Member to ARA Embers LLC
  ("we," "us," or "Stillform")
- The architectural privacy commitments that govern those flows

Where this Addendum conflicts with the primary Privacy Policy, the
provision more protective of the Member's privacy controls.

## 2. The Privacy Wall

Stillform's central architectural commitment to Members and
Customers is:

> **An Organization Administrator can never see a Member's
> practice data.** Not ever. Not for any reason. Not even
> aggregated.

This commitment is enforced at three layers, each of which would
be sufficient on its own:

1. **Schema layer.** Stillform's organization tables contain no
   foreign key, view, or shared column with the tables that store
   practice data. The two domains are architecturally disjoint.

2. **Function layer.** Stillform's serverless functions
   reachable by an Admin role query only the organization tables.
   No code path lets an Admin query the practice-content tables,
   even by indirection.

3. **Audit layer.** Every Admin action against the organization
   surface writes an append-only entry to an audit log. The audit
   log is available to Customer Admins and provides the SOC 2
   evidence chain for organizational controls.

The technical reference for this commitment is published in the
Stillform repository at `STILLFORM_B2B_PRIVACY_ARCHITECTURE.md`
and is updated whenever the implementation changes.

## 3. What Admins See

The Admin surface exists to manage **procurement**, not to
observe practice. The Customer's designated Admin(s) may see:

- Organization metadata: name, plan tier, seat limit, billing
  status, SSO configuration, automatic-join domain (if set), and
  status (active / suspended / cancelled)
- Membership records: each Member's email address, role
  ("admin" or "member"), membership status ("invited," "active,"
  or "removed"), and the dates of those transitions
- Pending invitations: invitee email, role, sender, expiry,
  and accepted/revoked state
- The audit log of Admin actions taken inside the organization
  surface itself

That is the complete set.

## 4. What Admins Cannot See

The following Member data is structurally inaccessible to the
Customer's Admins. Not now, not later, not in any view, export,
or aggregation:

- Any **session content** produced by the Member — practice
  sessions, journal entries, reframe conversations, body scans,
  breathing exercise logs, Today's Brief content, end-of-day
  reflections, bedtime wind-down content, or pre-event briefs
- Any **check-in or biometric data** — mood signals, feel-states,
  chip selections, sleep data, heart-rate variability, or any
  data flowing in from Apple HealthKit, Google Health Connect,
  or third-party wearables
- Any **usage signal** — frequency of use, last-active dates,
  login counts, session counts, streaks, completion rates, or
  any other engagement metric, even rolled up across the
  organization
- Any **derived signal** — including any field that can be
  inferred from practice content
- Specifically: the question "is the Member's seat being used"
  has no answer the Admin can obtain from Stillform; the data
  needed to answer it does not flow into the organization
  surface

If a procurement requirement, contract, or request asks for any
of the above, the answer is that Stillform does not offer it,
and the architectural reason is that the data does not exist
on our side in a form an Admin can reach.

## 5. Data Flows

### 5.1 Member to Stillform

When a Member uses Stillform, the practice content described in
Section 4 is created and stored. Stillform processes this data
solely to provide the Stillform service to the Member. We do not
share it with the Customer, with any third party not necessary
to operate the service, or use it to train artificial-intelligence
models in any way that would expose it to other users.

### 5.2 Member to Customer (via Stillform)

Only the data described in Section 3 flows from the Member to
the Customer. This is the minimum data necessary for the
Customer to manage seat assignments and to verify that the
Member is using a seat the Customer has paid for.

### 5.3 Customer to Stillform

The Customer provides to Stillform:

- The Member's email address (for seat assignment and audit
  identification)
- The role to assign to the Member (admin or member)
- The Customer's own billing and contact information

### 5.4 International Transfer

Stillform processes data using sub-processors located primarily
in the United States and the European Union (see Section 8). For
Members located in jurisdictions with cross-border transfer
requirements (e.g., GDPR), Stillform offers Standard
Contractual Clauses through its Data Processing Agreement,
available on request.

## 6. Member Rights

A Member retains all rights granted under applicable privacy
law (e.g., GDPR, CCPA, UK GDPR) to their practice content as
described in Stillform's primary Privacy Policy, including:

- **Access**: the right to obtain a copy of their data
- **Rectification**: the right to correct inaccurate data
- **Deletion**: the right to request deletion of their data
- **Portability**: the right to receive their data in a
  machine-readable format
- **Objection**: the right to object to certain processing
- **Withdrawal of consent**: the right to withdraw consent
  where processing is based on consent

These rights are exercised by the Member directly, not through
the Customer. The Customer cannot exercise these rights on
behalf of a Member with respect to that Member's practice
content, because the Customer does not control or have access
to that content.

## 7. Departure from the Organization

When a Member's organizational membership is terminated
("removed" status), or the Member voluntarily leaves the
organization:

- The Member's seat is freed and may be reassigned by the
  Customer
- The Member's practice content remains under the Member's
  control. It is not transferred to the Customer; it is not
  deleted from the Member's individual Stillform account
- If the Customer's subscription lapses, the Member retains
  access to their practice content through Stillform's standard
  individual subscription model or the trial period applicable
  at that time
- The Customer's audit log retains a record that the Member
  was a member during the relevant period; this record contains
  no practice content

## 8. Sub-Processors

Stillform engages the following sub-processors to provide the
service:

| Sub-Processor   | Function              | Region            |
|-----------------|-----------------------|-------------------|
| Supabase, Inc.  | Database + auth       | United States     |
| Netlify, Inc.   | Hosting + functions   | United States     |
| Lemon Squeezy   | Payments              | United States     |
| Resend          | Transactional email   | United States     |
| Plausible       | Analytics (no PII)    | European Union    |
| Anthropic       | AI inference          | United States     |
| OpenAI          | Image-only AI         | United States     |
| Apple, Google   | App store distribution | Per platform     |

Plausible is configured to operate without personal identifiers
and without cookies. Anthropic and OpenAI receive only the
content the Member voluntarily includes in a reframe session,
processed solely to return a response; we do not authorize
either provider to retain or use that content for model
training.

A current list of sub-processors and any material changes is
maintained in Stillform's documentation and made available to
the Customer at the email on file on request.

## 9. Data Security

Practice content is encrypted in transit (TLS 1.2+ on all
endpoints) and at rest (AES-256 at the database layer). A
device-local AES-GCM key further encrypting conversation history
before cloud upload is PLANNED — not in the current build (June 2
2026; it was a deleted-old-frontend feature, rebuild backlog). The
TLS and database-layer protections above are current platform facts.

Access to backend systems is restricted to authorized personnel
under the principle of least privilege. Production database
access for service operations is mediated by the service-role
key, which is held only by Stillform's serverless functions
and by named operations personnel.

## 10. Breach Notification

In the event of a personal data breach involving Customer
Members' practice content, Stillform will notify the affected
Members and the Customer's designated point of contact without
undue delay, and in any event within 72 hours of becoming aware
of the breach.

## 11. Changes to This Addendum

We will notify Customers of material changes to this Addendum
by email to the billing contact on file at least 30 days before
the changes take effect. Continued use of the Service after the
effective date constitutes acceptance of the revised Addendum.

## 12. Contact

For privacy questions concerning this Addendum, contact:

**ARA Embers LLC**
ARAembersllc@proton.me

For privacy questions involving a Member's individual rights,
the Member may contact us directly at the same address.

---

*ARA Embers LLC · Stillform B2B Privacy Policy Addendum ·
draft pending legal review · v1.0*
