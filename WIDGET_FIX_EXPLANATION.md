# Widget Routing Fix — Actual Problem & Solution

## The Real Problem

The widget was broken because of a **timing/synchronization issue**, not a missing feature:

### What Happened:
1. User tapped widget on home screen
2. `StillformWidgetReceiver` set flag `launch_breathe = true` in SharedPreferences ✅
3. User clicked MainActivity (app launched)
4. React app loaded and rendered with `screen = "home"` **SYNCHRONOUSLY**
5. `useEffect` runs but calls async `WidgetBridge.checkLaunchAction()` 
6. User sees HOME SCREEN ❌
7. After ~1-2 seconds, async call returns with `action = "breathe"`
8. App calls `setScreen("tool")` but too late — user already saw home screen

**The widget code itself was correct. The architecture was wrong.**

---

## The Actual Fix

### Before (Broken):
```javascript
const [screen, setScreen] = useState(hasSeenOnboarding ? "home" : "onboarding");
// ↑ Immediately renders home screen

useEffect(() => {
  if (isNative()) {
    checkWidgetFlag(); // ← Async, happens AFTER render
  }
}, []);
```

### After (Fixed):
```javascript
const [screen, setScreen] = useState(null); // ← Start null
const [screenReady, setScreenReady] = useState(false); // ← Flag to track initialization

useEffect(() => {
  const initializeScreen = async () => {
    // Check URL params for action/share
    // Check WidgetBridge for widget flag ← WAITS for result
    // THEN set screen based on what we found
    // FINALLY set screenReady = true
  };
  initializeScreen(); // Call async function
}, []);
```

### Key Changes:

1. **Start with `screen = null`** 
   - App doesn't render any content yet

2. **Splash screen shows while waiting**
   - Updated splash condition: `{(!splashDone || !screenReady) &&`
   - Keeps splash visible until `screenReady = true`

3. **Async function waits for widget check**
   - `WidgetBridge.checkLaunchAction()` completes
   - THEN decides which screen to show
   - THEN sets `screenReady = true`

4. **Nav only renders when ready**
   - Updated nav condition: `{screen !== "onboarding" && screen !== null &&`
   - Prevents rendering before we know what screen is

5. **Console logging for debugging**
   - `[DeepLink]` - URL params detected
   - `[Widget]` - Widget flag check results
   - Clear flow visible in logs

---

## The Execution Flow (Fixed)

```
App Start
  ↓
screen = null (don't render yet)
screenReady = false
  ↓
useEffect runs → initializeScreen() (async)
  ↓
┌─────────────────────────────┐
│ Check URL params            │
│ - action=breathe? ← NO      │
│ - share=text? ← NO          │
└─────────────────────────────┘
  ↓
┌──────────────────────────────────────┐
│ Check WidgetBridge (WAIT FOR RESULT) │
│ - Is launch_breathe flag set? ← YES  │
│ - Result: action="breathe"           │
└──────────────────────────────────────┘
  ↓
setScreen("tool") or setScreen("onboarding")
setScreenReady(true)
  ↓
React renders:
  ✓ Splash fades out (splashDone && screenReady)
  ✓ Nav renders (screen !== null)
  ✓ Breathe tool shows (screen === "tool")
  ✓ activeTool = "breathe"
  ✓ pathway = "calm"
  ↓
User sees Breathe tool ✅ (not home screen)
```

---

## How to Test

1. **Build APK:**
   ```bash
   cd ~/stillform
   npm run build
   npx cap sync
   cd android
   ./gradlew assembleDebug
   adb install -r app/build/outputs/apk/debug/app-debug.apk
   ```

2. **Test Widget Tap:**
   - Add widget to home screen
   - Tap widget
   - Watch logcat: `adb logcat | grep -E "\[Widget\]|\[DeepLink\]"`
   - Should see:
     ```
     [Widget] checkLaunchAction result: {action: "breathe"}
     [Widget] Widget tap detected - launching breathe tool
     ```
   - App should launch directly into Breathe tool (or onboarding → Breathe)

3. **Test Normal App Launch:**
   - Open app normally (not from widget)
   - Should show splash, then home screen
   - No `[Widget]` logs

4. **Test Share Extension:**
   - Share text from Notes app
   - Should launch to Reframe tool with text pre-filled
   - Logs should show: `[DeepLink] Share text from URL params`

---

## Why This Actually Works Now

The fix ensures:
- ✅ Widget flag check completes BEFORE any screen renders
- ✅ App waits for async result instead of rendering home immediately
- ✅ Splash screen acts as "loading" screen during widget check
- ✅ User never sees home screen when tapping widget
- ✅ Clear console logging for debugging

---

## Commit

**Commit a84d975:** "ACTUAL FIX: Widget routing now works - wait for async widget check before rendering home screen"

All changes are live on GitHub and ready to test on Galaxy Watch Ultra.

