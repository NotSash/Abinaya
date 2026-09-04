import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import roomImg from "../assets/room.jpg";
import { copy, hotspots, type Hotspot, type HotspotId } from "../content/egginaya";
import { cine, useIsTouch, useViewport } from "../lib/hooks";
import { cn } from "../utils/cn";
import { Dust } from "./Dust";

export type WorldPhase = "arrival" | "world" | "focused";

interface Props {
  phase: WorldPhase;
  focus: HotspotId | null;
  visited: HotspotId[];
  envelopeUnlocked: boolean;
  eggLine: string | null;
  onOpen: (id: HotspotId) => void;
}

export function World({ phase, focus, visited, envelopeUnlocked, eggLine, onOpen }: Props) {
  const { w: cw, h: ch } = useViewport();
  const touch = useIsTouch();
  const reduce = useReducedMotion();
  const [aspect, setAspect] = useState(16 / 9);
  const [loaded, setLoaded] = useState(false);

  // Cover geometry
  const stageW = Math.max(cw, ch * aspect);
  const stageH = stageW / aspect;
  const baseY = (ch - stageH) / 2;
  const minX = cw - stageW;

  // Pan (touch) and parallax (pointer)
  const [pan, setPan] = useState<number | null>(null);
  const [par, setPar] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startPan: number; moved: boolean } | null>(null);
  const movedRef = useRef(false);
  const rafRef = useRef(0);

  // Start the camera a little toward the desk on narrow screens so the first view has the lamp in it.
  const panX = useMemo(() => {
    if (pan !== null) return Math.min(0, Math.max(minX, pan));
    const desired = cw / 2 - 0.36 * stageW;
    return Math.min(0, Math.max(minX, desired));
  }, [pan, minX, cw, stageW]);

  useEffect(() => {
    if (touch || reduce) return;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPar({ x: (e.clientX / cw - 0.5) * 2, y: (e.clientY / ch - 0.5) * 2 });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [touch, reduce, cw, ch]);

  // Camera
  const focused = phase === "focused" && focus;
  const target = focused ? hotspots.find((h) => h.id === focus) : undefined;

  let s = 1;
  let tx = panX;
  let ty = baseY;
  if (phase === "arrival") {
    s = 1.1;
    tx = panX - (stageW * 0.1) / 2;
    ty = baseY - (stageH * 0.1) / 2;
  } else if (target && target.zoom > 1) {
    s = target.zoom;
    tx = cw / 2 - (target.x / 100) * stageW * s;
    ty = ch / 2 - (target.y / 100) * stageH * s;
  } else {
    tx = panX + (touch ? 0 : par.x * -14);
    ty = baseY + (touch ? 0 : par.y * -8);
  }

  const filter =
    phase === "arrival"
      ? "brightness(0.32) saturate(0.85) blur(3px)"
      : focused
        ? "brightness(0.55) saturate(0.9) blur(1.5px)"
        : "brightness(1) saturate(1) blur(0px)";

  const transition = dragging
    ? "none"
    : reduce
      ? "none"
      : phase === "arrival" || focused
        ? "transform 1.7s cubic-bezier(0.65,0,0.35,1), filter 1.7s cubic-bezier(0.65,0,0.35,1)"
        : "transform 1.6s cubic-bezier(0.16,1,0.3,1), filter 1.6s cubic-bezier(0.16,1,0.3,1)";

  // Touch drag to look around
  const canDrag = touch && phase === "world" && stageW > cw + 4;
  const onPointerDown = (e: React.PointerEvent) => {
    if (!canDrag) return;
    dragRef.current = { startX: e.clientX, startPan: panX, moved: false };
    movedRef.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      movedRef.current = true;
      setDragging(true);
    }
    if (d.moved) setPan(d.startPan + dx);
  };
  const onPointerUp = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const hintText = touch && stageW > cw + 4 ? copy.world.hintTouch : copy.world.hint;
  const showUI = phase === "world";

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-night select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: canDrag ? "none" : "auto", cursor: canDrag ? (dragging ? "grabbing" : "grab") : "default" }}
    >
      {/* Stage: everything inside moves with the camera */}
      <div
        className="absolute left-0 top-0 will-change-transform"
        style={{
          width: stageW,
          height: stageH,
          transform: `translate3d(${tx}px, ${ty}px, 0) scale(${s})`,
          transformOrigin: "0 0",
          transition,
          filter,
        }}
      >
        <img
          src={roomImg}
          alt="A small room with a desk, a pinboard, a shelf and a very large window opening onto a blue night."
          draggable={false}
          onLoad={(e) => {
            const el = e.currentTarget;
            if (el.naturalWidth && el.naturalHeight) setAspect(el.naturalWidth / el.naturalHeight);
            setLoaded(true);
          }}
          className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms]", loaded ? "opacity-100" : "opacity-0")}
        />

        {/* Light layers. Blended into the render rather than drawn on top of it. */}
        <div
          className="lamp-glow pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background: "radial-gradient(28% 32% at 22% 56%, rgba(240,183,122,0.55), rgba(240,183,122,0.12) 45%, transparent 70%)",
          }}
        />
        <div
          className={cn("pointer-events-none absolute -inset-[6%] mix-blend-screen opacity-60", !reduce && "haze")}
          style={{
            background: "radial-gradient(38% 42% at 60% 40%, rgba(127,163,232,0.22), transparent 70%)",
          }}
        />

        {/* Hotspots */}
        <AnimatePresence>
          {showUI &&
            hotspots.map((h, i) => (
              <HotspotMark
                key={h.id}
                h={h}
                index={i}
                touch={touch}
                visited={visited.includes(h.id)}
                locked={h.id === "envelope" && !envelopeUnlocked}
                eggLine={h.id === "egg" ? eggLine : null}
                onOpen={() => {
                  if (movedRef.current) return;
                  onOpen(h.id);
                }}
              />
            ))}
        </AnimatePresence>
      </div>

      {/* Air */}
      <Dust active={phase !== "arrival" && !focused} />

      {/* Vignette and grain sit on the lens, not in the room */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(6,11,28,0.55) 100%), linear-gradient(180deg, rgba(6,11,28,0.35) 0%, transparent 18%, transparent 80%, rgba(6,11,28,0.55) 100%)",
        }}
      />
      <div className="grain" />

      {/* World chrome: minimal */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            key="chrome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: cine }}
            className="pointer-events-none absolute inset-0"
          >
            <p className="absolute left-5 top-6 font-display text-[15px] italic leading-none text-ivory/55 md:left-8 md:top-7">{copy.world.corner}</p>
            <p className="absolute right-5 top-6 max-w-[42vw] text-right text-[12px] font-normal leading-snug tracking-wide text-ivory/45 md:right-8 md:top-7">
              {hintText}
            </p>

            {/* Places index: a guaranteed path for touch, and a quiet map for everyone. */}
            <nav
              aria-label="Places in the room"
              className="pointer-events-auto absolute inset-x-0 bottom-0 flex flex-wrap justify-center gap-x-6 gap-y-0 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6 md:gap-x-9 md:pb-7"
            >
              {hotspots
                .filter((h) => !h.quiet)
                .map((h) => {
                  const seen = visited.includes(h.id);
                  const locked = h.id === "envelope" && !envelopeUnlocked;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => onOpen(h.id)}
                      className={cn(
                        "group flex min-h-11 items-center gap-2 font-display text-[16px] italic transition-colors duration-500 md:text-[17px]",
                        locked ? "text-ivory/35" : seen ? "text-ivory/55 hover:text-ivory/90" : "text-ivory/85 hover:text-ivory"
                      )}
                    >
                      <span
                        className={cn(
                          "block h-[5px] w-[5px] rounded-full transition-colors duration-500",
                          seen ? "bg-blue" : locked ? "bg-ivory/20" : "bg-ivory/70"
                        )}
                      />
                      {h.label}
                    </button>
                  );
                })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HotspotMark({
  h,
  index,
  touch,
  visited,
  locked,
  eggLine,
  onOpen,
}: {
  h: Hotspot;
  index: number;
  touch: boolean;
  visited: boolean;
  locked: boolean;
  eggLine: string | null;
  onOpen: () => void;
}) {
  const [hover, setHover] = useState(false);
  const whisper = h.id === "envelope" ? (locked ? "not yet" : "open it") : h.whisper;
  const showLabel = !h.quiet && (touch || hover || visited === false);
  const flipLabel = h.x > 70; // keep labels inside the frame on the right side

  return (
    <motion.button
      type="button"
      aria-label={h.label}
      onClick={onOpen}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.9, delay: 0.5 + index * 0.08, ease: cine }}
      className={cn("hotspot absolute z-10 -translate-x-1/2 -translate-y-1/2 outline-offset-8", h.quiet && "opacity-90")}
      style={{ left: `${h.x}%`, top: `${h.y}%` }}
    >
      <span className={cn("mark", visited && "mark-visited", h.quiet && "mark-quiet")}>
        <span className="mark-ring" />
        <span className="mark-dot" />
      </span>

      {/* Label */}
      <span
        className={cn(
          "pointer-events-none absolute top-1/2 flex -translate-y-1/2 flex-col whitespace-nowrap text-left transition-opacity duration-500",
          flipLabel ? "right-full items-end pr-1 text-right" : "left-full pl-1",
          showLabel || (h.quiet && hover) ? "opacity-100" : "opacity-0"
        )}
      >
        <span className="font-display text-[17px] italic leading-none text-ivory drop-shadow-[0_1px_8px_rgba(6,11,28,0.9)]">{h.label}</span>
        {whisper && (
          <span
            className={cn(
              "mt-1 text-[11px] font-normal tracking-wide text-ivory/60 transition-opacity duration-500 drop-shadow-[0_1px_6px_rgba(6,11,28,0.9)]",
              hover ? "opacity-100" : "opacity-0"
            )}
          >
            {whisper}
          </span>
        )}
      </span>

      {/* The egg speaks, briefly */}
      <AnimatePresence>
        {eggLine && (
          <motion.span
            key={eggLine}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: cine }}
            className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 whitespace-nowrap pr-2 font-display text-[18px] italic text-ivory drop-shadow-[0_1px_8px_rgba(6,11,28,0.9)]"
          >
            {eggLine}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
