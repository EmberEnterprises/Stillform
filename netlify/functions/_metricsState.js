import { sbAdminFetch } from "./_subscriptionState.js";

export const METRICS_TABLE = "stillform_metrics_daily";

const toIsoOrNow = (value) => {
  if (!value) return new Date().toISOString();
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
};

const asText = (value, maxLen = 80) => {
  if (value == null) return null;
  const next = String(value).trim();
  if (!next) return null;
  return next.slice(0, maxLen);
};

const asInt = (value, min = 0, max = 100000) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.max(min, Math.min(max, Math.round(n)));
};

const asRate = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(1, Number(n.toFixed(4))));
};

const asDelta = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Number(n.toFixed(4));
};

const sanitizeToolUsage = (raw) => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const entries = Object.entries(raw)
    .filter(([key]) => /^[a-z0-9_-]{1,40}$/i.test(String(key)))
    .slice(0, 24)
    .map(([key, value]) => [String(key), asInt(value, 0, 50000)]);
  return Object.fromEntries(entries.filter(([, value]) => value !== null));
};

export const sanitizeMetricsSnapshot = (snapshot = {}) => {
  const src = snapshot && typeof snapshot === "object" ? snapshot : {};
  const generatedAt = toIsoOrNow(src.generated_at);
  const metricDate = generatedAt.slice(0, 10);
  return {
    metricDate,
    generatedAt,
    schemaVersion: asInt(src.schema_version, 1, 20) ?? 1,
    appVersion: asText(src.app_version, 40),
    packageVersion: asText(src.package_version, 40),
    sessionsTotal: asInt(src.sessions_total),
    ratedSessions: asInt(src.rated_sessions),
    avgDelta: asDelta(src.avg_delta),
    positiveShiftRate: asRate(src.positive_shift_rate),
    activeDaysTotal: asInt(src.active_days_total),
    activeDays14d: asInt(src.active_days_14d, 0, 14),
    pulseEntriesTotal: asInt(src.pulse_entries_total),
    savedReframesTotal: asInt(src.saved_reframes_total),
    protocolRunsTotal: asInt(src.protocol_runs_total),
    morningCompletionRate14d: asRate(src.morning_completion_rate_14d),
    eodCompletionRate14d: asRate(src.eod_completion_rate_14d),
    loopCompletionRate14d: asRate(src.loop_completion_rate_14d),
    nudgeShown14d: asInt(src.nudge_shown_14d, 0, 10000),
    nudgeActioned14d: asInt(src.nudge_actioned_14d, 0, 10000),
    nudgeDismissed14d: asInt(src.nudge_dismissed_14d, 0, 10000),
    nudgeRecoveryRate14d: asRate(src.nudge_recovery_rate_14d),
    subscriptionActiveLocal: src.subscription_active_local === true,
    toolUsage: sanitizeToolUsage(src.tool_usage),
    payload: {
      sessions_total: asInt(src.sessions_total),
      rated_sessions: asInt(src.rated_sessions),
      avg_delta: asDelta(src.avg_delta),
      positive_shift_rate: asRate(src.positive_shift_rate),
      active_days_total: asInt(src.active_days_total),
      active_days_14d: asInt(src.active_days_14d, 0, 14),
      pulse_entries_total: asInt(src.pulse_entries_total),
      saved_reframes_total: asInt(src.saved_reframes_total),
      protocol_runs_total: asInt(src.protocol_runs_total),
      morning_completion_rate_14d: asRate(src.morning_completion_rate_14d),
      eod_completion_rate_14d: asRate(src.eod_completion_rate_14d),
      loop_completion_rate_14d: asRate(src.loop_completion_rate_14d),
      nudge_shown_14d: asInt(src.nudge_shown_14d, 0, 10000),
      nudge_actioned_14d: asInt(src.nudge_actioned_14d, 0, 10000),
      nudge_dismissed_14d: asInt(src.nudge_dismissed_14d, 0, 10000),
      nudge_recovery_rate_14d: asRate(src.nudge_recovery_rate_14d),
      subscription_active_local: src.subscription_active_local === true,
      tool_usage: sanitizeToolUsage(src.tool_usage)
    }
  };
};

const writeIdentityMetrics = async ({ identityKey, metricDate, base }) => {
  const rows = await sbAdminFetch(
    `/rest/v1/${METRICS_TABLE}?on_conflict=identity_key%2Cmetric_date`,
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({
        identity_key: identityKey,
        metric_date: metricDate,
        ...base
      })
    }
  );
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
};

export const upsertMetricsSnapshot = async ({
  userId = null,
  installId = null,
  source = "manual",
  snapshot = {}
}) => {
  const safe = sanitizeMetricsSnapshot(snapshot);
  const identityKeys = [
    userId ? `user:${String(userId)}` : null,
    installId ? `install:${String(installId)}` : null
  ].filter(Boolean);
  if (!identityKeys.length) throw new Error("user_id or install_id is required");

  const base = {
    user_id: userId || null,
    install_id: installId || null,
    source: source || "manual",
    app_version: safe.appVersion,
    package_version: safe.packageVersion,
    schema_version: safe.schemaVersion,
    generated_at: safe.generatedAt,
    sessions_total: safe.sessionsTotal,
    rated_sessions: safe.ratedSessions,
    avg_delta: safe.avgDelta,
    positive_shift_rate: safe.positiveShiftRate,
    active_days_total: safe.activeDaysTotal,
    active_days_14d: safe.activeDays14d,
    pulse_entries_total: safe.pulseEntriesTotal,
    saved_reframes_total: safe.savedReframesTotal,
    protocol_runs_total: safe.protocolRunsTotal,
    morning_completion_rate_14d: safe.morningCompletionRate14d,
    eod_completion_rate_14d: safe.eodCompletionRate14d,
    loop_completion_rate_14d: safe.loopCompletionRate14d,
    nudge_shown_14d: safe.nudgeShown14d,
    nudge_actioned_14d: safe.nudgeActioned14d,
    nudge_dismissed_14d: safe.nudgeDismissed14d,
    nudge_recovery_rate_14d: safe.nudgeRecoveryRate14d,
    subscription_active_local: safe.subscriptionActiveLocal,
    tool_usage: safe.toolUsage,
    payload: safe.payload,
    updated_at: new Date().toISOString()
  };

  const writes = [];
  for (const identityKey of identityKeys) {
    // eslint-disable-next-line no-await-in-loop
    const row = await writeIdentityMetrics({ identityKey, metricDate: safe.metricDate, base });
    if (row) writes.push(row);
  }
  return { writes, metricDate: safe.metricDate };
};
