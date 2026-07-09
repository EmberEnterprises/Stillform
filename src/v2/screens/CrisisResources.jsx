import { buildSessionSummary } from "../lib/sessionSummary.js";
import React from "react";
import BrassCross from "../components/BrassCross.jsx";
import CollapsibleSection from "../components/CollapsibleSection.jsx";

/**
 * CrisisResources — the safety handoff surface (Home footer sub-link).
 * This screen existing and working is a safety requirement.
 *
 * FRAMING (canon framing law): Stillform is a practice, not a crisis service —
 * never positioned as a crisis tool. Quiet, fast handoff. No product voice, no
 * upsell, no analytics on this screen (views here are nobody's data point).
 *
 * STRUCTURE = V1 (June 23 2026, Arlin — reproduced faithfully this time, not
 * re-invented): region label + horizontal rows (name + note LEFT, the number
 * with an arrow RIGHT), a PRIMARY region shown, the rest behind an "Other
 * resources" expander, emergency numbers always visible. Skinned in the HOME
 * aesthetic for uniformity (warm aura + grain ground, drawn-brass region rules,
 * Cormorant serif names, brass numbers, hairline rows). No data-summary pop-up.
 *
 * Numbers web-verified June 2 2026 (zero-fabrication). Text links US-only.
 *
 * @param {function(): void} onExit — back to home.
 */

// Primary region first; others fall behind the "Other resources" expander.
const REGIONS = [
  {
    region: "United States",
    lines: [
      { name: "988 Suicide & Crisis Lifeline", note: "Free, confidential, 24/7. Spanish available.", number: "Call or text 988", href: "tel:988" },
      { name: "Crisis Text Line", note: "Text-based support with a trained counsellor, 24/7.", number: "Text HOME to 741741", href: "sms:741741?&body=HOME" },
    ],
  },
  {
    region: "Brazil",
    lines: [
      { name: "CVV — Centro de Valorização da Vida", note: "Free and confidential, 24/7. Emergency: 192.", number: "Ligar 188", href: "tel:188" },
      { name: "CVV — chat support", note: "Online chat support.", number: "cvv.org.br", href: "/go/cvv", external: true },
    ],
  },
  {
    region: "Spain",
    lines: [
      { name: "Línea 024", note: "Suicide-crisis support. Free, 24/7. Emergency: 112.", number: "Llamar 024", href: "tel:024" },
    ],
  },
  {
    region: "Mexico",
    lines: [
      { name: "Línea de la Vida", note: "Free and confidential, 24/7. Emergency: 911.", number: "Llamar 800 911 2000", href: "tel:8009112000" },
    ],
  },
  {
    region: "Armenia",
    lines: [
      { name: "Emotional Support Hotline", note: "Toll-free (MHAI · Yerevan). Mon–Fri 09:00–18:00. Outside hours, call 112.", number: "Call 0800 00 900", href: "tel:080000900" },
      { name: "Armenia helpline directory", note: "All Armenia crisis lines.", number: "findahelpline.com", href: "/go/helpline-am", external: true },
    ],
  },
];

const EMERGENCY = {
  region: "Immediate danger",
  lines: [
    { name: "Emergency services (US)", note: "If you or someone else is in immediate danger.", number: "Call 911", href: "tel:911" },
    { name: "Emergency services (Europe & more)", note: "The single emergency number across the EU and many other countries.", number: "Call 112", href: "tel:112" },
  ],
};

function CrisisLine({ name, note, number, href, external }) {
  const body = (
    <>
      <span style={LINE_MAIN}>
        <span style={NAME}>{name}</span>
        {note ? <span style={NOTE}>{note}</span> : null}
      </span>
      <span style={NUM}>
        {number} <span aria-hidden="true">→</span>
      </span>
    </>
  );
  return href ? (
    <a
      href={href}
      style={LINE}
      aria-label={`${name} — ${number}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {body}
    </a>
  ) : (
    <div style={LINE}>{body}</div>
  );
}

function RegionGroup({ region, lines }) {
  return (
    <div style={{ marginBottom: "var(--sf-space-24)" }}>
      <div className="sf-sec-head">
        <span className="sf-sec-head-lbl">{region}</span>
        <div className="sf-sec-rule" />
      </div>
      {lines.map((l) => (
        <CrisisLine key={l.href + l.number} {...l} />
      ))}
    </div>
  );
}

export default function CrisisResources({ onExit }) {
  const [primary, ...others] = REGIONS;

  return (
    <>
      <div className="sf-home-aura" aria-hidden="true" />
      <div className="sf-home-grain" aria-hidden="true" />
      <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)", position: "relative", zIndex: 1 }}>
        <button type="button" onClick={onExit} style={BACK_BTN} aria-label="Back to home">
          ← back
        </button>

        <header style={{ marginBottom: "var(--sf-space-32)" }}>
          <BrassCross size={22} style={{ display: "block", marginBottom: "var(--sf-space-16)" }} />
          <h1 style={H1}>Crisis Resources</h1>
          <p style={LEAD}>
            Stillform is a practice, not a crisis service. The lines below are
            staffed by people trained for exactly this moment — free,
            confidential, around the clock.
          </p>
        </header>

        {/* Primary region — always visible */}
        <RegionGroup region={primary.region} lines={primary.lines} />

        {/* Other regions — V1's "Other resources" expander */}
        {others.length > 0 ? (
          <CollapsibleSection label="Other resources">
            {others.map((r) => (
              <RegionGroup key={r.region} region={r.region} lines={r.lines} />
            ))}
          </CollapsibleSection>
        ) : null}

        {/* Emergency — always visible, never behind an expander */}
        <div style={{ marginTop: "var(--sf-space-32)" }}>
          <RegionGroup region={EMERGENCY.region} lines={EMERGENCY.lines} />
        </div>

        <p style={NOTE_BLOCK}>
          Anywhere else,{" "}
          <a href="/go/helpline" target="_blank" rel="noopener noreferrer" style={INLINE_LINK}>
            findahelpline.com
          </a>{" "}
          lists crisis lines by country.
        </p>
        <p style={{ ...NOTE_BLOCK, marginTop: "var(--sf-space-8)", marginBottom: "var(--sf-space-48)" }}>
          Reaching out is not a failure of the practice. It is the strongest read
          of the moment there is.
        </p>

      {/* 0b (2026-07-02): the June-15 handoff summary, finally wired — OPT-IN
          only, generated the moment THEY tap, never auto-surfaced. */}
      <HandoffSummary />
      </main>
    </>
  );
}

const BACK_BTN = {
  background: "transparent", border: "none", color: "var(--sf-text-faint)",
  fontFamily: "var(--sf-font-mono)", fontSize: "11px", letterSpacing: "0.14em",
  textTransform: "uppercase", cursor: "pointer", padding: "8px 0",
  marginBottom: "var(--sf-space-24)", WebkitTapHighlightColor: "transparent",
};
const H1 = {
  fontFamily: "var(--sf-font-serif)", fontSize: "var(--sf-text-display-md)", fontWeight: 300,
  lineHeight: 1.15, color: "var(--sf-text-cream)", margin: "var(--sf-space-8) 0 var(--sf-space-12)",
};
const LEAD = {
  fontFamily: "var(--sf-font-sans)", fontWeight: 300, fontSize: "15px",
  lineHeight: 1.6, color: "var(--sf-text-faint)", margin: 0,
};
// V1 horizontal row, home aesthetic: name+note left, brass number → right.
const LINE = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  gap: "var(--sf-space-16)", padding: "var(--sf-space-16) 0", minHeight: "44px",
  borderBottom: "0.5px solid var(--sf-border-hairline)",
  textDecoration: "none", color: "inherit", WebkitTapHighlightColor: "transparent",
};
const LINE_MAIN = { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" };
const NAME = {
  fontFamily: "var(--sf-font-serif)", fontSize: "18px", fontWeight: 300,
  lineHeight: 1.3, color: "var(--sf-text-cream)",
};
const NOTE = {
  fontFamily: "var(--sf-font-sans)", fontWeight: 300, fontSize: "13px",
  lineHeight: 1.5, color: "var(--sf-text-faint)", marginTop: "3px",
};
const NUM = {
  flexShrink: 0, fontFamily: "var(--sf-font-sans)", fontSize: "14px", fontWeight: 300,
  color: "var(--sf-accent)", whiteSpace: "nowrap",
};
const NOTE_BLOCK = {
  fontFamily: "var(--sf-font-sans)", fontWeight: 300, fontSize: "13.5px",
  lineHeight: 1.55, color: "var(--sf-text-faint)", margin: "var(--sf-space-24) 0 0",
};
const INLINE_LINK = {
  color: "var(--sf-accent)", textDecoration: "underline", textUnderlineOffset: "3px",
};


function HandoffSummary() {
  const [text, setText] = React.useState(null);
  if (text === null) {
    return (
      <section style={{ marginTop: "var(--sf-space-24)" }}>
        <button
          type="button"
          className="sf-link-quiet"
          onClick={() => {
            let s = "";
            try { s = buildSessionSummary() || ""; } catch { s = ""; }
            setText(s || "Nothing on record yet — the summary builds from your practice.");
          }}
        >
          If you're about to talk to someone — a plain summary of what you've been working through, to have in hand
        </button>
      </section>
    );
  }
  return (
    <section style={{ marginTop: "var(--sf-space-24)", border: "0.5px solid var(--sf-border-hairline)", padding: "var(--sf-space-16)" }}>
      <p style={{ fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "15px", lineHeight: 1.7, color: "var(--sf-text-secondary)", whiteSpace: "pre-wrap", margin: 0 }}>{text}</p>
    </section>
  );
}
