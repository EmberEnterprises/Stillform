/**
 * icsExport — hand one move to the calendar (J7, 2026-07-14).
 *
 * The Close captures a next-move ("Thursday's review — pause before I answer").
 * Stating an intention is weaker than PLACING it; implementation-intention
 * research (Gollwitzer, already used in-app) is about the when-and-where, not
 * the resolve. This lets the user drop that move into their own calendar as a
 * single event — opt-in, one tap, their device, no account, no server.
 *
 * Emits a minimal valid VEVENT and triggers a local download. The OS hands the
 * .ics to whatever calendar the user actually uses. Nothing leaves the device.
 */

function pad(n) {
  return String(n).padStart(2, "0");
}

/** ICS UTC stamp: YYYYMMDDTHHMMSSZ */
function icsStamp(date) {
  const d = new Date(date);
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/** Escape per RFC 5545 (commas, semicolons, backslashes, newlines). */
function esc(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Build a single-VEVENT .ics string.
 * @param {{ title: string, start?: Date|number|string, durationMin?: number, description?: string }} opts
 * @returns {string}
 */
export function buildEventIcs(opts = {}) {
  const title = (opts.title || "Stillform — a move to run").trim();
  const start = opts.start ? new Date(opts.start) : new Date(Date.now() + 60 * 60 * 1000);
  const durMin = Number.isFinite(opts.durationMin) ? opts.durationMin : 15;
  const end = new Date(start.getTime() + durMin * 60 * 1000);
  const uid = `sf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@stillform`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Stillform//Move//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${icsStamp(Date.now())}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${esc(title)}`,
  ];
  if (opts.description) lines.push(`DESCRIPTION:${esc(opts.description)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}

/**
 * Trigger a local download of the event. Browser-only; no-ops safely in tests.
 * @returns {boolean} whether the download was initiated
 */
export function downloadEventIcs(opts = {}) {
  try {
    const ics = buildEventIcs(opts);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stillform-move.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    return false;
  }
}
