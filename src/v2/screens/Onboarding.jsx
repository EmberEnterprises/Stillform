import React, { useState } from "react";
import Button from "../components/Button.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import StillFormMark from "../components/StillFormMark.jsx";
import { tagTrigger } from "../lib/triggerProfile.js";
import { setTilt, setEarliestSignal } from "../lib/windowRead.js";
import { addChipToWatchList } from "../lib/biasProfile.js";
import { addUserProtectiveMove } from "../lib/protectiveMoves.js";
import { getA11y, setA11y } from "../lib/a11y.js";
import { saveStartingRead } from "../lib/startingRead.js";
import CalendarImport from "../components/CalendarImport.jsx";
import WeatherConsent from "../components/WeatherConsent.jsx";

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


/* ── The Read: deterministic synthesis of the five beats into one portrait.
      The Liven-class reveal done honestly — precise engine, provisional claim.
      Own-words answers are woven verbatim; skipped beats are omitted, never
      guessed. ── */
const READ_FRAGMENTS = {
  trigger: {
    "rewrite": "Your day tips at the sudden rewrite — not pressure itself, but the moment a plan you built has to rebuild",
    "ambiguity": "Your day tips on ambiguous signals from people — the unread space between what was said and what was meant",
    "overload": "Your day tips at the arithmetic — the moment demand visibly outgrows the hours, before anything has gone wrong",
  },
  signal: {
    "grip": "and your body reports it first through the grip — jaw and shoulders holding on before the thought forms",
    "breath": "and your body reports it first through the breath — shallow and high before you know why",
    "gut": "and your body reports it first through the gut — the drop that files its report before the mind opens the case",
  },
  lean: {
    "worst-case": "Under load, your thinking leans toward the worst-case preview, rendered in full detail",
    "mind-reading": "Under load, your thinking leans into other people's heads — certain of what they think, with no data",
    "all-or-nothing": "Under load, the middle of your scale disappears — right or ruined, nothing between",
  },
  tilt: {
    "revved": "Your system idles warm, so the down-shift is your highest-leverage trained move",
    "flat": "Your system idles low, so the up-shift is your trained move — and \u201ccalm\u201d means something different for you",
    "shifts": "Your idle moves day to day, so the first useful question each morning is which system showed up",
  },
  anchor: {
    "shrink": "And you already carry a working move: when it's too big, you shrink it to the one next true thing.",
    "step-out": "And you already carry a working move: you step out and let the noise settle before you decide.",
    "talk": "And you already carry a working move: you talk it into having edges until it stops being a blur.",
  },
};


/* ── The SEEN layer (Arlin, 2026-07-01: "felt seen right after the calibration,
      not just using the app"). Reflection replays what they said; being seen is
      the connection they DIDN'T say. Two deterministic cross-beat insights:
      trigger×signal (how their alarm actually works) and trigger×anchor (their
      own move already answers their own trigger — the strongest hit). Curated
      per pair; own-words/skips fall back gracefully, never guessed. ── */
const SEEN_TRIGGER_SIGNAL = {
  "rewrite|grip": "Put those together and it's one system: you hold plans the way you hold your jaw — and when a plan is taken, the body braces to keep something from moving. It may never have been \u201ctension\u201d at all \u2014 it reads like structure, defended.",
  "rewrite|breath": "Put those together: when the plan goes, your breath goes first — the body rationing air for a rebuild it hasn't been told about yet. It's less losing calm, more starting to prepare before you've agreed to.",
  "rewrite|gut": "Put those together: the gut votes on the new plan before the mind has read it. That drop may not be dread — it moves like your fastest evaluator reporting the ground shifted.",
  "ambiguity|grip": "Put those together and it's one system: an unread signal from someone, and the body braces for a verdict that hasn't been given. The grip looks a lot like holding a conversation that hasn't happened yet.",
  "ambiguity|breath": "Put those together: the breath climbs while you're still parsing their tone — your system readying an answer to a question nobody asked yet. That may be less anxiety than over-preparation.",
  "ambiguity|gut": "Put those together: the gut reads the room before the mind finishes the sentence. It's usually reacting to the ambiguity itself — the not-knowing — not to what they actually meant.",
  "overload|grip": "Put those together and it's one system: the list outgrows the day, and the body starts carrying it — literally, in the jaw and shoulders. It's as if you've been holding the schedule with your muscles.",
  "overload|breath": "Put those together: when demand outgrows the hours, your breath shortens as if to save time. The system speeds everything, including the one thing that works better slow.",
  "overload|gut": "Put those together: the arithmetic lands in the gut before you've done it consciously. It's not that you can't handle the load — it's that your body counts faster than you do.",
};
const SEEN_TRIGGER_ANCHOR = {
  "rewrite|shrink": "And look at the pair you just named: what tips you is losing the structure — and the move that carries you is rebuilding it, one true step. It looks like you've been treating yourself correctly all along \u2014 the practice just makes it deliberate.",
  "rewrite|step-out": "And look at the pair: what tips you is the sudden rewrite — and what carries you is stepping out until the new shape settles. Some part of you seems to have known the rebuild needs quiet. Named, it can be a move instead of a retreat.",
  "rewrite|talk": "And look at the pair: what tips you is the plan dissolving — and what carries you is talking the new one into having edges. You rebuild out loud. That reads less like a dependency, more like a method.",
  "ambiguity|shrink": "And look at the pair: what tips you is the unread space between people — and what carries you is shrinking to the one next true thing. You seem to already know the antidote to ambiguity: one concrete act.",
  "ambiguity|step-out": "And look at the pair: what tips you is other people's static — and what carries you is stepping out of its range. It looks like you've been protecting your read from the room for years. Now it has a name.",
  "ambiguity|talk": "And look at the pair: what tips you is not knowing what they meant — and what carries you is saying it out loud until it has edges. You seem to resolve ambiguity by making language do its job. Worth keeping.",
  "overload|shrink": "And look at the pair you just named: what tips you is the list outgrowing the day — and what carries you is shrinking it to the one next thing. Your own move is the exact counter to your own trigger. You built that yourself.",
  "overload|step-out": "And look at the pair: what tips you is the arithmetic — and what carries you is stepping out of it long enough to see it whole. Distance may simply be how you count \u2014 a strategy, not an escape.",
  "overload|talk": "And look at the pair: what tips you is everything at once — and what carries you is talking it into a line, one thing after another. You seem to serialize the overwhelm \u2014 which looks like a real skill wearing a casual name.",
};

function composeSeen(answers) {
  const t = answers.trigger, s = answers.signal, a = answers.anchor;
  const lines = [];
  if (t && s && t.key !== "own" && s.key !== "own") {
    const hit = SEEN_TRIGGER_SIGNAL[`${t.key}|${s.key}`];
    if (hit) lines.push(hit);
  }
  if (t && a && t.key !== "own" && a.key !== "own") {
    const hit = SEEN_TRIGGER_ANCHOR[`${t.key}|${a.key}`];
    if (hit) lines.push(hit);
  }
  // Own-words fallback: still make the connection move, on their material.
  if (lines.length === 0 && t && a) {
    lines.push(
      `And notice the pair you just named: what tips you \u2014 \u201c${t.named}\u201d \u2014 and what carries you \u2014 \u201c${a.named}\u201d \u2014 are already in conversation. You walked in with both halves. The practice is learning to run them on purpose.`
    );
  }
  return lines;
}

function composeRead(answers) {
  const part = (id) => {
    const a = answers[id];
    if (!a) return null;
    if (a.key === "own") {
      const lead = { trigger: "Your day tips at", signal: "Your body's first report:", lean: "Under load, your thinking leans:", tilt: "Your baseline, in your words:", anchor: "And what carries you, in your words:" }[id];
      return `${lead} \u201c${a.named}\u201d`;
    }
    return (READ_FRAGMENTS[id] && READ_FRAGMENTS[id][a.key]) || null;
  };
  const s1 = [part("trigger"), part("signal")].filter(Boolean).join(", ");
  const rest = [part("lean"), part("tilt"), part("anchor")].filter(Boolean);
  return [s1 ? s1 + "." : null, ...rest.map((r) => (r.endsWith(".") ? r : r + "."))].filter(Boolean);
}

const BEATS = [
  {
    id: "trigger",
    norm: "Nothing rare in that. Every mind has a tipping point — most people just never find out where theirs is. You now know yours.",
    kicker: "01 · Where it starts",
    q: "When your day tips, where does it usually start?",
    options: [
      {
        label: "The plan changes without warning, and everything I'd arranged in my head has to rebuild.",
        sharpened: "So it's not “stress” — it's the sudden rewrite. The moment the plan moves and the structure you built has to move with it.",
        write: () => tagTrigger("plans changing without warning"),
        key: "rewrite", named: "plans changing without warning",
      },
      {
        label: "Someone's tone shifts — a short reply, a look — and I start reading into it.",
        sharpened: "So it's not “people” — it's the ambiguous signal. The unread space between what they said and what they meant.",
        write: () => tagTrigger("ambiguous tone from people"),
        key: "ambiguity", named: "ambiguous tone from people",
      },
      {
        label: "The list gets longer than the day, and I can feel myself starting to run.",
        sharpened: "So it's not “busy” — it's the arithmetic. The moment demand visibly outgrows the hours, before anything has actually gone wrong.",
        write: () => tagTrigger("demand outgrowing the day"),
        key: "overload", named: "demand outgrowing the day",
      },
    ],
    otherWrite: (text) => tagTrigger(text),
  },
  {
    id: "signal",
    norm: "Every body does this — the signal always arrives before the story. Most people override it for years. You just located yours.",
    kicker: "02 · Where it lands",
    q: "Before you've named anything, where does your body tell you first?",
    options: [
      {
        label: "Jaw and shoulders — things start holding on without me deciding to.",
        sharpened: "That's your earliest instrument: the grip arrives before the thought does. Worth knowing it reports first.",
        write: () => setEarliestSignal("jaw and shoulders tighten", "calibration"),
        key: "grip", named: "jaw and shoulders tighten first",
      },
      {
        label: "Chest and breath — it gets shallow and high before I notice why.",
        sharpened: "That's your earliest instrument: the breath climbs before the story forms. It tends to report first, if you listen for it.",
        write: () => setEarliestSignal("breath goes shallow and high", "calibration"),
        key: "breath", named: "breath goes shallow first",
      },
      {
        label: "Stomach — something drops or knots before I know what it's about.",
        sharpened: "That's your earliest instrument: the gut files its report before the mind opens the case. Early, and honest.",
        write: () => setEarliestSignal("stomach drops or knots", "calibration"),
        key: "gut", named: "stomach reports first",
      },
    ],
    otherWrite: (text) => setEarliestSignal(text, "calibration"),
  },
  {
    id: "lean",
    norm: "Every mind leans under load — all of them, without exception. A lean isn't a flaw; it's standard equipment. Seeing yours is the entire advantage.",
    kicker: "03 · Which way it leans",
    q: "When it's loud in your head, which way does the thinking usually lean?",
    options: [
      {
        label: "Straight to the worst version — I can see the whole disaster before anything's happened.",
        sharpened: "The lean has a name: the mind runs the worst case as a preview, in full detail. Naming the preview is how you stop mistaking it for a forecast.",
        write: () => addChipToWatchList({ chipId: "d_catastrophizing", source: "calibration" }),
        key: "worst-case", named: "runs the worst-case preview",
      },
      {
        label: "Into their heads — I'm sure I know what they're thinking about me.",
        sharpened: "The lean has a name: reading minds with total confidence and no data. Naming it is how the certainty loosens.",
        write: () => addChipToWatchList({ chipId: "d_mind_reading", source: "calibration" }),
        key: "mind-reading", named: "reads minds with confidence",
      },
      {
        label: "All-or-nothing — if it isn't right, it's ruined; if I slipped once, it's who I am.",
        sharpened: "The lean has a name: the middle of the scale disappears under load. Naming the missing middle is how it comes back.",
        write: () => addChipToWatchList({ chipId: "d_all_or_nothing", source: "calibration" }),
        key: "all-or-nothing", named: "loses the middle of the scale",
      },
    ],
    otherWrite: null, // a typed lean shouldn't force a catalog chip — honest skip
  },
  {
    id: "tilt",
    norm: "There's no correct idle. Warm, low, moving — each is just a nervous system with a setting. Knowing the setting is what most people never get.",
    kicker: "04 · Your baseline",
    q: "Most days, before anything happens — where does your system idle?",
    options: [
      {
        label: "Revved — I run warm. It doesn't take much to tip me into more.",
        sharpened: "A warm idle isn't a flaw — it's a setting. It means the down-shift is your highest-leverage move, and the practice trains exactly that.",
        write: () => setTilt("revved", "calibration"),
        key: "revved", named: "idles warm (revved)",
      },
      {
        label: "Flat — I run low. Getting up to speed costs me more than staying calm does.",
        sharpened: "A low idle isn't a flaw — it's a setting. It means the up-shift is your trained move, and knowing that changes what “calm” even means for you.",
        write: () => setTilt("flat", "calibration"),
        key: "flat", named: "idles low (flat)",
      },
      {
        label: "It swings — some days warm, some days flat, and I can't always tell which one woke up.",
        sharpened: "A moving idle is its own read: the first useful question each day is “which system showed up.” The morning check exists for exactly that.",
        write: () => setTilt("shifts", "calibration"),
        key: "shifts", named: "idle shifts day to day",
      },
    ],
    otherWrite: null,
  },
  {
    id: "anchor",
    norm: "This one matters: you didn't arrive empty-handed. Whatever the noise says, something has been working — you just named it.",
    kicker: "05 · What carries you",
    q: "You've been through hard stretches before. What actually got you through?",
    options: [
      {
        label: "I break it down — when it's too big, I find the one next thing and do that.",
        sharpened: "You already own a protective move: shrinking the frame to the next true step. You've used it; the noise just makes it easy to forget you have it.",
        write: () => addUserProtectiveMove({ move: "shrink it to the one next thing", protectedEdge: "keeps you moving when the whole is too big", costEdge: "can defer the bigger look" }),
        key: "shrink", named: "shrinks it to the next step",
      },
      {
        label: "I go quiet and get alone for a while — the noise settles when I step out of the room.",
        sharpened: "You already own a protective move: withdrawing to reset. You've used it; it works. The practice just makes it deliberate instead of a retreat.",
        write: () => addUserProtectiveMove({ move: "step out and let it settle", protectedEdge: "protects the read from the room's noise", costEdge: "can look like disappearing to others" }),
        key: "step-out", named: "steps out to settle",
      },
      {
        label: "I talk it through with someone I trust until it stops being a blur.",
        sharpened: "You already own a protective move: thinking out loud until it has edges. You've used it — the practice gives you a second place to do it, on demand.",
        write: () => addUserProtectiveMove({ move: "talk it into having edges", protectedEdge: "turns a blur into something workable", costEdge: "waits on someone being available" }),
        key: "talk", named: "talks it into having edges",
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
  const [answers, setAnswers] = useState({}); // beatId -> { key | "own", named } — feeds The Read

  const fire = (e, props) => { try { window.plausible?.(e, props ? { props } : undefined); } catch { /* */ } };

  const beat = BEATS[beatIndex];

  function pickOption(opt) {
    try { opt.write(); } catch { /* fail-silent — never block the door */ }
    setPicked(opt);
    setNamedSoFar((s) => [...s, opt.named]);
    setAnswers((a) => ({ ...a, [beat.id]: { key: opt.key, named: opt.named } }));
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
    setAnswers((a) => ({ ...a, [beat.id]: { key: "own", named: text } }));
    setOtherOpen(false); setOtherText("");
    fire("Calibration Beat Answered", { beat: beat.id, kind: "own-words" });
  }

  function nextBeat() {
    setPicked(null); setOtherOpen(false);
    if (beatIndex + 1 < BEATS.length) setBeatIndex(beatIndex + 1);
    else { setPhase("read"); fire("Calibration Completed"); }
  }

  function skipBeat() {
    setPicked(null); setOtherOpen(false);
    fire("Calibration Beat Skipped", { beat: beat.id });
    if (beatIndex + 1 < BEATS.length) setBeatIndex(beatIndex + 1);
    else setPhase("read");
  }

  /* ── FRAME ── */
  if (phase === "frame") {
    return (
      <main className="sf-page sf-page--hero">
        <article className="sf-fade-enter" style={{ maxWidth: 560, textAlign: "center" }}>
          {/* The Still Form, alive from the first screen (flag 3, Arlin's scope
              lock). Day one it breathes as the simple base ring — honest: a
              new record, nothing faked. The form IS the promise. */}
          <StillFormMark />
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginTop: "var(--sf-space-24)" }}>
            Stillform
          </MonoLabel>
          <p style={{ ...H, textAlign: "center" }}>
            You already know who you are. The noise makes it hard to hear.
          </p>
          <p style={{ ...NORM, textAlign: "center" }}>
            This form is yours. It grows as your record does — no two are alike.
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
          <p style={H}>
            A practice in seeing how your own mind works — and expanding what it can do.
          </p>
          <p style={BODY}>
            It starts with five questions. Not an intake — a first rep. Watch what happens
            to your first answer.
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
              {beat.norm && <p style={NORM}>{beat.norm}</p>}
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

  /* ── THE READ — the synthesis reveal ── */
  if (phase === "read") {
    const lines = composeRead(answers);
    const seen = composeSeen(answers);
    let delay = 0;
    const next = () => `${(delay += 350)}ms`; // staggered arrival, one line at a time
    return (
      <main className="sf-page sf-page--hero">
        <article style={{ maxWidth: 560 }}>
          {/* The arrival (flag 3): the form they met on screen one returns to
              receive the read — their answers, given shape. Staggered reveal;
              honest empty state if they kept their cards close. */}
          <div className="sf-fade-enter" style={{ textAlign: "center", marginBottom: "var(--sf-space-24)" }}>
            <StillFormMark />
          </div>
          <MonoLabel size="xs" tone="faint" className="sf-fade-enter" style={{ animationDelay: next() }}>
            Your starting read
          </MonoLabel>
          {lines.length > 0 ? (
            <>
              {lines.map((l) => (
                <p key={l} className="sf-fade-enter" style={{ ...READLINE, animationDelay: next() }}>{l}</p>
              ))}
              {seen.length > 0 && (
                <div className="sf-fade-enter" style={{ borderTop: "0.5px solid var(--sf-accent-line)", paddingTop: "var(--sf-space-16)", marginTop: "var(--sf-space-8)", animationDelay: next() }}>
                  <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-12)" }}>
                    What this adds up to
                  </MonoLabel>
                  {seen.map((l) => (
                    <p key={l.slice(0, 24)} style={READLINE}>{l}</p>
                  ))}
                </div>
              )}
              <p className="sf-fade-enter" style={{ ...NORM, animationDelay: next() }}>
                A starting read, not a verdict — it sharpens with use, and every line stays yours
                to correct.
              </p>
            </>
          ) : (
            <p className="sf-fade-enter" style={{ ...BODY, animationDelay: next() }}>
              You kept your cards close — fair. The read builds from practice instead; nothing here
              is ever guessed on your behalf.
            </p>
          )}
          <div className="sf-fade-enter" style={{ animationDelay: next() }}>
            <Button variant="primary" onClick={() => { try { saveStartingRead({ portrait: lines, seen: composeSeen(answers) }); } catch { /* */ } setPhase("concierge"); fire("Read Shown", { beats: lines.length }); }}>
              Continue
            </Button>
          </div>
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
            The read sharpens with use — and the app removes the friction of returning: a morning
            brief from your own record, preparation before the moments that matter, a quiet close
            to the day. Connect what you want it to see. Each one optional, off until you turn it
            on; the practice works either way.
          </p>
          <div style={CONSENT_BLOCK}>
            <MonoLabel size="xs" tone="faint">Calendar</MonoLabel>
            <CalendarImport />
          </div>
          <div style={CONSENT_BLOCK}>
            <MonoLabel size="xs" tone="faint">Ambient weather</MonoLabel>
            <WeatherConsent />
          </div>
          <Button variant="primary" onClick={() => setPhase("personal")}>Continue</Button>
        </article>
      </main>
    );
  }

  /* ── PERSONALIZATION — real, wired controls only ── */
  return (
    <main className="sf-page sf-page--hero">
      <article className="sf-fade-enter" style={{ maxWidth: 560 }}>
        <MonoLabel size="xs" tone="faint">Make it yours</MonoLabel>
        <p style={BODY}>
          Two display settings, applied instantly — both changeable anytime in Settings, along with
          everything else. The calibration carried the weight; the rest is comfort.
        </p>
        <A11yToggle label="Larger text" k="textSize" onVal="large" />
        <A11yToggle label="Higher contrast" k="contrast" onVal="high" />
        <p style={{ ...BODY, marginTop: "var(--sf-space-24)" }}>
          The practice fits best at a consistent time — most people anchor it to the morning.
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

/* Real a11y toggle — same store the Settings screen drives (applied app-wide). */
function A11yToggle({ label, k, onVal }) {
  const [val, setVal] = React.useState(() => getA11y()[k]);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--sf-space-12) 0", borderBottom: "0.5px solid var(--sf-border-hairline)" }}>
      <span style={{ ...BODY, margin: 0 }}>{label}</span>
      <button
        type="button"
        className="sf-link-quiet"
        aria-pressed={val === onVal}
        onClick={() => { const next = setA11y(k, val === onVal ? "default" : onVal); setVal(next[k]); }}
      >
        {val === onVal ? "On" : "Off"}
      </button>
    </div>
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
const NORM = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontStyle: "italic",
  fontSize: "13px", lineHeight: 1.65, color: "var(--sf-text-faint)",
  margin: "0 0 var(--sf-space-24)",
};
const READLINE = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "16px",
  lineHeight: 1.75, color: "var(--sf-text-primary)", margin: "0 0 var(--sf-space-12)",
};
const CONSENT_BLOCK = {
  border: "0.5px solid var(--sf-border-hairline)", padding: "var(--sf-space-16)",
  marginBottom: "var(--sf-space-16)",
};
const STRIP_LINE = {
  fontFamily: "var(--sf-font-mono)", fontSize: "11px", letterSpacing: "0.04em",
  color: "var(--sf-text-faint)", margin: "var(--sf-space-8) 0 0",
};
