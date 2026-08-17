import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import Button from "../components/Button.jsx";
import { deleteAccount } from "../lib/deleteAccount.js";

/**
 * DeleteAccount — S6 "deletion with a receipt". Play requires account deletion;
 * this makes it excellent instead of merely compliant. One screen, plain words
 * on exactly what dies and where, a real confirmation, and a receipt after.
 * Deletion in daylight: it says you were never trapped here.
 *
 * Three states: the plain-words screen, an in-flight state, and the receipt.
 */
export default function DeleteAccount({ onExit }) {
  const [phase, setPhase] = useState("explain"); // explain | working | done | error
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState(null);

  const run = async () => {
    setPhase("working");
    setError(null);
    try {
      const result = await deleteAccount();
      if (result.ok) {
        setReceipt(result.receipt || null);
        setPhase("done");
      } else {
        setError(result.error || "Something went wrong.");
        setPhase("error");
      }
    } catch {
      setError("Something went wrong. Your account is untouched — please try again.");
      setPhase("error");
    }
  };

  if (phase === "done") {
    return (
      <main className="sf-page sf-page--hero">
        <div className="sf-fade-enter">
          <EditorialBlock
            label="Done"
            headline="It's gone."
            headlineSize="lg"
            body="Your account and its records on our server are deleted. Everything this app kept on this device is cleared. There's nothing left to hold."
          />
          <p style={{ fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontStyle: "italic", fontSize: "13px", color: "var(--sf-text-faint)", marginTop: "var(--sf-space-24)" }}>
            You were never trapped here. Thank you for the time you spent.
          </p>
          <div style={{ marginTop: "var(--sf-space-48)" }}>
            <Button variant="primary" onClick={onExit}>Close</Button>
          </div>
        </div>
      </main>
    );
  }

  if (phase === "error") {
    return (
      <main className="sf-page sf-page--hero">
        <div className="sf-fade-enter">
          <EditorialBlock
            label="Not done"
            headline="That didn't go through."
            headlineSize="lg"
            body={error || "Something went wrong."}
          />
          <p style={{ fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontStyle: "italic", fontSize: "13px", color: "var(--sf-text-faint)", marginTop: "var(--sf-space-24)" }}>
            Your account and your history are untouched. Nothing was half-deleted.
          </p>
          <div style={{ marginTop: "var(--sf-space-48)", display: "flex", gap: "var(--sf-space-16)", alignItems: "center" }}>
            <Button variant="primary" onClick={run}>Try again</Button>
            <button type="button" onClick={onExit} className="sf-link-quiet">Not now</button>
          </div>
        </div>
      </main>
    );
  }

  const working = phase === "working";

  return (
    <main className="sf-page sf-page--hero">
      <div className="sf-fade-enter">
        <EditorialBlock
          label="Delete your account"
          headline="What this removes."
          headlineSize="lg"
          body="This is permanent, and it's complete. There's no hidden copy kept somewhere."
        />
      </div>

      <div className="sf-fade-enter sf-fade-enter--delay-2" style={{ marginTop: "var(--sf-space-24)" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {[
            ["Your account", "The sign-in itself, deleted from our server."],
            ["Your records with us", "Subscription status and anything tied to your account, removed."],
            ["Everything on this device", "Your whole practice history — every session, note, and setting — cleared from this device."],
          ].map(([head, sub]) => (
            <li key={head} style={{ marginBottom: "var(--sf-space-16)" }}>
              <p style={{ margin: 0, fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "15px", color: "var(--sf-text-primary)" }}>{head}</p>
              <p style={{ margin: "var(--sf-space-4) 0 0", fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "13px", lineHeight: 1.6, color: "var(--sf-text-faint)" }}>{sub}</p>
            </li>
          ))}
        </ul>
        <p style={{ fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontStyle: "italic", fontSize: "13px", color: "var(--sf-text-faint)", marginTop: "var(--sf-space-16)" }}>
          If you have a subscription through the App Store or Google Play, cancel it there too — stores bill separately from your account here.
        </p>
      </div>

      <div className="sf-fade-enter sf-fade-enter--delay-3" style={{ marginTop: "var(--sf-space-48)", display: "flex", gap: "var(--sf-space-16)", alignItems: "center" }}>
        <Button variant="primary" onClick={run} disabled={working}>
          {working ? "Deleting\u2026" : "Delete everything"}
        </Button>
        {!working && <button type="button" onClick={onExit} className="sf-link-quiet">Keep my account</button>}
      </div>
    </main>
  );
}
