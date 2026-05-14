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
