import React, { useState, useEffect } from "react";
import BreathAnywhere from "./components/BreathAnywhere.jsx";
import PinGate from "./components/PinGate.jsx";
import { shouldLock, markBackgrounded, hasPin } from "./lib/pinLock.js";
import "./tokens.css";
import "./components.css";
import { applyA11y } from "./lib/a11y.js";
import { runVersionGatedBackup, maybeOpportunisticBackup } from "./lib/backupAuto.js";
import { maybeRefreshWeather } from "./lib/weatherProducer.js";
import { maybeSeedDemo } from "./lib/demoSeed.js";

// Display accessibility (contrast / text size) — apply persisted settings
// before the tree paints. Module-level call is safe: reads localStorage,
// sets <html> data attributes only.
applyA11y();
import Home from "./screens/Home.jsx";
import AppHeader from "./components/AppHeader.jsx";
import Spine from "./screens/Spine.jsx";
import FoundationVerify from "./screens/FoundationVerify.jsx";
import StateCheck from "./screens/spine/StateCheck.jsx"; // debug route ?statecheck=1 (orphan draft, M3 increment 2a)
const MyProgress = React.lazy(() => import("./screens/MyProgress.jsx"));
const ContextProfile = React.lazy(() => import("./screens/ContextProfile.jsx"));
const TriggerProfile = React.lazy(() => import("./screens/TriggerProfile.jsx"));
const BiasProfile = React.lazy(() => import("./screens/BiasProfile.jsx"));
const CapacitiesMirror = React.lazy(() => import("./screens/CapacitiesMirror.jsx"));
const SeasonReview = React.lazy(() => import("./screens/SeasonReview.jsx"));
const NamingLedger = React.lazy(() => import("./screens/NamingLedger.jsx"));
const RiskProfileMirror = React.lazy(() => import("./screens/RiskProfileMirror.jsx"));
const PredictionErrorMirror = React.lazy(() => import("./screens/PredictionErrorMirror.jsx"));
const WhatYouBetOnMirror = React.lazy(() => import("./screens/WhatYouBetOnMirror.jsx"));
const Vulnerabilities = React.lazy(() => import("./screens/Vulnerabilities.jsx"));
const ProtectiveMoves = React.lazy(() => import("./screens/ProtectiveMoves.jsx"));
const BodyVsStory = React.lazy(() => import("./screens/BodyVsStory.jsx"));
const ReframeVsHold = React.lazy(() => import("./screens/ReframeVsHold.jsx"));
const ObserverSeat = React.lazy(() => import("./screens/ObserverSeat.jsx"));
const TriggerMetaPatterns = React.lazy(() => import("./screens/TriggerMetaPatterns.jsx"));
const FrameworkModel = React.lazy(() => import("./screens/FrameworkModel.jsx"));
const Strengths = React.lazy(() => import("./screens/Strengths.jsx"));
const Values = React.lazy(() => import("./screens/Values.jsx"));
const WindowRead = React.lazy(() => import("./screens/WindowRead.jsx"));
const ThoughtRecord = React.lazy(() => import("./screens/ThoughtRecord.jsx"));
const NarrativeArc = React.lazy(() => import("./screens/NarrativeArc.jsx"));
const PracticeEvidence = React.lazy(() => import("./screens/PracticeEvidence.jsx"));
const Library = React.lazy(() => import("./screens/Library.jsx"));
const PreEventBrief = React.lazy(() => import("./screens/PreEventBrief.jsx"));
const ReRead = React.lazy(() => import("./screens/ReRead.jsx"));
const Becoming = React.lazy(() => import("./screens/Becoming.jsx"));
const Concierge = React.lazy(() => import("./screens/Concierge.jsx"));
const Paywall = React.lazy(() => import("./screens/Paywall.jsx"));
import Onboarding from "./screens/Onboarding.jsx";
const Settings = React.lazy(() => import("./screens/Settings.jsx"));
const FAQ = React.lazy(() => import("./screens/FAQ.jsx"));
import CrisisResources from "./screens/CrisisResources.jsx";
const Roadmap = React.lazy(() => import("./screens/Roadmap.jsx"));
import { isOnboarded, setOnboarded } from "./lib/onboarding.js";
import { shouldGate } from "./lib/gating.js";
import { refreshSubscriptionStatus } from "./lib/subscriptionApi.js";

/**
 * AppV2 — root of the v2 frontend. State-machine routing (no URL hash).
 *
 * GLOBAL CHROME (June 23 2026, Arlin): every non-home surface renders a single
 * AppHeader — the Stillform wordmark as a HOME link + a quiet Sign in. The home
 * surface keeps its own AppHeader (so its composition is untouched); the spine,
 * onboarding, and verify run headerless (immersive / first-run / audit). Each
 * screen keeps its own in-content back (→ correct parent); the header adds home
 * + sign-in, not a second back.
 *
 * Anchor: STILLFORM_CANON.md §architecture / §10 (header note updated June 23).
 */
function readShareText() {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("share");
    if (!raw) return null;
    const t = String(raw).trim().slice(0, 500);
    return t.length >= 2 ? t : null;
  } catch {
    return null;
  }
}
const INITIAL_SHARE_TEXT = readShareText();
if (INITIAL_SHARE_TEXT) {
  try { window.history.replaceState({}, "", window.location.pathname); } catch { /* non-fatal */ }
}

function pickInitialScreen() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verify") === "1") return "verify";
    if (params.get("statecheck") === "1") return "statecheck";
    if (params.get("paywall") === "1") return "paywall";
    if (params.get("onboard") === "1") return "onboarding";
    if (INITIAL_SHARE_TEXT && isOnboarded()) return shouldGate() ? "paywall" : "spine";
  } catch {
    /* noop */
  }
  if (!isOnboarded()) return "onboarding";
  return "home";
}

// Surfaces that render WITHOUT the global header: home (own AppHeader),
// onboarding (first-run flow), verify (audit), spine (immersive practice with
// its own ← home back).
const HEADERLESS = new Set(["home", "onboarding", "verify", "spine", "statecheck"]);

export default function AppV2() {
  const [screen, setScreen] = useState(pickInitialScreen);
  // W8 web tier (2026-07-12): the app-level lock. Arms at cold start when a
  // PIN exists; re-arms when the app leaves the screen for >60s.
  const [locked, setLocked] = useState(() => shouldLock());
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "hidden") markBackgrounded();
      else if (hasPin() && shouldLock()) setLocked(true);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  const [entryPayload, setEntryPayload] = useState(null);
  const [homeNonce, setHomeNonce] = useState(0);
  // Phase 6.4c: one-shot forced beat for a manual launch (post-event from My
  // Progress). Null for the normal time-routed home session.
  const [spineBeat, setSpineBeat] = useState(INITIAL_SHARE_TEXT ? "main" : null);

  // Phase 8c: warm subscription status; A4: version-gated auto-backup.
  useEffect(() => {
    // ?seed=demo — Arlin's walk tool: plant a three-month record so the
    // month-six app can be felt. Refuses real records unless forced.
    maybeSeedDemo();
    runVersionGatedBackup();
    refreshSubscriptionStatus();
    // Keep a consented weather reading fresh. No-op unless weather is on and the
    // last reading is stale; never prompts once location is granted. Fire-and-forget.
    maybeRefreshWeather().catch(() => {});
  }, []);

  // Global header actions.
  const goHome = () => {
    setSpineBeat(null);
    setEntryPayload(null);
    setScreen("home");
  };
  const goSignIn = () => setScreen("paywall"); // Log in / sign up lives on the subscription page (Arlin, June 23)

  const renderScreen = () => {
    if (screen === "verify") return <FoundationVerify />;
    if (screen === "statecheck") return <StateCheck onDone={goHome} onSkip={goHome} />;

    if (screen === "spine") {
      return (
        <Spine
          forcedBeat={spineBeat}
          initialText={INITIAL_SHARE_TEXT || null}
          entryPayload={entryPayload}
          onExit={() => {
            maybeOpportunisticBackup();
            setSpineBeat(null);
            setEntryPayload(null);
            setScreen("home");
          }}
          onNavigate={(target) => {
            maybeOpportunisticBackup();
            setSpineBeat(null);
            setEntryPayload(null);
            setScreen(target);
          }}
        />
      );
    }

    if (screen === "my-progress") {
      return (
        <MyProgress
          onExit={() => setScreen("home")}
          onNavigate={(target) => {
            // Map editor ids → screen state. Unknown targets fall through.
            if (target === "context-profile") setScreen("context-profile");
            else if (target === "trigger-profile") setScreen("trigger-profile");
            else if (target === "bias-profile") setScreen("bias-profile");
            else if (target === "capacities-mirror") setScreen("capacities-mirror");
            else if (target === "risk-profile") setScreen("risk-profile");
            else if (target === "prediction-mirror") setScreen("prediction-mirror");
            else if (target === "what-you-bet-on") setScreen("what-you-bet-on");
            else if (target === "thought-record") setScreen("thought-record");
            else if (target === "narrative-arc") setScreen("narrative-arc");
            else if (target === "re-read") setScreen("re-read");
            else if (target === "becoming") setScreen("becoming");
            else if (target === "practice-evidence") setScreen("practice-evidence");
            // Phase 6.4c: post-event reflection — launch spine in post-event beat.
            else if (target === "post-event") {
              setSpineBeat("post-event");
              setScreen("spine");
            }
            // Phase 7d: Pre-event Brief — standalone artifact screen.
            else if (target === "pre-event-brief") setScreen("pre-event-brief");
            else if (target === "season-review") setScreen("season-review");
            else if (target === "naming-ledger") setScreen("naming-ledger");
          }}
        />
      );
    }

    // Diagnostic editors — onExit returns to my-progress (AppV2 owns the stack).
    if (screen === "context-profile") return <ContextProfile onExit={() => setScreen("my-progress")} />;
    if (screen === "trigger-profile") return <TriggerProfile onExit={() => setScreen("my-progress")} />;
    if (screen === "bias-profile") return <BiasProfile onExit={() => setScreen("my-progress")} />;
    if (screen === "capacities-mirror") return <CapacitiesMirror onExit={() => setScreen("my-progress")} />;
    if (screen === "season-review") return <SeasonReview onExit={() => setScreen("my-progress")} />;
    if (screen === "naming-ledger") return <NamingLedger onExit={() => setScreen("my-progress")} />;
    if (screen === "risk-profile") return <RiskProfileMirror onExit={() => setScreen("my-progress")} />;
    if (screen === "prediction-mirror") return <PredictionErrorMirror onExit={() => setScreen("my-progress")} />;
    if (screen === "what-you-bet-on") return <WhatYouBetOnMirror onExit={() => setScreen("my-progress")} />;
    if (screen === "vulnerabilities") return <Vulnerabilities onExit={() => setScreen("my-progress")} />;
    if (screen === "protective-moves") return <ProtectiveMoves onExit={() => setScreen("my-progress")} />;
    if (screen === "body-vs-story") return <BodyVsStory onExit={() => setScreen("my-progress")} />;
    if (screen === "strengths") return <Strengths onExit={() => setScreen("my-progress")} />;
    if (screen === "values") return <Values onExit={() => setScreen("my-progress")} />;
    if (screen === "reframe-vs-hold") return <ReframeVsHold onExit={() => setScreen("my-progress")} />;
    if (screen === "observer-seat") return <ObserverSeat onExit={() => setScreen("my-progress")} />;
    if (screen === "trigger-meta") return <TriggerMetaPatterns onExit={() => setScreen("my-progress")} />;
    if (screen === "the-model") return <FrameworkModel onExit={() => setScreen("my-progress")} />;
    if (screen === "window") return <WindowRead onExit={() => setScreen("my-progress")} />;
    if (screen === "thought-record") return <ThoughtRecord onExit={() => setScreen("my-progress")} />;
    if (screen === "narrative-arc") return <NarrativeArc onExit={() => setScreen("my-progress")} />;
    if (screen === "practice-evidence") return <PracticeEvidence onExit={() => setScreen("my-progress")} />;

    if (screen === "library") return <Library onExit={() => setScreen("home")} />;
    if (screen === "library-learn") return <Library initialTab="learn" onExit={() => setScreen("home")} />;
    if (screen === "concierge") return <Concierge onExit={() => setScreen("home")} onOpenSettings={() => setScreen("settings")} />;
    if (screen === "becoming") return <Becoming onExit={() => setScreen("my-progress")} />;
    if (screen === "re-read") return <ReRead onExit={() => setScreen("my-progress")} onNavigate={(t) => { if (t === "crisis-resources") setScreen("crisis-resources"); }} />;

    if (screen === "pre-event-brief") {
      return <PreEventBrief onDone={() => setScreen("home")} onExit={() => setScreen("my-progress")} />;
    }

    if (screen === "paywall") return <Paywall onClose={() => setScreen("home")} />;

    if (screen === "onboarding") {
      return <Onboarding
        onEscapeToBreath={() => {
          // J1: deferred setup — do NOT setOnboarded; land on Home where
          // BreathAnywhere floats, and signal it to open breath immediately.
          try { localStorage.setItem("stillform_v2_open_breath_on_land", "1"); } catch { /* fine */ }
          setScreen("home");
        }}
        onComplete={() => {
        setOnboarded();
        // W3 (2026-07-09): the first-landing catch — the most-motivated moment
        // a user ever has. One-shot flag; SmartScreen consumes it once.
        try { localStorage.setItem("stillform_v2_first_landing", "1"); } catch { /* fine */ }
        setScreen("home");
      }} />;
    }

    if (screen === "settings") return <Settings onExit={() => setScreen("home")} onNavigate={(t) => { if (t === "crisis-resources") setScreen("crisis-resources"); }} />;
    if (screen === "roadmap") return <Roadmap onExit={() => setScreen("home")} />;
    if (screen === "crisis-resources") return <CrisisResources onExit={() => setScreen("home")} />;
    if (screen === "faq") return <FAQ onExit={() => setScreen("home")} />;

    // Default: home.
    return (
      <Home
        key={homeNonce}
        onEnterPractice={(text, chip, opts = {}) => {
          // The user named on the home practice surface. Carry that payload
          // into the spine, which replays it to land at Reframe/move/reset.
          setSpineBeat(null);
          if (shouldGate()) { setScreen("paywall"); return; }
          setEntryPayload({ text, chip, opts });
          setScreen("spine");
        }}
        onNavigate={(target) => {
          // 'home-refresh' re-mounts Home so a completed in-place session
          // returns to a fresh naming surface for the current beat.
          if (target === "home-refresh") { setHomeNonce((n) => n + 1); return; }
          if (target === "progress") setScreen("my-progress");
          else if (target === "library") setScreen("library");
          else if (target === "library-learn") setScreen("library-learn");
          else if (target === "pre-event-brief") setScreen("pre-event-brief");
          else if (target === "concierge") setScreen("concierge");
          else if (target === "settings") setScreen("settings");
          else if (target === "faq") setScreen("faq");
          else if (target === "crisis-resources") setScreen("crisis-resources");
          else if (target === "roadmap") setScreen("roadmap");
          else if (target === "paywall") setScreen("paywall");
        }}
      />
    );
  };

  // W8: the gate replaces everything while locked — nothing renders behind it
  // (no content in the DOM for a snooper's dev tools to read).
  if (locked) {
    return (
      <div className="sf-v2">
        <PinGate onUnlock={() => setLocked(false)} />
      </div>
    );
  }

  return (
    <div className="sf-v2">
      {!HEADERLESS.has(screen) ? <AppHeader onHome={goHome} onSignIn={goSignIn} onCrisis={() => setScreen("crisis-resources")} /> : null}
      <React.Suspense fallback={<div className="sf-page" style={{ minHeight: "40vh" }} aria-busy="true" />}>
        {renderScreen()}
      </React.Suspense>
      {/* Quick Breathe, everywhere (Arlin's v1 decision restored): floats over
          every screen; hides itself only while its own overlay is open. Not
          gated by HEADERLESS — breath must reach home, spine, and onboarding. */}
      {!locked && <BreathAnywhere />}
    </div>
  );
}
