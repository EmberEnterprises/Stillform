import { Capacitor } from "@capacitor/core";

const CALENDAR_SOURCE_PREFIX = "Device calendar";
const HEALTH_SOURCE_PREFIX = "Health app";

const isNative = () => {
  try {
    return !!Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
};

const getPlugin = () => {
  try {
    return Capacitor?.Plugins?.IntegrationBridge || null;
  } catch {
    return null;
  }
};

const safeIso = (value) => {
  if (!value) return null;
  try {
    const dt = new Date(value);
    return Number.isNaN(dt.getTime()) ? null : dt.toISOString();
  } catch {
    return null;
  }
};

const normalizeCalendarEvent = (event) => {
  if (!event || typeof event !== "object") return null;
  const title = String(event.title || "").trim();
  const start = safeIso(event.start) || safeIso(event.startDate);
  if (!title || !start) return null;
  const end = safeIso(event.end) || safeIso(event.endDate);
  return {
    title: title.slice(0, 140),
    start,
    end,
    source: "device-calendar"
  };
};

const normalizeCalendarPayload = (payload) => {
  const events = Array.isArray(payload?.events)
    ? payload.events.map(normalizeCalendarEvent).filter(Boolean).slice(0, 8)
    : [];
  const summary = String(payload?.summary || "").trim()
    || (events[0] ? `Upcoming: ${events[0].title}` : "");
  const updatedAt = safeIso(payload?.updatedAt) || new Date().toISOString();
  return {
    summary: summary ? `${CALENDAR_SOURCE_PREFIX} · ${summary}` : "",
    events,
    updatedAt
  };
};

const normalizeHealthPayload = (payload) => {
  const sleepHours = Number.isFinite(Number(payload?.sleepHours))
    ? Number(payload.sleepHours)
    : null;
  const hrv = Number.isFinite(Number(payload?.hrv))
    ? Number(payload.hrv)
    : null;
  const restingHr = Number.isFinite(Number(payload?.restingHr))
    ? Number(payload.restingHr)
    : null;
  const readiness = String(payload?.readiness || "").trim();
  const summary = String(payload?.summary || "").trim()
    || [
      sleepHours != null ? `${sleepHours.toFixed(1)}h sleep` : "",
      hrv != null ? `HRV ${Math.round(hrv)}` : "",
      restingHr != null ? `resting HR ${Math.round(restingHr)}` : "",
      readiness ? `readiness ${readiness}` : ""
    ].filter(Boolean).join(", ");
  const updatedAt = safeIso(payload?.updatedAt) || new Date().toISOString();
  return {
    summary: summary ? `${HEALTH_SOURCE_PREFIX} · ${summary}` : "",
    snapshot: {
      sleepHours,
      hrv,
      restingHr,
      readiness: readiness || null,
      updatedAt
    },
    updatedAt
  };
};

const unsupportedResult = (kind) => ({
  ok: false,
  supported: false,
  status: "unsupported",
  error: `${kind} integration requires native TestFlight build`
});

export const integrationBridge = {
  async syncCalendar() {
    if (!isNative()) return unsupportedResult("Calendar");
    const plugin = getPlugin();
    if (!plugin?.syncCalendar) return unsupportedResult("Calendar");
    try {
      const result = await plugin.syncCalendar();
      if (result?.ok !== true) {
        return {
          ok: false,
          supported: true,
          status: String(result?.status || "error"),
          error: String(result?.error || "Calendar sync failed")
        };
      }
      const payload = normalizeCalendarPayload(result);
      return {
        ok: true,
        supported: true,
        status: String(result?.status || "connected"),
        ...payload
      };
    } catch (error) {
      return {
        ok: false,
        supported: true,
        status: "error",
        error: String(error?.message || "Calendar sync failed")
      };
    }
  },

  async syncHealth() {
    if (!isNative()) return unsupportedResult("Health");
    const plugin = getPlugin();
    if (!plugin?.syncHealth) return unsupportedResult("Health");
    try {
      const result = await plugin.syncHealth();
      if (result?.ok !== true) {
        return {
          ok: false,
          supported: true,
          status: String(result?.status || "error"),
          error: String(result?.error || "Health sync failed")
        };
      }
      const payload = normalizeHealthPayload(result);
      return {
        ok: true,
        supported: true,
        status: String(result?.status || "connected"),
        ...payload
      };
    } catch (error) {
      return {
        ok: false,
        supported: true,
        status: "error",
        error: String(error?.message || "Health sync failed")
      };
    }
  }
};
