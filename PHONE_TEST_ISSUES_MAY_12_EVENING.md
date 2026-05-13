# PHONE TEST ISSUES — MAY 12, 2026 EVENING
**For next session pickup · Arlin found three blocker-class issues during phone test**

These were found right after the May 12 evening deploy (cumulative branch state through `857c876`). They are unrelated to that deploy — they are pre-existing infrastructure gaps the test surfaced. Arlin went to sleep with them open. She wants real fixes tomorrow, not workarounds.

---

## ISSUE 1 — Email confirmation link points to localhost:3000

**Screenshot:** Image 2 from May 12 evening test. Confirmation email from "Supabase Auth" with body link → `localhost:3000`. Phone browser tried to load `localhost:3000` and returned `ERR_CONNECTION_REFUSED`.

**Diagnosis:** Supabase's default Site URL is `http://localhost:3000` (dev default). The email confirmation template uses `{{ .ConfirmationURL }}` which interpolates the Site URL. Anyone signing up fresh on production gets a confirmation email that points to localhost — they can never confirm.

**This is a Supabase dashboard fix, not a code fix.** Arlin (or anyone with Supabase project owner access) needs to:
1. Go to https://supabase.com/dashboard → Stillform project
2. Authentication → URL Configuration
3. Set Site URL = `https://stillformapp.com`
4. Also verify Redirect URLs include `https://stillformapp.com/*`
5. (Optional but recommended) Authentication → Email Templates → Confirm signup → verify the template uses `{{ .ConfirmationURL }}` correctly

**Severity:** Critical for launch. Every new signup since this config has been broken hits this wall. Arlin hit it tonight because she deleted her account to test signup fresh.

**Code-side: nothing to ship here.** But: master todo entry should reflect that this was caught and that production Supabase auth config is REQUIRED before any user-facing launch.

---

## ISSUE 2 — Delete account does NOT separate from delete data

**Context:** Arlin wanted to clear her local state to test the signup flow from scratch. She used the "delete" affordance in Settings. This blew away her account AND her subscription tie.

**Current state in code:**
- Settings has account deletion that hits a netlify function (`account-delete.js`?) — verify
- There may or may not be a separate "clear local data" / "factory reset" option
- The two need to be separate, and the wording needs to make the distinction loud:
  - **Reset app data** — wipes local storage, keeps account + subscription. Safe to do for fresh testing.
  - **Delete account entirely** — closes the Supabase account + cancels subscription + wipes everything. Irreversible.

**Tomorrow:**
1. Grep for the current delete-account implementation in `src/App.jsx` + `netlify/functions/`
2. Audit what "delete" means today — does it just wipe local? Does it call Supabase? Does it touch Lemon Squeezy?
3. Design the two-option split with a confirmation gate on the destructive one
4. Ship

**Severity:** Real feature gap that just bit Arlin. High priority because if SHE conflated the two as the builder, every test user will too.

---

## ISSUE 3 — Rate limit + restore-purchase recovery is opaque from inside the app

**Screenshot:** Image 1. Subscribe screen showing email + password fields, "Too many attempts right now. Please wait about a minute, then try again." countdown ("Please wait 58s"). Arlin had tried to re-sign up to test the flow.

**Diagnosis (split):**

(a) **Rate limit message itself is fine** — that's Supabase's built-in 4-attempts-per-hour-per-IP. The countdown wait is correct behavior. **No action needed there.**

(b) **The real problem:** Arlin had deleted her account, lost access to her subscription, AND has no in-app path to "restore purchase by email." Lemon Squeezy keeps the subscription record tied to the email regardless of whether the Supabase account exists. We need a "Restore purchase" flow that:
1. User taps "I already paid" or "Restore purchase"
2. Enters their email
3. Backend checks Lemon Squeezy for an active subscription matching that email
4. If found, prompts user to create/sign in with that email and links it back

**Tomorrow:**
1. Check master todo for existing "restore purchase" item (it may already be tracked)
2. Verify Lemon Squeezy customer portal URL pattern (a webhook check + portal redirect may be the lightest implementation)
3. Surface "Restore purchase" prominently on the Subscribe screen — currently it appears nowhere visible from the screenshot
4. Ship the path

**Severity:** Blocks user recovery. Anyone who deletes their account, switches devices, or has a Supabase outage will hit this.

---

## OPERATING NOTES FOR TOMORROW

- Arlin went to sleep at ~9:00 PM her time after these findings. She's depleted. First response tomorrow should be brief and offer her one clear next-step question, not pile all three issues at her.
- She explicitly said she'll respond to my last comment (the cleanup-pass commit summary `cf970eb`) tomorrow. She has unfinished feedback on that. Wait for it before acting on broader voice/cleanup work.
- The Supabase Site URL fix is the highest leverage thing to land first — it's a dashboard click, not a code change, and it unblocks every new signup. Surface it to her early so she or Bobby can flip it.
- Issues 2 and 3 (delete split + restore purchase) are real code work. Scope properly. Do not start the work without her confirming the design.

---

*Logged: May 12, 2026 ~9:05 PM PT*
*Source: 3 screenshots from Arlin's phone test, deployed build at `857c876` on `feat/home-wiring-surface`*
