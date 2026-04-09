import { getSubscriptionStatusForLookup } from "./_subscriptionState.js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://pxrewildfnbxlygjofpx.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, OPTIONS"
    },
    body: JSON.stringify(body)
  };
}

function parseBearer(authHeader) {
  if (!authHeader || typeof authHeader !== "string") return null;
  const [type, token] = authHeader.trim().split(/\s+/);
  if (!type || !token || type.toLowerCase() !== "bearer") return null;
  return token;
}

async function getUserFromToken(accessToken) {
  if (!accessToken) return null;
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: "GET",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });

  try {
    const installId = event.queryStringParameters?.install_id || null;
    const token = parseBearer(event.headers?.authorization || event.headers?.Authorization || "");
    const user = await getUserFromToken(token);
    const userId = user?.id || null;

    if (!userId && !installId) {
      return json(200, {
        ok: true,
        is_subscribed: false,
        source: "none"
      });
    }

    const record = await getSubscriptionStatusForLookup({ userId, installId });
    if (!record) {
      return json(200, {
        ok: true,
        is_subscribed: false,
        source: "none",
        user_id: userId,
        install_id: installId
      });
    }

    const normalizedStatus = String(record.status || "").toLowerCase();
    const statusExpiry = record.status_expires_at ? new Date(record.status_expires_at).getTime() : null;
    const inGrace = Number.isFinite(statusExpiry) && statusExpiry > Date.now();
    const effectiveSubscribed = (() => {
      if (normalizedStatus === "inactive") return false;
      if (normalizedStatus === "expired") return false;
      if (normalizedStatus === "paused") return false;
      if (normalizedStatus === "unpaid") return false;
      if (normalizedStatus === "cancelled") return Boolean(inGrace);
      return Boolean(record.is_subscribed);
    })();

    return json(200, {
      ok: true,
      is_subscribed: effectiveSubscribed,
      source: record.source || (record.user_id ? "user" : "install"),
      status: record.status || null,
      status_expires_at: record.status_expires_at || null,
      trial_ends_at: record.trial_ends_at || null,
      user_id: userId,
      install_id: installId
    });
  } catch (err) {
    return json(500, { error: err.message || "Subscription status failed" });
  }
}
