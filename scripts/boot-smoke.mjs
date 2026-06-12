/*
 * boot-smoke.mjs — the blank-screen guard (Arlin, June 2 2026).
 *
 * `vite build` passing does NOT mean the app boots: a module-evaluation
 * error (TDZ, circular import) compiles fine and renders nothing — the
 * ErrorBoundary lives inside React, so it never catches pre-mount
 * crashes. That exact failure shipped on June 2 (FAQ.jsx module-level
 * array referencing a const declared below it) and blanked Arlin's
 * deploy. This guard makes that class of failure unshippable.
 *
 * What it does: serves dist/ on a local port, loads it in a real
 * headless Chromium, and FAILS unless React mounts (#root populated)
 * with zero page errors.
 *
 * Browser resolution (keeps CI fast — no chromium download):
 *   1. puppeteer-core + system Chrome (PUPPETEER_EXECUTABLE_PATH, or
 *      the well-known paths on GitHub ubuntu runners)
 *   2. full puppeteer if installed locally (dev machines)
 *
 * Usage: node scripts/boot-smoke.mjs   (after `npm run build`)
 */

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const DIST = new URL("../dist", import.meta.url).pathname;
const PORT = 8123;

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
};

function serveDist() {
  const server = createServer(async (req, res) => {
    try {
      const path = normalize(decodeURIComponent((req.url || "/").split("?")[0]));
      let file = join(DIST, path === "/" ? "index.html" : path);
      if (!existsSync(file)) file = join(DIST, "index.html"); // SPA fallback
      const body = await readFile(file);
      res.writeHead(200, { "Content-Type": MIME[extname(file)] || "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(500);
      res.end();
    }
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

async function launchBrowser() {
  const args = ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"];
  // 1. puppeteer-core + system Chrome (CI path — GitHub runners ship Chrome)
  try {
    const { default: core } = await import("puppeteer-core");
    const candidates = [
      process.env.PUPPETEER_EXECUTABLE_PATH,
      "/usr/bin/google-chrome",
      "/usr/bin/google-chrome-stable",
      "/usr/bin/chromium-browser",
      "/usr/bin/chromium",
    ].filter(Boolean);
    for (const p of candidates) {
      if (existsSync(p)) return core.launch({ executablePath: p, args });
    }
  } catch {
    /* puppeteer-core not installed — try full puppeteer */
  }
  // 2. full puppeteer (local dev)
  const { default: puppeteer } = await import("puppeteer");
  return puppeteer.launch({ args });
}

const server = await serveDist();
let failed = false;
try {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));

  await page
    .goto(`http://localhost:${PORT}/`, { waitUntil: "domcontentloaded", timeout: 30000 })
    .catch((e) => pageErrors.push(`navigation: ${e.message}`));
  await new Promise((r) => setTimeout(r, 4000));

  const rootLen = await page
    .evaluate(() => document.querySelector("#root")?.innerHTML.length ?? -1)
    .catch(() => -1);

  console.log("== Boot smoke (blank-screen guard) ==");
  console.log(`  #root innerHTML length: ${rootLen}`);
  if (pageErrors.length) {
    console.log("  page errors:");
    for (const e of pageErrors) console.log(`    ✗ ${e}`);
  } else {
    console.log("  page errors: none");
  }

  if (rootLen < 50 || pageErrors.length > 0) {
    failed = true;
    console.error("Boot smoke: FAILED — the built app does not boot cleanly (blank-screen class).");
  } else {
    console.log("Boot smoke: PASSED — app mounts with zero page errors.");
  }
  await browser.close();
} catch (e) {
  failed = true;
  console.error(`Boot smoke: FAILED to run (${e.message})`);
} finally {
  server.close();
}
process.exit(failed ? 1 : 0);
