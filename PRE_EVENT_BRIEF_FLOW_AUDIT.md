# Pre-event Brief — Layer 0.6 Flow Audit

> **STATUS — May 17, 2026.** This audit informed shipped work: **Phases 7a–7d SHIPPED** (backend, frontend helpers, notification update, display screen) per Completed Archive line 450 and Master Todo line 705. **Phase 7e (Trigger Profile match detection) DEFERRED post-launch** per audit recommendation. The architectural rationale (Option A: on-demand at notification tap), science alignment, boundaries, and 8 open-call decisions are preserved as the substantive WHY of the shipped Pre-event Brief.
>
> **⚠️ V1 LINE REF STALE.** §3 Phase 7b describes frontend helpers placed in `src/App.jsx` after `generateTodaysBrief`. That file was deleted in Phase A. Current Pre-event Brief frontend helpers were carried into v2 — walk `src/v2/` for current implementation. If you're reading this audit to understand the WHY of the architecture, the analysis is valid. If you're using it as a code reference, the v1 line ref is the stale one.

**Status:** Pre-build. Audit doc only.
**Spec ground truth:** `STILLFORM_ENGAGEMENT_ARCHITECTURE.md` §3.2 lines 128-130, verbatim:

> #### Pre-event Brief
>
> Same shape as Today's Brief, scoped to a specific calendar trigger. Fires 30 minutes before. User has it on their phone walking into the room.

Build #7 in §10 ship order. Was blocked on Today's Brief architecture being settled (now is — `87ecfdf` shipped 3a-3d end-to-end May 8). Audit philosophy v1.3 requires this surface be settled before any code per Layer 0.6 (audit-before-code).

---

## §1 Ground truth — what already exists

The Pre-event Brief is materially less work than Today's Brief was, because three pieces of infrastructure already ship and are working:

**Calendar events** — `stillform_calendar_events` (read at `App.jsx` ~3549, ~5676, ~18167) is an array of `{title, start, ...}` populated when the user grants calendar consent. Today's Brief already consumes it. Schema is established.

**Calendar consent** — `stillform_calendar_consent` with values `granted` / `revoked` / `pending`. Read via `getIntegrationContext()` (`App.jsx` ~5718). Standard gate for any calendar-driven feature.

**Pre-meeting notifications** — `App.jsx` ~5670-5714 already schedules `LocalNotifications` at 30 minutes (configurable via `PRE_MEETING_NOTIF_FIRST_KEY`) and 15 minutes (`PRE_MEETING_NOTIF_SECOND_KEY`) before each upcoming event. Notif IDs 8800-8803. Current notification body: "Prepare with Stillform — [title] in 30 minutes. Open Reframe to prepare." Tapping routes to Reframe with `extra: { screen: "reframe", eventTitle }`. Toggle-able via `PRE_MEETING_NOTIF_KEY`.

**Today's Brief precedent** — `87ecfdf` ships the full backend pattern (gpt-4o + response_format json_object + 4-key schema validation + 12s timeout + no fallback on failure), the frontend helpers (Capacitor-aware URL, `secureRead`/`secureWrite` storage with per-day replacement, fire-and-forget generation, async polling for arrival), and the operator-tier display treatment. Pre-event Brief inherits these patterns verbatim.

**Trigger Profile** — `formatTriggerProfileForAI(8)` produces a pre-formatted string of named external triggers (people, contexts, kinds of moments) with encounter counts. Today's Brief feeds this to the AI. Pre-event Brief feeds the same — but additionally needs to detect when a calendar event MATCHES a Trigger Profile entry.

**EOD artifact** — `App.jsx` ~3329, parallel pattern. Pre-event Brief is the third surface in this family (EOD + Today's + Pre-event), all sharing the same backend shape.

What does NOT exist:

- No event-keyed storage shape — all existing brief/artifact storage is day-keyed
- No notification-tap → brief-screen route — current pre-meeting notifications route to Reframe
- No surface for browsing pending Pre-event Briefs
- No Trigger Profile match detection — match logic for "does this calendar event reference someone in their Trigger Profile" must be written

---

## §2 Architectural choice (A/B/C)

The structural question: **when does the brief get generated relative to when the user reads it?**

**Option A — On-demand at notification tap.** User receives the existing 30-min pre-meeting notification. Tapping opens the brief screen, which fires `generatePreEventBrief(event)` and shows the in-flight placeholder, then the brief.

- **Pros:** Minimal infrastructure churn — reuses existing notification scheduling. No wasted API calls if event gets cancelled. Brief is fresh at moment-of-use.
- **Cons:** Latency at the moment-of-need (3-12s of "Brief generating…" while the user is walking into the room). Flaky connectivity in the moment.

**Option B — Pre-generated on calendar refresh, cached.** Whenever the calendar fetches new events, immediately generate briefs for any events in the next ~4 hours and persist them. Notification tap reads cached brief instantly.

- **Pros:** Zero latency at notification-tap. Works offline at the moment-of-use. Cleaner UX.
- **Cons:** Wastes API calls if events get cancelled. Cached brief may be stale. More state to manage.

**Option C — Hybrid: pre-generate at the existing notification fire time.** When the 30-min-before notification fires, the app triggers generation. Brief is ready by the time user actually taps.

- **Pros:** Compromise — fresh enough state, fresh enough generation, less wasted compute than B.
- **Cons:** Requires reliable background execution (constrained on iOS especially).

**Audit default: Option A (on-demand at notification tap).** Same operational pattern Today's Brief established (fire-and-forget, async-polling display). Latency is acceptable because the user is already reading the notification — they expect a momentary load. Cancellation safety comes free. Offline failure mode is silent absence (matches Today's Brief audit §6 call 6 default — silent absence beats fallback templates that betray voice rubric). Option B's offline win is real but the state-staleness cost and API-cost-on-cancellation cost together outweigh it. Option C is over-engineered for a feature that should ship in days, not weeks.

---

## §3 Surface set (implementation phases)

Five phases, ship in order:

**7a — Backend: `netlify/functions/pre-event-brief.js`.** Same shape as `todays-brief.js`. Differences:
- Input surface scopes to ONE event: `{ eventTitle, eventStart, eventDescription? }` plus state context (bio-filter, feel-state, signal/bias/trigger profile, recent practice, yesterday's EOD)
- System prompt scoped to "the next 30 minutes" — sections still Hardware / Risks / Moves / Recovery, but Risks names this single event specifically, Moves are if-then for THIS event, Recovery is downregulation FROM this event
- Output schema same 4-key JSON, same per-section 280-char clamp
- Rate limit raised to 10/min per IP (vs 5/min for Today's Brief) — user might trigger multiple briefs per day
- gpt-4o (not 4o-mini) — same as Today's Brief

**7b — Frontend helpers in `src/App.jsx`.** Insert after `generateTodaysBrief`. New constants/helpers:
- `PRE_EVENT_BRIEF_API_URL` (Capacitor-aware)
- `PRE_EVENT_BRIEFS_STORAGE_KEY = "stillform_pre_event_briefs"`
- `PRE_EVENT_BRIEFS_MAX_ITEMS = 60` (~2 weeks of briefs at 4-5/day)
- `getPreEventBriefs()` — newest-first
- `getPreEventBriefForEvent({title, start})` — lookup by `title|start` composite key
- `appendPreEventBrief(record)` — replaces same event-key on re-fire, trims oldest-out
- `buildPreEventBriefPayload(event)` — assembles state context + event details
- `generatePreEventBrief(event)` — fire-and-forget POST, persists on success only

Storage memberships: SECURE_KEYS, SYNC_KEYS, keysToRemove. Voice/copy: parallel to Today's Brief — silent on AI failure.

**7c — Notification body update + route.** Modify the existing pre-meeting notification at `App.jsx` ~5670-5714. Two changes: (a) notification body text references the brief: "Prepare with Stillform — [title] in 30 minutes. Tap for your pre-event brief." (b) `extra` field changes from `{ screen: "reframe", eventTitle }` to `{ screen: "pre-event-brief", eventTitle, eventStart }`. The notification-tap handler needs a new branch for `screen === "pre-event-brief"`.

**7d — Display screen.** New `screen === "pre-event-brief"` branch in `App.jsx`. Renders the operator-tier 4-section card identical to Today's Brief 3d display, with event title + start time as the header. Three render states: present / in-flight (poll for ~12s) / silent-fail. On mount: read `getPreEventBriefForEvent(targetEvent)` — if present, render. If absent, fire `generatePreEventBrief(targetEvent)` and start polling.

**7e — Trigger Profile match detection (DEFERRED per audit default).** Logic to detect when a calendar event matches a Trigger Profile entry. Deferred because: (a) Pre-event Brief works without it — the AI can still draw on Trigger Profile for general context per the existing payload pattern; (b) match logic has its own audit surface (substring match? fuzzy match? embeddings?) that doesn't need to block 7a-7d.

---

## §4 Science alignment (Layer 1.2)

Same locked-science stack as Today's Brief, shifted to event scope:
- **Hardware** — Barrett 2017 constructed-emotion theory: granular bio labeling
- **Risks** — Heider 1958 / Lazarus 1991: anticipatory naming. Naming a forecast pressure REDUCES its capture power
- **Moves** — Gollwitzer 1999 implementation intentions: pre-committing the move halves cognitive cost under load
- **Recovery** — Sheppes & Gross 2011 anticipatory regulation: pre-planning downregulation buys back capacity AFTER the event

Pre-event Brief is anticipatory regulation at higher resolution.

---

## §5 Boundaries

What Pre-event Brief is NOT:
- Not a calendar replacement
- Not a meeting prep tool (no agenda or talking points)
- Not an event-canceller (never tells user to skip / leave early / avoid)
- Not a Reframe replacement
- Not a Move card replacement
- Not a notification spammer (uses existing 30-min-before single-fire pattern)

---

## §6 Open calls for Arlin

Eight architectural decisions, defaults applied per "never override audit defaults" but flagged for override:

1. **Architectural choice (A/B/C).** Audit default: **A (on-demand at notification tap)**.

2. **Which events get briefs.** Audit default: **all upcoming events the existing pre-meeting notification system already covers** — first 4 events from `stillform_calendar_events`.

3. **Display surface.** Audit default: **dedicated screen (`screen === "pre-event-brief"`)** opened by notification tap.

4. **Notification body wording.** Audit default: **"Prepare with Stillform — [title] in 30 minutes. Tap for your pre-event brief."**

5. **Generation timeout.** Audit default: **same 12s as Today's Brief / EOD artifact backend.**

6. **Cache invalidation when event time changes.** Audit default: **append-replaces by event-key (`title|start`)** so rescheduled event gets fresh brief.

7. **First-day / no-Trigger-Profile users.** Audit default: **brief still generates with thin context.**

8. **Plausible telemetry.** Audit default: **`Pre-Event Brief Generated`** (props: `surface`, `eventStart` rounded to hour for privacy).

---

## §7 Build scope

Estimated ~700 lines across 5 commits, load-bearing first:

| Phase | Scope | Lines | Deps |
|-------|-------|-------|------|
| 7a | Backend Netlify function | ~340 | None — copy-and-modify from `todays-brief.js` |
| 7b | Frontend helpers + storage memberships | ~180 | 7a (URL constant) |
| 7c | Notification body + route update | ~30 | Logically depends on 7d existing |
| 7d | Display screen branch | ~140 | 7b (helpers), 7c (route) |
| 7e | Trigger Profile match detection | DEFERRED | Post-launch |

Layer 5 phone gate after 7d: schedule a fake calendar event 32 minutes out, wait for notification, tap it, verify brief screen opens and generates within ~5-8s, verify the four sections read prestige-operator.

---

## §8 Risks + mitigations

**Risk: notification reliability on iOS.** Capacitor `LocalNotifications` already ships and is exercised by the existing pre-meeting flow — risk is bounded by that flow's existing reliability. No new infrastructure.

**Risk: AI-generated content for a specific named person.** Brief may name people from Trigger Profile. Privacy posture same as Today's Brief — data lives in encrypted Trigger Profile, AI sees it via standard payload, no third-party transmission outside the OpenAI API call.

**Risk: brief generates but user never opens the notification.** Audit default A prevents wasted compute — generation happens AT tap, not at notification fire.

**Risk: user has no calendar consent.** Pre-event Brief simply doesn't fire — the existing pre-meeting notification system already gates on consent, this surface inherits that gate.

**Risk: 8c refactor regression on existing pre-meeting notifications.** Phase 7c modifies the same code path. Diff stays minimal (body string + extra field). Phone tap-through on the existing pre-meeting flow before deploying 7c verifies no regression.

---

## §9 What this audit is NOT

This audit does not prescribe the final voice rubric for Pre-event Brief — that lives in the system prompt drafted in 7a. It does not specify a UI mockup for the display screen — that follows Today's Brief's 3d treatment verbatim. It does not commit to the deferred 7e scope — that becomes its own audit when usage data informs match-strategy choice.

This audit settles: when generation fires, where it ships, what storage shape, what notification update, what telemetry. The four phases that follow are direct implementations of these settled decisions.
