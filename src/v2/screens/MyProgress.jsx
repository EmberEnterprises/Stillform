import React from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import GrowthArbor from "../components/GrowthArbor.jsx";
import { getBiasProfile, patternConfidence } from "../lib/biasProfile.js";
import MediationQueue from "../components/MediationQueue.jsx";
import { getPendingProposals } from "../lib/mediationApi.js";
import { getNamingGrowth } from "../lib/namingGrowth.js";
import DiscoveryFindingCard from "../components/DiscoveryFindingCard.jsx";
import { getPendingCandidate } from "../lib/vulnerabilities.js";
import { getPendingCandidate as getPendingMove } from "../lib/protectiveMoves.js";
import { getPendingCandidate as getPendingStrength } from "../lib/strengths.js";
import { getPendingCandidate as getPendingValue } from "../lib/values.js";
import { getObserverSeatCount } from "../lib/observerSeat.js";
import { getOtherReadEffect } from "../lib/beliefRating.js";

/**
 * MyProgress — landing surface for the diagnostic stack + practice
 * surfaces under the home's "Progress" link.
 *
 * Phase 5 sub-item #2 (locked May 17, 2026): minimal landing. Lists
 * currently-available editors only (no placeholder slots for non-
 * functional items per canon "no broken affordances"). Future
 * editors plug in by adding their own entries here.
 *
 * Currently lists:
 *   - Context Profile
 *
 * Future entries (each gated by their own sub-item shipping):
 *   - Trigger Profile
 *   - Bias Profile
 *   - Signal Profile
 *   - Bio-filter
 *   - Library
 *   - Roadmap / Mirror Strip / Signal Log / Pattern Disruption
 *
 * Routing: AppV2 passes onExit (back to home) and onNavigate (target
 * editor id, AppV2 maps id → screen state) handlers. The landing
 * itself doesn't know what screens exist — it just emits navigation
 * intents.
 *
 * @param {function(): void} onExit — back to home
 * @param {function(string): void} onNavigate — navigate to target editor
 */
export default function MyProgress({ onExit, onNavigate }) {
  const handleNavigate = (target) => {
    if (typeof onNavigate === "function") onNavigate(target);
  };
  const pendingVuln = getPendingCandidate();
  const pendingMove = getPendingMove();
  const pendingStrength = getPendingStrength();
  const pendingValue = getPendingValue();
  const observerSeatCount = getObserverSeatCount();

  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <div className="sf-home-aura" aria-hidden="true" />
      <div className="sf-home-grain" aria-hidden="true" />
      {/* Top back affordance — mono-faint, top left. Matches the
          ContextProfile back-button treatment for consistency
          across the My Progress sub-tree. */}
      <button
        type="button"
        onClick={onExit}
        aria-label="Back to home"
        style={{
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
        }}
      >
        ← back
      </button>

      <EditorialBlock
        label="Progress"
        headline="My Progress"
        headlineSize="md"
        body={
          <>
            Where what you've named lives. Edit your profile, review what you've observed, see your patterns over time.
          </>
        }
        rule
      />

      {/* Keystone Step 2: the discovery confirm surface. Self-gating (renders
          nothing until the engine is ready + a candidate is undecided), so it
          leads only when there's something real to confirm. */}
      <DiscoveryFindingCard />

      {/* D4: growth surfaces carry the specimen. */}
      <div style={{ margin: "var(--sf-space-16) 0 var(--sf-space-8)" }}>
        <GrowthArbor />
      </div>

      {/* Phase 6.4c: post-event reflection — a manual ACTION (launch a
          post-event session), set apart from the diagnostic mirrors below
          so it reads as "do this now," not "view this." Off-home per canon;
          the one deliberate manual beat. Routes via AppV2's forcedBeat. */}
      <section className="sf-sec" style={{ marginBottom: "var(--sf-space-32)" }}>
        <div className="sf-sec-head">
          <span className="sf-sec-head-lbl">Prepare &amp; review</span>
          <div className="sf-sec-rule" />
        </div>
        <ProgressEntry
          title="Prep for something coming up"
          description="A meeting, a call, a room you're about to walk into. A brief to carry in — what to hold, what to watch, how to land after."
          glyph="↗"
          onTap={() => handleNavigate("pre-event-brief")}
        />
        <ProgressEntry
          title="Break down something that just happened"
          description="A meeting, a call, a moment — while it's fresh. What worked, what didn't, what to keep for next time."
          glyph="↺"
          onTap={() => handleNavigate("post-event")}
        />
      </section>

      {/* Other-read effect (2026-07-01, gap-close): a quiet, correlational
          evidence line — belief change on thoughts where the user took the
          "other read" vs where they didn't. Self-gating: null until BOTH
          groups exist, so it never shows a lopsided or empty number. Framed as
          observation, not proof. First-pass copy — Arlin's voice to set. */}
      {(() => {
        let eff = null;
        try { eff = getOtherReadEffect(); } catch { eff = null; }
        if (!eff) return null;
        const pts = (v) => `${v > 0 ? "+" : ""}${v} pt${Math.abs(v) === 1 ? "" : "s"}`;
        return (
          <div style={{ margin: "var(--sf-space-8) 0 var(--sf-space-24)" }}>
            <MonoLabel size="xs" tone="faint">
              Other read &middot; belief changed {pts(eff.withOtherRead.avgDelta)} on average
              where you took it, {pts(eff.withoutOtherRead.avgDelta)} where you didn&rsquo;t.
              What you&rsquo;ve noticed, not proof.
            </MonoLabel>
          </div>
        );
      })()}

      {/* 5.12 L4 — one quiet line when >=1 watched pattern has retired
          ("gone quiet"). Derived live; reflect-not-score; renders nothing
          otherwise (honest absence — spec v1.0 §5). */}
      {(() => {
        let retiredCount = 0;
        try {
          retiredCount = getBiasProfile().watchList.filter(
            (e) => patternConfidence({ encounterCount: e.encounterCount, lastSeen: e.lastSeen }).tier === "retired"
          ).length;
        } catch { retiredCount = 0; }
        if (retiredCount < 1) return null;
        return (
          <div
            style={{
              fontFamily: "var(--sf-font-serif)",
              fontStyle: "italic",
              fontSize: "15px",
              lineHeight: 1.5,
              color: "var(--sf-text-secondary)",
              marginBottom: "var(--sf-space-24)",
            }}
          >
            {retiredCount === 1
              ? "1 pattern has gone quiet since you started watching it."
              : `${retiredCount} patterns have gone quiet since you started watching them.`}
          </div>
        );
      })()}

      {(() => {
        // Language sharpening over time — shown inline (the user's own early
        // vs recent words ARE the proof; it lands better seen than buried
        // behind a tap). Honest: only renders a "growth" read when the shift
        // is real; otherwise says so plainly. Never a fabricated metric.
        let g;
        try { g = getNamingGrowth(); } catch { g = null; }
        if (!g || !g.ready) return null;
        return (
          <section className="sf-sec" style={{ marginBottom: "var(--sf-space-8)" }}>
            <div className="sf-sec-head">
              <span className="sf-sec-head-lbl">Your naming, over time</span>
              <div className="sf-sec-rule" />
            </div>
            {g.hasGrowth && g.earlyExample && g.recentExample ? (
              <div style={{ marginBottom: "var(--sf-space-16)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sf-space-12)" }}>
                  <div>
                    <MonoLabel size="xs" tone="faint">EARLY ON</MonoLabel>
                    <p style={{ margin: "var(--sf-space-4) 0 0", fontFamily: "var(--sf-font-serif)", fontSize: "20px", lineHeight: 1.3, color: "var(--sf-text-faint)", fontStyle: "italic" }}>
                      &ldquo;{g.earlyExample}&rdquo;
                    </p>
                  </div>
                  <div>
                    <MonoLabel size="xs" tone="faint">LATELY</MonoLabel>
                    <p style={{ margin: "var(--sf-space-4) 0 0", fontFamily: "var(--sf-font-serif)", fontSize: "20px", lineHeight: 1.3, color: "var(--sf-text-cream)" }}>
                      &ldquo;{g.recentExample}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            <p style={{ margin: 0, fontFamily: "var(--sf-font-sans)", fontSize: "var(--sf-text-body-sm, 14px)", lineHeight: "var(--sf-leading-body)", color: "var(--sf-text-quiet)", fontWeight: 300 }}>
              {g.headline}
            </p>
          </section>
        );
      })()}

      <section className="sf-sec">
        <div className="sf-sec-head">
          <span className="sf-sec-head-lbl">Your diagnostic stack</span>
          <div className="sf-sec-rule" />
        </div>

        <ProgressEntry
          mark="01"
          title="Context Profile"
          description="Ambient conditions you've noticed correlate with how you feel — weather, hydration, the kind of conversation you just left."
          onTap={() => handleNavigate("context-profile")}
        />

        <ProgressEntry
          mark="02"
          title="Trigger Profile"
          description="External situations you've named as consistently hitting hard — performance reviews, hard conversations, certain people."
          onTap={() => handleNavigate("trigger-profile")}
        />

        <ProgressEntry
          mark="03"
          title="Bias Profile"
          description="Recurring shapes your thinking takes — the patterns you've put on a watch list for the Reframe AI to notice and help loosen over time."
          onTap={() => handleNavigate("bias-profile")}
        />

        <ProgressEntry
          mark="04"
          title="Where your triggers concentrate"
          description="The layer above your triggers — where the load pools across everything you've named, and which ones actually carry the weight. A map of where the reps pay off."
          onTap={() => handleNavigate("trigger-meta")}
        />

        <ProgressEntry
          mark="05"
          title="Your Vulnerabilities"
          description={pendingVuln
            ? "Reframe noticed something — a charged part of you, with both its edges, waiting for you to look at."
            : "The charged parts of how you're built — each shown with both its edges: where it tips you, and where it serves you. Named by you, or surfaced by Reframe from your own words for you to confirm."}
          onTap={() => handleNavigate("vulnerabilities")}
        />

        <ProgressEntry
          mark="06"
          title="Your protective moves"
          description={pendingMove
            ? "Reframe noticed something — a move you make under pressure, with both its edges, waiting for you to look at."
            : "The moves you make under pressure — each shown with both its edges: where it protected you, and where it costs you now. Named by you, or surfaced by Reframe from your own words for you to confirm."}
          onTap={() => handleNavigate("protective-moves")}
        />

        <ProgressEntry
          mark="07"
          title="Your window"
          description="The zone where you can think clearly — and which way you tip when you're pushed past it (too revved, or too shut-down), with the correction that matches. Plus your earliest signal: where you catch it first."
          onTap={() => handleNavigate("window")}
        />

        <ProgressEntry
          mark="08"
          title="Body, or the story?"
          description="When a feeling lands hard, a body running low — depleted, no sleep, in pain, a hormonal shift — colors the read. Check the body before you trust the story; see the moments it had a hand in."
          onTap={() => handleNavigate("body-vs-story")}
        />

        <ProgressEntry
          mark="09"
          title="What's strong in you"
          description={pendingStrength
            ? "Reframe noticed a strength of yours — where it shows, and a way to lean on it — waiting for you to confirm."
            : "The bright pole — what you're genuinely good at, where it already shows, and one way to lean on it on purpose. Named by you, or surfaced by Reframe from your own words."}
          onTap={() => handleNavigate("strengths")}
        />

        <ProgressEntry
          mark="10"
          title="What you're moving toward"
          description={pendingValue
            ? "Reframe heard a direction in your words — what it looks like, and a step — waiting for you to confirm."
            : "The compass — a direction you choose to move toward, what living it looks like, and one step. Named by you, or surfaced by Reframe from your own words. The choosing stays yours."}
          onTap={() => handleNavigate("values")}
        />

        <ProgressEntry
          mark="11"
          title="Reframing, or holding it in?"
          description="Two ways to handle a hard feeling — reframe it, or hold it in and carry it. See which way you lean, and turn the holding into the cue to reframe."
          onTap={() => handleNavigate("reframe-vs-hold")}
        />

        <ProgressEntry
          mark="12"
          title="The observer seat"
          description={observerSeatCount > 0
            ? `Taken ${observerSeatCount} ${observerSeatCount === 1 ? "time" : "times"}. Step out of a thought and watch it instead of being run by it — the words don't change, your distance from them does.`
            : "Step out of a thought and watch it instead of being run by it. The words don't change — your distance from them does, and that gap is where the choice lives."}
          onTap={() => handleNavigate("observer-seat")}
        />

        <ProgressEntry
          mark="13"
          title="Growth mirror"
          description="The four capacities Stillform trains — Sense, Settle, Seeing yourself, Seeing others — reflected back as you do the work."
          onTap={() => handleNavigate("capacities-mirror")}
        />

        <ProgressEntry
          mark="14"
          title="Where You Lean"
          description="Where you take risk and where you hold back, across the parts of a life — a value-neutral picture of your shape, nothing to fix."
          onTap={() => handleNavigate("risk-profile")}
        />

        <ProgressEntry
          mark="15"
          title="What Didn't Come True"
          description="What you were sure would go wrong that didn't — the disconfirmations your mind otherwise forgets to count."
          onTap={() => handleNavigate("prediction-mirror")}
        />

        <ProgressEntry
          mark="16"
          title="What You Bet On"
          description="What you were sure of, next to what actually happened. The gap is the data."
          onTap={() => handleNavigate("what-you-bet-on")}
        />

        <ProgressEntry
          mark="17"
          title="Thought Record"
          description="Take one thought, rate how much you believe it, look at the evidence, then re-rate. The drop is the work."
          onTap={() => handleNavigate("thought-record")}
        />

        <ProgressEntry
          mark="18"
          title="Your Arc"
          description="The through-line of your practice — your own named moments, in order, with the patterns that recur and the predictions that didn't come true."
          onTap={() => handleNavigate("narrative-arc")}
        />

        <ProgressEntry
          mark="19"
          title="Practice Evidence"
          description="Short exercises on the functions the practice trains — measured over time, against your own past, as honest evidence it's working."
          onTap={() => handleNavigate("practice-evidence")}
        />

        <ProgressEntry
          mark="20"
          title="How this works"
          description="The model you're working inside — why naming sharpens you, why the reps compound, and why working a live trigger rewrites it instead of papering over it. The map you stand on."
          onTap={() => handleNavigate("the-model")}
        />
      </section>

      {/* Concierge — proposed updates (Arlin June 2: queue lives here AND
          behind the Mirror tap). Renders only when something is genuinely
          pending — honest absence otherwise, no empty placeholder. */}
      {getPendingProposals().length > 0 ? (
        <section style={{ marginTop: "var(--sf-space-32)" }} aria-label="Proposed updates">
          <MediationQueue inline />
        </section>
      ) : null}
    </main>
  );
}

/**
 * ProgressEntry — single tappable row. Serif title + sans body + a brass
 * anchor (mark = index numeral for a catalog item, glyph = an action) +
 * brass arrow. Full row is the tap target. Shares the home .sf-sec system.
 */
function ProgressEntry({ title, description, onTap, mark, glyph }) {
  return (
    <button type="button" onClick={onTap} aria-label={title} className="sf-sec-row">
      {glyph ? (
        <span className="sf-sec-glyph" aria-hidden="true">{glyph}</span>
      ) : mark ? (
        <span className="sf-sec-mark" aria-hidden="true">{mark}</span>
      ) : null}
      <span className="sf-sec-row-main">
        <span className="sf-sec-row-top">
          <span className="sf-sec-name">{title}</span>
        </span>
        {description ? <span className="sf-sec-sub">{description}</span> : null}
      </span>
      <span aria-hidden="true" className="sf-sec-arrow">→</span>
    </button>
  );
}
