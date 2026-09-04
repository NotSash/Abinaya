import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { roomImg } from "../lib/assets";
import { copy, eggLines, eggLoopFrom, envelopeWhisper, hotspots, type Hotspot, type HotspotId } from "../content/egginaya";
import { cine, useIsTouch, useViewport } from "../lib/hooks";
import { cn } from "../utils/cn";
import { Dust } from "./Dust";

const EGG_COOLDOWN = 650; // ms between pokes that register
const EGG_LINGER = 2600; // ms a line stays before fading

export function World({
  visited,
  envelopeUnlocked,
  active,
  onOpen,
}: {
  visited: HotspotId[];
  envelopeUnlocked: boolean;
  /** false while a scene is open on top: hides UI and pauses dust */
  active: boolean;
  onOpen: (id: HotspotId) => void;
}) {
  const touch = useIsTouch();
  const { w: vw, h: vh } = useViewport();
  const [aspect, setAspect] = useState(16 / 9);
  const [loaded, setLoaded] = useState(false);
  const [zoomTo, setZoomTo] = useState<Hotspot | null>(null);

  /* ---------- Camera ---------- */
  const room = useMemo(() => {
    // Cover the viewport, and leave a little extra room to look around on desktop.
    const extra = touch ? 1.18 : 1.1;
    let w = vw * extra;
    let h = w / aspect;
    if (h < vh * extra) {
      h = vh * extra;
      w = h * aspect;
    }
    return { w, h };
  }, [vw, vh, aspect, touch]);

  const rangeX = Math.max(0, room.w - vw);
  const rangeY = Math.max(0, room.h - vh);

  const panX = useMotionValue(-rangeX / 2);
  const panY = useMotionValue(-rangeY / 2);
  const sx = useSpring(panX, { stiffness: 40, damping: 18, mass: 1.2 });
  const sy = useSpring(panY, { stiffness: 40, damping: 18, mass: 1.2 });

  useEffect(() => {
    panX.set(-rangeX / 2);
    panY.set(-rangeY / 2);
  }, [rangeX, rangeY, panX, panY]);

  const clamp = useCallback(
    (x: number, y: number) => {
      panX.set(Math.min(0, Math.max(-rangeX, x)));
      panY.set(Math.min(0, Math.max(-rangeY, y)));
    },
    [panX, panY, rangeX, rangeY]
  );

  // Desktop: the room turns gently toward the cursor.
  useEffect(() => {
    if (touch || zoomTo) return;
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / vw - 0.5;
      const ny = e.clientY / vh - 0.5;
      clamp(-rangeX / 2 - nx * rangeX * 0.9, -rangeY / 2 - ny * rangeY * 0.9);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [touch, vw, vh, rangeX, rangeY, clamp, zoomTo]);

  // Touch: drag to turn.
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const movedRef = useRef(false);
  const onPointerDown = (e: React.PointerEvent) => {
    if (!touch) return;
    dragRef.current = { x: e.clientX, y: e.clientY, px: panX.get(), py: panY.get() };
    movedRef.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.hypot(dx, dy) > 6) movedRef.current = true;
    clamp(d.px + dx, d.py + dy);
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  /* ---------- The egg speaks: one line at a time ---------- */
  const [egg, setEgg] = useState<{ tick: number; line: string } | null>(null);
  const eggIndex = useRef(0);
  const eggLast = useRef(0);
  const eggTimer = useRef<number | null>(null);

  const pokeEgg = useCallback(() => {
    const now = performance.now();
    if (now - eggLast.current < EGG_COOLDOWN) return; // ignore machine-gun taps
    eggLast.current = now;

    const i = eggIndex.current;
    const line = eggLines[i];
    eggIndex.current = i + 1 >= eggLines.length ? eggLoopFrom : i + 1;

    setEgg({ tick: now, line });
    if (eggTimer.current) window.clearTimeout(eggTimer.current);
    eggTimer.current = window.setTimeout(() => setEgg(null), EGG_LINGER);
  }, []);

  useEffect(() => () => {
    if (eggTimer.current) window.clearTimeout(eggTimer.current);
  }, []);

  /* ---------- Opening something ---------- */
  const open = (h: Hotspot) => {
    if (movedRef.current) return;
    if (h.id === "egg") return pokeEgg();
    if (zoomTo) return;
    setZoomTo(h);
    window.setTimeout(() => onOpen(h.id), 780);
  };

  useEffect(() => {
    if (active) setZoomTo(null);
  }, [active]);

  const showUI = loaded && active && !zoomTo;
  const hintText = touch ? copy.world.hintTouch : copy.world.hint;

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-night select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: "none" }}
    >
      {/* The room */}
      <motion.div
        className="absolute left-0 top-0 will-change-transform"
        style={{
          width: room.w,
          height: room.h,
          x: sx,
          y: sy,
          transformOrigin: zoomTo ? `${zoomTo.x}% ${zoomTo.y}%` : "50% 50%",
        }}
        animate={{ scale: zoomTo ? zoomTo.zoom : 1, filter: zoomTo ? "brightness(0.55) blur(2px)" : "brightness(1) blur(0px)" }}
        transition={{ duration: 1.1, ease: cine }}
      >
        <img
          src={roomImg}
          alt=""
          aria-hidden="true"
          draggable={false}
          onLoad={(e) => {
            const el = e.currentTarget;
            if (el.naturalWidth && el.naturalHeight) setAspect(el.naturalWidth / el.naturalHeight);
            setLoaded(true);
          }}
          className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms]", loaded ? "opacity-100" : "opacity-0")}
        />

        {/* Light layers. Blended into the render rather than drawn on top of it. */}
        <div className="lamp-glow pointer-events-none absolute inset-0 mix-blend-soft-light [background:radial-gradient(38%_42%_at_22%_58%,rgba(240,183,122,0.75),transparent_70%)]" />
        <div className="haze pointer-events-none absolute -inset-[6%] mix-blend-screen opacity-30 [background:radial-gradient(50%_40%_at_60%_36%,rgba(127,163,232,0.35),transparent_70%)]" />

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
                eggLine={h.id === "egg" ? egg : null}
                onOpen={() => open(h)}
              />
            ))}
        </AnimatePresence>
      </motion.div>

      {/* Air */}
      <Dust active={active && loaded} />

      {/* Vignette and grain sit on the lens, not in the room */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_100%_at_50%_50%,transparent_45%,rgba(6,11,28,0.7)_100%)]" />
      <div className="grain" />

      {/* World chrome: minimal */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            key="chrome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="pointer-events-none absolute inset-0 z-20"
          >
            <p className="absolute left-[max(1.25rem,env(safe-area-inset-left))] top-[max(1.25rem,env(safe-area-inset-top))] font-display text-[15px] italic text-ivory/55">
              {copy.world.corner}
            </p>
            <p className="absolute right-[max(1.25rem,env(safe-area-inset-right))] top-[max(1.25rem,env(safe-area-inset-top))] max-w-[240px] text-right text-[12.5px] leading-relaxed tracking-wide text-ivory/50 md:max-w-[300px]">
              {hintText}
            </p>

            {/* Places index: a guaranteed path for touch, and a quiet map for everyone. */}
            <nav
              aria-label="Places in the room"
              className="pointer-events-auto absolute inset-x-0 bottom-[max(1.1rem,env(safe-area-inset-bottom))] flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6"
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
                      onClick={() => open(h)}
                      className={cn(
                        "flex min-h-9 items-center gap-2 font-display text-[15px] italic transition-colors",
                        seen ? "text-blue/70 hover:text-blue" : "text-ivory/70 hover:text-ivory",
                        locked && "text-ivory/40"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-1.5 w-1.5 rounded-full",
                          seen ? "bg-blue/80" : locked ? "bg-ivory/30" : "bg-ivory shadow-[0_0_10px_rgba(217,230,255,0.7)]"
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
  eggLine: { tick: number; line: string } | null;
  onOpen: () => void;
}) {
  const [hover, setHover] = useState(false);
  const whisper = h.id === "envelope" ? (locked ? envelopeWhisper.locked : envelopeWhisper.open) : h.whisper;
  const showLabel = touch || hover || (!visited && !h.quiet);
  const flipLabel = h.x > 70; // keep labels inside the frame on the right side
  const talking = h.id === "egg" && !!eggLine;

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
      className={cn("hotspot absolute z-10 -translate-x-1/2 -translate-y-1/2 outline-offset-8")}
      style={{ left: `${h.x}%`, top: `${h.y}%` }}
    >
      <span className={cn("mark", visited && "mark-visited", h.quiet && "mark-quiet")}>
        <span className="mark-ring" />
        <span className="mark-dot" />
      </span>

      {/* Label: hidden while the egg is talking so the two never collide */}
      <AnimatePresence>
        {showLabel && !talking && (
          <motion.span
            key="label"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.5, ease: cine }}
            className={cn(
              "pointer-events-none absolute top-1/2 flex -translate-y-1/2 flex-col whitespace-nowrap",
              flipLabel ? "right-full mr-1 items-end text-right" : "left-full ml-1 items-start text-left"
            )}
          >
            <span className="font-display text-[19px] italic leading-none text-ivory drop-shadow-[0_1px_8px_rgba(6,11,28,0.9)]">{h.label}</span>
            {whisper && <span className="mt-1.5 text-[11.5px] tracking-wide text-ivory/55 drop-shadow-[0_1px_6px_rgba(6,11,28,0.9)]">{whisper}</span>}
          </motion.span>
        )}
      </AnimatePresence>

      {/* The egg speaks, one line at a time. `mode="wait"` means the old line is gone before the new one arrives. */}
      <AnimatePresence mode="wait">
        {eggLine && (
          <motion.span
            key={eggLine.tick}
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(4px)", transition: { duration: 0.22 } }}
            transition={{ duration: 0.45, ease: cine }}
            className={cn(
              "egg-speech pointer-events-none absolute top-1/2 -translate-y-1/2 font-display text-[19px] italic leading-none text-ivory",
              flipLabel ? "right-full mr-1 text-right" : "left-full ml-1 text-left"
            )}
          >
            {eggLine.line}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
