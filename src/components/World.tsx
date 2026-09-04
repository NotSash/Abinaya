import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
const REST_SCALE = 1.06;

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

  /* ---- geometry: draw the picture like object-fit: cover, and keep the marks inside it ---- */
  const iw = nat?.w ?? FALLBACK.w;
  const ih = nat?.h ?? FALLBACK.h;
  const cover = Math.max(vw / iw, vh / ih);
  const dw = iw * cover;
  const dh = ih * cover;
  const left = (vw - dw) / 2;
  const top = (vh - dh) / 2;
  const restScale = touch ? 1 : REST_SCALE;

  /* ---- parallax (mouse) ---- */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 18, mass: 0.8 });
  const sy = useSpring(py, { stiffness: 40, damping: 18, mass: 0.8 });

  useEffect(() => {
    if (touch) return;
    const on = (e: MouseEvent) => {
      if (!active) return;
      const nx = e.clientX / vw - 0.5;
      const ny = e.clientY / vh - 0.5;
      px.set(-nx * 22);
      py.set(-ny * 14);
    };
    window.addEventListener("mousemove", on);
    return () => window.removeEventListener("mousemove", on);
  }, [touch, vw, vh, px, py, active]);

  /* ---- drag (touch): the room is wider than the phone, so let her look around ---- */
  const dragX = useMotionValue(left);
  useEffect(() => {
    if (touch) dragX.set(Math.min(0, Math.max(vw - dw, left)));
  }, [touch, left, vw, dw, dragX]);

  /* ---- camera push-in when something opens ---- */
  const focused = useMemo(() => hotspots.find((h) => h.id === focus) ?? null, [focus]);
  const origin = useMemo(() => {
    if (!focused) return { x: 50, y: 50 };
    const cx = left + (focused.x / 100) * dw;
    const cy = top + (focused.y / 100) * dh;
    const ox = vw / 2 + (cx - vw / 2) * restScale;
    const oy = vh / 2 + (cy - vh / 2) * restScale;
    return { x: (ox / vw) * 100, y: (oy / vh) * 100 };
  }, [focused, left, top, dw, dh, vw, vh, restScale]);

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
    if (h.id === "egg") pokeEgg();
    onOpen(h.id);
  };

  const whisperFor = (h: Hotspot) => {
    if (h.id === "envelope") return envelopeUnlocked ? envelopeWhisper.open : envelopeWhisper.locked;
    if (h.id === "egg") return eggIndex < 0 ? eggIdle : eggLines[eggIndex];
    return h.whisper;
  };

  const found = discoverable.filter((id) => visited.includes(id)).length;

  const planeStyle = touch
    ? { left: 0, top, width: dw, height: dh, x: dragX }
    : { left, top, width: dw, height: dh, x: sx, y: sy, scale: restScale };

  return (
    <div className="absolute inset-0 overflow-hidden bg-night">
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
        <motion.div
          className="absolute will-change-transform"
          style={planeStyle}
          drag={touch ? "x" : false}
          dragConstraints={touch ? { left: Math.min(0, vw - dw), right: 0 } : undefined}
          dragElastic={0.05}
          dragMomentum={false}
        >
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
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 1.6, ease: cine }}
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
                  "hotspot absolute z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2",
                  seen && !isEnvelope && "mark-seen",
                  h.quiet && "mark-quiet",
                  golden && "mark-gold"
                )}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                onMouseEnter={() => setHover(h.id)}
                onMouseLeave={() => setHover((v) => (v === h.id ? null : v))}
                onFocus={() => setHover(h.id)}
                onBlur={() => setHover((v) => (v === h.id ? null : v))}
                onClick={() => handleOpen(h)}
              >
                <span className="mark-ring" />
                <span className="mark-ring mark-ring-2" />
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
        <p className="absolute left-6 top-6 font-mono text-[10.5px] uppercase tracking-[0.38em] text-ice/55 md:left-8 md:top-8">
          {copy.world.corner}
        </p>
        <p className="absolute right-6 top-6 font-mono text-[10.5px] uppercase tracking-[0.38em] text-ice/55 md:right-8 md:top-8">
          {found}/{discoverable.length} found
        </p>
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
