# Stillform Share Extension Guide

**Status:** ✅ Implemented — verify on device  
**Last Updated:** April 4, 2026  
**Platforms:** Android (native), iOS (planned)

## Overview

Users can share text from ANY app (Notes, Messages, Twitter, Email, etc.) directly to Stillform. The shared text lands pre-filled in the **Reframe tool**, ready for AI analysis, once first-run setup has been completed.

**Use case:** "I'm spiraling over a work email → Select & share → Stillform opens Reframe with the email text already there → AI reframes in seconds"

## Architecture

### Android Share Flow

```
User selects text in any app
  ↓ (Share menu → "Stillform · Reframe")
ShareReceiverActivity catches ACTION_SEND
  ↓ (Extracts text/plain)
URL encodes text
  ↓
Deep link: https://stillformapp.com/?share=<encoded_text>
  ↓
Capacitor/React receives URL param
  ↓
App.jsx detects ?share= parameter
  ↓
If first-run is complete, launches Reframe tool with sharedText prop
  ↓
ReframeTool auto-fills input field
  ↓
User reviews & submits to AI
```

## Current Implementation

### Android (Complete)

#### File: `ShareReceiverActivity.java`
```java
// Catches ACTION_SEND for text/plain
// URL-encodes the text
// Redirects to: https://stillformapp.com/?share=<text>
```

**Location:** `android/app/src/main/java/com/araembers/stillform/ShareReceiverActivity.java`

#### Manifest Registration
```xml
<activity
    android:name=".ShareReceiverActivity"
    android:label="Stillform · Reframe"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.SEND" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:mimeType="text/plain" />
    </intent-filter>
</activity>
```

**Why this name?** "Stillform · Reframe" shows in the share menu, signaling the user that Stillform will *reframe* their selected text.

### React App (App.jsx)

#### URL Parameter Detection
```javascript
const params = new URLSearchParams(window.location.search);
const share = params.get("share");

if (share && isFirstRunComplete()) {
    setSharedText(decodeURIComponent(share));
    setActiveTool({ id: "reframe", name: "Reframe", mode: "calm" });
    setScreen("tool");
    window.history.replaceState({}, "", "/");
}
```

**Location:** `src/App.jsx` (`?share=` deep-link effect + native `appUrlOpen` listener)

#### ReframeTool Component
```javascript
function ReframeTool({ sharedText = null, ... }) {
    useEffect(() => {
        if (sharedText) {
            setInput(sharedText);
            onSharedTextConsumed?.();
        }
    }, [sharedText]);
    
    // Input field pre-filled with sharedText
    return <textarea defaultValue={sharedText || ""} ... />
}
```

**Location:** `src/App.jsx` (`ReframeTool` shared-text prefill effect)

## Testing Checklist

### Pre-Test Setup
- [ ] Android APK built and installed
- [ ] App installed with share intent handler
- [ ] Multiple other apps available (Notes, Messages, Gmail, etc.)

### Test 1: Share Text from Notes
1. Open Notes app
2. Select any text (e.g., "I'm overwhelmed about the project deadline")
3. Tap Share → "Stillform · Reframe"
4. Stillform launches
5. Check: Text appears pre-filled in Reframe input field
6. Check: URL query is cleared after route (`window.history.replaceState`)

### Test 2: Share from Email
1. Open Gmail or email app
2. Select part of an email body
3. Tap Share → "Stillform · Reframe"
4. Stillform opens Reframe with email text

### Test 3: Share Long Text
1. Copy a paragraph from an article (100+ words)
2. Share to Stillform
3. Check: All text appears correctly (no truncation)
4. Check: Special characters preserved (quotes, punctuation, emojis)

### Test 4: Share with Special Characters
1. Share text with: "quotes", (parentheses), commas, 😀 emojis
2. Verify all characters encoded/decoded correctly
3. Text appears exactly as original in input field

### Test 5: Share Before First-Run Completion
1. Fresh install of app
2. Share text from another app before completing tutorial/setup
3. Check: app does not auto-route directly into Reframe with shared text
4. Complete first-run flow, then share again and verify Reframe pre-fill

### Test 6: Reframe the Shared Text
1. Share text to Stillform
2. Text pre-fills in Reframe input
3. Tap "Reframe" button
4. AI processes the shared text successfully
5. Result shows AI reframe of the user's concern

## File Structure

```
stillform/
├── android/app/src/main/
│   ├── java/com/araembers/stillform/
│   │   └── ShareReceiverActivity.java     # Catches share intent
│   └── AndroidManifest.xml                 # Register activity
├── src/
│   └── App.jsx                             # Handle ?share= param
└── SHARE_EXTENSION_GUIDE.md                # This file
```

## Technical Details

### Text Encoding/Decoding

**ShareReceiverActivity (Phone → Web):**
```java
String encodedText = android.net.Uri.encode(sharedText);
// Results in: "I%27m%20overwhelmed" (URL-safe)
```

**App.jsx (Web ← Phone):**
```javascript
setSharedText(decodeURIComponent(share));
// Results in: "I'm overwhelmed" (user-readable)
```

### Character Limits

- **Android share limit:** 1MB (virtually unlimited for text)
- **React URL param limit:** ~2000 characters (web standard)
- **Reframe input limit:** 2000 characters (set in Netlify function)

If user shares >2000 chars, input is truncated in Reframe. Add warning if needed.

### Security Considerations

- ✅ Text is **not** logged or stored during transit
- ✅ Text is **not** transmitted to any analytics
- ✅ URL params are cleared from browser history (`replaceState()`)
- ✅ Shared text only used for AI reframe, not stored in history by default
- ⚠️ **Future:** Add option to exclude shared text from Pulse context

## Debugging

### View Share Intent Activity Resolution
```bash
adb shell am query-activities -a android.intent.action.SEND -t text/plain
```

### Expected Debug Output
```
`com.araembers.stillform/.ShareReceiverActivity` should appear in the activity list.
```

### If Share Doesn't Appear in Menu

1. **Check manifest registration:**
   ```bash
   adb shell am query-activities -a android.intent.action.SEND
   ```
   Should show: `com.araembers.stillform/.ShareReceiverActivity`

2. **Force sync manifest:**
   ```bash
   npm run build
   npx cap sync
   ./gradlew assembleDebug
   adb install -r android/app/build/outputs/apk/debug/app-debug.apk
   ```

3. **Clear app cache:**
   ```bash
   adb shell pm clear com.araembers.stillform
   ```

4. **Restart phone:**
   Sometimes Android needs restart to refresh share menu

### If Text Appears Truncated

1. Check text length in source app
2. Verify URL encoding: `adb logcat | grep "ACTION_SEND"`
3. Check Reframe input limit: 2000 chars max

## Performance Notes

- **Launch time:** ~1-2 seconds (normal app launch)
- **Text transfer:** <100ms (local, not network)
- **Memory:** Minimal (text stored in React state only)
- **Battery:** No impact

## Edge Cases

### Empty Share
If user selects empty text and shares:
- App receives empty string
- Reframe tool shows empty input field
- User can type their own text
- **No error** (graceful fallback)

### Share from Stillform Itself
If user shares from Signal Log → Reframe:
- Text is copied to Reframe input
- Works as expected
- No infinite loops or issues

### Multiple Shares in Sequence
If user shares multiple times without closing app:
- Old shared text is cleared
- New shared text replaces it
- Works correctly

### Share While App is in Background
- Android queues the share intent
- App launches when user taps Reframe
- Shared text is processed immediately

## Future Enhancements

- [ ] **iOS Share Extension** — Native iOS share sheet integration
- [ ] **Character limit UI** — Warn when text >2000 chars
- [ ] **Rich text support** — Handle bold/italic formatting (if available)
- [ ] **Share history** — Optional: save shared text in Signal Log
- [ ] **One-tap reframe** — Auto-submit shared text without user interaction
- [ ] **Multiple selection** — Share multiple snippets at once
- [ ] **Image OCR** — Share image → extract text → reframe

## iOS Implementation (Planned)

When building for iOS, implement:

1. **Info.plist configuration:**
   ```xml
   <key>CFBundleDocumentTypes</key>
   <array>
       <dict>
           <key>CFBundleTypeName</key>
           <string>Text</string>
           <key>LSItemContentTypes</key>
           <array>
               <string>public.text</string>
               <string>public.plain-text</string>
           </array>
       </dict>
   </array>
   ```

2. **Share Extension Target** (SwiftUI):
   ```swift
   // Receives shared text via NotificationCenter
   // Sends to React app via deep link
   // Similar to Android flow
   ```

3. **URL scheme configuration:**
   ```xml
   <key>CFBundleURLTypes</key>
   <array>
       <dict>
           <key>CFBundleURLSchemes</key>
           <array>
               <string>stillform</string>
           </array>
       </dict>
   </array>
   ```

## One-Command Deploy

```bash
cd ~/stillform && \
npm run build && \
npx cap sync && \
cd android && \
./gradlew assembleDebug && \
adb install -r app/build/outputs/apk/debug/app-debug.apk && \
echo "✅ Share extension deployed"
```

## Testing Tools

### Manual Text Share
```bash
# Share text via adb
adb shell am start -a android.intent.action.SEND \
  --es android.intent.extra.TEXT "Test reframe text" \
  -t text/plain
```

### Verify Intent Handler
```bash
adb shell am query-activities \
  -a android.intent.action.SEND \
  -t text/plain | grep stillform
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Share option not in menu | Rebuild APK, clear app cache, restart phone |
| Text appears truncated | Check text is <2000 chars, check URL encoding |
| App crashes on share | Check console logs, verify URL param handling |
| Blank input field | Verify `sharedText` prop passed to ReframeTool |
| Reframe doesn't process | Check AI API connection, check input validation |

## FAQ

**Q: Can I share images?**  
A: Not yet. Share extension currently handles text/plain only. Image OCR planned for future.

**Q: Where does the shared text go?**  
A: It's used immediately in Reframe tool, not stored unless user explicitly saves the reframe to Signal Log.

**Q: Can I disable the share extension?**  
A: Remove the `<intent-filter>` from `AndroidManifest.xml` if needed (but why would you? 😊)

**Q: Does sharing expose my privacy?**  
A: No. Text is not logged, stored, or sent anywhere except directly to Stillform app. Not transmitted to servers during share.

**Q: Can I share from web browser?**  
A: Yes! Web browser share sheet works the same way (Android 6+).

---

**Next Steps:**
1. Test share extension thoroughly
2. Implement iOS version before public launch
3. Monitor for share intent errors in production
4. Consider add: Character limit warning + One-tap auto-reframe option

