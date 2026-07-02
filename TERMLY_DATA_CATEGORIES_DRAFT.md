# TERMLY / PRIVACY POLICY — DATA-CATEGORY DRAFT (2026-07-01)

**Status: DRAFT for Arlin.** This is plain-language draft text for the Termly
editor covering the data categories the app now actually touches. It is
grounded in code behavior (each claim verified against the implementation) —
but it is **not legal advice**; Termly's questionnaire + counsel judgment
govern final wording. Nothing here should ship without Arlin's review.

**Why now:** the sensing layer added categories the current policy does not
name: location, weather, calendar, calendar screenshots, and (native, later)
health signals. Public ship is gated on the policy naming them.

---

## Categories to add / confirm in Termly

### 1. Approximate location (only if you turn on Ambient weather)
- Collected ONLY when the user enables the optional "Ambient weather" setting
  (off by default) and grants the browser/device location permission.
- Used transiently, on-device, to request the day's local weather conditions
  from a third-party weather service (Open-Meteo). Coordinates are rounded to
  roughly city scale (~1 km) before the request is made.
- **Never stored** — not on the device, not on our servers. Only the derived
  weather conditions are kept (see 2).
- Turning the setting off deletes the stored weather conditions.
- Third party involved: Open-Meteo receives the rounded coordinates to answer
  the weather request (no account, no API key, no user identifier sent).

### 2. Weather conditions (derived, on-device)
- If Ambient weather is on: the day's temperature, air pressure, a one-word
  sky condition, and daylight hours are stored on the device and refreshed
  periodically.
- Used only to quietly inform the tone of the app's responses and the daily
  brief. Never shown to the user as an explanation for how they feel.
- Deleted when the setting is turned off, and covered by "clear all data."

### 3. Calendar information (only if you connect it)
- Optional; off by default; user-initiated via file import (.ics), paste, or a
  screenshot (see 4). A future phone version may read the device calendar with
  the same consent.
- We keep ONLY event titles and start/end times, on the device — never
  attendees, invitees, descriptions, notes, or locations (these are stripped
  before storage).
- Used to prepare the user's daily brief and pre-event preparation.
- Disconnecting deletes all stored calendar data.

### 4. Calendar screenshots (only if you use screenshot import)
- If the user chooses "From a screenshot," the image is sent to our AI
  provider (OpenAI) to read event titles and times out of it. The image may
  incidentally show other on-screen content; the app warns the user to send
  only what they're comfortable sharing.
- We keep only the extracted titles and times (as in 3). We do not store the
  image. Processing by the AI provider is governed by its API data-usage terms.
  [ARLIN/COUNSEL: confirm the OpenAI API retention language you want cited —
  API inputs are not used for training per OpenAI's API terms, but retention
  windows should be stated in their words, not ours.]

### 5. Health signals — HRV and sleep (phone version, only if you connect them)
- NOT live on the web version. When the phone version ships, the user may
  connect Apple Health / Health Connect; with consent, last night's sleep
  duration and a heart-rate-variability reading are stored on the device.
- Used only to derive a coarse same-day state (e.g., short sleep) that informs
  the app's responses. Raw readings never leave the device; only the coarse
  derived state is included in AI requests.
- Revoking consent deletes stored readings.
- [Do not publish this section until the native build ships — policy must not
  describe collection that doesn't exist yet. Staged here so it's ready.]

### 6. Already-covered categories to re-verify while in the editor
- On-device practice data (sessions, logs, profiles, instrument results,
  belief records, the season review — all computed on-device, stillform_-
  prefixed, removable via Settings).
- AI conversation content sent to the AI provider to generate responses.
- Anonymous install ID for subscription status.
- Analytics (Plausible — cookieless, no personal profiles).
- Payment (Lemon Squeezy as merchant of record).

---

## One-line summary for the policy intro (draft, Arlin's voice to set)
"Stillform keeps your practice on your device. The optional extras — weather,
calendar, and (on the phone) health signals — are off until you turn them on,
keep only the minimum, and are deleted the moment you turn them off."
