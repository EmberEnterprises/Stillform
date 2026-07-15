/**
 * boot-static — headless boot verification without a browser (2026-07-15).
 *
 * The puppeteer boot-smoke can't run in every environment. This is the
 * outside-the-box replacement: it verifies the two things that actually
 * white-screen a route, statically, from the built output —
 *   1. Every React.lazy(import("...")) path in AppV2 resolves to a real file.
 *   2. Every one of those modules is present as a built chunk in dist/ (proving
 *      Vite compiled it — a module that fails to compile never emits a chunk).
 *
 * Run AFTER `npm run build`. Exit 1 on any gap. Not a full runtime mount, but
 * it catches the entire class of "lazy route broke the build silently."
 */
import fs from "node:fs";
import path from "node:path";

const appSrc = fs.readFileSync("src/v2/AppV2.jsx", "utf8");
const lazyPaths = [...appSrc.matchAll(/React\.lazy\(\(\)\s*=>\s*import\("([^"]+)"\)\)/g)].map((m) => m[1]);

let failures = 0;

// 1. source paths resolve
for (const p of lazyPaths) {
  const abs = path.resolve("src/v2", p);
  if (!fs.existsSync(abs) && !fs.existsSync(abs + ".jsx")) {
    console.log(`  MISSING SOURCE: ${p}`);
    failures++;
  }
}

// 2. each lazy screen emitted a chunk (dist must exist — run after build)
const distAssets = "dist/assets";
if (!fs.existsSync(distAssets)) {
  console.log("  dist/assets missing — run `npm run build` first");
  process.exit(1);
}
const chunks = fs.readdirSync(distAssets).filter((f) => f.endsWith(".js"));
for (const p of lazyPaths) {
  const base = path.basename(p).replace(/\.jsx$/, "");
  // Vite names lazy chunks after the module; confirm a chunk carries the name.
  const hit = chunks.some((c) => c.startsWith(base + "-") || c.includes(base));
  if (!hit) {
    console.log(`  NO CHUNK EMITTED: ${p} (expected a ${base}-*.js chunk)`);
    failures++;
  }
}

console.log(`boot-static: ${lazyPaths.length} lazy routes checked, ${failures} failure(s)`);
if (failures) {
  console.log("RESULT: FAIL — a lazy route would not load.");
  process.exit(1);
}
console.log("RESULT: PASS — every lazy route resolves and emitted a chunk.");
