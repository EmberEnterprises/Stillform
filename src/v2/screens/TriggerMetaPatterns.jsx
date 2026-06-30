import React, { useMemo, useEffect } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import { getTriggerMeta } from "../lib/triggerMeta.js";

/**
 * TriggerMetaPatterns — the meta-pattern read over the Trigger Profile (layer 9).
 *
 * The Trigger Profile names what sets you off. This is the layer above it: across
 * everything you've named, where the load CONCENTRATES (cross-category cluster)
 * and which triggers actually CARRY THE WEIGHT (encounter frequency). The data
 * already exists — the user names the triggers, Reframe tags encounters as they
 * fire — so this is a deterministic READ, never an invented pattern. Seeing your
 * own pattern is what puts a step between you and it (Kross & Ayduk 2011; Science
 * Sheet; Library "trigger-meta-patterns").
 *
 * Ends in a direction, not a mirror: the cluster tells you where to aim, the
 * load-bearing few tell you where to start (rumination guard — the read points
 * at work). Honest-empty: under a few triggers there's no pattern to read yet.
 *
 * Copy here is FIRST-PASS DRAFT; Arlin's voice to set.
 *
 * @param {function(): void} onExit — back to My Progress
 */
export default function TriggerMetaPatterns({ onExit }) {
  const meta = useMemo(() => getTriggerMeta(), []);

  useEffect(() => {
    if (meta) { try { window.plausible?.("Trigger Patterns Viewed"); } catch {} }
  }, [meta]);

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <button type="button" onClick={onExit} aria-label="Back to My Progress" style={backStyle}>
        ← back
      </button>

      <EditorialBlock
        label="My Progress"
        headline="Where your triggers concentrate"
        headlineSize="md"
        body="Knowing what sets you off is the first layer. This is the next one: across everything you've named, where the load pools — and which triggers actually carry the weight. It rarely spreads evenly. It tends to gather in one or two areas, and a few triggers do most of the firing. That's not a fault to fix — it's a map. It tells you where the reps pay off."
        rule
      />

      {!meta ? (
        <section style={{ ...cardStyle, marginTop: "var(--sf-space-24)" }}>
          <p style={bodyQuiet}>
            There aren't enough named triggers yet to read a pattern across them. Open your Trigger Profile
            and name a few more of the things that set you off — once there are a few, where they concentrate
            and which ones carry the weight will show up here.
          </p>
        </section>
      ) : (
        <>
          {/* The cluster: where the load pools */}
          <section style={{ ...cardStyle, marginTop: "var(--sf-space-24)" }}>
            <MonoLabel size="xs" tone="faint" style={blockLabel}>Where it pools</MonoLabel>
            {meta.dominant ? (
              <p style={readLine}>
                Most of your load lives in <em style={em}>{meta.dominant.label}</em> — {meta.dominant.count} of
                your {meta.total} triggers.
              </p>
            ) : (
              <p style={readLine}>
                Your triggers are spread out — no single area carries them. That's its own information: the
                work here is range, not one hot spot.
              </p>
            )}
            {meta.clusters.length > 1 && (
              <div style={listWrap}>
                {meta.clusters.map((c) => (
                  <div key={c.category} style={listRow}>
                    <span style={listLabel}>{c.label}</span>
                    <span style={listCount}>{c.count}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* The frequency: which ones carry the weight */}
          <section style={{ ...cardStyle, marginTop: "var(--sf-space-16)" }}>
            <MonoLabel size="xs" tone="faint" style={blockLabel}>What carries the weight</MonoLabel>
            {meta.untagged ? (
              <p style={bodyQuiet}>
                You've named these, but they haven't been logged firing yet. As they come up in real life
                and you work them, the ones that show up most will surface here as the load-bearing few.
              </p>
            ) : (
              <>
                <p style={readLine}>The ones that actually fire most:</p>
                <div style={listWrap}>
                  {meta.loadBearing.map((t) => (
                    <div key={t.label} style={listRow}>
                      <span style={listLabel}>{t.label}</span>
                      <span style={listCount}>
                        {t.encounterCount}×
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* The direction: where to aim */}
          <p style={closeLine}>
            {meta.dominant && meta.loadBearing.length
              ? `Aim the work where it pools — ${meta.dominant.label} — and start with the one that fires most. That's where reps move the needle.`
              : meta.dominant
              ? `Aim the work where it pools — ${meta.dominant.label}. As these start getting tagged when they fire, you'll see which one to start with.`
              : meta.loadBearing.length
              ? `Your load is spread, so range is the work — but start with the one that fires most. That's where reps move the needle first.`
              : `Your load is spread, so range is the work. As these get tagged when they fire, the place to start will surface.`}
          </p>
        </>
      )}
    </main>
  );
}

const backStyle = {
  background: "transparent", border: "none", color: "var(--sf-text-faint)",
  fontFamily: "var(--sf-font-mono)", fontSize: "11px", letterSpacing: "0.14em",
  textTransform: "uppercase", cursor: "pointer", padding: "8px 0",
  marginBottom: "var(--sf-space-24)", WebkitTapHighlightColor: "transparent",
};
const cardStyle = {
  marginTop: "var(--sf-space-16)", padding: "var(--sf-space-24)",
  border: "0.5px solid var(--sf-border-quiet)", borderRadius: "var(--sf-r-default)",
  background: "transparent",
};
const blockLabel = { display: "block", marginBottom: "var(--sf-space-16)" };
const readLine = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "19px",
  lineHeight: 1.35, color: "var(--sf-text-primary)", margin: 0,
};
const em = { fontStyle: "italic", color: "var(--sf-accent)" };
const listWrap = { marginTop: "var(--sf-space-16)", display: "flex", flexDirection: "column", gap: "2px" };
const listRow = {
  display: "flex", justifyContent: "space-between", alignItems: "baseline",
  padding: "8px 0", borderBottom: "0.5px solid var(--sf-border-hairline)",
};
const listLabel = {
  fontFamily: "var(--sf-font-serif)", fontSize: "16px", color: "var(--sf-text-primary)",
};
const listCount = {
  fontFamily: "var(--sf-font-mono)", fontSize: "12px", letterSpacing: "0.04em",
  color: "var(--sf-text-faint)",
};
const closeLine = {
  fontFamily: "var(--sf-font-serif)", fontSize: "15px", lineHeight: 1.6,
  color: "var(--sf-text-quiet)", margin: "var(--sf-space-24) 0 0",
};
const bodyQuiet = {
  fontFamily: "var(--sf-font-serif)", fontSize: "15px", lineHeight: 1.6,
  color: "var(--sf-text-quiet)", margin: 0,
};
