import React from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import { getSignalLog } from "../lib/signalLog.js";

/**
 * NamingLedger — the user's own record of naming, shown back (cohesion audit
 * 0a, 2026-07-02: the app's most frequent act had no surface). A quiet ledger:
 * their named states, their words, grouped by day, newest first. Nothing
 * derived, nothing judged — the raw record, theirs. Honest-empty when new.
 */
export default function NamingLedger({ onExit }) {
  let entries = [];
  try { entries = getSignalLog().entries || []; } catch { entries = []; }
  const byDay = new Map();
  [...entries].reverse().forEach((e) => {
    if (!e || !e.dateKey) return;
    if (!byDay.has(e.dateKey)) byDay.set(e.dateKey, []);
    byDay.get(e.dateKey).push(e);
  });

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={BACK}>
        ← back
      </button>
      <EditorialBlock
        label="My Progress"
        headline="Your naming, day by day"
        headlineSize="md"
        body="Every state you've named, in your words, exactly as you said it. This is the raw record the rest of the practice is built from — kept on your device, shown to no one."
        rule
      />
      {byDay.size === 0 ? (
        <p style={LINE}>Nothing named yet. The ledger writes itself as you practice.</p>
      ) : (
        <div style={{ marginTop: "var(--sf-space-24)" }}>
          {[...byDay.entries()].map(([day, list]) => (
            <section key={day} style={{ marginBottom: "var(--sf-space-24)" }}>
              <MonoLabel size="xs" tone="faint">{day}</MonoLabel>
              {list.map((e) => (
                <p key={e.id} style={LINE}>
                  {e.chip ? e.chip : null}
                  {e.body && e.body.length ? `${e.chip ? " · " : ""}${Array.isArray(e.body) ? e.body.join(", ") : e.body}` : null}
                  {e.triggers && e.triggers.length ? ` · ${Array.isArray(e.triggers) ? e.triggers.join(", ") : e.triggers}` : null}
                </p>
              ))}
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

const BACK = {
  background: "transparent", border: "none", color: "var(--sf-text-faint)",
  fontFamily: "var(--sf-font-mono)", fontSize: "11px", letterSpacing: "0.14em",
  textTransform: "uppercase", cursor: "pointer", padding: "8px 0",
  marginBottom: "var(--sf-space-24)", WebkitTapHighlightColor: "transparent",
};
const LINE = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "15px",
  lineHeight: 1.7, color: "var(--sf-text-secondary)", margin: "var(--sf-space-8) 0 0",
};
