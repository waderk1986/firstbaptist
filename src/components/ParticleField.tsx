import { useEffect, useRef } from 'react';

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
};

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const particles: P[] = [];
    const count = reduced ? 40 : 90;
    let mx = 0.5;
    let my = 0.5;
    let rafId = 0;
    let visible = true;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const spawn = (): P => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: rand(-0.08, 0.08),
      vy: rand(-0.12, -0.02),
      r: rand(0.4, 1.6),
      life: rand(0, 1),
    });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.length === 0) {
        for (let i = 0; i < count; i++) particles.push(spawn());
      }
    };

    const step = () => {
      if (!visible) {
        rafId = requestAnimationFrame(step);
        return;
      }
      ctx.clearRect(0, 0, w, h);

      // faint warm wash
      const g = ctx.createRadialGradient(
        w * mx,
        h * my,
        0,
        w * mx,
        h * my,
        Math.max(w, h) * 0.55
      );
      g.addColorStop(0, 'rgba(197, 74, 44, 0.06)');
      g.addColorStop(1, 'rgba(197, 74, 44, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.0035;

        // gentle mouse repulsion
        const dx = p.x - w * mx;
        const dy = p.y - h * my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22000) {
          const f = (22000 - d2) / 22000;
          p.x += (dx / Math.sqrt(d2 + 1)) * f * 0.6;
          p.y += (dy / Math.sqrt(d2 + 1)) * f * 0.6;
        }

        if (p.y < -4 || p.x < -4 || p.x > w + 4 || p.life > 1) {
          particles[i] = spawn();
          particles[i].y = h + 4;
          particles[i].life = 0;
          continue;
        }

        const alpha = Math.sin(p.life * Math.PI) * 0.55;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247, 241, 227, ${alpha})`;
        ctx.fill();
      }

      // ember trails — rust-tinted
      for (let i = 0; i < particles.length; i += 4) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 106, 72, ${Math.sin(p.life * Math.PI) * 0.22})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = (e.clientX - rect.left) / rect.width;
      my = (e.clientY - rect.top) / rect.height;
    };

    const onVis = () => {
      visible = !document.hidden;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    document.addEventListener('visibilitychange', onVis);
    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
