import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import {
  copy,
  discoverable,
  eggIdle,
  eggLines,
  eggLoopFrom,
  envelopeWhisper,
  hotspots,
  type Hotspot,
  type HotspotId,
} from "../content/egginaya";
import { roomImg } from "../lib/assets";
import { cine, useIsTouch, useViewport } from "../lib/hooks";
import { cn } from "../utils/cn";
import { Dust } from "./Dust";

interface WorldProps {
  visited: HotspotId[];
  envelopeUnlocked: boolean;
  /** true when no scene is open on top */
  active: boolean;
  /** which place the camera is pushed into, if any */
  focus: HotspotId | null;
  onOpen: (id: HotspotId) => void;
}

const FALLBACK = { w: 1920, h: 1080 };

export function World({ visited, envelopeUnlocked, active, focus, onOpen }: WorldProps) {
  const { w: vw, h: vh } = useViewport();
  const touch = useIsTouch();
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [hover, setHover] = useState<HotspotId | null>(null);

  // the egg
  const [eggIndex, setEggIndex] = useState(-1);
  const [eggTalking, setEggTalking] = useState(false);
  const eggTimer = useRef(0);

  /* ---- geometry ----
   * The picture is drawn like object-fit: cover, then a little larger still, so there is
   * room to look around: up to the top of the window, down to the desk, and side to side.
   * Everything inside the plane is positioned in percentages of the picture, so the marks
   * always sit on the things they point at. */
  const iw = nat?.w ?? FALLBACK.w;
  const ih = nat?.h ?? FALLBACK.h;
  const extra = touch ? 1.18 : 1.12;
  const cover = Math.max(vw / iw, vh / ih) * extra;
  const dw = iw * cover;
  const dh = ih * cover;
  const rangeX = Math.max(0, dw - vw);
  const rangeY = Math.max(0, dh - vh);

  /* ---- camera pan ---- */
  const panX = useMotionValue(-rangeX / 2);
  const panY = useMotionValue(-rangeY / 2);
  const sx = useSpring(panX, { stiffness: 40, damping: 18, mass: 1.2 });
  const sy = useSpring(panY, { stiffness: 40, damping: 18, mass: 1.2 });

  useEffect(() => {
    // Portrait phones: start a touch left so the desk (laptop + envelope) is in the first view.
    const startX = touch && vw < vh ? -rangeX * 0.3 : -rangeX / 2;
    panX.set(startX);
    panY.set(-rangeY / 2);
  }, [rangeX, rangeY, panX, panY, touch, vw, vh]);

  const clamp = useCallback(
    (x: number, y: number) => {
      panX.set(Math.min(0, Math.max(-rangeX, x)));
      panY.set(Math.min(0, Math.max(-rangeY, y)));
    },
    [panX, panY, rangeX, rangeY]
  );

  // Desktop: the room turns gently toward the cursor, all the way to its edges.
  useEffect(() => {
    if (touch) return;
    const onMove = (e: PointerEvent) => {
      if (!active) return;
      const nx = e.clientX / vw - 0.5;
      const ny = e.clientY / vh - 0.5;
      clamp(-rangeX / 2 - nx * rangeX * 0.95, -rangeY / 2 - ny * rangeY * 0.95);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [touch, vw, vh, rangeX, rangeY, clamp, active]);

  // Touch: drag to look around.
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const movedRef = useRef(false);
  const onPointerDown = (e: ReactPointerEvent) => {
    if (!touch || !active) return;
    dragRef.current = { x: e.clientX, y: e.clientY, px: panX.get(), py: panY.get() };
    movedRef.current = false;
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 6) movedRef.current = true;
    clamp(d.px + dx, d.py + dy);
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  /* ---- camera push-in when something opens ---- */
  const focused = useMemo(() => hotspots.find((h) => h.id === focus) ?? null, [focus]);
  const origin = useMemo(() => {
    if (!focused) return { x: 50, y: 50 };
    const cx = sx.get() + (focused.x / 100) * dw;
    const cy = sy.get() + (focused.y / 100) * dh;
    const x = Math.min(100, Math.max(0, (cx / vw) * 100));
    const y = Math.min(100, Math.max(0, (cy / vh) * 100));
    return { x, y };
  }, [focused, dw, dh, vw, vh, sx, sy]);

  /* ---- the egg talks ---- */
  const pokeEgg = useCallback(() => {
    setEggIndex((i) => {
      if (i < 0) return 0;
      const next = i + 1;
      return next >= eggLines.length ? eggLoopFrom : next;
    });
    setEggTalking(true);
    window.clearTimeout(eggTimer.current);
    eggTimer.current = window.setTimeout(() => setEggTalking(false), 3200);
  }, []);
  useEffect(() => () => window.clearTimeout(eggTimer.current), []);

  const handleOpen = (h: Hotspot) => {
    if (movedRef.current) return; // it was a drag, not a tap
    if (h.id === "egg") pokeEgg();
    onOpen(h.id);
  };

  const whisperFor = (h: Hotspot) => {
    if (h.id === "envelope") return envelopeUnlocked ? envelopeWhisper.open : envelopeWhisper.locked;
    if (h.id === "egg") return eggIndex < 0 ? eggIdle : eggLines[eggIndex];
    return h.whisper;
  };

  const found = discoverable.filter((id) => visited.includes(id)).length;

  return (
    <div
      className={cn("absolute inset-0 select-none overflow-hidden bg-night", touch && "touch-none")}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* camera */}
      <motion.div
        className="absolute inset-0"
        style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
        animate={{
          scale: focused && !active ? focused.zoom : 1,
          filter: active ? "blur(0px) brightness(1)" : "blur(14px) brightness(0.55)",
        }}
        transition={{ duration: 1.4, ease: cine }}
      >
        {/* image plane. Everything inside is positioned in percentages of the picture. */}
        <motion.div className="absolute left-0 top-0 will-change-transform" style={{ x: sx, y: sy, width: dw, height: dh }}>
          {/* if the render can't be fetched, the room is still a room */}
          <div className="absolute inset-0 [background:radial-gradient(40%_50%_at_58%_38%,rgba(70,110,200,0.45),transparent_70%),radial-gradient(30%_35%_at_26%_60%,rgba(232,201,138,0.25),transparent_70%),linear-gradient(180deg,#0b1636_0%,#0a1330_55%,#141a2a_100%)]" />
          <motion.img
            src={roomImg}
            alt="A blue room at night: a desk, a lamp, a laptop, a pinboard and a window with the moon in it."
            draggable={false}
            onError={() => setLoaded(true)}
            onLoad={(e) => {
              const el = e.currentTarget;
              setNat({ w: el.naturalWidth || FALLBACK.w, h: el.naturalHeight || FALLBACK.h });
              setLoaded(true);
            }}
            className="absolute inset-0 h-full w-full select-none object-cover"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: loaded ? 1 : 0, scale: 1 }}
            transition={{ duration: 2.2, ease: cine }}
          />

          {/* warm light from the lamp */}
          <div className="lamp-glow pointer-events-none absolute inset-0 [background:radial-gradient(28%_30%_at_26%_58%,rgba(232,201,138,0.22),transparent_70%)]" />
          {/* cold light from the window */}
          <div className="haze pointer-events-none absolute inset-0 [background:radial-gradient(30%_40%_at_58%_35%,rgba(120,160,255,0.14),transparent_70%)]" />

          {/* Hotspots */}
          {hotspots.map((h) => {
            const seen = visited.includes(h.id);
            const isEnvelope = h.id === "envelope";
            const golden = isEnvelope && envelopeUnlocked;
            const whisper = whisperFor(h);
            const showLabel =
              active && loaded && (hover === h.id || (h.id === "egg" && (eggIndex < 0 || eggTalking)));
            const side = h.side ?? "below";
            return (
              <button
                key={h.id}
                type="button"
                aria-label={h.label}
                className={cn(
                  "hotspot absolute z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full",
                  seen && !isEnvelope && "mark-seen",
                  h.quiet && "mark-quiet",
                  golden && "mark-gold"
                )}
                style={{ left: `${h.x}%`, top: `${h.y}%`, opacity: active && loaded ? 1 : 0, transition: "opacity 0.8s" }}
                onMouseEnter={() => setHover(h.id)}
                onMouseLeave={() => setHover((v) => (v === h.id ? null : v))}
                onFocus={() => setHover(h.id)}
                onBlur={() => setHover((v) => (v === h.id ? null : v))}
                onClick={() => handleOpen(h)}
              >
                <span className="mark-ring" />
                <span className="mark-dot" />

                <AnimatePresence>
                  {showLabel && (
                    <motion.span
                      key={h.id === "egg" ? `egg-${eggIndex}` : h.id}
                      initial={{ opacity: 0, y: side === "below" ? -4 : 0, x: side === "right" ? -6 : side === "left" ? 6 : 0 }}
                      animate={{ opacity: 1, y: 0, x: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.35 } }}
                      transition={{ duration: 0.6, ease: cine }}
                      className={cn(
                        "mark-label pointer-events-none absolute flex flex-col gap-1.5 whitespace-nowrap",
                        side === "below" && "left-1/2 top-full mt-3 -translate-x-1/2 items-center text-center",
                        side === "right" && "left-full top-1/2 ml-3 -translate-y-1/2 items-start text-left",
                        side === "left" && "right-full top-1/2 mr-3 -translate-y-1/2 items-end text-right"
                      )}
                    >
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.36em] text-ice">{h.label}</span>
                      {whisper && (
                        <span className={cn("font-display text-[18px] italic leading-none text-ivory", h.id === "egg" && "egg-speech")}>
                          {whisper}
                        </span>
                      )}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </motion.div>
      </motion.div>

      {/* vignette + grain + dust */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(80%_70%_at_50%_45%,transparent_55%,rgba(6,11,28,0.55)_100%)]" />
      <div className="grain" />
      <Dust active={active} />

      {/* corners */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20"
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.8, ease: cine }}
      >
        <motion.p
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: cine }}
          className="absolute left-6 top-6 font-mono text-[10.5px] uppercase tracking-[0.38em] text-ice/55 md:left-8 md:top-8"
        >
          {copy.world.corner}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: cine }}
          className="absolute right-6 top-6 font-mono text-[10.5px] uppercase tracking-[0.38em] text-ice/55 md:right-8 md:top-8"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={found}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.5, ease: cine }}
              className="inline-block"
            >
              {found}
            </motion.span>
          </AnimatePresence>
          /{discoverable.length} found
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 8 }}
          transition={{ duration: 1.4, delay: 0.8, ease: cine }}
          className="absolute bottom-[max(1.75rem,env(safe-area-inset-bottom))] left-1/2 w-[92%] -translate-x-1/2 text-center font-display text-[17px] italic text-ivory/70 md:text-[19px]"
        >
          {touch ? copy.world.hintTouch : copy.world.hint}
        </motion.p>
      </motion.div>
    </div>
  );
}
