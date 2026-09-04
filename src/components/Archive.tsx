import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { deskImg } from "../lib/assets";
import { archive, prints, type Print } from "../content/egginaya";
import { cine, useEscape, useIsTouch, useViewport } from "../lib/hooks";
import { cn } from "../utils/cn";
import { BackToRoom, Kicker } from "./ui";

export function Archive({ onBack }: { onBack: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const touch = useIsTouch();
  const { w: vw } = useViewport();
  const narrow = vw < 768;

  const close = () => setPicked(null);
  useEscape(picked ? close : onBack);

  const active = prints.find((p) => p.id === picked) ?? null;

  return (
    <motion.div
      className="absolute inset-0 z-40 overflow-hidden bg-night"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      transition={{ duration: 0.9, ease: cine }}
    >
      <BackToRoom onClick={onBack} />

      {/* Desk */}
      <motion.img
        src={deskImg}
        alt=""
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: cine }}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,transparent_30%,rgba(6,11,28,0.7)_100%)]" />
      <div className="grain" />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: cine }}
        className="pointer-events-none absolute right-5 top-5 z-10 text-right md:right-8 md:top-7"
      >
        <Kicker>{archive.kicker}</Kicker>
        <div className="mt-1 font-display text-[15px] italic text-ivory/70">{touch ? archive.hintTouch : archive.hint}</div>
      </motion.div>

      {/* Prints */}
      {narrow ? (
        <div className="scroll-area absolute inset-0 z-[6] px-4 pb-16 pt-[max(6rem,env(safe-area-inset-top))]">
          <div className="mx-auto grid max-w-[520px] grid-cols-2 gap-x-4 gap-y-8">
            {prints.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.08, ease: cine }}
                className={cn(p.kind === "note" && "col-span-2 mx-auto w-[75%]")}
                style={{ rotate: `${p.tilt}deg` }}
              >
                <PrintCard print={p} onPick={() => setPicked(p.id)} hidden={picked === p.id} />
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-[6]">
          {prints.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 + i * 0.08, ease: cine }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: Math.round(p.w * Math.min(1, vw / 1280)), rotate: `${p.tilt}deg` }}
            >
              <PrintCard print={p} onPick={() => setPicked(p.id)} hidden={picked === p.id} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Picked up */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="lift"
            className="absolute inset-0 z-20 flex items-center justify-center bg-night/70 p-5 backdrop-blur-[3px] md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: active.tilt, y: 30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, rotate: active.tilt, y: 20 }}
              transition={{ duration: 0.8, ease: cine }}
              className="w-full max-w-[420px] md:max-w-[520px]"
              onClick={(e) => e.stopPropagation()}
            >
              <PrintCard print={active} big />
              {active.more && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5, ease: cine }}
                  className="mt-6 text-center font-display text-[20px] italic leading-[1.35] text-ivory/90 md:text-[24px]"
                >
                  {active.more}
                </motion.p>
              )}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={close}
                  className="min-h-11 rounded-full border border-ice/25 px-5 font-mono text-[11px] uppercase tracking-[0.25em] text-ivory/75 transition-colors hover:border-ice/60 hover:text-ivory"
                >
                  {archive.putBack}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------- A single print ---------- */

function PrintCard({ print, onPick, hidden, big }: { print: Print; onPick?: () => void; hidden?: boolean; big?: boolean }) {
  const touch = useIsTouch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Live photos play when picked up (and on hover, on desktop).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (big || playing) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [big, playing]);

  const isLive = !!print.live;

  if (print.kind === "note") {
    return (
      <button
        type="button"
        onClick={onPick}
        disabled={!onPick}
        className={cn(
          "paper block w-full rounded-[2px] p-4 text-left shadow-[0_14px_40px_rgba(0,0,0,0.45)] transition-transform duration-500",
          onPick && "hover:-translate-y-1 hover:rotate-[0.5deg]",
          hidden && "opacity-0"
        )}
      >
        <div className="mx-auto mb-3 h-2 w-2 rounded-full bg-blue shadow-[0_1px_4px_rgba(0,0,0,0.5)]" />
        <div className={cn("font-display italic leading-[1.3] text-night/90", big ? "text-[26px]" : "text-[17px]")}>{print.caption}</div>
        {print.detail && <div className="mt-2 font-mono text-[10.5px] text-night/55">{print.detail}</div>}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onPick}
      disabled={!onPick}
      onPointerEnter={() => !touch && isLive && setPlaying(true)}
      onPointerLeave={() => setPlaying(false)}
      className={cn(
        "block w-full rounded-[2px] bg-[#f7f3ea] p-2.5 pb-3 text-left shadow-[0_18px_50px_rgba(0,0,0,0.5)] transition-transform duration-500",
        onPick && "hover:-translate-y-1.5 hover:rotate-[0.6deg]",
        hidden && "opacity-0"
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#1a2140]">
        {print.src ? (
          <img src={print.src} alt={print.alt ?? print.caption} className="h-full w-full object-cover" draggable={false} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(47,107,255,0.35),rgba(10,19,48,1))] text-center">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ice/50">{archive.missing}</span>
            <span className="font-mono text-[9px] text-ice/35">src/assets/photos/{print.id.replace("p", "0")}.jpg</span>
          </div>
        )}
        {isLive && (
          <>
            <video
              ref={videoRef}
              src={print.live}
              muted
              loop
              playsInline
              preload="metadata"
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                big || playing ? "opacity-100" : "opacity-0"
              )}
            />
            <span className="live-badge absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              <span className="inline-block h-[7px] w-[7px] rounded-full border border-white/90 [box-shadow:inset_0_0_0_1.5px_rgba(0,0,0,0.4)]" />
              {archive.liveHint}
            </span>
          </>
        )}
      </div>
      <div className={cn("mt-2.5 font-display leading-[1.25] text-night/90", big ? "text-[24px]" : "text-[15px]")}>{print.caption}</div>
      {print.detail && <div className={cn("mt-0.5 font-mono text-night/50", big ? "text-[11px]" : "text-[9.5px]")}>{print.detail}</div>}
    </button>
  );
}
