import { motion } from "motion/react";
import { skyImg } from "../lib/assets";
import { facts, september } from "../content/egginaya";
import { cine, useEscape } from "../lib/hooks";
import { BackToRoom, Placeholder } from "./ui";

/** Through the window. The room falls away and it is just the night and one date. */
export function WindowNight({ onBack }: { onBack: () => void }) {
  useEscape(onBack);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.4, delay, ease: cine },
  });

  return (
    <motion.div
      className="absolute inset-0 z-40 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      transition={{ duration: 1.2, delay: 0.4, ease: cine }}
    >
      <motion.img
        src={skyImg}
        alt=""
        aria-hidden="true"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: "easeOut" }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,11,28,0.25),rgba(6,11,28,0.75))]" />
      <div className="grain" />

      <BackToRoom onClick={onBack} />

      <div className="scroll-area absolute inset-0">
        <div className="mx-auto flex min-h-full max-w-[680px] flex-col items-center justify-center px-7 py-24 text-center">
          <motion.p {...fade(0.8)} className="font-mono text-[11px] uppercase tracking-[0.35em] text-ice/55">
            {facts.togetherDate.month}
          </motion.p>
          <motion.p {...fade(1.1)} className="mt-3 font-display text-[120px] leading-none text-ivory md:text-[168px]">
            {facts.togetherDate.day}
          </motion.p>
          <motion.p {...fade(1.4)} className="mt-1 font-display text-[22px] italic text-ivory/60">
            <Placeholder>{facts.togetherDate.year}</Placeholder>
          </motion.p>

          <motion.p {...fade(2)} className="text-balance mt-12 max-w-[520px] font-display text-[26px] leading-[1.25] text-ivory md:text-[32px]">
            {september.lead}
          </motion.p>
          <motion.p {...fade(2.5)} className="text-balance mt-5 font-display text-[19px] italic leading-snug text-ivory/70 md:text-[21px]">
            {september.after}
          </motion.p>
          <motion.p {...fade(3)} className="mt-8 font-display text-[18px] leading-snug text-ivory/80">
            <Placeholder>{september.placeholder}</Placeholder>
          </motion.p>
          <motion.p {...fade(3.6)} className="mt-14 font-mono text-[11px] tracking-[0.14em] text-ice/40">
            {september.small}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
