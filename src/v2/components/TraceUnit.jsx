import React from "react";

/**
 * TraceUnit — DESIGN SYSTEM D2 (June 2 2026): TIME belongs to the Signal
 * trace. Today rendered as one continuous line; the user's real thread
 * entries are events ON the line.
 *
 * HONESTY CONTRACT: the dots and times are the data (real thread entries).
 * The line is a connector drawn through them — it claims nothing between
 * events. No entries → no trace (an empty day never gets a fabricated line).
 *
 * ACCENT LAW: the line is --sf-live phosphor (live data only — its sole
 * appearance on this screen). Dots are brass. Labels are mono, dim.
 *
 * @param {Array<{time: string, text: string}>} entries — today's thread.
 */
export default function TraceUnit({ entries }) {
  const events = (Array.isArray(entries) ? entries : [])
    .map((e) => {
      const m = /^(\d{1,2}):(\d{2})$/.exec(String(e?.time || "").trim());
      if (!m) return null;
      const h = Number(m[1]) + Number(m[2]) / 60;
      if (!Number.isFinite(h) || h < 0 || h > 24) return null;
      return { h, time: e.time };
    })
    .filter(Boolean)
    .sort((a, b) => a.h - b.h);

  if (events.length === 0) return null;

  // Axis: 06:00 → 22:00, clamped. Geometry: width 380, trace band y 18–52.
  const X0 = 6, X1 = 22, W = 380, PAD = 10;
  const x = (h) => PAD + ((Math.min(Math.max(h, X0), X1) - X0) / (X1 - X0)) * (W - 2 * PAD);
  // Gentle alternating heights so the line reads as a signal, not a chart.
  const ys = [44, 30, 38, 24, 34, 26, 40, 28];
  const pts = events.map((e, i) => ({ x: x(e.h), y: ys[i % ys.length], time: e.time }));

  const now = new Date();
  const nowH = now.getHours() + now.getMinutes() / 60;
  const nowX = x(nowH);

  // Path: lead-in from the left edge, smooth segments through events,
  // tail to "now" (never past it).
  let d = `M${PAD},48 C${PAD + 18},47 ${Math.max(PAD + 24, pts[0].x - 26)},${pts[0].y + 4} ${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const mx = (a.x + b.x) / 2;
    d += ` C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`;
  }
  const last = pts[pts.length - 1];
  if (nowX > last.x + 8) {
    d += ` C${(last.x + nowX) / 2},${last.y} ${(last.x + nowX) / 2},${last.y + 4} ${nowX},${last.y + 3}`;
  }

  return (
    <section
      aria-label="Today's trace — your entries on the day's line"
      style={{
        marginBottom: "var(--sf-space-32)",
        borderTop: "1px solid var(--sf-border-hairline)",
        borderBottom: "1px solid var(--sf-border-hairline)",
        padding: "var(--sf-space-12) 0 var(--sf-space-8)",
      }}
    >
      <svg viewBox={`0 0 ${W} 72`} style={{ width: "100%", display: "block" }} aria-hidden="true">
        <path className="sf-trace-line" d={d} />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3" fill="var(--sf-accent)" />
            <text
              x={Math.min(Math.max(p.x, 16), W - 22)}
              y={p.y - 9}
              textAnchor="middle"
              style={{
                fontFamily: "var(--sf-font-mono)",
                fontSize: "8.5px",
                letterSpacing: "0.08em",
                fill: "var(--sf-text-faint)",
              }}
            >
              {p.time}
            </text>
          </g>
        ))}
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--sf-font-mono)",
          fontSize: "9px",
          letterSpacing: "0.2em",
          color: "var(--sf-text-faint)",
          marginTop: "2px",
        }}
        aria-hidden="true"
      >
        <span>06:00</span>
        <span>22:00</span>
      </div>
    </section>
  );
}
