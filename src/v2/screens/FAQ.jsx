import React, { useState } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import HairlineDivider from "../components/HairlineDivider.jsx";

/**
 * FAQ — a plain informational screen that closes the dead-end HomeFooter
 * "FAQ" entry (previously a no-op).
 *
 * REBUILD v1 (scope locked May 30, 2026). Standalone Q&A surface, reached via
 * HomeFooter "FAQ" → onNavigate("faq") → setScreen("faq") in AppV2.
 *
 * COPY STATUS: DRAFT — positioning is Arlin's call, so these answers are a
 * first pass for her to approve or rewrite, not finalized product voice.
 *
 * GUARDRAILS (do not soften):
 *   - Framing-law clean: Stillform is self-mastery via metacognition / sharper
 *     thinking; steadiness is a FELT OUTCOME, never the pitch. NO "regulation,"
 *     "wellness," "calm-down," or "crisis-tool" framing. No positioning by a
 *     "not-X, not-Y" litany.
 *   - Feature-accurate: every answer describes only what the live build does.
 *     No encryption claim. No hard price (pricing is not locked — point to the
 *     subscribe screen). No in-app path that isn't actually wired.
 *   - The crisis/safety answer must carry real, current resources.
 *
 * @param {function(): void} onExit — called when the user taps back to home.
 */
const idOf = (it) =>
  it.id || it.q.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function FAQ({ onExit }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(() => new Set());
  const q = query.trim().toLowerCase();
  const filtered = q ? ITEMS.filter((it) => it.q.toLowerCase().includes(q)) : ITEMS;

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Jump chip: auto-expand the target, then smooth-scroll to it once rendered.
  const jump = (id) => {
    setOpen((prev) => new Set(prev).add(id));
    setTimeout(() => {
      try {
        document.getElementById(`faq-q-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch {
        /* non-fatal */
      }
    }, 60);
  };

  return (
    <>
      <div className="sf-home-aura" aria-hidden="true" />
      <div className="sf-home-grain" aria-hidden="true" />
      <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)", position: "relative", zIndex: 1 }}>
      <button type="button" onClick={onExit} aria-label="Back to home" style={BACK_BTN}>
        ← back
      </button>

      <EditorialBlock
        label="FAQ"
        headline="Common questions"
        headlineSize="md"
        body={<>The short version of what Stillform is, how it works, and what happens to your data.</>}
        rule
      />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search the FAQ"
        aria-label="Search the FAQ"
        style={SEARCH}
      />

      {/* Jump index — tap a question to open it and scroll to it. */}
      {filtered.length > 0 && (
        <div style={CHIPS}>
          {filtered.map((it) => {
            const id = idOf(it);
            return (
              <button key={id} type="button" onClick={() => jump(id)} style={CHIP}>
                {it.q.replace(/\?$/, "")}
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && <p style={NORESULTS}>No questions match that search.</p>}

      {/* Entries — expand/collapse per question. */}
      {filtered.map((it) => {
        const id = idOf(it);
        const isOpen = open.has(id);
        return (
          <div key={id} id={`faq-q-${id}`} style={ENTRY}>
            <button type="button" onClick={() => toggle(id)} aria-expanded={isOpen} style={QBTN}>
              <span aria-hidden="true" style={{ ...CHEV, transform: isOpen ? "rotate(90deg)" : "none" }}>
                ▸
              </span>
              <span style={QTEXT}>{it.q}</span>
            </button>
            {isOpen && <div style={ANSWER}>{it.a}</div>}
          </div>
        );
      })}

      <HairlineDivider />
      <section style={{ ...SECTION, marginBottom: "var(--sf-space-32)" }}>
        <p style={FAINT}>
          Still stuck?{" "}
          <a href="mailto:ARAembersllc@proton.me" style={LINK}>
            ARAembersllc@proton.me
          </a>
        </p>
      </section>
      </main>
    </>
  );
}

/**
 * DRAFT Q&A. Answers are JSX so contact/crisis links render inline.
 * Reviewed against the framing law and the live build before shipping.
 */
// Style consts live ABOVE ITEMS deliberately: ITEMS is a module-level array
// whose JSX evaluates at import time — referencing a const declared below it
// is a TDZ crash in the production bundle (boot blank-screen, June 2 2026).

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

const SECTION = {
  marginTop: "var(--sf-space-32)",
  marginBottom: "var(--sf-space-32)",
};

const QUESTION = {
  fontSize: "17px",
  lineHeight: 1.4,
  fontWeight: 300,
  margin: "8px 0 12px",
};

const ANSWER = {
  fontSize: "15px",
  lineHeight: 1.55,
  margin: 0,
};

const FAINT = {
  color: "var(--sf-text-faint)",
  fontSize: "13px",
  lineHeight: 1.5,
  margin: 0,
};

const LINK = {
  color: "inherit",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
};

const SEARCH = {
  width: "100%",
  boxSizing: "border-box",
  background: "var(--sf-ground-elev)",
  border: "1px solid var(--sf-border-hairline)",
  borderRadius: "8px",
  padding: "12px 14px",
  color: "var(--sf-text-primary)",
  fontSize: "14px",
  lineHeight: 1.5,
  outline: "none",
  marginTop: "var(--sf-space-24)",
  marginBottom: "20px",
};

const CHIPS = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
  marginBottom: "var(--sf-space-32)",
};

const CHIP = {
  background: "transparent",
  border: "1px solid var(--sf-border-hairline)",
  borderRadius: "999px",
  padding: "6px 11px",
  fontSize: "11px",
  letterSpacing: "0.02em",
  color: "var(--sf-text-faint)",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
};

const NORESULTS = {
  color: "var(--sf-text-faint)",
  fontSize: "13px",
  fontStyle: "italic",
  textAlign: "center",
  padding: "var(--sf-space-32) var(--sf-space-16)",
};

const ENTRY = { borderTop: "1px solid var(--sf-border-hairline)" };

const QBTN = {
  width: "100%",
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  background: "transparent",
  border: "none",
  textAlign: "left",
  padding: "16px 0",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
};

const CHEV = {
  flexShrink: 0,
  marginTop: "3px",
  color: "var(--sf-accent)",
  fontSize: "11px",
  lineHeight: 1,
  transition: "transform var(--sf-motion-default) var(--sf-ease-prestige)",
};

const QTEXT = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "19px",
  fontWeight: 300,
  lineHeight: 1.3,
  color: "var(--sf-text-cream)",
};


const ITEMS = [
  {
    id: "what",
    q: "What is Stillform?",
    a: (
      <>
        A practice for seeing how you think — and thinking more clearly because of it. You move
        through a short, guided sequence; over time it sharpens how you read a situation and what
        you do next. Steadiness is something you feel as a result of the work, not the point of it.
      </>
    ),
  },
  {
    id: "thought-record",
    q: "What is the Thought Record?",
    a: (
      <>
        You take one thought, rate how strongly you believe it, look at the evidence for and
        against, then rate it again. The change in that number is the point — watching a certainty
        loosen when you actually examine it. It stays on your device.
      </>
    ),
  },
  {
    id: "your-arc",
    q: "What is Your Arc?",
    a: (
      <>
        The through-line of your practice, in your own words — the moments you named, in order,
        with the patterns that keep returning. It's built only from what you've entered, never a
        story written for you, and it shows nothing until you've practiced enough to form a line.
      </>
    ),
  },
  {
    id: "practice-evidence",
    q: "What is Practice Evidence?",
    a: (
      <>
        Short exercises that measure functions the practice trains — how quickly you name a
        feeling, how flexibly you can re-see a thought. The numbers are read only against your own
        earlier rounds, never a norm or anyone else, as honest evidence the practice is working.
      </>
    ),
  },
  {
    id: "vulnerabilities",
    q: "What is \u201cYour vulnerabilities\u201d?",
    a: (
      <>
        Charged traits \u2014 a need, a sensitivity, a reflex \u2014 each seen as one trait with two
        edges: where it tips you when it runs unseen, and where the same trait serves you. You name
        them yourself, or confirm ones Stillform surfaces from your own words. Nothing is surfaced
        without the work to move through it, and it stays on your device.
      </>
    ),
  },
  {
    id: "protective-moves",
    q: "What are \u201cYour protective moves\u201d?",
    a: (
      <>
        The automatic moves you make under pressure \u2014 how you handle a hard truth (deflect, go
        quiet, retreat into analysis) or your first reflex under threat. Each is held with both edges:
        where it once protected you, and where the old reflex costs you now. Standard equipment, never
        a flaw.
      </>
    ),
  },
  {
    id: "your-window",
    q: "What is \u201cYour window\u201d?",
    a: (
      <>
        Your clear-thinking zone \u2014 and which way you tip when you're pushed past it (wound up, or
        shut down), plus where activation tends to show up first in your body. The point is the
        correction that matches your tilt: revved \u2192 settle, shut-down \u2192 re-engage.
      </>
    ),
  },
  {
    id: "body-or-story",
    q: "What is \u201cBody, or the story?\u201d",
    a: (
      <>
        A quick check for when a feeling might be your body rather than a verdict about your life.
        Depleted, short on sleep, in pain, or running hot, \u201cI can't handle this\u201d can be the
        hardware talking. Naming which it is changes whether a sensation reads as danger or just tired.
      </>
    ),
  },
  {
    id: "whats-strong",
    q: "What is \u201cWhat's strong in you\u201d?",
    a: (
      <>
        What you're genuinely good at, where it already shows, and one way to use it on purpose. Named
        by you, or surfaced by Stillform from your own words. Not flattery \u2014 a real capacity to
        lean on, and the bright counterweight to the harder surfaces.
      </>
    ),
  },
  {
    id: "moving-toward",
    q: "What is \u201cWhat you're moving toward\u201d?",
    a: (
      <>
        A direction you choose to move toward, what living it looks like, and one concrete step. The
        choosing stays yours \u2014 Stillform can reflect a direction it hears in your words, but never
        prescribes one.
      </>
    ),
  },
  {
    id: "reframe-or-hold",
    q: "What is \u201cReframing, or holding it in?\u201d",
    a: (
      <>
        Two ways to handle a hard feeling \u2014 reframe it (change the read so it lands differently)
        or hold it in and carry it. Most people lean one way without noticing. Seeing your lean turns
        the holding into a cue: when you catch yourself carrying something, that's the moment to
        reframe it.
      </>
    ),
  },
  {
    id: "observer-seat",
    q: "What is \u201cThe observer seat\u201d?",
    a: (
      <>
        A move for stepping out of a thought to watch it, instead of being run by it. You put in a
        thought that's gripping you, and it hands the thought back from a step away. The words don't
        change \u2014 your distance from them does, and that gap is where the choice lives.
      </>
    ),
  },
  {
    id: "triggers-concentrate",
    q: "What is \u201cWhere your triggers concentrate\u201d?",
    a: (
      <>
        The layer above your triggers: across everything you've named, where the load pools, and which
        triggers actually carry the weight. It's read from your own data, and it points the work \u2014
        aim where it concentrates, start with what shows up most.
      </>
    ),
  },
  {
    id: "how-this-works",
    q: "What is \u201cHow this works\u201d?",
    a: (
      <>
        The model underneath the practice, in plain terms: you build the vocabulary to read your own
        mind, the reps wire new responses in so the work compounds instead of resetting, and working a
        live trigger rewrites it instead of papering over it. It's why this builds rather than
        maintains.
      </>
    ),
  },
  {
    id: "session",
    q: "How does a session work?",
    a: (
      <>
        Open the app and it meets you where the day is — a brief State Check, a guided reframe, and a
        close. You can start a quick breathing reset any time, too. Most sessions take a few minutes.
      </>
    ),
  },
  {
    id: "scope",
    q: "Is Stillform a substitute for professional help?",
    a: (
      <>
        No — it's a self-directed practice, not a substitute for professional care. If you're in
        crisis or thinking about harming yourself, reach out to a professional or a crisis line now.
        In the US you can call or text <strong>988</strong>, or text <strong>HOME</strong> to{" "}
        <strong>741741</strong>.
      </>
    ),
  },
  {
    id: "data",
    q: "Where does my data live? Is it private?",
    a: (
      <>
        Everything you enter stays on your device. The only thing that leaves it is an anonymous
        check that confirms your access — no journal content, nothing personal. You can wipe
        everything from this device any time in Settings.
      </>
    ),
  },
  {
    id: "todays-brief",
    q: "What is Today's Brief?",
    a: (
      <>
        After your morning State Check, Stillform composes a short brief for the day &mdash; your
        hardware (the state you&rsquo;re carrying), the risks worth seeing, a move or two, and how
        to recover. It&rsquo;s built from what you named plus your own patterns, and the brief
        is kept on your home screen so you can re-read it through the day. Collapse it any time.
      </>
    ),
  },
  {
    id: "day-named",
    q: "What is \u201cThe day, named\u201d?",
    a: (
      <>
        When you close out the evening, Stillform writes one line naming what the day taught
        you &mdash; a read you might not catch yourself. It&rsquo;s separate from the takeaway you
        name for yourself; it&rsquo;s the app&rsquo;s reflection of the day, drawn from what happened
        in your practice. It&rsquo;s kept on your device and shows on your home screen.
      </>
    ),
  },
  {
    id: "something-surfaced",
    q: "What is \u201cSomething surfaced\u201d on My Progress?",
    a: (
      <>
        As you practice, Stillform quietly notes the discrete things you name &mdash; a feel-state,
        a trigger &mdash; and runs simple math over them to spot when two tend to show up near each
        other. When it finds one, it asks you plainly: does this land? It&rsquo;s never a claim or a
        diagnosis &mdash; a pattern drawn from your own words, for you to confirm or wave off. If you
        say &ldquo;not this,&rdquo; it never comes back.
      </>
    ),
  },
  {
    id: "cost",
    q: "What does \u201cgone quiet\u201d mean on my watch list?",
    a: "A pattern you watch is confirmed when it keeps showing up in your sessions. If it then stops appearing across continued practice \u2014 real sessions, over weeks \u2014 it moves to \u201cgone quiet.\u201d That\u2019s observed change, not a cure claim: it reflects your sessions, and if the pattern shows up again it simply moves back. That\u2019s information, not a setback.",
  },
  {
    q: "What does it cost?",
    a: (
      <>
        Stillform is a subscription, with a free tier that stays free — the quick breathing reset and
        the core stabilization tools never sit behind a paywall. You'll see current pricing on the
        subscribe screen.
      </>
    ),
  },
  {
    id: "manage",
    q: "How do I manage or cancel my subscription?",
    a: (
      <>
        Through the billing portal from your subscription provider. If you can't find it, email{" "}
        <a href="mailto:ARAembersllc@proton.me" style={LINK}>
          ARAembersllc@proton.me
        </a>{" "}
        and we'll take care of it.
      </>
    ),
  },
  {
    id: "inactive",
    q: "I paid, but it says my access is inactive.",
    a: (
      <>
        Open Settings and tap “Refresh from server” — that re-checks your subscription. If it still
        looks wrong, email{" "}
        <a href="mailto:ARAembersllc@proton.me" style={LINK}>
          ARAembersllc@proton.me
        </a>{" "}
        and we'll fix it.
      </>
    ),
  },
  {
    id: "step-out",
    q: "The app said a pattern of mine looks active \u2014 what is that?",
    a: (
      <>
        Once you\u2019ve confirmed a recurring pattern in your own entries (see \u201cSomething
        surfaced\u201d), if one of its pieces shows up again in the last few days, Stillform may
        offer \u2014 quietly, when you open it \u2014 to step out of that pattern for a minute. Stepping
        out is a short sensory reset; it doesn\u2019t dig back into the loop. It\u2019s only ever an
        offer: take it or tap \u201cNot now,\u201d and it won\u2019t keep asking.
      </>
    ),
  },
  {
    id: "other-read",
    q: "What is \u201cthe other read\u201d?",
    a: (
      <>
        When you\u2019re testing how strongly you believe a thought \u2014 in the Thought Record, or
        from Reframe \u2014 you can ask for the strongest honest case for reading it a different way.
        It\u2019s optional, and you always decide what to do with it. It only engages a thought that
        could genuinely be distorted; if what you named is a real boundary, a value, grief, or a
        fair read of a hard situation, it leaves it alone rather than talk you out of it.
      </>
    ),
  },
  {
    id: "calendar",
    q: "Can Stillform use my calendar?",
    a: (
      <>
        If you want to. In Settings &rarr; Calendar you can import your schedule from a .ics file
        (Google, Apple, and Outlook all export one), or from a screenshot of your calendar (read by
        AI to pull out titles and times &mdash; only send one you&rsquo;re comfortable sharing).
        Stillform keeps only event titles and times, on
        your device &mdash; never who&rsquo;s invited or any notes &mdash; and uses them to help
        prepare your day. Disconnecting forgets everything. In the phone app this will connect to
        your calendar directly; on the web you import the file.
      </>
    ),
  },
  {
    id: "weather",
    q: "Does the weather affect what Stillform says?",
    a: (
      <>
        Only quietly, and only if you turn it on. In Settings &rarr; Ambient weather you can let
        Stillform check the day&rsquo;s conditions from your rough location &mdash; a low-pressure,
        grey, or short-daylight day can weigh on a person, and the read can hold the room a little
        more gently when it does. Your location is never stored, only the day&rsquo;s weather, on
        your device; turning it off forgets it. Stillform will never tell you the weather is the
        reason you feel a certain way &mdash; you always name your own experience.
      </>
    ),
  },
  {
    id: "season-review",
    q: "What is “Read the season”?",
    a: (
      <>
        A look back over your last three months of practice, written from your own record &mdash;
        sessions done, thoughts tested, capacities that moved, triggers that have gone quiet, and
        what you named about yourself along the way. It appears in My Progress once a season holds
        enough work to read honestly, and it&rsquo;s computed on your device from data you already
        have &mdash; nothing new is collected.
      </>
    ),
  },
  {
    id: "remeasure",
    q: "Why would I take a Workshop check more than once?",
    a: (
      <>
        Because the practice changes the thing being measured. The first take is your baseline; a
        later take shows what&rsquo;s actually moved &mdash; in words, never scores. The Growth
        mirror keeps both and tells you what shifted. After a season or so it will quietly note
        that a fresh read is available; whether and when to take one is always yours.
      </>
    ),
  },
  {
    id: "concierge-what",
    q: "What is the concierge, and how does it decide when to speak?",
    a: (
      <>
        It reads the data you&rsquo;ve already given the app &mdash; your calendar, the local
        weather, patterns you&rsquo;ve named yourself &mdash; and stays quiet unless those line up
        into something worth a word. It doesn&rsquo;t watch your mood or guess at how you feel.
        Most of the time it says nothing, and that silence is intended, not a failure. There&rsquo;s a
        full walkthrough under &ldquo;How the concierge works&rdquo; in the concierge room and in Settings.
      </>
    ),
  },
  {
    id: "concierge-earns",
    q: "How does each concierge note earn its place?",
    a: (
      <>
        Each voice has one job and one trigger. The umbrella note speaks only when rain is forecast
        right around a calendar event. The no-gap note speaks only when your day leaves no real
        midday break. Tomorrow-tonight speaks only in the evening, when tomorrow morning is loaded.
        None speak on a schedule &mdash; only when the world lines up.
      </>
    ),
  },
  {
    id: "concierge-logistics",
    q: "Will the concierge ever comment on how I feel?",
    a: (
      <>
        No. It predicts the world &mdash; rain, gaps, heat, a full morning &mdash; and never makes a
        claim about who you are or how you feel. &ldquo;Rain around 3, umbrella by the door&rdquo; is
        logistics. Something like &ldquo;you seem anxious&rdquo; is not something it will say.
      </>
    ),
  },
  {
    id: "concierge-dismiss",
    q: "What happens when I wave off a concierge note?",
    a: (
      <>
        It leaves your home surface for that occasion &mdash; not deleted, not punished, and never
        &ldquo;overdue.&rdquo; Nothing here keeps score. You can also switch any single voice off in
        Settings, and it goes silent everywhere until you bring it back.
      </>
    ),
  },
  {
    id: "concierge-install",
    q: "How do I install the app to my home screen (Android)?",
    a: (
      <>
        In Chrome: open the three-dot menu, choose &ldquo;Add to Home screen&rdquo; (sometimes
        &ldquo;Install app&rdquo;), confirm the name, and tap Add. On Samsung Internet it&rsquo;s the
        menu &rarr; &ldquo;Add page to&rdquo; &rarr; &ldquo;Home screen.&rdquo; Installed, it opens
        full-screen and the concierge can reach you the way an app would.
      </>
    ),
  },
  {
    id: "concierge-calendar",
    q: "How do I connect my calendar?",
    a: (
      <>
        In Settings, grant calendar consent, then import your events &mdash; paste a calendar link
        (.ics) or a screenshot of your day, and the app reads the events from it. Your calendar stays
        on your device; it isn&rsquo;t sent anywhere or copied to a server.
      </>
    ),
  },
  {
    id: "concierge-weather",
    q: "How do I turn on weather for the concierge?",
    a: (
      <>
        In Settings, grant location for weather. The app then pulls the local forecast (including the
        rain window the umbrella note uses) on its own. Location is coarse and used only for the
        forecast; revoke it any time and the weather voices go quiet.
      </>
    ),
  },
  {
    id: "concierge-morning-row",
    q: "What is the morning row, and how do I set it up?",
    a: (
      <>
        It&rsquo;s a set of one-tap shortcuts to the apps you open first &mdash; it works alongside
        your other apps, never replacing them. In Settings, open the morning-row editor, add a
        shortcut with a name and the app&rsquo;s link (most apps have a web link; some have a deep
        link in their share menu), and reorder them into the sequence you actually use.
      </>
    ),
  },
];
