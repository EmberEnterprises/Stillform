import React, { useState, useEffect, useRef } from "react";
import Button from "../../components/Button.jsx";
import MonoLabel from "../../components/MonoLabel.jsx";
import HairlineDivider from "../../components/HairlineDivider.jsx";
import { sendReframeMessage } from "../../lib/reframeApi.js";

/**
 * Reframe — the middle step of the spine. AI metacognition partner.
 *
 * Per STILLFORM_CANON.md §7: AI-assisted metacognition; modes auto-routed
 * from feel state + input content. The AI is the practice partner.
 *
 * Per the substance critique (canon §10, May 14): the AI should produce
 * differentiation, not empathy or textbook reflection. The reframe.js
 * backend has the prompts; v2 calls it with the same payload v1 used.
 *
 * Visual: editorial conversation. AI messages are serif body at editorial
 * scale (body-lg in display-md container) so they feel like reading, not
 * chat. User messages are smaller mono-styled with hairline above. Plenty
 * of breathing between turns. Latest message scrolls into view.
 *
 * Phase 2 scope: multi-turn conversation, user can tap "I'm done" to
 * advance to Close. The Reframe Step 2 sub-beats (pick where you are now
 * → name what shifted → pick a next move → lock in) are deferred to a
 * later phase — Phase 2 ships basic Reframe so the spine works end-to-end.
 *
 * @param {string} precisionName  what the user named in Notice
 * @param {string|null} selectedChip  feel-state hint (or null)
 * @param {function(object): void} onContinue  Called with final state {history, takeaway}
 * @param {function(): void} onSwitchToSelfMode  switch to SelfReframe (offered on API error)
 * @param {function(): void} onExit
 */
export default function Reframe({ beat = null, todayThread = null, precisionName, selectedChip, onContinue, onSwitchToSelfMode, onExit }) {
  // history is the wire-shape sent to the backend: [{role, text}]
  const [history, setHistory] = useState([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const bottomRef = useRef(null);

  // Open the session — send the precision-name to the AI as the first turn.
  useEffect(() => {
    let cancelled = false;

    const open = async () => {
      setThinking(true);
      setError(null);
      const result = await sendReframeMessage({
        input: precisionName,
        history: [],
        feelState: selectedChip,
        beat,
        todayThread,
      });
      if (cancelled) return;

      if (result.error) {
        setError(result.error);
        setThinking(false);
        return;
      }

      setHistory([
        { role: "user", text: precisionName },
        { role: "assistant", text: result.reframe, question: result.question, next_step: result.next_step },
      ]);
      setThinking(false);
      setInitialized(true);
    };

    open();
    return () => { cancelled = true; };
    // precisionName / selectedChip are stable across this surface's lifetime —
    // the parent re-mounts Reframe if they change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll latest turn into view.
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [history.length, thinking]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || thinking) return;

    const nextHistory = [...history, { role: "user", text }];
    setHistory(nextHistory);
    setDraft("");
    setThinking(true);
    setError(null);

    const result = await sendReframeMessage({
      input: text,
      history: nextHistory,
      feelState: selectedChip,
      beat,
      todayThread,
    });

    if (result.error) {
      setError(result.error);
      setThinking(false);
      return;
    }

    setHistory([
      ...nextHistory,
      { role: "assistant", text: result.reframe, question: result.question, next_step: result.next_step },
    ]);
    setThinking(false);
  };

  const handleClose = () => {
    // Pass the conversation up — Close surface picks the last assistant
    // message as the takeaway.
    const lastAssistant = [...history].reverse().find((m) => m.role === "assistant");
    onContinue({
      history,
      takeaway: lastAssistant ? lastAssistant.text : null,
    });
  };

  // Phase 3.5 #3: at least one user reply in Reframe is required before
  // Close is reachable. Without this gate, a user could type one Notice
  // precision, receive one AI response, and close — meaning the AI did
  // all the metacognitive work and the user did none. Audit on May 16
  // surfaced this exact pattern. The user-led principle (CANON §7.1)
  // requires the user to engage in the back-and-forth before the
  // session is reachable to close.
  //
  // Counting: history[0] is always the precisionName from Notice. So
  // we require ≥2 user messages — Notice precision + at least one
  // genuine reply in the Reframe arc.
  const userMessageCount = history.filter((m) => m.role === "user").length;
  const hasUserReplied = userMessageCount >= 2;

  return (
    <main className="sf-page">
      <div className="sf-fade-enter" style={{ marginBottom: "var(--sf-space-32)" }}>
        <MonoLabel
          size="xs"
          tone="faint"
          infoTitle="Reframe"
          infoBody="Active retrieval and assumption check. The AI helps you examine what's underneath what you named, find what's actually true, and identify the next move. Active recall strengthens metacognitive capacity over time (Roediger & Karpicke 2006). Wells 2009 metacognitive therapy framework."
        >Reframe</MonoLabel>
      </div>

      {/* Conversation turns. Editorial layout: serif body-lg for AI,
          smaller body-sm for user, hairlines as turn separators. */}
      <div className="sf-fade-enter sf-fade-enter--delay-1">
        {history.map((msg, i) => (
          <Turn key={i} role={msg.role} text={msg.text} question={msg.question} />
        ))}

        {thinking ? (
          <div style={{ padding: "var(--sf-space-24) 0", textAlign: "center" }}>
            <span className="sf-thinking-dot" aria-hidden="true" />
            <span className="sf-thinking-dot" aria-hidden="true" />
            <span className="sf-thinking-dot" aria-hidden="true" />
            <span style={{ position: "absolute", left: "-9999px" }}>thinking</span>
          </div>
        ) : null}

        {error ? (
          <div style={{ padding: "var(--sf-space-24) 0" }}>
            <MonoLabel size="sm" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
              {error}
            </MonoLabel>
            {/*
              When the AI errors, the user shouldn't be stranded. Self-led
              practice is the same Notice → Reframe → Close practice, the
              user writes it themselves. Offer it prominently. If the
              parent passes onSwitchToSelfMode, the user can switch on the
              spot without losing the named precision.
            */}
            {typeof onSwitchToSelfMode === "function" ? (
              <p
                style={{
                  margin: 0,
                  color: "var(--sf-text-quiet)",
                  fontFamily: "var(--sf-font-sans)",
                  fontSize: "15px",
                  lineHeight: 1.55,
                  fontWeight: 300,
                  marginBottom: "var(--sf-space-16)",
                }}
              >
                The AI's not responding. Switch to self-led — same practice, you write it.
              </p>
            ) : null}
            <div style={{ display: "flex", gap: "var(--sf-space-12)", flexWrap: "wrap" }}>
              {typeof onSwitchToSelfMode === "function" ? (
                <button
                  type="button"
                  onClick={onSwitchToSelfMode}
                  className="sf-link-quiet"
                  style={{ color: "var(--sf-accent)" }}
                >
                  Switch to self-led ›
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        <div ref={bottomRef} aria-hidden="true" />
      </div>

      {/* Reply input + actions */}
      {initialized || error ? (
        <div
          className="sf-fade-enter sf-fade-enter--delay-2"
          style={{ marginTop: "var(--sf-space-48)" }}
        >
          <textarea
            className="sf-textarea"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Reply, or refine what's present…"
            rows={3}
            aria-label="Reply to the reframe"
            onKeyDown={(e) => {
              // Cmd/Ctrl + Enter sends.
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <div
            style={{
              marginTop: "var(--sf-space-24)",
              display: "flex",
              alignItems: "center",
              gap: "var(--sf-space-12)",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={!draft.trim() || thinking}
              aria-disabled={!draft.trim() || thinking}
            >
              Send
            </Button>
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={thinking || !hasUserReplied}
              aria-disabled={thinking || !hasUserReplied}
              aria-label={!hasUserReplied ? "Reply at least once before closing" : "Close the session"}
              style={
                !hasUserReplied && !thinking
                  ? { opacity: 0.4, cursor: "default", pointerEvents: "none" }
                  : undefined
              }
            >
              I'm done
            </Button>
            <Button variant="ghost" onClick={onExit}>
              Back
            </Button>
          </div>

          {/* Phase 3.5 #3: quiet helper when the close gate is engaged.
              Affordances should explain themselves once the user looks. */}
          {initialized && !error && !hasUserReplied && !thinking ? (
            <p
              style={{
                marginTop: "var(--sf-space-16)",
                marginBottom: 0,
                color: "var(--sf-text-quiet)",
                fontFamily: "var(--sf-font-mono)",
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                opacity: 0.7,
              }}
            >
              Reply first — then close
            </p>
          ) : null}
        </div>
      ) : null}
    </main>
  );
}

/* -----------------------------------------------------------------------
 * Turn — one turn in the conversation.
 *
 * AI messages get editorial weight (body-lg, cream text). User messages
 * get smaller mono treatment (body-sm, text-quiet) with a hairline rule
 * above so the alternation reads as conversation without resorting to
 * chat-bubble aesthetics.
 * -------------------------------------------------------------------- */
function Turn({ role, text, question }) {
  if (role === "user") {
    return (
      <div style={{ padding: "var(--sf-space-24) 0" }}>
        <HairlineDivider width="short" weight="hairline" />
        <div
          style={{
            marginTop: "var(--sf-space-16)",
            color: "var(--sf-text-quiet)",
            fontFamily: "var(--sf-font-sans)",
            fontSize: "13px",
            lineHeight: 1.55,
            whiteSpace: "pre-wrap",
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "var(--sf-space-32) 0 var(--sf-space-16)" }}>
      <p
        className="sf-body-lg"
        style={{
          margin: 0,
          color: "var(--sf-text-cream)",
          fontFamily: "var(--sf-font-serif)",
          fontSize: "20px",
          lineHeight: 1.5,
          fontWeight: 400,
          whiteSpace: "pre-wrap",
        }}
      >
        {text}
      </p>
      {question ? (
        <p
          style={{
            marginTop: "var(--sf-space-16)",
            color: "var(--sf-text-quiet)",
            fontFamily: "var(--sf-font-sans)",
            fontSize: "15px",
            lineHeight: 1.55,
            fontStyle: "italic",
          }}
        >
          {question}
        </p>
      ) : null}
    </div>
  );
}
