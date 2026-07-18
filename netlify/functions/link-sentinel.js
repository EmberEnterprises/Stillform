/**
 * link-sentinel — THE LINK SENTINEL (Arlin 2026-07-09, ships with wave one).
 *
 * A scheduled function that checks every first-party /go/ redirect target and,
 * on failure, does the three things the policy requires:
 *   (a) the user is already protected — the /go/ route degrades to a graceful
 *       in-app sunset page (handled at the route layer, see go-redirect handling);
 *       this function's job is detection + alerting, not the user-facing fallback.
 *   (b) Arlin is informed on the dashboard she already checks — a Plausible event
 *       `link_broken` (with the target id) is sent server-side, zero new infra.
 *   (c) the failure is logged (function logs) for the record; the permanent fix
 *       is a one-line edit to the /go/ registry in netlify.toml.
 *
 * Cadence is set in netlify.toml. Crisis targets are checked more often than the
 * rest — a dead crisis link is the one breakage that can't wait.
 *
 * This reuses the SAME target-parsing the build-time check-links gate uses, so
 * the runtime sentinel and the build gate never disagree about what a target is.
 */

import fs from "node:fs";
import path from "node:path";

// Targets whose breakage is urgent — checked on the fast cadence and flagged
// distinctly. Matched by the /go/ id (the part after /go/).
const CRISIS_IDS = new Set(["helpline", "helpline-am", "cvv", "crisis-text", "988"]);

const PLAUSIBLE_DOMAIN = "stillformapp.com";
const PLAUSIBLE_ENDPOINT = "https://plausible.io/api/event";

/** Parse every /go/ -> http target out of netlify.toml (same shape as check-links). */
function readGoTargets() {
  let toml = "";
  try {
    toml = fs.readFileSync(path.join(process.cwd(), "netlify.toml"), "utf-8");
  } catch {
    return [];
  }
  const targets = [];
  const blocks = toml.split("[[redirects]]").slice(1);
  for (const b of blocks) {
    const from = (b.match(/from\s*=\s*"([^"]+)"/) || [])[1];
    const to = (b.match(/to\s*=\s*"([^"]+)"/) || [])[1];
    if (from && from.startsWith("/go/") && to && to.startsWith("http")) {
      targets.push({ id: from.slice("/go/".length), from, to });
    }
  }
  return targets;
}

/** Send a server-side Plausible event so it lands on the dashboard Arlin checks. */
async function reportBroken(id, status) {
  try {
    await fetch(PLAUSIBLE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Plausible requires a UA + a name; these identify the server pinger.
        "User-Agent": "stillform-link-sentinel",
      },
      body: JSON.stringify({
        name: "link_broken",
        url: `https://${PLAUSIBLE_DOMAIN}/go/${id}`,
        domain: PLAUSIBLE_DOMAIN,
        props: { target: id, status: String(status) },
      }),
    });
  } catch (e) {
    // Alerting is best-effort — a failed ping must never crash the sentinel.
    console.error(`link-sentinel: Plausible report failed for ${id}: ${e && e.name}`);
  }
}

async function checkOne(target) {
  try {
    const res = await fetch(target.to, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    return { ...target, ok: res.status < 400, status: res.status };
  } catch (e) {
    return { ...target, ok: false, status: (e && e.name) || "unreachable" };
  }
}

export async function handler(event) {
  // The scheduled invocation may pass a cadence hint (?scope=crisis|all).
  const scope = (event && event.queryStringParameters && event.queryStringParameters.scope) || "all";
  const all = readGoTargets();
  const targets = scope === "crisis" ? all.filter((t) => CRISIS_IDS.has(t.id)) : all;

  if (targets.length === 0) {
    console.log("link-sentinel: no /go/ targets to check.");
    return { statusCode: 200, body: JSON.stringify({ checked: 0, broken: [] }) };
  }

  const results = await Promise.all(targets.map(checkOne));
  const broken = results.filter((r) => !r.ok);

  for (const b of broken) {
    // (c) logged, and (b) reported to the dashboard.
    console.error(`link-sentinel: BROKEN ${b.from} -> ${b.to} (${b.status})${CRISIS_IDS.has(b.id) ? " [CRISIS]" : ""}`);
    await reportBroken(b.id, b.status);
  }
  if (!broken.length) console.log(`link-sentinel: all ${targets.length} target(s) healthy (scope=${scope}).`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      checked: targets.length,
      broken: broken.map((b) => ({ id: b.id, status: b.status, crisis: CRISIS_IDS.has(b.id) })),
    }),
  };
}

// Exported for the contract test — pure logic, no network.
export { readGoTargets as _readGoTargets, CRISIS_IDS as _CRISIS_IDS };
