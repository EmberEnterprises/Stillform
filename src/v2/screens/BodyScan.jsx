import React, { useEffect, useRef, useState } from "react";
import { recordScan } from "../lib/scanLog.js";
import Button from "../components/Button.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import EditorialBlock from "../components/EditorialBlock.jsx";

/**
 * BodyScan — restored from v1 per ARLIN'S CALL (2026-07-08, voice): "restore
 * it, NOT on the home page." Placement: Library → Workshop. Six areas, each
 * with a scan prompt, a firm-pressure anchor point, and a timed hold — the
 * full v1 sequence, refit to the v2 idiom (tokens, serif-300, hairlines).
 *
 * HONEST FRAMING (Science Sheet caution applied): the v1 per-point mechanism
 * claims leaned on TCM framing. The supported mechanism is INTEROCEPTIVE
 * ATTENTION — sustained, precise attention on one body area at a time, with
 * firm pressure as a physical anchor that keeps the attention from sliding.
 * The traditional point names are kept as names (they locate the spot);
 * the claims are about attention, not meridians. This fits the metacognition
 * pivot: the scan is attention training on the body's channel — reading the
 * hardware precisely, area by area.
 *
 * Timed holds respect the stored scan pace (stillform_scan_pace, v1 key kept
 * for continuity: fast 0.5x / standard 1x / slow 1.75x).
 *
 * @param {function(): void} onExit — back to the Workshop
 */

const AREAS = [
  {
    name: "Jaw & Face",
    prompt: "Unclench your jaw. Let your tongue rest. Soften your eyes.",
    pointName: "GV24.5 \u2014 Third Eye Point",
    pointLocation: "Place two fingers between your eyebrows, just above the bridge of your nose.",
    pointInstruction: "Apply firm, steady pressure. Close your eyes. Hold.",
    holdObservation: "Notice if the pressure creates a release or more resistance. Either is information.",
    holdSeconds: 60,
  },
  {
    name: "Shoulders & Neck",
    prompt: "Notice if your shoulders are raised. Let them drop completely.",
    pointName: "GB21 \u2014 Shoulder Well",
    pointLocation: "Find the highest point of your shoulder muscle, halfway between your neck and the edge of your shoulder.",
    pointInstruction: "Press firmly with your thumb or two fingers. You may feel a tender ache \u2014 that's the right spot. Hold.",
    holdObservation: "Feel the weight of your arms. Notice if your neck wants to follow and soften.",
    holdSeconds: 45,
  },
  {
    name: "Chest & Breath",
    prompt: "Is your breath shallow? Take one slow, full breath down to your belly.",
    pointName: "CV17 \u2014 Center of the Breastbone",
    pointLocation: "Find the center of your breastbone, level with your heart. Place your flat palm here.",
    pointInstruction: "Apply firm, steady pressure with your palm. Breathe into it. Hold.",
    holdObservation: "Notice your breath without directing it. Is it expanding into the pressure or pulling away?",
    holdSeconds: 60,
  },
  {
    name: "Hands & Arms",
    prompt: "Are your hands gripping anything? Open them fully. Let your arms go heavy.",
    pointName: "LI4 \u2014 Union Valley",
    pointLocation: "Find the webbing between your thumb and index finger. Pinch the highest point of the muscle there.",
    pointInstruction: "Squeeze firmly \u2014 this point is often tender. Switch hands halfway. Hold.",
    holdObservation: "Notice if the tenderness shifts or spreads. Stay with it.",
    holdSeconds: 45,
  },
  {
    name: "Gut & Core",
    prompt: "Scan your stomach and core. Notice tightness without trying to fix it.",
    pointName: "PC6 \u2014 Inner Wrist",
    pointLocation: "Turn your wrist palm-up. Measure three finger-widths down from your wrist crease, between the two tendons.",
    pointInstruction: "Press firmly with your thumb. Switch wrists halfway. Hold.",
    holdObservation: "Notice what your gut is doing \u2014 gripping, fluttering, or still. You don't need to interpret it yet.",
    holdSeconds: 60,
  },
  {
    name: "Legs & Feet",
    prompt: "Feel the full weight of your legs. Press your feet flat into the floor.",
    pointName: "ST36 \u2014 Below the Knee",
    pointLocation: "Find the outer edge of your kneecap, then measure four finger-widths straight down your shin.",
    pointInstruction: "Press firmly into the muscle beside the bone. Switch legs halfway. Hold.",
    holdObservation: "Feel the floor beneath you. Notice if the weight of your body starts to settle.",
    holdSeconds: 60,
  },
];

function paceMultiplier() {
  try {
    const p = localStorage.getItem("stillform_scan_pace") || "standard";
    return p === "fast" ? 0.5 : p === "slow" ? 1.75 : 1;
  } catch {
    return 1;
  }
}

export default function BodyScan({ onExit }) {
  const [phase, setPhase] = useState("intro"); // intro | area | hold | done
  const [idx, setIdx] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [leftEarly, setLeftEarly] = useState(false); // J4: partial-credit path
  const timerRef = useRef(null);

  const mult = useRef(paceMultiplier());
  const area = AREAS[idx];
  const holdFor = Math.max(10, Math.round(area.holdSeconds * mult.current));

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startHold = () => {
    setRemaining(holdFor);
    setPhase("hold");
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(timerRef.current);
          // advance on the next tick so the 0 renders once
          setTimeout(() => {
            if (idx + 1 < AREAS.length) {
              setIdx((i) => i + 1);
              setPhase("area");
            } else {
              try { recordScan({ areasRead: AREAS.length, totalAreas: AREAS.length }); } catch { /* fail-silent */ }
              setPhase("done");
            }
          }, 400);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  };

  // J4: leave the scan early but keep the credit — the areas read still count.
  const leaveWithCredit = () => {
    clearInterval(timerRef.current);
    try { recordScan({ areasRead: idx + 1, totalAreas: AREAS.length }); } catch { /* fail-silent */ }
    setLeftEarly(true);
    setPhase("done");
  };

  const skipArea = () => {
    clearInterval(timerRef.current);
    if (idx + 1 < AREAS.length) {
      setIdx((i) => i + 1);
      setPhase("area");
    } else {
      setPhase("done");
    }
  };

  /* ── INTRO ── */
  if (phase === "intro") {
    return (
      <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
        <article className="sf-fade-enter" style={{ maxWidth: 560 }}>
          <button type="button" onClick={leaveWithCredit} aria-label="Finish here with credit" style={BACK}>\u2190 finish here</button>
          <EditorialBlock
            label="Body Scan"
            headline="Read the hardware, area by area"
            headlineSize="md"
            body="Six areas, one at a time. Each gets your full attention, a firm-pressure anchor to hold it there, and a timed hold. Nothing to fix \u2014 the practice is precise attention on what the body is actually doing."
            rule
          />
          <p style={NORM}>
            About {Math.round(AREAS.reduce((a, x) => a + x.holdSeconds, 0) * mult.current / 60)} minutes at your pace.
            The pressure is an anchor for the attention \u2014 firm, never painful.
          </p>
          <Button variant="primary" onClick={() => setPhase("area")}>Begin the scan</Button>
        </article>
      </main>
    );
  }

  /* ── DONE ── */
  if (phase === "done") {
    return (
      <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
        <article className="sf-fade-enter" style={{ maxWidth: 560 }}>
          <MonoLabel size="xs" tone="faint">Scan complete</MonoLabel>
          {/* J4 (2026-07-14): partial credit — the count is honest, and any
              amount is a real scan. No all-or-nothing in a self-mastery app. */}
          <p style={Q}>{
            leftEarly
              ? `${idx + 1} ${idx === 0 ? "area" : "areas"}, read. That's a real scan \u2014 you checked in with your body and that counts. Whatever you found is the day's actual state \u2014 now you're working from`
              : "Six areas, read. Whatever you found is the day's actual state \u2014 now you're working from"
          } the real reading, not a guess.</p>
          <Button variant="primary" onClick={onExit}>Done</Button>
        </article>
      </main>
    );
  }

  /* ── AREA / HOLD ── */
  return (
    <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)" }}>
      <article className="sf-fade-enter" key={`${idx}-${phase}`} style={{ maxWidth: 560 }}>
        <MonoLabel size="xs" tone="faint">{`${idx + 1} of ${AREAS.length} \u00b7 ${area.name}`}</MonoLabel>
        {phase === "area" ? (
          <>
            <p style={Q}>{area.prompt}</p>
            <p style={POINT}>{area.pointName}</p>
            <p style={NORM}>{area.pointLocation}</p>
            <p style={NORM}>{area.pointInstruction}</p>
            <div style={{ display: "flex", gap: "var(--sf-space-12)", alignItems: "center" }}>
              <Button variant="primary" onClick={startHold}>{`Hold \u00b7 ${holdFor}s`}</Button>
              <button type="button" className="sf-link-quiet" onClick={skipArea}>skip this area</button>
            </div>
          </>
        ) : (
          <>
            <p style={COUNT} aria-live="polite">{remaining}</p>
            <p style={Q}>{area.holdObservation}</p>
            <button type="button" className="sf-link-quiet" onClick={skipArea}>enough \u2014 next area</button>
          </>
        )}
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
const POINT = {
  fontFamily: "var(--sf-font-mono)", fontSize: "11px", letterSpacing: "0.14em",
  textTransform: "uppercase", color: "var(--sf-accent)", margin: "var(--sf-space-16) 0 var(--sf-space-8)",
};
const NORM = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "15px",
  lineHeight: 1.65, color: "var(--sf-text-secondary)", margin: "0 0 var(--sf-space-12)",
};
const COUNT = {
  fontFamily: "var(--sf-font-serif)", fontWeight: 300, fontSize: "var(--sf-text-display-md)",
  color: "var(--sf-text-cream)", margin: "var(--sf-space-16) 0",
};
