#!/usr/bin/env node
// Verify every SYNC_KEYS entry actually appears elsewhere in the codebase.
// Catches typos in SYNC_KEYS edits — e.g. "stillform_chekin_today" (typo) would
// silently break sync for the real key. Surfaced May 7, 2026 after auditing 4
// new keys added to SYNC_KEYS in three rounds: typos here go undetected by
// build, lint, smoke tests, and runtime — only show up as mysterious "data
// missing on tablet" reports from users.
//
// Approach: parse SYNC_KEYS from src/App.jsx, then for each key verify it
// appears at least once OUTSIDE the SYNC_KEYS array itself (in src/App.jsx
// or netlify/functions/reframe.js).

import { readFileSync } from "node:fs";

const APP_PATH = "src/App.jsx";
const REFRAME_PATH = "netlify/functions/reframe.js";

let app;
let reframe = "";
try {
  app = readFileSync(APP_PATH, "utf8");
} catch (err) {
  console.error(`✗ Cannot read ${APP_PATH}: ${err.message}`);
  process.exit(2);
}
try {
  reframe = readFileSync(REFRAME_PATH, "utf8");
} catch {
  // reframe.js is optional context for this check — most keys live in App.jsx
}

// Pull the SYNC_KEYS array literal.
const m = app.match(/const SYNC_KEYS\s*=\s*\[([^\]]+)\]/);
if (!m) {
  console.error("✗ SYNC_KEYS array not found in src/App.jsx");
  process.exit(2);
}
const keys = [...m[1].matchAll(/"(stillform_[a-z_]+)"/g)].map((mm) => mm[1]);
if (keys.length === 0) {
  console.error("✗ SYNC_KEYS parsed but no keys extracted");
  process.exit(2);
}

// Strip the SYNC_KEYS line itself from app.jsx for the search corpus, so a
// key that ONLY appears inside SYNC_KEYS (and nowhere else) gets caught.
const appWithoutSyncKeys = app.replace(m[0], "");
const corpus = appWithoutSyncKeys + "\n" + reframe;

const orphans = keys.filter((k) => {
  // Match the key as a string literal anywhere outside SYNC_KEYS itself.
  // Use both single + double quote variants since the codebase uses both.
  const pattern = new RegExp(`["'\`]${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'\`]`);
  return !pattern.test(corpus);
});

if (orphans.length > 0) {
  console.error(`✗ ${orphans.length} SYNC_KEYS entry/entries are orphans (not referenced anywhere):`);
  for (const o of orphans) console.error(`    ${o}`);
  console.error("\n  This usually means a typo. Either fix the key in SYNC_KEYS or remove it.");
  process.exit(1);
}

console.log(`✓ All ${keys.length} SYNC_KEYS entries reference real storage keys`);
process.exit(0);
