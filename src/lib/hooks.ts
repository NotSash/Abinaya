import { useCallback, useEffect, useState } from "react";
import type { HotspotId } from "../content/egginaya";

const KEY = "egginaya.visited.v1";

/** Which places in the room have been seen. Remembered in the browser. */
export function useVisited() {
  const [visited, setVisited] = useState<HotspotId[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as HotspotId[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(visited));
    } catch {
      /* private mode etc. */
    }
  }, [visited]);

  const mark = useCallback((id: HotspotId) => {
    setVisited((v) => (v.includes(id) ? v : [...v, id]));
  }, []);

  const reset = useCallback(() => setVisited([]), []);

  return { visited, mark, reset };
}

/** Coarse pointer = touch device. */
export function useIsTouch() {
  const [touch, setTouch] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(pointer: coarse)").matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const on = () => setTouch(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return touch;
}

/** Viewport size, updated on resize. */
export function useViewport() {
  const [size, setSize] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 1280,
    h: typeof window !== "undefined" ? window.innerHeight : 800,
  }));
  useEffect(() => {
    const on = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", on);
    window.visualViewport?.addEventListener("resize", on);
    return () => {
      window.removeEventListener("resize", on);
      window.visualViewport?.removeEventListener("resize", on);
    };
  }, []);
  return size;
}

/** Close the current scene on Escape. */
export function useEscape(handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handler();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handler, enabled]);
}

export const cine = [0.16, 1, 0.3, 1] as const;
export const inOut = [0.65, 0, 0.35, 1] as const;
