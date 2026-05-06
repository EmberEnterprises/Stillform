# STILLFORM — Test Day Plan (May 7, 2026)

Consolidated test surface from:
1. Eleven commits shipped May 6, 2026 (today's build day)
2. Pre-existing pending validation items
3. Cross-feature regression risk

**Pre-test setup:**
- Confirm latest Netlify deploy is live (auto-publish has been on since LEMON_SQUEEZY_API_KEY env var was set)
- Sign in on phone with founder account agezurian@gmail.com OR a fresh test account for destructive flows
- Have a throwaway test account ready for account deletion test (do NOT delete founder)

---

## A. Today's Builds — Smoke Test Each

### A1. Password reset flow (commit `b4bb394`)
**Test path:** Settings → Sign in card → "Forgot password?" link → enter email → check inbox (and spam) → click recovery link → land on "Set new password" screen → enter password 8+ chars → confirm match → success state → Continue → home screen → sign in with new password.

**Pass signals:**
- Recovery email arrives within ~1 minute
- Recovery link routes to `reset-password` screen, not error
- Show/Hide toggle works on new password field
- Validation triggers on <8 chars and on mismatch
- After reset, signing in with new password works
- Old password no longer works

**Watch for:** Supabase URL Configuration must include `https://stillformapp.com` in Site URL or Redirect URLs allowlist. If recovery link errors out, that's the fix.

### A2. Account deletion flow (commit `42ed650`)
**Test path on THROWAWAY account only:** Sign in → Settings → Account → "Delete account" button → if active subscription, see warning + portal hand-off → confirmation dialog → type DELETE → success alert → sign-in attempt with same email should fail.

**Pass signals:**
- Button is labeled "Delete account" (Apple compliance — not "Delete all data")
- Subscription warning appears for subscribed accounts
- Confirmation dialog explicitly lists what gets deleted
- Type-DELETE confirmation required
- Account no longer signs in after deletion
- Supabase auth.users row deleted (verify in Supabase dashboard)
- `stillform_subscription_state` rows deleted for that user

**Watch for:** if auth deletion fails, user sees real error message with araembersllc@proton.me contact — NOT a fake "success."

### A3. Legal update notification (commit `1d9f638`)
**Test path:** In Settings → developer console (or via temporary code change), set `localStorage.removeItem("stillform_legal_version_accepted")` then reload OR set it to an old value like `"2026-04-01"`. App should surface modal on next mount.

**Pass signals:**
- Modal appears as overlay with backdrop blur
- Title "Updated legal terms"
- Two link buttons open stillformapp.com/terms and stillformapp.com/privacy in new tab
- "Accept and continue" button writes new LEGAL_VERSION to localStorage and dismisses
- Re-launching app does NOT re-surface modal (because version now matches)
- For first-run users (no key set), modal does NOT appear (silently set to current)

### A4. Within-session physiology naming (commit `bc0569e` + `1358025`)
**Test paths:**
- **Breathe + Ground:** complete a Breathe session through to "Composure restored" screen. Confirm the centered text appears: *"You engaged your parasympathetic nervous system through paced breathing and somatic grounding. Practice strengthens the pathway."*
- **Body Scan:** complete a Body Scan session to "What Shifted" screen. Confirm the left-bordered text appears under the existing intro: *"You practiced interoception — the awareness of internal body state. It's a measurable skill that strengthens with reps."*
- **Reframe:** complete a Reframe conversation to "Where are you now?" post-rating screen. Confirm the left-bordered text appears: *"You practiced cognitive reappraisal — the shift from reactive interpretation to deliberate framing. It's a measurable skill that strengthens prefrontal-amygdala regulation."*

**Pass signals:**
- All three lines appear at the right moment
- No layout breaks on small phone screens
- No "just" in any of the new copy
- Tone matches the rest of the surface (deadpan, specific, structural)

### A5. Tutorial metacognition framing line (commit `ada442e`)
**Test path:** Settings → "View tutorial" or trigger tutorial → opening page should now show four lines instead of three:
1. "Most people don't catch themselves until after the moment has passed..."
2. "Stillform trains you to catch it earlier..."
3. **NEW:** "This is instrumentation for self-mastery. Not therapy. Not meditation. Not coaching. A composure system you operate."
4. "Stillform. Composure Architecture."

**Pass signals:** new line is visible, sits between the existing skill framing and brand sign-off.

### A6. Encryption key recovery clarity (commit `bc7cb84`)
**Test paths:**
- **Settings → Cloud Sync (signed in):** click the collapsible "What survives a device change" — content should expand showing privacy guarantee, what survives, what may not, tradeoff, Download My Data path
- **Settings → Cloud Sync (NOT signed in):** the cryptic line is replaced with: "Back up encrypted data from this device. Your data is encrypted before it leaves your device — Stillform cannot read it. If you change devices later, see 'What survives a device change' after signing in."
- **Settings → Privacy & Disclaimers → Your Data section:** new structured paragraph about encryption + tradeoff + Download My Data path
- **FAQ → "What survives if I change phones or reinstall?":** new dedicated entry

**Pass signals:** all four surfaces use the same structured language and reference the Download My Data path.

### A7. Crisis routing entry-context acknowledgment (commit `eb74931`)
**Test paths:**
- **Acute entry (footer link):** tap "Crisis Resources" in footer → screen opens with no acknowledgment block, just the existing "Stillform is a composure tool, not a crisis service" copy. ✓ unchanged for acute users.
- **Pattern entry (Category C nudge):** trigger Category C nudge (sustained-flat or sustained-HAN over 14 days — may need to seed shift_events in localStorage to test) → tap "Crisis resources →" button → crisis screen now shows acknowledgment block ABOVE the existing copy: *"Patterns suggest you've been at sustained flatness [or sustained high activation] for two-plus weeks. That's a real signal worth meeting. These resources are here without pressure."*

**Pass signals:**
- Footer-link entry has NO new block (acute framing only)
- Category C nudge entry has the new block ABOVE the existing protective paragraph
- Existing "not a crisis service" paragraph is UNCHANGED below
- Resources list is UNCHANGED, 988/Crisis Text Line still prominent
- Returning to crisis screen after 60 seconds via footer (not nudge) does NOT show acknowledgment block

### A8. Recognition latency capture (commit `587b4f1`)
**Test path:** complete a metacognition (Self Mode) session. After completion, in dev tools, inspect the most recent session in localStorage `stillform_sessions`. Confirm the new field `recognitionLatencyMs` is present with a positive integer value.

**Pass signals:** field is captured on both `exitPoint: "self-regulated"` and `exitPoint: "autonomous"` paths. Zero user-facing change.

### A9. Filler word + citation cleanup (commits `14971a4` + `901071b`)
**No active testing — these are tone/accuracy cleanups.** If you encounter the affected surfaces during other tests, confirm:
- "What thought fired?" (no "just")
- "or notice it" (no "just")
- "Your body moved through six points" (no "just")
- "where regulation takes hold" (no "actually")
- "cognitive work land" (no "actually")
- Self Mode info modal cites "Hayes, Strosahl & Wilson 2011" (not 1999)

---

## B. Pre-Existing Pending Validation

### B1. Manage Subscription portal (validated May 6 already)
Confirmed working on founder account this morning. Re-verify if anything changed.

### B2. AI 19-scenario regression test
**Status:** has not been run against May 3 prompt rewrite OR May 4 Phase 3 LOW-DEMAND OVERRIDE.
**Run:** `node scripts/run-ai-regression.mjs` against deploy preview. Cost ~$0.05, ~2.5 min.
**Output:** `ai_regression_results.json` — review against pass/fail signals in `AI_REGRESSION_TEST_19.md`.
**Pass gate:** all 19 scenarios pass before TestFlight broad release.

### B3. Phase 3 4-test protocol on phone
**4 tests:**
1. **10 medicated messages** at ≤3 sentences each — verify low-demand override fires correctly
2. **10 clear-control messages** in normal voice — verify no false-positive override
3. **5 medicated + crisis messages** — verify SAFETY OVERRIDE still fires (crisis takes precedence over medicated)
4. **End-to-end on phone** — full session flow including bio-filter + tools

### B4. Body Scan tension persistence
Verify session record has `bodyScanTension` field after a non-low-demand Body Scan with at least one tension dot tapped. (Already validated structurally on May 4 commit 3f148b6 but a phone-side smoke test confirms.)

### B5. Category C nudge end-to-end
Trigger sustained-flat or sustained-HAN pattern → confirm nudge appears on home → tap action button → crisis screen surfaces with new acknowledgment block (this overlaps with A7 above).

---

## C. Cross-Feature Regression Risk

These weren't directly modified today but could be affected:

### C1. Existing "Delete all data" no longer exists
The button is now "Delete account." If anything in the codebase or external docs (FAQ, ToS) references "Delete all data" by name, those references are now stale. Worth a grep at some point — not critical for tomorrow's test.

### C2. Supabase auth user count
After A2 (deletion test on throwaway), confirm Supabase auth.users count decreased by 1.

### C3. Sessions table after Reframe completion
Today's commits added new fields to session records. Confirm:
- `recognitionLatencyMs` on metacognition sessions (new today)
- `bodyScanTension` on Body Scan sessions (May 4, but worth re-verify)
- All other existing session fields still present

### C4. localStorage key explosion check
The new `stillform_legal_version_accepted` key joins the existing set. Confirm `stillform_*` localStorage cleanup on account deletion catches it (the wildcard sweep at end of deletion handler should — verified during build but worth one phone test).

---

## D. NOT Testing Tomorrow (Deferred / Architectural)

- **Subscription state architecture rewrite** — touches production data, requires focused Claude Code session, NOT mid-multitasking
- **Google Voice setup** — your action, not a build/test item
- **Termly ToS phone number swap** — your action in Termly dashboard
- **Termly ToS "suspended" → "charged" fix** — your action in Termly dashboard

---

## Order of Testing (Suggested)

If time-constrained, prioritize in this order:

**Critical (must-pass before TestFlight):**
1. A2 Account deletion (Apple compliance gate)
2. A1 Password reset (TestFlight blocker)
3. B2 AI 19-scenario regression
4. B3 Phase 3 4-test protocol

**High-value smoke tests:**
5. A4 Physiology naming (3 surfaces)
6. A6 Encryption key clarity (4 surfaces)
7. A7 Crisis routing acknowledgment

**Lower-priority:**
8. A3 Legal update modal
9. A5 Tutorial framing line
10. A8 Latency capture (dev-tools only)
11. A9 Cleanup verification (passive)
12. B4–B5 + C2–C4 (regression checks)

---

## Bug Reporting Format

For any issue found, capture:
- Commit affected (from list above) — A1, A2, etc.
- Device + browser/OS
- Steps to reproduce
- Expected vs actual
- Screenshot if visual

Issues that block TestFlight: tag PRIORITY 1.
Issues that don't block but should fix before public launch: PRIORITY 2.
Cosmetic / nice-to-have: PRIORITY 3.
