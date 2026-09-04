import { useEffect, useRef } from "react";

/** Slow drifting dust motes over the room. Paused when a scene is open. */
export function Dust({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const count = window.innerWidth < 640 ? 34 : 64;
    const motes = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 0.00006,
      vy: -0.00002 - Math.random() * 0.00005,
      a: 0.15 + Math.random() * 0.45,
      p: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(50, now - last);
      last = now;
      if (!activeRef.current) return;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        if (!reduce) {
          m.x += m.vx * dt + Math.sin(now / 4000 + m.p) * 0.00002;
          m.y += m.vy * dt;
          if (m.y < -0.02) {
            m.y = 1.02;
            m.x = Math.random();
          }
          if (m.x < -0.02) m.x = 1.02;
          if (m.x > 1.02) m.x = -0.02;
        }
        const tw = 0.6 + 0.4 * Math.sin(now / 1800 + m.p * 3);
        ctx.beginPath();
        ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 234, 255, ${m.a * tw})`;
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-[4] h-full w-full" />;
}
