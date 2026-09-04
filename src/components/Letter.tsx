import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { skyImg } from "../lib/assets";
import { about, envelopeRequires, facts, finalMessage, hotspots, media, type HotspotId } from "../content/egginaya";
import { cine, useEscape } from "../lib/hooks";
import { cn } from "../utils/cn";
import { BackToRoom, Placeholder, QuietButton, ScrollCue } from "./ui";

type Step = "sealed" | "opening" | "about" | "final";

export function Letter({ unlocked, visited, onBack }: { unlocked: boolean; visited: HotspotId[]; onBack: () => void }) {
  const [step, setStep] = useState<Step>("sealed");
  const reduce = useReducedMotion();

  useEscape(
    useCallback(() => {
      if (step === "sealed") onBack();
    }, [step, onBack])
  );

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
                      <p className="font-display text-[18px] italic text-ivory/60">for {facts.name}. only {facts.name}.</p>
                      <div className="mt-5">
                        <QuietButton onClick={open}>open it</QuietButton>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="font-display text-[22px] text-ivory/85">Not yet.</p>
                      <p className="mt-2 max-w-[320px] text-[13px] leading-relaxed text-ivory/50">
                        I'm saving this one for last. A few things in the room come first.
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
          <ScrollPage key="about" delayCue={1.6}>
            <About onContinue={() => setStep("final")} />
          </ScrollPage>
        )}

        {step === "final" && (
          <ScrollPage key="final" delayCue={2.4}>
            <Final onBack={onBack} />
          </ScrollPage>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- A scrolling page with a cue that vanishes once she scrolls ---------- */
function ScrollPage({ children, delayCue = 1.5 }: { children: React.ReactNode; delayCue?: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [canScroll, setCanScroll] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      transition={{ duration: 1.4, delay: 0.3, ease: cine }}
      onAnimationComplete={() => {
        const el = ref.current;
        if (el) setCanScroll(el.scrollHeight - el.clientHeight > 40);
      }}
    >
      <div
        ref={ref}
        className="scroll-area absolute inset-0"
        onScroll={(e) => {
          if (e.currentTarget.scrollTop > 40) setScrolled(true);
        }}
      >
        {children}
      </div>
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(6,11,28,0.85))]"
        animate={{ opacity: canScroll && !scrolled ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delayCue }} className="absolute inset-0 pointer-events-none">
        <ScrollCue show={canScroll && !scrolled} />
      </motion.div>
    </motion.div>
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
            background: locked ? "radial-gradient(circle at 35% 30%, #34508f, #16285a)" : "radial-gradient(circle at 35% 30%, #f6d3a8, #d89a5a)",
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
    <div className="mx-auto min-h-full max-w-[640px] px-7 pb-32 pt-[18vh] md:px-8 md:pt-[22vh]">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="font-mono text-[11px] tracking-[0.2em] text-ice/45"
      >
        {about.kicker}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.6, ease: cine }}
        className="mt-4 font-display text-[44px] leading-[1.05] text-ivory md:text-[56px]"
      >
        {about.intro}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.2 }}
        className="mt-4 font-display text-[19px] italic text-ivory/55"
      >
        {about.introSub}
      </motion.p>

      <div className="mt-[18vh] space-y-[16vh] md:space-y-[20vh]">
        {about.items.map((it, i) => (
          <motion.section
            key={it.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, delay: i === 0 ? 1.6 : 0.1, ease: cine }}
          >
            <h3 className="text-balance font-display text-[36px] leading-[1.08] text-ivory md:text-[46px]">{it.title}</h3>
            <p className="mt-5 max-w-[540px] font-display text-[20px] leading-[1.45] text-ivory/75 md:text-[22px]">
              <Placeholder>{it.body}</Placeholder>
            </p>
          </motion.section>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.6 }}
        className="mt-[22vh] flex justify-center"
      >
        <QuietButton onClick={onContinue}>{about.continue}</QuietButton>
      </motion.div>
    </div>
  );
}

/* ---------- The final message ---------- */
function Final({ onBack }: { onBack: () => void }) {
  const f = finalMessage;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      void a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.6, delay, ease: cine },
  });

  return (
    <div className="mx-auto min-h-full max-w-[600px] px-7 pb-32 pt-[20vh] md:px-8">
      <motion.h2 {...fade(0.8)} className="font-display text-[46px] leading-[1.02] text-ivory md:text-[60px]">
        {f.greeting}
      </motion.h2>

      <div className="mt-12 space-y-7">
        {f.paragraphs.map((p, i) => (
          <motion.p key={i} {...fade(1.8 + i * 0.5)} className="font-display text-[21px] leading-[1.5] text-ivory/85 md:text-[23px]">
            {p}
          </motion.p>
        ))}
        <motion.p {...fade(1.8 + f.paragraphs.length * 0.5)} className="whitespace-pre-line font-display text-[21px] leading-[1.5] text-ivory/85 md:text-[23px]">
          <Placeholder>{f.placeholder}</Placeholder>
        </motion.p>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.3 }}
        className="text-balance mt-16 font-display text-[28px] italic leading-[1.25] text-ivory md:text-[34px]"
      >
        {f.closing}
      </motion.p>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.6 }} className="mt-12">
        <p className="font-display text-[19px] italic text-ivory/60">{f.signoff}</p>
        <p className="mt-2 font-display text-[26px] text-ivory">
          <Placeholder>{f.name}</Placeholder>
        </p>
      </motion.div>

      {/* The song */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.8 }}
        className="mt-[16vh] border-t border-ivory/12 pt-10"
      >
        <p className="font-mono text-[11px] tracking-[0.2em] text-ice/45">{f.songLine}</p>
        {media.song ? (
          <>
            <audio ref={audioRef} src={media.song} preload="none" onEnded={() => setPlaying(false)} />
            <button type="button" onClick={toggle} className="mt-4 flex min-h-11 items-center gap-4 text-left">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-ivory/40 text-ivory transition-colors hover:border-ivory">
                {playing ? (
                  <span className="flex gap-1">
                    <i className="block h-3.5 w-[3px] bg-current" />
                    <i className="block h-3.5 w-[3px] bg-current" />
                  </span>
                ) : (
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
                    <path d="M1 1.5v11l10-5.5z" />
                  </svg>
                )}
              </span>
              <span>
                <span className="block font-display text-[22px] leading-none text-ivory">{media.songTitle}</span>
                <span className="mt-1.5 block text-[12px] tracking-wide text-ivory/50">{playing ? "playing" : "press play"}</span>
              </span>
            </button>
          </>
        ) : (
          <p className="mt-4 font-display text-[22px] text-ivory/80">
            {media.songTitle}
            <span className="ml-3 text-[15px] italic text-ivory/40">{f.songMissing}</span>
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 1 }}
        className="mt-[14vh] flex flex-col items-center gap-5 text-center"
      >
        <p className="font-display text-[15px] italic text-ivory/45">{f.end}</p>
        <QuietButton onClick={onBack}>back to the room</QuietButton>
      </motion.div>
    </div>
  );
}
