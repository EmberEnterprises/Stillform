// check-links.mjs — the link-policy gate (Arlin's directive, 2026-07-08).
//
// THE LINK POLICY: the app never ships raw external links — everything
// outbound rides the first-party /go/ layer in netlify.toml. This gate
// enforces both halves:
//   1. ZERO raw external hrefs in src/v2 (the app links only to itself).
//   2. Every /go/ target in netlify.toml actually RESOLVES (HEAD/GET < 400,
//      following redirects). A dead target fails the build, not the user.
//      Crisis links are the highest-stakes case — this gate exists for them.
//
// Run: node scripts/check-links.mjs   (network required for half 2; use
// --static to run half 1 only, e.g. in offline environments)

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const STATIC_ONLY = process.argv.includes("--static");
let failed = false;

/* ── Half 1: no raw externals in the app ── */
const RAW = /https?:\/\/(?!stillformapp\.com)[a-zA-Z0-9./_-]+/g;
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".jsx")) out.push(p);
  }
  return out;
}
for (const f of walk("src/v2")) {
  const src = readFileSync(f, "utf-8");
  for (const line of src.split("\n")) {
    const t = line.trim();
    if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) continue; // comments may cite URLs
    const hits = t.match(RAW);
    if (hits) {
      for (const h of hits) {
        console.error(`FAIL raw external link in app: ${f}: ${h}`);
        failed = true;
      }
    }
  }
}
if (!failed) console.log("PASS half 1 — zero raw external links in src/v2.");

/* ── Half 2: every /go/ target resolves ── */
if (!STATIC_ONLY) {
  const toml = readFileSync("netlify.toml", "utf-8");
  const targets = [];
  const blocks = toml.split("[[redirects]]").slice(1);
  for (const b of blocks) {
    const from = (b.match(/from\s*=\s*"([^"]+)"/) || [])[1];
    const to = (b.match(/to\s*=\s*"([^"]+)"/) || [])[1];
    if (from && from.startsWith("/go/") && to && to.startsWith("http")) targets.push({ from, to });
  }
  if (targets.length === 0) console.log("half 2 — no /go/ targets yet.");
  for (const { from, to } of targets) {
    try {
      const res = await fetch(to, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(10000) });
      if (res.status >= 400) {
        console.error(`FAIL /go/ target dead: ${from} -> ${to} (HTTP ${res.status})`);
        failed = true;
      } else {
        console.log(`PASS ${from} -> ${to} (HTTP ${res.status})`);
      }
    } catch (e) {
      console.error(`FAIL /go/ target unreachable: ${from} -> ${to} (${e.name})`);
      failed = true;
    }
  }
}

if (failed) {
  console.error("\nRESULT: FAIL — the link policy is violated. Fix the /go/ layer or the raw link before shipping.");
  process.exit(1);
}
console.log("\nRESULT: PASS — the link policy holds.");
