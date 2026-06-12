import React, { useState, useEffect } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import Button from "../components/Button.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import HairlineDivider from "../components/HairlineDivider.jsx";
import { getSubscriptionStatus } from "../lib/subscriptionApi.js";
import { getA11y, setA11y } from "../lib/a11y.js";
import { requestCode, verifyCode, getAuthState, signOut } from "../lib/authApi.js";
import { saveBackup, listBackups, fetchBackup, applyRestore, deviceHasPracticeData, linkInstallToAccount } from "../lib/backupApi.js";

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
  const [sub, setSub] = useState({ loading: true, isSubscribed: false, status: null, error: null });
  const [refreshing, setRefreshing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [summary, setSummary] = useState(() => readDeviceSummary());
  const [a11y, setA11yState] = useState(() => getA11y());

  function toggleA11y(k, onVal) {
    const next = setA11y(k, a11y[k] === onVal ? "default" : onVal);
    setA11yState(next);
  }

  useEffect(() => {
    let alive = true;
    getSubscriptionStatus().then((res) => {
      if (alive) setSub({ loading: false, isSubscribed: res.isSubscribed, status: res.status, error: res.error });
    });
    return () => {
      alive = false;
    };
  }, []);

  function refresh() {
    if (refreshing) return;
    setRefreshing(true);
    getSubscriptionStatus().then((res) => {
      setSub({ loading: false, isSubscribed: res.isSubscribed, status: res.status, error: res.error });
      setRefreshing(false);
    });
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

  const accessLabel = sub.loading
    ? "Checking…"
    : sub.error
    ? "Unknown"
    : sub.isSubscribed
    ? "Active"
    : "Inactive";

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
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

      {/* ACCESS — subscription status (install-id based; no auth required) */}
      <section style={SECTION}>
        <MonoLabel label="Access" />
        <p style={ROW}>
          {accessLabel}
          {sub.status ? ` · ${sub.status}` : ""}
        </p>
        {sub.error && !sub.loading && (
          <p style={FAINT}>{sub.error} If access looks wrong, refresh from the server.</p>
        )}
        <Button variant="secondary" onClick={refresh}>
          {refreshing ? "Refreshing…" : "Refresh from server"}
        </Button>
      </section>

      <HairlineDivider />

      {/* ACCOUNT — accounts arc A3 (June 2 2026): email-code sign-in,
          manual backup, restore with typed confirm on non-empty devices,
          sign out. Backup is the ONLY thing behind sign-in (Self-Mode law:
          practice never gates on an account). */}
      <AccountSection />

      <HairlineDivider />

      {/* DISPLAY — accessibility (contrast / text size). Applies app-wide
          instantly via lib/a11y.js token overrides; persists on-device. */}
      <div style={SECTION}>
        <MonoLabel size="xs" tone="faint">DISPLAY</MonoLabel>
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
      </div>

      {/* YOUR DATA — read-only summary of what's on this device */}
      <section style={SECTION}>
        <MonoLabel label="Your data" />
        <p style={ROW}>
          {summary.sessions} session{summary.sessions === 1 ? "" : "s"} logged · {summary.items} item
          {summary.items === 1 ? "" : "s"} stored on this device.
        </p>
        <p style={FAINT}>
          Everything lives on this device. Nothing leaves it except the anonymous check that
          confirms your access.
        </p>
      </section>

      <HairlineDivider />

      {/* CLEAR DATA — destructive, confirm-gated, local wipe */}
      <section style={SECTION}>
        <MonoLabel label="Clear data" />
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
      </section>

      <HairlineDivider />

      {/* PRIVACY + CONTACT */}
      <section style={{ ...SECTION, marginBottom: "var(--sf-space-32)" }}>
        <MonoLabel label="Privacy & contact" />
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
      </section>
    </main>
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

function AccountSection() {
  const [auth, setAuth] = useState(() => getAuthState());
  const [step, setStep] = useState("idle"); // idle | email | code | working
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [note, setNote] = useState(null);
  const [busy, setBusy] = useState(false);
  const [backups, setBackups] = useState(null); // null = not loaded
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [confirmText, setConfirmText] = useState("");

  const lastBackupAt = (() => {
    try { return localStorage.getItem("stillform_v2_last_backup_at"); } catch { return null; }
  })();

  const sendCode = async () => {
    setBusy(true); setNote(null);
    const r = await requestCode(email);
    setBusy(false);
    if (r.ok) { setStep("code"); setNote("Code sent. Check your email."); }
    else setNote(r.error === "invalid_email" ? "That email doesn't look right." : "Couldn't send the code. Try again in a moment.");
  };

  const confirmCode = async () => {
    setBusy(true); setNote(null);
    const r = await verifyCode(email, code);
    setBusy(false);
    if (r.ok) {
      setAuth(getAuthState()); setStep("idle"); setCode("");
      setNote("Signed in. Backing up…");
      linkInstallToAccount().catch(() => { /* soft — A5 */ });
      const b = await saveBackup();
      setNote(b.ok ? "Signed in. First backup saved." : "Signed in. Backup will retry on next open.");
    } else {
      setNote("That code didn't verify. Re-enter it, or send a fresh one.");
    }
  };

  const doBackup = async () => {
    setBusy(true); setNote(null);
    const b = await saveBackup();
    setBusy(false);
    setNote(b.ok ? "Backed up." : b.error === "signed_out" ? "Session expired — sign in again." : "Backup didn't go through. Your data is still on this device.");
  };

  const openRestore = async () => {
    setBusy(true); setNote(null);
    const r = await listBackups();
    setBusy(false);
    if (!r.ok) { setNote("Couldn't load backups right now."); return; }
    setBackups(r.backups);
    if (r.backups.length === 0) setNote("No backups on this account yet.");
  };

  const doRestore = async (b) => {
    if (deviceHasPracticeData() && confirmText !== "RESTORE") {
      setRestoreTarget(b);
      return;
    }
    setBusy(true); setNote(null);
    const r = await fetchBackup(b.id);
    if (!r.ok) { setBusy(false); setNote("Couldn't fetch that backup."); return; }
    const applied = applyRestore(r.payload);
    setBusy(false);
    if (applied) {
      setNote("Restored. Reloading…");
      setTimeout(() => { try { window.location.reload(); } catch { /* ok */ } }, 600);
    } else {
      setNote("Restore didn't apply. Nothing was changed.");
    }
  };

  const doSignOut = async () => {
    setBusy(true);
    await signOut();
    setBusy(false);
    setAuth(getAuthState()); setBackups(null); setStep("idle");
    setNote("Signed out. Your data stays on this device.");
  };

  return (
    <section style={SECTION}>
      <MonoLabel size="xs" tone="faint">ACCOUNT</MonoLabel>

      {!auth.signedIn ? (
        <>
          <p style={FAINT}>
            An account does one thing: backs your practice up and lets you
            restore it on another device. Nothing else needs it.
          </p>
          {step === "idle" && (
            <Button variant="secondary" onClick={() => setStep("email")}>Sign in with email</Button>
          )}
          {step === "email" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sf-space-12)" }}>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={INPUT}
                aria-label="Email address"
              />
              <Button variant="secondary" onClick={sendCode} disabled={busy}>
                {busy ? "Sending…" : "Send me a code"}
              </Button>
            </div>
          )}
          {step === "code" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sf-space-12)" }}>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={INPUT}
                aria-label="Verification code"
              />
              <Button variant="secondary" onClick={confirmCode} disabled={busy}>
                {busy ? "Verifying…" : "Verify"}
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          <p style={ROW}>{auth.email}</p>
          {lastBackupAt && (
            <p style={FAINT}>Last backup: {new Date(lastBackupAt).toLocaleString()}</p>
          )}
          <div style={{ display: "flex", gap: "var(--sf-space-12)", flexWrap: "wrap" }}>
            <Button variant="secondary" onClick={doBackup} disabled={busy}>
              {busy ? "Working…" : "Back up now"}
            </Button>
            <Button variant="ghost" onClick={openRestore} disabled={busy}>Restore…</Button>
            <Button variant="ghost" onClick={doSignOut} disabled={busy}>Sign out</Button>
          </div>

          {Array.isArray(backups) && backups.length > 0 && (
            <div style={{ marginTop: "var(--sf-space-16)" }}>
              {backups.map((b) => (
                <div key={b.id} style={{ display: "flex", gap: "var(--sf-space-12)", alignItems: "center", padding: "var(--sf-space-8) 0" }}>
                  <span style={FAINT}>
                    {new Date(b.created_at).toLocaleString()}
                    {b.app_version ? ` · ${b.app_version}` : ""}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => doRestore(b)} disabled={busy}>
                    Restore this
                  </Button>
                </div>
              ))}
            </div>
          )}

          {restoreTarget && (
            <div style={{ marginTop: "var(--sf-space-16)" }}>
              <p style={FAINT}>
                This device already carries practice data. Restoring replaces
                it with the backup from {new Date(restoreTarget.created_at).toLocaleString()}.
                Type RESTORE to confirm.
              </p>
              <div style={{ display: "flex", gap: "var(--sf-space-12)" }}>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="RESTORE"
                  style={INPUT}
                  aria-label="Type RESTORE to confirm"
                />
                <Button
                  variant="secondary"
                  disabled={busy || confirmText !== "RESTORE"}
                  onClick={() => { const t = restoreTarget; setRestoreTarget(null); setConfirmText(""); doRestore(t); }}
                >
                  Replace this device's data
                </Button>
                <Button variant="ghost" onClick={() => { setRestoreTarget(null); setConfirmText(""); }}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {note && <p style={{ ...FAINT, marginTop: "var(--sf-space-12)" }} aria-live="polite">{note}</p>}
    </section>
  );
}

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
