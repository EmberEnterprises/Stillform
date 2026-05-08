// MoveCardPill — Engagement Architecture Engine 2 Build #8 Phase 8d
// Per MOVE_CARD_FLOW_AUDIT.md §6 call 3 default: option 8d-A — separate
// floating pill alongside Quick Breathe with draggable persistence.
// "Available anywhere" surface for the Move card per spec line 132-134.
//
// Mirrors QBPill (App.jsx ~line 16318) verbatim in drag/clamp/persist
// behavior. Distinct: storage key (stillform_mc_position), label, and
// visual treatment (offset default position so the two pills don't stack
// on first launch). Same touch-action: none, same pointer capture, same
// re-clamp on viewport resize, same threshold-based drag detection.

import { useState, useRef, useEffect } from "react";

export function MoveCardPill({ onPress }) {
  const storageKey = "stillform_mc_position";

  // Clamp helper — matches QBPill clamp shape exactly so saved positions
  // from desktop sessions can't render the pill off-screen on a phone.
  const clamp = (p) => {
    const W = typeof window !== "undefined" ? window.innerWidth : 400;
    const H = typeof window !== "undefined" ? window.innerHeight : 800;
    return {
      x: Math.max(8, Math.min(W - 152, p.x)),
      y: Math.max(60, Math.min(H - 120, p.y))
    };
  };

  const getSavedPos = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved && typeof saved.x === "number" && typeof saved.y === "number") {
        return clamp(saved);
      }
    } catch {}
    // Default: bottom-left so it doesn't stack on top of QB (which defaults
    // bottom-right). User drags either independently after first launch.
    return clamp({ x: 16, y: 80 });
  };

  const [pos, setPos] = useState(getSavedPos);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef(null);
  const posRef = useRef(pos);
  const pointerIdRef = useRef(null);
  const draggedRef = useRef(false);
  posRef.current = pos;

  useEffect(() => {
    const onResize = () => setPos(p => clamp(p));
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    pointerIdRef.current = e.pointerId;
    draggedRef.current = false;
    setDragging(false);
    startRef.current = {
      px: e.clientX - posRef.current.x,
      py: e.clientY - posRef.current.y,
      sx: e.clientX,
      sy: e.clientY
    };
    try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch {}
  };

  const onPointerMove = (e) => {
    if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
    if (!startRef.current) return;
    const moveDistance = Math.hypot(e.clientX - startRef.current.sx, e.clientY - startRef.current.sy);
    if (moveDistance < 6 && !dragging) return;
    if (!dragging) setDragging(true);
    draggedRef.current = true;
    const next = clamp({ x: e.clientX - startRef.current.px, y: e.clientY - startRef.current.py });
    setPos(next);
  };

  const onPointerUp = (e) => {
    if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
    try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch {}
    pointerIdRef.current = null;
    startRef.current = null;
    if (draggedRef.current || dragging) {
      try { localStorage.setItem(storageKey, JSON.stringify(posRef.current)); } catch {}
    } else {
      onPress();
    }
    setDragging(false);
  };

  const onPointerCancel = (e) => {
    if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
    pointerIdRef.current = null;
    startRef.current = null;
    draggedRef.current = false;
    setDragging(false);
  };

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      style={{
        position: "fixed", left: pos.x, top: pos.y, zIndex: 200,
        background: "var(--bg)", border: "1px solid var(--border)",
        borderRadius: 28, padding: "10px 18px", fontSize: 12, letterSpacing: "0.06em",
        color: "var(--text)", cursor: dragging ? "grabbing" : "grab",
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: dragging ? "0 8px 24px rgba(0,0,0,0.5)" : "0 2px 12px rgba(0,0,0,0.3)",
        transition: dragging ? "none" : "box-shadow 0.2s",
        userSelect: "none", WebkitUserSelect: "none",
        transform: dragging ? "scale(1.05)" : "scale(1)",
        touchAction: "none"
      }}
    >
      ◐ Move card
    </div>
  );
}
