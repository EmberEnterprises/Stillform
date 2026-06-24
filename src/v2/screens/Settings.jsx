import React, { useState, useEffect } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import CollapsibleSection from "../components/CollapsibleSection.jsx";
import Button from "../components/Button.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import HairlineDivider from "../components/HairlineDivider.jsx";
import { getA11y, setA11y } from "../lib/a11y.js";

/**
 * Settings — the user's setup surface.
 *
 * REBUILD v1 (scope locked May 30, 2026). This screen exposes ONLY what the
 * live build can actually do, so it never promises a capability the code
 * can't keep:
 *   1. Access      — subscription status + refresh (subscriptionApi, install-id
 *                    based, no auth required).
 *   2. Your data   — read-only summary of what's stored on this device.
 *   3. Clear data  — wipes this device's stored data (confirm-gated). This is a
 *                    LOCAL wipe, NOT server account deletion: storage is
 *                    local-first (plain localStorage), and the server
 *                    account-delete needs an authed user this build doesn't
 *                    have yet. `stillform_install_id` is preserved so a paid
 *                    subscription isn't stranded.
 *   4. Privacy     — privacy policy + contact links.
 *
 * DEFERRED (added when their features rebuild — see SETTINGS_REWRITE_SPEC.md):
 * server account deletion UI, integrations, re-run calibration, FAQ button,
 * theme / tone toggles, biometric lock.
 * (Account sign-in + cloud backup/restore landed June 2 2026 — accounts arc
 * A3; accessibility toggles landed June 2 as the DISPLAY section.)
 *
 * GUARDRAILS (do not soften):
 *   - No section claims a capability that isn't wired. No "your data is
 *     encrypted," no "sync," no "sign in" until those actually land.
 *   - "Clear data" is destructive and irreversible — always confirm-gated,
 *     and the copy states plainly what it removes and what it keeps.
 *   - Framing-law clean: this is a plain setup surface, not a "wellness" or
 *     "regulation" panel. Utilitarian copy.
 *
 * @param {function(): void} onExit — called when the user taps back to home.
 */
export default function Settings({ onExit }) {
  const [confirmClear, setConfirmClear] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [summary, setSummary] = useState(() => readDeviceSummary());
  const [a11y, setA11yState] = useState(() => getA11y());

  function toggleA11y(k, onVal) {
    const next = setA11y(k, a11y[k] === onVal ? "default" : onVal);
    setA11yState(next);
  }

  function clearDeviceData() {
    try {
      const toRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf("stillform") === 0 && k !== "stillform_install_id") toRemove.push(k);
      }
      toRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      /* best-effort — a storage exception shouldn't crash the screen */
    }
    setConfirmClear(false);
    setCleared(true);
    setSummary(readDeviceSummary());
  }

  return (
    <>
      <div className="sf-home-aura" aria-hidden="true" />
      <div className="sf-home-grain" aria-hidden="true" />
      <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)", position: "relative", zIndex: 1 }}>
      <button type="button" onClick={onExit} aria-label="Back to home" style={BACK_BTN}>
        ← back
      </button>

      <EditorialBlock
        label="Settings"
        headline="Your setup"
        headlineSize="md"
        body={
          <>
            What's connected, what's stored, and how to clear it. More appears here as the
            features behind it come online.
          </>
        }
        rule
      />

      {/* DISPLAY — accessibility (contrast / text size), app-wide via a11y.js */}
      <CollapsibleSection label="Display">
        <div style={SECTION}>
          <div style={ROW}>
            <span style={{ color: "var(--sf-text-primary)" }}>High contrast</span>
            <button
              type="button"
              onClick={() => toggleA11y("contrast", "high")}
              style={a11y.contrast === "high" ? TOGGLE_ON : TOGGLE_OFF}
              aria-pressed={a11y.contrast === "high"}
              aria-label="Toggle high contrast"
            >
              {a11y.contrast === "high" ? "On" : "Off"}
            </button>
          </div>
          <div style={ROW}>
            <span style={{ color: "var(--sf-text-primary)" }}>Larger text</span>
            <button
              type="button"
              onClick={() => toggleA11y("textSize", "large")}
              style={a11y.textSize === "large" ? TOGGLE_ON : TOGGLE_OFF}
              aria-pressed={a11y.textSize === "large"}
              aria-label="Toggle larger text"
            >
              {a11y.textSize === "large" ? "On" : "Off"}
            </button>
          </div>
          <div style={ROW}>
            <span style={{ color: "var(--sf-text-primary)" }}>Reduced motion</span>
            <button
              type="button"
              onClick={() => toggleA11y("motion", "reduced")}
              style={a11y.motion === "reduced" ? TOGGLE_ON : TOGGLE_OFF}
              aria-pressed={a11y.motion === "reduced"}
              aria-label="Toggle reduced motion"
            >
              {a11y.motion === "reduced" ? "On" : "Off"}
            </button>
          </div>
        </div>
      </CollapsibleSection>

      {/* YOUR DATA — read-only summary + destructive clear (confirm-gated) */}
      <CollapsibleSection label="Your data">
        <div style={SECTION}>
          <p style={ROW}>
            {summary.sessions} session{summary.sessions === 1 ? "" : "s"} logged · {summary.items} item
            {summary.items === 1 ? "" : "s"} stored on this device.
          </p>
          <p style={FAINT}>
            Everything lives on this device. Nothing leaves it except the anonymous check that
            confirms your access.
          </p>
        </div>
        <div style={{ ...SECTION, marginTop: "var(--sf-space-16)" }}>
          <MonoLabel size="xs" tone="faint">CLEAR DATA</MonoLabel>
          {cleared ? (
            <p style={ROW}>Your data on this device has been cleared.</p>
          ) : !confirmClear ? (
            <>
              <p style={FAINT}>
                Removes your sessions, saved reframes, and profiles from this device. This can't be
                undone. Your access stays intact.
              </p>
              <Button variant="ghost" onClick={() => setConfirmClear(true)}>
                Clear all data from this device
              </Button>
            </>
          ) : (
            <>
              <p style={ROW}>Clear everything on this device? This can't be undone.</p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Button variant="ghost" onClick={clearDeviceData}>
                  Yes, clear it
                </Button>
                <Button variant="secondary" onClick={() => setConfirmClear(false)}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </CollapsibleSection>

      {/* PRIVACY + CONTACT */}
      <CollapsibleSection label="Privacy & contact">
        <div style={{ ...SECTION, marginBottom: "var(--sf-space-32)" }}>
          <p style={ROW}>
            <a href="/privacy.html" style={LINK}>
              Privacy policy
            </a>
          </p>
          <p style={ROW}>
            <a href="mailto:ARAembersllc@proton.me" style={LINK}>
              ARAembersllc@proton.me
            </a>
          </p>
        </div>
      </CollapsibleSection>

      </main>
    </>
  );
}

/**
 * Read a defensive, read-only summary of what's stored on this device.
 * Never throws — a malformed value just yields a conservative count.
 */
function readDeviceSummary() {
  let sessions = 0;
  let items = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.indexOf("stillform") === 0 && k !== "stillform_install_id") items++;
    }
    const raw =
      localStorage.getItem("stillform_v2_sessions") || localStorage.getItem("stillform_sessions");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) sessions = parsed.length;
      else if (parsed && Array.isArray(parsed.sessions)) sessions = parsed.sessions.length;
    }
  } catch {
    /* best-effort summary */
  }
  return { sessions, items };
}

const BACK_BTN = {
  background: "transparent",
  border: "none",
  color: "var(--sf-text-faint)",
  fontFamily: "var(--sf-font-mono)",
  fontSize: "11px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  cursor: "pointer",
  padding: "8px 0",
  marginBottom: "var(--sf-space-24)",
  WebkitTapHighlightColor: "transparent",
};


const INPUT = {
  background: "var(--sf-ground-elev, #111114)",
  border: "0.5px solid var(--sf-border-emphasis, rgba(255,255,255,0.14))",
  borderRadius: "var(--sf-radius-md, 12px)",
  color: "var(--sf-text-primary)",
  fontFamily: "var(--sf-font-sans)",
  fontSize: "16px",
  padding: "12px 14px",
  minHeight: "48px",
  width: "100%",
  maxWidth: "320px",
};

const SECTION = {
  marginTop: "var(--sf-space-32)",
  marginBottom: "var(--sf-space-32)",
};

const ROW = {
  fontSize: "15px",
  lineHeight: 1.5,
  margin: "0 0 12px",
};

const TOGGLE_BASE = {
  minWidth: "64px",
  minHeight: "40px",
  borderRadius: "var(--sf-radius-md, 12px)",
  fontFamily: "var(--sf-font-mono)",
  fontSize: "12px",
  letterSpacing: "0.06em",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
};
const TOGGLE_ON = {
  ...TOGGLE_BASE,
  background: "var(--sf-text-primary)",
  color: "var(--sf-ground-deep, #08080A)",
  border: "0.5px solid var(--sf-text-primary)",
};
const TOGGLE_OFF = {
  ...TOGGLE_BASE,
  background: "transparent",
  color: "var(--sf-text-quiet)",
  border: "0.5px solid var(--sf-border-emphasis)",
};

const FAINT = {
  color: "var(--sf-text-faint)",
  fontSize: "13px",
  lineHeight: 1.5,
  margin: "0 0 16px",
};

const LINK = {
  color: "inherit",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
};
