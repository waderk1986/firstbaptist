import { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const hover = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional post-hydration capability check
    if (hover && !reduced) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let rafId = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let dx = tx;
    let dy = ty;
    let rx = tx;
    let ry = ty;
    let seen = false;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!seen) {
        seen = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    };

    const tick = () => {
      dx += (tx - dx) * 0.35;
      dy += (ty - dy) * 0.35;
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9998] size-8 rounded-full opacity-0 transition-opacity duration-300"
        style={{
          border: '1.5px solid rgba(197, 74, 44, 0.55)',
          background: 'rgba(197, 74, 44, 0.06)',
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] size-[7px] rounded-full opacity-0 transition-opacity duration-200"
        style={{
          background: 'var(--color-rust)',
          boxShadow: '0 0 0 1.5px rgba(247,241,227,0.35)',
        }}
      />
    </>
  );
}
