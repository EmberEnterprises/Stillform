// src/v2/lib/discoveryEngine.js
//
// DETERMINISTIC DISCOVERY ENGINE (CANON §7.1a step 3; Master Todo keystone,
// step 1). The integrity answer to hallucination: the app must surface true
// patterns the user never named WITHOUT an AI ever "finding" them. So pattern
// detection is ARITHMETIC over the user's own logged discrete tokens
// (signalLog.js) — this module computes candidates; the AI's only job later is
// to VOICE a candidate the USER has confirmed. Nothing here infers, diagnoses,
// or claims causation.
//
// What it finds, over chronological signal entries:
//   • CO-OCCURRENCE — two distinct tokens in the SAME occurrence, ≥ minSupport
//     times. Phrased downstream as "X tends to come with Y" (NEVER "X causes Y").
//   • SEQUENCE / LAG — token A in an earlier occurrence, token B in a later one
//     within lagDays (≥ 1 day apart), ≥ minSupport times, with a median lag.
//     Phrased downstream as "Y tends to follow X by ~D days" (correlation only).
//
// HONEST EMPTY STATE: returns ready:false until there are ≥ minEntries logged
// occurrences — we show nothing rather than force a thin/coincidental pattern.
// SUPPORT THRESHOLD: a candidate needs ≥ minSupport supporting observations.
//
// Pure + deterministic + side-effect-free ⇒ unit-testable on synthetic logs
// with zero accumulated real data. Tokens carry a type ("feel" | "trigger") so
// the surfacing layer can phrase them; the math treats them uniformly.

const DEFAULTS = {
  minEntries: 8, // honest-empty-state floor: no findings before this many occurrences
  minSupport: 3, // a candidate must be observed at least this many times
  lagDays: 4, // sequence window: B counts as "following" A if within this many days
};

/** Tokens for one entry: the feel-state chip + each trigger, typed + keyed. */
function tokensOf(entry) {
  const out = [];
  if (entry && typeof entry.chip === "string" && entry.chip.trim()) {
    const v = entry.chip.trim();
    out.push({ type: "feel", value: v, key: `feel:${v.toLowerCase()}` });
  }
  if (entry && Array.isArray(entry.triggers)) {
    for (const t of entry.triggers) {
      if (typeof t === "string" && t.trim()) {
        const v = t.trim();
        out.push({ type: "trigger", value: v, key: `trigger:${v.toLowerCase()}` });
      }
    }
  }
  // De-dup within an entry by key (a token present twice is still one signal).
  const seen = new Set();
  return out.filter((tok) => (seen.has(tok.key) ? false : (seen.add(tok.key), true)));
}

function entryTime(entry) {
  const t = entry && entry.loggedAt ? new Date(entry.loggedAt).getTime() : NaN;
  return Number.isFinite(t) ? t : null;
}

function dayGap(aMs, bMs) {
  return Math.round((bMs - aMs) / (1000 * 60 * 60 * 24));
}

function median(nums) {
  if (!nums.length) return null;
  const s = nums.slice().sort((x, y) => x - y);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * @param {Array} entries  signal-log entries (any order; sorted here)
 * @param {object} [opts]   { minEntries, minSupport, lagDays }
 * @returns {{ ready: boolean, reason?: string, entryCount: number, candidates: Array }}
 *   candidate (co-occurrence): { kind:"co-occurrence", a:{type,value}, b:{type,value}, support }
 *   candidate (sequence):      { kind:"sequence", from:{type,value}, to:{type,value}, support, medianLagDays }
 *   sorted by support desc (then medianLag asc for sequences).
 */
export function findPatterns(entries, opts = {}) {
  const cfg = { ...DEFAULTS, ...opts };
  const list = Array.isArray(entries) ? entries.filter(Boolean) : [];

  // Chronological order (oldest first) — sequence detection needs time order.
  const sorted = list
    .map((e) => ({ e, t: entryTime(e) }))
    .filter((x) => x.t !== null)
    .sort((x, y) => x.t - y.t)
    .map((x) => x.e);

  if (sorted.length < cfg.minEntries) {
    return {
      ready: false,
      reason: "not_enough_data",
      entryCount: sorted.length,
      candidates: [],
    };
  }

  const tokenList = sorted.map((e) => ({ tokens: tokensOf(e), t: entryTime(e) }));

  // --- CO-OCCURRENCE: distinct token pair within the same entry ---
  // keyed by "min|max" of the two token keys so it's unordered.
  const coMap = new Map(); // pairKey -> { support, a, b }
  for (const { tokens } of tokenList) {
    for (let i = 0; i < tokens.length; i++) {
      for (let j = i + 1; j < tokens.length; j++) {
        const A = tokens[i];
        const B = tokens[j];
        if (A.key === B.key) continue;
        const [lo, hi] = A.key < B.key ? [A, B] : [B, A];
        const pk = `${lo.key}|${hi.key}`;
        const rec = coMap.get(pk) || {
          support: 0,
          a: { type: lo.type, value: lo.value },
          b: { type: hi.type, value: hi.value },
        };
        rec.support += 1;
        coMap.set(pk, rec);
      }
    }
  }

  // --- SEQUENCE / LAG: token A earlier, token B later, within (0, lagDays] ---
  // keyed ordered "fromKey>toKey"; collect lags for median.
  const seqMap = new Map(); // ordKey -> { from, to, lags:[] }
  for (let i = 0; i < tokenList.length; i++) {
    for (let j = i + 1; j < tokenList.length; j++) {
      const gap = dayGap(tokenList[i].t, tokenList[j].t);
      if (gap < 1) continue; // same-day is co-occurrence territory, not sequence
      if (gap > cfg.lagDays) break; // later entries only get further away (sorted) — stop
      for (const A of tokenList[i].tokens) {
        for (const B of tokenList[j].tokens) {
          if (A.key === B.key) continue;
          const ok = `${A.key}>${B.key}`;
          const rec = seqMap.get(ok) || {
            from: { type: A.type, value: A.value },
            to: { type: B.type, value: B.value },
            lags: [],
          };
          rec.lags.push(gap);
          seqMap.set(ok, rec);
        }
      }
    }
  }

  const candidates = [];
  for (const rec of coMap.values()) {
    if (rec.support >= cfg.minSupport) {
      candidates.push({ kind: "co-occurrence", a: rec.a, b: rec.b, support: rec.support });
    }
  }
  for (const rec of seqMap.values()) {
    if (rec.lags.length >= cfg.minSupport) {
      candidates.push({
        kind: "sequence",
        from: rec.from,
        to: rec.to,
        support: rec.lags.length,
        medianLagDays: median(rec.lags),
      });
    }
  }

  candidates.sort((a, b) => {
    if (b.support !== a.support) return b.support - a.support;
    const aLag = a.medianLagDays == null ? Infinity : a.medianLagDays;
    const bLag = b.medianLagDays == null ? Infinity : b.medianLagDays;
    return aLag - bLag;
  });

  return { ready: true, entryCount: sorted.length, candidates };
}

export const DISCOVERY_DEFAULTS = DEFAULTS;
