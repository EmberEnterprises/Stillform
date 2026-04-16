import process from "node:process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://pxrewildfnbxlygjofpx.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4cmV3aWxkZm5ieGx5Z2pvZnB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTAxMDcsImV4cCI6MjA5MTMyNjEwN30.r3Pdm3XoZVPlUFgKCPLtfkSrHKIxVcwFW4tuUP23Vns";
const FUNCTION_BASE = process.env.SECURITY_SMOKE_FUNCTION_BASE_URL || "";
const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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

const readRelative = async (relPath) => {
  const full = path.join(ROOT_DIR, relPath);
  return fs.readFile(full, "utf8");
};

const probeStaticSecurityPosture = async () => {
  console.log("== Static security posture smoke ==");

  const functionFiles = [
    "netlify/functions/reframe.js",
    "netlify/functions/metrics-ingest.js",
    "netlify/functions/uat-feedback.js",
    "netlify/functions/subscription-link-account.js",
    "netlify/functions/subscription-status.js",
    "netlify/functions/subscription-webhook.js",
    "netlify/functions/_httpSecurity.js"
  ];

  for (const rel of functionFiles) {
    const src = await readRelative(rel);
    assert(!src.includes("Access-Control-Allow-Origin\": \"*\""), `${rel}: wildcard CORS detected`);
  }
  console.log("  ✓ No wildcard CORS headers in function sources");

  const protectedEndpoints = [
    "netlify/functions/metrics-ingest.js",
    "netlify/functions/subscription-link-account.js",
    "netlify/functions/subscription-status.js",
    "netlify/functions/uat-feedback.js"
  ];
  for (const rel of protectedEndpoints) {
    const src = await readRelative(rel);
    assert(src.includes("rejectDisallowedOrigin"), `${rel}: missing rejectDisallowedOrigin`);
  }
  console.log("  ✓ Protected endpoints enforce origin allowlist checks");

  const sqlFiles = [
    "netlify/functions/_metricsSetup.sql",
    "netlify/functions/_subscriptionSetup.sql",
    "netlify/functions/_uatFeedbackSetup.sql",
    "netlify/functions/_securityHardening.sql"
  ];
  for (const rel of sqlFiles) {
    const src = (await readRelative(rel)).toLowerCase();
    assert(src.includes("enable row level security"), `${rel}: missing RLS enable statement`);
  }
  console.log("  ✓ SQL setup files include explicit RLS enablement");
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
  if (!FUNCTION_BASE) {
    console.log("== Function auth + CORS smoke ==");
    console.log("  • Skipped runtime checks (SECURITY_SMOKE_FUNCTION_BASE_URL not set)");
    return;
  }

  console.log("== Function auth + CORS smoke ==");
  const badOrigin = "https://evil.example";

  const metricsBlocked = await fetchJson(`${FUNCTION_BASE}/.netlify/functions/metrics-ingest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: badOrigin
    },
    body: JSON.stringify({})
  });
  assert(metricsBlocked.res.status === 403, `metrics-ingest expected 403 for bad origin, got ${metricsBlocked.res.status}`);
  console.log("  ✓ metrics-ingest rejects disallowed origin");

  const metricsUnauthorized = await fetchJson(`${FUNCTION_BASE}/.netlify/functions/metrics-ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  assert(metricsUnauthorized.res.status === 401, `metrics-ingest expected 401 unauthenticated, got ${metricsUnauthorized.res.status}`);
  console.log("  ✓ metrics-ingest rejects unauthenticated requests");

  const linkUnauthorized = await fetchJson(`${FUNCTION_BASE}/.netlify/functions/subscription-link-account`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ install_id: "security-smoke" })
  });
  assert(linkUnauthorized.res.status === 401, `subscription-link-account expected 401 unauthenticated, got ${linkUnauthorized.res.status}`);
  console.log("  ✓ subscription-link-account rejects unauthenticated requests");

  const statusPublic = await fetchJson(`${FUNCTION_BASE}/.netlify/functions/subscription-status`);
  assert(statusPublic.res.status === 200, `subscription-status expected 200, got ${statusPublic.res.status}`);
  assert(statusPublic.data?.is_subscribed === false, "subscription-status expected is_subscribed false for public request");
  console.log("  ✓ subscription-status safe public response");
};

const main = async () => {
  await probeStaticSecurityPosture();
  await probeSupabaseAnonRead();
  await probeFunctionAuthAndCors();
  console.log("Security smoke: PASSED");
};

main().catch((err) => {
  console.error("Security smoke: FAILED");
  console.error(err.message || err);
  process.exitCode = 1;
});
