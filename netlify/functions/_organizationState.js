// ─────────────────────────────────────────────────────────────────────────
// Stillform B2B organization state — server-side helpers
// ─────────────────────────────────────────────────────────────────────────
//
// All access to the org tables routes through this module. anon and
// authenticated have ZERO grants on these tables (see _organizationSetup.sql);
// every read and write uses service_role via these helpers, which run inside
// Netlify functions only.
//
// CRITICAL — privacy wall:
//
// No helper in this file may ever query user_data, backups, user_profiles,
// or any other table that contains practice content. If a future helper
// needs to JOIN org membership against practice data, that is a violation
// of the architectural commitment. The fix is to not do it.
//
// What this module CAN return for an admin:
//   - Org metadata (name, plan, seats, billing status)
//   - Member list (email, role, status, joined date)
//   - Pending invites
//   - Audit log entries
//
// What this module MUST NOT return for an admin, ever:
//   - Any session, journal, reframe, scan, breathing, brief, or EOD content
//   - Any check-in, biometric, mood, or feel-state
//   - "Last active" / usage frequency / engagement of any kind
//
// ─────────────────────────────────────────────────────────────────────────

import { randomBytes } from "node:crypto";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://pxrewildfnbxlygjofpx.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const ORGANIZATIONS_TABLE  = "stillform_organizations";
export const ORG_MEMBERS_TABLE    = "stillform_org_members";
export const ORG_INVITES_TABLE    = "stillform_org_invites";
export const ORG_AUDIT_LOG_TABLE  = "stillform_org_audit_log";

export const PLAN_TIERS = Object.freeze(["small_team", "mid_market", "enterprise"]);
export const MEMBER_ROLES = Object.freeze(["admin", "member"]);
export const MEMBER_STATUSES = Object.freeze(["invited", "active", "removed"]);

// Canonical audit action names. Application code passes these strings;
// the DB does not enforce. Keep this list in sync with the comment block
// in _organizationSetup.sql.
export const AUDIT_ACTIONS = Object.freeze([
  "org_created",
  "org_renamed",
  "org_plan_changed",
  "org_seat_limit_changed",
  "org_sso_configured",
  "org_sso_removed",
  "org_auto_join_domain_set",
  "org_suspended",
  "org_cancelled",
  "org_billing_created",
  "org_billing_updated",
  "org_billing_payment_failed",
  "org_billing_recovered",
  "org_billing_cancelled",
  "org_billing_expired",
  "invite_sent",
  "invite_resent",
  "invite_revoked",
  "invite_accepted",
  "member_added",
  "member_role_changed",
  "member_removed"
]);

// ─────────────────────────────────────────────────────────────────────────
// Low-level Supabase admin fetch (mirrors _subscriptionState.sbAdminFetch
// pattern; kept local so this module is independently importable).
// ─────────────────────────────────────────────────────────────────────────

const sbAdminFetch = async (path, opts = {}) => {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");
  }
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      ...(opts.headers || {})
    }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase admin ${res.status}${text ? `: ${text}` : ""}`);
  }
  return res.json().catch(() => null);
};

const nowIso = () => new Date().toISOString();

const normalizeEmail = (value) => {
  if (!value) return null;
  const next = String(value).trim().toLowerCase();
  if (!next || !next.includes("@")) return null;
  return next.slice(0, 320);
};

// ─────────────────────────────────────────────────────────────────────────
// Reads
// ─────────────────────────────────────────────────────────────────────────

/**
 * Return the orgs a user is currently a member of, with their role and
 * status. Returns [] if the user is in no org.
 *
 * Shape: [{ org, membership }, ...]
 *   org         — full row from stillform_organizations
 *   membership  — full row from stillform_org_members
 *
 * Removed memberships are excluded.
 */
export const getMembershipsForUser = async (userId) => {
  if (!userId) return [];
  const memberRows = await sbAdminFetch(
    `/rest/v1/${ORG_MEMBERS_TABLE}?user_id=eq.${encodeURIComponent(userId)}&status=neq.removed&select=*`
  );
  if (!Array.isArray(memberRows) || memberRows.length === 0) return [];

  const orgIds = [...new Set(memberRows.map((row) => row.org_id).filter(Boolean))];
  if (orgIds.length === 0) return [];

  const orgFilter = orgIds.map((id) => `"${id}"`).join(",");
  const orgRows = await sbAdminFetch(
    `/rest/v1/${ORGANIZATIONS_TABLE}?id=in.(${orgFilter})&select=*`
  );
  const orgById = new Map((orgRows || []).map((row) => [row.id, row]));

  return memberRows
    .map((membership) => {
      const org = orgById.get(membership.org_id);
      return org ? { org, membership } : null;
    })
    .filter(Boolean);
};

/**
 * Look up an org by id. Returns null if not found.
 */
export const getOrgById = async (orgId) => {
  if (!orgId) return null;
  const rows = await sbAdminFetch(
    `/rest/v1/${ORGANIZATIONS_TABLE}?id=eq.${encodeURIComponent(orgId)}&select=*&limit=1`
  );
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
};

/**
 * Verify that a user is an active admin of a given org.
 * Returns the membership row if so, null otherwise.
 *
 * Functions that perform admin actions MUST call this before any write.
 */
export const requireOrgAdmin = async ({ orgId, userId }) => {
  if (!orgId || !userId) return null;
  const rows = await sbAdminFetch(
    `/rest/v1/${ORG_MEMBERS_TABLE}` +
    `?org_id=eq.${encodeURIComponent(orgId)}` +
    `&user_id=eq.${encodeURIComponent(userId)}` +
    `&role=eq.admin` +
    `&status=eq.active` +
    `&select=*&limit=1`
  );
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
};

/**
 * Count active members of an org. Used to enforce seat_limit before
 * accepting an invite or adding a member.
 */
export const countActiveMembers = async (orgId) => {
  if (!orgId) return 0;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${ORG_MEMBERS_TABLE}` +
    `?org_id=eq.${encodeURIComponent(orgId)}&status=eq.active&select=id`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "count=exact",
        "Range-Unit": "items",
        Range: "0-0"
      }
    }
  );
  if (!res.ok) throw new Error(`countActiveMembers ${res.status}`);
  const contentRange = res.headers.get("content-range") || "";
  const total = Number(contentRange.split("/").pop());
  return Number.isFinite(total) ? total : 0;
};

// ─────────────────────────────────────────────────────────────────────────
// Audit log
// ─────────────────────────────────────────────────────────────────────────

/**
 * Append an entry to the org audit log. Append-only by convention; SOC 2
 * evidence chain begins here.
 *
 * Required: orgId, actorUserId, action
 * Optional: targetUserId, targetEmail, metadata, ipAddress, userAgent
 */
export const logOrgAudit = async ({
  orgId,
  actorUserId,
  action,
  targetUserId = null,
  targetEmail = null,
  metadata = null,
  ipAddress = null,
  userAgent = null
}) => {
  if (!orgId || !actorUserId || !action) {
    throw new Error("logOrgAudit: orgId, actorUserId, action are required");
  }
  if (!AUDIT_ACTIONS.includes(action)) {
    throw new Error(`logOrgAudit: unknown action "${action}"`);
  }
  const row = {
    org_id: orgId,
    actor_user_id: actorUserId,
    action,
    target_user_id: targetUserId || null,
    target_email: normalizeEmail(targetEmail) || null,
    metadata: metadata && typeof metadata === "object" ? metadata : null,
    ip_address: ipAddress || null,
    user_agent: userAgent ? String(userAgent).slice(0, 500) : null,
    created_at: nowIso()
  };
  await sbAdminFetch(`/rest/v1/${ORG_AUDIT_LOG_TABLE}`, {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(row)
  });
};

// ─────────────────────────────────────────────────────────────────────────
// Status shape — what the client sees about its own org membership.
// ─────────────────────────────────────────────────────────────────────────
//
// Returned by organization-status.js. Contains zero practice data.
// Member rows are NOT included here; that lives on a separate
// admin-only endpoint that requires admin role.

export const buildOrgStatusForUser = async (userId) => {
  if (!userId) {
    return { ok: true, in_org: false, memberships: [] };
  }
  const memberships = await getMembershipsForUser(userId);
  if (memberships.length === 0) {
    return { ok: true, in_org: false, memberships: [] };
  }
  return {
    ok: true,
    in_org: true,
    memberships: memberships.map(({ org, membership }) => ({
      org_id: org.id,
      org_name: org.name,
      org_status: org.status,
      subscription_status: org.subscription_status || null,
      has_active_subscription: Boolean(org.lemon_subscription_id) && org.status === "active",
      sso_provider: org.sso_provider || null,
      auto_join_domain: org.auto_join_domain || null,
      plan_tier: org.plan_tier,
      role: membership.role,
      status: membership.status,
      joined_at: membership.joined_at,
      // Privacy guarantee surfaced to the member — also displayed in UI:
      privacy_guarantee:
        "Your organization pays for this seat. They cannot see anything " +
        "you do inside Stillform — not your sessions, journal, reframes, " +
        "or any other practice content. Ever."
    }))
  };
};

// ─────────────────────────────────────────────────────────────────────────
// Write helpers (used by admin-only and invite-accept endpoints).
//
// Every write that mutates an org table also writes a row to
// stillform_org_audit_log via logOrgAudit. This is non-negotiable — SOC 2
// evidence chain for B2B controls is the auditable trail of admin actions.
// ─────────────────────────────────────────────────────────────────────────

const INVITE_EXPIRY_DAYS = 7;

const generateInviteToken = () => {
  // 32 bytes → base64url (~43 chars). Cryptographically random.
  return randomBytes(32)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
};

const computeInviteExpiry = () => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + INVITE_EXPIRY_DAYS);
  return d.toISOString();
};

/**
 * Extract request metadata for audit logging. Falls back gracefully when
 * fields are absent.
 */
export const extractRequestMeta = (event) => {
  const headers = event?.headers || {};
  const forwarded =
    headers["x-forwarded-for"] ||
    headers["X-Forwarded-For"] ||
    headers["x-nf-client-connection-ip"] ||
    headers["X-NF-Client-Connection-IP"] ||
    null;
  const ipAddress = forwarded ? String(forwarded).split(",")[0].trim() : null;
  const userAgent = headers["user-agent"] || headers["User-Agent"] || null;
  return { ipAddress, userAgent };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (value) => {
  const normalized = normalizeEmail(value);
  if (!normalized) return false;
  return EMAIL_RE.test(normalized) && normalized.length <= 320;
};

// ─────────────────────────────────────────────────────────────────────────
// createOrgWithAdmin
// ─────────────────────────────────────────────────────────────────────────
//
// Creates an organization plus the owner's admin membership in a single
// logical operation. Two table writes plus an audit entry; we accept a
// small window of inconsistency on partial failure (rare for normal
// service_role traffic) and fix forward if it happens.
//
// Caller is responsible for ensuring the authenticated user is the
// ownerUserId (verified in the endpoint via getUserFromToken).

export const createOrgWithAdmin = async ({
  name,
  billingEmail,
  planTier = "small_team",
  seatLimit = 1,
  ownerUserId,
  ownerEmail,
  ipAddress = null,
  userAgent = null
}) => {
  if (!ownerUserId) throw new Error("createOrgWithAdmin: ownerUserId required");
  if (!name || typeof name !== "string") throw new Error("createOrgWithAdmin: name required");
  if (!isValidEmail(billingEmail)) throw new Error("createOrgWithAdmin: valid billingEmail required");
  if (!isValidEmail(ownerEmail)) throw new Error("createOrgWithAdmin: valid ownerEmail required");
  if (!PLAN_TIERS.includes(planTier)) {
    throw new Error(`createOrgWithAdmin: planTier must be one of ${PLAN_TIERS.join(",")}`);
  }
  const limit = Math.max(1, Math.floor(Number(seatLimit) || 1));

  const orgRow = {
    name: String(name).trim().slice(0, 200),
    billing_email: normalizeEmail(billingEmail),
    owner_user_id: ownerUserId,
    plan_tier: planTier,
    seat_limit: limit,
    status: "active",
    created_at: nowIso(),
    updated_at: nowIso()
  };
  const orgs = await sbAdminFetch(`/rest/v1/${ORGANIZATIONS_TABLE}`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(orgRow)
  });
  const org = Array.isArray(orgs) && orgs[0] ? orgs[0] : null;
  if (!org) throw new Error("createOrgWithAdmin: org insert returned no row");

  const memberRow = {
    org_id: org.id,
    user_id: ownerUserId,
    email: normalizeEmail(ownerEmail),
    role: "admin",
    status: "active",
    joined_at: nowIso(),
    created_at: nowIso(),
    updated_at: nowIso()
  };
  const members = await sbAdminFetch(`/rest/v1/${ORG_MEMBERS_TABLE}`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(memberRow)
  });
  const membership = Array.isArray(members) && members[0] ? members[0] : null;

  await logOrgAudit({
    orgId: org.id,
    actorUserId: ownerUserId,
    action: "org_created",
    metadata: {
      plan_tier: planTier,
      seat_limit: limit,
      name: orgRow.name
    },
    ipAddress,
    userAgent
  });

  return { org, membership };
};

// ─────────────────────────────────────────────────────────────────────────
// updateOrg
// ─────────────────────────────────────────────────────────────────────────
//
// Admin-only. Updates whitelisted fields and writes one audit entry per
// changed field with the canonical action name and { old, new } metadata.
//
// Caller must call requireOrgAdmin({ orgId, userId: actorUserId }) first.

const FIELD_TO_AUDIT_ACTION = Object.freeze({
  name: "org_renamed",
  plan_tier: "org_plan_changed",
  seat_limit: "org_seat_limit_changed",
  sso_provider: "org_sso_configured",
  sso_metadata: "org_sso_configured",
  auto_join_domain: "org_auto_join_domain_set",
  status: null // status changes use specific actions below
});

export const updateOrg = async ({
  orgId,
  actorUserId,
  updates,
  ipAddress = null,
  userAgent = null
}) => {
  if (!orgId) throw new Error("updateOrg: orgId required");
  if (!actorUserId) throw new Error("updateOrg: actorUserId required");
  if (!updates || typeof updates !== "object") throw new Error("updateOrg: updates required");

  const existing = await getOrgById(orgId);
  if (!existing) throw new Error("updateOrg: org not found");

  const patch = {};
  const audits = [];

  // Whitelist of mutable fields.
  for (const field of ["name", "plan_tier", "seat_limit", "sso_provider", "sso_metadata", "auto_join_domain", "status"]) {
    if (!(field in updates)) continue;
    const next = updates[field];
    const prev = existing[field];

    // Per-field validation.
    if (field === "name") {
      if (!next || typeof next !== "string") continue;
      patch.name = String(next).trim().slice(0, 200);
    } else if (field === "plan_tier") {
      if (!PLAN_TIERS.includes(next)) throw new Error(`updateOrg: invalid plan_tier "${next}"`);
      patch.plan_tier = next;
    } else if (field === "seat_limit") {
      const limit = Math.max(1, Math.floor(Number(next) || 0));
      const active = await countActiveMembers(orgId);
      if (limit < active) {
        throw new Error(`updateOrg: seat_limit ${limit} below current active member count ${active}`);
      }
      patch.seat_limit = limit;
    } else if (field === "sso_provider") {
      if (next !== null && !["okta", "azure_ad", "google_workspace"].includes(next)) {
        throw new Error(`updateOrg: invalid sso_provider "${next}"`);
      }
      patch.sso_provider = next || null;
    } else if (field === "sso_metadata") {
      patch.sso_metadata = next && typeof next === "object" ? next : null;
    } else if (field === "auto_join_domain") {
      patch.auto_join_domain = next ? String(next).trim().toLowerCase().slice(0, 253) : null;
    } else if (field === "status") {
      if (!["active", "suspended", "cancelled"].includes(next)) {
        throw new Error(`updateOrg: invalid status "${next}"`);
      }
      patch.status = next;
    }

    const auditAction = FIELD_TO_AUDIT_ACTION[field];
    if (auditAction) {
      audits.push({ action: auditAction, metadata: { field, old: prev, new: patch[field] } });
    } else if (field === "status") {
      if (next === "suspended") audits.push({ action: "org_suspended", metadata: { old: prev } });
      if (next === "cancelled") audits.push({ action: "org_cancelled", metadata: { old: prev } });
    }
  }

  if (Object.keys(patch).length === 0) {
    return { org: existing, changed: [] };
  }

  patch.updated_at = nowIso();

  const rows = await sbAdminFetch(
    `/rest/v1/${ORGANIZATIONS_TABLE}?id=eq.${encodeURIComponent(orgId)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(patch)
    }
  );
  const updated = Array.isArray(rows) && rows[0] ? rows[0] : null;

  for (const entry of audits) {
    await logOrgAudit({
      orgId,
      actorUserId,
      action: entry.action,
      metadata: entry.metadata,
      ipAddress,
      userAgent
    });
  }

  return { org: updated, changed: audits.map((a) => a.action) };
};

// ─────────────────────────────────────────────────────────────────────────
// listOrgMembers
// ─────────────────────────────────────────────────────────────────────────
//
// Admin-only. Returns the management view of an org's members: email,
// role, status, transition dates. NEVER includes anything inferable from
// practice — by construction this query selects only from the org_members
// table.

export const listOrgMembers = async (orgId, { includeRemoved = false } = {}) => {
  if (!orgId) return [];
  const statusFilter = includeRemoved ? "" : "&status=neq.removed";
  const rows = await sbAdminFetch(
    `/rest/v1/${ORG_MEMBERS_TABLE}` +
    `?org_id=eq.${encodeURIComponent(orgId)}${statusFilter}` +
    `&select=id,user_id,email,role,status,invited_at,joined_at,removed_at` +
    `&order=joined_at.asc.nullsfirst,invited_at.asc.nullsfirst`
  );
  return Array.isArray(rows) ? rows : [];
};

// ─────────────────────────────────────────────────────────────────────────
// listPendingInvites
// ─────────────────────────────────────────────────────────────────────────
//
// Admin-only. Returns invites that are neither accepted nor revoked and
// have not expired. Excludes the invite_token itself from the response;
// admins don't need it (they re-send by email).

export const listPendingInvites = async (orgId) => {
  if (!orgId) return [];
  const nowIsoNow = nowIso();
  const rows = await sbAdminFetch(
    `/rest/v1/${ORG_INVITES_TABLE}` +
    `?org_id=eq.${encodeURIComponent(orgId)}` +
    `&accepted_at=is.null&revoked_at=is.null` +
    `&expires_at=gt.${encodeURIComponent(nowIsoNow)}` +
    `&select=id,email,role,invited_by_user_id,created_at,expires_at` +
    `&order=created_at.desc`
  );
  return Array.isArray(rows) ? rows : [];
};

// ─────────────────────────────────────────────────────────────────────────
// createInvite
// ─────────────────────────────────────────────────────────────────────────
//
// Admin-only. Generates a crypto-random invite token, inserts the invite
// row, and writes an audit entry. Enforces:
//   - Valid email format
//   - Role is admin or member
//   - Target email is not already an active member
//   - No existing pending invite for the same email (revoke first if so)
//   - Org has seat capacity (active + pending invites < seat_limit)

export const createInvite = async ({
  orgId,
  actorUserId,
  email,
  role = "member",
  ipAddress = null,
  userAgent = null
}) => {
  if (!orgId) throw new Error("createInvite: orgId required");
  if (!actorUserId) throw new Error("createInvite: actorUserId required");
  if (!isValidEmail(email)) throw new Error("createInvite: valid email required");
  if (!MEMBER_ROLES.includes(role)) throw new Error(`createInvite: invalid role "${role}"`);

  const org = await getOrgById(orgId);
  if (!org) throw new Error("createInvite: org not found");
  if (org.status !== "active") throw new Error("createInvite: org is not active");

  const normalizedEmail = normalizeEmail(email);

  // Already an active member?
  const existingMember = await sbAdminFetch(
    `/rest/v1/${ORG_MEMBERS_TABLE}` +
    `?org_id=eq.${encodeURIComponent(orgId)}` +
    `&email=eq.${encodeURIComponent(normalizedEmail)}` +
    `&status=eq.active&select=id&limit=1`
  );
  if (Array.isArray(existingMember) && existingMember.length > 0) {
    throw new Error("createInvite: email is already an active member");
  }

  // Existing unaccepted/unrevoked/unexpired invite?
  const existingInvite = await sbAdminFetch(
    `/rest/v1/${ORG_INVITES_TABLE}` +
    `?org_id=eq.${encodeURIComponent(orgId)}` +
    `&email=eq.${encodeURIComponent(normalizedEmail)}` +
    `&accepted_at=is.null&revoked_at=is.null` +
    `&expires_at=gt.${encodeURIComponent(nowIso())}` +
    `&select=id&limit=1`
  );
  if (Array.isArray(existingInvite) && existingInvite.length > 0) {
    throw new Error("createInvite: pending invite already exists for this email");
  }

  // Seat capacity check: active members + pending invites must be below seat_limit.
  const activeCount = await countActiveMembers(orgId);
  const pendingInvites = await listPendingInvites(orgId);
  if (activeCount + pendingInvites.length >= org.seat_limit) {
    throw new Error(
      `createInvite: at seat limit (${org.seat_limit}); upgrade plan or remove members first`
    );
  }

  const inviteRow = {
    org_id: orgId,
    email: normalizedEmail,
    role,
    invite_token: generateInviteToken(),
    invited_by_user_id: actorUserId,
    created_at: nowIso(),
    expires_at: computeInviteExpiry()
  };
  const rows = await sbAdminFetch(`/rest/v1/${ORG_INVITES_TABLE}`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(inviteRow)
  });
  const invite = Array.isArray(rows) && rows[0] ? rows[0] : null;
  if (!invite) throw new Error("createInvite: insert returned no row");

  await logOrgAudit({
    orgId,
    actorUserId,
    action: "invite_sent",
    targetEmail: normalizedEmail,
    metadata: { role, expires_at: invite.expires_at },
    ipAddress,
    userAgent
  });

  return invite;
};

// ─────────────────────────────────────────────────────────────────────────
// acceptInvite
// ─────────────────────────────────────────────────────────────────────────
//
// Called by an authenticated user with the invite token. Enforces:
//   - Token exists and is unaccepted, unrevoked, unexpired
//   - Accepting user's email matches the invited email (case insensitive)
//   - Org still has seat capacity at the moment of accept
//   - User isn't already an active member of the org
// Side effects:
//   - Insert active member row
//   - Mark invite accepted_at + accepted_by_user_id
//   - Audit log: invite_accepted

export const acceptInvite = async ({
  inviteToken,
  acceptingUserId,
  acceptingEmail,
  ipAddress = null,
  userAgent = null
}) => {
  if (!inviteToken) throw new Error("acceptInvite: inviteToken required");
  if (!acceptingUserId) throw new Error("acceptInvite: acceptingUserId required");
  if (!isValidEmail(acceptingEmail)) throw new Error("acceptInvite: valid acceptingEmail required");

  const inviteRows = await sbAdminFetch(
    `/rest/v1/${ORG_INVITES_TABLE}` +
    `?invite_token=eq.${encodeURIComponent(inviteToken)}` +
    `&select=*&limit=1`
  );
  const invite = Array.isArray(inviteRows) && inviteRows[0] ? inviteRows[0] : null;
  if (!invite) throw new Error("acceptInvite: invite not found");
  if (invite.accepted_at) throw new Error("acceptInvite: invite already accepted");
  if (invite.revoked_at) throw new Error("acceptInvite: invite revoked");
  if (new Date(invite.expires_at).getTime() < Date.now()) {
    throw new Error("acceptInvite: invite expired");
  }

  const normalizedEmail = normalizeEmail(acceptingEmail);
  if (normalizedEmail !== invite.email) {
    throw new Error("acceptInvite: signed-in email does not match invited email");
  }

  const org = await getOrgById(invite.org_id);
  if (!org) throw new Error("acceptInvite: org not found");
  if (org.status !== "active") throw new Error("acceptInvite: org is not active");

  // Already a member?
  const existingMember = await sbAdminFetch(
    `/rest/v1/${ORG_MEMBERS_TABLE}` +
    `?org_id=eq.${encodeURIComponent(invite.org_id)}` +
    `&user_id=eq.${encodeURIComponent(acceptingUserId)}` +
    `&status=eq.active&select=*&limit=1`
  );
  if (Array.isArray(existingMember) && existingMember[0]) {
    // Already an active member — mark the invite accepted but return existing membership.
    await sbAdminFetch(
      `/rest/v1/${ORG_INVITES_TABLE}?id=eq.${encodeURIComponent(invite.id)}`,
      {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          accepted_at: nowIso(),
          accepted_by_user_id: acceptingUserId
        })
      }
    );
    return { org, membership: existingMember[0], alreadyMember: true };
  }

  // Seat capacity at moment of accept.
  const activeCount = await countActiveMembers(invite.org_id);
  if (activeCount >= org.seat_limit) {
    throw new Error("acceptInvite: org is at seat limit; ask admin to upgrade or free a seat");
  }

  // Insert membership.
  const memberRow = {
    org_id: invite.org_id,
    user_id: acceptingUserId,
    email: normalizedEmail,
    role: invite.role,
    status: "active",
    invited_at: invite.created_at,
    joined_at: nowIso(),
    created_at: nowIso(),
    updated_at: nowIso()
  };
  const newMembers = await sbAdminFetch(`/rest/v1/${ORG_MEMBERS_TABLE}`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(memberRow)
  });
  const membership = Array.isArray(newMembers) && newMembers[0] ? newMembers[0] : null;

  // Mark invite accepted.
  await sbAdminFetch(
    `/rest/v1/${ORG_INVITES_TABLE}?id=eq.${encodeURIComponent(invite.id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        accepted_at: nowIso(),
        accepted_by_user_id: acceptingUserId
      })
    }
  );

  await logOrgAudit({
    orgId: invite.org_id,
    actorUserId: acceptingUserId,
    action: "invite_accepted",
    targetUserId: acceptingUserId,
    targetEmail: normalizedEmail,
    metadata: { role: invite.role, invite_id: invite.id },
    ipAddress,
    userAgent
  });

  return { org, membership, alreadyMember: false };
};

// ─────────────────────────────────────────────────────────────────────────
// revokeInvite
// ─────────────────────────────────────────────────────────────────────────
//
// Admin-only. Marks an unaccepted invite as revoked.

export const revokeInvite = async ({
  inviteId,
  actorUserId,
  ipAddress = null,
  userAgent = null
}) => {
  if (!inviteId) throw new Error("revokeInvite: inviteId required");
  if (!actorUserId) throw new Error("revokeInvite: actorUserId required");

  const inviteRows = await sbAdminFetch(
    `/rest/v1/${ORG_INVITES_TABLE}?id=eq.${encodeURIComponent(inviteId)}&select=*&limit=1`
  );
  const invite = Array.isArray(inviteRows) && inviteRows[0] ? inviteRows[0] : null;
  if (!invite) throw new Error("revokeInvite: invite not found");
  if (invite.accepted_at) throw new Error("revokeInvite: invite already accepted");
  if (invite.revoked_at) return invite;

  const rows = await sbAdminFetch(
    `/rest/v1/${ORG_INVITES_TABLE}?id=eq.${encodeURIComponent(inviteId)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        revoked_at: nowIso(),
        revoked_by_user_id: actorUserId
      })
    }
  );
  const updated = Array.isArray(rows) && rows[0] ? rows[0] : null;

  await logOrgAudit({
    orgId: invite.org_id,
    actorUserId,
    action: "invite_revoked",
    targetEmail: invite.email,
    metadata: { invite_id: invite.id },
    ipAddress,
    userAgent
  });

  return updated;
};

// ─────────────────────────────────────────────────────────────────────────
// removeMember
// ─────────────────────────────────────────────────────────────────────────
//
// Admin-only. Sets membership status='removed' and records removed_at.
// Refuses to remove the last admin of an org.

const countActiveAdmins = async (orgId) => {
  if (!orgId) return 0;
  const rows = await sbAdminFetch(
    `/rest/v1/${ORG_MEMBERS_TABLE}` +
    `?org_id=eq.${encodeURIComponent(orgId)}` +
    `&role=eq.admin&status=eq.active&select=id`
  );
  return Array.isArray(rows) ? rows.length : 0;
};

export const removeMember = async ({
  orgId,
  actorUserId,
  targetUserId,
  ipAddress = null,
  userAgent = null
}) => {
  if (!orgId) throw new Error("removeMember: orgId required");
  if (!actorUserId) throw new Error("removeMember: actorUserId required");
  if (!targetUserId) throw new Error("removeMember: targetUserId required");

  const memberRows = await sbAdminFetch(
    `/rest/v1/${ORG_MEMBERS_TABLE}` +
    `?org_id=eq.${encodeURIComponent(orgId)}` +
    `&user_id=eq.${encodeURIComponent(targetUserId)}` +
    `&status=eq.active&select=*&limit=1`
  );
  const member = Array.isArray(memberRows) && memberRows[0] ? memberRows[0] : null;
  if (!member) throw new Error("removeMember: active membership not found");

  if (member.role === "admin") {
    const adminCount = await countActiveAdmins(orgId);
    if (adminCount <= 1) {
      throw new Error("removeMember: cannot remove the last admin; promote another member to admin first");
    }
  }

  const rows = await sbAdminFetch(
    `/rest/v1/${ORG_MEMBERS_TABLE}?id=eq.${member.id}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        status: "removed",
        removed_at: nowIso(),
        updated_at: nowIso()
      })
    }
  );
  const updated = Array.isArray(rows) && rows[0] ? rows[0] : null;

  await logOrgAudit({
    orgId,
    actorUserId,
    action: "member_removed",
    targetUserId,
    targetEmail: member.email,
    metadata: { role: member.role, self_removal: actorUserId === targetUserId },
    ipAddress,
    userAgent
  });

  return updated;
};

// ─────────────────────────────────────────────────────────────────────────
// readAuditLog
// ─────────────────────────────────────────────────────────────────────────
//
// Admin-only. Returns audit log entries for an org, paginated by cursor
// (entry id, descending). Optional action filter.

export const readAuditLog = async ({ orgId, limit = 50, beforeId = null, action = null } = {}) => {
  if (!orgId) return { entries: [], next_cursor: null };
  const safeLimit = Math.min(200, Math.max(1, Math.floor(Number(limit) || 50)));
  const beforeClause = beforeId ? `&id=lt.${encodeURIComponent(beforeId)}` : "";
  const actionClause = action ? `&action=eq.${encodeURIComponent(action)}` : "";
  const rows = await sbAdminFetch(
    `/rest/v1/${ORG_AUDIT_LOG_TABLE}` +
    `?org_id=eq.${encodeURIComponent(orgId)}${beforeClause}${actionClause}` +
    `&select=*&order=id.desc&limit=${safeLimit}`
  );
  const entries = Array.isArray(rows) ? rows : [];
  const nextCursor =
    entries.length === safeLimit ? entries[entries.length - 1].id : null;
  return { entries, next_cursor: nextCursor };
};

// ─────────────────────────────────────────────────────────────────────────
// Billing helpers (Lemon Squeezy webhook integration).
//
// The org webhook path lives inside subscription-webhook.js. When an LS
// event arrives with custom_data.org_id set, the webhook calls
// upsertOrgBilling instead of upsertSubscriptionByLemonId.
//
// Mapping LS billing state → org.status:
//   subscription_created  / active  / on_trial / resumed / recovered → active
//   payment_failed / past_due / unpaid                               → suspended
//   subscription_cancelled / expired                                 → cancelled
//
// Separately, org.subscription_status carries the LS-level state verbatim
// so the admin UI can surface "past due — update payment method," etc.
// ─────────────────────────────────────────────────────────────────────────

const BILLING_AUDIT_ACTIONS = Object.freeze([
  "org_billing_created",
  "org_billing_updated",
  "org_billing_payment_failed",
  "org_billing_recovered",
  "org_billing_cancelled",
  "org_billing_expired"
]);

const mapLemonStatusToOrgStatus = (lemonStatus, eventName) => {
  const ls = String(lemonStatus || "").toLowerCase();
  const ev = String(eventName || "").toLowerCase();
  if (ev === "subscription_expired" || ev === "subscription_cancelled") return "cancelled";
  if (ev === "subscription_payment_failed") return "suspended";
  if (ev === "subscription_payment_recovered" || ev === "subscription_resumed" || ev === "subscription_unpaused") return "active";
  if (ls === "cancelled" || ls === "expired") return "cancelled";
  if (ls === "past_due" || ls === "unpaid" || ls === "paused") return "suspended";
  if (ls === "active" || ls === "on_trial") return "active";
  return "active";
};

const pickBillingAuditAction = (eventName, prevStatus, nextStatus) => {
  const ev = String(eventName || "").toLowerCase();
  if (ev === "subscription_created") return "org_billing_created";
  if (ev === "subscription_payment_failed") return "org_billing_payment_failed";
  if (ev === "subscription_payment_recovered" || ev === "subscription_resumed" || ev === "subscription_unpaused") return "org_billing_recovered";
  if (ev === "subscription_cancelled") return "org_billing_cancelled";
  if (ev === "subscription_expired") return "org_billing_expired";
  if (prevStatus !== nextStatus) return "org_billing_updated";
  return "org_billing_updated";
};

/**
 * Upsert org billing state from a Lemon Squeezy webhook event.
 *
 * No-op safe: if the org doesn't exist (org_id passed in custom_data was
 * stale or invalid), this returns null without throwing — the webhook can
 * acknowledge the event without retry.
 *
 * Writes:
 *   - stillform_organizations: lemon_subscription_id, lemon_customer_id,
 *     lemon_variant_id, subscription_status, status (mapped), updated_at
 *   - stillform_org_audit_log: one entry with actor=owner_user_id (the
 *     webhook isn't a user, so we attribute to the org owner)
 *
 * NEVER touches user_data, backups, or user_profiles — the billing
 * surface remains architecturally walled off from practice data.
 */
export const upsertOrgBilling = async ({
  orgId,
  lemonSubscriptionId,
  lemonCustomerId,
  lemonVariantId,
  lemonStatus,
  eventName
}) => {
  if (!orgId) throw new Error("upsertOrgBilling: orgId required");

  const existing = await getOrgById(orgId);
  if (!existing) return null; // stale custom_data — ignore safely

  const nextOrgStatus = mapLemonStatusToOrgStatus(lemonStatus, eventName);
  const auditAction = pickBillingAuditAction(eventName, existing.status, nextOrgStatus);

  const patch = {
    subscription_status: lemonStatus || null,
    status: nextOrgStatus,
    updated_at: nowIso()
  };
  if (lemonSubscriptionId) patch.lemon_subscription_id = String(lemonSubscriptionId);
  if (lemonCustomerId) patch.lemon_customer_id = String(lemonCustomerId);
  if (lemonVariantId) patch.lemon_variant_id = String(lemonVariantId);

  const rows = await sbAdminFetch(
    `/rest/v1/${ORGANIZATIONS_TABLE}?id=eq.${encodeURIComponent(orgId)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(patch)
    }
  );
  const updated = Array.isArray(rows) && rows[0] ? rows[0] : null;

  // Write audit entry. Webhook is not a user; attribute to the org owner
  // so the chain has a real actor_user_id. Metadata carries the LS event
  // name and the status transition so admins can see "what just happened
  // to billing" in the audit log.
  try {
    await sbAdminFetch(`/rest/v1/${ORG_AUDIT_LOG_TABLE}`, {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        org_id: orgId,
        actor_user_id: existing.owner_user_id,
        action: BILLING_AUDIT_ACTIONS.includes(auditAction) ? auditAction : "org_billing_updated",
        metadata: {
          event_name: eventName || null,
          lemon_status: lemonStatus || null,
          previous_org_status: existing.status,
          next_org_status: nextOrgStatus,
          lemon_subscription_id: lemonSubscriptionId || null,
          source: "lemon_squeezy_webhook"
        },
        created_at: nowIso()
      })
    });
  } catch (err) {
    // Audit log failure doesn't fail the billing update — log to stderr.
    console.error("upsertOrgBilling: audit log write failed", err?.message || err);
  }

  return updated;
};
