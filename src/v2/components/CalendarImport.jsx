import React, { useState } from "react";
import Button from "./Button.jsx";
import {
  getCalendarConsent,
  setCalendarConsent,
  getCalendarEvents,
  setUpcomingEvents,
} from "../lib/calendarData.js";
import { importIcs } from "../lib/icsImport.js";
import { extractCalendarFromScreenshot } from "../lib/calendarScreenshotApi.js";

/**
 * CalendarImport — the web-buildable, consent-gated calendar producer surface.
 *
 * Grants/revokes calendar consent and imports events from a .ics file or pasted
 * .ics text (Google/Apple/Outlook all export it), with no native access. Feeds
 * the same store a native pull will later write to; the Today's Brief already
 * consumes it. Only titles + times are kept, on-device; disconnect forgets it.
 *
 * FIRST-PASS COPY — flagged for Arlin's voice.
 */

const ROW = { color: "var(--sf-text-primary)", fontSize: "15px", lineHeight: 1.55, margin: "0 0 var(--sf-space-12) 0" };
const FAINT = { color: "var(--sf-text-faint)", fontSize: "13px", lineHeight: 1.55, margin: "0 0 var(--sf-space-12) 0" };
const IMPORT_BTN = {
  display: "inline-flex", alignItems: "center", cursor: "pointer",
  fontFamily: "var(--sf-font-mono)", fontSize: "12px", letterSpacing: "0.06em",
  color: "var(--sf-accent)", border: "1px solid var(--sf-accent-line)",
  borderRadius: "8px", padding: "8px 14px",
};

export default function CalendarImport() {
  const [connected, setConnected] = useState(() => getCalendarConsent());
  const [count, setCount] = useState(() => getCalendarEvents().length);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [status, setStatus] = useState(null); // { kind: "ok" | "none" | "err", n?, msg? }
  const [busy, setBusy] = useState(false);

  function connect() {
    setCalendarConsent(true);
    setConnected(true);
    try { window.plausible?.("Calendar Connected"); } catch { /* non-fatal */ }
  }
  function disconnect() {
    setCalendarConsent(false); // revoke = wipe
    setConnected(false); setCount(0); setStatus(null);
    setPasteOpen(false); setPasteText("");
    try { window.plausible?.("Calendar Disconnected"); } catch { /* non-fatal */ }
  }
  function afterImport(stored) {
    setCount(getCalendarEvents().length);
    setStatus({ kind: stored.length ? "ok" : "none", n: stored.length });
    try { window.plausible?.("Calendar Imported", { props: { count: stored.length } }); } catch { /* non-fatal */ }
  }
  function onFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { try { afterImport(importIcs(String(reader.result || ""))); } catch { afterImport([]); } };
    reader.onerror = () => afterImport([]);
    reader.readAsText(file);
    e.target.value = ""; // let the same file be re-imported
  }
  function onPasteImport() {
    afterImport(importIcs(pasteText));
    setPasteText(""); setPasteOpen(false);
  }
  async function onScreenshot(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // let the same image be re-picked
    if (!file) return;
    setBusy(true); setStatus(null);
    try {
      const dataUrl = await new Promise((res, rej) => {
        const rd = new FileReader();
        rd.onload = () => res(String(rd.result || ""));
        rd.onerror = () => rej(new Error("read"));
        rd.readAsDataURL(file);
      });
      const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
      const { events, error } = await extractCalendarFromScreenshot({ imageBase64: base64, imageMime: file.type || "image/png" });
      if (error && events.length === 0) setStatus({ kind: "err", msg: error });
      else afterImport(setUpcomingEvents(events));
    } catch {
      setStatus({ kind: "err", msg: "Couldn't read that screenshot." });
    } finally {
      setBusy(false);
    }
  }

  if (!connected) {
    return (
      <div style={{ padding: 0 }}>
        <p style={FAINT}>
          Bring in your calendar so the day&rsquo;s load can shape what surfaces &mdash; what&rsquo;s
          ahead, what to prepare for. Export a .ics from Google, Apple, or Outlook and import it here.
          Only titles and times are kept, on this device &mdash; never who&rsquo;s invited or any notes.
        </p>
        <Button variant="ghost" onClick={connect}>Use my calendar</Button>
      </div>
    );
  }

  return (
    <div>
      <p style={ROW}>
        {count === 0 ? "Connected. No events imported yet." : `Connected \u00b7 ${count} event${count === 1 ? "" : "s"} in view.`}
      </p>
      {status && status.kind === "ok" && (
        <p style={FAINT}>Imported {status.n} upcoming event{status.n === 1 ? "" : "s"}.</p>
      )}
      {status && status.kind === "none" && (
        <p style={FAINT}>Nothing to import &mdash; no upcoming events found in that file.</p>
      )}
      {status && status.kind === "err" && <p style={FAINT}>{status.msg}</p>}

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", marginBottom: "var(--sf-space-12)" }}>
        <label style={IMPORT_BTN}>
          Import .ics file
          <input type="file" accept=".ics,text/calendar" onChange={onFile} style={{ display: "none" }} />
        </label>
        <label style={{ ...IMPORT_BTN, opacity: busy ? 0.6 : 1 }}>
          {busy ? "Reading\u2026" : "From a screenshot"}
          <input type="file" accept="image/*" onChange={onScreenshot} disabled={busy} style={{ display: "none" }} />
        </label>
        <button type="button" className="sf-link-quiet" onClick={() => setPasteOpen((v) => !v)}>
          {pasteOpen ? "Cancel" : "Paste .ics text"}
        </button>
      </div>

      <p style={FAINT}>
        A screenshot is read by AI to pull out titles and times &mdash; the image itself may show
        more on screen (names, notes), so only send one you&rsquo;re comfortable sharing. Nothing
        from the image is kept beyond titles and times.
      </p>

      {pasteOpen && (
        <div style={{ marginBottom: "var(--sf-space-12)" }}>
          <textarea
            className="sf-textarea"
            rows={4}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste the contents of a .ics file\u2026"
            aria-label="Paste ICS calendar text"
          />
          <div style={{ marginTop: "var(--sf-space-8)" }}>
            <Button variant="ghost" onClick={onPasteImport} disabled={!pasteText.trim()}>
              Import pasted calendar
            </Button>
          </div>
        </div>
      )}

      <p style={FAINT}>
        Stored on this device. Titles and times only &mdash; never attendees or notes. Re-importing
        replaces what&rsquo;s here; past events drop off.
      </p>
      <button type="button" className="sf-link-quiet" onClick={disconnect}>
        Disconnect &amp; forget calendar
      </button>
    </div>
  );
}
