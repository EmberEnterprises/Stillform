import React, { useState } from "react";
import Button from "./Button.jsx";
import { getWeatherConsent, setWeatherConsent } from "../lib/ambientSignals.js";
import { weatherDescriptor } from "../lib/ambientSignals.js";
import { refreshWeather } from "../lib/weatherProducer.js";

/**
 * WeatherConsent — the opt-in weather producer surface. OFF by default.
 *
 * Turning it on reads the day's conditions from a free service using your coarse
 * location (rounded before it leaves the device, never stored). Only the day's
 * weather is kept, so a heavy day can quietly, invisibly, temper the read and the
 * brief. Disconnect forgets it. The moon side of ambient is separate and needs
 * nothing from the user.
 *
 * FIRST-PASS COPY — flagged for Arlin's voice.
 */

const ROW = { color: "var(--sf-text-primary)", fontSize: "15px", lineHeight: 1.55, margin: "0 0 var(--sf-space-12) 0" };
const FAINT = { color: "var(--sf-text-faint)", fontSize: "13px", lineHeight: 1.55, margin: "0 0 var(--sf-space-12) 0" };

export default function WeatherConsent() {
  const [connected, setConnected] = useState(() => getWeatherConsent());
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null); // { kind: "ok"|"none"|"err", desc?, msg? }

  async function connect() {
    setWeatherConsent(true);
    setConnected(true);
    setBusy(true); setStatus(null);
    try { window.plausible?.("Weather Connected"); } catch { /* non-fatal */ }
    try {
      const r = await refreshWeather();
      if (r.ok) {
        const desc = weatherDescriptor();
        setStatus({ kind: "ok", desc });
        try { window.plausible?.("Weather Refreshed"); } catch { /* non-fatal */ }
      } else if (r.reason === "no-location") {
        setStatus({ kind: "err", msg: "Couldn\u2019t read your location \u2014 weather stays off until it can." });
      } else {
        setStatus({ kind: "err", msg: "Couldn\u2019t reach the weather service. It\u2019ll try again later." });
      }
    } catch {
      setStatus({ kind: "err", msg: "Something went wrong turning weather on." });
    } finally {
      setBusy(false);
    }
  }

  function disconnect() {
    setWeatherConsent(false); // revoke = wipe
    setConnected(false); setStatus(null);
    try { window.plausible?.("Weather Disconnected"); } catch { /* non-fatal */ }
  }

  if (!connected) {
    return (
      <div style={{ padding: 0 }}>
        <p style={FAINT}>
          Let the day&rsquo;s weather quietly inform the read &mdash; a low-pressure, grey, or
          short-daylight day can weigh on a person, and the system can hold the room a touch more
          gently when it does. It uses your rough location to check conditions; your location is
          never stored, only the day&rsquo;s weather. Off unless you turn it on.
        </p>
        <Button variant="ghost" onClick={connect}>Use the day&rsquo;s weather</Button>
      </div>
    );
  }

  return (
    <div>
      <p style={ROW}>
        {busy
          ? "Reading the day\u2019s conditions\u2026"
          : status && status.kind === "ok"
            ? (status.desc ? `On \u00b7 today reads as ${status.desc}.` : "On \u00b7 nothing notable in today\u2019s weather.")
            : "On."}
      </p>
      {status && status.kind === "err" && <p style={FAINT}>{status.msg}</p>}

      <p style={FAINT}>
        Only the day&rsquo;s conditions are kept, on this device &mdash; never your location. It
        refreshes on its own; nothing about the weather is ever shown to you as a reason for how you
        feel.
      </p>
      <button type="button" className="sf-link-quiet" onClick={disconnect}>
        Turn off &amp; forget weather
      </button>
    </div>
  );
}
