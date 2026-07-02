import React, { useState } from "react";
import Button from "../components/Button.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import { tagTrigger } from "../lib/triggerProfile.js";
import { setTilt, setEarliestSignal } from "../lib/windowRead.js";
import { addChipToWatchList } from "../lib/biasProfile.js";
import { addUserProtectiveMove } from "../lib/protectiveMoves.js";

/**
 * Onboarding — the front door (CANON "Onboarding & Calibration", locked May 28;
 * BUILT 2026-07-01 under Arlin's full-capability go — question set is a
 * complete draft in the established register, hers to edit on the walk).
 *
 * Governing principle: LOW BURDEN, HIGH REVELATION. The calibration is "the
 * first rep" — the user PERFORMS metacognition once on their own material:
 * each coarse answer is sharpened one level in front of them, and the
 * provisional profile assembles visibly as they go.
 *
 * Flow: Frame → How it works → Calibration (5 beats) → Concierge intro →
 * Personalization → done.
 *
 * PRECISE ENGINE, PROVISIONAL CLAIM: each option carries a deterministic
 * profile write (trigger / signal / lean / tilt / anchor — the pre-buildable
 * five; prediction-calibration and capacities stay emergent, never quizzed).
 * "Say it your way" stores the user's OWN words verbatim — the system already
 * treats user-named entries as first-class. The AI catalog-match sharpening of
 * typed answers is a flagged future refinement, not required for correctness.
 * All writes fail-silent; skipping any beat writes nothing (no fabricated
 * profile). The claim shown stays provisional: "a starting read that sharpens
 * with use."
 */

const BEATS = [
  {
    id: "trigger",
    kicker: "01 · Where it starts",
    q: "When your day tips, where does it usually start?",
    options: [
      {
        label: "The plan changes without warning, and everything I'd arranged in my head has to rebuild.",
        sharpened: "So it's not “stress” — it's the sudden rewrite. The moment the plan moves and the structure you built has to move with it.",
        write: () => tagTrigger("plans changing without warning"),
        named: "plans changing without warning",
      },
      {
        label: "Someone's tone shifts — a short reply, a look — and I start reading into it.",
        sharpened: "So it's not “people” — it's the ambiguous signal. The unread space between what they said and what they meant.",
        write: () => tagTrigger("ambiguous tone from people"),
        named: "ambiguous tone from people",
      },
      {
        label: "The list gets longer than the day, and I can feel myself starting to run.",
        sharpened: "So it's not “busy” — it's the arithmetic. The moment demand visibly outgrows the hours, before anything has actually gone wrong.",
        write: () => tagTrigger("demand outgrowing the day"),
        named: "demand outgrowing the day",
      },
    ],
    otherWrite: (text) => tagTrigger(text),
  },
  {
    id: "signal",
    kicker: "02 · Where it lands",
    q: "Before you've named anything, where does your body tell you first?",
    options: [
      {
        label: "Jaw and shoulders — things start holding on without me deciding to.",
        sharpened: "That's your earliest instrument: the grip arrives before the thought does. Worth knowing it reports first.",
        write: () => setEarliestSignal("jaw and shoulders tighten", "calibration"),
        named: "jaw and shoulders tighten first",
      },
      {
        label: "Chest and breath — it gets shallow and high before I notice why.",
        sharpened: "That's your earliest instrument: the breath climbs before the story forms. It will always report first if you listen for it.",
        write: () => setEarliestSignal("breath goes shallow and high", "calibration"),
        named: "breath goes shallow first",
      },
      {
        label: "Stomach — something drops or knots before I know what it's about.",
        sharpened: "That's your earliest instrument: the gut files its report before the mind opens the case. Early, and honest.",
        write: () => setEarliestSignal("stomach drops or knots", "calibration"),
        named: "stomach reports first",
      },
    ],
    otherWrite: (text) => setEarliestSignal(text, "calibration"),
  },
  {
    id: "lean",
    kicker: "03 · Which way it leans",
    q: "When it's loud in your head, which way does the thinking usually lean?",
    options: [
      {
        label: "Straight to the worst version — I can see the whole disaster before anything's happened.",
        sharpened: "The lean has a name: the mind runs the worst case as a preview, in full detail. Naming the preview is how you stop mistaking it for a forecast.",
        write: () => addChipToWatchList({ chipId: "d_catastrophizing", source: "calibration" }),
        named: "runs the worst-case preview",
      },
      {
        label: "Into their heads — I'm sure I know what they're thinking about me.",
        sharpened: "The lean has a name: reading minds with total confidence and no data. Naming it is how the certainty loosens.",
        write: () => addChipToWatchList({ chipId: "d_mind_reading", source: "calibration" }),
        named: "reads minds with confidence",
      },
      {
        label: "All-or-nothing — if it isn't right, it's ruined; if I slipped once, it's who I am.",
        sharpened: "The lean has a name: the middle of the scale disappears under load. Naming the missing middle is how it comes back.",
        write: () => addChipToWatchList({ chipId: "d_all_or_nothing", source: "calibration" }),
        named: "loses the middle of the scale",
      },
    ],
    otherWrite: null, // a typed lean shouldn't force a catalog chip — honest skip
  },
  {
    id: "tilt",
    kicker: "04 · Your baseline",
    q: "Most days, before anything happens — where does your system idle?",
    options: [
      {
        label: "Revved — I run warm. It doesn't take much to tip me into more.",
        sharpened: "A warm idle isn't a flaw — it's a setting. It means the down-shift is your highest-leverage move, and the practice trains exactly that.",
        write: () => setTilt("revved", "calibration"),
        named: "idles warm (revved)",
      },
      {
        label: "Flat — I run low. Getting up to speed costs me more than staying calm does.",
        sharpened: "A low idle isn't a flaw — it's a setting. It means the up-shift is your trained move, and knowing that changes what “calm” even means for you.",
        write: () => setTilt("flat", "calibration"),
        named: "idles low (flat)",
      },
      {
        label: "It swings — some days warm, some days flat, and I can't always tell which one woke up.",
        sharpened: "A moving idle is its own read: the first useful question each day is “which system showed up.” The morning check exists for exactly that.",
        write: () => setTilt("shifts", "calibration"),
        named: "idle shifts day to day",
      },
    ],
    otherWrite: null,
  },
  {
    id: "anchor",
    kicker: "05 · What carries you",
    q: "You've been through hard stretches before. What actually got you through?",
    options: [
      {
        label: "I break it down — when it's too big, I find the one next thing and do that.",
        sharpened: "You already own a protective move: shrinking the frame to the next true step. You've used it; the noise just makes it easy to forget you have it.",
        write: () => addUserProtectiveMove({ move: "shrink it to the one next thing", protectedEdge: "keeps you moving when the whole is too big", costEdge: "can defer the bigger look" }),
        named: "shrinks it to the next step",
      },
      {
        label: "I go quiet and get alone for a while — the noise settles when I step out of the room.",
        sharpened: "You already own a protective move: withdrawing to reset. You've used it; it works. The practice just makes it deliberate instead of a retreat.",
        write: () => addUserProtectiveMove({ move: "step out and let it settle", protectedEdge: "protects the read from the room's noise", costEdge: "can look like disappearing to others" }),
        named: "steps out to settle",
      },
      {
        label: "I talk it through with someone I trust until it stops being a blur.",
        sharpened: "You already own a protective move: thinking out loud until it has edges. You've used it — the practice gives you a second place to do it, on demand.",
        write: () => addUserProtectiveMove({ move: "talk it into having edges", protectedEdge: "turns a blur into something workable", costEdge: "waits on someone being available" }),
        named: "talks it into having edges",
      },
    ],
    otherWrite: (text) => addUserProtectiveMove({ move: text, protectedEdge: "what has carried you before", costEdge: "" }),
  },
];

export default function Onboarding({ onComplete }) {
  const [phase, setPhase] = useState("frame"); // frame | how | cal | concierge | personal
  const [beatIndex, setBeatIndex] = useState(0);
  const [picked, setPicked] = useState(null); // option object after a pick (sharpen view)
  const [otherOpen, setOtherOpen] = useState(false);
  const [otherText, setOtherText] = useState("");
  const [namedSoFar, setNamedSoFar] = useState([]); // the visible assembling profile

  const fire = (e, props) => { try { window.plausible?.(e, props ? { props } : undefined); } catch { /* */ } };

  const beat = BEATS[beatIndex];

  function pickOption(opt) {
    try { opt.write(); } catch { /* fail-silent — never block the door */ }
    setPicked(opt);
    setNamedSoFar((s) => [...s, opt.named]);
    fire("Calibration Beat Answered", { beat: beat.id, kind: "option" });
  }

  function submitOther() {
    const text = otherText.trim();
    if (!text) return;
    if (beat.otherWrite) { try { beat.otherWrite(text); } catch { /* */ } }
    setPicked({
      sharpened:
        "Your words, kept exactly as you said them — the record treats what you name yourself as first-class. The practice will sharpen it with you over time.",
      named: text.length > 42 ? text.slice(0, 42) + "…" : text,
    });
    setNamedSoFar((s) => [...s, text.length > 42 ? text.slice(0, 42) + "…" : text]);
    setOtherOpen(false); setOtherText("");
    fire("Calibration Beat Answered", { beat: beat.id, kind: "own-words" });
  }

  function nextBeat() {
    setPicked(null); setOtherOpen(false);
    if (beatIndex + 1 < BEATS.length) setBeatIndex(beatIndex + 1);
    else { setPhase("concierge"); fire("Calibration Completed"); }
  }

  function skipBeat() {
    setPicked(null); setOtherOpen(false);
    fire("Calibration Beat Skipped", { beat: beat.id });
    if (beatIndex + 1 < BEATS.length) setBeatIndex(beatIndex + 1);
    else setPhase("concierge");
  }

  /* ── FRAME ── */
  if (phase === "frame") {
    return (
      <main className="sf-page sf-page--hero">
        <article className="sf-fade-enter" style={{ maxWidth: 560 }}>
          <MonoLabel size="xs" tone="faint">Stillform</MonoLabel>
          <p style={H}>You already know who you are. The noise makes it hard to hear.</p>
          <p style={BODY}>
            Stillform is a practice in metacognition — seeing how your own mind processes, and
            expanding what it can do. Not calm as a product. Capacity, with composure as the thing
            you feel along the way.
          </p>
          <Button variant="primary" onClick={() => { setPhase("how"); fire("Onboarding Started"); }}>Begin</Button>
        </article>
      </main>
    );
  }

  /* ── HOW ── */
  if (phase === "how") {
    return (
      <main className="sf-page sf-page--hero">
        <article className="sf-fade-enter" style={{ maxWidth: 560 }}>
          <MonoLabel size="xs" tone="faint">How it works</MonoLabel>
          <p style={BODY}>
            Short daily reps — name the state, read the body, work the thought. The record
            compounds: your patterns, your triggers, your capacities, measured against your own
            past and no one else's. The app pays attention so you can spend yours where it counts.
          </p>
          <p style={BODY}>
            First: five questions. Not an intake — a first rep. Each answer gets sharpened one
            level in front of you. That sharpening is the practice, performed once, on you.
          </p>
          <Button variant="primary" onClick={() => setPhase("cal")}>Run the first rep</Button>
        </article>
      </main>
    );
  }

  /* ── CALIBRATION ── */
  if (phase === "cal") {
    return (
      <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
        <article className="sf-fade-enter" style={{ maxWidth: 560 }}>
          <MonoLabel size="xs" tone="faint">{beat.kicker}</MonoLabel>

          {!picked ? (
            <>
              <p style={Q}>{beat.q}</p>
              {beat.options.map((opt) => (
                <button key={opt.named} type="button" style={OPT} onClick={() => pickOption(opt)}>
                  {opt.label}
                </button>
              ))}
              {!otherOpen ? (
                <button type="button" className="sf-link-quiet" onClick={() => setOtherOpen(true)}>
                  Other — say it your way
                </button>
              ) : (
                <div style={{ marginTop: "var(--sf-space-12)" }}>
                  <textarea
                    className="sf-textarea"
                    rows={2}
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    placeholder="In your own words…"
                    aria-label="Say it your way"
                  />
                  <div style={{ display: "flex", gap: "var(--sf-space-12)", marginTop: "var(--sf-space-8)" }}>
                    <Button variant="ghost" onClick={submitOther}>Keep my words</Button>
                    <button type="button" className="sf-link-quiet" onClick={() => setOtherOpen(false)}>Back</button>
                  </div>
                </div>
              )}
              <div style={{ marginTop: "var(--sf-space-16)" }}>
                <button type="button" className="sf-link-quiet" onClick={skipBeat}>Skip this one</button>
              </div>
            </>
          ) : (
            <>
              <p style={SHARP}>{picked.sharpened}</p>
              <Button variant="primary" onClick={nextBeat}>
                {beatIndex + 1 < BEATS.length ? "Next" : "Finish the rep"}
              </Button>
            </>
          )}

          {namedSoFar.length > 0 && (
            <aside aria-label="Your starting read, so far" style={STRIP}>
              <MonoLabel size="xs" tone="faint">Your starting read — so far</MonoLabel>
              {namedSoFar.map((n) => (
                <p key={n} style={STRIP_LINE}>· {n}</p>
              ))}
            </aside>
          )}
        </article>
      </main>
    );
  }

  /* ── CONCIERGE INTRO ── */
  if (phase === "concierge") {
    return (
      <main className="sf-page sf-page--hero">
        <article className="sf-fade-enter" style={{ maxWidth: 560 }}>
          <MonoLabel size="xs" tone="faint">The concierge</MonoLabel>
          <p style={BODY}>
            That read is provisional — a starting point that sharpens with use. What sharpens it
            is repetition, and the app removes the friction of returning: a morning brief prepared
            from your own record, preparation before the moments that matter, a quiet close to the
            day.
          </p>
          <p style={BODY}>
            If you want it to see more, you can connect your calendar and the day’s weather now
            in Settings — each one optional, each one off until you turn it on, each one
            forgettable. Health signals arrive with the phone version. Nothing is required; the
            practice works either way.
          </p>
          <Button variant="primary" onClick={() => setPhase("personal")}>Continue</Button>
        </article>
      </main>
    );
  }

  /* ── PERSONALIZATION ── */
  return (
    <main className="sf-page sf-page--hero">
      <article className="sf-fade-enter" style={{ maxWidth: 560 }}>
        <MonoLabel size="xs" tone="faint">Last thing</MonoLabel>
        <p style={BODY}>
          The practice fits best at a consistent time — most people anchor it to the morning.
          Reminders and every setting live in Settings, changeable anytime. The calibration you
          just did carried the weight; there’s nothing else to fill in.
        </p>
        <Button
          variant="primary"
          onClick={() => { fire("Onboarding Completed"); onComplete(); }}
        >
          Enter the practice
        </Button>
      </article>
    </main>
  );
}

/* ── styles (restraint idiom — serif 300, modest sizes) ── */
const H = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "22px",
  lineHeight: 1.5, color: "var(--sf-text-primary)", margin: "var(--sf-space-16) 0",
};
const BODY = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "15px",
  lineHeight: 1.7, color: "var(--sf-text-secondary)", margin: "0 0 var(--sf-space-16)",
};
const Q = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "18px",
  lineHeight: 1.55, color: "var(--sf-text-primary)", margin: "var(--sf-space-12) 0 var(--sf-space-16)",
};
const OPT = {
  display: "block", width: "100%", textAlign: "left",
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "15px",
  lineHeight: 1.6, color: "var(--sf-text-secondary)",
  background: "transparent", border: "0.5px solid var(--sf-border-hairline)",
  padding: "var(--sf-space-16)", marginBottom: "var(--sf-space-12)", cursor: "pointer",
};
const SHARP = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "16px",
  lineHeight: 1.7, color: "var(--sf-text-primary)",
  borderLeft: "0.5px solid var(--sf-accent-line)", paddingLeft: "var(--sf-space-16)",
  margin: "var(--sf-space-16) 0 var(--sf-space-24)",
};
const STRIP = {
  marginTop: "var(--sf-space-32)", paddingTop: "var(--sf-space-16)",
  borderTop: "0.5px solid var(--sf-border-hairline)",
};
const STRIP_LINE = {
  fontFamily: "var(--sf-font-mono)", fontSize: "11px", letterSpacing: "0.04em",
  color: "var(--sf-text-faint)", margin: "var(--sf-space-8) 0 0",
};
