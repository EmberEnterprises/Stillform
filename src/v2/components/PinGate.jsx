import React, { useState } from "react";
import { verifyPin, eraseEverything } from "../lib/pinLock.js";

/**
 * PinGate — the closed door (W8 web tier, Arlin's design).
 *
 * Everything stays behind it: no app content is mounted while locked. The
 * forgot path is erase-and-start-over only — bypassing destroys what a
 * snooper came to read; the owner gets a clean restart.
 */
export default function PinGate({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [wrong, setWrong] = useState(false);
  const [confirmErase, setConfirmErase] = useState(0); // 0 none, 1 asked, 2 typed

  const tryUnlock = async () => {
    if (await verifyPin(pin)) { onUnlock(); return; }
    setWrong(true);
    setPin("");
  };

  const doErase = () => {
    eraseEverything();
    window.location.reload();
  };

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)", maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "28px", margin: "48px 0 8px", color: "var(--sf-text-primary)" }}>
        Stillform
      </h1>
      <p style={{ fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontStyle: "italic", fontSize: "14px", color: "var(--sf-text-faint)", margin: "0 0 32px" }}>
        Your practice is locked.
      </p>
      <input
        type="password"
        inputMode="numeric"
        autoComplete="off"
        value={pin}
        onChange={(e) => { setPin(e.target.value); setWrong(false); }}
        onKeyDown={(e) => { if (e.key === "Enter") tryUnlock(); }}
        aria-label="Enter your PIN"
        placeholder="PIN"
        style={{
          background: "transparent", border: "0.5px solid var(--sf-border-hairline)",
          borderRadius: 8, color: "var(--sf-text-primary)", fontSize: 22,
          letterSpacing: "0.4em", textAlign: "center", padding: "12px 16px",
          width: 180, outline: "none",
        }}
      />
      <div style={{ marginTop: 20 }}>
        <button type="button" className="sf-btn sf-btn--primary" onClick={tryUnlock} disabled={pin.length < 4}>
          Open
        </button>
      </div>
      {wrong ? (
        <p style={{ marginTop: 16, fontSize: 13, color: "var(--sf-text-faint)" }}>
          That's not it. Your words stay where they are.
        </p>
      ) : null}
      <div style={{ marginTop: 48 }}>
        {confirmErase === 0 ? (
          <button type="button" className="sf-link-quiet" onClick={() => setConfirmErase(1)}>
            Forgot your PIN?
          </button>
        ) : (
          <div style={{ maxWidth: 420, margin: "0 auto" }}>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--sf-text-faint)", fontFamily: "var(--sf-font-serif)", fontWeight: 300 }}>
              There's no way past this door — that's the point. The only path is to
              erase everything on this device and start over. Your words are
              deleted, not exposed.
            </p>
            {confirmErase === 1 ? (
              <button type="button" className="sf-link-quiet" onClick={() => setConfirmErase(2)} style={{ color: "var(--sf-text-faint)" }}>
                I understand — erase everything
              </button>
            ) : (
              <button type="button" className="sf-btn" onClick={doErase} style={{ marginTop: 8 }}>
                Erase and start over
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
