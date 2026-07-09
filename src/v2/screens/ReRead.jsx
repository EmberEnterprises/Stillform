import React, { useState } from "react";
import MicButton from "../components/MicButton.jsx";
import Button from "../components/Button.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import EditorialBlock from "../components/EditorialBlock.jsx";
import { getReRead } from "../lib/reReadApi.js";
import { getSignalLog } from "../lib/signalLog.js";

/**
 * ReRead — "The Re-Read" (Arlin's mechanic, 2026-07-02 spec; name = her
 * placeholder). Point the widening engine at a REMEMBERED event: recall makes
 * a memory briefly editable before it re-stores; guided questions widen the
 * one-sided telling so the version that re-stores is fuller and costs less to
 * hold. Not erasing the event — loosening the grip of the single-sided story.
 *
 * ⚠ SAFETY FLOOR AS UI (Arlin's spec, designed in first):
 *   - SELF-SELECTED only: the user types the memory or picks a logged moment
 *     as the starting point. The app never digs, never suggests a memory.
 *   - The "heavier than a re-read" exit is ALWAYS visible — one tap to
 *     CrisisResources, no questions asked. workable:false + crisis routes
 *     there directly.
 *   - GUIDED, never told: the AI returns QUESTIONS only. The user writes the
 *     wider telling themselves — the re-authored version is theirs, in their
 *     words, and it is what they walk away holding.
 *   - RESOLUTION posture: the aim is a story that costs THEM less to hold —
 *     never absolution, never dropped guard.
 *
 * Beats: choose → tell it → the questions (answer in your head or on the page)
 * → re-tell it wider → how it sits now. Nothing stored unless they choose to
 * keep the wider telling (kept locally with the same wipe path as everything).
 *
 * @param {function(): void} onExit — back
 * @param {function(string): void} onNavigate — router (crisis-resources)
 */
export default function ReRead({ onExit, onNavigate }) {
  const [beat, setBeat] = useState("choose"); // choose | tell | questions | retell | close
  const [memory, setMemory] = useState("");
  const [result, setResult] = useState(null);
  const [retelling, setRetelling] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const goCrisis = () => {
    if (typeof onNavigate === "function") onNavigate("crisis-resources");
  };

  // Recent logged moments as optional starting points — the user's own record,
  // offered not pushed; typed recall is equally first-class.
  const logMoments = (() => {
    try {
      const entries = (getSignalLog() || {}).entries || [];
      // Compose an honest starting line from the real entry shape (chip +
      // triggers). Offered, never pushed; typed recall is equally first-class.
      return entries
        .filter((e) => e && e.chip && Array.isArray(e.triggers) && e.triggers.length > 0)
        .slice(-4)
        .reverse()
        .map((e) => ({
          key: e.id || e.loggedAt,
          line: `Felt ${e.chip} around ${e.triggers.join(", ")}`,
        }));
    } catch {
      return [];
    }
  })();

  const run = async () => {
    setBusy(true);
    setError(null);
    const r = await getReRead({ memory });
    setBusy(false);
    if (r.error) { setError(r.error); return; }
    setResult(r);
    if (!r.workable && r.crisis) {
      // Crisis floor: no widening, straight to the real-person route.
      goCrisis();
      return;
    }
    setBeat("questions");
  };

  const heavierExit = (
    <button type="button" className="sf-link-quiet" onClick={goCrisis} style={{ marginTop: "var(--sf-space-24)", display: "block" }}>
      This is heavier than a re-read — take me to real support
    </button>
  );

  /* ── CHOOSE ── */
  if (beat === "choose") {
    return (
      <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
        <article className="sf-fade-enter" style={{ maxWidth: 560 }}>
          <button type="button" onClick={onExit} aria-label="Back" style={BACK}>← back</button>
          <EditorialBlock
            label="The Re-Read"
            headline="A memory, read wider"
            headlineSize="md"
            body="We store hard moments in a one-sided telling — hurt, at fault, humiliated — and the telling keeps the grip. Recalling a memory opens it briefly. Read it wider while it's open, and the version you put back costs less to hold. The event stands; only the single side is in question."
            rule
          />
          <p style={NORM}>
            You choose the memory — the practice never digs. This works on the smaller
            weights: the slights and stings that are safe to hold. Start manageable;
            this is a widening, not an excavation.
          </p>
          {/* Arlin's directive 2026-07-08: the warning + the therapist line, in the
              app's own voice — her lane definition: self-mastery on the small,
              the deep belongs with someone who can hold it. */}
          <p style={{ ...NORM, color: "var(--sf-text-faint)", fontSize: "13px" }}>
            A caution worth taking seriously: some memories carry more charge than
            expected once opened. Anything heavy — trauma, loss, what still shakes
            you — deserves a therapist, who can hold what a practice like this
            can't know the depth of. This tool is self-mastery, not treatment.
          </p>
          <Button variant="primary" onClick={() => setBeat("tell")}>Choose a memory</Button>
          {heavierExit}
        </article>
      </main>
    );
  }

  /* ── TELL ── */
  if (beat === "tell") {
    return (
      <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
        <article className="sf-fade-enter" style={{ maxWidth: 560 }}>
          <button type="button" onClick={() => setBeat("choose")} aria-label="Back" style={BACK}>← back</button>
          <MonoLabel size="xs" tone="faint">Tell it</MonoLabel>
          <p style={Q}>Tell the memory the way you carry it — the version that plays in your head.</p>
          <textarea
            className="sf-textarea"
            rows={6}
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            placeholder="What happened, as you hold it…"
            aria-label="The memory in your own words"
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--sf-space-8)" }}>
            <MicButton onTranscript={(t) => setMemory((v) => (v ? v + " " : "") + t.trim())} />
          </div>
          {logMoments.length > 0 && (
            <div style={{ marginTop: "var(--sf-space-16)" }}>
              <MonoLabel size="xs" tone="faint">Or start from a logged moment</MonoLabel>
              {logMoments.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  className="sf-sec-row"
                  onClick={() => setMemory(`${m.line} — `)}
                  aria-label="Start from this logged moment"
                >
                  <span className="sf-sec-row-main">
                    <span className="sf-sec-sub">{m.line}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
          {error && (
            <p style={{ ...NORM, color: "var(--sf-text-faint)" }}>
              {error} Your words are safe in the box above — nothing was lost.
            </p>
          )}
          <div style={{ marginTop: "var(--sf-space-16)" }}>
            <Button variant="primary" onClick={run} disabled={busy || memory.trim().length < 12}>
              {busy ? "Reading…" : "Open the wider read"}
            </Button>
          </div>
          {heavierExit}
        </article>
      </main>
    );
  }

  /* ── QUESTIONS ── */
  if (beat === "questions") {
    if (!result || !result.workable) {
      return (
        <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
          <article className="sf-fade-enter" style={{ maxWidth: 560 }}>
            <button type="button" onClick={() => setBeat("tell")} aria-label="Back" style={BACK}>← back</button>
            <MonoLabel size="xs" tone="faint">Not this one</MonoLabel>
            <p style={Q}>{(result && result.note) || "This one isn't a re-read. It deserves more than a widening exercise."}</p>
            <Button variant="primary" onClick={goCrisis}>Where to take it</Button>
            <button type="button" className="sf-link-quiet" onClick={() => { setMemory(""); setResult(null); setBeat("tell"); }} style={{ marginTop: "var(--sf-space-16)", display: "block" }}>
              Choose a different memory
            </button>
          </article>
        </main>
      );
    }
    return (
      <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
        <article className="sf-fade-enter" style={{ maxWidth: 560 }}>
          <MonoLabel size="xs" tone="faint">The wider frame</MonoLabel>
          <p style={NORM}>
            Your telling stands — nothing here disputes what happened. These are the angles the
            one-sided version can't see. Sit with each; the answers are yours.
          </p>
          {result.questions.map((q, i) => (
            <p key={q.slice(0, 24)} className="sf-fade-enter" style={{ ...READQ, animationDelay: `${(i + 1) * 350}ms` }}>{q}</p>
          ))}
          {result.note && <p style={NORM}>{result.note}</p>}
          <Button variant="primary" onClick={() => setBeat("retell")}>Re-tell it wider</Button>
          {heavierExit}
        </article>
      </main>
    );
  }

  /* ── RETELL ── */
  if (beat === "retell") {
    return (
      <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
        <article className="sf-fade-enter" style={{ maxWidth: 560 }}>
          <button type="button" onClick={() => setBeat("questions")} aria-label="Back" style={BACK}>← back</button>
          <MonoLabel size="xs" tone="faint">The re-read</MonoLabel>
          <p style={Q}>
            Now tell it again — same event, wider frame. In your words; this is the version that
            goes back on the shelf.
          </p>
          <textarea
            className="sf-textarea"
            rows={6}
            value={retelling}
            onChange={(e) => setRetelling(e.target.value)}
            placeholder="The same moment, with more of the room in it…"
            aria-label="The wider telling"
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--sf-space-8)" }}>
            <MicButton onTranscript={(t) => setRetelling((v) => (v ? v + " " : "") + t.trim())} />
          </div>
          <div style={{ marginTop: "var(--sf-space-16)" }}>
            <Button variant="primary" onClick={() => setBeat("close")} disabled={retelling.trim().length < 12}>
              Set it down
            </Button>
          </div>
          {heavierExit}
        </article>
      </main>
    );
  }

  /* ── CLOSE ── */
  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <article className="sf-fade-enter" style={{ maxWidth: 560 }}>
        <MonoLabel size="xs" tone="faint">Set down</MonoLabel>
        <p style={Q}>The event didn't change. The grip did — that's the work, and you did it.</p>
        <p style={NORM}>
          Nothing here is stored unless you keep it. If the old telling comes back — it may; grooves
          are grooves — you now hold a wider one to answer it with.
        </p>
        <Button variant="primary" onClick={onExit}>Done</Button>
      </article>
    </main>
  );
}

const BACK = {
  background: "transparent", border: "none", color: "var(--sf-text-faint)",
  fontFamily: "var(--sf-font-mono)", fontSize: "11px", letterSpacing: "0.14em",
  textTransform: "uppercase", cursor: "pointer", padding: "8px 0",
  marginBottom: "var(--sf-space-24)", WebkitTapHighlightColor: "transparent",
};
const Q = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "18px",
  lineHeight: 1.55, color: "var(--sf-text-primary)", margin: "var(--sf-space-12) 0 var(--sf-space-16)",
};
const NORM = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontStyle: "italic",
  fontSize: "13px", lineHeight: 1.65, color: "var(--sf-text-faint)", margin: "0 0 var(--sf-space-16)",
};
const READQ = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "16px",
  lineHeight: 1.7, color: "var(--sf-text-primary)",
  borderLeft: "0.5px solid var(--sf-accent-line)", paddingLeft: "var(--sf-space-16)",
  margin: "0 0 var(--sf-space-16)",
};
