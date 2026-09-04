import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import skyImg from "../assets/sky.jpg";
import { about, envelopeRequires, facts, finalMessage, hotspots, media, type HotspotId } from "../content/egginaya";
import { cine } from "../lib/hooks";
import { cn } from "../utils/cn";
import { BackToRoom, Placeholder, QuietButton } from "./ui";

type Step = "sealed" | "opening" | "about" | "final";

export function Letter({ unlocked, visited, onBack }: { unlocked: boolean; visited: HotspotId[]; onBack: () => void }) {
  const [step, setStep] = useState<Step>("sealed");
  const reduce = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && step === "sealed" && onBack();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack, step]);

  const open = () => {
    if (reduce) return setStep("about");
    setStep("opening");
    setTimeout(() => setStep("about"), 2100);
  };

  const remaining = envelopeRequires.filter((id) => !visited.includes(id)).map((id) => hotspots.find((h) => h.id === id)?.label ?? id);

  return (
    <div className="absolute inset-0 z-40 overflow-hidden">
      {/* The night deepens as the letter comes out. */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: step === "sealed" ? 0 : step === "final" ? 0.35 : 0.8 }}
        transition={{ duration: 2, ease: cine }}
      >
        <img src={skyImg} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,11,28,0.55),rgba(6,11,28,0.85))]" />
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-night"
        initial={{ opacity: 0 }}
        animate={{ opacity: step === "sealed" ? 0 : step === "final" ? 0.92 : 0.55 }}
        transition={{ duration: 2.2, ease: cine }}
      />
      <div className="grain" />

      {(step === "sealed" || step === "about") && <BackToRoom onClick={onBack} />}

      <AnimatePresence mode="wait">
        {(step === "sealed" || step === "opening") && (
          <motion.div
            key="env"
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          >
            <Envelope opening={step === "opening"} locked={!unlocked} />

            <AnimatePresence>
              {step === "sealed" && (
                <motion.div
                  key="under"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, delay: 1.1, ease: cine }}
                  className="mt-10 text-center"
                >
                  {unlocked ? (
                    <>
                      <p className="font-display text-[18px] italic text-ivory/60">for {facts.name}</p>
                      <div className="mt-5">
                        <QuietButton onClick={open}>open it</QuietButton>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="font-display text-[22px] text-ivory/85">Not yet.</p>
                      <p className="mt-2 max-w-[300px] text-[13px] leading-relaxed text-ivory/50">
                        A few things in the room come first.
                        {remaining.length > 0 && <> Still to see: {remaining.join(", ")}.</>}
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {step === "about" && (
          <motion.div
            key="about"
            className="scroll-area absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
            transition={{ duration: 1.4, ease: cine }}
          >
            <About onContinue={() => setStep("final")} />
          </motion.div>
        )}

        {step === "final" && (
          <motion.div
            key="final"
            className="scroll-area absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.4, ease: cine }}
          >
            <Final onBack={onBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Envelope object ---------- */
function Envelope({ opening, locked }: { opening: boolean; locked: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.5, ease: cine }}
      className="relative w-[min(78vw,400px)]"
      style={{ perspective: 1400 }}
      aria-hidden="true"
    >
      <div className="relative aspect-[3/2]" style={{ transformStyle: "preserve-3d" }}>
        {/* back panel */}
        <div className="paper paper-blue absolute inset-0 rounded-[3px]" />

        {/* letter */}
        <motion.div
          className="paper absolute inset-x-[7%] top-[6%] h-[92%] rounded-[2px] px-5 pt-6"
          style={{ zIndex: 2 }}
          initial={{ y: 0 }}
          animate={opening ? { y: "-58%" } : { y: 0 }}
          transition={{ duration: 1.1, delay: 0.7, ease: cine }}
        >
          <div className="h-px w-1/2 bg-navy/25" />
          <div className="mt-3 h-px w-2/3 bg-navy/15" />
          <div className="mt-3 h-px w-1/3 bg-navy/15" />
        </motion.div>

        {/* front pocket */}
        <div
          className="paper paper-blue absolute inset-0 rounded-[3px]"
          style={{
            zIndex: 3,
            clipPath: "polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%)",
            boxShadow: "none",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 3,
            clipPath: "polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%)",
            background: "linear-gradient(180deg, rgba(11,22,48,0.18), rgba(11,22,48,0) 40%)",
          }}
        />

        {/* flap */}
        <motion.div
          className="paper paper-blue absolute inset-x-0 top-0 h-[58%] rounded-[3px]"
          style={{
            zIndex: opening ? 1 : 4,
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            transformOrigin: "50% 0%",
            boxShadow: "none",
            backfaceVisibility: "hidden",
          }}
          initial={{ rotateX: 0 }}
          animate={opening ? { rotateX: -178 } : { rotateX: 0 }}
          transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
        />

        {/* seal */}
        <motion.div
          className="absolute left-1/2 top-[56%] z-[5] grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
          style={{
            background: locked
              ? "radial-gradient(circle at 35% 30%, #34508f, #16285a)"
              : "radial-gradient(circle at 35% 30%, #f6d3a8, #d89a5a)",
            boxShadow: "0 6px 14px -6px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
          animate={opening ? { opacity: 0, scale: 0.6 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className={cn("font-display text-[17px] italic leading-none", locked ? "text-ice/80" : "text-navy/80")}>{locked ? "·" : "A"}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ---------- About Abinaya ---------- */
function About({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="mx-auto min-h-full max-w-[640px] px-7 pb-28 pt-[18vh] md:px-8 md:pt-[22vh]">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: cine }}
        className="font-display text-[30px] leading-tight text-ivory md:text-[38px]"
      >
        {about.intro}
      </motion.p>

      <div className="mt-[14vh] space-y-[12vh] md:mt-[16vh]">
        {about.items.map((it, i) => (
          <motion.section
            key={it.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{ duration: 1.1, delay: i === 0 ? 0.9 : 0.1, ease: cine }}
          >
            <h3 className="font-display text-[34px] leading-[1.05] text-ivory md:text-[44px]">{it.title}</h3>
            <p className="mt-5 max-w-[520px] font-display text-[20px] leading-[1.45] text-ivory/75 md:text-[22px]">
              <Placeholder>{it.body}</Placeholder>
            </p>
          </motion.section>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.6, ease: cine }}
        className="mt-[18vh]"
      >
        <QuietButton onClick={onContinue}>{about.continue}</QuietButton>
      </motion.div>
    </div>
  );
}

/* ---------- Final ---------- */
function Final({ onBack }: { onBack: () => void }) {
  return (
    <div className="mx-auto flex min-h-full max-w-[640px] flex-col justify-center px-7 pb-[max(3rem,env(safe-area-inset-bottom))] pt-[14vh] md:px-8">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6, delay: 0.8, ease: cine }}
        className="whitespace-pre-line font-display text-[24px] leading-[1.45] text-ivory md:text-[28px]"
      >
        <Placeholder>{finalMessage.placeholder}</Placeholder>
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, delay: 2.6, ease: cine }}
        className="mt-[14vh] font-display text-[40px] leading-[1.05] text-ivory md:text-[56px]"
      >
        {finalMessage.sign}
      </motion.h2>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6, delay: 4.2, ease: cine }} className="mt-[12vh]">
        <Song />
      </motion.div>

      <motion.button
        type="button"
        onClick={onBack}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 6, ease: cine }}
        className="mt-[16vh] min-h-11 self-start font-display text-[16px] italic text-ivory/40 transition-colors hover:text-ivory/80"
      >
        back to the room
      </motion.button>
    </div>
  );
}

/* ---------- Song ---------- */
function Song() {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const has = Boolean(media.song);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const onTime = () => setProgress(a.duration ? a.currentTime / a.duration : 0);
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
      a.pause();
    };
  }, []);

  const toggle = async () => {
    const a = ref.current;
    if (!a || !has) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        await a.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  return (
    <div className="max-w-[420px]">
      {has && <audio ref={ref} src={media.song} preload="none" />}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          disabled={!has}
          aria-label={playing ? "Pause" : "Play"}
          className={cn(
            "grid h-12 w-12 shrink-0 place-items-center rounded-full border transition-colors duration-500",
            has ? "border-ivory/40 text-ivory hover:border-ivory" : "border-ivory/15 text-ivory/30"
          )}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <rect x="2" y="1" width="3" height="12" fill="currentColor" />
              <rect x="9" y="1" width="3" height="12" fill="currentColor" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 1.5v11l9-5.5z" fill="currentColor" />
            </svg>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[20px] leading-none text-ivory">{media.songTitle}</p>
          <p className="mt-1.5 text-[12px] text-ivory/45">{has ? finalMessage.songLine : "audio not added yet"}</p>
          <div className="mt-3 h-px w-full bg-ivory/15">
            <div className="h-px bg-ivory/70 transition-[width] duration-500" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
