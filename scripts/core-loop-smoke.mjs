#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { runPortableRipgrep } from "./_patternChecks.mjs";

const checks = [
  {
    label: "Morning check-in launches reframe",
    pattern: "Set my tone and launch",
    path: "src/App.jsx"
  },
  {
    label: "Reframe saves pre/post ratings",
    pattern: "preRating|postRating|delta",
    path: "src/App.jsx"
  },
  {
    label: "Post-rating insight loop present",
    pattern: "showPostInsight|getLatestUserFacingInsight|Post Session Insight Shown",
    path: "src/App.jsx"
  },
  {
    label: "My Progress insight section present",
    pattern: "What the AI has noticed|aiUserFacingInsights",
    path: "src/App.jsx"
  },
  {
    label: "Pulse export action wired",
    pattern: "exportPulseLogPdf|Pulse PDF Exported",
    path: "src/App.jsx"
  },
  {
    label: "Session CSV export action wired",
    pattern: "exportSessionHistoryCsv|Session CSV Exported",
    path: "src/App.jsx"
  },
  {
    label: "Metrics-only telemetry controls present",
    pattern: "Performance metrics \\(counts \\+ rates only\\)|metrics-ingest|METRICS_OPT_IN_KEY",
    path: "src/App.jsx"
  }
];

let failed = false;

for (const check of checks) {
  process.stdout.write(`\n== ${check.label} ==\n`);
  const res = runPortableRipgrep(["-n", check.pattern, check.path]);
  if (res.status !== 0) {
    failed = true;
    process.stdout.write(`\n✗ ${check.label} failed\n`);
  } else {
    process.stdout.write(`\n✓ ${check.label} passed\n`);
  }
}

process.stdout.write("\n== Build stamp readability ==\n");
try {
  const src = readFileSync("src/App.jsx", "utf8");
  const hasBuildStamp = src.includes("Build");
  if (!hasBuildStamp) {
    failed = true;
    process.stdout.write("\n✗ Build stamp readability failed\n");
  } else {
    process.stdout.write("\n✓ Build stamp readability passed\n");
  }
} catch {
  failed = true;
  process.stdout.write("\n✗ Build stamp readability failed\n");
}

if (failed) {
  process.stdout.write("\nCore loop smoke: FAILED\n");
  process.exit(1);
}

process.stdout.write("\nCore loop smoke: PASSED\n");
