import { motion } from "motion/react";
import { lunchBox } from "../content/egginaya";
import { cine, useEscape } from "../lib/hooks";
import { BackToRoom, Placeholder } from "./ui";

/** A small memory from school. Reads like a note tucked under the lid. */
export function LunchBox({ onBack }: { onBack: () => void }) {
  useEscape(onBack);

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center overflow-hidden bg-night/80 px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7 } }}
      transition={{ duration: 1, delay: 0.4, ease: cine }}
    >
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_50%_at_50%_45%,rgba(240,183,122,0.12),transparent_70%)]" />
      <div className="grain" />
      <BackToRoom onClick={onBack} />

      <div className="scroll-area max-h-full w-full py-20">
        <motion.div
          initial={{ opacity: 0, y: 24, rotate: -1.5 }}
          animate={{ opacity: 1, y: 0, rotate: -0.8 }}
          transition={{ duration: 1.2, delay: 0.7, ease: cine }}
          className="paper paper-lined mx-auto w-full max-w-[520px] rounded-[2px] px-7 pb-9 pt-8 md:px-10 md:pb-11 md:pt-10"
        >
          <p className="font-mono text-[10px] tracking-[0.2em] text-navy/50">{lunchBox.kicker}</p>
          <h2 className="mt-[14px] font-display text-[40px] leading-[28px] text-navy md:text-[46px]">{lunchBox.heading}</h2>
          <div className="mt-[28px] space-y-[28px]">
            {lunchBox.lines.map((l, i) => (
              <motion.p
                key={l}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.3 + i * 0.35 }}
                className="font-display text-[20px] leading-[28px] text-navy/90"
              >
                {l}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.3 + lunchBox.lines.length * 0.35 }}
              className="font-display text-[20px] leading-[28px] text-navy/80"
            >
              <Placeholder tone="dark">{lunchBox.placeholder}</Placeholder>
            </motion.p>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.6 }}
            className="mt-[28px] font-display text-[18px] italic leading-[28px] text-navy/60"
          >
            {lunchBox.sign}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
