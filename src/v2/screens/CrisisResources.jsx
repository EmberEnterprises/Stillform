import React, { useState } from "react";
import MonoLabel from "../components/MonoLabel.jsx";
import BrassCross from "../components/BrassCross.jsx";
import HairlineDivider from "../components/HairlineDivider.jsx";
import { buildSessionSummary } from "../lib/sessionSummary.js";

/**
 * CrisisResources — the safety handoff surface.
 *
 * Reachable from the HomeFooter sub-link, and named by the crisis states in
 * Scripts and Rehearsal. This screen existing and working is a safety
 * requirement: the moment the app detects crisis it points people here, so a
 * dead end is not acceptable.
 *
 * FRAMING (canon framing law): Stillform is a practice, not a crisis service
 * — this screen never positions the product as a crisis tool. It is a quiet,
 * fast handoff to people trained for that moment. Plain language, large
 * single-tap targets (tel:/sms: links), no product voice, no upsell.
 *
 * REBUILD (June 15 2026, Arlin — "looks clumsy and messy"): the page was six
 * bespoke hand-coded blocks with inconsistent treatment. Rebuilt data-driven
 * (one RESOURCES array → uniform ruled rows, the V1 structure) skinned in the
 * v2 prestige system. Content + every verified number preserved exactly.
 *
 * SUMMARY BUTTON (June 15 2026, Arlin): an OPT-IN button — the user taps it
 * WHEN THEY CHOOSE (never auto-surfaced) — that generates a calm pop-up of
 * what THEY have named across practice, so they have somewhere to start when
 * they reach a person. Deterministic, their own words, no AI, no diagnosis.
 * See sessionSummary.js for the safety rationale.
 *
 * DELIBERATE: no analytics event on this screen. Tracking visits to a crisis
 * surface is invasive; views here are nobody's data point.
 *
 * Numbers web-verified June 2 2026 (zero-fabrication: numbers only ship
 * verified, hours stated honestly). Text links are US-only (the only verified
 * text lines); no sms: links are invented for call-only services.
 *
 * @param {function(): void} onExit — back to home.
 */

// One row per resource. `actions` are large single-tap targets.
// Every number here was web-verified June 2 2026.
const RESOURCES = [
  {
    meta: "CALL OR TEXT · 24/7 · US",
    name: "988 Suicide & Crisis Lifeline",
    note: "Free, confidential, around the clock. Spanish available.",
    actions: [
      { label: "Call 988", href: "tel:988", aria: "Call 988 now" },
      { label: "Text 988", href: "sms:988", aria: "Text 988 now" },
    ],
  },
  {
    meta: "TEXT · 24/7 · US",
    name: "Crisis Text Line",
    note: "Text-based support with a trained counsellor.",
    actions: [
      { label: "Text HOME to 741741", href: "sms:741741?&body=HOME", aria: "Text HOME to 741741 now" },
    ],
  },
  {
    meta: "CALL · 24/7 · BRAZIL",
    name: "CVV — Centro de Valorização da Vida",
    note: "Gratuito e sigiloso. Emergências: 192 (SAMU).",
    actions: [
      { label: "Ligar 188", href: "tel:188", aria: "Ligar 188 agora" },
      { label: "Chat — cvv.org.br", href: "https://www.cvv.org.br", aria: "Chat CVV", external: true },
    ],
  },
  {
    meta: "CALL · 24/7 · SPAIN",
    name: "Línea 024 — atención a la conducta suicida",
    note: "Gratuita y confidencial. Emergencias: 112.",
    actions: [
      { label: "Llamar 024", href: "tel:024", aria: "Llamar al 024 ahora" },
    ],
  },
  {
    meta: "CALL · 24/7 · MEXICO",
    name: "Línea de la Vida",
    note: "Gratuita y confidencial. Emergencias: 911.",
    actions: [
      { label: "Llamar 800 911 2000", href: "tel:8009112000", aria: "Llamar 800 911 2000 ahora" },
    ],
  },
  {
    meta: "CALL · MON–FRI 09:00–18:00 · ARMENIA",
    name: "Emotional Support Hotline",
    note: "Toll-free, nationwide (MHAI · Yerevan Municipality). Not 24/7 — outside hours, call 112 or use the directory below.",
    actions: [
      { label: "Call 0800 00 900", href: "tel:080000900", aria: "Call 0800 00 900 now" },
      { label: "Call 112", href: "tel:112", aria: "Call 112 now" },
      { label: "Armenia lines", href: "https://findahelpline.com/countries/am", aria: "Armenia helpline directory", external: true },
    ],
  },
  {
    meta: "IMMEDIATE DANGER",
    name: "Emergency services",
    note: "If you or someone else is in immediate danger, call your local emergency number now.",
    actions: [
      { label: "Call 911 (US)", href: "tel:911", aria: "Call 911 now" },
    ],
  },
];

function ResourceRow({ meta, name, note, actions }) {
  return (
    <div style={CARD}>
      <MonoLabel size="xs" tone="faint">{meta}</MonoLabel>
      <h2 style={H2}>{name}</h2>
      {note ? <p style={NOTE}>{note}</p> : null}
      <div style={{ ...ROW, marginTop: "var(--sf-space-12)" }}>
        {actions.map((a) => (
          <a
            key={a.href + a.label}
            href={a.href}
            style={ACTION}
            aria-label={a.aria}
            {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {a.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function CrisisResources({ onExit }) {
  const [summaryOpen, setSummaryOpen] = useState(false);
  // Built lazily, only when the user opts in — never on mount.
  const [summary, setSummary] = useState(null);

  const openSummary = () => {
    try {
      setSummary(buildSessionSummary());
    } catch {
      setSummary({ hasContent: false, intro: "", recurring: [], namings: [], closingNote: "You don't need anything prepared to reach out. The lines above are there for exactly this moment." });
    }
    setSummaryOpen(true);
  };

  return (
    <div style={WRAP}>
      <button type="button" onClick={onExit} style={BACK_BTN} aria-label="Back to home">
        ← Back
      </button>

      <header style={{ marginBottom: "var(--sf-space-24)" }}>
        <BrassCross size={22} style={{ display: "block", marginBottom: "var(--sf-space-12)" }} />
        <MonoLabel size="xs">CRISIS RESOURCES</MonoLabel>
        <h1 style={H1}>If it's heavier than practice right now.</h1>
        <p style={LEAD}>
          Stillform is a practice, not a crisis service. The lines below are
          staffed by people trained for exactly this moment — free,
          confidential, around the clock.
        </p>
      </header>

      {RESOURCES.map((r) => (
        <ResourceRow key={r.name} {...r} />
      ))}

      <HairlineDivider />

      <p style={{ ...NOTE, marginTop: "var(--sf-space-16)" }}>
        Anywhere else:{" "}
        <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" style={INLINE_LINK}>
          findahelpline.com
        </a>{" "}
        lists crisis lines by country.
      </p>

      <p style={{ ...NOTE, marginTop: "var(--sf-space-8)" }}>
        Reaching out is not a failure of the practice. It is the strongest read
        of the moment there is.
      </p>

      {/* Opt-in handoff summary — the user chooses to pull this up when they're
          ready to talk to someone. Quiet, below the lines: it never competes
          with reaching a person, and it is never auto-surfaced. */}
      <div style={{ marginTop: "var(--sf-space-32)" }}>
        <button type="button" onClick={openSummary} style={SUMMARY_BTN} aria-label="Put together what you've been working through">
          Put together what I've been working through ›
        </button>
        <p style={{ ...NOTE, marginTop: "var(--sf-space-8)" }}>
          A plain summary of what you've named, in your own words — something to
          start from when you talk to someone.
        </p>
      </div>

      {summaryOpen && summary ? (
        <SummaryModal summary={summary} onClose={() => setSummaryOpen(false)} />
      ) : null}
    </div>
  );
}

function SummaryModal({ summary, onClose }) {
  return (
    <div role="dialog" aria-modal="true" aria-label="What you've been working through" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={SCRIM}>
      <div style={MODAL_CARD}>
        <button type="button" onClick={onClose} aria-label="Close" style={X_BTN}>×</button>

        <MonoLabel size="xs" tone="quiet">WHAT YOU'VE BEEN WORKING THROUGH</MonoLabel>

        {summary.hasContent ? (
          <>
            <p style={{ ...LEAD, marginTop: "var(--sf-space-16)" }}>{summary.intro}</p>

            {summary.recurring.length > 0 ? (
              <div style={{ marginTop: "var(--sf-space-24)" }}>
                <MonoLabel size="xs" tone="faint">WHAT'S COME UP MOST</MonoLabel>
                <ul style={LIST}>
                  {summary.recurring.map((r) => (
                    <li key={r.label} style={LIST_ITEM}>
                      {r.label}
                      {r.count > 1 ? <span style={COUNT}> · named {r.count} times</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {summary.namings.length > 0 ? (
              <div style={{ marginTop: "var(--sf-space-24)" }}>
                <MonoLabel size="xs" tone="faint">IN YOUR OWN WORDS</MonoLabel>
                <ul style={LIST}>
                  {summary.namings.map((n, i) => (
                    <li key={i} style={LIST_ITEM}>{n}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        ) : null}

        <p style={{ ...NOTE, marginTop: "var(--sf-space-24)" }}>{summary.closingNote}</p>

        <div style={{ marginTop: "var(--sf-space-24)" }}>
          <button type="button" onClick={onClose} style={CLOSE_BTN} aria-label="Close">Close</button>
        </div>
      </div>
    </div>
  );
}

/* ---- styles ---- */

const WRAP = {
  minHeight: "100dvh",
  padding:
    "calc(env(safe-area-inset-top, 0px) + var(--sf-space-24)) var(--sf-space-24) calc(env(safe-area-inset-bottom, 0px) + var(--sf-space-32))",
  maxWidth: "520px",
  margin: "0 auto",
};

const BACK_BTN = {
  background: "transparent",
  border: "none",
  color: "var(--sf-text-quiet)",
  fontFamily: "var(--sf-font-mono)",
  fontSize: "13px",
  letterSpacing: "0.08em",
  padding: "12px 0",
  marginBottom: "var(--sf-space-8)",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
};

const H1 = {
  margin: "var(--sf-space-12) 0 var(--sf-space-12)",
  color: "var(--sf-text-primary)",
  fontFamily: "var(--sf-font-serif)",
  fontSize: "var(--sf-text-display-sm, 28px)",
  lineHeight: 1.2,
  fontWeight: 400,
};

const LEAD = {
  margin: 0,
  color: "var(--sf-text-cream)",
  fontFamily: "var(--sf-font-sans)",
  fontSize: "var(--sf-text-body-md)",
  lineHeight: "var(--sf-leading-body)",
  fontWeight: 300,
};

const CARD = {
  padding: "var(--sf-space-20) 0 var(--sf-space-24)",
  marginBottom: "var(--sf-space-8)",
  background: "transparent",
  border: "none",
  borderTop: "1px solid var(--sf-accent-line)",
  borderRadius: 0,
};

const H2 = {
  margin: "var(--sf-space-8) 0 var(--sf-space-12)",
  color: "var(--sf-text-primary)",
  fontFamily: "var(--sf-font-serif)",
  fontSize: "22px",
  fontWeight: 460,
  lineHeight: 1.25,
};

const ROW = {
  display: "flex",
  gap: "var(--sf-space-12)",
  flexWrap: "wrap",
};

const ACTION = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "56px",
  padding: "0 var(--sf-space-20)",
  flex: "1 1 auto",
  background: "var(--sf-ground-elev)",
  color: "var(--sf-accent)",
  border: "1px solid var(--sf-accent-line)",
  borderRadius: "2px",
  fontFamily: "var(--sf-font-serif)",
  fontSize: "18px",
  fontWeight: 500,
  letterSpacing: "0.005em",
  textDecoration: "none",
  WebkitTapHighlightColor: "transparent",
};

const NOTE = {
  margin: 0,
  color: "var(--sf-text-quiet)",
  fontFamily: "var(--sf-font-sans)",
  fontSize: "var(--sf-text-body-sm, 14px)",
  lineHeight: "var(--sf-leading-body)",
  fontWeight: 300,
};

const INLINE_LINK = {
  color: "var(--sf-text-cream)",
  textDecorationColor: "var(--sf-border-emphasis)",
  textUnderlineOffset: "3px",
};

const SUMMARY_BTN = {
  background: "transparent",
  border: "none",
  color: "var(--sf-accent)",
  fontFamily: "var(--sf-font-mono)",
  fontSize: "13px",
  letterSpacing: "0.06em",
  padding: "8px 0",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  textAlign: "left",
};

const SCRIM = {
  position: "fixed",
  inset: 0,
  zIndex: 200,
  background: "rgba(0,0,0,0.92)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "var(--sf-space-24)",
  animation: "sfFadeUp 320ms var(--sf-ease-prestige, ease-out) both",
};

const MODAL_CARD = {
  maxWidth: "440px",
  width: "100%",
  maxHeight: "80vh",
  overflowY: "auto",
  padding: "var(--sf-space-32)",
  background: "var(--sf-ground-elev, #111114)",
  border: "0.5px solid var(--sf-border-emphasis, rgba(255,255,255,0.10))",
  boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
  position: "relative",
};

const X_BTN = {
  position: "absolute",
  top: "8px",
  right: "8px",
  width: "44px",
  height: "44px",
  background: "transparent",
  border: "none",
  color: "var(--sf-text-quiet, rgba(255,255,255,0.55))",
  fontSize: "24px",
  lineHeight: 1,
  cursor: "pointer",
  padding: 0,
  WebkitTapHighlightColor: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const LIST = {
  margin: "var(--sf-space-12) 0 0",
  padding: 0,
  listStyle: "none",
};

const LIST_ITEM = {
  margin: "0 0 var(--sf-space-12)",
  color: "var(--sf-text-cream)",
  fontFamily: "var(--sf-font-serif)",
  fontSize: "18px",
  lineHeight: 1.35,
  fontWeight: 400,
};

const COUNT = {
  fontFamily: "var(--sf-font-mono)",
  fontSize: "12px",
  color: "var(--sf-text-faint)",
  letterSpacing: "0.04em",
};

const CLOSE_BTN = {
  background: "transparent",
  border: "0.5px solid var(--sf-border-emphasis, rgba(255,255,255,0.10))",
  color: "var(--sf-accent, #B8862B)",
  fontFamily: "var(--sf-font-mono, monospace)",
  fontSize: "12px",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  padding: "14px 24px",
  minHeight: "44px",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
};
