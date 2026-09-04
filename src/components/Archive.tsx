import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { archive, prints, type Print } from "../content/egginaya";
import { deskImg } from "../lib/assets";
import { cine, useEscape, useIsTouch, useViewport } from "../lib/hooks";
import { cn } from "../utils/cn";
import { BackToRoom, Kicker } from "./ui";

export function Archive({ onBack }: { onBack: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const { w: vw, h: vh } = useViewport();
  const touch = useIsTouch();
  const stacked = vw < 720;
  const scale = Math.max(0.72, Math.min(1.1, Math.min(vw / 1280, vh / 800)));

  useEscape(() => (picked ? setPicked(null) : onBack()));

  const current = prints.find((p) => p.id === picked) ?? null;

  return (
    <motion.div
      className="absolute inset-0 z-40 overflow-hidden bg-night"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      transition={{ duration: 1, ease: cine }}
    >
      {/* the desk */}
      <motion.img
        src={deskImg}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: cine }}
      />
      <div className="absolute inset-0 bg-night/35" />
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(70%_60%_at_50%_40%,transparent_40%,rgba(6,11,28,0.7)_100%)]" />
      <div className="grain" />

      <BackToRoom onClick={onBack} />
      <motion.div
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: cine }}
        className="pointer-events-none absolute right-6 top-6 z-30 text-right md:right-8 md:top-8"
      >
        <Kicker>{archive.kicker}</Kicker>
        <p className="mt-2 font-display text-[16px] italic text-ivory/60">{touch ? archive.hintTouch : archive.hint}</p>
      </motion.div>

      {/* prints on the desk */}
      {stacked ? (
        <div className="scroll-area absolute inset-0 pt-[max(5rem,env(safe-area-inset-top))]">
          <div className="mx-auto flex max-w-[420px] flex-col items-center gap-14 px-6 pb-24 pt-8">
            {prints.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: cine }}
                style={{ width: Math.min(p.w * 1.25, vw - 56), rotate: p.tilt / 2 }}
              >
                <PrintCard print={p} onPick={() => setPicked(p.id)} hidden={picked === p.id} />
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="absolute inset-0">
          {prints.map((p, i) => (
            <motion.div
              key={p.id}
              className="absolute"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.w * scale, x: "-50%", y: "-50%" }}
              initial={{ opacity: 0, y: "-46%", rotate: p.tilt - 2 }}
              animate={{ opacity: 1, y: "-50%", rotate: p.tilt }}
              transition={{ duration: 1.1, delay: 0.2 + i * 0.09, ease: cine }}
            >
              <PrintCard print={p} onPick={() => setPicked(p.id)} hidden={picked === p.id} />
            </motion.div>
          ))}
        </div>
      )}

      {/* picked up. Clicking anywhere (the picture included) puts it back. */}
      <AnimatePresence>
        {current && (
          <motion.div
            key="lift"
            className="absolute inset-0 z-50 flex cursor-pointer flex-col items-center justify-center px-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 0.5 }}
            onClick={() => setPicked(null)}
          >
            <div className="absolute inset-0 bg-night/55 backdrop-blur-md" />
            <motion.div
              className="relative flex flex-col items-center"
              initial={{ scale: 0.9, y: 30, rotate: current.tilt }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.92, y: 20, opacity: 0, transition: { duration: 0.4 } }}
              transition={{ duration: 0.9, ease: cine }}
            >
              <PrintCard
                print={current}
                big
                maxW={Math.min(vw - 48, 520)}
                maxH={Math.max(240, vh * (current.more ? 0.56 : 0.72))}
              />
              {current.more && (
                <motion.div
                  initial={{ opacity: 0, y: 12, rotate: -1 }}
                  animate={{ opacity: 1, y: 0, rotate: -1.2 }}
                  transition={{ duration: 0.9, delay: 0.35, ease: cine }}
                  className="sticky-note relative mt-8 w-[min(560px,92vw)] px-7 py-6 text-center shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                >
                  <span className="pushpin pushpin-gold" />
                  <p className="hand text-[24px] leading-[1.35] md:text-[27px]">{current.more}</p>
                </motion.div>
              )}
            </motion.div>

            {/* a quiet note in the corner, not a button: anywhere works */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.8, ease: cine }}
              className="pointer-events-none absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 font-mono text-[10.5px] uppercase tracking-[0.35em] text-ice/60 md:right-8"
            >
              {touch ? archive.putBackTouch : archive.putBack}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

function PrintCard({
  print,
  onPick,
  hidden,
  big,
  maxW,
  maxH,
}: {
  print: Print;
  onPick?: () => void;
  hidden?: boolean;
  big?: boolean;
  maxW?: number;
  maxH?: number;
}) {
  const touch = useIsTouch();
  // width / height of the picture. Portrait 4:5 until the real file tells us otherwise.
  const [aspect, setAspect] = useState(0.8);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isLive = Boolean(print.live);

  const learnAspect = (w: number, h: number) => {
    if (w > 0 && h > 0) setAspect(w / h);
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (big || playing) v.play().catch(() => {});
    else {
      v.pause();
      v.currentTime = 0;
    }
  }, [big, playing]);

  if (print.kind === "note") {
    return (
      <button
        type="button"
        onClick={onPick}
        className={cn(
          "sticky-note relative block w-full px-5 pb-6 pt-6 text-left shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition-transform duration-500",
          onPick && "hover:-translate-y-1.5 hover:rotate-[0.6deg]",
          hidden && "opacity-0",
          big && "w-[min(420px,88vw)] px-7 pb-8 pt-7"
        )}
      >
        <span className={cn("pushpin", print.pin === "red" && "pushpin-red", print.pin === "gold" && "pushpin-gold")} />
        <p className={cn("hand text-[24px] leading-[1.2]", big && "text-[30px]")}>{print.caption}</p>
        {print.detail && <p className={cn("hand mt-2 text-[17px] leading-[1.3] opacity-70", big && "text-[21px]")}>{print.detail}</p>}
      </button>
    );
  }

  // The paper border around the picture, in px. The card is exactly picture + border, never wider.
  const pad = big ? 14 : 12;
  let frameStyle: CSSProperties = { width: "100%", aspectRatio: String(aspect) };
  let cardStyle: CSSProperties = { padding: pad, paddingBottom: pad + 2 };
  if (big && maxW && maxH) {
    const innerMaxW = maxW - pad * 2;
    const w = Math.max(160, Math.min(innerMaxW, maxH * aspect));
    const h = w / aspect;
    frameStyle = { width: w, height: h };
    cardStyle = { ...cardStyle, width: w + pad * 2 };
  }

  return (
    <button
      type="button"
      onClick={onPick}
      onPointerEnter={() => !touch && isLive && setPlaying(true)}
      onPointerLeave={() => setPlaying(false)}
      style={cardStyle}
      className={cn(
        "polaroid relative block w-full rounded-[2px] text-left shadow-[0_18px_50px_rgba(0,0,0,0.5),0_2px_6px_rgba(0,0,0,0.35)] transition-transform duration-500",
        onPick && "hover:-translate-y-1.5 hover:rotate-[0.6deg]",
        hidden && "opacity-0",
        big && "max-w-full"
      )}
    >
      {!big && <span className={cn("pushpin", print.pin === "red" && "pushpin-red", print.pin === "gold" && "pushpin-gold")} />}

      <div style={frameStyle} className="relative w-full overflow-hidden bg-[#1a2140] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]">
        {print.src ? (
          <img
            src={print.src}
            alt={print.alt ?? print.caption}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
            onLoad={(e) => learnAspect(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center [background:radial-gradient(60%_60%_at_50%_40%,rgba(47,107,255,0.35),transparent_70%)]">
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
              onLoadedMetadata={(e) => {
                // If there is no still, the video decides the frame shape.
                if (!print.src) learnAspect(e.currentTarget.videoWidth, e.currentTarget.videoHeight);
              }}
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

      <p className={cn("hand mt-3 text-[24px] leading-[1.1] text-[#1a1a1a]", big && "mt-4 text-[30px]")}>{print.caption}</p>
      {print.detail && (
        <p className={cn("mt-1 font-display text-[14px] italic leading-[1.3] text-[#1a1a1a]/60", big && "text-[16px]")}>{print.detail}</p>
      )}
    </button>
  );
}
