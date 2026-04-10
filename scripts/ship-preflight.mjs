#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const checks = [
  { label: "Build (vite)", cmd: "npm", args: ["run", "build"] },
  { label: "Unresolved merge markers", cmd: "rg", args: ["-n", "<<<<<<<|=======|>>>>>>>", "src", "netlify", "public"], type: "merge-check" },
  { label: "Deck uses universal audience framing", cmd: "rg", args: ["-n", "for everyone|composure infrastructure for everyone|composure is a universal skill", "public/uat-roadmap.html"], type: "must-match" },
  { label: "Deck avoids high-pressure-only framing", cmd: "rg", args: ["-n", "high-pressure|high pressure|high-consequence", "public/uat-roadmap.html"], type: "must-not-match" },
  { label: "Deck avoids niche-only category labels", cmd: "rg", args: ["-n", "Executive Composure", "public/uat-roadmap.html"], type: "must-not-match" },
  { label: "Protocol launcher helper", cmd: "rg", args: ["-n", "const launchScenarioProtocolById = async", "src/App.jsx"], type: "must-match" },
  { label: "Protocol launcher controller", cmd: "rg", args: ["-n", "const launchScenarioProtocol = async", "src/App.jsx"], type: "must-match" },
  { label: "Morning protocol launch call", cmd: "rg", args: ["-n", "await launchScenarioProtocol\\(recommendedProtocol\\.id\\)", "src/App.jsx"], type: "must-match" },
  { label: "Integration adapter usage", cmd: "rg", args: ["-n", "getIntegrationContext\\(|calendarContext: integrationContext\\.calendarContext|healthContext: integrationContext\\.healthContext", "src/App.jsx"], type: "must-match" },
  { label: "Integration diagnostics controls", cmd: "rg", args: ["-n", "clearIntegrationContextCache|Refresh status|Clear stale context|hasStale", "src/App.jsx"], type: "must-match" },
  { label: "Integration consent and revoke controls", cmd: "rg", args: ["-n", "INTEGRATION_STORAGE_KEYS|setIntegrationConsent|retryIntegrationContext|Enable calendar|Enable health|Revoke calendar|Revoke health", "src/App.jsx"], type: "must-match" },
  { label: "Integration error and retry visibility", cmd: "rg", args: ["-n", "calendarError|healthError|Calendar retry queued|Health retry queued|Clear calendar error|Clear health error", "src/App.jsx"], type: "must-match" },
  { label: "Daily loop adherence telemetry", cmd: "rg", args: ["-n", "appendDailyLoopHistory|stillform_checkin_history|stillform_eod_history|Loop completion \\(14d\\)", "src/App.jsx"], type: "must-match" },
  { label: "Loop intervention nudge controls", cmd: "rg", args: ["-n", "LOOP_NUDGE_MIN_OPENS|LOOP_NUDGE_DROPOFF_THRESHOLD|Loop reliability nudge|stillform_loop_nudge_dismissed_day", "src/App.jsx"], type: "must-match" },
  { label: "Loop nudge effectiveness telemetry", cmd: "rg", args: ["-n", "LOOP_NUDGE_EVENTS_KEY|Loop Nudge Shown|Loop Nudge Actioned|Loop Nudge Dismissed|Nudge recovery \\(14d\\)", "src/App.jsx"], type: "must-match" },
  { label: "Adaptive loop nudge sensitivity", cmd: "rg", args: ["-n", "LOOP_NUDGE_DROPOFF_THRESHOLD_LOWER_BOUND|LOOP_NUDGE_DROPOFF_THRESHOLD_UPPER_BOUND|adaptiveDropoffThreshold|adaptiveMinOpens|Adaptive nudge sensitivity", "src/App.jsx"], type: "must-match" },
  { label: "Subscription diagnostics controls", cmd: "rg", args: ["-n", "refreshSubscriptionStatus|Subscription status|Refresh status \\(server\\)|PENDING WEBHOOK", "src/App.jsx"], type: "must-match" },
  { label: "Cloud restore controls", cmd: "rg", args: ["-n", "Restore now|Restoring\\.|Restored .* items from cloud|setSyncFeedbackWithClear", "src/App.jsx"], type: "must-match" },
  { label: "Sync auth cooldown guard", cmd: "rg", args: ["-n", "syncAuthCooldownSeconds|startSyncAuthCooldown|Too many attempts\\. Please wait", "src/App.jsx"], type: "must-match" },
  { label: "Auth fallback safety guard", cmd: "rg", args: ["-n", "isInvalidCredentialsMessage|Incorrect email or password\\. Please try again\\.", "src/App.jsx"], type: "must-match" },
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
  if (type === "must-not-match") {
    // rg exits 0 when matches found, 1 when no matches, 2+ on errors.
    if (res.status === 1) {
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
