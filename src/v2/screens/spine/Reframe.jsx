import React, { useState, useEffect, useRef } from "react";
import { keepLine, isKept, unkeepLine } from "../../lib/keepShelf.js";
import Button from "../../components/Button.jsx";
import MonoLabel from "../../components/MonoLabel.jsx";
import SpineBack from "../../components/SpineBack.jsx";
import MicButton from "../../components/MicButton.jsx";
import HairlineDivider from "../../components/HairlineDivider.jsx";
import { sendReframeMessage } from "../../lib/reframeApi.js";
import { recordPrediction } from "../../lib/predictionLog.js";
import { setPendingCandidate } from "../../lib/vulnerabilities.js";
import { setPendingCandidate as setPendingMove } from "../../lib/protectiveMoves.js";
import { setPendingCandidate as setPendingStrength } from "../../lib/strengths.js";
import { setPendingCandidate as setPendingValue } from "../../lib/values.js";
import { setPendingCandidate as setPendingWindow } from "../../lib/windowRead.js";
import { getWatchListChips } from "../../lib/biasProfile.js";
import { noteAiPatternDetection } from "../../lib/biasProfile.js";
import { getOtherRead } from "../../lib/otherReadApi.js";

/**
 * Reframe — the middle step of the spine. AI metacognition partner.
 *
 * Per STILLFORM_CANON.md §7: AI-assisted metacognition; modes auto-routed
 * from feel state + input content. The AI is the practice partner.
 *
 * Per the substance critique (canon §10, May 14): the AI should produce
 * differentiation, not empathy or textbook reflection. The reframe.js
 * backend has the prompts; Stillform calls it with the canonical payload.
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
  // Trigger-tagging (June 18 2026): the AI may PROPOSE a discrete trigger label
  // (only one the user raised). pendingTrigger holds an unconfirmed proposal;
  // confirmedTrigger is set only when the user taps Confirm. Skippable.
  const [pendingTrigger, setPendingTrigger] = useState(null);
  const [confirmedTrigger, setConfirmedTrigger] = useState(null);

  // The other read — optional, user-aimed devil's advocate (offer register).
  const [orOpen, setOrOpen] = useState(false);
  const [orTarget, setOrTarget] = useState("");
  const [orLoading, setOrLoading] = useState(false);
  const [orResult, setOrResult] = useState(null); // { arguable, otherRead, note, crisis, error }

  function openOtherRead() {
    const lastUser = [...history].reverse().find((m) => m.role === "user");
    setOrTarget(lastUser?.text ? String(lastUser.text).trim().slice(0, 400) : "");
    setOrResult(null);
    setOrOpen(true);
    try { window.plausible?.("Other Read Opened", { props: { surface: "reframe" } }); } catch {}
  }
  async function runOtherRead() {
    const t = orTarget.trim();
    if (orLoading || t.length < 4) return;
    setOrLoading(true);
    const r = await getOtherRead({ thought: t });
    setOrResult(r);
    setOrLoading(false);
    try {
      window.plausible?.("Other Read Returned", {
        props: { surface: "reframe", outcome: r.error ? "error" : r.arguable ? "counter-read" : r.crisis ? "crisis" : "not-arguable" },
      });
    } catch {}
  }
  function closeOtherRead() { setOrOpen(false); setOrResult(null); setOrTarget(""); }
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

      // 5.11(d): record the AI's machine-side pattern read against the watch
      // list — counts only patterns the user already tracks, per-day deduped,
      // fail-silent. Governed by ZERO FABRICATION (genuine confident reads only).
      if (result.distortion) noteAiPatternDetection(result.distortion);

      maybeProposeTrigger(result.trigger);
      maybeStashVulnerability(result.surfaceVulnerability);
      maybeStashProtectiveMove(result.surfaceProtectiveMove);
      maybeStashStrength(result.surfaceStrength);
      maybeStashValue(result.surfaceValue);
      maybeStashWindow(result.surfaceWindow);

      setHistory([
        { role: "user", text: precisionName },
        { role: "assistant", text: result.reframe, question: result.question, next_step: result.next_step, log_prediction: result.log_prediction || null,
          mode: result.mode || null, taken_apart: result.taken_apart || null, shape: result.shape || null, rebuilt: result.rebuilt || null },
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

    if (result.distortion) noteAiPatternDetection(result.distortion); // 5.11(d)

    maybeProposeTrigger(result.trigger);
    maybeStashVulnerability(result.surfaceVulnerability);
    maybeStashProtectiveMove(result.surfaceProtectiveMove);
    maybeStashStrength(result.surfaceStrength);
    maybeStashValue(result.surfaceValue);
    maybeStashWindow(result.surfaceWindow);

    setHistory([
      ...nextHistory,
      { role: "assistant", text: result.reframe, question: result.question, next_step: result.next_step, log_prediction: result.log_prediction || null,
        mode: result.mode || null, taken_apart: result.taken_apart || null, shape: result.shape || null, rebuilt: result.rebuilt || null },
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
      // Trigger-tagging: the user-confirmed discrete trigger (or null). The
      // spine tags it at save (tagTrigger → signal log + encounter).
      confirmedTrigger: confirmedTrigger || null,
    });
  };

  // Hold an AI-proposed trigger for the user to confirm. Tolerates a string or
  // a { label } object. Never auto-confirms; ignored once the user has acted.
  function maybeProposeTrigger(proposal) {
    if (confirmedTrigger) return;
    const lbl =
      typeof proposal === "string"
        ? proposal.trim()
        : proposal && typeof proposal.label === "string"
        ? proposal.label.trim()
        : "";
    if (lbl) setPendingTrigger(lbl);
  }

  // Stash an AI-proposed vulnerability (one trait, both edges) as PENDING for the
  // user to confirm/correct/reject later on the Vulnerabilities surface. Passive:
  // never shown mid-session (rumination guard). The lib refuses to stash a trait
  // already confirmed or previously rejected, and validates both edges.
  function maybeStashVulnerability(proposal) {
    if (proposal && typeof proposal === "object") setPendingCandidate(proposal);
  }

  // Stash an AI-proposed protective move (one move, both edges) as PENDING for the
  // user to confirm/correct/reject later on the Protective Moves surface. Same
  // passive discipline as the vulnerability stash — never shown mid-session
  // (rumination guard); the lib refuses a move already confirmed/dismissed and
  // validates both edges.
  function maybeStashProtectiveMove(proposal) {
    if (proposal && typeof proposal === "object") setPendingMove(proposal);
  }
  function maybeStashStrength(proposal) {
    if (proposal && typeof proposal === "object") setPendingStrength(proposal);
  }
  function maybeStashValue(proposal) {
    if (proposal && typeof proposal === "object") setPendingValue(proposal);
  }
  function maybeStashWindow(proposal) {
    if (proposal && typeof proposal === "object") setPendingWindow(proposal);
  }

  const handleConfirmTrigger = () => {
    if (pendingTrigger) setConfirmedTrigger(pendingTrigger);
    setPendingTrigger(null);
  };

  const handleSkipTrigger = () => {
    setPendingTrigger(null);
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
      <SpineBack onBack={onExit} />
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
          <Turn key={i} role={msg.role} text={msg.text} question={msg.question} log_prediction={msg.log_prediction}
            mode={msg.mode} taken_apart={msg.taken_apart} shape={msg.shape} rebuilt={msg.rebuilt} />
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
            <MonoLabel size="sm" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-8)" }}>
              {error}
            </MonoLabel>
            {/* W9 trust line: their message already lives in the thread above —
                say so, because the fear of loss is the trust-killer. */}
            <p style={{ margin: "0 0 var(--sf-space-16)", fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontStyle: "italic", fontSize: "13px", color: "var(--sf-text-faint)" }}>
              Your words are safe in the thread above — nothing was lost.
            </p>
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

      {/* Trigger-tagging: confirm an AI-proposed trigger the user raised.
          The user is the authority — Confirm logs it, Skip drops it. */}
      {pendingTrigger && !confirmedTrigger ? (
        <div
          className="sf-fade-enter"
          style={{
            marginTop: "var(--sf-space-24)",
            paddingTop: "var(--sf-space-16)",
            borderTop: "1px solid var(--sf-border-hairline)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--sf-font-serif)",
              fontSize: "17px",
              color: "var(--sf-text-faint)",
              margin: "0 0 var(--sf-space-12) 0",
            }}
          >
            Tag this as <span style={{ color: "var(--sf-text-primary)" }}>{pendingTrigger}</span>?
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sf-space-16)" }}>
            <Button variant="ghost" onClick={handleConfirmTrigger}>Yes, tag it</Button>
            <button type="button" className="sf-link-quiet" onClick={handleSkipTrigger}>
              Not this
            </button>
          </div>
        </div>
      ) : null}

      {confirmedTrigger ? (
        <p
          className="sf-fade-enter"
          style={{
            marginTop: "var(--sf-space-24)",
            fontFamily: "var(--sf-font-serif)",
            fontSize: "15px",
            color: "var(--sf-text-faint)",
          }}
        >
          Tagged: {confirmedTrigger}
        </p>
      ) : null}

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
            placeholder="Reply, add what else is here, or push back…"
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

          <div style={{ marginTop: "var(--sf-space-12)", display: "flex", justifyContent: "flex-end" }}>
            <MicButton onTranscript={(t) => setDraft((d) => (d ? d + " " : "") + t.trim())} />
          </div>

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
            {/* D5: one chapter rule per row — Send carries it; siblings go quiet. */}
            <Button
              variant="ghost"
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

          {/* The other read — optional, user-aimed devil's advocate. Quiet by
              design: never auto-fired, the user names the thought, and the
              backend refuses to argue a feeling, a value, a boundary, grief, or
              a real bad situation. */}
          {initialized && userMessageCount >= 1 && !orOpen ? (
            <button
              type="button"
              className="sf-link-quiet"
              onClick={openOtherRead}
              style={{ marginTop: "var(--sf-space-24)", color: "var(--sf-accent)" }}
            >
              Want the other read on a thought? ›
            </button>
          ) : null}

          {orOpen ? (
            <div
              className="sf-fade-enter"
              style={{
                marginTop: "var(--sf-space-24)",
                paddingTop: "var(--sf-space-16)",
                borderTop: "1px solid var(--sf-border-hairline)",
              }}
            >
              <p style={{ fontFamily: "var(--sf-font-serif)", fontSize: "17px", color: "var(--sf-text-faint)", margin: "0 0 var(--sf-space-12) 0" }}>
                Which thought do you want to test?
              </p>
              <textarea
                className="sf-textarea"
                value={orTarget}
                onChange={(e) => setOrTarget(e.target.value)}
                placeholder="the belief, in a line — e.g. they're done with me"
                rows={2}
                aria-label="The thought to test"
              />

              {orResult && orResult.error ? (
                <p style={{ fontFamily: "var(--sf-font-serif)", fontSize: "15px", color: "var(--sf-text-faint)", marginTop: "var(--sf-space-16)" }}>
                  {orResult.error}
                </p>
              ) : null}

              {orResult && !orResult.error && orResult.arguable ? (
                <div style={{ marginTop: "var(--sf-space-16)" }}>
                  <p style={{ fontFamily: "var(--sf-font-mono)", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--sf-text-quiet)", margin: "0 0 var(--sf-space-12) 0" }}>
                    The other read — yours to weigh
                  </p>
                  <p style={{ fontFamily: "var(--sf-font-serif)", fontSize: "17px", lineHeight: 1.55, color: "var(--sf-text-primary)", margin: 0 }}>
                    {orResult.otherRead}
                  </p>
                  {orResult.note ? (
                    <p style={{ fontFamily: "var(--sf-font-serif)", fontSize: "14px", color: "var(--sf-text-faint)", marginTop: "var(--sf-space-12)" }}>{orResult.note}</p>
                  ) : null}
                </div>
              ) : null}

              {orResult && !orResult.error && !orResult.arguable ? (
                <p style={{ fontFamily: "var(--sf-font-serif)", fontSize: "17px", lineHeight: 1.55, color: "var(--sf-text-faint)", marginTop: "var(--sf-space-16)" }}>
                  {orResult.note || "This one isn't a distortion to argue with — leave it be."}
                </p>
              ) : null}

              <div style={{ display: "flex", alignItems: "center", gap: "var(--sf-space-16)", marginTop: "var(--sf-space-16)" }}>
                {!orResult ? (
                  <Button variant="ghost" onClick={runOtherRead} disabled={orLoading || orTarget.trim().length < 4}>
                    {orLoading ? "Thinking…" : "Show the other read"}
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={() => setOrResult(null)}>
                    Try another thought
                  </Button>
                )}
                <button type="button" className="sf-link-quiet" onClick={closeOtherRead}>
                  {orResult ? "Done" : "Never mind"}
                </button>
              </div>
            </div>
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

/* Strip inline markdown emphasis (*, _, `, ** , __) from AI-authored text
   before display. The model occasionally reaches for emphasis; in this
   editorial serif UI it renders as raw asterisks/underscores around a word —
   which sets that word (often a belief, like a user's God) apart and reads as
   the AI holding it at arm's length. FRAMING LAW: the user's words and beliefs
   are met plainly, never editorialized. Paired markers only; lone punctuation
   and the user's own quotation marks are left untouched. User turns are never
   passed through this. */
function stripInlineMarkdown(s) {
  if (typeof s !== "string") return s;
  return s
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/`(.+?)`/g, "$1");
}

/* CORE LOOP L2 — work-block chrome (CORE_LOOP_SPEC.md). The work renders
   as ruled manuscript units; phosphor/oxblood stay sworn (the tags below
   use the state palette, not the live/growth accents). */
const WORK_TAG_SAGE = { fontFamily: "var(--sf-font-mono)", fontSize: "9px", letterSpacing: "0.18em", color: "var(--sf-state-positive)" };
const WORK_TAG_OXBLOOD = { fontFamily: "var(--sf-font-mono)", fontSize: "9px", letterSpacing: "0.18em", color: "var(--sf-state-negative)" };

function WorkLabel({ children }) {
  return (
    <span style={{ display: "block", fontFamily: "var(--sf-font-mono)", fontSize: "9px", letterSpacing: "0.3em", color: "var(--sf-accent)", marginBottom: "var(--sf-space-8)" }}>
      {children}
    </span>
  );
}

/* Shape meta is rendered from THE APP'S OWN RECORDS, never from the model:
   the label must match a chip on the local watch list or nothing renders.
   Honest by construction — the server cannot invent counts. */
function ShapeMeta({ label }) {
  if (!label) return null;
  let meta = null;
  try {
    const chips = getWatchListChips();
    const hit = chips.find((c) => c.chip?.label === label);
    if (hit) {
      // getWatchListChips returns FLAT entries: {chip, lastSeen, encounterCount, ...}
      const seen = hit.encounterCount;
      const last = hit.lastSeen ? new Date(hit.lastSeen) : null;
      const parts = [];
      if (Number.isFinite(seen) && seen > 0) parts.push(`SEEN ${seen} TIME${seen === 1 ? "" : "S"}`);
      if (last && !Number.isNaN(last.getTime())) parts.push(`LAST: ${last.toLocaleDateString(undefined, { month: "short", day: "numeric" }).toUpperCase()}`);
      if (parts.length) meta = "ON YOUR WATCH LIST · " + parts.join(" · ");
    }
  } catch { meta = null; }
  if (!meta) return null;
  return (
    <p style={{ margin: "var(--sf-space-8) 0 0", fontFamily: "var(--sf-font-mono)", fontSize: "9.5px", letterSpacing: "0.14em", color: "var(--sf-text-faint)" }}>
      {meta}
    </p>
  );
}

function Turn({ role, text, question, log_prediction, mode, taken_apart, shape, rebuilt }) {
  const [logged, setLogged] = useState(false);
  const [kept, setKept] = useState(() => { try { return isKept(text); } catch { return false; } });

  if (role === "user") {
    return (
      <div style={{ padding: "var(--sf-space-24) 0" }}>
        <HairlineDivider width="short" weight="hairline" />
        {/* D3b (June 2 2026): the user's words ARE the manuscript — set in
            the serif, italic, full ink. Their writing is never the smallest
            quietest thing in their own practice. */}
        <div
          style={{
            marginTop: "var(--sf-space-16)",
            color: "var(--sf-text-primary)",
            fontFamily: "var(--sf-font-serif)",
            fontStyle: "italic",
            fontSize: "17px",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {text}
        </div>
        {/* J6a (2026-07-14): keep this line — the moment worth saving gets a
            home here instead of a screenshot. Toggle; resurfaces in Close. */}
        <button
          type="button"
          className="sf-link-quiet"
          onClick={() => {
            try {
              if (kept) { unkeepLine(text); setKept(false); }
              else { keepLine({ text, source: "guide" }); setKept(true); }
            } catch { /* fail-silent */ }
          }}
          aria-label={kept ? "Remove from kept lines" : "Keep this line"}
          style={{ marginTop: "var(--sf-space-8)", fontSize: "12px", opacity: 0.6 }}
        >
          {kept ? "kept ✓" : "keep this"}
        </button>
      </div>
    );
  }

  // log_prediction affordance (Precision Framework §5 #2 — What You Bet On).
  // Renders only when AI populated log_prediction this turn. User chooses to
  // accept; on click, write to predictionLog + fire Plausible event + flip
  // to confirmation. recordPrediction is fail-silent (returns null on bad
  // input or storage error) — we only flip to "logged" state on success.
  const handleLog = () => {
    if (!log_prediction || logged) return;
    const entry = recordPrediction({
      text: log_prediction.text,
      confidence: log_prediction.confidence,
    });
    if (entry) {
      setLogged(true);
      try {
        if (typeof window !== "undefined" && typeof window.plausible === "function") {
          window.plausible("Prediction Logged");
        }
      } catch { /* fail-silent */ }
    }
  };

  return (
    <div style={{ padding: "var(--sf-space-32) 0 var(--sf-space-16)" }}>
      {mode === "work" && taken_apart && (taken_apart.verified.length > 0 || taken_apart.assumed.length > 0) ? (
        <div style={{ borderTop: "1px solid var(--sf-border-hairline)", padding: "var(--sf-space-16) 0 var(--sf-space-8)", marginBottom: "var(--sf-space-12)" }}>
          <WorkLabel>TAKEN APART</WorkLabel>
          {taken_apart.verified.map((v, i) => (
            <p key={"v" + i} style={{ margin: "0 0 var(--sf-space-8)", fontSize: "14.5px", lineHeight: 1.6, color: "var(--sf-text-primary)" }}>
              <span style={WORK_TAG_SAGE}>verified — </span>{v}
            </p>
          ))}
          {taken_apart.assumed.map((a, i) => (
            <p key={"a" + i} style={{ margin: "0 0 var(--sf-space-8)", fontSize: "14.5px", lineHeight: 1.6, color: "var(--sf-text-quiet)" }}>
              <span style={WORK_TAG_OXBLOOD}>assumed — </span>{a}
            </p>
          ))}
        </div>
      ) : null}

      {mode === "work" && shape && shape.line ? (
        <div style={{ borderTop: "1px solid var(--sf-border-hairline)", padding: "var(--sf-space-16) 0 var(--sf-space-8)", marginBottom: "var(--sf-space-12)" }}>
          <WorkLabel>THE SHAPE</WorkLabel>
          <p style={{ margin: 0, fontSize: "15px", lineHeight: 1.6, color: "var(--sf-text-primary)" }}>
            {shape.line}
            {shape.watch_label ? <> <b style={{ color: "var(--sf-accent)", fontWeight: 300 }}>{shape.watch_label}</b> — yours.</> : null}
          </p>
          <ShapeMeta label={shape.watch_label} />
        </div>
      ) : null}

      {mode === "work" ? (
        <div style={{ borderTop: "1px solid var(--sf-border-hairline)", paddingTop: "var(--sf-space-16)" }}>
          <WorkLabel>REBUILT</WorkLabel>
        </div>
      ) : null}
      <p
        className="sf-body-lg"
        style={{
          margin: 0,
          color: "var(--sf-text-cream)",
          fontFamily: "var(--sf-font-serif)",
          fontSize: "20px",
          lineHeight: 1.5,
          fontWeight: 300,
          whiteSpace: "pre-wrap",
        }}
      >
        {stripInlineMarkdown(text)}
      </p>
      {mode === "work" && log_prediction ? (
        <div style={{ borderTop: "1px solid var(--sf-border-hairline)", padding: "var(--sf-space-16) 0 var(--sf-space-8)", marginTop: "var(--sf-space-12)" }}>
          <WorkLabel>ON RECORD</WorkLabel>
          <p style={{ margin: 0, fontSize: "14.5px", lineHeight: 1.6, color: "var(--sf-text-quiet)" }}>
            <b style={{ color: "var(--sf-text-primary)", fontWeight: 300 }}>"{log_prediction.text}"</b>
            {typeof log_prediction.confidence === "number" ? ` — at ${log_prediction.confidence}.` : " — your call, on the table."}
          </p>
          {logged ? (
            <p style={{ margin: "var(--sf-space-8) 0 0", fontFamily: "var(--sf-font-mono)", fontSize: "10px", letterSpacing: "0.18em", color: "var(--sf-text-faint)" }}>
              LOGGED — THE OUTCOME WILL ANSWER.
            </p>
          ) : (
            <button
              type="button"
              onClick={handleLog}
              style={{
                marginTop: "var(--sf-space-12)",
                background: "none",
                border: "none",
                borderTop: "1px solid var(--sf-accent-line)",
                borderBottom: "1px solid var(--sf-accent-line)",
                padding: "7px 10px",
                fontFamily: "var(--sf-font-mono)",
                fontSize: "10px",
                letterSpacing: "0.2em",
                color: "var(--sf-accent)",
                cursor: "pointer",
              }}
            >
              LOG THE BET
            </button>
          )}
        </div>
      ) : null}
      {question ? (
        <p
          style={{
            marginTop: "var(--sf-space-16)",
            color: "var(--sf-text-quiet)",
            fontFamily: "var(--sf-font-serif)",
            fontSize: "16px",
            lineHeight: 1.55,
            fontStyle: "italic",
          }}
        >
          {stripInlineMarkdown(question)}
        </p>
      ) : null}
      {!mode && log_prediction ? (
        logged ? (
          <p
            style={{
              marginTop: "var(--sf-space-16)",
              color: "var(--sf-text-quiet)",
              fontFamily: "var(--sf-font-sans)",
              fontSize: "13px",
              lineHeight: 1.55,
              fontStyle: "italic",
            }}
          >
            Logged — check back at end of day.
          </p>
        ) : (
          <button
            type="button"
            onClick={handleLog}
            style={{
              marginTop: "var(--sf-space-16)",
              background: "none",
              border: "none",
              padding: 0,
              color: "var(--sf-text-quiet)",
              fontFamily: "var(--sf-font-sans)",
              fontSize: "13px",
              lineHeight: 1.55,
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              cursor: "pointer",
            }}
          >
            Log this for later check
          </button>
        )
      ) : null}
    </div>
  );
}
