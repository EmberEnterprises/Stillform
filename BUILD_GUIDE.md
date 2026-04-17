# Stillform Build & Deploy Guide

**Last Updated:** April 17, 2026  
**Scope:** Current `main` build/install source of truth

## Quick Start (5 min)

### 1. Pull Latest Code
```bash
cd ~/stillform
git pull origin main
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build for Native
```bash
npm run build           # Build React for Android/iOS
npx cap sync          # Sync to native projects
```

### 4. Build Android APK

#### **Option A: Android Studio GUI (Easiest)**
1. Open Android Studio
2. File → Open → `~/stillform/android`
3. Wait for Gradle sync
4. Build → Build Bundle(s) / APK(s) → Build APK(s)
5. Find APK: `android/app/build/outputs/apk/debug/app-debug.apk`

#### **Option B: Command Line**
```bash
cd ~/stillform/android
./gradlew assembleDebug
# APK created at: app/build/outputs/apk/debug/app-debug.apk
```

#### **Option C: Release APK** (for testing in Play Store)
```bash
cd ~/stillform/android
./gradlew assembleRelease
# APK: app/build/outputs/apk/release/app-release.apk
```

### 5. Install on Android phone (debug APK)

```bash
# Connect device via ADB
adb devices

# Uninstall old version (optional)
adb uninstall com.araembers.stillform

# Install new APK on phone
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# View logs (optional, for debugging)
adb logcat | grep "stillform\|Widget"
```

### 6. Install on paired Wear OS watch (optional)

Only required when validating the watch breathing companion.

```bash
cd ~/stillform/android
./gradlew :wear:assembleDebug

# Install watch APK
adb -s <WATCH_SERIAL_OR_IP> install -r wear/build/outputs/apk/debug/wear-debug.apk

# Watch logs
adb -s <WATCH_SERIAL_OR_IP> logcat | grep -E "StillformWatch|WearBreathe"
```

## What Changed in This Update

### 1. **Widget Routing (App.jsx)**
- ✅ Widget tap now launches Breathe tool (was going to Home)
- ✅ Added console logging for debugging
- ✅ Works even if user hasn't completed onboarding

### 2. **Widget Visual Design**
- ✅ Added "Breathe" label to widget
- ✅ Improved background with gradient + amber border
- ✅ More prominent and recognizable on home screen

## Testing Checklist

After deploying the APK:

- [ ] App installs without errors
- [ ] Widget appears on home screen
- [ ] Widget shows "◎ Breathe" with amber border
- [ ] Tap widget → launches Breathe tool (not Home)
- [ ] Logs show: `[Widget] checkLaunchAction result:`
- [ ] Check `adb logcat` for `[Widget]` messages

## Troubleshooting

### Widget Still Goes to Home Screen
1. Check logs: `adb logcat | grep Widget`
2. Verify `WidgetBridgePlugin.java` exists in Android project
3. Make sure `AndroidManifest.xml` has widget receivers registered

### Widget Blank/Not Showing
1. Force-refresh home screen (swipe down, swipe up)
2. Long-press home → Widgets → Re-add Stillform widget
3. Restart device
4. Rebuild APK with `./gradlew clean assembleDebug`

### Gradle Build Fails with DNS Error
- You're on network with proxy → build locally where possible
- If stuck: delete `android/.gradle` folder and rebuild
- Or: disable Gradle offline mode in Android Studio

### ADB Device Not Found
```bash
adb devices                    # List connected devices
adb kill-server                # Reset ADB
adb start-server
adb devices                    # Try again
```

## File Structure

```
stillform/
├── src/App.jsx                 # Main app + widget routing logic
├── android/
│   ├── app/src/main/java/com/araembers/stillform/
│   │   ├── MainActivity.java
│   │   ├── StillformWidget.java
│   │   ├── StillformWidgetReceiver.java
│   │   └── WidgetBridgePlugin.java
│   └── app/src/main/res/
│       ├── layout/widget_stillform.xml
│       └── drawable/widget_background.xml
├── dist/                       # Built React app (after npm run build)
└── package.json
```

## Current Integration Status

1. ✅ Deploy widget fix + test on device
2. ✅ Watch haptics bridge is implemented — verify on paired phone/watch hardware
3. ✅ Share-to-Reframe is implemented — verify with first-run already completed

## Build Times

- `npm run build`: ~3-5 seconds
- `npx cap sync`: ~1-2 seconds
- `./gradlew assembleDebug`: ~45-60 seconds (first time longer)
- `adb install`: ~10-15 seconds

## Push Notifications & Watch Haptics

If testing push notifications or watch integration:

```bash
# After APK install, grant permissions
adb shell pm grant com.araembers.stillform android.permission.POST_NOTIFICATIONS

# For watch testing:
adb shell setprop debug.atrace.tags.enableflags 1
adb logcat | grep "WatchBridge\|Haptics"
```

---

**Questions?** Check the commit message or Android Studio build logs.
