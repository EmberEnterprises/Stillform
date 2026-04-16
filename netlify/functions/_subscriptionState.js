import { createHash } from "node:crypto";

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

const identityKeyFrom = (kind, value) => value ? `${kind}:${String(value)}` : null;

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

const writeIdentityRow = async (identityKey, base) => {
  const rows = await sbAdminFetch(
    `/rest/v1/${SUBSCRIPTION_TABLE}?on_conflict=identity_key`,
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({
        identity_key: identityKey,
        ...base
      })
    }
  );
  return Array.isArray(rows) && rows.length ? rows[0] : null;
};

const stripLegacyEmail = async (identityKeys = []) => {
  const uniqueKeys = [...new Set(identityKeys.filter(Boolean))];
  if (!uniqueKeys.length) return;
  const encoded = uniqueKeys.map((key) => `"${String(key).replace(/"/g, '\\"')}"`).join(",");
  await sbAdminFetch(
    `/rest/v1/${SUBSCRIPTION_TABLE}?identity_key=in.(${encoded})`,
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ user_email: null })
    }
  ).catch(() => null);
};

export const upsertSubscriptionStatus = async ({
  userId = null,
  installId = null,
  lemonCustomerId = null,
  lemonSubscriptionId = null,
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
  const normalizedStatus = String(status || lemonStatus || "").toLowerCase() || null;
  const effectiveStatus = normalizedStatus || "active";
  const isSubscribed = computeIsSubscribed({ status: effectiveStatus, lemonStatus, endsAt, eventName });
  const updatedAt = nowIso();
  const statusExpiresAt = buildStatusExpiresAt({ status: effectiveStatus, endsAt });
  const normalizedEmail = normalizeEmail(userEmail);
  const userEmailHash = await hashEmail(normalizedEmail);

  const identityKeys = [
    identityKeyFrom("user", userId),
    identityKeyFrom("install", installId),
    identityKeyFrom("customer", lemonCustomerId),
    identityKeyFrom("subscription", lemonSubscriptionId)
  ].filter(Boolean);

  if (!identityKeys.length) return [];

  const base = {
    user_id: userId || null,
    install_id: installId || null,
    lemon_customer_id: lemonCustomerId || null,
    lemon_subscription_id: lemonSubscriptionId || null,
    user_email: null,
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

  const writes = [];
  for (const key of identityKeys) {
    // eslint-disable-next-line no-await-in-loop
    const row = await writeIdentityRow(key, base);
    if (row) writes.push(row);
  }
  await stripLegacyEmail(identityKeys);
  return writes;
};

const readStateByIdentity = async (identityKey) => {
  if (!identityKey) return null;
  const rows = await sbAdminFetch(
    `/rest/v1/${SUBSCRIPTION_TABLE}?identity_key=eq.${encodeURIComponent(identityKey)}&select=identity_key,user_id,install_id,lemon_customer_id,lemon_subscription_id,user_email_hash,plan_variant,product_name,status,lemon_status,is_subscribed,status_expires_at,trial_ends_at,renews_at,ends_at,updated_at&limit=1`
  );
  return Array.isArray(rows) && rows.length ? rows[0] : null;
};

const pickBestState = (states) => {
  const rows = states.filter(Boolean);
  if (!rows.length) return null;
  const active = rows.filter(r => r.is_subscribed === true);
  const pool = active.length ? active : rows;
  pool.sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime());
  return pool[0];
};

export const getSubscriptionStatusForLookup = async ({ userId = null, installId = null }) => {
  const userRow = await readStateByIdentity(identityKeyFrom("user", userId));
  const installRow = await readStateByIdentity(identityKeyFrom("install", installId));
  const winner = pickBestState([userRow, installRow]);
  if (!winner) return null;
  return {
    ...winner,
    source: winner.identity_key?.startsWith("user:") ? "user" : "install"
  };
};

export const linkInstallToUser = async ({ userId = null, installId = null }) => {
  if (!userId || !installId) return null;
  const installRow = await readStateByIdentity(identityKeyFrom("install", installId));
  if (!installRow) return null;

  const base = {
    ...installRow,
    user_id: userId,
    updated_at: nowIso()
  };
  delete base.identity_key;

  return writeIdentityRow(identityKeyFrom("user", userId), base);
};
