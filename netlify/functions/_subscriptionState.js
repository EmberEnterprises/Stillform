import { createHash } from "node:crypto";

// ─────────────────────────────────────────────────────────────────────────
// Stillform subscription state — v2 schema (May 6, 2026)
// ─────────────────────────────────────────────────────────────────────────
//
// Architecture: ONE row per Lemon Squeezy subscription, keyed by
// lemon_subscription_id. user_id and install_id are indexed lookup columns,
// not part of row identity. No more identity_key. No more pickBestState
// arbitration. No more multi-row writes per webhook event.
//
// Migration: see _subscriptionMigration_v2.sql in this directory. Run that
// SQL in Supabase SQL editor before deploying these functions.
//
// Backward compatibility: the v1 patch (commit c81dbb3) for email-based
// user_id fallback is now part of normal flow rather than a special case.
// If a webhook arrives without custom_data.user_id but with an email that
// matches a Supabase auth user, we resolve user_id from that match.
//
// ─────────────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL || "https://pxrewildfnbxlygjofpx.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const SUBSCRIPTION_TABLE = "stillform_subscription_state";
const HASH_PEPPER = process.env.SUBSCRIPTION_EMAIL_HASH_PEPPER || "";

export const sbAdminFetch = async (path, opts = {}) => {
  if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");
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

const toIso = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
};

const nowIso = () => new Date().toISOString();

const normalizeEmail = (value) => {
  if (!value) return null;
  const next = String(value).trim().toLowerCase();
  if (!next || !next.includes("@")) return null;
  return next.slice(0, 320);
};

const sha256 = async (text) =>
  createHash("sha256").update(String(text || "")).digest("hex");

const hashEmail = async (email) => {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;
  const material = HASH_PEPPER ? `${normalized}|${HASH_PEPPER}` : normalized;
  return sha256(material);
};

const computeIsSubscribed = ({ status, lemonStatus, endsAt, eventName }) => {
  const normalizedEvent = String(eventName || "").toLowerCase();
  const normalized = String(status || lemonStatus || "").toLowerCase();
  const ends = toIso(endsAt);
  const endsInFuture = ends && new Date(ends).getTime() > Date.now();

  if (normalizedEvent === "subscription_expired") return false;
  if (normalized === "inactive") return false;
  if (normalized === "expired") return false;
  if (normalized === "paused") return false;
  if (normalized === "unpaid") return false;
  if (normalized === "cancelled") return Boolean(endsInFuture);
  // Keep access while payment retries run; strict revocation happens on "expired".
  return true;
};

const buildStatusExpiresAt = ({ status, endsAt }) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "cancelled") return toIso(endsAt);
  return null;
};

// ─── Email-based user_id resolution ────────────────────────────────────
// Used when a Lemon Squeezy webhook arrives without custom_data.user_id.
// Looks up Supabase auth.users by email. Returns user_id if found, null
// otherwise. This was a v1 patch (commit c81dbb3) — now part of normal flow.
const resolveUserIdByEmail = async (email) => {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;
  try {
    const result = await sbAdminFetch(
      `/auth/v1/admin/users?email=${encodeURIComponent(normalized)}`
    );
    // Supabase admin API returns { users: [...] } or an array directly
    const users = Array.isArray(result) ? result : (result?.users || []);
    if (users.length && users[0]?.id) return users[0].id;
    return null;
  } catch {
    return null;
  }
};

// ─── Single source-of-truth upsert ────────────────────────────────────
// Writes exactly ONE row, keyed by lemon_subscription_id. Email-based
// user_id fallback is integrated. If userId is not provided AND email is
// available, we attempt resolution. If both are missing (rare edge case),
// the row writes with null user_id and gets backfilled when the user signs
// in via subscription-link-account.
export const upsertSubscriptionByLemonId = async ({
  lemonSubscriptionId,
  userId = null,
  installId = null,
  lemonCustomerId = null,
  lemonStatus = null,
  status = null,
  userEmail = null,
  variantName = null,
  productName = null,
  eventName = null,
  trialEndsAt = null,
  renewsAt = null,
  endsAt = null
}) => {
  if (!lemonSubscriptionId) {
    throw new Error("upsertSubscriptionByLemonId: lemonSubscriptionId is required");
  }

  // Resolve user_id from email if not provided
  let resolvedUserId = userId;
  if (!resolvedUserId && userEmail) {
    resolvedUserId = await resolveUserIdByEmail(userEmail);
  }

  const normalizedStatus = String(status || lemonStatus || "").toLowerCase() || null;
  const effectiveStatus = normalizedStatus || "active";
  const isSubscribed = computeIsSubscribed({ status: effectiveStatus, lemonStatus, endsAt, eventName });
  const updatedAt = nowIso();
  const statusExpiresAt = buildStatusExpiresAt({ status: effectiveStatus, endsAt });
  const userEmailHash = await hashEmail(userEmail);

  const row = {
    lemon_subscription_id: String(lemonSubscriptionId),
    lemon_customer_id: lemonCustomerId || null,
    user_id: resolvedUserId || null,
    install_id: installId || null,
    user_email: null, // never store plaintext email; hash only
    user_email_hash: userEmailHash,
    plan_variant: variantName || null,
    product_name: productName || null,
    status: effectiveStatus,
    lemon_status: lemonStatus || null,
    is_subscribed: isSubscribed,
    source_event: eventName || null,
    status_expires_at: statusExpiresAt,
    trial_ends_at: toIso(trialEndsAt),
    renews_at: toIso(renewsAt),
    ends_at: toIso(endsAt),
    updated_at: updatedAt
  };

  const result = await sbAdminFetch(
    `/rest/v1/${SUBSCRIPTION_TABLE}?on_conflict=lemon_subscription_id`,
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(row)
    }
  );

  return Array.isArray(result) && result.length ? result[0] : null;
};

// ─── Single-source lookup ─────────────────────────────────────────────
// Lookup by user_id OR install_id. Returns the row preferring is_subscribed
// then most recent updated_at. Single row, no arbitration.
const SELECT_FIELDS = "lemon_subscription_id,lemon_customer_id,user_id,install_id,user_email_hash,plan_variant,product_name,status,lemon_status,is_subscribed,source_event,status_expires_at,trial_ends_at,renews_at,ends_at,updated_at";

export const getSubscriptionStatusForLookup = async ({ userId = null, installId = null }) => {
  // Prefer user_id match; fall back to install_id match
  if (userId) {
    const rows = await sbAdminFetch(
      `/rest/v1/${SUBSCRIPTION_TABLE}?user_id=eq.${encodeURIComponent(userId)}&select=${SELECT_FIELDS}&order=is_subscribed.desc,updated_at.desc&limit=1`
    );
    if (Array.isArray(rows) && rows.length) {
      return { ...rows[0], source: "user" };
    }
  }
  if (installId) {
    const rows = await sbAdminFetch(
      `/rest/v1/${SUBSCRIPTION_TABLE}?install_id=eq.${encodeURIComponent(installId)}&select=${SELECT_FIELDS}&order=is_subscribed.desc,updated_at.desc&limit=1`
    );
    if (Array.isArray(rows) && rows.length) {
      return { ...rows[0], source: "install" };
    }
  }
  return null;
};

// ─── Account linking — backfill user_id on existing subscription row ──
// When an install-only user signs in, find the install's subscription row
// and update its user_id column. NO new row written. Single source of truth.
export const linkInstallToUser = async ({ userId = null, installId = null }) => {
  if (!userId || !installId) return null;

  // Find the subscription row for this install
  const rows = await sbAdminFetch(
    `/rest/v1/${SUBSCRIPTION_TABLE}?install_id=eq.${encodeURIComponent(installId)}&select=${SELECT_FIELDS}&order=updated_at.desc&limit=1`
  );
  if (!Array.isArray(rows) || !rows.length) return null;
  const row = rows[0];
  if (!row.lemon_subscription_id) return null;

  // Update only user_id and updated_at
  const updated = await sbAdminFetch(
    `/rest/v1/${SUBSCRIPTION_TABLE}?lemon_subscription_id=eq.${encodeURIComponent(row.lemon_subscription_id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        user_id: userId,
        updated_at: nowIso()
      })
    }
  );

  return Array.isArray(updated) && updated.length ? updated[0] : null;
};

// ─── DEPRECATED — kept as alias for callers not yet migrated ──────────
// Old upsertSubscriptionStatus signature mapped to new function. Will be
// removed after all callers migrate.
export const upsertSubscriptionStatus = async (params) => {
  if (!params?.lemonSubscriptionId) {
    // Without lemon_subscription_id, the v2 schema cannot write a row.
    // This path was hit when subscription_created events arrived before
    // subscription_id was assigned (rare). Now: skip the write rather
    // than write to a doomed row.
    console.warn("upsertSubscriptionStatus: lemonSubscriptionId missing, skipping write", {
      eventName: params?.eventName
    });
    return [];
  }
  const row = await upsertSubscriptionByLemonId(params);
  return row ? [row] : [];
};
