/**
 * demoSeed.js — Arlin's walk tool (2026-07-02: "I'm just not impressed… it's
 * not felt yet" — because her browser held a thin record, and everything this
 * week renders FROM the record). `?seed=demo` fills the browser with a
 * plausible three-month practice so the month-six app can be walked in two
 * minutes: rich Still Form, proof moments firing, full portrait, growth
 * deltas, a season.
 *
 * SAFETY: refuses to run over a real record (>5 sessions) unless `?seed=demo!`
 * (bang = force). Marks itself (stillform_demo_seed) so it never re-runs.
 * Dev/QA tool — same class as ?verify=1.
 */

const DAY = 86400000;
const iso = (daysAgo) => new Date(Date.now() - daysAgo * DAY).toISOString();
const ms = (daysAgo) => Date.now() - daysAgo * DAY;

export function maybeSeedDemo() {
  let params;
  try { params = new URLSearchParams(window.location.search); } catch { return false; }
  const v = params.get("seed");
  if (v !== "demo" && v !== "demo!") return false;
  try {
    if (localStorage.getItem("stillform_demo_seed")) return false;
    const existing = JSON.parse(localStorage.getItem("stillform_v2_sessions") || "[]");
    if (Array.isArray(existing) && existing.length > 5 && v !== "demo!") {
      console.warn("[seed] real record present — use ?seed=demo! to force");
      return false;
    }

    // ~46 sessions across 80 days
    const sessions = Array.from({ length: 46 }, (_, i) => ({
      timestamp: iso(1 + ((i * 1.7) % 80)),
    }));
    localStorage.setItem("stillform_v2_sessions", JSON.stringify(sessions));

    // naming ledger: named states across weeks
    const chips = ["focused", "wired", "flat", "steady", "overloaded", "clear"];
    const entries = Array.from({ length: 34 }, (_, i) => {
      const daysAgo = 1 + ((i * 2.3) % 75);
      const dk = new Date(ms(daysAgo));
      return {
        id: `seed-${i}`,
        chip: chips[i % chips.length],
        triggers: i % 5 === 0 ? ["deadline pressure"] : [],
        body: i % 4 === 0 ? ["jaw tight"] : [],
        beat: "main", mode: null,
        loggedAt: iso(daysAgo),
        dateKey: `${dk.getFullYear()}-${dk.getMonth() + 1}-${dk.getDate()}`,
      };
    });
    localStorage.setItem("stillform_signal_log", JSON.stringify({ entries }));

    // confirmed findings (threads on the form + a proof moment)
    localStorage.setItem("stillform_discovery_findings", JSON.stringify({
      confirmed: [
        { id: "sf1", kind: "co-occurrence", label: "\u201cwired\u201d tends to show up near \u201cshort sleep\u201d", confirmedAt: ms(40) },
        { id: "sf2", kind: "sequence", label: "\u201coverloaded\u201d tends to follow \u201cback-to-back mornings\u201d", confirmedAt: ms(22) },
        { id: "sf3", kind: "co-occurrence", label: "\u201cclear\u201d tends to show up near \u201cmorning practice\u201d", confirmedAt: ms(9) },
      ],
      rejected: [],
    }));

    // prediction errors (a proof moment + the mirror)
    localStorage.setItem("stillform_prediction_errors", JSON.stringify({ entries: [
      { id: "sp1", text: "braced for the investor call going badly", markedAt: ms(30) },
      { id: "sp2", text: "was sure the review would be a fight", markedAt: ms(12) },
    ]}));

    // triggers — one live, one gone quiet (decay + moment)
    localStorage.setItem("stillform_v2_trigger_profile", JSON.stringify({ triggers: [
      { id: "st1", label: "deadline pressure", category: "work", encounterCount: 7, lastSeen: iso(55) },
      { id: "st2", label: "plans changing without warning", category: "life", encounterCount: 5, lastSeen: iso(3) },
    ]}));

    // capacities — two SRIS takes showing growth (delta + season line)
    localStorage.setItem("stillform_capacities_profile", JSON.stringify({ takes: [
      { instrumentId: "sris", takenAt: iso(78), results: { reading: { key: "looping", title: "Reflecting without landing" }, facets: [{ id: "in", label: "Insight", level: "low" }], aiSteer: "reflects-without-resolving" } },
      { instrumentId: "sris", takenAt: iso(6), results: { reading: { key: "integrated", title: "Reflection that lands" }, facets: [{ id: "in", label: "Insight", level: "high" }], aiSteer: null } },
      { instrumentId: "erq", takenAt: iso(50), results: { reading: { key: "reappraises", title: "Reworks the read" }, facets: [], aiSteer: null } },
    ]}));

    // belief work (season: tested/eased/held)
    localStorage.setItem("stillform_belief_ratings", JSON.stringify({ entries: [
      { id: "sb1", thought: "I always fold under pressure", before: 80, after: 35, delta: -45, markedAt: iso(28), usedOtherRead: true },
      { id: "sb2", thought: "they think I'm behind", before: 70, after: 30, delta: -40, markedAt: iso(15) },
      { id: "sb3", thought: "this launch is too big for me", before: 60, after: 65, delta: 5, markedAt: iso(8) },
    ]}));

    // window read (signalProfile producer)
    localStorage.setItem("stillform_window_read", JSON.stringify({ tilt: "revved", earliestSignal: "jaw and shoulders tighten" }));

    localStorage.setItem("stillform_demo_seed", new Date().toISOString());
    console.info("[seed] demo record planted — reload once more to render everything");
    return true;
  } catch (e) {
    console.warn("[seed] failed", e);
    return false;
  }
}
