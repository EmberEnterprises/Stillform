import React, { useState, useRef, useEffect, useCallback } from "react";
import MonoLabel from "./MonoLabel.jsx";

/**
 * QuickBreathe — the ONE persistent surface across home beats (CANON §10/§271
 * stabilization safety valve).
 *
 * June 23 2026 (Arlin): restored to a real PILL and made DRAGGABLE with
 * position memory, per the v7 home mockup. This intentionally reverses the
 * June-2 "D5" ruled-tag treatment ("speaks the system, not a rounded pill")
 * in favour of Arlin's mockup direction. The user can drag it anywhere; its
 * position is remembered (stillform_qb_pos, prefix-conforming so it rides the
 * existing wipe/sync) and re-clamped into view on resize. A drag is told from
 * a tap by a small movement threshold, so dragging never opens the breathe
 * overlay and a clean tap always does. Keyboard (Enter/Space) opens it too.
 *
 * Amber stays ≤5%: a 4px dot only. The ring is a neutral hairline.
 */
const POS_KEY = "stillform_qb_pos";
const MARGIN = 16; // viewport inset (px)
const DRAG_THRESHOLD = 5; // px before a press counts as a drag

function loadPos() {
  try {
    const raw = localStorage.getItem(POS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (typeof p?.x === "number" && typeof p?.y === "number") return p;
  } catch {
    /* ignore */
  }
  return null;
}

export default function QuickBreathe({ onTap, onOpenInfo }) {
  const btnRef = useRef(null);
  const [pos, setPos] = useState(null); // {x,y} left/top px; null until measured
  const posRef = useRef(null);
  const drag = useRef({ active: false, moved: false, dx: 0, dy: 0, sx: 0, sy: 0 });

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  const clamp = useCallback((x, y) => {
    const el = btnRef.current;
    const w = el ? el.offsetWidth : 140;
    const h = el ? el.offsetHeight : 40;
    const maxX = window.innerWidth - w - MARGIN;
    const maxY = window.innerHeight - h - MARGIN;
    return {
      x: Math.max(MARGIN, Math.min(x, Math.max(MARGIN, maxX))),
      y: Math.max(MARGIN, Math.min(y, Math.max(MARGIN, maxY))),
    };
  }, []);

  // Initial position: saved, else bottom-right. Measured after mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = btnRef.current;
    const w = el ? el.offsetWidth : 140;
    const h = el ? el.offsetHeight : 40;
    const saved = loadPos();
    setPos(
      saved
        ? clamp(saved.x, saved.y)
        : { x: window.innerWidth - w - MARGIN, y: window.innerHeight - h - MARGIN }
    );
  }, [clamp]);

  // Re-clamp on resize so it never strands off-screen.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setPos((p) => (p ? clamp(p.x, p.y) : p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clamp]);

  const fireTap = () => {
    if (typeof onTap === "function") onTap();
  };

  const onPointerDown = (e) => {
    const el = btnRef.current;
    if (!el || posRef.current == null) return;
    drag.current = {
      active: true,
      moved: false,
      dx: e.clientX - posRef.current.x,
      dy: e.clientY - posRef.current.y,
      sx: e.clientX,
      sy: e.clientY,
    };
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    if (
      Math.abs(e.clientX - drag.current.sx) > DRAG_THRESHOLD ||
      Math.abs(e.clientY - drag.current.sy) > DRAG_THRESHOLD
    ) {
      drag.current.moved = true;
    }
    setPos(clamp(e.clientX - drag.current.dx, e.clientY - drag.current.dy));
  };

  const onPointerUp = (e) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const el = btnRef.current;
    try {
      el && el.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    if (drag.current.moved) {
      const p = posRef.current;
      if (p) {
        try {
          localStorage.setItem(POS_KEY, JSON.stringify(p));
        } catch {
          /* ignore */
        }
      }
    } else {
      fireTap(); // clean tap → open
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fireTap();
    }
  };

  const placement = pos
    ? { left: `${pos.x}px`, top: `${pos.y}px` }
    : { right: `${MARGIN}px`, bottom: `${MARGIN}px` };

  return (
    <>
    <button
      ref={btnRef}
      type="button"
      aria-label="Quick Breathe"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={onKeyDown}
      style={{
        position: "fixed",
        ...placement,
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--sf-space-8)",
        padding: "10px 16px",
        background: "var(--sf-ground-elev)",
        border: "1px solid var(--sf-border-hairline)",
        borderRadius: "999px",
        cursor: "grab",
        touchAction: "none",
        appearance: "none",
        boxShadow: "none",
        WebkitTapHighlightColor: "transparent",
        transition: "border-color var(--sf-motion-default) var(--sf-ease-prestige)",
        zIndex: 10,
        userSelect: "none",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: "var(--sf-accent)",
          display: "inline-block",
        }}
      />
      <MonoLabel size="sm" tone="primary" as="span">
        Quick Breathe
      </MonoLabel>
    </button>
    {/* The info affordance (Arlin's design 2026-07-08): a small \u24D8 riding
        the pill — how it works + the duration being entirely the user's.
        Own tap handler; never triggers the pill's drag/open. */}
    {typeof onOpenInfo === "function" && pos && (
      <button
        type="button"
        aria-label="About Quick Breathe"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onOpenInfo(); }}
        style={{
          position: "fixed",
          left: `${pos.x - 12}px`,
          top: `${pos.y - 12}px`,
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: "var(--sf-ground-elev)",
          border: "1px solid var(--sf-border-hairline)",
          color: "var(--sf-text-faint)",
          fontFamily: "var(--sf-font-serif)",
          fontStyle: "italic",
          fontSize: "13px",
          lineHeight: 1,
          cursor: "pointer",
          zIndex: 11,
          WebkitTapHighlightColor: "transparent",
          padding: 0,
        }}
      >
        i
      </button>
    )}
    </>
  );
}
