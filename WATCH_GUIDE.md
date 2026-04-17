# Stillform Watch Haptics Integration Guide

**Status:** ✅ Implemented — verify on paired phone/watch hardware  
**Last Updated:** April 4, 2026  
**Watch Device:** Samsung Galaxy Watch Ultra (Wear OS 4+)

## Overview

When a user starts a breathing session on their phone, the connected Wear OS watch automatically receives the breathing pattern and guides them with:
- **Countdown timer** synced to the pattern (Inhale → Hold → Exhale → Rest)
- **Haptic feedback** at each phase transition
- **Visual display** showing current phase, count, and cycle progress
- **Auto-completion** with success haptic pattern

The system uses **Google Play Services Wearable API** for phone↔watch communication.

## Architecture

```
Phone (Stillform App)
  ↓ (Capacitor Bridge)
  WatchBridgePlugin.java → WatchBridge.java
  ↓ (Google Play Services)
  Wearable API (MessageClient)
  ↓ (Network: BLE or WiFi)
  Watch (Wear OS Device)
  ↓
  WearListenerService (receives message)
  ↓
  WearBreatheActivity (displays + haptics)
```

## File Structure

### Phone App
```
android/app/src/main/java/com/araembers/stillform/
├── MainActivity.java           # Registers WatchBridgePlugin
├── WatchBridgePlugin.java      # Capacitor plugin interface
└── WatchBridge.java            # Sends message to watch via Wearable API
```

### Watch App
```
android/wear/src/main/java/com/araembers/stillform/
├── WearListenerService.java    # Receives message from phone
├── WearBreatheActivity.java    # Breathing UI + haptics
└── AndroidManifest.xml         # Service registration
```

### Layouts & Resources
```
android/wear/src/main/res/
└── layout/
    └── activity_wear_breathe.xml  # Watch breathing UI
```

## Build & Deploy

### Step 1: Verify Dependencies

Check that your phone and watch are connected:

```bash
adb devices
# Output should show your watch/phone:
# emulator-5554    device
# 192.168.1.100:5555  device  (watch)
```

**For physical Galaxy Watch Ultra over WiFi:**
```bash
# Enable Wi-Fi debugging on watch (Settings → Developer Options)
# Get watch IP address
adb connect <WATCH_IP>:5555
adb devices
```

### Step 2: Build Phone App

```bash
cd ~/stillform/android
./gradlew assembleDebug

# Output: app/build/outputs/apk/debug/app-debug.apk
```

### Step 3: Build Watch App

```bash
cd ~/stillform/android
./gradlew :wear:assembleDebug

# Output: wear/build/outputs/apk/debug/wear-debug.apk
```

### Step 4: Install Phone APK

```bash
# Use default adb target (phone)
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### Step 5: Install Watch APK

```bash
# If watch is connected via WiFi
adb connect <WATCH_IP>:5555

# Install watch app
adb -s <WATCH_SERIAL_OR_IP> install -r wear/build/outputs/apk/debug/wear-debug.apk

# Or if only one watch connected:
adb install -r wear/build/outputs/apk/debug/wear-debug.apk
```

### Step 6: Verify Installation

```bash
# Check phone app
adb shell pm list packages | grep araembers.stillform

# Check watch app (from watch serial)
adb -s <WATCH_SERIAL> shell pm list packages | grep araembers.stillform
```

## Testing Checklist

### Pre-Test Setup
- [ ] Phone and watch paired via Wear OS app
- [ ] Both APKs installed
- [ ] Phone has internet (watch syncs via phone)
- [ ] Developer mode enabled on both devices

### Test 1: Basic Connectivity
1. Open Stillform on phone
2. Open phone logcat: `adb logcat | grep "StillformWatch"`
3. Start any breathing session
4. Confirm log shows a send attempt (for example: `Breathing sent to watch: calm`)

### Test 2: Start Breathing -> Watch Activation
1. Phone: Start a breathing session (any pattern)
2. Watch: Should light up within 2-3 seconds
3. Watch: Should show "INHALE" and a countdown
4. Logcat: Look for message: `[StillformWatch] Breathing sent to watch: <pattern>`

### Test 3: Haptic Feedback
1. Phone: Start calm breathing (4-4-8-2)
2. Watch: Feel vibrations at each phase start:
   - **Inhale (4s):** Medium pulse (60ms, intensity 120)
   - **Hold (4s):** Light pulse (30ms, intensity 60)
   - **Exhale (8s):** Gentle long pulse (80ms, intensity 80)
   - **Rest (2s):** Very light pulse (15ms, intensity 40)
3. Watch: Also feel tick haptics every 1 second during countdown (8ms, intensity 40)

### Test 4: Pattern Switching
Test each breathing pattern:

**Calm (4-4-8-2)** — Default regulate pattern
- 4 sec inhale → 4 sec hold → 8 sec exhale → 2 sec rest
- Total cycle: 18 seconds × 3 cycles = 54 seconds

**Box (4-4-4-4)** — Balanced pattern
- 4 sec each phase
- Total cycle: 16 seconds × 3 cycles = 48 seconds

**4-7-8** — Extended exhale
- 4 sec inhale → 7 sec hold → 8 sec exhale → 0 sec rest
- Total cycle: 19 seconds × 3 cycles = 57 seconds

**Quick (4-0-6-2)** — Fast reset
- 4 sec inhale → 0 sec hold → 6 sec exhale → 2 sec rest
- Total cycle: 12 seconds × 3 cycles = 36 seconds

### Test 5: Completion
1. Watch: After 3 cycles complete
2. Watch: Display should show "◎" and "Composed"
3. Watch: Feel success haptic (two strong pulses)
4. Watch: Auto-close after 3 seconds
5. Phone: Session ends, show post-rating

## Haptic Pattern Details

### Phase Start Haptics (milliseconds + intensity)

```java
case 0: // Inhale — medium pulse
    vibrator.vibrate(VibrationEffect.createOneShot(60, 120));
    
case 1: // Hold — light pulse
    vibrator.vibrate(VibrationEffect.createOneShot(30, 60));
    
case 2: // Exhale — gentle long pulse
    vibrator.vibrate(VibrationEffect.createOneShot(80, 80));
    
case 3: // Rest — very light
    vibrator.vibrate(VibrationEffect.createOneShot(15, 40));
```

### Tick Haptic (every 1 second)
```java
vibrator.vibrate(VibrationEffect.createOneShot(8, 40));
```

### Completion Haptic
```java
// Success pattern: two strong pulses with silence between
long[] pattern = {0, 60, 80, 100};
int[] amplitudes = {0, 180, 0, 220};
vibrator.vibrate(VibrationEffect.createWaveform(pattern, amplitudes, -1));
```

### Tuning Haptics

If haptics feel too strong/weak, edit `WearBreatheActivity.java`:

**Make stronger:** Increase intensity (max 255)
```java
vibrator.vibrate(VibrationEffect.createOneShot(60, 180)); // was 120
```

**Make softer:** Decrease intensity
```java
vibrator.vibrate(VibrationEffect.createOneShot(60, 80)); // was 120
```

**Make longer/shorter:** Adjust milliseconds (first param)
```java
vibrator.vibrate(VibrationEffect.createOneShot(100, 120)); // was 60ms
```

After changes, rebuild: `./gradlew :wear:assembleDebug && adb install -r wear/build/outputs/apk/debug/wear-debug.apk`

## Debugging & Logs

### View Watch Logs
```bash
adb -s <WATCH_SERIAL> logcat | grep -E "StillformWatch|WearBreathe"
```

### View Phone Logs
```bash
adb logcat | grep -E "WatchBridge|StillformWatch"
```

### Common Log Messages

**Phone:**
```
[StillformWatch] Breathing sent to watch: calm
[StillformWatch] Watch not reachable: (error message)
[StillformWatch] No watch connected: (error message)
```

**Watch:**
```
[WearListenerService] Message received on /stillform/breathe
[WearBreatheActivity] Starting breathing with pattern: calm
```

### If Watch Doesn't Respond

1. **Check pairing:**
   ```bash
   adb -s <PHONE_SERIAL> shell getprop ro.serialno
   adb -s <WATCH_SERIAL> shell getprop ro.serialno
   ```

2. **Restart Wearable API connection:**
   ```bash
   adb shell am force-stop com.google.android.wearable.app
   adb shell am start -n com.google.android.wearable.app/.setup.WearSetupActivity
   ```

3. **Check phone app permissions:**
   ```bash
   adb shell pm grant com.araembers.stillform android.permission.BLUETOOTH
   adb shell pm grant com.araembers.stillform android.permission.BLUETOOTH_ADMIN
   adb shell pm grant com.araembers.stillform android.permission.BODY_SENSORS
   ```

4. **Reinstall both apps:**
   ```bash
   adb uninstall com.araembers.stillform
   adb -s <WATCH_SERIAL> uninstall com.araembers.stillform
   # Then reinstall both APKs
   ```

## Performance Notes

- **Latency:** Message delivery typically 1-3 seconds (depends on connection quality)
- **Battery:** Breathing session uses minimal battery (haptics are brief pulses)
- **Memory:** Watch app is ~2MB, minimal RAM usage
- **Connectivity:** Works over BLE or WiFi; requires phone nearby or same WiFi

## Architecture Details

### Wearable Message Protocol

**Message Path:** `/stillform/breathe`  
**Data:** UTF-8 string (pattern name)
**Patterns:** "calm" | "box" | "478" | "quick"

```
Phone App → Capacitor Bridge
        ↓
WatchBridgePlugin.startBreathing()
        ↓
WatchBridge.startBreathingOnWatch()
        ↓
Wearable.getMessageClient(context)
  .sendMessage(nodeId, "/stillform/breathe", patternBytes)
        ↓
Watch Wearable API receives
        ↓
WearListenerService.onMessageReceived()
        ↓
WearBreatheActivity.startActivity(intent with pattern)
        ↓
WearBreatheActivity.startBreathing() triggers haptics & UI
```

### Synchronization

The watch app **does not** sync with the phone's UI in real-time. Instead:
- Watch receives pattern name
- Watch independently runs its own breathing loop (accurate to 1 second)
- Both finish around the same time (within 1-2 seconds of each other)
- User gets feedback from both devices simultaneously

This design avoids latency issues and ensures smooth haptic feedback.

## Known Limitations

1. **No real-time sync:** Watch and phone breath timing may drift 1-2 seconds
2. **Pattern names only:** Watch doesn't receive breathing pace settings (hardcoded patterns)
3. **No HRV monitoring yet:** Watch can't read heart rate to auto-prompt
4. **No voice guidance:** Watch haptics only (no audio)
5. **No complications:** Watch doesn't show persistent Stillform widget (can add later)

## Future Enhancements

- [ ] Add watch complications (quick-launch breathing from watch face)
- [ ] Add custom pace settings sent from phone to watch
- [ ] HRV integration (detect elevated heart rate on watch, prompt breathing)
- [ ] Voice guidance on watch (spoken phase names)
- [ ] Watch → Phone feedback (send session stats back to phone)
- [ ] Ambient mode (watch face changes color during breathing)

## Quick Reference

### One-Command Deploy (All-in-One)
```bash
cd ~/stillform && \
npm run build && \
npx cap sync && \
cd android && \
./gradlew assembleDebug :wear:assembleDebug && \
adb install -r app/build/outputs/apk/debug/app-debug.apk && \
adb -s <WATCH_SERIAL> install -r wear/build/outputs/apk/debug/wear-debug.apk && \
echo "✅ Deploy complete"
```

### Watch-Only Rebuild
```bash
cd ~/stillform/android && \
./gradlew :wear:assembleDebug && \
adb -s <WATCH_SERIAL> install -r wear/build/outputs/apk/debug/wear-debug.apk
```

### View Real-Time Logs
```bash
adb logcat | grep -E "Stillform|Watch|Haptics" --line-buffered
```

---

**Note:** Share-to-Reframe integration is already implemented in the Android app and documented in `SHARE_EXTENSION_GUIDE.md`.
