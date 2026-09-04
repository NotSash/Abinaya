import { motion } from "motion/react";
import { lunchBox } from "../content/egginaya";
import { cine, useEscape } from "../lib/hooks";
import { BackToRoom, Kicker } from "./ui";

export function LunchBox({ onBack }: { onBack: () => void }) {
  useEscape(onBack);

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      transition={{ duration: 1, ease: cine }}
      onClick={onBack}
    >
      <div className="absolute inset-0 bg-night/45" />
      <BackToRoom onClick={onBack} />

      <motion.div
        className="relative w-full max-w-[560px]"
        initial={{ y: 40, scale: 0.94, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1.1, delay: 0.2, ease: cine }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lid */}
        <motion.div
          className="absolute inset-x-0 -top-4 z-20 h-10 origin-top rounded-t-[14px] border border-white/10 bg-[linear-gradient(180deg,#3a4a6e,#22304f)] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
          initial={{ rotateX: 0 }}
          animate={{ rotateX: -112 }}
          transition={{ duration: 1.4, delay: 0.7, ease: cine }}
          style={{ transformPerspective: 900 }}
        >
          <span className="absolute left-1/2 top-1/2 h-2 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15" />
        </motion.div>

        {/* Box */}
        <div className="relative rounded-[14px] border border-white/10 bg-[linear-gradient(180deg,#2b3a5e,#16213d)] p-3 shadow-[0_40px_80px_rgba(0,0,0,0.6)] md:p-4">
          <div className="paper relative max-h-[72vh] overflow-hidden rounded-[6px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]">
            <div className="scroll-area max-h-[72vh] px-6 pb-8 pt-8 md:px-9 md:pb-10 md:pt-10">
              <Kicker className="text-night/50">{lunchBox.kicker}</Kicker>
              <h2 className="mt-3 font-display text-[40px] leading-[1] text-night md:text-[52px]">{lunchBox.heading}</h2>
              <div className="mt-7 space-y-5 text-[15.5px] leading-[1.75] text-night/80 md:text-[16.5px]">
                {lunchBox.lines.map((l, i) => (
                  <motion.p
                    key={l}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 + i * 0.35, ease: cine }}
                  >
                    {l}
                  </motion.p>
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 + lunchBox.lines.length * 0.35 + 0.2, ease: cine }}
                className="hand mt-9 text-[28px] leading-[1.1] text-night/85"
              >
                {lunchBox.sign}
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
