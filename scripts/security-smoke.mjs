import process from "node:process";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://pxrewildfnbxlygjofpx.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4cmV3aWxkZm5ieGx5Z2pvZnB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTAxMDcsImV4cCI6MjA5MTMyNjEwN30.r3Pdm3XoZVPlUFgKCPLtfkSrHKIxVcwFW4tuUP23Vns";
const PREVIEW_BASE = process.env.SECURITY_SMOKE_BASE_URL || "http://localhost:4173";

const TABLES = [
  "user_data",
  "backups",
  "user_profiles",
  "stillform_uat_feedback",
  "stillform_metrics_daily",
  "stillform_subscription_state"
];

const fail = (message) => {
  throw new Error(message);
};

const assert = (condition, message) => {
  if (!condition) fail(message);
};

const fetchJson = async (url, opts = {}) => {
  const res = await fetch(url, opts);
  const text = await res.text().catch(() => "");
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  return { res, text, data };
};

const probeSupabaseAnonRead = async () => {
  console.log("== Supabase anon table access smoke ==");
  for (const table of TABLES) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`;
    const { res, data } = await fetchJson(url, {
      method: "GET",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    const isArray = Array.isArray(data);
    assert(res.status === 200 || res.status === 401 || res.status === 403, `${table}: unexpected status ${res.status}`);
    if (res.status === 200) {
      assert(isArray, `${table}: expected array response for status 200`);
      assert(data.length === 0, `${table}: anon read returned rows (${data.length})`);
    }
    console.log(`  ✓ ${table}: status ${res.status}${res.status === 200 ? " (empty)" : ""}`);
  }
};

const probeFunctionAuthAndCors = async () => {
  console.log("== Function auth + CORS smoke ==");
  const badOrigin = "https://evil.example";

  const metricsBlocked = await fetchJson(`${PREVIEW_BASE}/.netlify/functions/metrics-ingest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: badOrigin
    },
    body: JSON.stringify({})
  });
  assert(metricsBlocked.res.status === 403, `metrics-ingest expected 403 for bad origin, got ${metricsBlocked.res.status}`);
  console.log("  ✓ metrics-ingest rejects disallowed origin");

  const metricsUnauthorized = await fetchJson(`${PREVIEW_BASE}/.netlify/functions/metrics-ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  assert(metricsUnauthorized.res.status === 401, `metrics-ingest expected 401 unauthenticated, got ${metricsUnauthorized.res.status}`);
  console.log("  ✓ metrics-ingest rejects unauthenticated requests");

  const linkUnauthorized = await fetchJson(`${PREVIEW_BASE}/.netlify/functions/subscription-link-account`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ install_id: "security-smoke" })
  });
  assert(linkUnauthorized.res.status === 401, `subscription-link-account expected 401 unauthenticated, got ${linkUnauthorized.res.status}`);
  console.log("  ✓ subscription-link-account rejects unauthenticated requests");

  const statusPublic = await fetchJson(`${PREVIEW_BASE}/.netlify/functions/subscription-status`);
  assert(statusPublic.res.status === 200, `subscription-status expected 200, got ${statusPublic.res.status}`);
  assert(statusPublic.data?.is_subscribed === false, "subscription-status expected is_subscribed false for public request");
  console.log("  ✓ subscription-status safe public response");
};

const main = async () => {
  await probeSupabaseAnonRead();
  await probeFunctionAuthAndCors();
  console.log("Security smoke: PASSED");
};

main().catch((err) => {
  console.error("Security smoke: FAILED");
  console.error(err.message || err);
  process.exitCode = 1;
});
