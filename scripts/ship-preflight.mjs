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
  { label: "Integration adapter usage", cmd: "rg", args: ["-n", "resolveIntegrationContext\\(|calendarContext: integrationContext\\.calendarContext|healthContext: integrationContext\\.healthContext", "src/App.jsx"], type: "must-match" },
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
  { label: "Pulse rotating prompts", cmd: "rg", args: ["-n", "What triggered this\\?|What were you about to do\\?|Who was involved\\?|openNewPulseEntry", "src/App.jsx"], type: "must-match" },
  { label: "Contextual first-time tips", cmd: "rg", args: ["-n", "showHomeContextTip|showPulseContextTip|stillform_tooltip_home_seen|stillform_tooltip_pulse_seen", "src/App.jsx"], type: "must-match" },
  { label: "Tutorial opening lock copy", cmd: "rg", args: ["-n", "Composure is a full-spectrum practice\\.|Stillform\\. Composure Architecture\\.", "src/App.jsx"], type: "must-match" },
  { label: "Tutorial FAQ guidance sentence", cmd: "rg", args: ["-n", "If you want to know more about the app, please go to our FAQ page\\.", "src/App.jsx"], type: "must-match" },
  { label: "Tutorial FAQ button removed", cmd: "rg", args: ["-n", "openFaq\\(\"tutorial\"\\)", "src/App.jsx"], type: "must-not-match" },
  { label: "Combined setup profile flow", cmd: "rg", args: ["-n", "Signal Profile \\+ Blind Spots|setupFlow: \"calibration-combined\"", "src/App.jsx"], type: "must-match" },
  { label: "Tutorial multi-page progression", cmd: "rg", args: ["-n", "Tutorial · 1 of 5|Tutorial · 2 of 5|Tutorial · 3 of 5|Tutorial · 4 of 5|Tutorial · 5 of 5", "src/App.jsx"], type: "must-match" },
  { label: "Tutorial page titles locked", cmd: "rg", args: ["-n", "title: \"Calibration — Build Your Baseline\"|title: \"Morning Check-In — Set the Day’s Baseline\"|title: \"Daily Regulation Tools — Active Execution Layer\"|title: \"End-of-Day + My Progress — Evidence Layer\"|title: \"Run the Full Loop Daily\"", "src/App.jsx"], type: "must-match" },
  { label: "Tutorial CTA progression locked", cmd: "rg", args: ["-n", "Next →|Begin calibration →|Return to settings", "src/App.jsx"], type: "must-match" },
  { label: "FAQ method and science entries", cmd: "rg", args: ["-n", "What is the method behind Stillform\\?|What science basis does Stillform use\\?", "src/App.jsx"], type: "must-match" },
  { label: "FAQ method and science answers", cmd: "rg", args: ["-n", "One architecture, three loops: Morning Check-In sets context|Stillform applies established mechanisms from behavioral and cognitive neuroscience", "src/App.jsx"], type: "must-match" },
  { label: "Preview routes include tutorial surfaces", cmd: "rg", args: ["-n", "new Set\\(\\[\"tutorial\", \"onboarding\", \"home\", \"settings\", \"faq\", \"privacy\"\\]\\)", "src/App.jsx"], type: "must-match" },
  { label: "Onboarding compressed architecture", cmd: "rg", args: ["-n", "Composure architecture|Begin calibration →", "src/App.jsx"], type: "must-match" },
  { label: "Onboarding step wizard removed", cmd: "rg", args: ["-n", "onboardStep|setOnboardStep", "src/App.jsx"], type: "must-not-match" },
  { label: "Settings FAQ priority placement", cmd: "rg", args: ["-n", "FAQ \\(top priority for low-friction support\\)|Open FAQ →", "src/App.jsx"], type: "must-match" },
  { label: "Data export actions active", cmd: "rg", args: ["-n", "exportPulseLogPdf|exportSessionHistoryCsv|Pulse PDF Exported|Session CSV Exported", "src/App.jsx"], type: "must-match" },
  { label: "Core loop smoke script present", cmd: "rg", args: ["-n", "\"smoke:core-loop\": \"node scripts/core-loop-smoke\\.mjs\"", "package.json"], type: "must-match" },
  { label: "Launch runbook present", cmd: "rg", args: ["-n", "Stillform Launch-Day Runbook|core-loop-smoke\\.mjs", "docs/LAUNCH_DAY_RUNBOOK.md"], type: "must-match" },
  { label: "Copy lock manifest present", cmd: "rg", args: ["-n", "Stillform Copy Locks|LOCKED|Tutorial FAQ guidance sentence", "docs/COPY_LOCKS.md"], type: "must-match" },
  { label: "Metrics telemetry controls", cmd: "rg", args: ["-n", "Performance metrics \\(counts \\+ rates only\\)|METRICS_OPT_IN_KEY|metrics-ingest|Metrics Snapshot Sent", "src/App.jsx"], type: "must-match" },
  { label: "Metrics ingest function present", cmd: "rg", args: ["-n", "metrics_opt_in must be true|upsertMetricsSnapshot|metric_date", "netlify/functions/metrics-ingest.js"], type: "must-match" },
  { label: "Crisis other resources collapse", cmd: "rg", args: ["-n", "showOtherCrisisResources|Other resources", "src/App.jsx"], type: "must-match" },
  { label: "AI insight guardrails", cmd: "rg", args: ["-n", "noteType: \"user-facing\"|Insight guardrails are active", "src/App.jsx"], type: "must-match" },
  { label: "Post-rating insight loop", cmd: "rg", args: ["-n", "showPostInsight|getLatestUserFacingInsight|Post Session Insight Shown", "src/App.jsx"], type: "must-match" },
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
