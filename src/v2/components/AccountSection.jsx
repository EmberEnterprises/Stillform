import React, { useState } from "react";
import Button from "./Button.jsx";
import MonoLabel from "./MonoLabel.jsx";
import HairlineDivider from "./HairlineDivider.jsx";
import { requestCode, verifyCode, getAuthState, signOut } from "../lib/authApi.js";
import { saveBackup, listBackups, fetchBackup, applyRestore, deviceHasPracticeData, linkInstallToAccount } from "../lib/backupApi.js";

/**
 * AccountSection — log in / sign up (email code) + manual backup / restore.
 *
 * Relocated out of Settings (June 23 2026, Arlin): account is no longer a
 * Settings section. It lives on the Paywall / subscription surface, so logging
 * in or signing up lands you where access + subscription are handled — one
 * place, no Settings redundancy. Auth + backup logic is unchanged.
 */
export default function AccountSection() {
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
    setNote(b.ok ? "Backed up." : b.error === "signed_out" ? "Session expired — log in again." : "Backup didn't go through. Your data is still on this device.");
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
            <Button variant="secondary" onClick={() => setStep("email")}>Log in or sign up with email</Button>
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
  borderRadius: "12px",
  color: "var(--sf-text-primary)",
  fontFamily: "var(--sf-font-sans)",
  fontSize: "16px",
  padding: "12px 14px",
  minHeight: "48px",
  width: "100%",
  maxWidth: "320px",
};
const SECTION = { marginTop: "var(--sf-space-32)", marginBottom: "var(--sf-space-32)" };
const ROW = { fontSize: "15px", lineHeight: 1.5, margin: "0 0 12px" };
const FAINT = { color: "var(--sf-text-faint)", fontSize: "13px", lineHeight: 1.5, margin: "0 0 16px" };
const LINK = { color: "inherit", textDecoration: "underline", textUnderlineOffset: "3px" };
