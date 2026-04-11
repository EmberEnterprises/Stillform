import { upsertMetricsSnapshot } from "./_metricsState.js";

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
    const metricsOptIn = body?.metrics_opt_in === true;
    if (!metricsOptIn) {
      return json(400, { error: "metrics_opt_in must be true to ingest metrics" });
    }

    const installId = body?.install_id ? String(body.install_id) : null;
    const source = body?.source === "auto-daily" ? "auto-daily" : "manual";
    const snapshot = body?.snapshot && typeof body.snapshot === "object" ? body.snapshot : null;
    if (!snapshot) return json(400, { error: "snapshot is required" });

    const result = await upsertMetricsSnapshot({
      userId,
      installId,
      source,
      snapshot
    });

    return json(200, {
      ok: true,
      ingested: result.writes.length,
      metric_date: result.metricDate,
      source
    });
  } catch (err) {
    return json(500, { error: err.message || "metrics ingest failed" });
  }
}
