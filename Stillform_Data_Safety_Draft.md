# STILLFORM — GOOGLE PLAY DATA SAFETY FORM (DRAFT for Arlin's approval)

Drafted Tuesday 2026-07-14 from the VERIFIED data flow (grep of every fetch() +
the netlify functions + the analytics script). This is a draft to approve/correct,
not a final submission. Each answer cites WHY from the actual code. Re-verify at
submission time — the sync build (Supabase) will change several answers, so submit
this AFTER the account/sync work lands, or submit now and revise.

⚠️ ARLIN DECIDES: several answers depend on decisions not yet locked (does the
Reframe transcript ever get stored server-side once Supabase sync is on? today it
does NOT — read-answer-forget). Answers below reflect the CURRENT build. Flagged
inline where a pending decision changes the answer.

---

## VERIFIED DATA FLOW (what actually leaves the device, per the code)
1. **AI features** (Reframe, active prompts, EOD artifact, pre-event brief,
   mediation) → Netlify functions → model API. The functions are READ-ANSWER-
   FORGET: no database writes found in reframe.js. The text the user chose to send
   is processed in-transit and not persisted server-side in the current build.
2. **Calendar screenshot** (optional, user-initiated) → an extract endpoint;
   sends the image + reference date + timezone offset. User-triggered only.
3. **Auth** (Supabase) → email + auth token, ONLY if the user makes an account.
   Account is not required to use the practice (no-identity-until-sync principle).
4. **Analytics** (Plausible) → anonymous, cookieless; no personal identifiers, no
   cross-site tracking. Aggregate visit/event counts only.
5. **Everything else stays on the device** (localStorage): all practice records,
   Signal Log, Reframe history, Becoming, routines, PIN hash.

---

## DRAFT FORM ANSWERS

**Does your app collect or share required user data?** Yes (limited — see below).

**Data types:**
- **Personal info — Email address:** Collected ONLY if the user creates an account.
  Purpose: account management, app functionality. Not shared. Not required to use
  the app. [Pending: confirm at sync build.]
- **App activity / app interactions:** Collected (analytics). Purpose: analytics.
  Anonymous/aggregate (Plausible, cookieless). Not linked to identity. Not shared
  with third parties for ads.
- **"Health and fitness" / personal reflections the user types:** The user's typed
  entries are processed by the AI when the user chooses to send them, but are NOT
  stored on our servers in the current build (read-answer-forget) and are NOT
  shared. Stored locally on-device. ⚠️ ARLIN: if sync ever persists transcripts
  server-side, this answer changes to "collected," and encryption-in-transit +
  the privacy posture claims must be re-stated. FLAG FOR THE SYNC BUILD.
- **Photos (calendar screenshot):** Processed only when the user initiates the
  calendar-import feature; sent for extraction, not stored, not shared. Optional.

**Is all collected data encrypted in transit?** Yes (HTTPS to all endpoints).
Confirm the extract + function endpoints all enforce TLS at submission.

**Can users request data deletion?** YES — and this is the ONE HARD BUILD still
open: in-app account deletion + a web deletion path (both stores require it).
Do not submit claiming deletion exists until that build ships. [BLOCKED ON
ARLIN'S SUPABASE 2 CLICKS → then Claude builds it.]

**Data collection optional?** Practice works with zero account and zero AI use;
analytics is the only non-optional flow and it is anonymous.

---

## WHAT TO DO WEDNESDAY (2-minute read, then decide)
1. Approve or correct the four data-type answers above.
2. Confirm: does the current build store ANY Reframe transcript server-side?
   (Claude's read says NO — verify you agree before we certify it in the form.)
3. Note the deletion answer is gated on the account-deletion build → your Supabase
   clicks unblock it.
4. Leave the "Health" answer flagged until the sync design is locked — it's the
   one that moves.
EOF
wc -l Stillform_Data_Safety_Draft.md && git add Stillform_Data_Safety_Draft.md && git -c user.name="Arlin" -c user.email="arlin@araembers.com" commit -q -m "DATA SAFETY FORM drafted for Play (Tuesday work, 'Claude drafts / Arlin approves' per the doc) — built from the VERIFIED data flow (every fetch() + functions + analytics script grepped): AI features are read-answer-forget (no server persistence in current build), calendar screenshot user-initiated + not stored, email only on optional account, Plausible anonymous/cookieless, everything else on-device. Flagged the ONE answer that moves at the sync build (server-side transcript persistence) + the deletion answer gated on the account-deletion build (her Supabase clicks). Wednesday = 2-min read-and-approve, not figure-it-out." && git push origin main -q; echo "pushed $(git rev-parse --short HEAD)"