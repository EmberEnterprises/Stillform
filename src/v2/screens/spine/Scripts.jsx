import React, { useState } from "react";
import EditorialBlock from "../../components/EditorialBlock.jsx";
import MonoLabel from "../../components/MonoLabel.jsx";
import Button from "../../components/Button.jsx";
import { generateScript } from "../../lib/scriptsApi.js";

/**
 * Scripts — "State to Statement" surface (Phase 6.5b).
 *
 * The application-takeaway that turns what the user just worked through into
 * one send-ready line in their own voice — for the hard conversation, the
 * boundary, the message they've been avoiding. The backend
 * (netlify/functions/scripts.js) generates in operator-tier voice; this
 * surface gathers the situation (+ optional recipient / outcome / channel),
 * shows the line and its short "move" label, and lets them copy, regenerate,
 * or edit. It never tells them what they MUST say — it hands them a draft
 * they own and edit before it leaves them.
 *
 * Self-contained, like MoveCard / Reset:
 *   - seed   — optional string to prefill the situation (the takeaway from
 *              the close that launched this). Editable.
 *   - onDone — finished (the script is theirs to carry out).
 *   - onExit — backed out without a script.
 * Both currently route home via the parent (Spine).
 *
 * Ephemeral: nothing is stored — a script is a one-time deployable.
 * Crisis: if the situation reads as crisis, the backend returns a redirect
 * instead of a line; we surface that, never a generated script.
 */

const CHANNELS = [
  { id: "text", label: "Text" },
  { id: "email", label: "Email" },
  { id: "in-person", label: "In person" },
  { id: "voice", label: "Voice" },
];

const SCRIPT_TEXT = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "var(--sf-text-display-sm, 26px)",
  lineHeight: 1.35,
  color: "var(--sf-text-primary)",
  margin: 0,
  whiteSpace: "pre-wrap",
};

const NOTE_TEXT = {
  fontFamily: "var(--sf-font-sans)",
  fontSize: "14px",
  lineHeight: 1.5,
  color: "var(--sf-text-secondary)",
  margin: 0,
};

const FIELD_LABEL = { display: "block", marginBottom: "var(--sf-space-8)" };

export default function Scripts({ seed = "", onDone, onExit }) {
  const [phase, setPhase] = useState("input"); // input | generating | result | crisis | error
  const [situation, setSituation] = useState(typeof seed === "string" ? seed : "");
  const [recipient, setRecipient] = useState("");
  const [outcome, setOutcome] = useState("");
  const [channel, setChannel] = useState("text");

  const [script, setScript] = useState("");
  const [tone, setTone] = useState("");
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const canGenerate = situation.trim().length >= 8;

  const run = async () => {
    if (!canGenerate) return;
    setPhase("generating");
    setErrorMsg("");
    setCopied(false);
    try {
      const res = await generateScript({ situation, recipient, outcome, channel });
      if (res.crisis) {
        setNote(res.note || "");
        setPhase("crisis");
        return;
      }
      if (res.error || !res.script) {
        setErrorMsg(res.error || "Couldn't draft that. Try again.");
        setPhase("error");
        return;
      }
      setScript(res.script);
      setTone(res.tone || "");
      setNote(res.note || "");
      setPhase("result");
      try { window.plausible?.("Script Generated", { props: { channel } }); } catch { /* analytics non-fatal */ }
    } catch {
      setErrorMsg("Couldn't reach the network. Try again.");
      setPhase("error");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      try { window.plausible?.("Script Copied"); } catch { /* non-fatal */ }
    } catch {
      /* clipboard blocked — text is on screen to select manually */
    }
  };

  // ---- INPUT ----
  if (phase === "input") {
    return (
      <main className="sf-page sf-page--hero">
        <div className="sf-fade-enter">
          <EditorialBlock
            label="Scripts"
            headline="Need the words?"
            headlineSize="lg"
            body="The conversation you've been turning over — drafted into one line you could actually send. Your voice, clarified. You edit anything before it leaves you."
          />
        </div>

        <div className="sf-fade-enter sf-fade-enter--delay-1" style={{ marginTop: "var(--sf-space-32)" }}>
          <MonoLabel size="xs" tone="faint" style={FIELD_LABEL}>What's the situation?</MonoLabel>
          <textarea
            className="sf-textarea"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="What's going on, and what you need to say…"
            rows={3}
            aria-label="The situation"
            autoFocus
          />
        </div>

        <div className="sf-fade-enter sf-fade-enter--delay-2" style={{ marginTop: "var(--sf-space-24)" }}>
          <MonoLabel size="xs" tone="faint" style={FIELD_LABEL}>Who's it for? (optional)</MonoLabel>
          <input
            className="sf-input"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="A name, a role, or leave it"
            aria-label="Who it's for"
          />
        </div>

        <div className="sf-fade-enter sf-fade-enter--delay-2" style={{ marginTop: "var(--sf-space-24)" }}>
          <MonoLabel size="xs" tone="faint" style={FIELD_LABEL}>What do you want to happen? (optional)</MonoLabel>
          <input
            className="sf-input"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder="The outcome you're after"
            aria-label="What you want to happen"
          />
        </div>

        <div className="sf-fade-enter sf-fade-enter--delay-3" style={{ marginTop: "var(--sf-space-24)" }}>
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-12)" }}>
            How are you saying it?
          </MonoLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sf-space-8)" }}>
            {CHANNELS.map((c) => {
              const active = channel === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setChannel(c.id)}
                  aria-pressed={active}
                  style={{
                    padding: "var(--sf-space-8) var(--sf-space-16)",
                    borderRadius: "999px",
                    border: active
                      ? "1px solid var(--sf-text-primary)"
                      : "0.5px solid var(--sf-border-quiet)",
                    background: active ? "var(--sf-text-primary)" : "transparent",
                    color: active ? "var(--sf-ground-deep)" : "var(--sf-text-secondary)",
                    fontFamily: "var(--sf-font-mono)",
                    fontSize: "12px",
                    letterSpacing: "0.04em",
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="sf-fade-enter sf-fade-enter--delay-3"
          style={{ marginTop: "var(--sf-space-48)", display: "flex", alignItems: "center", gap: "var(--sf-space-16)" }}
        >
          <Button
            variant="primary"
            onClick={run}
            disabled={!canGenerate}
            aria-disabled={!canGenerate}
            style={!canGenerate ? { opacity: 0.4, cursor: "not-allowed" } : undefined}
          >
            Get the words
          </Button>
          <button type="button" onClick={onExit} className="sf-link-quiet">
            Not now ›
          </button>
        </div>
      </main>
    );
  }

  // ---- GENERATING ----
  if (phase === "generating") {
    return (
      <main className="sf-page sf-page--hero">
        <div className="sf-fade-enter" style={{ marginTop: "var(--sf-space-64)" }}>
          <MonoLabel size="xs" tone="faint">Finding the line…</MonoLabel>
        </div>
      </main>
    );
  }

  // ---- CRISIS ----
  if (phase === "crisis") {
    return (
      <main className="sf-page sf-page--hero">
        <div className="sf-fade-enter">
          <EditorialBlock
            label="Scripts"
            headline="This one's bigger than a script."
            headlineSize="lg"
            body={
              note ||
              "What you're describing sounds beyond what a script can hold. Stillform has a Crisis Resources screen in Settings, or call 988 (US Suicide & Crisis Lifeline). The script can wait until you're safe."
            }
          />
        </div>
        <div className="sf-fade-enter sf-fade-enter--delay-2" style={{ marginTop: "var(--sf-space-48)" }}>
          <Button variant="primary" onClick={onDone}>Okay</Button>
        </div>
      </main>
    );
  }

  // ---- ERROR ----
  if (phase === "error") {
    return (
      <main className="sf-page sf-page--hero">
        <div className="sf-fade-enter">
          <EditorialBlock label="Scripts" headline="Didn't come through." headlineSize="lg" body={errorMsg} />
        </div>
        <div
          className="sf-fade-enter sf-fade-enter--delay-2"
          style={{ marginTop: "var(--sf-space-48)", display: "flex", alignItems: "center", gap: "var(--sf-space-16)" }}
        >
          <Button variant="primary" onClick={() => setPhase("input")}>Try again</Button>
          <button type="button" onClick={onExit} className="sf-link-quiet">Leave it ›</button>
        </div>
      </main>
    );
  }

  // ---- RESULT ----
  return (
    <main className="sf-page sf-page--hero">
      <div className="sf-fade-enter">
        {tone ? (
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
            {tone}
          </MonoLabel>
        ) : null}
        <p style={SCRIPT_TEXT}>{script}</p>
      </div>

      {note ? (
        <div className="sf-fade-enter sf-fade-enter--delay-1" style={{ marginTop: "var(--sf-space-24)" }}>
          <p style={NOTE_TEXT}>{note}</p>
        </div>
      ) : null}

      <div
        className="sf-fade-enter sf-fade-enter--delay-2"
        style={{
          marginTop: "var(--sf-space-48)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "var(--sf-space-16)",
        }}
      >
        <Button variant="primary" onClick={copy}>{copied ? "Copied" : "Copy"}</Button>
        <button type="button" onClick={run} className="sf-link-quiet">Try another ›</button>
        <button type="button" onClick={() => setPhase("input")} className="sf-link-quiet">Edit ›</button>
        <button type="button" onClick={onDone} className="sf-link-quiet">Done ›</button>
      </div>

      <div className="sf-fade-enter sf-fade-enter--delay-3" style={{ marginTop: "var(--sf-space-24)" }}>
        <MonoLabel size="xs" tone="faint">Your words. Edit before they leave you.</MonoLabel>
      </div>
    </main>
  );
}
