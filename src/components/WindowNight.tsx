import { useEffect } from "react";
import { motion } from "motion/react";
import skyImg from "../assets/sky.jpg";
import { facts, september } from "../content/egginaya";
import { cine } from "../lib/hooks";
import { BackToRoom, Placeholder } from "./ui";

/** Through the window. The room falls away and it is just the night and one date. */
export function WindowNight({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onBack();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack]);

  return (
    <motion.div
      className="absolute inset-0 z-40 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      transition={{ duration: 1.4, delay: 0.7, ease: cine }}
    >
      <motion.img
        src={skyImg}
        alt=""
        aria-hidden="true"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 9, ease: [0.2, 0.6, 0.3, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,11,28,0.25),transparent_35%,transparent_60%,rgba(6,11,28,0.75))]" />
      <div className="grain" />

      <BackToRoom onClick={onBack} />

      <div className="scroll-area absolute inset-0">
        <div className="flex min-h-full items-end px-6 pb-[max(3rem,env(safe-area-inset-bottom))] pt-28 md:items-center md:px-[10vw] md:pb-24">
          <div className="max-w-[720px]">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5, ease: cine }}
              className="font-display text-[20px] italic text-ice/70 md:text-[24px]"
            >
              {facts.togetherDate.month}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 1.7, ease: cine }}
              className="mt-1 flex items-baseline gap-4 font-display leading-[0.85] text-ivory md:gap-6"
            >
              <span className="text-[38vw] tracking-[-0.03em] md:text-[19vw] lg:text-[240px]">{facts.togetherDate.day}</span>
              <span className="pb-[0.12em] text-[22px] tracking-wide text-ice/55 md:text-[28px]">
                <Placeholder>{facts.togetherDate.year}</Placeholder>
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 2.3, ease: cine }}
              className="mt-8 max-w-[440px] space-y-2 md:mt-12"
            >
              <p className="font-display text-[26px] leading-tight text-ivory md:text-[32px]">{september.lead}</p>
              <p className="font-display text-[26px] leading-tight text-ivory/70 md:text-[32px]">{september.after}</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.1, delay: 3, ease: cine }}
              className="mt-8 max-w-[440px] font-display text-[19px] leading-snug text-ivory/80"
            >
              <Placeholder>{september.placeholder}</Placeholder>
            </motion.p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
