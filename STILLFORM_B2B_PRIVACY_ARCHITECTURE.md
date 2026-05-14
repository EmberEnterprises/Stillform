# Stillform B2B Privacy Architecture

**Version 1.0 — May 14, 2026**
**Status: locked. Referenced by STILLFORM_CANON.md.**

---

## The commitment

Stillform's B2B offering rests on one architectural commitment that everything
else depends on:

> An organization admin can never see a member's practice data.
> Not ever. Not for any reason. Not even aggregated.

This is not a feature. It is the contract. It is what makes Stillform's B2B
offering different from every corporate wellness tool that came before it —
and it is the only reason employees will actually trust the practice when
their employer is paying for the seat.

Most corporate wellness fails because employees correctly suspect that their
employer can see what they do. Stillform's B2B answer is to make that
suspicion architecturally impossible to confirm — because there is no data
for the employer to see, by design, at every layer.

---

## What an admin can see

The admin surface exists only to manage **procurement**, not to observe
practice. An admin may see:

- The organization itself: name, plan tier, seat limit, billing status, SSO
  configuration, auto-join domain (if set)
- The member list, scoped to seat management: email, role (admin or member),
  membership status (invited, active, removed), and the dates of those
  transitions
- Pending invites: invitee email, role, sender, expiry, accepted/revoked state
- The audit log of admin actions taken inside the org surface itself

That is the complete set.

## What an admin can never see

Not now. Not later. Not in any view, export, or aggregation:

- Any session content of any kind. No sessions, no journal entries, no
  reframes, no body scans, no breathing logs, no Today's Brief, no EOD, no
  bedtime, no Pre-event Brief — none of it.
- Any check-in, biometric reading, mood signal, feel-state, or chip selection.
- Any usage frequency, last-active date, login count, session count, streak,
  or any other engagement signal — even rolled up across the org.
- The total number of sessions completed by the org. The average sessions per
  active seat. Anything that lets an admin reason about whether a seat is
  "being used."
- Any field derived from practice data, no matter how anonymized it appears.

The list above is exhaustive in spirit even where it is not exhaustive in
letter. If a question takes the form "is the seat being used," the answer
the platform gives the admin is "we don't know — by design."

This is also the answer Stillform gives to procurement when the question is
asked during a sales cycle. It is the pitch.

---

## How the wall is enforced

Three layers. Each one would be sufficient on its own; we run all three.

### Layer 1 — Schema

The four B2B tables (`stillform_organizations`, `stillform_org_members`,
`stillform_org_invites`, `stillform_org_audit_log`) contain zero references
to any practice-content table.

- No foreign key into `user_data`, `backups`, or `user_profiles`.
- No column that derives from a practice surface.
- No view or materialized view that joins org and practice tables.
- Email addresses on `stillform_org_members` exist for one purpose only:
  letting an admin identify who they are adding or removing. They are not a
  bridge into practice content.

If a future migration ever wants to add a column that bridges these two
domains, the migration is wrong. The discipline is to refuse the join.

### Layer 2 — Function

Row-level grants on the org tables are zero for `anon` and `authenticated`.
All access goes through Netlify functions using the service-role key.

No function that an admin can call ever queries `user_data`, `backups`, or
`user_profiles`. The set of functions reachable by admin-role tokens is
fixed in code and reviewed when changed:

- `organization-status` (read own membership)
- `organization-list-members` (admin only — emails and management metadata)
- `organization-invite` (admin only — create invite)
- `organization-accept-invite` (member action against a token)
- `organization-remove-member` (admin only)
- `organization-update` (admin only — rename, plan tier, seat limit, SSO)
- `organization-audit-log` (admin only — read audit history of admin actions)

The boundary is enforced in code, not assumed. Every admin-reachable
endpoint above queries only org tables. Anything that wants to know
"what does this member actually do in Stillform" has no path to ask.

### Layer 3 — Audit

Every admin action against the org surface writes an entry to
`stillform_org_audit_log` with:

- `org_id`, `actor_user_id`, `action`, optional `target_user_id` /
  `target_email`, optional `metadata`, `ip_address`, `user_agent`,
  `created_at`

The audit log is append-only by convention. Application code never updates
or deletes rows. This is the SOC 2 evidence chain for B2B controls, and it
is also the answer to the procurement question "how do you prove admins are
not abusing their access."

Note that audit log entries describe admin actions on the org surface only.
They do not log practice activity — there is no practice activity to log
from an admin perspective, because the privacy wall makes practice activity
invisible to admins by construction.

---

## Member-facing privacy guarantee

When a user is part of an org, the practice surface surfaces the affiliation
honestly — and the privacy guarantee alongside it. The exact line, surfaced
in the affiliation card and in account settings, is:

> Your organization pays for this seat. They cannot see anything you do
> inside Stillform — not your sessions, journal, reframes, or any other
> practice content. Ever.

The line is also returned by `organization-status` in the response payload,
so any client surface that shows membership can show the guarantee in the
same breath. The two are inseparable.

---

## What this means for product decisions

A few consequences follow directly from the commitment. They are not up for
review:

1. **No "team progress" or "engagement dashboard" view.** Not at any plan
   tier. Not as a paid add-on. Not as an opt-in. The data necessary to
   build one does not flow into the org surface, by construction.

2. **No "company average" or "team benchmarks" comparisons** shown to
   members or to admins. There is no aggregate practice data to draw from.

3. **No "manager check-in" surface** where a manager can see how a direct
   report is doing in their practice. The relationship between practice and
   reporting line does not exist in our schema.

4. **No "your seat will be revoked if not used" semantics.** Admins cannot
   know which seats are used and which are not. The only signal available
   to them is the member status (invited / active / removed), and that
   status reflects admin action and member sign-up — not practice activity.

5. **No exception for SSO-provisioned users.** Auto-join via domain creates
   the same kind of membership as a manual invite. SSO does not entitle the
   IdP or the company to any visibility into practice content.

If a procurement request asks for any of the above, the answer is that
Stillform does not offer it, and the architectural reason is that the data
to provide it does not exist on our side. That is also the pitch.

---

## Where to look when reviewing changes

- Schema: `netlify/functions/_organizationSetup.sql`
- Server helpers: `netlify/functions/_organizationState.js`
- First read endpoint: `netlify/functions/organization-status.js`
- Future write endpoints (PR B+): `organization-invite.js`,
  `organization-accept-invite.js`, `organization-remove-member.js`,
  `organization-update.js`, `organization-list-members.js`,
  `organization-audit-log.js`
- Member-facing affiliation + privacy guarantee surface (PR C): rendered
  inside Settings and during the post-sign-in moment

Every code review that touches any of the above checks the three layers:
schema (no bridge columns added), function (no admin-reachable endpoint
queries practice tables), audit (every admin write is logged).

The discipline is small. The commitment is the whole product.

---

*ARA Embers LLC · Stillform B2B Privacy Architecture · May 14, 2026*
