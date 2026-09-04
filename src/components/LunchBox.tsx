import { motion } from "motion/react";
import { lunchBox } from "../content/egginaya";
import { cine, useEscape } from "../lib/hooks";
import { BackToRoom, Kicker } from "./ui";

/** The lunch box: a small steel tin, and the memory that lives in it. */
export function LunchBox({ onBack }: { onBack: () => void }) {
  useEscape(onBack);
  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center bg-night/85 px-5 backdrop-blur-[3px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.8, ease: cine }}
      onClick={onBack}
    >
      <BackToRoom onClick={onBack} />
      <div className="grain" />

      <motion.div
        initial={{ opacity: 0, y: 24, rotate: -1.5 }}
        animate={{ opacity: 1, y: 0, rotate: -1.5 }}
        transition={{ duration: 1, delay: 0.2, ease: cine }}
        className="relative w-full max-w-[560px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lid */}
        <div className="absolute -top-3 left-4 right-4 h-6 rounded-t-[10px] bg-[linear-gradient(180deg,#9aa4b8,#5a6478)] shadow-[0_-4px_14px_rgba(0,0,0,0.4)]" />
        {/* Tin */}
        <div className="scroll-area relative max-h-[78vh] rounded-[10px] border border-white/10 bg-[linear-gradient(160deg,#6f7a92,#3d4560_60%,#2b3149)] p-1.5 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
          <div className="paper rounded-[7px] px-6 py-8 md:px-10 md:py-10">
            <Kicker className="text-night/50">{lunchBox.kicker}</Kicker>
            <h2 className="mt-2 font-display text-[40px] leading-none text-night md:text-[52px]">{lunchBox.heading}</h2>
            <div className="mt-6 space-y-4 text-[15px] leading-[1.75] text-night/85 md:text-[16px]">
              {lunchBox.lines.map((l, i) => (
                <motion.p
                  key={l}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.6 + i * 0.35, ease: cine }}
                >
                  {l}
                </motion.p>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 + lunchBox.lines.length * 0.35, ease: cine }}
              className="mt-8 font-display text-[20px] italic text-night/70"
            >
              {lunchBox.sign}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
