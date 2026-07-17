import React from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";

/**
 * ConciergeSetup — P21 (Arlin 2026-07-09). ONE guide, two halves:
 *   HALF 1 — what the concierge is and how it earns its voice (education).
 *   HALF 2 — the technical setup: install, shortcuts, links, calendar, weather.
 *
 * Android-first per Arlin's platform call. Every step here is mirrored as an
 * FAQ entry (no external instruction links — the app teaches itself). Reachable
 * from the Concierge room ("Set it up") and from Settings.
 */

const SECTION = { marginTop: "var(--sf-space-40)" };
const H = {
  margin: "0 0 var(--sf-space-12)",
  fontFamily: "var(--sf-font-serif)",
  fontWeight: 300,
  fontSize: "22px",
  lineHeight: 1.25,
  color: "var(--sf-text)",
};
const P = {
  margin: "0 0 var(--sf-space-16)",
  fontFamily: "var(--sf-font-serif)",
  fontWeight: 300,
  fontSize: "15px",
  lineHeight: 1.7,
  color: "var(--sf-text-soft)",
};
const STEP = {
  margin: "0 0 var(--sf-space-12)",
  paddingLeft: "var(--sf-space-16)",
  borderLeft: "1px solid var(--sf-hairline)",
  fontFamily: "var(--sf-font-serif)",
  fontWeight: 300,
  fontSize: "14px",
  lineHeight: 1.7,
  color: "var(--sf-text-soft)",
};
const NUM = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "10px",
  letterSpacing: "0.14em",
  color: "var(--sf-text-faint)",
  marginRight: "var(--sf-space-8)",
};

function Half({ label, children }) {
  return (
    <section style={SECTION}>
      <MonoLabel>{label}</MonoLabel>
      <div style={{ marginTop: "var(--sf-space-16)" }}>{children}</div>
    </section>
  );
}

function Step({ n, children }) {
  return (
    <p style={STEP}>
      <span style={NUM}>{String(n).padStart(2, "0")}</span>
      {children}
    </p>
  );
}

export default function ConciergeSetup({ onExit, onOpenFAQ }) {
  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      {typeof onExit === "function" && (
        <button type="button" onClick={onExit} aria-label="Back" className="sf-link-quiet" style={{ marginBottom: "var(--sf-space-16)" }}>
          ‹ Back
        </button>
      )}

      <EditorialBlock
        label="The concierge"
        headline="How it works, and how to set it up."
        headlineSize="lg"
        body="Two halves. First, what the concierge actually is and how it earns each thing it says. Then, the practical setup — nothing here needs a manual from somewhere else."
      />

      {/* ───────────────── HALF 1 — EDUCATION ───────────────── */}
      <Half label="Half one · what it is">
        <p style={H}>It reads your own data, and only speaks when it has something real.</p>
        <p style={P}>
          The concierge doesn't watch you or guess at your mood. It reads the things you've already
          given the app — your calendar, the weather where you are, the patterns you've named yourself —
          and it stays quiet unless those line up into something worth a word. Most of the time it says nothing.
          That silence is the feature, not a failure.
        </p>

        <p style={H}>Every voice earns its place.</p>
        <p style={P}>
          Each kind of note has one job and one trigger. The umbrella note speaks only when rain is
          forecast right around something on your calendar. The no-gap note speaks only when your own day
          leaves no real break in the middle. Tomorrow-tonight speaks only in the evening, when tomorrow
          morning is genuinely loaded. None of them speak on a schedule — they speak when the world lines up.
        </p>

        <p style={H}>Prediction is about logistics, never about you.</p>
        <p style={P}>
          The line the concierge holds: it predicts the world — rain, gaps, heat, a full morning — and never
          makes a claim about who you are or how you feel. "Rain around 3, umbrella by the door" is logistics.
          "You seem anxious" is not something it will ever say. The world is fair game; you are not.
        </p>

        <p style={H}>Off your home, never gone.</p>
        <p style={P}>
          Wave off any note and it leaves your home surface — but it isn't deleted or punished. It simply
          won't crowd you again for that occasion. Nothing here keeps score, and nothing goes "overdue."
          A note you didn't act on is just a note you didn't need.
        </p>

        <p style={H}>It reads the day and eases off when it's heavy.</p>
        <p style={P}>
          On a loaded day the concierge says less, not more — it's designed to get quieter exactly when a
          quieter presence is what helps. You can also turn any single voice off entirely in Settings, and
          it goes silent everywhere until you bring it back.
        </p>
      </Half>

      {/* ───────────────── HALF 2 — TECHNICAL SETUP ───────────────── */}
      <Half label="Half two · setting it up">
        <p style={H}>Install it to your home screen (Android).</p>
        <Step n={1}>Open this app in Chrome on your phone.</Step>
        <Step n={2}>Tap the three-dot menu at the top right.</Step>
        <Step n={3}>Choose "Add to Home screen" (sometimes "Install app").</Step>
        <Step n={4}>Confirm the name and tap "Add." An icon lands on your home screen like any app.</Step>
        <p style={P}>
          On Samsung Internet the step is the same, under the menu as "Add page to" → "Home screen."
          Installed, it opens full-screen with no browser bar, and the concierge can reach you the way an app would.
        </p>

        <p style={H}>Connect your calendar.</p>
        <Step n={1}>Open Settings inside the app.</Step>
        <Step n={2}>Find the calendar row and grant consent — this is what lets the concierge see your events.</Step>
        <Step n={3}>Import your events: paste a calendar link (.ics) or a screenshot of your day, and the app reads the events from it.</Step>
        <p style={P}>
          Your calendar stays on your device. The app reads it to line up notes; it doesn't send it anywhere
          or keep a copy on a server.
        </p>

        <p style={H}>Turn on weather.</p>
        <Step n={1}>In Settings, grant location for weather.</Step>
        <Step n={2}>That's all — the app pulls the local forecast (including the rain window the umbrella note uses) on its own.</Step>
        <p style={P}>Location is coarse and used only for the forecast. Revoke it any time and the weather voices simply go quiet.</p>

        <p style={H}>Build your morning row (optional).</p>
        <p style={P}>
          The morning row is a set of one-tap shortcuts to the apps you open first — the ones that order your
          morning. It works alongside your other apps rather than replacing them.
        </p>
        <Step n={1}>In Settings, open the morning-row editor.</Step>
        <Step n={2}>Add a shortcut: give it a name and the app's link. Most apps have a web link you can paste; some have a deep link you'll find in that app's share menu.</Step>
        <Step n={3}>Reorder them into the sequence you actually use. Leave anything off you don't want.</Step>
      </Half>

      <section style={{ ...SECTION, marginBottom: "var(--sf-space-48)" }}>
        <p style={P}>
          Every step here is also in the FAQ, one question at a time, if you'd rather find a single thing.
        </p>
        {typeof onOpenFAQ === "function" && (
          <button type="button" onClick={onOpenFAQ} className="sf-link-quiet">
            Open the FAQ →
          </button>
        )}
      </section>
    </main>
  );
}
