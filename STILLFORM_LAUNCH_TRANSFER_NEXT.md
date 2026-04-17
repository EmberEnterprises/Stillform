## Stillform Launch Transfer (Current State)

Last updated from repo state on current `main`.

### Current `main`
- Commit: `d5e1fe4`
- Meaning: current production-ready baseline includes the trust/integrity fixes merged up to PR #35.

---

## What is already merged to `main`

These are already live in the codebase:

1. CI / `rg` portability fix
2. Tutorial -> setup bridge -> calibration cleanup
3. First-run resume behavior (`stillform_first_run_stage`)
4. Home source-order cleanup
5. Cloud Sync truthfulness fix
6. Launch trust hardening
   - UAT mode gating
   - UAT history endpoint auth
   - Reframe endpoint hardening
7. Duplicate Home subscribe CTA removal
8. Nav Subscribe hidden when access is already active
9. Tool back / return-context fixes
10. Main Reframe request identity fix
11. Reframe calibration + positive-state guard
12. Health/composure limitation note
13. Reframe positive-state render-order runtime fix
14. Integration settings truth / Android reminder reliability fix

---

## Open PRs: treat carefully

### Confirmed stale / do not merge
- PR #22 — `Clarify Cloud Sync trust copy and streamline Home fold`
- PR #24 — `Trim Home above-the-fold clutter on main`
- PR #25 — `Enforce strict sequential Home card order`

Reason: these are from older branch lines and were superseded by later merges.

### Open but unverified in this transfer doc
- PR #36 — `Unify setup truth for signed-in users across platforms`
- PR #37 — `Unify back-navigation through shared handlers`
- PR #38 — `Unify screen back actions through shared handler`
- PR #39 — `Correct setup bridge flow identity to setup-bridge screen key`

Recommendation: **do not merge any open PR blindly**. Review against current `main` first, or rebuild from a fresh branch if confidence is low.

---

## Highest-priority unresolved issues

### 1. Product setup truth is still not one truth everywhere
This is the biggest unresolved structural issue.

Current reality:
- Product setup truth is still decided locally with keys like:
  - `stillform_onboarded`
  - `stillform_first_run_stage`
  - local regulation / signal / bias completion state
- Browser and native app can therefore behave like separate installs for the same signed-in user.

What “done” looks like:
- Signed-in users get product-level setup truth from an account-level source
- Tutorial/setup/calibration completion is portable across browser and native
- Device-only states stay local:
  - notifications
  - biometrics
  - calendar/health consent
  - widget/watch/install state

### 2. Tutorial final page and setup bridge may still feel overlapping
Even if the internal screen identity is corrected, the **step purpose** may still overlap:
- tutorial final page
- setup bridge

What “done” looks like:
- Tutorial final page = “what comes next / why calibration matters”
- Setup bridge = “actual setup actions”
- User clearly feels:
  1. tutorial finished
  2. setup actions now
  3. calibration next

### 3. Android integrations are still not actually implemented
The current app is now honest about Android integration availability.
That is good for trust, but if Android launch requires calendar/health:
- honesty is not enough
- actual Android support is still a blocker

Current state:
- Android users no longer see dead “Connect calendar / Connect health” actions as if they work
- Native Android integration bridge is still not implemented in the repo

What “done” looks like:
- either real Android calendar/health support exists
- or Android is not treated as fully launch-ready for those features

### 4. Reframe still needs manual validation
Code-side calibration has improved, but this must still be checked by real use.

Must manually test:
- win / relief input
- real loop / replay input
- normal processing input
- prep / hype input
- shared message / screenshot input

Success criteria:
- no premature negativity
- no forced loop framing
- no buddy-buddy slop
- no “hidden problem” hunting when the user is reporting progress

---

## Recommended next order of work

### If product setup truth is the priority:
1. Fix account-level setup truth for signed-in users
2. De-overlap tutorial final page vs setup bridge
3. Then validate browser/native flow again

### If Android launch completeness is the priority:
1. Decide whether Android integrations are required for launch
2. If yes, implement Android calendar/health support for real
3. If no, keep current honesty patch and avoid claiming full parity

### Always before launch:
1. Manual validation pass
2. Launch/store copy rewrite

---

## Recommended Codex usage (cost-controlled)

### Best model choice
Use the **slowest / most careful Codex mode available**, not the “fast” mode.

Practical recommendation:
- **Do not use high-fast / extra-fast Codex for launch-critical fixes**
- Use the regular / slower / higher-reliability Codex tier instead

Why:
- fewer wandering edits
- fewer partial patches
- better chance of respecting exact flow/state constraints
- lower chance of stale-branch chaos

### What to use Codex for
- one bounded implementation task
- one branch per issue
- one PR per issue

### What not to use Codex for
- broad exploration
- “fix everything”
- prompt pile-on
- multiple unrelated tasks in one branch

---

## Codex operating rules

1. **Always branch from current `main`**
2. **One issue only**
3. **One PR only**
4. **Require pre-edit findings before code changes**
5. **Minimal diff**
6. **No unrelated refactor**
7. **Run verification sequentially**

### Required pre-edit report
Ask Codex to report:
- current state
- exact gap
- minimal implementation plan

before editing.

### Required post-edit report
Ask Codex to report:
- files changed
- exact behavior before vs after
- anything changed outside scope
- build / preflight / smoke / security results
- commit hash
- PR URL

---

## Suggested split between Codex and higher-cost review

To control cost:

### Use Codex for
- implementation
- verification
- PR creation

### Use a stronger reviewer only for
- prompt design
- PR merge / don’t merge decision
- product wording
- differentiation / launch copy

---

## Short handoff summary

If starting fresh with a lower-cost model:

> Work only from current `main`. Treat setup truth across browser/native as the top unresolved structural issue. Do not merge stale PRs (#22, #24, #25). Use one branch per issue, minimal diff, sequential verification, and focus on one source-of-truth problem at a time.

