import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * A few slow motes in the lamp light. Cheap: ~28 particles, DPR capped at 1.5,
 * stops entirely when the scene is not the room or the tab is hidden.
 */
export function Dust({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduce || !active) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const N = 28;
    const p = Array.from({ length: N }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.00006,
      vy: -0.00002 - Math.random() * 0.00004,
      a: 0.15 + Math.random() * 0.35,
      ph: Math.random() * Math.PI * 2,
    }));

    let last = performance.now();
    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(50, now - last);
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (const m of p) {
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.ph += dt * 0.0006;
        if (m.y < -0.02) m.y = 1.02;
        if (m.x < -0.02) m.x = 1.02;
        if (m.x > 1.02) m.x = -0.02;
        // brighter toward the lamp side (left-lower)
        const warm = Math.max(0, 1 - Math.hypot(m.x - 0.25, m.y - 0.6) * 1.6);
        const alpha = m.a * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(m.ph))) * (0.35 + warm);
        ctx.beginPath();
        ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${warm > 0.4 ? "240,200,150" : "217,230,255"},${alpha.toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
      ctx.clearRect(0, 0, w, h);
    };
  }, [active, reduce]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
