#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const checks = [
  { label: "Build (vite)", cmd: "npm", args: ["run", "build"] },
  { label: "Unresolved merge markers", cmd: "rg", args: ["-n", "<<<<<<<|=======|>>>>>>>", "src", "netlify", "public"], type: "merge-check" },
  { label: "Protocol launcher helper", cmd: "rg", args: ["-n", "const launchScenarioProtocolById = async", "src/App.jsx"], type: "must-match" },
  { label: "Protocol launcher controller", cmd: "rg", args: ["-n", "const launchScenarioProtocol = async", "src/App.jsx"], type: "must-match" },
  { label: "Morning protocol launch call", cmd: "rg", args: ["-n", "await launchScenarioProtocol\\(recommendedProtocol\\.id\\)", "src/App.jsx"], type: "must-match" },
  { label: "Integration adapter usage", cmd: "rg", args: ["-n", "getIntegrationContext\\(|calendarContext: integrationContext\\.calendarContext|healthContext: integrationContext\\.healthContext", "src/App.jsx"], type: "must-match" },
  { label: "Share card and PDF export present", cmd: "rg", args: ["-n", "Shareable composure card|Export PDF|Composure Card PDF Export", "src/App.jsx"], type: "must-match" }
];

let failed = false;

const run = ({ label, cmd, args, type = "default" }) => {
  process.stdout.write(`\n== ${label} ==\n`);
  const res = spawnSync(cmd, args, { stdio: "inherit", shell: false });
  if (type === "merge-check") {
    // rg exits 0 when matches found, 1 when no matches, 2+ on errors.
    if (res.status === 1) {
      process.stdout.write(`\n✓ ${label} passed\n`);
      return;
    }
    failed = true;
    process.stdout.write(`\n✗ ${label} failed\n`);
    return;
  }
  if (type === "must-match") {
    if (res.status === 0) {
      process.stdout.write(`\n✓ ${label} passed\n`);
      return;
    }
    failed = true;
    process.stdout.write(`\n✗ ${label} failed\n`);
    return;
  }
  if (res.status === 0) {
    process.stdout.write(`\n✓ ${label} passed\n`);
    return;
  }
  failed = true;
  process.stdout.write(`\n✗ ${label} failed\n`);
};

checks.forEach(run);

if (failed) {
  process.stdout.write("\nSHIP preflight: FAILED\n");
  process.exit(1);
}

process.stdout.write("\nSHIP preflight: PASSED\n");
