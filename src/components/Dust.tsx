import { useEffect, useRef } from "react";

/** Slow drifting dust motes over the room. Paused when a scene is open. */
export function Dust({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    type Mote = { x: number; y: number; r: number; vx: number; vy: number; a: number; t: number };
    let motes: Mote[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((w * h) / 26000);
      motes = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.6,
        vx: -0.08 + Math.random() * 0.16,
        vy: -0.05 + Math.random() * 0.12,
        a: 0.15 + Math.random() * 0.45,
        t: Math.random() * Math.PI * 2,
      }));
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!activeRef.current) return;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.t += 0.01;
        m.x += m.vx + Math.sin(m.t) * 0.05;
        m.y += m.vy;
        if (m.x < -4) m.x = w + 4;
        if (m.x > w + 4) m.x = -4;
        if (m.y < -4) m.y = h + 4;
        if (m.y > h + 4) m.y = -4;
        const alpha = m.a * (0.6 + 0.4 * Math.sin(m.t * 1.7));
        ctx.beginPath();
        ctx.fillStyle = `rgba(230, 238, 255, ${alpha})`;
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-[4] h-full w-full" />;
}
