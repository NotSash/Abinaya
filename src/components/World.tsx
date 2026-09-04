import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { roomImg } from "../lib/assets";
import {
  copy,
  eggIdle,
  eggLines,
  eggLoopFrom,
  envelopeWhisper,
  hotspots,
  type Hotspot,
  type HotspotId,
} from "../content/egginaya";
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
  const [hover, setHover] = useState<HotspotId | null>(null);

  /* ---------- Camera ---------- */
  const room = useMemo(() => {
    // Cover the viewport, and leave a little extra room to look around.
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

  // Desktop: the room turns gently toward the cursor.
  useEffect(() => {
    if (touch || !active) return;
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / vw - 0.5;
      const ny = e.clientY / vh - 0.5;
      clamp(-rangeX / 2 - nx * rangeX * 0.9, -rangeY / 2 - ny * rangeY * 0.9);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [touch, vw, vh, rangeX, rangeY, clamp, active]);

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
    if (Math.abs(dx) + Math.abs(dy) > 6) movedRef.current = true;
    clamp(d.px + dx, d.py + dy);
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  /* ---------- The egg ---------- */
  const [eggIndex, setEggIndex] = useState(-1);
  const [eggLine, setEggLine] = useState<string | null>(null);
  const eggLastRef = useRef(0);
  const eggTimerRef = useRef(0);
  const pokeEgg = () => {
    const now = performance.now();
    if (now - eggLastRef.current < EGG_COOLDOWN) return;
    eggLastRef.current = now;
    const next = eggIndex + 1 >= eggLines.length ? eggLoopFrom : eggIndex + 1;
    setEggIndex(next);
    setEggLine(eggLines[next]);
    window.clearTimeout(eggTimerRef.current);
    eggTimerRef.current = window.setTimeout(() => setEggLine(null), EGG_LINGER);
  };
  useEffect(() => () => window.clearTimeout(eggTimerRef.current), []);

  const handleOpen = (h: Hotspot) => {
    if (movedRef.current) return; // it was a drag, not a tap
    if (h.id === "egg") {
      pokeEgg();
      return;
    }
    onOpen(h.id);
  };

  const whisperFor = (h: Hotspot) => {
    if (h.id === "envelope") return envelopeUnlocked ? envelopeWhisper.open : envelopeWhisper.locked;
    if (h.id === "egg") return eggIndex < 0 ? eggIdle : undefined;
    return h.whisper;
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-night"
      style={{ touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Stage */}
      <motion.div
        className="absolute left-0 top-0 will-change-transform"
        style={{ width: room.w, height: room.h, x: sx, y: sy }}
      >
        <motion.img
          src={roomImg}
          alt=""
          draggable={false}
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth && img.naturalHeight) setAspect(img.naturalWidth / img.naturalHeight);
            setLoaded(true);
          }}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: loaded ? 1 : 0, scale: 1 }}
          transition={{ duration: 2.2, ease: cine }}
          className="absolute inset-0 h-full w-full select-none object-cover"
        />

        {/* If the render hasn't arrived yet, keep the room in the blue. */}
        {!loaded && (
          <div className="absolute inset-0 [background:radial-gradient(60%_50%_at_30%_65%,rgba(47,107,255,0.25),transparent_70%),linear-gradient(180deg,#0a1330,#060b1c)]" />
        )}

        {/* Lamp glow + haze */}
        <div className="lamp-glow pointer-events-none absolute inset-0 [background:radial-gradient(28%_30%_at_26%_58%,rgba(232,201,138,0.22),transparent_70%)]" />
        <div className="haze pointer-events-none absolute inset-0 [background:radial-gradient(50%_40%_at_60%_36%,rgba(47,107,255,0.14),transparent_70%)]" />

        {/* Hotspots */}
        {hotspots.map((h) => {
          const seen = visited.includes(h.id);
          const isEnvelope = h.id === "envelope";
          const locked = isEnvelope && !envelopeUnlocked;
          const whisper = whisperFor(h);
          const showWhisper = hover === h.id || (h.id === "egg" && eggIndex < 0 && active && loaded);
          return (
            <button
              key={h.id}
              type="button"
              aria-label={h.label}
              onClick={() => handleOpen(h)}
              onPointerEnter={() => setHover(h.id)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(h.id)}
              onBlur={() => setHover(null)}
              className={cn(
                "hotspot absolute z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full md:h-14 md:w-14",
                seen && !isEnvelope && "mark-seen",
                h.quiet && "mark-quiet",
                locked && "cursor-not-allowed"
              )}
              style={{ left: `${h.x}%`, top: `${h.y}%`, opacity: active ? 1 : 0, transition: "opacity 0.6s" }}
            >
              {h.marked && (
                <>
                  <span className="mark-ring" />
                  <span className={cn("mark-dot", locked && "bg-gold/80")} />
                </>
              )}

              {/* Egg speech */}
              {h.id === "egg" && (
                <AnimatePresence>
                  {eggLine && (
                    <motion.span
                      key={eggLine + eggIndex}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.5, ease: cine }}
                      className="egg-speech pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 font-display text-[18px] italic text-ivory md:text-[22px]"
                    >
                      {eggLine}
                    </motion.span>
                  )}
                </AnimatePresence>
              )}

              {/* Label + whisper */}
              <AnimatePresence>
                {showWhisper && !eggLine && (
                  <motion.span
                    key="w"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: cine }}
                    className={cn(
                      "pointer-events-none absolute top-full left-1/2 mt-1.5 flex -translate-x-1/2 flex-col items-center whitespace-nowrap text-center",
                      h.x > 75 && "left-auto right-0 translate-x-0 items-end text-right"
                    )}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ivory/70">{h.label}</span>
                    {whisper && (
                      <span className="mt-0.5 font-display text-[15px] italic text-ivory/90 [text-shadow:0_1px_10px_rgba(6,11,28,0.9)] md:text-[17px]">
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

      {/* Vignette + grain + dust */}
      <div className="pointer-events-none absolute inset-0 z-[3] [background:radial-gradient(80%_70%_at_50%_50%,transparent_40%,rgba(6,11,28,0.55)_100%)]" />
      <Dust active={active} />
      <div className="grain" />

      {/* Corner and hint */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="ui"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none absolute inset-0 z-20"
          >
            <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.34em] text-ivory/45 md:left-7 md:top-7">
              {copy.world.corner}
            </div>
            <div className="absolute right-5 top-5 font-mono text-[10px] uppercase tracking-[0.3em] text-ivory/45 md:right-7 md:top-7">
              {visited.length}/{hotspots.filter((h) => h.id !== "egg" && h.id !== "envelope").length} found
            </div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 1.2, ease: cine }}
              className="absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] px-8 text-center font-display text-[16px] italic text-ivory/60 md:text-[19px]"
            >
              {touch ? copy.world.hintTouch : copy.world.hint}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
