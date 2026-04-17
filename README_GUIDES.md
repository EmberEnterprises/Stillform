# Stillform Build & Integration Guides

A complete reference for all Stillform native integrations, build procedures, and testing.

## 📚 Guide Index

### 1. **BUILD_GUIDE.md** — Get Started Here
Quick start for building & deploying APK, installation, and troubleshooting.

**Read this if you need to:**
- Build React app for native
- Build Android APK
- Install APK on device
- Debug basic build issues

**Time:** ~5 minutes to deploy

---

### 2. **WATCH_GUIDE.md** — Wear OS Watch Integration
Full watch haptics system: breathing countdown + haptic feedback on Galaxy Watch.

**Features:**
- ✅ Phone sends breathing pattern to watch
- ✅ Watch displays countdown (Inhale → Hold → Exhale → Rest)
- ✅ Haptic feedback at each phase transition
- ✅ Success haptic pattern on completion
- ✅ Auto-closes after finishing

**Read this if you need to:**
- Deploy watch APK
- Test haptic feedback
- Tune haptic patterns
- Debug watch connectivity
- Understand Wearable API architecture

**Time:** ~10 minutes to deploy both phone + watch APK (then verify on paired devices)

**Key files:**
- `android/app/src/main/java/com/araembers/stillform/WatchBridgePlugin.java` (phone)
- `android/wear/src/main/java/com/araembers/stillform/WearBreatheActivity.java` (watch)
- `android/wear/src/main/java/com/araembers/stillform/WearListenerService.java` (watch receiver)

---

### 3. **SHARE_EXTENSION_GUIDE.md** — Text Share from Any App
Users can share text from Notes, Email, Twitter, etc. → lands in Reframe tool.

**Features:**
- ✅ Share menu shows "Stillform · Reframe"
- ✅ Text pre-fills in Reframe input
- ✅ Requires first-run completion before auto-routing to Reframe
- ✅ URL-encoded for special characters
- ✅ No storage/logging of shared text

**Read this if you need to:**
- Test share intent
- Debug share text encoding/decoding
- Implement iOS share extension
- Understand Android intent handling
- Test edge cases (long text, special chars, etc.)

**Time:** ~5 minutes to test (implemented; verify on device)

**Key files:**
- `android/app/src/main/java/com/araembers/stillform/ShareReceiverActivity.java`
- `src/App.jsx` (`?share=` deep-link handling guarded by first-run completion)

---

## 🚀 Deployment Workflows

### Deploy Only React Changes
```bash
cd ~/stillform
npm run build
npx cap sync
cd android
./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### Deploy React + Watch
```bash
cd ~/stillform
npm run build
npx cap sync
cd android
./gradlew assembleDebug :wear:assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb -s <WATCH_SERIAL> install -r wear/build/outputs/apk/debug/wear-debug.apk
```

### Fast Watch-Only Rebuild (after haptic changes)
```bash
cd ~/stillform/android
./gradlew :wear:assembleDebug
adb -s <WATCH_SERIAL> install -r wear/build/outputs/apk/debug/wear-debug.apk
```

---

## 🧪 Testing Checklist

### Pre-Build
- [ ] Code changes committed to GitHub
- [ ] No TypeScript errors
- [ ] No console warnings in React

### Post-Build (Phone)
- [ ] App installs without errors
- [ ] Widget appears on home screen
- [ ] Widget shows "◎ Breathe" with amber border
- [ ] Tap widget → launches Breathe tool
- [ ] Can start breathing session
- [ ] Reframe AI works
- [ ] Push notifications work

### Post-Build (Watch)
- [ ] Watch APK installs
- [ ] Watch app shows in app list
- [ ] Phone + watch paired
- [ ] Start breathing on phone → watch lights up
- [ ] Watch shows countdown with haptics
- [ ] Each phase has different haptic pattern
- [ ] Completion shows success haptic
- [ ] Watch auto-closes after 3 seconds

### Post-Build (Share)
- [ ] Share option appears in Notes app
- [ ] Shared text pre-fills in Reframe
- [ ] Special characters preserved (emojis, quotes, etc.)
- [ ] First-run has already been completed before share test
- [ ] Can submit reframe and get AI response

---

## 📋 Common Tasks

| Task | Guide | Command |
|------|-------|---------|
| First-time build | BUILD_GUIDE | `npm run build && npx cap sync && ./gradlew assembleDebug` |
| Deploy watch APK | WATCH_GUIDE | `./gradlew :wear:assembleDebug && adb -s <ID> install -r wear/.../debug.apk` |
| Test share extension | SHARE_GUIDE | Share text from Notes → Verify in Reframe input |
| Debug widget routing | BUILD_GUIDE | `adb logcat \| grep Widget` |
| Debug watch messages | WATCH_GUIDE | `adb logcat \| grep StillformWatch` |
| Debug share intent | SHARE_GUIDE | `adb logcat \| grep Share` |
| Tune haptics | WATCH_GUIDE | Edit `WearBreatheActivity.java` lines 135-146 |
| View real-time logs | Any | `adb logcat \| grep -E "Stillform\|Widget\|Watch\|Share"` |

---

## 🔍 Key Files Reference

```
stillform/
├── README_GUIDES.md                          ← You are here
├── BUILD_GUIDE.md                            ← Start here
├── WATCH_GUIDE.md                            ← Watch haptics
├── SHARE_EXTENSION_GUIDE.md                  ← Share intent
├── src/
│   └── App.jsx                               ← Main app logic
├── android/
│   ├── app/
│   │   ├── src/main/java/com/araembers/stillform/
│   │   │   ├── MainActivity.java             ← App entry point
│   │   │   ├── WatchBridgePlugin.java        ← Send to watch
│   │   │   ├── WatchBridge.java              ← Wearable API wrapper
│   │   │   ├── WidgetBridgePlugin.java       ← Widget flag check
│   │   │   └── ShareReceiverActivity.java    ← Share handler
│   │   └── AndroidManifest.xml               ← Permissions & receivers
│   └── wear/
│       ├── src/main/java/com/araembers/stillform/
│       │   ├── WearBreatheActivity.java      ← Watch UI + haptics
│       │   └── WearListenerService.java      ← Message receiver
│       └── src/main/res/
│           ├── layout/activity_wear_breathe.xml
│           └── drawable/widget_background.xml
└── capacitor.config.ts                       ← App config
```

---

## 🐛 Troubleshooting Quick Links

**Widget not launching breathe tool?**  
→ See BUILD_GUIDE.md "Widget Still Goes to Home Screen"

**Watch not receiving message?**  
→ See WATCH_GUIDE.md "If Watch Doesn't Respond"

**Share option missing from menu?**  
→ See SHARE_EXTENSION_GUIDE.md "If Share Doesn't Appear in Menu"

**APK build fails?**  
→ See BUILD_GUIDE.md "Gradle Build Fails with DNS Error"

**Watch haptics too strong/weak?**  
→ See WATCH_GUIDE.md "Tuning Haptics"

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Stillform App (React)                  │
│  - Breathing tool (animations + timers)                  │
│  - Reframe AI tool (Netlify serverless)                  │
│  - Signal Log (localStorage)                             │
└────────┬──────────────────────┬───────────────┬──────────┘
         │                      │               │
         ▼                      ▼               ▼
   ┌──────────────┐      ┌─────────────┐  ┌─────────────┐
   │ Widget Bridge│      │Watch Bridge │  │Share Receiver
   │ Plugin       │      │ Plugin      │  │Activity
   │              │      │             │  │
   │ (Checks flag)│      │(Sends msg)  │  │(Catches intent)
   └──────┬───────┘      └──────┬──────┘  └────────┬──────┘
          │                     │                  │
          ▼                     ▼                  ▼
   ┌────────────────┐   ┌──────────────┐  ┌──────────────┐
   │ SharedPref:    │   │ Wearable API │  │ Android Share
   │launch_breathe  │   │ MessageClient│  │ Intent (BLE)
   └────────┬───────┘   └──────┬───────┘  └──────┬───────┘
            │                  │                 │
            └──────────────────┼─────────────────┘
                              ▼
                    ┌─────────────────────┐
                    │   Galaxy Watch      │
                    │   (Wear OS)         │
                    │                     │
                    │ - Listener Service  │
                    │ - Breathe Activity  │
                    │ - Haptics           │
                    └─────────────────────┘
```

---

## 🔄 Git Workflow

All changes are pushed to: `https://github.com/EmberEnterprises/Stillform`

**Recent commits:**
1. `f653f44` - Add share extension guide
2. `e18970d` - Improve share extension logging
3. `dc7b588` - Add watch haptics guide
4. `7c8dff5` - Add build guide
5. `eaef420` - Fix widget routing + UI (latest working version)

**To pull latest:**
```bash
cd ~/stillform
git pull origin main
```

---

## 📞 Support & Next Steps

**If you need to:**

1. **Test native features** → Start with BUILD_GUIDE.md
2. **Deploy watch** → Follow WATCH_GUIDE.md step-by-step
3. **Test share from other apps** → Use SHARE_EXTENSION_GUIDE.md testing checklist
4. **Debug issues** → Check corresponding guide's troubleshooting section
5. **Make code changes** → Build, sync, deploy, test (see workflows above)

**Next priorities (from memory notes):**
- [ ] Set up languages (user chose languages in another session)
- [ ] DUNS number application (needed for Google Play $25 org account)
- [ ] Android Studio on Mac for watch debugging
- [ ] Plausible custom event goals in dashboard
- [ ] Test with real user session (not just internal testing)

---

**Last updated:** April 4, 2026  
**Current version:** Android build with widget fix, watch haptics, share extension  
**Status:** ✅ Ready for testing & deployment

