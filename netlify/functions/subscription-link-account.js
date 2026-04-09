import { upsertSubscriptionStatus, getSubscriptionStatusForLookup } from "./_subscriptionState.js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://pxrewildfnbxlygjofpx.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
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
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const token = parseBearer(event.headers?.authorization || event.headers?.Authorization || "");
    const user = await getUserFromToken(token);
    const userId = user?.id || null;
    if (!userId) return json(401, { error: "Unauthorized" });

    const body = JSON.parse(event.body || "{}");
    const installId = body?.install_id || null;
    if (!installId) return json(400, { error: "install_id is required" });

    const existing = await getSubscriptionStatusForLookup({ installId });
    if (!existing) {
      return json(200, { ok: true, linked: false, reason: "no_install_record" });
    }

    await upsertSubscriptionStatus({
      userId,
      installId,
      lemonCustomerId: existing.lemon_customer_id || null,
      lemonSubscriptionId: existing.lemon_subscription_id || null,
      lemonStatus: existing.lemon_status || null,
      status: existing.status || null,
      userEmail: user.email || existing.user_email || null,
      variantName: existing.plan_variant || null,
      productName: existing.product_name || null,
      eventName: "account_linked",
      trialEndsAt: existing.trial_ends_at || null,
      renewsAt: existing.renews_at || null,
      endsAt: existing.ends_at || null
    });

    return json(200, { ok: true, linked: true });
  } catch (err) {
    return json(500, { error: err.message || "Subscription linking failed" });
  }
}
