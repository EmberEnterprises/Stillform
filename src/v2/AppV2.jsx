import React, { useState, useEffect } from "react";
import "./tokens.css";
import "./components.css";
import { applyA11y } from "./lib/a11y.js";
import { runVersionGatedBackup, maybeOpportunisticBackup } from "./lib/backupAuto.js";

// Display accessibility (contrast / text size) — apply persisted settings
// before the tree paints. Module-level call is safe: reads localStorage,
// sets <html> data attributes only.
applyA11y();
import Home from "./screens/Home.jsx";
import AppHeader from "./components/AppHeader.jsx";
import Spine from "./screens/Spine.jsx";
import FoundationVerify from "./screens/FoundationVerify.jsx";
import StateCheck from "./screens/spine/StateCheck.jsx"; // debug route ?statecheck=1 (orphan draft, M3 increment 2a)
import MyProgress from "./screens/MyProgress.jsx";
import ContextProfile from "./screens/ContextProfile.jsx";
import TriggerProfile from "./screens/TriggerProfile.jsx";
import BiasProfile from "./screens/BiasProfile.jsx";
import CapacitiesMirror from "./screens/CapacitiesMirror.jsx";
import RiskProfileMirror from "./screens/RiskProfileMirror.jsx";
import PredictionErrorMirror from "./screens/PredictionErrorMirror.jsx";
import WhatYouBetOnMirror from "./screens/WhatYouBetOnMirror.jsx";
import Vulnerabilities from "./screens/Vulnerabilities.jsx";
import ProtectiveMoves from "./screens/ProtectiveMoves.jsx";
import BodyVsStory from "./screens/BodyVsStory.jsx";
import Strengths from "./screens/Strengths.jsx";
import WindowRead from "./screens/WindowRead.jsx";
import ThoughtRecord from "./screens/ThoughtRecord.jsx";
import NarrativeArc from "./screens/NarrativeArc.jsx";
import PracticeEvidence from "./screens/PracticeEvidence.jsx";
import Library from "./screens/Library.jsx";
import PreEventBrief from "./screens/PreEventBrief.jsx";
import Paywall from "./screens/Paywall.jsx";
import Onboarding from "./screens/Onboarding.jsx";
import Settings from "./screens/Settings.jsx";
import FAQ from "./screens/FAQ.jsx";
import CrisisResources from "./screens/CrisisResources.jsx";
import Roadmap from "./screens/Roadmap.jsx";
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
  const [entryPayload, setEntryPayload] = useState(null);
  const [homeNonce, setHomeNonce] = useState(0);
  // Phase 6.4c: one-shot forced beat for a manual launch (post-event from My
  // Progress). Null for the normal time-routed home session.
  const [spineBeat, setSpineBeat] = useState(INITIAL_SHARE_TEXT ? "main" : null);

  // Phase 8c: warm subscription status; A4: version-gated auto-backup.
  useEffect(() => {
    runVersionGatedBackup();
    refreshSubscriptionStatus();
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
            else if (target === "practice-evidence") setScreen("practice-evidence");
            // Phase 6.4c: post-event reflection — launch spine in post-event beat.
            else if (target === "post-event") {
              setSpineBeat("post-event");
              setScreen("spine");
            }
            // Phase 7d: Pre-event Brief — standalone artifact screen.
            else if (target === "pre-event-brief") setScreen("pre-event-brief");
          }}
        />
      );
    }

    // Diagnostic editors — onExit returns to my-progress (AppV2 owns the stack).
    if (screen === "context-profile") return <ContextProfile onExit={() => setScreen("my-progress")} />;
    if (screen === "trigger-profile") return <TriggerProfile onExit={() => setScreen("my-progress")} />;
    if (screen === "bias-profile") return <BiasProfile onExit={() => setScreen("my-progress")} />;
    if (screen === "capacities-mirror") return <CapacitiesMirror onExit={() => setScreen("my-progress")} />;
    if (screen === "risk-profile") return <RiskProfileMirror onExit={() => setScreen("my-progress")} />;
    if (screen === "prediction-mirror") return <PredictionErrorMirror onExit={() => setScreen("my-progress")} />;
    if (screen === "what-you-bet-on") return <WhatYouBetOnMirror onExit={() => setScreen("my-progress")} />;
    if (screen === "vulnerabilities") return <Vulnerabilities onExit={() => setScreen("my-progress")} />;
    if (screen === "protective-moves") return <ProtectiveMoves onExit={() => setScreen("my-progress")} />;
    if (screen === "body-vs-story") return <BodyVsStory onExit={() => setScreen("my-progress")} />;
    if (screen === "strengths") return <Strengths onExit={() => setScreen("my-progress")} />;
    if (screen === "window") return <WindowRead onExit={() => setScreen("my-progress")} />;
    if (screen === "thought-record") return <ThoughtRecord onExit={() => setScreen("my-progress")} />;
    if (screen === "narrative-arc") return <NarrativeArc onExit={() => setScreen("my-progress")} />;
    if (screen === "practice-evidence") return <PracticeEvidence onExit={() => setScreen("my-progress")} />;

    if (screen === "library") return <Library onExit={() => setScreen("home")} />;

    if (screen === "pre-event-brief") {
      return <PreEventBrief onDone={() => setScreen("home")} onExit={() => setScreen("my-progress")} />;
    }

    if (screen === "paywall") return <Paywall onClose={() => setScreen("home")} />;

    if (screen === "onboarding") {
      return <Onboarding onComplete={() => { setOnboarded(); setScreen("home"); }} />;
    }

    if (screen === "settings") return <Settings onExit={() => setScreen("home")} />;
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
          else if (target === "settings") setScreen("settings");
          else if (target === "faq") setScreen("faq");
          else if (target === "crisis-resources") setScreen("crisis-resources");
          else if (target === "roadmap") setScreen("roadmap");
          else if (target === "paywall") setScreen("paywall");
        }}
      />
    );
  };

  return (
    <div className="sf-v2">
      {!HEADERLESS.has(screen) ? <AppHeader onHome={goHome} onSignIn={goSignIn} /> : null}
      {renderScreen()}
    </div>
  );
}
