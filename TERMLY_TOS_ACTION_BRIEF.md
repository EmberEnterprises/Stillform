# Termly ToS — TestFlight-Blocking Action Brief

**Date:** May 8, 2026
**Prepared by:** Claude
**Action time required from Arlin:** ~10–15 minutes total (Termly questionnaire + Google Voice setup)
**Why this matters:** Two TestFlight-blocking compliance gaps in the published ToS, both with real legal/privacy exposure. Master todo lines 656–674.

---

## Summary

Two fixes in the Termly ToS, both must happen before TestFlight:

1. **Fix the false billing claim** — current ToS says "account will not be charged" at trial end; Lemon Squeezy actually auto-charges. Real legal exposure if a user disputes a day-15 charge. *(Master todo line 666 — "single biggest exposure in the generated document.")*
2. **Replace personal cell with a Google Voice number** — current ToS publishes Arlin's personal cell (+1 201-388-8437) in two places. *(Master todo line 656.)*

Both fixes are done in the same Termly questionnaire session.

---

## Verified facts (from reading the code, May 8, 2026)

- **In-app trial:** `src/App.jsx:15107` runs a client-side 14-day trial via `stillform_trial_start` localStorage key. When `trialDaysLeft <= 0 && !isSubscribed`, the user is redirected to the pricing screen. This is the gate that takes the user TO the Lemon Squeezy checkout.
- **Lemon Squeezy trial:** confirmed configured with a trial period — `netlify/functions/_subscriptionState.js:165` stores `trial_ends_at` from LS webhooks. This is the LS-side trial that the user enters when they sign up via the LS checkout. After the LS trial ends, LS auto-charges the card on file.
- **Privacy Policy in-repo file** (`public/privacy.html`): clean of phone references. The actual policy content lives on Termly's hosted side at policy UUID `b96f179b-d3e1-4bdb-acc8-6b656ffe0280` (embedded as iframe). **Only you can check the Termly questionnaire to see if the Privacy Policy has the same phone-number issue as the ToS.**

---

## Step 1 — Google Voice setup (5 min)

Do this FIRST so the new number is ready when you open the Termly questionnaire.

1. Go to https://voice.google.com on your laptop or phone.
2. Sign in with your Google account.
3. Pick a number. NJ regional codes (201, 973, 908) keep continuity with your existing identity. If those aren't available, any area code works — published business contact lines aren't expected to match physical location.
4. **Forward to your personal cell** so calls/texts route through transparently. Setting: Settings → Forward calls to → your cell number.
5. **Test it:** call the new GV number from a different phone. Confirm it rings your personal cell.
6. **Capture the new number** somewhere you can paste it into Termly in Step 2 (sticky note, notes app — anywhere you can grab it from).

**If Google Voice doesn't accept your area code preference:** any number is fine. The number being a Google Voice forwarder is what matters, not the area code.

---

## Step 2 — Termly questionnaire updates (5–10 min)

1. Sign in to Termly: https://app.termly.io
2. Open the **Terms of Service** generator (or "Terms & Conditions," depending on Termly's current naming).
3. Walk through the questionnaire to find the two questions below. Termly's UI puts them on different pages — answer in any order.

### Question A — Free Trial

**Look for** the question about what happens at the end of the free trial. Likely worded as: *"What happens to the user's account when their free trial ends?"* or similar.

**Currently selected answer (per the May 4 generation):**

> "The account will not be charged and the subscription will be suspended until upgraded to a paid version at the end of the free trial."

**Change to:**

> "The account will be charged according to the user's chosen subscription."

This neutral phrasing covers both the in-app trial gate AND the Lemon Squeezy trial-then-charge model. Doesn't lock Stillform into a specific billing flow if the LS configuration ever changes. Doesn't make a false claim either direction.

**Why this exact wording:** master todo line 671 already specced this language; it's been thought through. Don't substitute your own wording — different phrasings could over- or under-claim and reintroduce the same class of exposure.

### Question B — Company Contact Phone

**Look for** the company contact / "How can users reach you?" section. Likely lists the phone number.

**Currently in document:** +1 201-388-8437 (personal cell), in TWO places:
- Opening paragraph (company introduction)
- Section 31 "Contact Us"

**Change BOTH places to:** the new Google Voice number from Step 1.

**Format suggestion:** match Termly's existing format. If the current format is `+1 201-388-8437`, use the same format for the new number.

### After updating both questions

1. **Re-generate the ToS** (Termly button — "Generate Document" or similar).
2. **Re-publish.** Termly's hosted page (the embed URL) should auto-update; verify by opening the live ToS in a new tab.
3. The existing in-app references at `https://stillformapp.com/terms` and the Privacy Policy iframe at `app.termly.io/policy-viewer/policy.html?policyUUID=...` will pick up the new content automatically — no in-app code change needed.

---

## Step 3 — Privacy Policy phone check (2 min)

While you're in Termly:

1. Open the **Privacy Policy** generator alongside the ToS generator.
2. Search the questionnaire for any "company contact phone" or similar field.
3. **If the Privacy Policy ALSO uses the personal cell** — replace with the same Google Voice number, re-generate, re-publish.
4. **If it doesn't reference a phone at all** — done, no action needed.

Master todo line 662 noted this needed checking; the in-repo file gave no evidence either way (it's just an iframe wrapper).

---

## Verification after publishing

1. Open https://stillformapp.com/terms in an incognito tab.
2. **Search the page** (Ctrl-F / Cmd-F) for `201-388-8437`. Should return zero matches.
3. **Search for** "will not be charged". Should return zero matches.
4. **Search for** "according to the user's chosen subscription" or similar. Should return one match (the new text).

If any of those searches surface the old content, Termly's republish didn't propagate yet — wait 5 minutes and check again. Termly usually pushes within seconds but cache invalidation can lag.

---

## What this brief does NOT do

- **Does not verify the actual Termly UI screens.** Termly's questionnaire UI changes over time; the question wording in this brief is paraphrased from the master todo's record of what was answered, not from the live Termly screens.
- **Does not change anything in the Stillform repo.** This brief is purely about content hosted on Termly's side. The in-app references (privacy.html iframe, src/App.jsx legal links) all point to Termly URLs that auto-update.
- **Does not address other Termly questions** (cancellation policy, refund policy, governing law, etc.). Those were answered separately during the May 4 questionnaire and are not flagged as needing change. If you spot anything else that looks wrong while you're in Termly, capture it for a separate fix — don't change additional answers in the same session unless you're sure.

---

## Master todo updates after this is done

Once both items are published live, the following master todo items can be marked closed:

- Line 656 — "Set up Google Voice business line + update Termly ToS phone number" → ✅ RESOLVED
- Line 666 — "Fix Termly ToS free-trial billing answer" → ✅ RESOLVED

I can update the master todo to reflect closure once you confirm the changes are published. Until you confirm, the master todo stays as-is.
