import { upsertMetricsSnapshot } from "./_metricsState.js";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

const CORS_OPTIONS = { methods: "POST, OPTIONS" };
const MAX_BODY_CHARS = 25000;

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return jsonResponse(event, 200, { ok: true }, CORS_OPTIONS);
  if (event.httpMethod !== "POST") return jsonResponse(event, 405, { error: "Method not allowed" }, CORS_OPTIONS);

  const originBlocked = rejectDisallowedOrigin(event, CORS_OPTIONS);
  if (originBlocked) return originBlocked;

  try {
    if ((event.body || "").length > MAX_BODY_CHARS) {
      return jsonResponse(event, 413, { error: "Payload too large" }, CORS_OPTIONS);
    }

    const token = parseBearer(event.headers?.authorization || event.headers?.Authorization || "");
    const user = await getUserFromToken(token);
    const userId = user?.id || null;
    if (!userId) return jsonResponse(event, 401, { error: "Unauthorized" }, CORS_OPTIONS);

    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return jsonResponse(event, 400, { error: "Invalid JSON body" }, CORS_OPTIONS);
    }
    const metricsOptIn = body?.metrics_opt_in === true;
    if (!metricsOptIn) {
      return jsonResponse(event, 400, { error: "metrics_opt_in must be true to ingest metrics" }, CORS_OPTIONS);
    }

    const installId = body?.install_id ? String(body.install_id) : null;
    const source = body?.source === "auto-daily" ? "auto-daily" : "manual";
    const snapshot = body?.snapshot && typeof body.snapshot === "object" ? body.snapshot : null;
    if (!snapshot) return jsonResponse(event, 400, { error: "snapshot is required" }, CORS_OPTIONS);

    const result = await upsertMetricsSnapshot({
      userId,
      installId,
      source,
      snapshot
    });

    return jsonResponse(event, 200, {
      ok: true,
      ingested: result.writes.length,
      metric_date: result.metricDate,
      source
    }, CORS_OPTIONS);
  } catch (error) {
    console.error("metrics-ingest-failed", { message: error?.message || "unknown" });
    return jsonResponse(event, 500, { error: "Metrics ingest failed" }, CORS_OPTIONS);
  }
}
