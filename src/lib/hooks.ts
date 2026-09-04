import { useCallback, useEffect, useState } from "react";
import type { HotspotId } from "../content/egginaya";

const KEY = "egginaya.visited.v1";

export function useVisited() {
  const [visited, setVisited] = useState<HotspotId[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as HotspotId[]) : [];
    } catch {
      return [];
    }
  });

  const mark = useCallback((id: HotspotId) => {
    setVisited((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* private mode etc. */
      }
      return next;
    });
  }, []);

  return { visited, mark };
}

export function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return touch;
}

export function useViewport() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setSize({ w: window.innerWidth, h: window.innerHeight }));
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);
  return size;
}

export const cine = [0.16, 1, 0.3, 1] as const;
export const inOut = [0.65, 0, 0.35, 1] as const;
